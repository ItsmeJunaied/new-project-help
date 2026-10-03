"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reveal } from "@/lib/anim";
import { SERVICES, type Service } from "@/lib/services";
import { SERVICE_IMAGE_ALT } from "@/lib/service-image-alt";

/**
 * The artwork file for each service.
 *
 * Seven of the fifteen were drawn first and their files carry the service's own
 * slug. The eight added later were named after the capability rather than the
 * page — `erp-systems.webp` for `erp-software-development` — and the generated
 * alt-text map in lib/service-image-alt.ts is keyed the same way. Listing the
 * seven that differ is cheaper than renaming files and regenerating that map.
 */
const ART: Record<string, string> = {
  "custom-software-development": "custom-software",
  "web-application-development": "web-applications",
  "erp-software-development": "erp-systems",
  "crm-software-development": "crm-systems",
  "enterprise-software-development": "enterprise-software",
  "microservices-architecture": "microservices",
  "business-process-automation": "business-automation",
};

const artKey = (slug: string) => ART[slug] ?? slug;

/**
 * The panel heading, upright except for its last word.
 *
 * The site already sets the accent half of a headline in italic serif — the
 * contact pages do it in six places — so the rule here is that one applied
 * mechanically: everything but the final word stays in the display face, the
 * final word turns. A single-word title ("Cybersecurity", "Microservices")
 * turns completely, which is the same gesture rather than an exception to it.
 */
function PanelHeading({ title }: { title: string }) {
  const words = title.split(" ");
  const last = words.pop() ?? title;
  const lead = words.join(" ");

  return (
    <h3 className="w-full font-display text-[30px] font-semibold leading-[1.08] tracking-[-0.035em] text-pure-black lg:text-[36px]">
      {lead && <span>{lead} </span>}
      <span className="font-serif font-normal italic tracking-[-0.02em]">{last}</span>
    </h3>
  );
}

/**
 * One service, as a tall panel.
 *
 * The artwork is a product screenshot, and a screenshot squared up inside a
 * card reads as a thumbnail. Turning it a few degrees, letting it run past the
 * panel's right edge and floating a label over it is what makes the panel read
 * as a surface with things arranged on it. The tilt eases back under the
 * cursor, so a hover has somewhere to go.
 *
 * `clone` marks the duplicate half of the marquee track: it is hidden from
 * assistive technology and taken out of the tab order, so the fifteen services
 * are announced and tabbed through once, not twice. It stays clickable, because
 * a visitor pointing at a panel should not have to know which copy it is.
 */
