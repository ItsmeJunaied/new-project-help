"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import ParallaxImage from "@/components/ui/ParallaxImage";
import RuleList from "@/components/ui/RuleList";
import type { Service } from "@/lib/services";

export default function ServiceDetailHero({ service }: { service: Service }) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".service-detail-line", {
        yPercent: 110,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.15,
      });

      gsap.from(".service-detail-aside", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
        delay: 0.5,
      });

      gsap.from(".service-detail-hero-image", {
        y: 56,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.35,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-node-id="156:8130"
      className="w-full bg-bg pb-[60px] pt-[40px] lg:pt-[57px]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[48px] px-6 lg:gap-[60px] lg:px-[40px]">
        <div className="flex w-full flex-col items-start gap-[40px] lg:flex-row lg:items-end lg:gap-[254px]">
          <h1 className="font-display text-[clamp(3.5rem,8.4vw,160px)] font-medium leading-[1] tracking-[-0.0625em] text-black lg:min-w-0 lg:max-w-[719px] lg:flex-1">
            {service.heroLines.map((line) => (
              <span key={line} className="block overflow-hidden">
                <span className="service-detail-line block">{line}</span>
              </span>
            ))}
          </h1>

          <RuleList
            title="What’s Included:"
            items={service.included}
            className="service-detail-aside w-full lg:h-[207px] lg:w-auto"
          />
        </div>

        <div className="service-detail-hero-image w-full">
          <ParallaxImage
            src={service.images.hero}
            alt={`${service.title} — engineering work in progress`}
            sizes="(max-width: 1023px) 100vw, 1440px"
            className="relative h-[320px] w-full sm:h-[520px] lg:h-[860px]"
          />
        </div>
      </div>
    </section>
  );
}
