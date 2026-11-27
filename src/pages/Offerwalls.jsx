import {useEffect,useState} from 'react';
import {supabase} from '../lib/supabase';
const partners={
 moonetix:{name:'Moonetix',endpoint:'moonetix-link',desc:'Discover sponsored offers and games. Rewards are subject to provider verification.'},
 'offerwall-gg':{name:'Offerwall.GG',endpoint:'offerwall-gg-link',desc:'Discover surveys and sponsored offers. Availability varies by country.'}
};
const button={background:'var(--surface-card)',color:'var(--ink)',border:'1px solid var(--line)',borderRadius:12,padding:'10px 14px',fontWeight:700,cursor:'pointer'};
export default function Offerwalls({session,navigate,provider}){
 const partner=partners[provider],user=session?.user;
 const [url,setUrl]=useState(null),[error,setError]=useState(''),[loading,setLoading]=useState(false),[attempt,setAttempt]=useState(0),[copied,setCopied]=useState(false);
 useEffect(()=>{
  if(!partner||!user?.id)return;
  let active=true;
  setLoading(true);setError('');setUrl(null);setCopied(false);
  (async()=>{
   try{
    const {data,error}=await supabase.functions.invoke(partner.endpoint,{body:{}});
    if(error)throw error;
    if(!data?.enabled){if(active)setError('This provider is currently unavailable for your account.');return;}
    const link=new URL(data.url);
    const valid=provider==='moonetix'?link.origin==='https://wall.moonetix.com'&&link.pathname==='/808a5b2fd2760f39ed2cd6ea'&&link.searchParams.has('hash'):link.origin==='https://offerwall.gg'&&link.pathname.startsWith('/wall/');
    if(!valid)throw new Error('Invalid provider URL');
    if(active)setUrl(link.href);
   }catch{if(active)setError('Unable to connect to this provider. Please retry or contact support.');}
   finally{if(active)setLoading(false);}
  })();
  return()=>{active=false;};
 },[provider,user?.id,attempt]);
 if(!user)return <p>Please sign in to access offerwalls.</p>;
 if(!partner)return <main style={{maxWidth:900,margin:'auto',padding:'32px 5%',color:'var(--ink)'}}><h1>Offerwalls &amp; Surveys</h1><p>Choose a provider to open its dedicated page.</p><div style={{display:'grid',gap:12}}>{Object.entries(partners).map(([id,p])=><button key={id} style={{...button,textAlign:'left'}} onClick={()=>navigate(id)}><strong>{p.name}</strong><p>{p.desc}</p></button>)}</div><button style={{...button,marginTop:16}} onClick={()=>navigate('tasks')}>Back to Tasks</button></main>;
 return <main style={{minHeight:'80vh',color:'var(--ink)',background:'var(--surface)',padding:'12px 3% 90px',maxWidth:1240,margin:'auto'}}>
 <header style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10,flexWrap:'wrap',marginBottom:12}}><div><h1 style={{fontSize:22,margin:'0 0 4px'}}>{partner.name}</h1><small style={{color:'var(--slate)'}}>Verified rewards go to your Taskivo wallet.</small></div><button style={button} onClick={()=>navigate('tasks')}>← Tasks</button></header>
 <div style={{display:'flex',flexWrap:'wrap',gap:8,marginBottom:12}}><button style={button} disabled={loading} onClick={()=>setAttempt(n=>n+1)}>Reload offerwall</button>{url&&<a style={{...button,textDecoration:'none'}} href={url} target="_blank" rel="noopener noreferrer">Open in browser ↗</a>}</div>
 {loading&&<p role="status">Connecting to {partner.name}…</p>}{error&&<p role="alert">{error}</p>}
 {url&&<iframe key={attempt} src={url} title={partner.name+' offerwall'} style={{display:'block',width:'100%',height:'max(620px, 78dvh)',border:'1px solid var(--line)',borderRadius:12,background:'#0b0c0c'}} allow="clipboard-write" referrerPolicy="strict-origin-when-cross-origin"/>}
 <details style={{marginTop:12,color:'var(--slate)',fontSize:13}}><summary>Having trouble loading?</summary><p>Try reloading to generate a fresh signed link. If the provider reports an invalid security hash, contact Taskivo support.</p>{provider==='moonetix'&&url&&<button style={button} onClick={async()=>{try{await navigator.clipboard.writeText(url);setCopied(true);}catch{setCopied(false);}}}>{copied?'Copied — keep this link private':'Copy my link for provider verification'}</button>}<p><button style={button} onClick={()=>navigate('support')}>Help &amp; Support</button></p></details>
 </main>;
}
