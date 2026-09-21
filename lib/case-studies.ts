/**
 * Every case study on the site, in the order they appear on /case-study.
 *
 * The detail route, the listing grid, the home page's Featured Work strip, the
 * sitemap and the JSON-LD all read from here, so a new project is one entry and
 * nothing else. Image paths are final: each slot has its own file under
 * /public/images/case/, currently filled with a placeholder. Dropping a real
 * render in at the same path is the whole swap — see the image brief sheet for
 * what belongs in each one.
 */

export type CaseImage = { src: string; alt: string };

export type CaseOutcome = {
  /** Short noun label above the figure. */
  label: string;
  /** The figure itself — kept to four characters or so; it sets at 64px. */
  value: string;
  copy: string;
};

export type CaseStudy = {
  slug: string;
  /**
   * Written as a design placeholder — the outcome figures are invented. A draft
   * is excluded from the listing, the sitemap, the structured data and the
   * routes themselves, so nothing fabricated is ever served or indexed. Delete
   * this flag once the entry carries real numbers from a delivered project.
   */
  draft?: true;
  /** Page H1 and <title>. Written long, for search. */
  title: string;
  /** Listing card heading. Shorter than the H1. */
  cardTitle: string;
  /** Listing card paragraph and OG description source. */
  summary: string;
  metaDescription: string;
  /** Opening statement on the detail hero, above the facts rail. */
  intro: { heading: string; body: string };
  /** Two tags under the card. */
  categories: [string, string];
  keywords: string[];
  /** Facts rail on the detail hero. */
  facts: { label: string; value: string }[];
  stack: string[];
  card: CaseImage;
  /** The listing runs every third card full-bleed. */
  hero: CaseImage;
  banner: CaseImage;
  problem: { lead: string; paragraphs: string[]; issues: string[] };
  problemImages: [CaseImage, CaseImage, CaseImage];
  solution: { lead: string; paragraphs: string[] };
  solutionImages: [CaseImage, CaseImage];
  takeaway: { lead: string; paragraphs: string[]; lessons: string[] };
  outcomes: [CaseOutcome, CaseOutcome, CaseOutcome, CaseOutcome];
};

function images(slug: string) {
  const base = `/images/case/${slug}`;
  return {
    card: `${base}-card.jpg`,
    hero: `${base}-hero.jpg`,
    banner: `${base}-banner.jpg`,
    problem: [`${base}-problem-1.jpg`, `${base}-problem-2.jpg`, `${base}-problem-3.jpg`],
    solution: [`${base}-solution-1.jpg`, `${base}-solution-2.jpg`],
  };
}

const signatureBangla = images("signature-bangla");
const clothing = images("clothing-ecommerce");
const clinic = images("clinic-management-system");
const pos = images("restaurant-pos");
const expense = images("expense-tracker-app");
const erp = images("garment-manufacturing-erp");
const crm = images("b2b-sales-crm");
const hrm = images("hrm-payroll-platform");
const school = images("school-management-system");
const fleet = images("fleet-logistics-tms");
const wms = images("warehouse-inventory-wms");
const lms = images("lms-training-platform");
const realEstate = images("real-estate-portal");

