"use client";

import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";
import ParallaxImage from "@/components/ui/ParallaxImage";

/**
 * Each card's own colour. Four services that look identical are four things a
 * reader has to tell apart by reading; four tints are four things they can tell
 * apart at a glance, and the stack below gains an edge to separate its cards on
 * as well.
 *
 * Held to one family per service — a pale ground, a slightly stronger chip, and
 * an ink dark enough to read on both. The brand green is not among them on
 * purpose: it is the CTA's colour on this page, and a card tinted with it would
 * compete with its own button.
 */
type Accent = {
  /** The card's ground. */
  tint: string;
  /** Chips and the index plate. */
  chip: string;
  /** Type and rules drawn on the two above. */
  ink: string;
  edge: string;
};

type ServiceCardData = {
  id: string;
  index: string;
  title: string;
  description: string;
  items: string[];
  accent: Accent;
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
    accent: {
      tint: "#f1f5ff",
      chip: "#dde6ff",
      ink: "#2f4fd1",
      edge: "rgba(47,79,209,0.18)",
    },
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
    accent: {
      tint: "#f0faf3",
      chip: "#d8f2e1",
      ink: "#1c7a45",
      edge: "rgba(28,122,69,0.18)",
    },
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
    accent: {
      tint: "#f7f2fe",
      chip: "#eae0fd",
      ink: "#6a3fc4",
      edge: "rgba(106,63,196,0.18)",
    },
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
    accent: {
      tint: "#fff7ec",
      chip: "#fce7ce",
      ink: "#b0590a",
      edge: "rgba(176,89,10,0.2)",
    },
    image: {
      src: "/images/service-04-brand.webp",
      alt: "Analytics and machine-learning model output",
    },
  },
];

/**
 * Where each card comes to rest, and how much of the one beneath it stays
 * showing. Written out per card rather than calculated, because these are
 * Tailwind classes and a computed `top` would have to give up the breakpoint.
 *
 * The step is what turns four stuck cards into a legible stack: each one halts
 * a little lower than the last, so the titles above it stay in view as a set of
 * tabs rather than being covered completely.
 */
const REST = [
  "top-[16px] lg:top-[40px]",
  "top-[27px] lg:top-[62px]",
  "top-[38px] lg:top-[84px]",
  "top-[49px] lg:top-[106px]",
];

