"use client";

import Image from "next/image";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/anim";
import Logo from "@/components/ui/Logo";
import { BrandMark } from "@/components/ui/BrandIcons";
import TechMark, { techLabel, type TechName } from "@/components/ui/TechMarks";
import { PILLARS, techMarkFor } from "@/lib/stack";
import { CLIENTS } from "@/lib/clients";
import { siteConfig } from "@/lib/site";
import {
  PROFILE_CONTACT,
  PROFILE_EDITION,
  PROFILE_FIGURES,
  PROFILE_HANDOVER,
  PROFILE_IMAGERY,
  PROFILE_INDUSTRIES,
  PROFILE_PROCESS,
  PROFILE_REASONS,
  PROFILE_SERVICES,
  PROFILE_SLIDE_COUNT,
  PROFILE_SLIDES,
  PROFILE_WORK,
  slidePosition,
} from "@/lib/company-profile";

/**
 * The company profile, drawn as a 16:9 deck.
 *
 * Every slide is one `.deck-frame`, which is both what you scroll through and
 * what comes out of the printer — the stylesheet turns the frame into a page
 * box at print time, so "Download PDF" is the browser's own print dialogue
 * rather than a second artefact that can fall behind the site.
 *
 * The slides stack rather than scroll past: each is sticky, so the next rides
 * up over the last and the deck reads as a pile of cards being dealt. The only
 * thing the scroll drives is the scale and dimming of the card underneath — no
 * content fades in, because a `from` tween on opacity leaves the page blank if
 * its trigger never fires, and this document has to be readable in a print
 * preview and with JavaScript halfway through loading.
 *
 * Three rules hold the design together, and every slide below obeys them:
 *
 *   1. One paper colour. White, all the way through. Alternating dark and
 *      brand-coloured pages is how a website reads section by section, and it
 *      is what made an earlier draft of this deck look like screenshots.
 *   2. The furniture never moves. Pill top-left, rule and page number at the
 *      foot, in the same place on all fifteen pages.
 *   3. Photographs illustrate the company, never the work. The case study
 *      slides carry type, hairline grids and figures and nothing else — which
 *      is what the reference deck does, and it keeps placeholder renders out
 *      of a document that goes to prospects.
 */

const two = (n: number) => String(n).padStart(2, "0");

/**
 * The soft shapes bleeding off the corners.
 *
 * Four arrangements, picked by the slide's position so the deck varies without
 * anyone choosing per slide — the reference does the same thing, and the point
 * of it is that no two consecutive pages carry weight in the same corner.
 * Sizes are design pixels applied as inline custom-property arithmetic rather
 * than class names: Tailwind generates CSS by scanning source text for whole
 * class strings, so a size composed at runtime would produce no rule at all.
 */
type Blob = {
  tint: 1 | 2 | 3 | 4;
  size: number;
  x: ["left" | "right", number];
  y: ["top" | "bottom", number];
};

const DECOR: Blob[][] = [
  [
    { tint: 1, size: 300, x: ["right", -120], y: ["top", -130] },
    { tint: 3, size: 190, x: ["left", -90], y: ["bottom", -70] },
    { tint: 2, size: 120, x: ["right", 150], y: ["bottom", -50] },
  ],
  [
    { tint: 2, size: 340, x: ["right", -150], y: ["bottom", -140] },
    { tint: 1, size: 130, x: ["right", 210], y: ["top", -60] },
    { tint: 4, size: 220, x: ["left", -110], y: ["top", 120] },
  ],
  [
    { tint: 3, size: 260, x: ["right", -110], y: ["bottom", 40] },
    { tint: 1, size: 150, x: ["left", -70], y: ["bottom", -60] },
    { tint: 2, size: 190, x: ["right", 120], y: ["top", -110] },
  ],
  [
    { tint: 1, size: 220, x: ["right", -90], y: ["top", 160] },
    { tint: 2, size: 280, x: ["left", -140], y: ["bottom", -120] },
    { tint: 4, size: 150, x: ["right", 240], y: ["bottom", -60] },
  ],
];

const TINT: Record<Blob["tint"], string> = {
  1: "deck-tint--1",
  2: "deck-tint--2",
  3: "deck-tint--3",
  4: "deck-tint--4",
};

