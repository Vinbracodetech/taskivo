// src/styles/global.js
const CSS = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif;
    background: #F7F8FA;
    color: #0D0D14;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
    width: 100%;
  }

  /* MOBILE FIRST - Base styles for all screen sizes */
  .app {
    display: flex;
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
  }

  /* Hide sidebar on mobile by default */
  .sidebar {
    display: none;
  }

  /* Main content - full width on mobile */
  .page {
    flex: 1;
    padding: 20px 16px;
    width: 100%;
    overflow-x: hidden;
  }

  /* Typography - Mobile sizes (small, readable) */
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

  p, li, span, div {
    font-size: 14px;
    line-height: 1.5;
  }

  /* Buttons - touch friendly */
  button {
    min-height: 44px;
    min-width: 44px;
    cursor: pointer;
  }

  /* Grid layouts - single column on mobile */
  .features-grid,
  .steps-grid,
  .admin-overview {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  /* Hero section */
  .hero {
    display: flex;
    flex-direction: column;
    padding: 48px 16px 60px 16px;
    text-align: center;
  }

  .hero-visual {
    display: none;
  }

  /* Auth page */
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

  /* Footer */
  .footer-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  /* Dashboard cards */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  /* Tables - make scrollable on mobile */
  .table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  table {
    min-width: 600px;
  }

  /* Form inputs - full width on mobile */
  input, select, textarea {
    width: 100%;
    padding: 12px;
    font-size: 16px;
  }

  /* Modal - full screen on mobile */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: white;
    z-index: 1000;
    overflow-y: auto;
  }

  /* Wallet and withdrawal cards */
  .wallet-grid,
  .withdrawal-methods {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  /* Admin panel */
  .admin-users,
  .admin-tasks,
  .admin-withdrawals {
    overflow-x: auto;
  }

  /* Creator dashboard */
  .creator-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  /* Task cards */
  .tasks-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }

  /* Task player */
  .task-player {
    padding: 16px;
  }

  .task-player iframe {
    width: 100%;
    height: 200px;
  }

  /* Toast notifications */
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

  /* TABLET STYLES (min-width: 768px) */
  @media (min-width: 768px) {
    .page {
      padding: 24px 32px;
    }

    h1 {
      font-size: 36px;
    }

    h2 {
      font-size: 28px;
    }

    h3 {
      font-size: 20px;
    }

    .hero {
      flex-direction: row;
      padding: 60px 40px;
      text-align: left;
      align-items: center;
      gap: 48px;
    }

    .hero-visual {
      display: block;
      flex: 1;
    }

    .hero-content {
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

    .features-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .steps-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .footer-grid {
      grid-template-columns: repeat(4, 1fr);
    }

    .stats-grid {
      grid-template-columns: repeat(4, 1fr);
    }

    .wallet-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .withdrawal-methods {
      grid-template-columns: repeat(2, 1fr);
    }

    .creator-stats {
      grid-template-columns: repeat(4, 1fr);
    }

    .tasks-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .admin-overview {
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
  }

  /* DESKTOP STYLES (min-width: 1024px) */
  @media (min-width: 1024px) {
    .page {
      padding: 32px 48px;
    }

    h1 {
      font-size: 48px;
    }

    h2 {
      font-size: 36px;
    }

    .features-grid {
      grid-template-columns: repeat(3, 1fr);
    }

    .tasks-grid {
      grid-template-columns: repeat(3, 1fr);
    }

    .hero {
      padding: 80px 60px;
    }
  }

  /* LARGE DESKTOP (min-width: 1440px) */
  @media (min-width: 1440px) {
    .page {
      padding: 40px 60px;
      max-width: 1400px;
      margin: 0 auto;
    }

    h1 {
      font-size: 56px;
    }

    .hero {
      padding: 100px 80px;
    }
  }

  /* Sidebar - only show on tablet/desktop */
  @media (min-width: 768px) {
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
  }

  /* Hide mobile menu button on tablet/desktop */
  .mobile-menu-btn {
    display: block;
  }

  @media (min-width: 768px) {
    .mobile-menu-btn {
      display: none;
    }
  }

  /* Utility classes */
  .text-center {
    text-align: center;
  }

  .text-lime {
    color: #A8FF3E;
  }

  .bg-lime {
    background: #A8FF3E;
  }

  .bg-dark {
    background: #0D0D14;
  }

  .bg-off {
    background: #F7F8FA;
  }

  .rounded-lg {
    border-radius: 12px;
  }

  .rounded-xl {
    border-radius: 16px;
  }

  .shadow-sm {
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }

  .shadow-md {
    box-shadow: 0 4px 6px rgba(0,0,0,0.07);
  }

  .p-4 {
    padding: 16px;
  }

  .p-6 {
    padding: 24px;
  }

  .mb-2 {
    margin-bottom: 8px;
  }

  .mb-4 {
    margin-bottom: 16px;
  }

  .mb-6 {
    margin-bottom: 24px;
  }

  .mt-4 {
    margin-top: 16px;
  }

  .flex {
    display: flex;
  }

  .flex-col {
    flex-direction: column;
  }

  .items-center {
    align-items: center;
  }

  .justify-between {
    justify-content: space-between;
  }

  .gap-2 {
    gap: 8px;
  }

  .gap-4 {
    gap: 16px;
  }

  .w-full {
    width: 100%;
  }
`;

export default CSS;
