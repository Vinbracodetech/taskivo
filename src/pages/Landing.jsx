import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#0A0A0F', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>

      <div style={{ width: '48px', height: '48px', background: '#A8FF3E', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M5 12L10 17L19 7" stroke="#0A0A0F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '52px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.03em', lineHeight: '1.05', marginBottom: '16px' }}>
        Complete Tasks.
        <br />
        <span style={{ color: '#A8FF3E' }}>Get Paid.</span>
      </h1>

      <p style={{ color: '#6B7280', fontSize: '17px', lineHeight: '1.6', maxWidth: '420px', marginBottom: '36px' }}>
        Taskivo connects creators with a global audience. Do real tasks, earn real rewards.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={function() { navigate('/login') }}
          style={{ padding: '14px 28px', background: '#A8FF3E', color: '#0A0A0F', border: 'none', borderRadius: '12px', fontSize: '15px', fontWeight: '700', cursor: 'pointer' }}
        >
          Start Earning
        </button>
        <button
          onClick={function() { navigate('/login') }}
          style={{ padding: '14px 28px', background: 'transparent', color: '#ffffff', border: '1px solid #1E1E2E', borderRadius: '12px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
        >
          For Creators
        </button>
      </div>

      <div style={{ display: 'flex', gap: '48px', marginTop: '72px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: '800', color: '#ffffff' }}>84K+</div>
          <div style={{ color: '#6B7280', fontSize: '13px', marginTop: '4px' }}>Global Users</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: '800', color: '#ffffff' }}>2M+</div>
          <div style={{ color: '#6B7280', fontSize: '13px', marginTop: '4px' }}>Tasks Completed</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '28px', fontWeight: '800', color: '#ffffff' }}>$420K</div>
          <div style={{ color: '#6B7280', fontSize: '13px', marginTop: '4px' }}>Total Paid Out</div>
        </div>
      </div>

    </div>
  )
      }
