import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";

export default function Dashboard({ user, navigate, showToast }) {

  var [profile, setProfile] = useState(user);
  var [tasks, setTasks] = useState([]);
  var [completions, setCompletions] = useState([]);
  var [loading, setLoading] = useState(true);

  useEffect(function () {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    // Load latest profile (fresh points balance)
    var profileResult = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileResult.data) {
      setProfile(profileResult.data);
    }

    // Load recent completions for this user
    var completionsResult = await supabase
      .from("completions")
      .select("*, tasks(title, reward)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (completionsResult.data) {
      setCompletions(completionsResult.data);
    }

    // Load available tasks (active only)
    var tasksResult = await supabase
      .from("tasks")
      .select("*")
      .eq("status", "active")
      .limit(4);

    if (tasksResult.data) {
      setTasks(tasksResult.data);
    }

    setLoading(false);
  }

  var points = profile ? (profile.points || 0) : 0;
  var cashValue = (points / 1000 * 1.2).toFixed(2);
  var tasksCompleted = completions.length;

  if (loading) {
    return (
      <div className="page" style={{ textAlign: "center", paddingTop: 80 }}>
        <div style={{
          width: 32,
          height: 32,
          border: "3px solid var(--line)",
          borderTopColor: "var(--lime)",
          borderRadius: "50%",
          margin: "0 auto",
          animation: "spin 1s linear infinite",
        }} />
        <div style={{ marginTop: 16, color: "var(--slate)", fontSize: 14 }}>
          Loading your dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="page animate-slideUp">

      {/* ── PAGE HEADER ── */}
      <div style={{ marginBottom: 28 }}>
        <div className="page-title">
          Welcome back, {profile ? (profile.full_name || "Earner") : "Earner"} 👋
        </div>
        <div className="page-subtitle">
          Here's your earnings overview and available tasks.
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div className="stat-grid">

        <div className="stat-card">
          <div className="stat-label">Points Balance</div>
          <div className="stat-value" style={{ color: "var(--lime-dark)" }}>
            {points.toLocaleString()}
          </div>
          <div className="stat-sub">≈ ${cashValue} USD</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Tasks Completed</div>
          <div className="stat-value">{tasksCompleted}</div>
          <div className="stat-sub">All time</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Available Tasks</div>
          <div className="stat-value">{tasks.length}</div>
          <div className="stat-sub">Ready to start</div>
        </div>

        <div className="stat-card">
          <div className="stat-label">Your Region</div>
          <div className="stat-value" style={{ fontSize: 20 }}>
            {profile ? (profile.country || "🌍 Global") : "🌍 Global"}
          </div>
          <div className="stat-sub">Point rate applied</div>
        </div>

      </div>

      {/* ── WALLET CARD ── */}
      <div className="wallet-hero" style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div className="wallet-balance-label">Total Points Balance</div>
            <div className="wallet-balance">{points.toLocaleString()}</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,.5)", marginTop: 4 }}>
              ≈ ${cashValue} USD at current rate
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              className="btn btn-primary"
              onClick={function () { navigate("tasks"); }}
            >
              Browse Tasks →
            </button>
            <button
              className="btn btn-outline"
              style={{ color: "var(--white)", borderColor: "rgba(255,255,255,.3)" }}
              onClick={function () { navigate("withdraw"); }}
            >
              Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* ── AVAILABLE TASKS ── */}
      <div className="section-header" style={{ marginBottom: 16 }}>
        <div className="section-heading">Available Tasks</div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={function () { navigate("tasks"); }}
        >
          See All →
        </button>
      </div>

      {tasks.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "40px 20px", marginBottom: 28 }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>No tasks available right now</div>
          <div style={{ fontSize: 13, color: "var(--slate)" }}>
            Check back soon — creators post new tasks daily.
          </div>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
          marginBottom: 32,
        }}>
          {tasks.map(function (task) {
            var filled = task.completed_slots || 0;
            var total = task.total_slots || 1;
            var pct = Math.round((filled / total) * 100);
            return (
              <div className="task-card" key={task.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div className="task-card-title">{task.title}</div>
                  <span className="badge badge-lime">{task.category || "Task"}</span>
                </div>
                <div className="task-card-body">
                  {task.description
                    ? task.description.slice(0, 80) + "..."
                    : "Complete this task to earn points."}
                </div>
                <div className="task-card-meta">
                  <span>⏱ {task.required_time || 60}s watch</span>
                  <span>👥 {total - filled} slots left</span>
                </div>
                <div className="progress" style={{ marginBottom: 14 }}>
                  <div className="progress-bar" style={{ width: pct + "%" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div className="reward-value">{task.reward || 0}</div>
                    <div className="reward-label">points</div>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={function () { navigate("tasks"); }}
                  >
                    Start Task →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── RECENT ACTIVITY ── */}
      <div className="section-header" style={{ marginBottom: 16 }}>
        <div className="section-heading">Recent Activity</div>
        <button
          className="btn btn-ghost btn-sm"
          onClick={function () { navigate("wallet"); }}
        >
          View All →
        </button>
      </div>

      {completions.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🎯</div>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>No activity yet</div>
          <div style={{ fontSize: 13, color: "var(--slate)", marginBottom: 16 }}>
            Complete your first task to start earning points.
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={function () { navigate("tasks"); }}
          >
            Browse Tasks →
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {completions.map(function (c) {
            var reward = c.tasks ? c.tasks.reward : 0;
            var title = c.tasks ? c.tasks.title : "Task Completed";
            var date = new Date(c.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            return (
              <div className="tx-item" key={c.id}>
                <div className="tx-icon earn">✓</div>
                <div style={{ flex: 1 }}>
                  <div className="tx-title">{title}</div>
                  <div className="tx-date">{date}</div>
                </div>
                <div className="tx-amount positive">+{reward} pts</div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
        }
