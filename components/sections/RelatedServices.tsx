"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion, reveal } from "@/lib/anim";
import { SERVICES, WORK_DOMAINS } from "@/lib/services";

/**
 * Two grounds, alternating.
 *
 * This board used to run four deep grounds — graphite, lime, forest and paper
 * — across a bento grid. It is a rail now, and a rail is read left to right:
 * four colours cycling past is a pattern to decode rather than a set of cards.
 * So white, with ink every third card as punctuation, and the brand green as
 * the single accent inside either of them.
 */
type Scheme = {
  ground: string;
  /** What the screen is drawn in. */
  ink: string;
  title: string;
  muted: string;
  /** The one highlight: the index, and the live element inside the screen. */
  accent: string;
  edge: string;
  /** How much accent bleeds into the wash behind the screen. */
  glow: number;
};

const PAPER: Scheme = {
  ground: "#ffffff",
  ink: "#151515",
  title: "#0b0b0b",
  muted: "rgba(21,21,21,0.56)",
  // A deeper green than the brand token: the brand value is tuned to sit on
  // black, and on white it is barely type.
  accent: "#4d7d13",
  edge: "rgba(21,21,21,0.10)",
  glow: 10,
};

const INK: Scheme = {
  ground: "linear-gradient(168deg, #1e1e1e 0%, #070707 100%)",
  ink: "#ffffff",
  title: "#ffffff",
  muted: "rgba(255,255,255,0.56)",
  accent: "var(--color-primary-green)",
  edge: "rgba(255,255,255,0.09)",
  glow: 26,
};

/** Ink every third card, the way the reference punctuates a row of white. */
const SCHEMES = [PAPER, INK, PAPER];

/**
 * The rail's card: portrait, because the artwork wants the whole foot of it and
 * the title wants the whole head, with nothing competing across the middle.
 */
const CARD = "h-[418px] w-[258px] lg:h-[476px] lg:w-[300px]";

/**
 * How many times the rail repeats itself.
 *
 * It scrolls back to the start after exactly one copy, which lands on an
 * identical frame and so has no seam. For that to be reachable the copies
 * BEHIND the first have to cover the window — otherwise the rail hits the end
 * of its own scroll and stops dead before it comes round.
 *
 * Fifteen cards is 4,710px, so two copies cover any window worth designing for.
 * Six — the sibling row on a service page — is only 1,884px, and two copies
 * would strand a 1,920px monitor; three carry it to 3,768px.
 *
 * It is also why the space between cards is a margin on the card rather than
 * `gap` on the row: with `gap` the row is one gap short of whole copies, and
 * the loop jumps that gap every time it comes round.
 */
const railCopies = (count: number) => (count >= 10 ? 2 : 3);
const CARD_GAP = "mr-[14px]";

/**
 * Pixels a second. Slow enough to read a card as it passes, and stated as a
 * rate rather than a duration so the six-card row on a service page drifts at
 * the same speed as the fifteen-card one on /services.
 */
const RAIL_SPEED = 26;

type Card = {
  key: string;
  title: string;
  line: string;
  art: string;
  href: string | null;
};

const DOMAIN_ART: Record<string, string> = {
  "Custom Software": "custom",
  "Web Applications": "webapps",
  "ERP Systems": "erp",
  "CRM Systems": "crm",
  "Enterprise Software": "enterprise",
  "API Development": "api",
  Microservices: "microservices",
  "Business Automation": "automation",
};

const SERVICE_ART: Record<string, string> = {
  "saas-platform-development": "saas",
  "ecommerce-digital-commerce": "ecommerce",
  "devops-cloud-infrastructure": "devops",
  "ai-ml-data-analytics": "aiml",
  "technology-consulting": "consulting",
  "mobile-app-development": "mobile",
  "cybersecurity-data-protection": "security",
};

/* ---------------------------------------------------------------- screens */

