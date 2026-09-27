"use client";

import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";
import { WORK_DOMAINS } from "@/lib/services";
import { siteConfig } from "@/lib/site";

/**
 * How strongly each cell in the cursor's wake still glows. Position 0 is the
 * cell under the cursor; everything after it is where the cursor has just been,
 * so the trail reads as a wave running back through the grid rather than as one
 * lit square.
 */
const TRAIL = [1, 0.58, 0.34, 0.2, 0.12, 0.07];

/** The four cells touching the current one, so the wave has width as well as a tail. */
const BLEED = 0.16;

/** Ceiling on the unattended sweep. Loud enough to catch an eye, quiet enough to ignore. */
const AMBIENT_PEAK = 0.46;

/** Half-width of the sweep's crest, in diagonals. */
const AMBIENT_SPREAD = 1.45;

/**
 * What we actually take on.
 *
 * The about page used to answer this with four technology names in the corner of
 * the hero, which left a reader to guess whether an ERP rebuild, an AI agent or
 * a workflow automation was something we do. The sixteen domains below are the
 * names clients ask for, each with the one line that says what we mean by it,
 * and a link to the service page where the domain has one.
 *
 * The list lives in lib/services.ts beside the seven services it sits behind, so
 * the two cannot drift apart.
 *
 * This stays on the about page rather than moving to /services on purpose. What
 * /services sells is seven services, each with its own page and price
 * conversation; this is the longer answer to "do you do X?", and it is an
 * about-page question — moving it would put two overlapping lists of work on one
 * page and leave this one with nothing that says what the company does.
 *
 * The grid lights under the cursor. See `useGSAP` below for why that is one
 * ticker writing a custom property rather than sixteen CSS transitions.
 */
