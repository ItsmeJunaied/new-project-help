"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { countUp, prefersReducedMotion, reveal } from "@/lib/anim";

type Industry = {
  id: string;
  name: string;
  status: string;
  count: string;
  image: { src: string; alt: string };
};

/** The industries the studio has shipped into, with delivered project counts. */
const INDUSTRIES: Industry[] = [
  {
    id: "ecommerce-retail",
    name: "E-Commerce & Retail",
    status: "Storefronts & marketplaces",
    count: "09×",
    image: {
      src: "/images/award-webflow-showcase.png",
      alt: "Retail product display used in an eCommerce build",
    },
  },
  {
    id: "saas-b2b",
    name: "SaaS & B2B Platforms",
    status: "Multi-tenant products",
    count: "07×",
    image: {
      src: "/images/award-pixelcraft-design.png",
      alt: "Two phones showing a SaaS product interface",
    },
  },
  {
    id: "health-tech",
    name: "Health Tech",
    status: "Clinic & patient systems",
    count: "05×",
    image: {
      src: "/images/award-webhonors.png",
      alt: "Access badge representing controlled clinical access",
    },
  },
  {
    id: "fintech-payments",
    name: "Fintech & Payments",
    status: "Ledgers & reconciliation",
    count: "04×",
    image: {
      src: "/images/award-creatix-portfolio.png",
      alt: "Stacked ledgers representing financial record keeping",
    },
  },
  {
    id: "logistics-supply-chain",
    name: "Logistics & Supply Chain",
    status: "Fleet & warehouse tooling",
    count: "03×",
    image: {
      src: "/images/award-agencyrank.png",
      alt: "Round signboard mounted on a metal arm",
    },
  },
];

type AwardsProps = {
  /** The About page sits this block on a different vertical rhythm. */
  spacingClassName?: string;
};

