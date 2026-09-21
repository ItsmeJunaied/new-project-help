# Launch checklist — Project Help rebuild

Last updated 21 September 2026, after the second pass. Nothing here has been
deployed; the live site at `projecthelpbd.com` is untouched.

Sections: **1** what the rebuild now does, **2** what changed in the second pass,
**3** what is still open, **4** the order to do it in.

---

## 1. What the rebuild does

### SEO

| Item | Status |
| --- | --- |
| Redirects from every live-site URL | `lib/redirects.ts` — `/about-us`, `/contact-us`, `/case-studies`, `/case-studies/:slug`, `/home`, `/products/*`, `/services-details`, www → apex, old Vercel host. All 308, verified. |
| Renamed case-study slug | `/case-studies/expense-tracker` → `/case-study/expense-tracker-app`. |
| Sitemap | Async and complete — static routes, 7 services, 5 case studies, 2 jobs, every article, and one page per blog topic. Per-post `lastModified`. Hourly revalidate. |
| Per-topic blog pages | `/blog/tag/[tag]` — 12 pages today. The index used to filter in the browser, so there was no URL to rank for "everything on DevOps". |
| RSS feed | `/blog/feed.xml`, advertised from `<head>`. |
| Custom 404 | Routes people to case studies, services, blog, contact and all seven services. `noindex, follow`. |
| Generated OG cards | Site-wide plus one per article carrying the headline. |
| Structured data | `Organization`, `WebSite`, `BreadcrumbList`, `FAQPage`, `Service` ×7, `ItemList` for the blog and each topic, `BlogPosting`, `JobPosting`, `CreativeWork`. |
| Titles / H1s | Every route: 200, exactly one `<h1>`, unique `<title>`. |
| Search Console | Wired to `NEXT_PUBLIC_GSC_VERIFICATION`; omitted when unset so previews never claim the property. |

### Performance

- 21 oversized PNGs re-encoded to WebP: **22.1 MB → 1.7 MB**.
- Unused placeholder assets moved out of `/public` (see §2): another 1.8 MB.
- `/public` overall: **32 MB → 9.2 MB**.
- Hero is the LCP element with `loading="eager"` + `fetchPriority="high"`.
- GA4 and Meta Pixel load `afterInteractive`; nothing renders when unset.
- 60s ISR on the home page, blog, articles and topic pages; 1h on sitemap and feed.
- 60 static pages. Clean TypeScript, clean ESLint.

### Contact, Calendly and forms

Contact (both forms) → `/leads`. Newsletter → `/newsletter`. Careers →
`/applications`. Unsubscribe → `/newsletter/unsubscribe`. All four proxies
verified against the live API.

Attachments (3 files, 4 MB each) restored. Turnstile ported and wired. Calendly
in three places. WhatsApp floating button. Office map and direct channels on
`/contact`. Conversion events fire for leads, newsletter signups, applications
and scheduler clicks.

### Blog

Reads the live API. The designed four-tile grid repeats every four posts.
Related posts by shared tag, working share buttons, copy-link. Rich-text and
legacy paragraph content both render.

### Content brought over from the live site

Six service detail pages that did not exist here; Privacy Policy and Terms word
for word; two real job postings with an apply flow.

### GSAP

Existing section animations untouched. Added: scroll-progress rule, page-to-page
fade, **mobile menu** (the header had no navigation at all below 1024px),
back-to-top, smooth in-page anchors, and reveals on every new section. All
respect `prefers-reduced-motion`.

### 15 scheduled posts

Written and seeded, one per date across October 2026. Scheduled, not published —
the API filters on publish date, so each appears on its day on whichever site is
deployed. Four interlocking clusters around a pillar post that seven others link
to. A validator fails the seed if any post has fewer than three internal links
or no inbound link. Source: `backend/prisma/october-2026/`.

---

## 2. What changed in the second pass

### Fabricated content removed

This was the largest problem on the site and most of it was not in the first
checklist.

