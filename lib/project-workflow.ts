/**
 * The five stages every engagement runs through, and three worked examples of
 * them.
 *
 * The stage names are the company's own — they are the same five described on
 * every service page, which is the point: a visitor reading about ERP work and
 * a visitor reading about APIs are being quoted the same process.
 *
 * THE PROJECTS ARE ILLUSTRATIVE. They are composites written to show what each
 * stage actually produces, not records of named client work, and the section
 * says so on the page. Replacing them with real engagements is an edit to this
 * file and nothing else — the component reads whatever is here.
 */

export type WorkflowStage = {
  /** Shared across every project, so the five columns line up. */
  name: string;
  /** What the stage exists to produce. Also shared. */
  purpose: string;
};

export const WORKFLOW_STAGES: WorkflowStage[] = [
  { name: "Discovery", purpose: "Understand the work before designing for it" },
  { name: "Architecture", purpose: "Make the expensive decisions deliberately" },
  { name: "Build", purpose: "Two-week cycles against a signed scope" },
  { name: "Launch", purpose: "A rehearsed go-live with a way back" },
  { name: "Support", purpose: "Months, not a handover email" },
];

export type StageRun = {
  /** How long this stage took on this project. */
  span: string;
  /** What happened, in one sentence a non-engineer can read. */
  detail: string;
  /** What the client had at the end of it. */
  output: string;
};

export type ExampleProject = {
  /** Internal codename — these are composites, not client names. */
  name: string;
  sector: string;
  /** One line under the name, in the tab. */
  summary: string;
  span: string;
  team: string;
  stack: string[];
  /** One run per stage, in the same order as WORKFLOW_STAGES. */
  runs: StageRun[];
};

export const EXAMPLE_PROJECTS: ExampleProject[] = [
  {
    name: "Project Harbour",
    sector: "Freight & logistics",
    summary: "An ERP replacing eleven spreadsheets",
    span: "18 weeks",
    team: "4 engineers",
    stack: ["Next.js", "Node.js", "PostgreSQL", "Docker"],
    runs: [
      {
        span: "2 weeks",
        detail:
          "Two weeks in the depot and the finance office. Eleven spreadsheets found, four of which disagreed about the same stock.",
        output: "Signed scope",
      },
      {
        span: "2 weeks",
        detail:
          "Stock, jobs and invoices modelled as one ledger, so a movement is recorded once and read everywhere rather than re-keyed three times.",
        output: "Data model",
      },
      {
        span: "11 weeks",
        detail:
          "Five cycles. The depot module shipped first because that was the one costing a day a week.",
        output: "Staging every fortnight",
      },
      {
        span: "1 week",
        detail:
          "Run in parallel with the spreadsheets for nine days, until both sets of numbers agreed on a Friday close.",
        output: "Cutover",
      },
      {
        span: "6 months",
        detail:
          "Monitoring, month-end patches, and two rounds of changes the depot asked for once they had actually used it.",
        output: "Handover",
      },
    ],
  },
  {
    name: "Project Kettle",
    sector: "Retail & commerce",
    summary: "A storefront rebuilt for campaign days",
    span: "12 weeks",
    team: "3 engineers",
    stack: ["Next.js", "Stripe", "PostgreSQL", "Vercel"],
    runs: [
      {
        span: "1 week",
        detail:
          "One week tracing a single order end to end, from the ad click to the courier's scan, to find where it was being handled twice.",
        output: "Signed scope",
      },
      {
        span: "1 week",
        detail:
          "Catalogue separated from checkout, so a campaign spike on the browse pages cannot take payments down with it.",
        output: "Architecture note",
      },
      {
        span: "8 weeks",
        detail:
          "Four cycles. Checkout shipped first and ran against real traffic while the catalogue was still being built.",
        output: "Staging every fortnight",
      },
      {
        span: "1 week",
        detail:
          "Moved over on a Tuesday morning, with the old storefront kept warm behind a flag for a week afterwards.",
        output: "Cutover",
      },
      {
        span: "12 months",
        detail:
          "Two campaign days watched live from our side, then quarterly dependency and payment-provider updates.",
        output: "Handover",
      },
    ],
  },
  {
    name: "Project Atlas",
    sector: "Healthcare",
    summary: "Patient records and scheduling in one place",
    span: "20 weeks",
    team: "5 engineers",
    stack: ["Next.js", "Node.js", "PostgreSQL", "Azure"],
    runs: [
      {
        span: "3 weeks",
        detail:
          "Three weeks with clinicians and the records team. The retention policy was written down before a single screen was drawn.",
        output: "Scope & policy",
      },
      {
        span: "2 weeks",
        detail:
          "Single sign-on against the directory already in place, and an audit trail on every record that is read, not only on the ones changed.",
        output: "Data model",
      },
      {
        span: "12 weeks",
        detail:
          "Six cycles. Scheduling went first so the front desk had something real to use months before go-live.",
        output: "Staging every fortnight",
      },
      {
        span: "1 week",
        detail:
          "Department by department across five days, with the paper process deliberately kept alive behind it.",
        output: "Phased rollout",
      },
      {
        span: "12 months",
        detail:
          "On call for the first month, then monitoring, patches and the quarterly access review.",
        output: "Handover",
      },
    ],
  },
];
