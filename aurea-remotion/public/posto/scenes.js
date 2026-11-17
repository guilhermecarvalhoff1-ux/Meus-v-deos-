// O CORSA DO AVÔ — EP1 O POSTO — personagens (base copiada do Áurea Ep2)
const SKIN_DEFS = `<linearGradient id="sk2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e0a271"/><stop offset="1" stop-color="#c27b4c"/></linearGradient>
<linearGradient id="hoodG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4a5262"/><stop offset="1" stop-color="#262b35"/></linearGradient>
<linearGradient id="hunterG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4f7a44"/><stop offset="1" stop-color="#2f4a2a"/></linearGradient>
<radialGradient id="slimeG" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#b8fff0"/><stop offset=".55" stop-color="#4fd8c4"/><stop offset="1" stop-color="#1f8f9a"/></radialGradient>
<radialGradient id="slimeIn" cx=".5" cy=".7" r=".6"><stop offset="0" stop-color="#e8fffa" stop-opacity=".9"/><stop offset="1" stop-color="#7fe8d8" stop-opacity="0"/></radialGradient>
<linearGradient id="wolfG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5d6570"/><stop offset=".6" stop-color="#8a929c"/><stop offset="1" stop-color="#b8bec5"/></linearGradient>`;

function hoodCol(o) { return o.hairCol === '#3f6a3a' ? 'url(#hunterG)' : (o.hairCol || 'url(#hoodG)'); }
function headG(o) {
  let s = `<defs>${SKIN_DEFS}</defs>`;
  const hood = o.hair === 'hood';
  if (hood) s += `<path d="M-112,30 C-122,-120 -50,-150 0,-150 C50,-150 122,-120 112,30 C110,96 76,124 0,124 C-76,124 -110,96 -112,30Z" fill="${hoodCol(o)}"/>`;
  if (o.hair === 'marina') s += hairBack('marina', o.hairCol);
  s += `<ellipse cx="-62" cy="6" rx="13" ry="19" fill="#b8734a"/><ellipse cx="62" cy="6" rx="13" ry="19" fill="#b8734a"/><ellipse cx="-62" cy="6" rx="6" ry="10" fill="#9a5c3a"/><ellipse cx="62" cy="6" rx="6" ry="10" fill="#9a5c3a"/>`;
  s += `<path d="M-62,-40 C-62,-88 62,-88 62,-40 L60,26 C56,66 32,82 0,82 C-32,82 -56,66 -60,26Z" fill="url(#sk2)"/>`;
  s += `<path d="M30,-70 C58,-50 62,0 58,30 C54,62 32,80 4,82 C34,60 44,20 30,-70Z" fill="#a8653e" opacity=".22"/>`;
  s += `<ellipse cx="-30" cy="30" rx="14" ry="8" fill="#e8806a" opacity=".18"/><ellipse cx="30" cy="30" rx="14" ry="8" fill="#e8806a" opacity=".18"/>`;
  s += `<path d="M2,8 q6,14 -4,18" stroke="#a8653e" stroke-width="4" fill="none" stroke-linecap="round" opacity=".55"/>`;
  if (o.hair === 'short') s += `<path d="M-66,-20 C-72,-92 -20,-104 6,-102 C50,-100 74,-80 66,-20 C60,-48 40,-60 20,-58 C10,-70 -14,-68 -24,-56 C-44,-58 -60,-44 -66,-20Z" fill="${o.hairCol || '#1f1a17'}"/><path d="M-40,-86 C-10,-98 30,-96 50,-80" stroke="#4a403a" stroke-width="5" fill="none" opacity=".6"/>`;
  else if (!hood) s += hairFront(o.hair, o.hairCol);
  if (hood) s += `<path d="M-100,40 C-104,-96 -40,-122 0,-122 C40,-122 104,-96 100,40 C92,-50 60,-80 0,-80 C-60,-80 -92,-50 -100,40Z" fill="${hoodCol(o)}"/><path d="M-96,20 C-90,-60 -50,-86 0,-86 C50,-86 90,-60 96,20" stroke="#000" stroke-width="10" fill="none" opacity=".12"/>`;
  s += face2(o);
  if (o.headband) s += `<path d="M-66,-40 C-40,-72 40,-72 66,-40" stroke="#eef6fb" stroke-width="10" fill="none" stroke-linecap="round"/>`;
  return s;
}
function face2base(o) {
  const lx = o.look || 0; let s = '';
  const ey = -6;
  if (o.eyes === 'closed') s += `<path d="M${-34 + lx},${ey} q11,9 22,0 M${12 + lx},${ey} q11,9 22,0" stroke="#2a1d17" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  else if (o.blink) s += `<path d="M${-32 + lx},${ey} h18 M${14 + lx},${ey} h18" stroke="#2a1d17" stroke-width="5" stroke-linecap="round"/>`;
  else { const r = o.eyes === 'wide' ? 9 : 7.5; s += `<ellipse cx="${-23 + lx}" cy="${ey}" rx="${r}" ry="${r * 1.1}" fill="#1e1612"/><ellipse cx="${23 + lx}" cy="${ey}" rx="${r}" ry="${r * 1.1}" fill="#1e1612"/><circle cx="${-20 + lx}" cy="${ey - 3}" r="2.4" fill="#fff"/><circle cx="${26 + lx}" cy="${ey - 3}" r="2.4" fill="#fff"/>`; }
  const b = o.brows || 'neutral', bc = '#2a1d17';
  const br = { neutral: [-2, 2], sad: [12, -12], serious: [-14, 14], angry: [-18, 18], up: [-6, 6] }[b] || [0, 0];
  const by = b === 'up' ? -36 : -28;
  s += `<rect x="${-40 + lx}" y="${by - 4}" width="28" height="9" rx="4.5" fill="${bc}" transform="rotate(${br[0]},${-26 + lx},${by})"/><rect x="${12 + lx}" y="${by - 4}" width="28" height="9" rx="4.5" fill="${bc}" transform="rotate(${br[1]},${26 + lx},${by})"/>`;
  const m = o.mouth || 'flat', mc = '#4a2418';
  if (m === 'flat') s += `<path d="M${-12 + lx},40 h24" stroke="${mc}" stroke-width="5" stroke-linecap="round"/>`;
  else if (m === 'smile') s += `<path d="M${-16 + lx},36 q16,14 32,0" stroke="${mc}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  else if (m === 'sad') s += `<path d="M${-14 + lx},44 q14,-10 28,0" stroke="${mc}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  else if (m === 'o') s += `<ellipse cx="${lx}" cy="42" rx="8" ry="10" fill="${mc}"/>`;
  else if (m === 'small') s += `<path d="M${-7 + lx},40 h14" stroke="${mc}" stroke-width="5" stroke-linecap="round"/>`;
  else if (m === 'open') s += `<path d="M${-13 + lx},34 q13,18 26,0 z" fill="${mc}"/>`;
  return s;
}
function fullBody(o, t = 0) {
  const top = o.top || '#6b4a32', legs = o.legs || '#3a3a2e';
  const hunter = (o.head && o.head.hair) ? o.head.hair === 'hood' : true;
  const step = o.walk ? Math.sin(t * 8) * 14 : 0, br = 1 + .01 * Math.sin(t * 2.4);
  let b = `<ellipse cx="0" cy="4" rx="130" ry="22" fill="#000" opacity=".25" filter="url(#b5)"/>`;
  for (const [lx, sg] of [[-34, 1], [34, -1]]) b += g(`<path d="M-26,0 L26,0 L22,280 L-22,280Z" fill="${legs}"/><path d="M8,0 L26,0 L22,280 L10,280Z" fill="#000" opacity=".15"/><path d="M-28,250 L30,250 L44,300 L-30,300Z" fill="#3a2a1e"/><rect x="-32" y="294" width="78" height="10" rx="4" fill="#24180f"/>`, `translate(${lx},-300) rotate(${sg * step},0,0)`);
  b += g(`<path d="M-96,0 L-84,-250 C-60,-290 60,-290 84,-250 L96,0Z" fill="${top}"/><path d="M40,-280 C84,-260 92,-120 96,0 L56,0 C60,-120 56,-220 40,-280Z" fill="#000" opacity=".18"/><path d="M-96,0 L96,0 L100,40 L-100,40Z" fill="${top}"/><rect x="-100" y="-34" width="200" height="30" fill="#3a2a1e"/><rect x="-16" y="-38" width="32" height="38" rx="4" fill="#c9a24a"/><rect x="40" y="-30" width="44" height="54" rx="8" fill="#5a4030"/>` + (hunter ? `<path d="M-70,-270 C-40,-230 40,-230 70,-270 L80,-250 C40,-200 -40,-200 -80,-250Z" fill="#000" opacity=".25"/>` : ''), `translate(0,-270) scale(1,${br})`);
  const aL = o.armL ?? 10, aR = o.armR ?? -10;
  const arm = (item) => `<path d="M-24,0 L24,0 L18,220 L-18,220Z" fill="${top}"/><path d="M6,0 L24,0 L18,220 L8,220Z" fill="#000" opacity=".15"/><rect x="-20" y="200" width="40" height="40" rx="10" fill="#2a2420"/><circle cx="0" cy="250" r="26" fill="#2a2420"/>` + (item || '');
  b += g(arm(), `translate(-98,-530) rotate(${aL})`);
  b += g(arm(o.item), `translate(98,-530) rotate(${aR})`);
  b += g(headG({ ...HUNTER, ...o.head }), 'translate(0,-640) scale(.95)');
  return g(b, `translate(${o.x},${o.y}) scale(${o.s || 1}) ${o.flip ? 'scale(-1,1)' : ''}`);
}
function bust(o) {
  let s = '';
  const hood = o.hair === 'hood';
  const top = hood ? hoodCol(o) : (o.top || '#3b4150');
  const br = o.breath != null ? 1 + .012 * Math.sin(o.breath * 2.2) : 1;
  // tronco: ombros largos e caídos, começa logo abaixo do queixo
  s += `<path d="M-200,520 C-205,300 -185,175 -110,140 C-60,120 60,120 110,140 C185,175 205,300 200,520Z" fill="${top}"/>`;
  s += `<path d="M110,140 C185,175 205,300 200,520 L140,520 C150,330 140,210 90,150Z" fill="#000" opacity=".18"/>`;
  s += `<path d="M-110,140 C-150,160 -170,200 -178,260" stroke="#fff" stroke-width="10" fill="none" opacity=".08" stroke-linecap="round"/>`;
  // pescoço curto
  s += `<path d="M-30,80 L30,80 L34,138 C10,150 -10,150 -34,138Z" fill="#b06e44"/>`;
  if (o.outfit === 'hoodie' || hood) s += `<path d="M-84,132 C-60,190 60,190 84,132 C70,124 -70,124 -84,132Z" fill="#000" opacity=".25"/><path d="M-22,176 L-28,290 M22,176 L28,290" stroke="#d8d2c8" stroke-width="6" stroke-linecap="round" opacity="${hood ? .75 : 0}"/><circle cx="-28" cy="294" r="6" fill="#d8d2c8" opacity="${hood ? .75 : 0}"/><circle cx="28" cy="294" r="6" fill="#d8d2c8" opacity="${hood ? .75 : 0}"/>`;
  if (o.outfit === 'suit') s += `<path d="M-40,136 L0,240 L40,136Z" fill="#eef0f2"/><path d="M-8,150 L8,150 L12,250 L0,270 L-12,250Z" fill="#23262c"/>`;
  s += g(headG(o), 'translate(0,0) scale(1.08)');
  return g(s, `translate(${o.x},${o.y + 20 * (o.s || 1)}) scale(${(o.s || 1)},${(o.s || 1) * br})`);
}
function hand(x, y, s, rot = 0, opts = {}) {
  const sk = opts.glove ? '#2a2420' : (opts.skin || '#d08c5c'), shade = opts.glove ? '#1a1612' : '#b06e44';
  let h = '';
  if (opts.sleeve) h += `<path d="M-60,70 L60,70 L70,600 L-70,600Z" fill="${opts.sleeve}"/><path d="M20,70 L60,70 L70,600 L36,600Z" fill="#000" opacity=".15"/><rect x="-66" y="60" width="132" height="34" rx="14" fill="${opts.sleeve}"/>`;
  if (opts.watch) h += `<rect x="-52" y="40" width="104" height="28" rx="10" fill="#e0b44c"/><rect x="-22" y="32" width="44" height="44" rx="12" fill="#f3d27a" stroke="#b88a2a" stroke-width="4"/>`;
  if (opts.fist) {
    h += `<path d="M-56,-60 C-60,-100 60,-104 58,-60 L56,30 C50,60 -50,60 -54,30Z" fill="${sk}"/>`;
    h += `<path d="M-30,-92 v40 M-2,-96 v42 M26,-92 v40" stroke="${shade}" stroke-width="5" stroke-linecap="round" opacity=".7"/>`;
    h += `<path d="M-56,-20 C-90,-30 -96,10 -60,20" fill="${sk}" stroke="${shade}" stroke-width="3"/>`;
  } else {
    h += `<path d="M-52,60 C-56,0 -54,-60 -50,-110 C-48,-138 -22,-140 -20,-112 L-18,-130 C-16,-160 12,-160 14,-130 L16,-118 C18,-146 44,-146 46,-116 L48,-60 C66,-80 90,-70 80,-44 L54,40 C46,70 -46,74 -52,60Z" fill="${sk}"/>`;
    h += `<path d="M-20,-112 L-20,-50 M15,-120 L15,-50" stroke="${shade}" stroke-width="4" stroke-linecap="round" opacity=".55"/>`;
    h += `<path d="M30,10 C40,40 20,60 -10,60" stroke="${shade}" stroke-width="4" fill="none" opacity=".35"/>`;
  }
  return g(h, `translate(${x},${y}) rotate(${rot}) scale(${opts.mirror ? -s : s},${s})`);
}

// =====================================================================
// O CORSA DOS 18 — cenas
// =====================================================================
const HUNTER = { hair: 'short', hairCol: '#2a1d17', top: '#2d4a7a', outfit: 'hoodie' };
const LUCAS = { hair: 'short', hairCol: '#2a1d17', top: '#2d4a7a', outfit: 'hoodie' };
const VOVO = { hair: 'short', hairCol: '#1a1410', top: '#e8e2d4', outfit: 'shirt', must: true };
const GOLD = '#ffc928', JP = 'WenQuanYi Zen Hei';
function blades() { return ''; }
function gameMeadow() { return ''; }
function face2(o) {
  let s = face2base(o.must ? { ...o, mouth: o.mouth === 'smile' ? 'smile' : 'flat' } : o);
  if (o.must) s += `<path d="M-30,26 C-20,16 -6,20 0,24 C6,20 20,16 30,26 C24,34 10,32 0,30 C-10,32 -24,34 -30,26Z" fill="#1a1410"/>`;
  return s;
}
const PART = { words: 'words.json', end: 90, abTime: 81.5, manualChunks: true, noCapsFrom: 81.5, merges: [], hl: ['vinte','corsa','abastecer','missão','carro','teu','dia','casa','cheiro','vô','vergonha','careca','pneu','tio','embora','avô','lembrou','firme','posto','bonito','rua','melhor','projeto','corsa','comenta','junto'] };

// ---------- utilidades ----------
function pop(p, a, d = .12) { const k = seg(p, a, a + d); return k <= 0 ? 0.001 : k < 1 ? 1.25 - .25 * Math.cos(k * Math.PI) * (1 - k) - .25 * (1 - k) : 1; }
function panel(x, y, w, h, inner, o = {}) {
  return g(`<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${o.r || 26}" fill="${o.fill || '#101218'}" opacity="${o.op ?? .9}" stroke="${o.stroke || GOLD}" stroke-width="${o.sw ?? 5}"/>` + inner, `translate(${x},${y}) scale(${o.s ?? 1}) rotate(${o.rot || 0})`, 'filter="url(#sh)"');
}
function bigNum(x, y, s, size, col = GOLD, o = {}) {
  return txt(x, y, s, size, col, { w: 900, ls: o.ls || 2, extra: `stroke="${o.stroke || '#000'}" stroke-width="${o.sw ?? 12}" paint-order="stroke"` });
}
function dust(seed, n, x0, y0, w, h, t) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) { const x = x0 + r() * w, y = y0 + ((r() * h - t * (8 + r() * 14)) % h + h) % h, rr = 1.5 + r() * 3.5; s += `<circle cx="${x}" cy="${y}" r="${rr}" fill="#ffe9b0" opacity="${.15 + r() * .35}"/>`; }
  return s;
}

