import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const C = {
  surface: 'var(--surface)',
  card: 'var(--surface-card)',
  input: 'var(--surface-card)',
  textMain: 'var(--ink)',
  textMuted: 'var(--slate)',
  textInvert: 'var(--surface)',
  line: 'var(--line)',
  lime: '#A8FF3E',           
  limeText: 'var(--lime)',   
  limeDim: 'var(--lime-dim)',
  shadow: 'var(--shadow)',
  red: '#ef4444',
  orange: '#f59e0b'
};

export default function Wallet({ user, navigate, showToast }) {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('withdraw'); 
  
  const [withdrawPoints, setWithdrawPoints] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const MIN_WITHDRAWAL = 2000; 
  const POINTS_PER_DOLLAR = 1500; 

  useEffect(function() {
    if (!user) return;
    fetchHistory();
  }, [user]);

  async function fetchHistory() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('withdrawals').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      if (showToast) showToast('Failed to load transaction history', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleWithdrawal(e) {
    e.preventDefault();
    const pointsToWithdraw = parseInt(withdrawPoints);

    if (!pointsToWithdraw || pointsToWithdraw < MIN_WITHDRAWAL) {
      if (showToast) showToast(`Minimum withdrawal is ${MIN_WITHDRAWAL} points.`, 'error');
      return;
    }
    if (pointsToWithdraw > user.points) {
      if (showToast) showToast('Insufficient points balance.', 'error');
      return;
    }
    if (!paymentDetails.trim()) {
      if (showToast) showToast('Please enter your payment details.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const estimatedValue = pointsToWithdraw / POINTS_PER_DOLLAR;
      const { error: insertError } = await supabase.from('withdrawals').insert([{
        user_id: user.id, points: pointsToWithdraw, estimated_value: estimatedValue, payment_method: paymentMethod, payment_details: paymentDetails, status: 'pending'
      }]);
      if (insertError) throw insertError;

      const { error: updateError } = await supabase.from('profiles').update({ points: user.points - pointsToWithdraw }).eq('id', user.id);
      if (updateError) throw updateError;

      if (showToast) showToast('Withdrawal request submitted successfully!', 'success');
      setWithdrawPoints('');
      setPaymentDetails('');
      setTimeout(function() { window.location.reload(); }, 1500);
    } catch (err) {
      if (showToast) showToast('Failed to process withdrawal.', 'error');
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div style={{ padding: '60px 5%', textAlign: 'center', color: C.textMuted }}>Loading wallet...</div>;
  }

  const progressPercent = Math.min((user.points / MIN_WITHDRAWAL) * 100, 100);
  const isEligible = user.points >= MIN_WITHDRAWAL;
  const currentFiatValue = (user.points / POINTS_PER_DOLLAR).toFixed(2);
  const requestedFiatValue = withdrawPoints ? (parseInt(withdrawPoints) / POINTS_PER_DOLLAR).toFixed(2) : '0.00';

  return (
    <div style={{ padding: '40px 5%', maxWidth: 800, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", paddingBottom: 120 }}>
      <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 28, color: C.textMain, marginBottom: 8, fontWeight: 800 }}>Wallet</h1>
          <p style={{ color: C.textMuted, fontSize: 15 }}>Manage your earnings and request payouts.</p>
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 32, marginBottom: 40, boxShadow: C.shadow }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Available Balance</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 48, fontWeight: 800, color: C.limeText, lineHeight: 1 }}>{user.points.toLocaleString()}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.textMuted }}>PTS</div>
            </div>
            <div style={{ fontSize: 14, color: C.textMuted, marginTop: 8 }}>≈ ${currentFiatValue} USD</div>
          </div>
          <div style={{ background: isEligible ? C.limeDim : C.input, border: `1px solid ${C.line}`, borderRadius: 12, padding: '16px 24px', textAlign: 'center', minWidth: 180 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: isEligible ? C.limeText : C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
              {isEligible ? 'Status: Eligible' : 'Status: Locked'}
            </div>
            <div style={{ fontSize: 14, color: isEligible ? C.limeText : C.textMain, fontWeight: 600 }}>
              {isEligible ? 'Ready for payout' : `${MIN_WITHDRAWAL - user.points} PTS to go`}
            </div>
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.textMuted, marginBottom: 8, fontWeight: 600 }}>
            <span>Payout Threshold</span>
            <span>{MIN_WITHDRAWAL.toLocaleString()} PTS (≈ ${(MIN_WITHDRAWAL / POINTS_PER_DOLLAR).toFixed(2)})</span>
          </div>
          <div style={{ height: 8, background: C.input, borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: C.limeText, borderRadius: 10, transition: 'width 1s ease-in-out' }}></div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 32, borderBottom: `1px solid ${C.line}` }}>
        <button onClick={function() { setActiveTab('withdraw'); }} style={{ background: 'transparent', border: 'none', borderBottom: `2px solid ${activeTab === 'withdraw' ? C.limeText : 'transparent'}`, color: activeTab === 'withdraw' ? C.textMain : C.textMuted, padding: '0 16px 12px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Request Payout</button>
        <button onClick={function() { setActiveTab('history'); }} style={{ background: 'transparent', border: 'none', borderBottom: `2px solid ${activeTab === 'history' ? C.limeText : 'transparent'}`, color: activeTab === 'history' ? C.textMain : C.textMuted, padding: '0 16px 12px', fontSize: 15, fontWeight: 600, cursor: 'pointer' }}>Transaction History</button>
      </div>

      {activeTab === 'withdraw' && (
        <form onSubmit={handleWithdrawal} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 24, boxShadow: C.shadow }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>1. Points to Withdraw</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <input type="number" value={withdrawPoints} onChange={function(e) { setWithdrawPoints(e.target.value); }} placeholder={`Min. ${MIN_WITHDRAWAL}`} min={MIN_WITHDRAWAL} max={user.points} disabled={!isEligible} style={{ flex: 1, padding: '16px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.input, color: C.textMain, fontSize: 16, outline: 'none', opacity: isEligible ? 1 : 0.5 }} />
              <div style={{ fontSize: 18, color: C.textMuted, fontWeight: 600 }}>≈ ${requestedFiatValue}</div>
            </div>
            {!isEligible && <div style={{ color: C.orange, fontSize: 13, marginTop: 12 }}>You must reach {MIN_WITHDRAWAL} points before you can request a payout.</div>}
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 24, boxShadow: C.shadow, opacity: isEligible ? 1 : 0.5, pointerEvents: isEligible ? 'auto' : 'none' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>2. Payment Destination</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: 20 }}>
              {['paypal', 'crypto', 'bank'].map(function(method) {
                const isSelected = paymentMethod === method;
                return (
                  <div key={method} onClick={function() { setPaymentMethod(method); }} style={{ padding: '12px', textAlign: 'center', border: `1px solid ${isSelected ? C.limeText : C.line}`, borderRadius: 8, background: isSelected ? C.limeDim : C.input, color: isSelected ? C.limeText : C.textMuted, fontSize: 14, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize' }}>
                    {method}
                  </div>
                );
              })}
            </div>
            <input type="text" value={paymentDetails} onChange={function(e) { setPaymentDetails(e.target.value); }} placeholder={paymentMethod === 'paypal' ? 'PayPal Email Address' : paymentMethod === 'crypto' ? 'USDT (TRC20) Wallet Address' : 'Bank Name & Account Number'} style={{ width: '100%', padding: '16px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.input, color: C.textMain, fontSize: 15, outline: 'none' }} />
          </div>

          <button type="submit" disabled={submitting || !isEligible} style={{ background: (!isEligible || submitting) ? C.input : C.lime, color: (!isEligible || submitting) ? C.textMuted : '#000000', border: `1px solid ${C.line}`, borderRadius: 8, padding: '16px', fontSize: 15, fontWeight: 800, cursor: (!isEligible || submitting) ? 'not-allowed' : 'pointer' }}>
            {submitting ? 'Processing Request...' : 'Submit Withdrawal Request'}
          </button>
        </form>
      )}

      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {history.length === 0 ? (
            <div style={{ background: C.card, border: `1px dashed ${C.line}`, borderRadius: 12, padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.textMain, marginBottom: 8 }}>No transactions yet</div>
            </div>
          ) : (
            history.map(function(item) {
              const date = new Date(item.created_at).toLocaleDateString();
              let statusColor = C.textMuted;
              if (item.status === 'pending') statusColor = C.orange;
              if (item.status === 'approved') statusColor = C.limeText;
              if (item.status === 'rejected') statusColor = C.red;
              return (
                <div key={item.id} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 20, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', boxShadow: C.shadow }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.textMain, marginBottom: 4 }}>{item.points.toLocaleString()} PTS</div>
                    <div style={{ fontSize: 13, color: C.textMuted }}>${Number(item.estimated_value).toFixed(2)} • {item.payment_method.toUpperCase()}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ background: C.input, color: statusColor, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', marginBottom: 6 }}>{item.status}</div>
                    <div style={{ fontSize: 12, color: C.textMuted }}>{date}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
