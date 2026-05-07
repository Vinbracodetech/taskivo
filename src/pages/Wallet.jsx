import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const C = {
  ink: '#0D0D14',
  lime: '#A8FF3E',
  limeDim: 'rgba(168,255,62,0.12)',
  white: '#ffffff',
  slate: '#8B8B9E',
  line: 'rgba(255,255,255,0.08)',
  card: 'rgba(255,255,255,0.03)',
  red: '#ef4444',
  orange: '#f59e0b'
};

export default function Wallet({ user, navigate, showToast }) {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('withdraw'); 
  
  // Withdrawal Form State
  const [withdrawPoints, setWithdrawPoints] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // THE NEW, CORRECTED MATH LOGIC
  const MIN_WITHDRAWAL = 2000; // Equals $1.33
  const POINTS_PER_DOLLAR = 1500; // 60 points = $0.04

  useEffect(function() {
    if (!user) return;
    fetchHistory();
  }, [user]);

  async function fetchHistory() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(data || []);
    } catch (err) {
      console.error(err);
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

      // 1. Create the pending withdrawal record
      const { error: insertError } = await supabase.from('withdrawals').insert([{
        user_id: user.id,
        points: pointsToWithdraw,
        estimated_value: estimatedValue, // Saves actual dollar value in DB
        payment_method: paymentMethod,
        payment_details: paymentDetails,
        status: 'pending'
      }]);

      if (insertError) throw insertError;

      // 2. Deduct points from the user's profile
      const { error: updateError } = await supabase.from('profiles')
        .update({ points: user.points - pointsToWithdraw })
        .eq('id', user.id);

      if (updateError) throw updateError;

      if (showToast) showToast('Withdrawal request submitted successfully!', 'success');
      
      setWithdrawPoints('');
      setPaymentDetails('');
      
      setTimeout(function() {
        window.location.reload();
      }, 1500);

    } catch (err) {
      console.error(err);
      if (showToast) showToast('Failed to process withdrawal.', 'error');
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '60px 5%', textAlign: 'center', color: C.slate, fontFamily: "'DM Sans', sans-serif" }}>
        Securely loading wallet...
      </div>
    );
  }

  const progressPercent = Math.min((user.points / MIN_WITHDRAWAL) * 100, 100);
  const isEligible = user.points >= MIN_WITHDRAWAL;
  const currentFiatValue = (user.points / POINTS_PER_DOLLAR).toFixed(2);
  const requestedFiatValue = withdrawPoints ? (parseInt(withdrawPoints) / POINTS_PER_DOLLAR).toFixed(2) : '0.00';

  return (
    <div style={{ padding: '40px 5%', maxWidth: 800, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", paddingBottom: 120 }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 28, color: C.white, marginBottom: 8, fontWeight: 800 }}>Wallet</h1>
          <p style={{ color: C.slate, fontSize: 15 }}>Manage your earnings and request payouts.</p>
        </div>
      </div>

      {/* BALANCE CARD */}
      <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 32, marginBottom: 40 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Available Balance</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 48, fontWeight: 800, color: C.lime, lineHeight: 1 }}>{user.points.toLocaleString()}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.slate }}>PTS</div>
            </div>
            <div style={{ fontSize: 14, color: C.slate, marginTop: 8 }}>≈ ${currentFiatValue} USD</div>
          </div>
          
          <div style={{ background: isEligible ? C.limeDim : 'rgba(255,255,255,0.05)', border: `1px solid ${isEligible ? 'rgba(168,255,62,0.3)' : C.line}`, borderRadius: 12, padding: '16px 24px', textAlign: 'center', minWidth: 180 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: isEligible ? C.lime : C.slate, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
              {isEligible ? 'Status: Eligible' : 'Status: Locked'}
            </div>
            <div style={{ fontSize: 14, color: C.white, fontWeight: 600 }}>
              {isEligible ? 'Ready for payout' : `${MIN_WITHDRAWAL - user.points} PTS to go`}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.slate, marginBottom: 8, fontWeight: 600 }}>
            <span>Payout Threshold</span>
            <span>{MIN_WITHDRAWAL.toLocaleString()} PTS (≈ ${(MIN_WITHDRAWAL / POINTS_PER_DOLLAR).toFixed(2)})</span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden' }}>
            <div style={{ width: `${progressPercent}%`, height: '100%', background: C.lime, borderRadius: 10, transition: 'width 1s ease-in-out' }}></div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, borderBottom: `1px solid ${C.line}` }}>
        <button 
          onClick={function() { setActiveTab('withdraw'); }}
          style={{ background: 'transparent', border: 'none', borderBottom: `2px solid ${activeTab === 'withdraw' ? C.lime : 'transparent'}`, color: activeTab === 'withdraw' ? C.white : C.slate, padding: '0 16px 12px', fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
        >
          Request Payout
        </button>
        <button 
          onClick={function() { setActiveTab('history'); }}
          style={{ background: 'transparent', border: 'none', borderBottom: `2px solid ${activeTab === 'history' ? C.lime : 'transparent'}`, color: activeTab === 'history' ? C.white : C.slate, padding: '0 16px 12px', fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
        >
          Transaction History
        </button>
      </div>

      {/* TAB CONTENT: WITHDRAW */}
      {activeTab === 'withdraw' && (
        <form onSubmit={handleWithdrawal} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.line}`, borderRadius: 12, padding: 24 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>1. Points to Withdraw</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input 
                  type="number" 
                  value={withdrawPoints} 
                  onChange={function(e) { setWithdrawPoints(e.target.value); }} 
                  placeholder={`Min. ${MIN_WITHDRAWAL}`}
                  min={MIN_WITHDRAWAL}
                  max={user.points}
                  disabled={!isEligible}
                  style={{ width: '100%', padding: '16px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.ink, color: C.white, fontSize: 16, fontFamily: "'DM Sans', sans-serif", outline: 'none', opacity: isEligible ? 1 : 0.5 }}
                />
              </div>
              <div style={{ fontSize: 18, color: C.slate, fontWeight: 600 }}>≈ ${requestedFiatValue}</div>
            </div>
            {!isEligible && <div style={{ color: C.orange, fontSize: 13, marginTop: 12 }}>You must reach {MIN_WITHDRAWAL} points before you can request a payout.</div>}
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${C.line}`, borderRadius: 12, padding: 24, opacity: isEligible ? 1 : 0.5, pointerEvents: isEligible ? 'auto' : 'none' }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>2. Payment Destination</label>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 12, marginBottom: 20 }}>
              {['paypal', 'crypto', 'bank'].map(function(method) {
                const isSelected = paymentMethod === method;
                return (
                  <div 
                    key={method}
                    onClick={function() { setPaymentMethod(method); }}
                    style={{ 
                      padding: '12px', textAlign: 'center', border: `1px solid ${isSelected ? C.lime : C.line}`, 
                      borderRadius: 8, background: isSelected ? C.limeDim : C.ink, color: isSelected ? C.lime : C.slate,
                      fontSize: 14, fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize'
                    }}
                  >
                    {method}
                  </div>
                );
              })}
            </div>

            <input 
              type="text" 
              value={paymentDetails} 
              onChange={function(e) { setPaymentDetails(e.target.value); }} 
              placeholder={paymentMethod === 'paypal' ? 'PayPal Email Address' : paymentMethod === 'crypto' ? 'USDT (TRC20) Wallet Address' : 'Bank Name & Account Number'}
              style={{ width: '100%', padding: '16px', borderRadius: 8, border: `1px solid ${C.line}`, background: C.ink, color: C.white, fontSize: 15, fontFamily: "'DM Sans', sans-serif", outline: 'none' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={submitting || !isEligible}
            style={{ 
              background: (!isEligible || submitting) ? 'rgba(168,255,62,0.2)' : C.lime, 
              color: (!isEligible || submitting) ? 'rgba(0,0,0,0.5)' : C.ink, 
              border: 'none', borderRadius: 8, padding: '16px', 
              fontSize: 15, fontWeight: 800, cursor: (!isEligible || submitting) ? 'not-allowed' : 'pointer', 
              fontFamily: "'Inter', sans-serif" 
            }}
          >
            {submitting ? 'Processing Request...' : 'Submit Withdrawal Request'}
          </button>
        </form>
      )}

      {/* TAB CONTENT: HISTORY */}
      {activeTab === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {history.length === 0 ? (
            <div style={{ background: C.card, border: `1px dashed ${C.line}`, borderRadius: 12, padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.white, marginBottom: 8 }}>No transactions yet</div>
              <div style={{ fontSize: 13, color: C.slate }}>Your payout history will appear here.</div>
            </div>
          ) : (
            history.map(function(item) {
              const date = new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
              
              let statusColor = C.slate;
              if (item.status === 'pending') statusColor = C.orange;
              if (item.status === 'approved') statusColor = C.lime;
              if (item.status === 'rejected') statusColor = C.red;

              return (
                <div key={item.id} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 20, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: C.white, marginBottom: 4 }}>{item.points.toLocaleString()} PTS</div>
                    <div style={{ fontSize: 13, color: C.slate }}>${Number(item.estimated_value).toFixed(2)} • {item.payment_method.toUpperCase()}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.05)', color: statusColor, fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                      {item.status}
                    </div>
                    <div style={{ fontSize: 12, color: C.slate }}>{date}</div>
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
