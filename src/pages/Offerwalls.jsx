import { useState } from 'react';

export default function Offerwalls({ session, navigate }) {
  const user = session?.user;
  const [activeTab, setActiveTab] = useState('surveys');
  const [activeWall, setActiveWall] = useState(null);

  if (!user) {
    return (
      <div style={{ padding: 80, textAlign: 'center', color: '#94a3b8' }}>
        Please log in to access offerwalls and surveys.
      </div>
    );
  }

  // ── PARTNER CONFIGURATION ──
  const partners = [
    {
      id: 'cpx',
      name: 'CPX Research',
      category: 'surveys',
      badge: 'Active & Verified',
      description: 'High-paying market research surveys matched to your profile.',
      rewardEstimate: 'Earn up to 1,200 PTS',
      color: '#f59e0b',
      url: `https://offers.cpx-research.com/index.php?app_id=35336&ext_user_id=${user.id}`
    },
    {
      id: 'timewall',
      name: 'TimeWall',
      category: 'offers',
      badge: 'Pending Review',
      description: 'Quick micro-tasks, clicks, and short offers.',
      rewardEstimate: 'Earn up to 800 PTS',
      color: '#3b82f6',
      // TimeWall URL will be placed here once approved
      url: `https://timewall.io`
    }
  ];

  const activePartners = partners.filter((p) => p.category === activeTab);

  const styles = {
    wrap: {
      minHeight: '100vh',
      background: '#0a0a0f',
      padding: '32px 16px',
      color: '#f8fafc',
      fontFamily: 'sans-serif'
    },
    container: {
      maxWidth: 960,
      margin: '0 auto'
    },
    headerRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
      flexWrap: 'wrap',
      gap: 16
    },
    title: {
      fontSize: 28,
      fontWeight: 800,
      margin: 0
    },
    subtitle: {
      fontSize: 14,
      color: '#94a3b8',
      marginTop: 6
    },
    backBtn: {
      background: 'rgba(255, 255, 255, 0.08)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      color: '#fff',
      padding: '8px 16px',
      borderRadius: 20,
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer'
    },
    tabBar: {
      display: 'flex',
      gap: 10,
      marginBottom: 24,
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      paddingBottom: 12
    },
    tabBtn: (isActive) => ({
      background: isActive ? '#a8ff3e' : 'transparent',
      color: isActive ? '#000' : '#94a3b8',
      border: 'none',
      padding: '8px 20px',
      borderRadius: 16,
      fontSize: 13,
      fontWeight: 700,
      cursor: 'pointer'
    }),
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: 16
    },
    card: {
      background: 'rgba(255, 255, 255, 0.03)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: 16,
      padding: 20,
      cursor: 'pointer',
      position: 'relative'
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 700,
      margin: '8px 0 4px 0'
    },
    cardDesc: {
      fontSize: 13,
      color: '#94a3b8',
      marginBottom: 16,
      lineHeight: 1.4
    },
    badge: {
      display: 'inline-block',
      background: 'rgba(168, 255, 62, 0.15)',
      color: '#a8ff3e',
      padding: '4px 10px',
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 700
    },
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      background: '#0a0a0f',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column'
    },
    modalBar: {
      padding: '12px 20px',
      background: '#12121a',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    closeBtn: {
      background: '#ef4444',
      color: '#fff',
      border: 'none',
      padding: '6px 14px',
      borderRadius: 12,
      fontSize: 12,
      fontWeight: 700,
      cursor: 'pointer'
    },
    iframe: {
      flex: 1,
      width: '100%',
      height: '100%',
      border: 'none',
      background: '#fff'
    }
  };

  return (
    <div style={styles.wrap}>
      {/* Fullscreen Iframe Modal */}
      {activeWall && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBar}>
            <div>
              <div style={{ fontSize: 11, color: '#a8ff3e', fontWeight: 700 }}>LIVE PROVIDER</div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{activeWall.name}</div>
            </div>
            <button style={styles.closeBtn} onClick={() => setActiveWall(null)}>
              Close
            </button>
          </div>
          <iframe
            src={activeWall.url}
            style={styles.iframe}
            allow="camera; microphone; geolocation"
            title={activeWall.name}
          />
        </div>
      )}

      <div style={styles.container}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>Offerwalls & Surveys</h1>
            <p style={styles.subtitle}>Complete surveys and offers to earn major PTS rewards.</p>
          </div>
          <button style={styles.backBtn} onClick={() => navigate('dashboard')}>
            ← Back to Dashboard
          </button>
        </div>

        <div style={styles.tabBar}>
          <button
            style={styles.tabBtn(activeTab === 'surveys')}
            onClick={() => setActiveTab('surveys')}
          >
            📋 Surveys
          </button>
          <button
            style={styles.tabBtn(activeTab === 'offers')}
            onClick={() => setActiveTab('offers')}
          >
            🎮 Offers & Tasks
          </button>
        </div>

        <div style={styles.grid}>
          {activePartners.map((partner) => (
            <div
              key={partner.id}
              style={styles.card}
              onClick={() => setActiveWall(partner)}
            >
              <div style={{ fontSize: 11, color: partner.color, fontWeight: 700 }}>
                {partner.badge}
              </div>
              <h3 style={styles.cardTitle}>{partner.name}</h3>
              <p style={styles.cardDesc}>{partner.description}</p>
              <div style={styles.badge}>{partner.rewardEstimate}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