/**
 * The chrome every screen sits in.
 *
 * These are meant to read as a screenshot of what each service produces rather
 * than as an icon of it — so they get a window with a real title bar, a sidebar
 * or a toolbar where the product would have one, and content laid out where
 * content goes. One chrome across all fifteen is what stops a board of
 * screenshots looking like fifteen unrelated pictures.
 */
function Window({ ink, children }: { ink: string; children: React.ReactNode }) {
  return (
    <>
      <rect x="4" y="6" width="152" height="108" rx="9" fill={ink} fillOpacity="0.07" />
      <rect x="4" y="6" width="152" height="108" rx="9" fill="none" stroke={ink} strokeOpacity="0.2" />
      <path d="M4 20h152" stroke={ink} strokeOpacity="0.16" />
      <circle cx="12" cy="13" r="1.8" fill={ink} fillOpacity="0.3" />
      <circle cx="18.5" cy="13" r="1.8" fill={ink} fillOpacity="0.2" />
      <circle cx="25" cy="13" r="1.8" fill={ink} fillOpacity="0.2" />
      {children}
    </>
  );
}

/** A handset, for the one service whose product is a handset. */
function Phone({ ink, children }: { ink: string; children: React.ReactNode }) {
  return (
    <>
      <rect x="47" y="2" width="66" height="116" rx="12" fill={ink} fillOpacity="0.08" />
      <rect x="47" y="2" width="66" height="116" rx="12" fill="none" stroke={ink} strokeOpacity="0.22" />
      <rect x="70" y="6" width="20" height="3.4" rx="1.7" fill={ink} fillOpacity="0.3" />
      {children}
    </>
  );
}

