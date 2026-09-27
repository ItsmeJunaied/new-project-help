/**
 * Generates components/ui/tech-mark-art.ts from the @iconify-json/logos set.
 *
 * The marks used to be hand-drawn approximations of each vendor's logo. Fine at
 * 22px, and visibly homemade the moment anything renders them larger — which the
 * about page now does. The SVG Logos collection ships each vendor's real
 * artwork, in full colour, so the marks are the actual logos and this script is
 * the only place that knows where they came from.
 *
 * Run `npm run build:tech-marks` after editing MARKS. @iconify-json/logos is a
 * devDependency: nothing at runtime imports it, only the file it writes.
 *
 * Aspect ratios are kept as the vendor drew them — some marks are square, some
 * are tall (MongoDB's leaf), some are wide wordmarks (AWS, Stripe). Each entry
 * carries its own box so TechMark can letterbox it inside a square tile instead
 * of stretching it.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const set = JSON.parse(
  readFileSync(join(process.cwd(), "node_modules/@iconify-json/logos/icons.json"), "utf8"),
);

/**
 * Our name for a technology, against the icon in the logos set and the label a
 * client would recognise. Icon-only variants where one exists: a tile is square
 * and a 512x64 wordmark disappears inside it.
 */
const MARKS = {
  // Design & interface
  figma: ["figma", "Figma"],
  framer: ["framer", "Framer"],
  react: ["react", "React"],
  nextjs: ["nextjs-icon", "Next.js"],
  typescript: ["typescript-icon", "TypeScript"],
  javascript: ["javascript", "JavaScript"],
  tailwind: ["tailwindcss-icon", "Tailwind CSS"],
  vue: ["vue", "Vue.js"],
  flutter: ["flutter-icon", "Flutter"],
  dart: ["dart", "Dart"],
  swift: ["swift", "Swift"],
  kotlin: ["kotlin-icon", "Kotlin"],

  // Services, APIs and the models behind them
  nodejs: ["nodejs-icon", "Node.js"],
  nestjs: ["nestjs", "NestJS"],
  dotnet: ["dotnet", ".NET"],
  laravel: ["laravel", "Laravel"],
  php: ["php", "PHP"],
  python: ["python", "Python"],
  django: ["django-icon", "Django"],
  fastapi: ["fastapi-icon", "FastAPI"],
  go: ["go", "Go"],
  rust: ["rust", "Rust"],
  graphql: ["graphql", "GraphQL"],
  openai: ["openai-icon", "OpenAI"],
  gemini: ["google-gemini-icon", "Google Gemini"],
  tensorflow: ["tensorflow", "TensorFlow"],
  pytorch: ["pytorch-icon", "PyTorch"],

  // Data and commerce
  postgres: ["postgresql", "PostgreSQL"],
  mysql: ["mysql-icon", "MySQL"],
  mongodb: ["mongodb-icon", "MongoDB"],
  redis: ["redis", "Redis"],
  elasticsearch: ["elasticsearch", "Elasticsearch"],
  prisma: ["prisma", "Prisma"],
  supabase: ["supabase-icon", "Supabase"],
  firebase: ["firebase-icon", "Firebase"],
  shopify: ["shopify", "Shopify"],
  woocommerce: ["woocommerce-icon", "WooCommerce"],

  // Platform and automation
  aws: ["aws", "AWS"],
  azure: ["microsoft-azure", "Microsoft Azure"],
  gcp: ["google-cloud", "Google Cloud"],
  docker: ["docker-icon", "Docker"],
  kubernetes: ["kubernetes", "Kubernetes"],
  terraform: ["terraform-icon", "Terraform"],
  github: ["github-icon", "GitHub"],
  vercel: ["vercel-icon", "Vercel"],
  grafana: ["grafana", "Grafana"],
  n8n: ["n8n-icon", "n8n"],
};

/**
 * A few marks are drawn without a fill of their own, because the vendor's logo
 * is a single silhouette meant to be inked in one colour. Those would otherwise
 * inherit whatever text colour surrounds them, so each names its own.
 */
const TINTS = {
  framer: "#0055FF",
  prisma: "#2D3748",
  rust: "#0B0B0B",
  openai: "#0B0B0B",
  vercel: "#0B0B0B",
};

const missing = [];
const entries = [];

for (const [name, [icon, label]] of Object.entries(MARKS)) {
  const art = set.icons[icon];

  if (!art) {
    missing.push(`${name} (icon "${icon}")`);
    continue;
  }

  entries.push({
    name,
    label,
    width: art.width ?? set.width,
    height: art.height ?? set.height,
    tint: /fill=/.test(art.body) ? null : (TINTS[name] ?? "#0B0B0B"),
    body: art.body,
  });
}

if (missing.length) {
  console.error(
    "build-tech-marks: @iconify-json/logos has no icon for:\n" +
      missing.map((item) => `  - ${item}`).join("\n") +
      "\nThe set renames icons occasionally. Grep node_modules/@iconify-json/" +
      "logos/icons.json for the brand and fix MARKS.",
  );
  process.exit(1);
}

const body = entries
  .map(
    ({ name, label, width, height, tint, body }) =>
      `  ${name}: {\n    label: ${JSON.stringify(label)},\n    width: ${width},\n    height: ${height},` +
      (tint ? `\n    tint: ${JSON.stringify(tint)},` : "") +
      `\n    body:\n      ${JSON.stringify(body)},\n  },`,
  )
  .join("\n");

const union = entries.map(({ name }) => `  | "${name}"`).join("\n");

const file = `/**
 * Official technology marks, generated — do not edit.
 *
 * Written by scripts/build-tech-marks.mjs from the SVG Logos collection
 * (@iconify-json/logos): each entry is the vendor's own full-colour artwork and
 * the box it was drawn in. Add a technology to MARKS in that script and re-run
 * \`npm run build:tech-marks\` rather than pasting artwork in here.
 *
 * The name union is generated too, so dropping a mark is a type error wherever
 * the site still names it rather than a hole at runtime.
 */

export type TechArt = {
  label: string;
  /** The vendor's own aspect ratio. Not every logo is square. */
  width: number;
  height: number;
  /**
   * The colour to ink the mark in, for the marks drawn without a fill of their
   * own. Absent on the ones that carry the vendor's colours in the artwork.
   */
  tint?: string;
  /** The artwork, injected as-is. Static, generated, and never user input. */
  body: string;
};

export type GeneratedTechName =
${union};

export const TECH_ART: Record<GeneratedTechName, TechArt> = {
${body}
};
`;

writeFileSync(join(process.cwd(), "components/ui/tech-mark-art.ts"), file, "utf8");

const weight = entries.reduce((total, entry) => total + entry.body.length, 0);
console.log(
  `build-tech-marks: wrote ${entries.length} marks to components/ui/tech-mark-art.ts ` +
    `(${(weight / 1024).toFixed(1)}KB of artwork)`,
);
