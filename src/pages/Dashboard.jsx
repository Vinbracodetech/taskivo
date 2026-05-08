import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const C = {
  surface: 'var(--surface)',
  card: 'var(--surface-card)',
  input: 'var(--surface-card)',
  textMain: 'var(--ink)',
  textMuted: 'var(--slate)',
  line: 'var(--line)',
  lime: '#A8FF3E',
  limeText: 'var(--lime)',
  limeDim: 'var(--lime-dim)',
  shadow: 'var(--shadow)',
};

export default function Dashboard({ user, navigate, showToast }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ completions: 0 });
  const [featuredTasks, setFeaturedTasks] = useState([]);
  const [referralCopied, setReferralCopied] = useState(false);

  useEffect(function() {
    if (!user) return;
    fetchDashboardData();
  }, [user]);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      const { count } = await supabase.from('completions').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
      const { data: tasks } = await supabase.from('tasks').select('*').eq('status', 'active').limit(3);
      setStats({ completions: count || 0 });
      setFeaturedTasks(tasks || []);
    } catch (err) {
      if (showToast) showToast('Failed to sync dashboard', 'error');
    } finally {
      setLoading(false);
    }
  }

  function copyReferralLink() {
    // 🔥 FIX 4: Flawless Hash Routing Link without extra slash 🔥
    navigator.clipboard.writeText(`https://taskivo.online/#auth?ref=${user.id}`);
    setReferralCopied(true);
    if (showToast) showToast('Invite link copied!', 'success');
    setTimeout(function() { setReferralCopied(false); }, 3000);
  }

  if (loading) return <div style={{ padding: '60px 5%', textAlign: 'center', color: C.textMuted }}>Syncing profile...</div>;

  const minWithdrawal = 2000;
  const progressPercent = Math.min((user.points / minWithdrawal) * 100, 100);

  return (
    <div style={{ padding: '40px 5%', maxWidth: 1000, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 28, color: C.textMain, marginBottom: 8, fontWeight: 800 }}>
          Welcome back, <span style={{ textTransform: 'capitalize' }}>{user.full_name?.split(' ')[0] || 'Earner'}</span>.
        </h1>
        <p style={{ color: C.textMuted, fontSize: 15 }}>Track your verified engagement and network growth.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 40 }}>
        <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: C.shadow }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Available Balance</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 48, fontWeight: 800, color: C.limeText, lineHeight: 1 }}>{user.points.toLocaleString()}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.textMuted }}>PTS</div>
          </div>
          <button onClick={function() { navigate('wallet'); }} style={{ marginTop: 24, background: C.input, color: C.textMain, border: `1px solid ${C.line}`, borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Manage Wallet →</button>
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: C.shadow }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Verified Tasks</div>
              <div style={{ background: C.input, color: C.textMain, border: `1px solid ${C.line}`, fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 100 }}>{stats.completions} Lifetime</div>
            </div>
            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.textMuted }}>
              <span>Progress to payout</span>
              <span style={{ color: C.textMain, fontWeight: 600 }}>{user.points} / {minWithdrawal}</span>
            </div>
            <div style={{ height: 8, background: C.input, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: C.limeText, borderRadius: 10 }}></div>
            </div>
          </div>
          <button onClick={function() { navigate('tasks'); }} style={{ marginTop: 24, background: C.lime, color: '#000000', border: 'none', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Find More Tasks</button>
        </div>
      </div>

      <div style={{ background: C.limeDim, border: `1px solid ${C.line}`, borderRadius: 16, padding: 24, marginBottom: 40, display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: '1 1 300px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: C.limeText, color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>🔥 Hot Bonus</div>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, color: C.textMain, marginBottom: 8 }}>Earn 50 Points Per Invite</h2>
          <p style={{ color: C.textMuted, fontSize: 14, maxWidth: 450, margin: 0 }}>Share your unique invite link. When your friend registers and completes their first task, you instantly receive 50 points.</p>
        </div>
        <button onClick={copyReferralLink} style={{ background: referralCopied ? C.input : C.surface, color: C.textMain, border: `1px solid ${C.line}`, borderRadius: 8, padding: '14px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          {referralCopied ? 'Link Copied ✓' : 'Copy Invite Link'}
        </button>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, color: C.textMain, margin: 0 }}>Start Earning Now</h2>
          <span onClick={function() { navigate('tasks'); }} style={{ color: C.limeText, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>View all →</span>
        </div>
        {featuredTasks.length === 0 ? (
          <div style={{ background: C.card, border: `1px dashed ${C.line}`, borderRadius: 12, padding: 40, textAlign: 'center', boxShadow: C.shadow }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.textMain }}>No active tasks available</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {featuredTasks.map(function(task) {
              const isBlog = task.platform === 'blog';
              return (
                <div key={task.id} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: C.shadow }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: C.input, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{isBlog ? '📄' : '▶️'}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.textMain, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>{task.title}</div>
                      <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 500 }}>{task.watch_duration}s Verification</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 16, borderTop: `1px solid ${C.line}` }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: C.limeText }}>+{task.reward_points} PTS</div>
                    <button onClick={function() { navigate(`player/${task.id}`); }} style={{ background: 'transparent', color: C.textMain, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Begin Task →</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
