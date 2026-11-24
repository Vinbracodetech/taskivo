import { useEffect,useState } from 'react';
import { youtubeNigeriaPlans,formatNaira } from '../lib/serviceCatalog.js';
export const youtubePageTitle="YouTube Monetization Support in Nigeria | Taskivo";
export const youtubePageDescription="Affordable YouTube channel audits, organic content optimization and monetization support for Nigerian creators. Choose a service from ₦5,000 and discuss your growth goals privately.";
const faq=[
 ['Can you guarantee my watch hours or subscribers?','No. We agree a realistic goal after reviewing your channel. Service fees cover the work described in your package, not the purchase of engagement. Genuine audience response and YouTube eligibility checks determine results.'],
 ['What are the monetization requirements?','For the standard ad-revenue route, YouTube generally requires 1,000 subscribers and 4,000 valid public watch hours in the last 12 months, or 10 million valid public Shorts views in the last 90 days. Eligibility also depends on channel policies and review. Check the Earn tab in YouTube Studio.'],
 ['How do I give Taskivo access?','For management work, invite the Taskivo team through YouTube Studio channel permissions with the minimum necessary role. Keep ownership, passwords, recovery details and verification codes private. Remove access when the engagement ends.'],
 ['Do you pay people to watch my videos?','No. We optimize content for genuine audiences. We do not purchase views, pay viewers, operate subscriber exchanges or guarantee monetization approval.'],
 ['Can I pay immediately?','First send an enquiry. We review the channel, agree the service scope, confirm the price and timeline privately, and only then arrange payment. No automatic checkout is enabled.'],
 ['Will Taskivo run ads for my channel?','No channel advertising is included. Taskivo may advertise its own services to reach new customers.']
];
const styles=`
.yt-page{background:#f7f8fa;color:#101017;line-height:1.6}
.yt-wrap{max-width:1120px;margin:auto;padding:58px 5%}
.yt-hero{background:#0d0d14;color:#fff}
.yt-grid{display:grid;grid-template-columns:1.2fr 1fr;gap:32px;align-items:center}
.yt-hero h1{font-size:clamp(30px,5vw,52px);line-height:1.12;letter-spacing:-1.5px;margin:16px 0}
.yt-page h2{font-size:clamp(24px,3.5vw,34px);line-height:1.2;margin-bottom:14px}
.yt-copy{color:#626977;margin-bottom:20px}
.yt-hero .yt-copy{color:#d1d5db}
.yt-btn{display:inline-flex;justify-content:center;align-items:center;gap:8px;background:#a8ff3e;color:#101017;font-weight:800;border:0;border-radius:9px;padding:13px 19px;text-decoration:none;cursor:pointer}
.yt-outline{background:transparent;border:1px solid #dfe2e7;color:#101017}
.yt-panel{background:#171821;border:1px solid #34353e;padding:24px;border-radius:16px}
.yt-panel p{color:#d1d5db;font-size:14px}
.yt-stat{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:16px 0}
.yt-stat div{background:#0d0d14;padding:16px;border-radius:10px}
.yt-stat strong{display:block;color:#a8ff3e;font-size:24px}
.yt-stat small{color:#c7c9d0}
.yt-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:16px}
.yt-card{border:1px solid #e0e2e6;border-radius:16px;background:white;padding:22px;display:flex;flex-direction:column;gap:12px}
.yt-card strong{font-size:27px;line-height:1.2}
.yt-card ul{padding-left:18px;font-size:14px;color:#626977;flex:1}
.yt-card li{margin-bottom:8px}
.yt-form label{display:block;font-size:14px;font-weight:700;margin:0 0 12px}
.yt-form input,.yt-form select,.yt-form textarea{display:block;width:100%;margin-top:6px;border:1px solid #cfd3dc;border-radius:8px;background:white;color:#101017;padding:12px;font-size:14px;box-sizing:border-box}
.yt-faq details{border-bottom:1px solid #dedfe3;padding:16px 0}
.yt-faq summary{font-weight:700;cursor:pointer}
.yt-faq p{margin-top:10px;color:#626977}
@media(max-width:760px){.yt-wrap{padding:38px 5%}.yt-grid{grid-template-columns:1fr;gap:20px}.yt-card{padding:18px}}
`;
export default function YoutubeMonetization(){
 const [plan,setPlan]=useState('starter'),[channel,setChannel]=useState(''),[hours,setHours]=useState('1000'),[subs,setSubs]=useState('50'),[notes,setNotes]=useState('');
 useEffect(()=>{document.title=youtubePageTitle;const m=document.querySelector('meta[name="description"]');if(m)m.content=youtubePageDescription;},[]);
 function choose(id){setPlan(id);document.getElementById('youtube-enquiry')?.scrollIntoView({behavior:'smooth',block:'start'});}
 function submit(e){e.preventDefault();const p=youtubeNigeriaPlans.find(x=>x.id===plan);const lines=['Hello Taskivo,','I would like a YouTube channel consultation.','Service: '+p.name+' ('+formatNaira(p.amount)+' starting fee)','Public channel URL: '+channel.trim(),'Desired additional valid public watch hours (goal only): '+hours,'Desired additional subscribers (goal only): '+subs,'Notes: '+notes.trim(),'Please assess feasibility, confirm scope and timeline before payment.'];window.location.href='mailto:support@taskivo.online?subject='+encodeURIComponent('Taskivo YouTube growth enquiry')+'&body='+encodeURIComponent(lines.join('\n'));}
 return <main className="yt-page"><style>{styles}</style>
 <section className="yt-hero"><div className="yt-wrap yt-grid"><div><span style={{color:'#a8ff3e',fontWeight:800,fontSize:12,letterSpacing:1}}>TASKIVO · FOR NIGERIAN CREATORS</span><h1>YouTube monetization support.<br/><span style={{color:'#a8ff3e'}}>Grow your channel organically.</span></h1><p className="yt-copy">Get practical support with content discovery, viewer retention and channel optimization. Build toward your own watch-hour and subscriber goals with an affordable service plan.</p><a className="yt-btn" href="#youtube-packages">Explore packages from ₦5,000</a><p style={{marginTop:14,fontSize:13,color:'#d1d5db'}}>Private enquiries only. No purchased engagement or guaranteed results.</p></div><div className="yt-panel"><strong>Know your monetization goal</strong><div className="yt-stat"><div><strong>4,000</strong><small>valid public watch hours / 12 months</small></div><div><strong>1,000</strong><small>subscribers</small></div></div><p>Standard long-form ad-revenue eligibility route. YouTube reviews each channel independently. Shorts have a separate eligibility route.</p><p style={{marginTop:12}}><a href="https://support.google.com/youtube/answer/72851" target="_blank" rel="noopener noreferrer" style={{color:'#a8ff3e'}}>Official YouTube requirements ↗</a></p></div></div></section>
 <section className="yt-wrap" id="youtube-packages"><h2>Affordable packages in naira</h2><p className="yt-copy">Choose the amount of support you need. Prices are starting service fees, not prices per watch hour or subscriber. Final scope is confirmed privately.</p><div className="yt-cards">{youtubeNigeriaPlans.map(p=><article key={p.id} className="yt-card"><h3>{p.name}</h3><strong>{formatNaira(p.amount)}</strong><small>Starting fee</small><p>{p.scope}</p><ul>{p.features.map(f=><li key={f}>{f}</li>)}</ul><button type="button" className="yt-btn" onClick={()=>choose(p.id)}>Discuss package</button></article>)}</div></section>
 <section style={{background:'#fff'}}><div className="yt-wrap yt-grid"><div><h2>Tell us your growth target</h2><p className="yt-copy">Whether you're aiming for another 500, 1,000 or 4,000 watch hours, or want to grow your subscriber base, tell us where your channel stands. We assess the channel first and propose a realistic organic strategy.</p><div className="yt-card"><strong style={{fontSize:18}}>You keep control of your channel</strong><p>For channel management, grant revocable YouTube Studio permissions. We never ask for passwords, OTPs or recovery codes.</p><a href="https://support.google.com/youtube/answer/9481328" target="_blank" rel="noopener noreferrer" style={{color:'#315a11',fontWeight:700}}>Learn about channel permissions ↗</a></div></div>
 <form className="yt-form yt-card" id="youtube-enquiry" onSubmit={submit}><h2 style={{fontSize:22}}>Request a private consultation</h2><label>Service package<select value={plan} onChange={e=>setPlan(e.target.value)}>{youtubeNigeriaPlans.map(p=><option key={p.id} value={p.id}>{p.name} — {formatNaira(p.amount)}</option>)}</select></label><label>Public YouTube channel URL<input type="url" value={channel} onChange={e=>setChannel(e.target.value)} required maxLength={300} placeholder="https://www.youtube.com/@yourchannel"/></label><label>Additional watch-hour goal<select value={hours} onChange={e=>setHours(e.target.value)}>{['Not sure','500','1000','2000','3000','4000'].map(n=><option key={n} value={n}>{n==='Not sure'?n:Number(n).toLocaleString('en-NG')+' hours'}</option>)}</select></label><label>Additional subscriber goal<select value={subs} onChange={e=>setSubs(e.target.value)}>{['Not sure','50','100','250','500','1000'].map(n=><option key={n} value={n}>{n==='Not sure'?n:Number(n).toLocaleString('en-NG')+' subscribers'}</option>)}</select></label><label>Current channel status and goals (optional)<textarea rows="3" maxLength={600} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Current watch hours, subscriber count and niche"/></label><button className="yt-btn" type="submit">Prepare email enquiry</button><small style={{color:'#626977'}}>Opens your email app. Nothing is sent until you send it. Never include login details. Or email <a href="mailto:support@taskivo.online">support@taskivo.online</a>.</small></form></div></section>
 <section className="yt-wrap yt-faq"><h2>Frequently asked questions</h2>{faq.map(([q,a])=><details key={q}><summary>{q}</summary><p>{a}</p></details>)}<p style={{marginTop:24}}><a href="/">Return to Taskivo homepage</a> · <a href="/privacy">Privacy policy</a></p></section></main>;
}
