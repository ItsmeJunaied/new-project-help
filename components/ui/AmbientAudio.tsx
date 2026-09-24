"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { prefersReducedMotion } from "@/lib/anim";

/**
 * The soft background tune, with a small waveform and a play/pause control.
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
 */

const STORAGE_KEY = "ph:ambient-audio";

/**
 * The files are normalised to about -28 LUFS, so the level lives in the audio
 * rather than in this constant — 1 means "as encoded". Re-encode to change how
 * loud the site is; this is here for the fades to ramp towards.
 */
const MASTER_LEVEL = 1;
const FADE_SECONDS = 1.4;

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
  analyser.smoothingTimeConstant = 0.85;

  // Once an element is routed through createMediaElementSource its audio only
  // reaches the speakers through this graph, so the gain node is the single
  // volume control and el.volume stays out of it.
  ctx.createMediaElementSource(el).connect(master);
  master.connect(analyser);
  analyser.connect(ctx.destination);

  return { ctx, el, master, analyser };
}

function fade(engine: Engine, to: number, seconds: number) {
  const { ctx, master } = engine;
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(to, now + seconds);
}

export default function AmbientAudio() {
  const engineRef = useRef<Engine | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);

  // Playback can only ever begin after a gesture, so "paused" is the correct
  // first paint on both the server and the client — no hydration guard needed.
  const [playing, setPlaying] = useState(false);

  // What the visitor asked for, which is not the same as what is currently
  // sounding: hiding the tab stops the audio without clearing the intent, so
  // coming back resumes rather than requiring another click.
  const wantsOnRef = useRef(false);

  const start = useCallback(async () => {
    // Never start into a hidden tab — a backgrounded page that begins playing
    // is exactly the behaviour this component is meant to avoid.
    if (typeof document !== "undefined" && document.hidden) return false;
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

    fade(engine, MASTER_LEVEL, FADE_SECONDS);
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

  // The waveform reads the master bus, so it is the real signal rather than a
  // decorative loop. It only runs while something is playing.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssWidth = canvas.clientWidth || 64;
    const cssHeight = canvas.clientHeight || 22;
    canvas.width = Math.round(cssWidth * dpr);
    canvas.height = Math.round(cssHeight * dpr);
    ctx2d.scale(dpr, dpr);

    const drawFlat = () => {
      ctx2d.clearRect(0, 0, cssWidth, cssHeight);
      ctx2d.strokeStyle = "rgba(21,21,21,0.28)";
      ctx2d.lineWidth = 1.5;
      ctx2d.beginPath();
      ctx2d.moveTo(0, cssHeight / 2);
      ctx2d.lineTo(cssWidth, cssHeight / 2);
      ctx2d.stroke();
    };

    const engine = engineRef.current;
    if (!playing || !engine || prefersReducedMotion()) {
      drawFlat();
      return;
    }

    const analyser = engine.analyser;
    const data = new Uint8Array(analyser.fftSize);

    // Canvas takes a colour string rather than a CSS value, so the brand token
    // is resolved once here instead of being copied into this file.
    const stroke =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-primary-green")
        .trim() || "currentColor";

    const render = () => {
      analyser.getByteTimeDomainData(data);
      ctx2d.clearRect(0, 0, cssWidth, cssHeight);
      ctx2d.strokeStyle = stroke;
      ctx2d.lineWidth = 1.5;
      ctx2d.lineJoin = "round";
      ctx2d.beginPath();

      const step = data.length / cssWidth;
      for (let x = 0; x < cssWidth; x += 1) {
        // The bus peaks near 0.22, so this gain puts a loud moment just inside
        // the canvas instead of flattening against the top and bottom edges.
        const v = (data[Math.floor(x * step)] - 128) / 128;
        const y = cssHeight / 2 - v * cssHeight * 2;
        const clamped = Math.max(1, Math.min(cssHeight - 1, y));
        if (x === 0) ctx2d.moveTo(x, clamped);
        else ctx2d.lineTo(x, clamped);
      }
      ctx2d.stroke();
      frameRef.current = window.requestAnimationFrame(render);
    };

    frameRef.current = window.requestAnimationFrame(render);
    return () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [playing]);

  return (
    <div className="pointer-events-none fixed bottom-[20px] left-[16px] z-40 sm:bottom-[28px] sm:left-[28px]">
      <div className="pointer-events-auto flex items-center gap-[10px] rounded-full border border-black/15 bg-bg/90 py-[8px] pl-[8px] pr-[14px] shadow-[0_8px_24px_-8px_rgba(0,0,0,0.3)] backdrop-blur-sm">
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={playing ? "Pause ambient sound" : "Play ambient sound"}
          className="flex size-[34px] shrink-0 items-center justify-center rounded-full bg-primary-green text-white transition-transform duration-300 hover:scale-105"
        >
          {playing ? (
            <svg width="11" height="12" viewBox="0 0 11 12" aria-hidden="true">
              <rect x="0" y="0" width="3.5" height="12" rx="1" fill="currentColor" />
              <rect x="7.5" y="0" width="3.5" height="12" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg width="11" height="12" viewBox="0 0 11 12" aria-hidden="true">
              <path d="M1 0.9a.6.6 0 0 1 .92-.5l8.2 5.1a.6.6 0 0 1 0 1l-8.2 5.1a.6.6 0 0 1-.92-.5z" fill="currentColor" />
            </svg>
          )}
        </button>

        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="h-[22px] w-[64px]"
        />
      </div>
    </div>
  );
}
