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

  const features = [
    { icon: '⏱️', name: 'Timed Watch Sessions', desc: 'Earners must watch before actions unlock.' },
    { icon: '🧠', name: 'Anti-Cheat Quiz', desc: 'Proves real engagement.' },
    { icon: '💸', name: 'Real Withdrawals', desc: 'Withdraw via PayPal or bank.' },
    { icon: '🌍', name: 'Global Pool', desc: 'Earners worldwide.' },
    { icon: '📊', name: 'Reports', desc: 'Track real performance.' },
    { icon: '🛡️', name: 'Verified', desc: 'Manual review system.' },
  ];

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: C.off,
      color: C.ink,
      minHeight: '100vh'
    }}>

      {/* NAV */}
      <nav style={{
        position: 'sticky',
        top: 0,
        display: 'flex',
        alignItems: 'center',
        padding: '14px 16px',
        background: 'white',
        borderBottom: `1px solid ${C.line}`
      }}>
        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          flex: 1
        }}>
          Taskivo
        </div>

        <button onClick={function () { navigate('auth'); }} style={{
          background: 'none',
          border: 'none',
          marginRight: 8
        }}>
          Login
        </button>

        <button onClick={function () { navigate('auth'); }} style={{
          background: C.ink,
          color: C.lime,
          border: 'none',
          padding: '8px 12px',
          borderRadius: 6
        }}>
          Start
        </button>
      </nav>

      {/* HERO */}
      <div style={{
        padding: '40px 16px',
        textAlign: 'center',
        background: C.ink
      }}>
        <h1 style={{
          color: 'white',
          fontSize: 28,
          marginBottom: 10
        }}>
          Complete Tasks.<br />
          <span style={{ color: C.lime }}>Get Paid.</span>
        </h1>

        <p style={{
          color: '#aaa',
          fontSize: 14,
          marginBottom: 20
        }}>
          Earn money by completing simple tasks.
        </p>

        <button onClick={function () { navigate('auth'); }} style={{
          background: C.lime,
          border: 'none',
          padding: '10px 16px',
          borderRadius: 8,
          fontWeight: 600
        }}>
          Start Earning
        </button>
      </div>

      {/* FEATURES */}
      <div style={{ padding: 16 }}>
        <h2 style={{ marginBottom: 12 }}>Features</h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 10
        }}>
          {features.map(function (f, i) {
            return (
              <div key={i} style={{
                background: 'white',
                padding: 12,
                borderRadius: 8,
                border: `1px solid ${C.line}`
              }}>
                <div>{f.icon}</div>
                <div style={{ fontWeight: 600 }}>{f.name}</div>
                <div style={{ fontSize: 12 }}>{f.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div style={{
        padding: 20,
        textAlign: 'center'
      }}>
        <button onClick={function () { navigate('auth'); }} style={{
          background: C.ink,
          color: C.lime,
          border: 'none',
          padding: '12px 18px',
          borderRadius: 8
        }}>
          Join Free
        </button>
      </div>

    </div>
  );
}
