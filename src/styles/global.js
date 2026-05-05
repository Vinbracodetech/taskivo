const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

:root {
  --surface: #F7F8FA;
  --ink: #0D0D14;
  --lime: #A8FF3E;
  --line: #EBEBEB;
  --slate: #6B7280;
  --font-body: 'DM Sans', sans-serif;
  --font-display: 'DM Sans', sans-serif; /* Fixed font here! */
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
.btn-primary { background: var(--lime); color: var(--ink); }
.btn-dark { background: var(--ink); color: #fff; }
.btn-outline { background: transparent; border: 1px solid var(--line); color: var(--ink); }
.btn-ghost { background: transparent; color: var(--slate); }

/* App Layout Shell (for Dashboard & Auth) */
.app-shell { display: flex; min-height: 100vh; }
.sidebar { width: 260px; background: var(--ink); color: #fff; display: flex; flex-direction: column; position: fixed; top: 0; bottom: 0; left: 0; }
.main-content { flex: 1; margin-left: 260px; background: var(--surface); min-height: 100vh; }
.page { padding: 40px; max-width: 1000px; margin: 0 auto; }

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .app-shell { flex-direction: column; }
  .sidebar { display: none; }
  .main-content { margin-left: 0; }
  .page { padding: 20px 16px; }
}
`;

export default CSS;
