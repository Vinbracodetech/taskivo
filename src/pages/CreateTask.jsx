import { useState } from 'react';
import { supabase } from '../lib/supabase';
import PaystackPop from '@paystack/inline-js';

export default function CreateTask({ session, navigate, showToast }) {
  const user = session?.user;
  const [loading, setLoading] = useState(false);
  
  const [form, setForm] = useState({
    title: '',
    platform: 'youtube',
    url: '',
    watch_duration: 30,
    package: 'traction',
    paymentGateway: 'paystack' // Defaulting to Paystack since it is fully wired
  });

  const packages = {
    social: {
      starter: { label: 'Starter Tier', views: 50, price: '$5', numericPrice: 5, desc: 'Baseline test for algorithmic response.' },
      traction: { label: 'Traction Tier', views: 200, price: '$15', numericPrice: 15, desc: 'Ideal volume for initial momentum.' },
      scale: { label: 'Scale Tier', views: 500, price: '$35', numericPrice: 35, desc: 'High volume for sustained engagement.' },
      enterprise: { label: 'Enterprise Tier', views: 1000, price: '$68', numericPrice: 68, desc: 'Maximum velocity for major campaigns.' }
    },
    seo: {
      starter: { label: 'Starter SEO', views: 100, price: '$8', numericPrice: 8, desc: 'Guaranteed 2+ minutes on page.' },
      traction: { label: 'Traction SEO', views: 300, price: '$24', numericPrice: 24, desc: 'Ideal for initial search ranking.' },
      scale: { label: 'Scale SEO', views: 800, price: '$55', numericPrice: 55, desc: 'High volume traffic for domain authority.' },
      enterprise: { label: 'Enterprise SEO', views: 2000, price: '$120', numericPrice: 120, desc: 'Maximum sustained web presence.' }
    }
  };

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
      
      const selectedPackage = activePackages[form.package];
      const earnerPayout = form.platform === 'blog' ? 50 : 30;
      
      // 1. Check for Free Early Adopter Credit
      const { data: profile } = await supabase
        .from('profiles')
        .select('free_credits')
        .eq('id', user?.id)
        .single();

      const hasFreeCredit = profile?.free_credits > 0;
      
      // 2. Insert the task securely into Taskivo database
      const initialStatus = hasFreeCredit ? 'active' : 'pending_payment';

      const { data: newTask, error } = await supabase.from('tasks').insert({
        creator_id: user.id, 
        title: form.title, 
        platform: form.platform, 
        url: form.url,
        watch_duration: parseInt(form.watch_duration, 10), 
        target_views: selectedPackage.views, 
        current_views: 0, 
        status: initialStatus, 
        reward_points: earnerPayout
      }).select().single();

      if (error) throw error;

      // 3. Routing Logic: Free vs Paid
      if (hasFreeCredit) {
        if (showToast) showToast('Free Pilot Grant Applied! Campaign is LIVE.', 'success');
        navigate('/creator-dashboard');
      } else {
        if (showToast) showToast(`Initiating secure connection to ${form.paymentGateway.toUpperCase()}...`, 'success');
        
        if (form.paymentGateway === 'paystack') {
           // Initialize Paystack Popup
           const paystack = new PaystackPop();
           paystack.newTransaction({
             key: 'pk_test_dbc405eee8b6b7e9c572', // Your exact test key
             email: user.email,
             // Convert USD to NGN (roughly x1500 for demo) and multiply by 100 for kobo
             amount: selectedPackage.numericPrice * 1500 * 100, 
             metadata: {
               // The critical link for the webhook to activate the right task
               task_id: newTask.id 
             },
             onSuccess: (transaction) => {
               if (showToast) showToast('Payment successful! Campaign is going live.', 'success');
               navigate('/creator-dashboard'); 
             },
             onCancel: () => {
               if (showToast) showToast('Payment was cancelled.', 'error');
               setLoading(false);
             }
           });
        } else if (form.paymentGateway === 'stripe') {
           console.log(`Stripe integration coming soon for Task ID: ${newTask.id}`);
           navigate('/creator-dashboard'); 
        }
      }
      
    } catch (err) {
      // 🚨 THE NEW DEBUG BLOCK 🚨
      const errorMessage = err.message || err.toString();
      if (showToast) showToast(`Checkout Failed: ${errorMessage}`, 'error');
      console.error(err);
      setLoading(false);
    }
  }

  // ── THEME-AWARE STYLES ──
  const S = {
    page: { padding: '40px 5%', maxWidth: 900, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", position: 'relative' },
    glassCard: { background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 20, padding: 40, boxShadow: 'var(--shadow)' },
    label: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--slate)', marginBottom: 12, display: 'block', fontFamily: "'Inter', sans-serif" },
    input: { width: '100%', padding: '16px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, color: 'var(--ink)', fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s', marginBottom: 24 },
    select: { width: '100%', padding: '16px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, color: 'var(--ink)', fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', appearance: 'none', marginBottom: 24 },
    btnPrimary: { width: '100%', background: 'var(--lime)', border: 'none', color: '#000', borderRadius: 12, padding: '18px', fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '1px', marginTop: 16, boxShadow: '0 8px 16px rgba(168,255,62,0.2)' },
    packageCard: (isActive) => ({
      padding: 20, borderRadius: 16, cursor: 'pointer', transition: 'all 0.2s',
      background: isActive ? 'var(--ink)' : 'var(--surface)',
      border: `1px solid ${isActive ? 'var(--ink)' : 'var(--line)'}`,
      color: isActive ? 'var(--surface)' : 'var(--ink)',
      boxShadow: isActive ? '0 8px 24px rgba(0,0,0,0.1)' : 'none'
    }),
    gatewayCard: (isActive) => ({
      padding: '16px', borderRadius: '12px', cursor: 'pointer', border: `1px solid ${isActive ? 'var(--lime)' : 'var(--line)'}`, background: isActive ? 'var(--lime-dim)' : 'var(--surface)', flex: 1, display: 'flex', alignItems: 'center', gap: '12px', transition: 'all 0.2s'
    })
  };

  return (
    <div style={S.page}>
      <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
        <div>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 32, color: 'var(--ink)', marginBottom: 8, fontWeight: 800, letterSpacing: '-0.5px' }}>Campaign Deployment</h1>
          <p style={{ color: 'var(--slate)', fontSize: 15, fontWeight: 400, margin: 0 }}>Configure and launch your engagement architecture.</p>
        </div>
        <button onClick={() => navigate('/creator-dashboard')} style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>← Dashboard</button>
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

          <div style={{ marginBottom: 32, padding: '24px', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--line)' }}>
            <span style={{ ...S.label, marginBottom: 16 }}>Payment Processor</span>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              
              <div onClick={() => setForm(prev => ({ ...prev, paymentGateway: 'stripe' }))} style={S.gatewayCard(form.paymentGateway === 'stripe')}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `5px solid ${form.paymentGateway === 'stripe' ? 'var(--lime)' : 'var(--slate)'}` }}></div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--ink)' }}>Stripe (Global)</div>
                  <div style={{ fontSize: '12px', color: 'var(--slate)' }}>USD, EUR, GBP</div>
                </div>
              </div>

              <div onClick={() => setForm(prev => ({ ...prev, paymentGateway: 'paystack' }))} style={S.gatewayCard(form.paymentGateway === 'paystack')}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `5px solid ${form.paymentGateway === 'paystack' ? 'var(--lime)' : 'var(--slate)'}` }}></div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--ink)' }}>Paystack (Africa)</div>
                  <div style={{ fontSize: '12px', color: 'var(--slate)' }}>NGN, ZAR, GHS, USD</div>
                </div>
              </div>

            </div>
          </div>

          <button type="submit" disabled={loading} style={{ ...S.btnPrimary, opacity: loading ? 0.5 : 1 }}>
            {loading ? 'Processing...' : `Pay ${activePackages[form.package].price} & Deploy`}
          </button>
        </form>
      </div>
    </div>
  );
}
