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

/**
 * A mark for each ribbon item, and a sparkle between them.
 *
 * The concept separates its ribbon items with a typographic asterisk, which at
 * 36px is whatever glyph the font happens to have. These are drawn instead: a
 * four-point sparkle for the separator, and one line mark per item so the top
 * row says what each service IS at a glance rather than only naming it. Same
 * 24-unit box and stroke weight as the process marks, so the two sets are
 * obviously the same family.
 */
const SPARKLE = (
  <svg viewBox="0 0 24 24" aria-hidden className="size-[0.74em] shrink-0">
    <path
      d="M12 2c.5 5.2 4.3 9 9.5 9.5C16.3 12 12.5 15.8 12 21c-.5-5.2-4.3-9-9.5-9.5C7.7 11 11.5 7.2 12 2Z"
      fill="currentColor"
    />
  </svg>
);

/** Keyed by the words in the item, so a reordered list keeps its marks. */
const RIBBON_MARKS: { match: RegExp; path: React.ReactNode }[] = [
  { match: /saas/i, path: <><path d="M4 7.5h16v11H4z" /><path d="M4 11h16M8 15h5" /></> },
  { match: /commerce|shop/i, path: <><path d="M4 6h2.2l2 10.5h9.6L20 9H7" /><circle cx="9.5" cy="20" r="1.4" /><circle cx="17" cy="20" r="1.4" /></> },
  { match: /devops|cloud/i, path: <><path d="M7.5 18a4 4 0 0 1-.4-8 5.5 5.5 0 0 1 10.6 1.4A3.6 3.6 0 0 1 17 18Z" /><path d="M12 15.5v-5m0 0-1.8 1.8M12 10.5l1.8 1.8" /></> },
  { match: /ai|machine|data/i, path: <><circle cx="12" cy="12" r="3" /><path d="M12 4v5M12 15v5M4 12h5M15 12h5M6.7 6.7l3 3M14.3 14.3l3 3M17.3 6.7l-3 3M9.7 14.3l-3 3" /></> },
  { match: /mobile|app/i, path: <><rect x="7" y="3" width="10" height="18" rx="2.4" /><path d="M11 18h2" /></> },
  { match: /security|cyber/i, path: <><path d="M12 3.2 19 6v6c0 4.2-3 7.4-7 8.8-4-1.4-7-4.6-7-8.8V6Z" /><path d="m9.3 12 2 2 3.4-3.6" /></> },
  { match: /consult|strategy/i, path: <><path d="M4 19V9m5 10V5m5 14v-7m5 7V7" /></> },
  { match: /engineer|brief/i, path: <><path d="M6 3.5h7.5L19 9v11.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" /><path d="M13.5 3.5V9H19M8.5 13.5h7M8.5 17h4" /></> },
  { match: /nda|sign/i, path: <><path d="M4 18.5c2.5.6 4-3.5 6-3.5s2 3 4 3 4.5-2.5 6-5.5" /><path d="M7 14c2-3.5 4.5-8 7.5-8.8 1.4-.4 2.5.7 2 2C15.8 10.4 10.5 13 7 14Z" /></> },
  { match: /number|price|quote|starting/i, path: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.2v9.6M14.6 9.4c-.6-.8-1.6-1.2-2.8-1.2-1.6 0-2.7.8-2.7 2 0 2.8 5.5 1.4 5.5 4.2 0 1.3-1.2 2.1-2.8 2.1-1.3 0-2.4-.5-3-1.4" /></> },
  { match: /bot|auto-repl|chatbot/i, path: <><rect x="4" y="8" width="16" height="11" rx="3" /><path d="M12 8V4.5M8.5 13v1.5M15.5 13v1.5" /><circle cx="12" cy="3.6" r="1.2" /></> },
];

function RibbonMark({ label }: { label: string }) {
  const found = RIBBON_MARKS.find((mark) => mark.match.test(label));
  if (!found) return null;

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="size-[0.86em] shrink-0 opacity-70"
    >
      {found.path}
    </svg>
  );
}

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
              className={`flex items-center gap-[14px] whitespace-nowrap font-display text-[clamp(22px,2.6vw,36px)] font-medium tracking-[-0.035em] ${
                dim ? "text-neutral-paragraph" : "text-black"
              }`}
            >
              <RibbonMark label={item} />
              {item}
            </span>
            <span
              aria-hidden
              className="flex items-center text-[clamp(20px,2.2vw,30px)] leading-none text-primary-green"
            >
              {SPARKLE}
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
