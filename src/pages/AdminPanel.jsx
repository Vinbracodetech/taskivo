import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";

export function AdminOverview({ navigate, showToast }) {
  var [stats, setStats] = useState({ users: 0, tasks: 0, completions: 0, withdrawals: 0 });
  var [loading, setLoading] = useState(true);

  useEffect(function () {
    async function fetchStats() {
      var u = await supabase.from("profiles").select("*", { count: "exact", head: true });
      var t = await supabase.from("tasks").select("*", { count: "exact", head: true });
      var c = await supabase.from("completions").select("*", { count: "exact", head: true });
      var w = await supabase.from("withdrawals").select("*", { count: "exact", head: true }).eq("status", "pending");

      setStats({
        users: u.count || 0,
        tasks: t.count || 0,
        completions: c.count || 0,
        withdrawals: w.count || 0
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  return (
    <div className="page animate-fadeIn">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Panel</h1>
        <p className="dashboard-sub">Platform overview and quick actions.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "48px" }}>
        <div className="stat-card">
          <div className="stat-label">TOTAL USERS <span style={{ opacity: 0.5, fontSize: 16 }}>👥</span></div>
          <div className="stat-value">{loading ? "..." : stats.users.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">TOTAL TASKS <span style={{ opacity: 0.5, fontSize: 16 }}>📋</span></div>
          <div className="stat-value">{loading ? "..." : stats.tasks.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">COMPLETIONS <span style={{ opacity: 0.5, fontSize: 16 }}>✅</span></div>
          <div className="stat-value">{loading ? "..." : stats.completions.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">PENDING WITHDRAWALS <span style={{ opacity: 0.5, fontSize: 16 }}>⏳</span></div>
          <div className="stat-value">{loading ? "..." : stats.withdrawals.toLocaleString()}</div>
        </div>
      </div>

      <div className="dashboard-header" style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 12, fontWeight: 700, color: "var(--slate)", letterSpacing: "1.5px", textTransform: "uppercase" }}>Quick Actions</h2>
      </div>

      <div className="action-grid">
        <div className="action-card" onClick={function () { navigate("admin-users"); }}>
          <div className="action-icon">👥</div>
          <div className="action-text">
            <h4>Manage Users</h4>
            <p>View registered accounts and manage roles.</p>
          </div>
        </div>
        <div className="action-card" onClick={function () { navigate("admin-tasks"); }}>
          <div className="action-icon">📋</div>
          <div className="action-text">
            <h4>Manage Tasks</h4>
            <p>Approve or reject pending creator tasks.</p>
          </div>
        </div>
        <div className="action-card" onClick={function () { navigate("admin-withdrawals"); }}>
          <div className="action-icon">💸</div>
          <div className="action-text">
            <h4>Withdrawals</h4>
            <p>Review and process earner payout requests.</p>
          </div>
        </div>
        <div className="action-card" onClick={function () { navigate("tasks"); }}>
          <div className="action-icon">🎯</div>
          <div className="action-text">
            <h4>Browse Tasks</h4>
            <p>View the live task feed exactly as an earner would.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stubs for the sub-pages connected to the buttons
export function AdminUsers({ showToast }) {
  return (
    <div className="page">
      <h1 className="dashboard-title">Manage Users</h1>
      <p className="dashboard-sub">User management interface coming soon.</p>
    </div>
  );
}

export function AdminTasks({ showToast }) {
  return (
    <div className="page">
      <h1 className="dashboard-title">Manage Tasks</h1>
      <p className="dashboard-sub">Task approval interface coming soon.</p>
    </div>
  );
}

export function AdminWithdrawals({ showToast }) {
  return (
    <div className="page">
      <h1 className="dashboard-title">Withdrawals</h1>
      <p className="dashboard-sub">Withdrawal processing interface coming soon.</p>
    </div>
  );
}
