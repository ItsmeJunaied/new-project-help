import type { NextConfig } from "next";

import { legacyRedirects } from "./lib/redirects";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,

  experimental: {
    // The whole stylesheet is ~13 KB of Tailwind, and it was the only
    // render-blocking request on the page. Inlining it into <head> removes that
    // round trip entirely, which is the trade-off this flag is documented for
    // (atomic CSS, first-visit paint) — see next/docs .../inlineCss.md.
    inlineCss: true,
  },

  images: {
    // Blog covers and inline post images are uploaded to Cloudinary from the
    // admin, so they arrive as remote URLs rather than files in /public.
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
    // Modern formats first; Next falls back to the original for older clients.
    formats: ["image/avif", "image/webp"],
    // The design uses a 1440 canvas, so the widest breakpoint we ever need is
    // 1920 — trimming the default list avoids generating variants nothing asks
    // for. `qualities` must list every value passed to <Image quality>.
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    qualities: [75],
    minimumCacheTTL: 31_536_000,
  },

  // Everything the live site has indexed under its old URLs. Without these the
  // swap silently 404s every ranked page — see lib/redirects.ts.
  async redirects() {
    return legacyRedirects();
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          // Ignored over http, so it only takes effect on the deployed site.
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          // Deliberately not a script-src policy: a nonce-based one needs
          // middleware on every request, which would make these prerendered
          // pages dynamic. This covers the injection vectors that cost nothing
          // — framing, plugins and <base> rewriting.
          {
            key: "Content-Security-Policy",
            value: "base-uri 'self'; object-src 'none'; frame-ancestors 'self'",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
