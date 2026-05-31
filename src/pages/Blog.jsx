import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// ── THE BLOG INDEX ──
export function BlogIndex({ navigate }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data } = await supabase
          .from('posts')
          .select('title, slug, meta_desc, category, created_at')
          .eq('status', 'published')
          .order('created_at', { ascending: false });
        setPosts(data || []);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) return <div style={{ padding: 100, textAlign: 'center', color: 'var(--slate)' }}>Loading Intelligence...</div>;

  return (
    <div style={{ padding: '80px 5%', maxWidth: 1000, margin: '0 auto', fontFamily: "var(--font-body)" }}>
      <h1 style={{ fontSize: 40, fontFamily: "var(--font-display)", fontWeight: 800, color: 'var(--ink)', marginBottom: 16, letterSpacing: '-1px' }}>Taskivo Intelligence</h1>
      <p style={{ fontSize: 16, color: 'var(--slate)', marginBottom: 48 }}>Insights on digital engagement, algorithmic growth, and maximizing yield.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        {posts.length === 0 ? (
          <div style={{ color: 'var(--slate)' }}>No articles published yet.</div>
        ) : (
          posts.map(post => (
            <div key={post.slug} onClick={() => navigate(`article-${post.slug}`)} style={{ background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 16, padding: 24, cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
              <div style={{ display: 'inline-block', background: post.category === 'creator' ? 'rgba(212,175,55,0.1)' : 'rgba(168,255,62,0.1)', color: post.category === 'creator' ? '#D4AF37' : 'var(--lime)', fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 4, textTransform: 'uppercase', marginBottom: 16 }}>
                {post.category}
              </div>
              <h2 style={{ fontSize: 20, color: 'var(--ink)', fontWeight: 800, marginBottom: 12, lineHeight: 1.3, fontFamily: "var(--font-display)" }}>{post.title}</h2>
              <p style={{ color: 'var(--slate)', fontSize: 14, lineHeight: 1.5, marginBottom: 16 }}>{post.meta_desc}</p>
              <div style={{ fontSize: 12, color: 'var(--slate)', fontWeight: 600 }}>{new Date(post.created_at).toLocaleDateString()}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ── THE ARTICLE VIEW (With Auto-Claim Engine) ──
export function ArticleView({ navigate, id, user, setAuthMode }) {
  const [post, setPost] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120); 
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const slug = id.replace('article-', ''); 

  const isActiveMission = localStorage.getItem('taskivo_active_mission') === slug;

  useEffect(() => {
    async function fetchPost() {
      const { data } = await supabase.from('posts').select('*').eq('slug', slug).single();
      if (data) {
        setPost(data);
        document.title = `${data.title} | Taskivo`;
      }
    }
    fetchPost();
  }, [slug]);

  // The Secure Visibility Timer & Auto-Claim Trigger
  useEffect(() => {
    if (!post || user?.role !== 'earner' || !isActiveMission) return;
    
    const interval = setInterval(() => {
      if (!document.hidden && !claimed && !claiming) {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleAutoClaim();
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [post, claimed, claiming, user, isActiveMission]);

  async function handleAutoClaim() {
    setClaiming(true);
    try {
      // 1. Ensure they haven't already claimed it
      const { data: existing } = await supabase.from('blog_reads').select('*').eq('user_id', user.id).eq('post_slug', slug).single();
      
      if (!existing) {
        // 2. Mark as read in the database
        await supabase.from('blog_reads').insert({ user_id: user.id, post_slug: slug });
        
        // 3. Add 10 PTS directly to profile
        const { data: profile } = await supabase.from('profiles').select('points').eq('id', user.id).single();
        await supabase.from('profiles').update({ points: profile.points + 10 }).eq('id', user.id);
      }
      
      setClaimed(true);
      localStorage.removeItem('taskivo_active_mission');
    } catch(err) {
      console.error("Auto-claim error", err);
      setClaiming(false); // Let them retry if it fails
    }
  }

  // Forces the global state to refresh the balance when returning to the feed
  function completeMissionAndReturn() {
    window.location.hash = 'tasks';
    window.location.reload();
  }

  if (!post) return <div style={{ padding: 100, textAlign: 'center', color: 'var(--slate)' }}>Decrypting article...</div>;

  return (
    <div style={{ padding: '80px 5%', maxWidth: 700, margin: '0 auto', fontFamily: "var(--font-body)" }}>
      <button onClick={() => navigate('tasks')} style={{ background: 'transparent', border: 'none', color: 'var(--slate)', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 32 }}>← Return to Missions</button>
      
      <div style={{ display: 'inline-block', background: post.category === 'creator' ? 'rgba(212,175,55,0.1)' : 'rgba(168,255,62,0.1)', color: post.category === 'creator' ? '#D4AF37' : 'var(--lime)', fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 4, textTransform: 'uppercase', marginBottom: 16 }}>
        {post.category}
      </div>
      <h1 style={{ fontSize: 36, fontFamily: "var(--font-display)", fontWeight: 800, color: 'var(--ink)', marginBottom: 24, lineHeight: 1.2, letterSpacing: '-1px' }}>{post.title}</h1>
      
      <div 
        style={{ color: 'var(--ink)', fontSize: 16, lineHeight: 1.8, marginBottom: 48 }} 
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />

      {/* ── AUTO-CLAIM RENDERING ENGINE ── */}
      {user?.role === 'earner' && isActiveMission && (
        <div style={{ background: 'var(--surface-card)', border: claimed ? '1px solid var(--lime)' : '1px solid var(--line)', borderRadius: 16, padding: 32, textAlign: 'center', boxShadow: 'var(--shadow)' }}>
          {claimed ? (
            <div>
              <div style={{ width: 48, height: 48, background: 'var(--lime-dim)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid var(--lime)', color: 'var(--lime)', fontSize: 20 }}>✓</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink)', fontFamily: 'var(--font-display)', marginBottom: 8 }}>Mission Accomplished</div>
              <div style={{ color: 'var(--slate)', fontSize: 15, marginBottom: 24 }}>10 PTS has been successfully added to your treasury.</div>
              <button onClick={completeMissionAndReturn} style={{ background: 'var(--lime)', color: '#000', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 800, cursor: 'pointer' }}>Return to Feed</button>
            </div>
          ) : claiming ? (
            <div>
              <div style={{ width: 24, height: 24, border: '2px solid var(--line)', borderTopColor: 'var(--lime)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--lime)', textTransform: 'uppercase', letterSpacing: '1px' }}>Securing Liquidity...</div>
            </div>
          ) : (
            <div>
              <div style={{ width: 24, height: 24, border: '2px solid var(--line)', borderTopColor: '#ef4444', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
              <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>Verifying Human Presence</div>
              <div style={{ color: 'var(--slate)', fontSize: 14, marginBottom: 16 }}>You must keep this tab open and active to claim your 10 PTS.</div>
              <div style={{ fontSize: 40, fontWeight: 800, color: '#ef4444', fontFamily: "var(--font-display)" }}>
                {timeLeft}s
              </div>
            </div>
          )}
        </div>
      )}

      {/* State 2: Guest Marketing */}
      {!user && (
        <div style={{ background: 'var(--ink)', border: '1px solid var(--lime)', borderRadius: 16, padding: 32, textAlign: 'center', boxShadow: '0 8px 32px rgba(168,255,62,0.1)' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: '#fff', fontFamily: "var(--font-display)", marginBottom: 8 }}>Monetize Your Attention.</div>
          <p style={{ color: 'var(--slate)', fontSize: 15, marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>Taskivo earners get paid fiat currency for reading articles just like this one.</p>
          <button onClick={() => { if(setAuthMode) setAuthMode('register'); navigate('auth'); }} style={{ background: 'var(--lime)', color: '#000', border: 'none', padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: "var(--font-display)" }}>
            Create Free Earner Account
          </button>
        </div>
      )}
    </div>
  );
}
