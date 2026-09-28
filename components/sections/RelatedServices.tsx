"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";
import { SERVICES, WORK_DOMAINS } from "@/lib/services";

/**
 * Two grounds, alternating.
 *
 * This board used to run four deep grounds — graphite, lime, forest and paper —
 * across a bento grid. It is a rail now, and a rail is read left to right: four
 * colours cycling past is a pattern to decode rather than a set of cards. So
 * white, with ink every third card as punctuation, and one word of the title
 * carrying a gradient — which is the whole of the reference's colour.
 */
type Scheme = {
  ground: string;
  title: string;
  /** The index plate, and the flat fallback for the gradient word. */
  accent: string;
  /** Painted through the accented word. */
  accentGradient: string;
  /** The orbit rings behind the artwork. */
  ring: string;
  /** The chip that carries the supporting line over the artwork. */
  chip: string;
  chipInk: string;
  chipEdge: string;
  /** No border on this card — it is lifted off the grey ground by shadow. */
  lift: string;
};

const PAPER: Scheme = {
  ground: "#ffffff",
  title: "#0b0b0b",
  // A deeper green than the brand token: the brand value is tuned to sit on
  // black, and on white it is barely type.
  accent: "#4d7d13",
  accentGradient: "linear-gradient(96deg, #2c5c0a 0%, #6fae1f 55%, #a8d94e 100%)",
  ring: "rgba(21,21,21,0.07)",
  chip: "rgba(12,12,12,0.86)",
  chipInk: "#ffffff",
  chipEdge: "rgba(255,255,255,0.10)",
  lift: "shadow-[0_2px_4px_rgba(0,0,0,0.04),0_26px_52px_-30px_rgba(0,0,0,0.42)]",
};

const INK: Scheme = {
  ground: "linear-gradient(168deg, #1e1e1e 0%, #070707 100%)",
  title: "#ffffff",
  accent: "var(--color-primary-green)",
  accentGradient:
    "linear-gradient(96deg, var(--color-primary-green) 0%, #bdf07e 62%, #e8ffc9 100%)",
  ring: "rgba(255,255,255,0.10)",
  chip: "rgba(255,255,255,0.90)",
  chipInk: "#0b0b0b",
  chipEdge: "rgba(12,12,12,0.08)",
  lift: "shadow-[0_2px_4px_rgba(0,0,0,0.10),0_26px_52px_-30px_rgba(0,0,0,0.62)]",
};

/** Ink every third card, the way the reference punctuates a row of white. */
const SCHEMES = [PAPER, INK, PAPER];

/**
 * The rail's card.
 *
 * Portrait and close to one by two, because that is the shape the reference
 * cards are and the shape the parts want: a headline big enough to be the whole
 * top of the card, and artwork filling everything under it.
 */
const CARD = "h-[520px] w-[282px] lg:h-[600px] lg:w-[320px]";
const CARD_GAP = "mr-[16px]";

/** How much of the card's height the artwork takes, from the bottom up. */
const ART_HEIGHT = "h-[58%]";

/**
 * How many times the rail repeats itself.
 *
 * It scrolls back to the start after exactly one copy, which lands on an
 * identical frame and so has no seam. For that to be reachable the copies
 * BEHIND the first have to cover the window — otherwise the rail hits the end
 * of its own scroll and stops dead before it comes round.
 *
 * Fifteen cards is 5,040px, so two copies cover any window worth designing for.
 * Six — the sibling row on a service page — is only 2,016px, and two copies
 * would strand a wide monitor; three carry it past 4,000px.
 *
 * It is also why the space between cards is a margin on the card rather than
 * `gap` on the row: with `gap` the row is one gap short of whole copies, and
 * the loop jumps that gap every time it comes round.
 */
const railCopies = (count: number) => (count >= 10 ? 2 : 3);

/**
 * Pixels a second. Slow enough to read a card as it passes, and stated as a
 * rate rather than a duration so the six-card row on a service page drifts at
 * the same speed as the fifteen-card one on /services.
 */
const RAIL_SPEED = 26;

type Card = {
  key: string;
  title: string;
  line: string;
  /** A file in /images/services, built by scripts/service-images/build.mjs. */
  image: string;
  href: string | null;
};

/**
 * The kinds of work with no page of their own, against their artwork.
 *
 * A domain is only on the rail if it has a picture: a card here is most of the
 * way a picture, and one without would be a blank panel between two that are
 * not. The seven services use their own slug, which is the filename too.
 */
const DOMAIN_IMAGE: Record<string, string> = {
  "Custom Software": "custom-software",
  "Web Applications": "web-applications",
  "ERP Systems": "erp-systems",
  "CRM Systems": "crm-systems",
  "Enterprise Software": "enterprise-software",
  "API Development": "api-development",
  Microservices: "microservices",
  "Business Automation": "business-automation",
};

