"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";
import ParallaxImage from "@/components/ui/ParallaxImage";

type ServiceCardData = {
  id: string;
  index: string;
  title: string;
  description: string;
  items: string[];
  image: { src: string; alt: string };
};

const SERVICES: ServiceCardData[] = [
  {
    id: "saas-platform-development",
    index: "Services 01",
    title: "SaaS Platform Development",
    description:
      "Multi-tenant Software-as-a-Service platforms with subscription billing, usage metering and cloud-native architecture — built for recurring revenue and self-serve growth.",
    items: [
      "Multi-tenant architecture",
      "Subscription billing",
      "Role-based access control",
      "Analytics dashboards",
    ],
    image: {
      src: "/images/service-01-uiux.webp",
      alt: "SaaS platform dashboard on a dark surface",
    },
  },
  {
    id: "ecommerce-digital-commerce",
    index: "Services 02",
    title: "eCommerce & Commerce",
    description:
      "B2B and B2C storefronts, multi-vendor marketplaces, payment gateways and inventory systems — high-performance stores that hold up on campaign day.",
    items: [
      "B2C & B2B storefronts",
      "Multi-vendor marketplaces",
      "Payment & wallet integration",
      "Inventory & order management",
    ],
    image: {
      src: "/images/service-02-webflow.webp",
      alt: "eCommerce storefront and merchandising screens",
    },
  },
  {
    id: "devops-cloud-infrastructure",
    index: "Services 03",
    title: "DevOps & Cloud",
    description:
      "CI/CD pipelines, infrastructure as code and container orchestration on AWS, Azure or Google Cloud — with monitoring, rollback plans and cost control from day one.",
    items: [
      "CI/CD pipelines",
      "Infrastructure as code",
      "Docker & Kubernetes",
      "Monitoring & alerting",
    ],
    image: {
      src: "/images/service-03-uiux.webp",
      alt: "Cloud infrastructure and deployment pipeline view",
    },
  },
  {
    id: "ai-ml-data-analytics",
    index: "Services 04",
    title: "AI/ML & Data",
    description:
      "Predictive models, document extraction, recommendation engines and LLM integration over your own data — turning what you already collect into decisions.",
    items: [
      "Predictive analytics",
      "LLM & RAG integration",
      "Computer vision",
      "Data pipelines & BI",
    ],
    image: {
      src: "/images/service-04-brand.webp",
      alt: "Analytics and machine-learning model output",
    },
  },
];

