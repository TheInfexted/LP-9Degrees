// One-shot: prepare logo assets from the source files in public/img/.
//
// Inputs (any of these may be present):
//   logo.png       — original cyan-only export from earlier (kept for reference)
//   logo-full.png  — full brand lockup, white faceted "9" + cyan stripe + NINE° text
//
// Outputs:
//   logo-trim.png        — cyan-only mark, transparent bg, tightly trimmed (used as fallback)
//   logo-full-trim.png   — full lockup, tightly trimmed, black canvas preserved
//   logo-mark.png        — just the faceted "9" mark from the full lockup, trimmed
//   ../favicon-32.png    — favicon for browser tabs (32×32)
//   ../favicon-192.png   — favicon for Android home screens (192×192)
//   ../apple-touch-icon.png — iOS home-screen icon (180×180)
//
// Run with: node scripts/process-logo.mjs

import sharp from "sharp";
import path from "node:path";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const imgDir = path.join(here, "..", "public", "img");

const WHITE_THRESHOLD = 235;
const BLACK_THRESHOLD = 30;

async function processCyanOnly(srcPath, outPath) {
  const { data, info } = await sharp(srcPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const px = new Uint8ClampedArray(data);
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i], g = px[i + 1], b = px[i + 2];
    if (r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD) {
      px[i + 3] = 0;
    } else {
      const luma = (r + g + b) / 3;
      if (luma > 200) {
        const t = (luma - 200) / (WHITE_THRESHOLD - 200);
        px[i + 3] = Math.round(255 * (1 - Math.min(1, t)));
      }
    }
  }

  await sharp(Buffer.from(px), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 })
    .toFile(outPath);

  const m = await sharp(outPath).metadata();
  console.log(`✓ ${path.basename(outPath)}  ${m.width}x${m.height}`);
}

async function findContentBBox(srcPath) {
  // Find the bounding box of pixels that are not pure black.
  const { data, info } = await sharp(srcPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const w = info.width, h = info.height;
  let minX = w, minY = h, maxX = 0, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      if (r > BLACK_THRESHOLD || g > BLACK_THRESHOLD || b > BLACK_THRESHOLD) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  return {
    left: minX,
    top: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    raw: { data, w, h },
  };
}

async function processFullLogo(srcPath) {
  const bbox = await findContentBBox(srcPath);
  console.log(`  full content bbox: ${bbox.left},${bbox.top} ${bbox.width}x${bbox.height}`);

  // Full trimmed lockup
  const fullOut = path.join(imgDir, "logo-full-trim.png");
  await sharp(srcPath)
    .extract({
      left: bbox.left,
      top: bbox.top,
      width: bbox.width,
      height: bbox.height,
    })
    .png({ compressionLevel: 9 })
    .toFile(fullOut);
  const fm = await sharp(fullOut).metadata();
  console.log(`✓ ${path.basename(fullOut)}  ${fm.width}x${fm.height}`);

  // Find the mark-vs-text gap: scan rows in the trimmed area looking for
  // the longest run of black-ish rows.
  const { data, w } = bbox.raw;
  const rowHasContent = [];
  for (let y = bbox.top; y < bbox.top + bbox.height; y++) {
    let any = false;
    for (let x = bbox.left; x < bbox.left + bbox.width; x++) {
      const i = (y * w + x) * 4;
      if (data[i] > BLACK_THRESHOLD || data[i + 1] > BLACK_THRESHOLD || data[i + 2] > BLACK_THRESHOLD) {
        any = true;
        break;
      }
    }
    rowHasContent.push(any);
  }
  // Find the longest empty (no-content) run in the middle 60% of the bbox
  const startSearch = Math.floor(rowHasContent.length * 0.45);
  const endSearch = Math.floor(rowHasContent.length * 0.85);
  let bestRun = { start: -1, length: 0 };
  let curStart = -1;
  for (let i = startSearch; i < endSearch; i++) {
    if (!rowHasContent[i]) {
      if (curStart === -1) curStart = i;
    } else {
      if (curStart !== -1) {
        const len = i - curStart;
        if (len > bestRun.length) bestRun = { start: curStart, length: len };
        curStart = -1;
      }
    }
  }
  if (curStart !== -1) {
    const len = endSearch - curStart;
    if (len > bestRun.length) bestRun = { start: curStart, length: len };
  }

  if (bestRun.length > 8) {
    // Crop the mark = rows 0..bestRun.start within the trimmed bbox
    const markHeight = bestRun.start; // local to bbox.top
    const markOut = path.join(imgDir, "logo-mark.png");
    await sharp(srcPath)
      .extract({
        left: bbox.left,
        top: bbox.top,
        width: bbox.width,
        height: markHeight,
      })
      .png({ compressionLevel: 9 })
      .toFile(markOut);
    const mm = await sharp(markOut).metadata();
    console.log(`✓ ${path.basename(markOut)}  ${mm.width}x${mm.height} (gap row ${bestRun.start}, gap height ${bestRun.length})`);
  } else {
    console.log(`! could not find clear mark/text gap, skipping logo-mark.png`);
  }
}

const cyanSrc = path.join(imgDir, "logo.png");
const fullSrc = path.join(imgDir, "logo-full.png");

if (existsSync(cyanSrc)) {
  console.log(`processing ${path.basename(cyanSrc)}…`);
  await processCyanOnly(cyanSrc, path.join(imgDir, "logo-trim.png"));
}

if (existsSync(fullSrc)) {
  console.log(`processing ${path.basename(fullSrc)}…`);
  await processFullLogo(fullSrc);
  await generateFavicons(path.join(imgDir, "logo-mark.png"));
}

async function generateFavicons(markPath) {
  // Square the mark with brand-black padding so the cyan stripe isn't cropped.
  const m = await sharp(markPath).metadata();
  const dim = Math.max(m.width, m.height);
  const padded = await sharp(markPath)
    .extend({
      top: Math.floor((dim - m.height) / 2),
      bottom: Math.ceil((dim - m.height) / 2),
      left: Math.floor((dim - m.width) / 2),
      right: Math.ceil((dim - m.width) / 2),
      background: { r: 10, g: 15, b: 17 }, // Room Black
    })
    .toBuffer();

  const publicDir = path.join(imgDir, "..");
  const sizes = [
    { name: "favicon-32.png", px: 32 },
    { name: "favicon-192.png", px: 192 },
    { name: "apple-touch-icon.png", px: 180 },
  ];
  for (const s of sizes) {
    const out = path.join(publicDir, s.name);
    await sharp(padded)
      .resize(s.px, s.px, { kernel: "lanczos3" })
      .png({ compressionLevel: 9 })
      .toFile(out);
    console.log(`✓ ${s.name}  ${s.px}x${s.px}`);
  }
}
