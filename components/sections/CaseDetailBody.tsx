"use client";

import Image from "next/image";
import { useRef } from "react";
import type { ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";
import type { CaseStudy } from "@/lib/case-studies";

function Heading({ children }: { children: ReactNode }) {
  return (
    <h2 className="w-full font-display text-[32px] font-semibold leading-[46px] text-black">
      {children}
    </h2>
  );
}

/** Body copy: an opening line in ink, the rest in ash. */
function Prose({ lead, paragraphs }: { lead: string; paragraphs: string[] }) {
  return (
    <div className="flex w-full flex-col gap-[24px] font-body text-[16px] leading-[24px] tracking-[-0.16px] text-ash-dark">
      <p className="text-black">{lead}</p>
      {paragraphs.map((paragraph) => (
        <p key={paragraph.slice(0, 40)}>{paragraph}</p>
      ))}
    </div>
  );
}

function NumberedList({ intro, items }: { intro: string; items: string[] }) {
  return (
    <div className="flex w-full flex-col gap-[24px] font-body text-[16px] leading-[24px] tracking-[-0.16px]">
      <p className="text-black">{intro}</p>
      <ol className="flex list-decimal flex-col gap-[24px] pl-[30px] text-ash-dark">
        {items.map((item) => (
          <li key={item.slice(0, 40)}>{item}</li>
        ))}
      </ol>
    </div>
  );
}

export default function CaseDetailBody({ study }: { study: CaseStudy }) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".case-body-block").forEach((block) => {
        gsap.from(block, {
          y: 36,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: reveal(block, { start: "top 90%" }),
        });
      });

      const outcomes = sectionRef.current?.querySelector(".case-outcomes") ?? null;
      const outcomesTrigger = reveal(outcomes, { start: "top 88%" });

      gsap.from(".case-outcome", {
        y: 28,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.1,
        scrollTrigger: outcomesTrigger,
      });

      gsap.from(".case-outcome-rule", {
        scaleX: 0,
        duration: 0.9,
        ease: "power2.inOut",
        stagger: 0.1,
        transformOrigin: "left center",
        scrollTrigger: outcomesTrigger,
      });

      if (prefersReducedMotion()) return;

      // Inline photography drifts against the column as the article scrolls.
      gsap.utils.toArray<HTMLElement>(".case-body-block img").forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -4, scale: 1.08 },
          {
            yPercent: 4,
            ease: "none",
            scrollTrigger: {
              trigger: img.parentElement,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-node-id="156:10430"
      className="w-full bg-bg pb-[80px] pt-[48px] lg:pb-[180px] lg:pt-[80px]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-0">
        <div className="mx-auto flex w-full flex-col gap-[40px] lg:w-[710px]">
          <div className="case-body-block flex w-full flex-col gap-[18px]">
            <Heading>Problem:</Heading>
            <Prose lead={study.problem.lead} paragraphs={study.problem.paragraphs} />
            <NumberedList intro="Key issues identified:" items={study.problem.issues} />
          </div>

          <div className="case-body-block grid w-full grid-cols-3 gap-[10px]">
            {study.problemImages.map((image) => (
              <div key={image.src} className="relative h-[120px] w-full overflow-hidden sm:h-[180px] lg:h-[226px]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 1023px) 33vw, 230px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="case-body-block flex w-full flex-col gap-[18px]">
            <Heading>Solution:</Heading>
            <Prose lead={study.solution.lead} paragraphs={study.solution.paragraphs} />
            <div className="grid w-full grid-cols-2 gap-[10px]">
              {study.solutionImages.map((image) => (
                <div key={image.src} className="relative h-[160px] w-full overflow-hidden sm:h-[200px] lg:h-[226px]">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 1023px) 50vw, 350px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="case-body-block">
            <Heading>Key Takeaways:</Heading>
          </div>

          <div className="case-body-block">
            <Prose lead={study.takeaway.lead} paragraphs={study.takeaway.paragraphs} />
          </div>

          <div className="case-body-block">
            <NumberedList
              intro="What this project reinforced:"
              items={study.takeaway.lessons}
            />
          </div>
        </div>

        <div className="mx-auto mt-[64px] flex w-full flex-col lg:mt-[95px] lg:w-[710px]">
          <Heading>Outcomes &amp; Impact:</Heading>

          <div className="case-outcomes mt-[40px] grid w-full grid-cols-1 gap-x-[20px] gap-y-[43px] sm:grid-cols-2 lg:mt-[69px]">
            {study.outcomes.map((outcome) => (
              <div key={outcome.label} className="case-outcome flex w-full flex-col gap-[18px]">
                <span className="case-outcome-rule block h-px w-full bg-[#e7e7e7]" aria-hidden />
                <div className="flex w-full flex-col gap-[5px]">
                  <p className="w-full font-body text-[14px] font-medium leading-[19.5px] text-ash-dark">
                    {outcome.label}
                  </p>
                  <p className="whitespace-nowrap font-display text-[64px] font-medium leading-[1.1] tracking-[-1.5px] text-black">
                    {outcome.value}
                  </p>
                  <p className="w-full font-body text-[16px] leading-[24px] tracking-[-0.16px] text-ash-dark">
                    {outcome.copy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
