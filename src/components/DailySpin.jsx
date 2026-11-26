import {useState,useEffect,useRef} from 'react';
import {supabase} from '../lib/supabase';
const odds=[[1,'60%','45%'],[2,'25%','25%'],[3,'12%','15%'],[5,'3%','8%'],[10,'—','4%'],[25,'—','2%'],[50,'—','0.8%'],[100,'—','0.2%']];
export default function DailySpin({session,showToast}){
 const user=session?.user;
 const [state,setState]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState(''),[won,setWon]=useState(null),[now,setNow]=useState(Date.now());
 const inFlight=useRef(false),mounted=useRef(true);
 async function refresh(){try{const {data,error}=await supabase.rpc('daily_spin_status');if(error)throw error;if(mounted.current){setState(data);setError('');}}catch{if(mounted.current)setError('Unable to load spin status. Try refreshing.');}}
 useEffect(()=>{mounted.current=true;if(user?.id)refresh();const t=setInterval(()=>setNow(Date.now()),30000);return()=>{mounted.current=false;clearInterval(t);};},[user?.id]);
 useEffect(()=>{if(state?.next_at&&!state.eligible&&Date.parse(state.next_at)<=now&&!busy&&state.reason==='Next spin after cooldown')refresh();},[now,busy,state?.next_at,state?.eligible,state?.reason]);
 async function claim(){if(!state?.eligible||inFlight.current)return;inFlight.current=true;setBusy(true);setError('');setWon(null);
 try{const {data,error}=await supabase.rpc('claim_daily_spin');if(error||!data)throw error||Error('No response');if(!mounted.current)return;setState(data);setNow(Date.now());if(data.awarded_points!=null){setWon(Number(data.awarded_points));window.dispatchEvent(new Event('taskivo_spin_balance_updated'));if(showToast)showToast('+'+data.awarded_points+' PTS recorded, pending funding.','success');}else setError(data.reason||'Spin unavailable.');}
 catch{if(mounted.current){setError('Could not confirm the spin. Refresh status before trying again.');await refresh();}}
 finally{inFlight.current=false;if(mounted.current)setBusy(false);}}
 const canSpin=!!state?.eligible&&!busy,active=!!state?.active_tier;
 const mins=state?.next_at?Math.max(0,Math.ceil((Date.parse(state.next_at)-now)/60000)):0;
 const remaining=Math.floor(mins/60)+'h '+(mins%60)+'m';
 const card={background:'var(--surface-card)',border:'1px solid var(--line)',borderRadius:20,padding:'clamp(18px,4vw,24px)',textAlign:'center',boxShadow:'0 16px 32px rgba(0,0,0,0.2)',marginBottom:24};
 const button={background:canSpin?'var(--lime)':'var(--surface)',color:canSpin?'#000':'var(--slate)',border:'1px solid var(--line)',padding:16,borderRadius:12,fontWeight:800,fontSize:14,width:'100%',cursor:canSpin?'pointer':'not-allowed'};
 return <section style={card}><h3 style={{fontSize:16,fontWeight:800,textTransform:'uppercase',letterSpacing:1,margin:'0 0 4px'}}>Daily Network Yield</h3><p style={{fontSize:13,color:'var(--slate)',lineHeight:1.6,marginBottom:20}}>One free daily spin every 24 hours. No payment or ad interaction required.</p>
 <div style={{background:'#0D0D14',border:'2px solid '+(canSpin?'var(--lime)':'var(--line)'),borderRadius:16,padding:'24px 10px',margin:'0 auto 20px',color:'#a8ff3e'}}><div role="status" aria-live="polite" style={{fontSize:44,fontWeight:800,lineHeight:1.15,letterSpacing:-1}}>{busy?'…':won!==null?'+'+won:!state?'—':state.eligible?'READY':state.last_points!=null?'+'+state.last_points:'LOCKED'}</div><div style={{fontSize:12,marginTop:8,fontWeight:700}}>{busy?'Checking server…':won!==null?'PTS recorded · pending funding':state?.eligible?'Free spin available':state?.last_points!=null?'Last recorded spin':'Daily spin'}</div></div>
 <button style={button} onClick={claim} disabled={!canSpin}>{busy?'Recording reward…':canSpin?'SPIN FOR FREE':!state?'Loading status…':mins>0?'Next spin in '+remaining:state.reason||'Unavailable'}</button>
 {error&&<p role="alert" style={{fontSize:13,color:'var(--slate)',marginTop:12}}>{error} <button type="button" onClick={refresh} style={{color:'var(--ink)',background:'transparent',border:0,textDecoration:'underline',cursor:'pointer'}}>Refresh status</button></p>}
 <p style={{fontSize:13,lineHeight:1.6,color:'var(--slate)',margin:'14px 0'}}>Maximum {active?100:5} PTS for your current tier. {active?'Active tier unlocked.':'Active tier: account at least 14 days old, 10 recorded reading or approved admin tasks across 7 distinct UTC days in the last 14 days.'} {state&&'Current activity: '+(state.activity_tasks||0)+' tasks / '+(state.activity_days||0)+' days.'} All rewards are recorded pending funding; withdrawals are paused.</p>
 <details style={{textAlign:'left',fontSize:13,color:'var(--slate)',borderTop:'1px solid var(--line)',paddingTop:12}}><summary style={{cursor:'pointer',fontWeight:700,color:'var(--ink)'}}>Reward probabilities &amp; eligibility</summary><div style={{overflowX:'auto',marginTop:12}}><table style={{width:'100%',borderCollapse:'collapse',textAlign:'right'}}><thead><tr><th style={{textAlign:'left'}}>PTS</th><th>Standard</th><th>Active</th></tr></thead><tbody>{odds.map(([p,a,b])=><tr key={p}><td style={{padding:'6px 0',textAlign:'left'}}>{p}</td><td>{a}</td><td>{b}</td></tr>)}</tbody></table></div><p style={{marginTop:12,lineHeight:1.6}}>The result is randomly selected and recorded by the server. Higher prizes are not guaranteed. Each account can claim once every 24 hours.</p></details>
 </section>;
}
