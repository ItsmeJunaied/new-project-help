"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";

const HOME_HEADING_LINES = ["What we build", "for growing", "teams"];

// Rules sit on the container edges and at the two interior thirds
// (x = 240 / 720 / 1200 / 1680 on the 1920 canvas).
const RULE_POSITIONS = ["left-0", "left-1/3", "left-2/3", "right-0"];

type ServicesIntroProps = {
  /** The About page reuses this panel with its own statement. */
  lines?: string[];
  id?: string;
  nodeId?: string;
};

export default function ServicesIntro({
  lines = HOME_HEADING_LINES,
  id = "services",
  nodeId = "156:7003",
}: ServicesIntroProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 78%" });

      gsap.from(".services-rule", {
        scaleY: 0,
        duration: 1.2,
        ease: "power2.inOut",
        stagger: 0.08,
        transformOrigin: "top center",
        scrollTrigger: trigger,
      });

      gsap.from(".services-heading-inner", {
        yPercent: 110,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: trigger,
      });

      if (prefersReducedMotion()) return;

      // The three lines fan apart as the panel crosses the viewport, so the
      // block keeps moving after its entrance instead of sitting still.
      gsap.utils.toArray<HTMLElement>(".services-heading-inner").forEach((line, i) => {
        gsap.to(line, {
          xPercent: (i - 1) * 4,
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

      // Rules drift upward past the type, reinforcing the grid.
      gsap.to(".services-rule", {
        yPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      data-node-id={nodeId}
      className="relative flex w-full items-center justify-center overflow-hidden bg-black py-[100px] lg:h-[1184px] lg:py-0"
    >
      <div className="pointer-events-none absolute inset-0 mx-auto w-full max-w-[1440px] px-6 lg:px-[40px]">
        <div className="relative h-full w-full">
          {RULE_POSITIONS.map((position) => (
            <span
              key={position}
              className={`services-rule absolute top-0 h-full w-px bg-ash-dark ${position}`}
            />
          ))}
        </div>
      </div>

      <h2 className="relative mx-auto w-full max-w-[1440px] px-6 text-center font-display text-[clamp(2.5rem,8.33vw,160px)] font-medium uppercase leading-[1] tracking-[-0.0625em] text-white lg:px-[40px]">
        {lines.map((line) => (
          <span key={line} className="block overflow-hidden">
            <span className="services-heading-inner block">{line}</span>
          </span>
        ))}
      </h2>
    </section>
  );
}
