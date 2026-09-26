"use client";

import Link from "next/link";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";
import { BrandMark } from "@/components/ui/BrandIcons";
import TechMark, { techLabel, type TechName } from "@/components/ui/TechMarks";

type Pillar = {
  id: string;
  number: string;
  name: string;
  purpose: string;
  tools: TechName[];
  delivers: string[];
};

/**
 * Four columns, read left to right as a system rather than as a service menu:
 * the screen, the logic behind it, the data under that, and the platform the
 * whole thing runs on. Each one names the tools it is built from and what comes
 * out of it, because "we use React" means nothing on its own and "you get a
 * design system and two app builds" means something.
 */
const PILLARS: Pillar[] = [
  {
    id: "interface",
    number: "01",
    name: "Interface",
    purpose: "Everything your users touch, on whatever they are holding.",
    tools: ["react", "nextjs", "typescript", "tailwind", "flutter"],
    delivers: ["Design system", "Web application", "iOS & Android"],
  },
  {
    id: "services",
    number: "02",
    name: "Services & AI",
    purpose: "The rules, the workflows and the models behind the screen.",
    tools: ["nodejs", "python", "graphql", "openai", "pytorch"],
    delivers: ["Documented API", "Auth & roles", "Model integration"],
  },
  {
    id: "data",
    number: "03",
    name: "Data",
    purpose: "Where the truth is kept, how it moves, who may see it.",
    tools: ["postgres", "mongodb", "redis", "elasticsearch"],
    delivers: ["Schema & migrations", "Event pipeline", "Reporting views"],
  },
  {
    id: "platform",
    number: "04",
    name: "Platform",
    purpose: "How it ships on a Tuesday and stays up at three in the morning.",
    tools: ["aws", "docker", "kubernetes", "terraform"],
    delivers: ["CI/CD pipeline", "Monitoring & alerts", "Runbook & handover"],
  },
];

/** The drifting band. Order is deliberate — no two neighbours share a colour. */
const BAND: TechName[] = [
  "react",
  "postgres",
  "docker",
  "python",
  "typescript",
  "mongodb",
  "aws",
  "elasticsearch",
  "graphql",
  "nextjs",
  "redis",
  "kubernetes",
  "tailwind",
  "figma",
  "nodejs",
  "terraform",
  "flutter",
  "javascript",
  "pytorch",
  "vercel",
  "go",
  "openai",
];

const TOOL_COUNT = PILLARS.reduce((total, pillar) => total + pillar.tools.length, 0);

/**
 * How many times the band repeats itself. One copy is about 1340px wide, and
 * the row has to stay wider than the window across a whole copy's worth of
 * travel — two copies leave a bare patch at the trailing edge on a laptop.
 */
const BAND_COPIES = 3;
const BAND_LOOP = Array.from({ length: BAND_COPIES }, () => BAND).flat();

/**
 * Where each column's wire sits inside the four-column grid, and how far it has
 * to reach to meet its neighbour. The segments overlap the 16px gaps so the
 * horizontal run is unbroken from the first column's centre to the last.
 */
const WIRE_SPAN = [
  "left-1/2 -right-[16px]",
  "left-0 -right-[16px]",
  "-left-[16px] right-0",
  "-left-[16px] right-1/2",
];
const WIRE_ORIGIN = ["origin-right", "origin-right", "origin-left", "origin-left"];

/** One tile in the drifting band. Held back so the mark at the centre leads. */
function Tile({ name }: { name: TechName }) {
  return (
    <span className="flex size-[52px] shrink-0 items-center justify-center rounded-[14px] border border-black/[0.07] bg-white opacity-[0.62] shadow-[0_6px_16px_-12px_rgba(21,21,21,0.9)]">
      <TechMark name={name} className="size-[24px]" />
    </span>
  );
}

