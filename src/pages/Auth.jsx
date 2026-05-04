import { useState } from "react";
import { supabase } from "../lib/supabase.js";

export default function Auth({ authMode, setAuthMode, navigate }) {

  var [mode, setMode] = useState(authMode || "login");
  var [role, setRole] = useState("earner");
  var [loading, setLoading] = useState(false);
  var [error, setError] = useState("");
  var [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  function handleChange(e) {
    setForm(function (prev) {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  // ── GOOGLE LOGIN ──
  async function handleGoogle() {
    setLoading(true);
    setError("");
    var result = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (result.error) {
      setError(result.error.message);
      setLoading(false);
    }
  }

  // ── EMAIL LOGIN ──
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
    }
    // If success, App.jsx onAuthStateChange handles the rest
  }

  // ── EMAIL REGISTER ──
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
      options: {
        data: {
          full_name: form.name,
          role: role,
        },
      },
    });
    if (result.error) {
      setError(result.error.message);
      setLoading(false);
      return;
    }
    // Insert profile row immediately
    if (result.data && result.data.user) {
      await supabase.from("profiles").upsert({
        id: result.data.user.id,
        email: form.email,
        full_name: form.name,
        role: role,
        points: 0,
      });
    }
    setError("");
    setLoading(false);
    // Show confirm message
    setMode("confirm");
  }

  function handleSubmit() {
    if (mode === "login") {
      handleEmailLogin();
    } else {
      handleEmailRegister();
    }
  }

  // ── EMAIL CONFIRMATION SCREEN ──
  if (mode === "confirm") {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--surface)",
        padding: 20,
      }}>
        <div style={{ textAlign: "center", maxWidth: 400 }}>
          <div style={{ fontSize: 56, marginBottom: 20 }}>📧</div>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 12,
          }}>
            Check your email
          </div>
          <div style={{
            fontSize: 15,
            color: "var(--slate)",
            marginBottom: 28,
            lineHeight: 1.7,
          }}>
            We sent a confirmation link to{" "}
            <strong>{form.email}</strong>.
            Click it to activate your account then come back to log in.
          </div>
          <button
            className="btn btn-primary btn-lg"
            onClick={function () { setMode("login"); }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">

      {/* ── LEFT PANEL ── */}
      <div className="auth-left">
        <div className="auth-left-brand">⚡ Taskivo</div>
        <div className="auth-left-tagline">
          Watch videos. Answer questions. Earn real rewards — globally.
        </div>
        <div style={{ marginTop: 48, display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            { icon: "🎯", text: "Complete tasks from global creators" },
            { icon: "💰", text: "Earn points redeemable for cash" },
            { icon: "🛡️", text: "Anti-cheat system keeps it fair" },
            { icon: "🌍", text: "Available worldwide" },
          ].map(function (item) {
            return (
              <div key={item.text} style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                color: "rgba(255,255,255,.75)",
                fontSize: 14,
              }}>
                <span style={{ fontSize: 20 }}>{item.icon}</span>
                {item.text}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-right">
        <div className="auth-form">

          <div className="auth-title">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </div>
          <div className="auth-sub">
            {mode === "login"
              ? "Log in to continue earning on Taskivo."
              : "Join thousands of earners worldwide."}
          </div>

          {/* ROLE SELECTOR — register only */}
          {mode === "register" && (
            <div style={{
              display: "flex",
              background: "var(--line-2)",
              borderRadius: "var(--r-sm)",
              padding: 4,
              marginBottom: 24,
            }}>
              {["earner", "creator"].map(function (r) {
                var active = role === r;
                return (
                  <button
                    key={r}
                    onClick={function () { setRole(r); }}
                    style={{
                      flex: 1,
                      padding: "9px 0",
                      borderRadius: "var(--r-sm)",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "var(--font-body)",
                      fontWeight: 600,
                      fontSize: 14,
                      background: active ? "var(--white)" : "transparent",
                      color: active ? "var(--ink)" : "var(--slate)",
                      boxShadow: active ? "var(--shadow)" : "none",
                      transition: "all .2s",
                    }}
                  >
                    {r === "earner" ? "🎯 I want to Earn" : "✦ I'm a Creator"}
                  </button>
                );
              })}
            </div>
          )}

          {/* GOOGLE BUTTON */}
          <button
            className="btn btn-outline"
            style={{ width: "100%", justifyContent: "center", marginBottom: 4 }}
            onClick={handleGoogle}
            disabled={loading}
          >
            <img
              src="https://www.google.com/favicon.ico"
              width={16}
              height={16}
              alt="G"
            />
            Continue with Google
          </button>

          <div className="auth-divider">or</div>

          {/* NAME — register only */}
          {mode === "register" && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                type="text"
                name="name"
                placeholder="Your full name"
                value={form.name}
                onChange={handleChange}
              />
            </div>
          )}

          {/* EMAIL */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder={mode === "register" ? "Min. 6 characters" : "Your password"}
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {/* ERROR */}
          {error && (
            <div style={{
              background: "rgba(239,68,68,.08)",
              border: "1px solid rgba(239,68,68,.2)",
              borderRadius: "var(--r-sm)",
              padding: "10px 14px",
              fontSize: 13,
              color: "var(--red)",
              marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          {/* SUBMIT */}
          <button
            className="btn btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: 14 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "login" ? "Log In →" : "Create Account →"}
          </button>

          {/* SWITCH MODE */}
          <div className="auth-switch">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <a onClick={function () { setMode("register"); setError(""); }}>
                  Sign up free
                </a>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <a onClick={function () { setMode("login"); setError(""); }}>
                  Log in
                </a>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