// ---------- o Corsa (vista lateral, frente para a direita, chão em y=0) ----------
const BODY = 'M-360,-70 C-370,-120 -372,-180 -358,-205 L-320,-290 C-312,-305 -297,-312 -277,-312 L80,-312 C110,-312 125,-300 140,-285 L225,-200 C300,-190 370,-180 405,-165 C430,-150 440,-120 440,-90 L435,-62 C435,-52 425,-48 415,-48 L-345,-48 C-355,-48 -360,-58 -360,-70Z';
function corsa(x, y, s, o = {}) {
  const low = (o.low || 0) * 34, jdm = o.jdm || 0, id = uid('cs');
  const col = o.col || (o.dust ? '#a3a7aa' : '#c3cad1');
  let c = `<defs>${linGrad(id + 'b', [[0, '#ffffff', .55], [.35, col, 1], [.7, col, 1], [1, '#3a3e44', 1]])}${linGrad(id + 'g', [[0, '#5b6b7c'], [.5, '#1f2833'], [1, '#121820']], 1, 1)}<clipPath id="${id}c"><path d="${BODY}"/></clipPath>${radGrad(id + 'n', [[0, '#c04dff', .9], [1, '#c04dff', 0]])}</defs>`;
  // sombra de contato
  c += `<ellipse cx="0" cy="4" rx="470" ry="34" fill="#000" opacity=".45" filter="url(#b10)"/>`;
  if (jdm > 0) c += `<ellipse cx="0" cy="0" rx="520" ry="60" fill="url(#${id}n)" opacity="${jdm}"/>`;
  let b = `<path d="${BODY}" fill="${col}"/><path d="${BODY}" fill="url(#${id}b)"/>`;
  b += `<path d="M-336,-205 L-306,-280 C-300,-292 -290,-296 -278,-296 L75,-296 C98,-296 110,-288 122,-276 L196,-205 Z" fill="url(#${id}g)"/>`;
  b += `<path d="M-270,-290 L-170,-290 L-240,-210 L-320,-210Z" fill="#fff" opacity=".12"/><path d="M0,-290 L60,-290 L-10,-210 L-70,-210Z" fill="#fff" opacity=".1"/>`;
  b += `<rect x="-238" y="-298" width="26" height="96" fill="${col}"/><rect x="-238" y="-298" width="26" height="96" fill="#000" opacity=".12"/>`;
  b += `<path d="M-232,-202 L-226,-62 M204,-198 L210,-72" stroke="#2a2d32" stroke-width="4" fill="none" opacity=".7"/><rect x="-206" y="-186" width="44" height="12" rx="6" fill="#2a2d32"/>`;
  b += `<rect x="-362" y="-128" width="802" height="18" fill="#26282c"/>`;
  b += `<path d="M-368,-118 L-312,-118 L-312,-50 L-360,-50Z M378,-122 L442,-122 L440,-52 L378,-52Z" fill="#202226"/>`;
  b += `<path d="M398,-162 L436,-150 L440,-126 L402,-130Z" fill="#eef3f7" stroke="#2a2d32" stroke-width="3"/><rect x="-368" y="-198" width="22" height="66" rx="6" fill="#b3201f"/><rect x="-364" y="-192" width="8" height="46" rx="3" fill="#ff6b5a" opacity=".6"/>`;
  b += `<path d="M-340,-200 C-200,-214 100,-214 210,-200" stroke="#fff" stroke-width="5" fill="none" opacity=".35"/>`;
  if (jdm > 0) {
    b += `<g opacity="${jdm}"><path d="M-360,-110 L440,-110 L440,-98 L-360,-98Z" fill="${GOLD}"/>` + txt(-60, -148, 'JDM BR', 46, '#1b1c20', { w: 900, ls: 6 }) + `<text x="-330" y="-232" font-family="${JP}" font-size="42" fill="#fff" stroke="#000" stroke-width="2" font-weight="700">走り屋</text></g>`;
  }
  if (o.dust) { const r = rng(17); let d = ''; for (let i = 0; i < 160; i++) d += `<circle cx="${-370 + r() * 810}" cy="${-320 + r() * 280}" r="${2 + r() * 6}" fill="#7a6a52" opacity="${.12 + r() * .25}"/>`; b += `<g clip-path="url(#${id}c)">${d}<rect x="-450" y="-330" width="900" height="300" fill="#8a7a5e" opacity=".18"/></g>`; }
  // retrovisor
  const m = o.mirror === false ? null : (o.mirror || { dx: 0, dy: 0, rot: 0 });
  if (m) b += g(`<path d="M0,0 L40,-8 L46,24 L4,26Z" fill="${col}" stroke="#2a2d32" stroke-width="3"/><path d="M8,4 L36,-1 L40,20 L10,21Z" fill="#26313c"/>`, `translate(${206 + m.dx},${-222 + m.dy}) rotate(${m.rot})`);
  if (jdm > 0) b += `<path d="M-362,-300 L-272,-318 L-264,-300 L-352,-286Z" fill="#1b1c20" opacity="${jdm}"/><path d="M370,-56 L450,-56 L446,-40 L376,-40Z" fill="#1b1c20" opacity="${jdm}"/>`;
  c += g(b, `translate(0,${low})`);
  // caixas de roda + rodas
  for (const wx of [-215, 280]) {
    c += `<path d="M${wx - 94},${-48 + low} A94,94 0 0 1 ${wx + 94},${-48 + low}Z" fill="#101114"/>`;
    const rr = o.spin || 0;
    let wh = `<circle r="74" fill="#18191c"/><circle r="74" fill="none" stroke="#2c2e33" stroke-width="6"/>`;
    const rimR = lerp(44, 60, jdm), rimC = jdm > .5 ? '#d4a23a' : '#9aa1a8';
    wh += `<circle r="${rimR}" fill="${rimC}"/><circle r="${rimR - 6}" fill="${jdm > .5 ? '#b8862a' : '#7d848b'}"/>`;
    const n = jdm > .5 ? 6 : 4;
    for (let k = 0; k < n; k++) wh += `<rect x="-6" y="${-rimR + 8}" width="12" height="${rimR - 16}" rx="5" fill="${jdm > .5 ? '#f0c45a' : '#5f656c'}" transform="rotate(${k * 360 / n})"/>`;
    wh += `<circle r="12" fill="#2a2d32"/>`;
    c += g(wh, `translate(${wx},-74) rotate(${rr})`);
  }
  if (o.bow) {
    c += g(`<rect x="-16" y="-312" width="32" height="264" fill="#d8262a"/><rect x="-16" y="-312" width="12" height="264" fill="#fff" opacity=".18"/>` + g(`<ellipse cx="-56" cy="0" rx="62" ry="34" fill="#d8262a" transform="rotate(-18,-56,0)"/><ellipse cx="56" cy="0" rx="62" ry="34" fill="#d8262a" transform="rotate(18,56,0)"/><ellipse cx="-56" cy="-6" rx="34" ry="14" fill="#ff6a5e" opacity=".5" transform="rotate(-18,-56,0)"/><path d="M-10,10 L-50,70 L-30,72 L0,20 L30,72 L50,70 L10,10Z" fill="#b31e22"/><circle r="22" fill="#b31e22"/>`, 'translate(0,-340)'), `translate(0,${low})`);
  }
  const f = o.sepia ? 'filter="url(#sepia)"' : '';
  return g(c, `translate(${x},${y}) scale(${o.flip ? -s : s},${s})`, f);
}
// carro novo genérico (para "um carro mais novo")
function newCar(x, y, s, col = '#c8312e') {
  const id = uid('nc');
  let c = `<defs>${linGrad(id, [[0, '#ffffff', .5], [.4, col, 1], [1, '#2a0e0e', 1]])}</defs><ellipse cx="0" cy="4" rx="460" ry="30" fill="#000" opacity=".45" filter="url(#b10)"/>`;
  const p = 'M-440,-70 C-450,-150 -420,-200 -330,-230 C-250,-300 -120,-330 20,-328 C140,-326 220,-280 290,-220 C380,-205 440,-170 448,-110 L446,-60 C444,-50 434,-48 424,-48 L-420,-48 C-432,-48 -440,-58 -440,-70Z';
  c += `<path d="${p}" fill="${col}"/><path d="${p}" fill="url(#${id})"/><path d="M-300,-230 C-220,-295 -110,-312 10,-310 C120,-308 190,-270 250,-224Z" fill="#1c2430"/><path d="M-60,-306 L-50,-226" stroke="${col}" stroke-width="16"/><path d="M380,-170 L444,-140 L440,-124 L378,-140Z" fill="#eaf4ff"/>`;
  for (const wx of [-270, 270]) c += `<path d="M${wx - 92},-48 A92,92 0 0 1 ${wx + 92},-48Z" fill="#101114"/>` + g(`<circle r="76" fill="#18191c"/><circle r="56" fill="#c9ced3"/><circle r="48" fill="#9aa1a8"/><circle r="12" fill="#2a2d32"/>`, `translate(${wx},-76)`);
  return g(c, `translate(${x},${y}) scale(${s})`);
}
function cake(x, y, s, t) {
  const fl = 1 + .12 * Math.sin(t * 23) + .06 * Math.sin(t * 37);
  let c = `<ellipse cx="0" cy="8" rx="230" ry="34" fill="#000" opacity=".4" filter="url(#b5)"/><ellipse cx="0" cy="0" rx="240" ry="40" fill="#e8e4dc"/>`;
  c += `<path d="M-180,0 L-180,-170 C-180,-200 180,-200 180,-170 L180,0 C180,30 -180,30 -180,0Z" fill="#6b3a24"/><path d="M-180,-170 C-180,-140 180,-140 180,-170 C180,-200 -180,-200 -180,-170Z" fill="#f4e6d0"/>`;
  c += `<path d="M-180,-160 C-150,-120 -130,-150 -110,-115 C-90,-140 -60,-110 -40,-130 C-10,-105 20,-135 40,-112 C70,-140 100,-108 120,-130 C150,-110 170,-140 180,-160" stroke="#f4e6d0" stroke-width="18" fill="none" stroke-linecap="round"/>`;
  c += `<path d="M120,-170 C140,-190 170,-190 180,-170" fill="none"/>`;
  c += txt(0, -60, '18', 120, GOLD, { w: 900, extra: 'stroke="#5a2a10" stroke-width="8" paint-order="stroke"' });
  c += `<rect x="-8" y="-280" width="16" height="100" rx="5" fill="#f2f2f2"/><path d="M-8,-260 L8,-250 M-8,-230 L8,-220 M-8,-200 L8,-190" stroke="#e23a3a" stroke-width="6"/>`;
  c += g(`<ellipse cx="0" cy="0" rx="40" ry="60" fill="#ffb03a" opacity=".35" filter="url(#b10)"/><path d="M0,-40 C16,-14 18,10 0,20 C-18,10 -16,-14 0,-40Z" fill="#ffd25a"/><path d="M0,-18 C7,-4 7,8 0,12 C-7,8 -7,-4 0,-18Z" fill="#fff6d0"/>`, `translate(0,-300) scale(${1 / fl * 1.1},${fl})`);
  return g(c, `translate(${x},${y}) scale(${s})`);
}

