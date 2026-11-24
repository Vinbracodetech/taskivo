import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { services, privateInquiry } from '../lib/serviceCatalog.js';
const wrapper={padding:'36px 5% 110px',maxWidth:1000,margin:'auto',color:'var(--ink)',fontFamily:"'DM Sans',sans-serif"};
const card={background:'var(--surface-card)',border:'1px solid var(--line)',borderRadius:16,padding:22};
const button={background:'var(--lime)',color:'#111',border:0,borderRadius:9,padding:'12px 18px',fontWeight:800,cursor:'pointer'};
const grid={display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,270px),1fr))',gap:16};
export function CampaignRequest({user,navigate}){
 return <main style={wrapper}><span style={{color:'var(--slate)',fontSize:13}}>PRIVATE BUSINESS ENQUIRIES</span><h1>Discuss a Taskivo service</h1><p style={{lineHeight:1.7,color:'var(--slate)'}}>Self-service campaign purchases and online checkout are paused. You may enquire privately about any listed service. We confirm scope, availability and fees before any payment. Existing account records have not been deleted.</p><h2 style={{margin:'26px 0 14px'}}>YouTube monetization &amp; organic growth</h2><p style={{color:'var(--slate)',lineHeight:1.7}}>Affordable support for Nigerian creators from ₦5,000. Discuss your growth goals and agree a service plan privately.</p><a style={{...button,display:'inline-block',textDecoration:'none',marginTop:12}} href="/youtube-monetization">Explore naira packages</a><h2 style={{margin:'26px 0 14px'}}>Other business services</h2><div style={grid}>{services.map(s=><article style={card} key={s.id}><h2 style={{fontSize:18}}>{s.title}</h2><p style={{color:'var(--slate)',lineHeight:1.6}}>{s.desc}</p><a style={{...button,display:'inline-block',textDecoration:'none',marginTop:12}} href={privateInquiry(s.title)}>Enquire privately</a></article>)}</div><div style={{display:'flex',gap:12,flexWrap:'wrap',marginTop:24}}><button style={button} onClick={()=>navigate(user?'tasks':'landing')}>Explore Taskivo</button>{user&&<button style={button} onClick={()=>navigate('history')}>Existing account history</button>}</div></main>;
}
export { EarningMarketplace } from './TaskNetwork.jsx';
