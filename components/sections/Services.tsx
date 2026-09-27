"use client";

import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reveal } from "@/lib/anim";
import ParallaxImage from "@/components/ui/ParallaxImage";

/**
 * Each card's own colour.
 *
 * Used on the lead badge, the index plate and the button's hover — NOT on the
 * card's ground. The reference keeps every card on one near-white grey and lets
 * the colour come from the badges and the artwork. Tinting the whole card,
 * which is what this section did before, puts a colour behind a screenshot that
 * already has its own.
 */
type Accent = {
  /** The lead badge and the index plate. */
  chip: string;
  /** Type set on `chip`, and the button's hover. */
  ink: string;
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
    index: "01",
    title: "SaaS Platform Development",
    description:
      "Multi-tenant Software-as-a-Service platforms with subscription billing, usage metering and cloud-native architecture — built for recurring revenue and self-serve growth.",
    items: [
      "Multi-tenant architecture",
      "Subscription billing",
      "Role-based access control",
      "Analytics dashboards",
    ],
    accent: { chip: "#dde6ff", ink: "#2f4fd1" },
    image: {
      src: "/images/service-01-uiux.webp",
      alt: "SaaS platform dashboard on a dark surface",
    },
  },
  {
    id: "ecommerce-digital-commerce",
    index: "02",
    title: "eCommerce & Commerce",
    description:
      "B2B and B2C storefronts, multi-vendor marketplaces, payment gateways and inventory systems — high-performance stores that hold up on campaign day.",
    items: [
      "B2C & B2B storefronts",
      "Multi-vendor marketplaces",
      "Payment & wallet integration",
      "Inventory & order management",
    ],
    accent: { chip: "#d8f2e1", ink: "#1c7a45" },
    image: {
      src: "/images/service-02-webflow.webp",
      alt: "eCommerce storefront and merchandising screens",
    },
  },
  {
    id: "devops-cloud-infrastructure",
    index: "03",
    title: "DevOps & Cloud",
    description:
      "CI/CD pipelines, infrastructure as code and container orchestration on AWS, Azure or Google Cloud — with monitoring, rollback plans and cost control from day one.",
    items: [
      "CI/CD pipelines",
      "Infrastructure as code",
      "Docker & Kubernetes",
      "Monitoring & alerting",
    ],
    accent: { chip: "#eae0fd", ink: "#6a3fc4" },
    image: {
      src: "/images/service-03-uiux.webp",
      alt: "Cloud infrastructure and deployment pipeline view",
    },
  },
  {
    id: "ai-ml-data-analytics",
    index: "04",
    title: "AI/ML & Data",
    description:
      "Predictive models, document extraction, recommendation engines and LLM integration over your own data — turning what you already collect into decisions.",
    items: [
      "Predictive analytics",
      "LLM & RAG integration",
      "Computer vision",
      "Data pipelines & BI",
    ],
    accent: { chip: "#fce7ce", ink: "#b0590a" },
    image: {
      src: "/images/service-04-brand.webp",
      alt: "Analytics and machine-learning model output",
    },
  },
];

/**
 * How many cards run full width before the rest fall into two columns.
 *
 * Straight from the reference: the first products get a whole row each, with
 * their artwork beside the copy, and everything after them is a two-up grid
 * with the artwork underneath. It gives the top of the section weight without
 * every card shouting at the same volume.
 */
const WIDE_COUNT = 2;

