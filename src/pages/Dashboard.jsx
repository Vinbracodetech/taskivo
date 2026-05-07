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
};

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

      // 1. Get total completed tasks for this user
      const { count, error: countError } = await supabase
        .from('completions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (countError) throw countError;

      // 2. Fetch up to 3 active tasks for the "Quick Earn" section
      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('status', 'active')
        .limit(3);

      if (tasksError) throw tasksError;

      setStats({ completions: count || 0 });
      setFeaturedTasks(tasks || []);

    } catch (err) {
      console.error(err);
      if (showToast) showToast('Failed to sync dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  }

  function copyReferralLink() {
    const link = `https://taskivo.online/auth?ref=${user.id}`;
    navigator.clipboard.writeText(link);
    setReferralCopied(true);
    if (showToast) showToast('Invite link copied!', 'success');
    setTimeout(function() {
      setReferralCopied(false);
    }, 3000);
  }

  if (loading) {
    return (
      <div style={{ padding: '60px 5%', textAlign: 'center', color: C.slate, fontFamily: "'DM Sans', sans-serif" }}>
        Syncing your profile...
      </div>
    );
  }

  // Calculate progress toward a hypothetical minimum withdrawal (e.g., 1000 points)
  const minWithdrawal = 2000;
  const progressPercent = Math.min((user.points / minWithdrawal) * 100, 100);

  return (
    <div style={{ padding: '40px 5%', maxWidth: 1000, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
      
      {/* HEADER SECTION */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 28, color: C.white, marginBottom: 8, fontWeight: 800 }}>
          Welcome back, <span style={{ textTransform: 'capitalize' }}>{user.full_name?.split(' ')[0] || 'Earner'}</span>.
        </h1>
        <p style={{ color: C.slate, fontSize: 15 }}>
          Track your verified engagement and network growth.
        </p>
      </div>

      {/* STATS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 40 }}>
        
        {/* Points Card */}
        <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Available Balance</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 48, fontWeight: 800, color: C.lime, lineHeight: 1 }}>{user.points.toLocaleString()}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.slate }}>PTS</div>
          </div>
          <button 
            onClick={function() { navigate('wallet'); }}
            style={{ marginTop: 24, background: 'rgba(255,255,255,0.05)', color: C.white, border: `1px solid ${C.line}`, borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            Manage Wallet →
          </button>
        </div>

        {/* Completion & Progress Card */}
        <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.slate, textTransform: 'uppercase', letterSpacing: 1 }}>Verified Tasks</div>
              <div style={{ background: 'rgba(255,255,255,0.1)', color: C.white, fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 100 }}>
                {stats.completions} Lifetime
              </div>
            </div>
            
            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.slate }}>
              <span>Progress to next payout</span>
              <span style={{ color: C.white, fontWeight: 600 }}>{user.points} / {minWithdrawal}</span>
            </div>
            
            {/* Progress Bar */}
            <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ width: `${progressPercent}%`, height: '100%', background: C.lime, borderRadius: 10, transition: 'width 1s ease-in-out' }}></div>
            </div>
          </div>
          
          <button 
            onClick={function() { navigate('tasks'); }}
            style={{ marginTop: 24, background: C.lime, color: C.ink, border: 'none', borderRadius: 8, padding: '10px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
          >
            Find More Tasks
          </button>
        </div>
      </div>

      {/* VIRAL LOOP / REFERRAL BANNER */}
      <div style={{ background: 'linear-gradient(135deg, rgba(168,255,62,0.1) 0%, rgba(13,13,20,0) 100%)', border: `1px solid ${C.limeDim}`, borderRadius: 16, padding: 24, marginBottom: 40, display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ flex: '1 1 300px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: C.lime, color: C.ink, fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
            <span style={{ fontSize: 12 }}>🔥</span> Hot Bonus
          </div>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, color: C.white, marginBottom: 8 }}>Earn 50 Points Per Invite</h2>
          <p style={{ color: C.slate, fontSize: 14, lineHeight: 1.6, maxWidth: 450, margin: 0 }}>
            Share your unique invite link. When your friend registers and successfully completes their first verified task, you instantly receive 50 points.
          </p>
        </div>
        <button 
          onClick={copyReferralLink}
          style={{ 
            background: referralCopied ? 'rgba(255,255,255,0.1)' : C.white, 
            color: referralCopied ? C.white : C.ink, 
            border: 'none', borderRadius: 8, padding: '14px 24px', 
            fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter', sans-serif",
            whiteSpace: 'nowrap'
          }}
        >
          {referralCopied ? 'Link Copied ✓' : 'Copy Invite Link'}
        </button>
      </div>

      {/* QUICK START / FEATURED TASKS */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, color: C.white, margin: 0 }}>Start Earning Now</h2>
          <span 
            onClick={function() { navigate('tasks'); }}
            style={{ color: C.lime, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            View all →
          </span>
        </div>

        {featuredTasks.length === 0 ? (
          <div style={{ background: C.card, border: `1px dashed ${C.line}`, borderRadius: 12, padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: C.white, marginBottom: 8 }}>No active tasks available</div>
            <div style={{ fontSize: 13, color: C.slate }}>Check back shortly. Our businesses are preparing new campaigns.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
            {featuredTasks.map(function(task) {
              const isBlog = task.platform === 'blog';
              return (
                <div key={task.id} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                      {isBlog ? '📄' : '▶️'}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.white, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200 }}>
                        {task.title}
                      </div>
                      <div style={{ fontSize: 12, color: C.slate, fontWeight: 500 }}>
                        {task.watch_duration}s Verification
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 16, borderTop: `1px solid ${C.line}` }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: C.lime }}>+{task.reward_points} PTS</div>
                    <button 
                      onClick={function() { navigate(`player/${task.id}`); }}
                      style={{ background: 'transparent', color: C.white, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                    >
                      Begin Task →
                    </button>
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