function Art({ id, ink, accent }: { id: string; ink: string; accent: string }) {
  const f = (o: number) => ({ fill: ink, fillOpacity: o });
  const s = (o: number, w = 1.3) => ({ stroke: ink, strokeOpacity: o, strokeWidth: w, fill: "none" });
  const on = "#0d2004";

  switch (id) {
    case "saas":
      // A tenant console: nav, three counters, usage climbing.
      return (
        <Window ink={ink}>
          <rect x="9" y="25" width="30" height="84" rx="5" {...f(0.09)} />
          <rect x="13" y="30" width="20" height="3.4" rx="1.7" fill={accent} />
          <rect x="13" y="38" width="16" height="3" rx="1.5" {...f(0.2)} />
          <rect x="13" y="45" width="18" height="3" rx="1.5" {...f(0.14)} />
          <rect x="13" y="52" width="14" height="3" rx="1.5" {...f(0.14)} />
          {[44, 84, 124].map((x, i) => (
            <g key={x}>
              <rect x={x} y="25" width="32" height="24" rx="4" {...f(i === 0 ? 0.16 : 0.09)} />
              <rect x={x + 5} y="31" width="13" height="4.4" rx="2.2" {...(i === 0 ? { fill: accent } : f(0.3))} />
              <rect x={x + 5} y="40" width="20" height="2.6" rx="1.3" {...f(0.16)} />
            </g>
          ))}
          <rect x="44" y="55" width="112" height="54" rx="5" {...f(0.07)} />
          {[
            [52, 18],
            [68, 27],
            [84, 22],
            [100, 34],
            [116, 29],
            [132, 42],
          ].map(([x, h], i) => (
            <rect key={x} x={x} y={102 - h} width="10" height={h} rx="2" {...(i === 5 ? { fill: accent } : f(0.22))} />
          ))}
        </Window>
      );
    case "ecommerce":
      // A storefront: search, a grid of products, one in the basket.
      return (
        <Window ink={ink}>
          <rect x="9" y="25" width="86" height="9" rx="4.5" {...f(0.1)} />
          <rect x="14" y="28.5" width="30" height="3" rx="1.5" {...f(0.2)} />
          <rect x="120" y="25" width="36" height="9" rx="4.5" fill={accent} />
          {[
            [9, 40],
            [60, 40],
            [111, 40],
            [9, 78],
            [60, 78],
            [111, 78],
          ].map(([x, y], i) => (
            <g key={`${x}-${y}`}>
              <rect x={x} y={y} width="45" height="24" rx="4" {...f(i === 1 ? 0.2 : 0.11)} />
              <rect x={x + 3} y={y + 27} width="22" height="2.8" rx="1.4" {...f(0.22)} />
              <rect x={x + 31} y={y + 27} width="12" height="2.8" rx="1.4" {...(i === 1 ? { fill: accent } : f(0.14))} />
            </g>
          ))}
        </Window>
      );
    case "devops":
      // A pipeline run, green up to the stage it is on.
      return (
        <Window ink={ink}>
          <path d="M28 40h104" {...s(0.2)} />
          {[0, 1, 2, 3].map((i) => {
            const x = 14 + i * 36;
            const done = i < 3;
            return (
              <g key={i}>
                <rect x={x} y="30" width="28" height="20" rx="5" {...(done ? { fill: accent, fillOpacity: 0.92 } : f(0.14))} />
                {done ? (
                  <path d={`M${x + 9} 40l3.4 3.4L${x + 20} 35`} stroke={on} strokeWidth="1.8" fill="none" />
                ) : (
                  <circle cx={x + 14} cy="40" r="3.4" {...f(0.32)} />
                )}
              </g>
            );
          })}
          <rect x="9" y="60" width="147" height="49" rx="5" {...f(0.07)} />
          {[66, 74, 82, 90, 98].map((y, i) => (
            <g key={y}>
              <rect x="14" y={y} width="10" height="2.6" rx="1.3" {...f(0.26)} />
              <rect x="28" y={y} width={[86, 62, 104, 48, 74][i]} height="2.6" rx="1.3" {...(i === 2 ? { fill: accent, fillOpacity: 0.8 } : f(0.14))} />
            </g>
          ))}
        </Window>
      );
    case "aiml":
      // A model's output, with the band it is confident inside.
      return (
        <Window ink={ink}>
          <rect x="9" y="25" width="30" height="4" rx="2" {...f(0.26)} />
          <rect x="120" y="25" width="10" height="4" rx="2" {...f(0.24)} />
          <rect x="136" y="25" width="10" height="4" rx="2" {...f(0.16)} />
          <path d="M14 104h136M14 104V36" {...s(0.18)} />
          <path d="M20 92c16 0 22-20 38-26s28 14 44 6 22-24 34-28v60H20z" fill={accent} fillOpacity="0.16" />
          <path d="M20 92c16 0 22-20 38-26s28 14 44 6 22-24 34-28" stroke={accent} strokeWidth="2" fill="none" />
          <circle cx="102" cy="72" r="4" fill={accent} />
          <circle cx="102" cy="72" r="8.5" fill={accent} fillOpacity="0.22" />
        </Window>
      );
    case "consulting":
      // An assessment, and the decision it ends in.
      return (
        <Window ink={ink}>
          <rect x="9" y="25" width="88" height="84" rx="5" {...f(0.07)} />
          <rect x="15" y="32" width="44" height="4" rx="2" {...f(0.26)} />
          {[46, 57, 68, 79, 90].map((y, i) => (
            <g key={y}>
              <circle cx="19" cy={y + 1.4} r="3" {...(i < 3 ? { fill: accent } : f(0.18))} />
              <rect x="26" y={y} width={[60, 48, 64, 42, 54][i]} height="2.8" rx="1.4" {...f(0.16)} />
            </g>
          ))}
          <rect x="103" y="25" width="53" height="84" rx="5" {...f(0.1)} />
          <rect x="109" y="32" width="28" height="3.4" rx="1.7" {...f(0.24)} />
          <rect x="109" y="42" width="41" height="22" rx="4" fill={accent} fillOpacity="0.9" />
          <rect x="109" y="72" width="41" height="2.8" rx="1.4" {...f(0.16)} />
          <rect x="109" y="80" width="30" height="2.8" rx="1.4" {...f(0.16)} />
        </Window>
      );
    case "mobile":
      // The product is a handset, so the screenshot is of a handset.
      return (
        <Phone ink={ink}>
          <rect x="53" y="16" width="54" height="16" rx="4" {...f(0.12)} />
          <rect x="57" y="22" width="22" height="3.4" rx="1.7" {...f(0.3)} />
          <circle cx="101" cy="24" r="4" fill={accent} />
          {[38, 58, 78].map((y, i) => (
            <g key={y}>
              <rect x="53" y={y} width="54" height="16" rx="4" {...f(i === 0 ? 0.18 : 0.1)} />
              <circle cx="61" cy={y + 8} r="4" {...(i === 0 ? { fill: accent } : f(0.24))} />
              <rect x="69" y={y + 4} width="26" height="2.8" rx="1.4" {...f(0.24)} />
              <rect x="69" y={y + 10} width="18" height="2.4" rx="1.2" {...f(0.14)} />
            </g>
          ))}
          <rect x="53" y="99" width="54" height="14" rx="5" {...f(0.12)} />
          {[62, 80, 98].map((cx, i) => (
            <circle key={cx} cx={cx} cy="106" r="2.8" {...(i === 0 ? { fill: accent } : f(0.24))} />
          ))}
        </Phone>
      );
    case "security":
      // A posture console: what is protected, and what has been checked.
      return (
        <Window ink={ink}>
          <path
            d="M40 28l22 7.6v15.2C62 62.6 52.6 71 40 76c-12.6-5-22-13.4-22-25.2V35.6z"
            fill={accent}
            fillOpacity="0.18"
            stroke={accent}
            strokeWidth="1.6"
          />
          <rect x="32" y="46" width="16" height="12" rx="2.6" fill={accent} />
          <path d="M36 46v-3.2a4 4 0 018 0V46" stroke={accent} strokeWidth="2" fill="none" />
          {[30, 45, 60, 75].map((y, i) => (
            <g key={y}>
              <rect x="74" y={y} width="82" height="11" rx="3" {...f(0.08)} />
              <circle cx="82" cy={y + 5.5} r="3" {...(i < 3 ? { fill: accent } : f(0.2))} />
              <rect x="90" y={y + 4} width={[48, 36, 54, 30][i]} height="2.8" rx="1.4" {...f(0.18)} />
            </g>
          ))}
          <rect x="18" y="86" width="138" height="23" rx="4" {...f(0.06)} />
          <rect x="24" y="95" width="40" height="3" rx="1.5" {...f(0.2)} />
        </Window>
      );
    case "custom":
      // An editor, and the line that only exists for you.
      return (
        <Window ink={ink}>
          <rect x="9" y="25" width="16" height="84" rx="4" {...f(0.09)} />
          {[32, 41, 50, 59, 68, 77, 86, 95].map((y) => (
            <rect key={y} x="14" y={y} width="6" height="2.4" rx="1.2" {...f(0.18)} />
          ))}
          {[
            [30, 74],
            [38, 52],
            [38, 88],
            [46, 66],
            [30, 44],
            [38, 96],
            [46, 58],
            [30, 70],
          ].map(([x, w], i) => (
            <rect
              key={i}
              x={x}
              y={32 + i * 9}
              width={w}
              height="3"
              rx="1.5"
              {...(i === 3 ? { fill: accent } : f(i % 3 === 0 ? 0.24 : 0.13))}
            />
          ))}
          <rect x="132" y="30" width="20" height="74" rx="3" {...f(0.05)} />
          {[34, 40, 46, 52, 58, 64].map((y, i) => (
            <rect key={y} x="135" y={y} width={[12, 8, 14, 6, 11, 9][i]} height="2" rx="1" {...f(0.12)} />
          ))}
        </Window>
      );
    case "webapps":
      // A portal, behind a sign-in.
      return (
        <Window ink={ink}>
          <rect x="34" y="9.5" width="72" height="7" rx="3.5" {...f(0.12)} />
          <rect x="9" y="25" width="26" height="84" rx="4" {...f(0.09)} />
          <rect x="13" y="31" width="18" height="3.2" rx="1.6" fill={accent} />
          {[39, 46, 53, 60].map((y) => (
            <rect key={y} x="13" y={y} width="14" height="2.8" rx="1.4" {...f(0.16)} />
          ))}
          <rect x="40" y="25" width="56" height="34" rx="4" {...f(0.14)} />
          <rect x="101" y="25" width="55" height="34" rx="4" {...f(0.09)} />
          <rect x="40" y="64" width="116" height="45" rx="4" {...f(0.07)} />
          {[71, 82, 93].map((y, i) => (
            <g key={y}>
              <rect x="46" y={y} width={[60, 44, 70][i]} height="2.8" rx="1.4" {...f(0.18)} />
              <rect x="134" y={y} width="16" height="2.8" rx="1.4" {...(i === 0 ? { fill: accent } : f(0.12))} />
            </g>
          ))}
        </Window>
      );
    case "erp":
      // A dashboard: counters across the top, the ledger underneath.
      return (
        <Window ink={ink}>
          <rect x="9" y="25" width="24" height="84" rx="4" {...f(0.09)} />
          {[31, 39, 47, 55, 63].map((y, i) => (
            <rect key={y} x="13" y={y} width="16" height="3" rx="1.5" {...(i === 1 ? { fill: accent } : f(0.16))} />
          ))}
          {[38, 79, 120].map((x, i) => (
            <g key={x}>
              <rect x={x} y="25" width="36" height="23" rx="4" {...f(i === 2 ? 0.17 : 0.1)} />
              <rect x={x + 5} y="30" width="13" height="4.4" rx="2.2" {...(i === 2 ? { fill: accent } : f(0.3))} />
              <rect x={x + 5} y="39.5" width="24" height="2.6" rx="1.3" {...f(0.15)} />
            </g>
          ))}
          <rect x="38" y="53" width="118" height="12" rx="3" {...f(0.13)} />
          {[44, 88, 132].map((x) => (
            <rect key={x} x={x} y="57.5" width="20" height="3" rx="1.5" {...f(0.26)} />
          ))}
          {[69, 80, 91, 102].map((y, i) => (
            <g key={y}>
              <rect x="38" y={y} width="118" height="9" rx="2.5" {...f(0.05)} />
              <rect x="44" y={y + 3} width="26" height="2.6" rx="1.3" {...f(0.17)} />
              <rect x="88" y={y + 3} width="18" height="2.6" rx="1.3" {...f(0.12)} />
              <rect x="132" y={y + 3} width="18" height="2.6" rx="1.3" {...(i === 1 ? { fill: accent } : f(0.12))} />
            </g>
          ))}
        </Window>
      );
    case "crm":
      // A board shaped like your pipeline, not a template's.
      return (
        <Window ink={ink}>
          {[9, 60, 111].map((x, col) => (
            <g key={x}>
              <rect x={x} y="25" width="46" height="4" rx="2" {...f(col === 1 ? 0.3 : 0.2)} />
              {[34, 61, 88].map((y, row) => {
                const live = col === 1 && row === 0;
                return (
                  <g key={y}>
                    <rect x={x} y={y} width="46" height="22" rx="4" {...(live ? { fill: accent, fillOpacity: 0.92 } : f(0.1))} />
                    <circle cx={x + 8} cy={y + 8} r="3.4" {...(live ? { fill: on, fillOpacity: 0.4 } : f(0.22))} />
                    <rect x={x + 15} y={y + 6} width="24" height="2.6" rx="1.3" {...(live ? { fill: on, fillOpacity: 0.5 } : f(0.2))} />
                    <rect x={x + 6} y={y + 15} width="18" height="2.4" rx="1.2" {...(live ? { fill: on, fillOpacity: 0.3 } : f(0.12))} />
                  </g>
                );
              })}
            </g>
          ))}
        </Window>
      );
    case "enterprise":
      // The shape of the business, drawn once and agreed.
      return (
        <Window ink={ink}>
          <rect x="60" y="27" width="44" height="17" rx="4" fill={accent} fillOpacity="0.92" />
          <rect x="68" y="33" width="28" height="4" rx="2" fill={on} fillOpacity="0.45" />
          <path d="M82 44v12M26 56h112M26 56v10M82 56v10M138 56v10" {...s(0.22)} />
          {[12, 68, 124].map((x) => (
            <g key={x}>
              <rect x={x} y="66" width="32" height="18" rx="4" {...f(0.13)} />
              <rect x={x + 6} y="72" width="18" height="3" rx="1.5" {...f(0.24)} />
              <path d={`M${x + 16} 84v8`} {...s(0.18)} />
              <rect x={x + 4} y="92" width="24" height="12" rx="3" {...f(0.07)} />
            </g>
          ))}
        </Window>
      );
    case "api":
      // Reference another team can build against without reading your code.
      return (
        <Window ink={ink}>
          {[27, 43, 59, 75, 91].map((y, i) => (
            <g key={y}>
              <rect x="9" y={y} width="26" height="12" rx="3" {...(i === 0 ? { fill: accent } : f(0.16))} />
              <rect x="40" y={y + 4.5} width={[62, 50, 74, 44, 56][i]} height="3" rx="1.5" {...f(0.2)} />
              <rect x="120" y={y + 4.5} width="36" height="3" rx="1.5" {...f(0.09)} />
            </g>
          ))}
        </Window>
      );
    case "microservices":
      // Services split where the business already splits, and their health.
      return (
        <Window ink={ink}>
          <path d="M40 46h80M40 46v40M120 46v40M40 86h80M58 66h44" {...s(0.2)} />
          {[
            [22, 34, 0],
            [104, 34, 1],
            [22, 74, 0],
            [104, 74, 0],
          ].map(([x, y, live], i) => (
            <g key={i}>
              <rect x={x} y={y} width="36" height="24" rx="5" {...(live ? { fill: accent, fillOpacity: 0.92 } : f(0.14))} />
              <rect x={x + 6} y={y + 7} width="18" height="3" rx="1.5" {...(live ? { fill: on, fillOpacity: 0.5 } : f(0.26))} />
              <circle cx={x + 28} cy={y + 16} r="2.6" {...(live ? { fill: on, fillOpacity: 0.45 } : { fill: accent })} />
            </g>
          ))}
        </Window>
      );
    default:
      // A builder: the trigger, the branch, and the step nobody does by hand.
      return (
        <Window ink={ink}>
          <rect x="9" y="52" width="34" height="20" rx="5" fill={accent} fillOpacity="0.92" />
          <rect x="15" y="59" width="20" height="3.4" rx="1.7" fill={on} fillOpacity="0.5" />
          <path d="M43 62h18M61 62V38h14M61 62v24h14" {...s(0.24)} />
          {[28, 76].map((y, i) => (
            <g key={y}>
              <rect x="75" y={y} width="34" height="20" rx="5" {...f(0.13)} />
              <rect x="81" y={y + 7} width="18" height="3.4" rx="1.7" {...f(0.24)} />
              <path d={`M109 ${y + 10}h14`} {...s(0.22)} />
              <rect x="123" y={y} width="30" height="20" rx="5" {...f(i === 0 ? 0.09 : 0.06)} />
            </g>
          ))}
        </Window>
      );
  }
}

