/**
 * Real, currently-open roles, carried over from the live site along with their
 * detail pages and application form.
 *
 * `CareerRoles` also shows four further cards (Full-Stack Engineer, DevOps
 * Engineer, Product Designer, QA Engineer) that exist only as design
 * placeholders — they were never posted on the live site. Those deliberately do
 * not appear here: a role in this list gets a detail page, a JobPosting entry
 * in structured data and a sitemap URL, and none of that should point at a
 * vacancy that is not actually open.
 */

export type Job = {
  slug: string;
  title: string;
  department: string;
  type: "Full-time" | "Part-time" | "Contract";
  location: string;
  /** ISO date. Drives the JobPosting `datePosted`. */
  postedDate: string;
  /** How long Google should treat the posting as live. */
  validThrough: string;
  remote: boolean;
  summary: string;
  intro: string;
  salary: string;
  benefits: string[];
  responsibilities: string[];
  requirements: string[];
  applyEmail: string;
};

export const JOBS: Job[] = [
  {
    slug: "technical-content-writer",
    title: "Technical Content Writer",
    department: "Content",
    type: "Part-time",
    location: "Remote (Bangladesh)",
    postedDate: "2026-08-09",
    validThrough: "2026-12-31",
    remote: true,
    summary:
      "Write SEO-friendly blogs, guides, and software docs for a company that ships real SaaS, e-commerce, and AI/ML projects.",
    intro:
      "We're looking for a technical content writer who can turn software concepts into clear, SEO-optimized blogs, guides, and documentation. AI tools can assist your research and ideation, but the final piece must be original and human-perfected — we run every submission through an AI-content checker before it's accepted.",
    salary: "৳5,000 per month",
    benefits: [
      "Fully remote, flexible part-time schedule",
      "Byline credit on published posts",
      "Work directly with the engineering team for accurate, real-world technical content",
    ],
    responsibilities: [
      "Write blog posts, how-to guides, SEO content, and software/API documentation",
      "Research technical topics and translate them into clear, accurate content for both developer and business audiences",
      "Use AI tools strategically for ideas and first drafts, then rewrite and edit until the content is 100% original and human-edited",
      "Optimize content for SEO — keyword usage, structure, headings, and meta descriptions",
      "Collaborate with the team over Slack and submit content in Markdown or Google Docs",
    ],
    requirements: [
      "Proficiency in technical writing — blogs, guides, SEO content, and API/software documentation",
      "Solid understanding of software development concepts and tools (e.g. Git, VS Code)",
      "Strong written English with clean grammar and structure",
      "Comfortable using AI for research and ideas, but able to deliver fully original, human-perfected final content — submissions are verified with an AI-content checker",
      "Reliable internet connection and availability for remote, part-time work",
    ],
    applyEmail: "hello@projecthelpbd.com",
  },
  {
    slug: "telemarketing-executive",
    title: "Telemarketing Executive",
    department: "Growth",
    type: "Part-time",
    location: "Remote (Bangladesh)",
    postedDate: "2026-08-06",
    validThrough: "2026-12-31",
    remote: true,
    summary:
      "Connect with prospects over the phone and help us find the right clients for our software and IT services.",
    intro:
      "We are a small software company looking for someone who can genuinely connect with people over the phone and help us find the right clients for our services. If you understand the software and IT space, speak Bangla and English comfortably, and enjoy talking to people, this could be a good fit.",
    salary: "Starting at ৳8,000 per month",
    benefits: [
      "Phone bill coverage",
      "Commission for every successful lead you bring in — the more effort you put in, the more you earn",
    ],
    responsibilities: [
      "Generate new leads and maintain follow-up with existing leads through to conversion",
      "Explain digital and technology services in simple terms to different kinds of clients",
      "Maintain records and reports of calls and leads using Excel and MS Office",
      "Respond to inquiries with a good customer service mindset and keep interactions positive",
    ],
    requirements: [
      "Bangladeshi, currently living in Bangladesh",
      "Some understanding of software and IT services — you do not need to be technical, just aware",
      "Comfortable communicating in both Bangla and English, with clear verbal communication and active listening",
      "Professional phone etiquette and a friendly, patient approach with every caller",
      "Knowledge of Excel and MS Office for maintaining records and reports",
      "Basic familiarity with CRM tools or call tracking software is an advantage",
      "Own smartphone and stable internet connection",
      "Prior experience in telemarketing, inside sales, or call center work is beneficial but not required",
      "Secondary school diploma or equivalent required; additional education in business or marketing is an advantage",
    ],
    applyEmail: "hello@projecthelpbd.com",
  },
];

export const JOB_SLUGS = JOBS.map((job) => job.slug);

export function getJob(slug: string) {
  return JOBS.find((job) => job.slug === slug);
}

/** Plain-text description for the JobPosting entity, which wants prose. */
export function jobDescription(job: Job) {
  return [
    job.intro,
    `Responsibilities: ${job.responsibilities.join("; ")}.`,
    `Requirements: ${job.requirements.join("; ")}.`,
    `Benefits: ${job.benefits.join("; ")}.`,
  ].join(" ");
}
