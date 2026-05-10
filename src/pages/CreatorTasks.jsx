import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function CreatorTasks({ user, navigate, showToast }) {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  useEffect(function() {
    if (!user) return;
    fetchCampaigns();
  }, [user]);

  async function fetchCampaigns() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('tasks').select('*').eq('creator_id', user.id).order('created_at', { ascending: false });
      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      if (showToast) showToast('Failed to load campaign ledger.', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(taskId, currentStatus) {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', taskId);
      if (error) throw error;
      setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
      if (showToast) showToast(`Campaign ${newStatus}.`, 'success');
    } catch (err) {
      if (showToast) showToast('Failed to update status.', 'error');
    }
  }

  if (loading) return <div style={{ padding: '80px 5%', textAlign: 'center', color: 'var(--slate)' }}>Synchronizing ledger data...</div>;

  const S = {
    page: { padding: '40px 5%', maxWidth: 1100, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", position: 'relative' },
    glassCard: { background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.04)' },
    headerLabel: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--slate)', fontFamily: "'Inter', sans-serif" },
    btnGhost: { background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif" },
    btnAction: (isActive) => ({
      background: isActive ? 'var(--surface)' : 'var(--ink)', border: `1px solid ${isActive ? 'var(--line)' : 'var(--ink)'}`, color: isActive ? 'var(--ink)' : 'var(--surface)', 
      borderRadius: 6, padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px'
    })
  };

  return (
    <div style={S.page}>
      <div style={{ marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 32, color: 'var(--ink)', marginBottom: 8, fontWeight: 800, letterSpacing: '-0.5px' }}>Campaign Ledger</h1>
          <p style={{ color: 'var(--slate)', fontSize: 15, fontWeight: 400, margin: 0 }}>Comprehensive view of all active and historical deployments.</p>
        </div>
        <button onClick={() => navigate('creator-dashboard')} style={S.btnGhost}>← Return to Command</button>
      </div>

      <div style={S.glassCard}>
        {tasks.length === 0 ? (
          <div style={{ padding: 80, textAlign: 'center' }}><div style={{ fontSize: 15, color: 'var(--slate)', fontWeight: 500 }}>No campaigns recorded in the ledger.</div></div>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 1fr', gap: 16, padding: '20px 24px', background: 'var(--surface)', borderBottom: '1px solid var(--line)' }} className="hide-on-mobile">
              <span style={S.headerLabel}>Campaign Designation</span><span style={S.headerLabel}>Parameters</span><span style={S.headerLabel}>Fulfillment Status</span><span style={{ ...S.headerLabel, textAlign: 'right' }}>Controls</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {tasks.map(function(campaign, index) {
                const isLast = index === tasks.length - 1;
                const fulfillment = Math.round(((campaign.current_views || 0) / (campaign.target_views || 1)) * 100);
                const isActive = campaign.status === 'active';
                const isComplete = campaign.current_views >= campaign.target_views;

                return (
                  <div key={campaign.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, padding: '24px', borderBottom: isLast ? 'none' : '1px solid var(--line)', alignItems: 'center', background: isActive ? 'transparent' : 'var(--surface)' }}>
                    <div>
                      <div style={{ fontSize: 15, color: 'var(--ink)', fontWeight: 700, marginBottom: 4 }}>{campaign.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--slate)', fontFamily: 'monospace' }}>{campaign.id.split('-')[0]} • {new Date(campaign.created_at).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 600, textTransform: 'capitalize', marginBottom: 4 }}>{campaign.platform}</div>
                      <div style={{ fontSize: 12, color: 'var(--slate)' }}>{campaign.watch_duration}s Verification</div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div style={{ fontSize: 12, color: 'var(--slate)', fontWeight: 600 }}>{campaign.current_views} / {campaign.target_views} Verified</div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: isComplete ? 'var(--lime)' : 'var(--ink)' }}>{fulfillment}%</div>
                      </div>
                      <div style={{ height: 4, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 2, overflow: 'hidden', width: '100%' }}>
                        <div style={{ height: '100%', width: `${Math.min(fulfillment, 100)}%`, background: isComplete ? 'var(--lime)' : 'var(--ink)', borderRadius: 2 }}></div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', gap: 12, justifyContent: 'flex-end', alignItems: 'center' }}>
                      <span style={{ fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '1px', background: isActive ? 'var(--surface)' : 'var(--surface-card)', color: isActive ? 'var(--ink)' : 'var(--slate)', border: '1px solid var(--line)' }}>
                        {isComplete ? 'COMPLETED' : campaign.status}
                      </span>
                      {!isComplete && <button onClick={() => toggleStatus(campaign.id, campaign.status)} style={S.btnAction(isActive)}>{isActive ? 'Pause' : 'Resume'}</button>}
                    </div>
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
