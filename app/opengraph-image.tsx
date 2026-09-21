import { ImageResponse } from "next/og";

import { OG_COLORS, OG_CONTENT_TYPE, OG_SIZE, ogFonts } from "@/lib/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Site-wide social card. Any page without its own image inherits this one. */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: OG_COLORS.background,
          padding: "72px",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 20, height: 20, background: OG_COLORS.accent }} />
          <span style={{ fontSize: 28, fontWeight: 500, color: OG_COLORS.text, letterSpacing: -0.5 }}>
            {siteConfig.name}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <span
            style={{
              fontSize: 76,
              fontWeight: 600,
              color: OG_COLORS.text,
              lineHeight: 1.05,
              letterSpacing: -2.5,
              maxWidth: 940,
            }}
          >
            Custom software, engineered to scale.
          </span>
          <span style={{ fontSize: 30, fontWeight: 500, color: OG_COLORS.muted, maxWidth: 880, lineHeight: 1.35 }}>
            SaaS platforms, eCommerce systems, cloud infrastructure and AI/ML applications.
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span style={{ fontSize: 24, fontWeight: 500, color: OG_COLORS.muted }}>
            {siteConfig.url.replace("https://", "")}
          </span>
          <span style={{ fontSize: 24, fontWeight: 500, color: OG_COLORS.accent }}>
            {siteConfig.address.locality}, {siteConfig.address.countryName}
          </span>
        </div>
      </div>
    ),
    { ...size, fonts: await ogFonts() },
  );
}
