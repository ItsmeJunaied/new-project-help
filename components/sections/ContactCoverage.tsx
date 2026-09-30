"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, Geometry } from "geojson";
import { BRAND_GREEN } from "@/lib/brand";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";

/**
 * The concept's global-reach block, to its own measurements and with its own
 * mechanism: a dotted Natural Earth world on a white card, arcs leaving Dhaka
 * for each market with a comet running along them, a chip row underneath, and
 * four figures below that.
 *
 * The dots are built the way the concept builds them, which is a nice trick
 * worth keeping: the countries are filled into an offscreen canvas in three
 * flat key colours, the pixels are read back on a fixed grid, and each sample
 * becomes a dot whose colour is decided by which key it landed on. That gives
 * a halftone of real coastlines without hand-placing anything, and it reflows
 * at any width because the grid is derived from the width.
 *
 * ONE THING NEEDS YOUR CONFIRMATION. The concept names eight countries as its
 * coverage zones. We do not publish a client-country list, so MARKETS below is
 * the concept's own list carried over as a placeholder — it is the single
 * place to edit, and nothing else in this file needs to change when you do.
 * The four figures are ours and are the ones the service pages already quote.
 */

/**
 * PLACEHOLDER — confirm or replace before this page goes live.
 *
 * `id` is the ISO 3166-1 numeric code as world-atlas keys it, `p` is the
 * [lon, lat] the arc lands on, and `label` is the pill drawn beside it; a
 * destination with no label still gets a dot and an arc, which is how the
 * concept keeps the European cluster from turning into a stack of pills.
 */
const MARKETS = [
  { id: "840", p: [-96, 39] as [number, number], label: "USA", name: "United States" },
  { id: "826", p: [-1.8, 52.8] as [number, number], label: "UK", left: true, name: "United Kingdom" },
  { id: "276", p: [10.4, 51.1] as [number, number], label: "Europe", dy: -14, name: "Germany" },
  { id: "250", p: [2.4, 46.8] as [number, number], name: "France" },
  { id: "528", p: [5.6, 52.2] as [number, number], name: "Netherlands" },
  { id: "724", p: [-3.7, 40.2] as [number, number], name: "Spain" },
  { id: "752", p: [15.5, 61] as [number, number], name: "Sweden" },
  { id: "036", p: [134, -25] as [number, number], label: "Australia", name: "Australia" },
];

/** Bangladesh, and Antarctica — the one the concept drops from the map. */
const HQ_ID = "050";
const ANTARCTICA_ID = "010";
const HQ: [number, number] = [90.4, 23.8];

/** The figures the service pages already quote. */
const STATS = [
  { value: "4h", label: "Reply to every brief, in business hours" },
  { value: "28+", label: "Systems delivered since 2021" },
  { value: "95%", label: "Client satisfaction on what shipped" },
  { value: "99.9%", label: "Uptime after migration" },
];

type Arc = {
  p0: [number, number];
  p1: [number, number];
  p2: [number, number];
  label?: string;
  left?: boolean;
  dy?: number;
};

type Built = {
  width: number;
  height: number;
  dpr: number;
  base: HTMLCanvasElement;
  hq: [number, number];
  arcs: Arc[];
};

