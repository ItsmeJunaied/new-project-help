"use client";

import { useRef, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";

type Stage = {
  id: string;
  number: string;
  title: string;
  copy: string;
  /** How long this stage runs — the question every scope call opens with. */
  span: string;
  /** What you are holding at the end of it. */
  output: string;
};

const STAGES: Stage[] = [
  {
    id: "discovery",
    number: "01",
    title: "Discovery",
    copy: "Your users, your deadline and your budget — before anybody names a technology.",
    span: "One call",
    output: "Discovery notes",
  },
  {
    id: "scope",
    number: "02",
    title: "Scope & Architecture",
    copy: "A written scope, wireframes, the stack, and a fixed price and timeline to sign off.",
    span: "1–2 weeks",
    output: "Signed scope",
  },
  {
    id: "design",
    number: "03",
    title: "Design & Prototype",
    copy: "Screens and a clickable prototype, reviewed with you while changing them is still cheap.",
    span: "2–3 weeks",
    output: "Approved UI",
  },
  {
    id: "build",
    number: "04",
    title: "Sprint Build",
    copy: "Two-week slices. A standup every morning, a demo at the end, and a backlog you help order.",
    span: "The bulk of it",
    output: "Working software",
  },
  {
    id: "launch",
    number: "05",
    title: "QA & Go-Live",
    copy: "Tested on staging, accepted by you, then a rehearsed release with a way back out of it.",
    span: "1 week",
    output: "Live system",
  },
  {
    id: "support",
    number: "06",
    title: "Support & Iterate",
    copy: "Six to twelve months of fixes on us, monitoring in place, and the next slice already scoped.",
    span: "6–12 months",
    output: "Roadmap",
  },
];

type Side = "top" | "right" | "bottom" | "left";

type Edge = {
  from: string;
  to: string;
  /**
   * How the wire leaves and enters on the three-column layout. `across` is the
   * long return run between the two rows — out of the bottom of the last card in
   * row one, along the gap, and into the top of the first card in row two.
   */
  route: "along" | "across" | "under";
  /** The iteration edge is not a step forward, so it is drawn as one that isn't. */
  dashed?: boolean;
  /** Dropped when the cards stack and there is no room beside them. */
  wideOnly?: boolean;
};

const EDGES: Edge[] = [
  { from: "discovery", to: "scope", route: "along" },
  { from: "scope", to: "design", route: "along" },
  { from: "design", to: "build", route: "across" },
  { from: "build", to: "launch", route: "along" },
  { from: "launch", to: "support", route: "along" },
  { from: "support", to: "build", route: "under", dashed: true, wideOnly: true },
];

/** Corner radius on the wires. Generous, because these are the visual. */
const WIRE_RADIUS = 22;

/** How far below the cards the iteration wire is routed. */
const UNDER_OUTSET = 34;

type Point = { x: number; y: number };

/**
 * An orthogonal polyline with its corners rounded off.
 *
 * Straight-line SVG elbows read as a wiring diagram; rounded ones read as the
 * reference this section was drawn from. Each corner is cut back by the radius
 * along both of its legs and bridged with a quadratic whose control point is the
 * corner itself, which is exactly a circular-ish fillet and costs one command.
 *
 * The radius is clamped to half the shorter leg so a tight corner narrows its
 * own fillet instead of overshooting into the next one.
 */
function roundedPath(points: Point[], radius: number) {
  // Collinear and duplicate waypoints produce zero-length legs, and a fillet on
  // one of those is a NaN in the `d` attribute that voids the whole path.
  const via: Point[] = points.filter((point, index) => {
    if (index === 0 || index === points.length - 1) return true;
    const before = points[index - 1];
    const after = points[index + 1];
    if (point.x === before.x && point.x === after.x) return false;
    if (point.y === before.y && point.y === after.y) return false;
    return !(point.x === before.x && point.y === before.y);
  });

  if (via.length < 2) return "";

  let d = `M ${via[0].x.toFixed(1)} ${via[0].y.toFixed(1)}`;

  for (let i = 1; i < via.length - 1; i += 1) {
    const previous = via[i - 1];
    const corner = via[i];
    const next = via[i + 1];

    const inLength = Math.hypot(corner.x - previous.x, corner.y - previous.y);
    const outLength = Math.hypot(next.x - corner.x, next.y - corner.y);
    const r = Math.min(radius, inLength / 2, outLength / 2);

    const entry = {
      x: corner.x + ((previous.x - corner.x) / inLength) * r,
      y: corner.y + ((previous.y - corner.y) / inLength) * r,
    };
    const exit = {
      x: corner.x + ((next.x - corner.x) / outLength) * r,
      y: corner.y + ((next.y - corner.y) / outLength) * r,
    };

    d += ` L ${entry.x.toFixed(1)} ${entry.y.toFixed(1)}`;
    d += ` Q ${corner.x.toFixed(1)} ${corner.y.toFixed(1)} ${exit.x.toFixed(1)} ${exit.y.toFixed(1)}`;
  }

  const last = via[via.length - 1];
  return `${d} L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
}

/**
 * The delivery process, drawn as a node graph that lights itself up.
 *
 * Six stages on a three-by-two canvas, wired with rounded orthogonal
 * connectors. A GSAP timeline then walks the graph in order: a stage comes up,
 * the wire out of it draws itself towards the next stage, that stage comes up,
 * and so on to the end — so the diagram explains the sequence by performing it
 * rather than by numbering it.
 *
 * The wires are SVG because they turn corners, and their geometry is MEASURED
 * rather than declared: the cards are laid out by CSS grid, and the connectors
 * are computed from where the browser actually put them. A hand-written viewBox
 * would need `preserveAspectRatio="none"` to stretch, which would make the
 * stroke thicker horizontally than vertically and the corners visibly oval.
 */
export default function WorkingProcess() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 80%" });

      gsap.from(".process-heading-inner", {
        yPercent: 110,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: trigger,
      });

      gsap.from(".process-meta", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: trigger,
      });

      gsap.from(".process-divider", {
        scaleX: 0,
        duration: 1.1,
        ease: "power2.inOut",
        transformOrigin: "left center",
        scrollTrigger: trigger,
      });

      gsap.from(".process-card", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.07,
        scrollTrigger: reveal(sectionRef.current?.querySelector(".process-flow") ?? null, {
          start: "top 85%",
        }),
      });
    },
    { scope: sectionRef },
  );

  /**
   * The wiring, and the light that runs it.
   *
   * Rebuilt whole on resize rather than patched: the cards move to a different
   * grid at the breakpoint, every waypoint changes with them, and a path whose
   * `d` is recomputed needs its dash lengths recomputed too. Tearing the
   * timeline down and drawing it again is both simpler and correct.
   */
  useGSAP(
    () => {
      const flow = sectionRef.current?.querySelector<HTMLElement>(".process-flow");
      const svg = flow?.querySelector<SVGSVGElement>(".process-wires");
      if (!flow || !svg) return;

      const cardOf = (id: string) => flow.querySelector<HTMLElement>(`[data-stage="${id}"]`);
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

        // One SVG user unit per CSS pixel, so a 1px stroke is 1px everywhere and
        // the corner fillets stay circular.
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

        /**
         * A card's box in LAYOUT coordinates — offsets, not bounding rects.
         *
         * The cards are under an entrance tween when this first runs, and a
         * bounding rect includes that tween's transform: measured there, every
         * wire would be pinned to where its card was passing through rather than
         * to where it comes to rest, and the whole diagram would sit thirty
         * pixels low once the cards settled. Offsets are the untransformed
         * layout, which is what the wires actually have to meet.
         */
        const frame = (element: HTMLElement) => {
          let x = 0;
          let y = 0;
          let node: HTMLElement | null = element;

          while (node && node !== flow) {
            x += node.offsetLeft;
            y += node.offsetTop;
            node = node.offsetParent as HTMLElement | null;
          }

          return { x, y, w: element.offsetWidth, h: element.offsetHeight };
        };

        const anchor = (element: HTMLElement, side: Side): Point => {
          const f = frame(element);
          if (side === "right") return { x: f.x + f.w, y: f.y + f.h / 2 };
          if (side === "left") return { x: f.x, y: f.y + f.h / 2 };
          if (side === "bottom") return { x: f.x + f.w / 2, y: f.y + f.h };
          return { x: f.x + f.w / 2, y: f.y };
        };

        // Below the breakpoint the cards are one per row, so every wire is a
        // simple drop from the card above into the one below whatever the edge
        // asked for on the wide layout.
        const stacked = !window.matchMedia("(min-width: 1024px)").matches;

        const drawn: { edge: Edge; lights: SVGPathElement[] }[] = [];

        EDGES.forEach((edge, index) => {
          const group = svg.querySelector<SVGGElement>(`[data-edge="${index}"]`);
          const from = cardOf(edge.from);
          const to = cardOf(edge.to);
          if (!group || !from || !to) return;

          if (stacked && edge.wideOnly) {
            group.setAttribute("opacity", "0");
            return;
          }
          group.removeAttribute("opacity");

          const route = stacked ? "across" : edge.route;
          let points: Point[] = [];

          if (route === "along") {
            const start = anchor(from, "right");
            const end = anchor(to, "left");
            const midX = (start.x + end.x) / 2;
            points = [start, { x: midX, y: start.y }, { x: midX, y: end.y }, end];
          } else if (route === "across") {
            const start = anchor(from, "bottom");
            const end = anchor(to, "top");
            const midY = (start.y + end.y) / 2;
            points = [start, { x: start.x, y: midY }, { x: end.x, y: midY }, end];
          } else {
            // Out of the bottom of one card, along beneath both, and back up
            // into the bottom of the other.
            const start = anchor(from, "bottom");
            const end = anchor(to, "bottom");
            const lane = Math.max(start.y, end.y) + UNDER_OUTSET;
            points = [start, { x: start.x, y: lane }, { x: end.x, y: lane }, end];
          }

          const d = roundedPath(points, WIRE_RADIUS);
          const lights: SVGPathElement[] = [];

          group.querySelectorAll<SVGPathElement>("path").forEach((path) => {
            path.setAttribute("d", d);

            if (!path.classList.contains("process-wire-light")) return;

            const length = path.getTotalLength();
            gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
            lights.push(path);
          });

          drawn.push({ edge, lights });
        });

        gsap.set(".process-card", { "--lit": 0 });

        if (reduced) {
          // The whole graph on, at rest. The information is the wiring, not the
          // travelling light, so none of it is withheld.
          drawn.forEach(({ lights }) => gsap.set(lights, { strokeDashoffset: 0 }));
          gsap.set(".process-card", { "--lit": 1 });
          return;
        }

        const run = gsap.timeline({ repeat: -1, repeatDelay: 1.4, paused: true });

        // The first stage has no wire into it, so it lights on its own.
        const first = cardOf(STAGES[0].id);
        if (first) run.to(first, { "--lit": 1, duration: 0.4, ease: "power2.out" });

        drawn.forEach(({ edge, lights }) => {
          // The iteration wire loops back to a stage that is already lit, so it
          // draws without claiming to activate anything.
          const target = edge.dashed ? null : cardOf(edge.to);

          run.to(lights, {
            strokeDashoffset: 0,
            duration: edge.route === "across" ? 1.1 : 0.8,
            ease: "power1.inOut",
          });

          if (target) {
            run.to(target, { "--lit": 1, duration: 0.35, ease: "power2.out" }, "-=0.22");
          }
        });

        // Held at full, then wiped back to nothing before it runs again, so the
        // reset reads as deliberate rather than as a jump cut.
        run.to({}, { duration: 1.6 });
        run.to(
          drawn.flatMap(({ lights }) => lights),
          { strokeDashoffset: (i, target: SVGPathElement) => target.getTotalLength(), duration: 0.5, ease: "power2.in" },
        );
        run.to(".process-card", { "--lit": 0, duration: 0.4 }, "<");

        timeline = run;
        release = whileVisible(flow, {
          on: () => run.play(),
          off: () => run.pause(),
        });
      };

      build();

      // The grid reflows on resize and the fonts settling changes card heights,
      // so the geometry is taken again rather than trusted.
      const rebuild = gsap.delayedCall(0.15, build).pause();
      const onResize = () => rebuild.restart(true);

      window.addEventListener("resize", onResize);
      document.fonts?.ready.then(() => rebuild.restart(true));

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
      data-node-id="156:8025"
      className="w-full overflow-x-clip bg-black py-[80px] lg:py-[120px]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[40px]">
        <div className="flex w-full flex-col items-start gap-6 lg:flex-row lg:gap-[204px]">
          <p className="process-meta shrink-0 font-body text-[18px] font-medium leading-[18px] tracking-[-0.25px] text-ash-muted">
            [ Working Process ]
          </p>
          <div className="w-full">
            <h2 className="font-display text-[clamp(2.25rem,4.4vw,64px)] font-medium leading-[1.1] tracking-[-1.5px] text-white">
              <span className="block overflow-hidden">
                <span className="process-heading-inner block">Our proven delivery</span>
              </span>
              <span className="block overflow-hidden">
                <span className="process-heading-inner block">Process</span>
              </span>
            </h2>
          </div>
        </div>

        <div className="process-divider mt-[32px] h-px w-full bg-[#313131] lg:mt-[48px]" />

        <div className="mt-[32px] flex w-full flex-col items-start justify-between gap-[24px] lg:mt-[40px] lg:flex-row lg:items-end">
          <p className="process-meta max-w-[560px] font-display text-[20px] leading-[1.3] tracking-[-0.25px] text-ash-muted">
            A clear, collaborative process that turns a vague idea into software
            running in production — six stages, wired end to end.
          </p>

          <div className="process-meta flex items-end gap-[20px]">
            <p className="max-w-[220px] font-display text-[16px] leading-[1.35] tracking-[-0.2px] text-ash-muted">
              Two-week slices, from first call to live system
            </p>
            <p className="font-display text-[clamp(3.5rem,7vw,104px)] font-medium uppercase leading-[0.82] tracking-[-0.0625em] text-white">
              06
            </p>
          </div>
        </div>

        {/* The canvas. Cards are grid children; the wires are an overlay sized to
            the same box, drawn from where the grid actually put them. */}
        <div className="process-flow relative mt-[56px] w-full pb-[56px] lg:mt-[88px] lg:pb-[64px]">
          <svg
            aria-hidden
            className="process-wires pointer-events-none absolute inset-0 size-full overflow-visible"
            preserveAspectRatio="none"
            fill="none"
          >
            {EDGES.map((edge, index) => (
              <g key={`${edge.from}-${edge.to}`} data-edge={index}>
                <path
                  className="process-wire-base"
                  stroke="rgba(255,255,255,0.13)"
                  strokeWidth={1}
                  strokeLinecap="round"
                  strokeDasharray={edge.dashed ? "5 7" : undefined}
                />
                {/* Halo first, hairline over it: together they read as a lit
                    filament rather than as a green line. */}
                <path
                  className="process-wire-light"
                  stroke="var(--color-primary-green)"
                  strokeWidth={7}
                  strokeLinecap="round"
                  opacity={0.16}
                />
                <path
                  className="process-wire-light"
                  stroke="var(--color-primary-green)"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                />
              </g>
            ))}
          </svg>

          {/* The column gap is the length of the wires between neighbours, so it
              is wide enough for a light to visibly travel one rather than blink
              across a stub. */}
          <ol className="relative grid w-full grid-cols-1 gap-y-[64px] lg:grid-cols-3 lg:gap-x-[92px] lg:gap-y-[150px]">
            {STAGES.map((stage) => (
              <li key={stage.id} className="relative flex">
                <article
                  data-stage={stage.id}
                  style={{ "--lit": 0 } as CSSProperties}
                  className="process-card group relative flex w-full flex-col gap-[14px] rounded-[18px] border bg-[#0b0b0b] p-[22px] will-change-transform"
                >
                  {/* Border and fill both read off the one lit value. */}
                  <span
                    aria-hidden
                    style={{
                      borderColor:
                        "color-mix(in srgb, var(--color-primary-green) calc(var(--lit) * 62%), rgba(255,255,255,0.11))",
                    }}
                    className="pointer-events-none absolute inset-0 rounded-[18px] border"
                  />
                  <span
                    aria-hidden
                    style={{ opacity: "var(--lit)" }}
                    className="pointer-events-none absolute inset-0 rounded-[18px] bg-[radial-gradient(130%_110%_at_50%_0%,rgba(134,213,42,0.15),transparent_72%)]"
                  />

                  <div className="relative flex items-center justify-between gap-[10px]">
                    <span className="flex items-center gap-[9px]">
                      <span
                        aria-hidden
                        className="relative flex size-[9px] items-center justify-center"
                      >
                        <span
                          style={{
                            opacity: "var(--lit)",
                            transform: "scale(calc(0.7 + var(--lit) * 0.8))",
                          }}
                          className="absolute inset-[-6px] rounded-full bg-[radial-gradient(circle,rgba(134,213,42,0.6),transparent_70%)]"
                        />
                        <span
                          style={{
                            backgroundColor:
                              "color-mix(in srgb, var(--color-primary-green) calc(var(--lit) * 100%), #3d3d3d)",
                          }}
                          className="size-[7px] rounded-full"
                        />
                      </span>
                      <span
                        style={{
                          color:
                            "color-mix(in srgb, var(--color-primary-green) calc(var(--lit) * 100%), #6a6a6a)",
                        }}
                        className="font-mono text-[11px] leading-none tracking-[1px]"
                      >
                        {stage.number}
                      </span>
                    </span>

                    <span className="font-mono text-[10px] uppercase leading-none tracking-[0.6px] text-[#5e5e5e]">
                      {stage.span}
                    </span>
                  </div>

                  <h3 className="relative font-display text-[20px] font-medium leading-[1.16] tracking-[-0.4px] text-white">
                    {stage.title}
                  </h3>

                  <p className="relative font-body text-[13px] leading-[20px] tracking-[-0.1px] text-[#8f8f8f]">
                    {stage.copy}
                  </p>

                  <p className="relative mt-auto flex items-center gap-[7px] border-t border-white/[0.08] pt-[13px] font-body text-[12px] leading-none tracking-[-0.1px] text-ash-muted">
                    <span
                      aria-hidden
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, var(--color-primary-green) calc(22% + var(--lit) * 78%), transparent)",
                      }}
                      className="size-[4px] shrink-0 rounded-full"
                    />
                    {stage.output}
                  </p>
                </article>
              </li>
            ))}
          </ol>

          {/* Sits ON the iteration wire, masking it with its own background, so
              the caption labels that wire rather than floating under it. The
              offset is the container's bottom padding less UNDER_OUTSET — which
              is where the wire's lane lands. */}
          <p className="process-meta pointer-events-none absolute bottom-[30px] left-1/2 hidden -translate-x-1/2 translate-y-1/2 bg-black px-[10px] font-mono text-[10px] uppercase leading-none tracking-[0.6px] text-[#5e5e5e] lg:block">
            ↺ the next slice re-enters the sprint
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Runs `on` while the element is in view and `off` while it is not, and returns
 * the teardown. A plain IntersectionObserver rather than a ScrollTrigger: this
 * only answers "is it visible", and a trigger would be one more thing for the
 * page-wide refresh to measure.
 */
function whileVisible(element: Element, handlers: { on: () => void; off: () => void }) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !document.hidden) handlers.on();
        else handlers.off();
      }
    },
    { threshold: 0.01 },
  );

  observer.observe(element);

  // A backgrounded tab does not move the element, so the observer never fires
  // and the timeline would keep running on a page nobody is looking at.
  const onVisibility = () => {
    if (document.hidden) handlers.off();
    else if (element.getBoundingClientRect().bottom > 0) handlers.on();
  };

  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    observer.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    handlers.off();
  };
}
