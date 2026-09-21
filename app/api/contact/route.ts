import { NextResponse, type NextRequest } from "next/server";

import { BACKEND_URL } from "@/lib/backend";

/**
 * Thin proxy onto the existing backend's /leads endpoint. Keeping the backend
 * origin server-side means the browser only ever talks to this app, so there is
 * no CORS setup and no way to read the API host out of the bundle.
 */
export async function POST(request: NextRequest) {
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
