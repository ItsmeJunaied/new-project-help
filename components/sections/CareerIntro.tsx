"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reveal } from "@/lib/anim";

export default function CareerIntro() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 88%" });

      gsap.from(".career-intro-image", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: trigger,
      });

      gsap.from(".career-intro-copy", {
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: trigger,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-node-id="156:11184"
      className="w-full bg-bg pb-[80px] pt-[64px] lg:pb-[197px] lg:pt-[80px]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-[48px] px-6 lg:flex-row lg:items-start lg:justify-end lg:gap-[100px] lg:px-[40px]">
        <div className="career-intro-image relative h-[240px] w-full overflow-hidden sm:h-[295px] lg:w-[388px] lg:shrink-0">
          <Image
            src="/images/career-intro.jpg"
            alt="Designer working on a laptop at a desk with wooden shelving behind"
            fill
            sizes="(max-width: 1023px) 100vw, 388px"
            className="object-cover"
          />
        </div>

        <div className="flex w-full flex-col items-start gap-[48px] lg:max-w-[500px]">
          <p className="career-intro-copy font-body text-[18px] leading-[27px] tracking-[-0.25px] text-black lg:w-[428px]">
            Review the open roles, choose the position that matches your experience, and
            submit your portfolio and application. Shortlisted candidates receive the
            next-step details directly from the hiring team.
          </p>

          <Link
            href="#open-roles"
            className="career-intro-copy flex items-center justify-center gap-[8px] rounded-[1000px] bg-black px-[32px] py-[16px] transition-opacity hover:opacity-90"
          >
            <span className="font-body text-[18px] font-medium leading-[27px] tracking-[-0.25px] text-white">
              View Open Roles
            </span>
            <span className="relative size-[22px] shrink-0">
              <Image
                src="/icons/icon-button-plus-on-dark.svg"
                alt=""
                fill
                className="object-contain"
              />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
