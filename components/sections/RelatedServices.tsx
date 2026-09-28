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
 * Portrait and a little over one by two, which is what the two parts want: a
 * headline across the top with its last phrase struck in marker, and a handset
 * under it running off the bottom edge.
 *
 * Every card is white on a saturated band. The alternating black card is gone —
 * the reference runs one ground and lets the marker and the screen carry the
 * colour, and a black card in a row of white ones read as a state rather than
 * a choice.
 *
 * The height has to hold a whole handset: the phone is 70% of the card's width
 * at a real handset's ratio, which is 1.52 times the card's width tall. Much
 * shorter than this and the screen's tab bar is cut off with it.
 */
const CARD = "h-[520px] w-[268px] lg:h-[600px] lg:w-[300px]";
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

/* ------------------------------------------------------------------ phone */

/**
 * A handset, drawn.
 *
 * The reference's cards are each a photograph of a phone running the product,
 * and nothing about that needs a photograph: a black rounded frame, a cut-out
 * for the island, and a screen laid out like an app screen gets there in divs.
 * Drawing it also means the screen can carry OUR content rather than a stock
 * one — the title, the artwork and the first things the engagement includes.
 *
 * The one thing it must not do is squeeze a landscape screenshot into a
 * portrait screen. So the screenshot goes in where a real app would put a
 * picture: a wide card near the top, under the greeting.
 */
