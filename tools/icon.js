// builds assets/icon-only.png (1024x1024) from www/rookmate-rook.png for the Android app icon
const sharp = require('sharp'), fs = require('fs');
const src = 'www/rookmate-rook.png';
if (!fs.existsSync(src)) { console.log('no www/rookmate-rook.png - skipping app icon'); process.exit(0); }
fs.mkdirSync('assets', { recursive: true });
(async () => {
  const logo = await sharp(src).resize(700, 700, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  await sharp({ create: { width: 1024, height: 1024, channels: 4, background: '#090604' } })
    .composite([{ input: logo, gravity: 'center' }]).png().toFile('assets/icon-only.png');
  console.log('app icon source ready');
})().catch((e) => { console.log('icon step failed:', e.message); });
