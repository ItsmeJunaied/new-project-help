"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/anim";
import { trackLead, trackScheduleClick } from "@/lib/analytics";
import { siteConfig } from "@/lib/site";

const WHATSAPP_MESSAGE = "Hi Project Help! I'd like to discuss a project with your team.";

/**
 * The two always-available ways to start a conversation, carried over from the
 * live site: a WhatsApp thread and a Calendly booking.
 *
 * Both sit bottom-right in one stack rather than one per corner, so they never
 * cover the footer ticker or a mobile form's submit button. The consult card
 * stays collapsed until the visitor has read something — springing a panel at
 * someone who just landed is the pattern everybody closes on reflex.
 */
export default function FloatingActions() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [deep, setDeep] = useState(false);

  useEffect(() => {
    // Appears once the visitor is past the first screen; back-to-top only
    // shows up deep enough in the page for it to be worth the pixels.
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.6);
      setDeep(window.scrollY > window.innerHeight * 2.5);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(rootRef.current, { autoAlpha: visible ? 1 : 0, y: 0 });
        return;
      }

      gsap.to(rootRef.current, {
        autoAlpha: visible ? 1 : 0,
        y: visible ? 0 : 16,
        duration: 0.45,
        ease: "power3.out",
      });
    },
    { dependencies: [visible] },
  );

  const whatsappHref = `${siteConfig.whatsappHref}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed bottom-[20px] right-[16px] z-40 flex flex-col items-end gap-[12px] opacity-0 sm:bottom-[28px] sm:right-[28px]"
    >
      {expanded && !dismissed && (
        <div className="pointer-events-auto relative w-[min(300px,calc(100vw-32px))] overflow-hidden rounded-[16px] bg-[#151515] shadow-[0_18px_50px_-12px_rgba(0,0,0,0.45)]">
          <div className="flex flex-col gap-[8px] px-[20px] pb-[18px] pt-[20px]">
            <p className="font-display text-[18px] font-medium leading-[1.25] tracking-[-0.25px] text-white">
              Book a free 30-minute call
            </p>
            <p className="font-body text-[14px] leading-[20px] tracking-[-0.16px] text-[#a8a29e]">
              Talk through scope, budget and timeline with an engineer — no sales deck.
            </p>
          </div>

          <a
            href={siteConfig.calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackScheduleClick("floating_consult")}
            className="flex items-center justify-center bg-primary-green px-[20px] py-[13px] font-body text-[15px] font-medium leading-[22px] tracking-[-0.25px] text-white transition-opacity hover:opacity-90"
          >
            Pick a time
          </a>

          <button
            type="button"
            onClick={() => {
              setExpanded(false);
              setDismissed(true);
            }}
            aria-label="Dismiss"
            className="absolute right-[10px] top-[10px] flex size-[26px] items-center justify-center rounded-full text-[16px] leading-none text-[#a8a29e] transition-colors hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      <div className="pointer-events-auto flex items-center gap-[10px]">
        {deep && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })}
            aria-label="Back to top"
            className="flex size-[52px] items-center justify-center rounded-full border border-black/15 bg-bg font-display text-[18px] leading-none text-black shadow-[0_8px_24px_-8px_rgba(0,0,0,0.3)] transition-transform duration-300 hover:scale-105"
          >
            &uarr;
          </button>
        )}

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackLead("floating_whatsapp")}
          aria-label="Chat with us on WhatsApp"
          className="flex size-[52px] items-center justify-center rounded-full bg-[#25d366] shadow-[0_8px_24px_-6px_rgba(37,211,102,0.55)] transition-transform duration-300 hover:scale-105"
        >
          <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="size-[24px] text-white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.898 9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.82 11.82 0 0 0 20.464 3.488" />
          </svg>
        </a>

        {!dismissed && (
          <button
            type="button"
            onClick={() => setExpanded((open) => !open)}
            aria-expanded={expanded}
            className="flex h-[52px] items-center gap-[8px] rounded-full bg-black pl-[20px] pr-[18px] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:scale-[1.03]"
          >
            <span className="font-body text-[15px] font-medium leading-[22px] tracking-[-0.25px] text-white">
              Book a call
            </span>
            <span
              aria-hidden
              className={`text-[14px] leading-none text-primary-green transition-transform duration-300 ${
                expanded ? "rotate-45" : ""
              }`}
            >
              ＋
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
