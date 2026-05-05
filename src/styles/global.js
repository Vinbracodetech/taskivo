const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

/* ── DEFAULT DARK THEME (Navy/Gold) ── */
:root, body.theme-dark {
  --surface: #070B19; 
  --surface-card: #0F172A; 
  --ink: #FFFFFF; 
  --gold: #FFD700; 
  --lime: #A8FF3E; 
  --line: rgba(255, 215, 0, 0.25); 
  --slate: #94A3B8; 
  --font-body: 'DM Sans', sans-serif;
  --font-display: 'DM Sans', sans-serif;
}

/* ── PREMIUM LIGHT THEME ── */
body.theme-light {
  --surface: #F8FAFC; /* Clean off-white */
  --surface-card: #FFFFFF; /* Pure white cards */
  --ink: #0F172A; /* Deep navy text for readability */
  --gold: #B48E2D; /* Slightly darker gold to show up on white */
  --lime: #4D7C0F; /* Darker green for text readability */
  --line: #E2E8F0; /* Soft gray borders */
  --slate: #64748B;
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
.main-content { flex: 1; margin-left: 260px; min-height: 100vh; }
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
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
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