// ---------- cenários ----------
function garage(t, o = {}) {
  const id = uid('ga');
  let s = `<defs>${linGrad(id + 'w', [[0, '#2c3038'], [1, '#191b21']])}${linGrad(id + 'f', [[0, '#34353b'], [1, '#121216']])}${radGrad(id + 'l', [[0, '#ffd58a', .55], [.6, '#ffb860', .12], [1, '#000', 0]])}</defs>`;
  s += `<rect width="${W}" height="${H}" fill="url(#${id}w)"/>`;
  // blocos de concreto
  for (let yy = 140; yy < 1150; yy += 90) for (let xx = (yy / 90 % 2) * 90 - 90; xx < W; xx += 180) s += `<rect x="${xx}" y="${yy}" width="176" height="86" fill="#fff" opacity=".025"/>`;
  // prateleira e ferramentas (desfocadas)
  s += `<g filter="url(#b5)" opacity=".85"><rect x="60" y="560" width="420" height="16" fill="#4a3a2a"/><rect x="90" y="470" width="60" height="90" rx="8" fill="#a83a2a"/><rect x="170" y="490" width="50" height="70" rx="6" fill="#3a6a8a"/><rect x="240" y="440" width="70" height="120" rx="10" fill="#c9a24a"/><rect x="330" y="500" width="110" height="60" rx="8" fill="#5a5a5a"/>`;
  s += `<rect x="640" y="360" width="340" height="420" fill="#3a3326"/>`;
  for (let i = 0; i < 6; i++) for (let j = 0; j < 7; j++) s += `<circle cx="${660 + i * 60}" cy="${380 + j * 60}" r="5" fill="#1c1a14"/>`;
  s += `<path d="M700,420 L720,600 M690,420 h20 M690,600 h60" stroke="#9aa1a8" stroke-width="16" stroke-linecap="round"/><path d="M800,400 L800,560 M780,400 h40" stroke="#9aa1a8" stroke-width="14" stroke-linecap="round"/><path d="M900,420 C880,470 920,520 900,600" stroke="#c9483a" stroke-width="20" fill="none" stroke-linecap="round"/></g>`;
  // piso
  s += `<rect y="1150" width="${W}" height="${H - 1150}" fill="url(#${id}f)"/><rect y="1146" width="${W}" height="8" fill="#000" opacity=".4"/>`;
  s += `<ellipse cx="300" cy="1500" rx="140" ry="26" fill="#000" opacity=".3"/><ellipse cx="760" cy="1640" rx="90" ry="18" fill="#000" opacity=".25"/>`;
  // lâmpada pendurada
  const sw = Math.sin(t * 1.3) * 10;
  if (!o.noBulb) s += `<path d="M540,0 L${540 + sw},210" stroke="#0a0c10" stroke-width="5"/><circle cx="${540 + sw}" cy="232" r="24" fill="#fff2c4" filter="url(#glow2)"/>`;
  s += `<ellipse cx="540" cy="1000" rx="${o.lightR || 620}" ry="900" fill="url(#${id}l)"/>`;
  s += dust(3, 40, 0, 200, W, 1100, t);
  return s;
}
function lab(t, o = {}) {
  const id = uid('lb');
  let s = `<defs>${linGrad(id, [[0, o.c1 || '#13182a'], [1, o.c2 || '#070912']])}${radGrad(id + 'r', [[0, o.glow || '#3a5aff', .35], [1, '#000', 0]])}</defs><rect width="${W}" height="${H}" fill="url(#${id})"/><ellipse cx="540" cy="760" rx="700" ry="700" fill="url(#${id}r)"/>`;
  // piso em grade com perspectiva
  for (let i = -10; i <= 10; i++) s += `<path d="M540,1080 L${540 + i * 260},${H}" stroke="#5a7aff" stroke-width="2" opacity=".18"/>`;
  for (let k = 0; k < 9; k++) { const yy = 1080 + Math.pow(k / 8, 1.8) * 840 + ((t * 30) % 40) * (k / 8); s += `<path d="M0,${yy} H${W}" stroke="#5a7aff" stroke-width="2" opacity=".14"/>`; }
  s += `<rect y="1060" width="${W}" height="60" fill="#5a7aff" opacity=".06" filter="url(#b18)"/>`;
  return s;
}
function neonCity(t, o = {}) {
  const id = uid('nn');
  let s = `<defs>${linGrad(id, [[0, '#120626'], [.6, '#3a0f4a'], [1, '#7a1f5a']])}${linGrad(id + 'r', [[0, '#2a0f3a'], [1, '#08040e']])}</defs><rect width="${W}" height="${H}" fill="url(#${id})"/>`;
  const r = rng(o.seed || 21);
  s += `<g filter="url(#b5)">`;
  for (let i = 0; i < 12; i++) { const x = i * 100 - 40 + r() * 30, h = 300 + r() * 500, w = 90 + r() * 60; s += `<rect x="${x}" y="${1100 - h}" width="${w}" height="${h}" fill="#0d0718"/>`; for (let k = 0; k < 14; k++) if (r() < .45) s += `<rect x="${x + 10 + (k % 3) * 26}" y="${1100 - h + 20 + Math.floor(k / 3) * 46}" width="14" height="22" fill="${r() < .5 ? '#ff4fd8' : '#4fe0ff'}" opacity=".7"/>`; }
  s += `</g>`;
  s += g(`<rect x="-60" y="-120" width="120" height="240" rx="10" fill="#ff2f6a" opacity=".9" filter="url(#glow)"/><text x="0" y="-30" font-family="${JP}" font-size="70" fill="#fff" text-anchor="middle">東</text><text x="0" y="60" font-family="${JP}" font-size="70" fill="#fff" text-anchor="middle">京</text>`, 'translate(860,600)', 'opacity=".9"');
  s += g(`<rect x="-80" y="-50" width="160" height="100" rx="10" fill="#26e0ff" opacity=".85" filter="url(#glow)"/><text x="0" y="22" font-family="${JP}" font-size="60" fill="#08202a" text-anchor="middle">夜</text>`, 'translate(200,700)');
  s += `<rect y="1100" width="${W}" height="${H - 1100}" fill="url(#${id}r)"/>`;
  for (let i = 0; i < 6; i++) { const x = ((i * 220 - t * 600) % 1320 + 1320) % 1320 - 120; s += `<rect x="${x}" y="1500" width="120" height="14" fill="#ffd25a" opacity=".5"/>`; }
  s += `<rect y="1100" width="${W}" height="400" fill="#ff4fd8" opacity=".08" filter="url(#b30)"/>`;
  return s;
}
function bedroom(t) {
  const id = uid('bd');
  let s = `<defs>${linGrad(id, [[0, '#0b1020'], [1, '#05060c']])}${radGrad(id + 'p', [[0, '#7ab8ff', .55], [1, '#000', 0]])}</defs><rect width="${W}" height="${H}" fill="url(#${id})"/>`;
  s += `<rect x="640" y="200" width="300" height="380" fill="#1a2a4a" opacity=".6"/><path d="M790,200 V580 M640,390 H940" stroke="#05060c" stroke-width="12"/><circle cx="720" cy="280" r="34" fill="#dfe8ff" opacity=".7" filter="url(#glow)"/>`;
  s += `<g filter="url(#b10)"><rect x="40" y="380" width="200" height="260" rx="8" fill="#141a2c"/><rect x="60" y="400" width="160" height="110" fill="#2a3a5a" opacity=".5"/></g>`;
  return s;
}
// celular com tela recortada (tela 400x820, origem no canto da tela)
function phone(x, y, s, rot, screen, o = {}) {
  const id = uid('ph');
  return g(`<defs><clipPath id="${id}"><rect x="0" y="0" width="400" height="820" rx="34"/></clipPath></defs><rect x="-22" y="-22" width="444" height="864" rx="56" fill="#16181d" stroke="#3a3e46" stroke-width="5"/><g clip-path="url(#${id})"><rect width="400" height="820" fill="${o.bg || '#0e1117'}"/>${screen}</g><rect x="150" y="10" width="100" height="22" rx="11" fill="#000"/>`, `translate(${x},${y}) rotate(${rot}) scale(${s}) translate(-200,-410)`, 'filter="url(#sh)"');
}
function bubbleMsg(x, y, w, h, name, msg, me, op = 1, size = 34) {
  const lines = msg.split('|');
  let b = `<rect x="0" y="0" width="${w}" height="${h}" rx="22" fill="${me ? '#1f6b4a' : '#262b36'}"/>`;
  if (name) b += txt(20, 40, name, 26, ['#ffb84a', '#6ad0ff', '#ff7ab0'][name.length % 3], { a: 'start', w: 800 });
  lines.forEach((l, i) => b += txt(20, (name ? 84 : 50) + i * (size + 8), l, size, '#f2f4f8', { a: 'start', w: 700, fam: 'NU' }));
  return g(b, `translate(${x},${y})`, `opacity="${op}"`);
}
function abCard(x, y, s, letter, title, sub, art, col) {
  let c = `<rect x="-470" y="-230" width="940" height="460" rx="36" fill="#0f1118" opacity=".94" stroke="${col}" stroke-width="8"/>`;
  c += `<circle cx="-360" cy="-120" r="80" fill="${col}"/>` + txt(-360, -90, letter, 100, '#111', { w: 900 });
  c += txt(-250, -130, title, 64, '#fff', { a: 'start', w: 900 }) + txt(-250, -66, sub, 40, col, { a: 'start', w: 800 });
  c += art;
  return g(c, `translate(${x},${y}) scale(${s})`, 'filter="url(#sh)"');
}
function keyIcon(x, y, s, rot = 0) {
  return g(`<circle cx="0" cy="0" r="46" fill="#2a2d32"/><circle cx="0" cy="0" r="16" fill="#0e0f12"/>` + txt(0, 14, '', 1, '#fff') + `<rect x="34" y="-14" width="150" height="28" rx="8" fill="#c9ced3"/><path d="M110,14 v20 h16 v-20 M150,14 v14 h16 v-14" fill="#c9ced3"/><rect x="34" y="-14" width="150" height="8" fill="#fff" opacity=".4"/>`, `translate(${x},${y}) rotate(${rot}) scale(${s})`);
}
function japan(x, y, s) {
  const p = 'M120,-260 C150,-240 170,-200 150,-170 C140,-140 110,-120 100,-90 C80,-40 60,0 20,40 C-10,70 -60,90 -110,110 C-150,126 -190,150 -220,180 L-240,170 C-210,130 -170,100 -130,80 C-80,56 -40,30 -10,-10 C20,-50 50,-100 70,-150 C80,-190 90,-230 120,-260Z';
  return g(`<path d="${p}" fill="#e8ecf2"/><path d="M150,-330 C190,-320 210,-290 190,-270 C170,-260 140,-280 140,-300Z" fill="#e8ecf2"/><path d="M-250,190 C-230,200 -230,230 -260,236 C-280,226 -276,200 -250,190Z" fill="#e8ecf2"/><circle cx="-20" cy="20" r="26" fill="#d8262a"/>`, `translate(${x},${y}) scale(${s})`);
}


// =====================================================================
// O CORSA DO AVÔ — EPISÓDIO 1: O POSTO (cenas por tempo; sem voz por enquanto)
// =====================================================================
const KID = { hair: 'kid', hairCol: '#3a2416', top: '#e8b030', outfit: 'shirt' };
const AVO_VELHO = { hair: 'grey', hairCol: '#9a9a9a', top: '#7a5a3a', outfit: 'shirt', must: '#c8c8c8' };
const AVO_MEIO = { hair: 'short', hairCol: '#5a5550', top: '#4a5a6a', outfit: 'shirt', must: '#4a4440' };
const AVO_JOVEM = { hair: 'short', hairCol: '#1a1410', top: '#e8e2d4', outfit: 'shirt', must: '#1a1410' };
const FRENT = { hair: 'short', hairCol: '#2a1d17', top: '#1e5aa8', outfit: 'shirt', cap: '#1e5aa8' };
const CARA1 = { hair: 'short', hairCol: '#c9a24a', top: '#1b1b1f', outfit: 'shirt' };
const CARA2 = { hair: 'short', hairCol: '#111', top: '#b3262a', outfit: 'hoodie', cap: '#111' };
const CARA3 = { hair: 'none', top: '#2a8a4a', outfit: 'shirt' };
const MINA = { hair: 'marina', hairCol: '#3a2416', top: '#6a3aa8', outfit: 'shirt' };
const GALERA = [CARA1, MINA, CARA2, CARA3];
const FBF = `<filter id="fbW" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="1.08 .16 0 0 .04  .06 .96 .04 0 .02  0 .1 .66 0 0  0 0 0 1 0"/></filter>`;
function flash(inner, seed) { return `<defs>${FBF}</defs><g filter="url(#fbW)">${inner}</g>` + grain(seed, .16) + vignette(true) + `<rect width="${W}" height="${H}" fill="#ffb060" opacity=".08"/>`; }

// rosto: bigode, boné, suor
function face2(o) {
  let s = face2base(o.must ? { ...o, mouth: o.mouth === 'open' ? 'open' : o.mouth === 'smile' ? 'smile' : 'flat' } : o);
  if (o.must) s += `<path d="M-30,26 C-20,16 -6,20 0,24 C6,20 20,16 30,26 C24,34 10,32 0,30 C-10,32 -24,34 -30,26Z" fill="${o.must}"/>`;
  if (o.cap) s += `<path d="M-68,-40 C-70,-110 70,-110 68,-40Z" fill="${o.cap}"/><path d="M-70,-44 C-30,-54 60,-56 110,-34 C90,-24 40,-30 -70,-36Z" fill="${o.cap}"/><path d="M-70,-44 C-30,-54 60,-56 110,-34" stroke="#000" stroke-width="4" opacity=".25" fill="none"/><circle cx="0" cy="-74" r="14" fill="#ffc928"/>`;
  if (o.sweat) for (const [x, y, k] of [[-46, -50, 0], [50, -40, .4], [56, 4, .7]]) { const yy = y + ((o.sweat * 40 + k * 40) % 40); s += `<path d="M${x},${yy - 14} C${x + 9},${yy} ${x + 9},${yy + 10} ${x},${yy + 10} C${x - 9},${yy + 10} ${x - 9},${yy} ${x},${yy - 14}Z" fill="#bfe6ff" stroke="#6aa8d8" stroke-width="2"/>`; }
  if (o.mouth === 'laugh') s += `<path d="M-30,22 Q0,84 30,22 Z" fill="#4a1810"/><path d="M-26,24 L26,24 L24,32 L-24,32Z" fill="#fff"/><ellipse cx="0" cy="52" rx="14" ry="8" fill="#d8606a"/>`;
  if (o.tearsLaugh) s += `<path d="M-40,4 c-6,10 -6,16 0,16 c6,0 6,-6 0,-16z M40,4 c-6,10 -6,16 0,16 c6,0 6,-6 0,-16z" fill="#bfe6ff"/>`;
  return s;
}
// pessoa de busto com opções extras (braços cruzados, celular na mão)
function pessoa(o) {
  let s = bust(o);
  const S = o.s || 1, tr = `translate(${o.x},${o.y + 20 * S}) scale(${S})`;
  if (o.cruzado) s += g(`<rect x="-176" y="250" width="352" height="96" rx="48" fill="${o.top}"/><rect x="-176" y="250" width="352" height="96" rx="48" fill="#000" opacity=".12"/><rect x="-150" y="300" width="300" height="80" rx="40" fill="${o.top}"/><circle cx="150" cy="290" r="34" fill="#c27b4c"/><circle cx="-150" cy="338" r="34" fill="#c27b4c"/>`, tr);
  if (o.filmando) s += g(`<rect x="-30" y="180" width="60" height="120" rx="12" fill="#c27b4c"/><rect x="-70" y="40" width="140" height="240" rx="18" fill="#16181d" stroke="#3a3e46" stroke-width="6"/><circle cx="40" cy="70" r="12" fill="#ff2f4a"/>`, tr);
  return s;
}
function rindo(o, t, k = 1) { return pessoa({ ...o, eyes: 'closed', mouth: 'open', brows: 'up', tearsLaugh: k > .5, y: o.y + Math.abs(Math.sin(t * 14)) * -14 * k }); }

