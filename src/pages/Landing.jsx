export default function Landing({ navigate, setAuthMode }) {

  function goRegister() {
    setAuthMode('register');
    navigate('auth');
  }

  function goLogin() {
    setAuthMode('login');
    navigate('auth');
  }

  const s = {
    page: {
      fontFamily: "'DM Sans', sans-serif",
      background: '#F7F8FA',
      color: '#0D0D14',
    },

    // NAV
    nav: {
      padding: '0 5%',
      height: 70,
      display: 'flex',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(12px)',
      zIndex: 50,
      borderBottom: '1px solid #EBEBEB',
    },
    navBrand: {
      fontFamily: "'Syne', sans-serif",
      fontSize: 20,
      fontWeight: 800,
      color: '#0D0D14',
      flex: 1,
      letterSpacing: '-0.5px',
    },
    navAccent: {
      color: '#A8FF3E',
    },
    navLoginBtn: {
      padding: '8px 18px',
      background: 'none',
      border: '1.5px solid #E0E0E0',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 600,
      cursor: 'pointer',
      color: '#0D0D14',
      marginRight: '8px',
      fontFamily: "'DM Sans', sans-serif",
    },
    navRegisterBtn: {
      padding: '8px 18px',
      background: '#0D0D14',
      border: 'none',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 700,
      cursor: 'pointer',
      color: '#A8FF3E',
      fontFamily: "'DM Sans', sans-serif",
    },

    // HERO
    hero: {
      background: 'linear-gradient(160deg, #0D0D14 0%, #1a1a2e 100%)',
      padding: '80px 5% 90px',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    },
    heroGlow: {
      position: 'absolute',
      top: '-80px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '600px',
      height: '400px',
      background: 'radial-gradient(ellipse, rgba(168,255,62,0.12) 0%, transparent 70%)',
      pointerEvents: 'none',
    },
    heroEyebrow: {
      display: 'inline-block',
      background: 'rgba(168,255,62,0.12)',
      border: '1px solid rgba(168,255,62,0.3)',
      color: '#A8FF3E',
      fontSize: '12px',
      fontWeight: 700,
      letterSpacing: '1px',
      textTransform: 'uppercase',
      padding: '6px 16px',
      borderRadius: '20px',
      marginBottom: '24px',
    },
    heroTitle: {
      fontFamily: "'Syne', sans-serif",
      fontSize: 'clamp(36px, 7vw, 64px)',
      fontWeight: 800,
      color: '#fff',
      lineHeight: 1.1,
      letterSpacing: '-1.5px',
      margin: '0 0 20px 0',
    },
    heroAccent: {
      color: '#A8FF3E',
    },
    heroSub: {
      fontSize: '17px',
      color: 'rgba(255,255,255,0.6)',
      maxWidth: '520px',
      margin: '0 auto 36px',
      lineHeight: 1.7,
    },
    heroBtns: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: '56px',
    },
    heroPrimaryBtn: {
      padding: '14px 28px',
      background: '#A8FF3E',
      color: '#0D0D14',
      border: 'none',
      borderRadius: '10px',
      fontWeight: 800,
      fontSize: '15px',
      cursor: 'pointer',
      fontFamily: "'Syne', sans-serif",
      letterSpacing: '-0.3px',
    },
    heroOutlineBtn: {
      padding: '14px 28px',
      background: 'transparent',
      color: '#fff',
      border: '1.5px solid rgba(255,255,255,0.25)',
      borderRadius: '10px',
      fontWeight: 700,
      fontSize: '15px',
      cursor: 'pointer',
      fontFamily: "'DM Sans', sans-serif",
    },
    statsRow: {
      display: 'flex',
      justifyContent: 'center',
      gap: '48px',
      flexWrap: 'wrap',
    },
    statNum: {
      fontFamily: "'Syne', sans-serif",
      fontSize: '28px',
      fontWeight: 800,
      color: '#fff',
    },
    statLabel: {
      fontSize: '12px',
      color: 'rgba(255,255,255,0.45)',
      marginTop: '2px',
    },

    // SECTION SHARED
    section: {
      padding: '80px 5%',
    },
    sectionDark: {
      padding: '80px 5%',
      background: '#0D0D14',
    },
    sectionLabel: {
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '2px',
      textTransform: 'uppercase',
      color: '#A8FF3E',
      marginBottom: '12px',
    },
    sectionLabelDark: {
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '2px',
      textTransform: 'uppercase',
      color: 'rgba(168,255,62,0.6)',
      marginBottom: '12px',
    },
    sectionTitle: {
      fontFamily: "'Syne', sans-serif",
      fontSize: 'clamp(26px, 4vw, 40px)',
      fontWeight: 800,
      color: '#0D0D14',
      letterSpacing: '-1px',
      margin: '0 0 12px 0',
      lineHeight: 1.15,
    },
    sectionTitleLight: {
      fontFamily: "'Syne', sans-serif",
      fontSize: 'clamp(26px, 4vw, 40px)',
      fontWeight: 800,
      color: '#fff',
      letterSpacing: '-1px',
      margin: '0 0 12px 0',
      lineHeight: 1.15,
    },
    sectionSub: {
      fontSize: '15px',
      color: '#777',
      maxWidth: '480px',
      lineHeight: 1.7,
      margin: '0 0 48px 0',
    },
    sectionSubLight: {
      fontSize: '15px',
      color: 'rgba(255,255,255,0.5)',
      maxWidth: '480px',
      lineHeight: 1.7,
      margin: '0 0 48px 0',
    },

    // EARNER SECTION
    splitGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
      maxWidth: '1100px',
      margin: '0 auto',
    },
    audienceCard: {
      background: '#fff',
      borderRadius: '18px',
      padding: '36px 28px',
      boxShadow: '0 2px 20px rgba(0,0,0,0.06)',
      borderTop: '4px solid #A8FF3E',
    },
    audienceCardDark: {
      background: '#141420',
      borderRadius: '18px',
      padding: '36px 28px',
      border: '1px solid rgba(255,255,255,0.07)',
      borderTop: '4px solid #A8FF3E',
    },
    audienceIcon: {
      fontSize: '32px',
      marginBottom: '16px',
    },
    audienceTitle: {
      fontFamily: "'Syne', sans-serif",
      fontSize: '22px',
      fontWeight: 800,
      color: '#0D0D14',
      marginBottom: '8px',
      letterSpacing: '-0.5px',
    },
    audienceTitleLight: {
      fontFamily: "'Syne', sans-serif",
      fontSize: '22px',
      fontWeight: 800,
      color: '#fff',
      marginBottom: '8px',
      letterSpacing: '-0.5px',
    },
    audienceSub: {
      fontSize: '14px',
      color: '#888',
      lineHeight: 1.7,
      marginBottom: '24px',
    },
    audienceSubLight: {
      fontSize: '14px',
      color: 'rgba(255,255,255,0.5)',
      lineHeight: 1.7,
      marginBottom: '24px',
    },
    stepItem: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      marginBottom: '14px',
    },
    stepBadge: {
      width: '24px',
      height: '24px',
      borderRadius: '50%',
      background: '#A8FF3E',
      color: '#0D0D14',
      fontSize: '11px',
      fontWeight: 800,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      marginTop: '2px',
    },
    stepText: {
      fontSize: '14px',
      color: '#444',
      lineHeight: 1.6,
    },
    stepTextLight: {
      fontSize: '14px',
      color: 'rgba(255,255,255,0.6)',
      lineHeight: 1.6,
    },
    audienceBtn: {
      width: '100%',
      padding: '13px',
      background: '#0D0D14',
      color: '#A8FF3E',
      border: 'none',
      borderRadius: '10px',
      fontWeight: 700,
      fontSize: '14px',
      cursor: 'pointer',
      fontFamily: "'DM Sans', sans-serif",
      marginTop: '8px',
    },
    audienceBtnLight: {
      width: '100%',
      padding: '13px',
      background: '#A8FF3E',
      color: '#0D0D14',
      border: 'none',
      borderRadius: '10px',
      fontWeight: 700,
      fontSize: '14px',
      cursor: 'pointer',
      fontFamily: "'DM Sans', sans-serif",
      marginTop: '8px',
    },

    // FEATURES
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '16px',
      maxWidth: '1100px',
      margin: '0 auto',
    },
    featureCard: {
      background: '#fff',
      borderRadius: '14px',
      padding: '24px',
      boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
      borderLeft: '3px solid #A8FF3E',
    },
    featureIcon: {
      fontSize: '24px',
      marginBottom: '12px',
    },
    featureTitle: {
      fontFamily: "'Syne', sans-serif",
      fontSize: '16px',
      fontWeight: 700,
      color: '#0D0D14',
      marginBottom: '6px',
    },
    featureDesc: {
      fontSize: '13px',
      color: '#777',
      lineHeight: 1.65,
    },

    // TESTIMONIALS
    testimonialsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '16px',
      maxWidth: '1100px',
      margin: '0 auto',
    },
    testimonialCard: {
      background: '#141420',
      borderRadius: '14px',
      padding: '24px',
      border: '1px solid rgba(255,255,255,0.07)',
    },
    testimonialText: {
      fontSize: '14px',
      color: 'rgba(255,255,255,0.7)',
      lineHeight: 1.7,
      marginBottom: '16px',
      fontStyle: 'italic',
    },
    testimonialName: {
      fontSize: '13px',
      fontWeight: 700,
      color: '#fff',
    },
    testimonialRole: {
      fontSize: '11px',
      color: 'rgba(168,255,62,0.7)',
      marginTop: '2px',
    },

    // CTA
    ctaSection: {
      padding: '80px 5%',
      background: '#A8FF3E',
      textAlign: 'center',
    },
    ctaTitle: {
      fontFamily: "'Syne', sans-serif",
      fontSize: 'clamp(28px, 5vw, 48px)',
      fontWeight: 800,
      color: '#0D0D14',
      letterSpacing: '-1px',
      margin: '0 0 12px 0',
    },
    ctaSub: {
      fontSize: '16px',
      color: 'rgba(13,13,20,0.65)',
      marginBottom: '36px',
    },
    ctaPrimaryBtn: {
      padding: '15px 32px',
      background: '#0D0D14',
      color: '#A8FF3E',
      border: 'none',
      borderRadius: '10px',
      fontWeight: 800,
      fontSize: '15px',
      cursor: 'pointer',
      fontFamily: "'Syne', sans-serif",
      marginRight: '12px',
    },
    ctaOutlineBtn: {
      padding: '15px 32px',
      background: 'transparent',
      color: '#0D0D14',
      border: '2px solid rgba(13,13,20,0.25)',
      borderRadius: '10px',
      fontWeight: 700,
      fontSize: '15px',
      cursor: 'pointer',
      fontFamily: "'DM Sans', sans-serif",
    },

    // FOOTER
    footer: {
      background: '#0D0D14',
      padding: '60px 5% 30px',
    },
    footerGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: '32px',
      marginBottom: '48px',
    },
    footerBrand: {
      fontFamily: "'Syne', sans-serif",
      fontSize: '20px',
      fontWeight: 800,
      color: '#fff',
      marginBottom: '10px',
    },
    footerTagline: {
      fontSize: '13px',
      color: 'rgba(255,255,255,0.4)',
      lineHeight: 1.7,
    },
    footerColTitle: {
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '1.5px',
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.3)',
      marginBottom: '14px',
    },
    footerLink: {
      display: 'block',
      fontSize: '13px',
      color: 'rgba(255,255,255,0.55)',
      marginBottom: '10px',
      textDecoration: 'none',
      cursor: 'pointer',
    },
    footerBottom: {
      borderTop: '1px solid rgba(255,255,255,0.07)',
      paddingTop: '24px',
      fontSize: '12px',
      color: 'rgba(255,255,255,0.25)',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '8px',
    },
  };

  return (
    <div style={s.page}>

      {/* NAV */}
      <nav style={s.nav}>
        <span style={s.navBrand}>
          <span style={s.navAccent}>⚡</span> Taskivo
        </span>
        <button style={s.navLoginBtn} onClick={goLogin}>Log in</button>
        <button style={s.navRegisterBtn} onClick={goRegister}>Get Started →</button>
      </nav>

      {/* HERO */}
      <section style={s.hero}>
        <div style={s.heroGlow} />
        <div style={s.heroEyebrow}>⚡ Earn From Anywhere. Grow Everywhere.</div>
        <h1 style={s.heroTitle}>
          Complete Tasks.<br />
          <span style={s.heroAccent}>Get Paid.</span> Grow Faster.
        </h1>
        <p style={s.heroSub}>
          Taskivo connects earners who complete real YouTube tasks with creators
          who want genuine engagement. Everyone wins.
        </p>
        <div style={s.heroBtns}>
          <button style={s.heroPrimaryBtn} onClick={goRegister}>
            Start Earning Free →
          </button>
          <button style={s.heroOutlineBtn} onClick={goRegister}>
            I'm a Creator
          </button>
        </div>
        <div style={s.statsRow}>
          {[
            ['50K+', 'Active Earners'],
            ['2.1M', 'Points Awarded'],
            ['12K+', 'Tasks Completed'],
            ['30+', 'Countries'],
          ].map(function (stat) {
            return (
              <div key={stat[1]} style={{ textAlign: 'center' }}>
                <div style={s.statNum}>{stat[0]}</div>
                <div style={s.statLabel}>{stat[1]}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* EARNERS + CREATORS — Two Sections */}
      <section style={s.section}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={s.sectionLabel}>Who Is Taskivo For?</div>
          <h2 style={s.sectionTitle}>Two Sides. One Platform.</h2>
          <p style={{ ...s.sectionSub, margin: '0 auto' }}>
            Whether you want to earn money or grow your channel — Taskivo was built for you.
          </p>
        </div>
        <div style={s.splitGrid}>

          {/* EARNER CARD */}
          <div style={s.audienceCard}>
            <div style={s.audienceIcon}>💰</div>
            <div style={s.audienceTitle}>For Earners</div>
            <div style={s.audienceSub}>
              Complete simple YouTube tasks and earn real cash — no experience needed.
              Works from any phone, anywhere in the world.
            </div>
            {[
              'Create a free account in 60 seconds',
              'Browse available video tasks',
              'Watch, like, comment and answer a quiz',
              'Earn points and withdraw to your bank',
            ].map(function (step, i) {
              return (
                <div key={i} style={s.stepItem}>
                  <div style={s.stepBadge}>{i + 1}</div>
                  <div style={s.stepText}>{step}</div>
                </div>
              );
            })}
            <button style={s.audienceBtn} onClick={goRegister}>
              Start Earning Free →
            </button>
          </div>

          {/* CREATOR CARD */}
          <div style={s.audienceCard}>
            <div style={s.audienceIcon}>🎬</div>
            <div style={s.audienceTitle}>For Creators</div>
            <div style={s.audienceSub}>
              Get real views, likes, and comments from genuine people —
              not bots. Boost your YouTube algorithm ranking with verified engagement.
            </div>
            {[
              'Register and select Creator account',
              'Choose a task package for your video',
              'Pay securely via Paystack or PayPal',
              'Watch real engagement roll in within 24hrs',
            ].map(function (step, i) {
              return (
                <div key={i} style={s.stepItem}>
                  <div style={s.stepBadge}>{i + 1}</div>
                  <div style={s.stepText}>{step}</div>
                </div>
              );
            })}
            <button style={s.audienceBtn} onClick={goRegister}>
              Post Your First Task →
            </button>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section style={{ ...s.section, background: '#fff', paddingTop: '70px', paddingBottom: '70px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={s.sectionLabel}>Platform Features</div>
          <h2 style={s.sectionTitle}>Built Different. Built to Last.</h2>
          <p style={s.sectionSub}>
            Every feature exists to ensure genuine engagement — not gaming the system.
          </p>
          <div style={s.featuresGrid}>
            {[
              { icon: '⏱', title: 'Enforced Watch Timer', desc: 'Earners must watch for the full required duration. Tab switching pauses the timer. No shortcuts.' },
              { icon: '🧠', title: 'Anti-Cheat Quiz', desc: 'After watching, earners answer a question set by the creator. Proves they actually watched.' },
              { icon: '💸', title: 'Real Cash Withdrawals', desc: 'Points convert to real money. Withdraw via Paystack, Flutterwave or PayPal. Processed within 48hrs.' },
              { icon: '🌍', title: 'Global Earner Pool', desc: 'Earners from 30+ countries. Creators can target specific regions for more relevant engagement.' },
              { icon: '📊', title: 'Creator Reports', desc: 'See exactly how many people watched, liked, commented and subscribed to your channel.' },
              { icon: '🛡️', title: 'Admin Verified', desc: 'Every task and withdrawal is manually reviewed by our team before going live or being paid out.' },
            ].map(function (f) {
              return (
                <div key={f.title} style={s.featureCard}>
                  <div style={s.featureIcon}>{f.icon}</div>
                  <div style={s.featureTitle}>{f.title}</div>
                  <div style={s.featureDesc}>{f.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={s.sectionDark}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={s.sectionLabelDark}>What People Say</div>
          <h2 style={s.sectionTitleLight}>Trusted by Earners & Creators</h2>
          <p style={{ ...s.sectionSubLight, marginBottom: '40px' }}>
            Real people. Real results. Real money.
          </p>
          <div style={s.testimonialsGrid}>
            {[
  { text: 'I completed 12 tasks in my first week and withdrew straight to PayPal. The timer system makes it feel legitimate compared to other platforms.', name: 'James R.', role: 'Earner — Toronto, Canada' },
  { text: 'My video engagement doubled within 4 days of posting on Taskivo. The quiz feature means I know people actually watched — not just clicked.', name: 'Sofia M.', role: 'Creator — Madrid, Spain' },
  { text: 'I do tasks between classes on my phone. It is not going to replace my job but it genuinely pays out fast and the tasks are simple.', name: 'Priya K.', role: 'Earner — London, UK' },
  { text: 'I referred three friends and all of them are active. The platform just works — clean interface, honest payouts, no drama.', name: 'Marcus L.', role: 'Earner — Atlanta, USA' },
  { text: 'As a small creator the quiz system is what sold me. Real people, real watch time. My retention metrics actually improved after running a campaign.', name: 'Yuki T.', role: 'Creator — Tokyo, Japan' },
  { text: 'Tried three other micro-task platforms before this. Taskivo is the only one where withdrawals actually arrived when they said they would.', name: 'Daniel F.', role: 'Earner — Berlin, Germany' },
].map(function (t) {
              return (
                <div key={t.name} style={s.testimonialCard}>
                  <div style={{ color: '#A8FF3E', fontSize: '16px', marginBottom: '10px' }}>★★★★★</div>
                  <p style={s.testimonialText}>{t.text}</p>
                  <div style={s.testimonialName}>{t.name}</div>
                  <div style={s.testimonialRole}>{t.role}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={s.ctaSection}>
        <h2 style={s.ctaTitle}>Your Next Withdrawal Starts Here.</h2>
        <p style={s.ctaSub}>
          Join thousands of earners and creators already on Taskivo. Free to join. Real rewards.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={s.ctaPrimaryBtn} onClick={goRegister}>
            Create Free Account
          </button>
          <button style={s.ctaOutlineBtn} onClick={goLogin}>
            I Have an Account
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={s.footer}>
        <div style={s.footerGrid}>
          <div>
            <div style={s.footerBrand}>⚡ Taskivo</div>
            <p style={s.footerTagline}>
              A global task-based platform connecting earners with creators
              for real, verified YouTube engagement.
            </p>
          </div>
          {[
            { title: 'Platform', links: ['How it Works', 'Browse Tasks', 'Creator Hub', 'Withdraw'] },
            { title: 'Company', links: ['About Us', 'Blog', 'Contact'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service'] },
          ].map(function (col) {
            return (
              <div key={col.title}>
                <div style={s.footerColTitle}>{col.title}</div>
                {col.links.map(function (l) {
                  return <a key={l} style={s.footerLink} href="#">{l}</a>;
                })}
              </div>
            );
          })}
        </div>
        <div style={s.footerBottom}>
          <span>© 2026 Taskivo.online — All rights reserved.</span>
          <span>Built for earners. Powered by creators.</span>
        </div>
      </footer>

    </div>
  );
}
