import { useState } from "react";
import { supabase } from "../lib/supabase.js";

const MIN_POINTS = 2000;
const METHODS = ["PayPal", "Paystack", "Flutterwave"];
const TOP_TIER = ["US", "GB", "CA", "AU"];

function getRatePerPoint(code) {
  if (TOP_TIER.includes(code)) return 0.10 / 60;
  return 0.03 / 60;
}

function getSymbol(code) {
  if (code === "GB") return "£";
  return "$";
}

export default function Withdraw({ user, setUser, navigate, showToast }) {

  var [points, setPoints] = useState(user ? (user.points || 0) : 0);
  var [requestPoints, setRequestPoints] = useState("");
  var [method, setMethod] = useState("");
  var [accountDetails, setAccountDetails] = useState("");
  var [loading, setLoading] = useState(false);
  var [submitted, setSubmitted] = useState(false);

  var userCode = user ? (user.country || "OTHER") : "OTHER";
  var ratePerPoint = getRatePerPoint(userCode);
  var symbol = getSymbol(userCode);

  var pointsNum = parseInt(requestPoints) || 0;
  var totalValue = (points * ratePerPoint).toFixed(2);
  var estimatedValue = (pointsNum * ratePerPoint).toFixed(2);
  var canWithdraw = points >= MIN_POINTS;
  var validRequest = pointsNum >= MIN_POINTS
    && pointsNum <= points
    && method
    && accountDetails.length > 5;

  async function handleSubmit() {
    if (!validRequest) return;
    setLoading(true);

    var result = await supabase
      .from("withdrawals")
      .insert({
        user_id: user.id,
        points: pointsNum,
        method: method,
        account_details: accountDetails,
        status: "pending",
        country: userCode,
        estimated_value: estimatedValue,
      });

    if (result.error) {
      showToast("Something went wrong. Please try again.", "error");
      setLoading(false);
      return;
    }

    var newPoints = points - pointsNum;
    await supabase
      .from("profiles")
      .update({ points: newPoints })
      .eq("id", user.id);

    if (setUser) {
      setUser(function (prev) {
        return { ...prev, points: newPoints };
      });
    }

    setPoints(newPoints);
    setLoading(false);
    setSubmitted(true);
    showToast("Withdrawal request submitted!", "success");
  }

  // ── SUCCESS STATE ──
  if (submitted) {
    return (
      <div style={{
        padding: "28px 20px",
        maxWidth: 520,
        margin: "0 auto",
        fontFamily: "var(--font-body)",
      }}>
        <div style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderLeft: "4px solid #22C55E",
          borderRadius: 16,
          padding: "48px 32px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <div style={{
            fontSize: 20, fontWeight: 700,
            color: "#0A0A0F", marginBottom: 10,
          }}>
            Request Submitted!
          </div>
          <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 6, lineHeight: 1.7 }}>
            Your withdrawal of{" "}
            <strong>{pointsNum.toLocaleString()} pts</strong>{" "}
            via <strong>{method}</strong> is pending admin approval.
          </div>
          <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 28 }}>
            Usually processed within 24–48 hours.
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button
              onClick={function () { navigate("wallet"); }}
              style={{
                background: "#A8FF3E",
                border: "none",
                borderRadius: 8,
                padding: "11px 24px",
                fontSize: 14,
                fontWeight: 700,
                color: "#0D0D14",
                fontFamily: "var(--font-body)",
                cursor: "pointer",
              }}
            >
              View Wallet
            </button>
            <button
              onClick={function () { navigate("tasks"); }}
              style={{
                background: "#F3F4F6",
                border: "none",
                borderRadius: 8,
                padding: "11px 24px",
                fontSize: 14,
                fontWeight: 600,
                color: "#0A0A0F",
                fontFamily: "var(--font-body)",
                cursor: "pointer",
              }}
            >
              Earn More →
            </button>
          </div>
        </div>
      </div>
    );
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
          Withdraw Points
        </div>
        <div style={{ fontSize: 14, color: "#6B7280" }}>
          Minimum withdrawal is {MIN_POINTS.toLocaleString()} points.
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
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)",
          marginBottom: 8,
        }}>
          Your Balance
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
            marginLeft: 8,
            fontWeight: 500,
          }}>
            pts
          </span>
        </div>

        <div style={{
          fontSize: 14,
          color: "rgba(255,255,255,0.55)",
          marginTop: 8,
          fontWeight: 500,
        }}>
          Worth{" "}
          <span style={{ color: "#A8FF3E", fontWeight: 700 }}>
            {symbol}{totalValue}
          </span>
        </div>

        {!canWithdraw && (
          <div style={{
            marginTop: 12, fontSize: 13,
            color: "rgba(255,165,0,0.9)", fontWeight: 500,
          }}>
            ⚠️ You need {(MIN_POINTS - points).toLocaleString()} more points to withdraw.
          </div>
        )}
      </div>

      {/* ── FORM or KEEP EARNING ── */}
      {canWithdraw ? (
        <div style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderLeft: "4px solid #A8FF3E",
          borderRadius: 16,
          padding: "24px 20px",
        }}>
          <div style={{
            fontSize: 15, fontWeight: 700,
            color: "#0A0A0F", marginBottom: 20,
          }}>
            Request Withdrawal
          </div>

          {/* POINTS INPUT */}
          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 12, fontWeight: 600,
              color: "#6B7280", marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              Points to Withdraw
            </div>
            <input
              type="number"
              placeholder={"Min " + MIN_POINTS + " pts"}
              value={requestPoints}
              onChange={function (e) { setRequestPoints(e.target.value); }}
              min={MIN_POINTS}
              max={points}
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                fontSize: 15,
                fontFamily: "var(--font-body)",
                color: "#0A0A0F",
                background: "#FAFAFA",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            {pointsNum > 0 && pointsNum < MIN_POINTS && (
              <div style={{ fontSize: 12, color: "#EF4444", marginTop: 6 }}>
                Minimum is {MIN_POINTS.toLocaleString()} points.
              </div>
            )}
            {pointsNum > points && (
              <div style={{ fontSize: 12, color: "#EF4444", marginTop: 6 }}>
                You don't have enough points.
              </div>
            )}
            {pointsNum >= MIN_POINTS && pointsNum <= points && (
              <div style={{ fontSize: 13, color: "#7ACC20", marginTop: 6, fontWeight: 600 }}>
                ≈ {symbol}{estimatedValue}
              </div>
            )}
          </div>

          {/* METHOD */}
          <div style={{ marginBottom: 16 }}>
            <div style={{
              fontSize: 12, fontWeight: 600,
              color: "#6B7280", marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              Payment Method
            </div>
            <select
              value={method}
              onChange={function (e) { setMethod(e.target.value); }}
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                fontSize: 15,
                fontFamily: "var(--font-body)",
                color: method ? "#0A0A0F" : "#9CA3AF",
                background: "#FAFAFA",
                outline: "none",
                boxSizing: "border-box",
              }}
            >
              <option value="">Select method...</option>
              {METHODS.map(function (m) {
                return <option key={m} value={m}>{m}</option>;
              })}
            </select>
          </div>

          {/* ACCOUNT DETAILS */}
          <div style={{ marginBottom: 20 }}>
            <div style={{
              fontSize: 12, fontWeight: 600,
              color: "#6B7280", marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}>
              Account Details
            </div>
            <textarea
              placeholder="Enter your PayPal email, account number, or mobile money number..."
              value={accountDetails}
              onChange={function (e) { setAccountDetails(e.target.value); }}
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1px solid #E5E7EB",
                borderRadius: 8,
                fontSize: 14,
                fontFamily: "var(--font-body)",
                color: "#0A0A0F",
                background: "#FAFAFA",
                outline: "none",
                minHeight: 90,
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 6 }}>
              Double-check your details. We are not responsible for incorrect transfers.
            </div>
          </div>

          {/* SUBMIT */}
          <button
            onClick={handleSubmit}
            disabled={!validRequest || loading}
            style={{
              width: "100%",
              padding: "13px",
              background: validRequest && !loading ? "#A8FF3E" : "#E5E7EB",
              border: "none",
              borderRadius: 8,
              fontSize: 15,
              fontWeight: 700,
              color: validRequest && !loading ? "#0D0D14" : "#9CA3AF",
              fontFamily: "var(--font-body)",
              cursor: validRequest && !loading ? "pointer" : "not-allowed",
              transition: "all 0.15s",
            }}
          >
            {loading ? "Submitting..." : "Submit Withdrawal Request →"}
          </button>
        </div>

      ) : (
        <div style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderLeft: "4px solid #F59E0B",
          borderRadius: 16,
          padding: "40px 24px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🎯</div>
          <div style={{
            fontSize: 17, fontWeight: 700,
            color: "#0A0A0F", marginBottom: 8,
          }}>
            Keep Earning!
          </div>
          <div style={{
            fontSize: 13, color: "#6B7280",
            marginBottom: 20, lineHeight: 1.7,
          }}>
            You need{" "}
            <strong style={{ color: "#0A0A0F" }}>
              {(MIN_POINTS - points).toLocaleString()} more points
            </strong>{" "}
            to unlock withdrawals.
          </div>
          <button
            onClick={function () { navigate("tasks"); }}
            style={{
              background: "#A8FF3E",
              border: "none",
              borderRadius: 8,
              padding: "11px 28px",
              fontSize: 14,
              fontWeight: 700,
              color: "#0D0D14",
              fontFamily: "var(--font-body)",
              cursor: "pointer",
            }}
          >
            Browse Tasks →
          </button>
        </div>
      )}

      <div style={{ height: 48 }} />
    </div>
  );
}
