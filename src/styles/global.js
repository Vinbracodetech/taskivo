const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink: #0A0A0F;
    --ink-2: #1A1A2E;
    --ink-3: #2D2D44;
    --slate: #6B7280;
    --slate-2: #9CA3AF;
    --line: #E5E7EB;
    --line-2: #F3F4F6;
    --surface: #FAFAFA;
    --white: #FFFFFF;
    --lime: #A8FF3E;
    --lime-2: #C8FF6E;
    --lime-dark: #7ACC20;
    --accent: #6366F1;
    --accent-2: #818CF8;
    --orange: #F97316;
    --red: #EF4444;
    --green: #22C55E;
    --gold: #F59E0B;
    --r: 14px;
    --r-sm: 8px;
    --r-lg: 20px;
    --r-xl: 28px;
    --shadow: 0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.06);
    --shadow-lg: 0 8px 32px rgba(0,0,0,.10);
    --shadow-xl: 0 20px 60px rgba(0,0,0,.14);
    --font-display: 'Clash Display', sans-serif;
    --font-heading: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --sidebar-w: 260px;
    --header-h: 68px;
  }

  html { font-size: 16px; scroll-behavior: smooth; }
  body { font-family: var(--font-body); background: var(--surface); color: var(--ink); line-height: 1.6; -webkit-font-smoothing: antialiased; }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--line); border-radius: 99px; }

  .app-shell { display: flex; min-height: 100vh; }
  .main-content { flex: 1; min-width: 0; }
  .page { padding: 32px; max-width: 1200px; }

  .topbar { height: var(--header-h); background: var(--white); border-bottom: 1px solid var(--line); display: flex; align-items: center; padding: 0 32px; gap: 16px; position: sticky; top: 0; z-index: 100; backdrop-filter: blur(12px); }

  .sidebar { width: var(--sidebar-w); background: var(--ink-2); min-height: 100vh; position: sticky; top: 0; display: flex; flex-direction: column; padding: 0 12px 24px; flex-shrink: 0; overflow-y: auto; }
  .sidebar-logo { padding: 22px 12px 20px; font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--white); display: flex; align-items: center; gap: 10px; border-bottom: 1px solid rgba(255,255,255,.08); margin-bottom: 12px; }
  .sidebar-logo .logo-icon { width: 34px; height: 34px; background: var(--lime); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .sidebar-section-label { font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: rgba(255,255,255,.3); padding: 8px 12px 6px; margin-top: 8px; }
  .sidebar-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: var(--r-sm); color: rgba(255,255,255,.65); text-decoration: none; font-size: 14px; font-weight: 500; cursor: pointer; border: none; background: none; width: 100%; text-align: left; transition: all .18s; }
  .sidebar-item:hover { background: rgba(255,255,255,.07); color: var(--white); }
  .sidebar-item.active { background: rgba(168,255,62,.12); color: var(--lime); }
  .sidebar-bottom { margin-top: auto; padding-top: 16px; border-top: 1px solid rgba(255,255,255,.08); }
  .sidebar-user { display: flex; align-items: center; gap: 10px; padding: 10px 12px; }
  .sidebar-avatar { width: 34px; height: 34px; border-radius: 50%; background: linear-gradient(135deg, var(--lime), var(--accent-2)); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; color: var(--ink); flex-shrink: 0; }
  .sidebar-user-name { font-size: 13px; font-weight: 600; color: var(--white); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sidebar-user-role { font-size: 11px; color: rgba(255,255,255,.4); text-transform: capitalize; }

  .btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: var(--r-sm); font-family: var(--font-body); font-size: 14px; font-weight: 600; cursor: pointer; border: none; transition: all .2s; text-decoration: none; white-space: nowrap; }
  .btn-primary { background: var(--lime); color: var(--ink); }
  .btn-primary:hover { background: var(--lime-2); transform: translateY(-1px); box-shadow: 0 4px 14px rgba(168,255,62,.35); }
  .btn-dark { background: var(--ink); color: var(--white); }
  .btn-dark:hover { background: var(--ink-2); transform: translateY(-1px); }
  .btn-outline { background: transparent; color: var(--ink); border: 1.5px solid var(--line); }
  .btn-outline:hover { border-color: var(--ink); background: var(--line-2); }
  .btn-ghost { background: transparent; color: var(--slate); border: none; }
  .btn-ghost:hover { background: var(--line-2); color: var(--ink); }
  .btn-danger { background: var(--red); color: var(--white); }
  .btn-sm { padding: 6px 14px; font-size: 13px; }
  .btn-lg { padding: 14px 28px; font-size: 15px; }
  .btn-xl { padding: 18px 36px; font-size: 16px; }
  .btn:disabled { opacity: .5; cursor: not-allowed; transform: none !important; }

  .card { background: var(--white); border: 1px solid var(--line); border-radius: var(--r); padding: 24px; box-shadow: var(--shadow); }
  .card-hover { transition: all .22s; cursor: pointer; }
  .card-hover:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); border-color: var(--lime-dark); }

  .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 28px; }
  .stat-card { background: var(--white); border: 1px solid var(--line); border-radius: var(--r); padding: 20px 24px; }
  .stat-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: .08em; color: var(--slate); margin-bottom: 8px; }
  .stat-value { font-family: var(--font-heading); font-size: 32px; font-weight: 800; color: var(--ink); line-height: 1; }
  .stat-sub { font-size: 12px; color: var(--slate); margin-top: 4px; }

  .form-group { margin-bottom: 20px; }
  .form-label { display: block; font-size: 13px; font-weight: 600; color: var(--ink); margin-bottom: 6px; }
  .form-input, .form-select, .form-textarea { width: 100%; padding: 10px 14px; border: 1.5px solid var(--line); border-radius: var(--r-sm); font-family: var(--font-body); font-size: 14px; color: var(--ink); background: var(--white); transition: border-color .18s; outline: none; }
  .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: var(--lime-dark); box-shadow: 0 0 0 3px rgba(168,255,62,.15); }
  .form-textarea { resize: vertical; min-height: 96px; }
  .form-hint { font-size: 12px; color: var(--slate); margin-top: 4px; }
  .form-error { font-size: 12px; color: var(--red); margin-top: 4px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: 99px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .06em; }
  .badge-green { background: rgba(34,197,94,.12); color: #16A34A; }
  .badge-yellow { background: rgba(245,158,11,.12); color: #D97706; }
  .badge-red { background: rgba(239,68,68,.12); color: #DC2626; }
  .badge-blue { background: rgba(99,102,241,.12); color: #4F46E5; }
  .badge-lime { background: rgba(168,255,62,.2); color: #5A8A00; }
  .badge-gray { background: var(--line-2); color: var(--slate); }

  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  th { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--slate); padding: 10px 16px; text-align: left; border-bottom: 2px solid var(--line); background: var(--surface); }
  td { padding: 14px 16px; border-bottom: 1px solid var(--line); font-size: 14px; color: var(--ink); }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: var(--line-2); }

  .progress { height: 6px; background: var(--line); border-radius: 99px; overflow: hidden; }
  .progress-bar { height: 100%; background: var(--lime); border-radius: 99px; transition: width .6s ease; }

  .tabs { display: flex; gap: 4px; border-bottom: 2px solid var(--line); margin-bottom: 24px; }
  .tab { padding: 10px 18px; font-size: 14px; font-weight: 600; color: var(--slate); cursor: pointer; border: none; background: none; border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all .18s; }
  .tab.active { color: var(--ink); border-bottom-color: var(--lime-dark); }

  .modal-backdrop { position: fixed; inset: 0; background: rgba(10,10,15,.6); backdrop-filter: blur(4px); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn .2s; }
  .modal { background: var(--white); border-radius: var(--r-lg); padding: 32px; max-width: 520px; width: 100%; box-shadow: var(--shadow-xl); animation: slideUp .25s; max-height: 90vh; overflow-y: auto; }
  .modal-title { font-family: var(--font-heading); font-size: 20px; font-weight: 700; color: var(--ink); margin-bottom: 20px; }
  .modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }

  .toast-container { position: fixed; bottom: 24px; right: 24px; z-index: 300; display: flex; flex-direction: column; gap: 10px; }
  .toast { background: var(--ink); color: var(--white); padding: 12px 18px; border-radius: var(--r-sm); font-size: 14px; font-weight: 500; max-width: 320px; box-shadow: var(--shadow-xl); animation: slideInRight .25s; display: flex; align-items: center; gap: 10px; }
  .toast.success { background: #166534; border-left: 3px solid var(--green); }
  .toast.error { background: #7F1D1D; border-left: 3px solid var(--red); }
  .toast.warning { background: #78350F; border-left: 3px solid var(--gold); }

  .landing { background: var(--white); }
  .hero { padding: 80px 5% 100px; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; max-width: 1200px; margin: 0 auto; }
  .hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; background: rgba(168,255,62,.15); color: #5A8A00; padding: 6px 14px; border-radius: 99px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 24px; border: 1px solid rgba(168,255,62,.3); }
  .hero-title { font-family: var(--font-display); font-size: clamp(40px, 5vw, 64px); font-weight: 700; color: var(--ink); line-height: 1.08; margin-bottom: 24px; }
  .hero-title span { color: var(--lime-dark); }
  .hero-sub { font-size: 18px; color: var(--slate); line-height: 1.7; margin-bottom: 36px; max-width: 480px; }
  .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }
  .hero-card { background: var(--ink-2); border-radius: var(--r-xl); padding: 28px; color: var(--white); }
  .task-preview { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); border-radius: var(--r); padding: 16px; margin-bottom: 12px; }
  .task-preview-title { font-weight: 600; font-size: 15px; margin-bottom: 8px; }
  .task-preview-meta { display: flex; align-items: center; gap: 12px; font-size: 12px; color: rgba(255,255,255,.5); }
  .task-preview-reward { color: var(--lime); font-weight: 700; }

  .features-section { padding: 80px 5%; background: var(--surface); }
  .section-label { text-align: center; font-size: 11px; font-weight: 700; letter-spacing: .15em; text-transform: uppercase; color: var(--lime-dark); margin-bottom: 14px; }
  .section-title { text-align: center; font-family: var(--font-display); font-size: clamp(28px, 4vw, 44px); font-weight: 700; color: var(--ink); margin-bottom: 16px; }
  .section-sub { text-align: center; font-size: 16px; color: var(--slate); max-width: 540px; margin: 0 auto 56px; line-height: 1.7; }
  .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1100px; margin: 0 auto; }
  .feature-card { background: var(--white); border: 1px solid var(--line); border-radius: var(--r-lg); padding: 28px; transition: all .22s; }
  .feature-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-3px); border-color: rgba(168,255,62,.4); }
  .feature-icon { width: 48px; height: 48px; background: rgba(168,255,62,.12); border-radius: var(--r); display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 18px; }
  .feature-title { font-family: var(--font-heading); font-size: 16px; font-weight: 700; color: var(--ink); margin-bottom: 8px; }
  .feature-desc { font-size: 14px; color: var(--slate); line-height: 1.65; }

  .how-section { padding: 80px 5%; background: var(--ink-2); color: var(--white); }
  .how-section .section-title { color: var(--white); }
  .how-section .section-sub { color: rgba(255,255,255,.55); }
  .steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; max-width: 1100px; margin: 0 auto; }
  .step-num { width: 52px; height: 52px; background: var(--lime); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--ink); margin: 0 auto 16px; }
  .step-title { font-weight: 700; font-size: 15px; margin-bottom: 8px; }
  .step-desc { font-size: 13px; color: rgba(255,255,255,.55); line-height: 1.6; }

  .cta-section { padding: 80px 5%; background: linear-gradient(135deg, var(--lime) 0%, var(--lime-2) 100%); }
  .cta-inner { max-width: 640px; margin: 0 auto; text-align: center; }
  .cta-title { font-family: var(--font-display); font-size: clamp(28px, 4vw, 48px); font-weight: 700; color: var(--ink); margin-bottom: 16px; }
  .cta-sub { font-size: 17px; color: rgba(10,10,15,.65); margin-bottom: 36px; }

  .landing-nav { padding: 0 5%; height: 72px; display: flex; align-items: center; gap: 16px; max-width: 1440px; margin: 0 auto; position: sticky; top: 0; background: rgba(255,255,255,.92); backdrop-filter: blur(12px); z-index: 50; border-bottom: 1px solid var(--line); }
  .landing-nav-brand { font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--ink); flex: 1; text-decoration: none; }
  .landing-nav-links { display: flex; gap: 4px; }
  .landing-nav-links a { font-size: 14px; font-weight: 500; color: var(--slate); text-decoration: none; padding: 7px 14px; border-radius: var(--r-sm); transition: all .18s; }
  .landing-nav-links a:hover { color: var(--ink); background: var(--line-2); }
  .landing-footer { background: var(--ink); color: rgba(255,255,255,.5); padding: 48px 5% 32px; }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; max-width: 1200px; margin: 0 auto 40px; }
  .footer-brand { font-family: var(--font-display); font-size: 20px; font-weight: 700; color: var(--white); margin-bottom: 12px; }
  .footer-col-title { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: rgba(255,255,255,.8); margin-bottom: 14px; }
  .footer-col-links { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .footer-col-links li a { font-size: 13px; color: rgba(255,255,255,.45); text-decoration: none; transition: color .18s; cursor: pointer; }
  .footer-col-links li a:hover { color: var(--lime); }
  .footer-bottom { border-top: 1px solid rgba(255,255,255,.08); padding-top: 24px; font-size: 13px; text-align: center; max-width: 1200px; margin: 0 auto; }

  .task-card { background: var(--white); border: 1px solid var(--line); border-radius: var(--r-lg); padding: 20px; transition: all .22s; }
  .task-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-2px); border-color: rgba(168,255,62,.4); }
  .task-card-title { font-family: var(--font-heading); font-size: 15px; font-weight: 700; color: var(--ink); flex: 1; margin-right: 12px; }
  .task-card-body { font-size: 13px; color: var(--slate); margin-bottom: 14px; line-height: 1.6; }
  .task-card-meta { display: flex; align-items: center; gap: 12px; font-size: 12px; color: var(--slate); margin-bottom: 14px; flex-wrap: wrap; }
  .reward-value { font-family: var(--font-heading); font-size: 20px; font-weight: 800; color: var(--lime-dark); }
  .reward-label { font-size: 11px; color: var(--slate); }

  .wallet-hero { background: linear-gradient(135deg, var(--ink-2), var(--ink-3)); border-radius: var(--r-xl); padding: 32px; color: var(--white); margin-bottom: 24px; }
  .wallet-balance { font-family: var(--font-display); font-size: 52px; font-weight: 700; color: var(--lime); line-height: 1; margin-bottom: 4px; }
  .wallet-balance-label { font-size: 13px; color: rgba(255,255,255,.5); }
  .tx-item { display: flex; align-items: center; gap: 14px; padding: 14px 18px; background: var(--white); border: 1px solid var(--line); border-radius: var(--r-sm); }
  .tx-icon { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .tx-icon.earn { background: rgba(34,197,94,.12); }
  .tx-icon.withdraw { background: rgba(239,68,68,.1); }
  .tx-title { font-size: 14px; font-weight: 600; color: var(--ink); }
  .tx-date { font-size: 12px; color: var(--slate); }
  .tx-amount { font-family: var(--font-heading); font-size: 16px; font-weight: 700; }
  .tx-amount.positive { color: var(--green); }
  .tx-amount.negative { color: var(--red); }

  .blog-hero { background: linear-gradient(135deg, var(--ink-2) 0%, var(--ink-3) 100%); padding: 60px 5%; color: var(--white); text-align: center; }
  .blog-hero-title { font-family: var(--font-display); font-size: clamp(32px, 5vw, 56px); font-weight: 700; margin-bottom: 16px; }
  .blog-hero-sub { font-size: 16px; color: rgba(255,255,255,.6); max-width: 500px; margin: 0 auto; }
  .blog-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; padding: 48px 5%; max-width: 1200px; margin: 0 auto; }
  .blog-card { background: var(--white); border: 1px solid var(--line); border-radius: var(--r-lg); overflow: hidden; transition: all .22s; cursor: pointer; }
  .blog-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-3px); }
  .blog-card-img { height: 180px; display: flex; align-items: center; justify-content: center; font-size: 48px; }
  .blog-card-body { padding: 20px; }
  .blog-card-cat { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: var(--lime-dark); margin-bottom: 8px; }
  .blog-card-title { font-family: var(--font-heading); font-size: 16px; font-weight: 700; color: var(--ink); margin-bottom: 8px; line-height: 1.4; }
  .blog-card-excerpt { font-size: 13px; color: var(--slate); line-height: 1.6; margin-bottom: 14px; }
  .blog-card-meta { display: flex; justify-content: space-between; font-size: 12px; color: var(--slate); }

  .auth-page { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; }
  .auth-left { background: var(--ink-2); display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 60px 40px; }
  .auth-left-brand { font-family: var(--font-display); font-size: 36px; font-weight: 700; color: var(--white); margin-bottom: 32px; }
  .auth-left-tagline { font-size: 18px; color: rgba(255,255,255,.6); text-align: center; max-width: 340px; line-height: 1.6; }
  .auth-right { display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 60px 40px; background: var(--surface); }
  .auth-form { width: 100%; max-width: 400px; }
  .auth-title { font-family: var(--font-display); font-size: 28px; font-weight: 700; color: var(--ink); margin-bottom: 8px; }
  .auth-sub { font-size: 14px; color: var(--slate); margin-bottom: 32px; }
  .auth-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; color: var(--slate); font-size: 13px; }
  .auth-divider::before, .auth-divider::after { content: ''; flex: 1; height: 1px; background: var(--line); }
  .auth-switch { text-align: center; font-size: 14px; color: var(--slate); margin-top: 24px; }
  .auth-switch a { color: var(--lime-dark); font-weight: 600; cursor: pointer; text-decoration: none; }

  .analytics-chart { height: 200px; background: linear-gradient(180deg, rgba(168,255,62,.08) 0%, transparent 100%); border: 1px solid rgba(168,255,62,.2); border-radius: var(--r); display: flex; align-items: flex-end; gap: 4px; padding: 16px; overflow: hidden; }
  .chart-bar { flex: 1; background: var(--lime); border-radius: 4px 4px 0 0; min-width: 8px; transition: height .6s; opacity: .8; }

  .task-player { background: var(--white); border-radius: var(--r-xl); padding: 32px; max-width: 800px; }
  .task-timer { display: flex; align-items: center; gap: 12px; background: var(--ink-2); color: var(--white); padding: 12px 20px; border-radius: var(--r-sm); margin-bottom: 24px; }
  .timer-circle { width: 44px; height: 44px; border-radius: 50%; background: rgba(168,255,62,.15); border: 2px solid var(--lime); display: flex; align-items: center; justify-content: center; font-family: var(--font-heading); font-size: 16px; font-weight: 800; color: var(--lime); flex-shrink: 0; }
  .question-block { background: var(--surface); border: 1px solid var(--line); border-radius: var(--r); padding: 20px; margin-bottom: 16px; }
  .question-text { font-weight: 600; font-size: 15px; color: var(--ink); margin-bottom: 14px; }
  .question-option { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border: 1.5px solid var(--line); border-radius: var(--r-sm); cursor: pointer; transition: all .18s; font-size: 14px; margin-bottom: 8px; }
  .question-option:hover { border-color: var(--lime-dark); background: rgba(168,255,62,.05); }
  .question-option.selected { border-color: var(--lime-dark); background: rgba(168,255,62,.1); }
  .star { font-size: 28px; cursor: pointer; transition: transform .15s; filter: grayscale(1) opacity(.4); }
  .star.active { filter: none; transform: scale(1.1); }
  .anti-cheat-warning { background: rgba(245,158,11,.1); border: 1px solid rgba(245,158,11,.3); border-radius: var(--r-sm); padding: 12px 16px; font-size: 13px; color: #92400E; margin-bottom: 20px; }

  .page-title { font-family: var(--font-display); font-size: 28px; font-weight: 700; color: var(--ink); margin-bottom: 6px; }
  .page-subtitle { font-size: 15px; color: var(--slate); margin-bottom: 28px; }
  .section-heading { font-family: var(--font-heading); font-size: 18px; font-weight: 700; color: var(--ink); }
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .divider { height: 1px; background: var(--line); margin: 24px 0; }
  .empty-state { text-align: center; padding: 60px 20px; }
  .empty-state-icon { font-size: 48px; margin-bottom: 16px; opacity: .5; }
  .empty-state-title { font-family: var(--font-heading); font-size: 18px; font-weight: 700; color: var(--ink); margin-bottom: 8px; }
  .empty-state-desc { font-size: 14px; color: var(--slate); max-width: 320px; margin: 0 auto 20px; }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  .animate-fadeIn { animation: fadeIn .4s; }
  .animate-slideUp { animation: slideUp .4s; }
  .spin { animation: spin 1s linear infinite; }

  @media (max-width: 768px) {
    .hero { grid-template-columns: 1fr; padding: 48px 5% 60px; }
    .hero-visual { display: none; }
    .hero-title { font-size: 32px; }
    .hero-sub { font-size: 15px; }
    .features-grid { grid-template-columns: 1fr; }
    .steps-grid { grid-template-columns: 1fr 1fr; }
    .footer-grid { grid-template-columns: 1fr 1fr; }
    .auth-page { grid-template-columns: 1fr; }
    .auth-left { display: none; }
    .auth-right { padding: 40px 20px; }
    .sidebar { display: none; }
    .page { padding: 16px; }
    .stat-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
    .stat-value { font-size: 24px; }
    .wallet-balance { font-size: 36px; }
    .form-row { grid-template-columns: 1fr; }
    .landing-nav { height: 56px; padding: 0 4%; }
    .landing-nav-brand { font-size: 18px; }
    .landing-nav-links { display: none; }
    .modal { padding: 20px; }
    .tabs { overflow-x: auto; }
    .toast-container { bottom: 80px; right: 12px; left: 12px; }
    .toast { max-width: 100%; }
    .admin-overview { grid-template-columns: 1fr 1fr; }
    .section-title { font-size: 28px; }
    .cta-title { font-size: 28px; }
}

  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }

  .lp-hero-title { font-size: 56px; letter-spacing: -2px; line-height: 1.06; }
  .lp-hero-pad { padding: 88px 5% 72px; }
  .lp-hero-sub { font-size: 16px; margin: 0 auto 36px; }
  .lp-hero-actions-mb { margin-bottom: 56px; }
  .lp-btn-hero { padding: 13px 26px; font-size: 14px; }
  .lp-stat-num { font-size: 26px; letter-spacing: -1px; }
  .lp-stat-label { font-size: 11px; }
  .lp-stat-pad { padding: 0 16px; }
  .lp-section-pad { padding: 80px 5%; }
  .lp-section-title { font-size: 36px; letter-spacing: -1px; }
  .lp-section-sub { font-size: 15px; margin-bottom: 36px; }
  .lp-audience-grid { grid-template-columns: repeat(2, 1fr); }
  .lp-audience-card-pad { padding: 40px 36px; }
  .lp-audience-title { font-size: 22px; letter-spacing: -0.5px; }
  .lp-audience-desc { font-size: 14px; margin-bottom: 20px; }
  .lp-step-text { font-size: 13px; }
  .lp-audience-btn { font-size: 13px; padding: 10px 18px; }
  .lp-features-grid { grid-template-columns: repeat(3, 1fr); gap: 12px; }
  .lp-feature-card-pad { padding: 28px 24px; }
  .lp-feature-name { font-size: 15px; }
  .lp-feature-desc { font-size: 13px; }
  .lp-proof-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .lp-proof-card-pad { padding: 24px; }
  .lp-proof-text { font-size: 13px; }
  .lp-cta-pad { padding: 100px 5%; }
  .lp-cta-title { font-size: 48px; letter-spacing: -1.5px; }
  .lp-cta-sub { font-size: 15px; }
  .lp-trust-row { margin-top: 20px; gap: 20px; }
  .lp-footer-pad { padding: 52px 5% 28px; }
  .lp-footer-grid { grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 32px; }
  .lp-footer-brand-span { grid-column: auto; }
  .lp-nav-height { height: 64px; }
  .lp-nav-pad { padding: 0 5%; }
  .lp-nav-brand { font-size: 19px; }
  .lp-nav-btn-ghost { font-size: 13px; padding: 7px 14px; }
  .lp-nav-btn-primary { font-size: 13px; padding: 8px 16px; }

  @media (max-width: 600px) {
    .lp-nav-height { height: 52px !important; }
    .lp-nav-pad { padding: 0 4% !important; }
    .lp-nav-brand { font-size: 16px !important; }
    .lp-nav-btn-ghost { font-size: 11px !important; padding: 5px 9px !important; }
    .lp-nav-btn-primary { font-size: 11px !important; padding: 6px 11px !important; }
    .lp-hero-pad { padding: 44px 4% 40px !important; }
    .lp-hero-title { font-size: 28px !important; letter-spacing: -0.8px !important; line-height: 1.12 !important; }
    .lp-hero-sub { font-size: 13px !important; margin: 0 auto 22px !important; }
    .lp-hero-actions-mb { margin-bottom: 32px !important; }
    .lp-btn-hero { padding: 10px 16px !important; font-size: 12px !important; }
    .lp-stat-num { font-size: 15px !important; letter-spacing: -0.3px !important; }
    .lp-stat-label { font-size: 8px !important; }
    .lp-stat-pad { padding: 0 4px !important; }
    .lp-section-pad { padding: 44px 4% !important; }
    .lp-section-title { font-size: 20px !important; letter-spacing: -0.3px !important; }
    .lp-section-sub { font-size: 12px !important; margin-bottom: 20px !important; }
    .lp-audience-grid { grid-template-columns: 1fr !important; }
    .lp-audience-card-pad { padding: 20px 16px !important; }
    .lp-audience-title { font-size: 15px !important; letter-spacing: -0.2px !important; }
    .lp-audience-desc { font-size: 12px !important; margin-bottom: 14px !important; }
    .lp-step-text { font-size: 12px !important; }
    .lp-audience-btn { font-size: 12px !important; padding: 9px 14px !important; }
    .lp-features-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 8px !important; }
    .lp-feature-card-pad { padding: 14px 12px !important; }
    .lp-feature-name { font-size: 12px !important; }
    .lp-feature-desc { font-size: 11px !important; }
    .lp-proof-grid { grid-template-columns: 1fr !important; gap: 8px !important; }
    .lp-proof-card-pad { padding: 16px !important; }
    .lp-proof-text { font-size: 12px !important; }
    .lp-cta-pad { padding: 52px 4% !important; }
    .lp-cta-title { font-size: 24px !important; letter-spacing: -0.5px !important; }
    .lp-cta-sub { font-size: 13px !important; }
    .lp-trust-row { margin-top: 14px !important; gap: 12px !important; }
    .lp-footer-pad { padding: 36px 4% 18px !important; }
    .lp-footer-grid { grid-template-columns: 1fr 1fr !important; gap: 20px !important; }
    .lp-footer-brand-span { grid-column: 1 / -1 !important; }
  }
`;

export default CSS;
