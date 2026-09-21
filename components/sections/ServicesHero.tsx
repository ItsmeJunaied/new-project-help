"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

export default function ServicesHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".services-hero-line", {
        yPercent: 110,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.15,
      });

      gsap.from(".services-hero-intro", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
        delay: 0.5,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-node-id="156:7820"
      className="w-full bg-bg pt-[40px] lg:pt-[57px]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-[32px] px-6 lg:flex-row lg:items-end lg:justify-between lg:gap-0 lg:px-0">
        <h1 className="font-display text-[clamp(3.5rem,8.4vw,160px)] font-medium uppercase leading-[1] tracking-[-0.0625em] text-black">
          <span className="block overflow-hidden">
            <span className="services-hero-line block">Solutions</span>
          </span>
          <span className="block overflow-hidden">
            <span className="services-hero-line block">We Build</span>
          </span>
        </h1>

        <p className="services-hero-intro w-full font-display text-[18px] font-medium leading-[1.2] tracking-[-0.18px] text-ash-dark lg:w-[467px] lg:pb-[4px]">
          Seven service lines covering the full build — architecture, delivery, cloud and
          the support that keeps the system running after launch.
        </p>
      </div>
    </section>
  );
}
