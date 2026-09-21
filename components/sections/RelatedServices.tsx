"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reveal } from "@/lib/anim";
import { SERVICES } from "@/lib/services";

/**
 * The other six services, listed at the foot of each detail page. Every service
 * page linking to every other is what turns seven isolated pages into a cluster
 * a crawler can traverse — and it is the row a reader wants when this service
 * turns out not to be the one they need.
 */
export default function RelatedServices({ currentSlug }: { currentSlug: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const others = SERVICES.filter((service) => service.slug !== currentSlug);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 86%" });

      gsap.from(".related-head", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: trigger,
      });

      gsap.from(".related-row", {
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.06,
        scrollTrigger: trigger,
      });

      gsap.from(".related-rule", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 0.8,
        ease: "power2.inOut",
        stagger: 0.06,
        scrollTrigger: trigger,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="w-full bg-bg px-6 pb-[80px] lg:px-0 lg:pb-[120px]">
      <div className="mx-auto w-full max-w-[1440px] lg:pl-[243px]">
        <div className="flex w-full flex-col gap-[30px] lg:max-w-[1197px]">
          <h2 className="related-head w-full font-display text-[32px] font-semibold leading-[46px] text-black">
            {currentSlug ? "Other Services" : "All Services"}
          </h2>

          <ul className="flex w-full flex-col gap-[14px]">
            {others.map((service) => (
              <li key={service.slug} className="flex w-full flex-col gap-[14px]">
                <span className="related-rule block h-px w-full bg-[#e7e7e7]" aria-hidden />
                <Link
                  href={`/services/${service.slug}`}
                  className="related-row group flex w-full items-center justify-between gap-[16px] py-[6px]"
                >
                  <span className="flex min-w-0 items-center gap-[10px]">
                    <span className="size-[11px] shrink-0 bg-primary-orange" aria-hidden />
                    <span className="truncate font-display text-[18px] font-medium leading-[1.2] tracking-[-0.18px] text-black transition-colors group-hover:text-primary-orange">
                      {service.title}
                    </span>
                  </span>
                  <span
                    aria-hidden
                    className="shrink-0 font-display text-[20px] leading-none text-black transition-transform duration-300 group-hover:translate-x-[4px]"
                  >
                    &rarr;
                  </span>
                </Link>
              </li>
            ))}
            <li aria-hidden className="w-full">
              <span className="related-rule block h-px w-full bg-[#e7e7e7]" />
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
