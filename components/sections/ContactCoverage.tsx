"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { geoOrthographic, geoPath, geoGraticule10, geoDistance } from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import { BRAND_GREEN } from "@/lib/brand";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";

/**
 * The concept's coverage block: a spinning orthographic globe on a warm grey
 * field, with the figures floating over the top of it on frosted cards.
 *
 * The globe is the concept's own construction — d3-geo's orthographic
 * projection drawn to a canvas, countries filled flat, a graticule under them,
 * and a marker that pulses on the point the projection has rotated into view.
 * It is drawn at a capped device-pixel ratio and only while it is on screen,
 * and it stops entirely for a visitor who has asked for reduced motion.
 *
 * ONE DEPARTURE FROM THE SOURCE, deliberately. The concept fills a set of
 * countries green as "coverage zones" and labels four of them. We do not
 * publish a client-country list and I am not going to invent one, so the
 * landmasses stay neutral and the only thing marked is Dhaka, which is where
 * the office actually is. The shape, the motion and the furniture are the
 * concept's; the claim is not one we cannot stand behind.
 */

/** Where the office is, and what the marker says. */
const HQ: [number, number] = [90.4101, 23.7902];
const HQ_LABEL = "Dhaka HQ";

/** The figures over the globe — the same ones the service pages quote. */
const STATS = [
  { label: "Reply SLA · always", value: "4", unit: "H" },
  { label: "Systems delivered", value: "28", unit: "+" },
  { label: "Client satisfaction", value: "95", unit: "%" },
  { label: "Uptime after migration", value: "99.9", unit: "%" },
];

type World = {
  countries: FeatureCollection<Geometry>;
};

