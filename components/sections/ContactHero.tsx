"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/anim";
import { HEADLINE_SERVICES } from "@/lib/services";

/**
 * The v1 hero: a centred headline, a 124px round call to action, and two
 * marquee rows running in opposite directions underneath it.
 *
 * The concept drives its marquees from JavaScript, measuring the track and
 * stepping a transform every frame. These run on a CSS keyframe over a track
 * printed twice, so the loop is seamless at any width with nothing measured
 * and nothing running on the main thread — and it stops dead for anyone who
 * has asked for reduced motion, which a JS transform loop would not.
 */

/** Top row: what we build. Bottom row: what you get for sending a brief. */
const ROW_ONE = HEADLINE_SERVICES.map((service) => service.title);

const ROW_TWO = [
  "An engineer reads every brief",
  "NDA signed the same day you ask",
  "A real number, never “starting from”",
  "No bots, no auto-replies",
];

function Marquee({
  items,
  reverse = false,
}: {
  items: string[];
  reverse?: boolean;
}) {
  // Printed twice: the animation travels exactly one copy's width, so the
  // second copy is already in place when it snaps back.
  const track = [...items, ...items];

  return (
    <div className="overflow-hidden border-t border-black/15 py-[18px]">
      <div
        className={`flex w-max items-center gap-[28px] ${
          reverse ? "animate-[marquee-reverse_38s_linear_infinite]" : "animate-[marquee_38s_linear_infinite]"
        } motion-reduce:animate-none`}
      >
        {track.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-[28px]">
            <span className="whitespace-nowrap font-display text-[clamp(22px,2.6vw,36px)] font-medium tracking-[-0.035em] text-neutral-paragraph">
              {item}
            </span>
            <span aria-hidden className="text-[clamp(20px,2.2vw,30px)] leading-none text-primary-green">
              ✳
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ContactHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(".ch-eyebrow", {
        y: 16,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        delay: 0.1,
      });

      gsap.from(".ch-line", {
        yPercent: 110,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.15,
      });

      gsap.from(".ch-disc", {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.6)",
        delay: 0.55,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-bg pt-[56px] lg:pt-[96px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-[32px] px-6 text-center lg:px-[40px]">
        <span className="ch-eyebrow inline-flex items-center gap-[10px] rounded-full border border-black/10 bg-white py-[8px] pl-[10px] pr-[14px]">
          <span className="size-[8px] shrink-0 rounded-full bg-primary-green shadow-[0_0_0_4px_color-mix(in_srgb,var(--color-primary-green)_22%,transparent)]" />
          <span className="font-body text-[13px] font-medium leading-none tracking-[-0.1px] text-black">
            Reply within 4 business hours
          </span>
        </span>

        {/* The mask each line rises out of crops anything below the line box,
            and at this size the italic descenders fall well below it — so the
            inner span carries bottom padding and the mask takes the same
            amount back off its own height. */}
        <h1 className="font-display text-[clamp(52px,7vw,108px)] font-semibold leading-[0.94] tracking-[-0.055em] text-balance text-black">
          <span className="block -mb-[0.16em] overflow-hidden">
            <span className="ch-line block pb-[0.16em]">Send the brief.</span>
          </span>
          <span className="block -mb-[0.16em] overflow-hidden">
            <span className="ch-line block pb-[0.16em] font-serif font-normal italic tracking-[-0.02em]">
              We read it first
            </span>
          </span>
        </h1>

        <a
          href="#brief"
          className="ch-disc group flex size-[124px] flex-col items-center justify-center gap-[6px] rounded-full bg-black text-bg transition-colors duration-300 hover:bg-primary-green hover:text-white"
        >
          <span className="font-mono text-[11px] uppercase leading-[1.3] tracking-[0.08em]">
            I&rsquo;m ready
            <br />
            to talk
          </span>
          <span
            aria-hidden
            className="text-[18px] leading-none text-primary-green transition-colors duration-300 group-hover:text-white"
          >
            ↗
          </span>
        </a>
      </div>

      <div className="mt-[48px] flex flex-col lg:mt-[72px]">
        <Marquee items={ROW_ONE} />
        <Marquee items={ROW_TWO} reverse />
      </div>
    </section>
  );
}
