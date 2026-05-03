export default function Landing({ navigate, setAuthMode }) {

  function goRegister() {
    setAuthMode("register");
    navigate("auth");
  }

  function goLogin() {
    setAuthMode("login");
    navigate("auth");
  }

  return (
    <div className="landing">

      {/* ── NAV ── */}
      <nav style={{
        padding: "0 5%",
        height: 72,
        display: "flex",
        alignItems: "center",
        gap: 16,
        position: "sticky",
        top: 0,
        background: "rgba(255,255,255,.92)",
        backdropFilter: "blur(12px)",
        zIndex: 50,
        borderBottom: "1px solid var(--line)",
      }}>
        <span style={{
          fontFamily: "var(--font-display)",
          fontSize: 22,
          fontWeight: 700,
          color: "var(--ink)",
          flex: 1,
        }}>
          ⚡ Taskivo
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={function () { navigate("blog"); }}
          >
            Blog
          </button>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-outline btn-sm" onClick={goLogin}>
            Log in
          </button>
          <button className="btn btn-primary btn-sm" onClick={goRegister}>
            Get Started
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        background: "linear-gradient(180deg, #fff 0%, #F9FFF5 100%)",
        borderBottom: "1px solid var(--line)",
      }}>
        <div className="hero">
          <div>
            <div className="hero-eyebrow">⚡ Earn While You Watch</div>
            <h1 className="hero-title">
              Real Tasks.<br />
              Real <span>Rewards</span>.<br />
              Real Insights.
            </h1>
            <p className="hero-sub">
              Taskivo connects curious viewers with creators who want genuine
              feedback. Watch videos, answer questions, earn points — and get paid.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-xl" onClick={goRegister}>
                Start Earning Free →
              </button>
              <button className="btn btn-outline btn-xl" onClick={goRegister}>
                I'm a Creator
              </button>
            </div>
            <div style={{ display: "flex", gap: 32, marginTop: 36 }}>
              {[
                ["50K+", "Active Earners"],
                ["2.1M", "Points Earned"],
                ["12K+", "Tasks Completed"],
              ].map(function (s) {
                return (
                  <div key={s[1]}>
                    <div style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 26,
                      fontWeight: 700,
                      color: "var(--ink)",
                    }}>
                      {s[0]}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--slate)" }}>
                      {s[1]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* HERO CARD */}
          <div>
            <div className="hero-card">
              <div style={{
                fontSize: 13,
                color: "rgba(255,255,255,.6)",
                marginBottom: 20,
                fontWeight: 600,
              }}>
                📋 Live Tasks Right Now
              </div>
              {[
                { title: "Watch & Review: AI Tools 2025", time: "90s", reward: 250, slots: 47 },
                { title: "Product Unboxing Feedback", time: "60s", reward: 180, slots: 31 },
                { title: "Rate This Tutorial Video", time: "120s", reward: 350, slots: 12 },
              ].map(function (t) {
                return (
                  <div className="task-preview" key={t.title}>
                    <div className="task-preview-title">{t.title}</div>
                    <div className="task-preview-meta">
                      <span>⏱ {t.time} watch</span>
                      <span className="task-preview-reward">+{t.reward} pts</span>
                      <span>{t.slots} slots left</span>
                    </div>
                    <div className="progress" style={{ marginTop: 8 }}>
                      <div
                        className="progress-bar"
                        style={{ width: (100 - t.slots) + "%" }}
                      />
                    </div>
                  </div>
                );
              })}
              <button
                className="btn btn-primary"
                style={{ width: "100%", marginTop: 8, justifyContent: "center" }}
                onClick={goRegister}
              >
                View All Tasks →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="features-section" id="features">
        <div className="section-label">Platform Features</div>
        <h2 className="section-title">Everything You Need to Earn & Grow</h2>
        <p className="section-sub">
          A complete ecosystem where meaningful engagement is rewarded
          and creators get real data.
        </p>
        <div className="features-grid">
          {[
            { icon: "▶", title: "Watch & Earn", desc: "Complete video tasks with enforced watch timers. Points are awarded only after verified engagement — no shortcuts." },
            { icon: "🧠", title: "Smart Questions", desc: "Answer comprehension questions, rate content, or provide written feedback. Every task validates real watching." },
            { icon: "💰", title: "Points → Cash", desc: "Accumulate points and withdraw via Paystack or Flutterwave. Transparent rates, admin-approved payouts." },
            { icon: "🛡️", title: "Anti-Cheat Built In", desc: "Tab-switch detection, randomised questions, and daily limits keep the platform fair for everyone." },
            { icon: "📊", title: "Creator Analytics", desc: "Creators get real completion stats, feedback scores, and engagement breakdowns — not vanity metrics." },
            { icon: "🌍", title: "Global Platform", desc: "Available worldwide with country-based point rates. Earn from Nigeria, US, UK, Canada and beyond." },
          ].map(function (f) {
            return (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section">
        <div className="section-label" style={{ color: "rgba(168,255,62,.7)" }}>
          How It Works
        </div>
        <h2 className="section-title">From Zero to Earning in Minutes</h2>
        <p className="section-sub">
          A simple flow designed for real engagement — not gaming the system.
        </p>
        <div className="steps-grid">
          {[
            { n: "1", title: "Register Free", desc: "Create your account with email or Google. No payment needed to start." },
            { n: "2", title: "Pick a Task", desc: "Browse available video tasks filtered by topic, reward, and duration." },
            { n: "3", title: "Watch & Answer", desc: "Watch the full video (timer enforced), then answer questions or give feedback." },
            { n: "4", title: "Earn & Withdraw", desc: "Points land in your wallet instantly. Request withdrawal when you hit the minimum." },
          ].map(function (s) {
            return (
              <div style={{ textAlign: "center" }} key={s.n}>
                <div className="step-num">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2 className="cta-title">Ready to Start Earning?</h2>
          <p className="cta-sub">
            Join 50,000+ earners already on Taskivo. Free to join, real rewards, no spam.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-dark btn-xl" onClick={goRegister}>
              Create Free Account
            </button>
            <button
              className="btn btn-outline btn-xl"
              style={{ background: "rgba(255,255,255,.5)" }}
              onClick={goLogin}
            >
              I Have an Account
            </button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">⚡ Taskivo</div>
            <div style={{ fontSize: 13, lineHeight: 1.7 }}>
              A global task-based engagement platform connecting
              earners with creators for meaningful video feedback.
            </div>
          </div>
          {[
            { title: "Platform", links: ["How it Works", "Browse Tasks", "Creator Hub", "Pricing"] },
            { title: "Company", links: ["About Us", "Blog", "Careers", "Contact"] },
            { title: "Legal", links: ["Privacy Policy", "Terms of Service", "Cookie Policy"] },
          ].map(function (col) {
            return (
              <div key={col.title}>
                <div className="footer-col-title">{col.title}</div>
                <ul className="footer-col-links">
                  {col.links.map(function (l) {
                    return (
                      <li key={l}>
                        <a href="#">{l}</a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
        <div className="footer-bottom">
          © 2025 Taskivo.online — All rights reserved.
        </div>
      </footer>

    </div>
  );
}
