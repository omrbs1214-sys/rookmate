// Writes the launcher icon straight into the Android project (run after `npx cap add android`)
const sharp = require('sharp'), fs = require('fs'), path = require('path');
const src = 'www/rookmate-rook.png';
const RES = 'android/app/src/main/res';
const SIZES = { 'mipmap-mdpi': 48, 'mipmap-hdpi': 72, 'mipmap-xhdpi': 96, 'mipmap-xxhdpi': 144, 'mipmap-xxxhdpi': 192 };
(async () => {
  if (!fs.existsSync(src)) { console.log('ICON: www/rookmate-rook.png not found - default icon stays'); return; }
  if (!fs.existsSync(RES)) { console.log('ICON: android res folder not found'); return; }
  for (const [dir, px] of Object.entries(SIZES)) {
    const logo = await sharp(src).resize(Math.round(px * 0.8), Math.round(px * 0.8), { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
    const base = sharp({ create: { width: px, height: px, channels: 4, background: '#090604' } }).composite([{ input: logo, gravity: 'center' }]).png();
    const buf = await base.toBuffer();
    const d = path.join(RES, dir); fs.mkdirSync(d, { recursive: true });
    for (const n of ['ic_launcher.png', 'ic_launcher_round.png', 'ic_launcher_foreground.png']) fs.writeFileSync(path.join(d, n), buf);
    console.log('ICON: wrote', dir, px + 'px');
  }
  // adaptive-icon xml would override the PNGs above, so remove it
  for (const d of fs.readdirSync(RES).filter((x) => x.startsWith('mipmap-anydpi'))) { fs.rmSync(path.join(RES, d), { recursive: true, force: true }); console.log('ICON: removed', d); }
})().catch((e) => console.log('ICON step failed:', e.message));
