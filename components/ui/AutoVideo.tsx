"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/anim";

type AutoVideoProps = {
  src: string;
  /** Frame from the film itself, painted until enough of it has buffered. */
  poster: string;
  className?: string;
  /**
   * Fetch the file on mount instead of waiting for the frame to come near the
   * viewport. For the hero only — everything below the fold should wait.
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
  const [loaded, setLoaded] = useState(eager);

  useEffect(() => {
    if (loaded) return;
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
  }, [loaded]);

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
