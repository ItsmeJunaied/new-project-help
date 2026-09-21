"use client";

import { useCallback, useRef, useState } from "react";

import { trackLead } from "@/lib/analytics";
import type { TurnstileHandle } from "@/components/ui/Turnstile";

export type LeadStatus = "idle" | "sending" | "sent" | "error";

const REQUIRED_MESSAGE = "Please fill in your name, email and project details.";
const FAILED_MESSAGE =
  "We couldn't send that. Please try again, or email hello@projecthelpbd.com.";
const CAPTCHA_MESSAGE = "Please complete the verification check before submitting.";

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

  const reset = useCallback(() => {
    setStatus("idle");
    setError("");
  }, []);

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

      // Only enforced where a site key is configured; with Turnstile switched
      // off the backend skips verification too, so the form still works.
      if (TURNSTILE_SITE_KEY && !captchaToken) {
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
          body: JSON.stringify({
            name,
            email,
            message,
            phone: value(data, "phone") || undefined,
            company: value(data, "company") || undefined,
            service: value(data, "service") || undefined,
            budget: value(data, "budget") || undefined,
            // The backend requires the field even where no bot check runs.
            captchaToken: captchaToken ?? "turnstile-not-configured",
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
        setError(cause instanceof Error && cause.message ? cause.message : FAILED_MESSAGE);
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
