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

/** How wide the light's influence is, as a fraction of the rail. */
const PULSE_REACH = 0.085;

/**
 * The delivery process, drawn as a wired flow rather than listed as four rows.
 *
 * Same idea as the engineering stack section: the thing being described is a
 * connected system, so it is drawn connected. Six stages sit on one rail,
 * alternating above and below it, and a light runs the rail end to end — each
 * node flashing as the light reaches it and keeping an afterglow once it has
 * gone. That is what makes it read as flow in a direction rather than as six
 * lamps taking turns.
 *
 * The rail is a hairline, not an SVG stroke: it stays exactly 1px at every
 * width, and it turns from horizontal to vertical at the breakpoint where the
 * stages stop fitting side by side.
 *
 * The light and the flashes come off ONE looping value, read by one ticker. A
 * timeline per node with its own callbacks would drift out of step with the
 * light the moment the tab was backgrounded and the two were resumed from
 * different places.
 */
export default function WorkingProcess() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 78%" });

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

      const count = sectionRef.current?.querySelector<HTMLElement>(".process-count");
      if (count) {
        gsap.from(count, {
          scale: 0.86,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: reveal(count, { start: "top 90%" }),
        });
      }

      // The flow assembles in the order it is read: the rail draws itself, the
      // nodes land on it, then each card rises out of the rail it is wired to.
      const flowTrigger = reveal(sectionRef.current?.querySelector(".process-flow") ?? null, {
        start: "top 84%",
      });

      gsap
        .timeline({ scrollTrigger: flowTrigger })
        .from(".process-rail", {
          scaleX: 0,
          scaleY: 0,
          duration: 1,
          ease: "power2.inOut",
        })
        .from(".process-dot", { scale: 0, duration: 0.5, ease: "back.out(2.2)", stagger: 0.07 }, "-=0.45")
        .from(".process-stem", { scaleX: 0, scaleY: 0, duration: 0.3, stagger: 0.07 }, "-=0.5")
        .from(
          ".process-card",
          {
            // Tipped away from the reader and pushed back in space, so the cards
            // come up out of the diagram rather than fading in on top of it.
            y: 34,
            rotateX: -14,
            z: -90,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.08,
          },
          "-=0.35",
        )
        .from(".process-loop", { opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.2");
    },
    { scope: sectionRef },
  );

  /**
   * The travelling light, and the flash it leaves on each node.
   *
   * `head` is a single position along the rail, 0 to 1. The light is placed at
   * it, and every node's `--pulse` is set from how close the head is to that
   * node — instant attack, exponential release, so a node lights the moment the
   * light arrives and dims behind it. Both axes come out of the same code; only
   * the property being written changes.
   */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const flow = sectionRef.current?.querySelector<HTMLElement>(".process-flow");
      if (!flow) return;

      const nodes = gsap.utils.toArray<HTMLElement>(".process-node", flow);
      if (!nodes.length) return;

      const glow = new Float64Array(nodes.length);

      // GSAP's matchMedia runs the axis it matches and reverts everything that
      // setup wrote when the breakpoint changes, so neither orientation can
      // leave a stale inline `left` or `top` behind on the other one's rail.
      const media = gsap.matchMedia();

      const wire = (horizontal: boolean) => () => {
        const rail = flow.querySelector<HTMLElement>(
          horizontal ? ".process-rail-h" : ".process-rail-v",
        );
        const light = flow.querySelector<HTMLElement>(
          horizontal ? ".process-light-h" : ".process-light-v",
        );
        if (!rail || !light) return;

        const axis = horizontal ? "left" : "top";

        /**
         * Where each node sits along the rail, as a fraction of its length. Not
         * assumed to be evenly spaced: stacked, the cards are different heights,
         * so the only honest answer comes from measuring the dots.
         */
        let positions: number[] = [];

        const measure = () => {
          const railBox = rail.getBoundingClientRect();
          const length = horizontal ? railBox.width : railBox.height;
          if (!length) return;

          positions = nodes.map((node) => {
            const dot = node.querySelector<HTMLElement>(".process-dot");
            if (!dot) return 0;
            const box = dot.getBoundingClientRect();
            return horizontal
              ? (box.left + box.width / 2 - railBox.left) / length
              : (box.top + box.height / 2 - railBox.top) / length;
          });
        };

        measure();

        const remeasure = gsap.delayedCall(0, measure).pause();
        const onResize = () => remeasure.restart(true);
        window.addEventListener("resize", onResize);

        // Overshoots both ends so the light enters and leaves rather than
        // appearing at the first node and vanishing at the last.
        const run = { head: 0 };

        const tween = gsap.to(run, {
          head: 1,
          duration: 5.6,
          ease: "none",
          repeat: -1,
          repeatDelay: 0.5,
          paused: true,
        });

        const tick = () => {
          const head = run.head * 1.16 - 0.08;
          light.style[axis] = `${head * 100}%`;

          // Instant on, slow off. A symmetrical ease would light a node on the
          // way in as brightly as it dims it on the way out, and the flow would
          // lose its direction.
          const release = Math.pow(0.9, gsap.ticker.deltaRatio());

          for (let i = 0; i < nodes.length; i += 1) {
            const distance = Math.abs((positions[i] ?? 0) - head);
            const lit = distance < PULSE_REACH ? 1 - distance / PULSE_REACH : 0;

            glow[i] = Math.max(lit, glow[i] * release);
            nodes[i].style.setProperty("--pulse", glow[i].toFixed(3));
          }
        };

        // Nothing here is worth a frame while the section is off screen.
        const gate = whileVisible(flow, {
          on: () => {
            tween.play();
            gsap.ticker.add(tick);
          },
          off: () => {
            tween.pause();
            gsap.ticker.remove(tick);
          },
        });

        return () => {
          gate();
          gsap.ticker.remove(tick);
          tween.kill();
          remeasure.kill();
          window.removeEventListener("resize", onResize);
          nodes.forEach((node) => node.style.removeProperty("--pulse"));
          light.style.removeProperty(axis);
        };
      };

      media.add("(min-width: 1024px)", wire(true));
      media.add("(max-width: 1023.98px)", wire(false));

      return () => media.revert();
    },
    { scope: sectionRef },
  );

  /**
   * The tilt. Each card leans a few degrees towards the cursor, which is what
   * makes the row read as objects standing in space rather than as rectangles
   * printed on the background.
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
          rotateY(((event.clientX - (box.left + box.width / 2)) / box.width) * 11);
          rotateX(((event.clientY - (box.top + box.height / 2)) / box.height) * -9);
          lift(26);
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

        <div className="mt-[32px] flex w-full flex-col items-start justify-between gap-[28px] lg:mt-[44px] lg:flex-row lg:items-end">
          <p className="process-meta max-w-[560px] font-display text-[20px] leading-[1.3] tracking-[-0.25px] text-ash-muted">
            A clear, collaborative process that turns a vague idea into software
            running in production — six stages, wired end to end.
          </p>

          <div className="flex items-end gap-[20px]">
            <p className="process-meta max-w-[220px] font-display text-[16px] leading-[1.35] tracking-[-0.2px] text-ash-muted">
              Two-week slices, from first call to live system
            </p>
            <p className="process-count font-display text-[clamp(4rem,8vw,120px)] font-medium uppercase leading-[0.82] tracking-[-0.0625em] text-white">
              06
            </p>
          </div>
        </div>

        {/* The diagram. `perspective` lives on the wrapper so every card tilts
            towards the same vanishing point instead of each having its own. */}
        <div className="process-flow relative mt-[48px] w-full [perspective:1500px] lg:mt-[92px] lg:h-[660px]">
          {/* Horizontal rail, from the first node to the last. */}
          <div
            aria-hidden
            className="process-rail process-rail-h absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 bg-white/[0.14] lg:block"
          >
            <span
              className="process-light-h pointer-events-none absolute top-1/2 h-px w-[15%] -translate-x-1/2 -translate-y-1/2 bg-[linear-gradient(to_right,transparent,rgba(134,213,42,0.15)_28%,var(--color-primary-green)_50%,rgba(134,213,42,0.15)_72%,transparent)]"
              style={{ left: "-8%" }}
            />
          </div>

          {/* Stacked, the same rail runs down the left-hand side instead. */}
          <div
            aria-hidden
            className="process-rail process-rail-v absolute bottom-[18px] left-[20px] top-[18px] w-px bg-white/[0.14] lg:hidden"
          >
            <span
              className="process-light-v pointer-events-none absolute left-1/2 h-[14%] w-px -translate-x-1/2 -translate-y-1/2 bg-[linear-gradient(to_bottom,transparent,rgba(134,213,42,0.15)_28%,var(--color-primary-green)_50%,rgba(134,213,42,0.15)_72%,transparent)]"
              style={{ top: "-8%" }}
            />
          </div>

          <ol className="relative flex w-full flex-col gap-[30px] lg:grid lg:h-full lg:grid-cols-6 lg:gap-0">
            {STAGES.map((stage, index) => {
              // Alternating sides, which is what gives the rail something to run
              // between and keeps six cards legible across one screen.
              const above = index % 2 === 0;

              return (
                <li
                  key={stage.id}
                  className="process-node relative pl-[52px] lg:h-full lg:pl-0"
                  style={{ "--pulse": 0 } as CSSProperties}
                >
                  {/* The node on the rail. Its ring is the flash. */}
                  <span
                    aria-hidden
                    className="process-dot absolute left-[20px] top-[22px] z-[2] flex size-[13px] -translate-x-1/2 items-center justify-center rounded-full border border-white/25 bg-black lg:left-1/2 lg:top-1/2 lg:-translate-y-1/2"
                  >
                    <span
                      style={{
                        opacity: "var(--pulse)",
                        transform: "scale(calc(0.6 + var(--pulse) * 0.7))",
                      }}
                      className="absolute inset-[-7px] rounded-full bg-[radial-gradient(circle,rgba(134,213,42,0.55),transparent_70%)]"
                    />
                    <span
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, var(--color-primary-green) calc(var(--pulse) * 100%), #3a3a3a)",
                      }}
                      className="size-[5px] rounded-full"
                    />
                  </span>

                  {/* Dot to card. Horizontal when stacked, vertical when not. */}
                  <span
                    aria-hidden
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--color-primary-green) calc(var(--pulse) * 70%), rgba(255,255,255,0.14))",
                    }}
                    className={`process-stem absolute left-[20px] top-[22px] h-px w-[30px] origin-left lg:left-1/2 lg:w-px lg:h-[58px] lg:origin-top ${
                      above ? "lg:bottom-1/2 lg:top-auto" : "lg:top-1/2"
                    }`}
                  />

                  <article
                    style={{
                      borderColor:
                        "color-mix(in srgb, var(--color-primary-green) calc(var(--pulse) * 55%), rgba(255,255,255,0.12))",
                    }}
                    className={`process-card relative flex flex-col gap-[12px] rounded-[14px] border bg-[#0c0c0c] p-[18px] [transform-style:preserve-3d] will-change-transform lg:absolute lg:inset-x-[9px] lg:min-h-[196px] ${
                      above ? "lg:bottom-1/2 lg:mb-[58px]" : "lg:top-1/2 lg:mt-[58px]"
                    }`}
                  >
                    {/* Fills with the node's own light as the wave passes. */}
                    <span
                      aria-hidden
                      style={{ opacity: "var(--pulse)" }}
                      className="pointer-events-none absolute inset-0 rounded-[14px] bg-[radial-gradient(120%_100%_at_50%_0%,rgba(134,213,42,0.14),transparent_70%)]"
                    />

                    <div className="relative flex items-center justify-between gap-[10px]">
                      <span
                        style={{
                          color:
                            "color-mix(in srgb, var(--color-primary-green) calc(var(--pulse) * 100%), #5e5e5e)",
                        }}
                        className="font-mono text-[11px] leading-none tracking-[1px]"
                      >
                        {stage.number}
                      </span>
                      <span className="font-mono text-[10px] uppercase leading-none tracking-[0.6px] text-[#5e5e5e]">
                        {stage.span}
                      </span>
                    </div>

                    <h3 className="relative font-display text-[19px] font-medium leading-[1.18] tracking-[-0.4px] text-white">
                      {stage.title}
                    </h3>

                    <p className="relative font-body text-[13px] leading-[20px] tracking-[-0.1px] text-[#8f8f8f]">
                      {stage.copy}
                    </p>

                    <p className="relative mt-auto flex items-center gap-[7px] border-t border-white/[0.08] pt-[12px] font-body text-[12px] leading-none tracking-[-0.1px] text-ash-muted">
                      <span
                        aria-hidden
                        style={{
                          backgroundColor:
                            "color-mix(in srgb, var(--color-primary-green) calc(20% + var(--pulse) * 80%), transparent)",
                        }}
                        className="size-[4px] shrink-0 rounded-full"
                      />
                      {stage.output}
                    </p>
                  </article>
                </li>
              );
            })}
          </ol>

          {/* The one stage that is a loop rather than a step. Spans the build and
              go-live columns of the six-column grid — 50% to 83.3% — which is
              why it is a percentage rather than a grid child. */}
          <div
            aria-hidden
            className="process-loop absolute bottom-0 left-1/2 hidden h-[34px] w-[33.333%] lg:block"
          >
            <span className="absolute inset-0 rounded-b-[14px] border-b border-l border-r border-dashed border-white/[0.16]" />
            <span className="absolute left-1/2 top-full -translate-x-1/2 -translate-y-1/2 bg-black px-[10px] font-mono text-[10px] uppercase leading-none tracking-[0.6px] text-[#5e5e5e]">
              ↺ repeat every two weeks
            </span>
          </div>
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
  // and the ticker would keep running on a page nobody is looking at.
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
