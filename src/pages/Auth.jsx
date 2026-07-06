import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";

export default function Auth({ authMode, setAuthMode, navigate, loadProfile }) {
  var [mode, setMode] = useState(function() {
    if (typeof window !== "undefined" && (localStorage.getItem("taskivo_ref") || localStorage.getItem("taskivo_grant"))) {
      return "register";
    }
    return authMode || "login";
  });
  
  var [role, setRole] = useState(function() {
    if (typeof window !== "undefined") {
      return localStorage.getItem('taskivo_role') || "earner";
    }
    return "earner";
  });

  var [loading, setLoading] = useState(false);
  var [error, setError] = useState("");
  var [mounted, setMounted] = useState(false);

  // --- FIXED HYBRID URL SNIFFER ---
  useEffect(function () {
    if (typeof window !== "undefined") {
      var refCode = null;
      
      // 1. Try checking standard query parameters
      var params = new URLSearchParams(window.location.search);
      refCode = params.get('ref');
      
      // 2. Fallback: Check inside the hash route (for #auth?ref=...)
      if (!refCode && window.location.hash.includes('?')) {
        var hashQuery = window.location.hash.split('?')[1];
        var hashParams = new URLSearchParams(hashQuery);
        refCode = hashParams.get('ref');
      }

      // If a code is found, lock it in and force registration mode
      if (refCode) {
        localStorage.setItem("taskivo_ref", refCode);
        setMode("register"); 
      }
    }

    var t = setTimeout(function () { setMounted(true); }, 50);
    return function () { clearTimeout(t); };
  }, []);

  // ── THE GREETER: PROCESS GRANTS, REFERRALS AND LET THEM IN ──
  useEffect(function () {
    var { data: authListener } = supabase.auth.onAuthStateChange(async function(event, session) {
      if (event === 'SIGNED_IN' && session) {
        
        var storedRef = localStorage.getItem("taskivo_ref");
        var hasGrant = localStorage.getItem("taskivo_grant");
        var storedRole = localStorage.getItem("taskivo_role");
        
        var updates = {};
        var { data: dbUser } = await supabase.from("profiles").select("*").eq("id", session.user.id).single();

        if (dbUser) {
          var finalRole = dbUser.role || storedRole || "earner";

          if (!dbUser.role && storedRole) updates.role = storedRole;

          // CREATOR-ONLY 10-SPOT GRANT CHECK
          if (hasGrant && !dbUser.pilot_claimed && finalRole === "creator") {
            var { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).gt('free_credits', 0);
            if (count < 10) {
              updates.free_credits = 1;
              updates.pilot_claimed = true;
            } else {
              updates.pilot_claimed = true; 
            }
          }

          // Apply general updates
          if (Object.keys(updates).length > 0) {
            await supabase.from("profiles").update(updates).eq("id", session.user.id);
          }

          // TRIGGER THE SECURE REFERRAL ENGINE
          if (storedRef && !dbUser.referred_by) {
            await supabase.rpc('apply_referral_bonus', {
                new_user_id: session.user.id,
                referrer_id: storedRef
            });
          }
        }

        // Clean up memory to prevent infinite loops
        localStorage.removeItem("taskivo_ref");
        localStorage.removeItem("taskivo_grant");
        localStorage.removeItem("taskivo_role");

        // Immediately let them into the dashboard
        if (loadProfile) await loadProfile(session.user);
      }
    });
    
    return function () { 
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe(); 
      }
    };
  }, [loadProfile]);

  function handleRoleChange(newRole) {
    setRole(newRole);
    if (typeof window !== "undefined") {
      localStorage.setItem('taskivo_role', newRole);
    }
  }

  async function handleGoogle() {
    setLoading(true); setError("");
    var result = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } });
    if (result.error) { setError(result.error.message); setLoading(false); }
  }

  // ── STYLES ──
  var overlayStyle = { position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 80% 60% at 20% 110%, rgba(168,255,62,0.13) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% -10%, rgba(168,255,62,0.08) 0%, transparent 55%)" };
  var gridStyle = { position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundSize: "48px 48px", backgroundImage: "linear-gradient(rgba(168,255,62,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(168,255,62,0.04) 1px, transparent 1px)" };
  var pageStyle = { minHeight: "100vh", display: "flex", background: "#0D0D14", position: "relative", overflow: "hidden", fontFamily: "'DM Sans', sans-serif" };
  var leftStyle = { flex: "0 0 45%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "60px 56px", position: "relative", zIndex: 1, opacity: mounted ? 1 : 0, transform: mounted ? "translateX(0)" : "translateX(-24px)", transition: "opacity 0.7s ease, transform 0.7s ease" };
  var rightStyle = { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 48px", position: "relative", zIndex: 1, opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s" };
  var cardStyle = { width: "100%", maxWidth: 420, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 20, padding: "40px 36px", backdropFilter: "blur(20px)", boxShadow: "0 32px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)" };
  var logoStyle = { display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 48, textDecoration: "none", cursor: "pointer" };
  var logoTextStyle = { fontFamily: "'Inter', sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" };
  var logoBadgeStyle = { background: "#A8FF3E", color: "#0D0D14", fontSize: 13, fontWeight: 800, padding: "2px 8px", borderRadius: 6, letterSpacing: "0.5px" };
  var headlineStyle = { fontFamily: "'Inter', sans-serif", fontSize: 42, fontWeight: 800, color: "#fff", lineHeight: 1.1, letterSpacing: "-1.5px", marginBottom: 20 };
  var subStyle = { fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 360, marginBottom: 48 };
  var featuresData = [ { icon: "🛡️", label: "Proof of Attention", desc: "Strict anti-cheat verification" }, { icon: "🌍", label: "Omnichannel Reach", desc: "YouTube, TikTok, & SEO Blogs" }, { icon: "📈", label: "Dynamic Rewards", desc: "Earn points based on genuine activity" } ];
  var statData = [ { num: "Beta", label: "Phase 1" }, { num: "2.0", label: "Infrastructure" }, { num: "100%", label: "Verified" } ];
  var cardTitleStyle = { fontFamily: "'Inter', sans-serif", fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-1px", marginBottom: 6 };
  var cardSubStyle = { fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 32 };
  var googleBtnStyle = { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "16px 20px", background: "#ffffff", border: "none", borderRadius: 12, color: "#0D0D14", fontSize: 15, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", cursor: "pointer", transition: "all 0.2s", marginBottom: 20, boxShadow: "0 8px 16px rgba(255,255,255,0.1)" };
  var switchStyle = { textAlign: "center", marginTop: 24, fontSize: 13, color: "rgba(255,255,255,0.35)" };
  var switchLinkStyle = { color: "#A8FF3E", fontWeight: 700, cursor: "pointer", textDecoration: "none" };
  var errorStyle = { background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#f87171", marginBottom: 16 };
  var roleTabStyle = function (active) { return { flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 13, background: active ? "#A8FF3E" : "transparent", color: active ? "#0D0D14" : "rgba(255,255,255,0.4)", transition: "all 0.2s" }; };

  var authCardContent = (
    <div style={{ ...cardStyle, zIndex: 1, width: "100%" }}>
      <div style={{ ...cardTitleStyle, fontSize: 24, marginBottom: 8 }}>{mode === "login" ? "Welcome back" : "Join Taskivo"}</div>
      <div style={{ ...cardSubStyle }}>{mode === "login" ? "Access your engagement portfolio." : "Start participating today."}</div>
      
      {mode === "register" && (
        <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 4, marginBottom: 24, gap: 4 }}>
          {["earner", "creator"].map(function (r) { return <button key={r} onClick={function () { handleRoleChange(r); }} style={roleTabStyle(role === r)}>{r === "earner" ? "🎯 Contributor" : "✦ Business"}</button>; })}
        </div>
      )}

      {error && <div style={errorStyle}>{error}</div>}

      <button style={googleBtnStyle} onClick={handleGoogle} disabled={loading}>
        <img src="https://www.google.com/favicon.ico" width={18} height={18} alt="G" /> 
        {loading ? "Authenticating..." : "Continue with Google"}
      </button>
      
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textAlign: "center", lineHeight: 1.5 }}>
        By continuing, you agree to our strict anti-bot policies and Terms of Service.
      </div>

      <div style={switchStyle}>
        {mode === "login" ? <>Don't have an account? <span style={switchLinkStyle} onClick={function () { setMode("register"); setError(""); }}>Sign up free</span></> : <>Already have an account? <span style={switchLinkStyle} onClick={function () { setMode("login"); setError(""); }}>Log in</span></>}
      </div>
    </div>
  );

  return (
    <div style={pageStyle}>
      <div style={gridStyle} />
      <div style={overlayStyle} />
      
      {typeof window !== "undefined" && window.innerWidth < 768 ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 20px", width: "100%", zIndex: 1 }}>
          <div style={{ marginBottom: 32, textAlign: "center" }}>
            <div onClick={function() { if(navigate) navigate(''); }} style={{ ...logoTextStyle, fontSize: 22, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: 'pointer' }}>⚡ Taskivo <span style={logoBadgeStyle}>BETA</span></div>
          </div>
          {authCardContent}
        </div>
      ) : (
        <>
          <div style={leftStyle}>
            <div style={logoStyle} onClick={function() { if(navigate) navigate(''); }}><span style={logoTextStyle}>⚡ Taskivo</span><span style={logoBadgeStyle}>BETA</span></div>
            <div style={headlineStyle}>Scale your reach.<br /><span style={{ color: "#A8FF3E" }}>Earn from real engagement.</span></div>
            <div style={subStyle}>An omnichannel infrastructure connecting businesses with a global network of verified contributors.</div>
            <div style={{ display: "flex", gap: 32, marginBottom: 48 }}>
              {statData.map(function (s) { return <div key={s.label}><div style={{ fontFamily: "'Inter', sans-serif", fontSize: 22, fontWeight: 800, color: "#A8FF3E" }}>{s.num}</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{s.label}</div></div>; })}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {featuresData.map(function (f) { return <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 14 }}><div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(168,255,62,0.1)", border: "1px solid rgba(168,255,62,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{f.icon}</div><div><div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{f.label}</div><div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{f.desc}</div></div></div>; })}
            </div>
          </div>
          <div style={rightStyle}>
            {authCardContent}
          </div>
        </>
      )}
    </div>
  );
}
