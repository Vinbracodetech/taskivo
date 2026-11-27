import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {supabase} from '../lib/supabase';
const PAGE=30;
const button={border:'1px solid var(--line)',borderRadius:10,background:'var(--surface)',color:'var(--ink)',padding:'10px 14px',fontWeight:700,cursor:'pointer'};
const primary={...button,background:'var(--lime)',color:'#111',borderColor:'var(--lime)'};
export default function NotificationBell({user,onCount}){
 const [data,setData]=useState(null),[open,setOpen]=useState(false),[popup,setPopup]=useState(null),[error,setError]=useState(''),[busy,setBusy]=useState(false),[limit,setLimit]=useState(PAGE);
 const seen=useRef(new Set()),alive=useRef(false),inFlight=useRef(false),dialog=useRef(null),bell=useRef(null),last=useRef(null),openRef=useRef(false),popupRef=useRef(false),nextCheck=useRef(0);
 const unread=Number(data?.unread||0);
 async function load(n=limit,auto=true){
  if(!alive.current||inFlight.current)return;
  inFlight.current=true;
  try{
   const {data:result,error}=await supabase.rpc('inbox_summary',{p_limit:n,p_offset:0});
   if(error||!result)throw error||Error('Inbox unavailable');
   if(!alive.current)return;
   setData(result);onCount(Number(result.unread||0));setError('');
   if(auto&&user.role!=='admin'&&!document.hidden&&!openRef.current&&!popupRef.current&&Date.now()>=nextCheck.current&&/^\/(user-dashboard|creator-dashboard)\/?$/.test(window.location.pathname)){
    const candidates=(result.messages||[]).filter(m=>!m.read_at&&!seen.current.has(m.id));
    if(candidates.length){
     nextCheck.current=Date.now()+300000;
     const {data:id,error:claimError}=await supabase.rpc('claim_announcement_impression',{p_ids:candidates.map(m=>m.id)});
     const newest=!claimError&&candidates.find(m=>m.id===id);
     if(newest&&alive.current){
      seen.current.add(id);nextCheck.current=Date.now()+86400000;
      if(!openRef.current&&!document.hidden&&/^\/(user-dashboard|creator-dashboard)\/?$/.test(window.location.pathname))setPopup(newest);
     }
    }
   }
  }catch{if(alive.current)setError('Could not refresh messages. Please try again.');}
  finally{inFlight.current=false;}
 }
 useEffect(()=>{
  alive.current=true;
  function refresh(){if(!document.hidden)load(limit);}
  function showInbox(){openRef.current=true;setPopup(null);setOpen(true);load(limit,false);}
  refresh();
  const t=setInterval(refresh,45000);
  window.addEventListener('focus',refresh);document.addEventListener('visibilitychange',refresh);
  window.addEventListener('taskivo_open_inbox',showInbox);window.addEventListener('taskivo_inbox_refresh',refresh);
  return()=>{alive.current=false;clearInterval(t);window.removeEventListener('focus',refresh);document.removeEventListener('visibilitychange',refresh);window.removeEventListener('taskivo_open_inbox',showInbox);window.removeEventListener('taskivo_inbox_refresh',refresh);};
 },[user.id,limit]);
 const visible=open;
 function close(){setPopup(null);setOpen(false);(last.current||bell.current)?.focus();}
 useEffect(()=>{openRef.current=open;},[open]);
 useEffect(()=>{popupRef.current=!!popup;if(!popup)return;const t=setTimeout(()=>setPopup(null),8000);return()=>clearTimeout(t);},[popup]);
 useEffect(()=>{if(!visible)return;last.current=document.activeElement;dialog.current?.focus();function key(e){if(e.key==='Escape'){e.preventDefault();close();}if(e.key==='Tab'){const focusable=Array.from(dialog.current?.querySelectorAll('button:not(:disabled),a[href]')||[]);if(!focusable.length){e.preventDefault();return;}if(e.shiftKey&&(document.activeElement===focusable[0]||document.activeElement===dialog.current)){e.preventDefault();focusable.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===focusable.at(-1)){e.preventDefault();focusable[0].focus();}}}document.addEventListener('keydown',key);return()=>document.removeEventListener('keydown',key);},[visible]);
 async function read(id){
  if(busy)return;
  setBusy(true);
  try{
   const {error}=await supabase.from('user_message_reads').insert({message_id:id});
   if(error&&error.code!=='23505')throw error;
   if(!alive.current)return;
   seen.current.add(id);
   setData(prev=>prev?{...prev,unread:Math.max(0,prev.unread-(prev.messages.some(m=>m.id===id&&!m.read_at)?1:0)),messages:prev.messages.map(m=>m.id===id?{...m,read_at:m.read_at||new Date().toISOString()}:m)}:prev);
   if(popup?.id===id)setPopup(null);
   await load(limit,false);
  }catch{if(alive.current)setError('Unable to mark this message as read. Please retry.');}finally{if(alive.current)setBusy(false);}
 }
 function show(){openRef.current=true;setPopup(null);setOpen(true);load(limit,false);}
 function message(m,full=false){return <article key={m.id} style={{border:'1px solid '+(!m.read_at?'var(--lime)':'var(--line)'),borderRadius:12,padding:16,background:'var(--surface)',marginBottom:12,overflowWrap:'anywhere'}}><div style={{display:'flex',justifyContent:'space-between',gap:8,flexWrap:'wrap',fontSize:11,fontWeight:800,color:'var(--slate)'}}><span>{m.read_at?'READ':'NEW · TASKIVO ADMINISTRATION'}</span><time>{new Date(m.created_at).toLocaleDateString()}</time></div><h3 style={{fontSize:17,margin:'10px 0',color:'var(--ink)'}}>{m.title}</h3><p style={{whiteSpace:'pre-wrap',fontSize:14,lineHeight:1.75,margin:'0 0 12px',color:'var(--ink)'}}>{m.message}</p>{m.title==='Support ticket update'&&<a href="/support" style={{display:'block',margin:'0 0 12px',color:'var(--ink)',fontWeight:700}}>Open Help &amp; Support →</a>}{!m.read_at&&<button disabled={busy} style={primary} onClick={()=>read(m.id)}>Mark as read</button>}</article>}
 return <><button ref={bell} type="button" aria-label={data?('Inbox and alerts, '+unread+' unread messages'):'Inbox and alerts'} onClick={show} style={{position:'relative',background:'var(--surface-card)',color:'var(--ink)',border:'1px solid var(--line)',borderRadius:12,width:42,height:42,flexShrink:0,display:'grid',placeItems:'center',cursor:'pointer'}}><svg aria-hidden="true" width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg>{unread>0&&<span style={{position:'absolute',top:-5,right:-5,background:'#dc2626',color:'#fff',minWidth:19,height:19,padding:'0 4px',borderRadius:20,fontSize:10,fontWeight:800,display:'grid',placeItems:'center',border:'1px solid var(--surface)'}}>{unread>99?'99+':unread}</span>}</button>
 {popup&&!open&&createPortal(<aside role="status" aria-live="polite" style={{position:'fixed',top:76,right:12,width:'min(360px, calc(100vw - 24px))',zIndex:1000,background:'var(--surface-card)',color:'var(--ink)',border:'1px solid var(--line)',borderRadius:14,padding:14,boxShadow:'0 8px 24px rgba(0,0,0,.15)'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:10}}><strong style={{fontSize:12,color:'var(--slate)'}}>TASKIVO · NEW MESSAGE</strong><button aria-label="Dismiss notification" onClick={()=>setPopup(null)} style={{...button,padding:'3px 9px',fontSize:18}}>×</button></div><div style={{fontSize:14,fontWeight:700,margin:'8px 0',overflowWrap:'anywhere'}}>{popup.title}</div><button style={{...button,padding:'7px 10px',fontSize:12}} onClick={show}>View inbox</button></aside>,document.body)}
 {visible&&createPortal(<div style={{position:'fixed',inset:0,zIndex:1000001,background:'rgba(0,0,0,.68)',padding:16,display:'flex',alignItems:'center',justifyContent:'center'}}><section ref={dialog} tabIndex={-1} role="dialog" aria-modal="true" aria-label={popup?'New administrator message':'Inbox and alerts'} style={{width:'100%',maxWidth:580,maxHeight:'min(88dvh,720px)',overflow:'auto',background:'var(--surface-card)',border:'1px solid var(--line)',borderRadius:18,padding:'clamp(16px,4vw,26px)',color:'var(--ink)',boxShadow:'0 16px 48px rgba(0,0,0,.4)'}}><div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,marginBottom:16}}><div><div style={{fontSize:11,color:'var(--slate)',fontWeight:800,letterSpacing:1}}>TASKIVO INBOX</div><h2 style={{fontSize:22,margin:'4px 0'}}>{popup?'New message from administration':'Inbox & Alerts'}</h2><p style={{fontSize:13,color:'var(--slate)',margin:0}}>{data?unread+' unread · '+data.total+' messages':'Checking messages…'}</p></div><button aria-label="Close inbox" onClick={close} style={{...button,padding:'7px 12px',fontSize:20}}>×</button></div>{popup?<>{message(popup,true)}<div style={{display:'flex',gap:10,flexWrap:'wrap'}}><button style={button} onClick={show}>View full inbox</button><button style={button} onClick={close}>Read later</button></div></>:<>{data?.messages?.map(m=>message(m))}{data?.total===0&&<p>No messages yet.</p>}{data&&data.total>data.messages.length&&limit<100&&<button style={button} onClick={()=>setLimit(Math.min(100,limit+PAGE))}>Show more messages</button>}{data&&data.total>100&&limit===100&&<p style={{fontSize:12,color:'var(--slate)'}}>Showing the latest 100 messages, unread first.</p>}</>}{error&&<p role="alert" style={{fontSize:13}}>{error} <button style={button} onClick={()=>load(limit,false)}>Retry</button></p>}</section></div>,document.body)}</>;
}
