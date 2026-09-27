"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reveal } from "@/lib/anim";
import { WORK_DOMAINS } from "@/lib/services";
import { siteConfig } from "@/lib/site";

/**
 * What we actually take on.
 *
 * The about page used to answer this with four technology names in the corner of
 * the hero, which left a reader to guess whether an ERP rebuild, an AI agent or
 * a workflow automation was something we do. The sixteen domains below are the
 * names clients ask for, each with the one line that says what we mean by it,
 * and a link to the service page where the domain has one.
 *
 * The list lives in lib/services.ts beside the seven services it sits behind, so
 * the two cannot drift apart.
 */
export default function AboutCapabilities() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 78%" });

      gsap.from(".capability-heading-inner", {
        yPercent: 110,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: trigger,
      });

      gsap.from(".capability-meta", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: trigger,
      });

      gsap.from(".capability-cell", {
        y: 28,
        opacity: 0,
        duration: 0.65,
        ease: "power2.out",
        stagger: 0.04,
        scrollTrigger: reveal(sectionRef.current?.querySelector(".capability-grid") ?? null, {
          start: "top 88%",
        }),
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="w-full bg-bg py-[80px] lg:py-[140px]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[40px]">
        <div className="flex w-full flex-col items-start gap-[40px] lg:flex-row lg:gap-[100px]">
          <p className="capability-meta shrink-0 font-body text-[18px] font-medium leading-[18px] tracking-[-0.25px] text-[#111]">
            [ What We Do ]
          </p>

          <div className="w-full max-w-[820px]">
            <h2 className="font-display text-[clamp(2rem,4.2vw,56px)] font-medium leading-[1.04] tracking-[-2px] text-black">
              <span className="block overflow-hidden">
                <span className="capability-heading-inner block">
                  Sixteen kinds of work,
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="capability-heading-inner block text-ash-muted">
                  one team accountable.
                </span>
              </span>
            </h2>

            <p className="capability-meta mt-[28px] font-body text-[18px] leading-[28px] tracking-[-0.25px] text-ash-dark">
              {siteConfig.name} has been writing custom software since{" "}
              {siteConfig.founded} — SaaS products and MVPs, ERP and CRM systems
              for businesses that had outgrown spreadsheets, storefronts,
              internal platforms, mobile apps, and the AI and automation work
              that has started arriving with all of them. Most engagements begin
              because something off the shelf almost fitted and then did not.
            </p>

            <p className="capability-meta mt-[20px] font-body text-[16px] leading-[26px] tracking-[-0.2px] text-neutral-paragraph">
              The engineers who scope your build are the ones who write it. Scope,
              wireframes, price and timeline are agreed before a line is
              committed; you see working software every two weeks; and the
              repository sits in your organisation from the first commit rather
              than the last. Six to twelve months of fixes after go-live are part
              of the build, not a separate contract.
            </p>
          </div>
        </div>

        {/* A ruled table rather than sixteen floating cards: one hairline
            between neighbours, drawn by the wrapper's own background showing
            through a 1px gap, so the rules stay exactly 1px at every width. */}
        <div className="capability-grid mt-[56px] grid w-full gap-px border border-black/10 bg-black/10 sm:grid-cols-2 lg:mt-[72px] lg:grid-cols-4">
          {WORK_DOMAINS.map((domain, index) => {
            const inner = (
              <>
                <span className="font-mono text-[11px] leading-none tracking-[0.5px] text-[#a3a3a3] transition-colors duration-500 group-hover:text-primary-green">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="mt-[16px] flex items-start justify-between gap-[10px]">
                  <span className="font-display text-[19px] font-semibold leading-[1.22] tracking-[-0.4px] text-black">
                    {domain.name}
                  </span>
                  {domain.service ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 15 15"
                      fill="none"
                      aria-hidden="true"
                      className="mt-[5px] shrink-0 text-[#c4c4c4] transition-[transform,color] duration-500 group-hover:translate-x-[2px] group-hover:text-black"
                    >
                      <path
                        d="M3 12 12 3M4.6 3H12v7.4"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </span>

                <span className="mt-[10px] font-body text-[14px] leading-[22px] tracking-[-0.16px] text-neutral-paragraph">
                  {domain.copy}
                </span>
              </>
            );

            const shell =
              // The floor keeps the four-across rows even. On one column there
              // is nothing to line up with, and sixteen padded cells make for a
              // long scroll, so they size to their own copy instead.
              "capability-cell group flex flex-col bg-bg p-[24px] transition-colors duration-500 sm:min-h-[188px]";

            return domain.service ? (
              <Link
                key={domain.name}
                href={`/services/${domain.service}`}
                className={`${shell} hover:bg-white`}
              >
                {inner}
              </Link>
            ) : (
              <div key={domain.name} className={shell}>
                {inner}
              </div>
            );
          })}
        </div>

        <div className="mt-[36px] flex w-full flex-col items-start gap-[20px] sm:flex-row sm:items-center sm:justify-between">
          <p className="capability-meta max-w-[620px] font-body text-[15px] leading-[24px] tracking-[-0.16px] text-neutral-paragraph">
            Not sure which of these your problem is? That is what the first call
            is for — we scope it before anyone quotes it.
          </p>

          <div className="flex flex-wrap items-center gap-[12px]">
            <Link
              href="/services"
              className="flex items-center gap-[10px] rounded-[100px] border border-black/15 px-[26px] py-[14px] font-body text-[16px] font-medium leading-[24px] tracking-[-0.25px] text-black transition-colors duration-300 hover:border-black/45"
            >
              All services
            </Link>
            <Link
              href="/contact"
              className="group flex items-center gap-[10px] rounded-[100px] bg-black px-[26px] py-[14px] transition-colors duration-300 hover:bg-primary-green"
            >
              <span className="font-body text-[16px] font-medium leading-[24px] tracking-[-0.25px] text-white transition-colors duration-300 group-hover:text-black">
                Start a project
              </span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                aria-hidden="true"
                className="shrink-0 text-white transition-[transform,color] duration-300 group-hover:translate-x-[3px] group-hover:text-black"
              >
                <path
                  d="M3 12 12 3M4.6 3H12v7.4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
