import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function TelegramBonus({ session, showToast, onBonusClaimed }) {
  const user = session?.user;
  const [claimed, setClaimed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Replace with your actual official Telegram channel or group link
  const TELEGRAM_URL = 'https://t.me/+YOUR_TELEGRAM_LINK_HERE'; 
  const BONUS_REWARD = 20; // 20 PTS bonus

  useEffect(() => {
    if (!user?.id) return;
    checkClaimStatus();
  }, [user]);

  async function checkClaimStatus() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('telegram_claims')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setClaimed(true);
      }
    } catch (err) {
      console.error("Error checking telegram status:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleClaimReward() {
    if (claimed) return;
    
    // First, open the Telegram link in a new tab so they can join
    window.open(TELEGRAM_URL, '_blank');

    setSubmitting(true);
    try {
      // 1. Record the claim in the secure table
      const { error: claimErr } = await supabase
        .from('telegram_claims')
        .insert({ user_id: user.id });

      if (claimErr) {
        if (claimErr.code === '23505') {
          setClaimed(true);
          throw new Error('You have already claimed this bonus!');
        }
        throw claimErr;
      }

      // 2. Fetch current points to ensure accurate incrementing
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', user.id)
        .single();

      if (profileErr) throw profileErr;

      const newPoints = (profileData.points || 0) + BONUS_REWARD;

      // 3. Update user profile points
      const { error: updateErr } = await supabase
        .from('profiles')
        .update({ points: newPoints })
        .eq('id', user.id);

      if (updateErr) throw updateErr;

      // 4. Log the transaction in the ledger
      await supabase.from('transactions').insert({
        user_id: user.id,
        type: 'telegram_bonus',
        amount: BONUS_REWARD,
        currency: 'PTS',
        status: 'completed'
      });

      setClaimed(true);
      if (showToast) showToast(`Success! +${BONUS_REWARD} PTS added to your balance.`, 'success');
      
      if (onBonusClaimed) {
        onBonusClaimed(newPoints);
      }

    } catch (err) {
      if (showToast) showToast(err.message || 'Failed to claim bonus', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return null;

  return (
    <div style={{ background: 'var(--surface-card)', border: '1px solid rgba(0, 136, 204, 0.3)', borderRadius: 24, padding: 32, marginBottom: 48, position: 'relative', overflow: 'hidden', backdropFilter: 'blur(10px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, position: 'relative', zIndex: 2 }}>
        <div style={{ flex: '1 1 300px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid rgba(0, 136, 204, 0.4)', color: '#0088cc', background: 'rgba(0, 136, 204, 0.1)', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 16, fontFamily: "'Inter', sans-serif" }}>
            ✈️ Official Community Reward (+{BONUS_REWARD} PTS)
          </div>
          
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, color: 'var(--ink)', marginBottom: 12, fontWeight: 800, letterSpacing: '-0.5px' }}>
            {claimed ? 'Telegram Bonus Claimed!' : 'Join Our Telegram Channel'}
          </h2>
          <p style={{ color: 'var(--slate)', fontSize: 14, lineHeight: 1.6, maxWidth: 500, margin: 0 }}>
            {claimed 
              ? 'Thank you for being part of our community network! Keep an eye on the channel for exclusive updates and payout drops.' 
              : 'Join our official Telegram community to stay updated on high-payout tasks, platform updates, and announcements. Claim your one-time instant bonus now!'}
          </p>
        </div>
        
        <div>
          {claimed ? (
            <div style={{ background: 'rgba(168,255,62,0.1)', color: 'var(--lime)', border: '1px solid var(--lime)', borderRadius: 100, padding: '14px 28px', fontSize: 13, fontWeight: 800, fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>
              ✓ Bonus Collected
            </div>
          ) : (
            <button 
              onClick={handleClaimReward} 
              disabled={submitting}
              style={{ background: '#0088cc', color: '#fff', border: 'none', borderRadius: 100, padding: '14px 28px', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px', boxShadow: '0 8px 16px rgba(0, 136, 204, 0.2)', transition: 'all 0.2s', opacity: submitting ? 0.5 : 1 }}
            >
              {submitting ? 'Verifying...' : 'Join & Claim 20 PTS'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
