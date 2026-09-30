"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, Geometry } from "geojson";
import { BRAND_GREEN } from "@/lib/brand";
import { siteConfig } from "@/lib/site";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";

/**
 * The concept's global-reach block, to its own measurements and with its own
 * mechanism: a dotted Natural Earth world on a white card, arcs leaving Dhaka
 * for each market with a comet running along them, a chip row underneath, and
 * four figures below that.
 *
 * The dots are built the way the concept builds them, which is a nice trick
 * worth keeping: the countries are filled into an offscreen canvas in flat key
 * colours, the pixels are read back on a fixed grid, and each sample becomes a
 * dot whose colour is decided by which key it landed on. That gives a halftone
 * of real coastlines without hand-placing anything, and it reflows at any width
 * because the grid is derived from the width.
 *
 * Every country we ship to is keyed separately, so its dots, its arc, its
 * landing ring and its label all carry its own flag colour rather than one
 * blanket green.
 *
 * ONE THING NEEDS YOUR CONFIRMATION. The concept names eight countries as its
 * coverage zones. We do not publish a client-country list, so MARKETS below is
 * the concept's own list carried over as a placeholder — it is the single
 * place to edit, and nothing else in this file needs to change when you do.
 * The four figures are ours and are the ones the service pages already quote.
 */

type Market = {
  id: string;
  p: [number, number];
  name: string;
  /** What fits in a label pinned to a 44px-wide corner of Europe. */
  short: string;
  /** The flag's dominant colour — the country's dots, arc and label take it. */
  colour: string;
  /** A second colour from the same flag, for the label's flag-side rule. */
  accent: string;
  /**
   * Where the label sits relative to the country, in pixels at a 1000px-wide
   * map, scaled with the map. Six of the eight destinations are inside a 44 by
   * 64 pixel corner of Europe at world scale, so a label drawn at its own
   * point lands on top of five others. These fan the six out over the Atlantic
   * and Asia, each on a leader line back to its dot.
   */
  off: [number, number];
};

/**
 * PLACEHOLDER — confirm or replace before this page goes live.
 *
 * `id` is the ISO 3166-1 numeric code as world-atlas keys it, `p` is the
 * [lon, lat] the arc lands on, and `name` is what the chip row calls it. We do
 * not publish a client-country list, so this is the concept's own list carried
 * over; it is the one place to edit.
 */
const MARKETS: Market[] = [
  {
    id: "840",
    p: [-96, 39],
    name: "United States",
    short: "USA",
    colour: "#b22234",
    accent: "#3c3b6e",
    off: [0, -56],
  },
  {
    id: "826",
    p: [-1.8, 52.8],
    name: "United Kingdom",
    short: "UK",
    colour: "#012169",
    accent: "#c8102e",
    off: [-112, -8],
  },
  {
    id: "276",
    p: [10.4, 51.1],
    name: "Germany",
    short: "Germany",
    colour: "#e3a600",
    accent: "#1a1a1a",
    off: [96, 14],
  },
  {
    id: "250",
    p: [2.4, 46.8],
    name: "France",
    short: "France",
    colour: "#0055a4",
    accent: "#ef4135",
    off: [-108, 34],
  },
  {
    id: "528",
    p: [5.6, 52.2],
    name: "Netherlands",
    short: "Netherlands",
    colour: "#ae1c28",
    accent: "#21468b",
    off: [-72, -46],
  },
  {
    id: "724",
    p: [-3.7, 40.2],
    name: "Spain",
    short: "Spain",
    colour: "#c60b1e",
    accent: "#f1bf00",
    off: [-96, 58],
  },
  {
    id: "752",
    p: [15.5, 61],
    name: "Sweden",
    short: "Sweden",
    colour: "#006aa7",
    accent: "#fecc00",
    off: [92, -18],
  },
  {
    id: "036",
    p: [134, -25],
    name: "Australia",
    short: "Australia",
    colour: "#00247d",
    accent: "#cf142b",
    off: [-30, 46],
  },
];

