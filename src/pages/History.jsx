import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function History({ session, navigate, showToast }) {
  const user = session?.user;
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) fetchHistory();
  }, [user]);

  async function fetchHistory() {
    try {
      setLoading(true);
      // Fetch all transactions for the logged-in user, newest first
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setTransactions(data);
    } catch (err) {
      if (showToast) showToast('Failed to load activity ledger', 'error');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Helper to format the transaction type into readable text
  function formatType(type) {
    const types = {
      'telegram_bonus': 'Community Bonus',
      'task_completion': 'Task Engagement',
      'withdrawal': 'Payout Request',
      'campaign_purchase': 'Campaign Deployment',
      'daily_spin': 'Daily Network Spin'
    };
    return types[type] || type.replace('_', ' ').toUpperCase();
  }

  // Helper to get the correct icon and color based on the transaction type
  function getTypeStyles(type, amount) {
    if (type === 'withdrawal' || amount < 0) {
      return { icon: '💸', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)' };
    }
    if (type === 'telegram_bonus') {
      return { icon: '✈️', color: '#0088cc', bg: 'rgba(0, 136, 204, 0.1)', border: 'rgba(0, 136, 204, 0.3)' };
    }
    return { icon: '⚡', color: 'var(--lime)', bg: 'rgba(168,255,62,0.1)', border: 'rgba(168,255,62,0.3)' };
  }

  const S = {
    pageWrapper: { minHeight: '100vh', backgroundColor: 'var(--surface)', padding: '40px 5%', fontFamily: "'DM Sans', sans-serif" },
    container: { maxWidth: 800, margin: '0 auto' },
    glassCard: { background: 'var(--surface-card)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24, padding: 32, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' },
    headerBox: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, flexWrap: 'wrap', gap: 16 },
    btnSecondary: { background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--ink)', borderRadius: 100, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' },
    transactionCard: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, marginBottom: 12, flexWrap: 'wrap', gap: 16 }
  };

  if (loading) {
    return (
      <div style={{ padding: '80px 5%', textAlign: 'center', color: 'var(--slate)', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
        <div style={{ width: 24, height: 24, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: 'var(--lime)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
        Decrypting ledger records...
      </div>
    );
  }

  return (
    <div style={S.pageWrapper}>
      <div style={S.container}>
        
        <div style={S.headerBox}>
          <div>
            <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 28, color: 'var(--ink)', margin: '0 0 8px', fontWeight: 800, letterSpacing: '-0.5px' }}>Activity Ledger</h1>
            <p style={{ color: 'var(--slate)', fontSize: 14, margin: 0 }}>An immutable record of your network earnings and payouts.</p>
          </div>
          <button onClick={() => navigate('dashboard')} style={S.btnSecondary}>← Return to Dashboard</button>
        </div>

        <div style={S.glassCard}>
          {transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--slate)' }}>
              <div style={{ fontSize: 40, marginBottom: 16 }}>🧾</div>
              <h3 style={{ fontSize: 18, color: 'var(--ink)', marginBottom: 8, fontFamily: "'Inter', sans-serif" }}>No Transactions Yet</h3>
              <p style={{ fontSize: 14, maxWidth: 300, margin: '0 auto' }}>Complete tasks or claim bonuses to start generating your network ledger.</p>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--slate)', marginBottom: 24 }}>Recent Activity</div>
              
              {transactions.map(tx => {
                const style = getTypeStyles(tx.type, tx.amount);
                const isPositive = tx.amount > 0 && tx.type !== 'withdrawal';
                const sign = isPositive ? '+' : '';

                return (
                  <div key={tx.id} style={S.transactionCard}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: style.bg, border: `1px solid ${style.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                        {style.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', fontFamily: "'Inter', sans-serif", marginBottom: 4 }}>
                          {formatType(tx.type)}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--slate)', fontWeight: 500 }}>
                          {new Date(tx.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: style.color, fontFamily: "'Inter', sans-serif", marginBottom: 4 }}>
                        {sign}{tx.amount} {tx.currency}
                      </div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '1px', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 100, display: 'inline-block' }}>
                        {tx.status}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
