import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Offerwalls({ session, navigate }) {
  const user = session?.user;
  const [activeWall, setActiveWall] = useState(null);
  const [opening, setOpening] = useState(false);
  const [notice, setNotice] = useState('');
  const previewUrl = 'https://offerwall.gg/wall/8542a96e28f4b8ade0318ce71a324144';

  if (!user) {
    return (
      <div style={{ padding: 80, textAlign: 'center', color: '#94a3b8' }}>
        Please log in to access offerwalls.
      </div>
    );
  }

  const partners = [{ id: 'offerwall-gg', name: 'Offerwall.GG — Surveys & Paid Offers', badge: 'Partner-funded rewards', description: 'Explore available surveys, sponsored offers and eligible game tasks. Availability varies by location. Rewards remain pending until verified and settled.', rewardEstimate: 'Rewards vary by offer', color: '#a8ff3e' }];

  async function openWall(partner) {
    if (opening) return;
    setOpening(true);
    setNotice('');
    try {
      const { data, error } = await supabase.functions.invoke('offerwall-gg-link', { body: {} });
      if (error) throw error;
      if (!data?.enabled) { setNotice('Live earning is not open yet. You can explore the read-only provider preview below.'); return; }
      const link = new URL(data.url);
      if (link.origin !== 'https://offerwall.gg' || !link.pathname.startsWith('/wall/')) throw new Error('Invalid wall URL');
      setActiveWall({ ...partner, url: link.href });
    } catch { setNotice('The offerwall is temporarily unavailable. Please try again later.'); }
    finally { setOpening(false); }
  }

  const styles = {
    wrap: {
      minHeight: '100vh',
      background: 'var(--surface)',
      padding: '32px 5%',
      color: 'var(--ink)',
      fontFamily: "'Inter', sans-serif"
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
      color: 'var(--slate)',
      marginTop: 6
    },
    backBtn: {
      background: 'var(--surface-card)',
      border: '1px solid var(--line)',
      color: 'var(--ink)',
      padding: '8px 16px',
      borderRadius: 20,
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: 16,
      marginTop: 20
    },
    card: {
      background: 'var(--surface-card)',
      border: '1px solid var(--line)',
      borderRadius: 16,
      padding: 24,
      cursor: 'pointer',
      position: 'relative'
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 700,
      margin: '12px 0 6px 0'
    },
    cardDesc: {
      fontSize: 13,
      color: 'var(--slate)',
      marginBottom: 16,
      lineHeight: 1.5
    },
    badge: {
      display: 'inline-block',
      background: 'rgba(168, 255, 62, 0.15)',
      color: 'var(--lime)',
      padding: '4px 10px',
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 700
    },
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      background: 'var(--surface)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column'
    },
    modalBar: {
      padding: '12px 20px',
      background: 'var(--surface-card)',
      borderBottom: '1px solid var(--line)',
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
      {activeWall && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalBar}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--lime)', fontWeight: 700 }}>OFFERWALL PORTAL</div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{activeWall.name}</div>
            </div>
            <button style={styles.closeBtn} onClick={() => setActiveWall(null)}>
              Close Portal
            </button>
          </div>
          <iframe
            src={activeWall.url}
            style={styles.iframe}
            allow="clipboard-write"
            referrerPolicy="strict-origin-when-cross-origin"
            title={activeWall.name}
          />
        </div>
      )}

      <div style={styles.container}>
        <div style={styles.headerRow}>
          <div>
            <h1 style={styles.title}>Offerwalls & Surveys</h1>
            <p style={styles.subtitle}>Explore partner-funded surveys and eligible offers. No deposit is required.</p>
          </div>
          <button style={styles.backBtn} onClick={() => navigate('tasks')}>
            ← Back to Tasks
          </button>
        </div>

        <div style={{...styles.card,cursor:'default',marginBottom:20}}>
          <h2 style={{fontSize:18,margin:'0 0 8px'}}>Preview available offers</h2>
          <p style={styles.cardDesc}>Explore the provider catalogue without a linked earning account. Preview mode does not award points. Live earning opens only after approval and integration testing.</p>
          <a href={previewUrl} target="_blank" rel="noopener noreferrer" style={{...styles.backBtn,display:'inline-block',textDecoration:'none'}}>Open read-only offerwall preview ↗</a>
        </div>
        {notice && <p role="status" style={{ color: "var(--slate)", marginTop: 16 }}>{notice}</p>}
        <div style={styles.grid}>
          {partners.map((partner) => (
            <button type="button"
              key={partner.id}
              style={{...styles.card, color: "var(--ink)", textAlign: "left"}}
              disabled={opening}
              onClick={() => openWall(partner)}
            >
              <div style={{ fontSize: 11, color: partner.color, fontWeight: 700 }}>
                {partner.badge}
              </div>
              <h3 style={styles.cardTitle}>{partner.name}</h3>
              <p style={styles.cardDesc}>{partner.description}</p>
              <div style={styles.badge}>{opening ? "Connecting…" : partner.rewardEstimate}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
