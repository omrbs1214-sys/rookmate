// Writes the launcher icon straight into the Android project (run after `npx cap add android`)
const sharp = require('sharp'), fs = require('fs'), path = require('path');
const src = ['assets/app-icon.png', 'www/rookmate-rook.png'].find(fs.existsSync);
const RES = 'android/app/src/main/res';
const SIZES = { 'mipmap-mdpi': 48, 'mipmap-hdpi': 72, 'mipmap-xhdpi': 96, 'mipmap-xxhdpi': 144, 'mipmap-xxxhdpi': 192 };
(async () => {
  if (!src) { console.log('ICON: no icon image found (assets/app-icon.png) - default icon stays'); return; }
  if (!fs.existsSync(RES)) { console.log('ICON: android res folder not found'); return; }
  console.log('ICON: using', src);
  for (const [dir, px] of Object.entries(SIZES)) {
    const buf = await sharp(src).resize(px, px, { fit: 'cover' }).png().toBuffer();
    const d = path.join(RES, dir); fs.mkdirSync(d, { recursive: true });
    for (const n of ['ic_launcher.png', 'ic_launcher_round.png', 'ic_launcher_foreground.png']) fs.writeFileSync(path.join(d, n), buf);
    console.log('ICON: wrote', dir, px + 'px');
  }
  for (const d of fs.readdirSync(RES).filter((x) => x.startsWith('mipmap-anydpi'))) { fs.rmSync(path.join(RES, d), { recursive: true, force: true }); console.log('ICON: removed', d); }
})().catch((e) => console.log('ICON step failed:', e.message));
