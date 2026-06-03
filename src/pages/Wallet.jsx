import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Wallet({ user, navigate, showToast }) {
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [amount, setAmount] = useState('');
  
  // Store their locked identity from the database
  const [lockedDestination, setLockedDestination] = useState(null);

  const minWithdrawal = 2000;
  
  // 🔥 DYNAMIC FIAT CONVERSION ENGINE (2000 PTS = $1.50) 🔥
  const conversionRate = 1.50 / 2000; // 0.00075
  const fiatBalance = (user ? user.points * conversionRate : 0).toFixed(2);
  const thresholdFiat = (minWithdrawal * conversionRate).toFixed(2);

  useEffect(() => {
    if (!user) return;
    fetchLedger();
  }, [user]);

  async function fetchLedger() {
    try {
      setLoading(true);
      
      // 1. Fetch Transaction History
      const { data: txData, error: txError } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (txError) throw txError;
      setWithdrawals(txData || []);
      
      // 2. Fetch their globally locked payout identity
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('payout_bank_name, payout_account_name, payout_account')
        .eq('id', user.id)
        .single();
        
      if (profileError) throw profileError;
      
      if (profile?.payout_account) {
        setLockedDestination(profile);
      }
      
    } catch (err) {
      if (showToast) showToast('Failed to sync transaction ledger', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleWithdrawal(e) {
    e.preventDefault();
    const amountNum = parseInt(amount, 10);
    
    if (!amountNum || amountNum < minWithdrawal) {
      if (showToast) showToast(`Minimum withdrawal is ${minWithdrawal.toLocaleString()} PTS.`, 'error');
      return;
    }
    if (amountNum > user.points) {
      if (showToast) showToast('Insufficient liquidity.', 'error');
      return;
    }
    if (!lockedDestination) {
      if (showToast) showToast('Payout identity missing. Please initiate a task to set up your payout node.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      
      // Submit withdrawal using the LOCKED data
      const { error: insertError } = await supabase.from('withdrawals').insert({
        user_id: user.id, 
        amount: amountNum, 
        bank_name: lockedDestination.payout_bank_name, 
        account_name: lockedDestination.payout_account_name,
        account_number: lockedDestination.payout_account, 
        status: 'pending'
      });
      
      if (insertError) throw insertError;

      // Deduct points
      const { error: updateError } = await supabase.from('profiles').update({ points: user.points - amountNum }).eq('id', user.id);
      if (updateError) throw updateError;

      // 🔥 FIRE THE GLOBAL SYNC ENGINE 🔥
      window.dispatchEvent(new Event('taskivo_points_updated'));

      if (showToast) showToast('Transfer initiated. Funds will arrive within 24 hours.', 'success');
      setAmount('');
      
      // Refresh the ledger table
      fetchLedger();
      
    } catch (err) {
      console.error("Withdrawal Error:", err);
      alert("DATABASE REJECTED IT! Reason: " + JSON.stringify(err, null, 2));
      if (showToast) showToast(err.message || 'Transaction failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '80px 5%', textAlign: 'center', color: 'var(--slate)', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
        <div style={{ width: 24, height: 24, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--lime)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
        Syncing ledger data...
      </div>
    );
  }

  const progressPercent = Math.min((user.points / minWithdrawal) * 100, 100);
  const isEligible = user.points >= minWithdrawal;

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
      boxShadow: '0 8px 32px rgba(0,0,0,0.2)', 
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)'
    },
    
    label: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--slate)', marginBottom: 8, display: 'block', fontFamily: "'Inter', sans-serif" },
    valueGlow: { fontFamily: "'Inter', sans-serif", fontSize: 56, fontWeight: 800, color: 'var(--ink)', lineHeight: 1 },
    input: { width: '100%', padding: '14px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12, color: 'var(--ink)', fontSize: 16, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', marginBottom: 20, transition: 'border-color 0.2s' },
    
    btnLime: { width: '100%', background: 'var(--lime)', border: 'none', color: '#000', borderRadius: 100, padding: '16px', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px', boxShadow: '0 8px 16px rgba(168,255,62,0.2)', transition: 'all 0.2s' },
    btnDisabled: { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--slate)', borderRadius: 100, padding: '16px', fontSize: 14, fontWeight: 800, cursor: 'not-allowed', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px', backdropFilter: 'blur(5px)' },
    
    statusBadge: function(status) {
      if (status === 'approved') return { background: 'rgba(168,255,62,0.1)', color: 'var(--lime)', border: '1px solid rgba(168,255,62,0.3)' };
      if (status === 'rejected') return { background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' };
      return { background: 'rgba(255,255,255,0.05)', color: 'var(--ink)', border: '1px solid rgba(255,255,255,0.1)' };
    }
  };

  return (
    <div style={S.pageWrapper}>
      <div style={S.page}>
        
        <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 32, color: 'var(--ink)', marginBottom: 8, fontWeight: 800, letterSpacing: '-0.5px' }}>Portfolio & Withdrawals</h1>
            <p style={{ color: 'var(--slate)', fontSize: 15, fontWeight: 400, margin: 0 }}>Manage your liquidity and request payouts.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, marginBottom: 48 }}>
          
          <div style={{ ...S.glassCard, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={S.label}>Total Liquid Points</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12, marginBottom: 8, flexWrap: 'wrap' }}>
                <div style={S.valueGlow}>{user.points.toLocaleString()}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--lime)', letterSpacing: '1px', fontFamily: "'Inter', sans-serif" }}>PTS</div>
                <div style={{ marginLeft: 'auto', fontSize: 14, fontWeight: 700, color: 'var(--slate)', background: 'rgba(255,255,255,0.05)', padding: '6px 12px', borderRadius: 100, border: '1px solid rgba(255,255,255,0.1)' }}>
                  ≈ ${fiatBalance}
                </div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--slate)', fontWeight: 500 }}>
                Minimum withdrawal threshold: {minWithdrawal.toLocaleString()} PTS (${thresholdFiat})
              </div>
            </div>

            <div style={{ marginTop: 48 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--slate)', fontWeight: 600, marginBottom: 12, fontFamily: "'Inter', sans-serif" }}>
                <span>Payout Eligibility Status</span>
                <span style={{ color: isEligible ? 'var(--lime)' : 'var(--ink)' }}>{isEligible ? 'ELIGIBLE' : `${user.points} / ${minWithdrawal}`}</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.02)' }}>
                <div style={{ width: `${progressPercent}%`, height: '100%', background: isEligible ? 'var(--lime)' : 'var(--slate)', borderRadius: 10 }}></div>
              </div>
            </div>
          </div>

          <div style={S.glassCard}>
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 16, marginBottom: 24 }}>
              <span style={{ ...S.label, marginBottom: 0, color: 'var(--ink)' }}>Secure Payout Terminal</span>
            </div>

            {lockedDestination ? (
               <div style={{ background: 'rgba(168,255,62,0.05)', border: '1px solid rgba(168,255,62,0.2)', padding: 16, borderRadius: 12, marginBottom: 24 }}>
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                   <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--lime)', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: "'Inter', sans-serif" }}>✓ Verified Destination</span>
                   <span style={{ fontSize: 16 }}>💳</span>
                 </div>
                 <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>{lockedDestination.payout_bank_name}</div>
                 <div style={{ fontSize: 13, color: 'var(--slate)', marginBottom: 2 }}>{lockedDestination.payout_account_name}</div>
                 <div style={{ fontSize: 14, color: 'var(--ink)', fontFamily: 'monospace', letterSpacing: '1px' }}>{lockedDestination.payout_account}</div>
               </div>
            ) : (
              <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: 16, borderRadius: 12, marginBottom: 24 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.5px', fontFamily: "'Inter', sans-serif" }}>⚠️ Setup Required</span>
                <div style={{ fontSize: 13, color: 'var(--slate)', marginTop: 8 }}>You must bind a payout account in your Profile or Task Network before withdrawing.</div>
              </div>
            )}

            <form onSubmit={handleWithdrawal}>
              <div>
                <label style={S.label}>Withdrawal Amount (PTS)</label>
                <input 
                  style={S.input} 
                  type="number" 
                  placeholder={`Available: ${user.points}`} 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)} 
                  max={user.points} 
                  min={minWithdrawal} 
                  disabled={!isEligible || !lockedDestination} 
                />
              </div>

              <button type="submit" disabled={!isEligible || submitting || !lockedDestination} style={isEligible && lockedDestination ? S.btnLime : S.btnDisabled}>
                {submitting ? 'Processing...' : isEligible && lockedDestination ? 'Initiate Transfer' : 'Transfer Locked'}
              </button>

              <div style={{ fontSize: 12, color: 'var(--slate)', textAlign: 'center', marginTop: 14, fontWeight: 500 }}>
                ⏱️ Approved payouts are processed and disbursed within 24 hours.
              </div>
              
            </form>
          </div>
        </div>

        <div>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 700, color: 'var(--ink)', margin: '0 0 24px 0', letterSpacing: '-0.5px' }}>Transaction Ledger</h2>
          
          {withdrawals.length === 0 ? (
            <div style={{ ...S.glassCard, padding: 48, textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--slate)', letterSpacing: '0.5px' }}>No transaction history found on this account.</div>
            </div>
          ) : (
            <div style={{ background: 'var(--surface-card)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 20, overflowX: 'auto', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
              
              <div style={{ minWidth: 600 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1.5fr 1fr', gap: 16, padding: '16px 24px', background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={S.label}>Date</span>
                  <span style={S.label}>Destination</span>
                  <span style={{ ...S.label, textAlign: 'right' }}>Amount</span>
                  <span style={{ ...S.label, textAlign: 'right' }}>Status</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {withdrawals.map(function(item, index) {
                    const date = new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                    const isLast = index === withdrawals.length - 1;
                    
                    // 🔥 Calculate the cash value for THIS specific past transaction 🔥
                    const fiatValue = (item.amount * conversionRate).toFixed(2);
                    
                    return (
                      <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr 1.5fr 1fr', gap: 16, padding: '20px 24px', borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                        
                        <div style={{ fontSize: 13, color: 'var(--slate)', fontWeight: 500 }}>{date}</div>
                        
                        <div>
                          <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 600, marginBottom: 4 }}>{item.bank_name}</div>
                          <div style={{ fontSize: 12, color: 'var(--slate)', fontFamily: 'monospace', letterSpacing: '1px' }}>****{item.account_number?.slice(-4) || 'XXXX'}</div>
                        </div>
                        
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', fontFamily: "'Inter', sans-serif" }}>
                            {item.amount.toLocaleString()} <span style={{ fontSize: 11, color: 'var(--slate)', fontWeight: 600 }}>PTS</span>
                          </div>
                          {/* 🔥 NEW: Exact USD Value rendered in the ledger row 🔥 */}
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--lime)', marginTop: 2, fontFamily: "'Inter', sans-serif" }}>
                            ≈ ${fiatValue}
                          </div>
                        </div>
                        
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ ...S.statusBadge(item.status), fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '1px', display: 'inline-block', fontFamily: "'Inter', sans-serif" }}>
                            {item.status}
                          </span>
                        </div>
                        
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
