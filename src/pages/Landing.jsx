import { useEffect } from 'react';

const LANDING_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

  .landing { background: #fff; }
  .landing-nav { padding: 0 5%; height: 72px; display: flex; align-items: center; gap: 16px; max-width: 1200px; margin: 0 auto; position: sticky; top: 0; background: rgba(255,255,255,.92); backdrop-filter: blur(12px); z-index: 50; border-bottom: 1px solid #E5E7EB; }
  .landing-nav-brand { font-family: 'Clash Display', sans-serif; font-size: 22px; font-weight: 700; color: #0A0A0F; flex: 1; text-decoration: none; }
  .landing-nav-links { display: flex; gap: 4px; }
  .landing-nav-links a { font-size: 14px; font-weight: 500; color: #6B7280; text-decoration: none; padding: 7px 14px; border-radius: 8px; transition: all .18s; cursor: pointer; }
  .landing-nav-links a:hover { color: #0A0A0F; background: #F3F4F6; }

  .lp-btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 8px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; border: none; transition: all .2s; text-decoration: none; white-space: nowrap; }
  .lp-btn-primary { background: #A8FF3E; color: #0A0A0F; }
  .lp-btn-primary:hover { background: #C8FF6E; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(168,255,62,.35); }
  .lp-btn-dark { background: #0A0A0F; color: #fff; }
  .lp-btn-dark:hover { background: #1A1A2E; transform: translateY(-1px); }
  .lp-btn-outline { background: transparent; color: #0A0A0F; border: 1.5px solid #E5E7EB; }
  .lp-btn-outline:hover { border-color: #0A0A0F; background: #F3F4F6; }
  .lp-btn-sm { padding: 6px 14px; font-size: 13px; }
  .lp-btn-xl { padding: 18px 36px; font-size: 16px; }

  .lp-hero { padding: 80px 5% 100px; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; max-width: 1200px; margin: 0 auto; }
  .lp-hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; background: rgba(168,255,62,.15); color: #5A8A00; padding: 6px 14px; border-radius: 99px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 24px; border: 1px solid rgba(168,255,62,.3); }
  .lp-hero-title { font-family: 'Clash Display', sans-serif; font-size: clamp(36px, 5vw, 64px); font-weight: 700; color: #0A0A0F; line-height: 1.08; margin-bottom: 24px; }
  .lp-hero-title span { color: #7ACC20; }
  .lp-hero-sub { font-size: 18px; color: #6B7280; line-height: 1.7; margin-bottom: 36px; max-width: 480px; }
  .lp-hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }
  .lp-hero-card { background: #1A1A2E; border-radius: 28px; padding: 28px; color: #fff; }
  .lp-hero-card-title { font-family: 'Clash Display', sans-serif; font-size: 16px; margin-bottom: 20px; color: rgba(255,255,255,.6); }
  .lp-task-preview { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); border-radius: 14px; padding: 16px; margin-bottom: 12px; }
  .lp-task-preview-title { font-weight: 600; font-size: 15px; margin-bottom: 8px; }
  .lp-task-preview-meta { display: flex; align-items: center; gap: 12px; font-size: 12px; color: rgba(255,255,255,.5); }
  .lp-task-preview-reward { color: #A8FF3E; font-weight: 700; }
  .lp-progress { height: 6px; background: rgba(255,255,255,.1); border-radius: 99px; overflow: hidden; margin-top: 8px; }
  .lp-progress-bar { height: 100%; background: #A8FF3E; border-radius: 99px; }

  .lp-features-section { padding: 80px 5%; background: #FAFAFA; }
  .lp-section-label { text-align: center; font-size: 11px; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; color: #7ACC20; margin-bottom: 14px; }
  .lp-section-title { text-align: center; font-family: 'Clash Display', sans-serif; font-size: clamp(28px, 4vw, 44px); font-weight: 700; color: #0A0A0F; margin-bottom: 16px; }
  .lp-section-sub { text-align: center; font-size: 16px; color: #6B7280; max-width: 540px; margin: 0 auto 56px; line-height: 1.7; }
  .lp-features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1100px; margin: 0 auto; }
  .lp-feature-card { background: #fff; border: 1px solid #E5E7EB; border-radius: 20px; padding: 28px; transition: all .22s; }
  .lp-feature-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,.10); transform: translateY(-3px); border-color: rgba(168,255,62,.4); }
  .lp-feature-icon { width: 48px; height: 48px; background: rgba(168,255,62,.12); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 18px; }
  .lp-feature-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #0A0A0F; margin-bottom: 8px; }
  .lp-feature-desc { font-size: 14px; color: #6B7280; line-height: 1.65; }

  .lp-how-section { padding: 80px 5%; background: #1A1A2E; color: #fff; }
  .lp-how-section .lp-section-title { color: #fff; }
  .lp-how-section .lp-section-sub { color: rgba(255,255,255,.55); }
  .lp-steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; max-width: 1100px; margin: 0 auto; }
  .lp-step-card { text-align: center; }
  .lp-step-num { width: 52px; height: 52px; background: #A8FF3E; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Clash Display', sans-serif; font-size: 22px; font-weight: 700; color: #0A0A0F; margin: 0 auto 16px; }
  .lp-step-title { font-weight: 700; font-size: 15px; margin-bottom: 8px; }
  .lp-step-desc { font-size: 13px; color: rgba(255,255,255,.55); line-height: 1.6; }

  .lp-cta-section { padding: 80px 5%; background: linear-gradient(135deg, #A8FF3E 0%, #C8FF6E 100%); }
  .lp-cta-inner { max-width: 640px; margin: 0 auto; text-align: center; }
  .lp-cta-title { font-family: 'Clash Display', sans-serif; font-size: clamp(28px, 4vw, 48px); font-weight: 700; color: #0A0A0F; margin-bottom: 16px; }
  .lp-cta-sub { font-size: 17px; color: rgba(10,10,15,.65); margin-bottom: 36px; }

  .lp-footer { background: #0A0A0F; color: rgba(255,255,255,.5); padding: 48px 5% 32px; }
  .lp-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; max-width: 1200px; margin: 0 auto 40px; }
  .lp-footer-brand { font-family: 'Clash Display', sans-serif; font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 12px; }
  .lp-footer-desc { font-size: 13px; line-height: 1.7; }
  .lp-footer-col-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: rgba(255,255,255,.8); margin-bottom: 14px; }
  .lp-footer-col-links { list-style: none; display: flex; flex-direction: column; gap: 8px; padding: 0; }
  .lp-footer-col-links li a { font-size: 13px; color: rgba(255,255,255,.45); text-decoration: none; transition: color .18s; cursor: pointer; }
  .lp-footer-col-links li a:hover { color: #A8FF3E; }
  .lp-footer-bottom { border-top: 1px solid rgba(255,255,255,.08); padding-top: 24px; font-size: 13px; text-align: center; max-width: 1200px; margin: 0 auto; }

  @media (max-width: 768px) {
    .lp-hero { grid-template-columns: 1fr; padding: 48px 5% 60px; }
    .lp-hero-visual { display: none; }
    .lp-features-grid { grid-template-columns: 1fr; }
    .lp-steps-grid { grid-template-columns: 1fr 1fr; }
    .lp-footer-grid { grid-template-columns: 1fr 1fr; }
    .lp-hero-title { font-size: 36px; }
    .lp-hero-sub { font-size: 15px; }
    .lp-btn-xl { padding: 14px 24px; font-size: 15px; }
    .lp-section-title { font-size: 26px; }
    .lp-cta-title { font-size: 26px; }
    .lp-steps-grid { gap: 16px; }
    .landing-nav-links { display: none; }
  }
`;

const MOCK_TASKS = [
  { id: 1, title: "Review Our New AI Productivity App", requiredTime: 120, reward: 450, totalSlots: 100, completedSlots: 67 },
  { id: 2, title: "Watch: Street Food Tour of Lagos", requiredTime: 90, reward: 280, totalSlots: 50, completedSlots: 12 },
  { id: 3, title: "TechVision Studio Channel Intro", requiredTime: 60, reward: 180, totalSlots: 200, completedSlots: 88 },
];

export default function Landing({ navigate, setAuthMode }) {
  useEffect(function () {
    var style = document.createElement('style');
    style.id = 'lp-styles';
    style.textContent = LANDING_CSS;
    if (!document.getElementById('lp-styles')) {
      document.head.appendChild(style);
    }
    return function () {
      var el = document.getElementById('lp-styles');
      if (el) el.remove();
    };
  }, []);

  function goRegister() {
    setAuthMode('register');
    navigate('auth');
  }

  function goLogin() {
    setAuthMode('login');
    navigate('auth');
  }

  return (
    <div className="landing">

      {/* NAV */}
      <nav className="landing-nav">
        <span className="landing-nav-brand">⚡ Taskivo</span>
        <div className="landing-nav-links">
          <a onClick={function () { navigate('blog'); }}>Blog</a>
          <a href="#features">How it Works</a>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="lp-btn lp-btn-outline lp-btn-sm" onClick={goLogin}>Log in</button>
          <button className="lp-btn lp-btn-primary lp-btn-sm" onClick={goRegister}>Get Started</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: 'linear-gradient(180deg, #fff 0%, #F9FFF5 100%)', borderBottom: '1px solid #E5E7EB' }}>
        <div className="lp-hero">
          <div>
            <div className="lp-hero-eyebrow">⚡ Earn While You Watch</div>
            <div className="lp-hero-title">
              Real Tasks.<br />Real <span>Rewards</span>.<br />Real Insights.
            </div>
            <div className="lp-hero-sub">
              Taskivo connects curious viewers with creators who want genuine feedback. Watch videos, answer questions, earn points — and get paid.
            </div>
            <div className="lp-hero-actions">
              <button className="lp-btn lp-btn-primary lp-btn-xl" onClick={goRegister}>Start Earning Free →</button>
              <button className="lp-btn lp-btn-outline lp-btn-xl" onClick={goRegister}>I'm a Creator</button>
            </div>
            <div style={{ display: 'flex', gap: 32, marginTop: 36, flexWrap: 'wrap' }}>
              {[['50K+', 'Active Workers'], ['2.1M', 'Points Earned'], ['12K+', 'Tasks Completed']].map(function (item) {
                return (
                  <div key={item[1]}>
                    <div style={{ fontFamily: "'Clash Display', sans-serif", fontSize: 26, fontWeight: 700, color: '#0A0A0F' }}>{item[0]}</div>
                    <div style={{ fontSize: 12, color: '#6B7280' }}>{item[1]}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="lp-hero-visual">
            <div className="lp-hero-card">
              <div className="lp-hero-card-title">📋 Available Tasks</div>
              {MOCK_TASKS.map(function (t) {
                return (
                  <div className="lp-task-preview" key={t.id}>
                    <div className="lp-task-preview-title">{t.title}</div>
                    <div className="lp-task-preview-meta">
                      <span>⏱ {t.requiredTime}s watch</span>
                      <span className="lp-task-preview-reward">+{t.reward} pts</span>
                      <span>{t.totalSlots - t.completedSlots} slots left</span>
                    </div>
                    <div className="lp-progress">
                      <div className="lp-progress-bar" style={{ width: ((t.completedSlots / t.totalSlots) * 100) + '%' }} />
                    </div>
                  </div>
                );
              })}
              <button className="lp-btn lp-btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }} onClick={goRegister}>
                View All Tasks →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="lp-features-section" id="features">
        <div className="lp-section-label">Platform Features</div>
        <div className="lp-section-title">Everything You Need to Earn & Grow</div>
        <div className="lp-section-sub">A complete ecosystem where meaningful engagement is rewarded and creators get real data.</div>
        <div className="lp-features-grid">
          {[
            { icon: '▶', title: 'Watch & Earn', desc: 'Complete video tasks with enforced watch timers. Points are awarded only after verified engagement — no shortcuts.' },
            { icon: '🧠', title: 'Smart Questions', desc: 'Answer comprehension questions, rate content, or provide written feedback. Every task validates real watching.' },
            { icon: '💰', title: 'Points → Cash', desc: 'Accumulate points and withdraw via your preferred method. Transparent conversion rates, admin-approved.' },
            { icon: '🛡️', title: 'Anti-Cheat Built In', desc: 'Tab-switch detection, IP tracking, randomized questions, and daily limits keep the platform fair for everyone.' },
            { icon: '📊', title: 'Creator Analytics', desc: 'Creators get real completion stats, audience feedback scores, and engagement breakdowns — not vanity metrics.' },
            { icon: '✍️', title: 'SEO Blog', desc: 'A rich blog covering YouTube growth, content strategy, and monetization — driving organic traffic and trust.' },
          ].map(function (f) {
            return (
              <div className="lp-feature-card" key={f.title}>
                <div className="lp-feature-icon">{f.icon}</div>
                <div className="lp-feature-title">{f.title}</div>
                <div className="lp-feature-desc">{f.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="lp-how-section">
        <div className="lp-section-label" style={{ color: 'rgba(168,255,62,.7)' }}>How It Works</div>
        <div className="lp-section-title">From Zero to Earning in Minutes</div>
        <div className="lp-section-sub">A simple flow designed for real engagement — not gaming the system.</div>
        <div className="lp-steps-grid">
          {[
            { n: '1', title: 'Register Free', desc: 'Create your account with email. No payment needed to start.' },
            { n: '2', title: 'Pick a Task', desc: 'Browse available video tasks filtered by topic, reward, and duration.' },
            { n: '3', title: 'Watch & Answer', desc: 'Watch the full video (timer enforced), then answer questions or give feedback.' },
            { n: '4', title: 'Earn & Withdraw', desc: 'Points land in your wallet instantly. Request withdrawal when you hit the threshold.' },
          ].map(function (s) {
            return (
              <div className="lp-step-card" key={s.n}>
                <div className="lp-step-num">{s.n}</div>
                <div className="lp-step-title">{s.title}</div>
                <div className="lp-step-desc">{s.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="lp-cta-section">
        <div className="lp-cta-inner">
          <div className="lp-cta-title">Ready to Start Earning?</div>
          <div className="lp-cta-sub">Join 50,000+ workers already earning on Taskivo. Free to join, real rewards, no spam.</div>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="lp-btn lp-btn-dark lp-btn-xl" onClick={goRegister}>Create Free Account</button>
            <button className="lp-btn lp-btn-outline lp-btn-xl" style={{ background: 'rgba(255,255,255,.5)' }} onClick={goLogin}>I Have an Account</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-footer-grid">
          <div>
            <div className="lp-footer-brand">⚡ Taskivo</div>
            <div className="lp-footer-desc">A global task-based engagement platform connecting workers with creators for meaningful video feedback and insights.</div>
          </div>
          {[
            { title: 'Platform', links: ['How it Works', 'Browse Tasks', 'Creator Hub', 'Pricing'] },
            { title: 'Company', links: ['About Us', 'Blog', 'Careers', 'Contact'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
          ].map(function (col) {
            return (
              <div key={col.title}>
                <div className="lp-footer-col-title">{col.title}</div>
                <ul className="lp-footer-col-links">
                  {col.links.map(function (l) {
                    return <li key={l}><a href="#">{l}</a></li>;
                  })}
                </ul>
              </div>
            );
          })}
        </div>
        <div className="lp-footer-bottom">© 2025 Taskivo.online — All rights reserved.</div>
      </footer>

    </div>
  );
}
