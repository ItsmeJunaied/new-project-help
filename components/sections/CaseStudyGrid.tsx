"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";
import { PUBLISHED_CASE_STUDIES, caseStudyRows, type CaseStudy } from "@/lib/case-studies";

function CaseCard({ item, wide }: { item: CaseStudy; wide?: boolean }) {
  const imageRef = useRef<HTMLDivElement>(null);

  return (
    <article className="case-card flex w-full flex-col items-start gap-[24px]">
      <Link
        href={`/case-study/${item.slug}`}
        className="case-card-frame relative w-full overflow-hidden"
        onMouseEnter={() => {
          gsap.to(imageRef.current, { scale: 1.05, duration: 0.7, ease: "power3.out" });
        }}
        onMouseLeave={() => {
          gsap.to(imageRef.current, { scale: 1, duration: 0.7, ease: "power3.out" });
        }}
      >
        <div
          ref={imageRef}
          className={`relative w-full ${
            wide ? "h-[280px] md:h-[480px] lg:h-[693px]" : "h-[280px] sm:h-[400px] lg:h-[500px]"
          }`}
        >
          <Image
            src={item.card.src}
            alt={item.card.alt}
            fill
            sizes={wide ? "(max-width: 1023px) 100vw, 1440px" : "(max-width: 1023px) 100vw, 710px"}
            className="object-cover"
          />
        </div>
      </Link>

      {/* Title and copy stay on the 686px measure even on the wide card, so
          every tile is the same height. */}
      <div className="case-card-body flex w-full flex-col items-start">
        <h2 className="w-full font-display text-[26px] font-semibold leading-[1.2] text-black sm:text-[32px] sm:leading-[46px] lg:max-w-[686px]">
          <Link href={`/case-study/${item.slug}`} className="transition-opacity hover:opacity-70">
            {item.cardTitle}
          </Link>
        </h2>
        <p className="mt-[8px] w-full font-display text-[17px] leading-[1.3] tracking-[-0.25px] text-[#3f3f46] sm:text-[20px] lg:max-w-[710px]">
          {item.summary}
        </p>
        <div className="mt-[15.6px] flex items-center gap-6 pt-[16px]">
          {item.categories.map((category, i) => (
            <div key={category} className="flex items-center gap-6">
              {i > 0 && <span className="size-[6px] shrink-0 rounded-[3px] bg-[#e5212b]" />}
              <span className="font-body text-[16px] tracking-[-0.16px] text-[#0a0a0a]">
                {category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function CaseStudyGrid() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".case-card").forEach((card) => {
        const trigger = reveal(card, { start: "top 88%" });

        gsap.from(card.querySelector(".case-card-frame"), {
          clipPath: "inset(100% 0% 0% 0%)",
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: trigger,
        });

        gsap.from(card.querySelector(".case-card-body"), {
          y: 32,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          delay: 0.2,
          scrollTrigger: trigger,
        });

        if (prefersReducedMotion()) return;

        gsap.fromTo(
          card.querySelector("img"),
          { yPercent: -5 },
          {
            yPercent: 5,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-node-id="156:9425"
      className="w-full bg-bg pb-[80px] lg:pb-[204px]"
    >
      {/* Two-up, then one full-bleed, repeating — so the rhythm holds however
          many projects the data carries. */}
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[48px] px-6 lg:gap-[71px] lg:px-[40px]">
        {caseStudyRows(PUBLISHED_CASE_STUDIES).map((row) =>
          row.wide ? (
            <CaseCard key={row.items[0].slug} item={row.items[0]} wide />
          ) : (
            <div
              key={row.items[0].slug}
              className="grid w-full gap-[48px] lg:grid-cols-2 lg:gap-[20px]"
            >
              {row.items.map((item) => (
                <CaseCard key={item.slug} item={item} />
              ))}
            </div>
          ),
        )}
      </div>
    </section>
  );
}
