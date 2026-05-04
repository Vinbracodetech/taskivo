import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";

// ── Region detection ──────────────────────────────────────────
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

    // Load profile
    var profileResult = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    var currentProfile = profileResult.data || user;

    // Auto-detect region if not set
    if (!currentProfile.country) {
      var location = await detectCountry();
      await supabase
        .from("profiles")
        .update({
          country: location.code,
          country_name: location.name,
        })
        .eq("id", user.id);
      currentProfile.country = location.code;
      currentProfile.country_name = location.name;
    }

    setProfile(currentProfile);

    // Load completions
    var completionsResult = await supabase
      .from("completions")
      .select("*, tasks(title, reward)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);
    if (completionsResult.data) setCompletions(completionsResult.data);

    // Load active tasks
    var tasksResult = await supabase
      .from("tasks")
      .select("*")
      .eq("status", "active")
      .limit(4);
    if (tasksResult.data) setTasks(tasksResult.data);

    setLoading(false);
  }

  var points = profile ? (profile.points || 0) : 0;
  var name = profile
    ? (profile.full_name || profile.email || "Earner")
    : "Earner";
  var countryCode = profile ? (profile.country || "OTHER") : "OTHER";
  var countryName = profile ? (profile.country_name || "Global") : "Global";
  var flag = COUNTRY_FLAGS[countryCode] || "🌍";

  // Gold card hover handler
  function onCardEnter(e) {
    e.currentTarget.style.boxShadow = "0 8px 32px rgba(245,158,11,0.18), 0 0 0 1.5px rgba(245,158,11,0.25)";
    e.currentTarget.style.transform = "translateY(-3px)";
    e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)";
  }
  function onCardLeave(e) {
    e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
    e.currentTarget.style.transform = "translateY(0)";
    e.currentTarget.style.borderColor = "#E5E7EB";
  }

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
            width: 36,
            height: 36,
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

  return (
    <div style={{
      padding: "36px 32px",
      maxWidth: 1100,
      fontFamily: "var(--font-body)",
    }}>

      {/* ── GREETING ── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 30,
          fontWeight: 700,
          color: "#0A0A0F",
          marginBottom: 6,
          letterSpacing: "-0.5px",
        }}>
          Welcome back, {name.split(" ")[0]} 👋
        </div>
        <div style={{ fontSize: 15, color: "#6B7280" }}>
          Here's your earnings overview for today.
        </div>
      </div>

      {/* ── HERO BALANCE CARD ── */}
      <div style={{
        background: "linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)",
        borderRadius: 24,
        padding: "36px 40px",
        marginBottom: 24,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -80, right: -80,
          width: 280, height: 280,
          background: "radial-gradient(circle, rgba(168,255,62,0.15), transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -60, left: 60,
          width: 200, height: 200,
          background: "radial-gradient(circle, rgba(245,158,11,0.08), transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 24,
          position: "relative",
        }}>
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700,
              letterSpacing: "1.8px",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
              marginBottom: 12,
            }}>
              Total Points Balance
            </div>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: 64, fontWeight: 700,
              color: "#A8FF3E", lineHeight: 1,
              letterSpacing: "-2px", marginBottom: 8,
            }}>
              {points.toLocaleString()}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)" }}>
              Withdraw from <strong style={{ color: "rgba(255,255,255,0.6)" }}>2,000 pts</strong> minimum
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 8 }}>
            <button
              className="btn btn-primary"
              style={{ justifyContent: "center", minWidth: 160 }}
              onClick={function () { navigate("tasks"); }}
            >
              Browse Tasks →
            </button>
            <button
              onClick={function () { navigate("withdraw"); }}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff",
                borderRadius: 8,
                padding: "10px 20px",
                fontFamily: "var(--font-body)",
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              ↑ Withdraw
            </button>
          </div>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 16,
        marginBottom: 36,
      }}>

        {/* Tasks Completed */}
        <div
          onMouseEnter={onCardEnter}
          onMouseLeave={onCardLeave}
          style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 18,
            padding: "24px 22px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            transition: "all 0.22s ease",
            cursor: "default",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div style={{
              fontSize: 11, fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#9CA3AF",
            }}>
              Tasks Completed
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(34,197,94,0.1)",
              display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 17,
            }}>
              ✅
            </div>
          </div>
          <div style={{
            fontFamily: "var(--font-heading)",
            fontSize: 36, fontWeight: 800,
            color: "#0A0A0F", lineHeight: 1,
            marginBottom: 6,
          }}>
            {completions.length}
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF" }}>All time</div>
        </div>

        {/* Available Tasks */}
        <div
          onMouseEnter={onCardEnter}
          onMouseLeave={onCardLeave}
          style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 18,
            padding: "24px 22px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            transition: "all 0.22s ease",
            cursor: "default",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div style={{
              fontSize: 11, fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#9CA3AF",
            }}>
              Available Tasks
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(168,255,62,0.12)",
              display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 17,
            }}>
              🎯
            </div>
          </div>
          <div style={{
            fontFamily: "var(--font-heading)",
            fontSize: 36, fontWeight: 800,
            color: "#0A0A0F", lineHeight: 1,
            marginBottom: 6,
          }}>
            {tasks.length}
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF" }}>Ready to start</div>
        </div>

        {/* Region */}
        <div
          onMouseEnter={onCardEnter}
          onMouseLeave={onCardLeave}
          style={{
            background: "#fff",
            border: "1px solid #E5E7EB",
            borderRadius: 18,
            padding: "24px 22px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            transition: "all 0.22s ease",
            cursor: "default",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div style={{
              fontSize: 11, fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#9CA3AF",
            }}>
              Your Region
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "rgba(99,102,241,0.1)",
              display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 20,
            }}>
              {flag}
            </div>
          </div>
          <div style={{
            fontFamily: "var(--font-heading)",
            fontSize: 28, fontWeight: 800,
            color: "#0A0A0F", lineHeight: 1,
            marginBottom: 6,
          }}>
            {countryCode}
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF" }}>{countryName}</div>
        </div>

      </div>

      {/* ── AVAILABLE TASKS ── */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 18,
      }}>
        <div style={{
          fontFamily: "var(--font-heading)",
          fontSize: 18, fontWeight: 700, color: "#0A0A0F",
        }}>
          Available Tasks
        </div>
        <button className="btn btn-ghost btn-sm" onClick={function () { navigate("tasks"); }}>
          See All →
        </button>
      </div>

      {tasks.length === 0 ? (
        <div style={{
          background: "#fff", border: "1px solid #E5E7EB",
          borderRadius: 16, padding: "48px 24px",
          textAlign: "center", marginBottom: 32,
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>
            No tasks yet
          </div>
          <div style={{ fontSize: 13, color: "#6B7280" }}>
            Creators are posting tasks. Check back soon.
          </div>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16, marginBottom: 36,
        }}>
          {tasks.map(function (task) {
            var filled = task.completed_slots || 0;
            var total = task.total_slots || 1;
            var pct = Math.round((filled / total) * 100);
            return (
              <div key={task.id}
                onMouseEnter={function (e) {
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(245,158,11,0.15), 0 0 0 1.5px rgba(168,255,62,0.3)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                }}
                onMouseLeave={function (e) {
                  e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.06)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
                style={{
                  background: "#fff",
                  border: "1px solid #E5E7EB",
                  borderRadius: 16, padding: 20,
                  transition: "all 0.2s",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: 14, fontWeight: 700,
                    color: "#0A0A0F", flex: 1,
                    paddingRight: 10, lineHeight: 1.4,
                  }}>
                    {task.title}
                  </div>
                  <span className="badge badge-lime" style={{ flexShrink: 0 }}>
                    {task.category || "Task"}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 14, lineHeight: 1.5 }}>
                  {task.description
                    ? task.description.slice(0, 75) + "..."
                    : "Complete this task to earn points."}
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#9CA3AF", marginBottom: 12 }}>
                  <span>⏱ {task.required_time || 60}s</span>
                  <span>👥 {total - filled} slots</span>
                </div>
                <div style={{
                  height: 4, background: "#F3F4F6",
                  borderRadius: 99, overflow: "hidden", marginBottom: 14,
                }}>
                  <div style={{
                    height: "100%", width: pct + "%",
                    background: "var(--lime)", borderRadius: 99,
                  }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: 22, fontWeight: 800, color: "#7ACC20",
                    }}>
                      {task.reward || 0}
                    </span>
                    <span style={{ fontSize: 11, color: "#9CA3AF", marginLeft: 4 }}>pts</span>
                  </div>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={function () { navigate("tasks"); }}
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
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 18,
      }}>
        <div style={{
          fontFamily: "var(--font-heading)",
          fontSize: 18, fontWeight: 700, color: "#0A0A0F",
        }}>
          Recent Activity
        </div>
        <button className="btn btn-ghost btn-sm" onClick={function () { navigate("wallet"); }}>
          View All →
        </button>
      </div>

      {completions.length === 0 ? (
        <div style={{
          background: "#fff", border: "1px solid #E5E7EB",
          borderRadius: 16, padding: "48px 24px", textAlign: "center",
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🎯</div>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>No activity yet</div>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>
            Complete your first task to start earning.
          </div>
          <button className="btn btn-primary btn-sm" onClick={function () { navigate("tasks"); }}>
            Browse Tasks →
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {completions.map(function (c) {
            var reward = c.tasks ? c.tasks.reward : 0;
            var title = c.tasks ? c.tasks.title : "Task Completed";
            var date = new Date(c.created_at).toLocaleDateString("en-GB", {
              day: "numeric", month: "short", year: "numeric",
            });
            return (
              <div key={c.id} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "14px 18px", background: "#fff",
                border: "1px solid #E5E7EB", borderRadius: 12,
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: "rgba(34,197,94,0.1)",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 16, flexShrink: 0,
                }}>✓</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0F" }}>{title}</div>
                  <div style={{ fontSize: 12, color: "#9CA3AF" }}>{date}</div>
                </div>
                <div style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 15, fontWeight: 700, color: "#16A34A",
                }}>
                  +{reward} pts
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
