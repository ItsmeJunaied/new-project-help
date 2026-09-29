"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reveal } from "@/lib/anim";
import { CLIENTS } from "@/lib/clients";
import { TESTIMONIALS } from "@/lib/testimonials";

/**
 * The concept's reviews block, to its own measurements: one tall black card on
 * the left with a green disc bleeding off its top corner and an oversized
 * serif quote mark, and two white cards stacked beside it.
 *
 * What fills it is ours. The concept's three cards are client quotes with
 * names, faces and platform badges; we do not have any, and the one thing this
 * repo will not do is invent them — Signature Bangla, Textalyz AI and Rongobuy
 * are real companies, and words written for a real client and published under
 * their name are a fabricated endorsement, which is prohibited under the FTC's
 * rules and under UK and EU consumer law. The site already had one round of
 * invented testimonials stripped out for exactly that reason; lib/testimonials
 * .ts is empty on purpose and says so at length.
 *
 * So the same three cards carry the work instead, out of lib/case-studies.ts,
 * and the badge row carries the client marks we do have permission for. When
 * real quotes exist, adding them to TESTIMONIALS swaps the card bodies over
 * without touching the layout.
 */

/** The work that goes in the three cards, newest and largest first. */
const FEATURE = {
  client: "Signature Bangla",
  quote:
    "Groceries with a two-day shelf life, pharmacy items with regulatory constraints and household goods, sold from one basket — with operations watching orders, riders and stock move in real time.",
  accent: "across four locations",
  meta: "eCommerce · Delivery platform",
  stack: ["Next.js", "Node.js", "PostgreSQL", "Socket.IO"],
  href: "/case-study/signature-bangla",
};

const SUPPORTING = [
  {
    title: "Clinic Management System",
    quote:
      "Appointments, patient records and billing in one place, replacing a register and three spreadsheets that never agreed with each other.",
    meta: "Health tech",
    href: "/case-study/clinic-management-system",
  },
  {
    title: "Restaurant POS",
    quote:
      "Orders, kitchen tickets and end-of-day takings on hardware the staff already had, built to keep working when the connection does not.",
    meta: "Hospitality",
    href: "/case-study/restaurant-pos",
  },
];

export default function ContactProof() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 84%" });

      gsap.from(".pf-head", {
        y: 22,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: trigger,
      });

      gsap.from(".pf-mark", {
        y: 16,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.08,
        delay: 0.1,
        scrollTrigger: trigger,
      });

      gsap.from(".pf-card", {
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.15,
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
      {/* Header left, marks right, aligned to the bottom edge. */}
      <div className="pf-head flex w-full flex-wrap items-end justify-between gap-[32px] pb-[40px]">
        <div className="flex max-w-[640px] flex-col gap-[20px]">
          <span className="flex items-center gap-[10px] font-mono text-[12px] uppercase leading-none tracking-[0.08em] text-black">
            <span aria-hidden className="h-[2px] w-[24px] shrink-0 bg-primary-green" />
            Shipped for
          </span>
          <h2 className="font-display text-[clamp(40px,5vw,72px)] font-semibold leading-[0.98] tracking-[-0.05em] text-balance text-black">
            Built for the people{" "}
            <span className="font-serif font-normal italic tracking-[-0.02em]">
              who asked first
            </span>
          </h2>
        </div>

        {/* The concept puts review-platform badges here. These are the client
            marks, which we do have permission to show — see lib/clients.ts. */}
        <ul className="flex flex-wrap gap-[8px]">
          {CLIENTS.map((client) => (
            <li
              key={client.name}
              className="pf-mark flex min-w-[150px] flex-col gap-[10px] rounded-[18px] border border-black/12 bg-white px-[18px] py-[14px]"
            >
              <Image
                src={client.src}
                alt={client.name}
                width={client.width}
                height={client.height}
                sizes="161px"
                className={`${client.rowClassName} w-auto`}
              />
              <span className="font-body text-[12px] leading-none tracking-[-0.1px] text-neutral-paragraph">
                Client
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Real quotes take over the card bodies the moment any exist. */}
      {TESTIMONIALS.length > 0 ? (
        <ul className="mb-[16px] grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] gap-[16px]">
          {TESTIMONIALS.slice(0, 3).map((item) => (
            <li
              key={item.id}
              className="flex flex-col gap-[16px] rounded-[28px] border border-black/10 bg-white p-[28px]"
            >
              <p className="font-display text-[20px] leading-[1.4] tracking-[-0.015em] text-pretty text-black">
                {item.quote}
              </p>
              <p className="mt-auto font-body text-[13px] leading-[1.3] tracking-[-0.1px] text-neutral-paragraph">
                <span className="font-semibold text-black">{item.name}</span> — {item.role}
              </p>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] gap-[16px]">
        {/* The tall black card, with the disc bleeding off its corner. */}
        <Link
          href={FEATURE.href}
          className="pf-card group relative flex min-h-[520px] flex-col justify-between gap-[48px] overflow-hidden rounded-[28px] bg-black p-[28px] text-bg lg:p-[48px]"
        >
          <span
            aria-hidden
            className="absolute -right-[40px] -top-[60px] size-[240px] rounded-full bg-primary-green"
          />

          <span
            aria-hidden
            className="relative self-end pr-[36px] pt-[40px] font-serif text-[160px] italic leading-[0.6] text-black"
          >
            &rdquo;
          </span>

          <p className="relative m-0 font-display text-[clamp(26px,2.6vw,38px)] font-medium leading-[1.2] tracking-[-0.03em] text-pretty">
            {FEATURE.quote}{" "}
            <span className="font-serif font-normal italic tracking-[-0.02em] text-primary-green">
              {FEATURE.accent}
            </span>
          </p>

          <div className="relative flex flex-wrap items-center justify-between gap-[16px] border-t border-white/12 pt-[24px]">
            <div className="flex flex-col gap-[2px]">
              <span className="font-body text-[16px] font-semibold leading-none tracking-[-0.1px]">
                {FEATURE.client}
              </span>
              <span className="font-body text-[13px] leading-[1.4] tracking-[-0.1px] text-white/55">
                {FEATURE.stack.join(" · ")}
              </span>
            </div>
            <span className="rounded-full bg-primary-green px-[12px] py-[7px] font-mono text-[11px] uppercase leading-none tracking-[0.08em] text-white">
              {FEATURE.meta} ↗
            </span>
          </div>
        </Link>

        {/* Two white cards stacked beside it. */}
        <div className="flex flex-col gap-[16px]">
          {SUPPORTING.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="pf-card flex flex-1 flex-col justify-between gap-[28px] rounded-[28px] border border-black/12 bg-white p-[28px] text-black transition-colors duration-300 hover:border-black"
            >
              <div className="flex items-center justify-between gap-[12px]">
                <span className="rounded-full bg-primary-green px-[10px] py-[4px] font-body text-[14px] leading-[1.3] tracking-[2px] text-white">
                  ★★★★★
                </span>
                <span className="font-mono text-[11px] uppercase leading-none tracking-[0.08em] text-neutral-paragraph">
                  Case study ↗
                </span>
              </div>

              <p className="m-0 font-display text-[20px] leading-[1.4] tracking-[-0.015em] text-pretty">
                {item.quote}
              </p>

              <div className="flex flex-col gap-[2px]">
                <span className="font-body text-[15px] font-semibold leading-none tracking-[-0.1px]">
                  {item.title}
                </span>
                <span className="font-body text-[13px] leading-[1.4] tracking-[-0.1px] text-neutral-paragraph">
                  {item.meta}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
