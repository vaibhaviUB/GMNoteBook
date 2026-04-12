/**
 * generate-logo.mjs
 * Generates a rounded-edge app-icon style logo from the existing logo.png.
 * Output: public/logo-icon.png (512x512, rounded square / superellipse shape)
 *
 * Run with:  node scripts/generate-logo.mjs
 * Requires:  npm install canvas  (if not already installed)
 */

import { createCanvas, loadImage } from 'canvas';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.join(__dirname, '..');
const SRC_IMG   = path.join(ROOT, 'src', 'assets', 'logo.png');
const OUT_DIR   = path.join(ROOT, 'public');
const OUT_FILE  = path.join(OUT_DIR, 'logo-icon.png');

const SIZE    = 512;   // output canvas size (square)
const RADIUS  = 112;   // corner radius  ≈ 22 % → typical superellipse / iOS icon feel
const PADDING = 48;    // inner padding so the logo doesn't touch the edges

// ── Background colours ──────────────────────────────────────────────────────
// Deep dark navy gradient (matches the project's dark theme)
const BG_TOP    = '#0f0c29';
const BG_BOTTOM = '#1a1a3e';

// ── helpers ─────────────────────────────────────────────────────────────────
/**
 * Draw a rounded rectangle path (reusable).
 */
function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y,       x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h,   x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h,       x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y,           x + r, y);
  ctx.closePath();
}

async function main() {
  // ── canvas setup ──────────────────────────────────────────────────────────
  const canvas = createCanvas(SIZE, SIZE);
  const ctx    = canvas.getContext('2d');

  // 1. Clip to rounded square
  roundedRect(ctx, 0, 0, SIZE, SIZE, RADIUS);
  ctx.clip();

  // 2. Dark gradient background
  const grad = ctx.createLinearGradient(0, 0, 0, SIZE);
  grad.addColorStop(0, BG_TOP);
  grad.addColorStop(1, BG_BOTTOM);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // 3. Subtle inner glow / radial highlight (top-centre)
  const glow = ctx.createRadialGradient(SIZE / 2, SIZE * 0.3, 0, SIZE / 2, SIZE * 0.3, SIZE * 0.55);
  glow.addColorStop(0, 'rgba(180, 60, 255, 0.18)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // 4. Draw the logo centred with padding
  const img        = await loadImage(SRC_IMG);
  const logoSize   = SIZE - PADDING * 2;
  const logoOffset = PADDING;

  // Scale proportionally
  const aspect = img.width / img.height;
  let drawW = logoSize;
  let drawH = logoSize;
  if (aspect > 1) drawH = logoSize / aspect;
  else            drawW = logoSize * aspect;

  const dx = (SIZE - drawW) / 2;
  const dy = (SIZE - drawH) / 2;

  ctx.drawImage(img, dx, dy, drawW, drawH);

  // 5. Thin inner border / rim for polish
  ctx.save();
  roundedRect(ctx, 0, 0, SIZE, SIZE, RADIUS);
  ctx.lineWidth   = 3;
  ctx.strokeStyle = 'rgba(255,255,255,0.10)';
  ctx.stroke();
  ctx.restore();

  // ── save ──────────────────────────────────────────────────────────────────
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, canvas.toBuffer('image/png'));
  console.log(`✅  Logo saved → ${OUT_FILE}`);
}

main().catch(err => {
  console.error('❌  Error:', err.message);
  process.exit(1);
});
