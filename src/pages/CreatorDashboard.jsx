import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const C = {
  surface: 'var(--surface)', card: 'var(--surface-card)',
  textMain: 'var(--ink)', textMuted: 'var(--slate)', line: 'var(--line)',
  lime: '#A8FF3E', limeText: 'var(--lime)', shadow: 'var(--shadow)',
};

export default function CreatorDashboard({ user, navigate }) {
  const [stats, setStats] = useState({ activeTasks: 0, totalSlots: 0, completedSlots: 0 });

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from('tasks').select('*').eq('user_id', user.id);
      if (data) {
        setStats({
          activeTasks: data.filter(t => t.status === 'active').length,
          totalSlots: data.reduce((acc, t) => acc + (t.slots || 0), 0),
          completedSlots: data.reduce((acc, t) => acc + (t.completed_slots || 0), 0),
        });
      }
    }
    fetchData();
  }, [user]);

  return (
    <div style={{ padding: '40px 5%', maxWidth: 1000, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
      <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 28, color: C.textMain, marginBottom: 8, fontWeight: 800 }}>Business Overview</h1>
      <p style={{ color: C.textMuted, fontSize: 15, marginBottom: 40 }}>Welcome back, {user.full_name || 'Creator'}.</p>
      
      {/* PACKAGE STATUS BOARD */}
      <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 32, marginBottom: 32, boxShadow: C.shadow }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>Network Allocation Status</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
          <div>
            <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 4 }}>Active Campaigns</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 32, fontWeight: 800, color: C.textMain }}>{stats.activeTasks}</div>
          </div>
          <div>
            <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 4 }}>Deployed Slots</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 32, fontWeight: 800, color: C.textMain }}>{stats.totalSlots.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ fontSize: 14, color: C.textMuted, marginBottom: 4 }}>Verified Engagements</div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 32, fontWeight: 800, color: C.limeText }}>{stats.completedSlots.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
        <div onClick={() => navigate('create-task')} style={{ background: C.card, border: `1px solid ${C.line}`, padding: 32, borderRadius: 16, cursor: 'pointer', boxShadow: C.shadow }}>
          <div style={{ fontSize: 24, marginBottom: 16 }}>🚀</div>
          <h3 style={{ fontSize: 18, color: C.textMain, fontWeight: 700 }}>Launch Campaign</h3>
          <p style={{ color: C.textMuted, fontSize: 13, marginTop: 8 }}>Deploy new slots to the network.</p>
        </div>
        <div onClick={() => navigate('creator-tasks')} style={{ background: C.card, border: `1px solid ${C.line}`, padding: 32, borderRadius: 16, cursor: 'pointer', boxShadow: C.shadow }}>
          <div style={{ fontSize: 24, marginBottom: 16 }}>📊</div>
          <h3 style={{ fontSize: 18, color: C.textMain, fontWeight: 700 }}>Manage Campaigns</h3>
          <p style={{ color: C.textMuted, fontSize: 13, marginTop: 8 }}>View draft and active campaign progress.</p>
        </div>
      </div>
    </div>
  );
}
