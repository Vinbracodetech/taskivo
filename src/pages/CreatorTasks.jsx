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

  // 🔥 PREMIUM FINTECH STYLE OBJECT 🔥
  const S = {
    pageWrapper: {
      minHeight: '100vh',
      backgroundColor: '#0a0a0c',
      backgroundImage: `
        radial-gradient(circle at 15% 50px, rgba(212, 175, 55, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 85% 30%, rgba(168, 255, 62, 0.04) 0%, transparent 50%),
        url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z' fill='none' stroke='%23ffffff' stroke-width='1' stroke-opacity='0.02'/%3E%3C/svg%3E")
      `,
      backgroundSize: '100% 100%, 100% 100%, 40px 40px',
      backgroundAttachment: 'fixed',
    },
    page: { padding: '40px 5%', maxWidth: 1100, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", position: 'relative' },
    
    glassCard: { 
      background: 'rgba(255, 255, 255, 0.02)', 
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 20, 
      overflow: 'hidden', 
      boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)'
    },
    
    headerLabel: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: '#D4AF37', fontFamily: "'Inter', sans-serif" },
    
    btnSecondary: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'background 0.2s' },
    
    btnAction: (isActive) => ({
      background: isActive ? 'transparent' : 'rgba(212, 175, 55, 0.1)', 
      border: `1px solid ${isActive ? 'rgba(255,255,255,0.2)' : '#D4AF37'}`, 
      color: isActive ? '#ffffff' : '#D4AF37', 
      borderRadius: 6, padding: '6px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: "'Inter', sans-serif", transition: 'all 0.2s'
    })
  };

  if (loading) {
    return (
      <div style={{ ...S.pageWrapper, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
          <div style={{ width: 32, height: 32, border: '2px solid rgba(255, 255, 255, 0.1)', borderTopColor: '#D4AF37', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
          <div style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: 11, fontWeight: 700 }}>Synchronizing ledger data...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.pageWrapper}>
      <div style={S.page}>
        <div style={{ marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 32, color: '#ffffff', marginBottom: 8, fontWeight: 800, letterSpacing: '-0.5px' }}>Campaign Ledger</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, fontWeight: 400, margin: 0 }}>Comprehensive view of all active and historical deployments.</p>
          </div>
          <button onClick={() => navigate('creator-dashboard')} style={S.btnSecondary}>← Return to Command</button>
        </div>

        <div style={S.glassCard}>
          {tasks.length === 0 ? (
            <div style={{ padding: 80, textAlign: 'center' }}>
              <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>No campaigns recorded in the ledger.</div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 1fr', gap: 16, padding: '20px 24px', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }} className="hide-on-mobile">
                <span style={S.headerLabel}>Campaign Designation</span>
                <span style={S.headerLabel}>Parameters</span>
                <span style={S.headerLabel}>Fulfillment Status</span>
                <span style={{ ...S.headerLabel, textAlign: 'right' }}>Controls</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {tasks.map(function(campaign, index) {
                  const isLast = index === tasks.length - 1;
                  const fulfillment = Math.round(((campaign.current_views || 0) / (campaign.target_views || 1)) * 100);
                  const isActive = campaign.status === 'active';
                  const isComplete = campaign.current_views >= campaign.target_views;

                  return (
                    <div key={campaign.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, padding: '24px', borderBottom: isLast ? 'none' : '1px solid rgba(255, 255, 255, 0.06)', alignItems: 'center', background: isActive ? 'transparent' : 'rgba(0, 0, 0, 0.2)' }}>
                      <div>
                        <div style={{ fontSize: 15, color: '#ffffff', fontWeight: 700, marginBottom: 4, fontFamily: "'Inter', sans-serif" }}>{campaign.title}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace' }}>{campaign.id.split('-')[0]} • {new Date(campaign.created_at).toLocaleDateString()}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: 13, color: '#ffffff', fontWeight: 600, textTransform: 'capitalize', marginBottom: 4 }}>{campaign.platform.replace('_', ' ')}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{campaign.watch_duration}s Verification</div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{campaign.current_views} / {campaign.target_views} Verified</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: isComplete ? '#a8ff3e' : '#ffffff' }}>{fulfillment}%</div>
                        </div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden', width: '100%' }}>
                          <div style={{ height: '100%', width: `${Math.min(fulfillment, 100)}%`, background: isComplete ? '#a8ff3e' : '#D4AF37', borderRadius: 2 }}></div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', display: 'flex', gap: 12, justifyContent: 'flex-end', alignItems: 'center' }}>
                        <span style={{ 
                          fontSize: 10, 
                          fontWeight: 800, 
                          padding: '4px 8px', 
                          borderRadius: 4, 
                          textTransform: 'uppercase', 
                          letterSpacing: '1px', 
                          background: isComplete ? 'rgba(168, 255, 62, 0.1)' : (isActive ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.5)'), 
                          color: isComplete ? '#a8ff3e' : (isActive ? '#ffffff' : 'rgba(255,255,255,0.5)'), 
                          border: `1px solid ${isComplete ? 'rgba(168, 255, 62, 0.3)' : 'rgba(255,255,255,0.1)'}`,
                          fontFamily: "'Inter', sans-serif"
                        }}>
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
    </div>
  );
}
