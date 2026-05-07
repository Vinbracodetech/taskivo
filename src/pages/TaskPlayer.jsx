import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import useToast from '../components/useToast';

const C = {
  ink: '#0D0D14',
  lime: '#A8FF3E',
  white: '#ffffff',
  off: '#F7F8FA',
  slate: '#6B7280',
  line: '#EBEBEB',
  red: '#ef4444'
};

export default function TaskPlayer({ session, navigate, taskId }) {
  const { showToast, ToastComponent } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  
  // Player State
  const [timeLeft, setTimeLeft] = useState(0);
  const [status, setStatus] = useState('playing'); // 'playing', 'paused_tab', 'quiz', 'completed', 'failed'
  const [attempts, setAttempts] = useState(3);
  const [userAnswer, setUserAnswer] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Use refs to track latest values inside event listeners
  const timeRef = useRef(0);
  const statusRef = useRef('playing');

  useEffect(function() {
    if (!session || !session.user) {
      navigate('auth');
      return;
    }
    fetchTask();
  }, [taskId, session]);

  async function fetchTask() {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', taskId)
        .single();

      if (error) throw error;
      
      setTask(data);
      setTimeLeft(data.watch_duration);
      timeRef.current = data.watch_duration;
      setLoading(false);
    } catch (err) {
      console.error(err);
      showToast('Failed to load task.', 'error');
      setTimeout(function() { navigate('tasks'); }, 2000);
    }
  }

  // ── STRICT TAB-SWITCH DETECTION & TIMER ──
  useEffect(function() {
    if (loading || !task || statusRef.current === 'quiz' || statusRef.current === 'completed' || statusRef.current === 'failed') return;

    // The Interval Timer
    const timer = setInterval(function() {
      if (document.hidden) return; // Do not count down if hidden
      
      if (statusRef.current === 'playing' && timeRef.current > 0) {
        timeRef.current -= 1;
        setTimeLeft(timeRef.current);
      } else if (timeRef.current <= 0 && statusRef.current === 'playing') {
        setStatus('quiz');
        statusRef.current = 'quiz';
        clearInterval(timer);
      }
    }, 1000);

    // The Visibility Listener
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

  // ── QUIZ SUBMISSION & REFERRAL PAYOUT ──
  async function submitQuiz() {
    if (!userAnswer.trim()) {
      showToast('Please enter an answer.', 'error');
      return;
    }

    setSubmitting(true);

    const isCorrect = userAnswer.trim().toLowerCase() === task.quiz_answer.toLowerCase();

    if (!isCorrect) {
      const newAttempts = attempts - 1;
      setAttempts(newAttempts);
      
      if (newAttempts <= 0) {
        setStatus('failed');
        statusRef.current = 'failed';
        showToast('Task failed. Out of attempts.', 'error');
      } else {
        showToast(`Incorrect answer. ${newAttempts} attempts left.`, 'error');
        setUserAnswer('');
      }
      setSubmitting(false);
      return;
    }

    // Passed the quiz! Process completion
    try {
      // 1. Check if they already completed this (prevents double payout bug)
      const { data: existing } = await supabase
        .from('completions')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('task_id', task.id)
        .single();

      if (existing) {
        setStatus('completed');
        showToast('You already completed this task recently.', 'error');
        setSubmitting(false);
        return;
      }

      // 2. Insert Completion
      await supabase.from('completions').insert([{
        user_id: session.user.id,
        task_id: task.id,
        points_earned: task.reward_points
      }]);

      // 3. Give Earned Points to User
      const { data: userData } = await supabase.from('profiles').select('points, referred_by').eq('id', session.user.id).single();
      await supabase.from('profiles')
        .update({ points: userData.points + task.reward_points })
        .eq('id', session.user.id);

      // 4. Deduct slot from Task
      await supabase.from('tasks')
        .update({ 
          slots_remaining: task.slots_remaining - 1,
          completed_slots: task.completed_slots + 1 
        })
        .eq('id', task.id);

      // 5. 🚀 ZERO-TOUCH VIRAL LOOP: Process Referral Payout 🚀
      // Count total completions. If it's exactly 1, this is their first ever task!
      const { count } = await supabase.from('completions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

      if (count === 1 && userData.referred_by) {
        // Find the person who invited them
        const { data: referrer } = await supabase.from('profiles')
          .select('points')
          .eq('id', userData.referred_by)
          .single();
          
        if (referrer) {
          // Give the referrer 50 points!
          await supabase.from('profiles')
            .update({ points: referrer.points + 50 })
            .eq('id', userData.referred_by);
        }
      }

      setStatus('completed');
      statusRef.current = 'completed';
      showToast('Task verified! Points added.', 'success');

    } catch (err) {
      console.error(err);
      showToast('Error verifying task.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  // Helper to safely format minutes/seconds
  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  if (loading) {
    return (
      <div style={{ background: C.off, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
        <div style={{ color: C.slate, fontWeight: 600 }}>Loading Verification Sandbox...</div>
      </div>
    );
  }

  const isBlog = task.platform === 'blog';

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.off, color: C.ink, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {ToastComponent}
      
      {/* TOP NAV BAR */}
      <div style={{ background: C.white, borderBottom: `1px solid ${C.line}`, padding: '16px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button 
            onClick={function() { navigate('tasks'); }}
            style={{ background: C.off, border: `1px solid ${C.line}`, borderRadius: 8, padding: '8px 12px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
          >
            ← Leave Task
          </button>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{task.title}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {status === 'paused_tab' && (
            <span style={{ color: C.red, fontSize: 12, fontWeight: 700, background: 'rgba(239,68,68,0.1)', padding: '4px 8px', borderRadius: 4 }}>
              ⏸ Timer Paused - Focus Lost
            </span>
          )}
          <div style={{ background: C.ink, color: C.lime, padding: '8px 16px', borderRadius: 8, fontSize: 16, fontWeight: 700, fontFamily: "'Inter', sans-serif", letterSpacing: 1 }}>
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 1000, margin: '0 auto', width: '100%', padding: '24px 5%' }}>
        
        {/* THE OMNICHANNEL IFRAME */}
        <div style={{ flex: 1, background: C.white, border: `1px solid ${C.line}`, borderRadius: 16, overflow: 'hidden', minHeight: 400, position: 'relative', marginBottom: 24 }}>
          {isBlog ? (
            <iframe 
              src={task.video_id} 
              style={{ width: '100%', height: '100%', border: 'none' }}
              sandbox="allow-same-origin allow-scripts"
              title="SEO Blog Content"
            />
          ) : (
            <iframe 
              src={`https://www.youtube.com/embed/${task.video_id}?autoplay=1&mute=1`} // Muted for autoplay compliance
              style={{ width: '100%', height: '100%', border: 'none' }}
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="YouTube Task"
            />
          )}

          {/* PAUSE OVERLAY */}
          {status === 'paused_tab' && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
              <h2 style={{ fontFamily: "'Inter', sans-serif", color: C.ink, marginBottom: 8 }}>Attention Lost</h2>
              <p style={{ color: C.slate, maxWidth: 300, textAlign: 'center', fontSize: 14 }}>
                You switched tabs or minimized the window. Return focus here to resume the timer.
              </p>
            </div>
          )}
        </div>

        {/* VERIFICATION GATE (QUIZ) */}
        {status === 'quiz' && (
          <div style={{ background: C.ink, borderRadius: 16, padding: 32, border: `1px solid ${C.darkLine}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.lime, color: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>✓</div>
              <h3 style={{ fontFamily: "'Inter', sans-serif", color: C.white, fontSize: 20, margin: 0 }}>Human Verification</h3>
            </div>
            
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 24 }}>
              To claim your {task.reward_points} points, prove you engaged with the content by answering this question:
            </p>

            <div style={{ background: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 8, color: C.lime, fontWeight: 600, fontSize: 16, marginBottom: 24 }}>
              Q: {task.quiz_question}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <input 
                type="text" 
                placeholder="Type exact answer here..."
                value={userAnswer}
                onChange={function(e) { setUserAnswer(e.target.value); }}
                style={{ flex: 1, padding: '14px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: C.white, fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: 'none' }}
              />
              <button 
                onClick={submitQuiz}
                disabled={submitting}
                style={{ background: C.lime, color: C.ink, border: 'none', borderRadius: 8, padding: '0 24px', fontSize: 15, fontWeight: 700, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif" }}
              >
                {submitting ? 'Verifying...' : 'Submit Answer'}
              </button>
            </div>
            <div style={{ fontSize: 12, color: attempts < 3 ? C.red : 'rgba(255,255,255,0.4)', marginTop: 12, textAlign: 'right' }}>
              Attempts remaining: {attempts} / 3
            </div>
          </div>
        )}

        {/* COMPLETED / FAILED MESSAGES */}
        {status === 'completed' && (
          <div style={{ background: C.limeDim, border: `1px solid ${C.lime}`, borderRadius: 16, padding: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
            <h3 style={{ fontFamily: "'Inter', sans-serif", color: '#3d6600', fontSize: 22, marginBottom: 8 }}>Task Verified</h3>
            <p style={{ color: '#5c9900', fontSize: 15, marginBottom: 24 }}>
              +{task.reward_points} points have been credited to your wallet. 
            </p>
            <button 
              onClick={function() { navigate('tasks'); }}
              style={{ background: C.lime, color: C.ink, border: 'none', borderRadius: 8, padding: '12px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}
            >
              Find More Tasks
            </button>
          </div>
        )}

        {status === 'failed' && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: `1px solid ${C.red}`, borderRadius: 16, padding: 32, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>❌</div>
            <h3 style={{ fontFamily: "'Inter', sans-serif", color: C.red, fontSize: 22, marginBottom: 8 }}>Verification Failed</h3>
            <p style={{ color: '#b91c1c', fontSize: 15, marginBottom: 24 }}>
              You failed the anti-cheat verification. This task is now locked.
            </p>
            <button 
              onClick={function() { navigate('tasks'); }}
              style={{ background: C.ink, color: C.white, border: 'none', borderRadius: 8, padding: '12px 32px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}
            >
              Return to Feed
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