/* ------------------------------------------------------------------- rail */

/**
 * One card on the rail.
 *
 * `clone` is the copies behind the first: the rail has to be twice as long as
 * its contents to loop, and duplicating a list of links would put every service
 * into the tab order twice and read it out twice. The clones are inert.
 */
function RailCard({ card, index, clone }: { card: Card; index: number; clone?: boolean }) {
  const scheme = SCHEMES[index % SCHEMES.length];

  const body = (
    <>
      <span
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(72% 46% at 50% 88%, color-mix(in srgb, ${scheme.accent} ${scheme.glow}%, transparent), transparent 74%)`,
        }}
        className="pointer-events-none absolute inset-0"
      />

      <span
        aria-hidden
        style={{ color: scheme.accent }}
        className="relative font-mono text-[10px] uppercase leading-none tracking-[1px]"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <h3
        style={{ color: scheme.title }}
        className="relative mt-[14px] font-display text-[clamp(1.45rem,1.9vw,29px)] font-semibold leading-[1.04] tracking-[-0.03em]"
      >
        {card.title}
      </h3>

      <p
        style={{ color: scheme.muted }}
        className="relative mt-[10px] line-clamp-3 font-body text-[12.5px] leading-[17px] tracking-[-0.1px]"
      >
        {card.line}
      </p>

      {/* The screen fills the foot of the card and runs past both sides, which
          is what the card is clipped for. No height on it: an svg with a
          viewBox and a definite width takes its height from the ratio, so the
          artwork keeps its proportions whatever the card is doing. */}
      <svg
        viewBox="0 0 160 120"
        aria-hidden
        className="related-art pointer-events-none absolute bottom-[-18px] left-[-30px] right-[-30px] transition-transform duration-500 group-hover:scale-[1.03]"
      >
        <Art id={card.art} ink={scheme.ink} accent={scheme.accent} />
      </svg>
    </>
  );

  const shell = `related-card group relative shrink-0 overflow-hidden rounded-[26px] border p-[22px] lg:p-[26px] ${CARD} ${CARD_GAP}`;
  const style = { backgroundImage: scheme.ground, borderColor: scheme.edge };

  if (clone) {
    return (
      <div aria-hidden style={style} className={shell}>
        {body}
      </div>
    );
  }

  return card.href ? (
    <Link href={card.href} style={style} className={shell}>
      {body}
    </Link>
  ) : (
    <div style={style} className={shell}>
      {body}
    </div>
  );
}

export default function RelatedServices({ currentSlug }: { currentSlug: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  /** Set while the cursor or the keyboard is inside the rail. */
  const held = useRef(false);

  /**
   * Reduced motion drops the duplicate copy along with the drift: nothing is
   * looping, so there is nothing for the second copy to cover.
   */
  const [still, setStill] = useState(false);

  const services = SERVICES.filter((service) => service.slug !== currentSlug).map((service) => ({
    key: service.slug,
    title: service.shortTitle,
    line: service.included[0],
    art: SERVICE_ART[service.slug] ?? "custom",
    href: `/services/${service.slug}`,
  }));

  // On a detail page this is the sibling row. On /services it is the whole
  // offering, so the work that has no page of its own is on the rail too.
  const domains: Card[] = currentSlug
    ? []
    : WORK_DOMAINS.filter((domain) => !domain.service && DOMAIN_ART[domain.name]).map((domain) => ({
        key: domain.name,
        title: domain.name,
        line: domain.copy,
        art: DOMAIN_ART[domain.name],
        href: null,
      }));

  const cards: Card[] = [...services, ...domains];

  useGSAP(
    () => {
      gsap.from(".related-head", {
        y: 22,
        opacity: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: reveal(sectionRef.current, { start: "top 86%" }),
      });

      gsap.from(".related-rail", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: reveal(sectionRef.current, { start: "top 88%" }),
      });

      gsap.utils.toArray<HTMLElement>(".related-art").forEach((art, index) => {
        gsap.to(art, {
          y: -5,
          duration: 2.9 + (index % 5) * 0.2,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: (index % 7) * 0.16,
        });
      });

      const rail = railRef.current;
      if (!rail || prefersReducedMotion()) {
        setStill(true);
        return;
      }

      /**
       * The rail moves by scrolling itself, not by transforming the row inside
       * it.
       *
       * Two reasons. A transformed row of fifteen cards twice over is a single
       * 9,420px composited layer, where a scroller paints only what is on
       * screen. And a scroller is something a visitor can push along — which,
       * paired with the hold below, means hovering the rail stops it and hands
       * it over rather than just freezing it out of reach.
       *
       * One copy's width is measured from the cards themselves — the distance
       * from the first card to its own duplicate — rather than divided out of
       * the row. The row carries a left indent so the rail starts on the page
       * margin, and dividing that in would leave half of it in every lap.
       */
      const measure = () => {
        const drawn = rail.querySelectorAll<HTMLElement>(".related-card");
        const twin = drawn[cards.length];
        return twin ? twin.offsetLeft - drawn[0].offsetLeft : 0;
      };

      let copy = measure();
      const remeasure = () => {
        copy = measure();
      };
      window.addEventListener("resize", remeasure);

      let last = gsap.ticker.time;
      const drift = () => {
        const elapsed = gsap.ticker.time - last;
        last = gsap.ticker.time;
        // Held still while somebody is reading it — and while it is held, the
        // scroll position is theirs to move, which is why this reads it back
        // rather than keeping its own.
        if (held.current || copy <= 0) return;
        rail.scrollLeft = (rail.scrollLeft + RAIL_SPEED * elapsed) % copy;
      };
      gsap.ticker.add(drift);

      return () => {
        gsap.ticker.remove(drift);
        window.removeEventListener("resize", remeasure);
      };
    },
    { scope: sectionRef, dependencies: [cards.length] },
  );

  // A rail that never stops is a rail you cannot read or click. Hovering it, or
  // tabbing into it, holds it where it is — and leaves it scrollable by hand.
  const hold = () => {
    held.current = true;
  };
  const release = () => {
    held.current = false;
  };

  const copies = still ? 1 : railCopies(cards.length);

  return (
    <section ref={sectionRef} className="w-full overflow-hidden bg-bg pb-[80px] lg:pb-[120px]">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[40px]">
        <div className="related-head flex w-full flex-wrap items-end justify-between gap-[14px]">
          <h2 className="font-display text-[clamp(1.75rem,3vw,38px)] font-semibold leading-[1.15] tracking-[-0.8px] text-black">
            {currentSlug ? "Other Services" : "All Services"}
          </h2>
          <p className="font-mono text-[11px] uppercase leading-none tracking-[0.8px] text-neutral-paragraph">
            {String(cards.length).padStart(2, "0")}
            {currentSlug ? " more" : " kinds of work"}
          </p>
        </div>
      </div>

      {/* Full bleed, faded to nothing at both ends so the rail reads as part of
          something longer rather than a strip that stops at the page margin,
          and a real scroller with its bar hidden: the drift is a scroll, and
          while it is held a visitor can push it along themselves. */}
      <div
        ref={railRef}
        onMouseEnter={hold}
        onMouseLeave={release}
        onFocusCapture={hold}
        onBlurCapture={release}
        className="related-rail mt-[22px] w-full overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)] [scrollbar-width:none] lg:mt-[32px] [&::-webkit-scrollbar]:hidden"
      >
        <div className="related-rail-track flex w-max pl-6 lg:pl-[40px]">
          {Array.from({ length: copies }, (_, copy) =>
            cards.map((card, index) => (
              <RailCard key={`${copy}-${card.key}`} card={card} index={index} clone={copy > 0} />
            )),
          )}
        </div>
      </div>
    </section>
  );
}
