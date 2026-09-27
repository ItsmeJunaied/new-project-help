"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";
import { SERVICES, WORK_DOMAINS } from "@/lib/services";

/**
 * Four grounds, and three of them are light.
 *
 * The first attempt gave every service its own hue and the board came out a
 * rainbow. The second put it on one family but leaned on near-black, which made
 * it heavy. This is the same one family, lightened: paper, mint and sage, with
 * a single charcoal every sixth card so the board has somewhere to rest. The
 * green is never the ground and always the highlight, which is the only way
 * fifteen cards read as one set.
 */
type Scheme = {
  ground: string;
  /** What the drawing is rendered in. */
  ink: string;
  /** Headline. */
  title: string;
  /** Supporting line. */
  muted: string;
  /** The one permitted highlight, in the drawing and on the index. */
  accent: string;
  edge: string;
  /** How much accent is allowed into the wash behind the drawing. */
  glow: number;
};

const CREAM: Scheme = {
  ground: "linear-gradient(150deg, #f8f6ef 0%, #eae7db 100%)",
  ink: "#151515",
  title: "#151515",
  muted: "rgba(21,21,21,0.56)",
  accent: "var(--color-primary-green)",
  edge: "rgba(21,21,21,0.12)",
  glow: 12,
};

const MINT: Scheme = {
  ground:
    "linear-gradient(150deg, #f0fbdc 0%, color-mix(in srgb, var(--color-primary-green) 40%, #ffffff) 100%)",
  ink: "#16300a",
  title: "#12280a",
  muted: "rgba(18,40,10,0.58)",
  accent: "#3d7a12",
  edge: "rgba(18,40,10,0.14)",
  glow: 10,
};

const SAGE: Scheme = {
  ground: "linear-gradient(150deg, #e9f1e5 0%, #d3e1cd 100%)",
  ink: "#17261b",
  title: "#17261b",
  muted: "rgba(23,38,27,0.56)",
  accent: "#3d7a12",
  edge: "rgba(23,38,27,0.14)",
  glow: 11,
};

const CHAR: Scheme = {
  ground: "linear-gradient(150deg, #343434 0%, #1a1a1a 100%)",
  ink: "#ffffff",
  title: "#ffffff",
  muted: "rgba(255,255,255,0.6)",
  accent: "var(--color-primary-green)",
  edge: "rgba(255,255,255,0.1)",
  glow: 26,
};

/** One charcoal in every six, so the board has an anchor without being heavy. */
const SCHEMES = [MINT, CREAM, CHAR, SAGE, MINT, CREAM];

/**
 * The board, by position rather than by service.
 *
 * Six cards fill twelve cells — a big square, two tall panels beside it, then a
 * row of one-plus-two-plus-one. Repeating that block is what lets the same
 * pattern tile any multiple of six exactly, and it is why the card list below
 * is trimmed to fifteen: fifteen is two whole blocks plus a half block of
 * 2x2 + 1x2 + 1x2, which also lands flush.
 */
const PATTERN = [
  "lg:col-span-2 lg:row-span-2",
  "lg:row-span-2",
  "lg:row-span-2",
  "",
  "lg:col-span-2",
  "",
];

/** Positions with room for a larger headline and a larger drawing. */
const LARGE = new Set([0, 6, 12]);

type Card = {
  key: string;
  title: string;
  line: string;
  /** Which drawing. */
  art: string;
  /** Null for the work we do that has no page of its own. */
  href: string | null;
};

/**
 * The domains that have no service page, keyed to a drawing.
 *
 * These are real work — they are the names clients ask for, and they already
 * appear on /about — they simply do not have a page to link to, so their cards
 * do not pretend to. Workflow Automation is deliberately not among them: it
 * says the same thing as Business Automation, and dropping it is what brings
 * the board to fifteen and makes it tile.
 */
const DOMAIN_ART: Record<string, string> = {
  "Custom Software": "custom",
  "Web Applications": "webapps",
  "ERP Systems": "erp",
  "CRM Systems": "crm",
  "Enterprise Software": "enterprise",
  "API Development": "api",
  Microservices: "microservices",
  "Business Automation": "automation",
};

