import { useEffect } from 'react';

const C = {
  ink: '#0D0D14',
  lime: '#A8FF3E',
  limeDim: 'rgba(168,255,62,0.12)',
  limeBorder: 'rgba(168,255,62,0.2)',
  white: '#ffffff',
  off: '#F7F8FA',
  slate: '#6B7280',
  line: '#EBEBEB',
};

export default function Landing({ navigate }) {

  useEffect(function () {
    document.title = 'Taskivo — Complete Tasks. Get Paid.';
    
    // Add viewport meta tag for proper mobile scaling
    let viewport = document.querySelector('meta[name=viewport]');
    if (!viewport) {
      viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0';
      document.head.appendChild(viewport);
    }
  }, []);

  // Single style injection - simplified for mobile
  useEffect(function () {
    if (document.getElementById('taskivo-styles')) return;
    const style = document.createElement('style');
    style.id = 'taskivo-styles';
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      
      body {
        overflow-x: hidden;
        width: 100%;
      }
      
      /* MOBILE FIRST - ALL STYLES FOR SMALL SCREENS */
      .lp-hero-title { 
        font-size: 32px !important; 
        letter-spacing: -1px !important; 
        line-height: 1.1 !important; 
      }
      .lp-hero-pad { 
        padding: 48px 16px 40px 16px !important; 
      }
      .lp-hero-sub { 
        font-size: 14px !important; 
        margin: 20px auto !important; 
        max-width: 90% !important;
      }
      .lp-hero-actions-mb { 
        margin-bottom: 32px !important; 
        display: flex !important;
        flex-direction: column !important;
        gap: 10px !important;
        align-items: center !important;
      }
      .lp-btn-hero { 
        padding: 10px 20px !important; 
        font-size: 13px !important; 
        min-width: 160px !important;
      }
      .lp-stat-num { 
        font-size: 18px !important; 
        letter-spacing: -0.5px !important; 
      }
      .lp-stat-label { 
        font-size: 9px !important; 
      }
      .lp-stat-pad { 
        padding: 0 8px !important; 
      }
      
      .lp-section-pad { 
        padding: 48px 16px !important; 
      }
      .lp-section-title { 
        font-size: 24px !important; 
        letter-spacing: -0.5px !important; 
      }
      .lp-section-sub { 
        font-size: 13px !important; 
        margin-bottom: 24px !important; 
      }
      
      .lp-audience-grid { 
        grid-template-columns: 1fr !important; 
        gap: 16px !important;
      }
      .lp-audience-card-pad { 
        padding: 20px 16px !important; 
      }
      .lp-audience-title { 
        font-size: 18px !important; 
        letter-spacing: -0.3px !important; 
      }
      .lp-audience-desc { 
        font-size: 13px !important; 
        margin-bottom: 16px !important; 
      }
      .lp-step-text { 
        font-size: 12px !important; 
      }
      .lp-audience-btn { 
        font-size: 12px !important; 
        padding: 10px 16px !important; 
      }
      
      .lp-features-grid { 
        grid-template-columns: 1fr !important; 
        gap: 12px !important; 
      }
      .lp-feature-card-pad { 
        padding: 16px 14px !important; 
      }
      .lp-feature-name { 
        font-size: 14px !important; 
      }
      .lp-feature-desc { 
        font-size: 12px !important; 
      }
      
      .lp-proof-grid { 
        grid-template-columns: 1fr !important; 
        gap: 12px !important; 
      }
      .lp-proof-card-pad { 
        padding: 16px !important; 
      }
      .lp-proof-text { 
        font-size: 12px !important; 
      }
      
      .lp-cta-pad { 
        padding: 48px 16px !important; 
      }
      .lp-cta-title { 
        font-size: 28px !important; 
        letter-spacing: -0.5px !important; 
      }
      .lp-cta-sub { 
        font-size: 13px !important; 
      }
      .lp-trust-row { 
        margin-top: 20px !important; 
        gap: 16px !important; 
        flex-wrap: wrap !important;
      }
      
      .lp-footer-pad { 
        padding: 40px 16px 24px 16px !important; 
      }
      .lp-footer-grid { 
        grid-template-columns: 1fr 1fr !important; 
        gap: 28px !important; 
      }
      .lp-footer-brand-span { 
        grid-column: 1 / -1 !important; 
      }
      
      .lp-nav-height { 
        height: 56px !important; 
      }
      .lp-nav-pad { 
        padding: 0 16px !important; 
      }
      .lp-nav-brand { 
        font-size: 18px !important; 
      }
      .lp-nav-btn-ghost { 
        font-size: 12px !important; 
        padding: 6px 12px !important; 
      }
      .lp-nav-btn-primary { 
        font-size: 12px !important; 
        padding: 7px 14px !important; 
      }
      
      /* Tablet styles */
      @media (min-width: 600px) {
        .lp-hero-title { font-size: 44px !important; }
        .lp-hero-pad { padding: 60px 24px 50px 24px !important; }
        .lp-hero-actions-mb { flex-direction: row !important; justify-content: center !important; }
        .lp-features-grid { grid-template-columns: repeat(2, 1fr) !important; }
        .lp-section-pad { padding: 60px 24px !important; }
        .lp-section-title { font-size: 32px !important; }
      }
      
      /* Desktop styles */
      @media (min-width: 1024px) {
        .lp-hero-title { font-size: 56px !important; }
        .lp-hero-pad { padding: 88px 5% 72px !important; }
        .lp-features-grid { grid-template-columns: repeat(3, 1fr) !important; }
        .lp-audience-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 2px !important; }
        .lp-proof-grid { grid-template-columns: repeat(2, 1fr) !important; }
        .lp-footer-grid { grid-template-columns: 1.5fr 1fr 1fr 1fr !important; }
        .lp-footer-brand-span { grid-column: auto !important; }
        .lp-section-title { font-size: 36px !important; }
        .lp-cta-title { font-size: 48px !important; }
      }
      
      /* Utility */
      .max-width-constrain {
        max-width: 680px;
        margin-left: auto;
        margin-right: auto;
      }
    `;
    document.head.appendChild(style);
  }, []);

  const features = [
    { icon: '⏱️', name: 'Timed Watch Sessions', desc: 'Earners must watch for a minimum duration before any action unlocks. Tab-switching pauses the timer.' },
    { icon: '🧠', name: 'Anti-Cheat Quiz', desc: 'After watching, earners answer a question set by the creator — proving they actually paid attention.' },
    { icon: '💸', name: 'Real Withdrawals', desc: 'Points convert to cash. Withdraw via PayPal, Paystack, or Flutterwave. Processed within 48 hours.' },
    { icon: '🌍', name: 'Global Earner Pool', desc: 'Earners from 30+ countries worldwide. Creators get diverse, international engagement.' },
    { icon: '📊', name: 'Creator Reports', desc: 'See exactly how many people watched, liked, commented, and subscribed — not vanity metrics.' },
    { icon: '🛡️', name: 'Admin Verified', desc: 'Every task and withdrawal is manually reviewed before going live. Zero tolerance for fraud.' },
  ];

  const testimonials = [
    { initials: 'JR', name: 'James R.', role: 'Earner — United States', text: '"I completed 12 tasks in my first week and withdrew straight to PayPal. The timer system makes it feel legitimate compared to other platforms."' },
    { initials: 'AO', name: 'Amaka O.', role: 'Earner — Nigeria', text: '"I\'ve already withdrawn three times via Paystack. The quiz makes it fair — only real viewers get paid."' },
    { initials: 'FK', name: 'Faith K.', role: 'Earner — Kenya', text: '"Tasks go live every day and the points add up fast. I love that I can do this from my phone during my lunch break."' },
    { initials: 'MC', name: 'Marcus C.', role: 'Creator — Canada', text: '"I tried other platforms and got bot views. With Taskivo every viewer answered my quiz correctly. That\'s actual watch time."' },
  ];

  const earnerSteps = [
    'Create a free account in under a minute',
    'Browse and pick available video tasks',
    'Watch, engage, and answer the quiz',
    'Withdraw earnings to your preferred method',
  ];

  const creatorSteps = [
    'Register and select Creator account type',
    'Choose a task package for your video',
    'Pay securely — task goes live within 24hrs',
    'Watch real engagement arrive on your video',
  ];

  return (
    <div style={{ 
      fontFamily: "'DM Sans', sans-serif", 
      background: C.off, 
      color: C.ink, 
      minHeight: '100vh', 
      width: '100%',
      overflowX: 'hidden',
    }}>

      {/* NAV */}
      <nav className="lp-nav-height lp-nav-pad" style={{
        position: 'sticky', top: 0, zIndex: 99,
        display: 'flex', alignItems: 'center',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${C.line}`,
        width: '100%',
      }}>
        <div className="lp-nav-brand" style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800, color: C.ink, flex: 1, letterSpacing: '-0.5px',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.lime, display: 'inline-block' }}></span>
          Taskivo
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button className="lp-nav-btn-ghost" style={{
            background: 'none', border: 'none', fontWeight: 500,
            color: C.slate, cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", borderRadius: 8,
          }} onClick={function () { navigate('auth'); }}>Log in</button>
          <button className="lp-nav-btn-primary" style={{
            background: C.ink, border: 'none',
            fontWeight: 600, color: C.lime, cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", borderRadius: 8,
          }} onClick={function () { navigate('auth'); }}>Get Started →</button>
        </div>
      </nav>

      {/* HERO */}
      <div className="lp-hero-pad" style={{ background: C.ink, position: 'relative', overflow: 'hidden', width: '100%' }}>
        <div style={{
          position: 'absolute', top: -120, left: '50%', transform: 'translateX(-50%)',
          width: 400, height: 400,
          background: 'radial-gradient(ellipse at center, rgba(168,255,62,0.08) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 680, margin: '0 auto', textAlign: 'center', padding: '0 8px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(168,255,62,0.08)',
            border: '1px solid rgba(168,255,62,0.18)',
            color: C.lime,
            fontSize: 10, fontWeight: 600,
            letterSpacing: '1.2px', textTransform: 'uppercase',
            padding: '4px 10px', borderRadius: 100, marginBottom: 20,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.lime, animation: 'pulse 2s infinite' }}></span>
            LIVE — TASKS AVAILABLE NOW
          </div>
          <h1 className="lp-hero-title" style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            color: C.white, marginBottom: 12,
          }}>
            Complete Tasks.<br />
            <span style={{ color: C.lime }}>Get Paid.</span><br />
            Grow Faster.
          </h1>
          <p className="lp-hero-sub" style={{
            lineHeight: 1.6, color: 'rgba(255,255,255,0.45)',
            maxWidth: 400, fontWeight: 400, margin: '0 auto',
          }}>
            The platform where earners complete real YouTube tasks and creators get genuine engagement. Simple. Transparent. Global.
          </p>
          <div className="lp-hero-actions-mb" style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', margin: '28px 0' }}>
            <button className="lp-btn-hero" style={{
              background: C.lime, color: C.ink, border: 'none', borderRadius: 10,
              fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }} onClick={function () { navigate('auth'); }}>Start Earning Free →</button>
            <button className="lp-btn-hero" style={{
              background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.75)',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10,
              fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }} onClick={function () { navigate('auth'); }}>I'm a Creator</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, flexWrap: 'wrap', gap: 8 }}>
            {[
              { num: '50K+', label: 'Active Earners' },
              { num: '2.1M', label: 'Points Awarded' },
              { num: '12K+', label: 'Tasks Done' },
              { num: '30+', label: 'Countries' },
            ].map(function (stat, i, arr) {
              return (
                <div key={i} className="lp-stat-pad" style={{
                  flex: 1, textAlign: 'center', minWidth: '70px',
                  borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                  <div className="lp-stat-num" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: C.white }}>{stat.num}</div>
                  <div className="lp-stat-label" style={{ color: 'rgba(255,255,255,0.3)', marginTop: 3, fontWeight: 400 }}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AUDIENCE - For Earners & For Creators */}
      <section className="lp-section-pad" style={{ background: C.white, width: '100%' }}>
        <div style={{ maxWidth: 480, marginBottom: 28, marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: C.lime, marginBottom: 8 }}>WHO IS TASKIVO FOR?</div>
          <h2 className="lp-section-title" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: C.ink, lineHeight: 1.2, marginBottom: 10 }}>Two sides.<br />One platform.</h2>
          <p className="lp-section-sub" style={{ color: C.slate, lineHeight: 1.6 }}>
            Whether you want to earn money completing tasks or grow your YouTube channel with verified engagement — Taskivo was built for you.
          </p>
        </div>
        <div className="lp-audience-grid" style={{ display: 'grid', gap: 16 }}>
          {[
            { tag: 'FOR EARNERS', title: 'Complete tasks.\nEarn real cash.', desc: 'Watch YouTube videos, complete simple actions, and withdraw real money. No experience needed. Works from any phone.', steps: earnerSteps, btn: 'Start Earning Free →' },
            { tag: 'FOR CREATORS', title: 'Real views.\nReal engagement.', desc: 'Get verified views, likes, and comments from real people. Every earner passes a quiz proving they actually watched.', steps: creatorSteps, btn: 'Post Your First Task →' },
          ].map(function (card, ci) {
            return (
              <div key={ci} className="lp-audience-card-pad" style={{ background: C.white, position: 'relative', border: `1px solid ${C.line}`, borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: C.lime }}></div>
                <span style={{ display: 'inline-block', background: C.limeDim, color: '#4a7a00', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '4px 10px', borderRadius: 6, marginBottom: 14 }}>{card.tag}</span>
                <div className="lp-audience-title" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: C.ink, marginBottom: 8, whiteSpace: 'pre-line' }}>{card.title}</div>
                <p className="lp-audience-desc" style={{ color: C.slate, lineHeight: 1.6 }}>{card.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 20 }}>
                  {card.steps.map(function (step, i) {
                    return (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                        <span style={{ width: 20, height: 20, borderRadius: '50%', background: C.ink, color: C.lime, fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                        <span className="lp-step-text" style={{ color: '#444', lineHeight: 1.5 }}>{step}</span>
                      </li>
                    );
                  })}
                </ul>
                <button className="lp-audience-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: C.ink, color: C.lime, border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }} onClick={function () { navigate('auth'); }}>{card.btn}</button>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURES */}
      <section className="lp-section-pad" style={{ background: C.off, width: '100%' }}>
        <div style={{ maxWidth: 680, marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: C.lime, marginBottom: 8 }}>PLATFORM FEATURES</div>
          <h2 className="lp-section-title" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: C.ink, lineHeight: 1.2, marginBottom: 10 }}>Built for trust.<br />Designed for scale.</h2>
          <p className="lp-section-sub" style={{ color: C.slate, lineHeight: 1.6 }}>Every feature exists to guarantee genuine engagement — not gaming the system.</p>
        </div>
        <div className="lp-features-grid" style={{ display: 'grid', gap: 12, maxWidth: 680, marginLeft: 'auto', marginRight: 'auto' }}>
          {features.map(function (f, i) {
            return (
              <div key={i} className="lp-feature-card-pad" style={{ background: C.white, borderRadius: 14, border: `1px solid ${C.line}` }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: C.limeDim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, marginBottom: 10 }}>{f.icon}</div>
                <div className="lp-feature-name" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: C.ink, marginBottom: 5 }}>{f.name}</div>
                <p className="lp-feature-desc" style={{ color: C.slate, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="lp-section-pad" style={{ background: C.ink, width: '100%' }}>
        <div style={{ maxWidth: 680, marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(168,255,62,0.5)', marginBottom: 8 }}>WHAT PEOPLE SAY</div>
          <h2 className="lp-section-title" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: C.white, lineHeight: 1.2, marginBottom: 10 }}>Trusted worldwide.</h2>
          <p className="lp-section-sub" style={{ color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>Real people. Real results. Real money.</p>
        </div>
        <div className="lp-proof-grid" style={{ display: 'grid', gap: 12, maxWidth: 680, marginLeft: 'auto', marginRight: 'auto' }}>
          {testimonials.map(function (t, i) {
            return (
              <div key={i} className="lp-proof-card-pad" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14 }}>
                <div style={{ color: C.lime, fontSize: 11, marginBottom: 10, letterSpacing: 2 }}>★★★★★</div>
                <p className="lp-proof-text" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 16, fontStyle: 'italic' }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.limeDim, border: `1px solid ${C.limeBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: C.lime, flexShrink: 0 }}>{t.initials}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.white }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 1 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="lp-cta-pad" style={{ background: C.white, borderTop: `1px solid ${C.line}`, textAlign: 'center', width: '100%' }}>
        <div style={{ maxWidth: 680, marginLeft: 'auto', marginRight: 'auto' }}>
          <div style={{ display: 'inline-block', background: C.limeDim, color: '#3d6600', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '5px 12px', borderRadius: 6, marginBottom: 18 }}>JOIN FREE TODAY</div>
          <h2 className="lp-cta-title" style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, color: C.ink, marginBottom: 12, lineHeight: 1.15 }}>
            Your next payout<br />is one task away.
          </h2>
          <p className="lp-cta-sub" style={{ color: C.slate, marginBottom: 28, maxWidth: 360, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Join thousands of earners already making money on Taskivo. Free to join. No skills required.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="lp-btn-hero" style={{ background: C.ink, color: C.lime, border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }} onClick={function () { navigate('auth'); }}>Start Earning Free →</button>
            <button className="lp-btn-hero" style={{ background: 'none', color: C.slate, border: `1px solid ${C.line}`, borderRadius: 10, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }} onClick={function () { navigate('auth'); }}>I'm a Creator</button>
          </div>
          <div className="lp-trust-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 24 }}>
            {['Free to join', 'Instant payouts', 'No experience needed'].map(function (item) {
              return (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.slate }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: C.limeDim, color: '#3d6600', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                  {item}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer-pad" style={{ background: C.ink, color: 'rgba(255,255,255,0.4)', width: '100%' }}>
        <div className="lp-footer-grid" style={{ display: 'grid', marginBottom: 36, maxWidth: 680, marginLeft: 'auto', marginRight: 'auto' }}>
          <div className="lp-footer-brand-span">
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 800, color: C.white, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.lime, display: 'inline-block' }}></span>
              Taskivo
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>The task completion platform connecting earners and creators worldwide.</p>
          </div>
          {[
            { title: 'PLATFORM', links: ['For Earners', 'For Creators', 'Pricing', 'Browse Tasks'] },
            { title: 'COMPANY', links: ['About', 'Blog', 'Contact', 'Careers'] },
            { title: 'LEGAL', links: ['Terms', 'Privacy', 'Cookies'] },
          ].map(function (col) {
            return (
              <div key={col.title}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 14 }}>{col.title}</div>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {col.links.map(function (link) {
                    return (
                      <li key={link} style={{ marginBottom: 10 }}>
                        <button style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer' }} onClick={function () { navigate('auth'); }}>{link}</button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, maxWidth: 680, marginLeft: 'auto', marginRight: 'auto' }}>
          <span style={{ fontSize: 12 }}>© 2025 Taskivo. All rights reserved.</span>
          <span style={{ fontSize: 12 }}>taskivo.online</span>
        </div>
      </footer>

    </div>
  );
}
