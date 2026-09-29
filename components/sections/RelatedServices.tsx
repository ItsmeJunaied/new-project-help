"use client";

import Link from "next/link";
import { useRef, useState, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";
import { BODIES, GROUNDS, Ramps } from "@/components/sections/service-card-art";

/**
 * The card, the same box fifteen times over.
 *
 * Only the ground changes — white, graphite or near-black — and it comes from
 * the artwork file beside this one, because the ground is part of each card's
 * composition rather than a decision this section makes.
 */
const CARD_WIDTH = 360;
const CARD_HEIGHT = 585;
const CARD_GAP = 24;

/**
 * Which service each card belongs to, in the order they are drawn.
 *
 * Every card goes somewhere. Eight of them used to go nowhere — they were on
 * the rail because they are what the company does, and a visitor who clicked
 * "ERP Systems" got a card that moved under the cursor and then nothing. They
 * have pages of their own now, so the rail is fifteen links rather than seven
 * links and eight posters.
 *
 * `label` is the link's title; the card draws its own name.
 */
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

/**
 * How many times the rail repeats itself.
 *
 * It scrolls back to the start after exactly one copy, which lands on an
 * identical frame and so has no seam. For that to be reachable the copies
 * BEHIND the first have to cover the window — otherwise the rail runs out of
 * its own scroll and stops dead before it comes round.
 *
 * Fifteen cards is 5,760px, so two copies cover any window worth designing for,
 * and so does the fourteen-card sibling row on a service page. The three-copy
 * branch is what keeps a short rail — anything under ten cards — from stranding
 * a wide monitor halfway through its own lap.
 */
const railCopies = (count: number) => (count >= 10 ? 2 : 3);

/**
 * Pixels a second. Slow enough to read a card as it passes, and stated as a
 * rate rather than a duration so the six-card row on a service page drifts at
 * the same speed as the fifteen-card one on /services.
 */
const RAIL_SPEED = 34;

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
   * The ring is what separates a card from the section: five of the fifteen are
   * near-black on black and would otherwise have no edge at all. The halo under
   * it is green rather than black, because a black drop shadow on a black band
   * is nothing — the colour is the only thing that can lift a card off it.
   */
  const shell = (index: number): CSSProperties => ({
    position: "relative",
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginRight: CARD_GAP,
    borderRadius: 40,
    background: GROUNDS[index],
    boxShadow:
      "0 0 0 1px rgba(255,255,255,.14), 0 30px 64px -34px color-mix(in srgb, var(--color-primary-green) 55%, transparent)",
    overflow: "hidden",
    flexShrink: 0,
  });

  return (
    // Black, so the cards read as lit objects rather than panels on a board —
    // the white ones glow and the near-black ones are held by their ring alone.
    // The whole section is set in the display face: the cards were drawn in it
    // and their headlines are tuned to its widths.
    <section
      ref={sectionRef}
      style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}
      className="w-full overflow-hidden bg-black pb-[32px] pt-[76px] lg:pb-[60px] lg:pt-[96px]"
    >
      <Ramps />

      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[40px]">
        <div className="related-head flex w-full flex-wrap items-end justify-between gap-[18px]">
          <h2 className="text-[clamp(2.2rem,4.4vw,60px)] font-bold leading-[0.95] tracking-[-0.055em] text-white">
            {currentSlug ? "Other " : "What we "}
            <span style={{ color: "var(--color-primary-green)" }}>build</span>
          </h2>
          <p className="font-body text-[15px] leading-none tracking-[-0.1px] text-white/55 lg:text-[17px]">
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
              const Body = BODIES[card.index];

              /** Scale the 720-coordinate artwork into the shorter container. */
              const inner = (
                <div style={{ width: CARD_WIDTH, height: 720, transformOrigin: "top left", transform: `scaleY(${CARD_HEIGHT / 720})`, position: "relative" }}>
                  <Body />
                </div>
              );

              // The copies behind the first exist to cover the loop. Putting
              // every service into the tab order twice, and having a screen
              // reader announce the whole row twice, is not worth that.
              if (copy > 0) {
                return (
                  <div
                    key={`${copy}-${card.index}`}
                    aria-hidden
                    className="related-card"
                    style={shell(card.index)}
                  >
                    {inner}
                  </div>
                );
              }

              return (
                <Link
                  key={`${copy}-${card.index}`}
                  href={`/services/${card.slug}`}
                  title={card.label}
                  className="related-card"
                  style={shell(card.index)}
                >
                  {inner}
                </Link>
              );
            }),
          )}
        </div>
      </div>
    </section>
  );
}
