/**
 * Every URL the current live site has indexed, mapped onto this rebuild.
 *
 * The rebuild renamed three top-level routes (`/about-us` → `/about`,
 * `/contact-us` → `/contact`, `/case-studies` → `/case-study`) and renamed one
 * case study slug. Without these the swap would drop every ranking and inbound
 * link pointing at the old paths, so they are permanent (308) rather than
 * temporary — search engines should transfer the equity, not re-crawl forever.
 */

/** Old case-study slug → new one, where the rebuild renamed the project. */
export const CASE_STUDY_SLUG_CHANGES: Record<string, string> = {
  "expense-tracker": "expense-tracker-app",
};

/** Blog posts that only ever existed on this rebuild, not on the live site. */
export const LOCAL_BLOG_SLUGS = ["saas-mvp-scope"];

type Redirect = {
  source: string;
  destination: string;
  permanent: boolean;
  has?: { type: "host"; value: string }[];
};

export function legacyRedirects(): Redirect[] {
  return [
    // Host canonicalisation first: these match on host regardless of path, so a
    // www request lands on the apex origin before any path rule rewrites it to
    // a relative (host-preserving) destination.
    {
      source: "/:path*",
      has: [{ type: "host", value: "www.projecthelpbd.com" }],
      destination: "https://projecthelpbd.com/:path*",
      permanent: true,
    },
    {
      source: "/:path*",
      has: [{ type: "host", value: "projecthelpsolutions.vercel.app" }],
      destination: "https://projecthelpbd.com/:path*",
      permanent: true,
    },

    // Renamed routes. The rebuild uses the singular, shorter forms.
    { source: "/about-us", destination: "/about", permanent: true },
    { source: "/contact-us", destination: "/contact", permanent: true },
    { source: "/case-studies", destination: "/case-study", permanent: true },

    // One slug changed name; everything else keeps its slug, so the specific
    // rule has to come before the catch-all or the catch-all swallows it.
    ...Object.entries(CASE_STUDY_SLUG_CHANGES).map(([from, to]) => ({
      source: `/case-studies/${from}`,
      destination: `/case-study/${to}`,
      permanent: true,
    })),
    { source: "/case-studies/:slug", destination: "/case-study/:slug", permanent: true },

    // Pre-rebuild URLs the live site already redirected. Carried over so the
    // chain stays one hop long instead of dying at the swap.
    { source: "/home", destination: "/", permanent: true },
    { source: "/products", destination: "/case-study", permanent: true },
    { source: "/products/:slug*", destination: "/case-study/:slug*", permanent: true },
    { source: "/services-details", destination: "/services", permanent: true },

  ];
}
