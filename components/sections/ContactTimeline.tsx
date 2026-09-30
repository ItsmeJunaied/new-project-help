"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { BRAND_GREEN } from "@/lib/brand";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";

/**
 * The concept's process block, to its own measurements and with its own
 * mechanism: a rounded black slab inset from the page edges, seven steps
 * across on one row above 1080px and stacked below it, and a wire drawn
 * through the centre of every 56px node with a comet running along it.
 *
 * The wire is the part that has to be measured rather than styled — it joins
 * seven points that a fluid grid puts wherever it likes, and it flips from a
 * horizontal run to a vertical one at the breakpoint. So it is built the way
 * the concept builds it: read the laid-out node centres, write one polyline,
 * and animate `stroke-dasharray` along it. A ResizeObserver rebuilds it when
 * the layout moves, and an IntersectionObserver keeps the loop off while the
 * section is off screen.
 *
 * Under reduced motion the wire is drawn complete and every node is lit, with
 * no comet and no loop — the finished picture, held still.
 */

type Step = {
  when: string;
  title: string;
  body: string;
};

const STEPS: Step[] = [
  {
    when: "Hour 0",
    title: "Brief lands",
    body: "Form, email, WhatsApp or call — all four reach one inbox, read by the engineers who would run the build rather than by a sales desk.",
  },
  {
    when: "4 hours",
    title: "A human replies",
    body: "The engineer who picks it up answers by name, inside four business hours, with a question, a calendar link or a first number.",
  },
  {
    when: "Day 1–2",
    title: "Strategy call",
    body: "Free, thirty minutes, with the two projects closest to yours on screen. Some briefs are clear enough that we skip straight past it.",
  },
  {
    when: "Day 2–5",
    title: "Written quote",
    body: "Scope, timeline, price and the team assigned — in writing. If we cannot hit your window, this is where we say so.",
  },
  {
    when: "Week 1",
    title: "Kickoff",
    body: "The contract goes out the day you say yes, and kickoff follows inside 48 hours. Access, environments and the backlog are set up that week.",
  },
  {
    when: "Every 2 weeks",
    title: "Design & build",
    body: "Two-week cycles against the signed scope, each ending on something you can open. Weekly written updates and an open backlog throughout.",
  },
  {
    when: "Launch",
    title: "Delivery",
    body: "A rehearsed cutover with a way back, the source and the documentation handed over, and months of support rather than a goodbye email.",
  },
];

const NS = "http://www.w3.org/2000/svg";

/** One full pass of the comet, and how much of that pass it spends running. */
const CYCLE = 9000;
const RUN = 7000;

