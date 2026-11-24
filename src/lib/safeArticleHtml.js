// Restrictive article HTML serializer. Never copies untrusted attributes or tag names.
// Preserves common editorial markup, with links limited to HTTP(S) or same-origin paths.
const allowed = new Set('p h2 h3 h4 h5 h6 ul ol li strong b em i u s blockquote code pre br hr table thead tbody tr th td a div span figure figcaption'.split(' '));
const escapeText = s => s.replace(/</g,'&lt;').replace(/>/g,'&gt;');
const escapeAttr = s => s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
export function safeArticleHtml(value) {
  const source = String(value || '');
  const tokens = /<!--[\s\S]*?-->|<\/?[a-zA-Z][a-zA-Z0-9:-]*(?:\s+[^<>]*?)?\s*\/?>/g;
  let result = '', pos = 0;
  for (const match of source.matchAll(tokens)) {
    result += escapeText(source.slice(pos,match.index));
    pos = match.index + match[0].length;
    const token = match[0];
    const parts = /^<(\/?)([a-zA-Z][a-zA-Z0-9:-]*)/.exec(token);
    if (!parts) continue;
    const name = parts[2].toLowerCase();
    if (!allowed.has(name)) continue;
    if (parts[1]) { if (!['br','hr'].includes(name)) result += '</'+name+'>'; continue; }
    if (name === 'a') {
      const href = /\shref\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(token);
      const url = href?.[1] ?? href?.[2] ?? '';
      if (/^https?:\/\//i.test(url) || /^\/(?![\/\\])/.test(url)) {
        result += '<a href="'+escapeAttr(url)+'" rel="noopener noreferrer">';
        continue;
      }
    }
    result += '<'+name+'>';
  }
  return result + escapeText(source.slice(pos));
}
