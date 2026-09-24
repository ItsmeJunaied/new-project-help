/**
 * Brand colours for the places that cannot read CSS.
 *
 * Everything rendered in the browser should use the Tailwind token instead —
 * `bg-primary-green`, `text-primary-green`, or `var(--color-primary-green)` —
 * which is defined once in app/globals.css. Reach for these constants only
 * where there is no stylesheet to read from: the OG image is rendered at build
 * time by Satori, and the Calendly URL needs the hex as a query parameter.
 *
 * globals.css carries the same value and a comment pointing back here. If you
 * change one, change the other; `npm run check:brand` fails the build if they
 * drift apart.
 */
export const BRAND_GREEN = "#86D52A";
