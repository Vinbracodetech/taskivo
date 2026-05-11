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
      setQuizMode(true);
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
      try {
        setLoading(true);
        // Secure Handoff: The database trigger handles payout and campaign updates
        const { error } = await supabase.from('completions').insert({ 
          earner_id: user.id, 
          task_id: task.id, 
          platform: task.platform 
        });

        if (error) throw error;

        user.points += task.reward_points; 
        alert(`Verification Successful! ${task.reward_points} PTS securely deposited.`);
        navigate('tasks');

      } catch (err) {
        alert("Verification failed: Campaign may have just reached its allocation limit.");
        navigate('tasks');
      } finally {
        setLoading(false);
      }
    } else {
      try {
        setLoading(true);
        // 🔥 SECURE BACKEND STRIKE TRACKER 🔥
        const { data, error } = await supabase.rpc('record_quiz_failure');
        if (error) throw error;

        if (data.is_locked) {
          alert('Verification failed 3 times. Account permanently locked for 24 hours.');
          navigate('tasks');
        } else {
          setStrikes(data.strikes);
          alert(`Incorrect response. Strike ${data.strikes}/3.`);
          setLoading(false);
        }
      } catch (err) {
        alert("Network error processing verification.");
        setLoading(false);
      }
    }
  }

  const S = {
    page: { minHeight: '100vh', background: 'var(--surface)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 20px', fontFamily: "'DM Sans', sans-serif" },
    terminal: { width: '100%', maxWidth: 800, background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.05)' },
    hud: { display: 'flex', justifyContent: 'space-between', padding: '20px 32px', background: 'var(--surface)', borderBottom: '1px solid var(--line)', alignItems: 'center' },
    timerGlow: { fontFamily: 'monospace', fontSize: 24, fontWeight: 800, color: playing ? 'var(--lime)' : '#ef4444' },
    btnPlay: { background: 'var(--ink)', color: 'var(--surface)', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }
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

        {quizMode ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <h2 style={{ color: 'var(--ink)', fontFamily: "'Inter', sans-serif", marginBottom: 24 }}>Proof of Attention Required</h2>
            <p style={{ color: 'var(--slate)', marginBottom: 40 }}>To verify manual engagement, please confirm you are human.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
              <button onClick={() => handleQuiz(false)} style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)', padding: '14px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>I am a bot</button>
              <button onClick={() => handleQuiz(true)} style={{ background: 'var(--lime)', border: 'none', color: '#000', padding: '14px 24px', borderRadius: 8, cursor: 'pointer', fontWeight: 800 }}>I am human</button>
            </div>
            <div style={{ marginTop: 24, fontSize: 12, color: '#ef4444', fontWeight: 600 }}>Strikes: {strikes} / 3</div>
          </div>
        ) : (
          <div style={{ background: 'var(--surface)', height: 450, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid var(--line)' }}>
             {playing ? (
               <iframe src={task.url} style={{ width: '100%', height: '100%', border: 'none' }} title="Task Asset" />
             ) : (
               <div style={{ color: 'var(--slate)', fontSize: 14, fontWeight: 600, letterSpacing: '0.5px' }}>PLAYBACK SUSPENDED - AWAITING INITIALIZATION</div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
