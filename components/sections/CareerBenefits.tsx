"use client";

import { useRef } from "react";
import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";

type Benefit = { title: string; copy: string };

const BENEFITS: Benefit[] = [
  {
    title: "Ownership & Impact",
    copy: "Every engineer and designer owns their features end to end — from architecture decisions to what ships to the client. We trust people to make the call.",
  },
  {
    title: "Continuous Learning",
    copy: "You work across SaaS, cloud and AI/ML projects, so you keep picking up new tools and patterns instead of maintaining one stack for years.",
  },
  {
    title: "Remote-Friendly, Dhaka-Based",
    copy: "The core team works from our Dhaka office with flexible remote days — real face time when it matters, flexibility the rest of the time.",
  },
  {
    title: "Work-Life Balance",
    copy: "Sustainable delivery beats crunch. Project timelines are planned to respect the team's time outside of work, not to borrow against it.",
  },
  {
    title: "Dual Festival Bonuses",
    copy: "Two festival bonuses a year on top of salary, alongside an annual team tour that is actually paid for by the company.",
  },
  {
    title: "Meals, Coffee & Prayer Zone",
    copy: "Meals, coffee and snacks at the office, a quiet prayer zone, and a relax-and-sports corner for the hours between deep work.",
  },
];

function MarqueeRow({
  trackRef,
  className = "",
}: {
  trackRef: RefObject<HTMLDivElement | null>;
  className?: string;
}) {
  return (
    <div className={`w-full overflow-hidden ${className}`}>
      <div ref={trackRef} className="flex w-max items-center will-change-transform">
        {[0, 1].map((set) => (
          <span key={set} className="flex shrink-0 items-center" aria-hidden={set === 1}>
            {[0, 1].map((copy) => (
              <span
                key={copy}
                className="whitespace-nowrap pr-[80px] font-display text-[clamp(3.5rem,8.4vw,160px)] font-medium uppercase leading-[1] tracking-[-0.0625em] text-black"
              >
                benefits of building with project help
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function CareerBenefits() {
  const sectionRef = useRef<HTMLElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Two identical sets per track, so a half-width shift loops seamlessly.
      // The rows run opposite ways, matching the offset pair in the design.
      if (!prefersReducedMotion()) {
        gsap.fromTo(
          topRef.current,
          { xPercent: 0 },
          { xPercent: -50, duration: 34, ease: "none", repeat: -1 },
        );
        gsap.fromTo(
          bottomRef.current,
          { xPercent: -50 },
          { xPercent: 0, duration: 40, ease: "none", repeat: -1 },
        );
      } else {
        gsap.set(bottomRef.current, { xPercent: -50 });
      }

      const grid = sectionRef.current?.querySelector(".benefit-grid") ?? null;

      gsap.from(".benefit-card", {
        y: 40,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: reveal(grid, { start: "top 88%" }),
      });

      if (prefersReducedMotion()) return;

      // Scroll drags the two wordmark rows, so the marquee reacts to the page
      // rather than looping at a constant speed regardless of what you do.
      [topRef.current, bottomRef.current].forEach((track, i) => {
        if (!track) return;
        gsap.to(track, {
          xPercent: i === 0 ? "-=6" : "+=6",
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} data-node-id="156:11198" className="w-full">
      <h2 className="sr-only">Why join Project Help</h2>
      <div className="bg-bg pb-[24px] lg:pb-[45px]">
        <MarqueeRow trackRef={topRef} />
      </div>

      <div className="bg-[#f4f4f4] pb-[80px] pt-[40px] lg:pb-[160px] lg:pt-[68px]">
        <MarqueeRow trackRef={bottomRef} className="mb-[48px] lg:mb-[81px]" />

        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-0">
          <div className="benefit-grid grid w-full grid-cols-1 gap-[19.5px] sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <article
                key={benefit.title}
                className="benefit-card flex w-full flex-col items-start border border-[rgba(10,10,8,0.1)] bg-white p-[40px] lg:h-[272px]"
              >
                <p className="font-body text-[30px] leading-[36px] text-black" aria-hidden>
                  ◎
                </p>
                <h3 className="w-full pt-[24px] font-display text-[18px] font-medium leading-[1.2] tracking-[-0.18px] text-black lg:max-w-[313px]">
                  {benefit.title}
                </h3>
                <p className="w-full pt-[16px] font-body text-[16px] font-medium leading-[1.3] text-ash-dark">
                  {benefit.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
