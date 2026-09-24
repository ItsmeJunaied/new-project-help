"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";
import { JOBS } from "@/lib/careers";

type Role = {
  id: string;
  category: string;
  title: string;
  /** Location, contract type and seniority — the three meta items per card. */
  meta: [string, string, string];
};

// Derived from the real openings, so a card can never outlive its posting.
const ROLES: Role[] = JOBS.map((job) => ({
  id: job.slug,
  category: job.department,
  title: job.title,
  meta: [job.location, job.type === "Full-time" ? "Full Time" : "Part Time", job.salary],
}));

export default function CareerRoles() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const meta = sectionRef.current?.querySelector(".roles-meta") ?? null;
      const grid = sectionRef.current?.querySelector(".roles-grid") ?? null;

      gsap.from(".roles-meta", {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: reveal(meta, { start: "top 92%" }),
      });

      gsap.from(".role-card", {
        y: 44,
        opacity: 0,
        duration: 0.75,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: reveal(grid, { start: "top 90%" }),
      });

      if (prefersReducedMotion()) return;

      // Cards lift under the cursor, so the grid responds rather than sitting flat.
      gsap.utils.toArray<HTMLElement>(".role-card").forEach((card) => {
        card.addEventListener("pointerenter", () => {
          gsap.to(card, { y: -8, duration: 0.4, ease: "power3.out" });
        });
        card.addEventListener("pointerleave", () => {
          gsap.to(card, { y: 0, duration: 0.4, ease: "power3.out" });
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="open-roles"
      data-node-id="156:11251"
      className="w-full bg-bg py-[80px] lg:py-[160px]"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col px-6 lg:px-[40px]">
        <div className="roles-meta flex w-full flex-col gap-[8px]">
          <div className="flex w-full items-center justify-between text-[18px] leading-[25.714px] text-black">
            {/* This label is the section's real heading, so it carries the
                heading semantics rather than a duplicate hidden one. */}
            <h2 className="font-display font-medium">&copy; CURRENT OPENINGS</h2>
            <p className="text-right font-body font-bold">{`//${String(ROLES.length).padStart(3, "0")} Open`}</p>
          </div>
          <div className="h-px w-full bg-black/20" />
        </div>

        <div className="roles-grid mt-[48px] grid w-full grid-cols-1 gap-[20px] sm:grid-cols-2 lg:mt-[60px] lg:grid-cols-3">
          {ROLES.map((role) => (
            <article
              key={role.id}
              className="role-card flex w-full flex-col items-center justify-center border border-[rgba(10,10,8,0.1)] bg-white px-[40px] py-[48px] lg:h-[313px] lg:py-[80px]"
            >
              <div className="flex w-full flex-col items-start justify-center gap-[40px]">
                <div className="flex w-full flex-col items-start gap-[24px]">
                  <div className="flex w-full flex-col items-start gap-[12px]">
                    <p className="font-display text-[14px] font-medium leading-[1.2] tracking-[-0.18px] text-pure-black">
                      {role.category}
                    </p>
                    <h3 className="w-full font-display text-[32px] font-semibold leading-[46px] text-pure-black">
                      {role.title}
                    </h3>
                  </div>

                  <ul className="flex flex-wrap items-center gap-[4px] font-body text-[16px] font-medium leading-[1.3] text-ash-dark">
                    {role.meta.map((item, i) => (
                      <li
                        key={item}
                        className={
                          i === 0
                            ? "whitespace-nowrap"
                            : "ml-[24px] list-disc whitespace-nowrap"
                        }
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/career/${role.id}`}
                  className="flex items-center justify-center gap-[8px] rounded-[1000px] bg-black px-[32px] py-[16px] transition-opacity hover:opacity-90"
                >
                  <span className="font-body text-[18px] font-medium leading-[27px] tracking-[-0.25px] text-white">
                    Apply for this role
                  </span>
                  <span className="relative size-[22px] shrink-0">
                    <Image
                      src="/icons/icon-button-plus-on-dark.svg"
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