/** Bangladesh, and Antarctica — the one the concept drops from the map. */
const HQ_ID = "050";
const ANTARCTICA_ID = "010";
const HQ: [number, number] = [90.4, 23.8];
/** The flag's bottle green and its red disc. */
const HQ_COLOUR = "#006a4e";
/** Where the Dhaka pill sits, in the same units as a market's `off`. */
const HQ_OFF: [number, number] = [0, 34];

/**
 * Flags at 16x12, drawn rather than set as emoji.
 *
 * Windows ships no colour flag glyphs, so a country flag written as an emoji
 * renders there as a two-letter box — the platform the site is built on is the
 * one it would fail on. These are geometry instead: right everywhere, and they
 * take the same colours the map does.
 */
const FLAGS: Record<string, React.ReactNode> = {
  "840": (
    <>
      <rect width="16" height="12" fill="#fff" />
      <g fill="#b22234">
        <rect width="16" height="1.7" />
        <rect y="3.4" width="16" height="1.7" />
        <rect y="6.8" width="16" height="1.7" />
        <rect y="10.2" width="16" height="1.7" />
      </g>
      <rect width="7" height="6.8" fill="#3c3b6e" />
    </>
  ),
  "826": (
    <>
      <rect width="16" height="12" fill="#012169" />
      <path d="M0 0 16 12M16 0 0 12" stroke="#fff" strokeWidth="2.6" />
      <path d="M0 0 16 12M16 0 0 12" stroke="#c8102e" strokeWidth="1.2" />
      <path d="M8 0V12M0 6H16" stroke="#fff" strokeWidth="4" />
      <path d="M8 0V12M0 6H16" stroke="#c8102e" strokeWidth="2.2" />
    </>
  ),
  "276": (
    <>
      <rect width="16" height="4" fill="#000" />
      <rect y="4" width="16" height="4" fill="#dd0000" />
      <rect y="8" width="16" height="4" fill="#ffce00" />
    </>
  ),
  "250": (
    <>
      <rect width="16" height="12" fill="#fff" />
      <rect width="5.34" height="12" fill="#0055a4" />
      <rect x="10.66" width="5.34" height="12" fill="#ef4135" />
    </>
  ),
  "528": (
    <>
      <rect width="16" height="4" fill="#ae1c28" />
      <rect y="4" width="16" height="4" fill="#fff" />
      <rect y="8" width="16" height="4" fill="#21468b" />
    </>
  ),
  "724": (
    <>
      <rect width="16" height="12" fill="#c60b1e" />
      <rect y="3" width="16" height="6" fill="#f1bf00" />
    </>
  ),
  "752": (
    <>
      <rect width="16" height="12" fill="#006aa7" />
      <rect x="4.6" width="2.6" height="12" fill="#fecc00" />
      <rect y="4.7" width="16" height="2.6" fill="#fecc00" />
    </>
  ),
  "036": (
    <>
      <rect width="16" height="12" fill="#00247d" />
      <path d="M0 0 8 6M8 0 0 6" stroke="#fff" strokeWidth="1.5" />
      <path d="M4 0V6M0 3H8" stroke="#fff" strokeWidth="2.4" />
      <path d="M4 0V6M0 3H8" stroke="#cf142b" strokeWidth="1.1" />
      <circle cx="4" cy="9.3" r="1.2" fill="#fff" />
      <circle cx="12.3" cy="3.6" r="0.85" fill="#fff" />
      <circle cx="13.4" cy="8.2" r="0.75" fill="#fff" />
    </>
  ),
  "050": (
    <>
      <rect width="16" height="12" fill="#006a4e" />
      <circle cx="7.2" cy="6" r="3.4" fill="#f42a41" />
    </>
  ),
};

function Flag({ id, className = "" }: { id: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 16 12"
      aria-hidden
      className={`block shrink-0 rounded-[2px] ${className}`}
    >
      {FLAGS[id]}
    </svg>
  );
}

