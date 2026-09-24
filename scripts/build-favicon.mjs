/**
 * Builds the browser-tab icons from the logo's arrow mark.
 *
 * The full lockup is unreadable at 16px — three words and a tagline — so the
 * icon uses the mark alone on a brand-green tile, which keeps a recognisable
 * silhouette down to a favicon. Colours are read from app/globals.css and
 * lib/brand.ts so this follows a rebrand rather than pinning its own hex.
 *
 * Run: node scripts/build-favicon.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const SRC = "assets/brand/logo-source-vector.svg";

// The mark is knocked out in white on the green tile. The source artwork draws
// it in #111820, which is what the <g fill> below is matched on — that stays,
// it is how the mark's paths are located in the file.
const MARK = "#ffffff";

const green = readFileSync("app/globals.css", "utf8").match(
  /--color-primary-green:\s*(#[0-9a-fA-F]{6})/,
)[1];

// The wordmark sits below y=680 in the source artwork; everything above it is
// the mark.
const inkGroup = readFileSync(SRC, "utf8").match(/<g fill="#111820"[^>]*>([\s\S]*?)<\/g>/)[1];
const paths = [...inkGroup.matchAll(/ d="([^"]+)"/g)].map((m) => m[1]);

const bounds = (d) => {
  const n = d.match(/-?\d+(?:\.\d+)?/g) ?? [];
  let b = { x: 1e9, y: 1e9, X: -1e9, Y: -1e9 };
  for (let i = 0; i + 1 < n.length; i += 2) {
    const x = +n[i], y = +n[i + 1];
    b = { x: Math.min(b.x, x), y: Math.min(b.y, y), X: Math.max(b.X, x), Y: Math.max(b.Y, y) };
  }
  return b;
};

const mark = paths.filter((d) => bounds(d).Y < 680);
const box = mark.reduce(
  (a, d) => {
    const b = bounds(d);
    return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), X: Math.max(a.X, b.X), Y: Math.max(a.Y, b.Y) };
  },
  { x: 1e9, y: 1e9, X: -1e9, Y: -1e9 },
);

// A square viewBox centred on the mark. The arrow is about 2.5:1, so at 16px it
// is only a few pixels tall and the thin strokes disappear — small sizes get a
// tighter crop to buy back the height.
const geom = (pad) => {
  const side = (box.X - box.x) * pad;
  return { side, vx: (box.x + box.X) / 2 - side / 2, vy: (box.y + box.Y) / 2 - side / 2 };
};
const PAD_DEFAULT = 1.22;
const PAD_TIGHT = 1.02;
const { side } = geom(PAD_DEFAULT);

/**
 * `px` gives the raster a fixed size to render at; without it sharp scales the
 * viewBox by its density and blows past its pixel limit.
 */
const tile = (bg, ink, radius, px, pad = PAD_DEFAULT) => {
  const g = geom(pad);
  return `<svg xmlns="http://www.w3.org/2000/svg"${px ? ` width="${px}" height="${px}"` : ""} viewBox="${g.vx.toFixed(1)} ${g.vy.toFixed(1)} ${g.side.toFixed(1)} ${g.side.toFixed(1)}">
  <rect x="${g.vx.toFixed(1)}" y="${g.vy.toFixed(1)}" width="${g.side.toFixed(1)}" height="${g.side.toFixed(1)}" rx="${radius}" fill="${bg}"/>
  <g fill="${ink}" fill-rule="evenodd">
${mark.map((d) => `    <path d="${d}"/>`).join("\n")}
  </g>
</svg>
`;
};

// Rounded for the SVG favicon and the Apple touch icon; square for the .ico,
// which is composited onto the browser's own tab chrome.
writeFileSync("app/icon.svg", tile(green, MARK, Math.round(side * 0.18)));

const png = (size, radius, pad) =>
  // Rendered at 4x then downsampled, so the arrow stays clean at small sizes.
  sharp(Buffer.from(tile(green, MARK, radius, size * 4, pad)))
    .resize(size, size)
    .png()
    .toBuffer();

writeFileSync("app/apple-icon.png", await png(180, Math.round(side * 0.18)));

/**
 * A .ico is a tiny header plus whole PNGs, so it can be assembled here rather
 * than pulling in an encoder. Sizes 16/32/48 cover tabs, bookmarks and the
 * Windows task bar.
 */
const sizes = [16, 32, 48];
const images = await Promise.all(
  sizes.map((s) => png(s, 0, s <= 16 ? PAD_TIGHT : PAD_DEFAULT)),
);

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);

let offset = 6 + sizes.length * 16;
const entries = sizes.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s === 256 ? 0 : s, 0);
  e.writeUInt8(s === 256 ? 0 : s, 1);
  e.writeUInt8(0, 2);
  e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4);
  e.writeUInt16LE(32, 6);
  e.writeUInt32LE(images[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += images[i].length;
  return e;
});

writeFileSync("app/favicon.ico", Buffer.concat([header, ...entries, ...images]));

console.log(`icons built from the arrow mark on ${green}`);
console.log(`  app/icon.svg        square viewBox ${side.toFixed(0)}`);
console.log(`  app/apple-icon.png  180x180`);
console.log(`  app/favicon.ico     ${sizes.join("/")} px`);
