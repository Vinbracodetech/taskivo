import { useEffect, useState } from 'react';

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

  const [badgePulse, setBadgePulse] = useState(true);

  useEffect(function() {
    document.title = 'Taskivo — Complete Tasks. Get Paid.';
  }, []);

  // ── Styles ──────────────────────────────────────────

  const s = {
    body: {
      fontFamily: "'DM Sans', sans-serif",
      background: C.off,
      color: C.ink,
      minHeight: '100vh',
      WebkitFontSmoothing: 'antialiased',
    },

    // NAV
    nav: {
      position: 'sticky', top: 0, zIndex: 99,
      height: 64,
      display: 'flex', alignItems: 'center',
      padding: '0 5%',
      background: 'rgba(255,255,255,0.9)',
      backdropFilter: 'blur(16px)',
      borderBottom: `1px solid ${C.line}`,
    },
    navBrand: {
      fontFamily: "'Syne', sans-serif",
      fontSize: 19, fontWeight: 800,
      color: C.ink, flex: 1,
      letterSpacing: '-0.5px',
      display: 'flex', alignItems: 'center', gap: 6,
    },
    navDot: {
      width: 8, height: 8, borderRadius: '50%',
      background: C.lime, display: 'inline-block',
    },
    navBtns: { display: 'flex', gap: 8, alignItems: 'center' },
    btnGhostNav: {
      padding: '7px 16px',
      background: 'none', border: 'none',
      fontSize: 13, fontWeight: 500,
      color: C.slate, cursor: 'pointer',
      fontFamily: "'DM Sans', sans-serif",
      borderRadius: 8,
    },
    btnNavPrimary: {
      padding: '8px 18px',
      background: C.ink, border: 'none',
      fontSize: 13, fontWeight: 600,
      color: C.lime, cursor: 'pointer',
      fontFamily: "'DM Sans', sans-serif",
      borderRadius: 8, letterSpacing: '-0.2px',
    },

    // HERO
    hero: {
      background: C.ink,
      padding: '96px 5% 80px',
      position: 'relative', overflow: 'hidden',
    },
    heroGlow: {
      position: 'absolute', top: -120, left: '50%',
      transform: 'translateX(-50%)',
      width: 700, height: 500,
      background: 'radial-gradient(ellipse at center, rgba(168,255,62,0.08) 0%, transparent 65%)',
      pointerEvents: 'none',
    },
    heroInner: {
      position: 'relative', zIndex: 2,
      maxWidth: 680, margin: '0 auto',
      textAlign: 'center',
    },
    heroBadge: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: 'rgba(168,255,62,0.08)',
      border: '1px solid rgba(168,255,62,0.18)',
      color: 'rgba(168,255,62,0.8)',
      fontSize: 11, fontWeight: 600,
      letterSpacing: '1.2px', textTransform: 'uppercase',
      padding: '6px 14px', borderRadius: 100,
      marginBottom: 32,
    },
    heroBadgeDot: {
      width: 5, height: 5, borderRadius: '50%',
      background: C.lime,
      animation: 'pulse 2s infinite',
    },
    heroTitle: {
      fontFamily: "'Syne', sans-serif",
      fontSize: 'clamp(38px, 8vw, 68px)',
      fontWeight: 800, lineHeight: 1.05,
      letterSpacing: '-2px', color: C.white,
      marginBottom: 20,
    },
    heroTitleEm: { fontStyle: 'normal', color: C.lime },
    heroSub: {
      fontSize: 16, lineHeight: 1.75,
      color: 'rgba(255,255,255,0.45)',
      maxWidth: 420, margin: '0 auto 40px',
      fontWeight: 400,
    },
    heroActions: {
      display: 'flex', gap: 10,
      justifyContent: 'center', flexWrap: 'wrap',
      marginBottom: 64,
    },
    btnHeroPrimary: {
      padding: '13px 26px',
      background: C.lime, color: C.ink,
      border: 'none', borderRadius: 10,
      fontSize: 14, fontWeight: 700,
      cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
      letterSpacing: '-0.2px',
    },
    btnHeroGhost: {
      padding: '13px 26px',
      background: 'rgba(255,255,255,0.06)',
      color: 'rgba(255,255,255,0.75)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 10,
      fontSize: 14, fontWeight: 500,
      cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
    },
    heroStats: {
      display: 'flex', justifyContent: 'center',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      paddingTop: 40,
    },
    heroStat: {
      flex: 1, maxWidth: 140,
      textAlign: 'center', padding: '0 16px',
      borderRight: '1px solid rgba(255,255,255,0.06)',
    },
    heroStatLast: {
      flex: 1, maxWidth: 140,
      textAlign: 'center', padding: '0 16px',
    },
    heroStatNum: {
      fontFamily: "'Syne', sans-serif",
      fontSize: 26, fontWeight: 800,
      color: C.white, letterSpacing: '-1px',
    },
    heroStatLabel: {
      fontSize: 11, color: 'rgba(255,255,255,0.3)',
      marginTop: 3, fontWeight: 400,
    },

    // SECTION SHARED
    section: { padding: '88px 5%' },
    sectionLabel: {
      fontSize: 11, fontWeight: 600,
      letterSpacing: 2, textTransform: 'uppercase',
      color: C.lime, marginBottom: 10,
    },
    sectionTitle: {
      fontFamily: "'Syne', sans-serif",
      fontSize: 'clamp(26px, 4vw, 38px)',
      fontWeight: 800, letterSpacing: '-1px',
      color: C.ink, lineHeight: 1.1,
      marginBottom: 12,
    },
    sectionSub: {
      fontSize: 15, color: C.slate,
      lineHeight: 1.7, maxWidth: 440,
      marginBottom: 52,
    },

    // AUDIENCE
    audienceSection: { padding: '88px 5%', background: C.white },
    audienceGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: 2, background: C.line,
      borderRadius: 20, overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
    },
    audienceCard: {
      background: C.white, padding: '40px 36px',
      position: 'relative',
    },
    audienceCardBar: {
      position: 'absolute', top: 0, left: 0, right: 0,
      height: 2, background: C.lime,
    },
    audienceTag: {
      display: 'inline-block',
      background: C.limeDim,
      color: '#4a7a00', fontSize: 11,
      fontWeight: 700, letterSpacing: 1,
      textTransform: 'uppercase', padding: '4px 10px',
      borderRadius: 6, marginBottom: 20,
    },
    audienceTitle: {
      fontFamily: "'Syne', sans-serif",
      fontSize: 22, fontWeight: 800,
      color: C.ink, marginBottom: 10,
      letterSpacing: '-0.5px',
    },
    audienceDesc: {
      fontSize: 14, color: C.slate,
      lineHeight: 1.7, marginBottom: 28,
    },
    stepList: { listStyle: 'none', marginBottom: 28, padding: 0 },
    stepItem: {
      display: 'flex', alignItems: 'flex-start',
      gap: 10, marginBottom: 12,
    },
    stepNum: {
      width: 20, height: 20, borderRadius: '50%',
      background: C.ink, color: C.lime,
      fontSize: 10, fontWeight: 800,
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0,
      marginTop: 1,
    },
    stepText: { fontSize: 13, color: '#444', lineHeight: 1.55 },
    audienceBtn: {
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '11px 20px',
      background: C.ink, color: C.lime,
      border: 'none', borderRadius: 8,
      fontSize: 13, fontWeight: 600,
      cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
    },

    // FEATURES
    featuresSection: { padding: '88px 5%', background: C.off },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: 12,
    },
    featureCard: {
      background: C.white, borderRadius: 14,
      padding: '28px 24px',
      border: `1px solid ${C.line}`,
    },
    featureIconWrap: {
      width: 40, height: 40, borderRadius: 10,
      background: C.limeDim,
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: 18,
      marginBottom: 16,
    },
    featureName: {
      fontFamily: "'Syne', sans-serif",
      fontSize: 15, fontWeight: 700,
      color: C.ink, marginBottom: 6,
      letterSpacing: '-0.3px',
    },
    featureDesc: {
      fontSize: 13, color: C.slate, lineHeight: 1.65,
    },

    // PROOF
    proofSection: { padding: '88px 5%', background: C.ink },
    proofSectionLabel: {
      fontSize: 11, fontWeight: 600,
      letterSpacing: 2, textTransform: 'uppercase',
      color: 'rgba(168,255,62,0.5)', marginBottom: 10,
    },
    proofSectionTitle: {
      fontFamily: "'Syne', sans-serif",
      fontSize: 'clamp(26px, 4vw, 38px)',
      fontWeight: 800, letterSpacing: '-1px',
      color: C.white, lineHeight: 1.1, marginBottom: 12,
    },
    proofSectionSub: {
      fontSize: 15, color: 'rgba(255,255,255,0.4)',
      lineHeight: 1.7, maxWidth: 440, marginBottom: 52,
    },
    proofGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: 12,
    },
    proofCard: {
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14, padding: 24,
    },
    proofStars: { color: C.lime, fontSize: 12, marginBottom: 12, letterSpacing: 2 },
    proofText: {
      fontSize: 13, color: 'rgba(255,255,255,0.6)',
      lineHeight: 1.75, marginBottom: 18, fontStyle: 'italic',
    },
    proofAuthor: { display: 'flex', alignItems: 'center', gap: 10 },
    proofAvatar: {
      width: 32, height: 32, borderRadius: '50%',
      background: C.limeDim,
      border: `1px solid ${C.limeBorder}`,
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontSize: 12,
      fontWeight: 700, color: C.lime, flexShrink: 0,
    },
    proofName: { fontSize: 13, fontWeight: 600, color: C.white },
    proofRole: { fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 1 },

    // CTA
    ctaSection: {
      background: C.white,
      borderTop: `1px solid ${C.line}`,
      padding: '100px 5%', textAlign: 'center',
    },
    ctaBadge: {
      display: 'inline-block',
      background: C.limeDim,
      color: '#3d6600', fontSize: 11,
      fontWeight: 700, letterSpacing: 1,
      textTransform: 'uppercase', padding: '5px 12px',
      borderRadius: 6, marginBottom: 24,
    },
    ctaTitle: {
      fontFamily: "'Syne', sans-serif",
      fontSize: 'clamp(30px, 5vw, 52px)',
      fontWeight: 800, letterSpacing: '-1.5px',
      color: C.ink, marginBottom: 14, lineHeight: 1.05,
    },
    ctaTitleEm: {
      fontStyle: 'normal', color: C.lime,
      textDecoration: 'underline',
      textDecorationColor: 'rgba(168,255,62,0.4)',
    },
    ctaSub: {
      fontSize: 15, color: C.slate,
      marginBottom: 36, maxWidth: 380,
      marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7,
    },
    ctaBtns: { display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' },
    btnCtaPrimary: {
      padding: '14px 28px',
      background: C.ink, color: C.lime,
      border: 'none', borderRadius: 10,
      fontSize: 14, fontWeight: 700,
      cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
    },
    btnCtaGhost: {
      padding: '14px 28px',
      background: 'none', color: C.slate,
      border: `1px solid ${C.line}`,
      borderRadius: 10, fontSize: 14, fontWeight: 500,
      cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
    },
    ctaTrust: {
      marginTop: 24, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      gap: 20, flexWrap: 'wrap',
    },
    trustItem: {
      display: 'flex', alignItems: 'center', gap: 6,
      fontSize: 12, color: C.slate,
    },
    trustCheck: {
      width: 16, height: 16, borderRadius: '50%',
      background: C.limeDim, color: '#3d6600',
      fontSize: 9, fontWeight: 800,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    },

    // FOOTER
    footer: {
      background: C.ink, color: 'rgba(255,255,255,0.4)',
      padding: '56px 5% 28px',
    },
    footerTop: {
      display: 'grid',
      gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
      gap: 32, marginBottom: 48,
    },
    footerBrand: {
      fontFamily: "'Syne', sans-serif",
      fontSize: 18, fontWeight: 800,
      color: C.white, marginBottom: 10,
      display: 'flex', alignItems: 'center', gap: 6,
    },
    footerTagline: { fontSize: 13, lineHeight: 1.65 },
    footerColTitle: {
      fontSize: 11, fontWeight: 600,
      letterSpacing: '1.5px', textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.25)', marginBottom: 16,
    },
    footerLinks: { listStyle: 'none', padding: 0 },
    footerLink: {
      fontSize: 13, color: 'rgba(255,255,255,0.45)',
      textDecoration: 'none', display: 'block',
      marginBottom: 10,
    },
    footerBottom: {
      borderTop: '1px solid rgba(255,255,255,0.06)',
      paddingTop: 24,
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', flexWrap: 'wrap', gap: 8,
    },
    footerBottomText: { fontSize: 12 },
  };

  // ── Pulse keyframe injected once ──────────────────
  useEffect(function() {
    if (document.getElementById('taskivo-keyframes')) return;
    const style = document.createElement('style');
    style.id = 'taskivo-keyframes';
    style.textContent = `
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
    `;
    document.head.appendChild(style);
  }, []);

  // ── Data ─────────────────────────────────────────

  const features = [
    { icon: '⏱️', name: 'Timed Watch Sessions', desc: 'Earners must watch for a minimum duration before any action unlocks. Tab-switching pauses the timer automatically.' },
    { icon: '🧠', name: 'Anti-Cheat Quiz', desc: 'After watching, earners answer a question set by the creator — proving they actually paid attention.' },
    { icon: '💸', name: 'Real Withdrawals', desc: 'Points convert to cash. Withdraw via PayPal, Paystack, or Flutterwave. Processed within 48 hours.' },
    { icon: '🌍', name: 'Global Earner Pool', desc: 'Earners from 30+ countries worldwide. Creators get diverse, international engagement on their content.' },
    { icon: '📊', name: 'Creator Reports', desc: 'See exactly how many people watched, liked, commented, and subscribed — not vanity metrics.' },
    { icon: '🛡️', name: 'Admin Verified', desc: 'Every task and withdrawal is manually reviewed before going live or being paid out. Zero tolerance for fraud.' },
  ];

  const testimonials = [
    {
      initials: 'JR', name: 'James R.', role: 'Earner — United States',
      text: '"I completed 12 tasks in my first week and withdrew straight to PayPal. The timer system makes it feel legitimate compared to other platforms."',
    },
    {
      initials: 'AO', name: 'Amaka O.', role: 'Earner — Nigeria',
      text: '"I was skeptical at first but I\'ve already withdrawn three times via Paystack. The quiz makes it fair — only real viewers get paid."',
    },
    {
      initials: 'FK', name: 'Faith K.', role: 'Earner — Kenya',
      text: '"Tasks go live every day and the points add up fast. I love that I can do this from my phone during my lunch break."',
    },
    {
      initials: 'MC', name: 'Marcus C.', role: 'Creator — Canada',
      text: '"I tried other platforms and got bot views. With Taskivo every viewer answered my quiz correctly. That\'s actual watch time."',
    },
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

  // ── Render ────────────────────────────────────────

  return (
    <div style={s.body}>

      {/* ── NAV ── */}
      <nav style={s.nav}>
        <div style={s.navBrand}>
          <span style={s.navDot}></span>
          Taskivo
        </div>
        <div style={s.navBtns}>
          <button style={s.btnGhostNav} onClick={function() { navigate('auth'); }}>
            Log in
          </button>
          <button style={s.btnNavPrimary} onClick={function() { navigate('auth'); }}>
            Get Started →
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={s.hero}>
        <div style={s.heroGlow}></div>
        <div style={s.heroInner}>
          <div style={s.heroBadge}>
            <span style={s.heroBadgeDot}></span>
            Live — Tasks available now
          </div>
          <h1 style={s.heroTitle}>
            Complete Tasks.<br />
            <span style={s.heroTitleEm}>Get Paid.</span><br />
            Grow Faster.
          </h1>
          <p style={s.heroSub}>
            The platform where earners complete real YouTube tasks and creators get genuine engagement. Simple. Transparent. Global.
          </p>
          <div style={s.heroActions}>
            <button style={s.btnHeroPrimary} onClick={function() { navigate('auth'); }}>
              Start Earning Free →
            </button>
            <button style={s.btnHeroGhost} onClick={function() { navigate('auth'); }}>
              I'm a Creator
            </button>
          </div>
          <div style={s.heroStats}>
            <div style={s.heroStat}>
              <div style={s.heroStatNum}>50K+</div>
              <div style={s.heroStatLabel}>Active Earners</div>
            </div>
            <div style={s.heroStat}>
              <div style={s.heroStatNum}>2.1M</div>
              <div style={s.heroStatLabel}>Points Awarded</div>
            </div>
            <div style={s.heroStat}>
              <div style={s.heroStatNum}>12K+</div>
              <div style={s.heroStatLabel}>Tasks Done</div>
            </div>
            <div style={s.heroStatLast}>
              <div style={s.heroStatNum}>30+</div>
              <div style={s.heroStatLabel}>Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── AUDIENCE ── */}
      <section style={s.audienceSection}>
        <div style={{ maxWidth: 480, marginBottom: 40 }}>
          <div style={s.sectionLabel}>Who Is Taskivo For?</div>
          <h2 style={s.sectionTitle}>Two sides.<br />One platform.</h2>
          <p style={{ ...s.sectionSub, marginBottom: 0 }}>
            Whether you want to earn money completing tasks or grow your YouTube channel with verified engagement — Taskivo was built for you.
          </p>
        </div>
        <div style={s.audienceGrid}>
          {/* Earner card */}
          <div style={s.audienceCard}>
            <div style={s.audienceCardBar}></div>
            <span style={s.audienceTag}>For Earners</span>
            <div style={s.audienceTitle}>Complete tasks.<br />Earn real cash.</div>
            <p style={s.audienceDesc}>Watch YouTube videos, complete simple actions, and withdraw real money. No experience needed. Works from any phone.</p>
            <ul style={s.stepList}>
              {earnerSteps.map(function(step, i) {
                return (
                  <li key={i} style={s.stepItem}>
                    <span style={s.stepNum}>{i + 1}</span>
                    <span style={s.stepText}>{step}</span>
                  </li>
                );
              })}
            </ul>
            <button style={s.audienceBtn} onClick={function() { navigate('auth'); }}>
              Start Earning Free →
            </button>
          </div>
          {/* Creator card */}
          <div style={s.audienceCard}>
            <div style={s.audienceCardBar}></div>
            <span style={s.audienceTag}>For Creators</span>
            <div style={s.audienceTitle}>Real views.<br />Real engagement.</div>
            <p style={s.audienceDesc}>Get verified views, likes, and comments from real people. Every earner passes a quiz proving they actually watched.</p>
            <ul style={s.stepList}>
              {creatorSteps.map(function(step, i) {
                return (
                  <li key={i} style={s.stepItem}>
                    <span style={s.stepNum}>{i + 1}</span>
                    <span style={s.stepText}>{step}</span>
                  </li>
                );
              })}
            </ul>
            <button style={s.audienceBtn} onClick={function() { navigate('auth'); }}>
              Post Your First Task →
            </button>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={s.featuresSection}>
        <div style={s.sectionLabel}>Platform Features</div>
        <h2 style={s.sectionTitle}>Built for trust.<br />Designed for scale.</h2>
        <p style={s.sectionSub}>Every feature exists to guarantee genuine engagement — not gaming the system.</p>
        <div style={s.featuresGrid}>
          {features.map(function(f, i) {
            return (
              <div key={i} style={s.featureCard}>
                <div style={s.featureIconWrap}>{f.icon}</div>
                <div style={s.featureName}>{f.name}</div>
                <p style={s.featureDesc}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={s.proofSection}>
        <div style={s.proofSectionLabel}>What People Say</div>
        <h2 style={s.proofSectionTitle}>Trusted worldwide.</h2>
        <p style={s.proofSectionSub}>Real people. Real results. Real money.</p>
        <div style={s.proofGrid}>
          {testimonials.map(function(t, i) {
            return (
              <div key={i} style={s.proofCard}>
                <div style={s.proofStars}>★★★★★</div>
                <p style={s.proofText}>{t.text}</p>
                <div style={s.proofAuthor}>
                  <div style={s.proofAvatar}>{t.initials}</div>
                  <div>
                    <div style={s.proofName}>{t.name}</div>
                    <div style={s.proofRole}>{t.role}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={s.ctaSection}>
        <div style={s.ctaBadge}>Free to join</div>
        <h2 style={s.ctaTitle}>
          Your next payout is<br />
          <span style={s.ctaTitleEm}>one task away.</span>
        </h2>
        <p style={s.ctaSub}>
          Join thousands of earners already making money on Taskivo. Create your free account in under 60 seconds.
        </p>
        <div style={s.ctaBtns}>
          <button style={s.btnCtaPrimary} onClick={function() { navigate('auth'); }}>
            Start Earning Free →
          </button>
          <button style={s.btnCtaGhost} onClick={function() { navigate('auth'); }}>
            I'm a Creator
          </button>
        </div>
        <div style={s.ctaTrust}>
          {['No fees to join', 'Instant points', 'Withdraw anytime'].map(function(item) {
            return (
              <div key={item} style={s.trustItem}>
                <div style={s.trustCheck}>✓</div>
                {item}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={s.footer}>
        <div style={s.footerTop}>
          <div>
            <div style={s.footerBrand}>
              <span style={{ ...s.navDot, background: C.lime }}></span>
              Taskivo
            </div>
            <p style={s.footerTagline}>
              The task completion platform connecting earners and creators worldwide.
            </p>
          </div>
          <div>
            <div style={s.footerColTitle}>Platform</div>
            <ul style={s.footerLinks}>
              {['How it Works', 'For Earners', 'For Creators', 'Pricing'].map(function(item) {
                return <li key={item}><a href="#" style={s.footerLink}>{item}</a></li>;
              })}
            </ul>
          </div>
          <div>
            <div style={s.footerColTitle}>Company</div>
            <ul style={s.footerLinks}>
              {['About', 'Blog', 'Careers', 'Contact'].map(function(item) {
                return <li key={item}><a href="#" style={s.footerLink}>{item}</a></li>;
              })}
            </ul>
          </div>
          <div>
            <div style={s.footerColTitle}>Legal</div>
            <ul style={s.footerLinks}>
              {['Terms of Service', 'Privacy Policy', 'Cookie Policy'].map(function(item) {
                return <li key={item}><a href="#" style={s.footerLink}>{item}</a></li>;
              })}
            </ul>
          </div>
        </div>
        <div style={s.footerBottom}>
          <span style={s.footerBottomText}>© 2025 Taskivo. All rights reserved.</span>
          <span style={s.footerBottomText}>taskivo.online</span>
        </div>
      </footer>

    </div>
  );
}
