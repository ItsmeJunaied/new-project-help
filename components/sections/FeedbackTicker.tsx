"use client";

import Image from "next/image";
import { useRef } from "react";
import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";
import { REVIEWS, type Review } from "@/lib/testimonials";

type Badge =
  | { kind: "logo"; src: string; alt: string; width: number; height: number }
  | {
      kind: "rating";
      score: string;
      src: string;
      alt: string;
      width: number;
      height: number;
    };

type FeedbackCard = {
  id: string;
  badge: Badge | null;
  lines: string[];
  category: string;
  author: { name: string; bio?: string; avatar?: string };
  tone: "grey" | "white";
};

// Eleven review cards used to live here, attributed to named people and set on
// Clutch and Behance logos. None of the reviews existed on either platform and
// none of the people were real clients. Both lists now come from
// lib/testimonials.ts, which ships empty on purpose — see the note there.
// Split into two marquee rows that scroll in opposite directions.
const ROW_ONE: FeedbackCard[] = REVIEWS.filter((_, i) => i % 2 === 0).map(toCard);
const ROW_TWO: FeedbackCard[] = REVIEWS.filter((_, i) => i % 2 === 1).map(toCard);

function toCard(review: Review): FeedbackCard {
  return {
    id: review.id,
    badge: review.platform
      ? review.rating
        ? { kind: "rating", score: review.rating.toFixed(1), ...review.platform }
        : { kind: "logo", ...review.platform }
      : null,
    lines: [review.title, review.body].filter(Boolean) as string[],
    category: review.title ?? "",
    author: review.author,
    tone: "grey",
  };
}

function BadgeMark({ badge }: { badge: Badge }) {
  const mark = (
    <Image
      src={badge.src}
      alt={badge.alt}
      width={Math.round(badge.width)}
      height={Math.round(badge.height)}
      className="object-contain"
      style={{ width: badge.width, height: badge.height }}
    />
  );

  if (badge.kind === "logo") return mark;

  return (
    <span className="flex items-center gap-[5px]">
      <span className="font-display text-[14px] font-semibold leading-none text-[#17313b]">
        {badge.score}
      </span>
      {mark}
    </span>
  );
}

