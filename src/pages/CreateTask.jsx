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
    package: 'traction' // Default to the most popular package
  });

  // 🔥 DYNAMIC B2B PRICING TIERS 🔥
  const packages = {
    social: {
      starter: { label: 'Starter Tier', views: 50, price: '$5', desc: 'Baseline test for algorithmic response.' },
      traction: { label: 'Traction Tier', views: 200, price: '$15', desc: 'Ideal volume for initial momentum.' },
      scale: { label: 'Scale Tier', views: 500, price: '$35', desc: 'High volume for sustained engagement.' },
      enterprise: { label: 'Enterprise Tier', views: 1000, price: '$68', desc: 'Maximum velocity for major campaigns.' }
    },
    seo: {
      starter: { label: 'Starter SEO', views: 100, price: '$8', desc: 'Guaranteed 2+ minutes on page.' },
      traction: { label: 'Traction SEO', views: 300, price: '$24', desc: 'Ideal for initial search ranking.' },
      scale: { label: 'Scale SEO', views: 800, price: '$55', desc: 'High volume traffic for domain authority.' },
      enterprise: { label: 'Enterprise SEO', views: 2000, price: '$120', desc: 'Maximum sustained web presence.' }
    }
  };

  // Determine which list to show based on the dropdown selection
  const currentPlatformType = form.platform === 'blog' ? 'seo' : 'social';
  const activePackages = packages[currentPlatformType];

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
      
      // Grab the correct package from the active array (Social vs SEO)
      const selectedPackage = activePackages[form.package];
      
      // 🔥 SECURE DYNAMIC PAYOUT: 50 pts ($0.05) for Blog, 30 pts ($0.03) for Social
      const earnerPayout = form.platform === 'blog' ? 50 : 30;
      
      const { error } = await supabase.from('tasks').insert({
        creator_id: user.id, 
        title: form.title, 
        platform: form.platform, 
        url: form.url,
        watch_duration: parseInt(form.watch_duration, 10), 
        target_views: selectedPackage.views, 
        current_views: 0, 
        status: 'active', 
        reward_points: earnerPayout
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

  // ── THEME-AWARE STYLES ──
  const S = {
    page: { padding: '40px 5%', maxWidth: 900, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", position: 'relative' },
    glassCard: { background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 20, padding: 40, boxShadow: '0 8px 32px rgba(0,0,0,0.04)' },
    label: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--slate)', marginBottom: 12, display: 'block', fontFamily: "'Inter', sans-serif" },
    input: { width: '100%', padding: '16px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, color: 'var(--ink)', fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', marginBottom: 24 },
    select: { width: '100%', padding: '16px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, color: 'var(--ink)', fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', appearance: 'none', marginBottom: 24 },
    btnPrimary: { width: '100%', background: 'var(--ink)', border: 'none', color: 'var(--surface)', borderRadius: 12, padding: '18px', fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '1px', marginTop: 16 },
    packageCard: (isActive) => ({
      padding: 20, borderRadius: 16, cursor: 'pointer', transition: 'all 0.2s',
      background: isActive ? 'var(--ink)' : 'var(--surface)',
      border: `1px solid ${isActive ? 'var(--ink)' : 'var(--line)'}`,
      color: isActive ? 'var(--surface)' : 'var(--ink)',
      boxShadow: isActive ? '0 8px 24px rgba(0,0,0,0.1)' : 'none'
    })
  };

  return (
    <div style={S.page}>
      <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
        <div>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 32, color: 'var(--ink)', marginBottom: 8, fontWeight: 800, letterSpacing: '-0.5px' }}>Campaign Deployment</h1>
          <p style={{ color: 'var(--slate)', fontSize: 15, fontWeight: 400, margin: 0 }}>Configure and launch your engagement architecture.</p>
        </div>
        <button onClick={() => navigate('creator-dashboard')} style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>← Dashboard</button>
      </div>

      <div style={S.glassCard}>
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
            
            {/* 🔥 DYNAMIC PACKAGES RENDERED HERE 🔥 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {Object.entries(activePackages).map(([key, pkg]) => (
                <div key={key} onClick={() => setForm(prev => ({ ...prev, package: key }))} style={S.packageCard(form.package === key)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{pkg.label}</div>
                    <div style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 100, border: `1px solid ${form.package === key ? 'var(--surface)' : 'var(--line)'}` }}>
                      {pkg.price}
                    </div>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, fontFamily: "'Inter', sans-serif", letterSpacing: '-0.5px' }}>
                    {pkg.views} <span style={{ fontSize: 12, fontWeight: 600 }}>VERIFICATIONS</span>
                  </div>
                  <div style={{ fontSize: 12, lineHeight: 1.4, opacity: 0.8 }}>{pkg.desc}</div>
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
