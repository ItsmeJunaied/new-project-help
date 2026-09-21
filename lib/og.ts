import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * Shared pieces for the generated Open Graph cards.
 *
 * These render at build time, so the font is read from the installed package
 * rather than fetched — a network call here would make every card generation a
 * point of failure in the build.
 */

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const FONT_DIR = join(process.cwd(), "node_modules", "geist", "dist", "fonts", "geist-sans");

export async function ogFonts() {
  const [medium, semibold] = await Promise.all([
    readFile(join(FONT_DIR, "Geist-Medium.ttf")),
    readFile(join(FONT_DIR, "Geist-SemiBold.ttf")),
  ]);

  return [
    { name: "Geist", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "Geist", data: semibold, weight: 600 as const, style: "normal" as const },
  ];
}

export const OG_COLORS = {
  background: "#151515",
  text: "#FFFDFB",
  muted: "#8A8A8A",
  accent: "#FF6D0C",
};

/** Long article titles need a smaller face or they overflow the card. */
export function ogTitleSize(title: string) {
  if (title.length > 90) return 52;
  if (title.length > 60) return 62;
  return 76;
}
