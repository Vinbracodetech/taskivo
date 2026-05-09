import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export default function TaskPlayer({ session, navigate, taskId }) {
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  
  const [timer, setTimer] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [strikes, setStrikes] = useState(0);

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
      setQuizMode(true); // Trigger verification quiz when timer hits 0
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

  async function handleQuiz(passed) {
    if (passed) {
      // 1. Grant Points
      await supabase.from('profiles').update({ points: user.points + task.reward_points }).eq('id', user.id);
      // 2. Record Completion
      await supabase.from('completions').insert({ user_id: user.id, task_id: task.id, platform: task.platform });
      // 3. Update Creator Stats
      await supabase.from('tasks').update({ current_views: task.current_views + 1 }).eq('id', task.id);
      
      alert(`Success! ${task.reward_points} PTS acquired.`);
      navigate('tasks');
    } else {
      const newStrikes = strikes + 1;
      setStrikes(newStrikes);
      if (newStrikes >= 3) {
        // 24 Hour Lockout
        localStorage.setItem(`taskivo_lockout_${user.id}`, new Date().getTime() + 86400000);
        alert('Verification failed 3 times. Account locked for 24 hours.');
        navigate('tasks');
      } else {
        alert(`Incorrect. Strike ${newStrikes}/3.`);
      }
    }
  }

  const S = {
    page: { minHeight: '100vh', background: '#050505', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', fontFamily: "'DM Sans', sans-serif" },
    terminal: { width: '100%', maxWidth: 800, background: '#0D0D12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.8)' },
    hud: { display: 'flex', justifyContent: 'space-between', padding: '20px 32px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)', alignItems: 'center' },
    timerGlow: { fontFamily: 'monospace', fontSize: 24, fontWeight: 800, color: playing ? '#A8FF3E' : '#ef4444', textShadow: playing ? '0 0 10px rgba(168,255,62,0.4)' : 'none' },
    btnPlay: { background: '#fff', color: '#000', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }
  };

  if (loading || !task) return <div style={S.page}><div style={{color: '#fff'}}>Initializing sandbox...</div></div>;

  return (
    <div style={S.page}>
      
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <h1 style={{ color: '#fff', fontFamily: "'Inter', sans-serif", fontSize: 24, margin: '0 0 8px 0' }}>{task.title}</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0, fontSize: 13, textTransform: 'uppercase', letterSpacing: '1px' }}>Strict Verification Active</p>
      </div>

      <div style={S.terminal}>
        <div style={S.hud}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={S.timerGlow}>{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {playing ? 'RECORDING' : 'PAUSED'}
            </div>
          </div>
          {!playing && timer > 0 && (
            <button onClick={() => setPlaying(true)} style={S.btnPlay}>INITIALIZE PLAYBACK</button>
          )}
        </div>

        {quizMode ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <h2 style={{ color: '#fff', fontFamily: "'Inter', sans-serif", marginBottom: 24 }}>Proof of Attention Required</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: 40 }}>To verify manual engagement, please confirm you are human.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <button onClick={() => handleQuiz(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '14px 24px', borderRadius: 8, cursor: 'pointer' }}>I am a bot</button>
              <button onClick={() => handleQuiz(true)} style={{ background: '#A8FF3E', border: 'none', color: '#000', padding: '14px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 800 }}>I am human</button>
            </div>
            <div style={{ marginTop: 24, fontSize: 12, color: '#ef4444' }}>Strikes: {strikes} / 3</div>
          </div>
        ) : (
          <div style={{ background: '#000', height: 450, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             {/* If playing is true, render the actual iframe, otherwise render a placeholder shield */}
             {playing ? (
               <iframe src={task.url} style={{ width: '100%', height: '100%', border: 'none' }} title="Task Asset" />
             ) : (
               <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: 14 }}>PLAYBACK SUSPENDED - AWAITING INITIALIZATION</div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
