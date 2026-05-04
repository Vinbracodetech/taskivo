import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase.js";

export default function TaskPlayer({ task, navigate, user, setUser, showToast }) {

  var [phase, setPhase] = useState("watching");
  var [timeLeft, setTimeLeft] = useState(task.required_time || 60);
  var [timerDone, setTimerDone] = useState(false);
  var [answers, setAnswers] = useState({});
  var [rating, setRating] = useState(0);
  var [feedback, setFeedback] = useState("");
  var [tabWarning, setTabWarning] = useState(false);
  var [submitting, setSubmitting] = useState(false);
  var timerRef = useRef(null);

  var requiredTime = task.required_time || 60;
  var pct = Math.round(((requiredTime - timeLeft) / requiredTime) * 100);

  // ── TIMER ──
  useEffect(function () {
    if (phase !== "watching" || timerDone) return;
    timerRef.current = setInterval(function () {
      setTimeLeft(function (p) {
        if (p <= 1) {
          clearInterval(timerRef.current);
          setTimerDone(true);
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return function () { clearInterval(timerRef.current); };
  }, [phase, timerDone]);

  // ── TAB SWITCH DETECTION ──
  useEffect(function () {
    function onVisibility() {
      if (document.hidden && phase === "watching") {
        setTabWarning(true);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);
    return function () {
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [phase]);

  // ── SUBMIT ──
  async function submitTask() {
    if (task.type === "mcq") {
      var questions = task.questions || [];
      var allAnswered = questions.every(function (q) {
        return answers[q.id] !== undefined;
      });
      if (!allAnswered) {
        showToast("Please answer all questions.", "error");
        return;
      }
    }
    if (task.type === "rating" && rating === 0) {
      showToast("Please select a star rating.", "error");
      return;
    }
    if (task.type === "feedback" && feedback.trim().length < 20) {
      showToast("Please write at least 20 characters.", "error");
      return;
    }

    setSubmitting(true);

    // Save completion to Supabase
    var completionResult = await supabase
      .from("completions")
      .insert({
        user_id: user.id,
        task_id: task.id,
        answers: answers,
        rating: rating,
        feedback: feedback,
      });

    if (completionResult.error) {
      showToast("Something went wrong. Please try again.", "error");
      setSubmitting(false);
      return;
    }

    // Add points to profile
    var newPoints = (user.points || 0) + (task.reward || 0);
    await supabase
      .from("profiles")
      .update({ points: newPoints })
      .eq("id", user.id);

    // Update completed_slots on task
    await supabase
      .from("tasks")
      .update({ completed_slots: (task.completed_slots || 0) + 1 })
      .eq("id", task.id);

    // Update local user state
    if (setUser) {
      setUser(function (prev) {
        return { ...prev, points: newPoints };
      });
    }

    setSubmitting(false);
    setPhase("success");
    showToast("🎉 +" + task.reward + " points earned!", "success");
  }

  // ── SUCCESS SCREEN ──
  if (phase === "success") {
    return (
      <div className="page animate-slideUp" style={{ maxWidth: 600 }}>
        <div style={{
          background: "#fff",
          border: "1px solid #E5E7EB",
          borderRadius: 24,
          padding: "60px 40px",
          textAlign: "center",
          boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
        }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 28, fontWeight: 700,
            color: "#0A0A0F", marginBottom: 12,
          }}>
            Task Complete!
          </div>
          <div style={{ fontSize: 15, color: "#6B7280", marginBottom: 28 }}>
            You just earned
          </div>
          <div style={{
            fontFamily: "var(--font-display)",
            fontSize: 64, fontWeight: 700,
            color: "#A8FF3E",
            background: "linear-gradient(135deg, #1A1A2E, #2D2D44)",
            borderRadius: 20,
            padding: "28px 40px",
            marginBottom: 32,
            display: "inline-block",
          }}>
            +{task.reward} pts
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={function () { navigate("tasks"); }}
            >
              Find More Tasks →
            </button>
            <button
              className="btn btn-outline btn-lg"
              onClick={function () { navigate("user-dashboard"); }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page animate-slideUp" style={{ maxWidth: 820 }}>

      {/* ── BACK BUTTON ── */}
      <button
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: 20 }}
        onClick={function () { navigate("tasks"); }}
      >
        ← Back to Tasks
      </button>

      {/* ── TASK TITLE ── */}
      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: 22, fontWeight: 700,
        color: "#0A0A0F", marginBottom: 6,
      }}>
        {task.title}
      </div>
      <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>
        {task.description}
      </div>

      {/* ── TAB WARNING ── */}
      {tabWarning && (
        <div style={{
          background: "rgba(245,158,11,0.1)",
          border: "1px solid rgba(245,158,11,0.35)",
          borderRadius: 10,
          padding: "12px 16px",
          fontSize: 13,
          color: "#92400E",
          marginBottom: 20,
          fontWeight: 500,
        }}>
          ⚠️ Warning: You switched tabs. Please stay on this page while watching.
        </div>
      )}

      {/* ── VIDEO ── */}
      {phase === "watching" && (
        <>
          <div style={{
            background: "#000",
            borderRadius: 16,
            overflow: "hidden",
            aspectRatio: "16/9",
            marginBottom: 20,
            position: "relative",
          }}>
            {task.video_url ? (
              <iframe
                src={task.video_url}
                style={{ width: "100%", height: "100%", border: "none" }}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                title={task.title}
              />
            ) : (
              <div style={{
                width: "100%", height: "100%",
                display: "flex", alignItems: "center",
                justifyContent: "center", color: "#fff",
                flexDirection: "column", gap: 12,
              }}>
                <div style={{ fontSize: 48 }}>▶</div>
                <div style={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
                  Video will appear here
                </div>
              </div>
            )}
          </div>

          {/* ── TIMER ── */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "linear-gradient(135deg, #1A1A2E, #2D2D44)",
            borderRadius: 14,
            padding: "16px 22px",
            marginBottom: 20,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "rgba(168,255,62,0.12)",
              border: "2.5px solid #A8FF3E",
              display: "flex", alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-heading)",
              fontSize: 18, fontWeight: 800,
              color: "#A8FF3E", flexShrink: 0,
            }}>
              {timeLeft}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 11, fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.4)",
                marginBottom: 6,
              }}>
                {timerDone ? "Watch time complete!" : "Watch time remaining"}
              </div>
              <div style={{
                height: 6, background: "rgba(255,255,255,0.1)",
                borderRadius: 99, overflow: "hidden",
              }}>
                <div style={{
                  height: "100%",
                  width: pct + "%",
                  background: "#A8FF3E",
                  borderRadius: 99,
                  transition: "width 1s linear",
                }} />
              </div>
            </div>
            <button
              className="btn btn-primary"
              disabled={!timerDone}
              onClick={function () { setPhase("questions"); }}
              style={{ flexShrink: 0 }}
            >
              {timerDone ? "Continue →" : "Watching..."}
            </button>
          </div>
        </>
      )}

      {/* ── QUESTIONS PHASE ── */}
      {phase === "questions" && (
        <div>
          <div style={{
            fontFamily: "var(--font-heading)",
            fontSize: 18, fontWeight: 700,
            color: "#0A0A0F", marginBottom: 20,
          }}>
            {task.type === "mcq" && "Answer the Questions"}
            {task.type === "rating" && "Rate This Content"}
            {task.type === "feedback" && "Write Your Feedback"}
            {!task.type && "Complete the Task"}
          </div>

          {/* MCQ */}
          {task.type === "mcq" && (task.questions || []).map(function (q) {
            return (
              <div key={q.id} style={{
                background: "#FAFAFA",
                border: "1px solid #E5E7EB",
                borderRadius: 14, padding: 20,
                marginBottom: 16,
              }}>
                <div style={{
                  fontWeight: 600, fontSize: 15,
                  color: "#0A0A0F", marginBottom: 14,
                }}>
                  {q.text}
                </div>
                {(q.options || []).map(function (opt, i) {
                  var selected = answers[q.id] === i;
                  return (
                    <div
                      key={i}
                      onClick={function () {
                        setAnswers(function (prev) {
                          return { ...prev, [q.id]: i };
                        });
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "11px 14px",
                        border: selected
                          ? "1.5px solid #7ACC20"
                          : "1.5px solid #E5E7EB",
                        borderRadius: 10,
                        cursor: "pointer",
                        fontSize: 14,
                        marginBottom: 8,
                        background: selected
                          ? "rgba(168,255,62,0.08)"
                          : "#fff",
                        transition: "all 0.15s",
                        fontWeight: selected ? 600 : 400,
                        color: "#0A0A0F",
                      }}
                    >
                      <div style={{
                        width: 18, height: 18,
                        borderRadius: "50%",
                        border: selected
                          ? "5px solid #7ACC20"
                          : "2px solid #D1D5DB",
                        flexShrink: 0,
                        transition: "all 0.15s",
                      }} />
                      {opt}
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* RATING */}
          {task.type === "rating" && (
            <div style={{
              background: "#FAFAFA",
              border: "1px solid #E5E7EB",
              borderRadius: 14, padding: 28,
              marginBottom: 16, textAlign: "center",
            }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 20 }}>
                How would you rate this content?
              </div>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                {[1, 2, 3, 4, 5].map(function (star) {
                  return (
                    <span
                      key={star}
                      onClick={function () { setRating(star); }}
                      style={{
                        fontSize: 38,
                        cursor: "pointer",
                        filter: star <= rating
                          ? "none"
                          : "grayscale(1) opacity(0.35)",
                        transform: star <= rating ? "scale(1.15)" : "scale(1)",
                        transition: "all 0.15s",
                      }}
                    >
                      ⭐
                    </span>
                  );
                })}
              </div>
              {rating > 0 && (
                <div style={{ marginTop: 12, fontSize: 13, color: "#7ACC20", fontWeight: 600 }}>
                  {rating === 5 && "Excellent!"}
                  {rating === 4 && "Very Good"}
                  {rating === 3 && "Good"}
                  {rating === 2 && "Fair"}
                  {rating === 1 && "Poor"}
                </div>
              )}
            </div>
          )}

          {/* FEEDBACK */}
          {task.type === "feedback" && (
            <div style={{
              background: "#FAFAFA",
              border: "1px solid #E5E7EB",
              borderRadius: 14, padding: 20,
              marginBottom: 16,
            }}>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>
                Share your honest feedback
              </div>
              <textarea
                className="form-textarea"
                placeholder="Write at least 20 characters about what you watched..."
                value={feedback}
                onChange={function (e) { setFeedback(e.target.value); }}
                style={{ minHeight: 120 }}
              />
              <div style={{
                fontSize: 12,
                color: feedback.length >= 20 ? "#7ACC20" : "#9CA3AF",
                marginTop: 6,
              }}>
                {feedback.length} characters
                {feedback.length < 20 && " (minimum 20)"}
              </div>
            </div>
          )}

          {/* SUBMIT */}
          <button
            className="btn btn-primary btn-lg"
            style={{ width: "100%", justifyContent: "center" }}
            onClick={submitTask}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit & Earn " + task.reward + " pts →"}
          </button>
        </div>
      )}

    </div>
  );
        }
