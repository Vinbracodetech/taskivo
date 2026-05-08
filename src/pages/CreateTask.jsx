import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import useToast from '../components/useToast';

const C = {
  surface: 'var(--surface)', card: 'var(--surface-card)', input: 'var(--surface-card)',
  textMain: 'var(--ink)', textMuted: 'var(--slate)', line: 'var(--line)',
  lime: '#A8FF3E', limeText: 'var(--lime)', limeDim: 'var(--lime-dim)',
  shadow: 'var(--shadow)', red: '#ef4444',
};

export default function CreateTask({ session, navigate }) {
  const { showToast, ToastComponent } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  // Form State
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState('youtube');
  const [url, setUrl] = useState('');
  const [quizQ, setQuizQ] = useState('');
  const [quizA, setQuizA] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      setUserProfile(data);
    }
    fetchProfile();
  }, [session]);

  const packages = [
    { id: 'starter', name: 'Starter', price: 8, slots: 50 },
    { id: 'growth', name: 'Growth', price: 24, slots: 200, isPopular: true },
    { id: 'scale', name: 'Scale', price: 48, slots: 500 }
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedPlan) {
      showToast('Please select a pricing package first.', 'error');
      return;
    }
    setSubmitting(true);

    try {
      let finalVideoId = url;
      if (platform === 'youtube') {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
        if (match) finalVideoId = match[1];
      } else if (platform === 'tiktok') {
        const match = url.match(/\/video\/(\d+)/);
        if (match) finalVideoId = match[1];
      }

      const isFree = selectedPlan.price === 0;

      const { error } = await supabase.from('tasks').insert([{
        user_id: session.user.id,
        title: title,
        platform: platform,
        video_id: finalVideoId,
        watch_duration: 60, // Standardized for anti-cheat
        slots: selectedPlan.slots,
        slots_remaining: selectedPlan.slots,
        completed_slots: 0,
        reward_points: 50, // Standard payout for earners
        quiz_question: quizQ,
        quiz_answer: quizA,
        status: isFree ? 'pending_approval' : 'pending_payment' // Paid plans wait for payment, Free plans wait for Admin approval
      }]);

      if (error) throw error;
      
      // If they used the free grant, update their profile so they can't use it again
      if (isFree) {
        await supabase.from('profiles').update({ pilot_claimed: false }).eq('id', session.user.id);
      }

      showToast(isFree ? 'Trial Submitted for Approval!' : 'Campaign saved! Pending Payment.', 'success');
      navigate('creator-tasks');

    } catch (err) {
      console.error(err);
      alert(`Database Error: ${err.message || 'Check console for details.'}`);
      setSubmitting(false); // 🔥 Resets the button so it stops spinning!
    }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.surface, color: C.textMain, minHeight: '100vh', padding: '40px 5% 120px' }}>
      {ToastComponent}
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 28, color: C.textMain, marginBottom: 8, fontWeight: 800 }}>Launch Campaign</h1>
          <p style={{ color: C.textMuted, fontSize: 15 }}>Select a package and deploy your content to the network.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* STEP 1: PRICING PACKAGES */}
          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 32, boxShadow: C.shadow }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, color: C.textMain, marginBottom: 24, fontWeight: 700 }}>1. Select Package</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              
              {/* Conditional Free Trial Card */}
              {userProfile?.pilot_claimed && (
                <div 
                  onClick={() => setSelectedPlan({ id: 'grant', name: 'Beta Grant', price: 0, slots: 20 })}
                  style={{ background: selectedPlan?.id === 'grant' ? C.limeDim : C.input, border: `2px solid ${selectedPlan?.id === 'grant' ? C.limeText : C.line}`, borderRadius: 12, padding: 24, cursor: 'pointer', position: 'relative', transition: 'all 0.2s' }}
                >
                  <div style={{ position: 'absolute', top: -10, left: 16, background: C.lime, color: '#000', fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 4 }}>FREE TRIAL</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.textMain, marginBottom: 4 }}>Early Adopter</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 28, color: C.textMain, fontWeight: 800, marginBottom: 8 }}>$0</div>
                  <div style={{ fontSize: 13, color: C.textMuted }}>20 Verified Slots</div>
                </div>
              )}

              {/* Paid Packages */}
              {packages.map(pkg => (
                <div 
                  key={pkg.id} onClick={() => setSelectedPlan(pkg)}
                  style={{ background: selectedPlan?.id === pkg.id ? C.limeDim : C.input, border: `2px solid ${selectedPlan?.id === pkg.id ? C.limeText : C.line}`, borderRadius: 12, padding: 24, cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.textMain, marginBottom: 4 }}>{pkg.name}</div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 28, color: C.textMain, fontWeight: 800, marginBottom: 8 }}>${pkg.price}</div>
                  <div style={{ fontSize: 13, color: C.textMuted }}>{pkg.slots} Verified Slots</div>
                </div>
              ))}
            </div>
          </div>

          {/* STEP 2: CAMPAIGN DETAILS */}
          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 32, boxShadow: C.shadow, opacity: selectedPlan ? 1 : 0.5, pointerEvents: selectedPlan ? 'auto' : 'none' }}>
            <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, color: C.textMain, marginBottom: 24, fontWeight: 700 }}>2. Campaign Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Campaign Title</label>
                <input required type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Tech Review Video" style={{ width: '100%', padding: '14px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.input, color: C.textMain, outline: 'none' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Platform</label>
                  <select value={platform} onChange={(e) => setPlatform(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.input, color: C.textMain, outline: 'none' }}>
                    <option value="youtube">YouTube Video</option>
                    <option value="tiktok">TikTok Video</option>
                    <option value="facebook">Facebook Video</option>
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

          {/* STEP 3: VERIFICATION */}
          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 32, boxShadow: C.shadow, opacity: selectedPlan ? 1 : 0.5, pointerEvents: selectedPlan ? 'auto' : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <span style={{ fontSize: 20 }}>🧠</span>
              <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, color: C.textMain, margin: 0, fontWeight: 700 }}>3. Anti-Cheat Verification</h3>
            </div>
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
            <button type="submit" disabled={submitting || !selectedPlan} style={{ background: selectedPlan ? C.lime : C.input, color: selectedPlan ? '#000' : C.textMuted, border: 'none', borderRadius: 8, padding: '16px 40px', fontSize: 15, fontWeight: 800, cursor: (submitting || !selectedPlan) ? 'not-allowed' : 'pointer' }}>
              {!selectedPlan ? 'Select a Package' : submitting ? 'Processing...' : `Checkout: $${selectedPlan.price}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
