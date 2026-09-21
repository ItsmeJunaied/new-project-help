"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reveal } from "@/lib/anim";

export default function AboutApproach() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 78%" });

      gsap.from(".approach-heading-inner", {
        yPercent: 110,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: trigger,
      });

      gsap.from(".approach-meta", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: trigger,
      });

      gsap.from(".approach-divider", {
        scaleX: 0,
        duration: 1,
        ease: "power2.inOut",
        transformOrigin: "left center",
        scrollTrigger: trigger,
      });

      gsap.from(".approach-block", {
        y: 32,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: reveal(document.querySelector(".approach-blocks"), { start: "top 88%" }),
      });

      gsap.from(".approach-year", {
        scale: 0.86,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: reveal(document.querySelector(".approach-year"), { start: "top 92%" }),
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-node-id="156:8689"
      className="w-full overflow-x-clip bg-bg py-[80px] lg:py-0"
    >
      <div className="relative mx-auto w-full max-w-[1440px] px-6 lg:h-[1169px] lg:px-0">
        <div className="flex w-full flex-col gap-[40px] lg:absolute lg:inset-x-0 lg:top-[160px] lg:gap-0">
          <div className="flex w-full flex-col items-start gap-6 lg:flex-row lg:gap-[347px]">
            <p className="approach-meta shrink-0 font-body text-[18px] font-medium leading-[18px] tracking-[-0.25px] text-[#111]">
              [ Our Approach ]
            </p>
            <div className="w-full lg:max-w-[907.2px] lg:pr-[322.2px]">
              <h2 className="font-display text-[clamp(2.25rem,4.4vw,64px)] font-medium leading-[1] tracking-[-3px] text-black lg:whitespace-nowrap">
                <span className="block overflow-hidden">
                  <span className="approach-heading-inner block">A simple way to</span>
                </span>
                <span className="block overflow-hidden">
                  <span className="approach-heading-inner block">build better software</span>
                </span>
              </h2>
            </div>
          </div>

          <div className="approach-divider h-px w-full bg-[#e6e9dd] lg:mt-[40px]" />
        </div>

        <div className="approach-blocks mt-[56px] flex w-full flex-col gap-[48px] lg:mt-0 lg:block">
          {/* Mission */}
          <div className="approach-block flex w-full flex-col items-start lg:absolute lg:left-[487px] lg:top-[392px] lg:w-[345px]">
            <p className="w-full font-display text-[18px] font-medium leading-[1.2] tracking-[-0.18px] text-black">
              OUR MISSION
            </p>
            <p className="mt-[24px] w-full font-display text-[20px] leading-[1.3] tracking-[-0.25px] text-ash-dark lg:mt-[35px]">
              Build software that solves the real problem — scoped honestly, shipped in two-week slices, and handed over with the documentation to run it.
            </p>
            <div className="relative mt-[24px] h-[280px] w-full overflow-hidden lg:mt-[35px] lg:h-[334px]">
              <Image
                src="/images/about-mission.jpg"
                alt="Engineer sketching a system design on paper"
                fill
                sizes="(max-width: 1023px) 100vw, 345px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Vision */}
          <div className="approach-block flex w-full flex-col items-start lg:absolute lg:left-[899px] lg:top-[392px] lg:w-[541px]">
            <p className="w-full font-display text-[18px] font-medium leading-[1.2] tracking-[-0.18px] text-black lg:w-[345px]">
              OUR VISION
            </p>
            <p className="mt-[24px] font-display text-[20px] leading-[1.3] tracking-[-0.25px] text-ash-dark lg:mt-[37px] lg:w-[345px]">
              Be the team clients call back — because the system we built is still holding up years later.
            </p>
            <div className="relative mt-[24px] h-[280px] w-full overflow-hidden lg:mt-[33px] lg:h-[473px]">
              <Image
                src="/images/about-vision.jpg"
                alt="The Project Help team gathered around a shared desk"
                fill
                sizes="(max-width: 1023px) 100vw, 541px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Founding year */}
          <div className="approach-block flex w-full flex-col items-start gap-[20px] lg:absolute lg:left-0 lg:top-[781px] lg:w-[345px]">
            <p className="approach-year w-full font-display text-[clamp(4.5rem,10vw,160px)] font-medium uppercase leading-none tracking-[-0.0625em] text-black">
              2021
            </p>
            <div className="flex items-center gap-[15px]">
              <span className="relative size-[48px] shrink-0">
                <Image src="/icons/logo-mark.svg" alt="" fill className="object-contain" />
              </span>
              <p className="font-display text-[18px] font-medium leading-[1.2] tracking-[-0.18px] text-black">
                <span className="block whitespace-nowrap">CUSTOM SOFTWARE FOR</span>
                <span className="block whitespace-nowrap">CLIENTS WORLDWIDE</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
