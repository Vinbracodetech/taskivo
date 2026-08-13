// ==========================================
// SMARTLINK ROTATOR ENGINE (10 Unique Monetag Links)
// ==========================================

export const SMART_LINKS = [
  'https://omg10.com/4/11559316',
  'https://omg10.com/4/11562945',
  'https://omg10.com/4/11565409',
  'https://omg10.com/4/11565422',
  'https://omg10.com/4/6424248',
  'https://omg10.com/4/11565430',
  'https://omg10.com/4/11565745',
  'https://omg10.com/4/11565747',
  'https://omg10.com/4/11565748',
  'https://omg10.com/4/11565749'
];

export function getTaskSmartLink() {
  const index = Math.floor(Math.random() * SMART_LINKS.length);
  return SMART_LINKS[index];
}