// ---------- Corsa de frente e de trás ----------
function corsaFront(x, y, s, o = {}) {
  const col = o.col || '#c3cad1', id = uid('cf');
  let c = `<defs>${linGrad(id, [[0, '#ffffff', .5], [.4, col, 1], [1, '#3a3e44', 1]])}${radGrad(id + 'l', [[0, '#fff6d0', .9], [1, '#fff6d0', 0]])}</defs>`;
  c += `<ellipse cx="0" cy="6" rx="400" ry="40" fill="#000" opacity=".5" filter="url(#b10)"/>`;
  if (o.lights) { c += `<ellipse cx="-230" cy="120" rx="300" ry="160" fill="url(#${id}l)" opacity="${.18 * o.dim}"/><ellipse cx="230" cy="120" rx="300" ry="160" fill="url(#${id}l)" opacity=".55"/>`; }
  c += `<rect x="-330" y="-120" width="90" height="120" rx="20" fill="#141518"/><rect x="240" y="-120" width="90" height="120" rx="20" fill="#141518"/>`;
  c += `<path d="M-230,-470 L230,-470 C260,-470 280,-450 290,-420 L330,-290 L-330,-290 L-290,-420 C-280,-450 -260,-470 -230,-470Z" fill="${col}"/><path d="M-210,-450 L210,-450 L280,-300 L-280,-300Z" fill="#1c2430"/><path d="M-150,-440 L-60,-440 L-170,-310 L-250,-310Z" fill="#fff" opacity=".12"/>`;
  c += `<path d="M-350,-280 C-350,-300 350,-300 350,-280 L350,-90 C350,-70 330,-60 310,-60 L-310,-60 C-330,-60 -350,-70 -350,-90Z" fill="${col}"/><path d="M-350,-280 C-350,-300 350,-300 350,-280 L350,-90 C350,-70 330,-60 310,-60 L-310,-60 C-330,-60 -350,-70 -350,-90Z" fill="url(#${id})"/>`;
  c += `<path d="M-370,-330 L-336,-330 L-330,-296 L-366,-300Z M370,-330 L336,-330 L330,-296 L366,-300Z" fill="${col}" stroke="#2a2d32" stroke-width="3"/>`;
  c += `<rect x="-120" y="-220" width="240" height="50" rx="10" fill="#1a1c20"/><circle cx="0" cy="-195" r="14" fill="#9aa1a8"/><rect x="-350" y="-120" width="700" height="60" rx="16" fill="#202226"/><rect x="-70" y="-110" width="140" height="40" rx="4" fill="#f2f2f2"/>` + txt(0, -80, 'VOV-0094', 26, '#1a3a8a', { w: 900 });
  const dimL = o.dim ?? 1;
  c += `<rect x="-320" y="-240" width="170" height="64" rx="14" fill="#e8eef4" stroke="#2a2d32" stroke-width="4"/><rect x="150" y="-240" width="170" height="64" rx="14" fill="#e8eef4" stroke="#2a2d32" stroke-width="4"/>`;
  if (o.lights) c += `<rect x="-320" y="-240" width="170" height="64" rx="14" fill="#fff8d0" opacity="${.25 * dimL}" filter="url(#glow)"/><rect x="150" y="-240" width="170" height="64" rx="14" fill="#fffbe8" filter="url(#glow2)"/>`;
  if (o.dust) c += `<rect x="-350" y="-470" width="700" height="410" fill="#8a7a5e" opacity=".14"/>`;
  return g(c, `translate(${x},${y}) scale(${s})`);
}
function corsaRear(x, y, s, o = {}) {
  const col = o.col || '#c3cad1', id = uid('cr');
  let c = `<defs>${linGrad(id, [[0, '#ffffff', .45], [.4, col, 1], [1, '#3a3e44', 1]])}</defs><ellipse cx="0" cy="6" rx="400" ry="40" fill="#000" opacity=".5" filter="url(#b10)"/>`;
  c += `<rect x="-330" y="-120" width="90" height="120" rx="20" fill="#141518"/><rect x="240" y="-120" width="90" height="120" rx="20" fill="#141518"/>`;
  c += `<path d="M-250,-480 L250,-480 C280,-480 300,-460 306,-430 L340,-80 C340,-66 326,-60 310,-60 L-310,-60 C-326,-60 -340,-66 -340,-80 L-306,-430 C-300,-460 -280,-480 -250,-480Z" fill="${col}"/><path d="M-250,-480 L250,-480 C280,-480 300,-460 306,-430 L340,-80 C340,-66 326,-60 310,-60 L-310,-60 C-326,-60 -340,-66 -340,-80 L-306,-430 C-300,-460 -280,-480 -250,-480Z" fill="url(#${id})"/>`;
  c += `<path d="M-230,-460 L230,-460 L270,-310 L-270,-310Z" fill="#1c2430"/><rect x="-330" y="-290" width="70" height="120" rx="12" fill="#b3201f"/><rect x="260" y="-290" width="70" height="120" rx="12" fill="#b3201f"/>`;
  if (o.brake) c += `<rect x="-330" y="-290" width="70" height="120" rx="12" fill="#ff3a2a" filter="url(#glow)" opacity="${o.brake}"/><rect x="260" y="-290" width="70" height="120" rx="12" fill="#ff3a2a" filter="url(#glow)" opacity="${o.brake}"/>`;
  c += `<rect x="-350" y="-130" width="700" height="70" rx="16" fill="#202226"/><rect x="-70" y="-230" width="140" height="44" rx="4" fill="#f2f2f2"/>` + txt(0, -198, 'VOV-0094', 26, '#1a3a8a', { w: 900 }) + `<rect x="200" y="-80" width="60" height="26" rx="10" fill="#3a3a3a"/>`;
  if (o.dust) c += `<rect x="-340" y="-480" width="680" height="420" fill="#8a7a5e" opacity=".14"/>`;
  return g(c, `translate(${x},${y}) scale(${s})`);
}
// carro tunado (rebaixado, roda dourada, neon embaixo)
function tuned(x, y, s, col, o = {}) {
  const id = uid('tn'), gl = o.glow || '#c04dff';
  let c = `<defs>${linGrad(id, [[0, '#ffffff', .5], [.4, col, 1], [1, '#111', 1]])}${radGrad(id + 'n', [[0, gl, .9], [1, gl, 0]])}</defs><ellipse cx="0" cy="0" rx="520" ry="60" fill="url(#${id}n)"/><ellipse cx="0" cy="4" rx="460" ry="26" fill="#000" opacity=".5" filter="url(#b10)"/>`;
  const p = 'M-440,-50 C-450,-120 -420,-170 -330,-200 C-250,-270 -120,-300 20,-298 C140,-296 220,-250 290,-190 C380,-175 440,-140 448,-80 L446,-40 C444,-30 434,-28 424,-28 L-420,-28 C-432,-28 -440,-38 -440,-50Z';
  c += `<path d="${p}" fill="${col}"/><path d="${p}" fill="url(#${id})"/><path d="M-300,-200 C-220,-265 -110,-282 10,-280 C120,-278 190,-240 250,-194Z" fill="#141a22"/><path d="M-440,-280 L-330,-298 L-320,-260 L-430,-250Z" fill="#111"/><path d="M380,-140 L444,-110 L440,-94 L378,-110Z" fill="#eaf4ff"/>`;
  for (const wx of [-270, 270]) c += `<path d="M${wx - 96},-28 A96,96 0 0 1 ${wx + 96},-28Z" fill="#0c0c0e"/>` + g(`<circle r="76" fill="#18191c"/><circle r="62" fill="#d4a23a"/><circle r="54" fill="#b8862a"/>` + Array.from({ length: 6 }, (_, k) => `<rect x="-6" y="-48" width="12" height="40" rx="5" fill="#f0c45a" transform="rotate(${k * 60})"/>`).join('') + `<circle r="12" fill="#222"/>`, `translate(${wx},-62)`);
  return g(c, `translate(${x},${y}) scale(${o.flip ? -s : s},${s})`);
}
// ---------- cenários ----------
function nightSky(t) {
  const id = uid('ns'); let s = `<defs>${linGrad(id, [[0, '#060a18'], [1, '#1a1a34']])}</defs><rect width="${W}" height="${H}" fill="url(#${id})"/>`;
  const r = rng(77); for (let i = 0; i < 60; i++) s += `<circle cx="${r() * W}" cy="${r() * 700}" r="${1 + r() * 2}" fill="#fff" opacity="${.3 + .4 * Math.abs(Math.sin(t * 2 + i))}"/>`;
  return s;
}
function posto(t, o = {}) {
  const id = uid('po');
  let s = nightSky(t);
  s += `<defs>${linGrad(id + 'c', [[0, '#3a3e48'], [1, '#2a2d34']])}${radGrad(id + 'l', [[0, '#eaf4ff', .55], [1, '#eaf4ff', 0]])}${linGrad(id + 'f', [[0, '#4a4c54'], [1, '#18181c']])}</defs>`;
  s += `<g filter="url(#b5)"><rect x="0" y="700" width="${W}" height="400" fill="#0c0e16"/>`;
  const r = rng(5); for (let i = 0; i < 10; i++) { const x = i * 120 + r() * 40, h = 120 + r() * 220; s += `<rect x="${x}" y="${1100 - h}" width="100" height="${h}" fill="#10131c"/>`; for (let k = 0; k < 4; k++) if (r() < .6) s += `<rect x="${x + 16 + (k % 2) * 40}" y="${1100 - h + 20 + Math.floor(k / 2) * 50}" width="20" height="26" fill="#ffd27a" opacity=".6"/>`; }
  s += `</g>`;
  // placa de preço
  s += g(`<rect x="-14" y="0" width="28" height="520" fill="#2a2d34"/><rect x="-120" y="-260" width="240" height="280" rx="14" fill="#14161c" stroke="#ffc928" stroke-width="5"/>` + txt(0, -210, 'POSTO DO', 30, '#fff', { w: 900 }) + txt(0, -172, 'BAIRRO', 40, '#ffc928', { w: 900 }) + txt(0, -110, 'GASOLINA', 26, '#cfd6de', { w: 800 }) + txt(0, -48, '6,29', 70, '#ff4a3a', { w: 900 }), 'translate(930,600)', 'filter="url(#b2)"');
  // chão
  s += `<rect y="1100" width="${W}" height="${H - 1100}" fill="url(#${id}f)"/>`;
  // cobertura com LED
  s += `<rect x="-40" y="260" width="${W + 80}" height="120" fill="url(#${id}c)"/><rect x="-40" y="372" width="${W + 80}" height="14" fill="#f4fbff" filter="url(#glow)"/><rect x="-40" y="276" width="${W + 80}" height="30" fill="${o.past ? '#d8262a' : '#1e5aa8'}"/>` + txt(540, 300, 'POSTO DO BAIRRO', 26, '#fff', { w: 900, ls: 10 });
  for (const px of [180, 900]) s += `<rect x="${px - 24}" y="386" width="48" height="740" fill="#d8dce2"/><rect x="${px - 24}" y="386" width="14" height="740" fill="#fff" opacity=".4"/>`;
  s += `<ellipse cx="540" cy="1200" rx="700" ry="380" fill="url(#${id}l)"/>`;
  // bombas
  for (const bx of [380, 700]) s += g(`<rect x="-60" y="-260" width="120" height="260" rx="10" fill="#e8ecf0"/><rect x="-60" y="-260" width="120" height="50" rx="10" fill="#1e5aa8"/><rect x="-40" y="-190" width="80" height="50" rx="6" fill="#0e1a10"/>` + txt(0, -152, '0,00', 26, '#7aff7a', { w: 900 }) + `<path d="M60,-120 C100,-120 100,-40 70,-20" stroke="#222" stroke-width="10" fill="none"/>`, `translate(${bx},1120)`, 'filter="url(#b2)"');
  s += postoAtmos(t);
  return s;
}
function topCar(x, y, rot, col, glow) {
  return g((glow ? `<ellipse cx="0" cy="0" rx="150" ry="90" fill="${glow}" opacity=".35" filter="url(#b18)"/>` : '') + `<rect x="-120" y="-60" width="240" height="120" rx="40" fill="${col}"/><rect x="-40" y="-50" width="90" height="100" rx="18" fill="#1c2430"/><rect x="-36" y="-46" width="30" height="92" rx="8" fill="${col}"/><rect x="-110" y="-56" width="20" height="18" rx="6" fill="#fff6c0"/><rect x="-110" y="38" width="20" height="18" rx="6" fill="#fff6c0"/>`, `translate(${x},${y}) rotate(${rot})`, 'filter="url(#shs)"');
}
function stoneGround(t) {
  return `<rect width="${W}" height="${H}" fill="#2a2c32"/>` + Array.from({ length: 30 }, (_, i) => `<path d="M0,${i * 70} H${W}" stroke="#000" stroke-width="2" opacity=".12"/>`).join('');
}
// vista pelo para-brisa (câmera no capô)
function cabin(t, o = {}) {
  const id = uid('cb'), day = o.day;
  let s = `<defs>${linGrad(id + 's', day ? [[0, '#7ec4ff'], [1, '#f2e6c8']] : [[0, '#0a0f20'], [1, '#22263a']])}${linGrad(id + 'h', day ? [[0, '#c8ced4'], [.5, '#9aa1a8'], [1, '#4a4e56']] : [[0, '#9aa1a8'], [.4, '#5a5f66'], [1, '#1a1c20']])}<clipPath id="${id}w"><path d="M170,380 L910,380 L1040,1170 L40,1170Z"/></clipPath></defs>`;
  s += `<rect width="${W}" height="${H}" fill="url(#${id}s)"/>`;
  // rua passando ao fundo
  if (day) { const r = rng(9); for (let i = 0; i < 8; i++) { const x = ((i * 190 + t * 260) % 1400) - 160; s += `<g filter="url(#b10)"><rect x="${x - 6}" y="200" width="12" height="160" fill="#6a4a2a"/><circle cx="${x}" cy="190" r="${70 + r() * 30}" fill="#5aa83a"/></g>`; } }
  else for (let i = 0; i < 5; i++) { const x = ((i * 300 + t * 380) % 1500) - 200; s += `<g filter="url(#b10)"><rect x="${x}" y="40" width="10" height="320" fill="#2a2d34"/><circle cx="${x + 30}" cy="40" r="26" fill="#ffb84a" filter="url(#glow2)"/></g>`; }
  // interior
  let inn = `<rect width="${W}" height="${H}" fill="${day ? '#3a3226' : '#0d0e12'}"/>`;
  inn += `<rect x="180" y="560" width="300" height="420" rx="60" fill="${day ? '#5a4a3a' : '#1c1d22'}"/><rect x="600" y="560" width="300" height="420" rx="60" fill="${day ? '#5a4a3a' : '#1c1d22'}"/>`;
  if (o.passenger) inn += o.passenger;
  if (o.driver) inn += o.driver;
  inn += `<ellipse cx="740" cy="1080" rx="200" ry="150" fill="none" stroke="#141416" stroke-width="36"/><rect x="730" y="1080" width="20" height="120" fill="#141416"/>`;
  if (o.inner) inn += o.inner;
  // retrovisor interno + terço
  inn += `<rect x="470" y="400" width="140" height="56" rx="14" fill="#1a1c20"/><rect x="480" y="408" width="120" height="40" rx="10" fill="${day ? '#9ac0e0' : '#2a3448'}"/>`;
  if (o.terco) { const sw = Math.sin(t * o.terco) * 14; let b = ''; for (let k = 0; k < 12; k++) { const a = (k / 11) * Math.PI; b += `<circle cx="${Math.cos(a) * 30}" cy="${Math.sin(a) * 120}" r="7" fill="#6a3a2a"/>`; } inn += g(b + `<path d="M0,120 V180 M-16,140 H16" stroke="#c9a24a" stroke-width="8" stroke-linecap="round"/>`, `translate(540,450) rotate(${sw})`); }
  s += `<g clip-path="url(#${id}w)">${inn}<rect width="${W}" height="${H}" fill="${day ? '#bfe0ff' : '#6a8ab8'}" opacity=".1"/>`;
  // reflexos no vidro
  if (!day) for (let i = 0; i < 3; i++) { const yy = ((t * 900 + i * 500) % 1400) + 200; s += `<path d="M0,${yy} L${W},${yy - 500}" stroke="#ffcf8a" stroke-width="${30 + i * 10}" opacity=".08" filter="url(#b18)"/>`; }
  s += `<path d="M260,380 L420,380 L200,1170 L60,1170Z" fill="#fff" opacity=".06"/></g>`;
  // colunas, teto e capô
  s += `<path d="M170,380 L910,380 L940,340 L140,340Z" fill="#2a2d32"/><path d="M120,330 L170,380 L40,1170 L0,1170 L0,330Z" fill="#9aa1a8"/><path d="M960,330 L910,380 L1040,1170 L1080,1170 L1080,330Z" fill="#7a8088"/>`;
  s += `<path d="M0,1160 L${W},1160 L${W},${H} L0,${H}Z" fill="url(#${id}h)"/><path d="M0,1160 L${W},1160 L${W},1185 L0,1185Z" fill="#202226"/><path d="M200,1240 C400,1220 700,1220 900,1240" stroke="#fff" stroke-width="6" opacity=".35" fill="none"/>`;
  s += `<path d="M120,1170 L500,1120 M560,1170 L940,1120" stroke="#111" stroke-width="10" stroke-linecap="round"/>`;
  if (o.dust) s += `<rect y="1160" width="${W}" height="760" fill="#8a7a5e" opacity=".14"/>`;
  return s;
}
// mostrador de combustível
function fuelGauge(t, p) {
  let s = `<rect width="${W}" height="${H}" fill="#08090b"/><circle cx="540" cy="860" r="420" fill="#15161a" stroke="#2c2e34" stroke-width="20"/>`;
  for (let i = 0; i <= 8; i++) { const a = (-130 + i * 32.5) * Math.PI / 180; s += `<path d="M${540 + Math.sin(a) * 330},${860 - Math.cos(a) * 330} L${540 + Math.sin(a) * 380},${860 - Math.cos(a) * 380}" stroke="${i < 2 ? '#ff4a3a' : '#e8e8e8'}" stroke-width="${i % 4 ? 8 : 16}"/>`; }
  s += txt(220, 980, 'R', 80, '#ff4a3a', { w: 900 }) + txt(860, 980, 'C', 80, '#e8e8e8', { w: 900 }) + txt(540, 700, 'COMBUSTÍVEL', 34, '#777', { w: 800, ls: 6 });
  const a = -122 + Math.sin(t * 7) * 1.5;
  s += g(`<rect x="-8" y="-330" width="16" height="360" rx="8" fill="#ff7a2a"/><circle r="40" fill="#2a2c32"/>`, `translate(540,860) rotate(${a})`);
  const on = Math.floor(t * 2.5) % 2 === 0;
  s += g(`<path d="M-40,-60 h60 v120 h-60z M20,-30 h20 v60" stroke="${on ? '#ffb020' : '#3a2a10'}" stroke-width="12" fill="none"/>`, 'translate(540,1060)', on ? 'filter="url(#glow)"' : '');
  s += panel(540, 330, 520, 130, txt(0, 24, 'RESERVA', 80, '#ff4a3a', { w: 900 }), { s: pop(p, .15), stroke: '#ff4a3a' });
  return s;
}
// mão na chave da ignição
function ignition(t, p, turn) {
  let s = `<rect width="${W}" height="${H}" fill="#0b0b0d"/><path d="M0,600 C300,560 800,560 ${W},620 L${W},${H} L0,${H}Z" fill="#1a1b1f"/>`;
  s += `<circle cx="540" cy="900" r="170" fill="#26272c" stroke="#0e0e10" stroke-width="16"/><circle cx="540" cy="900" r="90" fill="#3a3c42"/>`;
  for (let i = 0; i < 4; i++) { const on = turn > .3 && Math.sin(t * 30 + i) > 0; s += `<circle cx="${300 + i * 160}" cy="460" r="22" fill="${['#ff4a3a', '#ffb020', '#ff4a3a', '#4aff8a'][i]}" opacity="${on ? 1 : .2}" ${on ? 'filter="url(#glow)"' : ''}/>`; }
  s += g(keyIcon(0, 0, 2.2, 0), `translate(540,900) rotate(${-90 + turn * 55})`);
  s += hand(lerp(560, 600, turn), 1150, 2.2, -10 + turn * 30, { fist: true });
  s += dust(66, 30, 0, 300, W, 1400, t) + `<g filter="url(#b18)"><ellipse cx="540" cy="1950" rx="700" ry="200" fill="#0e0f12"/></g>`;
  return g(s, 'translate(540,900) scale(1.35) translate(-540,-900)');
}


