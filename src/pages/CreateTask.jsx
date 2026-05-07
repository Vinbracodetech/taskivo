import { useState } from 'react';
import { supabase } from '../lib/supabase';
import useToast from '../components/useToast';

const C = {
  surface: 'var(--surface)',
  card: 'var(--surface-card)',
  input: 'var(--surface-card)',
  textMain: 'var(--ink)',
  textMuted: 'var(--slate)',
  textInvert: 'var(--surface)',
  line: 'var(--line)',
  lime: '#A8FF3E',
  limeText: 'var(--lime)',
  limeDim: 'var(--lime-dim)',
  shadow: 'var(--shadow)',
  red: '#ef4444',
};

export default function CreateTask({ session, navigate }) {
  const { showToast, ToastComponent } = useToast();
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('youtube');
  const [url, setUrl] = useState('');
  const [duration, setDuration] = useState('60');
  const [reward, setReward] = useState('10');
  const [slots, setSlots] = useState('100');
  const [quizQ, setQuizQ] = useState('');
  const [quizA, setQuizA] = useState('');

  // Dynamic Calculation
  const totalCost = (parseInt(reward) || 0) * (parseInt(slots) || 0);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 1. Clean the YouTube URL to get just the Video ID
      let finalVideoId = url;
      if (platform === 'youtube') {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
        if (match) finalVideoId = match[1];
      }

      // 2. Push to Database
      const { error } = await supabase.from('tasks').insert([{
        user_id: session.user.id,
        title: title,
        platform: platform,
        video_id: finalVideoId,
        watch_duration: parseInt(duration),
        reward_points: parseInt(reward),
        slots: parseInt(slots),
        slots_remaining: parseInt(slots),
        completed_slots: 0,
        quiz_question: quizQ,
        quiz_answer: quizA,
        status: 'pending_payment' // Requires Admin Approval
      }]);

      if (error) throw error;

      showToast('Campaign successfully drafted!', 'success');
      
      // 🔥 THE FIX: Route the user away from this page instantly 🔥
      navigate('creator-tasks');

    } catch (err) {
      showToast(err.message || 'Failed to create campaign.', 'error');
      setSubmitting(false); // Only stop loading if it fails, allowing them to try again
    }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.surface, color: C.textMain, minHeight: '100vh', padding: '40px 5% 120px' }}>
      {ToastComponent}
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 28, color: C.textMain, marginBottom: 8, fontWeight: 800 }}>Launch Campaign</h1>
          <p style={{ color: C.textMuted, fontSize: 15 }}>Configure your engagement parameters and verification quiz.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* Block 1: Core Details */}
          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 32, boxShadow: C.shadow }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, color: C.textMain, marginBottom: 24, fontWeight: 700 }}>1. Campaign Details</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Campaign Title</label>
                <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Tech Review Video 2026" style={{ width: '100%', padding: '14px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.input, color: C.textMain, fontSize: 15, outline: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Platform</label>
                  <select value={platform} onChange={(e) => setPlatform(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.input, color: C.textMain, fontSize: 15, outline: 'none', cursor: 'pointer' }}>
                    <option value="youtube">YouTube Video</option>
                    <option value="blog">SEO Blog Article</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Content Link</label>
                  <input required type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={platform === 'youtube' ? "Paste YouTube URL" : "Paste Article URL"} style={{ width: '100%', padding: '14px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.input, color: C.textMain, fontSize: 15, outline: 'none' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Block 2: Economics */}
          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 32, boxShadow: C.shadow }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, color: C.textMain, marginBottom: 24, fontWeight: 700 }}>2. Engagement Metrics</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Watch/Read Time (Secs)</label>
                <input required type="number" min="30" value={duration} onChange={(e) => setDuration(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.input, color: C.textMain, fontSize: 15, outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Points per Earner</label>
                <input required type="number" min="5" value={reward} onChange={(e) => setReward(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.input, color: C.textMain, fontSize: 15, outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Total Slots Needed</label>
                <input required type="number" min="10" value={slots} onChange={(e) => setSlots(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.input, color: C.textMain, fontSize: 15, outline: 'none' }} />
              </div>
            </div>
          </div>

          {/* Block 3: Verification */}
          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 32, boxShadow: C.shadow }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <span style={{ fontSize: 20 }}>🧠</span>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, color: C.textMain, margin: 0, fontWeight: 700 }}>3. Anti-Cheat Verification</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Question (Based on content)</label>
                <input required type="text" value={quizQ} onChange={(e) => setQuizQ(e.target.value)} placeholder="e.g., What color was the car at 0:45?" style={{ width: '100%', padding: '14px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.input, color: C.textMain, fontSize: 15, outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Exact Answer</label>
                <input required type="text" value={quizA} onChange={(e) => setQuizA(e.target.value)} placeholder="e.g., Blue" style={{ width: '100%', padding: '14px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.input, color: C.textMain, fontSize: 15, outline: 'none' }} />
                <p style={{ fontSize: 12, color: C.textMuted, marginTop: 8 }}>Keep answers strictly to 1 or 2 words to prevent typos from failing earners.</p>
              </div>
            </div>
          </div>

          {/* Checkout Footer */}
          <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 16, padding: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 13, color: C.textMuted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Total Campaign Cost</div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 32, fontWeight: 800, color: C.textMain }}>
                {totalCost.toLocaleString()} <span style={{ fontSize: 16, color: C.limeText }}>PTS</span>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={submitting}
              style={{ background: C.lime, color: '#000000', border: 'none', borderRadius: 8, padding: '16px 32px', fontSize: 15, fontWeight: 800, cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif" }}
            >
              {submitting ? 'Processing...' : 'Submit to Network'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
