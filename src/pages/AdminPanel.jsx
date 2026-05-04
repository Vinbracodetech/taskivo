import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";

// ── ADMIN DASHBOARD ────────────────────────────────
function AdminOverview({ navigate }) {
  var [stats, setStats] = useState({ users: 0, tasks: 0, completions: 0, pending: 0 });
  var [loading, setLoading] = useState(true);

  useEffect(function () {
    async function load() {
      var [u, t, c, w] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("tasks").select("id", { count: "exact", head: true }),
        supabase.from("completions").select("id", { count: "exact", head: true }),
        supabase.from("withdrawals").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      setStats({
        users: u.count || 0,
        tasks: t.count || 0,
        completions: c.count || 0,
        pending: w.count || 0,
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 36, height: 36, border: "3px solid #E5E7EB", borderTopColor: "#A8FF3E", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ padding: "36px 32px", maxWidth: 1100, fontFamily: "var(--font-body)" }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 700, color: "#0A0A0F", marginBottom: 6, letterSpacing: "-0.5px" }}>
        Admin Overview
      </div>
      <div style={{ fontSize: 15, color: "#6B7280", marginBottom: 32 }}>Platform-wide stats and management.</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 36 }}>
        {[
          { label: "Total Users", value: stats.users, icon: "👥", bg: "rgba(99,102,241,0.1)", nav: "admin-users" },
          { label: "Total Tasks", value: stats.tasks, icon: "📋", bg: "rgba(168,255,62,0.12)", nav: "admin-tasks" },
          { label: "Completions", value: stats.completions, icon: "✅", bg: "rgba(34,197,94,0.1)", nav: null },
          { label: "Pending Withdrawals", value: stats.pending, icon: "⏳", bg: "rgba(245,158,11,0.1)", nav: "admin-withdrawals" },
        ].map(function (s) {
          return (
            <div key={s.label}
              onClick={function () { if (s.nav) navigate(s.nav); }}
              onMouseEnter={function (e) {
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(245,158,11,0.15), 0 0 0 1.5px rgba(245,158,11,0.2)";
                e.currentTarget.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={function (e) {
                e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
              style={{
                background: "#fff", border: "1px solid #E5E7EB",
                borderRadius: 18, padding: "22px 20px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                transition: "all 0.22s ease",
                cursor: s.nav ? "pointer" : "default",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9CA3AF" }}>{s.label}</div>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>{s.icon}</div>
              </div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: 36, fontWeight: 800, color: "#0A0A0F", lineHeight: 1 }}>{s.value}</div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[
          { label: "Manage Users", desc: "View all users, change roles, suspend accounts.", nav: "admin-users", icon: "👥" },
          { label: "Manage Tasks", desc: "Approve or reject tasks posted by creators.", nav: "admin-tasks", icon: "📋" },
          { label: "Withdrawals", desc: "Approve or reject earner withdrawal requests.", nav: "admin-withdrawals", icon: "💸" },
          { label: "Browse Tasks", desc: "See the live task feed as an earner would.", nav: "tasks", icon: "🎯" },
        ].map(function (a) {
          return (
            <div key={a.label}
              onClick={function () { navigate(a.nav); }}
              onMouseEnter={function (e) {
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.09)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.borderColor = "rgba(168,255,62,0.4)";
              }}
              onMouseLeave={function (e) {
                e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#E5E7EB";
              }}
              style={{
                background: "#fff", border: "1px solid #E5E7EB",
                borderRadius: 16, padding: "22px 20px",
                cursor: "pointer", transition: "all 0.2s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                display: "flex", alignItems: "center", gap: 16,
              }}
            >
              <div style={{ width: 46, height: 46, borderRadius: 12, background: "rgba(168,255,62,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{a.icon}</div>
              <div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15, color: "#0A0A0F", marginBottom: 4 }}>{a.label}</div>
                <div style={{ fontSize: 13, color: "#9CA3AF", lineHeight: 1.4 }}>{a.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ height: 48 }} />
    </div>
  );
}

// ── ADMIN USERS ────────────────────────────────
function AdminUsers({ showToast }) {
  var [users, setUsers] = useState([]);
  var [loading, setLoading] = useState(true);
  var [search, setSearch] = useState("");

  useEffect(function () {
    async function load() {
      var result = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (result.data) setUsers(result.data);
      setLoading(false);
    }
    load();
  }, []);

  async function changeRole(id, role) {
    await supabase.from("profiles").update({ role: role }).eq("id", id);
    setUsers(function (prev) {
      return prev.map(function (u) { return u.id === id ? { ...u, role: role } : u; });
    });
    showToast("Role updated to " + role + ".", "success");
  }

  var filtered = users.filter(function (u) {
    return (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.full_name || "").toLowerCase().includes(search.toLowerCase());
  });

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 36, height: 36, border: "3px solid #E5E7EB", borderTopColor: "#A8FF3E", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ padding: "36px 32px", maxWidth: 1100, fontFamily: "var(--font-body)" }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "#0A0A0F", marginBottom: 6, letterSpacing: "-0.5px" }}>Users</div>
      <div style={{ fontSize: 15, color: "#6B7280", marginBottom: 24 }}>Manage all registered users and their roles.</div>
      <input className="form-input" style={{ maxWidth: 320, marginBottom: 20 }} placeholder="Search by name or email..." value={search} onChange={function (e) { setSearch(e.target.value); }} />
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Points</th><th>Country</th><th>Change Role</th></tr>
            </thead>
            <tbody>
              {filtered.map(function (u) {
                return (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600 }}>{u.full_name || "—"}</td>
                    <td style={{ color: "#6B7280" }}>{u.email}</td>
                    <td>
                      <span className={"badge " + (u.role === "admin" ? "badge-red" : u.role === "creator" ? "badge-blue" : "badge-green")}>
                        {u.role || "earner"}
                      </span>
                    </td>
                    <td style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}>{(u.points || 0).toLocaleString()}</td>
                    <td style={{ color: "#9CA3AF" }}>{u.country || "—"}</td>
                    <td>
                      <select
                        className="form-select"
                        style={{ padding: "4px 8px", fontSize: 12, width: "auto" }}
                        value={u.role || "earner"}
                        onChange={function (e) { changeRole(u.id, e.target.value); }}
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
        </div>
      </div>
      <div style={{ height: 48 }} />
    </div>
  );
}

// ── ADMIN TASKS ────────────────────────────────
function AdminTasks({ showToast }) {
  var [tasks, setTasks] = useState([]);
  var [loading, setLoading] = useState(true);
  var [filter, setFilter] = useState("all");

  useEffect(function () {
    async function load() {
      var result = await supabase.from("tasks").select("*").order("created_at", { ascending: false });
      if (result.data) setTasks(result.data);
      setLoading(false);
    }
    load();
  }, []);

  async function updateStatus(id, status) {
    await supabase.from("tasks").update({ status: status }).eq("id", id);
    setTasks(function (prev) {
      return prev.map(function (t) { return t.id === id ? { ...t, status: status } : t; });
    });
    showToast("Task " + status + ".", status === "active" ? "success" : "error");
  }

  var filtered = filter === "all" ? tasks : tasks.filter(function (t) { return t.status === filter; });

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 36, height: 36, border: "3px solid #E5E7EB", borderTopColor: "#A8FF3E", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ padding: "36px 32px", maxWidth: 1100, fontFamily: "var(--font-body)" }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "#0A0A0F", marginBottom: 6, letterSpacing: "-0.5px" }}>Task Management</div>
      <div style={{ fontSize: 15, color: "#6B7280", marginBottom: 24 }}>Approve or reject tasks submitted by creators.</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["all", "pending", "active", "rejected"].map(function (f) {
          return (
            <button key={f} className={"btn btn-sm " + (filter === f ? "btn-dark" : "btn-outline")} onClick={function () { setFilter(f); }} style={{ textTransform: "capitalize" }}>
              {f}
            </button>
          );
        })}
      </div>
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Title</th><th>Reward</th><th>Slots</th><th>Type</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(function (task) {
                return (
                  <tr key={task.id}>
                    <td style={{ fontWeight: 600, maxWidth: 220 }}>{task.title}</td>
                    <td style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}>{task.reward} pts</td>
                    <td>{task.completed_slots || 0}/{task.total_slots || 0}</td>
                    <td><span className="badge badge-gray" style={{ textTransform: "capitalize" }}>{task.type || "general"}</span></td>
                    <td>
                      <span className={"badge " + (task.status === "active" ? "badge-green" : task.status === "pending" ? "badge-yellow" : "badge-red")}>
                        {task.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 6 }}>
                        {task.status === "pending" && (
                          <>
                            <button className="btn btn-primary btn-sm" onClick={function () { updateStatus(task.id, "active"); }}>Approve</button>
                            <button className="btn btn-ghost btn-sm" style={{ color: "var(--red)" }} onClick={function () { updateStatus(task.id, "rejected"); }}>Reject</button>
                          </>
                        )}
                        {task.status === "active" && (
                          <button className="btn btn-ghost btn-sm" style={{ color: "var(--red)" }} onClick={function () { updateStatus(task.id, "rejected"); }}>Disable</button>
                        )}
                        {task.status === "rejected" && (
                          <button className="btn btn-ghost btn-sm" onClick={function () { updateStatus(task.id, "active"); }}>Re-enable</button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ height: 48 }} />
    </div>
  );
}

// ── ADMIN WITHDRAWALS ────────────────────────────────
function AdminWithdrawals({ showToast }) {
  var [withdrawals, setWithdrawals] = useState([]);
  var [loading, setLoading] = useState(true);
  var [filter, setFilter] = useState("all");

  useEffect(function () {
    async function load() {
      var result = await supabase
        .from("withdrawals")
        .select("*, profiles(full_name, email)")
        .order("created_at", { ascending: false });
      if (result.data) setWithdrawals(result.data);
      setLoading(false);
    }
    load();
  }, []);

  async function updateStatus(id, status) {
    await supabase.from("withdrawals").update({ status: status }).eq("id", id);
    setWithdrawals(function (prev) {
      return prev.map(function (w) { return w.id === id ? { ...w, status: status } : w; });
    });
    showToast("Withdrawal " + status + ".", status === "approved" ? "success" : "error");
  }

  var filtered = filter === "all" ? withdrawals : withdrawals.filter(function (w) { return w.status === filter; });

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 36, height: 36, border: "3px solid #E5E7EB", borderTopColor: "#A8FF3E", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ padding: "36px 32px", maxWidth: 1100, fontFamily: "var(--font-body)" }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "#0A0A0F", marginBottom: 6, letterSpacing: "-0.5px" }}>Withdrawals</div>
      <div style={{ fontSize: 15, color: "#6B7280", marginBottom: 24 }}>Review and process earner withdrawal requests.</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["all", "pending", "approved", "rejected"].map(function (f) {
          return (
            <button key={f} className={"btn btn-sm " + (filter === f ? "btn-dark" : "btn-outline")} onClick={function () { setFilter(f); }} style={{ textTransform: "capitalize" }}>
              {f}
            </button>
          );
        })}
      </div>
      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>User</th><th>Points</th><th>Method</th><th>Account</th><th>Country</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(function (w) {
                var userName = w.profiles ? (w.profiles.full_name || w.profiles.email) : "Unknown";
                var date = new Date(w.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
                return (
                  <tr key={w.id}>
                    <td style={{ fontWeight: 600 }}>
                      <div>{userName}</div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>{date}</div>
                    </td>
                    <td style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}>
                      {(w.points || 0).toLocaleString()} pts
                    </td>
                    <td>{w.method || "—"}</td>
                    <td style={{ fontSize: 12, color: "#6B7280", maxWidth: 160 }}>
                      {w.account_details || "—"}
                    </td>
                    <td style={{ color: "#9CA3AF" }}>{w.country || "—"}</td>
                    <td>
                      <span className={"badge " + (w.status === "approved" ? "badge-green" : w.status === "pending" ? "badge-yellow" : "badge-red")}>
                        {w.status}
                      </span>
                    </td>
                    <td>
                      {w.status === "pending" ? (
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn btn-primary btn-sm" onClick={function () { updateStatus(w.id, "approved"); }}>Approve</button>
                          <button className="btn btn-ghost btn-sm" style={{ color: "var(--red)" }} onClick={function () { updateStatus(w.id, "rejected"); }}>Reject</button>
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: "#9CA3AF" }}>Processed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div style={{ height: 48 }} />
    </div>
  );
}

// ── EXPORT BASED ON VIEW ────────────────────────────────
export function AdminDashboard({ navigate, showToast }) {
  return <AdminOverview navigate={navigate} showToast={showToast} />;
}
export function AdminUsers({ showToast }) {
  return <AdminUsers showToast={showToast} />;
}
export function AdminTasksPage({ showToast }) {
  return <AdminTasks showToast={showToast} />;
}
export function AdminWithdrawalsPage({ showToast }) {
  return <AdminWithdrawals showToast={showToast} />;
}
