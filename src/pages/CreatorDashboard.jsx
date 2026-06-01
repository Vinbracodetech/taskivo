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

  // 🔥 PREMIUM FINTECH STYLE OBJECT 🔥
  const S = {
    pageWrapper: {
      minHeight: '100vh',
      backgroundColor: '#0a0a0c', // Deepest rich black
      backgroundImage: `
        radial-gradient(circle at 15% 50px, rgba(212, 175, 55, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 85% 30%, rgba(168, 255, 62, 0.04) 0%, transparent 50%),
        url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z' fill='none' stroke='%23ffffff' stroke-width='1' stroke-opacity='0.02'/%3E%3C/svg%3E")
      `,
      backgroundSize: '100% 100%, 100% 100%, 40px 40px',
      backgroundAttachment: 'fixed',
    },
    page: { padding: '40px 5%', maxWidth: 1200, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", position: 'relative' },
    
    // Frosted Glass Analytic Cards
    glassCard: { 
      background: 'rgba(255, 255, 255, 0.02)', 
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)', // Sleek top highlight
      borderRadius: 20, 
      padding: 32, 
      boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)'
    },

    // Strict, Elite Typography
    header: { fontFamily: "'Inter', sans-serif", fontSize: 32, color: '#ffffff', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.5px' },
    subHeader: { color: 'rgba(255, 255, 255, 0.6)', margin: '0 0 32px 0', fontSize: 15, fontWeight: 400 },
    
    // Financial Metrics (Big, bold numbers)
    metricValue: { fontFamily: "'Inter', sans-serif", fontSize: 36, color: '#ffffff', fontWeight: 800, letterSpacing: '-1px', margin: '8px 0' },
    metricLabel: { fontSize: 11, color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' },
    
    // Elite Buttons (Sleek, sharp corners)
    btnPrimary: { background: '#D4AF37', color: '#000', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.5px' },
    btnSecondary: { background: 'rgba(255,255,255,0.05)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 24px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'background 0.2s' },

    // Integrated QA Styles mapped to FinTech UI
    qaCard: { background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 16, padding: 24, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 16, backdropFilter: 'blur(12px)' },
    btnApprove: { background: 'rgba(168, 255, 62, 0.9)', border: 'none', color: '#000', padding: '10px 16px', borderRadius: 6, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.2s' },
    btnReject: { background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#ef4444', padding: '10px 16px', borderRadius: 6, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.2s' }
  };

  if (loading) {
    return (
      <div style={{ ...S.pageWrapper, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
          <div style={{ width: 32, height: 32, border: '2px solid rgba(255, 255, 255, 0.1)', borderTopColor: '#D4AF37', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
          <div style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: 11, fontWeight: 700 }}>Initializing Executive Terminal...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.pageWrapper}>
      <div style={S.page}>
        
        <div style={{ marginBottom: 56, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 12, height: 12, background: '#D4AF37', borderRadius: '50%', boxShadow: '0 0 12px rgba(212, 175, 55, 0.5)' }}></div>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: '#D4AF37', fontFamily: "'Inter', sans-serif" }}>Enterprise Terminal</span>
            </div>
            <h1 style={S.header}>
              Business Command
            </h1>
            <p style={{ ...S.subHeader, marginBottom: 0 }}>Manage your deployment allocations and active campaigns.</p>
          </div>
          
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button onClick={() => navigate('history')} style={S.btnSecondary}>Billing Ledger</button>
            <button onClick={() => navigate('creator-tasks')} style={S.btnSecondary}>All Campaigns</button>
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

          <div style={{ ...S.glassCard, border: '1px solid rgba(212, 175, 55, 0.3)', background: 'rgba(212, 175, 55, 0.03)' }}>
            <span style={{ ...S.metricLabel, color: '#ffffff' }}>Verified ROI</span>
            <div style={S.metricValue}>{stats.verifiedEngagements.toLocaleString()}</div>
          </div>
        </div>

        {/* 🔥 QA REVIEW QUEUE 🔥 */}
        {pendingReviews.length > 0 && (
          <div style={{ marginBottom: 56 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, fontWeight: 700, color: '#ffffff', margin: 0, letterSpacing: '-0.5px' }}>Action Required: Manual QA</h2>
              <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 100, letterSpacing: '1px' }}>{pendingReviews.length} PENDING</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
              {pendingReviews.map(review => (
                <div key={review.id} style={S.qaCard}>
                  <div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Campaign Reference</div>
                    <div style={{ fontSize: 15, color: '#ffffff', fontWeight: 700 }}>{review.tasks.title}</div>
                  </div>
                  
                  <div style={{ background: 'rgba(0, 0, 0, 0.4)', padding: 16, borderRadius: 8, border: '1px dashed rgba(255, 255, 255, 0.1)' }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>Earner Proof</div>
                    {review.proof_text && <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', margin: '0 0 8px 0', lineHeight: 1.5 }}>"{review.proof_text}"</p>}
                    {review.proof_url && <a href={review.proof_url} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#D4AF37', fontWeight: 600, textDecoration: 'none' }}>View Attached Evidence ↗</a>}
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginTop: 'auto' }}>
                    <button 
                      onClick={() => handleQADecision(review.id, 'rejected')} 
                      disabled={processingId === review.id}
                      style={{ ...S.btnReject, flex: 1, opacity: processingId === review.id ? 0.5 : 1 }}>
                      Reject (Refund Escrow)
                    </button>
                    <button 
                      onClick={() => handleQADecision(review.id, 'approved')} 
                      disabled={processingId === review.id}
                      style={{ ...S.btnApprove, flex: 1, opacity: processingId === review.id ? 0.5 : 1 }}>
                      Approve & Release
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
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, fontWeight: 700, color: '#ffffff', margin: 0, letterSpacing: '-0.5px' }}>Recent Market Injections</h2>
          </div>
          
          {recentCampaigns.length === 0 ? (
            <div style={{ ...S.glassCard, padding: 80, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 20 }}>📊</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>No Active Campaigns</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 24, maxWidth: 300 }}>Deploy your first campaign to inject liquidity into the network.</div>
              <button onClick={() => navigate('create-task')} style={S.btnPrimary}>Launch First Campaign</button>
            </div>
          ) : (
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 16px 32px rgba(0,0,0,0.2)', backdropFilter: 'blur(16px)' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 1fr', gap: 16, padding: '20px 24px', background: 'rgba(0, 0, 0, 0.3)', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }} className="hide-on-mobile">
                <span style={S.metricLabel}>Campaign Designation</span>
                <span style={S.metricLabel}>Network</span>
                <span style={S.metricLabel}>Fulfillment Trajectory</span>
                <span style={{ ...S.metricLabel, textAlign: 'right' }}>Status</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {recentCampaigns.map(function(campaign, index) {
                  const isLast = index === recentCampaigns.length - 1;
                  const fulfillment = Math.round(((campaign.current_views || 0) / (campaign.target_views || 1)) * 100);
                  
                  return (
                    <div key={campaign.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 20, padding: '24px', borderBottom: isLast ? 'none' : '1px solid rgba(255, 255, 255, 0.06)', alignItems: 'center', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                      
                      <div>
                        <div style={{ fontSize: 15, color: '#ffffff', fontWeight: 700, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{campaign.title}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', letterSpacing: '1px' }}>ID: {campaign.id.split('-')[0]}</div>
                      </div>

                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {campaign.platform.replace('_', ' ')}
                      </div>
                      
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                           <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>PROGRESS</span>
                           <span style={{ fontSize: 12, fontWeight: 800, color: '#ffffff' }}>{fulfillment}%</span>
                        </div>
                        <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden', width: '100%' }}>
                          <div style={{ height: '100%', width: `${fulfillment}%`, background: '#D4AF37', borderRadius: 2 }}></div>
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ background: campaign.status === 'active' ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255, 255, 255, 0.05)', color: campaign.status === 'active' ? '#D4AF37' : 'rgba(255,255,255,0.5)', border: `1px solid ${campaign.status === 'active' ? 'rgba(212, 175, 55, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`, fontSize: 10, fontWeight: 800, padding: '6px 12px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '1.5px', display: 'inline-block' }}>
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
