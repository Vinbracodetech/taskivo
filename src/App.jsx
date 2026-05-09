import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase.js";
import CSS from "./styles/global.js";

import FloatingNav from "./components/FloatingNav.jsx";
import Toast from "./components/Toast.jsx";
import useToast from "./components/useToast.js";

import Landing from "./pages/Landing.jsx";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Tasks from "./pages/Tasks.jsx";
import TaskPlayer from "./pages/TaskPlayer.jsx";
import Wallet from "./pages/Wallet.jsx";

import CreatorDashboard from "./pages/CreatorDashboard.jsx";
import CreateTask from "./pages/CreateTask.jsx";
import CreatorTasks from "./pages/CreatorTasks.jsx";
import CreatorAnalytics from "./pages/CreatorAnalytics.jsx";

import { About, Terms, Privacy } from "./pages/StaticPages.jsx";
import { BlogIndex, ArticleView } from "./pages/Blog.jsx";
import {
  AdminOverview,
  AdminUsers as AdminUsersComp,
  AdminTasks as AdminTasksComp,
  AdminWithdrawals as AdminWithdrawalsComp,
} from "./pages/AdminPanel.jsx";

// ── GLOBAL STICKY HEADER ──
function TopNav({ navigate, user, setAuthMode }) {
  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 90,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 72, padding: "0 5%",
      background: "var(--surface)",
      borderBottom: "1px solid var(--line)",
      transition: "background-color 0.3s ease"
    }}>
      <div style={{
        fontFamily: "'Inter', sans-serif",
        fontWeight: 800, color: "var(--ink)", fontSize: 22, letterSpacing: "-0.5px",
        display: "flex", alignItems: "center", gap: 8, cursor: "pointer"
      }} onClick={function() { navigate("landing"); }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--lime)", display: "inline-block" }}></span>
        Taskivo
      </div>
      
      <div style={{ display: "flex", gap: 16, alignItems: "center", fontFamily: "'DM Sans', sans-serif" }}>
        <span style={{ color: "var(--slate)", cursor: "pointer", fontSize: 14, fontWeight: 600 }} onClick={function() { navigate("blog"); }}>Blog</span>
        {!user ? (
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ background: "transparent", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: 6, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif" }} onClick={function() { if(setAuthMode) setAuthMode("login"); navigate("auth"); }}>Log in</button>
            <button style={{ background: "var(--lime)", color: "#000", border: "none", borderRadius: 6, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter', sans-serif" }} onClick={function() { if(setAuthMode) setAuthMode("register"); navigate("auth"); }}>Get Started</button>
          </div>
        ) : user.role === 'earner' ? (
          <div style={{ background: 'rgba(168,255,62,0.1)', border: '1px solid rgba(168,255,62,0.2)', color: 'var(--lime)', padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 700, letterSpacing: '0.5px', fontFamily: "'Inter', sans-serif" }}>
            {user.points.toLocaleString()} PTS
          </div>
        ) : (
          <div style={{ background: 'var(--surface-card)', border: '1px solid var(--line)', color: 'var(--slate)', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, fontFamily: "'Inter', sans-serif" }}>
            {user.role}
          </div>
        )}
      </div>
    </nav>
  );
}

function ComingSoon({ title }) {
  return (
    <div className="page animate-slideUp">
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔧</div>
        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{title}</div>
        <div style={{ color: "var(--slate)", fontSize: 14 }}>This page is being built. Check back soon.</div>
      </div>
    </div>
  );
}

