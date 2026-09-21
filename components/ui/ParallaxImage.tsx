"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/anim";

// A scroll parallax only works if the moving layer is bigger than the window it
// moves inside — otherwise the drift uncovers the section behind it and you get
// a band of background colour along one edge. The layer is OVERSCAN taller than
// its frame and starts centred, so it stays covered across the whole travel.
// Keep TRAVEL below 50 * OVERSCAN / (1 + OVERSCAN) or the edge reappears.
const OVERSCAN = 0.16;
const TRAVEL = 5;

type ParallaxImageProps = {
  src: string;
  alt: string;
  sizes: string;
  /** Classes for the clipping frame. Must establish a positioning context. */
  className?: string;
  /** Classes for the image itself — object-position, mostly. */
  imageClassName?: string;
  preload?: boolean;
};

export default function ParallaxImage({
  src,
  alt,
  sizes,
  className = "relative h-full w-full",
  imageClassName = "object-center",
  preload = false,
}: ParallaxImageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const layerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Scroll-linked drift is exactly the kind of motion the reduce-motion
      // setting is asking us not to produce, so the layer just sits centred.
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        layerRef.current,
        { yPercent: -TRAVEL },
        {
          yPercent: TRAVEL,
          ease: "none",
          scrollTrigger: {
            trigger: frameRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    { scope: frameRef },
  );

  return (
    <div ref={frameRef} className={`overflow-hidden ${className}`}>
      <div
        ref={layerRef}
        className="absolute inset-x-0 will-change-transform"
        style={{ top: `${-OVERSCAN * 50}%`, height: `${(1 + OVERSCAN) * 100}%` }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className={`object-cover ${imageClassName}`}
          preload={preload}
        />
      </div>
    </div>
  );
}
