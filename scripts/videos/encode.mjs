/**
 * Encodes the three supplied showreels into the web deliveries in /public/videos,
 * and grabs a poster frame for each.
 *
 * The sources are 50 MB of 1080p master between them — fine as masters, far too
 * heavy to put on a landing page. Everything here is about getting them down to
 * a size a visitor can afford while keeping the film intact.
 *
 * Every cut here is 16:9, the ratio the films were shot at, and every frame that
 * plays one is shaped to match. That is deliberate: this showreel is wall-to-wall
 * centred type ("WELCOME TO PROJECT HELP", "DIGITAL PRODUCTS ROOTED IN
 * STRATEGY"), so any frame narrower than 16:9 cuts the ends off the words, and
 * the alternative — bars above and below — is not wanted. Shaping the frames
 * instead is the only arrangement that loses neither.
 *
 * The 40s showreel is encoded twice on purpose. The hero and the footer both
 * play it silently, in place, at 540 and 477 wide, so they share one small cut
 * and the footer costs nothing once the hero has fetched it. The full cut keeps
 * its sound and its lines and is only fetched if someone opens the player —
 * sized the other way round, every visitor pays 7 MB for a silent loop. The v8
 * film needs no such split: it runs full-bleed, so the inline copy is already
 * the good one.
 *
 * Poster frames are pulled from the ENCODED file rather than the source, so the
 * still and the first frame of video are the same picture and there is nothing
 * to see at the handover.
 *
 * Sources live in /assets, which is gitignored — keep a backup off this machine.
 *
 * Usage:  node scripts/videos/encode.mjs          -> report what it would write
 *         node scripts/videos/encode.mjs --write  -> encode
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, statSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ffmpeg from "ffmpeg-static";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SRC = path.join(ROOT, "assets");
const OUT = path.join(ROOT, "public/videos");
const POSTERS = path.join(ROOT, "public/images");
const write = process.argv.includes("--write");

const SHOWREEL_40S = "ProjectHelp_Showreel_40s_Slow.mp4";
const SHOWREEL_V8 = "ProjectHelp_Showreel_v8_Light.mp4";

const JOBS = [
  {
    out: "hero-pill.mp4",
    src: "projecthelp-pill-1600x6002x-hero-text-video.mp4",
    // Drawn at 1600x600 for a pill that renders about 282px wide, so this is
    // still comfortably past 2x. The source has no audio track to begin with.
    filter: "scale=800:-2",
    crf: 30,
    audio: false,
    poster: "hero-pill-poster.webp",
    posterAt: "00:00:01",
    posterWidth: 560,
  },
  {
    out: "showreel-40s-loop.mp4",
    src: SHOWREEL_40S,
    // Silent 16:9 loop, shared by the hero frame (540 wide, fetched eagerly)
    // and the footer strip (477 wide, fetched on approach). 960 covers the
    // larger of the two past 1.7x, and one file means one download for both.
    filter: "scale=960:-2",
    crf: 31,
    audio: false,
    poster: "showreel-40s-poster.webp",
    posterAt: "00:00:02",
    posterWidth: 960,
  },
  {
    out: "showreel-40s.mp4",
    src: SHOWREEL_40S,
    // The real thing, with its sound. Only ever fetched by the lightbox.
    filter: "scale=1280:-2",
    crf: 30,
    audio: true,
  },
  {
    out: "showreel-v8.mp4",
    src: SHOWREEL_V8,
    // Runs full-bleed below About and doubles as its own lightbox source, so it
    // gets the most pixels of the five and keeps its audio.
    filter: "scale=1600:-2",
    crf: 31,
    audio: true,
    poster: "showreel-v8-poster.webp",
    posterAt: "00:00:03",
    posterWidth: 1280,
  },
];

const mb = (bytes) => `${(bytes / 1048576).toFixed(2)} MB`;

const run = (args) =>
  execFileSync(ffmpeg, ["-hide_banner", "-v", "error", "-y", ...args], {
    stdio: "inherit",
  });

if (write) mkdirSync(OUT, { recursive: true });

let total = 0;

for (const job of JOBS) {
  const src = path.join(SRC, job.src);
  if (!existsSync(src)) {
    console.error(`  MISSING source ${job.src} — skipped`);
    continue;
  }

  const dest = path.join(OUT, job.out);

  if (!write) {
    console.log(`${job.out.padEnd(26)} <- ${job.src} (${mb(statSync(src).size)})`);
    continue;
  }

  run([
    "-i", src,
    ...(job.filter.includes(";") ? ["-filter_complex", job.filter] : ["-vf", job.filter]),
    "-c:v", "libx264",
    "-crf", String(job.crf),
    "-preset", "slow",
    "-profile:v", "high",
    "-pix_fmt", "yuv420p",
    // Two seconds between keyframes, so seeking in the lightbox lands quickly.
    "-g", "60",
    // Puts the moov atom first: the browser can start playing before the whole
    // file has arrived, which is the difference between a video that starts and
    // one that waits for the last byte.
    "-movflags", "+faststart",
    ...(job.audio ? ["-c:a", "aac", "-b:a", "96k", "-ac", "2"] : ["-an"]),
    dest,
  ]);

  const size = statSync(dest).size;
  total += size;
  let line = `${job.out.padEnd(26)} ${mb(size).padStart(9)}`;

  if (job.poster) {
    // Via a file rather than a pipe: a 1080p PNG frame is several megabytes and
    // execFileSync's stdout buffer gives up long before that.
    const frame = path.join(tmpdir(), `ph-poster-${process.pid}.png`);
    run(["-ss", job.posterAt, "-i", dest, "-frames:v", "1", frame]);
    const posterPath = path.join(POSTERS, job.poster);
    await sharp(frame).resize({ width: job.posterWidth }).webp({ quality: 74 }).toFile(posterPath);
    rmSync(frame, { force: true });
    total += statSync(posterPath).size;
    line += `   ${job.poster} ${mb(statSync(posterPath).size)}`;
  }

  console.log(line);
}

if (write) console.log(`\ntotal shipped: ${mb(total)}`);
else console.log("\ndry run — pass --write to encode");
