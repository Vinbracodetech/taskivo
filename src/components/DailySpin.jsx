import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function DailySpin({ session, showToast }) {
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [canSpin, setCanSpin] = useState(false);
  const [hoursLeft, setHoursLeft] = useState(0);
  
  // Animation States
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayNumber, setDisplayNumber] = useState("---");
  const [winStatus, setWinStatus] = useState("");

  useEffect(() => {
    if (user?.id) fetchSpinStatus();
  }, [user]);

  async function fetchSpinStatus() {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('last_claim_date')
        .eq('id', user.id)
        .single();

      if (data) {
        // 🔥 FIX: The NaN / 0-Hour Glitch Annihilator
        // If the date is null, missing, or invalid, they are instantly eligible.
        if (!data.last_claim_date) {
          setCanSpin(true);
          setDisplayNumber("READY");
          return;
        }

        const claimDate = new Date(data.last_claim_date);
        
        // Failsafe in case the database saved a weird string
        if (isNaN(claimDate.getTime())) {
          setCanSpin(true);
          setDisplayNumber("READY");
          return;
        }

        const hoursSinceLastClaim = (new Date() - claimDate) / 3600000;

        if (hoursSinceLastClaim >= 24) {
          setCanSpin(true);
          setDisplayNumber("READY");
        } else {
          setCanSpin(false);
          setHoursLeft(Math.ceil(24 - hoursSinceLastClaim));
          setDisplayNumber("LOCKED");
        }
      }
    } finally {
      setLoading(false);
    }
  }

  // 🔥 THE NEW ECONOMY MATH 🔥
  // Tightly controlled variable rewards to sustain the liquidity pool
  function calculateReward() {
    const rand = Math.random() * 100; 
    if (rand < 60) return 1;          // 60% chance: 1 Point
    if (rand < 85) return 2;          // 25% chance: 2 Points
    if (rand < 96) return 5;          // 11% chance: 5 Points
    if (rand < 99) return 10;         // 3% chance: 10 Points (Rare)
    return 50;                        // 1% chance: 50 Points (Jackpot)
  }

  async function handleSpin() {
    if (!canSpin || isSpinning) return;
    
    setIsSpinning(true);
    setWinStatus("");
    
    const actualReward = calculateReward();

    let cycles = 0;
    const maxCycles = 25; 
    
    const spinInterval = setInterval(() => {
      const randomDisplay = [1, 2, 5, 10, 50][Math.floor(Math.random() * 5)];
      setDisplayNumber(randomDisplay);
      cycles++;

      if (cycles >= maxCycles) {
        clearInterval(spinInterval);
        finishSpin(actualReward);
      }
    }, 100);
  }

  async function finishSpin(rewardAmt) {
    setDisplayNumber(rewardAmt);
    
    if (rewardAmt === 50) {
      setWinStatus("JACKPOT! 🎉");
    } else if (rewardAmt >= 10) {
      setWinStatus("BIG WIN! 🔥");
    } else {
      setWinStatus("Yield Secured ✓");
    }

    try {
      const { data: p } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', user.id)
        .single();

      await supabase
        .from('profiles')
        .update({
          points: (p?.points || 0) + rewardAmt,
          last_claim_date: new Date().toISOString()
        })
        .eq('id', user.id);

      if (user) {
        user.points = (user.points || 0) + rewardAmt;
      }

      if (showToast) showToast(`Acquired ${rewardAmt} PTS!`, 'success');
      
      setCanSpin(false);
      setHoursLeft(24);
      
    } catch (e) {
      if (showToast) showToast("Network error synchronizing points.", "error");
    } finally {
      setIsSpinning(false);
    }
  }

  if (loading) return null;

  const S = {
    card: { background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 20, padding: 24, textAlign: 'center', position: 'relative', overflow: 'hidden', boxShadow: '0 16px 32px rgba(0,0,0,0.2)' },
    title: { color: 'var(--ink)', fontSize: 16, fontWeight: 800, margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: "'Inter', sans-serif" },
    subtitle: { color: 'var(--slate)', fontSize: 13, marginBottom: 20, lineHeight: 1.4 },
    screenBox: { background: '#0D0D14', border: `2px solid ${canSpin ? 'var(--lime)' : 'var(--line)'}`, borderRadius: 16, padding: '24px 10px', margin: '0 auto 24px', position: 'relative', boxShadow: canSpin ? 'inset 0 0 20px rgba(168,255,62,0.1)' : 'none', transition: 'all 0.3s' },
    glowingNumber: { fontFamily: "'Inter', sans-serif", fontSize: 48, fontWeight: 800, color: canSpin || isSpinning || winStatus ? 'var(--lime)' : 'var(--slate)', lineHeight: 1, textShadow: (canSpin || isSpinning || winStatus) ? '0 0 20px rgba(168,255,62,0.4)' : 'none' },
    statusText: { fontSize: 12, fontWeight: 800, color: 'var(--lime)', letterSpacing: '1px', marginTop: 8, height: 16, textTransform: 'uppercase' },
    btnStyle: { background: canSpin && !isSpinning ? 'var(--lime)' : 'var(--surface)', color: canSpin && !isSpinning ? '#000' : 'var(--slate)', border: 'none', padding: '16px', borderRadius: 12, fontWeight: 800, fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.5px', width: '100%', cursor: canSpin && !isSpinning ? 'pointer' : 'not-allowed', transition: 'all 0.2s ease', fontFamily: "'Inter', sans-serif" },
  };

  return (
    <div style={S.card}>
      <h3 style={S.title}>Daily Network Yield</h3>
      <p style={S.subtitle}>Initiate the decrypter once every 24 hours to extract variable point rewards.</p>
      
      <div style={S.screenBox}>
        <div style={S.glowingNumber}>
          {displayNumber}
        </div>
        <div style={S.statusText}>
          {winStatus || (isSpinning ? "DECRYPTING..." : "")}
        </div>
      </div>
      
      <button onClick={handleSpin} disabled={!canSpin || isSpinning} style={S.btnStyle}>
        {isSpinning ? 'EXTRACTING...' : canSpin ? 'INITIATE EXTRACTION' : `LOCKED: ${hoursLeft}H REMAINING`}
      </button>

      <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 16, fontWeight: 600 }}>
        Powered by Cryptographic Randomization
      </div>
    </div>
  );
}
