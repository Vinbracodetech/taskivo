import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Landing({ navigate, setAuthMode }) {
  const [openFaq, setOpenFaq] = useState(null);
  
  // 🔥 SCARCITY STATES 🔥
  const [claimedSpots, setClaimedSpots] = useState(0);
  const TOTAL_SPOTS = 10;
  const remainingSpots = Math.max(0, TOTAL_SPOTS - claimedSpots);
  const [pricingMode, setPricingMode] = useState('social');

  useEffect(() => { document.title = 'Taskivo — Digital Engagement Infrastructure'; }, []);

  // 🔥 LIVE DATABASE SYNC FOR GRANTS 🔥
  useEffect(() => {
    async function fetchPilotData() {
      try {
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gt('free_credits', 0); 
        if (!error && count !== null) setClaimedSpots(count);
      } catch (err) {
        console.error("Error fetching pilot data:", err);
      }
    }
    fetchPilotData();
  }, []);

  useEffect(() => {
    if (document.getElementById('taskivo-styles')) return;
    const style = document.createElement('style');
    style.id = 'taskivo-styles';
    style.textContent = `
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      .lp-hero-title { font-size: 64px; letter-spacing: -2px; line-height: 1.05; }
      .lp-hero-pad { padding: 120px 5% 100px; }
      .lp-hero-sub { font-size: 18px; margin: 0 auto 36px; }
      .lp-section-pad { padding: 96px 5%; }
      .lp-section-title { font-size: 40px; letter-spacing: -1.5px; }
      .lp-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
      .lp-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
      .lp-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; }
      @media (max-width: 768px) {
        .lp-hero-title { font-size: 36px !important; letter-spacing: -1px !important; }
        .lp-hero-pad { padding: 80px 5% 60px !important; }
        .lp-hero-sub { font-size: 15px !important; margin: 0 auto 24px !important; }
        .lp-section-pad { padding: 60px 5% !important; }
        .lp-section-title { font-size: 28px !important; letter-spacing: -1px !important; }
        .lp-grid-2, .lp-grid-3 { grid-template-columns: 1fr !important; gap: 16px !important; }
        .lp-footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        .lp-footer-brand-span { grid-column: 1 / -1 !important; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const socialPricing = [
    { name: 'Starter', price: '$15', slots: 100, features: ['Guaranteed Social Engagement', 'Military-Grade Anti-Cheat', 'Global Audience Distribution'] },
    { name: 'Traction', price: '$45', slots: 350, features: ['Guaranteed Social Engagement', 'Military-Grade Anti-Cheat', 'Global Audience Distribution', 'Priority Network Routing'], isPopular: true },
    { name: 'Scale', price: '$99', slots: 800, features: ['Guaranteed Social Engagement', 'Military-Grade Anti-Cheat', 'Targeted Audience Segmentation', 'Priority Network Routing'] },
    { name: 'Enterprise', price: '$249', slots: 2500, features: ['Dedicated Account Manager', 'Guaranteed Social Engagement', 'Military-Grade Anti-Cheat', 'Custom QA Survey Add-ons'] },
  ];

  const seoPricing = [
    { name: 'Starter Traffic', price: '$12', slots: 100, features: ['Guaranteed 2+ Min Dwell Time', 'Low Bounce Rate Verification', 'Real Human Web Navigators'] },
    { name: 'Traction Traffic', price: '$35', slots: 350, features: ['Guaranteed 2+ Min Dwell Time', 'Low Bounce Rate Verification', 'Real Human Web Navigators', 'Priority Search Routing'], isPopular: true },
    { name: 'Scale Traffic', price: '$75', slots: 800, features: ['Guaranteed 2+ Min Dwell Time', 'Low Bounce Rate Verification', 'Multi-Page Session Tracking', 'Priority Search Routing'] },
    { name: 'Enterprise SEO', price: '$199', slots: 2500, features: ['Dedicated Account Manager', 'Guaranteed 5+ Min Dwell Time', 'Multi-Page Session Tracking', 'Competitor Analysis Traffic'] },
  ];

  const activePricing = pricingMode === 'social' ? socialPricing : seoPricing;

  const faqs = [
    { q: 'How does Taskivo prevent bot traffic?', a: 'Taskivo utilizes Layer 3 Financial Verification. Every earner must bind a real, globally recognized bank account to their identity before accessing the network. We pair this with strict pointer-lock technology and tab-switch detection to ensure 100% human attention.' },
    { q: 'Are the engagements from real humans?', a: 'Yes. Every view, click, and UGC submission comes from a verified human in our network. We do not use server farms or automated headless browsers.' },
    { q: 'How do Earners get paid?', a: 'Earners accumulate network Points (PTS) for completing verified tasks. Once the liquidity threshold is met, points are converted and withdrawn directly to their local bank or Paystack account.' },
    { q: 'What happens if an Earner submits fake proof for a UGC task?', a: 'For premium manual tasks (like UGC or QA Testing), the points are held in escrow. You (the Creator) must manually review their uploaded proof and click "Approve" before they are paid. If the proof is invalid, you can reject it and keep your allocated slots.' },
    { q: 'How do Creators fund their campaigns?', a: 'Creators can securely fund their campaigns using fiat currency via Paystack. We support NGN, USD, ZAR, and GHS. Once payment clears, your task is injected into the network instantly.' },
  ];

  function toggleFaq(i) { setOpenFaq(openFaq === i ? null : i); }

  function goRegisterEarner() {
    localStorage.setItem('taskivo_role', 'earner');
    if (setAuthMode) setAuthMode("register");
    navigate("auth");
  }

  function goRegisterCreator() {
    localStorage.setItem('taskivo_role', 'creator');
    if (setAuthMode) setAuthMode("register");
    navigate("auth");
  }

  function claimFreeGrant() {
    localStorage.setItem('taskivo_role', 'creator');
    localStorage.setItem('taskivo_grant', 'true');
    if (setAuthMode) setAuthMode("register");
    navigate("auth");
  }

  return (
    <div style={{ background: 'var(--surface)', color: 'var(--ink)', minHeight: '100vh', WebkitFontSmoothing: 'antialiased', fontFamily: "var(--font-body)" }}>
      
      {/* ── SPLIT IDENTITY HERO ── */}
      <div className="lp-hero-pad" style={{ background: 'var(--surface-card)', position: 'relative', overflow: 'hidden', borderBottom: '1px solid var(--line)' }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)', fontSize: 12, fontWeight: 700, padding: '6px 16px', borderRadius: 100, marginBottom: 32, fontFamily: "var(--font-display)", textTransform: 'uppercase', letterSpacing: '1px' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--lime)', animation: 'pulse 2s infinite' }}></span>
            Taskivo Core Network Live
          </div>
          
          <h1 className="lp-hero-title" style={{ color: 'var(--ink)', marginBottom: 24, fontFamily: "var(--font-display)", fontWeight: 800 }}>
            The Verifiable <br /><span style={{ color: 'var(--lime)' }}>Attention</span> Network.
          </h1>
          <p className="lp-hero-sub" style={{ color: 'var(--slate)', maxWidth: 600, fontWeight: 500, lineHeight: 1.6 }}>
            Seamlessly bridging the gap between enterprise marketing demands and global micro-earning liquidity.
          </p>
          
          {/* DUAL CTA CARDS */}
          <div className="lp-grid-2" style={{ marginTop: 48, textAlign: 'left' }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--gold)', borderRadius: 16, padding: 32, boxShadow: 'var(--shadow)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--gold)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>For Businesses</div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)', marginBottom: 12, fontFamily: "var(--font-display)", letterSpacing: '-0.5px' }}>Inject Liquidity. Buy Verifiable Attention.</h3>
              <p style={{ color: 'var(--slate)', fontSize: 14, marginBottom: 24 }}>Secure high-retention SEO traffic, YouTube engagement, and authentic UGC via Paystack.</p>
              <button style={{ width: '100%', background: 'var(--gold)', color: '#000', border: 'none', borderRadius: 8, padding: '14px', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: "var(--font-display)" }} onClick={goRegisterCreator}>Deploy Campaign →</button>
            </div>
            
            <div style={{ background: 'var(--surface)', border: '1px solid var(--lime)', borderRadius: 16, padding: 32, boxShadow: 'var(--shadow)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--lime)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 12 }}>For Contributors</div>
              <h3 style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)', marginBottom: 12, fontFamily: "var(--font-display)", letterSpacing: '-0.5px' }}>Monetize Your Time. Earn Real Yield.</h3>
              <p style={{ color: 'var(--slate)', fontSize: 14, marginBottom: 24 }}>Execute simple digital tasks, accumulate Points (PTS), and withdraw directly to your bank account.</p>
              <button style={{ width: '100%', background: 'var(--lime)', color: '#000', border: 'none', borderRadius: 8, padding: '14px', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: "var(--font-display)" }} onClick={goRegisterEarner}>Start Earning →</button>
            </div>
          </div>
          
          <div style={{ color: 'var(--slate)', fontSize: 12, fontWeight: 600, letterSpacing: '0.5px', marginTop: 32 }}>
            Frictionless 1-Click Google Authentication. Zero Passwords.
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS (VISUALIZER) ── */}
      <section className="lp-section-pad" style={{ background: 'var(--surface)' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 12, fontFamily: "var(--font-display)" }}>Architecture</div>
          <h2 className="lp-section-title" style={{ color: 'var(--ink)', fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: '-1px' }}>How the ecosystem works.</h2>
        </div>
        
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 48 }}>
          
          {/* Creator Timeline */}
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 24, padding: 40 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--gold)', marginBottom: 24, fontFamily: "var(--font-display)", borderBottom: '1px solid var(--line)', paddingBottom: 16 }}>The B2B Pipeline</h3>
            <div className="lp-grid-3">
              <div>
                <div style={{ fontSize: 32, marginBottom: 16 }}>💳</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>1. Secure Funding</div>
                <div style={{ fontSize: 14, color: 'var(--slate)', lineHeight: 1.5 }}>Purchase campaign slots safely using local or global fiat via our Paystack integration.</div>
              </div>
              <div>
                <div style={{ fontSize: 32, marginBottom: 16 }}>🚀</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>2. Instant Deployment</div>
                <div style={{ fontSize: 14, color: 'var(--slate)', lineHeight: 1.5 }}>Set your target URLs, required dwell time, and verification protocols. Go live instantly.</div>
              </div>
              <div>
                <div style={{ fontSize: 32, marginBottom: 16 }}>📊</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>3. Real-Time Audit</div>
                <div style={{ fontSize: 14, color: 'var(--slate)', lineHeight: 1.5 }}>Monitor your campaign fulfillment and manually approve premium UGC submissions.</div>
              </div>
            </div>
          </div>

          {/* Earner Timeline */}
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 24, padding: 40 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--lime)', marginBottom: 24, fontFamily: "var(--font-display)", borderBottom: '1px solid var(--line)', paddingBottom: 16 }}>The Contributor Pipeline</h3>
            <div className="lp-grid-3">
              <div>
                <div style={{ fontSize: 32, marginBottom: 16 }}>🛡️</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>1. Pass Security</div>
                <div style={{ fontSize: 14, color: 'var(--slate)', lineHeight: 1.5 }}>Bind your payout account to verify your identity and unlock the premium task marketplace.</div>
              </div>
              <div>
                <div style={{ fontSize: 32, marginBottom: 16 }}>▶️</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>2. Execute Tasks</div>
                <div style={{ fontSize: 14, color: 'var(--slate)', lineHeight: 1.5 }}>Watch videos, read blogs, or upload QA screenshots. Bypass our anti-cheat timers to earn points.</div>
              </div>
              <div>
                <div style={{ fontSize: 32, marginBottom: 16 }}>🏦</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>3. Liquidate Yield</div>
                <div style={{ fontSize: 14, color: 'var(--slate)', lineHeight: 1.5 }}>Once you hit the threshold, withdraw your points directly to your linked bank account.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST LAYER ── */}
      <section className="lp-section-pad" style={{ background: 'var(--surface-card)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--lime)', marginBottom: 12, fontFamily: "var(--font-display)" }}>Military-Grade Architecture</div>
          <h2 className="lp-section-title" style={{ color: 'var(--ink)', marginBottom: 16, fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: '-1px' }}>Proof of attention, built-in.</h2>
          <p style={{ color: 'var(--slate)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>We do not sell bot traffic. We guarantee sustained human focus through strict, automated anti-cheat protocols. You only pay for verified engagement.</p>
        </div>
        <div className="lp-grid-3" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', padding: 32, borderRadius: 16, boxShadow: 'var(--shadow)' }}>
            <div style={{ fontSize: 24, marginBottom: 16 }}>🏦</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', marginBottom: 12, fontFamily: "var(--font-display)" }}>Layer 3 KYC Financials</div>
            <p style={{ color: 'var(--slate)', fontSize: 14, lineHeight: 1.6 }}>Every earner must permanently bind a verified payout institution to their account. Attempting to run a bot farm instantly flags the network.</p>
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', padding: 32, borderRadius: 16, boxShadow: 'var(--shadow)' }}>
            <div style={{ fontSize: 24, marginBottom: 16 }}>🎯</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', marginBottom: 12, fontFamily: "var(--font-display)" }}>Pointer-Lock Technology</div>
            <p style={{ color: 'var(--slate)', fontSize: 14, lineHeight: 1.6 }}>During video and ad-playback, native browser controls are hidden. Skipping, scrubbing, or fast-forwarding triggers an automatic penalty reset.</p>
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', padding: 32, borderRadius: 16, boxShadow: 'var(--shadow)' }}>
            <div style={{ fontSize: 24, marginBottom: 16 }}>👁️</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', marginBottom: 12, fontFamily: "var(--font-display)" }}>Visibility Assertions</div>
            <p style={{ color: 'var(--slate)', fontSize: 14, lineHeight: 1.6 }}>If a contributor switches tabs or minimizes their browser to multitask, the verification timer is instantly severed. Guaranteed active screen time.</p>
          </div>
        </div>
      </section>

      {/* ── DYNAMIC PRICING TOGGLE ── */}
      <section className="lp-section-pad" style={{ background: 'var(--surface)' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 12, fontFamily: "var(--font-display)" }}>Campaign Pricing</div>
          <h2 className="lp-section-title" style={{ color: 'var(--ink)', marginBottom: 16, fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: '-1px' }}>Predictable growth packages.</h2>
          <p style={{ color: 'var(--slate)', maxWidth: 500, margin: '0 auto', lineHeight: 1.6, marginBottom: 32 }}>Purchase secure campaign slots using traditional payment rails. We handle the point distributions.</p>

          <div style={{ display: 'inline-flex', background: 'var(--surface-card)', padding: 6, borderRadius: 100, border: '1px solid var(--line)' }}>
            <button onClick={() => setPricingMode('social')} style={{ background: pricingMode === 'social' ? 'var(--ink)' : 'transparent', color: pricingMode === 'social' ? 'var(--surface)' : 'var(--slate)', border: 'none', padding: '10px 24px', borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "var(--font-body)" }}>YouTube & Social</button>
            <button onClick={() => setPricingMode('seo')} style={{ background: pricingMode === 'seo' ? 'var(--ink)' : 'transparent', color: pricingMode === 'seo' ? 'var(--surface)' : 'var(--slate)', border: 'none', padding: '10px 24px', borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "var(--font-body)" }}>SEO Web Traffic</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, maxWidth: 1200, margin: '0 auto', alignItems: 'center' }}>
          {activePricing.map(function(plan, i) {
            return (
              <div key={i} style={{ background: plan.isPopular ? 'var(--ink)' : 'var(--surface-card)', color: plan.isPopular ? 'var(--surface)' : 'var(--ink)', border: `1px solid ${plan.isPopular ? 'var(--ink)' : 'var(--line)'}`, borderRadius: 16, padding: plan.isPopular ? '48px 32px' : '32px', boxShadow: plan.isPopular ? '0 20px 40px rgba(0,0,0,0.1)' : 'none', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {plan.isPopular && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--lime)', color: '#000', fontSize: 11, fontWeight: 800, padding: '6px 16px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "var(--font-display)" }}>Best Value</div>}
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, fontFamily: "var(--font-display)" }}>{plan.name}</div>
                <div style={{ fontSize: 40, color: plan.isPopular ? 'var(--lime)' : 'var(--ink)', marginBottom: 8, fontFamily: "var(--font-display)", fontWeight: 800 }}>{plan.price}</div>
                <div style={{ fontSize: 14, fontWeight: 600, paddingBottom: 24, borderBottom: `1px solid ${plan.isPopular ? 'rgba(255,255,255,0.1)' : 'var(--line)'}`, marginBottom: 24 }}>{plan.slots.toLocaleString()} Verified Engagements</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 14, flexGrow: 1 }}>
                  {plan.features.map(function(feat, idx) {
                    return <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: plan.isPopular ? 'rgba(255,255,255,0.7)' : 'var(--slate)', fontWeight: 500 }}><span style={{ color: plan.isPopular ? 'var(--lime)' : 'var(--ink)', fontWeight: 'bold' }}>✓</span> {feat}</li>;
                  })}
                </ul>
                <button style={{ background: plan.isPopular ? 'var(--lime)' : 'var(--ink)', color: plan.isPopular ? '#000' : 'var(--surface)', border: 'none', borderRadius: 8, padding: '14px', fontSize: 14, fontWeight: 800, cursor: 'pointer', width: '100%', fontFamily: "var(--font-display)", textTransform: 'uppercase' }} onClick={goRegisterCreator}>Deploy Campaign</button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── MEGA FAQ ── */}
      <section className="lp-section-pad" style={{ background: 'var(--surface-card)', borderTop: '1px solid var(--line)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 32, color: 'var(--ink)', marginBottom: 12, fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: '-1px' }}>Platform Architecture & FAQs</h2>
            <p style={{ color: 'var(--slate)', fontSize: 15 }}>Built for transparency and absolute fairness.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {faqs.map(function(faq, i) {
              const isOpen = openFaq === i;
              return (
                <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                  <button onClick={function() { toggleFaq(i); }} style={{ width: '100%', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 700, color: 'var(--ink)', textAlign: 'left' }}>
                    {faq.q}
                    <span style={{ color: 'var(--slate)', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                  </button>
                  {isOpen && <div style={{ padding: '0 24px 24px', color: 'var(--slate)', fontSize: 15, lineHeight: 1.6 }}>{faq.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--line)', padding: '64px 5% 32px' }}>
        <div className="lp-footer-grid" style={{ maxWidth: 1100, margin: '0 auto', marginBottom: 48 }}>
          <div className="lp-footer-brand-span">
            <div style={{ color: 'var(--ink)', fontSize: 24, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, fontFamily: "var(--font-display)", fontWeight: 800, letterSpacing: '-0.5px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--lime)', display: 'inline-block' }}></span>Taskivo
            </div>
            <p style={{ color: 'var(--slate)', fontSize: 14, lineHeight: 1.6, maxWidth: 300, marginBottom: 24 }}>A modern omnichannel engagement infrastructure bridging global businesses with a distributed contributor network.</p>
            <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 700 }}>hello@taskivo.online</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--slate)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 20, fontFamily: "var(--font-display)" }}>Product</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <li><span style={{ color: 'var(--ink)', cursor: "pointer", fontSize: 14, fontWeight: 600 }} onClick={goRegisterEarner}>For Contributors</span></li>
              <li><span style={{ color: 'var(--ink)', cursor: "pointer", fontSize: 14, fontWeight: 600 }} onClick={goRegisterCreator}>For Businesses</span></li>
            </ul>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--slate)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 20, fontFamily: "var(--font-display)" }}>Company</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <li><span style={{ color: 'var(--ink)', cursor: "pointer", fontSize: 14, fontWeight: 600 }} onClick={function() { navigate("about"); }}>About Us</span></li>
              <li><span style={{ color: 'var(--ink)', cursor: "pointer", fontSize: 14, fontWeight: 600 }} onClick={function() { navigate("blog"); }}>Blog</span></li>
            </ul>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--slate)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 20, fontFamily: "var(--font-display)" }}>Legal</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <li><span style={{ color: 'var(--ink)', cursor: "pointer", fontSize: 14, fontWeight: 600 }} onClick={function() { navigate("terms"); }}>Terms of Service</span></li>
              <li><span style={{ color: 'var(--ink)', cursor: "pointer", fontSize: 14, fontWeight: 600 }} onClick={function() { navigate("privacy"); }}>Privacy Policy</span></li>
            </ul>
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: 24, color: 'var(--slate)', fontSize: 13 }}>
          <div>© {new Date().getFullYear()} Taskivo. All rights reserved. B2B Beta Platform.</div>
          <div style={{ display: 'flex', gap: 16, fontWeight: 600 }}><span>Built for verifiable engagement.</span></div>
        </div>
      </footer>
    </div>
  );
}
