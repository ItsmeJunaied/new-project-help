// Cuts a Behance project board into the eight /public/images/case/ slots.
//
// A Behance project is a handful of very large presentation boards, not eight
// ready-cropped slot images, so the work is choosing a region of a board per
// slot. Slot sizes below are the library's, read off the existing entries —
// a new case study lands at the same dimensions as every other one.
//
// Usage:  node scripts/case-images/crop-behance.mjs <sources-dir> [--write]
//         without --write it renders into <sources-dir>/crops/ for review.
import sharp from "sharp";
import path from "node:path";
import { mkdirSync } from "node:fs";

const SLUG = "cryptobit-crypto-trading";

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
 * a.png is the laptop mockup on a shelf — the only board with a photographic
 * frame, so it takes the two slots that run full-bleed. b.png is the whole
 * page as two 857px columns inside a 2000x1600 board (left x100-957, right
 * x1043-1900), which is where every section crop comes from.
 * [left, top, width, height].
 *
 * Every box below is chosen so that nothing is sliced. On a.png that means
 * containing the whole laptop (x640-1530, y430-1210) rather than filling the
 * frame with it. On b.png it means both edges landing in an empty band — a
 * run of rows carrying no text, border, icon or chart line:
 *
 *   left   100-119  147-217  380-406  634-684  740-750  774-816
 *          1048-1071  1304-1314  1374-1480  1537-1547  1571-1599
 *   right    0-70    127-136  161-198  225-238  433-455  468-583
 *          640-650  674-693  721-749  1078-1194  1250-1259  1281-1324
 *
 * A crop beginning and ending inside one of those cannot cut through a card,
 * a heading or a chart, which an eyeballed box did in six slots out of eight.
 *
 * Finding the bands by luminance *variance* was the mistake worth recording:
 * the feature cards are only a few levels lighter than the page behind them,
 * so a row inside them varies no more than one of true background and the
 * run below them read as starting ten pixels early — enough to shave the
 * last line of card text. They are found by brightness instead: a row is
 * empty when nothing on it rises above the panel and nothing differs much
 * from its neighbours.
 *
 * Only bands of 20 rows or more are used as edges. A shorter one is as often
 * the padding inside a card as it is the space between two sections, and the
 * first pass at problem-2 began in one — starting the crop inside the
 * activity card, below its own heading. Against that rule b.png yields just
 * two clean squares, so the third comes from the laptop board instead.
 *
 * Two regions of b.png are still never cropped:
 *
 *   - The grey gutter between the columns, x957-1043. A slot wide enough to
 *     span both would carry it down the middle as a seam, so the banner is
 *     composited from the two columns instead (see `join`).
 *   - The testimonial band, right column below y1331. The designer left the
 *     template's own copy in it — the quotes praise a calendar app, by name
 *     — which is not something to print on a crypto trading case study. The
 *     section's heading is above that line and is fine to show.
 */
const JOBS = [
  // All three of these hold the entire laptop rather than filling the frame
  // with it. The card is essentially native size at 2000 across, and the
  // square is a downscale, which makes it the sharpest slot in the set.
  { slot: "card", src: "a.png", crop: [0, 280, 2000, 1000] },
  { slot: "hero", src: "a.png", crop: [0, 300, 2000, 952] },
  { slot: "problem-3", src: "a.png", crop: [480, 330, 1180, 1180] },
  // Two whole sections butted together — feature cards with market analytics,
  // and the pricing table — so the widest slot reads as a system, not a
  // screen, and without the grey gutter that sits between the columns.
  {
    slot: "banner",
    join: [
      { src: "b.png", crop: [100, 816, 857, 642] },
      { src: "b.png", crop: [1043, 470, 857, 642] },
    ],
  },
  // Hero through the three feature cards, starting below the nav.
  { slot: "problem-1", src: "b.png", crop: [100, 203, 857, 857] },
  // The pricing table whole, with the section heading that follows it.
  { slot: "problem-2", src: "b.png", crop: [1043, 455, 857, 857] },
  // The smart-tools section whole, padded by the empty bands either side.
  { slot: "solution-1", src: "b.png", crop: [1043, 26, 857, 557] },
  // Feature cards with the balance chart and live price list under them.
  { slot: "solution-2", src: "b.png", crop: [100, 817, 857, 557] },
];
const src = process.argv[2];
if (!src) {
  console.error("usage: node crop-behance.mjs <sources-dir> [--write]");
  process.exit(1);
}
const write = process.argv.includes("--write");
const out = write
  ? path.resolve("public/images/case")
  : path.join(src, "crops");
mkdirSync(out, { recursive: true });

// These are interface screenshots, not photographs, and they are re-encoded
// once more by next/image on the way out. Both settings matter for that:
//
//   - 4:2:0 averages colour over 2x2 blocks. On a photograph nobody sees it;
//     on coloured text against near-black — a violet heading, a green or red
//     percentage — it smears the colour off the glyphs, which is most of why
//     the first pass looked washed out. 4:4:4 keeps colour at full resolution.
//   - Quality 86 banded the dark blue gradients. 94 costs a few hundred KB
//     across the set and leaves next/image something clean to work from.
const encode = (pipeline, file) =>
  pipeline
    .flatten({ background: "#0b1020" })
    .jpeg({ quality: 94, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toFile(file);

for (const job of JOBS) {
  const [w, h] = SIZES[job.slot];
  const file = path.join(out, `${SLUG}-${job.slot}.jpg`);
  let from;

  if (job.join) {
    // Cut each column, then butt them together on one canvas before the
    // single resize to the slot, so neither half is scaled twice.
    const parts = await Promise.all(
      job.join.map(async (part) => {
        const [left, top, width, height] = part.crop;
        return {
          width,
          height,
          buffer: await sharp(path.join(src, part.src))
            .extract({ left, top, width, height })
            .png()
            .toBuffer(),
        };
      }),
    );
    const joined = await sharp({
      create: {
        width: parts.reduce((sum, p) => sum + p.width, 0),
        height: Math.max(...parts.map((p) => p.height)),
        channels: 3,
        background: "#0b1020",
      },
    })
      .composite(
        parts.map((p, i) => ({
          input: p.buffer,
          left: parts.slice(0, i).reduce((sum, q) => sum + q.width, 0),
          top: 0,
        })),
      )
      .png()
      .toBuffer();
    from = `${parts.map((p) => `${p.width}x${p.height}`).join(" + ")}`;
    await encode(sharp(joined).resize(w, h, { fit: "fill", kernel: "lanczos3" }), file);
  } else {
    const [left, top, width, height] = job.crop;
    from = `${width}x${height}`;
    await encode(
      sharp(path.join(src, job.src))
        .extract({ left, top, width, height })
        // fit:"fill" is deliberate: the crop box is already cut to the slot's
        // ratio above, so there is nothing left to letterbox or trim.
        .resize(w, h, { fit: "fill", kernel: "lanczos3" }),
      file,
    );
  }

  const meta = await sharp(file).metadata();
  console.log(
    `${job.slot.padEnd(11)} ${(job.src ?? "join").padEnd(6)} ${from.padEnd(19)} -> ${meta.width}x${meta.height}  ${(meta.size / 1024) | 0}KB`,
  );
}
console.log(write ? `\nwrote into ${out}` : `\ndry run -> ${out}`);
