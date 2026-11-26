import {useState,useEffect,useRef} from 'react';
import {supabase} from '../lib/supabase';
import {loginSchedule,claimLoginReward} from '../lib/loginStreak.js';
export default function DailyLoginStreak({session}){
 const uid=session?.user?.id;
 const [state,setState]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const sequence=useRef(0);
 async function refresh(){const n=++sequence.current;try{const {data,error}=await supabase.rpc('daily_login_status');if(error)throw error;if(n===sequence.current){setState(data);setError('');}}catch{if(n===sequence.current)setError('Unable to check today’s reward. Please retry.');}}
 useEffect(()=>{if(!uid)return;setState(null);refresh();const onUpdate=e=>{++sequence.current;setState(e.detail);setError('');};window.addEventListener('taskivo_login_streak_updated',onUpdate);return()=>{++sequence.current;window.removeEventListener('taskivo_login_streak_updated',onUpdate);};},[uid]);
 async function retry(){if(busy)return;setBusy(true);setError('');try{const data=await claimLoginReward();setState(data);}catch{setError('Unable to confirm today’s reward. Try again.');}finally{setBusy(false);}}
 const schedule=state?.schedule||loginSchedule;
 const day=Number(state?.cycle_day||0),claimed=!!state?.claimed_today,complete=claimed&&day===schedule.length;
 const card={background:'var(--surface-card)',border:'1px solid var(--line)',borderRadius:20,padding:'clamp(18px,4vw,24px)',boxShadow:'0 16px 32px rgba(0,0,0,.16)',marginBottom:24};
 return <section style={card}><style>{'.login-streak-grid{display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:8px}@media(max-width:600px){.login-streak-grid{grid-template-columns:repeat(5,minmax(0,1fr))}}'}</style>
 <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap',marginBottom:16}}><div><h3 style={{fontSize:18,fontWeight:800,margin:'0 0 6px'}}>🔥 Daily Login Streak</h3><p style={{fontSize:13,color:'var(--slate)',lineHeight:1.6,margin:0}}>Visit your signed-in account each day. Reach day 30 for 30 PTS; earn {schedule.reduce((sum,pts)=>sum+pts,0)} PTS per complete cycle.</p></div><strong style={{fontSize:23,color:'var(--lime)'}}>{state?day+' / '+schedule.length:'—'}</strong></div>
 <div style={{height:7,background:'var(--surface)',borderRadius:10,overflow:'hidden',marginBottom:16}}><div style={{height:'100%',width:day/schedule.length*100+'%',background:'var(--lime)',borderRadius:10}}/></div>
 <div className="login-streak-grid">{schedule.map((pts,i)=>{const n=i+1,done=n<=day,selected=n===day&&claimed;return <div key={n} style={{minWidth:0,padding:'12px 3px',border:'1px solid '+(selected?'var(--lime)':'var(--line)'),background:done?'var(--lime-dim)':'var(--surface)',borderRadius:11,textAlign:'center',color:done?'var(--ink)':'var(--slate)'}}><div style={{fontSize:10,fontWeight:700}}>DAY {n}</div><strong style={{display:'block',fontSize:18,margin:'5px 0',color:done?'var(--lime)':'var(--ink)'}}>{pts}</strong><div style={{fontSize:10}}>{done?'✓ Claimed':'PTS'}</div></div>})}</div>
 <div role="status" aria-live="polite" style={{fontSize:14,lineHeight:1.65,marginTop:16}}>{complete?<strong style={{color:'var(--lime)'}}>30-day cycle completed! +{state.today_points} PTS credited. Tomorrow starts a new cycle.</strong>:claimed?<strong style={{color:'var(--lime)'}}>✓ Today: +{state.today_points} PTS added to your main balance.</strong>:state?<strong>{state.reason}</strong>:<span>Checking today’s login reward…</span>}</div>
 {state&&<p style={{fontSize:13,color:'var(--slate)',margin:'8px 0'}}>Next reward: day {state.next_day} · {state.next_points} PTS.</p>}
 {(error||state?.eligible)&&<button onClick={retry} disabled={busy} style={{marginTop:10,background:'var(--lime)',color:'#000',border:0,borderRadius:10,padding:'12px 16px',fontWeight:800,cursor:busy?'wait':'pointer'}}>{busy?'Checking…':'Retry today’s reward'}</button>}
 {error&&<p role="alert" style={{fontSize:13,color:'var(--slate)',marginTop:10}}>{error}</p>}
 <p style={{fontSize:12,color:'var(--slate)',lineHeight:1.7,marginTop:14}}>One reward per UTC calendar day. Missing a day restarts at day 1. After day 30, the next daily visit begins a new cycle. Previously credited points are retained. Points go directly to your main balance; cash withdrawals remain paused.</p></section>;
}
