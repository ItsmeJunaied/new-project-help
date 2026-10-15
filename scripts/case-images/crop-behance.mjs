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
 * x1043-1900, found by scanning for the dark panels against the grey), which
 * is where every section crop comes from. [left, top, width, height].
 *
 * Two regions of b.png are deliberately never cropped:
 *
 *   - The grey gutter between the columns, x957-1043. A slot wide enough to
 *     span both columns would carry it straight down the middle as a seam, so
 *     the banner is composited from the two columns instead (see `join`).
 *   - The testimonial band, right column below y~1150. The designer left the
 *     template's own copy in it — the quotes praise a calendar app, by name
 *     — which is not something to print on a crypto trading case study.
 */
const JOBS = [
  { slot: "card", src: "a.png", crop: [380, 390, 1400, 700] },
  { slot: "hero", src: "a.png", crop: [0, 250, 2000, 952] },
  // Both columns butted together, so the widest slot reads as a whole system
  // rather than one screen, without the grey gutter that sits between them.
  {
    slot: "banner",
    join: [
      { src: "b.png", crop: [100, 660, 857, 642] },
      { src: "b.png", crop: [1043, 490, 857, 642] },
    ],
  },
  { slot: "problem-1", src: "b.png", crop: [100, 100, 857, 857] },
  { slot: "problem-2", src: "b.png", crop: [1043, 55, 857, 857] },
  { slot: "problem-3", src: "b.png", crop: [100, 740, 857, 857] },
  { slot: "solution-1", src: "b.png", crop: [1043, 600, 857, 557] },
  { slot: "solution-2", src: "b.png", crop: [100, 1040, 857, 557] },
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

const encode = (pipeline, file) =>
  pipeline
    .flatten({ background: "#0b1020" })
    .jpeg({ quality: 86, mozjpeg: true })
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
