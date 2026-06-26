import { useEffect, useState } from 'react';

const C = {
  ink: '#0D0D14', lime: '#A8FF3E', limeDim: 'rgba(168,255,62,0.12)', limeBorder: 'rgba(168,255,62,0.2)',
  white: '#ffffff', off: '#F7F8FA', slate: '#6B7280', line: '#EBEBEB', darkLine: 'rgba(255,255,255,0.08)',
};

export default function Landing({ navigate, setAuthMode }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [pricingMode, setPricingMode] = useState('social'); // 'social', 'growth', 'seo', 'adsense', 'qa', 'ugc'

  // 🔥 METADATA & JSON-LD SCHEMA INJECTION 🔥
  useEffect(() => {
    document.title = 'Taskivo — Digital Engagement Infrastructure';
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = 'The world\'s most secure omnichannel engagement infrastructure. Connecting businesses with verified human attention.';

    const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "name": "Taskivo",
          "url": "https://taskivo.online",
          "logo": "https://taskivo.online/logo-512.png"
        },
        {
          "@type": "SoftwareApplication",
          "name": "Taskivo B2B Network",
          "operatingSystem": "Web Browser",
          "applicationCategory": "BusinessApplication",
          "offers": { "@type": "Offer", "price": "3.00", "priceCurrency": "USD" }
        }
      ]
    };

    const existingScript = document.getElementById('taskivo-schema');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = 'taskivo-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);
    
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

  // 🔥 NEW 60/40 PROFIT MARGIN PRICING TIERS 🔥
  const socialPricing = [
    { name: 'Basic Views', price: '$3', slots: 60, features: ['Guaranteed Video Views', 'Anti-Cheat Timers'] },
    { name: 'Starter Views', price: '$12', slots: 250, features: ['Guaranteed Video Views', 'Anti-Cheat Timers', 'Global Distribution'] },
    { name: 'Traction Views', price: '$35', slots: 750, features: ['Guaranteed Video Views', 'Anti-Cheat Timers', 'Priority Routing'], isPopular: true },
    { name: 'Enterprise Views', price: '$99', slots: 2250, features: ['Dedicated Manager', 'Volume Discount Rate', 'Priority Routing'] },
  ];

  const growthPricing = [
    { name: 'Basic Growth', price: '$5', slots: 65, features: ['Real Human Accounts', 'Mandatory 1-Min Watch Rule', 'Zero Bot Drops'] },
    { name: 'Starter Growth', price: '$15', slots: 200, features: ['Real Human Accounts', 'Mandatory 1-Min Watch Rule', 'Zero Bot Drops'] },
    { name: 'Traction Growth', price: '$45', slots: 600, features: ['Real Human Accounts', 'Mandatory 1-Min Watch Rule', 'Priority Placement'], isPopular: true },
    { name: 'Enterprise Growth', price: '$120', slots: 1650, features: ['Dedicated Manager', 'Mandatory 1-Min Watch Rule', 'Maximum Velocity'] },
  ];

  const seoPricing = [
    { name: 'Basic Traffic', price: '$5', slots: 80, features: ['Standard Web Routing', 'Guaranteed Engagement'] },
    { name: 'Starter Traffic', price: '$15', slots: 250, features: ['Standard Web Routing', 'Guaranteed Engagement', 'Human Navigators'] },
    { name: 'Traction Traffic', price: '$45', slots: 800, features: ['Standard Web Routing', 'Guaranteed Engagement', 'Priority Routing'], isPopular: true },
    { name: 'Enterprise Traffic', price: '$120', slots: 2200, features: ['Volume Discount', 'Guaranteed Engagement', 'Dedicated Manager'] },
  ];

  const adsensePricing = [
    { name: 'Basic Arbitrage', price: '$6', slots: 80, features: ['Strict 2+ Min Dwell Time', 'Ad-Interaction Ready', 'Account Health Protection'] },
    { name: 'Starter Arbitrage', price: '$18', slots: 240, features: ['Strict 2+ Min Dwell Time', 'Ad-Interaction Ready', 'Account Health Protection'] },
    { name: 'Traction Arbitrage', price: '$50', slots: 660, features: ['Strict 2+ Min Dwell Time', 'Ad-Interaction Ready', 'Premium Traffic Routing'], isPopular: true },
    { name: 'Scale Arbitrage', price: '$135', slots: 1800, features: ['Strict 2+ Min Dwell Time', 'Volume Traffic Injection', 'Dedicated Manager'] },
  ];

  const qaPricing = [
    { name: 'Starter QA', price: '$15', slots: 30, features: ['Real Human Testers', 'Manual Bug Reports', 'Verified Screenshots'] },
    { name: 'Scale QA', price: '$45', slots: 100, features: ['Real Human Testers', 'Manual Bug Reports', 'Priority Placement'], isPopular: true },
  ];

  const ugcPricing = [
    { name: 'Starter UGC', price: '$45', slots: 15, features: ['Authentic Creator Videos', 'Full Usage Rights', 'Manual Verification Escrow'] },
    { name: 'Scale UGC', price: '$120', slots: 45, features: ['Authentic Creator Videos', 'Full Usage Rights', 'Priority Placement'], isPopular: true },
  ];

  const activePricing = pricingMode === 'social' ? socialPricing : 
                        pricingMode === 'growth' ? growthPricing : 
                        pricingMode === 'seo' ? seoPricing : 
                        pricingMode === 'adsense' ? adsensePricing : 
                        pricingMode === 'qa' ? qaPricing : ugcPricing;
  
  const unitLabel = (pricingMode === 'qa' || pricingMode === 'ugc') ? 'Submissions' : 
                    (pricingMode === 'growth') ? 'Subscribers/Followers' : 'Verified Engagements';

  const serviceDetails = {
    social: { title: 'YouTube & Social Views', icon: '▶️', desc: 'Boost algorithmic reach. Real humans watch and engage with your content. Every view is verified by our strict anti-cheat timers to ensure zero drop-offs.' },
    growth: { title: 'Audience Growth (Subs & Follows)', icon: '👥', desc: 'Build a permanent follower base. To prevent algorithms from flagging spam, our earners are strictly required to watch 1+ minutes of your content before hitting subscribe or follow.' },
    seo: { title: 'Standard SEO Traffic', icon: '🔍', desc: 'Dominate search engine rankings. Our network navigates to your blog or website, reducing bounce rates and signaling high search relevance to Google.' },
    adsense: { title: 'AdSense & Arbitrage Traffic', icon: '💰', desc: 'High-tier traffic specifically engineered for AdSense Arbitrage. Strict 2+ minute dwell times and ad-interaction compliance to keep your Google ad accounts perfectly healthy.' },
    qa: { title: 'App QA Testing', icon: '🐛', desc: 'Crowdsourced bug hunting. Deploy real users to download your app, test features, and upload manual feedback screenshots before your official launch.' },
    ugc: { title: 'Authentic UGC Videos', icon: '🤳', desc: 'Commission real people to record authentic, selfie-style video testimonials or product demos. You get full commercial rights to use them in your ad campaigns.' }
  };

  const faqs = [
    { q: 'Who is Taskivo?', a: 'Taskivo is a global attention network bridging the gap between enterprise marketing and distributed human contributors. We provide a secure infrastructure for real people to monetize their digital footprint while helping businesses grow.' },
    { q: 'How do Earners get paid? Is there a high threshold?', a: 'Unlike other platforms, Taskivo offers Day-One Liquidity. Earners can cash out their first ₦100 as soon as they hit just 100 Points. This takes as few as 3-4 tasks. Withdrawals are processed instantly via Paystack directly to your local bank account.' },
    { q: 'What is the difference between Standard SEO and AdSense Arbitrage tasks?', a: 'Standard SEO tasks (30 PTS) focus on search visibility. AdSense Arbitrage tasks reward earners with higher pay (40 PTS) because they require strict 2+ minute dwell times and ad-interaction compliance to protect the Creator’s Google AdSense account health.' },
    { q: 'How does the Audience Growth package guarantee permanent subscribers?', a: 'If a user just clicks "Subscribe" without watching, YouTube deletes it as spam. Our system forces Earners to watch your content for a minimum of 1 minute before subscribing. This costs slightly more, but guarantees permanent, algorithm-friendly followers.' },
    { q: 'What are Internal Blog Tasks?', a: 'To keep our community engaged while waiting for new Creator campaigns, Taskivo injects its own liquidity to fund "Internal Blog Tasks." Earners get a quick 5 PTS booster just for reading official platform updates.' },
    { q: 'How does Taskivo prevent bot traffic?', a: 'We utilize Layer 3 Financial Verification. Every contributor must bind a real bank account to their identity. We pair this with strict pointer-lock technology and tab-switch detection.' }
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

      {/* ── PLATFORM GUARANTEES ── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 64, flexWrap: 'wrap', padding: '64px 5%', background: C.ink, borderBottom: `1px solid ${C.darkLine}` }}>
          <div style={{ textAlign: 'center', maxWidth: 200 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🛡️</div>
            <div className="heading" style={{ fontSize: 20, color: C.lime, marginBottom: 8 }}>0% Bot Tolerance</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>Our pointer-lock technology ensures every single engagement is from a verified human.</div>
          </div>
          <div style={{ textAlign: 'center', maxWidth: 200 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
            <div className="heading" style={{ fontSize: 20, color: C.lime, marginBottom: 8 }}>Day-One Liquidity</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>Contributors cash out instantly via Paystack at an industry-low 100-point threshold.</div>
          </div>
          <div style={{ textAlign: 'center', maxWidth: 200 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🤝</div>
            <div className="heading" style={{ fontSize: 20, color: C.lime, marginBottom: 8 }}>Escrow Protection</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>For premium manual tasks, funds are locked until the Creator explicitly approves the work.</div>
          </div>
      </div>

      {/* ── VALUE PROP SECTION ── */}
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
                <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.slate, fontSize: 15 }}><span style={{ color: C.ink, fontWeight: 'bold' }}>✓</span> Protect AdSense Arbitrage health</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.slate, fontSize: 15 }}><span style={{ color: C.ink, fontWeight: 'bold' }}>✓</span> Grow permanent, 1-min verified audiences</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.slate, fontSize: 15 }}><span style={{ color: C.ink, fontWeight: 'bold' }}>✓</span> Commission authentic UGC videos</li>
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
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: 12, color: C.slate, fontSize: 15 }}><span style={{ color: C.lime, fontWeight: 'bold' }}>●</span> <span style={{flex: 1}}><strong>Micro-thresholds:</strong> Cash out your first ₦100 at just 100 points. Day-one liquidity guaranteed.</span></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.slate, fontSize: 15 }}><span style={{ color: C.lime, fontWeight: 'bold' }}>●</span> Execute verifiable micro-tasks daily</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.slate, fontSize: 15 }}><span style={{ color: C.lime, fontWeight: 'bold' }}>●</span> Withdraw directly to local bank accounts</li>
              </ul>
              <button style={{ background: C.lime, color: C.ink, border: 'none', borderRadius: 6, padding: '12px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%' }} onClick={goRegisterEarner}>Access Earner Dashboard</button>
            </div>
          </div>

        </div>
      </section>

      {/* ── DYNAMIC PRICING TOGGLE ── */}
      <section className="lp-section-pad" style={{ background: C.white }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: C.slate, marginBottom: 12 }}>Campaign Pricing</div>
          <h2 className="lp-section-title heading" style={{ color: C.ink, marginBottom: 16 }}>Predictable growth packages.</h2>
          <p style={{ color: C.slate, maxWidth: 500, margin: '0 auto', lineHeight: 1.6, marginBottom: 32 }}>Purchase secure campaign slots using traditional payment rails. We handle the point distributions and maintain strict 60/40 ecosystem equilibrium.</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, background: C.off, padding: 6, borderRadius: 24, border: `1px solid ${C.line}`, marginBottom: 32, maxWidth: 800, margin: '0 auto 32px' }}>
            <button onClick={() => setPricingMode('social')} style={{ background: pricingMode === 'social' ? C.ink : 'transparent', color: pricingMode === 'social' ? C.white : C.slate, border: 'none', padding: '10px 18px', borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" }}>Social Views</button>
            <button onClick={() => setPricingMode('growth')} style={{ background: pricingMode === 'growth' ? C.ink : 'transparent', color: pricingMode === 'growth' ? C.white : C.slate, border: 'none', padding: '10px 18px', borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" }}>Audience Growth</button>
            <button onClick={() => setPricingMode('seo')} style={{ background: pricingMode === 'seo' ? C.ink : 'transparent', color: pricingMode === 'seo' ? C.white : C.slate, border: 'none', padding: '10px 18px', borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" }}>Standard SEO</button>
            <button onClick={() => setPricingMode('adsense')} style={{ background: pricingMode === 'adsense' ? C.ink : 'transparent', color: pricingMode === 'adsense' ? C.white : C.slate, border: 'none', padding: '10px 18px', borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" }}>AdSense Arbitrage</button>
            <button onClick={() => setPricingMode('qa')} style={{ background: pricingMode === 'qa' ? C.ink : 'transparent', color: pricingMode === 'qa' ? C.white : C.slate, border: 'none', padding: '10px 18px', borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" }}>QA Testing</button>
            <button onClick={() => setPricingMode('ugc')} style={{ background: pricingMode === 'ugc' ? C.ink : 'transparent', color: pricingMode === 'ugc' ? C.white : C.slate, border: 'none', padding: '10px 18px', borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" }}>UGC Videos</button>
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
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 className="heading" style={{ fontSize: 28, color: C.ink, marginBottom: 12 }}>Platform Architecture & FAQs</h2>
            <p style={{ color: C.slate, fontSize: 14 }}>Built for transparency and absolute fairness.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map(function(faq, i) {
              const isOpen = openFaq === i;
              return (
                <div key={i} style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 8, overflow: 'hidden' }}>
                  <button onClick={function() { toggleFaq(i); }} style={{ width: '100%', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: C.ink, textAlign: 'left', gap: 16 }}>
                    <span>{faq.q}</span>
                    <span style={{ color: C.slate, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', marginTop: 2 }}>▼</span>
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
          <div>© {new Date().getFullYear()} Taskivo. All rights reserved. B2B Platform.</div>
          <div style={{ display: 'flex', gap: 16 }}><span>Built for verifiable engagement.</span></div>
        </div>
      </footer>
    </div>
  );
}
