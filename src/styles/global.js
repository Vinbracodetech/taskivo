const CSS = `
:root {
  --surface: #F7F8FA;
  --ink: #0D0D14;
  --lime: #A8FF3E;
  --line: #E5E7EB;
  --slate: #64748B;
  --font-body: 'DM Sans', sans-serif;
  --font-display: 'Syne', sans-serif;
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

/* Landing Layouts */
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  padding: 80px 5%;
  max-width: 1200px;
  margin: 0 auto;
}
.hero-eyebrow {
  font-weight: 700;
  color: #4CAF50;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 13px;
}
.hero-title {
  font-family: var(--font-display);
  font-size: 64px;
  line-height: 1.1;
  margin-bottom: 24px;
}
.hero-title span { color: var(--lime); background: var(--ink); padding: 0 8px; border-radius: 8px; }
.hero-sub {
  font-size: 18px;
  color: var(--slate);
  line-height: 1.6;
  margin-bottom: 32px;
  max-width: 480px;
}
.hero-actions { display: flex; gap: 16px; flex-wrap: wrap; }
.hero-card {
  background: var(--ink);
  border-radius: 24px;
  padding: 32px;
  color: #fff;
  box-shadow: 0 24px 48px -12px rgba(13,13,20,0.25);
}

.task-preview {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
}
.task-preview-title { font-weight: 600; margin-bottom: 8px; }
.task-preview-meta { display: flex; gap: 12px; font-size: 13px; color: rgba(255,255,255,0.6); }
.task-preview-reward { color: var(--lime); font-weight: 600; }
.progress { background: rgba(255,255,255,0.1); height: 6px; border-radius: 3px; overflow: hidden; }
.progress-bar { background: var(--lime); height: 100%; border-radius: 3px; }

.features-section { padding: 100px 5%; max-width: 1200px; margin: 0 auto; }
.section-label { text-align: center; font-weight: 700; color: #4CAF50; margin-bottom: 16px; text-transform: uppercase; font-size: 13px; letter-spacing: 1px; }
.section-title { text-align: center; font-family: var(--font-display); font-size: 40px; margin-bottom: 16px; }
.section-sub { text-align: center; color: var(--slate); font-size: 18px; max-width: 600px; margin: 0 auto 60px; line-height: 1.6; }
.features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
.feature-card { background: #fff; padding: 32px; border-radius: 20px; border: 1px solid var(--line); box-shadow: 0 4px 20px rgba(0,0,0,0.03); }
.feature-icon { font-size: 32px; margin-bottom: 20px; }
.feature-title { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
.feature-desc { color: var(--slate); line-height: 1.6; font-size: 15px; }

.how-section { background: var(--ink); color: #fff; padding: 100px 5%; }
.steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; max-width: 1200px; margin: 0 auto; }
.step-num { width: 48px; height: 48px; background: rgba(168,255,62,0.1); color: var(--lime); font-family: var(--font-display); font-size: 24px; font-weight: 700; display: flex; align-items: center; justify-content: center; border-radius: 50%; margin: 0 auto 20px; }
.step-title { font-size: 20px; font-weight: 700; margin-bottom: 12px; }
.step-desc { color: rgba(255,255,255,0.7); line-height: 1.6; font-size: 15px; }

.cta-section { padding: 100px 5%; }
.cta-inner { background: var(--lime); border-radius: 32px; padding: 80px 5%; text-align: center; max-width: 1000px; margin: 0 auto; }
.cta-title { font-family: var(--font-display); font-size: 48px; color: var(--ink); margin-bottom: 20px; }
.cta-sub { font-size: 20px; color: rgba(13,13,20,0.7); margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto; }

.landing-footer { border-top: 1px solid var(--line); padding: 80px 5% 40px; max-width: 1200px; margin: 0 auto; }
.footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 60px; margin-bottom: 60px; }
.footer-brand { font-family: var(--font-display); font-size: 24px; font-weight: 700; margin-bottom: 16px; }
.footer-col-title { font-weight: 700; margin-bottom: 20px; }
.footer-col-links { list-style: none; display: flex; flex-direction: column; gap: 12px; }
.footer-col-links a { color: var(--slate); text-decoration: none; font-size: 14px; transition: color 0.2s; }
.footer-col-links a:hover { color: var(--ink); }
.footer-bottom { border-top: 1px solid var(--line); padding-top: 32px; text-align: center; color: var(--slate); font-size: 14px; }

/* App Layout Shell (for Dashboard) */
.app-shell { display: flex; min-height: 100vh; }
.sidebar { width: 260px; background: var(--ink); color: #fff; display: flex; flex-direction: column; position: fixed; top: 0; bottom: 0; left: 0; }
.main-content { flex: 1; margin-left: 260px; background: var(--surface); min-height: 100vh; }
.page { padding: 40px; max-width: 1000px; margin: 0 auto; }

/* --- MOBILE RESPONSIVENESS FIX --- */
@media (max-width: 768px) {
  .hero { 
    grid-template-columns: 1fr; 
    padding: 40px 5% 60px; 
    gap: 40px; 
  }
  .hero-title { font-size: 40px; }
  .hero-sub { font-size: 16px; }
  .hero-actions { flex-direction: column; }
  .hero-actions .btn { width: 100%; }
  
  .hero-card { padding: 24px; }

  .section-title { font-size: 32px; }
  .features-grid { grid-template-columns: 1fr; gap: 24px; }
  .feature-card { padding: 24px; }
  
  .how-section { padding: 60px 5%; }
  .steps-grid { grid-template-columns: 1fr; gap: 40px; }

  .cta-section { padding: 60px 5%; }
  .cta-inner { padding: 40px 5%; border-radius: 20px; }
  .cta-title { font-size: 32px; }
  .cta-sub { font-size: 16px; }

  .footer-grid { grid-template-columns: 1fr; gap: 40px; }

  .auth-page { grid-template-columns: 1fr; }
  .auth-left { display: none; }
  
  .app-shell { flex-direction: column; }
  .sidebar { display: none; }
  .main-content { margin-left: 0; }
  .page { padding: 20px 16px; }
  .admin-overview { grid-template-columns: 1fr; }
}
`;

export default CSS;
