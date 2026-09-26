"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Logo from "@/components/ui/Logo";
import { prefersReducedMotion } from "@/lib/anim";

/**
 * The door into the site, and the only reliable way to open with sound.
 *
 * Browsers refuse to play audible media until the visitor has interacted with
 * the page, and refuse it hardest to a site they have no history with — which
 * is every first visit, every incognito window, and every visitor arriving
 * from a search result. No amount of code gets around that: the tune simply
 * cannot begin on arrival.
 *
 * So the site asks for the one gesture it needs, instead of waiting and
 * hoping. The press that dismisses this panel is itself the gesture, caught by
 * the window-level listener in AmbientAudio, so the tune comes up as the door
 * opens rather than a click or two later.
 *
 * It shows on every full page load, because user activation does not survive
 * one. Client navigations keep the layout mounted and never see it again.
 *
 * Somebody who has switched the sound off is the exception: asking them for a
 * gesture that buys them nothing is pure toll. An inline script in the document
 * head flags that case before first paint and a rule in globals.css hides the
 * panel, because this component cannot read localStorage until hydration — by
 * which point it would already have been on screen. The markup stays identical
 * either way, so hydration has nothing to disagree about — the flag is read
 * only by the effects, which stand down so they do not lock a scroll nobody is
 * being held back from. display:none keeps the panel out of the accessibility
 * tree too, so leaving it in the document costs a skipped visitor nothing.
 */

/** Long enough to read as a door opening, short enough not to be a toll. */
const EXIT_MS = 520;

/** Set before first paint by the inline script in app/layout.tsx. */
function gateSkipped() {
  return (
    typeof document !== "undefined" &&
    document.documentElement.dataset.phSkipGate === "1"
  );
}

export default function EnterGate() {
  const [open, setOpen] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const enter = useCallback(() => {
    if (prefersReducedMotion()) {
      setOpen(false);
      return;
    }
    setLeaving(true);
    window.setTimeout(() => setOpen(false), EXIT_MS);
  }, []);

  // Hold the page still underneath, so a scroll aimed at the site does not run
  // the document along behind the panel.
  useEffect(() => {
    if (!open || gateSkipped()) return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = previous;
    };
  }, [open]);

  // The panel covers everything, so the keyboard belongs to it: focus the one
  // control, and keep Tab from walking into the page behind it.
  useEffect(() => {
    if (!open || gateSkipped()) return;
    buttonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Tab") {
        event.preventDefault();
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!open) return null;

  return (
    <div
      data-ph-gate=""
      role="dialog"
      aria-modal="true"
      aria-label="Enter Project Help"
      className={`fixed inset-0 z-[60] flex flex-col items-center justify-center gap-[36px] bg-bg px-[24px] transition-opacity duration-500 ease-out ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <Logo className="h-[64px] w-auto text-black sm:h-[86px]" />

      <button
        ref={buttonRef}
        type="button"
        onClick={enter}
        className="rounded-[100px] bg-primary-green px-[42px] py-[16px] font-display text-[15px] uppercase tracking-[0.14em] text-black transition-transform duration-300 hover:scale-105 active:scale-95"
      >
        Enter
      </button>

      <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-neutral-paragraph">
        Best with sound on
      </p>
    </div>
  );
}
