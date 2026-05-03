import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0F',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center'
    }}>

      {/* Logo mark */}
      <div style={{
        width: '48px',
        height: '48px',
        background: '#A8FF3E',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '32px'
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 12L10 17L19 7" stroke="#0A0A0F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <h1 style={{
        fontFamily: 'Syne, sans-serif',
        fontSize: 'clamp(36px, 8vw, 64px)',
        fontWeight: '800',
        color: '#ffffff',
        letterSpacing: '-0.03em',
        lineHeight: '1.05',
        marginBottom: '16px',
        maxWidth: '600px'
      }}>
        Complete Tasks.<br />
        <span style={{ color: '#A8FF3E' }}>Get Paid.</span>
      </h1>

      <p style={{
        color: '#6B7280',
        fontSize: '17px',
        lineHeight: '1.6',
        maxWidth: '420px',
        marginBottom: '36px'
      }}>
        Taskivo connects creators with a global audience. Do real tasks, earn real rewards.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '14px 28px',
            background: '#A8FF3E',
            color: '#0A0A0F',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '700',
            cursor: 'pointer',
            letterSpacing: '-0.01em'
          }}
        >
          Start Earning →
        </button>
        <button
          onClick={() => navigate('/login')}
          style={{
            padding: '14px 28px',
            background: 'transparent',
            color: '#ffffff',
            border: '1px solid #1E1E2E',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          For Creators
        </button>
      </div>

      {/* Stats row */}
      <div style={{
        display: 'flex',
        gap: '40px',
        marginTop: '64px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {[
          { value: '84K+', label: 'Global Users' },
          { value: '2M+', label: 'Tasks Completed' },
          { value: '$420K', label: 'Total Paid Out' }
        ].map(stat => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: '28px',
              fontWeight: '800',
              color: '#ffffff',
              letterSpacing: '-0.03em'
            }}>
              {stat.value}
            </div>
            <div style={{ color: '#6B7280', fontSize: '13px', marginTop: '4px' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
