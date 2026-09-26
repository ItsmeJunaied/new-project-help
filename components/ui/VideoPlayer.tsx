"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/anim";

type VideoPlayerProps = {
  src: string;
  poster?: string;
  /** Used for the accessible names on the controls. */
  title: string;
  autoPlay?: boolean;
  /**
   * Put keyboard focus on the player as it mounts. The shortcuts below are
   * bound to this element, so without it nothing responds to the space bar
   * until the visitor has clicked something.
   */
  autoFocus?: boolean;
  className?: string;
};

/** How long the controls stay up after the pointer stops moving. */
const IDLE_MS = 2600;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** `0:07`, `1:04`, `12:30` — hours only once there are any. */
function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const whole = Math.floor(seconds);
  const h = Math.floor(whole / 3600);
  const m = Math.floor((whole % 3600) / 60);
  const s = whole % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  return `${h > 0 ? `${h}:` : ""}${mm}:${String(s).padStart(2, "0")}`;
}

/**
 * The full player: scrubber, buffered range, volume, fullscreen, keyboard.
 *
 * Deliberately not `<video controls>`. The native bar carries a download item in
 * its overflow menu, cannot be themed, and looks like a different product on
 * every browser — none of which suits a showreel that is the first film anyone
 * sees of this studio.
 *
 * The scrubber is a div rather than an `<input type="range">` because it draws
 * three stacked layers (buffered, played, handle) that a range input cannot
 * express. It carries the slider role and the arrow keys by hand in exchange.
 *
 * Time is read on `timeupdate`, which fires about four times a second — the
 * progress bar is tweened towards the real value instead of stepping to it, so
 * it sweeps rather than ticks.
 */
