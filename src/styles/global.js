// src/styles/global.js
const CSS = `
  /* =========================
     RESET
  ========================== */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    max-width: 100%;
  }

  body {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif;
    background: #F7F8FA;
    color: #0D0D14;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  /* =========================
     APP LAYOUT (MOBILE FIRST)
  ========================== */
  .app {
    display: flex;
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
  }

  .sidebar {
    display: none;
  }

  .page {
    flex: 1;
    padding: 20px 16px;
    width: 100%;
  }

  /* =========================
     TYPOGRAPHY
  ========================== */
  h1 {
    font-size: 28px;
    line-height: 1.2;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
  }

  h2 {
    font-size: 22px;
    line-height: 1.25;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
  }

  h3 {
    font-size: 18px;
    line-height: 1.3;
    font-family: 'Syne', sans-serif;
    font-weight: 700;
  }

  p, li {
    font-size: 14px;
    line-height: 1.5;
  }

  /* =========================
     BUTTONS / INPUTS
  ========================== */
  button {
    min-height: 44px;
    min-width: 44px;
    cursor: pointer;
  }

  input, select, textarea {
    width: 100%;
    padding: 12px;
    font-size: 16px;
  }

  /* =========================
     LAYOUT SYSTEMS
  ========================== */
  .features-grid,
  .steps-grid,
  .admin-overview,
  .wallet-grid,
  .withdrawal-methods,
  .tasks-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .stats-grid,
  .creator-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  /* =========================
     HERO
  ========================== */
  .hero {
    display: flex;
    flex-direction: column;
    padding: 48px 16px 60px;
    text-align: center;
  }

  .hero-visual {
    display: none;
  }

  /* =========================
     AUTH
  ========================== */
  .auth-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .auth-left {
    display: none;
  }

  .auth-right {
    padding: 40px 20px;
    width: 100%;
  }

  /* =========================
     TABLES
  ========================== */
  .table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  table {
    min-width: 600px;
  }

  /* =========================
     MODAL
  ========================== */
  .modal {
    position: fixed;
    inset: 0;
    background: white;
    z-index: 1000;
    overflow-y: auto;
  }

  body.modal-open {
    overflow: hidden;
  }

  /* =========================
     TASK PLAYER
  ========================== */
  .task-player {
    padding: 16px;
  }

  .task-player iframe {
    width: 100%;
    height: 200px;
  }

  /* =========================
     TOAST
  ========================== */
  .toast {
    position: fixed;
    bottom: 20px;
    left: 16px;
    right: 16px;
    background: #0D0D14;
    color: #A8FF3E;
    padding: 14px 16px;
    border-radius: 12px;
    z-index: 1100;
    text-align: center;
  }

  /* =========================
     UTILITIES
  ========================== */
  .text-center { text-align: center; }
  .text-lime { color: #A8FF3E; }
  .bg-lime { background: #A8FF3E; }
  .bg-dark { background: #0D0D14; }
  .bg-off { background: #F7F8FA; }

  .rounded-lg { border-radius: 12px; }
  .rounded-xl { border-radius: 16px; }

  .shadow-sm { box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
  .shadow-md { box-shadow: 0 4px 6px rgba(0,0,0,0.07); }

  .p-4 { padding: 16px; }
  .p-6 { padding: 24px; }

  .mb-2 { margin-bottom: 8px; }
  .mb-4 { margin-bottom: 16px; }
  .mb-6 { margin-bottom: 24px; }
  .mt-4 { margin-top: 16px; }

  .flex { display: flex; }
  .flex-col { flex-direction: column; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }

  .gap-2 { gap: 8px; }
  .gap-4 { gap: 16px; }

  .w-full { width: 100%; }

  /* =========================
     TABLET (768px+)
  ========================== */
  @media (min-width: 768px) {
    .page {
      padding: 24px 32px;
    }

    h1 { font-size: 36px; }
    h2 { font-size: 28px; }
    h3 { font-size: 20px; }

    .hero {
      flex-direction: row;
      text-align: left;
      align-items: center;
      gap: 48px;
      padding: 60px 40px;
    }

    .hero-visual {
      display: block;
      flex: 1;
    }

    .auth-page {
      flex-direction: row;
    }

    .auth-left {
      display: flex;
      flex: 1;
      background: #0D0D14;
      align-items: center;
      justify-content: center;
    }

    .auth-right {
      flex: 1;
      padding: 48px;
    }

    .features-grid,
    .steps-grid,
    .tasks-grid,
    .admin-overview {
      grid-template-columns: repeat(2, 1fr);
    }

    .stats-grid,
    .creator-stats {
      grid-template-columns: repeat(4, 1fr);
    }

    .wallet-grid,
    .withdrawal-methods {
      grid-template-columns: repeat(2, 1fr);
    }

    .task-player iframe {
      height: 400px;
    }

    .toast {
      left: auto;
      right: 24px;
      bottom: 24px;
      min-width: 300px;
      max-width: 400px;
    }

    .sidebar {
      display: flex;
      flex-direction: column;
      width: 260px;
      background: #0D0D14;
      color: white;
      position: sticky;
      top: 0;
      height: 100vh;
    }

    .mobile-menu-btn {
      display: none;
    }
  }

  /* =========================
     DESKTOP (1024px+)
  ========================== */
  @media (min-width: 1024px) {
    .page {
      padding: 32px 48px;
    }

    h1 { font-size: 48px; }
    h2 { font-size: 36px; }

    .features-grid,
    .tasks-grid {
      grid-template-columns: repeat(3, 1fr);
    }

    .hero {
      padding: 80px 60px;
    }
  }

  /* =========================
     LARGE DESKTOP (1440px+)
  ========================== */
  @media (min-width: 1440px) {
    .page {
      max-width: 1400px;
      margin: 0 auto;
      padding: 40px 60px;
    }

    h1 {
      font-size: 56px;
    }

    .hero {
      padding: 100px 80px;
    }
  }
`;

export default CSS;
