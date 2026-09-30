/**
 * The people on the About page, and whoever the contact page says a brief goes
 * to — components/sections/ContactDetails.tsx reads the first entry.
 *
 * THIS LIST WAS EMPTY ON PURPOSE, AND THE REASON STILL STANDS.
 *
 * The rebuild shipped six named team members — "Sophia Bennett, Head of
 * Delivery", "Maya Rahman, Product Designer" and so on — illustrated with stock
 * photographs from the design template. Naming people who do not work here, and
 * putting a stranger's face next to each name, is the kind of thing a client's
 * procurement team checks on LinkedIn before they sign.
 *
 * So only real people go below, with their own photograph and their own title.
 * A photo is optional — an entry with no `photo` falls back to the person's
 * initials, which looks deliberate and is far better than a stock portrait.
 * Only add `links` for profiles that exist; anything missing is not rendered.
 *
 * The About grid narrows its columns to however many people are here, so a
 * short list is a short row rather than one card and two holes.
 */

export type TeamMember = {
  name: string;
  role: string;
  /** Path under /public. Omit for an initials monogram. */
  photo?: string;
  links?: { linkedin?: string; github?: string; website?: string };
};

export const TEAM: TeamMember[] = [
  {
    name: "Junaied Hossain",
    role: "CEO & Founder",
    photo: "/images/team/junaied-hossain.webp",
    links: { linkedin: "https://www.linkedin.com/company/projecthelpbd" },
  },
];
