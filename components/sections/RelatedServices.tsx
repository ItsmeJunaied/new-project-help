"use client";

import Link from "next/link";
import { useRef, useState, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";

/**
 * The card.
 *
 * Tall and narrow, and nearly touching its neighbours — the row reads as one
 * surface cut into panes rather than a line of separate cards, which is what
 * the small gap is for.
 *
 * The drawn artwork that used to fill these has gone;
 * components/sections/service-card-art.tsx still holds it and is no longer
 * imported by anything, so bringing any of it back is an import away.
 */
/**
 * Capped rather than fixed: at 384 a card is wider than a 375px phone, so no
 * card ever sat on screen whole. Holding it to a fraction of the viewport
 * leaves the next one peeking in, which is also the only thing telling a
 * visitor the row goes on. The lap is measured off the DOM, so a width that
 * changes with the viewport costs the loop nothing.
 */
const CARD_WIDTH = "min(384px, 86vw)";
const CARD_HEIGHT = "min(624px, 148vw)";
const CARD_GAP = 12;

const CARDS: { slug: string; label: string }[] = [
  { slug: "saas-platform-development", label: "SaaS Platforms" },
  { slug: "ecommerce-digital-commerce", label: "eCommerce" },
  { slug: "devops-cloud-infrastructure", label: "DevOps & Cloud" },
  { slug: "ai-ml-data-analytics", label: "AI/ML & Data" },
  { slug: "technology-consulting", label: "Consulting" },
  { slug: "mobile-app-development", label: "Mobile Apps" },
  { slug: "cybersecurity-data-protection", label: "Cybersecurity" },
  { slug: "custom-software-development", label: "Custom Software" },
  { slug: "web-application-development", label: "Web Applications" },
  { slug: "erp-software-development", label: "ERP Systems" },
  { slug: "crm-software-development", label: "CRM Systems" },
  { slug: "enterprise-software-development", label: "Enterprise Software" },
  { slug: "api-development", label: "API Development" },
  { slug: "microservices-architecture", label: "Microservices" },
  { slug: "business-process-automation", label: "Business Automation" },
];

const railCopies = (count: number) => (count >= 10 ? 2 : 3);

/** Pixels a second. Slow enough to read a card as it passes. */
const RAIL_SPEED = 34;

/**
 * An empty image field: where a picture goes, and at what angle.
 *
 * Percentages of the card, so the whole arrangement scales with it. Every value
 * is deliberate — the tiles overlap, sit at slightly different angles and run
 * past the card's edges, because a grid of evenly spaced rectangles is the one
 * thing this design is not.
 */
type Field = { left: string; top: string; width: string; height: string; turn: number };

/**
 * Four arrangements, cycled down the row.
 *
 * Fifteen identical cards would read as a spreadsheet. Each layout puts its
 * fields in a different place and leaves the headline a different shape of room
 * — which is what makes the row look composed rather than repeated.
 */
const LAYOUTS: Field[][] = [
  [
    { left: "6%", top: "40%", width: "52%", height: "30%", turn: -4 },
    { left: "52%", top: "28%", width: "44%", height: "26%", turn: 5 },
    { left: "30%", top: "72%", width: "46%", height: "22%", turn: -2 },
  ],
  [
    { left: "14%", top: "30%", width: "58%", height: "34%", turn: 3 },
    { left: "58%", top: "58%", width: "40%", height: "28%", turn: -5 },
    { left: "-4%", top: "70%", width: "38%", height: "22%", turn: 2 },
  ],
  [
    { left: "8%", top: "34%", width: "46%", height: "28%", turn: 4 },
    { left: "48%", top: "46%", width: "50%", height: "32%", turn: -3 },
    { left: "18%", top: "74%", width: "34%", height: "20%", turn: 6 },
  ],
  [
    { left: "20%", top: "26%", width: "56%", height: "32%", turn: -5 },
    { left: "4%", top: "60%", width: "44%", height: "26%", turn: 3 },
    { left: "56%", top: "70%", width: "42%", height: "24%", turn: -2 },
  ],
];

/**
 * The headline, upright except for its last word.
 *
 * The site already sets the accent half of a headline in italic serif — the
 * contact pages do it in six places. A single-word label ("Cybersecurity",
 * "Microservices") turns completely, which is the same gesture rather than an
 * exception to it. Every fourth card rules its italic word, the way the
 * reference boxes the word it wants you to land on.
 */
function Headline({ label, ruled }: { label: string; ruled: boolean }) {
  const words = label.split(" ");
  const last = words.pop() ?? label;
  const lead = words.join(" ");

  return (
    <h3 className="w-full font-display text-[40px] font-semibold leading-[1.04] tracking-[-0.04em] text-pure-black">
      {lead && <span>{lead} </span>}
      <span
        className={`font-serif font-normal italic tracking-[-0.02em] ${
          ruled ? "border-b-[2px] border-pure-black/80 pb-[2px]" : ""
        }`}
      >
        {last}
      </span>
    </h3>
  );
}

/**
 * What a card shows: a headline, and the empty fields the imagery will sit in.
 *
 * The fields are drawn rather than left blank. A panel with nothing below its
 * headline reads as a page that failed to load, where a tilted, shadowed,
 * slightly translucent tile reads as a space waiting for a picture.
 */
function CardFace({ label, layout, bottom }: { label: string; layout: Field[]; bottom: boolean }) {
  return (
    <div className="relative h-full w-full">
      {layout.map((field, i) => (
        <div
          key={i}
          aria-hidden
          className="absolute rounded-[14px] border border-white/60 bg-white/55 shadow-[0_18px_40px_-22px_rgba(0,0,0,0.45)] backdrop-blur-[6px]"
          style={{
            left: field.left,
            top: field.top,
            width: field.width,
            height: field.height,
            transform: `rotate(${field.turn}deg)`,
          }}
        />
      ))}

      {/* Above the fields, and only as wide as it needs to be: the headline is
          the one thing that must stay readable whatever ends up underneath. */}
      <div
        className={`absolute left-[28px] right-[28px] ${bottom ? "bottom-[30px]" : "top-[30px]"}`}
      >
        <Headline label={label} ruled={false} />
      </div>
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

  // On a detail page this is the sibling row, so it is everything except the
  // service you are already reading. On /services it is the whole offering.
  const drawn = CARDS.map((card, index) => ({ ...card, index })).filter(
    (card) => card.slug !== currentSlug,
  );

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
        y: 34,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        scrollTrigger: reveal(sectionRef.current, { start: "top 90%" }),
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
       * 11,500px composited layer, where a scroller paints only what is on
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
        const cards = rail.querySelectorAll<HTMLElement>(".related-card");
        const twin = cards[drawn.length];
        return twin ? twin.offsetLeft - cards[0].offsetLeft : 0;
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
    { scope: sectionRef, dependencies: [drawn.length] },
  );

  // A rail that never stops is a rail you cannot read or click. Hovering it, or
  // tabbing into it, holds it where it is — and leaves it scrollable by hand.
  const hold = () => {
    held.current = true;
  };
  const release = () => {
    held.current = false;
  };

  const copies = still ? 1 : railCopies(drawn.length);

  /**
   * Frosted, not white.
   *
   * The panel is half-transparent and blurs what is behind it, which is the
   * whole look: on a flat grey ground it reads as a sheet of glass laid over
   * the page rather than a white box drawn on it. That only works while the
   * ground stays darker than the glass, which is why the section sets one
   * instead of inheriting the page's near-white.
   */
  const shell: CSSProperties = {
    position: "relative",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: CARD_GAP,
    borderRadius: 24,
    background: "rgba(255,255,255,0.46)",
    backdropFilter: "blur(26px)",
    WebkitBackdropFilter: "blur(26px)",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,.75), 0 0 0 1px rgba(255,255,255,.35), 0 30px 70px -40px rgba(0,0,0,.45)",
    overflow: "hidden",
    flexShrink: 0,
  };

  return (
    // A flat mid-grey ground. The panels are frosted glass, and glass is only
    // glass while there is something darker behind it to see through to.
    <section
      ref={sectionRef}
      style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}
      className="w-full overflow-hidden bg-[#c9c8c4] pb-[32px] pt-[76px] lg:pb-[60px] lg:pt-[96px]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[40px]">
        <div className="related-head flex w-full flex-wrap items-end justify-between gap-[18px]">
          <h2 className="text-[clamp(2.2rem,4.4vw,60px)] font-bold leading-[0.95] tracking-[-0.055em] text-pure-black">
            {currentSlug ? "Other " : "What we "}
            <span className="font-serif font-normal italic tracking-[-0.02em]">build</span>
          </h2>
          <p className="font-body text-[15px] leading-none tracking-[-0.1px] text-black/45 lg:text-[17px]">
            {drawn.length} services. Hover to pause.
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
        className="related-rail mt-[-10px] w-full overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [mask-image:linear-gradient(to_right,transparent,black_3%,black_97%,transparent)] [scrollbar-width:none] lg:mt-[4px] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex w-max py-[40px] pl-6 lg:pl-[40px]">
          {Array.from({ length: copies }, (_, copy) =>
            drawn.map((card) => {
              const layout = LAYOUTS[card.index % LAYOUTS.length];
              // Every third card hangs its headline at the foot instead of the
              // head, so the row has a rhythm down its length rather than one
              // straight line of titles across the top.
              const bottom = card.index % 3 === 1;

              // The copies behind the first exist to cover the loop. Putting
              // every service into the tab order twice, and having a screen
              // reader announce the whole row twice, is not worth that.
              if (copy > 0) {
                return (
                  <div
                    key={`${copy}-${card.index}`}
                    aria-hidden
                    className="related-card"
                    style={shell}
                  >
                    <CardFace label={card.label} layout={layout} bottom={bottom} />
                  </div>
                );
              }

              return (
                <Link
                  key={`${copy}-${card.index}`}
                  href={`/services/${card.slug}`}
                  title={card.label}
                  className="related-card"
                  style={shell}
                >
                  <CardFace label={card.label} layout={layout} bottom={bottom} />
                </Link>
              );
            }),
          )}
        </div>
      </div>
    </section>
  );
}
