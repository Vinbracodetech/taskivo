import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";

// ── SHARED STYLES ──────────────────────────────────────────
var S = {
  page: {
    padding: "32px 28px",
    maxWidth: 1100,
    fontFamily: "var(--font-body)",
    background: "#F7F8FA",
    minHeight: "100vh",
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 700,
    color: "#0D0D14",
    marginBottom: 4,
    letterSpacing: "-0.3px",
  },
  pageSub: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 28,
  },
  card: {
    background: "#fff",
    border: "1px solid #EAECF0",
    borderRadius: 14,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  },
  spinner: {
    width: 32,
    height: 32,
    border: "3px solid #EAECF0",
    borderTopColor: "#A8FF3E",
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
  },
};

function Spinner() {
  return (
    <div style={{ minHeight: "50vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={S.spinner} />
    </div>
  );
}

function Badge({ type }) {
  var colors = {
    admin:    { bg: "#FEF2F2", color: "#EF4444", border: "#FECACA" },
    creator:  { bg: "#EFF6FF", color: "#3B82F6", border: "#BFDBFE" },
    earner:   { bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0" },
    active:   { bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0" },
    pending:  { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
    rejected: { bg: "#FEF2F2", color: "#EF4444", border: "#FECACA" },
    approved: { bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0" },
    general:  { bg: "#F5F3FF", color: "#7C3AED", border: "#DDD6FE" },
  };
  var c = colors[type] || colors.general;
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "3px 10px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 600,
      background: c.bg,
      color: c.color,
      border: "1px solid " + c.border,
      textTransform: "capitalize",
      letterSpacing: "0.1px",
    }}>
      {type}
    </span>
  );
}

function FilterBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 16px",
        borderRadius: 8,
        border: active ? "1px solid #0D0D14" : "1px solid #EAECF0",
        background: active ? "#0D0D14" : "#fff",
        color: active ? "#fff" : "#6B7280",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "var(--font-body)",
        transition: "all 0.15s",
        textTransform: "capitalize",
      }}
    >
      {label}
    </button>
  );
}

