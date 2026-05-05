const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

:root {
  /* Softened dark background - not pitch black */
  --surface: #1C1B1A; 
  --surface-card: #262422; 
  
  --ink: #F9F9F9; /* Off-white text for less eye strain */
  --gold: #D4AF37; /* Premium metallic gold */
  --gold-dim: rgba(212, 175, 55, 0.12);
  
  --line: rgba(255, 255, 255, 0.08); 
  --slate: #9E9C99; 
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
.btn-primary { background: var(--gold); color: #000; }
.btn-dark { background: #0A0A0A; color: var(--gold); border: 1px solid var(--gold-dim); }
.btn-outline { background: transparent; border: 1px solid var(--line); color: var(--ink); }

/* App Layout Shell */
.app-shell { display: flex; min-height: 100vh; background: var(--surface); }
.sidebar { width: 260px; background: #141312; color: #fff; display: flex; flex-direction: column; position: fixed; top: 0; bottom: 0; left: 0; border-right: 1px solid var(--line); }
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
  transition: all 0.25s ease;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

/* 🌟 The "Hold Hover" Border Effect */
.stat-card:hover { 
  border-color: var(--gold); 
  box-shadow: 0 0 0 1px var(--gold), 0 12px 24px rgba(0,0,0,0.2);
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
  color: var(--gold);
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
  transition: all 0.25s ease;
}

/* 🌟 The Action Card Hover Effect */
.action-card:hover { 
  background: #2A2825; 
  border-color: var(--gold); 
  box-shadow: 0 0 0 1px var(--gold);
}

.action-icon {
  width: 44px; height: 44px;
  border-radius: 10px;
  background: var(--gold-dim);
  color: var(--gold);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; flex-shrink: 0;
  border: 1px solid rgba(212, 175, 55, 0.2);
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
