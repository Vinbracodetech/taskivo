import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const C = {
  surface: 'var(--surface)',
  card: 'var(--surface-card)',
  input: 'var(--surface-card)',
  textMain: 'var(--ink)',
  textMuted: 'var(--slate)',
  textInvert: 'var(--surface)',
  line: 'var(--line)',
  lime: '#A8FF3E',
  limeText: 'var(--lime)',
  limeDim: 'var(--lime-dim)',
  shadow: 'var(--shadow)',
};

export default function CreatorDashboard({ user, navigate, showToast }) {
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalEngagements: 0,
  });

  useEffect(function() {
    if (!user) return;
    fetchCreatorData();
  }, [user]);

  async function fetchCreatorData() {
    try {
      setLoading(true);
      // Fetch all campaigns created by this business user
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const fetchedCampaigns = data || [];
      
      // Calculate analytics
      let activeCount = 0;
      let engagements = 0;

      fetchedCampaigns.forEach(function(camp) {
        if (camp.status === 'active') activeCount++;
        engagements += camp.completed_slots || 0;
      });

      setStats({
        totalCampaigns: fetchedCampaigns.length,
        activeCampaigns: activeCount,
        totalEngagements: engagements,
      });
      
      setCampaigns(fetchedCampaigns);

    } catch (err) {
      console.error(err);
      if (showToast) showToast('Failed to load campaign data', 'error');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: '60px 5%', textAlign: 'center', color: C.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
        Loading Business Analytics...
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 5%', maxWidth: 1000, margin: '0 auto', fontFamily: "'DM Sans', sans-serif", paddingBottom: 120 }}>
      
      {/* HEADER */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 20, marginBottom: 40 }}>
        <div>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 28, color: C.textMain, marginBottom: 8, fontWeight: 800 }}>
            Business Overview
          </h1>
          <p style={{ color: C.textMuted, fontSize: 15 }}>Monitor your campaign performance and verified engagements.</p>
        </div>
        <button 
          onClick={function() { navigate('create-task'); }}
          style={{ background: C.limeText, color: '#ffffff', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: "'Inter', sans-serif", display: 'flex', alignItems: 'center', gap: 8 }}
        >
          <span>🚀</span> Launch Campaign
        </button>
      </div>

      {/* STATS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 40 }}>
        
        {/* Total Engagements */}
        <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 24, boxShadow: C.shadow }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Total Verified Engagements</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 40, fontWeight: 800, color: C.limeText, lineHeight: 1 }}>
            {stats.totalEngagements.toLocaleString()}
          </div>
          <div style={{ fontSize: 13, color: C.textMuted, marginTop: 8 }}>Across all omnichannel campaigns</div>
        </div>

        {/* Active Campaigns */}
        <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 24, boxShadow: C.shadow }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Active Campaigns</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 40, fontWeight: 800, color: C.textMain, lineHeight: 1 }}>
            {stats.activeCampaigns}
          </div>
          <div style={{ fontSize: 13, color: C.textMuted, marginTop: 8 }}>Currently delivering traffic</div>
        </div>

        {/* Total Campaigns */}
        <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 24, boxShadow: C.shadow }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Lifetime Campaigns</div>
          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 40, fontWeight: 800, color: C.textMain, lineHeight: 1 }}>
            {stats.totalCampaigns}
          </div>
          <div style={{ fontSize: 13, color: C.textMuted, marginTop: 8 }}>Historical campaign data</div>
        </div>
      </div>

      {/* RECENT CAMPAIGNS */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, color: C.textMain, margin: 0, fontWeight: 700 }}>Your Campaigns</h2>
        </div>

        {campaigns.length === 0 ? (
          <div style={{ background: C.card, border: `1px dashed ${C.line}`, borderRadius: 12, padding: 48, textAlign: 'center', boxShadow: C.shadow }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>📊</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.textMain, marginBottom: 8 }}>No campaigns launched yet</div>
            <div style={{ fontSize: 14, color: C.textMuted, maxWidth: 400, margin: '0 auto 24px' }}>
              Create your first campaign to drive verified human traffic to your videos or SEO blog articles.
            </div>
            <button 
              onClick={function() { navigate('create-task'); }}
              style={{ background: C.input, color: C.textMain, border: `1px solid ${C.line}`, borderRadius: 8, padding: '10px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
            >
              Draft First Campaign
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {campaigns.map(function(camp) {
              const progress = Math.min(((camp.completed_slots || 0) / camp.slots) * 100, 100);
              const isComplete = progress >= 100;
              const isPending = camp.status === 'pending_payment';
              
              let statusBadgeBg = C.input;
              let statusBadgeColor = C.textMuted;
              let statusText = 'Pending';

              if (camp.status === 'active') {
                statusBadgeBg = C.limeDim;
                statusBadgeColor = C.limeText;
                statusText = 'Active';
              } else if (isComplete || camp.status === 'completed') {
                statusBadgeBg = 'rgba(255,255,255,0.05)';
                statusBadgeColor = C.textMuted;
                statusText = 'Completed';
              }

              return (
                <div key={camp.id} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 24, display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center', justifyContent: 'space-between', boxShadow: C.shadow }}>
                  
                  {/* Title & Status */}
                  <div style={{ flex: '1 1 250px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <div style={{ fontSize: 16, fontWeight: 700, color: C.textMain }}>{camp.title}</div>
                      <div style={{ background: statusBadgeBg, color: statusBadgeColor, fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: 1 }}>
                        {statusText}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 13, color: C.textMuted, fontWeight: 500 }}>
                      <span style={{ textTransform: 'capitalize' }}>{camp.platform === 'blog' ? 'SEO Traffic' : camp.platform}</span>
                      <span>•</span>
                      <span>{camp.watch_duration}s Read/Watch time</span>
                    </div>
                  </div>

                  {/* Progress Bar Area */}
                  <div style={{ flex: '1 1 200px', minWidth: 200 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, color: C.textMuted, marginBottom: 8 }}>
                      <span>Engagement Delivery</span>
                      <span style={{ color: C.textMain }}>{camp.completed_slots || 0} / {camp.slots}</span>
                    </div>
                    <div style={{ height: 8, background: C.input, borderRadius: 10, overflow: 'hidden' }}>
                      <div style={{ width: `${progress}%`, height: '100%', background: isComplete ? C.textMuted : C.limeText, borderRadius: 10, transition: 'width 1s ease-in-out' }}></div>
                    </div>
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
