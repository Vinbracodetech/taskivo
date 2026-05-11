const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Inter:wght@500;600;700;800&display=swap');

/* ── DEFAULT LIGHT THEME (Stripe / Vercel Vibe) ── */
/* We set Light Mode as the absolute base root to prevent missing variables */
:root, [data-theme='light'], body.theme-light {
  --surface: #F7F8FA;        /* Clean, soft off-white background */
  --surface-card: #FFFFFF;   /* Pure white cards */
  --ink: #0D0D14;            /* Crisp, near-black text for readability */
  --gold: #B48E2D;           /* Darker gold to show up on white */
  --lime: #A8FF3E;           /* Taskivo Signature Neon Green */
  --lime-dim: rgba(168,255,62,0.15); 
  --line: #EBEBEB;           /* Clean, visible gray borders */
  --slate: #6B7280;          /* Professional slate gray for muted text */
  --glass: rgba(255, 255, 255, 0.85);
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  --font-body: 'DM Sans', sans-serif;
  --font-display: 'Inter', sans-serif;
}

/* ── PREMIUM DARK THEME (Obsidian SaaS) ── */
/* This safely overrides the root when dark mode is activated */
[data-theme='dark'], body.theme-dark {
  --surface: #0D0D14; 
  --surface-card: #151521;  /* Slightly lighter than surface for depth */
  --ink: #FFFFFF; 
  --gold: #FFD700; 
  --lime: #A8FF3E; 
  --lime-dim: rgba(168,255,62,0.12);
  --line: rgba(255,255,255,0.08); 
  --slate: #8B8B9E; 
  --glass: rgba(13, 13, 20, 0.75);
  --shadow: 0 8px 32px rgba(0,0,0,0.2);
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
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Theme Toggle Button */
.theme-toggle {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--surface-card);
  border: 1px solid var(--line);
  color: var(--ink);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  z-index: 9999;
  box-shadow: var(--shadow);
  transition: all 0.2s ease;
}

.theme-toggle:hover {
  transform: translateY(-2px);
  border-color: var(--lime);
  color: var(--lime);
}

/* App Layout Shell */
.app-shell { display: flex; min-height: 100vh; background: var(--surface); transition: background-color 0.3s ease; }
.sidebar { width: 260px; background: var(--surface-card); color: var(--ink); display: flex; flex-direction: column; position: fixed; top: 0; bottom: 0; left: 0; border-right: 1px solid var(--line); transition: background-color 0.3s ease; z-index: 50; }
.main-content { flex: 1; min-height: 100vh; } 
.page { padding: 40px; max-width: 1000px; margin: 0 auto; }

/* ── PREMIUM DASHBOARD STYLES ── */
.dashboard-header { 
  margin-bottom: 32px; 
  border-left: 4px solid var(--lime); 
  padding-left: 16px; 
}
.dashboard-title { font-family: var(--font-display); font-size: 28px; font-weight: 800; margin-bottom: 8px; letter-spacing: -0.5px; color: var(--ink); }
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
  transition: all 0.25s ease;
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 4px;
  background: var(--line);
  transition: background 0.3s ease;
}

.stat-card:hover { 
  border-color: var(--line); 
  transform: translateY(-4px); 
}

.stat-card:hover::before {
  background: var(--lime);
}

.stat-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--slate);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 800;
  color: var(--ink); 
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
  border-radius: 16px; 
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
}

.action-card:hover { 
  border-color: var(--lime); 
  box-shadow: 0 8px 24px rgba(0,0,0,0.04);
}

.action-icon {
  width: 44px; height: 44px;
  border-radius: 12px; 
  background: var(--surface);
  color: var(--ink);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
  border: 1px solid var(--line);
  transition: all 0.2s ease;
}

.action-card:hover .action-icon {
  color: #000;
  background: var(--lime);
  border-color: var(--lime);
}

.action-text h4 { font-family: var(--font-display); font-size: 15px; font-weight: 700; margin-bottom: 6px; color: var(--ink); }
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
