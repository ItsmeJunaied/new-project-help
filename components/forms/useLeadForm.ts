"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { trackLead } from "@/lib/analytics";
import type { TurnstileHandle } from "@/components/ui/Turnstile";

export type LeadStatus = "idle" | "sending" | "sent" | "error";

const REQUIRED_MESSAGE = "Please fill in your name, email and project details.";
const FAILED_MESSAGE =
  "We couldn't send that. Please try again, or email hello@projecthelpbd.com.";
const CAPTCHA_MESSAGE = "Please complete the verification check before submitting.";
const CAPTCHA_MISSING_MESSAGE =
  "The verification check isn't available right now, so the form can't be sent. Please email hello@projecthelpbd.com and we'll pick it up from there.";
const SLOW_MESSAGE =
  "The API didn't answer in time. Please try once more, or email hello@projecthelpbd.com.";

/**
 * Generous enough to cover a backend cold start (around thirty seconds on the
 * current hosting tier) plus the upload of three attachments, while still
 * ending in a message rather than a spinner that never stops.
 */
const SUBMIT_TIMEOUT_MS = 75_000;

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export const MAX_ATTACHMENTS = 3;
export const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024;

function value(data: FormData, key: string) {
  return String(data.get(key) ?? "").trim();
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Shared submit behaviour for both contact forms. The two forms are drawn
 * differently, so this owns only the parts that must not diverge: the payload
 * shape the backend expects, the honeypot, the bot check, attachments, and the
 * sending/sent/error states.
 */
export function useLeadForm() {
  const [status, setStatus] = useState<LeadStatus>("idle");
  const [error, setError] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);
  const warmedRef = useRef(false);

  const reset = useCallback(() => {
    setStatus("idle");
    setError("");
  }, []);

  // The backend sleeps when idle and takes about half a minute to come back,
  // which would otherwise be half a minute of the visitor staring at
  // "Sending…". Waking it as soon as a page carrying the form renders puts
  // that boot under the scroll, the read and the writing — all of which come
  // before anyone can press send — rather than on top of the submit.
  //
  // Nothing waits on it and nothing reads the result: a failed wake just
  // leaves the submit to take the slow path on its own.
  const warm = useCallback(() => {
    if (warmedRef.current) return;
    warmedRef.current = true;
    void fetch("/api/warm", { method: "GET", cache: "no-store" }).catch(() => {});
  }, []);

  useEffect(() => {
    warm();
  }, [warm]);

  const addFiles = useCallback(
    (selected: File[]) => {
      if (selected.length === 0) return;

      if (files.length + selected.length > MAX_ATTACHMENTS) {
        setStatus("error");
        setError(`You can attach up to ${MAX_ATTACHMENTS} files.`);
        return;
      }

      const oversized = selected.find((file) => file.size > MAX_ATTACHMENT_BYTES);
      if (oversized) {
        setStatus("error");
        setError(`"${oversized.name}" is over 4 MB. Please attach a smaller file.`);
        return;
      }

      setStatus("idle");
      setError("");
      setFiles((current) => [...current, ...selected]);
    },
    [files.length],
  );

  const removeFile = useCallback((index: number) => {
    setFiles((current) => current.filter((_, i) => i !== index));
  }, []);

  const submit = useCallback(
    async (form: HTMLFormElement) => {
      const data = new FormData(form);

      // Honeypot: a real visitor never fills a field they cannot see, so a bot
      // gets the success state without anything reaching the API.
      if (value(data, "website")) {
        form.reset();
        setFiles([]);
        setStatus("sent");
        return;
      }

      const name = value(data, "name");
      const email = value(data, "email");
      const message = value(data, "message");

      if (!name || !email || !message) {
        setStatus("error");
        setError(REQUIRED_MESSAGE);
        return;
      }

      // The backend verifies every token and rejects anything it cannot check,
      // so a missing site key is a broken form rather than a form without a
      // bot check. Say so plainly instead of sending a request that is certain
      // to come back as "Captcha verification failed".
      if (!TURNSTILE_SITE_KEY) {
        setStatus("error");
        setError(CAPTCHA_MISSING_MESSAGE);
        return;
      }

      if (!captchaToken) {
        setStatus("error");
        setError(CAPTCHA_MESSAGE);
        return;
      }

      setStatus("sending");
      setError("");

      try {
        const params = new URLSearchParams(window.location.search);

        const attachments = await Promise.all(
          files.map(async (file) => ({
            dataUrl: await readAsDataUrl(file),
            fileName: file.name,
            fileType: file.type,
            size: file.size,
          })),
        );

        const source = window.location.pathname;

        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(SUBMIT_TIMEOUT_MS),
          body: JSON.stringify({
            name,
            email,
            message,
            phone: value(data, "phone") || undefined,
            company: value(data, "company") || undefined,
            service: value(data, "service") || undefined,
            budget: value(data, "budget") || undefined,
            captchaToken,
            attachments: attachments.length ? attachments : undefined,
            source,
            utmSource: params.get("utm_source") ?? undefined,
            utmMedium: params.get("utm_medium") ?? undefined,
            utmCampaign: params.get("utm_campaign") ?? undefined,
            referer: document.referrer || undefined,
          }),
        });

        if (!response.ok) {
          // The API's own message is far more useful than "something went
          // wrong" — a rejected bot check and an unreachable database read
          // very differently to whoever has to diagnose it.
          const payload = (await response.json().catch(() => null)) as {
            error?: string | string[];
          } | null;
          const detail = Array.isArray(payload?.error) ? payload.error[0] : payload?.error;
          throw new Error(typeof detail === "string" && detail ? detail : "");
        }

        form.reset();
        setFiles([]);
        setStatus("sent");
        trackLead(source);
      } catch (cause) {
        setStatus("error");
        if (cause instanceof DOMException && cause.name === "TimeoutError") {
          setError(SLOW_MESSAGE);
        } else {
          setError(cause instanceof Error && cause.message ? cause.message : FAILED_MESSAGE);
        }
      } finally {
        // A Turnstile token is single-use, so a second submit from the same
        // page needs a fresh one whether the first succeeded or not.
        setCaptchaToken(null);
        turnstileRef.current?.reset();
      }
    },
    [captchaToken, files],
  );

  return {
    status,
    error,
    submit,
    reset,
    files,
    addFiles,
    removeFile,
    setCaptchaToken,
    turnstileRef,
  };
}
