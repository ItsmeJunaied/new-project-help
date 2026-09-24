"use client";

import { QuoteMark } from "@/components/ui/BrandIcons";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";
import { TESTIMONIALS } from "@/lib/testimonials";

const CARD_PITCH = 466; // 442px card + 24px gap

const RULE_POSITIONS = ["left-0", "left-1/3", "left-2/3", "right-0"];

/**
 * Renders nothing until lib/testimonials.ts carries real, permissioned quotes.
 * An empty carousel with arrows and dots is worse than no section at all, and
 * the previous fill for this slot was four invented people.
 */
export default function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;
  return <TestimonialsCarousel />;
}

function TestimonialsCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((next: number) => {
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!track || !viewport) return;

    const maxOffset = Math.max(0, track.scrollWidth - viewport.clientWidth);
    const clamped = Math.max(0, Math.min(next, TESTIMONIALS.length - 1));
    const offset = Math.min(clamped * CARD_PITCH, maxOffset);

    setIndex(clamped);
    gsap.to(track, { x: -offset, duration: 0.8, ease: "power3.out" });
  }, []);

  // Auto-advance so the carousel is visibly alive; pauses on hover/focus and
  // whenever the viewer takes manual control.
  useEffect(() => {
    if (paused || prefersReducedMotion()) return;

    const id = window.setInterval(() => {
      setIndex((current) => {
        const next = (current + 1) % TESTIMONIALS.length;
        goTo(next);
        return next;
      });
    }, 4500);

    return () => window.clearInterval(id);
  }, [paused, goTo]);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 78%" });

      gsap.from(".testimonial-rule", {
        scaleY: 0,
        duration: 1.2,
        ease: "power2.inOut",
        stagger: 0.08,
        transformOrigin: "top center",
        scrollTrigger: trigger,
      });

      gsap.from(".testimonial-heading-inner", {
        yPercent: 110,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: trigger,
      });

      gsap.from(".testimonial-intro", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: trigger,
      });

      gsap.from(".testimonial-meta", {
        y: 18,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: trigger,
      });

      gsap.from(".testimonial-card", {
        y: 64,
        opacity: 0,
        rotateX: -8,
        transformOrigin: "center top",
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: reveal(
          document.querySelector(".testimonial-carousel"),
          { start: "top 88%" },
        ),
      });

      if (prefersReducedMotion()) return;

      // Quote marks pulse gently once the cards have landed.
      gsap.to(".testimonial-quote-mark", {
        scale: 1.12,
        duration: 2.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: 0.3,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-node-id="156:7475"
      className="relative w-full overflow-hidden bg-black py-[80px] lg:pb-[87px] lg:pt-[120px]"
    >
      <div className="pointer-events-none absolute inset-0 mx-auto w-full max-w-[1440px] px-6 lg:px-0">
        <div className="relative h-full w-full">
          {RULE_POSITIONS.map((position) => (
            <span
              key={position}
              className={`testimonial-rule absolute top-0 h-full w-px bg-ash-dark ${position}`}
            />
          ))}
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-[48px] px-6 lg:px-0">
        <div className="testimonial-meta flex w-full flex-col gap-[8px]">
          <div className="flex w-full items-center justify-between text-[18px] leading-[25.714px] text-white">
            <p className="font-display font-medium">&copy; Client Feedback</p>
            <p className="text-right font-body font-bold">{"//028 Delivered"}</p>
          </div>
          <div className="h-px w-full bg-white/20" />
        </div>

        <div className="flex w-full flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <h2 className="w-full max-w-[620px] font-display text-[clamp(2.25rem,4.4vw,64px)] font-medium leading-[1.1] tracking-[-1.5px] text-white lg:pt-[7.5px]">
            <span className="block overflow-hidden">
              <span className="testimonial-heading-inner block">Why teams keep</span>
            </span>
            <span className="block overflow-hidden">
              <span className="testimonial-heading-inner block">building with us</span>
            </span>
          </h2>

          <p className="testimonial-intro w-full max-w-[400px] font-display text-[18px] leading-[28.8px] text-[#e6e6e6]">
            We do not just finish projects &mdash; we stay on after launch. Here is what
            the teams we shipped for have to say.
          </p>
        </div>

        <div
          className="testimonial-carousel relative flex w-full flex-col gap-[32px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div ref={viewportRef} className="w-full overflow-hidden">
            <div ref={trackRef} className="flex items-stretch gap-[24px]">
              {TESTIMONIALS.map((item) => (
                <article
                  key={item.id}
                  className="testimonial-card flex h-[490px] w-[300px] shrink-0 flex-col justify-between bg-[#232323] px-[20px] pb-[19.99px] pt-[20px] transition-colors duration-500 hover:bg-[#2c2c2c] sm:w-[442px]"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="relative flex h-[82px] w-[102px] shrink-0 items-center justify-center overflow-clip rounded-[12px] bg-[#2f2f2f]">
                      {item.avatar ? (
                        <Image
                          src={item.avatar}
                          alt={`${item.name} portrait`}
                          fill
                          sizes="102px"
                          className="object-cover object-top"
                        />
                      ) : (
                        <span className="font-display text-[28px] font-medium leading-none text-white">
                          {item.name
                            .split(" ")
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")}
                        </span>
                      )}
                    </div>
                    {item.logo && (
                      <div className="relative flex h-[50px] w-[140px] shrink-0 items-center justify-center overflow-clip">
                        <Image
                          src={item.logo.src}
                          alt={item.logo.alt}
                          width={140}
                          height={43}
                          className="h-[42.532px] w-[140px] object-contain"
                        />
                      </div>
                    )}
                  </div>

                  <div className="relative w-full pt-[44px]">
                    <span className="testimonial-quote-mark absolute left-0 top-[45px] block size-[28px] origin-center">
                      <QuoteMark className="size-[28px] text-primary-green" />
                    </span>
                    <p className="w-full pb-[10px] indent-[36px] font-display text-[20px] leading-[26px] text-white">
                      {item.quote}
                    </p>
                    <div className="flex w-full flex-col items-start gap-[4px] pt-[80px]">
                      <p className="w-full font-display text-[24px] leading-[31.2px] tracking-[-1.2px] text-white">
                        {item.name}
                      </p>
                      <p className="w-full font-display text-[16px] leading-[25.6px] text-[#9d9d9d]">
                        {item.role}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="flex h-[40px] w-full items-center justify-between pt-[10px]">
            <div className="flex items-center">
              {TESTIMONIALS.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show testimonial ${i + 1} of ${TESTIMONIALS.length}`}
                  aria-current={i === index}
                  // 24px is the smallest target WCAG 2.2 / Lighthouse accept.
                  // The dot itself stays 12px and top-aligned as drawn; only the
                  // hit area around it grows.
                  className="flex size-[24px] items-start justify-center pt-[3px]"
                >
                  <span
                    className={`size-[12px] shrink-0 rounded-[12px] transition-colors ${
                      i === index ? "bg-white" : "bg-white/40"
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-[12px]">
              <button
                type="button"
                onClick={() => goTo(index - 1)}
                disabled={index === 0}
                aria-label="Previous testimonial"
                className="flex size-[48px] items-center justify-center rounded-[2px] bg-[#232323] transition-all hover:bg-[#3a3a3a] disabled:opacity-40"
              >
                <Image
                  src="/icons/icon-carousel-prev.svg"
                  alt=""
                  width={14}
                  height={14}
                  className="size-[14px]"
                />
              </button>
              <button
                type="button"
                onClick={() => goTo(index + 1)}
                disabled={index === TESTIMONIALS.length - 1}
                aria-label="Next testimonial"
                className="flex size-[48px] items-center justify-center rounded-[2px] bg-[#232323] transition-all hover:bg-[#3a3a3a] disabled:opacity-40"
              >
                <Image
                  src="/icons/icon-carousel-next.svg"
                  alt=""
                  width={14}
                  height={14}
                  className="size-[14px]"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
