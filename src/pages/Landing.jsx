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
  lime: '#A8FF3E',           // Solid button background
  limeText: 'var(--lime)',   // Text and borders
  limeDim: 'var(--lime-dim)',// Soft backgrounds
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
      .lp-hero-sub { font-size: 18px; margin: 0 auto 36px; }
      
      .lp-section-pad { padding: 96px 5%; }
      .lp-section-title { font-size: 40px; letter-spacing: -1.5px; }
      
      .lp-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
      .lp-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
      
      .lp-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; }

      @media (max-width: 768px) {
        .lp-hero-title { font-size: 36px !important; letter-spacing: -1px !important; }
        .lp-hero-pad { padding: 80px 5% 60px !important; }
        .lp-hero-sub { font-size: 15px !important; margin: 0 auto 24px !important; }
        
        .lp-section-pad { padding: 60px 5% !important; }
        .lp-section-title { font-size: 28px !important; letter-spacing: -1px !important; }
        
        .lp-grid-2, .lp-grid-3 { grid-template-columns: 1fr !important; gap: 16px !important; }
        .lp-footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        .lp-footer-brand-span { grid-column: 1 / -1 !important; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const pricing = [
    { 
      name: 'Starter', price: '$8', slots: 50, useCase: 'Baseline engagement test',
      features: ['Platform-Specific Base Watch Time', 'Guaranteed Like & Comment', 'Anti-Cheat Verification', 'No guaranteed follows/subs']
    },
    { 
      name: 'Growth', price: '$24', slots: 200, useCase: 'Best Value (Includes 50 Bonus)',
      features: ['Platform-Specific Base Watch Time', 'Guaranteed Like & Comment', 'Anti-Cheat Verification', 'Guaranteed Engaged Follows/Subs'],
      isPopular: true
    },
    { 
      name: 'Scale', price: '$48', slots: 500, useCase: 'Massive reach (Includes 200 Bonus)',
      features: ['Platform-Specific Base Watch Time', 'Guaranteed Like & Comment', 'Anti-Cheat Verification', 'Guaranteed Engaged Follows/Subs', 'Priority Network Routing']
    },
  ];

  const faqs = [
    { q: 'How do rewards work?', a: 'Contributors accumulate reward points based on active task completion, platform engagement, and maintaining activity streaks. Points reflect your overall participation quality.' },
    { q: 'How do I withdraw?', a: 'Once you accumulate enough reward points to meet the platform threshold, you can request a secure withdrawal to your configured payment method.' },
    { q: 'Who can use Taskivo?', a: 'Taskivo is built for global businesses seeking genuine digital engagement across social and web properties, and individuals worldwide looking for structured micro-earning opportunities.' },
  ];

  function goRegister() {
    if (setAuthMode) setAuthMode("register");
    navigate("auth");
  }

  function toggleFaq(index) {
    setOpenFaq(openFaq === index ? null : index);
  }

  return (
    <div className="body-text" style={{ background: C.surface, color: C.textMain, minHeight: '100vh', WebkitFontSmoothing: 'antialiased', overflowX: 'hidden' }}>
      
      {/* HERO */}
      <div className="lp-hero-pad" style={{ background: C.surface, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: C.card,
            border: `1px solid ${C.line}`,
            color: C.textMain, fontSize: 12, fontWeight: 700,
            padding: '8px 16px', borderRadius: 100, marginBottom: 32,
            boxShadow: C.shadow
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.limeText, animation: 'pulse 2s infinite' }}></span>
            Taskivo Beta Platform
          </div>
          
          <h1 className="lp-hero-title heading" style={{ color: C.textMain, marginBottom: 24 }}>
            Scale your reach.<br />
            <span style={{ color: C.limeText }}>Earn from real engagement.</span>
          </h1>
          
          <p className="lp-hero-sub body-text" style={{ color: C.textMuted, maxWidth: 540, fontWeight: 500, lineHeight: 1.6 }}>
            An omnichannel engagement infrastructure connecting businesses with a global network of verified contributors.
          </p>

          <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 44, fontStyle: 'italic', opacity: 0.8 }}>
            Empowering digital participation and micro-earning opportunities across emerging markets.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={{
                background: C.lime, color: '#000000', border: 'none', borderRadius: 8, padding: '14px 28px',
                fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'transform 0.2s'
              }} onClick={goRegister}>Join as Founding Contributor</button>
              
              <button style={{
                background: C.card, color: C.textMain, border: `1px solid ${C.line}`, borderRadius: 8,
                padding: '14px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", transition: 'transform 0.2s', boxShadow: C.shadow
              }} onClick={goRegister}>Launch a Campaign</button>
            </div>
            <div style={{ color: C.limeText, fontSize: 12, fontWeight: 700, letterSpacing: 0.5, marginTop: 8 }}>
              🔥 Only 50 Founding Contributor spots available for Phase 1.
            </div>
          </div>
        </div>
      </div>

      {/* PILOT PROGRAM BANNER (LIVE SUPABASE DATA) */}
      <div style={{ background: C.card, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}`, padding: '24px 5%', boxShadow: C.shadow }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ display: 'inline-block', background: C.limeDim, color: C.limeText, fontSize: 10, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', padding: '4px 8px', borderRadius: 4 }}>Live Beta</span>
              <span className="heading" style={{ color: C.textMain, fontSize: 18, fontWeight: 700 }}>Early Adopter Grant</span>
            </div>
            <div style={{ color: C.textMuted, fontSize: 14, fontWeight: 500 }}>We are gifting 20 free campaign slots to our first 10 businesses to stress-test the network.</div>
          </div>
          <div style={{ flex: '1 1 250px', maxWidth: 350, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: C.textMain, fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
              <span>Grants Claimed</span>
              <span>{claimedSpots} / 10</span>
            </div>
            <div style={{ height: 6, background: C.line, borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ width: `${Math.min((claimedSpots / 10) * 100, 100)}%`, height: '100%', background: C.limeText, transition: 'width 1s ease-in-out' }}></div>
            </div>
          </div>
          <button 
            style={{ 
              background: claimedSpots >= 10 ? C.surface : C.lime, 
              color: claimedSpots >= 10 ? C.textMuted : '#000000', 
              border: `1px solid ${claimedSpots >= 10 ? C.line : 'transparent'}`, 
              borderRadius: 8, padding: '12px 24px', fontSize: 13, fontWeight: 800, 
              cursor: claimedSpots >= 10 ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif"
            }} 
            onClick={function() { if (claimedSpots < 10) goRegister(); }}
          >
            {claimedSpots >= 10 ? 'Cohort Full' : 'Claim Free Slots'}
          </button>
        </div>
      </div>

      {/* VALUE PROP: BUSINESS & CONTRIBUTORS */}
      <section className="lp-section-pad" style={{ background: C.surface }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 className="lp-section-title heading" style={{ color: C.textMain, marginBottom: 16 }}>Two perspectives.<br />One infrastructure.</h2>
          <p style={{ color: C.textMuted, maxWidth: 500, margin: '0 auto', lineHeight: 1.6, fontWeight: 500 }}>
            Taskivo abstracts the complexity of digital growth and distributed micro-earnings into a single, seamless platform.
          </p>
        </div>
        <div className="lp-grid-2" style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 40, boxShadow: C.shadow }}>
            <div style={{ display: 'inline-block', background: C.textMain, color: C.textInvert, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '6px 12px', borderRadius: 6, marginBottom: 24 }}>For Businesses</div>
            <h3 className="heading" style={{ fontSize: 24, marginBottom: 16, color: C.textMain }}>Drive verifiable digital actions.</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.textMuted, fontSize: 15 }}><span style={{ color: C.textMain, fontWeight: 'bold' }}>✓</span> Omnichannel reach: YouTube, TikTok, FB, & SEO Blog Traffic</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.textMuted, fontSize: 15 }}><span style={{ color: C.textMain, fontWeight: 'bold' }}>✓</span> Get high-retention engagement from real users</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.textMuted, fontSize: 15 }}><span style={{ color: C.textMain, fontWeight: 'bold' }}>✓</span> Predictable and scalable algorithmic growth</li>
            </ul>
            <button style={{ background: C.textMain, color: C.textInvert, border: 'none', borderRadius: 8, padding: '14px 20px', fontSize: 14, fontWeight: 700, cursor: 'pointer', width: '100%' }} onClick={goRegister}>Create Campaign</button>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 40, boxShadow: C.shadow }}>
            <div style={{ display: 'inline-block', background: C.limeDim, color: C.limeText, fontSize: 11, fontWeight: 800, letterSpacing: 1, textTransform: 'uppercase', padding: '6px 12px', borderRadius: 6, marginBottom: 24 }}>For Contributors</div>
            <h3 className="heading" style={{ fontSize: 24, marginBottom: 16, color: C.textMain }}>Turn participation into value.</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.textMuted, fontSize: 15 }}><span style={{ color: C.limeText, fontWeight: 'bold' }}>●</span> Read articles, engage with blogs, and watch videos</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.textMuted, fontSize: 15 }}><span style={{ color: C.limeText, fontWeight: 'bold' }}>●</span> Earn dynamic reward points for your verified attention</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.textMuted, fontSize: 15 }}><span style={{ color: C.limeText, fontWeight: 'bold' }}>●</span> Build consistency streaks for internal bonuses</li>
            </ul>
            <button style={{ background: C.lime, color: '#000000', border: 'none', borderRadius: 8, padding: '14px 20px', fontSize: 14, fontWeight: 800, cursor: 'pointer', width: '100%' }} onClick={goRegister}>Join Network</button>
          </div>
        </div>
      </section>

      {/* TRUST LAYER: ENGINEERED FOR INTEGRITY */}
      <section className="lp-section-pad" style={{ background: C.card, borderTop: `1px solid ${C.line}`, borderBottom: `1px solid ${C.line}` }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: C.limeText, marginBottom: 12 }}>Platform Strictness</div>
          <h2 className="lp-section-title heading" style={{ color: C.textMain, marginBottom: 16 }}>Proof of attention, built-in.</h2>
          <p style={{ color: C.textMuted, maxWidth: 600, margin: '0 auto', lineHeight: 1.6, fontWeight: 500 }}>
            We do not just deliver clicks. We guarantee sustained human focus through strict, automated verification protocols. You only pay for verified engagement.
          </p>
        </div>
        <div className="lp-grid-3" style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ background: C.surface, border: `1px solid ${C.line}`, padding: 32, borderRadius: 16, boxShadow: C.shadow }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.textMain, marginBottom: 12 }}>Tab-Switch Detection</div>
            <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6 }}>If a contributor switches tabs or minimizes their browser, the watch or read timer instantly pauses. Guaranteed active screen time, not background noise.</p>
          </div>
          <div style={{ background: C.surface, border: `1px solid ${C.line}`, padding: 32, borderRadius: 16, boxShadow: C.shadow }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.textMain, marginBottom: 12 }}>Strict Verification Gates</div>
            <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6 }}>Actions remain locked until contributors pass a context-specific quiz about your campaign with a strict 3-attempt limit. Zero bots. Zero lazy clicks.</p>
          </div>
          <div style={{ background: C.surface, border: `1px solid ${C.line}`, padding: 32, borderRadius: 16, boxShadow: C.shadow }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: C.textMain, marginBottom: 12 }}>Guaranteed Session Minimums</div>
            <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6 }}>Every campaign enforces platform-specific read/watch durations to ensure algorithmic safety and high-retention metrics for your content.</p>
          </div>
        </div>
      </section>

      {/* PRICING (BUSINESSES) */}
      <section className="lp-section-pad" style={{ background: C.surface }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', color: C.textMuted, marginBottom: 12 }}>Campaign Pricing</div>
          <h2 className="lp-section-title heading" style={{ color: C.textMain, marginBottom: 16 }}>Predictable growth packages.</h2>
          <p style={{ color: C.textMuted, maxWidth: 500, margin: '0 auto', lineHeight: 1.6, fontWeight: 500 }}>
            Purchase secure campaign slots to tap into our distributed network. Extended time available at checkout.
          </p>
        </div>
        <div className="lp-grid-3" style={{ maxWidth: 1100, margin: '0 auto', alignItems: 'center' }}>
          {pricing.map(function(plan, i) {
            return (
              <div key={i} style={{ 
                background: plan.isPopular ? C.textMain : C.card, 
                color: plan.isPopular ? C.textInvert : C.textMain,
                border: `1px solid ${plan.isPopular ? C.textMain : C.line}`, 
                borderRadius: 16, padding: plan.isPopular ? '48px 32px' : '32px', 
                boxShadow: plan.isPopular ? C.shadow : 'none',
                position: 'relative', display: 'flex', flexDirection: 'column' 
              }}>
                {plan.isPopular && (
                  <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: C.lime, color: '#000000', fontSize: 11, fontWeight: 800, padding: '6px 16px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: 1 }}>Best Value</div>
                )}
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{plan.name}</div>
                <div className="heading" style={{ fontSize: 40, color: plan.isPopular ? C.limeText : C.textMain, marginBottom: 8 }}>{plan.price}</div>
                <div style={{ fontSize: 15, fontWeight: 600, paddingBottom: 24, borderBottom: `1px solid ${plan.isPopular ? C.surface : C.line}`, marginBottom: 24 }}>
                  {plan.slots.toLocaleString()} Verified Engagements
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 14, flexGrow: 1 }}>
                  {plan.features.map(function(feat, idx) {
                    const isMuted = feat === 'No guaranteed follows/subs';
                    const textColor = isMuted ? C.textMuted : (plan.isPopular ? 'rgba(255,255,255,0.8)' : C.textMuted);
                    // Force text to be readable in Light Mode popular card (where textInvert is white)
                    const finalColor = plan.isPopular ? C.textInvert : textColor;
                    const checkColor = isMuted ? C.textMuted : (plan.isPopular ? C.limeText : C.textMain);
                    
                    return (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: isMuted ? C.textMuted : finalColor, opacity: isMuted ? 0.6 : 1 }}>
                        <span style={{ color: checkColor, fontWeight: 'bold' }}>{isMuted ? '✕' : '✓'}</span>
                        {feat}
                      </li>
                    );
                  })}
                </ul>
                <button style={{ background: plan.isPopular ? C.lime : C.textMain, color: plan.isPopular ? '#000000' : C.textInvert, border: 'none', borderRadius: 8, padding: '14px', fontSize: 14, fontWeight: 700, cursor: 'pointer', width: '100%' }} onClick={goRegister}>
                  Select Package
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* TRUST LAYER & FAQ */}
      <section className="lp-section-pad" style={{ background: C.card, borderTop: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 className="heading" style={{ fontSize: 28, color: C.textMain, marginBottom: 12 }}>Frequently Asked Questions</h2>
            <p style={{ color: C.textMuted, fontSize: 15, fontWeight: 500 }}>Built for transparency and fairness. Rewards are based on verifiable engagement.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map(function(faq, i) {
              const isOpen = openFaq === i;
              return (
                <div key={i} style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 12, overflow: 'hidden', boxShadow: C.shadow }}>
                  <button 
                    onClick={function() { toggleFaq(i); }}
                    style={{ width: '100%', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 700, color: C.textMain, textAlign: 'left' }}
                  >
                    {faq.q}
                    <span style={{ color: C.textMuted, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 20px 20px', color: C.textMuted, fontSize: 14, lineHeight: 1.6, fontWeight: 500 }}>{faq.a}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.surface, borderTop: `1px solid ${C.line}`, padding: '64px 5% 32px' }}>
        <div className="lp-footer-grid" style={{ maxWidth: 1100, margin: '0 auto', marginBottom: 48 }}>
          <div className="lp-footer-brand-span">
            <div className="heading" style={{ color: C.textMain, fontSize: 22, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: C.limeText, display: 'inline-block' }}></span>
              Taskivo
            </div>
            <p style={{ color: C.textMuted, fontSize: 14, lineHeight: 1.6, maxWidth: 300, marginBottom: 24, fontWeight: 500 }}>
              A modern omnichannel engagement infrastructure bridging global businesses with a distributed contributor network.
            </p>
            <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 700 }}>hello@taskivo.online</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.textMain, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>Product</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <li><span style={{ color: C.textMuted, cursor: "pointer", fontSize: 14, fontWeight: 500 }} onClick={function() { navigate("auth"); }}>For Contributors</span></li>
              <li><span style={{ color: C.textMuted, cursor: "pointer", fontSize: 14, fontWeight: 500 }} onClick={function() { navigate("auth"); }}>For Businesses</span></li>
              <li><span style={{ color: C.textMuted, cursor: "pointer", fontSize: 14, fontWeight: 500 }} onClick={function() { navigate("auth"); }}>Pricing</span></li>
            </ul>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.textMain, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>Company</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <li><span style={{ color: C.textMuted, cursor: "pointer", fontSize: 14, fontWeight: 500 }} onClick={function() { navigate("about"); }}>About Us</span></li>
              <li><span style={{ color: C.textMuted, cursor: "pointer", fontSize: 14, fontWeight: 500 }} onClick={function() { navigate("blog"); }}>Blog</span></li>
            </ul>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.textMain, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>Legal</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <li><span style={{ color: C.textMuted, cursor: "pointer", fontSize: 14, fontWeight: 500 }} onClick={function() { navigate("terms"); }}>Terms of Service</span></li>
              <li><span style={{ color: C.textMuted, cursor: "pointer", fontSize: 14, fontWeight: 500 }} onClick={function() { navigate("privacy"); }}>Privacy Policy</span></li>
            </ul>
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${C.line}`, paddingTop: 24, color: C.textMuted, fontSize: 13, fontWeight: 500 }}>
          <div>© {new Date().getFullYear()} Taskivo. All rights reserved. Beta Platform.</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span>Built for transparency.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
