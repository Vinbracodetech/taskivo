import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import DailySpin from '../components/DailySpin';
import { enforceDeviceFingerprint } from '../lib/security';

export default function Dashboard({ user, navigate, showToast }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ completions: 0 });
  const [referralCopied, setReferralCopied] = useState(false);

  // 🔥 UPGRADED PROFILE STATES 🔥
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ 
    full_name: user.full_name || '', 
    payout_bank_name: user.payout_bank_name || '',
    payout_account: user.payout_account || '',
    payout_account_name: user.payout_account_name || ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchDashboardData();
    // SILENTLY TRIGGER THE DEVICE TRACKER
    enforceDeviceFingerprint(user.id);
  }, [user]);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      
      // Lightweight query: Only fetching total lifetime completions for the stat card
      const { count } = await supabase
        .from('completions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
        
      setStats({ completions: count || 0 });

    } catch (err) {
      if (showToast) showToast('Failed to sync dashboard stats', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfile() {
    setSavingProfile(true);
    try {
      if (!editForm.full_name) throw new Error("Full name is required");
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          full_name: editForm.full_name,
          payout_bank_name: editForm.payout_bank_name,
          payout_account: editForm.payout_account,
          payout_account_name: editForm.payout_account_name
        })
        .eq('id', user.id);
      
      if (error) {
        if (error.code === '23505' && error.message.includes('payout_account')) {
           throw new Error("This account number is already registered to another user.");
        }
        throw error;
      }
      
      user.full_name = editForm.full_name;
      user.payout_bank_name = editForm.payout_bank_name;
      user.payout_account = editForm.payout_account;
      user.payout_account_name = editForm.payout_account_name;
      
      if (showToast) showToast('Profile updated successfully', 'success');
      setShowEditModal(false);
    } catch (err) {
      if (showToast) showToast(err.message, 'error');
      else alert(err.message);
    } finally {
      setSavingProfile(false);
    }
  }

  function copyReferralLink() {
    navigator.clipboard.writeText(`https://taskivo.online/#auth?ref=${user.id}`);
    setReferralCopied(true);
    if (showToast) showToast('Invite link copied!', 'success');
    setTimeout(() => setReferralCopied(false), 3000);
  }

  function getInitials(name) {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  }

  if (loading) {
    return (
      <div style={{ padding: '80px 5%', textAlign: 'center', color: 'var(--slate)', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
        <div style={{ width: 24, height: 24, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--lime)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
        Decrypting profile data...
      </div>
    );
  }

  const minWithdrawal = 2000;
  const progressPercent = Math.min((user.points / minWithdrawal) * 100, 100);
  
  // Status check for the UI Badge only
  const isVerified = Boolean(user.payout_account && user.payout_bank_name);

  // 🔥 PROPRIETARY PREMIUM AESTHETIC STYLES 🔥
  const S = {
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
    
    // Glassmorphism Cards
    glassCard: { 
      background: 'var(--surface-card)', 
      border: '1px solid rgba(255,255,255,0.05)', 
      borderRadius: 24, 
      padding: 32, 
      display: 'flex', 
      flexDirection: 'column', 
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)', 
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)'
    },
    premiumCard: { 
      background: 'var(--surface-card)', 
      border: '1px solid var(--gold)', 
      borderRadius: 24, 
      padding: 32, 
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)', 
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      position: 'relative', 
      overflow: 'hidden' 
    },
    
    // Standard UI Elements
    label: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--slate)', marginBottom: 16, display: 'block', fontFamily: "'Inter', sans-serif" },
    valueGlow: { fontFamily: "'Inter', sans-serif", fontSize: 48, fontWeight: 800, color: 'var(--ink)', lineHeight: 1 },
    btnPrimary: { background: 'var(--lime)', color: '#000', border: 'none', padding: '12px 24px', borderRadius: 100, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px', boxShadow: '0 8px 16px rgba(168,255,62,0.2)', textAlign: 'center', transition: 'all 0.2s' },
    btnSecondary: { background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--ink)', borderRadius: 100, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(5px)', WebkitBackdropFilter: 'blur(5px)', textAlign: 'center', fontFamily: "'Inter', sans-serif", transition: 'all 0.2s' },
    
    // Structural Elements
    avatarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, position: 'relative', zIndex: 1, flexWrap: 'wrap', gap: 20 },
    avatarBlock: { display: 'flex', alignItems: 'center', gap: 16 },
    avatar: { width: 64, height: 64, borderRadius: '50%', background: 'var(--lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: 24, fontWeight: 800, fontFamily: "'Inter', sans-serif", border: '2px solid rgba(255,255,255,0.05)', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' },
    badge: { fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 6, letterSpacing: '0.5px', textTransform: 'uppercase', marginTop: 4, display: 'inline-block', fontFamily: "'Inter', sans-serif" },
    verified: { background: 'rgba(168,255,62,0.1)', color: 'var(--lime)', border: '1px solid var(--lime)' },
    unverified: { background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' },
    
    // Modal System
    modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 },
    modalCard: { background: 'var(--surface-card)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24, padding: 32, width: '100%', maxWidth: 400, boxShadow: '0 16px 48px rgba(0,0,0,0.4)', maxHeight: '90vh', overflowY: 'auto', backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)' },
    modalLabel: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--slate)', marginBottom: 8, display: 'block', fontFamily: "'Inter', sans-serif" },
    input: { width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, color: 'var(--ink)', fontSize: 15, marginBottom: 20, outline: 'none', boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif", transition: 'border-color 0.2s' }
  };

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
                {isVerified ? '✓ Verified Network' : '⚠ Action Required'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => navigate('history')} style={S.btnSecondary}>Activity Ledger</button>
            <button onClick={() => setShowEditModal(true)} style={S.btnSecondary}>Edit Profile</button>
          </div>
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <DailySpin session={{ user }} showToast={showToast} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 48, position: 'relative', zIndex: 1 }}>
          <div style={S.glassCard}>
            <span style={S.label}>Available Balance</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 32, marginTop: 8 }}>
              <div style={S.valueGlow}>{user.points.toLocaleString()}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--lime)', letterSpacing: '1px', fontFamily: "'Inter', sans-serif" }}>PTS</div>
            </div>
            
            <div style={{ marginTop: 'auto', display: 'flex', gap: 12 }}>
              <button onClick={() => navigate('wallet')} style={{ ...S.btnSecondary, flex: 1 }}>Wallet</button>
              <button onClick={() => navigate('history')} style={{ ...S.btnSecondary, flex: 1 }}>Ledger</button>
            </div>
          </div>

          <div style={S.glassCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ ...S.label, marginBottom: 0 }}>Verified Engagements</span>
              <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--ink)', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 100, letterSpacing: '0.5px', fontFamily: "'Inter', sans-serif" }}>
                {stats.completions} LIFETIME
              </div>
            </div>
            
            <div style={{ marginTop: 24, marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--slate)', fontWeight: 600, marginBottom: 12, fontFamily: "'Inter', sans-serif" }}>
                <span>Liquidity Target</span>
                <span style={{ color: 'var(--ink)' }}>{user.points} / {minWithdrawal}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.02)' }}>
                <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--lime)', borderRadius: 10 }}></div>
              </div>
            </div>

            <div style={{ marginTop: 'auto' }}>
              <button onClick={() => navigate('tasks')} style={{ ...S.btnPrimary, width: '100%', display: 'block' }}>Acquire Tasks</button>
            </div>
          </div>
        </div>

        {/* PREMIUM GOLD CARD */}
        <div style={{ ...S.premiumCard, marginBottom: 56, display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
          <div style={{ flex: '1 1 300px', position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid var(--gold)', color: 'var(--gold)', background: 'rgba(255,215,0,0.05)', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16, fontFamily: "'Inter', sans-serif" }}>
              ✦ VIP Network Bonus
            </div>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, color: 'var(--ink)', marginBottom: 12, fontWeight: 800, letterSpacing: '-0.5px' }}>Expand Your Network. Earn 50 Points.</h2>
            <p style={{ color: 'var(--slate)', fontSize: 14, lineHeight: 1.6, maxWidth: 500, margin: 0 }}>
              Distribute your unique cryptographic invite link. Upon a successful registration and first verified task completion from your referral, your account is instantly credited.
            </p>
          </div>
          
          <button onClick={copyReferralLink} style={{ position: 'relative', zIndex: 2, background: referralCopied ? 'rgba(255,255,255,0.05)' : 'rgba(255,215,0,0.1)', color: referralCopied ? 'var(--ink)' : 'var(--gold)', border: `1px solid ${referralCopied ? 'rgba(255,255,255,0.1)' : 'var(--gold)'}`, borderRadius: 100, padding: '14px 28px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'all 0.3s', backdropFilter: 'blur(5px)' }}>
            {referralCopied ? 'LINK COPIED ✓' : 'COPY SECURE LINK'}
          </button>
        </div>

        {showEditModal && (
          <div style={S.modalOverlay}>
            <div style={S.modalCard}>
              <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 800, color: 'var(--ink)', marginBottom: 8, letterSpacing: '-0.5px' }}>Edit Profile</h2>
              <p style={{ color: 'var(--slate)', fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>Update your network identity and payout configurations.</p>
              
              <label style={S.modalLabel}>Full Name</label>
              <input style={S.input} type="text" placeholder="Your legal name" value={editForm.full_name} onChange={e => setEditForm({...editForm, full_name: e.target.value})} />

              <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '8px 0 24px' }}></div>
              
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
