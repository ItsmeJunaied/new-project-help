"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";
import { SERVICES } from "@/lib/services";

/**
 * Three grounds, not seven.
 *
 * The first attempt at this gave every service its own hue and the board came
 * out a rainbow — seven cards shouting over each other with nothing holding
 * them together. A brand board does the opposite: one colour family, plus black
 * and plus a light, arranged so the eye moves between them. So there are three
 * values here and they are the brand's own — near-black, the green, and the
 * paper the site is printed on — and which card gets which is a composition
 * decision rather than a property of the service.
 *
 * `tone` is what the solid on that card is drawn in, and `accent` is the one
 * colour the card is allowed besides its ground. On the two dark grounds that
 * accent is the green, which is what ties the object to the ground it stands
 * on rather than leaving it floating there in a different scheme.
 */
type Scheme = {
  ground: string;
  /** Base colour of the isometric solid. */
  tone: string;
  /** Headline and the arrow. */
  ink: string;
  /** The supporting line. */
  muted: string;
  /** The one permitted highlight: the solid's lid, the index, the glow. */
  accent: string;
  /** Border, so a light card is not a hole in the page. */
  edge: string;
  /**
   * How much of the accent is allowed into the glow behind the solid.
   *
   * Per scheme because the same 26% that gives a black card depth turns a
   * cream one green — it is a wash over the ground, and a pale ground has
   * nothing to absorb it.
   */
  glow: number;
};

const DARK: Scheme = {
  ground: "linear-gradient(152deg, #232323 0%, #070707 100%)",
  tone: "#ffffff",
  ink: "#ffffff",
  muted: "rgba(255,255,255,0.62)",
  accent: "var(--color-primary-green)",
  edge: "rgba(255,255,255,0.08)",
  glow: 30,
};

const GREEN: Scheme = {
  ground:
    "linear-gradient(152deg, color-mix(in srgb, var(--color-primary-green) 92%, #ffffff) 0%, color-mix(in srgb, var(--color-primary-green) 58%, #16330a) 100%)",
  tone: "#0f1f05",
  ink: "#0f1f05",
  muted: "rgba(15,31,5,0.62)",
  accent: "#0f1f05",
  edge: "rgba(15,31,5,0.12)",
  glow: 13,
};

const LIGHT: Scheme = {
  ground: "linear-gradient(152deg, #fbfbf8 0%, #e9e9e2 100%)",
  tone: "#151515",
  ink: "#151515",
  muted: "rgba(21,21,21,0.58)",
  accent: "var(--color-primary-green)",
  edge: "rgba(21,21,21,0.1)",
  glow: 9,
};

/**
 * The board, by position rather than by service.
 *
 * Read off the reference: a big square anchoring the top left, a tall panel
 * beside it, a taller one holding the right-hand edge, then wide panels
 * closing the bottom. The sizes are the composition — seven identical
 * rectangles would be a list with pictures on it.
 *
 * Two arrangements because two counts exist: seven services on /services, six
 * on a detail page where the current one is left out. Both tile a four-column
 * grid exactly, with no hole for the browser to fill by guessing.
 */
const BENTO: Record<number, string[]> = {
  // 4 x 4. Cells: 4+1+1, 1, 2, 2, 2 -> 16.
  7: [
    "lg:col-span-2 lg:row-span-2",
    "lg:row-span-2",
    "lg:row-span-3",
    "",
    "lg:col-span-2",
    "lg:col-span-2",
    "lg:col-span-2",
  ],
  // 4 x 3. Cells: 4+2+2, 1, 2, 1 -> 12.
  6: ["lg:col-span-2 lg:row-span-2", "lg:row-span-2", "lg:row-span-2", "", "lg:col-span-2", ""],
};

/** Which ground each position takes. Dark, green, light, and around again. */
const SCHEMES = [DARK, GREEN, DARK, LIGHT, GREEN, DARK, LIGHT];

/** Positions that get room for a larger headline. */
const LARGE = new Set([0, 2]);

/**
 * One box in isometric projection — a rhombus for the lid and a parallelogram
 * down each visible wall, sharing a corner.
 *
 * `cx, cy` is the CENTRE OF THE LID, not of the solid, so a stack is written by
 * moving cy and nothing else. The three faces are one colour at three
 * opacities: that difference is the only thing telling the eye where the light
 * is, and therefore the only thing making it a solid rather than a hexagon.
 *
 * The lid takes the card's accent when one is given, which is what keeps the
 * object and its ground in the same scheme.
 */
