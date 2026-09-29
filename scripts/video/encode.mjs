/**
 * Re-encode the site's films smaller, and give each one a WebM alternate.
 *
 * The originals were encoded once at a fixed bitrate and never revisited. The
 * hero's loop was the worst of it: 3.9MB fetched eagerly on the home page, at
 * 800 kb/s for a 960x540 silent cut that is mostly centred type on flat
 * ground — the kind of picture a constant-quality encode gets right for a
 * fraction of that.
 *
 * Two outputs per film:
 *
 *   .webm  VP9, which every current browser takes and which lands roughly a
 *          third smaller than H.264 at the same quality on this material.
 *   .mp4   H.264 High, for Safari before 14 and anything else that has never
 *          heard of VP9. Still re-encoded, so even the fallback is smaller
 *          than what it replaces.
 *
 * The browser picks: <source> lists WebM first and the first one that plays
 * wins, so nobody downloads both.
 *
 * NEW FILENAMES, not replacements. /videos is served immutable for a year
 * (see next.config.ts), which is a promise about a path — a browser holding
 * the old file would never look again. Changing a film means changing its
 * name.
 *
 * Run: node scripts/video/encode.mjs
 */

import { spawn } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import path from "node:path";

import ffmpegPath from "ffmpeg-static";

const VIDEOS = path.join(process.cwd(), "public", "videos");

/**
 * CRF is a quality target, not a size target, so the same number gives a
 * bigger file to a busier picture. These are tuned per film rather than shared:
 * the two loops are silent background texture behind other content, and the
 * lightbox cut is the one somebody has chosen to sit and watch.
 */
const JOBS = [
  {
    from: "showreel-40s-loop.mp4",
    to: "showreel-40s-loop-v2",
    // Plays at 540px wide on a desktop and full-bleed on a phone; 960 wide
    // covers both without carrying a 1080p master nobody sees.
    width: 960,
    vp9Crf: 36,
    h264Crf: 29,
    audio: false,
  },
  {
    from: "showreel-v8.mp4",
    to: "showreel-v8-v2",
    // The showcase frame is wider than the hero's, so this one keeps more.
    width: 1280,
    vp9Crf: 35,
    h264Crf: 28,
    audio: true,
  },
  {
    from: "showreel-40s.mp4",
    to: "showreel-40s-v2",
    // Full screen with sound, and the only film anyone deliberately opens.
    // The gentlest compression of the three.
    width: 1280,
    vp9Crf: 33,
    h264Crf: 26,
    audio: true,
  },
  {
    from: "hero-pill.mp4",
    to: "hero-pill-v2",
    width: 800,
    vp9Crf: 36,
    h264Crf: 29,
    audio: false,
  },
];

function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, args, { stdio: ["ignore", "ignore", "pipe"] });
    let err = "";
    child.stderr.on("data", (chunk) => {
      err += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(err.slice(-1500))),
    );
  });
}

const kb = (file) => Math.round(statSync(file).size / 1024);

async function encode(job) {
  const input = path.join(VIDEOS, job.from);
  const webm = path.join(VIDEOS, `${job.to}.webm`);
  const mp4 = path.join(VIDEOS, `${job.to}.mp4`);

  // Even width and height: both codecs need it for 4:2:0 chroma, and -2 asks
  // ffmpeg for the nearest even height that keeps the aspect ratio.
  const scale = `scale=${job.width}:-2:flags=lanczos`;

  const silence = job.audio ? [] : ["-an"];
  // 96k Opus and 128k AAC are both well past transparent for a showreel bed.
  const webmAudio = job.audio ? ["-c:a", "libopus", "-b:a", "96k"] : ["-an"];
  const mp4Audio = job.audio ? ["-c:a", "aac", "-b:a", "128k"] : ["-an"];

  // VP9 in constant-quality mode wants -b:v 0, or the CRF is treated as a cap
  // on a bitrate-targeted encode and the quality target is ignored.
  await run([
    "-y",
    "-i",
    input,
    "-vf",
    scale,
    "-c:v",
    "libvpx-vp9",
    "-crf",
    String(job.vp9Crf),
    "-b:v",
    "0",
    // Lets VP9 use every core; without it a 40-second encode is single-threaded.
    "-row-mt",
    "1",
    "-tile-columns",
    "2",
    "-deadline",
    "good",
    "-cpu-used",
    "2",
    ...webmAudio,
    webm,
  ]);

  // faststart moves the index to the front of the file, so playback can begin
  // on the first chunk instead of after the whole download. On a 40-second
  // film over a slow connection that is the difference between a poster that
  // turns into a film and a poster that just sits there.
  await run([
    "-y",
    "-i",
    input,
    "-vf",
    scale,
    "-c:v",
    "libx264",
    "-crf",
    String(job.h264Crf),
    "-preset",
    "slower",
    "-profile:v",
    "high",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    ...mp4Audio,
    ...silence,
    mp4,
  ]);

  const before = kb(input);
  const after = kb(webm) + 0;
  console.log(
    `${job.from.padEnd(26)} ${String(before).padStart(6)} KB  ->  ` +
      `webm ${String(kb(webm)).padStart(5)} KB · mp4 ${String(kb(mp4)).padStart(5)} KB` +
      `   (${Math.round((1 - after / before) * 100)}% off the file a modern browser fetches)`,
  );
}

mkdirSync(VIDEOS, { recursive: true });

for (const job of JOBS) {
  await encode(job);
}