const SERVICE_ART: Record<string, string> = {
  "saas-platform-development": "saas",
  "ecommerce-digital-commerce": "ecommerce",
  "devops-cloud-infrastructure": "devops",
  "ai-ml-data-analytics": "aiml",
  "technology-consulting": "consulting",
  "mobile-app-development": "mobile",
  "cybersecurity-data-protection": "security",
};

/* --------------------------------------------------------------- drawings */

/**
 * The window every drawing sits in.
 *
 * Fifteen unrelated pictures would be fifteen things to look at. One frame, one
 * title bar and one stroke weight across all of them means the eye reads a set
 * and only has to take in what is different inside each.
 */
function Frame({ ink, children }: { ink: string; children: React.ReactNode }) {
  return (
    <>
      <rect x="8" y="13" width="124" height="78" rx="10" fill={ink} fillOpacity="0.05" />
      <rect
        x="8"
        y="13"
        width="124"
        height="78"
        rx="10"
        fill="none"
        stroke={ink}
        strokeOpacity="0.16"
      />
      <path d="M8 27h124" stroke={ink} strokeOpacity="0.13" />
      <circle cx="17" cy="20" r="1.9" fill={ink} fillOpacity="0.26" />
      <circle cx="24" cy="20" r="1.9" fill={ink} fillOpacity="0.18" />
      {children}
    </>
  );
}

