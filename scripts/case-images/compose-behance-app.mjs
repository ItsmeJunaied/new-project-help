// Builds the eight /public/images/case/ slots for a mobile app case study.
//
// This is the sibling of crop-behance.mjs and exists because the two kinds of
// Behance project need opposite treatment. A web project arrives as a handful
// of enormous presentation boards, and the work is choosing a region of one —
// crop-behance.mjs. An app project arrives as its screens, exported at phone
// size: here, ten artboards 390px wide inside a transparent shadow margin,
// the tallest 2273px. Every slot in the library is landscape and at least
// 800px across, so there is no region of a 390px screen to crop. Cropping one
// would mean upscaling it four to six times, which is precisely the soft,
// washed-out result this pipeline was rewritten to avoid.
//
// So nothing here is cropped to the slot. The slots are COMPOSED: screens are
// placed on a canvas at or below their native resolution, so every pixel the
// page serves is a pixel the designer drew or a downscale of one. The largest
// scale factor in the set is 0.86.
//
// Usage:  node scripts/case-images/compose-behance-app.mjs <sources-dir> [--write]
//         without --write it renders into <sources-dir>/out/ for review.
import sharp from "sharp";
import path from "node:path";
import { mkdirSync, statSync } from "node:fs";

const SLUG = "quickbite-food-delivery-app";

/** Target size per slot, matching every other case study in the library. */
const SIZES = {
  card: [2048, 1024],
  hero: [2560, 1220],
  banner: [2560, 960],
  "problem-1": [800, 800],
  "problem-2": [800, 800],
  "problem-3": [800, 800],
  "solution-1": [1200, 780],
  "solution-2": [1200, 780],
};

/**
 * How much of each slot the page actually puts on screen, as a fraction of the
 * file's width and height. NOTHING THAT MATTERS MAY SIT OUTSIDE IT.
 *
 * A slot's dimensions are not its composition area. Every frame on the site is
 * a fixed pixel height with a fluid width and `object-cover`, so the file is
 * cropped to whatever aspect the frame happens to be at the reader's window —
 * and the hero and banner are inside ParallaxImage, which makes its moving
 * layer OVERSCAN (16%) taller than the frame and drifts it +/-5%. The frame
 * therefore shows 1/1.16 of the layer's height, and only the middle
 * 1/1.16 - 0.10 = 76% of it is on screen for the whole of the travel.
 *
 * The numbers below are the worst case over window widths from 768px up,
 * measured against the rendered page rather than guessed:
 *
 *   hero      frame 440/679px tall, worst at a 1024px window: 929 / (679*1.16)
 *             = 1.180 against the file's 2.099, so 56% of the width survives
 *   banner    frame 380/535px tall, same window: 929 / (535*1.16) = 1.497
 *             against 2.667, again 56%
 *   card      the listing runs two-up from 1024px, and a two-up cell is at its
 *             smallest the moment that kicks in: (929-20)/2 = 454 wide against
 *             a 500px frame, so 454 / (500*1.16) = 0.783 against 2.000 and
 *             only 39% of the width is left. A 1440px window gives 58%, which
 *             is why this is the one slot where measuring at one width and
 *             stopping would have been wrong.
 *   problem   three up inside a 710px column, 226px tall; at 768px the cells
 *             are 233x180, so a square file keeps 77% of its height
 *   solution  two up in the same column; 355x200 at 768px keeps 87%
 *
 * This is the thing a first pass gets wrong. Laying five phones across the
 * hero with even margins puts two of them under the crop at anything narrower
 * than a desktop — the file is perfect and the page still shows half a phone.
 */
const VISIBLE = {
  card: { w: 0.391, h: 0.762 },
  hero: { w: 0.562, h: 0.762 },
  banner: { w: 0.561, h: 0.762 },
  "problem-1": { w: 1, h: 0.772 },
  "problem-2": { w: 1, h: 0.772 },
  "problem-3": { w: 1, h: 0.772 },
  "solution-1": { w: 1, h: 0.866 },
  "solution-2": { w: 1, h: 0.866 },
};

/**
 * Shrink every window by this before composing into it. The fractions above
 * are exact for the breakpoints they were measured at, and a scrollbar, a
 * rounded layout width or a browser that resolves a fractional pixel the other
 * way moves them by a few. Content sized to exactly fill a band is content one
 * pixel from being clipped, so it is sized to fill 96% of one instead.
 */
const SAFETY = 0.96;

/**
 * The cover board, which is the only landscape artwork in the project and the
 * only thing in it that carries the name.
 */
const COVER = "00.png";

