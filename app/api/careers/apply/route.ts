import { NextResponse, type NextRequest } from "next/server";

import { BACKEND_URL } from "@/lib/backend";

/**
 * Proxy onto the existing backend's /applications endpoint. Resumes arrive as
 * base64 data URLs inside the JSON body and are uploaded to Cloudinary by the
 * API, which is why this passes the body through untouched.
 */
export async function POST(request: NextRequest) {
  const body = await request.text();

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${BACKEND_URL}/applications`, {
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
