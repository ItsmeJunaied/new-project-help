"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { countUp, prefersReducedMotion, reveal } from "@/lib/anim";

const AVATARS = [
  { src: "/images/about-avatar-1.png", alt: "Project Help engineer" },
  { src: "/images/about-avatar-2.png", alt: "Project Help engineer" },
  { src: "/images/about-avatar-3.png", alt: "Project Help engineer" },
];

const STATEMENT_LINES = [
  "We are a custom software development company building",
  "SaaS platforms, eCommerce systems, cloud infrastructure and",
  "AI/ML applications. Senior engineers, two-week delivery",
  "slices, and code you own from the first commit.",
];

const STATS = [
  { value: 28, label: "Projects Delivered", pl: "lg:pl-[102px]", gap: "gap-[20px]" },
  { value: 25, label: "Technology Experts", pl: "", gap: "gap-[19.99px]" },
];

function AboutStatement({ tone }: { tone: "dark" | "light" }) {
  const isDark = tone === "dark";

  return (
    <div className="about-statement flex w-full flex-col items-start gap-[48px] lg:flex-row lg:justify-end lg:gap-[100px]">
      <div className="about-photo relative h-[240px] w-full max-w-[408px] shrink-0 overflow-hidden sm:h-[295px] lg:w-[388px]">
        <Image
          src="/images/about-photo-working.webp"
          alt="Engineers reviewing an architecture diagram at a studio desk"
          fill
          sizes="(max-width: 1023px) 100vw, 408px"
          className="object-cover"
        />
      </div>

      <div className="flex w-full max-w-[500px] shrink-0 flex-col items-start gap-[48px]">
        <p
          className={`font-body text-[18px] leading-[27px] tracking-[-0.25px] lg:pr-[40.78px] ${
            isDark ? "text-ash-muted" : "text-black"
          }`}
        >
          {STATEMENT_LINES.map((line) => (
            <span key={line} className="about-statement-line block">
              {line}
            </span>
          ))}
        </p>

        <Link
          href="/about"
          className={`group flex items-center justify-center gap-[8px] rounded-[1000px] px-[32px] py-[16px] transition-opacity hover:opacity-80 ${
            isDark ? "bg-white" : "bg-black"
          }`}
        >
          <span
            className={`font-body text-[18px] font-medium leading-[27px] tracking-[-0.25px] ${
              isDark ? "text-[#262626]" : "text-white"
            }`}
          >
            About us
          </span>
          <span className="relative size-[22px] shrink-0 transition-transform duration-500 group-hover:rotate-90">
            <Image
              src={
                isDark
                  ? "/icons/icon-button-plus-on-dark.svg"
                  : "/icons/icon-button-plus-on-light.svg"
              }
              alt=""
              fill
              className="object-contain"
            />
          </span>
        </Link>
      </div>
    </div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const bandRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 72%" });

      gsap.from(".about-title-inner", {
        yPercent: 110,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: trigger,
      });

      gsap.from(".about-avatar", {
        scale: 0.5,
        opacity: 0,
        duration: 0.7,
        ease: "back.out(1.8)",
        stagger: 0.1,
        scrollTrigger: trigger,
      });

      gsap.from(".about-label", {
        opacity: 0,
        x: 20,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: trigger,
      });

      gsap.utils.toArray<HTMLElement>(".about-stat-value").forEach((el) => {
        countUp(el, Number(el.dataset.value ?? "0"), reveal(el, { start: "top 90%" }));
      });

      gsap.from(".about-stats-row", {
        x: () => (window.innerWidth < 1024 ? 48 : 160),
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: reveal(
          document.querySelector(".about-stats-row"),
          { start: "top 92%" },
        ),
      });

      if (prefersReducedMotion()) return;

      // The oversized "Featured Work" wordmark slides against the scroll, so the
      // stats row reads as a horizontal band moving through the section.
      gsap.to(".about-marquee-word", {
        xPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-stats-row",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      // Slow zoom-out on the section photo for the whole time it is on screen.
      gsap.utils.toArray<HTMLElement>(".about-photo img").forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 1.16 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: img.closest(".about-photo"),
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

  useGSAP(
    () => {
      const trigger = reveal(bandRef.current, { start: "top 82%" });

      gsap.from(".about-statement", {
        y: 48,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: trigger,
      });

      gsap.from(".about-statement-line", {
        y: 18,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.09,
        scrollTrigger: trigger,
      });
    },
    { scope: bandRef },
  );

  return (
    <>
      <section
        ref={sectionRef}
        id="about"
        data-node-id="156:6770"
        className="relative w-full overflow-hidden bg-ink py-[80px] lg:h-[1184px] lg:py-0"
      >
        <div className="relative mx-auto h-full w-full max-w-[1440px] px-6 lg:px-0">
          <p className="about-label font-body text-[18px] font-medium leading-[18px] tracking-[-0.25px] text-white lg:absolute lg:left-[1014px] lg:top-[147px] lg:-translate-y-1/2">
            [ ABOUT US ]
          </p>

          <div className="mt-10 lg:mt-0 lg:pt-[160px]">
            <h2 className="font-display text-[clamp(2rem,3.9vw,56px)] font-medium tracking-[-2px] text-white">
              <span className="block overflow-hidden">
                <span className="about-title-inner flex flex-wrap items-center gap-x-[8px] lg:h-[64px] lg:flex-nowrap">
                  <span className="leading-[56px]">Project Help is</span>
                  <span className="flex items-center overflow-clip px-[20px]">
                    <span className="flex items-center pr-[8px]">
                      {AVATARS.map((avatar) => (
                        <span
                          key={avatar.src}
                          className="about-avatar relative block h-[64px] w-[50.4px] shrink-0"
                        >
                          <span className="relative block size-[64px] overflow-clip rounded-[12px] border-[3px] border-[#111]">
                            <Image
                              src={avatar.src}
                              alt={avatar.alt}
                              fill
                              sizes="64px"
                              className="rounded-[12px] object-cover"
                            />
                          </span>
                        </span>
                      ))}
                      <span className="about-avatar flex size-[64px] shrink-0 items-center justify-center rounded-[32px] bg-ash-deep">
                        <span className="relative block h-[24px] w-[21.63px]">
                          <Image
                            src="/icons/icon-showcase-extra.svg"
                            alt=""
                            fill
                            className="object-contain"
                          />
                        </span>
                      </span>
                    </span>
                  </span>
                  <span className="leading-[56px]">empowering</span>
                </span>
              </span>

              <span className="block overflow-hidden">
                <span className="about-title-inner block leading-[56px]">
                  businesses through <span className="text-ash-muted">innovative</span>
                </span>
              </span>

              <span className="block overflow-hidden">
                <span className="about-title-inner block leading-[56px] text-ash-muted">
                  technology solutions.
                </span>
              </span>
            </h2>
          </div>

          <div className="mt-[60px] w-full lg:pointer-events-none lg:absolute lg:left-0 lg:top-[396px] lg:mt-0 lg:h-[788px]">
            {/* `w-full` rather than a hard 1440: the parent is already capped at
                the canvas width, and pinning this to 1440 pushed the section
                past the viewport on every window between lg and 1440. */}
            <div className="flex w-full flex-col items-start gap-[80px] lg:pointer-events-auto lg:sticky lg:top-0 lg:gap-[120px] lg:pb-[24px] lg:pt-[80px]">
              <AboutStatement tone="dark" />

              <div className="w-full overflow-hidden lg:pl-[530.33px]">
                <div className="flex w-full flex-col items-start justify-end lg:w-[1296px] lg:items-end">
                  <div className="about-stats-row flex flex-col items-start gap-[32px] lg:flex-row lg:items-start lg:justify-end lg:gap-[48px]">
                    <div
                      aria-hidden
                      className="hidden shrink-0 flex-col items-start justify-center gap-[20px] lg:flex"
                    >
                      <div className="flex items-start justify-end pr-[42px]">
                        <div className="h-[132px] w-[181.14px]" />
                      </div>
                      <div className="h-[24px] w-[208.86px]" />
                    </div>

                    <div
                      className={`flex shrink-0 flex-col items-start justify-center gap-[20px] ${STATS[0].pl}`}
                    >
                      <div className={`flex items-start justify-end ${STATS[0].gap}`}>
                        <span
                          data-value={STATS[0].value}
                          className="about-stat-value inline-block min-w-[2ch] text-right font-display text-[clamp(5rem,11.5vw,165px)] font-normal uppercase leading-[132px] tracking-[-10px] tabular-nums text-bg"
                        >
                          {STATS[0].value}
                        </span>
                        <span className="relative mt-[6px] size-[22px] shrink-0">
                          <Image
                            src="/icons/icon-stat-plus.svg"
                            alt=""
                            fill
                            className="object-contain"
                          />
                        </span>
                      </div>
                      <span className="font-display text-[24px] font-medium leading-[24px] tracking-[-0.75px] text-ash-muted">
                        {STATS[0].label}
                      </span>
                    </div>

                    <div className="hidden h-[64px] min-h-[64px] w-[54px] min-w-[54px] shrink-0 flex-col items-start pt-[48px] lg:flex">
                      <div className="h-[16px] min-h-[16px] w-[54px] min-w-[54px] bg-ash-muted" />
                    </div>

                    <div
                      className={`flex shrink-0 flex-col items-start justify-center gap-[20px] ${STATS[1].pl}`}
                    >
                      <div className={`flex items-start justify-end ${STATS[1].gap}`}>
                        <span
                          data-value={STATS[1].value}
                          className="about-stat-value inline-block min-w-[2ch] text-right font-display text-[clamp(5rem,11.5vw,165px)] font-normal uppercase leading-[132px] tracking-[-10px] tabular-nums text-bg"
                        >
                          {STATS[1].value}
                        </span>
                        <span className="relative mt-[6px] size-[22px] shrink-0">
                          <Image
                            src="/icons/icon-stat-plus.svg"
                            alt=""
                            fill
                            className="object-contain"
                          />
                        </span>
                      </div>
                      <span className="font-display text-[24px] font-medium leading-[24px] tracking-[-0.75px] text-ash-muted">
                        {STATS[1].label}
                      </span>
                    </div>

                    <div className="hidden shrink-0 items-start justify-center lg:flex">
                      <span className="about-marquee-word font-display text-[160px] font-medium uppercase leading-[160px] tracking-[-10px] text-bg">
                        Featured Work
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={bandRef}
        data-node-id="156:6841"
        className="relative w-full bg-bg py-[60px] lg:py-0"
      >
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-0">
          <div className="w-full lg:pb-[24px] lg:pt-[80px]">
            <AboutStatement tone="light" />
          </div>
        </div>
      </section>
    </>
  );
}
