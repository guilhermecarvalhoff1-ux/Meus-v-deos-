// ===== Utilidades =====
const W = 1080, H = 1920;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, x) => a + (b - a) * x;
const ease = x => (x = clamp(x), x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2);
const easeOut = x => 1 - Math.pow(1 - clamp(x), 3);
const easeIn = x => Math.pow(clamp(x), 3);
const seg = (p, a, b) => clamp((p - a) / (b - a));
function rng(seed) { let s = seed % 2147483647; if (s <= 0) s += 2147483646; return () => (s = s * 16807 % 2147483647, (s - 1) / 2147483646); }
const g = (inner, tr = '', extra = '') => `<g transform="${tr}" ${extra}>${inner}</g>`;
let UID = 0; const uid = p => p + (UID++);

const SK = '#d99a6c', SKS = '#c3815a', SKL = '#e8b28a';
const YEL = '#ffc928';

// Defs compartilhados (filtros)
const DEFS = `
<filter id="b2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2"/></filter>
<filter id="b5" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter>
<filter id="b10" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="10"/></filter>
<filter id="b18" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="18"/></filter>
<filter id="b30" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30"/></filter>
<filter id="b60" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="60"/></filter>
<filter id="sh" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="14" stdDeviation="16" flood-color="#000" flood-opacity=".28"/></filter>
<filter id="shs" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="5" stdDeviation="6" flood-color="#000" flood-opacity=".25"/></filter>
<filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="glow2" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="22" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="gray"><feColorMatrix type="saturate" values="0.12"/></filter>
<filter id="sepia"><feColorMatrix type="matrix" values=".39 .77 .19 0 0  .35 .69 .17 0 0  .27 .53 .13 0 0  0 0 0 1 0"/></filter>
<radialGradient id="vig" cx="50%" cy="50%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".55"/></radialGradient>
<radialGradient id="vigS" cx="50%" cy="50%" r="70%"><stop offset="40%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".85"/></radialGradient>
<linearGradient id="skinG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${SKL}"/><stop offset="1" stop-color="${SK}"/></linearGradient>
`;

function grain(seed, op = .07) {
  const id = uid('gr');
  return `<filter id="${id}"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${seed}"/><feColorMatrix type="saturate" values="0"/></filter>
  <rect width="${W}" height="${H}" filter="url(#${id})" opacity="${op}" style="mix-blend-mode:overlay"/>`;
}
const vignette = (strong) => `<rect width="${W}" height="${H}" fill="url(#${strong ? 'vigS' : 'vig'})"/>`;
function linGrad(id, stops, x2 = 0, y2 = 1) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="${x2}" y2="${y2}">${stops.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}" ${op != null ? `stop-opacity="${op}"` : ''}/>`).join('')}</linearGradient>`;
}
function radGrad(id, stops, cx = .5, cy = .5, r = .5) {
  return `<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, op]) => `<stop offset="${o}" stop-color="${c}" ${op != null ? `stop-opacity="${op}"` : ''}/>`).join('')}</radialGradient>`;
}
function txt(x, y, s, size, fill, opts = {}) {
  const fam = opts.fam || "RC";
  return `<text x="${x}" y="${y}" font-family="${fam}" font-weight="${opts.w || 800}" font-size="${size}" fill="${fill}" text-anchor="${opts.a || 'middle'}" ${opts.ls ? `letter-spacing="${opts.ls}"` : ''} ${opts.op != null ? `opacity="${opts.op}"` : ''} ${opts.extra || ''}>${s}</text>`;
}

// ===== Logo Lethe =====
function logo(x, y, s, col = '#5fd0ff', wave = '#ffffff') {
  return g(`<path d="M0,-50 C18,-22 36,-2 36,18 C36,40 20,54 0,54 C-20,54 -36,40 -36,18 C-36,-2 -18,-22 0,-50Z" fill="${col}"/>
  <path d="M-34,16 C-20,4 -8,28 6,16 S28,6 36,14" fill="none" stroke="${wave}" stroke-width="7" stroke-linecap="round"/>`, `translate(${x},${y}) scale(${s})`);
}

