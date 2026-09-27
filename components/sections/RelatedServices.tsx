"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";
import { SERVICES } from "@/lib/services";

/**
 * The ground each card is printed on.
 *
 * Bold, saturated and one per service, because this section's job is to be
 * looked at rather than read — a reader who has got this far already knows what
 * they came for, and the seven panels are how they find the one they did not
 * come for. The last is near-black on purpose: it closes the grid the way a
 * cover closes a brochure.
 */
const GROUNDS: Record<string, { from: string; to: string; glow: string }> = {
  "saas-platform-development": { from: "#ff8a4c", to: "#e0380f", glow: "255,180,140" },
  "ecommerce-digital-commerce": { from: "#4fc06a", to: "#12653a", glow: "160,240,190" },
  "devops-cloud-infrastructure": { from: "#9277f8", to: "#4f31c0", glow: "200,185,255" },
  "ai-ml-data-analytics": { from: "#34cadd", to: "#046a78", glow: "170,240,250" },
  "technology-consulting": { from: "#fbba47", to: "#bd6a05", glow: "255,225,170" },
  "mobile-app-development": { from: "#f574ae", to: "#b41f77", glow: "255,195,225" },
  "cybersecurity-data-protection": { from: "#2b2b2b", to: "#060606", glow: "134,213,42" },
};

const FALLBACK_GROUND = { from: "#3b3b3b", to: "#101010", glow: "200,200,200" };

/**
 * One box in isometric projection — a rhombus for the lid and a parallelogram
 * down each visible wall, sharing a corner.
 *
 * `cx, cy` is the CENTRE OF THE LID, not of the solid, so a stack is written by
 * moving cy and nothing else. The three faces are the same white at three
 * opacities: that difference is the only thing telling the eye where the light
 * is, and therefore the only thing making it a solid rather than a hexagon.
 */
function Slab({
  cx,
  cy,
  w,
  h,
}: {
  cx: number;
  cy: number;
  /** Half-width of the lid. Its depth follows at half this, which is the projection. */
  w: number;
  /** Wall height. */
  h: number;
}) {
  const d = w / 2;

  return (
    <g>
      <path
        d={`M${cx} ${cy - d} L${cx + w} ${cy} L${cx} ${cy + d} L${cx - w} ${cy} Z`}
        fill="#ffffff"
        fillOpacity="0.96"
      />
      <path
        d={`M${cx - w} ${cy} L${cx} ${cy + d} L${cx} ${cy + d + h} L${cx - w} ${cy + h} Z`}
        fill="#ffffff"
        fillOpacity="0.62"
      />
      <path
        d={`M${cx + w} ${cy} L${cx} ${cy + d} L${cx} ${cy + d + h} L${cx + w} ${cy + h} Z`}
        fill="#ffffff"
        fillOpacity="0.4"
      />
    </g>
  );
}

/**
 * A different solid per service, all built from the same box.
 *
 * Not illustration for its own sake — each arrangement is the shape of the
 * thing: tenants stacked, a pipeline running left to right, a model sitting
 * over its data, a device standing on end.
 */
function ServiceObject({ slug, className }: { slug: string; className?: string }) {
  const body = (() => {
    switch (slug) {
      case "saas-platform-development":
        // Tenants, stacked on one platform.
        return (
          <>
            <Slab cx={60} cy={62} w={40} h={9} />
            <Slab cx={60} cy={44} w={33} h={8} />
            <Slab cx={60} cy={28} w={26} h={7} />
          </>
        );
      case "ecommerce-digital-commerce":
        // A carton, and the next one already packed.
        return (
          <>
            <Slab cx={44} cy={52} w={32} h={20} />
            <Slab cx={88} cy={66} w={20} h={13} />
          </>
        );
      case "devops-cloud-infrastructure":
        // Three stages of one pipeline.
        return (
          <>
            <Slab cx={30} cy={62} w={20} h={12} />
            <Slab cx={62} cy={52} w={20} h={12} />
            <Slab cx={94} cy={42} w={20} h={12} />
          </>
        );
      case "ai-ml-data-analytics":
        // A model over the data it was trained on.
        return (
          <>
            <Slab cx={60} cy={68} w={40} h={9} />
            <circle cx={60} cy={34} r={17} fill="#ffffff" fillOpacity="0.96" />
            <circle cx={60} cy={34} r={17} fill="url(#objShade)" />
            <circle cx={26} cy={30} r={4} fill="#ffffff" fillOpacity="0.7" />
            <circle cx={96} cy={24} r={5} fill="#ffffff" fillOpacity="0.55" />
          </>
        );
      case "technology-consulting":
        // A plinth, and the decision standing on it.
        return (
          <>
            <Slab cx={60} cy={70} w={38} h={8} />
            <Slab cx={60} cy={40} w={14} h={24} />
          </>
        );
      case "mobile-app-development":
        // A device on end, with its screen catching the light.
        return (
          <>
            <Slab cx={60} cy={70} w={34} h={7} />
            <Slab cx={60} cy={30} w={17} h={34} />
          </>
        );
      default:
        // A slab under lock. The keep is smaller than what it protects.
        return (
          <>
            <Slab cx={60} cy={66} w={40} h={10} />
            <Slab cx={60} cy={40} w={22} h={16} />
          </>
        );
    }
  })();

  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden>
      <defs>
        <linearGradient id="objShade" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="1" stopColor="#000000" stopOpacity="0.28" />
        </linearGradient>
      </defs>
      {/* Grounded. A solid with no shadow floats, whatever else is done to it. */}
      <ellipse cx="60" cy="88" rx="38" ry="7" fill="#000000" fillOpacity="0.22" />
      {body}
    </svg>
  );
}

