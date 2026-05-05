const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

:root {
  /* Premium Navy Blue Backgrounds */
  --surface: #070B19; /* Deep Navy */
  --surface-card: #0F172A; /* Slightly lighter Navy for cards */
  
  --ink: #FFFFFF; 
  --gold: #FFD700; /* Sharp, bright Gold */
  --lime: #A8FF3E; /* Lemon / Lime */
  
  --line: rgba(255, 215, 0, 0.25); /* Faint gold for secondary borders */
  --slate: #94A3B8; 
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
  border-radius: 4px; /* Sharper edges */
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
.app-shell { display: flex; min-height: 100vh; background: var(--surface); }
.sidebar { width: 260px; background: #050812; color: #fff; display: flex; flex-direction: column; position: fixed; top: 0; bottom: 0; left: 0; border-right: 1px solid var(--line); }
.main-content { flex: 1; margin-left: 260px; min-height: 100vh; }
.page { padding: 40px; max-width: 1000px; margin: 0 auto; }

/* ── PREMIUM DASHBOARD STYLES ── */
.dashboard-header { 
  margin-bottom: 32px; 
  border-left: 4px solid var(--gold); /* Sharp gold accent line */
  padding-left: 16px; 
}
.dashboard-title { font-size: 28px; font-weight: 700; margin-bottom: 8px; letter-spacing: -0.5px; color: #fff; }
.dashboard-sub { color: var(--slate); font-size: 15px; }

/* Stat Cards */
.stat-card {
  background: var(--surface-card);
  border: 1px solid var(--gold); /* Sharp gold border on all edges */
  border-radius: 4px; /* Sharp corners instead of rounded */
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.25s ease;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
  position: relative;
  overflow: hidden;
}

/* Mix of Lemon and Gold on top edge */
.stat-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 4px;
  background: linear-gradient(90deg, var(--gold), var(--lime));
}

/* Hover Effect: Switch to Lemon Glow */
.stat-card:hover { 
  border-color: var(--lime); 
  box-shadow: 0 0 0 1px var(--lime), 0 12px 24px rgba(168,255,62,0.15);
  transform: translateY(-4px); 
}

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
  color: var(--lime); /* Lemon color for the big numbers */
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
  border-radius: 4px; /* Sharp */
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
}

/* Sharp gold side accent */
.action-card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0; width: 3px;
  background: var(--gold);
  transition: all 0.2s;
}

/* Action Card Hover */
.action-card:hover { 
  background: #151E32; 
  border-color: var(--lime); 
}
.action-card:hover::before {
  background: var(--lime);
  width: 4px;
}

.action-icon {
  width: 44px; height: 44px;
  border-radius: 4px; /* Sharp */
  background: rgba(255, 215, 0, 0.1);
  color: var(--gold);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
  border: 1px solid rgba(255, 215, 0, 0.3);
}

.action-card:hover .action-icon {
  background: rgba(168, 255, 62, 0.1);
  color: var(--lime);
  border-color: rgba(168, 255, 62, 0.3);
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
