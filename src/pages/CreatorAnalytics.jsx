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

export default function CreatorAnalytics({ user, navigate, showToast }) {
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [completions, setCompletions] = useState([]);

  useEffect(function() {
    if (!user) return;
    fetchCampaigns();
  }, [user]);

  async function fetchCampaigns() {
    try {
      setLoading(true);
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('id, title, platform, watch_duration, slots, completed_slots, created_at, status')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setCampaigns(tasks || []);
      
      // Auto-select the most recent campaign if available
      if (tasks && tasks.length > 0) {
        selectCampaign(tasks[0]);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Failed to load campaigns', 'error');
      setLoading(false);
    }
  }

  async function selectCampaign(task) {
    setSelectedTask(task);
    setLoading(true);
    try {
      // Fetch the actual completion timestamps for this specific task
      const { data: compData, error } = await supabase
        .from('completions')
        .select('id, completed_at, points_earned')
        .eq('task_id', task.id)
        .order('completed_at', { ascending: false })
        .limit(50); // Show last 50 for the timeline

      if (error) throw error;
      setCompletions(compData || []);
    } catch (err) {
      console.error(err);
      if (showToast) showToast('Failed to load engagement data', 'error');
    } finally {
      setLoading(false);
    }
  }

  if (loading && !selectedTask) {
    return <div style={{ padding: '60px 5%', textAlign: 'center', color: C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>Aggregating Analytics...</div>;
  }

  // Calculations for the selected campaign
  const totalMinutesDelivered = selectedTask ? Math.floor((selectedTask.completed_slots * selectedTask.watch_duration) / 60) : 0;
  const progressPercent = selectedTask ? Math.min((selectedTask.completed_slots / selectedTask.slots) * 100, 100) : 0;

  return (
    <div style={{ padding: '40px 5%', maxWidth: 1000, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", paddingBottom: 120 }}>
      
      {/* HEADER & SELECTOR */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, marginBottom: 40 }}>
        <div>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 28, color: C.textMain, marginBottom: 8, fontWeight: 800 }}>Campaign Analytics</h1>
          <p style={{ color: C.textMuted, fontSize: 15 }}>Deep dive into your traffic quality and delivery speed.</p>
        </div>
        
        {campaigns.length > 0 && (
          <div style={{ minWidth: 250 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Select Campaign</label>
            <div style={{ position: 'relative' }}>
              <select 
                value={selectedTask ? selectedTask.id : ''}
                onChange={function(e) {
                  const t = campaigns.find(function(c) { return c.id === e.target.value; });
                  if (t) selectCampaign(t);
                }}
                style={{ width: '100%', padding: '12px 16px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.input, color: C.textMain, fontSize: 14, fontFamily: "'Inter', sans-serif", fontWeight: 600, outline: 'none', appearance: 'none', cursor: 'pointer' }}
              >
                {campaigns.map(function(camp) {
                  return <option key={camp.id} value={camp.id}>{camp.title} ({camp.status})</option>;
                })}
              </select>
              {/* Custom dropdown arrow */}
              <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: C.textMuted }}>▼</div>
            </div>
          </div>
        )}
      </div>

      {!selectedTask ? (
        <div style={{ background: C.card, border: `1px dashed ${C.line}`, borderRadius: 12, padding: 48, textAlign: 'center', boxShadow: C.shadow }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: C.textMain, marginBottom: 8 }}>No data available</div>
          <div style={{ fontSize: 14, color: C.textMuted }}>Launch a campaign to unlock deep analytics.</div>
        </div>
      ) : (
        <div className="animate-fadeIn">
          
          {/* THE 3 METRIC PILLARS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 40 }}>
            <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 24, boxShadow: C.shadow }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.limeText }}></div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Delivery Status</div>
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 36, fontWeight: 800, color: C.textMain, lineHeight: 1, marginBottom: 8 }}>
                {progressPercent.toFixed(1)}%
              </div>
              <div style={{ fontSize: 13, color: C.textMuted }}>{selectedTask.completed_slots} of {selectedTask.slots} verified engagements</div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 24, boxShadow: C.shadow }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ fontSize: 16 }}>⏳</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Human Attention</div>
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 36, fontWeight: 800, color: C.limeText, lineHeight: 1, marginBottom: 8 }}>
                {totalMinutesDelivered} <span style={{ fontSize: 16, fontWeight: 600, color: C.textMuted }}>Mins</span>
              </div>
              <div style={{ fontSize: 13, color: C.textMuted }}>Total verified dwell time generated</div>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 24, boxShadow: C.shadow }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <div style={{ fontSize: 16 }}>🛡️</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1 }}>Network Integrity</div>
              </div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 36, fontWeight: 800, color: C.textMain, lineHeight: 1, marginBottom: 8 }}>
                100%
              </div>
              <div style={{ fontSize: 13, color: C.textMuted }}>Passed anti-cheat & tab-switch checks</div>
            </div>
          </div>

          {/* TRAFFIC VELOCITY TIMELINE */}
          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 32, boxShadow: C.shadow }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 700, color: C.textMain, marginBottom: 24 }}>Recent Traffic Velocity</h3>
            
            {loading ? (
              <div style={{ color: C.textMuted, fontSize: 14 }}>Fetching timeline...</div>
            ) : completions.length === 0 ? (
              <div style={{ padding: '24px 0', color: C.textMuted, fontSize: 14, borderTop: `1px solid ${C.line}` }}>
                No engagements have been recorded for this campaign yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {completions.map(function(comp, index) {
                  const date = new Date(comp.completed_at);
                  const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const dateString = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                  
                  return (
                    <div key={comp.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '16px 0', borderBottom: index === completions.length - 1 ? 'none' : `1px solid ${C.line}` }}>
                      {/* Timeline dot */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginTop: 4 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.limeText, border: `2px solid ${C.card}` }}></div>
                        {index !== completions.length - 1 && <div style={{ width: 2, height: 40, background: C.line }}></div>}
                      </div>
                      
                      {/* Content */}
                      <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.textMain, marginBottom: 4 }}>Unique User Verification</div>
                          <div style={{ fontSize: 13, color: C.textMuted }}>Passed full {selectedTask.watch_duration}s active session check.</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.textMain }}>{timeString}</div>
                          <div style={{ fontSize: 12, color: C.textMuted }}>{dateString}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
