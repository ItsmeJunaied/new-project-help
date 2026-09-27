"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";
import Logo from "@/components/ui/Logo";
import { BrandMark } from "@/components/ui/BrandIcons";
import TechMark, { techLabel } from "@/components/ui/TechMarks";
import WhatsAppMark from "@/components/ui/WhatsAppMark";
import { PILLARS } from "@/lib/stack";
import { siteConfig } from "@/lib/site";
import {
  PROFILE_EDITION,
  PROFILE_FIGURES,
  PROFILE_HANDOVER,
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
 * rather than a second, separately maintained artefact that can fall behind
 * the site. See the deck block in app/globals.css for how the canvas scales.
 *
 * Animation is deliberately translate-only. A `from` tween on opacity leaves
 * the content invisible if its trigger never fires, and this document has to
 * be readable in a print preview, in a hidden tab, and with JavaScript halfway
 * through loading.
 */

const two = (n: number) => String(n).padStart(2, "0");

function SlideFurniture({ id }: { id: string }) {
  const slide = PROFILE_SLIDES.find((entry) => entry.id === id);
  return (
    <div className="flex shrink-0 flex-col gap-[var(--sp-2)]">
      <div className="flex items-baseline justify-between gap-[var(--sp-3)]">
        <p className="deck-eyebrow">{slide?.eyebrow}</p>
        <p className="deck-eyebrow">
          {two(slidePosition(id))}
          <span className="opacity-45"> / {two(PROFILE_SLIDE_COUNT)}</span>
        </p>
      </div>
      <div className="deck-rule" />
    </div>
  );
}

function Slide({
  id,
  ink = false,
  furniture = true,
  children,
}: {
  id: string;
  ink?: boolean;
  furniture?: boolean;
  children: ReactNode;
}) {
  const slide = PROFILE_SLIDES.find((entry) => entry.id === id);
  return (
    <section
      id={id}
      aria-label={slide?.title}
      className={`profile-slide deck-frame${ink ? " deck-frame--ink" : ""}`}
    >
      <div className={`deck-slide${ink ? " deck-slide--ink" : ""}`}>
        {furniture ? <SlideFurniture id={id} /> : null}
        {children}
      </div>
    </section>
  );
}

/** The body of a slide: everything below the hairline, filling what is left. */
function Body({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mt-[var(--sp-5)] flex flex-1 flex-col max-lg:mt-[26px] ${className}`}
    >
      {children}
    </div>
  );
}

/** Heading and standfirst, used at the top of most slides. */
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
      {lead ? <p className="deck-lead mt-[var(--sp-3)] max-lg:mt-4">{lead}</p> : null}
    </div>
  );
}

export default function ProfileDeck() {
  const deckRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      gsap.utils.toArray<HTMLElement>(".profile-slide").forEach((slide) => {
        gsap.from(slide, {
          y: 34,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: reveal(slide, { start: "top 88%" }),
        });
      });
    },
    { scope: deckRef },
  );

  return (
    <div
      ref={deckRef}
      className="flex w-full flex-col gap-[40px] max-lg:gap-[28px] print:gap-0"
    >
      {/* ---------------------------------------------------------------- 01 */}
      <Slide id="cover" ink furniture={false}>
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex items-start justify-between gap-[var(--sp-4)]">
            <Logo className="h-[calc(46*var(--k))] w-auto text-white max-lg:h-[34px]" />
            <div className="text-right">
              <p className="deck-eyebrow">Company Profile</p>
              <p className="deck-eyebrow mt-[calc(6*var(--k))] text-primary-green">
                {PROFILE_EDITION}
              </p>
            </div>
          </div>

          <div className="max-lg:mt-10">
            <h1 className="deck-cover-title max-w-[calc(880*var(--k))] max-lg:max-w-none">
              We turn product ideas into{" "}
              <span className="text-primary-green">software that scales</span>
            </h1>
            <p className="deck-lead mt-[var(--sp-4)] max-w-[calc(680*var(--k))] max-lg:mt-5 max-lg:max-w-none">
              {siteConfig.description}
            </p>
          </div>

          <div className="max-lg:mt-10">
            <div className="deck-rule" />
            <div className="mt-[var(--sp-4)] grid grid-cols-4 gap-[var(--sp-3)] max-lg:mt-6 max-lg:grid-cols-2 max-lg:gap-6">
              {PROFILE_FIGURES.map((item) => (
                <div key={item.label}>
                  <p className="deck-figure">{item.figure}</p>
                  <p className="deck-body mt-[calc(8*var(--k))] max-lg:mt-2">
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
        <Body className="gap-[var(--sp-5)] max-lg:gap-8">
          <div className="grid grid-cols-12 gap-[var(--sp-5)] max-lg:grid-cols-1 max-lg:gap-8">
            <Statement
              className="col-span-7"
              heading={
                <>
                  A software company,
                  <br />
                  not a staffing desk.
                </>
              }
              lead="Project Help is a custom software development company in Dhaka. We are hired to deliver a working system — scoped in writing, built in two-week slices, and handed over with the keys — rather than to supply hours against someone else's plan."
            />

            <dl className="col-span-5 flex flex-col gap-[var(--sp-2)] max-lg:gap-3">
              {[
                { term: "Founded", detail: siteConfig.founded },
                { term: "Headquarters", detail: `${siteConfig.address.locality}, ${siteConfig.address.countryName}` },
                { term: "Team", detail: "25 engineers, designers and QA" },
                { term: "Practices", detail: `${two(PROFILE_SERVICES.length)} — SaaS to security` },
                { term: "Delivery", detail: "Two-week sprints, fixed scope" },
                { term: "Post-launch", detail: "6–12 months of fixes included" },
              ].map((row) => (
                <div
                  key={row.term}
                  className="flex items-baseline justify-between gap-[var(--sp-3)] border-b border-[var(--rule)] pb-[var(--sp-2)] max-lg:pb-3"
                >
                  <dt className="deck-eyebrow">{row.term}</dt>
                  <dd className="deck-h3 text-right">{row.detail}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="mt-auto grid grid-cols-4 gap-[var(--sp-3)] max-lg:mt-0 max-lg:grid-cols-2 max-lg:gap-6">
            {PROFILE_FIGURES.map((item) => (
              <div
                key={item.label}
                className="border-t-2 border-primary-green pt-[var(--sp-3)] max-lg:pt-4"
              >
                <p className="deck-figure">{item.figure}</p>
                <p className="deck-body mt-[calc(6*var(--k))] max-lg:mt-2">{item.label}</p>
              </div>
            ))}
          </div>
        </Body>
      </Slide>

      {/* ---------------------------------------------------------------- 03 */}
      <Slide id="what-we-build">
        <Body>
          <Statement
            heading="Seven practices, one delivery team"
            lead="Most builds draw on three or four of them at once, which is the reason they sit under one roof."
            className="max-w-[calc(760*var(--k))] max-lg:max-w-none"
          />

          <div className="mt-[var(--sp-4)] grid flex-1 grid-cols-4 gap-[var(--sp-3)] max-lg:mt-8 max-lg:grid-cols-1 max-lg:gap-5">
            {PROFILE_SERVICES.map((service, index) => (
              <div
                key={service.slug}
                className="flex flex-col border-t border-[var(--rule)] pt-[var(--sp-2)] max-lg:pt-3"
              >
                <p className="deck-eyebrow">{two(index + 1)}</p>
                <h3 className="deck-h3 mt-[var(--sp-2)] max-lg:mt-2">
                  {service.shortTitle}
                </h3>
                <ul className="mt-[var(--sp-2)] flex flex-col gap-[calc(4*var(--k))] max-lg:mt-3 max-lg:gap-1">
                  {service.included.map((item) => (
                    <li key={item} className="deck-body">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="flex flex-col justify-end bg-primary-green p-[var(--sp-3)] max-lg:p-5">
              <p className="deck-figure text-black">{two(PROFILE_SERVICES.length)}</p>
              <p className="deck-h3 mt-[var(--sp-2)] text-black max-lg:mt-2">
                practices, one contract, one team accountable for the result.
              </p>
            </div>
          </div>
        </Body>
      </Slide>

      {/* ---------------------------------------------------------------- 04 */}
      <Slide id="industries">
        <Body>
          <div className="grid flex-1 grid-cols-12 gap-[var(--sp-5)] max-lg:grid-cols-1 max-lg:gap-8">
            <Statement
              className="col-span-4"
              heading={
                <>
                  Where the
                  <br />
                  work has
                  <br />
                  shipped
                </>
              }
              lead="Twenty-eight delivered projects, grouped by the sector that paid for them. The counts are engagements, not logos."
            />

            <ul className="col-span-8 flex flex-col justify-center max-lg:gap-0">
              {PROFILE_INDUSTRIES.map((industry) => (
                <li
                  key={industry.name}
                  className="flex items-center justify-between gap-[var(--sp-4)] border-b border-[var(--rule)] py-[var(--sp-3)] first:border-t max-lg:gap-4 max-lg:py-4"
                >
                  <div>
                    <p className="deck-h3">{industry.name}</p>
                    <p className="deck-body mt-[calc(4*var(--k))] max-lg:mt-1">
                      {industry.note}
                    </p>
                  </div>
                  <p className="deck-figure shrink-0 tabular-nums">
                    {industry.count}
                    <span className="text-primary-green">&times;</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Body>
      </Slide>

      {/* ---------------------------------------------------------------- 05 */}
      <Slide id="stack">
        <Body>
          <Statement
            heading={
              <>
                One stack, all the way down
              </>
            }
            lead="The screen, the logic behind it, the data under that, and the platform the whole thing runs on — named tool by tool, with what each layer hands over."
            className="max-w-[calc(820*var(--k))] max-lg:max-w-none"
          />

          <div className="mt-[var(--sp-5)] grid flex-1 grid-cols-4 gap-[var(--sp-4)] max-lg:mt-8 max-lg:grid-cols-1 max-lg:gap-7">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.id}
                className="flex flex-col border-t-2 border-primary-green pt-[var(--sp-3)] max-lg:pt-4"
              >
                <p className="deck-eyebrow">{pillar.number}</p>
                <h3 className="deck-h3 mt-[var(--sp-2)] max-lg:mt-2">{pillar.name}</h3>
                <p className="deck-body mt-[var(--sp-2)] max-lg:mt-2">{pillar.purpose}</p>

                <ul className="mt-[var(--sp-3)] flex flex-wrap gap-[calc(8*var(--k))] max-lg:mt-4 max-lg:gap-2">
                  {pillar.tools.map((tool) => (
                    <li
                      key={tool}
                      title={techLabel(tool)}
                      className="flex size-[calc(34*var(--k))] items-center justify-center rounded-[calc(9*var(--k))] border border-[var(--rule)] bg-white max-lg:size-[38px] max-lg:rounded-[10px]"
                    >
                      <TechMark name={tool} className="size-[calc(18*var(--k))] max-lg:size-[20px]" />
                    </li>
                  ))}
                </ul>

                <ul className="mt-auto flex flex-col gap-[calc(6*var(--k))] pt-[var(--sp-3)] max-lg:mt-4 max-lg:gap-1.5 max-lg:pt-0">
                  {pillar.delivers.map((item) => (
                    <li key={item} className="deck-body flex items-baseline gap-[calc(8*var(--k))] max-lg:gap-2">
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
            lead="Four steps, the same on every engagement. The point of the shape is that you can stop after step two and still own something useful — a written scope you could take anywhere."
            className="max-w-[calc(820*var(--k))] max-lg:max-w-none"
          />

          <div className="mt-[var(--sp-5)] grid flex-1 grid-cols-4 gap-[var(--sp-4)] max-lg:mt-8 max-lg:grid-cols-1 max-lg:gap-6">
            {PROFILE_PROCESS.map((step) => (
              <div key={step.number} className="flex flex-col">
                <div className="flex items-center gap-[var(--sp-2)] max-lg:gap-3">
                  <span className="flex size-[calc(38*var(--k))] shrink-0 items-center justify-center rounded-full bg-primary-green font-mono text-[calc(13*var(--k))] font-medium text-black max-lg:size-[40px] max-lg:text-[14px]">
                    {step.number}
                  </span>
                  <span className="deck-rule" />
                </div>
                <h3 className="deck-h3 mt-[var(--sp-3)] max-lg:mt-3">{step.title}</h3>
                <p className="deck-body mt-[var(--sp-2)] max-lg:mt-2">{step.copy}</p>
              </div>
            ))}
          </div>
        </Body>
      </Slide>

      {/* ---------------------------------------------------------------- 07 */}
      <Slide id="handover">
        <Body>
          <div className="flex items-end justify-between gap-[var(--sp-5)] max-lg:flex-col max-lg:items-start max-lg:gap-5">
            <Statement
              heading="What you are left holding"
              lead="A build is finished when someone who has never met us can run it. These six things are produced by the work, not assembled at the end of it."
              className="max-w-[calc(760*var(--k))] max-lg:max-w-none"
            />
            <p className="deck-chip shrink-0">Yours from commit one</p>
          </div>

          <div className="mt-[var(--sp-5)] grid flex-1 grid-cols-3 gap-x-[var(--sp-5)] gap-y-[var(--sp-4)] max-lg:mt-8 max-lg:grid-cols-1 max-lg:gap-6">
            {PROFILE_HANDOVER.map((item, index) => (
              <div
                key={item.title}
                className="flex flex-col border-t border-[var(--rule)] pt-[var(--sp-3)] max-lg:pt-3"
              >
                <p className="deck-eyebrow">{two(index + 1)}</p>
                <h3 className="deck-h3 mt-[var(--sp-2)] max-lg:mt-2">{item.title}</h3>
                <p className="deck-body mt-[var(--sp-2)] max-lg:mt-2">{item.copy}</p>
              </div>
            ))}
          </div>
        </Body>
      </Slide>

      {/* ------------------------------------------------------- 08 … 12 */}
      {PROFILE_WORK.map((work) => (
        <Slide id={`work-${work.slug}`} key={work.slug}>
          <Body className="gap-[var(--sp-4)] max-lg:gap-6">
            <div className="grid flex-1 grid-cols-12 gap-[var(--sp-5)] max-lg:grid-cols-1 max-lg:gap-7">
              <div className="col-span-4 flex flex-col">
                <h2 className="deck-h2">{work.title}</h2>

                <ul className="mt-[var(--sp-3)] flex flex-wrap gap-[calc(8*var(--k))] max-lg:mt-4 max-lg:gap-2">
                  {work.categories.map((category) => (
                    <li key={category} className="deck-chip">
                      {category}
                    </li>
                  ))}
                </ul>

                <dl className="mt-auto flex flex-col gap-[var(--sp-2)] pt-[var(--sp-4)] max-lg:mt-5 max-lg:gap-2.5 max-lg:pt-0">
                  {work.facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="flex items-baseline justify-between gap-[var(--sp-2)] border-b border-[var(--rule)] pb-[calc(6*var(--k))] max-lg:pb-2"
                    >
                      <dt className="deck-eyebrow">{fact.label}</dt>
                      <dd className="deck-body text-right">{fact.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="col-span-4 flex flex-col">
                <p className="deck-eyebrow">The problem</p>
                <h3 className="deck-h3 mt-[var(--sp-2)] max-lg:mt-2">
                  {work.challenge.heading}
                </h3>
                <p className="deck-body mt-[var(--sp-2)] max-lg:mt-2">{work.challenge.body}</p>
              </div>

              <div className="col-span-4 flex flex-col">
                <p className="deck-eyebrow">What we built</p>
                <h3 className="deck-h3 mt-[var(--sp-2)] max-lg:mt-2">
                  {work.solution.heading}
                </h3>
                <p className="deck-body mt-[var(--sp-2)] max-lg:mt-2">{work.solution.body}</p>

                <ul className="mt-auto flex flex-wrap gap-[calc(6*var(--k))] pt-[var(--sp-3)] max-lg:mt-4 max-lg:gap-2 max-lg:pt-0">
                  {work.stack.map((tool) => (
                    <li key={tool} className="deck-chip">
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="grid shrink-0 grid-cols-4 gap-[var(--sp-3)] border-t border-[var(--rule)] pt-[var(--sp-3)] max-lg:grid-cols-2 max-lg:gap-5 max-lg:pt-5">
              {work.outcomes.map((outcome) => (
                <div key={outcome.label}>
                  <p className="deck-eyebrow">{outcome.label}</p>
                  <p className="deck-figure mt-[calc(6*var(--k))] text-[calc(44*var(--k))] text-primary-green max-lg:mt-2 max-lg:text-[34px]">
                    {outcome.value}
                  </p>
                </div>
              ))}
            </div>
          </Body>
        </Slide>
      ))}

      {/* ---------------------------------------------------------------- 13 */}
      <Slide id="why-us">
        <Body>
          <div className="grid flex-1 grid-cols-12 gap-[var(--sp-5)] max-lg:grid-cols-1 max-lg:gap-8">
            <Statement
              className="col-span-4"
              heading={
                <>
                  Why teams
                  <br />
                  pick us
                </>
              }
              lead="None of this is a differentiator on its own. Together they describe an engagement where the expensive surprises happen early, while they are still cheap."
            />

            <ol className="col-span-8 flex flex-col justify-center">
              {PROFILE_REASONS.map((reason) => (
                <li
                  key={reason.number}
                  className="flex gap-[var(--sp-4)] border-b border-[var(--rule)] py-[var(--sp-2)] first:border-t max-lg:gap-4 max-lg:py-4"
                >
                  <span className="deck-eyebrow shrink-0 pt-[calc(5*var(--k))] text-primary-green max-lg:pt-1">
                    {reason.number}
                  </span>
                  <div>
                    <h3 className="deck-h3">{reason.title}</h3>
                    <p className="deck-body mt-[calc(6*var(--k))] max-lg:mt-1.5">
                      {reason.copy}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </Body>
      </Slide>

      {/* ---------------------------------------------------------------- 14 */}
      <Slide id="contact" ink>
        <Body className="justify-between">
          <div className="max-lg:mb-10">
            <h2 className="deck-h2 max-w-[calc(820*var(--k))] max-lg:max-w-none">
              Tell us what you are building, and we will tell you{" "}
              <span className="text-primary-green">what it takes</span>.
            </h2>
            <p className="deck-lead mt-[var(--sp-3)] max-w-[calc(640*var(--k))] max-lg:mt-4 max-lg:max-w-none">
              Thirty minutes, no deck, no obligation. You leave the call with an
              honest read on scope, sequence and cost &mdash; whether or not we
              are the right people to build it.
            </p>
          </div>

          <div className="grid grid-cols-12 items-end gap-[var(--sp-5)] max-lg:grid-cols-1 max-lg:gap-8">
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

          <div className="mt-[var(--sp-5)] flex items-center justify-between gap-[var(--sp-4)] border-t border-[var(--rule)] pt-[var(--sp-3)] max-lg:mt-10 max-lg:flex-col max-lg:items-start max-lg:gap-4 max-lg:pt-6">
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

      {/* Every slide is a link target; this puts the site back within reach
          once the deck ends. Hidden on paper, where it is a dead link. */}
      <p className="print-hide mt-[8px] text-center font-body text-[15px] leading-[24px] tracking-[-0.15px] text-neutral-paragraph">
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
