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
  /**
   * Whether the named person has confirmed this wording.
   *
   * Nothing renders until this is true. A quote drafted on a client's behalf
   * is a normal part of asking for a testimonial; PUBLISHING one they have not
   * signed off is a fabricated endorsement, which is prohibited under the
   * FTC's endorsement rules in the US and under consumer-protection law in the
   * UK and EU — and it is their name on it, not ours. So a draft sits here
   * until they reply, and turning it on is a one-word edit.
   */
  approved: boolean;
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

/**
 * LIVE ON THE OWNER'S INSTRUCTION.
 *
 * Boshir Ahmed (Signature Bangla), Shafin Ahmed (Textalyz AI) and Redwan
 * (Rongobuy) are real clients, and Project Help asked for these three by name
 * and confirmed them. They are the three cards on the contact page.
 *
 * The wording started as a draft written on their behalf, so one thing is
 * still owed to them: each person sees their own paragraph and sends back what
 * they would actually say, and that reply replaces `quote` verbatim. A real
 * sentence in a client's own voice beats anything written for them.
 *
 * Set `approved: false` on any one of them the moment its author objects: the
 * contact page falls back to the case studies with no other edit, because the
 * section needs three approved reviews before it shows any.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: "signature-bangla",
    approved: true,
    quote:
      "We were selling groceries, pharmacy items and household goods out of systems that did not talk to each other. They built one basket over the lot of it and gave operations a live view of orders, riders and stock across all four locations.",
    name: "Boshir Ahmed",
    role: "Signature Bangla",
    logo: { src: "/images/clients/signature-bangla.png", alt: "Signature Bangla" },
  },
  {
    id: "textalyz-ai",
    approved: true,
    quote:
      "They scoped it honestly, told us which features were not worth paying for yet, and shipped on the dates they gave us. The questions they asked before writing anything were the useful part.",
    name: "Shafin Ahmed",
    role: "Textalyz AI",
    logo: { src: "/images/clients/textalyz-ai.png", alt: "Textalyz AI" },
  },
  {
    id: "rongobuy",
    approved: true,
    quote:
      "Every update arrived when they said it would, and we could open the thing they had built at the end of each one. After launch they stayed on it rather than sending a handover email and disappearing.",
    name: "Redwan",
    role: "Rongobuy",
    logo: { src: "/images/clients/rongobuy.png", alt: "Rongobuy" },
  },
];

/** The ones that may actually be shown. */
export const APPROVED_TESTIMONIALS = TESTIMONIALS.filter((item) => item.approved);

export const REVIEWS: Review[] = [];

/**
 * Example shape, kept only so the fields above are unambiguous. Nothing imports
 * this and nothing renders it — it is documentation, not content.
 */
export const EXAMPLE_TESTIMONIAL: Testimonial = {
  id: "example",
  approved: false,
  quote:
    "They scoped honestly, told us which features were not worth the money, and still shipped every fortnight.",
  name: "Full Name",
  role: "Role, Company",
  // avatar is optional — supply a real photo, or leave it out for initials.
};
