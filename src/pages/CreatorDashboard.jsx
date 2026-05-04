import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";

export default function CreatorDashboard({ user, navigate, showToast }) {

  var [tasks, setTasks] = useState([]);
  var [totalCompletions, setTotalCompletions] = useState(0);
  var [loading, setLoading] = useState(true);

  useEffect(function () { loadData(); }, []);

  async function loadData() {
    setLoading(true);

    var tasksResult = await supabase
      .from("tasks")
      .select("*")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false });

    var myTasks = tasksResult.data || [];
    setTasks(myTasks);

    var completions = myTasks.reduce(function (sum, t) {
      return sum + (t.completed_slots || 0);
    }, 0);
    setTotalCompletions(completions);
    setLoading(false);
  }

  var activeTasks = tasks.filter(function (t) { return t.status === "active"; }).length;
  var pendingTasks = tasks.filter(function (t) { return t.status === "pending"; }).length;
  var totalPtsGiven = tasks.reduce(function (sum, t) {
    return sum + ((t.completed_slots || 0) * (t.reward || 0));
  }, 0);

  var name = user ? (user.full_name || user.email || "Creator") : "Creator";

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 36, height: 36, border: "3px solid #E5E7EB", borderTopColor: "#A8FF3E", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ padding: "36px 32px", maxWidth: 1100, fontFamily: "var(--font-body)" }}>

      {/* HEADER */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 700, color: "#0A0A0F", marginBottom: 6, letterSpacing: "-0.5px" }}>
          Creator Hub 👋
        </div>
        <div style={{ fontSize: 15, color: "#6B7280" }}>
          Welcome back, {name.split(" ")[0]}. Here's your campaign overview.
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
        <button className="btn btn-primary btn-lg" onClick={function () { navigate("create-task"); }}>
          + Post New Task
        </button>
        <button className="btn btn-outline btn-lg" onClick={function () { navigate("creator-tasks"); }}>
          View My Tasks
        </button>
        <button className="btn btn-outline btn-lg" onClick={function () { navigate("creator-analytics"); }}>
          Analytics →
        </button>
      </div>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 36 }}>
        {[
          { label: "Active Tasks", value: activeTasks, icon: "✅", bg: "rgba(34,197,94,0.1)" },
          { label: "Pending Approval", value: pendingTasks, icon: "⏳", bg: "rgba(245,158,11,0.1)" },
          { label: "Total Completions", value: totalCompletions, icon: "🎯", bg: "rgba(168,255,62,0.12)" },
          { label: "Points Distributed", value: totalPtsGiven.toLocaleString(), icon: "💰", bg: "rgba(99,102,241,0.1)" },
        ].map(function (s) {
          return (
            <div key={s.label}
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
                transition: "all 0.22s ease", cursor: "default",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9CA3AF" }}>
                  {s.label}
                </div>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>
                  {s.icon}
                </div>
              </div>
              <div style={{ fontFamily: "var(--font-heading)", fontSize: 32, fontWeight: 800, color: "#0A0A0F", lineHeight: 1, marginBottom: 4 }}>
                {s.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* RECENT TASKS */}
      <div style={{ fontFamily: "var(--font-heading)", fontSize: 18, fontWeight: 700, color: "#0A0A0F", marginBottom: 16 }}>
        Recent Tasks
      </div>

      {tasks.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "48px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>No tasks yet</div>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>Post your first task to start getting feedback.</div>
          <button className="btn btn-primary" onClick={function () { navigate("create-task"); }}>+ Post New Task</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {tasks.slice(0, 5).map(function (task) {
            var filled = task.completed_slots || 0;
            var total = task.total_slots || 1;
            var pct = Math.round((filled / total) * 100);
            return (
              <div key={task.id} style={{
                background: "#fff", border: "1px solid #E5E7EB",
                borderRadius: 14, padding: "18px 20px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-heading)", fontSize: 14, fontWeight: 700, color: "#0A0A0F", marginBottom: 4 }}>
                      {task.title}
                    </div>
                    <div style={{ fontSize: 12, color: "#9CA3AF" }}>
                      {task.reward} pts/task · {total} slots · {task.category || "General"}
                    </div>
                  </div>
                  <span className={"badge " + (
                    task.status === "active" ? "badge-green" :
                    task.status === "pending" ? "badge-yellow" : "badge-red"
                  )}>
                    {task.status}
                  </span>
                </div>
                <div style={{ height: 4, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: pct + "%", background: "#A8FF3E", borderRadius: 99 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 11, color: "#9CA3AF" }}>
                  <span>{filled}/{total} completed</span>
                  <span>{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div style={{ height: 48 }} />
    </div>
  );
                   }