function Slab({
  cx,
  cy,
  w,
  h,
  tone,
  lid,
}: {
  cx: number;
  cy: number;
  /** Half-width of the lid. Its depth follows at half this, which is the projection. */
  w: number;
  /** Wall height. */
  h: number;
  tone: string;
  lid?: string;
}) {
  const d = w / 2;

  return (
    <g>
      <path
        d={`M${cx} ${cy - d} L${cx + w} ${cy} L${cx} ${cy + d} L${cx - w} ${cy} Z`}
        fill={lid ?? tone}
        fillOpacity={lid ? 1 : 0.96}
      />
      <path
        d={`M${cx - w} ${cy} L${cx} ${cy + d} L${cx} ${cy + d + h} L${cx - w} ${cy + h} Z`}
        fill={tone}
        fillOpacity="0.58"
      />
      <path
        d={`M${cx + w} ${cy} L${cx} ${cy + d} L${cx} ${cy + d + h} L${cx + w} ${cy + h} Z`}
        fill={tone}
        fillOpacity="0.36"
      />
    </g>
  );
}

/**
 * A different solid per service, all built from the same box.
 *
 * Not illustration for its own sake — each arrangement is the shape of the
 * thing: tenants stacked, a pipeline running left to right, a model sitting
 * over its data, a device standing on end. Only the topmost element takes the
 * accent, so every card has exactly one highlight.
 */
function ServiceObject({
  slug,
  scheme,
  className,
}: {
  slug: string;
  scheme: Scheme;
  className?: string;
}) {
  const { tone, accent } = scheme;

  const body = (() => {
    switch (slug) {
      case "saas-platform-development":
        return (
          <>
            <Slab cx={60} cy={64} w={40} h={9} tone={tone} />
            <Slab cx={60} cy={46} w={33} h={8} tone={tone} />
            <Slab cx={60} cy={29} w={26} h={7} tone={tone} lid={accent} />
          </>
        );
      case "ecommerce-digital-commerce":
        return (
          <>
            <Slab cx={44} cy={50} w={32} h={21} tone={tone} lid={accent} />
            <Slab cx={90} cy={68} w={19} h={12} tone={tone} />
          </>
        );
      case "devops-cloud-infrastructure":
        return (
          <>
            <Slab cx={28} cy={64} w={19} h={12} tone={tone} />
            <Slab cx={60} cy={53} w={19} h={12} tone={tone} />
            <Slab cx={92} cy={42} w={19} h={12} tone={tone} lid={accent} />
          </>
        );
      case "ai-ml-data-analytics":
        return (
          <>
            <Slab cx={60} cy={70} w={40} h={9} tone={tone} />
            <circle cx={60} cy={36} r={16} fill={accent} />
            <circle cx={60} cy={36} r={16} fill="url(#objShade)" />
            <circle cx={26} cy={31} r={3.5} fill={tone} fillOpacity="0.55" />
            <circle cx={96} cy={25} r={4.5} fill={tone} fillOpacity="0.4" />
          </>
        );
      case "technology-consulting":
        return (
          <>
            <Slab cx={60} cy={72} w={38} h={8} tone={tone} />
            <Slab cx={60} cy={41} w={13} h={25} tone={tone} lid={accent} />
          </>
        );
      case "mobile-app-development":
        return (
          <>
            <Slab cx={60} cy={72} w={34} h={7} tone={tone} />
            <Slab cx={60} cy={31} w={16} h={35} tone={tone} lid={accent} />
          </>
        );
      default:
        return (
          <>
            <Slab cx={60} cy={68} w={40} h={10} tone={tone} />
            <Slab cx={60} cy={41} w={21} h={17} tone={tone} lid={accent} />
          </>
        );
    }
  })();

  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden>
      <defs>
        <linearGradient id="objShade" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {/* Grounded. A solid with no shadow floats, whatever else is done to it. */}
      <ellipse cx="60" cy="90" rx="38" ry="6.5" fill={tone} fillOpacity="0.16" />
      {body}
    </svg>
  );
}

/**
 * The other services, shown as a board rather than listed as links.
 *
 * Every service page linking to every other is what turns seven isolated pages
 * into a cluster a crawler can traverse — and it is the row a reader wants when
 * this service turns out not to be the one they need. It used to be seven
 * titles on seven hairlines, which did that job and nothing else.
 */
