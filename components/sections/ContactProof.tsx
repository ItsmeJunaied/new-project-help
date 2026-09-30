"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { reveal } from "@/lib/anim";
import { CLIENTS } from "@/lib/clients";
import { APPROVED_TESTIMONIALS } from "@/lib/testimonials";

/**
 * The concept's reviews block, to its own measurements: a header row with the
 * heading left and a strip of proof right, then one tall black card at 520px
 * with a green disc bleeding off its top corner and a 160px serif quote mark,
 * and two white cards stacked beside it.
 *
 * The three cards carry client reviews as soon as there are three approved
 * ones in lib/testimonials.ts, and the work until then.
 *
 * That gate is deliberate and it is the one thing in this section that is not
 * a design decision. Signature Bangla, Textalyz AI and Rongobuy are real
 * companies and the people quoted are real people; a paragraph drafted on
 * someone's behalf is a normal way to ASK for a testimonial, but publishing
 * one they have not signed off is a fabricated endorsement — prohibited under
 * the FTC's endorsement rules in the US and under consumer-protection law in
 * the UK and EU, with their name on it rather than ours. The three drafts are
 * written and waiting in that file; each goes live on a one-word edit once its
 * author confirms the wording.
 */

/** What the three cards show until three reviews are approved. */
const FEATURE = {
  client: "Signature Bangla",
  logo: CLIENTS.find((client) => client.name === "Signature Bangla"),
  quote:
    "Groceries with a two-day shelf life, pharmacy items with regulatory constraints and household goods, sold from one basket — with operations watching orders, riders and stock move in real time.",
  accent: "across four locations",
  meta: "eCommerce · delivery platform",
  sub: "Next.js · Node.js · PostgreSQL · Socket.IO",
  href: "/case-study/signature-bangla",
};

const SUPPORTING = [
  {
    title: "Clinic Management System",
    initials: "CM",
    quote:
      "Appointments, patient records and billing in one place, replacing a register and three spreadsheets that never agreed with each other.",
    meta: "Health tech · Dhaka",
    href: "/case-study/clinic-management-system",
  },
  {
    title: "Restaurant POS",
    initials: "RP",
    quote:
      "Orders, kitchen tickets and end-of-day takings on hardware the staff already had, built to keep working when the connection does not.",
    meta: "Hospitality · multi-branch",
    href: "/case-study/restaurant-pos",
  },
];

/** One shape for both, so the cards below are written once. */
type Card = {
  key: string;
  quote: string;
  /** The tail of the quote, set in the serif — reviews do not get one. */
  accent?: string;
  title: string;
  sub: string;
  /** The mono tag at the foot of the black card, or the chip on a white one. */
  tag: string;
  href?: string;
  logo?: { src: string; alt: string; width: number; height: number };
  initials?: string;
};

const reviews = APPROVED_TESTIMONIALS;
const showReviews = reviews.length >= 3;

const CARDS: Card[] = showReviews
  ? reviews.slice(0, 3).map((item) => ({
      key: item.id,
      quote: item.quote,
      title: item.name,
      sub: item.role,
      tag: "Client review",
      logo: item.logo
        ? { src: item.logo.src, alt: item.logo.alt, width: 161, height: 161 }
        : undefined,
      initials: item.name
        .split(" ")
        .slice(0, 2)
        .map((word) => word[0])
        .join(""),
    }))
  : [
      {
        key: "feature",
        quote: FEATURE.quote,
        accent: FEATURE.accent,
        title: FEATURE.client,
        sub: FEATURE.sub,
        tag: FEATURE.meta,
        href: FEATURE.href,
        logo: FEATURE.logo
          ? {
              src: FEATURE.logo.src,
              alt: FEATURE.logo.name,
              width: FEATURE.logo.width,
              height: FEATURE.logo.height,
            }
          : undefined,
      },
      ...SUPPORTING.map((item) => ({
        key: item.title,
        quote: item.quote,
        title: item.title,
        sub: item.meta,
        tag: "Case study",
        href: item.href,
        initials: item.initials,
      })),
    ];

