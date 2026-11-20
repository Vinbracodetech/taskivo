import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const GAMES = [
  { id: 'candy-crush-glass', name: 'Candy Crush Glass', levels: 140, storeUrl: '' },
  { id: 'glass-puzzle-zen', name: 'Glass Puzzle Zen', levels: 200, storeUrl: '' },
];
const milestones = (levels) => [
  { key: 0, label: 'Install & first launch', points: 50 },
  ...Array.from({ length: levels / 10 }, (_, i) => ({
    key: (i + 1) * 10,
    label: `Reach level ${(i + 1) * 10}`,
    points: i === 0 ? 80 : i === 1 ? 100 : 150 + (i - 2) * 50,
  })),
];
const S = {
  page: { maxWidth: 1100, margin: '0 auto', padding: '32px 5%', color: 'var(--ink)' },
  card: { border: '1px solid var(--line)', borderRadius: 18, background: 'var(--surface-card)', padding: 22, marginBottom: 16 },
  button: { border: 0, borderRadius: 10, padding: '10px 16px', background: 'var(--lime)', color: '#000', fontWeight: 800, cursor: 'pointer' },
  muted: { color: 'var(--slate)', fontSize: 13 },
};

export default function PlayEarn({ user, navigate }) {
  const [game, setGame] = useState(GAMES[0]);
  const [submissions, setSubmissions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [file, setFile] = useState(null);
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [adminRows, setAdminRows] = useState([]);
  const isAdmin = user?.role === 'admin';

  async function refresh() {
    if (!user?.id) return;
    const { data, error } = await supabase.from('game_proofs')
      .select('id,game_id,milestone,status,reward_points,created_at,review_note')
      .eq('user_id', user.id).order('created_at', { ascending: false });
    if (error) setMessage(error.message);
    else setSubmissions(data || []);
  }
  async function refreshAdmin() {
    if (!isAdmin) return;
    const { data, error } = await supabase.from('game_proofs')
      .select('id,user_id,game_id,milestone,reward_points,status,proof_path,created_at,notes')
      .eq('status', 'pending').order('created_at', { ascending: true }).limit(100);
    if (error) setMessage(error.message);
    else {
      const rows = await Promise.all((data || []).map(async row => {
        const { data: signed } = await supabase.storage.from('game-proofs').createSignedUrl(row.proof_path, 120);
        return { ...row, signedUrl: signed?.signedUrl || null };
      }));
      setAdminRows(rows);
    }
  }
  useEffect(() => { refresh(); if (isAdmin) refreshAdmin(); }, [user?.id, isAdmin]);

  async function submit(e) {
    e.preventDefault();
    if (!selected || !file || !user?.id) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setMessage('Upload a PNG, JPEG or WebP screenshot of 5 MB or less.'); return;
    }
    setBusy(true); setMessage('');
    const path = `${user.id}/${crypto.randomUUID()}.${file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'}`;
    try {
      const upload = await supabase.storage.from('game-proofs').upload(path, file, { contentType: file.type, upsert: false });
      if (upload.error) throw upload.error;
      const result = await supabase.rpc('submit_game_proof', {
        p_game_id: game.id, p_milestone: selected.key, p_proof_path: path, p_notes: notes.trim().slice(0, 500),
      });
      if (result.error) {
        await supabase.storage.from('game-proofs').remove([path]);
        throw result.error;
      }
      setMessage('Screenshot submitted. Your reward is pending admin review; payouts are currently disabled.');
      setFile(null); setSelected(null); setNotes('');
      await refresh();
    } catch (err) { setMessage(err.message || 'Submission failed'); }
    finally { setBusy(false); }
  }

  async function review(row, approve) {
    setBusy(true); setMessage('');
    const reason = approve ? null : window.prompt('Reason for rejection (required):');
    if (!approve && !reason?.trim()) { setBusy(false); return; }
    const { error } = await supabase.rpc('review_game_proof', {
      p_proof_id: row.id, p_approve: approve, p_review_note: reason,
    });
    setBusy(false);
    if (error) setMessage(error.message);
    else { setMessage(approve ? 'Verified. No points credited (payouts disabled).' : 'Rejected. User can resubmit.'); await refreshAdmin(); await refresh(); }
  }

  const current = submissions.filter(s => s.game_id === game.id);
  const currentFor = key => current.find(s => s.milestone === key);
  return <div style={S.page}>
    <button style={{ ...S.button, background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--line)' }} onClick={() => navigate('tasks')}>← Tasks</button>
    <h1 style={{ fontSize: 32, marginBottom: 8 }}>🎮 Play & Earn</h1>
    <p style={S.muted}>Upload screenshots to verify game milestones. Admin review is required. Cash-convertible rewards are NOT active.</p>
    {message && <div role="status" style={{ ...S.card, borderColor: 'var(--lime)' }}>{message}</div>}
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', margin: '20px 0' }}>
      {GAMES.map(g => <button key={g.id} onClick={() => { setGame(g); setSelected(null); setFile(null); }} style={{ ...S.button, background: game.id === g.id ? 'var(--lime)' : 'var(--surface-card)', color: game.id === g.id ? '#000' : 'var(--ink)', border: '1px solid var(--line)' }}>{g.name}</button>)}
    </div>
    <section style={S.card}>
      <h2 style={{ marginTop: 0 }}>{game.name}</h2>
      <p style={S.muted}>{game.levels} rewarded levels · {milestones(game.levels).reduce((n, m) => n + m.points, 0).toLocaleString()} potential points (not payable yet)</p>
      {game.storeUrl ? <a href={game.storeUrl} target="_blank" rel="noopener noreferrer">Open Google Play listing</a> : <p style={S.muted}>Google Play link to be configured before launch.</p>}
      <p style={S.muted}>Installation proof must show the installed game or first launch. Level screenshots should clearly show the level reached. Screenshots can be altered, so approval is manual.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 10 }}>
        {milestones(game.levels).map(m => {
          const found = currentFor(m.key);
          return <div key={m.key} style={{ padding: 14, border: '1px solid var(--line)', borderRadius: 12 }}>
            <strong>{m.label}</strong><div style={S.muted}>{m.points} pts</div>
            <div style={{ ...S.muted, margin: '8px 0' }}>{found?.status?.replaceAll('_', ' ') || 'Not submitted'}</div>
            <button style={{ ...S.button, padding: '7px 10px' }} disabled={!!found && found.status !== 'rejected'} onClick={() => { setSelected(m); setFile(null); }}>
              {found?.status === 'rejected' ? 'Resubmit' : found ? 'Submitted' : 'Submit proof'}
            </button>
          </div>;
        })}
      </div>
    </section>
    {selected && <form style={S.card} onSubmit={submit}>
      <h3>Screenshot: {game.name} — {selected.label}</h3>
      <label>Proof screenshot (PNG, JPEG, WebP; max 5 MB)
        <input style={{ display: 'block', margin: '12px 0' }} type="file" accept="image/png,image/jpeg,image/webp" required onChange={e => setFile(e.target.files?.[0] || null)} />
      </label>
      <label>Notes (optional)
        <textarea value={notes} onChange={e => setNotes(e.target.value)} maxLength={500} style={{ display: 'block', width: '100%', minHeight: 70, margin: '10px 0', padding: 10, boxSizing: 'border-box' }} />
      </label>
      <button disabled={busy || !file} style={S.button} type="submit">{busy ? 'Uploading…' : 'Send for review'}</button>
    </form>}
    {isAdmin && <section style={S.card}>
      <h2>Admin: Pending game proofs ({adminRows.length})</h2>
      <button style={S.button} onClick={refreshAdmin}>Refresh queue</button>
      {adminRows.map(row => <div key={row.id} style={{ borderTop: '1px solid var(--line)', padding: '16px 0' }}>
        <strong>{row.game_id} · {row.milestone ? `Level ${row.milestone}` : 'Installation'}</strong>
        <p style={S.muted}>User: {row.user_id} · {row.reward_points} pts · {new Date(row.created_at).toLocaleString()}</p>
        {row.notes && <p>{row.notes}</p>}
        {row.signedUrl ? <a href={row.signedUrl} target="_blank" rel="noopener noreferrer"><img src={row.signedUrl} alt="Submitted proof" style={{ display: 'block', maxWidth: 320, maxHeight: 360, objectFit: 'contain', marginBottom: 12 }} /></a> : <p>Proof unavailable</p>}
        <div style={{ display: 'flex', gap: 10 }}>
          <button disabled={busy} style={S.button} onClick={() => review(row, true)}>Verify (no payout)</button>
          <button disabled={busy} style={{ ...S.button, background: '#f3d1d1' }} onClick={() => review(row, false)}>Reject</button>
        </div>
      </div>)}
    </section>}
  </div>;
}
