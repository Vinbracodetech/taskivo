export default function Landing() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0F',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{
        color: '#A8FF3E',
        fontFamily: 'sans-serif',
        fontSize: '32px'
      }}>
        Taskivo is working ✓
      </h1>
    </div>
  )
}        >
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
