import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Tasks({ session, navigate }) {
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [quotas, setQuotas] = useState({ videos: 0, blogs: 0 });
  const [lockout, setLockout] = useState(false);
  const [cooldowns, setCooldowns] = useState({});

  // 🔥 PROGRESSIVE ONBOARDING: PAYOUT WALL 🔥
  const [needsPayoutVerification, setNeedsPayoutVerification] = useState(false);
  const [payoutForm, setPayoutForm] = useState({ bank_name: '', account_name: '', account_number: '' });
  const [savingPayout, setSavingPayout] = useState(false);
  const [payoutError, setPayoutError] = useState('');

  useEffect(() => {
    if (!user) return;
    
    // Check if they need financial verification before fetching tasks
    if (!user.payout_account) {
      setNeedsPayoutVerification(true);
      setLoading(false);
      return;
    }

    fetchMarketplace();
  }, [user]);

  async function fetchMarketplace() {
    try {
      setLoading(true);
      
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

  // 🔥 HANDLE PAYOUT WALL SUBMISSION 🔥
  async function submitPayoutProfile() {
    setSavingPayout(true);
    setPayoutError('');
    
    try {
      if (!payoutForm.bank_name || !payoutForm.account_name || !payoutForm.account_number) {
        throw new Error("All fields are required.");
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
        if (error.code === '23505') throw new Error("This account number is already registered to another user.");
        throw error;
      }

      // Update local user object instantly
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
    page: { padding: '40px 5%', maxWidth: 1040, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" },
    headerWrap: { marginBottom: 48, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 24 },
    glassCard: { background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 24, padding: 40, textAlign: 'center' },
    quotaGlowBox: { background: 'linear-gradient(145deg, rgba(168,255,62,0.1) 0%, rgba(168,255,62,0.02) 100%)', border: '1px solid rgba(168,255,62,0.3)', boxShadow: '0 8px 32px rgba(168,255,62,0.05)', padding: '16px 24px', borderRadius: 16, flex: '1 1 200px', overflow: 'hidden' },
    quotaDarkBox: { background: 'var(--surface-card)', border: '1px solid var(--line)', padding: '16px 24px', borderRadius: 16, flex: '1 1 200px' },
    taskCard: { background: 'linear-gradient(180deg, var(--surface-card) 0%, rgba(15,23,42,0.6) 100%)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 20, padding: '24px', display: 'flex', flexDirection: 'column', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' },
    btnActive: { background: 'var(--lime)', color: '#000', border: 'none', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 12px rgba(168,255,62,0.2)' },
    btnLocked: { background: 'rgba(255,255,255,0.05)', color: 'var(--slate)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'not-allowed' },
    
    // Payout Wall Styles
    payoutOverlay: { position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" },
    payoutCard: { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 24, padding: 36, width: '100%', maxWidth: 420, boxShadow: '0 32px 80px rgba(0,0,0,0.4)', textAlign: 'center' },
    input: { width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#ffffff', fontSize: 15, marginBottom: 16, outline: 'none', boxSizing: 'border-box' },
    label: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.5)', marginBottom: 8, display: 'block', textAlign: 'left' },
    errorBox: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 20 }
  };

  if (loading) return <div style={{ padding: '80px', textAlign: 'center', color: 'var(--slate)' }}><div style={{ animation: 'pulse 1.5s infinite' }}>Syncing Network...</div></div>;

  // 🔥 THE PAYOUT BOUNCER WALL 🔥
  if (needsPayoutVerification) {
    return (
      <div style={S.payoutOverlay}>
        <div style={S.payoutCard}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💳</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', marginBottom: 8, fontFamily: "'Inter', sans-serif", letterSpacing: '-0.5px' }}>Financial Verification</h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 28, lineHeight: 1.6 }}>
            To protect the network from bot abuse, you must link a valid global payout account (Bank or PayPal) before accessing tasks.
          </p>

          {payoutError && <div style={S.errorBox}>{payoutError}</div>}

          <div style={{ textAlign: 'left' }}>
            <label style={S.label}>Bank / Institution Name</label>
            <input type="text" placeholder="e.g. PayPal, Chase, Paystack" value={payoutForm.bank_name} onChange={e => setPayoutForm({...payoutForm, bank_name: e.target.value})} style={S.input} />

            <label style={S.label}>Account Holder Name</label>
            <input type="text" placeholder="Your exact legal name" value={payoutForm.account_name} onChange={e => setPayoutForm({...payoutForm, account_name: e.target.value})} style={S.input} />

            <label style={S.label}>Account Number / Email</label>
            <input type="text" placeholder="e.g. 0123456789 or email@paypal.com" value={payoutForm.account_number} onChange={e => setPayoutForm({...payoutForm, account_number: e.target.value})} style={{...S.input, marginBottom: 8}} />
            
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 24, lineHeight: 1.4 }}>
              This account acts as your unique identity. It locks permanently upon your first withdrawal.
            </div>
          </div>

          <button onClick={submitPayoutProfile} disabled={savingPayout} style={{ width: '100%', background: '#A8FF3E', color: '#0D0D14', border: 'none', padding: '14px', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: savingPayout ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif", opacity: savingPayout ? 0.7 : 1 }}>
            {savingPayout ? 'VERIFYING...' : 'SECURE ACCOUNT & CONTINUE'}
          </button>
          
          <button onClick={() => navigate('user-dashboard')} style={{ width: '100%', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', padding: '14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>
            Return to Dashboard
          </button>
        </div>
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
                
                {quotaHit ? (
                  <button disabled style={S.btnLocked}>LIMIT REACHED</button>
                ) : cooldownHours ? (
                  <button disabled style={S.btnLocked}>🔒 {cooldownHours}H COOLDOWN</button>
                ) : (
                  <button onClick={() => navigate(`player/${task.id}`)} style={S.btnActive}>INITIATE</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
