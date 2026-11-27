import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { supabase } from '../lib/supabase';

export default function Offerwalls({ session, navigate }) {
  const user = session?.user;
  const [activeWall, setActiveWall] = useState(null);
  const [opening, setOpening] = useState(false);
  const [notice, setNotice] = useState('');
  const [frameAttempt,setFrameAttempt]=useState(0);
  const [frameState,setFrameState]=useState('idle');
  const frameTimer=useRef(null);
  const requestLock=useRef(false);
  const wallOpen=!!activeWall;
  useEffect(()=>{
    if(!wallOpen)return;
    const previous=document.body.style.overflow;
    document.body.style.overflow='hidden';
    return()=>{document.body.style.overflow=previous;};
  },[wallOpen]);
  useEffect(()=>{
    if(!activeWall)return;
    setFrameState('loading');
    frameTimer.current=setTimeout(()=>setFrameState(s=>s==='loading'?'slow':s),12000);
    return()=>clearTimeout(frameTimer.current);
  },[activeWall?.url,frameAttempt]);
  function frameLoaded(){clearTimeout(frameTimer.current);setFrameState('loaded');}
  function closeWall(){clearTimeout(frameTimer.current);setActiveWall(null);setFrameState('idle');}


  if (!user) {
    return (
      <div style={{ padding: 80, textAlign: 'center', color: '#94a3b8' }}>
        Please log in to access offerwalls.
      </div>
    );
  }

  const partners = [{ id: 'offerwall-gg', name: 'Offerwall.GG — Surveys & Paid Offers', badge: 'Partner-funded rewards', description: 'Explore available surveys, sponsored offers and eligible game tasks. Availability varies by location. Verified rewards are credited to your wallet. Withdrawals follow the weekly Saturday schedule.', rewardEstimate: 'Rewards vary by offer', color: '#a8ff3e' }];

  // Keep Moonetix hidden until the backend wallet and reversal flow passes launch checks.
  if (import.meta.env.VITE_MOONETIX_LIVE_ENABLED === 'true') {
    partners.push({id:'moonetix',name:'Moonetix — Paid Offers',badge:'Partner-funded rewards',description:'Complete eligible sponsored offers. Availability varies by location. Rewards require provider verification. Withdrawals follow the weekly Saturday schedule.',rewardEstimate:'Rewards vary by offer',color:'#a8ff3e'});
  }

  async function openWall(partner) {
    if (requestLock.current) return;
    requestLock.current=true;
    setOpening(true);
    setNotice('');
    try {
      const { data, error } = await supabase.functions.invoke(partner.id === 'moonetix' ? 'moonetix-link' : 'offerwall-gg-link', { body: {} });
      if (error) throw error;
      if (!data?.enabled) { setNotice('Offerwall access is not available for this account.'); return; }
      const link = new URL(data.url);
      const validLink = partner.id === 'moonetix'
        ? link.origin === 'https://wall.moonetix.com' && link.pathname === '/808a5b2fd2760f39ed2cd6ea'
        : link.origin === 'https://offerwall.gg' && link.pathname.startsWith('/wall/');
      if (!validLink) throw new Error('Invalid wall URL');
      setActiveWall({ ...partner, url: link.href });
      setFrameAttempt(n=>n+1);
    } catch { setNotice('The offerwall is temporarily unavailable. Please try again later.'); }
    finally { requestLock.current=false;setOpening(false); }
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
      gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%,300px), 1fr))',
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
      zIndex: 1000002,
      height: '100dvh',
      overflow:'hidden',
      display: 'flex',
      flexDirection: 'column'
    },
    modalBar: {
      flexShrink:0,
      padding: '10px 14px',
      background: 'var(--surface-card)',
      borderBottom: '1px solid var(--line)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap:10
    },
    closeBtn: {
      background: '#ef4444',
      color: '#fff',
      border: 'none',
      padding: '6px 14px',
      borderRadius: 12,
      fontSize: 12,
      fontWeight: 700,
      cursor: 'pointer',
      whiteSpace:'nowrap',flexShrink:0
    },
    iframe: {
      flex: '1 1 0',
      width: '100%',
      height: '100%',
      minHeight:0,
      display:'block',
      border: 'none',
      background: '#fff'
    }
  };

  return (
    <div style={styles.wrap}>
      {activeWall && createPortal(
        <div style={styles.modalOverlay} role="dialog" aria-modal="true" aria-label="Offerwall portal">
          <div style={styles.modalBar}>
            <div style={{minWidth:0}}>
              <div style={{fontSize:10,color:'var(--lime)',fontWeight:800}}>OFFERWALL PORTAL</div>
              <div style={{fontSize:14,fontWeight:800}}>{activeWall.id === 'moonetix' ? 'Moonetix' : 'Offerwall.GG'}</div>
            </div>
            <button style={styles.closeBtn} onClick={closeWall}>Close</button>
          </div>
          <div style={{flexShrink:0,background:'var(--surface-card)',borderBottom:'1px solid var(--line)',padding:'9px 14px',color:'var(--slate)',fontSize:12,lineHeight:1.5}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,flexWrap:'wrap'}}>
              <span role="status">{opening?'Reconnecting…':frameState==='loading'?'Connecting to offer provider…':frameState==='slow'||frameState==='error'?'Offerwall is taking longer than expected.':'Blank page? Try reloading.'}</span>
              <button type="button" disabled={opening} onClick={()=>openWall(activeWall)} style={{...styles.backBtn,padding:'6px 12px'}}>Reload</button>
            </div>
            {notice&&<p role="alert" style={{margin:'6px 0 0'}}>{notice}</p>}
            <details style={{marginTop:6}}><summary style={{cursor:'pointer',color:'var(--ink)',fontWeight:700}}>Having trouble loading?</summary><p style={{margin:'8px 0'}}>If this stays blank, reopen Taskivo in your usual browser, then retry. Your connection or the offer provider may be blocking the embedded page.</p><a href={activeWall.url} target="_blank" rel="noopener" referrerPolicy="strict-origin-when-cross-origin" style={{color:'var(--lime)',fontWeight:700}}>Try opening the provider in a new tab ↗</a><p style={{margin:'6px 0 0'}}>The provider may require the embedded portal. If it still fails, close this window and contact <button onClick={()=>{closeWall();navigate('support');}} style={{padding:0,border:0,background:'transparent',color:'var(--lime)',textDecoration:'underline',cursor:'pointer'}}>Help &amp; Support</button>.</p></details>
          </div>
          <iframe
            key={frameAttempt}
            src={activeWall.url}
            style={styles.iframe}
            allow="clipboard-write"
            referrerPolicy="strict-origin-when-cross-origin"
            title={activeWall.name}
            onLoad={frameLoaded}
            onError={()=>{clearTimeout(frameTimer.current);setFrameState('error');}}
          />
        </div>,document.body
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
