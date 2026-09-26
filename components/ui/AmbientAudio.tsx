"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { prefersReducedMotion } from "@/lib/anim";
import { isHushed, onHushChange } from "@/lib/hush";

/**
 * The soft background tune, with a waveform, a play/pause control and a volume
 * slider.
 *
 * The track plays through an <audio> element routed into a Web Audio graph, so
 * the waveform reads the real signal off an AnalyserNode rather than animating
 * a decorative loop, and the fades are sample-accurate rather than CSS.
 *
 * The element is only constructed on the first attempt to play, and carries no
 * preload, so a visitor who never starts it never downloads the audio.
 *
 * Browsers block audio until the visitor has interacted with the page, so
 * "default on" cannot mean "plays on arrival". The stored preference defaults
 * to on, and playback starts on the first click, key press or touch. The button
 * always shows what is actually happening, never the intent.
 *
 * It also only sounds while the page is actually being used: a hidden tab, or a
 * stretch with no pointer, key or scroll, silences it, and coming back picks it
 * up again. See IDLE_MS.
 */

const STORAGE_KEY = "ph:ambient-audio";
const VOLUME_KEY = "ph:ambient-volume";

/**
 * The files are normalised to about -28 LUFS, so 1 would play them exactly as
 * encoded. This is only the starting point — the slider owns the level from the
 * first time it is touched.
 */
const DEFAULT_VOLUME = 0.75;

/**
 * How loud the slider's own scale is. The slider reports 0–1; this is what that
 * 1 is worth on the bus.
 *
 * It sits here rather than in DEFAULT_VOLUME because a returning visitor
 * already has a level in localStorage, and raising a default would never reach
 * them — every stored preference would stay exactly as quiet as it was. Lifting
 * the scale moves everyone by the same amount and keeps what they chose.
 *
 * 1.3 is about +2.3 dB. The source peaks near 0.37 (-8.6 dBFS), so the trimmed
 * bus peaks near 0.48 — still well short of clipping.
 */
const BUS_TRIM = 1.3;
const busGain = (level: number) => level * BUS_TRIM;

const FADE_SECONDS = 1.4;

/**
 * Silence the tune after this long with no pointer, key, wheel or scroll. The
 * preference is deliberately not touched, so the next movement brings it back:
 * this is about not playing to an empty chair, not about turning it off.
 *
 * A minute is long enough to read a screen of an article without the tune
 * dropping out underneath you.
 */
const IDLE_MS = 60_000;
/** Cheap guard so a pointermove does not rebuild the timer on every pixel. */
const IDLE_RESET_THROTTLE_MS = 1_000;

/**
 * The analyser taps the source *ahead* of the volume control, so the trace is
 * the same height whether the tune is at full or nearly muted — the waveform
 * shows what is playing, not how loud it is. This scales that raw signal, which
 * peaks around 0.37, to most of the canvas.
 */
const WAVEFORM_GAIN = 1.2;
/**
 * The trace is drawn from this many points rather than one per pixel: a
 * 1024-sample buffer at pixel resolution is visual noise. Each point is the
 * loudest sample in its window, so the line reads as the shape of the sound.
 */
const WAVE_POINTS = 34;
/** How far each point travels towards its new value per frame. Lower is calmer. */
const WAVE_EASE = 0.22;

/**
 * Opus in a WebM container for everything current, MP3 for older Safari. Opus
 * is 2.0MB against the MP3's 3.6MB, from a 9.7MB source.
 */
const SOURCES = [
  { src: "/audio/ambient.webm", type: 'audio/webm; codecs="opus"' },
  { src: "/audio/ambient.mp3", type: "audio/mpeg" },
];

type Engine = {
  ctx: AudioContext;
  el: HTMLAudioElement;
  master: GainNode;
  analyser: AnalyserNode;
};

function createEngine(): Engine {
  const Ctor: typeof AudioContext =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new Ctor();

  const el = new Audio();
  el.loop = true;
  el.preload = "auto";
  const playable = SOURCES.find((s) => el.canPlayType(s.type) !== "");
  el.src = (playable ?? SOURCES[SOURCES.length - 1]).src;

  const master = ctx.createGain();
  master.gain.value = 0;

  const analyser = ctx.createAnalyser();
  analyser.fftSize = 1024;

  // Once an element is routed through createMediaElementSource its audio only
  // reaches the speakers through this graph, so the gain node is the single
  // volume control and el.volume stays out of it.
  const source = ctx.createMediaElementSource(el);
  source.connect(master);
  master.connect(ctx.destination);

  // A second branch off the source, not a link in the output chain. An analyser
  // with nothing connected downstream still reads its input, and tapping here
  // rather than after the gain keeps the trace independent of the volume.
  source.connect(analyser);

  return { ctx, el, master, analyser };
}

