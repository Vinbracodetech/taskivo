import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function CreatorAnalytics({ user, navigate, showToast }) {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ totalDeployed: 0, totalVerified: 0, completionRate: 0 });
  const [campaigns, setCampaigns] = useState([]);

  useEffect(function() {
    if (!user) return;
    fetchAnalytics();
  }, [user]);

  async function fetchAnalytics() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('id, title, platform, target_views, current_views, status, created_at')
        .eq('creator_id', user.id);

      if (error) throw error;

      let deployed = 0;
      let verified = 0;
      
      (data || []).forEach(t => {
        deployed += (t.target_views || 0);
        verified += (t.current_views || 0);
      });

      setMetrics({
        totalDeployed: deployed,
        totalVerified: verified,
        completionRate: deployed > 0 ? Math.round((verified / deployed) * 100) : 0
      });
      
      setCampaigns(data || []);
    } catch (err) {
      if (showToast) showToast('Failed to load telemetry.', 'error');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '80px 5%', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
        <div style={{ width: 24, height: 24, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#fff', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
        Compiling analytics telemetry...
      </div>
    );
  }

  const S = {
    page: { padding: '40px 5%', maxWidth: 1100, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", position: 'relative' },
    glassCard: { background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, backdropFilter: 'blur(20px)', padding: 32 },
    label: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.4)', marginBottom: 12, display: 'block', fontFamily: "'Inter', sans-serif" },
    value: { fontFamily: "'Inter', sans-serif", fontSize: 48, fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: '-1px' },
  };

  return (
    <div style={S.page}>
      <div style={{ marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 32, color: '#fff', marginBottom: 8, fontWeight: 800, letterSpacing: '-0.5px' }}>Data & Telemetry</h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, margin: 0 }}>Network penetration and algorithmic ROI metrics.</p>
        </div>
        <button onClick={() => navigate('creator-dashboard')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: 10, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>← Command Center</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 40 }}>
        <div style={S.glassCard}>
          <span style={S.label}>Global Yield (Verified Engagements)</span>
          <div style={S.value}>{metrics.totalVerified.toLocaleString()}</div>
        </div>
        <div style={S.glassCard}>
          <span style={S.label}>Network Fulfillment Rate</span>
          <div style={{ ...S.value, color: metrics.completionRate > 50 ? '#A8FF3E' : '#fff' }}>{metrics.completionRate}%</div>
        </div>
      </div>

      <div style={S.glassCard}>
        <span style={{ ...S.label, marginBottom: 24 }}>Campaign Performance Matrix</span>
        {campaigns.length === 0 ? (
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, textAlign: 'center', padding: 40 }}>Awaiting deployment data.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {campaigns.map(c => {
              const pct = Math.round(((c.current_views || 0) / (c.target_views || 1)) * 100);
              return (
                <div key={c.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                    <div style={{ fontSize: 14, color: '#fff', fontWeight: 600 }}>{c.title}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{pct}%</div>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: 'linear-gradient(90deg, rgba(255,255,255,0.4) 0%, #fff 100%)', borderRadius: 4 }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
