import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";

const TOP_TIER = ["US", "GB", "CA", "AU"];

function getRatePerPoint(code) {
  if (TOP_TIER.includes(code)) return 0.10 / 60;
  return 0.03 / 60;
}

function getSymbol(code) {
  if (code === "GB") return "£";
  return "$";
}

export default function Wallet({ user, navigate, showToast }) {

  var [profile, setProfile] = useState(user);
  var [transactions, setTransactions] = useState([]);
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
    if (profileResult.data) setProfile(profileResult.data);

    var earnResult = await supabase
      .from("completions")
      .select("*, tasks(title, reward)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    var withdrawResult = await supabase
      .from("withdrawals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    var earned = (earnResult.data || []).map(function (c) {
      return {
        id: "e-" + c.id,
        type: "earn",
        title: c.tasks ? c.tasks.title : "Task Completed",
        amount: c.tasks ? c.tasks.reward : 0,
        date: c.created_at,
      };
    });

    var withdrawn = (withdrawResult.data || []).map(function (w) {
      return {
        id: "w-" + w.id,
        type: "withdraw",
        title: "Withdrawal — " + (w.method || "Request"),
        amount: -(w.points || 0),
        date: w.created_at,
        status: w.status,
      };
    });

    var all = earned.concat(withdrawn).sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    setTransactions(all);
    setLoading(false);
  }

  var points = profile ? (profile.points || 0) : 0;
  var userCode = profile ? (profile.country || "OTHER") : "OTHER";
  var ratePerPoint = getRatePerPoint(userCode);
  var symbol = getSymbol(userCode);
  var totalValue = (points * ratePerPoint).toFixed(2);

  var totalEarned = transactions
    .filter(function (t) { return t.type === "earn"; })
    .reduce(function (sum, t) { return sum + t.amount; }, 0);

  if (loading) {
    return (
      <div style={{
        minHeight: "60vh", display: "flex",
        alignItems: "center", justifyContent: "center",
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

  function statCard(borderColor) {
    return {
      background: "#fff",
      border: "1px solid #E5E7EB",
      borderLeft: "4px solid " + borderColor,
      borderRadius: 12,
      padding: "18px 16px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    };
  }

  return (
    <div style={{
      padding: "28px 20px",
      maxWidth: 520,
      margin: "0 auto",
      fontFamily: "var(--font-body)",
    }}>

      {/* ── HEADER ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontSize: 22, fontWeight: 700,
          color: "#0A0A0F", marginBottom: 4,
          letterSpacing: "-0.3px",
        }}>
          My Wallet
        </div>
        <div style={{ fontSize: 14, color: "#6B7280" }}>
          Your full earnings history and balance.
        </div>
      </div>

      {/* ── BALANCE CARD ── */}
      <div style={{
        background: "linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)",
        borderRadius: 16,
        padding: "24px 22px",
        marginBottom: 16,
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -50, right: -50,
          width: 160, height: 160,
          background: "radial-gradient(circle, rgba(168,255,62,0.12), transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />

        <div style={{
          fontSize: 11, fontWeight: 700,
          letterSpacing: "1.5px", textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)", marginBottom: 8,
        }}>
          Available Balance
        </div>

        <div style={{
          fontSize: 48, fontWeight: 700,
          color: "#A8FF3E", lineHeight: 1,
          letterSpacing: "-1.5px",
          fontFamily: "var(--font-body)",
          marginBottom: 4,
        }}>
          {points.toLocaleString()}
          <span style={{
            fontSize: 16,
            color: "rgba(255,255,255,0.4)",
            marginLeft: 8, fontWeight: 500,
          }}>
            pts
          </span>
        </div>

        <div style={{
          fontSize: 14,
          color: "rgba(255,255,255,0.55)",
          marginTop: 8, fontWeight: 500,
          marginBottom: 20,
        }}>
          Worth{" "}
          <span style={{ color: "#A8FF3E", fontWeight: 700 }}>
            {symbol}{totalValue}
          </span>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={function () { navigate("withdraw"); }}
            disabled={points < 2000}
            style={{
              flex: 1,
              padding: "11px 0",
              background: points >= 2000 ? "#A8FF3E" : "rgba(255,255,255,0.1)",
              border: "none",
              borderRadius: 8,
              color: points >= 2000 ? "#0D0D14" : "rgba(255,255,255,0.3)",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "var(--font-body)",
              cursor: points >= 2000 ? "pointer" : "not-allowed",
            }}
          >
            ↑ Withdraw Points
          </button>
          <button
            onClick={function () { navigate("tasks"); }}
            style={{
              flex: 1,
              padding: "11px 0",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 8,
              color: "rgba(255,255,255,0.6)",
              fontSize: 14,
              fontWeight: 600,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
            }}
          >
            Earn More →
          </button>
        </div>
      </div>

      {/* ── STAT CARDS ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        marginBottom: 24,
      }}>
        <div style={statCard("#22C55E")}>
          <div style={{
            fontSize: 10, fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#9CA3AF", marginBottom: 8,
          }}>
            Total Earned
          </div>
          <div style={{
            fontSize: 26, fontWeight: 800,
            color: "#16A34A",
            fontFamily: "var(--font-body)",
          }}>
            {totalEarned.toLocaleString()}
            <span style={{ fontSize: 12, color: "#9CA3AF", marginLeft: 4 }}>pts</span>
          </div>
        </div>

        <div style={statCard("#3B82F6")}>
          <div style={{
            fontSize: 10, fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#9CA3AF", marginBottom: 8,
          }}>
            Transactions
          </div>
          <div style={{
            fontSize: 26, fontWeight: 800,
            color: "#0A0A0F",
            fontFamily: "var(--font-body)",
          }}>
            {transactions.length.toLocaleString()}
          </div>
        </div>
      </div>

      {/* ── TRANSACTION LIST ── */}
      <div style={{
        fontSize: 16, fontWeight: 700,
        color: "#0A0A0F", marginBottom: 14,
      }}>
        Transaction History
      </div>

      {transactions.length === 0 ? (
        <div style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderLeft: "4px solid #E5E7EB",
          borderRadius: 12,
          padding: "40px 24px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>
            No transactions yet
          </div>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}>
            Complete tasks to see your earnings here.
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
          {transactions.map(function (tx) {
            var isEarn = tx.type === "earn";
            var date = new Date(tx.date).toLocaleDateString("en-GB", {
              day: "numeric", month: "short", year: "numeric",
            });
            var borderColor = isEarn ? "#22C55E"
              : tx.status === "approved" ? "#22C55E"
              : tx.status === "rejected" ? "#EF4444"
              : "#F59E0B";

            return (
              <div key={tx.id} style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 16px",
                background: "#fff",
                border: "1px solid #E5E7EB",
                borderLeft: "4px solid " + borderColor,
                borderRadius: 12,
              }}>
                <div style={{
                  width: 36, height: 36,
                  borderRadius: "50%",
                  background: isEarn
                    ? "rgba(34,197,94,0.1)"
                    : "rgba(239,68,68,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  flexShrink: 0,
                }}>
                  {isEarn ? "✓" : "↑"}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14, fontWeight: 600,
                    color: "#0A0A0F", marginBottom: 2,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                    {tx.title}
                  </div>
                  <div style={{
                    fontSize: 11, color: "#9CA3AF",
                    display: "flex", gap: 8, alignItems: "center",
                  }}>
                    {date}
                    {tx.status && (
                      <span style={{
                        fontSize: 10, fontWeight: 700,
                        padding: "2px 8px", borderRadius: 20,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        background: tx.status === "approved"
                          ? "rgba(34,197,94,0.1)"
                          : tx.status === "rejected"
                          ? "rgba(239,68,68,0.1)"
                          : "rgba(245,158,11,0.1)",
                        color: tx.status === "approved" ? "#16A34A"
                          : tx.status === "rejected" ? "#EF4444"
                          : "#D97706",
                      }}>
                        {tx.status}
                      </span>
                    )}
                  </div>
                </div>

                <div style={{
                  fontSize: 14, fontWeight: 700,
                  color: isEarn ? "#16A34A" : "#EF4444",
                  flexShrink: 0,
                  fontFamily: "var(--font-body)",
                }}>
                  {isEarn ? "+" : ""}{Math.abs(tx.amount).toLocaleString()} pts
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
