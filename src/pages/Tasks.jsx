import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import useToast from '../components/useToast';

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

export default function Tasks({ session, navigate }) {
  const { showToast, ToastComponent } = useToast();
  const [loading, setLoading] = useState(true);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [cooldownTasks, setCooldownTasks] = useState([]);

  useEffect(function () {
    if (!session || !session.user) { navigate('auth'); return; }
    fetchTasksAndCompletions();
  }, [session]);

  async function fetchTasksAndCompletions() {
    try {
      setLoading(true);
      const { data: allTasks } = await supabase.from('tasks').select('*').eq('status', 'active');
      const { data: completions } = await supabase.from('completions').select('task_id, completed_at').eq('user_id', session.user.id);

      const now = new Date();
      const available = [];
      const cooldown = [];

      (allTasks || []).forEach(function (task) {
        const userCompletion = (completions || []).find(function(c) { return c.task_id === task.id; });
        if (userCompletion) {
          const completedDate = new Date(userCompletion.completed_at);
          const hoursSinceCompletion = (now - completedDate) / (1000 * 60 * 60);
          if (hoursSinceCompletion < 24) {
            task.hoursLeft = Math.ceil(24 - hoursSinceCompletion);
            cooldown.push(task);
          } else available.push(task);
        } else available.push(task);
      });

      setAvailableTasks(available.sort(function() { return 0.5 - Math.random(); }));
      setCooldownTasks(cooldown);
    } catch (error) {
      showToast('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div style={{ background: C.surface, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: C.textMuted }}>Syncing Network...</div></div>;

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.surface, color: C.textMain, minHeight: '100vh', padding: '40px 5% 120px' }}>
      {ToastComponent}
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 28, color: C.textMain, marginBottom: 8, fontWeight: 800 }}>Task Network</h1>
          <p style={{ color: C.textMuted, fontSize: 15 }}>Complete verified engagements to earn reward points.</p>
        </div>

        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Available Engagements ({availableTasks.length})</div>
          {availableTasks.length === 0 ? (
            <div style={{ background: C.card, border: `1px dashed ${C.line}`, borderRadius: 12, padding: 40, textAlign: 'center', boxShadow: C.shadow }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.textMain }}>You're all caught up!</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {availableTasks.map(function(task) {
                const isBlog = task.platform === 'blog';
                return (
                  <div key={task.id} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 20, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between', boxShadow: C.shadow }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 10, background: C.input, border: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{isBlog ? '📄' : '▶️'}</div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: C.textMain, marginBottom: 4 }}>{task.title}</div>
                        <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 500 }}>{isBlog ? 'SEO Traffic' : 'Video Engagement'} • {task.watch_duration}s Required</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: C.limeText }}>+{task.reward_points} PTS</div>
                      <button onClick={function() { navigate(`player/${task.id}`); }} style={{ background: C.textMain, color: C.surface, border: 'none', borderRadius: 8, padding: '10px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Start Task</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {cooldownTasks.length > 0 && (
          <div style={{ opacity: 0.7 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>On Cooldown ({cooldownTasks.length})</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {cooldownTasks.map(function(task) {
                return (
                  <div key={task.id} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, padding: 16, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: C.input, display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'grayscale(100%)' }}>{task.platform === 'blog' ? '📄' : '▶️'}</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: C.textMuted }}>{task.title}</div>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, background: C.input, padding: '6px 12px', borderRadius: 100, border: `1px solid ${C.line}` }}>Unlocks in ~{task.hoursLeft}h</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
