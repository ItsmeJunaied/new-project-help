"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";
import { EXAMPLE_PROJECTS, WORKFLOW_STAGES } from "@/lib/project-workflow";

/**
 * What the five stages look like when a real project goes through them.
 *
 * Every service page already states the process in prose, three steps deep,
 * and prose is where a process goes to be skimmed. This is the same thing laid
 * out as a track: five stops, a line drawn through them, and beneath each one
 * what that stage actually produced on a project you can pick.
 *
 * Switching project re-runs the line and the detail rather than swapping the
 * text underneath you. That is the whole idea of the section — the stages are
 * fixed and the work inside them is not, and you only see that if the fixed
 * part stays still while the rest changes.
 *
 * The projects are composites and the section says so on the page. See
 * lib/project-workflow.ts.
 */
export default function ProjectWorkflow() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  const project = EXAMPLE_PROJECTS[active];

  // The reveal runs once and takes no dependencies. Driving it off `active`
  // instead put two contexts on the same elements — the second one's start
  // state landed on top of the first one's finished state, and the connectors
  // stayed at scale 0 for good after the first time anyone changed project.
  const { contextSafe } = useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const trigger = reveal(sectionRef.current, { start: "top 82%" });

      gsap.from(".flow-head", {
        y: 22,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: trigger,
      });

      gsap.from(".flow-tab", {
        y: 16,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.08,
        delay: 0.15,
        scrollTrigger: trigger,
      });

      // The connector is one pixel thick, and which of its two dimensions is
      // the long one depends on the breakpoint: it runs down the gutter on a
      // phone and across between the dots from lg up. Scaling BOTH axes draws
      // it either way — on a horizontal line the vertical scale is a pixel
      // nobody can see, and the other way round.
      //
      // fromTo rather than from, here and in drawLinks below, so the finished
      // state is written down. A `from` tween takes whatever it finds as its
      // destination, which is fine once and a trap the second time.
      gsap.fromTo(
        ".flow-link",
        { scaleX: 0, scaleY: 0 },
        {
          scaleX: 1,
          scaleY: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.12,
          delay: 0.3,
          transformOrigin: "left top",
          scrollTrigger: trigger,
        },
      );

      gsap.from(".flow-dot", {
        scale: 0,
        duration: 0.45,
        ease: "back.out(2)",
        stagger: 0.12,
        delay: 0.3,
        scrollTrigger: trigger,
      });

      gsap.from(".flow-card", {
        y: 20,
        opacity: 0,
        duration: 0.55,
        ease: "power2.out",
        stagger: 0.12,
        delay: 0.38,
        scrollTrigger: trigger,
      });
    },
    { scope: sectionRef },
  );

  /**
   * Changing project. The stages hold still and everything that belongs to the
   * project redraws, which is the point the section is making.
   *
   * It runs from the click rather than from a state effect so it never shares
   * elements with the reveal above. `overwrite` kills whatever the reveal left
   * running on the same targets if somebody clicks while it is still going.
   */
  const choose = contextSafe((index: number) => {
    setActive(index);

    if (prefersReducedMotion()) return;

    gsap.fromTo(
      ".flow-detail",
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, ease: "power2.out", stagger: 0.06, overwrite: true },
    );

    gsap.fromTo(
      ".flow-link",
      { scaleX: 0, scaleY: 0 },
      {
        scaleX: 1,
        scaleY: 1,
        duration: 0.4,
        ease: "power2.out",
        stagger: 0.07,
        transformOrigin: "left top",
        overwrite: true,
      },
    );
  });

  return (
    <section ref={sectionRef} className="w-full bg-bg pb-[80px] pt-[40px] lg:pb-[130px]">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[40px]">
        <div className="flow-head flex w-full flex-col gap-[14px] lg:max-w-[880px]">
          <h2 className="w-full font-display text-[clamp(2rem,4.4vw,64px)] font-medium leading-[1.1] tracking-[-1.5px] text-black">
            How a project runs
          </h2>
          <p className="w-full font-display text-[20px] leading-[1.3] tracking-[-0.25px] text-ash-dark">
            The same five stages every time. Pick a project to see what each one produced.
          </p>
          {/* Said plainly rather than buried in a footnote: these are worked
              examples of the process, not a client list. */}
          <p className="font-body text-[13px] leading-[19px] tracking-[-0.1px] text-neutral-paragraph">
            Illustrative engagements — the stages are ours, the names and figures are examples.
          </p>
        </div>

        {/* Choosing the project, not filtering it: three buttons, one panel. */}
        <div
          role="tablist"
          aria-label="Example projects"
          className="mt-[34px] flex w-full flex-col gap-[10px] sm:flex-row sm:flex-wrap lg:mt-[44px]"
        >
          {EXAMPLE_PROJECTS.map((item, index) => {
            const on = index === active;

            return (
              <button
                key={item.name}
                type="button"
                role="tab"
                id={`flow-tab-${index}`}
                aria-selected={on}
                aria-controls="flow-panel"
                onClick={() => choose(index)}
                className={`flow-tab flex flex-1 flex-col items-start gap-[6px] rounded-[18px] px-[20px] py-[16px] text-left transition-[background-color,box-shadow,transform] duration-300 sm:min-w-[240px] ${
                  on
                    ? "bg-black shadow-[0_18px_40px_-24px_rgba(0,0,0,0.7)]"
                    : "bg-black/[0.04] hover:bg-black/[0.07]"
                }`}
              >
                <span className="flex items-center gap-[8px]">
                  <span
                    className={`size-[7px] shrink-0 rounded-full transition-colors duration-300 ${
                      on ? "bg-primary-green" : "bg-black/25"
                    }`}
                  />
                  <span
                    className={`font-display text-[19px] font-medium leading-none tracking-[-0.3px] transition-colors duration-300 ${
                      on ? "text-white" : "text-black"
                    }`}
                  >
                    {item.name}
                  </span>
                </span>
                <span
                  className={`font-body text-[13px] leading-[18px] tracking-[-0.1px] transition-colors duration-300 ${
                    on ? "text-white/60" : "text-neutral-paragraph"
                  }`}
                >
                  {item.sector} — {item.summary}
                </span>
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id="flow-panel"
          aria-labelledby={`flow-tab-${active}`}
          className="w-full"
        >
          {/* The three facts about the engagement that sit above the track, so
              the stage durations below have something to add up to. */}
          <dl className="mt-[26px] flex w-full flex-wrap items-center gap-x-[28px] gap-y-[12px] border-b border-black/[0.08] pb-[24px] lg:mt-[34px]">
            <div className="flow-detail flex items-baseline gap-[8px]">
              <dt className="font-mono text-[11px] uppercase leading-none tracking-[0.16em] text-neutral-paragraph">
                Span
              </dt>
              <dd className="font-display text-[18px] font-medium leading-none tracking-[-0.3px] text-black">
                {project.span}
              </dd>
            </div>
            <div className="flow-detail flex items-baseline gap-[8px]">
              <dt className="font-mono text-[11px] uppercase leading-none tracking-[0.16em] text-neutral-paragraph">
                Team
              </dt>
              <dd className="font-display text-[18px] font-medium leading-none tracking-[-0.3px] text-black">
                {project.team}
              </dd>
            </div>
            <div className="flow-detail flex flex-wrap items-center gap-[6px]">
              <dt className="font-mono text-[11px] uppercase leading-none tracking-[0.16em] text-neutral-paragraph">
                Stack
              </dt>
              {project.stack.map((tool) => (
                <dd
                  key={tool}
                  className="rounded-full bg-black/[0.055] px-[11px] py-[6px] font-body text-[12px] leading-none tracking-[-0.1px] text-ash-dark"
                >
                  {tool}
                </dd>
              ))}
            </div>
          </dl>

          {/* The track. One column per stage from lg up, stacked below it —
              the dot and its connector are positioned the same way in both, so
              the line runs across on a desktop and down a phone. */}
          <ol className="mt-[34px] grid w-full grid-cols-1 gap-y-[28px] lg:mt-[46px] lg:grid-cols-5 lg:gap-x-[20px] lg:gap-y-0">
            {WORKFLOW_STAGES.map((stage, index) => {
              const run = project.runs[index];
              const last = index === WORKFLOW_STAGES.length - 1;

              return (
                <li key={stage.name} className="relative flex flex-col pl-[44px] lg:pl-0">
                  {!last && (
                    <span
                      aria-hidden
                      className="flow-link absolute -bottom-[36px] left-[15px] top-[42px] w-px bg-black/15 lg:bottom-auto lg:left-[36px] lg:-right-[20px] lg:top-[15px] lg:h-px lg:w-auto"
                    />
                  )}

                  <span
                    aria-hidden
                    className="flow-dot absolute left-0 top-[8px] flex size-[32px] items-center justify-center rounded-full bg-primary-green font-mono text-[12px] font-medium leading-none text-black shadow-[0_8px_20px_-10px_color-mix(in_srgb,var(--color-primary-green)_90%,transparent)] lg:static lg:top-auto"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="flow-card flex flex-col gap-[10px] lg:mt-[22px] lg:pr-[20px]">
                    <div className="flex flex-wrap items-center gap-[10px]">
                      <h3 className="font-display text-[22px] font-medium leading-none tracking-[-0.4px] text-black">
                        {stage.name}
                      </h3>
                      <span className="flow-detail rounded-full bg-black px-[10px] py-[6px] font-mono text-[11px] uppercase leading-none tracking-[0.12em] text-white">
                        {run.span}
                      </span>
                    </div>

                    <p className="font-body text-[13px] leading-[18px] tracking-[-0.1px] text-neutral-paragraph">
                      {stage.purpose}
                    </p>

                    <p className="flow-detail font-display text-[16px] leading-[1.45] tracking-[-0.2px] text-ash-dark">
                      {run.detail}
                    </p>

                    <p className="flow-detail mt-[2px] flex items-center gap-[7px] font-body text-[13px] font-medium leading-none tracking-[-0.1px] text-black">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                        <path
                          d="M2 6.4 4.6 9 10 3.2"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {run.output}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
