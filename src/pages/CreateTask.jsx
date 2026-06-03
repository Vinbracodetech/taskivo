import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import PaystackPop from '@paystack/inline-js';

export default function CreateTask({ session, navigate, showToast }) {
  const user = session?.user;
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null); 
  const [freeCredits, setFreeCredits] = useState(0); 
  
  // 🔥 Deployment States
  const [step, setStep] = useState(1); 
  const [deployedTask, setDeployedTask] = useState(null);
  
  const [form, setForm] = useState({
    title: '',
    platform: 'youtube',
    url: '',
    search_keyword: '', 
    secret_code: '',    
    watch_duration: 120, // Locked to 120 seconds globally
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
      watch_duration: 120, // Force 120 seconds into the DB
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
    
    // Trigger Success & Snippet Screen
    setDeployedTask(newTask);
    setStep(2);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError(null); 

    if (!form.title || !form.url) {
      setLocalError('Please complete all required fields.');
      return;
    }
    
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
    pageWrapper: {
      minHeight: '100vh',
      backgroundColor: '#0a0a0c',
      backgroundImage: `
        radial-gradient(circle at 15% 50px, rgba(212, 175, 55, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 85% 30%, rgba(168, 255, 62, 0.04) 0%, transparent 50%),
        url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z' fill='none' stroke='%23ffffff' stroke-width='1' stroke-opacity='0.02'/%3E%3C/svg%3E")
      `,
      backgroundSize: '100% 100%, 100% 100%, 40px 40px',
      backgroundAttachment: 'fixed',
    },
    page: { padding: '40px 5%', maxWidth: 900, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", position: 'relative' },
    
    glassCard: { 
      background: 'rgba(255, 255, 255, 0.02)', 
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 20, 
      padding: 40, 
      boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)'
    },
    
    label: { fontSize: 11, color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12, display: 'block', fontFamily: "'Inter', sans-serif" },
    
    input: { width: '100%', padding: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#ffffff', fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', marginBottom: 24, transition: 'border-color 0.2s' },
    select: { width: '100%', padding: '16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#ffffff', fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', appearance: 'none', marginBottom: 24, transition: 'border-color 0.2s' },
    
    btnPrimary: { width: '100%', background: '#D4AF37', border: 'none', color: '#000', borderRadius: 12, padding: '18px', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '1px', marginTop: 16, transition: 'opacity 0.2s', boxShadow: '0 8px 24px rgba(212, 175, 55, 0.2)' },
    
    packageCard: (isActive) => ({ padding: 24, borderRadius: 16, cursor: 'pointer', transition: 'all 0.2s', background: isActive ? 'rgba(212, 175, 55, 0.1)' : 'rgba(0,0,0,0.3)', border: `1px solid ${isActive ? '#D4AF37' : 'rgba(255,255,255,0.1)'}`, color: '#ffffff' }),
    gatewayCard: (isActive) => ({ padding: '16px', borderRadius: '12px', cursor: 'pointer', border: `1px solid ${isActive ? '#D4AF37' : 'rgba(255,255,255,0.1)'}`, background: isActive ? 'rgba(212, 175, 55, 0.05)' : 'rgba(0,0,0,0.3)', flex: 1, display: 'flex', alignItems: 'center', gap: '16px', transition: 'all 0.2s' })
  };

  const isManual = form.platform === 'ugc' || form.platform === 'qa_testing';
  const unitLabel = isManual ? 'SUBMISSIONS' : 'VERIFICATIONS';

  return (
    <div style={S.pageWrapper}>
      <div style={S.page}>
        <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 32, color: '#ffffff', margin: 0, fontWeight: 800, letterSpacing: '-0.5px' }}>Campaign Deployment</h1>
          <button onClick={() => navigate('creator-dashboard')} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#ffffff', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>← Command Center</button>
        </div>

        <div style={S.glassCard}>
          {localError && (
            <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', borderRadius: '12px', marginBottom: '24px', fontSize: '14px', fontWeight: '600' }}>
              🚨 {localError}
            </div>
          )}

          {/* 🔥 STEP 1: FORM DEPLOYMENT 🔥 */}
          {step === 1 && (
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

              {/* DYNAMIC SEO FIELDS */}
              {form.platform === 'blog' && (
                <div style={{ background: 'rgba(212, 175, 55, 0.05)', padding: 24, borderRadius: 12, border: '1px solid rgba(212, 175, 55, 0.2)', marginBottom: 24 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
                    <div>
                      <span style={S.label}>Google Search Keyword</span>
                      <input style={{...S.input, marginBottom: 0}} type="text" name="search_keyword" placeholder="e.g. Best FinTech 2026" value={form.search_keyword} onChange={handleInput} required />
                    </div>
                    <div>
                      <span style={S.label}>Verification Secret Code</span>
                      <input style={{...S.input, marginBottom: 0}} type="text" name="secret_code" placeholder="e.g. 9X2P1" value={form.secret_code} onChange={handleInput} required />
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: '12px 0 0 0' }}>Earners will search for the keyword, find your URL, wait for the timer, and must input this exact code to get paid.</p>
                </div>
              )}

              {/* LOCKED TO 120 SECONDS */}
              {!isManual && (
                <div>
                  <span style={S.label}>Verification Duration (Seconds)</span>
                  <div style={{ ...S.input, background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.4)', cursor: 'not-allowed', border: '1px solid rgba(255,255,255,0.05)' }}>
                    120 Seconds (Strict Network Dwell Standard)
                  </div>
                </div>
              )}

              <div style={{ marginTop: 24, marginBottom: 40 }}>
                <span style={{ ...S.label, marginBottom: 16, color: '#ffffff' }}>Select Engagement Allocation</span>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                  {hasFreeCredit && (
                    <div onClick={() => setForm(prev => ({ ...prev, package: 'pilot' }))} style={{ ...S.packageCard(form.package === 'pilot'), border: `1px solid ${form.package === 'pilot' ? '#D4AF37' : 'rgba(255,255,255,0.1)'}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: form.package === 'pilot' ? '#D4AF37' : '#ffffff' }}>🎁 Pilot Grant</div>
                        <div style={{ fontSize: 11, fontWeight: 800, padding: '4px 8px', borderRadius: 100, border: `1px solid ${form.package === 'pilot' ? 'rgba(212, 175, 55, 0.3)' : 'rgba(255,255,255,0.1)'}`, color: form.package === 'pilot' ? '#D4AF37' : 'rgba(255,255,255,0.5)' }}>FREE</div>
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>20 <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>{unitLabel}</span></div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>One-time network trial.</div>
                    </div>
                  )}

                  {Object.entries(activePackages).map(([key, pkg]) => (
                    <div key={key} onClick={() => setForm(prev => ({ ...prev, package: key }))} style={S.packageCard(form.package === key)}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>{pkg.label}</div>
                        <div style={{ fontSize: 11, fontWeight: 800, padding: '4px 8px', borderRadius: 100, background: form.package === key ? '#D4AF37' : 'rgba(255,255,255,0.1)', color: form.package === key ? '#000' : '#ffffff', border: `1px solid ${form.package === key ? '#D4AF37' : 'rgba(255,255,255,0.05)'}` }}>${pkg.priceUSD}</div>
                      </div>
                      <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>
                        {pkg.views} <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>{unitLabel}</span>
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: form.package === key ? 'rgba(212, 175, 55, 0.8)' : 'rgba(255,255,255,0.4)', marginTop: 8 }}>
                        Est. ₦{(pkg.priceUSD * EXCHANGE_RATE).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {form.package !== 'pilot' && (
                <div style={{ marginBottom: 32, padding: '24px', background: 'rgba(0,0,0,0.2)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ ...S.label, marginBottom: 16 }}>Payment Processor</span>
                  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <div onClick={() => setForm(prev => ({ ...prev, paymentGateway: 'paystack' }))} style={S.gatewayCard(form.paymentGateway === 'paystack')}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `4px solid ${form.paymentGateway === 'paystack' ? '#D4AF37' : 'rgba(255,255,255,0.2)'}`, background: form.paymentGateway === 'paystack' ? '#000' : 'transparent', transition: 'all 0.2s' }}></div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff' }}>Paystack (Africa)</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Secure NGN Checkout</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button type="submit" disabled={loading} style={{ ...S.btnPrimary, opacity: loading ? 0.5 : 1 }}>
                {loading ? 'Processing Transaction...' : form.package === 'pilot' ? `Deploy Pilot Campaign (Free)` : `Pay ₦${(selectedPackageData.priceUSD * EXCHANGE_RATE).toLocaleString()} & Deploy`}
              </button>
            </form>
          )}

          {/* 🔥 STEP 2: SUCCESS & INTEGRATION SCREEN 🔥 */}
          {step === 2 && deployedTask && (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: 64, height: 64, background: 'rgba(168, 255, 62, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid rgba(168, 255, 62, 0.5)' }}>
                <span style={{ fontSize: 24 }}>🚀</span>
              </div>
              <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 28, color: '#ffffff', margin: '0 0 12px 0', fontWeight: 800 }}>Campaign Deployed!</h1>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', margin: '0 0 32px 0' }}>Your capital is locked in escrow. The network is ready.</p>

              {form.platform === 'blog' ? (
                <div style={{ textAlign: 'left', background: 'rgba(0,0,0,0.3)', border: '1px solid #D4AF37', borderRadius: 16, padding: 24, marginTop: 16 }}>
                  <h3 style={{ margin: '0 0 16px 0', color: '#ffffff', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', fontSize: 14, letterSpacing: '1px' }}>Integration Required</h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginBottom: 20 }}>
                    To enable Zero-Bot verification, copy the code below and paste it into the HTML of your target article (usually at the very bottom of the post).
                  </p>
                  
                  <div style={{ position: 'relative' }}>
                    <pre style={{ background: '#000000', padding: 24, borderRadius: 12, overflowX: 'auto', fontSize: 12, color: '#10b981', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'monospace', lineHeight: 1.5 }}>
{`<div id="taskivo-node" style="padding: 20px; text-align: center; border: 1px dashed #ccc; border-radius: 8px; margin-top: 30px;">
  <span style="font-family: sans-serif; font-size: 14px; color: #666;">Taskivo Secure Node active. Revealing payload in: <strong id="t-timer" style="color:#ef4444;">${deployedTask.watch_duration}</strong>s</span>
</div>

<script>
  (function() {
    var timeLeft = ${deployedTask.watch_duration};
    var timerEl = document.getElementById('t-timer');
    var nodeEl = document.getElementById('taskivo-node');

    var countdown = setInterval(function() {
      timeLeft--;
      if (timerEl) timerEl.innerText = timeLeft;

      if (timeLeft <= 0) {
        clearInterval(countdown);
        nodeEl.innerHTML = '<strong style="color: #10b981; font-family: sans-serif;">Verification Complete! Your Code is: <span style="background: #eee; padding: 4px 8px; border-radius: 4px; letter-spacing: 2px; color: #000;">${deployedTask.secret_code}</span></strong>';
      }
    }, 1000);
  })();
</script>`}
                    </pre>
                  </div>

                  <p style={{ fontSize: 13, color: '#ef4444', marginTop: 20, fontWeight: 700 }}>
                    ⚠️ If you do not install this script, earners will not be able to find your secret code, and your campaign will stall.
                  </p>
                </div>
              ) : (
                <div style={{ textAlign: 'center', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: 32, marginTop: 16 }}>
                  <h3 style={{ margin: '0 0 12px 0', color: '#ffffff', fontFamily: "'Inter', sans-serif" }}>Network is Live</h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>Your {form.platform.replace('_', ' ')} campaign is now indexing in the Earner pool. No further action is required.</p>
                </div>
              )}

              <button onClick={() => navigate('creator-dashboard')} style={{ ...S.btnPrimary, marginTop: 40, background: 'rgba(255,255,255,0.1)', color: '#ffffff', boxShadow: 'none' }}>
                Return to Command Center
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
