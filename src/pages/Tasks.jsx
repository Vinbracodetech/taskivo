import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Tasks({ session, navigate }) {
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  
  const [activeCategory, setActiveCategory] = useState('All');
  const [displayCount, setDisplayCount] = useState(15);
  
  const [quotas, setQuotas] = useState({ seoBlogs: 0, internalBlogs: 0 });
  const [lockout, setLockout] = useState(false);
  const [cooldowns, setCooldowns] = useState({});

  const [needsPayoutVerification, setNeedsPayoutVerification] = useState(false);
  const [payoutForm, setPayoutForm] = useState({ bank_name: '', account_name: '', account_number: '' });
  const [savingPayout, setSavingPayout] = useState(false);
  const [payoutError, setPayoutError] = useState('');

  const [toastMessage, setToastMessage] = useState('');

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

      // 1. Fetch internal Supabase Tasks
      const [compRes, allBlogReadsRes, activeTasksRes, activePostsRes] = await Promise.all([
        supabase.from('completions').select('task_id, platform, created_at').eq('user_id', user.id).gte('created_at', twentyFourHoursAgo.toISOString()),
        supabase.from('blog_reads').select('post_slug, created_at').eq('user_id', user.id),
        supabase.from('tasks').select('*').eq('status', 'active'),
        supabase.from('posts').select('*').eq('status', 'published')
      ]);

      let seoCount = 0, intCount = 0;
      const cooldownMap = {};

      (compRes.data || []).forEach(h => {
        const completedAt = new Date(h.created_at);
        if (h.platform === 'blog' || h.platform === 'adsense') seoCount++; 
        
        const hoursLeft = Math.ceil(24 - ((now - completedAt) / 3600000));
        if (hoursLeft > 0) cooldownMap[h.task_id] = `${hoursLeft}H`;
      });

      const readSlugs = [];
      (allBlogReadsRes.data || []).forEach(b => {
        const completedAt = new Date(b.created_at);
        if (completedAt >= twentyFourHoursAgo) {
          intCount++; 
          readSlugs.push(b.post_slug);
        }
      });

      setQuotas({ seoBlogs: seoCount, internalBlogs: intCount });
      setCooldowns(cooldownMap);

      const freshTasks = (activeTasksRes.data || []).map(t => ({
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

      // 2. 🔥 FETCH CPAGRIP NATIVE JSON FEED 🔥
      let cpaTasks = [];
      try {
        const cpaRes = await fetch(`https://www.cpagrip.com/common/offer_feed_json.php?user_id=1064388&pubkey=68db332dde9664f68379f3fa5c0c7d97&tracking_id=${user.id}`);
        const cpaData = await cpaRes.json();
        
        if (cpaData && cpaData.offers) {
          cpaTasks = cpaData.offers.map(offer => ({
            id: `cpa-${offer.campaign_id || offer.offer_id}`,
            is_cpa: true,
            platform: 'App Verification',
            title: offer.title,
            description: offer.description,
            // Convert USD payout to PTS (Payout * 300)
            reward_points: Math.round(parseFloat(offer.payout) * 300),
            url: offer.tracking_url || offer.link,
            image: offer.offer_image,
            created_at: new Date().toISOString()
          }));
        }
      } catch (err) {
        console.error("Failed to load CPAGrip JSON Feed:", err);
      }

      // Merge and sort all task sources
      const mergedFeed = [...cpaTasks, ...freshTasks, ...freshPosts].sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
        
      setTasks(mergedFeed);
    } catch (err) {
      console.error(err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  }

  async function submitPayoutProfile() {
    setSavingPayout(true);
    setPayoutError('');
    try {
      if (!payoutForm.bank_name || !payoutForm.account_name || !payoutForm.account_number) throw new Error("All network fields are required.");
      const { error } = await supabase.from('profiles').update({ payout_bank_name: payoutForm.bank_name, payout_account_name: payoutForm.account_name, payout_account: payoutForm.account_number }).eq('id', user.id);
      if (error) {
        if (error.code === '23505') throw new Error("This payout channel is already registered to another user.");
        throw error;
      }
      user.payout_account = payoutForm.account_number;
      user.payout_bank_name = payoutForm.bank_name;
      user.payout_account_name = payoutForm.account_name;
      
      setNeedsPayoutVerification(false);
      fetchMarketplace();
    } catch (err) {
      setPayoutError(err.message);
    } finally {
      setSavingPayout(false);
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Premium CPA Apps') return task.is_cpa;
    if (activeCategory === 'SEO & AdSense') return (task.platform === 'blog' || task.platform === 'adsense') && !task.is_internal_blog;
    if (activeCategory === 'Internal Intel') return task.is_internal_blog;
    return true;
  });

  const displayedTasks = filteredTasks.slice(0, displayCount);

  const S = {
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
    page: { padding: '40px 5%', maxWidth: 1040, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", position: 'relative' },
    headerWrap: { marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 },
    
    quotaPanel: { background: 'var(--surface-card)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24, padding: 24, display: 'flex', flexWrap: 'wrap', gap: 24, marginBottom: 32, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' },
    quotaItem: { flex: '1 1 120px', display: 'flex', flexDirection: 'column', gap: 8 },
    
    tabContainer: { display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16, marginBottom: 24, scrollbarWidth: 'none' },
    tabBtn: (isActive) => ({
      background: isActive ? 'var(--lime)' : 'var(--surface-card)',
      color: isActive ? '#000' : 'var(--slate)',
      border: isActive ? '1px solid var(--lime)' : '1px solid rgba(255,255,255,0.1)',
      padding: '10px 20px',
      borderRadius: 100,
      fontSize: 13,
      fontWeight: 800,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      fontFamily: "'Inter', sans-serif",
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      transition: 'all 0.2s'
    }),

    taskCard: (isCpa, isInternalStyle) => ({ 
      background: 'var(--surface-card)', 
      border: '1px solid rgba(255,255,255,0.03)', 
      borderLeft: `4px solid ${isCpa ? '#ef4444' : isInternalStyle ? '#A8FF3E' : 'rgba(255,255,255,0.1)'}`,
      borderRadius: 16, 
      padding: '24px', 
      display: 'flex', 
      flexDirection: 'column', 
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)', 
      position: 'relative', 
      overflow: 'hidden',
      backdropFilter: 'blur(10px)',
      transition: 'transform 0.2s, box-shadow 0.2s'
    }),
    
    btnActive: (isCpa, isInternalStyle) => ({ background: isCpa ? '#ef4444' : isInternalStyle ? 'var(--lime-dim)' : 'var(--lime)', color: (isInternalStyle && !isCpa) ? 'var(--lime)' : '#fff', border: isInternalStyle ? '1px solid var(--lime)' : 'none', padding: '10px 24px', borderRadius: 100, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px' }),
    btnLocked: { background: 'var(--surface)', color: 'var(--slate)', border: '1px solid var(--line)', padding: '10px 24px', borderRadius: 100, fontSize: 12, fontWeight: 700, cursor: 'not-allowed', fontFamily: "'Inter', sans-serif" },
    
    payoutOverlay: { position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    payoutCard: { background: 'var(--surface-card)', border: '1px solid var(--lime)', borderRadius: 24, padding: 40, width: '100%', maxWidth: 460, boxShadow: '0 16px 48px rgba(168,255,62,0.05)', textAlign: 'center', backdropFilter: 'blur(10px)' },
    input: { width: '100%', padding: '16px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, color: 'var(--ink)', fontSize: 15, marginBottom: 20, outline: 'none', boxSizing: 'border-box' },
    label: { fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--slate)', marginBottom: 8, display: 'block', textAlign: 'left', fontFamily: "'Inter', sans-serif" },
    errorBox: { background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, marginBottom: 24 },
    
    toast: { position: 'fixed', bottom: 30, right: 30, background: 'var(--lime)', color: '#000', padding: '16px 24px', borderRadius: 100, fontSize: 14, fontWeight: 800, fontFamily: "'Inter', sans-serif", boxShadow: '0 16px 32px rgba(168,255,62,0.3)', zIndex: 9999, display: 'flex', alignItems: 'center', gap: 12, animation: 'slideUp 0.3s ease-out' }
  };

  if (loading) return (
    <div style={{ padding: '100px 5%', textAlign: 'center', color: 'var(--slate)' }}>
      <div style={{ width: 32, height: 32, border: '2px solid var(--line)', borderTopColor: 'var(--lime)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
      <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>Syncing Network...</div>
    </div>
  );

  if (lockout) return (
    <div style={S.pageWrapper}>
      <div style={S.payoutOverlay}>
        <div style={{...S.payoutCard, borderColor: '#ef4444'}}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🛑</div>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 800, color: '#ef4444', marginBottom: 8 }}>Network Lockout</h2>
          <p style={{ color: 'var(--slate)', fontSize: 15, lineHeight: 1.6 }}>Anomalous activity detected. Your access to the liquidity pool has been temporarily suspended to protect our B2B partners.</p>
        </div>
      </div>
    </div>
  );

  if (needsPayoutVerification) {
    return (
      <div style={S.pageWrapper}>
        <div style={S.payoutOverlay}>
          <div style={S.payoutCard}>
            <div style={{ width: 64, height: 64, background: 'var(--lime-dim)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid var(--lime)' }}>
               <span style={{ fontSize: 24 }}>🛡️</span>
            </div>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 28, fontWeight: 800, color: 'var(--ink)', marginBottom: 8, letterSpacing: '-0.5px' }}>Bind Payout Node</h2>
            <p style={{ fontSize: 14, color: 'var(--slate)', marginBottom: 32, lineHeight: 1.5 }}>To enforce our zero-bot moat, you must link a verifiable financial institution before executing missions.</p>
            
            {payoutError && <div style={S.errorBox}>{payoutError}</div>}
            
            <div style={{ textAlign: 'left' }}>
              <label style={S.label}>Bank / Institution Name</label>
              <input type="text" placeholder="e.g. Paystack, Chase, PayPal" value={payoutForm.bank_name} onChange={e => setPayoutForm({...payoutForm, bank_name: e.target.value})} style={S.input} />
              <label style={S.label}>Legal Account Holder Name</label>
              <input type="text" placeholder="Your legal name" value={payoutForm.account_name} onChange={e => setPayoutForm({...payoutForm, account_name: e.target.value})} style={S.input} />
              <label style={S.label}>Account Number / Email</label>
              <input type="text" placeholder="e.g. 0123456789" value={payoutForm.account_number} onChange={e => setPayoutForm({...payoutForm, account_number: e.target.value})} style={S.input} />
            </div>
            
            <button onClick={submitPayoutProfile} disabled={savingPayout} style={{ width: '100%', background: 'var(--lime)', color: '#000', border: 'none', padding: '16px', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: savingPayout ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '1px' }}>
              {savingPayout ? 'VERIFYING...' : 'SECURE NODE'}
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            <p style={{ color: 'var(--slate)', margin: 0, fontSize: 15 }}>Execute verifiable tasks to acquire daily yield.</p>
          </div>
          <button 
            onClick={() => navigate('user-dashboard')} 
            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--ink)', borderRadius: 100, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s', backdropFilter: 'blur(5px)' }}
          >
            My Hub →
          </button>
        </div>

        {/* OFFERWALLS BANNER */}
        <div 
          onClick={() => navigate('offerwalls')}
          style={{ background: 'var(--surface-card)', border: '1px solid var(--lime)', borderRadius: 24, padding: 32, marginBottom: 32, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20, boxShadow: '0 12px 40px rgba(168,255,62,0.1)', position: 'relative', overflow: 'hidden' }}
        >
          <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: 'var(--lime)' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 18 }}>💎</span>
              <span style={{ fontSize: 11, color: 'var(--lime)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Premium Yield Sector</span>
            </div>
            <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 800, color: 'var(--ink)', margin: '0 0 8px 0' }}>CPA Offerwalls</h2>
            <p style={{ color: 'var(--slate)', margin: 0, fontSize: 14 }}>Access high-paying app installs and verifications.</p>
          </div>
          <button style={{ background: 'var(--lime)', color: '#000', border: 'none', padding: '14px 28px', borderRadius: 100, fontSize: 13, fontWeight: 800, fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '1px', pointerEvents: 'none' }}>
            Open Portal →
          </button>
        </div>

        <div style={S.quotaPanel}>
          <div style={S.quotaItem}>
            <span style={{ fontSize: 11, color: 'var(--slate)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}>Internal Intel</span>
            <div style={{ color: 'var(--ink)', fontSize: 24, fontWeight: 800, fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'baseline', gap: 4 }}>
              {quotas.internalBlogs} <span style={{ fontSize: 14, color: 'var(--slate)', fontWeight: 500 }}>/ 5</span>
            </div>
            <div style={{ height: 4, background: 'var(--surface)', borderRadius: 4, overflow: 'hidden', marginTop: 4 }}>
              <div style={{ width: `${(quotas.internalBlogs / 5) * 100}%`, height: '100%', background: 'var(--lime)', borderRadius: 4 }} />
            </div>
          </div>
          
          <div style={{ width: 1, background: 'rgba(255,255,255,0.05)', margin: '0 8px' }} className="hide-on-mobile" />
          
          <div style={S.quotaItem}>
            <span style={{ fontSize: 11, color: 'var(--slate)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}>SEO & AdSense</span>
            <div style={{ color: 'var(--ink)', fontSize: 24, fontWeight: 800, fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'baseline', gap: 4 }}>
              {quotas.seoBlogs} <span style={{ fontSize: 14, color: 'var(--slate)', fontWeight: 500 }}>/ 3</span>
            </div>
            <div style={{ height: 4, background: 'var(--surface)', borderRadius: 4, overflow: 'hidden', marginTop: 4 }}>
              <div style={{ width: `${(quotas.seoBlogs / 3) * 100}%`, height: '100%', background: 'var(--lime)', borderRadius: 4 }} />
            </div>
          </div>
        </div>

        <div style={S.tabContainer}>
          {['All', 'Premium CPA Apps', 'Internal Intel', 'SEO & AdSense'].map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={S.tabBtn(activeCategory === cat)}>
              {cat}
            </button>
          ))}
        </div>

        {filteredTasks.length === 0 ? (
           <div style={{ background: 'var(--surface-card)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24, padding: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
             <div style={{ fontSize: 48, marginBottom: 16 }}>🛰️</div>
             <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', fontFamily: "'Inter', sans-serif" }}>No {activeCategory !== 'All' ? activeCategory : 'Tasks'} Available</div>
             <div style={{ fontSize: 14, color: 'var(--slate)', maxWidth: 300, margin: '8px auto 0' }}>All available campaigns in this sector have met their targets. Return shortly.</div>
           </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {displayedTasks.map(task => {
              const isSeoBlog = (task.platform === 'blog' || task.platform === 'adsense') && !task.is_internal_blog;
              const isInternalBlog = task.is_internal_blog;
              const isCpa = task.is_cpa;
              
              let quotaHit = false;
              if (isSeoBlog && quotas.seoBlogs >= 3) quotaHit = true;
              if (isInternalBlog && quotas.internalBlogs >= 5) quotaHit = true;
              
              const isLocked = quotaHit || cooldowns[task.id];
              
              let icon = '📄';
              if (task.platform === 'adsense') icon = '💰';
              if (isCpa) icon = '🚀';

              return (
                <div key={task.id} style={{ ...S.taskCard(isCpa, isInternalBlog), opacity: isLocked ? 0.6 : 1 }}>
                  
                  {isCpa && (
                    <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '1px', border: '1px solid rgba(239,68,68,0.2)' }}>
                      Verified App
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: isCpa ? 'rgba(239,68,68,0.1)' : isInternalBlog ? 'var(--lime-dim)' : 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, overflow: 'hidden' }}>
                      {task.image ? <img src={task.image} alt="app" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : icon}
                    </div>
                    <div style={{ flex: 1, paddingRight: isCpa ? 80 : 0 }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: isCpa ? '#ef4444' : isInternalBlog ? 'var(--lime)' : 'var(--slate)', textTransform: 'uppercase', marginBottom: 6, letterSpacing: '0.5px' }}>
                        {task.platform}
                      </div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 6, lineHeight: 1.3 }}>{task.title}</div>
                      
                      {isCpa && task.description && (
                         <div style={{ fontSize: 11, color: 'var(--slate)', marginBottom: 8, lineHeight: 1.4, opacity: 0.8 }}>{task.description}</div>
                      )}
                      
                      <div style={{ fontSize: 12, color: 'var(--slate)', display: 'flex', alignItems: 'center', gap: 6 }}>
                         <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: isCpa ? '#ef4444' : 'var(--lime)' }} />
                         {isCpa ? 'S2S Automated Verification' : 'Automated Verification'}
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--slate)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Yield</div>
                      <div style={{ fontSize: 20, fontWeight: 800, color: isLocked ? 'var(--slate)' : isCpa ? '#ef4444' : isInternalBlog ? 'var(--lime)' : 'var(--ink)', fontFamily: "'Inter', sans-serif" }}>+{task.reward_points} <span style={{ fontSize: 12, color: 'var(--slate)', fontWeight: 500 }}>PTS</span></div>
                    </div>
                    
                    {quotaHit ? (
                      <button disabled style={S.btnLocked}>LIMIT REACHED</button>
                    ) : cooldowns[task.id] ? (
                      <button disabled style={S.btnLocked}>🔒 {cooldowns[task.id]} WAIT</button>
                    ) : (
                      <button onClick={() => {
                          if (isCpa) {
                            window.open(task.url, '_blank');
                          } else if (isInternalBlog) {
                            localStorage.setItem('taskivo_active_mission', task.slug);
                            navigate(`article-${task.slug}`);
                          } else {
                            if ((task.platform === 'blog' || task.platform === 'adsense') && task.url) {
                              localStorage.setItem('taskivo_active_mission', task.url.split('/').pop());
                            }
                            navigate(`player/${task.id}`);
                          }
                      }} style={S.btnActive(isCpa, isInternalBlog)}>Initiate</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {filteredTasks.length > displayCount && (
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <button 
              onClick={() => setDisplayCount(prev => prev + 15)}
              style={{ background: 'var(--surface-card)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--ink)', padding: '14px 32px', borderRadius: 100, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'all 0.2s', backdropFilter: 'blur(5px)' }}
            >
              Load More Operations ↓
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
