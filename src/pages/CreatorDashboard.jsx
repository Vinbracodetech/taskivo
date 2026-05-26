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
          slots += (t.target_views || 0);
          verified += (t.current_views || 0);
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
      <div style={{ padding: '80px 5%', textAlign: 'center', color: 'var(--slate)', fontFamily: "var(--font-body)", fontSize: 14 }}>
        <div style={{ width: 24, height: 24, border: '2px solid var(--line)', borderTopColor: 'var(--ink)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
        Authenticating B2B terminal...
      </div>
    );
  }

  const S = {
    page: { padding: '40px 5%', maxWidth: 1100, margin: '0 auto', fontFamily: "var(--font-body)", position: 'relative' },
    glassCard: { background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 20, padding: 32, boxShadow: 'var(--shadow)' },
    metricLabel: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--slate)', marginBottom: 12, display: 'block', fontFamily: "var(--font-display)" },
    metricValue: { fontFamily: "var(--font-display)", fontSize: 42, fontWeight: 800, color: 'var(--ink)', lineHeight: 1, letterSpacing: '-1px' },
    btnPrimary: { background: 'var(--ink)', border: 'none', color: 'var(--surface)', borderRadius: 10, padding: '14px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', display: 'inline-block', fontFamily: "var(--font-display)" },
    btnGhost: { background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--ink)', borderRadius: 10, padding: '14px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'inline-block', fontFamily: "var(--font-display)" },
  };

  return (
    <div style={S.page}>
      
      {/* 🔥 THE COMMAND CENTER HEADER 🔥 */}
      <div style={{ marginBottom: 48, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, color: 'var(--ink)', marginBottom: 8, fontWeight: 800, letterSpacing: '-0.5px' }}>
            Business Command
          </h1>
          <p style={{ color: 'var(--slate)', fontSize: 15, fontWeight: 400, margin: 0 }}>Monitor active campaigns and verified engagements.</p>
        </div>
        
        {/* NEW BUTTONS FOR HISTORY AND APPROVALS */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button onClick={() => navigate('history')} style={S.btnGhost}>Billing Ledger</button>
          <button onClick={() => navigate('creator-approvals')} style={S.btnGhost}>Review Submissions</button>
          <button onClick={() => navigate('creator-tasks')} style={S.btnGhost}>All Campaigns</button>
          <button onClick={() => navigate('create-task')} style={S.btnPrimary}>+ New Campaign</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 48 }}>
        
        <div style={S.glassCard}>
          <span style={S.metricLabel}>Total Deployed Campaigns</span>
          <div style={S.metricValue}>{stats.totalCampaigns}</div>
          <div style={{ marginTop: 16, height: 2, background: 'var(--line)', borderRadius: 2 }} />
        </div>

        <div style={S.glassCard}>
          <span style={S.metricLabel}>Allocated Engagement Slots</span>
          <div style={S.metricValue}>{stats.activeSlots.toLocaleString()}</div>
          <div style={{ marginTop: 16, height: 2, background: 'var(--line)', borderRadius: 2 }} />
        </div>

        <div style={{ ...S.glassCard, border: '1px solid var(--lime)', background: 'var(--surface)' }}>
          <span style={{ ...S.metricLabel, color: 'var(--ink)' }}>Verified Engagements (ROI)</span>
          <div style={S.metricValue}>{stats.verifiedEngagements.toLocaleString()}</div>
          <div style={{ marginTop: 16, height: 2, background: 'var(--lime)', borderRadius: 2 }} />
        </div>
      </div>

      <div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 700, color: 'var(--ink)', margin: '0 0 24px 0', letterSpacing: '-0.5px' }}>Recent Deployments</h2>
        
        {recentCampaigns.length === 0 ? (
          <div style={{ ...S.glassCard, padding: 60, textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--slate)', letterSpacing: '0.5px', marginBottom: 20 }}>No campaigns have been deployed yet.</div>
            <button onClick={() => navigate('create-task')} style={S.btnPrimary}>Launch First Campaign</button>
          </div>
        ) : (
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 20, overflow: 'hidden' }}>
            
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 16, padding: '16px 24px', background: 'var(--surface)', borderBottom: '1px solid var(--line)' }} className="hide-on-mobile">
              <span style={S.metricLabel}>Campaign Designation</span>
              <span style={S.metricLabel}>Platform</span>
              <span style={S.metricLabel}>Fulfillment</span>
              <span style={{ ...S.metricLabel, textAlign: 'right' }}>Status</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {recentCampaigns.map(function(campaign, index) {
                const isLast = index === recentCampaigns.length - 1;
                const fulfillment = Math.round(((campaign.current_views || 0) / (campaign.target_views || 1)) * 100);
                
                return (
                  <div key={campaign.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16, padding: '20px 24px', borderBottom: isLast ? 'none' : '1px solid var(--line)', alignItems: 'center' }}>
                    
                    <div>
                      <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 600, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{campaign.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--slate)', fontFamily: 'monospace' }}>ID: {campaign.id.split('-')[0]}</div>
                    </div>

                    <div style={{ fontSize: 13, color: 'var(--slate)', fontWeight: 600, textTransform: 'capitalize' }}>
                      {campaign.platform.replace('_', ' ')}
                    </div>
                    
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>{fulfillment}%</div>
                      <div style={{ height: 4, background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 2, overflow: 'hidden', width: '80%' }}>
                        <div style={{ height: '100%', width: `${fulfillment}%`, background: 'var(--ink)', borderRadius: 2 }}></div>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ background: campaign.status === 'active' ? 'var(--ink)' : 'var(--surface)', color: campaign.status === 'active' ? 'var(--surface)' : 'var(--slate)', border: '1px solid var(--line)', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '1px', display: 'inline-block' }}>
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