export default function ContactCoverage() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [world, setWorld] = useState<World | null>(null);

  // Rotation, drag state and the frame handle live in refs — the draw loop
  // runs off requestAnimationFrame and must not re-render anything.
  const lambdaRef = useRef(-90);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const visibleRef = useRef(false);

  /**
   * The topology is 108KB, which is far too much to put in the page bundle for
   * a decoration most visitors never scroll to. It is fetched from /public the
   * first time the section comes near the viewport instead.
   */
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    let cancelled = false;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibleRef.current = entry.isIntersecting;
          if (!entry.isIntersecting || world) continue;

          void fetch("/data/countries-110m.json")
            .then((res) => res.json())
            .then((topology) => {
              if (cancelled) return;
              // topojson's own types describe the container, not this file's
              // object keys, so the cast is at the boundary and nowhere else.
              const collection = feature(
                topology,
                topology.objects.countries,
              ) as unknown as FeatureCollection<Geometry>;
              setWorld({ countries: collection });
            })
            .catch(() => {
              /* A globe that never arrives leaves the cards on a plain field,
                 which is a perfectly good section. Nothing to report. */
            });
        }
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(el);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [world]);

  /** The draw loop. */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !world) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = prefersReducedMotion();
    const graticule = geoGraticule10();
    const projection = geoOrthographic();

    let frame: number | null = null;
    let width = 0;

    // Canvas takes colour strings, not CSS values, so the tokens are resolved
    // once here. BRAND_GREEN is the documented fallback for exactly this —
    // somewhere that cannot read the stylesheet — rather than a second copy of
    // the hex; see lib/brand.ts.
    const style = getComputedStyle(document.documentElement);
    const green = style.getPropertyValue("--color-primary-green").trim() || BRAND_GREEN;
    const ink = style.getPropertyValue("--color-black").trim() || "#151515";

    const draw = () => {
      // Cap the backing store: this is a decoration, and a 3x canvas of it
      // costs more than it is worth on a phone.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const css = canvas.clientWidth;
      if (css && Math.round(css * dpr) !== width) {
        width = Math.round(css * dpr);
        canvas.width = width;
        canvas.height = width;
      }
      if (!width) {
        frame = window.requestAnimationFrame(draw);
        return;
      }

      const phi = -12;
      projection
        .scale(width / 2 - 2 * dpr)
        .translate([width / 2, width / 2])
        .rotate([lambdaRef.current, phi]);

      const path = geoPath(projection, ctx);

      ctx.clearRect(0, 0, width, width);

      // The sphere, then the grid, then the land on top of both.
      ctx.beginPath();
      path({ type: "Sphere" });
      ctx.fillStyle = "#f7f7f2";
      ctx.fill();

      ctx.beginPath();
      path(graticule);
      ctx.strokeStyle = "rgba(10,10,10,0.06)";
      ctx.lineWidth = dpr;
      ctx.stroke();

      ctx.beginPath();
      for (const country of world.countries.features) path(country);
      ctx.fillStyle = "#d2d2c9";
      ctx.fill();
      ctx.strokeStyle = "#f7f7f2";
      ctx.lineWidth = 0.8 * dpr;
      ctx.stroke();

      // The marker, only while the rotation has it on the near face.
      const centre: [number, number] = [-lambdaRef.current, -phi];
      if (geoDistance(HQ, centre) <= 1.4) {
        const point = projection(HQ);
        if (point) {
          const [x, y] = point;
          const t = performance.now() / 1000;
          const pulse = (t * 14) % 18;

          ctx.beginPath();
          ctx.arc(x, y, (8 + pulse) * dpr, 0, Math.PI * 2);
          ctx.fillStyle = `color-mix(in srgb, ${green} ${Math.round(
            50 * (1 - pulse / 18),
          )}%, transparent)`;
          ctx.fill();

          ctx.beginPath();
          ctx.arc(x, y, 6 * dpr, 0, Math.PI * 2);
          ctx.fillStyle = green;
          ctx.fill();
          ctx.lineWidth = 2.5 * dpr;
          ctx.strokeStyle = ink;
          ctx.stroke();

          ctx.font = `600 ${12 * dpr}px Geist, system-ui, sans-serif`;
          ctx.textBaseline = "middle";
          const textWidth = ctx.measureText(HQ_LABEL).width;
          const padX = 10 * dpr;
          const boxH = 26 * dpr;
          const boxX = x + 12 * dpr;

          ctx.beginPath();
          ctx.roundRect(boxX, y - boxH / 2, textWidth + padX * 2, boxH, boxH / 2);
          ctx.fillStyle = ink;
          ctx.fill();
          ctx.fillStyle = green;
          ctx.fillText(HQ_LABEL, boxX + padX, y + 0.5 * dpr);
        }
      }

      if (!reduced && !draggingRef.current && visibleRef.current) {
        lambdaRef.current += 0.12;
      }

      // A hidden section costs one idle frame a second rather than sixty.
      frame = window.requestAnimationFrame(draw);
    };

    frame = window.requestAnimationFrame(draw);

    // Drag to spin it.
    const onDown = (event: PointerEvent) => {
      draggingRef.current = true;
      lastXRef.current = event.clientX;
      canvas.style.cursor = "grabbing";
      canvas.setPointerCapture(event.pointerId);
    };
    const onMove = (event: PointerEvent) => {
      if (!draggingRef.current) return;
      lambdaRef.current += (event.clientX - lastXRef.current) * 0.35;
      lastXRef.current = event.clientX;
    };
    const onUp = () => {
      draggingRef.current = false;
      canvas.style.cursor = "grab";
    };

    canvas.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [world]);

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
      className="mx-auto w-full max-w-[1440px] px-6 py-[80px] lg:px-[40px] lg:py-[128px]"
    >
      <div className="cv-head grid w-full grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-x-[64px] gap-y-[24px] pb-[40px]">
        <div className="flex flex-col gap-[20px]">
          <span className="flex items-center gap-[10px] font-mono text-[12px] uppercase leading-none tracking-[0.1em] text-black">
            <span aria-hidden className="h-[2px] w-[24px] shrink-0 bg-primary-green" />
            Where we work from · where we cover
          </span>
          <h2 className="font-display text-[clamp(40px,5vw,72px)] font-semibold leading-[0.98] tracking-[-0.05em] text-black">
            One HQ.{" "}
            <span className="font-serif font-normal italic tracking-[-0.02em]">
              Clients on every clock.
            </span>
          </h2>
        </div>

        <p className="m-0 max-w-[520px] font-body text-[18px] leading-[1.55] tracking-[-0.1px] text-pretty text-neutral-paragraph">
          The team works from one office in Banani, Dhaka, for clients who keep their own
          hours. The four-business-hour reply is counted in business hours here — drag the
          globe to find us.
        </p>
      </div>

      <div className="relative h-[clamp(620px,66vw,860px)] w-full overflow-hidden rounded-[32px] bg-[#e8e8e1]">
        <canvas
          ref={canvasRef}
          aria-hidden
          className="absolute left-1/2 top-[clamp(170px,13vw,190px)] aspect-square w-[max(560px,min(1120px,100%))] -translate-x-1/2 cursor-grab touch-pan-y"
        />

        {/* The figures ride over the globe on frosted cards. Pointer events are
            off so the whole field stays draggable underneath them. */}
        <dl className="pointer-events-none relative z-[2] grid grid-cols-[repeat(auto-fit,minmax(min(100%,190px),1fr))] gap-[12px] p-[12px] lg:p-[20px]">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="cv-stat flex flex-col gap-[28px] rounded-[22px] border border-black/10 bg-white/85 px-[22px] pb-[24px] pt-[20px] backdrop-blur-[10px]"
            >
              <dt className="font-mono text-[11px] uppercase leading-none tracking-[0.08em] text-neutral-paragraph">
                {stat.label}
              </dt>
              <dd className="flex items-start gap-[6px] font-display text-[clamp(56px,6vw,84px)] font-medium leading-[0.85] tracking-[-0.06em] text-black">
                {stat.value}
                <span className="rounded-[8px] bg-primary-green px-[8px] py-[3px] font-body text-[18px] font-semibold leading-[1.2] tracking-normal text-white">
                  {stat.unit}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
