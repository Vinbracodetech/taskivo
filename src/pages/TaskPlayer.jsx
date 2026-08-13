import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { getTaskSmartLink } from '../components/WebAds';

export default function TaskPlayer({ session, navigate, taskId }) {
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  
  // Timer States
  const [timer, setTimer] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [verification, setVerification] = useState(false);
  
  // Security & Input States
  const [cooldown, setCooldown] = useState(null);
  const [handle, setHandle] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [proofText, setProofText] = useState(''); 
  const [seoCodeInput, setSeoCodeInput] = useState(''); 
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [cheatWarning, setCheatWarning] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const ytPlayerRef = useRef(null);

  useEffect(() => {
    async function init() {
      const { data: c } = await supabase
        .from('completions')
        .select('created_at')
        .eq('task_id', taskId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (c) {
        const h = (new Date() - new Date(c.created_at)) / 3600000;
        if (h < 24) { setCooldown(Math.ceil(24 - h)); setLoading(false); return; }
      }
      
      const { data: t } = await supabase.from('tasks').select('*').eq('id', taskId).single();
      if (t) { 
        setTask(t); 
        setTimer(t.watch_duration); 

        if (t.platform === 'smartlink') {
          const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
          const { count } = await supabase
             .from('completions')
             .select('*', { count: 'exact', head: true })
             .eq('user_id', user.id)
             .eq('platform', 'smartlink')
             .gte('created_at', yesterday);
             
          if (count >= 10) {
             setCooldown('QUOTA_REACHED');
             setLoading(false);
             return;
          }

          // Restore existing active session timer if user refreshed during a task
          const savedStartTime = localStorage.getItem(`task_start_${taskId}`);
          if (savedStartTime) {
            const elapsed = Math.floor((Date.now() - parseInt(savedStartTime)) / 1000);
            const remaining = Math.max(0, t.watch_duration - elapsed);
            setTimer(remaining);
            setIsLive(true);
            if (remaining <= 0) {
              setVerification(true);
              setIsLive(false);
            }
          }
        }
      }
      setLoading(false);
    }
    if (user?.id) init();
  }, [taskId, user]);

  const isManualTask = task?.platform === 'ugc' || task?.platform === 'qa_testing' || task?.platform === 'growth';
  const isBlog = task?.platform === 'blog' || task?.platform === 'adsense';
  const isSmartlink = task?.platform === 'smartlink';

  useEffect(() => {
    if (!task || cooldown || verification || isManualTask || isBlog || isSmartlink) return;
    
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
  }, [task, cooldown, verification, isManualTask, isBlog, isSmartlink]);

  useEffect(() => {
    if (isManualTask || isBlog || isSmartlink) return; 
    
    const handleVisibility = () => {
      if (document.hidden) {
        setIsLive(false);
        if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') ytPlayerRef.current.pauseVideo();
        if (!verification) setCheatWarning("⚠️ Timer paused. You must keep this tab visible.");
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [verification, isManualTask, isBlog, isSmartlink]);

  // 🔥 ABSOLUTE TIMESTAMP DELTA TIMER (Mobile Bulletproof) 🔥
  useEffect(() => {
    if (isManualTask || isBlog) return;

    let interval;
    if (isLive && !verification) {
      interval = setInterval(() => {
        if (isSmartlink) {
          const savedStartTime = localStorage.getItem(`task_start_${taskId}`);
          if (savedStartTime) {
            const elapsed = Math.floor((Date.now() - parseInt(savedStartTime)) / 1000);
            const remaining = Math.max(0, task.watch_duration - elapsed);
            
            setTimer(remaining);

            if (remaining <= 0) {
              setVerification(true);
              setIsLive(false);
              localStorage.removeItem(`task_start_${taskId}`);
              clearInterval(interval);
            }
          }
        } else if (!document.hidden) {
          setTimer((prev) => {
            if (prev <= 1) {
              setVerification(true);
              setIsLive(false);
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isLive, verification, isManualTask, isBlog, isSmartlink, task, taskId]);

  function handleOpenApp() { window.open(task.url, '_blank'); setGateUnlocked(true); setIsLive(true); }

  async function claimTask() {
    setSubmitting(true);
    
    if (isBlog) {
      const token = seoCodeInput.trim();
      
      if (!token || !token.startsWith('TSK-') || token.length !== 10) {
        alert("FORMAT ERROR: Code must be exactly 10 characters and start with TSK-");
        setSubmitting(false);
        return;
      }

      try {
        const { data: sessionData, error: sessionError } = await supabase
          .from('task_sessions')
          .select('*')
          .eq('secret_code', token)
          .eq('status', 'completed')
          .single();

        if (sessionError || !sessionData) {
          alert(`DATABASE REJECTION: Could not find active token ${token}. It may be expired or already used.`);
          setSubmitting(false);
          return;
        }

        const { error: burnError } = await supabase
          .from('task_sessions')
          .update({ status: 'redeemed', user_id: user.id })
          .eq('id', sessionData.id);

        if (burnError) throw burnError;

      } catch (dbErr) {
        alert("CRITICAL DATABASE ERROR: " + dbErr.message);
        setSubmitting(false);
        return;
      }

    } else if (isManualTask) {
      if (!proofFile && !proofText.trim()) { 
        alert("Please provide a valid screenshot upload or written notes for the Creator."); 
        setSubmitting(false); 
        return; 
      }
    } else if (!isSmartlink) {
      if (!handle.trim()) { 
        alert("Enter your platform handle to claim points."); 
        setSubmitting(false); 
        return; 
      }
    }
    
    let uploadedProofUrl = '';
    
    if (isManualTask && proofFile) {
      const fileExt = proofFile.name.split('.').pop();
      const fileName = `${user.id}_${task.id}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('proofs')
        .upload(fileName, proofFile);
        
      if (uploadError) {
        alert("Proof upload failed: " + uploadError.message);
        setSubmitting(false);
        return;
      }
      
      const { data: { publicUrl } } = supabase.storage.from('proofs').getPublicUrl(fileName);
      uploadedProofUrl = publicUrl;
    }

    const finalStatus = isManualTask ? 'pending' : 'approved';

    const insertData = { 
      user_id: user.id, 
      earner_id: user.id, 
      task_id: task.id, 
      platform: task.platform, 
      social_handle: isSmartlink ? 'SYSTEM_SMARTLINK' : handle,
      proof_url: uploadedProofUrl,
      proof_text: proofText,
      status: finalStatus
    };

    const { error } = await supabase.from('completions').insert(insertData);
    
    if (error) { 
      alert(`Final Insertion Error: ${error.message}`); 
    } else {
      if (isManualTask) {
        alert("Submitted! The Creator will review your screenshot and release the points to your treasury shortly.");
      } else {
        alert("✅ Verified! Points successfully deposited.");
        if (user) user.points = (user.points || 0) + task.reward_points;
        await supabase.from('tasks').update({ current_views: task.current_views + 1 }).eq('id', task.id);
      }
      localStorage.removeItem(`task_start_${taskId}`);
      navigate('tasks');
    }
    setSubmitting(false);
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--slate)' }}>Decrypting asset...</div>;
  if (cooldown === 'QUOTA_REACHED') return <div style={{ padding: 40, textAlign: 'center', color: '#ef4444', fontWeight: 800 }}>🛑 Daily Quota Reached: You have completed 10 Sponsor Tasks today. Come back tomorrow!</div>;
  if (cooldown) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--slate)' }}>⏱️ Cooldown Active: {cooldown}h left</div>;

  let statusText = 'PLAYBACK PAUSED';
  let statusColor = '#ef4444';

  if (isManualTask) {
    statusText = 'MANUAL UPLOAD REQUIRED'; statusColor = '#fbbf24';
  } else if (isBlog) {
    statusText = 'AWAITING PAYLOAD SYNCHRONIZATION'; statusColor = '#fbbf24';
  } else if (isSmartlink) {
    statusText = verification ? '✅ YIELD SECURED' : 'SPONSOR TASK ACTIVE'; statusColor = verification ? 'var(--lime)' : '#fbbf24';
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
    btnBlue: { background: '#00D1FF', color: '#000', padding: 16, width: '100%', border: 'none', borderRadius: 8, marginBottom: 24, fontWeight: 800, cursor: 'pointer', fontSize: 13, letterSpacing: '0.5px' },
    btnGreen: { background: 'var(--lime)', color: '#000', padding: 16, width: '100%', border: 'none', borderRadius: 8, fontWeight: 800, cursor: 'pointer', fontSize: 16, fontFamily: "var(--font-display)", textTransform: 'uppercase' }
  };

  return (
    <div style={S.wrap}>
      <div style={S.card}>
        <div style={S.header}>{statusText}</div>
        {cheatWarning && !verification && <div style={{ background: '#ef4444', color: '#fff', padding: '10px 16px', fontSize: 13, fontWeight: 700, textAlign: 'center' }}>{cheatWarning}</div>}
        
        {!isManualTask && task.platform === 'youtube' && (
          <div style={{ display: verification ? 'none' : 'block', pointerEvents: isLive ? 'none' : 'auto' }}>
            <div id="yt-frame" style={{ width: '100%', height: 350 }}></div>
          </div>
        )}

        {isSmartlink && (
          <div style={{ padding: '32px 24px', background: 'var(--surface-card)', textAlign: 'center' }}>
            <h3 style={{ color: 'var(--ink)', marginTop: 0, marginBottom: 16, fontFamily: "var(--font-display)" }}>
              Sponsor Engagement Task
            </h3>
            <p style={{ color: 'var(--slate)', fontSize: 14, marginBottom: 32, lineHeight: 1.5 }}>
              1. Tap below to launch the sponsor portal in a new tab.<br/>
              2. Keep the ad tab open in the background.<br/>
              3. <strong style={{ color: 'var(--ink)' }}>Switch back to Taskivo—the timer will auto-update.</strong>
            </p>
            
            {!isLive && !verification ? (
              <button 
                onClick={() => {
                  const adUrl = getTaskSmartLink();
                  window.open(adUrl, '_blank', 'noopener,noreferrer');
                  
                  // Save timestamp to storage
                  localStorage.setItem(`task_start_${taskId}`, Date.now().toString());
                  setIsLive(true);
                }} 
                style={S.btnBlue}
              >
                ▶ LAUNCH PORTAL & START TIMER
              </button>
            ) : null}

            {isLive && !verification ? (
              <div style={{ padding: '24px', border: '1px dashed var(--line)', borderRadius: '12px' }}>
                <div style={{ fontSize: 40, fontWeight: 800, color: '#00D1FF', marginBottom: 8, fontFamily: 'monospace' }}>
                  {timer}s
                </div>
                <div style={{ fontSize: 12, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Dwell Time Tracking Active
                </div>
              </div>
            ) : null}

            {verification ? (
              <div style={{ marginTop: 24 }}>
                <div style={{ fontSize: 12, color: 'var(--lime)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 16 }}>
                  ✅ Dwell Time Complete
                </div>
                <button 
                  onClick={claimTask} 
                  disabled={submitting} 
                  style={{ ...S.btnGreen, opacity: submitting ? 0.5 : 1 }}
                >
                  {submitting ? 'SECURING YIELD...' : 'CLAIM REWARD'}
                </button>
              </div>
            ) : null}
          </div>
        )}

        {isBlog && (
          <div style={{ padding: '32px 24px', background: 'var(--surface-card)' }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 16, padding: 24, textAlign: 'left', marginBottom: 32 }}>
              <div style={{ fontSize: 11, color: 'var(--lime)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1.5px', marginBottom: 20 }}>
                Mission Briefing
              </div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, color: 'var(--slate)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>Step 1: Search Protocol</div>
                <div style={{ color: 'var(--ink)', fontSize: 14 }}>Go to <strong>Google.com</strong> and search for:</div>
                <div style={{ background: 'var(--surface-card)', border: '1px dashed var(--slate)', borderRadius: 8, padding: '12px 16px', marginTop: 8, color: 'var(--lime)', fontSize: 16, fontFamily: 'monospace', fontWeight: 700 }}>
                  {task.search_keyword}
                </div>
              </div>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 12, color: 'var(--slate)', fontWeight 700, textTransform: 'uppercase', marginBottom: 6 }}>Step 2: Target Acquisition</div>
                <div style={{ color: 'var(--ink)', fontSize: 14 }}>
                  Find <strong style={{ color: 'var(--lime)' }}>{new URL(task.url).hostname}</strong> and open the article titled:
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '3px solid var(--lime)', padding: '12px 16px', marginTop: 12, color: '#fff', fontSize: 15, fontWeight: 600 }}>
                  "{task.title}"
                </div>
              </div>
            </div>
            
            <input 
              placeholder="e.g. TSK-A1B2C3D4E5" 
              value={seoCodeInput} 
              onChange={e => setSeoCodeInput(e.target.value)} 
              style={{ ...S.input, fontFamily: 'monospace', fontSize: 16, letterSpacing: '1px', textAlign: 'center' }} 
            />
            
            <button onClick={claimTask} disabled={submitting || !seoCodeInput} style={{ ...S.btnGreen, opacity: (submitting || !seoCodeInput) ? 0.5 : 1 }}>
              {submitting ? 'VERIFYING...' : 'Verify Payload & Claim'}
            </button>
          </div>
        )}

        {isManualTask && (
           <div style={S.verifBox}>
              <h3 style={{ color: 'var(--ink)', marginTop: 0, marginBottom: 12 }}>Manual Submission Required</h3>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', padding: 16, borderRadius: 8, marginBottom: 24, textAlign: 'left', wordBreak: 'break-all' }}>
                <a href={task.url} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', fontWeight: 600 }}>{task.url}</a>
              </div>
              <input type="file" accept="image/*,video/*" onChange={e => setProofFile(e.target.files[0])} style={{ ...S.input, padding: '12px' }} />
              <textarea rows="3" placeholder="Submission Notes..." value={proofText} onChange={e => setProofText(e.target.value)} style={{ ...S.input, resize: 'vertical' }} />
              <button onClick={claimTask} disabled={submitting || (!proofText && !proofFile)} style={{ ...S.btnGreen, opacity: (submitting || (!proofText && !proofFile)) ? 0.5 : 1 }}>
                {submitting ? 'UPLOADING...' : 'SUBMIT FOR REVIEW'}
              </button>
           </div>
        )}
        
        {verification && !isManualTask && !isBlog && !isSmartlink && (
          <div style={S.verifBox}>
            <button onClick={handleOpenApp} style={{ background: '#ef4444', color: '#fff', padding: 16, width: '100%', border: 'none', borderRadius: 8, marginBottom: 24, fontWeight: 800 }}>
              ▶ 1. OPEN APP TO LIKE, COMMENT & SUBSCRIBE
            </button>
            {gateUnlocked ? (
              <>
                <input placeholder="e.g., @YourUsername" value={handle} onChange={e => setHandle(e.target.value)} style={S.input} />
                <button onClick={claimTask} disabled={submitting} style={{ ...S.btnGreen, opacity: submitting ? 0.5 : 1 }}>
                  {submitting ? 'CLAIMING...' : `CLAIM ${task.reward_points} POINTS`}
                </button>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
