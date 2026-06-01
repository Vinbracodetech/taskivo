import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function History({ session }) {
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('engagements'); // 'engagements' | 'wallet'
  const [historyData, setHistoryData] = useState([]);

  const isCreator = user?.role === 'creator';

  useEffect(() => {
    if (user?.id) fetchHistory();
  }, [user, activeTab]);

  async function fetchHistory() {
    try {
      setLoading(true);
      setHistoryData([]); 

      if (activeTab === 'engagements') {
        if (isCreator) {
          // ── CREATOR LOGIC: Fetch campaigns they deployed ──
          const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('creator_id', user.id)
            .order('created_at', { ascending: false })
            .limit(50);
          if (!error && data) setHistoryData(data.map(d => ({ ...d, _recordType: 'creator_deploy' })));
          
        } else {
          // ── EARNER LOGIC: UNIFIED TIMELINE MERGE ──
          
          const [compRes, blogRes, spinRes] = await Promise.allSettled([
            supabase.from('completions').select(`id, created_at, platform, status, tasks ( title, reward_points )`).eq('user_id', user.id).order('created_at', { ascending: false }).limit(50),
            supabase.from('blog_reads').select(`id, created_at, post_slug`).eq('user_id', user.id).order('created_at', { ascending: false }).limit(50),
            supabase.from('daily_spins').select(`id, created_at, reward_points`).eq('user_id', user.id).order('created_at', { ascending: false }).limit(50)
          ]);

          let mergedTimeline = [];

          // 1. Inject Standard & Premium Campaigns (with accurate tags & icons)
          if (compRes.status === 'fulfilled' && compRes.value.data) {
            mergedTimeline.push(...compRes.value.data.map(d => {
              let icon = '▶️';
              let platformTag = 'Video View';
              let typeColor = 'rgba(255,255,255,0.05)';
              
              if (d.platform === 'blog') { 
                icon = '📄'; platformTag = 'SEO Dwell'; 
              } else if (d.platform === 'ugc') { 
                icon = '📸'; platformTag = 'UGC Escrow'; typeColor = '#D4AF37'; 
              } else if (d.platform === 'qa_testing') { 
                icon = '🛠️'; platformTag = 'App QA Test'; typeColor = '#D4AF37'; 
              }

              return {
                id: d.id,
                created_at: d.created_at,
                _recordType: 'client_task',
                _platform: d.platform, // Store the exact platform for UI checks
                _title: d.tasks?.title || 'Verified Campaign Task',
                _pts: d.tasks?.reward_points || 0,
                _icon: icon,
                _tagText: platformTag,
                _typeColor: typeColor,
                _status: d.status || 'completed'
              };
            }));
          }

          // 2. Inject Internal Blog Reads
          if (blogRes.status === 'fulfilled' && blogRes.value.data) {
            mergedTimeline.push(...blogRes.value.data.map(d => ({
              id: d.id,
              created_at: d.created_at,
              _recordType: 'official_blog',
              _title: `Taskivo Intel: ${d.post_slug.replace(/-/g, ' ')}`,
              _pts: 10,
              _icon: '📄'
            })));
          }

          // 3. Inject Daily Spins
          if (spinRes.status === 'fulfilled' && spinRes.value.data) {
            mergedTimeline.push(...spinRes.value.data.map(d => ({
              id: d.id,
              created_at: d.created_at,
              _recordType: 'daily_spin',
              _title: 'Daily Wheel Spin Bonus',
              _pts: d.reward_points || d.points || d.amount || 0, 
              _icon: '🎡'
            })));
          }

          // Sort the entire merged array by exact date & time
          mergedTimeline.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

          // Keep the top 50 most recent actions
          setHistoryData(mergedTimeline.slice(0, 50));
        }
      } else if (activeTab === 'wallet') {
        if (isCreator) {
          const { data, error } = await supabase.from('transactions').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
          if (!error && data) setHistoryData(data);
        } else {
          const { data, error } = await supabase.from('withdrawals').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
          if (!error && data) setHistoryData(data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch ledger", err);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(isoString) {
    if (!isoString) return 'Processing...';
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      }).format(date);
    } catch (e) {
      return 'Unknown Date';
    }
  }

  const S = {
    // 🔥 BRIGHTER, VISIBLE ISOMETRIC BACKGROUND 🔥
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
    page: { padding: '40px 5%', maxWidth: 800, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", position: 'relative' },
    headerWrap: { marginBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 24 },
    tabWrap: { display: 'flex', gap: 8, marginBottom: 40, background: 'var(--surface-card)', padding: 6, borderRadius: 100, border: '1px solid rgba(255,255,255,0.05)', width: 'fit-content', flexWrap: 'wrap', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' },
    tab: (isActive) => ({
      padding: '10px 24px', borderRadius: 100, fontSize: 13, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Inter', sans-serif",
      background: isActive ? 'var(--lime)' : 'transparent',
      color: isActive ? '#000' : 'var(--slate)',
      border: 'none', flex: 1, textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.5px'
    }),
    timelineWrap: { display: 'flex', flexDirection: 'column', gap: 16 },
    card: (typeColor) => ({ 
      background: 'var(--surface-card)', border: '1px solid rgba(255,255,255,0.03)', borderLeft: `4px solid ${typeColor}`,
      borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)', backdropFilter: 'blur(10px)'
    }),
    iconBox: (bgColor) => ({ width: 44, height: 44, borderRadius: 12, background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }),
    title: { fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 6, fontFamily: "'Inter', sans-serif", lineHeight: 1.3 },
    date: { fontSize: 11, color: 'var(--slate)', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' },
    points: { fontSize: 18, fontWeight: 800, fontFamily: "'Inter', sans-serif", textAlign: 'right' },
    status: { fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginTop: 4, textAlign: 'right' }
  };

  return (
    <div style={S.pageWrapper}>
      <div style={S.page}>
        <div style={S.headerWrap}>
          <h1 style={{ fontSize: 32, color: 'var(--ink)', fontWeight: 800, fontFamily: "'Inter', sans-serif", marginBottom: 8, letterSpacing: '-0.5px' }}>
            Activity <span style={{ color: 'var(--lime)' }}>Ledger</span>
          </h1>
          <p style={{ color: 'var(--slate)', fontSize: 15 }}>An immutable record of your network engagements and financial yields.</p>
        </div>

        <div style={S.tabWrap}>
          <button style={S.tab(activeTab === 'engagements')} onClick={() => setActiveTab('engagements')}>
            {isCreator ? 'Deployments' : 'Engagements'}
          </button>
          <button style={S.tab(activeTab === 'wallet')} onClick={() => setActiveTab('wallet')}>
            {isCreator ? 'Billing' : 'Transactions'}
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--slate)', fontSize: 14 }}>
            <div style={{ width: 32, height: 32, border: '2px solid var(--line)', borderTopColor: 'var(--lime)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
            <div style={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>Decrypting ledger blocks...</div>
          </div>
        ) : historyData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', background: 'var(--surface-card)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24, color: 'var(--slate)', backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', fontFamily: "'Inter', sans-serif" }}>No Records Found</div>
            <div style={{ fontSize: 14, color: 'var(--slate)', marginTop: 8 }}>This section of the ledger is currently empty.</div>
          </div>
        ) : (
          <div style={S.timelineWrap}>
            {historyData.map((item, index) => {
              
              // ── TAB 1: ENGAGEMENTS / DEPLOYMENTS ──
              if (activeTab === 'engagements') {
                if (isCreator) {
                  const title = item.title || 'Untitled Campaign';
                  const views = item.target_views || 0;
                  
                  return (
                    <div key={item.id || index} style={S.card('var(--lime)')}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={S.iconBox('var(--lime-dim)')}>🚀</div>
                        <div>
                          <div style={{ fontSize: 10, color: 'var(--lime)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4, letterSpacing: '0.5px' }}>Campaign Deployed</div>
                          <div style={S.title}>{title}</div>
                          <div style={S.date}>{formatDate(item.created_at)}</div>
                        </div>
                      </div>
                      <div>
                        <div style={{ ...S.points, color: 'var(--ink)' }}>{views === 999999 ? 'UNLIMITED' : views.toLocaleString()} <span style={{ fontSize: 12, color: 'var(--slate)', fontWeight: 600 }}>VIEWS</span></div>
                        <div style={{ ...S.status, color: 'var(--lime)' }}>Active ✓</div>
                      </div>
                    </div>
                  );
                } else {
                  // EARNER UNIFIED RENDERER
                  let typeColor = item._typeColor || 'rgba(255,255,255,0.1)';
                  let bgColor = 'var(--surface)';
                  let tagText = item._tagText || 'Verified Task';
                  let tagColor = 'var(--slate)';
                  
                  let statusColor = 'var(--slate)';
                  let statusText = 'Credited ✓';

                  if (item._recordType === 'official_blog') {
                    typeColor = '#A8FF3E'; // Lime
                    bgColor = 'var(--lime-dim)';
                    tagText = 'Official Article';
                    tagColor = 'var(--lime)';
                  } else if (item._recordType === 'daily_spin') {
                    typeColor = '#D4AF37'; // Gold
                    bgColor = 'rgba(212,175,55,0.1)';
                    tagText = 'Daily Reward';
                    tagColor = '#D4AF37';
                  }

                  // 🔥 STRICT MANUAL VERIFICATION UI CHECK 🔥
                  if (item._recordType === 'client_task') {
                     const isManualTask = item._platform === 'ugc' || item._platform === 'qa_testing';
                     
                     if (isManualTask && item._status === 'pending') {
                       statusText = 'IN REVIEW ⏱️';
                       statusColor = '#fbbf24';
                     } else if (isManualTask && item._status === 'rejected') {
                       statusText = 'REJECTED ✕';
                       statusColor = '#ef4444';
                     } else {
                       // For Videos and Blogs, ALWAYS force Credited ✓
                       statusText = 'CREDITED ✓';
                       statusColor = 'var(--slate)';
                     }
                  }
                  
                  return (
                    <div key={item.id || index} style={S.card(typeColor)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={S.iconBox(bgColor)}>{item._icon}</div>
                        <div>
                          <div style={{ fontSize: 10, color: tagColor, fontWeight: 800, textTransform: 'uppercase', marginBottom: 4, letterSpacing: '0.5px' }}>{tagText}</div>
                          <div style={S.title} className="text-truncate" style={{ maxWidth: 220 }}>{item._title}</div>
                          <div style={S.date}>{formatDate(item.created_at)}</div>
                        </div>
                      </div>
                      <div>
                        <div style={{ ...S.points, color: 'var(--ink)' }}>+{item._pts} <span style={{ fontSize: 12, color: 'var(--slate)', fontWeight: 600 }}>PTS</span></div>
                        <div style={{ ...S.status, color: statusColor }}>{statusText}</div>
                      </div>
                    </div>
                  );
                }
              }

              // ── TAB 2: WALLET / TRANSACTIONS ──
              if (activeTab === 'wallet') {
                if (isCreator) {
                   const rawAmount = item.amount || 0; 
                   const isGrant = rawAmount === 0;
                   
                   return (
                     <div key={item.id || index} style={S.card('#D4AF37')}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                         <div style={S.iconBox('rgba(212,175,55,0.1)')}>💳</div>
                         <div>
                           <div style={{ fontSize: 10, color: '#D4AF37', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4, letterSpacing: '0.5px' }}>{isGrant ? 'Platform Grant' : 'Fiat Deposit'}</div>
                           <div style={S.title}>{isGrant ? 'Pilot Program Redemption' : 'Campaign Purchase (Paystack)'}</div>
                           <div style={S.date}>{formatDate(item.created_at)}</div>
                         </div>
                       </div>
                       <div>
                         <div style={{ ...S.points, color: 'var(--ink)' }}>
                           {isGrant ? 'FREE' : `- ₦${rawAmount.toLocaleString()}`}
                         </div>
                         <div style={{ ...S.status, color: 'var(--lime)' }}>Settled ✓</div>
                       </div>
                     </div>
                   );
                } else {
                   const amount = item.amount || 0;
                   const status = item.status || 'pending';
                   
                   let statusColor = 'var(--slate)';
                   let statusText = status;
                   let borderColor = 'rgba(255,255,255,0.1)';
                   
                   if (status === 'completed' || status === 'approved') { 
                     statusColor = 'var(--lime)'; 
                     statusText = 'SETTLED ✓'; 
                     borderColor = 'var(--lime)';
                   }
                   else if (status === 'rejected') { 
                     statusColor = '#ef4444'; 
                     statusText = 'REJECTED ✕'; 
                     borderColor = '#ef4444';
                   }
                   else { 
                     statusColor = '#fbbf24'; 
                     statusText = 'PROCESSING ⏱️'; 
                     borderColor = '#fbbf24';
                   }

                   return (
                     <div key={item.id || index} style={S.card(borderColor)}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                         <div style={S.iconBox('var(--surface)')}>🏦</div>
                         <div>
                           <div style={{ fontSize: 10, color: 'var(--slate)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4, letterSpacing: '0.5px' }}>Liquidity Event</div>
                           <div style={S.title}>Fiat Withdrawal Request</div>
                           <div style={S.date}>{formatDate(item.created_at)}</div>
                         </div>
                       </div>
                       <div>
                         <div style={{ ...S.points, color: 'var(--ink)' }}>-{amount.toLocaleString()} <span style={{ fontSize: 12, color: 'var(--slate)', fontWeight: 600 }}>PTS</span></div>
                         <div style={{ ...S.status, color: statusColor }}>{statusText}</div>
                       </div>
                     </div>
                   );
                }
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
}
