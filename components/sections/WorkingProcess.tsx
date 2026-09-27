"use client";

import { useRef, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";
import TechMark, { TechMarkSprite, techLabel, type TechName } from "@/components/ui/TechMarks";

type Node = {
  id: string;
  /** Null for the parallel track, which is not a numbered step of its own. */
  number: string | null;
  title: string;
  copy: string;
  span: string;
  output: string;
  /** What is actually open on a screen during this stage. */
  tools: TechName[];
  /** Where it sits on the four-by-four canvas. Ignored once the cards stack. */
  place: string;
};

/**
 * Seven nodes, not six: the environments track is real work that happens beside
 * the design, and drawing it is what makes this a flow rather than a queue.
 *
 * DOM order is reading order — which is also the order the cards stack in below
 * the breakpoint, where the graph collapses to a single chain.
 */
const NODES: Node[] = [
  {
    id: "discovery",
    number: "01",
    title: "Discovery",
    copy: "Your users, your deadline and your budget — before anybody names a technology.",
    span: "One call",
    output: "Discovery notes",
    tools: ["figma", "github"],
    place: "lg:col-start-1 lg:row-start-2",
  },
  {
    id: "scope",
    number: "02",
    title: "Scope & Architecture",
    copy: "A written scope, wireframes and the stack, at a fixed price and timeline to sign off.",
    span: "1–2 weeks",
    output: "Signed scope",
    tools: ["figma", "postgres", "docker"],
    place: "lg:col-start-2 lg:row-start-2",
  },
  {
    id: "design",
    number: "03",
    title: "Design & Prototype",
    copy: "Screens and a clickable prototype, reviewed while changing them is still cheap.",
    span: "2–3 weeks",
    output: "Approved UI",
    tools: ["figma", "framer"],
    place: "lg:col-start-3 lg:row-start-1",
  },
  {
    id: "envs",
    number: null,
    title: "Environments & CI",
    copy: "Repos, staging and pipelines standing before the first sprint opens.",
    span: "In parallel",
    output: "Staging + CI",
    tools: ["github", "docker", "terraform", "vercel"],
    place: "lg:col-start-3 lg:row-start-3",
  },
  {
    id: "build",
    number: "04",
    title: "Sprint Build",
    copy: "Two-week slices. A standup every morning, a demo at the end of each one.",
    span: "The bulk of it",
    output: "Working software",
    tools: ["react", "nextjs", "typescript", "laravel", "dotnet"],
    place: "lg:col-start-4 lg:row-start-2",
  },
  {
    id: "launch",
    number: "05",
    title: "QA & Go-Live",
    copy: "Tested on staging, accepted by you, then a rehearsed release with a way back.",
    span: "1 week",
    output: "Live system",
    tools: ["github", "docker", "grafana"],
    place: "lg:col-start-2 lg:row-start-4",
  },
  {
    id: "support",
    number: "06",
    title: "Support & Iterate",
    copy: "Six to twelve months of fixes on us, monitoring, and the next slice scoped.",
    span: "6–12 months",
    output: "Roadmap",
    tools: ["grafana", "n8n", "github"],
    place: "lg:col-start-1 lg:row-start-4",
  },
];

type Edge = {
  from: string;
  to: string;
  /**
   * `along` leaves the right-hand side and enters the left — it handles a change
   * of row on its own, which is what draws the fork and the join. `across` drops
   * out of the bottom and comes back down into the top. `loop` is the sprint
   * repeating, and goes up and around rather than anywhere new.
   */
  route: "along" | "across" | "loop";
  dashed?: boolean;
};

/**
 * The graph. Two edges leave `scope` and two arrive at `build`: design and the
 * environments track run beside each other, and the sprint cannot open until
 * both have landed. That fork and join is the shape of the thing.
 */
const EDGES: Edge[] = [
  { from: "discovery", to: "scope", route: "along" },
  { from: "scope", to: "design", route: "along" },
  { from: "scope", to: "envs", route: "along" },
  { from: "design", to: "build", route: "along" },
  { from: "envs", to: "build", route: "along" },
  { from: "build", to: "build", route: "loop", dashed: true },
  { from: "build", to: "launch", route: "across" },
  { from: "launch", to: "support", route: "along" },
];

/** Enough groups for the widest of the two layouts. */
const WIRE_SLOTS = EDGES.length;

/**
 * Every mark this section draws, so the sprite carries exactly those and no
 * more — the full set of artwork is far too heavy to put on a page that shows
 * a dozen of them.
 */
const SPRITE_MARKS = Array.from(new Set(NODES.flatMap((node) => node.tools)));

const WIRE_RADIUS = 20;

/** How far above a destination the long return run travels. */
const LANE_ABOVE = 38;

/** How far outside the card the sprint loop swings. */
const LOOP_OUTSET = 26;

type Point = { x: number; y: number };

/**
 * An orthogonal polyline with its corners rounded off.
 *
 * Square elbows read as a wiring diagram; rounded ones read as the flow charts
 * this was drawn from. Each corner is cut back by the radius along both of its
 * legs and bridged with a quadratic whose control point is the corner itself.
 * The radius is clamped to half the shorter leg, so a tight corner narrows its
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
    if (!inLength || !outLength) continue;

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
 * A cube, drawn in isometric projection: three faces sharing a corner, which is
 * the whole trick — no perspective maths, just a rhombus for the top and a
 * parallelogram down each side, each face a different value of the same colour
 * so the eye reads a light source and therefore a solid.
 *
 * All three faces are mixed against `--lit`, so the block is stone while its
 * stage is waiting and brand green once the light has reached it. It sits on a
 * soft ellipse rather than in mid-air, because a shadow is most of what makes a
 * drawn object look like it is somewhere.
 */
function IsoBlock({ className }: { className?: string }) {
  const face = (percent: number, fallback: string) =>
    `color-mix(in srgb, var(--color-primary-green) calc(var(--lit) * ${percent}%), ${fallback})`;

  return (
    <svg
      viewBox="0 0 44 46"
      className={className}
      aria-hidden
      style={{ overflow: "visible" }}
    >
      <ellipse cx="22" cy="41" rx="14" ry="3.6" fill="rgba(21,21,21,0.09)" />
      {/* Top, then the two walls. Darker going away from the light. */}
      <path d="M22 6 L38 15 L22 24 L6 15 Z" fill={face(70, "#e9eae7")} />
      <path d="M6 15 L22 24 L22 38 L6 29 Z" fill={face(42, "#cfd1cc")} />
      <path d="M38 15 L22 24 L22 38 L38 29 Z" fill={face(24, "#bdbfba")} />
      <path
        d="M22 6 L38 15 L22 24 L6 15 Z M6 15 L6 29 L22 38 L38 29 L38 15"
        fill="none"
        stroke={face(80, "rgba(21,21,21,0.14)")}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The delivery process, drawn as a flow graph that runs itself.
 *
 * Nodes are laid out by CSS grid; the wiring between them is MEASURED from
 * where the browser actually put them and drawn as rounded orthogonal SVG. A
 * timeline then walks the graph — a node lights, the wire out of it draws
 * itself with a pulse running ahead of the light, the next node lights — so the
 * sequence is explained by being performed.
 *
 * Measuring rather than declaring the geometry is what lets the same component
 * serve a four-column graph and a single stacked chain: below the breakpoint
 * the cards fall into one column and the edge list collapses to a chain through
 * them, and every path is simply recomputed from the new positions.
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

      gsap.from(".process-guide", {
        scaleY: 0,
        opacity: 0,
        duration: 1.1,
        ease: "power2.out",
        stagger: 0.07,
        transformOrigin: "top center",
        scrollTrigger: reveal(sectionRef.current?.querySelector(".process-flow") ?? null, {
          start: "top 88%",
        }),
      });

      gsap.from(".process-card", {
        y: 26,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.06,
        scrollTrigger: reveal(sectionRef.current?.querySelector(".process-flow") ?? null, {
          start: "top 85%",
        }),
      });
    },
    { scope: sectionRef },
  );

  /**
   * The tilt. Each card leans a few degrees towards the cursor and lifts off
   * the canvas, which is what makes the row read as objects standing on a
   * surface rather than as rectangles printed on it — and it turns the
   * isometric block on each card into something the light moves across.
   *
   * The wiring underneath is deliberately NOT tilted: the wires are measured in
   * the flat layout, and rotating the card they terminate on would pull the
   * card's edge away from the wire that meets it. Lifting only the card, over
   * a wire that stays put, is also what gives the lift somewhere to read
   * against.
   */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      if (!window.matchMedia("(hover: hover)").matches) return;

      const cleanups = gsap.utils.toArray<HTMLElement>(".process-card").map((card) => {
        const rotateY = gsap.quickTo(card, "rotateY", { duration: 0.5, ease: "power3.out" });
        const rotateX = gsap.quickTo(card, "rotateX", { duration: 0.5, ease: "power3.out" });
        const lift = gsap.quickTo(card, "z", { duration: 0.5, ease: "power3.out" });

        const onMove = (event: PointerEvent) => {
          const box = card.getBoundingClientRect();
          rotateY(((event.clientX - (box.left + box.width / 2)) / box.width) * 10);
          rotateX(((event.clientY - (box.top + box.height / 2)) / box.height) * -8);
          lift(34);
        };

        const onLeave = () => {
          rotateY(0);
          rotateX(0);
          lift(0);
        };

        card.addEventListener("pointermove", onMove);
        card.addEventListener("pointerleave", onLeave);

        return () => {
          card.removeEventListener("pointermove", onMove);
          card.removeEventListener("pointerleave", onLeave);
        };
      });

      return () => cleanups.forEach((off) => off());
    },
    { scope: sectionRef },
  );

  useGSAP(
    () => {
      const flow = sectionRef.current?.querySelector<HTMLElement>(".process-flow");
      const svg = flow?.querySelector<SVGSVGElement>(".process-wires");
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

        // One SVG user unit per CSS pixel, so a 1px stroke is 1px everywhere and
        // the corner fillets stay circular.
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

        /**
         * A card's box in LAYOUT coordinates — offsets, not bounding rects.
         *
         * The cards are under an entrance tween when this first runs, and a
         * bounding rect includes that tween's transform: measured there, every
         * wire would be pinned to where its card was passing through rather
         * than to where it comes to rest.
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

        const anchor = (element: HTMLElement, side: "top" | "right" | "bottom" | "left"): Point => {
          const f = frame(element);
          if (side === "right") return { x: f.x + f.w, y: f.y + f.h / 2 };
          if (side === "left") return { x: f.x, y: f.y + f.h / 2 };
          if (side === "bottom") return { x: f.x + f.w / 2, y: f.y + f.h };
          return { x: f.x + f.w / 2, y: f.y };
        };

        const stacked = !window.matchMedia("(min-width: 1024px)").matches;

        /**
         * Stacked, the graph has nowhere to branch: one column of cards, so the
         * only honest drawing is a chain through them in the order they are
         * read. The fork and the sprint loop are wide-layout ideas and are left
         * out rather than folded into a line where they would read as mistakes.
         */
        const active: Edge[] = stacked
          ? NODES.slice(0, -1).map((node, i) => ({
              from: node.id,
              to: NODES[i + 1].id,
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

          if (edge.route === "loop") {
            // An arc standing on the card's own top edge — out of it and back
            // into it — which is the sprint repeating rather than going
            // anywhere new. Deliberately kept inside the card's own width: the
            // gap on either side is where the two joining wires run, and a loop
            // swung out into it would be drawn on top of them.
            const f = frame(from);
            const centre = f.x + f.w / 2;
            const lift = f.y - LOOP_OUTSET;
            points = [
              { x: centre + 40, y: f.y },
              { x: centre + 40, y: lift },
              { x: centre - 40, y: lift },
              { x: centre - 40, y: f.y },
            ];
          } else if (edge.route === "along") {
            // Which way round the row runs. The canvas snakes — row four reads
            // right to left — and taken as always left-to-right, a wire would
            // leave the far side of its own card and be drawn straight through
            // the one it was heading for.
            const rightwards = frame(to).x >= frame(from).x;
            const start = anchor(from, rightwards ? "right" : "left");
            const end = anchor(to, rightwards ? "left" : "right");
            const midX = (start.x + end.x) / 2;
            points = [start, { x: midX, y: start.y }, { x: midX, y: end.y }, end];
          } else {
            const start = anchor(from, "bottom");
            const end = anchor(to, "top");
            // Deliberately not the midpoint: on the wide layout the midpoint
            // lands in the row the parallel track occupies and the wire would
            // be drawn straight through that card. Running just above the
            // destination clears it, and still sits between the two when the
            // cards are stacked.
            const lane = Math.max(start.y + 22, end.y - LANE_ABOVE);
            points = [start, { x: start.x, y: lane }, { x: end.x, y: lane }, end];
          }

          const d = roundedPath(points, WIRE_RADIUS);
          const lights: SVGPathElement[] = [];

          group.querySelectorAll<SVGPathElement>("path").forEach((path) => {
            path.setAttribute("d", d);

            if (path.classList.contains("process-wire-base")) {
              if (edge.dashed) path.setAttribute("stroke-dasharray", "5 7");
              else path.removeAttribute("stroke-dasharray");
              return;
            }

            const length = path.getTotalLength();

            if (path.classList.contains("process-wire-pulse")) {
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
            const at = ends[i] ?? ends[0];
            dot.setAttribute("cx", at.x.toFixed(1));
            dot.setAttribute("cy", at.y.toFixed(1));
          });

          drawn.push({ edge, lights });
        }

        gsap.set(".process-card", { "--lit": 0 });
        gsap.set(".process-wire-pulse", { opacity: 0 });

        if (reduced) {
          // The whole graph on, at rest. The information is the wiring, not the
          // travelling light, so none of it is withheld.
          drawn.forEach(({ lights }) => gsap.set(lights, { strokeDashoffset: 0 }));
          gsap.set(".process-card", { "--lit": 1 });
          return;
        }

        const run = gsap.timeline({ repeat: -1, repeatDelay: 1.5, paused: true });

        const first = cardOf(active[0]?.from ?? NODES[0].id);
        if (first) run.to(first, { "--lit": 1, duration: 0.4, ease: "power2.out" });

        drawn.forEach(({ edge, lights }) => {
          const group = lights[0]?.closest("g");
          const pulse = group?.querySelector<SVGPathElement>(".process-wire-pulse");
          const duration = edge.route === "across" ? 1 : 0.72;
          const at = `>-${Math.min(0.2, duration / 4)}`;

          run.to(lights, { strokeDashoffset: 0, duration, ease: "power1.inOut" }, at);

          if (pulse) {
            const length = pulse.getTotalLength();
            run.set(pulse, { opacity: 1 }, "<");
            run.to(
              pulse,
              { strokeDashoffset: -length, duration, ease: "power1.inOut" },
              "<",
            );
            run.set(pulse, { opacity: 0, strokeDashoffset: 0 }, ">");
          }

          // A self-loop returns to a node that is already lit, so it draws
          // without claiming to activate anything.
          if (edge.from === edge.to) return;

          const target = cardOf(edge.to);
          if (target) run.to(target, { "--lit": 1, duration: 0.35, ease: "power2.out" }, "-=0.2");
        });

        // Held at full, then wiped back before it runs again, so the reset
        // reads as deliberate rather than as a jump cut.
        run.to({}, { duration: 1.7 });
        run.to(
          drawn.flatMap(({ lights }) => lights),
          {
            strokeDashoffset: (i, target: SVGPathElement) => target.getTotalLength(),
            duration: 0.55,
            ease: "power2.in",
          },
        );
        run.to(".process-card", { "--lit": 0, duration: 0.45 }, "<");

        timeline = run;
        release = whileVisible(flow, { on: () => run.play(), off: () => run.pause() });
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
      className="w-full overflow-x-clip bg-bg py-[80px] lg:py-[120px]"
    >
      <TechMarkSprite names={SPRITE_MARKS} />

      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[40px]">
        <div className="flex w-full flex-col items-start gap-6 lg:flex-row lg:gap-[204px]">
          <p className="process-meta shrink-0 font-body text-[18px] font-medium leading-[18px] tracking-[-0.25px] text-[#111]">
            [ Working Process ]
          </p>
          <div className="w-full">
            <h2 className="font-display text-[clamp(2.25rem,4.4vw,64px)] font-medium leading-[1.1] tracking-[-1.5px] text-black">
              <span className="block overflow-hidden">
                <span className="process-heading-inner block">Our proven delivery</span>
              </span>
              <span className="block overflow-hidden">
                <span className="process-heading-inner block text-ash-muted">Process</span>
              </span>
            </h2>
          </div>
        </div>

        <div className="process-divider mt-[32px] h-px w-full bg-black/10 lg:mt-[48px]" />

        <div className="mt-[32px] flex w-full flex-col items-start justify-between gap-[24px] lg:mt-[40px] lg:flex-row lg:items-end">
          <p className="process-meta max-w-[560px] font-display text-[20px] leading-[1.3] tracking-[-0.25px] text-ash-dark">
            A clear, collaborative process that turns a vague idea into software
            running in production — six stages and one parallel track, wired end
            to end.
          </p>

          <div className="process-meta flex items-end gap-[20px]">
            <p className="max-w-[220px] font-display text-[16px] leading-[1.35] tracking-[-0.2px] text-neutral-paragraph">
              Two-week slices, from first call to live system
            </p>
            <p className="font-display text-[clamp(3.5rem,7vw,104px)] font-medium uppercase leading-[0.82] tracking-[-0.0625em] text-black">
              06
            </p>
          </div>
        </div>

        {/* The canvas. Engineering paper, dashed column guides, then the wiring
            overlay, then the cards — each layer sitting above the last. */}
        <div className="process-flow relative mt-[48px] w-full pb-[26px] [perspective:1600px] lg:mt-[76px] lg:pb-[34px]">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-6 -inset-y-[40px] [background-image:radial-gradient(circle,rgba(21,21,21,0.085)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_82%_70%_at_50%_50%,black,transparent)]"
          />

          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 right-0 hidden lg:block">
            {["25%", "50%", "75%"].map((left) => (
              <span
                key={left}
                style={{ left }}
                className="process-guide absolute -top-[30px] bottom-[-30px] w-px border-l border-dashed border-black/[0.10]"
              />
            ))}
          </div>

          <svg
            aria-hidden
            className="process-wires pointer-events-none absolute inset-0 size-full overflow-visible"
            preserveAspectRatio="none"
            fill="none"
          >
            {Array.from({ length: WIRE_SLOTS }, (_, slot) => (
              <g key={slot} data-wire={slot}>
                <path
                  className="process-wire-base"
                  stroke="rgba(21,21,21,0.15)"
                  strokeWidth={1}
                  strokeLinecap="round"
                />
                {/* Halo first, hairline over it: together they read as a lit
                    filament rather than as a green line. */}
                <path
                  className="process-wire-light"
                  stroke="var(--color-primary-green)"
                  strokeWidth={7}
                  strokeLinecap="round"
                  opacity={0.2}
                />
                <path
                  className="process-wire-light"
                  stroke="var(--color-primary-green)"
                  strokeWidth={1.6}
                  strokeLinecap="round"
                />
                {/* Rides ahead of the light. A zero-length round-capped dash. */}
                <path
                  className="process-wire-pulse"
                  stroke="var(--color-primary-green)"
                  strokeWidth={6}
                  strokeLinecap="round"
                />
                <circle r={3} fill="var(--color-bg)" stroke="rgba(21,21,21,0.2)" strokeWidth={1} />
                <circle r={3} fill="var(--color-bg)" stroke="rgba(21,21,21,0.2)" strokeWidth={1} />
              </g>
            ))}
          </svg>

          <ol className="relative grid w-full grid-cols-1 gap-y-[54px] lg:grid-cols-4 lg:gap-x-[54px] lg:gap-y-[58px]">
            {NODES.map((node) => (
              <li key={node.id} className={`relative flex ${node.place}`}>
                <article
                  data-node={node.id}
                  style={{ "--lit": 0 } as CSSProperties}
                  className={
                    "process-card relative flex w-full flex-col gap-[11px] rounded-[16px] bg-white p-[18px] " +
                    "shadow-[0_1px_2px_rgba(21,21,21,0.05),0_18px_32px_-26px_rgba(21,21,21,0.55)] " +
                    "[transform-style:preserve-3d] will-change-transform"
                  }
                >
                  {/* Border and wash both read off the one lit value. Drawn as
                      an overlay so neither disturbs the card's own box. */}
                  <span
                    aria-hidden
                    style={{
                      borderColor:
                        "color-mix(in srgb, var(--color-primary-green) calc(var(--lit) * 72%), rgba(21,21,21,0.08))",
                    }}
                    className="pointer-events-none absolute inset-0 rounded-[16px] border"
                  />
                  <span
                    aria-hidden
                    style={{ opacity: "var(--lit)" }}
                    className="pointer-events-none absolute -inset-[3px] rounded-[19px] bg-[radial-gradient(60%_70%_at_50%_50%,rgba(134,213,42,0.22),transparent_75%)] blur-[3px]"
                  />

                  <div className="relative flex items-center justify-between gap-[10px]">
                    <span className="flex items-center gap-[8px]">
                      <span aria-hidden className="relative flex size-[8px] items-center justify-center">
                        <span
                          style={{
                            opacity: "var(--lit)",
                            transform: "scale(calc(0.7 + var(--lit) * 0.9))",
                          }}
                          className="absolute inset-[-6px] rounded-full bg-[radial-gradient(circle,rgba(134,213,42,0.55),transparent_70%)]"
                        />
                        <span
                          style={{
                            backgroundColor:
                              "color-mix(in srgb, var(--color-primary-green) calc(var(--lit) * 100%), #c9c9c9)",
                          }}
                          className="size-[6px] rounded-full"
                        />
                      </span>
                      <span
                        style={{
                          color:
                            "color-mix(in srgb, #4d7d13 calc(var(--lit) * 100%), #a3a3a3)",
                        }}
                        className="font-mono text-[10.5px] uppercase leading-none tracking-[1px]"
                      >
                        {node.number ?? "//"}
                      </span>
                    </span>

                    <span className="font-mono text-[9.5px] uppercase leading-none tracking-[0.6px] text-[#a3a3a3]">
                      {node.span}
                    </span>
                  </div>

                  <div className="relative flex items-start gap-[12px]">
                    <IsoBlock className="process-block mt-[1px] size-[42px] shrink-0" />
                    <h3 className="font-display text-[17px] font-semibold leading-[1.18] tracking-[-0.35px] text-black">
                      {node.title}
                    </h3>
                  </div>

                  <p className="relative font-body text-[12.5px] leading-[19px] tracking-[-0.1px] text-neutral-paragraph">
                    {node.copy}
                  </p>

                  {/* What is actually open during this stage. Real marks, from
                      the same sprite the engineering-stack section draws. */}
                  <div className="relative flex flex-wrap items-center gap-[6px]">
                    <span
                      style={{
                        borderColor:
                          "color-mix(in srgb, var(--color-primary-green) calc(var(--lit) * 45%), rgba(21,21,21,0.09))",
                        backgroundColor:
                          "color-mix(in srgb, var(--color-primary-green) calc(var(--lit) * 12%), var(--color-bg))",
                      }}
                      className="rounded-full border px-[8px] py-[4px] font-mono text-[9px] uppercase leading-none tracking-[0.5px] text-ash-dark"
                    >
                      Tools
                    </span>
                    {node.tools.map((tool) => (
                      <span
                        key={tool}
                        title={techLabel(tool)}
                        className="flex size-[26px] items-center justify-center rounded-[8px] border border-black/[0.07] bg-white shadow-[0_1px_2px_rgba(21,21,21,0.06)]"
                      >
                        <TechMark name={tool} className="size-[15px]" />
                        <span className="sr-only">{techLabel(tool)}</span>
                      </span>
                    ))}
                  </div>

                  <p className="relative mt-auto flex items-center gap-[7px] border-t border-black/[0.07] pt-[11px] font-body text-[11.5px] leading-none tracking-[-0.1px] text-ash-dark">
                    <span
                      aria-hidden
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, var(--color-primary-green) calc(25% + var(--lit) * 75%), transparent)",
                      }}
                      className="size-[4px] shrink-0 rounded-full"
                    />
                    {node.output}
                  </p>
                </article>
              </li>
            ))}
          </ol>
        </div>

        <div className="process-meta mt-[30px] flex w-full flex-wrap items-center gap-x-[22px] gap-y-[10px] lg:mt-[38px]">
          <span className="flex items-center gap-[7px]">
            <span aria-hidden className="size-[6px] rounded-full bg-primary-green" />
            <span className="font-mono text-[10.5px] uppercase leading-none tracking-[0.7px] text-ash-dark">
              Sequential stage
            </span>
          </span>
          <span className="flex items-center gap-[7px]">
            <span aria-hidden className="h-px w-[18px] bg-black/25" />
            <span className="font-mono text-[10.5px] uppercase leading-none tracking-[0.7px] text-neutral-paragraph">
              Runs in parallel
            </span>
          </span>
          <span className="flex items-center gap-[7px]">
            <span
              aria-hidden
              className="h-px w-[18px] border-t border-dashed border-black/30 bg-transparent"
            />
            <span className="font-mono text-[10.5px] uppercase leading-none tracking-[0.7px] text-neutral-paragraph">
              Repeats every two weeks
            </span>
          </span>
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
