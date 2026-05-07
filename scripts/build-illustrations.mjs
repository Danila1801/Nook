import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC_DIR = 'raw-illustrations';
const OUT_DIR = 'public/illustrations';
const MAX_WIDTH = 900;
const QUALITY = 88;
const PAD = 100;
const PAPER = { r: 244, g: 238, b: 227 };

if (!fs.existsSync(SRC_DIR)) {
  console.log(`No ${SRC_DIR}/ directory. Skipping illustration build.`);
  process.exit(0);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

const entries = fs
  .readdirSync(SRC_DIR)
  .filter((f) => f.toLowerCase().endsWith('.png'));

if (entries.length === 0) {
  console.log(`No PNGs in ${SRC_DIR}/. Skipping.`);
  process.exit(0);
}

let total = 0;
for (const file of entries) {
  const src = path.join(SRC_DIR, file);
  const base = path.basename(file, path.extname(file));
  const out = path.join(OUT_DIR, `${base}.webp`);

  await sharp(src)
    .trim({ threshold: 25, lineArt: false })
    .extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: PAPER })
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(out);

  const { size } = fs.statSync(out);
  total += size;
  console.log(`${file} -> ${path.relative('.', out)} (${(size / 1024).toFixed(1)} KB)`);
}

console.log(`Illustrations built: ${entries.length} files, ${(total / 1024).toFixed(1)} KB total.`);
