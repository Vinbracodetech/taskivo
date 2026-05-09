import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Dashboard({ user, navigate, showToast }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ completions: 0 });
  const [featuredTasks, setFeaturedTasks] = useState([]);
  const [referralCopied, setReferralCopied] = useState(false);

  useEffect(function() {
    if (!user) return;
    fetchDashboardData();
  }, [user]);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      const { count } = await supabase.from('completions').select('*', { count: 'exact', head: true }).eq('user_id', user.id);
      const { data: tasks } = await supabase.from('tasks').select('*').eq('status', 'active').limit(3);
      setStats({ completions: count || 0 });
      setFeaturedTasks(tasks || []);
    } catch (err) {
      if (showToast) showToast('Failed to sync dashboard', 'error');
    } finally {
      setLoading(false);
    }
  }

  function copyReferralLink() {
    navigator.clipboard.writeText(`https://taskivo.online/#auth?ref=${user.id}`);
    setReferralCopied(true);
    if (showToast) showToast('Invite link copied!', 'success');
    setTimeout(function() { setReferralCopied(false); }, 3000);
  }

  if (loading) {
    return (
      <div style={{ padding: '80px 5%', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
        <div style={{ width: 24, height: 24, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#A8FF3E', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
        Decrypting profile data...
      </div>
    );
  }

  const minWithdrawal = 2000;
  const progressPercent = Math.min((user.points / minWithdrawal) * 100, 100);

  // ── PREMIUM INLINE STYLES ──
  const S = {
    page: { padding: '40px 5%', maxWidth: 1040, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", position: 'relative' },
    glassCard: { background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 24, backdropFilter: 'blur(20px)', boxShadow: '0 32px 64px rgba(0,0,0,0.2)', padding: 32, display: 'flex', flexDirection: 'column' },
    premiumCard: { background: 'linear-gradient(145deg, #121216 0%, #08080A 100%)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: 24, padding: 32, boxShadow: '0 24px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' },
    label: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.4)', marginBottom: 16, display: 'block', fontFamily: "'Inter', sans-serif" },
    valueGlow: { fontFamily: "'Inter', sans-serif", fontSize: 48, fontWeight: 800, background: 'linear-gradient(to right, #fff, rgba(255,255,255,0.5))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1 },
    btnGhost: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: 12, padding: '12px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'inline-block', textAlign: 'center', fontFamily: "'Inter', sans-serif" },
    btnLime: { background: '#A8FF3E', border: 'none', color: '#000', borderRadius: 12, padding: '12px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', display: 'inline-block', textAlign: 'center', fontFamily: "'Inter', sans-serif", boxShadow: '0 8px 16px rgba(168,255,62,0.2)' },
  };

  return (
    <div style={S.page}>
      
      {/* BACKGROUND GLOW */}
      <div style={{ position: 'absolute', top: -100, left: '20%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(168,255,62,0.03) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* HEADER */}
      <div style={{ marginBottom: 48, position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 32, color: '#fff', marginBottom: 8, fontWeight: 800, letterSpacing: '-0.5px' }}>
          Welcome back, <span style={{ color: '#A8FF3E', textTransform: 'capitalize' }}>{user.full_name?.split(' ')[0] || 'Earner'}</span>.
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, fontWeight: 400 }}>Your engagement portfolio and network analytics.</p>
      </div>

      {/* STATS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 48, position: 'relative', zIndex: 1 }}>
        
        {/* BALANCE CARD */}
        <div style={S.glassCard}>
          <span style={S.label}>Available Balance</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 32, marginTop: 8 }}>
            <div style={S.valueGlow}>{user.points.toLocaleString()}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#A8FF3E', letterSpacing: '1px' }}>PTS</div>
          </div>
          <div style={{ marginTop: 'auto' }}>
            <button onClick={function() { navigate('wallet'); }} style={{ ...S.btnGhost, width: '100%' }}>Manage Portfolio</button>
          </div>
        </div>

        {/* PROGRESS CARD */}
        <div style={S.glassCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ ...S.label, marginBottom: 0 }}>Verified Engagements</span>
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 100, letterSpacing: '0.5px' }}>
              {stats.completions} LIFETIME
            </div>
          </div>
          
          <div style={{ marginTop: 24, marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginBottom: 12 }}>
              <span>Liquidity Target</span>
              <span style={{ color: '#fff' }}>{user.points} / {minWithdrawal}</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, rgba(168,255,62,0.5) 0%, #A8FF3E 100%)', borderRadius: 10, boxShadow: '0 0 10px rgba(168,255,62,0.5)' }}></div>
            </div>
          </div>

          <div style={{ marginTop: 'auto' }}>
            <button onClick={function() { navigate('tasks'); }} style={{ ...S.btnLime, width: '100%' }}>Acquire Tasks</button>
          </div>
        </div>
      </div>

      {/* LUXURY REFERRAL CARD */}
      <div style={{ ...S.premiumCard, marginBottom: 56, display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: '-50%', right: '-10%', width: 300, height: 300, background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        
        <div style={{ flex: '1 1 300px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid rgba(212, 175, 55, 0.5)', color: '#D4AF37', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>
            ✦ VIP Network Bonus
          </div>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, color: '#fff', marginBottom: 12, fontWeight: 800, letterSpacing: '-0.5px' }}>Expand Your Network. Earn 50 Points.</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 1.6, maxWidth: 500, margin: 0 }}>
            Distribute your unique cryptographic invite link. Upon a successful registration and first verified task completion from your referral, your account is instantly credited.
          </p>
        </div>
        
        <button onClick={copyReferralLink} style={{ position: 'relative', zIndex: 2, background: referralCopied ? 'rgba(255,255,255,0.1)' : 'rgba(212, 175, 55, 0.1)', color: referralCopied ? '#fff' : '#D4AF37', border: `1px solid ${referralCopied ? 'rgba(255,255,255,0.2)' : 'rgba(212, 175, 55, 0.4)'}`, borderRadius: 12, padding: '14px 28px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter', sans-serif", letterSpacing: '0.5px', transition: 'all 0.3s' }}>
          {referralCopied ? 'LINK COPIED TO CLIPBOARD ✓' : 'COPY SECURE LINK'}
        </button>
      </div>

      {/* TASK LIST (SLEEK ROWS INSTEAD OF CHUNKY CARDS) */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>Active Opportunities</h2>
          <span onClick={function() { navigate('tasks'); }} style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>View Directory →</span>
        </div>
        
        {featuredTasks.length === 0 ? (
          <div style={{ ...S.glassCard, padding: 60, alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px' }}>No active campaigns available at this moment.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {featuredTasks.map(function(task) {
              const isBlog = task.platform === 'blog';
              return (
                <div key={task.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, transition: 'background 0.2s' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                      {isBlog ? '📄' : '▶️'}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4, letterSpacing: '-0.2px' }}>{task.title}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{task.watch_duration}s Verification Required</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Yield</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: '#A8FF3E' }}>+{task.reward_points} PTS</div>
                    </div>
                    <button onClick={function() { navigate(`player/${task.id}`); }} style={{ ...S.btnGhost, padding: '10px 20px', fontSize: 12 }}>Initiate</button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
