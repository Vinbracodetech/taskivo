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

// Static & Admin Pages
import { About, Terms, Privacy, Disclaimer } from "./pages/StaticPages.jsx";
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
          <div style={{ background: 'rgba(168,255,62,0.1)', border: '1px solid rgba(168,255,62,0.2)', color: 'var(--lime)', padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 700, letterSpacing: '0.5px', fontFamily: "'Inter', sans-serif", transition: 'all 0.3s ease' }}>
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

export default function App() {
  // 🔥 ROUTING LOGIC
  var rawPath = window.location.pathname.replace(/^\/+/, "");
  var cleanPath = rawPath.split("?")[0] || "landing";
  
  var [view, setView] = useState(cleanPath);
  var [authMode, setAuthMode] = useState("login");
  var [user, setUser] = useState(null);
  var [loading, setLoading] = useState(true);
  var { toasts, show: showToast } = useToast();
  var [theme, setTheme] = useState(localStorage.getItem("taskivo-theme") || "dark");

  var [rewardPopup, setRewardPopup] = useState(null);

  // 🔥 CUSTOM PWA INSTALL STATE
  var [deferredPrompt, setDeferredPrompt] = useState(null);
  var [showInstallBanner, setShowInstallBanner] = useState(false);

  // 🔥 PWA INSTALL LOGIC
  useEffect(function() {
    function handleBeforeInstallPrompt(e) {
      e.preventDefault(); // Prevent default browser prompt
      setDeferredPrompt(e); // Save event to trigger later
      setShowInstallBanner(true); // Show custom Taskivo banner
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', function() {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
      console.log('Taskivo was successfully installed!');
    });

    return function() {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  async function handleInstallClick() {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    var { outcome } = await deferredPrompt.userChoice;
    console.log("Install prompt outcome:", outcome);
    
    setDeferredPrompt(null);
    setShowInstallBanner(false);
  }

  useEffect(function() {
    if (!user) return;
    
    async function syncPoints(e) {
      var { data } = await supabase.from("profiles").select("points").eq("id", user.id).single();
      if (data) {
        const oldBalance = user.points;
        const newBalance = data.points;

        setUser(function(prev) { return { ...prev, points: newBalance }; });
        
        if (newBalance > oldBalance) {
          const exactPointsEarned = newBalance - oldBalance;
          var ptsEarned = (e && e.detail && e.detail.points) ? e.detail.points : exactPointsEarned;
          var emojiIcon = (e && e.detail && e.detail.emoji) ? e.detail.emoji : "🎉";
          
          setRewardPopup({ points: ptsEarned, emoji: emojiIcon });
          
          setTimeout(function() {
            setRewardPopup(null);
          }, 3500);
        }
      }
    }

    window.addEventListener("taskivo_points_updated", syncPoints);
    return function() { window.removeEventListener("taskivo_points_updated", syncPoints); };
  }, [user]);

  // --- 🔥 ROOT-LEVEL REFERRAL AIR-TRAFFIC CONTROLLER 🔥 ---
  useEffect(function() {
    if (typeof window !== "undefined") {
      var refId = null;

      // 1. Try checking standard query parameters (e.g. /?ref=123)
      var standardParams = new URLSearchParams(window.location.search);
      if (standardParams.has("ref")) {
        refId = standardParams.get("ref");
      } 
      // 2. Fallback: Check inside the hash route (e.g. /#auth?ref=123)
      else if (window.location.hash.includes("ref=")) {
        var hashQuery = window.location.hash.split('?')[1];
        if (hashQuery) {
          var hashParams = new URLSearchParams(hashQuery);
          refId = hashParams.get("ref");
        }
      }

      // If a referral code exists, lock it in memory and force registration mode
      if (refId) {
        localStorage.setItem("taskivo_ref", refId);
        setAuthMode("register"); 
        navigate("auth"); 
      }
    }
  }, []);

  // Listen for back/forward browser buttons
  useEffect(function() {
    function handlePopState() {
      var path = window.location.pathname.replace(/^\/+/, "") || "landing";
      if (path.includes("?")) {
          path = path.split("?")[0];
      }
      setView(path);
    }
    window.addEventListener("popstate", handlePopState);
    return function() { window.removeEventListener("popstate", handlePopState); };
  }, []);

  // Push clean URLs to the browser history
  function navigate(v) {
    window.history.pushState({}, "", "/" + (v === 'landing' ? '' : v));
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

  // --- 🔥 UPDATED LOAD PROFILE WITH SECURE REFERRAL ENGINE 🔥 ---
  async function loadProfile(authUser) {
    setLoading(true);
    var result = await supabase.from("profiles").select("*").eq("id", authUser.id).single();
    
    // Check path for correct routing after auth
    var currentPath = window.location.pathname.replace(/^\/+/, "") || "landing";
    if (currentPath.includes("?")) currentPath = currentPath.split("?")[0];

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
      if (currentPath === "landing" || currentPath === "auth") {
        routeByRole(result.data.role);
      } else {
        setView(currentPath);
      }
    } else {
      // User does not exist yet (First time logging in after registration)
      var intendedRole = localStorage.getItem('taskivo_role') || "earner";
      var grantRequested = localStorage.getItem('taskivo_grant') === 'true';
      
      // Grab the referral code that was saved at the front door
      var refId = localStorage.getItem('taskivo_ref'); 
      
      var newProfile = {
        id: authUser.id,
        email: authUser.email,
        full_name: authUser.user_metadata ? authUser.user_metadata.full_name || "" : "",
        role: intendedRole, 
        points: 0,
        pilot_claimed: grantRequested
      };
      
      // Create the new user in the database
      await supabase.from("profiles").insert(newProfile);
      
      // Trigger the secure SQL referral function if they had an invite link
      if (refId) {
        try {
          await supabase.rpc('apply_referral_bonus', {
            new_user_id: authUser.id,
            referrer_id: refId
          });
        } catch (err) {
          console.error("Referral Bonus Error:", err);
        }
      }
      
      // Clean up local storage
      localStorage.removeItem('taskivo_role');
      localStorage.removeItem('taskivo_grant');
      localStorage.removeItem('taskivo_ref');
      
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
          
          <TopNav navigate={navigate} user={user} setAuthMode={setAuthMode} theme={theme} toggleTheme={toggleTheme} />

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
            
            {/* Static Pages */}
            {view === "about" && <About />}
            {view === "terms" && <Terms />}
            {view === "privacy" && <Privacy />}
            {view === "disclaimer" && <Disclaimer />}
            
            {view === "blog" && <BlogIndex navigate={navigate} />}
            {view.startsWith("article-") && <ArticleView navigate={navigate} id={view} user={user} setAuthMode={setAuthMode} />}

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
      
      {/* 🔥 CUSTOM PWA INSTALL BANNER 🔥 */}
      {showInstallBanner && (
        <div style={{
          position: 'fixed',
          bottom: user ? 90 : 24, // Sits perfectly above the Floating Nav
          left: '5%',
          right: '5%',
          maxWidth: 400,
          margin: '0 auto',
          background: 'var(--surface-card)',
          border: '1px solid var(--lime)',
          borderRadius: 16,
          padding: 16,
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.4)',
          zIndex: 99998,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          animation: 'taskivoFadeIn 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, background: 'var(--lime)', borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, color: '#000', fontSize: 20
            }}>
              T
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>Install Taskivo</h4>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--slate)' }}>Add to home screen for native access.</p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 8, width: '100%' }}>
            <button 
              onClick={handleInstallClick}
              style={{
                flex: 1, background: 'var(--lime)', color: '#000', border: 'none',
                borderRadius: 8, padding: 10, fontWeight: 800, fontSize: 13,
                cursor: 'pointer', fontFamily: "'Inter', sans-serif"
              }}
            >
              Install App
            </button>
            <button 
              onClick={() => setShowInstallBanner(false)}
              style={{
                background: 'transparent', color: 'var(--slate)', border: '1px solid var(--line)',
                borderRadius: 8, padding: '10px 16px', fontSize: 13, fontWeight: 700,
                cursor: 'pointer', fontFamily: "'Inter', sans-serif"
              }}
            >
              Later
            </button>
          </div>
        </div>
      )}

      {/* GLOBAL REWARD CELEBRATION OVERLAY */}
      {rewardPopup && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)',
          animation: 'taskivoFadeIn 0.2s ease-out'
        }}>
          <div style={{
            background: 'var(--surface-card)', border: '1px solid var(--lime)',
            padding: '40px 60px', borderRadius: 24, textAlign: 'center',
            boxShadow: '0 24px 64px rgba(168,255,62,0.15)',
            transform: 'scale(1)', animation: 'taskivoPopIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            <div style={{ fontSize: 64, marginBottom: 16, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))' }}>{rewardPopup.emoji}</div>
            <div style={{ fontSize: 12, color: 'var(--lime)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 8 }}>Yield Secured</div>
            <div style={{ fontSize: 40, fontWeight: 800, color: 'var(--ink)', fontFamily: "'Inter', sans-serif" }}>
              +{rewardPopup.points} PTS
            </div>
          </div>
          
          <style>{`
            @keyframes taskivoPopIn {
              0% { transform: scale(0.8); opacity: 0; }
              100% { transform: scale(1); opacity: 1; }
            }
            @keyframes taskivoFadeIn {
              0% { opacity: 0; }
              100% { opacity: 1; }
            }
          `}</style>
        </div>
      )}

      <Toast toasts={toasts} />
    </>
  );
}
