"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";
import { FAQS } from "@/lib/faqs";

export default function Faq() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openId, setOpenId] = useState<string>(FAQS[0].id);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 78%" });

      gsap.from(".faq-heading-inner", {
        yPercent: 110,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: trigger,
      });

      gsap.from(".faq-meta", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: trigger,
      });

      gsap.from(".faq-divider", {
        scaleX: 0,
        duration: 1.1,
        ease: "power2.inOut",
        transformOrigin: "left center",
        scrollTrigger: trigger,
      });

      gsap.from(".faq-item", {
        y: 32,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.09,
        scrollTrigger: reveal(document.querySelector(".faq-list"), { start: "top 88%" }),
      });

      gsap.from(".faq-aside", {
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: reveal(document.querySelector(".faq-list"), { start: "top 88%" }),
      });
    },
    { scope: sectionRef },
  );

  // The panel height is animated by CSS grid rows; GSAP handles the copy inside
  // so an opening answer settles instead of snapping into place.
  useGSAP(
    () => {
      if (!openId || prefersReducedMotion()) return;

      const panel = sectionRef.current?.querySelector(`#faq-panel-${openId} p`);
      if (!panel) return;

      gsap.fromTo(
        panel,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", delay: 0.12 },
      );
    },
    { scope: sectionRef, dependencies: [openId] },
  );

  return (
    <section
      ref={sectionRef}
      data-node-id="156:7339"
      className="w-full bg-[#111] px-6 py-[80px] lg:px-0 lg:py-[100px]"
    >
      <div className="mx-auto flex w-full max-w-[1296px] flex-col gap-[48px] lg:gap-[80px]">
        <div className="flex w-full flex-col gap-[40px]">
          <div className="flex w-full flex-col items-start justify-between gap-6 lg:flex-row lg:items-start">
            <p className="faq-meta font-body text-[18px] font-medium leading-[18px] tracking-[-0.25px] text-ash-muted">
              [ FAQ ]
            </p>
            <div className="w-full lg:max-w-[907.2px] lg:pr-[431.02px]">
              <h2 className="font-display text-[clamp(2.25rem,4.4vw,64px)] font-medium leading-[1] tracking-[-3px] text-white">
                <span className="block overflow-hidden">
                  <span className="faq-heading-inner block">Questions We Get</span>
                </span>
                <span className="block overflow-hidden">
                  <span className="faq-heading-inner block">Asked Most</span>
                </span>
              </h2>
            </div>
          </div>

          <div className="faq-divider h-px w-full bg-[#313131]" />

          <div className="flex w-full items-start lg:pl-[388.81px]">
            <div className="flex w-full flex-col items-start justify-between gap-6 lg:max-w-[907.2px] lg:flex-row lg:items-start">
              <p className="faq-meta font-display text-[20px] leading-[1.3] tracking-[-0.25px] text-ash-muted lg:pr-[41.25px]">
                Timelines, pricing, ownership and what happens after launch &mdash; laid
                out plainly before we begin.
              </p>
              <p className="faq-meta shrink-0 font-body text-[18px] font-medium leading-[18px] tracking-[-0.25px] text-ash-muted">
                QUESTION [6+]
              </p>
            </div>
          </div>
        </div>

        <div className="grid w-full gap-[48px] lg:grid-cols-[minmax(0,0.4fr)_minmax(0,1.3fr)] lg:gap-[100px]">
          <div className="flex flex-col items-start gap-[40px] lg:justify-end lg:self-end">
            <p className="faq-aside font-display text-[36px] font-medium leading-[39.6px] tracking-[-1px] text-white lg:pr-[106.96px]">
              Still have questions?
            </p>
            <Link
              href="/contact"
              className="faq-aside group flex items-center justify-center gap-[8px] rounded-[1000px] border border-[#767676] px-[32px] py-[16px] transition-colors hover:border-white"
            >
              <span className="font-body text-[18px] font-medium leading-[27px] tracking-[-0.25px] text-white">
                Ask us anything
              </span>
              <span className="relative size-[22px] shrink-0 transition-transform duration-500 group-hover:rotate-90">
                <Image
                  src="/icons/icon-faq-button-plus.svg"
                  alt=""
                  fill
                  className="object-contain"
                />
              </span>
            </Link>
          </div>

          <div className="faq-list flex w-full flex-col items-start gap-[40px]">
            {FAQS.map((item) => {
              const isOpen = item.id === openId;

              return (
                <div key={item.id} className="faq-item flex w-full flex-col">
                  <h3 className="w-full">
                    <button
                      type="button"
                      onClick={() => setOpenId(isOpen ? "" : item.id)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${item.id}`}
                      className="group flex w-full items-center justify-between gap-6 text-left"
                    >
                      <span className="font-display text-[22px] leading-[26.4px] tracking-[-0.25px] text-white transition-colors group-hover:text-primary-orange">
                        {item.question}
                      </span>
                      <span
                        className={`flex size-[40px] shrink-0 items-center justify-center rounded-[40px] transition-transform duration-[450ms] ease-in-out ${
                          isOpen ? "rotate-45" : "rotate-0"
                        }`}
                      >
                        <Image
                          src={
                            isOpen
                              ? "/icons/icon-faq-close-32.svg"
                              : "/icons/icon-faq-plus-32.svg"
                          }
                          alt=""
                          width={32}
                          height={32}
                          className="size-[32px]"
                        />
                      </span>
                    </button>
                  </h3>

                  {/* grid-rows 0fr -> 1fr animates the panel without measuring
                      heights, and stays collapsed even before JS runs. */}
                  <div
                    id={`faq-panel-${item.id}`}
                    aria-hidden={!isOpen}
                    className={`grid w-full transition-[grid-template-rows,opacity] duration-[450ms] ease-in-out lg:max-w-[685.94px] lg:pr-[33.69px] ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="pt-[20px] font-body text-[18px] leading-[27px] tracking-[-0.25px] text-ash-muted">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