export default function ContactTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const wireRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const box = flowRef.current;
    const svg = wireRef.current;
    if (!box || !svg) return;

    // Canvas-free, but SVG attributes still take colour strings rather than CSS
    // values. BRAND_GREEN is the documented fallback for exactly this — see
    // lib/brand.ts — rather than a second copy of the hex.
    const green =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-primary-green")
        .trim() || BRAND_GREEN;

    const still = prefersReducedMotion();

    type Flow = {
      pts: [number, number][];
      cum: number[];
      len: number;
      lit: SVGPathElement;
      comet: SVGPathElement;
      head: SVGCircleElement;
      nodes: HTMLElement[];
      /** Last lit/unlit state written, so the loop only touches what changed. */
      on: boolean[];
    };

    let flow: Flow | null = null;
    let dirty = true;
    let visible = false;
    let frame: number | null = null;

    const build = () => {
      dirty = false;
      const bounds = box.getBoundingClientRect();
      const nodes = Array.from(box.querySelectorAll<HTMLElement>("[data-node]"));
      const pts = nodes.map((node): [number, number] => {
        const rect = node.getBoundingClientRect();
        return [
          rect.left + rect.width / 2 - bounds.left,
          rect.top + rect.height / 2 - bounds.top,
        ];
      });
      if (pts.length < 2) return;

      const d = "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L");

      const cum = [0];
      for (let i = 1; i < pts.length; i += 1) {
        cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      }

      svg.innerHTML = "";
      const add = <K extends keyof SVGElementTagNameMap>(
        tag: K,
        attrs: Record<string, string | number>,
      ) => {
        const el = document.createElementNS(NS, tag);
        for (const key in attrs) el.setAttribute(key, String(attrs[key]));
        svg.appendChild(el);
        return el;
      };

      add("path", { d, stroke: "rgba(255,255,255,0.16)", "stroke-width": 2, fill: "none" });
      const lit = add("path", {
        d,
        stroke: green,
        "stroke-width": 2,
        "stroke-opacity": 0.4,
        fill: "none",
      });
      const comet = add("path", {
        d,
        stroke: green,
        "stroke-width": 3,
        fill: "none",
        "stroke-linecap": "round",
      });
      comet.style.filter = `drop-shadow(0 0 6px ${green})`;
      const head = add("circle", { r: 6, fill: "#eaf7dd" });
      head.style.filter = `drop-shadow(0 0 8px ${green}) drop-shadow(0 0 16px ${green})`;

      flow = {
        pts,
        cum,
        len: cum[cum.length - 1],
        lit,
        comet,
        head,
        nodes,
        on: nodes.map(() => false),
      };
    };

    const light = (node: HTMLElement, on: boolean) => {
      node.style.background = on ? green : "#141413";
      node.style.color = on ? "#151515" : "";
      node.style.borderColor = on ? green : "";
      node.style.boxShadow = on
        ? `0 0 0 6px color-mix(in srgb, ${green} 14%, transparent), 0 0 28px color-mix(in srgb, ${green} 45%, transparent)`
        : "none";
    };

    const paint = (now: number) => {
      if (!flow) return;

      const t = now % CYCLE;
      const length = still ? flow.len : Math.min(1, t / RUN) * flow.len;

      flow.lit.setAttribute("stroke-dasharray", `${length} ${flow.len + 20}`);

      const tail = Math.min(140, length);
      flow.comet.setAttribute("stroke-dasharray", `${tail} ${flow.len * 2 + 200}`);
      flow.comet.setAttribute("stroke-dashoffset", String(-(length - tail)));

      let k = 0;
      while (k < flow.cum.length - 2 && flow.cum[k + 1] < length) k += 1;
      const segment = flow.cum[k + 1] - flow.cum[k] || 1;
      const u = Math.max(0, Math.min(1, (length - flow.cum[k]) / segment));
      flow.head.setAttribute("cx", String(flow.pts[k][0] + (flow.pts[k + 1][0] - flow.pts[k][0]) * u));
      flow.head.setAttribute("cy", String(flow.pts[k][1] + (flow.pts[k + 1][1] - flow.pts[k][1]) * u));
      flow.head.style.opacity = still ? "0" : "1";

      flow.nodes.forEach((node, i) => {
        const on = length >= flow!.cum[i] - 1;
        if (on === flow!.on[i]) return;
        flow!.on[i] = on;
        light(node, on);
      });
    };

    const loop = (now: number) => {
      if (visible) {
        if (dirty) build();
        paint(now);
      }
      frame = window.requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) visible = entry.isIntersecting;
    });
    io.observe(box);

    const ro = new ResizeObserver(() => {
      dirty = true;
      // With the loop running, the next frame consumes this. With motion off
      // there is no loop, so the rebuild has to happen here or a resize would
      // leave the wire drawn against the old node positions for good.
      if (still) {
        build();
        paint(RUN);
      }
    });
    ro.observe(box);

    if (still) {
      // One pass is the whole animation: the finished wire, every node lit.
      build();
      paint(RUN);
    } else {
      frame = window.requestAnimationFrame(loop);
    }

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      const trigger = reveal(sectionRef.current, { start: "top 80%" });

      gsap.from(".tl-head", {
        y: 24,
        opacity: 0,
        duration: 0.85,
        ease: "power2.out",
        scrollTrigger: trigger,
      });

      gsap.from(".tl-copy", {
        y: 18,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.08,
        delay: 0.2,
        scrollTrigger: trigger,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="mx-[clamp(8px,1.2vw,16px)] rounded-[clamp(24px,3vw,40px)] bg-black text-bg"
    >
      <div className="mx-auto w-full max-w-[1360px] px-[clamp(20px,4vw,48px)] py-[clamp(72px,9vw,128px)]">
        <div className="tl-head grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-end gap-x-[64px] gap-y-[24px] pb-[clamp(48px,6vw,88px)]">
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

        <div ref={flowRef} className="relative">
          <svg
            ref={wireRef}
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full overflow-visible"
          />

          <ol className="relative z-[1] m-0 grid list-none grid-cols-1 gap-[40px] p-0 min-[1080px]:grid-cols-7 min-[1080px]:gap-[16px]">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex flex-row gap-[24px] min-[1080px]:flex-col">
                <span
                  data-node
                  aria-hidden
                  className="flex size-[56px] flex-none items-center justify-center rounded-full border border-white/15 bg-[#141413] font-mono text-[12px] leading-none tracking-[0.08em] text-white/60 transition-[background-color,color,border-color,box-shadow] duration-300"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="tl-copy flex flex-col gap-[10px] pr-[12px]">
                  <span className="font-mono text-[11px] uppercase leading-none tracking-[0.08em] text-primary-green">
                    {step.when}
                  </span>
                  <h3 className="m-0 font-display text-[20px] font-semibold leading-[1.2] tracking-[-0.02em] text-bg">
                    {step.title}
                  </h3>
                  <p className="m-0 font-body text-[14px] leading-[1.55] tracking-[-0.1px] text-pretty text-white/60">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
