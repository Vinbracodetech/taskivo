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
 const card={background:'var(--surface-card)',border:'1px solid var(--line)',borderRadius:18,padding:'16px',boxShadow:'0 8px 24px rgba(0,0,0,.12)',marginBottom:20};
 const legacy=!!state?.reason&&/spin reward already credited/i.test(state.reason);
 const status=complete?'Cycle complete! +'+state.today_points+' PTS credited.':claimed?'+'+state.today_points+' PTS credited today':legacy?'Today’s reward received. Streak starts tomorrow.':state?.eligible?'Today’s reward is available.':state?.reason||'Checking today’s reward…';
 return <section style={card} aria-label="Daily login streak">
 <style>{'.login-streak-grid{display:grid;grid-template-columns:repeat(10,minmax(0,1fr));gap:6px}@media(max-width:600px){.login-streak-grid{grid-template-columns:repeat(5,minmax(0,1fr))}}.streak-details summary{list-style:none;cursor:pointer}.streak-details summary::-webkit-details-marker{display:none}.streak-details[open] .streak-chevron{transform:rotate(180deg)}'}</style>
 <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}><span aria-hidden="true" style={{width:36,height:36,display:'grid',placeItems:'center',background:'rgba(245,158,11,.12)',borderRadius:10,fontSize:20,flexShrink:0}}>🔥</span><div style={{flex:1,minWidth:0}}><h3 style={{fontSize:16,fontWeight:800,margin:'0 0 3px'}}>Daily Login Streak</h3><div style={{fontSize:11,color:'var(--slate)'}}>30-day challenge</div></div><strong style={{fontSize:19,color:'var(--lime)',whiteSpace:'nowrap'}}>{state?day:'—'}<span style={{fontSize:12,color:'var(--slate)',fontWeight:600}}> / {schedule.length}</span></strong></div>
 <div role="progressbar" aria-label="Login streak progress" aria-valuemin={0} aria-valuemax={schedule.length} aria-valuenow={day} style={{height:6,background:'var(--surface)',borderRadius:10,overflow:'hidden',marginBottom:12}}><div style={{height:'100%',width:Math.min(100,day/schedule.length*100)+'%',background:'var(--lime)',borderRadius:10}}/></div>
 <div role="status" aria-live="polite" style={{fontSize:12,lineHeight:1.5,fontWeight:700,color:claimed?'var(--lime)':'var(--ink)'}}>{claimed?'✓ ':''}{status}</div>
 {state&&<div style={{display:'flex',gap:10,justifyContent:'space-between',flexWrap:'wrap',fontSize:11,lineHeight:1.5,color:'var(--slate)',marginTop:7}}><span>{claimed||legacy?'Next: ':'Upcoming: '}Day {state.next_day} · {state.next_points} PTS</span><span>Day 30 · <strong style={{color:'var(--ink)'}}>30 PTS</strong></span></div>}
 {(error||state?.eligible)&&<button onClick={retry} disabled={busy} style={{marginTop:10,background:'var(--lime)',color:'#000',border:0,borderRadius:8,padding:'9px 12px',fontSize:12,fontWeight:800,cursor:busy?'wait':'pointer'}}>{busy?'Checking…':'Claim today’s reward'}</button>}
 {error&&<p role="alert" style={{fontSize:12,color:'var(--slate)',margin:'8px 0 0'}}>{error}</p>}
 <details className="streak-details" style={{borderTop:'1px solid var(--line)',marginTop:13,paddingTop:11}}><summary style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:8,fontSize:12,fontWeight:800,color:'var(--ink)'}}><span>View reward calendar</span><svg className="streak-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></summary>
 <div className="login-streak-grid" style={{marginTop:12}}>{schedule.map((pts,i)=>{const n=i+1,done=n<=day,today=n===day&&claimed;return <div key={n} style={{minWidth:0,padding:'7px 2px',border:'1px solid '+(today?'var(--lime)':'var(--line)'),background:done?'var(--lime-dim)':'var(--surface)',borderRadius:8,textAlign:'center',color:done?'var(--ink)':'var(--slate)'}}><div style={{fontSize:9,fontWeight:700}}>DAY {n}</div><strong style={{display:'block',fontSize:15,margin:'3px 0',color:done?'var(--lime)':'var(--ink)'}}>{pts}</strong><div style={{fontSize:9}}>{done?'✓':'PTS'}</div></div>})}</div>
 <p style={{fontSize:12,color:'var(--slate)',lineHeight:1.6,margin:'12px 0 0'}}>Earn {schedule.reduce((sum,pts)=>sum+pts,0)} PTS per complete cycle. One reward per UTC day. Miss a day and restart at day 1. After day 30, a new cycle begins the next day. Previously earned points stay in your balance.</p></details>
 </section>;
}
