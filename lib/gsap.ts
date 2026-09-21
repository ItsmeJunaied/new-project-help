"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  // limitCallbacks keeps ScrollTrigger from firing enter/leave callbacks more
  // than once per scroll direction change, which cuts a lot of work on a page
  // carrying this many triggers.
  ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true });

  // Sections are image-heavy, so the first ScrollTrigger measurement happens
  // against a layout that is still growing. Without a refresh the start
  // positions drift and reveals either fire far too early or never fire at all
  // — which is what made several sections look like they had no animation.
  //
  // `load` and `fonts.ready` both land within a few hundred ms of each other,
  // and a refresh re-measures every trigger on the page, so they are coalesced
  // into one idle-time pass instead of two synchronous ones during hydration.
  let queued = false;

  const refresh = () => {
    queued = false;
    ScrollTrigger.refresh();
  };

  const queueRefresh = () => {
    if (queued) return;
    queued = true;

    const idle = window.requestIdleCallback;
    if (typeof idle === "function") idle.call(window, refresh, { timeout: 400 });
    else window.setTimeout(refresh, 200);
  };

  window.addEventListener("load", queueRefresh);
  document.fonts?.ready.then(queueRefresh);

  if (process.env.NODE_ENV === "development") {
    Object.assign(window, { gsap, ScrollTrigger });
  }
}

export { gsap, ScrollTrigger };
