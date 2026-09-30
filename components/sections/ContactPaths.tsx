"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reveal } from "@/lib/anim";
import { trackScheduleClick } from "@/lib/analytics";
import { siteConfig } from "@/lib/site";

/**
 * The v1 four-paths block, to its own measurements: a 300px auto-fit grid of
 * 440px-tall cards, each opening on a "path n /" label, carrying a 30px
 * heading and its copy, and closing on a mono cost line over a hairline rule
 * with a pill button under it.
 *
 * The first card is the recommended one and is drawn on black with a green
 * badge and a green button; the rest are white with a black button. That
 * contrast is the whole mechanism — it picks for the undecided visitor without
 * taking the other three away.
 */

type Path = {
  /** The cost of this route, in the visitor's terms. */
  cost: string;
  title: string;
  body: string;
  action: string;
  href: string;
  external?: boolean;
  featured?: boolean;
  onClick?: () => void;
};

const PATHS: Path[] = [
  {
    cost: "Min 30 · $0",
    title: "Free 30-min call",
    body: "Half an hour with the engineer who would run the build — not a salesperson working from a script. We walk through the brief, show you the two projects closest to yours, and give you a real number on the call. If we are not the fit, we say so there and then.",
    action: "Find a time",
    href: siteConfig.calendlyUrl,
    external: true,
    featured: true,
    onClick: () => trackScheduleClick("contact_paths"),
  },
  {
    cost: "3 min · async",
    title: "Send a brief",
    body: "Rather write it down? The form above takes about three minutes. Attach whatever you already have — a specification, a deck, screenshots of the thing that is not working. An engineer reads it and replies inside four business hours.",
    action: "Go to the form",
    href: "#brief",
  },
  {
    cost: siteConfig.email,
    title: "Email direct",
    body: "Best when there is a lot to attach, or when the brief has to go past a few people on your side before it reaches ours. Same inbox, same people, same four-hour reply.",
    action: "Open your mail",
    href: `mailto:${siteConfig.email}`,
  },
  {
    cost: siteConfig.phoneDisplay,
    title: "WhatsApp",
    body: "Fastest during Dhaka business hours, and the one most people use for the first question rather than the whole brief. Ask one thing and see what comes back.",
    action: "Start a chat",
    href: siteConfig.whatsappHref,
    external: true,
  },
];

export default function ContactPaths() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 84%" });

      gsap.from(".pa-head", {
        y: 22,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: trigger,
      });

      gsap.from(".pa-card", {
        y: 26,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.09,
        delay: 0.12,
        scrollTrigger: trigger,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="mx-auto w-full max-w-[1440px] px-6 pb-[80px] lg:px-[40px] lg:pb-[128px]"
    >
      <div className="pa-head grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-[64px] gap-y-[24px] pb-[48px]">
        <div className="flex flex-col gap-[20px]">
          <span className="flex items-center gap-[10px] font-mono text-[12px] uppercase leading-none tracking-[0.1em] text-black">
            <span aria-hidden className="h-[2px] w-[24px] shrink-0 bg-primary-green" />
            Four ways · pick one
          </span>
          <h2 className="font-display text-[clamp(40px,5vw,72px)] font-semibold leading-[0.98] tracking-[-0.05em] text-balance text-black">
            Pick the path that{" "}
            <span className="font-serif font-normal italic tracking-[-0.02em]">
              fits your brief
            </span>
          </h2>
        </div>

        <p className="m-0 max-w-[520px] font-body text-[18px] leading-[1.55] tracking-[-0.1px] text-pretty text-neutral-paragraph">
          Most people take the call. Some would rather send the brief and get a number
          back without talking to anyone. All four reach the same engineers, and none of
          them reach a queue.
        </p>
      </div>

      <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-[16px]">
        {PATHS.map((path, index) => {
          const dark = path.featured;

          return (
            <div
              key={path.title}
              className={`pa-card flex min-h-[440px] flex-col gap-[28px] rounded-[28px] p-[32px] ${
                dark
                  ? "bg-black text-bg"
                  : "border border-black/12 bg-white text-black"
              }`}
            >
              <div className="flex items-center justify-between gap-[12px]">
                <span
                  className={`font-mono text-[12px] leading-none ${
                    dark ? "text-white/55" : "text-neutral-paragraph"
                  }`}
                >
                  path {index + 1} /
                </span>
                {dark ? (
                  <span className="rounded-full bg-primary-green px-[10px] py-[6px] font-mono text-[11px] uppercase leading-none tracking-[0.08em] text-white">
                    Recommended
                  </span>
                ) : null}
              </div>

              <div className="flex flex-1 flex-col gap-[14px]">
                <h3 className="m-0 font-display text-[30px] font-semibold leading-[1.05] tracking-[-0.04em]">
                  {path.title}
                </h3>
                <p
                  className={`m-0 font-body text-[15px] leading-[1.6] tracking-[-0.1px] text-pretty ${
                    dark ? "text-white/70" : "text-neutral-paragraph"
                  }`}
                >
                  {path.body}
                </p>
              </div>

              <div className="flex flex-col gap-[16px]">
                <span
                  className={`break-all border-t pt-[16px] font-mono text-[12px] uppercase leading-none tracking-[0.06em] ${
                    dark ? "border-white/12 text-primary-green" : "border-black/10 text-ash-dark"
                  }`}
                >
                  {path.cost}
                </span>

                <a
                  href={path.href}
                  onClick={path.onClick}
                  {...(path.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className={`group flex items-center justify-between rounded-full py-[6px] pl-[20px] pr-[6px] font-body text-[15px] font-semibold leading-none tracking-[-0.1px] transition-opacity duration-300 hover:opacity-90 ${
                    dark ? "bg-primary-green text-white" : "bg-black text-bg"
                  }`}
                >
                  {path.action}
                  <span
                    className={`flex size-[38px] shrink-0 items-center justify-center rounded-full ${
                      dark ? "bg-black text-primary-green" : "bg-primary-green text-white"
                    }`}
                  >
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path
                        d="M3 8h9M8.6 4.4 12.2 8l-3.6 3.6"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="transition-transform duration-300 group-hover:translate-x-[2px]"
                      />
                    </svg>
                  </span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
