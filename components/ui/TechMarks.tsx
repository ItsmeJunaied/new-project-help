import { TECH_ART, type GeneratedTechName } from "@/components/ui/tech-mark-art";

/**
 * The technology marks used by the stack section, the about page and the
 * company profile deck.
 *
 * These are the vendors' own logos, in full colour, generated into
 * tech-mark-art.ts from the SVG Logos collection — see
 * scripts/build-tech-marks.mjs. They replaced a set of hand-drawn
 * approximations that read as homemade the moment anything rendered them above
 * about 24px.
 *
 * Drawn once per page and referenced after that. The stack section alone puts a
 * mark on screen around two hundred times (the drifting band repeats itself
 * three times over two rows), and 87KB of artwork inlined at each of those
 * would be most of the page. So a sprite of <g> definitions goes in once and
 * every mark is a <use> pointing at it.
 */

export type TechName = GeneratedTechName;

/** Namespaced so the ids cannot collide with anything else on the page. */
const SPRITE_ID = (name: TechName) => `tech-mark-${name}`;

export function techLabel(name: TechName) {
  return TECH_ART[name].label;
}

/**
 * The definitions. Rendered once by each section that draws marks — never by
 * the layout, because the artwork is far too heavy to put on pages that show
 * none of it. Two sections on one page would repeat the ids, which is untidy
 * but harmless: the definitions are identical, so the first one wins and every
 * mark still resolves.
 */
export function TechMarkSprite({ names }: { names?: readonly TechName[] } = {}) {
  const marks = names ?? (Object.keys(TECH_ART) as TechName[]);

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute size-0 overflow-hidden"
    >
      <defs>
        {Array.from(new Set(marks)).map((name) => (
          <g
            key={name}
            id={SPRITE_ID(name)}
            // Static, generated artwork — never anything a visitor supplied.
            dangerouslySetInnerHTML={{ __html: TECH_ART[name].body }}
          />
        ))}
      </defs>
    </svg>
  );
}

/**
 * One mark, sized by area rather than by its bounding box.
 *
 * Logos are not all square: MongoDB's leaf is twice as tall as it is wide, the
 * AWS mark is a wordmark nearly twice as wide as it is tall. Fitting each one
 * inside a square leaves the wide ones looking shrunken next to the square ones,
 * because the eye reads area, not width. So the viewBox is a square of side
 * sqrt(w*h) centred on the artwork: every mark ends up covering the same amount
 * of ink, and the long axis is allowed to hang outside the box.
 *
 * No `fill` on this element. `fill` inherits, and several of these logos are
 * drawn as a bare silhouette with no fill of their own — setting one here made
 * Rust, Vercel, Framer, Prisma and OpenAI render as five empty tiles.
 */
export default function TechMark({
  name,
  className = "",
}: {
  name: TechName;
  className?: string;
}) {
  const art = TECH_ART[name];
  const side = Math.sqrt(art.width * art.height);

  return (
    <svg
      viewBox={`${(art.width - side) / 2} ${(art.height - side) / 2} ${side} ${side}`}
      aria-hidden="true"
      focusable="false"
      style={art.tint ? { color: art.tint } : undefined}
      className={`overflow-visible ${className}`}
    >
      <use href={`#${SPRITE_ID(name)}`} fill="currentColor" />
    </svg>
  );
}
