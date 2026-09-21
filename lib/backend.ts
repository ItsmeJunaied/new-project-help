/**
 * The existing Project Help API. The deployed service is the default so the
 * site works with no .env in place; set BACKEND_URL to point a deployment at a
 * local or staging API instead. Server-side only — never exposed to the client.
 */
export const BACKEND_URL =
  process.env.BACKEND_URL ?? "https://project-help-backend.onrender.com";
