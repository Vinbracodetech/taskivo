import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Tasks({ session, navigate }) {
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [quotas, setQuotas] = useState({ videos: 0, blogs: 0 });
  const [lockout, setLockout] = useState(false);

  useEffect(function() {
    if (!user) return;
    fetchMarketplace();
  }, [user]);

  async function fetchMarketplace() {
    try {
      setLoading(true);
      
      // 🔥 SECURE LOCKOUT CHECK FROM DATABASE 🔥
      const { data: profile } = await supabase.from('profiles').select('lockout_until').eq('id', user.id).single();
      
      if (profile?.lockout_until && new Date() < new Date(profile.lockout_until)) {
        setLockout(true);
        setLoading(false);
        return;
      }

      // Check daily quotas (Fixed: searching by earner_id)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data: history } = await supabase.from('completions').select('platform').eq('earner_id', user.id).gte('created_at', today.toISOString());

      let vCount = 0, bCount = 0;
      (history || []).forEach(h => { if (h.platform === 'blog') bCount++; else vCount++; });
      setQuotas({ videos: vCount, blogs: bCount });

      // Load available tasks
      const { data: activeTasks } = await supabase.from('tasks').select('*').eq('status', 'active');
      setTasks(activeTasks || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const S = {
    page: { padding: '40px 5%', maxWidth: 1040, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" },
    glassCard: { background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 24, padding: 40, boxShadow: '0 8px 32px rgba(0,0,0,0.04)', textAlign: 'center' },
    taskCard: { background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 16, padding: '24px', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, background 0.2s', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' },
  };

  if (loading) return <div style={{ padding: '80px', textAlign: 'center', color: 'var(--slate)' }}>Scanning network...</div>;

  if (lockout) {
    return (
      <div style={S.page}>
        <div style={S.glassCard}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🔒</div>
          <h2 style={{ color: 'var(--ink)', fontSize: 24, fontFamily: "'Inter', sans-serif", marginBottom: 12 }}>Network Access Locked</h2>
          <p style={{ color: 'var(--slate)' }}>Your account is under a strict 24-hour restriction due to failed anti-cheat verifications.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 32, color: 'var(--ink)', marginBottom: 8, fontWeight: 800, letterSpacing: '-0.5px' }}>Engagement Network</h1>
        <p style={{ color: 'var(--slate)', fontSize: 15 }}>Complete tasks to acquire points. Daily quotas apply.</p>
      </div>

      <div style={{ display: 'flex', gap: 20, marginBottom: 40, flexWrap: 'wrap' }}>
        <div style={{ background: 'rgba(168,255,62,0.1)', border: '1px solid rgba(168,255,62,0.3)', padding: '12px 24px', borderRadius: 12 }}>
          <span style={{ fontSize: 11, color: 'var(--ink)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px', display: 'block' }}>Video Quota</span>
          <span style={{ color: 'var(--ink)', fontSize: 18, fontWeight: 700 }}>{quotas.videos} / 3</span>
        </div>
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--line)', padding: '12px 24px', borderRadius: 12 }}>
          <span style={{ fontSize: 11, color: 'var(--slate)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px', display: 'block' }}>Blog Quota</span>
          <span style={{ color: 'var(--ink)', fontSize: 18, fontWeight: 700 }}>{quotas.blogs} / 20</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        {tasks.map(task => {
          const isBlog = task.platform === 'blog';
          const quotaHit = (isBlog && quotas.blogs >= 20) || (!isBlog && quotas.videos >= 3);

          return (
            <div key={task.id} style={{ ...S.taskCard, opacity: quotaHit ? 0.5 : 1 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                  {isBlog ? '📄' : '▶️'}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>{task.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{task.watch_duration}s Verification</div>
                </div>
              </div>
              
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--lime)' }}>+{task.reward_points} PTS</div>
                {quotaHit ? (
                  <span style={{ fontSize: 12, color: 'var(--slate)', fontWeight: 700 }}>QUOTA REACHED</span>
                ) : (
                  <button onClick={() => navigate(`player/${task.id}`)} style={{ background: 'var(--ink)', color: 'var(--surface)', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>INITIATE</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
