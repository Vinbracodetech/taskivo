import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";

const CATEGORIES = ["All", "Music", "Education", "Gaming", "Tech", "Lifestyle", "Comedy", "News", "Sports", "Other"];

export default function Tasks({ user, navigate, showToast }) {

  var [tasks, setTasks] = useState([]);
  var [completions, setCompletions] = useState([]);
  var [loading, setLoading] = useState(true);
  var [search, setSearch] = useState("");
  var [category, setCategory] = useState("All");

  useEffect(function () {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);

    // Load active tasks that still have slots
    var tasksResult = await supabase
      .from("tasks")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false });

    // Load user's completions to check 24hr cooldown
    var completionsResult = await supabase
      .from("completions")
      .select("task_id, created_at")
      .eq("user_id", user.id);

    if (tasksResult.data) {
      // Only show tasks where slots not yet filled
      var available = tasksResult.data.filter(function (t) {
        var filled = t.completed_slots || 0;
        var total = t.total_slots || 1;
        return filled < total;
      });
      setTasks(available);
    }

    if (completionsResult.data) setCompletions(completionsResult.data);

    setLoading(false);
  }

  // Check if user can do this task today (24hr cooldown)
  function canDoToday(taskId) {
    var now = new Date();
    var match = completions.find(function (c) {
      return c.task_id === taskId;
    });
    if (!match) return true;
    var last = new Date(match.created_at);
    var diffHours = (now - last) / (1000 * 60 * 60);
    return diffHours >= 24;
  }

  // Filter by search + category
  var filtered = tasks.filter(function (t) {
    var matchSearch = search === ""
      || (t.title || "").toLowerCase().includes(search.toLowerCase())
      || (t.description || "").toLowerCase().includes(search.toLowerCase());
    var matchCat = category === "All" || t.category === category;
    return matchSearch && matchCat;
  });

  if (loading) {
    return (
      <div style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{
          width: 36, height: 36,
          border: "3px solid #E5E7EB",
          borderTopColor: "#A8FF3E",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }} />
      </div>
    );
  }

  return (
    <div style={{
      padding: "28px 20px",
      maxWidth: 720,
      margin: "0 auto",
      fontFamily: "var(--font-body)",
    }}>

      {/* ── HEADER ── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontSize: 22, fontWeight: 700,
          color: "#0A0A0F", marginBottom: 4,
          letterSpacing: "-0.3px",
        }}>
          Browse Tasks
        </div>
        <div style={{ fontSize: 14, color: "#6B7280" }}>
          Watch, engage and earn points every day.
        </div>
      </div>

      {/* ── SEARCH ── */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <span style={{
          position: "absolute",
          left: 14, top: "50%",
          transform: "translateY(-50%)",
          fontSize: 16,
          color: "#9CA3AF",
          pointerEvents: "none",
        }}>
          🔍
        </span>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={function (e) { setSearch(e.target.value); }}
          style={{
            width: "100%",
            padding: "12px 14px 12px 42px",
            border: "1px solid #E5E7EB",
            borderRadius: 10,
            fontSize: 14,
            fontFamily: "var(--font-body)",
            color: "#0A0A0F",
            background: "#fff",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* ── CATEGORY FILTERS ── */}
      <div style={{
        display: "flex",
        gap: 8,
        overflowX: "auto",
        paddingBottom: 4,
        marginBottom: 20,
        scrollbarWidth: "none",
      }}>
        {CATEGORIES.map(function (cat) {
          var active = category === cat;
          return (
            <button
              key={cat}
              onClick={function () { setCategory(cat); }}
              style={{
                padding: "7px 16px",
                borderRadius: 20,
                border: active ? "1px solid #0D0D14" : "1px solid #E5E7EB",
                background: active ? "#0D0D14" : "#fff",
                color: active ? "#A8FF3E" : "#6B7280",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 0.15s",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* ── TASK COUNT ── */}
      <div style={{
        fontSize: 12, fontWeight: 600,
        color: "#9CA3AF",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        marginBottom: 14,
      }}>
        {filtered.length} task{filtered.length !== 1 ? "s" : ""} available
      </div>

      {/* ── TASK LIST ── */}
      {filtered.length === 0 ? (
        <div style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderLeft: "4px solid #E5E7EB",
          borderRadius: 12,
          padding: "48px 24px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
            No tasks found
          </div>
          <div style={{ fontSize: 13, color: "#6B7280" }}>
            {search || category !== "All"
              ? "Try a different search or category."
              : "Check back soon — creators are posting tasks."}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(function (task) {
            var filled = task.completed_slots || 0;
            var total = task.total_slots || 1;
            var pct = Math.min(Math.round((filled / total) * 100), 100);
            var slotsLeft = total - filled;
            var eligible = canDoToday(task.id);
            var reward = task.reward || 0;
            var bonusPoints = task.bonus_points || Math.round(reward * 0.2);

            return (
              <div key={task.id} style={{
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderLeft: "4px solid " + (eligible ? "#A8FF3E" : "#E5E7EB"),
                borderRadius: 12,
                padding: "18px 16px",
                opacity: eligible ? 1 : 0.7,
              }}>

                {/* Top row */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 10,
                  marginBottom: 8,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 15, fontWeight: 700,
                      color: "#0A0A0F", marginBottom: 4,
                      lineHeight: 1.3,
                    }}>
                      {task.title}
                    </div>
                    <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>
                      {task.description
                        ? task.description.slice(0, 80) + (task.description.length > 80 ? "..." : "")
                        : "Watch the video and complete all actions to earn points."}
                    </div>
                  </div>

                  {/* Category badge */}
                  {task.category && (
                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 20,
                      background: "#F3F4F6",
                      color: "#6B7280",
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}>
                      {task.category}
                    </span>
                  )}
                </div>

                {/* Actions required */}
                <div style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginBottom: 12,
                }}>
                  {["Watch", "Like", "Comment", "Subscribe*"].map(function (action) {
                    return (
                      <span key={action} style={{
                        fontSize: 11, fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: 20,
                        background: action === "Subscribe*"
                          ? "rgba(245,158,11,0.08)"
                          : "rgba(168,255,62,0.08)",
                        color: action === "Subscribe*" ? "#D97706" : "#3D7A00",
                        border: "1px solid " + (action === "Subscribe*"
                          ? "rgba(245,158,11,0.2)"
                          : "rgba(168,255,62,0.2)"),
                      }}>
                        {action}
                      </span>
                    );
                  })}
                </div>

                {/* Progress bar */}
                <div style={{
                  height: 4,
                  background: "#F3F4F6",
                  borderRadius: 99,
                  overflow: "hidden",
                  marginBottom: 12,
                }}>
                  <div style={{
                    height: "100%",
                    width: pct + "%",
                    background: pct > 80 ? "#EF4444" : "#A8FF3E",
                    borderRadius: 99,
                    transition: "width 0.3s ease",
                  }} />
                </div>

                {/* Bottom row */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 10,
                }}>
                  <div>
                    {/* Points */}
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                      <span style={{
                        fontSize: 20, fontWeight: 800,
                        color: "#7ACC20",
                        fontFamily: "var(--font-body)",
                      }}>
                        {reward.toLocaleString()}
                      </span>
                      <span style={{ fontSize: 11, color: "#9CA3AF" }}>pts</span>
                      <span style={{
                        fontSize: 11, color: "#D97706",
                        fontWeight: 600,
                      }}>
                        +{bonusPoints} bonus
                      </span>
                    </div>
                    {/* Slots + time */}
                    <div style={{
                      fontSize: 11, color: "#9CA3AF",
                      marginTop: 2,
                    }}>
                      ⏱ {task.required_time || 60}s watch &nbsp;·&nbsp;
                      👥 {slotsLeft.toLocaleString()} slot{slotsLeft !== 1 ? "s" : ""} left
                    </div>
                  </div>

                  {/* CTA button */}
                  {eligible ? (
                    <button
                      onClick={function () { navigate("task-player", { taskId: task.id }); }}
                      style={{
                        background: "#A8FF3E",
                        border: "none",
                        borderRadius: 8,
                        padding: "10px 20px",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#0D0D14",
                        fontFamily: "var(--font-body)",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                    >
                      Start →
                    </button>
                  ) : (
                    <div style={{
                      background: "#F3F4F6",
                      border: "none",
                      borderRadius: 8,
                      padding: "10px 16px",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#9CA3AF",
                      flexShrink: 0,
                      textAlign: "center",
                    }}>
                      ✓ Done today
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Subscribe note */}
      <div style={{
        marginTop: 20,
        fontSize: 11,
        color: "#9CA3AF",
        textAlign: "center",
      }}>
        * Subscribe is optional — earn bonus points if you subscribe
      </div>

      <div style={{ height: 48 }} />
    </div>
  );
}
