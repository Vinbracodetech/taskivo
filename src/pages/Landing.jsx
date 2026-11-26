import { useEffect } from 'react';
import { services, privateInquiry } from '../lib/serviceCatalog.js';
export const landingStyles = `
.lp-shell{font-family:'Montserrat',system-ui,sans-serif;color:#101017;background:#f7f8fa}
.lp-wrap{max-width:1120px;margin:auto;padding:64px 5%}
.lp-hero{background:#0d0d14;color:white}
.lp-hero-grid{display:grid;grid-template-columns:1.25fr 1fr;gap:44px;align-items:center}
.lp-hero h1{font-family:'Montserrat',system-ui,sans-serif;font-size:clamp(36px,5.5vw,64px);line-height:1.06;letter-spacing:-2px;margin:16px 0 24px}
.lp-shell h2{font-family:'Montserrat',system-ui,sans-serif;font-size:clamp(25px,4vw,38px);line-height:1.15;letter-spacing:-.8px;margin:0 0 16px}
.lp-copy{font-size:16px;line-height:1.7;color:#626977;margin:0 0 24px}
.lp-hero .lp-copy{color:#d1d5db}
.lp-actions{display:flex;gap:12px;flex-wrap:wrap;align-items:center}
.lp-btn{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;background:#a8ff3e;color:#101017;font-weight:800;border:0;border-radius:9px;padding:13px 20px;cursor:pointer;font-size:15px}
.lp-btn-secondary{background:transparent;border:1px solid #696a70;color:white}
.lp-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,250px),1fr));gap:16px}
.lp-card{background:white;border:1px solid #e1e3e7;padding:24px;border-radius:16px}
.lp-card h3{font-size:20px;margin:12px 0}
.lp-card p{color:#626977;line-height:1.6}
.lp-status{font-size:12px;font-weight:700;color:#4b5563;letter-spacing:.2px}
.lp-panel{border:1px solid #33343d;border-radius:18px;padding:22px;background:#171821}
.lp-panel-row{padding:16px 0;border-bottom:1px solid #33343d;display:flex;justify-content:space-between;gap:16px;align-items:center}
.lp-panel-row:last-child{border-bottom:0}
.lp-hero-visual{position:relative;min-width:0}
.lp-hero-photo{display:block;width:100%;height:auto;aspect-ratio:16/10;object-fit:cover;border-radius:20px;border:1px solid #33343d}
.lp-hero-visual .lp-panel{position:relative;margin:-32px 16px 0;box-shadow:0 12px 32px rgba(0,0,0,.35)}
.lp-editorial-grid{display:grid;grid-template-columns:1fr 1fr;gap:34px;align-items:center;margin-bottom:26px}
.lp-editorial-photo{display:block;width:100%;height:auto;aspect-ratio:16/9;object-fit:cover;border-radius:18px}
.lp-step-list{display:grid;gap:14px}
.lp-step{display:flex;align-items:flex-start;gap:14px;border-bottom:1px solid #e1e3e7;padding:12px 0}
.lp-step-number{flex:none;display:grid;place-items:center;background:#e5f8cd;color:#233415;border-radius:10px;width:40px;height:40px;font-weight:800;font-size:13px}
.lp-step h3{margin:0 0 6px;font-size:17px}
.lp-step p{margin:0;color:#626977;line-height:1.65;font-size:14px}
@media(max-width:760px){.lp-editorial-grid{grid-template-columns:1fr;gap:20px}.lp-hero-visual .lp-panel{margin:-20px 8px 0}.lp-panel{padding:16px}}
.lp-shell details{padding:18px 0;border-bottom:1px solid #dfe2e6}
.lp-shell summary{font-weight:700;cursor:pointer}
.lp-shell details p{line-height:1.7;color:#626977}
.lp-footer{background:#0d0d14;color:#d1d5db}
.lp-footer a{color:#d1d5db;text-decoration:none}
@media(max-width:760px){.lp-wrap{padding:40px 5%}.lp-hero-grid{grid-template-columns:1fr;gap:28px}.lp-hero h1{letter-spacing:-1px}}
`;
const cards=[
{icon:'📋',title:'Surveys & offers',status:'Partner integration • limited pilot',desc:'Explore eligible surveys and sponsored offers through Offerwall.GG. Availability and reward approval depend on your country and the provider.',href:'/offerwalls',cta:'Explore offerwalls'},
{icon:'📚',title:'Internal blog tasks',status:'2 minutes · 3 wallet PTS',desc:'Read a published article in our private ad-free reader. Add 3 points to your wallet once per article. Cash withdrawals are currently unavailable.',href:'/tasks',cta:'Explore blog tasks'},
{icon:'📋',title:'Admin tasks',status:'As published',desc:'Complete official assignments published by the Taskivo administrator. Availability varies.',href:'/tasks',cta:'View admin tasks'}
];
const faqs=[
['Can I earn money on Taskivo?','Partner-funded rewards depend on eligible activities, provider verification and settlement. Offerwall.GG is in a limited pilot; withdrawals and general paid earning are not yet open.'],
['How do internal tasks work?','Read an article in the private reader for two minutes. Each eligible article adds 3 wallet points once per account. Cash withdrawals are currently unavailable.'],
['When will rewarded videos be available?','We will open them after a suitable provider approves Taskivo and reward tracking is verified.'],
['Do I need to pay to join?','No. Registration and internal reading tasks are free. Read any third-party offer requirements before participating.'],
['Can businesses request services?','Yes. Contact Taskivo privately about video feedback, audience research, SEO, publisher optimization, app testing or original UGC. Self-service campaign purchases remain paused. YouTube channel growth support is available by enquiry.'],
['Where do I get help?','Contact support@taskivo.online. Never send passwords or verification codes.']
];
export default function Landing({navigate,setAuthMode,user}){
 useEffect(()=>{document.title="Taskivo | Online Tasks, Paid Surveys & Rewards";const m=document.querySelector('meta[name="description"]');if(m)m.content="Explore online microtasks, partner-funded surveys and learning activities on Taskivo. Rewarded videos and business campaigns are planned; availability varies.";},[]);
 useEffect(()=>{if(document.getElementById('taskivo-styles'))return;const s=document.createElement('style');s.id='taskivo-styles';s.textContent=landingStyles;document.head.appendChild(s);},[]);
 const go=(e,route)=>{if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();navigate(route);};
 const start=e=>{if(e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();if(user){navigate('tasks');return;}localStorage.setItem('taskivo_role','earner');localStorage.removeItem('taskivo_requested_service');localStorage.removeItem('taskivo_requested_package');setAuthMode?.('register');navigate('auth');};
 return <main className="lp-shell">
 <section className="lp-hero"><div className="lp-wrap lp-hero-grid">
 <div><span style={{fontSize:12,fontWeight:700,color:'#a8ff3e',letterSpacing:1}}>TASKIVO · YOUR TASK NETWORK</span><h1>Complete online tasks.<br/><span style={{color:'#a8ff3e'}}>Make your time count.</span></h1><p className="lp-copy">Discover surveys, sponsored offers and internal blog reading tasks in one place. Join for free, build your experience and track eligible rewards.</p><div className="lp-actions"><a className="lp-btn" href="/auth" onClick={start}>{user?'Explore tasks':'Create a free account'}</a><a className="lp-btn lp-btn-secondary" href="/tasks" onClick={e=>go(e,'tasks')}>Browse tasks</a></div><p style={{fontSize:13,color:'#aeb0b8',marginTop:16}}>Cash earning is in a limited pilot. Rewards are not guaranteed.</p></div>
 <div className="lp-hero-visual"><img className="lp-hero-photo" src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&amp;fit=crop&amp;w=1000&amp;q=80" alt="Laptop displaying digital analytics and task-related work" width="1000" height="625" srcSet="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=480&q=75 480w, https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=75 800w, https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80 1000w" sizes="(max-width: 720px) 90vw, 48vw" fetchpriority="high" decoding="async"/><div className="lp-panel"><div style={{fontSize:13,fontWeight:700,color:'#a8ff3e',marginBottom:8}}>YOUR EARNING HUB</div>{cards.map(c=><div key={c.title} className="lp-panel-row"><div><strong>{c.icon} {c.title}</strong><div style={{fontSize:13,color:'#bfc2c9',marginTop:6}}>{c.status}</div></div>{c.href?<a href={c.href} onClick={e=>go(e,c.href.slice(1))} style={{color:'#a8ff3e',fontSize:14,fontWeight:700}}>Explore</a>:<span style={{fontSize:12,color:'#bfc2c9'}}>Planned</span>}</div>)}</div></div>
 </div></section>
 <section className="lp-wrap"><h2>Find your next task</h2><p className="lp-copy">Choose the activity that suits you. Your wallet tracks reading points and eligible partner rewards.</p><div className="lp-cards">{cards.map(c=><article className="lp-card" key={c.title}><div style={{fontSize:28}}>{c.icon}</div><h3>{c.title}</h3><div className="lp-status">{c.status}</div><p>{c.desc}</p>{c.href&&<a className="lp-btn" href={c.href} onClick={e=>go(e,c.href.slice(1))}>{c.cta}</a>}</article>)}</div></section>
 <section style={{background:'#fff'}}><div className="lp-wrap"><div className="lp-editorial-grid"><img className="lp-editorial-photo" src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&amp;fit=crop&amp;w=800&amp;q=80" alt="Person using a smartphone for online activities" width="800" height="450" loading="lazy" decoding="async"/><div><span className="lp-status">GET STARTED</span><h2 style={{marginTop:10}}>How Taskivo works</h2><div className="lp-step-list">{[['01','Join free','Create an account to access the task network.'],['02','Choose an activity','Check requirements, availability and reward type before participating.'],['03','Track progress','Track recorded blog rewards and eligible partner rewards in your wallet. Withdrawals remain paused.']].map(([n,t,d])=><div className="lp-step" key={n}><span className="lp-step-number">{n}</span><div><h3>{t}</h3><p>{d}</p></div></div>)}</div></div></div></div></section>
 <section className="lp-wrap"><h2>Resources for online earners</h2><p className="lp-copy">Read our guides without registering, earning points or completing offers. Learn how to recognize scams, understand surveys and work safely online.</p><div className="lp-cards">{[['/paid-surveys','Paid survey guide'],['/microtasks','Online microtasks guide'],['/blog','Taskivo blog'],['/article-paid-surveys-in-nigeria-beginners-guide','Paid surveys in Nigeria: complete guide'],['/article-youtube-monetization-nigeria','YouTube monetization guide']].map(([href,label])=><a className="lp-card" key={href} href={href} onClick={e=>go(e,href.slice(1))} style={{color:'#101017',fontWeight:700,textDecoration:'none'}}>{label} →</a>)}</div></section>
 <section style={{background:'#0d0d14',color:'#fff'}}><div className="lp-wrap"><div className="lp-editorial-grid"><div><span style={{color:'#a8ff3e',fontSize:12,fontWeight:800}}>YOUTUBE · AVAILABLE BY PRIVATE ENQUIRY</span><h2 style={{marginTop:14}}>YouTube monetization &amp; organic channel growth</h2><p style={{color:'#d1d5db',lineHeight:1.7,marginBottom:18}}>Affordable channel optimization for Nigerian creators. Discuss your watch-hour and subscriber growth goals with us. No purchased engagement or guaranteed results.</p><a className="lp-btn" href="/youtube-monetization" onClick={e=>go(e,'youtube-monetization')}>View plans from ₦5,000</a></div><div className="lp-panel" style={{lineHeight:1.7}}><strong>Secure channel management</strong><p style={{color:'#d1d5db',fontSize:14,marginTop:10}}>Keep channel ownership. Use only revocable YouTube Studio permissions. Watch hours, subscribers and monetization are evaluated independently by YouTube.</p></div></div></div></section>
 <section style={{background:'#fff'}}><div className="lp-wrap" id="business"><div className="lp-editorial-grid"><div><span className="lp-status">BUSINESS SERVICES · PRIVATE ENQUIRIES</span><h2 style={{marginTop:12}}>A contributor network for businesses</h2><p className="lp-copy">We are building our contributor community first. Self-service campaigns and online checkout remain paused, but you can request any of our services privately. Scope, availability and pricing are confirmed individually.</p></div><img className="lp-editorial-photo" src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&amp;fit=crop&amp;w=800&amp;q=80" alt="Laptop and business analytics workspace" width="800" height="450" loading="lazy" decoding="async"/></div><div className="lp-cards">{services.map(s=><article key={s.id} className="lp-card"><span>{s.icon}</span><h3>{s.title}</h3><p>{s.desc}</p><a className="lp-btn" href={privateInquiry(s.title)} style={{marginTop:12}}>Enquire privately</a></article>)}</div></div></section>
 <section className="lp-wrap"><h2>Frequently asked questions</h2>{faqs.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>
 <footer className="lp-footer"><div className="lp-wrap"><strong style={{fontSize:24,color:'white'}}>Taskivo</strong><p>Online tasks and learning opportunities.</p><div className="lp-actions">{[['/about','About'],['/blog','Blog'],['/terms','Terms'],['/privacy','Privacy'],['/disclaimer','Disclaimer']].map(([href,label])=><a key={href} href={href} onClick={e=>go(e,href.slice(1))}>{label}</a>)}<a href="mailto:support@taskivo.online">Support</a></div></div></footer>
 </main>;
}
