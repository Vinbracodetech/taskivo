import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// ── ELITE ARTICLE TYPOGRAPHY ENGINE ──
const proseStyles = `
  .article-prose { color: var(--slate); font-size: 17px; line-height: 1.8; font-family: 'DM Sans', sans-serif; }
  .article-prose h2 { color: var(--ink); font-size: 24px; font-weight: 800; margin: 48px 0 16px 0; font-family: 'Inter', sans-serif; letter-spacing: -0.5px; }
  .article-prose h3 { color: var(--ink); font-size: 20px; font-weight: 700; margin: 32px 0 12px 0; font-family: 'Inter', sans-serif; }
  .article-prose p { margin-bottom: 24px; }
  .article-prose blockquote { border-left: 4px solid var(--lime); padding-left: 20px; font-style: italic; color: var(--slate); background: rgba(168,255,62,0.05); padding: 16px 20px; border-radius: 0 12px 12px 0; margin: 32px 0; }
  .article-prose ul { padding-left: 20px; margin-bottom: 24px; }
  .article-prose li { margin-bottom: 12px; }
  .article-prose strong { color: var(--ink); font-weight: 700; }
  .article-prose a { color: var(--lime); text-decoration: none; border-bottom: 1px solid rgba(168,255,62,0.3); transition: border-color 0.2s; }
`;

// ── SHARED BACKGROUND STYLES ──
const S = {
  pageWrapper: {
    minHeight: '100vh',
    backgroundColor: 'var(--surface)',
    backgroundImage: `
      radial-gradient(circle at top center, rgba(168,255,62,0.15) 0%, transparent 60%),
      url("data:image/svg+xml,%3Csvg width='80' height='138.6' viewBox='0 0 80 138.6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 138.6L0 115.5V69.3l40-23.1 40 23.1v46.2zM40 46.2L0 23.1V-23.1l40-23.1 40 23.1v46.2z' fill='none' stroke='%23A8FF3E' stroke-width='2' stroke-opacity='0.1'/%3E%3C/svg%3E")
    `,
    backgroundSize: '100%, 80px 138.6px',
    backgroundAttachment: 'fixed',
  }
};

