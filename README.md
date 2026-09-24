# Project Help

Marketing site for Project Help, built with Next.js, Tailwind v4 and GSAP.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

A fresh clone is complete — every image, the audio and the source material the
generated assets come from are all in the repo. There is no separate asset
download step.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run check:brand` | Fails if the brand colour has drifted (see below) |
| `npm run build:icons` | Regenerates the browser-tab icons from the logo |

## The brand colour

`#86D52A` is declared in exactly two places, because the browser and the build
need it in different forms:

- **`app/globals.css`** — `--color-primary-green`. This drives everything
  rendered in a browser: all the Tailwind utilities (`bg-primary-green`,
  `text-primary-green`, …), the inline logo and the audio waveform.
- **`lib/brand.ts`** — `BRAND_GREEN`. Only for the two places with no
  stylesheet to read: the build-time OG image and the Calendly URL, which takes
  the hex as a query parameter.

To change it, edit both and run `npm run build:icons`. `npm run check:brand`
enforces all of that — it fails if the two disagree, if the hex is hardcoded
anywhere else, or if the tab icons were generated from an older colour.

## The logo

`components/ui/Logo.tsx` is the lockup, inline rather than an image file so its
two colours come from CSS: the ink is `currentColor` (black in the header, white
in the footer) and the green is the token. The artwork it was built from is
`assets/brand/logo-source-vector.svg`.

The tab icons (`app/favicon.ico`, `app/icon.svg`, `app/apple-icon.png`) are
generated from that same artwork by `npm run build:icons`, using the arrow mark
alone — the full lockup is unreadable at 16px.

## Case-study images

`public/images/case/` holds 104 images, 8 per case study, at the export sizes in
the brief. They are generated, not hand-placed:

```bash
node scripts/case-images/resize.js           # dry run
node scripts/case-images/resize.js --write   # write public/images/case/
```

It reads `assets/case-study-sources/` (the original renders, plus
`PH Images.xlsx`, the brief mapping every image to its slot) and
`scripts/case-images/mapping.json`, which records which source file belongs in
which slot. `mapping.csv` is the same thing in a readable form.

The originals are ~200 MB and in the repo on purpose, so the images can be
re-cropped or re-exported from any clone.

## Background audio

`components/ui/AmbientAudio.tsx` — a small waveform and play/pause control at
bottom-left, playing "Ethereal Cinematic" by leberch (Pixabay licence,
commercial use, no attribution required).

Two behaviours worth knowing before changing it:

- Browsers block audio until the visitor interacts with the page, so the stored
  preference defaults to on but playback only begins on the first click, key
  press or touch. The button always shows what is actually happening.
- The audio stops whenever the page is not in front of the visitor — another
  tab, a minimised window, navigating away, or the back/forward cache. This does
  not touch the stored preference, so returning resumes and an explicit pause is
  never undone.

To use a different track, drop it in `public/audio/` and update `SOURCES`. Level
lives in the file, not in the code: the current one is normalised to about
-28 LUFS.

## Layout

```
app/              routes, metadata, tab icons
components/
  sections/       page sections
  ui/             logo, audio player, shared controls
lib/              case studies, services, brand, SEO helpers
public/           images, icons, audio
assets/           source material the generated assets come from
scripts/          asset generation and the brand-colour check
```
