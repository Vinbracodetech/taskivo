import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";

export default function Auth({ authMode, setAuthMode, navigate, loadProfile }) {
  var [mode, setMode] = useState(authMode || "login");
  var [role, setRole] = useState("earner");
  var [loading, setLoading] = useState(false);
  var [error, setError] = useState("");
  var [mounted, setMounted] = useState(false);
  var [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(function () {
    var t = setTimeout(function () { setMounted(true); }, 50);
    return function () { clearTimeout(t); };
  }, []);

  function handleChange(e) {
    setForm(function (prev) {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  async function handleGoogle() {
    setLoading(true);
    setError("");
    var result = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (result.error) {
      setError(result.error.message);
      setLoading(false);
    }
  }

  async function handleEmailLogin() {
    setLoading(true);
    setError("");
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }
    var result = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }
    if (result.data && result.data.user && loadProfile) {
      await loadProfile(result.data.user);
    }
    setLoading(false);
  }

  async function handleEmailRegister() {
    setLoading(true);
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }
    var result = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { full_name: form.name, role: role } },
    });
    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }
    if (result.data && result.data.user) {
      await supabase.from("profiles").upsert({
        id: result.data.user.id,
        email: form.email,
        full_name: form.name,
        role: role,
        points: 0,
      });
    }
    setLoading(false);
    setMode("confirm");
  }

  function handleSubmit() {
    if (mode === "login") handleEmailLogin();
    else handleEmailRegister();
  }

  // ── STYLES ──
  var overlayStyle = {
    position: "fixed",
    inset: 0,
    zIndex: 0,
    background: "radial-gradient(ellipse 80% 60% at 20% 110%, rgba(168,255,62,0.13) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% -10%, rgba(168,255,62,0.08) 0%, transparent 55%)",
    pointerEvents: "none",
  };

  var gridStyle = {
    position: "fixed",
    inset: 0,
    zIndex: 0,
    backgroundImage: "linear-gradient(rgba(168,255,62,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(168,255,62,0.04) 1px, transparent 1px)",
    backgroundSize: "48px 48px",
    pointerEvents: "none",
  };

  var pageStyle = {
    minHeight: "100vh",
    display: "flex",
    background: "#0D0D14",
    position: "relative",
    overflow: "hidden",
    fontFamily: "var(--font-body)",
  };

  var leftStyle = {
    flex: "0 0 45%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "60px 56px",
    position: "relative",
    zIndex: 1,
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateX(0)" : "translateX(-24px)",
    transition: "opacity 0.7s ease, transform 0.7s ease",
  };

  var rightStyle = {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 48px",
    position: "relative",
    zIndex: 1,
    opacity: mounted ? 1 : 0,
    transform: mounted ? "translateY(0)" : "translateY(20px)",
    transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s",
  };

  var cardStyle = {
    width: "100%",
    maxWidth: 420,
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 20,
    padding: "40px 36px",
    backdropFilter: "blur(20px)",
    boxShadow: "0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
  };

  var logoStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 48,
    textDecoration: "none",
  };

  var logoTextStyle = {
    fontFamily: "var(--font-display)",
    fontSize: 26,
    fontWeight: 800,
    color: "#fff",
    letterSpacing: "-0.5px",
  };

  var logoBadgeStyle = {
    background: "var(--lime)",
    color: "#0D0D14",
    fontSize: 13,
    fontWeight: 800,
    padding: "2px 8px",
    borderRadius: 6,
    letterSpacing: "0.5px",
  };

  var headlineStyle = {
    fontFamily: "var(--font-display)",
    fontSize: 42,
    fontWeight: 800,
    color: "#fff",
    lineHeight: 1.1,
    letterSpacing: "-1px",
    marginBottom: 20,
  };

  var subStyle = {
    fontSize: 16,
    color: "rgba(255,255,255,0.45)",
    lineHeight: 1.7,
    maxWidth: 320,
    marginBottom: 48,
  };

  var featuresData = [
    { icon: "⚡", label: "Instant payouts", desc: "Same-day withdrawals" },
    { icon: "🌍", label: "Global platform", desc: "190+ countries supported" },
    { icon: "🛡️", label: "Fair & secure", desc: "Anti-cheat verified tasks" },
  ];

  var statData = [
    { num: "50K+", label: "Earners" },
    { num: "$2M+", label: "Paid out" },
    { num: "4.9★", label: "Rating" },
  ];

  var cardTitleStyle = {
    fontFamily: "var(--font-display)",
    fontSize: 26,
    fontWeight: 800,
    color: "#fff",
    letterSpacing: "-0.5px",
    marginBottom: 6,
  };

  var cardSubStyle = {
    fontSize: 13,
    color: "rgba(255,255,255,0.4)",
    marginBottom: 28,
  };

  var googleBtnStyle = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: "12px 20px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 12,
    color: "#fff",
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "var(--font-body)",
    cursor: "pointer",
    transition: "all 0.2s",
    marginBottom: 20,
  };

  var dividerStyle = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  };

  var dividerLineStyle = {
    flex: 1,
    height: 1,
    background: "rgba(255,255,255,0.08)",
  };

  var dividerTextStyle = {
    fontSize: 12,
    color: "rgba(255,255,255,0.25)",
    fontWeight: 500,
    letterSpacing: "0.5px",
  };

  var labelStyle = {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "rgba(255,255,255,0.5)",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    marginBottom: 8,
  };

  var inputStyle = {
    width: "100%",
    padding: "13px 16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    color: "#fff",
    fontSize: 15,
    fontFamily: "var(--font-body)",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    marginBottom: 16,
  };

  var submitBtnStyle = {
    width: "100%",
    padding: "14px",
    background: loading ? "rgba(168,255,62,0.5)" : "var(--lime)",
    border: "none",
    borderRadius: 12,
    color: "#0D0D14",
    fontSize: 15,
    fontWeight: 800,
    fontFamily: "var(--font-display)",
    cursor: loading ? "not-allowed" : "pointer",
    letterSpacing: "0.2px",
    transition: "all 0.2s",
    marginTop: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  };

  var switchStyle = {
    textAlign: "center",
    marginTop: 20,
    fontSize: 13,
    color: "rgba(255,255,255,0.35)",
  };

  var switchLinkStyle = {
    color: "var(--lime)",
    fontWeight: 700,
    cursor: "pointer",
    textDecoration: "none",
  };

  var errorStyle = {
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.25)",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: 13,
    color: "#f87171",
    marginBottom: 16,
  };

  var roleTabStyle = function (active) {
    return {
      flex: 1,
      padding: "10px 0",
      borderRadius: 10,
      border: "none",
      cursor: "pointer",
      fontFamily: "var(--font-body)",
      fontWeight: 700,
      fontSize: 13,
      background: active ? "var(--lime)" : "transparent",
      color: active ? "#0D0D14" : "rgba(255,255,255,0.4)",
      transition: "all 0.2s",
    };
  };

  // ── CONFIRM SCREEN ──
  if (mode === "confirm") {
    return (
      <div style={{ ...pageStyle, alignItems: "center", justifyContent: "center" }}>
        <div style={gridStyle} />
        <div style={overlayStyle} />
        <div style={{
          ...cardStyle,
          maxWidth: 400,
          textAlign: "center",
          zIndex: 1,
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}>
          <div style={{ fontSize: 52, marginBottom: 20 }}>📬</div>
          <div style={{ ...cardTitleStyle, marginBottom: 10 }}>Check your inbox</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: 28 }}>
            We sent a confirmation link to{" "}
            <span style={{ color: "var(--lime)", fontWeight: 700 }}>{form.email}</span>.
            Click it to activate your account.
          </div>
          <button
            style={submitBtnStyle}
            onClick={function () { setMode("login"); }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // ── MOBILE: stack vertically ──
  var isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  if (isMobile) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "#0D0D14",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 20px",
        position: "relative",
        fontFamily: "var(--font-body)",
      }}>
        <div style={gridStyle} />
        <div style={overlayStyle} />

        {/* Logo */}
        <div style={{ zIndex: 1, marginBottom: 32, textAlign: "center" }}>
          <div style={{ ...logoTextStyle, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            ⚡ Taskivo
            <span style={logoBadgeStyle}>BETA</span>
          </div>
        </div>

        {/* Card */}
        <div style={{ ...cardStyle, zIndex: 1, width: "100%" }}>
          <div style={{ ...cardTitleStyle, fontSize: 22, marginBottom: 4 }}>
            {mode === "login" ? "Welcome back" : "Join Taskivo"}
          </div>
          <div style={{ ...cardSubStyle, marginBottom: 24 }}>
            {mode === "login" ? "Sign in to your account" : "Start earning today"}
          </div>

          {/* Role tabs */}
          {mode === "register" && (
            <div style={{
              display: "flex",
              background: "rgba(255,255,255,0.05)",
              borderRadius: 12,
              padding: 4,
              marginBottom: 20,
              gap: 4,
            }}>
              {["earner", "creator"].map(function (r) {
                return (
                  <button key={r} onClick={function () { setRole(r); }} style={roleTabStyle(role === r)}>
                    {r === "earner" ? "🎯 Earner" : "✦ Creator"}
                  </button>
                );
              })}
            </div>
          )}

          {/* Google */}
          <button style={googleBtnStyle} onClick={handleGoogle} disabled={loading}>
            <img src="https://www.google.com/favicon.ico" width={16} height={16} alt="G" />
            Continue with Google
          </button>

          <div style={dividerStyle}>
            <div style={dividerLineStyle} />
            <span style={dividerTextStyle}>OR</span>
            <div style={dividerLineStyle} />
          </div>

          {mode === "register" && (
            <div>
              <label style={labelStyle}>Full Name</label>
              <input style={inputStyle} type="text" name="name" placeholder="Your full name" value={form.name} onChange={handleChange} />
            </div>
          )}

          <div>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input style={inputStyle} type="password" name="password" placeholder={mode === "register" ? "Min. 6 characters" : "••••••••"} value={form.password} onChange={handleChange} />
          </div>

          {error && <div style={errorStyle}>{error}</div>}

          <button style={submitBtnStyle} onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <span style={{
                display: "inline-block",
                width: 16,
                height: 16,
                border: "2px solid rgba(0,0,0,0.3)",
                borderTopColor: "#0D0D14",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }} />
            ) : null}
            {loading ? "Please wait..." : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>

          <div style={switchStyle}>
            {mode === "login" ? (
              <>Don't have an account?{" "}
                <span style={switchLinkStyle} onClick={function () { setMode("register"); setError(""); }}>Sign up free</span>
              </>
            ) : (
              <>Already have an account?{" "}
                <span style={switchLinkStyle} onClick={function () { setMode("login"); setError(""); }}>Log in</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── DESKTOP: two-column ──
  return (
    <div style={pageStyle}>
      <div style={gridStyle} />
      <div style={overlayStyle} />

      {/* LEFT */}
      <div style={leftStyle}>
        <div style={logoStyle}>
          <span style={logoTextStyle}>⚡ Taskivo</span>
          <span style={logoBadgeStyle}>BETA</span>
        </div>

        <div style={headlineStyle}>
          Earn real money<br />
          <span style={{ color: "var(--lime)" }}>watching videos.</span>
        </div>
        <div style={subStyle}>
          Complete tasks from global creators, earn points, and withdraw cash — from anywhere in the world.
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 32, marginBottom: 48 }}>
          {statData.map(function (s) {
            return (
              <div key={s.label}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "var(--lime)" }}>{s.num}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{s.label}</div>
              </div>
            );
          })}
        </div>

        {/* Features */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {featuresData.map(function (f) {
            return (
              <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "rgba(168,255,62,0.1)",
                  border: "1px solid rgba(168,255,62,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                  flexShrink: 0,
                }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{f.label}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{f.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT */}
      <div style={rightStyle}>
        <div style={cardStyle}>
          <div style={{ ...cardTitleStyle, marginBottom: 4 }}>
            {mode === "login" ? "Welcome back" : "Create account"}
          </div>
          <div style={{ ...cardSubStyle, marginBottom: 28 }}>
            {mode === "login" ? "Sign in to continue earning" : "Join thousands of earners worldwide"}
          </div>

          {mode === "register" && (
            <div style={{
              display: "flex",
              background: "rgba(255,255,255,0.05)",
              borderRadius: 12,
              padding: 4,
              marginBottom: 24,
              gap: 4,
            }}>
              {["earner", "creator"].map(function (r) {
                return (
                  <button key={r} onClick={function () { setRole(r); }} style={roleTabStyle(role === r)}>
                    {r === "earner" ? "🎯 Earner" : "✦ Creator"}
                  </button>
                );
              })}
            </div>
          )}

          <button style={googleBtnStyle} onClick={handleGoogle} disabled={loading}>
            <img src="https://www.google.com/favicon.ico" width={16} height={16} alt="G" />
            Continue with Google
          </button>

          <div style={dividerStyle}>
            <div style={dividerLineStyle} />
            <span style={dividerTextStyle}>OR</span>
            <div style={dividerLineStyle} />
          </div>

          {mode === "register" && (
            <div>
              <label style={labelStyle}>Full Name</label>
              <input style={inputStyle} type="text" name="name" placeholder="Your full name" value={form.name} onChange={handleChange} />
            </div>
          )}

          <div>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input style={inputStyle} type="password" name="password" placeholder={mode === "register" ? "Min. 6 characters" : "••••••••"} value={form.password} onChange={handleChange} />
          </div>

          {error && <div style={errorStyle}>{error}</div>}

          <button style={submitBtnStyle} onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <span style={{
                display: "inline-block",
                width: 16,
                height: 16,
                border: "2px solid rgba(0,0,0,0.3)",
                borderTopColor: "#0D0D14",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }} />
            ) : null}
            {loading ? "Please wait..." : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>

          <div style={switchStyle}>
            {mode === "login" ? (
              <>Don't have an account?{" "}
                <span style={switchLinkStyle} onClick={function () { setMode("register"); setError(""); }}>Sign up free</span>
              </>
            ) : (
              <>Already have an account?{" "}
                <span style={switchLinkStyle} onClick={function () { setMode("login"); setError(""); }}>Log in</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