// ---------- padrão visual novo: câmera colada no para-brisa, 3 camadas, luz de poste no rosto ----------
const blinkAt = (t, per = 3.3, off = 0) => ((t + off) % per) < .13;
// terço pendurado (centro do gancho em 0,0)
function terco(t, sw, s = 1) {
  let b = '';
  for (let k = 0; k < 16; k++) { const a = (k / 15) * Math.PI; b += `<circle cx="${Math.cos(a) * 36}" cy="${Math.sin(a) * 150}" r="9" fill="#6a3a2a" stroke="#2a140c" stroke-width="2"/><circle cx="${Math.cos(a) * 36 - 3}" cy="${Math.sin(a) * 150 - 3}" r="3" fill="#ffd2a0" opacity=".5"/>`; }
  b += `<path d="M0,150 V250 M-28,182 H28" stroke="#c9a24a" stroke-width="12" stroke-linecap="round"/><path d="M-4,154 V246" stroke="#fff3c0" stroke-width="3" opacity=".6"/>`;
  return g(b, `rotate(${sw}) scale(${s})`);
}
// faixa de luz laranja de poste atravessando a cena (ciclo em segundos)
function lampSweep(t, per = 1.7, op = .5) {
  const k = (t % per) / per, x = lerp(-700, 1700, k);
  return `<g style="mix-blend-mode:screen"><rect x="${x - 220}" y="-400" width="440" height="2800" fill="#ff9a3a" opacity="${op}" transform="rotate(-18,${x},960)" filter="url(#b30)"/><rect x="${x - 60}" y="-400" width="120" height="2800" fill="#ffd28a" opacity="${op * .6}" transform="rotate(-18,${x},960)" filter="url(#b18)"/></g>`;
}
function cabinClose(t, p, o = {}) {
  const id = uid('cc');
  const day = o.day;
  let s = `<defs>${linGrad(id + 'bg', day ? [[0, '#7a6450'], [1, '#2e241c']] : [[0, '#141a2c'], [1, '#07080d']])}${radGrad(id + 'f', [[0, '#ffb060', day ? .3 : .22], [1, '#000', 0]])}</defs>`;
  // FUNDO: interior com textura + vidro traseiro com luzes da cidade passando
  s += `<rect width="${W}" height="${H}" fill="url(#${id}bg)"/>`;
  s += `<path d="M110,250 L970,250 L1010,640 L70,640Z" fill="${day ? '#d8ecf4' : '#0d1424'}"/>`;
  s += `<g filter="url(#b10)">`;
  if (day) for (let i = 0; i < 9; i++) { const x = ((i * 160 + t * 300) % 1400) - 160; s += `<rect x="${x - 8}" y="470" width="16" height="170" fill="#6a4a2a"/><circle cx="${x}" cy="${440 + (i % 3) * 20}" r="${70 + (i % 3) * 20}" fill="${i % 2 ? '#6ab04a' : '#4a9a3a'}"/>`; }
  else for (let i = 0; i < 14; i++) { const x = ((i * 137 + t * 520) % 1300) - 110, y = 330 + (i * 53) % 260; s += `<circle cx="${x}" cy="${y}" r="${18 + (i % 4) * 10}" fill="${['#ffb050', '#ffe0a0', '#ff7040', '#a0c0ff'][i % 4]}" opacity=".55"/>`; }
  s += `</g><path d="M110,250 L970,250 L1010,640 L70,640Z" fill="none" stroke="#1c1f26" stroke-width="40"/>`;
  // bancos de trás com textura de tecido
  s += `<rect x="40" y="640" width="1000" height="700" rx="60" fill="${day ? '#4a3e34' : '#1a1b21'}"/>`;
  for (let i = 0; i < 26; i++) s += `<path d="M${60 + i * 38},660 V1320" stroke="#000" stroke-width="5" opacity=".25"/>`;
  s += `<rect x="40" y="640" width="1000" height="700" rx="60" fill="url(#${id}f)"/>`;
  // encosto/apoio de cabeça do motorista: costura e desgaste
  s += seatBack(o.x, t, day);
  s += dust(31, day ? 80 : 46, 0, 300, W, 1300, t);
  // MEIO: personagens grandes
  s += (o.passenger || '') + (o.person || '');
  // luz ambiente azul da noite + faixa laranja de poste passando no rosto
  if (day) s += sunLight(t);
  else { s += `<rect width="${W}" height="${H}" fill="#1a2a6a" opacity=".22" style="mix-blend-mode:multiply"/>`; s += lampSweep(t, o.per || 1.7, .55); }
  // PRIMEIRO PLANO: retrovisor + terço, borda do para-brisa, painel e limpador desfocados
  s += g(`<rect x="-120" y="-50" width="240" height="96" rx="24" fill="#16181d"/><rect x="-104" y="-38" width="208" height="72" rx="16" fill="#2a3448"/><path d="M-90,-30 L-20,-30 L-70,30 L-100,30Z" fill="#fff" opacity=".15"/>`, `translate(${o.mx ?? 380},150)`, 'filter="url(#b5)"');
  if (o.terco !== false) s += g(terco(t, Math.sin(t * 2.6) * 16 + Math.sin(t * 6.1) * 3, 1.15), `translate(${o.mx ?? 380},196)`, 'filter="url(#b2)"');
  s += `<g filter="url(#b18)"><path d="M0,0 L120,0 L60,${H} L0,${H}Z" fill="#9aa1a8" opacity=".85"/><path d="M${W},0 L${W - 120},0 L${W - 60},${H} L${W},${H}Z" fill="#6a7078" opacity=".85"/></g>`;
  s += dashboard(t, o.radio || {}, day);
  // vidro: reflexo, sujeirinha e neblina leve
  s += `<path d="M150,0 L420,0 L120,${H} L-40,${H}Z" fill="#fff" opacity="${day ? .1 : .05}"/>` + glassReflections(t, day);
  { const r = rng(91); for (let i = 0; i < 70; i++) s += `<circle cx="${r() * W}" cy="${r() * H}" r="${1 + r() * 2.5}" fill="#d8dce8" opacity="${.12 + r() * .18}"/>`; }
  s += `<rect width="${W}" height="${H}" fill="#9ab0d8" opacity=".05"/>`;
  return s;
}

// luz do sol entrando pela janela (dia): raios, manchas de luz passando
function sunLight(t) {
  let s = '<g style="mix-blend-mode:screen">';
  for (let i = 0; i < 4; i++) s += `<path d="M${1150 + i * 40},${100 + i * 60} L${620 - i * 120},${1500 + i * 80} L${760 - i * 120},${1560 + i * 80}Z" fill="#ffd890" opacity="${.13 + .03 * Math.sin(t * 2 + i)}" filter="url(#b30)"/>`;
  for (let i = 0; i < 7; i++) { const k = ((t * .5 + i / 7) % 1); s += `<ellipse cx="${lerp(1200, -150, k)}" cy="${700 + (i * 173) % 800}" rx="${70 + (i % 3) * 30}" ry="${40 + (i % 2) * 20}" fill="#ffe8b0" opacity=".14" filter="url(#b18)"/>`; }
  return s + '</g>';
}
// banco com costuras, desgaste e um rasgadinho
function seatBack(x, t, day) {
  let s = `<rect x="${x - 230}" y="560" width="460" height="320" rx="100" fill="${day ? '#5a4c40' : '#24252c'}"/>`;
  for (let i = 0; i < 10; i++) s += `<path d="M${x - 196 + i * 43},584 V856" stroke="#000" stroke-width="5" opacity=".22"/>`;
  s += `<rect x="${x - 212}" y="578" width="424" height="284" rx="86" fill="none" stroke="#5a5c66" stroke-width="3" stroke-dasharray="10 8" opacity=".7"/>`;
  s += `<path d="M${x - 200},720 H${x + 200}" stroke="#5a5c66" stroke-width="3" stroke-dasharray="10 8" opacity=".6"/>`;
  s += `<ellipse cx="${x + 120}" cy="640" rx="70" ry="40" fill="#4a4c56" opacity=".35"/><ellipse cx="${x - 140}" cy="810" rx="60" ry="30" fill="#4a4c56" opacity=".3"/>`;
  s += `<path d="M${x + 150},800 l18,-14 l10,20 l16,-16 l8,22" stroke="#0a0a0c" stroke-width="6" fill="#c8a860" fill-opacity=".5"/>`;
  return s;
}
// painel em primeiro plano: textura, rachaduras e o rádio de fita
function dashboard(t, r, day) {
  const id = uid('db');
  let s = `<defs>${linGrad(id, day ? [[0, '#5a5048'], [.25, '#3a332c'], [1, '#1a1612']] : [[0, '#2e3038'], [.25, '#1e2026'], [1, '#0c0d10']])}<filter id="${id}n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".35"/></feComponentTransfer><feComposite in2="SourceGraphic" operator="in"/></filter></defs>`;
  const d = `M-40,1700 C200,1672 880,1672 ${W + 40},1700 L${W + 40},${H + 40} L-40,${H + 40}Z`;
  s += `<path d="${d}" fill="url(#${id})"/><path d="${d}" fill="#fff" filter="url(#${id}n)" opacity=".5"/>`;
  s += `<path d="M-40,1700 C200,1672 880,1672 ${W + 40},1700" stroke="#4a4c56" stroke-width="5" fill="none" opacity=".7"/>`;
  // rachaduras
  for (const [x0, y0, sd] of [[470, 1720, 1], [640, 1740, 2], [900, 1712, 3], [120, 1780, 4]]) { const q = rng(sd); let pth = `M${x0},${y0}`, x = x0, y = y0; for (let k = 0; k < 6; k++) { x += (q() - .3) * 40; y += 8 + q() * 16; pth += ` L${x},${y}`; if (k === 2) pth += ` M${x},${y} l${30 + q() * 20},${10 + q() * 10} M${x},${y}`; } s += `<path d="${pth}" stroke="#050506" stroke-width="3" fill="none" opacity=".85"/><path d="${pth}" stroke="#5a5c66" stroke-width="1.5" fill="none" opacity=".4" transform="translate(2,1)"/>`; }
  // saída de ar
  for (let i = 0; i < 5; i++) s += `<rect x="${720 + i * 34}" y="1780" width="22" height="70" rx="6" fill="#0a0b0d"/>`;
  // rádio de fita
  const sh = r.shake || 0, on = r.on || 0;
  let rd = `<rect x="-190" y="-80" width="380" height="160" rx="16" fill="#15161a" stroke="#3a3c44" stroke-width="5"/><rect x="-170" y="-60" width="200" height="56" rx="6" fill="${on ? '#0e2a1a' : '#0a0c0b'}"/>`;
  rd += txt(-70, -20, on ? (on > .5 ? '▶ FITA' : '~ ~ ~') : '- - -', 30, on ? '#7aff9a' : '#2a3a2e', { w: 900, extra: on ? 'filter="url(#glow)"' : '' });
  rd += `<rect x="-170" y="14" width="200" height="40" rx="6" fill="#0a0b0d"/><rect x="-150" y="26" width="160" height="14" rx="4" fill="#26282e"/><circle cx="80" cy="-30" r="30" fill="#2a2c32" stroke="#4a4c56" stroke-width="4"/><circle cx="150" cy="-30" r="22" fill="#2a2c32" stroke="#4a4c56" stroke-width="4"/>`;
  for (let i = 0; i < 4; i++) rd += `<rect x="${56 + i * 30}" y="20" width="20" height="30" rx="4" fill="#3a3c44"/>`;
  rd += `<path d="M-180,-70 L-120,-70" stroke="#fff" stroke-width="3" opacity=".15"/>`;
  s += g(rd, `translate(${270 + sh * 4},${1800 + sh * 6}) rotate(${-3 + sh})`);
  return s;
}
// reflexos das luzes da rua no para-brisa
function glassReflections(t, day) {
  let s = '<g style="mix-blend-mode:screen" filter="url(#b18)">';
  for (let i = 0; i < 6; i++) { const k = ((t * .35 + i / 6) % 1), x = lerp(1250, -250, k), y = 200 + i * 230 + Math.sin(i) * 60; s += `<ellipse cx="${x}" cy="${y}" rx="${90 + i * 12}" ry="${36 + i * 6}" fill="${day ? '#ffffff' : i % 2 ? '#ffb060' : '#fff0d0'}" opacity="${day ? .08 : .12}"/>`; }
  s += `<path d="M${lerp(1300, -300, (t * .5) % 1)},0 l-260,${H}" stroke="#ffd8a0" stroke-width="14" opacity=".08"/></g>`;
  return s;
}
// Lucas dirigindo: grande, as duas mãos no volante, pisca e respira
function lucasDriving(t, o = {}) {
  const P = o.who || LUCAS, x = o.x || 560, y = o.y || 760, S = o.s || 1.75, top = P.top;
  let s = bust({ ...P, x, y: y + (o.sink || 0), s: S, eyes: blinkAt(t, 3.1) ? 'dot' : (o.eyes || 'dot'), blink: blinkAt(t, 3.1), mouth: o.mouth || 'flat', brows: o.brows || 'neutral', look: o.look || 0, breath: t, sweat: o.sweat });
  // volante baixo, na altura da barriga, NA FRENTE do corpo; coluna de direção descendo até o painel
  const wx = x, wy = 1560 + (o.sink || 0) * .2, rx = 340, ry = 190;
  const sq = 1 + .03 * Math.sin(t * (o.grip || 0));
  const grip = (side) => [wx + side * 300, wy - 88];
  const armPath = (side, wr, ctrl) => {
    const sx = x + side * 235, sy = y + 360;
    const c = ctrl || [x + side * 330, wy - 260];
    const d = `M${sx},${sy} Q${c[0]},${c[1]} ${wr[0]},${wr[1]}`;
    let a = `<path d="${d}" stroke="${top}" stroke-width="100" fill="none" stroke-linecap="round"/>`;
    a += `<path d="${d}" stroke="#000" stroke-width="100" fill="none" stroke-linecap="round" opacity=".14" transform="translate(${side * 8},6)"/>`;
    a += `<path d="M${sx - side * 30},${sy + 10} Q${c[0] - side * 30},${c[1]} ${wr[0] - side * 28},${wr[1] - 10}" stroke="#fff" stroke-width="8" fill="none" opacity=".12"/>`;
    a += `<path d="M${lerp(sx, c[0], .6) - 30},${lerp(sy, c[1], .6)} q30,14 60,0 M${lerp(c[0], wr[0], .5) - 30},${lerp(c[1], wr[1], .5)} q30,14 60,0" stroke="#000" stroke-width="5" fill="none" opacity=".2"/>`;
    a += `<circle cx="${wr[0]}" cy="${wr[1]}" r="54" fill="${top}"/><circle cx="${wr[0]}" cy="${wr[1]}" r="54" fill="#000" opacity=".22"/>`;
    return a;
  };
  window.__lucasArm = armPath;
  if (!o.noLeft) s += armPath(-1, grip(-1));
  if (o.windowArm) s += armPath(1, [1150, 1150 + Math.sin(t * 2) * 6], [980, 1230]);
  else s += armPath(1, grip(1));
  s += `<path d="M${wx - 70},${wy} L${wx + 70},${wy} L${wx + 110},1840 L${wx - 110},1840Z" fill="#121316"/><path d="M${wx + 30},${wy} L${wx + 70},${wy} L${wx + 110},1840 L${wx + 60},1840Z" fill="#000" opacity=".3"/>`;
  s += `<ellipse cx="${wx}" cy="${wy}" rx="${rx}" ry="${ry}" fill="none" stroke="#111215" stroke-width="54"/><ellipse cx="${wx}" cy="${wy - 8}" rx="${rx}" ry="${ry}" fill="none" stroke="#3a3c44" stroke-width="6" opacity=".7"/>`;
  s += `<path d="M${wx - 80},${wy + 10} L${wx - rx + 20},${wy + 20} L${wx - rx + 24},${wy + 60} L${wx - 70},${wy + 60}Z M${wx + 80},${wy + 10} L${wx + rx - 20},${wy + 20} L${wx + rx - 24},${wy + 60} L${wx + 70},${wy + 60}Z M${wx - 50},${wy + 60} L${wx + 50},${wy + 60} L${wx + 40},${wy + ry} L${wx - 40},${wy + ry}Z" fill="#17181c"/>`;
  s += `<ellipse cx="${wx}" cy="${wy + 30}" rx="110" ry="74" fill="#1c1d22" stroke="#2c2e34" stroke-width="5"/><ellipse cx="${wx - 20}" cy="${wy + 14}" rx="50" ry="20" fill="#fff" opacity=".07"/>`;
  if (!o.noLeft) s += hand(grip(-1)[0], grip(-1)[1] - 10, .95 * sq, -60, { fist: true, mirror: true });
  if (!o.windowArm) s += hand(grip(1)[0], grip(1)[1] - 10, .95 * sq, 60, { fist: true });
  return s;
}


