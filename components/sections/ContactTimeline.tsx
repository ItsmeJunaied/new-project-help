"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";

/**
 * What happens to a brief after it is sent, hour by hour.
 *
 * Drawn as a ledger rather than as a row of cards: five full-width rows on
 * hairlines, a large ghosted numeral in the margin, the clock in its own
 * column and the outcome ranged right. Cards in a grid are what every agency
 * template does with a process, and they force five paragraphs into five
 * identical boxes whether or not they are the same size. Rows do not, they
 * read left to right the way a sentence does, and they give the page a spine.
 *
 * The times are the commitment, not an average. Four business hours is the
 * figure quoted everywhere else on the site and the rest hang off it.
 */

type Stop = {
  /** Where this sits on the clock, counting from the brief landing. */
  when: string;
  title: string;
  body: string;
  /** What exists at the end of this step that did not before. */
  output: string;
};

const STOPS: Stop[] = [
  {
    when: "Hour 0",
    title: "It lands with an engineer",
    body: "Straight to the people who would run the build — not into a shared sales inbox that gets triaged on Monday morning.",
    output: "Read, not queued",
  },
  {
    when: "4 hours",
    title: "A written reply",
    body: "From a named person. Either the questions we need answered, or a time to talk, or — if we are not the right people for it — who is.",
    output: "A human answer",
  },
  {
    when: "Day 1–2",
    title: "A call, if you want one",
    body: "Thirty minutes to walk through the problem. Most briefs want one; some are clear enough that we go straight to the scope.",
    output: "Shared understanding",
  },
  {
    when: "Day 2–5",
    title: "Scope and a fixed estimate",
    body: "In writing: what gets built, in what order, by when and for how much — with the two projects in our work closest to yours.",
    output: "A real number",
  },
  {
    when: "Week 1–2",
    title: "Contract and kickoff",
    body: "If it is a fit. The engineers in the kickoff call are the ones who write the code, which is the whole reason the first reply came from one of them.",
    output: "Work starts",
  },
];

/** The record, closing the section — the same figures the service pages quote. */
const FACTS = [
  { value: "28+", label: "Systems delivered" },
  { value: "95%", label: "Client satisfaction" },
  { value: "99.9%", label: "Uptime after migration" },
  { value: "4h", label: "Reply, business hours" },
];

export default function ContactTimeline() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const trigger = reveal(sectionRef.current, { start: "top 78%" });

      gsap.from(".tl-head", {
        y: 24,
        opacity: 0,
        duration: 0.85,
        ease: "power2.out",
        scrollTrigger: trigger,
      });

      // Each row wipes in from its own left rule, so the section builds
      // downward like something being written rather than popping in as a set.
      gsap.from(".tl-row", {
        y: 26,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.1,
        delay: 0.15,
        scrollTrigger: trigger,
      });

      gsap.fromTo(
        ".tl-rule",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.9,
          ease: "power2.inOut",
          stagger: 0.1,
          delay: 0.1,
          transformOrigin: "left center",
          scrollTrigger: trigger,
        },
      );

      gsap.from(".tl-fact", {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: reveal(sectionRef.current?.querySelector(".tl-facts") ?? null, {
          start: "top 90%",
        }),
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#111] px-6 py-[80px] lg:px-[40px] lg:py-[130px]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col">
        <div className="tl-head flex w-full flex-col items-start gap-[20px] lg:flex-row lg:items-end lg:justify-between lg:gap-[80px]">
          <div className="flex flex-col gap-[16px] lg:max-w-[720px]">
            <p className="font-mono text-[11px] uppercase leading-none tracking-[0.2em] text-primary-green">
              After you hit send
            </p>
            <h2 className="font-display text-[clamp(2rem,4.2vw,60px)] font-medium leading-[1.06] tracking-[-1.5px] text-white">
              From your brief to a real number
            </h2>
          </div>

          <p className="max-w-[360px] font-body text-[15px] leading-[23px] tracking-[-0.1px] text-white/45 lg:pb-[8px] lg:text-right">
            Five steps with a time against each. The first one is a commitment rather than
            an average.
          </p>
        </div>

        {/* The ledger. Grid rather than flex, so the clock column and the
            outcome column line up down the whole section — which is the only
            reason rows beat cards here. */}
        <ol className="mt-[52px] flex w-full flex-col lg:mt-[76px]">
          {STOPS.map((stop, index) => (
            <li key={stop.when} className="group relative w-full">
              <span
                aria-hidden
                className="tl-rule block h-px w-full bg-white/15"
              />

              <div className="tl-row grid w-full grid-cols-1 gap-x-[32px] gap-y-[12px] py-[28px] transition-colors duration-500 lg:grid-cols-[64px_128px_1fr_190px] lg:items-baseline lg:py-[34px]">
                <span className="font-display text-[34px] font-medium leading-none tracking-[-1px] text-white/15 transition-colors duration-500 group-hover:text-primary-green lg:text-[40px]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="font-mono text-[11px] uppercase leading-none tracking-[0.18em] text-primary-green">
                  {stop.when}
                </span>

                <div className="flex flex-col gap-[10px] lg:max-w-[560px]">
                  <h3 className="font-display text-[22px] font-medium leading-[1.15] tracking-[-0.45px] text-white lg:text-[26px]">
                    {stop.title}
                  </h3>
                  <p className="font-body text-[14px] leading-[22px] tracking-[-0.1px] text-white/45">
                    {stop.body}
                  </p>
                </div>

                <span className="flex items-center gap-[8px] font-mono text-[11px] uppercase leading-none tracking-[0.14em] text-white/70 lg:justify-end">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path
                      d="M2 6.4 4.6 9 10 3.2"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary-green"
                    />
                  </svg>
                  {stop.output}
                </span>
              </div>
            </li>
          ))}

          <li aria-hidden className="tl-rule h-px w-full bg-white/15" />
        </ol>

        {/* The record, ranged across the foot of the section. */}
        <dl className="tl-facts mt-[56px] grid w-full grid-cols-2 gap-x-[24px] gap-y-[32px] lg:mt-[80px] lg:grid-cols-4">
          {FACTS.map((fact) => (
            <div key={fact.label} className="tl-fact flex flex-col gap-[8px]">
              <dt className="font-display text-[clamp(2.25rem,3.6vw,48px)] font-medium leading-none tracking-[-1.4px] text-white">
                {fact.value}
              </dt>
              <dd className="font-mono text-[10px] uppercase leading-[1.5] tracking-[0.18em] text-white/35">
                {fact.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