export default function TechStack() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 76%" });

      gsap.from(".stack-head", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: trigger,
      });

      gsap.from(".stack-band", {
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        delay: 0.15,
        scrollTrigger: trigger,
      });

      gsap.from(".stack-node", {
        scale: 0.6,
        opacity: 0,
        duration: 0.8,
        ease: "back.out(1.8)",
        delay: 0.3,
        scrollTrigger: trigger,
      });

      // The wiring draws itself: down out of the node, out along the bus in
      // both directions at once, then down into each card.
      const wireTrigger = reveal(sectionRef.current?.querySelector(".stack-wires") ?? null, {
        start: "top 92%",
      });

      gsap
        .timeline({ scrollTrigger: wireTrigger })
        .from(".stack-wire-stem", { scaleY: 0, duration: 0.35, ease: "power2.out" })
        .from(".stack-wire-bus", { scaleX: 0, duration: 0.5, ease: "power2.out" }, ">-0.05")
        .from(
          ".stack-wire-drop",
          { scaleY: 0, duration: 0.3, ease: "power2.out", stagger: 0.06 },
          ">-0.1",
        );

      gsap.from(".stack-card", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.09,
        scrollTrigger: reveal(sectionRef.current?.querySelector(".stack-cards") ?? null, {
          start: "top 88%",
        }),
      });

      if (prefersReducedMotion()) return;

      // Two rows drifting against each other. Travelling exactly one copy's
      // width lands on an identical frame, so the loop has no seam — and it
      // takes three copies rather than two for the row to stay wider than the
      // window for the whole of that journey.
      const step = 100 / BAND_COPIES;

      gsap.utils.toArray<HTMLElement>(".stack-band-row").forEach((row, index) => {
        const leftward = index === 0;
        gsap.set(row, { xPercent: leftward ? 0 : -step });
        gsap.to(row, {
          xPercent: leftward ? -step : 0,
          duration: 58 + index * 9,
          ease: "none",
          repeat: -1,
        });
      });

      // A slow breath on the glow, so the centre never goes completely still.
      gsap.to(".stack-node-glow", {
        scale: 1.12,
        opacity: 0.75,
        duration: 3.2,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="stack"
      className="relative w-full overflow-hidden bg-white py-[72px] lg:py-[112px]"
    >
      {/* Engineering paper, faded out at the edges so it never competes with
          the type sitting on it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(21,21,21,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(21,21,21,0.05)_1px,transparent_1px)] [background-size:68px_68px] [mask-image:radial-gradient(ellipse_78%_62%_at_50%_34%,black,transparent)]"
      />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col items-center px-6 lg:px-[40px]">
        <span className="stack-head inline-flex items-center gap-[8px] rounded-full border border-primary-green/45 bg-primary-green/[0.08] px-[16px] py-[7px]">
          <span aria-hidden className="size-[6px] rounded-full bg-primary-green" />
          <span className="font-body text-[13px] font-semibold uppercase leading-none tracking-[0.6px] text-[#4d7d13]">
            Engineering stack
          </span>
        </span>

        <h2 className="stack-head mt-[20px] max-w-[900px] text-center font-display text-[clamp(2rem,4.2vw,58px)] font-medium leading-[1.08] tracking-[-1.5px] text-black">
          One stack<span className="text-primary-green">,</span> all the way{" "}
          <span className="text-primary-green">down</span>
        </h2>

        <p className="stack-head mt-[18px] max-w-[620px] text-center font-body text-[16px] leading-[25px] tracking-[-0.16px] text-neutral-paragraph">
          Nothing here is on the list because it trended this year. Every layer is chosen
          for the problem in front of it, named in the scope before a line is committed,
          and handed over documented.
        </p>

        {/* The band. Two rows drifting in opposite directions behind the mark,
            masked to nothing at both ends so it reads as part of something
            wider rather than a strip that stops. */}
        <div className="stack-band relative mt-[44px] w-screen max-w-[1600px] lg:mt-[56px]">
          <div
            aria-hidden
            className="flex flex-col gap-[12px] overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_16%,black_84%,transparent)]"
          >
            <div className="stack-band-row flex w-max gap-[12px]">
              {BAND_LOOP.map((name, index) => (
                <Tile key={`a-${index}`} name={name} />
              ))}
            </div>
            <div className="stack-band-row flex w-max gap-[12px]">
              {[...BAND_LOOP].reverse().map((name, index) => (
                <Tile key={`b-${index}`} name={name} />
              ))}
            </div>
          </div>

          {/* Clears a hole in the drift for the mark to sit in. */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 size-[300px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,#ffffff_38%,rgba(255,255,255,0.86)_56%,rgba(255,255,255,0)_74%)]"
          />

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span
              aria-hidden
              className="stack-node-glow absolute -inset-[34px] rounded-full bg-[radial-gradient(circle,rgba(134,213,42,0.4),rgba(134,213,42,0)_68%)]"
            />
            <span className="stack-node relative flex size-[104px] items-center justify-center rounded-full border border-primary-green/40 bg-white shadow-[0_14px_44px_-16px_rgba(134,213,42,0.95)]">
              <BrandMark className="size-[74px]" />
            </span>
          </div>
        </div>

        {/* The wiring from the mark down into the four columns. Hairlines rather
            than an SVG: they stay exactly 1px at every width, and scale cleanly
            from either end. Below lg the columns stack, so there is nothing for
            a bus to run along and it goes. */}
        <div className="stack-wires relative hidden h-[74px] w-full grid-cols-4 gap-[16px] lg:grid">
          <span
            aria-hidden
            className="stack-wire-stem absolute left-1/2 top-0 h-[30px] w-px origin-top -translate-x-1/2 bg-black/20"
          />
          {PILLARS.map((pillar, index) => (
            <div key={pillar.id} className="relative">
              <span
                aria-hidden
                className={`stack-wire-bus absolute top-[30px] h-px bg-black/20 ${WIRE_SPAN[index]} ${WIRE_ORIGIN[index]}`}
              />
              <span
                aria-hidden
                className="stack-wire-drop absolute left-1/2 top-[30px] h-[44px] w-px origin-top -translate-x-1/2 bg-black/20"
              />
            </div>
          ))}
        </div>

        <div className="stack-cards mt-[32px] grid w-full gap-[16px] sm:grid-cols-2 lg:mt-0 lg:grid-cols-4">
          {PILLARS.map((pillar) => (
            <article
              key={pillar.id}
              className="stack-card group flex flex-col gap-[18px] rounded-[16px] border border-black/10 bg-white p-[22px] shadow-[0_20px_44px_-38px_rgba(21,21,21,0.9)] transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-[3px] hover:border-primary-green/55 hover:shadow-[0_26px_52px_-30px_rgba(21,21,21,0.42)]"
            >
              <div className="flex items-start justify-between gap-[10px]">
                <h3 className="font-display text-[19px] font-semibold leading-[1.2] tracking-[-0.4px] text-black">
                  {pillar.name}
                </h3>
                <span className="mt-[2px] font-mono text-[11px] leading-none tracking-[0.5px] text-[#a3a3a3] transition-colors duration-500 group-hover:text-primary-green">
                  {pillar.number}
                </span>
              </div>

              <p className="font-body text-[14px] leading-[21px] tracking-[-0.16px] text-neutral-paragraph">
                {pillar.purpose}
              </p>

              <ul className="flex flex-wrap gap-[8px]">
                {pillar.tools.map((tool) => (
                  <li
                    key={tool}
                    className="flex size-[40px] items-center justify-center rounded-[11px] border border-black/[0.07] bg-bg transition-colors duration-300 group-hover:border-primary-green/35"
                  >
                    <TechMark name={tool} className="size-[21px]" />
                    <span className="sr-only">{techLabel(tool)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto flex flex-col gap-[10px] border-t border-black/10 pt-[16px]">
                <p className="font-display text-[11px] font-semibold uppercase leading-none tracking-[0.7px] text-[#a3a3a3]">
                  Delivers
                </p>
                <ul className="flex flex-wrap gap-[6px]">
                  {pillar.delivers.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-black/10 bg-bg px-[10px] py-[5px] font-body text-[12px] leading-[1.35] tracking-[-0.1px] text-ash-deep"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <div className="stack-head mt-[40px] flex w-full flex-col items-center gap-[16px] lg:mt-[56px]">
          <p className="max-w-[660px] text-center font-body text-[15px] leading-[24px] tracking-[-0.16px] text-neutral-paragraph">
            {TOOL_COUNT} tools across four layers, one team accountable for all of them.
            Not sure which layer your problem lives in? That is what the scope is for.
          </p>

          <Link
            href="/contact"
            className="group flex items-center gap-[10px] rounded-[100px] bg-black px-[28px] py-[15px] transition-colors duration-300 hover:bg-primary-green"
          >
            <span className="font-body text-[16px] font-medium leading-[24px] tracking-[-0.25px] text-white transition-colors duration-300 group-hover:text-black">
              Get the scope
            </span>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              aria-hidden="true"
              className="shrink-0 text-white transition-[transform,color] duration-300 group-hover:translate-x-[3px] group-hover:text-black"
            >
              <path
                d="M3 12 12 3M4.6 3H12v7.4"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