export default function VideoPlayer({
  src,
  poster,
  title,
  autoPlay = false,
  autoFocus = false,
  className = "",
}: VideoPlayerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<number | null>(null);

  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [scrubbing, setScrubbing] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [uiVisible, setUiVisible] = useState(true);
  const [hoverAt, setHoverAt] = useState<number | null>(null);

  const progress = duration > 0 ? current / duration : 0;

  /** Any pointer activity puts the controls up and restarts the countdown. */
  const wake = useCallback(() => {
    setUiVisible(true);
    if (idleTimer.current !== null) window.clearTimeout(idleTimer.current);
    idleTimer.current = window.setTimeout(() => {
      idleTimer.current = null;
      // Never hide the controls over a paused film — there is nothing to watch
      // and no way to guess where they went.
      const el = videoRef.current;
      if (el && !el.paused) setUiVisible(false);
    }, IDLE_MS);
  }, []);

  const togglePlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) void el.play().catch(() => {});
    else el.pause();
    wake();
  }, [wake]);

  const seekTo = useCallback((seconds: number) => {
    const el = videoRef.current;
    if (!el || !Number.isFinite(el.duration)) return;
    el.currentTime = clamp(seconds, 0, el.duration);
    setCurrent(el.currentTime);
  }, []);

  const seekBy = useCallback(
    (delta: number) => {
      const el = videoRef.current;
      if (el) seekTo(el.currentTime + delta);
      wake();
    },
    [seekTo, wake],
  );

  const changeVolume = useCallback((next: number) => {
    const el = videoRef.current;
    const value = clamp(next, 0, 1);
    setVolume(value);
    setMuted(value === 0);
    if (el) {
      el.volume = value;
      el.muted = value === 0;
    }
  }, []);

  const toggleMute = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    const next = !el.muted;
    el.muted = next;
    setMuted(next);
    // Unmuting something that was dragged to zero should make a sound, not
    // silently flip a flag.
    if (!next && el.volume === 0) {
      el.volume = 0.6;
      setVolume(0.6);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    else void root.requestFullscreen?.().catch(() => {});
  }, []);

  /** Where along the bar a given clientX falls, as a fraction. */
  const fractionAt = useCallback((clientX: number) => {
    const bar = barRef.current;
    if (!bar) return 0;
    const box = bar.getBoundingClientRect();
    return box.width > 0 ? clamp((clientX - box.left) / box.width, 0, 1) : 0;
  }, []);

  // Wiring the media element's own events, rather than mirroring state into it.
  // The element is the source of truth: it also changes from the keyboard, from
  // the OS media keys and from reaching its own end.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const onPlay = () => { setPlaying(true); wake(); };
    const onPause = () => { setPlaying(false); setUiVisible(true); };
    const onTime = () => { if (!scrubbing) setCurrent(el.currentTime); };
    const onDuration = () => setDuration(el.duration);
    const onWaiting = () => setWaiting(true);
    const onPlaying = () => setWaiting(false);
    const onVolume = () => { setVolume(el.volume); setMuted(el.muted); };
    const onProgress = () => {
      // The range that covers the playhead is the one worth drawing; a file can
      // hold several once somebody has skipped around.
      const ranges = el.buffered;
      for (let i = 0; i < ranges.length; i += 1) {
        if (ranges.start(i) <= el.currentTime && ranges.end(i) >= el.currentTime) {
          setBuffered(ranges.end(i));
          return;
        }
      }
    };

    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("durationchange", onDuration);
    el.addEventListener("loadedmetadata", onDuration);
    el.addEventListener("waiting", onWaiting);
    el.addEventListener("playing", onPlaying);
    el.addEventListener("canplay", onPlaying);
    el.addEventListener("volumechange", onVolume);
    el.addEventListener("progress", onProgress);

    return () => {
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("durationchange", onDuration);
      el.removeEventListener("loadedmetadata", onDuration);
      el.removeEventListener("waiting", onWaiting);
      el.removeEventListener("playing", onPlaying);
      el.removeEventListener("canplay", onPlaying);
      el.removeEventListener("volumechange", onVolume);
      el.removeEventListener("progress", onProgress);
    };
  }, [scrubbing, wake]);

  useEffect(() => {
    const onChange = () => setFullscreen(document.fullscreenElement === rootRef.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Keyboard, scoped to the player rather than the window: this sits inside a
  // lightbox that has its own Escape handling, and a space bar that swallows
  // page scrolling everywhere would be worse than no shortcut at all.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onKeyDown = (event: KeyboardEvent) => {
      // Let the volume slider keep its own arrow keys.
      if ((event.target as HTMLElement)?.tagName === "INPUT") return;

      const handlers: Record<string, () => void> = {
        " ": togglePlay,
        k: togglePlay,
        ArrowRight: () => seekBy(5),
        ArrowLeft: () => seekBy(-5),
        l: () => seekBy(10),
        j: () => seekBy(-10),
        ArrowUp: () => { changeVolume(volume + 0.1); wake(); },
        ArrowDown: () => { changeVolume(volume - 0.1); wake(); },
        m: toggleMute,
        f: toggleFullscreen,
        Home: () => seekTo(0),
        End: () => seekTo(duration),
      };

      const handler = handlers[event.key];
      if (!handler) return;
      event.preventDefault();
      event.stopPropagation();
      handler();
    };

    root.addEventListener("keydown", onKeyDown);
    return () => root.removeEventListener("keydown", onKeyDown);
  }, [togglePlay, seekBy, seekTo, changeVolume, toggleMute, toggleFullscreen, volume, duration, wake]);

  useEffect(() => {
    if (autoFocus) rootRef.current?.focus({ preventScroll: true });
  }, [autoFocus]);

  useEffect(() => {
    return () => {
      if (idleTimer.current !== null) window.clearTimeout(idleTimer.current);
    };
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(".player-chrome", {
        y: 16,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.06,
        delay: 0.15,
      });
    },
    { scope: rootRef },
  );

  const startScrub = (event: React.PointerEvent<HTMLDivElement>) => {
    // Capture keeps the drag alive once the finger leaves the 4px bar, which is
    // most of any real drag. It throws if the pointer is not actually down —
    // which a synthetic event is not — and that must not take the seek with it.
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* no capture; the drag still works while the pointer stays on the bar */
    }
    setScrubbing(true);
    const next = fractionAt(event.clientX) * duration;
    setCurrent(next);
    seekTo(next);
  };

  const moveScrub = (event: React.PointerEvent<HTMLDivElement>) => {
    const fraction = fractionAt(event.clientX);
    setHoverAt(fraction * duration);
    if (!scrubbing) return;
    const next = fraction * duration;
    setCurrent(next);
    seekTo(next);
  };

  const endScrub = (event: React.PointerEvent<HTMLDivElement>) => {
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      /* nothing was captured */
    }
    setScrubbing(false);
  };

  const iconClass = "size-[18px]";

  return (
    <div
      ref={rootRef}
      tabIndex={-1}
      onPointerMove={wake}
      onPointerLeave={() => { if (playing) setUiVisible(false); }}
      className={`group/player relative overflow-hidden bg-black outline-none ${
        uiVisible || !playing ? "" : "cursor-none"
      } ${className}`}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        playsInline
        // No native chrome at all: `controlsList` only prunes the browser's own
        // menu, and this player never shows it in the first place.
        controlsList="nodownload noplaybackrate noremoteplayback"
        disablePictureInPicture
        onContextMenu={(event) => event.preventDefault()}
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        className="size-full bg-black object-contain"
      >
        Your browser does not support the video tag.
      </video>

      {/* Buffering only — a spinner that also covered the paused state would sit
          there spinning over a film nobody asked to start. */}
      {waiting && playing ? (
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 size-[46px] -translate-x-1/2 -translate-y-1/2 animate-spin rounded-full border-[3px] border-white/25 border-t-primary-green"
        />
      ) : null}

      {/* The big centre button, for the paused state only. */}
      {!playing && !waiting ? (
        <button
          type="button"
          onClick={togglePlay}
          aria-label={`Play ${title}`}
          className="absolute left-1/2 top-1/2 flex size-[84px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary-green text-black shadow-[0_8px_32px_rgba(0,0,0,0.45)] transition-transform duration-300 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          <svg viewBox="0 0 24 24" className="ml-[4px] size-[32px]" aria-hidden>
            <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
          </svg>
        </button>
      ) : null}

      <div
        className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-[16px] pb-[14px] pt-[48px] transition-opacity duration-300 lg:px-[24px] lg:pb-[20px] ${
          uiVisible || !playing ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {/* Scrubber. The hit area is taller than the 4px it draws, so it can
            actually be grabbed with a finger. */}
        <div
          ref={barRef}
          role="slider"
          tabIndex={0}
          aria-label={`Seek through ${title}`}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration) || 0}
          aria-valuenow={Math.round(current)}
          aria-valuetext={`${formatTime(current)} of ${formatTime(duration)}`}
          onPointerDown={startScrub}
          onPointerMove={moveScrub}
          onPointerUp={endScrub}
          onPointerCancel={endScrub}
          onPointerLeave={() => setHoverAt(null)}
          className="player-chrome group/bar relative -mx-[2px] cursor-pointer px-[2px] py-[9px] outline-none"
        >
          <div className="relative h-[4px] w-full rounded-full bg-white/25">
            {/* Buffered sits under played, so the green always reads on top. */}
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-white/35"
              style={{ width: duration > 0 ? `${(buffered / duration) * 100}%` : "0%" }}
            />
            {/* scaleX from the left rather than an animated width: a transform
                does not lay the page out again 60 times a second.

                `timeupdate` only lands about four times a second, so stepping
                straight to each new value would tick rather than sweep — a
                linear transition covers the gap between readings. It is turned
                off while scrubbing, where the bar has to sit under the finger
                exactly rather than trail it. Deliberately CSS and not GSAP:
                this is the one thing in the player that must never stop
                moving, so it does not depend on a JavaScript ticker. */}
            <div
              className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-primary-green"
              style={{
                transform: `scaleX(${progress})`,
                transition: scrubbing ? "none" : "transform 0.25s linear",
              }}
            />
            <span
              aria-hidden
              className={`absolute top-1/2 size-[13px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-green shadow transition-transform duration-200 ${
                scrubbing ? "scale-125" : "scale-0 group-hover/bar:scale-100 group-focus/bar:scale-100"
              }`}
              style={{ left: `${progress * 100}%` }}
            />
          </div>

          {hoverAt !== null && duration > 0 ? (
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-[26px] -translate-x-1/2 rounded-[4px] bg-black/85 px-[6px] py-[2px] font-mono text-[11px] leading-[16px] text-white"
              style={{ left: `${(hoverAt / duration) * 100}%` }}
            >
              {formatTime(hoverAt)}
            </span>
          ) : null}
        </div>

        <div className="player-chrome mt-[4px] flex items-center gap-[14px] text-white">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={playing ? `Pause ${title}` : `Play ${title}`}
            className="flex size-[34px] shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-green"
          >
            {playing ? (
              <svg viewBox="0 0 24 24" className={iconClass} aria-hidden>
                <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className={iconClass} aria-hidden>
                <path d="M8 5.5v13l11-6.5z" fill="currentColor" />
              </svg>
            )}
          </button>

          {/* Tabular figures, or the whole row shuffles sideways every second
              the seconds digit changes width. */}
          <p className="shrink-0 font-mono text-[12px] leading-[16px] tabular-nums text-white/85">
            {formatTime(current)}
            <span className="text-white/40"> / {formatTime(duration)}</span>
          </p>

          {/* The slider opens on hover so the resting bar stays uncluttered, but
              it keeps its tab stop either way — width, not display, so it is
              never removed from the tab order. */}
          <div className="group/vol ml-auto flex shrink-0 items-center">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={muted ? "Unmute" : "Mute"}
              className="flex size-[34px] shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-green"
            >
              <svg viewBox="0 0 24 24" className={iconClass} fill="none" aria-hidden>
                <path d="M4 9.5h3.2L12 5.5v13L7.2 14.5H4z" fill="currentColor" />
                {muted || volume === 0 ? (
                  <path d="M16 9.5l4 5m0-5l-4 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                ) : (
                  <>
                    <path d="M15.5 9.8a3.2 3.2 0 010 4.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    {volume > 0.55 ? (
                      <path d="M18 7.6a6.4 6.4 0 010 8.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    ) : null}
                  </>
                )}
              </svg>
            </button>

            <div className="w-0 overflow-hidden transition-all duration-300 ease-out group-hover/vol:w-[76px] group-focus-within/vol:w-[76px]">
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={Math.round((muted ? 0 : volume) * 100)}
                onChange={(event) => changeVolume(Number(event.target.value) / 100)}
                aria-label={`Volume for ${title}`}
                style={{
                  background: `linear-gradient(to right, var(--color-primary-green) ${
                    (muted ? 0 : volume) * 100
                  }%, rgba(255,255,255,0.28) ${(muted ? 0 : volume) * 100}%)`,
                }}
                className="ml-[6px] h-[4px] w-[66px] cursor-pointer appearance-none rounded-full outline-none [&::-moz-range-thumb]:size-[12px] [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary-green [&::-webkit-slider-thumb]:size-[12px] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-green"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={fullscreen ? "Exit full screen" : "Full screen"}
            className="flex size-[34px] shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-green"
          >
            <svg viewBox="0 0 24 24" className={iconClass} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              {fullscreen ? (
                <path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" />
              ) : (
                <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
              )}
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
