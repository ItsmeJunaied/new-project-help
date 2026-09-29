"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reveal } from "@/lib/anim";
import { siteConfig } from "@/lib/site";

/**
 * The questions people have with the form already open.
 *
 * Not the site's shared FAQ, and deliberately not an accordion. An accordion
 * is a filing cabinet: it is the right shape when there are thirty entries and
 * a visitor is hunting one of them, and the wrong shape here, where there are
 * six and the visitor has not thought to ask any of them yet. Hidden behind a
 * plus sign, the answer that would have settled somebody's hesitation is an
 * answer they never saw. Every one is open.
 *
 * The questions are different too. The shared FAQ answers what the company
 * does — timelines, stack, ownership. These answer what happens if you send
 * the thing you are looking at, which is the only decision in front of anyone
 * on this page.
 */

type Entry = { question: string; answer: string };

const ENTRIES: Entry[] = [
  {
    question: "What happens right after I send this?",
    answer:
      "It lands in an inbox the engineers read, not a CRM queue. One of them claims it, and you get a reply from that person by name inside four business hours — with questions, a time to talk, or a straight answer either way.",
  },
  {
    question: "Do I have to know what I want?",
    answer:
      "No. Most of the useful briefs we get are a description of something that is not working, written by somebody who is not technical. If you already have a specification we will read it; if you have a paragraph and a deadline, that is enough to start.",
  },
  {
    question: "Will you sign an NDA before I share anything?",
    answer:
      "Yes, and the same day. Say so in the first line and nothing sensitive needs to go in the form at all — send the shape of the problem, we will send the NDA, and the detail can follow.",
  },
  {
    question: "Does any of this cost money before I sign?",
    answer:
      "Nothing before the contract. The call, the scope, the estimate and the technical questions along the way are all free, and you can stop after any of them owing us nothing. There is no discovery fee and no deposit to get a number.",
  },
  {
    question: "What if we are not a fit?",
    answer:
      "We say so, in the first reply, and point you at whoever would be better. It costs us a lead and saves you a month — and it is the reason the reply comes from an engineer rather than from somebody paid to close.",
  },
  {
    question: "Can you take over something half-built?",
    answer:
      "Often, and it is a large part of what we do. It starts with an audit of the codebase, the infrastructure and the test coverage, and ends with a written plan of what to fix, what to refactor and what to rebuild — before anybody writes a new feature.",
  },
];

export default function ContactFaq() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 84%" });

      gsap.from(".fq-head", {
        y: 22,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: trigger,
      });

      gsap.from(".fq-item", {
        y: 22,
        opacity: 0,
        duration: 0.65,
        ease: "power2.out",
        stagger: 0.08,
        delay: 0.1,
        scrollTrigger: trigger,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="w-full bg-bg px-6 py-[80px] lg:px-[40px] lg:py-[120px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col">
        <div className="fq-head flex w-full flex-col items-start gap-[18px] lg:flex-row lg:items-end lg:justify-between lg:gap-[70px]">
          <div className="flex flex-col gap-[14px] lg:max-w-[680px]">
            <p className="font-mono text-[11px] uppercase leading-none tracking-[0.2em] text-primary-green">
              Before you send it
            </p>
            <h2 className="font-display text-[clamp(1.9rem,3.8vw,52px)] font-medium leading-[1.06] tracking-[-1.3px] text-black">
              The things people ask first
            </h2>
          </div>

          <p className="max-w-[320px] font-body text-[14px] leading-[22px] tracking-[-0.1px] text-neutral-paragraph lg:pb-[6px] lg:text-right">
            Nothing hidden behind a plus sign — an answer you have to go looking for is one
            you were never going to find.
          </p>
        </div>

        {/* Two columns of open answers on hairlines. The rule above each
            question is what holds the grid together without drawing boxes. */}
        <dl className="mt-[44px] grid w-full grid-cols-1 gap-x-[70px] gap-y-0 lg:mt-[58px] lg:grid-cols-2">
          {ENTRIES.map((entry) => (
            <div
              key={entry.question}
              className="fq-item flex w-full flex-col gap-[12px] border-t border-black/12 py-[26px] lg:py-[30px]"
            >
              <dt className="font-display text-[20px] font-medium leading-[1.2] tracking-[-0.35px] text-black lg:text-[22px]">
                {entry.question}
              </dt>
              <dd className="font-body text-[14px] leading-[23px] tracking-[-0.1px] text-neutral-paragraph lg:max-w-[540px]">
                {entry.answer}
              </dd>
            </div>
          ))}
        </dl>

        <p className="fq-item mt-[34px] w-full border-t border-black/12 pt-[26px] font-body text-[14px] leading-[22px] tracking-[-0.1px] text-neutral-paragraph">
          Something else on your mind?{" "}
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-black underline decoration-black/25 underline-offset-[5px] transition-colors hover:text-primary-green hover:decoration-primary-green"
          >
            {siteConfig.email}
          </a>{" "}
          reaches the same people, and so does the form above.
        </p>
      </div>
    </section>
  );
}
