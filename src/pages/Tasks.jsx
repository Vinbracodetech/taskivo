import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Tasks({ session, navigate }) {
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [displayCount, setDisplayCount] = useState(15);
  
  const [quotas, setQuotas] = useState({ videos: 0, seoBlogs: 0, internalBlogs: 0, premium: 0, nativeAds: 0 });
  const [lockout, setLockout] = useState(false);
  const [cooldowns, setCooldowns] = useState({});
  const [bufferingAd, setBufferingAd] = useState(false); 

  const [needsPayoutVerification, setNeedsPayoutVerification] = useState(false);
  const [payoutForm, setPayoutForm] = useState({ bank_name: '', account_name: '', account_number: '' });
  const [savingPayout, setSavingPayout] = useState(false);
  const [payoutError, setPayoutError] = useState('');

  const [toastMessage, setToastMessage] = useState('');

  // --- LEVELPLAY MEDIATION BRIDGE LOGIC ---
  useEffect(() => {
    if (!user) return;

    window.onAdRewardSuccess = async (points) => {
      // Log the completion time for the cooldown
      localStorage.setItem('levelplay_last_watched', Date.now().toString());
      setCooldowns(prev => ({
        ...prev, 
        '11111111-1111-1111-1111-111111111111': '15M'
      }));

      setToastMessage('Processing Video Yield...');
      setBufferingAd(false);
      
      try {
        const { error } = await supabase.rpc('increment_ad_reward', { 
          p_user_id: user.id, 
          p_reward_points: points 
        });

        if (error) {
           if (error.message.includes('Network Cooldown')) {
             throw new Error("Cooldown active. Please wait 15 minutes.");
           }
           throw error;
        }
        
        setToastMessage(`+${points} Yield Secured! Ad completion verified.`);
        setTimeout(() => setToastMessage(''), 4000);
        
        window.dispatchEvent(new Event('taskivo_points_updated')); 
      } catch (err) {
        console.error("Ad Reward Error:", err);
        setToastMessage(err.message || 'Network Error: Could not secure yield.');
        setTimeout(() => setToastMessage(''), 4000);
      }
    };

    return () => {
      delete window.onAdRewardSuccess;
    };
  }, [user]);

  // --- MAIN SYNC & LIFECYCLE LOGIC ---
  useEffect(() => {
    if (!user) return;
    
    if (!user.payout_account || !user.payout_bank_name) {
      setNeedsPayoutVerification(true);
      setLoading(false);
    } else {
      fetchMarketplace();
    }
    
    const handleSilentSync = () => {
      if (user.payout_account && user.payout_bank_name) {
        fetchMarketplace(true);
      }
    };

    window.addEventListener('taskivo_points_updated', handleSilentSync);
    window.addEventListener('focus', handleSilentSync); 
    
    return () => {
      window.removeEventListener('taskivo_points_updated', handleSilentSync);
      window.removeEventListener('focus', handleSilentSync);
    };
  }, [user, needsPayoutVerification]);

  async function fetchMarketplace(isSilent = false) {
    try {
      if (!isSilent) setLoading(true);
      const { data: profile } = await supabase.from('profiles').select('lockout_until').eq('id', user.id).single();
      
      if (profile?.lockout_until && new Date() < new Date(profile.lockout_until)) {
        setLockout(true);
        if (!isSilent) setLoading(false);
        return;
      }

      const now = new Date();
      const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const [compRes, allBlogReadsRes, activeTasksRes, activePostsRes] = await Promise.all([
        supabase.from('completions').select('task_id, platform, created_at').eq('user_id', user.id).gte('created_at', twentyFourHoursAgo.toISOString()),
        supabase.from('blog_reads').select('post_slug, created_at').eq('user_id', user.id),
        supabase.from('tasks').select('*').eq('status', 'active'),
        supabase.from('posts').select('*').eq('status', 'published')
      ]);

      let vCount = 0, seoCount = 0, intCount = 0, pCount = 0, nativeCount = 0;
      const cooldownMap = {};

      (compRes.data || []).forEach(h => {
        const completedAt = new Date(h.created_at);
        
        if (h.platform === 'blog' || h.platform === 'adsense') seoCount++; 
        else if (h.platform === 'youtube') vCount++;
        else if (['ugc', 'qa_testing', 'growth'].includes(h.platform)) pCount++; 
        else if (h.task_id === '11111111-1111-1111-1111-111111111111') nativeCount++;
        
        if (h.task_id === '11111111-1111-1111-1111-111111111111') {
            const minutesLeft = Math.ceil(15 - ((now - completedAt) / 60000));
            if (minutesLeft > 0) cooldownMap[h.task_id] = `${minutesLeft}M`;
        } else {
            const hoursLeft = Math.ceil(24 - ((now - completedAt) / 3600000));
            if (hoursLeft > 0) cooldownMap[h.task_id] = `${hoursLeft}H`;
        }
      });

      const localAdWatchTime = localStorage.getItem('levelplay_last_watched');
      if (localAdWatchTime) {
          const minsPassed = Math.floor((Date.now() - parseInt(localAdWatchTime)) / 60000);
          if (minsPassed < 15) {
              cooldownMap['11111111-1111-1111-1111-111111111111'] = `${15 - minsPassed}M`;
          } else {
              localStorage.removeItem('levelplay_last_watched'); 
          }
      }

      const readSlugs = [];
      (allBlogReadsRes.data || []).forEach(b => {
        const completedAt = new Date(b.created_at);
        if (completedAt >= twentyFourHoursAgo) {
          intCount++; 
          readSlugs.push(b.post_slug);
        }
      });

      setQuotas({ videos: vCount, seoBlogs: seoCount, internalBlogs: intCount, premium: pCount, nativeAds: nativeCount });
      setCooldowns(cooldownMap);

      const freshTasks = (activeTasksRes.data || [])
        .filter(t => t.id !== '11111111-1111-1111-1111-111111111111' && t.platform !== 'levelplay' && t.platform !== 'smartlink' && t.platform !== 'cpx' && t.platform !== 'monetag')
        .map(t => ({
          ...t, is_internal_blog: false
        }));

      const freshPosts = (activePostsRes.data || [])
        .filter(p => !readSlugs.includes(p.slug)) 
        .sort((a, b) => (a.views || 0) - (b.views || 0)) 
        .map(p => ({
          id: 'internal-' + p.slug,
          is_internal_blog: true,
          slug: p.slug,
          title: p.title,
          platform: 'Taskivo Intel',
          reward_points: 3, 
          created_at: p.created_at
        }));

      const adTask = [];
      if (typeof window !== 'undefined' && window.ReactNativeWebView) {
        adTask.push({
          id: '11111111-1111-1111-1111-111111111111', 
          is_native_ad: true,
          platform: 'Premium Ad Network',
          title: 'Watch Sponsored Premium Video',
          reward_points: 5, 
          created_at: new Date().toISOString()
        });
      }

      const mergedFeed = [...adTask, ...freshTasks, ...freshPosts].sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
        
      setTasks(mergedFeed);
    } catch (err) {
      console.error(err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'SEO & AdSense') return (task.platform === 'blog' || task.platform === 'adsense') && !task.is_internal_blog;
    if (activeCategory === 'Internal Intel') return task.is_internal_blog;
    if (activeCategory === 'Social Views') return task.platform === 'youtube';
    if (activeCategory === 'Premium & Growth') return task.is_native_ad || ['ugc', 'qa_testing', 'growth'].includes(task.platform);
    return true;
  });

  const displayedTasks = filteredTasks.slice(0, displayCount);

  // --- STYLING (Unchanged to protect your design) ---
  const S = {
    pageWrapper: { minHeight: '100vh', backgroundColor: 'var(--surface)', backgroundImage: `radial-gradient(circle at top center, rgba(168,255,62,0.20) 0%, transparent 70%), url("data:image/svg+xml,%3Csvg width='80' height='138.6' viewBox='0 0 80 138.6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 138.6L0 115.5V69.3l40-23.1 40 23.1v46.2zM40 46.2L0 23.1V-23.1l40-23.1 40 23.1v46.2z' fill='none' stroke='%23A8FF3E' stroke-width='2' stroke-opacity='0.15'/%3E%3C/svg%3E")`, backgroundSize: '100%, 80px 138.6px', backgroundAttachment: 'fixed' },
    page: { padding: '40px 5%', maxWidth: 1040, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", position: 'relative' },
    headerWrap: { marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 },
    quotaPanel: { background: 'var(--surface-card)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24, padding: 24, display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 32, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' },
    quotaItem: { flex: '1 1 120px', display: 'flex', flexDirection: 'column', gap: 8 },
    tabContainer: { display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16, marginBottom: 24, scrollbarWidth: 'none' },
    tabBtn: (isActive) => ({ background: isActive ? 'var(--lime)' : 'var(--surface-card)', color: isActive ? '#000' : 'var(--slate)', border: isActive ? '1px solid var(--lime)' : '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: 100, fontSize: 13, fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px', transition: 'all 0.2s' }),
    taskCard: (isPremium, isInternalStyle) => ({ background: 'var(--surface-card)', border: '1px solid rgba(255,255,255,0.03)', borderLeft: `4px solid ${isPremium ? '#D4AF37' : isInternalStyle ? '#A8FF3E' : 'rgba(255,255,255,0.1)'}`, borderRadius: 16, padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', position: 'relative', overflow: 'hidden', backdropFilter: 'blur(10px)', transition: 'transform 0.2s, box-shadow 0.2s' }),
    btnActive: (isPremium, isInternalStyle) => ({ background: isPremium ? 'var(--gold)' : isInternalStyle ? 'var(--lime-dim)' : 'var(--lime)', color: (isInternalStyle && !isPremium) ? 'var(--lime)' : '#000', border: isInternalStyle ? '1px solid var(--lime)' : 'none', padding: '10px 24px', borderRadius: 100, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px' }),
    btnLocked: { background: 'var(--surface)', color: 'var(--slate)', border: '1px solid var(--line)', padding: '10px 24px', borderRadius: 100, fontSize: 12, fontWeight: 700, cursor: 'not-allowed', fontFamily: "'Inter', sans-serif" },
    toast: { position: 'fixed', bottom: 30, right: 30, background: 'var(--lime)', color: '#000', padding: '16px 24px', borderRadius: 100, fontSize: 14, fontWeight: 800, fontFamily: "'Inter', sans-serif", boxShadow: '0 16px 32px rgba(168,255,62,0.3)', zIndex: 9999, display: 'flex', alignItems: 'center', gap: 12, animation: 'slideUp 0.3s ease-out' }
  };

  if (loading) return (
    <div style={{ padding: '100px 5%', textAlign: 'center', color: 'var(--slate)' }}>
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>Syncing Network...</div>
    </div>
  );

  return (
    <div style={S.pageWrapper}>
      {toastMessage && (
        <div style={S.toast}>
          <span style={{ fontSize: 20 }}>✅</span>
          {toastMessage}
        </div>
      )}

      <div style={S.page}>
        <div style={S.headerWrap}>
          <div>
            <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 36, color: 'var(--ink)', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-1px' }}>Engagement <span style={{ color: 'var(--lime)' }}>Network</span></h1>
          </div>
        </div>

        <div style={S.quotaPanel}>
          {/* Quota visuals simplified for brevity */}
          <div style={S.quotaItem}>
            <span style={{ fontSize: 11, color: '#D4AF37', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}>Premium Network</span>
            <div style={{ color: 'var(--ink)', fontSize: 24, fontWeight: 800, fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'baseline', gap: 4 }}>
              {quotas.nativeAds} <span style={{ fontSize: 14, color: 'var(--slate)', fontWeight: 500 }}>/ 8</span>
            </div>
            <div style={{ height: 4, background: 'var(--surface)', borderRadius: 4, overflow: 'hidden', marginTop: 4 }}>
              <div style={{ width: `${(quotas.nativeAds / 8) * 100}%`, height: '100%', background: '#D4AF37', borderRadius: 4 }} />
            </div>
          </div>
        </div>

        <div style={S.tabContainer}>
          {['All', 'Premium & Growth'].map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={S.tabBtn(activeCategory === cat)}>{cat}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {displayedTasks.map(task => {
            const isPremium = task.is_native_ad || ['ugc', 'qa_testing', 'growth'].includes(task.platform);
            const isInternalStyle = task.is_internal_blog || task.is_house_campaign;
            
            let quotaHit = false;
            if (task.is_native_ad && quotas.nativeAds >= 8) quotaHit = true; 
            
            const isLocked = quotaHit || cooldowns[task.id];

            return (
              <div key={task.id} style={{ ...S.taskCard(isPremium, isInternalStyle), opacity: isLocked ? 0.6 : 1 }}>
                
                {isPremium && (
                  <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(212,175,55,0.1)', color: '#D4AF37', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Premium
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
                  <div style={{ flex: 1, paddingRight: isPremium ? 70 : 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 6, lineHeight: 1.3 }}>{task.title}</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: isLocked ? 'var(--slate)' : 'var(--ink)', fontFamily: "'Inter', sans-serif" }}>+{task.reward_points} PTS</div>
                  </div>
                  
                  {quotaHit ? (
                    <button disabled style={S.btnLocked}>LIMIT REACHED</button>
                  ) : cooldowns[task.id] ? (
                    <button disabled style={S.btnLocked}>🔒 {cooldowns[task.id]} WAIT</button>
                  ) : (
                    <button 
                      onClick={() => {
                        if (task.is_native_ad) {
                          setBufferingAd(true);
                          setToastMessage('Requesting Premium Video from LevelPlay...');
                          
                          if (typeof window !== 'undefined' && window.ReactNativeWebView) {
                            // THIS TELLS THE MOBILE APP TO SHOW THE AD
                            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SHOW_REWARDED_AD' }));
                          }
                          
                          // Network Failsafe
                          setTimeout(() => {
                            setBufferingAd(false);
                            setToastMessage('Video inventory syncing. Please try again in a few moments.');
                          }, 7000); 
                        } 
                      }} 
                      style={S.btnActive(isPremium, isInternalStyle)}
                      disabled={task.is_native_ad && bufferingAd}
                    >
                      {task.is_native_ad && bufferingAd ? 'BUFFERING...' : 'Initiate'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
