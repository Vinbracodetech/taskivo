import { services, servicePackages } from '../lib/serviceCatalog.js';
import { useEffect, useState } from 'react';

export const landingStyles = `
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Montserrat:wght@600;700;800;900&display=swap');
      @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      .heading { font-family: 'Montserrat', sans-serif; }
      .body-text { font-family: 'DM Sans', sans-serif; }
      .lp-hero-title { font-size: 64px; letter-spacing: -2px; line-height: 1.05; }
      .lp-hero-pad { padding: 100px 5% 0px; }
      .lp-hero-sub { font-size: 18px; margin: 0 auto 36px; }
      .lp-section-pad { padding: 96px 5%; }
      .lp-section-title { font-size: 40px; letter-spacing: -1.5px; }
      .lp-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
      .lp-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
      .lp-footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; }
      
      .play-store-btn {
        display: inline-flex; align-items: center; gap: 12px; background: #000; color: #fff; 
        border: 1px solid rgba(255,255,255,0.2); padding: 10px 24px; border-radius: 8px; 
        text-decoration: none; transition: all 0.2s ease; cursor: pointer;
      }
      .play-store-btn:hover { border-color: #A8FF3E; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(168,255,62,0.15); }
      
      @media (max-width: 768px) {
        .lp-hero-title { font-size: 36px !important; letter-spacing: -1px !important; }
        .lp-hero-pad { padding: 80px 5% 0px !important; }
        .lp-hero-sub { font-size: 15px !important; margin: 0 auto 24px !important; }
        .lp-section-pad { padding: 60px 5% !important; }
        .lp-section-title { font-size: 28px !important; letter-spacing: -1px !important; }
        .lp-grid-2, .lp-grid-3 { grid-template-columns: 1fr !important; gap: 16px !important; }
        .lp-footer-grid { grid-template-columns: 1fr 1fr !important; gap: 32px !important; }
        .lp-footer-brand-span { grid-column: 1 / -1 !important; }
      }
    `;

const C = {
  ink: '#0D0D14', lime: '#A8FF3E', limeDim: 'rgba(168,255,62,0.12)', limeBorder: 'rgba(168,255,62,0.2)',
  white: '#ffffff', off: '#F7F8FA', slate: '#6B7280', line: '#EBEBEB', darkLine: 'rgba(255,255,255,0.08)',
};

