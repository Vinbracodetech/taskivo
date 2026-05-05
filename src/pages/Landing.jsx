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
  }, []);

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

      /* ALL text sizes forced to be responsive */
      html {
        font-size: 16px;
      }

      @media (max-width: 768px) {
        html {
          font-size: 14px;
        }
      }

      @media (max-width: 640px) {
        html {
          font-size: 13px;
        }
      }

      @media (max-width: 480px) {
        html {
          font-size: 12px;
        }
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
    { initials: 'JR', name: 'James R.', role: 'Earner — United States', text: '"I completed 12 tasks in my first week and withdrew straight to PayPal. The timer system makes it feel legitimate."' },
    { initials: 'AO', name: 'Amaka O.', role: 'Earner — Nigeria', text: '"I\'ve already withdrawn three times via Paystack. The quiz makes it fair — only real viewers get paid."' },
    { initials: 'FK', name: 'Faith K.', role: 'Earner — Kenya', text: '"Tasks go live every day and the points add up fast. I love that I can do this from my phone."' },
    { initials: 'MC', name: 'Marcus C.', role: 'Creator — Canada', text: '"I tried other platforms and got bot views. With Taskivo every viewer answered my quiz correctly."' },
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

      {/* NAV - SIMPLE MOBILE-FIRST */}
      <nav style={{
        position: 'sticky', 
        top: 0, 
        zIndex: 99,
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: `1px solid ${C.line}`,
        padding: '12px 16px',
        height: 'auto',
        minHeight: '56px',
      }}>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800, 
          color: C.ink,
          display: 'flex', 
          alignItems: 'center', 
          gap: 6,
          fontSize: 'clamp(16px, 5vw, 19px)',
        }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.lime, display: 'inline-block' }}></span>
          Taskivo
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button style={{
            background: 'none', 
            border: 'none', 
            fontWeight: 500,
            color: C.slate, 
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", 
            borderRadius: 8,
            padding: '6px 12px',
            fontSize: 'clamp(11px, 4vw, 13px)',
          }} onClick={function () { navigate('auth'); }}>Log in</button>
          <button style={{
            background: C.ink, 
            border: 'none',
            fontWeight: 600, 
            color: C.lime, 
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", 
            borderRadius: 8,
            padding: '7px 14px',
            fontSize: 'clamp(11px, 4vw, 13px)',
          }} onClick={function () { navigate('auth'); }}>Get Started →</button>
        </div>
      </nav>

      {/* HERO - FIXED SIZES */}
      <div style={{ 
        background: C.ink, 
        padding: 'clamp(40px, 10vw, 88px) 16px clamp(36px, 8vw, 72px) 16px',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: 6,
            background: 'rgba(168,255,62,0.08)',
            border: '1px solid rgba(168,255,62,0.18)',
            color: 'rgba(168,255,62,0.8)',
            fontSize: 'clamp(8px, 3vw, 10px)', 
            fontWeight: 600,
            letterSpacing: '1.2px', 
            textTransform: 'uppercase',
            padding: '4px 10px', 
            borderRadius: 100, 
            marginBottom: 'clamp(16px, 5vw, 22px)',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.lime, animation: 'pulse 2s infinite' }}></span>
            Live — Tasks available now
          </div>
          
          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            color: C.white, 
            marginBottom: 'clamp(10px, 3vw, 14px)',
            fontSize: 'clamp(28px, 8vw, 56px)',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}>
            Complete Tasks.<br />
            <span style={{ color: C.lime }}>Get Paid.</span><br />
            Grow Faster.
          </h1>
          
          <p style={{
            lineHeight: 1.6, 
            color: 'rgba(255,255,255,0.45)',
            maxWidth: 400, 
            fontWeight: 400, 
            margin: '0 auto',
            fontSize: 'clamp(12px, 4vw, 16px)',
            padding: '0 8px',
          }}>
            The platform where earners complete real YouTube tasks and creators get genuine engagement. Simple. Transparent. Global.
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: 10, 
            justifyContent: 'center', 
            flexWrap: 'wrap',
            margin: 'clamp(24px, 6vw, 56px) 0',
          }}>
            <button style={{
              background: C.lime, 
              color: C.ink, 
              border: 'none', 
              borderRadius: 10,
              fontWeight: 700, 
              cursor: 'pointer', 
              fontFamily: "'DM Sans', sans-serif",
              padding: 'clamp(10px, 3vw, 13px) clamp(16px, 5vw, 26px)',
              fontSize: 'clamp(12px, 3.5vw, 14px)',
            }} onClick={function () { navigate('auth'); }}>Start Earning Free →</button>
            <button style={{
              background: 'rgba(255,255,255,0.06)', 
              color: 'rgba(255,255,255,0.75)',
              border: '1px solid rgba(255,255,255,0.12)', 
              borderRadius: 10,
              fontWeight: 500, 
              cursor: 'pointer', 
              fontFamily: "'DM Sans', sans-serif",
              padding: 'clamp(10px, 3vw, 13px) clamp(16px, 5vw, 26px)',
              fontSize: 'clamp(12px, 3.5vw, 14px)',
            }} onClick={function () { navigate('auth'); }}>I'm a Creator</button>
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            borderTop: '1px solid rgba(255,255,255,0.06)', 
            paddingTop: 'clamp(20px, 6vw, 28px)',
            flexWrap: 'wrap',
            gap: '8px',
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
                  minWidth: '70px',
                  borderRight: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                }}>
                  <div style={{ 
                    fontFamily: "'Syne', sans-serif", 
                    fontWeight: 800, 
                    color: C.white,
                    fontSize: 'clamp(15px, 5vw, 26px)',
                  }}>{stat.num}</div>
                  <div style={{ 
                    color: 'rgba(255,255,255,0.3)', 
                    marginTop: 3, 
                    fontWeight: 400,
                    fontSize: 'clamp(9px, 3vw, 11px)',
                  }}>{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* AUDIENCE SECTION */}
      <section style={{ 
        background: C.white, 
        padding: 'clamp(40px, 8vw, 80px) 16px',
      }}>
        <div style={{ maxWidth: 480, marginBottom: 28 }}>
          <div style={{ 
            fontSize: 'clamp(10px, 3vw, 11px)', 
            fontWeight: 600, 
            letterSpacing: 2, 
            textTransform: 'uppercase', 
            color: C.lime, 
            marginBottom: 8 
          }}>Who Is Taskivo For?</div>
          <h2 style={{ 
            fontFamily: "'Syne', sans-serif", 
            fontWeight: 800, 
            color: C.ink, 
            lineHeight: 1.2, 
            marginBottom: 10,
            fontSize: 'clamp(22px, 6vw, 36px)',
          }}>Two sides.<br />One platform.</h2>
          <p style={{ 
            color: C.slate, 
            lineHeight: 1.6,
            fontSize: 'clamp(12px, 4vw, 15px)',
          }}>
            Whether you want to earn money completing tasks or grow your YouTube channel with verified engagement — Taskivo was built for you.
          </p>
        </div>
        
        <div style={{
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
          borderRadius: 20,
        }}>
          {[
            { tag: 'For Earners', title: 'Complete tasks.\nEarn real cash.', desc: 'Watch YouTube videos, complete simple actions, and withdraw real money. No experience needed. Works from any phone.', steps: earnerSteps, btn: 'Start Earning Free →' },
            { tag: 'For Creators', title: 'Real views.\nReal engagement.', desc: 'Get verified views, likes, and comments from real people. Every earner passes a quiz proving they actually watched.', steps: creatorSteps, btn: 'Post Your First Task →' },
          ].map(function (card, ci) {
            return (
              <div key={ci} style={{ 
                background: C.white, 
                position: 'relative',
                border: `1px solid ${C.line}`,
                borderRadius: 16,
                padding: 'clamp(20px, 5vw, 40px) clamp(16px, 4vw, 36px)',
              }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: C.lime, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}></div>
                <span style={{ 
                  display: 'inline-block', 
                  background: C.limeDim, 
                  color: '#4a7a00', 
                  fontSize: 'clamp(10px, 3vw, 11px)', 
                  fontWeight: 700, 
                  letterSpacing: 1, 
                  textTransform: 'uppercase', 
                  padding: '4px 10px', 
                  borderRadius: 6, 
                  marginBottom: 14 
                }}>{card.tag}</span>
                <div style={{ 
                  fontFamily: "'Syne', sans-serif", 
                  fontWeight: 800, 
                  color: C.ink, 
                  marginBottom: 8, 
                  whiteSpace: 'pre-line',
                  fontSize: 'clamp(18px, 5vw, 22px)',
                }}>{card.title}</div>
                <p style={{ 
                  color: C.slate, 
                  lineHeight: 1.6,
                  fontSize: 'clamp(12px, 3.5vw, 14px)',
                  marginBottom: 20,
                }}>{card.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 20 }}>
                  {card.steps.map(function (step, i) {
                    return (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                        <span style={{ 
                          width: 20, 
                          height: 20, 
                          borderRadius: '50%', 
                          background: C.ink, 
                          color: C.lime, 
                          fontSize: 'clamp(9px, 3vw, 10px)', 
                          fontWeight: 800, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          flexShrink: 0, 
                          marginTop: 2 
                        }}>{i + 1}</span>
                        <span style={{ 
                          color: '#444', 
                          lineHeight: 1.5,
                          fontSize: 'clamp(12px, 3.5vw, 13px)',
                        }}>{step}</span>
                      </li>
                    );
                  })}
                </ul>
                <button style={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: 6, 
                  background: C.ink, 
                  color: C.lime, 
                  border: 'none', 
                  borderRadius: 8, 
                  fontWeight: 600, 
                  cursor: 'pointer', 
                  fontFamily: "'DM Sans', sans-serif",
                  padding: 'clamp(8px, 3vw, 10px) clamp(14px, 4vw, 18px)',
                  fontSize: 'clamp(11px, 3.5vw, 13px)',
                }} onClick={function () { navigate('auth'); }}>{card.btn}</button>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ 
        background: C.off, 
        padding: 'clamp(40px, 8vw, 80px) 16px',
      }}>
        <div style={{ 
          fontSize: 'clamp(10px, 3vw, 11px)', 
          fontWeight: 600, 
          letterSpacing: 2, 
          textTransform: 'uppercase', 
          color: C.lime, 
          marginBottom: 8 
        }}>Platform Features</div>
        <h2 style={{ 
          fontFamily: "'Syne', sans-serif", 
          fontWeight: 800, 
          color: C.ink, 
          lineHeight: 1.2, 
          marginBottom: 10,
          fontSize: 'clamp(22px, 6vw, 36px)',
        }}>Built for trust.<br />Designed for scale.</h2>
        <p style={{ 
          color: C.slate, 
          lineHeight: 1.6, 
          maxWidth: 440,
          fontSize: 'clamp(12px, 4vw, 15px)',
          marginBottom: 'clamp(24px, 6vw, 36px)',
        }}>Every feature exists to guarantee genuine engagement — not gaming the system.</p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 12,
        }}>
          {features.map(function (f, i) {
            return (
              <div key={i} style={{ 
                background: C.white, 
                borderRadius: 14, 
                border: `1px solid ${C.line}`,
                padding: 'clamp(14px, 4vw, 28px) clamp(12px, 4vw, 24px)',
              }}>
                <div style={{ 
                  width: 'clamp(32px, 8vw, 36px)', 
                  height: 'clamp(32px, 8vw, 36px)', 
                  borderRadius: 10, 
                  background: C.limeDim, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: 'clamp(16px, 4vw, 18px)', 
                  marginBottom: 10 
                }}>{f.icon}</div>
                <div style={{ 
                  fontFamily: "'Syne', sans-serif", 
                  fontWeight: 700, 
                  color: C.ink, 
                  marginBottom: 5,
                  fontSize: 'clamp(13px, 4vw, 15px)',
                }}>{f.name}</div>
                <p style={{ 
                  color: C.slate, 
                  lineHeight: 1.6,
                  fontSize: 'clamp(11px, 3.5vw, 13px)',
                }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ 
        background: C.ink, 
        padding: 'clamp(40px, 8vw, 80px) 16px',
      }}>
        <div style={{ 
          fontSize: 'clamp(10px, 3vw, 11px)', 
          fontWeight: 600, 
          letterSpacing: 2, 
          textTransform: 'uppercase', 
          color: 'rgba(168,255,62,0.5)', 
          marginBottom: 8 
        }}>What People Say</div>
        <h2 style={{ 
          fontFamily: "'Syne', sans-serif", 
          fontWeight: 800, 
          color: C.white, 
          lineHeight: 1.2, 
          marginBottom: 10,
          fontSize: 'clamp(22px, 6vw, 36px)',
        }}>Trusted worldwide.</h2>
        <p style={{ 
          color: 'rgba(255,255,255,0.4)', 
          lineHeight: 1.6, 
          maxWidth: 440,
          fontSize: 'clamp(12px, 4vw, 15px)',
          marginBottom: 'clamp(24px, 6vw, 36px)',
        }}>Real people. Real results. Real money.</p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 12,
        }}>
          {testimonials.map(function (t, i) {
            return (
              <div key={i} style={{ 
                background: 'rgba(255,255,255,0.04)', 
                border: '1px solid rgba(255,255,255,0.07)', 
                borderRadius: 14,
                padding: 'clamp(16px, 4vw, 24px)',
              }}>
                <div style={{ color: C.lime, fontSize: 'clamp(10px, 3vw, 11px)', marginBottom: 10, letterSpacing: 2 }}>★★★★★</div>
                <p style={{ 
                  color: 'rgba(255,255,255,0.6)', 
                  lineHeight: 1.7, 
                  marginBottom: 16, 
                  fontStyle: 'italic',
                  fontSize: 'clamp(11px, 3.5vw, 13px)',
                }}>{t.text}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ 
                    width: 32, 
                    height: 32, 
                    borderRadius: '50%', 
                    background: C.limeDim, 
                    border: `1px solid ${C.limeBorder}`, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: 'clamp(10px, 3vw, 11px)', 
                    fontWeight: 700, 
                    color: C.lime, 
                    flexShrink: 0 
                  }}>{t.initials}</div>
                  <div>
                    <div style={{ fontSize: 'clamp(12px, 3.5vw, 13px)', fontWeight: 600, color: C.white }}>{t.name}</div>
                    <div style={{ fontSize: 'clamp(10px, 3vw, 11px)', color: 'rgba(255,255,255,0.3)', marginTop: 1 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section style={{ 
        background: C.white, 
        borderTop: `1px solid ${C.line}`, 
        textAlign: 'center',
        padding: 'clamp(40px, 10vw, 100px) 16px',
      }}>
        <div style={{ 
          display: 'inline-block', 
          background: C.limeDim, 
          color: '#3d6600', 
          fontSize: 'clamp(10px, 3vw, 11px)', 
          fontWeight: 700, 
          letterSpacing: 1, 
          textTransform: 'uppercase', 
          padding: '4px 12px', 
          borderRadius: 6, 
          marginBottom: 18 
        }}>Join Free Today</div>
        <h2 style={{ 
          fontFamily: "'Syne', sans-serif", 
          fontWeight: 800, 
          color: C.ink, 
          marginBottom: 12,
          fontSize: 'clamp(24px, 7vw, 48px)',
          lineHeight: 1.2,
        }}>
          Your time is{' '}<span style={{ color: C.lime, textDecoration: 'underline', textDecorationColor: 'rgba(168,255,62,0.4)' }}>worth more.</span>
        </h2>
        <p style={{ 
          color: C.slate, 
          marginBottom: 28, 
          maxWidth: 360, 
          marginLeft: 'auto', 
          marginRight: 'auto', 
          lineHeight: 1.6,
          fontSize: 'clamp(12px, 4vw, 15px)',
          padding: '0 8px',
        }}>
          Join thousands of earners already making money on Taskivo. Free to join. No skills required.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button style={{ 
            background: C.ink, 
            color: C.lime, 
            border: 'none', 
            borderRadius: 10, 
            fontWeight: 700, 
            cursor: 'pointer', 
            fontFamily: "'DM Sans', sans-serif",
            padding: 'clamp(10px, 3vw, 13px) clamp(16px, 5vw, 26px)',
            fontSize: 'clamp(12px, 3.5vw, 14px)',
          }} onClick={function () { navigate('auth'); }}>Start Earning Free →</button>
          <button style={{ 
            background: 'none', 
            color: C.slate, 
            border: `1px solid ${C.line}`, 
            borderRadius: 10, 
            fontWeight: 500, 
            cursor: 'pointer', 
            fontFamily: "'DM Sans', sans-serif",
            padding: 'clamp(10px, 3vw, 13px) clamp(16px, 5vw, 26px)',
            fontSize: 'clamp(12px, 3.5vw, 14px)',
          }} onClick={function () { navigate('auth'); }}>Post a Task</button>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          gap: 'clamp(10px, 4vw, 20px)',
          marginTop: 'clamp(14px, 4vw, 20px)',
        }}>
          {['Free to join', 'Instant payouts', 'No experience needed'].map(function (item) {
            return (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'clamp(10px, 3.5vw, 12px)', color: C.slate }}>
                <div style={{ 
                  width: 16, 
                  height: 16, 
                  borderRadius: '50%', 
                  background: C.limeDim, 
                  color: '#3d6600', 
                  fontSize: 'clamp(9px, 3vw, 10px)', 
                  fontWeight: 800, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center' 
                }}>✓</div>
                {item}
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ 
        background: C.ink, 
        color: 'rgba(255,255,255,0.4)',
        padding: 'clamp(32px, 8vw, 52px) 16px clamp(18px, 5vw, 28px) 16px',
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 'clamp(20px, 5vw, 32px)',
          marginBottom: 36,
        }}>
          <div style={{ gridColumn: 'auto' }}>
            <div style={{ 
              fontFamily: "'Syne', sans-serif", 
              fontSize: 'clamp(16px, 4vw, 17px)', 
              fontWeight: 800, 
              color: C.white, 
              marginBottom: 8, 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6 
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.lime, display: 'inline-block' }}></span>
              Taskivo
            </div>
            <p style={{ fontSize: 'clamp(12px, 3.5vw, 13px)', lineHeight: 1.6 }}>Complete tasks. Earn real cash. The global platform for earners and creators.</p>
          </div>
          {[
            { title: 'Platform', links: ['Browse Tasks', 'Earn Points', 'Withdraw', 'Leaderboard'] },
            { title: 'Creators', links: ['Post a Task', 'Pricing', 'Creator Dashboard', 'Analytics'] },
            { title: 'Company', links: ['About', 'Blog', 'Contact', 'Terms'] },
          ].map(function (col) {
            return (
              <div key={col.title}>
                <div style={{ 
                  fontSize: 'clamp(10px, 3vw, 11px)', 
                  fontWeight: 600, 
                  letterSpacing: '1.5px', 
                  textTransform: 'uppercase', 
                  color: 'rgba(255,255,255,0.25)', 
                  marginBottom: 14 
                }}>{col.title}</div>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {col.links.map(function (link) {
                    return (
                      <li key={link} style={{ marginBottom: 9 }}>
                        <a href="#" style={{ fontSize: 'clamp(12px, 3.5vw, 13px)', color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>{link}</a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
        <div style={{ 
          borderTop: '1px solid rgba(255,255,255,0.06)', 
          paddingTop: 18, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: 8,
          fontSize: 'clamp(11px, 3.5vw, 12px)',
        }}>
          <span>© 2025 Taskivo. All rights reserved.</span>
          <span>taskivo.online</span>
        </div>
      </footer>

    </div>
  );
}
