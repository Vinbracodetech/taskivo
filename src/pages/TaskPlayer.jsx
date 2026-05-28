import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function TaskPlayer({ session, navigate, taskId }) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);
  const [status, setStatus] = useState('waiting'); // waiting, active, verifying, processing, completed
  const [seoCodeInput, setSeoCodeInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // 🔥 NEW EVIDENCE UPLOAD STATES 🔥
  const [proofText, setProofText] = useState('');
  const [proofUrl, setProofUrl] = useState('');

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
        setErrorMsg("Failed to decrypt data link.");
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
      
      const isManual = task.platform === 'ugc' || task.platform === 'qa_testing';

      // 1. Verify SEO Code if applicable
      if (task.platform === 'blog') {
        if (seoCodeInput.trim().toUpperCase() !== task.secret_code.trim().toUpperCase()) {
          setErrorMsg("Invalid verification code. Did you stay on the page until the timer ended?");
          setStatus('waiting');
          return;
        }
      }

      // 2. Verify Manual Proof if applicable
      if (isManual) {
        if (!proofText.trim() && !proofUrl.trim()) {
          setErrorMsg("Action Denied: You must provide a bug report/text explanation or an evidence link.");
          setStatus('waiting');
          return;
        }
      }

      // 3. Insert into Completions Table
      // Notice: we strictly use 'pending' so it routes to the Creator Dashboard QA Queue
      const { error: compErr } = await supabase.from('completions').insert({
        user_id: session.user.id,
        task_id: task.id,
        status: isManual ? 'pending' : 'approved',
        reward_points: task.reward_points,
        proof_text: isManual ? proofText : null,
        proof_url: isManual ? proofUrl : null
      });

      if (compErr) throw new Error("Our records show you have already engaged with this task.");

      // 4. Payout immediately ONLY if it's an automated task
      if (!isManual) {
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
    <div style={{ padding: '40px 5%', maxWidth: 800, margin: '0 auto', fontFamily: "var(--font-body)" }}>
      <button onClick={() => navigate('tasks')} style={{ background: 'transparent', border: 'none', color: 'var(--slate)', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 24, fontFamily: "var(--font-display)" }}>← Abort Mission</button>
      
      <div style={{ background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 20, overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
        
        {/* HEADER */}
        <div style={{ padding: '32px 32px 24px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'inline-block', background: 'var(--lime-dim)', color: 'var(--lime)', border: '1px solid rgba(168,255,62,0.2)', fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 4, textTransform: 'uppercase', marginBottom: 12 }}>
            {task.platform.replace('_', ' ')} Mission
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, color: 'var(--ink)', marginBottom: 8, fontWeight: 800, letterSpacing: '-0.5px' }}>{task.title}</h1>
          <div style={{ fontSize: 14, color: 'var(--slate)' }}>Payout Target: <strong style={{ color: 'var(--ink)' }}>{task.reward_points} PTS</strong></div>
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
                  <button onClick={() => setStatus('active')} style={{ background: 'var(--lime)', color: '#000', border: 'none', padding: '14px 28px', borderRadius: 8, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: "var(--font-display)", textTransform: 'uppercase', letterSpacing: '1px', boxShadow: '0 8px 16px rgba(168,255,62,0.2)' }}>Start Verification Timer</button>
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
                      <div style={{ fontSize: 24, fontWeight: 800, color: timer > 0 ? '#ef4444' : 'var(--lime)', fontFamily: "var(--font-display)" }}>{timer}s</div>
                    </div>
                    {status === 'verifying' && (
                      <button onClick={completeTask} disabled={status === 'processing'} style={{ background: 'var(--ink)', color: 'var(--surface)', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>
                        {status === 'processing' ? 'Verifying...' : `Claim ${task.reward_points} PTS`}
                      </button>
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
                <h3 style={{ margin: '0 0 16px 0', fontSize: 16, color: 'var(--ink)', fontFamily: "var(--font-display)" }}>Search Protocol</h3>
                <ol style={{ paddingLeft: 20, margin: 0, color: 'var(--slate)', lineHeight: 1.8, fontSize: 14 }}>
                  <li>Open a new browser tab and go to <strong>Google.com</strong></li>
                  <li>Search for this exact phrase: <strong style={{ color: 'var(--ink)', background: 'var(--lime-dim)', padding: '2px 6px', borderRadius: 4 }}>{task.search_keyword}</strong></li>
                  <li>Find the link for <strong>{new URL(task.url).hostname}</strong> and click it.</li>
                  <li>Scroll to the bottom of the article and wait for the verification timer to finish.</li>
                  <li>Copy the Secret Code and paste it below.</li>
                </ol>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <input 
                  type="text" 
                  placeholder="Paste Secret Code Here..." 
                  value={seoCodeInput} 
                  onChange={e => setSeoCodeInput(e.target.value)} 
                  style={{ flex: '1 1 200px', padding: 16, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, color: 'var(--ink)', fontSize: 16, outline: 'none', fontFamily: 'monospace', textTransform: 'uppercase' }} 
                />
                <button 
                  onClick={completeTask} 
                  disabled={!seoCodeInput || status === 'processing'}
                  style={{ background: seoCodeInput ? 'var(--lime)' : 'var(--surface)', color: seoCodeInput ? '#000' : 'var(--slate)', border: 'none', padding: '16px 32px', borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: seoCodeInput ? 'pointer' : 'not-allowed', transition: 'all 0.2s', fontFamily: "var(--font-display)", textTransform: 'uppercase', letterSpacing: '1px' }}
                >
                  {status === 'processing' ? 'Checking...' : 'Verify'}
                </button>
              </div>
            </div>
          )}

          {/* ── 3. UGC / QA MANUAL UPLOAD ENGINE ── */}
          {isManual && status !== 'completed' && (
            <div style={{ background: 'var(--surface)', padding: 32, borderRadius: 16, border: '1px solid var(--line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, background: 'var(--surface-card)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, border: '1px solid var(--line)' }}>📤</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 18, color: 'var(--ink)', fontFamily: "var(--font-display)" }}>Evidence Required</h3>
                  <div style={{ fontSize: 13, color: 'var(--slate)' }}>Manual creator review process</div>
                </div>
              </div>
              
              <p style={{ color: 'var(--slate)', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
                Review the task instructions at the target asset. Once you have completed the requirements, upload your evidence below. Your payout will be escrowed until the Creator approves your submission.
              </p>

              <a href={task.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: 'var(--surface-card)', color: 'var(--ink)', border: '1px solid var(--line)', padding: '12px 24px', borderRadius: 8, fontSize: 13, fontWeight: 700, textDecoration: 'none', marginBottom: 32 }}>↗ Open Target Asset / Instructions</a>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--slate)', marginBottom: 8, display: 'block', fontFamily: "var(--font-display)" }}>Submission Notes / Bug Report (Optional)</label>
                <textarea 
                  rows="4" 
                  placeholder="Describe what you did or list any bugs found..." 
                  value={proofText}
                  onChange={e => setProofText(e.target.value)}
                  style={{ width: '100%', padding: 16, background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 12, color: 'var(--ink)', fontSize: 14, outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: "var(--font-body)" }}
                />
              </div>

              <div style={{ marginBottom: 32 }}>
                <label style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--slate)', marginBottom: 8, display: 'block', fontFamily: "var(--font-display)" }}>Evidence URL (Screenshot / Video Link)</label>
                <input 
                  type="url" 
                  placeholder="https://drive.google.com/... or https://prnt.sc/..." 
                  value={proofUrl}
                  onChange={e => setProofUrl(e.target.value)}
                  style={{ width: '100%', padding: 16, background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 12, color: 'var(--ink)', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: "var(--font-body)" }}
                />
              </div>

              <button 
                onClick={completeTask} 
                disabled={(!proofText.trim() && !proofUrl.trim()) || status === 'processing'}
                style={{ width: '100%', background: (proofText || proofUrl) ? 'var(--ink)' : 'var(--surface-card)', color: (proofText || proofUrl) ? 'var(--surface)' : 'var(--slate)', border: (proofText || proofUrl) ? 'none' : '1px solid var(--line)', padding: '16px', borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: (proofText || proofUrl) ? 'pointer' : 'not-allowed', transition: 'all 0.2s', fontFamily: "var(--font-display)", textTransform: 'uppercase', letterSpacing: '1px' }}
              >
                {status === 'processing' ? 'Submitting to Escrow...' : 'Submit Evidence for Review'}
              </button>
            </div>
          )}

          {/* ── SUCCESS STATE ── */}
          {status === 'completed' && (
            <div style={{ textAlign: 'center', padding: 40, background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--lime)' }}>
              <div style={{ width: 64, height: 64, background: 'var(--lime-dim)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid var(--lime)' }}>
                <span style={{ fontSize: 24, color: 'var(--lime)' }}>✓</span>
              </div>
              <h2 style={{ fontSize: 24, color: 'var(--ink)', marginBottom: 8, fontFamily: "var(--font-display)", letterSpacing: '-0.5px' }}>Mission Accomplished</h2>
              <p style={{ color: 'var(--slate)', fontSize: 15, marginBottom: 32, lineHeight: 1.5 }}>
                {isManual ? "Your proof has been submitted securely. Payout is held in escrow pending Creator QA approval." : `Liquidity verified. ${task.reward_points} PTS added to your treasury.`}
              </p>
              <button onClick={() => navigate('tasks')} style={{ background: 'var(--surface-card)', border: '1px solid var(--line)', color: 'var(--ink)', padding: '14px 28px', borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: "var(--font-display)", textTransform: 'uppercase', letterSpacing: '1px' }}>Return to Feed</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
