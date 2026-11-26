import { claimLoginReward } from './lib/loginStreak.js';
import { useWalletSummary } from './lib/useWalletSummary.js';
import { useState, useEffect, lazy, Suspense } from "react";
import NotificationBell from "./components/NotificationBell.jsx";
import { supabase } from "./lib/supabase.js";
import CSS from "./styles/global.js";

import FloatingNav from "./components/FloatingNav.jsx";
import Toast from "./components/Toast.jsx";
import useToast from "./components/useToast.js";

import Landing from "./pages/Landing.jsx";
const Auth=lazy(()=>import("./pages/Auth.jsx"));
const Dashboard=lazy(()=>import("./pages/Dashboard.jsx"));
const Wallet=lazy(()=>import("./pages/Wallet.jsx"));
const History=lazy(()=>import("./pages/History.jsx"));
const Offerwalls=lazy(()=>import("./pages/Offerwalls.jsx"));

const CampaignRequest=lazy(()=>import("./pages/CampaignRequest.jsx").then(m=>({default:m.CampaignRequest})));
const EarningMarketplace=lazy(()=>import("./pages/CampaignRequest.jsx").then(m=>({default:m.EarningMarketplace})));
const OfficialTaskAdmin=lazy(()=>import("./pages/TaskNetwork.jsx").then(m=>({default:m.OfficialTaskAdmin})));

// Static & Admin Pages
import { About, Terms, Privacy, Disclaimer, DeleteAccount } from "./pages/StaticPages.jsx";
import { BlogIndex, ArticleView } from "./pages/Blog.jsx";
import { EarningGuide, earningGuides } from "./pages/EarningGuides.jsx";
import YoutubeMonetization from "./pages/YoutubeMonetization.jsx";
const AdminOverview=lazy(()=>import("./pages/AdminPanel.jsx").then(m=>({default:m.AdminOverview})));
const AdminUsersComp=lazy(()=>import("./pages/AdminPanel.jsx").then(m=>({default:m.AdminUsers})));
const AdminWithdrawalsComp=lazy(()=>import("./pages/AdminPanel.jsx").then(m=>({default:m.AdminWithdrawals})));
const AdminBlogComp=lazy(()=>import("./pages/AdminPanel.jsx").then(m=>({default:m.AdminBlog})));
const AdminNotificationsComp=lazy(()=>import("./pages/AdminPanel.jsx").then(m=>({default:m.AdminNotifications})));

