import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase.js";
import CSS from "./styles/global.js";
import Sidebar from "./components/Sidebar.jsx";
import Toast from "./components/Toast.jsx";
import useToast from "./components/useToast.js";

import Landing from "./pages/Landing.jsx";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import TaskPlayer from "./pages/TaskPlayer.jsx";
import Wallet from "./pages/Wallet.jsx";
import Withdraw from "./pages/Withdraw.jsx";
import CreatorDashboard from "./pages/CreatorDashboard.jsx";
import CreateTask from "./pages/CreateTask.jsx";
import CreatorTasks from "./pages/CreatorTasks.jsx";
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
      position: "sticky", top: 0, zIndex: 99,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 72, padding: "0 5%",
      background: "var(--surface)",
      borderBottom: "1px solid var(--line)",
      transition: "background-color 0.3s ease"
    }}>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 800, color: "var(--ink)", fontSize: 20, letterSpacing: "-0.5px",
        display: "flex", alignItems: "center", gap: 6, cursor: "pointer"
      }} onClick={function() { navigate("landing"); }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--lime)", display: "inline-block" }}></span>
        Taskivo
      </div>
      
      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <span style={{ color: "var(--slate)", cursor: "pointer", fontSize: 14, fontWeight: 600 }} onClick={function() { navigate("blog"); }}>Blog</span>
        {!user ? (
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-outline btn-sm" onClick={function() { if(setAuthMode) setAuthMode("login"); navigate("auth"); }}>Log in</button>
            <button className="btn btn-primary btn-sm" onClick={function() { if(setAuthMode) setAuthMode("register"); navigate("auth"); }}>Get Started</button>
          </div>
        ) : (
          <button className="btn btn-outline btn-sm" onClick={function() { navigate(user.role === 'admin' ? 'admin-dashboard' : user.role === 'creator' ? 'creator-dashboard' : 'user-dashboard'); }}>Dashboard</button>
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
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 24,
          fontWeight: 700,
          marginBottom: 8
        }}>
          {title}
        </div>
        <div style={{ color: "var(--slate)", fontSize: 14 }}>
          This page is being built. Check back soon.
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // 1. Read the starting page from the URL hash (if it exists)
  var initialHash = window.location.hash.replace("#", "") || "landing";
  
  var [view, setView] = useState(initialHash);
  var [authMode, setAuthMode] = useState("login");
  var [user, setUser] = useState(null);
  var [loading, setLoading] = useState(true);
  var [activeTask, setActiveTask] = useState(null);
  var { toasts, show: showToast } = useToast();
  
  var [theme, setTheme] = useState(localStorage.getItem("taskivo-theme") || "dark");

  // 2. Listen for the user clicking the browser Back/Forward buttons
  useEffect(function() {
    function handleHashChange() {
      var hash = window.location.hash.replace("#", "") || "landing";
      setView(hash);
    }
    window.addEventListener("hashchange", handleHashChange);
    return function() {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // 3. Update navigate to change the URL hash
  function navigate(v) {
    window.location.hash = v;
    setView(v);
    window.scrollTo(0, 0);
  }

  // Theme Logic
  useEffect(function () {
    document.body.className = "theme-" + theme;
    localStorage.setItem("taskivo-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(theme === "dark" ? "light" : "dark");
  }

  // Auth Logic
  useEffect(function () {
    supabase.auth.getSession().then(function (result) {
      var session = result.data.session;
      if (session) {
        loadProfile(session.user);
      } else {
        setLoading(false);
      }
    });

    var listener = supabase.auth.onAuthStateChange(function (event, session) {
      if (event === "SIGNED_OUT") {
        setUser(null);
        navigate("landing");
        setLoading(false);
      }
    });

    return function () {
      listener.data.subscription.unsubscribe();
    };
  }, []);

  async function loadProfile(authUser) {
    setLoading(true);
    var result = await supabase.from("profiles").select("*").eq("id", authUser.id).single();
    
    var currentHash = window.location.hash.replace("#", "") || "landing";

    if (result.data) {
      setUser(result.data);
      // If logging in or on landing, send to dashboard. Otherwise, stay on refreshed page.
      if (currentHash === "landing" || currentHash === "auth") {
        routeByRole(result.data.role);
      } else {
        setView(currentHash);
      }
    } else {
      var newProfile = {
        id: authUser.id,
        email: authUser.email,
        full_name: authUser.user_metadata ? authUser.user_metadata.full_name || "" : "",
        role: "earner",
        points: 0,
      };
      await supabase.from("profiles").insert(newProfile);
      setUser(newProfile);
      navigate("user-dashboard");
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
            <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, marginBottom: 16 }}>⚡ Taskivo</div>
            <div style={{ width: 32, height: 32, border: "3px solid var(--line)", borderTopColor: "var(--lime)", borderRadius: "50%", margin: "0 auto", animation: "spin 1s linear infinite" }} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="app-shell">

        {user && (
          <Sidebar user={user} view={view} navigate={navigate} logout={logout} />
        )}

        <div className="main-content" style={{ marginLeft: user ? "" : 0 }}>
          
          <TopNav navigate={navigate} user={user} setAuthMode={setAuthMode} />

          <div className="animate-fadeIn" key={view}>
            {/* PUBLIC */}
            {view === "landing" && <Landing navigate={navigate} setAuthMode={setAuthMode} />}
            {view === "auth" && <Auth authMode={authMode} setAuthMode={setAuthMode} navigate={navigate} loadProfile={loadProfile} />}
            {view === "about" && <About />}
            {view === "terms" && <Terms />}
            {view === "privacy" && <Privacy />}
            {view === "blog" && <BlogIndex navigate={navigate} />}
            {view.startsWith("article-") && <ArticleView navigate={navigate} id={view} />}

            {/* EARNER */}
            {view === "user-dashboard" && user && <Dashboard user={user} navigate={navigate} showToast={showToast} />}
            {view === "tasks" && user && <ComingSoon title="Tasks — coming soon" />}
            {view === "task-player" && user && activeTask && <TaskPlayer task={activeTask} navigate={navigate} user={user} setUser={setUser} showToast={showToast} />}
            {view === "wallet" && user && <Wallet user={user} navigate={navigate} showToast={showToast} />}
            {view === "withdraw" && user && <Withdraw user={user} setUser={setUser} navigate={navigate} showToast={showToast} />}

            {/* CREATOR */}
            {view === "creator-dashboard" && user && <CreatorDashboard user={user} navigate={navigate} showToast={showToast} />}
            {view === "create-task" && user && <CreateTask user={user} navigate={navigate} showToast={showToast} />}
            {view === "creator-tasks" && user && <CreatorTasks user={user} navigate={navigate} showToast={showToast} />}
            {view === "creator-analytics" && user && <CreatorTasks user={user} navigate={navigate} showToast={showToast} />}

            {/* ADMIN */}
            {view === "admin-dashboard" && user && <AdminOverview navigate={navigate} showToast={showToast} />}
            {view === "admin-users" && user && <AdminUsersComp showToast={showToast} />}
            {view === "admin-tasks" && user && <AdminTasksComp showToast={showToast} />}
            {view === "admin-withdrawals" && user && <AdminWithdrawalsComp showToast={showToast} />}
          </div>
        </div>
      </div>

      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "dark" ? "☀️" : "🌙"}
      </button>

      <Toast toasts={toasts} />
    </>
  );
}
