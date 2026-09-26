"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/anim";
import AutoVideo from "@/components/ui/AutoVideo";

/**
 * Real client marks, supplied by the clients themselves.
 *
 * `height` is per logo on purpose: a row matches on cap height, not box height,
 * so the two square marks stand taller than the Rongobuy wordmark. Rongobuy is
 * also kept at its native 161x36 rather than upscaled, so its height is set by
 * what the source actually has.
 */
const CLIENTS = [
  { name: "Signature Bangla", src: "/images/clients/signature-bangla.png", width: 120, height: 120, className: "h-[30px]" },
  { name: "Textalyz AI", src: "/images/clients/textalyz-ai.png", width: 120, height: 120, className: "h-[30px]" },
  { name: "Rongobuy", src: "/images/clients/rongobuy.png", width: 161, height: 36, className: "h-[18px]" },
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
      // The vertical rhythm is tied to svh so the whole banner clears the fold
      // on a short laptop as well as a 900px window. The clamp floors are the
      // point where the spacing stops reading as deliberate, not zero.
      className="relative w-full overflow-hidden bg-bg pt-[48px] lg:pt-[clamp(24px,4.5svh,65px)] lg:pb-[clamp(16px,3svh,48px)]"
    >
      <div className="relative mx-auto w-full max-w-[1440px] px-6 lg:px-[40px]">
        {/* Same two-line lockup as the design — word, pill, word / word. The
            clamp maximum is the only tuned value: "CUSTOM SOFTWARE" sets far
            wider than the two words this was drawn with, so the ceiling is the
            largest size that keeps line one on one line. It came down from
            8.5vw/124px when the 40px side gutters went in — the line now has
            1360px to sit on at 1440, not the full canvas. */}
        <h1 className="hero-headline font-display text-[clamp(2.75rem,8vw,115px)] font-medium uppercase leading-[1.2125] tracking-[-0.0625em] text-black lg:-ml-[6px] lg:-mt-[0.10625em]">
          <span className="block overflow-hidden">
            {/* Wraps below lg, where the words genuinely do not fit. From lg up
                it is one line by design — and it must be pinned that way,
                because a fallback font wide enough to wrap this line pushes
                "BUILDERS" down a whole line and that reflow is a 0.39 layout
                shift on the biggest element on the page. */}
            <span className="hero-line-inner flex flex-wrap items-center gap-x-[0.11em] lg:flex-nowrap">
              <span className="hero-word">Custom</span>
              <span className="hero-pill relative inline-block h-[0.85em] w-[2.45em] shrink-0 overflow-hidden rounded-[100px]">
                {/* The pill keeps its shape and its place in the line — only
                    what is inside it moves now. Decorative: the headline reads
                    "Custom Software Builders" with or without it. */}
                <AutoVideo
                  src="/videos/hero-pill.mp4"
                  poster="/images/hero-pill-poster.webp"
                  eager
                  decorative
                  className="absolute inset-0 size-full object-cover"
                />
              </span>
              <span className="hero-word">Software</span>
            </span>
          </span>
          {/* Line two carries the [21-26] stamp on its own baseline instead of
              giving it a row below. The mask stays wrapped around the word
              alone: the stamp arrives on the .hero-reveal stagger, not the
              line rise, so it must not be clipped by a reveal it is not part
              of. */}
          <span className="block">
            {/* The cap keeps the row clear of the portrait, whose left edge is
                540px in from the content edge. Below roughly 1180px the stamp
                no longer fits beside the word, and wrapping it under BUILDERS
                is what it used to do anyway — better than sliding it behind a
                photograph. shrink-0 on the mask because `overflow: hidden`
                resolves min-width to 0, so without it the flex row would
                squeeze the word and clip its own letters rather than wrap. */}
            <span className="flex flex-wrap items-end gap-x-[20px] gap-y-[8px] lg:max-w-[calc(100%-560px)] lg:gap-x-[32px]">
              <span className="block shrink-0 overflow-hidden">
                <span className="hero-line-inner block">
                  <span className="hero-word">Builders</span>
                </span>
              </span>

              {/* The padding is em of the H1, not of the 28px text inside it,
                  so the stamp keeps sitting on BUILDERS' baseline as the
                  headline clamp resizes. */}
              <span className="hero-reveal flex shrink-0 items-center gap-[8px] tracking-normal lg:pb-[0.3em]">
                <span className="font-display text-[28px] font-medium leading-[25.714px] text-primary-green">
                  &copy;
                </span>
                <span className="font-display text-[28px] font-medium leading-[28px] tracking-[-0.75px] text-black">
                  [21-26]
                </span>
              </span>
            </span>
          </span>
        </h1>

        {/* 16:9, which is the ratio the showreel was shot at. The frame used to
            be pinned top and bottom and took whatever height was left — about
            540x400 — and a 16:9 film can only fill a frame that shape by being
            cropped to 76% of its width. This showreel is wall-to-wall centred
            type, so that crop reads "IGITAL PRODUC". Matching the frame to the
            film is the only arrangement with neither a crop nor bars.

            Still anchored to the bottom, so its lower edge keeps landing on the
            same line as the text column beside it. */}
        <div className="hero-portrait relative mt-10 aspect-video w-full lg:absolute lg:bottom-0 lg:right-[40px] lg:mt-0 lg:w-[540px]">
          {/* The same silent cut the footer plays, so the footer's copy comes
              out of cache. The poster carries the LCP: it is a frame of this
              film, so the still and the first frame of video are the same
              picture and there is nothing to see at the handover. */}
          <AutoVideo
            src="/videos/showreel-40s-loop.mp4"
            poster="/images/showreel-40s-poster.webp"
            eager
            label="Project Help showreel"
            className="absolute inset-0 size-full object-cover"
          />
        </div>

        {/* The [21-26] stamp used to open this block, so it needed real air
            above it to separate from the headline. It now sits on the
            headline's own last line, and the tagline reads as a new thought at
            a tighter offset. */}
        <div className="mt-10 lg:mt-[clamp(24px,4.6svh,56px)] lg:max-w-[860px]">
          <p className="hero-reveal max-w-[480px] font-display text-[clamp(1.75rem,3vw,40px)] font-medium leading-[1.1] tracking-[-0.05em] text-black">
            We turn product ideas into{" "}
            <span className="text-ash-dark">software that scales</span>
          </p>

          {/* 720 rather than 825: the portrait's left edge is at 860 once the
              gutter is in, and this paragraph is the only thing wide enough to
              reach it. */}
          <p className="hero-reveal mt-[24px] max-w-[825px] font-body text-[clamp(1.125rem,1.7vw,24px)] leading-[27px] tracking-[-0.25px] text-ash-dark lg:mt-[clamp(14px,2.4svh,24px)] lg:max-w-[720px]">
            We build SaaS platforms, eCommerce systems, cloud infrastructure and
            AI/ML applications &mdash; engineered to scale, secure by default, and
            shipped on time.
          </p>

          <div className="mt-[32px] flex flex-wrap items-center gap-x-[24px] gap-y-4 lg:mt-[clamp(16px,3.4svh,44px)]">
            <p className="hero-brand font-body text-[16px] leading-[1.6] tracking-[-0.48px] text-black">
              Trusted by 28+ teams worldwide :
            </p>
            <ul className="flex flex-wrap items-center gap-x-[28px] gap-y-[12px]">
              {CLIENTS.map((client) => (
                <li key={client.name} className="hero-brand flex items-center">
                  <Image
                    src={client.src}
                    alt={client.name}
                    width={client.width}
                    height={client.height}
                    // Above the fold now that the banner fits one screen, so
                    // these must not lazy-load and pop in after paint.
                    loading="eager"
                    className={`${client.className} w-auto object-contain`}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