export default function ContactCoverage() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [features, setFeatures] = useState<Feature<Geometry>[] | null>(null);

  /**
   * The topology is 108KB, far too much to put in the page bundle for a
   * decoration most visitors never scroll to. It is fetched from /public the
   * first time the section comes near the viewport instead.
   */
  useEffect(() => {
    const el = canvasRef.current;
    if (!el || features) return;

    let cancelled = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();

        void fetch("/data/countries-110m.json")
          .then((res) => res.json())
          .then((topology) => {
            if (cancelled) return;
            // topojson's own types describe the container, not this file's
            // object keys, so the cast is at the boundary and nowhere else.
            const collection = feature(topology, topology.objects.countries) as unknown as {
              features: Feature<Geometry>[];
            };
            setFeatures(collection.features.filter((f) => f.id !== ANTARCTICA_ID));
          })
          .catch(() => {
            /* A map that never arrives leaves the card on the chip row, which
               still says where we are and who we work for. Nothing to report. */
          });
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [features]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !features) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas takes colour strings, not CSS values, so the tokens are resolved
    // once here. BRAND_GREEN is the documented fallback for somewhere that
    // cannot read the stylesheet — see lib/brand.ts.
    const style = getComputedStyle(document.documentElement);
    const green = style.getPropertyValue("--color-primary-green").trim() || BRAND_GREEN;
    const ink = style.getPropertyValue("--color-black").trim() || "#151515";
    const paper = style.getPropertyValue("--color-bg").trim() || "#fffdfb";

    /**
     * Everything that fades needs the green at a given alpha, and a canvas
     * fill is not a stylesheet: `color-mix()` is only parsed by some engines
     * there, and a fill string the engine cannot read is silently ignored
     * rather than throwing. So the token is resolved to channels once and the
     * fades are plain rgba(), which every canvas has understood forever.
     */
    const toChannels = (colour: string): [number, number, number] | null => {
      const hex = colour.trim().replace("#", "");
      if (/^[0-9a-f]{3}$/i.test(hex)) {
        return [
          parseInt(hex[0] + hex[0], 16),
          parseInt(hex[1] + hex[1], 16),
          parseInt(hex[2] + hex[2], 16),
        ];
      }
      if (/^[0-9a-f]{6}$/i.test(hex)) {
        return [
          parseInt(hex.slice(0, 2), 16),
          parseInt(hex.slice(2, 4), 16),
          parseInt(hex.slice(4, 6), 16),
        ];
      }
      const parts = colour.match(/-?\d*\.?\d+/g);
      return parts && parts.length >= 3
        ? [Number(parts[0]), Number(parts[1]), Number(parts[2])]
        : null;
    };

    // Never a second copy of the hex: if the token cannot be read, the same
    // parse runs over lib/brand.ts's single declaration instead.
    const channels = toChannels(green) ?? toChannels(BRAND_GREEN) ?? [0, 0, 0];

    const fade = (a: number) =>
      `rgba(${channels[0]},${channels[1]},${channels[2]},${a.toFixed(2)})`;

    const still = prefersReducedMotion();

    let built: Built | null = null;
    let cssWidth = 0;
    let visible = false;
    let frame: number | null = null;
    let last = 0;

    const build = () => {
      const css = canvas.clientWidth;
      if (!css) return;
      cssWidth = css;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(css * dpr);

      const projection = geoNaturalEarth1().fitWidth(width, { type: "Sphere" });

      // Crop the empty polar bands: the concept trims at 78°N and 48°S, then
      // nudges the whole thing left so the Pacific split is off-centre.
      const top = projection([0, 78])?.[1] ?? 0;
      const bottom = projection([0, -48])?.[1] ?? 0;
      const height = Math.round(bottom - top);
      if (height <= 0) return;
      const [tx, ty] = projection.translate();
      projection.translate([tx - width * 0.03, ty - top]);

      canvas.width = width;
      canvas.height = height;
      canvas.style.aspectRatio = `${width} / ${height}`;

      // Three flat key colours into an offscreen canvas, then read back.
      const keyed = document.createElement("canvas");
      keyed.width = width;
      keyed.height = height;
      const kx = keyed.getContext("2d", { willReadFrequently: true });
      if (!kx) return;
      const path = geoPath(projection, kx);

      const zone = new Set(MARKETS.map((market) => market.id));
      const groups: Record<"base" | "zone" | "hq", Feature<Geometry>[]> = {
        base: [],
        zone: [],
        hq: [],
      };
      for (const f of features) {
        const id = String(f.id);
        groups[id === HQ_ID ? "hq" : zone.has(id) ? "zone" : "base"].push(f);
      }
      for (const [key, colour] of [
        ["base", "#ff0000"],
        ["zone", "#00ff00"],
        ["hq", "#0000ff"],
      ] as const) {
        kx.beginPath();
        for (const f of groups[key]) path(f);
        kx.fillStyle = colour;
        kx.fill();
      }

      const pixels = kx.getImageData(0, 0, width, height).data;

      const base = document.createElement("canvas");
      base.width = width;
      base.height = height;
      const bx = base.getContext("2d");
      if (!bx) return;

      const step = Math.max(5, Math.round(width / 190));
      const radius = step * 0.3;
      const buckets = { base: new Path2D(), zone: new Path2D(), hq: new Path2D() };

      for (let y = step / 2; y < height; y += step) {
        for (let x = step / 2; x < width; x += step) {
          const i = (Math.floor(y) * width + Math.floor(x)) * 4;
          const key =
            pixels[i + 2] > 120
              ? "hq"
              : pixels[i + 1] > 120
                ? "zone"
                : pixels[i] > 120
                  ? "base"
                  : null;
          if (!key) continue;
          const r = key === "base" ? radius : radius * 1.15;
          buckets[key].moveTo(x + r, y);
          buckets[key].arc(x, y, r, 0, Math.PI * 2);
        }
      }

      bx.fillStyle = "#d8d8d2";
      bx.fill(buckets.base);
      bx.fillStyle = green;
      bx.fill(buckets.zone);
      bx.fillStyle = ink;
      bx.fill(buckets.hq);

      const hq = projection(HQ) as [number, number];
      const arcs: Arc[] = [];
      for (const market of MARKETS) {
        const p2 = projection(market.p);
        if (!p2) continue;
        const mid: [number, number] = [(hq[0] + p2[0]) / 2, (hq[1] + p2[1]) / 2];
        const dx = p2[0] - hq[0];
        const dy = p2[1] - hq[1];
        const dist = Math.hypot(dx, dy) || 1;
        let nx = -dy / dist;
        let ny = dx / dist;
        // Always bow the arc upward, whichever side of Dhaka it leaves from.
        if (ny > 0) {
          nx = -nx;
          ny = -ny;
        }
        arcs.push({
          p0: hq,
          p1: [mid[0] + nx * dist * 0.32, Math.max(8 * dpr, mid[1] + ny * dist * 0.32)],
          p2: p2 as [number, number],
          label: market.label,
          left: market.left,
          dy: market.dy,
        });
      }

      built = { width, height, dpr, base, hq, arcs };
    };

    const at = (arc: Arc, u: number): [number, number] => [
      (1 - u) * (1 - u) * arc.p0[0] + 2 * (1 - u) * u * arc.p1[0] + u * u * arc.p2[0],
      (1 - u) * (1 - u) * arc.p0[1] + 2 * (1 - u) * u * arc.p1[1] + u * u * arc.p2[1],
    ];

    const draw = (now: number) => {
      if (!built) return;
      const { width, height, dpr, base, hq, arcs } = built;
      const t = now / 1000;

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(base, 0, 0);
      ctx.lineCap = "round";

      arcs.forEach((arc, i) => {
        // The dotted route, always drawn in full.
        ctx.setLineDash([2 * dpr, 5 * dpr]);
        ctx.lineWidth = 1.2 * dpr;
        ctx.strokeStyle = "rgba(21,21,21,0.28)";
        ctx.beginPath();
        ctx.moveTo(arc.p0[0], arc.p0[1]);
        ctx.quadraticCurveTo(arc.p1[0], arc.p1[1], arc.p2[0], arc.p2[1]);
        ctx.stroke();
        ctx.setLineDash([]);

        // The comet over it — a fixed full-length trail when motion is off.
        const phase = still ? 1 : (t * 0.28 + i * 0.125) % 1;
        const raw = still ? 1 : phase * 1.3;
        const u = Math.min(1, raw);
        const u0 = still ? 0 : Math.max(0, u - 0.28);
        const segments = 16;
        for (let k = 0; k < segments; k += 1) {
          const a = at(arc, u0 + ((u - u0) * k) / segments);
          const b = at(arc, u0 + ((u - u0) * (k + 1)) / segments);
          ctx.strokeStyle = fade((k + 1) / segments);
          ctx.lineWidth = 2.8 * dpr;
          ctx.beginPath();
          ctx.moveTo(a[0], a[1]);
          ctx.lineTo(b[0], b[1]);
          ctx.stroke();
        }

        if (u < 1) {
          // The arrowhead, turned along the curve.
          const head = at(arc, u);
          const behind = at(arc, Math.max(0, u - 0.02));
          const angle = Math.atan2(head[1] - behind[1], head[0] - behind[0]);
          const s = 8 * dpr;
          ctx.save();
          ctx.translate(head[0], head[1]);
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(s * 0.6, 0);
          ctx.lineTo(-s * 0.6, -s * 0.55);
          ctx.lineTo(-s * 0.3, 0);
          ctx.lineTo(-s * 0.6, s * 0.55);
          ctx.closePath();
          ctx.fillStyle = ink;
          ctx.fill();
          ctx.restore();
        } else if (!still) {
          // Landing: one ring that opens and fades on arrival.
          const k = (raw - 1) / 0.3;
          ctx.beginPath();
          ctx.arc(arc.p2[0], arc.p2[1], (5 + k * 16) * dpr, 0, Math.PI * 2);
          ctx.fillStyle = fade(0.55 * (1 - k));
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(arc.p2[0], arc.p2[1], 4 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.lineWidth = 2 * dpr;
        ctx.strokeStyle = ink;
        ctx.stroke();
      });

      // Dhaka, pulsing.
      const pulse = still ? 0 : (t * 0.8) % 1;
      ctx.beginPath();
      ctx.arc(hq[0], hq[1], (8 + pulse * 22) * dpr, 0, Math.PI * 2);
      ctx.fillStyle = fade(0.5 * (1 - pulse));
      ctx.fill();
      ctx.beginPath();
      ctx.arc(hq[0], hq[1], 7 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = ink;
      ctx.fill();
      ctx.lineWidth = 3 * dpr;
      ctx.strokeStyle = green;
      ctx.stroke();

      ctx.font = `600 ${12 * dpr}px Geist, system-ui, sans-serif`;
      ctx.textBaseline = "middle";
      const pill = (x: number, y: number, text: string, isHq: boolean, left?: boolean) => {
        const textWidth = ctx.measureText(text).width;
        const padX = 10 * dpr;
        const boxH = 26 * dpr;
        const w = textWidth + padX * 2;
        const bx = left ? x - 12 * dpr - w : x + 12 * dpr;
        ctx.beginPath();
        ctx.roundRect(bx, y - boxH / 2, w, boxH, boxH / 2);
        ctx.fillStyle = isHq ? green : ink;
        ctx.fill();
        ctx.fillStyle = isHq ? ink : paper;
        ctx.fillText(text, bx + padX, y + 0.5 * dpr);
      };

      for (const arc of arcs) {
        if (arc.label) pill(arc.p2[0], arc.p2[1] + (arc.dy ?? 0) * dpr, arc.label, false, arc.left);
      }
      pill(hq[0], hq[1] + 22 * dpr, "Dhaka HQ", true);
    };

    const loop = (now: number) => {
      if (visible) {
        if (canvas.clientWidth !== cssWidth) build();
        // 30fps is plenty for eight arcs and costs half the frames.
        if (now - last > 33) {
          last = now;
          draw(now);
        }
      }
      frame = window.requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) visible = entry.isIntersecting;
    });
    io.observe(canvas);

    build();
    if (still) {
      draw(0);
    } else {
      frame = window.requestAnimationFrame(loop);
    }

    const onResize = () => {
      if (canvas.clientWidth !== cssWidth) {
        build();
        if (still) draw(0);
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      io.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [features]);

  useGSAP(
    () => {
      const trigger = reveal(sectionRef.current, { start: "top 84%" });

      gsap.from(".cv-head", {
        y: 22,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: trigger,
      });

      gsap.from(".cv-stat", {
        y: 20,
        opacity: 0,
        duration: 0.65,
        ease: "power2.out",
        stagger: 0.09,
        delay: 0.12,
        scrollTrigger: trigger,
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="mx-auto w-full max-w-[1360px] px-[clamp(20px,4vw,48px)] py-[clamp(80px,9vw,128px)]"
    >
      <div className="cv-head grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-end gap-x-[64px] gap-y-[24px] pb-[40px]">
        <div className="flex flex-col gap-[20px]">
          <span className="flex items-center gap-[10px] font-mono text-[12px] uppercase leading-none tracking-[0.08em] text-black">
            <span aria-hidden className="h-[2px] w-[24px] shrink-0 bg-primary-green" />
            Based in Dhaka · shipping worldwide
          </span>
          <h2 className="m-0 font-display text-[clamp(40px,5vw,72px)] font-semibold leading-[0.98] tracking-[-0.05em] text-balance text-black">
            Built in Bangladesh.{" "}
            <span className="font-serif font-normal italic tracking-[-0.02em]">
              Delivered worldwide.
            </span>
          </h2>
        </div>

        <p className="m-0 max-w-[520px] font-body text-[18px] leading-[1.55] tracking-[-0.1px] text-pretty text-neutral-paragraph">
          The team works from one office in Banani, Dhaka, and delivers for clients who
          keep their own hours. The four-business-hour reply is counted in ours, and every
          brief lands in the same inbox whichever time zone it is sent from.
        </p>
      </div>

      <div className="w-full overflow-hidden rounded-[32px] border border-black/12 bg-white">
        <div className="px-[clamp(8px,1.4vw,20px)] pt-[clamp(12px,2vw,28px)]">
          {/* The ratio the 78°N/48°S crop actually produces, so the box the
              canvas reserves before it is built is the box it ends up at and
              nothing reflows when the topology lands. The concept writes 2.3
              here and then overwrites it from JS, which shifts the page. */}
          <canvas ref={canvasRef} aria-hidden className="block aspect-[2.54/1] w-full" />
        </div>

        <div className="flex flex-wrap items-center gap-[6px] border-t border-black/10 px-[clamp(16px,2vw,28px)] pb-[24px] pt-[20px]">
          <span className="flex items-center gap-[8px] rounded-full bg-black px-[14px] py-[8px] font-body text-[13px] font-semibold leading-none tracking-[-0.1px] text-bg">
            <span aria-hidden className="size-[7px] shrink-0 rounded-full bg-primary-green" />
            Dhaka HQ
          </span>
          <span aria-hidden className="px-[4px] font-body text-[14px] text-neutral-paragraph">
            →
          </span>
          {MARKETS.map((market) => (
            <span
              key={market.id}
              className="rounded-full bg-[color-mix(in_srgb,var(--color-primary-green)_22%,var(--color-white))] px-[12px] py-[8px] font-body text-[13px] font-medium leading-none tracking-[-0.1px] text-[color-mix(in_srgb,var(--color-primary-green)_30%,var(--color-black))]"
            >
              {market.name}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-[12px] grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-[12px]">
        {STATS.map((stat, index) => (
          <div
            key={stat.label}
            className={`cv-stat flex flex-col gap-[24px] rounded-[24px] border px-[26px] py-[24px] ${
              index === 0
                ? "border-black bg-black text-bg"
                : "border-black/12 bg-white text-black"
            }`}
          >
            <span className="font-display text-[clamp(48px,5vw,72px)] font-semibold leading-[0.9] tracking-[-0.06em]">
              {stat.value}
            </span>
            <span
              className={`font-body text-[14px] leading-[1.4] tracking-[-0.1px] text-pretty ${
                index === 0 ? "text-white/60" : "text-neutral-paragraph"
              }`}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