1. **Testimonials.** Four quotes attributed to "Sarah Johnson, CTO, TechFlow
   Solutions", "Michael Chen, CEO, GlobalTrade Inc." and others who do not
   exist. Moved to `lib/testimonials.ts`, which ships **empty**. The carousel
   renders nothing until real quotes are added.
2. **Review ticker.** Eleven more invented reviews, presented on **Clutch and
   Behance logos** — reviews that never existed on either platform. Same
   treatment: empty list, section hidden. This one carried real legal exposure:
   invented endorsements breach the FTC's endorsement rules and UK/EU consumer
   law, and putting them on a review platform's mark is a separate trademark
   problem.
3. **Footer trust badges.** "5.0 / on Clutch", plus Behance, Dribbble and
   Webflow marks. There is no Clutch profile and no Dribbble or Behance account.
   The claims are ours and stay; the borrowed logos are gone, each figure now
   set as a plain number.
4. **Team page.** Six named people with stock portraits. Moved to `lib/team.ts`,
   ships empty, section hidden. Also removed 18 dead social links (three per
   person, all `href="#"`).
5. **Hero client logos.** Four "Logoipsum" placeholder wordmarks on the first
   screen of the home page, beside "Trusted by 28+ teams worldwide". Replaced
   with claims we can stand behind.
6. **Trusted-by strip.** Adidas, OpenAI and Daimler alongside five invented
   brands. Replaced with the sectors we have actually delivered into.
7. **Eight fabricated case studies** — garment ERP, B2B CRM, HRM/payroll, school
   management, fleet TMS, warehouse WMS, LMS, real-estate portal — all with
   invented outcome figures. Marked `draft: true`: excluded from the listing,
   the sitemap, the structured data and the routes. Their slugs now 404. The
   copy is preserved, so removing the flag once real numbers exist republishes
   them.
8. **Four placeholder job openings.** The career grid now derives from
   `lib/careers.ts`, so a card cannot outlive its posting. The counter is
   computed, not hardcoded.
