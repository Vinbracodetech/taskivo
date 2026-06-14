import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function CreatorDashboard({ user, navigate, showToast }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalCampaigns: 0, activeSlots: 0, verifiedEngagements: 0 });
  const [recentCampaigns, setRecentCampaigns] = useState([]);
  
  // 🔥 QA QUEUE STATES 🔥
  const [pendingReviews, setPendingReviews] = useState([]);
  const [processingId, setProcessingId] = useState(null);

  // 🔥 SCRIPT VAULT STATES 🔥
  const [scriptModal, setScriptModal] = useState({ isOpen: false, task: null });
  const [copied, setCopied] = useState(false);

  // 🔥 NEW: SUPPORT DESK STATES 🔥
  const [tickets, setTickets] = useState([]);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [ticketForm, setTicketForm] = useState({ category: 'Campaign Moderation', message: '' });

  useEffect(function() {
    if (!user) return;
    fetchCreatorData();
    fetchTickets();
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

  // 🔥 NEW: Fetch Tickets
  async function fetchTickets() {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setTickets(data);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
    }
  }

  // 🔥 NEW: Submit Ticket
  async function handleSubmitTicket() {
    if (!ticketForm.message.trim()) {
      if (showToast) showToast('Please enter a detailed message.', 'error');
      return;
    }
    
    setSubmittingTicket(true);
    try {
      const { error } = await supabase.from('support_tickets').insert({
        user_id: user.id,
        category: ticketForm.category,
        message: ticketForm.message
      });

      if (error) throw error;

      if (showToast) showToast('Support ticket dispatched to Admin.', 'success');
      setShowTicketModal(false);
      setTicketForm({ category: 'Campaign Moderation', message: '' });
      fetchTickets();
    } catch (err) {
      if (showToast) showToast(`Submission failed: ${err.message}`, 'error');
    } finally {
      setSubmittingTicket(false);
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

  // 🔥 COPY SCRIPT LOGIC 🔥
  async function copyNodeScript() {
    if (!scriptModal.task) return;
    
    const scriptToCopy = `<div id="taskivo-node" style="padding: 20px; text-align: center; border: 1px dashed #ccc; border-radius: 8px; margin-top: 30px;">
  <span id="t-status" style="font-family: sans-serif; font-size: 14px; color: #666;">Taskivo Secure Node active. Establishing connection...</span>
  <div id="t-timer" style="font-size: 24px; font-weight: bold; color: #ef4444; margin-top: 10px;"></div>
</div>

<script>
(function() {
  var taskId = '${scriptModal.task.id}';
  var statusEl = document.getElementById('t-status');
  var timerEl = document.getElementById('t-timer');
  
  fetch('https://eartsscxtqxaelopmjmq.supabase.co/functions/v1/taskivo-verify/init', {
    method: 'POST', body: JSON.stringify({ task_id: taskId })
  }).then(res => res.json()).then(data => {
    if(!data.session_id) return;
    statusEl.innerText = "Tracking Organic Dwell Time. Do not switch tabs.";
    var timeLeft = 120;
    var countdown = setInterval(function() {
      if (document.hidden) return;
      timeLeft--;
      timerEl.innerText = timeLeft + "s";
      if (timeLeft <= 0) {
        clearInterval(countdown);
        statusEl.innerText = "Verifying telemetry with server...";
        timerEl.innerText = "";
        fetch('https://eartsscxtqxaelopmjmq.supabase.co/functions/v1/taskivo-verify/claim', {
          method: 'POST', body: JSON.stringify({ session_id: data.session_id })
        }).then(res => res.json()).then(final => {
          if (final.secret_code) {
             document.getElementById('taskivo-node').innerHTML = '<strong style="color: #10b981; font-family: sans-serif;">Verification Complete! Your Single-Use Code is:<br><br><span style="background: #eee; padding: 8px 12px; border-radius: 4px; letter-spacing: 1px; color: #000; word-break: break-all;">' + final.secret_code + '</span></strong>';
          }
        });
      }
    }, 1000);
  });
})();
</script>`;

    try {
      await navigator.clipboard.writeText(scriptToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      if (showToast) showToast('Node Script copied to clipboard!', 'success');
    } catch (err) {
      if (showToast) showToast('Failed to copy script.', 'error');
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
    page: { padding: '40px 5%', maxWidth: 1200, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", position: 'relative' },
    
    glassCard: { 
      background: 'rgba(255, 255, 255, 0.02)', 
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
      borderRadius: 20, 
      padding: 32, 
      boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)'
    },

    header: { fontFamily: "'Inter', sans-serif", fontSize: 32, color: '#ffffff', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.5px' },
    subHeader: { color: 'rgba(255, 255, 255, 0.6)', margin: '0 0 32px 0', fontSize: 15, fontWeight: 400 },
    
    metricValue: { fontFamily: "'Inter', sans-serif", fontSize: 36, color: '#ffffff', fontWeight: 800, letterSpacing: '-1px', margin: '8px 0' },
    metricLabel: { fontSize: 11, color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' },
    
    btnPrimary: { background: '#D4AF37', color: '#000', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.5px' },
    btnSecondary: { background: 'rgba(255,255,255,0.05)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 24px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'background 0.2s' },

    qaCard: { background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 16, padding: 24, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 16, backdropFilter: 'blur(12px)' },
    btnApprove: { background: 'rgba(168, 255, 62, 0.9)', border: 'none', color: '#000', padding: '10px 16px', borderRadius: 6, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.2s' },
    btnReject: { background: 'transparent', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#ef4444', padding: '10px 16px', borderRadius: 6, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.2s' },

    // 🔥 NEW: Support Ticket Styles
    ticketCard: { background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 20, marginBottom: 16 },
    statusOpen: { background: 'rgba(239, 160, 68, 0.1)', color: '#efa044', border: '1px solid rgba(239, 160, 68, 0.3)' },
    statusResolved: { background: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.3)' },
    resolutionBox: { marginTop: 16, padding: 16, background: 'rgba(212, 175, 55, 0.05)', borderLeft: '3px solid #D4AF37', borderRadius: '0 8px 8px 0', fontSize: 13, color: '#ffffff' },
    
    modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
    modalCard: { background: '#0a0a0c', border: '1px solid #D4AF37', borderRadius: 20, width: '100%', maxWidth: 500, padding: 32, boxShadow: '0 24px 50px rgba(0,0,0,0.5)', maxHeight: '90vh', overflowY: 'auto' },
    modalLabel: { fontSize: 11, fontWeight: 700, color: '#D4AF37', textTransform: 'uppercase', marginBottom: 8, display: 'block' },
    input: { background: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: 8, color: '#ffffff', padding: '12px 16px', fontSize: 13, outline: 'none', width: '100%', boxSizing: 'border-box', marginBottom: 20, fontFamily: "'DM Sans', sans-serif" }
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
        <div style={{ marginBottom: 56 }}>
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
                <span style={{ ...S.metricLabel, textAlign: 'right' }}>Actions / Status</span>
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
                      
                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                        <span style={{ background: campaign.status === 'active' ? 'rgba(212, 175, 55, 0.1)' : 'rgba(255, 255, 255, 0.05)', color: campaign.status === 'active' ? '#D4AF37' : 'rgba(255,255,255,0.5)', border: `1px solid ${campaign.status === 'active' ? 'rgba(212, 175, 55, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`, fontSize: 10, fontWeight: 800, padding: '6px 12px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '1.5px', display: 'inline-block' }}>
                          {campaign.status}
                        </span>

                        {campaign.platform === 'blog' && (
                          <button 
                            onClick={(e) => { e.stopPropagation(); setScriptModal({ isOpen: true, task: campaign }); }} 
                            style={{ background: 'rgba(212, 175, 55, 0.1)', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.3)', padding: '6px 12px', borderRadius: 4, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}>
                            {"</>"} Get Node Script
                          </button>
                        )}
                      </div>
                      
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 🔥 NEW: HELP & SUPPORT SECTION (CREATOR) 🔥 */}
        <div style={{ ...S.glassCard, position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, color: '#ffffff', margin: '0 0 4px 0', fontWeight: 800, letterSpacing: '-0.5px' }}>Help & Support</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: 0 }}>Dispatch a ticket to the central administration.</p>
            </div>
            <button onClick={() => setShowTicketModal(true)} style={S.btnPrimary}>+ New Ticket</button>
          </div>

          {tickets.length === 0 ? (
            <div style={{ padding: '32px 0', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 14, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              No open tickets. You are all caught up!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {tickets.map(ticket => (
                <div key={ticket.id} style={S.ticketCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {ticket.category}
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 6, letterSpacing: '0.5px', textTransform: 'uppercase', ...(ticket.status === 'resolved' ? S.statusResolved : S.statusOpen) }}>
                      {ticket.status}
                    </div>
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, margin: 0, lineHeight: 1.5 }}>{ticket.message}</p>
                  
                  {ticket.status === 'resolved' && ticket.resolution_note && (
                    <div style={S.resolutionBox}>
                      <strong style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: 4, color: '#D4AF37' }}>Admin Resolution:</strong>
                      {ticket.resolution_note}
                    </div>
                  )}
                  
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 16 }}>
                    Submitted: {new Date(ticket.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SUPPORT TICKET MODAL */}
        {showTicketModal && (
          <div style={S.modalOverlay}>
            <div style={S.modalCard}>
              <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 800, color: '#ffffff', marginBottom: 8, letterSpacing: '-0.5px' }}>Submit Request</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>Our team will review your ticket and reply with a resolution note directly in your dashboard.</p>
              
              <label style={S.modalLabel}>Issue Category</label>
              <select 
                style={S.input} 
                value={ticketForm.category} 
                onChange={e => setTicketForm({...ticketForm, category: e.target.value})}
              >
                <option value="Campaign Moderation">Campaign Moderation</option>
                <option value="Billing / Deposit">Billing or Deposit Issue</option>
                <option value="Dispute Earner">Dispute Earner Engagement</option>
                <option value="Bug Report">Platform Bug Report</option>
                <option value="General Question">General Question</option>
              </select>

              <label style={S.modalLabel}>Detailed Message</label>
              <textarea 
                style={{ ...S.input, minHeight: 120, resize: 'vertical' }} 
                placeholder="Explain the issue thoroughly so we can assist you quickly..." 
                value={ticketForm.message} 
                onChange={e => setTicketForm({...ticketForm, message: e.target.value})} 
              />

              <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
                <button onClick={() => setShowTicketModal(false)} style={{ ...S.btnSecondary, flex: 1 }}>Cancel</button>
                <button onClick={handleSubmitTicket} disabled={submittingTicket} style={{ ...S.btnPrimary, flex: 1, opacity: submittingTicket ? 0.5 : 1 }}>
                  {submittingTicket ? 'Submitting...' : 'Send to Admin'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 🔥 SCRIPT VAULT MODAL (CREATOR SIDE) 🔥 */}
        {scriptModal.isOpen && scriptModal.task && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <div style={{ background: '#0a0a0c', border: '1px solid #D4AF37', borderRadius: 20, width: '100%', maxWidth: 700, overflow: 'hidden', boxShadow: '0 24px 50px rgba(0,0,0,0.5)' }}>
              
              <div style={{ padding: '24px 32px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ margin: 0, color: '#ffffff', fontFamily: "'Inter', sans-serif", fontSize: 18 }}>Secure Node Vault</h3>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>Campaign: {scriptModal.task.title}</div>
                </div>
                <button onClick={() => setScriptModal({ isOpen: false, task: null })} style={{ background: 'transparent', border: 'none', color: '#ffffff', fontSize: 24, cursor: 'pointer', opacity: 0.5 }}>×</button>
              </div>

              <div style={{ padding: 32 }}>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginTop: 0, marginBottom: 24 }}>
                  Paste this snippet directly into the HTML of your target article to enable zero-bot verification. 
                  This script is permanently bound to Task ID: <span style={{ fontFamily: 'monospace', color: '#D4AF37' }}>{scriptModal.task.id.substring(0,8)}...</span>
                </p>
                
                <div style={{ background: '#000000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 20, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: -10, left: 20, background: '#D4AF37', color: '#000', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '1px' }}>Universal Script</div>
                  <div style={{ fontSize: 13, color: '#10b981', fontFamily: 'monospace', lineHeight: 1.6, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: 250, overflowY: 'auto' }}>
                    &lt;!-- Taskivo Node Integration --&gt;<br/>
                    &lt;div id="taskivo-node" style="padding: 20px; text-align: center; border: 1px dashed #ccc; border-radius: 8px; margin-top: 30px;"&gt;<br/>
                    &nbsp;&nbsp;&lt;span id="t-status" style="font-family: sans-serif; font-size: 14px; color: #666;"&gt;Taskivo Secure Node active. Establishing connection...&lt;/span&gt;<br/>
                    &nbsp;&nbsp;&lt;div id="t-timer" style="font-size: 24px; font-weight: bold; color: #ef4444; margin-top: 10px;"&gt;&lt;/div&gt;<br/>
                    &lt;/div&gt;<br/><br/>
                    &lt;script&gt;<br/>
                    (function() {"{"}<br/>
                    &nbsp;&nbsp;var taskId = '{scriptModal.task.id}';<br/>
                    &nbsp;&nbsp;var statusEl = document.getElementById('t-status');<br/>
                    &nbsp;&nbsp;var timerEl = document.getElementById('t-timer');<br/>
                    &nbsp;&nbsp;fetch('https://eartsscxtqxaelopmjmq.supabase.co/functions/v1/taskivo-verify/init', {"{"}<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;method: 'POST', body: JSON.stringify({"{"} task_id: taskId {"}"})<br/>
                    &nbsp;&nbsp;{"}"}).then(res =&gt; res.json()).then(data =&gt; {"{"}<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;if(!data.session_id) return;<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;statusEl.innerText = "Tracking Organic Dwell Time. Do not switch tabs.";<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;var timeLeft = 120;<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;var countdown = setInterval(function() {"{"}<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (document.hidden) return;<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;timeLeft--;<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;timerEl.innerText = timeLeft + "s";<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (timeLeft &lt;= 0) {"{"}<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;clearInterval(countdown);<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;statusEl.innerText = "Verifying telemetry with server...";<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;timerEl.innerText = "";<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;fetch('https://eartsscxtqxaelopmjmq.supabase.co/functions/v1/taskivo-verify/claim', {"{"}<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;method: 'POST', body: JSON.stringify({"{"} session_id: data.session_id {"}"})<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"}"}).then(res =&gt; res.json()).then(final =&gt; {"{"}<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if (final.secret_code) {"{"}<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;document.getElementById('taskivo-node').innerHTML = '&lt;strong style="color: #10b981; font-family: sans-serif;"&gt;Verification Complete! Your Single-Use Code is:&lt;br&gt;&lt;br&gt;&lt;span style="background: #eee; padding: 8px 12px; border-radius: 4px; letter-spacing: 1px; color: #000; word-break: break-all;"&gt;' + final.secret_code + '&lt;/span&gt;&lt;/strong&gt;';<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"}"}<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"}"});<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"}"}<br/>
                    &nbsp;&nbsp;&nbsp;&nbsp;{"}"}, 1000);<br/>
                    &nbsp;&nbsp;{"}"});<br/>
                    {"}"})();<br/>
                    &lt;/script&gt;
                  </div>
                </div>

                <button onClick={copyNodeScript} style={{ width: '100%', background: copied ? '#10b981' : '#D4AF37', border: 'none', color: '#000', padding: '16px', borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '1px', marginTop: 24, transition: 'all 0.2s' }}>
                  {copied ? '✓ COPIED TO CLIPBOARD' : '📋 COPY FULL SCRIPT TO CLIPBOARD'}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