/**
 * Each screen as [file, left, top, height] — the opaque artboard inside the
 * export's transparent shadow margin, cut to the height given.
 *
 * The margin is why the left/top are not zero: every export is a 390px-wide
 * artboard sitting inside a larger canvas, with the designer's own drop shadow
 * painted into the alpha channel. Taking the whole file would composite that
 * shadow onto our background as a grey halo, so the artboard is extracted by
 * its opaque bounding box and given a shadow of ours instead.
 *
 * The heights are cut points, not the full export. 390x884 is this app's
 * viewport — the two screens that fit on one phone, the splash and the cart,
 * are exactly that — and the scroll screens run to 2273. Each one is cut at
 * the empty band nearest 884: a run of rows where nothing varies by more than
 * 18 levels across the screen's width, so the cut lands between two cards and
 * never through one. Where the whole screen is only a little over the
 * viewport (login, sign-up, tracking) it is left whole instead of shaved.
 *
 * Both parts of that matter, and both are lessons off the previous case study.
 * Finding the bands by luminance VARIANCE rather than brightness missed them
 * on a dark theme; here the theme is light and flatness is the right measure,
 * but the same rule holds — a row inside a card can be as uniform as the page
 * behind it, so short runs are ignored and only bands of eight rows or more
 * are treated as a boundary.
 *
 * The one cut worth recording as rejected: the home screen also has a band at
 * y1039, which would have shown one more restaurant card. It sits inside the
 * next card's photograph rather than below it, so 811 is used instead.
 */
const SCREENS = {
  splash: ["01.png", 0, 0, 884],
  login: ["02.png", 38, 13, 960],
  signup: ["03.png", 20, 0, 992],
  home: ["04.png", 38, 13, 811],
  browse: ["05.png", 0, 0, 751],
  menu: ["06.png", 14, 0, 894],
  cart: ["07.png", 38, 13, 884],
  checkout: ["08.png", 38, 13, 933],
  tracking: ["09.png", 38, 13, 1087],
  profile: ["10.png", 2, 0, 902],
};

const ART_WIDTH = 390;

/**
 * Which screens each slot carries, the gap between them, and how many of them
 * the crop is required to leave whole.
 *
 * Screens in a slot are drawn at ONE scale and stood on ONE baseline, so they
 * read as a row of phones rather than a collage. The scale is whatever makes
 * the tallest of them fit the visible band — never more than 1, so a slot is
 * sooner sparse than soft — and the row is centred, which puts the baseline
 * and the tallest screen's top on the band's two edges.
 *
 * `whole` is the promise the geometry has to keep. The square and landscape
 * slots keep their full width at every window, so all of their screens are
 * guaranteed. The hero and banner keep 57%, which is room for three phones
 * and no more: they are laid out five wide so a desktop reader gets the whole
 * row, with the understanding that a narrow window sees the middle three and
 * the outer two run off the frame the way a row of anything does.
 *
 * The sets are the app in order. The hero is what the product does end to end
 * — find a restaurant, read the menu, fill a cart, pay, watch it arrive — with
 * the cart dead centre, and the banner is everything around that: signing in,
 * browsing, the account.
 */
const SLOTS = [
  { slot: "hero", screens: ["home", "menu", "cart", "checkout", "tracking"], gap: 150, whole: 3 },
  { slot: "banner", screens: ["splash", "signup", "login", "browse", "profile"], gap: 170, whole: 3 },
  { slot: "problem-1", screens: ["splash", "signup"], gap: 120, whole: 2 },
  { slot: "problem-2", screens: ["browse", "home"], gap: 80, whole: 2 },
  { slot: "problem-3", screens: ["cart", "checkout"], gap: 120, whole: 2 },
  { slot: "solution-1", screens: ["home", "browse", "menu"], gap: 70, whole: 3 },
  { slot: "solution-2", screens: ["checkout", "tracking", "profile"], gap: 90, whole: 3 },
];

/**
 * The page behind the phones, as a diagonal gradient between the two corners
 * of the cover board — #c44318 at its top left, #e8603a at its bottom right.
 * Taking the backdrop off the designer's own artwork rather than picking an
 * orange keeps the eight slots and the cover in one palette. It is deliberately
 * darker than the brand #f45925 the splash screen is painted in, so that the
 * splash reads as a screen on a page rather than dissolving into it.
 */
const GRADIENT_FROM = "#c44318";
const GRADIENT_TO = "#e8603a";

const svg = (markup) => Buffer.from(markup);