/**
 * Column spans, so the grid always ends flush.
 *
 * The first card takes two columns, which leaves the remainder dependent on how
 * many services are shown — seven on /services, six on a detail page, which
 * would otherwise leave a hole in the last row. The last card simply grows to
 * fill whatever is left.
 */
const SPAN = ["", "lg:col-span-2", "lg:col-span-3"];

function spanFor(index: number, total: number) {
  if (index === 0) return SPAN[1];
  if (index < total - 1) return SPAN[0];

  const remainder = (total + 1) % 3;
  return remainder === 0 ? SPAN[0] : SPAN[3 - remainder] ?? SPAN[0];
}

/**
 * The other services, shown as panels rather than listed as links.
 *
 * Every service page linking to every other is what turns seven isolated pages
 * into a cluster a crawler can traverse — and it is the row a reader wants when
 * this service turns out not to be the one they need. It used to be a ruled
 * list of seven titles, which did that job and nothing else.
 */
export default function RelatedServices({ currentSlug }: { currentSlug: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const others = SERVICES.filter((service) => service.slug !== currentSlug);

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

      // The solids breathe, a beat apart from each other, so the grid is never
      // completely still without anything on it actually moving.
      gsap.utils.toArray<HTMLElement>(".related-object").forEach((object, index) => {
        gsap.to(object, {
          y: -7,
          scale: 1.02,
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

        <div className="related-grid mt-[26px] grid w-full grid-cols-1 gap-[14px] sm:grid-cols-2 lg:mt-[34px] lg:grid-cols-3 lg:gap-[18px]">
          {others.map((service, index) => {
            const ground = GROUNDS[service.slug] ?? FALLBACK_GROUND;
            const wide = index === 0;

            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                style={{
                  backgroundImage: `linear-gradient(145deg, ${ground.from} 0%, ${ground.to} 100%)`,
                }}
                className={`related-card group relative flex min-h-[246px] flex-col justify-between overflow-hidden rounded-[20px] p-[24px] lg:min-h-[262px] lg:p-[28px] ${spanFor(
                  index,
                  others.length,
                )} ${wide ? "sm:col-span-2" : ""}`}
              >
                {/* A light source behind the solid, in the card's own colour,
                    so the ground is not a flat sheet of one value. */}
                <span
                  aria-hidden
                  style={{
                    backgroundImage: `radial-gradient(60% 55% at 72% 30%, rgba(${ground.glow},0.42), transparent 70%)`,
                  }}
                  className="pointer-events-none absolute inset-0"
                />

                <div className="relative flex items-start justify-between gap-[14px]">
                  <span className="font-mono text-[10.5px] uppercase leading-none tracking-[1px] text-white/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    aria-hidden
                    className="flex size-[30px] shrink-0 items-center justify-center rounded-full border border-white/25 text-white transition-[transform,background-color] duration-300 group-hover:translate-x-[3px] group-hover:bg-white/15"
                  >
                    <svg width="13" height="13" viewBox="0 0 15 15" fill="none">
                      <path
                        d="M3 12 12 3M4.6 3H12v7.4"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>

                {/* Centred on negative margins rather than -translate-y-1/2:
                    GSAP owns this element's transform for the float below, and
                    a Tailwind translate on the same property is overwritten the
                    first frame the tween runs. */}
                {/* Smaller on a phone: at 327px wide there is not room for a
                    154px solid AND a title beside it, and the title lost. */}
                <ServiceObject
                  slug={service.slug}
                  className={`related-object pointer-events-none absolute right-[10px] top-1/2 -mt-[50px] h-[100px] w-[120px] opacity-95 sm:right-[14px] sm:-mt-[64px] sm:h-[128px] sm:w-[154px] ${
                    wide ? "lg:right-[40px] lg:-mt-[82px] lg:h-[164px] lg:w-[196px]" : ""
                  }`}
                />

                {/* Held clear of the solid on its right. */}
                <div
                  className={`relative flex max-w-[56%] flex-col gap-[7px] ${
                    wide ? "sm:max-w-[58%]" : "sm:max-w-[62%]"
                  }`}
                >
                  <h3
                    className={`font-display font-semibold leading-[1.08] tracking-[-0.7px] text-white ${
                      wide ? "text-[clamp(1.5rem,2.4vw,30px)]" : "text-[21px]"
                    }`}
                  >
                    {service.shortTitle}
                  </h3>
                  <p className="font-body text-[12.5px] leading-[18px] tracking-[-0.1px] text-white/70">
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
