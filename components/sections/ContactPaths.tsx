"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reveal } from "@/lib/anim";
import { trackScheduleClick } from "@/lib/analytics";
import { siteConfig } from "@/lib/site";

/**
 * The four ways to start, side by side.
 *
 * They all existed before and none of them were presented as a choice: the
 * call was a line in the form's margin, the email and the number were three
 * thin cards below the fold, and the form itself was simply the thing filling
 * the page. Somebody who would rather talk than write had to go looking.
 *
 * Laid out as four routes with the cost of each one stated — how long it
 * takes, whether it is live or async — a visitor can pick the one that suits
 * them in a glance instead of defaulting to the form or to nothing.
 */

type Path = {
  title: string;
  body: string;
  /** The cost of taking this route, in the visitor's terms. */
  meta: string;
  action: string;
  href: string;
  /** Opens a new tab — the calendar, WhatsApp. */
  external?: boolean;
  /** Same page: the form further down. */
  internal?: boolean;
  /** The one we would pick for most people. Drawn on black. */
  featured?: boolean;
  onClick?: () => void;
};

const PATHS: Path[] = [
  {
    title: "Book a call",
    body: "Thirty minutes with the engineer who would run the build — not a salesperson working from a script. Bring the problem; leave with a rough shape and a rough number.",
    meta: "30 min · Free",
    action: "Find a time",
    href: siteConfig.calendlyUrl,
    external: true,
    featured: true,
    onClick: () => trackScheduleClick("contact_paths"),
  },
  {
    title: "Send the brief",
    body: "Rather write it down? The form below takes about three minutes. Attach anything you already have — a spec, a deck, screenshots of the thing that is not working.",
    meta: "3 min · Async",
    action: "Go to the form",
    href: "#contact",
    internal: true,
  },
  {
    title: "Email us",
    body: "Best when there is a lot to attach, or when the brief needs to go past a few people on your side before it reaches ours.",
    meta: siteConfig.email,
    action: "Open your mail",
    href: `mailto:${siteConfig.email}`,
  },
  {
    title: "WhatsApp",
    body: "Fastest during Dhaka business hours, and the one most people use for the first question rather than the whole brief.",
    meta: siteConfig.phoneDisplay,
    action: "Start a chat",
    href: siteConfig.whatsappHref,
    external: true,
  },
];

export default function ContactPaths() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 86%" });

      gsap.from(".paths-head", {
        y: 22,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: trigger,
      });

      gsap.from(".path-card", {
        y: 24,
        opacity: 0,
        duration: 0.65,
        ease: "power2.out",
        stagger: 0.09,
        delay: 0.12,
        scrollTrigger: trigger,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section className="w-full bg-bg pb-[72px] lg:pb-[110px]" ref={sectionRef}>
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-[34px] px-6 lg:gap-[46px] lg:px-[40px]">
        <div className="paths-head flex w-full flex-col gap-[12px] lg:max-w-[760px]">
          <h2 className="font-display text-[clamp(2rem,4vw,56px)] font-medium leading-[1.08] tracking-[-1.5px] text-black">
            Pick whichever suits you
          </h2>
          <p className="font-display text-[19px] leading-[1.35] tracking-[-0.25px] text-ash-dark">
            Four routes to the same place. All of them reach an engineer, and none of them
            reach a queue.
          </p>
        </div>

        <ol className="grid w-full grid-cols-1 gap-[16px] sm:grid-cols-2 lg:grid-cols-4 lg:gap-[20px]">
          {PATHS.map((path, index) => {
            const tone = path.featured;

            return (
              <li
                key={path.title}
                className={`path-card group flex min-h-[272px] flex-col rounded-[20px] p-[24px] transition-[transform,box-shadow] duration-300 hover:-translate-y-[3px] ${
                  tone
                    ? "bg-black shadow-[0_26px_60px_-34px_rgba(0,0,0,0.9)]"
                    : "bg-white ring-1 ring-black/[0.07] hover:shadow-[0_22px_50px_-34px_rgba(0,0,0,0.5)]"
                }`}
              >
                <div className="flex w-full items-center justify-between gap-[10px]">
                  <span
                    className={`font-mono text-[11px] uppercase leading-none tracking-[0.16em] ${
                      tone ? "text-white/45" : "text-neutral-paragraph"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Only on the route we would send most people down, so it
                      reads as a recommendation rather than as decoration. */}
                  {tone ? (
                    <span className="rounded-full bg-primary-green px-[10px] py-[5px] font-mono text-[10px] uppercase leading-none tracking-[0.16em] text-white">
                      Most pick this
                    </span>
                  ) : null}
                </div>

                <h3
                  className={`mt-[18px] font-display text-[24px] font-medium leading-[1.15] tracking-[-0.5px] ${
                    tone ? "text-white" : "text-black"
                  }`}
                >
                  {path.title}
                </h3>

                <p
                  className={`mt-[10px] font-body text-[14px] leading-[21px] tracking-[-0.1px] ${
                    tone ? "text-white/60" : "text-neutral-paragraph"
                  }`}
                >
                  {path.body}
                </p>

                {/* Pushed to the foot so the four cards line their actions up
                    however long the copy above runs. */}
                <div className="mt-auto flex w-full flex-col gap-[12px] pt-[20px]">
                  <span
                    className={`break-all font-mono text-[11px] uppercase leading-[1.4] tracking-[0.14em] ${
                      tone ? "text-primary-green" : "text-ash-dark"
                    }`}
                  >
                    {path.meta}
                  </span>

                  <a
                    href={path.href}
                    onClick={path.onClick}
                    {...(path.external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className={`flex items-center gap-[8px] font-body text-[14px] font-medium leading-none tracking-[-0.1px] transition-colors ${
                      tone
                        ? "text-white hover:text-primary-green"
                        : "text-black hover:text-primary-green"
                    }`}
                  >
                    {path.action}
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                      aria-hidden
                      className="shrink-0 transition-transform duration-300 group-hover:translate-x-[3px]"
                    >
                      {path.internal ? (
                        <path
                          d="M6.5 2v9M2.6 7.3 6.5 11.2l3.9-3.9"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      ) : (
                        <path
                          d="M2.4 10.6 10.6 2.4M4 2.4h6.6V9"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}
                    </svg>
                  </a>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