const background = (w, h) =>
  svg(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="${GRADIENT_FROM}"/>` +
      `<stop offset="1" stop-color="${GRADIENT_TO}"/>` +
      `</linearGradient></defs>` +
      `<rect width="${w}" height="${h}" fill="url(#g)"/></svg>`,
  );

const radiusFor = (width) => Math.round(width * 0.105);

/**
 * A screen, scaled, with the phone's corner radius cut out of it. The radius is
 * proportional, so the corners match across slots that draw the same screen at
 * different sizes, and it is applied to every screen rather than only the cut
 * ones — a straight bottom edge is what makes a cut look like a cut.
 */
async function phone(src, name, width) {
  const [file, left, top, height] = SCREENS[name];
  const h = Math.round((height * width) / ART_WIDTH);
  const radius = radiusFor(width);

  const image = await sharp(path.join(src, file))
    .extract({ left, top, width: ART_WIDTH, height })
    .resize(width, h, { kernel: "lanczos3" })
    .composite([
      {
        input: svg(
          `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${h}">` +
            `<rect width="${width}" height="${h}" rx="${radius}" ry="${radius}" fill="#fff"/></svg>`,
        ),
        blend: "dest-in",
      },
    ])
    .png()
    .toBuffer();

  return { image, width, height: h };
}

/**
 * Every phone's shadow in one pass, drawn and blurred across the whole canvas
 * rather than per screen. Blurring each one on its own padded tile looks the
 * same until a screen stands near an edge — the tile then reaches past the
 * canvas, which sharp refuses to composite, and trimming it would square off
 * the falloff on that side. One canvas-sized layer has no edge to run past.
 */
