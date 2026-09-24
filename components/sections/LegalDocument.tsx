"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reveal } from "@/lib/anim";
import type { LegalSection } from "@/lib/legal";

type LegalDocumentProps = {
  title: string;
  intro: string;
  lastUpdated: string;
  sections: LegalSection[];
};

/**
 * Long-form legal copy. Deliberately plainer than the rest of the site — a
 * reader here is scanning for a clause, so the numbered headings stay in the
 * left rail and the prose column is narrow enough to read in one pass.
 */
export default function LegalDocument({ title, intro, lastUpdated, sections }: LegalDocumentProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".legal-title", { y: 36, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.1 });
      gsap.from(".legal-intro", { y: 20, opacity: 0, duration: 0.8, ease: "power2.out", delay: 0.3 });

      gsap.utils.toArray<HTMLElement>(".legal-block").forEach((block) => {
        gsap.from(block, {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: reveal(block, { start: "top 93%" }),
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="w-full bg-bg pb-[80px] pt-[40px] lg:pb-[140px] lg:pt-[80px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col px-6 lg:px-[40px]">
        <h1 className="legal-title font-display text-[clamp(2.5rem,4.7vw,68px)] font-medium leading-[1.1] tracking-[-1.5px] text-black lg:max-w-[917px]">
          {title}
        </h1>

        <div className="legal-intro mt-[24px] flex w-full flex-col gap-[8px] lg:max-w-[832px]">
          <p className="font-body text-[16px] leading-[24px] tracking-[-0.16px] text-ash-dark">{intro}</p>
          <p className="font-mono text-[14px] uppercase leading-[16px] tracking-[0.5px] text-[#707070]">
            Last updated: {lastUpdated}
          </p>
        </div>

        <div className="mt-[56px] flex w-full flex-col gap-[40px] lg:mt-[80px] lg:max-w-[900px]">
          {sections.map((section) => (
            <div key={section.heading} className="legal-block flex w-full flex-col gap-[16px]">
              <span className="block h-px w-full bg-[#e7e7e7]" aria-hidden />
              <h2 className="w-full font-display text-[24px] font-semibold leading-[34px] tracking-[-0.5px] text-pure-black">
                {section.heading}
              </h2>

              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="w-full font-body text-[16px] leading-[26px] tracking-[-0.16px] text-ash-dark"
                >
                  {paragraph}
                </p>
              ))}

              {section.list && (
                <ul className="flex w-full list-disc flex-col gap-[10px] pl-[26px] font-body text-[16px] leading-[26px] tracking-[-0.16px] text-ash-dark marker:text-primary-green">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