function fade(engine: Engine, to: number, seconds: number) {
  const { ctx, master } = engine;
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(to, now + seconds);
}

/**
 * The stored level, behind the smallest possible store.
 *
 * The server has no localStorage, so this is the one value whose first client
 * render legitimately differs from the markup. useSyncExternalStore is how that
 * is declared: the server snapshot is the default, the client snapshot is what
 * is stored, and React re-renders past the mismatch instead of warning about
 * it. Reading it in an effect and calling setState would do the same job a
 * frame later and with a flash of the wrong value.
 */
const volumeListeners = new Set<() => void>();
let volumeSnapshot: number | null = null;

function readStoredVolume(): number {
  try {
    const raw = localStorage.getItem(VOLUME_KEY);
    if (raw === null) return DEFAULT_VOLUME;
    const value = Number.parseFloat(raw);
    if (!Number.isFinite(value)) return DEFAULT_VOLUME;
    return Math.min(1, Math.max(0, value));
  } catch {
    return DEFAULT_VOLUME;
  }
}

function subscribeVolume(listener: () => void) {
  volumeListeners.add(listener);
  return () => {
    volumeListeners.delete(listener);
  };
}

/** Cached, because getSnapshot has to return the same value until it changes. */
function getVolume(): number {
  if (volumeSnapshot === null) volumeSnapshot = readStoredVolume();
  return volumeSnapshot;
}

function getServerVolume(): number {
  return DEFAULT_VOLUME;
}

function writeVolume(next: number) {
  volumeSnapshot = next;
  try {
    localStorage.setItem(VOLUME_KEY, next.toFixed(2));
  } catch {
    /* Private mode or blocked storage — the session still works. */
  }
  volumeListeners.forEach((listener) => listener());
}

