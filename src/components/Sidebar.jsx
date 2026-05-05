import { useState } from "react";

export default function Sidebar({ user, view, navigate, logout }) {
  var [drawerOpen, setDrawerOpen] = useState(false);

  var role = user ? user.role : "earner";

  var earnerLinks = [
    { icon: "⚡", label: "Dashboard", view: "user-dashboard" },
    { icon: "🎯", label: "Tasks",     view: "tasks" },
    { icon: "👛", label: "Wallet",    view: "wallet" },
    { icon: "💸", label: "Withdraw",  view: "withdraw" },
  ];

  var creatorLinks = [
    { icon: "⚡", label: "Dashboard",   view: "creator-dashboard" },
    { icon: "✦",  label: "Create Task", view: "create-task" },
    { icon: "📋", label: "My Tasks",    view: "creator-tasks" },
    { icon: "📊", label: "Analytics",   view: "creator-analytics" },
  ];

  var adminLinks = [
    { icon: "⚡", label: "Overview",    view: "admin-dashboard" },
    { icon: "👥", label: "Users",       view: "admin-users" },
    { icon: "📋", label: "Tasks",       view: "admin-tasks" },
    { icon: "💸", label: "Withdrawals", view: "admin-withdrawals" },
  ];

  var links = role === "admin"
    ? adminLinks
    : role === "creator"
    ? creatorLinks
    : earnerLinks;

  var initials = user && user.full_name
    ? user.full_name.split(" ").map(function (w) { return w[0]; }).join("").toUpperCase().slice(0, 2)
    : "U";

  // ── DRAWER ──
  var overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 200,
    opacity: drawerOpen ? 1 : 0,
    pointerEvents: drawerOpen ? "auto" : "none",
    transition: "opacity 0.25s ease",
  };

  var drawerStyle = {
    position: "fixed",
    top: 0,
    right: 0,
    bottom: 0,
    width: 288,
    background: "#0D0D14",
    zIndex: 201,
    transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
    transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
    display: "flex",
    flexDirection: "column",
    boxShadow: "-8px 0 48px rgba(0,0,0,0.5)",
  };

  function drawerLinkStyle(active) {
    return {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "13px 24px",
      cursor: "pointer",
      background: active ? "rgba(168,255,62,0.08)" : "transparent",
      borderLeft: active ? "3px solid #A8FF3E" : "3px solid transparent",
      color: active ? "#A8FF3E" : "rgba(255,255,255,0.6)",
      fontSize: 15,
      fontWeight: active ? 700 : 500,
      fontFamily: "var(--font-body)",
      transition: "all 0.15s",
      userSelect: "none",
    };
  }

  // ── BOTTOM NAV ──
  var bottomNavStyle = {
    position: "fixed",
    bottom: 16,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 150,
    display: "flex",
    alignItems: "center",
    gap: 2,
    background: "#0D0D14",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 40,
    padding: "8px 10px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2)",
  };

  function bottomItemStyle(active) {
    return {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 3,
      padding: "6px 12px",
      borderRadius: 28,
      cursor: "pointer",
      background: active ? "rgba(168,255,62,0.13)" : "transparent",
      transition: "all 0.18s",
      minWidth: 50,
      userSelect: "none",
    };
  }

  function bottomLabelStyle(active) {
    return {
      fontSize: 10,
      fontWeight: active ? 700 : 500,
      color: active ? "#A8FF3E" : "rgba(255,255,255,0.4)",
      fontFamily: "var(--font-body)",
      whiteSpace: "nowrap",
    };
  }

  return (
    <>
      {/* ── DRAWER OVERLAY ── */}
      <div style={overlayStyle} onClick={function () { setDrawerOpen(false); }} />

      {/* ── DRAWER ── */}
      <div style={drawerStyle}>

        {/* Drawer top — user info */}
        <div style={{
          padding: "24px 24px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: "#A8FF3E",
                color: "#0D0D14",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 15,
                fontWeight: 800,
                fontFamily: "var(--font-body)",
                flexShrink: 0,
              }}>
                {initials}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 2 }}>
                  {user ? (user.full_name || "User") : ""}
                </div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
                  {user ? user.email : ""}
                </div>
              </div>
            </div>
            <button
              onClick={function () { setDrawerOpen(false); }}
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "none",
                borderRadius: 8,
                color: "rgba(255,255,255,0.6)",
                width: 30,
                height: 30,
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>

          {/* Role badge */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              background: role === "admin" ? "rgba(239,68,68,0.15)"
                : role === "creator" ? "rgba(59,130,246,0.15)"
                : "rgba(168,255,62,0.12)",
              color: role === "admin" ? "#EF4444"
                : role === "creator" ? "#60A5FA"
                : "#A8FF3E",
              border: "1px solid " + (
                role === "admin" ? "rgba(239,68,68,0.3)"
                : role === "creator" ? "rgba(59,130,246,0.3)"
                : "rgba(168,255,62,0.25)"
              ),
              fontSize: 11,
              fontWeight: 700,
              padding: "3px 10px",
              borderRadius: 20,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              fontFamily: "var(--font-body)",
            }}>
              {role}
            </span>
          </div>
        </div>

        {/* Points card — earner only */}
        {role === "earner" && (
          <div style={{ padding: "16px 24px" }}>
            <div style={{
              background: "rgba(168,255,62,0.07)",
              border: "1px solid rgba(168,255,62,0.15)",
              borderRadius: 12,
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  Your Points
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: "#A8FF3E", fontFamily: "var(--font-body)" }}>
                  {user ? (user.points || 0).toLocaleString() : 0}
                </div>
              </div>
              <span style={{ fontSize: 26 }}>💰</span>
            </div>
          </div>
        )}

        {/* Nav links */}
        <div style={{ flex: 1, paddingTop: 8, overflowY: "auto" }}>
          {links.map(function (link) {
            var active = view === link.view;
            return (
              <div
                key={link.view}
                style={drawerLinkStyle(active)}
                onClick={function () { navigate(link.view); setDrawerOpen(false); }}
              >
                <span style={{ fontSize: 18, width: 22, textAlign: "center" }}>{link.icon}</span>
                <span>{link.label}</span>
                {active && (
                  <span style={{
                    marginLeft: "auto",
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#A8FF3E",
                    flexShrink: 0,
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Logout */}
        <div style={{ padding: "16px 24px 32px" }}>
          <button
            onClick={function () { logout(); setDrawerOpen(false); }}
            style={{
              width: "100%",
              padding: "13px",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.18)",
              borderRadius: 12,
              color: "#EF4444",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "var(--font-body)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            🚪 Log Out
          </button>
        </div>
      </div>

      {/* ── FLOATING BOTTOM NAV ── */}
      <div style={bottomNavStyle}>
        {links.map(function (link) {
          var active = view === link.view;
          return (
            <div
              key={link.view}
              style={bottomItemStyle(active)}
              onClick={function () { navigate(link.view); }}
            >
              <span style={{
                fontSize: 18,
                lineHeight: 1,
                opacity: active ? 1 : 0.5,
              }}>
                {link.icon}
              </span>
              <span style={bottomLabelStyle(active)}>{link.label}</span>
              {active && (
                <div style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "#A8FF3E",
                }} />
              )}
            </div>
          );
        })}

        {/* Divider */}
        <div style={{
          width: 1,
          height: 36,
          background: "rgba(255,255,255,0.08)",
          margin: "0 4px",
          flexShrink: 0,
        }} />

        {/* Menu / avatar */}
        <div
          style={{
            ...bottomItemStyle(false),
            minWidth: 44,
            padding: "6px 8px",
          }}
          onClick={function () { setDrawerOpen(true); }}
        >
          <div style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "#A8FF3E",
            color: "#0D0D14",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 800,
            fontFamily: "var(--font-body)",
          }}>
            {initials}
          </div>
          <span style={bottomLabelStyle(false)}>Menu</span>
        </div>
      </div>

      {/* ── RESPONSIVE CSS ── */}
      <style>{`
        @media (max-width: 767px) {
          .main-content {
            padding-bottom: 90px !important;
          }
        }
        @media (min-width: 768px) {
          [data-bottom-nav] {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
