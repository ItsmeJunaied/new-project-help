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
        // The tune is the largest thing the page fetches and it never changes,
        // yet it was going out under the default `max-age=0, must-revalidate`
        // — re-checked on every single visit. On a slow connection that is the
        // difference between the tune arriving and the visitor giving up on it.
        //
        // `immutable` is a promise about this exact path, and the filename
        // carries no content hash to break that promise for us: replacing the
        // audio means giving it a NEW filename, or year-old copies will keep
        // playing in browsers that already have one.
        source: "/audio/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // The films, on the same terms and for the same reason. Next serves
        // everything in /public with `max-age=0`, so 15MB of video was being
        // re-validated on every repeat visit — the showreel loop alone runs on
        // the home page, the footer of every page, and nothing was keeping it.
        //
        // Same promise as the audio above, and the same obligation with it:
        // `immutable` is about this exact path, and these filenames carry no
        // content hash, so a re-cut film needs a NEW name or the browsers
        // holding the old one will never ask again.
        source: "/videos/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Photographs and icons served straight from /public — the ones that
        // do not go through next/image, which sets its own headers off
        // minimumCacheTTL.
        //
        // A month rather than a year, and deliberately NOT immutable: these
        // are the files most likely to be corrected in place, and a wrong
        // photograph that cannot be recalled for a year is a worse problem
        // than a monthly revalidation. `stale-while-revalidate` means the
        // month's end costs a visitor nothing — they get the held copy while
        // the new one is fetched behind them.
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/icons/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
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
