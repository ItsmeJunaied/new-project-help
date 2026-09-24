"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reveal } from "@/lib/anim";

type Step = {
  id: string;
  number: string;
  title: string[];
  description: string[];
  /** Each step steps further right than the one above it. */
  indentClassName: string;
  gapClassName: string;
};

const STEPS: Step[] = [
  {
    id: "discovery",
    number: "{01}",
    title: ["Discovery", "Call"],
    description: [
      "We ask about your users, your deadline and your budget",
      "before we talk about technology at all.",
    ],
    indentClassName: "lg:ml-0",
    gapClassName: "lg:mt-0",
  },
  {
    id: "scope",
    number: "{02}",
    title: ["Scope &", "Architecture"],
    description: [
      "A written scope, wireframes and a fixed price and timeline",
      "to sign off on — no surprises later.",
    ],
    indentClassName: "lg:ml-[56px]",
    gapClassName: "lg:mt-[33px]",
  },
  {
    id: "sprints",
    number: "{03}",
    title: ["Build in", "Sprints"],
    description: [
      "Short, fixed cycles. Every two weeks you see working",
      "software and can redirect us — not a slide deck.",
    ],
    indentClassName: "lg:ml-[101px]",
    gapClassName: "lg:mt-[29px]",
  },
  {
    id: "launch",
    number: "{04}",
    title: ["Test, Launch", "& Support"],
    description: [
      "QA on staging, a rehearsed go-live with a rollback plan,",
      "then 6–12 months of fixes and patches on us.",
    ],
    indentClassName: "lg:ml-[146px]",
    gapClassName: "lg:mt-[30px]",
  },
];

export default function WorkingProcess() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 78%" });

      gsap.from(".process-heading-inner", {
        yPercent: 110,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: trigger,
      });

      gsap.from(".process-meta", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: trigger,
      });

      gsap.from(".process-divider", {
        scaleX: 0,
        duration: 1.1,
        ease: "power2.inOut",
        transformOrigin: "left center",
        scrollTrigger: trigger,
      });

      const count = sectionRef.current?.querySelector<HTMLElement>(".process-count");
      if (count) {
        gsap.from(count, {
          scale: 0.86,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: reveal(count, { start: "top 90%" }),
        });
      }

      // Each step draws its own rule and slides its own copy in, so the list
      // animates all the way down the section instead of in one burst.
      gsap.utils.toArray<HTMLElement>(".process-step").forEach((step) => {
        const stepTrigger = reveal(step, { start: "top 90%" });
        const rule = step.parentElement?.querySelector(".process-rule");

        if (rule) {
          gsap.from(rule, {
            scaleX: 0,
            duration: 0.9,
            ease: "power2.inOut",
            transformOrigin: "left center",
            scrollTrigger: stepTrigger,
          });
        }

        gsap.from(step.children, {
          y: 28,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.12,
          delay: 0.15,
          scrollTrigger: stepTrigger,
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-node-id="156:8025"
      className="w-full overflow-x-clip bg-black py-[80px] lg:py-0"
    >
      <div className="relative mx-auto w-full max-w-[1440px] px-6 lg:h-[1142px] lg:px-[40px]">
        <div className="flex w-full flex-col gap-[40px] lg:absolute lg:left-[120px] lg:right-0 lg:top-[138.84px] lg:w-auto lg:gap-0">
          <div className="flex w-full flex-col items-start gap-6 lg:flex-row lg:gap-[204px]">
            <p className="process-meta shrink-0 font-body text-[18px] font-medium leading-[18px] tracking-[-0.25px] text-ash-muted">
              [ Working Process ]
            </p>
            <div className="w-full lg:max-w-[907.2px] lg:pr-[431.02px]">
              <h2 className="font-display text-[clamp(2.25rem,4.4vw,64px)] font-medium leading-[1.1] tracking-[-1.5px] text-white lg:whitespace-nowrap">
                <span className="block overflow-hidden">
                  <span className="process-heading-inner block">Our proven delivery</span>
                </span>
                <span className="block overflow-hidden">
                  <span className="process-heading-inner block">Process</span>
                </span>
              </h2>
            </div>
          </div>

          <div className="process-divider h-px w-full bg-[#313131] lg:mt-[27px]" />

          <div className="flex w-full items-start lg:mt-[39px] lg:pl-[368px]">
            <div className="flex w-full flex-col items-start justify-between gap-6 lg:w-[952px] lg:flex-row lg:items-start">
              <p className="process-meta font-display text-[20px] leading-[1.3] tracking-[-0.25px] text-ash-muted lg:pr-[41.25px]">
                <span className="block">A clear, collaborative process that turns a vague</span>
                <span className="block">idea into software running in production.</span>
              </p>
              <p className="process-meta shrink-0 font-body text-[18px] font-medium leading-[18px] tracking-[-0.25px] text-ash-muted">
                Process [04]
              </p>
            </div>
          </div>
        </div>

        <div className="mt-[64px] flex w-full flex-col items-start gap-[34px] lg:absolute lg:left-[122px] lg:top-[739.84px] lg:mt-0 lg:w-[248px]">
          <p className="w-full font-display text-[20px] leading-[1.3] tracking-[-0.25px] text-white">
            Two-week slices, from first call to live system
          </p>
          <p className="process-count w-full font-display text-[clamp(5rem,10vw,160px)] font-medium uppercase leading-none tracking-[-0.0625em] text-white">
            04
          </p>
        </div>

        <div className="process-list mt-[56px] flex w-full flex-col items-start lg:absolute lg:left-[487px] lg:top-[461.84px] lg:mt-0 lg:w-[953px]">
          {STEPS.map((step, i) => (
            <div
              key={step.id}
              className={`w-full ${step.indentClassName} ${step.gapClassName} ${
                i > 0 ? "mt-[40px] lg:w-[953px]" : "lg:w-[953px]"
              }`}
            >
              <span className="process-rule block h-px w-full bg-[#313131]" />

              <div className="process-step mt-[24px] flex w-full flex-col items-start justify-between gap-4 lg:mt-[30px] lg:h-[70px] lg:flex-row lg:items-center lg:gap-0">
                <div className="flex shrink-0 items-start gap-[24px] text-white">
                  <span className="font-display text-[22px] leading-[26.4px] tracking-[-0.25px]">
                    {step.number}
                  </span>
                  <span className="font-display text-[32px] font-medium leading-[1.1]">
                    {step.title.map((line) => (
                      <span key={line} className="block whitespace-nowrap">
                        {line}
                      </span>
                    ))}
                  </span>
                </div>

                <p className="font-display text-[18px] font-medium leading-[1.2] tracking-[-0.18px] text-ash-muted lg:w-[466px]">
                  {step.description.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          ))}

          <span className="process-rule mt-[40px] block h-px w-full lg:ml-[146px] lg:mt-[30px] lg:w-[953px] bg-[#313131]" />
        </div>
      </div>
    </section>
  );
}
