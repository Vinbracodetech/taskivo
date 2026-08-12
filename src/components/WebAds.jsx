import { useEffect } from 'react';

// ==========================================
// 1. MONETAG POPUNDER (High-Yield OnClick)
// ==========================================

export function MonetagPopunder() {
  useEffect(() => {
    if (document.getElementById('monetag-popunder-script')) return;

    const script = document.createElement('script');
    script.id = 'monetag-popunder-script';
    script.dataset.zone = '11559303';
    script.src = 'https://al5sm.com/tag.min.js';
    script.async = true;
    
    (document.body || document.documentElement).appendChild(script);

    return () => {
      const el = document.getElementById('monetag-popunder-script');
      if (el) el.remove();
    };
  }, []);

  return null;
}

// ==========================================
// 2. MONETAG VIGNETTE (Clean Transition Ad)
// ==========================================

export function MonetagVignette() {
  useEffect(() => {
    if (document.getElementById('monetag-vignette-script')) return;

    const script = document.createElement('script');
    script.id = 'monetag-vignette-script';
    script.dataset.zone = '11559334';
    script.src = 'https://n6wxm.com/vignette.min.js';
    script.async = true;
    
    (document.body || document.documentElement).appendChild(script);

    return () => {
      const el = document.getElementById('monetag-vignette-script');
      if (el) el.remove();
    };
  }, []);

  return null;
}

// ==========================================
// 3. SMARTLINK ROTATOR ENGINE (Monetag Only)
// ==========================================

export const SMART_LINKS = [
  'https://omg10.com/4/11559316', // Primary Monetag Link
  // Add your 2nd and 3rd Monetag SmartLinks here when generated
];

export function getTaskSmartLink() {
  const index = Math.floor(Math.random() * SMART_LINKS.length);
  return SMART_LINKS[index];
}