function ActionBtn({ label, variant, onClick }) {
  var styles = {
    approve: { bg: "#A8FF3E", color: "#0D0D14", border: "transparent" },
    reject:  { bg: "#FEF2F2", color: "#EF4444", border: "#FECACA" },
    ghost:   { bg: "#F7F8FA", color: "#374151", border: "#EAECF0" },
  };
  var s = styles[variant] || styles.ghost;
  return (
    <button
      onClick={onClick}
      style={{
        padding: "5px 14px",
        borderRadius: 7,
        border: "1px solid " + s.border,
        background: s.bg,
        color: s.color,
        fontSize: 12,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "var(--font-body)",
        transition: "opacity 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

// ── TABLE WRAPPER ──────────────────────────────────────────
function Table({ headers, children }) {
  return (
    <div style={{ ...S.card, overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #EAECF0", background: "#FAFAFA" }}>
              {headers.map(function (h) {
                return (
                  <th key={h} style={{
                    padding: "11px 16px",
                    textAlign: "left",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#9CA3AF",
                    textTransform: "uppercase",
                    letterSpacing: "0.6px",
                    whiteSpace: "nowrap",
                    fontFamily: "var(--font-body)",
                  }}>
                    {h}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

function TR({ children }) {
  var [hovered, setHovered] = useState(false);
  return (
    <tr
      onMouseEnter={function () { setHovered(true); }}
      onMouseLeave={function () { setHovered(false); }}
      style={{
        borderBottom: "1px solid #F3F4F6",
        background: hovered ? "#FAFBFF" : "#fff",
        transition: "background 0.12s",
      }}
    >
      {children}
    </tr>
  );
}

function TD({ children, muted, bold, small }) {
  return (
    <td style={{
      padding: "13px 16px",
      fontSize: small ? 12 : 14,
      color: muted ? "#9CA3AF" : bold ? "#0D0D14" : "#374151",
      fontWeight: bold ? 600 : 400,
      fontFamily: "var(--font-body)",
      verticalAlign: "middle",
    }}>
      {children}
    </td>
  );
}

// ── ADMIN OVERVIEW ─────────────────────────────────────────
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

  if (loading) return <Spinner />;

  var statCards = [
    { label: "Total Users",          value: stats.users,       icon: "👥", accent: "#6366F1", nav: "admin-users" },
    { label: "Total Tasks",          value: stats.tasks,       icon: "📋", accent: "#A8FF3E", nav: "admin-tasks" },
    { label: "Completions",          value: stats.completions, icon: "✅", accent: "#22C55E", nav: null },
    { label: "Pending Withdrawals",  value: stats.pending,     icon: "⏳", accent: "#F59E0B", nav: "admin-withdrawals" },
  ];

  var quickLinks = [
    { label: "Manage Users",   desc: "View users, change roles.",               nav: "admin-users",       icon: "👥" },
    { label: "Manage Tasks",   desc: "Approve or reject creator tasks.",         nav: "admin-tasks",       icon: "📋" },
    { label: "Withdrawals",    desc: "Process earner withdrawal requests.",      nav: "admin-withdrawals", icon: "💸" },
    { label: "Browse Tasks",   desc: "See the task feed as an earner would.",   nav: "tasks",             icon: "🎯" },
  ];

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={S.pageTitle}>Admin Panel</div>
        <div style={S.pageSub}>Platform overview and quick actions.</div>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 28 }}>
        {statCards.map(function (s) {
          return (
            <div
              key={s.label}
              onClick={function () { if (s.nav) navigate(s.nav); }}
              style={{
                ...S.card,
                padding: "20px",
                cursor: s.nav ? "pointer" : "default",
                borderLeft: "3px solid " + s.accent,
                transition: "box-shadow 0.18s, transform 0.18s",
              }}
              onMouseEnter={function (e) {
                if (s.nav) {
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={function (e) {
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  {s.label}
                </div>
                <span style={{ fontSize: 18 }}>{s.icon}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#0D0D14", lineHeight: 1, fontFamily: "var(--font-body)" }}>
                {s.value.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick links */}
      <div style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.6px", marginBottom: 12 }}>
        Quick Actions
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
        {quickLinks.map(function (a) {
          return (
            <div
              key={a.label}
              onClick={function () { navigate(a.nav); }}
              style={{
                ...S.card,
                padding: "18px 20px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                cursor: "pointer",
                transition: "box-shadow 0.18s, transform 0.18s, border-color 0.18s",
              }}
              onMouseEnter={function (e) {
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.08)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.borderColor = "#A8FF3E";
              }}
              onMouseLeave={function (e) {
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = "#EAECF0";
              }}
            >
              <div style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                background: "#F7F8FA",
                border: "1px solid #EAECF0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                flexShrink: 0,
              }}>
                {a.icon}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#0D0D14", marginBottom: 2 }}>{a.label}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF" }}>{a.desc}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ height: 40 }} />
    </div>
  );
}

// ── USERS PANEL ────────────────────────────────────────────
function UsersPanel({ showToast }) {
  var [users, setUsers] = useState([]);
  var [loading, setLoading] = useState(true);
  var [search, setSearch] = useState("");

  useEffect(function () {
    async function load() {
      var result = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
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
    var q = search.toLowerCase();
    return (u.email || "").toLowerCase().includes(q) ||
           (u.full_name || "").toLowerCase().includes(q);
  });

  if (loading) return <Spinner />;

  return (
    <div style={S.page}>
      <div style={S.pageTitle}>Users</div>
      <div style={S.pageSub}>Manage all registered users and their roles.</div>

      {/* Search */}
      <input
        style={{
          padding: "9px 14px",
          borderRadius: 9,
          border: "1px solid #EAECF0",
          fontSize: 14,
          fontFamily: "var(--font-body)",
          color: "#0D0D14",
          background: "#fff",
          outline: "none",
          width: "100%",
          maxWidth: 300,
          marginBottom: 20,
          boxSizing: "border-box",
        }}
        placeholder="Search name or email..."
        value={search}
        onChange={function (e) { setSearch(e.target.value); }}
      />

      <Table headers={["User", "Role", "Points", "Country", "Change Role"]}>
        {filtered.map(function (u) {
          return (
            <TR key={u.id}>
              <TD>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#0D0D14" }}>
                  {u.full_name || "—"}
                </div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>{u.email}</div>
              </TD>
              <TD><Badge type={u.role || "earner"} /></TD>
              <TD bold>{(u.points || 0).toLocaleString()} pts</TD>
              <TD muted>{u.country || "—"}</TD>
              <TD>
                <select
                  value={u.role || "earner"}
                  onChange={function (e) { changeRole(u.id, e.target.value); }}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 7,
                    border: "1px solid #EAECF0",
                    fontSize: 13,
                    fontFamily: "var(--font-body)",
                    color: "#374151",
                    background: "#fff",
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  <option value="earner">Earner</option>
                  <option value="creator">Creator</option>
                  <option value="admin">Admin</option>
                </select>
              </TD>
            </TR>
          );
        })}
        {filtered.length === 0 && (
          <tr>
            <td colSpan={5} style={{ padding: "40px 16px", textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>
              No users found.
            </td>
          </tr>
        )}
      </Table>
      <div style={{ height: 40 }} />
    </div>
  );
}

// ── TASKS PANEL ────────────────────────────────────────────
function TasksPanel({ showToast }) {
  var [tasks, setTasks] = useState([]);
  var [loading, setLoading] = useState(true);
  var [filter, setFilter] = useState("all");

  useEffect(function () {
    async function load() {
      var result = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });
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

  var filtered = filter === "all"
    ? tasks
    : tasks.filter(function (t) { return t.status === filter; });

  if (loading) return <Spinner />;

  return (
    <div style={S.page}>
      <div style={S.pageTitle}>Task Management</div>
      <div style={S.pageSub}>Approve or reject tasks submitted by creators.</div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["all", "pending", "active", "rejected"].map(function (f) {
          return (
            <FilterBtn
              key={f}
              label={f}
              active={filter === f}
              onClick={function () { setFilter(f); }}
            />
          );
        })}
      </div>

      <Table headers={["Title", "Reward", "Slots", "Type", "Status", "Actions"]}>
        {filtered.map(function (task) {
          return (
            <TR key={task.id}>
              <TD bold>{task.title}</TD>
              <TD>
                <span style={{
                  background: "rgba(168,255,62,0.1)",
                  color: "#3D7A00",
                  border: "1px solid rgba(168,255,62,0.3)",
                  borderRadius: 6,
                  padding: "3px 9px",
                  fontSize: 13,
                  fontWeight: 600,
                }}>
                  {(task.reward || 0).toLocaleString()} pts
                </span>
              </TD>
              <TD muted>{task.completed_slots || 0}/{task.total_slots || 0}</TD>
              <TD><Badge type={task.type || "general"} /></TD>
              <TD><Badge type={task.status || "pending"} /></TD>
              <TD>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {task.status === "pending" && (
                    <>
                      <ActionBtn label="Approve" variant="approve" onClick={function () { updateStatus(task.id, "active"); }} />
                      <ActionBtn label="Reject" variant="reject" onClick={function () { updateStatus(task.id, "rejected"); }} />
                    </>
                  )}
                  {task.status === "active" && (
                    <ActionBtn label="Disable" variant="reject" onClick={function () { updateStatus(task.id, "rejected"); }} />
                  )}
                  {task.status === "rejected" && (
                    <ActionBtn label="Re-enable" variant="ghost" onClick={function () { updateStatus(task.id, "active"); }} />
                  )}
                </div>
              </TD>
            </TR>
          );
        })}
        {filtered.length === 0 && (
          <tr>
            <td colSpan={6} style={{ padding: "40px 16px", textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>
              No tasks found.
            </td>
          </tr>
        )}
      </Table>
      <div style={{ height: 40 }} />
    </div>
  );
}

// ── WITHDRAWALS PANEL ──────────────────────────────────────
function WithdrawalsPanel({ showToast }) {
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

  var filtered = filter === "all"
    ? withdrawals
    : withdrawals.filter(function (w) { return w.status === filter; });

  if (loading) return <Spinner />;

  return (
    <div style={S.page}>
      <div style={S.pageTitle}>Withdrawals</div>
      <div style={S.pageSub}>Review and process earner withdrawal requests.</div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["all", "pending", "approved", "rejected"].map(function (f) {
          return (
            <FilterBtn
              key={f}
              label={f}
              active={filter === f}
              onClick={function () { setFilter(f); }}
            />
          );
        })}
      </div>

      <Table headers={["User", "Points", "Method", "Account", "Country", "Status", "Actions"]}>
        {filtered.map(function (w) {
          var userName = w.profiles
            ? (w.profiles.full_name || w.profiles.email)
            : "Unknown";
          var date = new Date(w.created_at).toLocaleDateString("en-GB", {
            day: "numeric", month: "short", year: "numeric",
          });
          return (
            <TR key={w.id}>
              <TD>
                <div style={{ fontWeight: 600, fontSize: 14, color: "#0D0D14" }}>{userName}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 1 }}>{date}</div>
              </TD>
              <TD>
                <span style={{
                  background: "rgba(168,255,62,0.1)",
                  color: "#3D7A00",
                  border: "1px solid rgba(168,255,62,0.3)",
                  borderRadius: 6,
                  padding: "3px 9px",
                  fontSize: 13,
                  fontWeight: 600,
                }}>
                  {(w.points || 0).toLocaleString()} pts
                </span>
              </TD>
              <TD>{w.method || "—"}</TD>
              <TD muted small>{w.account_details || "—"}</TD>
              <TD muted>{w.country || "—"}</TD>
              <TD><Badge type={w.status || "pending"} /></TD>
              <TD>
                {w.status === "pending" ? (
                  <div style={{ display: "flex", gap: 6 }}>
                    <ActionBtn label="Approve" variant="approve" onClick={function () { updateStatus(w.id, "approved"); }} />
                    <ActionBtn label="Reject" variant="reject" onClick={function () { updateStatus(w.id, "rejected"); }} />
                  </div>
                ) : (
                  <span style={{ fontSize: 12, color: "#9CA3AF" }}>Processed</span>
                )}
              </TD>
            </TR>
          );
        })}
        {filtered.length === 0 && (
          <tr>
            <td colSpan={7} style={{ padding: "40px 16px", textAlign: "center", color: "#9CA3AF", fontSize: 14 }}>
              No withdrawals found.
            </td>
          </tr>
        )}
      </Table>
      <div style={{ height: 40 }} />
    </div>
  );
}

// ── EXPORTS ────────────────────────────────────────────────
export {
  AdminOverview,
  UsersPanel as AdminUsers,
  TasksPanel as AdminTasks,
  WithdrawalsPanel as AdminWithdrawals,
};
