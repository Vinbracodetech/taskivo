import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase.js";
import CSS from "./styles/global.js";
import Sidebar from "./components/Sidebar.jsx";
import Toast from "./components/Toast.jsx";
import useToast from "./components/useToast.js";
import Landing from "./Landing";

import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Tasks from "./pages/Tasks.jsx";
import TaskPlayer from "./pages/TaskPlayer.jsx";
import Wallet from "./pages/Wallet.jsx";
import Withdraw from "./pages/Withdraw.jsx";
import CreatorDashboard from "./pages/CreatorDashboard.jsx";
import CreateTask from "./pages/CreateTask.jsx";
import CreatorTasks from "./pages/CreatorTasks.jsx";
import {
  AdminOverview,
  AdminUsers as AdminUsersComp,
  AdminTasks as AdminTasksComp,
  AdminWithdrawals as AdminWithdrawalsComp,
} from "./pages/AdminPanel.jsx";

function ComingSoon({ title }) {
  return (
    <div className="page">
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <div style={{ fontSize: 48 }}>🔧</div>
        <div style={{ fontSize: 24, fontWeight: 700, marginTop: 12 }}>
          {title}
        </div>
        <div style={{ fontSize: 14, opacity: 0.6 }}>
          This page is being built.
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

  useEffect(function () {
    supabase.auth.getSession().then(function (result) {
      var session = result.data.session;
      if (session) loadProfile(session.user);
      else setLoading(false);
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
      var newProfile = {
        id: authUser.id,
        email: authUser.email,
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

  function navigate(v, params) {
    if (params && params.taskId) {
      setActiveTask({ id: params.taskId });
    }
    setView(v);
    window.history.pushState({}, "", "#" + v);
  }

  async function logout() {
    await supabase.auth.signOut();
    setUser(null);
    setView("landing");
  }

  if (loading) {
    return (
      <>
        <style>{CSS}</style>
        <div style={{ padding: 40 }}>Loading...</div>
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

        <div className="main-content">
          {view === "landing" && (
            <Landing navigate={navigate} setAuthMode={setAuthMode} />
          )}

          {view === "auth" && (
            <Auth
              authMode={authMode}
              setAuthMode={setAuthMode}
              navigate={navigate}
              loadProfile={loadProfile}
            />
          )}

          {view === "blog" && <ComingSoon title="Blog coming soon" />}

          {view === "user-dashboard" && user && (
            <Dashboard user={user} navigate={navigate} showToast={showToast} />
          )}

          {view === "tasks" && user && (
            <Tasks user={user} navigate={navigate} showToast={showToast} />
          )}

          {view === "task-player" && user && activeTask && (
            <TaskPlayer
              task={activeTask}
              user={user}
              navigate={navigate}
              setUser={setUser}
              showToast={showToast}
            />
          )}

          {view === "wallet" && user && (
            <Wallet user={user} navigate={navigate} showToast={showToast} />
          )}

          {view === "withdraw" && user && (
            <Withdraw user={user} setUser={setUser} navigate={navigate} showToast={showToast} />
          )}

          {view === "creator-dashboard" && user && (
            <CreatorDashboard user={user} navigate={navigate} showToast={showToast} />
          )}

          {view === "create-task" && user && (
            <CreateTask user={user} navigate={navigate} showToast={showToast} />
          )}

          {view === "creator-tasks" && user && (
            <CreatorTasks user={user} navigate={navigate} showToast={showToast} />
          )}

          {view === "admin-dashboard" && user && (
            <AdminOverview navigate={navigate} showToast={showToast} />
          )}

          {view === "admin-users" && user && (
            <AdminUsersComp showToast={showToast} />
          )}

          {view === "admin-tasks" && user && (
            <AdminTasksComp showToast={showToast} />
          )}

          {view === "admin-withdrawals" && user && (
            <AdminWithdrawalsComp showToast={showToast} />
          )}
        </div>
      </div>

      <Toast toasts={toasts} />
    </>
  );
}