function ServiceCard({ card }: { card: ServiceCardData }) {
  return (
    <article className="service-card relative w-full bg-white lg:h-[586px]">
      <ParallaxImage
        src={card.image.src}
        alt={card.image.alt}
        sizes="(max-width: 1023px) 100vw, 652px"
        // Anchored to the right gutter instead of a hard left of 764px, which
        // only landed inside the card on a full 1440 canvas. The max-width keeps
        // it clear of the 661px-wide copy block on narrower windows; at 1440 and
        // up neither constraint binds and the position is exactly as drawn.
        className="relative h-[280px] w-full sm:h-[380px] lg:absolute lg:right-[24px] lg:top-[24px] lg:h-[538px] lg:w-[652px] lg:max-w-[calc(100%-700px)]"
      />

      <div className="flex w-full flex-col gap-[48px] px-6 py-10 sm:px-[54px] lg:absolute lg:left-[54px] lg:top-[45px] lg:w-[607px] lg:gap-[85px] lg:p-0">
        <div className="flex w-full flex-col items-start gap-[28px]">
          <div className="service-card-meta flex items-center gap-[4px]">
            <span className="relative size-[14px] shrink-0">
              <Image
                src="/icons/icon-service-arrow.png"
                alt=""
                fill
                sizes="14px"
                className="object-contain"
              />
            </span>
            <p className="font-body text-[14px] font-medium leading-[19.5px] text-pure-black">
              {card.index}
            </p>
          </div>

          <div className="flex w-full flex-col items-start gap-[24px]">
            <h3 className="service-card-title w-full font-display text-[clamp(2rem,3.4vw,48px)] font-medium leading-none tracking-[-1.5px] text-pure-black">
              <Link href={`/services/${card.id}`} className="transition-opacity hover:opacity-70">
                {card.title}
              </Link>
            </h3>
            <p className="service-card-copy w-full font-display text-[clamp(1.0625rem,1.4vw,20px)] leading-[1.3] tracking-[-0.25px] text-black">
              {card.description}
            </p>
          </div>
        </div>

        <ul className="flex w-full flex-col items-start border-b border-black/20">
          {card.items.map((item) => (
            <li
              key={item}
              className="service-card-item group w-full overflow-hidden border-t border-black/20 py-[18px] font-display text-[20px] font-medium uppercase leading-[24px] tracking-[-0.25px] text-black"
            >
              <span className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-3">
                {item}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

type ServicesProps = {
  /** Vertical rhythm differs between the home page and the services page. */
  spacingClassName?: string;
};

export default function Services({
  spacingClassName = "py-[80px] lg:pb-[160px] lg:pt-[180px]",
}: ServicesProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".services-meta", {
        y: 20,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: reveal(sectionRef.current, { start: "top 90%" }),
      });

      gsap.from(".services-meta-rule", {
        scaleX: 0,
        duration: 1,
        ease: "power2.inOut",
        transformOrigin: "left center",
        scrollTrigger: reveal(sectionRef.current, { start: "top 90%" }),
      });

      const reduced = prefersReducedMotion();

      gsap.utils.toArray<HTMLElement>(".service-card").forEach((card, i) => {
        const enter = reveal(card, { start: "top 85%" });

        gsap.from(card, {
          y: 72,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: enter,
        });

        gsap.from(card.querySelectorAll(".service-card-meta, .service-card-title, .service-card-copy"), {
          y: 24,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: reveal(card, { start: "top 80%" }),
        });

        gsap.from(card.querySelectorAll(".service-card-item"), {
          y: 24,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: reveal(card, { start: "top 72%" }),
        });

        if (reduced) return;

        // Cards recede as the next one arrives, so the stack reads as depth
        // rather than four separate blocks scrolling past.
        //
        // fromTo with explicit start values, not a bare to(). A to() reads its
        // start when it first renders, and the enter tween above has the card
        // at opacity 0 at that moment — so the recede interpolated 0 -> 0.55
        // instead of 1 -> 0.55. The card snapped from fully readable to ~13%
        // the instant its bottom crossed 70%, then brightened as it left. That
        // is the "content vanishes before you can read it" behaviour.
        //
        // immediateRender: false is what keeps this fromTo from writing
        // opacity 1 over the enter tween's start state at build time.
        gsap.fromTo(
          card,
          { scale: 1, opacity: 1 },
          {
            scale: 0.94,
            opacity: 0.55,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: card,
              start: "bottom 70%",
              end: "bottom 15%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );

        gsap.set(card, { transformOrigin: "center top", zIndex: i + 1 });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-node-id="156:7010"
      className={`w-full bg-bg ${spacingClassName}`}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col px-6 lg:px-[40px]">
        <div className="flex w-full flex-col gap-[8px]">
          <div className="services-meta flex w-full items-center justify-between text-[18px] leading-[25.714px] text-black">
            {/* Carries the section heading so the card titles below have a
                level to sit under on the services page, where no other h2
                precedes them. */}
            <h2 className="font-display font-medium">&copy;Services</h2>
            <p className="text-right font-body font-bold">{"//007 Selected"}</p>
          </div>
          <div className="services-meta-rule h-px w-full bg-black/20" />
        </div>

        <div className="mt-[48px] flex w-full flex-col gap-[24px] lg:mt-[75px] lg:gap-[50px]">
          {SERVICES.map((card) => (
            <ServiceCard key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
