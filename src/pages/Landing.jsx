import { useEffect } from "react";

export default function Landing({ navigate }) {

  useEffect(() => {
    document.title = "Taskivo — Complete Tasks. Get Paid.";
  }, []);

  return (
    <div className="app">

      {/* NAV */}
      <nav className="nav">
        <div className="nav-brand">
          <span className="nav-dot"></span>
          Taskivo
        </div>

        <div className="nav-btns">
          <button className="btn-ghost">Log in</button>
          <button className="btn-primary" onClick={() => navigate("auth")}>
            Get Started →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-inner">

          <div className="hero-badge">● Live — Tasks available now</div>

          <h1 className="hero-title">
            Complete Tasks.<br />
            <span>Get Paid.</span><br />
            Grow Faster.
          </h1>

          <p className="hero-sub">
            The platform where earners complete real YouTube tasks and creators get genuine engagement.
          </p>

          <div className="hero-actions">
            <button className="btn-hero primary" onClick={() => navigate("auth")}>
              Start Earning Free →
            </button>
            <button className="btn-hero ghost">
              I'm a Creator
            </button>
          </div>

          <div className="hero-stats">
            {[
              ["50K+", "Earners"],
              ["2.1M", "Points"],
              ["12K+", "Tasks"],
              ["30+", "Countries"]
            ].map((s, i) => (
              <div key={i} className="stat">
                <div className="stat-num">{s[0]}</div>
                <div className="stat-label">{s[1]}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* AUDIENCE */}
      <section className="section white">
        <h2 className="section-title">Two sides. One platform.</h2>
        <p className="section-sub">
          Earn money or grow your channel — Taskivo works for both.
        </p>

        <div className="grid">
          <div className="card">
            <h3>For Earners</h3>
            <p>Complete tasks and withdraw real money.</p>
          </div>

          <div className="card">
            <h3>For Creators</h3>
            <p>Get real engagement from verified viewers.</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section">
        <h2 className="section-title">Features</h2>

        <div className="features">
          {[
            "⏱️ Timed Sessions",
            "🧠 Anti-Cheat Quiz",
            "💸 Withdrawals",
            "🌍 Global Users",
            "📊 Reports",
            "🛡️ Verified"
          ].map((f, i) => (
            <div key={i} className="feature">{f}</div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section dark">
        <h2 className="section-title light">Trusted worldwide.</h2>

        <div className="test-grid">
          <div className="test">"I withdrew in my first week!"</div>
          <div className="test">"Best platform I've used."</div>
          <div className="test">"Real engagement, not bots."</div>
        </div>
      </section>

      {/* CTA */}
      <section className="section center">
        <h2 className="section-title">Start earning today</h2>

        <button className="btn-hero primary" onClick={() => navigate("auth")}>
          Join Now →
        </button>
      </section>

    </div>
  );
}