// ===== Personagens =====
// Cabeça centrada em (0,0). o: {hair, eyes, mouth, brows, tears, tearP, blink, headband, look}
function face(o) {
  const lx = o.look || 0;
  let s = '';
  const ey = -4;
  if (o.eyes === 'closed') {
    s += `<path d="M${-32 + lx},${ey} q10,8 20,0 M${12 + lx},${ey} q10,8 20,0" stroke="#2a1d17" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  } else if (o.blink) {
    s += `<path d="M${-30 + lx},${ey} h16 M${14 + lx},${ey} h16" stroke="#1c1c1c" stroke-width="5" stroke-linecap="round"/>`;
  } else {
    const r = o.eyes === 'wide' ? 8.5 : 6.5;
    s += `<circle cx="${-22 + lx}" cy="${ey}" r="${r}" fill="#1c1c1c"/><circle cx="${22 + lx}" cy="${ey}" r="${r}" fill="#1c1c1c"/>`;
    if (o.eyes === 'red') s += `<path d="M${-34 + lx},${ey + 10} q12,6 24,0 M${10 + lx},${ey + 10} q12,6 24,0" stroke="#c0605a" stroke-width="4" fill="none" opacity=".7"/>`;
    if (o.shine) s += `<circle cx="${-20 + lx}" cy="${ey - 2}" r="2" fill="#fff"/><circle cx="${24 + lx}" cy="${ey - 2}" r="2" fill="#fff"/>`;
  }
  // sobrancelhas
  const b = o.brows || 'neutral';
  const bc = o.browCol || '#3b2a20';
  if (b === 'sad') s += `<path d="M${-36 + lx},-22 L${-12 + lx},-30 M${12 + lx},-30 L${36 + lx},-22" stroke="${bc}" stroke-width="5" stroke-linecap="round"/>`;
  else if (b === 'angry' || b === 'serious') s += `<path d="M${-36 + lx},-30 L${-12 + lx},-24 M${12 + lx},-24 L${36 + lx},-30" stroke="${bc}" stroke-width="5" stroke-linecap="round"/>`;
  else if (b === 'up') s += `<path d="M${-36 + lx},-34 q12,-6 24,0 M${12 + lx},-34 q12,-6 24,0" stroke="${bc}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  else s += `<path d="M${-34 + lx},-27 h20 M${14 + lx},-27 h20" stroke="${bc}" stroke-width="5" stroke-linecap="round"/>`;
  // boca
  const m = o.mouth || 'flat';
  if (m === 'flat') s += `<path d="M${-12 + lx},34 h24" stroke="#5a2e22" stroke-width="5" stroke-linecap="round"/>`;
  else if (m === 'sad') s += `<path d="M${-14 + lx},38 q14,-10 28,0" stroke="#5a2e22" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  else if (m === 'o') s += `<ellipse cx="${lx}" cy="36" rx="8" ry="10" fill="#5a2e22"/>`;
  else if (m === 'small') s += `<path d="M${-7 + lx},34 h14" stroke="#5a2e22" stroke-width="5" stroke-linecap="round"/>`;
  else if (m === 'open') s += `<path d="M${-12 + lx},30 q12,16 24,0 z" fill="#5a2e22"/>`;
  if (o.tears) {
    const tp = o.tearP || 0;
    for (const sx of [-24, 24]) {
      const yy = 6 + ((tp * 70) % 60);
      s += `<path d="M${sx + lx},4 C${sx - 3 + lx},20 ${sx - 2 + lx},40 ${sx + lx},${8 + yy * .6}" stroke="#9fd6ff" stroke-width="4" fill="none" opacity=".75" stroke-linecap="round"/>`;
      s += `<path d="M${sx + lx},${yy} c-5,8 -5,14 0,14 c5,0 5,-6 0,-14z" fill="#bfe6ff" opacity=".9"/>`;
    }
  }
  return s;
}

function hairBack(type, c) {
  if (type === 'marina') return `<path d="M-86,-8 C-94,-92 -40,-108 2,-106 C50,-104 96,-84 88,-8 L88,74 C70,92 44,92 30,80 L-30,80 C-48,92 -72,92 -88,74 Z" fill="${c || '#4a3326'}"/>`;
  if (type === 'hood') return `<path d="M-104,10 C-110,-110 -40,-128 0,-128 C40,-128 110,-110 104,10 L100,120 L-100,120 Z" fill="${c || '#2f343e'}"/>`;
  return '';
}
function hairFront(type, c) {
  if (type === 'marina') return `<path d="M-72,-22 C-76,-82 -30,-100 10,-98 C58,-96 80,-64 74,-6 C58,-48 22,-64 -18,-60 C-40,-56 -60,-42 -72,-22 Z" fill="${c || '#4a3326'}"/>
    <path d="M-68,-30 C-80,10 -78,56 -64,84 L-90,80 C-96,36 -90,-4 -68,-30 Z" fill="${c || '#4a3326'}"/>
    <path d="M68,-30 C80,10 78,56 64,84 L90,80 C96,36 90,-4 68,-30 Z" fill="${c || '#4a3326'}"/>
    <path d="M-30,-86 C0,-96 40,-90 56,-70" stroke="#5e4232" stroke-width="5" fill="none" opacity=".6"/>`;
  if (type === 'grey') return `<path d="M-66,-14 C-70,-74 -32,-92 0,-92 C36,-92 70,-74 66,-14 C60,-46 34,-60 0,-58 C-34,-60 -58,-46 -66,-14Z" fill="${c || '#a3a7ad'}"/><path d="M-66,-14 L-64,18 L-58,18 L-58,-20Z M66,-14 L64,18 L58,18 L58,-20Z" fill="${c || '#a3a7ad'}"/>`;
  if (type === 'kid') return `<path d="M-68,-10 C-74,-86 -24,-100 6,-98 C50,-96 76,-70 68,-10 C60,-34 44,-44 30,-40 C24,-56 0,-58 -10,-46 C-26,-54 -50,-40 -68,-10Z" fill="${c || '#6b4a32'}"/>`;
  if (type === 'short') return `<path d="M-66,-16 C-70,-80 -28,-96 2,-94 C40,-92 70,-74 66,-16 C56,-46 30,-58 0,-56 C-30,-58 -56,-44 -66,-16Z" fill="${c || '#2e2a28'}"/>`;
  if (type === 'hood') return `<path d="M-100,10 C-104,-100 -40,-116 0,-116 C40,-116 104,-100 100,10 C90,-60 50,-84 0,-84 C-50,-84 -90,-60 -100,10Z" fill="${c || '#383e4a'}"/>`;
  return '';
}
function headG(o) {
  const sk = o.skin || SK;
  let s = hairBack(o.hair, o.hairCol);
  s += `<ellipse cx="-64" cy="8" rx="12" ry="18" fill="${SKS}"/><ellipse cx="64" cy="8" rx="12" ry="18" fill="${SKS}"/>`;
  s += `<ellipse cx="0" cy="0" rx="64" ry="76" fill="${sk}"/>`;
  s += `<ellipse cx="0" cy="40" rx="52" ry="34" fill="${SKS}" opacity=".18"/>`;
  s += hairFront(o.hair, o.hairCol);
  s += face(o);
  if (o.headband) s += `<path d="M-66,-40 C-40,-72 40,-72 66,-40" stroke="#eef6fb" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="-66" cy="-36" r="9" fill="#5fd0ff" filter="url(#glow)"/><circle cx="66" cy="-36" r="9" fill="#5fd0ff" filter="url(#glow)"/>`;
  return s;
}
// Busto frontal. outfit: coat|suit|robe|hoodie|shirt
function bust(o) {
  let s = '';
  const top = o.top || '#3b4150';
  s += `<path d="M-176,460 C-176,260 -150,176 -64,156 L64,156 C150,176 176,260 176,460 Z" fill="${top}"/>`;
  s += `<path d="M-176,460 C-176,300 -160,220 -110,186 C-140,260 -140,360 -130,460Z" fill="#000" opacity=".12"/>`;
  s += `<rect x="-26" y="60" width="52" height="110" rx="22" fill="${SKS}"/>`;
  if (o.outfit === 'coat') s += `<path d="M-52,150 C-50,120 50,120 52,150 L48,190 C20,200 -20,200 -48,190Z" fill="${o.collar || '#303644'}"/>`;
  if (o.outfit === 'suit') s += `<path d="M-40,156 L0,250 L40,156Z" fill="#eef0f2"/><path d="M-8,170 L8,170 L12,260 L0,280 L-12,260Z" fill="#23262c"/><path d="M-64,156 L-6,300 L-40,170Z M64,156 L6,300 L40,170Z" fill="#2e3239"/>`;
  if (o.outfit === 'robe') s += `<path d="M-50,156 L0,280 L50,156Z" fill="${SKS}"/><path d="M-70,156 L0,300 L-30,156Z M70,156 L0,300 L30,156Z" fill="#000" opacity=".15"/>`;
  if (o.outfit === 'hoodie') s += `<path d="M-60,150 C-40,190 40,190 60,150 L56,170 C30,210 -30,210 -56,170Z" fill="#000" opacity=".18"/>`;
  if (o.outfit === 'labcoat') s += `<path d="M-44,156 L0,240 L44,156Z" fill="#7d8b99"/><path d="M-64,156 L-4,330 L-30,156Z M64,156 L4,330 L30,156Z" fill="#dfe5ea"/>`;
  s += g(headG(o), 'translate(0,-10)');
  return g(s, `translate(${o.x},${o.y}) scale(${o.s || 1})`);
}
// Mão grande estilizada (palma de frente, dedos para cima). rot em graus.
function hand(x, y, s, rot = 0, opts = {}) {
  const sk = opts.skin || SK;
  const sleeve = opts.sleeve;
  let h = '';
  if (sleeve) h += `<rect x="-62" y="70" width="124" height="520" rx="30" fill="${sleeve}"/>`;
  if (opts.watch) h += `<rect x="-52" y="56" width="104" height="30" rx="10" fill="#e0b44c"/><rect x="-22" y="48" width="44" height="46" rx="12" fill="#f3d27a" stroke="#b88a2a" stroke-width="4"/>`;
  h += `<rect x="-50" y="-40" width="100" height="110" rx="34" fill="${sk}"/>`;
  const fingers = opts.fist ? [] : [[-36, -120, 24], [-12, -140, 24], [12, -136, 24], [36, -116, 22]];
  for (const [fx, fy, fw] of fingers) h += `<rect x="${fx - fw / 2}" y="${fy}" width="${fw}" height="${-fy + 10}" rx="${fw / 2}" fill="${sk}"/><path d="M${fx - 6},${fy + 30} h12" stroke="${SKS}" stroke-width="3" opacity=".6"/>`;
  if (opts.fist) h += `<rect x="-54" y="-70" width="108" height="56" rx="26" fill="${sk}"/><path d="M-30,-60 v40 M-4,-64 v44 M22,-60 v40" stroke="${SKS}" stroke-width="4"/>`;
  h += `<rect x="-78" y="-30" width="26" height="80" rx="13" fill="${sk}" transform="rotate(-30,-60,30)"/>`;
  return g(h, `translate(${x},${y}) rotate(${rot}) scale(${s})`);
}
// Pessoa pequena de corpo inteiro (vista frontal simples), usada em multidões
function tiny(x, y, s, col, skin = SK, hair = '#2e2a28') {
  return g(`<rect x="-16" y="0" width="32" height="56" rx="14" fill="${col}"/><rect x="-14" y="48" width="12" height="34" rx="6" fill="#2b2f38"/><rect x="2" y="48" width="12" height="34" rx="6" fill="#2b2f38"/><circle cx="0" cy="-14" r="15" fill="${skin}"/><path d="M-15,-16 a15,15 0 0 1 30,0 q-15,-8 -30,0z" fill="${hair}"/>`, `translate(${x},${y}) scale(${s})`);
}

// ===== Cenários =====
function cityBG(t, opts = {}) {
  let s = `<defs>${linGrad('skyN', [[0, '#0b1724'], [.55, '#1b3340'], [1, '#2c4a4e']])}</defs><rect width="${W}" height="${H}" fill="url(#skyN)"/>`;
  s += `<ellipse cx="540" cy="900" rx="700" ry="380" fill="#4f7a78" opacity=".25" filter="url(#b60)"/>`;
  const layers = [[.35, 0, 'b10', '#1d3038', 1100], [.6, 1, 'b5', '#16252d', 1250], [1, 2, '', '#0f1b22', 1420]];
  for (const [sc, li, f, col, base] of layers) {
    const r = rng(11 + li * 7);
    let L = '';
    let x = -40;
    while (x < W + 40) {
      const bw = 70 + r() * 120 * sc + 40 * sc, bh = (260 + r() * 560) * (0.6 + sc * .6);
      if (!(li === 2 && x > 380 && x < 700)) {
        L += `<rect x="${x}" y="${base - bh}" width="${bw}" height="${bh + 800}" fill="${col}"/>`;
        for (let wy = base - bh + 20; wy < base + 300; wy += 26 * (0.6 + sc * .4)) for (let wx = x + 10; wx < x + bw - 14; wx += 20 * (0.6 + sc * .4)) if (r() < .32) L += `<rect x="${wx}" y="${wy}" width="${8 * (0.6 + sc * .4)}" height="${11 * (0.6 + sc * .4)}" fill="${r() < .8 ? '#e6c56a' : '#8fe3ff'}" opacity="${.35 + r() * .5}"/>`;
      }
      x += bw + 6 + r() * 30;
    }
    s += `<g ${f ? `filter="url(#${f})"` : ''}>${L}</g>`;
  }
  if (opts.tower !== false) {
    // torre Lethe
    s += `<rect x="400" y="380" width="280" height="1600" fill="#dfe8ee"/><rect x="400" y="380" width="60" height="1600" fill="#b9c7d1"/>`;
    for (let yy = 440; yy < 1900; yy += 46) s += `<rect x="470" y="${yy}" width="190" height="16" fill="#9fd9f0" opacity=".35"/>`;
    s += `<rect x="360" y="560" width="360" height="420" rx="18" fill="#0f2a33" filter="url(#sh)"/><rect x="372" y="572" width="336" height="396" rx="12" fill="#13394a"/>`;
    s += `<g filter="url(#glow)">${logo(540, 690, 1.3)}</g>`;
    s += txt(540, 845, 'LETHE', 74, '#ffffff', { ls: 8 }) + txt(540, 910, 'ESQUEÇA. DE GRAÇA.', 34, '#5fd0ff', { ls: 2 });
    s += `<ellipse cx="540" cy="770" rx="260" ry="300" fill="#5fd0ff" opacity=".12" filter="url(#b60)"/>`;
  }
  // chuva
  const r = rng(99);
  let rain = '';
  for (let i = 0; i < 140; i++) { const x0 = r() * W * 1.2 - 100, sp = 1400 + r() * 900, y0 = ((r() * H + t * sp) % (H + 200)) - 100; rain += `<path d="M${x0},${y0} l-10,48" stroke="#cfe6f0" stroke-width="${1.5 + r() * 1.5}" opacity="${.15 + r() * .3}"/>`; }
  s += rain;
  return s;
}

function clinicBG(t, opts = {}) {
  let s = `<defs>${linGrad('clw', [[0, '#e9f0f4'], [.6, '#d4dfe6'], [1, '#bccbd5']])}${radGrad('clf', [[0, '#f4f8fa'], [1, '#aebdc8']])}</defs>`;
  s += `<rect width="${W}" height="${H}" fill="url(#clw)"/>`;
  s += `<path d="M-100,1260 Q540,1120 1180,1260 L1180,2000 L-100,2000Z" fill="url(#clf)"/>`;
  s += `<ellipse cx="540" cy="180" rx="430" ry="70" fill="none" stroke="#bff0ff" stroke-width="18" filter="url(#glow)" opacity=".9"/>`;
  for (let i = -3; i <= 3; i++) s += `<path d="M${540 + i * 170},300 Q${540 + i * 185},800 ${540 + i * 200},1240" stroke="#c4d2db" stroke-width="4" fill="none" opacity=".7"/>`;
  if (opts.logo !== false) s += `<g opacity=".9">${logo(540, 470, .9, '#7fc9e6')}</g>` + txt(540, 580, 'LETHE', 40, '#7aa3b8', { ls: 10 });
  s += `<ellipse cx="540" cy="1350" rx="420" ry="60" fill="#8fa3b0" opacity=".35" filter="url(#b18)"/>`;
  return s;
}
// Cadeira + capacete (vista 3/4 frontal). hp = 0 (capacete no alto) .. 1 (abaixado)
function chair(x, y, s, hp = 0, glowOn = 1, person = null) {
  let c = '';
  c += `<rect x="-14" y="-640" width="28" height="${330 + hp * 120}" fill="#c9d5dd"/>`;
  c += `<path d="M-200,40 C-210,-260 -150,-420 0,-430 C150,-420 210,-260 200,40 Z" fill="#f2f6f8" filter="url(#sh)"/>`;
  c += `<path d="M-150,20 C-160,-220 -110,-350 0,-356 C110,-350 160,-220 150,20 Z" fill="#e2eaef"/>`;
  c += `<rect x="-250" y="-10" width="500" height="150" rx="70" fill="#eef3f6" filter="url(#sh)"/><rect x="-60" y="130" width="120" height="230" fill="#b9c7d1"/><ellipse cx="0" cy="370" rx="200" ry="40" fill="#a9b8c3"/>`;
  c += `<rect x="-300" y="-60" width="80" height="40" rx="20" fill="#dfe7ec"/><rect x="220" y="-60" width="80" height="40" rx="20" fill="#dfe7ec"/>`;
  if (person) c += person;
  const hy = -560 + hp * 130;
  c += g(helmet(glowOn), `translate(0,${hy})`);
  return g(c, `translate(${x},${y}) scale(${s})`);
}
function helmet(glowOn = 1, visorContent = '') {
  let h = `<path d="M-170,60 C-180,-120 -100,-190 0,-190 C100,-190 180,-120 170,60 C170,110 120,130 0,130 C-120,130 -170,110 -170,60Z" fill="#f5f8fa" filter="url(#sh)"/>`;
  h += `<path d="M-120,-150 C-60,-180 60,-180 120,-150" stroke="#d6e0e6" stroke-width="10" fill="none"/>`;
  h += `<ellipse cx="-172" cy="30" rx="32" ry="58" fill="#dde6eb"/><ellipse cx="172" cy="30" rx="32" ry="58" fill="#dde6eb"/>`;
  h += `<rect x="-140" y="10" width="280" height="96" rx="40" fill="#0e2733"/>`;
  h += `<rect x="-130" y="18" width="260" height="80" rx="34" fill="#5fd0ff" opacity="${.25 + .45 * glowOn}" filter="url(#glow)"/>`;
  h += `<path d="M-110,30 Q0,22 110,30" stroke="#fff" stroke-width="6" opacity=".35" fill="none"/>`;
  h += visorContent;
  return h;
}

function archiveBG(t, opts = {}) {
  let s = `<defs>${linGrad('arc', [[0, '#04121a'], [.5, '#0a2633'], [1, '#04121a']])}</defs><rect width="${W}" height="${H}" fill="url(#arc)"/>`;
  const layers = [[.45, 'b10', .35], [.7, 'b5', .6], [1.15, opts.sharp ? '' : 'b2', 1]];
  layers.forEach(([sc, f, op], li) => {
    const r = rng(5 + li * 13);
    let L = '';
    const cw = 90 * sc, ch = 150 * sc, rowH = 230 * sc;
    const off = ((t * 20 * sc) % rowH);
    for (let ry = -rowH + off + (opts.dy || 0) * sc % rowH; ry < H + rowH; ry += rowH) {
      L += `<rect x="0" y="${ry + ch + 6}" width="${W}" height="${14 * sc}" fill="#1b4252" opacity="${op}"/>`;
      for (let cx = (li * 37) % cw - cw; cx < W + cw; cx += cw * 1.25) {
        const hue = r();
        const cc = opts.palette ? opts.palette(hue, r) : (hue < .8 ? '#3fc7ff' : hue < .93 ? '#7cf2d6' : '#b48cff');
        const flick = .55 + .45 * Math.sin(t * 2 + hue * 40);
        L += `<rect x="${cx}" y="${ry}" width="${cw * .8}" height="${ch}" rx="${18 * sc}" fill="#0e3242" stroke="#3a7d93" stroke-width="${2 * sc}" opacity="${op}"/>`;
        L += `<circle cx="${cx + cw * .4}" cy="${ry + ch * .5}" r="${22 * sc}" fill="${cc}" opacity="${op * flick}" filter="url(#glow)"/>`;
      }
    }
    s += `<g ${f ? `filter="url(#${f})"` : ''}>${L}</g>`;
  });
  s += `<rect width="${W}" height="${H}" fill="#06202b" opacity=".25"/>`;
  return s;
}

function meadowBG(t, opts = {}) {
  let s = `<defs>${linGrad('skyD', [[0, '#8fc3e6'], [1, '#dcefff']])}</defs><rect width="${W}" height="${H}" fill="url(#skyD)"/>`;
  s += `<path d="M-50,1050 L200,700 L380,920 L560,640 L820,980 L1000,760 L1200,1050Z" fill="#9db4c8" filter="url(#b5)"/>`;
  s += `<rect y="1000" width="${W}" height="${H}" fill="#7cc44f"/>`;
  return s;
}

function cafeBG(t, opts = {}) {
  let s = `<defs>${linGrad('cw', [[0, '#3a2c27'], [1, '#5b4236']])}${linGrad('win', [[0, '#5d7f95'], [1, '#33505f']])}</defs>`;
  s += `<rect width="${W}" height="${H}" fill="url(#cw)"/>`;
  s += `<g filter="url(#b${opts.blur || 10})">`;
  s += `<rect x="120" y="300" width="840" height="760" rx="20" fill="url(#win)"/>`;
  const r = rng(7);
  for (let i = 0; i < 40; i++) { const x0 = 130 + r() * 820, y0 = 310 + ((r() * 740 + t * (300 + r() * 300)) % 740); s += `<path d="M${x0},${y0} l-4,30" stroke="#cfe4f0" stroke-width="3" opacity=".5"/>`; }
  for (let i = 0; i < 12; i++) s += `<circle cx="${150 + r() * 780}" cy="${330 + r() * 700}" r="${10 + r() * 26}" fill="#ffd79a" opacity="${.15 + r() * .25}"/>`;
  s += `<rect x="520" y="300" width="20" height="760" fill="#2a201c"/><rect x="120" y="660" width="840" height="18" fill="#2a201c"/>`;
  for (const lx of [260, 820]) s += `<path d="M${lx},0 V180" stroke="#1f1714" stroke-width="5"/><path d="M${lx - 70},250 Q${lx},150 ${lx + 70},250Z" fill="#2b211c"/><ellipse cx="${lx}" cy="262" rx="90" ry="40" fill="#ffcf7a" opacity=".55" filter="url(#glow2)"/>`;
  s += `<rect x="0" y="1180" width="${W}" height="900" fill="#2a1f1b"/>`;
  s += `</g>`;
  return s;
}

function riverBG(t, opts = {}) {
  let s = `<defs>${linGrad('skyR', [[0, '#9aa39c'], [1, '#c5c9bf']])}${linGrad('wat', [[0, '#55625a'], [1, '#3d4943']])}</defs>`;
  s += `<rect width="${W}" height="${H}" fill="url(#skyR)"/>`;
  s += `<g filter="url(#b10)">`;
  const r = rng(3);
  for (let i = 0; i < 18; i++) { const x = i * 70 - 20 + r() * 20, rr = 70 + r() * 60; s += `<circle cx="${x}" cy="${760 - r() * 60}" r="${rr}" fill="${r() < .5 ? '#5f6e5d' : '#6d7b67'}"/>`; }
  s += `<rect y="760" width="${W}" height="120" fill="#5c6a59"/></g>`;
  s += `<rect y="860" width="${W}" height="700" fill="url(#wat)"/>`;
  for (let i = 0; i < 14; i++) { const yy = 900 + i * 48, xx = ((i * 137 + t * 30) % 1300) - 200; s += `<path d="M${xx},${yy} q60,-10 120,0 t120,0" stroke="#7d8a80" stroke-width="4" fill="none" opacity=".45"/>`; }
  s += `<path d="M-50,1480 C200,1420 500,1500 760,1450 C900,1420 1050,1440 1150,1430 L1150,2000 L-50,2000Z" fill="#6b5b47"/>`;
  s += `<path d="M-50,1560 C300,1520 600,1600 1150,1540 L1150,2000 L-50,2000Z" fill="#594b3b"/>`;
  return s;
}
function grass(t, y0, n, seed, col1 = '#6f7f5a', col2 = '#56664a', hmax = 300, blur = '') {
  const r = rng(seed);
  let s = '';
  for (let i = 0; i < n; i++) {
    const x = r() * (W + 100) - 50, h = hmax * (.4 + r() * .6), sw = Math.sin(t * 1.6 + i) * 10 * (h / hmax);
    s += `<path d="M${x - 8},${y0} Q${x + sw * .5},${y0 - h * .5} ${x + sw},${y0 - h} Q${x + 6 + sw * .5},${y0 - h * .5} ${x + 10},${y0}Z" fill="${r() < .5 ? col1 : col2}"/>`;
  }
  return `<g ${blur ? `filter="url(#${blur})"` : ''}>${s}</g>`;
}
function boots(x, y, s, rot = 0) {
  return g(`<path d="M-60,-80 L-20,-80 L-20,10 L30,10 C50,10 56,30 50,40 L-62,40 Z" fill="${YEL}"/><rect x="-66" y="34" width="122" height="16" rx="6" fill="#d9a10f"/><rect x="-64" y="-90" width="48" height="16" rx="6" fill="#ffd95a"/>
  ${g(`<path d="M-60,-80 L-20,-80 L-20,10 L30,10 C50,10 56,30 50,40 L-62,40 Z" fill="#f2b916"/><rect x="-66" y="34" width="122" height="16" rx="6" fill="#c99410"/><rect x="-64" y="-90" width="48" height="16" rx="6" fill="#ffd24a"/>`, 'translate(60,14)')}`, `translate(${x},${y}) rotate(${rot}) scale(${s})`);
}

// Visualização do cérebro (estilo infográfico)
function brainViz(t, opts = {}) {
  let s = `<defs>${linGrad('bv', [[0, '#0d3a44'], [1, '#08262e']])}</defs><rect width="${W}" height="${H}" fill="url(#bv)"/>`;
  for (let i = 0; i < 30; i++) s += `<path d="M${i * 40},0 V${H}" stroke="#1d5560" stroke-width="1" opacity=".35"/>`;
  for (let i = 0; i < 50; i++) s += `<path d="M0,${i * 40} H${W}" stroke="#1d5560" stroke-width="1" opacity=".35"/>`;
  // perfil da cabeça
  s += `<path d="M300,1500 C300,1380 250,1330 190,1250 C120,1150 110,700 330,520 C520,370 860,400 960,640 C1040,830 1000,980 960,1040 C990,1100 1040,1140 1010,1170 C980,1190 960,1200 970,1250 C980,1300 950,1330 900,1330 C860,1340 850,1400 820,1430 C780,1470 700,1450 640,1450 C620,1500 620,1560 630,1640" fill="none" stroke="#bfefff" stroke-width="10" opacity=".85" filter="url(#glow)"/>`;
  s += `<path d="M300,1500 C300,1380 250,1330 190,1250 C120,1150 110,700 330,520 C520,370 860,400 960,640 C1040,830 1000,980 960,1040 L900,1330 C860,1340 850,1400 820,1430 C780,1470 700,1450 640,1450 L630,1640 L300,1640Z" fill="#0f4652" opacity=".5"/>`;
  // cérebro
  const id = uid('bc');
  s += `<defs><clipPath id="${id}"><path d="M260,900 C230,660 420,540 600,550 C800,560 930,680 920,860 C910,1000 800,1060 640,1060 C520,1110 380,1080 330,1020 C280,990 265,950 260,900Z"/></clipPath></defs>`;
  s += `<path d="M260,900 C230,660 420,540 600,550 C800,560 930,680 920,860 C910,1000 800,1060 640,1060 C520,1110 380,1080 330,1020 C280,990 265,950 260,900Z" fill="#3b2b4a" opacity=".6" stroke="#f3a6d6" stroke-width="6"/>`;
  const r = rng(21);
  let sq = '';
  for (let i = 0; i < 46; i++) { let x = 250 + r() * 680, y = 540 + r() * 560, d = `M${x},${y}`; for (let k = 0; k < 5; k++) { x += (r() - .5) * 120; y += (r() - .5) * 90; d += ` Q${x + (r() - .5) * 60},${y + (r() - .5) * 60} ${x},${y}`; } sq += `<path d="${d}" stroke="#f08ccd" stroke-width="5" fill="none" opacity=".75"/>`; }
  s += `<g clip-path="url(#${id})">${sq}</g>`;
  s += `<path d="M540,1120 C520,1240 560,1320 600,1380" stroke="#bfefff" stroke-width="40" fill="none" opacity=".35" stroke-linecap="round"/>`;
  // hipocampo
  s += `<path d="M470,960 C520,1040 640,1040 690,980 C720,940 690,900 650,915" stroke="#f0c48a" stroke-width="34" fill="none" stroke-linecap="round" opacity=".9"/>`;
  s += txt(590, 1090, 'HIPOCAMPO', 26, '#bfefff', { fam: 'NU', w: 800, ls: 3, op: .9 });
  return s;
}
function bubble(cx, cy, r, inner, opts = {}) {
  const id = uid('bb');
  return `<defs><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>
  <circle cx="${cx}" cy="${cy}" r="${r + 16}" fill="${opts.glow || '#ffe2b0'}" opacity=".35" filter="url(#b18)"/>
  <g clip-path="url(#${id})">${inner}</g>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${opts.ring || '#fff3dc'}" stroke-width="8" opacity=".9"/>
  <path d="M${cx - r * .6},${cy - r * .55} A${r * .8},${r * .8} 0 0 1 ${cx + r * .1},${cy - r * .85}" stroke="#fff" stroke-width="8" fill="none" opacity=".45" stroke-linecap="round"/>`;
}
function spider(x, y, s, col = '#1a1a1a') {
  let sp = `<ellipse cx="0" cy="20" rx="34" ry="44" fill="${col}"/><circle cx="0" cy="-34" r="24" fill="${col}"/>`;
  for (const sd of [-1, 1]) for (let i = 0; i < 4; i++) { const a = -50 + i * 32; sp += `<path d="M0,0 Q${sd * 70},${a - 30} ${sd * 110},${a + 40}" stroke="${col}" stroke-width="9" fill="none" stroke-linecap="round"/>`; }
  sp += `<circle cx="-8" cy="-40" r="4" fill="#c33"/><circle cx="8" cy="-40" r="4" fill="#c33"/>`;
  return g(sp, `translate(${x},${y}) scale(${s})`);
}
function card(x, y, w, h, inner, opts = {}) {
  const tilt = opts.tilt || 0;
  let c = `<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="26" fill="${opts.bg || '#ffffff'}" fill-opacity="${opts.op || .18}" stroke="${opts.border || '#ffffff'}" stroke-opacity=".8" stroke-width="${opts.bw || 4}"/>`;
  c += inner;
  if (opts.shine != null) { const sx = -w + opts.shine * w * 2.2; c += `<defs><clipPath id="cc${UID}"><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="26"/></clipPath></defs><g clip-path="url(#cc${UID++})"><path d="M${sx},${-h / 2} l120,0 l-260,${h} l-120,0z" fill="#fff" opacity=".18"/></g>`; }
  return g(c, `translate(${x},${y}) rotate(${tilt}) scale(${opts.s || 1})`, `filter="url(#sh)"`);
}
function phone(x, y, s, rot, screen) {
  return g(`<rect x="-120" y="-230" width="240" height="460" rx="36" fill="#15181d"/><rect x="-106" y="-212" width="212" height="424" rx="26" fill="#2b5d7a"/>${screen || ''}<rect x="-34" y="-222" width="68" height="12" rx="6" fill="#0b0d10"/>`, `translate(${x},${y}) rotate(${rot}) scale(${s})`);
}
function chatScreen(op = 1) {
  let s = '';
  const rows = [[-90, -170, 150, '#e9eef2'], [-30, -110, 130, '#7ed3a6'], [-90, -50, 170, '#e9eef2'], [-10, 10, 110, '#7ed3a6'], [-90, 70, 140, '#e9eef2'], [-40, 130, 140, '#7ed3a6']];
  for (const [x, y, w, c] of rows) s += `<rect x="${x}" y="${y}" width="${w}" height="44" rx="20" fill="${c}" opacity="${op}"/>`;
  return s;
}
