// usage: node tools/prep.js libs   -> copy libraries from node_modules into www/lib
//        node tools/prep.js html   -> point index.html at local copies + compiled tailwind
const fs = require('fs'), path = require('path');
const mode = process.argv[2];
const WWW = 'www', LIB = path.join(WWW, 'lib');
const nm = (p) => path.join('node_modules', p);
const htmlPath = path.join(WWW, 'index.html');

function copy(from, to) {
  if (!fs.existsSync(from)) { console.log('MISSING', from); return false; }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.cpSync(from, to, { recursive: true });
  console.log('copied', from, '->', to); return true;
}

if (mode === 'libs') {
  copy(nm('three/build/three.min.js'), path.join(LIB, 'three.min.js'));
  copy(nm('three/examples/js/controls/OrbitControls.js'), path.join(LIB, 'OrbitControls.js'));
  copy(nm('peerjs/dist/peerjs.min.js'), path.join(LIB, 'peerjs.min.js'));
  const cj = ['chess.min.js', 'chess.js'].map((f) => nm('chess.js/' + f)).find(fs.existsSync);
  if (cj) copy(cj, path.join(LIB, 'chess.min.js')); else console.log('MISSING chess.js');
  copy(nm('@fortawesome/fontawesome-free/css/all.min.css'), path.join(LIB, 'fa/css/all.min.css'));
  copy(nm('@fortawesome/fontawesome-free/webfonts'), path.join(LIB, 'fa/webfonts'));
} else if (mode === 'html') {
  let s = fs.readFileSync(htmlPath, 'utf8');
  const swap = (from, to, localFile) => {
    if (!fs.existsSync(localFile)) { console.log('keeping CDN for', from); return; }
    if (!s.includes(from)) { console.log('not found in html:', from); return; }
    s = s.split(from).join(to); console.log('local:', to);
  };
  swap('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', 'lib/three.min.js', path.join(LIB, 'three.min.js'));
  swap('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js', 'lib/OrbitControls.js', path.join(LIB, 'OrbitControls.js'));
  swap('https://cdn.jsdelivr.net/npm/peerjs@1.5.2/dist/peerjs.min.js', 'lib/peerjs.min.js', path.join(LIB, 'peerjs.min.js'));
  swap('https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js', 'lib/chess.min.js', path.join(LIB, 'chess.min.js'));
  swap('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', 'lib/fa/css/all.min.css', path.join(LIB, 'fa/css/all.min.css'));
  if (fs.existsSync(path.join(WWW, 'tw.css'))) {
    s = s.replace('<script src="https://cdn.tailwindcss.com"></script>', '');
    s = s.replace(/<script>\s*\/\* Black & Orange theme[\s\S]*?tailwind\.config = [\s\S]*?<\/script>/, '');
    s = s.replace('</head>', '<link rel="stylesheet" href="tw.css">\n</head>');   // last in head, same order as the CDN
    console.log('tailwind: compiled css linked, CDN removed');
  } else console.log('tw.css missing - keeping Tailwind CDN');
  fs.writeFileSync(htmlPath, s);
}
