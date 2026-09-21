"use client";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Conversion events. Both scripts are optional — with no IDs configured these
 * are no-ops, so a page never breaks because analytics is switched off.
 */
export function trackLead(source: string) {
  if (typeof window === "undefined") return;

  window.gtag?.("event", "generate_lead", { source });
  window.fbq?.("track", "Lead", { source });
}

/** Someone opened the Calendly scheduler — the other half of the lead funnel. */
export function trackScheduleClick(source: string) {
  if (typeof window === "undefined") return;

  window.gtag?.("event", "schedule_click", { source });
  window.fbq?.("track", "Schedule", { source });
}

export function trackNewsletterSignup(source: string) {
  if (typeof window === "undefined") return;

  window.gtag?.("event", "newsletter_signup", { source });
  window.fbq?.("track", "Subscribe", { source });
}

export function trackApplication(jobSlug: string) {
  if (typeof window === "undefined") return;

  window.gtag?.("event", "job_application", { job: jobSlug });
}
