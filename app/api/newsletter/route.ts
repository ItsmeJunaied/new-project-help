import { NextResponse, type NextRequest } from "next/server";

import { BACKEND_URL } from "@/lib/backend";

/**
 * Proxy onto the existing backend's /newsletter endpoint, same shape as
 * /api/contact: the API origin stays server-side, so the browser only ever
 * talks to this app and there is no CORS setup to keep in sync.
 */
export async function POST(request: NextRequest) {
  const body = await request.text();

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${BACKEND_URL}/newsletter`, {
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
