"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/anim";
import Logo from "@/components/ui/Logo";
import { BrandMark } from "@/components/ui/BrandIcons";
import TechMark, { techLabel } from "@/components/ui/TechMarks";
import WhatsAppMark from "@/components/ui/WhatsAppMark";
import { PILLARS } from "@/lib/stack";
import { CLIENTS } from "@/lib/clients";
import { siteConfig } from "@/lib/site";
import {
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
 */

const two = (n: number) => String(n).padStart(2, "0");

type Tone = "light" | "ink" | "green";

const FRAME_TONE: Record<Tone, string> = {
  light: "",
  ink: " deck-frame--ink",
  green: " deck-frame--green",
};

const SLIDE_TONE: Record<Tone, string> = {
  light: "",
  ink: " deck-slide--ink",
  green: " deck-slide--green",
};

/**
 * Content that runs to the edge of the slide, ignoring its padding.
 *
 * An absolutely positioned child is placed against its containing block's
 * PADDING box, and the slide is inset 0 inside the frame — so `inset-0` is
 * already the frame edge and pulling back by the padding would overshoot it on
 * every side. Below lg the slide is in flow and the bleed becomes an ordinary
 * block at the top of it.
 */
function Bleed({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

/*
 * The picture column on a case-study slide is 420 design pixels wide and the
 * copy leaves 402 beside it. 402 rather than 420 because the margin starts at
 * the slide's content box, which is already 58 in from the frame edge — so the
 * gap between picture and copy is 58 + 402 - 420 = 40.
 *
 * Written out as literal class names below, not composed from constants:
 * Tailwind generates CSS by scanning the source for whole class strings, and a
 * name assembled at runtime produces no rule at all.
 */

function Slide({
  id,
  tone = "light",
  bleed,
  contentClassName = "",
  furniture = true,
  children,
}: {
  id: string;
  tone?: Tone;
  bleed?: ReactNode;
  contentClassName?: string;
  furniture?: boolean;
  children: ReactNode;
}) {
  const slide = PROFILE_SLIDES.find((entry) => entry.id === id);
  const position = slidePosition(id);

  return (
    <div className="deck-stack-item" style={{ zIndex: position } as CSSProperties}>
      <section
        id={id}
        aria-label={slide?.title}
        className={`profile-slide deck-frame${FRAME_TONE[tone]}`}
      >
        <div className={`deck-slide${SLIDE_TONE[tone]}`}>
          {bleed}

          <div
            className={`relative z-[1] flex min-h-0 flex-1 flex-col ${contentClassName}`}
          >
            {furniture ? (
              <div className="flex shrink-0 flex-col gap-[var(--sp-2)] max-lg:gap-2">
                <div className="flex items-baseline justify-between gap-[var(--sp-3)]">
                  <p className="deck-eyebrow">{slide?.eyebrow}</p>
                  <p className="deck-eyebrow">
                    {two(position)}
                    <span className="opacity-45"> / {two(PROFILE_SLIDE_COUNT)}</span>
                  </p>
                </div>
                <div className="deck-rule" />
              </div>
            ) : null}

            {children}
          </div>
        </div>

        <div className="deck-veil" aria-hidden />
      </section>
    </div>
  );
}

/** Everything below the hairline, filling what is left of the canvas. */
function Body({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mt-[calc(26*var(--k))] flex min-h-0 flex-1 flex-col max-lg:mt-6 ${className}`}
    >
      {children}
    </div>
  );
}

function Statement({
  heading,
  lead,
  className = "",
}: {
  heading: ReactNode;
  lead?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <h2 className="deck-h2">{heading}</h2>
      {lead ? (
        <p className="deck-lead mt-[var(--sp-3)] max-lg:mt-3">{lead}</p>
      ) : null}
    </div>
  );
}

/** A numbered marker — the deck's counter for cards and steps. */
function Marker({ n, tone = "solid" }: { n: string; tone?: "solid" | "hollow" }) {
  return (
    <span
      className={`flex size-[calc(30*var(--k))] shrink-0 items-center justify-center rounded-full font-mono text-[calc(11*var(--k))] font-medium max-lg:size-[30px] max-lg:text-[11px] ${
        tone === "solid"
          ? "bg-primary-green text-black"
          : "border border-[var(--rule)]"
      }`}
    >
      {n}
    </span>
  );
}

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

        gsap.to(veil, { opacity: 0.5, ease: "none", scrollTrigger: trigger });
      });
    },
    { scope: deckRef },
  );

  return (
    <div ref={deckRef} className="deck-stack">
      {/* ---------------------------------------------------------------- 01 */}
      <Slide
        id="cover"
        tone="ink"
        furniture={false}
        bleed={
          <Bleed>
            <Image
              src={PROFILE_IMAGERY.cover}
              alt=""
              aria-hidden
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-40"
            />
            {/* Type sits on the lower half, so the picture is darkened from the
                bottom up rather than flattened everywhere. */}
            <div className="absolute inset-0 bg-[linear-gradient(to_top,#0a0a0a_18%,rgba(10,10,10,0.72)_54%,rgba(10,10,10,0.35)_100%)]" />
          </Bleed>
        }
      >
        <div className="flex min-h-0 flex-1 flex-col justify-between">
          <div className="flex items-start justify-between gap-[var(--sp-4)]">
            <Logo className="h-[calc(44*var(--k))] w-auto text-white max-lg:h-[32px]" />
            <div className="text-right">
              <p className="deck-eyebrow">Company Profile</p>
              <p className="deck-eyebrow mt-[calc(7*var(--k))] text-primary-green max-lg:mt-1.5">
                {PROFILE_EDITION}
              </p>
            </div>
          </div>

          <div className="max-lg:mt-12">
            <p className="deck-eyebrow">{siteConfig.tagline}</p>
            <h1 className="deck-cover-title mt-[var(--sp-3)] max-w-[calc(900*var(--k))] max-lg:mt-3 max-lg:max-w-none">
              We turn product ideas into{" "}
              <span className="text-primary-green">software that scales</span>
            </h1>
          </div>

          <div className="max-lg:mt-12">
            <div className="deck-rule" />
            <div className="mt-[var(--sp-3)] grid grid-cols-4 gap-[var(--sp-3)] max-lg:mt-5 max-lg:grid-cols-2 max-lg:gap-5">
              {PROFILE_FIGURES.map((item) => (
                <div key={item.label}>
                  <p className="deck-figure">{item.figure}</p>
                  <p className="deck-body mt-[calc(6*var(--k))] max-lg:mt-1.5">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Slide>

      {/* ---------------------------------------------------------------- 02 */}
      <Slide id="at-a-glance">
        <Body className="gap-[var(--sp-4)] max-lg:gap-7">
          <div className="grid min-h-0 flex-1 grid-cols-12 gap-[var(--sp-5)] max-lg:grid-cols-1 max-lg:gap-7">
            <Statement
              className="col-span-6 flex flex-col justify-center"
              heading={
                <>
                  A software company,
                  <br />
                  not a staffing desk.
                </>
              }
              lead="Project Help is hired to deliver a working system — scoped in writing, built in two-week slices, handed over with the keys — rather than to supply hours against someone else's plan."
            />

            <div className="col-span-6 grid grid-cols-2 gap-[var(--sp-3)] max-lg:gap-4">
              {PROFILE_FIGURES.map((item) => (
                <div
                  key={item.label}
                  className="deck-tile flex flex-col justify-between p-[var(--sp-3)] max-lg:p-5"
                >
                  <span className="h-[2px] w-[calc(40*var(--k))] bg-primary-green max-lg:w-[40px]" />
                  <div className="mt-[var(--sp-4)] max-lg:mt-8">
                    <p className="deck-figure">{item.figure}</p>
                    <p className="deck-body mt-[calc(6*var(--k))] max-lg:mt-1.5">
                      {item.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <dl className="grid shrink-0 grid-cols-6 gap-[var(--sp-3)] border-t border-[var(--rule)] pt-[var(--sp-3)] max-lg:grid-cols-2 max-lg:gap-4 max-lg:pt-5">
            {[
              { term: "Founded", detail: siteConfig.founded },
              {
                term: "Base",
                detail: `${siteConfig.address.locality}, ${siteConfig.address.countryName}`,
              },
              { term: "Team", detail: "25 specialists" },
              { term: "Practices", detail: `${two(PROFILE_SERVICES.length)} in house` },
              { term: "Cadence", detail: "Two-week sprints" },
              { term: "Post-launch", detail: "6–12 months" },
            ].map((row) => (
              <div key={row.term}>
                <dt className="deck-eyebrow">{row.term}</dt>
                <dd className="deck-h3 mt-[calc(7*var(--k))] max-lg:mt-1.5">
                  {row.detail}
                </dd>
              </div>
            ))}
          </dl>
        </Body>
      </Slide>

      {/* ---------------------------------------------------------------- 03 */}
      <Slide id="what-we-build">
        <Body>
          <Statement
            heading="Seven practices, one delivery team"
            lead="Most builds draw on three or four at once, which is the reason they sit under one roof."
            className="max-w-[calc(720*var(--k))] max-lg:max-w-none"
          />

          <div className="mt-[var(--sp-4)] grid min-h-0 flex-1 grid-cols-4 gap-[var(--sp-3)] max-lg:mt-7 max-lg:grid-cols-1 max-lg:gap-4">
            {PROFILE_SERVICES.map((service, index) => (
              <div
                key={service.slug}
                className="deck-tile flex flex-col p-[calc(18*var(--k))] max-lg:p-5"
              >
                <div className="flex items-center gap-[calc(10*var(--k))] max-lg:gap-3">
                  <Marker n={two(index + 1)} />
                  <h3 className="deck-h3">{service.shortTitle}</h3>
                </div>
                <ul className="mt-[var(--sp-2)] flex flex-col gap-[calc(4*var(--k))] max-lg:mt-3 max-lg:gap-1">
                  {service.included.map((item) => (
                    <li key={item} className="deck-body">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* The eighth cell is the picture rather than another list, so the
                grid ends on something other than more words. */}
            <div className="relative overflow-hidden rounded-[calc(12*var(--k))] max-lg:h-[200px] max-lg:rounded-[12px]">
              <Image
                src={PROFILE_IMAGERY.capabilities}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 1023px) 100vw, 25vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,10,0.88),rgba(10,10,10,0.15))]" />
              <p className="absolute inset-x-[var(--sp-3)] bottom-[var(--sp-3)] font-display text-[calc(19*var(--k))] font-medium leading-[1.25] tracking-[-0.02em] text-white max-lg:inset-x-5 max-lg:bottom-5 max-lg:text-[19px]">
                One contract, one team accountable for the result.
              </p>
            </div>
          </div>
        </Body>
      </Slide>

      {/* ---------------------------------------------------------------- 04 */}
      <Slide id="industries">
        <Body>
          <div className="grid min-h-0 flex-1 grid-cols-12 gap-[var(--sp-5)] max-lg:grid-cols-1 max-lg:gap-7">
            <div className="col-span-8 flex flex-col">
              <Statement
                heading="Where the work has shipped"
                lead="Twenty-eight delivered projects, grouped by the sector that paid for them. Engagements, not logos."
              />

              <ul className="mt-[var(--sp-4)] flex flex-1 flex-col justify-center gap-[calc(16*var(--k))] max-lg:mt-7 max-lg:gap-5">
                {PROFILE_INDUSTRIES.map((industry) => {
                  const count = Number(industry.count);
                  // Scaled against the largest sector, so the bars compare with
                  // each other rather than against an arbitrary axis.
                  const width = `${(count / 9) * 100}%`;
                  return (
                    <li key={industry.name}>
                      <div className="flex items-baseline justify-between gap-[var(--sp-3)]">
                        <p className="deck-h3">{industry.name}</p>
                        <p className="deck-body">{industry.note}</p>
                      </div>
                      <div className="mt-[calc(9*var(--k))] flex items-center gap-[var(--sp-3)] max-lg:mt-2 max-lg:gap-4">
                        <span className="relative h-[calc(28*var(--k))] flex-1 overflow-hidden rounded-[100px] bg-[var(--tint)] max-lg:h-[26px]">
                          <span
                            className="deck-bar absolute inset-y-0 left-0"
                            style={{ width }}
                          />
                        </span>
                        <span className="w-[calc(58*var(--k))] shrink-0 text-right font-display text-[calc(26*var(--k))] font-medium leading-none tracking-[-0.04em] tabular-nums max-lg:w-[52px] max-lg:text-[24px]">
                          {industry.count}
                          <span className="text-primary-green">&times;</span>
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="relative col-span-4 overflow-hidden rounded-[calc(12*var(--k))] max-lg:h-[220px] max-lg:rounded-[12px]">
              <Image
                src={PROFILE_IMAGERY.sectors}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 1023px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          </div>
        </Body>
      </Slide>

      {/* ---------------------------------------------------------------- 05 */}
      <Slide id="stack" tone="ink">
        <Body>
          <Statement
            heading="One stack, all the way down"
            lead="The screen, the logic behind it, the data under that, and the platform the whole thing runs on — named tool by tool, with what each layer hands over."
            className="max-w-[calc(860*var(--k))] max-lg:max-w-none"
          />

          <div className="mt-[var(--sp-4)] grid min-h-0 flex-1 grid-cols-4 gap-[var(--sp-3)] max-lg:mt-7 max-lg:grid-cols-1 max-lg:gap-5">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.id}
                className="deck-tile flex flex-col p-[calc(18*var(--k))] max-lg:p-5"
              >
                <div className="flex items-center gap-[calc(10*var(--k))] max-lg:gap-3">
                  <Marker n={pillar.number} />
                  <h3 className="deck-h3">{pillar.name}</h3>
                </div>

                <p className="deck-body mt-[var(--sp-2)] max-lg:mt-3">
                  {pillar.purpose}
                </p>

                {/* White tiles even on ink: several of these marks are drawn in
                    black and would disappear on a dark ground. */}
                <ul className="mt-[var(--sp-3)] flex flex-wrap gap-[calc(7*var(--k))] max-lg:mt-4 max-lg:gap-2">
                  {pillar.tools.map((tool) => (
                    <li
                      key={tool}
                      title={techLabel(tool)}
                      className="flex size-[calc(38*var(--k))] items-center justify-center rounded-[calc(10*var(--k))] bg-white max-lg:size-[40px] max-lg:rounded-[10px]"
                    >
                      <TechMark
                        name={tool}
                        className="size-[calc(21*var(--k))] max-lg:size-[22px]"
                      />
                    </li>
                  ))}
                </ul>

                <ul className="mt-auto flex flex-col gap-[calc(5*var(--k))] pt-[var(--sp-3)] max-lg:mt-5 max-lg:gap-1.5 max-lg:pt-0">
                  {pillar.delivers.map((item) => (
                    <li
                      key={item}
                      className="deck-body flex items-baseline gap-[calc(8*var(--k))] max-lg:gap-2"
                    >
                      <span className="text-primary-green">&rarr;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Body>
      </Slide>

      {/* ---------------------------------------------------------------- 06 */}
      <Slide id="process">
        <Body>
          <Statement
            heading="How the work runs"
            lead="Four steps, the same on every engagement. You can stop after step two and still own something useful — a written scope you could take anywhere."
            className="max-w-[calc(860*var(--k))] max-lg:max-w-none"
          />

          <div className="mt-[var(--sp-4)] grid shrink-0 grid-cols-4 gap-[var(--sp-4)] max-lg:mt-7 max-lg:grid-cols-1 max-lg:gap-6">
            {PROFILE_PROCESS.map((step) => (
              <div key={step.number} className="flex flex-col">
                <div className="flex items-center gap-[var(--sp-2)] max-lg:gap-3">
                  <Marker n={step.number} />
                  <span className="deck-rule" />
                </div>
                <h3 className="deck-h3 mt-[var(--sp-3)] max-lg:mt-3">{step.title}</h3>
                <p className="deck-body mt-[var(--sp-2)] max-lg:mt-2">{step.copy}</p>
              </div>
            ))}
          </div>

          {/* The picture takes the slack at the foot of the slide rather than
              letting four short columns float in white space. */}
          <div className="relative mt-[var(--sp-4)] min-h-0 flex-1 overflow-hidden rounded-[calc(12*var(--k))] max-lg:mt-7 max-lg:h-[200px] max-lg:flex-none max-lg:rounded-[12px]">
            <Image
              src={PROFILE_IMAGERY.process}
              alt=""
              aria-hidden
              fill
              sizes="100vw"
              className="object-cover object-[center_35%]"
            />
          </div>
        </Body>
      </Slide>

      {/* ---------------------------------------------------------------- 07 */}
      <Slide id="handover" tone="green">
        <Body>
          <div className="flex items-end justify-between gap-[var(--sp-5)] max-lg:flex-col max-lg:items-start max-lg:gap-4">
            <Statement
              heading="What you are left holding"
              lead="A build is finished when someone who has never met us can run it. These six are produced by the work, not assembled at the end of it."
              className="max-w-[calc(780*var(--k))] max-lg:max-w-none"
            />
            <p className="deck-chip shrink-0">Yours from commit one</p>
          </div>

          <div className="mt-[var(--sp-4)] grid min-h-0 flex-1 grid-cols-3 gap-[var(--sp-3)] max-lg:mt-7 max-lg:grid-cols-1 max-lg:gap-4">
            {PROFILE_HANDOVER.map((item, index) => (
              <div
                key={item.title}
                className="deck-tile flex flex-col p-[calc(18*var(--k))] max-lg:p-5"
              >
                <div className="flex items-center gap-[calc(10*var(--k))] max-lg:gap-3">
                  <Marker n={two(index + 1)} tone="hollow" />
                  <h3 className="deck-h3">{item.title}</h3>
                </div>
                <p className="deck-body mt-[var(--sp-2)] max-lg:mt-2">{item.copy}</p>
              </div>
            ))}
          </div>
        </Body>
      </Slide>

      {/* ------------------------------------------------------- 08 … 12 */}
      {PROFILE_WORK.map((work, index) => {
        // The photograph changes sides down the run, so five case slides do not
        // read as the same slide five times.
        const imageRight = index % 2 === 1;
        return (
          <Slide
            id={`work-${work.slug}`}
            key={work.slug}
            contentClassName={
              imageRight
                ? "mr-[calc(402*var(--k))] max-lg:mr-0"
                : "ml-[calc(402*var(--k))] max-lg:ml-0"
            }
            bleed={
              <Bleed
                className={`w-[calc(420*var(--k))] ${
                  imageRight ? "left-auto" : "right-auto"
                } max-lg:static max-lg:mb-5 max-lg:h-[200px] max-lg:w-full max-lg:rounded-[10px]`}
              >
                <Image
                  src={work.image.src}
                  alt={work.image.alt}
                  fill
                  sizes="(max-width: 1023px) 100vw, 35vw"
                  className="object-cover"
                />
              </Bleed>
            }
          >
            <Body className="gap-[calc(16*var(--k))] max-lg:gap-5">
              <div className="min-h-0 flex-1">
                <h2 className="deck-h2">{work.title}</h2>

                <ul className="mt-[var(--sp-2)] flex flex-wrap gap-[calc(7*var(--k))] max-lg:mt-3 max-lg:gap-2">
                  {work.categories.map((category) => (
                    <li key={category} className="deck-chip">
                      {category}
                    </li>
                  ))}
                  {work.stack.map((tool) => (
                    <li key={tool} className="deck-chip">
                      {tool}
                    </li>
                  ))}
                </ul>

                <div className="mt-[var(--sp-3)] grid grid-cols-2 gap-[var(--sp-4)] max-lg:mt-5 max-lg:grid-cols-1 max-lg:gap-5">
                  <div>
                    <p className="deck-eyebrow">The problem</p>
                    <h3 className="deck-h3 mt-[var(--sp-2)] max-lg:mt-2">
                      {work.challenge.heading}
                    </h3>
                    <p className="deck-body mt-[var(--sp-2)] max-lg:mt-2">
                      {work.challenge.body}
                    </p>
                  </div>

                  <div>
                    <p className="deck-eyebrow">What we built</p>
                    <h3 className="deck-h3 mt-[var(--sp-2)] max-lg:mt-2">
                      {work.solution.heading}
                    </h3>
                    <p className="deck-body mt-[var(--sp-2)] max-lg:mt-2">
                      {work.solution.body}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid shrink-0 grid-cols-4 gap-[var(--sp-3)] border-t border-[var(--rule)] pt-[var(--sp-3)] max-lg:grid-cols-2 max-lg:gap-4 max-lg:pt-5">
                {work.outcomes.map((outcome) => (
                  <div key={outcome.label}>
                    <p className="font-display text-[calc(40*var(--k))] font-medium leading-none tracking-[-0.04em] text-primary-green max-lg:text-[32px]">
                      {outcome.value}
                    </p>
                    <p className="deck-eyebrow mt-[calc(8*var(--k))] max-lg:mt-2">
                      {outcome.label}
                    </p>
                  </div>
                ))}
              </div>
            </Body>
          </Slide>
        );
      })}

      {/* ---------------------------------------------------------------- 13 */}
      <Slide id="clients">
        <Body>
          <div className="grid min-h-0 flex-1 grid-cols-12 gap-[var(--sp-5)] max-lg:grid-cols-1 max-lg:gap-7">
            <div className="col-span-7 flex flex-col">
              <Statement
                heading="Who we build for"
                lead="Founders and operators who need the system working on Monday. Three have let us show their mark; the rest are under agreements that do not allow it."
              />

              <ul className="mt-[var(--sp-4)] grid flex-1 grid-cols-3 gap-[var(--sp-3)] max-lg:mt-7 max-lg:gap-3">
                {CLIENTS.map((client) => (
                  <li
                    key={client.name}
                    className="deck-tile flex items-center justify-center p-[var(--sp-3)] max-lg:h-[110px] max-lg:p-4"
                  >
                    <Image
                      src={client.src}
                      alt={client.name}
                      width={client.width}
                      height={client.height}
                      className="h-[calc(46*var(--k))] w-auto object-contain max-lg:h-[42px]"
                    />
                  </li>
                ))}
              </ul>

              <p className="deck-eyebrow mt-[calc(16*var(--k))] max-lg:mt-4">
                Trusted by 28+ teams worldwide
              </p>
            </div>

            <div className="relative col-span-5 overflow-hidden rounded-[calc(12*var(--k))] max-lg:h-[220px] max-lg:rounded-[12px]">
              <Image
                src={PROFILE_IMAGERY.clients}
                alt=""
                aria-hidden
                fill
                sizes="(max-width: 1023px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </Body>
      </Slide>

      {/* ---------------------------------------------------------------- 14 */}
      <Slide id="why-us" tone="ink">
        <Body>
          <div className="grid min-h-0 flex-1 grid-cols-12 gap-[var(--sp-5)] max-lg:grid-cols-1 max-lg:gap-7">
            <Statement
              className="col-span-4 flex flex-col justify-center"
              heading={
                <>
                  Why teams
                  <br />
                  pick us
                </>
              }
              lead="None of these is a differentiator alone. Together they describe an engagement where the expensive surprises happen early, while they are still cheap."
            />

            <ol className="col-span-8 flex flex-col justify-center gap-[calc(8*var(--k))] max-lg:gap-3">
              {PROFILE_REASONS.map((reason) => (
                <li
                  key={reason.number}
                  className="deck-tile flex gap-[calc(16*var(--k))] p-[calc(14*var(--k))] max-lg:gap-4 max-lg:p-4"
                >
                  <Marker n={reason.number} tone="hollow" />
                  <div>
                    <h3 className="deck-h3">{reason.title}</h3>
                    <p className="deck-body mt-[calc(5*var(--k))] max-lg:mt-1.5">
                      {reason.copy}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Body>
      </Slide>

      {/* ---------------------------------------------------------------- 15 */}
      <Slide id="contact" tone="ink">
        <Body className="justify-between">
          <div className="max-lg:mb-9">
            <h2 className="deck-h2 max-w-[calc(880*var(--k))] max-lg:max-w-none">
              Tell us what you are building, and we will tell you{" "}
              <span className="text-primary-green">what it takes</span>.
            </h2>
            <p className="deck-lead mt-[var(--sp-3)] max-w-[calc(660*var(--k))] max-lg:mt-4 max-lg:max-w-none">
              Thirty minutes, no deck, no obligation. You leave the call with an
              honest read on scope, sequence and cost &mdash; whether or not we
              are the right people to build it.
            </p>
          </div>

          <div className="grid grid-cols-12 items-end gap-[var(--sp-5)] max-lg:grid-cols-1 max-lg:gap-7">
            <div className="col-span-7 flex flex-col gap-[var(--sp-3)] max-lg:gap-4">
              <a
                href={siteConfig.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="deck-h3 flex w-fit items-center gap-[var(--sp-2)] rounded-[100px] bg-primary-green px-[var(--sp-4)] py-[var(--sp-3)] text-black transition-colors hover:bg-[#95e534] max-lg:gap-3 max-lg:px-6 max-lg:py-4"
              >
                Book a 30-minute call
                <span aria-hidden>&rarr;</span>
              </a>

              <div className="flex flex-wrap items-center gap-x-[var(--sp-5)] gap-y-[var(--sp-2)] max-lg:gap-x-6 max-lg:gap-y-3">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="deck-h3 transition-colors hover:text-primary-green"
                >
                  {siteConfig.email}
                </a>
                <a
                  href={siteConfig.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="deck-h3 flex items-center gap-[calc(8*var(--k))] transition-colors hover:text-primary-green max-lg:gap-2"
                >
                  <WhatsAppMark className="size-[calc(18*var(--k))] shrink-0 max-lg:size-[18px]" />
                  {siteConfig.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="col-span-5">
              <p className="deck-eyebrow">Office</p>
              <p className="deck-lead mt-[var(--sp-2)] max-lg:mt-2">
                {siteConfig.address.street}
                <br />
                {siteConfig.address.locality} {siteConfig.address.postalCode},{" "}
                {siteConfig.address.countryName}
              </p>
            </div>
          </div>

          <div className="mt-[var(--sp-4)] flex items-center justify-between gap-[var(--sp-4)] border-t border-[var(--rule)] pt-[var(--sp-3)] max-lg:mt-9 max-lg:flex-col max-lg:items-start max-lg:gap-4 max-lg:pt-6">
            <div className="flex items-center gap-[var(--sp-2)] max-lg:gap-3">
              <BrandMark className="size-[calc(30*var(--k))] rounded-[calc(7*var(--k))] max-lg:size-[32px] max-lg:rounded-[7px]" />
              <Logo className="h-[calc(24*var(--k))] w-auto text-white max-lg:h-[24px]" />
            </div>
            <p className="deck-eyebrow">
              {siteConfig.url.replace("https://", "")} &middot; Company Profile{" "}
              {PROFILE_EDITION}
            </p>
          </div>
        </Body>
      </Slide>

      {/* Hidden on paper, where it is a dead link. */}
      <p className="print-hide mt-[48px] text-center font-body text-[15px] leading-[24px] tracking-[-0.15px] text-neutral-paragraph">
        Prefer the long version?{" "}
        <Link
          href="/case-study"
          className="text-black underline decoration-primary-green decoration-2 underline-offset-4 transition-colors hover:text-primary-green"
        >
          Read the full case studies
        </Link>
        .
      </p>
    </div>
  );
}
