import type { TechName } from "@/components/ui/TechMarks";

/**
 * The four layers the studio builds in, shared by the home page stack section
 * and the company profile deck so both name the same tools and promise the same
 * deliverables.
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
 */
export const PILLARS: Pillar[] = [
  {
    id: "interface",
    number: "01",
    name: "Interface",
    purpose: "Everything your users touch, on whatever they are holding.",
    tools: ["react", "nextjs", "typescript", "tailwind", "flutter"],
    delivers: ["Design system", "Web application", "iOS & Android"],
  },
  {
    id: "services",
    number: "02",
    name: "Services & AI",
    purpose: "The rules, the workflows and the models behind the screen.",
    tools: ["nodejs", "python", "graphql", "openai", "pytorch"],
    delivers: ["Documented API", "Auth & roles", "Model integration"],
  },
  {
    id: "data",
    number: "03",
    name: "Data",
    purpose: "Where the truth is kept, how it moves, who may see it.",
    tools: ["postgres", "mongodb", "redis", "elasticsearch"],
    delivers: ["Schema & migrations", "Event pipeline", "Reporting views"],
  },
  {
    id: "platform",
    number: "04",
    name: "Platform",
    purpose: "How it ships on a Tuesday and stays up at three in the morning.",
    tools: ["aws", "docker", "kubernetes", "terraform"],
    delivers: ["CI/CD pipeline", "Monitoring & alerts", "Runbook & handover"],
  },
];

/**
 * The mark to draw beside a technology named in a case study.
 *
 * Case studies name their stack in prose ("Next.js", "Socket.IO"), and the
 * deck draws that stack as a grid of cells. Anything with a mark gets it;
 * anything without is set as a wordmark instead, which is what the cell would
 * have fallen back to anyway. Deliberately not a `Record<string, TechName>`
 * covering every possible string — a stack entry the site invents tomorrow
 * should quietly become a wordmark, not a type error.
 */
const TECH_MARKS: Record<string, TechName> = {
  "next.js": "nextjs",
  "node.js": "nodejs",
  postgresql: "postgres",
  aws: "aws",
  redis: "redis",
  react: "react",
  typescript: "typescript",
  docker: "docker",
  elasticsearch: "elasticsearch",
  mongodb: "mongodb",
  python: "python",
  flutter: "flutter",
  graphql: "graphql",
  kubernetes: "kubernetes",
  terraform: "terraform",
  tailwind: "tailwind",
};

export function techMarkFor(label: string): TechName | null {
  return TECH_MARKS[label.trim().toLowerCase()] ?? null;
}
