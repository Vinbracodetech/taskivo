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
 useEffect(()=>{let live=true;async function start(){try{const {data,error}=await supabase.from('posts').select('content').eq('slug',post.slug).eq('status','published').single();if(error)throw error;const html=cleanReadingHtml(data.content);const {data:q,error:qe}=await supabase.rpc('reading_quota');if(qe)throw qe;if(q.remaining<=0)throw Error('Daily reading limit reached.');const {error:err}=await supabase.from('reading_task_starts').insert({post_slug:post.slug});if(err&&err.code!=='23505')throw err;if(live){setBody(html);setReady(true);}}catch(e){if(live)setStatus(e.message||'Unable to start reading. Return to the task list and try again.');}}start();return()=>{live=false;};},[post.slug,user.id]);
 useEffect(()=>{if(!ready||completed)return;const t=setInterval(()=>{if(!document.hidden&&document.hasFocus())setRemaining(v=>Math.max(0,v-1));},1000);return()=>clearInterval(t);},[ready,completed]);
 useEffect(()=>{if(!ready||remaining!==0||active.current||completed)return;claim();},[ready,remaining,completed]);
 async function claim(){if(active.current||remaining!==0||completed)return;active.current=true;setSaving(true);setStatus('');try{const {error}=await supabase.from('reading_task_completions').insert({post_slug:post.slug});if(error&&error.code!=='23505')throw error;setCompleted(true);setStatus(error?'This article has already been completed.':'Reading completed! +3 PTS added to your wallet points.');window.dispatchEvent(new Event('taskivo_reading_balance_updated'));onDone();}catch(e){setStatus(e.message||'Unable to record completion. Please retry.');onDone();}finally{setSaving(false);active.current=false;}}
 return <div><button style={{...btn,marginBottom:16}} onClick={onBack}>← Back to tasks</button><div style={{...card,position:'sticky',top:74,zIndex:5,marginBottom:18}}><div style={{display:'flex',justifyContent:'space-between',gap:12,alignItems:'center',flexWrap:'wrap'}}><strong>{completed?'✓ Reading completed':ready?'Reading task':'Preparing reading task'}</strong><strong style={{fontSize:22}}>{completed?'+3 PTS':Math.floor(remaining/60)+':'+String(remaining%60).padStart(2,'0')}</strong></div><div style={{height:6,borderRadius:4,background:'var(--line)',overflow:'hidden',margin:'10px 0'}}><div style={{height:'100%',width:((120-remaining)/120*100)+'%',background:'var(--lime)'}}/></div><p style={{...muted,fontSize:13}}>Read in this tab for two minutes. The countdown pauses when the tab is hidden or loses focus. Complete each article once to add 3 PTS to your wallet points. See the wallet for redemption availability.</p>{saving&&<p>Recording completion…</p>}{status&&<p role="status">{status}</p>}{remaining===0&&!completed&&!saving&&<button style={btn} onClick={claim}>Retry completion</button>}</div><article style={{...card,lineHeight:1.85}}><style>{'.reading-prose h2,.reading-prose h3{margin:26px 0 12px}.reading-prose p,.reading-prose ul,.reading-prose ol,.reading-prose blockquote{margin:14px 0}.reading-prose ul,.reading-prose ol{padding-left:25px}.reading-prose table{display:block;max-width:100%;overflow:auto}.reading-prose{overflow-wrap:anywhere}'}</style><h1 style={{fontSize:'clamp(24px,4vw,35px)',lineHeight:1.25,marginBottom:22}}>{post.title}</h1>{body!==null?<div className="reading-prose" dangerouslySetInnerHTML={{__html:body}}/>:<p>{status||'Loading article…'}</p>}</article></div>;
}

