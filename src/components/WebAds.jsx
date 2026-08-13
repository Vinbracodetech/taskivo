import { useEffect } from 'react';

// ==========================================
// 1. MONETAG VIGNETTE (Clean Transition Ad for Blog)
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
// 2. SMARTLINK ROTATOR ENGINE (Zero-Script Architecture)
// ==========================================

export const SMART_LINKS = [
  // Monetag
  'https://omg10.com/4/11559316',
  'https://omg10.com/4/11562945',
  'https://omg10.com/4/11565409',
  'https://omg10.com/4/11565422',
  'https://omg10.com/4/6424248',
  'https://omg10.com/4/11565430',
  
  // Adsterra
  'https://www.effectivecpmnetwork.com/chezkq55y?key=76b312e871dafe4de49f97b2ad08fc06',
  'https://www.effectivecpmnetwork.com/gppu1a3pke?key=a932494789184a47a4304656508aaacc',
  'https://www.effectivecpmnetwork.com/tswcxv9a?key=8b23cafc193ceaf9521d2454138294a4',
  'https://www.effectivecpmnetwork.com/h8a6z71n?key=69cfa93263741db3c0968045cd313e8a'
];

export function getTaskSmartLink() {
  const index = Math.floor(Math.random() * SMART_LINKS.length);
  return SMART_LINKS[index];
}
