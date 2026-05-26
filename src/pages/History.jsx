import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function History({ session }) {
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('engagements'); // 'engagements' | 'wallet'
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    if (user?.id) fetchHistory();
  }, [user, activeTab]);

  async function fetchHistory() {
    try {
      setLoading(true);

      if (activeTab === 'engagements') {
        // Fetch completed tasks
        const { data, error } = await supabase
          .from('completions')
          .select(`
            id, 
            created_at, 
            platform,
            tasks ( title, reward_points )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (!error && data) {
          setHistoryData(data);
        }
      } else {
        // Fetch financial transactions (Placeholder for future Paystack/Withdrawal logs)
        // For now, we'll fetch profile updates or create a mock structure so the UI is ready
        setHistoryData([
          { id: '1', type: 'daily_spin', amount: 5, date: new Date().toISOString(), status: 'completed' },
          { id: '2', type: 'signup_bonus', amount: 50, date: new Date(Date.now() - 86400000).toISOString(), status: 'completed' }
        ]);
      }
    } catch (err) {
      console.error("Failed to fetch ledger", err);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(isoString) {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(date);
  }

  const S = {
    page: { padding: '40px 5%', maxWidth: 800, margin: '0 auto', fontFamily: "var(--font-body)", minHeight: '80vh' },
    headerWrap: { marginBottom: 32, borderBottom: '1px solid var(--line)', paddingBottom: 24 },
    tabWrap: { display: 'flex', gap: 12, marginBottom: 32, background: 'var(--surface-card)', padding: 6, borderRadius: 12, border: '1px solid var(--line)', width: 'fit-content' },
    tab: (isActive) => ({
      padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "var(--font-display)",
      background: isActive ? 'var(--ink)' : 'transparent',
      color: isActive ? 'var(--surface)' : 'var(--slate)',
      border: 'none'
    }),
    timelineWrap: { display: 'flex', flexDirection: 'column', gap: 16 },
    card: { background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, transition: 'transform 0.2s' },
    iconBox: { width: 44, height: 44, borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 },
    title: { fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 4, fontFamily: "var(--font-display)" },
    date: { fontSize: 12, color: 'var(--slate)', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' },
    points: { fontSize: 16, fontWeight: 800, color: 'var(--lime)', fontFamily: "var(--font-display)", textAlign: 'right' },
    status: { fontSize: 10, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: 4, textAlign: 'right' }
  };

  return (
    <div style={S.page}>
      <div style={S.headerWrap}>
        <h1 style={{ fontSize: 32, color: 'var(--ink)', fontWeight: 800, fontFamily: "var(--font-display)", marginBottom: 8, letterSpacing: '-0.5px' }}>
          Activity <span style={{ color: 'var(--lime)' }}>Ledger</span>
        </h1>
        <p style={{ color: 'var(--slate)' }}>An immutable record of your network engagements and financial yields.</p>
      </div>

      <div style={S.tabWrap}>
        <button style={S.tab(activeTab === 'engagements')} onClick={() => setActiveTab('engagements')}>
          Network Engagements
        </button>
        <button style={S.tab(activeTab === 'wallet')} onClick={() => setActiveTab('wallet')}>
          Wallet Transactions
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--slate)', fontSize: 14 }}>
          <div style={{ width: 24, height: 24, border: '2px solid var(--line)', borderTopColor: 'var(--lime)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
          Decrypting ledger blocks...
        </div>
      ) : historyData.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'var(--surface-card)', border: '1px dashed var(--line)', borderRadius: 16, color: 'var(--slate)' }}>
          No records found in this ledger.
        </div>
      ) : (
        <div style={S.timelineWrap}>
          {historyData.map((item) => {
            
            // Logic for Network Engagements Tab
            if (activeTab === 'engagements') {
              const taskTitle = item.tasks?.title || 'Verified Campaign Task';
              const pts = item.tasks?.reward_points || 0;
              const isBlog = item.platform === 'blog';
              
              return (
                <div key={item.id} style={S.card}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={S.iconBox}>{isBlog ? '📄' : '▶️'}</div>
                    <div>
                      <div style={S.title}>{taskTitle}</div>
                      <div style={S.date}>{formatDate(item.created_at)}</div>
                    </div>
                  </div>
                  <div>
                    <div style={S.points}>+{pts} PTS</div>
                    <div style={S.status}>Verified ✓</div>
                  </div>
                </div>
              );
            }

            // Logic for Wallet Transactions Tab
            const isDeposit = item.type === 'daily_spin' || item.type === 'signup_bonus';
            const icon = item.type === 'daily_spin' ? '🎰' : '🎁';
            const title = item.type === 'daily_spin' ? 'Cryptographic Extraction' : 'Network Induction Grant';

            return (
              <div key={item.id} style={S.card}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={S.iconBox}>{icon}</div>
                  <div>
                    <div style={S.title}>{title}</div>
                    <div style={S.date}>{formatDate(item.date)}</div>
                  </div>
                </div>
                <div>
                  <div style={{ ...S.points, color: isDeposit ? 'var(--lime)' : 'var(--ink)' }}>
                    {isDeposit ? '+' : '-'}{item.amount} PTS
                  </div>
                  <div style={S.status}>Settled ✓</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