/** The badges. The first carries the card's colour; the rest stay quiet. */
function Badges({ card, compact }: { card: ServiceCardData; compact?: boolean }) {
  const size = compact ? "px-[9px] py-[5px] text-[11px]" : "px-[11px] py-[6px] text-[12px]";

  return (
    <ul className={`flex w-full flex-wrap ${compact ? "gap-[5px]" : "gap-[6px]"}`}>
      {card.items.map((item, index) => (
        <li
          key={item}
          style={
            index === 0 ? { backgroundColor: card.accent.chip, color: card.accent.ink } : undefined
          }
          className={
            index === 0
              ? `service-card-item rounded-full font-body font-medium leading-[1.3] tracking-[-0.1px] ${size}`
              : `service-card-item rounded-full border border-black/[0.11] bg-white font-body leading-[1.3] tracking-[-0.1px] text-ash-dark ${size}`
          }
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function Cta({ card, compact }: { card: ServiceCardData; compact?: boolean }) {
  return (
    <Link
      href={`/services/${card.id}`}
      style={{ "--cta": card.accent.ink } as CSSProperties}
      className={`group inline-flex w-fit items-center gap-[8px] rounded-[100px] bg-black transition-colors duration-300 hover:bg-[var(--cta)] ${
        compact ? "px-[18px] py-[10px]" : "px-[22px] py-[12px]"
      }`}
    >
      <span
        className={`font-body font-medium leading-[20px] tracking-[-0.2px] text-white ${
          compact ? "text-[13.5px]" : "text-[15px]"
        }`}
      >
        Explore this service
      </span>
      <svg
        width={compact ? "13" : "14"}
        height={compact ? "13" : "14"}
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
  );
}

function IndexPlate({ card }: { card: ServiceCardData }) {
  return (
    <span className="service-card-meta flex items-center gap-[8px]">
      <span
        style={{ backgroundColor: card.accent.chip, color: card.accent.ink }}
        className="flex size-[28px] items-center justify-center rounded-[9px] font-mono text-[11px] font-semibold leading-none"
      >
        {card.index}
      </span>
    </span>
  );
}

/** A whole row to itself: copy on the left, artwork filling the right. */
function WideCard({ card }: { card: ServiceCardData }) {
  return (
    <article className="service-card relative grid w-full overflow-hidden rounded-[22px] bg-[#f4f4f1] lg:grid-cols-[minmax(0,44%)_minmax(0,56%)]">
      <div className="flex flex-col items-start gap-[18px] p-[28px] sm:p-[38px] lg:justify-center lg:gap-[20px] lg:p-[48px]">
        <IndexPlate card={card} />

        <h3 className="service-card-title w-full font-display text-[clamp(1.6rem,2.6vw,36px)] font-semibold leading-[1.06] tracking-[-1px] text-pure-black">
          <Link href={`/services/${card.id}`} className="transition-opacity hover:opacity-70">
            {card.title}
          </Link>
        </h3>

        <p className="service-card-copy w-full max-w-[520px] font-body text-[14.5px] leading-[24px] tracking-[-0.16px] text-neutral-paragraph">
          {card.description}
        </p>

        <Badges card={card} />
        <Cta card={card} />
      </div>

      {/* Runs out to the card's own edges, the way the reference lets each
          product's artwork fill its panel rather than sit inside a margin. */}
      <div className="relative min-h-[260px] w-full sm:min-h-[320px] lg:min-h-[400px]">
        <ParallaxImage
          src={card.image.src}
          alt={card.image.alt}
          sizes="(max-width: 1023px) 100vw, 760px"
          className="absolute inset-0 size-full"
        />
      </div>
    </article>
  );
}

/** Two up: copy on top, artwork inset underneath. */
function GridCard({ card }: { card: ServiceCardData }) {
  return (
    <article className="service-card relative flex w-full flex-col overflow-hidden rounded-[22px] bg-[#f4f4f1]">
      <div className="flex flex-col items-start gap-[15px] p-[28px] sm:p-[34px]">
        <IndexPlate card={card} />

        <h3 className="service-card-title w-full font-display text-[clamp(1.45rem,2.1vw,28px)] font-semibold leading-[1.08] tracking-[-0.8px] text-pure-black">
          <Link href={`/services/${card.id}`} className="transition-opacity hover:opacity-70">
            {card.title}
          </Link>
        </h3>

        <p className="service-card-copy w-full font-body text-[13.5px] leading-[22px] tracking-[-0.16px] text-neutral-paragraph">
          {card.description}
        </p>

        <Badges card={card} compact />
        <Cta card={card} compact />
      </div>

      <div className="mt-auto w-full px-[28px] pb-[28px] sm:px-[34px] sm:pb-[34px]">
        <ParallaxImage
          src={card.image.src}
          alt={card.image.alt}
          sizes="(max-width: 1023px) 100vw, 620px"
          className="relative h-[220px] w-full rounded-[14px] sm:h-[250px]"
        />
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

      // Each card rises as it arrives and its own contents follow it in. The
      // scrubbed recede that used to be here is gone with the stack it served:
      // it dimmed a card as the next one climbed over it, and nothing climbs
      // over anything any more.
      gsap.utils.toArray<HTMLElement>(".service-card").forEach((card) => {
        gsap.from(card, {
          y: 48,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: reveal(card, { start: "top 88%" }),
        });

        gsap.from(
          card.querySelectorAll(".service-card-meta, .service-card-title, .service-card-copy"),
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.1,
            scrollTrigger: reveal(card, { start: "top 82%" }),
          },
        );

        gsap.from(card.querySelectorAll(".service-card-item"), {
          y: 16,
          opacity: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.06,
          scrollTrigger: reveal(card, { start: "top 76%" }),
        });
      });
    },
    { scope: sectionRef },
  );

  const wide = SERVICES.slice(0, WIDE_COUNT);
  const grid = SERVICES.slice(WIDE_COUNT);

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

        {/* Two full-width cards, then the rest two up. Nothing is sticky any
            more: this was a stack of four cards that halted one over another,
            and it is now a grid that simply scrolls. The `REST` offsets and the
            `.service-slot` wrappers that made the stack work are gone with it —
            git has them at commit ec1ea9d. */}
        <div className="mt-[36px] flex w-full flex-col gap-[20px] lg:mt-[64px] lg:gap-[24px]">
          {wide.map((card) => (
            <WideCard key={card.id} card={card} />
          ))}

          {grid.length ? (
            <div className="grid w-full gap-[20px] lg:grid-cols-2 lg:gap-[24px]">
              {grid.map((card) => (
                <GridCard key={card.id} card={card} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
