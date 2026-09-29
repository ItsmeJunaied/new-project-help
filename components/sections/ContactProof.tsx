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
 * Who has already sent a brief to this address.
 *
 * The reference design put three review cards here — star ratings, platform
 * badges, a named person under each quote. We do not have those quotes, and
 * the one thing this repo will not do is write them: Signature Bangla,
 * Textalyz AI and Rongobuy are real companies, and words invented for a real
 * client and published under their name are a fabricated endorsement. That is
 * prohibited under the FTC's endorsement rules and under UK and EU consumer
 * law, and the site already had one round of invented testimonials stripped
 * out for exactly that reason — see lib/testimonials.ts, which is empty on
 * purpose and says so at length.
 *
 * So this slot carries what is true instead: the three marks, which the
 * clients gave permission to show (lib/clients.ts), and the work itself,
 * which is documented in lib/case-studies.ts. It reads as proof because it is
 * proof — a named platform a visitor can go and look at beats a five-star
 * card every time.
 *
 * The moment real quotes exist, adding them to TESTIMONIALS puts them above
 * the marks without touching this file again. Nothing renders while that list
 * is empty.
 */

/**
 * What each client actually got. Only Signature Bangla has a written case
 * study; the other two are marks with permission and nothing else on file, so
 * they are shown as marks and nothing else is claimed about them.
 */
const SHIPPED = [
  {
    client: "Signature Bangla",
    line: "Grocery, pharmacy and household delivery on one platform — location-aware catalogs, live rider tracking, and an operations dashboard the client runs alone.",
    stack: ["Next.js", "Node.js", "PostgreSQL", "Socket.IO"],
    href: "/case-study/signature-bangla",
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
        y: 18,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
        delay: 0.1,
        scrollTrigger: trigger,
      });

      gsap.from(".pf-work", {
        y: 22,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.1,
        delay: 0.2,
        scrollTrigger: trigger,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} className="w-full bg-bg px-6 pb-[80px] lg:px-[40px] lg:pb-[120px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col">
        <div className="pf-head flex w-full flex-col items-start gap-[18px] lg:flex-row lg:items-end lg:justify-between lg:gap-[70px]">
          <div className="flex flex-col gap-[14px] lg:max-w-[680px]">
            <p className="font-mono text-[11px] uppercase leading-none tracking-[0.2em] text-primary-green">
              Already shipped
            </p>
            <h2 className="font-display text-[clamp(1.9rem,3.8vw,52px)] font-medium leading-[1.06] tracking-[-1.3px] text-black">
              Briefs that came through this page
            </h2>
          </div>

          <p className="max-w-[330px] font-body text-[14px] leading-[22px] tracking-[-0.1px] text-neutral-paragraph lg:pb-[6px] lg:text-right">
            Marks shown with permission. The work is written up in full — go and read it
            before you decide anything.
          </p>
        </div>

        {/* Real quotes go above the work the moment they exist. Nothing here
            renders while TESTIMONIALS is empty, and the section still flows. */}
        {TESTIMONIALS.length > 0 ? (
          <ul className="mt-[44px] grid w-full gap-[18px] lg:grid-cols-3">
            {TESTIMONIALS.slice(0, 3).map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-[16px] rounded-[20px] bg-white p-[26px] ring-1 ring-black/[0.06]"
              >
                <p className="font-display text-[17px] leading-[1.45] tracking-[-0.2px] text-black">
                  “{item.quote}”
                </p>
                <p className="mt-auto font-body text-[13px] leading-[19px] tracking-[-0.1px] text-neutral-paragraph">
                  <span className="text-black">{item.name}</span> — {item.role}
                </p>
              </li>
            ))}
          </ul>
        ) : null}

        {/* The marks, on a rule. */}
        <ul className="mt-[42px] flex w-full flex-wrap items-center gap-x-[52px] gap-y-[28px] border-y border-black/10 py-[30px] lg:mt-[56px] lg:gap-x-[78px]">
          {CLIENTS.map((client) => (
            <li key={client.name} className="pf-mark flex items-center">
              <Image
                src={client.src}
                alt={client.name}
                width={client.width}
                height={client.height}
                sizes="161px"
                className={`${client.rowClassName} w-auto opacity-70 grayscale transition-[opacity,filter] duration-300 hover:opacity-100 hover:grayscale-0`}
              />
            </li>
          ))}
        </ul>

        {/* And what was built, for the one we have written up. */}
        <ul className="mt-[38px] flex w-full flex-col gap-[20px] lg:mt-[48px]">
          {SHIPPED.map((item) => (
            <li key={item.client} className="pf-work w-full">
              <Link
                href={item.href}
                className="group flex w-full flex-col gap-[16px] rounded-[22px] bg-white p-[26px] ring-1 ring-black/[0.06] transition-[transform,box-shadow] duration-300 hover:-translate-y-[3px] hover:shadow-[0_30px_64px_-40px_rgba(0,0,0,0.45)] lg:flex-row lg:items-center lg:gap-[40px] lg:p-[34px]"
              >
                <div className="flex flex-col gap-[10px] lg:flex-1">
                  <p className="font-display text-[22px] font-medium leading-none tracking-[-0.4px] text-black transition-colors group-hover:text-primary-green">
                    {item.client}
                  </p>
                  <p className="font-body text-[14px] leading-[22px] tracking-[-0.1px] text-neutral-paragraph lg:max-w-[620px]">
                    {item.line}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-[7px] lg:justify-end">
                  {item.stack.map((tool) => (
                    <span
                      key={tool}
                      className="rounded-full bg-black/[0.05] px-[11px] py-[6px] font-mono text-[11px] leading-none tracking-[0.04em] text-ash-dark"
                    >
                      {tool}
                    </span>
                  ))}
                </div>

                <span className="flex items-center gap-[8px] font-body text-[14px] font-medium leading-none tracking-[-0.1px] text-black lg:shrink-0">
                  Read the write-up
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 15 15"
                    fill="none"
                    aria-hidden
                    className="shrink-0 transition-transform duration-300 group-hover:translate-x-[3px]"
                  >
                    <path
                      d="M3 12 12 3M4.6 3H12v7.4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
