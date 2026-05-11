export default function StaticPages({ pageType }) {
  const S = {
    page: { padding: '80px 5%', maxWidth: 800, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', background: 'var(--surface)' },
    title: { fontFamily: "'Inter', sans-serif", fontSize: 40, color: 'var(--ink)', marginBottom: 24, fontWeight: 800, letterSpacing: '-1px' },
    h2: { fontFamily: "'Inter', sans-serif", fontSize: 20, color: 'var(--ink)', margin: '40px 0 16px 0', fontWeight: 700 },
    p: { color: 'var(--slate)', fontSize: 15, lineHeight: 1.7, marginBottom: 16 },
    accentBlock: { padding: 24, background: 'var(--surface-card)', borderLeft: '4px solid var(--lime)', border: '1px solid var(--line)', borderLeftWidth: 4, borderRadius: '0 12px 12px 0', marginBottom: 32 }
  };

  const content = {
    terms: {
      title: "Terms of Service",
      date: "Last Updated: May 2026",
      body: (
        <>
          <div style={S.accentBlock}>
            <p style={{...S.p, margin: 0, color: 'var(--ink)', fontWeight: 600}}>By accessing the Taskivo infrastructure, you agree to strict compliance with our Anti-Cheat and algorithmic safety protocols.</p>
          </div>
          <h2 style={S.h2}>1. Account Integrity</h2>
          <p style={S.p}>Users must provide accurate identity information. The use of automated scripts, VPNs to mask geography, or multiple accounts by a single individual will result in immediate and permanent network termination.</p>
          <h2 style={S.h2}>2. Financial Clearing</h2>
          <p style={S.p}>All points earned are held in ledger pending final verification. Taskivo reserves the right to withhold payouts if algorithmic anomalies or artificial engagement patterns are detected on an account.</p>
        </>
      )
    },
    privacy: {
      title: "Privacy Architecture",
      date: "Last Updated: May 2026",
      body: (
        <>
          <p style={S.p}>Taskivo engineers its platform to collect the minimum viable telemetry required to verify human attention and execute financial distributions.</p>
          <h2 style={S.h2}>Data Collection</h2>
          <p style={S.p}>We collect session duration, interaction milestones, and hardware profiling strictly for the purpose of maintaining network integrity against botfarms.</p>
          <h2 style={S.h2}>Financial Data</h2>
          <p style={S.p}>Banking information provided for withdrawal routing is encrypted and utilized solely for payment processing. We do not sell user telemtry to third-party brokers.</p>
        </>
      )
    },
    about: {
      title: "About Taskivo",
      date: "Established 2026",
      body: (
        <>
          <h2 style={{...S.h2, marginTop: 0}}>The Verification Layer of the Internet.</h2>
          <p style={S.p}>Taskivo bridges the gap between digital businesses demanding real human attention and global contributors seeking verifiable micro-earning opportunities.</p>
          <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
            <div style={{ flex: 1, padding: 24, background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 16 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--lime)', marginBottom: 8 }}>100%</div>
              <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 600 }}>Human Attention Guaranteed</div>
            </div>
            <div style={{ flex: 1, padding: 24, background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 16 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--lime)', marginBottom: 8 }}>T+1</div>
              <div style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 600 }}>Rapid Payout Execution</div>
            </div>
          </div>
        </>
      )
    }
  };

  const current = content[pageType] || content.terms;

  return (
    <div style={S.page}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>{current.date}</div>
      <h1 style={S.title}>{current.title}</h1>
      <div style={{ height: 1, background: 'var(--line)', margin: '32px 0' }} />
      <div>{current.body}</div>
    </div>
  );
}
