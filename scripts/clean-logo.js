// Turns the VTracer output into a usable logo: drops the trace speckles,
// collapses ~600 near-identical fills down to two, and tightens the viewBox.
const fs = require('fs');

const SRC = process.argv[2];
const OUT = process.argv[3];
const INK = process.argv[4] || '#151515';
const MIN_AREA = +(process.argv[5] || 120);

const src = fs.readFileSync(SRC, 'utf8');
const lines = src.split('\n');

const isGreen = hex => {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return g > 90 && g > r * 1.5 && g > b * 1.5;
};

const items = [];
for (const line of lines) {
  const d = (line.match(/\bd="([^"]+)"/) || [])[1];
  if (!d) continue;
  const fill = ((line.match(/\bfill="([^"]+)"/) || [])[1] || '#000000').toUpperCase();
  const tr = line.match(/translate\(([-\d.]+),\s*([-\d.]+)\)/);
  const tx = tr ? +tr[1] : 0, ty = tr ? +tr[2] : 0;

  const nums = d.match(/-?\d*\.?\d+/g) || [];
  let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    const x = +nums[i] + tx, y = +nums[i + 1] + ty;
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
  }
  items.push({ d, fill, tx, ty, minX, minY, maxX, maxY, area: (maxX - minX) * (maxY - minY), green: isGreen(fill) });
}

// The brand green: area-weighted mean of the green paths, which is dominated by
// the HELP letterforms rather than the anti-aliasing crumbs around them.
const greens = items.filter(i => i.green);
let R = 0, G = 0, B = 0, W = 0;
for (const p of greens) {
  const w = p.area;
  R += parseInt(p.fill.slice(1, 3), 16) * w;
  G += parseInt(p.fill.slice(3, 5), 16) * w;
  B += parseInt(p.fill.slice(5, 7), 16) * w;
  W += w;
}
const hx = n => Math.round(n).toString(16).padStart(2, '0').toUpperCase();
const GREEN = process.env.BRAND_GREEN || `#${hx(R / W)}${hx(G / W)}${hx(B / W)}`;

const keep = items.filter(i => i.area >= MIN_AREA);
const b = keep.reduce((a, p) => ({
  minX: Math.min(a.minX, p.minX), minY: Math.min(a.minY, p.minY),
  maxX: Math.max(a.maxX, p.maxX), maxY: Math.max(a.maxY, p.maxY),
}), { minX: 1e9, minY: 1e9, maxX: -1e9, maxY: -1e9 });

const pad = 2;
const vb = { x: b.minX - pad, y: b.minY - pad, w: (b.maxX - b.minX) + pad * 2, h: (b.maxY - b.minY) + pad * 2 };

// The trace carries two decimals on a ~1370-unit canvas, which is far past what
// any rendered size can show. Rounding to whole units is invisible and roughly
// halves the file.
const round = d => d.replace(/-?\d*\.?\d+/g, n => String(Math.round(+n)));

const body = keep.map(p =>
  `<path d="${round(p.d)}" fill="${p.green ? GREEN : INK}" transform="translate(${p.tx},${p.ty})"/>`
).join('\n');

const out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.x.toFixed(1)} ${vb.y.toFixed(1)} ${vb.w.toFixed(1)} ${vb.h.toFixed(1)}" role="img" aria-label="Project Help — Software Company">
${body}
</svg>
`;
fs.writeFileSync(OUT, out);

console.log(`${SRC.split(/[\\/]/).pop()}`);
console.log(`  paths ${items.length} -> ${keep.length} kept (dropped ${items.length - keep.length} specks under area ${MIN_AREA})`);
console.log(`  brand green ${GREEN}   ink ${INK}`);
console.log(`  viewBox ${vb.w.toFixed(0)}x${vb.h.toFixed(0)}  aspect ${(vb.w / vb.h).toFixed(3)}`);
console.log(`  ${(fs.statSync(SRC).size / 1024).toFixed(0)} KB -> ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB`);
