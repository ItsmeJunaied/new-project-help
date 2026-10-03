"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reveal } from "@/lib/anim";
import { SERVICE_IMAGE_ALT } from "@/lib/service-image-alt";

/**
 * How much of the twelve-column row a card takes, and where its artwork sits.
 *
 * `wide` runs the copy down the left with the artwork beside it; `tall` stacks
 * the copy over artwork that fills the foot of the card. Alternating the two
 * across the rows is what gives the section its rhythm — seven equal cards in a
 * plain grid read as a list, and this is meant to read as a shelf.
 */
type Shape = "wide" | "tall" | "banner";

type ServiceCardData = {
  id: string;
  index: string;
  title: string;
  copy: string;
  shape: Shape;
};

/**
 * The seven services, in the order they are sold.
 *
 * The copy here is card copy — one line, the thing a reader needs to know
 * before deciding whether to open the page. The full description, the stack and
 * what each engagement delivers all live on the service's own page; repeating
 * any of it here only makes seven cards nobody finishes reading.
 *
 * Artwork is built from assets/ by `npm run build:service-images`, which also
 * writes the alt text these cards import.
 */
const SERVICES: ServiceCardData[] = [
  {
    id: "saas-platform-development",
    index: "01",
    title: "SaaS Platform Development",
    copy: "Multi-tenant platforms with subscription billing, usage metering and the tenancy model settled before the first feature.",
    shape: "wide",
  },
  {
    id: "ecommerce-digital-commerce",
    index: "02",
    title: "eCommerce & Commerce",
    copy: "Storefronts, marketplaces and payment flows that hold up on campaign day.",
    shape: "tall",
  },
  {
    id: "devops-cloud-infrastructure",
    index: "03",
    title: "DevOps & Cloud",
    copy: "Pipelines, infrastructure as code and monitoring on AWS, Azure or Google Cloud.",
    shape: "tall",
  },
  {
    id: "ai-ml-data-analytics",
    index: "04",
    title: "AI/ML & Data Analytics",
    copy: "Models, agents and LLM integration over your own data — turning what you already collect into decisions.",
    shape: "wide",
  },
  {
    id: "technology-consulting",
    index: "05",
    title: "Technology Consulting",
    copy: "Architecture reviews, technical due diligence and a roadmap you can budget against.",
    shape: "wide",
  },
  {
    id: "mobile-app-development",
    index: "06",
    title: "Mobile App Development",
    copy: "Native and cross-platform apps, shipped to both stores.",
    shape: "tall",
  },
  {
    id: "cybersecurity-data-protection",
    index: "07",
    title: "Cybersecurity & Data Protection",
    copy: "Penetration testing, hardening and compliance work, with the findings written up in language your board can act on.",
    shape: "banner",
  },
];

const SPAN: Record<Shape, string> = {
  wide: "lg:col-span-7",
  tall: "lg:col-span-5",
  banner: "lg:col-span-12",
};

/** White, a hairline, and enough shadow to lift it off the page. */
const SHELL =
  "service-card group relative overflow-hidden rounded-[24px] border border-black/[0.07] bg-white " +
  "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_18px_44px_-28px_rgba(0,0,0,0.30)] " +
  "transition-shadow duration-500 hover:shadow-[0_1px_2px_rgba(0,0,0,0.05),0_30px_60px_-30px_rgba(0,0,0,0.38)]";

function Copy({ card, large }: { card: ServiceCardData; large?: boolean }) {
  return (
    <>
      <span className="service-card-meta font-mono text-[11px] font-semibold leading-none tracking-[0.08em] text-ash-muted">
        {card.index}
      </span>

      <h3
        className={`service-card-title w-full font-display font-semibold leading-[1.04] tracking-[-0.03em] text-pure-black ${
          large ? "text-[clamp(1.9rem,3.4vw,44px)]" : "text-[clamp(1.5rem,2.3vw,30px)]"
        }`}
      >
        <Link href={`/services/${card.id}`} className="transition-opacity hover:opacity-70">
          {card.title}
        </Link>
      </h3>

      <p
        className={`service-card-copy w-full font-body leading-[1.55] tracking-[-0.16px] text-neutral-paragraph ${
          large ? "max-w-[460px] text-[15px]" : "max-w-[420px] text-[14px]"
        }`}
      >
        {card.copy}
      </p>

      {/* A text link rather than a filled button: seven buttons down one page
          is seven things shouting, and the card itself is the target. */}
      <Link
        href={`/services/${card.id}`}
        className="service-card-cta group/cta mt-[2px] inline-flex items-center gap-[8px] font-body text-[14px] font-medium leading-none tracking-[-0.2px] text-pure-black"
      >
        <span className="border-b border-primary-green pb-[3px] transition-colors duration-300 group-hover/cta:border-pure-black">
          Know more
        </span>
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          aria-hidden="true"
          className="shrink-0 transition-transform duration-300 group-hover/cta:translate-x-[4px]"
        >
          <path
            d="M3 7.5h9M8.4 3.6 12.3 7.5 8.4 11.4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </>
  );
}

/**
 * The artwork, on a plane turned away from the reader.
 *
 * These are screenshots and product renders — flat rectangles — and a flat
 * rectangle dropped into a white card reads as a thumbnail. Turning it a few
 * degrees in perspective, giving it a real shadow and letting it run off the
 * card's edge is what makes it read as an object on a surface instead. The
 * tilt eases back towards square on hover, so the card has somewhere to go.
 *
 * `sizes` is the card's widest rendered width, not the artwork's own: the
 * plane is deliberately larger than the opening it shows through.
 */
