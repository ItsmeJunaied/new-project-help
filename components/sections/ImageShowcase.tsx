"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";
import ParallaxImage from "@/components/ui/ParallaxImage";

type ImageShowcaseProps = {
  src?: string;
  alt?: string;
  /** Height of the full-bleed frame. */
  heightClassName?: string;
  /** Small kicker above the caption headline. Both are needed to show one. */
  captionLabel?: string;
  /** Caption headline laid over the lower third of the frame. */
  captionTitle?: string;
  nodeId?: string;
};

export default function ImageShowcase({
  src = "/images/showcase-collaboration.webp",
  alt = "Two colleagues collaborating over a laptop",
  heightClassName = "h-[420px] sm:h-[600px] lg:h-[1096px]",
  captionLabel,
  captionTitle,
  nodeId = "156:7257",
}: ImageShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const hasCaption = Boolean(captionLabel && captionTitle);

  useGSAP(
    () => {
      // The frame opens as the section is scrolled, not on a timer once it
      // arrives: the picture is tied to the scroll position, so it widens under
      // the reader's own hand and holds wherever they stop.
      //
      // `fromTo` rather than `from`, which is what makes `invalidateOnRefresh`
      // safe here — both ends are stated outright, so re-measuring on a refresh
      // cannot mistake the hidden start state for the destination.
      if (prefersReducedMotion()) {
        gsap.set(revealRef.current, { scale: 1, clipPath: "inset(0% round 0px)" });
      } else {
        gsap.fromTo(
          revealRef.current,
          { scale: 1.14, clipPath: "inset(10% 16% 10% 16% round 0px)" },
          {
            scale: 1,
            clipPath: "inset(0% 0% 0% 0% round 0px)",
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              // Fully open by the time the frame's top is a third of the way up
              // the window, so it finishes while there is still picture to look
              // at rather than as it leaves.
              end: "top 30%",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          },
        );
      }

      if (!hasCaption) return;

      // The scrim carries the caption's legibility, so it leads the text in
      // rather than arriving with it.
      gsap.from(".showcase-scrim", {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        delay: 0.25,
        scrollTrigger: reveal(sectionRef.current, { start: "top 88%" }),
      });

      gsap.from(".showcase-caption-line", {
        yPercent: 110,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.45,
        scrollTrigger: reveal(sectionRef.current, { start: "top 88%" }),
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-node-id={nodeId}
      className="relative w-full overflow-hidden bg-[#111111]"
    >
      <div ref={revealRef} className={`relative w-full ${heightClassName}`}>
        <ParallaxImage
          src={src}
          alt={alt}
          sizes="100vw"
          className="relative h-full w-full"
        />

        {hasCaption ? (
          <>
            {/* Sits inside the reveal wrapper so it is clipped and scaled with
                the photograph instead of floating over a frame that is still
                animating. */}
            <div
              aria-hidden
              className="showcase-scrim pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/80 via-black/35 to-transparent"
            />

            <figcaption className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-[1440px] px-6 pb-[48px] lg:px-[40px] lg:pb-[80px]">
              <span className="block overflow-hidden">
                <span className="showcase-caption-line block font-body text-[16px] font-medium leading-[1.6] tracking-[-0.25px] text-primary-green lg:text-[18px]">
                  {captionLabel}
                </span>
              </span>
              <span className="mt-[12px] block overflow-hidden lg:mt-[16px]">
                <span className="showcase-caption-line block max-w-[900px] font-display text-[clamp(1.75rem,3.6vw,52px)] font-medium leading-[1.1] tracking-[-0.03em] text-white">
                  {captionTitle}
                </span>
              </span>
            </figcaption>
          </>
        ) : null}
      </div>
    </section>
  );
}
