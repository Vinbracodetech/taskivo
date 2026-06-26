import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import DailySpin from '../components/DailySpin';
import { enforceDeviceFingerprint } from '../lib/security';

export default function Dashboard({ user, navigate, showToast }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ completions: 0 });
  const [referralCopied, setReferralCopied] = useState(false);

  // Profile States
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ 
    full_name: user.full_name || '', 
    payout_bank_name: user.payout_bank_name || '',
    payout_account: user.payout_account || '',
    payout_account_name: user.payout_account_name || ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Support Ticket States
  const [tickets, setTickets] = useState([]);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [submittingTicket, setSubmittingTicket] = useState(false);
  const [ticketForm, setTicketForm] = useState({ category: 'Missing Points', message: '' });

  useEffect(() => {
    if (!user) return;
    fetchDashboardData();
    fetchTickets();
    enforceDeviceFingerprint(user.id);
  }, [user]);

  async function fetchDashboardData() {
    try {
      setLoading(true);
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

  async function fetchTickets() {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setTickets(data);
      }
    } catch (err) {
      console.error("Error fetching tickets:", err);
    }
  }

  async function handleSubmitTicket() {
    if (!ticketForm.message.trim()) {
      if (showToast) showToast('Please enter a detailed message.', 'error');
      return;
    }
    
    setSubmittingTicket(true);
    try {
      const { error } = await supabase.from('support_tickets').insert({
        user_id: user.id,
        category: ticketForm.category,
        message: ticketForm.message
      });

      if (error) throw error;

      if (showToast) showToast('Support ticket submitted successfully.', 'success');
      setShowTicketModal(false);
      setTicketForm({ category: 'Missing Points', message: '' });
      fetchTickets();
    } catch (err) {
      if (showToast) showToast(`Submission failed: ${err.message}`, 'error');
    } finally {
      setSubmittingTicket(false);
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
           throw new Error("This account number is already registered.");
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

  // 🔥 UPDATED LIQUIDITY MATH 🔥
  const minWithdrawal = 100; // Day-One Cashout Threshold
  const progressPercent = Math.min((user.points / minWithdrawal) * 100, 100);
  const isVerified = Boolean(user.payout_account && user.payout_bank_name);

  // [Include your existing S object here...]
  // (The rest of your S object remains the same as in your snippet)

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
              <button onClick={() => navigate('wallet')} style={{ ...S.btnPrimary, flex: 1 }}>Withdraw Funds</button>
              <button onClick={() => navigate('history')} style={{ ...S.btnSecondary, flex: 1 }}>Ledger</button>
            </div>
          </div>

          <div style={S.glassCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ ...S.label, marginBottom: 0 }}>Day-One Cashout Progress</span>
              <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--ink)', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 100, letterSpacing: '0.5px', fontFamily: "'Inter', sans-serif" }}>
                {stats.completions} TASKS COMPLETED
              </div>
            </div>
            
            <div style={{ marginTop: 24, marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--slate)', fontWeight: 600, marginBottom: 12, fontFamily: "'Inter', sans-serif" }}>
                <span>Liquidity Target (100 PTS)</span>
                <span style={{ color: 'var(--ink)' }}>{user.points} / {minWithdrawal}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.02)' }}>
                <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--lime)', borderRadius: 10 }}></div>
              </div>
            </div>

            <div style={{ marginTop: 'auto' }}>
              <button onClick={() => navigate('tasks')} style={{ ...S.btnPrimary, width: '100%', display: 'block', background: 'var(--ink)', color: '#fff' }}>Acquire More Tasks</button>
            </div>
          </div>
        </div>

        {/* [Keep your existing Referral and Ticket sections below here...] */}
        
      </div>
    </div>
  );
}