function Art({
  card,
  plane,
  turn,
  sizes,
}: {
  card: ServiceCardData;
  /** Where the plane sits in the card, including the edge it runs past. */
  plane: string;
  /** Its resting angle, and the angle it eases to under the cursor. */
  turn: string;
  sizes: string;
}) {
  return (
    <div className={`absolute [perspective:1600px] ${plane}`}>
      <div
        className={`relative size-full overflow-hidden rounded-[14px] bg-[#f2f2f0] shadow-[0_30px_64px_-30px_rgba(0,0,0,0.55)] transition-transform duration-[900ms] ease-out ${turn}`}
      >
        <Image
          src={`/images/services/${card.id}.webp`}
          alt={SERVICE_IMAGE_ALT[card.id]}
          fill
          sizes={sizes}
          className="object-cover object-left-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />
      </div>
    </div>
  );
}

/**
 * Where each shape's plane sits inside its card.
 *
 * Every one of them runs past an edge — the right on the two side-by-side
 * shapes, the bottom on the stacked one — which is the whole point: the card is
 * a window onto something larger, not a frame around a picture.
 */
/**
 * Below `lg` every card is a single column, so every plane is the stacked one —
 * copy above, artwork running off the foot of the card. Turning a plane sideways
 * inside a 375px column throws away most of what it is showing.
 */
const STACKED_PLANE = "left-[22px] right-[22px] top-[6px] bottom-[-50px]";
const STACKED_TURN = "[transform:rotateX(9deg)]";

const PLANE = {
  wide: `${STACKED_PLANE} lg:left-[10px] lg:right-[-70px] lg:top-[28px] lg:bottom-[28px]`,
  tall: `${STACKED_PLANE} lg:left-[26px] lg:right-[26px] lg:bottom-[-56px]`,
  banner: `${STACKED_PLANE} lg:left-[10px] lg:right-[-80px] lg:top-[36px] lg:bottom-[36px]`,
} as const;

const TURN = {
  wide: `${STACKED_TURN} lg:[transform:rotateY(-13deg)_rotateX(3deg)] lg:group-hover:[transform:rotateY(-7deg)_rotateX(1deg)]`,
  tall: `${STACKED_TURN} lg:[transform:rotateX(10deg)] lg:group-hover:[transform:rotateX(5deg)]`,
  banner: `${STACKED_TURN} lg:[transform:rotateY(-11deg)_rotateX(2deg)] lg:group-hover:[transform:rotateY(-6deg)_rotateX(1deg)]`,
} as const;

function WideCard({ card }: { card: ServiceCardData }) {
  const banner = card.shape === "banner";

  return (
    <article
      className={`${SHELL} ${SPAN[card.shape]} grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]`}
    >
      <div
        className={`flex flex-col items-start justify-center gap-[14px] p-[26px] sm:p-[34px] lg:p-[44px] ${
          banner ? "lg:gap-[18px] lg:p-[56px]" : ""
        }`}
      >
        <Copy card={card} large={banner} />
      </div>

      <div
        className={`relative min-h-[260px] sm:min-h-[300px] ${banner ? "lg:min-h-[420px]" : "lg:min-h-[380px]"}`}
      >
        <Art
          card={card}
          plane={banner ? PLANE.banner : PLANE.wide}
          turn={banner ? TURN.banner : TURN.wide}
          sizes="(max-width: 1023px) 100vw, 780px"
        />
      </div>
    </article>
  );
}

function TallCard({ card }: { card: ServiceCardData }) {
  return (
    <article className={`${SHELL} ${SPAN[card.shape]} flex flex-col`}>
      <div className="flex flex-col items-start gap-[13px] p-[26px] sm:p-[34px] lg:p-[40px]">
        <Copy card={card} />
      </div>

      <div className="relative mt-auto min-h-[230px] w-full sm:min-h-[260px] lg:min-h-[250px]">
        <Art card={card} plane={PLANE.tall} turn={TURN.tall} sizes="(max-width: 1023px) 100vw, 560px" />
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

      gsap.utils.toArray<HTMLElement>(".service-card").forEach((card) => {
        gsap.from(card, {
          y: 48,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: reveal(card, { start: "top 88%" }),
        });

        gsap.from(
          card.querySelectorAll(
            ".service-card-meta, .service-card-title, .service-card-copy, .service-card-cta",
          ),
          {
            y: 18,
            opacity: 0,
            duration: 0.7,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: reveal(card, { start: "top 82%" }),
          },
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section ref={sectionRef} data-node-id="156:7010" className={`w-full bg-bg ${spacingClassName}`}>
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

        {/* One twelve-column grid rather than hand-built rows: the spans add up
            to twelve three times over and then a full-width card, so the
            browser flows the rows and every card in a row is the height of its
            tallest neighbour without anything being measured. */}
        <div className="mt-[36px] grid w-full gap-[16px] lg:mt-[64px] lg:grid-cols-12 lg:gap-[20px]">
          {SERVICES.map((card) =>
            card.shape === "tall" ? (
              <TallCard key={card.id} card={card} />
            ) : (
              <WideCard key={card.id} card={card} />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
