import { useState } from 'react';
import { supabase } from '../lib/supabase';
import useToast from '../components/useToast';

const C = {
  ink: '#0D0D14',
  lime: '#A8FF3E',
  limeDim: 'rgba(168,255,62,0.12)',
  white: '#ffffff',
  off: '#F7F8FA',
  slate: '#6B7280',
  line: '#EBEBEB',
  darkLine: 'rgba(255,255,255,0.08)',
};

export default function CreateTask({ session, navigate }) {
  const { showToast, ToastComponent } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [platform, setPlatform] = useState('youtube');
  const [packageTier, setPackageTier] = useState('starter');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '', // Maps to video_id in DB
    channel_name: '',
    watch_duration: 120, // Default 120s
    quiz_question: '',
    quiz_answer: ''
  });

  const packages = {
    starter: { slots: 50, price: 8 },
    growth: { slots: 200, price: 24 },
    scale: { slots: 500, price: 48 }
  };

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData(function(prev) {
      return { ...prev, [name]: value };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!session || !session.user) {
      showToast('You must be logged in to create a campaign', 'error');
      return;
    }

    if (!formData.title || !formData.link || !formData.quiz_question || !formData.quiz_answer) {
      showToast('Please fill out all verification fields', 'error');
      return;
    }

    setLoading(true);

    try {
      const selectedPackage = packages[packageTier];
      
      const { error } = await supabase.from('tasks').insert([{
        creator_id: session.user.id,
        platform: platform,
        category: platform === 'blog' ? 'seo_traffic' : 'video_engagement',
        title: formData.title,
        description: formData.description,
        video_id: formData.link, // Storing URLs or IDs here
        channel_name: formData.channel_name,
        watch_duration: parseInt(formData.watch_duration),
        quiz_question: formData.quiz_question,
        quiz_answer: formData.quiz_answer,
        slots: selectedPackage.slots,
        slots_remaining: selectedPackage.slots,
        completed_slots: 0,
        reward_points: 10, // Base points allocated internally
        status: 'pending_payment' // Admin approves after payment
      }]);

      if (error) throw error;

      showToast('Campaign draft created securely', 'success');
      setTimeout(function() {
        navigate('dashboard');
      }, 2000);

    } catch (err) {
      console.error(err);
      showToast('Failed to create campaign', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.off, color: C.ink, minHeight: '100vh', padding: '40px 5%' }}>
      {ToastComponent}
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, color: C.ink, marginBottom: 8 }}>Launch Campaign</h1>
          <p style={{ color: C.slate, fontSize: 14 }}>Deploy a verified engagement layer to our global contributor network.</p>
        </div>

        <form onSubmit={handleSubmit} style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 16, padding: 32, display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* STEP 1: PLATFORM */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>1. Select Platform</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12 }}>
              {['youtube', 'blog', 'tiktok', 'facebook'].map(function(plat) {
                const isSelected = platform === plat;
                return (
                  <div 
                    key={plat}
                    onClick={function() { setPlatform(plat); }}
                    style={{ 
                      padding: '12px', textAlign: 'center', border: `1px solid ${isSelected ? C.ink : C.line}`, 
                      borderRadius: 8, background: isSelected ? C.ink : C.white, color: isSelected ? C.white : C.slate,
                      fontSize: 14, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize'
                    }}
                  >
                    {plat === 'blog' ? 'SEO Blog' : plat}
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: PACKAGE */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>2. Engagement Package</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
              {Object.keys(packages).map(function(tier) {
                const isSelected = packageTier === tier;
                const details = packages[tier];
                return (
                  <div 
                    key={tier}
                    onClick={function() { setPackageTier(tier); }}
                    style={{ 
                      padding: '16px', border: `1px solid ${isSelected ? C.lime : C.line}`, 
                      borderRadius: 8, background: isSelected ? C.limeDim : C.white, cursor: 'pointer',
                      position: 'relative', overflow: 'hidden'
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.ink, textTransform: 'capitalize', marginBottom: 4 }}>{tier}</div>
                    <div style={{ fontSize: 13, color: C.slate }}>{details.slots.toLocaleString()} Units • ${details.price.toLocaleString()}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: CAMPAIGN DETAILS */}
          <div>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>3. Campaign Details</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input 
                type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="Campaign Title (e.g. 'Read: Top 10 Tech Trends')"
                style={{ width: '100%', padding: '14px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.off, fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}
              />
              <input 
                type="text" name="link" value={formData.link} onChange={handleInputChange} placeholder={platform === 'blog' ? 'Full Website URL (https://...)' : 'Video ID or URL'}
                style={{ width: '100%', padding: '14px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.off, fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}
              />
              <input 
                type="text" name="channel_name" value={formData.channel_name} onChange={handleInputChange} placeholder="Brand or Channel Name"
                style={{ width: '100%', padding: '14px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.off, fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}
              />
              <input 
                type="number" name="watch_duration" value={formData.watch_duration} onChange={handleInputChange} placeholder="Required Base Time (Seconds)"
                style={{ width: '100%', padding: '14px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.off, fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}
              />
            </div>
          </div>

          {/* STEP 4: STRICT VERIFICATION */}
          <div style={{ padding: 20, background: 'rgba(255,200,0,0.05)', border: '1px solid rgba(255,200,0,0.2)', borderRadius: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: '#b38600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
              <span>🛡️</span> Strict Anti-Cheat Verification
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <input 
                type="text" name="quiz_question" value={formData.quiz_question} onChange={handleInputChange} placeholder="Verification Question (e.g., 'What is the second heading?')"
                style={{ width: '100%', padding: '14px', borderRadius: 8, border: '1px solid rgba(255,200,0,0.2)', background: C.white, fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}
              />
              <input 
                type="text" name="quiz_answer" value={formData.quiz_answer} onChange={handleInputChange} placeholder="Exact Answer (One or two words recommended)"
                style={{ width: '100%', padding: '14px', borderRadius: 8, border: '1px solid rgba(255,200,0,0.2)', background: C.white, fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}
              />
              <p style={{ fontSize: 12, color: '#b38600', margin: 0, lineHeight: 1.5 }}>
                Contributors will only receive points if they provide the exact answer above. Capitalization is ignored, but spelling must match perfectly.
              </p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              background: C.ink, color: C.lime, border: 'none', borderRadius: 8, padding: '16px', 
              fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', 
              fontFamily: "'DM Sans', sans-serif", marginTop: 8 
            }}
          >
            {loading ? 'Securing Campaign...' : 'Draft Campaign ($0.00 Beta)'}
          </button>
        </form>

      </div>
    </div>
  );
}
