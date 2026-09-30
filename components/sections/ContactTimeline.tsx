"use client";

import { useRef, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";
import { anchor, layoutFrame, roundedPath, whileVisible, type Point } from "@/lib/flow";

/**
 * From first message to launch, drawn the way the delivery process is drawn on
 * the home and services pages: the cards are laid out by CSS grid, the wiring
 * between them is MEASURED from where the browser actually put them, and a
 * timeline then walks the graph — a card lights, the wire out of it draws
 * itself with a pulse running ahead of the light, the next card lights. The
 * sequence is explained by being performed.
 *
 * The geometry and the visibility gate are shared with that section rather than
 * copied — see lib/flow.ts. What is different here is the ground: this runs on
 * the concept's black slab, so every value is inverted and the lit state is
 * carried by a green glow rather than by a tint.
 *
 * Each stage has a drawn mark rather than a stock icon or a photograph. They
 * are stroked with `currentColor` at a single weight, and that colour is mixed
 * against `--lit`, so a mark goes from stone to brand green as the light
 * reaches its card. Nothing is fetched for them.
 */

type Step = {
  id: string;
  number: string;
  when: string;
  title: string;
  body: string;
  /**
   * This stage's own hue.
   *
   * Seven cards lit in one colour is a band of green on black, which is both
   * loud and uninformative. A hue per stage lets the eye track one of them
   * across the canvas, and it keeps the brand green for the one thing that
   * should own it — the light running along the wire.
   */
  accent: string;
  /** Where it sits on the four-by-two canvas. Ignored once the cards stack. */
  place: string;
};

/**
 * Seven stages, snaking: four across the top left to right, then three back
 * along the bottom right to left. DOM order is reading order, which is also
 * the order they stack in below the breakpoint.
 */
const STEPS: Step[] = [
  {
    id: "brief",
    accent: "#5b8cff",
    number: "01",
    when: "Hour 0",
    title: "Brief lands",
    body: "Form, email, WhatsApp or call — all four reach one inbox, read by the engineers who would run the build rather than by a sales desk.",
    place: "lg:col-start-1 lg:row-start-1",
  },
  {
    id: "reply",
    accent: "#a78bfa",
    number: "02",
    when: "4 hours",
    title: "A human replies",
    body: "The engineer who picks it up answers by name, inside four business hours, with a question, a calendar link or a first number.",
    place: "lg:col-start-2 lg:row-start-1",
  },
  {
    id: "call",
    accent: "#f472b6",
    number: "03",
    when: "Day 1–2",
    title: "Strategy call",
    body: "Free, thirty minutes, with the two projects closest to yours on screen. Some briefs are clear enough that we skip straight past it.",
    place: "lg:col-start-3 lg:row-start-1",
  },
  {
    id: "quote",
    accent: "#2dd4bf",
    number: "04",
    when: "Day 2–5",
    title: "Written quote",
    body: "Scope, timeline, price and the team assigned — in writing. If we cannot hit your window, this is where we say so.",
    place: "lg:col-start-4 lg:row-start-1",
  },
  {
    id: "kickoff",
    accent: "#fbbf24",
    number: "05",
    when: "Week 1",
    title: "Kickoff",
    body: "The contract goes out the day you say yes, and kickoff follows inside 48 hours. Access, environments and the backlog are set up that week.",
    place: "lg:col-start-4 lg:row-start-2",
  },
  {
    id: "build",
    accent: "#38bdf8",
    number: "06",
    when: "Every 2 weeks",
    title: "Design & build",
    body: "Two-week cycles against the signed scope, each ending on something you can open. Weekly written updates and an open backlog throughout.",
    place: "lg:col-start-3 lg:row-start-2",
  },
  {
    id: "delivery",
    accent: "#fb923c",
    number: "07",
    when: "Launch",
    title: "Delivery",
    body: "A rehearsed cutover with a way back, the source and the documentation handed over, and months of support rather than a goodbye email.",
    place: "lg:col-start-2 lg:row-start-2",
  },
];

type Edge = {
  from: string;
  to: string;
  /**
   * `along` leaves one side and enters the other, handling a change of row on
   * its own. `across` drops out of the bottom and comes back down into the
   * top — the turn at the end of the first band.
   */
  route: "along" | "across";
};

const EDGES: Edge[] = [
  { from: "brief", to: "reply", route: "along" },
  { from: "reply", to: "call", route: "along" },
  { from: "call", to: "quote", route: "along" },
  { from: "quote", to: "kickoff", route: "across" },
  { from: "kickoff", to: "build", route: "along" },
  { from: "build", to: "delivery", route: "along" },
];

/** Enough groups for the widest of the two layouts. */
const WIRE_SLOTS = Math.max(EDGES.length, STEPS.length - 1);

const WIRE_RADIUS = 18;

/** How far above a destination the turn at the end of the band travels. */
const LANE_ABOVE = 30;

/**
 * The seven marks, one per stage.
 *
 * Drawn rather than fetched, on one 24-unit box at one stroke weight, so the
 * set reads as a family instead of as seven icons from seven places. Each is
 * two-tone: the object is white line-work and one element inside it — the
 * letter dropping into the tray, the flag on the pole, the tick on the box —
 * is filled in that stage's own colour. That way the marks carry the colour on
 * this section and the brand green is left to the wire, where the travelling
 * light is the only thing that should be claiming attention.
 *
 * `base` inherits currentColor, which the card drives from unlit stone to
 * white. `tint` is the accent and is painted whatever the stage's hue is.
 */
const MARKS: Record<string, { base: React.ReactNode; tint: React.ReactNode }> = {
  brief: {
    base: (
      <>
        <path d="M3 13.5h5l1.2 2.2h5.6L16 13.5h5" />
        <path d="M3 13.5 5.6 5.2A1.6 1.6 0 0 1 7.1 4h9.8a1.6 1.6 0 0 1 1.5 1.2L21 13.5V18a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
      </>
    ),
    tint: <path d="M12 3.2v6.4m0 0 2.3-2.3M12 9.6 9.7 7.3" />,
  },
  reply: {
    base: (
      <>
        <path d="M9 7 4 11.5 9 16" />
        <path d="M4 11.5h9.5a6 6 0 0 1 6 6V20" />
      </>
    ),
    tint: <circle cx="19.5" cy="6.2" r="2.4" fill="currentColor" stroke="none" />,
  },
  call: {
    base: (
      <>
        <path d="M4 12.2v2.3A2.5 2.5 0 0 0 6.5 17H8v-7H6.5A2.5 2.5 0 0 0 4 12.5Z" />
        <path d="M20 12.2v2.3A2.5 2.5 0 0 1 17.5 17H16v-7h1.5A2.5 2.5 0 0 1 20 12.5Z" />
        <path d="M20 15.8v0.7A3.5 3.5 0 0 1 16.5 20H13" />
      </>
    ),
    tint: <path d="M4 10.6a8 8 0 0 1 16 0" />,
  },
  quote: {
    base: (
      <>
        <path d="M6 3.5h7.5L19 9v11.5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" />
        <path d="M13.5 3.5V9H19" />
      </>
    ),
    tint: <path d="M8.5 13h8M8.5 16.5h5" />,
  },
  kickoff: {
    base: <path d="M6 21V3.5" />,
    tint: (
      <path
        d="M6 4.6h10.4l-2.2 3.5 2.2 3.5H6z"
        fill="currentColor"
        fillOpacity="0.9"
        stroke="none"
      />
    ),
  },
  build: {
    base: (
      <>
        <path d="m3.5 12 8.5 4.5 8.5-4.5" />
        <path d="m3.5 16.5 8.5 4.5 8.5-4.5" />
      </>
    ),
    tint: (
      <path
        d="m12 3 8.5 4.5L12 12 3.5 7.5 12 3Z"
        fill="currentColor"
        fillOpacity="0.85"
        stroke="none"
      />
    ),
  },
  delivery: {
    base: (
      <>
        <path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5Z" />
        <path d="m3.5 7.5 8.5 4.5 8.5-4.5M12 12v9" />
      </>
    ),
    tint: <path d="m8.7 14.3 2.1 2.1 4.3-4.3" strokeWidth={1.9} />,
  },
};

function Mark({ id, accent }: { id: string; accent: string }) {
  const mark = MARKS[id];
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="size-[21px]"
    >
      {mark.base}
      <g style={{ color: accent }}>{mark.tint}</g>
    </svg>
  );
}

