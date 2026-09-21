"use client";

import { useRef } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/anim";

/**
 * Reading-progress rule across the top of the window.
 *
 * These pages are long — the case studies run several screens — and a hairline
 * that fills as you scroll is the cheapest way to answer "how much is left".
 * It is driven by a scrubbed ScrollTrigger rather than a scroll listener, so it
 * rides the same rAF loop as every other animation on the page instead of
 * adding a second one.
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const trigger = ScrollTrigger.create({
        start: 0,
        // Recomputed on refresh, so lazy images growing the page do not leave
        // the bar finishing early.
        end: () => document.documentElement.scrollHeight - window.innerHeight,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          gsap.set(barRef.current, { scaleX: self.progress });
        },
      });

      return () => trigger.kill();
    },
    // A route change swaps the whole document height out from under it.
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] bg-transparent"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left scale-x-0 bg-primary-orange"
      />
    </div>
  );
}
