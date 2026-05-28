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
      <div style={{ padding: '80px 5%', textAlign: 'center', color: 'var(--slate)', fontFamily: "var(--font-body)", fontSize: 14 }}>
        <div style={{ width: 32, height: 32, border: '2px solid var(--line)', borderTopColor: 'var(--gold)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
        <div style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: 11, fontWeight: 700 }}>Initializing Executive Terminal...</div>
      </div>
    );
  }

  const S = {
    page: { padding: '40px 5%', maxWidth: 1100, margin: '0 auto', fontFamily: "var(--font-body)", position: 'relative' },
    glassCard: { 
      background: 'linear-gradient(145deg, var(--surface-card) 0%, var(--surface) 100%)', 
      border: '1px solid var(--line)', 
      borderRadius: 16, 
      padding: 32, 
      boxShadow: '0 24px 48px rgba(0,0,0,0.08)',
      position: 'relative',
      overflow: 'hidden'
    },
    metricLabel: { fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--slate)', marginBottom: 16, display: 'block', fontFamily: "var(--font-display)" },
    metricValue: { fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 800, color: 'var(--ink)', lineHeight: 1, letterSpacing: '-1.5px' },
    btnPrimary: { background: 'var(--gold)', border: 'none', color: '#000', borderRadius: 8, padding: '14px 28px', fontSize: 12, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', display: 'inline-block', fontFamily: "var(--font-display)", textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 8px 24px rgba(212, 175, 55, 0.2)' },
    btnGhost: { background: 'transparent', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: 8, padding: '14px 24px', fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', display: 'inline-block', fontFamily: "var(--font-display)", textTransform: 'uppercase', letterSpacing: '0.5px' },
    accentLine: { position: 'absolute', top: 0, left: 0, height: 2, width: '100%', background: 'linear-gradient(90deg, transparent 0%, var(--gold) 50%, transparent 100%)', opacity: 0.5 },
    
    // NEW QA UI STYLES
    qaCard: { background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 12, padding: 24, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 16 },
    btnApprove: { background: 'var(--lime)', border: 'none', color: '#000', padding: '10px 16px', borderRadius: 6, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer' },
    btnReject: { background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '10px 16px', borderRadius: 6, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer' }
  };

  return (
    <div style={S.page}>
      
      <div style={{ marginBottom: 56, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 24, borderBottom: '1px solid var(--line)', paddingBottom: 32 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 12, height: 12, background: 'var(--gold)', borderRadius: '50%', boxShadow: '0 0 12px var(--gold)' }}></div>
            <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)' }}>Enterprise Terminal</span>
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, color: 'var(--ink)', margin: 0, fontWeight: 800, letterSpacing: '-1px' }}>
            Business Command
          </h1>
        </div>
        
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={() => navigate('history')} style={S.btnGhost}>Billing Ledger</button>
          <button onClick={() => navigate('creator-tasks')} style={S.btnGhost}>All Campaigns</button>
          <button onClick={() => navigate('create-task')} style={S.btnPrimary}>Deploy Campaign</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 56 }}>
        
        <div style={S.glassCard}>
          <div style={S.accentLine}></div>
          <span style={S.metricLabel}>Total Deployments</span>
          <div style={S.metricValue}>{stats.totalCampaigns}</div>
        </div>

        <div style={S.glassCard}>
          <div style={{ ...S.accentLine, opacity: 0.2 }}></div>
          <span style={S.metricLabel}>Allocated Engagements</span>
          <div style={S.metricValue}>{stats.activeSlots.toLocaleString()}</div>
        </div>

        <div style={{ ...S.glassCard, border: '1px solid var(--gold)' }}>
          <div style={{ ...S.accentLine, opacity: 1, width: '50%', left: '25%' }}></div>
          <span style={{ ...S.metricLabel, color: 'var(--ink)' }}>Verified ROI</span>
          <div style={S.metricValue}>{stats.verifiedEngagements.toLocaleString()}</div>
        </div>
      </div>

      {/* 🔥 NEW QA REVIEW QUEUE 🔥 */}
      {pendingReviews.length > 0 && (
        <div style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: 'var(--ink)', margin: 0, letterSpacing: '-0.5px' }}>Action Required: Manual QA</h2>
            <span style={{ background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 100, letterSpacing: '1px' }}>{pendingReviews.length} PENDING</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
            {pendingReviews.map(review => (
              <div key={review.id} style={S.qaCard}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--slate)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Campaign</div>
                  <div style={{ fontSize: 15, color: 'var(--ink)', fontWeight: 800 }}>{review.tasks.title}</div>
                </div>
                
                <div style={{ background: 'var(--surface)', padding: 16, borderRadius: 8, border: '1px dashed var(--line)' }}>
                  <div style={{ fontSize: 10, color: 'var(--slate)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>Earner Proof</div>
                  {review.proof_text && <p style={{ fontSize: 13, color: 'var(--ink)', margin: '0 0 8px 0', lineHeight: 1.5 }}>"{review.proof_text}"</p>}
                  {review.proof_url && <a href={review.proof_url} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: 'var(--gold)', fontWeight: 600, textDecoration: 'none' }}>View Attached Evidence ↗</a>}
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
                    Approve & Release Points
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
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800, color: 'var(--ink)', margin: 0, letterSpacing: '-0.5px' }}>Recent Market Injections</h2>
        </div>
        
        {recentCampaigns.length === 0 ? (
          <div style={{ ...S.glassCard, padding: 80, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: 'var(--surface)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 20 }}>📊</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>No Active Campaigns</div>
            <div style={{ fontSize: 14, color: 'var(--slate)', marginBottom: 24, maxWidth: 300 }}>Deploy your first campaign to inject liquidity into the network.</div>
            <button onClick={() => navigate('create-task')} style={S.btnPrimary}>Launch First Campaign</button>
          </div>
        ) : (
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 16px 32px rgba(0,0,0,0.04)' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.5fr 1fr', gap: 16, padding: '20px 24px', background: 'var(--surface)', borderBottom: '1px solid var(--line)' }} className="hide-on-mobile">
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
                  <div key={campaign.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 20, padding: '24px', borderBottom: isLast ? 'none' : '1px solid var(--line)', alignItems: 'center', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.background = 'var(--surface)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                    
                    <div>
                      <div style={{ fontSize: 15, color: 'var(--ink)', fontWeight: 800, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{campaign.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--slate)', fontFamily: 'monospace', letterSpacing: '1px' }}>ID: {campaign.id.split('-')[0]}</div>
                    </div>

                    <div style={{ fontSize: 12, color: 'var(--slate)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {campaign.platform.replace('_', ' ')}
                    </div>
                    
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                         <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate)' }}>PROGRESS</span>
                         <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--ink)' }}>{fulfillment}%</span>
                      </div>
                      <div style={{ height: 4, background: 'var(--surface)', borderRadius: 2, overflow: 'hidden', width: '100%' }}>
                        <div style={{ height: '100%', width: `${fulfillment}%`, background: 'var(--gold)', borderRadius: 2 }}></div>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ background: campaign.status === 'active' ? 'var(--gold)' : 'var(--surface)', color: campaign.status === 'active' ? '#000' : 'var(--slate)', border: `1px solid ${campaign.status === 'active' ? 'var(--gold)' : 'var(--line)'}`, fontSize: 10, fontWeight: 800, padding: '6px 12px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '1.5px', display: 'inline-block' }}>
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
  );
}
