/**
 * Builds public/images/services/*.webp from the sources dropped in assets/.
 *
 * The services section shows one piece of artwork per service. The sources live
 * in assets/service-image-sources — product and interface renders at whatever
 * size they arrived in, one of them a 1504x4625 full-page screenshot — so this
 * is the one place that knows how each is cut down to something a card can
 * draw. They are committed, so the outputs can always be rebuilt.
 *
 * Deliberately no fixed output ratio: each card crops with object-cover at the
 * size it needs, and cropping twice only throws away pixels the layout might
 * have wanted. What this does is cap the width, take the region worth showing
 * where the source is far too tall, and re-encode.
 *
 * Usage:  node scripts/service-images/build.mjs          -> dry run
 *         node scripts/service-images/build.mjs --write  -> write the files
 */
import { mkdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SRC = join(ROOT, "assets/service-image-sources");
const OUT = join(ROOT, "public/images/services");

/** The widest any card draws one of these, doubled for retina. */
const MAX_WIDTH = 1600;

/**
 * Below this, a source cannot fill the widest card without being enlarged.
 * Reported rather than enforced: whether a soft image is acceptable is a
 * judgement about that particular artwork, not something a script should
 * settle by refusing to build.
 */
const MIN_USEFUL_WIDTH = 1200;

/**
 * Service slug against the source file, and the part of it worth keeping.
 *
 * `region` is a fraction of the source height — [start, end] — applied before
 * the resize. Only the sources that are whole scrolling pages need one: a
 * centre crop of a 4625px screenshot lands somewhere in its footer.
 */
const MARKS = [
  {
    slug: "saas-platform-development",
    source: "saas.png",
    // A full landing page. The hero and its dashboard are the top quarter.
    region: [0.012, 0.205],
    alt: "SaaS platform hero and tenant dashboard",
  },
  {
    slug: "ecommerce-digital-commerce",
    source: "e-commerce.webp",
    alt: "Storefront and merchandising screens for an eCommerce build",
  },
  {
    slug: "devops-cloud-infrastructure",
    source: "devops.jpg",
    alt: "The DevOps loop — plan, code, build, release, operate",
  },
  {
    slug: "ai-ml-data-analytics",
    source: "ai-ml.webp",
    alt: "An AI assistant interface shown in perspective",
  },
  {
    slug: "technology-consulting",
    source: "consulting.webp",
    alt: "Strategy and advisory pages for a consulting practice",
  },
  {
    slug: "mobile-app-development",
    source: "mobile-app.webp",
    alt: "A trading app running on a phone",
  },
  {
    slug: "cybersecurity-data-protection",
    source: "cybersecurity.webp",
    alt: "A security operations dashboard on a monitor",
  },

  // The kinds of work that have no page of their own. They appear on the rail
  // under All Services, so they need artwork on the same footing as the seven.
  {
    slug: "custom-software",
    source: "custom-software.webp",
    alt: "A clinical scheduling and consultation system",
  },
  {
    slug: "web-applications",
    source: "web-applications.webp",
    alt: "A project and staffing console in the browser",
  },
  {
    slug: "erp-systems",
    source: "erp.webp",
    alt: "An ERP users and access screen",
  },
  {
    slug: "crm-systems",
    source: "crm.webp",
    alt: "A pipeline board with reporting above it",
  },
  {
    slug: "enterprise-software",
    source: "enterprise.webp",
    alt: "An internal finance platform on a dark theme",
  },
  {
    slug: "api-development",
    source: "api.webp",
    alt: "Sequence and flow diagrams for an API",
  },
  {
    slug: "microservices",
    source: "microservice.webp",
    alt: "Services wired to a message bus",
  },
  {
    slug: "business-automation",
    source: "business-automation.webp",
    alt: "An automation dashboard running on a monitor",
  },
];

const write = process.argv.includes("--write");
if (write) mkdirSync(OUT, { recursive: true });

let sourceBytes = 0;
let outputBytes = 0;
const soft = [];

for (const mark of MARKS) {
  const src = join(SRC, mark.source);
  const meta = await sharp(src).metadata();
  let pipeline = sharp(src);

  if (mark.region) {
    const [start, end] = mark.region;
    pipeline = pipeline.extract({
      left: 0,
      top: Math.round(meta.height * start),
      width: meta.width,
      height: Math.round(meta.height * (end - start)),
    });
  }

  // withoutEnlargement, because blowing a small source up to the cap only
  // makes a soft image heavier. The ones that stay under it are listed below
  // so a source too small for the slot is visible rather than silently fuzzy.
  const buffer = await pipeline
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  const out = await sharp(buffer).metadata();
  if (out.width < MIN_USEFUL_WIDTH) {
    soft.push(`${mark.slug} (${out.width}x${out.height}, from ${mark.source})`);
  }

  sourceBytes += statSync(src).size;
  outputBytes += buffer.length;

  if (write) writeFileSync(join(OUT, `${mark.slug}.webp`), buffer);
  console.log(
    `  ${mark.slug}.webp  ${out.width}x${out.height}  ${(buffer.length / 1024).toFixed(0)}KB`,
  );
}

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)}MB`;
console.log(
  `\n${write ? "WROTE" : "DRY RUN"}: ${MARKS.length} images, ${mb(sourceBytes)} -> ${mb(outputBytes)}`,
);

if (soft.length) {
  console.log(
    `\nUnder ${MIN_USEFUL_WIDTH}px — these will look soft on a wide card:\n` +
      soft.map((line) => `  - ${line}`).join("\n"),
  );
}

if (!write) console.log("\nRe-run with --write to apply.");

// Written for the alt text to live beside the crop decisions rather than in the
// component, where a later edit would drift from the artwork.
const altFile =
  `/**\n * Alt text for the service card artwork, generated — do not edit.\n` +
  ` * Written by scripts/service-images/build.mjs.\n */\n\n` +
  `export const SERVICE_IMAGE_ALT: Record<string, string> = {\n` +
  MARKS.map((mark) => `  "${mark.slug}": ${JSON.stringify(mark.alt)},`).join("\n") +
  `\n};\n`;

if (write) writeFileSync(join(ROOT, "lib/service-image-alt.ts"), altFile, "utf8");
