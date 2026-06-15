import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const C = {
  ink: '#0D0D14', lime: '#A8FF3E', limeDim: 'rgba(168,255,62,0.12)', limeBorder: 'rgba(168,255,62,0.2)',
  white: '#ffffff', off: '#F7F8FA', slate: '#6B7280', line: '#EBEBEB', darkLine: 'rgba(255,255,255,0.08)',
};

export default function Landing({ navigate, setAuthMode }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [pricingMode, setPricingMode] = useState('social'); // 'social', 'seo', 'qa', 'ugc'

  // 🔥 UPGRADED METADATA & JSON-LD SCHEMA INJECTION 🔥
  useEffect(() => {
    // 1. Basic SEO Metadata
    document.title = 'Taskivo — Digital Engagement Infrastructure';
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = 'The world\'s most secure omnichannel engagement infrastructure. Connecting businesses with verified human attention.';

    // 2. Enterprise Structured Data (JSON-LD)
    const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "name": "Taskivo",
          "url": "https://taskivo.online",
          "logo": "https://taskivo.online/logo.png",
          "sameAs": [
            "https://twitter.com/taskivo"
          ]
        },
        {
          "@type": "SoftwareApplication",
          "name": "Taskivo B2B Network",
          "operatingSystem": "Web Browser",
          "applicationCategory": "BusinessApplication",
          "description": "A secure omnichannel engagement infrastructure bridging global businesses with a distributed contributor network.",
          "offers": {
            "@type": "Offer",
            "price": "15.00",
            "priceCurrency": "USD"
          }
        }
      ]
    };

    // Prevent duplicate scripts if navigating back and forth
    const existingScript = document.getElementById('taskivo-schema');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = 'taskivo-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);
    
    // Cleanup function when leaving the landing page
    return () => {
      const scriptToRemove = document.getElementById('taskivo-schema');
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, []);

  useEffect(() => {
    if (document.getElementById('taskivo-styles')) return;
    const style = document.createElement('style');
    style.id = 'taskivo-styles';
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap');
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      .heading { font-family: 'Syne', sans-serif; }
      .body-text { font-family: 'DM Sans', sans-serif; }
      .lp-hero-title { font-size: 64px; letter-spacing: -2px; line-height: 1.05; }
      .lp-hero-pad { padding: 100px 5% 0px; }
      .lp-hero-sub { font-size: 18px; margin: 0 auto 36px; }
      .lp-section-pad { padding: 96px 5%; }
      .lp-section-title { font-size: 40px; letter-spacing: -1.5px; }
      .lp-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
      .lp-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
      .lp-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; }
      @media (max-width: 768px) {
        .lp-hero-title { font-size: 36px !important; letter-spacing: -1px !important; }
        .lp-hero-pad { padding: 80px 5% 0px !important; }
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

  const qaPricing = [
    { name: 'Beta QA', price: '$25', slots: 10, features: ['Real Human Testers', 'Manual Bug & UX Reports', 'Verified Screenshots'] },
    { name: 'Scale QA', price: '$100', slots: 50, features: ['Real Human Testers', 'Manual Bug & UX Reports', 'Verified Screenshots', 'Priority Placement'], isPopular: true },
  ];

  const ugcPricing = [
    { name: 'Starter UGC', price: '$45', slots: 5, features: ['Authentic Creator Videos', 'Full Usage Rights', 'Manual Verification & Escrow'] },
    { name: 'Scale UGC', price: '$160', slots: 20, features: ['Authentic Creator Videos', 'Full Usage Rights', 'Manual Verification & Escrow', 'High-Tier Creators'], isPopular: true },
  ];

  const activePricing = pricingMode === 'social' ? socialPricing : 
                        pricingMode === 'seo' ? seoPricing : 
                        pricingMode === 'qa' ? qaPricing : ugcPricing;
  
  const unitLabel = (pricingMode === 'qa' || pricingMode === 'ugc') ? 'Manual Submissions' : 'Verified Engagements';

  const serviceDetails = {
    social: { title: 'YouTube & Social Engagement', icon: '▶️', desc: 'Boost your algorithmic reach. Real humans will watch your videos, like, and engage, signaling to platform algorithms that your content is highly valuable. Every view is verified by our strict anti-cheat timers.' },
    seo: { title: 'SEO Web Traffic', icon: '🔍', desc: 'Dominate search rankings. Our network navigates to your blog or website and maintains a guaranteed 2+ minute dwell time, drastically reducing bounce rates and signaling high relevance to Google.' },
    qa: { title: 'App QA Testing', icon: '🐛', desc: 'Crowdsourced bug hunting. Deploy real users to download your app, test specific features, and upload manual feedback or screenshots to identify UX friction before your official launch.' },
    ugc: { title: 'Authentic UGC (User-Generated Content)', icon: '🤳', desc: 'Commission real people to record authentic, selfie-style video testimonials or product demos. You get full commercial rights to use these high-converting videos in your ad campaigns.' }
  };

  const faqs = [
    { q: 'Who is Taskivo?', a: 'Taskivo is a global attention network bridging the gap between enterprise marketing and distributed human contributors. We provide a secure infrastructure for real people to monetize their digital footprint while helping businesses grow.' },
    { q: 'How does Taskivo prevent bot traffic?', a: 'We utilize Layer 3 Financial Verification. Every contributor must bind a real, globally recognized bank account to their identity before accessing the network. We pair this with strict pointer-lock technology and tab-switch detection.' },
    { q: 'Are the engagements from real humans?', a: 'Yes. Every view, click, and UGC submission comes from a verified human in our network. We do not use server farms or automated headless browsers.' },
    { q: 'How do Earners get paid?', a: 'Earners accumulate network Points (PTS) for completing verified tasks. Once the liquidity threshold is met, points are converted and withdrawn instantly to their local bank or Paystack account.' },
    { q: 'What happens if an Earner submits fake proof for a UGC or QA task?', a: 'For premium manual tasks, the points are held in escrow. The Creator manually reviews the uploaded proof and clicks "Approve" before the Earner is paid. If the proof is invalid, it can be rejected.' },
    { q: 'How do Creators fund their campaigns?', a: 'Creators can securely fund their campaigns using fiat currency via Paystack (supporting NGN, ZAR, GHS, USD). Once payment clears, your task is injected into the network instantly.' }
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

  return (
    <div className="body-text" style={{ background: C.off, color: C.ink, minHeight: '100vh', WebkitFontSmoothing: 'antialiased' }}>
      
      {/* ── HERO SECTION ── */}
      <div className="lp-hero-pad" style={{ background: C.ink, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.darkLine}`, color: C.white, fontSize: 12, fontWeight: 600, padding: '6px 16px', borderRadius: 100, marginBottom: 32 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.lime, animation: 'pulse 2s infinite' }}></span>
            Taskivo B2B Network Live
          </div>
          
          <h1 className="lp-hero-title heading" style={{ color: C.white, marginBottom: 24 }}>Tap into a global.<br /><span style={{ color: C.lime }}>human workforce.</span></h1>
          <p className="lp-hero-sub body-text" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 540, fontWeight: 400, lineHeight: 1.6 }}>The world's most secure omnichannel engagement infrastructure. Connecting businesses with verified human attention.</p>
          
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
            <button style={{ background: C.lime, color: C.ink, border: 'none', borderRadius: 8, padding: '14px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }} onClick={goRegisterCreator}>Launch a Campaign</button>
            <button style={{ background: 'transparent', color: C.white, border: `1px solid ${C.darkLine}`, borderRadius: 8, padding: '14px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }} onClick={goRegisterEarner}>Monetize Your Attention</button>
          </div>
          
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 500, letterSpacing: 0.5, marginBottom: 48 }}>Frictionless 1-Click Google Authentication. Zero Passwords.</div>
          
          {/* 🔥 DYNAMIC HERO MOCKUP 🔥 */}
          <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto', transform: 'translateY(20px)' }}>
             <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0D0D14 5%, transparent 40%)', zIndex: 2 }}></div>
             <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80" alt="Taskivo Dashboard" style={{ width: '100%', height: 'auto', borderRadius: '16px 16px 0 0', border: `1px solid ${C.darkLine}`, borderBottom: 'none', display: 'block', objectFit: 'cover' }} />
          </div>
        </div>
      </div>

      {/* ── AUTHENTIC INFRASTRUCTURE BANNER ── */}
      <div style={{ padding: '32px 5%', borderBottom: `1px solid ${C.darkLine}`, background: C.ink, textAlign: 'center', position: 'relative', zIndex: 10 }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 24, fontWeight: 600 }}>Integrated with global infrastructure</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8%', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ color: C.white, fontSize: 18, fontWeight: 700, opacity: 0.7, fontFamily: "var(--font-display)" }}>Google <span style={{ fontWeight: 400, fontSize: 14 }}>Auth</span></div>
          <div style={{ color: C.white, fontSize: 18, fontWeight: 700, opacity: 0.7, fontFamily: "var(--font-display)" }}>Paystack <span style={{ fontWeight: 400, fontSize: 14 }}>Payments</span></div>
          <div style={{ color: C.white, fontSize: 18, fontWeight: 700, opacity: 0.7, fontFamily: "var(--font-display)" }}>YouTube <span style={{ fontWeight: 400, fontSize: 14 }}>Player</span></div>
          <div style={{ color: C.white, fontSize: 18, fontWeight: 700, opacity: 0.7, fontFamily: "var(--font-display)" }}>Supabase <span style={{ fontWeight: 400, fontSize: 14 }}>Ledger</span></div>
        </div>
      </div>

      {/* ── PLATFORM GUARANTEES ── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 64, flexWrap: 'wrap', padding: '64px 5%', background: C.ink, borderBottom: `1px solid ${C.darkLine}` }}>
          <div style={{ textAlign: 'center', maxWidth: 200 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🛡️</div>
            <div className="heading" style={{ fontSize: 20, color: C.lime, marginBottom: 8 }}>0% Bot Tolerance</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>Our pointer-lock technology ensures every single engagement is from a verified human.</div>
          </div>
          <div style={{ textAlign: 'center', maxWidth: 200 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
            <div className="heading" style={{ fontSize: 20, color: C.lime, marginBottom: 8 }}>Instant Liquidity</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>Contributors withdraw their yields instantly to traditional bank accounts via Paystack.</div>
          </div>
          <div style={{ textAlign: 'center', maxWidth: 200 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🤝</div>
            <div className="heading" style={{ fontSize: 20, color: C.lime, marginBottom: 8 }}>Escrow Protection</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>For premium manual tasks, funds are locked until the Creator explicitly approves the work.</div>
          </div>
      </div>

      {/* ── LOCKED PILOT PROGRAM BANNER ── */}
      <div style={{ background: C.ink, borderBottom: `1px solid ${C.darkLine}`, padding: '24px 5%' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.1)', color: C.slate, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '4px 8px', borderRadius: 4 }}>Locked</span>
              <span className="heading" style={{ color: C.white, fontSize: 18 }}>Early Adopter Grants</span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Grants will unlock for our first 10 B2B partners once we hit our initial liquidity target of 500 active Earners.</div>
          </div>
          <div style={{ flex: '1 1 250px', maxWidth: 350, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: C.white, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              <span>Network Liquidity Target</span>
              <span style={{ color: C.slate }}>0 / 500 Earners</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ width: '5%', height: '100%', background: C.slate, transition: 'width 1s ease-in-out' }}></div>
            </div>
          </div>
          <button style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: `1px solid ${C.darkLine}`, borderRadius: 6, padding: '12px 24px', fontSize: 13, fontWeight: 700, cursor: 'not-allowed', fontFamily: "'DM Sans', sans-serif" }} disabled>
            🔒 Coming Soon
          </button>
        </div>
      </div>

      {/* ── VALUE PROP WITH LIFESTYLE IMAGERY ── */}
      <section className="lp-section-pad" style={{ background: C.off }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 className="lp-section-title heading" style={{ color: C.ink, marginBottom: 16 }}>Two markets.<br />One infrastructure.</h2>
          <p style={{ color: C.slate, maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>Taskivo seamlessly bridges the gap between enterprise marketing demands and global micro-earning liquidity.</p>
        </div>
        <div className="lp-grid-2" style={{ maxWidth: 1000, margin: '0 auto' }}>
          
          {/* Creator Card */}
          <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 16, overflow: 'hidden' }}>
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" alt="Business Analytics" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
            <div style={{ padding: 40 }}>
              <div style={{ display: 'inline-block', background: C.ink, color: C.lime, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '6px 12px', borderRadius: 6, marginBottom: 24 }}>For Businesses</div>
              <h3 className="heading" style={{ fontSize: 24, marginBottom: 16, color: C.ink }}>Outsource digital friction.</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.slate, fontSize: 15 }}><span style={{ color: C.ink, fontWeight: 'bold' }}>✓</span> Secure high-retention metrics</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.slate, fontSize: 15 }}><span style={{ color: C.ink, fontWeight: 'bold' }}>✓</span> Deploy manual QA testers</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.slate, fontSize: 15 }}><span style={{ color: C.ink, fontWeight: 'bold' }}>✓</span> Commission authentic UGC</li>
              </ul>
              <button style={{ background: C.ink, color: C.white, border: 'none', borderRadius: 6, padding: '12px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%' }} onClick={goRegisterCreator}>Explore B2B Solutions</button>
            </div>
          </div>

          {/* Earner Card */}
          <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 16, overflow: 'hidden' }}>
            <img src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80" alt="Contributor Using Phone" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
            <div style={{ padding: 40 }}>
              <div style={{ display: 'inline-block', background: C.limeDim, color: '#3d6600', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '6px 12px', borderRadius: 6, marginBottom: 24 }}>For Contributors</div>
              <h3 className="heading" style={{ fontSize: 24, marginBottom: 16, color: C.ink }}>Monetize your attention.</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.slate, fontSize: 15 }}><span style={{ color: C.lime, fontWeight: 'bold' }}>●</span> Execute verifiable micro-tasks daily</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.slate, fontSize: 15 }}><span style={{ color: C.lime, fontWeight: 'bold' }}>●</span> Accumulate dynamic Point (PTS) allocations</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.slate, fontSize: 15 }}><span style={{ color: C.lime, fontWeight: 'bold' }}>●</span> Withdraw directly to global bank infrastructures</li>
              </ul>
              <button style={{ background: C.lime, color: C.ink, border: 'none', borderRadius: 6, padding: '12px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%' }} onClick={goRegisterEarner}>Access Earner Dashboard</button>
            </div>
          </div>

        </div>
      </section>

      {/* ── HOW IT WORKS VISUALIZER ── */}
      <section className="lp-section-pad" style={{ background: C.white, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 className="lp-section-title heading" style={{ color: C.ink, marginBottom: 16 }}>How the ecosystem works.</h2>
          <p style={{ color: C.slate, maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>A transparent pipeline connecting businesses with contributors.</p>
        </div>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 48 }}>
          
          <div style={{ background: C.off, border: `1px solid ${C.line}`, borderRadius: 24, padding: 40 }}>
            <h3 className="heading" style={{ fontSize: 18, color: C.ink, marginBottom: 24, borderBottom: `1px solid ${C.line}`, paddingBottom: 16 }}>The B2B Pipeline</h3>
            <div className="lp-grid-3">
              <div>
                <div style={{ fontSize: 32, marginBottom: 16 }}>💳</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, marginBottom: 8 }}>1. Secure Funding</div>
                <div style={{ fontSize: 14, color: C.slate, lineHeight: 1.5 }}>Purchase campaign slots safely using fiat via our Paystack integration.</div>
              </div>
              <div>
                <div style={{ fontSize: 32, marginBottom: 16 }}>🚀</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, marginBottom: 8 }}>2. Instant Deployment</div>
                <div style={{ fontSize: 14, color: C.slate, lineHeight: 1.5 }}>Set target URLs, dwell times, and verification protocols. Go live instantly.</div>
              </div>
              <div>
                <div style={{ fontSize: 32, marginBottom: 16 }}>📊</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, marginBottom: 8 }}>3. Real-Time Audit</div>
                <div style={{ fontSize: 14, color: C.slate, lineHeight: 1.5 }}>Monitor fulfillment and manually approve premium UGC submissions.</div>
              </div>
            </div>
          </div>

          <div style={{ background: C.off, border: `1px solid ${C.line}`, borderRadius: 24, padding: 40 }}>
            <h3 className="heading" style={{ fontSize: 18, color: '#3d6600', marginBottom: 24, borderBottom: `1px solid ${C.line}`, paddingBottom: 16 }}>The Contributor Pipeline</h3>
            <div className="lp-grid-3">
              <div>
                <div style={{ fontSize: 32, marginBottom: 16 }}>🛡️</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, marginBottom: 8 }}>1. Pass Security</div>
                <div style={{ fontSize: 14, color: C.slate, lineHeight: 1.5 }}>Bind your payout account to verify your identity and unlock tasks.</div>
              </div>
              <div>
                <div style={{ fontSize: 32, marginBottom: 16 }}>▶️</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, marginBottom: 8 }}>2. Execute Tasks</div>
                <div style={{ fontSize: 14, color: C.slate, lineHeight: 1.5 }}>Watch videos, read blogs, or upload QA screenshots. Bypass our timers to earn points.</div>
              </div>
              <div>
                <div style={{ fontSize: 32, marginBottom: 16 }}>🏦</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: C.ink, marginBottom: 8 }}>3. Liquidate Yield</div>
                <div style={{ fontSize: 14, color: C.slate, lineHeight: 1.5 }}>Once you hit the threshold, withdraw points directly to your linked bank account.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST LAYER (Architecture) ── */}
      <section className="lp-section-pad" style={{ background: C.ink, color: C.white }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: C.lime, marginBottom: 12 }}>Military-Grade Architecture</div>
          <h2 className="lp-section-title heading" style={{ marginBottom: 16 }}>Proof of attention, built-in.</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>We do not sell bot traffic. We guarantee sustained human focus through strict, automated anti-cheat protocols. You only pay for verified engagement.</p>
        </div>
        <div className="lp-grid-3" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.darkLine}`, padding: 32, borderRadius: 16 }}>
            <div style={{ fontSize: 24, marginBottom: 16 }}>🏦</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 12 }}>Layer 3 KYC Financials</div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.6 }}>Every earner must permanently bind a verified payout institution to their account. Attempting to run a bot farm or multiple accounts instantly flags the network.</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.darkLine}`, padding: 32, borderRadius: 16 }}>
            <div style={{ fontSize: 24, marginBottom: 16 }}>🎯</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 12 }}>Pointer-Lock Technology</div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.6 }}>During video and ad-playback, native browser controls are hidden and the UI is locked. Skipping, scrubbing, or fast-forwarding triggers an automatic penalty reset.</p>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.darkLine}`, padding: 32, borderRadius: 16 }}>
            <div style={{ fontSize: 24, marginBottom: 16 }}>👁️</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.white, marginBottom: 12 }}>Visibility Assertions</div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.6 }}>If a contributor switches tabs or minimizes their browser to multitask, the verification timer is instantly severed. Guaranteed active screen time, not background noise.</p>
          </div>
        </div>
      </section>

      {/* ── DYNAMIC PRICING TOGGLE ── */}
      <section className="lp-section-pad" style={{ background: C.white }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: C.slate, marginBottom: 12 }}>Campaign Pricing</div>
          <h2 className="lp-section-title heading" style={{ color: C.ink, marginBottom: 16 }}>Predictable growth packages.</h2>
          <p style={{ color: C.slate, maxWidth: 500, margin: '0 auto', lineHeight: 1.6, marginBottom: 32 }}>Purchase secure campaign slots using traditional payment rails. We handle the point distributions.</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, background: C.off, padding: 6, borderRadius: 24, border: `1px solid ${C.line}`, marginBottom: 32 }}>
            <button onClick={() => setPricingMode('social')} style={{ background: pricingMode === 'social' ? C.ink : 'transparent', color: pricingMode === 'social' ? C.white : C.slate, border: 'none', padding: '10px 24px', borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" }}>YouTube & Social</button>
            <button onClick={() => setPricingMode('seo')} style={{ background: pricingMode === 'seo' ? C.ink : 'transparent', color: pricingMode === 'seo' ? C.white : C.slate, border: 'none', padding: '10px 24px', borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" }}>SEO Web Traffic</button>
            <button onClick={() => setPricingMode('qa')} style={{ background: pricingMode === 'qa' ? C.ink : 'transparent', color: pricingMode === 'qa' ? C.white : C.slate, border: 'none', padding: '10px 24px', borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" }}>App QA Testing</button>
            <button onClick={() => setPricingMode('ugc')} style={{ background: pricingMode === 'ugc' ? C.ink : 'transparent', color: pricingMode === 'ugc' ? C.white : C.slate, border: 'none', padding: '10px 24px', borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" }}>Authentic UGC</button>
          </div>

          {/* DYNAMIC SERVICE EXPLAINER BOX */}
          <div style={{ maxWidth: 800, margin: '0 auto 40px', padding: 24, background: C.ink, borderRadius: 16, border: `1px solid ${C.darkLine}`, color: C.white, textAlign: 'left', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 24 }}>{serviceDetails[pricingMode].icon}</div>
            <div>
               <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: C.lime }}>{serviceDetails[pricingMode].title}</div>
               <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{serviceDetails[pricingMode].desc}</div>
            </div>
          </div>

        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24, maxWidth: 1200, margin: '0 auto', alignItems: 'center' }}>
          {activePricing.map(function(plan, i) {
            return (
              <div key={i} style={{ background: plan.isPopular ? C.ink : C.white, color: plan.isPopular ? C.white : C.ink, border: `1px solid ${plan.isPopular ? C.ink : C.line}`, borderRadius: 16, padding: plan.isPopular ? '48px 32px' : '32px', boxShadow: plan.isPopular ? '0 20px 40px rgba(0,0,0,0.1)' : 'none', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {plan.isPopular && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: C.lime, color: C.ink, fontSize: 11, fontWeight: 700, padding: '6px 16px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: 1 }}>Best Value</div>}
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{plan.name}</div>
                <div className="heading" style={{ fontSize: 40, color: plan.isPopular ? C.lime : C.ink, marginBottom: 8 }}>{plan.price}</div>
                <div style={{ fontSize: 14, fontWeight: 600, paddingBottom: 24, borderBottom: `1px solid ${plan.isPopular ? C.darkLine : C.line}`, marginBottom: 24 }}>{plan.slots.toLocaleString()} {unitLabel}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 14, flexGrow: 1 }}>
                  {plan.features.map(function(feat, idx) {
                    return <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: plan.isPopular ? 'rgba(255,255,255,0.7)' : C.slate, fontWeight: 500 }}><span style={{ color: plan.isPopular ? C.lime : C.ink, fontWeight: 'bold' }}>✓</span> {feat}</li>;
                  })}
                </ul>
                <button style={{ background: plan.isPopular ? C.lime : C.ink, color: plan.isPopular ? C.ink : C.white, border: 'none', borderRadius: 6, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%', fontFamily: "'DM Sans', sans-serif" }} onClick={goRegisterCreator}>Deploy Campaign</button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="lp-section-pad" style={{ background: C.off }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 className="heading" style={{ fontSize: 28, color: C.ink, marginBottom: 12 }}>Platform Architecture & FAQs</h2>
            <p style={{ color: C.slate, fontSize: 14 }}>Built for transparency and absolute fairness.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map(function(faq, i) {
              const isOpen = openFaq === i;
              return (
                <div key={i} style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 8, overflow: 'hidden' }}>
                  <button onClick={function() { toggleFaq(i); }} style={{ width: '100%', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: C.ink, textAlign: 'left' }}>
                    {faq.q}
                    <span style={{ color: C.slate, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                  </button>
                  {isOpen && <div style={{ padding: '0 20px 20px', color: C.slate, fontSize: 14, lineHeight: 1.6 }}>{faq.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🔥 PUBLIC SUPPORT BLOCK 🔥 */}
      <div style={{ background: C.ink, padding: '80px 5%', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: C.white, fontFamily: "'DM Sans', sans-serif", marginBottom: 16, letterSpacing: '-0.5px' }}>Need Assistance?</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginBottom: 40, lineHeight: 1.6 }}>
            For partnership inquiries, deployment issues, or general questions, bypass the bots and reach our core team directly.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:support@taskivo.online" style={{ background: C.lime, color: C.ink, textDecoration: 'none', padding: '14px 28px', borderRadius: 8, fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", transition: 'opacity 0.2s' }}>
              ✉️ Email Support
            </a>
            <a href="https://twitter.com/taskivo" target="_blank" rel="noreferrer" style={{ background: 'transparent', border: `1px solid ${C.darkLine}`, color: C.white, textDecoration: 'none', padding: '14px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", transition: 'background 0.2s' }}>
              Follow on X
            </a>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ background: C.white, borderTop: `1px solid ${C.line}`, padding: '64px 5% 32px' }}>
        <div className="lp-footer-grid" style={{ maxWidth: 1100, margin: '0 auto', marginBottom: 48 }}>
          <div className="lp-footer-brand-span">
            <div className="heading" style={{ color: C.ink, fontSize: 22, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: C.lime, display: 'inline-block' }}></span>Taskivo</div>
            <p style={{ color: C.slate, fontSize: 14, lineHeight: 1.6, maxWidth: 300, marginBottom: 24 }}>A modern omnichannel engagement infrastructure bridging global businesses with a distributed contributor network.</p>
            <div style={{ fontSize: 13, color: C.ink, fontWeight: 700 }}>support@taskivo.online</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.ink, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>Product</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <li><span style={{ color: C.slate, cursor: "pointer", fontSize: 14 }} onClick={goRegisterEarner}>For Contributors</span></li>
              <li><span style={{ color: C.slate, cursor: "pointer", fontSize: 14 }} onClick={goRegisterCreator}>For Businesses</span></li>
            </ul>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.ink, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>Company</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <li><span style={{ color: C.slate, cursor: "pointer", fontSize: 14 }} onClick={function() { navigate("about"); }}>About Us</span></li>
              <li><span style={{ color: C.slate, cursor: "pointer", fontSize: 14 }} onClick={function() { navigate("blog"); }}>Intelligence Blog</span></li>
            </ul>
          </div><div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.ink, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>Legal</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <li><span style={{ color: C.slate, cursor: "pointer", fontSize: 14 }} onClick={function() { navigate("terms"); }}>Terms of Service</span></li>
              <li><span style={{ color: C.slate, cursor: "pointer", fontSize: 14 }} onClick={function() { navigate("privacy"); }}>Privacy Policy</span></li>
              <li><span style={{ color: C.slate, cursor: "pointer", fontSize: 14 }} onClick={function() { navigate("disclaimer"); }}>Legal Disclaimer</span></li>
            </ul>
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${C.line}`, paddingTop: 24, color: C.slate, fontSize: 13, flexWrap: 'wrap', gap: 16 }}>
          <div>© {new Date().getFullYear()} Taskivo. All rights reserved. B2B Beta Platform.</div>
          <div style={{ display: 'flex', gap: 16 }}><span>Built for verifiable engagement.</span></div>
        </div>
      </footer>
    </div>
  );
}
