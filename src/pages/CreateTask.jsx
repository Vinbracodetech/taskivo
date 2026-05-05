import { useState } from 'react';
import { supabase } from '../lib/supabase';

const CATEGORIES = ['Technology', 'Entertainment', 'Education', 'Business', 'Health', 'Food & Cooking', 'Social Media', 'E-commerce'];

export default function CreateTask({ navigate, showToast, user }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    video_id: '',
    channel_name: '',
    category: 'Entertainment',
    reward_points: '',
    slots: '',
    watch_duration: '60',
    quiz_question: '',
    quiz_answer: '',
    subscribe_bonus: '0',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function handleChange(e) {
    var name = e.target.name;
    var value = e.target.value;
    setForm(function (prev) { return { ...prev, [name]: value }; });
    setErrors(function (prev) { return { ...prev, [name]: '' }; });
  }

  function extractVideoId(input) {
    var trimmed = input.trim();
    var match = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
    if (trimmed.length === 11) return trimmed;
    return trimmed;
  }

  function validate() {
    var e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.video_id.trim()) e.video_id = 'YouTube URL or video ID is required';
    if (!form.channel_name.trim()) e.channel_name = 'Channel name is required';
    if (!form.reward_points || parseInt(form.reward_points) < 10) e.reward_points = 'Minimum reward is 10 points';
    if (!form.slots || parseInt(form.slots) < 1) e.slots = 'At least 1 slot required';
    if (!form.watch_duration || parseInt(form.watch_duration) < 10) e.watch_duration = 'Minimum 10 seconds';
    if (!form.quiz_question.trim()) e.quiz_question = 'Quiz question is required';
    if (!form.quiz_answer.trim()) e.quiz_answer = 'Quiz answer is required';
    return e;
  }

  async function handleSubmit() {
    var e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      showToast('Please fix the errors below', 'error');
      return;
    }
    setLoading(true);

    var videoId = extractVideoId(form.video_id);
    var slotsCount = parseInt(form.slots);

    var result = await supabase.from('tasks').insert({
      creator_id: user.id,
      title: form.title.trim(),
      description: form.description.trim(),
      video_id: videoId,
      channel_name: form.channel_name.trim(),
      category: form.category,
      reward_points: parseInt(form.reward_points),
      slots: slotsCount,
      slots_remaining: slotsCount,
      completed_slots: 0,
      watch_duration: parseInt(form.watch_duration),
      quiz_question: form.quiz_question.trim(),
      quiz_answer: form.quiz_answer.trim(),
      subscribe_bonus: parseInt(form.subscribe_bonus) || 0,
      status: 'pending',
      platform: 'youtube',
    });

    setLoading(false);

    if (result.error) {
      showToast('Task creation failed: ' + result.error.message, 'error');
      return;
    }

    showToast('Task submitted for review! 🎉', 'success');
    navigate('creator-tasks');
  }

  const s = {
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
    body: {
      padding: '20px 16px'
    },
    card: {
      background: '#fff',
      borderRadius: '14px',
      padding: '20px',
      marginBottom: '16px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)'
    },
    sectionTitle: {
      fontSize: '13px',
      fontWeight: 700,
      color: '#888',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom: '14px'
    },
    label: {
      fontSize: '13px',
      fontWeight: 600,
      color: '#0D0D14',
      marginBottom: '6px',
      display: 'block'
    },
    input: {
      width: '100%',
      padding: '11px 14px',
      borderRadius: '10px',
      border: '1.5px solid #E8E8E8',
      fontSize: '14px',
      fontFamily: "'DM Sans', sans-serif",
      boxSizing: 'border-box',
      outline: 'none',
      marginBottom: '4px',
      background: '#FAFAFA'
    },
    textarea: {
      width: '100%',
      padding: '11px 14px',
      borderRadius: '10px',
      border: '1.5px solid #E8E8E8',
      fontSize: '14px',
      fontFamily: "'DM Sans', sans-serif",
      boxSizing: 'border-box',
      outline: 'none',
      marginBottom: '4px',
      background: '#FAFAFA',
      resize: 'vertical',
      minHeight: '80px'
    },
    select: {
      width: '100%',
      padding: '11px 14px',
      borderRadius: '10px',
      border: '1.5px solid #E8E8E8',
      fontSize: '14px',
      fontFamily: "'DM Sans', sans-serif",
      boxSizing: 'border-box',
      outline: 'none',
      marginBottom: '4px',
      background: '#FAFAFA'
    },
    hint: {
      fontSize: '11px',
      color: '#aaa',
      marginBottom: '12px'
    },
    error: {
      fontSize: '11px',
      color: '#e74c3c',
      marginBottom: '12px'
    },
    group: {
      marginBottom: '14px'
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px'
    },
    submitBtn: {
      width: '100%',
      padding: '16px',
      background: '#A8FF3E',
      color: '#0D0D14',
      border: 'none',
      borderRadius: '14px',
      fontWeight: 800,
      fontSize: '16px',
      cursor: loading ? 'not-allowed' : 'pointer',
      fontFamily: "'Syne', sans-serif",
      opacity: loading ? 0.7 : 1
    },
    budgetBox: {
      background: 'rgba(168,255,62,0.08)',
      border: '1px solid rgba(168,255,62,0.3)',
      borderRadius: '10px',
      padding: '12px 14px',
      fontSize: '13px',
      color: '#5A8A00',
      fontWeight: 600,
      marginBottom: '16px'
    }
  };

  return (
    <div style={s.page}>

      {/* Header */}
      <div style={s.header}>
        <button style={s.backBtn} onClick={function () { navigate('creator-dashboard'); }}>←</button>
        <p style={s.headerTitle}>Post a New Task</p>
      </div>

      <div style={s.body}>

        {/* Basic Info */}
        <div style={s.card}>
          <p style={s.sectionTitle}>Basic Info</p>

          <div style={s.group}>
            <label style={s.label}>Task Title</label>
            <input style={s.input} name="title" placeholder="e.g. Watch & Like Our New Music Video" value={form.title} onChange={handleChange} />
            {errors.title && <p style={s.error}>{errors.title}</p>}
          </div>

          <div style={s.group}>
            <label style={s.label}>Description</label>
            <textarea style={s.textarea} name="description" placeholder="Tell earners what to do..." value={form.description} onChange={handleChange} />
            {errors.description && <p style={s.error}>{errors.description}</p>}
          </div>

          <div style={s.group}>
            <label style={s.label}>Category</label>
            <select style={s.select} name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map(function (c) {
                return <option key={c} value={c}>{c}</option>;
              })}
            </select>
          </div>
        </div>

        {/* Video Info */}
        <div style={s.card}>
          <p style={s.sectionTitle}>YouTube Video</p>

          <div style={s.group}>
            <label style={s.label}>YouTube URL or Video ID</label>
            <input style={s.input} name="video_id" placeholder="https://youtube.com/watch?v=... or just the ID" value={form.video_id} onChange={handleChange} />
            <p style={s.hint}>Paste the full YouTube link — we'll extract the ID automatically</p>
            {errors.video_id && <p style={s.error}>{errors.video_id}</p>}
          </div>

          <div style={s.group}>
            <label style={s.label}>Channel Name</label>
            <input style={s.input} name="channel_name" placeholder="e.g. TechWithTim" value={form.channel_name} onChange={handleChange} />
            {errors.channel_name && <p style={s.error}>{errors.channel_name}</p>}
          </div>

          <div style={s.group}>
            <label style={s.label}>Required Watch Time (seconds)</label>
            <input style={s.input} type="number" name="watch_duration" placeholder="e.g. 60" value={form.watch_duration} onChange={handleChange} min="10" />
            <p style={s.hint}>How long must earners watch before steps unlock?</p>
            {errors.watch_duration && <p style={s.error}>{errors.watch_duration}</p>}
          </div>
        </div>

        {/* Rewards */}
        <div style={s.card}>
          <p style={s.sectionTitle}>Rewards & Slots</p>

          <div style={s.row}>
            <div style={s.group}>
              <label style={s.label}>Points Per Completion</label>
              <input style={s.input} type="number" name="reward_points" placeholder="e.g. 200" value={form.reward_points} onChange={handleChange} min="10" />
              {errors.reward_points && <p style={s.error}>{errors.reward_points}</p>}
            </div>
            <div style={s.group}>
              <label style={s.label}>Total Slots</label>
              <input style={s.input} type="number" name="slots" placeholder="e.g. 100" value={form.slots} onChange={handleChange} min="1" />
              {errors.slots && <p style={s.error}>{errors.slots}</p>}
            </div>
          </div>

          <div style={s.group}>
            <label style={s.label}>Subscribe Bonus Points (optional)</label>
            <input style={s.input} type="number" name="subscribe_bonus" placeholder="e.g. 50" value={form.subscribe_bonus} onChange={handleChange} min="0" />
            <p style={s.hint}>Extra points if earner subscribes to your channel. Set 0 to disable.</p>
          </div>

          {form.reward_points && form.slots && (
            <div style={s.budgetBox}>
              💡 Total budget if all slots filled: <strong>{(parseInt(form.reward_points) * parseInt(form.slots)).toLocaleString()} points</strong>
            </div>
          )}
        </div>

        {/* Quiz */}
        <div style={s.card}>
          <p style={s.sectionTitle}>Anti-Cheat Quiz</p>

          <div style={s.group}>
            <label style={s.label}>Quiz Question</label>
            <input style={s.input} name="quiz_question" placeholder="e.g. What product was shown in the video?" value={form.quiz_question} onChange={handleChange} />
            {errors.quiz_question && <p style={s.error}>{errors.quiz_question}</p>}
          </div>

          <div style={s.group}>
            <label style={s.label}>Correct Answer</label>
            <input style={s.input} name="quiz_answer" placeholder="e.g. AirPods Pro" value={form.quiz_answer} onChange={handleChange} />
            <p style={s.hint}>Earners must type this exactly to claim points</p>
            {errors.quiz_answer && <p style={s.error}>{errors.quiz_answer}</p>}
          </div>
        </div>

        {/* Submit */}
        <button style={s.submitBtn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Task for Review →'}
        </button>

      </div>
    </div>
  );
}
