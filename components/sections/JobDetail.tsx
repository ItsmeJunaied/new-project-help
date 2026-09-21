"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reveal } from "@/lib/anim";
import RuleList from "@/components/ui/RuleList";
import type { Job } from "@/lib/careers";

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="w-full font-display text-[32px] font-semibold leading-[46px] text-pure-black">
      {children}
    </h2>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex w-full list-disc flex-col gap-[14px] pl-[26px] font-body text-[16px] leading-[24px] tracking-[-0.16px] text-ash-dark marker:text-primary-orange">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

/**
 * A single role, laid out like the article page: meta rail on the left, the
 * long copy beside it. Keeps the career page's own visual language rather than
 * importing the live site's card treatment.
 */
export default function JobDetail({ job }: { job: Job }) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".job-title", { y: 40, opacity: 0, duration: 1, ease: "power3.out", delay: 0.15 });
      gsap.from(".job-aside", { y: 24, opacity: 0, duration: 0.9, ease: "power2.out", delay: 0.4 });

      gsap.utils.toArray<HTMLElement>(".job-block").forEach((block) => {
        gsap.from(block, {
          y: 28,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: reveal(block, { start: "top 92%" }),
        });
      });

      gsap.from(".job-divider", {
        scaleY: 0,
        duration: 1.2,
        ease: "power2.inOut",
        transformOrigin: "top center",
        scrollTrigger: reveal(
          sectionRef.current?.querySelector(".job-columns") ?? null,
          { start: "top 82%" },
        ),
      });
    },
    { scope: sectionRef },
  );

  const facts: [string, string][] = [
    ["Department", job.department],
    ["Type", job.type],
    ["Location", job.location],
    ["Compensation", job.salary],
  ];

  return (
    <section ref={sectionRef} className="w-full bg-bg pb-[80px] pt-[40px] lg:pb-[120px] lg:pt-[90px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col px-6 lg:px-0">
        <Link
          href="/career"
          className="mb-[24px] inline-flex items-center gap-[8px] font-body text-[15px] leading-[22px] tracking-[-0.16px] text-[#707070] transition-colors hover:text-black"
        >
          ← All open roles
        </Link>

        <div className="flex w-full flex-col items-start gap-[40px] lg:flex-row lg:items-start lg:justify-between lg:gap-0">
          <h1 className="job-title font-display text-[clamp(2.5rem,4.7vw,68px)] font-medium leading-[1.1] tracking-[-1.5px] text-black lg:min-w-0 lg:max-w-[917px] lg:flex-1">
            {job.title}
          </h1>

          <RuleList
            title="{ OPEN ROLE }"
            body={job.summary}
            className="job-aside w-full lg:h-[150px] lg:w-auto"
            contentClassName="lg:w-[322px]"
          />
        </div>

        <div className="job-columns relative mt-[48px] flex w-full flex-col gap-[48px] lg:mt-[67px] lg:flex-row lg:gap-0">
          <div className="flex w-full flex-col gap-[24px] lg:w-[546px] lg:shrink-0">
            <div className="job-block flex w-full flex-col">
              {facts.map(([label, value]) => (
                <div key={label} className="flex w-full flex-col">
                  <span className="block h-px w-full bg-[#e7e7e7]" aria-hidden />
                  <div className="flex min-h-[56px] items-center justify-between gap-[16px] py-[10px]">
                    <span className="font-display text-[14px] font-medium uppercase leading-[1.2] tracking-[0.5px] text-[#707070]">
                      {label}
                    </span>
                    <span className="text-right font-display text-[18px] font-medium leading-[1.2] tracking-[-0.18px] text-black">
                      {value}
                    </span>
                  </div>
                </div>
              ))}
              <span className="block h-px w-full bg-[#e7e7e7]" aria-hidden />

              <Link
                href="#apply"
                className="mt-[28px] flex w-full items-center justify-center rounded-[100px] bg-primary-orange px-[24px] py-[14px] font-body text-[16px] font-medium leading-[24px] tracking-[-0.25px] text-white transition-opacity hover:opacity-85 sm:w-auto sm:self-start"
              >
                Apply for this role
              </Link>

              <p className="mt-[14px] font-body text-[14px] leading-[20px] tracking-[-0.16px] text-[#707070]">
                Prefer email? Send your CV to{" "}
                <a
                  href={`mailto:${job.applyEmail}?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
                  className="text-black underline underline-offset-[3px] transition-colors hover:text-primary-orange"
                >
                  {job.applyEmail}
                </a>
                .
              </p>
            </div>
          </div>

          <span
            aria-hidden
            className="job-divider hidden self-stretch bg-[#e7e7e7] lg:ml-[31px] lg:mr-[31px] lg:block lg:w-px"
          />

          <div className="flex w-full min-w-0 flex-col gap-[36px] lg:max-w-[832px] lg:flex-1">
            <div className="job-block flex w-full flex-col gap-[18px]">
              <Heading>About the role</Heading>
              <p className="w-full font-body text-[16px] leading-[24px] tracking-[-0.16px] text-ash-dark">
                {job.intro}
              </p>
            </div>

            <div className="job-block flex w-full flex-col gap-[18px]">
              <Heading>What you&rsquo;ll do</Heading>
              <BulletList items={job.responsibilities} />
            </div>

            <div className="job-block flex w-full flex-col gap-[18px]">
              <Heading>What we&rsquo;re looking for</Heading>
              <BulletList items={job.requirements} />
            </div>

            <div className="job-block flex w-full flex-col gap-[18px]">
              <Heading>What you get</Heading>
              <BulletList items={job.benefits} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