export default function Landing({ navigate, setAuthMode }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [pricingMode, setPricingMode] = useState('qa'); // 'social', 'growth', 'seo', 'adsense', 'qa', 'ugc'

  // 🔥 METADATA & JSON-LD SCHEMA INJECTION 🔥
  useEffect(() => {
    document.title = 'Taskivo | Online Microtasks, Surveys & App Testing';
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = 'Explore digital microtasks, sponsored surveys and app testing. Taskivo connects contributors with businesses seeking genuine feedback.';

    const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "name": "Taskivo",
          "url": "https://www.taskivo.online",
          "logo": "https://www.taskivo.online/logo-512.png"
        },
        {"@type":"WebSite","name":"Taskivo","url":"https://www.taskivo.online/"}
      ]
    };

    const existingScript = document.getElementById('taskivo-schema');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = 'taskivo-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);
    
    return () => {
      const scriptToRemove = document.getElementById('taskivo-schema');
      if (scriptToRemove) scriptToRemove.remove();
    };
  }, []);

  useEffect(() => {
    if (document.getElementById('taskivo-styles')) return;
    const style = document.createElement('style');
    style.id = 'taskivo-styles';
    style.textContent = landingStyles;
    document.head.appendChild(style);
  }, []);

  // 🔥 UPDATED: Removed Explicit Timers - Focused on "High Retention" 🔥
  const serviceDetails = Object.fromEntries(services.map(s=>[s.id,s]));
  const selectedService = serviceDetails[pricingMode] || services[0];
  const activePricing = servicePackages[selectedService.id];

  const faqs = [
    { q: 'What is Taskivo?', a: 'Taskivo connects contributors with digital microtasks and businesses seeking app testing, usability feedback and original content.' },
    { q: 'Can I earn from paid surveys?', a: 'We are preparing partner-funded surveys and sponsored offers. Availability depends on partner approval, location and eligibility. There is no guaranteed income.' },
    { q: 'When can I withdraw my rewards?', a: 'Rewards are subject to verification and funding. Survey rewards will remain pending until the relevant provider settles them. Check your wallet for available balances.' },
    { q: 'Do I have to pay to earn?', a: 'Taskivo does not require a deposit to access earning opportunities. Some third-party offers may have their own requirements; read them before accepting.' },
    { q: 'What work can businesses request?', a: 'Businesses can request video feedback, audience research, SEO audits, publisher optimization, app testing and original content, subject to scope, approval and funding.' },
    { q: 'How do I get support?', a: 'Contact support@taskivo.online with your account or task reference. Never send passwords or verification codes.' }
  ];

  function toggleFaq(i) { setOpenFaq(openFaq === i ? null : i); }

  function goRegisterEarner() {
    localStorage.setItem('taskivo_role', 'earner');
    if (setAuthMode) setAuthMode("register");
    navigate("auth");
  }

  function goRegisterCreator() {
    localStorage.removeItem("taskivo_requested_package");
    navigate("create-task");
  }

  return (
    <div className="body-text" style={{ background: C.off, color: C.ink, minHeight: '100vh', WebkitFontSmoothing: 'antialiased' }}>
      
      {/* ── HERO SECTION ── */}
      <div className="lp-hero-pad" style={{ background: C.ink, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.darkLine}`, color: C.white, fontSize: 12, fontWeight: 600, padding: '6px 16px', borderRadius: 100, marginBottom: 32 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.lime, animation: 'pulse 2s infinite' }}></span>
            Taskivo Contributor Network
          </div>
          
          <h1 className="lp-hero-title heading" style={{ color: C.white, marginBottom: 24 }}>Discover digital work.<br /><span style={{ color: C.lime }}>Make your feedback count.</span></h1>
          <p className="lp-hero-sub body-text" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 540, fontWeight: 400, lineHeight: 1.6 }}>Explore microtasks, app testing and partner-funded surveys. Help businesses improve products through genuine feedback.</p>
          
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
            <button style={{ background: C.lime, color: C.ink, border: 'none', borderRadius: 8, padding: '14px 28px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }} onClick={goRegisterCreator}>Request a Campaign</button>
            <button style={{ background: 'transparent', color: C.white, border: `1px solid ${C.darkLine}`, borderRadius: 8, padding: '14px 28px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }} onClick={goRegisterEarner}>Explore Earning Opportunities</button>
          </div>
          
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: 500, letterSpacing: 0.5, marginBottom: 48 }}>Create an account to explore available opportunities.</div>
          
          {/* 🔥 DYNAMIC HERO MOCKUP 🔥 */}
          <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto', transform: 'translateY(20px)' }}>
             <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #0D0D14 5%, transparent 40%)', zIndex: 2 }}></div>
             <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80" alt="Illustration of digital analytics" style={{ width: '100%', height: 'auto', borderRadius: '16px 16px 0 0', border: `1px solid ${C.darkLine}`, borderBottom: 'none', display: 'block', objectFit: 'cover' }} />
          </div>
        </div>
      </div>

      {/* ── PLATFORM GUARANTEES ── */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 64, flexWrap: 'wrap', padding: '64px 5%', background: C.ink, borderBottom: `1px solid ${C.darkLine}` }}>
          <div style={{ textAlign: 'center', maxWidth: 200 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🛡️</div>
            <div className="heading" style={{ fontSize: 20, color: C.lime, marginBottom: 8 }}>Genuine Contributions</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>Tasks require honest participation and may be checked for compliance.</div>
          </div>
          <div style={{ textAlign: 'center', maxWidth: 200 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚡</div>
            <div className="heading" style={{ fontSize: 20, color: C.lime, marginBottom: 8 }}>Verified Rewards</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>Withdrawals depend on approved, funded rewards and applicable payment checks.</div>
          </div>
          <div style={{ textAlign: 'center', maxWidth: 200 }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🤝</div>
            <div className="heading" style={{ fontSize: 20, color: C.lime, marginBottom: 8 }}>Funded Campaigns</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>Business campaigns require funding and approval before rewards are payable.</div>
          </div>
      </div>

      {/* ── VALUE PROP SECTION ── */}
      <section className="lp-section-pad" style={{ background: C.off }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 className="lp-section-title heading" style={{ color: C.ink, marginBottom: 16 }}>Two markets.<br />One infrastructure.</h2>
          <p style={{ color: C.slate, maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>Taskivo seamlessly bridges the gap between enterprise marketing demands and global micro-earning liquidity.</p>
        </div>
        <div className="lp-grid-2" style={{ maxWidth: 1000, margin: '0 auto' }}>
          
          {/* Creator Card */}
          <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 16, overflow: 'hidden' }}>
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" alt="Business Analytics" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
            <div style={{ padding: 40 }}>
              <div style={{ display: 'inline-block', background: C.ink, color: C.lime, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '6px 12px', borderRadius: 6, marginBottom: 24 }}>For Businesses</div>
              <h3 className="heading" style={{ fontSize: 24, marginBottom: 16, color: C.ink }}>Outsource digital friction.</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.slate, fontSize: 15 }}><span style={{ color: C.ink, fontWeight: 'bold' }}>✓</span> Collect genuine usability feedback</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.slate, fontSize: 15 }}><span style={{ color: C.ink, fontWeight: 'bold' }}>✓</span> Test apps and identify issues</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.slate, fontSize: 15 }}><span style={{ color: C.ink, fontWeight: 'bold' }}>✓</span> Commission authentic UGC videos</li>
              </ul>
              <button style={{ background: C.ink, color: C.white, border: 'none', borderRadius: 6, padding: '12px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%' }} onClick={goRegisterCreator}>Explore B2B Solutions</button>
            </div>
          </div>

          {/* Earner Card */}
          <div style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 16, overflow: 'hidden' }}>
            <img src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80" alt="Contributor Using Phone" style={{ width: '100%', height: 200, objectFit: 'cover' }} />
            <div style={{ padding: 40 }}>
              <div style={{ display: 'inline-block', background: C.limeDim, color: '#3d6600', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '6px 12px', borderRadius: 6, marginBottom: 24 }}>For Contributors</div>
              <h3 className="heading" style={{ fontSize: 24, marginBottom: 16, color: C.ink }}>Monetize your attention.</h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: 12, color: C.slate, fontSize: 15 }}><span style={{ color: C.lime, fontWeight: 'bold' }}>●</span> <span style={{flex: 1}}><strong>Micro-thresholds:</strong> Withdraw eligible funded rewards when available.</span></li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.slate, fontSize: 15 }}><span style={{ color: C.lime, fontWeight: 'bold' }}>●</span> Explore surveys and microtasks when available</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 12, color: C.slate, fontSize: 15 }}><span style={{ color: C.lime, fontWeight: 'bold' }}>●</span> Withdraw directly to local bank accounts</li>
              </ul>
              <button style={{ background: C.lime, color: C.ink, border: 'none', borderRadius: 6, padding: '12px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%' }} onClick={goRegisterEarner}>Access Earner Dashboard</button>
            </div>
          </div>

        </div>
      </section>

      {/* ── DYNAMIC PRICING TOGGLE ── */}
      <section className="lp-section-pad" style={{ background: C.white }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase', color: C.slate, marginBottom: 12 }}>Business Services</div>
          <h2 className="lp-section-title heading" style={{ color: C.ink, marginBottom: 16 }}>Business services and campaign packages.</h2>
          <p style={{ color: C.slate, maxWidth: 500, margin: '0 auto', lineHeight: 1.6, marginBottom: 32 }}>Compare starting prices in USD across six business services. Final scope, funding and fees are confirmed before payment. Advertising spend, where applicable, is separate.</p>

          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, background: C.off, padding: 6, borderRadius: 24, border: `1px solid ${C.line}`, marginBottom: 32, maxWidth: 800, margin: '0 auto 32px' }}>
            {services.map(service => (
            <button key={service.id} onClick={() => setPricingMode(service.id)} style={{ background: pricingMode === service.id ? C.ink : 'transparent', color: pricingMode === service.id ? C.white : C.slate, border: 'none', padding: '10px 18px', borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" }}>{service.label}</button>
            ))}
          </div>

          {/* DYNAMIC SERVICE EXPLAINER BOX */}
          <div style={{ maxWidth: 800, margin: '0 auto 40px', padding: 24, background: C.ink, borderRadius: 16, border: `1px solid ${C.darkLine}`, color: C.white, textAlign: 'left', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{ fontSize: 24 }}>{selectedService.icon}</div>
            <div>
               <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: C.lime }}>{selectedService.title}</div>
               <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{selectedService.desc}</div>
            </div>
          </div>

        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, maxWidth: 1200, margin: '0 auto', alignItems: 'center' }}>
          {activePricing.map(function(plan, i) {
            return (
              <div key={i} style={{ background: plan.isPopular ? C.ink : C.white, color: plan.isPopular ? C.white : C.ink, border: `1px solid ${plan.isPopular ? C.ink : C.line}`, borderRadius: 16, padding: plan.isPopular ? '48px 24px' : '32px 24px', boxShadow: plan.isPopular ? '0 20px 40px rgba(0,0,0,0.1)' : 'none', position: 'relative', display: 'flex', flexDirection: 'column' }}>
                {plan.isPopular && <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: C.lime, color: C.ink, fontSize: 11, fontWeight: 700, padding: '6px 16px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: 1, whiteSpace: 'nowrap' }}>Best Value</div>}
                <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{plan.name}</div>
                <div className="heading" style={{ fontSize: 30, color: plan.isPopular ? C.lime : C.ink, marginBottom: 8 }}>From ${plan.amount}</div>
                <div style={{ fontSize: 13, fontWeight: 600, paddingBottom: 24, borderBottom: `1px solid ${plan.isPopular ? C.darkLine : C.line}`, marginBottom: 24 }}>{plan.scope}</div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 14, flexGrow: 1 }}>
                  {plan.features.map(function(feat, idx) {
                    return <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 12, color: plan.isPopular ? 'rgba(255,255,255,0.7)' : C.slate, fontWeight: 500 }}><span style={{ color: plan.isPopular ? C.lime : C.ink, fontWeight: 'bold' }}>✓</span> {feat}</li>;
                  })}
                </ul>
                <button style={{ background: plan.isPopular ? C.lime : C.ink, color: plan.isPopular ? C.ink : C.white, border: 'none', borderRadius: 6, padding: '12px', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%', fontFamily: "'DM Sans', sans-serif" }} onClick={() => { localStorage.setItem("taskivo_requested_service", selectedService.id); localStorage.setItem("taskivo_requested_package", plan.id); navigate("create-task"); }}>Choose {plan.name}</button>
              </div>
            );
          })}
        </div>
      </section>

      <section className="lp-section-pad" style={{background:C.off}}>
        <h2 className="lp-section-title heading" style={{textAlign:'center',marginBottom:32}}>Explore all Taskivo services</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:20,maxWidth:1100,margin:'0 auto'}}>
          {services.map(service=><div key={service.id} style={{background:C.white,border:'1px solid '+C.line,borderRadius:16,padding:24}}><div style={{fontSize:24}}>{service.icon}</div><h3 style={{fontSize:18,margin:'12px 0'}}>{service.title}</h3><p style={{fontSize:14,color:C.slate,lineHeight:1.6}}>{service.desc}</p><p style={{fontSize:15,fontWeight:700,color:C.ink}}>From ${servicePackages[service.id][0].amount}</p><button onClick={()=>{localStorage.setItem('taskivo_requested_service',service.id);localStorage.removeItem('taskivo_requested_package');navigate('create-task');}} style={{background:C.ink,color:C.white,border:0,borderRadius:8,padding:'10px 16px',cursor:'pointer'}}>Request a quote</button></div>)}
        </div>
      </section>

      {/* 🔥 CUSTOM APP MOCKUP SECTION 🔥 */}
      <section className="lp-section-pad" style={{ background: C.ink, color: C.white, borderTop: `1px solid ${C.darkLine}`, borderBottom: `1px solid ${C.darkLine}` }}>
        <div className="lp-grid-2" style={{ maxWidth: 1000, margin: '0 auto', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-block', background: 'rgba(168,255,62,0.1)', color: C.lime, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '6px 12px', borderRadius: 6, marginBottom: 24 }}>Native Experience</div>
            <h2 className="heading" style={{ fontSize: 36, marginBottom: 16, lineHeight: 1.1 }}>Take Taskivo Everywhere.</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 1.6, marginBottom: 32, maxWidth: 400 }}>
              Whether you are managing enterprise ad spend or monetizing your daily screen time, the Taskivo Android app delivers a frictionless, lightning-fast native experience.
            </p>
            
            {/* Play Store Placeholder Button */}
            <a href="https://play.google.com/store/apps/details?id=com.taskivo.app" target="_blank" rel="noreferrer" className="play-store-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 3.5L19.5 12L4 20.5V3.5Z" fill="url(#playStoreGradient)"/>
                <defs>
                  <linearGradient id="playStoreGradient" x1="4" y1="3.5" x2="19.5" y2="12" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00E676"/>
                    <stop offset="0.5" stopColor="#FFEB3B"/>
                    <stop offset="1" stopColor="#29B6F6"/>
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase' }}>Get it on</span>
                <span style={{ fontSize: 16, fontWeight: 800, fontFamily: "'Montserrat', sans-serif", letterSpacing: '-0.5px' }}>Google Play</span>
              </div>
            </a>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            {/* 🔥 CSS DASHBOARD UI MOCKUP 🔥 */}
            <div style={{ position: 'relative', width: 280, height: 560, background: '#0D0D14', border: `8px solid #2A2A35`, borderRadius: 36, overflow: 'hidden', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
              
              {/* iPhone Notch */}
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 100, height: 24, background: '#2A2A35', borderBottomLeftRadius: 12, borderBottomRightRadius: 12, zIndex: 10 }}></div>
              
              {/* UI Container */}
              <div style={{ padding: '48px 20px 24px', height: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
                
                {/* Top Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#A8FF3E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: 10, fontWeight: 'bold' }}>U</div>
                    <div style={{ height: 8, width: 40, background: 'rgba(255,255,255,0.8)', borderRadius: 4 }}></div>
                  </div>
                  <div style={{ height: 16, width: 16, borderRadius: 4, background: 'rgba(255,255,255,0.1)' }}></div>
                </div>

                {/* Balance Card */}
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', color: '#6B7280', marginBottom: 8, letterSpacing: '1px' }}>Available Balance</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 16 }}>
                    <div style={{ fontSize: 32, fontWeight: 800, color: '#fff', fontFamily: "'Montserrat', sans-serif" }}>1,250</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#A8FF3E' }}>PTS</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ flex: 1, background: '#A8FF3E', height: 28, borderRadius: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <div style={{ width: 40, height: 4, background: '#000', borderRadius: 2 }}></div>
                    </div>
                    <div style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', height: 28, borderRadius: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <div style={{ width: 30, height: 4, background: '#fff', borderRadius: 2 }}></div>
                    </div>
                  </div>
                </div>

                {/* Progress Card */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>Cashout Progress</div>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#fff' }}>12/100</div>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: '40%', height: '100%', background: '#A8FF3E' }}></div>
                  </div>
                </div>

                {/* Mock Task List */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>Available Tasks</div>
                     <div style={{ fontSize: 9, color: '#A8FF3E' }}>See all</div>
                  </div>
                  
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.02)', padding: 12, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(168,255,62,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>▶️</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ height: 6, width: '80%', background: 'rgba(255,255,255,0.8)', borderRadius: 3, marginBottom: 6 }}></div>
                      <div style={{ height: 4, width: '40%', background: 'rgba(255,255,255,0.3)', borderRadius: 2 }}></div>
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#A8FF3E' }}>+25 PTS</div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.02)', padding: 12, borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(212,175,55,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🔍</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ height: 6, width: '60%', background: 'rgba(255,255,255,0.8)', borderRadius: 3, marginBottom: 6 }}></div>
                      <div style={{ height: 4, width: '50%', background: 'rgba(255,255,255,0.3)', borderRadius: 2 }}></div>
                    </div>
                    <div style={{ fontSize: 10, fontWeight: 700, color: '#D4AF37' }}>+30 PTS</div>
                  </div>
                </div>

                {/* Bottom Nav Mockup */}
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-around', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: 20, height: 20, borderRadius: 4, background: '#A8FF3E' }}></div>
                  <div style={{ width: 20, height: 20, borderRadius: 4, background: 'rgba(255,255,255,0.2)' }}></div>
                  <div style={{ width: 20, height: 20, borderRadius: 4, background: 'rgba(255,255,255,0.2)' }}></div>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="lp-section-pad" style={{ background: C.off }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 className="heading" style={{ fontSize: 28, color: C.ink, marginBottom: 12 }}>Platform Architecture & FAQs</h2>
            <p style={{ color: C.slate, fontSize: 14 }}>Built for transparency and absolute fairness.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {faqs.map(function(faq, i) {
              const isOpen = openFaq === i;
              return (
                <div key={i} style={{ background: C.white, border: `1px solid ${C.line}`, borderRadius: 8, overflow: 'hidden' }}>
                  <button onClick={function() { toggleFaq(i); }} style={{ width: '100%', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: C.ink, textAlign: 'left', gap: 16 }}>
                    <span>{faq.q}</span>
                    <span style={{ color: C.slate, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', marginTop: 2 }}>▼</span>
                  </button>
                  {isOpen && <div style={{ padding: '0 20px 20px', color: C.slate, fontSize: 14, lineHeight: 1.6 }}>{faq.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 🔥 PUBLIC SUPPORT BLOCK 🔥 */}
      <div style={{ background: C.ink, padding: '80px 5%', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: C.white, fontFamily: "'DM Sans', sans-serif", marginBottom: 16, letterSpacing: '-0.5px' }}>Need Assistance?</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginBottom: 40, lineHeight: 1.6 }}>
            For partnership inquiries, deployment issues, or general questions, bypass the bots and reach our core team directly.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:support@taskivo.online" style={{ background: C.lime, color: C.ink, textDecoration: 'none', padding: '14px 28px', borderRadius: 8, fontSize: 14, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", transition: 'opacity 0.2s' }}>
              ✉️ Email Support
            </a>
            <a href="https://twitter.com/taskivo" target="_blank" rel="noreferrer" style={{ background: 'transparent', border: `1px solid ${C.darkLine}`, color: C.white, textDecoration: 'none', padding: '14px 28px', borderRadius: 8, fontSize: 14, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", transition: 'background 0.2s' }}>
              Follow on X
            </a>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ background: C.white, borderTop: `1px solid ${C.line}`, padding: '64px 5% 32px' }}>
        <div className="lp-footer-grid" style={{ maxWidth: 1100, margin: '0 auto', marginBottom: 48 }}>
          <div className="lp-footer-brand-span">
            <div className="heading" style={{ color: C.ink, fontSize: 22, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: C.lime, display: 'inline-block' }}></span>Taskivo</div>
            <p style={{ color: C.slate, fontSize: 14, lineHeight: 1.6, maxWidth: 300, marginBottom: 24 }}>A digital microtask platform connecting contributors with genuine research, testing and content opportunities.</p>
            <div style={{ fontSize: 13, color: C.ink, fontWeight: 700 }}>support@taskivo.online</div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.ink, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>Product</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <li><span style={{ color: C.slate, cursor: "pointer", fontSize: 14 }} onClick={goRegisterEarner}>For Contributors</span></li>
              <li><span style={{ color: C.slate, cursor: "pointer", fontSize: 14 }} onClick={goRegisterCreator}>For Businesses</span></li>
            </ul>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.ink, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>Company</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <li><a href="/about" style={{ color: C.slate, fontSize: 14 }} onClick={function(e) { if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return; e.preventDefault(); navigate("about"); }}>About Us</a></li>
              <li><a href="/paid-surveys" style={{ color: C.slate, fontSize: 14 }}>Paid surveys</a></li>
              <li><a href="/microtasks" style={{ color: C.slate, fontSize: 14 }}>Online microtasks</a></li>
              <li><a href="/blog" style={{ color: C.slate, fontSize: 14 }} onClick={function(e) { if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return; e.preventDefault(); navigate("blog"); }}>Intelligence Blog</a></li>
            </ul>
          </div><div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.ink, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 20 }}>Legal</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
              <li><a href="/terms" style={{ color: C.slate, fontSize: 14 }} onClick={function(e) { if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return; e.preventDefault(); navigate("terms"); }}>Terms of Service</a></li>
              <li><a href="/privacy" style={{ color: C.slate, fontSize: 14 }} onClick={function(e) { if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return; e.preventDefault(); navigate("privacy"); }}>Privacy Policy</a></li>
              <li><a href="/disclaimer" style={{ color: C.slate, fontSize: 14 }} onClick={function(e) { if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return; e.preventDefault(); navigate("disclaimer"); }}>Legal Disclaimer</a></li>
            </ul>
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${C.line}`, paddingTop: 24, color: C.slate, fontSize: 13, flexWrap: 'wrap', gap: 16 }}>
          <div>© {new Date().getFullYear()} Taskivo. All rights reserved. B2B Platform.</div>
          <div style={{ display: 'flex', gap: 16 }}><span>Built for genuine contributions.</span></div>
        </div>
      </footer>
    </div>
  );
}
