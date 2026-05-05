import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";

async function detectCountry() {
  try {
    var res = await fetch("https://ipapi.co/json/");
    var data = await res.json();
    return {
      code: data.country_code || "OTHER",
      name: data.country_name || "Global",
    };
  } catch (e) {
    return { code: "OTHER", name: "Global" };
  }
}

const COUNTRY_FLAGS = {
  NG: "🇳🇬", US: "🇺🇸", GB: "🇬🇧", CA: "🇨🇦",
  AU: "🇦🇺", GH: "🇬🇭", KE: "🇰🇪", ZA: "🇿🇦",
};

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

    var profileResult = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    var currentProfile = profileResult.data || user;

    if (!currentProfile.country) {
      var location = await detectCountry();
      await supabase
        .from("profiles")
        .update({ country: location.code, country_name: location.name })
        .eq("id", user.id);
      currentProfile.country = location.code;
      currentProfile.country_name = location.name;
    }

    setProfile(currentProfile);

    var completionsResult = await supabase
      .from("completions")
      .select("*, tasks(title, reward)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);
    if (completionsResult.data) setCompletions(completionsResult.data);

    var tasksResult = await supabase
      .from("tasks")
      .select("*")
      .eq("status", "active")
      .limit(4);
    if (tasksResult.data) setTasks(tasksResult.data);

    setLoading(false);
  }

  var points = profile ? (profile.points || 0) : 0;
  var name = profile ? (profile.full_name || profile.email || "Earner") : "Earner";
  var countryCode = profile ? (profile.country || "OTHER") : "OTHER";
  var countryName = profile ? (profile.country_name || "Global") : "Global";
  var flag = COUNTRY_FLAGS[countryCode] || "🌍";

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 36, height: 36,
            border: "3px solid #E5E7EB",
            borderTopColor: "#A8FF3E",
            borderRadius: "50%",
            margin: "0 auto 16px",
            animation: "spin 1s linear infinite",
          }} />
          <div style={{ fontSize: 14, color: "#6B7280" }}>Loading...</div>
        </div>
      </div>
    );
  }

  // ── shared card style ──
  function statCard(borderColor) {
    return {
      background: "#fff",
      border: "1px solid #E5E7EB",
      borderLeft: "4px solid " + borderColor,
      borderRadius: 12,
      padding: "20px 18px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    };
  }

  return (
    <div style={{
      padding: "28px 20px",
      maxWidth: 720,
      margin: "0 auto",
      fontFamily: "var(--font-body)",
    }}>

      {/* ── GREETING ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontSize: 22,
          fontWeight: 700,
          color: "#0A0A0F",
          marginBottom: 4,
          letterSpacing: "-0.3px",
        }}>
          Welcome back, {name.split(" ")[0]} 👋
        </div>
        <div style={{ fontSize: 14, color: "#6B7280" }}>
          Here's your earnings overview for today.
        </div>
      </div>

      {/* ── BALANCE CARD ── */}
      <div style={{
        background: "linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)",
        borderRadius: 16,
        padding: "28px 24px",
        marginBottom: 20,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -60, right: -60,
          width: 200, height: 200,
          background: "radial-gradient(circle, rgba(168,255,62,0.12), transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />

        <div style={{
          fontSize: 11, fontWeight: 700,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
          marginBottom: 10,
        }}>
          Total Points Balance
        </div>

        <div style={{
          fontSize: 52, fontWeight: 700,
          color: "#A8FF3E", lineHeight: 1,
          letterSpacing: "-1.5px", marginBottom: 6,
          fontFamily: "var(--font-body)",
        }}>
          {points.toLocaleString()}
        </div>

        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 20 }}>
          Withdraw from <strong style={{ color: "rgba(255,255,255,0.6)" }}>2,000 pts</strong> minimum
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={function () { navigate("tasks"); }}
            style={{
              flex: 1,
              padding: "11px 0",
              background: "#A8FF3E",
              border: "none",
              borderRadius: 8,
              color: "#0D0D14",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
            }}
          >
            Browse Tasks →
          </button>
          <button
            onClick={function () { navigate("withdraw"); }}
            style={{
              flex: 1,
              padding: "11px 0",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 8,
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
            }}
          >
            ↑ Withdraw
          </button>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 12,
        marginBottom: 28,
      }}>

        {/* Tasks Completed */}
        <div style={statCard("#A8FF3E")}>
          <div style={{
            fontSize: 10, fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#9CA3AF",
            marginBottom: 10,
          }}>
            Tasks Completed
          </div>
          <div style={{
            fontSize: 32, fontWeight: 800,
            color: "#0A0A0F", lineHeight: 1,
            marginBottom: 4,
            fontFamily: "var(--font-body)",
          }}>
            {completions.length.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: "#9CA3AF" }}>All time</div>
        </div>

        {/* Available Tasks */}
        <div style={statCard("#3B82F6")}>
          <div style={{
            fontSize: 10, fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#9CA3AF",
            marginBottom: 10,
          }}>
            Available Tasks
          </div>
          <div style={{
            fontSize: 32, fontWeight: 800,
            color: "#0A0A0F", lineHeight: 1,
            marginBottom: 4,
            fontFamily: "var(--font-body)",
          }}>
            {tasks.length.toLocaleString()}
          </div>
          <div style={{ fontSize: 11, color: "#9CA3AF" }}>Ready to start</div>
        </div>

        {/* Region */}
        <div style={statCard("#F59E0B")}>
          <div style={{
            fontSize: 10, fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#9CA3AF",
            marginBottom: 10,
          }}>
            Your Region
          </div>
          <div style={{
            fontSize: 22, fontWeight: 800,
            color: "#0A0A0F", lineHeight: 1,
            marginBottom: 4,
            fontFamily: "var(--font-body)",
          }}>
            {flag} {countryCode}
          </div>
          <div style={{ fontSize: 11, color: "#9CA3AF" }}>{countryName}</div>
        </div>

      </div>

      {/* ── AVAILABLE TASKS ── */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0F" }}>
          Available Tasks
        </div>
        <button
          onClick={function () { navigate("tasks"); }}
          style={{
            background: "none", border: "none",
            color: "#6B7280", fontSize: 13,
            fontFamily: "var(--font-body)",
            cursor: "pointer", fontWeight: 600,
          }}
        >
          See All →
        </button>
      </div>

      {tasks.length === 0 ? (
        <div style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          padding: "40px 24px",
          textAlign: "center",
          marginBottom: 28,
        }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>No tasks yet</div>
          <div style={{ fontSize: 13, color: "#6B7280" }}>
            Creators are posting tasks. Check back soon.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
          {tasks.map(function (task) {
            var filled = task.completed_slots || 0;
            var total = task.total_slots || 1;
            var pct = Math.round((filled / total) * 100);
            return (
              <div key={task.id} style={{
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderLeft: "4px solid #A8FF3E",
                borderRadius: 12,
                padding: "16px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14, fontWeight: 700,
                    color: "#0A0A0F", marginBottom: 4,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                    {task.title}
                  </div>
                  <div style={{ display: "flex", gap: 10, fontSize: 11, color: "#9CA3AF" }}>
                    <span>⏱ {task.required_time || 60}s</span>
                    <span>👥 {total - filled} slots left</span>
                  </div>
                  <div style={{
                    height: 3, background: "#F3F4F6",
                    borderRadius: 99, overflow: "hidden", marginTop: 10,
                  }}>
                    <div style={{
                      height: "100%", width: pct + "%",
                      background: "#A8FF3E", borderRadius: 99,
                    }} />
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{
                    fontSize: 18, fontWeight: 800,
                    color: "#7ACC20", marginBottom: 6,
                    fontFamily: "var(--font-body)",
                  }}>
                    {(task.reward || 0).toLocaleString()} pts
                  </div>
                  <button
                    onClick={function () { navigate("tasks"); }}
                    style={{
                      background: "#A8FF3E",
                      border: "none",
                      borderRadius: 6,
                      padding: "6px 14px",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#0D0D14",
                      fontFamily: "var(--font-body)",
                      cursor: "pointer",
                    }}
                  >
                    Start →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── RECENT ACTIVITY ── */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
      }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0F" }}>
          Recent Activity
        </div>
        <button
          onClick={function () { navigate("wallet"); }}
          style={{
            background: "none", border: "none",
            color: "#6B7280", fontSize: 13,
            fontFamily: "var(--font-body)",
            cursor: "pointer", fontWeight: 600,
          }}
        >
          View All →
        </button>
      </div>

      {completions.length === 0 ? (
        <div style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 12,
          padding: "40px 24px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>🎯</div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>No activity yet</div>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}>
            Complete your first task to start earning.
          </div>
          <button
            onClick={function () { navigate("tasks"); }}
            style={{
              background: "#A8FF3E",
              border: "none",
              borderRadius: 8,
              padding: "10px 24px",
              fontSize: 13,
              fontWeight: 700,
              color: "#0D0D14",
              fontFamily: "var(--font-body)",
              cursor: "pointer",
            }}
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
              day: "numeric", month: "short", year: "numeric",
            });
            return (
              <div key={c.id} style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderLeft: "4px solid #22C55E",
                borderRadius: 12,
              }}>
                <div style={{
                  width: 34, height: 34,
                  borderRadius: "50%",
                  background: "rgba(34,197,94,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  flexShrink: 0,
                }}>
                  ✓
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0F" }}>
                    {title}
                  </div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>{date}</div>
                </div>
                <div style={{
                  fontSize: 14, fontWeight: 700,
                  color: "#16A34A",
                  fontFamily: "var(--font-body)",
                }}>
                  +{(reward || 0).toLocaleString()} pts
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
