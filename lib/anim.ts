"use client";

import { gsap } from "@/lib/gsap";

/** Honour the OS "reduce motion" setting — callers skip transforms entirely. */
export function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type TriggerOptions = {
  /** Viewport position the trigger's top must reach. */
  start?: string;
  /** Play once and stay, instead of replaying on every pass. */
  once?: boolean;
};

/**
 * Standard reveal trigger. `once` deliberately defaults to false with
 * `toggleActions` set to play-once-forward: the tween still only plays a single
 * time, but the trigger survives a ScrollTrigger.refresh() (fonts, images,
 * route changes) instead of being killed before it ever fired.
 *
 * Deliberately NOT `invalidateOnRefresh`. These drive `gsap.from()` tweens,
 * which render their start state immediately; invalidating one that has not run
 * yet re-reads that hidden state as the destination, so the element stays at
 * opacity 0 forever. It belongs on scrubbed `to()` tweens, not here.
 */
export function reveal(trigger: Element | null, options: TriggerOptions = {}) {
  return {
    trigger,
    start: options.start ?? "top 82%",
    toggleActions: "play none none none",
    once: options.once ?? false,
  } as const;
}

/**
 * Split an element's text into per-word and per-character spans so headings can
 * animate at character granularity. Returns the character elements in order.
 * Words stay unbroken (`inline-block` + `whitespace-nowrap`) so the split never
 * changes where lines wrap.
 */
export function splitChars(el: HTMLElement | null): HTMLElement[] {
  if (!el) return [];

  // Re-splitting an already-split node would nest spans forever.
  if (el.dataset.split === "true") {
    return Array.from(el.querySelectorAll<HTMLElement>("[data-char]"));
  }

  const source = el.textContent ?? "";
  el.dataset.split = "true";
  el.textContent = "";

  const chars: HTMLElement[] = [];

  source.split(/(\s+)/).forEach((chunk) => {
    if (chunk.trim() === "") {
      el.appendChild(document.createTextNode(chunk));
      return;
    }

    const word = document.createElement("span");
    word.style.display = "inline-block";
    word.style.whiteSpace = "nowrap";

    Array.from(chunk).forEach((character) => {
      const outer = document.createElement("span");
      outer.style.display = "inline-block";
      outer.style.overflow = "hidden";
      outer.style.verticalAlign = "top";

      const inner = document.createElement("span");
      inner.dataset.char = "true";
      inner.style.display = "inline-block";
      inner.textContent = character;

      outer.appendChild(inner);
      word.appendChild(outer);
      chars.push(inner);
    });

    el.appendChild(word);
  });

  return chars;
}

/** Rising-character headline reveal, driven by a scroll trigger. */
export function charReveal(
  el: HTMLElement | null,
  scrollTrigger: object | undefined,
  options: { stagger?: number; duration?: number; delay?: number } = {},
) {
  const chars = splitChars(el);
  if (!chars.length) return;

  if (prefersReducedMotion()) {
    gsap.set(chars, { yPercent: 0, opacity: 1 });
    return;
  }

  gsap.from(chars, {
    yPercent: 118,
    duration: options.duration ?? 0.9,
    ease: "power4.out",
    stagger: options.stagger ?? 0.018,
    delay: options.delay ?? 0,
    scrollTrigger,
  });
}

/**
 * Count a number up to `target`. The digit count of the markup's starting value
 * is preserved, so a design that reads "05" counts 00 → 05 rather than
 * collapsing to a single glyph and shifting everything beside it.
 */
export function countUp(
  el: HTMLElement,
  target: number,
  scrollTrigger: object,
  duration = 1.8,
) {
  const width = (el.textContent ?? "").trim().length || String(target).length;
  const format = (value: number) => String(value).padStart(width, "0");

  if (prefersReducedMotion()) {
    el.textContent = format(target);
    return;
  }

  const state = { value: 0 };
  el.textContent = format(0);

  gsap.to(state, {
    value: target,
    duration,
    ease: "power2.out",
    scrollTrigger,
    onUpdate: () => {
      el.textContent = format(Math.round(state.value));
    },
  });
}

/**
 * Cursor-following pull on a button. Returns a cleanup function.
 */
export function magnetic(el: HTMLElement | null, strength = 0.28) {
  if (!el || prefersReducedMotion()) return () => {};

  const quickX = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
  const quickY = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

  const move = (event: PointerEvent) => {
    const box = el.getBoundingClientRect();
    quickX((event.clientX - (box.left + box.width / 2)) * strength);
    quickY((event.clientY - (box.top + box.height / 2)) * strength);
  };

  const reset = () => {
    quickX(0);
    quickY(0);
  };

  el.addEventListener("pointermove", move);
  el.addEventListener("pointerleave", reset);

  return () => {
    el.removeEventListener("pointermove", move);
    el.removeEventListener("pointerleave", reset);
  };
}

/** Slow vertical drift tied to page scroll — subtler than ParallaxImage. */
export function drift(el: Element | null, distance = 80, trigger?: Element | null) {
  if (!el || prefersReducedMotion()) return;

  gsap.fromTo(
    el,
    { y: distance / 2 },
    {
      y: -distance / 2,
      ease: "none",
      scrollTrigger: {
        trigger: trigger ?? el,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    },
  );
}
