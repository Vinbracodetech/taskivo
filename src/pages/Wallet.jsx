import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Wallet({ user, navigate, showToast }) {
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ amount: '', bank_name: '', account_number: '', account_name: '' });

  const minWithdrawal = 2000;

  useEffect(() => {
    if (!user) return;
    fetchLedger();
  }, [user]);

  async function fetchLedger() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setWithdrawals(data || []);
      
      // Attempt to pre-fill their locked payout account if they have one
      const { data: profile } = await supabase
        .from('profiles')
        .select('payout_account')
        .eq('id', user.id)
        .single();
        
      if (profile?.payout_account) {
        setForm(prev => ({ ...prev, account_number: profile.payout_account }));
      }
      
    } catch (err) {
      if (showToast) showToast('Failed to sync transaction ledger', 'error');
    } finally {
      setLoading(false);
    }
  }

  function handleInput(e) {
    setForm(prev => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  async function handleWithdrawal(e) {
    e.preventDefault();
    const amountNum = parseInt(form.amount, 10);
    
    if (!amountNum || amountNum < minWithdrawal) {
      if (showToast) showToast(`Minimum withdrawal is ${minWithdrawal.toLocaleString()} PTS.`, 'error');
      return;
    }
    if (amountNum > user.points) {
      if (showToast) showToast('Insufficient liquidity.', 'error');
      return;
    }
    if (!form.bank_name || !form.account_number || !form.account_name) {
      if (showToast) showToast('All banking details are required.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      
      // 🚨 LAYER 3 SECURITY: Attempt to bind the payout account to this specific user 🚨
      const { error: bindError } = await supabase
        .from('profiles')
        .update({ payout_account: form.account_number })
        .eq('id', user.id);

      // If the database unique constraint blocks this, they are running multiple accounts
      if (bindError) {
        if (bindError.message.includes('unique') || bindError.code === '23505') {
           if (showToast) showToast('🚨 SECURITY ALERT: This payout account is already bound to another earner. Multiple accounts are strictly prohibited.', 'error');
           setSubmitting(false);
           return;
        } else {
           throw bindError; // Throw other random errors to the generic catch block
        }
      }

      // If the bind was successful, process the withdrawal normally
      const { error: insertError } = await supabase.from('withdrawals').insert({
        user_id: user.id, amount: amountNum, bank_name: form.bank_name, account_number: form.account_number, account_name: form.account_name, status: 'pending'
      });
      if (insertError) throw insertError;

      const { error: updateError } = await supabase.from('profiles').update({ points: user.points - amountNum }).eq('id', user.id);
      if (updateError) throw updateError;

      if (showToast) showToast('Payout successfully bound and submitted.', 'success');
      setForm({ amount: '', bank_name: '', account_number: form.account_number, account_name: '' });
      user.points -= amountNum; 
      fetchLedger();
    } catch (err) {
      if (showToast) showToast('Transaction failed. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '80px 5%', textAlign: 'center', color: 'var(--slate)', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
        <div style={{ width: 24, height: 24, border: '2px solid var(--line)', borderTopColor: 'var(--lime)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
        Syncing ledger data...
      </div>
    );
  }

  const progressPercent = Math.min((user.points / minWithdrawal) * 100, 100);
  const isEligible = user.points >= minWithdrawal;

  const S = {
    page: { padding: '40px 5%', maxWidth: 1040, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", position: 'relative' },
    glassCard: { background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 24, padding: 32, boxShadow: '0 16px 40px rgba(0,0,0,0.03)' },
    label: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--slate)', marginBottom: 8, display: 'block', fontFamily: "'Inter', sans-serif" },
    valueGlow: { fontFamily: "'Inter', sans-serif", fontSize: 56, fontWeight: 800, color: 'var(--ink)', lineHeight: 1 },
    input: { width: '100%', padding: '14px 16px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, color: 'var(--ink)', fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', marginBottom: 20 },
    btnLime: { width: '100%', background: 'var(--lime)', border: 'none', color: '#000', borderRadius: 12, padding: '16px', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px' },
    btnDisabled: { width: '100%', background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--slate)', borderRadius: 12, padding: '16px', fontSize: 14, fontWeight: 800, cursor: 'not-allowed', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px' },
    statusBadge: function(status) {
      if (status === 'approved') return { background: 'rgba(168,255,62,0.1)', color: 'var(--ink)', border: '1px solid rgba(168,255,62,0.3)' };
      if (status === 'rejected') return { background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' };
      return { background: 'var(--surface)', color: 'var(--ink)', border: '1px solid var(--line)' };
    }
  };

  return (
    <div style={S.page}>
      
      <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 32, color: 'var(--ink)', marginBottom: 8, fontWeight: 800, letterSpacing: '-0.5px' }}>Portfolio & Withdrawals</h1>
          <p style={{ color: 'var(--slate)', fontSize: 15, fontWeight: 400, margin: 0 }}>Manage your liquidity and request payouts.</p>
        </div>
        <button onClick={function() { navigate('user-dashboard'); }} style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: 8, padding: '8px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>← Return</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, marginBottom: 48 }}>
        
        <div style={{ ...S.glassCard, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={S.label}>Total Liquid Points</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 12, marginBottom: 8 }}>
              <div style={S.valueGlow}>{user.points.toLocaleString()}</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--lime)', letterSpacing: '1px' }}>PTS</div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--slate)', fontWeight: 500 }}>
              Minimum withdrawal threshold: {minWithdrawal.toLocaleString()} PTS
            </div>
          </div>

          <div style={{ marginTop: 48 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--slate)', fontWeight: 600, marginBottom: 12 }}>
              <span>Payout Eligibility Status</span>
              <span style={{ color: isEligible ? 'var(--lime)' : 'var(--ink)' }}>{isEligible ? 'ELIGIBLE' : `${user.points} / ${minWithdrawal}`}</span>
            </div>
            <div style={{ height: 6, background: 'var(--surface)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--line)' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: isEligible ? 'var(--lime)' : 'var(--slate)', borderRadius: 10 }}></div>
            </div>
          </div>
        </div>

        <div style={S.glassCard}>
          <div style={{ borderBottom: '1px solid var(--line)', paddingBottom: 16, marginBottom: 24 }}>
            <span style={{ ...S.label, marginBottom: 0, color: 'var(--ink)' }}>Secure Payout Terminal</span>
          </div>

          {/* 🔥 SECURITY NOTICE ADDED TO UI 🔥 */}
          <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: 12, borderRadius: 8, marginBottom: 20 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Security Lock Active</span>
            <div style={{ fontSize: 12, color: 'var(--slate)', marginTop: 4 }}>Payout accounts are permanently bound to your identity to prevent multi-account farming.</div>
          </div>

          <form onSubmit={handleWithdrawal}>
            <div>
              <label style={S.label}>Withdrawal Amount (PTS)</label>
              <input style={S.input} type="number" name="amount" placeholder={`Max available: ${user.points}`} value={form.amount} onChange={handleInput} max={user.points} min={minWithdrawal} disabled={!isEligible} />
            </div>

            <div>
              <label style={S.label}>Bank Name</label>
              <input style={S.input} type="text" name="bank_name" placeholder="e.g., Chase Bank, Zenith Bank" value={form.bank_name} onChange={handleInput} disabled={!isEligible} />
            </div>

            <div>
              <label style={S.label}>Account Number / Wallet ID</label>
              <input style={S.input} type="text" name="account_number" placeholder="Enter payout destination" value={form.account_number} onChange={handleInput} disabled={!isEligible} />
            </div>

            <div>
              <label style={S.label}>Account Holder Name</label>
              <input style={S.input} type="text" name="account_name" placeholder="Must match your registered identity" value={form.account_name} onChange={handleInput} disabled={!isEligible} />
            </div>

            <button type="submit" disabled={!isEligible || submitting} style={isEligible ? S.btnLime : S.btnDisabled}>
              {submitting ? 'Verifying Network...' : isEligible ? 'Initiate Transfer' : 'Insufficient Liquidity'}
            </button>
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
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1fr 1fr', gap: 16, padding: '16px 24px', background: 'var(--surface)', borderBottom: '1px solid var(--line)' }} className="hide-on-mobile">
              <span style={S.label}>Date</span>
              <span style={S.label}>Destination</span>
              <span style={{ ...S.label, textAlign: 'right' }}>Amount</span>
              <span style={{ ...S.label, textAlign: 'right' }}>Status</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {withdrawals.map(function(item, index) {
                const date = new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                const isLast = index === withdrawals.length - 1;
                
                return (
                  <div key={item.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, padding: '20px 24px', borderBottom: isLast ? 'none' : '1px solid var(--line)', alignItems: 'center' }}>
                    
                    <div style={{ fontSize: 13, color: 'var(--slate)', fontWeight: 500 }}>{date}</div>
                    
                    <div>
                      <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 600, marginBottom: 4 }}>{item.bank_name}</div>
                      <div style={{ fontSize: 12, color: 'var(--slate)', fontFamily: 'monospace', letterSpacing: '1px' }}>****{item.account_number.slice(-4) || item.account_number}</div>
                    </div>
                    
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', textAlign: 'left' }}>
                      {item.amount.toLocaleString()} <span style={{ fontSize: 11, color: 'var(--slate)', fontWeight: 600 }}>PTS</span>
                    </div>
                    
                    <div style={{ textAlign: 'left' }}>
                      <span style={{ ...S.statusBadge(item.status), fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '1px', display: 'inline-block' }}>
                        {item.status}
                      </span>
                    </div>
                    
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