/*
 * THE PREVIOUS CARD, kept commented at your request.
 *
 * It was the same anatomy in a single neutral palette: a white ground, a
 * hairline border, a green dot on the index and outlined chips. What replaced
 * it below is that card with a colour per service, which is the only real
 * difference — the layout, the stacking and the GSAP hooks are unchanged.
 *
 * Git has it too, at commit 2425525, so this block can be deleted whenever
 * you are happy with the new one.
 *
 * function ServiceCard({ card }: { card: ServiceCardData }) {
 *   return (
 *     <article
 *       className={
 *         // Rounded, bordered and opaque, all three because of the stacking: a
 *         // flat white card with square corners cannot be told from the one it is
 *         // sliding over, and a transparent one would show it straight through.
 *         "service-card relative flex w-full flex-col overflow-hidden rounded-[24px] border border-black/[0.09] bg-white " +
 *         "shadow-[0_2px_2px_-1px_rgba(21,21,21,0.06),0_34px_64px_-44px_rgba(21,21,21,0.5)] " +
 *         "will-change-transform lg:h-[560px] lg:flex-row"
 *       }
 *     >
 *       <div className="flex w-full flex-col gap-[32px] p-6 sm:p-[40px] lg:w-[calc(100%-608px)] lg:justify-between lg:gap-[40px] lg:p-[48px]">
 *         <div className="flex w-full flex-col items-start gap-[22px]">
 *           <span className="service-card-meta inline-flex items-center gap-[8px] rounded-full border border-black/10 bg-bg px-[13px] py-[6px]">
 *             <span aria-hidden className="size-[5px] rounded-full bg-primary-green" />
 *             <span className="font-mono text-[11px] uppercase leading-none tracking-[0.7px] text-ash-dark">
 *               {card.index}
 *             </span>
 *           </span>
 *
 *           <h3 className="service-card-title w-full font-display text-[clamp(1.75rem,3vw,42px)] font-medium leading-[1.04] tracking-[-1.2px] text-pure-black">
 *             <Link href={`/services/${card.id}`} className="transition-opacity hover:opacity-70">
 *               {card.title}
 *             </Link>
 *           </h3>
 *
 *           <p className="service-card-copy w-full font-body text-[15px] leading-[25px] tracking-[-0.16px] text-neutral-paragraph lg:text-[16px] lg:leading-[26px]">
 *             {card.description}
 *           </p>
 *         </div>
 *
 *         <div className="flex w-full flex-col gap-[26px]">
 *           <ul className="flex w-full flex-wrap gap-[7px]">
 *             {card.items.map((item) => (
 *               <li
 *                 key={item}
 *                 className="service-card-item rounded-full border border-black/10 bg-bg px-[12px] py-[7px] font-body text-[12.5px] leading-[1.3] tracking-[-0.1px] text-ash-deep"
 *               >
 *                 {item}
 *               </li>
 *             ))}
 *           </ul>
 *
 *           <Link
 *             href={`/services/${card.id}`}
 *             className="group inline-flex w-fit items-center gap-[9px] rounded-[100px] bg-black px-[22px] py-[12px] transition-colors duration-300 hover:bg-primary-green"
 *           >
 *             <span className="font-body text-[15px] font-medium leading-[22px] tracking-[-0.2px] text-white transition-colors duration-300 group-hover:text-black">
 *               Explore this service
 *             </span>
 *             <svg
 *               width="14"
 *               height="14"
 *               viewBox="0 0 15 15"
 *               fill="none"
 *               aria-hidden="true"
 *               className="shrink-0 text-white transition-[transform,color] duration-300 group-hover:translate-x-[3px] group-hover:text-black"
 *             >
 *               <path
 *                 d="M3 12 12 3M4.6 3H12v7.4"
 *                 stroke="currentColor"
 *                 strokeWidth="1.6"
 *                 strokeLinecap="round"
 *                 strokeLinejoin="round"
 *               />
 *             </svg>
 *           </Link>
 *         </div>
 *       </div>
 *
 *       <div className="w-full shrink-0 px-6 pb-6 sm:px-[40px] sm:pb-[40px] lg:w-[608px] lg:p-[20px] lg:pl-0">
 *         <ParallaxImage
 *           src={card.image.src}
 *           alt={card.image.alt}
 *           sizes="(max-width: 1023px) 100vw, 588px"
 *           className="relative h-[240px] w-full rounded-[14px] sm:h-[320px] lg:h-full"
 *         />
 *       </div>
 *     </article>
 *   );
 * }
 */
