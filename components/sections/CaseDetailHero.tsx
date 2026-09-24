"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reveal } from "@/lib/anim";
import ParallaxImage from "@/components/ui/ParallaxImage";
import RuleList from "@/components/ui/RuleList";
import type { CaseStudy } from "@/lib/case-studies";

export default function CaseDetailHero({ study }: { study: CaseStudy }) {
  const sectionRef = useRef<HTMLElement>(null);

  // Six slots as drawn: the project, its three facts, its stack, and the studio
  // location, which is the same on every project.
  const facts = [
    { label: "PROJECT NAME:", value: study.cardTitle },
    ...study.facts.map((fact) => ({
      label: `${fact.label.toUpperCase()}:`,
      value: fact.value,
    })),
    { label: "TOOLS USED:", value: study.stack.join(", ") },
    { label: "LOCATION:", value: "Dhaka, Bangladesh" },
  ];

  useGSAP(
    () => {
      gsap.from(".case-detail-title", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.15,
      });

      gsap.from(".case-detail-aside", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
        delay: 0.4,
      });

      gsap.from(".case-detail-banner", {
        y: 48,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: reveal(sectionRef.current, { start: "top 78%" }),
      });

      gsap.from(".case-fact", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.07,
        scrollTrigger: reveal(sectionRef.current?.querySelector(".case-facts") ?? null, { start: "top 90%" }),
      });

      gsap.from(".case-intro", {
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: reveal(sectionRef.current?.querySelector(".case-intro") ?? null, { start: "top 90%" }),
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-node-id="156:10321"
      className="w-full bg-bg pt-[40px] lg:pt-[57px]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col px-6 lg:px-[40px]">
        <div className="flex w-full flex-col items-start gap-[40px] lg:flex-row lg:items-start lg:gap-[123px]">
          <h1 className="case-detail-title font-display text-[clamp(2.5rem,4.7vw,68px)] font-medium leading-[1.1] tracking-[-1.5px] text-black lg:min-w-0 lg:max-w-[917px] lg:flex-1">
            {study.title}
          </h1>

          <RuleList
            title="{ CASE STUDY  DETAILS }"
            body="The problem, the decisions we made, and what actually changed for the client after launch"
            className="case-detail-aside w-full lg:h-[160px] lg:w-auto"
            contentClassName="lg:w-[322px]"
          />
        </div>

        <div className="case-detail-banner mt-[40px] w-full lg:mt-[46px]">
          <ParallaxImage
            src={study.hero.src}
            alt={study.hero.alt}
            sizes="(max-width: 1023px) 100vw, 1440px"
            className="relative h-[280px] w-full sm:h-[440px] lg:h-[679px]"
          />
        </div>

        <div className="case-facts mt-[48px] grid w-full grid-cols-1 gap-x-[20px] gap-y-[34px] sm:grid-cols-2 lg:mt-[68px] lg:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label} className="case-fact flex w-full flex-col items-start gap-[8px]">
              <div className="flex w-full flex-col items-start gap-[2px]">
                <p className="font-body text-[14px] font-medium leading-[19.5px] text-ash-dark">
                  {fact.label}
                </p>
                <p className="font-display text-[32px] font-semibold leading-[46px] text-black">
                  {fact.value}
                </p>
              </div>
              <span className="h-px w-full bg-[#e7e7e7]" aria-hidden />
            </div>
          ))}
        </div>

        <div className="case-intro mt-[64px] flex w-full flex-col gap-[18px] lg:mt-[151px]">
          <h2 className="w-full font-display text-[32px] font-semibold leading-[46px] text-black">
            {study.intro.heading}
          </h2>
          <p className="w-full font-display text-[20px] leading-[1.3] tracking-[-0.25px] text-ash-dark">
            {study.intro.body}
          </p>
        </div>

        <div className="case-detail-banner mt-[48px] w-full lg:mt-[72px]">
          <ParallaxImage
            src={study.banner.src}
            alt={study.banner.alt}
            sizes="(max-width: 1023px) 100vw, 1440px"
            className="relative h-[240px] w-full sm:h-[380px] lg:h-[535px]"
          />
        </div>
      </div>
    </section>
  );
}
