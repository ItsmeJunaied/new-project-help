/**
 * The fifteen services the company sells, each with its own detail page.
 *
 * The first seven are the ones the live site carried, and the SaaS entry below
 * is the copy that page already shipped, moved here verbatim so the page it
 * renders is byte-identical. The eight after them are the capabilities the
 * services rail had always named but never linked anywhere: a card that says
 * "ERP Systems", draws its own artwork and does nothing when you click it is
 * worse than no card at all. They follow the same shape as the first seven.
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

  {
    slug: "custom-software-development",
    title: "Custom Software Development",
    shortTitle: "Custom Software",
    heroLines: ["Custom", "Software"],
    metaDescription:
      "Custom software written around how your business actually works — for the processes no off-the-shelf product fits. Discovery, build and documented handover by senior engineers.",
    keywords: [
      "custom software development",
      "bespoke software development company",
      "custom business software",
      "software development Bangladesh",
    ],
    included: [
      "Process discovery",
      "A data model that fits",
      "Integrations with what you run",
      "Migration off the spreadsheets",
    ],
    statement:
      "We write software around how a business already works, for the parts of it no product off the shelf will ever fit.",
    process: [
      {
        lead: "Sit With The Work",
        rest: " – We watch the process being done before we design anything. What makes a bespoke system worth building is almost always in the exceptions nobody wrote down.",
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
    architectureHeading: "Built For One Business, Not For A Market",
    architectureLead:
      "A product has to fit a thousand companies, so it fits none of them exactly. Custom software has one business to satisfy, which means the awkward parts of your process get modelled rather than worked around.",
    architecturePoints: [
      "We take on the work that spreadsheets, a shared inbox and three disconnected tools are currently holding together.",
      "Discovery, data model, application, integrations and the handover documentation — one senior team across all of it.",
    ],
    deliver: [
      "A data model that matches how you actually operate",
      "Role-based access for every team that touches it",
      "Integrations with the systems you already run",
      "Import and migration from what it replaces",
    ],
    handoverHeading: "Built To Be Handed Over",
    handoverCopy:
      "Documentation, tests and runbooks are part of the deliverable, not an afterthought you have to chase us for. Source, infrastructure definitions and design files live in accounts you control from the first commit.",
    tools: ["TypeScript", "Node.js", "PostgreSQL", "Docker"],
    images: {
      hero: "/images/services/custom-software.webp",
      process: "/images/about-photo-working.webp",
      story: ["/images/case-detail-problem-1.jpg", "/images/case-detail-solution-1.jpg"],
      tools: "/images/service-detail-tools.webp",
    },
    stats: SHARED_STATS,
    whatYouGetCopy: SHARED_WHAT_YOU_GET_COPY,
    whatYouGet: [
      {
        lead: "Discovery –",
        rest: " Your process mapped end to end, including the exceptions, before anyone opens an editor.",
      },
      {
        lead: "Product engineering –",
        rest: " TypeScript across the stack, with tests and CI gates on every merge.",
      },
      {
        lead: "Handover & support –",
        rest: " Documentation, runbooks and monitoring you own, plus 6–12 months of post-launch support.",
      },
    ],
  },

  {
    slug: "web-application-development",
    title: "Web Application Development",
    shortTitle: "Web Applications",
    heroLines: ["Web", "Applications"],
    metaDescription:
      "Dashboards, portals and internal tools that stay quick once there is real data behind them — built in React and Next.js with the performance budget agreed up front.",
    keywords: [
      "web application development",
      "custom dashboard development",
      "internal tools development",
      "Next.js development company",
    ],
    included: [
      "Dashboards & portals",
      "Role-based access",
      "Real-time data",
      "A performance budget",
    ],
    statement:
      "We build the web applications a business runs on — dashboards, portals and internal tools that stay quick once there is real data behind them.",
    process: [
      {
        lead: "Screens & States",
        rest: " – We agree the screens, the roles that see them and what each one does when the data is empty, slow or wrong. That list is the scope.",
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
    architectureHeading: "Fast On The Tenth Thousand Row, Not Just The Tenth",
    architectureLead:
      "Most internal tools are quick in a demo and unusable a year in. We set a performance budget at the start, seed staging with production-sized data, and hold the build to it on every merge.",
    architecturePoints: [
      "Server rendering, pagination and query design decided against the data volume you will actually have, not the one in the prototype.",
      "Accessibility, keyboard paths and error states are part of the definition of done — these are tools people use all day.",
    ],
    deliver: [
      "Dashboards, portals and admin surfaces",
      "Role-based access and audit trails",
      "Real-time updates where they earn their cost",
      "Exports, reporting and scheduled jobs",
    ],
    handoverHeading: "Built To Be Handed Over",
    handoverCopy:
      "Documentation, tests and runbooks are part of the deliverable, not an afterthought you have to chase us for. Source, infrastructure definitions and design files live in accounts you control from the first commit.",
    tools: ["Next.js", "React", "PostgreSQL", "Redis"],
    images: {
      hero: "/images/services/web-applications.webp",
      process: "/images/service-detail-process.webp",
      story: ["/images/case-study-card-1.jpg", "/images/case-study-card-3.jpg"],
      tools: "/images/service-01-uiux.webp",
    },
    stats: SHARED_STATS,
    whatYouGetCopy: SHARED_WHAT_YOU_GET_COPY,
    whatYouGet: [
      {
        lead: "Interface engineering –",
        rest: " Every screen, role and empty state agreed before the build, so scope creep has nowhere to hide.",
      },
      {
        lead: "Performance –",
        rest: " A budget set at kickoff and enforced in CI against production-sized data.",
      },
      {
        lead: "Handover & support –",
        rest: " Documentation, runbooks and monitoring you own, plus 6–12 months of post-launch support.",
      },
    ],
  },

  {
    slug: "erp-software-development",
    title: "ERP Software Development",
    shortTitle: "ERP Systems",
    heroLines: ["ERP", "Systems"],
    metaDescription:
      "Custom ERP development — inventory, production, purchasing and accounts in one system that finally agrees with itself. Built around your operation, migrated from what you run today.",
    keywords: [
      "ERP software development",
      "custom ERP system",
      "inventory management software",
      "ERP development company",
    ],
    included: [
      "Inventory & production",
      "Purchasing & suppliers",
      "Accounts integration",
      "Migration from legacy",
    ],
    statement:
      "We build ERP systems that put inventory, production, purchasing and accounts in one place, finally agreeing with each other.",
    process: [
      {
        lead: "Map The Operation",
        rest: " – Every module starts as a walk through the floor and the finance office. An ERP that disagrees with the stock room is worse than the spreadsheets it replaced.",
      },
      {
        lead: "Module By Module",
        rest: " – We ship one working module at a time, in two-week cycles, so the business adopts it in pieces rather than on one bad Monday.",
      },
      {
        lead: "Cutover & Support",
        rest: " – A rehearsed migration with a rollback plan and parallel running, then 6–12 months of monitoring, patches and bug fixes included.",
      },
    ],
    architectureHeading: "One Set Of Numbers, Whoever Is Asking",
    architectureLead:
      "The value of an ERP is not in any one module. It is that stock, cost, margin and what accounts reported all come from the same record, so nobody spends the month-end reconciling three systems by hand.",
    architecturePoints: [
      "Inventory, production, purchasing, sales and accounts modelled together, with the movements between them recorded rather than re-keyed.",
      "Migration and parallel running planned from the first week — an ERP project fails at the cutover far more often than in the build.",
    ],
    deliver: [
      "Inventory, warehousing and stock movements",
      "Production planning and bills of material",
      "Purchasing, suppliers and goods received",
      "Accounts integration and month-end reporting",
    ],
    handoverHeading: "Built To Be Handed Over",
    handoverCopy:
      "Documentation, tests and runbooks are part of the deliverable, not an afterthought you have to chase us for. Source, infrastructure definitions and design files live in accounts you control from the first commit.",
    tools: ["Node.js", "PostgreSQL", "Next.js", "Docker"],
    images: {
      hero: "/images/services/erp-systems.webp",
      process: "/images/case-detail-banner.jpg",
      story: ["/images/case-detail-problem-2.jpg", "/images/case-detail-solution-2.jpg"],
      tools: "/images/about-photo-working.webp",
    },
    stats: SHARED_STATS,
    whatYouGetCopy: SHARED_WHAT_YOU_GET_COPY,
    whatYouGet: [
      {
        lead: "Operational discovery –",
        rest: " The floor, the stock room and the finance office walked before a module is designed.",
      },
      {
        lead: "Staged delivery –",
        rest: " One working module at a time, so adoption happens in pieces rather than on one bad Monday.",
      },
      {
        lead: "Cutover & support –",
        rest: " Rehearsed migration, parallel running, and 6–12 months of post-launch support.",
      },
    ],
  },

  {
    slug: "crm-software-development",
    title: "CRM Software Development",
    shortTitle: "CRM Systems",
    heroLines: ["CRM", "Systems"],
    metaDescription:
      "Custom CRM development — pipelines, quotes and forecasts shaped around your sales motion rather than a template's stages. Integrated with the tools your team already uses.",
    keywords: [
      "CRM software development",
      "custom CRM system",
      "sales pipeline software",
      "CRM development company",
    ],
    included: [
      "Pipelines & stages",
      "Quotes & proposals",
      "Forecasting",
      "Email and calendar sync",
    ],
    statement:
      "We build CRM systems shaped around your sales motion, rather than one that asks your team to sell the way a template expects.",
    process: [
      {
        lead: "Follow A Deal",
        rest: " – We trace a real deal from first contact to signature before designing a stage. Every team has steps their current CRM made them skip.",
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
    architectureHeading: "A CRM Your Team Will Actually Update",
    architectureLead:
      "A pipeline nobody updates is worse than no pipeline, because the forecast built on it is confidently wrong. The fastest way to fix that is to stop asking people to enter what the system could have known.",
    architecturePoints: [
      "Email, calendar and call activity captured automatically, so the record is a by-product of the work rather than another task after it.",
      "Stages, fields and permissions modelled on your motion — and reportable, so the forecast comes out of the same data the reps live in.",
    ],
    deliver: [
      "Pipelines and stages built around your motion",
      "Quotes, proposals and approval steps",
      "Forecasting and territory reporting",
      "Email, calendar and telephony integration",
    ],
    handoverHeading: "Built To Be Handed Over",
    handoverCopy:
      "Documentation, tests and runbooks are part of the deliverable, not an afterthought you have to chase us for. Source, infrastructure definitions and design files live in accounts you control from the first commit.",
    tools: ["Next.js", "Node.js", "PostgreSQL", "AWS"],
    images: {
      hero: "/images/services/crm-systems.webp",
      process: "/images/showcase-collaboration.webp",
      story: ["/images/case-study-card-2.jpg", "/images/case-study-card-4.jpg"],
      tools: "/images/contact-desk.jpg",
    },
    stats: SHARED_STATS,
    whatYouGetCopy: SHARED_WHAT_YOU_GET_COPY,
    whatYouGet: [
      {
        lead: "Sales discovery –",
        rest: " A real deal traced end to end before a single stage is designed.",
      },
      {
        lead: "Capture, not data entry –",
        rest: " Email, calendar and call activity recorded automatically so the pipeline stays true.",
      },
      {
        lead: "Handover & support –",
        rest: " Documentation, runbooks and monitoring you own, plus 6–12 months of post-launch support.",
      },
    ],
  },

  {
    slug: "enterprise-software-development",
    title: "Enterprise Software Development",
    shortTitle: "Enterprise Software",
    heroLines: ["Enterprise", "Software"],
    metaDescription:
      "Enterprise platforms for the people who run the business — HR, payroll, operations and reporting. Single sign-on, audit trails and the integrations your estate already depends on.",
    keywords: [
      "enterprise software development",
      "enterprise application development",
      "HR and payroll software",
      "enterprise software company",
    ],
    included: [
      "Single sign-on",
      "Audit trails",
      "Estate integrations",
      "Role and policy design",
    ],
    statement:
      "We build the platforms the people running a business use all day — HR, payroll, operations and the reporting that sits on top of them.",
    process: [
      {
        lead: "Stakeholders & Policy",
        rest: " – Enterprise work has more people with a veto than any other kind. We get the access policy, the approvals and the reporting obligations written down first.",
      },
      {
        lead: "Build in Sprints",
        rest: " – Two-week cycles against a signed scope. Every fortnight you get working software on staging, not a status deck.",
      },
      {
        lead: "Rollout & Support",
        rest: " – Phased by department, with a rollback plan and training material, then 6–12 months of monitoring, patches and bug fixes included.",
      },
    ],
    architectureHeading: "It Has To Live In The Estate You Already Have",
    architectureLead:
      "Enterprise software is rarely greenfield. It has to authenticate against your directory, respect your retention policy, and exchange data with systems that were in place long before this project started.",
    architecturePoints: [
      "Single sign-on, directory groups and role mapping, so joiners and leavers are handled where your organisation already handles them.",
      "Audit trails, retention rules and exportable evidence built in — because someone will eventually ask who changed what, and when.",
    ],
    deliver: [
      "HR, payroll and operations modules",
      "Single sign-on and directory integration",
      "Audit trails and retention policy",
      "Reporting for the people who sign things off",
    ],
    handoverHeading: "Built To Be Handed Over",
    handoverCopy:
      "Documentation, tests and runbooks are part of the deliverable, not an afterthought you have to chase us for. Source, infrastructure definitions and design files live in accounts you control from the first commit.",
    tools: ["Next.js", "Node.js", "PostgreSQL", "Azure"],
    images: {
      hero: "/images/services/enterprise-software.webp",
      process: "/images/about-mission.jpg",
      story: ["/images/about-gallery-3.jpg", "/images/case-detail-solution-1.jpg"],
      tools: "/images/service-detail-hero.webp",
    },
    stats: SHARED_STATS,
    whatYouGetCopy: SHARED_WHAT_YOU_GET_COPY,
    whatYouGet: [
      {
        lead: "Policy first –",
        rest: " Access, approvals and reporting obligations agreed in writing before the build starts.",
      },
      {
        lead: "Estate integration –",
        rest: " Single sign-on, directory groups and data exchange with the systems already in place.",
      },
      {
        lead: "Rollout & support –",
        rest: " Phased by department with training material, plus 6–12 months of post-launch support.",
      },
    ],
  },

  {
    slug: "api-development",
    title: "API Development",
    shortTitle: "API Development",
    heroLines: ["API", "Development"],
    metaDescription:
      "Documented, versioned APIs another team can build against without reading your controllers — REST and GraphQL, with authentication, rate limiting and a contract that holds.",
    keywords: [
      "API development services",
      "REST API development",
      "GraphQL API development",
      "API integration company",
    ],
    included: [
      "OpenAPI contract",
      "Authentication & scopes",
      "Versioning policy",
      "Rate limiting",
    ],
    statement:
      "We build documented, versioned APIs another team can integrate against without having to read your controllers to find out what they do.",
    process: [
      {
        lead: "Contract First",
        rest: " – The schema is agreed and published before the implementation exists, so the teams consuming it can start building the same week you do.",
      },
      {
        lead: "Build in Sprints",
        rest: " – Two-week cycles against a signed scope, with the contract tested on every merge so the documentation cannot drift from the behaviour.",
      },
      {
        lead: "Launch & Support",
        rest: " – A rehearsed go-live with a rollback plan, then 6–12 months of monitoring, patches and bug fixes included.",
      },
    ],
    architectureHeading: "The Contract Is The Product",
    architectureLead:
      "An API is used by people who will never meet you and cannot ask a question. Everything they need has to be in the contract — what exists, what it returns, what happens when it fails, and what you promise not to change.",
    architecturePoints: [
      "OpenAPI or GraphQL schema published, versioned and tested against the running service, so the docs are generated from the truth rather than written beside it.",
      "Authentication, scopes, pagination, idempotency and rate limits designed once and applied across every endpoint rather than per route.",
    ],
    deliver: [
      "REST or GraphQL APIs with a published schema",
      "Authentication, scopes and rate limiting",
      "A versioning and deprecation policy",
      "Sandbox environment and integration guides",
    ],
    handoverHeading: "Built To Be Handed Over",
    handoverCopy:
      "Documentation, tests and runbooks are part of the deliverable, not an afterthought you have to chase us for. Source, infrastructure definitions and design files live in accounts you control from the first commit.",
    tools: ["Node.js", "TypeScript", "PostgreSQL", "OpenAPI"],
    images: {
      hero: "/images/services/api-development.webp",
      process: "/images/service-detail-tools.webp",
      story: ["/images/case-detail-problem-3.jpg", "/images/case-study-card-1.jpg"],
      tools: "/images/service-detail-process.webp",
    },
    stats: SHARED_STATS,
    whatYouGetCopy: SHARED_WHAT_YOU_GET_COPY,
    whatYouGet: [
      {
        lead: "Contract first –",
        rest: " A published schema before implementation, so consumers start the same week you do.",
      },
      {
        lead: "Operable by design –",
        rest: " Authentication, rate limits, idempotency and logging applied once, across every endpoint.",
      },
      {
        lead: "Handover & support –",
        rest: " Documentation, runbooks and monitoring you own, plus 6–12 months of post-launch support.",
      },
    ],
  },

  {
    slug: "microservices-architecture",
    title: "Microservices Architecture",
    shortTitle: "Microservices",
    heroLines: ["Micro", "services"],
    metaDescription:
      "Services split along boundaries that exist in the business, for when a monolith has stopped fitting — with the messaging, observability and deployment story worked out first.",
    keywords: [
      "microservices architecture",
      "monolith to microservices migration",
      "distributed systems development",
      "microservices consulting",
    ],
    included: [
      "Boundary analysis",
      "Messaging & events",
      "Observability",
      "Staged migration",
    ],
    statement:
      "We split systems along boundaries that already exist in the business — for when a monolith has genuinely stopped fitting, and not before.",
    process: [
      {
        lead: "Find The Seams",
        rest: " – We look for the boundaries the business already has. Splitting a system along the wrong lines produces a distributed monolith, which is strictly worse than the one you had.",
      },
      {
        lead: "Strangle, Don't Rewrite",
        rest: " – Services are carved out one at a time behind the existing interface, in two-week cycles, with the old path live until the new one has proved itself.",
      },
      {
        lead: "Cutover & Support",
        rest: " – Traffic moved gradually with a rollback at every step, then 6–12 months of monitoring, patches and bug fixes included.",
      },
    ],
    architectureHeading: "Most Systems Should Not Be Split",
    architectureLead:
      "Microservices trade a problem you understand for a set of problems you cannot debug with a stack trace. We will tell you when a modular monolith is the right answer, and we say so before the engagement rather than after it.",
    architecturePoints: [
      "When the split is right, the payoff is teams deploying independently — so the boundaries follow the org chart and the data, not the layer diagram.",
      "Messaging, retries, idempotency, tracing and a deployment story are designed before the first service leaves the monolith, not discovered in production.",
    ],
    deliver: [
      "A boundary analysis with a recommendation",
      "Service extraction, one at a time, behind the old interface",
      "Event and messaging infrastructure",
      "Distributed tracing, metrics and alerting",
    ],
    handoverHeading: "Built To Be Handed Over",
    handoverCopy:
      "Documentation, tests and runbooks are part of the deliverable, not an afterthought you have to chase us for. Source, infrastructure definitions and design files live in accounts you control from the first commit.",
    tools: ["Docker", "Kubernetes", "RabbitMQ", "OpenTelemetry"],
    images: {
      hero: "/images/services/microservices.webp",
      process: "/images/case-detail-hero.jpg",
      story: ["/images/case-detail-solution-2.jpg", "/images/about-gallery-2.jpg"],
      tools: "/images/service-detail-tools.webp",
    },
    stats: SHARED_STATS,
    whatYouGetCopy: SHARED_WHAT_YOU_GET_COPY,
    whatYouGet: [
      {
        lead: "An honest recommendation –",
        rest: " Including “do not split this”, when a modular monolith is the better answer.",
      },
      {
        lead: "Staged extraction –",
        rest: " One service at a time behind the existing interface, with the old path live until the new one holds.",
      },
      {
        lead: "Handover & support –",
        rest: " Tracing, runbooks and alerting you own, plus 6–12 months of post-launch support.",
      },
    ],
  },

  {
    slug: "business-process-automation",
    title: "Business Process Automation",
    shortTitle: "Business Automation",
    heroLines: ["Business", "Automation"],
    metaDescription:
      "The manual steps between your systems removed — reconciliations, exports, approvals and chasing. Long-running processes with states, handoffs and an audit trail.",
    keywords: [
      "business process automation",
      "workflow automation development",
      "system integration services",
      "process automation company",
    ],
    included: [
      "Process mapping",
      "System integrations",
      "Approval workflows",
      "An audit trail",
    ],
    statement:
      "We remove the manual steps between systems — the reconciliations, the exports, the approvals and the chasing that fill a week without appearing in anyone's job description.",
    process: [
      {
        lead: "Count The Hours",
        rest: " – We measure the steps before we automate them. A process that costs four hours a month is not worth a project, and we would rather say so in week one.",
      },
      {
        lead: "Automate The Biggest First",
        rest: " – Delivered in two-week cycles, most expensive step first, so the engagement pays for itself before it finishes.",
      },
      {
        lead: "Launch & Support",
        rest: " – Run in parallel with the manual process until the numbers agree, then 6–12 months of monitoring, patches and bug fixes included.",
      },
    ],
    architectureHeading: "Automation That Fails Loudly",
    architectureLead:
      "The danger in automating a process is not that it breaks. It is that it breaks quietly and nobody notices for a month. Every workflow we build knows what state it is in and says something when it gets stuck.",
    architecturePoints: [
      "Long-running processes modelled with explicit states and handoffs, so a stalled approval is visible rather than sitting in somebody's inbox.",
      "Every run leaves an audit trail — what ran, what it touched, what it decided — which is what turns an automation into something finance will sign off.",
    ],
    deliver: [
      "Integrations between the systems you already run",
      "Approval and exception workflows with owners",
      "Scheduled reconciliations and reporting",
      "An audit trail for every automated run",
    ],
    handoverHeading: "Built To Be Handed Over",
    handoverCopy:
      "Documentation, tests and runbooks are part of the deliverable, not an afterthought you have to chase us for. Source, infrastructure definitions and design files live in accounts you control from the first commit.",
    tools: ["Node.js", "PostgreSQL", "Temporal", "AWS"],
    images: {
      hero: "/images/services/business-automation.webp",
      process: "/images/work-card-leafy-plant.webp",
      story: ["/images/about-gallery-1.jpg", "/images/case-study-card-4.jpg"],
      tools: "/images/case-detail-banner.jpg",
    },
    stats: SHARED_STATS,
    whatYouGetCopy: SHARED_WHAT_YOU_GET_COPY,
    whatYouGet: [
      {
        lead: "A measured case –",
        rest: " The hours each step costs today, counted before anything is automated.",
      },
      {
        lead: "Workflows with state –",
        rest: " Explicit states, owners and alerts, so a stalled process is visible rather than silent.",
      },
      {
        lead: "Handover & support –",
        rest: " Audit trails, runbooks and monitoring you own, plus 6–12 months of post-launch support.",
      },
    ],
  },
];

export const SERVICE_SLUGS = SERVICES.map((service) => service.slug);

/**
 * The seven the company leads with — the first seven above, in order.
 *
 * SERVICES went from seven to fifteen when the capability cards were given
 * pages of their own, and most places that read it are happy with however many
 * there are: the sitemap, the 404 page's pill list, the enquiry form's dropdown
 * and the structured data all got better for it. Two are not. The company
 * profile's "what we build" slide is a fixed 16:9 page box laid out for seven,
 * and a footer column with fifteen links in it is a wall rather than a list.
 * Both read this instead.
 */