// ── THE BLOG INDEX ──
export function BlogIndex({ navigate }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('title, slug, meta_desc, category, created_at')
          .eq('status', 'published')
          .order('created_at', { ascending: false });
          
        if (error) console.error("Error fetching posts:", error);
        setPosts(data || []);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) return (
    <div style={S.pageWrapper}>
      <div style={{ padding: 100, textAlign: 'center', color: 'var(--slate)' }}>
        <div style={{ width: 32, height: 32, border: '2px solid var(--line)', borderTopColor: 'var(--lime)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
        Loading Intelligence...
      </div>
    </div>
  );

  return (
    <div style={S.pageWrapper}>
      <div style={{ padding: '80px 5%', maxWidth: 1040, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" }}>
        <h1 style={{ fontSize: 48, fontFamily: "'Inter', sans-serif", fontWeight: 800, color: 'var(--ink)', marginBottom: 16, letterSpacing: '-1.5px' }}>Taskivo Intelligence</h1>
        <p style={{ fontSize: 18, color: 'var(--slate)', marginBottom: 56, maxWidth: 600 }}>Insights on digital engagement, algorithmic growth, and maximizing yield.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
          {posts.length === 0 ? (
            <div style={{ color: 'var(--slate)' }}>No articles published yet.</div>
          ) : (
            posts.map(post => {
              // High-end dynamic placeholders based on category
              const imgUrl = post.category === 'creator' 
                ? 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop'
                : 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop';

              return (
                <div key={post.slug} onClick={() => navigate(`article-${post.slug}`)} style={{ background: 'var(--surface-card)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 24, cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  
                  {/* Cinematic Card Header Image */}
                  <div style={{ height: 180, backgroundImage: `url(${imgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 0%, var(--surface-card) 100%)' }} />
                    <div style={{ position: 'absolute', bottom: 16, left: 24, display: 'inline-block', background: post.category === 'creator' ? 'rgba(212,175,55,0.9)' : 'rgba(168,255,62,0.9)', color: '#000', fontSize: 10, fontWeight: 800, padding: '6px 12px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      {post.category}
                    </div>
                  </div>

                  <div style={{ padding: '8px 24px 32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{ fontSize: 12, color: 'var(--slate)', fontWeight: 600 }}>{new Date(post.created_at).toLocaleDateString()}</div>
                    </div>
                    <h2 style={{ fontSize: 22, color: 'var(--ink)', fontWeight: 800, marginBottom: 12, lineHeight: 1.3, fontFamily: "'Inter', sans-serif", letterSpacing: '-0.5px' }}>{post.title}</h2>
                    <p style={{ color: 'var(--slate)', fontSize: 15, lineHeight: 1.6, margin: 0 }}>{post.meta_desc}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ── THE ELITE ARTICLE VIEW ──
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

  // Secure Visibility Timer
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
      const { data: existing } = await supabase.from('blog_reads').select('*').eq('user_id', user.id).eq('post_slug', slug).single();
      
      if (!existing) {
        await supabase.from('blog_reads').insert({ user_id: user.id, post_slug: slug });
        const { data: profile } = await supabase.from('profiles').select('points').eq('id', user.id).single();
        await supabase.from('profiles').update({ points: profile.points + 10 }).eq('id', user.id);
      }
      
      setClaimed(true);
      localStorage.removeItem('taskivo_active_mission');
    } catch(err) {
      console.error("Auto-claim error", err);
      setClaiming(false); 
    }
  }

  function completeMissionAndReturn() {
    window.location.hash = 'tasks';
    window.location.reload();
  }

  if (!post) return (
    <div style={S.pageWrapper}>
      <div style={{ padding: 100, textAlign: 'center', color: 'var(--slate)' }}>Decrypting briefing...</div>
    </div>
  );

  const heroImage = post.image_url || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop';

  return (
    <div style={{ ...S.pageWrapper, backgroundAttachment: 'scroll' }}>
      <style>{proseStyles}</style>

      {/* 🔥 THE FLOATING MISSION HUD 🔥 */}
      {user?.role === 'earner' && isActiveMission && (
        <div style={{
          position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(20,20,25,0.95)', backdropFilter: 'blur(20px)',
          border: claimed ? '1px solid var(--lime)' : '1px solid rgba(255,255,255,0.1)', 
          borderRadius: 100, padding: claimed ? '8px 8px 8px 24px' : '16px 24px', 
          display: 'flex', alignItems: 'center', gap: 16,
          boxShadow: '0 16px 40px rgba(0,0,0,0.5)', zIndex: 100, width: 'max-content'
        }}>
          {claimed ? (
            <>
              <div>
                <div style={{ fontSize: 10, color: 'var(--lime)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Mission Complete</div>
                <div style={{ color: '#fff', fontSize: 14, fontWeight: 700 }}>+10 PTS Secured</div>
              </div>
              <button onClick={completeMissionAndReturn} style={{ background: 'var(--lime)', color: '#000', border: 'none', padding: '12px 24px', borderRadius: 100, fontSize: 13, fontWeight: 800, cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>Return</button>
            </>
          ) : claiming ? (
            <>
              <div style={{ width: 18, height: 18, border: '2px solid var(--slate)', borderTopColor: 'var(--lime)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--lime)', textTransform: 'uppercase', letterSpacing: '1px' }}>Securing Yield...</div>
            </>
          ) : (
            <>
              <div style={{ width: 12, height: 12, background: '#ef4444', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
              <div>
                <div style={{ fontSize: 10, color: 'var(--slate)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Verifying Presence</div>
                <div style={{ color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: "'Inter', sans-serif" }}>Dwell Time: <span style={{ color: '#ef4444' }}>{timeLeft}s</span></div>
              </div>
            </>
          )}
        </div>
      )}

      {/* 🔥 THE CINEMATIC HERO HEADER 🔥 */}
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '45vh', 
        minHeight: 350, 
        backgroundImage: `url(${heroImage})`, 
        backgroundSize: 'cover', 
        backgroundPosition: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(to bottom, rgba(13,13,20,0.3) 0%, rgba(13,13,20,0.8) 60%, var(--surface) 100%)' 
        }} />
        
        <div style={{ position: 'absolute', top: 32, left: '5%', zIndex: 20 }}>
          <button onClick={() => navigate(user ? 'tasks' : 'blog')} style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px 20px', borderRadius: 100, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            ← Back to Network
          </button>
        </div>
      </div>

      <div style={{ padding: '0 5% 120px', maxWidth: 720, margin: '0 auto', position: 'relative', zIndex: 10 }}>
        
        <div style={{ marginTop: -100, marginBottom: 48, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <span style={{ display: 'inline-block', background: post.category === 'creator' ? 'rgba(212,175,55,0.9)' : 'rgba(168,255,62,0.9)', color: '#000', fontSize: 11, fontWeight: 800, padding: '6px 12px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '1px' }}>
              {post.category}
            </span>
            <span style={{ color: 'var(--slate)', fontSize: 13, fontWeight: 600 }}>5 Min Read</span>
          </div>
          
          <h1 style={{ fontSize: 42, fontFamily: "'Inter', sans-serif", fontWeight: 800, color: 'var(--ink)', marginBottom: 24, lineHeight: 1.1, letterSpacing: '-1.5px' }}>{post.title}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--surface-card)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
              👁️‍🗨️
            </div>
            <div>
              <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 700 }}>Taskivo Central Intelligence</div>
              <div style={{ fontSize: 12, color: 'var(--slate)' }}>{new Date(post.created_at).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
        
        <div 
          className="article-prose"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />

        {!user && (
          <div style={{ background: 'linear-gradient(135deg, rgba(168,255,62,0.1) 0%, transparent 100%)', border: '1px solid var(--lime)', borderRadius: 24, padding: 40, textAlign: 'center', marginTop: 80, backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--ink)', fontFamily: "'Inter', sans-serif", marginBottom: 12, letterSpacing: '-0.5px' }}>Monetize Your Attention.</div>
            <p style={{ color: 'var(--slate)', fontSize: 16, marginBottom: 32, maxWidth: 400, margin: '0 auto 32px', lineHeight: 1.6 }}>Taskivo earners get paid fiat currency for reading intelligence briefings just like this one.</p>
            <button onClick={() => { if(setAuthMode) setAuthMode('register'); navigate('auth'); }} style={{ background: 'var(--lime)', color: '#000', border: 'none', padding: '16px 32px', borderRadius: 100, fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Create Free Earner Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
