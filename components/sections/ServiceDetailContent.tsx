"use client";

import Image from "next/image";
import { useRef } from "react";
import type { ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";
import type { Service } from "@/lib/services";

function Heading({ children }: { children: ReactNode }) {
  return (
    <h2 className="w-full font-display text-[32px] font-semibold leading-[46px] text-black">
      {children}
    </h2>
  );
}

function Paragraph({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "ink" }) {
  return (
    <p
      className={`w-full font-display text-[20px] leading-[1.3] tracking-[-0.25px] ${
        tone === "ink" ? "text-black" : "text-ash-dark"
      }`}
    >
      {children}
    </p>
  );
}

function BulletList({ children }: { children: ReactNode }) {
  return (
    <ul className="flex w-full list-disc flex-col gap-[18px] pl-[30px] font-display text-[20px] leading-[1.3] tracking-[-0.25px] text-ash-dark">
      {children}
    </ul>
  );
}

export default function ServiceDetailContent({ service }: { service: Service }) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".detail-block").forEach((block) => {
        gsap.from(block, {
          y: 36,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: reveal(block, { start: "top 90%" }),
        });
      });

      const ruleList = sectionRef.current?.querySelector(".detail-rule-list") ?? null;

      gsap.from(".detail-rule", {
        scaleX: 0,
        duration: 0.8,
        ease: "power2.inOut",
        stagger: 0.08,
        transformOrigin: "left center",
        scrollTrigger: reveal(ruleList, { start: "top 88%" }),
      });

      if (prefersReducedMotion()) return;

      // Every inline photo drifts a little slower than the page it sits in.
      gsap.utils.toArray<HTMLElement>(".detail-block img").forEach((img) => {
        gsap.fromTo(
          img,
          { yPercent: -3, scale: 1.06 },
          {
            yPercent: 3,
            ease: "none",
            scrollTrigger: {
              trigger: img.parentElement,
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
    <section data-node-id="156:8187" ref={sectionRef} className="w-full bg-bg pb-[80px] lg:pb-[146px]">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[40px]">
        <div className="flex w-full flex-col items-start lg:pl-[243px]">
          {/* Main copy column */}
          <div className="flex w-full flex-col gap-[48px] lg:max-w-[954px]">
            <h2 className="detail-block w-full font-display text-[clamp(2rem,4.4vw,64px)] font-medium leading-[1.1] tracking-[-1.5px] text-black">
              {service.statement}
            </h2>

            <div className="detail-block flex w-full flex-col gap-[18px]">
              <Heading>Working Process</Heading>
              <BulletList>
                {service.process.map((step) => (
                  <li key={step.lead}>
                    <span className="text-black">{step.lead}</span>
                    {step.rest}
                  </li>
                ))}
              </BulletList>
            </div>

            <div className="detail-block flex w-full flex-col gap-[18px]">
              <Heading>{service.architectureHeading}</Heading>
              <Paragraph tone="ink">{service.architectureLead}</Paragraph>
              <BulletList>
                {service.architecturePoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </BulletList>
            </div>

            <div className="detail-block relative h-[280px] w-full overflow-hidden sm:h-[420px] lg:h-[572px]">
              <Image
                src={service.images.process}
                alt={`${service.shortTitle} work in progress on a dark backdrop`}
                fill
                sizes="(max-width: 1023px) 100vw, 954px"
                className="object-cover"
              />
            </div>

            <div className="detail-block flex w-full flex-col gap-[30px]">
              <Heading>What We Deliver</Heading>
              <ul className="detail-rule-list flex w-full flex-col gap-[14px]">
                {service.deliver.map((item) => (
                  <li key={item} className="flex w-full flex-col gap-[14px]">
                    <span className="detail-rule block h-px w-full bg-[#e7e7e7]" aria-hidden />
                    <span className="flex items-center gap-[10px]">
                      <span className="size-[11px] shrink-0 bg-primary-green" aria-hidden />
                      <span className="font-display text-[18px] font-medium leading-[1.2] tracking-[-0.18px] text-black">
                        {item}
                      </span>
                    </span>
                  </li>
                ))}
                <li aria-hidden className="w-full">
                  <span className="detail-rule block h-px w-full bg-[#e7e7e7]" />
                </li>
              </ul>
            </div>

            <div className="detail-block flex w-full flex-col gap-[30px]">
              <div className="flex w-full flex-col gap-[18px]">
                <Heading>{service.handoverHeading}</Heading>
                <Paragraph>{service.handoverCopy}</Paragraph>
              </div>

              <div className="flex w-full flex-col items-center gap-[17px] sm:flex-row">
                <div className="relative aspect-square w-full overflow-hidden sm:w-[470px] lg:w-[470px]">
                  <Image
                    src={service.images.story[0]}
                    alt={`${service.shortTitle} delivery work`}
                    fill
                    sizes="(max-width: 639px) 100vw, 470px"
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square w-full overflow-hidden sm:w-[467px] lg:w-[467px]">
                  <Image
                    src={service.images.story[1]}
                    alt={`${service.shortTitle} in use`}
                    fill
                    sizes="(max-width: 639px) 100vw, 467px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tools & tech runs wider than the copy column */}
          {/* 243 indent + 1197 is exactly the 1440 canvas, so this block takes
              the remaining width rather than a fixed 1197. */}
          <div className="detail-block mt-[48px] flex w-full flex-col gap-[48px] lg:mt-[32px] lg:max-w-[1197px]">
            <div className="flex w-full flex-col gap-[18px]">
              <Heading>Tools &amp; Tech</Heading>
              <ul className="flex flex-wrap items-center gap-[18px]">
                {service.tools.map((tool) => (
                  <li key={tool} className="flex items-center gap-[10px]">
                    <span className="size-[11px] shrink-0 bg-primary-green" aria-hidden />
                    <span className="whitespace-nowrap font-display text-[18px] font-medium leading-[1.2] tracking-[-0.18px] text-black">
                      {tool}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex w-full flex-col items-center gap-[20px] lg:flex-row">
              <div className="relative h-[280px] w-full overflow-hidden sm:h-[403px] lg:w-[467px]">
                <Image
                  src={service.images.tools}
                  alt={`Tools and stack behind our ${service.shortTitle.toLowerCase()} work`}
                  fill
                  sizes="(max-width: 1023px) 100vw, 467px"
                  className="object-cover"
                />
              </div>

              <div className="flex w-full flex-col items-start gap-[48px] lg:min-w-0 lg:max-w-[710px] lg:flex-1 lg:gap-[80px]">
                {service.stats.map((stat, i) => (
                  <div
                    key={`${stat.value}-${i}`}
                    className="flex w-full flex-col items-start gap-[16px] sm:flex-row sm:items-start"
                  >
                    <div className="flex w-[130px] shrink-0 items-center justify-center border-t border-ash-dark pt-[10px]">
                      <span className="whitespace-nowrap font-display text-[64px] font-medium leading-[1.1] tracking-[-1.5px] text-pure-black">
                        {stat.value}
                      </span>
                    </div>
                    <p className="font-display text-[20px] leading-[1.3] tracking-[-0.25px] text-ash-dark lg:max-w-[569px]">
                      {stat.copy}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Closing deliverables list */}
          <div className="detail-block mt-[48px] flex w-full flex-col gap-[18px] lg:mt-[60px] lg:max-w-[954px]">
            <Heading>What You Get</Heading>
            <Paragraph>{service.whatYouGetCopy}</Paragraph>
            <BulletList>
              {service.whatYouGet.map((item) => (
                <li key={item.lead}>
                  <span className="text-black">{item.lead}</span>
                  {item.rest}
                </li>
              ))}
            </BulletList>
          </div>
        </div>
      </div>
    </section>
  );
}