function Decor({ index }: { index: number }) {
  const blobs = DECOR[index % DECOR.length];

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      {blobs.map((blob, i) => (
        <span
          key={i}
          className={`deck-blob ${TINT[blob.tint]}`}
          style={
            {
              width: `calc(${blob.size} * var(--k))`,
              height: `calc(${blob.size} * var(--k))`,
              [blob.x[0]]: `calc(${blob.x[1]} * var(--k))`,
              [blob.y[0]]: `calc(${blob.y[1]} * var(--k))`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function Slide({
  id,
  chrome = true,
  children,
}: {
  id: string;
  chrome?: boolean;
  children: ReactNode;
}) {
  const slide = PROFILE_SLIDES.find((entry) => entry.id === id);
  const position = slidePosition(id);

  return (
    <div className="deck-stack-item" style={{ zIndex: position } as CSSProperties}>
      <section id={id} aria-label={slide?.title} className="profile-slide deck-frame">
        <div className="deck-slide">
          <Decor index={position - 1} />

          <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
            {chrome ? <p className="deck-pill">{slide?.eyebrow}</p> : null}

            {children}

            {chrome ? (
              <div className="deck-footer">
                <span className="deck-micro">
                  {siteConfig.name} &middot; Company Profile {PROFILE_EDITION}
                </span>
                <span className="deck-micro">
                  {two(position)} / {two(PROFILE_SLIDE_COUNT)}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="deck-veil" aria-hidden />
      </section>
    </div>
  );
}

/** Heading and its grey descriptor, in the one place they ever appear. */
function Head({
  title,
  note,
}: {
  title: ReactNode;
  note?: string;
}) {
  return (
    <div className="mt-[calc(20*var(--k))] max-lg:mt-4">
      <h2 className="deck-h2">{title}</h2>
      {note ? (
        <p className="deck-note mt-[calc(10*var(--k))] max-lg:mt-2">{note}</p>
      ) : null}
    </div>
  );
}

/** Everything under the heading, filling what is left of the canvas. */
function Body({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mt-[calc(24*var(--k))] flex min-h-0 flex-1 flex-col max-lg:mt-6 ${className}`}
    >
      {children}
    </div>
  );
}

/** A caption over a block — "Technology used", "What made it hard". */
function Cap({ children }: { children: ReactNode }) {
  return <p className="deck-cap mb-[calc(11*var(--k))] max-lg:mb-3">{children}</p>;
}

/** The tinted figure callout: the one place a statistic is allowed to shout. */
function Stat({
  figure,
  label,
  sub,
}: {
  figure: string;
  label: string;
  sub?: string;
}) {
  return (
    <div className="deck-stat">
      <span className="deck-figure shrink-0">{figure}</span>
      <span className="min-w-0">
        <span className="deck-h4 block">{label}</span>
        {sub ? (
          <span className="deck-note mt-[calc(4*var(--k))] block">{sub}</span>
        ) : null}
      </span>
    </div>
  );
}

/**
 * One cell of a hairline grid: the mark where we have one, the name where we
 * do not — which is how the reference deck's own grids behave.
 */
function TechCell({ name }: { name: string }) {
  const mark = techMarkFor(name);

  return (
    <span>
      {mark ? (
        <TechMark
          name={mark}
          className="size-[calc(16*var(--k))] shrink-0 max-lg:size-[18px]"
        />
      ) : null}
      <span className="min-w-0 truncate">{name}</span>
    </span>
  );
}

/** The four pillars' tools, de-duplicated, in pillar order. */
const STACK_TOOLS: TechName[] = Array.from(
  new Set(PILLARS.flatMap((pillar) => pillar.tools)),
);

/**
 * Blank cells to finish the last row of the four-across tool grid. A grid
 * shows its own background through the cells it has no children for, and the
 * background here is the hairline colour — so a short final row prints as a
 * solid grey block rather than as two tools.
 */
const PAD_STACK = Array.from(
  { length: (4 - (STACK_TOOLS.length % 4)) % 4 },
  (_, i) => i,
);

export default function ProfileDeck() {
  const deckRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      // The stack is a sticky effect; below lg the slides are in flow, and
      // scaling a card that nothing covers would just read as a glitch.
      if (!window.matchMedia("(min-width: 1024px)").matches) return;

      const items = gsap.utils.toArray<HTMLElement>(".deck-stack-item");

      items.forEach((item, index) => {
        const next = items[index + 1];
        if (!next) return;

        const frame = item.querySelector<HTMLElement>(".deck-frame");
        const veil = item.querySelector<HTMLElement>(".deck-veil");

        // One range, shared: from the moment the next card appears at the
        // bottom of the window to the moment it has covered this one.
        const trigger = {
          trigger: next,
          start: "top bottom",
          end: "top top",
          scrub: true,
        } as const;

        gsap.to(frame, {
          scale: 0.93,
          ease: "none",
          transformOrigin: "center top",
          scrollTrigger: trigger,
        });

        gsap.to(veil, { opacity: 0.45, ease: "none", scrollTrigger: trigger });
      });
    },
    { scope: deckRef },
  );

  return (
    <div ref={deckRef} className="deck-stack">
      {/* ---------------------------------------------------------------- 01 */}
      <Slide id="cover" chrome={false}>
        <div className="flex items-center justify-between gap-[calc(24*var(--k))]">
          <div className="flex items-center gap-[calc(11*var(--k))]">
            <BrandMark className="size-[calc(30*var(--k))] rounded-[calc(7*var(--k))] max-lg:size-[30px] max-lg:rounded-[7px]" />
            <Logo className="h-[calc(27*var(--k))] w-auto text-black max-lg:h-[26px]" />
          </div>
          <p className="deck-pill">Company Profile {PROFILE_EDITION}</p>
        </div>

        <div className="mt-[calc(48*var(--k))] max-w-[calc(900*var(--k))] max-lg:mt-8 max-lg:max-w-none">
          <h1 className="deck-h1">
            We build the software.
            <br />
            You <span className="deck-mark">own</span> every commit.
          </h1>
          <p className="deck-lead mt-[calc(20*var(--k))] max-w-[calc(640*var(--k))] max-lg:mt-4 max-lg:max-w-none">
            {siteConfig.tagline} in {siteConfig.address.locality}, working with
            product teams worldwide.
          </p>
        </div>

        {/* The cover band: three photographs and two figures, cut to the same
            rhythm as the reference cover's mosaic. */}
        <div className="mt-auto grid grid-cols-5 gap-[calc(12*var(--k))] pt-[calc(28*var(--k))] max-lg:mt-8 max-lg:grid-cols-2 max-lg:gap-3 max-lg:pt-0">
          <div className="deck-photo col-span-2 h-[calc(178*var(--k))] max-lg:col-span-2 max-lg:h-[180px]">
            <Image
              src={PROFILE_IMAGERY.cover}
              alt="The Project Help studio at work"
              fill
              sizes="(max-width: 1023px) 100vw, 40vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col gap-[calc(12*var(--k))] max-lg:gap-3">
            <div className="deck-card--tint flex flex-1 flex-col justify-center rounded-[calc(12*var(--k))] px-[calc(16*var(--k))] py-[calc(12*var(--k))] max-lg:rounded-[12px] max-lg:p-4">
              <span className="deck-figure">{PROFILE_FIGURES[1].figure}</span>
              <span className="deck-note mt-[calc(6*var(--k))]">
                {PROFILE_FIGURES[1].label}
              </span>
            </div>
            <div className="deck-card flex flex-1 flex-col justify-center rounded-[calc(12*var(--k))] px-[calc(16*var(--k))] py-[calc(12*var(--k))] max-lg:rounded-[12px] max-lg:p-4">
              <span className="deck-figure">{PROFILE_FIGURES[2].figure}</span>
              <span className="deck-note mt-[calc(6*var(--k))]">
                {PROFILE_FIGURES[2].label}
              </span>
            </div>
          </div>

          <div className="deck-photo h-[calc(178*var(--k))] max-lg:h-[150px]">
            <Image
              src={PROFILE_IMAGERY.process}
              alt="A planning session in progress"
              fill
              sizes="(max-width: 1023px) 50vw, 20vw"
              className="object-cover"
            />
          </div>

          <div className="deck-photo h-[calc(178*var(--k))] max-lg:h-[150px]">
            <Image
              src={PROFILE_IMAGERY.capabilities}
              alt="Engineering tools on screen"
              fill
              sizes="(max-width: 1023px) 50vw, 20vw"
              className="object-cover"
            />
          </div>
        </div>
      </Slide>

      {/* ---------------------------------------------------------------- 02 */}
      <Slide id="at-a-glance">
        <Head
          title={
            <>
              A small studio that <span className="deck-mark">ships</span>, not a
              body shop that bills.
            </>
          }
          note={`Founded ${siteConfig.founded} in ${siteConfig.address.locality}, ${siteConfig.address.countryName}.`}
        />

        <Body className="gap-[calc(20*var(--k))] max-lg:gap-6">
          <div className="grid grid-cols-4 gap-[calc(12*var(--k))] max-lg:grid-cols-2 max-lg:gap-3">
            {PROFILE_FIGURES.map((entry, index) => (
              <div
                key={entry.label}
                className={`${index === 0 ? "deck-card--tint" : "deck-card"} rounded-[calc(12*var(--k))] px-[calc(18*var(--k))] py-[calc(14*var(--k))] max-lg:rounded-[12px] max-lg:p-4`}
              >
                <span className="deck-figure">{entry.figure}</span>
                <span className="deck-note mt-[calc(8*var(--k))] block">
                  {entry.label}
                </span>
              </div>
            ))}
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-[1fr_calc(420*var(--k))] gap-[calc(28*var(--k))] max-lg:grid-cols-1 max-lg:gap-5">
            <div className="flex flex-col justify-center gap-[calc(13*var(--k))] max-lg:gap-3">
              <p className="deck-body">
                We are a product studio, not an agency with a sales floor. The
                engineers who scope your build are the engineers who write it,
                which is the whole reason a fixed price and a fixed date can
                survive contact with the work.
              </p>
              <p className="deck-body">
                Everything in this document is drawn from the same records the
                website publishes — the same projects, the same stack, the same
                numbers. If one changes, both change.
              </p>
            </div>

            <div className="deck-photo max-lg:h-[200px]">
              <Image
                src={PROFILE_IMAGERY.sectors}
                alt="The team working together at a desk"
                fill
                sizes="(max-width: 1023px) 100vw, 34vw"
                className="object-cover"
              />
            </div>
          </div>
        </Body>
      </Slide>

      {/* ---------------------------------------------------------------- 03 */}
      <Slide id="what-we-build">
        <Head
          title="Seven things we build, and what we build them with."
          note="Every service below is one we have shipped and still support."
        />

        <Body className="grid grid-cols-[1fr_calc(380*var(--k))] gap-[calc(32*var(--k))] max-lg:grid-cols-1 max-lg:gap-6">
          <div className="grid grid-cols-2 content-start gap-x-[calc(24*var(--k))] gap-y-[calc(15*var(--k))] max-lg:gap-x-4 max-lg:gap-y-4">
            {PROFILE_SERVICES.map((service) => (
              <div
                key={service.slug}
                className="flex gap-[calc(11*var(--k))] max-lg:gap-3"
              >
                <span
                  aria-hidden
                  className="deck-tint--1 mt-[calc(4*var(--k))] size-[calc(13*var(--k))] shrink-0 rounded-[calc(4*var(--k))] max-lg:size-[13px]"
                />
                <span className="min-w-0">
                  <span className="deck-h4 block">{service.shortTitle}</span>
                  <span className="deck-note mt-[calc(4*var(--k))] block">
                    {service.included[0]}
                  </span>
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col">
            <Cap>Technology we use</Cap>
            <div className="deck-grid grid-cols-4">
              {STACK_TOOLS.map((tool) => (
                <span key={tool}>
                  <TechMark
                    name={tool}
                    className="size-[calc(20*var(--k))] max-lg:size-[22px]"
                  />
                  <span className="sr-only">{techLabel(tool)}</span>
                </span>
              ))}
              {PAD_STACK.map((n) => (
                <span key={`pad-${n}`} />
              ))}
            </div>
          </div>
        </Body>
      </Slide>

      {/* ---------------------------------------------------------------- 04 */}
      <Slide id="industries">
        <Head
          title="Where the work has actually shipped."
          note="Delivered projects by sector, across the whole portfolio."
        />

        <Body className="grid grid-cols-[1fr_calc(340*var(--k))] gap-[calc(34*var(--k))] max-lg:grid-cols-1 max-lg:gap-6">
          <div className="flex min-h-0 flex-col">
            <div className="deck-chart min-h-0 flex-1 max-lg:h-[220px]">
              {PROFILE_INDUSTRIES.map((industry, index) => {
                // Nine is the tallest column in the set; every other column is
                // drawn as a fraction of it, so the chart is the data.
                const height = `${(Number(industry.count) / 9) * 100}%`;

                return (
                  <span key={industry.name} className="deck-chart-col">
                    <span className="deck-h4">{industry.count}</span>
                    <span className="deck-chart-track">
                      <span
                        className={`deck-chart-bar${index % 2 === 1 ? " deck-chart-bar--quiet" : ""}`}
                        style={{ height }}
                      />
                    </span>
                  </span>
                );
              })}
            </div>

            <div className="deck-rule mt-[calc(10*var(--k))]" />

            <div className="deck-chart mt-[calc(10*var(--k))] items-start">
              {PROFILE_INDUSTRIES.map((industry) => (
                <span key={industry.name} className="deck-chart-col">
                  <span className="deck-h4 text-center">{industry.name}</span>
                  <span className="deck-note text-center">{industry.note}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-[calc(14*var(--k))] max-lg:gap-4">
            <div className="deck-photo min-h-0 flex-1 max-lg:h-[200px]">
              <Image
                src={PROFILE_IMAGERY.sectors}
                alt="The team reviewing work in progress"
                fill
                sizes="(max-width: 1023px) 100vw, 28vw"
                className="object-cover"
              />
            </div>
            <p className="deck-body">
              Different sectors, one pattern: a catalogue or a caseload, a set
              of rules nobody has written down, and an operations team finding
              out too late. That is the problem we are usually hired to fix.
            </p>
          </div>
        </Body>
      </Slide>

      {/* ---------------------------------------------------------------- 05 */}
      <Slide id="stack">
        <Head
          title="One stack, all the way down."
          note="The screen, the logic behind it, the data under that, and the platform it runs on."
        />

        <Body className="grid grid-cols-4 gap-[calc(16*var(--k))] max-lg:grid-cols-1 max-lg:gap-4">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.id}
              className="deck-card--line flex flex-col rounded-[calc(12*var(--k))] p-[calc(17*var(--k))] max-lg:rounded-[12px] max-lg:p-4"
            >
              <span className="deck-micro">{pillar.number}</span>
              <span className="deck-h4 mt-[calc(9*var(--k))] block">
                {pillar.name}
              </span>
              <span className="deck-note mt-[calc(6*var(--k))] block">
                {pillar.purpose}
              </span>

              <div className="mt-[calc(14*var(--k))] flex flex-wrap gap-[calc(7*var(--k))] max-lg:mt-4">
                {pillar.tools.map((tool) => (
                  <span
                    key={tool}
                    className="deck-tint--3 flex size-[calc(28*var(--k))] items-center justify-center rounded-[calc(8*var(--k))] max-lg:size-[34px] max-lg:rounded-[8px]"
                  >
                    <TechMark
                      name={tool}
                      className="size-[calc(16*var(--k))] max-lg:size-[19px]"
                    />
                    <span className="sr-only">{techLabel(tool)}</span>
                  </span>
                ))}
              </div>

              <ul className="deck-list mt-auto pt-[calc(15*var(--k))] max-lg:pt-4">
                {pillar.delivers.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </Body>
      </Slide>

      {/* ---------------------------------------------------------------- 06 */}
      <Slide id="process">
        <Head
          title="How an engagement runs."
          note="Four steps, and you can stop us at the end of any of them."
        />

        <Body className="gap-[calc(18*var(--k))] max-lg:gap-5">
          <div className="grid grid-cols-4 gap-[calc(14*var(--k))] max-lg:grid-cols-1 max-lg:gap-4">
            {PROFILE_PROCESS.map((step, index) => (
              <div
                key={step.number}
                className={`${index === 0 ? "deck-card--tint" : "deck-card"} rounded-[calc(12*var(--k))] p-[calc(17*var(--k))] max-lg:rounded-[12px] max-lg:p-4`}
              >
                <span className="deck-micro">Step {step.number}</span>
                <span className="deck-h4 mt-[calc(9*var(--k))] block">
                  {step.title}
                </span>
                <span className="deck-note mt-[calc(7*var(--k))] block">
                  {step.copy}
                </span>
              </div>
            ))}
          </div>

          <div className="deck-photo min-h-0 flex-1 max-lg:h-[180px]">
            <Image
              src={PROFILE_IMAGERY.process}
              alt="A project kick-off meeting"
              fill
              sizes="(max-width: 1023px) 100vw, 78vw"
              className="object-cover object-center"
            />
          </div>
        </Body>
      </Slide>

      {/* ---------------------------------------------------------------- 07 */}
      <Slide id="handover">
        <Head
          title={
            <>
              What you are <span className="deck-mark">left holding</span>.
            </>
          }
          note="Handed over as the build runs, not assembled in the last week of it."
        />

        <Body className="grid grid-cols-3 grid-rows-2 gap-[calc(14*var(--k))] max-lg:grid-cols-1 max-lg:grid-rows-none max-lg:gap-4">
          {PROFILE_HANDOVER.map((item, index) => (
            <div
              key={item.title}
              className="deck-card--line flex flex-col rounded-[calc(12*var(--k))] p-[calc(17*var(--k))] max-lg:rounded-[12px] max-lg:p-4"
            >
              <span className="deck-micro">{two(index + 1)}</span>
              <span className="deck-h4 mt-[calc(9*var(--k))] block">
                {item.title}
              </span>
              <span className="deck-note mt-[calc(7*var(--k))] block">
                {item.copy}
              </span>
            </div>
          ))}
        </Body>
      </Slide>

      {/* ------------------------------------------------------------- 08-12 */}
      {PROFILE_WORK.map((work) => {
        const headline = work.outcomes[0];

        return (
          <Slide key={work.slug} id={`work-${work.slug}`}>
            <Head title={work.title} note={work.descriptor} />

            <Body className="grid grid-cols-[calc(440*var(--k))_1fr] gap-[calc(34*var(--k))] max-lg:grid-cols-1 max-lg:gap-6">
              <div className="flex min-h-0 flex-col">
                <p className="deck-body">{work.summary}</p>

                <div className="mt-auto pt-[calc(18*var(--k))] max-lg:mt-6 max-lg:pt-0">
                  <Cap>Technology used</Cap>
                  <div className="deck-grid grid-cols-3">
                    {work.stack.map((name) => (
                      <TechCell key={name} name={name} />
                    ))}
                    {/* Three across; a five-item stack leaves one cell over,
                        and an empty one keeps the rule square. */}
                    {work.stack.length % 3 === 2 ? <span /> : null}
                  </div>
                </div>
              </div>

              <div className="flex min-h-0 flex-col gap-[calc(16*var(--k))] max-lg:gap-5">
                <Stat
                  figure={headline.value}
                  label={headline.label}
                  sub={headline.copy}
                />

                <div className="min-h-0 flex-1">
                  <Cap>What made it hard</Cap>
                  <ul className="deck-list">
                    {work.issues.map((issue) => (
                      <li key={issue.lead || issue.rest}>
                        {issue.lead ? <b>{issue.lead}. </b> : null}
                        {issue.rest}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-3 gap-[calc(12*var(--k))] max-lg:gap-3">
                  {work.outcomes.slice(1).map((outcome) => (
                    <div
                      key={outcome.label}
                      className="deck-card rounded-[calc(10*var(--k))] px-[calc(14*var(--k))] py-[calc(11*var(--k))] max-lg:rounded-[10px] max-lg:p-3"
                    >
                      <span className="deck-h3 block">{outcome.value}</span>
                      <span className="deck-note mt-[calc(4*var(--k))] block">
                        {outcome.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Body>
          </Slide>
        );
      })}

      {/* ---------------------------------------------------------------- 13 */}
      <Slide id="clients">
        <Head
          title="Who we build for."
          note="Named with their permission. The rest of the portfolio is under agreement."
        />

        <Body className="grid grid-cols-[1fr_calc(420*var(--k))] gap-[calc(34*var(--k))] max-lg:grid-cols-1 max-lg:gap-6">
          <div className="flex min-h-0 flex-col">
            <div className="deck-grid grid-cols-3">
              {CLIENTS.map((client) => (
                <span
                  key={client.name}
                  className="min-h-[calc(126*var(--k))] max-lg:min-h-[110px]"
                >
                  <Image
                    src={client.src}
                    alt={client.name}
                    width={client.width}
                    height={client.height}
                    className="h-[calc(44*var(--k))] w-auto object-contain max-lg:h-[42px]"
                  />
                </span>
              ))}
            </div>

            <p className="deck-body mt-[calc(20*var(--k))] max-lg:mt-5">
              Three names we are allowed to print, out of{" "}
              {PROFILE_FIGURES[1].figure} delivered projects. The work on the
              pages before this one is published in full on the website, with
              the same figures it carries here.
            </p>
          </div>

          <div className="deck-photo max-lg:h-[200px]">
            <Image
              src={PROFILE_IMAGERY.clients}
              alt="Signing off a project with a client"
              fill
              sizes="(max-width: 1023px) 100vw, 34vw"
              className="object-cover"
            />
          </div>
        </Body>
      </Slide>

      {/* ---------------------------------------------------------------- 14 */}
      <Slide id="why-us">
        <Head
          title={
            <>
              Five reasons teams <span className="deck-mark">stay</span>.
            </>
          }
          note="Each one is a term of the engagement, not a sentiment about it."
        />

        <Body className="grid grid-cols-2 content-start gap-x-[calc(34*var(--k))] gap-y-[calc(17*var(--k))] max-lg:grid-cols-1 max-lg:gap-5">
          {PROFILE_REASONS.map((reason) => (
            <div
              key={reason.number}
              className="flex gap-[calc(14*var(--k))] max-lg:gap-4"
            >
              <span className="deck-h3 shrink-0 opacity-25">{reason.number}</span>
              <span className="min-w-0">
                <span className="deck-h4 block">{reason.title}</span>
                <span className="deck-note mt-[calc(6*var(--k))] block">
                  {reason.copy}
                </span>
              </span>
            </div>
          ))}
        </Body>
      </Slide>

      {/* ---------------------------------------------------------------- 15 */}
      <Slide id="contact" chrome={false}>
        <div className="flex items-center justify-between gap-[calc(24*var(--k))]">
          <div className="flex items-center gap-[calc(11*var(--k))]">
            <BrandMark className="size-[calc(30*var(--k))] rounded-[calc(7*var(--k))] max-lg:size-[30px] max-lg:rounded-[7px]" />
            <Logo className="h-[calc(27*var(--k))] w-auto text-black max-lg:h-[26px]" />
          </div>
          <p className="deck-pill">Next step</p>
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-[1fr_calc(460*var(--k))] items-end gap-[calc(40*var(--k))] pt-[calc(36*var(--k))] max-lg:mt-8 max-lg:grid-cols-1 max-lg:gap-8 max-lg:pt-0">
          <div>
            <h2 className="deck-h1">
              Tell us what
              <br />
              <span className="deck-mark">breaks first</span>.
            </h2>
            <p className="deck-lead mt-[calc(18*var(--k))] max-w-[calc(500*var(--k))] max-lg:mt-4 max-lg:max-w-none">
              A thirty-minute call, and no deck from us. You describe the
              problem, we tell you what it would take — whether or not that is
              us.
            </p>
          </div>

          <div className="flex flex-col gap-[calc(9*var(--k))] max-lg:gap-3">
            {PROFILE_CONTACT.map((row) => (
              <div
                key={row.label}
                className="deck-card--line flex items-baseline gap-[calc(14*var(--k))] rounded-[calc(10*var(--k))] px-[calc(16*var(--k))] py-[calc(11*var(--k))] max-lg:rounded-[10px] max-lg:p-3"
              >
                <span className="deck-micro w-[calc(60*var(--k))] shrink-0 max-lg:w-[60px]">
                  {row.label}
                </span>
                <span className="deck-h4 min-w-0 break-words">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="deck-footer">
          <span className="deck-micro">
            {siteConfig.name} &middot; Company Profile {PROFILE_EDITION}
          </span>
          <span className="deck-micro">
            {two(PROFILE_SLIDE_COUNT)} / {two(PROFILE_SLIDE_COUNT)}
          </span>
        </div>
      </Slide>
    </div>
  );
}
