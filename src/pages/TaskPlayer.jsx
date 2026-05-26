import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export default function TaskPlayer({ session, navigate, taskId }) {
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isLive, setIsLive] = useState(false);
  const [verification, setVerification] = useState(false);
  const [cooldown, setCooldown] = useState(null);
  const [handle, setHandle] = useState('');
  
  const [gateUnlocked, setGateUnlocked] = useState(false);
  const [cheatWarning, setCheatWarning] = useState("");

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
        if (h < 24) {
          setCooldown(Math.ceil(24 - h));
          setLoading(false);
          return;
        }
      }

      const { data: t } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (t) {
        setTask(t);
        setTimer(t.watch_duration);
      }
      setLoading(false);
    }
    if (user?.id) init();
  }, [taskId, user]);

  useEffect(() => {
    if (!task || cooldown || verification) return;

    const loadPlayer = () => {
      if (ytPlayerRef.current) return; 
      
      const vidMatch = task.url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
      const vidId = vidMatch ? vidMatch[1] : '';

      ytPlayerRef.current = new window.YT.Player('yt-frame', {
        videoId: vidId,
        playerVars: { 
          playsinline: 1, 
          rel: 0,
          controls: 0, // Hide native controls to discourage scrubbing
          disablekb: 1 // Disable keyboard shortcuts (like arrow keys to skip)
        },
        events: {
          onReady: (e) => {
             // Force 1x speed to prevent speed-hack extensions
             e.target.setPlaybackRate(1);
          },
          onStateChange: (e) => {
            // 1 = Playing, 2 = Paused, 0 = Ended
            if (e.data === 1) {
              setIsLive(true);
              setCheatWarning("");
              e.target.setPlaybackRate(1); // Enforce normal speed constantly
            } else {
              setIsLive(false);
            }

            // 🔥 ANTI-CHEAT: Did the video end before the timer finished?
            if (e.data === 0) {
              // Since the interval relies on state closures, we use the current timer state indirectly via a check
              setTimer((currentTimer) => {
                 if (currentTimer > 0) {
                   setCheatWarning("⚠️ Fast-forwarding detected. Timer has been reset.");
                   return task.watch_duration; // Reset timer back to max
                 }
                 return currentTimer;
              });
            }
          }
        }
      });
    };

    if (!window.YT || !window.YT.Player) {
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      window.onYouTubeIframeAPIReady = loadPlayer;
      document.body.appendChild(s);
    } else {
      loadPlayer();
    }
  }, [task, cooldown, verification]);

  // 🔥 ANTI-CHEAT: TAB SWITCHING
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setIsLive(false);
        if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
          ytPlayerRef.current.pauseVideo();
        }
        if (!verification) {
          setCheatWarning("⚠️ Playback paused. You must keep this tab open and visible.");
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [verification]);

  useEffect(() => {
    if (timer <= 0 && task && !verification) {
      setVerification(true);
      setIsLive(false);
      setCheatWarning("");
      if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
        ytPlayerRef.current.pauseVideo();
      }
      return;
    }

    let interval;
    if (isLive && !document.hidden && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isLive, timer, task, verification]);

  function handleOpenApp() {
    window.open(task.url, '_blank');
    setGateUnlocked(true); 
  }

  async function claim() {
    if (!handle.trim()) {
      alert("Enter your platform handle to claim points.");
      return;
    }
    
    const { error } = await supabase
      .from('completions')
      .insert({
        user_id: user.id,
        earner_id: user.id,
        task_id: task.id,
        platform: task.platform,
        social_handle: handle
      });
      
    if (error) {
      alert(`Database Error: ${error.message}`);
    } else {
      alert("Verified! Points successfully deposited.");
      navigate('tasks');
    }
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--slate)' }}>Syncing...</div>;
  if (cooldown) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--slate)' }}>⏱️ Cooldown: {cooldown}h left</div>;

  let statusText = 'PLAYBACK PAUSED';
  let statusColor = '#ff4444';

  if (verification) {
    statusText = '✅ VERIFICATION READY';
    statusColor = 'var(--lime)';
  } else if (isLive) {
    statusText = `TRACKING VIEW: ${timer}s`;
    statusColor = 'var(--lime)';
  } else if (timer === task?.watch_duration) {
    statusText = 'TAP VIDEO TO START';
    statusColor = '#fbbf24'; 
  }

  const wrapStyle = { padding: 20, maxWidth: 600, margin: 'auto', fontFamily: "'Inter', sans-serif" };
  const cardStyle = { background: '#000', borderRadius: 16, overflow: 'hidden', marginBottom: 20, border: '1px solid var(--line)', position: 'relative' };
  const headerStyle = { padding: 15, background: '#111', color: statusColor, fontWeight: 800, textAlign: 'center' };
  const verifBox = { padding: 40, background: 'var(--surface-card)', textAlign: 'center' };
  const inputStyle = { width: '100%', boxSizing: 'border-box', padding: 16, marginBottom: 24, borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)' };
  const btnRed = { background: '#ff4444', color: '#fff', padding: 16, width: '100%', border: 'none', borderRadius: 8, marginBottom: 24, fontWeight: 800, cursor: 'pointer', fontSize: 13, letterSpacing: '0.5px' };
  const btnGreen = { background: 'var(--lime)', color: '#000', padding: 16, width: '100%', border: 'none', borderRadius: 8, fontWeight: 800, cursor: 'pointer', fontSize: 16 };
  const warningBox = { background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 8, padding: 16, marginBottom: 24, textAlign: 'left' };
  const cheatToast = { background: '#ff4444', color: '#fff', padding: '10px 16px', fontSize: 13, fontWeight: 700, textAlign: 'center' };

  return (
    <div style={wrapStyle}>
      <div style={cardStyle}>
        
        <div style={headerStyle}>
          {statusText}
        </div>

        {cheatWarning && !verification && (
          <div style={cheatToast}>
            {cheatWarning}
          </div>
        )}
        
        <div style={{ display: verification ? 'none' : 'block', pointerEvents: isLive ? 'none' : 'auto' }}>
           {/* By disabling pointerEvents while live, they can't click the timeline to skip */}
          <div id="yt-frame" style={{ width: '100%', height: 350 }}></div>
        </div>
        
        {verification && (
          <div style={verifBox}>
            <h3 style={{ color: 'var(--ink)', marginTop: 0, marginBottom: 24 }}>
              Engagement Required
            </h3>
            
            <button onClick={handleOpenApp} style={btnRed}>
              ▶ 1. OPEN APP TO LIKE, COMMENT & SUBSCRIBE
            </button>
            
            {gateUnlocked ? (
              <>
                <div style={warningBox}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.5px' }}>
                    ⚠️ Strict Verification Warning
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--slate)', lineHeight: 1.5 }}>
                    Creators actively audit this network. If a Creator reports your engagement as fake or missing, you will immediately face a <strong style={{ color: '#ef4444' }}>50 PTS deduction</strong> and risk permanent suspension.
                  </div>
                </div>

                <div style={{ textAlign: 'left', marginBottom: 8, fontSize: 12, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase' }}>
                  2. Drop your handle for audit
                </div>
                
                <input 
                  placeholder="e.g., @YourUsername" 
                  value={handle} 
                  onChange={e => setHandle(e.target.value)} 
                  style={inputStyle} 
                />
                
                <button onClick={claim} style={btnGreen}>
                  3. CLAIM {task.reward_points} POINTS
                </button>
              </>
            ) : (
              <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8, padding: 20, color: 'var(--slate)', fontSize: 14, marginTop: 16 }}>
                🔒 Click the red button above to open the video. The claim form will unlock automatically.
              </div>
            )}
            
          </div>
        )}
        
      </div>
    </div>
  );
}