function Panel({ service, index, clone }: { service: Service; index: number; clone?: boolean }) {
  const key = artKey(service.slug);

  return (
    <Link
      href={`/services/${service.slug}`}
      aria-hidden={clone}
      tabIndex={clone ? -1 : undefined}
      className="service-panel group/panel relative flex h-[480px] w-[300px] shrink-0 flex-col overflow-hidden rounded-[28px] border border-black/[0.07] bg-gradient-to-b from-white via-white to-[#f3f1ed] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_26px_60px_-34px_rgba(0,0,0,0.42)] transition-shadow duration-500 hover:shadow-[0_1px_2px_rgba(0,0,0,0.05),0_38px_80px_-36px_rgba(0,0,0,0.5)] sm:h-[540px] sm:w-[340px] lg:h-[580px] lg:w-[372px]"
    >
      <div className="flex items-center justify-between px-[26px] pt-[24px] lg:px-[30px] lg:pt-[28px]">
        <span className="font-mono text-[11px] font-semibold leading-none tracking-[0.08em] text-ash-muted">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="rounded-full border border-black/10 px-[10px] py-[5px] font-mono text-[10px] uppercase leading-none tracking-[0.1em] text-ash-muted">
          Service
        </span>
      </div>

      <div className="flex flex-col gap-[12px] px-[26px] pt-[18px] lg:px-[30px]">
        <PanelHeading title={service.shortTitle} />
        {/* The service page's own opening line, clamped. Without it the panel
            is a title above a picture with a hole in between, and the title
            alone does not tell anyone whether this is the service they want. */}
        <p className="line-clamp-3 w-full font-body text-[13px] leading-[1.5] tracking-[-0.16px] text-neutral-paragraph lg:text-[14px]">
          {service.statement}
        </p>
      </div>

      {/* The artwork plane. It is wider than the panel on purpose and sits past
          the right edge, so the panel is a window onto something larger. */}
      <div className="relative mt-auto h-[250px] w-full [perspective:1600px] sm:h-[280px] lg:h-[300px]">
        <div className="absolute bottom-[-34px] left-[26px] right-[-56px] top-[14px] overflow-hidden rounded-[16px] bg-[#f2f2f0] shadow-[0_30px_64px_-30px_rgba(0,0,0,0.55)] transition-transform duration-[900ms] ease-out [transform:rotateY(-14deg)_rotateX(5deg)] group-hover/panel:[transform:rotateY(-7deg)_rotateX(2deg)] lg:left-[30px]">
          <Image
            src={`/images/services/${key}.webp`}
            alt={SERVICE_IMAGE_ALT[key] ?? service.title}
            fill
            sizes="(max-width: 639px) 360px, (max-width: 1023px) 400px, 440px"
            // The track is always moving, so a panel can be scrolled into view
            // by the animation rather than by the reader. Lazy loading reacts
            // to that too late and the artwork pops in grey; the few that are
            // on screen at rest are fetched up front instead.
            loading={!clone && index < 4 ? "eager" : "lazy"}
            className="object-cover object-left-top transition-transform duration-[900ms] ease-out group-hover/panel:scale-[1.04]"
          />
        </div>

        {/* One capability, floated over the artwork the way the reference
            floats its labels. It is the first entry of the list the service
            page already shows, so the panel and the page cannot disagree. */}
        {service.included[0] && (
          <span className="absolute bottom-[54px] left-[18px] z-10 max-w-[200px] truncate rounded-full border border-black/[0.06] bg-white/90 px-[14px] py-[8px] font-body text-[12px] leading-none tracking-[-0.16px] text-pure-black shadow-[0_10px_24px_-14px_rgba(0,0,0,0.5)] backdrop-blur-[6px]">
            {service.included[0]}
          </span>
        )}

        <span className="absolute bottom-[18px] right-[18px] z-10 flex size-[42px] items-center justify-center rounded-full bg-primary-green text-pure-black shadow-[0_12px_28px_-12px_rgba(0,0,0,0.55)] transition-transform duration-300 group-hover/panel:translate-x-[3px]">
          <svg width="16" height="16" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <path
              d="M3 7.5h9M8.4 3.6 12.3 7.5 8.4 11.4"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}

type ServicesProps = {
  /** Vertical rhythm differs between the home page and the services page. */
  spacingClassName?: string;
};

/**
 * What we build — the fifteen services, as one never-ending shelf.
 *
 * The track holds two identical sets and travels exactly one set's width, so
 * the second has already taken the first one's place by the time it snaps back
 * and the loop has no seam — at any width, with nothing measured and nothing
 * running on the main thread. It is the technique the contact ribbons use.
 *
 * It stops under the cursor. A row that keeps sliding while somebody is trying
 * to read a panel or aim at its link is a row that cannot be used, and that
 * pause is what turns the motion from decoration into something browsable.
 */
export default function Services({
  spacingClassName = "py-[80px] lg:pb-[160px] lg:pt-[180px]",
}: ServicesProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".services-meta", {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: reveal(sectionRef.current, { start: "top 90%" }),
      });

      gsap.from(".services-meta-rule", {
        scaleX: 0,
        duration: 1,
        ease: "power2.inOut",
        transformOrigin: "left center",
        scrollTrigger: reveal(sectionRef.current, { start: "top 90%" }),
      });

      gsap.from(".services-shelf", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: reveal(sectionRef.current, { start: "top 84%" }),
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} data-node-id="156:7010" className={`w-full bg-bg ${spacingClassName}`}>
      <div className="mx-auto flex w-full max-w-[1440px] flex-col px-6 lg:px-[40px]">
        <div className="flex w-full flex-col gap-[8px]">
          <div className="services-meta flex w-full items-center justify-between text-[18px] leading-[25.714px] text-black">
            {/* Carries the section heading so the panel titles below have a
                level to sit under on the services page, where no other h2
                precedes them. */}
            <h2 className="font-display font-medium">&copy;Services</h2>
            <p className="text-right font-body font-bold">
              {`//${String(SERVICES.length).padStart(3, "0")} Selected`}
            </p>
          </div>
          <div className="services-meta-rule h-px w-full bg-black/20" />
        </div>
      </div>

      {/* Full bleed, and on a ground a shade darker than the page: the panels
          are nearly white, and they only read as objects sitting on a surface
          if the surface is not the colour they are. */}
      <div className="services-shelf group/shelf mt-[36px] w-full overflow-hidden bg-[#f1efeb] py-[48px] lg:mt-[64px] lg:py-[64px]">
        <div className="flex w-max animate-[marquee_90s_linear_infinite] gap-[20px] will-change-transform group-hover/shelf:[animation-play-state:paused] motion-reduce:animate-none">
          {[false, true].map((clone) =>
            SERVICES.map((service, index) => (
              <Panel
                key={`${clone ? "clone" : "set"}-${service.slug}`}
                service={service}
                index={index}
                clone={clone}
              />
            )),
          )}
        </div>
      </div>
    </section>
  );
}
