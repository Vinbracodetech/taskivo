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

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 800
  );
  useEffect(function () {
    function handle() { setWidth(window.innerWidth); }
    window.addEventListener('resize', handle);
    return function () { window.removeEventListener('resize', handle); };
  }, []);
  return width;
}

export default function Landing({ navigate }) {
  const w = useWindowWidth();
  const mob = w <= 600;

  useEffect(function () {
    document.title = 'Taskivo — Complete Tasks. Get Paid.';
  }, []);

  useEffect(function () {
    if (document.getElementById('taskivo-keyframes')) return;
    const style = document.createElement('style');
    style.id = 'taskivo-keyframes';
    style.textContent = `
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
    `;
    document.head.appendChild(style);
  }, []);

  const features = [
    { icon: '⏱️', name: 'Timed Watch Sessions', desc: 'Earners must watch for a minimum duration before any action unlocks. Tab-switching pauses the timer automatically.' },
    { icon: '🧠', name: 'Anti-Cheat Quiz', desc: 'After watching, earners answer a question set by the creator — proving they actually paid attention.' },
    { icon: '💸', name: 'Real Withdrawals', desc: 'Points convert to cash. Withdraw via PayPal, Paystack, or Flutterwave. Processed within 48 hours.' },
    { icon: '🌍', name: 'Global Earner Pool', desc: 'Earners from 30+ countries worldwide. Creators get diverse, international engagement on their content.' },
    { icon: '📊', name: 'Creator Reports', desc: 'See exactly how many people watched, liked, commented, and subscribed — not vanity metrics.' },
    { icon: '🛡️', name: 'Admin Verified', desc: 'Every task and withdrawal is manually reviewed before going live or being paid out. Zero tolerance for fraud.' },
  ];

  const testimonials = [
    { initials: 'JR', name: 'James R.', role: 'Earner — United States', text: '"I completed 12 tasks in my first week and withdrew straight to PayPal. The timer system makes it feel legitimate compared to other platforms."' },
    { initials: 'AO', name: 'Amaka O.', role: 'Earner — Nigeria', text: '"I was skeptical at first but I\'ve already withdrawn three times via Paystack. The quiz makes it fair — only real viewers get paid."' },
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
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.off, color: C.ink, minHeight: '100vh', WebkitFontSmoothing: 'antialiased' }}>

      {/* ── NAV ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 99,
        height: mob ? 56 : 64,
        display: 'flex', alignItems: 'center',
        padding: mob ? '0 4%' : '0 5%',
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${C.line}`,
      }}>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: mob ? 17 : 19, fontWeight: 800,
          color: C.ink, flex: 1, letterSpacing: '-0.5px',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.lime, display: 'inline-block' }}></span>
          Taskivo
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button style={{
            padding: mob ? '6px 12px' : '7px 16px',
            background: 'none', border: 'none',
            fontSize: mob ? 12 : 13, fontWeight: 500,
            color: C.slate, cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", borderRadius: 8,
          }} onClick={function () { navigate('auth'); }}>Log in</button>
          <button style={{
            padding: mob ? '7px 13px' : '8px 18px',
            background: C.ink, border: 'none',
            fontSize: mob ? 12 : 13, fontWeight: 600,
            color: C.lime, cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", borderRadius: 8,
          }} onClick={function () { navigate('auth'); }}>Get Started →</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{
        background: C.ink,
        padding: mob ? '60px 5% 52px' : '96px 5% 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -120, left: '50%',
          transform: 'translateX(-50%)',
          width: 700, height: 500,
          background: 'radial-gradient(ellipse at center, rgba(168,255,62,0.08) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}></div>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(168,255,62,0.08)',
            border: '1px solid rgba(168,255,62,0.18)',
            color: 'rgba(168,255,62,0.8)',
            fontSize: 10, fontWeight: 600,
            letterSpacing: '1.2px', textTransform: 'uppercase',
            padding: '5px 12px', borderRadius: 100,
            marginBottom: mob ? 24 : 32,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.lime, animation: 'pulse 2s infinite' }}></span>
            Live — Tasks available now
          </div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: mob ? 36 : 'clamp(38px, 8vw, 68px)',
            fontWeight: 800, lineHeight: 1.08,
            letterSpacing: mob ? '-1.5px' : '-2px',
            color: C.white, marginBottom: mob ? 14 : 20,
          }}>
            Complete Tasks.<br />
            <span style={{ fontStyle: 'normal', color: C.lime }}>Get Paid.</span><br />
            Grow Faster.
          </h1>
          <p style={{
            fontSize: mob ? 14 : 16, lineHeight: 1.7,
            color: 'rgba(255,255,255,0.45)',
            maxWidth: 420, margin: mob ? '0 auto 28px' : '0 auto 40px',
            fontWeight: 400,
          }}>
            The platform where earners complete real YouTube tasks and creators get genuine engagement. Simple. Transparent. Global.
          </p>
          <div style={{
            display: 'flex', gap: 8,
            justifyContent: 'center', flexWrap: 'wrap',
            marginBottom: mob ? 40 : 64,
          }}>
            <button style={{
              padding: mob ? '11px 20px' : '13px 26px',
              background: C.lime, color: C.ink,
              border: 'none', borderRadius: 10,
              fontSize: mob ? 13 : 14, fontWeight: 700,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }} onClick={function () { navigate('auth'); }}>Start Earning Free →</button>
            <button style={{
              padding: mob ? '11px 20px' : '13px 26px',
              background: 'rgba(255,255,255,0.06)',
              color: 'rgba(255,255,255,0.75)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 10, fontSize: mob ? 13 : 14, fontWeight: 500,
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }} onClick={function () { navigate('auth'); }}>I'm a Creator</button>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex', justifyContent: 'center',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: mob ? 28 : 40,
          }}>
            {[
              { num: '50K+', label: 'Active Earners' },
              { num: '2.1M', label: 'Points Awarded' },
              { num: '12K+', label: 'Tasks Done' },
              { num: '30+', label: 'Countries' },
            ].map(function (stat, i, arr) {
              return (
                <div key={i} style={{
                  flex: 1,
                  textAlign: 'center',
                  padding: mob ? '0 6px' : '0 16px',
                  borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                  <div style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: mob ? 18 : 26, fontWeight: 800,
                    color: C.white, letterSpacing: '-1px',
                  }}>{stat.num}</div>
                  <div style={{
                    fontSize: mob ? 9 : 11,
                    color: 'rgba(255,255,255,0.3)',
                    marginTop: 3, fontWeight: 400,
                  }}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── AUDIENCE ── */}
      <section style={{ padding: mob ? '56px 4%' : '88px 5%', background: C.white }}>
        <div style={{ maxWidth: 480, marginBottom: mob ? 28 : 40 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: C.lime, marginBottom: 10 }}>Who Is Taskivo For?</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: mob ? 26 : 'clamp(26px, 4vw, 38px)', fontWeight: 800, letterSpacing: '-1px', color: C.ink, lineHeight: 1.1, marginBottom: 12 }}>Two sides.<br />One platform.</h2>
          <p style={{ fontSize: mob ? 13 : 15, color: C.slate, lineHeight: 1.7 }}>
            Whether you want to earn money completing tasks or grow your YouTube channel with verified engagement — Taskivo was built for you.
          </p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: mob ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 2, background: C.line,
          borderRadius: 20, overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
        }}>
          {[
            { tag: 'For Earners', title: 'Complete tasks.\nEarn real cash.', desc: 'Watch YouTube videos, complete simple actions, and withdraw real money. No experience needed. Works from any phone.', steps: earnerSteps, btn: 'Start Earning Free →' },
            { tag: 'For Creators', title: 'Real views.\nReal engagement.', desc: 'Get verified views, likes, and comments from real people. Every earner passes a quiz proving they actually watched.', steps: creatorSteps, btn: 'Post Your First Task →' },
          ].map(function (card, ci) {
            return (
              <div key={ci} style={{ background: C.white, padding: mob ? '28px 20px' : '40px 36px', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: C.lime }}></div>
                <span style={{
                  display: 'inline-block', background: C.limeDim,
                  color: '#4a7a00', fontSize: 11, fontWeight: 700,
                  letterSpacing: 1, textTransform: 'uppercase',
                  padding: '4px 10px', borderRadius: 6, marginBottom: mob ? 14 : 20,
                }}>{card.tag}</span>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: mob ? 18 : 22, fontWeight: 800, color: C.ink, marginBottom: 8, letterSpacing: '-0.5px', whiteSpace: 'pre-line' }}>{card.title}</div>
                <p style={{ fontSize: mob ? 13 : 14, color: C.slate, lineHeight: 1.7, marginBottom: mob ? 20 : 28 }}>{card.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: mob ? 20 : 28 }}>
                  {card.steps.map(function (step, i) {
                    return (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
                        <span style={{ width: 20, height: 20, borderRadius: '50%', background: C.ink, color: C.lime, fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                        <span style={{ fontSize: 13, color: '#444', lineHeight: 1.55 }}>{step}</span>
                      </li>
                    );
                  })}
                </ul>
                <button style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: mob ? '10px 16px' : '11px 20px',
                  background: C.ink, color: C.lime,
                  border: 'none', borderRadius: 8,
                  fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                }} onClick={function () { navigate('auth'); }}>{card.btn}</button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: mob ? '52px 4%' : '88px 5%', background: C.off }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: C.lime, marginBottom: 10 }}>Platform Features</div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: mob ? 24 : 'clamp(26px, 4vw, 38px)', fontWeight: 800, letterSpacing: '-1px', color: C.ink, lineHeight: 1.1, marginBottom: 10 }}>Built for trust.<br />Designed for scale.</h2>
        <p style={{ fontSize: mob ? 13 : 15, color: C.slate, lineHeight: 1.7, maxWidth: 440, marginBottom: mob ? 28 : 48 }}>Every feature exists to guarantee genuine engagement — not gaming the system.</p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: mob ? '1fr 1fr' : 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: mob ? 8 : 12,
        }}>
          {features.map(function (f, i) {
            return (
              <div key={i} style={{
                background: C.white, borderRadius: 14,
                padding: mob ? '18px 14px' : '28px 24px',
                border: `1px solid ${C.line}`,
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: C.limeDim, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: mob ? 16 : 18, marginBottom: 12 }}>{f.icon}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: mob ? 13 : 15, fontWeight: 700, color: C.ink, marginBottom: 5, letterSpacing: '-0.3px' }}>{f.name}</div>
                <p style={{ fontSize: mob ? 11 : 13, color: C.slate, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: mob ? '52px 4%' : '88px 5%', background: C.ink }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: 'rgba(168,255,62,0.5)', marginBottom: 10 }}>What People Say</div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: mob ? 24 : 'clamp(26px, 4vw, 38px)', fontWeight: 800, letterSpacing: '-1px', color: C.white, lineHeight: 1.1, marginBottom: 10 }}>Trusted worldwide.</h2>
        <p style={{ fontSize: mob ? 13 : 15, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: 440, marginBottom: mob ? 28 : 48 }}>Real people. Real results. Real money.</p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: mob ? '1fr' : 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: mob ? 8 : 12,
        }}>
          {testimonials.map(function (t, i) {
            return (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14, padding: mob ? 18 : 24,
              }}>
                <div style={{ color: C.lime, fontSize: 11, marginBottom: 10, letterSpacing: 2 }}>★★★★★</div>
                <p style={{ fontSize: mob ? 12 : 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, marginBottom: 16, fontStyle: 'italic' }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.limeDim, border: `1px solid ${C.limeBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: C.lime, flexShrink: 0 }}>{t.initials}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.white }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        background: C.white, borderTop: `1px solid ${C.line}`,
        padding: mob ? '64px 5%' : '100px 5%', textAlign: 'center',
      }}>
        <div style={{ display: 'inline-block', background: C.limeDim, color: '#3d6600', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '5px 12px', borderRadius: 6, marginBottom: mob ? 16 : 24 }}>Join Free Today</div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: mob ? 28 : 'clamp(30px, 5vw, 52px)', fontWeight: 800, letterSpacing: '-1.5px', color: C.ink, marginBottom: 12, lineHeight: 1.05 }}>
          Your time is{' '}<span style={{ fontStyle: 'normal', color: C.lime, textDecoration: 'underline', textDecorationColor: 'rgba(168,255,62,0.4)' }}>worth more.</span>
        </h2>
        <p style={{ fontSize: mob ? 13 : 15, color: C.slate, marginBottom: mob ? 28 : 36, maxWidth: 380, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.7 }}>
          Join thousands of earners already making money on Taskivo. Free to join. No skills required.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{ padding: mob ? '12px 22px' : '14px 28px', background: C.ink, color: C.lime, border: 'none', borderRadius: 10, fontSize: mob ? 13 : 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }} onClick={function () { navigate('auth'); }}>Start Earning Free →</button>
          <button style={{ padding: mob ? '12px 22px' : '14px 28px', background: 'none', color: C.slate, border: `1px solid ${C.line}`, borderRadius: 10, fontSize: mob ? 13 : 14, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }} onClick={function () { navigate('auth'); }}>Post a Task</button>
        </div>
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
          {['Free to join', 'Instant payouts', 'No experience needed'].map(function (item) {
            return (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.slate }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: C.limeDim, color: '#3d6600', fontSize: 9, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✓</div>
                {item}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: C.ink, color: 'rgba(255,255,255,0.4)', padding: mob ? '40px 4% 20px' : '56px 5% 28px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: mob ? '1fr 1fr' : '1.5fr 1fr 1fr 1fr',
          gap: mob ? 24 : 32, marginBottom: mob ? 32 : 48,
        }}>
          <div style={{ gridColumn: mob ? '1 / -1' : 'auto' }}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: mob ? 16 : 18, fontWeight: 800, color: C.white, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.lime, display: 'inline-block' }}></span>
              Taskivo
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.65 }}>Complete tasks. Earn real cash. The global platform for earners and creators.</p>
          </div>
          {[
            { title: 'Platform', links: ['Browse Tasks', 'Earn Points', 'Withdraw', 'Leaderboard'] },
            { title: 'Creators', links: ['Post a Task', 'Pricing', 'Creator Dashboard', 'Analytics'] },
            { title: 'Company', links: ['About', 'Blog', 'Contact', 'Terms'] },
          ].map(function (col) {
            return (
              <div key={col.title}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 14 }}>{col.title}</div>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {col.links.map(function (link) {
                    return (
                      <li key={link} style={{ marginBottom: 9 }}>
                        <a href="#" style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>{link}</a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 12 }}>© 2025 Taskivo. All rights reserved.</span>
          <span style={{ fontSize: 12 }}>taskivo.online</span>
        </div>
      </footer>

    </div>
  );
}
