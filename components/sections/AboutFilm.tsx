"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";
import AutoVideo from "@/components/ui/AutoVideo";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/**
 * The reduce-motion setting, read the way React wants an external value read.
 *
 * `lib/anim`'s `prefersReducedMotion()` is the right call from inside a GSAP
 * effect, but this component has to decide which of two section layouts to
 * RENDER, and a browser setting is exactly the "external store" this hook
 * exists for: the server snapshot picks the scrubbed version, hydration
 * corrects it, and someone turning the setting on mid-visit is picked up too.
 */
const subscribeToReducedMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const reducedMotionNow = () => window.matchMedia(REDUCED_MOTION).matches;

/** No media queries on the server, so the scrubbed version is what hydrates. */
const reducedMotionOnServer = () => false;

type Chapter = {
  /** Where this line takes over, as a fraction of the scroll. */
  at: number;
  label: string;
  line: string;
};

/**
 * The lines that take turns over the film. `at` is a position in the scrub, not
 * a timestamp — the film is driven by the scrollbar, so the copy has to be too.
 */
const CHAPTERS: Chapter[] = [
  { at: 0, label: "01 — Who", line: "A studio of senior engineers in Dhaka." },
  { at: 0.34, label: "02 — How", line: "Scope first, then two-week slices you can redirect." },
  { at: 0.68, label: "03 — Yours", line: "The repository is in your organisation from the first commit." },
];

type AboutFilmProps = {
  /** Silent cut with dense keyframes, encoded for seeking rather than playback. */
  src: string;
  poster: string;
  /** Screens of scroll the film is stretched across. */
  screens?: number;
};

/**
 * The about film, played by the scrollbar rather than by a play button.
 *
 * The section is `screens` tall and the frame inside it is `sticky`, which is
 * what holds the film still while the page keeps scrolling past. Deliberately
 * sticky rather than a ScrollTrigger `pin`: pinning inserts a spacer and
 * re-measures the whole page on every refresh, and a plain sticky child gets the
 * same result from the browser for nothing — and never disagrees with the
 * triggers the rest of the page already has.
 *
 * Scroll position is then mapped onto `video.currentTime`. That only works on a
 * file encoded for it: seeking to an arbitrary moment costs a decode from the
 * nearest keyframe, so the cut this plays carries one every few frames (see the
 * about-film job in scripts/videos/encode.mjs). Handed a normally encoded film
 * it would still work, just in visible steps.
 *
 * Two conditions fall back to an ordinary looping film instead: the OS asking
 * for reduced motion — scroll-hijacked video is squarely what that setting is
 * about — and the file failing to load, where a tall empty section would be a
 * worse outcome than a short one.
 */
