import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Tasks({ session, navigate }) {
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  
  // 🔥 UPGRADED QUOTA ENGINE 🔥
  const [quotas, setQuotas] = useState({ videos: 0, blogs: 0, premium: 0 });
  const [lockout, setLockout] = useState(false);
  const [cooldowns, setCooldowns] = useState({});

  const [needsPayoutVerification, setNeedsPayoutVerification] = useState(false);
  const [payoutForm, setPayoutForm] = useState({ bank_name: '', account_name: '', account_number: '' });
  const [savingPayout, setSavingPayout] = useState(false);
  const [payoutError, setPayoutError] = useState('');

  useEffect(() => {
    if (!user) return;
    // LAYER 3 LOCK: Strictly enforce both account number AND bank name
    if (!user.payout_account || !user.payout_bank_name) {
      setNeedsPayoutVerification(true);
      setLoading(false);
      return;
    }
    fetchMarketplace();
  }, [user]);

  async function fetchMarketplace() {
    try {
      setLoading(true);
      const { data: profile } = await supabase.from('profiles').select('lockout_until').eq('id', user.id).single();
      
      if (profile?.lockout_until && new Date() < new Date(profile.lockout_until)) {
        setLockout(true);
        setLoading(false);
        return;
      }

      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const todayMidnight = new Date();
      todayMidnight.setHours(0, 0, 0, 0);

      const fetchDate = twentyFourHoursAgo < todayMidnight ? twentyFourHoursAgo : todayMidnight;

      const { data: history } = await supabase
        .from('completions')
        .select('task_id, platform, created_at')
        .eq('user_id', user.id) 
        .gte('created_at', fetchDate.toISOString());

      let vCount = 0, bCount = 0, pCount = 0;
      const cooldownMap = {};

      (history || []).forEach(h => {
        const completedAt = new Date(h.created_at);
        if (completedAt >= todayMidnight) {
          if (h.platform === 'blog') bCount++; 
          else if (h.platform === 'youtube') vCount++;
          else pCount++; // Catches UGC and QA
        }
        if (completedAt >= twentyFourHoursAgo) {
          const hoursPassed = (new Date() - completedAt) / 3600000;
          cooldownMap[h.task_id] = Math.ceil(24 - hoursPassed);
        }
      });

      setQuotas({ videos: vCount, blogs: bCount, premium: pCount });
      setCooldowns(cooldownMap);

      // 1. FETCH CLIENT & ADMIN CUSTOM TASKS
      const completedTaskIds = (history || []).map(h => h.task_id);
      const { data: activeTasks } = await supabase.from('tasks').select('*').eq('status', 'active');
      const freshTasks = (activeTasks || []).filter(t => !completedTaskIds.includes(t.id)).map(t => ({
        ...t,
        is_internal_blog: false
      }));

      // 2. FETCH AUTOMATED TASKIVO BLOG POSTS (10 PTS ENGINE)
      const { data: blogReads } = await supabase.from('blog_reads').select('post_slug').eq('user_id', user.id);
      const readSlugs = (blogReads || []).map(b => b.post_slug);
      
      const { data: activePosts } = await supabase.from('posts').select('*').eq('status', 'published');
      const freshPosts = (activePosts || []).filter(p => !readSlugs.includes(p.slug)).map(p => ({
        id: 'internal-' + p.slug,
        is_internal_blog: true,
        slug: p.slug,
        title: p.title,
        platform: 'Taskivo Intel',
        reward_points: 10,
        created_at: p.created_at
      }));

      // 3. MERGE & SORT (Date descending, then randomized within 12-hour windows)
      const nowTime = new Date().getTime();
      const mergedFeed = [...freshTasks, ...freshPosts].map(t => ({
        ...t,
        created_time: new Date(t.created_at || nowTime).getTime()
      })).sort((a, b) => {
        const dateDiff = b.created_time - a.created_time;
        if (Math.abs(dateDiff) > 43200000) return dateDiff; 
        return 0.5 - Math.random();
      });
        
      setTasks(mergedFeed);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function submitPayoutProfile() {
    setSavingPayout(true);
    setPayoutError('');
    try {
      if (!payoutForm.bank_name || !payoutForm.account_name || !payoutForm.account_number) {
        throw new Error("All network fields are required.");
      }

      const { error } = await supabase
        .from('profiles')
        .update({ 
          payout_bank_name: payoutForm.bank_name, 
          payout_account_name: payoutForm.account_name, 
          payout_account: payoutForm.account_number 
        })
        .eq('id', user.id);
      
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

  const S = {
    page: { padding: '40px 5%', maxWidth: 1040, margin: '0 auto', fontFamily: "var(--font-body)", position: 'relative' },
    headerWrap: { marginBottom: 48, borderBottom: '1px solid var(--line)', paddingBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 },
    glassCard: { background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 24, padding: 40, textAlign: 'center' },
    quotaBox: (isPremium) => ({ background: isPremium ? 'var(--surface)' : 'var(--lime-dim)', border: `1px solid ${isPremium ? 'var(--gold)' : 'var(--lime)'}`, padding: '16px 24px', borderRadius: 16, flex: '1 1 200px' }),
    taskCard: (isPremium, isInternal) => ({ background: isInternal ? 'var(--lime-dim)' : 'var(--surface-card)', border: `1px solid ${isPremium ? 'var(--gold)' : isInternal ? 'var(--lime)' : 'var(--line)'}`, borderRadius: 20, padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: isPremium ? '0 8px 24px rgba(212, 175, 55, 0.08)' : 'var(--shadow)', position: 'relative', overflow: 'hidden' }),
    btnActive: (isPremium, isInternal) => ({ background: isPremium ? 'var(--gold)' : isInternal ? 'var(--ink)' : 'var(--lime)', color: isInternal ? 'var(--lime)' : '#000', border: 'none', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: "var(--font-display)", textTransform: 'uppercase' }),
    btnLocked: { background: 'var(--surface)', color: 'var(--slate)', border: '1px solid var(--line)', padding: '10px 20px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'not-allowed', fontFamily: "var(--font-display)" },
    
    payoutOverlay: { position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    payoutCard: { background: 'var(--surface-card)', border: '1px solid var(--lime)', borderRadius: 24, padding: 40, width: '100%', maxWidth: 460, boxShadow: '0 16px 48px rgba(168,255,62,0.05)', textAlign: 'center' },
    input: { width: '100%', padding: '16px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, color: 'var(--ink)', fontSize: 15, marginBottom: 20, outline: 'none', boxSizing: 'border-box' },
    label: { fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--slate)', marginBottom: 8, display: 'block', textAlign: 'left', fontFamily: "var(--font-display)" },
    errorBox: { background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '12px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700, marginBottom: 24 }
  };

  if (loading) return (
    <div style={{ padding: '100px 5%', textAlign: 'center', color: 'var(--slate)' }}>
      <div style={{ width: 32, height: 32, border: '2px solid var(--line)', borderTopColor: 'var(--lime)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
      <div style={{ fontFamily: "var(--font-display)", fontSize: 12, fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase' }}>Syncing Network...</div>
    </div>
  );

  if (lockout) return (
    <div style={S.payoutOverlay}>
      <div style={{...S.payoutCard, borderColor: '#ef4444'}}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🛑</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: '#ef4444', marginBottom: 8 }}>Network Lockout</h2>
        <p style={{ color: 'var(--slate)', fontSize: 15, lineHeight: 1.6 }}>Anomalous activity detected. Your access to the liquidity pool has been temporarily suspended to protect our B2B partners.</p>
      </div>
    </div>
  );

  if (needsPayoutVerification) {
    return (
      <div style={S.payoutOverlay}>
        <div style={S.payoutCard}>
          <div style={{ width: 64, height: 64, background: 'var(--lime-dim)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', border: '1px solid var(--lime)' }}>
             <span style={{ fontSize: 24 }}>🛡️</span>
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 800, color: 'var(--ink)', marginBottom: 8, letterSpacing: '-0.5px' }}>Bind Payout Node</h2>
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
          
          <button onClick={submitPayoutProfile} disabled={savingPayout} style={{ width: '100%', background: 'var(--lime)', color: '#000', border: 'none', padding: '16px', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: savingPayout ? 'not-allowed' : 'pointer', fontFamily: "var(--font-display)", textTransform: 'uppercase', letterSpacing: '1px' }}>
            {savingPayout ? 'VERIFYING...' : 'SECURE NODE'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={S.headerWrap}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 36, color: 'var(--ink)', fontWeight: 800, margin: '0 0 8px 0', letterSpacing: '-1px' }}>Engagement <span style={{ color: 'var(--lime)' }}>Network</span></h1>
          <p style={{ color: 'var(--slate)', margin: 0, fontSize: 15 }}>Execute verifiable tasks to acquire daily yield.</p>
        </div>
        {/* 🔥 ROUTE FIXED HERE TO 'user-dashboard' 🔥 */}
        <button onClick={() => navigate('user-dashboard')} style={{ background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>My Hub →</button>
      </div>

      <div style={{ display: 'flex', gap: 20, marginBottom: 48, flexWrap: 'wrap' }}>
        <div style={S.quotaBox(false)}>
          <span style={{ fontSize: 11, color: 'var(--lime)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1.5px', fontFamily: "var(--font-display)" }}>Video Metrics</span>
          <div style={{ color: 'var(--ink)', fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)" }}>{quotas.videos} <span style={{ fontSize: 14, color: 'var(--slate)' }}>/ 3</span></div>
        </div>
        <div style={S.quotaBox(false)}>
          <span style={{ fontSize: 11, color: 'var(--lime)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1.5px', fontFamily: "var(--font-display)" }}>SEO Dwell Limits</span>
          <div style={{ color: 'var(--ink)', fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)" }}>{quotas.blogs} <span style={{ fontSize: 14, color: 'var(--slate)' }}>/ 20</span></div>
        </div>
        <div style={S.quotaBox(true)}>
          <span style={{ fontSize: 11, color: 'var(--gold)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1.5px', fontFamily: "var(--font-display)" }}>Premium QA / UGC</span>
          <div style={{ color: 'var(--ink)', fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)" }}>{quotas.premium} <span style={{ fontSize: 14, color: 'var(--slate)' }}>/ 5</span></div>
        </div>
      </div>

      {tasks.length === 0 ? (
         <div style={{ ...S.glassCard, padding: 80, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           <div style={{ fontSize: 48, marginBottom: 16 }}>🛰️</div>
           <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ink)', fontFamily: "var(--font-display)" }}>Network Exhausted</div>
           <div style={{ fontSize: 14, color: 'var(--slate)', maxWidth: 300, margin: '8px auto 0' }}>All available campaigns have met their target metrics. Return shortly for new drops.</div>
         </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {tasks.map(task => {
            const isVideo = task.platform === 'youtube';
            const isBlog = task.platform === 'blog';
            const isPremium = task.platform === 'ugc' || task.platform === 'qa_testing';
            const isInternal = task.is_internal_blog || task.is_house_campaign;
            
            let quotaHit = false;
            if (isVideo && quotas.videos >= 3) quotaHit = true;
            if (isBlog && quotas.blogs >= 20) quotaHit = true;
            if (isPremium && quotas.premium >= 5) quotaHit = true;
            
            const isLocked = quotaHit || cooldowns[task.id];
            
            let icon = '▶️';
            if (isBlog || isInternal) icon = '📄';
            if (task.platform === 'ugc') icon = '📸';
            if (task.platform === 'qa_testing') icon = '🛠️';

            return (
              <div key={task.id} style={{ ...S.taskCard(isPremium, isInternal), opacity: isLocked ? 0.6 : 1 }}>
                
                {isPremium && (
                  <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--gold)', color: '#000', fontSize: 9, fontWeight: 800, padding: '4px 12px', borderBottomLeftRadius: 12, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Premium Escrow
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, marginTop: isPremium ? 8 : 0 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--surface)', border: `1px solid ${isPremium ? 'var(--gold)' : 'var(--line)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: isInternal ? 'var(--lime)' : 'var(--slate)', textTransform: 'uppercase', marginBottom: 4 }}>
                      {task.is_house_campaign ? 'OFFICIAL TASK' : task.platform}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink)', marginBottom: 4, lineHeight: 1.3 }}>{task.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--slate)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                      {isPremium ? 'Manual Verification' : task.watch_duration ? `${task.watch_duration}s Enforced Dwell` : 'Automated Verification'}
                    </div>
                  </div>
                </div>
                
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: 20 }}>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--slate)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 2 }}>Yield</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: isLocked ? 'var(--slate)' : isPremium ? 'var(--gold)' : 'var(--lime)', fontFamily: "var(--font-display)" }}>+{task.reward_points} PTS</div>
                  </div>
                  
                  {quotaHit ? (
                    <button disabled style={S.btnLocked}>LIMIT REACHED</button>
                  ) : cooldowns[task.id] ? (
                    <button disabled style={S.btnLocked}>🔒 {cooldowns[task.id]}H WAIT</button>
                  ) : (
                    <button onClick={() => {
                        if (task.is_internal_blog) {
                          localStorage.setItem('taskivo_active_mission', task.slug);
                          navigate(`article-${task.slug}`);
                        } else {
                          if (task.platform === 'blog' && task.url) {
                            localStorage.setItem('taskivo_active_mission', task.url.split('/').pop());
                          }
                          navigate(`player/${task.id}`);
                        }
                    }} style={S.btnActive(isPremium, isInternal)}>INITIATE</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
