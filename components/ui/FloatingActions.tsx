"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/anim";
import { trackLead, trackScheduleClick } from "@/lib/analytics";
import { siteConfig } from "@/lib/site";
import AmbientAudio from "@/components/ui/AmbientAudio";

const WHATSAPP_MESSAGE = "Hi Project Help! I'd like to discuss a project with your team.";

/**
 * The links worth carrying with the visitor. Short, because a dock with six
 * links in it is a second navigation, and the header is already the first.
 */
const LINKS = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/case-study" },
  { label: "About", href: "/about" },
];

/**
 * One dock, bottom centre, instead of three things in three corners.
 *
 * The WhatsApp thread, the booking and the ambient sound each used to float in
 * their own corner, which put three unrelated pills on a page that only ever
 * needed one place to look. They are now one bar: sound and the links on the
 * left, the call to action in the middle carrying the only colour, the WhatsApp
 * thread and the way back to the top on the right.
 *
 * It is the header's replacement, so it hands over where the header leaves off:
 * in the moment the nav scrolls off the top it slides up from the bottom, and it
 * drops away again when the nav comes back. Nothing floats over a header that is
 * still on screen carrying the same call to action.
 */
export default function FloatingActions() {
  const barRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [deep, setDeep] = useState(false);

  /**
   * A dock link pointing at the page you are already on.
   *
   * The router has nothing to do — the path does not change — so the scroll
   * reset that runs on a route change never fires and the click reads as
   * broken: you press "Services" while halfway down /services and stay exactly
   * where you were. Here it means the obvious thing instead, which is to go
   * back to the top of what you are reading.
   */
  const goToTopIfHere = (href: string) => (event: React.MouseEvent) => {
    if (pathname !== href) return;
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  /**
   * The dock stands in for the header, so it arrives the moment the header
   * leaves the screen and stands down as soon as it scrolls back in.
   *
   * That moment is watched on the header element itself rather than guessed at
   * a fraction of the window. The gate used to be six tenths of a screen, which
   * on a laptop is some four hundred pixels after the nav had already gone: by
   * the time the dock turned up there had been nothing to reach for for a while.
   * A route change remounts the page under a dock that never unmounts, so the
   * element is looked up again each time the path changes.
   */
  useEffect(() => {
    const header = document.querySelector("[data-site-header]");

    const onScroll = () => {
      // Back to top only appears deep enough in the page to be worth its width.
      setDeep(window.scrollY > window.innerHeight * 2.5);

      // Every page carries a header. If one ever does not, the dock is the only
      // way back from the foot of it, so it falls in at a header's own height.
      if (!header) setVisible(window.scrollY > 88);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    if (!header) return () => window.removeEventListener("scroll", onScroll);

    const watcher = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting));
    watcher.observe(header);

    return () => {
      window.removeEventListener("scroll", onScroll);
      watcher.disconnect();
    };
  }, [pathname]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(barRef.current, { autoAlpha: visible ? 1 : 0, y: 0 });
        return;
      }

      // Longer coming in than going out, and overwriting rather than queueing:
      // a fast flick across the header's edge would otherwise run both
      // directions one after the other and the dock would arrive twice.
      gsap.to(barRef.current, {
        autoAlpha: visible ? 1 : 0,
        y: visible ? 0 : 22,
        scale: visible ? 1 : 0.97,
        duration: visible ? 0.55 : 0.3,
        ease: visible ? "power3.out" : "power2.in",
        overwrite: true,
      });
    },
    { dependencies: [visible] },
  );

  const whatsappHref = `${siteConfig.whatsappHref}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    // Two elements, deliberately: the outer one is centred with a transform and
    // the inner one is what GSAP animates. Sharing a node would mean the tween
    // writing `transform` over the -translate-x-1/2 the first frame it ran, and
    // the dock would jump to the right-hand half of the window.
    <div className="print-hide pointer-events-none fixed inset-x-0 bottom-[16px] z-40 flex justify-center px-4 sm:bottom-[24px]">
      <div ref={barRef} className="pointer-events-auto relative opacity-0 will-change-transform">
        {/* The glow sits under the bar rather than on it, so the bar's own
            edge stays a hairline and the colour bleeds onto the page. */}
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-x-6 -bottom-4 -top-3 rounded-[999px] bg-[radial-gradient(60%_140%_at_50%_50%,rgba(134,213,42,0.24),transparent_72%)] blur-[14px]"
        />

        <div className="relative flex items-center gap-[4px] rounded-[999px] border border-white/[0.09] bg-[#0b0b0b]/95 p-[6px] shadow-[0_18px_44px_-14px_rgba(0,0,0,0.75),inset_0_1px_0_rgba(255,255,255,0.07)] backdrop-blur-xl sm:gap-[6px]">
          <div className="flex items-center pl-[4px] pr-[2px]">
            <AmbientAudio inline />
          </div>

          <span aria-hidden className="mx-[2px] h-[22px] w-px shrink-0 bg-white/[0.11]" />

          {/* The links are the first thing to go when the window narrows: the
              header still has them, and the two buttons are what this is for. */}
          <nav aria-label="Quick links" className="hidden items-center md:flex">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={goToTopIfHere(link.href)}
                className="rounded-full px-[14px] py-[9px] font-body text-[14px] font-medium leading-none tracking-[-0.2px] text-white/70 transition-colors duration-200 hover:bg-white/[0.07] hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/contact"
            onClick={(event) => {
              trackLead("dock_contact");
              goToTopIfHere("/contact")(event);
            }}
            className="group flex items-center gap-[7px] rounded-[999px] bg-primary-green px-[16px] py-[10px] shadow-[0_6px_18px_-6px_rgba(134,213,42,0.8)] transition-[transform,box-shadow] duration-300 hover:scale-[1.03] sm:px-[18px]"
          >
            <span className="whitespace-nowrap font-body text-[14px] font-semibold leading-none tracking-[-0.2px] text-black">
              Let&rsquo;s talk
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 15 15"
              fill="none"
              aria-hidden="true"
              className="shrink-0 text-black transition-transform duration-300 group-hover:translate-x-[3px]"
            >
              <path
                d="M3 7.5h9M8.4 3.6 12.3 7.5 8.4 11.4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackLead("dock_whatsapp")}
            aria-label="Chat with us on WhatsApp"
            title="WhatsApp"
            className="flex size-[38px] shrink-0 items-center justify-center rounded-full text-white/70 transition-colors duration-200 hover:bg-white/[0.07] hover:text-[#25d366]"
          >
            <svg aria-hidden viewBox="0 0 24 24" fill="currentColor" className="size-[19px]">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.898 9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.82 11.82 0 0 0 20.464 3.488" />
            </svg>
          </a>

          <a
            href={siteConfig.calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackScheduleClick("dock_calendly")}
            aria-label="Book a 30-minute call"
            title="Book a call"
            className="hidden size-[38px] shrink-0 items-center justify-center rounded-full text-white/70 transition-colors duration-200 hover:bg-white/[0.07] hover:text-white sm:flex"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
              <rect
                x="2.5"
                y="3.8"
                width="15"
                height="13.2"
                rx="3"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M2.5 8h15M6.6 2.4v2.6M13.4 2.4v2.6"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="10" cy="12.4" r="1.5" fill="currentColor" />
            </svg>
          </a>

          {/* Width rather than unmounting, so the bar grows into the button
              instead of every item beside it jumping a step across. */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              deep ? "w-[38px] opacity-100" : "w-0 opacity-0"
            }`}
          >
            <button
              type="button"
              onClick={() =>
                window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })
              }
              tabIndex={deep ? 0 : -1}
              aria-label="Back to top"
              title="Back to top"
              className="flex size-[38px] shrink-0 items-center justify-center rounded-full text-white/70 transition-colors duration-200 hover:bg-white/[0.07] hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path
                  d="M8 13V3.5M3.8 7.7 8 3.4l4.2 4.3"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
