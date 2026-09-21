"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reveal } from "@/lib/anim";

// The strip is 2290px wide and centred, so it bleeds past both edges of the
// canvas exactly as it does in the design. Tiles alternate 371 / 451 tall.
const TILES = [
  { src: "/images/career-strip-1.jpg", alt: "Portrait in black and white", tall: false },
  { src: "/images/career-strip-2.jpg", alt: "Portrait lit in warm orange", tall: true },
  { src: "/images/career-strip-3.jpg", alt: "Portrait taken outdoors at night", tall: false },
  { src: "/images/career-strip-4.jpg", alt: "Portrait in a dark turtleneck", tall: true },
  { src: "/images/career-strip-5.jpg", alt: "Portrait against an orange spotlight", tall: false },
  { src: "/images/career-strip-6.jpg", alt: "Portrait in cool blue light", tall: true },
];

export default function CareerGallery() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".gallery-tile", {
        y: 48,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: reveal(sectionRef.current, { start: "top 88%" }),
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-node-id="156:11363"
      className="w-full overflow-hidden bg-[#f4f4f4] py-[80px] lg:py-[223px]"
    >
      <div className="mx-auto flex w-full items-start gap-[20px] overflow-x-auto px-6 lg:w-[2290px] lg:overflow-visible lg:px-0">
        {TILES.map((tile) => (
          <div
            key={tile.src}
            className={`gallery-tile relative w-[240px] shrink-0 overflow-hidden lg:w-[365px] ${
              tile.tall ? "h-[380px] lg:h-[451px]" : "h-[320px] lg:h-[371px]"
            }`}
          >
            <Image
              src={tile.src}
              alt={tile.alt}
              fill
              sizes="(max-width: 1023px) 240px, 365px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