/** A drawing of the thing itself, one per card. */
function Art({ id, ink, accent }: { id: string; ink: string; accent: string }) {
  const soft = (o: number) => ({ fill: ink, fillOpacity: o });
  const line = (o: number) => ({ stroke: ink, strokeOpacity: o, strokeWidth: 1.4, fill: "none" });

  const inner = (() => {
    switch (id) {
      case "saas":
        // A tenant dashboard: nav down the side, usage climbing.
        return (
          <>
            <rect x="15" y="34" width="20" height="50" rx="3" {...soft(0.1)} />
            <rect x="18" y="38" width="14" height="2.6" rx="1.3" {...soft(0.22)} />
            <rect x="18" y="44" width="10" height="2.6" rx="1.3" {...soft(0.16)} />
            <rect x="41" y="34" width="84" height="18" rx="3" {...soft(0.08)} />
            <rect x="46" y="39" width="26" height="3" rx="1.5" fill={accent} />
            <rect x="41" y="70" width="12" height="14" rx="2" {...soft(0.18)} />
            <rect x="58" y="63" width="12" height="21" rx="2" {...soft(0.24)} />
            <rect x="75" y="57" width="12" height="27" rx="2" fill={accent} />
            <rect x="92" y="66" width="12" height="18" rx="2" {...soft(0.2)} />
          </>
        );
      case "ecommerce":
        // Three products and a full basket.
        return (
          <>
            <rect x="16" y="36" width="30" height="30" rx="4" {...soft(0.14)} />
            <rect x="52" y="36" width="30" height="30" rx="4" {...soft(0.14)} />
            <rect x="88" y="36" width="30" height="30" rx="4" fill={accent} fillOpacity="0.9" />
            <rect x="16" y="71" width="18" height="3" rx="1.5" {...soft(0.2)} />
            <rect x="52" y="71" width="18" height="3" rx="1.5" {...soft(0.2)} />
            <rect x="88" y="71" width="18" height="3" rx="1.5" {...soft(0.2)} />
            <path d="M16 80h10l3 6h14" {...line(0.3)} />
            <circle cx="41" cy="88" r="2.4" fill={accent} />
          </>
        );
      case "devops":
        // Three stages, the last one green.
        return (
          <>
            <path d="M28 58h84" {...line(0.22)} />
            <rect x="16" y="48" width="24" height="20" rx="4" {...soft(0.16)} />
            <rect x="58" y="48" width="24" height="20" rx="4" {...soft(0.16)} />
            <rect x="100" y="48" width="24" height="20" rx="4" fill={accent} fillOpacity="0.9" />
            <path d="M106 58l4 4 7-8" stroke="#ffffff" strokeWidth="1.8" fill="none" />
            <rect x="16" y="76" width="34" height="3" rx="1.5" {...soft(0.16)} />
          </>
        );
      case "aiml":
        // A curve, and the point the model is confident about.
        return (
          <>
            <path d="M18 82h104" {...line(0.18)} />
            <path d="M18 82V36" {...line(0.18)} />
            <path d="M22 76c14 0 20-18 34-22s26 12 40 4 16-14 24-16" {...line(0.3)} />
            <circle cx="88" cy="50" r="5.5" fill={accent} />
            <circle cx="88" cy="50" r="10" fill={accent} fillOpacity="0.18" />
            <circle cx="46" cy="60" r="2.6" {...soft(0.26)} />
            <circle cx="118" cy="43" r="2.6" {...soft(0.2)} />
          </>
        );
      case "consulting":
        // An assessment, and the decision signed off at the end of it.
        return (
          <>
            <rect x="24" y="34" width="70" height="50" rx="4" {...soft(0.09)} />
            <rect x="32" y="42" width="44" height="3" rx="1.5" {...soft(0.24)} />
            <rect x="32" y="51" width="54" height="2.6" rx="1.3" {...soft(0.16)} />
            <rect x="32" y="59" width="48" height="2.6" rx="1.3" {...soft(0.16)} />
            <rect x="32" y="67" width="34" height="2.6" rx="1.3" {...soft(0.16)} />
            <circle cx="99" cy="70" r="12" fill={accent} />
            <path d="M93 70l4.5 4.5L106 66" stroke="#ffffff" strokeWidth="2" fill="none" />
          </>
        );
      case "mobile":
        // A device, and the app running on it.
        return (
          <>
            <rect x="52" y="32" width="36" height="58" rx="7" {...soft(0.12)} />
            <rect x="52" y="32" width="36" height="58" rx="7" fill="none" stroke={ink} strokeOpacity="0.2" />
            <rect x="64" y="36" width="12" height="2" rx="1" {...soft(0.3)} />
            <rect x="57" y="43" width="12" height="12" rx="3" fill={accent} />
            <rect x="72" y="43" width="12" height="12" rx="3" {...soft(0.2)} />
            <rect x="57" y="59" width="12" height="12" rx="3" {...soft(0.2)} />
            <rect x="72" y="59" width="12" height="12" rx="3" {...soft(0.14)} />
            <rect x="60" y="79" width="20" height="3" rx="1.5" {...soft(0.22)} />
          </>
        );
      case "security":
        // What is being protected, and the lock on it.
        return (
          <>
            <path
              d="M70 32l26 9v18c0 14-11 24-26 30-15-6-26-16-26-30V41z"
              fill={ink}
              fillOpacity="0.1"
              stroke={ink}
              strokeOpacity="0.22"
              strokeWidth="1.4"
            />
            <rect x="58" y="57" width="24" height="18" rx="3.5" fill={accent} />
            <path d="M64 57v-5a6 6 0 0112 0v5" stroke={accent} strokeWidth="2.6" fill="none" />
            <circle cx="70" cy="65" r="2.6" fill="#ffffff" />
          </>
        );
      case "custom":
        // Code, written for this and nothing else.
        return (
          <>
            <rect x="16" y="34" width="30" height="50" rx="3" {...soft(0.07)} />
            <rect x="20" y="40" width="4" height="2.4" rx="1.2" {...soft(0.2)} />
            <rect x="20" y="47" width="4" height="2.4" rx="1.2" {...soft(0.2)} />
            <rect x="20" y="54" width="4" height="2.4" rx="1.2" {...soft(0.2)} />
            <rect x="52" y="38" width="46" height="3" rx="1.5" {...soft(0.24)} />
            <rect x="58" y="47" width="38" height="3" rx="1.5" fill={accent} />
            <rect x="58" y="56" width="52" height="3" rx="1.5" {...soft(0.16)} />
            <rect x="64" y="65" width="30" height="3" rx="1.5" {...soft(0.16)} />
            <rect x="52" y="74" width="24" height="3" rx="1.5" {...soft(0.24)} />
          </>
        );
      case "webapps":
        // A portal: navigation, and the panels behind it.
        return (
          <>
            <rect x="16" y="34" width="22" height="50" rx="3" {...soft(0.1)} />
            <rect x="20" y="39" width="14" height="2.6" rx="1.3" fill={accent} />
            <rect x="20" y="46" width="11" height="2.6" rx="1.3" {...soft(0.18)} />
            <rect x="20" y="53" width="13" height="2.6" rx="1.3" {...soft(0.18)} />
            <rect x="44" y="34" width="38" height="22" rx="3" {...soft(0.14)} />
            <rect x="88" y="34" width="36" height="22" rx="3" {...soft(0.09)} />
            <rect x="44" y="62" width="80" height="22" rx="3" {...soft(0.09)} />
            <rect x="50" y="70" width="30" height="3" rx="1.5" {...soft(0.2)} />
          </>
        );
      case "erp":
        // Ledgers that finally agree with each other.
        return (
          <>
            <rect x="16" y="34" width="108" height="12" rx="3" {...soft(0.14)} />
            <rect x="22" y="39" width="20" height="3" rx="1.5" {...soft(0.28)} />
            <rect x="56" y="39" width="20" height="3" rx="1.5" {...soft(0.22)} />
            <rect x="90" y="39" width="20" height="3" rx="1.5" {...soft(0.22)} />
            {[52, 64, 76].map((y, i) => (
              <g key={y}>
                <rect x="16" y={y} width="108" height="10" rx="2.5" {...soft(0.06)} />
                <rect x="22" y={y + 3.6} width="24" height="2.8" rx="1.4" {...soft(0.18)} />
                <rect x="56" y={y + 3.6} width="16" height="2.8" rx="1.4" {...soft(0.14)} />
                <rect
                  x="90"
                  y={y + 3.6}
                  width="18"
                  height="2.8"
                  rx="1.4"
                  {...(i === 1 ? { fill: accent } : soft(0.14))}
                />
              </g>
            ))}
          </>
        );
      case "crm":
        // A pipeline shaped like your sales motion.
        return (
          <>
            {[16, 58, 100].map((x, i) => (
              <g key={x}>
                <rect x={x} y="34" width="24" height="3" rx="1.5" {...soft(i === 1 ? 0.3 : 0.2)} />
                <rect x={x} y="42" width="24" height="16" rx="3" {...soft(0.12)} />
                <rect
                  x={x}
                  y="62"
                  width="24"
                  height="16"
                  rx="3"
                  {...(i === 1 ? { fill: accent, fillOpacity: 0.9 } : soft(0.12))}
                />
              </g>
            ))}
            <rect x="16" y="82" width="24" height="7" rx="3" {...soft(0.07)} />
          </>
        );
      case "enterprise":
        // The shape of the business, drawn once.
        return (
          <>
            <rect x="54" y="32" width="32" height="14" rx="3.5" fill={accent} fillOpacity="0.9" />
            <path d="M70 46v10M34 56h72M34 56v10M70 56v10M106 56v10" {...line(0.24)} />
            <rect x="20" y="66" width="28" height="16" rx="3.5" {...soft(0.14)} />
            <rect x="56" y="66" width="28" height="16" rx="3.5" {...soft(0.14)} />
            <rect x="92" y="66" width="28" height="16" rx="3.5" {...soft(0.14)} />
          </>
        );
      case "api":
        // Endpoints another team can build against.
        return (
          <>
            {[
              [38, 0.9],
              [52, 0.14],
              [66, 0.14],
              [80, 0.14],
            ].map(([y, o], i) => (
              <g key={y}>
                <rect
                  x="16"
                  y={y}
                  width="22"
                  height="10"
                  rx="3"
                  {...(i === 0 ? { fill: accent, fillOpacity: o } : soft(o))}
                />
                <rect x="44" y={(y as number) + 3.5} width="52" height="3" rx="1.5" {...soft(0.18)} />
                <rect
                  x="102"
                  y={(y as number) + 3.5}
                  width="22"
                  height="3"
                  rx="1.5"
                  {...soft(0.1)}
                />
              </g>
            ))}
          </>
        );
      case "microservices":
        // Services split where the business already splits.
        return (
          <>
            <path d="M40 48h60M40 48v28M100 48v28M40 76h60M52 62h36" {...line(0.2)} />
            <rect x="26" y="38" width="28" height="20" rx="4" {...soft(0.16)} />
            <rect x="86" y="38" width="28" height="20" rx="4" fill={accent} fillOpacity="0.9" />
            <rect x="26" y="66" width="28" height="20" rx="4" {...soft(0.16)} />
            <rect x="86" y="66" width="28" height="20" rx="4" {...soft(0.16)} />
          </>
        );
      default:
        // The manual step between two systems, removed.
        return (
          <>
            <rect x="16" y="50" width="26" height="20" rx="4" {...soft(0.16)} />
            <rect x="57" y="50" width="26" height="20" rx="4" fill={accent} fillOpacity="0.9" />
            <rect x="98" y="50" width="26" height="20" rx="4" {...soft(0.16)} />
            <path d="M42 60h15M83 60h15" {...line(0.26)} />
            <path d="M53 57l4 3-4 3M94 57l4 3-4 3" {...line(0.3)} />
            <path d="M29 76v6h82v-6" {...line(0.16)} />
          </>
        );
    }
  })();

  return <Frame ink={ink}>{inner}</Frame>;
}

