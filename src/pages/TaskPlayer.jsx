import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import useToast from '../components/useToast';
import Toast from '../components/Toast';

export default function TaskPlayer({ task, user, navigate }) {
  const { toasts, show: showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [timerDone, setTimerDone] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(task ? task.watch_duration || 60 : 60);
  const [timerStarted, setTimerStarted] = useState(false);
  const [liked, setLiked] = useState(false);
  const [commented, setCommented] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [quizAnswer, setQuizAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const intervalRef = useRef(null);
  const totalSeconds = task ? task.watch_duration || 60 : 60;

  useEffect(function () {
    async function loadProfile() {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (data) setProfile(data);
    }
    loadProfile();
  }, [user]);

  useEffect(function () {
    function handleVisibility() {
      if (document.hidden && timerStarted && !timerDone) {
        clearInterval(intervalRef.current);
      } else if (!document.hidden && timerStarted && !timerDone) {
        startCountdown();
      }
    }
    document.addEventListener('visibilitychange', handleVisibility);
    return function () {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [timerStarted, timerDone]);

  function startCountdown() {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(function () {
      setSecondsLeft(function (prev) {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setTimerDone(true);
          setStep(1);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  function handleStartTimer() {
    setTimerStarted(true);
    startCountdown();
  }

  function handleOpenComment() {
    const url = 'https://www.youtube.com/watch?v=' + (task.video_id || '');
    window.open(url, '_blank');
  }

  async function handleSubmit() {
    if (!liked) { showToast('Please confirm you liked the video', 'error'); return; }
    if (!commented) { showToast('Please confirm you left a comment', 'error'); return; }
    if (!quizAnswer.trim()) { showToast('Please answer the quiz question', 'error'); return; }

    const correctAnswer = (task.quiz_answer || '').toLowerCase().trim();
    if (correctAnswer && quizAnswer.toLowerCase().trim() !== correctAnswer) {
      showToast('Wrong answer! Watch the video carefully and try again.', 'error');
      return;
    }

    setLoading(true);

    try {
      const basePoints = task.points || 0;
      const bonusPoints = subscribed ? (task.subscribe_bonus || 0) : 0;
      const totalPoints = basePoints + bonusPoints;

      const { error: completionError } = await supabase
        .from('completions')
        .insert({
          user_id: user.id,
          task_id: task.id,
          comment_text: commentText,
          subscribed: subscribed,
          points_earned: totalPoints,
          completed_at: new Date().toISOString()
        });

      if (completionError) throw completionError;

      const newPoints = (profile.points || 0) + totalPoints;
      await supabase
        .from('profiles')
        .update({ points: newPoints })
        .eq('id', user.id);

      await supabase
        .from('tasks')
        .update({ completed_slots: (task.completed_slots || 0) + 1 })
        .eq('id', task.id);

      setSubmitted(true);
      showToast('🎉 You earned ' + totalPoints.toLocaleString() + ' points!', 'success');

      setTimeout(function () {
        navigate('tasks');
      }, 2500);

    } catch (err) {
      showToast('Something went wrong. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  }

  if (!task) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
        No task selected.
        <br />
        <button
          onClick={function () { navigate('tasks'); }}
          style={{ marginTop: '16px', padding: '10px 20px', background: '#A8FF3E', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
        >
          Back to Tasks
        </button>
      </div>
    );
  }

  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  const styles = {
    page: {
      minHeight: '100vh',
      background: '#F7F8FA',
      fontFamily: "'DM Sans', sans-serif",
      paddingBottom: '100px'
    },
    header: {
      background: '#0D0D14',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    backBtn: {
      background: 'none',
      border: 'none',
      color: '#A8FF3E',
      fontSize: '22px',
      cursor: 'pointer',
      padding: '0'
    },
    headerTitle: {
      color: '#fff',
      fontSize: '16px',
      fontWeight: 700,
      margin: 0,
      fontFamily: "'Syne', sans-serif"
    },
    videoWrap: {
      position: 'relative',
      width: '100%',
      paddingTop: '56.25%',
      background: '#000'
    },
    iframe: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      border: 'none'
    },
    body: {
      padding: '20px 16px'
    },
    taskTitle: {
      fontSize: '18px',
      fontWeight: 700,
      color: '#0D0D14',
      margin: '0 0 4px 0',
      fontFamily: "'Syne', sans-serif"
    },
    taskMeta: {
      fontSize: '13px',
      color: '#888',
      margin: '0 0 20px 0'
    },
    pointsBadge: {
      display: 'inline-block',
      background: '#A8FF3E',
      color: '#0D0D14',
      fontWeight: 800,
      fontSize: '13px',
      padding: '4px 10px',
      borderRadius: '20px',
      marginRight: '8px'
    },
    timerBox: {
      background: '#fff',
      borderRadius: '14px',
      padding: '20px',
      marginBottom: '16px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
    },
    timerLabel: {
      fontSize: '13px',
      color: '#888',
      marginBottom: '8px'
    },
    timerTrack: {
      height: '8px',
      background: '#F0F0F0',
      borderRadius: '8px',
      overflow: 'hidden',
      marginBottom: '12px'
    },
    timerFill: {
      height: '100%',
      width: progress + '%',
      background: timerDone ? '#A8FF3E' : '#0D0D14',
      borderRadius: '8px',
      transition: 'width 1s linear'
    },
    timerCount: {
      fontSize: '28px',
      fontWeight: 800,
      color: timerDone ? '#A8FF3E' : '#0D0D14',
      fontFamily: "'Syne', sans-serif"
    },
    startBtn: {
      width: '100%',
      padding: '14px',
      background: '#0D0D14',
      color: '#A8FF3E',
      border: 'none',
      borderRadius: '12px',
      fontWeight: 700,
      fontSize: '15px',
      cursor: 'pointer',
      marginTop: '12px',
      fontFamily: "'DM Sans', sans-serif"
    },
    stepsBox: {
      background: '#fff',
      borderRadius: '14px',
      padding: '20px',
      marginBottom: '16px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
    },
    stepsTitle: {
      fontSize: '14px',
      fontWeight: 700,
      color: '#0D0D14',
      marginBottom: '16px'
    },
    stepRow: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      marginBottom: '16px',
      opacity: timerDone ? 1 : 0.4,
      pointerEvents: timerDone ? 'auto' : 'none'
    },
    checkbox: {
      width: '22px',
      height: '22px',
      accentColor: '#A8FF3E',
      cursor: 'pointer',
      marginTop: '2px',
      flexShrink: 0
    },
    stepLabel: {
      fontSize: '14px',
      color: '#0D0D14',
      fontWeight: 600
    },
    stepSub: {
      fontSize: '12px',
      color: '#888',
      marginTop: '2px'
    },
    openYtBtn: {
      marginTop: '8px',
      padding: '8px 16px',
      background: '#FF0000',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      fontWeight: 700,
      fontSize: '13px',
      cursor: 'pointer'
    },
    textarea: {
      width: '100%',
      marginTop: '8px',
      padding: '10px',
      borderRadius: '8px',
      border: '1.5px solid #E8E8E8',
      fontSize: '13px',
      fontFamily: "'DM Sans', sans-serif",
      resize: 'vertical',
      boxSizing: 'border-box',
      outline: 'none'
    },
    quizBox: {
      background: '#fff',
      borderRadius: '14px',
      padding: '20px',
      marginBottom: '16px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      opacity: timerDone ? 1 : 0.4,
      pointerEvents: timerDone ? 'auto' : 'none'
    },
    quizTitle: {
      fontSize: '14px',
      fontWeight: 700,
      color: '#0D0D14',
      marginBottom: '8px'
    },
    quizQ: {
      fontSize: '13px',
      color: '#444',
      marginBottom: '12px'
    },
    quizInput: {
      width: '100%',
      padding: '10px',
      borderRadius: '8px',
      border: '1.5px solid #E8E8E8',
      fontSize: '13px',
      fontFamily: "'DM Sans', sans-serif",
      boxSizing: 'border-box',
      outline: 'none'
    },
    submitBtn: {
      width: '100%',
      padding: '16px',
      background: submitted ? '#ccc' : '#A8FF3E',
      color: '#0D0D14',
      border: 'none',
      borderRadius: '14px',
      fontWeight: 800,
      fontSize: '16px',
      cursor: submitted || loading ? 'not-allowed' : 'pointer',
      fontFamily: "'Syne', sans-serif",
      letterSpacing: '-0.3px'
    },
    bonusBadge: {
      display: 'inline-block',
      background: '#FFF3CD',
      color: '#B8860B',
      fontWeight: 700,
      fontSize: '11px',
      padding: '2px 8px',
      borderRadius: '20px',
      marginLeft: '8px'
    }
  };

  return (
    <div style={styles.page}>
      <Toast toasts={toasts} />

      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={function () { navigate('tasks'); }}>←</button>
        <p style={styles.headerTitle}>Task Player</p>
      </div>

      {/* Video */}
      <div style={styles.videoWrap}>
        <iframe
          style={styles.iframe}
          src={'https://www.youtube.com/embed/' + (task.video_id || '') + '?rel=0&modestbranding=1'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div style={styles.body}>

        {/* Task Info */}
        <p style={styles.taskTitle}>{task.title}</p>
        <p style={styles.taskMeta}>{task.channel_name || 'YouTube Task'}</p>
        <div style={{ marginBottom: '20px' }}>
          <span style={styles.pointsBadge}>{(task.points || 0).toLocaleString()} pts</span>
          {task.subscribe_bonus > 0 && (
            <span style={styles.bonusBadge}>+{(task.subscribe_bonus || 0).toLocaleString()} bonus if subscribed</span>
          )}
        </div>

        {/* Timer */}
        <div style={styles.timerBox}>
          <p style={styles.timerLabel}>
            {timerDone ? '✅ Watch complete! Steps unlocked below.' : timerStarted ? 'Watching... don\'t leave this tab' : 'Start the timer after clicking play above'}
          </p>
          <div style={styles.timerTrack}>
            <div style={styles.timerFill} />
          </div>
          <p style={styles.timerCount}>
            {timerDone ? 'Done!' : (Math.floor(secondsLeft / 60) + ':' + String(secondsLeft % 60).padStart(2, '0'))}
          </p>
          {!timerStarted && !timerDone && (
            <button style={styles.startBtn} onClick={handleStartTimer}>
              ▶ Start Timer
            </button>
          )}
          {timerStarted && !timerDone && (
            <p style={{ fontSize: '12px', color: '#e74c3c', marginTop: '8px' }}>
              ⚠️ Timer pauses if you switch tabs
            </p>
          )}
        </div>

        {/* Steps */}
        <div style={styles.stepsBox}>
          <p style={styles.stepsTitle}>Complete these steps</p>

          {/* Like */}
          <div style={styles.stepRow}>
            <input
              type="checkbox"
              style={styles.checkbox}
              checked={liked}
              onChange={function (e) { setLiked(e.target.checked); }}
            />
            <div>
              <p style={styles.stepLabel}>👍 Like the video</p>
              <p style={styles.stepSub}>Go to YouTube and like the video, then tick this box</p>
            </div>
          </div>

          {/* Comment */}
          <div style={styles.stepRow}>
            <input
              type="checkbox"
              style={styles.checkbox}
              checked={commented}
              onChange={function (e) { setCommented(e.target.checked); }}
            />
            <div style={{ flex: 1 }}>
              <p style={styles.stepLabel}>💬 Leave a comment</p>
              <p style={styles.stepSub}>Type your comment below, then post it on YouTube</p>
              <textarea
                style={styles.textarea}
                rows={3}
                placeholder="Type your comment here..."
                value={commentText}
                onChange={function (e) { setCommentText(e.target.value); }}
              />
              <button style={styles.openYtBtn} onClick={handleOpenComment}>
                Open YouTube to Comment
              </button>
            </div>
          </div>

          {/* Subscribe (optional) */}
          <div style={{ ...styles.stepRow, opacity: timerDone ? 1 : 0.4, pointerEvents: timerDone ? 'auto' : 'none' }}>
            <input
              type="checkbox"
              style={styles.checkbox}
              checked={subscribed}
              onChange={function (e) { setSubscribed(e.target.checked); }}
            />
            <div>
              <p style={styles.stepLabel}>
                🔔 Subscribe to channel
                <span style={styles.bonusBadge}>Optional +{(task.subscribe_bonus || 0).toLocaleString()} pts</span>
              </p>
              <p style={styles.stepSub}>Subscribe on YouTube for bonus points</p>
            </div>
          </div>
        </div>

        {/* Quiz */}
        <div style={styles.quizBox}>
          <p style={styles.quizTitle}>🧠 Quick Quiz</p>
          <p style={styles.quizQ}>{task.quiz_question || 'What is the main topic of this video?'}</p>
          <input
            type="text"
            style={styles.quizInput}
            placeholder="Type your answer..."
            value={quizAnswer}
            onChange={function (e) { setQuizAnswer(e.target.value); }}
          />
        </div>

        {/* Submit */}
        <button
          style={styles.submitBtn}
          onClick={handleSubmit}
          disabled={submitted || loading || !timerDone}
        >
          {loading ? 'Submitting...' : submitted ? 'Submitted ✓' : !timerDone ? 'Watch the video first' : 'Submit & Claim Points'}
        </button>

      </div>
    </div>
  );
}