function Card({ card }: { card: FeedbackCard }) {
  return (
    <div className="flex h-full shrink-0 flex-col items-start justify-center pr-[16px]">
      <div
        className={`feedback-card flex h-full w-[422.2px] shrink-0 flex-col items-start justify-between rounded-[14px] p-[14px] ${
          card.tone === "white" ? "bg-white" : "bg-[#eee]"
        }`}
      >
        <div className="flex w-full flex-col items-start gap-[10px] pt-[6.96px]">
          {card.badge && (
            <div className="flex max-h-[21.08px] items-center justify-center rounded-[19.93px] border border-black/10 px-[8px] py-[4.04px]">
              <BadgeMark badge={card.badge} />
            </div>
          )}

          <div className="h-px w-full bg-[rgba(10,10,10,0.1)]" />

          <p className="w-full pb-[3px] pt-[4px] font-body text-[16px] leading-[24px] tracking-[-0.16px] text-[#0a0a0a]">
            {card.lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>

          {card.category && (
            <div className="flex items-start rounded-[20px] border border-black/10 px-[8px] py-[5px]">
              <span className="whitespace-nowrap font-body text-[10px] font-medium leading-[11px] tracking-[-0.4px] text-[#0a0a0a]">
                {card.category}
              </span>
            </div>
          )}
        </div>

        <div className="flex w-full items-center gap-[8px]">
          <div className="relative flex size-[35px] shrink-0 items-center justify-center overflow-clip rounded-[17.5px] bg-[#dcdcdc]">
            {card.author.avatar ? (
              <Image
                src={card.author.avatar}
                alt={`${card.author.name} portrait`}
                fill
                sizes="35px"
                className="object-cover"
              />
            ) : (
              <span className="font-body text-[12px] font-semibold leading-none text-[#3f3f46]">
                {card.author.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </span>
            )}
          </div>
          <div className="flex flex-col items-start">
            <span className="whitespace-nowrap font-body text-[12px] font-semibold leading-[16.8px] tracking-[-0.113px] text-[#0a0a0a]">
              {card.author.name}
            </span>
            {card.author.bio ? (
              <span className="whitespace-nowrap font-body text-[10px] leading-[15px] tracking-[-0.1px] text-[#3f3f46]">
                {card.author.bio}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({
  cards,
  trackRef,
}: {
  cards: FeedbackCard[];
  trackRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="h-[262px] w-full">
      <div ref={trackRef} className="flex h-full w-max items-stretch will-change-transform">
        {[0, 1].map((set) => (
          <div key={set} className="flex h-full items-stretch" aria-hidden={set === 1}>
            {cards.map((card) => (
              <Card key={`${set}-${card.id}`} card={card} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

type FeedbackTickerProps = {
  /** Outer margins — the detail pages sit this band away from its neighbours. */
  spacingClassName?: string;
};

/** Renders nothing until lib/testimonials.ts carries real reviews. */
export default function FeedbackTicker({ spacingClassName = "" }: FeedbackTickerProps) {
  if (REVIEWS.length === 0) return null;
  return <FeedbackTickerRows spacingClassName={spacingClassName} />;
}

function FeedbackTickerRows({ spacingClassName = "" }: FeedbackTickerProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const top = topRef.current;
      const bottom = bottomRef.current;
      const section = sectionRef.current;
      if (!top || !bottom || !section) return;

      // A pair of never-ending marquees is the clearest case for honouring the
      // reduce-motion setting: the cards stay put and stay readable.
      if (prefersReducedMotion()) {
        gsap.set(bottom, { xPercent: -50 });
        return;
      }

      // Each track holds two identical sets, so shifting by exactly half its
      // width loops seamlessly. The two rows drift past each other.
      const loops = [
        gsap.fromTo(
          top,
          { xPercent: 0 },
          { xPercent: -50, duration: 40, ease: "none", repeat: -1 },
        ),
        gsap.fromTo(
          bottom,
          { xPercent: -50 },
          { xPercent: 0, duration: 46, ease: "none", repeat: -1 },
        ),
      ];

      const setSpeed = (timeScale: number) => () => {
        loops.forEach((loop) => gsap.to(loop, { timeScale, duration: 0.4 }));
      };
      const slow = setSpeed(0.25);
      const resume = setSpeed(1);

      section.addEventListener("pointerenter", slow);
      section.addEventListener("pointerleave", resume);

      // Scrolling drags the rows along: fast scrolling speeds the loop up and
      // scrolling back up reverses it, then it eases back to its idle drift.
      const velocityTrigger = ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          const boost = gsap.utils.clamp(-3, 3, 1 + self.getVelocity() / 900);
          loops.forEach((loop) => {
            gsap.to(loop, {
              timeScale: boost,
              duration: 0.3,
              overwrite: true,
              onComplete: () => {
                gsap.to(loop, { timeScale: 1, duration: 1.2, overwrite: true });
              },
            });
          });
        },
      });

      // Cards lift in as the band first enters the viewport.
      gsap.from(section.querySelectorAll(".feedback-card"), {
        y: 32,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.04,
        scrollTrigger: reveal(section, { start: "top 90%" }),
      });

      return () => {
        section.removeEventListener("pointerenter", slow);
        section.removeEventListener("pointerleave", resume);
        velocityTrigger.kill();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-node-id="156:7018"
      className={`relative flex w-full items-center overflow-hidden bg-bg py-[60px] lg:h-[540px] lg:py-0 ${spacingClassName}`}
    >
      <div className="relative flex w-full flex-col gap-[16px]">
        <Row cards={ROW_ONE} trackRef={topRef} />
        <Row cards={ROW_TWO} trackRef={bottomRef} />

        <div className="pointer-events-none absolute inset-y-0 left-0 w-[120px] bg-gradient-to-r from-bg to-transparent lg:w-[288px]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[120px] bg-gradient-to-l from-bg to-transparent lg:w-[288px]" />
      </div>
    </section>
  );
}
