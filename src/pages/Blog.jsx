import { useState } from 'react';

export default function Blog({ navigate }) {
  // Placeholder data - replace with Supabase or CMS fetch later
  const [articles] = useState([
    { id: 1, title: "The Architecture of Algorithmic Safety", category: "Engineering", date: "May 2026", excerpt: "How Taskivo's anti-cheat verification protects creators from ghost traffic and ensures high-retention engagement." },
    { id: 2, title: "Scaling Micro-Earnings in Emerging Markets", category: "Network", date: "April 2026", excerpt: "A deep dive into how distributed verification systems are creating new economic models." },
    { id: 3, title: "SEO Dynamics: Dwell Time vs. Bounce Rate", category: "Strategy", date: "April 2026", excerpt: "Why businesses are shifting from standard click campaigns to guaranteed time-on-page analytics." }
  ]);

  const S = {
    page: { padding: '80px 5%', maxWidth: 1200, margin: '0 auto', fontFamily: "'DM Sans', sans-serif" },
    header: { fontFamily: "'Inter', sans-serif", fontSize: 48, color: 'var(--ink)', marginBottom: 16, fontWeight: 800, letterSpacing: '-1.5px', textAlign: 'center' },
    sub: { color: 'var(--slate)', fontSize: 16, textAlign: 'center', marginBottom: 64, maxWidth: 600, margin: '0 auto 64px auto', lineHeight: 1.6 },
    card: { background: 'var(--surface-card)', border: '1px solid var(--line)', borderRadius: 20, padding: 32, display: 'flex', flexDirection: 'column', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' },
    tag: { fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--ink)', background: 'var(--lime)', padding: '4px 10px', borderRadius: 100, display: 'inline-block', marginBottom: 16 }
  };

  return (
    <div style={{ background: 'var(--surface)', minHeight: '100vh' }}>
      <div style={S.page}>
        <h1 style={S.header}>Platform Intelligence</h1>
        <p style={S.sub}>Engineering logs, strategy updates, and network transparency reports from the Taskivo team.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 32 }}>
          {articles.map(article => (
            <div key={article.id} style={S.card} 
                 onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 32px rgba(0,0,0,0.05)'; }}
                 onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div>
                <span style={S.tag}>{article.category}</span>
                <span style={{ fontSize: 12, color: 'var(--slate)', marginLeft: 12, fontWeight: 600 }}>{article.date}</span>
              </div>
              <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, fontWeight: 700, color: 'var(--ink)', margin: '0 0 12px 0', lineHeight: 1.3 }}>{article.title}</h2>
              <p style={{ color: 'var(--slate)', fontSize: 14, lineHeight: 1.6, flexGrow: 1, margin: 0 }}>{article.excerpt}</p>
              
              <div style={{ marginTop: 24, fontSize: 13, fontWeight: 700, color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: 8 }}>
                Read Telemetry <span style={{ color: 'var(--lime)' }}>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
