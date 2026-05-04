import { useState } from "react";
import { supabase } from "../lib/supabase.js";

const RATES = [
  { code: "NG", flag: "🇳🇬", name: "Nigeria", currency: "NGN", symbol: "₦", rate: 0.45, per: 1000 },
  { code: "US", flag: "🇺🇸", name: "United States", currency: "USD", symbol: "$", rate: 1.20, per: 1000 },
  { code: "GB", flag: "🇬🇧", name: "United Kingdom", currency: "GBP", symbol: "£", rate: 0.90, per: 1000 },
  { code: "CA", flag: "🇨🇦", name: "Canada", currency: "CAD", symbol: "$", rate: 1.10, per: 1000 },
  { code: "AU", flag: "🇦🇺", name: "Australia", currency: "AUD", symbol: "$", rate: 1.05, per: 1000 },
  { code: "GH", flag: "🇬🇭", name: "Ghana", currency: "GHS", symbol: "₵", rate: 0.60, per: 1000 },
  { code: "KE", flag: "🇰🇪", name: "Kenya", currency: "KES", symbol: "KSh", rate: 0.55, per: 1000 },
  { code: "ZA", flag: "🇿🇦", name: "South Africa", currency: "ZAR", symbol: "R", rate: 0.65, per: 1000 },
  { code: "OTHER", flag: "🌍", name: "Other Regions", currency: "USD", symbol: "$", rate: 0.80, per: 1000 },
];

const MIN_POINTS = 2000;

const METHODS = ["Paystack", "Flutterwave", "Bank Transfer", "Mobile Money"];

