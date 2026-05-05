import { useEffect } from 'react';

const C = {
  ink: '#0D0D14',
  lime: '#A8FF3E',
  white: '#ffffff',
  off: '#F7F8FA',
  slate: '#6B7280',
};

export default function Landing({ navigate }) {

  useEffect(() => {
    document.title = 'Taskivo — Complete Tasks. Get Paid.';
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.ink }}>

      {/* NAV */}
      <nav style={{
        position: 'sticky',
        top: 0,
        padding: '14px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        background: 'rgba(13,13,20,0.7)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <b style={{ color: C.white }}>● Taskivo</b>
        <button
          onClick={() => navigate('auth')}
          style={{
            background: C.lime,
            color: C.ink,
            border: 'none',
            padding: '8px 14px',
            borderRadius: 8,
            fontWeight: 600
          }}>
          Get Started
        </button>
      </nav>

      {/* HERO */}
      <section style={{
        padding: '70px 16px',
        textAlign: 'center',
        maxWidth: 520,
        margin: '0 auto'
      }}>

        <div style={{
          fontSize: 10,
          color: C.lime,
          marginBottom: 12
        }}>
          ● LIVE — TASKS AVAILABLE NOW
        </div>

        <h1 style={{
          fontSize: 30,
          lineHeight: 1.2,
          fontWeight: 800,
          color: C.white,
          marginBottom: 14
        }}>
          Complete Tasks.<br />
          <span style={{ color: C.lime }}>Get Paid.</span><br />
          Grow Faster.
        </h1>

        <p style={{
          color: 'rgba(255,255,255,0.5)',
          fontSize: 14,
          marginBottom: 24
        }}>
          Earn money by completing real tasks. Help creators grow with verified engagement.
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }}>
          <button
            onClick={() => navigate('auth')}
            style={{
              background: C.lime,
              color: C.ink,
              padding: 14,
              borderRadius: 10,
              fontWeight: 700
            }}>
            Start Earning Free →
          </button>

          <button
            onClick={() => navigate('auth')}
            style={{
              background: 'transparent',
              color: '#ccc',
              padding: 14,
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
            I'm a Creator
          </button>
        </div>

        {/* STATS */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 30,
          paddingTop: 16,
          borderTop: '1px solid rgba(255,255,255,0.05)'
        }}>
          {['50K+', '2.1M', '12K+', '30+'].map((n, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ color: C.white, fontWeight: 700 }}>{n}</div>
              <div style={{ fontSize: 10, color: '#666' }}>
                {['Earners', 'Points', 'Tasks', 'Countries'][i]}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VALUE SECTION */}
      <section style={{
        background: C.white,
        padding: '50px 16px',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
      }}>

        <h2 style={{
          fontSize: 24,
          fontWeight: 800,
          marginBottom: 10
        }}>
          Two sides.<br />One platform.
        </h2>

        <p style={{
          color: C.slate,
          fontSize: 14,
          marginBottom: 20
        }}>
          Earn money or grow your channel — Taskivo works for both.
        </p>

        {/* CARDS */}
        <div style={{ display: 'grid', gap: 14 }}>

          {/* Earners */}
          <div style={{
            padding: 16,
            borderRadius: 14,
            border: '1px solid #eee'
          }}>
            <b>For Earners</b>
            <p style={{ fontSize: 13, color: '#666' }}>
              Complete tasks and withdraw real money directly.
            </p>
          </div>

          {/* Creators */}
          <div style={{
            padding: 16,
            borderRadius: 14,
            border: '1px solid #eee'
          }}>
            <b>For Creators</b>
            <p style={{ fontSize: 13, color: '#666' }}>
              Get real engagement from verified viewers.
            </p>
          </div>

        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{
        padding: '60px 16px',
        textAlign: 'center',
        background: C.white
      }}>
        <h2 style={{
          fontSize: 22,
          fontWeight: 800,
          marginBottom: 10
        }}>
          Your time is worth more.
        </h2>

        <button
          onClick={() => navigate('auth')}
          style={{
            background: C.ink,
            color: C.lime,
            padding: '14px 20px',
            borderRadius: 10,
            fontWeight: 700
          }}>
          Start Now →
        </button>
      </section>

    </div>
  );
}
