// Copies each Gemini image onto its correct /public/images/case/ path.
// Usage:  node apply.js          -> dry run (prints what it would do)
//         node apply.js --write  -> actually copies, backing up placeholders first
const fs = require('fs');
const path = require('path');

const ROOT = 'F:/JuProjects/Project-Help-Rebuild';
const SRC = path.join(ROOT, 'assets/case-study-sources');
const MAP = path.join(__dirname, 'mapping.json');
const BACKUP = path.join(ROOT, 'assets/case-placeholders-backup');

const write = process.argv.includes('--write');
const mapping = JSON.parse(fs.readFileSync(MAP, 'utf8'));

if (write && !fs.existsSync(BACKUP)) fs.mkdirSync(BACKUP, { recursive: true });

let ok = 0, err = 0;
for (const m of mapping) {
  const src = path.join(SRC, m.source);
  const dst = path.join(ROOT, 'public', m.target);
  if (!fs.existsSync(src)) { console.error(`! missing source: ${m.source}`); err++; continue; }
  if (!fs.existsSync(dst)) { console.error(`! missing target: ${m.target}`); err++; continue; }
  if (write) {
    fs.copyFileSync(dst, path.join(BACKUP, path.basename(dst)));  // keep the placeholder
    fs.copyFileSync(src, dst);
  }
  console.log(`${String(m.n).padStart(3)}  ${m.source}  ->  ${m.target}`);
  ok++;
}
console.log(`\n${write ? 'COPIED' : 'DRY RUN'}: ${ok} ok, ${err} problem(s).`);
if (write) console.log(`Placeholders backed up to ${BACKUP}`);
else console.log('Re-run with --write to actually copy.');
