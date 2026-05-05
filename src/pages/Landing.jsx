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
    page: { fontFamily: "'DM Sans', sans-serif", background: '#F7F8FA', color: '#0D0D14' },

    nav: { position: 'sticky', top: 0, zIndex: 99, height: '64px', display: 'flex', alignItems: 'center', padding: '0 5%', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #EBEBEB' },
    navBrand: { fontFamily: "'Syne', sans-serif", fontSize: '19px', fontWeight: 800, color: '#0D0D14', flex: 1, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '6px' },
    navDot: { width: '8px', height: '8px', borderRadius: '50%', background: '#A8FF3E', display: 'inline-block' },
    navBtns: { display: 'flex', gap: '8px', alignItems: 'center' },
    navGhost: { padding: '7px 16px', background: 'none', border: 'none', fontSize: '13px', fontWeight: 500, color: '#6B7280', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", borderRadius: '8px' },
    navPrimary: { padding: '8px 18px', background: '#0D0D14', border: 'none', fontSize: '13px', fontWeight: 600, color: '#A8FF3E', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", borderRadius: '8px' },

    hero: { background: '#0D0D14', padding: '96px 5% 80px', position: 'relative', overflow: 'hidden' },
    heroGlow: { position: 'absolute', top: '-120px', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '500px', background: 'radial-gradient(ellipse at center, rgba(168,255,62,0.08) 0%, transparent 65%)', pointerEvents: 'none' },
    heroInner: { position: 'relative', zIndex: 2, maxWidth: '680px', margin: '0 auto', textAlign: 'center' },
    heroBadge: { display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(168,255,62,0.08)', border: '1px solid rgba(168,255,62,0.18)', color: 'rgba(168,255,62,0.8)', fontSize: '11px', fontWeight: 600, letterSpacing: '1.2px', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '100px', marginBottom: '32px' },
    heroBadgeDot: { width: '5px', height: '5px', borderRadius: '50%', background: '#A8FF3E' },
    heroTitle: { fontFamily: "'Syne', sans-serif", fontSize: 'clamp(38px, 8vw, 68px)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-2px', color: '#fff', marginBottom: '20px' },
    heroAccent: { color: '#A8FF3E' },
    heroSub: { fontSize: '16px', lineHeight: 1.75, color: 'rgba(255,255,255,0.45)', maxWidth: '420px', margin: '0 auto 40px', fontWeight: 400 },
    heroActions: { display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '64px' },
    heroPrimary: { padding: '13px 26px', background: '#A8FF3E', color: '#0D0D14', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
    heroGhostBtn: { padding: '13px 26px', background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
    heroStats: { display: 'flex', justifyContent: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '40px' },
    heroStat: { flex: 1, maxWidth: '140px', textAlign: 'center', padding: '0 16px', borderRight: '1px solid rgba(255,255,255,0.06)' },
    heroStatLast: { flex: 1, maxWidth: '140px', textAlign: 'center', padding: '0 16px' },
    heroStatNum: { fontFamily: "'Syne', sans-serif", fontSize: '26px', fontWeight: 800, color: '#fff', letterSpacing: '-1px' },
    heroStatLabel: { fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '3px' },

    section: { padding: '88px 5%' },
    sectionWhite: { padding: '88px 5%', background: '#fff' },
    sectionDark: { padding: '88px 5%', background: '#0D0D14' },
    sectionLabel: { fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#A8FF3E', marginBottom: '10px' },
    sectionLabelDim: { fontSize: '11px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(168,255,62,0.5)', marginBottom: '10px' },
    sectionTitle: { fontFamily: "'Syne', sans-serif", fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, letterSpacing: '-1px', color: '#0D0D14', lineHeight: 1.1, marginBottom: '12px' },
    sectionTitleLight: { fontFamily: "'Syne', sans-serif", fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, letterSpacing: '-1px', color: '#fff', lineHeight: 1.1, marginBottom: '12px' },
    sectionSub: { fontSize: '15px', color: '#6B7280', lineHeight: 1.7, maxWidth: '440px', marginBottom: '52px' },
    sectionSubLight: { fontSize: '15px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: '440px', marginBottom: '52px' },

    audienceGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2px', background: '#EBEBEB', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)' },
    audienceCard: { background: '#fff', padding: '40px 36px', position: 'relative' },
    audienceCardTop: { content: '', position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: '#A8FF3E' },
    audienceTag: { display: 'inline-block', background: 'rgba(168,255,62,0.12)', color: '#3d6600', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', padding: '4px 10px', borderRadius: '6px', marginBottom: '20px' },
    audienceTitle: { fontFamily: "'Syne', sans-serif", fontSize: '22px', fontWeight: 800, color: '#0D0D14', marginBottom: '10px', letterSpacing: '-0.5px' },
    audienceDesc: { fontSize: '14px', color: '#6B7280', lineHeight: 1.7, marginBottom: '28px' },
    stepItem: { display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' },
    stepNum: { width: '20px', height: '20px', borderRadius: '50%', background: '#0D0D14', color: '#A8FF3E', fontSize: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' },
    stepText: { fontSize: '13px', color: '#444', lineHeight: 1.55 },
    audienceBtn: { display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '11px 20px', background: '#0D0D14', color: '#A8FF3E', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", marginTop: '8px' },

    featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' },
    featureCard: { background: '#fff', borderRadius: '14px', padding: '28px 24px', border: '1px solid #EBEBEB' },
    featureIconWrap: { width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(168,255,62,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '16px' },
    featureName: { fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: 700, color: '#0D0D14', marginBottom: '6px', letterSpacing: '-0.3px' },
    featureDesc: { fontSize: '13px', color: '#6B7280', lineHeight: 1.65 },

    proofGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' },
    proofCard: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '14px', padding: '24px' },
    proofStars: { color: '#A8FF3E', fontSize: '12px', marginBottom: '12px', letterSpacing: '2px' },
    proofText: { fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, marginBottom: '18px', fontStyle: 'italic' },
    proofAuthor: { display: 'flex', alignItems: 'center', gap: '10px' },
    proofAvatar: { width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(168,255,62,0.12)', border: '1px solid rgba(168,255,62,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#A8FF3E', flexShrink: 0 },
    proofName: { fontSize: '13px', fontWeight: 600, color: '#fff' },
    proofRole: { fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '1px' },

    ctaSection: { background: '#fff', borderTop: '1px solid #EBEBEB', padding: '100px 5%', textAlign: 'center' },
    ctaBadge: { display: 'inline-block', background: 'rgba(168,255,62,0.12)', color: '#3d6600', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', padding: '5px 12px', borderRadius: '6px', marginBottom: '24px' },
    ctaTitle: { fontFamily: "'Syne', sans-serif", fontSize: 'clamp(30px, 5vw, 52px)', fontWeight: 800, letterSpacing: '-1.5px', color: '#0D0D14', marginBottom: '14px', lineHeight: 1.05 },
    ctaAccent: { color: '#A8FF3E', textDecoration: 'underline', textDecorationColor: 'rgba(168,255,62,0.4)' },
    ctaSub: { fontSize: '15px', color: '#6B7280', marginBottom: '36px', maxWidth: '380px', margin: '0 auto 36px', lineHeight: 1.7 },
    ctaBtns: { display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' },
    ctaPrimary: { padding: '14px 28px', background: '#0D0D14', color: '#A8FF3E', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
    ctaGhost: { padding: '14px 28px', background: 'none', color: '#6B7280', border: '1px solid #EBEBEB', borderRadius: '10px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" },
    ctaTrust: { marginTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' },
    trustItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#6B7280' },
    trustCheck: { width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(168,255,62,0.12)', color: '#3d6600', fontSize: '9px', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' },

    footer: { background: '#0D0D14', padding: '56px 5% 28px' },
    footerGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '32px', marginBottom: '48px' },
    footerBrand: { fontFamily: "'Syne', sans-serif", fontSize: '18px', fontWeight: 800, color: '#fff', marginBottom: '10px' },
    footerTagline: { fontSize: '13px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.65 },
    footerColTitle: { fontSize: '11px', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '16px' },
    footerLink: { display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.45)', marginBottom: '10px', textDecoration: 'none', cursor: 'pointer' },
    footerBottom: { borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.2)' },
  };

  const earnerSteps = [
    'Create a free account in under a minute',
    'Browse video, article and feedback tasks',
    'Complete the task and pass the quiz',
    'Withdraw earnings to your preferred method',
  ];

  const creatorSteps = [
    'Register and select Creator account type',
    'Choose a task package for your video',
    'Pay securely — task goes live within 24hrs',
    'Watch real verified engagement arrive',
  ];

  const features = [
    { icon: '⏱', name: 'Enforced Watch Timer', desc: 'Earners must watch for the full required time. Switching tabs pauses the timer. No shortcuts, ever.' },
    { icon: '🧠', name: 'Anti-Cheat Quiz', desc: 'After watching, earners answer a creator-set question — proving they actually paid attention.' },
    { icon: '📖', name: 'Article Reading Tasks', desc: 'Earners read blog posts and articles, pass a comprehension quiz, and earn points. Great for content creators and publishers.' },
    { icon: '✍️', name: 'Feedback & Writing Tasks', desc: 'Submit genuine written feedback or original articles. Admin-reviewed and rewarded with bonus points on approval.' },
    { icon: '💸', name: 'Real Withdrawals', desc: 'Points convert to cash. Withdraw via PayPal, Paystack, or Flutterwave. Processed within 48 hours.' },
    { icon: '🛡️', name: 'Admin Verified', desc: 'Every task and withdrawal is manually reviewed before going live or being paid out. Zero tolerance for fraud.' },
  ];

  const testimonials = [
    { initials: 'JR', text: 'I completed 12 tasks in my first week and withdrew straight to PayPal. The timer system makes it feel legitimate compared to other platforms.', name: 'James R.', role: 'Earner — Toronto, Canada' },
    { initials: 'SM', text: 'My video engagement doubled within 4 days. The quiz feature means I know people actually watched — not just clicked.', name: 'Sofia M.', role: 'Creator — Madrid, Spain' },
    { initials: 'CE', text: 'I do article tasks during my lunch break. The pay is fair and withdrawals actually arrive. Best micro-task platform I have used.', name: 'Chidi E.', role: 'Earner — Lagos, Nigeria' },
    { initials: 'YT', text: 'As a small creator the quiz system is what sold me. Real people, real watch time. My retention metrics improved after my campaign.', name: 'Yuki T.', role: 'Creator — Tokyo, Japan' },
    { initials: 'DF', text: 'Tried three other platforms before this. Taskivo is the only one where withdrawals actually arrived when promised.', name: 'Daniel F.', role: 'Earner — Berlin, Germany' },
    { initials: 'AM', text: 'The article reading tasks are a great touch. I earn points between video tasks and the quiz keeps it honest. Highly recommend.', name: 'Amina M.', role: 'Earner — Nairobi, Kenya' },
  ];

  return (
    <div style={s.page}>

      {/* NAV */}
      <nav style={s.nav}>
        <div style={s.navBrand}>
          <span style={s.navDot} />
          Taskivo
        </div>
        <div style={s.navBtns}>
          <button style={s.navGhost} onClick={goLogin}>Log in</button>
          <button style={s.navPrimary} onClick={goRegister}>Get Started →</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={s.hero}>
        <div style={s.heroGlow} />
        <div style={s.heroInner}>
          <div style={s.heroBadge}>
            <span style={s.heroBadgeDot} />
            Live — Tasks available now
          </div>
          <h1 style={s.heroTitle}>
            Complete Tasks.<br />
            <span style={s.heroAccent}>Get Paid.</span><br />
            Grow Faster.
          </h1>
          <p style={s.heroSub}>
            The platform where earners complete real tasks and creators get genuine engagement. Simple. Transparent. Global.
          </p>
          <div style={s.heroActions}>
            <button style={s.heroPrimary} onClick={goRegister}>Start Earning Free →</button>
            <button style={s.heroGhostBtn} onClick={goRegister}>I'm a Creator</button>
          </div>
          <div style={s.heroStats}>
            {[['50K+', 'Active Earners'], ['2.1M', 'Points Awarded'], ['12K+', 'Tasks Done'], ['30+', 'Countries']].map(function (stat, i) {
              return (
                <div key={stat[1]} style={i === 3 ? s.heroStatLast : s.heroStat}>
                  <div style={s.heroStatNum}>{stat[0]}</div>
                  <div style={s.heroStatLabel}>{stat[1]}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AUDIENCE */}
      <section style={s.sectionWhite}>
        <div style={{ maxWidth: '480px', marginBottom: '48px' }}>
          <div style={s.sectionLabel}>Who Is Taskivo For?</div>
          <h2 style={s.sectionTitle}>Two sides.<br />One platform.</h2>
          <p style={{ ...s.sectionSub, marginBottom: 0 }}>
            Whether you want to earn money completing tasks or grow your YouTube channel with verified engagement — Taskivo was built for you.
          </p>
        </div>
        <div style={s.audienceGrid}>

          {/* EARNER */}
          <div style={s.audienceCard}>
            <div style={s.audienceCardTop} />
            <span style={s.audienceTag}>For Earners</span>
            <div style={s.audienceTitle}>Complete tasks.<br />Earn real cash.</div>
            <p style={s.audienceDesc}>Watch YouTube videos, read articles, submit feedback — and withdraw real money. No experience needed. Works from any phone.</p>
            {earnerSteps.map(function (step, i) {
              return (
                <div key={i} style={s.stepItem}>
                  <div style={s.stepNum}>{i + 1}</div>
                  <div style={s.stepText}>{step}</div>
                </div>
              );
            })}
            <button style={s.audienceBtn} onClick={goRegister}>Start Earning Free →</button>
          </div>

          {/* CREATOR */}
          <div style={s.audienceCard}>
            <div style={s.audienceCardTop} />
            <span style={s.audienceTag}>For Creators</span>
            <div style={s.audienceTitle}>Real views.<br />Real engagement.</div>
            <p style={s.audienceDesc}>Get verified views, likes, and comments from real people. Every earner passes a quiz proving they actually watched your video.</p>
            {creatorSteps.map(function (step, i) {
              return (
                <div key={i} style={s.stepItem}>
                  <div style={s.stepNum}>{i + 1}</div>
                  <div style={s.stepText}>{step}</div>
                </div>
              );
            })}
            <button style={s.audienceBtn} onClick={goRegister}>Post Your First Task →</button>
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section style={s.section}>
        <div style={s.sectionLabel}>Platform Features</div>
        <h2 style={s.sectionTitle}>Built for trust.<br />Designed for scale.</h2>
        <p style={s.sectionSub}>Every feature exists to guarantee genuine engagement — not gaming the system.</p>
        <div style={s.featuresGrid}>
          {features.map(function (f) {
            return (
              <div key={f.name} style={s.featureCard}>
                <div style={s.featureIconWrap}>{f.icon}</div>
                <div style={s.featureName}>{f.name}</div>
                <p style={s.featureDesc}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={s.sectionDark}>
        <div style={s.sectionLabelDim}>What People Say</div>
        <h2 style={s.sectionTitleLight}>Trusted worldwide.</h2>
        <p style={s.sectionSubLight}>Real people. Real results. Real money.</p>
        <div style={s.proofGrid}>
          {testimonials.map(function (t) {
            return (
              <div key={t.name} style={s.proofCard}>
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

      {/* CTA */}
      <section style={s.ctaSection}>
        <div style={s.ctaBadge}>Free to join — no card required</div>
        <h2 style={s.ctaTitle}>
          Your next withdrawal<br />
          starts <span style={s.ctaAccent}>here.</span>
        </h2>
        <p style={s.ctaSub}>
          Join thousands of earners and creators already on Taskivo. Sign up free in 60 seconds.
        </p>
        <div style={s.ctaBtns}>
          <button style={s.ctaPrimary} onClick={goRegister}>Create Free Account</button>
          <button style={s.ctaGhost} onClick={goLogin}>I Have an Account</button>
        </div>
        <div style={s.ctaTrust}>
          {['No credit card needed', 'Withdraw in 48hrs', '30+ countries supported'].map(function (item) {
            return (
              <span key={item} style={s.trustItem}>
                <span style={s.trustCheck}>✓</span>
                {item}
              </span>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={s.footer}>
        <div style={s.footerGrid}>
          <div>
            <div style={s.footerBrand}>⚡ Taskivo</div>
            <p style={s.footerTagline}>A global task platform connecting earners with creators for verified, genuine YouTube engagement.</p>
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
                  return <a key={l} href="#" style={s.footerLink}>{l}</a>;
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
