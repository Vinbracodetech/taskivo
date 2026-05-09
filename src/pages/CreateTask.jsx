import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function CreateTask({ session, navigate, showToast }) {
  const user = session?.user;
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    title: '',
    platform: 'youtube',
    url: '',
    watch_duration: 30,
    package: 'starter'
  });

  const packages = {
    trial: { label: 'Pilot Protocol', views: 20, price: 'Free', desc: 'Test the network with 20 verified engagements.' },
    starter: { label: 'Starter Tier', views: 100, price: '$10', desc: 'Ideal for initial algorithmic traction.' },
    growth: { label: 'Growth Tier', views: 500, price: '$40', desc: 'Standard deployment for steady engagement.' },
    scale: { label: 'Scale Tier', views: 2000, price: '$140', desc: 'Maximum velocity for major campaigns.' }
  };

  function handleInput(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.url) {
      if (showToast) showToast('Please complete all required fields.', 'error');
      return;
    }

    try {
      setLoading(true);
      const selectedPackage = packages[form.package];
      
      const { error } = await supabase.from('tasks').insert({
        creator_id: user.id,
        title: form.title,
        platform: form.platform,
        url: form.url,
        watch_duration: parseInt(form.watch_duration, 10),
        target_views: selectedPackage.views,
        current_views: 0,
        status: 'active',
        reward_points: 50 // Standardized backend payout, hidden from Creator UI
      });

      if (error) throw error;

      if (showToast) showToast('Campaign successfully deployed.', 'success');
      navigate('creator-dashboard');
      
    } catch (err) {
      if (showToast) showToast('Deployment failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }

  // ── ENTERPRISE B2B STYLES ──
  const S = {
    page: { padding: '40px 5%', maxWidth: 900, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", position: 'relative' },
    glassCard: { background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, backdropFilter: 'blur(20px)', padding: 40 },
    label: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.4)', marginBottom: 12, display: 'block', fontFamily: "'Inter', sans-serif" },
    input: { width: '100%', padding: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', marginBottom: 24 },
    select: { width: '100%', padding: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff', fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', appearance: 'none', marginBottom: 24 },
    btnPrimary: { width: '100%', background: '#fff', border: 'none', color: '#000', borderRadius: 12, padding: '18px', fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '1px', marginTop: 16 },
    packageCard: (isActive) => ({
      padding: 20, borderRadius: 16, cursor: 'pointer', transition: 'all 0.2s',
      background: isActive ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.2)',
      border: `1px solid ${isActive ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.05)'}`,
      boxShadow: isActive ? '0 8px 24px rgba(0,0,0,0.2)' : 'none'
    })
  };

  return (
    <div style={S.page}>
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(255,255,255,0.02) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
        <div>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 32, color: '#fff', marginBottom: 8, fontWeight: 800, letterSpacing: '-0.5px' }}>Campaign Deployment</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, fontWeight: 400, margin: 0 }}>Configure and launch your engagement architecture.</p>
        </div>
        <button onClick={() => navigate('creator-dashboard')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>← Dashboard</button>
      </div>

      <div style={{ ...S.glassCard, position: 'relative', zIndex: 1 }}>
        <form onSubmit={handleSubmit}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            <div>
              <span style={S.label}>Internal Campaign Designation</span>
              <input style={S.input} type="text" name="title" placeholder="e.g., Q3 Product Launch Video" value={form.title} onChange={handleInput} required />
            </div>
            
            <div>
              <span style={S.label}>Target Platform</span>
              <select style={S.select} name="platform" value={form.platform} onChange={handleInput}>
                <option value="youtube">YouTube (Video Engagement)</option>
                <option value="tiktok">TikTok (Short-Form Attention)</option>
                <option value="blog">SEO Blog (Read Time Verification)</option>
              </select>
            </div>
          </div>

          <div>
            <span style={S.label}>Asset URL</span>
            <input style={S.input} type="url" name="url" placeholder="https://..." value={form.url} onChange={handleInput} required />
          </div>

          <div>
            <span style={S.label}>Verification Duration (Seconds)</span>
            <select style={S.select} name="watch_duration" value={form.watch_duration} onChange={handleInput}>
              <option value="30">30 Seconds (Standard Check)</option>
              <option value="60">60 Seconds (Deep Engagement)</option>
              <option value="120">120 Seconds (High Retention)</option>
            </select>
          </div>

          <div style={{ marginTop: 16, marginBottom: 32 }}>
            <span style={{ ...S.label, marginBottom: 16 }}>Select Engagement Allocation</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {Object.entries(packages).map(([key, pkg]) => (
                <div key={key} onClick={() => setForm(prev => ({ ...prev, package: key }))} style={S.packageCard(form.package === key)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{pkg.label}</div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 100 }}>{pkg.price}</div>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 8, fontFamily: "'Inter', sans-serif", letterSpacing: '-0.5px' }}>{pkg.views} <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>VERIFICATIONS</span></div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>{pkg.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ ...S.btnPrimary, opacity: loading ? 0.5 : 1 }}>
            {loading ? 'Processing Deployment...' : 'Authorize & Deploy Campaign'}
          </button>
        </form>
      </div>
    </div>
  );
}
