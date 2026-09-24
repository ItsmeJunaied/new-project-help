"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/anim";

// Claims we can stand behind, in place of a row of borrowed logos.
const PROOF_POINTS = [
  "Since 2021",
  "95% client satisfaction",
  "6–12 months post-launch support",
  "You own the code and the cloud accounts",
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // Deliberately a whole-line reveal rather than a per-character split.
      // Splitting rebuilds the H1 out of inline-block spans on hydration, and
      // their baselines do not match the plain text they replace — the second
      // line jumped, which is a 0.39 layout shift on the largest element on the
      // page. The lines rise inside their own overflow-hidden wrappers instead.
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Absolute positions rather than relative offsets. The portrait is the
      // LCP element and it starts fully clipped, so every frame it spends
      // hidden is measured as render delay — it now uncovers alongside the
      // headline from t=0 instead of waiting for it. The rest of the
      // choreography keeps the same relative order and feel.
      tl.from(
        ".hero-portrait",
        { clipPath: "inset(100% 0% 0% 0%)", scale: 1.1, duration: 1 },
        0,
      )
        .from(
          ".hero-line-inner",
          { yPercent: 112, duration: 1.1, stagger: 0.12 },
          0,
        )
        .from(
          ".hero-pill",
          {
            scaleX: 0,
            opacity: 0,
            duration: 0.9,
            transformOrigin: "left center",
          },
          0.42,
        )
        .from(".hero-reveal", { y: 28, opacity: 0, duration: 0.8, stagger: 0.12 }, 0.5)
        .from(".hero-brand", { y: 14, opacity: 0, duration: 0.6, stagger: 0.08 }, 0.95);

      // The pill keeps breathing once the entrance settles.
      gsap.to(".hero-pill", {
        yPercent: -6,
        duration: 2.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.6,
      });

      // Portrait and headline part company as the next section takes over.
      gsap.to(".hero-portrait", {
        yPercent: 10,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(".hero-headline", {
        yPercent: -12,
        opacity: 0.3,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom 30%",
          scrub: true,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-node-id="156:6893"
      className="relative w-full overflow-hidden bg-bg pt-[48px] lg:pt-[65px]"
    >
      <div className="relative mx-auto w-full max-w-[1440px] px-6 lg:px-0">
        {/* Same two-line lockup as the design — word, pill, word / word. The
            clamp maximum is the only tuned value: "CUSTOM SOFTWARE" sets far
            wider than the two words this was drawn with, so the ceiling is the
            largest size that keeps line one on the 1440 canvas. */}
        <h1 className="hero-headline font-display text-[clamp(2.75rem,8.5vw,124px)] font-medium uppercase leading-[1.2125] tracking-[-0.0625em] text-black lg:-ml-[6px] lg:-mt-[0.10625em]">
          <span className="block overflow-hidden">
            {/* Wraps below lg, where the words genuinely do not fit. From lg up
                it is one line by design — and it must be pinned that way,
                because a fallback font wide enough to wrap this line pushes
                "BUILDERS" down a whole line and that reflow is a 0.39 layout
                shift on the biggest element on the page. */}
            <span className="hero-line-inner flex flex-wrap items-center gap-x-[0.11em] lg:flex-nowrap">
              <span className="hero-word">Custom</span>
              <span className="hero-pill relative inline-block h-[0.85em] w-[2.45em] shrink-0 overflow-hidden rounded-[100px]">
                <Image
                  src="/images/hero-tech-pill.webp"
                  alt=""
                  fill
                  sizes="392px"
                  loading="eager"
                  className="object-cover"
                />
              </span>
              <span className="hero-word">Software</span>
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-line-inner block">
              <span className="hero-word">Builders</span>
            </span>
          </span>
        </h1>

        <div className="hero-portrait relative mt-10 h-[320px] w-full sm:h-[440px] lg:absolute lg:right-[-8px] lg:top-[194px] lg:mt-0 lg:h-[566px] lg:w-[588px]">
          <Image
            src="/images/hero-portrait.webp"
            alt="Engineer at work lit by red laser tracing lines"
            fill
            sizes="(max-width: 1023px) 100vw, 588px"
            // This is the LCP element. next/image docs say to use fetchPriority
            // rather than `preload` — the two are not meant to be combined, and
            // the priority hint is what the browser actually schedules on.
            loading="eager"
            fetchPriority="high"
            className="object-cover"
          />
        </div>

        <div className="mt-10 lg:mt-[45px] lg:max-w-[860px]">
          <div className="flex flex-col gap-[40px]">
            <div className="hero-reveal flex items-center gap-[8px]">
              <span className="font-display text-[28px] font-medium leading-[25.714px] text-primary-green">
                &copy;
              </span>
              <span className="font-display text-[28px] font-medium leading-[28px] tracking-[-0.75px] text-black">
                [21-26]
              </span>
            </div>

            <p className="hero-reveal max-w-[480px] font-display text-[clamp(1.75rem,3vw,40px)] font-medium leading-[1.1] tracking-[-0.05em] text-black">
              We turn product ideas into{" "}
              <span className="text-ash-dark">software that scales</span>
            </p>
          </div>

          <p className="hero-reveal mt-[24px] max-w-[825px] font-body text-[clamp(1.125rem,1.7vw,24px)] leading-[27px] tracking-[-0.25px] text-ash-dark">
            We build SaaS platforms, eCommerce systems, cloud infrastructure and
            AI/ML applications &mdash; engineered to scale, secure by default, and
            shipped on time.
          </p>

          <div className="mt-[48px] flex flex-wrap items-center gap-x-[12px] gap-y-6 lg:mt-[84px]">
            <p className="hero-brand font-body text-[16px] leading-[1.6] tracking-[-0.48px] text-black">
              Trusted by 28+ teams worldwide :
            </p>
            <ul className="flex flex-wrap items-center gap-x-[28px] gap-y-[12px]">
              {PROOF_POINTS.map((point) => (
                <li key={point} className="hero-brand flex items-center gap-[8px]">
                  <span className="size-[8px] shrink-0 bg-primary-green" aria-hidden />
                  <span className="whitespace-nowrap font-display text-[16px] font-medium leading-[1.2] tracking-[-0.25px] text-black">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
