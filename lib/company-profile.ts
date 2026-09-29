import { PUBLISHED_CASE_STUDIES } from "@/lib/case-studies";
import { HEADLINE_SERVICES } from "@/lib/services";
import { siteConfig } from "@/lib/site";

/**
 * The company profile deck.
 *
 * One document, one source. The hero and the footer both link to
 * `COMPANY_PROFILE_HREF` rather than writing the path out, and every fact the
 * deck states is either imported from the module that already owns it
 * (services, case studies, contact details) or declared once below — so the
 * profile cannot drift from the site it describes.
 *
 * Two rules the deck inherits from the rest of this codebase:
 *
 *   - Only published case studies. Eight of the thirteen entries in
 *     lib/case-studies.ts are drafts carrying invented outcome figures, and a
 *     document that goes out to a prospect is the last place those belong.
 *     PUBLISHED_CASE_STUDIES is already filtered; the deck reads that.
 *   - No people, no testimonials. lib/team.ts and lib/testimonials.ts are
 *     empty on purpose. The reference deck this was modelled on devotes a
 *     slide to founder bios and another to client quotes; ours does not,
 *     because we would have to invent both. Add them here the day they are
 *     real.
 */

/** The one path. Anything linking to the profile imports this. */
export const COMPANY_PROFILE_HREF = "/company-profile";

/** Shown on the cover and in the running footer of every slide. */
export const PROFILE_EDITION = "2026";

/**
 * The figures the site already publishes, gathered in one place.
 *
 * These are the same four the site footer carries, and they have to stay that
 * way: a prospect who reads the deck and then the website is comparing them.
 */
export const PROFILE_FIGURES = [
  { figure: siteConfig.founded, label: "Building software since" },
  { figure: "28+", label: "Projects delivered" },
  { figure: "25", label: "Technology experts" },
  { figure: "95%", label: "Client satisfaction score" },
] as const;

export type ProfileSlide = {
  /** Anchor id, also the deep link target. */
  id: string;
  /** Mono eyebrow, set upper case in the corner of the slide. */
  eyebrow: string;
  /** Used for the contents rail and the document outline. */
  title: string;
};

/**
 * What we build. Straight from the service records — the seven the company
 * leads with, because the slide that draws this is a fixed 16:9 page box.
 */
export const PROFILE_SERVICES = HEADLINE_SERVICES.map((service) => ({
  slug: service.slug,
  title: service.title,
  shortTitle: service.shortTitle,
  included: service.included,
}));

/**
 * Sectors we have shipped into, with the count of delivered projects in each —
 * the same list and the same counts the About page's industries block carries.
 */
export const PROFILE_INDUSTRIES = [
  { name: "E-Commerce & Retail", note: "Storefronts & marketplaces", count: "09" },
  { name: "SaaS & B2B Platforms", note: "Multi-tenant products", count: "07" },
  { name: "Health Tech", note: "Clinic & patient systems", count: "05" },
  { name: "Fintech & Payments", note: "Ledgers & reconciliation", count: "04" },
  { name: "Logistics & Supply Chain", note: "Fleet & warehouse tooling", count: "03" },
] as const;

/** The four steps of an engagement, condensed from the home page's process. */
export const PROFILE_PROCESS = [
  {
    number: "01",
    title: "Discovery call",
    copy: "We ask about your users, your deadline and your budget before we talk about technology at all.",
  },
  {
    number: "02",
    title: "Scope & architecture",
    copy: "A written scope, wireframes, and a fixed price and timeline to sign off on — no surprises later.",
  },
  {
    number: "03",
    title: "Build in sprints",
    copy: "Short, fixed cycles. Every two weeks you see working software and can redirect us — not a slide deck.",
  },
  {
    number: "04",
    title: "Test, launch & support",
    copy: "QA on staging, a rehearsed go-live with a rollback plan, then 6–12 months of fixes and patches on us.",
  },
] as const;

/**
 * What is actually handed over at the end.
 *
 * Every line is something the build produces as a matter of course, which is
 * the point of the slide: a client reading the profile should be able to hold
 * the list up against what they receive.
 */
export const PROFILE_HANDOVER = [
  {
    title: "The repository",
    copy: "Every commit, in your organisation, from the first day of the build rather than the last.",
  },
  {
    title: "A documented API",
    copy: "Endpoints, payloads and auth written down, so the next team does not have to read the controller to learn what it returns.",
  },
  {
    title: "Schema & migrations",
    copy: "The data model and the ordered migrations that produce it, runnable against an empty database.",
  },
  {
    title: "A deployment pipeline",
    copy: "CI/CD that builds, tests and ships — with the rollback path rehearsed before go-live, not after it.",
  },
  {
    title: "Monitoring & alerts",
    copy: "Dashboards and thresholds already wired, so the system tells you it is unwell before a customer does.",
  },
  {
    title: "A runbook",
    copy: "How to deploy it, how to restore it, and who to call. Written for someone who has never seen the codebase.",
  },
] as const;

