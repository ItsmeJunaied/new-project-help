"use client";

import { useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/anim";

/**
 * Page-to-page fade.
 *
 * Without it, a client-side navigation swaps the whole document in one frame
 * while every entrance animation on the new page starts from its hidden state —
 * which reads as a flash rather than a transition. A short fade on the incoming
 * page covers that first frame.
 *
 * Deliberately entrance-only: an exit animation would mean holding the old page
 * while the new one loads, which makes every link feel slower than it is.
 */
export default function RouteTransition({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const firstRender = useRef(true);

  useGSAP(
    () => {
      // The first paint is the server-rendered page; fading that in would just
      // delay the LCP element for no benefit.
      if (firstRender.current) {
        firstRender.current = false;
        return;
      }

      if (prefersReducedMotion()) return;

      gsap.fromTo(
        wrapperRef.current,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
          onComplete: () => {
            // A transform on this wrapper makes it the containing block for
            // every position:fixed descendant — which silently re-anchors the
            // mobile menu to the whole document instead of the viewport. The
            // tween has to leave no transform behind at all.
            gsap.set(wrapperRef.current, { clearProps: "transform,opacity" });

            // Section triggers on the new page were measured against a layout
            // that was still settling; one refresh once the fade lands puts
            // every start position back where it belongs.
            ScrollTrigger.refresh();
          },
        },
      );
    },
    { dependencies: [pathname] },
  );

  return <div ref={wrapperRef}>{children}</div>;
}
