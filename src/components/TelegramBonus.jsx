import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function TelegramBonus({ session, showToast, onBonusClaimed }) {
  const user = session?.user;
  const [claimed, setClaimed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [telegramId, setTelegramId] = useState('');
  
  // 🔥 NEW: Local error state so we can see exactly what fails on mobile
  const [localError, setLocalError] = useState('');

  const TELEGRAM_URL = 'https://t.me/taskivoonline'; 
  const BONUS_REWARD = 20;

  useEffect(() => {
    if (!user?.id) return;
    checkClaimStatus();
  }, [user]);

  async function checkClaimStatus() {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('telegram_claims')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) setClaimed(true);
    } catch (err) {
      console.error("Error checking telegram status:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleClaimReward() {
    if (claimed) return;
    setLocalError(''); // Clear previous errors
    
    if (!telegramId || telegramId.trim() === '') {
      setLocalError('Please enter your Numeric Telegram ID.');
      return;
    }

    setSubmitting(true);
    try {
      // STEP 1: Ping the Edge Function
      const { data: edgeData, error: edgeError } = await supabase.functions.invoke('verify-telegram', {
        body: { telegram_id: telegramId.trim() }
      });

      if (edgeError) {
        throw new Error(`Edge Function Error: ${edgeError.message || 'Unknown network error'}`);
      }

      if (!edgeData?.verified) {
        throw new Error(edgeData?.error || 'Verification failed. Are you sure you joined @taskivoonline?');
      }

      // STEP 2: Record the claim securely
      const { error: claimErr } = await supabase
        .from('telegram_claims')
        .insert({ user_id: user.id });

      if (claimErr) {
        if (claimErr.code === '23505') {
          setClaimed(true);
          throw new Error('You have already claimed this bonus!');
        }
        throw new Error(`Database Error (Claims): ${claimErr.message}`);
      }

      // STEP 3: Fetch and update points
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles').select('points').eq('id', user.id).single();

      if (profileErr) throw new Error(`Database Error (Profile): ${profileErr.message}`);

      const newPoints = (profileData.points || 0) + BONUS_REWARD;

      const { error: updateErr } = await supabase.from('profiles').update({ points: newPoints }).eq('id', user.id);
      
      if (updateErr) throw new Error(`Database Error (Update): ${updateErr.message}`);

      // STEP 4: Log ledger transaction
      await supabase.from('transactions').insert({
        user_id: user.id,
        type: 'telegram_bonus',
        amount: BONUS_REWARD,
        currency: 'PTS',
        status: 'completed'
      });

      setClaimed(true);
      setLocalError('');
      if (showToast) showToast(`Success! +${BONUS_REWARD} PTS verified and added.`, 'success');
      if (onBonusClaimed) onBonusClaimed(newPoints);

    } catch (err) {
      // Print the exact error on the screen
      setLocalError(err.message || 'An unknown error occurred.');
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
          
          <p style={{ color: 'var(--slate)', fontSize: 14, lineHeight: 1.6, maxWidth: 500, margin: '0 0 16px 0' }}>
            {claimed 
              ? 'Thank you for being part of our community network! Keep an eye on the channel for exclusive updates and payout drops.' 
              : 'Join @taskivoonline. We use strict API verification to prevent bots.'}
          </p>

          {!claimed && (
            <div style={{ background: 'rgba(0,0,0,0.2)', padding: 16, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', maxWidth: 400 }}>
              <div style={{ fontSize: 12, color: 'var(--slate)', marginBottom: 12 }}>
                1. Join <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" style={{ color: '#0088cc', textDecoration: 'none', fontWeight: 'bold' }}>@taskivoonline</a><br/>
                2. Send any message to <strong style={{ color: '#fff' }}>@userinfobot</strong> on Telegram to get your Numeric ID.
              </div>
              <input 
                type="text" 
                placeholder="Enter your Numeric ID (e.g. 123456789)" 
                value={telegramId}
                onChange={(e) => setTelegramId(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(0,136,204,0.3)', borderRadius: 8, color: '#fff', outline: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: 14, boxSizing: 'border-box' }}
              />
              {/* 🔥 EXPLICIT ERROR DISPLAY 🔥 */}
              {localError && (
                <div style={{ marginTop: 12, padding: 12, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 8, color: '#ef4444', fontSize: 13, fontWeight: 600 }}>
                  🚨 {localError}
                </div>
              )}
            </div>
          )}
        </div>
        
        <div>
          {claimed ? (
            <div style={{ background: 'rgba(168,255,62,0.1)', color: 'var(--lime)', border: '1px solid var(--lime)', borderRadius: 100, padding: '14px 28px', fontSize: 13, fontWeight: 800, fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>
              ✓ Verified & Collected
            </div>
          ) : (
            <button 
              onClick={handleClaimReward} 
              disabled={submitting}
              style={{ background: '#0088cc', color: '#fff', border: 'none', borderRadius: 100, padding: '14px 28px', fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px', boxShadow: '0 8px 16px rgba(0, 136, 204, 0.2)', transition: 'all 0.2s', opacity: submitting ? 0.5 : 1 }}
            >
              {submitting ? 'Verifying with Telegram...' : 'Verify & Claim'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
