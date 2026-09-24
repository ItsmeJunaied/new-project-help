// Crops each site image to its slot's aspect ratio and resizes it to the export
// size from the image brief, writing over /public/images/.
//
// This is the site-wide counterpart to scripts/case-images/resize.js: same
// approach, different sheet. The brief's "trim ~16% off top and bottom" notes
// only describe what a centre crop to the target ratio does, so that is all
// this performs.
//
// Two things differ from the case-study job:
//
//   - Targets keep whatever extension the code already references, so most
//     land as .webp and the rest as .jpg or .png. The brief lists every path
//     as .png, but only three of them actually are.
//   - One row ("About - avatar cluster") is a single photograph that has to
//     supply three 128x128 avatars, so that entry carries `targets` and
//     `crops` (centre x, centre y, box size in source pixels) instead of a
//     single `target`.
//
// Sources are the untouched Gemini files, so nothing is compressed twice.
//
// Usage:  node scripts/site-images/resize.js          -> dry run
//         node scripts/site-images/resize.js --write  -> write the files
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '../..');
const SRC = path.join(ROOT, 'assets/site-image-sources');

const mapping = JSON.parse(fs.readFileSync(path.join(__dirname, 'mapping.json'), 'utf8'));
const write = process.argv.includes('--write');

// Matches the encoder the wired extension implies. Quality is a touch above the
// case-study job's 82 because several of these render full-bleed at 2880px.
const encode = (pipeline, target) => {
  switch (path.extname(target).toLowerCase()) {
    case '.webp': return pipeline.webp({ quality: 88 });
    case '.png': return pipeline.png({ compressionLevel: 9 });
    default: return pipeline.jpeg({ quality: 90, mozjpeg: true });
  }
};

(async () => {
  let before = 0, after = 0, done = 0, failed = 0;
  for (const m of mapping) {
    const src = path.join(SRC, m.source);
    try {
      const jobs = m.targets
        ? m.targets.map((t, i) => ({ target: t, crop: m.crops[i] }))
        : [{ target: m.target, crop: null }];

      for (const job of jobs) {
        const dst = path.join(ROOT, 'public', job.target);
        let pipeline = sharp(src);
        if (job.crop) {
          const [cx, cy, size] = job.crop;
          const half = Math.round(size / 2);
          pipeline = pipeline
            .extract({ left: cx - half, top: cy - half, width: size, height: size })
            .resize(128, 128);
        } else {
          pipeline = pipeline.resize(m.w, m.h, { fit: 'cover', position: 'centre' });
        }
        const buf = await encode(pipeline, job.target).toBuffer();
        after += buf.length;
        if (write) fs.writeFileSync(dst, buf);
        done++;
      }
      before += fs.statSync(src).size;
    } catch (e) {
      console.error(`! ${m.target || m.targets.join(', ')}: ${e.message}`);
      failed++;
    }
  }
  const mb = b => (b / 1024 / 1024).toFixed(1) + ' MB';
  console.log(`${write ? 'WROTE' : 'DRY RUN'}: ${done} images, ${failed} failed.`);
  console.log(`source ${mb(before)} -> output ${mb(after)}`);
  if (!write) console.log('Re-run with --write to apply.');
})();
