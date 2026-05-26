import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function CreatorApprovals({ user, navigate, showToast }) {
  const [loading, setLoading] = useState(true);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    if (!user) return;
    fetchPendingApprovals();
  }, [user]);

  async function fetchPendingApprovals() {
    try {
      setLoading(true);
      
      // Fetch all tasks owned by this Creator
      const { data: creatorTasks, error: tasksErr } = await supabase
        .from('tasks')
        .select('id, title, reward_points')
        .eq('creator_id', user.id)
        .in('platform', ['ugc', 'qa_testing']); // Only fetch tasks requiring manual review

      if (tasksErr) throw tasksErr;
      if (!creatorTasks || creatorTasks.length === 0) {
        setPendingReviews([]);
        setLoading(false);
        return;
      }

      const taskIds = creatorTasks.map(t => t.id);

      // Fetch completions for those tasks that are pending review
      const { data: completions, error: compErr } = await supabase
        .from('completions')
        .select('*, profiles ( full_name )')
        .in('task_id', taskIds)
        .eq('status', 'pending_review')
        .order('created_at', { ascending: false });

      if (compErr) throw compErr;

      // Merge the data so we have Task Title and Reward Points available on the card
      const mergedData = (completions || []).map(comp => {
        const parentTask = creatorTasks.find(t => t.id === comp.task_id);
        return { ...comp, task_title: parentTask?.title, reward: parentTask?.reward_points };
      });

      setPendingReviews(mergedData);

    } catch (err) {
      if (showToast) showToast('Failed to load pending approvals.', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleReview(completionId, action, taskId, earnerId, rewardPoints) {
    try {
      setProcessingId(completionId);
      
      const newStatus = action === 'approve' ? 'verified' : 'rejected';

      // 1. Update the completion status
      const { error: updateErr } = await supabase
        .from('completions')
        .update({ status: newStatus })
        .eq('id', completionId);

      if (updateErr) throw updateErr;

      // 2. If Approved, execute the payout and update the task progress
      if (action === 'approve') {
        
        // Give points to earner
        const { data: profile } = await supabase.from('profiles').select('points').eq('id', earnerId).single();
        await supabase.from('profiles').update({ points: (profile?.points || 0) + rewardPoints }).eq('id', earnerId);

        // Increment current_views on the task
        const { data: task } = await supabase.from('tasks').select('current_views').eq('id', taskId).single();
        await supabase.from('tasks').update({ current_views: (task?.current_views || 0) + 1 }).eq('id', taskId);
      }

      // 3. Remove from UI
      setPendingReviews(prev => prev.filter(p => p.id !== completionId));
      if (showToast) showToast(`Submission ${newStatus} successfully.`, 'success');

    } catch (err) {
      if (showToast) showToast(`Failed to process review: ${err.message}`, 'error');
    } finally {
      setProcessingId(null);
    }
  }

  const S = {
    page: { padding: '40px 5%', maxWidth: 900, margin: '0 auto', fontFamily: "var(--font-body)", minHeight: '80vh' },
    headerWrap: { marginBottom: 32, borderBottom: '1px solid var(--line)', paddingBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' },
    card: { background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 16, padding: '24px', marginBottom: '16px', boxShadow: 'var(--shadow)', display: 'flex', flexDirection: 'column', gap: '16px' },
    label: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--slate)', fontFamily: "var(--font-display)" },
    value: { fontSize: 15, color: 'var(--ink)', fontWeight: 600 },
    btnApprove: { flex: 1, background: 'var(--lime)', color: '#000', border: 'none', padding: '12px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontFamily: "var(--font-display)" },
    btnReject: { flex: 1, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', padding: '12px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontFamily: "var(--font-display)" }
  };

  return (
    <div style={S.page}>
      <div style={S.headerWrap}>
        <div>
          <h1 style={{ fontSize: 32, color: 'var(--ink)', fontWeight: 800, fontFamily: "var(--font-display)", marginBottom: 8, letterSpacing: '-0.5px' }}>
            Submission <span style={{ color: 'var(--lime)' }}>Review</span>
          </h1>
          <p style={{ color: 'var(--slate)' }}>Audit proofs uploaded for your UGC and QA Testing campaigns.</p>
        </div>
        <button onClick={() => navigate('creator-dashboard')} style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>← Dashboard</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--slate)' }}>Loading pending submissions...</div>
      ) : pendingReviews.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'var(--surface-card)', border: '1px dashed var(--line)', borderRadius: 16, color: 'var(--slate)' }}>
          You have no pending submissions to review.
        </div>
      ) : (
        <div>
          {pendingReviews.map(review => (
            <div key={review.id} style={S.card}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line)', paddingBottom: 16 }}>
                <div>
                  <div style={S.label}>Campaign</div>
                  <div style={{ ...S.value, fontSize: 16, fontWeight: 700 }}>{review.task_title}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={S.label}>Earner Yield</div>
                  <div style={{ ...S.value, color: 'var(--lime)' }}>{review.reward} PTS</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <div style={S.label}>Submitted By</div>
                  <div style={S.value}>{review.profiles?.full_name || review.social_handle || 'Unknown Earner'}</div>
                </div>
                <div>
                  <div style={S.label}>Submitted At</div>
                  <div style={{ ...S.value, color: 'var(--slate)' }}>{new Date(review.created_at).toLocaleString()}</div>
                </div>
              </div>

              <div style={{ background: 'var(--surface)', padding: 16, borderRadius: 8, border: '1px solid var(--line)' }}>
                <div style={{ ...S.label, marginBottom: 8 }}>Proof Link (Click to verify)</div>
                <a href={review.proof_url || '#'} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', fontSize: 14, wordBreak: 'break-all', textDecoration: 'none', fontWeight: 600 }}>
                  {review.proof_url || 'No URL Provided'}
                </a>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button 
                  onClick={() => handleReview(review.id, 'reject', review.task_id, review.user_id, review.reward)} 
                  disabled={processingId === review.id}
                  style={{ ...S.btnReject, opacity: processingId === review.id ? 0.5 : 1 }}
                >
                  REJECT
                </button>
                <button 
                  onClick={() => handleReview(review.id, 'approve', review.task_id, review.user_id, review.reward)} 
                  disabled={processingId === review.id}
                  style={{ ...S.btnApprove, opacity: processingId === review.id ? 0.5 : 1 }}
                >
                  {processingId === review.id ? 'PROCESSING...' : 'APPROVE & PAY'}
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