export default function ContactTimeline() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 80%" });

      gsap.from(".tl-head", {
        y: 24,
        opacity: 0,
        duration: 0.85,
        ease: "power2.out",
        scrollTrigger: trigger,
      });

      gsap.from(".tl-card", {
        y: 22,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.07,
        delay: 0.15,
        scrollTrigger: reveal(sectionRef.current?.querySelector(".tl-flow") ?? null, {
          start: "top 88%",
        }),
      });
    },
    { scope: sectionRef },
  );

  useGSAP(
    () => {
      const flow = sectionRef.current?.querySelector<HTMLElement>(".tl-flow");
      const svg = flow?.querySelector<SVGSVGElement>(".tl-wires");
      if (!flow || !svg) return;

      const cardOf = (id: string) => flow.querySelector<HTMLElement>(`[data-node="${id}"]`);
      const reduced = prefersReducedMotion();

      let timeline: gsap.core.Timeline | null = null;
      let release: (() => void) | null = null;

      const build = () => {
        timeline?.kill();
        timeline = null;
        release?.();
        release = null;

        const width = flow.offsetWidth;
        const height = flow.offsetHeight;
        if (!width || !height) return;

        // One SVG user unit per CSS pixel, so a 1px stroke is 1px everywhere
        // and the corner fillets stay circular.
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

        const sideOf = (el: HTMLElement, side: "top" | "right" | "bottom" | "left") =>
          anchor(el, flow, side);

        const stacked = !window.matchMedia("(min-width: 1024px)").matches;

        // Stacked there is one column and nowhere to snake, so the edge list
        // collapses to a plain chain down it.
        const active: Edge[] = stacked
          ? STEPS.slice(0, -1).map((step, i) => ({
              from: step.id,
              to: STEPS[i + 1].id,
              route: "across" as const,
            }))
          : EDGES;

        const drawn: { edge: Edge; lights: SVGPathElement[] }[] = [];

        for (let slot = 0; slot < WIRE_SLOTS; slot += 1) {
          const group = svg.querySelector<SVGGElement>(`[data-wire="${slot}"]`);
          if (!group) continue;

          const edge = active[slot];
          const from = edge ? cardOf(edge.from) : null;
          const to = edge ? cardOf(edge.to) : null;

          if (!edge || !from || !to) {
            group.setAttribute("opacity", "0");
            continue;
          }
          group.removeAttribute("opacity");

          let points: Point[] = [];

          if (edge.route === "along") {
            // Which way round the band runs. The canvas snakes — the second
            // row reads right to left — and taken as always left-to-right, a
            // wire would leave the far side of its own card and be drawn
            // straight through the one it was heading for.
            const rightwards = layoutFrame(to, flow).x >= layoutFrame(from, flow).x;
            const start = sideOf(from, rightwards ? "right" : "left");
            const end = sideOf(to, rightwards ? "left" : "right");
            const midX = (start.x + end.x) / 2;
            points = [start, { x: midX, y: start.y }, { x: midX, y: end.y }, end];
          } else {
            const start = sideOf(from, "bottom");
            const end = sideOf(to, "top");
            const lane = Math.max(start.y + 18, end.y - LANE_ABOVE);
            points = [start, { x: start.x, y: lane }, { x: end.x, y: lane }, end];
          }

          const d = roundedPath(points, WIRE_RADIUS);
          const lights: SVGPathElement[] = [];

          group.querySelectorAll<SVGPathElement>("path").forEach((path) => {
            path.setAttribute("d", d);

            if (path.classList.contains("tl-wire-base")) return;

            const length = path.getTotalLength();

            if (path.classList.contains("tl-wire-pulse")) {
              // A zero-length dash with a round cap is a dot. Shifting the
              // pattern forward by the whole length walks it along the path.
              gsap.set(path, { strokeDasharray: `0.1 ${length}`, strokeDashoffset: 0 });
              return;
            }

            gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
            lights.push(path);
          });

          // The little rings where a wire meets a card.
          const ends = [points[0], points[points.length - 1]];
          group.querySelectorAll<SVGCircleElement>("circle").forEach((dot, i) => {
            const end = ends[i] ?? ends[0];
            dot.setAttribute("cx", end.x.toFixed(1));
            dot.setAttribute("cy", end.y.toFixed(1));
          });

          drawn.push({ edge, lights });
        }

        gsap.set(".tl-card", { "--lit": 0 });
        gsap.set(".tl-wire-pulse", { opacity: 0 });

        if (reduced) {
          // The whole graph on, at rest. The information is the wiring, not
          // the travelling light, so none of it is withheld.
          drawn.forEach(({ lights }) => gsap.set(lights, { strokeDashoffset: 0 }));
          gsap.set(".tl-card", { "--lit": 1 });
          return;
        }

        const run = gsap.timeline({ repeat: -1, repeatDelay: 1.4, paused: true });

        const first = cardOf(active[0]?.from ?? STEPS[0].id);
        if (first) run.to(first, { "--lit": 1, duration: 0.4, ease: "power2.out" });

        drawn.forEach(({ edge, lights }) => {
          const group = lights[0]?.closest("g");
          const pulse = group?.querySelector<SVGPathElement>(".tl-wire-pulse");
          const duration = edge.route === "across" ? 0.95 : 0.7;
          const at = `>-${Math.min(0.2, duration / 4)}`;

          run.to(lights, { strokeDashoffset: 0, duration, ease: "power1.inOut" }, at);

          if (pulse) {
            const length = pulse.getTotalLength();
            run.set(pulse, { opacity: 1 }, "<");
            run.to(pulse, { strokeDashoffset: -length, duration, ease: "power1.inOut" }, "<");
            run.set(pulse, { opacity: 0, strokeDashoffset: 0 }, ">");
          }

          const target = cardOf(edge.to);
          if (target) run.to(target, { "--lit": 1, duration: 0.35, ease: "power2.out" }, "-=0.2");
        });

        // Held at full, then wiped back before it runs again, so the reset
        // reads as deliberate rather than as a jump cut.
        run.to({}, { duration: 1.8 });
        run.to(
          drawn.flatMap(({ lights }) => lights),
          {
            strokeDashoffset: (i, target: SVGPathElement) => target.getTotalLength(),
            duration: 0.55,
            ease: "power2.in",
          },
        );
        run.to(".tl-card", { "--lit": 0, duration: 0.45 }, "<");

        timeline = run;
        release = whileVisible(flow, { on: () => run.play(), off: () => run.pause() });
      };

      build();

      // The grid reflows on resize and the fonts settling changes card
      // heights, so the geometry is taken again rather than trusted.
      const rebuild = gsap.delayedCall(0.15, build).pause();
      const onResize = () => rebuild.restart(true);

      window.addEventListener("resize", onResize);
      void document.fonts?.ready.then(() => rebuild.restart(true));

      return () => {
        window.removeEventListener("resize", onResize);
        rebuild.kill();
        timeline?.kill();
        release?.();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="mx-[clamp(8px,1.2vw,16px)] overflow-hidden rounded-[clamp(24px,3vw,40px)] bg-black text-bg"
    >
      <div className="mx-auto w-full max-w-[1360px] px-[clamp(20px,4vw,48px)] py-[clamp(72px,9vw,128px)]">
        <div className="tl-head grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-end gap-x-[64px] gap-y-[24px] pb-[clamp(44px,5vw,72px)]">
          <div className="flex flex-col gap-[20px]">
            <span className="flex items-center gap-[10px] font-mono text-[12px] uppercase leading-none tracking-[0.08em] text-white/60">
              <span aria-hidden className="h-[2px] w-[24px] shrink-0 bg-primary-green" />
              From first message to launch
            </span>
            <h2 className="m-0 font-display text-[clamp(40px,5vw,72px)] font-semibold leading-[0.98] tracking-[-0.05em] text-balance text-bg">
              Your project,{" "}
              <span className="font-serif font-normal italic tracking-[-0.02em] text-primary-green">
                start to finish
              </span>
            </h2>
          </div>

          <p className="m-0 max-w-[500px] font-body text-[18px] leading-[1.55] tracking-[-0.1px] text-pretty text-white/60">
            Seven steps, each with an owner and a deadline. You always know who has your
            project and what happens next.
          </p>
        </div>

        <div className="tl-flow relative w-full">
          {/* A dot field behind the graph, faded off at the edges, so the slab
              reads as a surface the wiring is laid on rather than as a void. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-[24px] -inset-y-[36px] [background-image:radial-gradient(circle,rgba(255,255,255,0.075)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_84%_72%_at_50%_50%,black,transparent)]"
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden lg:block"
          >
            {["25%", "50%", "75%"].map((left) => (
              <span
                key={left}
                style={{ left }}
                className="absolute -top-[26px] bottom-[-26px] w-px border-l border-dashed border-white/[0.08]"
              />
            ))}
          </div>

          <svg
            aria-hidden
            className="tl-wires pointer-events-none absolute inset-0 size-full overflow-visible"
            preserveAspectRatio="none"
            fill="none"
          >
            {Array.from({ length: WIRE_SLOTS }, (_, slot) => (
              <g key={slot} data-wire={slot}>
                <path
                  className="tl-wire-base"
                  stroke="rgba(255,255,255,0.14)"
                  strokeWidth={1}
                  strokeLinecap="round"
                />
                {/* Halo first, hairline over it: together they read as a lit
                    filament rather than as a green line. */}
                <path
                  className="tl-wire-light"
                  stroke="var(--color-primary-green)"
                  strokeWidth={7}
                  strokeLinecap="round"
                  opacity={0.18}
                />
                <path
                  className="tl-wire-light"
                  stroke="var(--color-primary-green)"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                />
                {/* Rides ahead of the light. A zero-length round-capped dash. */}
                <path
                  className="tl-wire-pulse"
                  stroke="var(--color-primary-green)"
                  strokeWidth={6}
                  strokeLinecap="round"
                />
                <circle r={3} fill="#141413" stroke="rgba(255,255,255,0.22)" strokeWidth={1} />
                <circle r={3} fill="#141413" stroke="rgba(255,255,255,0.22)" strokeWidth={1} />
              </g>
            ))}
          </svg>

          {/* Four across, two deep: the band runs left to right along the top
              and turns back along the bottom. */}
          <ol className="relative m-0 grid w-full list-none grid-cols-1 gap-y-[34px] p-0 lg:grid-cols-4 lg:gap-x-[46px] lg:gap-y-[40px]">
            {STEPS.map((step) => (
              <li key={step.id} className={`relative flex ${step.place}`}>
                <article
                  data-node={step.id}
                  style={{ "--lit": 0, "--accent": step.accent } as CSSProperties}
                  className="tl-card relative flex w-full flex-col gap-[10px] rounded-[16px] bg-[#141413] p-[16px]"
                >
                  {/* Border and glow both read off the one lit value, drawn as
                      overlays so neither disturbs the card's own box. The
                      border goes white rather than green — green on this
                      section belongs to the wire — and only the glow carries
                      the stage's own colour. */}
                  <span
                    aria-hidden
                    style={{
                      borderColor:
                        "color-mix(in srgb, var(--color-white) calc(10% + var(--lit) * 26%), transparent)",
                    }}
                    className="pointer-events-none absolute inset-0 rounded-[16px] border"
                  />
                  <span
                    aria-hidden
                    style={{
                      opacity: "var(--lit)",
                      background:
                        "radial-gradient(70% 70% at 50% 0%, color-mix(in srgb, var(--accent) 30%, transparent), transparent 72%)",
                    }}
                    className="pointer-events-none absolute -inset-[3px] rounded-[19px] blur-[4px]"
                  />

                  <div className="relative flex items-center justify-between gap-[10px]">
                    <span
                      style={{
                        color:
                          "color-mix(in srgb, var(--color-white) calc(var(--lit) * 100%), #8a8a83)",
                        borderColor:
                          "color-mix(in srgb, var(--accent) calc(18% + var(--lit) * 52%), rgba(255,255,255,0.10))",
                        backgroundColor:
                          "color-mix(in srgb, var(--accent) calc(6% + var(--lit) * 14%), rgba(255,255,255,0.03))",
                      }}
                      className="flex size-[40px] shrink-0 items-center justify-center rounded-[12px] border"
                    >
                      <Mark id={step.id} accent={step.accent} />
                    </span>

                    <span className="flex flex-col items-end gap-[5px]">
                      <span
                        style={{
                          color:
                            "color-mix(in srgb, var(--accent) calc(55% + var(--lit) * 45%), #8a8a83)",
                        }}
                        className="font-mono text-[10px] font-semibold uppercase leading-none tracking-[0.1em]"
                      >
                        {step.when}
                      </span>
                      <span className="font-mono text-[11px] leading-none tracking-[0.08em] text-white/35">
                        {step.number}
                      </span>
                    </span>
                  </div>

                  <h3 className="relative m-0 font-display text-[17px] font-semibold leading-[1.18] tracking-[-0.03em] text-bg">
                    {step.title}
                  </h3>

                  <p className="relative m-0 font-body text-[12.5px] leading-[1.55] tracking-[-0.1px] text-pretty text-white/55">
                    {step.body}
                  </p>
                </article>
              </li>
            ))}

            {/* The one cell the snake leaves free, given to the key rather than
                left as a hole at the end of the reading order. */}
            <li className="relative hidden lg:col-start-1 lg:row-start-2 lg:flex">
              <div className="flex w-full flex-col justify-end gap-[10px] pb-[4px]">
                <span className="flex items-center gap-[8px]">
                  <span aria-hidden className="size-[6px] shrink-0 rounded-full bg-primary-green" />
                  <span className="font-mono text-[10.5px] uppercase leading-none tracking-[0.08em] text-white/55">
                    Stage reached
                  </span>
                </span>
                <span className="flex items-center gap-[8px]">
                  <span aria-hidden className="h-px w-[18px] shrink-0 bg-white/25" />
                  <span className="font-mono text-[10.5px] uppercase leading-none tracking-[0.08em] text-white/40">
                    Still to come
                  </span>
                </span>
                <span className="mt-[4px] font-body text-[12px] leading-[1.5] tracking-[-0.1px] text-white/40">
                  Every stage has a named owner and a date. Nothing moves without one.
                </span>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
