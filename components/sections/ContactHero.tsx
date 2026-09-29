"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

/**
 * The top of the contact page.
 *
 * It used to be the shared ListingHero — a title, one line of aside, a rule —
 * which is right for a listing and wrong here. A listing page's job is to get
 * you further down it; this page's job is to convince you to spend ten minutes
 * writing a brief, and the top of it was asking for that with nothing offered
 * in return.
 *
 * So the headline now comes with the four things a visitor actually wants to
 * know before they start typing — who reads it, what comes back, how long it
 * takes, and what happens to what they send — and the band underneath carries
 * the record. None of it is new information; it was all further down the page
 * or on another one, which is the same as not having it.
 */

/**
 * Answers to the four questions people have before they write to an agency,
 * in the order they tend to ask them.
 */
const PROMISES = [
  {
    title: "An engineer reads it",
    body: "Not a sales desk and not a bot. The person who would run the build.",
  },
  {
    title: "A reply in four business hours",
    body: "From a named person, with a real next step rather than an acknowledgement.",
  },
  {
    title: "A number, not a range",
    body: "A written scope and a fixed estimate — no “starting from”.",
  },
  {
    title: "An NDA before you need one",
    body: "Ask and it is signed the same day, before you send anything sensitive.",
  },
];

/**
 * The record, stated once at the top. Same figures the service pages quote —
 * they live in lib/services.ts as SHARED_STATS and are repeated here rather
 * than imported, because that array carries a paragraph of copy per figure
 * that this band has no room for.
 */
const FACTS = [
  { value: "28+", label: "Systems delivered" },
  { value: "95%", label: "Client satisfaction" },
  { value: "99.9%", label: "Uptime after migration" },
  { value: "4h", label: "Reply, business hours" },
];

export default function ContactHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".ch-line", {
        yPercent: 110,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.15,
      });

      gsap.from(".ch-intro", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: "power2.out",
        delay: 0.4,
      });

      gsap.from(".ch-promise", {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.09,
        delay: 0.5,
      });

      gsap.from(".ch-fact", {
        y: 18,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.08,
        delay: 0.75,
      });

      gsap.from(".ch-rule", {
        scaleX: 0,
        duration: 1.1,
        ease: "power2.inOut",
        transformOrigin: "left center",
        delay: 0.65,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-node-id="156:11115"
      className="w-full bg-bg pb-[48px] pt-[40px] lg:pb-[72px] lg:pt-[64px]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[40px] px-6 lg:gap-[56px] lg:px-[40px]">
        <div className="flex w-full flex-col items-start gap-[40px] lg:flex-row lg:justify-between lg:gap-[80px]">
          {/* Left: the title and what the page is for. */}
          <div className="flex w-full flex-col items-start gap-[26px] lg:max-w-[620px]">
            <p className="ch-intro font-body text-[14px] font-medium uppercase leading-[1.2] tracking-[0.5px] text-primary-green">
              [ Contact us ]
            </p>

            <h1 className="font-display text-[clamp(3.25rem,7.6vw,132px)] font-medium uppercase leading-[0.96] tracking-[-0.0625em] text-black">
              <span className="block overflow-hidden">
                <span className="ch-line block">Get in</span>
              </span>
              <span className="block overflow-hidden">
                <span className="ch-line block">Touch</span>
              </span>
            </h1>

            <p className="ch-intro max-w-[520px] font-display text-[clamp(1.125rem,1.6vw,22px)] font-medium leading-[1.35] tracking-[-0.25px] text-ash-dark">
              Send the problem, not a polished specification. We will send back a scope, a
              fixed estimate and an honest answer — including{" "}
              <span className="text-black">“not us”</span> when that is the answer.
            </p>
          </div>

          {/* Right: the four things worth knowing before writing anything. */}
          <ul className="flex w-full flex-col lg:w-[440px] lg:shrink-0">
            {PROMISES.map((promise, index) => (
              <li
                key={promise.title}
                className={`ch-promise flex w-full items-start gap-[14px] py-[18px] ${
                  index === 0 ? "lg:pt-0" : "border-t border-black/[0.09]"
                }`}
              >
                <span
                  aria-hidden
                  className="mt-[2px] flex size-[22px] shrink-0 items-center justify-center rounded-full bg-primary-green text-white"
                >
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6.4 4.6 9 10 3.2"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div className="flex flex-col gap-[5px]">
                  <p className="font-display text-[18px] font-medium leading-[1.2] tracking-[-0.2px] text-black">
                    {promise.title}
                  </p>
                  <p className="font-body text-[14px] leading-[21px] tracking-[-0.1px] text-neutral-paragraph">
                    {promise.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* The record. A rule, then four figures — the same band the rest of
            the site uses to close a hero. */}
        <div className="flex w-full flex-col gap-[26px]">
          <div className="ch-rule h-px w-full bg-black/20" />

          <dl className="grid w-full grid-cols-2 gap-x-[20px] gap-y-[24px] lg:grid-cols-4">
            {FACTS.map((fact) => (
              <div key={fact.label} className="ch-fact flex flex-col gap-[6px]">
                <dt className="font-display text-[clamp(2rem,3.4vw,44px)] font-medium leading-none tracking-[-1.2px] text-black">
                  {fact.value}
                </dt>
                <dd className="font-mono text-[11px] uppercase leading-[1.4] tracking-[0.16em] text-neutral-paragraph">
                  {fact.label}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
