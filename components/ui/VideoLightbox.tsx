"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { hush } from "@/lib/hush";
import VideoPlayer from "@/components/ui/VideoPlayer";

type VideoLightboxProps = {
  src: string;
  poster?: string;
  /** Names the film in the dialog's accessible name. */
  title: string;
  onClose: () => void;
};

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"]), [role="slider"]';

/**
 * The full-screen, full-volume view of a showreel.
 *
 * Rendered through a portal into <body> rather than in place, and that is not a
 * style preference. GSAP has transforms running on several of the ancestors
 * these players sit inside, and a transformed ancestor becomes the containing
 * block for `position: fixed` — the overlay would be trapped inside the section
 * that opened it and clipped by its `overflow: hidden`.
 */
export default function VideoLightbox({ src, poster, title, onClose }: VideoLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const release = hush();
    const opener = document.activeElement as HTMLElement | null;

    // Locking the body would collapse the scrollbar and shift the whole page
    // behind the overlay, so its width is paid back as padding.
    const gap = window.innerWidth - document.documentElement.clientWidth;
    const { overflow, paddingRight } = document.body.style;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;

    // Focus lands on the player itself, via its own `autoFocus` — its shortcuts
    // are bound to that element, so anything else focused here would swallow
    // the space bar before it ever reached them.

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      // Nothing behind the overlay should be reachable, so the tab ring wraps
      // around the controls inside it.
      const stops = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [],
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (stops.length === 0) return;

      const first = stops[0];
      const last = stops[stops.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (!dialogRef.current?.contains(active)) {
        event.preventDefault();
        first.focus();
      } else if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown, true);

    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      release();
      opener?.focus?.();
    };
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      // Backdrop only: a click that started on the player and drifted off it
      // would otherwise close the lightbox mid-scrub.
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm lg:p-10"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close the video"
        className="absolute right-4 top-4 z-10 flex size-[48px] items-center justify-center rounded-full bg-white/10 text-white outline-offset-2 transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-green lg:right-8 lg:top-8"
      >
        <svg viewBox="0 0 24 24" className="size-[20px]" fill="none" aria-hidden>
          <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>

      {/* Held to 16:9 so the controls sit on the film rather than on a letterbox
          band, and capped by height as well as width so a wide, short window
          does not push the control bar off screen. */}
      <div className="max-h-full w-full max-w-[1400px]">
        <VideoPlayer
          src={src}
          poster={poster}
          title={title}
          autoPlay
          autoFocus
          className="aspect-video max-h-[calc(100svh-2rem)] w-full rounded-[8px] shadow-2xl lg:max-h-[calc(100svh-5rem)]"
        />
      </div>
    </div>,
    document.body,
  );
}
