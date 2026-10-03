import { NextResponse, type NextRequest } from "next/server";

/**
 * A small in-memory rate limiter for the write endpoints.
 *
 * With the Turnstile check gone this and the honeypot are what stand between
 * the forms and a script, so the limits below are set well above anything a
 * real visitor sending one brief will reach and well below what makes a public
 * form worth hammering.
 *
 * It counts inside the Node process, which has two consequences worth knowing
 * before trusting it with more than it can carry: the limits are enforced per
 * instance rather than across a fleet, and a cold start begins with an empty
 * table. For this site's traffic that is the right trade — it stops the
 * runaway script and the stuck retry loop without a Redis to keep alive. If a
 * limit ever has to hold across instances, this is the only file to replace;
 * the routes call it the same way either way.
 */

type Rule = { limit: number; windowMs: number };

/** Per-endpoint budgets, each counted separately for each caller. */
export const LIMITS = {
  // A brief, a correction, and one more in case the first two went astray.
  contact: { limit: 3, windowMs: 10 * 60_000 },
  // Applications carry a résumé, so they are the most expensive to accept and
  // the least likely to be sent in a burst.
  careers: { limit: 3, windowMs: 60 * 60_000 },
  // One signup is enough; the rest of the allowance is for typos.
  newsletter: { limit: 5, windowMs: 60 * 60_000 },
} as const satisfies Record<string, Rule>;

/** The longest window above — how long an idle entry stays worth keeping. */
const MAX_WINDOW_MS = Math.max(...Object.values(LIMITS).map((r) => r.windowMs));

/**
 * Past request times, newest last, keyed by endpoint and caller. Bounded by
 * the sweep below so a forged `x-forwarded-for` cannot grow it without end.
 */
const hits = new Map<string, number[]>();
const MAX_TRACKED_KEYS = 20_000;

function sweep(now: number) {
  for (const [key, times] of hits) {
    if (times.length === 0 || times[times.length - 1] <= now - MAX_WINDOW_MS) {
      hits.delete(key);
    }
  }
}

/**
 * Who is calling, as well as we can tell from behind a proxy. `NextRequest.ip`
 * was removed in Next 15, so the forwarding headers are all that is left.
 *
 * The left-most `x-forwarded-for` entry is the client as the nearest proxy saw
 * it. It is trivially forged, which is the honest limit of this whole file: it
 * slows down the lazy script, not a determined one. Local requests carry
 * neither header and all share the "local" bucket — only ever you, in dev.
 */
export function callerKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  if (first) return first;

  return request.headers.get("x-real-ip")?.trim() || "local";
}

export type RateLimitVerdict = { allowed: true } | { allowed: false; retryAfter: number };

/** Records one request against `name`'s budget and says whether it may pass. */
export function rateLimit(request: NextRequest, name: keyof typeof LIMITS): RateLimitVerdict {
  const { limit, windowMs } = LIMITS[name];
  const now = Date.now();

  if (hits.size > MAX_TRACKED_KEYS) sweep(now);

  const key = `${name}:${callerKey(request)}`;
  const recent = (hits.get(key) ?? []).filter((time) => time > now - windowMs);

  if (recent.length >= limit) {
    // Keep the window sliding: the caller waits out the oldest hit in it, and
    // the refused attempt is deliberately not recorded, so hammering the
    // endpoint cannot push its own wait further away.
    hits.set(key, recent);
    const retryAfter = Math.ceil((recent[0] + windowMs - now) / 1000);
    return { allowed: false, retryAfter: Math.max(retryAfter, 1) };
  }

  recent.push(now);
  hits.set(key, recent);
  return { allowed: true };
}

/**
 * The refusal, in the shape the forms already read: they show `error` verbatim
 * when a response is not ok, so this speaks to the visitor rather than to the
 * log. `Retry-After` is there for anything automated that cares to listen.
 */
export function tooManyRequests(retryAfter: number) {
  const minutes = Math.ceil(retryAfter / 60);
  const wait = minutes <= 1 ? "a minute" : `${minutes} minutes`;

  return NextResponse.json(
    {
      error: `That's a few too many in a short time. Please try again in ${wait}, or email hello@projecthelpbd.com.`,
    },
    { status: 429, headers: { "Retry-After": String(retryAfter) } },
  );
}
