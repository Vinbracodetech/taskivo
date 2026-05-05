import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";

/* ── OVERVIEW (DASHBOARD) ── */
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
          <div className="stat-label">TOTAL USERS</div>
          <div className="stat-value">{loading ? "..." : stats.users.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">TOTAL TASKS</div>
          <div className="stat-value">{loading ? "..." : stats.tasks.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">COMPLETIONS</div>
          <div className="stat-value">{loading ? "..." : stats.completions.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">PENDING PAYOUTS</div>
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
      </div>
    </div>
  );
}

/* ── USERS MANAGEMENT ── */
export function AdminUsers({ showToast }) {
  var [users, setUsers] = useState([]);
  var [loading, setLoading] = useState(true);

  async function loadUsers() {
    setLoading(true);
    var { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (data) setUsers(data);
    if (error) showToast("Failed to load users", "error");
    setLoading(false);
  }

  useEffect(function () {
    loadUsers();
  }, []);

  async function updateRole(id, newRole) {
    var { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", id);
    if (error) {
      showToast(error.message, "error");
    } else {
      showToast("User role updated to " + newRole, "success");
      loadUsers();
    }
  }

  return (
    <div className="page animate-fadeIn">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Manage Users</h1>
        <p className="dashboard-sub">Change user roles between earner, creator, and admin.</p>
      </div>

      <div style={{ background: "var(--surface-card)", border: "1px solid var(--line)", borderRadius: 4, overflowX: "auto", padding: 24 }}>
        {loading ? <p style={{ color: "var(--slate)" }}>Loading users...</p> : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", paddingBottom: 16, color: "var(--slate)", borderBottom: "1px solid var(--line)" }}>Email</th>
                <th style={{ textAlign: "left", paddingBottom: 16, color: "var(--slate)", borderBottom: "1px solid var(--line)" }}>Points</th>
                <th style={{ textAlign: "left", paddingBottom: 16, color: "var(--slate)", borderBottom: "1px solid var(--line)" }}>Role</th>
                <th style={{ textAlign: "right", paddingBottom: 16, color: "var(--slate)", borderBottom: "1px solid var(--line)" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map(function (u) {
                return (
                  <tr key={u.id}>
                    <td style={{ padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{u.email}</td>
                    <td style={{ padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "var(--lime)" }}>{u.points ? u.points.toLocaleString() : 0}</td>
                    <td style={{ padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <span style={{ color: u.role === "admin" ? "var(--gold)" : "var(--slate)", textTransform: "uppercase", fontSize: 12, fontWeight: 700 }}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", textAlign: "right" }}>
                      <select 
                        style={{ background: "#050812", color: "#fff", border: "1px solid var(--line)", padding: "6px", borderRadius: 4, marginRight: 8 }}
                        value={u.role}
                        onChange={function(e) { updateRole(u.id, e.target.value); }}
                      >
                        <option value="earner">Earner</option>
                        <option value="creator">Creator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ── TASKS MANAGEMENT ── */
export function AdminTasks({ showToast }) {
  var [tasks, setTasks] = useState([]);
  var [loading, setLoading] = useState(true);

  async function loadTasks() {
    setLoading(true);
    var { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });
    if (data) setTasks(data);
    if (error) showToast("Failed to load tasks", "error");
    setLoading(false);
  }

  useEffect(function () {
    loadTasks();
  }, []);

  async function setTaskStatus(id, newStatus) {
    var { error } = await supabase.from("tasks").update({ status: newStatus }).eq("id", id);
    if (error) {
      showToast(error.message, "error");
    } else {
      showToast("Task marked as " + newStatus, "success");
      loadTasks();
    }
  }

  return (
    <div className="page animate-fadeIn">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Manage Tasks</h1>
        <p className="dashboard-sub">Approve pending tasks to make them live for earners.</p>
      </div>

      <div style={{ background: "var(--surface-card)", border: "1px solid var(--line)", borderRadius: 4, overflowX: "auto", padding: 24 }}>
        {loading ? <p style={{ color: "var(--slate)" }}>Loading tasks...</p> : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", paddingBottom: 16, color: "var(--slate)", borderBottom: "1px solid var(--line)" }}>Title</th>
                <th style={{ textAlign: "left", paddingBottom: 16, color: "var(--slate)", borderBottom: "1px solid var(--line)" }}>Reward</th>
                <th style={{ textAlign: "left", paddingBottom: 16, color: "var(--slate)", borderBottom: "1px solid var(--line)" }}>Status</th>
                <th style={{ textAlign: "right", paddingBottom: 16, color: "var(--slate)", borderBottom: "1px solid var(--line)" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(function (t) {
                return (
                  <tr key={t.id}>
                    <td style={{ padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {t.title}
                    </td>
                    <td style={{ padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      {t.reward_points ? t.reward_points.toLocaleString() : 0} pts
                    </td>
                    <td style={{ padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <span style={{ color: t.status === 'active' ? 'var(--lime)' : 'var(--gold)', textTransform: "uppercase", fontSize: 11, fontWeight: 700 }}>
                        {t.status}
                      </span>
                    </td>
                    <td style={{ padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        {t.status !== 'active' && (
                          <button className="btn btn-primary btn-sm" onClick={function() { setTaskStatus(t.id, 'active'); }}>Approve</button>
                        )}
                        {t.status !== 'rejected' && (
                          <button className="btn btn-outline btn-sm" style={{ color: "var(--slate)", borderColor: "var(--slate)" }} onClick={function() { setTaskStatus(t.id, 'rejected'); }}>Reject</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ── WITHDRAWALS MANAGEMENT ── */
export function AdminWithdrawals({ showToast }) {
  var [withdrawals, setWithdrawals] = useState([]);
  var [loading, setLoading] = useState(true);

  async function loadWithdrawals() {
    setLoading(true);
    var { data, error } = await supabase.from("withdrawals").select("*").order("created_at", { ascending: false });
    if (data) setWithdrawals(data);
    if (error) showToast("Failed to load withdrawals", "error");
    setLoading(false);
  }

  useEffect(function () {
    loadWithdrawals();
  }, []);

  async function setPayoutStatus(id, newStatus) {
    var { error } = await supabase.from("withdrawals").update({ status: newStatus }).eq("id", id);
    if (error) {
      showToast(error.message, "error");
    } else {
      showToast("Withdrawal marked as " + newStatus, "success");
      loadWithdrawals();
    }
  }

  return (
    <div className="page animate-fadeIn">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Withdrawals</h1>
        <p className="dashboard-sub">Process earner payout requests.</p>
      </div>

      <div style={{ background: "var(--surface-card)", border: "1px solid var(--line)", borderRadius: 4, overflowX: "auto", padding: 24 }}>
        {loading ? <p style={{ color: "var(--slate)" }}>Loading requests...</p> : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", paddingBottom: 16, color: "var(--slate)", borderBottom: "1px solid var(--line)" }}>User ID</th>
                <th style={{ textAlign: "left", paddingBottom: 16, color: "var(--slate)", borderBottom: "1px solid var(--line)" }}>Value</th>
                <th style={{ textAlign: "left", paddingBottom: 16, color: "var(--slate)", borderBottom: "1px solid var(--line)" }}>Status</th>
                <th style={{ textAlign: "right", paddingBottom: 16, color: "var(--slate)", borderBottom: "1px solid var(--line)" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map(function (w) {
                return (
                  <tr key={w.id}>
                    <td style={{ padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 12, color: "var(--slate)" }}>
                      {w.user_id.substring(0, 8)}...
                    </td>
                    <td style={{ padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", color: "var(--lime)", fontWeight: 600 }}>
                      ${w.estimated_value ? w.estimated_value.toLocaleString() : 0}
                    </td>
                    <td style={{ padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <span style={{ color: w.status === 'completed' ? 'var(--lime)' : 'var(--gold)', textTransform: "uppercase", fontSize: 11, fontWeight: 700 }}>
                        {w.status || 'pending'}
                      </span>
                    </td>
                    <td style={{ padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        {w.status !== 'completed' && (
                          <button className="btn btn-primary btn-sm" onClick={function() { setPayoutStatus(w.id, 'completed'); }}>Mark Paid</button>
                        )}
                        {w.status !== 'rejected' && (
                          <button className="btn btn-outline btn-sm" style={{ color: "var(--slate)", borderColor: "var(--slate)" }} onClick={function() { setPayoutStatus(w.id, 'rejected'); }}>Reject</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
