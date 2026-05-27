import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Tasks({ session, navigate }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quotaLocked, setQuotaLocked] = useState(false);
  const [tasksCompletedToday, setTasksCompletedToday] = useState(0);
  const [isVerified, setIsVerified] = useState(true);

  useEffect(() => {
    async function loadTaskFeed() {
      try {
        // 1. FINANCIAL VERIFICATION CHECK (Layer 3 Security)
        const { data: profile } = await supabase
          .from('profiles')
          .select('account_number, bank_name')
          .eq('id', session.user.id)
          .single();

        if (!profile || !profile.account_number || !profile.bank_name) {
          setIsVerified(false);
          setLoading(false);
          return; // Abort loading tasks if not financially verified
        }

        // 2. Fetch user's entire completion history
        const { data: completions } = await supabase
          .from('completions')
          .select('task_id, created_at')
          .eq('user_id', session.user.id);

        const userCompletions = completions || [];

        // 3. Check 24-hour Quota (Max 20 tasks per day)
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));
        
        const recentCompletions = userCompletions.filter(c => new Date(c.created_at) > twentyFourHoursAgo);
        setTasksCompletedToday(recentCompletions.length);

        if (recentCompletions.length >= 20) {
          setQuotaLocked(true);
          setLoading(false);
          return; // Abort loading tasks, daily limit reached
        }

        // 4. Fetch active tasks, filtering out ones they have ALREADY completed
        const completedTaskIds = userCompletions.map(c => c.task_id);
        
        const { data: activeTasks } = await supabase
          .from('tasks')
          .select('*')
          .eq('status', 'active');

        // Mathematical guarantee: Only show tasks not in their completion history
        const freshTasks = (activeTasks || []).filter(t => !completedTaskIds.includes(t.id));

        setTasks(freshTasks);
      } catch (err) {
        console.error("Task Engine Error:", err);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user?.id) {
      loadTaskFeed();
    }
  }, [session]);

  if (loading) {
    return <div style={{ padding: '100px 20px', textAlign: 'center', color: 'var(--slate)' }}>Encrypting Feed...</div>;
  }

  // ── THE FINANCIAL LOCKOUT SCREEN ──
  if (!isVerified) {
    return (
      <div style={{ padding: '60px 5%', maxWidth: 600, margin: '0 auto', textAlign: 'center', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ width: 64, height: 64, background: 'rgba(212,175,55,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid rgba(212,175,55,0.3)' }}>
          <span style={{ fontSize: 24 }}>🏦</span>
        </div>
        <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 800, color: 'var(--ink)', marginBottom: 12 }}>Verification Required</h2>
        <p style={{ color: 'var(--slate)', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
          To eliminate bot traffic and maintain enterprise platform integrity, you must bind a secure payout institution (Bank Account) to your identity before accessing Featured Tasks.
        </p>
        <button onClick={() => navigate('wallet')} style={{ background: 'var(--lime)', border: 'none', color: '#000', padding: '14px 28px', borderRadius: 8, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
          Bind Payout Account
        </button>
      </div>
    );
  }

  // ── THE QUOTA LOCKOUT SCREEN ──
  if (quotaLocked) {
    return (
      <div style={{ padding: '60px 5%', maxWidth: 600, margin: '0 auto', textAlign: 'center', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ width: 64, height: 64, background: 'rgba(239,68,68,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
          <span style={{ fontSize: 24 }}>🔒</span>
        </div>
        <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 800, color: 'var(--ink)', marginBottom: 12 }}>Daily Quota Reached</h2>
        <p style={{ color: 'var(--slate)', fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
          To maintain high-quality algorithmic metrics for our creators, Earners are limited to 20 verified tasks per 24-hour period. Your queue will unlock tomorrow.
        </p>
        <button onClick={() => navigate('wallet')} style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
          View Treasury Balance
        </button>
      </div>
    );
  }

  // ── THE FEATURED TASKS FEED ──
  return (
    <div style={{ padding: '40px 5%', maxWidth: 800, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 28, color: 'var(--ink)', marginBottom: 8, fontWeight: 800, letterSpacing: '-0.5px' }}>Featured Tasks</h1>
          <p style={{ color: 'var(--slate)', fontSize: 15, margin: 0 }}>Execute premium missions to claim liquidity.</p>
        </div>
        <div style={{ textAlign: 'right', background: 'var(--surface-card)', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--line)' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>24H Quota</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)', fontFamily: "'Inter', sans-serif" }}>
            <span style={{ color: tasksCompletedToday >= 15 ? '#ef4444' : 'var(--lime)' }}>{tasksCompletedToday}</span> / 20
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 16 }}>
        {tasks.length === 0 ? (
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 16, padding: 40, textAlign: 'center', color: 'var(--slate)' }}>
            No fresh featured tasks available right now. Check back later.
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} style={{ background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 16, padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', transition: 'transform 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <div>
                <div style={{ display: 'inline-block', background: 'var(--surface)', color: 'var(--slate)', fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 4, textTransform: 'uppercase', marginBottom: 12, border: '1px solid var(--line)' }}>
                  {task.platform}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>{task.title}</div>
                <div style={{ fontSize: 13, color: 'var(--slate)' }}>Guaranteed Payload: <strong style={{ color: 'var(--ink)' }}>{task.reward_points} PTS</strong></div>
              </div>
              
              <button 
                onClick={() => {
                  // SECRET TOKEN: Write the active mission to memory before opening the player
                  if(task.platform === 'blog' && task.url) {
                     localStorage.setItem('taskivo_active_mission', task.url.split('/').pop());
                  }
                  navigate(`player/${task.id}`);
                }} 
                style={{ background: 'var(--lime)', color: '#000', border: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: "'Inter', sans-serif", whiteSpace: 'nowrap' }}
              >
                Start Mission
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
