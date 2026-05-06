import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC_DIR = 'raw-illustrations';
const OUT_DIR = 'public/illustrations';
const MAX_WIDTH = 800;
const QUALITY = 85;

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

  const meta = await sharp(src).metadata();
  const targetWidth = Math.min(MAX_WIDTH, meta.width || MAX_WIDTH);

  await sharp(src)
    .resize({ width: targetWidth, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(out);

  const { size } = fs.statSync(out);
  total += size;
  console.log(`${file} -> ${path.relative('.', out)} (${(size / 1024).toFixed(1)} KB)`);
}

console.log(`Illustrations built: ${entries.length} files, ${(total / 1024).toFixed(1)} KB total.`);