export default function AboutCapabilities() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 78%" });

      gsap.from(".capability-heading-inner", {
        yPercent: 110,
        duration: 1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: trigger,
      });

      gsap.from(".capability-meta", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: trigger,
      });

      gsap.from(".capability-cell", {
        y: 28,
        opacity: 0,
        duration: 0.65,
        ease: "power2.out",
        stagger: 0.04,
        scrollTrigger: reveal(sectionRef.current?.querySelector(".capability-grid") ?? null, {
          start: "top 88%",
        }),
      });
    },
    { scope: sectionRef },
  );

  /**
   * The wave.
   *
   * Every cell carries a `--wave` custom property between 0 and 1, and its glow,
   * its accent rule and the colour of its number are all expressions of that one
   * number. Which means this only has to move sixteen floats per frame.
   *
   * It is one `gsap.ticker` loop easing `current` towards `target`, rather than
   * a tween per cell: on a fast diagonal drag across the grid, tweening would
   * start and kill a couple of hundred tweens a second, and CSS transitions
   * would restart their own timing on every re-target and smear the tail into
   * one flat block. A shared ticker gives every cell the same decay curve
   * regardless of how it was lit, which is what makes the trail read as a wave.
   *
   * Two things write `target`: the cursor (a trail, weighted by how recently the
   * cursor was there) and, when there is no cursor, a diagonal sweep that runs
   * on its own so the grid is never completely dead. `mix` crossfades between
   * them so a mouse arriving does not snap the sweep off mid-crest.
   */
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const grid = sectionRef.current?.querySelector<HTMLElement>(".capability-grid");
      if (!grid) return;

      const cells = gsap.utils.toArray<HTMLElement>(".capability-cell", grid);
      if (!cells.length) return;

      // Written straight onto the element: `style[prop]` cannot reach a custom
      // property, and this is the hot path.
      const write = cells.map(
        (cell) => (value: number) => cell.style.setProperty("--wave", value.toFixed(3)),
      );

      const current = new Float64Array(cells.length);
      const target = new Float64Array(cells.length);
      /**
       * The trail on its own, kept apart from `target` so the crossfade below can
       * read it every frame without consuming it. Folding the mix straight into
       * `target` would multiply it by the same fraction on every tick and the
       * tail would collapse to nothing while the cursor was still moving.
       */
      const wake = new Float64Array(cells.length);

      /**
       * Where each cell sits RELATIVE TO THE GRID, not to the viewport. The
       * cursor is reported in viewport coordinates, so a move only has to
       * measure the grid itself — one rect per event — and these offsets survive
       * the page being scrolled underneath a held cursor.
       */
      let boxes: { x: number; y: number; w: number; h: number }[] = [];
      let columns = 1;

      const measure = () => {
        const gridBox = grid.getBoundingClientRect();
        boxes = cells.map((cell) => {
          const box = cell.getBoundingClientRect();
          return {
            x: box.left - gridBox.left,
            y: box.top - gridBox.top,
            w: box.width,
            h: box.height,
          };
        });
        // The grid is one, two or four across depending on the breakpoint, and
        // the sweep below runs on diagonals, so it has to ask rather than assume.
        columns = getComputedStyle(grid).gridTemplateColumns.split(" ").filter(Boolean).length || 1;
      };

      measure();

      const remeasure = gsap.delayedCall(0, measure).pause();
      const onResize = () => remeasure.restart(true);
      window.addEventListener("resize", onResize);

      // Recency-ordered, newest first. Index 0 is the cell under the cursor.
      let trail: number[] = [];
      const mix = { hover: 0 };
      const sweep = { t: 0 };

      const sweepTween = gsap.to(sweep, {
        t: 1,
        duration: 7.2,
        ease: "none",
        repeat: -1,
      });

      const tick = () => {
        const rows = Math.ceil(cells.length / columns);
        // One crest travelling from the top-left corner to the bottom-right one,
        // starting and finishing off the grid so it enters and leaves cleanly.
        const head = sweep.t * (columns + rows + 2 * AMBIENT_SPREAD) - AMBIENT_SPREAD;
        const hover = mix.hover;

        for (let i = 0; i < cells.length; i += 1) {
          const distance = Math.abs((i % columns) + Math.floor(i / columns) - head);
          const ambient =
            distance < AMBIENT_SPREAD ? (1 - distance / AMBIENT_SPREAD) * AMBIENT_PEAK : 0;

          target[i] = Math.max(wake[i] * hover, ambient * (1 - hover));
        }

        // Frame-rate independent: the same decay whether this is running at 60,
        // 120 or a throttled 30.
        const ease = 1 - Math.pow(0.84, gsap.ticker.deltaRatio());

        for (let i = 0; i < cells.length; i += 1) {
          const delta = target[i] - current[i];

          if (Math.abs(delta) < 0.001) {
            if (current[i] !== target[i]) {
              current[i] = target[i];
              write[i](current[i]);
            }
            continue;
          }

          current[i] += delta * ease;
          write[i](current[i]);
        }
      };

      gsap.ticker.add(tick);

      /** Lay the trail into `wake`. Read at the top of every tick, so it has to be rewritten each move. */
      const paint = () => {
        wake.fill(0);

        trail.forEach((index, position) => {
          wake[index] = Math.max(wake[index], TRAIL[position] ?? 0);
        });

        // The leading cell spreads sideways into its neighbours, which is what
        // stops the tail looking like a row of separate lamps.
        const head = trail[0];
        if (head === undefined) return;

        const row = Math.floor(head / columns);
        const column = head % columns;

        [
          [row - 1, column],
          [row + 1, column],
          [row, column - 1],
          [row, column + 1],
        ].forEach(([r, c]) => {
          if (r < 0 || c < 0 || c >= columns) return;
          const index = r * columns + c;
          if (index >= cells.length) return;
          wake[index] = Math.max(wake[index], BLEED);
        });
      };

      const onMove = (event: PointerEvent) => {
        const gridBox = grid.getBoundingClientRect();
        const x = event.clientX - gridBox.left;
        const y = event.clientY - gridBox.top;

        const index = boxes.findIndex(
          (box) => x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h,
        );

        // Between two cells is the 1px rule, not a cell — leave the wave alone
        // rather than dropping the trail every time the cursor crosses one.
        if (index === -1 || index === trail[0]) return;

        trail = [index, ...trail.filter((i) => i !== index)].slice(0, TRAIL.length);
        paint();
      };

      const onEnter = () => {
        measure();
        gsap.to(mix, { hover: 1, duration: 0.35, ease: "power2.out" });
      };

      const onLeave = () => {
        trail = [];
        wake.fill(0);
        gsap.to(mix, { hover: 0, duration: 0.9, ease: "power2.inOut" });
      };

      // A finger has no hover state to leave, and a trail chasing a tap reads as
      // a glitch, so touch gets the sweep and nothing else.
      const canHover = window.matchMedia("(hover: hover)").matches;

      if (canHover) {
        grid.addEventListener("pointermove", onMove);
        grid.addEventListener("pointerenter", onEnter);
        grid.addEventListener("pointerleave", onLeave);
      }

      return () => {
        gsap.ticker.remove(tick);
        sweepTween.kill();
        remeasure.kill();
        window.removeEventListener("resize", onResize);

        if (canHover) {
          grid.removeEventListener("pointermove", onMove);
          grid.removeEventListener("pointerenter", onEnter);
          grid.removeEventListener("pointerleave", onLeave);
        }

        cells.forEach((cell) => cell.style.removeProperty("--wave"));
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      className="w-full bg-bg py-[80px] lg:py-[140px]"
    >
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[40px]">
        <div className="flex w-full flex-col items-start gap-[40px] lg:flex-row lg:gap-[100px]">
          <p className="capability-meta shrink-0 font-body text-[18px] font-medium leading-[18px] tracking-[-0.25px] text-[#111]">
            [ What We Do ]
          </p>

          <div className="w-full max-w-[820px]">
            <h2 className="font-display text-[clamp(2rem,4.2vw,56px)] font-medium leading-[1.04] tracking-[-2px] text-black">
              <span className="block overflow-hidden">
                <span className="capability-heading-inner block">
                  Sixteen kinds of work,
                </span>
              </span>
              <span className="block overflow-hidden">
                <span className="capability-heading-inner block text-ash-muted">
                  one team accountable.
                </span>
              </span>
            </h2>

            <p className="capability-meta mt-[28px] font-body text-[18px] leading-[28px] tracking-[-0.25px] text-ash-dark">
              {siteConfig.name} has been writing custom software since{" "}
              {siteConfig.founded} — SaaS products and MVPs, ERP and CRM systems
              for businesses that had outgrown spreadsheets, storefronts,
              internal platforms, mobile apps, and the AI and automation work
              that has started arriving with all of them. Most engagements begin
              because something off the shelf almost fitted and then did not.
            </p>

            <p className="capability-meta mt-[20px] font-body text-[16px] leading-[26px] tracking-[-0.2px] text-neutral-paragraph">
              The engineers who scope your build are the ones who write it. Scope,
              wireframes, price and timeline are agreed before a line is
              committed; you see working software every two weeks; and the
              repository sits in your organisation from the first commit rather
              than the last. Six to twelve months of fixes after go-live are part
              of the build, not a separate contract.
            </p>
          </div>
        </div>

        {/* A ruled table rather than sixteen floating cards: one hairline
            between neighbours, drawn by the wrapper's own background showing
            through a 1px gap, so the rules stay exactly 1px at every width. */}
        <div className="capability-grid mt-[56px] grid w-full gap-px border border-black/10 bg-black/10 sm:grid-cols-2 lg:mt-[72px] lg:grid-cols-4">
          {WORK_DOMAINS.map((domain, index) => {
            const inner = (
              <>
                {/* Everything the wave draws. Behind the copy, and never in the
                    way of a pointer — the cell itself is the target. */}
                <span
                  aria-hidden
                  style={{ opacity: "var(--wave)" }}
                  className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(125%_115%_at_0%_0%,rgba(134,213,42,0.34),rgba(134,213,42,0.09)_52%,rgba(255,255,255,0.7)_78%)]"
                />
                <span
                  aria-hidden
                  style={{ transform: "scaleX(var(--wave))", opacity: "var(--wave)" }}
                  className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[2px] origin-left bg-primary-green"
                />

                <span className="relative z-[1] flex flex-col">
                  <span
                    style={{
                      color:
                        "color-mix(in srgb, var(--color-primary-green) calc(var(--wave) * 100%), #a3a3a3)",
                    }}
                    className="font-mono text-[11px] leading-none tracking-[0.5px]"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="mt-[16px] flex items-start justify-between gap-[10px]">
                    <span className="font-display text-[19px] font-semibold leading-[1.22] tracking-[-0.4px] text-black">
                      {domain.name}
                    </span>
                    {domain.service ? (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 15 15"
                        fill="none"
                        aria-hidden="true"
                        className="mt-[5px] shrink-0 text-[#c4c4c4] transition-[transform,color] duration-500 group-hover:translate-x-[2px] group-hover:text-black"
                      >
                        <path
                          d="M3 12 12 3M4.6 3H12v7.4"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : null}
                  </span>

                  <span className="mt-[10px] font-body text-[14px] leading-[22px] tracking-[-0.16px] text-neutral-paragraph">
                    {domain.copy}
                  </span>
                </span>
              </>
            );

            const shell =
              // The floor keeps the four-across rows even. On one column there
              // is nothing to line up with, and sixteen padded cells make for a
              // long scroll, so they size to their own copy instead.
              "capability-cell group relative isolate flex flex-col overflow-hidden bg-bg p-[24px] sm:min-h-[188px]";

            // `--wave` is declared here so the expressions above resolve to 0
            // before the ticker has written anything — including on the server,
            // and for anyone who never moves a pointer over the grid.
            const style = { "--wave": 0 } as CSSProperties;

            return domain.service ? (
              <Link
                key={domain.name}
                href={`/services/${domain.service}`}
                style={style}
                className={shell}
              >
                {inner}
              </Link>
            ) : (
              <div key={domain.name} style={style} className={shell}>
                {inner}
              </div>
            );
          })}
        </div>

        <div className="mt-[36px] flex w-full flex-col items-start gap-[20px] sm:flex-row sm:items-center sm:justify-between">
          <p className="capability-meta max-w-[620px] font-body text-[15px] leading-[24px] tracking-[-0.16px] text-neutral-paragraph">
            Not sure which of these your problem is? That is what the first call
            is for — we scope it before anyone quotes it.
          </p>

          <div className="flex flex-wrap items-center gap-[12px]">
            <Link
              href="/services"
              className="flex items-center gap-[10px] rounded-[100px] border border-black/15 px-[26px] py-[14px] font-body text-[16px] font-medium leading-[24px] tracking-[-0.25px] text-black transition-colors duration-300 hover:border-black/45"
            >
              All services
            </Link>
            <Link
              href="/contact"
              className="group flex items-center gap-[10px] rounded-[100px] bg-black px-[26px] py-[14px] transition-colors duration-300 hover:bg-primary-green"
            >
              <span className="font-body text-[16px] font-medium leading-[24px] tracking-[-0.25px] text-white transition-colors duration-300 group-hover:text-black">
                Start a project
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
      </div>
    </section>
  );
}
