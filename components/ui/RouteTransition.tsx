"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
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
/**
 * A layout effect in the browser, a no-op on the server.
 *
 * The scroll reset below has to run in the same commit as the new page, before
 * the browser paints it — a plain `useEffect` is a frame too late — and React
 * warns about `useLayoutEffect` during server rendering, where it never runs.
 */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function RouteTransition({ children }: { children: ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  /**
   * The page these effects have already handled.
   *
   * Not a `firstRender` flag: Strict Mode runs an effect twice on mount, and a
   * flag flipped inside the first pass is already spent by the second — which
   * fades the whole document in from opacity 0 on every load in development,
   * and leaves it there if anything stops the tween. Comparing the path is
   * idempotent, so running twice is the same as running once.
   */
  const handledPath = useRef(pathname);
  const scrolledPath = useRef(pathname);

  /**
   * Put a new page at its top.
   *
   * Next does this itself by walking the incoming page for an element to bring
   * into view, and on these pages it settles on one near the bottom: following
   * a link to /contact landed the reader in the footer, several thousand pixels
   * past the form they had clicked towards. This is the plain version of what
   * that was trying to do.
   *
   * `behavior: "auto"` in the options object rather than a bare scrollTo —
   * globals.css sets `scroll-behavior: smooth` on the root, which would
   * otherwise animate this over the length of the page.
   *
   * Skipped on the page this mounted with, where the browser's own restoration
   * is right: a reload or a step back through history should return to where it
   * was, not to the top. An address ending in a fragment belongs to that
   * fragment.
   *
   * A LAYOUT effect, not a plain one. As a plain effect this ran a frame after
   * the new page had already been painted, so following a link from deep in a
   * long page showed the new page at the old offset — the middle of it, or its
   * footer — and only then jumped to the top. Measured at 12290px of scroll,
   * the correction was landing somewhere after 120ms and before 720ms, which is
   * several frames of the wrong thing. A layout effect runs in the same commit
   * as the new DOM, so there is no painted frame to catch.
   */
  useIsomorphicLayoutEffect(() => {
    if (scrolledPath.current === pathname) return;
    scrolledPath.current = pathname;
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  useGSAP(
    () => {
      // The first paint is the server-rendered page; fading that in would just
      // delay the LCP element for no benefit.
      if (handledPath.current === pathname) return;
      handledPath.current = pathname;

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