/**
 * The last word of a title, which is the one that carries the gradient.
 *
 * A one-word title gives the gradient the whole word — which is what the
 * reference does with "Cash out" and with "Vetted", and is better than a card
 * with no colour on it at all.
 */
function splitTitle(title: string) {
  const words = title.trim().split(" ");
  if (words.length < 2) return { lead: "", accent: title };
  return { lead: words.slice(0, -1).join(" "), accent: words[words.length - 1] };
}

/* ------------------------------------------------------------------- rail */

/**
 * One card on the rail.
 *
 * `clone` is the copies behind the first: the rail has to be longer than its
 * contents to loop, and duplicating a list of links would put every service in
 * the tab order twice and read it out twice. The clones are inert.
 */
function RailCard({ card, index, clone }: { card: Card; index: number; clone?: boolean }) {
  const scheme = SCHEMES[index % SCHEMES.length];
  const { lead, accent } = splitTitle(card.title);

  const body = (
    <>
      {/* The artwork, filling the foot of the card edge to edge and dissolving
          into the ground rather than starting on a hard line. A straight top
          edge here reads as a thumbnail pasted into a box; the mask is what
          makes it the card. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 bottom-0 ${ART_HEIGHT} [mask-image:linear-gradient(to_bottom,transparent_0%,black_26%)]`}
      >
        <Image
          src={`/images/services/${card.image}.webp`}
          alt=""
          fill
          sizes="(max-width: 1023px) 282px, 320px"
          className="object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
        />
      </div>

      {/* Faint orbit rings behind the artwork, off the card's top corner. The
          reference puts concentric rings and dotted paths behind every scene;
          this is the cheap half of that, and it stops the upper half of the
          card from being flat colour. */}
      <svg
        aria-hidden
        viewBox="0 0 200 200"
        className="pointer-events-none absolute -right-[64px] -top-[58px] size-[260px]"
        style={{ color: scheme.ring }}
      >
        {[46, 68, 90].map((r) => (
          <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="currentColor" strokeWidth="1" />
        ))}
        <circle cx="100" cy="100" r="112" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 7" />
      </svg>

      <span
        aria-hidden
        style={{ color: scheme.accent }}
        className="relative font-mono text-[10px] uppercase leading-none tracking-[1px]"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <h3
        style={{ color: scheme.title }}
        className="relative mt-[18px] font-display text-[clamp(2.2rem,3vw,45px)] font-bold leading-[0.98] tracking-[-0.045em]"
      >
        {lead ? `${lead} ` : ""}
        <span
          style={{ backgroundImage: scheme.accentGradient }}
          className="bg-clip-text text-transparent"
        >
          {accent}
        </span>
      </h3>

      {/* The supporting line rides over the artwork on a chip rather than
          sitting under the headline as grey body copy — which is what the
          reference does with "Earn $40–$500 per day" and "Pass once. Get
          matched to high signal work.", and it gives the headline the whole
          top of the card. */}
      <span
        style={{ backgroundColor: scheme.chip, color: scheme.chipInk, borderColor: scheme.chipEdge }}
        className="absolute inset-x-[22px] bottom-[22px] rounded-[16px] border px-[16px] py-[12px] font-body text-[12.5px] font-medium leading-[17px] tracking-[-0.1px] shadow-[0_10px_26px_-12px_rgba(0,0,0,0.5)] backdrop-blur-md lg:inset-x-[26px] lg:bottom-[26px]"
      >
        {card.line}
      </span>
    </>
  );

  const shell = `related-card group relative shrink-0 overflow-hidden rounded-[34px] p-[26px] lg:p-[30px] ${CARD} ${CARD_GAP} ${scheme.lift}`;
  const style = { backgroundImage: scheme.ground };

  if (clone) {
    return (
      <div aria-hidden style={style} className={shell}>
        {body}
      </div>
    );
  }

  return card.href ? (
    <Link href={card.href} style={style} className={shell}>
      {body}
    </Link>
  ) : (
    <div style={style} className={shell}>
      {body}
    </div>
  );
}

