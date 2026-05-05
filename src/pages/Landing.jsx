import { useState } from "react";

export default function Landing({ navigate, setAuthMode }) {
  const [activeTab, setActiveTab] = useState("earner");

  function goRegister() {
    setAuthMode("register");
    navigate("auth");
  }

  function goLogin() {
    setAuthMode("login");
    navigate("auth");
  }

  function setTabEarner() {
    setActiveTab("earner");
  }

  function setTabCreator() {
    setActiveTab("creator");
  }

  const earnerSteps = [
    { icon: "📋", title: "Pick a task", desc: "Browse YouTube videos, articles, or blog tasks that match your interests.", n: "1" },
    { icon: "✅", title: "Complete it", desc: "Watch, read, or engage — then answer a quick quiz to confirm.", n: "2" },
    { icon: "💸", title: "Withdraw cash", desc: "Cash out via mobile money, bank transfer, or PayPal when you're ready.", n: "3" }
  ];

  const creatorSteps = [
    { icon: "🎯", title: "Post a task", desc: "Upload your YouTube video or article and set the reward points.", n: "1" },
    { icon: "🧠", title: "Set a quiz", desc: "Add a custom question to verify that earners actually engaged.", n: "2" },
    { icon: "📈", title: "Get real engagement", desc: "Watch your metrics grow with verified, human interactions.", n: "3" }
  ];

  const currentSteps = activeTab === "earner" ? earnerSteps : creatorSteps;

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* ── NAV ── */}
      <nav style={{
        padding: "0 5%",
        height: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid var(--line)",
      }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 24,
          fontWeight: 800,
          color: "#fff",
          letterSpacing: "-0.5px"
        }}>
          Taski<span style={{ color: "var(--lime)" }}>vo</span>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-outline" style={{ borderColor: "var(--line)", color: "#fff" }} onClick={goLogin}>
            Log in
          </button>
          <button className="btn btn-primary" onClick={goRegister}>
            Sign up
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding: "100px 5% 40px", textAlign: "center" }}>
        <div className="pill-badge">
          ⚡ EARN REAL CASH ONLINE
        </div>
        
        <h1 className="hero-title">
          Complete tasks.<br />
          <span>Get paid.</span>
        </h1>
        
        <p className="hero-sub">
          Taskivo connects earners who complete short online tasks with creators who want real engagement — YouTube views, article reads, and more.
        </p>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap", marginBottom: 40 }}>
          <button className="btn btn-primary btn-xl" onClick={goRegister}>
            Start Earning Free →
          </button>
          <button className="btn btn-dark btn-xl" onClick={goRegister}>
            Post a Task
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, color: "var(--slate)", fontSize: 14 }}>
          <span style={{ fontSize: 20 }}>🇳🇬 🇬🇭 🇰🇪 🇿🇦 🇺🇬</span>
          <span>Earners from <strong style={{ color: "#fff" }}>50+ countries</strong></span>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-grid">
        <div>
          <div className="stat-val">50K+</div>
          <div className="stat-label">Tasks Completed</div>
        </div>
        <div>
          <div className="stat-val">12K+</div>
          <div className="stat-label">Active Earners</div>
        </div>
        <div>
          <div className="stat-val">$18K+</div>
          <div className="stat-label">Paid Out</div>
        </div>
        <div>
          <div className="stat-val">50+</div>
          <div className="stat-label">Countries</div>
        </div>
      </section>

      {/* ── HOW IT WORKS (TWO SIDES) ── */}
      <section style={{ padding: "60px 5%", textAlign: "center" }}>
        <div className="pill-badge">HOW IT WORKS</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 48, fontWeight: 800, marginBottom: 16, letterSpacing: "-1px" }}>
          Two sides. One platform.
        </h2>
        <p style={{ color: "var(--slate)", fontSize: 16, marginBottom: 40 }}>
          Whether you want to earn or grow your brand, Taskivo is built for you.
        </p>

        <div className="toggle-wrapper">
          <button 
            className={activeTab === "earner" ? "toggle-btn active" : "toggle-btn"} 
            onClick={setTabEarner}
          >
            💰 Earner
          </button>
          <button 
            className={activeTab === "creator" ? "toggle-btn active" : "toggle-btn"} 
            onClick={setTabCreator}
          >
            🎯 Creator
          </button>
        </div>

        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {currentSteps.map(function (step) {
            return (
              <div className="step-card" key={step.n}>
                <div className="step-icon">{step.icon}</div>
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
                <div className="step-watermark">{step.n}</div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
