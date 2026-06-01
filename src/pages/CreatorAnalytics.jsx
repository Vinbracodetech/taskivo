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

  // 🔥 PREMIUM FINTECH STYLE OBJECT 🔥
  const S = {
    pageWrapper: {
      minHeight: '100vh',
      backgroundColor: '#0a0a0c',
      backgroundImage: `
        radial-gradient(circle at 15% 50px, rgba(212, 175, 55, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 85% 30%, rgba(168, 255, 62, 0.04) 0%, transparent 50%),
        url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z' fill='none' stroke='%23ffffff' stroke-width='1' stroke-opacity='0.02'/%3E%3C/svg%3E")
      `,
      backgroundSize: '100% 100%, 100% 100%, 40px 40px',
      backgroundAttachment: 'fixed',
    },
    page: { padding: '40px 5%', maxWidth: 1100, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", position: 'relative' },
    
    glassCard: { 
      background: 'rgba(255, 255, 255, 0.02)', 
      border: '1px solid rgba(255, 255, 255, 0.06)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: 20, 
      padding: 32, 
      boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)'
    },

    header: { fontFamily: "'Inter', sans-serif", fontSize: 32, color: '#ffffff', fontWeight: 700, margin: '0 0 8px 0', letterSpacing: '-0.5px' },
    subHeader: { color: 'rgba(255, 255, 255, 0.6)', margin: '0 0 32px 0', fontSize: 15, fontWeight: 400 },
    
    metricValue: { fontFamily: "'Inter', sans-serif", fontSize: 48, color: '#ffffff', fontWeight: 800, letterSpacing: '-1px', margin: '8px 0', lineHeight: 1 },
    metricLabel: { fontSize: 11, color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', fontFamily: "'Inter', sans-serif", display: 'block', marginBottom: 12 },
    
    btnSecondary: { background: 'rgba(255,255,255,0.05)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', sans-serif", transition: 'background 0.2s' }
  };

  if (loading) {
    return (
      <div style={{ ...S.pageWrapper, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
          <div style={{ width: 32, height: 32, border: '2px solid rgba(255, 255, 255, 0.1)', borderTopColor: '#D4AF37', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
          <div style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: 11, fontWeight: 700 }}>Compiling analytics telemetry...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.pageWrapper}>
      <div style={S.page}>
        <div style={{ marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <h1 style={S.header}>Data & Telemetry</h1>
            <p style={{ ...S.subHeader, marginBottom: 0 }}>Network penetration and algorithmic ROI metrics.</p>
          </div>
          <button onClick={() => navigate('creator-dashboard')} style={S.btnSecondary}>← Command Center</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 40 }}>
          <div style={S.glassCard}>
            <span style={S.metricLabel}>Global Yield (Verified Engagements)</span>
            <div style={S.metricValue}>{metrics.totalVerified.toLocaleString()}</div>
          </div>
          <div style={{ ...S.glassCard, background: 'rgba(168, 255, 62, 0.03)', border: '1px solid rgba(168, 255, 62, 0.2)' }}>
            <span style={{ ...S.metricLabel, color: 'rgba(255,255,255,0.7)' }}>Network Fulfillment Rate</span>
            <div style={{ ...S.metricValue, color: metrics.completionRate > 50 ? '#a8ff3e' : '#ffffff' }}>{metrics.completionRate}%</div>
          </div>
        </div>

        <div style={S.glassCard}>
          <span style={{ ...S.metricLabel, marginBottom: 24, color: '#ffffff' }}>Campaign Performance Matrix</span>
          {campaigns.length === 0 ? (
            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, textAlign: 'center', padding: 40, fontFamily: "'Inter', sans-serif" }}>Awaiting deployment data.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {campaigns.map(c => {
                const pct = Math.round(((c.current_views || 0) / (c.target_views || 1)) * 100);
                const isComplete = pct >= 100;
                return (
                  <div key={c.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                      <div style={{ fontSize: 14, color: '#ffffff', fontWeight: 600, fontFamily: "'Inter', sans-serif" }}>{c.title}</div>
                      <div style={{ fontSize: 13, color: isComplete ? '#a8ff3e' : 'rgba(255,255,255,0.6)', fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>{pct}%</div>
                    </div>
                    <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: isComplete ? '#a8ff3e' : '#D4AF37', borderRadius: 4, transition: 'width 0.5s ease-out' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
