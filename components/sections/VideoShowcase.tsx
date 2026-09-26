"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";
import AutoVideo from "@/components/ui/AutoVideo";
import VideoLightbox from "@/components/ui/VideoLightbox";

type VideoShowcaseProps = {
  /** Muted cut that loops in place. */
  src: string;
  /** Full cut with sound, fetched only if someone opens the player. */
  lightboxSrc?: string;
  poster: string;
  title: string;
  nodeId?: string;
};

/**
 * A full-bleed film that runs itself, with the play control riding the cursor.
 *
 * Nobody has to press anything to see this: it starts muted and looping as the
 * section arrives and stops again as it leaves. Pressing it is what adds sound,
 * by handing the full cut to the lightbox.
 *
 * The badge is moved with `gsap.quickTo` rather than by writing `left`/`top` on
 * every pointer event — it interpolates towards the cursor off a single
 * per-frame write, which is both smoother and far cheaper than laying the page
 * out again 120 times a second.
 */
export default function VideoShowcase({
  src,
  lightboxSrc,
  poster,
  title,
  nodeId,
}: VideoShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLSpanElement>(null);
  // Two flags rather than one "active": the badge is the only sign that this
  // frame can be pressed, and with a single flag a mouse leaving the section
  // would put it away while the button still held the keyboard focus ring.
  const [hovering, setHovering] = useState(false);
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const showBadge = hovering || focused;

  useGSAP(
    () => {
      gsap.from(frameRef.current, {
        clipPath: "inset(8% 6% round 0px)",
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: reveal(sectionRef.current, { start: "top 85%" }),
      });

      const badge = badgeRef.current;
      const frame = frameRef.current;
      if (!badge || !frame || prefersReducedMotion()) return;

      // Touch has no cursor to follow, so there the badge just sits in the
      // middle of the frame where a play button belongs.
      if (!window.matchMedia("(hover: hover)").matches) return;

      const moveX = gsap.quickTo(badge, "x", { duration: 0.45, ease: "power3.out" });
      const moveY = gsap.quickTo(badge, "y", { duration: 0.45, ease: "power3.out" });

      const onMove = (event: PointerEvent) => {
        const box = frame.getBoundingClientRect();
        moveX(event.clientX - box.left - box.width / 2);
        moveY(event.clientY - box.top - box.height / 2);
      };

      frame.addEventListener("pointermove", onMove);
      return () => frame.removeEventListener("pointermove", onMove);
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} data-node-id={nodeId} className="relative w-full bg-black">
      <div ref={frameRef} className="relative aspect-video w-full overflow-hidden">
        <AutoVideo
          src={src}
          poster={poster}
          decorative
          className="absolute inset-0 size-full object-cover"
        />

        {/* The whole frame is the control. A cursor-following badge is invisible
            to a keyboard, so the thing that actually takes focus is a button the
            size of the film, and the badge is only its portrait. */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          onPointerEnter={() => setHovering(true)}
          onPointerLeave={() => setHovering(false)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label={`Play ${title} with sound`}
          className="absolute inset-0 size-full outline-offset-[-4px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-green [@media(hover:hover)]:cursor-none"
        >
          {/* Positioned off margins, not `-translate-x-1/2`: GSAP owns this
              element's transform, and a Tailwind translate on the same property
              is overwritten the first time the cursor moves. */}
          <span
            ref={badgeRef}
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -ml-[52px] -mt-[52px] block size-[104px] will-change-transform"
          >
            <span
              className={`flex size-full items-center justify-center rounded-full bg-primary-green text-black shadow-[0_8px_32px_rgba(0,0,0,0.35)] transition-[opacity,transform] duration-300 ease-out ${
                showBadge ? "scale-100 opacity-100" : "scale-75 opacity-0"
              }`}
            >
              <svg viewBox="0 0 24 24" className="ml-[4px] size-[30px]" aria-hidden>
                <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
              </svg>
            </span>
          </span>
        </button>
      </div>

      {open ? (
        <VideoLightbox
          src={lightboxSrc ?? src}
          poster={poster}
          title={title}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </section>
  );
}