export const HEADLINE_SERVICES = SERVICES.slice(0, 7);

export function getService(slug: string) {
  return SERVICES.find((service) => service.slug === slug);
}

/**
 * The kinds of work we take on.
 *
 * The seven SERVICES above are what the company *sells* — each has a page, a
 * price conversation and a process. This is the longer answer to "do you do X?",
 * which is the question the about page was failing to answer: it listed four
 * technologies and left a reader to guess whether an ERP rebuild or an AI agent
 * was in scope.
 *
 * `service` points at the page that covers a domain. Every one of them now has
 * one: the eight that used to sit here with nothing behind them are services in
 * their own right, and were only unlinked because nobody had written the pages.
 */
export type WorkDomain = {
  name: string;
  copy: string;
  service: string | null;
};

export const WORK_DOMAINS: WorkDomain[] = [
  {
    name: "SaaS Platforms",
    copy: "Multi-tenant products with billing, roles, and an admin surface your own team can operate.",
    service: "saas-platform-development",
  },
  {
    name: "MVP Development",
    copy: "The smallest version that proves the idea — built to be extended afterwards, not thrown away.",
    service: "saas-platform-development",
  },
  {
    name: "Custom Software",
    copy: "Systems written around how a business actually works, for when nothing off the shelf fits it.",
    service: "custom-software-development",
  },
  {
    name: "Web Applications",
    copy: "Dashboards, portals and internal tools that stay quick once there is real data behind them.",
    service: "web-application-development",
  },
  {
    name: "Mobile Applications",
    copy: "iOS and Android from one codebase, or native where the hardware or the store demands it.",
    service: "mobile-app-development",
  },
  {
    name: "eCommerce",
    copy: "Storefronts, catalogues and checkout, plus the operations that run behind the order.",
    service: "ecommerce-digital-commerce",
  },
  {
    name: "AI & Machine Learning",
    copy: "Models trained on your data, measured against a set you keep, and shipped inside the product.",
    service: "ai-ml-data-analytics",
  },
  {
    name: "AI Agents",
    copy: "Assistants wired into real systems, with the tools, limits and logs to audit what they did.",
    service: "ai-ml-data-analytics",
  },
  {
    name: "ERP Systems",
    copy: "Inventory, production, purchasing and accounts in one place, finally agreeing with each other.",
    service: "erp-software-development",
  },
  {
    name: "CRM Systems",
    copy: "Pipelines, quotes and forecasts shaped around your sales motion rather than a template's stages.",
    service: "crm-software-development",
  },
  {
    name: "Enterprise Software",
    copy: "Platforms for the people who run the business — HR, payroll, operations, reporting.",
    service: "enterprise-software-development",
  },
  {
    name: "API Development",
    copy: "Documented, versioned APIs another team can build against without reading your controllers.",
    service: "api-development",
  },
  {
    name: "Microservices",
    copy: "Services split along boundaries that exist in the business, when a monolith has stopped fitting.",
    service: "microservices-architecture",
  },
  {
    name: "Cloud Solutions",
    copy: "Migration, provisioning and cost control across AWS, Azure and Google Cloud.",
    service: "devops-cloud-infrastructure",
  },
  {
    name: "Business Automation",
    copy: "The manual steps between systems removed — reconciliations, exports, approvals, chasing.",
    service: "business-process-automation",
  },
  {
    name: "Workflow Automation",
    copy: "Long-running processes with states, handoffs and an audit trail instead of a chain of emails.",
    service: "business-process-automation",
  },
];
