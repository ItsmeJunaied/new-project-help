"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/anim";

type AutoVideoProps = {
  src: string;
  /** Frame from the film itself, painted until enough of it has buffered. */
  poster: string;
  className?: string;
  /**
   * Skip the "is it near the viewport yet" wait, because this frame is already
   * in it. For the hero only — everything below the fold should wait.
   *
   * It does NOT mean "fetch during mount". See the effect below.
   */
  eager?: boolean;
  /**
   * Background film that carries no information of its own, so it is hidden
   * from assistive tech. Anything else needs a `label`.
   */
  decorative?: boolean;
  label?: string;
};

/**
 * A muted film that plays while it is on screen and pauses the moment it is not.
 *
 * Two separate observers, because they answer different questions. The first
 * decides when to attach `src` at all, a screen ahead of the frame, so a video
 * three sections down costs nothing until the visitor is heading for it. The
 * second starts and stops playback on the frame actually being visible, which
 * keeps a decoder off the CPU for every film that happens to be further down
 * the page.
 *
 * Autoplay is refused by every browser unless the video is muted and inline, so
 * both are non-negotiable here; `muted` is also set on the element directly
 * because React has historically dropped it from the initial markup, and a
 * single missed frame of that is a silent refusal to play.
 */
export default function AutoVideo({
  src,
  poster,
  className = "",
  eager = false,
  decorative = false,
  label,
}: AutoVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  /**
   * An eager film still waits for the page to finish loading.
   *
   * `eager` used to attach the src during mount, which put a multi-megabyte
   * download in the same queue as the stylesheet, the fonts and the LCP image
   * — all of which the visitor can see and none of which can be seen until
   * they arrive. The film cannot: it has a poster over it, which is a frame of
   * the film itself, so there is nothing to look at either way for the first
   * second.
   *
   * So it goes after `load`, and after an idle callback on top of that. The
   * poster carries the frame until it arrives, exactly as it did before, and
   * the page's own paint no longer competes with it.
   */
  useEffect(() => {
    if (!eager || loaded) return;

    let idle: number | null = null;

    const begin = () => {
      // requestIdleCallback is still missing on Safari, where the timeout is
      // the whole implementation rather than a fallback.
      const schedule =
        window.requestIdleCallback ?? ((cb: IdleRequestCallback) => window.setTimeout(cb, 200));
      idle = schedule(() => setLoaded(true)) as unknown as number;
    };

    if (document.readyState === "complete") begin();
    else window.addEventListener("load", begin, { once: true });

    return () => {
      window.removeEventListener("load", begin);
      if (idle !== null) window.cancelIdleCallback?.(idle);
    };
  }, [eager, loaded]);

  useEffect(() => {
    if (loaded || eager) return;
    const el = videoRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setLoaded(true);
        observer.disconnect();
      },
      { rootMargin: "400px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loaded, eager]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !loaded) return;

    // A looping background film is exactly the motion the reduce-motion setting
    // asks us not to produce, so it stays on its poster frame.
    if (prefersReducedMotion()) return;

    el.muted = true;

    const play = () => {
      // Rejects whenever the browser declines — a tab that was never
      // foregrounded, a data saver, an OS low-power mode. The poster stays up,
      // which is a perfectly good outcome and not worth an unhandled rejection.
      void el.play().catch(() => {});
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !document.hidden) play();
          else el.pause();
        }
      },
      { threshold: 0.01 },
    );

    observer.observe(el);

    // Switching tabs does not move the frame, so the observer never fires and a
    // decoder would keep running on a page nobody is looking at.
    const onVisibility = () => {
      if (document.hidden) el.pause();
      else if (el.getBoundingClientRect().bottom > 0) play();
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [loaded]);

  return (
    <video
      ref={videoRef}
      className={className}
      poster={poster}
      src={loaded ? src : undefined}
      preload={loaded ? "auto" : "none"}
      muted
      loop
      playsInline
      // These films have no controls at all, but the browser can still offer
      // "Save video as" and picture-in-picture off its own menus.
      controlsList="nodownload noplaybackrate noremoteplayback"
      disablePictureInPicture
      onContextMenu={(event) => event.preventDefault()}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : label}
    />
  );
}
