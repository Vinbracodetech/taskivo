import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function CreatorDashboard({ user, navigate, showToast }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalCampaigns: 0, activeSlots: 0, verifiedEngagements: 0 });
  const [recentCampaigns, setRecentCampaigns] = useState([]);

  useEffect(function() {
    if (!user) return;
    fetchCreatorData();
  }, [user]);

  async function fetchCreatorData() {
    try {
      setLoading(true);
      // Fetch creator's specific tasks
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      let slots = 0;
      let verified = 0;
      
      if (tasks) {
        tasks.forEach(function(t) {
          slots += (t.target_views || 0); // Adjust field name to your schema
          verified += (t.current_views || 0); // Adjust field name to your schema
        });
      }

      setStats({
        totalCampaigns: tasks ? tasks.length : 0,
        activeSlots: slots,
        verifiedEngagements: verified
      });
      
      setRecentCampaigns(tasks ? tasks.slice(0, 3) : []);
    } catch (err) {
      if (showToast) showToast('Failed to sync campaign data', 'error');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '80px 5%', textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', sans-serif", fontSize: 14 }}>
        <div style={{ width: 24, height: 24, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#fff', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
        Authenticating B2B terminal...
      </div>
    );
  }

  // ── ENTERPRISE B2B STYLES (NO POINTS/LIME GREEN, STRICTLY CORPORATE) ──
  const S = {
    page: { padding: '40px 5%', maxWidth: 1100, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", position: 'relative' },
    glassCard: { background: 'linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.005) 100%)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, backdropFilter: 'blur(20px)', padding: 32 },
    metricLabel: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.4)', marginBottom: 12, display: 'block', fontFamily: "'Inter', sans-serif" },
    metricValue: { fontFamily: "'Inter', sans-serif", fontSize: 42, fontWeight: 800, color: '#fff', lineHeight: 1, letterSpacing: '-1px' },
    btnPrimary: { background: '#fff', border: 'none', color: '#000', borderRadius: 10, padding: '14px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', display: 'inline-block', fontFamily: "'Inter', sans-serif", boxShadow: '0 4px 12px rgba(255,255,255,0.1)' },
    btnGhost: { background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: 10, padding: '14px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'inline-block', fontFamily: "'Inter', sans-serif" },
  };

  return (
    <div style={S.page}>
      
      {/* BACKGROUND GLOW (Corporate Blue/Slate) */}
      <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, background: 'radial-gradient(ellipse, rgba(255,255,255,0.03) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* HEADER */}
      <div style={{ marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20, position: 'relative', zIndex: 1 }}>
        <div>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 32, color: '#fff', marginBottom: 8, fontWeight: 800, letterSpacing: '-0.5px' }}>
            Business Command
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, fontWeight: 400, margin: 0 }}>Monitor active campaigns and verified engagements.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={function() { navigate('creator-tasks'); }} style={S.btnGhost}>View All Campaigns</button>
          <button onClick={function() { navigate('create-task'); }} style={S.btnPrimary}>+ New Campaign</button>
        </div>
      </div>

      {/* ENTERPRISE METRICS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 48, position: 'relative', zIndex: 1 }}>
        
        <div style={S.glassCard}>
          <span style={S.metricLabel}>Total Deployed Campaigns</span>
          <div style={S.metricValue}>{stats.totalCampaigns}</div>
          <div style={{ marginTop: 16, height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }} />
        </div>

        <div style={S.glassCard}>
          <span style={S.metricLabel}>Allocated Engagement Slots</span>
          <div style={S.metricValue}>{stats.activeSlots.toLocaleString()}</div>
          <div style={{ marginTop: 16, height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }} />
        </div>

        <div style={{ ...S.glassCard, background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)', border: '1px solid rgba(255,255,255,0.15)' }}>
          <span style={{ ...S.metricLabel, color: '#fff' }}>Verified Engagements (ROI)</span>
          <div style={S.metricValue}>{stats.verifiedEngagements.toLocaleString()}</div>
          <div style={{ marginTop: 16, height: 2, background: 'rgba(255,255,255,0.2)', borderRadius: 2 }} />
        </div>
      </div>

      {/* RECENT CAMPAIGNS LEDGER */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 24px 0', letterSpacing: '-0.5px' }}>Recent Deployments</h2>
        
        {recentCampaigns.length === 0 ? (
          <div style={{ ...S.glassCard, padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.5px', marginBottom: 20 }}>No campaigns have been deployed yet.</div>
            <button onClick={function() { navigate('create-task'); }} style={S.btnPrimary}>Launch First Campaign</button>
          </div>
        ) : (
          <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 20, overflow: 'hidden' }}>
            
            {/* Ledger Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 16, padding: '16px 24px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="hide-on-mobile">
              <span style={S.metricLabel}>Campaign Designation</span>
              <span style={S.metricLabel}>Platform</span>
              <span style={S.metricLabel}>Fulfillment</span>
              <span style={{ ...S.metricLabel, textAlign: 'right' }}>Status</span>
            </div>

            {/* Ledger Rows */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {recentCampaigns.map(function(campaign, index) {
                const isLast = index === recentCampaigns.length - 1;
                const fulfillment = Math.round(((campaign.current_views || 0) / (campaign.target_views || 1)) * 100);
                
                return (
                  <div key={campaign.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, padding: '20px 24px', borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)', alignItems: 'center' }}>
                    
                    <div>
                      <div style={{ fontSize: 14, color: '#fff', fontWeight: 600, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{campaign.title}</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>ID: {campaign.id.split('-')[0]}</div>
                    </div>

                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 600, textTransform: 'capitalize' }}>
                      {campaign.platform}
                    </div>
                    
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{fulfillment}%</div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden', width: '80%' }}>
                        <div style={{ height: '100%', width: `${fulfillment}%`, background: '#fff', borderRadius: 2 }}></div>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ background: campaign.status === 'active' ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.02)', color: campaign.status === 'active' ? '#fff' : 'rgba(255,255,255,0.4)', border: `1px solid ${campaign.status === 'active' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}`, fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '1px', display: 'inline-block' }}>
                        {campaign.status}
                      </span>
                    </div>
                    
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