export default function AboutFilm({ src, poster, screens = 3 }: AboutFilmProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const reduced = useSyncExternalStore(
    subscribeToReducedMotion,
    reducedMotionNow,
    reducedMotionOnServer,
  );
  const [missing, setMissing] = useState(false);

  const scrubbing = !reduced && !missing;

  useGSAP(
    () => {
      const section = sectionRef.current;
      const video = videoRef.current;
      if (!section || !video || !scrubbing) return;

      // Nothing here should ever play on its own — the scrollbar is the
      // transport. A stray autoplay would race the seeking below.
      const pause = () => video.pause();
      video.addEventListener("play", pause);

      const progress = { value: 0 };

      /**
       * Seeking, rate-limited to one request per frame.
       *
       * Writing `currentTime` on every scroll event asks the decoder for work it
       * cannot finish before the next write lands, and the picture stalls on the
       * frame it was chasing two seeks ago. So the newest position is kept and
       * applied once a frame, and only when the element is not already mid-seek.
       */
      let frame = 0;
      let wanted = 0;

      const apply = () => {
        frame = 0;
        const duration = video.duration;
        if (!duration || Number.isNaN(duration)) return;

        // The last frame is not reliably seekable, so the end of the scroll maps
        // just short of it rather than to a black frame.
        const target = Math.max(0, Math.min(duration - 0.05, wanted * duration));

        // Under one frame's worth of difference is not worth a decode.
        if (Math.abs(video.currentTime - target) < 1 / 50) return;
        if (video.readyState < 2) return;

        if (video.seeking) {
          frame = requestAnimationFrame(apply);
          return;
        }

        video.currentTime = target;
      };

      const request = () => {
        wanted = progress.value;
        if (!frame) frame = requestAnimationFrame(apply);
      };

      gsap.to(progress, {
        value: 1,
        ease: "none",
        onUpdate: request,
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });

      // The frame arrives inset and rounded and opens out to full bleed over the
      // first third, so the film grows into the page instead of cutting to it.
      gsap.fromTo(
        ".film-frame",
        { scale: 0.86, borderRadius: 26 },
        {
          scale: 1,
          borderRadius: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "30% top",
            scrub: 0.5,
          },
        },
      );

      gsap.to(".film-rail-fill", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });

      // Each caption owns a slice of the scroll and hands over to the next. The
      // first one is already up when the section arrives, so it only has to be
      // taken away again.
      const captions = gsap.utils.toArray<HTMLElement>(".film-caption");

      captions.forEach((caption, index) => {
        const from = CHAPTERS[index].at;
        const to = CHAPTERS[index + 1]?.at ?? 1.001;

        gsap.set(caption, { autoAlpha: index === 0 ? 1 : 0, y: index === 0 ? 0 : 18 });

        gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: `${from * 100}% top`,
            end: `${to * 100}% top`,
            scrub: 0.5,
            onEnter: () => gsap.to(caption, { autoAlpha: 1, y: 0, duration: 0.5 }),
            onEnterBack: () => gsap.to(caption, { autoAlpha: 1, y: 0, duration: 0.5 }),
            onLeave: () => gsap.to(caption, { autoAlpha: 0, y: -18, duration: 0.4 }),
            onLeaveBack: () => gsap.to(caption, { autoAlpha: 0, y: 18, duration: 0.4 }),
          },
        });
      });

      return () => {
        video.removeEventListener("play", pause);
        if (frame) cancelAnimationFrame(frame);
      };
    },
    { scope: sectionRef, dependencies: [scrubbing] },
  );

  // No film on disk. An empty 16:9 frame is a large hole in the page directly
  // under the statement lines, which is worse than the section simply not being
  // there — so it takes itself out until the file exists. Nothing else on the
  // page depends on it, and it comes back on its own once the encode has run.
  if (missing) return null;

  // Reduced motion: one frame, playing itself, with the copy stacked underneath
  // instead of held over the picture.
  if (!scrubbing) {
    return (
      <section className="w-full bg-black py-[64px] lg:py-[96px]">
        <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[40px]">
          <div className="relative aspect-video w-full overflow-hidden rounded-[20px]">
            <AutoVideo
              src={src}
              poster={poster}
              decorative
              className="absolute inset-0 size-full object-cover"
            />
          </div>

          <ul className="mt-[32px] grid w-full gap-[24px] sm:grid-cols-3">
            {CHAPTERS.map((chapter) => (
              <li key={chapter.label}>
                <p className="font-mono text-[11px] leading-none tracking-[0.6px] text-primary-green">
                  {chapter.label}
                </p>
                <p className="mt-[10px] font-display text-[19px] font-medium leading-[1.25] tracking-[-0.3px] text-white">
                  {chapter.line}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-label="Inside Project Help"
      className="relative w-full bg-black"
      style={{ height: `${screens * 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <div className="film-frame relative size-full overflow-hidden will-change-transform">
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            preload="auto"
            muted
            playsInline
            aria-hidden
            // Seeking is the whole interaction, so the file has to be here in
            // full — there is no "a screen ahead" for a scrubbed film.
            onError={() => setMissing(true)}
            onLoadedMetadata={(event) => event.currentTarget.pause()}
            disablePictureInPicture
            controlsList="nodownload noplaybackrate noremoteplayback"
            onContextMenu={(event) => event.preventDefault()}
            className="absolute inset-0 size-full object-cover"
          />

          {/* Both ends darkened so the type over the film stays readable
              whatever the frame underneath happens to be doing. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(2,2,2,0.66),rgba(2,2,2,0.12)_38%,rgba(2,2,2,0.18)_62%,rgba(2,2,2,0.78))]"
          />

          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between px-6 py-[32px] lg:px-[40px] lg:py-[48px]">
            <p className="font-body text-[18px] font-medium leading-[18px] tracking-[-0.25px] text-white/70">
              [ Inside Project Help ]
            </p>

            <div className="relative h-[132px] w-full max-w-[760px] sm:h-[112px]">
              {CHAPTERS.map((chapter) => (
                <div
                  key={chapter.label}
                  className="film-caption absolute inset-x-0 bottom-0 will-change-transform"
                >
                  <p className="font-mono text-[11px] leading-none tracking-[0.6px] text-primary-green">
                    {chapter.label}
                  </p>
                  <p className="mt-[14px] font-display text-[clamp(1.5rem,3.4vw,44px)] font-medium leading-[1.1] tracking-[-1px] text-white">
                    {chapter.line}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* How far through the film the scroll has got. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-6 bottom-[20px] h-px bg-white/20 lg:inset-x-[40px]"
          >
            <span className="film-rail-fill block h-full w-full origin-left scale-x-0 bg-primary-green" />
          </div>
        </div>
      </div>
    </section>
  );
}