export default function Withdraw({ user, setUser, navigate, showToast }) {

  var [points, setPoints] = useState(user ? (user.points || 0) : 0);
  var [requestPoints, setRequestPoints] = useState("");
  var [method, setMethod] = useState("");
  var [accountDetails, setAccountDetails] = useState("");
  var [loading, setLoading] = useState(false);
  var [submitted, setSubmitted] = useState(false);

  // Find user's rate
  var userCode = user ? (user.country || "OTHER") : "OTHER";
  var userRate = RATES.find(function (r) { return r.code === userCode; })
    || RATES.find(function (r) { return r.code === "OTHER"; });

  var pointsNum = parseInt(requestPoints) || 0;
  var estimatedValue = ((pointsNum / userRate.per) * userRate.rate).toFixed(2);
  var canWithdraw = points >= MIN_POINTS;
  var validRequest = pointsNum >= MIN_POINTS && pointsNum <= points && method && accountDetails.length > 5;

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
      });

    if (result.error) {
      showToast("Something went wrong. Please try again.", "error");
      setLoading(false);
      return;
    }

    // Deduct points from profile
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

  // ── SUCCESS ──
  if (submitted) {
    return (
      <div style={{ padding: "36px 32px", maxWidth: 600, fontFamily: "var(--font-body)" }}>
        <div style={{
          background: "#fff", border: "1px solid #E5E7EB",
          borderRadius: 24, padding: "60px 40px",
          textAlign: "center", boxShadow: "0 8px 40px rgba(0,0,0,0.07)",
        }}>
          <div style={{ fontSize: 60, marginBottom: 20 }}>✅</div>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 26, fontWeight: 700,
            color: "#0A0A0F", marginBottom: 12,
          }}>
            Request Submitted!
          </div>
          <div style={{ fontSize: 15, color: "#6B7280", marginBottom: 8, lineHeight: 1.7 }}>
            Your withdrawal of <strong>{pointsNum.toLocaleString()} pts</strong> via{" "}
            <strong>{method}</strong> is now pending admin approval.
          </div>
          <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 32 }}>
            You will be notified once it is processed. Usually within 24–48 hours.
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-primary" onClick={function () { navigate("wallet"); }}>
              View Wallet
            </button>
            <button className="btn btn-outline" onClick={function () { navigate("tasks"); }}>
              Earn More →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "36px 32px", maxWidth: 800, fontFamily: "var(--font-body)" }}>

      {/* ── HEADER ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 30, fontWeight: 700,
          color: "#0A0A0F", marginBottom: 6,
          letterSpacing: "-0.5px",
        }}>
          Withdraw Points
        </div>
        <div style={{ fontSize: 15, color: "#6B7280" }}>
          Convert your points to cash. Minimum withdrawal is {MIN_POINTS.toLocaleString()} points.
        </div>
      </div>

      {/* ── BALANCE CARD ── */}
      <div style={{
        background: "linear-gradient(135deg, #1A1A2E 0%, #2D2D44 100%)",
        borderRadius: 20, padding: "28px 32px",
        marginBottom: 24, position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: -60, right: -60,
          width: 200, height: 200,
          background: "radial-gradient(circle, rgba(168,255,62,0.12), transparent 70%)",
          borderRadius: "50%", pointerEvents: "none",
        }} />
        <div style={{
          fontSize: 11, fontWeight: 700,
          letterSpacing: "1.8px", textTransform: "uppercase",
          color: "rgba(255,255,255,0.4)", marginBottom: 8,
        }}>
          Your Balance
        </div>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: 52, fontWeight: 700,
          color: "#A8FF3E", lineHeight: 1,
          letterSpacing: "-2px",
        }}>
          {points.toLocaleString()}
          <span style={{ fontSize: 18, color: "rgba(255,255,255,0.4)", marginLeft: 8 }}>pts</span>
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

      {/* ── CONVERSION RATES TABLE ── */}
      <div style={{
        background: "#fff", border: "1px solid #E5E7EB",
        borderRadius: 20, padding: "24px",
        marginBottom: 28, boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
      }}>
        <div style={{
          fontFamily: "var(--font-heading)",
          fontSize: 16, fontWeight: 700,
          color: "#0A0A0F", marginBottom: 6,
        }}>
          Point Conversion Rates
        </div>
        <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 18 }}>
          Rates are per 1,000 points. Your region is highlighted.
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {RATES.map(function (r) {
            var isUser = r.code === userCode;
            return (
              <div key={r.code} style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 16px",
                borderRadius: 12,
                background: isUser
                  ? "rgba(168,255,62,0.08)"
                  : "#FAFAFA",
                border: isUser
                  ? "1.5px solid rgba(168,255,62,0.35)"
                  : "1px solid #F3F4F6",
                transition: "all 0.15s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{r.flag}</span>
                  <div>
                    <div style={{
                      fontSize: 13, fontWeight: 600,
                      color: "#0A0A0F",
                    }}>
                      {r.name}
                      {isUser && (
                        <span style={{
                          marginLeft: 8, fontSize: 10,
                          fontWeight: 700, color: "#7ACC20",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                        }}>
                          ← Your Region
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>{r.currency}</div>
                  </div>
                </div>
                <div style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: 15, fontWeight: 700,
                  color: isUser ? "#7ACC20" : "#0A0A0F",
                }}>
                  {r.symbol}{r.rate.toFixed(2)}
                  <span style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 400 }}> / 1k pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── WITHDRAWAL FORM ── */}
      {canWithdraw ? (
        <div style={{
          background: "#fff", border: "1px solid #E5E7EB",
          borderRadius: 20, padding: "28px 24px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <div style={{
            fontFamily: "var(--font-heading)",
            fontSize: 16, fontWeight: 700,
            color: "#0A0A0F", marginBottom: 20,
          }}>
            Request Withdrawal
          </div>

          {/* POINTS AMOUNT */}
          <div className="form-group">
            <label className="form-label">Points to Withdraw</label>
            <input
              className="form-input"
              type="number"
              placeholder={"Min " + MIN_POINTS + " pts"}
              value={requestPoints}
              onChange={function (e) { setRequestPoints(e.target.value); }}
              min={MIN_POINTS}
              max={points}
            />
            {pointsNum > 0 && pointsNum < MIN_POINTS && (
              <div className="form-error">Minimum is {MIN_POINTS.toLocaleString()} points.</div>
            )}
            {pointsNum > points && (
              <div className="form-error">You don't have enough points.</div>
            )}
            {pointsNum >= MIN_POINTS && pointsNum <= points && (
              <div style={{ fontSize: 13, color: "#7ACC20", marginTop: 6, fontWeight: 600 }}>
                ≈ {userRate.symbol}{estimatedValue} {userRate.currency}
              </div>
            )}
          </div>

          {/* METHOD */}
          <div className="form-group">
            <label className="form-label">Payment Method</label>
            <select
              className="form-select"
              value={method}
              onChange={function (e) { setMethod(e.target.value); }}
            >
              <option value="">Select method...</option>
              {METHODS.map(function (m) {
                return <option key={m} value={m}>{m}</option>;
              })}
            </select>
          </div>

          {/* ACCOUNT DETAILS */}
          <div className="form-group">
            <label className="form-label">Account Details</label>
            <textarea
              className="form-textarea"
              placeholder="Enter your account number, bank name, or mobile money number..."
              value={accountDetails}
              onChange={function (e) { setAccountDetails(e.target.value); }}
              style={{ minHeight: 90 }}
            />
            <div className="form-hint">
              Make sure your details are correct. We are not responsible for wrong transfers.
            </div>
          </div>

          {/* SUBMIT */}
          <button
            className="btn btn-primary btn-lg"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={handleSubmit}
            disabled={!validRequest || loading}
          >
            {loading ? "Submitting..." : "Submit Withdrawal Request →"}
          </button>
        </div>
      ) : (
        <div style={{
          background: "#fff", border: "1px solid #E5E7EB",
          borderRadius: 20, padding: "48px 24px",
          textAlign: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🎯</div>
          <div style={{
            fontFamily: "var(--font-heading)",
            fontSize: 18, fontWeight: 700,
            color: "#0A0A0F", marginBottom: 8,
          }}>
            Keep Earning!
          </div>
          <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 24, lineHeight: 1.7 }}>
            You need <strong style={{ color: "#0A0A0F" }}>{(MIN_POINTS - points).toLocaleString()} more points</strong> to
            unlock withdrawals. Complete more tasks to reach the minimum.
          </div>
          <button className="btn btn-primary" onClick={function () { navigate("tasks"); }}>
            Browse Tasks →
          </button>
        </div>
      )}

      <div style={{ height: 48 }} />
    </div>
  );
}
