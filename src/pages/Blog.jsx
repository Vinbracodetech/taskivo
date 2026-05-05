import { useEffect } from "react";

// Dummy data for SEO articles
const articles = [
  {
    id: "how-to-grow-youtube",
    title: "How to Grow Your YouTube Channel in 2026",
    excerpt: "Stop relying on the algorithm. Here is the exact blueprint to getting guaranteed, verified engagement from real humans.",
    date: "May 5, 2026",
    readTime: "5 min read"
  },
  {
    id: "make-money-online",
    title: "5 Legitimate Ways to Make Money Online from Your Phone",
    excerpt: "No scams, no surveys. Discover how task-based platforms are changing the gig economy in developing nations.",
    date: "May 2, 2026",
    readTime: "7 min read"
  }
];

export function BlogIndex({ navigate }) {
  useEffect(function () {
    window.scrollTo(0, 0);
    document.title = "Taskivo Blog — Tips for Creators & Earners";
  }, []);

  return (
    <div className="page animate-fadeIn" style={{ paddingBottom: 100 }}>
      <div className="dashboard-header" style={{ textAlign: "center", borderLeft: "none", padding: 0, marginBottom: 48 }}>
        <div style={{ display: "inline-block", background: "rgba(168,255,62,0.1)", color: "var(--lime)", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", padding: "4px 10px", borderRadius: 4, marginBottom: 16 }}>
          Taskivo SEO Resources
        </div>
        <h1 style={{ fontSize: 48, fontWeight: 800, color: "var(--ink)", marginBottom: 16, letterSpacing: "-1px" }}>
          The Taskivo <span style={{ color: "var(--gold)" }}>Blog</span>
        </h1>
        <p style={{ color: "var(--slate)", fontSize: 18, maxWidth: 600, margin: "0 auto" }}>
          Actionable advice on audience growth, online earning, and maximizing your digital presence.
        </p>
      </div>

      {/* 💰 ADSENSE PLACEHOLDER: LEADERBOARD */}
      <div style={{ width: "100%", height: 90, background: "rgba(255,215,0,0.05)", border: "1px dashed var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 48, borderRadius: 4 }}>
        [ Google AdSense Leaderboard Unit (728x90) ]
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
        {articles.map(function(article) {
          return (
            <div 
              key={article.id} 
              className="action-card" 
              style={{ flexDirection: "column", gap: 12, padding: 32 }}
              onClick={function() { navigate("article-" + article.id); }}
            >
              <div style={{ display: "flex", gap: 12, color: "var(--slate)", fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5 }}>
                <span>{article.date}</span>
                <span>•</span>
                <span>{article.readTime}</span>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: "var(--ink)", lineHeight: 1.3 }}>{article.title}</h2>
              <p style={{ color: "var(--slate)", fontSize: 15, lineHeight: 1.6 }}>{article.excerpt}</p>
              <div style={{ marginTop: "auto", color: "var(--lime)", fontWeight: 700, fontSize: 14, paddingTop: 16 }}>Read Article →</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ArticleView({ navigate, id }) {
  useEffect(function () {
    window.scrollTo(0, 0);
    document.title = "Reading Article — Taskivo";
  }, []);

  return (
    <div className="page animate-fadeIn" style={{ paddingBottom: 100, maxWidth: 800 }}>
      <button className="btn btn-outline btn-sm" style={{ marginBottom: 32 }} onClick={function() { navigate("blog"); }}>
        ← Back to Blog
      </button>
      
      <h1 style={{ fontSize: 40, fontWeight: 800, color: "var(--ink)", marginBottom: 16, lineHeight: 1.1, letterSpacing: "-1px" }}>
        How to Grow Your YouTube Channel in 2026
      </h1>
      <div style={{ display: "flex", gap: 12, color: "var(--slate)", fontSize: 14, marginBottom: 40 }}>
        <span>By Taskivo Editorial</span>
        <span>•</span>
        <span>May 5, 2026</span>
      </div>

      {/* 💰 ADSENSE PLACEHOLDER: IN-ARTICLE TOP */}
      <div style={{ width: "100%", height: 250, background: "rgba(255,215,0,0.05)", border: "1px dashed var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginBottom: 40, borderRadius: 4 }}>
        [ Google AdSense In-Article Square Unit ]
      </div>

      <div style={{ color: "var(--slate)", fontSize: 17, lineHeight: 1.8, display: "flex", flexDirection: "column", gap: 24 }}>
        <p>
          <strong style={{ color: "var(--ink)" }}>The algorithm is changing, but human psychology remains the same.</strong> If you want to grow your YouTube channel in the current digital landscape, you cannot rely purely on search and organic recommendations. 
        </p>
        <h2 style={{ color: "var(--ink)", fontSize: 24, marginTop: 16, borderLeft: "3px solid var(--gold)", paddingLeft: 16 }}>1. Stop Chasing Empty Views</h2>
        <p>
          Buying views from bot farms is the fastest way to get your channel shadowbanned. YouTube's AI can instantly detect when 1,000 views arrive from the same IP block without any actual watch time. 
        </p>
        
        {/* 💰 ADSENSE PLACEHOLDER: IN-FEED NATIVE */}
        <div style={{ width: "100%", padding: 20, background: "rgba(255,215,0,0.05)", border: "1px dashed var(--gold)", textAlign: "center", color: "var(--gold)", fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", margin: "24px 0", borderRadius: 4 }}>
          [ Google AdSense Native In-Feed Ad ]
        </div>

        <h2 style={{ color: "var(--ink)", fontSize: 24, marginTop: 16, borderLeft: "3px solid var(--gold)", paddingLeft: 16 }}>2. Invest in Verified Engagement</h2>
        <p>
          This is where platforms like Taskivo come in. Instead of paying a black-hat website for fake views, you place a bounty on your video. Real human beings watch the video for a set amount of time, and to claim their reward, they must pass a comprehension quiz about your content.
        </p>
      </div>
    </div>
  );
}
