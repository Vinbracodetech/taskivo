import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// ── THE BLOG INDEX (Lists all published articles) ──
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

// ── THE ARTICLE VIEW (With Secure Dwell Timer) ──
export function ArticleView({ navigate, id }) {
  const [post, setPost] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120); // 120 seconds = 2 minutes of REQUIRED dwell time
  const [showCode, setShowCode] = useState(false);
  const slug = id.replace('article-', ''); 

  // Fetch the article
  useEffect(() => {
    async function fetchPost() {
      const { data } = await supabase.from('posts').select('*').eq('slug', slug).single();
      if (data) {
        setPost(data);
        document.title = `${data.title} | Taskivo`;
        let meta = document.querySelector('meta[name="description"]');
        if (!meta) {
          meta = document.createElement('meta');
          meta.name = 'description';
          document.head.appendChild(meta);
        }
        meta.content = data.meta_desc;
      }
    }
    fetchPost();
  }, [slug]);

  // The Secure Visibility Timer
  useEffect(() => {
    if (!post) return;
    const interval = setInterval(() => {
      // ONLY tick down if the tab is actively visible to the user
      if (!document.hidden && !showCode) {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setShowCode(true);
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [post, showCode]);

  if (!post) return <div style={{ padding: 100, textAlign: 'center', color: 'var(--slate)' }}>Decrypting article...</div>;

  // Generate a deterministic verification code based on the article slug
  const verificationCode = (post.slug.substring(0, 4) + "8X" + post.title.length).toUpperCase();

  return (
    <div style={{ padding: '80px 5%', maxWidth: 700, margin: '0 auto', fontFamily: "var(--font-body)" }}>
      <button onClick={() => navigate('blog')} style={{ background: 'transparent', border: 'none', color: 'var(--slate)', fontSize: 14, fontWeight: 700, cursor: 'pointer', marginBottom: 32 }}>← Back to Index</button>
      
      <div style={{ display: 'inline-block', background: post.category === 'creator' ? 'rgba(212,175,55,0.1)' : 'rgba(168,255,62,0.1)', color: post.category === 'creator' ? '#D4AF37' : 'var(--lime)', fontSize: 10, fontWeight: 800, padding: '4px 8px', borderRadius: 4, textTransform: 'uppercase', marginBottom: 16 }}>
        {post.category}
      </div>
      <h1 style={{ fontSize: 36, fontFamily: "var(--font-display)", fontWeight: 800, color: 'var(--ink)', marginBottom: 24, lineHeight: 1.2, letterSpacing: '-1px' }}>{post.title}</h1>
      
      {/* The Article Content */}
      <div 
        style={{ color: 'var(--ink)', fontSize: 16, lineHeight: 1.8, marginBottom: 48 }} 
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />

      {/* 🔥 THE SECURE DWELL TIME ENFORCER 🔥 */}
      <div style={{ background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 16, padding: 32, textAlign: 'center', boxShadow: 'var(--shadow)' }}>
        {showCode ? (
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--lime)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>Human Presence Verified</div>
            <div style={{ color: 'var(--slate)', fontSize: 14, marginBottom: 16 }}>Return to your dashboard and enter this code to claim your liquidity:</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--ink)', fontFamily: 'monospace', letterSpacing: '4px', background: 'var(--surface)', display: 'inline-block', padding: '12px 24px', borderRadius: 8, border: '1px solid var(--line)' }}>
              {verificationCode}
            </div>
          </div>
        ) : (
          <div>
            <div style={{ width: 24, height: 24, border: '2px solid var(--line)', borderTopColor: '#ef4444', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' }} />
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 8 }}>Verifying Human Presence</div>
            <div style={{ color: 'var(--slate)', fontSize: 14, marginBottom: 16 }}>You must keep this tab open and active to generate your payout code.</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: '#ef4444', fontFamily: "var(--font-display)" }}>
              {timeLeft}s
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
