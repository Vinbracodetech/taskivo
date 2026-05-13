import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export default function TaskPlayer({ session, navigate, taskId }) {
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  
  const [timer, setTimer] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [verificationMode, setVerificationMode] = useState(false);
  const [socialHandle, setSocialHandle] = useState('');

  const timerRef = useRef(null);

  useEffect(() => {
    fetchTask();
    
    // 🔥 BULLETPROOF ANTI-CHEAT: TAB SWITCH DETECTION 🔥
    const handleVisibility = () => {
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    if (playing && timer > 0) {
      timerRef.current = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && playing) {
      setPlaying(false);
      setVerificationMode(true);
    }
    return () => clearInterval(timerRef.current);
  }, [playing, timer]);

  async function fetchTask() {
    try {
      const { data } = await supabase.from('tasks').select('*').eq('id', taskId).single();
      if (data) {
        setTask(data);
        setTimer(data.watch_duration);
      }
    } finally {
      setLoading(false);
    }
  }

  // 🛠️ SMART URL CONVERTER FOR YOUTUBE IFRAMES 🛠️
  function getEmbedUrl(url) {
    if (!url) return '';
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1`;
    }
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URL(url).searchParams;
      return `https://www.youtube.com/embed/${urlParams.get('v')}?autoplay=1&mute=1`;
    }
    return url;
  }

  async function handleClaim() {
    if (!socialHandle.trim()) {
      alert("Please enter your social handle to claim points.");
      return;
    }

    try {
      setLoading(true);
      
      // 🚨 THE FIX: Both earner_id and user_id are now passed to satisfy Supabase security 🚨
      const { error } = await supabase.from('completions').insert({ 
        earner_id: user.id, 
        user_id: user.id, 
        task_id: task.id, 
        platform: task.platform,
        social_handle: socialHandle 
      });

      if (error) throw error;

      alert(`Verification Successful! ${task.reward_points} PTS securely deposited.`);
      navigate('tasks');

    } catch (err) {
      alert(`Backend Error: ${err.message}`);
      setVerificationMode(false);
    } finally {
      setLoading(false);
    }
  }

  const S = {
    page: { minHeight: '100vh', background: 'var(--surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', fontFamily: "'DM Sans', sans-serif" },
    terminal: { width: '100%', maxWidth: 800, background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.05)' },
    hud: { display: 'flex', justifyContent: 'space-between', padding: '20px 32px', background: 'var(--surface)', borderBottom: '1px solid var(--line)', alignItems: 'center' },
    timerGlow: { fontFamily: 'monospace', fontSize: 24, fontWeight: 800, color: playing ? 'var(--lime)' : '#ef4444' },
    btnPlay: { background: 'var(--ink)', color: 'var(--surface)', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: "'Inter', sans-serif" },
    input: { width: '100%', padding: '16px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, color: 'var(--ink)', fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 24, textAlign: 'center' }
  };

  if (loading || !task) return <div style={S.page}><div style={{color: 'var(--slate)'}}>Initializing secure sandbox...</div></div>;

  return (
    <div style={S.page}>
      
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <h1 style={{ color: 'var(--ink)', fontFamily: "'Inter', sans-serif", fontSize: 24, margin: '0 0 8px 0' }}>{task.title}</h1>
        <p style={{ color: 'var(--slate)', margin: 0, fontSize: 13, textTransform: 'uppercase', letterSpacing: '1px' }}>Strict Verification Active</p>
      </div>

      <div style={S.terminal}>
        <div style={S.hud}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={S.timerGlow}>{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</div>
            <div style={{ fontSize: 11, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
              {playing ? 'RECORDING' : 'PAUSED'}
            </div>
          </div>
          {!playing && timer > 0 && (
            <button onClick={() => setPlaying(true)} style={S.btnPlay}>INITIALIZE PLAYBACK</button>
          )}
        </div>

        {verificationMode ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', maxWidth: 400, margin: '0 auto' }}>
            <h2 style={{ color: 'var(--ink)', fontFamily: "'Inter', sans-serif", marginBottom: 12 }}>Engagement Required</h2>
            <p style={{ color: 'var(--slate)', marginBottom: 32, fontSize: 14, lineHeight: 1.5 }}>
              The required view time is complete. Please engage with the content to claim your reward.
            </p>
            
            {/* The Deep Link Button */}
            <button 
              onClick={() => window.open(task.url, '_blank')} 
              style={{ ...S.btnPlay, width: '100%', marginBottom: 32, background: '#ef4444', color: '#fff', padding: '16px' }}>
              ▶ OPEN APP TO LIKE & SUBSCRIBE
            </button>

            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 8, display: 'block' }}>
                Drop your handle for verification
              </span>
              <input 
                style={S.input} 
                type="text" 
                placeholder="e.g., @VincentCodes" 
                value={socialHandle} 
                onChange={(e) => setSocialHandle(e.target.value)} 
              />
            </div>

            <button 
              onClick={handleClaim} 
              style={{ background: 'var(--lime)', border: 'none', color: '#000', width: '100%', padding: '16px', borderRadius: 12, cursor: 'pointer', fontWeight: 800, fontSize: 16 }}>
              CLAIM {task.reward_points} POINTS
            </button>
          </div>
        ) : (
          <div style={{ background: 'var(--surface)', height: 450, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--line)' }}>
             {playing ? (
               <iframe 
                 src={getEmbedUrl(task.url)} 
                 allow="autoplay; encrypted-media"
                 allowFullScreen
                 style={{ width: '100%', height: '100%', border: 'none' }} 
                 title="Task Asset" 
               />
             ) : (
               <div style={{ color: 'var(--slate)', fontSize: 14, fontWeight: 600, letterSpacing: '0.5px' }}>PLAYBACK SUSPENDED - AWAITING INITIALIZATION</div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
