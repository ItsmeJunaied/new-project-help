"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/anim";

/**
 * The concept's Hero header, to its own measurements.
 *
 * Two columns on an auto-fit grid that breaks at 440px, aligned to their
 * bottom edges: the status pill and the headline on the left, the standfirst
 * on the right capped at 480px. The section's own bottom padding belongs to
 * the brief tray that follows, so this one stops at the header's
 * `clamp(36px,4vw,56px)` and ContactDetails carries the rest — together they
 * reproduce the single section the concept draws.
 *
 * The headline is not masked. The concept does not mask it either, and at this
 * size the italic descenders of the serif half fall well outside the line box,
 * so a mask would clip them; it settles on opacity and y instead.
 */
export default function ContactHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(".ch-pill", {
        y: 14,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.05,
      });

      gsap.from(".ch-title", {
        y: 26,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.12,
      });

      gsap.from(".ch-lede", {
        y: 18,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.26,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="mx-auto w-full max-w-[1360px] px-[clamp(20px,4vw,48px)] pb-[clamp(36px,4vw,56px)] pt-[clamp(48px,6vw,88px)]"
    >
      <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-end gap-x-[64px] gap-y-[24px]">
        <div className="flex flex-col items-start gap-[24px]">
          <span className="ch-pill inline-flex items-center gap-[10px] rounded-full border border-black/12 bg-white py-[8px] pl-[10px] pr-[14px] font-body text-[13px] font-medium leading-none tracking-[-0.1px] text-black">
            <span
              aria-hidden
              className="size-[8px] shrink-0 rounded-full bg-primary-green shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-primary-green)_22%,transparent)]"
            />
            REPLY WITHIN 4 BUSINESS HOURS
          </span>

          <h1 className="ch-title m-0 font-display text-[clamp(48px,6.4vw,96px)] font-semibold leading-[0.94] tracking-[-0.055em] text-balance text-black">
            Tell us what{" "}
            <span className="font-serif font-normal italic tracking-[-0.02em]">
              you&rsquo;re building
            </span>
          </h1>
        </div>

        <p className="ch-lede m-0 max-w-[480px] font-body text-[18px] leading-[1.55] tracking-[-0.1px] text-pretty text-neutral-paragraph">
          An engineer reads every brief and replies within four business hours with a real
          number and the two projects closest to your scope.
        </p>
      </div>
    </section>
  );
}
