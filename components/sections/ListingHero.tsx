"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import RuleList from "@/components/ui/RuleList";

type ListingHeroProps = {
  title: string;
  asideTitle: string;
  asideBody: string;
  metaLeft: string;
  metaRight: string;
  nodeId: string;
  spacingClassName?: string;
};

export default function ListingHero({
  title,
  asideTitle,
  asideBody,
  metaLeft,
  metaRight,
  nodeId,
  spacingClassName = "pb-[64px] pt-[40px] lg:pb-[107px] lg:pt-[77px]",
}: ListingHeroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".case-hero-line", {
        yPercent: 110,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.15,
      });

      gsap.from(".case-hero-aside", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
        delay: 0.45,
      });

      gsap.from(".case-hero-meta", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.6,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-node-id={nodeId}
      className={`w-full bg-bg ${spacingClassName}`}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[40px] px-6 lg:gap-[60px] lg:px-[40px]">
        <div className="flex w-full flex-col items-start gap-[40px] lg:flex-row lg:items-center lg:gap-[88px]">
          <h1 className="font-display text-[clamp(3.5rem,8.4vw,160px)] font-medium uppercase leading-[1] tracking-[-0.0625em] text-black">
            <span className="block overflow-hidden">
              <span className="case-hero-line block">{title}</span>
            </span>
          </h1>

          <RuleList
            title={asideTitle}
            body={asideBody}
            className="case-hero-aside w-full lg:h-[160px] lg:w-auto"
            contentClassName="lg:w-[322px]"
          />
        </div>

        <div className="case-hero-meta flex w-full flex-col gap-[8px]">
          <div className="flex w-full items-center justify-between text-[18px] leading-[25.714px] text-black">
            <p className="font-display font-medium">{metaLeft}</p>
            <p className="text-right font-body font-bold">{metaRight}</p>
          </div>
          <div className="h-px w-full bg-black/20" />
        </div>
      </div>
    </section>
  );
}