9. **Two mismatched portraits.** `contact-ceo-avatar.jpg` and
   `blog-author-marin.png` (named after the template's author) were presented as
   Junaied Hossain. Replaced with a monogram; the name and words stay.
10. **56 placeholder and trademark assets** moved from `/public` to
    `docs/unused-assets/` — preserved, but no longer served. There is no git
    repository here, so nothing was deleted.

### Functional gaps closed

11. **Newsletter unsubscribe.** New backend endpoint, API proxy, `/unsubscribe`
    page, and links from the newsletter band and the footer. No token required
    and no "not on the list" response — opt-out must be at least as easy as
    opt-in, and a not-found reply would let anyone test whether a given person
    is subscribed. This was the one open item with legal exposure.
12. **Per-topic blog pages and RSS**, as above.
13. **Per-service imagery.** All seven pages shared one set, two slots of which
    were fashion portraits illustrating "Built To Be Handed Over". Each service
    now has its own five images.
14. **Footer showreel.** A play button on a `<button>` with no handler. It now
    appears only when `siteConfig.showreelUrl` is set; otherwise it is a still.
15. **Forms now surface the API's own error.** They previously threw it away and
    showed one generic line — which would have hidden the most likely launch
    misconfiguration (Turnstile secret set on the backend, no site key here,
    every submission rejected).
16. **Stale Terms clause corrected.** It said job applications were "processed
    for demonstration purposes"; they now reach the hiring team. Worth a
    lawyer's eye, but leaving it was worse than fixing it.
17. **Two analytics events existed but nothing fired them** — newsletter signups
    and job applications were invisible in GA. Now wired.

### Bugs found and fixed

18. **About stats clipped on every phone.** The two figures (28 projects, 25
    experts) sat in a `shrink-0` row 446px wide inside a 327px column; the second
    was cut off entirely by an ancestor's `overflow-hidden`. Stacked below `lg`,
    and the 160px entrance slide scaled down for small screens.
19. **Sector strip unreadable on mobile** (introduced in this pass, caught in
    testing) — a 2200px bleeding row of words showed two of nine. Wrapped list
    below `lg`, bleeding strip from `lg`.
20. Earlier pass: header overflowed at 375px; a route-transition `transform`
    broke `position: fixed` site-wide; mobile panel visibility depended on tween
    order; six dead footer links, four on `/contact`, plus the article share row;
    `icon-arrow-up-right.svg` is a 6×1 rule that drew a dash.

### Verified

Accessibility pass across home, about, contact, blog, topic and article pages:
no image without `alt`, no link or button without an accessible name, no
unlabelled form control, no heading-level jumps, one `<h1>` and one `<main>` per
page. Mobile pass at 375px across eight page types: no clipped content, no
horizontal scroll. No console errors anywhere. Draft case studies and
not-yet-published articles both return 404.

---

## 3. Still open

### Needs your content — the sections are hidden until it arrives

1. **Testimonials** (`lib/testimonials.ts`) — add real, permissioned quotes. An
   anonymised quote ("Operations Director, garment manufacturer, Dhaka") is
   perfectly respectable and needs no logo.
2. **Reviews** (same file) — only add a platform logo where the review genuinely
   lives on that platform.
3. **Team** (`lib/team.ts`) — a photo is optional; entries without one fall back
   to initials.
4. **Eight case studies** (`lib/case-studies.ts`) — real figures, then delete
   `draft: true`.
5. **Photography** — the monograms on the contact card and article byline, and
   the service-page imagery, are placeholders from the existing pool. The image
   brief in `docs/project-help-image-brief-v2.xlsx` covers replacements.
6. **Showreel** — set `siteConfig.showreelUrl` to bring back the play button.

### Needs your keys

7. `NEXT_PUBLIC_GA_ID` and `NEXT_PUBLIC_META_PIXEL_ID` — no traffic or
   conversions are recorded without them.
8. `NEXT_PUBLIC_GSC_VERIFICATION` — then submit the sitemap.
9. `NEXT_PUBLIC_TURNSTILE_SITE_KEY` **and** `TURNSTILE_SECRET_KEY` in the
   backend. Set them together: the secret alone rejects every submission.

### After the swap

10. Run `npx tsx prisma/october-2026/relink.ts --check`, then without `--check`,
    to take the redirect hop out of the blog's internal links.

### Deliberately not done

11. **Dark mode and the theme toggle.** The live site has one; this rebuild is
    light-only by design. Adding it means a second colour token set across
    roughly forty components and re-testing every page in both themes — a
    change to the design you signed off, not a fix. Say the word and it is a
    day's work.
12. **Custom cursor.** Cosmetic, and it costs a little on mobile and
    accessibility.
13. **Visible breadcrumbs.** Structured-data breadcrumbs are on every page;
    nothing is drawn on screen. Adding them changes the hero on eight templates.

I left these three because your standing instruction was not to change the
approved design. They are the only items from the first checklist not addressed.

---

## 4. Order to do it in

**Before the swap**

1. Fill in whichever of §3's content lists you can. Nothing breaks if they stay
   empty — the sections simply do not render.
2. Set the four env vars, and the Turnstile secret on the backend at the same
   time.
3. Submit one real lead, one newsletter signup, one unsubscribe and one job
   application through the deployed site. Confirm each lands in the admin and
   triggers its email.
4. Run Lighthouse on the deployed URL — local numbers do not reflect the
   production image pipeline or the CDN.

**The swap**

5. Deploy, keeping the old build available for rollback.
6. Confirm redirects on the real domain, especially www → apex, which depends on
   DNS rather than the app.
7. In Search Console: submit `sitemap.xml`, then inspect `/about-us`,
   `/contact-us` and `/case-studies/signature-bangla` to confirm Google sees the
   308 and the new target.
8. Run `relink.ts`.
9. Watch coverage for two weeks. Renaming three top-level routes normally causes
   a visible dip for 2–4 weeks before it recovers.

**After**

10. Real photography from the image brief.
11. A second content month. The October cluster leaves deliberate room: nothing
    yet on data migration, integration projects, or how to price a SaaS product
    — all high-intent, all linkable from what exists.
