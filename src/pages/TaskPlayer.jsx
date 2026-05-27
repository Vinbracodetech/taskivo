import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function TaskPlayer({ session, navigate, taskId }) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);
  const [status, setStatus] = useState('waiting'); // waiting, active, verifying, completed
  const [seoCodeInput, setSeoCodeInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadTask() {
      try {
        const { data } = await supabase.from('tasks').select('*').eq('id', taskId).single();
        if (data) {
          setTask(data);
          setTimer(data.watch_duration);
        } else {
          setErrorMsg("Task not found or expired.");
        }
      } catch (err) {
        setErrorMsg("Failed to encrypt data link.");
      } finally {
        setLoading(false);
      }
    }
    loadTask();
  }, [taskId]);

  // Anti-Cheat Timer for YouTube Videos
  useEffect(() => {
    let interval;
    if (status === 'active' && task?.platform === 'youtube' && timer > 0) {
      interval = setInterval(() => {
        // Only count down if tab is visible
        if (!document.hidden) {
          setTimer(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              setStatus('verifying');
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, timer, task]);

  // Extract YouTube ID for clean embedding
  function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  async function completeTask() {
    try {
      setStatus('processing');
      setErrorMsg('');

      // 1. Verify SEO Code if applicable
      if (task.platform === 'blog') {
        if (seoCodeInput.trim().toUpperCase() !== task.secret_code.trim().toUpperCase()) {
          setErrorMsg("Invalid verification code. Did you stay on the page until the timer ended?");
          setStatus('waiting');
          return;
        }
      }

      // 2. Mark as completed in DB
      const { error: compErr } = await supabase.from('completions').insert({
        user_id: session.user.id,
        task_id: task.id,
        status: (task.platform === 'ugc' || task.platform === 'qa_testing') ? 'pending_approval' : 'approved',
        reward_points: task.reward_points
      });

      if (compErr) throw new Error("You have already completed this task.");

      // 3. Payout immediately if it's an automated task
      if (task.platform === 'youtube' || task.platform === 'blog') {
        const { data: userProfile } = await supabase.from('profiles').select('points').eq('id', session.user.id).single();
        await supabase.from('profiles').update({ points: userProfile.points + task.reward_points }).eq('id', session.user.id);
        await supabase.from('tasks').update({ current_views: task.current_views + 1 }).eq('id', task.id);
      }

      setStatus('completed');
    } catch (err) {
      setErrorMsg(err.message);
      setStatus('waiting');
    }
  }

  if (loading) return <div style={{ padding: 100, textAlign: 'center', color: 'var(--slate)' }}>Loading Mission Data...</div>;
  if (!task) return <div style={{ padding: 100, textAlign: 'center', color: '#ef4444' }}>{errorMsg || "Mission Unavailable"}</div>;

  const isVideo = task.platform === 'youtube';
  const isSEO = task.platform === 'blog';
  const isManual = task.platform === 'ugc' || task.platform === 'qa_testing';

  return (
    <div style={{ padding: '40px 5%', maxWidth: 800, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
      <button onClick={() => navigate('tasks')} style={{ background: 'transparent', border: 'none', color: 'var(--slate)', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 24 }}>← Abort Mission</button>
      
      <div style={{ background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
        
        {/* HEADER */}
        <div style={{ padding: '32px 32px 24px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'inline-block', background: 'var(--lime-dim)', color: 'var(--lime)', border: '1px solid rgba(168,255,62,0.2)', fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 4, textTransform: 'uppercase', marginBottom: 12 }}>
            {task.platform} Mission
          </div>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, color: 'var(--ink)', marginBottom: 8, fontWeight: 800 }}>{task.title}</h1>
          <div style={{ fontSize: 14, color: 'var(--slate)' }}>Payout: <strong style={{ color: 'var(--ink)' }}>{task.reward_points} PTS</strong></div>
        </div>

        <div style={{ padding: 32 }}>
          {errorMsg && (
            <div style={{ padding: 16, background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: 12, marginBottom: 24, fontSize: 14, fontWeight: 600 }}>
              {errorMsg}
            </div>
          )}

          {/* ── 1. VIDEO PLAYER ── */}
          {isVideo && (
            <div>
              {status === 'waiting' ? (
                <div style={{ textAlign: 'center', padding: 40, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--line)' }}>
                  <div style={{ fontSize: 15, color: 'var(--slate)', marginBottom: 24 }}>Watch the video completely to pass verification. Fast-forwarding is disabled.</div>
                  <button onClick={() => setStatus('active')} style={{ background: 'var(--lime)', color: '#000', border: 'none', padding: '14px 28px', borderRadius: 8, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>Start Verification Timer</button>
                </div>
              ) : (
                <>
                  <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 12, background: '#000', marginBottom: 24 }}>
                    <iframe 
                      src={`https://www.youtube.com/embed/${getYouTubeId(task.url)}?autoplay=1&controls=0&disablekb=1&modestbranding=1&rel=0`} 
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }} 
                      frameBorder="0" 
                      allow="autoplay; encrypted-media" 
                      allowFullScreen 
                    />
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 20, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--line)' }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Time Remaining</div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: timer > 0 ? '#ef4444' : 'var(--lime)', fontFamily: "'Inter', sans-serif" }}>{timer}s</div>
                    </div>
                    {status === 'verifying' && (
                      <button onClick={completeTask} style={{ background: 'var(--ink)', color: 'var(--surface)', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>Claim {task.reward_points} PTS</button>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── 2. SEO SEARCH ENFORCER ── */}
          {isSEO && status !== 'completed' && (
            <div>
              <div style={{ background: 'var(--surface)', padding: 24, borderRadius: 12, border: '1px solid var(--line)', marginBottom: 24 }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: 16, color: 'var(--ink)' }}>Search Protocol</h3>
                <ol style={{ paddingLeft: 20, margin: 0, color: 'var(--slate)', lineHeight: 1.8, fontSize: 14 }}>
                  <li>Open a new browser tab and go to <strong>Google.com</strong></li>
                  <li>Search for this exact phrase: <strong style={{ color: 'var(--ink)', background: 'var(--lime-dim)', padding: '2px 6px', borderRadius: 4 }}>{task.search_keyword}</strong></li>
                  <li>Find the link for <strong>{new URL(task.url).hostname}</strong> and click it.</li>
                  <li>Scroll to the bottom of the article and wait for the verification timer to finish.</li>
                  <li>Copy the Secret Code and paste it below.</li>
                </ol>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <input 
                  type="text" 
                  placeholder="Paste Secret Code Here..." 
                  value={seoCodeInput} 
                  onChange={e => setSeoCodeInput(e.target.value)} 
                  style={{ flex: 1, padding: 16, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, color: 'var(--ink)', fontSize: 16, outline: 'none', fontFamily: 'monospace', textTransform: 'uppercase' }} 
                />
                <button 
                  onClick={completeTask} 
                  disabled={!seoCodeInput}
                  style={{ background: seoCodeInput ? 'var(--lime)' : 'var(--surface)', color: seoCodeInput ? '#000' : 'var(--slate)', border: 'none', padding: '0 24px', borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: seoCodeInput ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}
                >
                  Verify
                </button>
              </div>
            </div>
          )}

          {/* ── 3. UGC / QA MANUAL UPLOAD ── */}
          {isManual && status !== 'completed' && (
            <div style={{ textAlign: 'center', padding: 40, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--line)' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📤</div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: 18, color: 'var(--ink)' }}>Manual Submission Required</h3>
              <p style={{ color: 'var(--slate)', fontSize: 14, marginBottom: 24 }}>Follow the instructions on the creator's page and upload your proof directly to the provided external form.</p>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                <a href={task.url} target="_blank" rel="noopener noreferrer" style={{ background: 'var(--surface-card)', color: 'var(--ink)', border: '1px solid var(--line)', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>View Instructions</a>
                <button onClick={completeTask} style={{ background: 'var(--ink)', color: 'var(--surface)', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>Mark as Submitted</button>
              </div>
              <div style={{ fontSize: 12, color: 'var(--slate)', marginTop: 16 }}>Payout will be held in escrow until approved by the Creator.</div>
            </div>
          )}

          {/* ── SUCCESS STATE ── */}
          {status === 'completed' && (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <div style={{ width: 64, height: 64, background: 'rgba(168,255,62,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid var(--lime)' }}>
                <span style={{ fontSize: 24 }}>✓</span>
              </div>
              <h2 style={{ fontSize: 24, color: 'var(--ink)', marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>Mission Accomplished</h2>
              <p style={{ color: 'var(--slate)', fontSize: 15, marginBottom: 32 }}>
                {isManual ? "Proof submitted. Payout pending creator approval." : `Liquidity secured. ${task.reward_points} PTS added to treasury.`}
              </p>
              <button onClick={() => navigate('tasks')} style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>Return to Feed</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
