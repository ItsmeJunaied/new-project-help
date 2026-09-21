/**
 * Client testimonials and platform reviews.
 *
 * BOTH LISTS ARE EMPTY ON PURPOSE.
 *
 * The rebuild shipped with four testimonials and eleven review cards attributed
 * to named people — "Sarah Johnson, CTO, TechFlow Solutions", "Michael Chen,
 * CEO, GlobalTrade Inc." and so on — none of whom exist. The review cards were
 * additionally presented on Clutch and Behance branding, which turns an honesty
 * problem into a legal one: publishing invented endorsements is prohibited
 * under the FTC's endorsement rules in the US and under consumer-protection law
 * in the UK and EU, and using a review platform's mark to carry a review it
 * never hosted is a separate trademark issue.
 *
 * So nothing is published until it is real. The sections that read these lists
 * render nothing while they are empty, and the surrounding pages still flow.
 *
 * To turn them back on: add real entries below. Keep the quote as the client
 * actually wrote it, get written permission to use their name and company, and
 * only use a platform logo where the review genuinely lives on that platform.
 * An anonymised quote ("Operations Director, garment manufacturer, Dhaka") is
 * perfectly respectable and needs no logo at all.
 */

export type Testimonial = {
  id: string;
  /** The client's own words. Do not paraphrase into marketing copy. */
  quote: string;
  name: string;
  /** Role and company, e.g. "Founder, Signature Bangla". */
  role: string;
  /** Path under /public. Use a real photo, or omit for initials. */
  avatar?: string;
  /** Only where you have permission to display the company's mark. */
  logo?: { src: string; alt: string };
};

export type Review = {
  id: string;
  /** The platform the review actually lives on, or null for a direct quote. */
  platform: { src: string; alt: string; width: number; height: number } | null;
  rating?: number;
  title?: string;
  body: string;
  author: { name: string; bio?: string; avatar?: string };
};

export const TESTIMONIALS: Testimonial[] = [];

export const REVIEWS: Review[] = [];

/**
 * Example shape, kept only so the fields above are unambiguous. Nothing imports
 * this and nothing renders it — it is documentation, not content.
 */
export const EXAMPLE_TESTIMONIAL: Testimonial = {
  id: "example",
  quote:
    "They scoped honestly, told us which features were not worth the money, and still shipped every fortnight.",
  name: "Full Name",
  role: "Role, Company",
  // avatar is optional — supply a real photo, or leave it out for initials.
};
