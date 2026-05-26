import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Tasks({ session, navigate }) {
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [quotas, setQuotas] = useState({ videos: 0, blogs: 0 });
  const [lockout, setLockout] = useState(false);
  const [cooldowns, setCooldowns] = useState({});

  const [needsPayoutVerification, setNeedsPayoutVerification] = useState(false);
  const [payoutForm, setPayoutForm] = useState({ bank_name: '', account_name: '', account_number: '' });
  const [savingPayout, setSavingPayout] = useState(false);
  const [payoutError, setPayoutError] = useState('');

  useEffect(() => {
    if (!user) return;
    if (!user.payout_account) {
      setNeedsPayoutVerification(true);
      setLoading(false);
      return;
    }
    fetchMarketplace();
  }, [user]);

  async function fetchMarketplace() {
    try {
      setLoading(true);
      const { data: profile } = await supabase.from('profiles').select('lockout_until').eq('id', user.id).single();
      if (profile?.lockout_until && new Date() < new Date(profile.lockout_until)) {
        setLockout(true);
        setLoading(false);
        return;
      }

      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const todayMidnight = new Date();
      todayMidnight.setHours(0, 0, 0, 0);

      const fetchDate = twentyFourHoursAgo < todayMidnight ? twentyFourHoursAgo : todayMidnight;

      const { data: history } = await supabase
        .from('completions')
        .select('task_id, platform, created_at')
        .eq('user_id', user.id) 
        .gte('created_at', fetchDate.toISOString());

      let vCount = 0, bCount = 0;
      const cooldownMap = {};

      (history || []).forEach(h => {
        const completedAt = new Date(h.created_at);
        if (completedAt >= todayMidnight) {
          if (h.platform === 'blog') bCount++; 
          else vCount++;
        }
        if (completedAt >= twentyFourHoursAgo) {
          const hoursPassed = (new Date() - completedAt) / 3600000;
          cooldownMap[h.task_id] = Math.ceil(24 - hoursPassed);
        }
      });

      setQuotas({ videos: vCount, blogs: bCount });
      setCooldowns(cooldownMap);

      const { data: activeTasks } = await supabase.from('tasks').select('*').eq('status', 'active');
      setTasks(activeTasks || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function submitPayoutProfile() {
    setSavingPayout(true);
    setPayoutError('');
    try {
      if (!payoutForm.bank_name || !payoutForm.account_name || !payoutForm.account_number) throw new Error("All fields are required.");

      const { error } = await supabase
        .from('profiles')
        .update({ payout_bank_name: payoutForm.bank_name, payout_account_name: payoutForm.account_name, payout_account: payoutForm.account_number })
        .eq('id', user.id);
      
      if (error) {
        if (error.code === '23505') throw new Error("This account number is already registered.");
        throw error;
      }

      user.payout_account = payoutForm.account_number;
      user.payout_bank_name = payoutForm.bank_name;
      user.payout_account_name = payoutForm.account_name;
      setNeedsPayoutVerification(false);
      fetchMarketplace();
    } catch (err) {
      setPayoutError(err.message);
    } finally {
      setSavingPayout(false);
    }
  }

  const S = {
    page: { padding: '40px 5%', maxWidth: 1040, margin: '0 auto', fontFamily: "var(--font-body)", position: 'relative' },
    headerWrap: { marginBottom: 48, borderBottom: '1px solid var(--line)', paddingBottom: 24 },
    glassCard: { background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 24, padding: 40, textAlign: 'center' },
    quotaGlowBox: { background: 'var(--lime-dim)', border: '1px solid var(--lime)', padding: '16px 24px', borderRadius: 16, flex: '1 1 200px' },
    quotaDarkBox: { background: 'var(--surface-card)', border: '1px solid var(--line)', padding: '16px 24px', borderRadius: 16, flex: '1 1 200px' },
    taskCard: { background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 20, padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow)' },
    btnActive: { background: 'var(--lime)', color: '#000', border: 'none', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: 'pointer' },
    btnLocked: { background: 'var(--surface)', color: 'var(--slate)', border: '1px solid var(--line)', padding: '10px 20px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'not-allowed' },
    
    payoutOverlay: { position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    payoutCard: { background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 24, padding: 36, width: '100%', maxWidth: 420, boxShadow: 'var(--shadow)', textAlign: 'center' },
    input: { width: '100%', padding: '14px 16px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, color: 'var(--ink)', fontSize: 15, marginBottom: 16, outline: 'none' },
    label: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--slate)', marginBottom: 8, display: 'block', textAlign: 'left' },
    errorBox: { background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 20 }
  };

  if (loading) return <div style={{ padding: '80px', textAlign: 'center', color: 'var(--slate)' }}>Syncing Network...</div>;

  if (needsPayoutVerification) {
    return (
      <div style={S.payoutOverlay}>
        <div style={S.payoutCard}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💳</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)', marginBottom: 8 }}>Financial Verification</h2>
          <p style={{ fontSize: 14, color: 'var(--slate)', marginBottom: 28 }}>To protect the network, link your payout account.</p>
          {payoutError && <div style={S.errorBox}>{payoutError}</div>}
          <div style={{ textAlign: 'left' }}>
            <label style={S.label}>Bank / Institution</label>
            <input type="text" placeholder="e.g. PayPal, Paystack" value={payoutForm.bank_name} onChange={e => setPayoutForm({...payoutForm, bank_name: e.target.value})} style={S.input} />
            <label style={S.label}>Holder Name</label>
            <input type="text" placeholder="Your legal name" value={payoutForm.account_name} onChange={e => setPayoutForm({...payoutForm, account_name: e.target.value})} style={S.input} />
            <label style={S.label}>Number / Email</label>
            <input type="text" placeholder="e.g. 0123456789" value={payoutForm.account_number} onChange={e => setPayoutForm({...payoutForm, account_number: e.target.value})} style={S.input} />
          </div>
          <button onClick={submitPayoutProfile} disabled={savingPayout} style={{ width: '100%', background: 'var(--lime)', color: '#000', border: 'none', padding: '14px', borderRadius: 12, fontWeight: 800 }}>
            {savingPayout ? 'VERIFYING...' : 'SECURE ACCOUNT'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={S.headerWrap}>
        <h1 style={{ fontSize: 36, color: 'var(--ink)', fontWeight: 800 }}>Engagement <span style={{ color: 'var(--lime)' }}>Network</span></h1>
        <p style={{ color: 'var(--slate)' }}>Complete premium tasks to acquire yield.</p>
      </div>

      <div style={{ display: 'flex', gap: 20, marginBottom: 48, flexWrap: 'wrap' }}>
        <div style={S.quotaGlowBox}>
          <span style={{ fontSize: 11, color: 'var(--lime)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1.5px' }}>Video Quota</span>
          <div style={{ color: 'var(--ink)', fontSize: 24, fontWeight: 800 }}>{quotas.videos} <span style={{ fontSize: 16, color: 'var(--slate)' }}>/ 3</span></div>
        </div>
        <div style={S.quotaDarkBox}>
          <span style={{ fontSize: 11, color: 'var(--slate)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1.5px' }}>Blog Quota</span>
          <div style={{ color: 'var(--ink)', fontSize: 24, fontWeight: 800 }}>{quotas.blogs} <span style={{ fontSize: 16, color: 'var(--slate)' }}>/ 20</span></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
        {tasks.map(task => {
          const quotaHit = (task.platform === 'blog' && quotas.blogs >= 20) || (task.platform !== 'blog' && quotas.videos >= 3);
          const isLocked = quotaHit || cooldowns[task.id];
          return (
            <div key={task.id} style={{ ...S.taskCard, opacity: isLocked ? 0.6 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{task.platform === 'blog' ? '📄' : '▶️'}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{task.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--slate)', textTransform: 'uppercase' }}>{task.watch_duration}s Verification</div>
                </div>
              </div>
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: isLocked ? 'var(--slate)' : 'var(--lime)' }}>+{task.reward_points} PTS</div>
                {quotaHit ? <button disabled style={S.btnLocked}>LIMIT REACHED</button> : cooldowns[task.id] ? <button disabled style={S.btnLocked}>🔒 {cooldowns[task.id]}H COOLDOWN</button> : <button onClick={() => navigate(`player/${task.id}`)} style={S.btnActive}>INITIATE</button>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
