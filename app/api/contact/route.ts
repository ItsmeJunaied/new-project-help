import { NextResponse, type NextRequest } from "next/server";

import { BACKEND_URL } from "@/lib/backend";

/* ------------------------------------------------------------------ */
/*  In-memory sliding-window rate limiter (per IP)                     */
/* ------------------------------------------------------------------ */

/** Max submissions allowed within the window. */
const RATE_LIMIT = 5;
/** Window length in milliseconds (15 minutes). */
const WINDOW_MS = 15 * 60 * 1000;

/** Map of IP → list of timestamps within the current window. */
const hits = new Map<string, number[]>();

/** Prune entries older than the window and return true if under the limit. */
function allowRequest(ip: string): boolean {
  const now = Date.now();
  const timestamps = hits.get(ip) ?? [];

  // Keep only timestamps inside the window.
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);

  if (recent.length >= RATE_LIMIT) {
    hits.set(ip, recent);
    return false;
  }

  recent.push(now);
  hits.set(ip, recent);
  return true;
}

// Periodically flush stale entries so the map doesn't grow unbounded.
// Runs every 30 minutes — lightweight and self-cleaning.
if (typeof globalThis !== "undefined") {
  const CLEANUP_INTERVAL = 30 * 60 * 1000;
  const key = "__contact_rate_limit_cleanup__";
  if (!(globalThis as Record<string, unknown>)[key]) {
    (globalThis as Record<string, unknown>)[key] = setInterval(() => {
      const now = Date.now();
      for (const [ip, timestamps] of hits) {
        const recent = timestamps.filter((t) => now - t < WINDOW_MS);
        if (recent.length === 0) hits.delete(ip);
        else hits.set(ip, recent);
      }
    }, CLEANUP_INTERVAL);
  }
}

/* ------------------------------------------------------------------ */
/*  Route handler                                                      */
/* ------------------------------------------------------------------ */

/**
 * Thin proxy onto the existing backend's /leads endpoint. Keeping the backend
 * origin server-side means the browser only ever talks to this app, so there is
 * no CORS setup and no way to read the API host out of the bundle.
 *
 * Rate-limited to 5 submissions per IP per 15-minute window.
 */
export async function POST(request: NextRequest) {
  // Resolve the client IP — works on Vercel and behind most reverse proxies.
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip") ?? "unknown";

  if (!allowRequest(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes before trying again." },
      { status: 429 },
    );
  }

  const body = await request.text();

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${BACKEND_URL}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
  } catch {
    return NextResponse.json({ error: "Could not reach the API" }, { status: 502 });
  }

  const data = await backendResponse.json().catch(() => null);

  if (!backendResponse.ok) {
    return NextResponse.json(
      { error: data?.message ?? "Request failed" },
      { status: backendResponse.status },
    );
  }

  return NextResponse.json({ ok: true });
}
