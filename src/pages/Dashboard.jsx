import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import DailySpin from '../components/DailySpin';
import { enforceDeviceFingerprint } from '../lib/security';

export default function Dashboard({ user, navigate, showToast }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ completions: 0 });
  const [featuredTasks, setFeaturedTasks] = useState([]);
  const [referralCopied, setReferralCopied] = useState(false);
  
  // 🔥 SMART LOCK STATES 🔥
  const [quotas, setQuotas] = useState({ videos: 0, blogs: 0 });
  const [cooldowns, setCooldowns] = useState({});

  // 🔥 UPGRADED PROFILE STATES 🔥
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ 
    full_name: user.full_name || '', 
    payout_bank_name: user.payout_bank_name || '',
    payout_account: user.payout_account || '',
    payout_account_name: user.payout_account_name || ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchDashboardData();
    // SILENTLY TRIGGER THE DEVICE TRACKER
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

  async function handleSaveProfile() {
    setSavingProfile(true);
    try {
      if (!editForm.full_name) throw new Error("Full name is required");
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          full_name: editForm.full_name,
          payout_bank_name: editForm.payout_bank_name,
          payout_account: editForm.payout_account,
          payout_account_name: editForm.payout_account_name
        })
        .eq('id', user.id);
      
      if (error) {
        if (error.code === '23505' && error.message.includes('payout_account')) {
           throw new Error("This account number is already registered to another user.");
        }
        throw error;
      }
      
      user.full_name = editForm.full_name;
      user.payout_bank_name = editForm.payout_bank_name;
      user.payout_account = editForm.payout_account;
      user.payout_account_name = editForm.payout_account_name;
      
      if (showToast) showToast('Profile updated successfully', 'success');
      setShowEditModal(false);
    } catch (err) {
      if (showToast) showToast(err.message, 'error');
      else alert(err.message);
    } finally {
      setSavingProfile(false);
    }
  }

  function copyReferralLink() {
    navigator.clipboard.writeText(`https://taskivo.online/#auth?ref=${user.id}`);
    setReferralCopied(true);
    if (showToast) showToast('Invite link copied!', 'success');
    setTimeout(() => setReferralCopied(false), 3000);
  }

  function getInitials(name) {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  }

  if (loading) {
    return (
      <div style={{ padding: '80px 5%', textAlign: 'center', color: 'var(--slate)', fontFamily: "var(--font-body)", fontSize: 14 }}>
        <div style={{ width: 24, height: 24, border: '2px solid var(--line)', borderTopColor: 'var(--lime)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
        Decrypting profile data...
      </div>
    );
  }

  const minWithdrawal = 2000;
  const progressPercent = Math.min((user.points / minWithdrawal) * 100, 100);
  const isVerified = !!user.payout_account;

  const S = {
    page: { padding: '40px 5%', maxWidth: 1040, margin: '0 auto', fontFamily: "var(--font-body)", position: 'relative' },
    glassCard: { background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column', boxShadow: 'var(--shadow)' },
    premiumCard: { background: 'var(--surface-card)', border: '1px solid var(--gold)', borderRadius: 24, padding: 32, boxShadow: 'var(--shadow)', position: 'relative', overflow: 'hidden' },
    label: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--slate)', marginBottom: 16, display: 'block', fontFamily: "var(--font-display)" },
    valueGlow: { fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 800, color: 'var(--ink)', lineHeight: 1 },
    btnGhost: { background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: 12, padding: '12px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-block', textAlign: 'center', fontFamily: "var(--font-display)", transition: 'all 0.2s' },
    btnLime: { background: 'var(--lime)', border: 'none', color: '#000', borderRadius: 12, padding: '12px 20px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'inline-block', textAlign: 'center', fontFamily: "var(--font-display)", boxShadow: '0 8px 16px rgba(168,255,62,0.2)' },
    btnLocked: { background: 'var(--surface)', color: 'var(--slate)', border: '1px solid var(--line)', borderRadius: 12, padding: '10px 20px', fontSize: 12, fontWeight: 700, cursor: 'not-allowed', fontFamily: "var(--font-display)" },
    avatarHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, position: 'relative', zIndex: 1, flexWrap: 'wrap', gap: 20 },
    avatarBlock: { display: 'flex', alignItems: 'center', gap: 16 },
    avatar: { width: 64, height: 64, borderRadius: '50%', background: 'var(--lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#000', fontSize: 24, fontWeight: 800, fontFamily: "var(--font-display)", border: '2px solid var(--surface-card)', boxShadow: '0 8px 16px rgba(0,0,0,0.1)' },
    badge: { fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 6, letterSpacing: '0.5px', textTransform: 'uppercase', marginTop: 4, display: 'inline-block' },
    verified: { background: 'var(--lime-dim)', color: 'var(--lime)', border: '1px solid var(--lime)' },
    unverified: { background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' },
    modalOverlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: 20 },
    modalCard: { background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 24, padding: 32, width: '100%', maxWidth: 400, boxShadow: 'var(--shadow)', maxHeight: '90vh', overflowY: 'auto' },
    modalLabel: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--slate)', marginBottom: 8, display: 'block', fontFamily: "var(--font-display)" },
    input: { width: '100%', padding: '14px 16px', background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 12, color: 'var(--ink)', fontSize: 15, marginBottom: 20, outline: 'none', boxSizing: 'border-box', fontFamily: "var(--font-body)", transition: 'border-color 0.2s' }
  };

  return (
    <div style={S.page}>
      
      <div style={S.avatarHeader}>
        <div style={S.avatarBlock}>
          <div style={S.avatar}>{getInitials(user.full_name)}</div>
          <div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, color: 'var(--ink)', margin: '0 0 4px', fontWeight: 800, letterSpacing: '-0.5px', textTransform: 'capitalize' }}>
              {user.full_name || 'Earner'}
            </h1>
            <div style={{ ...S.badge, ...(isVerified ? S.verified : S.unverified) }}>
              {isVerified ? '✓ Verified Network' : '⚠ Action Required'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {/* 🔥 ADDED HISTORY QUICK LINK */}
          <button onClick={() => navigate('history')} style={S.btnGhost}>Activity Ledger</button>
          <button onClick={() => setShowEditModal(true)} style={S.btnGhost}>Edit Profile</button>
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <DailySpin session={{ user }} showToast={showToast} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, marginBottom: 48, position: 'relative', zIndex: 1 }}>
        <div style={S.glassCard}>
          <span style={S.label}>Available Balance</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 32, marginTop: 8 }}>
            <div style={S.valueGlow}>{user.points.toLocaleString()}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--lime)', letterSpacing: '1px' }}>PTS</div>
          </div>
          
          {/* 🔥 UPDATED WALLET/HISTORY BUTTONS */}
          <div style={{ marginTop: 'auto', display: 'flex', gap: 12 }}>
            <button onClick={() => navigate('wallet')} style={{ ...S.btnGhost, flex: 1 }}>Wallet</button>
            <button onClick={() => navigate('history')} style={{ ...S.btnGhost, flex: 1 }}>Ledger</button>
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
              <span style={{ color: 'var(--ink)' }}>{user.points} / {minWithdrawal}</span>
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

      {/* PREMIUM GOLD CARD */}
      <div style={{ ...S.premiumCard, marginBottom: 56, display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center', justifyContent: 'space-between', zIndex: 1 }}>
        <div style={{ flex: '1 1 300px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid var(--gold)', color: 'var(--gold)', background: 'var(--surface)', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16 }}>
            ✦ VIP Network Bonus
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, color: 'var(--ink)', marginBottom: 12, fontWeight: 800, letterSpacing: '-0.5px' }}>Expand Your Network. Earn 50 Points.</h2>
          <p style={{ color: 'var(--slate)', fontSize: 14, lineHeight: 1.6, maxWidth: 500, margin: 0 }}>
            Distribute your unique cryptographic invite link. Upon a successful registration and first verified task completion from your referral, your account is instantly credited.
          </p>
        </div>
        
        <button onClick={copyReferralLink} style={{ position: 'relative', zIndex: 2, background: referralCopied ? 'var(--surface)' : 'var(--surface-card)', color: referralCopied ? 'var(--ink)' : 'var(--gold)', border: `1px solid ${referralCopied ? 'var(--line)' : 'var(--gold)'}`, borderRadius: 12, padding: '14px 28px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: "var(--font-display)", letterSpacing: '0.5px', transition: 'all 0.3s' }}>
          {referralCopied ? 'LINK COPIED TO CLIPBOARD ✓' : 'COPY SECURE LINK'}
        </button>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: 'var(--ink)', margin: 0, letterSpacing: '-0.5px' }}>Active Opportunities</h2>
          <span onClick={() => navigate('tasks')} style={{ color: 'var(--slate)', fontSize: 13, fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>View Directory →</span>
        </div>
        
        {featuredTasks.length === 0 ? (
          <div style={{ ...S.glassCard, padding: 60, alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--slate)', letterSpacing: '0.5px' }}>No active campaigns available at this moment.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {featuredTasks.map(task => {
              const isBlog = task.platform === 'blog';
              const quotaHit = (isBlog && quotas.blogs >= 20) || (!isBlog && quotas.videos >= 3);
              const cooldownHours = cooldowns[task.id];
              const isLocked = quotaHit || cooldownHours;

              return (
                <div key={task.id} style={{ background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 16, padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, opacity: isLocked ? 0.6 : 1 }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                      {isBlog ? '📄' : '▶️'}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', marginBottom: 4, letterSpacing: '-0.2px' }}>{task.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--slate)', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{task.watch_duration}s Verification</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 4 }}>Yield</div>
                      <div style={{ fontSize: 16, fontWeight: 800, color: isLocked ? 'var(--slate)' : 'var(--lime)' }}>+{task.reward_points} PTS</div>
                    </div>
                    
                    {quotaHit ? (
                      <button disabled style={S.btnLocked}>LIMIT REACHED</button>
                    ) : cooldownHours ? (
                      <button disabled style={S.btnLocked}>🔒 {cooldownHours}H COOLDOWN</button>
                    ) : (
                      <button onClick={() => navigate(`player/${task.id}`)} style={{ ...S.btnGhost, padding: '10px 20px', fontSize: 12 }}>Initiate</button>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

      {showEditModal && (
        <div style={S.modalOverlay}>
          <div style={S.modalCard}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: 'var(--ink)', marginBottom: 8, letterSpacing: '-0.5px' }}>Edit Profile</h2>
            <p style={{ color: 'var(--slate)', fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>Update your network identity and payout configurations.</p>
            
            <label style={S.modalLabel}>Full Name</label>
            <input style={S.input} type="text" placeholder="Your legal name" value={editForm.full_name} onChange={e => setEditForm({...editForm, full_name: e.target.value})} />

            <div style={{ height: 1, background: 'var(--line)', margin: '8px 0 24px' }}></div>
            
            <label style={S.modalLabel}>Bank / Institution Name</label>
            <input style={S.input} type="text" placeholder="e.g. Chase, Paystack, PayPal" value={editForm.payout_bank_name} onChange={e => setEditForm({...editForm, payout_bank_name: e.target.value})} />

            <label style={S.modalLabel}>Account Name</label>
            <input style={S.input} type="text" placeholder="e.g. John Doe" value={editForm.payout_account_name} onChange={e => setEditForm({...editForm, payout_account_name: e.target.value})} />

            <label style={S.modalLabel}>Account Number / Email</label>
            <input style={{...S.input, marginBottom: 8}} type="text" placeholder="e.g. 0123456789" value={editForm.payout_account} onChange={e => setEditForm({...editForm, payout_account: e.target.value})} />
            
            <div style={{ fontSize: 11, color: 'var(--slate)', marginBottom: 24, lineHeight: 1.4 }}>
              This entire ledger locks permanently upon your first successful withdrawal to prevent network fraud.
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowEditModal(false)} style={{ ...S.btnGhost, flex: 1, padding: '14px' }}>Cancel</button>
              <button onClick={handleSaveProfile} disabled={savingProfile} style={{ ...S.btnLime, flex: 1, padding: '14px', opacity: savingProfile ? 0.5 : 1 }}>
                {savingProfile ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