// ---------- atmosfera e camadas (padrão visual) ----------
let __T = 0;
function postoAtmos(t) {
  let s = '<g style="mix-blend-mode:screen">';
  for (let i = 0; i < 7; i++) s += `<path d="M${80 + i * 150},386 L${20 + i * 150},1300 L${160 + i * 150},1300 L${130 + i * 150},386Z" fill="#dff0ff" opacity="${.05 + .02 * Math.sin(t * 1.3 + i)}" filter="url(#b18)"/>`;
  s += `<circle cx="70" cy="520" r="34" fill="#ffb050" filter="url(#glow2)"/><path d="M70,540 L-200,1500 L380,1500Z" fill="#ff9a3a" opacity=".12" filter="url(#b30)"/></g>`;
  s += `<rect x="58" y="520" width="20" height="900" fill="#1a1c22"/><rect y="1050" width="${W}" height="260" fill="#c8d4ec" opacity=".08" filter="url(#b30)"/>`;
  s += dust(55, 50, 0, 380, W, 1100, t);
  return s;
}
// luz laranja de poste batendo de lado no rosto (oscila devagar)
function orangeKey(x, y, r = 300, t = 0) { return `<circle cx="${x}" cy="${y}" r="${r}" fill="#ff9a3a" opacity="${.22 + .06 * Math.sin(t * 1.7)}" style="mix-blend-mode:screen" filter="url(#b30)"/>`; }
// primeiro plano desfocado: bico da bomba, mangueira e para-lama
function postoFG(t, v = 0) {
  const sw = Math.sin(t * .8) * 10;
  if (v === 1) return `<g filter="url(#b18)"><path d="M${W - 260 + sw},${H} C${W - 200},1500 ${W - 40},1500 ${W + 20},1380 L${W + 20},${H}Z" fill="#c8312e"/><path d="M${W - 230 + sw},${H} C${W - 180},1560 ${W - 60},1540 ${W},1450" stroke="#ff9a8a" stroke-width="10" fill="none" opacity=".4"/></g>`;
  return `<g filter="url(#b18)"><path d="M-40,${H} C60,1500 40,1100 -20,900" stroke="#15161a" stroke-width="40" fill="none"/><g transform="translate(${30 + sw},1260) rotate(25)"><rect x="-50" y="-30" width="160" height="70" rx="20" fill="#2a2c32"/><rect x="100" y="-12" width="120" height="26" rx="10" fill="#9aa1a8"/></g></g>`;
}
// sobre o ombro do Lucas (dentro do carro): moldura da janela, nuca e ombro desfocados
function overShoulder(side = -1) {
  const x = side < 0 ? 150 : W - 150;
  return `<g filter="url(#b18)"><path d="M${side < 0 ? -40 : W + 40},300 L${side < 0 ? 120 : W - 120},300 L${side < 0 ? 60 : W - 60},${H} L${side < 0 ? -40 : W + 40},${H}Z" fill="#9aa1a8"/>` +
    `<path d="M${x - 330},${H} C${x - 330},1500 ${x - 200},1380 ${x},1370 C${x + 200},1380 ${x + 330},1500 ${x + 330},${H}Z" fill="${LUCAS.top}"/><ellipse cx="${x}" cy="1220" rx="170" ry="200" fill="#2a1d17"/><ellipse cx="${x + side * -150}" cy="1240" rx="26" ry="40" fill="#b8734a"/></g>`;
}