function ServiceCard({ card }: { card: ServiceCardData }) {
  const { accent } = card;
  const number = card.index.replace(/\D/g, "") || card.index;

  return (
    <article
      // The ground, the border and the button's hover colour all come off the
      // service's own accent. Set as inline values rather than classes because
      // they are data: a fifth service brings its own colour with it.
      style={
        {
          backgroundColor: accent.tint,
          borderColor: accent.edge,
          "--cta": accent.ink,
        } as CSSProperties
      }
      className={
        // Rounded, bordered and opaque, all three because of the stacking: a
        // flat card with square corners cannot be told from the one it is
        // sliding over, and a transparent one would show it straight through.
        "service-card relative flex w-full flex-col overflow-hidden rounded-[24px] border " +
        "shadow-[0_2px_2px_-1px_rgba(21,21,21,0.06),0_34px_64px_-44px_rgba(21,21,21,0.5)] " +
        "will-change-transform lg:h-[560px] lg:flex-row"
      }
    >
      <div className="flex w-full flex-col gap-[30px] p-6 sm:p-[40px] lg:w-[calc(100%-608px)] lg:justify-between lg:gap-[36px] lg:p-[48px]">
        <div className="flex w-full flex-col items-start gap-[20px]">
          <span className="service-card-meta inline-flex items-center gap-[10px]">
            <span
              style={{ backgroundColor: accent.chip, color: accent.ink }}
              className="flex size-[32px] items-center justify-center rounded-[10px] font-mono text-[12px] font-semibold leading-none"
            >
              {number}
            </span>
            <span
              style={{ color: accent.ink }}
              className="font-mono text-[11px] uppercase leading-none tracking-[0.7px]"
            >
              {card.index}
            </span>
          </span>

          <h3 className="service-card-title w-full font-display text-[clamp(1.75rem,3vw,42px)] font-medium leading-[1.04] tracking-[-1.2px] text-pure-black">
            <Link href={`/services/${card.id}`} className="transition-opacity hover:opacity-70">
              {card.title}
            </Link>
          </h3>

          <p className="service-card-copy w-full font-body text-[15px] leading-[25px] tracking-[-0.16px] text-ash-dark lg:text-[16px] lg:leading-[26px]">
            {card.description}
          </p>
        </div>

        <div className="flex w-full flex-col gap-[24px]">
          <ul className="flex w-full flex-wrap gap-[7px]">
            {card.items.map((item) => (
              <li
                key={item}
                style={{ backgroundColor: accent.chip, color: accent.ink }}
                className="service-card-item rounded-full px-[12px] py-[7px] font-body text-[12.5px] font-medium leading-[1.3] tracking-[-0.1px]"
              >
                {item}
              </li>
            ))}
          </ul>

          <Link
            href={`/services/${card.id}`}
            className="group inline-flex w-fit items-center gap-[9px] rounded-[100px] bg-black px-[22px] py-[12px] transition-colors duration-300 hover:bg-[var(--cta)]"
          >
            <span className="font-body text-[15px] font-medium leading-[22px] tracking-[-0.2px] text-white">
              Explore this service
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 15 15"
              fill="none"
              aria-hidden="true"
              className="shrink-0 text-white transition-transform duration-300 group-hover:translate-x-[3px]"
            >
              <path
                d="M3 12 12 3M4.6 3H12v7.4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>

      <div className="w-full shrink-0 px-6 pb-6 sm:px-[40px] sm:pb-[40px] lg:w-[608px] lg:p-[20px] lg:pl-0">
        {/* Ringed in the card's own colour so the screenshot reads as part of
            the card rather than as a picture dropped onto it. */}
        <div
          style={{ boxShadow: `0 0 0 1px ${accent.edge}` }}
          className="h-full w-full overflow-hidden rounded-[14px]"
        >
          <ParallaxImage
            src={card.image.src}
            alt={card.image.alt}
            sizes="(max-width: 1023px) 100vw, 588px"
            className="relative h-[240px] w-full sm:h-[320px] lg:h-full"
          />
        </div>
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
      const slots = gsap.utils.toArray<HTMLElement>(".service-slot");

      slots.forEach((slot, i) => {
        const card = slot.querySelector<HTMLElement>(".service-card");
        if (!card) return;

        gsap.from(card, {
          y: 64,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: reveal(card, { start: "top 88%" }),
        });

        gsap.from(
          card.querySelectorAll(".service-card-meta, .service-card-title, .service-card-copy"),
          {
            y: 22,
            opacity: 0,
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.1,
            scrollTrigger: reveal(card, { start: "top 82%" }),
          },
        );

        gsap.from(card.querySelectorAll(".service-card-item"), {
          y: 18,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.06,
          scrollTrigger: reveal(card, { start: "top 74%" }),
        });

        if (reduced) return;

        const next = slots[i + 1];
        if (!next) return;

        // Each card settles back as the next one climbs over it, so the stack
        // reads as depth rather than as four cards happening to overlap. Driven
        // by the NEXT card's approach, because that is the thing whose arrival
        // this is a reaction to.
        //
        // fromTo with explicit start values and immediateRender: false, not a
        // bare to(). A to() reads its start value when it first renders, and the
        // enter tween above has the card at opacity 0 at that moment — so this
        // would interpolate 0 -> 0.9 and the card would snap from unreadable to
        // dim the instant the next one appeared.
        gsap.fromTo(
          card,
          { scale: 1, opacity: 1 },
          {
            scale: 0.955,
            opacity: 0.88,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: next,
              start: "top bottom",
              end: "top top+=140",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );

        // Scaled from the top edge, so the strip of this card still showing
        // above the next one does not drift while it shrinks.
        gsap.set(card, { transformOrigin: "center top" });
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

        {/* The stack. Each card is wrapped in its own sticky slot: the slots stay
            in normal flow and supply the scroll distance, and the card inside
            comes to rest a little lower than the one before it. Nothing here may
            be given `overflow: hidden` — a scroll container anywhere above a
            sticky element is what silently turns it back into a static one. */}
        <div className="mt-[40px] flex w-full flex-col gap-[28px] lg:mt-[72px] lg:gap-[40px]">
          {SERVICES.map((card, index) => (
            <div
              key={card.id}
              style={{ zIndex: index + 1 }}
              className={`service-slot sticky ${REST[index] ?? REST[REST.length - 1]}`}
            >
              <ServiceCard card={card} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
