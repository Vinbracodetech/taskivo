import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Wallet({user,navigate,walletSummary}){
 const [wallet,setWallet]=useState(null);
 const total=wallet===null?walletSummary?.total:Number(wallet.total_points);
 const [amount,setAmount]=useState('');
 const [busy,setBusy]=useState(false);
 const [notice,setNotice]=useState('');
 const [refresh,setRefresh]=useState(0);
 useEffect(()=>{
  let alive=true;
  setWallet(null);
  const load=async()=>{if(!user?.id)return;try{const {data,error}=await supabase.rpc('wallet_points_summary');if(alive)setWallet(error?null:data);}catch{if(alive)setWallet(null);}};
  load();const timer=setInterval(load,15000);
  return ()=>{alive=false;clearInterval(timer);};
 },[user?.id,refresh]);
 const available=Number(wallet?.total_points||0);
 const open=wallet?.withdrawals_open===true;
 const eligible=wallet?.eligible===true;
 const validAmount=/^\d+$/.test(amount)&&Number.isSafeInteger(Number(amount))&&Number(amount)>=100&&Number(amount)<=available;
 async function requestPayout(){
  if(busy||!open||!eligible||!validAmount||!hasDestination)return;
  setBusy(true);setNotice('');
  try{
   const {error}=await supabase.rpc('request_weekly_withdrawal',{p_amount:Number(amount)});
   if(error){setNotice('Request not accepted. Check the withdrawal hours, available points and saved bank details.');return;}
   setNotice('Withdrawal requested. Your request will be reviewed for bank transfer.');setAmount('');
  }catch{setNotice('Could not submit withdrawal. Refresh to check your withdrawal history before retrying.');}
  finally{setRefresh(n=>n+1);setBusy(false);}
 }
 const hasDestination=Boolean(user?.payout_bank_name&&/^\d{10}$/.test(String(user?.payout_account||'').trim())&&user?.payout_account_name);
 const card={background:'var(--surface-card)',border:'1px solid var(--line)',borderRadius:24,padding:'clamp(20px,4vw,32px)',boxShadow:'0 8px 32px rgba(0,0,0,.16)'};
 const label={fontSize:12,fontWeight:800,textTransform:'uppercase',letterSpacing:'1.5px',color:'var(--slate)',marginBottom:12,display:'block'};
 const action={background:'var(--lime)',border:0,borderRadius:100,color:'#111',padding:'13px 20px',fontWeight:800,cursor:'pointer'};
 return <main style={{minHeight:'100vh',backgroundColor:'var(--surface)',backgroundImage:'radial-gradient(circle at top center,rgba(168,255,62,.20) 0%,transparent 70%)',color:'var(--ink)'}}><div style={{maxWidth:1040,margin:'0 auto',padding:'30px 5% 48px'}}>
 <h1 style={{fontSize:30,margin:'0 0 22px',fontWeight:800}}>Wallet</h1>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,340px),1fr))',gap:20}}>
 <section style={card}><span style={label}>Wallet Balance</span><div style={{display:'flex',alignItems:'baseline',gap:10,margin:'8px 0 24px'}}><strong style={{fontSize:'clamp(44px,8vw,60px)',fontWeight:800,lineHeight:1}}>{total==null?'—':total.toLocaleString()}</strong><span style={{color:'var(--lime)',fontSize:20,fontWeight:800}}>PTS</span></div><div style={{borderTop:'1px solid var(--line)',paddingTop:18,display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}><button style={action} onClick={()=>navigate('history')}>Activity Ledger →</button></div></section>
 <section style={card}><span style={label}>Secure Payout Terminal</span>
 {hasDestination?<div style={{background:'var(--lime-dim)',border:'1px solid var(--line)',padding:16,borderRadius:12,marginBottom:20}}><div style={{fontSize:11,fontWeight:800,color:'var(--lime)',marginBottom:8}}>SAVED PAYOUT ACCOUNT</div><strong>{user.payout_bank_name}</strong><div style={{fontSize:13,color:'var(--slate)',marginTop:6}}>{user.payout_account_name}</div><div style={{fontSize:14,marginTop:4}}>•••• {String(user.payout_account).slice(-4)}</div></div>:<p style={{fontSize:14,color:'var(--slate)'}}>No payout account saved. <button onClick={()=>navigate('user-dashboard')} style={{color:'var(--ink)',border:0,background:'transparent',textDecoration:'underline',cursor:'pointer'}}>Update profile</button></p>}
 <div style={{marginBottom:16,border:'1px solid var(--line)',borderRadius:12,padding:16}}><strong style={{color:open?'var(--lime)':'var(--ink)'}}>{wallet===null?'Checking withdrawal availability…':open?'Withdrawals open':'Withdrawals closed'}</strong><p style={{fontSize:14,lineHeight:1.6,color:'var(--slate)'}}>Withdrawal requests are accepted every Saturday, 9:00 AM to 11:59 PM (WAT). The window closes at midnight Sunday. Earn throughout the week and withdraw during the next open window once you have at least 100 points, valid bank details and an eligible account.</p></div>
 <label style={label} htmlFor="wallet-amount">Withdrawal amount (PTS)</label><input id="wallet-amount" inputMode="numeric" value={amount} onChange={e=>setAmount(e.target.value)} disabled={busy||!open||!eligible||available<100||!hasDestination} placeholder="Minimum 100" style={{width:'100%',boxSizing:'border-box',background:'var(--surface)',border:'1px solid var(--line)',color:'var(--ink)',padding:14,borderRadius:12,marginBottom:12}}/><button type="button" onClick={requestPayout} disabled={busy||!open||!eligible||!validAmount||!hasDestination} style={{...action,width:'100%',opacity:(busy||!open||!eligible||!validAmount||!hasDestination) ? 0.6 : 1}}>{busy?'Submitting…':open?'Request withdrawal':'Withdrawals closed'}</button>
 {notice&&<p role="status">{notice}</p>}<p style={{fontSize:12,color:'var(--slate)',lineHeight:1.6,margin:'12px 0 0'}}>1 PTS = ₦1. Verified rewards are added to your wallet without waiting for provider settlement. Reversed or invalid rewards may be deducted. Requests are reviewed before manual bank transfer. No deposit is required.</p></section>
 </div></div></main>;
}
