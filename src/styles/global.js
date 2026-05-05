const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

:root {
  --surface: #0D0D14; /* Deep dark background */
  --surface-card: #121218; /* Premium card background */
  --ink: #FFFFFF; /* White text */
  --lime: #A8FF3E; /* Signature neon accent */
  --line: rgba(255, 255, 255, 0.08); /* Faint, elegant borders */
  --slate: #888890; /* Subdued gray text */
  --font-body: 'DM Sans', sans-serif;
  --font-display: 'DM Sans', sans-serif;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-body);
  background-color: var(--surface);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
  text-decoration: none;
  font-family: var(--font-body);
}
.btn-sm { padding: 6px 12px; font-size: 13px; }
.btn-xl { padding: 16px 32px; font-size: 16px; border-radius: 12px; }
.btn-primary { background: var(--lime); color: #000; }
.btn-dark { background: #000; color: #fff; border: 1px solid var(--line); }
.btn-outline { background: transparent; border: 1px solid var(--line); color: var(--ink); }

/* App Layout Shell */
.app-shell { display: flex; min-height: 100vh; background: var(--surface); }
.sidebar { width: 260px; background: #0A0A0F; color: #fff; display: flex; flex-direction: column; position: fixed; top: 0; bottom: 0; left: 0; border-right: 1px solid var(--line); }
.main-content { flex: 1; margin-left: 260px; min-height: 100vh; }
.page { padding: 40px; max-width: 1000px; margin: 0 auto; }

/* ── PREMIUM DASHBOARD STYLES ── */
.dashboard-header { margin-bottom: 32px; }
.dashboard-title { font-size: 28px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.5px; }
.dashboard-sub { color: var(--slate); font-size: 15px; }

/* Stat Cards */
.stat-card {
  background: var(--surface-card);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: border-color 0.2s, transform 0.2s;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}
.stat-card:hover { border-color: rgba(168,255,62,0.3); transform: translateY(-2px); }
.stat-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--slate);
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.stat-value {
  font-size: 40px;
  font-weight: 800;
  color: var(--lime);
  line-height: 1;
  letter-spacing: -1px;
}

/* Quick Actions */
.action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}
.action-card {
  background: var(--surface-card);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s;
}
.action-card:hover { background: #1A1A24; border-color: rgba(255,255,255,0.15); }
.action-icon {
  width: 44px; height: 44px;
  border-radius: 10px;
  background: rgba(168,255,62,0.08);
  color: var(--lime);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
  border: 1px solid rgba(168,255,62,0.15);
}
.action-text h4 { font-size: 15px; font-weight: 600; margin-bottom: 6px; color: var(--ink); }
.action-text p { font-size: 13px; color: var(--slate); line-height: 1.5; }

/* Mobile Adjustments */
@media (max-width: 768px) {
  .app-shell { flex-direction: column; }
  .sidebar { display: none; }
  .main-content { margin-left: 0; padding-bottom: 80px; } 
  .page { padding: 24px 16px; }
  .dashboard-title { font-size: 24px; }
}
`;

export default CSS;