export default function App() {
  var rawHash = window.location.hash.replace(/^#\/?/, "");
  var cleanHash = rawHash.split("?")[0] || "landing";
  
  var [view, setView] = useState(cleanHash);
  var [authMode, setAuthMode] = useState("login");
  var [user, setUser] = useState(null);
  var [loading, setLoading] = useState(true);
  var { toasts, show: showToast } = useToast();
  
  var [theme, setTheme] = useState(localStorage.getItem("taskivo-theme") || "dark");

  // 🔥 THE BULLETPROOF REFERRAL CATCHER 🔥
  useEffect(function() {
    if (typeof window !== "undefined") {
      var refId = null;

      var standardParams = new URLSearchParams(window.location.search);
      if (standardParams.has("ref")) {
        refId = standardParams.get("ref");
      } 
      else if (window.location.hash.includes("?")) {
        var hashString = window.location.hash.split("?")[1];
        var hashParams = new URLSearchParams(hashString);
        if (hashParams.has("ref")) {
          refId = hashParams.get("ref");
        }
      }

      if (refId) {
        localStorage.setItem("taskivo_ref", refId);
        setAuthMode("register"); // Instantly force UI to registration tab
      }
    }
  }, []);

  useEffect(function() {
    function handleHashChange() {
      var hash = window.location.hash.replace(/^#\/?/, "") || "landing";
      if (hash.includes("?")) {
          hash = hash.split("?")[0];
      }
      setView(hash);
    }
    window.addEventListener("hashchange", handleHashChange);
    return function() { window.removeEventListener("hashchange", handleHashChange); };
  }, []);

  function navigate(v) {
    window.location.hash = v;
    setView(v);
    window.scrollTo(0, 0);
  }

  useEffect(function () {
    document.body.className = "theme-" + theme;
    localStorage.setItem("taskivo-theme", theme);
  }, [theme]);

  function toggleTheme() { setTheme(theme === "dark" ? "light" : "dark"); }

  useEffect(function () {
    supabase.auth.getSession().then(function (result) {
      var session = result.data.session;
      if (session) { loadProfile(session.user); } else { setLoading(false); }
    });

    var listener = supabase.auth.onAuthStateChange(function (event, session) {
      if (event === "SIGNED_OUT") { setUser(null); navigate("landing"); setLoading(false); }
    });

    return function () { listener.data.subscription.unsubscribe(); };
  }, []);

  async function loadProfile(authUser) {
    setLoading(true);
    var result = await supabase.from("profiles").select("*").eq("id", authUser.id).single();
    
    var currentHash = window.location.hash.replace(/^#\/?/, "") || "landing";
    if (currentHash.includes("?")) currentHash = currentHash.split("?")[0];

    if (result.data) {
      if (result.data.role === 'suspended') {
        await supabase.auth.signOut();
        showToast("Your account has been suspended by an administrator.", "error");
        setUser(null);
        navigate("landing");
        setLoading(false);
        return;
      }

      setUser(result.data);
      if (currentHash === "landing" || currentHash === "auth") {
        routeByRole(result.data.role);
      } else {
        setView(currentHash);
      }
    } else {
      var intendedRole = localStorage.getItem('taskivo_role') || "earner";
      var grantRequested = localStorage.getItem('taskivo_grant') === 'true';
      
      var newProfile = {
        id: authUser.id,
        email: authUser.email,
        full_name: authUser.user_metadata ? authUser.user_metadata.full_name || "" : "",
        role: intendedRole, 
        points: 0,
        pilot_claimed: grantRequested
      };
      
      await supabase.from("profiles").insert(newProfile);
      
      localStorage.removeItem('taskivo_role');
      localStorage.removeItem('taskivo_grant');
      
      setUser(newProfile);
      routeByRole(intendedRole); 
    }
    setLoading(false);
  }

  function routeByRole(role) {
    if (role === "admin") navigate("admin-dashboard");
    else if (role === "creator") navigate("creator-dashboard");
    else navigate("user-dashboard");
  }

  async function logout() {
    await supabase.auth.signOut();
    showToast("Logged out successfully.", "info");
  }

  if (loading) {
    return (
      <>
        <style>{CSS}</style>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface)" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 32, fontWeight: 800, marginBottom: 16, color: "var(--ink)" }}>⚡ Taskivo</div>
            <div style={{ width: 32, height: 32, border: "3px solid var(--line)", borderTopColor: "var(--lime)", borderRadius: "50%", margin: "0 auto", animation: "spin 1s linear infinite" }} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="app-shell" style={{ position: 'relative', minHeight: '100vh', background: 'var(--surface)' }}>
        <div className="main-content" style={{ paddingBottom: user ? 100 : 0 }}>
          
          <TopNav navigate={navigate} user={user} setAuthMode={setAuthMode} />

          <div className="animate-fadeIn" key={view}>
            {view === "landing" && <Landing navigate={navigate} setAuthMode={setAuthMode} />}
            {view === "auth" && <Auth authMode={authMode} setAuthMode={setAuthMode} navigate={navigate} loadProfile={loadProfile} />}
            {view === "about" && <About />}
            {view === "terms" && <Terms />}
            {view === "privacy" && <Privacy />}
            {view === "blog" && <BlogIndex navigate={navigate} />}
            {view.startsWith("article-") && <ArticleView navigate={navigate} id={view} />}

            {view === "user-dashboard" && user && <Dashboard user={user} navigate={navigate} showToast={showToast} />}
            {view === "tasks" && user && <Tasks session={{user}} navigate={navigate} />}
            {view.startsWith("player/") && user && <TaskPlayer session={{user}} navigate={navigate} taskId={view.split('/')[1]} />}
            {view === "wallet" && user && <Wallet user={user} navigate={navigate} showToast={showToast} />}

            {view === "creator-dashboard" && user && <CreatorDashboard user={user} navigate={navigate} showToast={showToast} />}
            {view === "create-task" && user && <CreateTask session={{user}} navigate={navigate} />}
            {view === "creator-tasks" && user && <CreatorTasks user={user} navigate={navigate} showToast={showToast} />}
            {view === "creator-analytics" && user && <CreatorAnalytics user={user} navigate={navigate} showToast={showToast} />}

            {view === "admin-dashboard" && user && <AdminOverview navigate={navigate} showToast={showToast} />}
            {view === "admin-users" && user && <AdminUsersComp showToast={showToast} currentUser={user} />}
            {view === "admin-tasks" && user && <AdminTasksComp showToast={showToast} />}
            {view === "admin-withdrawals" && user && <AdminWithdrawalsComp showToast={showToast} />}
          </div>
        </div>

        {user && <FloatingNav user={user} navigate={navigate} logout={logout} toggleTheme={toggleTheme} theme={theme} />}
      </div>
      <Toast toasts={toasts} />
    </>
  );
}
