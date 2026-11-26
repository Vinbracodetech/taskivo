export default function Wallet({user,navigate,walletSummary}){
 const total=walletSummary?.total;
 const hasDestination=Boolean(user?.payout_bank_name&&user?.payout_account);
 const card={background:'var(--surface-card)',border:'1px solid var(--line)',borderRadius:24,padding:'clamp(20px,4vw,32px)',boxShadow:'0 8px 32px rgba(0,0,0,.16)'};
 const label={fontSize:12,fontWeight:800,textTransform:'uppercase',letterSpacing:'1.5px',color:'var(--slate)',marginBottom:12,display:'block'};
 const action={background:'var(--lime)',border:0,borderRadius:100,color:'#111',padding:'13px 20px',fontWeight:800,cursor:'pointer'};
 return <main style={{minHeight:'100vh',backgroundColor:'var(--surface)',backgroundImage:'radial-gradient(circle at top center,rgba(168,255,62,.20) 0%,transparent 70%)',color:'var(--ink)'}}><div style={{maxWidth:1040,margin:'0 auto',padding:'30px 5% 48px'}}>
 <h1 style={{fontSize:30,margin:'0 0 22px',fontWeight:800}}>Wallet</h1>
 <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,340px),1fr))',gap:20}}>
 <section style={card}><span style={label}>Wallet Balance</span><div style={{display:'flex',alignItems:'baseline',gap:10,margin:'8px 0 24px'}}><strong style={{fontSize:'clamp(44px,8vw,60px)',fontWeight:800,lineHeight:1}}>{total==null?'—':total.toLocaleString()}</strong><span style={{color:'var(--lime)',fontSize:20,fontWeight:800}}>PTS</span></div><div style={{borderTop:'1px solid var(--line)',paddingTop:18,display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,flexWrap:'wrap'}}><button style={action} onClick={()=>navigate('history')}>Activity Ledger →</button></div></section>
 <section style={card}><span style={label}>Secure Payout Terminal</span>
 {hasDestination?<div style={{background:'var(--lime-dim)',border:'1px solid var(--line)',padding:16,borderRadius:12,marginBottom:20}}><div style={{fontSize:11,fontWeight:800,color:'var(--lime)',marginBottom:8}}>SAVED PAYOUT ACCOUNT</div><strong>{user.payout_bank_name}</strong><div style={{fontSize:13,color:'var(--slate)',marginTop:6}}>{user.payout_account_name}</div><div style={{fontSize:14,marginTop:4}}>•••• {String(user.payout_account).slice(-4)}</div></div>:<p style={{fontSize:14,color:'var(--slate)'}}>No payout account saved. <button onClick={()=>navigate('user-dashboard')} style={{color:'var(--ink)',border:0,background:'transparent',textDecoration:'underline',cursor:'pointer'}}>Update profile</button></p>}
 <label style={label} htmlFor="wallet-amount">Withdrawal amount (PTS)</label><input id="wallet-amount" disabled placeholder="Currently unavailable" style={{width:'100%',boxSizing:'border-box',background:'var(--surface)',border:'1px solid var(--line)',color:'var(--slate)',padding:14,borderRadius:12,marginBottom:12}}/><button type="button" disabled style={{...action,width:'100%',background:'var(--surface)',color:'var(--slate)',border:'1px solid var(--line)',cursor:'not-allowed'}}>Withdrawals temporarily paused</button>
 <p style={{fontSize:12,color:'var(--slate)',lineHeight:1.6,margin:'12px 0 0'}}>Points balance is not currently redeemable. Cash withdrawals are unavailable.</p></section>
 </div></div></main>;
}
