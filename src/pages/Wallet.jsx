import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase.js";

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

    // Load completions as earning transactions
    var earnResult = await supabase
      .from("completions")
      .select("*, tasks(title, reward)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    // Load withdrawal requests
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

    // Merge and sort by date
    var all = earned.concat(withdrawn).sort(function (a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    setTransactions(all);
    setLoading(false);
  }

  var points = profile ? (profile.points || 0) : 0;
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

  return (
    <div style={{ padding: "36px 32px", maxWidth: 900, fontFamily: "var(--font-body)" }}>

      {/* ── HEADER ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 30, fontWeight: 700,
          color: "#0A0A0F", marginBottom: 6,
          letterSpacing: "-0.5px",
        }}>
          My Wallet
        </div>
        <div style={{ fontSize: 15, color: "#6B7280" }}>
          Your full earnings history and balance.
        </div>
      </div>

      {/* ── BALANCE HERO ── */}
      <div style={{
        background: "linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)",
        borderRadius: 24, padding: "36px 40px",
        marginBottom: 20, position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -80, right: -80,
          width: 260, height: 260,
          background: "radial-gradient(circle, rgba(168,255,62,0.15), transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 24, position: "relative" }}>
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700,
              letterSpacing: "1.8px", textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)", marginBottom: 10,
            }}>
              Available Balance
            </div>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: 60, fontWeight: 700,
              color: "#A8FF3E", lineHeight: 1,
              letterSpacing: "-2px", marginBottom: 8,
            }}>
              {points.toLocaleString()}
              <span style={{ fontSize: 20, color: "rgba(255,255,255,0.4)", marginLeft: 8 }}>pts</span>
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
              Minimum withdrawal: <strong style={{ color: "rgba(255,255,255,0.6)" }}>2,000 pts</strong>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 8 }}>
            <button
              className="btn btn-primary"
              style={{ justifyContent: "center", minWidth: 160 }}
              onClick={function () { navigate("withdraw"); }}
              disabled={points < 2000}
            >
              ↑ Withdraw Points
            </button>
            <button
              className="btn btn-ghost btn-sm"
              style={{ color: "rgba(255,255,255,0.5)", justifyContent: "center" }}
              onClick={function () { navigate("tasks"); }}
            >
              Earn More →
            </button>
          </div>
        </div>
      </div>

      {/* ── STAT ROW ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 16, marginBottom: 32,
      }}>
        <div style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 16, padding: "22px 20px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: "#9CA3AF", marginBottom: 10,
          }}>
            Total Earned
          </div>
          <div style={{
            fontFamily: "var(--font-heading)",
            fontSize: 32, fontWeight: 800, color: "#16A34A",
          }}>
            {totalEarned.toLocaleString()}
            <span style={{ fontSize: 13, color: "#9CA3AF", marginLeft: 6 }}>pts</span>
          </div>
        </div>
        <div style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 16, padding: "22px 20px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
            color: "#9CA3AF", marginBottom: 10,
          }}>
            Transactions
          </div>
          <div style={{
            fontFamily: "var(--font-heading)",
            fontSize: 32, fontWeight: 800, color: "#0A0A0F",
          }}>
            {transactions.length}
          </div>
        </div>
      </div>

      {/* ── TRANSACTION LIST ── */}
      <div style={{
        fontFamily: "var(--font-heading)",
        fontSize: 18, fontWeight: 700,
        color: "#0A0A0F", marginBottom: 16,
      }}>
        Transaction History
      </div>

      {transactions.length === 0 ? (
        <div style={{
          background: "#fff", border: "1px solid #E5E7EB",
          borderRadius: 16, padding: "48px 24px", textAlign: "center",
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>
            No transactions yet
          </div>
          <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 20 }}>
            Complete tasks to see your earnings here.
          </div>
          <button className="btn btn-primary btn-sm" onClick={function () { navigate("tasks"); }}>
            Browse Tasks →
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {transactions.map(function (tx) {
            var isEarn = tx.type === "earn";
            var date = new Date(tx.date).toLocaleDateString("en-GB", {
              day: "numeric", month: "short", year: "numeric",
            });
            return (
              <div key={tx.id} style={{
                display: "flex", alignItems: "center", gap: 14,
                padding: "16px 20px", background: "#fff",
                border: "1px solid #E5E7EB", borderRadius: 14,
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                transition: "all 0.18s",
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: "50%",
                  background: isEarn
                    ? "rgba(34,197,94,0.1)"
                    : "rgba(239,68,68,0.08)",
                  display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 18, flexShrink: 0,
                }}>
                  {isEarn ? "✓" : "↑"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 14, fontWeight: 600,
                    color: "#0A0A0F", marginBottom: 2,
                    whiteSpace: "nowrap", overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                    {tx.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", display: "flex", gap: 8, alignItems: "center" }}>
                    {date}
                    {tx.status && (
                      <span className={"badge " + (
                        tx.status === "approved" ? "badge-green" :
                        tx.status === "pending" ? "badge-yellow" : "badge-red"
                      )}>
                        {tx.status}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 16, fontWeight: 700,
                  color: isEarn ? "#16A34A" : "#EF4444",
                  flexShrink: 0,
                }}>
                  {isEarn ? "+" : ""}{tx.amount.toLocaleString()} pts
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
