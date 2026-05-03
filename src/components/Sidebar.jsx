import Icon from "./Icon.jsx";

export default function Sidebar({ user, view, navigate, logout }) {

  var userLinks = [
    { label: "Dashboard", icon: "home", view: "user-dashboard" },
    { label: "Browse Tasks", icon: "tasks", view: "tasks" },
    { label: "My Wallet", icon: "wallet", view: "wallet" },
    { label: "Withdraw", icon: "download", view: "withdraw" },
    { label: "Blog", icon: "blog", view: "blog" },
  ];

  var creatorLinks = [
    { label: "Dashboard", icon: "home", view: "creator-dashboard" },
    { label: "Create Task", icon: "plus", view: "create-task" },
    { label: "My Tasks", icon: "tasks", view: "creator-tasks" },
    { label: "Analytics", icon: "analytics", view: "creator-analytics" },
  ];

  var adminLinks = [
    { label: "Overview", icon: "home", view: "admin-dashboard" },
    { label: "Users", icon: "users", view: "admin-users" },
    { label: "Tasks", icon: "tasks", view: "admin-tasks" },
    { label: "Withdrawals", icon: "download", view: "admin-withdrawals" },
  ];

  var links = adminLinks;
  if (user.role === "earner") links = userLinks;
  if (user.role === "creator") links = creatorLinks;

  var sectionLabel = "Worker";
  if (user.role === "creator") sectionLabel = "Creator Hub";
  if (user.role === "admin") sectionLabel = "Admin Panel";

  var initials = (user.full_name || user.email || "U")
    .split(" ")
    .map(function (w) { return w[0]; })
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="sidebar">

      {/* LOGO */}
      <div className="sidebar-logo">
        <div className="logo-icon">⚡</div>
        Taskivo
      </div>

      {/* SECTION LABEL */}
      <div className="sidebar-section-label">{sectionLabel}</div>

      {/* NAV LINKS */}
      {links.map(function (link) {
        return (
          <button
            key={link.view}
            className={"sidebar-item " + (view === link.view ? "active" : "")}
            onClick={function () { navigate(link.view); }}
          >
            <Icon name={link.icon} size={14} />
            {link.label}
          </button>
        );
      })}

      {/* BOTTOM SECTION */}
      <div className="sidebar-bottom">

        {/* POINTS BALANCE — only for earners */}
        {user.role === "earner" && (
          <div style={{ padding: "8px 12px", marginBottom: 8 }}>
            <div className="sidebar-section-label" style={{ padding: "0 0 4px" }}>
              Points Balance
            </div>
            <div style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 700,
              color: "var(--lime)"
            }}>
              {(user.points || 0).toLocaleString()}
              <span style={{
                fontSize: 12,
                fontWeight: 400,
                color: "rgba(255,255,255,.4)",
                marginLeft: 4
              }}>
                pts
              </span>
            </div>
          </div>
        )}

        {/* USER INFO */}
        <div className="sidebar-user">
          <div className="sidebar-avatar">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">
              {user.full_name || user.email || "User"}
            </div>
            <div className="sidebar-user-role">{user.role}</div>
          </div>
        </div>

        {/* LOGOUT */}
        <button className="sidebar-item" onClick={logout}>
          <Icon name="logout" size={14} />
          Logout
        </button>

      </div>
    </div>
  );
         }
