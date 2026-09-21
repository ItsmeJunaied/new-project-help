export type FaqItem = { id: string; question: string; answer: string };

/**
 * Shared by the FAQ section and the FAQPage structured data. It lives outside
 * the client component on purpose: a value imported across a "use client"
 * boundary reaches the server as a proxy, not as a real array.
 *
 * The "Qn." prefix and the "// " lead-in are part of the visual design; the
 * structured-data builder strips both.
 */
export const FAQS: FaqItem[] = [
  {
    id: "q1",
    question: "Q1. How long does a typical project take?",
    answer:
      "// A focused MVP usually ships in 8–12 weeks. Larger SaaS platforms and multi-tenant systems run 4–6 months, delivered in two-week increments so you see working software throughout rather than at the end.",
  },
  {
    id: "q2",
    question: "Q2. How do you price engagements?",
    answer:
      "// Fixed-scope builds are quoted per milestone after a short discovery phase. Longer-running product work is billed as a monthly dedicated-team retainer. Either way you get a written scope and estimate before anything starts.",
  },
  {
    id: "q3",
    question: "Q3. Which technologies do you work with?",
    answer:
      "// React, Next.js, Node.js and TypeScript on the product side, PostgreSQL and MongoDB for data, and AWS, Azure or Google Cloud for infrastructure — provisioned as code with CI/CD pipelines from day one.",
  },
  {
    id: "q4",
    question: "Q4. Do you take over existing or half-finished projects?",
    answer:
      "// Yes. We start with a technical audit of the codebase, infrastructure and test coverage, then hand you a prioritised plan covering what to fix, what to refactor and what to rebuild before we write any new features.",
  },
  {
    id: "q5",
    question: "Q5. What happens after launch?",
    answer:
      "// Every build includes a handover with documentation and monitoring in place. Most clients continue on a support retainer covering uptime monitoring, security patches, dependency upgrades and ongoing feature work.",
  },
  {
    id: "q6",
    question: "Q6. Who owns the code and the intellectual property?",
    answer:
      "// You do — in full, from the first commit. Source, infrastructure definitions and design files are delivered in repositories and accounts that you own and control.",
  },
];

/** FAQ copy with the design's decorations removed, for schema.org output. */
export function faqPlainText() {
  return FAQS.map((item) => ({
    question: item.question.replace(/^Q\d+\.\s*/, ""),
    answer: item.answer.replace(/^\/\/\s*/, ""),
  }));
}
