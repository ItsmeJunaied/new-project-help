"use client";

import { useRef, useSyncExternalStore } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/anim";

/**
 * The desk, live, next to the form.
 *
 * The column beside the form was a list of promises, and a promise printed on
 * a page is the cheapest thing on the internet — everybody's contact page says
 * they reply fast. This says it differently: it shows the clock on the desk
 * the brief is about to land on, running, and states whether anyone is sitting
 * at it right now.
 *
 * That is a harder claim to make and a much easier one to believe, and it is
 * the one piece of this page that could not be screenshotted from somebody
 * else's site, because it is only true while you are looking at it.
 *
 * Everything here is computed in the browser from the visitor's own clock
 * against a fixed zone. Nothing is fetched, and nothing is stored.
 */

/** Asia/Dhaka is UTC+6 all year — Bangladesh has no daylight saving. */
const ZONE = "Asia/Dhaka";

/**
 * The working week, in Dhaka local hours.
 *
 * ASSUMPTION, and the one thing in this component worth checking: Sunday to
 * Thursday, ten to seven, which is the ordinary Bangladeshi office week. If
 * the real hours differ, this is the only place to change them — the label,
 * the rail and the "back at" countdown all read from here.
 */
const OPEN_HOUR = 10;
const CLOSE_HOUR = 19;
/** 0 = Sunday. Friday and Saturday are the weekend. */
const WORK_DAYS = [0, 1, 2, 3, 4];

/** The steps a brief goes through, against the clock, on a loop. */
const LOG = [
  { at: "00:00", line: "brief received" },
  { at: "00:04", line: "engineer assigned" },
  { at: "04:00", line: "written reply sent" },
];

type Now = {
  hour: number;
  minute: number;
  second: number;
  day: number;
  clock: string;
  date: string;
};

/**
 * The visitor's instant, read in Dhaka. `formatToParts` rather than arithmetic
 * on a UTC offset: the offset is fixed today, but asking Intl for the parts is
 * correct whatever the zone does later, and it is the same call that formats
 * the string.
 */
