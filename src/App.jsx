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
import History from "./pages/History.jsx"; 

import CreatorDashboard from "./pages/CreatorDashboard.jsx";
import CreateTask from "./pages/CreateTask.jsx";
import CreatorTasks from "./pages/CreatorTasks.jsx";
import CreatorAnalytics from "./pages/CreatorAnalytics.jsx";
import CreatorApprovals from "./pages/CreatorApprovals.jsx";

import { About, Terms, Privacy } from "./pages/StaticPages.jsx";
import { BlogIndex, ArticleView } from "./pages/Blog.jsx";
import {
  AdminOverview,
  AdminUsers as AdminUsersComp,
  AdminTasks as AdminTasksComp,
  AdminWithdrawals as AdminWithdrawalsComp,
  AdminBlog as AdminBlogComp 
} from "./pages/AdminPanel.jsx";

// ── GLOBAL STICKY HEADER ──
function TopNav({ navigate, user, setAuthMode, theme, toggleTheme }) {
  const IconMoon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
  const IconSun = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 90,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 72, padding: "0 5%",
      background: "var(--surface)",
      borderBottom: "1px solid var(--line)",
      transition: "background-color 0.3s ease"
    }}>
      
      {/* 🔥 THE NEW TASKIVO SVG LOGO 🔥 */}
      <div 
        style={{ width: 130, display: "flex", alignItems: "center", cursor: "pointer" }} 
        onClick={function() { navigate("landing"); }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" style={{ width: '100%', height: 'auto', display: 'block' }}>
          <defs>
            <linearGradient id="lime3D" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A8FF3E" />
              <stop offset="100%" stopColor="#3D7000" />
            </linearGradient>
            <linearGradient id="goldAccent" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#FFF2C8" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <g transform="translate(15, 20)">
            <path d="M0 20 L20 10 L40 20 L20 30 Z" fill="url(#lime3D)" />
            <path d="M0 20 L20 30 L20 70 L0 60 Z" fill="#78D61A" />
            <path d="M20 30 L40 20 L40 60 L20 70 Z" fill="#3D7000" />
            <path d="M20 10 L45 0 L65 10 L40 20 Z" fill="url(#goldAccent)" filter="url(#glow)"/>
            <path d="M40 20 L65 10 L65 30 L40 40 Z" fill="#B38F24" />
          </g>

          <text x="105" y="78" fontFamily="'Inter', sans-serif" fontSize="56" fontWeight="900" fill="var(--ink)" letterSpacing="-2">Taskivo</text>
          
          <circle cx="340" cy="68" r="6" fill="url(#lime3D)" filter="url(#glow)" />
        </svg>
      </div>
      
      <div style={{ display: "flex", gap: 16, alignItems: "center", fontFamily: "'DM Sans', sans-serif" }}>
        
        {/* 🔥 VISITOR THEME TOGGLE 🔥 */}
        <button 
          onClick={toggleTheme} 
          style={{ background: 'transparent', border: 'none', color: 'var(--ink)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4 }}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? IconSun : IconMoon}
        </button>

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
          <div 
            onClick={() => { if(user.role === 'admin') navigate("admin-dashboard"); }}
            style={{ cursor: user.role === 'admin' ? 'pointer' : 'default', background: user.role === 'admin' ? 'rgba(212,175,55,0.1)' : 'var(--surface-card)', border: user.role === 'admin' ? '1px solid rgba(212,175,55,0.3)' : '1px solid var(--line)', color: user.role === 'admin' ? '#D4AF37' : 'var(--slate)', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, fontFamily: "'Inter', sans-serif" }}
          >
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
          
          {/* 🔥 UPDATED TOPNAV WITH THEME TOGGLE 🔥 */}
          <TopNav navigate={navigate} user={user} setAuthMode={setAuthMode} theme={theme} toggleTheme={toggleTheme} />

          {/* 🔥 ADMIN SECONDARY NAVIGATION (Auto-appears when in Admin pages) 🔥 */}
          {user && user.role === 'admin' && view.startsWith('admin-') && (
            <div style={{ background: 'var(--surface-card)', borderBottom: '1px solid var(--line)', padding: '12px 5%', display: 'flex', gap: 16, overflowX: 'auto', whiteSpace: 'nowrap', zIndex: 89, position: 'sticky', top: 72 }}>
              <button onClick={() => navigate('admin-dashboard')} style={{ background: 'transparent', border: 'none', color: view === 'admin-dashboard' ? 'var(--lime)' : 'var(--slate)', fontSize: 12, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>Overview</button>
              <button onClick={() => navigate('admin-users')} style={{ background: 'transparent', border: 'none', color: view === 'admin-users' ? 'var(--lime)' : 'var(--slate)', fontSize: 12, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>Identity</button>
              <button onClick={() => navigate('admin-tasks')} style={{ background: 'transparent', border: 'none', color: view === 'admin-tasks' ? 'var(--lime)' : 'var(--slate)', fontSize: 12, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>Campaigns</button>
              <button onClick={() => navigate('admin-withdrawals')} style={{ background: 'transparent', border: 'none', color: view === 'admin-withdrawals' ? 'var(--lime)' : 'var(--slate)', fontSize: 12, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>Treasury</button>
              <button onClick={() => navigate('admin-blog')} style={{ background: 'transparent', border: 'none', color: view === 'admin-blog' ? 'var(--lime)' : 'var(--slate)', fontSize: 12, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>Blog CMS</button>
            </div>
          )}

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
            {view === "history" && user && <History session={{user}} />}

            {view === "creator-dashboard" && user && <CreatorDashboard user={user} navigate={navigate} showToast={showToast} />}
            {view === "create-task" && user && <CreateTask session={{user}} navigate={navigate} />}
            {view === "creator-tasks" && user && <CreatorTasks user={user} navigate={navigate} showToast={showToast} />}
            {view === "creator-analytics" && user && <CreatorAnalytics user={user} navigate={navigate} showToast={showToast} />}
            {view === "creator-approvals" && user && <CreatorApprovals user={user} navigate={navigate} showToast={showToast} />}

            {view === "admin-dashboard" && user && <AdminOverview navigate={navigate} showToast={showToast} />}
            {view === "admin-users" && user && <AdminUsersComp showToast={showToast} currentUser={user} />}
            {view === "admin-tasks" && user && <AdminTasksComp showToast={showToast} />}
            {view === "admin-withdrawals" && user && <AdminWithdrawalsComp showToast={showToast} />}
            {view === "admin-blog" && user && <AdminBlogComp showToast={showToast} />}
          </div>
        </div>

        {user && <FloatingNav user={user} navigate={navigate} logout={logout} toggleTheme={toggleTheme} theme={theme} />}
      </div>
      <Toast toasts={toasts} />
    </>
  );
}
