import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0A0A0F 0%, #0D0D18 50%, #0A0F1A 100%)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'DM Sans, sans-serif'
    }}>

      {/* Navbar */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 32px',
        borderBottom: '1px solid rgba(255,255,255,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: '#ffffff',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8L6.5 11.5L13 5" stroke="#0A0A0F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '17px',
            fontWeight: '800',
            color: '#ffffff',
            letterSpacing: '-0.02em'
          }}>
            Taskivo
          </span>
        </div>

        <button
          onClick={function() { navigate('/login') }}
          style={{
            padding: '9px 20px',
            background: '#ffffff',
            color: '#0A0A0F',
            border: 'none',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            letterSpacing: '-0.01em'
          }}
        >
          Get Started
        </button>
      </nav>

      {/* Hero */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px 60px',
        textAlign: 'center'
      }}>

        {/* Eyebrow pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '99px',
          padding: '6px 14px',
          marginBottom: '32px'
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            background: '#4ade80',
            borderRadius: '50%'
          }} />
          <span style={{
            fontSize: '12px',
            fontWeight: '500',
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: '0.04em'
          }}>
            Now live in 40+ countries
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '56px',
          fontWeight: '800',
          color: '#ffffff',
          letterSpacing: '-0.04em',
          lineHeight: '1.0',
          marginBottom: '20px',
          maxWidth: '560px'
        }}>
          Complete Tasks.
          <br />
          <span style={{
            color: 'rgba(255,255,255,0.35)'
          }}>
            Get Paid.
          </span>
        </h1>

        {/* Subheadline */}
        <p style={{
          color: 'rgba(255,255,255,0.4)',
          fontSize: '16px',
          lineHeight: '1.7',
          maxWidth: '380px',
          marginBottom: '40px',
          fontWeight: '400'
        }}>
          A global platform connecting creators with real audiences.
          Complete tasks, earn points, withdraw anytime.
        </p>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          gap: '10px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '72px'
        }}>
          <button
            onClick={function() { navigate('/login') }}
            style={{
              padding: '14px 32px',
              background: '#ffffff',
              color: '#0A0A0F',
              border: 'none',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              letterSpacing: '-0.01em'
            }}
          >
            Start Earning →
          </button>
          <button
            onClick={function() { navigate('/login') }}
            style={{
              padding: '14px 32px',
              background: 'transparent',
              color: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            For Creators
          </button>
        </div>

        {/* Divider */}
        <div style={{
          width: '100%',
          maxWidth: '480px',
          height: '1px',
          background: 'rgba(255,255,255,0.06)',
          marginBottom: '48px'
        }} />

        {/* Stats */}
        <div style={{
          display: 'flex',
          gap: '0px',
          width: '100%',
          maxWidth: '480px',
          justifyContent: 'space-around'
        }}>
          {[
            { value: '84K+', label: 'Users Worldwide' },
            { value: '2M+', label: 'Tasks Completed' },
            { value: '$420K', label: 'Total Paid Out' }
          ].map(function(stat, i) {
            return (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'Syne, sans-serif',
                  fontSize: '26px',
                  fontWeight: '800',
                  color: '#ffffff',
                  letterSpacing: '-0.03em',
                  lineHeight: '1'
                }}>
                  {stat.value}
                </div>
                <div style={{
                  color: 'rgba(255,255,255,0.3)',
                  fontSize: '12px',
                  marginTop: '6px',
                  fontWeight: '400'
                }}>
                  {stat.label}
                </div>
              </div>
            )
          })}
        </div>

      </div>

      {/* Footer */}
      <div style={{
        padding: '20px 32px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>
          © 2025 Taskivo
        </span>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['About', 'Privacy', 'Terms'].map(function(link) {
            return (
              <span key={link} style={{
                color: 'rgba(255,255,255,0.25)',
                fontSize: '12px',
                cursor: 'pointer'
              }}>
                {link}
              </span>
            )
          })}
        </div>
      </div>

    </div>
  )
}