/** The figures the service pages already quote. */
const STATS = [
  { value: "4h", label: "Reply to every brief, in business hours" },
  { value: "28+", label: "Systems delivered since 2021" },
  { value: "95%", label: "Client satisfaction on what shipped" },
  { value: "99.9%", label: "Uptime after migration" },
];

type Arc = {
  id: string;
  name: string;
  channels: [number, number, number];
  /** Which slot of the flight cycle this leg departs in. */
  slot: number;
  p0: [number, number];
  p1: [number, number];
  p2: [number, number];
};

/**
 * One leg is in the air at a time, near enough.
 *
 * Eight comets running at once over a bundle of eight routes is the knot: the
 * arcs converge because the destinations do, and no amount of bowing separates
 * six countries that sit inside thirty-seven pixels of each other at world
 * scale. So the routes stay faint and each leg gets its own slot of the cycle,
 * lit only while it flies. Slots are handed out with a stride, so the leg that
 * follows one into Europe is somewhere else entirely.
 */
const CYCLE = 0.08;
/** Slots a leg stays in the air for — a little over one, so they just overlap. */
const TRAVEL_SLOTS = 1.5;

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

function strideFor(count: number) {
  let stride = Math.max(2, Math.round(count / 3));
  while (stride > 1 && gcd(stride, count) !== 1) stride -= 1;
  return stride;
}

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
  const spotsRef = useRef<HTMLDivElement>(null);
  // Open from the start — the address is the point of the marker, and a card
  // you have to find first is a card most visitors never see. The button stays
  // so it can be folded away over the map.
  const [deskOpen, setDeskOpen] = useState(true);
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

    /**
     * Everything that fades needs a colour at a given alpha, and a canvas fill
     * is not a stylesheet: `color-mix()` is only parsed by some engines there,
     * and a fill string the engine cannot read is silently ignored rather than
     * throwing. So colours are resolved to channels once and the fades are
     * plain rgba(), which every canvas has understood forever.
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
    const fallback = toChannels(green) ?? toChannels(BRAND_GREEN) ?? [0, 0, 0];
    const rgba = (c: [number, number, number], a: number) =>
      `rgba(${c[0]},${c[1]},${c[2]},${a.toFixed(2)})`;

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

      /**
       * One key per country rather than the concept's three buckets, so each
       * market's dots can be its own flag colour. The key is written into the
       * red channel: keys are 24 apart, and a sample is only accepted within 6
       * of one, so the blended pixels along a shared border fall through to the
       * grey rather than being read as whichever neighbour they happen to
       * average towards. Edges against the sea keep their key exactly —
       * getImageData is not premultiplied, so only the alpha drops there.
       */
      const BASE_KEY = 8;
      const HQ_KEY = 250;
      const keyOf = new Map<string, number>();
      MARKETS.forEach((market, index) => keyOf.set(market.id, 20 + index * 24));
      const colourOf = new Map<number, string>([
        [BASE_KEY, "#d8d8d2"],
        [HQ_KEY, HQ_COLOUR],
      ]);
      for (const market of MARKETS) {
        colourOf.set(keyOf.get(market.id) as number, market.colour);
      }

      const keyed = document.createElement("canvas");
      keyed.width = width;
      keyed.height = height;
      const kx = keyed.getContext("2d", { willReadFrequently: true });
      if (!kx) return;
      const path = geoPath(projection, kx);

      const groups = new Map<number, Feature<Geometry>[]>();
      for (const f of features) {
        const id = String(f.id);
        const key = id === HQ_ID ? HQ_KEY : (keyOf.get(id) ?? BASE_KEY);
        const list = groups.get(key);
        if (list) list.push(f);
        else groups.set(key, [f]);
      }
      for (const [key, list] of groups) {
        kx.beginPath();
        for (const f of list) path(f);
        kx.fillStyle = `rgb(${key},0,0)`;
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
      // Insertion order is paint order, and the grey goes down first so a dot
      // shared with a neighbour is overpainted by the country that matters.
      const dots = new Map<number, Path2D>([[BASE_KEY, new Path2D()]]);

      for (let y = step / 2; y < height; y += step) {
        for (let x = step / 2; x < width; x += step) {
          const i = (Math.floor(y) * width + Math.floor(x)) * 4;
          if (pixels[i + 3] < 100) continue;
          const red = pixels[i];

          let key = BASE_KEY;
          for (const candidate of colourOf.keys()) {
            if (Math.abs(red - candidate) <= 6) {
              key = candidate;
              break;
            }
          }

          const r = key === BASE_KEY ? radius : radius * 1.2;
          let bucket = dots.get(key);
          if (!bucket) {
            bucket = new Path2D();
            dots.set(key, bucket);
          }
          bucket.moveTo(x + r, y);
          bucket.arc(x, y, r, 0, Math.PI * 2);
        }
      }

      for (const [key, bucket] of dots) {
        bx.fillStyle = colourOf.get(key) ?? "#d8d8d2";
        bx.fill(bucket);
      }

      const hq = projection(HQ) as [number, number];
      const landed = MARKETS.map((market) => ({
        market,
        p2: projection(market.p) as [number, number] | null,
      })).filter((entry): entry is { market: Market; p2: [number, number] } => Boolean(entry.p2));

      /**
       * The bows are nested by the heading each leg leaves Dhaka on.
       *
       * Six of the eight destinations sit in one corner of Europe, so their
       * legs leave on almost the same heading; bowing them all by the same
       * fraction stacks them into one rope, and varying the bow by anything
       * that is not the departure angle makes them cut across each other
       * instead. Sorted by that angle and bowed in order, they read as nested
       * layers and no two legs ever cross.
       */
      const ranked = landed
        .map((entry, index) => ({
          index,
          angle: Math.atan2(entry.p2[1] - hq[1], entry.p2[0] - hq[0]),
        }))
        .sort((a, b) => a.angle - b.angle);
      const rank = new Map<number, number>();
      ranked.forEach((entry, position) => rank.set(entry.index, position));

      const stride = strideFor(landed.length);

      const arcs: Arc[] = landed.map(({ market, p2 }, index) => {
        const position = rank.get(index) ?? 0;
        const spread = landed.length > 1 ? position / (landed.length - 1) : 0;
        // Shallow, so each leg reads as a direct route. The concept bows by a
        // third of the leg's own length, which throws the long westward ones up
        // over the pole and drops them back down through Europe.
        const bow = 0.1 + spread * 0.2;

        const mid: [number, number] = [(hq[0] + p2[0]) / 2, (hq[1] + p2[1]) / 2];
        const dx = p2[0] - hq[0];
        const dy = p2[1] - hq[1];
        const dist = Math.hypot(dx, dy) || 1;
        let nx = -dy / dist;
        let ny = dx / dist;
        // Always bow upward, whichever side of Dhaka the leg leaves from.
        if (ny > 0) {
          nx = -nx;
          ny = -ny;
        }

        return {
          id: market.id,
          name: market.name,
          channels: toChannels(market.colour) ?? fallback,
          slot: (position * stride) % landed.length,
          p0: hq,
          p1: [mid[0] + nx * dist * bow, Math.max(8 * dpr, mid[1] + ny * dist * bow)],
          p2,
        };
      });

      built = { width, height, dpr, base, hq, arcs };

      /**
       * The labels are ordinary DOM over the canvas, so the browser lays the
       * country names out, they are reachable by keyboard and readable by a
       * screen reader, and the six European ones can be fanned out on leader
       * lines instead of being burned into the bitmap on top of each other.
       * Their positions are the projection's, in CSS pixels, written straight
       * onto the elements — no state, so this never re-renders the section.
       */
      const layer = spotsRef.current;
      if (!layer) return;

      const cw = width / dpr;
      const ch = height / dpr;
      const scale = cw / 1000;

      const leaders = layer.querySelector("svg[data-leaders]");
      leaders?.setAttribute("viewBox", `0 0 ${cw} ${ch}`);

      const place = (id: string, point: [number, number], off: [number, number]) => {
        const x = point[0] / dpr;
        const y = point[1] / dpr;

        const spot = layer.querySelector<HTMLElement>(`[data-spot="${id}"]`);
        if (spot) {
          spot.style.left = `${x.toFixed(1)}px`;
          spot.style.top = `${y.toFixed(1)}px`;
        }

        const lx = x + off[0] * scale;
        const ly = y + off[1] * scale;

        const label = layer.querySelector<HTMLElement>(`[data-label="${id}"]`);
        if (label) {
          label.style.left = `${lx.toFixed(1)}px`;
          label.style.top = `${ly.toFixed(1)}px`;
          label.style.opacity = "1";
        }

        const leader = layer.querySelector<SVGLineElement>(`[data-leader="${id}"]`);
        if (leader) {
          leader.setAttribute("x1", x.toFixed(1));
          leader.setAttribute("y1", y.toFixed(1));
          leader.setAttribute("x2", lx.toFixed(1));
          leader.setAttribute("y2", ly.toFixed(1));
        }
      };

      for (const { market, p2 } of landed) place(market.id, p2, market.off);
      place(HQ_ID, hq, HQ_OFF);
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

      const share = 1 / arcs.length;
      const travel = share * TRAVEL_SLOTS;
      const turn = (t * CYCLE) % 1;

      arcs.forEach((arc) => {
        // Where this leg is in its own slot. Past 1.3 it has landed and faded,
        // and the route is all that is left of it until its next turn.
        const raw = still ? 1 : ((turn - arc.slot * share + 1) % 1) / travel;
        const flying = still || raw <= 1.3;

        // The route, always drawn in full but faint, and only lit for the leg
        // currently flying it.
        ctx.setLineDash([2 * dpr, 5 * dpr]);
        ctx.lineWidth = 1.2 * dpr;
        ctx.strokeStyle = rgba(arc.channels, flying ? 0.5 : 0.2);
        ctx.beginPath();
        ctx.moveTo(arc.p0[0], arc.p0[1]);
        ctx.quadraticCurveTo(arc.p1[0], arc.p1[1], arc.p2[0], arc.p2[1]);
        ctx.stroke();
        ctx.setLineDash([]);

        const u = Math.min(1, raw);
        const u0 = still ? 0 : Math.max(0, u - 0.28);
        if (flying) {
          // The comet — a fixed full-length trail when motion is off.
          const segments = 16;
          for (let k = 0; k < segments; k += 1) {
            const a = at(arc, u0 + ((u - u0) * k) / segments);
            const b = at(arc, u0 + ((u - u0) * (k + 1)) / segments);
            ctx.strokeStyle = rgba(arc.channels, (k + 1) / segments);
            ctx.lineWidth = 2.8 * dpr;
            ctx.beginPath();
            ctx.moveTo(a[0], a[1]);
            ctx.lineTo(b[0], b[1]);
            ctx.stroke();
          }
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
          ctx.fillStyle = rgba(arc.channels, 1);
          ctx.fill();
          ctx.restore();
        } else if (!still && flying) {
          // Landing: one ring that opens and fades on arrival.
          const k = (raw - 1) / 0.3;
          ctx.beginPath();
          ctx.arc(arc.p2[0], arc.p2[1], (5 + k * 16) * dpr, 0, Math.PI * 2);
          ctx.fillStyle = rgba(arc.channels, 0.55 * (1 - k));
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(arc.p2[0], arc.p2[1], 4 * dpr, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
        ctx.lineWidth = 2 * dpr;
        ctx.strokeStyle = rgba(arc.channels, 1);
        ctx.stroke();
      });

      // Dhaka, pulsing. The pulse stays the brand green; everything else on
      // the map is now a flag colour, and this is the one point that is ours.
      const pulse = still ? 0 : (t * 0.8) % 1;
      ctx.beginPath();
      ctx.arc(hq[0], hq[1], (8 + pulse * 22) * dpr, 0, Math.PI * 2);
      ctx.fillStyle = rgba(fallback, 0.5 * (1 - pulse));
      ctx.fill();
      ctx.beginPath();
      ctx.arc(hq[0], hq[1], 7 * dpr, 0, Math.PI * 2);
      ctx.fillStyle = ink;
      ctx.fill();
      ctx.lineWidth = 3 * dpr;
      ctx.strokeStyle = green;
      ctx.stroke();

      // Nothing is lettered on the canvas any more. Every name is a label in
      // the layer above, where it can be fanned off a leader line, tabbed to
      // and read aloud.
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
        <div className="relative px-[clamp(8px,1.4vw,20px)] pt-[clamp(12px,2vw,28px)]">
          {/* The ratio the 78°N/48°S crop actually produces, so the box the
              canvas reserves before it is built is the box it ends up at and
              nothing reflows when the topology lands. The concept writes 2.3
              here and then overwrites it from JS, which shifts the page. */}
          <canvas ref={canvasRef} aria-hidden className="block aspect-[2.54/1] w-full" />

          <div
            ref={spotsRef}
            className="pointer-events-none absolute inset-x-[clamp(8px,1.4vw,20px)] bottom-0 top-[clamp(12px,2vw,28px)]"
          >
            {/* The leader lines, in the same CSS-pixel frame as the labels.
                Hidden with them below 900px, where the map is too narrow for
                the fan to clear Europe and the chip row does the naming. */}
            <svg
              data-leaders
              aria-hidden
              className="absolute inset-0 hidden size-full min-[900px]:block"
            >
              {MARKETS.map((market) => (
                <line
                  key={market.id}
                  data-leader={market.id}
                  stroke={market.colour}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  opacity={0.55}
                />
              ))}
            </svg>

            {MARKETS.map((market) => (
              <span key={market.id} className="contents">
                {/* The dot itself is painted on the canvas; this is the hit
                    area, and the name it carries is what a narrow screen and a
                    screen reader get instead of the fanned label. */}
                <span
                  data-spot={market.id}
                  tabIndex={0}
                  role="img"
                  aria-label={`${market.name} — covered from Dhaka`}
                  className="group pointer-events-auto absolute -ml-[13px] -mt-[13px] flex size-[26px] cursor-default items-center justify-center rounded-full outline-none"
                >
                  <span className="pointer-events-none absolute bottom-[calc(100%-2px)] left-1/2 hidden -translate-x-1/2 items-center gap-[7px] whitespace-nowrap rounded-full bg-black px-[10px] py-[6px] font-body text-[12px] font-semibold leading-none text-bg shadow-[0_6px_18px_rgba(10,10,10,0.25)] group-hover:flex group-focus-visible:flex">
                    <Flag id={market.id} className="w-[16px] ring-1 ring-white/25" />
                    {market.name}
                  </span>
                  <span
                    style={{ ["--spot" as string]: market.colour }}
                    className="size-[18px] rounded-full transition-[box-shadow] group-hover:shadow-[0_0_0_6px_color-mix(in_srgb,var(--spot)_30%,transparent)] group-focus-visible:shadow-[0_0_0_6px_color-mix(in_srgb,var(--spot)_30%,transparent)]"
                  />
                </span>

                {/* The fanned label: flag, name, and a rule in the flag's
                    second colour. `off` on the market decides where it lands. */}
                <span
                  aria-hidden
                  data-label={market.id}
                  className="pointer-events-none absolute hidden -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-500 items-center gap-[6px] whitespace-nowrap rounded-full border border-black/10 bg-white/95 py-[4px] pl-[5px] pr-[10px] font-body text-[11.5px] font-semibold leading-none tracking-[-0.1px] text-black shadow-[0_4px_14px_rgba(10,10,10,0.12)] backdrop-blur-[2px] min-[900px]:flex"
                >
                  <Flag id={market.id} className="w-[17px] ring-1 ring-black/15" />
                  <span
                    aria-hidden
                    style={{ background: market.accent }}
                    className="h-[11px] w-[2px] shrink-0 rounded-full"
                  />
                  {market.short}
                </span>
              </span>
            ))}

            {/* Dhaka is the one that opens rather than just naming itself, so
                unlike the destinations its pill is always on the map and is
                obviously a control — a bare hit area over the dot is something
                nobody finds. */}
            <span data-spot={HQ_ID} className="absolute" />
            <span
              data-label={HQ_ID}
              className="pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-500"
            >
              <button
                type="button"
                onClick={() => setDeskOpen((open) => !open)}
                aria-expanded={deskOpen}
                className="flex cursor-pointer items-center gap-[7px] whitespace-nowrap rounded-full bg-black py-[5px] pl-[6px] pr-[10px] font-body text-[11.5px] font-semibold leading-none tracking-[-0.1px] text-bg shadow-[0_6px_18px_rgba(10,10,10,0.28)] outline-none ring-offset-2 transition-colors duration-200 hover:bg-[#006a4e] focus-visible:ring-2 focus-visible:ring-black"
              >
                <Flag id={HQ_ID} className="w-[17px] ring-1 ring-white/25" />
                Dhaka HQ
                <span aria-hidden className="text-[10px] leading-none text-primary-green">
                  {deskOpen ? "▲" : "▼"}
                </span>
              </button>

              {deskOpen ? (
                <span className="absolute left-1/2 top-[calc(100%+10px)] z-[2] flex w-[248px] -translate-x-1/2 flex-col gap-[10px] rounded-[16px] border border-black/10 bg-white p-[16px] text-left shadow-[0_18px_44px_rgba(10,10,10,0.22)]">
                  <span className="flex items-center gap-[8px] font-mono text-[11px] uppercase leading-none tracking-[0.08em] text-neutral-paragraph">
                    <span
                      aria-hidden
                      className="size-[7px] shrink-0 rounded-full bg-primary-green"
                    />
                    {siteConfig.name} · Dhaka
                  </span>
                  <span className="font-body text-[14px] leading-[1.45] tracking-[-0.1px] text-black">
                    {siteConfig.addressLine}
                  </span>
                  <a
                    href={siteConfig.mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-[6px] font-body text-[13px] font-semibold leading-none tracking-[-0.1px] text-black underline decoration-primary-green decoration-[2px] underline-offset-[4px]"
                  >
                    Open in Google Maps
                    <span aria-hidden>↗</span>
                  </a>
                </span>
              ) : null}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-[6px] border-t border-black/10 px-[clamp(16px,2vw,28px)] pb-[24px] pt-[20px]">
          <span className="flex items-center gap-[8px] rounded-full bg-black px-[12px] py-[8px] font-body text-[13px] font-semibold leading-none tracking-[-0.1px] text-bg">
            <Flag id={HQ_ID} className="w-[18px] ring-1 ring-white/25" />
            Dhaka HQ
          </span>
          <span aria-hidden className="px-[4px] font-body text-[14px] text-neutral-paragraph">
            →
          </span>
          {MARKETS.map((market) => (
            <span
              key={market.id}
              style={{ ["--spot" as string]: market.colour }}
              className="flex items-center gap-[8px] rounded-full border border-[color-mix(in_srgb,var(--spot)_35%,transparent)] bg-[color-mix(in_srgb,var(--spot)_8%,var(--color-white))] px-[12px] py-[8px] font-body text-[13px] font-medium leading-none tracking-[-0.1px] text-[color-mix(in_srgb,var(--spot)_72%,var(--color-black))]"
            >
              <Flag id={market.id} className="w-[18px] ring-1 ring-black/15" />
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