const categoryNames={custom:'Custom assignment',content_quality:'SEO · Content Quality',website_testing:'Website testing',app_testing:'App testing',questionnaire:'Questionnaire'};
async function taskAction(id,action,response=null,code=null){
 const {data,error}=await supabase.rpc('official_task_action',{p_task:id,p_action:action,p_response:response,p_code:code});if(error)throw error;return data;
}
function Assignment({task,onBack,onDone}){
 const [remaining,setRemaining]=useState(task.duration_seconds),[ready,setReady]=useState(false),[body,setBody]=useState(null),[response,setResponse]=useState(''),[code,setCode]=useState(''),[inputCode,setInputCode]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false),[submitted,setSubmitted]=useState(false);
 const lock=useRef(false),quality=task.category==='content_quality';
 useEffect(()=>{let live=true;async function start(){try{if(quality){const {data,error}=await supabase.from('posts').select('title,content').eq('slug',task.article_slug).eq('status','published').single();if(error)throw error;if(live)setBody(data);}await taskAction(task.id,'start');if(live)setReady(true);}catch(e){if(live)setError(e.message||'Task unavailable');}}start();return()=>{live=false;};},[task.id]);
 useEffect(()=>{if(!ready||submitted)return;const t=setInterval(()=>{if(!document.hidden&&document.hasFocus())setRemaining(n=>Math.max(0,n-1));},1000);return()=>clearInterval(t);},[ready,submitted]);
 async function reveal(){if(lock.current||remaining>0||!ready)return;lock.current=true;setBusy(true);setError('');try{const d=await taskAction(task.id,'code');setCode(d.code);}catch(e){setError(e.message||'Unable to verify');}finally{lock.current=false;setBusy(false);}}
 async function submit(){if(lock.current||!ready||remaining>0||response.trim().length<20||(quality&&(!code||inputCode.trim().toUpperCase()!==code)))return;lock.current=true;setBusy(true);setError('');try{await taskAction(task.id,'submit',response.trim(),quality?inputCode.trim().toUpperCase():null);setSubmitted(true);onDone();}catch(e){setError(e.message||'Unable to submit');}finally{lock.current=false;setBusy(false);}}
 return <main style={shell}><button style={btn} onClick={onBack}>← Back to tasks</button><section style={{...card,marginTop:16}}><small style={{color:'var(--lime)',fontWeight:800}}>{categoryNames[task.category]}</small><h1>{task.title}</h1><p style={{...muted,whiteSpace:'pre-wrap'}}>{task.instructions}</p><strong>+{task.reward_points} PTS upon approval</strong><p style={muted}>{ready?'Time remaining: '+Math.floor(remaining/60)+':'+String(remaining%60).padStart(2,'0'):'Preparing task…'}</p>{quality&&<p style={muted}>Read and evaluate the article here. Do not generate search clicks, ad interactions or artificial engagement.</p>}</section>
 {body&&<article style={{...card,marginTop:16,lineHeight:1.8,overflowWrap:'anywhere'}}><h2>{body.title}</h2><div dangerouslySetInnerHTML={{__html:cleanReadingHtml(body.content)}}/></article>}
 <section style={{...card,marginTop:16}}>{submitted?<strong style={{color:'var(--lime)'}}>✓ Submitted for review. Track the result in Activity Ledger.</strong>:<>{quality&&<><h3>Verification</h3>{code?<><p>Your personal verification code: <strong style={{color:'var(--lime)',letterSpacing:2}}>{code}</strong></p><label>Enter your code<input style={field} value={inputCode} onChange={e=>setInputCode(e.target.value)} maxLength={8}/></label></>:<button disabled={!ready||remaining>0||busy} style={!ready||remaining>0||busy?legacyStyles.btnLocked:btn} onClick={reveal}>{remaining>0?'Code unlocks after timer':'Reveal verification code'}</button>}</>}
 <label style={{display:'block',marginTop:16}}>Your feedback or task response<textarea style={field} rows={5} value={response} maxLength={3000} onChange={e=>setResponse(e.target.value)} placeholder="Describe your findings or answer the assignment."/></label><button style={btn} disabled={!ready||remaining>0||busy||response.trim().length<20||(quality&&(!code||inputCode.trim().toUpperCase()!==code))} onClick={submit}>{busy?'Working…':'Submit for approval'}</button></>}{error&&<p role="alert" style={{color:'var(--slate)'}}>{error}</p>}</section></main>;
}
export function EarningMarketplace({navigate,user}){
 const [tab,setTab]=useState('all'),[posts,setPosts]=useState([]),[done,setDone]=useState([]),[official,setOfficial]=useState([]),[submissions,setSubmissions]=useState([]),[reader,setReader]=useState(null),[assignment,setAssignment]=useState(null),[quota,setQuota]=useState(null),[loading,setLoading]=useState(true),[error,setError]=useState(''),[shown,setShown]=useState(12);
 async function refreshQuota(){const {data,error}=await supabase.rpc('reading_quota');if(!error)setQuota(data);}
 async function load(){setError('');try{const result=await Promise.all([supabase.from('posts').select('slug,title,meta_desc,created_at').eq('status','published').order('created_at',{ascending:false}),supabase.from('reading_task_completions').select('post_slug,points').eq('user_id',user.id),supabase.from('official_tasks').select('*').eq('status','active').order('created_at',{ascending:false}),supabase.from('official_task_submissions').select('task_id,status,reward_points').eq('user_id',user.id),supabase.rpc('reading_quota')]);if(result.some(x=>x.error))throw result.find(x=>x.error).error;setPosts(result[0].data||[]);setDone(result[1].data||[]);setOfficial(result[2].data||[]);setSubmissions(result[3].data||[]);setQuota(result[4].data);}catch(e){setError(e.message||'Unable to load tasks');}finally{setLoading(false);}}
 useEffect(()=>{if(!user?.id)return;load();const timer=setInterval(refreshQuota,60000);window.addEventListener('focus',refreshQuota);return()=>{clearInterval(timer);window.removeEventListener('focus',refreshQuota);};},[user?.id]);
 const S=legacyStyles;
 if(reader)return <div style={S.pageWrapper}><main style={S.page}><Reader key={reader.slug} post={reader} user={user} onBack={()=>{setReader(null);load();}} onDone={load}/></main></div>;
 if(assignment)return <Assignment key={assignment.id} task={assignment} onBack={()=>{setAssignment(null);load();}} onDone={load}/>;
 const now=Date.now(),available=official.filter(t=>Date.parse(t.starts_at)<=now&&(!t.expires_at||Date.parse(t.expires_at)>now));
 const entries=[...((tab==='all'||tab==='quality'||tab==='official')?available.filter(t=>tab==='all'||(tab==='quality'?t.category==='content_quality':t.category!=='content_quality')).map(t=>({kind:'official',id:t.id,value:t})):[]),...((tab==='all'||tab==='reading')?posts.map(p=>({kind:'reading',id:p.slug,value:p})):[])];
 const used=Math.min(5,Number(quota?.used||0)),left=quota?.remaining;
 return <div style={{...S.pageWrapper,backgroundAttachment:'scroll'}}><main style={{...S.page,paddingBottom:112}}>
 <div style={S.headerWrap}><div><h1 style={{fontSize:'clamp(26px,5vw,36px)',fontWeight:800,margin:'0 0 6px'}}>Task Network</h1><p style={{...muted,margin:0,fontSize:14}}>Surveys, reading and official assignments.</p></div></div>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,260px),1fr))',gap:12,marginBottom:20}}>{[['moonetix','Moonetix','Explore eligible sponsored offers and games.'],['offerwall-gg','Offerwall.GG','Explore available surveys and partner offers.']].map(([id,name,desc])=><section key={id} style={{...card,borderColor:'var(--line)'}}><small style={{color:'var(--lime)',fontWeight:800}}>PARTNER REWARDS</small><h2 style={{fontSize:21,margin:'8px 0'}}>{name}</h2><p style={muted}>{desc}</p><button style={btn} onClick={()=>navigate(id)}>Open {name} →</button></section>)}</div>
 <section style={{...card,marginBottom:20}}><div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}><strong>Internal Intel · 24-hour limit</strong><strong style={{color:'var(--lime)'}}>{quota?used+'/5':'—'}</strong></div><div style={{display:'flex',gap:5,margin:'12px 0'}}>{Array.from({length:5},(_,i)=><div key={i} style={{flex:1,height:5,borderRadius:8,background:i<used?'var(--lime)':'var(--line)'}}/>)}</div><small style={muted}>{quota?left+' reading tasks remaining · '+used*3+' PTS earned in the last 24 hours':'Checking allowance…'}</small>{left===0&&quota.next_at&&<p style={{...muted,fontSize:12}}>Next slot: {new Date(quota.next_at).toLocaleString()}</p>}</section>
 <div style={{...S.tabContainer,flexWrap:'wrap',gap:6,overflowX:'visible',paddingBottom:4,marginBottom:20}}>{[['all','All'],['offerwall','Offerwalls'],['reading','Internal Intel'],['quality','Content Quality'],['official','Admin Tasks']].map(([id,label])=><button key={id} onClick={()=>{setTab(id);setShown(12);}} style={{...S.tabBtn(tab===id),padding:'9px 13px',fontSize:11}}>{label}</button>)}</div>
 {error&&<p role="alert" style={S.errorBox}>{error} <button style={btn} onClick={load}>Retry</button></p>}
 {tab==='offerwall'?null:loading?<p>Loading tasks…</p>:entries.length===0?<section style={card}><h3>No tasks available</h3><p style={muted}>Check back for new assignments.</p></section>:<div style={grid}>{entries.slice(0,shown).map(({kind,id,value:t})=>{const reading=kind==='reading',finished=reading&&done.some(d=>d.post_slug===id),submission=!reading&&submissions.find(s=>s.task_id===id),blocked=reading&&(left==null||left<=0);return <article key={kind+id} style={{...S.taskCard(false,true),padding:18,backdropFilter:'none'}}><small style={{color:'var(--lime)',fontWeight:800}}>{reading?'INTERNAL INTEL':categoryNames[t.category]||'Official task'}</small><h3 style={{fontSize:17,lineHeight:1.4,margin:'8px 0'}}>{t.title}</h3><p style={{...muted,fontSize:13,whiteSpace:'pre-wrap',overflowWrap:'anywhere',flex:1}}>{reading?t.meta_desc:t.instructions}</p><div style={{borderTop:'1px solid var(--line)',paddingTop:12,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:10}}><div><strong style={{fontSize:21,color:'var(--lime)'}}>+{reading?3:t.reward_points} PTS</strong><div style={{fontSize:11,color:'var(--slate)'}}>{reading?'2 min · Once per article':Math.ceil(t.duration_seconds/60)+' min · Review required'}</div></div>{finished||submission?<span style={{fontSize:12,fontWeight:700}}>{finished?'✓ Completed':submission.status==='approved'?'✓ Approved':submission.status}</span>:<button style={blocked?S.btnLocked:S.btnActive(false,true)} disabled={blocked} onClick={()=>reading?setReader(t):setAssignment(t)}>{blocked?'Daily limit':reading?'Start reading':'Start task'}</button>}</div></article>})}</div>}
 {tab!=='offerwall'&&entries.length>shown&&<button style={{...btn,marginTop:20}} onClick={()=>setShown(n=>n+12)}>Load more tasks</button>}
 </main></div>;
}
const emptyForm={title:'',instructions:'',category:'custom',reward_points:5,slots:20,duration_seconds:120,article_slug:'',starts_at:'',expires_at:''};
export function OfficialTaskAdmin(){
 const [tasks,setTasks]=useState([]),[subs,setSubs]=useState([]),[posts,setPosts]=useState([]),[form,setForm]=useState(emptyForm),[editing,setEditing]=useState(null),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[filter,setFilter]=useState('pending');
 const change=(k,v)=>setForm(p=>({...p,[k]:v}));
 async function load(){const [t,s,p]=await Promise.all([supabase.from('official_tasks').select('*').order('created_at',{ascending:false}),supabase.from('official_task_submissions').select('*').order('created_at',{ascending:false}),supabase.from('posts').select('slug,title').eq('status','published').order('title')]);if(t.error||s.error||p.error){setMessage('Unable to load publisher');return;}setTasks(t.data||[]);setSubs(s.data||[]);setPosts(p.data||[]);}
 useEffect(()=>{load();},[]);
 async function publish(e){e.preventDefault();if(busy)return;setBusy(true);setMessage('');try{const quality=form.category==='content_quality',payload={title:form.title.trim(),instructions:form.instructions.trim(),category:form.category,reward_points:quality?5:Number(form.reward_points),slots:Number(form.slots),duration_seconds:quality?120:Number(form.duration_seconds),article_slug:quality?form.article_slug:null,starts_at:form.starts_at?new Date(form.starts_at).toISOString():new Date().toISOString(),expires_at:form.expires_at?new Date(form.expires_at).toISOString():null};const q=editing?supabase.from('official_tasks').update(payload).eq('id',editing):supabase.from('official_tasks').insert(payload);const {data,error}=await q.select('id');if(error||!data?.length)throw error||Error('Save failed');setForm(emptyForm);setEditing(null);setMessage('Task saved.');await load();}catch(e){setMessage(e.message||'Unable to save task');}finally{setBusy(false);}}
 async function pause(t){setBusy(true);try{const {data,error}=await supabase.from('official_tasks').update({status:t.status==='active'?'paused':'active'}).eq('id',t.id).select('id');if(error||!data?.length)throw error||Error('Update failed');await load();}catch(e){setMessage(e.message);}finally{setBusy(false);}}
 async function review(s,approve){if(busy)return;setBusy(true);try{const {error}=await supabase.rpc('review_official_task',{p_submission:s.id,p_approve:approve});if(error)throw error;setMessage(approve?'Approved and credited.':'Rejected.');await load();}catch(e){setMessage(e.message);}finally{setBusy(false);}}
 const quality=form.category==='content_quality',budget=(quality?5:Number(form.reward_points||0))*Number(form.slots||0);
 const localDate=s=>{if(!s)return '';const d=new Date(s);return new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16);};
 return <main style={shell}><h1>Task Publisher</h1><p style={muted}>Publish real feedback, education and testing assignments. Set the reward budget before publishing. No paid search clicks, public engagement manipulation or ad interactions.</p>
 <form style={card} onSubmit={publish}><h2>{editing?'Edit task':'Create task'}</h2><label>Title<input style={field} required minLength={4} maxLength={150} value={form.title} onChange={e=>change('title',e.target.value)}/></label><label>Category<select style={field} value={form.category} onChange={e=>change('category',e.target.value)}>{Object.entries(categoryNames).map(([v,t])=><option key={v} value={v}>{t}</option>)}</select></label>{quality&&<label>Article<select required style={field} value={form.article_slug} onChange={e=>change('article_slug',e.target.value)}><option value="">Select published article</option>{posts.map(p=><option key={p.slug} value={p.slug}>{p.title}</option>)}</select></label>}
 <label>Instructions<textarea required style={{...field,boxSizing:'border-box'}} rows={5} minLength={20} maxLength={3000} value={form.instructions} onChange={e=>change('instructions',e.target.value)}/></label><div style={grid}><label>Reward (PTS)<input required type="number" min={0} max={100} disabled={quality} style={{...field,boxSizing:'border-box'}} value={quality?5:form.reward_points} onChange={e=>change('reward_points',e.target.value)}/></label><label>Slots<input required type="number" min={1} max={500} style={{...field,boxSizing:'border-box'}} value={form.slots} onChange={e=>change('slots',e.target.value)}/></label><label>Timer (seconds)<input required type="number" min={0} max={3600} disabled={quality} style={{...field,boxSizing:'border-box'}} value={quality?120:form.duration_seconds} onChange={e=>change('duration_seconds',e.target.value)}/></label><label>Start time (optional)<input type="datetime-local" style={{...field,boxSizing:'border-box'}} value={form.starts_at} onChange={e=>change('starts_at',e.target.value)}/></label><label>Expiry (optional)<input type="datetime-local" style={{...field,boxSizing:'border-box'}} value={form.expires_at} onChange={e=>change('expires_at',e.target.value)}/></label></div>
 <p style={muted}>Maximum campaign rewards: <strong>{budget.toLocaleString()} PTS</strong>. All submissions require review.</p><button style={btn} disabled={busy}>{editing?'Save changes':'Publish task'}</button>{editing&&<button type="button" style={{...btn,marginLeft:10}} onClick={()=>{setEditing(null);setForm(emptyForm);}}>Cancel</button>}</form>
 {message&&<p role="status">{message}</p>}<h2>Manage tasks</h2><div style={grid}>{tasks.map(t=>{const rows=subs.filter(s=>s.task_id===t.id),approved=rows.filter(s=>s.status==='approved'),pending=rows.filter(s=>s.status==='pending');return <section style={card} key={t.id}><small>{categoryNames[t.category]}</small><h3>{t.title}</h3><p style={muted}>{t.status} · {t.reward_points} PTS · {approved.length+pending.length}/{t.slots} reserved · {approved.reduce((a,s)=>a+s.reward_points,0)} PTS credited</p><button style={btn} disabled={busy} onClick={()=>pause(t)}>{t.status==='active'?'Pause':'Activate'}</button><button style={{...btn,marginLeft:8}} disabled={busy} onClick={()=>{setEditing(t.id);setForm({...t,article_slug:t.article_slug||'',starts_at:localDate(t.starts_at),expires_at:localDate(t.expires_at)});window.scrollTo(0,0);}}>Edit</button></section>})}</div>
 <h2>Submissions</h2><select style={field} value={filter} onChange={e=>setFilter(e.target.value)}>{['pending','approved','rejected','all'].map(s=><option key={s}>{s}</option>)}</select>{subs.filter(s=>filter==='all'||s.status===filter).map(s=><section key={s.id} style={{...card,marginBottom:12}}><strong>{tasks.find(t=>t.id===s.task_id)?.title||'Assignment'}</strong><p style={{...muted,whiteSpace:'pre-wrap'}}>{s.response}</p><p>{s.status} · {s.reward_points} PTS</p>{s.status==='pending'&&<div style={{display:'flex',gap:10}}><button style={btn} disabled={busy} onClick={()=>review(s,true)}>Approve &amp; credit</button><button style={btn} disabled={busy} onClick={()=>review(s,false)}>Reject</button></div>}</section>)}</main>;
}
