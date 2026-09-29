"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";

/**
 * Your project, start to finish.
 *
 * The reference design ran this as seven equal blocks, each a time label, a
 * title and a sentence — which is a list wearing the costume of a process.
 * Seven identical boxes tell you the order of things and nothing else, and the
 * question somebody actually has at this point is not "what are the stages",
 * it is "how far can I go before this costs me anything, and what do you need
 * from me".
 *
 * So it is split at the only line that matters — the contract — and every step
 * says whose move it is. Everything above the line is free and reversible and
 * says so; everything below it is work. A visitor can read the top half and
 * know exactly what they are signing up for by sending a form, which is the
 * whole job of a contact page.
 */

type Step = {
  when: string;
  title: string;
  body: string;
  /** Whose move it is. The alternation is the point of the column. */
  who: "You" | "Us";
};

type Phase = {
  name: string;
  /** What this phase costs the visitor — stated, not implied. */
  cost: string;
  note: string;
  steps: Step[];
};

const PHASES: Phase[] = [
  {
    name: "Deciding",
    cost: "Costs nothing, commits nothing",
    note: "Every step here is reversible. You can stop after any of them and owe us nothing — no retainer, no deposit, no discovery fee.",
    steps: [
      {
        when: "Hour 0",
        title: "Your brief lands",
        body: "The form, an email, WhatsApp or a call — all four reach the same inbox, read by the engineers who would run the build.",
        who: "You",
      },
      {
        when: "4 hours",
        title: "A named person replies",
        body: "Inside four business hours. With the questions we need answered, a time to talk, or an honest “this is not us, try them”.",
        who: "Us",
      },
      {
        when: "Day 1–2",
        title: "A call, if it helps",
        body: "Thirty minutes, free, with the two projects closest to yours on screen. Some briefs are clear enough that we skip it.",
        who: "You",
      },
      {
        when: "Day 2–5",
        title: "Scope and a fixed number",
        body: "In writing: what gets built, in what order, by when, for how much, and who is assigned. If we cannot hit your window we say so here.",
        who: "Us",
      },
    ],
  },
  {
    name: "Building",
    cost: "From the day you say yes",
    note: "The engineers in the kickoff call are the ones who write the code. That is the whole reason the first reply came from one of them.",
    steps: [
      {
        when: "Week 1",
        title: "Contract and kickoff",
        body: "The contract goes out the day you agree, and kickoff follows inside 48 hours. Access, environments and the backlog are set up in that first week.",
        who: "You",
      },
      {
        when: "Every 2 weeks",
        title: "Working software, on a cycle",
        body: "Two-week cycles against the signed scope, each ending on something you can open and use. Weekly written updates, an open backlog, direct access to the engineers.",
        who: "Us",
      },
      {
        when: "Launch",
        title: "Go live, then stay",
        body: "A rehearsed cutover with a way back, then months of monitoring, patches and changes — not a handover email and a goodbye.",
        who: "Us",
      },
    ],
  },
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

      gsap.from(".tl-phase", {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: reveal(sectionRef.current, { start: "top 70%" }),
      });

      gsap.from(".tl-step", {
        y: 22,
        opacity: 0,
        duration: 0.65,
        ease: "power2.out",
        stagger: 0.07,
        scrollTrigger: reveal(sectionRef.current, { start: "top 66%" }),
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
          <div className="flex flex-col gap-[16px] lg:max-w-[760px]">
            <p className="font-mono text-[11px] uppercase leading-none tracking-[0.2em] text-primary-green">
              Free until you sign · then two-week cycles
            </p>
            <h2 className="font-display text-[clamp(2rem,4.2vw,60px)] font-medium leading-[1.05] tracking-[-1.5px] text-white">
              Your project, start to finish
            </h2>
          </div>

          <p className="max-w-[350px] font-body text-[15px] leading-[23px] tracking-[-0.1px] text-white/45 lg:pb-[8px] lg:text-right">
            Seven steps, each one saying whose move it is — and a line through the middle
            marking where it starts costing money.
          </p>
        </div>

        <div className="mt-[54px] flex w-full flex-col gap-[48px] lg:mt-[78px] lg:gap-[64px]">
          {PHASES.map((phase, phaseIndex) => {
            // Numbering runs 01–07 straight through rather than restarting per
            // phase, because it is one sequence that happens to have a line
            // drawn across it. Derived from the phases before this one rather
            // than counted up in a closure, which the compiler rightly refuses.
            const offset = PHASES.slice(0, phaseIndex).reduce(
              (total, earlier) => total + earlier.steps.length,
              0,
            );

            return (
            <div key={phase.name} className="flex w-full flex-col">
              {/* The phase header carries the cost, which is the fact the
                  whole section is arranged around. */}
              <div
                className={`tl-phase flex w-full flex-col gap-[14px] border-t pb-[10px] pt-[24px] lg:flex-row lg:items-start lg:justify-between lg:gap-[60px] ${
                  phaseIndex === 0 ? "border-white/15" : "border-primary-green/50"
                }`}
              >
                <div className="flex items-center gap-[14px]">
                  <h3 className="font-display text-[26px] font-medium leading-none tracking-[-0.5px] text-white lg:text-[30px]">
                    {phase.name}
                  </h3>
                  <span
                    className={`rounded-full px-[12px] py-[7px] font-mono text-[10px] uppercase leading-none tracking-[0.16em] ${
                      phaseIndex === 0
                        ? "bg-primary-green text-white"
                        : "bg-white/[0.08] text-white/70 ring-1 ring-white/12"
                    }`}
                  >
                    {phase.cost}
                  </span>
                </div>

                <p className="font-body text-[14px] leading-[22px] tracking-[-0.1px] text-white/45 lg:max-w-[440px] lg:text-right">
                  {phase.note}
                </p>
              </div>

              <ol className="flex w-full flex-col">
                {phase.steps.map((step, stepIndex) => {
                  const counter = offset + stepIndex + 1;

                  return (
                    <li
                      key={step.title}
                      className="tl-step group grid w-full grid-cols-1 gap-x-[30px] gap-y-[10px] border-t border-white/[0.09] py-[26px] lg:grid-cols-[56px_120px_1fr_84px] lg:items-baseline lg:py-[30px]"
                    >
                      <span className="font-display text-[30px] font-medium leading-none tracking-[-0.8px] text-white/15 transition-colors duration-500 group-hover:text-primary-green lg:text-[36px]">
                        {String(counter).padStart(2, "0")}
                      </span>

                      <span className="font-mono text-[11px] uppercase leading-none tracking-[0.18em] text-primary-green">
                        {step.when}
                      </span>

                      <div className="flex flex-col gap-[9px] lg:max-w-[620px]">
                        <h4 className="font-display text-[21px] font-medium leading-[1.15] tracking-[-0.4px] text-white lg:text-[24px]">
                          {step.title}
                        </h4>
                        <p className="font-body text-[14px] leading-[22px] tracking-[-0.1px] text-white/45">
                          {step.body}
                        </p>
                      </div>

                      {/* Whose move. Two values, so it reads as a rally
                          rather than as a queue you are waiting in. */}
                      <span
                        className={`w-fit rounded-full px-[11px] py-[6px] font-mono text-[10px] uppercase leading-none tracking-[0.16em] lg:justify-self-end ${
                          step.who === "You"
                            ? "bg-white text-ink"
                            : "text-white/55 ring-1 ring-white/20"
                        }`}
                      >
                        {step.who === "You" ? "Your move" : "Our move"}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
