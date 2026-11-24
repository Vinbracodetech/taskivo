import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { services, servicePackages } from '../lib/serviceCatalog.js';

const field = {width:'100%',boxSizing:'border-box',background:'var(--surface)',color:'var(--ink)',border:'1px solid var(--line)',borderRadius:10,padding:12,fontSize:15,margin:'8px 0 20px'};
const button = {background:'var(--lime)',color:'#101010',border:0,borderRadius:10,padding:'13px 22px',fontWeight:800,cursor:'pointer'};
const wrapper = {padding:'36px 5%',maxWidth:960,margin:'0 auto',color:'var(--ink)',fontFamily:"'DM Sans', sans-serif"};
const card = {background:'var(--surface-card)',border:'1px solid var(--line)',borderRadius:16,padding:24};
function selected() {
  if(typeof window==='undefined') return 'qa';
  const id=localStorage.getItem('taskivo_requested_service');
  return services.some(s=>s.id===id)?id:'qa';
}
export function CampaignRequest({user,navigate,setAuthMode}) {
  const [serviceId,setServiceId]=useState(selected);
  const [packageId,setPackageId]=useState(()=>typeof window==='undefined'?'custom':localStorage.getItem('taskivo_requested_package')||'custom');
  const [title,setTitle]=useState('');
  const [brief,setBrief]=useState('');
  const [url,setUrl]=useState('');
  const [budget,setBudget]=useState('');
  const [status,setStatus]=useState('');
  const [sending,setSending]=useState(false);
  const service=services.find(s=>s.id===serviceId)||services[0];
  const plans=servicePackages[service.id];
  const chosen=plans.find(p=>p.id===packageId);
  async function submit(e) {
    e.preventDefault();
    if(sending||!user) return;
    if(!title.trim()||brief.trim().length<20){setStatus('Please provide a title and a brief of at least 20 characters.');return;}
    if(url.trim()&&!/^https?:\/\//i.test(url.trim())){setStatus('Enter a full HTTP or HTTPS project URL.');return;}
    setSending(true);setStatus('');
    try{
      const {data:auth,error:authError}=await supabase.auth.getUser();
      if(authError||!auth.user||auth.user.id!==user.id) throw new Error('Please sign in again.');
      const message=['Service: '+service.title,'Package: '+(chosen?chosen.name+' — from USD '+chosen.amount+' — '+chosen.scope:'Custom quote'),'Project: '+title.trim(),'URL: '+(url.trim()||'Not provided'),'Proposed budget: '+(budget.trim()||'Quote requested'),'Brief: '+brief.trim(),'Payment: Not collected; manual scope and funding review required.'].join('\n');
      const {error}=await supabase.from('support_tickets').insert({user_id:auth.user.id,category:'Business campaign inquiry',message});
      if(error) throw error;
      localStorage.removeItem('taskivo_requested_service');
      localStorage.removeItem('taskivo_requested_package');
      setTitle('');setBrief('');setUrl('');setBudget('');
      setStatus('Your request was submitted for review. Check your dashboard support tickets for a response. No payment was collected.');
    }catch{setStatus('We could not submit your request. Please try again or contact support.');}
    finally{setSending(false);}
  }
  return <main style={wrapper}>
    <h1 style={{fontSize:30,marginBottom:10}}>Request a business campaign</h1>
    <p style={{color:'var(--slate)',lineHeight:1.7}}>Choose a service and tell us what you need. We will confirm the scope, price and genuine deliverables before payment. Online checkout is temporarily paused.</p>
    <div style={card}>
      <label>Service<select style={field} value={serviceId} onChange={e=>{setServiceId(e.target.value);setPackageId('custom');localStorage.removeItem('taskivo_requested_package');localStorage.setItem('taskivo_requested_service',e.target.value);}}>{services.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></label>
      <label>Package<select style={field} value={chosen?.id||'custom'} onChange={e=>{setPackageId(e.target.value);localStorage.setItem('taskivo_requested_package',e.target.value);}}><option value="custom">Custom quote</option>{plans.map(p=><option key={p.id} value={p.id}>{p.name} — from ${p.amount} USD</option>)}</select></label>
      {chosen&&<div style={{border:'1px solid var(--line)',borderRadius:12,padding:16,marginBottom:20}}><strong>{chosen.name} · From ${chosen.amount} USD</strong><p>{chosen.scope}</p><ul>{chosen.features.map(f=><li key={f}>{f}</li>)}</ul><p style={{color:'var(--slate)',fontSize:13}}>Indicative price only. Final scope, fair contributor compensation and any additional expenses will be confirmed before payment.</p></div>}
      <h2 style={{fontSize:19}}>{service.title}</h2><p style={{color:'var(--slate)',lineHeight:1.6}}>{service.desc}</p>
      <ul>{service.deliverables.map(d=><li key={d} style={{margin:'8px 0'}}>{d}</li>)}</ul>
      {!user?<><p>Sign in or register to submit a request.</p><button style={button} onClick={()=>{localStorage.setItem('taskivo_requested_service',service.id);localStorage.setItem('taskivo_role','creator');setAuthMode('register');navigate('auth');}}>Sign in or register</button></>:<form onSubmit={submit}>
        <label>Project name<input style={field} required maxLength={120} value={title} onChange={e=>setTitle(e.target.value)}/></label>
        <label>Project URL (optional)<input style={field} type="url" maxLength={1000} value={url} onChange={e=>setUrl(e.target.value)}/></label>
        <label>Proposed budget and currency (optional)<input style={field} maxLength={100} placeholder="e.g. ₦25,000 or request a quote" value={budget} onChange={e=>setBudget(e.target.value)}/></label>
        <label>Campaign brief<textarea style={field} rows={5} required minLength={20} maxLength={3000} value={brief} onChange={e=>setBrief(e.target.value)} placeholder="Audience, deliverables, timing and project goals"/></label>
        <button style={{...button,opacity:sending ? 0.6 : 1}} disabled={sending} type="submit">{sending?'Submitting…':'Submit campaign request'}</button>
        {status&&<p role="status" style={{color:'var(--ink)',lineHeight:1.6}}>{status}</p>}
      </form>}
    </div>
    <button style={{...button,marginTop:20,background:'var(--surface-card)',color:'var(--ink)',border:'1px solid var(--line)'}} onClick={()=>navigate(user?.role==='creator'?'creator-dashboard':'landing')}>Back</button>
  </main>;
}
export function EarningMarketplace({navigate}) {
  const [category,setCategory]=useState('all');
  const categories=[{id:'all',label:'All'}, {id:'surveys',label:'Offerwalls & Surveys'},...services];
  const items=category==='all'?services:services.filter(s=>s.id===category);
  return <main style={wrapper}>
    <h1 style={{fontSize:30,marginBottom:8}}>Task Network</h1>
    <p style={{color:'var(--slate)',lineHeight:1.6}}>Discover different earning opportunities. We only publish tasks after their funding and verification have been confirmed.</p>
    <div style={{...card,margin:'24px 0',background:'var(--surface-card)'}}><h2 style={{fontSize:23,marginTop:0}}>Offerwalls & Surveys</h2><p style={{color:'var(--slate)'}}>Explore our partner-funded earning section.</p><button style={button} onClick={()=>navigate('offerwalls')}>Explore offerwalls</button></div>
    <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:20}}>{categories.map(s=><button key={s.id} onClick={()=>setCategory(s.id)} style={{...button,background:category===s.id?'var(--lime)':'var(--surface-card)',color:category===s.id?'#111':'var(--ink)',border:'1px solid var(--line)'}}>{s.label}</button>)}</div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:16}}>{items.map(s=><article key={s.id} style={card}><div style={{fontSize:25}}>{s.icon}</div><h2 style={{fontSize:18}}>{s.task}</h2><p style={{color:'var(--slate)',lineHeight:1.6}}>{s.desc}</p><span style={{fontSize:13,color:'var(--slate)'}}>Awaiting funded campaigns</span></article>)}</div>
    {category==='surveys'&&<p style={{color:'var(--slate)'}}>Select Explore offerwalls above to see partner availability.</p>}
    <p style={{color:'var(--slate)',marginTop:24}}>Previously recorded earnings and task history are retained. Older unverified earning routes remain paused.</p>
  </main>;
}
