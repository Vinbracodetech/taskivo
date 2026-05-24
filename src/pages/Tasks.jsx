import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import PhoneVerification from '../components/PhoneVerification';

export default function Tasks({ session, navigate }) {
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [quotas, setQuotas] = useState({ videos: 0, blogs: 0 });
  const [lockout, setLockout] = useState(false);
  
  // 🔥 THE NEW COOLDOWN MEMORY 🔥
  const [cooldowns, setCooldowns] = useState({});

  // 🔥 PROGRESSIVE ONBOARDING STATE 🔥
  const [needsPhoneVerification, setNeedsPhoneVerification] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    // Check if they need phone verification before fetching tasks
    if (!user.phone) {
      setNeedsPhoneVerification(true);
      setLoading(false);
      return;
    }

    fetchMarketplace();
  }, [user]);

  async function fetchMarketplace() {
    try {
      setLoading(true);
      
      // 1. SECURE LOCKOUT CHECK
      const { data: profile } = await supabase
        .from('profiles')
        .select('lockout_until')
        .eq('id', user.id)
        .single();
        
      if (profile?.lockout_until && new Date() < new Date(profile.lockout_until)) {
        setLockout(true);
        setLoading(false);
        return;
      }

      // 2. FETCH HISTORY (For both Quotas & 24h Cooldowns)
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const todayMidnight = new Date();
      todayMidnight.setHours(0, 0, 0, 0);

      // Grab the earliest date needed to cover both 24h rolling and midnight
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
        
        // Quota Math (Only count tasks completed since midnight today)
        if (completedAt >= todayMidnight) {
          if (h.platform === 'blog') bCount++; 
          else vCount++;
        }

        // Cooldown Math (Count tasks completed in the last 24 rolling hours)
        if (completedAt >= twentyFourHoursAgo) {
          const hoursPassed = (new Date() - completedAt) / 3600000;
          cooldownMap[h.task_id] = Math.ceil(24 - hoursPassed);
        }
      });

      setQuotas({ videos: vCount, blogs: bCount });
      setCooldowns(cooldownMap);

      // 3. LOAD ACTIVE TASKS
      const { data: activeTasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', 'active');
        
      setTasks(activeTasks || []);
      
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // ── 💎 PREMIUM LUXURY STYLES 💎 ──
  const S = {
    page: { 
      padding: '40px 5%', 
      maxWidth: 1040, 
      margin: '0 auto', 
      fontFamily: "'DM Sans', sans-serif" 
    },
    headerWrap: { 
      marginBottom: 48, 
      borderBottom: '1px solid rgba(255,255,255,0.05)', 
      paddingBottom: 24 
    },
    glassCard: { 
      background: 'var(--surface-card)', 
      border: '1px solid var(--line)', 
      borderRadius: 24, 
      padding: 40, 
      textAlign: 'center' 
    },
    quotaGlowBox: {
      background: 'linear-gradient(145deg, rgba(168,255,62,0.1) 0%, rgba(168,255,62,0.02) 100%)',
      border: '1px solid rgba(168,255,62,0.3)',
      boxShadow: '0 8px 32px rgba(168,255,62,0.05)',
      padding: '16px 24px',
      borderRadius: 16,
      flex: '1 1 200px',
      position: 'relative',
      overflow: 'hidden'
    },
    quotaDarkBox: {
      background: 'var(--surface-card)',
      border: '1px solid var(--line)',
      padding: '16px 24px',
      borderRadius: 16,
      flex: '1 1 200px'
    },
    taskCard: { 
      background: 'linear-gradient(180deg, var(--surface-card) 0%, rgba(15,23,42,0.6) 100%)', 
      border: '1px solid rgba(255,255,255,0.05)', 
      borderRadius: 20, 
      padding: '24px', 
      display: 'flex', 
      flexDirection: 'column', 
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      position: 'relative'
    },
    btnActive: { 
      background: 'var(--lime)', 
      color: '#000', 
      border: 'none', 
      padding: '10px 20px', 
      borderRadius: 10, 
      fontSize: 13, 
      fontWeight: 800, 
      cursor: 'pointer', 
      boxShadow: '0 4px 12px rgba(168,255,62,0.2)',
      letterSpacing: '0.5px'
    },
    btnLocked: {
      background: 'rgba(255,255,255,0.05)', 
      color: 'var(--slate)', 
      border: '1px solid rgba(255,255,255,0.1)', 
      padding: '10px 20px', 
      borderRadius: 10, 
      fontSize: 12, 
      fontWeight: 700, 
      cursor: 'not-allowed',
      letterSpacing: '0.5px'
    }
  };

  if (loading) return <div style={{ padding: '80px', textAlign: 'center', color: 'var(--slate)' }}><div style={{ animation: 'pulse 1.5s infinite' }}>Syncing Network...</div></div>;

  // 🔥 PROGRESSIVE ONBOARDING INTERCEPT 🔥
  if (needsPhoneVerification) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--surface)', paddingTop: 40 }}>
         {/* We render the PhoneVerification component inline instead of as an overlay so it feels native to the page */}
         <PhoneVerification 
            user={user} 
            onVerified={async () => {
              // Refresh session so the new phone number is attached locally
              await supabase.auth.refreshSession();
              setNeedsPhoneVerification(false);
              fetchMarketplace(); // Load the tasks
            }} 
            onCancel={() => navigate('user-dashboard')} // If they cancel, just send them back to the dashboard lobby
          />
      </div>
    );
  }

  if (lockout) {
    return (
      <div style={S.page}>
        <div style={S.glassCard}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🔒</div>
          <h2 style={{ color: 'var(--ink)', fontSize: 24, marginBottom: 12 }}>Network Access Locked</h2>
          <p style={{ color: 'var(--slate)' }}>Your account is under a strict 24-hour restriction.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={S.headerWrap}>
        <h1 style={{ fontSize: 36, color: 'var(--ink)', marginBottom: 8, fontWeight: 800, letterSpacing: '-1px' }}>
          Engagement <span style={{ color: 'var(--lime)' }}>Network</span>
        </h1>
        <p style={{ color: 'var(--slate)', fontSize: 16 }}>Complete premium tasks to acquire yield. Daily allocations apply.</p>
      </div>

      <div style={{ display: 'flex', gap: 20, marginBottom: 48, flexWrap: 'wrap' }}>
        
        <div style={S.quotaGlowBox}>
          <span style={{ fontSize: 11, color: 'var(--lime)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1.5px', display: 'block', marginBottom: 4 }}>Video Quota</span>
          <span style={{ color: 'var(--ink)', fontSize: 24, fontWeight: 800 }}>{quotas.videos} <span style={{ fontSize: 16, color: 'rgba(168,255,62,0.5)' }}>/ 3</span></span>
        </div>
        
        <div style={S.quotaDarkBox}>
          <span style={{ fontSize: 11, color: 'var(--slate)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1.5px', display: 'block', marginBottom: 4 }}>Blog Quota</span>
          <span style={{ color: 'var(--ink)', fontSize: 24, fontWeight: 800 }}>{quotas.blogs} <span style={{ fontSize: 16, color: 'var(--slate)' }}>/ 20</span></span>
        </div>
        
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
        {tasks.map(task => {
          const isBlog = task.platform === 'blog';
          const quotaHit = (isBlog && quotas.blogs >= 20) || (!isBlog && quotas.videos >= 3);
          const cooldownHours = cooldowns[task.id];
          const isLocked = quotaHit || cooldownHours;

          return (
            <div key={task.id} style={{ ...S.taskCard, opacity: isLocked ? 0.6 : 1 }}>
              
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                  {isBlog ? '📄' : '▶️'}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 6, lineHeight: 1.3 }}>{task.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                    {task.watch_duration}s Verification
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 20 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: isLocked ? 'var(--slate)' : 'var(--lime)' }}>
                  +{task.reward_points} PTS
                </div>
                
                {/* 🔥 THE SMART FRONT-DOOR LOCKS 🔥 */}
                {quotaHit ? (
                  <button disabled style={S.btnLocked}>LIMIT REACHED</button>
                ) : cooldownHours ? (
                  <button disabled style={S.btnLocked}>🔒 {cooldownHours}H COOLDOWN</button>
                ) : (
                  <button onClick={() => navigate(`player/${task.id}`)} style={S.btnActive}>
                    INITIATE
                  </button>
                )}
                
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
