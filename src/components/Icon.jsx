export default function Icon({ name, size = 16, style = {} }) {
  var icons = {
    home: "⊞",
    tasks: "✓",
    wallet: "◈",
    chart: "▦",
    users: "⬡",
    settings: "⚙",
    plus: "+",
    arrow: "→",
    check: "✓",
    x: "×",
    eye: "◉",
    edit: "✎",
    trash: "⌫",
    bell: "◎",
    search: "⌕",
    download: "↓",
    upload: "↑",
    star: "★",
    video: "▶",
    clock: "◷",
    award: "◆",
    lightning: "⚡",
    globe: "◎",
    blog: "✍",
    logout: "⎋",
    menu: "≡",
    back: "←",
    lock: "⊙",
    mail: "✉",
    coins: "◈",
    fire: "◈",
    target: "◎",
    gift: "⊕",
    trending: "↗",
    analytics: "▦",
    creator: "◈",
    admin: "⊕",
  };

  return (
    <span style={{ fontSize: size, lineHeight: 1, ...style }}>
      {icons[name] || "•"}
    </span>
  );
}
