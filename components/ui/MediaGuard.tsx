"use client";

import { useEffect } from "react";

/**
 * Raises the cost of casually lifting the pictures and film off this site.
 *
 * Read this before relying on it: none of it is protection, and none of it can
 * be. Everything the page renders has already been delivered to the visitor's
 * machine, so the file is on their disk before any of this code runs — it sits
 * in the browser cache and in the network panel either way. What follows only
 * removes the one-gesture routes: the right-click menu, dragging a picture out
 * to the desktop, the browser's own download item on a video.
 *
 * Anyone who opens the developer tools, reads the page source, or types the
 * media URL into the address bar still gets the file, and that cannot be
 * prevented from inside the page. Real protection means not shipping the
 * original: signed, expiring URLs, visible watermarking, or segmented streaming
 * with DRM. Those live on the server, not here.
 *
 * `BLOCK_DEV_SHORTCUTS` covers F12 and friends. It is the weakest part of this
 * file by a distance — the same tools open from the browser's own menu, which a
 * page cannot touch — and it costs real keyboard users their shortcuts. It is
 * a separate switch so it can be turned off without losing the rest.
 */
const BLOCK_DEV_SHORTCUTS = true;

/** Right-click stays available where it does actual work. */
const EDITABLE = "input, textarea, select, [contenteditable=''], [contenteditable='true']";

export default function MediaGuard() {
  useEffect(() => {
    const onContextMenu = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      // Taking the context menu away from a text field takes away paste, spell
      // check and the password manager with it.
      if (target?.closest(EDITABLE)) return;
      event.preventDefault();
    };

    // Covers the drag that would otherwise drop a copy straight onto a desktop.
    const onDragStart = (event: DragEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (target.tagName === "IMG" || target.tagName === "VIDEO" || target.closest("picture")) {
        event.preventDefault();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!BLOCK_DEV_SHORTCUTS) return;

      const key = event.key.toLowerCase();
      const ctrlish = event.ctrlKey || event.metaKey;

      const blocked =
        event.key === "F12" ||
        (ctrlish && event.shiftKey && (key === "i" || key === "j" || key === "c")) ||
        (ctrlish && (key === "u" || key === "s"));

      if (blocked) event.preventDefault();
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("dragstart", onDragStart);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("dragstart", onDragStart);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}
