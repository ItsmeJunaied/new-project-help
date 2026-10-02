"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";
let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Turnstile"));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export type TurnstileHandle = { reset: () => void };

type TurnstileProps = {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  /** The widget could not run at all — bad key, blocked script, offline. */
  onError?: (code?: string) => void;
};

/** Cloudflare Turnstile widget — verifies the contact form isn't a bot. */
export const Turnstile = forwardRef<TurnstileHandle, TurnstileProps>(function Turnstile(
  { siteKey, onVerify, onExpire, onError },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    },
  }));

  useEffect(() => {
    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          // Most visitors are cleared without being asked anything, so there
          // is no reason to show them a box. The widget paints itself only
          // when Cloudflare actually wants an interaction.
          appearance: "interaction-only",
          callback: (token: string) => onVerify(token),
          "expired-callback": () => onExpire?.(),
          // Turnstile reports its own failures here — an invalid key, a
          // blocked script, no network. Without this the form would sit there
          // asking for a check that can never complete.
          "error-callback": (code?: string) => {
            onError?.(code);
            // Returning true keeps Turnstile from painting its own error box
            // and "Troubleshoot" link over the form; the form says it better.
            return true;
          },
        });
      })
      .catch(() => {
        // The script never loaded, so no token can ever arrive. Same outcome
        // as a widget error, and the form should say so rather than wait.
        if (!cancelled) onError?.("script-load-failed");
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        // A widget that already failed may be gone from Turnstile's registry.
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // Nothing left to remove.
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]);

  return <div ref={containerRef} />;
});
