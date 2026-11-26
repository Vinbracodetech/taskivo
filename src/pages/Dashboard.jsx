import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import DailyLoginStreak from '../components/DailySpin';
import TelegramBonus from '../components/TelegramBonus';
import { enforceDeviceFingerprint } from '../lib/security';

export default function Dashboard({ user, navigate, showToast, inboxCount, walletSummary, initialEdit=false }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ completions: 0 });
  
  // 🔥 INSTANT UI UPDATE STATE 🔥
  const [localPoints, setLocalPoints] = useState(user?.points || 0);

  // Profile States
  const [showEditModal, setShowEditModal] = useState(initialEdit);
  const [editForm, setEditForm] = useState({ 
    full_name: user.full_name || '', 
    payout_bank_name: user.payout_bank_name || '',
    payout_account: user.payout_account || '',
    payout_account_name: user.payout_account_name || '',
    local_currency: user.local_currency || 'NGN'
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Inbox read state is managed by the global notification bell.
  useEffect(() => {
    if (!user) return;
    enforceDeviceFingerprint(user.id);
    setLoading(false);
  }, [user?.id]);
  useEffect(()=>{setLocalPoints(user?.points||0);},[user?.points]);

  async function handleSaveProfile() {
    setSavingProfile(true);
    try {
      if (!editForm.full_name) throw new Error("Full name is required");
      
      const safeAccount = editForm.payout_account?.trim() === '' ? null : editForm.payout_account?.trim();
      const safeBank = editForm.payout_bank_name?.trim() === '' ? null : editForm.payout_bank_name?.trim();
      const safeAccountName = editForm.payout_account_name?.trim() === '' ? null : editForm.payout_account_name?.trim();

      const { data, error } = await supabase
        .from('profiles')
        .update({ 
          full_name: editForm.full_name, payout_bank_name: safeBank, payout_account: safeAccount, payout_account_name: safeAccountName, local_currency: editForm.local_currency 
        })
        .eq('id', user.id).select();

      if (error) {
        if (error.code === '23505') throw new Error("This account number is already registered to another user.");
        throw new Error(`Database Error: ${error.message}`);
      }
      
      if (!data || data.length === 0) throw new Error("Supabase RLS blocked the save.");
      
      if (showToast) showToast('Profile updated successfully!', 'success');
      setShowEditModal(false);
      setTimeout(() => window.location.reload(), 1500);

    } catch (err) {
      if (showToast) showToast(err.message, 'error');
    } finally {
      setSavingProfile(false);
    }
  }

  function getInitials(name) {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  }

  const minWithdrawal = 100;
  const progressPercent = Math.min((localPoints / minWithdrawal) * 100, 100);
  const isVerified = Boolean(user.payout_account && user.payout_bank_name);
  
  const unreadCount=Number(inboxCount||0);

  const S = {
    pageWrapper: { minHeight: '100vh', backgroundColor: 'var(--surface)', backgroundImage: `radial-gradient(circle at top center, rgba(168,255,62,0.20) 0%, transparent 70%), url("data:image/svg+xml,%3Csvg width='80' height='138.6' viewBox='0 0 80 138.6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 138.6L0 115.5V69.3l40-23.1 40 23.1v46.2zM40 46.2L0 23.1V-23.1l40-23.1 40 23.1v46.2z' fill='none' stroke='%23A8FF3E' stroke-width='2' stroke-opacity='0.15'/%3E%3C/svg%3E")`, backgroundSize: '100%, 80px 138.6px', backgroundAttachment: 'scroll' },
    page: { padding: '40px 5%', maxWidth: 1040, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", position: 'relative' },
    glassCard: { background: 'var(--surface-card)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' },
    premiumCard: { background: 'var(--surface-card)', border: '1px solid var(--gold)', borderRadius: 24, padding: 32, boxShadow: '0 8px 32px rgba(0,0,0,0.2)',  position: 'relative', overflow: 'hidden' },
    label: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--slate)', marginBottom: 16, display: 'block', fontFamily: "'Inter', sans-serif" },
    valueGlow: { fontFamily: "'Inter', sans-serif", fontSize: 48, fontWeight: 800, color: 'var(--ink)', lineHeight: 1 },
    btnPrimary: { background: 'var(--lime)', color: '#000', border: 'none', padding: '12px 24px', borderRadius: 100, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px', boxShadow: '0 8px 16px rgba(168,255,62,0.2)', textAlign: 'center', transition: 'all 0.2s' },
    btnSecondary: { background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--ink)', borderRadius: 100, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)', textAlign: 'center', fontFamily: "'Inter', sans-serif", transition: 'all 0.2s' },
    avatarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, position: 'relative', zIndex: 1, flexWrap: 'wrap', gap: 20 },
    avatarBlock: { display: 'flex', alignItems: 'center', gap: 16 },
    avatar: { width: 64, height: 64, borderRadius: '50%', background: 'var(--lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: 24, fontWeight: 800, fontFamily: "'Inter', sans-serif", border: '2px solid rgba(255,255,255,0.05)', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' },
    badge: { fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 6, letterSpacing: '0.5px', textTransform: 'uppercase', marginTop: 4, display: 'inline-block', fontFamily: "'Inter', sans-serif" },
    verified: { background: 'rgba(168,255,62,0.1)', color: 'var(--lime)', border: '1px solid var(--lime)' },
    unverified: { background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' },
    modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 },
    modalCard: { background: 'var(--surface-card)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24, padding: 32, width: '100%', maxWidth: 400, boxShadow: '0 16px 48px rgba(0,0,0,0.4)', maxHeight: '90vh', overflowY: 'auto', backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)' },
    modalLabel: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--slate)', marginBottom: 8, display: 'block', fontFamily: "'Inter', sans-serif" },
    input: { width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, color: 'var(--ink)', fontSize: 15, marginBottom: 20, outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.2s' },
    ticketCard: { background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, padding: 20, marginBottom: 16 },
    statusOpen: { background: 'rgba(239, 160, 68, 0.1)', color: '#efa044', border: '1px solid rgba(239, 160, 68, 0.3)' },
    statusResolved: { background: 'rgba(168,255,62,0.1)', color: 'var(--lime)', border: '1px solid rgba(168,255,62,0.3)' },
    resolutionBox: { marginTop: 16, padding: 16, background: 'rgba(168,255,62,0.05)', borderLeft: '3px solid var(--lime)', borderRadius: '0 8px 8px 0', fontSize: 13, color: 'var(--ink)' }
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 5%', textAlign: 'center', color: 'var(--slate)', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
        <div style={{ width: 24, height: 24, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--lime)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
        Decrypting profile data...
      </div>
    );
  }

  return (
    <div style={S.pageWrapper}>
      
      <div style={S.page}>
        
        <div style={S.avatarHeader}>
          <div style={S.avatarBlock}>
            <div style={S.avatar}>{getInitials(user.full_name)}</div>
            <div>
              <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 28, color: 'var(--ink)', margin: '0 0 4px', fontWeight: 800, letterSpacing: '-0.5px', textTransform: 'capitalize' }}>
                {user.full_name || 'Earner'}
              </h1>
              <div style={{ ...S.badge, ...(isVerified ? S.verified : S.unverified) }}>
                {isVerified ? '✓ Payout details saved' : '⚠ Payout details missing'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => navigate('history')} style={S.btnSecondary}>Activity Ledger</button>
            <button onClick={() => setShowEditModal(true)} style={S.btnSecondary}>Edit Profile</button>
          </div>
        </div>


        <button type="button" onClick={()=>window.dispatchEvent(new Event('taskivo_open_inbox'))} style={{...S.glassCard,display:'flex',width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'space-between',gap:12,padding:'18px 20px',marginBottom:24,textAlign:'left',cursor:'pointer',border:'1px solid '+(unreadCount>0?'var(--lime)':'var(--line)'),color:'var(--ink)'}}><span style={{display:'flex',alignItems:'center',gap:12}}><span aria-hidden="true" style={{fontSize:24}}>🔔</span><span><strong style={{display:'block',fontSize:16}}>Inbox &amp; Alerts</strong><span style={{fontSize:12,color:'var(--slate)'}}>Official announcements and direct messages</span></span></span><span style={{color:unreadCount?'var(--lime)':'var(--slate)',fontWeight:800,fontSize:12,whiteSpace:'nowrap'}}>{inboxCount===null?'Open inbox':unreadCount+' unread'} →</span></button>
        <button type="button" onClick={()=>navigate('support')} style={{...S.glassCard,width:'100%',flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:'18px 20px',marginBottom:24,textAlign:'left',color:'var(--ink)',cursor:'pointer'}}><span><strong style={{display:'block',fontSize:16}}>🎧 Help &amp; Support</strong><span style={{fontSize:12,color:'var(--slate)'}}>FAQs, tickets and replies</span></span><strong style={{color:'var(--lime)'}}>Open →</strong></button>
        <DailyLoginStreak session={{user}}/>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%,320px), 1fr))', gap: 24, marginBottom: 24, position: 'relative', zIndex: 1 }}>
          <div style={S.glassCard}>
            <span style={S.label}>Wallet Balance</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 32, marginTop: 8 }}>
              <div style={S.valueGlow}>{walletSummary.total===null?"—":walletSummary.total.toLocaleString()}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--lime)', letterSpacing: '1px', fontFamily: "'Inter', sans-serif" }}>PTS</div>
            </div>
            
            
            <div style={{ marginTop: 'auto', display: 'flex', gap: 12 }}>
              <button onClick={() => navigate('wallet')} style={{ ...S.btnPrimary, flex: 1 }}>View wallet</button>
              <button onClick={() => navigate('history')} style={{ ...S.btnSecondary, flex: 1 }}>Ledger</button>
            </div>
          </div>

          <div style={S.glassCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ ...S.label, marginBottom: 0 }}>Task Progress</span>
              <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--ink)', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 100, letterSpacing: '0.5px', fontFamily: "'Inter', sans-serif" }}>
                {walletSummary.readingCount===null?'—':walletSummary.readingCount} ARTICLES READ
              </div>
            </div>
            
            <div style={{ marginTop: 'auto' }}>
              <button onClick={() => navigate('tasks')} style={{ ...S.btnPrimary, width: '100%', display: 'block' }}>Acquire More Tasks</button>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{...S.premiumCard,border:'1px solid var(--lime)',marginBottom:28,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:20,padding:'clamp(20px,4vw,32px)'}}><div style={{flex:'1 1 230px'}}><span style={{...S.label,color:'var(--lime)',marginBottom:8}}>TASK NETWORK</span><h2 style={{fontSize:24,margin:'0 0 8px'}}>Offerwalls &amp; Internal Intel</h2><p style={{color:'var(--slate)',lineHeight:1.6,fontSize:14,margin:0}}>Explore partner surveys, two-minute blog tasks and official assignments.</p></div><div style={{display:'flex',gap:10,flexWrap:'wrap'}}><button style={S.btnPrimary} onClick={()=>navigate('tasks')}>Explore Tasks</button><button style={S.btnSecondary} onClick={()=>navigate('offerwalls')}>Offerwalls</button></div></div>
        </div>

        <section aria-label="Referral program preview" style={{...S.premiumCard,padding:'14px 16px',borderRadius:16,marginBottom:24,display:'flex',alignItems:'center',gap:12,flexWrap:'wrap',border:'1px solid var(--gold)'}}>
          <span aria-hidden="true" style={{width:40,height:40,display:'grid',placeItems:'center',borderRadius:11,background:'rgba(212,175,55,.10)',color:'var(--gold)',flexShrink:0}}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 4v2"/></svg></span>
          <div style={{flex:'1 1 130px',minWidth:0}}><h2 style={{fontSize:16,fontWeight:800,margin:'0 0 4px',color:'var(--ink)'}}>Invite &amp; Earn</h2><p style={{fontSize:12,lineHeight:1.5,margin:0,color:'var(--slate)'}}>Invite friends and earn rewards when available.</p></div>
          <span style={{fontSize:10,fontWeight:800,letterSpacing:'.3px',textTransform:'uppercase',color:'var(--gold)',background:'rgba(212,175,55,.10)',border:'1px solid rgba(212,175,55,.25)',borderRadius:100,padding:'6px 10px',whiteSpace:'nowrap'}}>Coming Soon</span>
        </section>

        {/* PROFILE EDIT MODAL */}
        {showEditModal && (
          <div style={S.modalOverlay}>
            <div style={S.modalCard}>
              <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 800, color: 'var(--ink)', marginBottom: 8, letterSpacing: '-0.5px' }}>Edit Profile</h2>
              <p style={{ color: 'var(--slate)', fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>Update your network identity and payout configurations.</p>
              
              <label style={S.modalLabel}>Full Name</label>
              <input style={S.input} type="text" placeholder="Your legal name" value={editForm.full_name} onChange={e => setEditForm({...editForm, full_name: e.target.value})} />

              <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '8px 0 24px' }}></div>
              
              <label style={S.modalLabel}>Local Currency / Market</label>
              <select style={S.input} value={editForm.local_currency} onChange={e => setEditForm({...editForm, local_currency: e.target.value})}>
                <option value="NGN" style={{ color: '#000' }}>Nigeria (NGN ₦)</option>
                <option value="ZAR" style={{ color: '#000' }}>South Africa (ZAR R)</option>
                <option value="GHS" style={{ color: '#000' }}>Ghana (GHS GH₵)</option>
                <option value="KES" style={{ color: '#000' }}>Kenya (KES KSh)</option>
                <option value="USD" style={{ color: '#000' }}>Global (USD $)</option>
              </select>

              <label style={S.modalLabel}>Bank / Institution Name</label>
              <input style={S.input} type="text" placeholder="e.g. Chase, Paystack, PayPal" value={editForm.payout_bank_name} onChange={e => setEditForm({...editForm, payout_bank_name: e.target.value})} />

              <label style={S.modalLabel}>Account Name</label>
              <input style={S.input} type="text" placeholder="e.g. John Doe" value={editForm.payout_account_name} onChange={e => setEditForm({...editForm, payout_account_name: e.target.value})} />

              <label style={S.modalLabel}>Account Number / Email</label>
              <input style={{...S.input, marginBottom: 8}} type="text" placeholder="e.g. 0123456789" value={editForm.payout_account} onChange={e => setEditForm({...editForm, payout_account: e.target.value})} />
              
              <div style={{ fontSize: 11, color: 'var(--slate)', marginBottom: 24, lineHeight: 1.4 }}>
                This entire ledger locks permanently upon your first successful withdrawal to prevent network fraud.
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setShowEditModal(false)} style={{ ...S.btnSecondary, flex: 1 }}>Cancel</button>
                <button onClick={handleSaveProfile} disabled={savingProfile} style={{ ...S.btnPrimary, flex: 1, opacity: savingProfile ? 0.5 : 1 }}>
                  {savingProfile ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