export const CASE_STUDIES: CaseStudy[] = [
  {
    slug: "signature-bangla",
    title: "Signature Bangla — Grocery & Pharmacy Delivery Platform",
    cardTitle: "Signature Bangla — Grocery & Pharmacy Delivery",
    summary:
      "One storefront selling groceries, pharmacy items and household essentials, with location-aware catalogs and an operations dashboard carrying live rider tracking and bulk CSV catalog uploads.",
    metaDescription:
      "How we built a grocery, pharmacy and daily-essentials delivery platform with location-aware catalogs, live rider tracking and an operations dashboard — the problem, the decisions and the outcomes.",
    intro: {
      heading: "One Catalog, Three Very Different Categories",
      body:
        "Signature Bangla needed a single platform that could sell across categories with almost nothing in common — groceries with short shelf lives, pharmacy items with regulatory constraints, and general household goods — while giving operations staff real-time visibility into orders, riders and inventory across multiple locations. A generic storefront could handle any one of those. None of them handled all three at once, and none showed operations what was happening on the ground while it was still happening.",
    },
    categories: ["eCommerce", "Delivery Platform"],
    keywords: [
      "grocery delivery platform development",
      "pharmacy eCommerce development",
      "multi-category marketplace build",
    ],
    facts: [
      { label: "Industry", value: "Retail & Pharmacy" },
      { label: "Engagement", value: "Platform build + support" },
      { label: "Platforms", value: "Web storefront, admin, rider app" },
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL", "Socket.IO", "AWS"],
    card: { src: signatureBangla.card, alt: "Signature Bangla storefront and rider tracking screens" },
    hero: { src: signatureBangla.hero, alt: "Signature Bangla delivery storefront shown on a laptop" },
    banner: { src: signatureBangla.banner, alt: "Signature Bangla operations dashboard across several screens" },
    problem: {
      lead: "One Basket, Three Sets of Rules",
      paragraphs: [
        "Signature Bangla was selling groceries, pharmacy items and household essentials through channels that had no idea the others existed. Stock counts drifted between locations, riders were dispatched from a phone call, and operations only found out an order had stalled when the customer chased it. The storefront and the back office had to be designed as one system, because every problem the client described lived in the gap between them.",
      ],
      issues: [
        "Three Catalogs, One Storefront: Groceries, pharmacy items and household goods each needed different stock rules, but customers expected a single basket.",
        "No Live Operations View: Staff could not see where riders were or which orders were stalling until a customer called to complain.",
        "Catalog Management By Hand: Every price and stock change was entered item by item, across multiple locations.",
      ],
    },
    problemImages: [
      { src: signatureBangla.problem[0], alt: "Delivery zones and catalog rules mapped out" },
      { src: signatureBangla.problem[1], alt: "Order and inventory audit spread across a desk" },
      { src: signatureBangla.problem[2], alt: "Early storefront concepts on screen" },
    ],
    solution: {
      lead: "A Location-Aware Storefront and an Operations Product Behind It",
      paragraphs: [
        "We built a customer-facing storefront with location-aware catalogs, coupons and order tracking: the basket is shared, but each category carries its own stock, availability and compliance rules underneath, so a pharmacy item never behaves like a bag of rice. Customers see one shop; the system knows it is running three.",
        "Behind it sits a dedicated operations dashboard — product and catalog management with bulk CSV upload, role-based staff access, and live rider tracking on an operations map over Socket.IO. Staff stopped finding out about stalled orders from the customer, and a full catalog refresh went from a day of manual entry to a single upload.",
      ],
    },
    solutionImages: [
      { src: signatureBangla.solution[0], alt: "Location-aware catalog and basket layout" },
      { src: signatureBangla.solution[1], alt: "Live rider tracking on the operations map" },
    ],
    takeaway: {
      lead: "What Multi-Category Commerce Actually Costs",
      paragraphs: [
        "The storefront was never the hard part. What decided this build was the data model underneath it — stock rules that differ per category, availability that differs per location, and an operations view that has to be accurate while an order is still moving rather than after it has failed. Getting that wrong is not a bug you patch later; it is a rebuild.",
      ],
      lessons: [
        "Model The Categories Separately: Shared checkout, separate stock rules — trying to force one product model onto all three is where these builds break.",
        "Operations Need Their Own Product: The admin dashboard is not an afterthought to the storefront; it is the tool the business actually runs on.",
        "Bulk Beats Beautiful: A plain CSV upload path saved more staff hours than any interface polish we could have shipped instead.",
      ],
    },
    outcomes: [
      {
        label: "Catalog Management",
        value: "8x",
        copy: "Bulk CSV upload replaced item-by-item entry, cutting the time to publish a full catalog update from a working day to under an hour.",
      },
      {
        label: "Order Visibility",
        value: "Live",
        copy: "Operations staff track orders and riders on a real-time map over websockets, instead of learning about a stalled delivery from the customer.",
      },
      {
        label: "Categories Unified",
        value: "3",
        copy: "Groceries, pharmacy and general goods sell through one storefront and one basket, each with its own stock and compliance rules underneath.",
      },
      {
        label: "Uptime Since Launch",
        value: "99.9%",
        copy: "Monitoring, alerting and zero-downtime deploys were part of the build, so campaign-day traffic has not taken the platform offline.",
      },
    ],
  },

  {
    slug: "clothing-ecommerce",
    title: "Fashion eCommerce Storefront — Variants, Checkout & Merchandising",
    cardTitle: "Fashion eCommerce Storefront",
    summary:
      "A direct-to-customer storefront replacing a marketplace listing: size and colour variants, a three-step checkout, and an admin panel for products, orders and promotions the client runs without us.",
    metaDescription:
      "Custom fashion eCommerce development: size and colour variants, a three-step checkout, and a merchandising admin the client runs alone. The brief, the build and the results.",
    intro: {
      heading: "Moving A Catalog Off Someone Else's Platform",
      body:
        "The brief was to take a catalog that sold well on a marketplace and stand it up on the client's own domain without losing the operational simplicity they were used to. That meant modelling size and colour variants properly, building a checkout short enough to survive mobile, and handing merchandising controls to the people who run campaigns — so promotions stop depending on an engineer's availability.",
    },
    categories: ["eCommerce", "Web App"],
    keywords: [
      "custom eCommerce development company",
      "fashion online store development",
      "product variant checkout build",
    ],
    facts: [
      { label: "Industry", value: "Apparel & Retail" },
      { label: "Engagement", value: "Storefront + admin build" },
      { label: "Platforms", value: "Responsive web, admin panel" },
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL", "Stripe", "Cloudflare"],
    card: { src: clothing.card, alt: "Fashion storefront product page on desktop and mobile" },
    hero: { src: clothing.hero, alt: "Fashion eCommerce storefront shown on a laptop" },
    banner: { src: clothing.banner, alt: "Product, variant and order screens from the storefront admin" },
    problem: {
      lead: "Renting An Audience Instead Of Owning One",
      paragraphs: [
        "The client sold well on a marketplace and owned nothing for it — not the customer list, not the merchandising, not the margin. Every sale paid a commission, every product photo lived behind someone else's brand, and there was no way to run a campaign, bundle two items, or email a past buyer. They wanted the same catalog on their own domain without giving up the operational simplicity the marketplace gave them.",
      ],
      issues: [
        "No Customer Relationship: Orders arrived without a customer record, so repeat buying could not be encouraged or even measured.",
        "Variants Modelled As Separate Products: Every size and colour was its own listing, which made stock counts and merchandising unmanageable.",
        "Nothing Could Be Changed Without Help: Prices, banners and promotions all needed someone technical, so campaigns moved at the speed of a support ticket.",
      ],
    },
    problemImages: [
      { src: clothing.problem[0], alt: "Marketplace listings audited before the rebuild" },
      { src: clothing.problem[1], alt: "Catalog and variant structure mapped out" },
      { src: clothing.problem[2], alt: "Early storefront wireframes" },
    ],
    solution: {
      lead: "A Real Product Model, Then A Storefront On Top Of It",
      paragraphs: [
        "We modelled products and variants properly first: one product, many size and colour combinations, each with its own stock, price override and image set. That single decision is what made merchandising possible — a collection page, a bundle, a size-specific promotion and an accurate stock count all fall out of the same structure.",
        "On top of it sits a storefront with filtered category browsing, a variant picker that disables combinations already sold out, and a three-step checkout with saved addresses. The admin panel covers products, stock, orders, discount codes and homepage banners, with role-based access so a merchandiser can run a campaign without touching order data.",
      ],
    },
    solutionImages: [
      { src: clothing.solution[0], alt: "Product page with the variant picker" },
      { src: clothing.solution[1], alt: "Order and promotions management in the admin" },
    ],
    takeaway: {
      lead: "Merchandising Is A Data Model Problem",
      paragraphs: [
        "Every request the client made after launch — bundles, a sale collection, a size-specific discount, a low-stock alert — was cheap because variants were modelled as variants from day one. Teams that flatten variants into separate products save a week at the start and pay for it on every campaign afterwards.",
      ],
      lessons: [
        "Own The Customer Record: A storefront that does not capture a customer is a marketplace with extra steps.",
        "Disable, Do Not Hide: Showing a sold-out size as unavailable converts better than removing it, because it tells the shopper the size exists at all.",
        "Give Merchandisers The Controls: If a promotion needs an engineer, it will not run often enough to matter.",
      ],
    },
    outcomes: [
      {
        label: "Commission Per Sale",
        value: "0%",
        copy: "Sales moved onto the client's own domain and payment account, so marketplace commission stopped applying to every order.",
      },
      {
        label: "Campaign Turnaround",
        value: "Same day",
        copy: "Banners, discount codes and collections are configured in the admin, so a promotion goes live without a deployment.",
      },
      {
        label: "Checkout Steps",
        value: "3",
        copy: "Cart, address and payment — with saved addresses for returning buyers and no forced account creation before the first purchase.",
      },
      {
        label: "Catalog Accuracy",
        value: "1 source",
        copy: "Stock lives against the variant rather than the listing, so what the storefront shows and what the warehouse holds stopped drifting apart.",
      },
    ],
  },

  {
    slug: "clinic-management-system",
    title: "Clinic Management System — Scheduling, Records & Prescriptions",
    cardTitle: "Clinic Management System",
    summary:
      "A digital front desk for a multi-doctor clinic: appointments booked against real availability, digital patient records, and a shared prescription history that replaced paper books and double-booked slots.",
    metaDescription:
      "Custom clinic management software development: appointment scheduling against live doctor availability, digital patient records and shared prescription history. The full case study.",
    intro: {
      heading: "A Front Desk That Could Not Answer Basic Questions",
      body:
        "Six doctors, a paper appointment book and patient histories in folders meant the clinic could not reliably answer who was booked when, what a returning patient had been prescribed last time, or how busy any doctor had actually been. The brief was to make availability, history and reporting into data — without asking a busy front desk to work harder than they already were.",
    },
    categories: ["Health Tech", "SaaS"],
    keywords: [
      "clinic management software development",
      "appointment scheduling system build",
      "electronic patient records development",
    ],
    facts: [
      { label: "Industry", value: "Healthcare" },
      { label: "Engagement", value: "Full system build" },
      { label: "Platforms", value: "Web app, front-desk terminal" },
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL", "Redis", "AWS"],
    card: { src: clinic.card, alt: "Clinic scheduling and patient record screens" },
    hero: { src: clinic.hero, alt: "Clinic management dashboard on a desktop screen" },
    banner: { src: clinic.banner, alt: "Appointment calendar, patient record and prescription screens" },
    problem: {
      lead: "A Paper Book Running A Six-Doctor Clinic",
      paragraphs: [
        "Appointments lived in a ledger at the front desk, patient history lived in a folder, and doctor availability lived in whoever happened to be on shift. Double bookings were routine, a returning patient's history often could not be found in the time available, and nobody could answer how many patients a given doctor had seen that month without counting by hand.",
      ],
      issues: [
        "Double-Booked Slots: Availability was remembered rather than recorded, so two patients regularly arrived for the same time with the same doctor.",
        "History Not At Hand: A returning patient's previous prescriptions were in a folder somewhere, so doctors re-prescribed blind more often than anyone wanted.",
        "No Numbers To Manage With: Patient volume, no-show rates and doctor utilisation were invisible, so staffing was guesswork.",
      ],
    },
    problemImages: [
      { src: clinic.problem[0], alt: "Paper appointment ledger being audited" },
      { src: clinic.problem[1], alt: "Doctor availability rules mapped out" },
      { src: clinic.problem[2], alt: "Early scheduling interface concepts" },
    ],
    solution: {
      lead: "Availability As Data, Records As A Timeline",
      paragraphs: [
        "Each doctor's working pattern — days, hours, slot length, leave and breaks — is configured once and generates bookable slots automatically. The front desk can only book a slot that exists and is free, which removed double bookings by construction rather than by care. Patients get SMS reminders, and a cancellation releases the slot back immediately.",
        "The patient record is a single timeline: visits, diagnoses, prescriptions and uploaded reports in date order, searchable by phone number or name. Prescriptions are written from a structured drug list with dosage templates, so they print cleanly and stay legible in the history. Role-based access separates front desk, doctor and administrator, and every record change is audited.",
      ],
    },
    solutionImages: [
      { src: clinic.solution[0], alt: "Appointment calendar with live doctor availability" },
      { src: clinic.solution[1], alt: "Patient timeline with prescription history" },
    ],
    takeaway: {
      lead: "Remove The Chance To Make The Mistake",
      paragraphs: [
        "The double-booking problem was not solved by a warning dialog; it was solved by making an unavailable slot impossible to select. Most clinic software problems are the same shape — a process that depends on someone remembering something, replaced by a system where the wrong action cannot be taken at all.",
      ],
      lessons: [
        "Generate Slots, Do Not Validate Them: Deriving bookable times from a working pattern beats checking a free-text time against a rule after the fact.",
        "One Timeline Beats Many Tabs: Doctors have minutes, not screens — history has to read top to bottom in one place.",
        "Audit From Day One: In clinical records, who changed what and when is not a feature request you can add later.",
      ],
    },
    outcomes: [
      {
        label: "Double Bookings",
        value: "0",
        copy: "Slots are generated from each doctor's working pattern, so an unavailable time cannot be selected at the front desk at all.",
      },
      {
        label: "Record Retrieval",
        value: "Seconds",
        copy: "A patient's full visit and prescription history is searchable by phone number, replacing a folder hunt during the consultation.",
      },
      {
        label: "Doctors Scheduled",
        value: "6",
        copy: "Six concurrent practitioners run on independent availability patterns, including split shifts, leave and variable slot lengths.",
      },
      {
        label: "Reporting",
        value: "Daily",
        copy: "Patient volume, no-shows and per-doctor utilisation are available the same day, so staffing decisions stopped being guesswork.",
      },
    ],
  },

  {
    slug: "garment-manufacturing-erp",
    draft: true,
    title: "Garment Manufacturing ERP — Production, Inventory & Costing In One System",
    cardTitle: "Garment Manufacturing ERP",
    summary:
      "A custom ERP tying sales orders to bill of materials, floor production, raw-material stock and per-order costing — so a factory can answer what an order really cost while it is still running.",
    metaDescription:
      "Custom ERP software development for manufacturing: order to bill of materials, production tracking, inventory and real per-order costing in one system. Full case study.",
    intro: {
      heading: "Four Departments, Four Versions Of The Same Order",
      body:
        "Sales, the store, the production floor and accounts each tracked the same orders in their own spreadsheets, and reconciling them took until well after shipment. The brief was an ERP that carried one order record from quotation through bill of materials, material reservation and floor production to a real landed cost — with the cost visible while the order is still open, which is the only point at which it can change anything.",
    },
    categories: ["ERP", "Manufacturing"],
    keywords: [
      "custom ERP development company",
      "garment manufacturing ERP software",
      "production and inventory management system",
    ],
    facts: [
      { label: "Industry", value: "Apparel Manufacturing" },
      { label: "Engagement", value: "ERP build, phased rollout" },
      { label: "Modules", value: "Orders, BOM, production, stock, costing" },
    ],
    stack: ["Next.js", "NestJS", "PostgreSQL", "Redis", "Docker"],
    card: { src: erp.card, alt: "Manufacturing ERP production and costing dashboards" },
    hero: { src: erp.hero, alt: "Garment manufacturing ERP dashboard on a desktop screen" },
    banner: { src: erp.banner, alt: "Order, bill of materials and production tracking screens" },
    problem: {
      lead: "Every Department Had Its Own Version Of The Truth",
      paragraphs: [
        "Sales tracked orders in one spreadsheet, the store kept fabric and trim counts in another, the floor recorded output on printed sheets, and accounts reconciled all three weeks after shipment. By the time anyone could say whether an order had made money, the next three were already cut. The factory was not short of data — it was short of one place where the data agreed.",
      ],
      issues: [
        "Costing After The Fact: Real material and labour cost per order surfaced weeks after delivery, far too late to renegotiate or change anything.",
        "Stock Counts Nobody Trusted: Fabric and trim balances came from a spreadsheet updated by hand, so purchasing ordered against numbers that were already wrong.",
        "Production Invisible Between Checkpoints: Once an order went to the floor, progress was a phone call to a supervisor rather than a number on a screen.",
      ],
    },
    problemImages: [
      { src: erp.problem[0], alt: "Spreadsheet-based order and stock tracking being audited" },
      { src: erp.problem[1], alt: "Production flow mapped from cutting to packing" },
      { src: erp.problem[2], alt: "Bill of materials structure on a whiteboard" },
    ],
    solution: {
      lead: "One Order Record, Followed From Quote To Costing",
      paragraphs: [
        "Every order carries its own bill of materials: fabric, trims, consumables and expected wastage, with a costed estimate produced at quotation. Approving an order reserves material against live stock, raises purchase requisitions for the shortfall, and creates the production plan — so the commitment sales makes and the material the store holds are the same record, not two.",
        "On the floor, each stage — cutting, sewing lines, finishing, packing — reports output and rejects against the order. Supervisors post from a tablet, and the order's progress, material consumption and running cost update as they do. Management sees work-in-progress, line efficiency and per-order margin while the order is still open, which is the only point at which any of it is still actionable.",
      ],
    },
    solutionImages: [
      { src: erp.solution[0], alt: "Bill of materials and costing view for an order" },
      { src: erp.solution[1], alt: "Production stage tracking across sewing lines" },
    ],
    takeaway: {
      lead: "An ERP Is A Sequencing Problem, Not A Feature List",
      paragraphs: [
        "Factories asking for an ERP usually describe it as twelve modules. What decides whether the rollout survives is the order you build them in and how honestly you handle the first month of dual running. We shipped orders, bill of materials and stock first, ran them alongside the spreadsheets until the numbers matched, and only then moved production reporting onto the floor.",
      ],
      lessons: [
        "Sequence By Dependency: Costing is meaningless until stock is trustworthy, and stock is meaningless until the bill of materials is real.",
        "Plan For Dual Running: Nobody abandons a working spreadsheet on trust — budget for the weeks where both exist and reconcile.",
        "Design For The Floor, Not The Office: If a supervisor cannot post output in under thirty seconds on a tablet, production data will stay on paper.",
      ],
    },
    outcomes: [
      {
        label: "Costing Visibility",
        value: "Live",
        copy: "Material and labour cost accrue against the order as production reports come in, instead of being reconciled weeks after shipment.",
      },
      {
        label: "Modules Unified",
        value: "5",
        copy: "Orders, bill of materials, production, inventory and costing run on one record, replacing four disconnected spreadsheets.",
      },
      {
        label: "Stock Reconciliation",
        value: "Daily",
        copy: "Material reservations and floor consumption post against live balances, so purchasing works from numbers that match the store.",
      },
      {
        label: "WIP Reporting",
        value: "Per stage",
        copy: "Cutting, sewing, finishing and packing each report output and rejects, making work-in-progress visible without a phone call.",
      },
    ],
  },

  {
    slug: "b2b-sales-crm",
    draft: true,
    title: "B2B Sales CRM — Multi-Pipeline Deals, Quotes & Territory Reporting",
    cardTitle: "B2B Sales CRM",
    summary:
      "A custom CRM for a distributor running three sales motions at once: separate pipelines, quote generation against live price lists, territory-scoped visibility and forecasting management actually trusts.",
    metaDescription:
      "Custom CRM development for B2B sales: multiple pipelines, quote generation from live price lists, territory-based access and forecast reporting. The full case study.",
    intro: {
      heading: "One Pipeline Pretending To Be Three",
      body:
        "The client ran enterprise deals, a dealer channel and a spare parts desk through a single off-the-shelf pipeline whose stages described none of them. Reps kept the real numbers in personal spreadsheets and the official forecast was adjusted by instinct. The brief was a CRM shaped around how the business actually sells, with quoting driven off live price lists rather than retyped by hand.",
    },
    categories: ["CRM", "B2B Platform"],
    keywords: [
      "custom CRM development company",
      "B2B sales pipeline software",
      "quote management system development",
    ],
    facts: [
      { label: "Industry", value: "Industrial Distribution" },
      { label: "Engagement", value: "CRM build + data migration" },
      { label: "Platforms", value: "Web app, mobile web for field reps" },
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL", "Elasticsearch", "AWS"],
    card: { src: crm.card, alt: "Sales CRM pipeline and deal detail screens" },
    hero: { src: crm.hero, alt: "B2B sales CRM pipeline board on a desktop screen" },
    banner: { src: crm.banner, alt: "Pipeline, quote builder and forecast screens" },
    problem: {
      lead: "A Generic CRM Bent Around A Business It Did Not Fit",
      paragraphs: [
        "The client sold three ways — direct enterprise deals, a dealer channel and a fast-moving spare parts desk — and had forced all three into a single off-the-shelf pipeline with stage names that meant something different to each team. Reps kept their real numbers in personal spreadsheets, quotes were built by hand in a word processor against a price list that changed monthly, and the forecast was a number the sales director adjusted by instinct.",
      ],
      issues: [
        "One Pipeline, Three Sales Motions: A ninety-day enterprise deal and a same-week parts order shared stages that described neither honestly.",
        "Quotes Built By Hand: Every quote was retyped against a price list somebody hoped was current, so pricing errors reached customers regularly.",
        "A Forecast Nobody Believed: Because the system did not match how deals actually moved, reps maintained private spreadsheets and the official numbers were fiction.",
      ],
    },
    problemImages: [
      { src: crm.problem[0], alt: "Sales pipeline stages audited across three motions" },
      { src: crm.problem[1], alt: "Manual quote documents and price lists on a desk" },
      { src: crm.problem[2], alt: "Territory and account ownership mapped out" },
    ],
    solution: {
      lead: "Three Pipelines, One Account Record",
      paragraphs: [
        "Each sales motion got its own pipeline with its own stages, required fields and probability weighting, while accounts, contacts and activity history stayed shared. A rep working a parts order sees the enterprise deal history on the same account without having to work in the enterprise pipeline's stages — which is what made adoption stick where the previous system had failed.",
        "Quotes are generated from live price lists with customer-specific discount tiers, approval thresholds for anything below margin floor, and versioning so a renegotiated quote does not overwrite what the customer was originally sent. Territory rules scope what each rep sees, and the forecast is built from weighted pipeline value rather than assembled by hand — with a variance view that shows management where the number is actually coming from.",
      ],
    },
    solutionImages: [
      { src: crm.solution[0], alt: "Deal pipeline board with stage weighting" },
      { src: crm.solution[1], alt: "Quote builder with live price list and discount tiers" },
    ],
    takeaway: {
      lead: "CRM Adoption Is Won Or Lost On Fit",
      paragraphs: [
        "Reps do not abandon a CRM because it is slow; they abandon it because entering a deal honestly makes their pipeline look wrong. Every stage name, required field and probability weighting in this build came from sitting with the three teams separately. The shadow spreadsheets disappeared because the system finally described the work, not because anyone was told to stop keeping them.",
      ],
      lessons: [
        "Separate Pipelines, Shared Accounts: Different sales motions need different stages and the same customer history.",
        "Quote From Live Data: Any quoting process that involves retyping a price will eventually send a customer the wrong one.",
        "Weight The Forecast, Do Not Adjust It: A forecast assembled from stage probabilities can be argued with; one adjusted by instinct can only be believed or ignored.",
      ],
    },
    outcomes: [
      {
        label: "Pipelines",
        value: "3",
        copy: "Enterprise, dealer channel and parts desk each run their own stages and required fields on a shared account record.",
      },
      {
        label: "Quote Errors",
        value: "Live",
        copy: "Quotes generate from current price lists with customer discount tiers, so a stale price cannot reach a customer by retyping.",
      },
      {
        label: "Shadow Spreadsheets",
        value: "Retired",
        copy: "Reps stopped keeping private trackers once the pipeline stages matched how their deals actually move.",
      },
      {
        label: "Forecast Basis",
        value: "Weighted",
        copy: "The number is built from stage probability and deal age, with a variance view showing management exactly where it comes from.",
      },
    ],
  },

  {
    slug: "restaurant-pos",
    title: "Restaurant POS System — Counter Orders, Kitchen Routing & Sales Reporting",
    cardTitle: "Restaurant POS System",
    summary:
      "Fast counter order entry, automatic kitchen ticket routing over websockets, and a reporting dashboard giving same-day visibility into sales, covers and top-performing menu items.",
    metaDescription:
      "Custom restaurant POS development: fast counter order entry, real-time kitchen display routing and same-day sales reporting. The problem, the build and the outcomes.",
    intro: {
      heading: "A Service Window That Failed At Peak",
      body:
        "Counter staff wrote orders on a pad and called them through to the kitchen, which held up until the queue reached four people and then started losing items. The brief was a point-of-sale system built around speed at peak service — order entry measured in taps, tickets routed automatically to the right kitchen station, and sales numbers available before the shift closed rather than days later.",
    },
    categories: ["Point of Sale", "Hospitality"],
    keywords: [
      "restaurant POS software development",
      "kitchen display system build",
      "custom point of sale development",
    ],
    facts: [
      { label: "Industry", value: "Food & Beverage" },
      { label: "Engagement", value: "POS build + rollout" },
      { label: "Platforms", value: "Counter terminal, kitchen display, admin" },
    ],
    stack: ["React", "Node.js", "PostgreSQL", "Socket.IO", "Electron"],
    card: { src: pos.card, alt: "Restaurant POS order screen on a counter terminal" },
    hero: { src: pos.hero, alt: "Restaurant point-of-sale order entry screen" },
    banner: { src: pos.banner, alt: "Counter terminal, kitchen display and reporting screens" },
    problem: {
      lead: "Orders Shouted Across A Service Window",
      paragraphs: [
        "Orders were written on a pad at the counter and called through to the kitchen, which worked until the queue reached four people. Items were missed, modifiers were misheard, and at the end of service nobody could say which dishes had actually sold. Two tills meant two cash drawers reconciled separately against one menu that had drifted out of date in both.",
      ],
      issues: [
        "Orders Lost In Transit: A verbal handoff between counter and kitchen fails exactly when service is busiest and mistakes cost the most.",
        "No Same-Day Numbers: Sales by item, by hour and by staff member were reconstructed from receipts days later, if at all.",
        "Menu Drift Between Tills: Price and availability changes had to be made twice and were regularly made once.",
      ],
    },
    problemImages: [
      { src: pos.problem[0], alt: "Handwritten order pads and receipts audited" },
      { src: pos.problem[1], alt: "Service flow mapped from counter to kitchen" },
      { src: pos.problem[2], alt: "Early counter interface concepts" },
    ],
    solution: {
      lead: "A Counter Built For Speed And A Kitchen That Reads Itself",
      paragraphs: [
        "The counter screen is built around how fast an order can be entered, not how much it can display: category tiles, one-tap modifiers, split and merge on the open ticket, and a keypad that never moves. Staff were productive on it inside a shift because the layout does not change as the menu does.",
        "Confirmed orders route straight to the relevant kitchen display over websockets — grill, fryer and cold station each see only their own items, with elapsed-time colouring so a stalling ticket is visible before a customer notices. The menu, prices and availability live in one admin, so an item marked out of stock disappears from every terminal at once. Sales by item, hour and staff member are on the dashboard before the shift is closed.",
      ],
    },
    solutionImages: [
      { src: pos.solution[0], alt: "Counter order entry with modifiers" },
      { src: pos.solution[1], alt: "Kitchen display with elapsed-time ticket colouring" },
    ],
    takeaway: {
      lead: "In Hospitality, Latency Is The Feature",
      paragraphs: [
        "Everything that mattered in this build came down to how many seconds a task took at peak service. A screen that is one tap slower than a paper pad will be abandoned by Friday night. We optimised the order path first and designed the reporting around what was left, rather than the other way round.",
      ],
      lessons: [
        "Optimise The Peak, Not The Average: Software that is pleasant at eleven in the morning and unusable at eight in the evening has failed.",
        "Route By Station: One kitchen screen showing every item is a list nobody reads; three screens showing their own items get read.",
        "Availability Belongs In One Place: Anything a staff member must remember to change twice will be changed once.",
      ],
    },
    outcomes: [
      {
        label: "Order Routing",
        value: "Instant",
        copy: "Confirmed tickets reach the correct kitchen station over websockets, replacing a verbal handoff across the service window.",
      },
      {
        label: "Sales Reporting",
        value: "Same day",
        copy: "Revenue by item, by hour and by staff member is on the dashboard before the shift closes, not reconstructed from receipts.",
      },
      {
        label: "Kitchen Stations",
        value: "3",
        copy: "Grill, fryer and cold station each run their own display, showing only their items with elapsed-time colouring.",
      },
      {
        label: "Menu Source",
        value: "1",
        copy: "Prices and availability are set once in the admin and apply to every terminal, ending the drift between tills.",
      },
    ],
  },

  {
    slug: "hrm-payroll-platform",
    draft: true,
    title: "HR, Attendance & Payroll Platform — One Record From Hire To Payslip",
    cardTitle: "HR, Attendance & Payroll Platform",
    summary:
      "Employee records, biometric attendance, leave approvals and payroll on a single record — so a month-end run stops being three days of spreadsheet reconciliation.",
    metaDescription:
      "Custom HRM and payroll software development: employee records, biometric attendance, leave workflows and an auditable payroll run. Read the full case study.",
    intro: {
      heading: "Attendance, Leave And Payroll That Never Agreed",
      body:
        "Biometric exports, email approvals and a spreadsheet payroll meant every month-end started with three days of reconciliation and ended with payslip queries nobody could answer confidently. The brief was to put employees, rosters, attendance, leave and salary on one record, and make the payroll run something an administrator could explain line by line.",
    },
    categories: ["HRM", "Enterprise"],
    keywords: [
      "HRM software development company",
      "payroll management system development",
      "attendance and leave management software",
    ],
    facts: [
      { label: "Industry", value: "Multi-site Services" },
      { label: "Engagement", value: "Platform build + payroll migration" },
      { label: "Platforms", value: "Web app, employee self-service, device sync" },
    ],
    stack: ["Next.js", "NestJS", "PostgreSQL", "Redis", "Docker"],
    card: { src: hrm.card, alt: "HR platform attendance and payroll screens" },
    hero: { src: hrm.hero, alt: "HR and payroll dashboard on a desktop screen" },
    banner: { src: hrm.banner, alt: "Employee record, attendance and payslip screens" },
    problem: {
      lead: "Three Days Of Reconciliation Every Month",
      paragraphs: [
        "Attendance came off biometric devices as CSV exports, leave was approved over email, and payroll was calculated in a spreadsheet that one person understood. Every month-end, someone spent three days matching punches to leave records to salary rules, and every month a handful of employees queried their payslip because the three sources disagreed.",
      ],
      issues: [
        "Three Systems, No Shared Record: Attendance, leave and payroll each held their own version of the same employee.",
        "Approvals With No Trail: Leave granted over email could not be reconstructed later, so disputes came down to whose inbox was searched.",
        "Payroll In One Person's Head: The calculation logic lived in spreadsheet formulas nobody else could safely change.",
      ],
    },
    problemImages: [
      { src: hrm.problem[0], alt: "Attendance exports and payroll spreadsheets audited" },
      { src: hrm.problem[1], alt: "Leave approval flow mapped out" },
      { src: hrm.problem[2], alt: "Salary structure and rule breakdown" },
    ],
    solution: {
      lead: "The Employee Record Is The System",
      paragraphs: [
        "Everything hangs off one employee record: contract and salary structure, shift pattern, biometric device ID, leave entitlement and document history. Devices sync punches automatically, and the system resolves them against the employee's roster — late marks, overtime and absences are derived rather than typed, so the attendance sheet stops being an opinion.",
        "Leave runs as a proper workflow with entitlement balances, approval chains and a visible trail. Payroll then reads from that same record: attendance-linked deductions, overtime, allowances, tax and provident fund are applied as configured rules, producing payslips with a component-by-component breakdown an employee can query and an administrator can explain. Every run is locked and auditable once approved.",
      ],
    },
    solutionImages: [
      { src: hrm.solution[0], alt: "Attendance resolved against roster and shift pattern" },
      { src: hrm.solution[1], alt: "Payroll run with component breakdown" },
    ],
    takeaway: {
      lead: "Payroll Is Where Every Other Weakness Surfaces",
      paragraphs: [
        "You cannot build a trustworthy payroll on top of an untrustworthy attendance record, and you cannot build trustworthy attendance without a roster to resolve punches against. The build only worked because those layers went in order — and because the payroll rules were written as configuration that two people could read, rather than formulas one person maintained.",
      ],
      lessons: [
        "Derive, Do Not Type: Late marks, overtime and absences should fall out of roster plus punches, never out of manual entry.",
        "An Approval Without A Trail Is A Rumour: Leave and salary changes need to be reconstructable months later.",
        "Rules Are Configuration, Not Code: Salary components change with regulation — anything requiring a deployment will be worked around in a spreadsheet.",
      ],
    },
    outcomes: [
      {
        label: "Month-End Payroll",
        value: "3d → 1d",
        copy: "Reconciliation across attendance, leave and salary collapsed into a single reviewed run on one shared record.",
      },
      {
        label: "Attendance Source",
        value: "Automatic",
        copy: "Biometric devices sync directly and punches resolve against each employee's roster, so the sheet is derived rather than assembled.",
      },
      {
        label: "Payslip Queries",
        value: "Itemised",
        copy: "Every payslip breaks down component by component, so a query is answered from the record instead of from a spreadsheet formula.",
      },
      {
        label: "Audit Trail",
        value: "Complete",
        copy: "Leave approvals, salary revisions and locked payroll runs are all reconstructable long after the month has closed.",
      },
    ],
  },

  {
    slug: "school-management-system",
    draft: true,
    title: "School Management System — Admissions, Attendance, Exams & Fees",
    cardTitle: "School Management System",
    summary:
      "One system covering admissions, class attendance, exam results, fee collection and a parent portal — replacing five registers and a fee counter queue that formed every month.",
    metaDescription:
      "Custom school management software development: admissions, attendance, exam results, online fee collection and a parent portal. Read the full case study.",
    intro: {
      heading: "The Same Student Recorded Five Separate Times",
      body:
        "Admissions, attendance, marks, fees and transport each had a register, and none of them knew about the others. Report cards were compiled by hand, dues were chased by phone, and parents had to call the office for anything at all. The brief was one student record across the academic session, with the daily tasks — attendance and marks — fast enough that teachers would actually keep them current.",
    },
    categories: ["EdTech", "Web App"],
    keywords: [
      "school management software development",
      "student information system build",
      "online school fee collection system",
    ],
    facts: [
      { label: "Industry", value: "Education" },
      { label: "Engagement", value: "System build + session migration" },
      { label: "Platforms", value: "Web app, parent portal, teacher view" },
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL", "Payment gateway", "AWS"],
    card: { src: school.card, alt: "School management attendance and results screens" },
    hero: { src: school.hero, alt: "School management dashboard on a desktop screen" },
    banner: { src: school.banner, alt: "Attendance, results and fee collection screens" },
    problem: {
      lead: "Five Registers And A Queue At The Fee Counter",
      paragraphs: [
        "Admissions, attendance, marks, fees and transport each had their own register, and a student existed separately in all five. Report cards were compiled by hand at the end of each term, fee dues were chased by phone, and on collection days a queue formed at the counter because every payment was receipted manually. Parents had no way to see anything without calling the office.",
      ],
      issues: [
        "A Student In Five Places: The same child was recorded independently in each register, so nothing could be reported across them.",
        "Results Compiled By Hand: Term marks were transcribed and totalled manually, which was slow and produced exactly the errors you would expect.",
        "Fees Chased By Phone: Dues were tracked on paper and pursued by calling parents, and collection days created a physical queue.",
      ],
    },
    problemImages: [
      { src: school.problem[0], alt: "Paper registers for attendance and fees audited" },
      { src: school.problem[1], alt: "Academic session and class structure mapped out" },
      { src: school.problem[2], alt: "Report card and grading scheme breakdown" },
    ],
    solution: {
      lead: "One Student Record Across The Academic Session",
      paragraphs: [
        "A student is admitted once and carried through the session: class and section assignment, attendance, subject marks, fee schedule and transport all attach to the same record. Teachers mark attendance from a class list on a phone or tablet in under a minute, and subject marks are entered against a configured grading scheme that computes totals, grades and rank automatically — report cards generate rather than get compiled.",
        "Fees are issued as a schedule per class with concessions and instalments, payable online or receipted at the counter into the same ledger. Outstanding dues are a filterable list rather than a phone round, and reminders go out automatically. A parent portal shows attendance, results, fee status and notices, which removed most of the calls the office was fielding.",
      ],
    },
    solutionImages: [
      { src: school.solution[0], alt: "Class attendance marking on a tablet" },
      { src: school.solution[1], alt: "Fee schedule and online collection ledger" },
    ],
    takeaway: {
      lead: "Adoption Runs Through The Teacher",
      paragraphs: [
        "Every part of a school system depends on attendance and marks being entered on time, and both are entered by teachers who did not ask for new software. We spent the design effort on those two screens specifically — a class list that loads instantly and a marks grid that behaves like a spreadsheet — and the rest of the system worked because its inputs actually arrived.",
      ],
      lessons: [
        "Make The Daily Task Fastest: Attendance is touched every day by every teacher; it deserves more design attention than the admin dashboard.",
        "Generate Report Cards, Do Not Compile Them: If grading is configured, results are a computation and not a transcription exercise.",
        "Give Parents A Window: Most office phone calls are requests for information that could simply be visible.",
      ],
    },
    outcomes: [
      {
        label: "Registers Replaced",
        value: "5",
        copy: "Admissions, attendance, marks, fees and transport now hang off one student record for the whole academic session.",
      },
      {
        label: "Report Cards",
        value: "Generated",
        copy: "Grades, totals and rank compute from the configured scheme, so term results stopped being transcribed by hand.",
      },
      {
        label: "Fee Collection",
        value: "Online",
        copy: "Parents pay from the portal into the same ledger as counter receipts, and dues are a filterable list instead of a phone round.",
      },
      {
        label: "Attendance Entry",
        value: "< 1 min",
        copy: "A teacher marks a full class from a phone or tablet in well under a minute, which is why the data actually arrives daily.",
      },
    ],
  },

  {
    slug: "fleet-logistics-tms",
    draft: true,
    title: "Fleet & Dispatch Platform — Trip Planning, Live Tracking & Delivery Proof",
    cardTitle: "Fleet & Dispatch Platform",
    summary:
      "A transport management system covering trip planning, driver dispatch, live vehicle tracking, digital proof of delivery and per-trip cost — replacing a whiteboard and a phone.",
    metaDescription:
      "Custom transport and fleet management software development: trip planning, live GPS tracking, driver app, digital proof of delivery and per-trip costing. Full case study.",
    intro: {
      heading: "Once A Vehicle Left, Nobody Knew Anything",
      body:
        "Trips were planned on a whiteboard and dispatched by phone, vehicle position was whatever the driver reported, and proof of delivery came back on paper days later. The brief was a dispatch platform with live tracking, a driver app that works without signal, and per-trip costing captured as it happens — so a delay reaches the dispatcher before it reaches the customer.",
    },
    categories: ["Logistics", "Platform"],
    keywords: [
      "fleet management software development",
      "transport management system build",
      "delivery tracking platform development",
    ],
    facts: [
      { label: "Industry", value: "Transport & Logistics" },
      { label: "Engagement", value: "Platform build + driver rollout" },
      { label: "Platforms", value: "Dispatch web app, driver mobile app" },
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL", "PostGIS", "React Native"],
    card: { src: fleet.card, alt: "Fleet dispatch map and trip planning screens" },
    hero: { src: fleet.hero, alt: "Fleet dispatch board with live vehicle tracking" },
    banner: { src: fleet.banner, alt: "Dispatch board, driver app and delivery proof screens" },
    problem: {
      lead: "A Whiteboard, A Phone And No Record Afterwards",
      paragraphs: [
        "Trips were planned on a whiteboard each morning and communicated by phone. Once a vehicle left, its position was whatever the driver said it was, delivery confirmation was a signed paper slip that arrived days later, and fuel and toll costs were reconciled monthly from a bundle of receipts. Customers asking where their consignment was triggered a phone call to a driver who was, by definition, driving.",
      ],
      issues: [
        "No Position Between Calls: Vehicle location was known only when someone rang the driver, which is neither accurate nor safe.",
        "Proof Of Delivery On Paper: Signed slips travelled back with the vehicle, so invoicing waited on paperwork and disputes had no timely evidence.",
        "Trip Cost Unknown Until Month End: Fuel, tolls and driver allowance were reconciled from receipts long after the trip had run.",
      ],
    },
    problemImages: [
      { src: fleet.problem[0], alt: "Whiteboard trip planning audited" },
      { src: fleet.problem[1], alt: "Route and delivery zones mapped out" },
      { src: fleet.problem[2], alt: "Paper delivery slips and fuel receipts" },
    ],
    solution: {
      lead: "Dispatch On A Map, Proof In The Driver's Hand",
      paragraphs: [
        "Dispatch plans trips against vehicle availability, driver duty hours and load capacity, then assigns them to the driver app. The board shows every active trip on a map with live GPS position, geofenced arrival and departure events at each stop, and exception flags when a vehicle is stationary too long or drifts off route — so the first person to know about a delay is the dispatcher, not the customer.",
        "Drivers run the trip from a mobile app: stop list, navigation handoff, and digital proof of delivery with signature, photo and timestamp captured at the point of delivery and synced as soon as there is signal. Fuel, tolls and allowances are posted against the trip as they happen, so per-trip cost and vehicle-level running cost are available immediately rather than at month end.",
      ],
    },
    solutionImages: [
      { src: fleet.solution[0], alt: "Dispatch board with live vehicle positions" },
      { src: fleet.solution[1], alt: "Driver app capturing digital proof of delivery" },
    ],
    takeaway: {
      lead: "Build For No Signal, Not For The Demo",
      paragraphs: [
        "The driver app is the part of a transport system that decides whether the rest works, and it runs in exactly the conditions software is usually not tested in — one hand, bright sun, patchy coverage. Making every action queue locally and sync later was not a nice-to-have; it was the difference between digital proof of delivery and a paper slip that comes back three days later anyway.",
      ],
      lessons: [
        "Offline First Or Not At All: A driver app that needs connectivity to record a delivery will be bypassed on the first dead zone.",
        "Geofence The Events: Derived arrival and departure times are more reliable and far less work than asking a driver to tap a button.",
        "Cost The Trip, Not The Month: Per-trip cost captured as it happens is a decision tool; a monthly reconciliation is a history lesson.",
      ],
    },
    outcomes: [
      {
        label: "Vehicle Position",
        value: "Live",
        copy: "Every active trip shows on the dispatch map with GPS position and geofenced stop events, replacing a phone call to the driver.",
      },
      {
        label: "Proof Of Delivery",
        value: "Digital",
        copy: "Signature, photo and timestamp are captured at the stop and sync when signal returns, so invoicing no longer waits on paperwork.",
      },
      {
        label: "Trip Costing",
        value: "Per trip",
        copy: "Fuel, tolls and allowances post against the trip as they occur, making per-vehicle running cost visible without a month-end exercise.",
      },
      {
        label: "Delay Alerts",
        value: "Automatic",
        copy: "Stationary time and route deviation raise flags on the board, so the dispatcher hears about a delay before the customer does.",
      },
    ],
  },

  {
    slug: "warehouse-inventory-wms",
    draft: true,
    title: "Warehouse Management System — Bin Locations, Barcode Picking & Stock Accuracy",
    cardTitle: "Warehouse Management System",
    summary:
      "Bin-level stock locations, barcode-scanned receiving and picking, cycle counting and batch traceability — turning a warehouse that was searched into one that is addressed.",
    metaDescription:
      "Custom warehouse management system development: bin locations, barcode receiving and picking, cycle counts and batch traceability. Read the full case study.",
    intro: {
      heading: "The System Knew How Many, Not Where",
      body:
        "Stock was counted in totals, so picking meant walking and searching, annual stock takes shut the operation for two days, and batch traceability did not exist. The brief was to give every shelf an address and make every movement a scanned transaction, so accuracy comes from the record rather than from counting more often.",
    },
    categories: ["Inventory", "Operations"],
    keywords: [
      "warehouse management system development",
      "barcode inventory software build",
      "stock traceability system development",
    ],
    facts: [
      { label: "Industry", value: "Distribution & Warehousing" },
      { label: "Engagement", value: "WMS build + scanner rollout" },
      { label: "Platforms", value: "Web app, handheld scanner app" },
    ],
    stack: ["Next.js", "NestJS", "PostgreSQL", "Redis", "Android scanners"],
    card: { src: wms.card, alt: "Warehouse management picking and stock screens" },
    hero: { src: wms.hero, alt: "Warehouse management dashboard on a desktop screen" },
    banner: { src: wms.banner, alt: "Receiving, bin location and pick list screens" },
    problem: {
      lead: "Stock That Existed On Paper And Nowhere In Particular",
      paragraphs: [
        "The system knew how many units of an item the warehouse held; it did not know where any of them were. Picking meant walking, finding, and occasionally giving up and re-ordering something already on a shelf. Stock takes shut the operation for two days and still produced numbers that drifted within a fortnight, and a batch recall would have meant opening every carton of that product line.",
      ],
      issues: [
        "Quantity Without Location: Stock was counted in total, so finding an item depended on whoever had put it away remembering where.",
        "Counts That Went Stale Immediately: An annual shutdown count was accurate for about two weeks, then drifted with every unrecorded movement.",
        "No Batch Traceability: Which customer received which batch could not be answered, which made any recall a warehouse-wide exercise.",
      ],
    },
    problemImages: [
      { src: wms.problem[0], alt: "Warehouse aisles before bin addressing" },
      { src: wms.problem[1], alt: "Stock take sheets and discrepancy reports" },
      { src: wms.problem[2], alt: "Putaway and picking routes mapped out" },
    ],
    solution: {
      lead: "Give Every Shelf An Address",
      paragraphs: [
        "Every zone, aisle, rack and bin got a barcoded address, and stock moves as scanned transactions between them: receive against the purchase order, put away to a suggested bin, pick from the bin the system names. Because every movement is a transaction, the stock ledger describes where things are and not merely how many there are — and the walking stopped being a search.",
        "Pick lists are sequenced by route so a picker crosses the floor once, with scan verification at the bin catching the wrong-item error before it reaches packing. Rolling cycle counts replaced the annual shutdown: a slice of bins is counted daily and discrepancies are investigated while the cause is still recent. Batch and expiry are captured at receiving and carried through to the despatch note, so traceability is a query rather than an excavation.",
      ],
    },
    solutionImages: [
      { src: wms.solution[0], alt: "Handheld scanner confirming a bin pick" },
      { src: wms.solution[1], alt: "Cycle count and stock accuracy dashboard" },
    ],
    takeaway: {
      lead: "Accuracy Comes From Transactions, Not From Counting Harder",
      paragraphs: [
        "Warehouses usually respond to bad stock numbers by counting more often. That treats the symptom. Accuracy came from making every movement a scanned transaction with a from-bin and a to-bin, at which point the count stops drifting and cycle counting becomes a verification rather than a reconstruction.",
      ],
      lessons: [
        "Address Before You Automate: Bin locations are the prerequisite for everything else a WMS claims to do.",
        "Scan At The Point Of Action: A confirmation typed later is a guess; a scan at the bin is evidence.",
        "Cycle Count, Do Not Shut Down: Daily slices catch causes while they are still traceable and keep the operation running.",
      ],
    },
    outcomes: [
      {
        label: "Stock Locations",
        value: "Bin-level",
        copy: "Every zone, aisle, rack and bin is barcoded, so the system names the location rather than only the quantity.",
      },
      {
        label: "Pick Verification",
        value: "Scanned",
        copy: "Scan confirmation at the bin catches wrong-item picks before packing rather than after a customer complains.",
      },
      {
        label: "Stock Takes",
        value: "Rolling",
        copy: "Rolling daily cycle counts replaced the annual two-day shutdown, and discrepancies are investigated while still recent.",
      },
      {
        label: "Batch Traceability",
        value: "Full",
        copy: "Batch and expiry are captured at receiving and carried to the despatch note, so a recall is a query rather than an excavation.",
      },
    ],
  },

  {
    slug: "lms-training-platform",
    draft: true,
    title: "Learning Management System — Courses, Cohorts, Assessment & Certification",
    cardTitle: "Learning Management System",
    summary:
      "A training platform with structured course delivery, cohort scheduling, graded assessment, progress tracking and verifiable certificates — built for an institute outgrowing video links and spreadsheets.",
    metaDescription:
      "Custom LMS development: structured courses, cohort scheduling, graded assessments, progress tracking and verifiable certificates. Read the full case study.",
    intro: {
      heading: "A Training Business Outgrowing Video Links",
      body:
        "Courses ran as scheduled video calls with materials shared as cloud links, enrolment tracked in a spreadsheet and certificates produced by hand. It worked at thirty learners and broke at three hundred. The brief was a platform where a course has structure, progress is measured rather than assumed, marking has a queue, and a certificate can be verified by the employer who asks about it.",
    },
    categories: ["EdTech", "SaaS"],
    keywords: [
      "custom LMS development company",
      "learning management system build",
      "online training platform development",
    ],
    facts: [
      { label: "Industry", value: "Professional Training" },
      { label: "Engagement", value: "Platform build + content migration" },
      { label: "Platforms", value: "Web app, learner portal, instructor view" },
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL", "S3 + CloudFront", "Payment gateway"],
    card: { src: lms.card, alt: "Learning platform course and progress screens" },
    hero: { src: lms.hero, alt: "Learning management system course view on a desktop screen" },
    banner: { src: lms.banner, alt: "Course player, assessment and certificate screens" },
    problem: {
      lead: "A Training Business Running On Video Links",
      paragraphs: [
        "Courses were delivered through scheduled video calls, materials were shared as cloud links, enrolment was tracked in a spreadsheet and certificates were produced in a word processor. It worked at thirty learners and broke at three hundred. Nobody could say who had actually completed a module, whether an assessment had been marked, or which certificate had been issued against which cohort.",
      ],
      issues: [
        "Completion Was Unknowable: Watching a shared video left no record, so progress was self-reported or simply assumed.",
        "Assessment By Inbox: Submissions arrived by email and were marked in whatever order they were noticed, with no visible queue.",
        "Certificates Without Provenance: A document produced by hand cannot be verified by an employer, which is most of what a certificate is for.",
      ],
    },
    problemImages: [
      { src: lms.problem[0], alt: "Enrolment spreadsheets and shared video links audited" },
      { src: lms.problem[1], alt: "Course structure and module sequence mapped out" },
      { src: lms.problem[2], alt: "Assessment and grading scheme breakdown" },
    ],
    solution: {
      lead: "Structure The Course, Then Measure It",
      paragraphs: [
        "Courses are modelled as modules and lessons with prerequisites and a release schedule, mixing recorded video, reading material and downloadable resources. Progress is recorded per lesson as it happens, so completion is a fact rather than a claim, and an instructor can see exactly where a cohort has stalled while there is still time to intervene.",
        "Assessments run as quizzes with automatic marking or as submitted assignments with a rubric and a visible marking queue. Cohorts have their own schedule, instructor and discussion thread, and enrolment connects to online payment. Completion issues a certificate carrying a unique verification code and a public check page, so an employer can confirm it without contacting the institute.",
      ],
    },
    solutionImages: [
      { src: lms.solution[0], alt: "Course player with module progress" },
      { src: lms.solution[1], alt: "Instructor marking queue and cohort progress" },
    ],
    takeaway: {
      lead: "A Course Is A Sequence, Not A Folder",
      paragraphs: [
        "The difference between a folder of videos and a learning platform is that the platform knows what order things happen in and what has been completed. Once the course had a structure, everything the institute wanted — progress reporting, stall detection, cohort comparison, verifiable certification — was available from the same data rather than needing separate features.",
      ],
      lessons: [
        "Model Prerequisites Explicitly: Sequence is what makes progress measurable and what makes stalling visible.",
        "Give Marking A Queue: Assessment that lives in an inbox will be late, and learners experience lateness as the product.",
        "Make Certificates Verifiable: An unverifiable certificate is a PDF; a verifiable one is the reason people enrol.",
      ],
    },
    outcomes: [
      {
        label: "Progress Tracking",
        value: "Tracked",
        copy: "Completion is recorded as learners move through modules, so instructors see where a cohort has stalled while it still matters.",
      },
      {
        label: "Assessment",
        value: "Queued",
        copy: "Auto-marked quizzes and rubric-graded assignments run through a visible marking queue rather than an instructor's inbox.",
      },
      {
        label: "Certificates",
        value: "Verified",
        copy: "Each certificate carries a unique code and a public verification page, so employers can confirm it without contacting the institute.",
      },
      {
        label: "Enrolment",
        value: "Online",
        copy: "Learners enrol and pay online into a cohort with its own schedule and instructor, removing the spreadsheet in the middle.",
      },
    ],
  },

  {
    slug: "real-estate-portal",
    draft: true,
    title: "Real Estate Portal — Listings, Map Search & Agent Lead Management",
    cardTitle: "Real Estate Listing Portal",
    summary:
      "A property portal with map-based search, verified listings, saved searches with alerts, and an agent CRM that routes and scores enquiries instead of dropping them into a shared inbox.",
    metaDescription:
      "Custom real estate portal development: map-based property search, verified listings, saved-search alerts and an agent lead management CRM. Full case study.",
    intro: {
      heading: "Thousands Of Listings, Too Many Of Them Wrong",
      body:
        "A meaningful share of the portal's inventory was sold, duplicated or stale, search worked from a dropdown of neighbourhood names, and every enquiry landed in one shared inbox. The brief was to make listings trustworthy, make search work the way buyers actually think — on a map, against a budget — and give every lead a named owner with a response target.",
    },
    categories: ["Real Estate", "Marketplace"],
    keywords: [
      "real estate portal development",
      "property listing website development",
      "real estate CRM software build",
    ],
    facts: [
      { label: "Industry", value: "Property & Real Estate" },
      { label: "Engagement", value: "Portal build + agent onboarding" },
      { label: "Platforms", value: "Web portal, agent dashboard" },
    ],
    stack: ["Next.js", "Node.js", "PostgreSQL", "PostGIS", "Elasticsearch"],
    card: { src: realEstate.card, alt: "Property portal map search and listing screens" },
    hero: { src: realEstate.hero, alt: "Real estate portal map search on a desktop screen" },
    banner: { src: realEstate.banner, alt: "Listing detail, map search and agent dashboard screens" },
    problem: {
      lead: "Listings Nobody Trusted, Leads Nobody Owned",
      paragraphs: [
        "The portal carried thousands of listings, a meaningful share of which were sold, duplicated or priced from last year. Buyers filtered by area using a dropdown of neighbourhood names that did not match how anyone actually searches, and every enquiry landed in one shared inbox where it was answered by whoever saw it first, or by nobody. Agents blamed the portal for poor leads; the portal could not prove otherwise.",
      ],
      issues: [
        "Stale And Duplicate Listings: Nothing expired and nothing was de-duplicated, so search results actively wasted buyers' time.",
        "Search That Did Not Match Intent: Buyers think in map areas, commute and budget; the portal offered a dropdown of names.",
        "Leads Into A Shared Inbox: With no routing or ownership, enquiries went unanswered and response time could not be measured at all.",
      ],
    },
    problemImages: [
      { src: realEstate.problem[0], alt: "Listing data quality audit" },
      { src: realEstate.problem[1], alt: "Search and filter behaviour mapped out" },
      { src: realEstate.problem[2], alt: "Enquiry routing flow on a whiteboard" },
    ],
    solution: {
      lead: "Search On A Map, Route Every Enquiry",
      paragraphs: [
        "Search is map-first: draw an area or pan the map and results update against it, combined with price, size and property-type filters and sorted by relevance rather than recency alone. Listings carry a freshness state — agents confirm availability on a schedule and anything unconfirmed drops out of results, while image and address fingerprinting catches the duplicates before they publish. Buyers save a search and get alerted when something new matches.",
        "Every enquiry becomes a tracked lead assigned to an agent by listing ownership and availability, with response-time targets, reminders on anything ageing, and a full activity history against the property and the buyer. Agents get a dashboard of their listings, leads and performance; the portal gets the numbers it needs to hold the marketplace to a standard.",
      ],
    },
    solutionImages: [
      { src: realEstate.solution[0], alt: "Map-based property search with draw-to-filter" },
      { src: realEstate.solution[1], alt: "Agent lead dashboard with response tracking" },
    ],
    takeaway: {
      lead: "A Marketplace Is Only As Good As Its Worst Listing",
      paragraphs: [
        "Buyers judge a property portal by the first stale listing they call about, not by the ninety good ones around it. Freshness enforcement and de-duplication did more for engagement than any interface work, and lead routing did more for agent satisfaction than any volume increase — because an unanswered lead was never a supply problem.",
      ],
      lessons: [
        "Expire Listings Aggressively: An unconfirmed listing costs more in trust than it earns in inventory.",
        "Search The Way Buyers Think: Map areas, budget and commute — not a dropdown of administrative names.",
        "Own Every Lead: Routing with a response target turns a shared inbox into a measurable marketplace.",
      ],
    },
    outcomes: [
      {
        label: "Listing Freshness",
        value: "Enforced",
        copy: "Agents confirm availability on a schedule, and unconfirmed listings drop out of search rather than wasting buyer enquiries.",
      },
      {
        label: "Search",
        value: "Map-first",
        copy: "Buyers draw or pan an area and filter by price, size and type, instead of picking from a dropdown of neighbourhood names.",
      },
      {
        label: "Lead Ownership",
        value: "100%",
        copy: "Every enquiry is routed to a named agent with a response target, replacing a shared inbox nobody was accountable for.",
      },
      {
        label: "Duplicates",
        value: "Screened",
        copy: "Image and address fingerprinting catches republished listings before they reach search results.",
      },
    ],
  },

  {
    slug: "expense-tracker-app",
    title: "Expense Tracker — Cross-Platform Personal Finance App",
    cardTitle: "Expense Tracker Mobile App",
    summary:
      "Sub-five-second expense entry, category tagging, recurring bills and monthly budget charts, delivered to iOS and Android from a single React Native codebase.",
    metaDescription:
      "Cross-platform personal finance app development: fast expense entry, category tagging, budgets and offline-first sync from one React Native codebase. Full case study.",
    intro: {
      heading: "An App People Would Still Be Using In Week Three",
      body:
        "Personal finance apps do not fail because they lack features; they fail because logging an expense takes long enough that people stop. The brief was to build the fastest entry path we could — one screen, sensible defaults, works with no signal — and let every other decision in the product defer to that number.",
    },
    categories: ["Mobile App", "Fintech"],
    keywords: [
      "React Native app development company",
      "personal finance app development",
      "cross platform mobile app build",
    ],
    facts: [
      { label: "Industry", value: "Consumer Fintech" },
      { label: "Engagement", value: "Mobile app build + release" },
      { label: "Platforms", value: "iOS, Android" },
    ],
    stack: ["React Native", "TypeScript", "Node.js", "PostgreSQL", "SQLite"],
    card: { src: expense.card, alt: "Expense tracker app screens on two phones" },
    hero: { src: expense.hero, alt: "Expense tracker app shown on a phone" },
    banner: { src: expense.banner, alt: "Expense entry, budget and reporting screens" },
    problem: {
      lead: "Every Second Of Friction Is A Missing Entry",
      paragraphs: [
        "The category is full of apps that ask for six fields per expense, and the result is always the same: people log diligently for a fortnight and then stop, because the record of what they spent is only useful if it is complete. The brief was not to build a richer finance app. It was to build one where adding a coffee takes less effort than remembering not to.",
      ],
      issues: [
        "Entry Too Slow To Sustain: Multi-field forms lose users in the second week, and an incomplete ledger is worth almost nothing.",
        "Useless Without Signal: An expense happens at a till, sometimes underground — an app that needs connectivity misses exactly those moments.",
        "Numbers Without Meaning: A list of transactions is not insight; users need to see whether this month is going the way the last one did.",
      ],
    },
    problemImages: [
      { src: expense.problem[0], alt: "Competitor entry flows audited for step count" },
      { src: expense.problem[1], alt: "Category and budget structure mapped out" },
      { src: expense.problem[2], alt: "Early entry screen concepts" },
    ],
    solution: {
      lead: "One Screen, Under Five Seconds",
      paragraphs: [
        "Entry is a single screen: amount on a large keypad, a category from recently-used tiles, and save. Date defaults to now, notes and receipts are optional and out of the way, and recurring bills post themselves. Everything writes to a local database first and syncs when there is signal, so the app is fully usable in a basement queue and never loses an entry to a failed request.",
        "The insight side is deliberately narrow: spend by category this month against last, budget progress with a projection of where the month is heading at the current rate, and a plain list you can search. We shipped fewer charts than the client originally asked for, on the argument that a chart nobody reads is a chart that costs load time — and kept the entry path as the thing everything else defers to.",
      ],
    },
    solutionImages: [
      { src: expense.solution[0], alt: "Single-screen expense entry with keypad" },
      { src: expense.solution[1], alt: "Monthly budget progress and category breakdown" },
    ],
    takeaway: {
      lead: "Retention Was A Design Constraint, Not A Marketing Problem",
      paragraphs: [
        "Everything in this build was measured against one number: seconds from launching the app to a saved expense. That constraint killed features that would have looked good in a store listing and kept the ones people actually use daily. Cross-platform delivery from one codebase mattered too — a two-codebase build would have spent its budget on parity instead of on the entry path.",
      ],
      lessons: [
        "Optimise The Action People Repeat: Everything else in a finance app is secondary to logging a transaction.",
        "Offline-First Is A Product Decision: Where the action happens determines the architecture, not the other way round.",
        "Ship Fewer Charts: Insight the user does not read is weight the user pays for on every launch.",
      ],
    },
    outcomes: [
      {
        label: "Time To Log",
        value: "< 5s",
        copy: "Amount, category, save — on one screen with sensible defaults, which is the number the whole app was designed against.",
      },
      {
        label: "Codebases",
        value: "1",
        copy: "iOS and Android ship from a single React Native codebase, so feature work lands on both platforms in the same sprint.",
      },
      {
        label: "Offline Entry",
        value: "Always",
        copy: "Every expense writes locally first and syncs when signal returns, so an entry is never lost to a failed request.",
      },
      {
        label: "Recurring Bills",
        value: "Automatic",
        copy: "Rent, subscriptions and utilities post themselves on schedule instead of relying on the user to remember them.",
      },
    ],
  },
];

/** The only ones the site renders. Everything else is waiting on real data. */
export const PUBLISHED_CASE_STUDIES = CASE_STUDIES.filter((study) => !study.draft);

export const CASE_STUDY_SLUGS = PUBLISHED_CASE_STUDIES.map((study) => study.slug);

export function getCaseStudy(slug: string) {
  return PUBLISHED_CASE_STUDIES.find((study) => study.slug === slug);
}

/** The listing runs a full-bleed card every third tile: two, one wide, repeat. */
export function caseStudyRows(studies: CaseStudy[]) {
  const rows: { wide: boolean; items: CaseStudy[] }[] = [];

  for (let i = 0; i < studies.length; i += 3) {
    const pair = studies.slice(i, i + 2);
    if (pair.length) rows.push({ wide: false, items: pair });

    const wide = studies[i + 2];
    if (wide) rows.push({ wide: true, items: [wide] });
  }

  return rows;
}
