// Crops each case-study image to its slot's aspect ratio and resizes it to the
// export size from the image brief, writing over /public/images/case/.
//
// The brief's "trim ~11% off top and bottom" notes are just a description of
// what a centre crop to the target ratio does, so that's all this performs:
// cover-fit to the exact export size, centred. The brief also asks for the
// devices to sit inside the centre 70% for exactly this reason.
//
// Sources are the untouched Gemini files, so nothing is compressed twice.
//
// Usage:  node scripts/case-images/resize.js          -> dry run
//         node scripts/case-images/resize.js --write  -> write the files
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const ROOT = path.resolve(__dirname, '../..');
const SRC = path.join(ROOT, 'assets/case-study-sources');
const QUALITY = 82;

const mapping = JSON.parse(fs.readFileSync(path.join(__dirname, 'mapping.json'), 'utf8'));
const sizes = JSON.parse(fs.readFileSync(path.join(__dirname, 'export-sizes.json'), 'utf8'));

const write = process.argv.includes('--write');

(async () => {
  let before = 0, after = 0, done = 0, failed = 0;
  for (const m of mapping) {
    const size = sizes[m.type];
    if (!size) { console.error(`! no export size for type "${m.type}"`); failed++; continue; }
    const src = path.join(SRC, m.source);
    const dst = path.join(ROOT, 'public', m.target);
    try {
      const buf = await sharp(src)
        .resize(size.w, size.h, { fit: 'cover', position: 'centre' })
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toBuffer();
      before += fs.statSync(src).size;
      after += buf.length;
      if (write) fs.writeFileSync(dst, buf);
      done++;
    } catch (e) {
      console.error(`! ${m.target}: ${e.message}`);
      failed++;
    }
  }
  const mb = b => (b / 1024 / 1024).toFixed(1) + ' MB';
  console.log(`${write ? 'WROTE' : 'DRY RUN'}: ${done} images, ${failed} failed.`);
  console.log(`source ${mb(before)} -> output ${mb(after)}`);
  if (!write) console.log('Re-run with --write to apply.');
})();