async function shadowLayer(W, H, rects, width) {
  const radius = radiusFor(width);
  const body = rects
    .map(
      (r) =>
        `<rect x="${r.left}" y="${r.top}" width="${r.width}" height="${r.height}" ` +
        `rx="${radius}" ry="${radius}" fill="#4a1405"/>`,
    )
    .join("");
  return sharp(
    svg(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${body}</svg>`),
  )
    .blur(Math.max(2, width * 0.05))
    .png()
    .toBuffer();
}

// Interface screenshots, re-encoded once more by next/image on the way out, so
// both settings carry: 4:4:4 keeps colour at full resolution where 4:2:0 would
// average it over 2x2 blocks and bleed it off small text, and quality 94
// leaves next/image something clean to work from. Same as crop-behance.mjs.
const encode = (pipeline, file) =>
  pipeline
    .flatten({ background: GRADIENT_FROM })
    .jpeg({ quality: 94, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(file);

/** The centred rectangle of a slot that survives the crop at every window. */
function window_(slot) {
  const [W, H] = SIZES[slot];
  const { w, h } = VISIBLE[slot];
  const width = Math.round(W * w * SAFETY);
  const height = Math.round(H * h * SAFETY);
  return {
    left: Math.round((W - width) / 2),
    right: Math.round((W - width) / 2) + width,
    top: Math.round((H - height) / 2),
    bottom: Math.round((H - height) / 2) + height,
    width,
    height,
  };
}

/**
 * The card is the one slot that is not a row of phones. It is the cover board
 * itself, contained rather than cropped — the board is 1280x1080 and the slot
 * is twice as wide as it is tall, so filling it would cut either the name off
 * the top or the phones off the bottom. It is contained inside the VISIBLE
 * window rather than the file, because a listing card two-up keeps only 58% of
 * the width and 76% of the height, and fitting the board to the file instead
 * would have the parallax shave the top off the wordmark on every scroll.
 *
 * The margin that leaves is filled by stretching the board's own edge pixels
 * outward — its top and bottom rows upward and downward first, then the left
 * and right columns of that sideways. The background is a smooth diagonal
 * gradient, so a one-pixel line repeated continues it to within a level or
 * two, and every seam falls on the colour it is joining. A flat fill, or a
 * second gradient guessed to match, would show a band along each edge.
 */
async function composeCover(src, out) {
  const [W, H] = SIZES.card;
  const win = window_("card");
  const file = path.join(out, `${SLUG}-card.jpg`);
  const meta = await sharp(path.join(src, COVER)).metadata();

  const scale = Math.min(win.width / meta.width, win.height / meta.height);
  const width = Math.round(meta.width * scale);
  const height = Math.round(meta.height * scale);
  const left = Math.round((W - width) / 2);
  const top = Math.round((H - height) / 2);

  const board = await sharp(path.join(src, COVER))
    .resize(width, height, { kernel: "lanczos3" })
    .png()
    .toBuffer();

  const stretch = (input, box, w, h) =>
    sharp(input).extract(box).resize(w, h, { fit: "fill" }).png().toBuffer();

  // Up and down first, giving a full-height column of the board to work from.
  const tall = await sharp({
    create: { width, height: H, channels: 3, background: GRADIENT_FROM },
  })
    .composite([
      { input: await stretch(board, { left: 0, top: 0, width, height: 1 }, width, top), left: 0, top: 0 },
      {
        input: await stretch(board, { left: 0, top: height - 1, width, height: 1 }, width, H - top - height),
        left: 0,
        top: top + height,
      },
      { input: board, left: 0, top },
    ])
    .png()
    .toBuffer();

  // Then sideways, off that column, so the fill above and below the board
  // carries on out to the corners rather than stopping at the board's width.
  await encode(
    sharp({ create: { width: W, height: H, channels: 3, background: GRADIENT_FROM } }).composite([
      { input: await stretch(tall, { left: 0, top: 0, width: 1, height: H }, left, H), left: 0, top: 0 },
      {
        input: await stretch(tall, { left: width - 1, top: 0, width: 1, height: H }, W - left - width, H),
        left: left + width,
        top: 0,
      },
      { input: tall, left, top: 0 },
    ]),
    file,
  );

  console.log(
    `${"card".padEnd(11)} ${"cover".padEnd(6)} ${`${meta.width}x${meta.height} @${scale.toFixed(2)}x`.padEnd(20)}` +
      ` -> ${W}x${H}  ${String((statSync(file).size / 1024) | 0).padStart(4)}KB`,
  );
}

async function composeRow(src, out, { slot, screens, gap, whole }) {
  const [W, H] = SIZES[slot];
  const win = window_(slot);
  const file = path.join(out, `${SLUG}-${slot}.jpg`);

  // The row is centred in the visible band, which puts the baseline on the
  // band's lower edge and the tallest screen's top on its upper one.
  const floor = Math.round((H - win.height) / 2);
  const tallest = Math.max(...screens.map((name) => SCREENS[name][3]));
  // Never above 1: a slot with room to spare gets wider margins, not a screen
  // enlarged past the pixels it was drawn with.
  const scale = Math.min(1, (H - floor * 2) / tallest);
  const width = Math.round(ART_WIDTH * scale);

  const phones = [];
  for (const name of screens) phones.push(await phone(src, name, width));

  const span = phones.reduce((sum, p) => sum + p.width, 0) + gap * (phones.length - 1);
  const margin = Math.round((W - span) / 2);
  if (margin < 0) throw new Error(`${slot}: row is ${-margin * 2}px wider than the slot`);

  const drop = Math.round(width * 0.05);
  const layers = [];
  const rects = [];
  const placed = [];
  let x = margin;
  for (const p of phones) {
    const y = H - floor - p.height;
    rects.push({ left: x, top: y + drop, width: p.width, height: p.height });
    layers.push({ input: p.image, left: x, top: y });
    placed.push({ left: x, right: x + p.width });
    x += p.width + gap;
  }

  // The promise in `whole`, checked rather than assumed. A screen counts only
  // if both of its edges are inside the window that survives the crop at the
  // narrowest window the slot is designed for.
  const survivors = placed.filter((p) => p.left >= win.left && p.right <= win.right).length;
  if (survivors < whole) {
    throw new Error(
      `${slot}: only ${survivors} of ${phones.length} screens survive the crop, needs ${whole} ` +
        `(visible x ${win.left}-${win.right}, row x ${placed[0].left}-${placed[placed.length - 1].right})`,
    );
  }

  await encode(
    sharp({ create: { width: W, height: H, channels: 3, background: GRADIENT_FROM } }).composite([
      { input: background(W, H), left: 0, top: 0 },
      { input: await shadowLayer(W, H, rects, width), left: 0, top: 0 },
      ...layers,
    ]),
    file,
  );

  console.log(
    `${slot.padEnd(11)} ${String(phones.length).padEnd(6)} ${`390px @${scale.toFixed(2)}x, ${survivors} whole`.padEnd(20)}` +
      ` -> ${W}x${H}  ${String((statSync(file).size / 1024) | 0).padStart(4)}KB  ${screens.join(" ")}`,
  );
}

const src = process.argv[2];
if (!src) {
  console.error("usage: node compose-behance-app.mjs <sources-dir> [--write]");
  process.exit(1);
}
const write = process.argv.includes("--write");
const out = write ? path.resolve("public/images/case") : path.join(src, "out");
mkdirSync(out, { recursive: true });

await composeCover(src, out);
for (const spec of SLOTS) await composeRow(src, out, spec);
console.log(write ? `\nwrote into ${out}` : `\ndry run -> ${out}`);
