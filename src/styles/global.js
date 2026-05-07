const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Inter:wght@500;600;700;800&family=Syne:wght@600;700;800&display=swap');

  /* ── DARK THEME (DEFAULT) ── */
  :root, body.theme-dark {
    --bg-surface: #0D0D14;
    --bg-card: rgba(255,255,255,0.03);
    --bg-input: rgba(255,255,255,0.05);
    --bg-glass: rgba(13, 13, 20, 0.75);
    
    --text-main: #ffffff;
    --text-muted: #8B8B9E;
    --text-invert: #0D0D14;
    
    --border-line: rgba(255,255,255,0.08);
    --border-strong: rgba(255,255,255,0.15);
    
    --brand-lime: #A8FF3E;
    --brand-lime-text: #A8FF3E;
    --brand-lime-dim: rgba(168,255,62,0.12);
    
    --shadow-card: none;
    --shadow-glass: 0 20px 40px rgba(0,0,0,0.5);
    
    --color-red: #ef4444;
    --color-orange: #f59e0b;
  }

  /* ── LIGHT THEME (PREMIUM SaaS) ── */
  body.theme-light {
    --bg-surface: #F9FAFB;     /* Very soft off-white */
    --bg-card: #FFFFFF;        /* Pure white cards */
    --bg-input: #F3F4F6;       /* Subtle grey for inputs */
    --bg-glass: rgba(255, 255, 255, 0.85);
    
    --text-main: #111827;      /* Crisp, near-black */
    --text-muted: #6B7280;     /* Slate grey */
    --text-invert: #ffffff;
    
    --border-line: #E5E7EB;    /* Clean, visible lines */
    --border-strong: #D1D5DB;
    
    --brand-lime: #A8FF3E;     /* Keep solid green for button backgrounds */
    --brand-lime-text: #4D7C0F; /* Darker green for text readability */
    --brand-lime-dim: #ECFCCB; /* Soft green success bg */
    
    --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    --shadow-glass: 0 20px 40px rgba(0,0,0,0.08);
    
    --color-red: #dc2626;
    --color-orange: #d97706;
  }

  /* Global Resets */
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { 
    font-family: 'DM Sans', sans-serif; 
    background-color: var(--bg-surface); 
    color: var(--text-main);
    transition: background-color 0.3s ease, color 0.3s ease;
  }
`;

export default CSS;
