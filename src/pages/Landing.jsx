import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const C = {
  surface: 'var(--surface)',
  card: 'var(--surface-card)',
  glass: 'var(--glass)',
  textMain: 'var(--ink)',
  textMuted: 'var(--slate)',
  textInvert: 'var(--surface)',
  line: 'var(--line)',
  lime: '#A8FF3E',           
  limeText: 'var(--lime)',   
  limeDim: 'var(--lime-dim)',
  shadow: 'var(--shadow)'
};

export default function Landing({ navigate, setAuthMode }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [claimedSpots, setClaimedSpots] = useState(0);

  useEffect(function () {
    document.title = 'Taskivo — Digital Engagement Infrastructure';
  }, []);

  useEffect(function () {
    async function fetchPilotData() {
      try {
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'creator')
          .eq('pilot_claimed', true);
        
        if (!error && count !== null) {
          setClaimedSpots(count);
        }
      } catch (err) {
        console.error("Error fetching pilot data:", err);
      }
    }
    fetchPilotData();
  }, []);

  useEffect(function () {
    if (document.getElementById('taskivo-styles')) return;
    const style = document.createElement('style');
    style.id = 'taskivo-styles';
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap');
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      .heading { font-family: 'Syne', sans-serif; }
      .body-text { font-family: 'DM Sans', sans-serif; }
      .lp-hero-title { font-size: 64px; letter-spacing: -2px; line-height: 1.05; }
      .lp-hero-pad { padding: 120px 5% 100px; }
      .lp-section-pad { padding: 96px 5%; }
      .lp-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
      .lp-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
      @media (max-width: 768px) {
        .lp-hero-title { font-size: 36px !important; }
        .lp-grid-2, .lp-grid-3 { grid-template-columns: 1fr !important; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  function goRegister() {
    if (setAuthMode) setAuthMode("register");
    navigate("auth");
  }

  return (
    <div className="body-text" style={{ background: C.surface, color: C.textMain, minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* SECTION 1: HERO (DEEP DARK) */}
      <div className="lp-hero-pad" style={{ background: C.surface, position: 'relative' }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.card, border: `1px solid ${C.line}`, color: C.textMain, fontSize: 12, fontWeight: 700, padding: '8px 16px', borderRadius: 100, marginBottom: 32 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.limeText, animation: 'pulse 2s infinite' }}></span>
            Taskivo Beta Platform
          </div>
          <h1 className="lp-hero-title heading" style={{ color: C.textMain, marginBottom: 24 }}>
            Scale your reach.<br />
            <span style={{ color: C.limeText }}>Earn from real engagement.</span>
          </h1>
          <p style={{ color: C.textMuted, maxWidth: 540, margin: '0 auto 44px', lineHeight: 1.6, fontSize: 18 }}>
            An omnichannel engagement infrastructure connecting businesses with a global network of verified contributors.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{ background: C.lime, color: '#000', border: 'none', borderRadius: 8, padding: '14px 28px', fontSize: 14, fontWeight: 800, cursor: 'pointer' }} onClick={goRegister}>Join Network</button>
            <button style={{ background: C.card, color: C.textMain, border: `1px solid ${C.line}`, borderRadius: 8, padding: '14px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }} onClick={goRegister}>Launch Campaign</button>
          </div>
        </div>
      </div>

      {/* SECTION 2: LIVE GRANT (CONTRAST BREAK) */}
      <div style={{ background: C.card, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, padding: '40px 5%' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
          <div style={{ flex: '1 1 300px' }}>
            <h3 className="heading" style={{ color: C.textMain, fontSize: 20, marginBottom: 8 }}>Early Adopter Grant</h3>
            <p style={{ color: C.textMuted, fontSize: 14 }}>Get 20 free campaign slots to stress-test our network.</p>
          </div>
          <div style={{ flex: '1 1 250px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', color: C.textMain, fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
              <span>Slots Claimed</span>
              <span>{claimedSpots} / 10</span>
            </div>
            <div style={{ height: 6, background: C.surface, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ width: `${(claimedSpots / 10) * 100}%`, height: '100%', background: C.limeText }}></div>
            </div>
          </div>
          <button style={{ background: C.lime, color: '#000', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 13, fontWeight: 800, cursor: 'pointer' }} onClick={goRegister}>Claim Now</button>
        </div>
      </div>

      {/* SECTION 3: VALUE PROPS (DEEP DARK) */}
      <section className="lp-section-pad" style={{ background: C.surface }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 className="lp-section-title heading" style={{ color: C.textMain }}>Engineered for Integrity</h2>
        </div>
        <div className="lp-grid-3" style={{ maxWidth: 1100, margin: '0 auto' }}>
          {[
            { t: 'Tab-Switch Detection', d: 'Timer pauses instantly if the user minimizes the browser.', i: '🛡️' },
            { t: 'Verification Gates', d: 'Context-specific quizzes ensure zero bot activity.', i: '🧠' },
            { t: 'Instant Payouts', d: 'Verified attention converted to points immediately.', i: '⚡' }
          ].map((item, idx) => (
            <div key={idx} style={{ background: C.card, border: `1px solid ${C.line}`, padding: 32, borderRadius: 16, boxShadow: C.shadow }}>
              <div style={{ fontSize: 32, marginBottom: 20 }}>{item.i}</div>
              <h3 className="heading" style={{ fontSize: 20, color: C.textMain, marginBottom: 12 }}>{item.t}</h3>
              <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6 }}>{item.item ? item.item.d : item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 4: PRICING (CONTRAST BREAK) */}
      <section className="lp-section-pad" style={{ background: C.card, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 className="lp-section-title heading" style={{ color: C.textMain }}>Predictable Growth</h2>
        </div>
        <div className="lp-grid-3" style={{ maxWidth: 1100, margin: '0 auto' }}>
          {pricing.map((plan, i) => (
            <div key={i} style={{ 
              background: plan.isPopular ? C.surface : C.surface, 
              border: `1px solid ${plan.isPopular ? C.limeText : C.line}`, 
              borderRadius: 16, padding: '32px', boxShadow: plan.isPopular ? C.shadow : 'none'
            }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.textMain, marginBottom: 8 }}>{plan.name}</div>
              <div className="heading" style={{ fontSize: 40, color: C.limeText, marginBottom: 16 }}>{plan.price}</div>
              <button style={{ background: plan.isPopular ? C.lime : C.card, color: plan.isPopular ? '#000' : C.textMain, border: `1px solid ${C.line}`, borderRadius: 8, padding: '12px', width: '100%', fontWeight: 800, cursor: 'pointer' }} onClick={goRegister}>Select</button>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER (DEEP DARK) */}
      <footer style={{ background: C.surface, padding: '80px 5% 40px', borderTop: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          <div className="heading" style={{ fontSize: 22, color: C.textMain }}>Taskivo</div>
          <div style={{ color: C.textMuted, fontSize: 13 }}>© 2026 Taskivo. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
