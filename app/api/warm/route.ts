import { NextResponse } from "next/server";

import { BACKEND_URL } from "@/lib/backend";

/**
 * Wakes the backend so a submit doesn't have to.
 *
 * The API is hosted on a tier that spins the instance down after a spell of
 * inactivity, and the cold start costs about thirty seconds — long enough that
 * a visitor who presses "Send the brief" on a sleeping instance assumes the
 * form is broken. The forms call this as soon as someone starts typing, so the
 * wake overlaps the couple of minutes they spend writing instead of landing on
 * top of their submit.
 *
 * Nothing depends on the result: if the wake fails, the submit still goes
 * through on its own (slowly), so this answers 204 either way.
 */
export async function GET() {
  try {
    await fetch(`${BACKEND_URL}/health`, {
      method: "GET",
      cache: "no-store",
      signal: AbortSignal.timeout(60_000),
    });
  } catch {
    // A failed wake is not worth reporting — the submit is the real request.
  }

  return new NextResponse(null, { status: 204 });
}
