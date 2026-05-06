import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const C = {
  ink: '#0D0D14',
  lime: '#A8FF3E',
  limeDim: 'rgba(168,255,62,0.12)',
  limeBorder: 'rgba(168,255,62,0.2)',
  white: '#ffffff',
  off: '#F7F8FA',
  slate: '#6B7280',
  line: '#EBEBEB',
  darkLine: 'rgba(255,255,255,0.08)',
};

export default function Landing({ navigate, setAuthMode }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [claimedSpots, setClaimedSpots] = useState(0);

  useEffect(function () {
    document.title = 'Taskivo — Digital Engagement Infrastructure';
  }, []);

  // Fetch live pilot program claims from Supabase
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
      .lp-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
      
      .lp-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; }

      @media (max-width: 768px) {
        .lp-hero-title { font-size: 36px !important; letter-spacing: -1px !important; }
        .lp-hero-pad { padding: 80px 5% 60px !important; }
        .lp-hero-sub { font-size: 15px !important; margin: 0 auto 24px !important; }
        
        .lp-section-pad { padding: 60px 5% !important; }
        .lp-section-title { font-size: 28px !important; letter-spacing: -1px !important; }
        
        .lp-grid-2, .lp-grid-3, .lp-grid-4 { grid-template-columns: 1fr !important; gap: 16px !important; }
        .lp-footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        .lp-footer-brand-span { grid-column: 1 / -1 !important; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const pricing = [
    { name: 'Starter', price: '$10', slots: 50, useCase: 'Best for small campaigns' },
    { name: 'Growth', price: '$18', slots: 100, useCase: 'Best for growing channels' },
    { name: 'Pro', price: '$40', slots: 250, useCase: 'Best for agency needs' },
    { name: 'Scale', price: '$75', slots: 500, useCase: 'Best for massive reach' },
  ];

  const faqs = [
    { q: 'How do rewards work?', a: 'Contributors accumulate reward points based on active task completion, platform engagement, and maintaining activity streaks. Points reflect your overall participation quality.' },
    { q: 'How do I withdraw?', a: 'Once you accumulate enough reward points to meet the platform threshold, you can request a secure withdrawal to your configured payment method.' },
    { q: 'Who can use Taskivo?', a: 'Taskivo is built for global businesses seeking genuine digital engagement, and individuals worldwide looking for structured micro-earning opportunities.' },
  ];

  function goRegister() {
    if (setAuthMode) setAuthMode("register");
    navigate("auth");
  }

  function goLogin() {
    if (setAuthMode) setAuthMode("login");
    navigate("auth");
  }

  function toggleFaq(index) {
    setOpenFaq(openFaq === index ? null : index);
  }

  return (
    <div className="body-text" style={{ background: C.off, color: C.ink, minHeight: '100vh', WebkitFontSmoothing: 'antialiased' }}>
      
      {/* HERO */}
      <div className="lp-hero-pad" style={{ background: C.ink, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
          width: '80%', height: '80%',
          background: 'radial-gradient(ellipse at center, rgba(168,255,62,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}></div>
        
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.05)',
            border: `1px solid ${C.darkLine}`,
            color: C.white, fontSize: 12, fontWeight: 600,
            padding: '6px 16px', borderRadius: 100, marginBottom: 32,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.lime, animation: 'pulse 2s infinite' }}></span>
            Taskivo Beta Platform
          </div>
          
          <h1 className="lp-hero-title heading" style={{ color: C.white, marginBottom: 24 }}>
            Scale your reach.<br />
            <span style={{ color: C.lime }}>Earn from real engagement.</span>
          </h1>
          
          <p className="lp-hero-sub body-text" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 540, fontWeight: 400, lineHeight: 1.6 }}>
            A digital engagement infrastructure connecting businesses with a global network of real contributors.
          </p>

          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 44, fontStyle: 'italic', letterSpacing: 0.5 }}>
            Empowering digital participation and micro-earning opportunities across emerging markets.
          </p>
          
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{
              background: C.lime, color: C.ink, border: 'none', borderRadius: 8, padding: '14px 28px',
              fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }} onClick={goRegister}>Start as Contributor</button>
            <button style={{
              background: 'transparent', color: C.white, border: `1px solid ${C.darkLine}`, borderRadius: 8,
              padding: '14px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
            }} onClick={goRegister}>Launch a Campaign</button>
          </div>
        </div>
      </div>

      {/* PILOT PROGRAM BANNER (LIVE SUPABASE DATA) */}
      <div style={{ background: C.ink, borderTop: `1px solid ${C.darkLine}`, borderBottom: `1px solid ${C.darkLine}`, padding: '24px 5%' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ display: 'inline-block', background: C.limeDim, color: C.lime, fontSize: 10, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '4px 8px', borderRadius: 4 }}>Live Beta</span>
              <span className="heading" style={{ color: C.white, fontSize: 18 }}>Early Adopter Grant</span>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>We are gifting 20 free campaign slots to our first 10 businesses to stress-test the network.</div>
          </div>

          <div style={{ flex: '1 1 250px', maxWidth: 350, width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: C.white, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              <span>Grants Claimed</span>
              <span>{claimedSpots} / 10</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ width: `${Math.min((claimedSpots / 10) * 100, 100)}%`, height: '100%', background: C.lime, transition: 'width 1s ease-in-out' }}></div>
            </div>
          </div>

          <button 
            style={{ 
              background: claimedSpots >= 10 ? 'rgba(255,255,255,0.1)' : C.lime, 
              color: claimedSpots >= 10 ? 'rgba(255,255,255,0.4)' : C.ink, 
              border: 'none', borderRadius: 6, padding: '12px 24px', fontSize: 13, fontWeight: 700, 
              cursor: claimedSpots >= 10 ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans', sans-serif"
            }} 
            onClick={function() { if (claimedSpots < 10) goRegister(); }}
          >
            {claimedSpots >= 10 ? 'Cohort Full' : 'Claim Free Slots'}
          </button>

        </div>
      </div>

      {/* VALUE PROP: BUSINESS & CONTRIBUTORS */}
      <section className="lp-section-pad" style={{ background: C.off }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 className="lp-section-title heading" style={{ color: C.ink, marginBottom: 16 }}>Two perspectives.<br />One infrastructure.</h2>
          <p style={{ color: C.slate, maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
            Taskivo abstracts the complexity of digital growth and distributed micro-earnings into a single, seamless platform.
          </p>
        </div>

        <div className="lp-grid-2" style={{ maxWidth: 1000, margin: '0 auto' }}>
          {/* For Businesses */}
          <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 16, padding: 40 }}>
            <div style={{ display: 'inline-block', background: C.ink, color: C.lime, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '6px 12px', borderRadius: 6, marginBottom: 24 }}>For Businesses</div>
            <h3 className="heading" style={{ fontSize: 24, marginBottom: 16, color: C.ink }}>Drive verifiable digital actions.</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.slate, fontSize: 15 }}><span style={{ color: C.ink, fontWeight: 'bold' }}>✓</span> Promote campaigns effortlessly</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.slate, fontSize: 15 }}><span style={{ color: C.ink, fontWeight: 'bold' }}>✓</span> Get real engagement from real users</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.slate, fontSize: 15 }}><span style={{ color: C.ink, fontWeight: 'bold' }}>✓</span> Predictable and affordable growth</li>
            </ul>
            <button style={{ background: C.ink, color: C.white, border: 'none', borderRadius: 6, padding: '12px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%' }} onClick={goRegister}>Create Campaign</button>
          </div>

          {/* For Contributors */}
          <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 16, padding: 40 }}>
            <div style={{ display: 'inline-block', background: C.limeDim, color: '#3d6600', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '6px 12px', borderRadius: 6, marginBottom: 24 }}>For Contributors</div>
            <h3 className="heading" style={{ fontSize: 24, marginBottom: 16, color: C.ink }}>Turn participation into value.</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.slate, fontSize: 15 }}><span style={{ color: C.lime, fontWeight: 'bold' }}>●</span> Complete simple digital tasks</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.slate, fontSize: 15 }}><span style={{ color: C.lime, fontWeight: 'bold' }}>●</span> Earn dynamic reward points</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.slate, fontSize: 15 }}><span style={{ color: C.lime, fontWeight: 'bold' }}>●</span> Build consistency streaks for bonuses</li>
            </ul>
            <button style={{ background: C.lime, color: C.ink, border: 'none', borderRadius: 6, padding: '12px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%' }} onClick={goRegister}>Join Network</button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS & WHY TASKIVO */}
      <section className="lp-section-pad" style={{ background: C.white, borderTop: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div className="lp-grid-2" style={{ alignItems: 'center', gap: 60 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: C.slate, marginBottom: 12 }}>How It Works</div>
              <h2 className="heading" style={{ fontSize: 32, lineHeight: 1.2, color: C.ink, marginBottom: 24 }}>Streamlined for speed and trust.</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {[
                  { title: '1. Register & Connect', desc: 'Join as a business to post campaigns, or as a contributor to access the task network.' },
                  { title: '2. Deploy & Participate', desc: 'Businesses launch verifiable campaigns. Contributors complete actions with built-in proof mechanisms.' },
                  { title: '3. Grow & Get Rewarded', desc: 'Businesses gain instant visibility. Contributors build streaks and earn platform points.' }
                ].map(function(step, i) {
                  return (
                    <div key={i}>
                      <div style={{ fontWeight: 700, color: C.ink, fontSize: 16, marginBottom: 4 }}>{step.title}</div>
                      <div style={{ color: C.slate, fontSize: 14, lineHeight: 1.6 }}>{step.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ background: C.off, padding: 40, borderRadius: 16, border: `1px solid ${C.line}` }}>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: C.slate, marginBottom: 24 }}>Why Taskivo?</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div style={{ background: C.white, padding: 16, borderRadius: 8, border: `1px solid ${C.line}` }}>
                  <div style={{ fontWeight: 600, color: C.ink, marginBottom: 4 }}>Absolute Transparency</div>
                  <div style={{ fontSize: 13, color: C.slate }}>Built for clarity. No hidden mechanics.</div>
                </div>
                <div style={{ background: C.white, padding: 16, borderRadius: 8, border: `1px solid ${C.line}` }}>
                  <div style={{ fontWeight: 600, color: C.ink, marginBottom: 4 }}>Real Users, Zero Bots</div>
                  <div style={{ fontSize: 13, color: C.slate }}>Proof-of-attention layers protect campaigns.</div>
                </div>
                <div style={{ background: C.white, padding: 16, borderRadius: 8, border: `1px solid ${C.line}` }}>
                  <div style={{ fontWeight: 600, color: C.ink, marginBottom: 4 }}>Fair Reward System</div>
                  <div style={{ fontSize: 13, color: C.slate }}>Earnings reflect genuine activity and engagement.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING (BUSINESSES) */}
      <section className="lp-section-pad" style={{ background: C.ink, color: C.white }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: C.lime, marginBottom: 12 }}>Campaign Pricing</div>
          <h2 className="lp-section-title heading" style={{ marginBottom: 16 }}>Predictable growth packages.</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
            Purchase secure campaign slots to tap into our distributed contributor network.
          </p>
        </div>

        <div className="lp-grid-4" style={{ maxWidth: 1100, margin: '0 auto' }}>
          {pricing.map(function(plan, i) {
            return (
              <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.darkLine}`, borderRadius: 16, padding: 32, display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 18, fontWeight: 600, color: C.white, marginBottom: 8 }}>{plan.name}</div>
                <div className="heading" style={{ fontSize: 36, color: C.lime, marginBottom: 8 }}>{plan.price}</div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', paddingBottom: 24, borderBottom: `1px solid ${C.darkLine}`, marginBottom: 24 }}>
                  {plan.slots.toLocaleString()} Campaign Slots
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 32, flexGrow: 1 }}>
                  {plan.useCase}
                </div>
                <button style={{ background: C.white, color: C.ink, border: 'none', borderRadius: 6, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer', width: '100%' }} onClick={goRegister}>
                  Select Package
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* TRUST LAYER & FAQ */}
      <section className="lp-section-pad" style={{ background: C.off }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 className="heading" style={{ fontSize: 28, color: C.ink, marginBottom: 12 }}>Frequently Asked Questions</h2>
            <p style={{ color: C.slate, fontSize: 14 }}>Built for transparency and fairness. Rewards are based on activity and platform engagement.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map(function(faq, i) {
              const isOpen = openFaq === i;
              return (
                <div key={i} style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 8, overflow: 'hidden' }}>
                  <button 
                    onClick={function() { toggleFaq(i); }}
                    style={{ width: '100%', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: C.ink, textAlign: 'left' }}
                  >
                    {faq.q}
                    <span style={{ color: C.slate, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 20px 20px', color: C.slate, fontSize: 14, lineHeight: 1.6 }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.white, borderTop: `1px solid ${C.line}`, padding: '64px 5% 32px' }}>
        <div className="lp-footer-grid" style={{ maxWidth: 1100, margin: '0 auto', marginBottom: 48 }}>
          <div className="lp-footer-brand-span">
            <div className="heading" style={{ color: C.ink, fontSize: 22, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: C.lime, display: 'inline-block' }}></span>
              Taskivo
            </div>
            <p style={{ color: C.slate, fontSize: 14, lineHeight: 1.6, maxWidth: 300, marginBottom: 24 }}>
              A modern digital engagement infrastructure bridging global businesses with a distributed contributor network.
            </p>
            <div style={{ fontSize: 12, color: C.slate, fontWeight: 500 }}>hello@taskivo.online</div>
          </div>
          
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.ink, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>Product</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <li><span style={{ color: C.slate, cursor: "pointer", fontSize: 14 }} onClick={function() { navigate("auth"); }}>For Contributors</span></li>
              <li><span style={{ color: C.slate, cursor: "pointer", fontSize: 14 }} onClick={function() { navigate("auth"); }}>For Businesses</span></li>
              <li><span style={{ color: C.slate, cursor: "pointer", fontSize: 14 }} onClick={function() { navigate("auth"); }}>Pricing</span></li>
            </ul>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.ink, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>Company</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <li><span style={{ color: C.slate, cursor: "pointer", fontSize: 14 }} onClick={function() { navigate("about"); }}>About Us</span></li>
              <li><span style={{ color: C.slate, cursor: "pointer", fontSize: 14 }} onClick={function() { navigate("blog"); }}>Blog</span></li>
            </ul>
          </div>

          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.ink, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>Legal</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <li><span style={{ color: C.slate, cursor: "pointer", fontSize: 14 }} onClick={function() { navigate("terms"); }}>Terms of Service</span></li>
              <li><span style={{ color: C.slate, cursor: "pointer", fontSize: 14 }} onClick={function() { navigate("privacy"); }}>Privacy Policy</span></li>
            </ul>
          </div>
        </div>
        
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${C.line}`, paddingTop: 24, color: C.slate, fontSize: 13 }}>
          <div>© {new Date().getFullYear()} Taskivo. All rights reserved. Beta Platform.</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <span>Built for transparency.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
