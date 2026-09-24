/**
 * The brand green is declared twice by necessity: once in app/globals.css for
 * everything the browser renders, and once in lib/brand.ts for the two places
 * that run where no stylesheet exists (the build-time OG image and the Calendly
 * URL). This fails the build if they stop agreeing.
 *
 * It also catches the hex being pasted back into a component or an SVG, which
 * is how the value quietly spread to eight places the last time it changed.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const root = process.cwd();
const read = (p) => readFileSync(join(root, p), "utf8");

const cssMatch = read("app/globals.css").match(/--color-primary-green:\s*(#[0-9a-fA-F]{6})/);
const tsMatch = read("lib/brand.ts").match(/BRAND_GREEN\s*=\s*"(#[0-9a-fA-F]{6})"/);

const problems = [];

if (!cssMatch) problems.push("app/globals.css: --color-primary-green not found");
if (!tsMatch) problems.push("lib/brand.ts: BRAND_GREEN not found");

const css = cssMatch?.[1].toLowerCase();
const ts = tsMatch?.[1].toLowerCase();

if (css && ts && css !== ts) {
  problems.push(
    `brand green disagrees: app/globals.css has ${css}, lib/brand.ts has ${ts}. ` +
      `Set both to the same value.`,
  );
}

// Anywhere else the literal turns up is a copy that will go stale.
const SEARCH_DIRS = ["app", "components", "lib", "public"];
const ALLOWED = new Set(["app/globals.css", "lib/brand.ts"]);

/**
 * Browser-tab icons are files, so they cannot read a CSS variable — they carry
 * the hex baked in. That is fine because scripts/build-favicon.mjs generates
 * them from the token, but it does mean they go stale if someone changes the
 * token without rebuilding. So rather than allowing the literal here, we
 * require it to be the *current* one.
 */
const GENERATED = ["app/icon.svg"];
const EXTENSIONS = new Set([".ts", ".tsx", ".css", ".svg", ".json"]);

function walk(dir, found = []) {
  for (const entry of readdirSync(join(root, dir))) {
    const rel = `${dir}/${entry}`;
    if (statSync(join(root, rel)).isDirectory()) walk(rel, found);
    else if (EXTENSIONS.has(extname(entry))) found.push(rel);
  }
  return found;
}

if (css) {
  const bare = css.slice(1);

  for (const file of GENERATED) {
    const text = readFileSync(join(root, file), "utf8").toLowerCase();
    if (!text.includes(bare)) {
      problems.push(
        `${file} does not contain ${css} — it was generated from an older brand ` +
          `colour. Run \`node scripts/build-favicon.mjs\` to rebuild the icons.`,
      );
    }
  }

  for (const dir of SEARCH_DIRS) {
    for (const file of walk(dir)) {
      if (ALLOWED.has(file) || GENERATED.includes(file)) continue;
      const text = readFileSync(join(root, file), "utf8").toLowerCase();
      if (text.includes(bare)) {
        problems.push(
          `${file} hardcodes ${css}. Use the token (bg-primary-green, ` +
            `var(--color-primary-green)) or import BRAND_GREEN from lib/brand.`,
        );
      }
    }
  }
}

if (problems.length) {
  console.error("Brand colour check failed:\n" + problems.map((p) => `  - ${p}`).join("\n"));
  process.exit(1);
}

console.log(`Brand colour check passed — ${css} declared in exactly two places.`);
