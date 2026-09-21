"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { magnetic, prefersReducedMotion } from "@/lib/anim";
import { trackScheduleClick } from "@/lib/analytics";
import { siteConfig } from "@/lib/site";

const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "SERVICES", href: "/services" },
  { label: "ABOUT US", href: "/about" },
  { label: "CASE STUDY", href: "/case-study" },
  { label: "BLOG", href: "/blog" },
  { label: "CAREER", href: "/career" },
];

type HeaderProps = {
  /** Nav item to mark as the current page. */
  activeLabel?: string;
};

export default function Header({ activeLabel = "HOME" }: HeaderProps) {
  const navRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  // The browser's back button is the one navigation no click handler sees, so
  // it gets its own subscription; every in-panel link closes on click instead.
  useEffect(() => {
    const onPopState = () => setOpen(false);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // The panel covers the page, so the page behind it must not scroll, and Esc
  // has to get out of it.
  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  useGSAP(
    () => {
      gsap.fromTo(
        navRef.current,
        { y: -32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.1 },
      );

      gsap.from(".nav-link", {
        y: -14,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.06,
        delay: 0.35,
      });

      return magnetic(ctaRef.current, 0.2);
    },
    { scope: navRef },
  );

  // Opening is decorated by GSAP, but visibility itself stays with React and
  // CSS: driving it from a tween meant the panel's final opacity depended on
  // which tween resolved last, which is not something to leave to chance on the
  // only navigation a phone has.
  useGSAP(
    () => {
      if (!open || !menuRef.current || prefersReducedMotion()) return;

      gsap
        .timeline()
        .fromTo(
          menuRef.current,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.45, ease: "power3.out" },
        )
        .from(
          ".mobile-nav-item",
          { y: 24, opacity: 0, duration: 0.4, ease: "power2.out", stagger: 0.05 },
          "-=0.2",
        );
    },
    { dependencies: [open] },
  );

  return (
    <>
      <header
        ref={navRef}
        className="relative z-30 mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 px-6 pt-6 lg:px-0 lg:pt-[24px]"
      >
        {/* The design is drawn on a 1440 canvas where the logo and the CTA sit far
            apart. On a phone the two together are wider than the row, so both step
            down a size below sm; from sm up the design's dimensions are exact. */}
        <Link href="/" className="relative h-[26px] w-[150px] shrink-0 sm:h-[34px] sm:w-[194px]">
          <Image
            src="/icons/logo-projecthelp.svg"
            alt="Project Help"
            fill
            sizes="194px"
            className="object-contain object-left"
            preload
          />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-[30px] lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              aria-current={link.label === activeLabel ? "page" : undefined}
              className={
                link.label === activeLabel
                  ? "nav-link font-body text-[16px] leading-[24px] font-bold tracking-[-0.16px] text-black"
                  : "nav-link font-body text-[16px] leading-[24px] tracking-[-0.16px] text-black transition-colors hover:text-primary-orange"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-[10px]">
          {/* Below sm the logo, this pill and the menu button together are wider
              than a 375px row, which pushed the menu button off the screen. The
              panel carries its own contact links, so the pill steps out. */}
          <Link
            ref={ctaRef}
            href="/contact"
            className="hidden shrink-0 items-center gap-[5px] rounded-[100px] border border-black px-[14px] py-[10px] transition-colors hover:bg-black hover:text-white sm:flex sm:px-[18px] sm:py-[12px]"
          >
            <span className="font-body text-[16px] leading-[24px] font-medium tracking-[-0.25px] sm:text-[18px] sm:leading-[27px]">
              Get in Touch
            </span>
            <span className="relative size-[18px] sm:size-[21.81px]">
              <Image src="/icons/arrow-button.svg" alt="" fill sizes="22px" className="object-contain" />
            </span>
          </Link>

          {/* Below lg the design has no navigation at all — this is the only way
              to reach any other page from a phone. */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex size-[44px] shrink-0 flex-col items-center justify-center gap-[5px] rounded-full border border-black transition-colors hover:bg-black lg:hidden"
          >
            <span
              className={`block h-[1.5px] w-[18px] bg-black transition-all duration-300 ${
                open ? "translate-y-[3.25px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-[1.5px] w-[18px] bg-black transition-all duration-300 ${
                open ? "-translate-y-[3.25px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      <div
        id="mobile-menu"
        ref={menuRef}
        className={`fixed inset-0 z-40 flex flex-col overflow-y-auto bg-bg px-6 pb-[40px] pt-6 transition-opacity duration-200 lg:hidden ${
          open ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
        }`}
      >
        {/* The panel covers the page header, so it carries its own — otherwise
            the close control is underneath it and the only way out is Esc. */}
        <div className="mobile-nav-item flex w-full shrink-0 items-center justify-between gap-6">
          <Link href="/" onClick={close} className="relative h-[26px] w-[150px] shrink-0">
            <Image
              src="/icons/logo-projecthelp.svg"
              alt="Project Help"
              fill
              sizes="150px"
              className="object-contain object-left"
            />
          </Link>

          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="flex size-[44px] shrink-0 items-center justify-center rounded-full border border-black font-display text-[20px] leading-none text-black"
          >
            ×
          </button>
        </div>

        <nav aria-label="Mobile" className="mt-[48px] flex flex-col">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={close}
              aria-current={link.label === activeLabel ? "page" : undefined}
              className="mobile-nav-item border-b border-[#e7e7e7] py-[18px] font-display text-[28px] font-medium leading-[1.2] tracking-[-1px] text-black transition-colors hover:text-primary-orange"
            >
              {link.label === activeLabel ? (
                <span className="flex items-center gap-[12px]">
                  <span className="size-[8px] shrink-0 bg-primary-orange" aria-hidden />
                  {link.label}
                </span>
              ) : (
                link.label
              )}
            </Link>
          ))}
        </nav>

        <div className="mobile-nav-item mt-auto flex flex-col gap-[16px] pt-[48px]">
          <a
            href={siteConfig.calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackScheduleClick("mobile_menu")}
            className="flex w-full items-center justify-center rounded-[100px] bg-primary-orange px-[24px] py-[16px] font-body text-[16px] font-medium leading-[24px] tracking-[-0.25px] text-white"
          >
            Book a free 30-minute call
          </a>

          <div className="flex flex-col gap-[6px]">
            <a
              href={`mailto:${siteConfig.email}`}
              className="font-body text-[16px] leading-[24px] tracking-[-0.16px] text-ash-dark"
            >
              {siteConfig.email}
            </a>
            <a
              href={`tel:${siteConfig.phone}`}
              className="font-body text-[16px] leading-[24px] tracking-[-0.16px] text-ash-dark"
            >
              {siteConfig.phone}
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
