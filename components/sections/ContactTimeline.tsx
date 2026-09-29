"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";

/**
 * What happens to a brief after it is sent, hour by hour.
 *
 * This was three steps in the margin beside the form, which is the one place a
 * promise about replying is no use: you read it while you are already writing.
 * Moved ahead of the form and given the clock, it answers the question that
 * actually stops people from starting — how long am I going to be waiting, and
 * for what.
 *
 * The times are the commitment, not an average. Four business hours is the one
 * quoted everywhere else on the site, and the rest hang off it.
 */

type Stop = {
  /** Where this sits on the clock, counting from the brief landing. */
  when: string;
  title: string;
  body: string;
  /** The thing that exists at the end of this step that did not before. */
  output: string;
};

const STOPS: Stop[] = [
  {
    when: "Hour 0",
    title: "It lands with an engineer",
    body: "Straight to the people who would run the build, not into a shared sales inbox that gets triaged on Monday.",
    output: "Read, not queued",
  },
  {
    when: "4 hours",
    title: "A written reply",
    body: "From a named person, inside four business hours. Either the questions we need answered, or a time to talk, or — if we are not the right people — who is.",
    output: "A human answer",
  },
  {
    when: "Day 1–2",
    title: "A call, if you want one",
    body: "Thirty minutes to walk through the problem. Most briefs need one; some are clear enough that we skip straight to the scope.",
    output: "Shared understanding",
  },
  {
    when: "Day 2–5",
    title: "Scope and a fixed estimate",
    body: "In writing: what gets built, in what order, by when, for how much — with the two projects in our work closest to yours.",
    output: "A real number",
  },
  {
    when: "Week 1–2",
    title: "Contract and kickoff",
    body: "If it is a fit. The engineers in the kickoff call are the ones who write the code, which is the whole reason the reply came from one of them.",
    output: "Work starts",
  },
];

export default function ContactTimeline() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const trigger = reveal(sectionRef.current, { start: "top 82%" });

      gsap.from(".tl-head", {
        y: 22,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: trigger,
      });

      // Same one-pixel connector as the service pages' project track: it runs
      // down the gutter on a phone and across between the dots from lg up, so
      // both axes are scaled and whichever one is a hairline stays invisible.
      // fromTo rather than from, so the finished state is written down.
      gsap.fromTo(
        ".tl-link",
        { scaleX: 0, scaleY: 0 },
        {
          scaleX: 1,
          scaleY: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.11,
          delay: 0.25,
          transformOrigin: "left top",
          scrollTrigger: trigger,
        },
      );

      gsap.from(".tl-dot", {
        scale: 0,
        duration: 0.45,
        ease: "back.out(2)",
        stagger: 0.11,
        delay: 0.25,
        scrollTrigger: trigger,
      });

      gsap.from(".tl-card", {
        y: 20,
        opacity: 0,
        duration: 0.55,
        ease: "power2.out",
        stagger: 0.11,
        delay: 0.33,
        scrollTrigger: trigger,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#111] px-6 py-[72px] lg:px-[40px] lg:py-[110px]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col">
        <div className="tl-head flex w-full flex-col gap-[14px] lg:max-w-[820px]">
          <p className="font-body text-[14px] font-medium uppercase leading-[1.2] tracking-[0.5px] text-primary-green">
            [ After you hit send ]
          </p>
          <h2 className="font-display text-[clamp(2rem,4vw,56px)] font-medium leading-[1.08] tracking-[-1.5px] text-white">
            From your brief to a real number
          </h2>
          <p className="font-display text-[19px] leading-[1.35] tracking-[-0.25px] text-white/55">
            Five steps, each with a time against it. The first one is a commitment, not an
            average.
          </p>
        </div>

        <ol className="mt-[42px] grid w-full grid-cols-1 gap-y-[30px] lg:mt-[64px] lg:grid-cols-5 lg:gap-x-[20px] lg:gap-y-0">
          {STOPS.map((stop, index) => {
            const last = index === STOPS.length - 1;

            return (
              <li key={stop.when} className="relative flex flex-col pl-[44px] lg:pl-0">
                {!last && (
                  <span
                    aria-hidden
                    className="tl-link absolute -bottom-[38px] left-[15px] top-[42px] w-px bg-white/20 lg:bottom-auto lg:left-[36px] lg:-right-[20px] lg:top-[15px] lg:h-px lg:w-auto"
                  />
                )}

                <span
                  aria-hidden
                  className="tl-dot absolute left-0 top-[8px] flex size-[32px] items-center justify-center rounded-full bg-primary-green font-mono text-[12px] font-medium leading-none text-white shadow-[0_8px_20px_-10px_color-mix(in_srgb,var(--color-primary-green)_90%,transparent)] lg:static lg:top-auto"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="tl-card flex flex-col gap-[10px] lg:mt-[24px] lg:pr-[20px]">
                  <span className="w-fit rounded-full bg-white/[0.08] px-[11px] py-[6px] font-mono text-[11px] uppercase leading-none tracking-[0.14em] text-primary-green ring-1 ring-white/10">
                    {stop.when}
                  </span>

                  <h3 className="font-display text-[21px] font-medium leading-[1.2] tracking-[-0.4px] text-white">
                    {stop.title}
                  </h3>

                  <p className="font-body text-[14px] leading-[21px] tracking-[-0.1px] text-white/55">
                    {stop.body}
                  </p>

                  <p className="mt-[2px] flex items-center gap-[7px] font-body text-[13px] font-medium leading-none tracking-[-0.1px] text-white">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                      <path
                        d="M2 6.4 4.6 9 10 3.2"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {stop.output}
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
