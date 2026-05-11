import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Tasks({ session, navigate }) {
  const user = session?.user;
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [quotas, setQuotas] = useState({ videos: 0, blogs: 0 });
  const [lockout, setLockout] = useState(false);

  useEffect(function() {
    if (!user) return;
    fetchMarketplace();
  }, [user]);

  async function fetchMarketplace() {
    try {
      setLoading(true);
      
      // 🔥 SECURE DB LOCKOUT CHECK 🔥
      const { data: profile } = await supabase
        .from('profiles')
        .select('locked_until')
        .eq('id', user.id)
        .single();

      if (profile?.locked_until && new Date(profile.locked_until) > new Date()) {
        setLockout(true);
        setLoading(false);
        return; // Stop fetching tasks if locked
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data: history } = await supabase.from('completions').select('platform').eq('user_id', user.id).gte('created_at', today.toISOString());

      let vCount = 0, bCount = 0;
      (history || []).forEach(h => { if (h.platform === 'blog') bCount++; else vCount++; });
      setQuotas({ videos: vCount, blogs: bCount });

      const { data: activeTasks } = await supabase.from('tasks').select('*').eq('status', 'active');
      setTasks(activeTasks || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const S = {
    page: { padding: '40px 5%', maxWidth: 1040, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" },
    glassCard: { background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 24, padding: 40, boxShadow: '0 8px 32px rgba(0,0,0,0.04)', textAlign: 'center' },
    taskCard: { background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 16, padding: '24px', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, background 0.2s', boxShadow: '0 4px 16px rgba(0,0,0,0.02)' },
  };

  if (loading) return <div style={{ padding: '80px', textAlign: 'center', color: 'var(--slate)' }}>Scanning network...</div>;

  if (lockout) {
    return (
      <div style={S.page}>
        <div style={S.glassCard}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🔒</div>
          <h2 style={{ color: 'var(--ink)', fontSize: 24, fontFamily: "'Inter', sans-serif", marginBottom: 12 }}>Network Access Locked</h2>
          <p style={{ color: 'var(--slate)' }}>Your account is under a strict 24-hour restriction due to multiple failed verification attempts.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 32, color: 'var(--ink)', marginBottom: 8, fontWeight: 800, letterSpacing: '-0.5px' }}>Engagement Network</h1>
        <p style={{ color: 'var(--slate)', fontSize: 15 }}>Complete tasks to acquire points. Daily quotas apply.</p>
      </div>

      <div style={{ display: 'flex', gap: 20, marginBottom: 40, flexWrap: 'wrap' }}>
        <div style={{
