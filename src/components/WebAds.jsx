import { useEffect } from 'react';

// ==========================================
// 1. MONETAG ENGINES (For the Blog Section)
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
// 2. ADSTERRA ENGINES (For Dashboards & Video)
// ==========================================

export function AdsterraPopunder() {
  useEffect(() => {
    if (document.getElementById('adsterra-popunder-script')) return;
    const script = document.createElement('script');
    script.id = 'adsterra-popunder-script';
    script.src = 'https://pl30808723.effectivecpmnetwork.com/58/d2/e7/58d2e79410a6c088850430f1999359da.js';
    script.async = true;
    (document.body || document.documentElement).appendChild(script);

    return () => {
      const el = document.getElementById('adsterra-popunder-script');
      if (el) el.remove();
    };
  }, []);
  return null;
}

export function AdsterraSocialBar() {
  useEffect(() => {
    if (document.getElementById('adsterra-social-script')) return;
    const script = document.createElement('script');
    script.id = 'adsterra-social-script';
    script.src = 'https://pl30808724.effectivecpmnetwork.com/b6/a3/d0/b6a3d076da13e4327e465e6fa5a66f6e.js';
    script.async = true;
    (document.body || document.documentElement).appendChild(script);

    return () => {
      const el = document.getElementById('adsterra-social-script');
      if (el) el.remove();
    };
  }, []);
  return null;
}


// ==========================================
// 3. SMARTLINK ROTATOR ENGINE
// ==========================================

export const SMART_LINKS = [
  'https://omg10.com/4/11559316', // Monetag Link
  'https://www.effectivecpmnetwork.com/chezkq55y?key=76b312e871dafe4de49f97b2ad08fc06', // Adsterra Link 1
  'https://www.effectivecpmnetwork.com/gppu1a3pke?key=a932494789184a47a4304656508aaacc', // Adsterra Link 2
];

export function getTaskSmartLink() {
  const index = Math.floor(Math.random() * SMART_LINKS.length);
  return SMART_LINKS[index];
            }
