"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { FooterTickerStar } from "@/components/ui/BrandIcons";
import AutoVideo from "@/components/ui/AutoVideo";
import VideoLightbox from "@/components/ui/VideoLightbox";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";
import { SERVICES } from "@/lib/services";
import { siteConfig } from "@/lib/site";

const MENUS = [
  {
    title: "Quick Links",
    items: [
      { label: "Home", href: "/" },
      { label: "Services", href: "/services" },
      { label: "About Us", href: "/about" },
      { label: "Case Studies", href: "/case-study" },
      { label: "Career", href: "/career" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Key Services",
    // Straight from the service records, so a new service appears in the footer
    // without anyone remembering to add it here.
    items: SERVICES.map((service) => ({
      label: service.title,
      href: `/services/${service.slug}`,
    })),
  },
  {
    title: "Industries",
    items: [
      { label: "E-Commerce & Retail", href: "/services" },
      { label: "SaaS & B2B Platforms", href: "/services" },
      { label: "Health Tech", href: "/services" },
      { label: "Fintech & Payments", href: "/services" },
      { label: "Logistics & Supply Chain", href: "/services" },
    ],
  },
];

// Only the accounts that exist. The design drew six icons, but linking the
// other four to "#" put four dead links in the footer of every page.
const SOCIALS = [
  { src: "/icons/social-facebook.svg", label: "Facebook", href: siteConfig.social.facebook },
  { src: "/icons/social-linkedin.svg", label: "LinkedIn", href: siteConfig.social.linkedin },
];

/**
 * Third-party proof marks, shown alongside the logo.
 *
 * The artwork is drawn in #F4F1EB with Clutch's red on its stars, which is
 * already the right palette for the near-black footer — nothing is recoloured
 * here. Clutch is a wordmark plus its own star row rather than one file, so it
 * is assembled below; the other two ship as complete laurel badges.
 */
type Accolade = {
  id: string;
  name: string;
  lines: string[];
} & (
  | { src: string; width: number; height: number }
  /** Clutch has no single file, so `src` is null and the mark is built inline. */
  | { src: null }
);

const ACCOLADES: Accolade[] = [
  {
    id: "clutch",
    name: "Clutch",
    lines: ["5.0 / on Clutch"],
    src: null,
  },
  {
    id: "behance",
    name: "Behance",
    src: "/icons/badge-behance.svg",
    width: 97,
    height: 40,
    lines: ["Featured 20+ times", "on Behance"],
  },
  {
    id: "dribbble",
    name: "Dribbble",
    src: "/icons/badge-dribbble.svg",
    width: 89,
    height: 36,
    lines: ["Top Product Design", "Agency 2025"],
  },
];

const TRUST_ITEMS = [
  { id: "since", figure: "2021", lines: ["Building software", "since"] },
  { id: "projects", figure: "28+", lines: ["projects delivered"] },
  { id: "satisfaction", figure: "95%", lines: ["client satisfaction", "score"] },
  { id: "support", figure: "6–12", lines: ["months free", "post-launch support"] },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const [showreelOpen, setShowreelOpen] = useState(false);

  useGSAP(
    () => {
      const trigger = reveal(footerRef.current, { start: "top 88%" });

      gsap.from(".footer-reveal", {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.06,
        scrollTrigger: trigger,
      });

      gsap.from(".footer-rule", {
        scaleX: 0,
        duration: 1.1,
        ease: "power2.inOut",
        transformOrigin: "left center",
        stagger: 0.12,
        scrollTrigger: trigger,
      });

      const track = tickerRef.current;
      if (!track) return;

      const loop = gsap.to(track, {
        xPercent: -50,
        duration: 26,
        ease: "none",
        repeat: -1,
      });

      if (prefersReducedMotion()) {
        loop.pause();
        return;
      }

      // The wordmark rises into place as the footer arrives, then keeps rolling.
      gsap.from(track, {
        yPercent: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: reveal(track, { start: "top 96%" }),
      });
    },
    { scope: footerRef },
  );

  return (
    <footer
      ref={footerRef}
      data-node-id="156:7719"
      className="flex w-full flex-col items-center gap-[60px] bg-[#0a0a0a] pb-[80px] pt-[100px]"
    >
      <div className="flex w-full max-w-[1372px] flex-col items-start gap-[40px] px-6 lg:px-[40px]">
        {/* White ink on the near-black footer; the green comes from the token
            either way. The hover fade sits on the logo, not on the link: the
            link is a .footer-reveal, so GSAP owns its opacity, and a CSS
            transition on the same property fights those per-frame writes. */}
        <div className="flex w-full flex-col items-start gap-[40px] lg:flex-row lg:items-center lg:justify-between lg:gap-[56px]">
          <Link
            href="/"
            aria-label="Project Help — home"
            className="footer-reveal group shrink-0 text-white"
          >
            <Logo className="h-[64px] w-auto transition-opacity duration-200 group-hover:opacity-70 lg:h-[80px]" />
          </Link>

          {/* Spread across whatever the logo leaves, so the marks land on the
              same rhythm as the figures in the row below. */}
          <ul className="flex w-full flex-wrap items-start justify-between gap-x-[40px] gap-y-[32px] lg:w-auto lg:flex-1 lg:max-w-[780px]">
            {ACCOLADES.map((item) => (
              <li
                key={item.id}
                className="footer-reveal flex flex-col items-center gap-[14px] text-center"
              >
                {/* Every mark gets the same 40px box, bottom-aligned. The two
                    laurels are that tall on their own but the Clutch stack is
                    only 32, so without this its caption sat 8px above the other
                    two and the row read as crooked. */}
                <span className="flex h-[40px] items-end justify-center">
                  {item.src ? (
                    <Image
                      src={item.src}
                      alt={item.name}
                      width={item.width}
                      height={item.height}
                      className="h-[40px] w-auto object-contain"
                    />
                  ) : (
                    <span className="flex flex-col items-center gap-[6px]">
                      <Image
                        src="/icons/badge-clutch-wordmark.svg"
                        alt={item.name}
                        width={62}
                        height={17}
                        className="h-[17px] w-auto object-contain"
                      />
                      <span className="flex items-center gap-[2px]" aria-hidden>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Image
                            key={i}
                            src="/icons/badge-clutch-star.svg"
                            alt=""
                            width={9}
                            height={8}
                            className="size-[9px] object-contain"
                          />
                        ))}
                      </span>
                    </span>
                  )}
                </span>
                <p className="font-alt text-[14px] leading-[21px] tracking-[-0.14px] text-[#a8a29e]">
                  {item.lines.map((line) => (
                    <span key={line} className="block whitespace-nowrap">
                      {line}
                    </span>
                  ))}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex w-full flex-col items-start gap-[32px]">
          <div className="footer-rule h-px w-full bg-[#3f3f46]" />

          <div className="flex w-full flex-wrap items-start justify-between gap-8">
            {TRUST_ITEMS.map((item) => (
              <div
                key={item.id}
                className="footer-reveal flex max-w-[142px] flex-col items-start"
              >
                <div className="flex max-h-[60px] w-[142px] flex-col items-center justify-center overflow-clip pb-[16px] pt-[4px]">
                  <div className="flex h-[40px] max-h-[40px] w-full items-center justify-center overflow-clip">
                    <span className="whitespace-nowrap font-display text-[32px] font-medium leading-none tracking-[-1px] text-white">
                      {item.figure}
                    </span>
                  </div>
                </div>
                <div className="flex w-full flex-col items-center">
                  <p className="text-center font-alt text-[14px] leading-[21px] tracking-[-0.14px] text-[#a8a29e]">
                    {item.lines.map((line) => (
                      <span key={line} className="block whitespace-nowrap">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="footer-rule h-px w-full bg-[#3f3f46]" />
        </div>

        <div className="flex w-full flex-wrap items-start justify-between gap-10">
          {MENUS.map((menu) => (
            <div
              key={menu.title}
              className="footer-reveal flex flex-col items-start gap-[27px]"
            >
              <p className="w-full font-body text-[18px] font-medium leading-[27px] tracking-[-0.25px] text-[#f7f7f7]">
                {menu.title}
              </p>
              <ul className="flex w-full flex-col items-start gap-[12px]">
                {menu.items.map((item) => (
                  <li key={`${menu.title}-${item.label}`}>
                    <Link
                      href={item.href}
                      className="font-body text-[16px] leading-[24px] tracking-[-0.16px] text-[#a8a29e] transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="footer-reveal flex flex-col items-start gap-[32px]">
            <div className="flex w-full flex-col items-start gap-[30.6px] pb-[3.4px]">
              <p className="w-full font-body text-[18px] font-medium leading-[27px] tracking-[-0.25px] text-white">
                Drop us a line
              </p>
              <a
                href="mailto:hello@projecthelpbd.com"
                className="font-body text-[16px] leading-[24px] tracking-[-0.16px] text-[#f7f7f7] transition-colors hover:text-primary-green"
              >
                hello@projecthelpbd.com
              </a>
            </div>

            <div className="flex w-full flex-col items-start gap-[24px]">
              <p className="w-full font-body text-[18px] font-medium leading-[27px] tracking-[-0.25px] text-[#a8a29e]">
                Call Us
              </p>
              <a
                href="tel:+8801975005362"
                className="flex w-full items-center gap-[10px]"
              >
                <span className="relative size-[28px] shrink-0 overflow-clip">
                  <Image
                    src="/icons/icon-footer-whatsapp.svg"
                    alt=""
                    fill
                    className="object-contain"
                  />
                </span>
                <span className="font-body text-[16px] leading-[24px] tracking-[-0.16px] text-[#f7f7f7]">
                  +8801975005362
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-rule h-px w-full bg-[#3f3f46]" />

        <div className="flex w-full flex-col items-start justify-center gap-[20px] lg:flex-row">
          <div className="footer-reveal flex flex-1 items-start rounded-[12px] bg-[#0a0a0a] pb-[45px] pr-[24px] pt-[24px]">
            <div className="flex w-full max-w-[196px] flex-col items-start gap-[2.4px]">
              <p className="w-full pb-[16.2px] font-body text-[18px] font-medium leading-[27px] tracking-[-0.25px] text-[#f7f7f7]">
                Bangladesh
              </p>
              <p className="font-display text-[18px] font-medium leading-[1.2] tracking-[-0.18px] text-[#f7f7f7]">
                Our Locations
              </p>
              <p className="w-full font-body text-[14px] font-medium leading-[19.5px] text-[#c8c8c8]">
                3rd Floor, House 76/A, Road 11, Banani, Dhaka 1213.
              </p>
            </div>
          </div>

          {/* 16:9 rather than the old 172px band. The showreel is a 16:9 film
              and that band is 2.8:1, so filling it would have sliced the top
              and bottom line off every title card in the piece. */}
          <div className="footer-reveal w-full lg:w-[477px]">
            {/* The play button used to sit on a plain <button> with no handler:
                a control that looks interactive and does nothing. It runs the
                film now — muted and looping in place, and with sound once
                somebody asks for it. */}
            <button
              type="button"
              onClick={() => setShowreelOpen(true)}
              aria-label="Play the Project Help showreel with sound"
              className="group relative block aspect-video w-full overflow-clip outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-green"
            >
              <AutoVideo
                src="/videos/showreel-40s-loop.mp4"
                poster="/images/showreel-40s-poster.webp"
                decorative
                className="absolute inset-0 size-full object-cover"
              />
              <span className="absolute left-1/2 top-1/2 h-[46.002px] w-[66.694px] -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 group-hover:scale-110">
                <Image
                  src="/images/footer-play-button.png"
                  alt=""
                  fill
                  sizes="67px"
                  className="object-contain"
                />
              </span>
            </button>
          </div>
        </div>

        <div className="footer-rule h-px w-full bg-[#3f3f46]" />

        <div className="flex w-full flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="footer-reveal flex flex-col items-center gap-[10px] sm:flex-row sm:gap-[20px]">
            <p className="font-mono text-[16px] font-medium uppercase leading-[16px] text-[#f7f7f7]">
              &copy; {new Date().getFullYear()} Project Help | All Rights Reserved.
            </p>
            <span className="hidden h-[14px] w-px bg-[#3f3f46] sm:block" aria-hidden />
            <div className="flex items-center gap-[16px]">
              <Link
                href="/privacy-policy"
                className="font-body text-[14px] leading-[20px] tracking-[-0.16px] text-[#a8a29e] transition-colors hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="font-body text-[14px] leading-[20px] tracking-[-0.16px] text-[#a8a29e] transition-colors hover:text-white"
              >
                Terms of Service
              </Link>
              <Link
                href="/unsubscribe"
                className="font-body text-[14px] leading-[20px] tracking-[-0.16px] text-[#a8a29e] transition-colors hover:text-white"
              >
                Unsubscribe
              </Link>
            </div>
          </div>

          <div className="footer-reveal flex items-center justify-end gap-[10px]">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="flex size-[48px] items-center justify-center transition-opacity hover:opacity-70"
              >
                <span className="relative size-[24px] overflow-clip">
                  <Image src={social.src} alt="" fill className="object-contain" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full items-end overflow-hidden">
        <div ref={tickerRef} className="flex w-max items-end gap-[63px]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex shrink-0 items-end gap-[63px]" aria-hidden={i > 0}>
              <span className="flex h-[160.824px] w-[160.822px] shrink-0 items-center justify-center">
                <span className="block size-[135px] rotate-[102.39deg]">
                  <FooterTickerStar className="size-[135px] text-primary-green" />
                </span>
              </span>
              <span className="whitespace-nowrap font-display text-[clamp(4rem,9.4vw,180px)] font-semibold uppercase leading-[1.1] tracking-[-8px] text-white">
                project help
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* The strip above plays a light, silent preview cut. This is the full
          film with its sound, and it is only fetched once somebody presses
          play — so the 7 MB never lands on a visitor who just scrolled past. */}
      {showreelOpen ? (
        <VideoLightbox
          src="/videos/showreel-40s.mp4"
          poster="/images/showreel-40s-poster.webp"
          title="Project Help showreel"
          onClose={() => setShowreelOpen(false)}
        />
      ) : null}
    </footer>
  );
}