export default function AmbientAudio() {
  const engineRef = useRef<Engine | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);

  // Playback can only ever begin after a gesture, so "paused" is the correct
  // first paint on both the server and the client — no hydration guard needed.
  const [playing, setPlaying] = useState(false);

  const volume = useSyncExternalStore(subscribeVolume, getVolume, getServerVolume);

  const [sliderOpen, setSliderOpen] = useState(false);

  // What the visitor asked for, which is not the same as what is currently
  // sounding: hiding the tab or stepping away stops the audio without clearing
  // the intent, so coming back resumes rather than requiring another click.
  const wantsOnRef = useRef(false);

  // Eased trace, kept across renders so the line settles down to flat on pause
  // instead of snapping to it.
  const pointsRef = useRef<Float32Array>(new Float32Array(WAVE_POINTS));

  const start = useCallback(async () => {
    // Never start into a hidden tab — a backgrounded page that begins playing
    // is exactly the behaviour this component is meant to avoid.
    if (typeof document !== "undefined" && document.hidden) return false;
    // Something else on the page is making sound of its own — a showreel in its
    // lightbox. Guarding here rather than at each caller covers the idle
    // wake-up too, which would otherwise bring the tune back under the film on
    // the first mouse move.
    if (isHushed()) return false;
    if (!engineRef.current) {
      try {
        engineRef.current = createEngine();
      } catch {
        return false;
      }
    }
    const engine = engineRef.current;
    try {
      await engine.ctx.resume();
    } catch {
      /* resume() rejects when there has been no gesture yet. */
    }
    if (engine.ctx.state !== "running") return false;

    // play() rejects when the gesture requirement has not been met yet, which
    // is a normal state on first load rather than an error.
    try {
      await engine.el.play();
    } catch {
      return false;
    }

    fade(engine, busGain(getVolume()), FADE_SECONDS);
    setPlaying(true);
    return true;
  }, []);

  /**
   * `immediate` skips the fade. Leaving a page does not give us 600ms of
   * guaranteed main thread, so the visibility and pagehide paths cut straight
   * to silence rather than risk the tail outliving the page.
   */
  const stop = useCallback((immediate = false) => {
    const engine = engineRef.current;
    if (!engine) return;
    setPlaying(false);

    if (immediate) {
      engine.master.gain.cancelScheduledValues(engine.ctx.currentTime);
      engine.master.gain.value = 0;
      engine.el.pause();
      if (engine.ctx.state === "running") void engine.ctx.suspend();
      return;
    }

    fade(engine, 0, 0.5);
    // Pause after the fade, otherwise the tail is cut off with a click.
    window.setTimeout(() => {
      if (engineRef.current !== engine) return;
      engine.el.pause();
      if (engine.ctx.state === "running") void engine.ctx.suspend();
    }, 600);
  }, []);

  const toggle = useCallback(() => {
    const next = !playing;
    wantsOnRef.current = next;
    if (next) void start();
    else stop();
    try {
      localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
    } catch {
      /* Private mode or blocked storage — the session still works. */
    }
  }, [playing, start, stop]);

  const changeVolume = useCallback((next: number) => {
    const clamped = Math.min(1, Math.max(0, next));
    writeVolume(clamped);

    const engine = engineRef.current;
    if (engine && engine.ctx.state === "running" && !engine.el.paused) {
      // A short ramp rather than a jump: dragging the slider writes a value
      // every few milliseconds, and stepping the gain directly clicks.
      const now = engine.ctx.currentTime;
      engine.master.gain.cancelScheduledValues(now);
      engine.master.gain.setValueAtTime(engine.master.gain.value, now);
      engine.master.gain.linearRampToValueAtTime(busGain(clamped), now + 0.08);
    }
  }, []);

  // Restore the preference. Default is on, so a first-time visitor gets the
  // tune as soon as they interact with the page.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* ignored */
    }
    if (stored === "off") return;
    wantsOnRef.current = true;

    let cancelled = false;
    const events: Array<keyof WindowEventMap> = ["pointerdown", "keydown", "touchstart"];

    const onGesture = () => {
      if (cancelled) return;
      void start();
      events.forEach((e) => window.removeEventListener(e, onGesture));
    };

    // Deferred past the first paint: it cannot succeed before a gesture anyway,
    // and building an AudioContext during mount competes with the page drawing.
    const attempt = window.setTimeout(() => {
      void start().then((ok) => {
        if (cancelled || ok) return;
        events.forEach((e) => window.addEventListener(e, onGesture, { passive: true }));
      });
    }, 0);

    return () => {
      cancelled = true;
      window.clearTimeout(attempt);
      events.forEach((e) => window.removeEventListener(e, onGesture));
    };
  }, [start]);

  /**
   * Only sound while the page is being used.
   *
   * Going quiet after a minute of stillness is the difference between a tune
   * that accompanies a visit and one that plays to an empty room for an hour.
   * Any movement undoes it, and `idled` is what keeps that from reviving a tune
   * the visitor paused on purpose.
   */
  useEffect(() => {
    let timer: number | null = null;
    let lastReset = 0;
    let idled = false;

    const arm = () => {
      if (timer !== null) window.clearTimeout(timer);
      timer = window.setTimeout(() => {
        timer = null;
        const engine = engineRef.current;
        if (!wantsOnRef.current || !engine || engine.el.paused) return;
        idled = true;
        stop();
      }, IDLE_MS);
    };

    const onActivity = () => {
      if (idled) {
        idled = false;
        if (wantsOnRef.current && !document.hidden) void start();
      }
      const now = Date.now();
      if (now - lastReset < IDLE_RESET_THROTTLE_MS) return;
      lastReset = now;
      arm();
    };

    const events: Array<keyof WindowEventMap> = [
      "pointerdown",
      "pointermove",
      "keydown",
      "wheel",
      "touchstart",
      "scroll",
    ];
    events.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    arm();

    return () => {
      if (timer !== null) window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, onActivity));
    };
  }, [start, stop]);

  /**
   * A showreel lightbox holds a hush for as long as it is open, because a tune
   * playing under a film with its own soundtrack is just two things talking at
   * once.
   *
   * Like the idle pause, this leaves the stored preference alone: it records
   * what the visitor asked for, so closing the player hands the tune back
   * exactly as they left it — and does not start one for somebody who had it
   * switched off.
   */
  useEffect(
    () =>
      onHushChange((hushed) => {
        if (hushed) {
          if (engineRef.current) stop(true);
        } else if (wantsOnRef.current && !document.hidden) {
          void start();
        }
      }),
    [start, stop],
  );

  /**
   * Silence the tune whenever the page is not actually in front of the visitor.
   *
   * An AudioContext keeps running in a background tab — that is the whole point
   * of the audio thread — so without this the tune follows you to whatever you
   * switched to. `visibilitychange` covers another tab, another window and a
   * minimised browser. `pagehide` covers navigating away and closing the tab,
   * including the back/forward cache, where the page is frozen rather than
   * destroyed and React's unmount cleanup never runs.
   *
   * The stored preference is untouched by any of this: it records what the
   * visitor asked for, so returning to the tab picks the tune back up.
   */
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) {
        if (engineRef.current) stop(true);
      } else if (wantsOnRef.current) {
        void start();
      }
    };

    const onPageHide = () => {
      if (engineRef.current) stop(true);
    };

    // A bfcache restore fires pageshow, not visibilitychange, so it needs its
    // own way back.
    const onPageShow = () => {
      if (wantsOnRef.current && !document.hidden) void start();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [start, stop]);

  // Tear the graph down on unmount so a client navigation cannot leave a second
  // context running.
  useEffect(() => {
    return () => {
      const engine = engineRef.current;
      engineRef.current = null;
      if (!engine) return;
      engine.el.pause();
      // Dropping the src releases the buffered audio; closing the context alone
      // leaves the element holding it.
      engine.el.removeAttribute("src");
      engine.el.load();
      void engine.ctx.close();
    };
  }, []);

  // The waveform reads the source, so it is the real signal rather than a
  // decorative loop. It keeps running for a moment after a pause so the trace
  // eases down to the flat line instead of cutting to it.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssWidth = canvas.clientWidth || 88;
    const cssHeight = canvas.clientHeight || 28;
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    ctx2d.scale(dpr, dpr);

    // Canvas takes a colour string rather than a CSS value, so the brand token
    // is resolved once here instead of being copied into this file.
    const liveStroke =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-primary-green")
        .trim() || "currentColor";
    const restingStroke = "rgba(21,21,21,0.28)";

    const reduced = prefersReducedMotion();
    const points = pointsRef.current;
    const mid = cssHeight / 2;
    const span = mid - 1.5;
    const spacing = (cssWidth - 2) / (WAVE_POINTS - 1);
    const xAt = (i: number) => 1 + i * spacing;
    const yAt = (i: number) =>
      mid - Math.max(-1, Math.min(1, points[i] * WAVEFORM_GAIN)) * span;

    // Explicit buffer type: the default `Uint8Array` widens to ArrayBufferLike,
    // which getByteTimeDomainData will not take.
    let data: Uint8Array<ArrayBuffer> | null = null;

    const draw = () => {
      const engine = engineRef.current;
      const sounding = playing && !reduced && engine !== null;

      if (sounding && engine) {
        if (!data || data.length !== engine.analyser.fftSize) {
          data = new Uint8Array(engine.analyser.fftSize);
        }
        engine.analyser.getByteTimeDomainData(data);
      }

      let moving = false;
      for (let i = 0; i < WAVE_POINTS; i += 1) {
        let target = 0;
        if (sounding && data) {
          // The loudest sample in the window, sign kept: the average of a
          // waveform tends to zero and would draw a flat line however loud the
          // tune is.
          const from = Math.floor((i * data.length) / WAVE_POINTS);
          const to = Math.max(from + 1, Math.floor(((i + 1) * data.length) / WAVE_POINTS));
          let peak = 0;
          for (let j = from; j < to; j += 1) {
            const v = data[j] - 128;
            if (Math.abs(v) > Math.abs(peak)) peak = v;
          }
          target = peak / 128;
        }
        points[i] += (target - points[i]) * WAVE_EASE;
        if (Math.abs(points[i]) > 0.002) moving = true;
      }

      ctx2d.clearRect(0, 0, cssWidth, cssHeight);
      ctx2d.strokeStyle = sounding ? liveStroke : restingStroke;
      ctx2d.lineWidth = 1.8;
      ctx2d.lineJoin = "round";
      ctx2d.lineCap = "round";
      ctx2d.beginPath();
      ctx2d.moveTo(xAt(0), yAt(0));
      // Each point is a control handle and the curve passes through the
      // midpoints between them, which is what turns 34 samples into one
      // continuous line rather than a chain of corners.
      for (let i = 1; i < WAVE_POINTS - 1; i += 1) {
        ctx2d.quadraticCurveTo(
          xAt(i),
          yAt(i),
          (xAt(i) + xAt(i + 1)) / 2,
          (yAt(i) + yAt(i + 1)) / 2,
        );
      }
      ctx2d.lineTo(xAt(WAVE_POINTS - 1), yAt(WAVE_POINTS - 1));
      ctx2d.stroke();

      // Stop once the trace has settled, so a paused widget costs nothing.
      frameRef.current = sounding || moving ? window.requestAnimationFrame(draw) : null;
    };

    frameRef.current = window.requestAnimationFrame(draw);
    return () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [playing]);

  const percent = Math.round(volume * 100);

  return (
    <div className="pointer-events-none fixed bottom-[20px] left-[16px] z-40 sm:bottom-[28px] sm:left-[28px]">
      <div
        className="pointer-events-auto flex items-center gap-[10px] rounded-full border border-black/15 bg-bg/90 py-[8px] pl-[8px] pr-[14px] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.3)] backdrop-blur-sm"
        onMouseLeave={() => setSliderOpen(false)}
      >
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={playing ? "Pause ambient sound" : "Play ambient sound"}
          className="flex size-[40px] shrink-0 items-center justify-center rounded-full bg-primary-green text-white transition-transform duration-300 hover:scale-105 active:scale-95"
        >
          {playing ? (
            <svg width="13" height="14" viewBox="0 0 13 14" aria-hidden="true">
              <rect x="0.5" y="0" width="4" height="14" rx="1.2" fill="currentColor" />
              <rect x="8.5" y="0" width="4" height="14" rx="1.2" fill="currentColor" />
            </svg>
          ) : (
            <svg width="13" height="14" viewBox="0 0 13 14" aria-hidden="true">
              <path
                d="M1.2 1.05a.7.7 0 0 1 1.07-.59l9.57 5.95a.7.7 0 0 1 0 1.18l-9.57 5.95a.7.7 0 0 1-1.07-.6z"
                fill="currentColor"
              />
            </svg>
          )}
        </button>

        <canvas ref={canvasRef} aria-hidden="true" className="h-[28px] w-[88px]" />

        <button
          type="button"
          onClick={() => setSliderOpen((open) => !open)}
          aria-expanded={sliderOpen}
          aria-label={sliderOpen ? "Hide volume" : "Change volume"}
          className="flex size-[24px] shrink-0 items-center justify-center rounded-full text-black/55 transition-colors hover:text-black"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="none">
            <path
              d="M3.2 6.1h2.1L8.4 3.4a.5.5 0 0 1 .83.38v8.44a.5.5 0 0 1-.83.38L5.3 9.9H3.2a.7.7 0 0 1-.7-.7V6.8a.7.7 0 0 1 .7-.7z"
              fill="currentColor"
            />
            {volume > 0 ? (
              <path
                d="M11.3 5.9a3 3 0 0 1 0 4.2"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M11.4 6.3 14 9m0-2.7L11.4 9"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            )}
            {volume > 0.55 ? (
              <path
                d="M13.2 4.3a5.4 5.4 0 0 1 0 7.4"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
              />
            ) : null}
          </svg>
        </button>

        {/* Width rather than display, so the pill grows into the slider instead
            of the whole control jumping a step wider. */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            sliderOpen ? "ml-[2px] w-[80px] opacity-100" : "w-0 opacity-0"
          }`}
        >
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={percent}
            tabIndex={sliderOpen ? 0 : -1}
            onChange={(event) => changeVolume(Number(event.target.value) / 100)}
            aria-label="Ambient sound volume"
            style={{
              background: `linear-gradient(to right, var(--color-primary-green) ${percent}%, rgba(21,21,21,0.18) ${percent}%)`,
            }}
            className="h-[4px] w-[80px] cursor-pointer appearance-none rounded-full [&::-moz-range-thumb]:size-[13px] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary-green [&::-webkit-slider-thumb]:size-[13px] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-green"
          />
        </div>
      </div>
    </div>
  );
}
