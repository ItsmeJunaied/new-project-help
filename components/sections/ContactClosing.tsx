"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/anim";
import { PROMISE_LINES } from "@/components/sections/ContactDetails";
import { HEADLINE_SERVICES } from "@/lib/services";

/**
 * The concept's closing block, to its own measurements: a centred headline, a
 * 128px round button back up to the form, two ribbons running in opposite
 * directions, and the word CONTACT set at a fifth of the viewport with a green
 * disc behind its right shoulder.
 *
 * The concept drives its ribbons from JavaScript, measuring each track and
 * stepping a transform every frame. These run on a CSS keyframe over a track
 * printed twice, so the loop is seamless at any width with nothing measured
 * and nothing running on the main thread — and it stops dead for a visitor who
 * has asked for reduced motion, which a transform loop would not.
 */

const ROW_ONE = HEADLINE_SERVICES.map((service) => service.title);

function Marquee({
  items,
  reverse = false,
  dim = false,
  bottomRule = false,
}: {
  items: string[];
  reverse?: boolean;
  /** The concept's top row is set in the muted grey, the bottom one in ink. */
  dim?: boolean;
  bottomRule?: boolean;
}) {
  // Printed twice: the animation travels exactly one copy's width, so the
  // second copy is already in place when it snaps back.
  const track = [...items, ...items];

  return (
    <div
      className={`overflow-hidden border-t border-black/15 py-[18px] ${
        bottomRule ? "border-b" : ""
      }`}
    >
      <div
        className={`flex w-max items-center gap-[28px] will-change-transform motion-reduce:animate-none ${
          reverse
            ? "animate-[marquee-reverse_38s_linear_infinite]"
            : "animate-[marquee_38s_linear_infinite]"
        }`}
      >
        {track.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-[28px]">
            <span
              className={`whitespace-nowrap font-display text-[clamp(22px,2.6vw,36px)] font-medium tracking-[-0.035em] ${
                dim ? "text-neutral-paragraph" : "text-black"
              }`}
            >
              {item}
            </span>
            <span
              aria-hidden
              className="text-[clamp(20px,2.2vw,30px)] leading-none text-primary-green"
            >
              ✳
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function ContactClosing() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.from(".cc-title", {
        y: 28,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
      });

      gsap.from(".cc-disc", {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.6)",
        delay: 0.18,
        scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden pt-[clamp(24px,4vw,48px)]"
    >
      <div className="mx-auto flex w-full max-w-[1360px] flex-col items-center gap-[32px] px-[clamp(20px,4vw,48px)] text-center">
        <h2 className="cc-title m-0 font-display text-[clamp(52px,7vw,108px)] font-semibold leading-[0.94] tracking-[-0.055em] text-balance text-black">
          Send the brief.
          <br />
          <span className="font-serif font-normal italic tracking-[-0.02em]">
            We read it first
          </span>
        </h2>

        <a
          href="#brief"
          className="cc-disc group flex size-[128px] flex-col items-center justify-center gap-[6px] rounded-full bg-black text-bg transition-colors duration-200 hover:bg-primary-green hover:text-black"
        >
          <span className="font-mono text-[11px] uppercase leading-[1.3] tracking-[0.08em]">
            I&rsquo;m ready
            <br />
            to talk
          </span>
          <span
            aria-hidden
            className="text-[18px] leading-none text-primary-green transition-colors duration-200 group-hover:text-black"
          >
            ↑
          </span>
        </a>
      </div>

      <div className="mt-[clamp(48px,6vw,72px)] flex flex-col">
        <Marquee items={ROW_ONE} dim />
        <Marquee items={PROMISE_LINES} reverse bottomRule />
      </div>

      {/* The wordmark, with the disc behind its right shoulder. The negative
          bottom margin is the concept's: it pulls the next section up into the
          slab's own descender space so the letterforms sit on the seam. */}
      <div className="relative mx-auto w-full max-w-[1360px] px-[clamp(12px,2vw,24px)] pt-[clamp(40px,5vw,64px)]">
        <span
          aria-hidden
          className="absolute right-[clamp(24px,13%,180px)] top-[clamp(16px,2vw,32px)] aspect-square w-[clamp(120px,24vw,340px)] rounded-full bg-primary-green"
        />
        <div
          aria-hidden
          className="relative -mb-[0.12em] select-none text-center font-display text-[clamp(84px,20.5vw,292px)] font-bold leading-[0.8] tracking-[-0.075em] text-black"
        >
          CONTACT
        </div>
      </div>
    </section>
  );
}
