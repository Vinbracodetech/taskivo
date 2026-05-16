import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { enforceDeviceFingerprint } from '../lib/security';

export default function Dashboard({ user, navigate, showToast }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ completions: 0 });
  const [featuredTasks, setFeaturedTasks] = useState([]);
  const [referralCopied, setReferralCopied] = useState(false);
  
  // 🔥 SMART LOCK STATES 🔥
  const [quotas, setQuotas] = useState({ videos: 0, blogs: 0 });
  const [cooldowns, setCooldowns] = useState({});

  useEffect(() => {
    if (!user) return;
    
    fetchDashboardData();
    
    // 🔥 SILENTLY TRIGGER THE DEVICE TRACKER 🔥
    enforceDeviceFingerprint(user.id);
    
  }, [user]);

  async function fetchDashboardData() {
    try {
      setLoading(true);
      
      const { count } = await supabase
        .from('completions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);
        
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', 'active')
        .limit(3);
        
      setStats({ completions: count || 0 });
      setFeaturedTasks(tasks || []);

      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const todayMidnight = new Date();
      todayMidnight.setHours(0, 0, 0, 0);

      const fetchDate = twentyFourHoursAgo < todayMidnight ? twentyFourHoursAgo : todayMidnight;

      const { data: history } = await supabase
        .from('completions')
        .select('task_id, platform, created_at')
        .eq('user_id', user.id)
        .gte('created_at', fetchDate.toISOString());

      let vCount = 0, bCount = 0;
      const cooldownMap = {};

      (history || []).forEach(h => {
        const completedAt = new Date(h.created_at);
        if (completedAt >= todayMidnight) {
          if (h.platform === 'blog') bCount++; 
          else vCount++;
        }
        if (completedAt >= twentyFourHoursAgo) {
          const hoursPassed = (new Date() - completedAt) / 3600000;
          cooldownMap[h.task_id] = Math.ceil(24 - hoursPassed);
        }
      });

      setQuotas({ videos: vCount, blogs: bCount });
      setCooldowns(cooldownMap);

    } catch (err) {
      if (showToast) showToast('Failed to sync dashboard', 'error');
    } finally {
      setLoading(false);
    }
  }

  function copyReferralLink() {
    navigator.clipboard.writeText(`${window.location.origin}/#auth?ref=${user.id}`);
    setReferralCopied(true);
    if (showToast) showToast('Invite link copied!', 'success');
    setTimeout(() => setReferralCopied(false), 3000);
  }

  if (loading) {
    return (
      <div style={{ padding: '80px 5%', textAlign: 'center', color: 'var(--slate)', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
        <div style={{ width: 24, height: 24, border: '2px solid var(--line)', borderTopColor: 'var(--lime)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
        Decrypting profile data...
      </div>
    );
  }

  const minWithdrawal = 2000;
  const progressPercent = Math.min(((user.points || 0) / minWithdrawal) * 100, 100);

  const S = {
    page: { padding: '40px 5%', maxWidth: 1040, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", position: 'relative' },
    glassCard: { background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column', boxShadow: '0 16px 40px rgba(0,0,0,0.03)' },
    premiumCard: { background: 'var(--surface-card)', border: '1px solid rgba(212, 175, 55, 0.4)', borderRadius: 24, padding: 32, boxShadow: '0 24px 48px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' },
    label: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--slate)', marginBottom: 16, display: 'block', fontFamily: "'Inter', sans-serif" },
    valueGlow: { fontFamily: "'Inter', sans-serif", fontSize: 48, fontWeight: 800, color: 'var(--ink)', lineHeight: 1 },
    btnGhost: { background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: 12, padding: '12px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-block', textAlign: 'center', fontFamily: "'Inter', sans-serif" },
    btnLime: { background: 'var(--lime)', border: 'none', color: '#000', borderRadius: 12, padding: '12px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'inline-block', textAlign: 'center', fontFamily: "'Inter', sans-serif", boxShadow: '0 8px 16px rgba(168,255,62,0.2)' },
    btnLocked: { background: 'rgba(255,255,255,0.05)', color: 'var(--slate)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 20px', fontSize: 12, fontWeight: 700, cursor: 'not-allowed', fontFamily: "'Inter', sans-serif" }
  };

  return (
    <div style={S.page}>
      
      {/* HEADER */}
      <div style={{ marginBottom: 32, position: 'relative', zIndex: 1 }}>
        <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 32, color: 'var(--ink)', marginBottom: 8, fontWeight: 800, letterSpacing: '-0.5px' }}>
          Welcome back, <span style={{ color: 'var(--lime)', textTransform: 'capitalize' }}>{user.full_name?.split(' ')[0] || 'Earner'}</span>.
        </h1>
        <p style={{ color: 'var(--slate)', fontSize: 15, fontWeight: 400 }}>Your engagement portfolio and network analytics.</p>
      </div>

      {/* STATS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 48, position: 'relative', zIndex: 1 }}>
        <div style={S.glassCard}>
          <span style={S.label}>Available Balance</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 32, marginTop: 8 }}>
            <div style={S.valueGlow}>{(user.points || 0).toLocaleString()}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--lime)', letterSpacing: '1px' }}>PTS</div>
          </div>
          <div style={{ marginTop: 'auto' }}>
            <button onClick={() => navigate('wallet')} style={{ ...S.btnGhost, width: '100%' }}>Manage Portfolio</button>
          </div>
        </div>

        <div style={S.glassCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ ...S.label, marginBottom: 0 }}>Verified Engagements</span>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 100, letterSpacing: '0.5px' }}>
              {stats.completions} LIFETIME
            </div>
          </div>
          
          <div style={{ marginTop: 24, marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--slate)', fontWeight: 600, marginBottom: 12 }}>
              <span>Liquidity Target</span>
              <span style={{ color: 'var(--ink)' }}>{user.points || 0} / {minWithdrawal}</span>
            </div>
            <div style={{ height: 6, background: 'var(--surface)', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--line)' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: 'var(--lime)', borderRadius: 10 }}></div>
            </div>
          </div>

          <div style={{ marginTop: 'auto' }}>
            <button onClick={() => navigate('tasks')} style={{ ...S.btnLime, width: '100%' }}>Acquire Tasks</button>
          </div>
        </div>
      </div>

      {/* LUXURY REFERRAL CARD */}
      <div style={{ ...S.premiumCard, marginBottom: 56, display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
        <div style={{ flex: '1 1 300px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid rgba(212, 175, 55, 0.5)', color: '#D4AF37', background: 'rgba(212, 175, 55, 0.05)', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>
            ✦ VIP Network Bonus
          </div>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, color: 'var(--ink)', marginBottom: 12, fontWeight: 800, letterSpacing: '-0.5px' }}>Expand Your Network. Earn 50 Points.</h2>
          <p style={{ color: 'var(--slate)', fontSize: 14, lineHeight: 1.6, maxWidth: 500, margin: 0 }}>
            Distribute your unique cryptographic invite link. Upon a successful registration and first verified task completion from your referral, your account is instantly credited.
          </p>
        </div>
        
        <button onClick={copyReferralLink} style={{ position: 'relative', zIndex: 2, background: referralCopied ? 'var(--surface)' : 'rgba(212, 175, 55, 0.1)', color: referralCopied ? 'var(--ink)' : '#D4AF37', border: `1px solid ${referralCopied ? 'var(--line)' : 'rgba(212, 175, 55, 0.4)'}`, borderRadius: 12, padding: '14px 28px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter', sans-serif", letterSpacing: '0.5px', transition: 'all 0.3s' }}>
          {referralCopied ? 'LINK COPIED TO CLIPBOARD ✓' : 'COPY SECURE LINK'}
        </button>
      </div>
    </div>
  );
}
