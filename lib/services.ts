/**
 * The seven services the company sells, each with its own detail page.
 *
 * The live site carries all seven; this rebuild had only the SaaS page drawn,
 * with the other six linking back to the overview. The SaaS entry below is the
 * copy that page already shipped, moved here verbatim so the page it renders is
 * byte-identical — the other six follow the same shape.
 */

export type ServiceStat = { value: string; copy: string };

/**
 * The five photographs a service page uses.
 *
 * All seven pages previously shared one set, so every service looked like the
 * same page with different words — and two of the shared slots were fashion
 * portraits from the design template, illustrating "Built To Be Handed Over"
 * with a model in sunglasses. Each service now has its own, drawn from the
 * imagery already in /public. Replacing any path here with a real render from
 * the image brief is a one-line change.
 */
export type ServiceImages = {
  hero: string;
  process: string;
  story: [string, string];
  tools: string;
};
export type LeadRest = { lead: string; rest: string };

export type Service = {
  slug: string;
  /** Long form, used as the page title and in navigation. */
  title: string;
  /** The hero headline, split so each line rises separately. */
  heroLines: string[];
  /** Short label for cards and breadcrumbs. */
  shortTitle: string;
  metaDescription: string;
  keywords: string[];
  /** Four-item "What's included" list beside the hero. */
  included: string[];
  /** Opening statement above the body copy. */
  statement: string;
  process: LeadRest[];
  architectureHeading: string;
  architectureLead: string;
  architecturePoints: string[];
  /** The orange-bulleted "What We Deliver" list. */
  deliver: string[];
  handoverHeading: string;
  handoverCopy: string;
  tools: string[];
  stats: ServiceStat[];
  images: ServiceImages;
  whatYouGetCopy: string;
  whatYouGet: LeadRest[];
};

const SHARED_STATS: ServiceStat[] = [
  {
    value: "28+",
    copy: "Platforms, storefronts and internal systems delivered for clients across eCommerce, health tech, fintech and logistics.",
  },
  {
    value: "95%",
    copy: "Client satisfaction across delivered engagements — measured on what shipped, not on what was promised at kickoff.",
  },
  {
    value: "99.9%",
    copy: "Typical uptime after migration, with monitoring, alerting and zero-downtime deploys set up as part of the build.",
  },
];

const SHARED_WHAT_YOU_GET_COPY =
  "One senior team from discovery through to launch and beyond — weekly written updates, an open backlog, and direct access to the engineers doing the work. The people in your kickoff call are the people writing the code.";

