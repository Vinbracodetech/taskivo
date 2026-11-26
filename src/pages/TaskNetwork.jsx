import {useEffect,useState,useRef} from 'react';
import {supabase} from '../lib/supabase';
import {safeArticleHtml} from '../lib/safeArticleHtml.js';
const legacyStyles = {
    pageWrapper: {
      minHeight: '100vh',
      backgroundColor: 'var(--surface)',
      backgroundImage: `
        radial-gradient(circle at top center, rgba(168,255,62,0.20) 0%, transparent 70%),
        url("data:image/svg+xml,%3Csvg width='80' height='138.6' viewBox='0 0 80 138.6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 138.6L0 115.5V69.3l40-23.1 40 23.1v46.2zM40 46.2L0 23.1V-23.1l40-23.1 40 23.1v46.2z' fill='none' stroke='%23A8FF3E' stroke-width='2' stroke-opacity='0.15'/%3E%3C/svg%3E")
      `,
      backgroundSize: '100%, 80px 138.6px',
      backgroundAttachment: 'fixed',
    },
    page: { padding: '40px 5%', maxWidth: 1040, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", position: 'relative' },
    headerWrap: { marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 },
    
    quotaPanel: { background: 'var(--surface-card)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24, padding: 24, display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 32, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' },
    quotaItem: { flex: '1 1 120px', display: 'flex', flexDirection: 'column', gap: 8 },
    
    tabContainer: { display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16, marginBottom: 24, scrollbarWidth: 'none' },
    tabBtn: (isActive) => ({
      background: isActive ? 'var(--lime)' : 'var(--surface-card)',
      color: isActive ? '#000' : 'var(--slate)',
      border: isActive ? '1px solid var(--lime)' : '1px solid rgba(255,255,255,0.1)',
      padding: '10px 20px',
      borderRadius: 100,
      fontSize: 13,
      fontWeight: 800,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      fontFamily: "'Inter', sans-serif",
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      transition: 'all 0.2s'
    }),

    taskCard: (isPremium, isInternalStyle) => ({ 
      background: 'var(--surface-card)', 
      border: '1px solid rgba(255,255,255,0.03)', 
      borderLeft: `4px solid ${isPremium ? '#D4AF37' : isInternalStyle ? '#A8FF3E' : 'rgba(255,255,255,0.1)'}`,
      borderRadius: 16, 
      padding: '24px', 
      display: 'flex', 
      flexDirection: 'column', 
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)', 
      position: 'relative', 
      overflow: 'hidden',
      backdropFilter: 'blur(10px)',
      transition: 'transform 0.2s, box-shadow 0.2s'
    }),
    
    btnActive: (isPremium, isInternalStyle) => ({ background: isPremium ? 'var(--gold)' : isInternalStyle ? 'var(--lime-dim)' : 'var(--lime)', color: (isInternalStyle && !isPremium) ? 'var(--lime)' : '#000', border: isInternalStyle ? '1px solid var(--lime)' : 'none', padding: '10px 24px', borderRadius: 100, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px' }),
    btnLocked: { background: 'var(--surface)', color: 'var(--slate)', border: '1px solid var(--line)', padding: '10px 24px', borderRadius: 100, fontSize: 12, fontWeight: 700, cursor: 'not-allowed', fontFamily: "'Inter', sans-serif" },
    
    payoutOverlay: { position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    payoutCard: { background: 'var(--surface-card)', border: '1px solid var(--lime)', borderRadius: 24, padding: 40, width: '100%', maxWidth: 460, boxShadow: '0 16px 48px rgba(168,255,62,0.05)', textAlign: 'center', backdropFilter: 'blur(10px)' },
    input: { width: '100%', padding: '16px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, color: 'var(--ink)', fontSize: 15, marginBottom: 20, outline: 'none', boxSizing: 'border-box' },
    label: { fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--slate)', marginBottom: 8, display: 'block', textAlign: 'left', fontFamily: "'Inter', sans-serif" },
    errorBox: { background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, marginBottom: 24 },
    
    toast: { position: 'fixed', bottom: 30, right: 30, background: 'var(--lime)', color: '#000', padding: '16px 24px', borderRadius: 100, fontSize: 14, fontWeight: 800, fontFamily: "'Inter', sans-serif", boxShadow: '0 16px 32px rgba(168,255,62,0.3)', zIndex: 9999, display: 'flex', alignItems: 'center', gap: 12, animation: 'slideUp 0.3s ease-out' }
  };

const shell={padding:'32px 5% 100px',maxWidth:1080,margin:'auto',color:'var(--ink)'};
const card={background:'var(--surface-card)',border:'1px solid var(--line)',borderRadius:14,padding:20};
const grid={display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,280px),1fr))',gap:16};
const btn={border:0,borderRadius:9,padding:'12px 16px',fontWeight:800,color:'#111',background:'var(--lime)',cursor:'pointer'};
const field={display:'block',width:'100%',padding:12,margin:'8px 0 14px',background:'var(--surface)',color:'var(--ink)',border:'1px solid var(--line)',borderRadius:8};
const muted={color:'var(--slate)',lineHeight:1.65};
function cleanReadingHtml(value){const d=new DOMParser().parseFromString(safeArticleHtml(value),'text/html');d.querySelectorAll('img,iframe,video,audio,source,script,style,object,embed,form,svg,link,meta').forEach(el=>el.remove());d.querySelectorAll('a').forEach(el=>el.replaceWith(...el.childNodes));d.querySelectorAll('*').forEach(el=>Array.from(el.attributes).forEach(a=>el.removeAttribute(a.name)));return d.body.innerHTML;}
function Reader({post,user,onBack,onDone}){
 const [body,setBody]=useState(null),[remaining,setRemaining]=useState(120),[ready,setReady]=useState(false),[status,setStatus]=useState(''),[saving,setSaving]=useState(false),[completed,setCompleted]=useState(false);
 const active=useRef(false);
 useEffect(()=>{let live=true;async function start(){try{const {data,error}=await supabase.from('posts').select('content').eq('slug',post.slug).eq('status','published').single();if(error)throw error;const html=cleanReadingHtml(data.content);const {error:err}=await supabase.from('reading_task_starts').insert({post_slug:post.slug});if(err&&err.code!=='23505')throw err;if(live){setBody(html);setReady(true);}}catch{if(live)setStatus('Unable to start reading. Return to the task list and try again.');}}start();return()=>{live=false;};},[post.slug,user.id]);
 useEffect(()=>{if(!ready||completed)return;const t=setInterval(()=>{if(!document.hidden&&document.hasFocus())setRemaining(v=>Math.max(0,v-1));},1000);return()=>clearInterval(t);},[ready,completed]);
 useEffect(()=>{if(!ready||remaining!==0||active.current||completed)return;claim();},[ready,remaining,completed]);
 async function claim(){if(active.current||remaining!==0||completed)return;active.current=true;setSaving(true);setStatus('');try{const {error}=await supabase.from('reading_task_completions').insert({post_slug:post.slug});if(error&&error.code!=='23505')throw error;setCompleted(true);setStatus('Reading completed! +3 PTS added to your wallet points.');window.dispatchEvent(new Event('taskivo_reading_balance_updated'));onDone();}catch{setStatus('Unable to record completion. Please retry.');}finally{setSaving(false);active.current=false;}}
 return <div><button style={{...btn,marginBottom:16}} onClick={onBack}>← Back to tasks</button><div style={{...card,position:'sticky',top:74,zIndex:5,marginBottom:18}}><div style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'center',flexWrap:'wrap'}}><strong>{completed?'✓ Reading completed':ready?'Reading task':'Preparing reading task'}</strong><strong style={{fontSize:22}}>{completed?'+3 PTS':Math.floor(remaining/60)+':'+String(remaining%60).padStart(2,'0')}</strong></div><div style={{height:6,borderRadius:4,background:'var(--line)',overflow:'hidden',margin:'10px 0'}}><div style={{height:'100%',width:((120-remaining)/120*100)+'%',background:'var(--lime)'}}/></div><p style={{...muted,fontSize:13}}>Read in this tab for two minutes. The countdown pauses when the tab is hidden or loses focus. Complete each article once to add 3 PTS to your wallet points. See the wallet for redemption availability.</p>{saving&&<p>Recording completion…</p>}{status&&<p role="status">{status}</p>}{remaining===0&&!completed&&!saving&&<button style={btn} onClick={claim}>Retry completion</button>}</div><article style={{...card,lineHeight:1.85}}><style>{'.reading-prose h2,.reading-prose h3{margin:26px 0 12px}.reading-prose p,.reading-prose ul,.reading-prose ol,.reading-prose blockquote{margin:14px 0}.reading-prose ul,.reading-prose ol{padding-left:25px}.reading-prose table{display:block;max-width:100%;overflow:auto}.reading-prose{overflow-wrap:anywhere}'}</style><h1 style={{fontSize:'clamp(24px,4vw,35px)',lineHeight:1.25,marginBottom:22}}>{post.title}</h1>{body!==null?<div className="reading-prose" dangerouslySetInnerHTML={{__html:body}}/>:<p>{status||'Loading article…'}</p>}</article></div>;
}
export function EarningMarketplace({navigate,user}){
 const [tab,setTab]=useState('all'),[posts,setPosts]=useState([]),[done,setDone]=useState([]),[official,setOfficial]=useState([]),[submissions,setSubmissions]=useState([]),[reader,setReader]=useState(null),[answers,setAnswers]=useState({}),[busy,setBusy]=useState(false),[loading,setLoading]=useState(true),[error,setError]=useState('');
 async function load(){setError('');try{const result=await Promise.all([supabase.from('posts').select('slug,title,meta_desc,created_at').eq('status','published').order('created_at',{ascending:false}),supabase.from('reading_task_completions').select('post_slug,points').eq('user_id',user.id),supabase.from('official_tasks').select('id,title,instructions,status').eq('status','active').order('created_at',{ascending:false}),supabase.from('official_task_submissions').select('task_id,status').eq('user_id',user.id)]);if(result.some(x=>x.error))throw Error('load');setPosts(result[0].data||[]);setDone(result[1].data||[]);setOfficial(result[2].data||[]);setSubmissions(result[3].data||[]);}catch{setError('Some tasks could not be loaded. Retry below.');}finally{setLoading(false);}}
 useEffect(()=>{if(user?.id)load();},[user?.id]);
 async function submit(id){if(busy||!answers[id]||answers[id].trim().length<20)return;setBusy(true);setError('');try{const {error}=await supabase.from('official_task_submissions').insert({task_id:id,response:answers[id].trim()});if(error&&error.code!=='23505')throw error;await load();}catch{setError('Submission could not be saved. Please try again.');}finally{setBusy(false);}}
 const S=legacyStyles;
 const [shown,setShown]=useState(12);
 const pending=done.reduce((n,r)=>n+Number(r.points||0),0);
 const readTotal=posts.length,readCount=posts.filter(p=>done.some(d=>d.post_slug===p.slug)).length;
 const adminCount=official.filter(t=>submissions.some(s=>s.task_id===t.id&&s.status==='approved')).length;
 const switchTab=id=>{setTab(id);setShown(12);};
 if(reader)return <div style={S.pageWrapper}><main style={S.page}><Reader key={reader.slug} post={reader} user={user} onBack={()=>{setReader(null);load();}} onDone={load}/></main></div>;
 const visiblePosts=(tab==='all'||tab==='reading')?posts:[];
 const visibleAdmin=(tab==='all'||tab==='official')?official:[];
 const entries=[...visiblePosts.map(p=>({kind:'reading',id:p.slug,value:p})),...visibleAdmin.map(t=>({kind:'official',id:t.id,value:t}))];
 return <div style={S.pageWrapper}><main style={{...S.page,paddingBottom:100}}>
 <div style={S.headerWrap}><div><h1 style={{fontSize:'clamp(28px,5vw,36px)',fontWeight:800,letterSpacing:'-1px',margin:'0 0 8px'}}>Task <span style={{color:'var(--lime)'}}>Network</span></h1><p style={{color:'var(--slate)',margin:0,fontSize:15}}>Discover surveys, internal intel and official tasks.</p></div><button onClick={()=>navigate('user-dashboard')} style={S.tabBtn(false)}>My Hub →</button></div>
 <div style={{background:'var(--surface-card)',border:'1px solid var(--lime)',borderRadius:24,padding:'clamp(20px,4vw,32px)',marginBottom:32,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:20,boxShadow:'0 12px 40px rgba(168,255,62,0.1)',position:'relative',overflow:'hidden'}}>
 <div style={{position:'absolute',top:0,left:0,width:4,height:'100%',background:'var(--lime)'}}/><div><div style={{fontSize:11,color:'var(--lime)',fontWeight:800,textTransform:'uppercase',letterSpacing:1,marginBottom:8}}>💎 Partner rewards · limited pilot</div><h2 style={{fontSize:24,fontWeight:800,margin:'0 0 8px'}}>Offerwalls &amp; Surveys</h2><p style={{...muted,margin:0,fontSize:14}}>Explore eligible surveys and sponsored offers with Offerwall.GG.</p></div><button onClick={()=>navigate('offerwalls')} style={S.btnActive(false,false)}>Open Portal →</button></div>
 <div style={S.quotaPanel}>{[{label:'Internal Intel',value:readCount,total:readTotal,detail:'Articles completed'},{label:'Official Tasks',value:adminCount,total:official.length,detail:'Approved assignments'},{label:'Blog rewards',value:pending,total:null,detail:'Reading points earned'}].map(m=><div key={m.label} style={S.quotaItem}><span style={{fontSize:11,color:'var(--slate)',textTransform:'uppercase',fontWeight:700,letterSpacing:1}}>{m.label}</span><div style={{fontSize:24,fontWeight:800}}>{loading?'—':m.value}{m.total!==null&&<span style={{fontSize:14,color:'var(--slate)',fontWeight:500}}> / {m.total}</span>}</div>{m.total!==null&&<div style={{height:4,background:'var(--surface)',borderRadius:4,overflow:'hidden'}}><div style={{width:(m.total?100*m.value/m.total:0)+'%',height:'100%',background:'var(--lime)',borderRadius:4}}/></div>}<small style={{color:'var(--slate)'}}>{m.detail}</small></div>)}</div>
 <div style={S.tabContainer}>{[['all','All'],['reading','Internal Intel'],['official','Admin Tasks'],['offerwall','Offerwall']].map(([id,label])=><button key={id} onClick={()=>switchTab(id)} style={S.tabBtn(tab===id)}>{label}</button>)}</div>
 {error&&<p role="alert" style={S.errorBox}>{error} <button onClick={load} style={S.btnActive(false,false)}>Retry</button></p>}
 {tab==='offerwall'?<article style={S.taskCard(false,true)}><h3>Offerwall.GG</h3><p style={muted}>Partner-funded surveys and offers. Availability varies by country and eligibility.</p><button onClick={()=>navigate('offerwalls')} style={S.btnActive(false,false)}>Explore offerwall</button></article>:loading?<div style={{...S.quotaPanel,justifyContent:'center'}}>Syncing network…</div>:<><p style={{...muted,fontSize:13,margin:'0 0 20px'}}>Internal Intel rewards: 3 PTS for two minutes of reading, once per article. Points are tracked in your wallet. Cash withdrawals are currently unavailable. Official assignments require administrator review.</p>{entries.length===0?<div style={{...S.quotaPanel,display:'block',textAlign:'center',padding:36}}><h3>No tasks available</h3><p style={muted}>Check back for new assignments.</p></div>:<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,320px),1fr))',gap:20}}>{entries.slice(0,shown).map(({kind,id,value:t})=>{const reading=kind==='reading',finished=reading?done.some(d=>d.post_slug===id):false,sub=reading?null:submissions.find(s=>s.task_id===id);return <article key={kind+id} style={S.taskCard(false,true)}><div style={{display:'flex',alignItems:'flex-start',gap:16,marginBottom:22}}><div style={{width:44,height:44,flexShrink:0,borderRadius:12,background:'var(--lime-dim)',display:'grid',placeItems:'center',fontSize:22}}>{reading?'📄':'📋'}</div><div style={{flex:1,minWidth:0}}><div style={{fontSize:10,fontWeight:800,color:'var(--lime)',textTransform:'uppercase',marginBottom:6,letterSpacing:'.5px'}}>{reading?'Internal Intel':'Official Task'}</div><h3 style={{fontSize:17,lineHeight:1.4,margin:0,overflowWrap:'anywhere'}}>{t.title}</h3></div></div><p style={{...muted,fontSize:14,whiteSpace:reading?'normal':'pre-wrap',overflowWrap:'anywhere',margin:'0 0 18px',flex:1}}>{reading?t.meta_desc:t.instructions}</p>{reading?<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap',borderTop:'1px solid var(--line)',paddingTop:16}}><div><strong style={{fontSize:22,color:'var(--lime)'}}>+3 <small style={{fontSize:12,color:'var(--slate)'}}>PTS</small></strong><div style={{fontSize:12,color:'var(--slate)',marginTop:4}}>2 min · Once per article</div></div>{finished?<button disabled style={S.btnLocked}>✓ Completed</button>:<button style={S.btnActive(false,true)} onClick={()=>setReader(t)}>Start reading</button>}</div>:sub?<strong style={{fontSize:13,textTransform:'capitalize'}}>Submission: {sub.status}</strong>:<><label style={{fontSize:13,fontWeight:700}}>Response<textarea style={field} maxLength={3000} rows={4} value={answers[id]||''} onChange={e=>setAnswers(v=>({...v,[id]:e.target.value}))}/></label><button style={busy||(answers[id]||'').trim().length<20?S.btnLocked:S.btnActive(false,true)} disabled={busy||(answers[id]||'').trim().length<20} onClick={()=>submit(id)}>Submit for review</button></>}</article>})}</div>}{entries.length>shown&&<div style={{textAlign:'center',marginTop:24}}><button style={S.tabBtn(false)} onClick={()=>setShown(v=>v+12)}>Load more tasks</button></div>}</>}
 </main></div>;
}

