"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { magnetic, reveal } from "@/lib/anim";
import { trackNewsletterSignup } from "@/lib/analytics";

type Status = "idle" | "sending" | "sent" | "error";

type NewsletterBandProps = {
  /** Recorded against the subscriber so we know which page converted. */
  source: string;
};

/**
 * Email capture, carried over from the current live site's newsletter banner.
 * Drawn in the rebuild's own language — near-black band, one rule, one orange
 * accent — rather than the old site's card.
 */
export default function NewsletterBand({ source }: NewsletterBandProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 88%" });

      gsap.from(".newsletter-reveal", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: trigger,
      });

      gsap.from(".newsletter-rule", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1,
        ease: "power2.inOut",
        scrollTrigger: trigger,
      });

      return magnetic(buttonRef.current, 0.18);
    },
    { scope: sectionRef },
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot: a real visitor never fills a field they cannot see.
    if (String(data.get("company") ?? "").trim()) {
      form.reset();
      setStatus("sent");
      return;
    }

    const email = String(data.get("email") ?? "").trim();
    if (!email) {
      setStatus("error");
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      if (!response.ok) throw new Error("Request failed");
      form.reset();
      setStatus("sent");
      trackNewsletterSignup(source);
    } catch {
      setStatus("error");
    }
  }

  return (
    <section ref={sectionRef} className="w-full bg-bg px-6 pb-[80px] lg:px-0 lg:pb-[120px]">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="newsletter-rule h-px w-full bg-[#e7e7e7]" />

        <div className="flex w-full flex-col items-start justify-between gap-[32px] pt-[48px] lg:flex-row lg:items-end lg:gap-[80px]">
          <div className="newsletter-reveal flex max-w-[560px] flex-col gap-[12px]">
            <p className="font-mono text-[14px] font-medium uppercase leading-[16px] tracking-[0.5px] text-primary-green">
              [ Newsletter ]
            </p>
            <h2 className="font-display text-[clamp(1.75rem,3vw,40px)] font-medium leading-[1.15] tracking-[-1px] text-black">
              One email a month. What we shipped and what it taught us.
            </h2>
            <p className="font-body text-[16px] leading-[24px] tracking-[-0.16px] text-ash-dark">
              No drip sequence, no sales cadence.{" "}
              <Link
                href="/unsubscribe"
                className="text-black underline underline-offset-[3px] transition-colors hover:text-primary-green"
              >
                Unsubscribe
              </Link>{" "}
              in one click, any time.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="newsletter-reveal flex w-full flex-col gap-[12px] lg:w-[460px]">
            <div className="flex w-full flex-col gap-[12px] sm:flex-row">
              <label className="sr-only" htmlFor="newsletter-email">
                Email address
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@company.com"
                className="h-[52px] w-full min-w-0 flex-1 border-b border-[#c9c9c9] bg-transparent font-body text-[16px] leading-[24px] tracking-[-0.16px] text-black outline-none transition-colors placeholder:text-ash-muted focus:border-black"
              />

              {/* Honeypot — visually and semantically hidden from real users. */}
              <input
                type="text"
                name="company"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                className="pointer-events-none absolute size-px overflow-hidden opacity-0"
              />

              <button
                ref={buttonRef}
                type="submit"
                disabled={status === "sending"}
                className="flex h-[52px] shrink-0 items-center justify-center rounded-[100px] border border-black bg-black px-[28px] font-body text-[16px] font-medium leading-[24px] tracking-[-0.25px] text-white transition-colors hover:bg-transparent hover:text-black disabled:opacity-60"
              >
                {status === "sending" ? "Subscribing…" : "Subscribe"}
              </button>
            </div>

            <p
              aria-live="polite"
              className={`min-h-[20px] font-body text-[14px] leading-[20px] tracking-[-0.16px] ${
                status === "error" ? "text-primary-green" : "text-ash-dark"
              }`}
            >
              {status === "sent" && "You're on the list. Talk soon."}
              {status === "error" && "That didn't go through. Try again, or email hello@projecthelpbd.com."}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
