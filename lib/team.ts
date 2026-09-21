/**
 * The people on the About page.
 *
 * THIS LIST IS EMPTY ON PURPOSE.
 *
 * The rebuild shipped six named team members — "Sophia Bennett, Head of
 * Delivery", "Maya Rahman, Product Designer" and so on — illustrated with stock
 * photographs from the design template. Naming people who do not work here, and
 * putting a stranger's face next to each name, is the kind of thing a client's
 * procurement team checks on LinkedIn before they sign.
 *
 * The section renders nothing while this is empty, and /about still flows.
 *
 * To turn it back on: add the real team below. A photo is optional — an entry
 * with no `photo` falls back to the person's initials, which looks deliberate
 * and is far better than a stock portrait. Only add `links` for profiles that
 * exist; anything missing is simply not rendered.
 */

export type TeamMember = {
  name: string;
  role: string;
  /** Path under /public. Omit for an initials monogram. */
  photo?: string;
  links?: { linkedin?: string; github?: string; website?: string };
};

export const TEAM: TeamMember[] = [];

/** Shape reference only — nothing imports this. */
export const EXAMPLE_MEMBER: TeamMember = {
  name: "Junaied Hossain",
  role: "Founder & CEO",
  links: { linkedin: "https://www.linkedin.com/company/projecthelpbd" },
};
