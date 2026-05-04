import { useState } from "react";
import { supabase } from "../lib/supabase.js";

const CATEGORIES = ["Technology", "E-commerce", "Food & Cooking", "Business", "Social Media", "Health", "Education", "Entertainment"];
const TYPES = [
  { value: "mcq", label: "📝 Quiz (Multiple Choice)" },
  { value: "rating", label: "⭐ Star Rating" },
  { value: "feedback", label: "✍️ Written Feedback" },
];

export default function CreateTask({ navigate, showToast, user }) {

  var [form, setForm] = useState({
    title: "",
    description: "",
    video_url: "",
    reward: "",
    total_slots: "",
    required_time: "",
    type: "rating",
    category: "Technology",
  });
  var [loading, setLoading] = useState(false);
  var [errors, setErrors] = useState({});

  function handleChange(e) {
    setForm(function (prev) {
      return { ...prev, [e.target.name]: e.target.value };
    });
    setErrors(function (prev) {
      return { ...prev, [e.target.name]: "" };
    });
  }

  function validate() {
    var e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.description.trim()) e.description = "Description is required.";
    if (!form.video_url.trim()) e.video_url = "Video URL is required.";
    if (!form.reward || parseInt(form.reward) < 10) e.reward = "Minimum reward is 10 points.";
    if (!form.total_slots || parseInt(form.total_slots) < 1) e.total_slots = "At least 1 slot required.";
    if (!form.required_time || parseInt(form.required_time) < 10) e.required_time = "Minimum watch time is 10 seconds.";
    return e;
  }

  async function handleSubmit() {
    var e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      showToast("Please fix the errors below.", "error");
      return;
    }
    setLoading(true);

    var result = await supabase.from("tasks").insert({
      title: form.title.trim(),
      description: form.description.trim(),
      video_url: form.video_url.trim(),
      reward: parseInt(form.reward),
      total_slots: parseInt(form.total_slots),
      completed_slots: 0,
      required_time: parseInt(form.required_time),
      type: form.type,
      category: form.category,
      creator_id: user.id,
      status: "pending",
    });

    if (result.error) {
      showToast("Failed to create task. Try again.", "error");
      setLoading(false);
      return;
    }

    showToast("Task submitted for review! 🎉", "success");
    setLoading(false);
    navigate("creator-tasks");
  }

  function Field({ label, name, type, placeholder, hint, as }) {
    return (
      <div className="form-group">
        <label className="form-label">{label}</label>
        {as === "textarea" ? (
          <textarea
            className="form-textarea"
            name={name}
            placeholder={placeholder}
            value={form[name]}
            onChange={handleChange}
          />
        ) : as === "select" ? null : (
          <input
            className="form-input"
            type={type || "text"}
            name={name}
            placeholder={placeholder}
            value={form[name]}
            onChange={handleChange}
          />
        )}
        {hint && <div className="form-hint">{hint}</div>}
        {errors[name] && <div className="form-error">{errors[name]}</div>}
      </div>
    );
  }

  return (
    <div style={{ padding: "36px 32px", maxWidth: 720, fontFamily: "var(--font-body)" }}>

      {/* HEADER */}
      <button className="btn btn-ghost btn-sm" style={{ marginBottom: 20 }} onClick={function () { navigate("creator-dashboard"); }}>
        ← Back
      </button>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700, color: "#0A0A0F", marginBottom: 6, letterSpacing: "-0.5px" }}>
        Post a New Task
      </div>
      <div style={{ fontSize: 15, color: "#6B7280", marginBottom: 32 }}>
        Tasks are reviewed by admin before going live. Usually within 24 hours.
      </div>

      <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 20, padding: "28px 24px", boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>

        {/* TITLE */}
        <div className="form-group">
          <label className="form-label">Task Title</label>
          <input className="form-input" name="title" placeholder="e.g. Watch & Review Our Product Demo" value={form.title} onChange={handleChange} />
          {errors.title && <div className="form-error">{errors.title}</div>}
        </div>

        {/* DESCRIPTION */}
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-textarea" name="description" placeholder="Tell earners what this task is about and what kind of feedback you need..." value={form.description} onChange={handleChange} />
          {errors.description && <div className="form-error">{errors.description}</div>}
        </div>

        {/* VIDEO URL */}
        <div className="form-group">
          <label className="form-label">Video URL</label>
          <input className="form-input" name="video_url" placeholder="https://www.youtube.com/embed/..." value={form.video_url} onChange={handleChange} />
          <div className="form-hint">Use the YouTube embed URL format: youtube.com/embed/VIDEO_ID</div>
          {errors.video_url && <div className="form-error">{errors.video_url}</div>}
        </div>

        {/* ROW: REWARD + SLOTS */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Points Per Completion</label>
            <input className="form-input" type="number" name="reward" placeholder="e.g. 250" value={form.reward} onChange={handleChange} min="10" />
            {errors.reward && <div className="form-error">{errors.reward}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Total Slots</label>
            <input className="form-input" type="number" name="total_slots" placeholder="e.g. 100" value={form.total_slots} onChange={handleChange} min="1" />
            {errors.total_slots && <div className="form-error">{errors.total_slots}</div>}
          </div>
        </div>

        {/* ROW: TIME + CATEGORY */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Required Watch Time (seconds)</label>
            <input className="form-input" type="number" name="required_time" placeholder="e.g. 90" value={form.required_time} onChange={handleChange} min="10" />
            <div className="form-hint">Minimum 10 seconds</div>
            {errors.required_time && <div className="form-error">{errors.required_time}</div>}
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" name="category" value={form.category} onChange={handleChange}>
              {CATEGORIES.map(function (c) {
                return <option key={c} value={c}>{c}</option>;
              })}
            </select>
          </div>
        </div>

        {/* TASK TYPE */}
        <div className="form-group">
          <label className="form-label">Task Type</label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {TYPES.map(function (t) {
              var selected = form.type === t.value;
              return (
                <div
                  key={t.value}
                  onClick={function () { setForm(function (p) { return { ...p, type: t.value }; }); }}
                  style={{
                    padding: "12px 16px",
                    borderRadius: 10,
                    border: selected ? "1.5px solid #7ACC20" : "1.5px solid #E5E7EB",
                    background: selected ? "rgba(168,255,62,0.07)" : "#fff",
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: selected ? 600 : 400,
                    color: "#0A0A0F",
                    transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: 10,
                  }}
                >
                  <div style={{
                    width: 16, height: 16, borderRadius: "50%",
                    border: selected ? "5px solid #7ACC20" : "2px solid #D1D5DB",
                    flexShrink: 0, transition: "all 0.15s",
                  }} />
                  {t.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* COST ESTIMATE */}
        {form.reward && form.total_slots && (
          <div style={{
            background: "rgba(168,255,62,0.07)",
            border: "1px solid rgba(168,255,62,0.25)",
            borderRadius: 12, padding: "14px 16px",
            fontSize: 14, color: "#5A8A00",
            marginBottom: 20, fontWeight: 500,
          }}>
            💡 Total budget needed: <strong>{(parseInt(form.reward) * parseInt(form.total_slots)).toLocaleString()} points</strong> if all slots are filled.
          </div>
        )}

        <button
          className="btn btn-primary btn-lg"
          style={{ width: "100%", justifyContent: "center" }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Task for Review →"}
        </button>

      </div>
      <div style={{ height: 48 }} />
    </div>
  );
}
