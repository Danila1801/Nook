/**
 * Build ritual illustrations: raw-illustrations/*.png -> public/illustrations/*.webp
 *
 * The generated source images each carry their own textured cream paper
 * background, and no two match. Measured corner tones across the current set
 * ranged from #ECE9C8 to #F7F0DC — all yellower than the app canvas (#F4EEE3).
 * Dropped onto the page as-is they read as pasted stickers with a visible
 * square edge, and they don't match each other either.
 *
 * The previous version called .trim() to crop the paper away, but trim needs a
 * uniform background to find a bounding box — on a textured one it finds
 * nothing and silently no-ops. That is why the frames and the generator
 * watermark both survived into production.
 *
 * This fixes it at the asset level rather than papering over it in CSS:
 *
 *   1. SAMPLE       measure each image's own paper tone from its corners
 *   2. NEUTRALISE   per-channel linear correction mapping that tone to canvas
 *   3. DEWATERMARK  cover the generator's corner sparkle with matched paper
 *   4. FEATHER      bake a soft alpha edge so the frame dissolves into the page
 *   5. ENCODE       WebP with alpha
 *
 * Once illustrations are regenerated on a genuinely flat background (see
 * docs/asset-prompts/01-illustrations-gemini.md), steps 2-3 become near no-ops
 * and the images arrive already correct.
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC_DIR = 'raw-illustrations';
const OUT_DIR = 'public/illustrations';

const MAX_WIDTH = 900;
const QUALITY = 86;

/** App canvas — must stay in sync with --canvas in src/styles/tokens.css */
const CANVAS = { r: 0xf4, g: 0xee, b: 0xe3 };

/** Feather width as a fraction of the image edge. */
const FEATHER = 0.07;

/**
 * Generators stamp a small sparkle glyph near the bottom-right corner.
 * Position and radius as a fraction of image size.
 */
const WATERMARK = { x: 0.872, y: 0.868, r: 0.055 };

if (!fs.existsSync(SRC_DIR)) {
  console.log(`No ${SRC_DIR}/ directory. Skipping illustration build.`);
  process.exit(0);
}

const entries = fs.readdirSync(SRC_DIR).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));

if (entries.length === 0) {
  console.log(`No source images in ${SRC_DIR}/. Skipping.`);
  process.exit(0);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

/** Mean colour of four corner patches — that's the paper, not the subject. */
async function samplePaper(file, width, height) {
  const patch = Math.max(8, Math.round(Math.min(width, height) * 0.04));
  const inset = Math.round(patch * 0.5);
  const corners = [
    { left: inset, top: inset },
    { left: width - patch - inset, top: inset },
    { left: inset, top: height - patch - inset },
    { left: width - patch - inset, top: height - patch - inset },
  ];

  const sums = [0, 0, 0];
  for (const c of corners) {
    const { channels } = await sharp(file)
      .extract({ ...c, width: patch, height: patch })
      .stats();
    for (let i = 0; i < 3; i++) sums[i] += channels[i].mean;
  }
  return sums.map((s) => s / corners.length);
}

/** Mean colour of one square patch, centred on (cx, cy). */
async function samplePatchColour(input, cx, cy, size) {
  const half = Math.max(2, Math.round(size / 2));
  const { channels } = await sharp(input)
    .extract({ left: Math.max(0, cx - half), top: Math.max(0, cy - half), width: half * 2, height: half * 2 })
    .stats();
  return channels.slice(0, 3).map((c) => c.mean);
}

/**
 * Soft-edged alpha mask: opaque in the middle, feathering to transparent at
 * every edge. A rounded rect rather than an ellipse, so a full standing figure
 * keeps its head and feet — an elliptical mask clips them.
 */
function featherMaskSvg(width, height) {
  const fx = Math.round(width * FEATHER);
  const fy = Math.round(height * FEATHER);
  const blur = Math.round(Math.min(fx, fy) * 0.75);
  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
       <defs><filter id="f" x="-20%" y="-20%" width="140%" height="140%">
         <feGaussianBlur stdDeviation="${blur}" />
       </filter></defs>
       <rect x="${fx}" y="${fy}"
             width="${width - fx * 2}" height="${height - fy * 2}"
             rx="${Math.round(Math.min(fx, fy) * 1.5)}"
             fill="#fff" filter="url(#f)" />
     </svg>`
  );
}

/** A soft paper-coloured disc to cover the generator watermark. */
function watermarkPatchSvg(width, height, paperHex) {
  const cx = Math.round(width * WATERMARK.x);
  const cy = Math.round(height * WATERMARK.y);
  const r = Math.round(Math.min(width, height) * WATERMARK.r);
  return Buffer.from(
    `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
       <defs><radialGradient id="g">
         <stop offset="0%"   stop-color="${paperHex}" stop-opacity="1" />
         <stop offset="62%"  stop-color="${paperHex}" stop-opacity="1" />
         <stop offset="100%" stop-color="${paperHex}" stop-opacity="0" />
       </radialGradient></defs>
       <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#g)" />
     </svg>`
  );
}

const toHex = (c) =>
  '#' +
  c.map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('');

let totalBytes = 0;

for (const file of entries) {
  const src = path.join(SRC_DIR, file);
  const base = path.basename(file, path.extname(file));
  const out = path.join(OUT_DIR, `${base}.webp`);

  const meta = await sharp(src).metadata();
  const paper = await samplePaper(src, meta.width, meta.height);

  // 2. NEUTRALISE. Scale each channel so the measured paper lands exactly on
  //    the canvas colour. Multiplier-only (no offset) keeps ink dark and
  //    preserves relative tone inside the figure. Paper is the brightest thing
  //    in frame, so nothing clips.
  const gain = [
    CANVAS.r / Math.max(1, paper[0]),
    CANVAS.g / Math.max(1, paper[1]),
    CANVAS.b / Math.max(1, paper[2]),
  ];

  const corrected = await sharp(src).linear(gain, [0, 0, 0]).toColorspace('srgb').toBuffer();

  // 3. DEWATERMARK at source resolution, so the patch edge stays soft.
  //    Match the paper immediately beside the watermark rather than the global
  //    canvas colour — these images carry a vignette, so the corner region is
  //    a different tone from the frame average and a canvas-coloured patch
  //    shows up as a lighter disc.
  const localPaper = await samplePatchColour(
    corrected,
    Math.round(meta.width * (WATERMARK.x - WATERMARK.r * 2.4)),
    Math.round(meta.height * WATERMARK.y),
    Math.round(Math.min(meta.width, meta.height) * WATERMARK.r)
  );

  const patched = await sharp(corrected)
    .composite([
      {
        input: watermarkPatchSvg(meta.width, meta.height, toHex(localPaper)),
        blend: 'over',
      },
    ])
    .toBuffer();

  const resized = await sharp(patched)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .toBuffer();

  const { width: w, height: h } = await sharp(resized).metadata();

  // 4. FEATHER. dest-in keeps the image only where the mask is opaque.
  await sharp(resized)
    .ensureAlpha()
    .composite([{ input: featherMaskSvg(w, h), blend: 'dest-in' }])
    .webp({ quality: QUALITY, alphaQuality: 90 })
    .toFile(out);

  const { size } = fs.statSync(out);
  totalBytes += size;

  console.log(
    `${file.padEnd(20)} ${toHex(paper)} -> #f4eee3  ` +
      `gain [${gain.map((g) => g.toFixed(3)).join(', ')}]  ` +
      `${(size / 1024).toFixed(1)} KB`
  );
}

console.log(
  `\nIllustrations built: ${entries.length} files, ${(totalBytes / 1024).toFixed(1)} KB total.`
);