// ── GLOBAL STICKY HEADER ──
function TopNav({ navigate, user, setAuthMode, theme, toggleTheme, onInboxCount, walletSummary }) {
  const IconMoon = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>;
  const IconSun = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>;

  return (
    <nav className={user?"taskivo-topnav signed-in":"taskivo-topnav"} style={{
      position: "sticky", top: 0, zIndex: 90,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      height: 72, padding: "0 5%",
      background: "var(--surface)",
      borderBottom: "1px solid var(--line)",
      transition: "background-color 0.3s ease"
    }}>
      
      <div 
        className="taskivo-nav-logo" style={{ width: 130, flexShrink:0, display: "flex", alignItems: "center", cursor: "pointer" }} 
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
      
      <div className="taskivo-nav-actions" style={{ display: "flex", gap: 16, alignItems: "center", fontFamily: "'DM Sans', sans-serif" }}>
        
        <button 
          onClick={toggleTheme} 
          style={{ background: 'transparent', border: 'none', color: 'var(--ink)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4 }}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? IconSun : IconMoon}
        </button>

        <a className="taskivo-nav-blog" href="/blog" style={{ color: "var(--slate)", fontSize: 14, fontWeight: 600 }} onClick={function(e) { if (e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return; e.preventDefault(); navigate("blog"); }}>Blog</a>
        
        {user&&<NotificationBell key={user.id} user={user} onCount={onInboxCount}/>}
        {!user ? (
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ background: "transparent", color: "var(--ink)", border: "1px solid var(--line)", borderRadius: 6, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Inter', sans-serif" }} onClick={function() { if(setAuthMode) setAuthMode("login"); navigate("auth"); }}>Log in</button>
            <button style={{ background: "var(--lime)", color: "#000", border: "none", borderRadius: 6, padding: "8px 16px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'Inter', sans-serif" }} onClick={function() { if(setAuthMode) setAuthMode("register"); navigate("auth"); }}>Get Started</button>
          </div>
        ) : user.role === 'earner' ? (
          <div style={{ background: 'rgba(168,255,62,0.1)', border: '1px solid rgba(168,255,62,0.2)', color: 'var(--lime)', padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 700, letterSpacing: '0.5px', fontFamily: "'Inter', sans-serif", transition: 'all 0.3s ease' }}>
            {walletSummary.total===null?'—':walletSummary.total.toLocaleString()} PTS
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
  // 🔴 MAINTENANCE KILL SWITCH 🔴
  // Set to 'true' to lock down the site. Set to 'false' to go live.
  const IS_MAINTENANCE_MODE = false; 

  if (IS_MAINTENANCE_MODE) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)', color: 'var(--ink)', fontFamily: "'Inter', sans-serif", padding: 20, textAlign: 'center' }}>
        <div style={{ background: 'var(--surface-card)', border: '1px solid var(--lime)', borderRadius: 24, padding: '60px 40px', maxWidth: 500, boxShadow: '0 20px 60px rgba(168,255,62,0.1)' }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>🛠️</div>
          <h1 style={{ fontSize: 32, fontWeight: 800, margin: '0 0 16px', letterSpacing: '-1px' }}>Network Upgrade in Progress</h1>
          <p style={{ color: 'var(--slate)', fontSize: 16, lineHeight: 1.6, margin: '0 0 32px' }}>
            Taskivo is growing its contributor network. Paid offers are in a limited pilot, and withdrawals are paused. 
          </p>
          <div style={{ display: 'inline-block', background: 'rgba(168,255,62,0.1)', color: 'var(--lime)', border: '1px solid rgba(168,255,62,0.2)', padding: '8px 16px', borderRadius: 100, fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
            We will be back shortly
          </div>
        </div>
      </div>
    );
  }

  // 🔥 ROUTING LOGIC
  var rawPath = window.location.pathname.replace(/^\/+/, "");
  var cleanPath = rawPath.replace(/\/+$/, "") || "landing";
  
  var [view, setView] = useState(cleanPath);
  var [authMode, setAuthMode] = useState("login");
  var [user, setUser] = useState(null);
  const walletSummary=useWalletSummary(user?.id,view);
  var [inboxCount,setInboxCount]=useState(null);
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

  // A visible, signed-in visit qualifies for today's login streak reward.
  useEffect(function(){
    if(!user?.id||user.role!=='earner')return;
    let active=true,inFlight=false;
    async function checkLogin(){
      if(!active||inFlight||document.hidden)return;
      inFlight=true;
      try{await claimLoginReward();}catch{/* dashboard offers a retry; never fabricate credits */}finally{inFlight=false;}
    }
    checkLogin();
    window.addEventListener('focus',checkLogin);
    document.addEventListener('visibilitychange',checkLogin);
    return()=>{active=false;window.removeEventListener('focus',checkLogin);document.removeEventListener('visibilitychange',checkLogin);};
  },[user?.id,user?.role,view]);

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

  // --- 🔥 DEDICATED REFERRAL EXECUTION ENGINE 🔥 ---
  // Guaranteed to fire on successful login, regardless of Supabase background triggers
  useEffect(() => {
    if (user) {
      const refId = localStorage.getItem("taskivo_ref");
      if (refId) {
        supabase.rpc('apply_referral_bonus', {
          new_user_id: user.id,
          referrer_id: refId
        }).then(({ error }) => {
          // Always destroy the memory token immediately so it doesn't double-fire
          localStorage.removeItem("taskivo_ref");
          
          if (!error) {
            // Force the UI to refresh and trigger the global celebration popup
            window.dispatchEvent(new CustomEvent("taskivo_points_updated", { 
              detail: { points: 10, emoji: "🤝" } 
            }));
          } else {
            console.error("Referral Engine Blocked:", error);
          }
        });
      }
    }
  }, [user]);

  // Listen for back/forward browser buttons
  useEffect(function() {
    function handlePopState() {
      var path = window.location.pathname.replace(/^\/+|\/+$/g, "") || "landing";
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
    let active=true;
    let timer;
    const load=(session)=>{
      if(!active) return;
      if(session?.user) loadProfile(session.user).catch(()=>{if(active)setLoading(false);});
      else {setUser(null);setLoading(false);}
    };
    supabase.auth.getSession().then(({data})=>load(data?.session)).catch(()=>{if(active)setLoading(false);});
    const listener=supabase.auth.onAuthStateChange((event,session)=>{
      if(event==="SIGNED_OUT"){sessionStorage.removeItem("taskivo_return_to");setUser(null);navigate("landing");setLoading(false);}
      if(event==="SIGNED_IN"){clearTimeout(timer);timer=setTimeout(()=>load(session),0);}
    });
    return ()=>{active=false;clearTimeout(timer);listener.data.subscription.unsubscribe();};
  }, []);

  // --- 🔥 UPDATED LOAD PROFILE WITH SECURE UPSERT 🔥 ---
  async function loadProfile(authUser) {
    setLoading(true);
    var result = await supabase.from("profiles").select("*").eq("id", authUser.id).single();
    
    // Check path for correct routing after auth
    var currentPath = window.location.pathname.replace(/^\/+|\/+$/g, "") || "landing";
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
      // User does not exist yet (First time logging in after registration OR ghost account recovery)
      var intendedRole = 'earner';
      var grantRequested = localStorage.getItem('taskivo_grant') === 'true';
      
      var newProfile = {
        id: authUser.id,
        email: authUser.email,
        full_name: authUser.user_metadata ? authUser.user_metadata.full_name || "" : "",
        role: intendedRole, 
        points: 0,
        pilot_claimed: false,
        local_currency: 'NGN' // Ensuring default currency to prevent crash
      };
      
      // 🔥 FIX: Replaced .insert() with .upsert() to resurrect deleted ghost accounts safely
      const { error: upsertErr } = await supabase.from("profiles").insert(newProfile);
      
      if (upsertErr) {
        console.error("Upsert failed:", upsertErr);
        showToast("Critical Error: Could not initialize profile.", "error");
        setLoading(false);
        return;
      }
      
      // Clean up local storage
      localStorage.removeItem('taskivo_role');
      localStorage.removeItem('taskivo_grant');
      
      setUser(newProfile);
      routeByRole(intendedRole); 
    }
    setLoading(false);
  }

  function routeByRole(role) {
    const next = sessionStorage.getItem("taskivo_return_to");
    sessionStorage.removeItem("taskivo_return_to");
    if (["offerwalls","wallet","tasks","history"].includes(next) && ["admin","earner"].includes(role)) {navigate(next);return;}
    localStorage.removeItem("taskivo_requested_service");
    localStorage.removeItem("taskivo_requested_package");
    if (role === "admin") navigate("admin-dashboard");
    else if (role === "creator") navigate("creator-dashboard");
    else navigate("user-dashboard");
  }

  async function logout() {
    await supabase.auth.signOut();
    showToast("Logged out successfully.", "info");
  }

  const publicView = ["landing", "about", "terms", "privacy", "disclaimer", "delete-account", "blog", "youtube-monetization", ...Object.keys(earningGuides)].includes(view) || /^article-[a-z0-9-]+$/.test(view);

  useEffect(() => {
    if (!loading && !user && !publicView && !["auth","create-task"].includes(view)) {
      if (["offerwalls","wallet","tasks","history"].includes(view)) sessionStorage.setItem("taskivo_return_to",view);
      setAuthMode("login");
      navigate("auth");
    }
  }, [loading,user,view,publicView]);

  useEffect(() => {
    const origin = "https://www.taskivo.online";
    const path = view === "landing" ? "/" : "/" + view;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (publicView) {
      if (!canonical) { canonical = document.createElement("link"); canonical.rel = "canonical"; document.head.appendChild(canonical); }
      canonical.href = origin + path;
    } else if (canonical) canonical.remove();
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) { robots = document.createElement("meta"); robots.name = "robots"; document.head.appendChild(robots); }
    robots.content = publicView ? "index, follow" : "noindex, follow";
    if (view === "blog") {
      document.title = "Taskivo Blog | Online Work, Paid Surveys & Creator Guides";
      document.querySelector('meta[name="description"]').content = "Practical guides to paid surveys, online work, usability testing, safety and organic YouTube growth.";
    } else if (!publicView) {
      document.title = "Taskivo | Account";
      document.querySelector('meta[name="description"]').content = "Manage your Taskivo account.";
    }
  }, [view, publicView]);

  if (loading && !publicView) {
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
          
          <style>{`@media(max-width:560px){.taskivo-topnav.signed-in{padding:0 3%!important}.signed-in .taskivo-nav-logo{width:88px!important}.signed-in .taskivo-nav-actions{gap:8px!important}.signed-in .taskivo-nav-blog{display:none}}`}</style><TopNav navigate={navigate} user={user} setAuthMode={setAuthMode} theme={theme} toggleTheme={toggleTheme} onInboxCount={setInboxCount} walletSummary={walletSummary}/>

          {user && user.role === 'admin' && view.startsWith('admin-') && (
            <div style={{ background: 'var(--surface-card)', borderBottom: '1px solid var(--line)', padding: '12px 5%', display: 'flex', gap: 16, overflowX: 'auto', whiteSpace: 'nowrap', zIndex: 89, position: 'sticky', top: 72 }}>
              <button onClick={() => navigate('admin-dashboard')} style={{ background: 'transparent', border: 'none', color: view === 'admin-dashboard' ? 'var(--lime)' : 'var(--slate)', fontSize: 12, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>Overview</button>
              <button onClick={() => navigate('admin-users')} style={{ background: 'transparent', border: 'none', color: view === 'admin-users' ? 'var(--lime)' : 'var(--slate)', fontSize: 12, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>Identity</button>
              <button onClick={() => navigate('admin-tasks')} style={{ background: 'transparent', border: 'none', color: view === 'admin-tasks' ? 'var(--lime)' : 'var(--slate)', fontSize: 12, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>Campaigns</button>
              <button onClick={() => navigate('admin-withdrawals')} style={{ background: 'transparent', border: 'none', color: view === 'admin-withdrawals' ? 'var(--lime)' : 'var(--slate)', fontSize: 12, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>Treasury</button>
              <button onClick={() => navigate('admin-notifications')} style={{ background: 'transparent', border: 'none', color: view === 'admin-notifications' ? 'var(--lime)' : 'var(--slate)', fontSize: 12, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>Alerts</button>
              <button onClick={() => navigate('admin-blog')} style={{ background: 'transparent', border: 'none', color: view === 'admin-blog' ? 'var(--lime)' : 'var(--slate)', fontSize: 12, fontWeight: 800, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>Blog CMS</button>
            </div>
          )}

          <div className="animate-fadeIn" key={view}><Suspense fallback={<div role="status" style={{padding:"48px 5%",textAlign:"center",color:"var(--slate)"}}>Loading page…</div>}>
            {view === "landing" && <Landing navigate={navigate} setAuthMode={setAuthMode} user={user} />}
            {view === "auth" && <Auth authMode={authMode} setAuthMode={setAuthMode} navigate={navigate} loadProfile={loadProfile} />}
            
           {/* Static Pages */}
            {view === "about" && <About />}
            {view === "terms" && <Terms />}
            {view === "privacy" && <Privacy />}
            {view === "disclaimer" && <Disclaimer />}
            {view === "delete-account" && <DeleteAccount />}
            
            {view === "blog" && <BlogIndex navigate={navigate} />}
            {Object.hasOwn(earningGuides, view) && <EarningGuide slug={view} />}
            {view === "youtube-monetization" && <YoutubeMonetization />}
            {view.startsWith("article-") && <ArticleView navigate={navigate} id={view} user={user} setAuthMode={setAuthMode} />}

            {view === "user-dashboard" && user && <Dashboard user={user} navigate={navigate} showToast={showToast} inboxCount={inboxCount} walletSummary={walletSummary}/>}
            {view === "tasks" && user && <EarningMarketplace navigate={navigate} user={user} />}
            {view.startsWith("player/") && user && <div style={{padding:'48px 5%',maxWidth:900,margin:'0 auto',color:'var(--ink)'}}><h1 style={{fontSize:28,fontWeight:800}}>Earning opportunities</h1><p style={{lineHeight:1.7,color:'var(--slate)'}}>Legacy tasks are temporarily paused while reward verification is upgraded. Partner-funded surveys will open after settlement and safety checks.</p><button onClick={()=>navigate('offerwalls')} style={{background:'var(--lime)',color:'#000',border:0,borderRadius:12,padding:'12px 20px',fontWeight:700}}>Explore Offerwalls & Surveys</button></div>}
            {view === "wallet" && user && <Wallet user={user} navigate={navigate} walletSummary={walletSummary} />}
            {view === "history" && user && <History session={{user}} navigate={navigate} />}
            
            {/* 🔥 NEW: Offerwalls Route Inserted Here */}
            {view === "offerwalls" && user && <Offerwalls session={{user}} navigate={navigate} />}

            {view === "creator-dashboard" && user && <CampaignRequest user={user} navigate={navigate} />}
            {view === "create-task" && <CampaignRequest user={user} navigate={navigate} setAuthMode={setAuthMode} />}
            {view === "creator-tasks" && user && <CampaignRequest user={user} navigate={navigate} />}
            {view === "creator-analytics" && user && <CampaignRequest user={user} navigate={navigate} />}
            {view === "creator-approvals" && user && <div style={{padding:'48px 5%',maxWidth:900,margin:'0 auto',color:'var(--ink)'}}><h1 style={{fontSize:28,fontWeight:800}}>Campaigns temporarily paused</h1><p style={{color:'var(--slate)',lineHeight:1.7}}>We are upgrading payment verification. Do not make a campaign payment during maintenance. Existing records remain available.</p></div>}

            {view === "admin-dashboard" && user?.role === "admin" && <><div style={{padding:"16px 5%"}}><button style={{background:"var(--lime)",color:"#111",padding:"12px 20px",border:0,borderRadius:8,fontWeight:700}} onClick={()=>navigate("offerwalls")}>Test Offerwall.GG</button></div><AdminOverview navigate={navigate} showToast={showToast} /></>}
            {view === "admin-users" && user?.role === "admin" && <AdminUsersComp showToast={showToast} currentUser={user} />}
            {view === "admin-tasks" && user?.role === "admin" && <OfficialTaskAdmin />}
            {view === "admin-withdrawals" && user?.role === "admin" && <AdminWithdrawalsComp showToast={showToast} />}
            {view === "admin-notifications" && user?.role === "admin" && <AdminNotificationsComp showToast={showToast} />}
            {view === "admin-blog" && user?.role === "admin" && <AdminBlogComp showToast={showToast} />}
          </Suspense></div>
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
