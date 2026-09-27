import type { TechName } from "@/components/ui/TechMarks";

/**
 * The four layers the studio builds in, shared by the home page stack section,
 * the about page and the company profile deck so all three name the same tools
 * and promise the same deliverables.
 */
export type Pillar = {
  id: string;
  number: string;
  name: string;
  purpose: string;
  tools: TechName[];
  delivers: string[];
};

/**
 * Four columns, read left to right as a system rather than as a service menu:
 * the screen, the logic behind it, the data under that, and the platform the
 * whole thing runs on. Each one names the tools it is built from and what comes
 * out of it, because "we use React" means nothing on its own and "you get a
 * design system and two app builds" means something.
 *
 * Each column is ordered with its headline tools first. The printed profile
 * deck has room for five per column and takes them off the front of these
 * lists, so the order is load-bearing — see DECK_TOOLS_PER_PILLAR.
 */
export const PILLARS: Pillar[] = [
  {
    id: "interface",
    number: "01",
    name: "Design & Interface",
    purpose: "Everything your users touch — drawn first, then built, for whatever they are holding.",
    tools: [
      "react",
      "nextjs",
      "typescript",
      "tailwind",
      "flutter",
      "dart",
      "swift",
      "kotlin",
      "vue",
      "figma",
      "framer",
    ],
    delivers: ["UI/UX design", "Design system", "Web application", "iOS & Android"],
  },
  {
    id: "services",
    number: "02",
    name: "Services & AI",
    purpose: "The rules, the workflows and the models behind the screen.",
    tools: [
      "nodejs",
      "dotnet",
      "laravel",
      "python",
      "go",
      "php",
      "rust",
      "nestjs",
      "django",
      "fastapi",
      "graphql",
      "openai",
      "gemini",
      "tensorflow",
      "pytorch",
    ],
    delivers: ["Documented API", "Microservices", "Auth & roles", "Models & AI agents"],
  },
  {
    id: "data",
    number: "03",
    name: "Data & Commerce",
    purpose: "Where the truth is kept, how it moves, who may see it, and how money changes hands.",
    tools: [
      "postgres",
      "mongodb",
      "redis",
      "mysql",
      "elasticsearch",
      "prisma",
      "supabase",
      "firebase",
      "shopify",
      "woocommerce",
    ],
    delivers: ["Schema & migrations", "Event pipeline", "Reporting views", "Checkout & payments"],
  },
  {
    id: "platform",
    number: "04",
    name: "Platform & Automation",
    purpose:
      "How it ships on a Tuesday, stays up at three in the morning, and runs when nobody is watching.",
    tools: [
      "aws",
      "azure",
      "gcp",
      "docker",
      "kubernetes",
      "terraform",
      "github",
      "vercel",
      "grafana",
      "n8n",
    ],
    delivers: ["CI/CD pipeline", "Monitoring & alerts", "Automated workflows", "Runbook & handover"],
  },
];

/** Every tool named across the four layers, in reading order and de-duplicated. */
export const ALL_TOOLS: TechName[] = Array.from(
  new Set(PILLARS.flatMap((pillar) => pillar.tools)),
);

/**
 * How many marks per column the printed profile deck shows.
 *
 * The web pages can grow a row; a deck page is 1280x720 and cannot. Five per
 * column fills the deck's four-across grid exactly (twenty cells, five rows)
 * with no short final row to pad, and keeps the per-column tiles on the stack
 * slide down to one line.
 */
export const DECK_TOOLS_PER_PILLAR = 5;

/** The marks the deck has room for: the front of each column's list. */
export const DECK_TOOLS: TechName[] = Array.from(
  new Set(PILLARS.flatMap((pillar) => pillar.tools.slice(0, DECK_TOOLS_PER_PILLAR))),
);

/**
 * The mark to draw beside a technology named in a case study.
 *
 * Case studies name their stack in prose ("Next.js", "Socket.IO"), and the deck
 * draws that stack as a grid of cells. Anything with a mark gets it; anything
 * without is set as a wordmark instead, which is what the cell would have fallen
 * back to anyway. Deliberately not a `Record<string, TechName>` covering every
 * possible string — a stack entry the site invents tomorrow should quietly
 * become a wordmark, not a type error.
 */
const TECH_MARKS: Record<string, TechName> = {
  // Interface
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  typescript: "typescript",
  javascript: "javascript",
  tailwind: "tailwind",
  "tailwind css": "tailwind",
  vue: "vue",
  "vue.js": "vue",
  flutter: "flutter",
  dart: "dart",
  swift: "swift",
  kotlin: "kotlin",
  figma: "figma",
  framer: "framer",

  // Services and models
  "node.js": "nodejs",
  nodejs: "nodejs",
  nestjs: "nestjs",
  ".net": "dotnet",
  "asp.net": "dotnet",
  laravel: "laravel",
  php: "php",
  python: "python",
  django: "django",
  fastapi: "fastapi",
  go: "go",
  golang: "go",
  rust: "rust",
  graphql: "graphql",
  openai: "openai",
  gemini: "gemini",
  tensorflow: "tensorflow",
  pytorch: "pytorch",

  // Data and commerce
  postgresql: "postgres",
  postgres: "postgres",
  mysql: "mysql",
  mongodb: "mongodb",
  redis: "redis",
  elasticsearch: "elasticsearch",
  prisma: "prisma",
  supabase: "supabase",
  firebase: "firebase",
  shopify: "shopify",
  woocommerce: "woocommerce",

  // Platform
  aws: "aws",
  azure: "azure",
  "microsoft azure": "azure",
  gcp: "gcp",
  "google cloud": "gcp",
  docker: "docker",
  kubernetes: "kubernetes",
  terraform: "terraform",
  github: "github",
  vercel: "vercel",
  grafana: "grafana",
  n8n: "n8n",
};

export function techMarkFor(label: string): TechName | null {
  return TECH_MARKS[label.trim().toLowerCase()] ?? null;
}
