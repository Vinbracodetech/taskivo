import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import PaystackPop from '@paystack/inline-js';

export default function CreateTask({ session, navigate, showToast }) {
  const user = session?.user;
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null); 
  const [freeCredits, setFreeCredits] = useState(0); 
  
  const [form, setForm] = useState({
    title: '',
    platform: 'youtube',
    url: '',
    search_keyword: '', // 🔥 Added for SEO Search
    secret_code: '',    // 🔥 Added for SEO Verification
    watch_duration: 30,
    package: 'traction',
    paymentGateway: 'paystack'
  });

  useEffect(() => {
    async function checkGrants() {
      const { data } = await supabase
        .from('profiles')
        .select('free_credits')
        .eq('id', user?.id)
        .single();
        
      if (data && data.free_credits > 0) {
        setFreeCredits(data.free_credits);
        setForm(prev => ({ ...prev, package: 'pilot' }));
      }
    }
    if (user?.id) checkGrants();
  }, [user]);

  const EXCHANGE_RATE = 1500;

  const packages = {
    social: {
      starter: { label: 'Starter Tier', views: 50, priceUSD: 5 },
      traction: { label: 'Traction Tier', views: 200, priceUSD: 15 },
      scale: { label: 'Scale Tier', views: 500, priceUSD: 35 },
      enterprise: { label: 'Enterprise Tier', views: 1000, priceUSD: 68 }
    },
    seo: {
      starter: { label: 'Starter SEO', views: 100, priceUSD: 8 },
      traction: { label: 'Traction SEO', views: 300, priceUSD: 24 },
      scale: { label: 'Scale SEO', views: 800, priceUSD: 55 },
      enterprise: { label: 'Enterprise SEO', views: 2000, priceUSD: 120 }
    },
    qa_testing: {
      starter: { label: 'Beta QA', views: 10, priceUSD: 25 },
      traction: { label: 'Scale QA', views: 50, priceUSD: 100 }
    },
    ugc: {
      starter: { label: 'Starter UGC', views: 5, priceUSD: 45 },
      traction: { label: 'Scale UGC', views: 20, priceUSD: 160 }
    }
  };

  let currentPlatformType = 'social';
  if (form.platform === 'blog') currentPlatformType = 'seo';
  if (form.platform === 'qa_testing') currentPlatformType = 'qa_testing';
  if (form.platform === 'ugc') currentPlatformType = 'ugc';

  const activePackages = packages[currentPlatformType];
  const hasFreeCredit = freeCredits > 0;
  
  const selectedPackageData = form.package === 'pilot' 
    ? { label: 'Pilot Grant', views: 20, priceUSD: 0 } 
    : activePackages[form.package] || activePackages['starter'];

  useEffect(() => {
    if (form.package !== 'pilot' && !activePackages[form.package]) {
        setForm(prev => ({ ...prev, package: 'starter' }));
    }
  }, [form.platform, activePackages, form.package]);

  function handleInput(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function deployTaskToNetwork(isUsingPilot, amountPaid = 0) {
    let earnerPayout = 30;
    if (form.platform === 'blog') earnerPayout = 50;
    if (form.platform === 'qa_testing') earnerPayout = 800;
    if (form.platform === 'ugc') earnerPayout = 2000;

    const { data: newTask, error: insertErr } = await supabase.from('tasks').insert({
      creator_id: user.id, 
      title: form.title, 
      platform: form.platform, 
      url: form.url,
      search_keyword: form.platform === 'blog' ? form.search_keyword : null,
      secret_code: form.platform === 'blog' ? form.secret_code : null,
      watch_duration: parseInt(form.watch_duration, 10), 
      target_views: selectedPackageData.views, 
      current_views: 0, 
      status: 'active', 
      reward_points: earnerPayout
    }).select().single();

    if (insertErr) throw new Error(`Database Insert Error: ${insertErr.message}`);

    if (!isUsingPilot) {
        await supabase.from('transactions').insert({
            user_id: user.id,
            type: 'campaign_purchase',
            amount: amountPaid,
            currency: 'NGN',
            status: 'completed',
            reference_id: newTask.id
        });
    }

    if (isUsingPilot) {
      const { error: deductErr } = await supabase.from('profiles').update({ free_credits: 0 }).eq('id', user.id);
      if (deductErr) throw new Error(`Failed to deduct grant: ${deductErr.message}`);
    }

    if (showToast) showToast('Campaign is LIVE on the network!', 'success');
    navigate('creator-dashboard');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError(null); 

    if (!form.title || !form.url) {
      setLocalError('Please complete all required fields.');
      return;
    }
    
    // Extra validation for SEO tasks
    if (form.platform === 'blog' && (!form.search_keyword || !form.secret_code)) {
      setLocalError('SEO Campaigns require a Search Keyword and a Secret Code.');
      return;
    }

    try {
      setLoading(true);
      const isUsingPilot = form.package === 'pilot';

      if (isUsingPilot) {
        await deployTaskToNetwork(true);
      } else {
        const amountInNGN = selectedPackageData.priceUSD * EXCHANGE_RATE;
        const amountInKobo = amountInNGN * 100; 

        const paystack = new PaystackPop();
paystack.newTransaction({
  key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
  email: user.email,
          amount: amountInKobo, 
          currency: 'NGN',
          metadata: { 
            custom_fields: [
                { display_name: "Campaign Title", variable_name: "campaign_title", value: form.title },
                { display_name: "Target Views", variable_name: "target_views", value: selectedPackageData.views }
            ]
          },
          onSuccess: () => deployTaskToNetwork(false, amountInNGN),
          onCancel: () => {
            setLocalError('Payment was cancelled.');
            setLoading(false);
          }
        });
      }
    } catch (err) {
      setLocalError(err.message || err.toString());
      setLoading(false);
    }
  }

  const S = {
    page: { padding: '40px 5%', maxWidth: 900, margin: '0 auto', fontFamily: "var(--font-body)", position: 'relative' },
    glassCard: { background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 20, padding: 40, boxShadow: 'var(--shadow)' },
    label: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--slate)', marginBottom: 12, display: 'block', fontFamily: "var(--font-display)" },
    input: { width: '100%', padding: '16px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, color: 'var(--ink)', fontSize: 14, fontFamily: "var(--font-body)", outline: 'none', boxSizing: 'border-box', marginBottom: 24 },
    select: { width: '100%', padding: '16px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, color: 'var(--ink)', fontSize: 14, fontFamily: "var(--font-body)", outline: 'none', boxSizing: 'border-box', appearance: 'none', marginBottom: 24 },
    btnPrimary: { width: '100%', background: 'var(--lime)', border: 'none', color: '#000', borderRadius: 12, padding: '18px', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: "var(--font-display)", textTransform: 'uppercase', letterSpacing: '1px', marginTop: 16 },
    packageCard: (isActive) => ({ padding: 20, borderRadius: 16, cursor: 'pointer', transition: 'all 0.2s', background: isActive ? 'var(--ink)' : 'var(--surface)', border: `1px solid ${isActive ? 'var(--ink)' : 'var(--line)'}`, color: isActive ? 'var(--surface)' : 'var(--ink)', boxShadow: isActive ? 'var(--shadow)' : 'none' }),
    gatewayCard: (isActive) => ({ padding: '16px', borderRadius: '12px', cursor: 'pointer', border: `1px solid ${isActive ? 'var(--lime)' : 'var(--line)'}`, background: isActive ? 'var(--lime-dim)' : 'var(--surface)', flex: 1, display: 'flex', alignItems: 'center', gap: '12px' })
  };

  const isManual = form.platform === 'ugc' || form.platform === 'qa_testing';
  const unitLabel = isManual ? 'SUBMISSIONS' : 'VERIFICATIONS';

  return (
    <div style={S.page}>
      <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, color: 'var(--ink)', margin: 0, fontWeight: 800, letterSpacing: '-0.5px' }}>Campaign Deployment</h1>
        <button onClick={() => navigate('creator-dashboard')} style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>← Dashboard</button>
      </div>

      <div style={S.glassCard}>
        {localError && (
          <div style={{ padding: '16px', background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', fontWeight: '600' }}>
            🚨 {localError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            <div>
              <span style={S.label}>Internal Campaign Designation</span>
              <input style={S.input} type="text" name="title" placeholder="e.g., Q3 Product Launch" value={form.title} onChange={handleInput} required />
            </div>
            <div>
              <span style={S.label}>Target Platform</span>
              <select style={S.select} name="platform" value={form.platform} onChange={handleInput}>
                <optgroup label="Automated Engagement">
                  <option value="youtube">YouTube (Video Engagement)</option>
                  <option value="blog">SEO Blog (Read Time Verification)</option>
                </optgroup>
                <optgroup label="Premium Manual Verification">
                  <option value="ugc">Authentic UGC (Video Testimonials)</option>
                  <option value="qa_testing">App QA Testing (Bug Reports)</option>
                </optgroup>
              </select>
            </div>
          </div>

          <div>
            <span style={S.label}>{isManual ? "Campaign Brief / Instructions URL" : "Asset URL (Where should users go?)"}</span>
            <input style={S.input} type="url" name="url" placeholder="https://..." value={form.url} onChange={handleInput} required />
          </div>

          {/* 🔥 DYNAMIC SEO FIELDS 🔥 */}
          {form.platform === 'blog' && (
            <div style={{ background: 'var(--surface)', padding: 24, borderRadius: 12, border: '1px solid var(--lime)', marginBottom: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
                <div>
                  <span style={S.label}>Google Search Keyword</span>
                  <input style={{...S.input, marginBottom: 0}} type="text" name="search_keyword" placeholder="e.g. Best Earner Sites 2026" value={form.search_keyword} onChange={handleInput} required />
                </div>
                <div>
                  <span style={S.label}>Verification Secret Code</span>
                  <input style={{...S.input, marginBottom: 0}} type="text" name="secret_code" placeholder="e.g. 9X2P1" value={form.secret_code} onChange={handleInput} required />
                </div>
              </div>
              <p style={{ fontSize: 12, color: 'var(--slate)', margin: '12px 0 0 0' }}>Earners will search for the keyword, find your URL, wait for the timer, and must input this exact code to get paid.</p>
            </div>
          )}

          {!isManual && (
            <div>
              <span style={S.label}>Verification Duration (Seconds)</span>
              <select style={S.select} name="watch_duration" value={form.watch_duration} onChange={handleInput}>
                <option value="30">30 Seconds (Standard Check)</option>
                <option value="60">60 Seconds (Deep Engagement)</option>
                <option value="120">120 Seconds (SEO Dominance)</option>
              </select>
            </div>
          )}

          <div style={{ marginTop: 16, marginBottom: 32 }}>
            <span style={{ ...S.label, marginBottom: 16 }}>Select Engagement Allocation</span>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {hasFreeCredit && (
                <div onClick={() => setForm(prev => ({ ...prev, package: 'pilot' }))} style={{ ...S.packageCard(form.package === 'pilot'), border: `2px solid ${form.package === 'pilot' ? 'var(--lime)' : 'var(--line)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: form.package === 'pilot' ? 'var(--lime)' : 'var(--ink)' }}>🎁 Pilot Grant</div>
                    <div style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 100, border: `1px solid ${form.package === 'pilot' ? 'var(--surface)' : 'var(--line)'}` }}>FREE</div>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>20 <span style={{ fontSize: 12, fontWeight: 600 }}>{unitLabel}</span></div>
                  <div style={{ fontSize: 11, opacity: 0.8 }}>One-time network trial.</div>
                </div>
              )}

              {Object.entries(activePackages).map(([key, pkg]) => (
                <div key={key} onClick={() => setForm(prev => ({ ...prev, package: key }))} style={S.packageCard(form.package === key)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{pkg.label}</div>
                    <div style={{ fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 100, border: `1px solid ${form.package === key ? 'var(--surface)' : 'var(--line)'}` }}>${pkg.priceUSD}</div>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
                    {pkg.views} <span style={{ fontSize: 12, fontWeight: 600 }}>{unitLabel}</span>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--slate)', marginTop: 4 }}>
                    Est. ₦{(pkg.priceUSD * EXCHANGE_RATE).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {form.package !== 'pilot' && (
            <div style={{ marginBottom: 32, padding: '24px', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--line)' }}>
              <span style={{ ...S.label, marginBottom: 16 }}>Payment Processor</span>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div onClick={() => setForm(prev => ({ ...prev, paymentGateway: 'paystack' }))} style={S.gatewayCard(form.paymentGateway === 'paystack')}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `5px solid ${form.paymentGateway === 'paystack' ? 'var(--lime)' : 'var(--slate)'}` }}></div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--ink)' }}>Paystack (Africa)</div>
                    <div style={{ fontSize: '12px', color: 'var(--slate)' }}>Secure NGN Checkout</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} style={{ ...S.btnPrimary, opacity: loading ? 0.5 : 1 }}>
            {loading ? 'Processing...' : form.package === 'pilot' ? `Deploy Pilot Campaign (Free)` : `Pay ₦${(selectedPackageData.priceUSD * EXCHANGE_RATE).toLocaleString()} & Deploy`}
          </button>
        </form>
      </div>
    </div>
  );
}