/* ----------------------------------------------------------------- board */

export default function RelatedServices({ currentSlug }: { currentSlug: string }) {
  const sectionRef = useRef<HTMLElement>(null);

  // On a detail page this is the sibling row — the other six services, each
  // with a page to go to. On /services it is the whole offering, so the work we
  // do that has no page of its own is on the board too.
  const services = SERVICES.filter((service) => service.slug !== currentSlug).map((service) => ({
    key: service.slug,
    title: service.shortTitle,
    line: service.included[0],
    art: SERVICE_ART[service.slug] ?? "custom",
    href: `/services/${service.slug}`,
  }));

  const domains: Card[] = currentSlug
    ? []
    : WORK_DOMAINS.filter((domain) => !domain.service && DOMAIN_ART[domain.name]).map((domain) => ({
        key: domain.name,
        title: domain.name,
        line: domain.copy,
        art: DOMAIN_ART[domain.name],
        href: null,
      }));

  const cards: Card[] = [...services, ...domains];

  useGSAP(
    () => {
      gsap.from(".related-head", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: reveal(sectionRef.current, { start: "top 86%" }),
      });

      gsap.from(".related-card", {
        y: 34,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.05,
        scrollTrigger: reveal(sectionRef.current?.querySelector(".related-grid") ?? null, {
          start: "top 90%",
        }),
      });

      if (prefersReducedMotion()) return;

      // The drawings breathe, a beat apart from each other, so the board is
      // never completely still without anything on it actually moving.
      gsap.utils.toArray<HTMLElement>(".related-art").forEach((art, index) => {
        gsap.to(art, {
          y: -6,
          duration: 2.8 + (index % 5) * 0.22,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: (index % 7) * 0.18,
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="w-full bg-bg px-6 pb-[80px] lg:px-[40px] lg:pb-[120px]">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="related-head flex w-full flex-wrap items-end justify-between gap-[14px]">
          <h2 className="font-display text-[clamp(1.75rem,3vw,38px)] font-semibold leading-[1.15] tracking-[-0.8px] text-black">
            {currentSlug ? "Other Services" : "All Services"}
          </h2>
          <p className="font-mono text-[11px] uppercase leading-none tracking-[0.8px] text-neutral-paragraph">
            {String(cards.length).padStart(2, "0")}{currentSlug ? " more" : " kinds of work"}
          </p>
        </div>

        {/* Four columns of fixed-height rows, so a card spanning two rows is
            twice the height of one that does not — which is what makes this a
            board rather than a grid of equal boxes. */}
        <div className="related-grid mt-[24px] grid w-full grid-cols-1 gap-[12px] sm:grid-cols-2 lg:mt-[32px] lg:grid-cols-4 lg:auto-rows-[168px] lg:gap-[14px]">
          {cards.map((card, index) => {
            const scheme = SCHEMES[index % SCHEMES.length];
            const large = LARGE.has(index);

            const body = (
              <>
                {/* A wash behind the drawing in the card's own accent, so no
                    ground is a flat sheet of one value. */}
                <span
                  aria-hidden
                  style={{
                    backgroundImage: `radial-gradient(56% 50% at 70% 34%, color-mix(in srgb, ${scheme.accent} ${scheme.glow}%, transparent), transparent 72%)`,
                  }}
                  className="pointer-events-none absolute inset-0"
                />

                <span
                  aria-hidden
                  style={{ color: scheme.accent }}
                  className="absolute left-[18px] top-[16px] font-mono text-[10px] uppercase leading-none tracking-[1px] lg:left-[22px] lg:top-[19px]"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                {card.href ? (
                  <span
                    aria-hidden
                    style={{ borderColor: scheme.edge, color: scheme.title }}
                    className="absolute right-[16px] top-[14px] flex size-[27px] items-center justify-center rounded-full border transition-transform duration-300 group-hover:translate-x-[3px] lg:right-[20px] lg:top-[17px]"
                  >
                    <svg width="11" height="11" viewBox="0 0 15 15" fill="none">
                      <path
                        d="M3 12 12 3M4.6 3H12v7.4"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                ) : null}

                {/* Centred on a negative margin rather than -translate-y-1/2:
                    GSAP owns this element's transform for the float above, and a
                    Tailwind translate on the same property is overwritten the
                    first frame the tween runs. */}
                <svg
                  viewBox="0 0 140 104"
                  aria-hidden
                  className={`related-art pointer-events-none absolute right-[4px] top-1/2 -mt-[42px] h-[84px] w-[113px] transition-transform duration-500 group-hover:scale-[1.04] sm:right-[8px] sm:-mt-[50px] sm:h-[100px] sm:w-[135px] ${
                    large ? "lg:right-[20px] lg:-mt-[66px] lg:h-[132px] lg:w-[178px]" : ""
                  }`}
                >
                  <Art id={card.art} ink={scheme.ink} accent={scheme.accent} />
                </svg>

                {/* Held clear of the drawing on its right. */}
                <div className="relative flex max-w-[54%] flex-col gap-[5px] lg:max-w-[62%]">
                  <h3
                    style={{ color: scheme.title }}
                    className={`font-display font-semibold leading-[1.06] tracking-[-0.5px] ${
                      large ? "text-[20px] lg:text-[clamp(1.4rem,2vw,28px)]" : "text-[17px]"
                    }`}
                  >
                    {card.title}
                  </h3>
                  <p
                    style={{ color: scheme.muted }}
                    className="line-clamp-2 font-body text-[11.5px] leading-[16px] tracking-[-0.1px]"
                  >
                    {card.line}
                  </p>
                </div>
              </>
            );

            const shell = `related-card group relative flex min-h-[206px] flex-col justify-end overflow-hidden rounded-[18px] border p-[18px] lg:min-h-0 lg:p-[22px] ${
              PATTERN[index % PATTERN.length]
            }`;

            const style = { backgroundImage: scheme.ground, borderColor: scheme.edge };

            // A domain with no page does not pretend to have one.
            return card.href ? (
              <Link key={card.key} href={card.href} style={style} className={shell}>
                {body}
              </Link>
            ) : (
              <div key={card.key} style={style} className={shell}>
                {body}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