/** The case for working with us, in the terms the rest of the site uses. */
export const PROFILE_REASONS = [
  {
    number: "01",
    title: "Senior engineers on your build",
    copy: "The people who scope the work are the people who write it. Nothing is priced by one team and handed to another to figure out.",
  },
  {
    number: "02",
    title: "A fixed scope before a line is written",
    copy: "Written scope, wireframes, price and timeline, signed off before the build starts — so the conversation at the end is about the software, not the invoice.",
  },
  {
    number: "03",
    title: "Working software every two weeks",
    copy: "You see the product running on a fixed cycle and can change direction while changing direction is still cheap.",
  },
  {
    number: "04",
    title: "You own it from the first commit",
    copy: "The repository is yours throughout. No licence to renegotiate, no escrow, no leverage held over the handover.",
  },
  {
    number: "05",
    title: "Support that outlasts the launch",
    copy: "Six to twelve months of fixes and patches after go-live are part of the build, not a separate contract.",
  },
] as const;

/**
 * The work shown in the profile.
 *
 * Published entries only, carrying the same headline facts the case study page
 * shows — so the deck and the website tell a prospect the identical story about
 * the identical project.
 */
export const PROFILE_WORK = PUBLISHED_CASE_STUDIES.map((study) => ({
  slug: study.slug,
  image: study.card,
  title: study.cardTitle,
  /** The grey line under the project name: what kind of thing it is. */
  descriptor: study.categories.join(" · "),
  categories: study.categories,
  summary: study.summary,
  challenge: { heading: study.intro.heading, body: study.problem.paragraphs[0] },
  solution: { heading: study.solution.lead, body: study.solution.paragraphs[0] },
  /** The three constraints the build had to solve, already written as
   *  "Heading: sentence" on the case study page — which is exactly the shape
   *  the deck's bulleted list wants. */
  issues: study.problem.issues.map(splitLead),
  stack: study.stack,
  outcomes: study.outcomes,
  facts: study.facts,
}));

/**
 * Splits "Live Operations View: staff could not see..." into its bold lead and
 * the rest. Falls back to the whole string as the body if a line has no colon,
 * so a case study that stops following the convention still renders.
 */
function splitLead(line: string): { lead: string; rest: string } {
  const at = line.indexOf(": ");
  if (at === -1) return { lead: "", rest: line };
  return { lead: line.slice(0, at), rest: line.slice(at + 2) };
}

/**
 * Photographs the deck uses, all of them already published elsewhere on the
 * site. Kept here so a slide names an intent rather than a file path.
 */
export const PROFILE_IMAGERY = {
  cover: "/images/about-showcase.jpg",
  capabilities: "/images/service-detail-tools.webp",
  sectors: "/images/about-photo-working.webp",
  process: "/images/cta-team-meeting.webp",
  clients: "/images/client-onboarding-signing.webp",
} as const;

/** Every slide in order, which is also the contents rail and the print order. */
export const PROFILE_SLIDES: ProfileSlide[] = [
  { id: "cover", eyebrow: `Company Profile ${PROFILE_EDITION}`, title: "Project Help" },
  { id: "at-a-glance", eyebrow: "Who we are", title: "At a glance" },
  { id: "what-we-build", eyebrow: "Capabilities", title: "What we build" },
  { id: "industries", eyebrow: "Sectors", title: "Where the work has shipped" },
  { id: "stack", eyebrow: "Engineering", title: "One stack, all the way down" },
  { id: "process", eyebrow: "Engagement", title: "How the work runs" },
  { id: "handover", eyebrow: "Handover", title: "What you are left holding" },
  ...PROFILE_WORK.map((work, index) => ({
    id: `work-${work.slug}`,
    eyebrow: `Selected work ${String(index + 1).padStart(2, "0")}`,
    title: work.title,
  })),
  { id: "clients", eyebrow: "Clients", title: "Who we build for" },
  { id: "why-us", eyebrow: "The case", title: "Why teams pick us" },
  { id: "contact", eyebrow: "Next step", title: "Start the conversation" },
];

export const PROFILE_SLIDE_COUNT = PROFILE_SLIDES.length;

/** Where a slide sits in the deck, 1-based, for the running "04 / 14" marker. */
export function slidePosition(id: string) {
  return PROFILE_SLIDES.findIndex((slide) => slide.id === id) + 1;
}

/**
 * The closing slide, which is the only page a reader is expected to act on.
 * Everything here is the same detail the site footer carries.
 */
export const PROFILE_CONTACT = [
  { label: "Website", value: siteConfig.url.replace(/^https?:\/\//, "") },
  { label: "Email", value: siteConfig.email },
  { label: "Phone", value: siteConfig.phoneDisplay },
  {
    label: "Studio",
    value: `${siteConfig.address.street}, ${siteConfig.address.locality} ${siteConfig.address.postalCode}, ${siteConfig.address.countryName}`,
  },
] as const;
