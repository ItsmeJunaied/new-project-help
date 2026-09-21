"use client";

import Link from "next/link";
import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { charReveal, prefersReducedMotion, reveal } from "@/lib/anim";

type WorkCardData = {
  id: string;
  title: string;
  description: string;
  categories: string[];
  href: string;
  image: { src: string; width: number; height: number; alt: string };
  imageHeightClass: string;
};

const primaryCards: WorkCardData[] = [
  {
    id: "signature-bangla",
    title: "Signature Bangla — Grocery & Pharmacy Delivery Platform",
    description:
      "A full-stack grocery, pharmacy and daily-essentials delivery platform: location-aware catalogs, coupons, live rider tracking and an operations dashboard with bulk catalog uploads.",
    categories: ["eCommerce", "Platform"],
    href: "/case-study/signature-bangla",
    image: {
      src: "/images/work-card-sottozero.webp",
      width: 768,
      height: 560,
      alt: "Signature Bangla delivery platform storefront",
    },
    imageHeightClass: "h-[420px] lg:h-[560px]",
  },
  {
    id: "clinic-management-system",
    title: "Clinic Management System",
    description:
      "A digital front desk for a multi-doctor clinic — appointment scheduling against real doctor availability, digital patient records and a prescription history shared by reception and clinical staff.",
    categories: ["Health Tech", "SaaS"],
    href: "/case-study/clinic-management-system",
    image: {
      src: "/images/work-card-blenz-dashboard.png",
      width: 465,
      height: 379,
      alt: "Clinic management dashboard showing the appointment schedule",
    },
    imageHeightClass: "h-[280px] lg:h-[379px]",
  },
];

const featuredCard: WorkCardData = {
  id: "restaurant-pos",
  title: "Restaurant POS — order, kitchen and sales in one system",
  description:
    "A point-of-sale system for a restaurant chain: fast order entry at the counter, automatic kitchen ticket routing over websockets, and same-day reporting on sales and top-selling items.",
  categories: ["Point of Sale", "Web App"],
  href: "/case-study/restaurant-pos",
  image: {
    src: "/images/work-card-leafy-plant.webp",
    width: 1440,
    height: 693,
    alt: "Restaurant point-of-sale order screen on a counter terminal",
  },
  imageHeightClass: "h-[360px] md:h-[520px] lg:h-[693px]",
};

function WorkCard({ card, className }: { card: WorkCardData; className?: string }) {
  const imgRef = useRef<HTMLImageElement>(null);

  return (
    <div
      className={`work-card group flex w-full flex-col items-start gap-6 ${className ?? ""}`}
      onMouseEnter={() => {
        gsap.to(imgRef.current, { scale: 1.05, duration: 0.7, ease: "power3.out" });
      }}
      onMouseLeave={() => {
        gsap.to(imgRef.current, { scale: 1, duration: 0.7, ease: "power3.out" });
      }}
    >
      <Link href={card.href} className={`relative w-full overflow-hidden ${card.imageHeightClass}`}>
        <Image
          ref={imgRef}
          src={card.image.src}
          alt={card.image.alt}
          width={card.image.width}
          height={card.image.height}
          className="work-card-image size-full object-cover"
        />
      </Link>
      <div className="flex w-full flex-col items-start gap-4">
        <div className="flex w-full flex-col items-start gap-2">
          <h3 className="font-display text-[26px] font-semibold leading-[1.2] text-[#0a0a0a] sm:text-[32px] sm:leading-[46px]">
            <Link href={card.href} className="transition-opacity hover:opacity-70">
              {card.title}
            </Link>
          </h3>
          <p className="max-w-[860px] font-display text-[17px] leading-[1.3] tracking-[-0.25px] text-[#3f3f46] sm:text-[20px]">
            {card.description}
          </p>
        </div>
        <div className="flex items-center gap-6 pt-1">
          {card.categories.map((category, i) => (
            <div key={category} className="flex items-center gap-6">
              {i > 0 && <span className="size-[6px] shrink-0 rounded-[3px] bg-[#e5212b]" />}
              <span className="font-body text-[16px] tracking-[-0.16px] text-[#0a0a0a]">
                {category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function FeaturedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 78%" });

      charReveal(headingRef.current, trigger, { stagger: 0.03, duration: 1 });

      const tl = gsap.timeline({ scrollTrigger: trigger });

      tl.from(".fw-meta-row", { y: 20, opacity: 0, duration: 0.6, ease: "power2.out" }, 0.3)
        .from(".fw-rule", {
          scaleX: 0,
          duration: 0.9,
          ease: "power2.inOut",
          transformOrigin: "left center",
        }, 0.35)
        .from(".fw-intro", { y: 24, opacity: 0, duration: 0.7, ease: "power2.out" }, 0.5)
        .from(
          ".fw-intro-arrow",
          { opacity: 0, rotate: -45, scale: 0.6, duration: 0.7, ease: "back.out(2)" },
          0.6,
        );

      if (prefersReducedMotion()) return;

      // Cards rise individually so the second column is not stuck waiting on the
      // first — this is what made the lower cards look static before.
      gsap.utils.toArray<HTMLElement>(".work-card").forEach((card) => {
        gsap.from(card, {
          y: 64,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: reveal(card, { start: "top 88%" }),
        });

        const image = card.querySelector(".work-card-image");
        if (!image) return;

        gsap.fromTo(
          image,
          { scale: 1.12 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      // The arrow keeps a slow idle nudge once it has landed.
      gsap.to(".fw-intro-arrow", {
        x: 8,
        y: -8,
        duration: 1.8,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1.2,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} id="work" className="w-full bg-bg py-24 lg:py-32">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-16 px-6 lg:px-0">
        <div className="flex flex-col gap-2">
          <h2
            ref={headingRef}
            className="fw-heading font-display font-medium uppercase leading-[0.8] tracking-[-0.06em] text-black text-[clamp(2.75rem,8.6vw,165px)]"
          >
            Featured Work
          </h2>
          <div className="fw-meta-row flex flex-col gap-2">
            <div className="flex w-full items-center justify-between font-display text-[18px] leading-[1.43] text-black">
              <p className="font-medium">&copy; CASE STUDIES</p>
              <p className="font-body font-bold">{"//005 Selected"}</p>
            </div>
            <div className="fw-rule h-px w-full bg-black/20" />
          </div>
        </div>

        <div className="grid gap-x-8 gap-y-16 lg:grid-cols-2">
          <div className="flex flex-col gap-16">
            <div className="fw-intro flex flex-col items-start gap-16">
              <p className="font-display text-[18px] leading-[30px] tracking-[-0.014em] text-[#707070] sm:text-[22px]">
                Real systems in production &mdash; delivery
                <br />
                platforms, clinic records and point-of-sale,
                <br />
                built for the load they actually carry.
              </p>
              <Image
                src="/icons/arrow-diagonal.png"
                alt=""
                width={63}
                height={63}
                className="fw-intro-arrow size-[56px] sm:size-[62px]"
              />
            </div>
            <WorkCard card={primaryCards[0]} />
          </div>
          <div className="flex flex-col">
            <WorkCard card={primaryCards[1]} />
          </div>
        </div>

        <WorkCard card={featuredCard} />
      </div>
    </section>
  );
}
