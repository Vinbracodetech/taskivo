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
      const vidMatch = task.url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
      const vidId = vidMatch ? vidMatch[1] : '';

      ytPlayerRef.current = new window.YT.Player('yt-frame', {
        videoId: vidId,
        playerVars: { playsinline: 1, rel: 0 },
        events: {
          onStateChange: (e) => {
            setIsLive(e.data === 1);
          }
        }
      });
    };

    if (!window.YT) {
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      window.onYouTubeIframeAPIReady = loadPlayer;
      document.body.appendChild(s);
    } else {
      loadPlayer();
    }
  }, [task, cooldown, verification]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        setIsLive(false);
        if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
          ytPlayerRef.current.pauseVideo();
        }
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  // 🚨 THE FIXED TIMER LOGIC 🚨
  useEffect(() => {
    // 1. If it hits zero, immediately lock the screen regardless of video state
    if (timer <= 0 && task && !verification) {
      setVerification(true);
      setIsLive(false);
      if (ytPlayerRef.current && typeof ytPlayerRef.current.pauseVideo === 'function') {
        ytPlayerRef.current.pauseVideo();
      }
      return;
    }

    // 2. Only tick down if actively playing and tab is open
    let interval;
    if (isLive && !document.hidden && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isLive, timer, task, verification]);

  async function claim() {
    if (!handle.trim()) return alert("Enter your platform handle to claim points.");
    
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
      alert(error.message);
    } else {
      alert("Verified! Points added.");
      navigate('tasks');
    }
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--slate)' }}>Syncing secure sandbox...</div>;
  if (cooldown) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--slate)' }}>⏱️ Task on Cooldown. Return in {cooldown} hours.</div>;

  const wrapStyle = { padding: 20, maxWidth: 600, margin: 'auto', fontFamily: "'Inter', sans-serif" };
  const cardStyle = { background: '#000', borderRadius: 16, overflow: 'hidden', marginBottom: 20, border: '1px solid var(--line)' };
  const headerStyle = { padding: 15, background: '#111', color: isLive ? 'var(--lime)' : '#ff4444', fontWeight: 800, textAlign: 'center', letterSpacing: '1px' };
  const verifBox = { padding: 40, background: 'var(--surface-card)', textAlign: 'center' };
  const inputStyle = { width: '100%', boxSizing: 'border-box', padding: 16, marginBottom: 24, borderRadius: 8, border: '1px solid var(--line)', background: 'var(--surface)', color: 'var(--ink)' };
  const btnRed = { background: '#ff4444', color: '#fff', padding: 16, width: '100%', border: 'none', borderRadius: 8, marginBottom: 24, fontWeight: 800, cursor: 'pointer', fontSize: 14 };
  const btnGreen = { background: 'var(--lime)', color: '#000', padding: 16, width: '100%', border: 'none', borderRadius: 8, fontWeight: 800, cursor: 'pointer', fontSize: 16 };

  return (
    <div style={wrapStyle}>
      <div style={cardStyle}>
        
        <div style={headerStyle}>
          {isLive ? `TRACKING VIEW: ${timer}s` : 'PLAYBACK PAUSED'}
        </div>
        
        {!verification ? (
          <div id="yt-frame" style={{ width: '100%', height: 350 }}></div>
        ) : (
          <div style={verifBox}>
            <h3 style={{ color: 'var(--ink)', marginTop: 0, marginBottom: 24 }}>Engagement Required</h3>
            
            <button onClick={() => window.open(task.url, '_blank')} style={btnRed}>
              ▶ OPEN APP TO LIKE & SUBSCRIBE
            </button>
            
            <div style={{ textAlign: 'left', marginBottom: 8, fontSize: 12, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase' }}>
              Drop your handle for verification
            </div>
            
            <input 
              placeholder="e.g., @YourUsername" 
              value={handle} 
              onChange={e => setHandle(e.target.value)} 
              style={inputStyle} 
            />
            
            <button onClick={claim} style={btnGreen}>
              CLAIM {task.reward_points} POINTS
            </button>
          </div>
        )}
        
      </div>
    </div>
  );
}
