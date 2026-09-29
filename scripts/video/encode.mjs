/**
 * Re-encode the site's films smaller, and give each one a WebM alternate.
 *
 * NOT RUN AS PART OF ANY BUILD. It rewrites the films, which is a visible
 * change to the site, so it is run deliberately and its output is reviewed
 * before anything is wired up to it.
 *
 * ---
 *
 * The thing to understand before touching the numbers: this footage is
 * datamosh. Glitch frames, RGB shear, chromatic tearing, falling particles.
 * Every pixel changes every frame and most of those changes are, to a codec,
 * indistinguishable from noise — which is the single most expensive kind of
 * picture there is.
 *
 * A constant-quality encode is therefore the wrong tool. CRF asks the encoder
 * to preserve detail faithfully, and asked to faithfully preserve noise it
 * produces a LARGER file than the source: libvpx-vp9 at CRF 36 turned the
 * 3.9MB hero loop into 6.6MB. That is not a misconfiguration, it is what CRF
 * is for.
 *
 * So these are capped-bitrate encodes. We name a ceiling and the encoder fits
 * the picture inside it. On ordinary footage that trade shows up as mush; on
 * this footage it hides almost perfectly, because the artefacts of a starved
 * encoder and the artefacts the film is *made of* look the same. Compared
 * frame by frame at 720p/400k against the source, the only visible loss was
 * some softening in the snow particles — on a frame that plays 540px wide.
 *
 * Two outputs per film, WebM first in the markup so the MP4 is only ever the
 * fallback and nobody fetches both.
 *
 * NEW FILENAMES, not replacements. /videos is served immutable for a year (see
 * next.config.ts), which is a promise about a path. A re-cut film needs a new
 * name or the browsers holding the old one will never ask again.
 *
 * Run: node scripts/video/encode.mjs
 */

import { spawn } from "node:child_process";
import { statSync } from "node:fs";
import path from "node:path";

import ffmpegPath from "ffmpeg-static";

const VIDEOS = path.join(process.cwd(), "public", "videos");

/**
 * Ceilings, in kbit/s, measured against each film's own source rather than
 * shared. VP9 gets roughly a quarter less than H.264 for the same picture,
 * which is about what it is worth on this material.
 *
 * `width` is the other half of the saving, and the cheaper half: the hero
 * frame is 540px wide on a desktop and about 330 on a phone, so a 960-wide
 * master was already carrying more picture than anything could show.
 */
const JOBS = [
  {
    from: "showreel-40s-loop.mp4",
    to: "showreel-40s-loop-v2",
    // Background texture behind the hero and in the footer. Never watched.
    width: 854,
    vp9: 380,
    h264: 500,
    audio: false,
  },
  {
    from: "showreel-v8.mp4",
    to: "showreel-v8-v2",
    // Full-bleed showcase band. Source is already a lean 452 kb/s, so there
    // is much less to take here than the file size suggests.
    width: 1280,
    vp9: 280,
    h264: 360,
    audio: true,
  },
  {
    from: "showreel-40s.mp4",
    to: "showreel-40s-v2",
    // The lightbox cut: full screen, with sound, and the only one anybody
    // chooses to sit and watch. Handled gently.
    width: 1280,
    vp9: 700,
    h264: 900,
    audio: true,
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

  // -2 asks for the nearest even height that keeps the ratio; both codecs need
  // even dimensions for 4:2:0 chroma.
  const scale = `scale=${job.width}:-2:flags=lanczos`;

  const webmAudio = job.audio ? ["-c:a", "libopus", "-b:a", "96k"] : ["-an"];
  const mp4Audio = job.audio ? ["-c:a", "aac", "-b:a", "128k"] : ["-an"];

  // Average-bitrate VP9, not CRF: -b:v is a target rather than a ceiling here,
  // and the two-pass that would hit it exactly is not worth the wall time on a
  // film this short.
  await run([
    "-y",
    "-i",
    input,
    "-vf",
    scale,
    "-c:v",
    "libvpx-vp9",
    "-b:v",
    `${job.vp9}k`,
    "-maxrate",
    `${Math.round(job.vp9 * 1.5)}k`,
    "-bufsize",
    `${job.vp9 * 3}k`,
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

  // faststart moves the index to the front, so playback can begin on the first
  // chunk rather than after the whole download. On a slow connection that is
  // the difference between a poster that becomes a film and one that just sits
  // there.
  await run([
    "-y",
    "-i",
    input,
    "-vf",
    scale,
    "-c:v",
    "libx264",
    "-b:v",
    `${job.h264}k`,
    "-maxrate",
    `${job.h264}k`,
    "-bufsize",
    `${job.h264 * 2}k`,
    "-preset",
    "slow",
    "-profile:v",
    "high",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    ...mp4Audio,
    mp4,
  ]);

  const before = kb(input);
  console.log(
    `${job.from.padEnd(26)} ${String(before).padStart(6)} KB  ->  ` +
      `webm ${String(kb(webm)).padStart(5)} KB · mp4 ${String(kb(mp4)).padStart(5)} KB` +
      `   (${Math.round((1 - kb(webm) / before) * 100)}% off what a current browser fetches)`,
  );
}

for (const job of JOBS) {
  await encode(job);
}

console.log(
  "\nNothing is wired up to these yet. Check them against the originals first,\n" +
    "then point Hero, VideoShowcase and Footer at the new names.",
);
