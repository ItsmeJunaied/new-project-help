"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

import RuleList from "@/components/ui/RuleList";

const CORE_STACK = ["React & Next.js", "Node.js & TypeScript", "AWS · Azure · GCP", "Python & AI/ML"];

// The strip alternates tall and short frames across the 1440 grid.
const GALLERY = [
  {
    src: "/images/about-gallery-1.jpg",
    alt: "Studio portrait of a designer at work",
    heightClassName: "lg:h-[405px]",
  },
  {
    src: "/images/about-gallery-2.jpg",
    alt: "Team reviewing printed layouts together",
    heightClassName: "lg:h-[304px]",
  },
  {
    src: "/images/about-gallery-3.jpg",
    alt: "Close-up of a workspace with design tools",
    heightClassName: "lg:h-[405px]",
  },
  {
    src: "/images/about-gallery-4.jpg",
    alt: "Colleagues in conversation at the studio",
    heightClassName: "lg:h-[304px]",
  },
];

export default function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".about-hero-line", {
        yPercent: 110,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.15,
      });

      gsap.from(".about-hero-aside", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
        delay: 0.45,
      });

      gsap.from(".about-hero-frame", {
        y: 48,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.3,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-node-id="156:8621"
      className="w-full bg-bg pb-[80px] pt-[40px] lg:pb-[160px] lg:pt-[57px]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[48px] px-6 lg:gap-[94px] lg:px-[40px]">
        <div className="flex w-full flex-col items-start gap-[40px] lg:flex-row lg:items-start lg:gap-[20px]">
          <h1 className="font-display text-[clamp(3.5rem,8.4vw,160px)] font-medium leading-[1] tracking-[-0.0625em] text-black lg:min-w-0 lg:max-w-[953px] lg:flex-1">
            <span className="block overflow-hidden">
              <span className="about-hero-line block">Our Story</span>
            </span>
          </h1>

          <RuleList
            title="{ Core stack }"
            items={CORE_STACK}
            className="about-hero-aside w-full lg:h-[207px] lg:w-auto"
          />
        </div>

        <div className="grid w-full grid-cols-2 items-start gap-[20px] lg:grid-cols-4">
          {GALLERY.map((frame) => (
            <div
              key={frame.src}
              className={`about-hero-frame relative h-[220px] w-full overflow-hidden sm:h-[300px] ${frame.heightClassName}`}
            >
              <Image
                src={frame.src}
                alt={frame.alt}
                fill
                sizes="(max-width: 1023px) 50vw, 345px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
