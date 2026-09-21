import { NextResponse, type NextRequest } from "next/server";

import { BACKEND_URL } from "@/lib/backend";

/**
 * Proxy onto the backend's newsletter opt-out.
 *
 * Always answers 200 on a reachable backend, even for an address that was never
 * subscribed: telling the caller "not on the list" would turn this into a way
 * to check whether a given person is.
 */
export async function POST(request: NextRequest) {
  const body = await request.text();

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${BACKEND_URL}/newsletter/unsubscribe`, {
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