export const SERVICES: Service[] = [
  {
    slug: "saas-platform-development",
    title: "SaaS Platform Development",
    shortTitle: "SaaS Platforms",
    heroLines: ["SaaS", "Platforms"],
    metaDescription:
      "Multi-tenant SaaS platforms with subscription billing, usage metering, role-based access control and cloud-native architecture — built for recurring revenue and self-serve growth.",
    keywords: [
      "SaaS platform development",
      "multi-tenant architecture",
      "subscription billing development",
      "SaaS development company",
    ],
    included: [
      "Multi-tenant architecture",
      "Subscription billing",
      "Role-based access control",
      "Analytics & reporting",
    ],
    statement:
      "We build multi-tenant SaaS platforms that earn recurring revenue and keep working as your customer count grows.",
    process: [
      {
        lead: "Discovery & Architecture",
        rest: " – We map tenants, roles and billing rules first, because those decisions are the expensive ones to reverse later.",
      },
      {
        lead: "Build in Sprints",
        rest: " – Two-week cycles against a signed scope. Every fortnight you get working software on staging, not a status deck.",
      },
      {
        lead: "Launch & Support",
        rest: " – A rehearsed go-live with a rollback plan, then 6–12 months of monitoring, patches and bug fixes included.",
      },
    ],
    architectureHeading: "Architecture Decisions That Hold Up Under Real Load",
    architectureLead:
      "We own the whole path — tenancy model, data isolation, billing and deployment pipeline — so the decisions that are expensive to unwind are made deliberately, before the first feature ships.",
    architecturePoints: [
      "Whether you are launching a new product or replacing a system that has outgrown itself, we build platforms that hold up once real customers arrive.",
      "We cover every stage — data model and tenancy design, subscription billing, admin tooling, deployment pipelines and the handover documentation.",
    ],
    deliver: [
      "Multi-tenant architecture & data isolation",
      "Subscription billing and plan management",
      "Role-based access control and admin tooling",
      "Usage metering, quotas and rate limiting",
    ],
    handoverHeading: "Built To Be Handed Over",
    handoverCopy:
      "Documentation, tests and runbooks are part of the deliverable, not an afterthought you have to chase us for. Source, infrastructure definitions and design files live in accounts you control from the first commit.",
    tools: ["Next.js", "Node.js", "PostgreSQL", "AWS"],
    images: {
      hero: "/images/service-detail-hero.webp",
      process: "/images/service-detail-process.webp",
      story: ["/images/service-detail-story-1.webp", "/images/service-detail-story-2.webp"],
      tools: "/images/service-detail-tools.webp",
    },
    stats: SHARED_STATS,
    whatYouGetCopy: SHARED_WHAT_YOU_GET_COPY,
    whatYouGet: [
      {
        lead: "Architecture & data model –",
        rest: " Tenancy, access control and billing designed before the first feature, so scale is not a rewrite.",
      },
      {
        lead: "Product engineering –",
        rest: " React, Next.js, Node and TypeScript, with tests and CI gates on every merge.",
      },
      {
        lead: "Handover & support –",
        rest: " Documentation, runbooks and monitoring you own, plus 6–12 months of post-launch support.",
      },
    ],
  },

  {
    slug: "ecommerce-digital-commerce",
    title: "eCommerce & Digital Commerce",
    shortTitle: "eCommerce",
    heroLines: ["Digital", "Commerce"],
    metaDescription:
      "B2C storefronts, B2B trade portals and multi-vendor marketplaces with payment gateways, inventory and order management — stores engineered to hold up on campaign day.",
    keywords: [
      "eCommerce development company",
      "multi-vendor marketplace development",
      "B2B commerce platform",
      "payment gateway integration",
    ],
    included: [
      "B2C & B2B storefronts",
      "Multi-vendor marketplaces",
      "Payment & wallet integration",
      "Inventory & order management",
    ],
    statement:
      "We build storefronts and marketplaces that stay fast when the campaign lands and the traffic arrives all at once.",
    process: [
      {
        lead: "Catalogue & Commerce Model",
        rest: " – Products, variants, pricing tiers and tax rules are modelled first, because a catalogue built on the wrong shape is a re-platform later.",
      },
      {
        lead: "Build in Sprints",
        rest: " – Two-week cycles against a signed scope, with checkout and payments wired early so the money path is proven long before launch.",
      },
      {
        lead: "Launch & Peak Readiness",
        rest: " – Load-tested go-live with a rollback plan, then 6–12 months of monitoring, patches and bug fixes included.",
      },
    ],
    architectureHeading: "Built For The Day The Traffic Actually Arrives",
    architectureLead:
      "Checkout, inventory and payment reconciliation are where commerce projects fail quietly. We build those three first and load-test them before anything cosmetic gets attention.",
    architecturePoints: [
      "Whether you are launching a first storefront or replacing a platform that buckles under promotions, we build for the peak rather than the average day.",
      "We cover every stage — catalogue and pricing model, checkout, payment and wallet integration, fulfilment, returns and the reporting your finance team needs.",
    ],
    deliver: [
      "B2C storefronts and B2B trade portals",
      "Multi-vendor marketplace infrastructure",
      "Payment gateway and wallet integration",
      "Inventory, warehousing and order management",
    ],
    handoverHeading: "Merchandising You Can Run Without Us",
    handoverCopy:
      "Campaigns, pricing rules and catalogue changes belong to your team, not to a support ticket. We ship the admin tooling and the documentation that makes day-to-day trading a self-serve job.",
    tools: ["Next.js", "Node.js", "PostgreSQL", "Stripe"],
    images: {
      hero: "/images/service-02-webflow.webp",
      process: "/images/case-detail-banner.jpg",
      story: ["/images/case-study-card-1.jpg", "/images/case-study-card-2.jpg"],
      tools: "/images/work-card-sottozero.webp",
    },
    stats: SHARED_STATS,
    whatYouGetCopy: SHARED_WHAT_YOU_GET_COPY,
    whatYouGet: [
      {
        lead: "Commerce architecture –",
        rest: " Catalogue, pricing, tax and fulfilment modelled before the first screen, so a new market is configuration rather than a rebuild.",
      },
      {
        lead: "Storefront engineering –",
        rest: " Fast, accessible pages with checkout optimisation, search, filtering and abandoned-cart recovery built in.",
      },
      {
        lead: "Handover & support –",
        rest: " Admin tooling, runbooks and monitoring you own, plus 6–12 months of post-launch support.",
      },
    ],
  },

  {
    slug: "devops-cloud-infrastructure",
    title: "DevOps & Cloud Infrastructure",
    shortTitle: "DevOps & Cloud",
    heroLines: ["DevOps", "& Cloud"],
    metaDescription:
      "CI/CD pipelines, infrastructure as code and container orchestration on AWS, Azure or Google Cloud — with monitoring, rollback plans and cost control from day one.",
    keywords: [
      "DevOps consulting services",
      "CI/CD pipeline setup",
      "infrastructure as code",
      "Kubernetes consulting",
      "cloud migration services",
    ],
    included: [
      "CI/CD pipelines",
      "Infrastructure as code",
      "Docker & Kubernetes",
      "Monitoring & alerting",
    ],
    statement:
      "We turn deployment from an event somebody has to be awake for into something that happens several times a day without drama.",
    process: [
      {
        lead: "Audit & Baseline",
        rest: " – We measure what you have now: deploy frequency, lead time, failure rate and recovery time. Everything after that is judged against those four numbers.",
      },
      {
        lead: "Automate In Slices",
        rest: " – Pipelines, environments and infrastructure definitions land service by service, so nothing needs a big-bang cutover to start paying off.",
      },
      {
        lead: "Hand Over The Keys",
        rest: " – Runbooks, dashboards and on-call playbooks your team owns, plus 6–12 months of support while the habits set.",
      },
    ],
    architectureHeading: "Infrastructure That Is Written Down, Not Remembered",
    architectureLead:
      "Every environment is defined in code and reproducible from an empty account. If a server cannot be rebuilt from the repository, it is a liability rather than an asset.",
    architecturePoints: [
      "Whether you are moving off a single rented box or tidying a cloud account that grew without a plan, we make the current state explicit before changing it.",
      "We cover every stage — pipelines and testing gates, container orchestration, secrets, monitoring, autoscaling policy and the cost controls that stop the bill drifting.",
    ],
    deliver: [
      "CI/CD pipelines with automated testing gates",
      "Infrastructure as code (Terraform, CloudFormation)",
      "Containerisation with Docker and Kubernetes",
      "Monitoring, logging and alerting stacks",
    ],
    handoverHeading: "Your Cloud Account, Your Credentials",
    handoverCopy:
      "Infrastructure definitions, pipelines and dashboards live in accounts you control from the first commit. Nothing we set up needs us to keep it running, and the runbooks say what to do at 3am.",
    tools: ["Terraform", "Docker", "Kubernetes", "AWS"],
    images: {
      hero: "/images/case-detail-hero.jpg",
      process: "/images/showcase-collaboration.webp",
      story: ["/images/case-detail-solution-1.jpg", "/images/case-detail-solution-2.jpg"],
      tools: "/images/about-photo-working.webp",
    },
    stats: SHARED_STATS,
    whatYouGetCopy: SHARED_WHAT_YOU_GET_COPY,
    whatYouGet: [
      {
        lead: "Pipelines & environments –",
        rest: " Reproducible staging and production, with automated tests gating every merge.",
      },
      {
        lead: "Observability –",
        rest: " Metrics, logs, traces and alerts that point at a cause rather than just telling you something is wrong.",
      },
      {
        lead: "Handover & support –",
        rest: " Runbooks, escalation paths and cost dashboards you own, plus 6–12 months of post-launch support.",
      },
    ],
  },

  {
    slug: "ai-ml-data-analytics",
    title: "AI/ML & Data Analytics",
    shortTitle: "AI/ML & Data",
    heroLines: ["AI/ML", "& Data"],
    metaDescription:
      "Predictive models, document extraction, recommendation engines and LLM integration over your own data — AI that answers a business question rather than demoing well.",
    keywords: [
      "AI ML development services",
      "LLM integration company",
      "predictive analytics development",
      "RAG implementation",
      "data pipeline development",
    ],
    included: [
      "Predictive analytics",
      "LLM & RAG integration",
      "Document extraction",
      "BI dashboards & pipelines",
    ],
    statement:
      "We build AI features that answer a question somebody is already paying to answer by hand — not demos that impress once and then sit unused.",
    process: [
      {
        lead: "Find The Decision",
        rest: " – We start from a decision your team makes repeatedly and expensively. If we cannot name it, the model has nothing to be judged against.",
      },
      {
        lead: "Baseline, Then Model",
        rest: " – A dumb baseline first, so there is an honest number to beat. Then the smallest model that beats it, evaluated on your data rather than a benchmark.",
      },
      {
        lead: "Ship & Monitor",
        rest: " – Into the product behind a feature flag, with drift monitoring and a fallback path, plus 6–12 months of support.",
      },
    ],
    architectureHeading: "The Data Work Is The Project",
    architectureLead:
      "Most AI engagements fail on plumbing, not on modelling. We treat ingestion, labelling, evaluation and monitoring as the deliverable, with the model as one replaceable component inside it.",
    architecturePoints: [
      "Whether you want forecasting, document extraction or an assistant over your own knowledge base, the work starts with getting the data reliable and measurable.",
      "We cover every stage — pipelines and warehousing, retrieval and embeddings, evaluation harnesses, guardrails, and the dashboards that show whether it is still working.",
    ],
    deliver: [
      "Predictive analytics and forecasting models",
      "LLM integration with retrieval over your own data",
      "Computer vision and document extraction",
      "Data pipelines, warehousing and BI dashboards",
    ],
    handoverHeading: "Evaluated, Not Just Demonstrated",
    handoverCopy:
      "Every model ships with the evaluation set it was measured on and the score it achieved, so your team can tell later whether a change helped. Notebooks, prompts and pipelines live in your repositories.",
    tools: ["Python", "PyTorch", "PostgreSQL", "AWS"],
    images: {
      hero: "/images/service-03-uiux.webp",
      process: "/images/case-detail-problem-2.jpg",
      story: ["/images/case-study-card-3.jpg", "/images/case-study-card-4.jpg"],
      tools: "/images/service-01-uiux.webp",
    },
    stats: SHARED_STATS,
    whatYouGetCopy: SHARED_WHAT_YOU_GET_COPY,
    whatYouGet: [
      {
        lead: "Data foundation –",
        rest: " Ingestion, cleaning and warehousing, so the same numbers appear in every report.",
      },
      {
        lead: "Model & evaluation –",
        rest: " The smallest model that beats a documented baseline, with the harness that proves it.",
      },
      {
        lead: "Handover & support –",
        rest: " Pipelines, prompts and monitoring you own, plus 6–12 months of post-launch support.",
      },
    ],
  },

  {
    slug: "technology-consulting",
    title: "Technology Consulting",
    shortTitle: "Consulting",
    heroLines: ["Technology", "Consulting"],
    metaDescription:
      "Architecture assessments, technical due diligence and digital transformation roadmaps that turn a vague modernisation goal into a sequenced, fundable plan.",
    keywords: [
      "technology consulting company",
      "software architecture assessment",
      "technical due diligence",
      "digital transformation roadmap",
      "fractional CTO",
    ],
    included: [
      "Architecture assessments",
      "Transformation roadmaps",
      "Technical due diligence",
      "Fractional CTO advisory",
    ],
    statement:
      "We give you a written, sequenced plan you can fund — with the trade-offs stated plainly, including the ones that argue against hiring us.",
    process: [
      {
        lead: "Assess What Exists",
        rest: " – Code, infrastructure, team structure and delivery history. We read the repository rather than relying on what the last vendor said about it.",
      },
      {
        lead: "Name The Trade-offs",
        rest: " – Build versus buy, rewrite versus strangle, hire versus outsource — each with a cost, a risk and a recommendation you can disagree with.",
      },
      {
        lead: "Sequence The Plan",
        rest: " – A roadmap in fundable phases, each one shipping something usable, so the programme can be stopped at any phase boundary without waste.",
      },
    ],
    architectureHeading: "An Honest Read Of Where You Actually Are",
    architectureLead:
      "An assessment that only confirms what you hoped is worthless. We write down what is genuinely wrong, what is fine as it is, and what will break next — with evidence from the codebase.",
    architecturePoints: [
      "Whether you are planning a rebuild, buying a company or deciding whether to keep a system alive, the first deliverable is a clear picture of the present.",
      "We cover every stage — audit, architecture options, cost modelling, team and hiring advice, and ongoing advisory once the plan is running.",
    ],
    deliver: [
      "Technology audits and architecture assessments",
      "Digital transformation roadmaps",
      "Technical due diligence for investors and acquirers",
      "Build-vs-buy and vendor evaluation",
    ],
    handoverHeading: "A Plan You Can Hand To Anyone",
    handoverCopy:
      "The roadmap is written so another firm could execute it. We would rather be chosen on the work than retained because nobody else can read the plan.",
    tools: ["Architecture review", "Cost modelling", "Roadmapping", "Advisory"],
    images: {
      hero: "/images/about-showcase.jpg",
      process: "/images/about-mission.jpg",
      story: ["/images/case-detail-problem-1.jpg", "/images/case-detail-problem-3.jpg"],
      tools: "/images/contact-desk.jpg",
    },
    stats: SHARED_STATS,
    whatYouGetCopy: SHARED_WHAT_YOU_GET_COPY,
    whatYouGet: [
      {
        lead: "Written assessment –",
        rest: " What exists today, what is at risk, and what it would cost to leave it alone.",
      },
      {
        lead: "Sequenced roadmap –",
        rest: " Fundable phases with estimates, dependencies and a stop point at each boundary.",
      },
      {
        lead: "Ongoing advisory –",
        rest: " Fractional CTO time while the plan runs, so decisions do not stall between phases.",
      },
    ],
  },

  {
    slug: "mobile-app-development",
    title: "Mobile App Development",
    shortTitle: "Mobile Apps",
    heroLines: ["Mobile", "Apps"],
    metaDescription:
      "Native and cross-platform iOS and Android apps built for real usage — offline-first sync, push notifications and a release pipeline that keeps shipping after launch day.",
    keywords: [
      "mobile app development company",
      "React Native development",
      "Flutter app development",
      "iOS and Android development",
      "offline-first mobile apps",
    ],
    included: [
      "Native iOS & Android",
      "React Native / Flutter",
      "Offline-first sync",
      "Store release management",
    ],
    statement:
      "We build apps for how they will actually be used — on a weak connection, one-handed, by someone who is busy — not for how they look in a store screenshot.",
    process: [
      {
        lead: "Usage & Constraints First",
        rest: " – Where the app is used, on what hardware and on what connection. Those three answers decide native versus cross-platform, not preference.",
      },
      {
        lead: "Build in Sprints",
        rest: " – Two-week cycles with a real build on your device every fortnight, distributed through TestFlight and internal testing tracks.",
      },
      {
        lead: "Release & Iterate",
        rest: " – Store submission handled for you, with crash reporting, analytics and an update pipeline, plus 6–12 months of support.",
      },
    ],
    architectureHeading: "Offline Is The Normal Case, Not The Edge Case",
    architectureLead:
      "Field apps lose signal. We design the sync model, conflict resolution and local storage up front, so a dropped connection is an inconvenience rather than lost work.",
    architecturePoints: [
      "Whether it is a customer-facing app or a tool for staff in the field, the data model and sync strategy decide whether it survives real conditions.",
      "We cover every stage — platform choice, offline sync, push notifications, store submission, crash reporting and the release pipeline that follows.",
    ],
    deliver: [
      "Native iOS and Android development",
      "Cross-platform builds with React Native / Flutter",
      "Offline-first data sync and local storage",
      "App Store and Play Store release management",
    ],
    handoverHeading: "Your Developer Accounts, Your Signing Keys",
    handoverCopy:
      "Store listings, signing certificates and release pipelines belong to you from day one. Handover is a matter of removing our access, not migrating anything.",
    tools: ["React Native", "Swift", "Kotlin", "Firebase"],
    images: {
      hero: "/images/service-04-brand.webp",
      process: "/images/work-card-leafy-plant.webp",
      story: ["/images/showcase-collaboration-alt.png", "/images/work-card-sottozero.webp"],
      tools: "/images/service-02-webflow.webp",
    },
    stats: SHARED_STATS,
    whatYouGetCopy: SHARED_WHAT_YOU_GET_COPY,
    whatYouGet: [
      {
        lead: "Platform decision –",
        rest: " Native or cross-platform argued from your usage and budget, with the trade-off written down.",
      },
      {
        lead: "App engineering –",
        rest: " Offline-first data, push notifications and accessibility, with automated builds on every merge.",
      },
      {
        lead: "Handover & support –",
        rest: " Store accounts, signing keys and release runbooks you own, plus 6–12 months of post-launch support.",
      },
    ],
  },

  {
    slug: "cybersecurity-data-protection",
    title: "Cybersecurity & Data Protection",
    shortTitle: "Cybersecurity",
    heroLines: ["Security", "& Data"],
    metaDescription:
      "Vulnerability assessments, penetration testing, access-control design and compliance readiness — security built into the system rather than checked once before launch.",
    keywords: [
      "cybersecurity services company",
      "penetration testing services",
      "GDPR compliance software",
      "SOC 2 readiness",
      "application security audit",
    ],
    included: [
      "Vulnerability assessments",
      "Penetration testing",
      "Access & secrets management",
      "Compliance readiness",
    ],
    statement:
      "We make security a property of the system — enforced by the code and the pipeline — rather than a checklist somebody runs the week before launch.",
    process: [
      {
        lead: "Threat Model First",
        rest: " – Who would attack this, what for, and what it would cost you. Controls are chosen against that, not against a generic list.",
      },
      {
        lead: "Test, Then Fix",
        rest: " – Assessment and penetration testing with findings ranked by real exploitability, then remediation work alongside your team rather than a report handed over.",
      },
      {
        lead: "Keep It Enforced",
        rest: " – Dependency scanning, secrets detection and access reviews wired into the pipeline, plus 6–12 months of support.",
      },
    ],
    architectureHeading: "Controls That Survive The Next Deploy",
    architectureLead:
      "A fix that depends on a person remembering is not a fix. Every control we put in place is enforced by the pipeline, so it holds after the engagement ends.",
    architecturePoints: [
      "Whether you are preparing for an audit or responding to something that already went wrong, the work starts with an honest inventory of data, access and exposure.",
      "We cover every stage — threat modelling, authentication and authorisation design, encryption, compliance evidence, monitoring and incident response planning.",
    ],
    deliver: [
      "Vulnerability assessments and penetration testing",
      "Access control, authentication and secrets management",
      "Compliance support (GDPR, PCI-DSS, SOC 2 readiness)",
      "Security monitoring and incident response planning",
    ],
    handoverHeading: "Evidence Your Auditor Will Accept",
    handoverCopy:
      "Findings, remediation history and policy documents are written for the people who will ask for them later — auditors, enterprise buyers and your own board.",
    tools: ["OWASP", "Snyk", "Vault", "Cloudflare"],
    images: {
      hero: "/images/about-vision.jpg",
      process: "/images/service-detail-tools.webp",
      story: ["/images/case-detail-solution-2.jpg", "/images/about-gallery-3.jpg"],
      tools: "/images/case-detail-hero.jpg",
    },
    stats: SHARED_STATS,
    whatYouGetCopy: SHARED_WHAT_YOU_GET_COPY,
    whatYouGet: [
      {
        lead: "Assessment –",
        rest: " Findings ranked by exploitability and business impact, not by scanner severity alone.",
      },
      {
        lead: "Remediation –",
        rest: " Fixes implemented with your team, and controls enforced in CI so they cannot silently regress.",
      },
      {
        lead: "Handover & support –",
        rest: " Policies, evidence and monitoring you own, plus 6–12 months of post-launch support.",
      },
    ],
  },
];

export const SERVICE_SLUGS = SERVICES.map((service) => service.slug);

export function getService(slug: string) {
  return SERVICES.find((service) => service.slug === slug);
}
