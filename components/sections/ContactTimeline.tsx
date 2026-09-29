"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";

/**
 * The concept's process block, to its own measurements: a rounded black slab
 * inset from the page edges rather than a full-bleed band, seven steps, and a
 * 56px circular node carrying the number at the head of each one.
 *
 * The concept draws the line between nodes into an SVG from JavaScript, sized
 * against the laid-out grid. This does it in CSS instead — a one-pixel span
 * whose long axis flips at the breakpoint, scaled on both axes so the same
 * element draws a horizontal rule between the circles on a desktop and a
 * vertical one down the gutter on a phone. Same picture, nothing to measure
 * and nothing to recompute on resize.
 *
 * The copy is ours; the shape is theirs.
 */

type Step = {
  when: string;
  title: string;
  body: string;
};

const STEPS: Step[] = [
  {
    when: "Hour 0",
    title: "Brief lands",
    body: "Form, email, WhatsApp or call — all four reach one inbox, read by the engineers who would run the build rather than by a sales desk.",
  },
  {
    when: "4 hours",
    title: "A human replies",
    body: "The engineer who picks it up answers by name, inside four business hours, with a question, a calendar link or a first number.",
  },
  {
    when: "Day 1–2",
    title: "Strategy call",
    body: "Free, thirty minutes, with the two projects closest to yours on screen. Some briefs are clear enough that we skip straight past it.",
  },
  {
    when: "Day 2–5",
    title: "Written quote",
    body: "Scope, timeline, price and the team assigned — in writing. If we cannot hit your window, this is where we say so.",
  },
  {
    when: "Week 1",
    title: "Kickoff",
    body: "The contract goes out the day you say yes, and kickoff follows inside 48 hours. Access, environments and the backlog are set up that week.",
  },
  {
    when: "Every 2 weeks",
    title: "Design & build",
    body: "Two-week cycles against the signed scope, each ending on something you can open. Weekly written updates and an open backlog throughout.",
  },
  {
    when: "Launch",
    title: "Delivery",
    body: "A rehearsed cutover with a way back, the source and the documentation handed over, and months of support rather than a goodbye email.",
  },
];

export default function ContactTimeline() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const trigger = reveal(sectionRef.current, { start: "top 80%" });

      gsap.from(".tl-head", {
        y: 24,
        opacity: 0,
        duration: 0.85,
        ease: "power2.out",
        scrollTrigger: trigger,
      });

      gsap.from(".tl-node", {
        scale: 0,
        duration: 0.5,
        ease: "back.out(2)",
        stagger: 0.08,
        delay: 0.2,
        scrollTrigger: trigger,
      });

      // fromTo rather than from, so the finished state is written down — a
      // `from` tween takes whatever it finds as its destination, which is fine
      // once and a trap on any replay.
      gsap.fromTo(
        ".tl-wire",
        { scaleX: 0, scaleY: 0 },
        {
          scaleX: 1,
          scaleY: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.08,
          delay: 0.26,
          transformOrigin: "left top",
          scrollTrigger: trigger,
        },
      );

      gsap.from(".tl-copy", {
        y: 18,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.08,
        delay: 0.3,
        scrollTrigger: trigger,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="mx-[8px] rounded-[clamp(24px,3vw,40px)] bg-black text-bg lg:mx-[16px]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 py-[72px] lg:px-[40px] lg:py-[128px]">
        <div className="tl-head grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-end gap-x-[64px] gap-y-[24px] pb-[48px] lg:pb-[88px]">
          <div className="flex flex-col gap-[20px]">
            <span className="flex items-center gap-[10px] font-mono text-[12px] uppercase leading-none tracking-[0.08em] text-white/55">
              <span aria-hidden className="h-[2px] w-[24px] shrink-0 bg-primary-green" />
              From first message to launch
            </span>
            <h2 className="font-display text-[clamp(40px,5vw,72px)] font-semibold leading-[0.98] tracking-[-0.05em] text-balance text-bg">
              Your project,{" "}
              <span className="font-serif font-normal italic tracking-[-0.02em] text-primary-green">
                start to finish
              </span>
            </h2>
          </div>

          <p className="m-0 max-w-[500px] font-body text-[18px] leading-[1.55] tracking-[-0.1px] text-pretty text-white/55">
            Seven steps, each with an owner and a deadline. You always know who has your
            project and what happens next.
          </p>
        </div>

        {/* Four across on a wide screen, then two, then one — the concept's
            grid reflows the same way. */}
        <ol className="relative grid w-full list-none grid-cols-1 gap-x-[24px] gap-y-[36px] p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-[64px]">
          {STEPS.map((step, index) => {
            // No wire off the last node in a row, or off the last node.
            const last = index === STEPS.length - 1;
            const endsRow = (index + 1) % 4 === 0;

            return (
              <li key={step.title} className="relative flex gap-[24px]">
                {!last && !endsRow ? (
                  <span
                    aria-hidden
                    className="tl-wire absolute left-[28px] top-[64px] hidden h-px w-px bg-white/15 lg:left-[56px] lg:top-[28px] lg:block lg:h-px lg:w-[calc(100%-32px)]"
                  />
                ) : null}

                <span
                  aria-hidden
                  className="tl-node flex size-[56px] shrink-0 items-center justify-center rounded-full border border-white/15 bg-[#141413] font-mono text-[12px] leading-none tracking-[0.08em] text-white/55"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="tl-copy flex flex-col gap-[10px] pr-[12px]">
                  <span className="font-mono text-[11px] uppercase leading-none tracking-[0.08em] text-primary-green">
                    {step.when}
                  </span>
                  <h3 className="m-0 font-display text-[20px] font-semibold leading-[1.2] tracking-[-0.02em] text-bg">
                    {step.title}
                  </h3>
                  <p className="m-0 font-body text-[14px] leading-[1.55] tracking-[-0.1px] text-pretty text-white/55">
                    {step.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