function readDhaka(): Now {
  const date = new Date();

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: ZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    weekday: "short",
    day: "numeric",
    month: "short",
  }).formatToParts(date);

  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";

  const hour = Number(get("hour"));
  const minute = Number(get("minute"));
  const second = Number(get("second"));

  // formatToParts gives the weekday as a name, and the arithmetic below wants
  // an index, so the name is mapped rather than parsed back out of a Date.
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = Math.max(0, days.indexOf(get("weekday")));

  return {
    hour,
    minute,
    second,
    day,
    clock: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:${String(
      second,
    ).padStart(2, "0")}`,
    date: `${get("weekday")} ${get("day")} ${get("month")}`,
  };
}

/** Hours until the next working day opens, for the closed state's countdown. */
function hoursUntilOpen(now: Now) {
  let days = 0;
  let probe = now.day;

  // Today still counts if the desk has not opened yet.
  if (WORK_DAYS.includes(probe) && now.hour < OPEN_HOUR) {
    const mins = (OPEN_HOUR - now.hour) * 60 - now.minute;
    return { hours: Math.floor(mins / 60), minutes: mins % 60 };
  }

  // Otherwise walk forward to the next one that is.
  do {
    days += 1;
    probe = (probe + 1) % 7;
  } while (!WORK_DAYS.includes(probe) && days < 8);

  const mins = days * 24 * 60 + OPEN_HOUR * 60 - (now.hour * 60 + now.minute);
  return { hours: Math.floor(mins / 60), minutes: mins % 60 };
}

/** One second, as a primitive. The snapshot has to be comparable by identity,
 *  so it cannot be the Now object — a fresh one every call would re-render for
 *  ever. The object is derived during render from this instead. */
function subscribeToSeconds(onTick: () => void) {
  const id = window.setInterval(onTick, 1000);
  return () => window.clearInterval(id);
}

const currentSecond = () => Math.floor(Date.now() / 1000);
/** The server has no idea what time it is where the visitor is, so it renders
 *  the resting state and the card comes alive on the client. Returning null
 *  here is also what keeps hydration from mismatching on the clock. */
const noSecondOnTheServer = () => null;

export default function BriefStatus() {
  const cardRef = useRef<HTMLDivElement>(null);

  const tick = useSyncExternalStore(
    subscribeToSeconds,
    currentSecond,
    noSecondOnTheServer,
  );

  const now: Now | null = tick === null ? null : readDhaka();

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // The log replays on a loop, so the card is never quite still — which is
      // the whole point of putting a live thing next to a static form.
      const timeline = gsap.timeline({ repeat: -1, repeatDelay: 2.4 });

      timeline.fromTo(
        ".bs-log-row",
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: 0.45, ease: "power2.out", stagger: 0.55 },
      );
      timeline.to(".bs-log-row", { opacity: 0.35, duration: 0.5, delay: 0.8 });

      return () => timeline.kill();
    },
    { scope: cardRef },
  );

  const open = now !== null && WORK_DAYS.includes(now.day) && now.hour >= OPEN_HOUR && now.hour < CLOSE_HOUR;

  // Where "now" sits across the working day, for the rail. Clamped, so an
  // evening visitor gets a marker parked at the end rather than off the card.
  const through = now
    ? Math.min(1, Math.max(0, (now.hour + now.minute / 60 - OPEN_HOUR) / (CLOSE_HOUR - OPEN_HOUR)))
    : 0;

  const until = now && !open ? hoursUntilOpen(now) : null;

  return (
    <div
      ref={cardRef}
      className="contact-aside relative isolate flex w-full flex-col gap-[22px] overflow-hidden rounded-[22px] bg-[#111] p-[26px] shadow-[0_30px_70px_-40px_rgba(0,0,0,0.9)]"
    >
      {/* A green wash off the top corner, so the card has some depth under the
          type rather than being a flat black rectangle. */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-[60px] -top-[70px] -z-10 size-[220px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-primary-green)_38%,transparent),transparent_70%)] blur-[26px]"
      />

      <div className="flex w-full items-center justify-between gap-[12px]">
        <span className="flex items-center gap-[9px]">
          <span className="relative flex size-[9px] shrink-0">
            {/* The ping only runs while somebody is actually there. */}
            {open ? (
              <span
                aria-hidden
                className="absolute inset-0 animate-ping rounded-full bg-primary-green opacity-70"
              />
            ) : null}
            <span
              className={`relative size-[9px] rounded-full ${
                open ? "bg-primary-green" : "bg-[#f0a33c]"
              }`}
            />
          </span>

          <span className="font-mono text-[11px] uppercase leading-none tracking-[0.16em] text-white">
            {now === null ? "Checking the desk" : open ? "At the desk now" : "Desk is closed"}
          </span>
        </span>

        <span className="font-mono text-[10px] uppercase leading-none tracking-[0.16em] text-white/35">
          Dhaka
        </span>
      </div>

      {/* The clock. Tabular figures, or every ticking second nudges the line. */}
      <div className="flex w-full flex-col gap-[6px]">
        <p
          className="font-display text-[clamp(2.75rem,7vw,56px)] font-medium leading-none tracking-[-2px] text-white [font-variant-numeric:tabular-nums]"
          // The seconds change once a second and nothing else in here does;
          // announcing that to a screen reader would be unusable.
          aria-hidden={now === null ? undefined : true}
        >
          {now?.clock ?? "--:--:--"}
        </p>
        <p className="font-mono text-[11px] uppercase leading-none tracking-[0.16em] text-white/40">
          {now?.date ?? "Local time"} · {open ? "open until 19:00" : `${OPEN_HOUR}:00–${CLOSE_HOUR}:00, Sun–Thu`}
        </p>
      </div>

      {/* The working day as a rail, with a marker where the clock has got to.
          On a closed desk it reads as the shape of the day you are waiting
          for rather than as a progress bar that has stalled. */}
      <div className="flex w-full flex-col gap-[9px]">
        <div className="relative h-[3px] w-full rounded-full bg-white/10">
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-primary-green transition-[width] duration-1000 ease-linear"
            style={{ width: `${(open ? through : 0) * 100}%` }}
          />
          {open ? (
            <span
              className="absolute top-1/2 size-[9px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_3px_rgba(17,17,17,1)] transition-[left] duration-1000 ease-linear"
              style={{ left: `${through * 100}%` }}
            />
          ) : null}
        </div>

        <p className="font-body text-[13px] leading-[19px] tracking-[-0.1px] text-white/55">
          {now === null ? (
            "Reading the clock in Dhaka…"
          ) : open ? (
            <>
              Send it now and it is read today.{" "}
              <span className="text-white">A written reply inside four business hours.</span>
            </>
          ) : (
            <>
              Send it anyway — it will be waiting at the top of the pile.{" "}
              <span className="text-white">
                Someone is back in {until?.hours}h {until?.minutes}m.
              </span>
            </>
          )}
        </p>
      </div>

      {/* What happens to it, against the same clock. */}
      <ol className="flex w-full flex-col gap-[9px] border-t border-white/10 pt-[18px]">
        {LOG.map((entry) => (
          <li
            key={entry.at}
            className="bs-log-row flex w-full items-center gap-[10px] font-mono text-[11px] leading-none tracking-[0.06em]"
          >
            <span className="text-primary-green">+{entry.at}</span>
            <span className="h-px flex-1 bg-white/10" aria-hidden />
            <span className="uppercase tracking-[0.14em] text-white/70">{entry.line}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
