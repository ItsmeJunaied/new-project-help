"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reveal } from "@/lib/anim";
import { siteConfig } from "@/lib/site";

/** What the office card lists under its address — all of it from the config. */
const MAP_FACTS = [
  `${siteConfig.address.locality} ${siteConfig.address.postalCode}`,
  siteConfig.address.countryName,
  "Visits by appointment",
];

/**
 * The office, on a map.
 *
 * This used to open with three thin cards repeating the email, the number and
 * the address, and then a dark band offering a call. Both now sit at the top
 * of the page as four routes a visitor picks between (see ContactPaths), where
 * somebody deciding how to get in touch will actually meet them — below the
 * form they were reassurance for people who had already scrolled past the
 * thing they reassure you about.
 *
 * What is left is the part that could not move: a company with a real address
 * is a different proposition from one with a contact form, and that is worth a
 * section of its own.
 */
export default function ContactChannels() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 88%" });

      gsap.from(".channel-card", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: trigger,
      });

      const mapTrigger = reveal(sectionRef.current?.querySelector(".channel-map") ?? null, {
        start: "top 90%",
      });

      gsap.from(".channel-map", {
        clipPath: "inset(0% 0% 100% 0%)",
        duration: 1,
        ease: "power3.out",
        scrollTrigger: mapTrigger,
      });

      // The card and the chips settle after the frame has finished opening, so
      // the map reads as the surface and they read as things resting on it.
      gsap.from(".map-chrome", {
        y: 16,
        opacity: 0,
        duration: 0.6,
        delay: 0.45,
        ease: "power2.out",
        stagger: 0.09,
        scrollTrigger: mapTrigger,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="w-full bg-bg px-6 pb-[80px] lg:px-[40px] lg:pb-[140px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[48px]">
        {/* The section now opens on its own title, because the three cards
            that used to introduce it have moved to the top of the page. */}
        <div className="channel-card flex w-full flex-col items-start gap-[18px] lg:flex-row lg:items-end lg:justify-between lg:gap-[70px]">
          <div className="flex flex-col gap-[14px] lg:max-w-[700px]">
            <p className="font-mono text-[11px] uppercase leading-none tracking-[0.2em] text-primary-green">
              Based in Dhaka
            </p>
            <h2 className="font-display text-[clamp(1.9rem,3.8vw,52px)] font-medium leading-[1.06] tracking-[-1.3px] text-black">
              Built in Bangladesh, delivered on your clock
            </h2>
          </div>

          <p className="max-w-[330px] font-body text-[14px] leading-[22px] tracking-[-0.1px] text-neutral-paragraph lg:pb-[6px] lg:text-right">
            One office, and clients who keep their own hours. The four-hour reply is
            counted in business hours here — the address below is a real one.
          </p>
        </div>

        {/* The record, on a rule under the title. Same figures the service
            pages quote; see SHARED_STATS in lib/services.ts. */}
        <dl className="channel-card grid w-full grid-cols-2 gap-x-[24px] gap-y-[28px] border-y border-black/10 py-[30px] lg:grid-cols-4">
          {[
            { value: "28+", label: "Systems delivered" },
            { value: "95%", label: "Client satisfaction" },
            { value: "99.9%", label: "Uptime after migration" },
            { value: "4h", label: "Reply, business hours" },
          ].map((fact) => (
            <div key={fact.label} className="flex flex-col gap-[8px]">
              <dt className="font-display text-[clamp(2rem,3.4vw,44px)] font-medium leading-none tracking-[-1.3px] text-black">
                {fact.value}
              </dt>
              <dd className="font-mono text-[10px] uppercase leading-[1.5] tracking-[0.18em] text-neutral-paragraph">
                {fact.label}
              </dd>
            </div>
          ))}
        </dl>

        {/* The office, framed rather than embedded.
            An iframe is a window onto somebody else's application: it brings
            its own controls, its own pin, and a scroll wheel that swallows the
            page. So it is used here as a photograph — inert, greyscaled, no
            pointer events — and everything a visitor can act on is ours and
            sits on top of it. The whole surface opens the real map, which is
            where panning and directions belong anyway.

            Our own marker stands on the centre point with its tip, covering
            Google's, so the map carries one pin rather than two.

            The card rides on the map from the small breakpoint up. On a phone
            it drops below and laps over the edge instead: Google serves phones
            a much larger map, and a card floating on that leaves a frame with
            no map left in it. */}
        <div className="relative w-full">
          <div className="channel-map relative isolate h-[320px] w-full overflow-hidden rounded-[24px] bg-[#0b0b0c] shadow-[0_50px_90px_-50px_rgba(0,0,0,0.55)] ring-1 ring-white/10 sm:h-[560px] sm:rounded-[28px] lg:h-[640px] lg:rounded-[36px]">
            <iframe
              src={siteConfig.mapEmbedSrc}
              title={`${siteConfig.name} office location on Google Maps`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              tabIndex={-1}
              aria-hidden
              className="pointer-events-none absolute inset-0 size-full scale-[1.06] border-0 brightness-[0.74] contrast-[0.86] grayscale invert hue-rotate-180"
            />

            {/* Corners pulled under and, on a wide frame, the left side taken
                down to black so the card has a ground of its own to sit on. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(125%_95%_at_50%_0%,transparent_34%,rgba(0,0,0,0.6)_100%)]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_top,rgba(5,5,6,0.96)_0%,rgba(5,5,6,0.45)_30%,transparent_58%)] lg:bg-[linear-gradient(102deg,rgba(5,5,6,0.96)_0%,rgba(5,5,6,0.55)_32%,transparent_60%)]"
            />

            {/* Google keeps a "view larger map" link in the top-left corner,
                right where this page puts its own label, and draws it several
                times larger for a phone. The corner is washed out so it holds
                one thing rather than two — the attribution at the foot of the
                map, which is theirs by right, is left alone. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(to_bottom,rgba(5,5,6,1)_0px,rgba(5,5,6,0.96)_48px,transparent_112px)] lg:bg-[radial-gradient(280px_150px_at_0%_0%,rgba(5,5,6,0.98)_0%,rgba(5,5,6,0.88)_45%,transparent_82%)]"
            />

            <a
              href={siteConfig.mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open the ${siteConfig.name} office in Google Maps`}
              className="absolute inset-0 z-20"
            />

            <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 z-10">
              <span
                className="absolute left-0 top-0 size-[150px] rounded-full bg-primary-green/35"
                style={{ animation: "map-ping 2.8s cubic-bezier(0, 0, 0.2, 1) infinite" }}
              />
              <span className="absolute left-0 top-0 size-[52px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-green/30" />
              <svg
                width="46"
                height="58"
                viewBox="0 0 46 58"
                fill="none"
                className="absolute left-0 top-0 -translate-x-1/2 -translate-y-full drop-shadow-[0_10px_18px_rgba(0,0,0,0.4)]"
              >
                <path
                  d="M23 56C23 56 43.5 34 43.5 21.5C43.5 10.2 34.3 1 23 1C11.7 1 2.5 10.2 2.5 21.5C2.5 34 23 56 23 56Z"
                  className="fill-primary-green"
                  stroke="#ffffff"
                  strokeWidth="3"
                />
                <circle cx="23" cy="21.5" r="7" fill="#ffffff" />
              </svg>
              <span className="absolute left-0 top-[16px] -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-[12px] py-[7px] font-mono text-[10px] uppercase leading-none tracking-[0.16em] text-ink shadow-[0_8px_20px_-8px_rgba(0,0,0,0.8)]">
                {siteConfig.name}
              </span>
            </div>

            <div className="map-chrome pointer-events-none absolute left-[16px] top-[16px] z-10 flex items-center gap-[8px] rounded-full bg-white/80 px-[14px] py-[9px] shadow-[0_10px_24px_-14px_rgba(0,0,0,0.6)] ring-1 ring-black/5 backdrop-blur-md lg:left-[28px] lg:top-[28px]">
              <span className="size-[7px] rounded-full bg-primary-green" />
              <span className="font-mono text-[11px] uppercase leading-none tracking-[0.16em] text-ink">
                Headquarters
              </span>
            </div>

            <a
              href={siteConfig.mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="map-chrome absolute right-[16px] top-[16px] z-30 hidden items-center gap-[8px] rounded-full bg-white/80 px-[16px] py-[10px] font-body text-[13px] font-medium leading-none tracking-[-0.1px] text-ink shadow-[0_10px_24px_-14px_rgba(0,0,0,0.6)] ring-1 ring-black/5 backdrop-blur-md transition-colors hover:bg-white lg:right-[28px] lg:top-[28px] lg:flex"
            >
              Open in Google Maps
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
                <path
                  d="M1.5 9.5L9.5 1.5M9.5 1.5H3.5M9.5 1.5V7.5"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            <div
              aria-hidden
              className="map-chrome pointer-events-none absolute bottom-[28px] right-[28px] z-10 hidden rounded-full bg-white/10 px-[14px] py-[9px] font-mono text-[11px] uppercase leading-none tracking-[0.16em] text-white/85 ring-1 ring-white/15 backdrop-blur-md lg:block"
            >
              23.7902° N · 90.4101° E
            </div>
          </div>

          <div className="map-chrome relative z-30 mx-[12px] -mt-[52px] overflow-hidden rounded-[22px] bg-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] ring-1 ring-black/5 sm:absolute sm:bottom-[28px] sm:left-[28px] sm:mx-0 sm:mt-0 sm:w-[340px] lg:w-[384px]">
            <div className="relative h-[120px] w-full sm:h-[136px] lg:h-[168px]">
              <Image
                src="/images/contact-desk.jpg"
                alt="The Project Help office in Banani, Dhaka"
                fill
                sizes="(min-width: 1024px) 384px, (min-width: 640px) 340px, 100vw"
                className="object-cover"
              />
              <span className="absolute right-[12px] top-[12px] rounded-full bg-white/90 px-[11px] py-[6px] font-mono text-[10px] uppercase leading-none tracking-[0.16em] text-ink backdrop-blur">
                Office
              </span>
            </div>

            <div className="flex flex-col gap-[12px] p-[18px] lg:p-[20px]">
              <p className="font-display text-[19px] font-medium leading-[1.25] tracking-[-0.3px] text-ink lg:text-[21px]">
                {siteConfig.name} HQ
              </p>

              <p className="flex items-start gap-[8px] font-body text-[13px] leading-[19px] tracking-[-0.1px] text-neutral-paragraph">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  aria-hidden
                  className="mt-[3px] shrink-0"
                >
                  <path
                    d="M6.5 12C6.5 12 11 7.6 11 5A4.5 4.5 0 0 0 2 5c0 2.6 4.5 7 4.5 7Z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                  />
                  <circle cx="6.5" cy="5" r="1.6" fill="currentColor" />
                </svg>
                {siteConfig.address.street}
              </p>

              <div className="flex flex-wrap gap-[6px]">
                {MAP_FACTS.map((fact) => (
                  <span
                    key={fact}
                    className="rounded-full bg-black/[0.055] px-[11px] py-[7px] font-body text-[12px] leading-none tracking-[-0.1px] text-ash-dark"
                  >
                    {fact}
                  </span>
                ))}
              </div>

              <a
                href={siteConfig.directionsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-[4px] flex items-center justify-center rounded-[100px] bg-primary-green px-[20px] py-[12px] font-body text-[14px] font-medium leading-none tracking-[-0.2px] text-white transition-opacity hover:opacity-90"
              >
                Get directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
