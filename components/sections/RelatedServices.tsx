"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";
import { SERVICES, WORK_DOMAINS } from "@/lib/services";

/**
 * The rail's card.
 *
 * Portrait and a little over one by two, which is the shape the parts want: a
 * headline across the top with one phrase struck through in marker, a line of
 * grey under it, and the work itself tilted at the foot of the card with a
 * pencil doodle behind it.
 *
 * Every card is white. The alternating black one is gone — the reference runs
 * one ground and lets the highlight and the artwork carry the colour, and a
 * black card in a row of white ones was reading as a state rather than a
 * choice.
 */
const CARD = "h-[500px] w-[268px] lg:h-[560px] lg:w-[300px]";
const CARD_GAP = "mr-[16px]";

/**
 * How many times the rail repeats itself.
 *
 * It scrolls back to the start after exactly one copy, which lands on an
 * identical frame and so has no seam. For that to be reachable the copies
 * BEHIND the first have to cover the window — otherwise the rail hits the end
 * of its own scroll and stops dead before it comes round.
 *
 * Fifteen cards is 4,740px, so two copies cover any window worth designing for.
 * Six — the sibling row on a service page — is only 1,896px, and two copies
 * would strand a wide monitor; three carry it past 3,700px.
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
 * The last word of a title, which is the one that gets the marker.
 *
 * A one-word title gives the marker the whole word, which is better than a card
 * with nothing struck on it at all.
 */
function splitTitle(title: string) {
  const words = title.trim().split(" ");
  if (words.length < 2) return { lead: "", mark: title };
  return { lead: words.slice(0, -1).join(" "), mark: words[words.length - 1] };
}

/* ----------------------------------------------------------------- doodles */

/**
 * Pencil line-art, drawn rather than sourced.
 *
 * The reference scatters hand-drawn marks around each scene — a dashed flight
 * path, a mountain range, a couple of birds. They are what keep the white half
 * of the card from being empty, and they are all stroke, so they cost a few
 * hundred bytes each and take their colour from the card.
 *
 * Four of them, cycled by position, so no two neighbours carry the same mark.
 */
const DOODLES = [
  // A dashed flight path with a paper plane at the end of it.
  <g key="flight">
    <path
      d="M4 96C22 58 58 22 104 16c26-3 44 6 52 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeDasharray="4 7"
    />
    <path
      d="M150 24l24 10-24 12 4-11-4-11z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </g>,

  // A ridge line with two birds over it.
  <g key="peaks">
    <path
      d="M2 108l34-46 22 28 26-40 30 40 24-24 32 42"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M112 26c4-5 8-5 11 0 3-5 7-5 11 0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="M140 44c3-4 6-4 8 0 3-4 6-4 8 0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </g>,

  // A dotted orbit with a four-point spark in it.
  <g key="orbit">
    <circle
      cx="96"
      cy="60"
      r="52"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeDasharray="2 8"
    />
    <circle cx="96" cy="60" r="30" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <path
      d="M40 20c0 9 4 13 13 13-9 0-13 4-13 13 0-9-4-13-13-13 9 0 13-4 13-13z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </g>,

  // A route between two pins.
  <g key="route">
    <path
      d="M16 92c30 10 44-16 70-10s34 24 66 8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeDasharray="5 6"
    />
    <path
      d="M16 92c0-14-9-18-9-28a9 9 0 1 1 18 0c0 10-9 14-9 28z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M152 90c0-14-9-18-9-28a9 9 0 1 1 18 0c0 10-9 14-9 28z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
  </g>,
];

/* -------------------------------------------------------------------- rail */

/**
 * One card on the rail.
 *
 * `clone` is the copies behind the first: the rail has to be longer than its
 * contents to loop, and duplicating a list of links would put every service in
 * the tab order twice and read it out twice. The clones are inert.
 */
function RailCard({ card, index, clone }: { card: Card; index: number; clone?: boolean }) {
  const { lead, mark } = splitTitle(card.title);

  const body = (
    <>
      {/* Behind everything, up in the empty corner the headline leaves. */}
      <svg
        aria-hidden
        viewBox="0 0 190 120"
        className="pointer-events-none absolute right-[-16px] top-[92px] w-[196px] text-black/[0.17]"
      >
        {DOODLES[index % DOODLES.length]}
      </svg>

      <span
        aria-hidden
        className="relative font-mono text-[10px] uppercase leading-none tracking-[1px] text-black/35"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* The marker. A padded background on the words themselves rather than a
          box positioned behind them, so it follows the text when it wraps and
          when the type scale changes. `box-decoration-clone` keeps both halves
          of a wrapped phrase padded instead of leaving one end open. */}
      <h3 className="relative mt-[16px] font-display text-[clamp(1.55rem,2.05vw,31px)] font-semibold leading-[1.18] tracking-[-0.03em] text-pure-black">
        {lead ? `${lead} ` : ""}
        <span className="box-decoration-clone rounded-[3px] bg-primary-green px-[7px] py-[2px]">
          {mark}
        </span>
      </h3>

      <p className="relative mt-[12px] line-clamp-3 font-body text-[12.5px] leading-[18px] tracking-[-0.1px] text-neutral-paragraph">
        {card.line}
      </p>

      {/* The work itself, tilted and running off the foot of the card.
          A screenshot laid flat in a box is a thumbnail; the same screenshot in
          a bezel, turned a few degrees and casting a shadow, is a device
          sitting on the card. The bezel is drawn — a dark rounded frame — so
          nothing here needs artwork that we do not already have. */}
      <div className="pointer-events-none absolute inset-x-[-50px] bottom-[-34px] lg:inset-x-[-56px]">
        <div className="relative aspect-[4/3] w-full rotate-[-5deg] overflow-hidden rounded-[20px] border-[6px] border-[#101010] bg-[#101010] shadow-[0_26px_50px_-20px_rgba(0,0,0,0.55)] transition-transform duration-[900ms] ease-out group-hover:rotate-[-2deg]">
          <Image
            src={`/images/services/${card.image}.webp`}
            alt=""
            fill
            sizes="(max-width: 1023px) 368px, 412px"
            className="object-cover object-top"
          />
        </div>
      </div>
    </>
  );

  const shell =
    "related-card group relative shrink-0 overflow-hidden rounded-[24px] bg-white p-[24px] " +
    "shadow-[0_2px_4px_rgba(0,0,0,0.04),0_26px_52px_-30px_rgba(0,0,0,0.42)] " +
    `lg:p-[26px] ${CARD} ${CARD_GAP}`;

  if (clone) {
    return (
      <div aria-hidden className={shell}>
        {body}
      </div>
    );
  }

  return card.href ? (
    <Link href={card.href} className={shell}>
      {body}
    </Link>
  ) : (
    <div className={shell}>{body}</div>
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
    // Three of the four things the engagement includes. One of them on its own
    // was a fragment under a headline; three read as the shape of the work.
    line: service.included.slice(0, 3).join(", "),
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
       * 9,500px composited layer, where a scroller paints only what is on
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
