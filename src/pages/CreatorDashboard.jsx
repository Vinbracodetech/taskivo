import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function CreatorDashboard({ user, navigate, showToast }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalCampaigns: 0, activeSlots: 0, verifiedEngagements: 0 });
  const [recentCampaigns, setRecentCampaigns] = useState([]);
  
  // 🔥 NEW QA QUEUE STATES 🔥
  const [pendingReviews, setPendingReviews] = useState([]);
  const [processingId, setProcessingId] = useState(null);

  useEffect(function() {
    if (!user) return;
    fetchCreatorData();
  }, [user]);

  async function fetchCreatorData() {
    try {
      setLoading(true);
      
      // 1. Fetch Campaign Stats
      const { data: tasks, error: taskError } = await supabase
        .from('tasks')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (taskError) throw taskError;

      let slots = 0;
      let verified = 0;
      
      if (tasks) {
        tasks.forEach(function(t) {
          slots += (t.target_views || 0);
          verified += (t.current_views || 0);
        });
      }

      setStats({
        totalCampaigns: tasks ? tasks.length : 0,
        activeSlots: slots,
        verifiedEngagements: verified
      });
      
      setRecentCampaigns(tasks ? tasks.slice(0, 3) : []);

      // 2. Fetch Pending QA Submissions (Inner Join with tasks table)
      const { data: pending, error: pendingError } = await supabase
        .from('completions')
        .select('id, proof_text, proof_url, created_at, tasks!inner(title, reward_points, creator_id)')
        .eq('tasks.creator_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10); // Batch for mobile performance

      if (!pendingError && pending) {
        setPendingReviews(pending);
      }

    } catch (err) {
      if (showToast) showToast('Failed to sync terminal data', 'error');
    } finally {
      setLoading(false);
    }
  }

  // 🔥 QA DECISION HANDLERS 🔥
  async function handleQADecision(completionId, decision) {
    setProcessingId(completionId);
    try {
      const { error } = await supabase
        .from('completions')
        .update({ status: decision }) // 'approved' or 'rejected'
        .eq('id', completionId);

      if (error) throw error;

      // Remove from the local UI queue
      setPendingReviews(prev => prev.filter(r => r.id !== completionId));
      if (showToast) showToast(`Submission ${decision.toUpperCase()}`, decision === 'approved' ? 'success' : 'error');
      
    } catch (err) {
      if (showToast) showToast('Action failed', 'error');
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '80px 5%', textAlign: 'center', color: 'var(--slate)', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
        <div style={{ width: 32, height: 32, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--ink)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
        <div style={{ letterSpacing: '1px', fontSize: 12, fontWeight: 600 }}>Initializing Workspace...</div>
      </div>
    );
  }

  // 🔥 STRICT ENTERPRISE SAAS STYLE OBJECT 🔥
  const S = {
    pageWrapper: {
      minHeight: '100vh',
      backgroundColor: 'var(--surface)',
      backgroundImage: `
        url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z' fill='none' stroke='%23ffffff' stroke-width='1' stroke-opacity='0.02'/%3E%3C/svg%3E")
      `,
      backgroundSize: '40px 40px',
      backgroundAttachment: 'fixed',
    },
    page: { padding: '40px 5%', maxWidth: 1200, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", position: 'relative' },
    
    // Sleek, Flat Enterprise Cards
    glassCard: { 
      background: 'var(--surface-card)', 
      border: '1px solid rgba(255,255,255,0.08)', 
      borderRadius: 16, 
      padding: 32, 
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
    },
    
    header: { fontFamily: "'Inter', sans-serif", fontSize: 32, color: 'var(--ink)', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.5px' },
    subHeader: { color: 'var(--slate)', margin: 0, fontSize: 15, fontWeight: 400 },
    
    metricLabel: { fontSize: 12, fontWeight: 600, color: 'var(--slate)', marginBottom: 12, display: 'block', fontFamily: "'Inter', sans-serif" },
    metricValue: { fontFamily: "'Inter', sans-serif", fontSize: 40, fontWeight: 700, color: 'var(--ink)', lineHeight: 1, letterSpacing: '-1px' },
    
    btnPrimary: { background: 'var(--ink)', color: 'var(--surface)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.2s' },
    btnAction: { background: 'transparent', color: 'var(--ink)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif', transition: 'all 0.2s" },
    
    // NEW QA UI STYLES
    qaCard: { background: 'var(--surface-card)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 24, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 16 },
    btnApprove: { background: 'var(--ink)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--surface)', padding: '10px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif" },
    btnReject: { background: 'transparent', border: '1px solid rgba(239,68,68,0.5)', color: '#ef4444', padding: '10px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }
  };

  return (
    <div style={S.pageWrapper}>
      <div style={S.page}>
        
        <div style={{ marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 24 }}>
          <div>
            <h1 style={S.header}>
              Business Workspace
            </h1>
            <p style={S.subHeader}>Manage your deployment allocations and active campaigns.</p>
          </div>
          
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('history')} style={S.btnAction}>Billing</button>
            <button onClick={() => navigate('creator-tasks')} style={S.btnAction}>All Campaigns</button>
            <button onClick={() => navigate('create-task')} style={S.btnPrimary}>Deploy Campaign</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 56 }}>
          
          <div style={S.glassCard}>
            <span style={S.metricLabel}>Total Deployments</span>
            <div style={S.metricValue}>{stats.totalCampaigns}</div>
          </div>

          <div style={S.glassCard}>
            <span style={S.metricLabel}>Allocated Engagements</span>
            <div style={S.metricValue}>{stats.activeSlots.toLocaleString()}</div>
          </div>

          <div style={{ ...S.glassCard, border: '1px solid rgba(255,255,255,0.2)' }}>
            <span style={{ ...S.metricLabel, color: 'var(--ink)' }}>Verified ROI</span>
            <div style={S.metricValue}>{stats.verifiedEngagements.toLocaleString()}</div>
          </div>
        </div>

        {/* 🔥 NEW QA REVIEW QUEUE 🔥 */}
        {pendingReviews.length > 0 && (
          <div style={{ marginBottom: 56 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, fontWeight: 600, color: 'var(--ink)', margin: 0, letterSpacing: '-0.5px' }}>Action Required: QA Review</h2>
              <span style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 100 }}>{pendingReviews.length} PENDING</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
              {pendingReviews.map(review => (
                <div key={review.id} style={S.qaCard}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--slate)', fontWeight: 600, marginBottom: 4 }}>Campaign Reference</div>
                    <div style={{ fontSize: 15, color: 'var(--ink)', fontWeight: 600 }}>{review.tasks.title}</div>
                  </div>
                  
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: 11, color: 'var(--slate)', fontWeight: 600, marginBottom: 8 }}>Submitted Evidence</div>
                    {review.proof_text && <p style={{ fontSize: 13, color: 'var(--ink)', margin: '0 0 8px 0', lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>"{review.proof_text}"</p>}
                    {review.proof_url && <a href={review.proof_url} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 600, textDecoration: 'underline' }}>View Attachment ↗</a>}
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
                    <button 
                      onClick={() => handleQADecision(review.id, 'rejected')} 
                      disabled={processingId === review.id}
                      style={{ ...S.btnReject, flex: 1, opacity: processingId === review.id ? 0.5 : 1 }}>
                      Reject
                    </button>
                    <button 
                      onClick={() => handleQADecision(review.id, 'approved')} 
                      disabled={processingId === review.id}
                      style={{ ...S.btnApprove, flex: 1, opacity: processingId === review.id ? 0.5 : 1 }}>
                      Approve
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECENT INJECTIONS SECTION */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, fontWeight: 600, color: 'var(--ink)', margin: 0, letterSpacing: '-0.5px' }}>Recent Campaigns</h2>
          </div>
          
          {recentCampaigns.length === 0 ? (
            <div style={{ ...S.glassCard, padding: 80, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: 8, background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, marginBottom: 20, color: 'var(--slate)' }}>📋</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>No Active Campaigns</div>
              <div style={{ fontSize: 14, color: 'var(--slate)', marginBottom: 24, maxWidth: 300 }}>Deploy your first campaign to allocate network engagements.</div>
              <button onClick={() => navigate('create-task')} style={S.btnPrimary}>Deploy Campaign</button>
            </div>
          ) : (
            <div style={{ background: 'var(--surface-card)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 1fr', gap: 16, padding: '16px 24px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.08)' }} className="hide-on-mobile">
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--slate)' }}>Designation</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--slate)' }}>Network</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--slate)' }}>Fulfillment</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--slate)', textAlign: 'right' }}>Status</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {recentCampaigns.map(function(campaign, index) {
                  const isLast = index === recentCampaigns.length - 1;
                  const fulfillment = Math.round(((campaign.current_views || 0) / (campaign.target_views || 1)) * 100);
                  
                  return (
                    <div key={campaign.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 20, padding: '20px 24px', borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                      
                      <div>
                        <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 600, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontFamily: "'Inter', sans-serif" }}>{campaign.title}</div>
                        <div style={{ fontSize: 11, color: 'var(--slate)', fontFamily: 'monospace' }}>ID: {campaign.id.split('-')[0]}</div>
                      </div>

                      <div style={{ fontSize: 13, color: 'var(--slate)', fontWeight: 500, textTransform: 'capitalize' }}>
                        {campaign.platform.replace('_', ' ')}
                      </div>
                      
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                           <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--slate)' }}>Progress</span>
                           <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>{fulfillment}%</span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden', width: '100%' }}>
                          <div style={{ height: '100%', width: `${fulfillment}%`, background: 'var(--ink)', borderRadius: 2 }}></div>
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ background: campaign.status === 'active' ? 'rgba(255,255,255,0.1)' : 'transparent', color: campaign.status === 'active' ? 'var(--ink)' : 'var(--slate)', border: `1px solid ${campaign.status === 'active' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}`, fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 6, textTransform: 'uppercase', display: 'inline-block' }}>
                          {campaign.status}
                        </span>
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
