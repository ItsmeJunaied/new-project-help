"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reveal } from "@/lib/anim";
import ParallaxImage from "@/components/ui/ParallaxImage";

type ImageShowcaseProps = {
  src?: string;
  alt?: string;
  /** Height of the full-bleed frame. */
  heightClassName?: string;
  nodeId?: string;
};

export default function ImageShowcase({
  src = "/images/showcase-collaboration.webp",
  alt = "Two colleagues collaborating over a laptop",
  heightClassName = "h-[420px] sm:h-[600px] lg:h-[1096px]",
  nodeId = "156:7257",
}: ImageShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        revealRef.current,
        { scale: 1.15, clipPath: "inset(6% round 0px)" },
        {
          scale: 1,
          clipPath: "inset(0% round 0px)",
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: reveal(sectionRef.current, { start: "top 88%" }),
        },
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-node-id={nodeId}
      className="relative w-full overflow-hidden bg-[#111111]"
    >
      <div ref={revealRef} className={`w-full ${heightClassName}`}>
        <ParallaxImage
          src={src}
          alt={alt}
          sizes="100vw"
          className="relative h-full w-full"
        />
      </div>
    </section>
  );
}
