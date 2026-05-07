import { useState } from 'react';
import { supabase } from '../lib/supabase';
import useToast from '../components/useToast';

const C = {
  surface: 'var(--surface)', card: 'var(--surface-card)', input: 'var(--surface-card)',
  textMain: 'var(--ink)', textMuted: 'var(--slate)', line: 'var(--line)',
  lime: '#A8FF3E', shadow: 'var(--shadow)',
};

export default function CreateTask({ session, navigate }) {
  const { showToast, ToastComponent } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('youtube');
  const [url, setUrl] = useState('');
  const [duration, setDuration] = useState('60');
  const [slots, setSlots] = useState('100');
  const [quizQ, setQuizQ] = useState('');
  const [quizA, setQuizA] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      let finalVideoId = url;
      if (platform === 'youtube') {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
        if (match) finalVideoId = match[1];
      }

      const { error } = await supabase.from('tasks').insert([{
        user_id: session.user.id,
        title: title,
        platform: platform,
        video_id: finalVideoId,
        watch_duration: parseInt(duration),
        slots: parseInt(slots),
        slots_remaining: parseInt(slots),
        completed_slots: 0,
        reward_points: 50, // Hidden from Business, set automatically for Earners
        quiz_question: quizQ,
        quiz_answer: quizA,
        status: 'pending_payment'
      }]);

      if (error) throw error;
      showToast('Campaign drafted!', 'success');
      navigate('creator-tasks');
    } catch (err) {
      showToast(err.message, 'error');
      setSubmitting(false);
    }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.surface, color: C.textMain, minHeight: '100vh', padding: '40px 5% 120px' }}>
      {ToastComponent}
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 28, color: C.textMain, marginBottom: 8, fontWeight: 800 }}>Launch Campaign</h1>
          <p style={{ color: C.textMuted, fontSize: 15 }}>Deploy your allocated slots to the network.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 32, boxShadow: C.shadow }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, color: C.textMain, marginBottom: 24, fontWeight: 700 }}>1. Campaign Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Campaign Title</label>
                <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Q3 Product Launch" style={{ width: '100%', padding: '14px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.input, color: C.textMain, outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Platform</label>
                  <select value={platform} onChange={(e) => setPlatform(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.input, color: C.textMain, outline: 'none' }}>
                    <option value="youtube">YouTube Video</option>
                    <option value="blog">SEO Blog Article</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Content Link</label>
                  <input required type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste URL here" style={{ width: '100%', padding: '14px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.input, color: C.textMain, outline: 'none' }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 32, boxShadow: C.shadow }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, color: C.textMain, marginBottom: 24, fontWeight: 700 }}>2. Engagement Requirements</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Required Watch Time (Secs)</label>
                <input required type="number" min="30" value={duration} onChange={(e) => setDuration(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.input, color: C.textMain, outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Slots to Allocate</label>
                <input required type="number" min="10" value={slots} onChange={(e) => setSlots(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.input, color: C.textMain, outline: 'none' }} />
              </div>
            </div>
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 32, boxShadow: C.shadow }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, color: C.textMain, marginBottom: 24, fontWeight: 700 }}>3. Anti-Cheat Verification</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Contextual Question</label>
                <input required type="text" value={quizQ} onChange={(e) => setQuizQ(e.target.value)} placeholder="e.g., What color was the car at 0:45?" style={{ width: '100%', padding: '14px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.input, color: C.textMain, outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Exact Answer (1-2 words)</label>
                <input required type="text" value={quizA} onChange={(e) => setQuizA(e.target.value)} placeholder="e.g., Blue" style={{ width: '100%', padding: '14px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.input, color: C.textMain, outline: 'none' }} />
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right', marginTop: 8 }}>
            <button type="submit" disabled={submitting} style={{ background: C.lime, color: '#000', border: 'none', borderRadius: 8, padding: '16px 40px', fontSize: 15, fontWeight: 800, cursor: submitting ? 'not-allowed' : 'pointer' }}>
              {submitting ? 'Deploying...' : 'Deploy Campaign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
