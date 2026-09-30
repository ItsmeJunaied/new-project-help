"use client";

/**
 * The two pieces every measured flow graph on this site needs.
 *
 * Both were written for components/sections/WorkingProcess.tsx and are now
 * shared with the contact page's process block, which draws the same kind of
 * graph on a dark ground. They live here rather than being copied into the
 * second component so the two cannot drift: a change to how a corner is
 * filleted, or to when a timeline is allowed to run, applies to both.
 */

export type Point = { x: number; y: number };

/**
 * An orthogonal polyline with its corners rounded off.
 *
 * Square elbows read as a wiring diagram; rounded ones read as the flow charts
 * these were drawn from. Each corner is cut back by the radius along both of
 * its legs and bridged with a quadratic whose control point is the corner
 * itself. The radius is clamped to half the shorter leg, so a tight corner
 * narrows its own fillet instead of overshooting into the next one.
 */
export function roundedPath(points: Point[], radius: number) {
  // Collinear and duplicate waypoints produce zero-length legs, and a fillet on
  // one of those is a NaN in the `d` attribute that voids the whole path.
  const via: Point[] = points.filter((point, index) => {
    if (index === 0 || index === points.length - 1) return true;
    const before = points[index - 1];
    const after = points[index + 1];
    if (point.x === before.x && point.x === after.x) return false;
    if (point.y === before.y && point.y === after.y) return false;
    return !(point.x === before.x && point.y === before.y);
  });

  if (via.length < 2) return "";

  let d = `M ${via[0].x.toFixed(1)} ${via[0].y.toFixed(1)}`;

  for (let i = 1; i < via.length - 1; i += 1) {
    const previous = via[i - 1];
    const corner = via[i];
    const next = via[i + 1];

    const inLength = Math.hypot(corner.x - previous.x, corner.y - previous.y);
    const outLength = Math.hypot(next.x - corner.x, next.y - corner.y);
    if (!inLength || !outLength) continue;

    const r = Math.min(radius, inLength / 2, outLength / 2);

    const entry = {
      x: corner.x + ((previous.x - corner.x) / inLength) * r,
      y: corner.y + ((previous.y - corner.y) / inLength) * r,
    };
    const exit = {
      x: corner.x + ((next.x - corner.x) / outLength) * r,
      y: corner.y + ((next.y - corner.y) / outLength) * r,
    };

    d += ` L ${entry.x.toFixed(1)} ${entry.y.toFixed(1)}`;
    d += ` Q ${corner.x.toFixed(1)} ${corner.y.toFixed(1)} ${exit.x.toFixed(1)} ${exit.y.toFixed(1)}`;
  }

  const last = via[via.length - 1];
  return `${d} L ${last.x.toFixed(1)} ${last.y.toFixed(1)}`;
}

/**
 * A card's box in LAYOUT coordinates — offsets, not bounding rects.
 *
 * The cards are usually under an entrance tween when the wiring is first
 * measured, and a bounding rect includes that tween's transform: measured
 * there, every wire would be pinned to where its card was passing through
 * rather than to where it comes to rest.
 */
export function layoutFrame(element: HTMLElement, within: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = element;

  while (node && node !== within) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }

  return { x, y, w: element.offsetWidth, h: element.offsetHeight };
}

/** The midpoint of one edge of a laid-out box. */
export function anchor(
  element: HTMLElement,
  within: HTMLElement,
  side: "top" | "right" | "bottom" | "left",
): Point {
  const f = layoutFrame(element, within);
  if (side === "right") return { x: f.x + f.w, y: f.y + f.h / 2 };
  if (side === "left") return { x: f.x, y: f.y + f.h / 2 };
  if (side === "bottom") return { x: f.x + f.w / 2, y: f.y + f.h };
  return { x: f.x + f.w / 2, y: f.y };
}

/**
 * Runs `on` while the element is in view and `off` while it is not, and returns
 * the teardown. A plain IntersectionObserver rather than a ScrollTrigger: this
 * only answers "is it visible", and a trigger would be one more thing for the
 * page-wide refresh to measure.
 */
export function whileVisible(element: Element, handlers: { on: () => void; off: () => void }) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting && !document.hidden) handlers.on();
        else handlers.off();
      }
    },
    { threshold: 0.01 },
  );

  observer.observe(element);

  // A backgrounded tab does not move the element, so the observer never fires
  // and the timeline would keep running on a page nobody is looking at.
  const onVisibility = () => {
    if (document.hidden) handlers.off();
    else if (element.getBoundingClientRect().bottom > 0) handlers.on();
  };

  document.addEventListener("visibilitychange", onVisibility);

  return () => {
    observer.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
    handlers.off();
  };
}
