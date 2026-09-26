/**
 * A request for the page's own sound to get out of the way.
 *
 * The site plays an ambient tune, and the showreel lightboxes play film with
 * dialogue and music. Two of those at once is just noise, so anything that is
 * about to make sound of its own takes a hush first and releases it afterwards.
 *
 * It counts depth rather than holding a boolean, so a second lightbox opening
 * over the first cannot hand the tune back while the first is still playing.
 */
let depth = 0;
const listeners = new Set<(hushed: boolean) => void>();

/** Silence the ambient tune. Returns the release — call it exactly once. */
export function hush(): () => void {
  depth += 1;
  if (depth === 1) listeners.forEach((listener) => listener(true));

  let released = false;
  return () => {
    if (released) return;
    released = true;
    depth -= 1;
    if (depth === 0) listeners.forEach((listener) => listener(false));
  };
}

export function isHushed(): boolean {
  return depth > 0;
}

export function onHushChange(listener: (hushed: boolean) => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