export default function RelatedServices({ currentSlug }: { currentSlug: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const others = SERVICES.filter((service) => service.slug !== currentSlug);
  const bento = BENTO[others.length] ?? [];

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 86%" });

      gsap.from(".related-head", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: trigger,
      });

      gsap.from(".related-card", {
        y: 36,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: reveal(sectionRef.current?.querySelector(".related-grid") ?? null, {
          start: "top 88%",
        }),
      });

      if (prefersReducedMotion()) return;

      // The solids breathe, a beat apart from each other, so the board is never
      // completely still without anything on it actually moving.
      gsap.utils.toArray<HTMLElement>(".related-object").forEach((object, index) => {
        gsap.to(object, {
          y: -7,
          duration: 2.6 + index * 0.18,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: index * 0.2,
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="w-full bg-bg px-6 pb-[80px] lg:px-[40px] lg:pb-[120px]">
      <div className="mx-auto w-full max-w-[1440px]">
        <h2 className="related-head w-full font-display text-[clamp(1.75rem,3vw,38px)] font-semibold leading-[1.15] tracking-[-0.8px] text-black">
          {currentSlug ? "Other Services" : "All Services"}
        </h2>

        {/* Four columns of fixed-height rows, so a card that spans two rows is
            twice the height of one that does not — which is what makes this a
            board rather than a grid of equal boxes. */}
        <div className="related-grid mt-[26px] grid w-full grid-cols-1 gap-[12px] sm:grid-cols-2 lg:mt-[34px] lg:grid-cols-4 lg:auto-rows-[172px] lg:gap-[14px]">
          {others.map((service, index) => {
            const scheme = SCHEMES[index % SCHEMES.length];
            const large = LARGE.has(index);

            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                style={{ backgroundImage: scheme.ground, borderColor: scheme.edge }}
                className={`related-card group relative flex min-h-[214px] flex-col justify-end overflow-hidden rounded-[18px] border p-[20px] lg:min-h-0 lg:p-[24px] ${
                  bento[index] ?? ""
                }`}
              >
                {/* A light behind the solid, in the card's own accent, so no
                    ground is a flat sheet of one value. */}
                <span
                  aria-hidden
                  style={{
                    backgroundImage: `radial-gradient(58% 52% at 70% 32%, color-mix(in srgb, ${scheme.accent} ${scheme.glow}%, transparent), transparent 72%)`,
                  }}
                  className="pointer-events-none absolute inset-0"
                />

                <span
                  aria-hidden
                  style={{ color: scheme.accent }}
                  className="absolute left-[20px] top-[18px] font-mono text-[10px] uppercase leading-none tracking-[1px] lg:left-[24px] lg:top-[22px]"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span
                  aria-hidden
                  style={{ borderColor: scheme.edge, color: scheme.ink }}
                  className="absolute right-[18px] top-[16px] flex size-[28px] items-center justify-center rounded-full border transition-transform duration-300 group-hover:translate-x-[3px] lg:right-[22px] lg:top-[20px]"
                >
                  <svg width="12" height="12" viewBox="0 0 15 15" fill="none">
                    <path
                      d="M3 12 12 3M4.6 3H12v7.4"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                {/* Centred on negative margins rather than -translate-y-1/2:
                    GSAP owns this element's transform for the float above, and
                    a Tailwind translate on the same property is overwritten the
                    first frame the tween runs. */}
                <ServiceObject
                  slug={service.slug}
                  scheme={scheme}
                  className={`related-object pointer-events-none absolute right-[8px] top-1/2 -mt-[46px] h-[92px] w-[110px] transition-transform duration-500 group-hover:scale-[1.05] sm:right-[12px] sm:-mt-[56px] sm:h-[112px] sm:w-[134px] ${
                    large ? "lg:right-[26px] lg:-mt-[78px] lg:h-[156px] lg:w-[186px]" : ""
                  }`}
                />

                {/* Held clear of the solid on its right. */}
                <div className="relative flex max-w-[56%] flex-col gap-[6px] lg:max-w-[64%]">
                  <h3
                    style={{ color: scheme.ink }}
                    className={`font-display font-semibold leading-[1.06] tracking-[-0.6px] ${
                      large ? "text-[21px] lg:text-[clamp(1.5rem,2.2vw,30px)]" : "text-[19px]"
                    }`}
                  >
                    {service.shortTitle}
                  </h3>
                  <p
                    style={{ color: scheme.muted }}
                    className="font-body text-[12px] leading-[17px] tracking-[-0.1px]"
                  >
                    {service.included[0]}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