function Phone({ card }: { card: Card }) {
  return (
    // Width is a share of the card so the whole thing scales with it, and the
    // aspect ratio is a real handset's, so nothing has to be measured twice.
    <div className="pointer-events-none absolute inset-x-0 bottom-[-26px] flex justify-center">
      <div className="relative aspect-[9/19.5] w-[70%] rounded-[30px] bg-[#101010] p-[6px] shadow-[0_22px_44px_-16px_rgba(0,0,0,0.45)]">
        <div className="relative flex size-full flex-col overflow-hidden rounded-[25px] bg-white">
          {/* The island, sitting over the screen the way the real one does. */}
          <span className="absolute left-1/2 top-[7px] z-10 h-[13px] w-[42px] -translate-x-1/2 rounded-full bg-[#101010]" />

          {/* Status bar. Signal, wifi and battery as three plain shapes —
              at this size anything more literal is mud. */}
          <div className="flex items-center justify-between px-[11px] pt-[7px]">
            <span className="font-body text-[7px] font-bold leading-none text-black">9:41</span>
            <span aria-hidden className="flex items-center gap-[2.5px]">
              <span className="h-[5px] w-[6px] rounded-[1px] bg-black/75" />
              <span className="h-[5px] w-[6px] rounded-[1px] bg-black/55" />
              <span className="h-[5px] w-[9px] rounded-[1.5px] border border-black/60" />
            </span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-[7px] px-[10px] pt-[9px]">
            <p className="font-display text-[10px] font-bold leading-[1.12] tracking-[-0.02em] text-pure-black">
              {card.title}
            </p>

            {/* Where a real app would put its picture. The screenshot is
                landscape, and this is a landscape slot, so it arrives the right
                way up instead of being cropped to a sliver. */}
            <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-[8px] bg-[#f1f1ee]">
              <Image
                src={`/images/services/${card.image}.webp`}
                alt=""
                fill
                sizes="220px"
                className="object-cover object-top"
              />
              <span className="absolute bottom-[5px] left-[5px] rounded-full bg-primary-green px-[5px] py-[2px] font-mono text-[5.5px] font-bold uppercase leading-none tracking-[0.5px] text-black">
                Live
              </span>
            </div>

            <p className="line-clamp-3 font-body text-[6.5px] leading-[9px] text-black/55">
              {card.line}
            </p>

            {/* Two rows, the way every app lists the next thing to do. The
                bars are decoration; the tick is what makes them read as done. */}
            {[0, 1, 2, 3].map((row) => (
              <span
                key={row}
                className="flex items-center gap-[6px] rounded-[7px] bg-[#f4f4f1] px-[6px] py-[5px]"
              >
                <span className="flex size-[11px] shrink-0 items-center justify-center rounded-full bg-primary-green">
                  <svg viewBox="0 0 10 10" className="size-[6px]" aria-hidden>
                    <path
                      d="M2 5.2 4 7.2 8 3"
                      fill="none"
                      stroke="#0b0b0b"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                  <span
                    className="h-[3px] rounded-full bg-black/20"
                    style={{ width: ["74%", "58%", "66%", "52%"][row] }}
                  />
                  <span
                    className="h-[3px] rounded-full bg-black/10"
                    style={{ width: ["46%", "62%", "38%", "70%"][row] }}
                  />
                </span>
              </span>
            ))}
          </div>

          {/* The tab bar, held clear of the card's bottom edge so the cut does
              not take it with it. */}
          <div className="mt-auto flex items-center justify-center gap-[5px] px-[10px] pb-[26px] pt-[9px]">
            <span className="flex items-center gap-[3px] rounded-full bg-[#101010] px-[8px] py-[4px]">
              <span className="size-[5px] rounded-[1px] bg-white" />
              <span className="font-body text-[6px] font-semibold leading-none text-white">
                Home
              </span>
            </span>
            <span className="size-[5px] rounded-[1px] bg-black/25" />
            <span className="size-[5px] rounded-full bg-black/25" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------- rail */

/**
 * One card on the rail.
 *
 * `clone` is the copies behind the first: the rail has to be longer than its
 * contents to loop, and duplicating a list of links would put every service in
 * the tab order twice and read it out twice. The clones are inert.
 */
function RailCard({ card, clone }: { card: Card; clone?: boolean }) {
  const { lead, mark } = splitTitle(card.title);

  const body = (
    <>
      {/* Graph paper, barely there. The reference rules its cards faintly and
          it is what keeps a white panel from being a blank. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[size:26px_26px]"
      />

      {/* The marker. A padded background on the words themselves rather than a
          box positioned behind them, so it follows the text when it wraps and
          when the type scale changes. `box-decoration-clone` keeps both halves
          of a wrapped phrase padded instead of leaving one end open. */}
      <h3 className="relative font-display text-[clamp(1.55rem,2.05vw,30px)] font-bold leading-[1.16] tracking-[-0.035em] text-pure-black">
        {lead ? `${lead} ` : ""}
        <span className="box-decoration-clone rounded-[2px] bg-[#dff25c] px-[7px] py-[2px]">
          {mark}
        </span>
      </h3>

      <Phone card={card} />
    </>
  );

  const shell =
    "related-card group relative shrink-0 overflow-hidden rounded-[20px] bg-white p-[22px] " +
    "shadow-[0_2px_4px_rgba(0,0,0,0.05),0_20px_40px_-26px_rgba(0,0,0,0.35)] " +
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
    // Three of the four things the engagement includes. One of them alone was
    // a fragment; three read as the shape of the work.
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
    // The band is the brand green, which is the reference's move: one saturated
    // ground, white cards lying on it, and the only other colour a marker.
    <section
      ref={sectionRef}
      className="w-full overflow-hidden bg-primary-green pb-[84px] pt-[76px] lg:pb-[110px] lg:pt-[100px]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[40px]">
        <div className="related-head flex w-full flex-wrap items-end justify-between gap-[14px]">
          <h2 className="font-display text-[clamp(1.75rem,3vw,38px)] font-bold leading-[1.1] tracking-[-0.03em] text-pure-black">
            {currentSlug ? "Other Services" : "All Services"}
          </h2>
          <p className="font-mono text-[11px] uppercase leading-none tracking-[0.8px] text-black/55">
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
            cards.map((card) => (
              <RailCard key={`${copy}-${card.key}`} card={card} clone={copy > 0} />
            )),
          )}
        </div>
      </div>
    </section>
  );
}
