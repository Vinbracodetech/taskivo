const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Inter:wght@500;600;700;800&display=swap');

/* ── DEFAULT DARK THEME (Premium SaaS) ── */
:root, body.theme-dark {
  --surface: #0D0D14; 
  --surface-card: rgba(255,255,255,0.03); 
  --ink: #FFFFFF; 
  --gold: #FFD700; 
  --lime: #A8FF3E; 
  --lime-dim: rgba(168,255,62,0.12);
  --line: rgba(255,255,255,0.08); 
  --slate: #8B8B9E; 
  --glass: rgba(13, 13, 20, 0.75);
  --shadow: none;
  --font-body: 'DM Sans', sans-serif;
  --font-display: 'Inter', sans-serif;
}

/* ── PREMIUM LIGHT THEME (Stripe / Vercel Vibe) ── */
body.theme-light {
  --surface: #F9FAFB;       /* Clean, soft off-white background */
  --surface-card: #FFFFFF;  /* Pure white cards */
  --ink: #111827;           /* Crisp, near-black text for readability */
  --gold: #B48E2D;          /* Darker gold to show up on white */
  --lime: #4D7C0F;          /* Deep premium green for text/borders */
  --lime-dim: #ECFCCB;      /* Soft green for success backgrounds */
  --line: #E5E7EB;          /* Clean, visible gray borders */
  --slate: #6B7280;         /* Professional slate gray for muted text */
  --glass: rgba(255, 255, 255, 0.85);
  --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
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

/* Theme Toggle Button (If you still use it anywhere) */
.theme-toggle {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  border-radius: 4px;
  background: var(--surface-card);
  border: 1px solid var(--line);
  color: var(--gold);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transition: all 0.2s;
}
.theme-toggle:hover {
  transform: translateY(-2px);
  border-color: var(--lime);
  color: var(--lime);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 4px; 
  font-weight: 700;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
  text-decoration: none;
  font-family: var(--font-body);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.btn-sm { padding: 6px 12px; font-size: 13px; }
.btn-xl { padding: 16px 32px; font-size: 16px; }
.btn-primary { background: var(--lime); color: #000; border-color: var(--lime); }
.btn-primary:hover { background: transparent; color: var(--lime); }
.btn-dark { background: transparent; color: var(--gold); border-color: var(--gold); }
.btn-dark:hover { background: var(--gold); color: #000; }
.btn-outline { background: transparent; border: 1px solid var(--line); color: var(--ink); }

/* App Layout Shell */
.app-shell { display: flex; min-height: 100vh; background: var(--surface); transition: background-color 0.3s ease; }
.sidebar { width: 260px; background: var(--surface-card); color: var(--ink); display: flex; flex-direction: column; position: fixed; top: 0; bottom: 0; left: 0; border-right: 1px solid var(--line); transition: background-color 0.3s ease; }
.main-content { flex: 1; min-height: 100vh; } /* Removed margin-left so it spans full width now that sidebar is gone */
.page { padding: 40px; max-width: 1000px; margin: 0 auto; }

/* ── PREMIUM DASHBOARD STYLES ── */
.dashboard-header { 
  margin-bottom: 32px; 
  border-left: 4px solid var(--gold); 
  padding-left: 16px; 
}
.dashboard-title { font-size: 28px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.5px; color: var(--ink); }
.dashboard-sub { color: var(--slate); font-size: 15px; }

/* Stat Cards */
.stat-card {
  background: var(--surface-card);
  border: 1px solid var(--line); 
  border-radius: 4px; 
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
  background: linear-gradient(90deg, var(--gold), var(--lime));
}

.stat-card:hover { 
  border-color: var(--lime); 
  transform: translateY(-4px); 
}

.stat-label {
  font-size: 11px;
  font-weight: 700;
  color: var(--slate);
  text-transform: uppercase;
  letter-spacing: 1px;
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
  border-radius: 4px; 
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
}

.action-card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0; width: 3px;
  background: var(--gold);
  transition: all 0.2s;
}

.action-card:hover { 
  border-color: var(--lime); 
}
.action-card:hover::before {
  background: var(--lime);
  width: 4px;
}

.action-icon {
  width: 44px; height: 44px;
  border-radius: 4px; 
  background: rgba(212, 175, 55, 0.1);
  color: var(--gold);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.action-card:hover .action-icon {
  color: var(--lime);
  border-color: var(--lime);
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
