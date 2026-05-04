import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase.js";
import CSS from "./styles/global.js";
import Sidebar from "./components/Sidebar.jsx";
import Toast from "./components/Toast.jsx";
import useToast from "./components/useToast.js";

// ── Pages (we add more imports as we build each file) ──
import Landing from "./pages/Landing.jsx";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import TaskPlayer from "./pages/TaskPlayer.jsx";
import Wallet from "./pages/Wallet.jsx";
import Withdraw from "./pages/Withdraw.jsx";
import CreatorDashboard from "./pages/CreatorDashboard.jsx";
import CreateTask from "./pages/CreateTask.jsx";
import CreatorTasks from "./pages/CreatorTasks.jsx";
import { AdminDashboard, AdminTasksPage, AdminWithdrawalsPage } from "./pages/AdminPanel.jsx";
import AdminUsersPage from "./pages/AdminPanel.jsx";

// ── Placeholder shown for pages not built yet ──
function ComingSoon({ title }) {
  return (
    <div className="page animate-slideUp">
      <div style={{
        textAlign: "center",
        padding: "80px 20px"
      }}>
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
  var [view, setView] = useState("landing");
  var [authMode, setAuthMode] = useState("login");
  var [user, setUser] = useState(null);
  var [loading, setLoading] = useState(true);
  var [activeTask, setActiveTask] = useState(null);
  var { toasts, show: showToast } = useToast();

  // ── On app load: check if user is already logged in ──
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
        setView("landing");
        setLoading(false);
      }
    });

    return function () {
      listener.data.subscription.unsubscribe();
    };
  }, []);

  // ── Load user profile from Supabase ──
  async function loadProfile(authUser) {
    setLoading(true);

    var result = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (result.data) {
      setUser(result.data);
      routeByRole(result.data.role);
    } else {
      // First time login — create profile automatically
      var newProfile = {
        id: authUser.id,
        email: authUser.email,
        full_name: authUser.user_metadata
          ? authUser.user_metadata.full_name || ""
          : "",
        role: "earner",
        points: 0,
      };
      await supabase.from("profiles").insert(newProfile);
      setUser(newProfile);
      setView("user-dashboard");
    }

    setLoading(false);
  }

  function routeByRole(role) {
    if (role === "admin") setView("admin-dashboard");
    else if (role === "creator") setView("creator-dashboard");
    else setView("user-dashboard");
  }

  function navigate(v) {
    setView(v);
    window.scrollTo(0, 0);
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setView("landing");
    showToast("Logged out successfully.", "info");
  }

  // ── Loading screen ──
  if (loading) {
    return (
      <>
        <style>{CSS}</style>
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--surface)"
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: 32,
              fontWeight: 700,
              marginBottom: 16
            }}>
              ⚡ Taskivo
            </div>
            <div style={{
              width: 32,
              height: 32,
              border: "3px solid var(--line)",
              borderTopColor: "var(--lime)",
              borderRadius: "50%",
              margin: "0 auto",
              animation: "spin 1s linear infinite"
            }} />
          </div>
        </div>
      </>
    );
  }

  // ── Main app ──
  return (
    <>
      <style>{CSS}</style>
      <div className="app-shell">

        {/* Sidebar — only shown when logged in */}
        {user && (
          <Sidebar
            user={user}
            view={view}
            navigate={navigate}
            logout={logout}
          />
        )}

        <div className="main-content">
          <div className="animate-fadeIn" key={view}>

            {/* ── PUBLIC PAGES ── */}
            {view === "landing" && (
  <Landing
    navigate={navigate}
    setAuthMode={setAuthMode}
  />
)}
            {view === "auth" && (
  <Auth
    authMode={authMode}
    setAuthMode={setAuthMode}
    navigate={navigate}
  />
            )}
            {view === "blog" && (
              <ComingSoon title="Blog — coming soon" />
            )}

            {/* ── EARNER PAGES ── */}
            {view === "user-dashboard" && user && (
  <Dashboard
    user={user}
    navigate={navigate}
    showToast={showToast}
  />
)}
            {view === "tasks" && user && (
              <ComingSoon title="Tasks — File 9" />
            )}
            {view === "task-player" && user && activeTask && (
  <TaskPlayer
    task={activeTask}
    navigate={navigate}
    user={user}
    setUser={setUser}
    showToast={showToast}
  />
)}
            {view === "wallet" && user && (
  <Wallet
    user={user}
    navigate={navigate}
    showToast={showToast}
  />
)}
{view === "withdraw" && user && (
  <Withdraw
    user={user}
    setUser={setUser}
    navigate={navigate}
    showToast={showToast}
  />
)}

            {/* ── CREATOR PAGES ── */}
            {view === "creator-dashboard" && user && (
  <CreatorDashboard user={user} navigate={navigate} showToast={showToast} />
)}
{view === "create-task" && user && (
  <CreateTask user={user} navigate={navigate} showToast={showToast} />
)}
{view === "creator-tasks" && user && (
  <CreatorTasks user={user} navigate={navigate} showToast={showToast} />
)}
{view === "creator-analytics" && user && (
  <CreatorTasks user={user} navigate={navigate} showToast={showToast} />
)}

            {/* ── ADMIN PAGES ── */}
            {view === "admin-dashboard" && user && (
              <ComingSoon title="Admin Dashboard — File 12" />
            )}
            {view === "admin-users" && user && (
              <ComingSoon title="Admin Users — File 12" />
            )}
            {view === "admin-tasks" && user && (
              <ComingSoon title="Admin Tasks — File 12" />
            )}
            {view === "admin-withdrawals" && user && (
              <ComingSoon title="Admin Withdrawals — File 12" />
            )}

          </div>
        </div>
      </div>

      {/* Toast notifications */}
      <Toast toasts={toasts} />
    </>
  );
}