export default function RelatedServices({ currentSlug }: { currentSlug: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  /** Set while the cursor or the keyboard is inside the rail. */
  const held = useRef(false);

  /**
   * Reduced motion drops the duplicate copy along with the drift: nothing is
   * looping, so there is nothing for the second copy to cover.
   */
  const [still, setStill] = useState(false);

  const services = SERVICES.filter((service) => service.slug !== currentSlug).map((service) => ({
    key: service.slug,
    title: service.shortTitle,
    line: service.included[0],
    image: service.slug,
    href: `/services/${service.slug}`,
  }));

  // On a detail page this is the sibling row. On /services it is the whole
  // offering, so the work that has no page of its own is on the rail too.
  const domains: Card[] = currentSlug
    ? []
    : WORK_DOMAINS.filter((domain) => !domain.service && DOMAIN_IMAGE[domain.name]).map(
        (domain) => ({
          key: domain.name,
          title: domain.name,
          line: domain.copy,
          image: DOMAIN_IMAGE[domain.name],
          href: null,
        }),
      );

  const cards: Card[] = [...services, ...domains];

  useGSAP(
    () => {
      gsap.from(".related-head", {
        y: 22,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: reveal(sectionRef.current, { start: "top 86%" }),
      });

      gsap.from(".related-rail", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: reveal(sectionRef.current, { start: "top 88%" }),
      });

      const rail = railRef.current;
      if (!rail || prefersReducedMotion()) {
        setStill(true);
        return;
      }

      /**
       * The rail moves by scrolling itself, not by transforming the row inside
       * it.
       *
       * Two reasons. A transformed row of fifteen cards twice over is a single
       * 10,000px composited layer, where a scroller paints only what is on
       * screen. And a scroller is something a visitor can push along — which,
       * paired with the hold below, means hovering the rail stops it and hands
       * it over rather than just freezing it out of reach.
       *
       * One lap is measured from a card to its own duplicate rather than
       * divided out of the row: the row carries a left indent so the rail
       * starts on the page margin, and dividing that in would leave half of it
       * behind on every lap.
       */
      const measure = () => {
        const drawn = rail.querySelectorAll<HTMLElement>(".related-card");
        const twin = drawn[cards.length];
        return twin ? twin.offsetLeft - drawn[0].offsetLeft : 0;
      };

      let lap = measure();
      const remeasure = () => {
        lap = measure();
      };
      window.addEventListener("resize", remeasure);

      let last = gsap.ticker.time;
      const drift = () => {
        const elapsed = gsap.ticker.time - last;
        last = gsap.ticker.time;
        // Held still while somebody is reading it — and while it is held the
        // scroll position is theirs, which is why this reads it back rather
        // than keeping a count of its own.
        if (held.current || lap <= 0) return;
        rail.scrollLeft = (rail.scrollLeft + RAIL_SPEED * elapsed) % lap;
      };
      gsap.ticker.add(drift);

      return () => {
        gsap.ticker.remove(drift);
        window.removeEventListener("resize", remeasure);
      };
    },
    { scope: sectionRef, dependencies: [cards.length] },
  );

  // A rail that never stops is a rail you cannot read or click. Hovering it, or
  // tabbing into it, holds it where it is — and leaves it scrollable by hand.
  const hold = () => {
    held.current = true;
  };
  const release = () => {
    held.current = false;
  };

  const copies = still ? 1 : railCopies(cards.length);

  return (
    // A grey band, not the page's own paper. White cards on near-white read as
    // panels ruled onto the page; on grey they read as objects lying on a
    // surface, which is the whole of why the reference sits on grey.
    <section
      ref={sectionRef}
      className="w-full overflow-hidden bg-[#eceae4] pb-[80px] pt-[72px] lg:pb-[110px] lg:pt-[100px]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[40px]">
        <div className="related-head flex w-full flex-wrap items-end justify-between gap-[14px]">
          <h2 className="font-display text-[clamp(1.75rem,3vw,38px)] font-semibold leading-[1.15] tracking-[-0.8px] text-black">
            {currentSlug ? "Other Services" : "All Services"}
          </h2>
          <p className="font-mono text-[11px] uppercase leading-none tracking-[0.8px] text-neutral-paragraph">
            {String(cards.length).padStart(2, "0")}
            {currentSlug ? " more" : " kinds of work"}
          </p>
        </div>
      </div>

      {/* Full bleed, faded to nothing at both ends so the rail reads as part of
          something longer rather than a strip that stops at the page margin,
          and a real scroller with its bar hidden: the drift is a scroll, and
          while it is held a visitor can push it along themselves. */}
      <div
        ref={railRef}
        onMouseEnter={hold}
        onMouseLeave={release}
        onFocusCapture={hold}
        onBlurCapture={release}
        className="related-rail mt-[26px] w-full overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] [scrollbar-width:none] lg:mt-[36px] [&::-webkit-scrollbar]:hidden"
      >
        <div className="related-rail-track flex w-max pl-6 lg:pl-[40px]">
          {Array.from({ length: copies }, (_, copy) =>
            cards.map((card, index) => (
              <RailCard key={`${copy}-${card.key}`} card={card} index={index} clone={copy > 0} />
            )),
          )}
        </div>
      </div>
    </section>
  );
}