/** A card is a link only when there is somewhere for it to go. */
function CardShell({
  href,
  className,
  children,
}: {
  href?: string;
  className: string;
  children: React.ReactNode;
}) {
  if (!href) return <div className={className}>{children}</div>;
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function Avatar({ card, size }: { card: Card; size: 52 | 44 }) {
  // A circle is a bad container for a wordmark: Rongobuy's mark is 161x36, so
  // fitting it inside a 44px disc leaves it about eight pixels tall and
  // unreadable. Square-ish marks get the logo, long ones get the monogram.
  if (card.logo && card.logo.width / card.logo.height < 1.6) {
    return (
      <span
        style={{ width: size, height: size }}
        className="flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white"
      >
        <Image
          src={card.logo.src}
          alt=""
          width={card.logo.width}
          height={card.logo.height}
          sizes="52px"
          className="h-[62%] w-auto max-w-[76%] object-contain"
        />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-full bg-black/[0.06] font-display text-[15px] font-semibold tracking-[-0.02em] text-black"
    >
      {card.initials}
    </span>
  );
}

export default function ContactProof() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 84%" });

      gsap.from(".pf-head", {
        y: 22,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: trigger,
      });

      gsap.from(".pf-mark", {
        y: 16,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.08,
        delay: 0.1,
        scrollTrigger: trigger,
      });

      gsap.from(".pf-card", {
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.15,
        scrollTrigger: trigger,
      });
    },
    { scope: sectionRef },
  );

  const [lead, ...rest] = CARDS;

  return (
    <section
      ref={sectionRef}
      className="mx-auto w-full max-w-[1360px] px-[clamp(20px,4vw,48px)] pb-[clamp(80px,9vw,128px)]"
    >
      <div className="pf-head flex w-full flex-wrap items-end justify-between gap-[32px] pb-[40px]">
        <div className="flex max-w-[640px] flex-col gap-[20px]">
          <span className="flex items-center gap-[10px] font-mono text-[12px] uppercase leading-none tracking-[0.08em] text-black">
            <span aria-hidden className="h-[2px] w-[24px] shrink-0 bg-primary-green" />
            Client work
          </span>
          <h2 className="m-0 font-display text-[clamp(40px,5vw,72px)] font-semibold leading-[0.98] tracking-[-0.05em] text-balance text-black">
            Said by the people{" "}
            <span className="font-serif font-normal italic tracking-[-0.02em]">
              we&rsquo;ve shipped for
            </span>
          </h2>
        </div>

        {/* The concept puts review-platform badges here. These are the client
            marks, which we do have permission to show — see lib/clients.ts. */}
        <ul className="flex flex-wrap gap-[8px]">
          {CLIENTS.map((client) => (
            <li
              key={client.name}
              className="pf-mark flex min-w-[164px] flex-col gap-[12px] rounded-[18px] border border-black/15 bg-white px-[18px] py-[16px]"
            >
              {/* self-start and object-contain, both load-bearing: the card is
                  a flex column, so without them a 120x120 square mark gets
                  stretched to the card's full width and squashed to the row
                  height. */}
              <Image
                src={client.src}
                alt={client.name}
                width={client.width}
                height={client.height}
                sizes="161px"
                className={`${client.rowClassName} w-auto max-w-full self-start object-contain`}
              />
              <span className="font-body text-[12px] font-semibold leading-[1.3] tracking-[-0.1px] text-black">
                {client.name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] gap-[16px]">
        {/* The tall black card, with the disc bleeding off its corner. */}
        <CardShell
          href={lead.href}
          className="pf-card relative flex min-h-[520px] flex-col justify-between gap-[48px] overflow-hidden rounded-[28px] bg-black p-[clamp(28px,3.4vw,48px)] text-bg"
        >
          <span
            aria-hidden
            className="absolute -right-[40px] -top-[60px] size-[240px] rounded-full bg-primary-green"
          />

          <span
            aria-hidden
            className="relative self-end pr-[36px] pt-[40px] font-serif text-[160px] italic leading-[0.6] text-black"
          >
            &rdquo;
          </span>

          <p className="relative m-0 font-display text-[clamp(26px,2.6vw,38px)] font-medium leading-[1.2] tracking-[-0.03em] text-pretty">
            {lead.quote}
            {lead.accent ? (
              <>
                {" "}
                <span className="font-serif font-normal italic tracking-[-0.02em] text-primary-green">
                  {lead.accent}
                </span>
              </>
            ) : null}
          </p>

          <div className="relative flex flex-wrap items-center justify-between gap-[16px] border-t border-white/12 pt-[24px]">
            <div className="flex items-center gap-[14px]">
              <Avatar card={lead} size={52} />
              <div className="flex flex-col gap-[2px]">
                <span className="font-body text-[16px] font-semibold leading-none tracking-[-0.1px]">
                  {lead.title}
                </span>
                <span className="font-body text-[13px] leading-[1.4] tracking-[-0.1px] text-white/60">
                  {lead.sub}
                </span>
              </div>
            </div>
            <span className="rounded-full bg-primary-green px-[12px] py-[7px] font-mono text-[11px] uppercase leading-none tracking-[0.08em] text-black">
              {lead.tag}
              {lead.href ? " ↗" : ""}
            </span>
          </div>
        </CardShell>

        {/* Two white cards stacked beside it. */}
        <div className="flex flex-col gap-[16px]">
          {rest.map((card) => (
            <CardShell
              key={card.key}
              href={card.href}
              className="pf-card flex flex-1 flex-col justify-between gap-[28px] rounded-[28px] border border-black/12 bg-white p-[28px] text-black transition-colors duration-300 hover:border-black"
            >
              <div className="flex items-center justify-between gap-[12px]">
                <span className="rounded-full bg-primary-green px-[10px] py-[4px] font-body text-[14px] leading-[1.3] tracking-[2px] text-black">
                  ★★★★★
                </span>
                <span className="font-mono text-[11px] uppercase leading-none tracking-[0.08em] text-neutral-paragraph">
                  {card.tag}
                  {card.href ? " ↗" : ""}
                </span>
              </div>

              <p className="m-0 font-display text-[20px] leading-[1.4] tracking-[-0.015em] text-pretty">
                {card.quote}
              </p>

              <div className="flex items-center gap-[12px]">
                <Avatar card={card} size={44} />
                <div className="flex flex-col gap-[2px]">
                  <span className="font-body text-[15px] font-semibold leading-none tracking-[-0.1px]">
                    {card.title}
                  </span>
                  <span className="font-body text-[13px] leading-[1.4] tracking-[-0.1px] text-neutral-paragraph">
                    {card.sub}
                  </span>
                </div>
              </div>
            </CardShell>
          ))}
        </div>
      </div>
    </section>
  );
}
