import { useState } from "react";

export default function Sidebar({ user, view, navigate, logout }) {
  var [drawerOpen, setDrawerOpen] = useState(false);

  var role = user ? user.role : "earner";

  // ── Nav items per role ──
  var earnerLinks = [
    { icon: "⚡", label: "Dashboard",  view: "user-dashboard" },
    { icon: "🎯", label: "Tasks",      view: "tasks" },
    { icon: "👛", label: "Wallet",     view: "wallet" },
    { icon: "💸", label: "Withdraw",   view: "withdraw" },
  ];

  var creatorLinks = [
    { icon: "⚡", label: "Dashboard",  view: "creator-dashboard" },
    { icon: "✦",  label: "Create Task",view: "create-task" },
    { icon: "📋", label: "My Tasks",   view: "creator-tasks" },
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

  // Bottom nav — max 4 items + profile
  var bottomLinks = links.slice(0, 4);

  var initials = user && user.full_name
    ? user.full_name.split(" ").map(function (w) { return w[0]; }).join("").toUpperCase().slice(0, 2)
    : "U";

  var roleBadgeColor = role === "admin"
    ? "#EF4444"
    : role === "creator"
    ? "#3B82F6"
    : "#A8FF3E";

  var roleBadgeText = role === "admin"
    ? "#fff"
    : role === "creator"
    ? "#fff"
    : "#0D0D14";

  // ── STYLES ──
  var headerStyle = {
    position: "sticky",
    top: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    height: 56,
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid #EAECF0",
    boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
  };

  var logoStyle = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
    textDecoration: "none",
  };

  var logoTextStyle = {
    fontFamily: "var(--font-display)",
    fontSize: 18,
    fontWeight: 800,
    color: "#0D0D14",
    letterSpacing: "-0.3px",
  };

  var avatarStyle = {
    width: 34,
    height: 34,
    borderRadius: "50%",
    background: "#0D0D14",
    color: "#A8FF3E",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 13,
    fontWeight: 800,
    fontFamily: "var(--font-body)",
    cursor: "pointer",
    border: "2px solid #A8FF3E",
    flexShrink: 0,
  };

  var drawerOverlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
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
    width: 280,
    background: "#0D0D14",
    zIndex: 201,
    transform: drawerOpen ? "translateX(0)" : "translateX(100%)",
    transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
    display: "flex",
    flexDirection: "column",
    padding: "0 0 32px 0",
    boxShadow: "-8px 0 40px rgba(0,0,0,0.4)",
  };

  var drawerHeaderStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "20px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    marginBottom: 8,
  };

  var drawerLinkStyle = function (active) {
    return {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "13px 24px",
      cursor: "pointer",
      background: active ? "rgba(168,255,62,0.1)" : "transparent",
      borderLeft: active ? "3px solid #A8FF3E" : "3px solid transparent",
      transition: "all 0.15s",
      color: active ? "#A8FF3E" : "rgba(255,255,255,0.65)",
      fontSize: 15,
      fontWeight: active ? 700 : 500,
      fontFamily: "var(--font-body)",
    };
  };

  // ── Bottom floating nav ──
  var bottomNavStyle = {
    position: "fixed",
    bottom: 16,
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 150,
    display: "flex",
    alignItems: "center",
    gap: 4,
    background: "#0D0D14",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 40,
    padding: "8px 12px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2)",
  };

  var bottomNavItemStyle = function (active) {
    return {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 3,
      padding: "6px 14px",
      borderRadius: 28,
      cursor: "pointer",
      background: active ? "rgba(168,255,62,0.15)" : "transparent",
      transition: "all 0.18s",
      minWidth: 52,
    };
  };

  var bottomNavIconStyle = function (active) {
    return {
      fontSize: 18,
      lineHeight: 1,
      filter: active ? "none" : "grayscale(0.3) opacity(0.6)",
    };
  };

  var bottomNavLabelStyle = function (active) {
    return {
      fontSize: 10,
      fontWeight: active ? 700 : 500,
      color: active ? "#A8FF3E" : "rgba(255,255,255,0.45)",
      fontFamily: "var(--font-body)",
      letterSpacing: "0.2px",
      whiteSpace: "nowrap",
    };
  };

  var bottomNavDotStyle = {
    width: 4,
    height: 4,
    borderRadius: "50%",
    background: "#A8FF3E",
    margin: "0 auto",
  };

  return (
    <>
      {/* ── STICKY TOP HEADER ── */}
      <header style={headerStyle}>

        {/* Logo */}
        <div style={logoStyle} onClick={function () { navigate(
          role === "admin" ? "admin-dashboard"
          : role === "creator" ? "creator-dashboard"
          : "user-dashboard"
        ); }}>
          <span style={{ fontSize: 20 }}>⚡</span>
          <span style={logoTextStyle}>Taskivo</span>
          <span style={{
            background: roleBadgeColor,
            color: roleBadgeText,
            fontSize: 10,
            fontWeight: 800,
            padding: "2px 7px",
            borderRadius: 5,
            letterSpacing: "0.4px",
            textTransform: "uppercase",
          }}>
            {role}
          </span>
        </div>

        {/* Right side — desktop nav + avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>

          {/* Desktop nav links — hidden on mobile via inline style trick */}
          <nav style={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            marginRight: 12,
          }}
            className="desktop-nav"
          >
            {links.map(function (link) {
              var active = view === link.view;
              return (
                <button
                  key={link.view}
                  onClick={function () { navigate(link.view); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 14px",
                    borderRadius: 8,
                    border: "none",
                    background: active ? "rgba(168,255,62,0.12)" : "transparent",
                    color: active ? "#0D0D14" : "#6B7280",
                    fontSize: 14,
                    fontWeight: active ? 700 : 500,
                    fontFamily: "var(--font-body)",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: 15 }}>{link.icon}</span>
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Avatar — opens drawer */}
          <div
            style={avatarStyle}
            onClick={function () { setDrawerOpen(true); }}
            title={user ? user.full_name : ""}
          >
            {initials}
          </div>
        </div>
      </header>

      {/* ── SLIDE-IN DRAWER (profile + logout) ── */}
      <div style={drawerOverlayStyle} onClick={function () { setDrawerOpen(false); }} />
      <div style={drawerStyle}>

        {/* Drawer header */}
        <div style={drawerHeaderStyle}>
          <div>
            <div style={{
              fontSize: 15,
              fontWeight: 700,
              color: "#fff",
              marginBottom: 2,
            }}>
              {user ? (user.full_name || "User") : ""}
            </div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
              {user ? user.email : ""}
            </div>
          </div>
          <button
            onClick={function () { setDrawerOpen(false); }}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: 8,
              color: "#fff",
              width: 32,
              height: 32,
              fontSize: 18,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Points badge */}
        <div style={{ padding: "12px 24px", marginBottom: 8 }}>
          <div style={{
            background: "rgba(168,255,62,0.1)",
            border: "1px solid rgba(168,255,62,0.2)",
            borderRadius: 12,
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Your Points
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#A8FF3E", fontFamily: "var(--font-body)" }}>
                {user ? (user.points || 0).toLocaleString() : 0}
              </div>
            </div>
            <span style={{ fontSize: 28 }}>💰</span>
          </div>
        </div>

        {/* Nav links */}
        <div style={{ flex: 1 }}>
          {links.map(function (link) {
            var active = view === link.view;
            return (
              <div
                key={link.view}
                style={drawerLinkStyle(active)}
                onClick={function () { navigate(link.view); setDrawerOpen(false); }}
              >
                <span style={{ fontSize: 18, width: 24, textAlign: "center" }}>{link.icon}</span>
                {link.label}
                {active && <span style={{ marginLeft: "auto", ...bottomNavDotStyle, width: 6, height: 6 }} />}
              </div>
            );
          })}
        </div>

        {/* Logout */}
        <div style={{ padding: "0 24px" }}>
          <button
            onClick={function () { logout(); setDrawerOpen(false); }}
            style={{
              width: "100%",
              padding: "13px",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
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

      {/* ── FLOATING BOTTOM NAV (mobile) ── */}
      <div style={bottomNavStyle} className="mobile-bottom-nav">
        {bottomLinks.map(function (link) {
          var active = view === link.view;
          return (
            <div
              key={link.view}
              style={bottomNavItemStyle(active)}
              onClick={function () { navigate(link.view); }}
            >
              <span style={bottomNavIconStyle(active)}>{link.icon}</span>
              <span style={bottomNavLabelStyle(active)}>{link.label}</span>
              {active && <div style={bottomNavDotStyle} />}
            </div>
          );
        })}

        {/* Profile / menu button */}
        <div
          style={{
            ...bottomNavItemStyle(false),
            paddingLeft: 10,
            paddingRight: 10,
            borderLeft: "1px solid rgba(255,255,255,0.1)",
            marginLeft: 4,
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
          <span style={bottomNavLabelStyle(false)}>Menu</span>
        </div>
      </div>

      {/* ── CSS for show/hide on mobile/desktop ── */}
      <style>{`
        .desktop-nav { display: flex !important; }
        .mobile-bottom-nav { display: flex !important; }

        @media (min-width: 768px) {
          .mobile-bottom-nav { display: none !important; }
        }

        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .main-content { padding-bottom: 90px; }
        }
      `}</style>
    </>
  );
}