export default function Awards({
  spacingClassName = "py-[80px] lg:pb-[200px] lg:pt-[180px]",
}: AwardsProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 78%" });

      gsap.from(".awards-heading-inner", {
        yPercent: 110,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: trigger,
      });

      gsap.from(".awards-meta", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: trigger,
      });

      gsap.from(".awards-divider", {
        scaleX: 0,
        duration: 1.1,
        ease: "power2.inOut",
        transformOrigin: "left center",
        scrollTrigger: trigger,
      });

      const counter = document.querySelector<HTMLElement>(".awards-count");
      if (counter) {
        countUp(counter, INDUSTRIES.length, reveal(counter, { start: "top 88%" }), 1.2);
        gsap.from(counter, {
          scale: 0.86,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: reveal(counter, { start: "top 88%" }),
        });
      }

      // Rows arrive one at a time, each with its own rule drawing in first, so
      // the list builds rather than appearing whole.
      gsap.utils.toArray<HTMLElement>(".award-row").forEach((row) => {
        const rowTrigger = reveal(row, { start: "top 92%" });

        gsap.from(row, {
          y: 36,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: rowTrigger,
        });

        const rule = row.parentElement?.querySelector(".award-rule");
        if (rule) {
          gsap.from(rule, {
            scaleX: 0,
            duration: 0.8,
            ease: "power2.inOut",
            transformOrigin: "left center",
            scrollTrigger: rowTrigger,
          });
        }
      });

      if (prefersReducedMotion()) return;

      gsap.utils.toArray<HTMLElement>(".award-row").forEach((row) => {
        const image = row.querySelector(".award-image");
        const name = row.querySelector(".award-name");
        if (!image || !name) return;

        const enter = () => {
          gsap.to(image, { scale: 1.12, duration: 0.6, ease: "power3.out" });
          gsap.to(name, { x: 10, duration: 0.6, ease: "power3.out" });
        };
        const leave = () => {
          gsap.to(image, { scale: 1, duration: 0.6, ease: "power3.out" });
          gsap.to(name, { x: 0, duration: 0.6, ease: "power3.out" });
        };

        row.addEventListener("pointerenter", enter);
        row.addEventListener("pointerleave", leave);
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-node-id="156:7260"
      className={`w-full bg-bg ${spacingClassName}`}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[48px] px-6 lg:gap-[80px] lg:px-[40px]">
        <div className="flex w-full flex-col gap-[40px]">
          <div className="flex w-full flex-col items-start justify-between gap-6 lg:flex-row lg:items-start">
            <p className="awards-meta font-body text-[18px] font-medium leading-[18px] tracking-[-0.25px] text-[#111]">
              [ INDUSTRIES WE SERVE ]
            </p>
            <div className="w-full lg:max-w-[907.2px] lg:pr-[333.83px]">
              <h2 className="font-display text-[clamp(2.25rem,4.4vw,64px)] font-medium leading-[1] tracking-[-3px] text-[#111]">
                <span className="block overflow-hidden">
                  <span className="awards-heading-inner block">Domains We Know</span>
                </span>
                <span className="block overflow-hidden">
                  <span className="awards-heading-inner block">Inside Out</span>
                </span>
              </h2>
            </div>
          </div>

          <div className="awards-divider h-px w-full bg-[#e6e9dd]" />

          <div className="flex w-full items-start lg:pl-[388.81px]">
            <div className="flex w-full flex-col items-start gap-6 lg:max-w-[907.2px] lg:flex-row lg:gap-[277.58px]">
              <p className="awards-meta font-display text-[20px] leading-[24px] tracking-[-0.25px] text-[#707070] lg:pr-[17.79px]">
                Regulated data, campaign-day traffic, offline-first field work &mdash; we
                have shipped into each of these before, so the constraints are not a
                surprise halfway through the build.
              </p>
              <p className="awards-meta shrink-0 font-display text-[18px] font-medium leading-[1.2] tracking-[-0.18px] text-[#111]">
                SELECTED [05]
              </p>
            </div>
          </div>
        </div>

        <div className="grid w-full gap-[48px] lg:grid-cols-[minmax(0,0.5fr)_minmax(0,1.5fr)] lg:gap-[80px]">
          <div className="flex w-full flex-col items-start gap-[24px] lg:w-[304px] lg:gap-[38.8px]">
            <p className="awards-count w-full font-display text-[clamp(5rem,11.5vw,165px)] leading-[122px] tracking-[-10px] text-[#1f1f1f]">
              05
            </p>
            <p className="w-full font-display text-[28px] font-medium leading-[33.6px] tracking-[-1px] text-[#111]">
              Industries served across 28+ delivered projects
            </p>
          </div>

          <ul className="award-list flex w-full flex-col items-start gap-[12px]">
            {INDUSTRIES.map((industry, i) => (
              <li key={industry.id} className="flex w-full flex-col gap-[12px]">
                {i > 0 && <span className="award-rule h-px w-full bg-[#e6e9dd]" aria-hidden />}
                <div className="award-row flex w-full cursor-default flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-[24px] lg:max-w-[392.86px] lg:min-w-[392.84px]">
                    <div className="flex h-[90px] w-[106.47px] shrink-0 items-center justify-center overflow-hidden lg:w-[148px]">
                      <div className="award-image relative h-[90px] w-[106.47px] shrink-0 overflow-hidden">
                        <Image
                          src={industry.image.src}
                          alt={industry.image.alt}
                          fill
                          sizes="107px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <p className="award-name font-display text-[24px] font-medium leading-[24px] tracking-[-0.25px] text-[#111]">
                      {industry.name}
                    </p>
                  </div>

                  <p className="font-body text-[18px] leading-[27px] tracking-[-0.25px] text-[#707070] lg:min-w-[134.66px]">
                    {industry.status}
                  </p>

                  <p className="font-display text-[18px] font-medium leading-[18px] tracking-[-0.25px] text-[#111]">
                    {industry.count}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
