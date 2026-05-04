import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";

export default function CreatorTasks({ navigate, showToast, user }) {

  var [tasks, setTasks] = useState([]);
  var [loading, setLoading] = useState(true);
  var [tab, setTab] = useState("tasks");

  useEffect(function () { loadTasks(); }, []);

  async function loadTasks() {
    setLoading(true);
    var result = await supabase
      .from("tasks")
      .select("*")
      .eq("creator_id", user.id)
      .order("created_at", { ascending: false });
    if (result.data) setTasks(result.data);
    setLoading(false);
  }

  // Chart data — completions per task
  var chartMax = Math.max.apply(null, tasks.map(function (t) { return t.completed_slots || 0; }).concat([1]));

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 36, height: 36, border: "3px solid #E5E7EB", borderTopColor: "#A8FF3E", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
      </div>
    );
  }

  return (
    <div style={{ padding: "36px 32px", maxWidth: 1000, fontFamily: "var(--font-body)" }}>

      <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "#0A0A0F", marginBottom: 6, letterSpacing: "-0.5px" }}>
        My Tasks
      </div>
      <div style={{ fontSize: 15, color: "#6B7280", marginBottom: 28 }}>
        Manage your posted tasks and view performance.
      </div>

      {/* TABS */}
      <div className="tabs">
        <button className={"tab " + (tab === "tasks" ? "active" : "")} onClick={function () { setTab("tasks"); }}>All Tasks</button>
        <button className={"tab " + (tab === "analytics" ? "active" : "")} onClick={function () { setTab("analytics"); }}>Analytics</button>
      </div>

      {/* TASKS TAB */}
      {tab === "tasks" && (
        <>
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <button className="btn btn-primary btn-sm" onClick={function () { navigate("create-task"); }}>+ New Task</button>
          </div>

          {tasks.length === 0 ? (
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>No tasks yet</div>
              <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>Create your first task to start collecting feedback.</div>
              <button className="btn btn-primary" onClick={function () { navigate("create-task"); }}>+ Post New Task</button>
            </div>
          ) : (
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Type</th>
                      <th>Reward</th>
                      <th>Progress</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map(function (task) {
                      var filled = task.completed_slots || 0;
                      var total = task.total_slots || 1;
                      var pct = Math.round((filled / total) * 100);
                      var date = new Date(task.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
                      return (
                        <tr key={task.id}>
                          <td style={{ fontWeight: 600, maxWidth: 200 }}>{task.title}</td>
                          <td>
                            <span className="badge badge-gray" style={{ textTransform: "capitalize" }}>
                              {task.type || "general"}
                            </span>
                          </td>
                          <td style={{ fontFamily: "var(--font-heading)", fontWeight: 700 }}>
                            {task.reward} pts
                          </td>
                          <td style={{ minWidth: 140 }}>
                            <div style={{ fontSize: 11, color: "#9CA3AF", marginBottom: 4 }}>{filled}/{total} ({pct}%)</div>
                            <div style={{ height: 4, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
                              <div style={{ height: "100%", width: pct + "%", background: "#A8FF3E", borderRadius: 99 }} />
                            </div>
                          </td>
                          <td>
                            <span className={"badge " + (
                              task.status === "active" ? "badge-green" :
                              task.status === "pending" ? "badge-yellow" : "badge-red"
                            )}>
                              {task.status}
                            </span>
                          </td>
                          <td style={{ color: "#9CA3AF", fontSize: 13 }}>{date}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ANALYTICS TAB */}
      {tab === "analytics" && (
        <>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: 16, fontWeight: 700, color: "#0A0A0F", marginBottom: 16 }}>
            Completions Per Task
          </div>
          {tasks.length === 0 ? (
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "48px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 13, color: "#6B7280" }}>No data yet. Post tasks to see analytics.</div>
            </div>
          ) : (
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 20, padding: "28px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 12, height: 200, padding: "0 8px" }}>
                {tasks.map(function (task) {
                  var filled = task.completed_slots || 0;
                  var heightPct = chartMax > 0 ? Math.round((filled / chartMax) * 100) : 0;
                  return (
                    <div key={task.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#7ACC20" }}>{filled}</div>
                      <div style={{
                        width: "100%",
                        height: (heightPct || 4) + "%",
                        minHeight: 4,
                        background: "linear-gradient(180deg, #A8FF3E, #7ACC20)",
                        borderRadius: "6px 6px 0 0",
                        transition: "height 0.6s",
                      }} />
                      <div style={{
                        fontSize: 10, color: "#9CA3AF",
                        textAlign: "center", lineHeight: 1.3,
                        overflow: "hidden", maxWidth: "100%",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}>
                        {task.title.slice(0, 20)}...
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      <div style={{ height: 48 }} />
    </div>
  );
}
