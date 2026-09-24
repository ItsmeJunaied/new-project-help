"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { magnetic, prefersReducedMotion } from "@/lib/anim";

type Status = "idle" | "sending" | "done" | "error";

/**
 * One field, one button, no login. An opt-out that is harder than the opt-in is
 * the thing the rule exists to prevent, so this asks for nothing beyond the
 * address and never reports whether that address was on the list.
 */
export default function UnsubscribeForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");

  // A link from an email carries the address, so the field arrives filled in
  // and the reader only has to press the button.
  useEffect(() => {
    const email = new URLSearchParams(window.location.search).get("email");
    if (email && inputRef.current) inputRef.current.value = email;
  }, []);

  useGSAP(
    () => {
      if (!prefersReducedMotion()) {
        gsap.from(".unsub-reveal", {
          y: 20,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.08,
        });
      }

      return magnetic(buttonRef.current, 0.18);
    },
    { scope: sectionRef },
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const email = String(new FormData(event.currentTarget).get("email") ?? "").trim();
    if (!email) {
      setStatus("error");
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      ref={sectionRef}
      className="w-full bg-bg px-6 pb-[120px] pt-[60px] lg:px-0 lg:pb-[180px] lg:pt-[100px]"
    >
      <div className="mx-auto w-full max-w-[1440px]">
        <p className="unsub-reveal font-mono text-[14px] font-medium uppercase leading-[16px] tracking-[0.5px] text-primary-green">
          [ Newsletter ]
        </p>

        <h1 className="unsub-reveal mt-[16px] font-display text-[clamp(2.25rem,5vw,68px)] font-medium leading-[1.05] tracking-[-2px] text-black lg:max-w-[900px]">
          Unsubscribe
        </h1>

        {status === "done" ? (
          <div className="unsub-reveal mt-[24px] flex flex-col items-start gap-[20px] lg:max-w-[620px]">
            <p className="font-body text-[18px] leading-[28px] tracking-[-0.16px] text-ash-dark">
              Done — that address is off the list. You will not get another newsletter from
              us. Anything you have already asked us about by email is unaffected.
            </p>
            <Link
              href="/"
              className="flex items-center rounded-[100px] border border-black px-[24px] py-[13px] font-body text-[16px] font-medium leading-[24px] tracking-[-0.25px] text-black transition-colors hover:bg-black hover:text-white"
            >
              Back to the site
            </Link>
          </div>
        ) : (
          <>
            <p className="unsub-reveal mt-[20px] font-body text-[18px] leading-[28px] tracking-[-0.16px] text-ash-dark lg:max-w-[620px]">
              Enter the address you subscribed with. One click, no questions, no
              confirmation email to chase.
            </p>

            <form
              onSubmit={handleSubmit}
              className="unsub-reveal mt-[40px] flex w-full flex-col gap-[12px] lg:max-w-[560px]"
            >
              <div className="flex w-full flex-col gap-[12px] sm:flex-row">
                <label className="sr-only" htmlFor="unsubscribe-email">
                  Email address
                </label>
                <input
                  ref={inputRef}
                  id="unsubscribe-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  className="h-[52px] w-full min-w-0 flex-1 border-b border-[#c9c9c9] bg-transparent font-body text-[16px] leading-[24px] tracking-[-0.16px] text-black outline-none transition-colors placeholder:text-ash-muted focus:border-black"
                />
                <button
                  ref={buttonRef}
                  type="submit"
                  disabled={status === "sending"}
                  className="flex h-[52px] shrink-0 items-center justify-center rounded-[100px] border border-black bg-black px-[28px] font-body text-[16px] font-medium leading-[24px] tracking-[-0.25px] text-white transition-colors hover:bg-transparent hover:text-black disabled:opacity-60"
                >
                  {status === "sending" ? "Removing…" : "Unsubscribe"}
                </button>
              </div>

              <p
                aria-live="polite"
                className="min-h-[20px] font-body text-[14px] leading-[20px] tracking-[-0.16px] text-primary-green"
              >
                {status === "error" &&
                  "That didn't go through. Try again, or email hello@projecthelpbd.com and we'll remove you by hand."}
              </p>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