// ---------- cenas (por tempo, em segundos) ----------
const SCENES = [
  // PLANO 1 — painel: reserva
  { at: 0, z: [1.15, 1.0], c: [540, 860], f: (t, p) => fuelGauge(t, p) + vignette(true) },
  // PLANO 2 — colado no para-brisa: dois tapas no rádio, a música pega; terço balançando, luz de poste no rosto
  { at: 4, z: [1.0, 1.07], c: [560, 900], f: (t, p) => {
    // mão direita do Lucas (lado esquerdo da tela): sai do volante, desce por fora do aro até o rádio, 2 tapas, volta
    const rest = [260, 1472], radio = [262, 1720];
    const tap = (c) => Math.max(0, 1 - Math.abs(t - c) / .09);
    let k = t < .3 ? easeInOut(t / .3) : t < 1.15 ? 1 : 1 - easeInOut(clamp((t - 1.15) / .35));
    const lift = (t > .3 && t < 1.15) ? (1 - tap(.45) - tap(.85)) * 60 : 0;
    const wr = [lerp(rest[0], radio[0], k), lerp(rest[1], radio[1], k) - lift];
    const ctrl = [lerp(230, 120, k), lerp(1300, 1440, k)];
    const hit = tap(.45) + tap(.85), on = t > 1.0 ? clamp((t - 1.0) / .25) : 0;
    const music = t > 1.25;
    let s = cabinClose(t, p, { x: 560, radio: { shake: hit, on }, person: lucasDriving(t, { x: 560, y: 760, s: 1.75, mouth: music ? 'smile' : 'flat', brows: music ? 'neutral' : 'serious', look: music ? 0 : -14, noLeft: 1 }) });
    s += window.__lucasArm(-1, wr, ctrl) + (k > .4 ? hand(wr[0] - 4, wr[1] + 30, .72, 172, {}) : hand(wr[0], wr[1] - 10, .95, -60, { fist: true, mirror: true }));
    if (hit > .3) s += txt(250, 1600, 'TUM!', 80, '#fff', { w: 900, op: hit, extra: 'stroke="#000" stroke-width="10" paint-order="stroke"' });
    if (music) for (let i = 0; i < 5; i++) { const q = (((t - 1.25) * .7 + i * .2) % 1); if (t - 1.25 < i * .25) continue; s += txt(300 + Math.sin(t * 2 + i) * 50, 1640 - q * 900, '♪', 64, '#ffe08a', { op: (1 - q) * .85 }); }
    return g(s, `translate(${Math.sin(t * 1.7) * 6 + Math.sin(t * 11) * 1.5 + hit * 4},${Math.sin(t * 2.3) * 5 + Math.sin(t * 13) * 1.5})`) + vignette();
  } },
  // PLANO 3 — lembrança 1 (match cut com o plano 2): dia, avô mais novo dirigindo com o braço na janela,
  // Lucas criança no banco do passageiro cantando a mesma música; solavanco de buraco no fim
  { at: 8, z: [1.0, 1.07], c: [560, 900], f: (t, p) => {
    const bump = clamp((t - 3.3) / .25), sh = bump > 0 ? Math.sin(bump * 38) * 34 * (1 - bump * .6) : 0;
    const sing = Math.sin(t * 7.5) > 0;
    let kid = `<path d="M60,1010 L330,1500" stroke="#3a3a3a" stroke-width="26"/>`;
    kid = bust({ ...KID, x: 170, y: 1000 + Math.abs(Math.sin(t * 4)) * -14, s: 1.0, eyes: blinkAt(t, 2.7, .5) ? 'dot' : 'closed', blink: false, mouth: sing ? 'open' : 'o', brows: 'up', breath: t }) + `<path d="M60,1200 L290,1560" stroke="#2a2a2a" stroke-width="28"/><path d="M60,1200 L290,1560" stroke="#555" stroke-width="6" opacity=".6"/>`;
    const drv = lucasDriving(t, { who: AVO_MEIO, x: 650, y: 760, s: 1.75, mouth: 'smile', brows: 'neutral', look: -14, windowArm: 1 });
    let s = cabinClose(t, p, { day: 1, x: 650, person: drv, passenger: kid, radio: { on: 1 } });
    for (let i = 0; i < 6; i++) { const q = ((t * .6 + i / 6) % 1); s += txt(180 + Math.sin(t * 2 + i) * 70, 1000 - q * 700, '♪', 66, '#fff6d0', { op: (1 - q) * .9 }); }
    let out = flash(g(s, `translate(${Math.sin(t * 1.7) * 6 + sh * .3},${Math.sin(t * 2.3) * 5 + sh})`), 8);
    if (bump > .55) out += `<rect width="${W}" height="${H}" fill="#fff" opacity="${(bump - .55) * 2}"/>`;
    return out;
  } },
  // volta ao presente: o mesmo enquadramento, Lucas sozinho chacoalhando com o buraco
  { at: 11.6, z: [1.07, 1.03], c: [560, 900], f: (t, p) => {
    const sh = Math.sin(t * 40) * 26 * Math.max(0, 1 - t / .35);
    const s = cabinClose(t + 7.6, p, { x: 560, radio: { on: 1 }, person: lucasDriving(t + 7.6, { x: 560, y: 760 + sh * .5, s: 1.75, mouth: 'o', brows: 'up', eyes: 'wide' }) });
    return g(s, `translate(0,${sh})`) + vignette() + `<rect width="${W}" height="${H}" fill="#fff" opacity="${Math.max(0, .6 - t * 3)}"/>`;
  } },
  // PLANO 4 — drone descendo sobre o posto
  { at: 12, z: [0.9, 1.18], c: [540, 960], f: (t, p) => {
    let s = stoneGround(t);
    s += `<rect x="140" y="500" width="800" height="560" rx="10" fill="#3a3e48"/><rect x="140" y="500" width="800" height="560" rx="10" fill="none" stroke="#f4fbff" stroke-width="12" filter="url(#glow)"/>` + txt(540, 800, 'POSTO DO BAIRRO', 54, '#fff', { w: 900, ls: 8 });
    s += `<ellipse cx="540" cy="1250" rx="620" ry="300" fill="#eaf4ff" opacity=".12" filter="url(#b30)"/>`;
    s += topCar(220, 1300, 90, '#c8312e', '#c04dff') + topCar(420, 1380, 80, '#1e1e24', '#2fd0ff') + topCar(680, 1400, 100, '#e8e8ea', '#ff2f8a') + topCar(880, 1320, 95, '#2a6ad8', '#c04dff');
    const r = rng(4); for (let i = 0; i < 16; i++) s += `<circle cx="${180 + r() * 760}" cy="${1180 + r() * 340}" r="14" fill="${['#2a1d17', '#c9a24a', '#111', '#3a2416'][i % 4]}" stroke="#000" stroke-width="3"/>`;
    for (let i = 0; i < 4; i++) s += `<circle cx="540" cy="1350" r="${(t * 220 + i * 120) % 480}" fill="none" stroke="#c04dff" stroke-width="4" opacity="${.3 * (1 - ((t * 220 + i * 120) % 480) / 480)}"/>`;
    return s + vignette();
  } },
  // PLANO 5 — o Corsa entra devagar, um farol mais fraco
  { at: 15, z: [1.0, 1.04], c: [540, 1100], f: (t, p) => {
    let s = posto(t);
    s += g(tuned(0, 0, .55, '#c8312e'), 'translate(150,1330)', 'filter="url(#b5)"') + g(tuned(0, 0, .55, '#2a6ad8', { flip: 1, glow: '#2fd0ff' }), 'translate(930,1330)', 'filter="url(#b5)"');
    const k = easeOut(seg(p, 0, .85));
    s += corsaFront(540, lerp(1330, 1640, k), lerp(.38, .95, k), { lights: 1, dim: .3 + .2 * Math.sin(t * 20), dust: 1 });
    return s + postoFG(t, 0) + vignette();
  } },
  // PLANO 6 — panorâmica rápida pelos rostos virando
  { at: 18, z: [1.0, 1.0], c: [540, 960], f: (t, p) => {
    let s = posto(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".35"/>`;
    const pan = lerp(0, -2400, easeInOut(p));
    let row = '';
    GALERA.concat([CARA1]).forEach((o, i) => { const turn = clamp((p * 5 - i * .9) * 2); row += bust({ ...o, x: 540 + i * 800, y: 700, s: 1.7, eyes: turn > .5 ? 'wide' : 'dot', mouth: turn > .7 ? 'o' : 'flat', brows: turn > .5 ? 'up' : 'neutral', look: lerp(30, -26, turn) }); });
    s += g(row, `translate(${pan},0)`) + orangeKey(300, 700, 380, t);
    for (let i = 0; i < 8; i++) s += `<path d="M${i * 160},${300 + i * 150} h-400" stroke="#fff" stroke-width="4" opacity="${.12 * Math.sin(p * Math.PI)}"/>`;
    return s + vignette();
  } },
  // PLANO 7 — Lucas afunda no banco tentando parecer tranquilo; depois close extremo no terço
  { at: 21, z: [1.0, 1.08], c: [560, 900], f: (t, p) => {
    const sink = easeOut(seg(p, .1, .6)) * 120;
    const s = cabinClose(t, p, { x: 560, radio: { on: 0 }, person: lucasDriving(t, { x: 560, y: 760, s: 1.75, sink, mouth: 'small', brows: 'sad', look: -18 + Math.sin(t * 3) * 6 }) });
    return g(s, `translate(${Math.sin(t * 1.7) * 5},${Math.sin(t * 2.3) * 4})`) + vignette();
  } },
  { at: 22.8, z: [1.0, 1.1], c: [540, 700], f: (t, p) => {
    let s = `<g filter="url(#b18)">${cabinClose(t, p, { x: 560, terco: false, person: lucasDriving(t, { x: 560, y: 880, s: 1.75, mouth: 'small', brows: 'sad' }) })}</g>`;
    s += lampSweep(t + 1, 1.7, .4);
    s += g(`<rect x="-150" y="-70" width="300" height="130" rx="30" fill="#16181d"/><rect x="-130" y="-52" width="260" height="96" rx="22" fill="#2a3448"/>`, 'translate(540,260)', 'filter="url(#b5)"');
    s += g(terco(t, Math.sin(t * 2.6) * 14 + Math.sin(t * 6.1) * 3, 3.2), 'translate(540,320)', 'filter="url(#shs)"');
    return s + vignette(true);
  } },
  // PLANO 8 — lembrança 2: mãos do avô pendurando o terço no carro novinho
  { at: 24, z: [1.0, 1.1], c: [540, 860], f: (t, p) => {
    let s = `<rect width="${W}" height="${H}" fill="#e8d8b8"/><g filter="url(#b18)"><rect x="0" y="900" width="${W}" height="1020" fill="#c8b48a"/><rect x="100" y="200" width="880" height="600" fill="#f8f0d8"/></g>`;
    s += `<rect x="330" y="300" width="420" height="150" rx="30" fill="#2a2c30"/><rect x="350" y="318" width="380" height="112" rx="22" fill="#a8c8e0"/><path d="M380,330 L520,330 L460,420 L360,420Z" fill="#fff" opacity=".35"/>`;
    const k = easeOut(seg(p, .1, .6)), sw = Math.sin(t * 3) * 8 * k;
    let b = ''; for (let i = 0; i < 14; i++) { const a = (i / 13) * Math.PI; b += `<circle cx="${Math.cos(a) * 40}" cy="${Math.sin(a) * 150}" r="10" fill="#7a4a30" stroke="#4a2a18" stroke-width="2"/>`; }
    s += g(b + `<path d="M0,150 V240 M-26,180 H26" stroke="#d8b050" stroke-width="12" stroke-linecap="round"/>`, `translate(540,${lerp(240, 450, k)}) rotate(${sw})`);
    s += hand(400, lerp(330, 470, k), 1.4, 25, { skin: '#c88a5c', sleeve: '#4a5a6a' }) + hand(680, lerp(330, 470, k), 1.4, -25, { skin: '#c88a5c', sleeve: '#4a5a6a' });
    s += `<rect x="40" y="1350" width="1000" height="10" fill="#fff" opacity=".5" filter="url(#b5)"/>` + txt(540, 1450, 'NOVINHO', 40, '#7a5a3a', { w: 800, ls: 12, op: .6 });
    return flash(s, 24);
  } },
  // PLANO 9 — frentista de baixo para cima, por cima do ombro do Lucas, segurando o riso
  { at: 27, z: [1.0, 1.07], c: [600, 900], f: (t, p) => {
    let s = posto(t, {});
    s += `<rect width="${W}" height="${H}" fill="#000" opacity=".2"/>`;
    for (let i = 0; i < 9; i++) s += `<path d="M${i * 135},${H} L600,-600" stroke="#fff" stroke-width="3" opacity=".05"/>`;
    const hold = Math.sin(t * 18) * 3 * seg(p, .5, 1);
    s += pessoa({ ...FRENT, x: 640 + hold, y: 860, s: 2.2, eyes: p > .5 ? 'closed' : 'dot', mouth: p > .5 ? 'smile' : 'flat', brows: p > .3 ? 'up' : 'neutral', look: p < .4 ? lerp(-20, 20, Math.sin(t * 2) * .5 + .5) : -10 });
    s += orangeKey(380, 700, 320, t);
    s += overShoulder(-1);
    s += panel(830, 300, 320, 140, txt(0, -6, 'SÓ', 40, '#fff', { w: 800 }) + txt(0, 48, 'R$ 20?', 70, GOLD, { w: 900 }), { s: pop(p, .55), rot: 6 });
    return s + vignette();
  } },
  // PLANO 10 — cara 1 encostado no carro tunado, braços cruzados (por cima do ombro do Lucas)
  { at: 31, z: [1.0, 1.07], c: [520, 900], f: (t, p) => {
    let s = posto(t);
    s += g(tuned(0, 0, 1.1, '#c8312e'), 'translate(500,1440)');
    const laugh = seg(p, .78, 1);
    const o = { ...CARA1, x: 470, y: 600, s: 1.7, cruzado: 1 };
    s += laugh > 0 ? rindo(o, t, laugh) : pessoa({ ...o, eyes: 'dot', mouth: 'smile', brows: 'serious', look: 10 });
    s += orangeKey(250, 650, 300, t) + overShoulder(1) + postoFG(t, 0);
    return s + vignette();
  } },
  // PLANO 11 — close extremo: o retrovisor do Corsa cai sozinho e bate no chão (PLEC); depois o cara 2 gargalha apontando
  { at: 35, z: [1.0, 1.05], c: [540, 960], f: (t, p) => {
    const wob = t < .35 ? Math.sin(t * 60) * 4 * (t / .35) : 0;
    const fall = easeIn(clamp((t - .35) / .4)), hit = t > .75, bt = t - .75;
    const bounce = hit ? Math.abs(Math.sin(bt * 14)) * 90 * Math.exp(-bt * 5) : 0;
    const camY = fall * 760;
    let s = `<g filter="url(#b10)">${posto(t)}</g><rect width="${W}" height="${H}" fill="#000" opacity=".2"/>`;
    let w = '';
    // lateral da porta do Corsa bem perto (empoeirada) e o chão de asfalto embaixo
    w += `<path d="M-40,-200 L${W + 40},-200 L${W + 40},1180 L-40,1180Z" fill="#a3a7aa"/><path d="M-40,-200 L${W + 40},-200 L${W + 40},420 L-40,420Z" fill="#1c2430"/><path d="M-40,420 L${W + 40},420 L${W + 40},450 L-40,450Z" fill="#8a8f94"/>`;
    { const r = rng(17); for (let i = 0; i < 90; i++) w += `<circle cx="${r() * W}" cy="${460 + r() * 700}" r="${3 + r() * 9}" fill="#7a6a52" opacity="${.15 + r() * .2}"/>`; }
    w += `<path d="M120,1180 L120,700 M-40,880 L${W + 40},880" stroke="#5a5f64" stroke-width="6" opacity=".5"/><rect y="1180" width="${W}" height="1600" fill="#2a2b30"/>`;
    { const r = rng(5); for (let i = 0; i < 160; i++) w += `<circle cx="${r() * W}" cy="${1190 + r() * 1500}" r="${1 + r() * 3}" fill="#55575e" opacity=".6"/>`; }
    w += `<ellipse cx="560" cy="1720" rx="260" ry="40" fill="#000" opacity="${hit ? .45 : .2 * fall}" filter="url(#b10)"/>`;
    s += g(w, `translate(0,${-camY})`);
    // o retrovisor
    const my = lerp(560, 1700 - 760, fall) - bounce;
    s += g(`<path d="M0,0 L40,-8 L46,24 L4,26Z" fill="#a3a7aa" stroke="#2a2d32" stroke-width="3"/><path d="M8,4 L36,-1 L40,20 L10,21Z" fill="#26313c"/><path d="M10,6 L24,3 L14,18Z" fill="#fff" opacity=".35"/>`, `translate(${540 + wob + fall * 30},${my}) rotate(${fall * 120 + (hit ? Math.sin(bt * 20) * 10 * Math.exp(-bt * 4) : wob)}) scale(6) translate(-23,-9)`, 'filter="url(#sh)"');
    if (hit) {
      for (let i = 0; i < 6; i++) { const a = -Math.PI * (i + .5) / 6, d = Math.min(1, bt * 3) * (120 + i * 30); s += `<path d="M0,0 l14,-6 l4,12Z" fill="#cfd6de" transform="translate(${560 + Math.cos(a) * d},${960 + Math.sin(a) * d * .6 + bt * bt * 300}) rotate(${i * 50 + bt * 400})"/>`; }
      s += txt(540, 760, 'PLEC!', 170, '#fff', { w: 900, op: 1 - seg(bt, .45, .6), extra: `stroke="#000" stroke-width="16" paint-order="stroke" transform="translate(540,760) scale(${1 + .3 * Math.exp(-bt * 10)}) translate(-540,-760)"` });
    }
    return g(s, `translate(${hit ? Math.sin(bt * 60) * 10 * Math.exp(-bt * 6) : 0},0)`) + vignette();
  } },
  { at: 36.3, z: [1.0, 1.1], c: [600, 760], f: (t, p) => {
    let s = posto(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".25"/>`;
    s += g(rindo({ ...MINA, x: 0, y: 0, s: 1.1 }, t + .3), 'translate(960,900)', 'filter="url(#b10)"');
    const bob = Math.abs(Math.sin(t * 13)) * -18, x = 640, y = 720 + bob, S = 1.85;
    // braço apontando para o carro (para a esquerda, onde está o Lucas)
    const sx = x - 210 * S * .55, sy = y + 360, hx = 250, hy = 860 + bob * .5;
    s += `<path d="M${sx},${sy} Q${(sx + hx) / 2},${sy - 120} ${hx},${hy}" stroke="${CARA2.top}" stroke-width="110" fill="none" stroke-linecap="round"/><path d="M${sx},${sy} Q${(sx + hx) / 2},${sy - 120} ${hx},${hy}" stroke="#000" stroke-width="110" fill="none" stroke-linecap="round" opacity=".15" transform="translate(0,8)"/>`;
    s += bust({ ...CARA2, x, y, s: S, eyes: 'dot', mouth: 'laugh', brows: 'up', look: -14, blink: false });
    s += g(`<rect x="-46" y="-40" width="92" height="80" rx="28" fill="#c27b4c"/><rect x="-150" y="-18" width="120" height="30" rx="15" fill="#c27b4c"/><path d="M-20,-20 v40 M0,-22 v44" stroke="#a8653e" stroke-width="4" opacity=".6"/><rect x="-10" y="20" width="44" height="26" rx="13" fill="#c27b4c"/>`, `translate(${hx - 20},${hy}) rotate(${-14 + Math.sin(t * 13) * 4})`);
    s += txt(820, 420, 'KKKKK', 80, '#fff', { w: 900, op: .9, extra: 'stroke="#000" stroke-width="10" paint-order="stroke" transform="rotate(8,820,420)"' });
    s += orangeKey(380, 640, 300, t) + overShoulder(-1);
    return s + vignette();
  } },
  // PLANO 12 — rente ao pneu careca; alguém filmando ao fundo
  { at: 39, z: [1.0, 1.08], c: [540, 1000], f: (t, p) => {
    let s = `<g filter="url(#b10)">${posto(t)}${pessoa({ ...MINA, x: 820, y: 700, s: .9, filmando: 1, eyes: 'dot', mouth: 'smile' })}</g>`;
    s += `<rect y="1500" width="${W}" height="420" fill="#1a1a1e"/>`;
    s += g(`<circle r="420" fill="#1c1d20"/><circle r="420" fill="none" stroke="#2c2d31" stroke-width="30"/><circle r="250" fill="#8a9098"/><circle r="200" fill="#6a7078"/>` + Array.from({ length: 4 }, (_, k) => `<rect x="-24" y="-190" width="48" height="140" rx="18" fill="#4a5058" transform="rotate(${k * 90 + 45})"/>`).join('') + `<circle r="50" fill="#2a2d32"/>` + Array.from({ length: 24 }, (_, k) => `<rect x="-6" y="-418" width="12" height="20" fill="#3a3b3f" opacity=".5" transform="rotate(${k * 15})"/>`).join(''), 'translate(380,1340)');
    const kick = Math.max(0, Math.sin(seg(p, .2, .8) * Math.PI * 3)) * 60;
    s += g(`<path d="M-40,-600 L60,-600 L70,-60 L-50,-60Z" fill="#2a3a5a"/><path d="M-80,-80 C-80,-110 140,-120 200,-90 C230,-70 230,0 200,10 L-70,10 C-90,10 -90,-50 -80,-80Z" fill="#f2f2f2"/><path d="M-80,-20 L220,-20" stroke="#d8262a" stroke-width="12"/>`, `translate(${880 - kick},1560) rotate(-8)`);
    s += panel(540, 300, 560, 130, txt(0, 24, 'PNEU CARECA', 70, '#ff6a5a', { w: 900 }), { s: pop(p, .3), rot: -3 });
    return s + vignette();
  } },
  // PLANO 13 — chave girando, carro não pega; Lucas suando
  { at: 43, z: [1.0, 1.1], c: [540, 900], f: (t, p) => {
    const turn = Math.max(0, Math.sin(seg(p, .1, 1) * Math.PI * 2)) * (1 + Math.sin(t * 40) * .05);
    let s = ignition(t, p, turn);
    s += panel(540, 280, 520, 120, txt(0, 22, `TENTATIVA ${p < .55 ? 1 : 2}`, 66, '#fff', { w: 900 }), { s: 1 });
    return g(s, `translate(${turn > .5 ? Math.sin(t * 60) * 6 : 0},0)`) + vignette(true);
  } },
  { at: 44.7, z: [1.0, 1.12], c: [560, 760], f: (t, p) => {
    const s = cabinClose(t, p, { x: 560, person: lucasDriving(t, { x: 560, y: 760, s: 1.75, eyes: 'wide', mouth: 'small', brows: 'sad', sweat: t, look: -14, grip: 9 }) });
    return g(s, `translate(${Math.sin(t * 1.7) * 5},${Math.sin(t * 2.3) * 4})`) + vignette(true);
  } },
  { at: 45.6, z: [1.0, 1.05], c: [540, 900], f: (t, p) => {
    const turn = Math.max(0, Math.sin(seg(p, 0, 1) * Math.PI)) * (1 + Math.sin(t * 40) * .05);
    return g(ignition(t, p, turn) + panel(540, 280, 520, 120, txt(0, 22, 'TENTATIVA 2', 66, '#fff', { w: 900 }), {}), `translate(${Math.sin(t * 60) * 5 * turn},0)`) + vignette(true);
  } },
  // PLANO 14 — por trás do Corsa: pega e solta fumaça na galera
  { at: 46.9, z: [1.0, 1.08], c: [540, 1100], f: (t, p) => {
    let s = posto(t);
    GALERA.forEach((o, i) => { const cough = seg(p, .45, .6); s += g(cough > 0 ? rindo({ ...o, x: 0, y: 0, s: .55 }, t + i, .4) : bust({ ...o, x: 0, y: 0, s: .55, eyes: 'closed', mouth: 'open', brows: 'up' }), `translate(${220 + i * 210},${1000 + (i % 2) * 30})`, 'filter="url(#b5)"'); });
    const go = p > .35, shake = go ? Math.sin(t * 70) * 4 : Math.sin(t * 50) * 2;
    s += corsaRear(540 + shake, 1720, 1.15, { dust: 1, brake: go ? .8 : 0 }) + postoFG(t, 1);
    const sm = seg(p, .35, 1);
    if (sm > 0) { const r = rng(12); for (let i = 0; i < 26; i++) { const k = clamp(sm * 1.4 - i * .03); if (k <= 0) continue; s += `<circle cx="${780 + (r() - .3) * 900 * k}" cy="${1650 - r() * 900 * k}" r="${40 + k * (120 + r() * 120)}" fill="${['#9a9a9a', '#7a7a7a', '#b0b0b0'][i % 3]}" opacity="${.75 * (1 - k * .5)}" filter="url(#b18)"/>`; } }
    s += panel(540, 260, 560, 120, txt(0, 22, p > .35 ? 'TENTATIVA 3 ✓' : 'TENTATIVA 3', 66, p > .35 ? '#7aff9a' : '#fff', { w: 900 }), {});
    if (p > .55) s += txt(300, 760, 'COF! COF!', 80, '#fff', { w: 900, extra: 'stroke="#000" stroke-width="10" paint-order="stroke" transform="rotate(-8,300,760)"' });
    return s + vignette();
  } },
  // PLANO 15 — close na mão apertando o volante; tudo abafado, como debaixo d'água
  { at: 50.4, z: [1.0, 1.12], c: [300, 1450], f: (t, p) => {
    const id = uid('uw');
    let in1 = cabinClose(t, p, { x: 560, person: lucasDriving(t, { x: 560, y: 760, s: 1.75, mouth: 'flat', brows: 'serious', grip: 14 }) });
    in1 = g(in1, 'translate(420,1250) scale(2.7) translate(-262,-1470)');
    let s = `<defs><filter id="${id}"><feTurbulence type="turbulence" baseFrequency="0.006 0.018" numOctaves="2" seed="${Math.floor(t * 6)}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="22"/></filter></defs>`;
    s += `<g filter="url(#${id})">${in1}<rect width="${W}" height="${H}" fill="#0a2a4a" opacity=".35"/></g>`;
    for (let i = 0; i < 6; i++) { const k = (t * .4 + i / 6) % 1; s += `<circle cx="${150 + i * 150}" cy="${1800 - k * 1500}" r="${8 + i * 3}" fill="none" stroke="#bfe6ff" stroke-width="3" opacity="${.45 * (1 - k)}"/>`; }
    return s + vignette(true);
  } },
  // PLANO 16 — lembrança 3: estrada no pôr do sol, travelling lateral
  { at: 54.4, z: [1.0, 1.06], c: [540, 960], f: (t, p) => {
    const id = uid('ss');
    let s = `<defs>${linGrad(id, [[0, '#ff8a4a'], [.5, '#ffc070'], [1, '#ffe2a0']])}</defs><rect width="${W}" height="1200" fill="url(#${id})"/><circle cx="760" cy="760" r="150" fill="#fff0b8" filter="url(#glow2)"/>`;
    const hill = (yy, col, sp, amp, seed) => { let d = `M0,${H}`; for (let x = 0; x <= W + 40; x += 40) d += ` L${x},${yy + Math.sin((x + t * sp) * .006 + seed) * amp + Math.sin((x + t * sp) * .017 + seed) * amp * .4}`; return `<path d="${d} L${W},${H}Z" fill="${col}"/>`; };
    s += hill(900, '#c46a5a', 40, 60, 1) + hill(1000, '#8a4a4a', 120, 50, 2);
    s += `<rect y="1180" width="${W}" height="320" fill="#3a3036"/>` + Array.from({ length: 7 }, (_, i) => `<rect x="${((i * 240 - t * 1400) % 1680 + 1680) % 1680 - 300}" y="1330" width="140" height="14" fill="#ffd25a"/>`).join('');
    s += hill(1500, '#5a3a2a', 900, 30, 3);
    let car = corsa(0, 0, 1, { col: '#dfe5ec', spin: t * 600 });
    car += g(headG({ ...AVO_MEIO, eyes: 'dot', mouth: 'smile', brows: 'neutral' }), 'translate(40,-240) scale(.42)');
    car += `<path d="M90,-215 C130,-200 150,-180 160,-150" stroke="#4a5a6a" stroke-width="24" stroke-linecap="round" fill="none"/><circle cx="162" cy="-146" r="14" fill="#c27b4c"/>`;
    s += g(car, `translate(${540 + Math.sin(t * 1.5) * 10},${1360 + Math.sin(t * 9) * 3}) scale(.95)`);
    for (let i = 0; i < 5; i++) s += `<path d="M${((i * 300 - t * 2000) % 1500 + 1500) % 1500 - 200},${1100 + i * 40} h-180" stroke="#fff" stroke-width="3" opacity=".3"/>`;
    return flash(s, 56);
  } },
  // PLANO 17 — lembrança 4 (câmera de lado): Lucas criança no colo do avô, as duas mãos no volante; o avô sorri com as mãos perto das dele
  { at: 59.4, z: [1.0, 1.07], c: [540, 960], f: (t, p) => {
    let s = `<rect width="${W}" height="${H}" fill="#3a2e24"/>`;
    // janelas: para-brisa à esquerda e vidro lateral ao fundo (estacionamento vazio de dia)
    s += `<path d="M-40,260 L420,200 L380,980 L-40,1060Z" fill="#f2e2c0"/><path d="M470,190 L1120,160 L1120,900 L460,940Z" fill="#efe0be"/>`;
    s += `<g filter="url(#b10)"><rect x="-40" y="700" width="1200" height="300" fill="#b8ae9a"/>${Array.from({ length: 7 }, (_, i) => `<rect x="${((i * 190 + t * 40) % 1300) - 100}" y="820" width="90" height="10" fill="#fff"/>`).join('')}<circle cx="900" cy="380" r="90" fill="#fff6d0" opacity=".8"/></g>`;
    s += `<path d="M420,200 L470,190 L460,940 L380,980Z" fill="#4a3c30"/><path d="M-40,150 L1120,120 L1120,200 L-40,260Z" fill="#2e241c"/>`;
    s += sunLight(t);
    // banco do motorista atrás do avô
    s += `<rect x="640" y="620" width="380" height="1000" rx="90" fill="#5a4c40"/>` + Array.from({ length: 8 }, (_, i) => `<path d="M${670 + i * 44},650 V1580" stroke="#000" stroke-width="5" opacity=".2"/>`).join('');
    // braço de trás do avô (atrás do Lucas)
    const A = AVO_MEIO, wob = Math.sin(t * 2) * 5;
    s += `<path d="M900,1050 Q680,820 330,${880 + wob}" stroke="${A.top}" stroke-width="90" fill="none" stroke-linecap="round"/><path d="M900,1050 Q680,820 330,${880 + wob}" stroke="#000" stroke-width="90" fill="none" stroke-linecap="round" opacity=".25"/>`;
    // avô (maior, ao fundo), sorrindo, olhando para o neto
    s += bust({ ...A, x: 760, y: 700, s: 1.45, eyes: 'dot', mouth: 'smile', brows: 'up', look: -16 });
    // Lucas criança no colo, olhando para a frente, rindo
    s += bust({ ...KID, x: 560, y: 1040, s: 1.3, eyes: 'dot', mouth: 'smile', brows: 'up', look: -10, blink: blinkAt(t, 2.6) });
    // volante visto de lado + coluna até o painel
    s += `<path d="M300,1200 L-40,1420 L-40,1560 L330,1300Z" fill="#1c1a18"/><path d="M-40,1160 C120,1120 260,1180 300,1260 L-40,1700Z" fill="#2a2420"/>`;
    s += `<ellipse cx="300" cy="1180" rx="70" ry="270" fill="none" stroke="#141416" stroke-width="44" transform="rotate(-8,300,1180)"/>`;
    // bracinhos do Lucas até o aro e as DUAS mãozinhas no volante
    const kh = [[285, 1020 + wob], [305, 1290 + wob]];
    for (const [hx, hy] of kh) s += `<path d="M${hy < 1100 ? 420 : 440},${hy < 1100 ? 1280 : 1380} Q360,${(1300 + hy) / 2} ${hx + 30},${hy}" stroke="${KID.top}" stroke-width="64" fill="none" stroke-linecap="round"/>`;
    for (const [hx, hy] of kh) s += `<circle cx="${hx}" cy="${hy}" r="34" fill="#d08c5c"/><path d="M${hx - 22},${hy - 10} h44 M${hx - 22},${hy + 4} h44" stroke="#b06e44" stroke-width="4" opacity=".6"/>`;
    // braço da frente do avô e as mãos dele logo perto das do Lucas
    s += `<path d="M700,1350 Q520,1460 350,${1440 + wob}" stroke="${A.top}" stroke-width="96" fill="none" stroke-linecap="round"/>`;
    s += hand(320, 880 + wob, .75, -100, { skin: '#c88a5c' }) + hand(330, 1430 + wob, .75, -80, { skin: '#c88a5c' });
    s += `<g filter="url(#b18)"><rect x="-40" y="1700" width="1200" height="300" fill="#1c1612"/></g>`;
    return flash(g(s, `translate(${Math.sin(t * 1.3) * 6},${Math.sin(t * 1.9) * 4})`), 62);
  } },
  // PLANO 18 — lembrança 5: o mesmo posto anos atrás, avô admirado; desfaz e vira o Lucas sozinho
  { at: 64.4, z: [1.0, 1.06], c: [540, 1000], f: (t, p) => {
    const mix = easeInOut(seg(p, .5, .85));
    let past = posto(t, { past: 1 }) + corsa(540, 1500, .82, { col: '#e2e8ee', low: 1 }) + fullBody({ x: 250, y: 1560, s: .75, top: AVO_MEIO.top, legs: '#2a3040', armL: 30, armR: -14, head: { ...AVO_MEIO, eyes: 'dot', mouth: 'smile', brows: 'neutral' } }, t);
    [[700, 1200, CARA1], [820, 1220, MINA], [940, 1210, CARA3]].forEach(([x, y, o]) => past += bust({ ...o, top: '#a85a3a', x, y, s: .42, eyes: 'wide', mouth: 'o', brows: 'up', look: -18 }));
    for (let i = 0; i < 6; i++) { const k = (t * .6 + i / 6) % 1; past += txt(500 + Math.sin(i * 2) * 300, 1200 - k * 400, '✦', 50, '#fff8c0', { op: 1 - k }); }
    let now = posto(t) + corsa(540, 1500, .82, { dust: 1, mirror: false }) + fullBody({ x: 250, y: 1560, s: .75, top: LUCAS.top, legs: '#2a2a32', armL: 6, armR: -6, head: { ...LUCAS, eyes: 'dot', mouth: 'flat', brows: 'sad' } }, t);
    const cam = `translate(540,900) scale(${lerp(2.3, 2.45, p)}) translate(-330,-1230)`;
    return `<g opacity="${1 - mix}">${flash(g(past, cam), 67)}</g><g opacity="${mix}">${g(now, cam)}${vignette()}</g>`;
  } },
  // PLANO 19 — câmera lenta: pega o retrovisor do chão e encara a galera
  { at: 69.4, z: [1.0, 1.12], c: [540, 1100], f: (t, p) => {
    let s = `<g filter="url(#b10)">${posto(t * .3)}</g><rect width="${W}" height="${H}" fill="#000" opacity=".3"/>`;
    s += `<rect y="1450" width="${W}" height="470" fill="#202126"/>`;
    const k = easeInOut(seg(p, .1, .9));
    s += g(`<path d="M0,0 L120,-24 L138,72 L12,78Z" fill="#c3cad1" stroke="#2a2d32" stroke-width="6"/><path d="M24,12 L108,-3 L120,60 L30,63Z" fill="#26313c"/>`, `translate(${lerp(460, 470, k)},${lerp(1600, 1080, k)}) rotate(${lerp(60, 0, k)}) scale(1.6)`);
    s += hand(lerp(560, 600, k), lerp(1560, 1050, k), 1.8, 170, { sleeve: LUCAS.top });
    return s + vignette(true);
  } },
  { at: 72.5, z: [1.0, 1.14], c: [540, 760], f: (t, p) => {
    let s = posto(t * .3) + `<rect width="${W}" height="${H}" fill="#000" opacity=".35"/>`;
    s += bust({ ...LUCAS, x: 540, y: 780, s: 1.55, eyes: 'dot', mouth: 'flat', brows: 'serious', breath: t * .4 });
    s += g(`<path d="M0,0 L120,-24 L138,72 L12,78Z" fill="#c3cad1" stroke="#2a2d32" stroke-width="6"/><path d="M24,12 L108,-3 L120,60 L30,63Z" fill="#26313c"/>`, 'translate(700,1240) rotate(-10) scale(1.4)');
    GALERA.forEach((o, i) => { s += g(bust({ ...o, x: 0, y: 0, s: 1, eyes: 'dot', mouth: 'flat', brows: 'neutral' }), `translate(${i < 2 ? 40 + i * 120 : 900 + (i - 2) * 140},${1700})`, 'filter="url(#b18)"'); });
    return s + vignette(true);
  } },
  // PLANO 20 — close no celular: anúncio "vendo Corsa" pela metade x vídeo JDM pausado
  { at: 76, z: [1.0, 1.1], c: [540, 900], f: (t, p) => {
    let s = `<g filter="url(#b18)">${posto(t)}</g><rect width="${W}" height="${H}" fill="#000" opacity=".55"/>`;
    const full = 'Vendo Corsa 1.0 prata, motor bom, só';
    const n = Math.floor(lerp(8, full.length, seg(p, 0, .5)));
    const cur = Math.floor(t * 2.5) % 2 ? '|' : '';
    let sc = `<rect width="400" height="410" fill="#f4f4f6"/><rect width="400" height="60" fill="#ff7a2a"/>` + txt(20, 40, 'ANUNCIAR', 26, '#fff', { a: 'start', w: 900 });
    sc += g(corsa(0, 0, .2, { dust: 1 }), 'translate(200,190)') + `<rect x="20" y="240" width="360" height="130" rx="10" fill="#fff" stroke="#ccc" stroke-width="2"/>`;
    sc += `<text x="34" y="280" font-family="NU" font-size="22" font-weight="700" fill="#222">${full.slice(0, Math.min(n, 22))}</text><text x="34" y="310" font-family="NU" font-size="22" font-weight="700" fill="#222">${full.slice(22, Math.max(22, n))}${cur}</text>`;
    sc += `<rect y="410" width="400" height="410" fill="#000"/>` + `<svg x="0" y="410" width="400" height="410" viewBox="0 0 400 410">${g(neonCity(0) + corsa(540, 1500, .55, { jdm: 1, low: 1 }), 'scale(.37) translate(0,-720)')}</svg>` + `<rect y="410" width="400" height="410" fill="#000" opacity=".35"/><circle cx="200" cy="615" r="56" fill="#000" opacity=".6"/><rect x="178" y="590" width="14" height="50" fill="#fff"/><rect x="208" y="590" width="14" height="50" fill="#fff"/><rect x="20" y="790" width="360" height="6" fill="#444"/><rect x="20" y="790" width="190" height="6" fill="#ff2f6a"/>` + txt(20, 450, 'JDM NIGHT RUN · PAUSADO', 20, '#fff', { a: 'start', w: 800 });
    sc += `<rect y="406" width="400" height="8" fill="#ffc928"/>`;
    s += phone(540, 880, 1.5, 0, sc);
    return s;
  } },
  // PLANO 21 — final: A em cima (vender), B embaixo (Corsa + silhueta JDM); falas ao lado de cada letra; COMENTA AÍ no fim
  { at: 81.5, z: [1.0, 1.03], c: [540, 960], f: (t, p) => {
    const id = uid('fn'), T = __T, CH = window.AUREA_CHUNKS || [];
    const ch = CH.find(c => T >= c.s - .03 && T < c.e) || null;
    const bStart = (CH.find(c => c.s > 78 && /^ou$/i.test(c.toks[0].t)) || { s: 1e9 }).s;
    const cStart = (CH.find(c => c.s > 78 && /^comenta/i.test(c.toks[0].t)) || { s: 1e9 }).s;
    const cap = (c, x, y, size) => { if (!c) return ''; const sc = T - c.s < .1 ? lerp(.85, 1, (T - c.s) / .1) : 1; return `<g transform="translate(${x},${y}) scale(${sc})"><text font-family="RC" font-weight="900" font-size="${size}" text-anchor="start" stroke="#000" stroke-width="12" stroke-linejoin="round" paint-order="stroke">${c.toks.map((k, i) => { const w = k.t.replace(/[.,:…!?]+$/, ''); const hl = /^(avô|melhor|corsa|projeto|A|B)$/i.test(w); return `<tspan fill="${hl ? GOLD : '#fff'}">${(i ? ' ' : '') + w.toUpperCase()}</tspan>`; }).join('')}</text></g>`; };
    let s = `<defs><clipPath id="${id}a"><rect width="${W}" height="930"/></clipPath><clipPath id="${id}b"><rect y="990" width="${W}" height="930"/></clipPath></defs>`;
    const actA = T < bStart, actB = T >= bStart && T < cStart;
    s += `<g clip-path="url(#${id}a)" opacity="${actB ? .55 : 1}">${lab(t, { glow: '#ffc928' })}`;
    { const k = easeInOut(clamp((T - 82.2) / .8)); s += g(corsa(0, 0, .42, { dust: 1 }) + txt(0, 70, 'VENDE', 44, '#ff6a5a', { w: 900 }), `translate(${lerp(330, 250, k)},640) scale(${lerp(1, .85, k)})`, `opacity="${lerp(1, .6, k)}"`);
      s += g(`<path d="M-70,0 H50 M20,-34 L60,0 L20,34" stroke="${GOLD}" stroke-width="18" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, `translate(540,560) scale(${k || .001})`);
      s += g(newCar(0, 0, .42, '#c8312e') + txt(0, 70, 'UM MELHOR', 44, GOLD, { w: 900 }), `translate(${lerp(1100, 820, k)},640)`, `opacity="${k}"`); }
    s += `<circle cx="140" cy="190" r="90" fill="${GOLD}"/>` + txt(140, 226, 'A', 110, '#111', { w: 900 }) + `</g>`;
    s += `<g clip-path="url(#${id}b)" opacity="${actA ? .55 : 1}">${lab(t, { glow: '#c04dff' })}`;
    s += corsa(560, 1700, .9, { dust: 1 });
    const gl = .5 + .5 * Math.sin(t * 4);
    s += `<path d="${BODY}" transform="translate(560,1700) scale(.9) translate(0,40)" fill="none" stroke="#d58cff" stroke-width="7" stroke-dasharray="18 10" opacity="${.5 + .5 * gl}" filter="url(#glow)"/>`;
    s += g(`<circle r="64" fill="none" stroke="#d58cff" stroke-width="7" stroke-dasharray="12 8" filter="url(#glow)"/>`, 'translate(366,1634)') + g(`<circle r="64" fill="none" stroke="#d58cff" stroke-width="7" stroke-dasharray="12 8" filter="url(#glow)"/>`, 'translate(812,1634)');
    s += txt(560, 1360, 'PROJETO', 54, '#d58cff', { w: 900, ls: 6, op: .9 }) + `<circle cx="140" cy="1110" r="90" fill="#c04dff"/>` + txt(140, 1146, 'B', 110, '#111', { w: 900 }) + `</g>`;
    s += `<rect y="930" width="${W}" height="60" fill="#0b0b0f"/>`;
    // falas: A só ao lado do A, B só ao lado do B
    if (ch && actA && T > 81.6) s += cap(ch, 260, 220, 66);
    if (ch && actB) s += cap(ch, 260, 1140, 66);
    // COMENTA AÍ: uma vez só, no centro, no fim
    if (T >= cStart) { const k = pop(T - cStart, 0, .18); s += `<rect width="${W}" height="${H}" fill="#000" opacity="${.45 * Math.min(1, (T - cStart) * 4)}"/>` + txt(540, 1000, 'COMENTA AÍ', 140, '#fff', { w: 900, extra: `stroke="#000" stroke-width="16" paint-order="stroke" transform="translate(540,960) scale(${k * (1 + .03 * Math.sin(t * 6))}) translate(-540,-960)"` }) + txt(540, 1110, 'A OU B?', 70, GOLD, { w: 900, op: Math.min(1, (T - cStart) * 3), extra: 'stroke="#000" stroke-width="10" paint-order="stroke"' }); }
    return s;
  } },
];
const easeInOut = ease;
const __bustBase = bust;
bust = function (o) { const b = { ...o }; if (b.breath == null) b.breath = __T; if (b.blink == null && (!b.eyes || b.eyes === 'dot' || b.eyes === 'wide')) b.blink = blinkAt(__T + (b.x || 0) * .0013, 3.4); return __bustBase(b); };
SCENES.forEach(sc => { const f = sc.f; sc.f = (t, p, d) => { __T = (sc.at || 0) + t; return f(t, p, d); }; });
