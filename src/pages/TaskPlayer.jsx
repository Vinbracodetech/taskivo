import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import useToast from '../components/useToast';

const C = {
  surface: 'var(--surface)', card: 'var(--surface-card)', input: 'var(--surface-card)', glass: 'var(--glass)',
  textMain: 'var(--ink)', textMuted: 'var(--slate)', textInvert: 'var(--surface)',
  line: 'var(--line)', lime: '#A8FF3E', limeText: 'var(--lime)', limeDim: 'var(--lime-dim)',
  shadow: 'var(--shadow)', red: '#ef4444',
};

export default function TaskPlayer({ session, navigate, taskId }) {
  const { showToast, ToastComponent } = useToast();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState('playing'); // playing | paused_tab | quiz | completed | failed
  const [attempts, setAttempts] = useState(3);
  const [userAnswer, setUserAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const timeRef = useRef(0);
  const statusRef = useRef('playing');

  useEffect(function() {
    if (!session || !session.user) { navigate('auth'); return; }
    fetchTask();
  }, [taskId, session]);

  async function fetchTask() {
    try {
      const { data, error } = await supabase.from('tasks').select('*').eq('id', taskId).single();
      if (error) throw error;
      setTask(data); 
      setTimeLeft(data.watch_duration); 
      timeRef.current = data.watch_duration; 
      setLoading(false);
    } catch (err) {
      showToast('Failed to load task.', 'error');
      setTimeout(function() { navigate('tasks'); }, 2000);
    }
  }

  // BULLETPROOF TIMER & TAB DETECTION
  useEffect(function() {
    if (loading || !task || statusRef.current === 'quiz' || statusRef.current === 'completed' || statusRef.current === 'failed') return;
    
    const timer = setInterval(function() {
      if (document.hidden || statusRef.current !== 'playing') return; 
      
      if (timeRef.current > 0) {
        timeRef.current -= 1; 
        setTimeLeft(timeRef.current);
      } else if (timeRef.current <= 0) {
        setStatus('quiz'); 
        statusRef.current = 'quiz'; 
        clearInterval(timer);
      }
    }, 1000);

    function handleVisibilityChange() {
      if (statusRef.current === 'quiz' || statusRef.current === 'completed' || statusRef.current === 'failed') return;
      if (document.hidden) { 
        setStatus('paused_tab'); 
        statusRef.current = 'paused_tab'; 
      } else { 
        setStatus('playing'); 
        statusRef.current = 'playing'; 
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return function() { 
      clearInterval(timer); 
      document.removeEventListener("visibilitychange", handleVisibilityChange); 
    };
  }, [loading, task]);

  // STRICT 3-STRIKE QUIZ LOGIC
  async function submitQuiz() {
    if (!userAnswer.trim()) { showToast('Please enter an answer.', 'error'); return; }
    setSubmitting(true);
    
    const cleanUserAnswer = userAnswer.trim().toLowerCase();
    const cleanCorrectAnswer = (task.quiz_answer || '').trim().toLowerCase();
    const isCorrect = cleanUserAnswer === cleanCorrectAnswer;

    if (!isCorrect) {
      const newAttempts = attempts - 1; 
      setAttempts(newAttempts);
      
      if (newAttempts <= 0) { 
        setStatus('failed'); 
        statusRef.current = 'failed'; 
        showToast('Task locked. You failed the verification.', 'error'); 
        
        await supabase.from('completions').insert([{ 
          user_id: session.user.id, task_id: task.id, points_earned: 0 
        }]);
      } else { 
        showToast(`Incorrect answer. ${newAttempts} attempts left.`, 'error'); 
        setUserAnswer(''); 
      }
      setSubmitting(false); 
      return;
    }

    try {
      const { data: existing } = await supabase.from('completions').select('id').eq('user_id', session.user.id).eq('task_id', task.id).single();
      if (existing) { setStatus('completed'); showToast('You already completed this task recently.', 'error'); setSubmitting(false); return; }

      await supabase.from('completions').insert([{ user_id: session.user.id, task_id: task.id, points_earned: task.reward_points }]);
      const { data: userData } = await supabase.from('profiles').select('points').eq('id', session.user.id).single();
      await supabase.from('profiles').update({ points: userData.points + task.reward_points }).eq('id', session.user.id);
      await supabase.from('tasks').update({ slots_remaining: task.slots_remaining - 1, completed_slots: task.completed_slots + 1 }).eq('id', task.id);

      setStatus('completed'); 
      statusRef.current = 'completed'; 
      showToast('Task verified! Points added.', 'success');
    } catch (err) {
      showToast('Error verifying task.', 'error');
    } finally { setSubmitting(false); }
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60); const s = seconds % 60; return m + ':' + (s < 10 ? '0' : '') + s;
  }

  // --- Dynamic Embed Builder ---
  let embedSrc = '';
  if (task) {
    if (task.platform === 'youtube') embedSrc = `https://www.youtube.com/embed/${task.video_id}?autoplay=1&mute=1`;
    else if (task.platform === 'tiktok') embedSrc = `https://www.tiktok.com/embed/v2/${task.video_id}`;
    else if (task.platform === 'facebook') embedSrc = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(task.video_id)}&show_text=0&autoplay=1&mute=1`;
    else embedSrc = task.video_id; // Blog
  }

  if (loading) return <div style={{ background: C.surface, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ color: C.textMuted }}>Loading Sandbox...</div></div>;

  const showIframe = status === 'playing' || status === 'paused_tab';

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.surface, color: C.textMain, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {ToastComponent}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.line}`, padding: '16px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={function() { navigate('tasks'); }} style={{ background: C.input, border: `1px solid ${C.line}`, borderRadius: 8, padding: '8px 12px', fontSize: 13, fontWeight: 700, cursor: 'pointer', color: C.textMain }}>← Leave</button>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{task.title}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {status === 'paused_tab' && <span style={{ color: C.red, fontSize: 12, fontWeight: 700, background: 'rgba(239,68,68,0.1)', padding: '4px 8px', borderRadius: 4 }}>⏸ Focus Lost</span>}
          {status === 'playing' || status === 'paused_tab' ? (
            <div style={{ background: C.textMain, color: C.textInvert, padding: '8px 16px', borderRadius: 8, fontSize: 16, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>{formatTime(timeLeft)}</div>
          ) : null}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 1000, margin: '0 auto', width: '100%', padding: '24px 5%' }}>
        
        {/* IFRAME KILL-SWITCH */}
        {showIframe && (
          <div style={{ flex: 1, background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, overflow: 'hidden', minHeight: 400, position: 'relative', marginBottom: 24, boxShadow: C.shadow }}>
            <iframe 
              src={embedSrc} 
              style={{ width: '100%', height: '100%', border: 'none' }} 
              sandbox="allow-same-origin allow-scripts allow-popups" 
              allow="autoplay; encrypted-media" 
              allowFullScreen 
              title="Task Content" 
            />

            {status === 'paused_tab' && (
              <div style={{ position: 'absolute', inset: 0, background: C.glass, backdropFilter: 'blur(8px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
                <h2 style={{ fontFamily: "'Inter', sans-serif", color: C.textMain, marginBottom: 8 }}>Attention Lost</h2>
                <p style={{ color: C.textMuted, maxWidth: 300, textAlign: 'center', fontSize: 14 }}>Return focus here to resume the timer.</p>
              </div>
            )}
          </div>
        )}

        {status === 'quiz' && (
          <div className="animate-slideUp" style={{ background: C.card, borderRadius: 16, padding: 40, border: `1px solid ${C.line}`, boxShadow: C.shadow, marginTop: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.limeDim, color: C.limeText, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>✓</div>
              <h3 style={{ fontFamily: "'Inter', sans-serif", color: C.textMain, fontSize: 24, margin: 0 }}>Human Verification</h3>
            </div>
            <p style={{ color: C.textMuted, fontSize: 15, marginBottom: 32 }}>Verify your attention to earn {task.reward_points} points.</p>
            
            <div style={{ background: C.input, padding: 20, borderRadius: 12, color: C.textMain, fontWeight: 700, fontSize: 16, marginBottom: 24, border: `1px solid ${C.line}` }}>Q: {task.quiz_question}</div>
            
            <div style={{ display: 'flex', gap: 12 }}>
              <input type="text" placeholder="Type exact answer here..." value={userAnswer} onChange={function(e) { setUserAnswer(e.target.value); }} style={{ flex: 1, padding: '16px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.input, color: C.textMain, fontSize: 15, outline: 'none' }} />
              <button onClick={submitQuiz} disabled={submitting} style={{ background: C.lime, color: '#000000', border: 'none', borderRadius: 8, padding: '0 32px', fontSize: 15, fontWeight: 800, cursor: submitting ? 'not-allowed' : 'pointer' }}>{submitting ? 'Verifying...' : 'Submit Answer'}</button>
            </div>
            <div style={{ fontSize: 13, color: attempts < 3 ? C.red : C.textMuted, marginTop: 16, textAlign: 'right', fontWeight: 600 }}>
              Attempts remaining: {attempts} / 3
            </div>
          </div>
        )}

        {status === 'completed' && (
          <div className="animate-fadeIn" style={{ background: C.limeDim, border: `1px solid ${C.limeText}`, borderRadius: 16, padding: 48, textAlign: 'center', marginTop: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
            <h3 style={{ fontFamily: "'Inter', sans-serif", color: C.limeText, fontSize: 28, marginBottom: 8, fontWeight: 800 }}>Task Verified</h3>
            <p style={{ color: C.limeText, fontSize: 15, opacity: 0.8, marginBottom: 24 }}>+{task.reward_points} points added to wallet.</p>
            <button onClick={function() { navigate('tasks'); }} style={{ background: C.lime, color: '#000000', border: 'none', borderRadius: 8, padding: '14px 40px', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>Find More Tasks</button>
          </div>
        )}

        {status === 'failed' && (
          <div className="animate-fadeIn" style={{ background: 'rgba(239,68,68,0.1)', border: `1px solid ${C.red}`, borderRadius: 16, padding: 48, textAlign: 'center', marginTop: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <h3 style={{ fontFamily: "'Inter', sans-serif", color: C.red, fontSize: 24, marginBottom: 8, fontWeight: 800 }}>Verification Failed</h3>
            <p style={{ color: C.red, fontSize: 15, opacity: 0.8, marginBottom: 24 }}>This task has been securely locked for 24 hours.</p>
            <button onClick={function() { navigate('tasks'); }} style={{ background: C.textMain, color: C.surface, border: 'none', borderRadius: 8, padding: '14px 40px', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>Return to Network</button>
          </div>
        )}

      </div>
    </div>
  );
}
