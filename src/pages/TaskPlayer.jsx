import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export default function TaskPlayer({ session, navigate, taskId }) {
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  
  // Timer States (For Automated Tasks)
  const [timer, setTimer] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [verification, setVerification] = useState(false);
  
  // Security & Input States
  const [cooldown, setCooldown] = useState(null);
  const [handle, setHandle] = useState('');
  const [proofUrl, setProofUrl] = useState('');
  const [proofText, setProofText] = useState(''); // Added for Manual QA text
  const [seoCodeInput, setSeoCodeInput] = useState(''); // Added for SEO Payload
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [cheatWarning, setCheatWarning] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const ytPlayerRef = useRef(null);

  useEffect(() => {
    async function init() {
      // Check cooldown
      const { data: c } = await supabase.from('completions').select('created_at').eq('task_id', taskId).eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).maybeSingle();
      if (c) {
        const h = (new Date() - new Date(c.created_at)) / 3600000;
        if (h < 24) { setCooldown(Math.ceil(24 - h)); setLoading(false); return; }
      }
      
      // Fetch task
      const { data: t } = await supabase.from('tasks').select('*').eq('id', taskId).single();
      if (t) { 
        setTask(t); 
        setTimer(t.watch_duration); 
      }
      setLoading(false);
    }
    if (user?.id) init();
  }, [taskId, user]);

  const isManualTask = task?.platform === 'ugc' || task?.platform === 'qa_testing';
  const isBlog = task?.platform === 'blog';

  // 🔥 AUTOMATED TIMER LOGIC (Only runs if it's a YouTube task) 🔥
  useEffect(() => {
    if (!task || cooldown || verification || isManualTask || isBlog) return;
    
    // For YouTube specifically
    if (task.platform === 'youtube') {
      const loadPlayer = () => {
        if (ytPlayerRef.current) return; 
        const vidMatch = task.url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
        const vidId = vidMatch ? vidMatch[1] : '';
        ytPlayerRef.current = new window.YT.Player('yt-frame', {
          videoId: vidId,
          playerVars: { playsinline: 1, rel: 0, controls: 0, disablekb: 1 },
          events: {
            onReady: (e) => { e.target.setPlaybackRate(1); },
            onStateChange: (e) => {
              if (e.data === 1) {
                setIsLive(true); setCheatWarning(""); e.target.setPlaybackRate(1);
              } else { setIsLive(false); }
              if (e.data === 0) {
                setTimer((currentTimer) => {
                   if (currentTimer > 0) { setCheatWarning("⚠️ Fast-forwarding detected. Timer reset."); return task.watch_duration; }
                   return currentTimer;
                });
              }
            }
          }
        });
      };
      if (!window.YT || !window.YT.Player) {
        const s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api'; window.onYouTubeIframeAPIReady = loadPlayer; document.body.appendChild(s);
      } else { loadPlayer(); }
    }
  }, [task, cooldown, verification, isManualTask, isBlog]);

  // Tab-Switch Detection
  useEffect(() => {
    if (isManualTask || isBlog) return; // Allow tab switching for external proofs and Google Search
    const handleVisibility = () => {
      if (document.hidden) {
        setIsLive(false);
        if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') ytPlayerRef.current.pauseVideo();
        if (!verification) setCheatWarning("⚠️ Timer paused. You must keep this tab visible.");
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [verification, isManualTask, isBlog]);

  // Countdown execution
  useEffect(() => {
    if (isManualTask || isBlog) return;
    if (timer <= 0 && task && !verification) {
      setVerification(true); setIsLive(false); setCheatWarning("");
      if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') ytPlayerRef.current.pauseVideo();
      return;
    }
    let interval;
    if (isLive && !document.hidden && timer > 0) { interval = setInterval(() => { setTimer((prev) => prev - 1); }, 1000); }
    return () => clearInterval(interval);
  }, [isLive, timer, task, verification, isManualTask, isBlog]);

  function handleOpenApp() { window.open(task.url, '_blank'); setGateUnlocked(true); setIsLive(true); }

  async function claimTask() {
    setSubmitting(true);
    
    // 🔥 1. VALIDATION & BURNABLE TOKEN LAYER 🔥
    if (isBlog) {
      const token = seoCodeInput.trim();
      
      // 🔥 NEW VALIDATION: Must start with TSK- and be exactly 10 characters long
      if (!token || !token.startsWith('TSK-') || token.length !== 10) {
        alert("Invalid payload format. Please ensure you copied the entire Single-Use Code.");
        setSubmitting(false);
        return;
      }

      // Check if the token is valid, belongs to this task, and hasn't been used yet
      const { data: sessionData, error: sessionError } = await supabase
        .from('task_sessions')
        .select('*')
        .eq('id', token)
        .eq('task_id', task.id) 
        .eq('status', 'claimed') // 'claimed' means the server timer finished but it hasn't been redeemed by an Earner yet
        .single();

      if (sessionError || !sessionData) {
        alert("🚨 Invalid, expired, or previously used Secret Code. You must generate your own unique code by visiting the target asset.");
        setSubmitting(false);
        return;
      }

      // BURN THE TOKEN: Mark it as redeemed so it can never be used again
      const { error: burnError } = await supabase
        .from('task_sessions')
        .update({ status: 'redeemed', user_id: user.id })
        .eq('id', sessionData.id);

      if (burnError) {
        alert("Network error burning token. Please try again.");
        setSubmitting(false);
        return;
      }

    } else if (isManualTask) {
      if (!proofUrl.trim() && !proofText.trim()) { 
        alert("Please provide a valid evidence link or written notes for the Creator."); 
        setSubmitting(false); 
        return; 
      }
    } else {
      if (!handle.trim()) { 
        alert("Enter your platform handle to claim points."); 
        setSubmitting(false); 
        return; 
      }
    }
    
    // 🔥 2. DATABASE INSERTION 🔥
    // Status MUST be 'pending' exactly to trigger your Creator QA Queue for manual tasks
    const finalStatus = isManualTask ? 'pending' : 'approved';

    const insertData = { 
      user_id: user.id, 
      earner_id: user.id, 
      task_id: task.id, 
      platform: task.platform, 
      social_handle: handle,
      proof_url: proofUrl,
      proof_text: proofText,
      status: finalStatus
    };

    const { error } = await supabase.from('completions').insert(insertData);
    
    if (error) { 
      alert(`Database Error: ${error.message}`); 
    } else {
      if (isManualTask) {
        alert("Submitted! The Creator will review your proof and release the points to your treasury shortly.");
      } else {
        alert("Verified! Points successfully deposited.");
        if (user) user.points = (user.points || 0) + task.reward_points;
        
        // Background update for automated task views
        await supabase.from('tasks').update({ current_views: task.current_views + 1 }).eq('id', task.id);
      }
      navigate('tasks');
    }
    setSubmitting(false);
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--slate)' }}>Decrypting asset...</div>;
  if (cooldown) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--slate)' }}>⏱️ Cooldown Active: {cooldown}h left</div>;

  // ── DYNAMIC UI STATES ──
  let statusText = 'PLAYBACK PAUSED';
  let statusColor = '#ef4444';

  if (isManualTask) {
    statusText = 'MANUAL UPLOAD REQUIRED'; statusColor = '#fbbf24';
  } else if (isBlog) {
    statusText = 'AWAITING PAYLOAD SYNCHRONIZATION'; statusColor = '#fbbf24';
  } else if (verification) { 
    statusText = '✅ VERIFICATION READY'; statusColor = 'var(--lime)'; 
  } else if (isLive) { 
    statusText = `TRACKING ACTIVE: ${timer}s`; statusColor = 'var(--lime)'; 
  } else if (timer === task?.watch_duration) { 
    statusText = 'INITIATE TASK TO START'; statusColor = '#fbbf24'; 
  }

  const S = {
    wrap: { padding: 20, maxWidth: 600, margin: 'auto', fontFamily: "var(--font-body)" },
    card: { background: 'var(--surface)', borderRadius: 16, overflow: 'hidden', marginBottom: 20, border: '1px solid var(--line)', position: 'relative' },
    header: { padding: 15, background: 'var(--surface-card)', borderBottom: '1px solid var(--line)', color: statusColor, fontWeight: 800, textAlign: 'center', fontFamily: "var(--font-display)", letterSpacing: '1px' },
    verifBox: { padding: 40, background: 'var(--surface-card)', textAlign: 'center' },
    input: { width: '100%', boxSizing: 'border-box', padding: 16, marginBottom: 24, borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)', outline: 'none' },
    btnRed: { background: '#ef4444', color: '#fff', padding: 16, width: '100%', border: 'none', borderRadius: 8, marginBottom: 24, fontWeight: 800, cursor: 'pointer', fontSize: 13, letterSpacing: '0.5px' },
    btnGreen: { background: 'var(--lime)', color: '#000', padding: 16, width: '100%', border: 'none', borderRadius: 8, fontWeight: 800, cursor: 'pointer', fontSize: 16, fontFamily: "var(--font-display)" },
    warningBox: { background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 8, padding: 16, marginBottom: 24, textAlign: 'left' },
    cheatToast: { background: '#ef4444', color: '#fff', padding: '10px 16px', fontSize: 13, fontWeight: 700, textAlign: 'center' }
  };

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <div style={S.header}>{statusText}</div>
        {cheatWarning && !verification && <div style={S.cheatToast}>{cheatWarning}</div>}
        
        {/* ── AUTOMATED YOUTUBE RENDERER ── */}
        {!isManualTask && task.platform === 'youtube' && (
          <div style={{ display: verification ? 'none' : 'block', pointerEvents: isLive ? 'none' : 'auto' }}>
            <div id="yt-frame" style={{ width: '100%', height: 350 }}></div>
          </div>
        )}

        {/* ── SEO SEARCH PROTOCOL ── */}
        {isBlog && (
          <div style={S.verifBox}>
            <h3 style={{ color: 'var(--ink)', marginTop: 0, marginBottom: 16, fontFamily: "var(--font-display)", textAlign: 'left' }}>Search Protocol</h3>
            <ol style={{ paddingLeft: 20, margin: 0, color: 'var(--slate)', lineHeight: 1.8, fontSize: 14, textAlign: 'left', marginBottom: 24 }}>
              <li>Open a new browser tab and go to <strong>Google.com</strong></li>
              <li>Search for this exact phrase: <strong style={{ color: 'var(--ink)', background: 'var(--lime-dim)', padding: '2px 6px', borderRadius: 4 }}>{task.search_keyword}</strong></li>
              <li>Find the link for <strong>{new URL(task.url).hostname}</strong> and click it.</li>
              <li>Scroll to the bottom of the article and wait for the verification timer to finish.</li>
              <li>Copy the Single-Use Secret Code and paste it below.</li>
            </ol>
            
            <div style={{ textAlign: 'left', marginBottom: 8, fontSize: 12, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase' }}>Single-Use Payload Code</div>
            <input 
              placeholder="Paste exact code here..." 
              value={seoCodeInput} 
              onChange={e => setSeoCodeInput(e.target.value)} 
              style={{ ...S.input, fontFamily: 'monospace' }} 
            />
            
            <button onClick={claimTask} disabled={submitting || !seoCodeInput} style={{ ...S.btnGreen, opacity: (submitting || !seoCodeInput) ? 0.5 : 1 }}>
              {submitting ? 'VERIFYING...' : 'VERIFY PAYLOAD & CLAIM'}
            </button>
          </div>
        )}

        {/* ── MANUAL UGC / QA PORTAL ── */}
        {isManualTask && (
           <div style={S.verifBox}>
              <h3 style={{ color: 'var(--ink)', marginTop: 0, marginBottom: 12, fontFamily: "var(--font-display)" }}>Manual Submission Required</h3>
              <p style={{ color: 'var(--slate)', fontSize: 14, marginBottom: 24 }}>
                Review the campaign guidelines below. Once complete, upload your proof (Google Drive, Dropbox, Imgur) and/or provide your summary text.
              </p>
              
              <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', padding: 16, borderRadius: 8, marginBottom: 24, textAlign: 'left', wordBreak: 'break-all' }}>
                <div style={{ fontSize: 11, color: 'var(--slate)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 4 }}>Campaign Brief / URL</div>
                <a href={task.url} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>{task.url}</a>
              </div>

              <div style={{ textAlign: 'left', marginBottom: 8, fontSize: 12, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase' }}>Submission Notes (Optional)</div>
              <textarea 
                rows="3" 
                placeholder="Describe what you did or list bugs found..." 
                value={proofText} 
                onChange={e => setProofText(e.target.value)} 
                style={{ ...S.input, resize: 'vertical' }} 
              />

              <div style={{ textAlign: 'left', marginBottom: 8, fontSize: 12, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase' }}>Evidence URL (Screenshot/Video Link)</div>
              <input 
                placeholder="https://drive.google.com/..." 
                value={proofUrl} 
                onChange={e => setProofUrl(e.target.value)} 
                style={S.input} 
              />
              
              <button onClick={claimTask} disabled={submitting || (!proofText && !proofUrl)} style={{ ...S.btnGreen, opacity: (submitting || (!proofText && !proofUrl)) ? 0.5 : 1 }}>
                {submitting ? 'UPLOADING...' : 'SUBMIT FOR REVIEW'}
              </button>
           </div>
        )}
        
        {/* ── AUTOMATED CLAIM FORM (Unlocked after YouTube timer) ── */}
        {verification && !isManualTask && !isBlog && (
          <div style={S.verifBox}>
            <h3 style={{ color: 'var(--ink)', marginTop: 0, marginBottom: 24, fontFamily: "var(--font-display)" }}>Engagement Required</h3>
            <button onClick={handleOpenApp} style={S.btnRed}>▶ 1. OPEN APP TO LIKE, COMMENT & SUBSCRIBE</button>
            
            {gateUnlocked ? (
              <>
                <div style={S.warningBox}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.5px' }}>⚠️ Strict Verification Warning</div>
                  <div style={{ fontSize: 13, color: 'var(--slate)', lineHeight: 1.5 }}>Creators actively audit this network. If a Creator reports your engagement as fake or missing, you will face a <strong style={{ color: '#ef4444' }}>50 PTS deduction</strong>.</div>
                </div>
                <div style={{ textAlign: 'left', marginBottom: 8, fontSize: 12, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase' }}>2. Drop your handle for audit</div>
                <input placeholder="e.g., @YourUsername" value={handle} onChange={e => setHandle(e.target.value)} style={S.input} />
                <button onClick={claimTask} disabled={submitting} style={{ ...S.btnGreen, opacity: submitting ? 0.5 : 1 }}>
                  {submitting ? 'CLAIMING...' : `3. CLAIM ${task.reward_points} POINTS`}
                </button>
              </>
            ) : (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8, padding: 20, color: 'var(--slate)', fontSize: 14, marginTop: 16 }}>
                🔒 Click the red button above to open the target asset. The claim form will unlock automatically.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