export function OfficialTaskAdmin(){
 const [tasks,setTasks]=useState([]),[subs,setSubs]=useState([]),[title,setTitle]=useState(''),[instructions,setInstructions]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 async function load(){const [t,s]=await Promise.all([supabase.from('official_tasks').select('*').order('created_at',{ascending:false}),supabase.from('official_task_submissions').select('id,task_id,response,status,created_at').order('created_at',{ascending:false})]);if(t.error||s.error){setMessage('Unable to load admin tasks.');return;}setTasks(t.data||[]);setSubs(s.data||[]);}
 useEffect(()=>{load();},[]);
 async function publish(e){e.preventDefault();if(busy)return;setBusy(true);try{const {error}=await supabase.from('official_tasks').insert({title:title.trim(),instructions:instructions.trim()});if(error)throw error;setTitle('');setInstructions('');setMessage('Task published.');await load();}catch{setMessage('Unable to publish. Confirm administrator access.');}finally{setBusy(false);}}
 async function change(table,id,status){setBusy(true);try{const {data,error}=await supabase.from(table).update({status}).eq('id',id).select('id');if(error||!data?.length)throw Error('update');setMessage('Status updated.');await load();}catch{setMessage('Unable to update status.');}finally{setBusy(false);}}
 return <main style={shell}><h1>Admin task publisher</h1><p style={{...muted,margin:'12px 0'}}>Publish genuine written assignments, usability feedback or educational tasks. Do not ask users to interact with ads, manipulate public engagement or share credentials. Cash payouts remain disabled. Legacy campaign records are preserved separately.</p><form style={card} onSubmit={publish}><label>Task title<input style={field} value={title} minLength={4} maxLength={150} required onChange={e=>setTitle(e.target.value)}/></label><label>Instructions<textarea style={field} rows={5} minLength={20} maxLength={3000} required value={instructions} onChange={e=>setInstructions(e.target.value)}/></label><button style={btn} disabled={busy}>Publish task</button></form>{message&&<p role="status" style={{margin:'16px 0'}}>{message}</p>}<h2 style={{margin:'24px 0 12px'}}>Published tasks</h2><div style={grid}>{tasks.map(t=><article style={card} key={t.id}><h3>{t.title}</h3><p style={{...muted,whiteSpace:'pre-wrap',margin:'12px 0'}}>{t.instructions}</p><p>Status: {t.status}</p><button style={{...btn,marginTop:12}} disabled={busy} onClick={()=>change('official_tasks',t.id,t.status==='active'?'paused':'active')}>{t.status==='active'?'Pause':'Publish again'}</button></article>)}</div><h2 style={{margin:'24px 0 12px'}}>Submissions for review</h2>{subs.map(s=><article style={{...card,marginBottom:12}} key={s.id}><strong>{tasks.find(t=>t.id===s.task_id)?.title||'Task'}</strong><p style={{...muted,whiteSpace:'pre-wrap',margin:'10px 0'}}>{s.response}</p><p>{s.status}</p>{s.status==='pending'&&<div style={{display:'flex',gap:10,marginTop:10}}><button style={btn} disabled={busy} onClick={()=>change('official_task_submissions',s.id,'approved')}>Approve</button><button style={btn} disabled={busy} onClick={()=>change('official_task_submissions',s.id,'rejected')}>Reject</button></div>}</article>)}</main>;
}
