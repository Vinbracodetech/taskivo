import { useState, useEffect, useRef } from 'react';

export default function Landing({ navigate, setAuthMode }) {
  const [scrollY, setScrollY] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeTab, setActiveTab] = useState('earner');
  const statsRef = useRef(null);
  const [counted, setCounted] = useState(false);

  useEffect(function () {
    function handleScroll() { setScrollY(window.scrollY); }
    function handleResize() { setWindowWidth(window.innerWidth); }
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return function () {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(function () {
    if (!statsRef.current) return;
    var observer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !counted) setCounted(true);
    }, { threshold: 0.3 });
    observer.observe(statsRef.current);
    return function () { observer.disconnect(); };
  }, [counted]);

  var isMobile = windowWidth < 768;
  var isSmall = windowWidth < 480;

  var pill = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(168,255,62,0.1)',
    border: '1px solid rgba(168,255,62,0.25)',
    color: '#A8FF3E',
    borderRadius: '100px',
    padding: '6px 14px',
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    marginBottom: '20px',
  };

  var sectionLabel = {
    fontFamily: "'Syne', sans-serif",
    fontSize: isSmall ? '28px' : isMobile ? '34px' : '48px',
    fontWeight: 800,
    lineHeight: 1.1,
    letterSpacing: '-1px',
    marginBottom: '16px',
  };

  var subText = {
    color: 'rgba(255,255,255,0.55)',
    fontSize: isMobile ? '15px' : '17px',
    lineHeight: 1.7,
    maxWidth: '520px',
  };

  var btnPrimary = {
    background: '#A8FF3E',
    color: '#0D0D14',
    border: 'none',
    borderRadius: '10px',
    padding: isMobile ? '14px 28px' : '16px 36px',
    fontSize: isMobile ? '15px' : '16px',
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'transform 0.15s, box-shadow 0.15s',
    boxShadow: '0 0 32px rgba(168,255,62,0.25)',
  };

  var btnSecondary = {
    background: 'transparent',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: '10px',
    padding: isMobile ? '14px 28px' : '16px 36px',
    fontSize: isMobile ? '15px' : '16px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'border-color 0.2s',
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: '#0D0D14', color: '#fff', overflowX: 'hidden', minHeight: '100vh' }}>

      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Syne:wght@700;800&display=swap" rel="stylesheet" />

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '16px 20px' : '20px 48px',
        background: scrollY > 40 ? 'rgba(13,13,20,0.92)' : 'transparent',
        backdropFilter: scrollY > 40 ? 'blur(16px)' : 'none',
        borderBottom: scrollY > 40 ? '1px solid rgba(168,255,62,0.08)' : '1px solid transparent',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: isMobile ? '20px' : '24px', letterSpacing: '-0.5px' }}>
          Taski<span style={{ color: '#A8FF3E' }}>vo</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={function () { setAuthMode('login'); navigate('auth'); }}
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: isMobile ? '8px 16px' : '10px 22px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
          >
            Log in
          </button>
          <button
            onClick={function () { setAuthMode('register'); navigate('auth'); }}
            style={{ background: '#A8FF3E', color: '#0D0D14', border: 'none', padding: isMobile ? '8px 16px' : '10px 22px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
          >
            Sign up
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: isMobile ? '120px 24px 80px' : '160px 48px 100px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: isMobile ? '300px' : '600px',
          height: isMobile ? '300px' : '600px',
          background: 'radial-gradient(circle, rgba(168,255,62,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={pill}>⚡ Earn real cash online</div>

        <h1 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: isSmall ? '36px' : isMobile ? '44px' : '80px',
          fontWeight: 800,
          lineHeight: 1.05,
          letterSpacing: '-2px',
          marginBottom: '20px',
          maxWidth: '900px',
        }}>
          Complete tasks.<br />
          <span style={{ color: '#A8FF3E' }}>Get paid.</span>
        </h1>

        <p style={{ ...subText, textAlign: 'center', margin: '0 auto 40px', fontSize: isSmall ? '15px' : isMobile ? '16px' : '19px' }}>
          Taskivo connects earners who complete short online tasks with creators who want real engagement — YouTube views, article reads, and more.
        </p>

        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '12px', width: isMobile ? '100%' : 'auto', maxWidth: isMobile ? '320px' : 'none' }}>
          <button
            onClick={function () { setAuthMode('register'); navigate('auth'); }}
            style={{ ...btnPrimary, width: isMobile ? '100%' : 'auto' }}
            onMouseOver={function (e) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 40px rgba(168,255,62,0.35)'; }}
            onMouseOut={function (e) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 32px rgba(168,255,62,0.25)'; }}
          >
            Start Earning Free →
          </button>
          <button
            onClick={function () { setAuthMode('register'); navigate('auth'); }}
            style={{ ...btnSecondary, width: isMobile ? '100%' : 'auto' }}
            onMouseOver={function (e) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
            onMouseOut={function (e) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; }}
          >
            Post a Task
          </button>
        </div>

        <div style={{ marginTop: '48px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ display: 'flex' }}>
            {['🇳🇬','🇬🇭','🇰🇪','🇿🇦','🇺🇬'].map(function (flag, i) {
              return (
                <div key={i} style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  background: '#1a1a24', border: '2px solid #0D0D14',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px', marginLeft: i === 0 ? 0 : '-8px',
                }}>
                  {flag}
                </div>
              );
            })}
          </div>
          <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
            Earners from <strong style={{ color: '#fff' }}>50+ countries</strong>
          </span>
        </div>
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} style={{
        padding: isMobile ? '60px 24px' : '80px 48px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          maxWidth: '960px', margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: isMobile ? '32px 16px' : '0',
        }}>
          {[
            { num: '50K+', label: 'Tasks Completed' },
            { num: '12K+', label: 'Active Earners' },
            { num: '$18K+', label: 'Paid Out' },
            { num: '50+', label: 'Countries' },
          ].map(function (stat, i) {
            return (
              <div key={i} style={{ textAlign: 'center', borderRight: (!isMobile && i < 3) ? '1px solid rgba(255,255,255,0.07)' : 'none', padding: '0 24px' }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: isSmall ? '30px' : isMobile ? '36px' : '44px', fontWeight: 800, color: '#A8FF3E', letterSpacing: '-1px' }}>
                  {stat.num}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', marginTop: '4px', fontWeight: 500 }}>
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: isMobile ? '72px 24px' : '100px 48px', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={pill}>How it works</div>
          <h2 style={sectionLabel}>Two sides. One platform.</h2>
          <p style={{ ...subText, margin: '0 auto' }}>Whether you want to earn or grow your brand, Taskivo is built for you.</p>
        </div>

        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '4px', maxWidth: '320px', margin: '0 auto 48px', border: '1px solid rgba(255,255,255,0.07)' }}>
          {['earner', 'creator'].map(function (tab) {
            return (
              <button
                key={tab}
                onClick={function () { setActiveTab(tab); }}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: '9px', border: 'none', cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 600, fontSize: '14px',
                  background: activeTab === tab ? '#A8FF3E' : 'transparent',
                  color: activeTab === tab ? '#0D0D14' : 'rgba(255,255,255,0.5)',
                  transition: 'all 0.2s',
                }}
              >
                {tab === 'earner' ? '💰 Earner' : '🎯 Creator'}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: '16px' }}>
          {(activeTab === 'earner'
            ? [
                { icon: '📋', title: 'Pick a task', desc: 'Browse YouTube videos, articles, or blog tasks that match your interests.' },
                { icon: '✅', title: 'Complete it', desc: 'Watch, read, or engage — then answer a quick quiz to confirm.' },
                { icon: '💸', title: 'Withdraw cash', desc: 'Cash out via mobile money, bank transfer, or PayPal when you\'re ready.' },
              ]
            : [
                { icon: '🚀', title: 'Post your task', desc: 'Set a reward, number of slots, and what you need earners to do.' },
                { icon: '👥', title: 'Earners engage', desc: 'Real people from around the world complete your task.' },
                { icon: '📈', title: 'See results', desc: 'Track completions and grow your channel or platform organically.' },
              ]
          ).map(function (step, i) {
            return (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '16px',
                padding: isMobile ? '24px' : '28px',
                position: 'relative',
                overflow: 'hidden',
              }}
                onMouseOver={function (e) { e.currentTarget.style.borderColor = 'rgba(168,255,62,0.25)'; }}
                onMouseOut={function (e) { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
              >
                <div style={{ fontSize: '28px', marginBottom: '16px' }}>{step.icon}</div>
                <div style={{ position: 'absolute', top: '20px', right: '20px', fontFamily: "'Syne', sans-serif", fontSize: '48px', fontWeight: 800, color: 'rgba(255,255,255,0.04)' }}>
                  {i + 1}
                </div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '18px', marginBottom: '10px' }}>{step.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── TASK TYPES ── */}
      <section style={{ padding: isMobile ? '72px 24px' : '100px 48px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={pill}>Task types</div>
            <h2 style={sectionLabel}>Tasks that pay</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: '16px' }}>
            {[
              { icon: '▶️', color: '#FF4444', title: 'YouTube Tasks', desc: 'Watch videos, subscribe to channels, and earn bonus points for engaging.', badge: 'Most popular' },
              { icon: '📰', color: '#A8FF3E', title: 'Article Tasks', desc: 'Read blog posts and articles, then answer simple comprehension questions.', badge: 'Coming soon' },
              { icon: '✍️', color: '#4A9EFF', title: 'Writing Tasks', desc: 'Write short articles or reviews and earn higher rewards per task.', badge: 'Coming soon' },
            ].map(function (type, i) {
              return (
                <div key={i} style={{
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.07)',
                  padding: isMobile ? '24px' : '28px',
                  background: 'rgba(13,13,20,0.8)',
                  transition: 'transform 0.2s, border-color 0.2s',
                }}
                  onMouseOver={function (e) { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(168,255,62,0.2)'; }}
                  onMouseOut={function (e) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: type.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px' }}>
                      {type.icon}
                    </div>
                    <span style={{ background: i === 0 ? 'rgba(168,255,62,0.12)' : 'rgba(255,255,255,0.06)', color: i === 0 ? '#A8FF3E' : 'rgba(255,255,255,0.4)', border: '1px solid ' + (i === 0 ? 'rgba(168,255,62,0.2)' : 'rgba(255,255,255,0.1)'), borderRadius: '100px', padding: '3px 10px', fontSize: '11px', fontWeight: 600 }}>
                      {type.badge}
                    </span>
                  </div>
                  <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: '18px', marginBottom: '10px' }}>{type.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{type.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHY TASKIVO ── */}
      <section style={{ padding: isMobile ? '72px 24px' : '100px 48px', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={pill}>Why Taskivo</div>
          <h2 style={sectionLabel}>Built different</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4,1fr)', gap: '16px' }}>
          {[
            { icon: '🌍', title: 'Global', desc: '50+ countries supported' },
            { icon: '⚡', title: 'Instant', desc: 'Points credited immediately' },
            { icon: '🔒', title: 'Secure', desc: 'Verified tasks only' },
            { icon: '📱', title: 'Mobile first', desc: 'Works great on any phone' },
          ].map(function (feat, i) {
            return (
              <div key={i} style={{ textAlign: 'center', padding: isMobile ? '20px 12px' : '28px 16px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize: isMobile ? '28px' : '32px', marginBottom: '12px' }}>{feat.icon}</div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: isMobile ? '14px' : '16px', marginBottom: '6px' }}>{feat.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', lineHeight: 1.5 }}>{feat.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: isMobile ? '72px 24px' : '100px 48px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <div style={pill}>Reviews</div>
            <h2 style={sectionLabel}>Earners love it</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: '16px' }}>
            {[
              { name: 'Amara O.', country: '🇳🇬 Nigeria', quote: 'I withdrew my first ₦5,000 within a week. Tasks are easy and payouts are real.', avatar: 'AO' },
              { name: 'Kofi M.', country: '🇬🇭 Ghana', quote: 'Finally a platform that actually pays. I use it every day during my lunch break.', avatar: 'KM' },
              { name: 'Fatima B.', country: '🇰🇪 Kenya', quote: 'The YouTube tasks are fun and I earn while learning. Highly recommend Taskivo.', avatar: 'FB' },
            ].map(function (t, i) {
              return (
                <div key={i} style={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.07)', padding: isMobile ? '24px' : '28px', background: 'rgba(13,13,20,0.6)' }}>
                  <div style={{ color: '#A8FF3E', fontSize: '20px', marginBottom: '16px' }}>★★★★★</div>
                  <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '15px', lineHeight: 1.65, margin: '0 0 20px', fontStyle: 'italic' }}>
                    "{t.quote}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(168,255,62,0.15)', border: '1px solid rgba(168,255,62,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#A8FF3E', fontWeight: 700, fontSize: '12px' }}>
                      {t.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{t.name}</div>
                      <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px' }}>{t.country}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: isMobile ? '80px 24px' : '120px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: isMobile ? '300px' : '500px', height: isMobile ? '300px' : '500px', background: 'radial-gradient(circle, rgba(168,255,62,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
          <div style={pill}>Get started today</div>
          <h2 style={{ ...sectionLabel, fontSize: isSmall ? '32px' : isMobile ? '40px' : '56px' }}>
            Ready to start earning?
          </h2>
          <p style={{ ...subText, margin: '0 auto 40px', textAlign: 'center' }}>
            Join thousands of earners making real money completing simple tasks from their phone.
          </p>
          <button
            onClick={function () { setAuthMode('register'); navigate('auth'); }}
            style={{ ...btnPrimary, fontSize: isMobile ? '16px' : '18px', padding: isMobile ? '16px 36px' : '18px 48px' }}
            onMouseOver={function (e) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 48px rgba(168,255,62,0.4)'; }}
            onMouseOut={function (e) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 32px rgba(168,255,62,0.25)'; }}
          >
            Create Free Account →
          </button>
          <p style={{ marginTop: '16px', color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>No credit card. No hidden fees. Free forever.</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: isMobile ? '32px 24px' : '40px 48px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: '18px' }}>
          Taski<span style={{ color: '#A8FF3E' }}>vo</span>
        </div>
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', textAlign: 'center' }}>
          © 2025 Taskivo. All rights reserved.
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['Terms', 'Privacy', 'Support'].map(function (link) {
            return (
              <span key={link} style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', cursor: 'pointer' }}
                onMouseOver={function (e) { e.currentTarget.style.color = '#A8FF3E'; }}
                onMouseOut={function (e) { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; }}
              >
                {link}
              </span>
            );
          })}
        </div>
      </footer>

    </div>
  );
}
