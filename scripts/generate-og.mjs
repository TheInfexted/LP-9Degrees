// Generate the social share image (1200×630) for og:image / twitter:image.
// Composites the brand mark + headline + cyan accent on a Room Black canvas.
// Run with: node scripts/generate-og.mjs

import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(here, "..", "public");
const markPath = path.join(publicDir, "img", "logo-mark.png");
const outPath = path.join(publicDir, "og-image.png");

const W = 1200;
const H = 630;

// Brand-faithful palette (matches tokens.css)
const ROOM_BLACK = { r: 10, g: 15, b: 17 };
const CYAN = "#1ce8d3";
const STROBE = "#eef3f4";
const SMOKE = "#9aa5a8";

// Headline as SVG (rendered to raster by sharp)
// Using Helvetica/Arial as a system fallback since Geist isn't installed locally
// for sharp's text rendering. The result is bold + condensed enough to read on the card.
const headlineSvg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="20%" cy="100%" r="60%">
      <stop offset="0%" stop-color="${CYAN}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${CYAN}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="rgb(${ROOM_BLACK.r},${ROOM_BLACK.g},${ROOM_BLACK.b})"/>

  <!-- Atmospheric cyan glow at lower-left -->
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- Eyebrow (mono style) -->
  <text x="80" y="105"
        font-family="ui-monospace, 'SF Mono', Menlo, monospace"
        font-size="22"
        font-weight="500"
        letter-spacing="3.5"
        fill="${SMOKE}"
        text-transform="uppercase">
    NIGHTLIFE MARKETING · KUALA LUMPUR
  </text>

  <!-- Headline (3 lines, last word in cyan) -->
  <text x="80" y="240"
        font-family="-apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif"
        font-size="108"
        font-weight="900"
        letter-spacing="-3.5"
        fill="${STROBE}">
    We pack
  </text>
  <text x="80" y="358"
        font-family="-apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif"
        font-size="108"
        font-weight="900"
        letter-spacing="-3.5"
        fill="${STROBE}">
    the rooms
  </text>
  <text x="80" y="476"
        font-family="-apple-system, 'Helvetica Neue', Helvetica, Arial, sans-serif"
        font-size="108"
        font-weight="900"
        letter-spacing="-3.5"
        fill="${STROBE}">
    that run <tspan fill="${CYAN}">KL</tspan><tspan fill="${STROBE}">.</tspan>
  </text>

  <!-- Bottom strip -->
  <line x1="80" y1="540" x2="${W - 80}" y2="540"
        stroke="${STROBE}"
        stroke-opacity="0.12"
        stroke-width="1"/>

  <text x="80" y="585"
        font-family="ui-monospace, 'SF Mono', Menlo, monospace"
        font-size="20"
        font-weight="500"
        letter-spacing="2"
        fill="${SMOKE}">
    9 DEGREES · TREC, KL · WHATSAPP +60 12-404 4598
  </text>
</svg>
`;

// Composite: black canvas + cyan glow + brand mark on right + headline text on left
const markSize = 360;
const padded = await sharp(markPath)
  .resize(markSize, markSize, { fit: "contain", background: ROOM_BLACK })
  .toBuffer();

await sharp(Buffer.from(headlineSvg))
  .composite([
    {
      input: padded,
      left: W - markSize - 80,
      top: Math.floor((H - markSize) / 2) - 40,
    },
  ])
  .png({ compressionLevel: 9 })
  .toFile(outPath);

const m = await sharp(outPath).metadata();
console.log(`✓ og-image.png  ${m.width}x${m.height}  (${Math.round((m.size ?? 0) / 1024)}KB)`);
