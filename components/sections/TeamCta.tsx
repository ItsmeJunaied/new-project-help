"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { countUp, prefersReducedMotion, reveal } from "@/lib/anim";
import ParallaxImage from "@/components/ui/ParallaxImage";

// The strip is 11 cards wide (2200px) and centred, so it bleeds past both edges
// exactly as it does in the design. The first and last cells are intentionally
// empty, so the row fades into the page rather than ending on a hard edge.
const SECTORS: (string | null)[] = [
  null,
  "eCommerce & Retail",
  "Health Tech",
  "Manufacturing",
  "Logistics",
  "Hospitality",
  "Education",
  "Fintech",
  "Real Estate",
  "SaaS & B2B",
  null,
];

const TEAM_STATS = [
  { value: 12, label: "Software engineers" },
  { value: 7, label: "DevOps & cloud specialists" },
  { value: 6, label: "Designers, QA & delivery" },
];

export default function TeamCta() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const strip = sectionRef.current?.querySelector(".cta-brand-strip") ?? null;

      gsap.from(".cta-brand-card", {
        opacity: 0,
        y: 16,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.05,
        scrollTrigger: reveal(strip, { start: "top 92%" }),
      });

      const holder = sectionRef.current?.querySelector(".cta-holder") ?? null;
      const trigger = reveal(holder, { start: "top 78%" });

      gsap.from(".cta-reveal", {
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: trigger,
      });

      gsap.from(".cta-divider", {
        scaleX: 0,
        duration: 1,
        ease: "power2.inOut",
        transformOrigin: "left center",
        scrollTrigger: trigger,
      });

      // Head-count figures tick up rather than appearing already counted.
      gsap.utils.toArray<HTMLElement>(".cta-stat-value").forEach((el) => {
        countUp(el, Number(el.dataset.value ?? "0"), reveal(holder, { start: "top 78%" }), 1.4);
      });

      if (prefersReducedMotion()) return;

      // The brand strip slides slowly across as the section scrolls past it.
      gsap.to(".cta-brand-row", {
        xPercent: -4,
        ease: "none",
        scrollTrigger: {
          trigger: strip,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.7,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} data-node-id="156:7664" className="w-full bg-bg pt-[24px]">
      <div className="cta-brand-strip w-full overflow-hidden border-t border-[#e6e9dd] px-6 py-[28px] lg:hidden">
        <ul className="flex flex-wrap items-center justify-center gap-x-[20px] gap-y-[12px]">
          {SECTORS.filter(Boolean).map((sector) => (
            <li
              key={sector}
              className="cta-brand-card font-display text-[15px] font-medium leading-[1.25] tracking-[-0.25px] text-ash-dark"
            >
              {sector}
            </li>
          ))}
        </ul>
      </div>

      <div className="cta-brand-strip hidden h-[110px] w-full overflow-hidden lg:block">
        <div className="cta-brand-row mx-auto flex w-[2200px] items-start">
          {SECTORS.map((sector, i) => (
            <div
              key={`${sector ?? "empty"}-${i}`}
              className="cta-brand-card flex h-[110px] w-[200px] shrink-0 items-center justify-center border-r border-t border-[#e6e9dd] px-[16px]"
            >
              {sector && (
                <span className="text-center font-display text-[16px] font-medium leading-[1.25] tracking-[-0.25px] text-ash-dark">
                  {sector}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="cta-holder relative flex w-full flex-col items-start justify-end overflow-hidden px-6 py-[64px] lg:h-[874px] lg:px-[40px] lg:py-[100px]">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[#111]" />
          {/* The export is the uncropped portrait original, so anchoring it to
              the top of this landscape band shows only the wall above the team.
              45% lands the crop on them, the way the design frames it. */}
          <ParallaxImage
            src="/images/cta-team-meeting.webp"
            alt=""
            sizes="100vw"
            className="absolute inset-0"
            imageClassName="object-[center_45%]"
          />
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(17,17,17,0) 81%, rgb(17,17,17) 93%), linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 35%)",
            }}
          />
        </div>

        <div className="relative mx-auto flex w-full max-w-[1440px] flex-col items-start gap-[48px] lg:px-[72px]">
          <div className="flex w-full flex-col items-start gap-[48px]">
            <div className="flex w-full flex-col items-start justify-between gap-3 font-body text-[18px] font-medium tracking-[-0.25px] sm:flex-row sm:items-start">
              <p className="cta-reveal leading-[27px] text-white">
                The engineers who will actually build your system
              </p>
              <p className="cta-reveal leading-[18px] text-ash-muted">[ OUR TEAM ]</p>
            </div>
            <div className="cta-divider h-px w-full bg-[#c0c0c0]" />
          </div>

          <div className="flex w-full flex-col items-start justify-between gap-10 lg:flex-row lg:items-center">
            <div className="flex flex-wrap items-start gap-[16px]">
              {TEAM_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="cta-reveal flex flex-col items-start gap-[12px] border-b border-[#313131] pb-[12px]"
                >
                  <span
                    data-value={stat.value}
                    className="cta-stat-value font-display text-[clamp(3rem,5.5vw,80px)] leading-[80px] tracking-[-4px] tabular-nums text-white"
                  >
                    {stat.value}
                  </span>
                  <span className="font-body text-[18px] font-medium leading-[27px] tracking-[-0.25px] text-ash-muted lg:min-w-[250px]">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="cta-reveal flex shrink-0 items-center justify-center gap-[8px] rounded-[1000px] border border-[#767676] px-[32px] py-[16px] transition-colors hover:border-white"
            >
              <span className="font-body text-[18px] font-medium leading-[27px] tracking-[-0.25px] text-white">
                Meet our team
              </span>
              <span className="relative size-[22px] shrink-0">
                <Image
                  src="/icons/icon-faq-button-plus.svg"
                  alt=""
                  fill
                  className="object-contain"
                />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
