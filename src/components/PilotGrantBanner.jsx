import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function PilotGrantBanner() {
  const [slotsRemaining, setSlotsRemaining] = useState(10);
  const [loading, setLoading] = useState(true);

  const TOTAL_SLOTS = 10;

  useEffect(() => {
    async function fetchTakenSlots() {
      try {
        // We count how many profiles currently have free credits
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .gt('free_credits', 0);

        if (!error && count !== null) {
          // Calculate remaining slots (minimum 0)
          const remaining = Math.max(0, TOTAL_SLOTS - count);
          setSlotsRemaining(remaining);
        }
      } catch (err) {
        console.error("Failed to fetch slots:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTakenSlots();
  }, []);

  if (loading || slotsRemaining <= 0) return null; // Hides banner if sold out

  return (
    <div style={{ 
      background: 'linear-gradient(90deg, rgba(20, 20, 20, 1) 0%, rgba(30, 41, 59, 1) 100%)', 
      borderBottom: '1px solid var(--line)', 
      borderTop: '1px solid var(--lime)', 
      padding: '12px 20px', 
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 20px rgba(168,255,62,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span style={{ 
          background: 'rgba(168,255,62,0.1)', 
          color: 'var(--lime)', 
          padding: '4px 10px', 
          borderRadius: '100px', 
          fontSize: '11px', 
          fontWeight: '800', 
          letterSpacing: '1px',
          textTransform: 'uppercase',
          border: '1px solid rgba(168,255,62,0.3)'
        }}>
          🔥 Early Adopter Pilot
        </span>
        
        <span style={{ color: 'var(--ink)', fontSize: '14px', fontFamily: "'Inter', sans-serif", fontWeight: '600' }}>
          Creators: We are covering the cost of your first 20 Campaign Verifications.
        </span>
      </div>

      <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--slate)', fontWeight: '500' }}>
        Only <strong style={{ color: 'var(--lime)', fontSize: '15px' }}>{slotsRemaining}</strong> of {TOTAL_SLOTS} Creator Grants remaining.
      </div>
    </div>
  );
}
