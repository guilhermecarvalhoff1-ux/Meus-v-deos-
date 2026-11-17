// O CORSA DOS 18 — personagens (base copiada do Áurea Ep2)
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
  return g(h, `translate(${x},${y}) rotate(${rot}) scale(${s})`);
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
const PART = { words: 'words.json', end: 68.3, abTime: 58.5,
  merges: [
    [['18','anos'], '18 ANOS'],
    [['vinte','e','poucos','anos'], '20 E POUCOS ANOS'],
    [['parte','2'], 'PARTE 2'],
  ],
  hl: ['lucas','carro','corsa','avô','foguete','rasgado','cigarro','lata','verdade','contas','entrada','novo','parcela','jdm','japanese','domestic','market','japonês','cultura','rebaixado','roda','largo','adesivo','portaluvas','foto','escolhas','zero','transformar','brasileiro','projeto','outro','vende','fica','comenta','escolha']
};

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

// ---------- cenas ----------
const SCENES = [
  // 1 — bolo do 18 (close, foco no bolo, carro escondido no escuro)
  { k: 'no dia em', z: [1.25, 1.12], c: [540, 820], f: (t, p) => {
    let s = garage(t, { lightR: 420 });
    s += g(corsa(540, 1280, 1.05, { dust: 1, bow: 1 }), '', 'filter="url(#b18)" opacity=".55"');
    s += `<rect width="${W}" height="${H}" fill="#000" opacity=".35"/>`;
    s += cake(540, 1180, 1.25, t);
    s += vignette(true);
    return s;
  } },
  // 2 — Lucas sonhando com um carrão
  { k: 'o lucas esperava', z: [1.0, 1.1], c: [540, 760], f: (t, p) => {
    let s = garage(t);
    s += bust({ ...LUCAS, x: 540, y: 820, s: 1.55, eyes: 'closed', mouth: 'smile', brows: 'up', breath: t });
    const k = easeOut(seg(p, .15, .5));
    s += g(`<ellipse cx="0" cy="0" rx="300" ry="170" fill="#f4f6fa"/><circle cx="-240" cy="190" r="26" fill="#f4f6fa"/><circle cx="-280" cy="250" r="16" fill="#f4f6fa"/>` + g(newCar(0, 70, .5, '#e0262a'), '') + txt(0, -110, 'CARRÃO?', 44, '#c8312e', { w: 900 }), `translate(700,330) scale(${k || .001})`);
    return s + vignette();
  } },
  // 3 — revelação: o Corsa empoeirado com laço (câmera abre)
  { k: 'e ganhou', z: [1.45, 1.0], c: [540, 1100], f: (t, p) => {
    let s = garage(t);
    s += corsa(540, 1320, 1.08, { dust: 1, bow: 1 });
    s += g(cake(0, 0, .9, t), 'translate(170,1830)', 'filter="url(#b10)"');
    s += panel(540, 330, 520, 150, txt(0, 26, 'CORSA 1.0', 76, GOLD, { w: 900 }) + txt(0, 66, 'PRATA · EMPOEIRADO', 28, '#cfd6de', { w: 700 }), { s: pop(p, .45) });
    return s + vignette();
  } },
  // 4 — o retrovisor cai sozinho (câmera acompanha a queda)
  { k: 'era o corsa', z: [1.0, 1.0], c: [540, 1000], f: (t, p) => {
    const fall = easeIn(seg(p, .2, .55));
    const cy = lerp(0, 180, fall);
    let s = g(garage(t) + `<rect y="1900" width="${W}" height="300" fill="#121216"/>` + corsa(320, 1320, 1.25, { dust: 1, mirror: { dx: fall * 30, dy: fall * 205, rot: fall * 120 + (p > .55 ? Math.sin((p - .55) * 40) * 6 * (1 - p) : 0) } }), `translate(0,${-cy})`);
    s += g(bust({ ...LUCAS, x: 0, y: 0, s: 1, eyes: p > .55 ? 'wide' : 'dot', mouth: p > .55 ? 'o' : 'flat', brows: p > .55 ? 'up' : 'neutral', look: -10 }), `translate(930,${1180 - cy})`);
    if (p > .55) s += txt(620, 1020 - cy, 'CLEC!', 90, '#fff', { w: 900, op: 1 - seg(p, .8, 1), extra: 'stroke="#000" stroke-width="10" paint-order="stroke"' });
    return s + vignette();
  } },
  // 5 — quilometragem de foguete (painel)
  { k: 'tinha quilometragem', z: [1.0, 1.12], c: [540, 820], f: (t, p) => {
    let s = lab(t, { c1: '#151515', c2: '#050505', glow: '#ff7a2a' });
    const km = Math.round(lerp(12000, 487312, easeOut(seg(p, 0, .8))));
    const kms = km.toLocaleString('pt-BR');
    s += panel(540, 760, 900, 520, `<circle cx="0" cy="40" r="220" fill="#0a0a0c" stroke="#3a3a40" stroke-width="10"/>` + Array.from({ length: 9 }, (_, i) => `<rect x="-4" y="-200" width="8" height="34" fill="#ddd" transform="translate(0,40) rotate(${-120 + i * 30})"/>`).join('') + `<rect x="-6" y="-170" width="12" height="190" rx="6" fill="#ff5a2a" transform="translate(0,40) rotate(${lerp(-120, 118, easeOut(seg(p, 0, .8))) + Math.sin(t * 40) * 2})"/><circle cx="0" cy="40" r="22" fill="#333"/>` + `<rect x="-200" y="130" width="400" height="80" rx="10" fill="#1d1d20"/>` + txt(0, 192, kms + ' KM', 64, '#ffb03a', { w: 900, ls: 3 }) + txt(0, -210, 'HODÔMETRO', 32, '#888', { w: 800, ls: 6 }), { fill: '#141416', stroke: '#444' });
    const rk = easeIn(seg(p, .3, 1));
    s += g(`<path d="M0,-70 C30,-40 30,30 20,50 L-20,50 C-30,30 -30,-40 0,-70Z" fill="#e8ecf2"/><circle cx="0" cy="-10" r="14" fill="#4fb0ff"/><path d="M-20,30 L-44,60 L-20,50Z M20,30 L44,60 L20,50Z" fill="#d8262a"/><path d="M-14,52 C-10,${90 + Math.sin(t * 30) * 10} 10,${90 + Math.sin(t * 30) * 10} 14,52Z" fill="#ffb03a"/>`, `translate(${880},${380 - rk * 500}) rotate(15) scale(1.5)`);
    return s;
  } },
  // 6 — banco rasgado (close com pan)
  { k: 'banco rasgado', z: [1.15, 1.25], c: [540, 900], f: (t, p) => {
    let s = `<rect width="${W}" height="${H}" fill="#14110e"/>`;
    s += `<g filter="url(#b5)"><rect x="0" y="0" width="${W}" height="500" fill="#2a2a2e"/></g>`;
    s += `<path d="M120,1700 C100,1200 140,700 260,500 C380,380 700,380 820,500 C940,700 980,1200 960,1700Z" fill="#6a6258"/><path d="M200,1700 C190,1240 220,780 320,600 C420,520 660,520 760,600 C860,780 890,1240 880,1700Z" fill="#7a7266"/>`;
    for (let i = 0; i < 9; i++) s += `<path d="M${230 + i * 70},620 C${226 + i * 70},1000 ${226 + i * 70},1300 ${230 + i * 70},1700" stroke="#5a5248" stroke-width="5" opacity=".6"/>`;
    s += `<path d="M380,820 L430,780 L470,840 L520,770 L560,850 L610,790 L650,860 L620,1100 L560,1060 L520,1140 L470,1080 L420,1150 L390,1060Z" fill="#e8c35a"/><path d="M420,880 C460,940 540,960 600,900" stroke="#c99a2a" stroke-width="10" fill="none"/><path d="M450,980 q30,-30 60,0 q30,30 60,0" stroke="#8a8f96" stroke-width="10" fill="none"/>`;
    s += `<path d="M380,820 L430,780 L470,840 L520,770 L560,850 L610,790 L650,860" stroke="#3a342c" stroke-width="8" fill="none"/>`;
    s += panel(540, 330, 560, 130, txt(0, 22, 'BANCO RASGADO', 64, '#ff6a5a', { w: 900 }), { s: pop(p, .1), rot: -4 });
    return g(s, `translate(${(.5 - p) * 160},0)`) + vignette(true);
  } },
  // 7 — cheiro de cigarro (close no rosto)
  { k: 'um cheiro de', z: [1.0, 1.14], c: [540, 760], f: (t, p) => {
    let s = garage(t, { noBulb: 1 });
    for (let i = 0; i < 5; i++) { const x = 260 + i * 140, ph = t * 2 + i; s += `<path d="M${x},1200 C${x - 40},1050 ${x + 40 + Math.sin(ph) * 30},900 ${x},760 C${x - 40 + Math.cos(ph) * 20},620 ${x + 30},520 ${x},420" stroke="#9ab86a" stroke-width="22" fill="none" opacity=".35" stroke-linecap="round" filter="url(#b10)"/>`; }
    s += bust({ ...LUCAS, x: 540, y: 800, s: 1.6, eyes: 'closed', mouth: 'sad', brows: 'angry', breath: t });
    const sw = Math.sin(t * 5) * 18;
    s += g(`<path d="M0,-140 V-60" stroke="#ddd" stroke-width="4"/><path d="M0,-60 L-60,40 L-30,40 L-70,110 L-24,110 L-50,180 L50,180 L24,110 L70,110 L30,40 L60,40Z" fill="#2fae5a"/>` + txt(0, 160, '0%', 38, '#fff', { w: 900 }), `translate(860,420) rotate(${sw})`);
    s += panel(330, 260, 440, 120, txt(0, 20, 'NÃO SAI!', 64, '#9be36a', { w: 900 }), { s: pop(p, .45), rot: -5 });
    return s + vignette();
  } },
  // 8 — grupo dos amigos (celular)
  { k: 'os amigos falaram', z: [1.0, 1.08], c: [540, 860], f: (t, p) => {
    let s = garage(t, { noBulb: 1 }) + `<rect width="${W}" height="${H}" fill="#000" opacity=".5"/>`;
    let sc = `<rect width="400" height="90" fill="#1a1f2a"/>` + txt(200, 58, 'OS PARÇAS', 32, '#fff', { w: 900 });
    sc += bubbleMsg(16, 120, 300, 110, 'Biel', 'kkkkkkkk', false, seg(p, .05, .2));
    sc += bubbleMsg(16, 250, 330, 110, 'Duda', 'um CORSA??', false, seg(p, .3, .45));
    sc += bubbleMsg(16, 380, 300, 110, 'Teo', 'pqp kkkk', false, seg(p, .55, .7));
    s += phone(540, 860, 1.25, -4, sc);
    return s + vignette();
  } },
  // 9 — "Vende essa lata" (Dutch angle)
  { k: 'vende essa lata', z: [1.05, 1.15], c: [540, 860], f: (t, p) => {
    let s = g(garage(t) + corsa(540, 1320, 1.0, { dust: 1, mirror: false }), 'rotate(-7,540,960)');
    s += `<rect width="${W}" height="${H}" fill="#3a0000" opacity=".25"/>`;
    s += g(bubbleMsg(-360, -100, 740, 250, 'Biel', '"Vende essa lata e pega|um carro de verdade."', false, 1, 46), `translate(560,500) rotate(-7) scale(${pop(p, .02)})`);
    s += g(`<rect x="-200" y="-70" width="400" height="140" rx="20" fill="#d8262a" stroke="#fff" stroke-width="8"/>` + txt(0, 26, 'LATA?', 84, '#fff', { w: 900 }), `translate(760,1000) rotate(12) scale(${pop(p, .5)})`);
    return s + vignette();
  } },
  // 10 — Lucas fez as contas (vista de cima da mesa)
  { k: 'e o lucas fez', z: [1.0, 1.1], c: [540, 860], f: (t, p) => {
    let s = `<rect width="${W}" height="${H}" fill="#5a3a24"/>`;
    for (let i = 0; i < 14; i++) s += `<path d="M0,${i * 140 + 40} C300,${i * 140 + 20} 700,${i * 140 + 60} ${W},${i * 140 + 30}" stroke="#4a2e1c" stroke-width="6" fill="none" opacity=".6"/>`;
    s += g(`<rect x="-300" y="-380" width="600" height="760" fill="#f4f1e8"/>` + Array.from({ length: 14 }, (_, i) => `<path d="M-280,${-320 + i * 50} H280" stroke="#9ab8d8" stroke-width="2"/>`).join('') +
      txt(-260, -300, 'CONTAS', 54, '#2a2a30', { a: 'start', w: 900 }) +
      txt(-260, -200, 'Vende Corsa ... R$ 14.000', 34, '#2a3a8a', { a: 'start', fam: 'NU', w: 800, op: seg(p, .1, .25) }) +
      txt(-260, -130, 'Entrada ......... R$ 14.000', 34, '#2a3a8a', { a: 'start', fam: 'NU', w: 800, op: seg(p, .3, .45) }) +
      txt(-260, -60, 'Parcela ...... 48x R$ 890', 34, '#c8312e', { a: 'start', fam: 'NU', w: 900, op: seg(p, .5, .65) }), 'translate(470,820) rotate(-6)', 'filter="url(#sh)"');
    s += g(`<rect x="-120" y="-180" width="240" height="360" rx="24" fill="#2a2d34"/><rect x="-96" y="-150" width="192" height="80" rx="8" fill="#a8c890"/>` + txt(80, -90, '890', 48, '#1a2a10', { a: 'end', w: 900 }) + Array.from({ length: 12 }, (_, i) => `<rect x="${-90 + (i % 3) * 64}" y="${-40 + Math.floor(i / 3) * 52}" width="52" height="40" rx="8" fill="${i % 3 === 2 ? '#e0a020' : '#4a4e58'}"/>`).join(''), 'translate(860,1250) rotate(14)', 'filter="url(#sh)"');
    s += g(`<rect x="-10" y="-200" width="20" height="300" rx="8" fill="#e0b020"/><path d="M-10,100 L0,140 L10,100Z" fill="#2a2a30"/>`, `translate(${600 + Math.sin(t * 9) * 20},${700 + p * 120}) rotate(30)`, 'filter="url(#shs)"');
    return s + vignette();
  } },
  // 11 — vender o Corsa e dar entrada (infográfico)
  { k: 'vendendo o corsa', z: [1.0, 1.06], c: [540, 860], f: (t, p) => {
    let s = lab(t);
    const k = easeInOut(seg(p, .15, .6));
    s += corsa(lerp(540, -300, k), 620, .62, { dust: 1 });
    s += g(`<rect x="-150" y="-60" width="300" height="120" rx="18" fill="#1f6b4a"/>` + txt(0, 22, '+R$ 14 MIL', 54, '#fff', { w: 900 }), `translate(${lerp(540, -300, k)},360) scale(${pop(p, .05)})`);
    s += newCar(lerp(1400, 540, easeOut(seg(p, .4, .8))), 1000, .66, '#c8312e');
    s += panel(540, 1140, 520, 110, txt(0, 22, 'ENTRADA PAGA', 58, GOLD, { w: 900 }), { s: pop(p, .75) });
    return s;
  } },
  // 12 — anos pagando parcela
  { k: 'e ficar anos', z: [1.0, 1.1], c: [540, 820], f: (t, p) => {
    let s = lab(t, { glow: '#ff3a3a' });
    const n = Math.max(1, Math.round(lerp(1, 48, easeIn(seg(p, .05, .9)))));
    for (let i = 0; i < Math.min(n, 20); i++) s += g(`<rect x="-180" y="-34" width="360" height="68" rx="8" fill="#f2efe6" stroke="#bbb" stroke-width="2"/>` + txt(-160, 12, 'BOLETO · R$ 890', 30, '#333', { a: 'start', w: 800 }), `translate(${540 + Math.sin(i * 1.7) * 30},${1100 - i * 22}) rotate(${Math.sin(i * 2.3) * 6})`);
    s += panel(540, 340, 620, 230, txt(0, -10, 'PARCELA', 44, '#cfd6de', { w: 800, ls: 4 }) + txt(0, 80, `${n}/48`, 120, '#ff5a4a', { w: 900 }), {});
    s += txt(540, 560, `${2026 + Math.floor((n - 1) / 12)}`, 64, GOLD, { w: 900, ls: 6 });
    return s + vignette();
  } },
  // 13 — naquela noite (quarto escuro, luz do celular)
  { k: 'só que naquela', z: [1.0, 1.1], c: [540, 820], f: (t, p) => {
    let s = bedroom(t);
    s += `<path d="M60,1400 C60,1100 1020,1100 1020,1400 L1020,${H} L60,${H}Z" fill="#1c2236"/>`;
    s += g(bust({ ...LUCAS, x: 0, y: 0, s: 1.35, eyes: 'dot', mouth: 'flat', brows: 'neutral', look: 6, breath: t }), 'translate(500,820) rotate(-8)');
    s += `<ellipse cx="560" cy="760" rx="380" ry="420" fill="#6ab0ff" opacity="${.2 + .05 * Math.sin(t * 9)}" style="mix-blend-mode:screen" filter="url(#b30)"/>`;
    s += phone(640, 1260, .7, 14, `<rect width="400" height="820" fill="#2a1a4a"/><rect y="0" width="400" height="820" fill="#c04dff" opacity=".25"/>`);
    return s + vignette(true);
  } },
  // 14 — o vídeo de JDM no celular (câmera entra na tela)
  { k: 'caiu num vídeo', z: [1.0, 1.55], c: [540, 820], f: (t, p) => {
    let s = bedroom(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".5"/>`;
    const inner = g(neonCity(t) + corsa(540, 1500, .5, { jdm: 1, low: 1, spin: -t * 400 }), 'scale(.37) translate(0,-200)') + `<rect y="700" width="400" height="120" fill="#000" opacity=".7"/>` + txt(20, 750, 'JDM NIGHT RUN', 30, '#fff', { a: 'start', w: 900 }) + `<rect x="20" y="776" width="360" height="6" fill="#444"/><rect x="20" y="776" width="${360 * p}" height="6" fill="#ff2f6a"/>` + txt(340, 120, '♥ 2,1M', 26, '#fff', { a: 'end', w: 800 });
    s += phone(540, 820, 1.55, 0, inner);
    return s;
  } },
  // 15 — "pra quem não sabe" (infográfico limpo)
  { k: 'pra quem não', z: [1.1, 1.0], c: [540, 760], f: (t, p) => {
    let s = lab(t);
    const L = ['J', 'D', 'M'];
    L.forEach((l, i) => { const sc = pop(p, .1 + i * .12); for (let d = 14; d >= 0; d -= 2) s += txt(260 + i * 280 + d, 820 + d, l, 330, d ? '#7a5a10' : GOLD, { w: 900, extra: `transform="translate(${260 + i * 280},700) scale(${sc}) translate(${-(260 + i * 280)},-700)"` }); });
    s += txt(540, 420, 'O QUE É', 60, '#cfd6de', { w: 800, ls: 8 });
    return s;
  } },
  // 16 — Japanese Domestic Market
  { k: 'jdm vem de', z: [1.0, 1.06], c: [540, 760], f: (t, p) => {
    let s = lab(t);
    const rows = [['J', 'APANESE', 'japonês'], ['D', 'OMESTIC', 'doméstico'], ['M', 'ARKET', 'mercado']];
    rows.forEach(([a, b, c], i) => {
      const k = easeOut(seg(p, .1 + i * .2, .3 + i * .2)), y = 420 + i * 230;
      s += txt(150, y, a, 190, GOLD, { w: 900, a: 'start', extra: 'stroke="#000" stroke-width="10" paint-order="stroke"' });
      s += txt(285, y, b, 120, '#fff', { w: 900, a: 'start', op: k, extra: `transform="translate(${(1 - k) * 60},0)"` });
      s += txt(290, y + 56, c.toUpperCase(), 40, '#8fb0ff', { w: 800, a: 'start', ls: 6, op: k });
    });
    return s;
  } },
  // 17 — carros feitos pro mercado japonês
  { k: 'carros feitos pro', z: [1.0, 1.12], c: [540, 760], f: (t, p) => {
    let s = lab(t, { glow: '#ff3a5a' });
    s += japan(560, 760, 1.6);
    s += `<circle cx="528" cy="792" r="${60 + 30 * Math.sin(t * 6)}" fill="none" stroke="#d8262a" stroke-width="6" opacity=".6"/>`;
    s += panel(540, 300, 760, 130, txt(0, 22, 'FEITOS PRO JAPÃO', 64, '#fff', { w: 900 }), { s: pop(p, .1) });
    s += g(corsa(0, 0, .26, { jdm: 1, low: 1, col: '#e8ecf2' }), `translate(${lerp(560, 980, easeInOut(seg(p, .3, 1)))},${lerp(1000, 1080, p)})`);
    return s;
  } },
  // 18 — viraram cultura no mundo inteiro (globo com pinos)
  { k: 'que viraram cultura', z: [1.0, 1.12], c: [540, 760], f: (t, p) => {
    let s = lab(t);
    const id = uid('gl');
    s += `<defs>${radGrad(id, [[0, '#3a6aff'], [1, '#0a1a5a']], .4, .35, .7)}</defs><circle cx="540" cy="760" r="330" fill="url(#${id})"/>`;
    for (let i = -2; i <= 2; i++) s += `<ellipse cx="540" cy="760" rx="${Math.abs(Math.cos(t * .6 + i * .6)) * 330}" ry="330" fill="none" stroke="#8fb0ff" stroke-width="2" opacity=".35"/><path d="M${540 - Math.sqrt(330 * 330 - (i * 110) ** 2)},${760 + i * 110} H${540 + Math.sqrt(330 * 330 - (i * 110) ** 2)}" stroke="#8fb0ff" stroke-width="2" opacity=".35"/>`;
    const pins = [[400, 600], [700, 640], [620, 880], [450, 900], [760, 780], [330, 740], [560, 520], [520, 980]];
    pins.forEach(([x, y], i) => { const k = pop(p, .05 + i * .09); s += g(`<path d="M0,0 C-30,-40 -30,-80 0,-90 C30,-80 30,-40 0,0Z" fill="#ff3a5a"/><circle cx="0" cy="-58" r="12" fill="#fff"/>`, `translate(${x},${y}) scale(${k})`); });
    s += panel(540, 260, 700, 120, txt(0, 22, 'NO MUNDO INTEIRO', 62, GOLD, { w: 900 }), { s: pop(p, .5) });
    return s;
  } },
  // 19 — rebaixado (câmera no chão, contra-plongée)
  { k: 'rebaixado', z: [1.0, 1.08], c: [540, 1100], f: (t, p) => {
    let s = neonCity(t);
    const low = easeOut(seg(p, .1, .6));
    s += corsa(540, 1420, 1.15, { jdm: .6, low, col: '#c3cad1' });
    s += g(`<path d="M0,-70 V60" stroke="${GOLD}" stroke-width="12"/><path d="M-30,30 L0,70 L30,30Z" fill="${GOLD}"/>`, `translate(960,${1080 + low * 40})`);
    s += bigNum(860, 1000, `-${Math.round(low * 6)} CM`, 72);
    s += `<rect y="1460" width="${W}" height="460" fill="#000" opacity=".5" filter="url(#b30)"/>`;
    return s;
  } },
  // 20 — roda aro largo (close extremo girando)
  { k: 'roda aro largo', z: [1.0, 1.12], c: [540, 860], f: (t, p) => {
    let s = neonCity(t, { seed: 33 }) + `<rect width="${W}" height="${H}" fill="#000" opacity=".35"/>`;
    s += g(corsa(0, 0, 1, { jdm: 1, low: 1, spin: t * 500 }), 'translate(1300,1580) scale(3.2)');
    s += panel(540, 330, 600, 150, txt(0, -6, 'ARO 15', 70, GOLD, { w: 900 }) + txt(0, 46, 'TALA LARGA', 36, '#fff', { w: 800, ls: 6 }), { s: pop(p, .15) });
    for (let i = 0; i < 6; i++) s += `<path d="M${-200 + ((t * 2600 + i * 300) % 1500)},${1350 + i * 60} h-260" stroke="#fff" stroke-width="5" opacity=".3"/>`;
    return s;
  } },
  // 21 — adesivo em japonês (close no vidro)
  { k: 'adesivo em', z: [1.0, 1.08], c: [540, 860], f: (t, p) => {
    let s = neonCity(t, { seed: 44 });
    s += `<rect x="60" y="400" width="960" height="900" rx="40" fill="#1a2430"/><path d="M60,400 L500,400 L160,1300 L60,1300Z" fill="#fff" opacity=".06"/>`;
    const k = easeOut(seg(p, .15, .35));
    s += g(`<rect x="-360" y="-120" width="720" height="240" rx="20" fill="#f4f4f4"/><text x="0" y="40" font-family="${JP}" font-size="150" font-weight="700" fill="#d8262a" text-anchor="middle">走り屋</text>`, `translate(540,820) rotate(${lerp(-25, -4, k)}) scale(${lerp(1.8, 1, k)})`, `opacity="${seg(p, .1, .2)}" filter="url(#sh)"`);
    s += txt(540, 1060, '"HASHIRIYA" = QUEM VIVE PRA CORRER', 34, '#cfd6de', { w: 800, op: seg(p, .5, .7) });
    return s + vignette();
  } },
  // 22 — abre o porta-luvas (sobre o ombro, câmera inclinada)
  { k: 'aí ele abriu', z: [1.0, 1.1], c: [600, 860], f: (t, p) => {
    let s = `<rect width="${W}" height="${H}" fill="#0d0c0b"/>`;
    s += `<path d="M0,500 L${W},420 L${W},1100 L0,1180Z" fill="#2a2724"/><path d="M0,500 L${W},420 L${W},470 L0,560Z" fill="#3a3632"/>`;
    const open = easeOut(seg(p, .2, .55));
    s += `<rect x="420" y="700" width="460" height="300" fill="#060504"/><rect x="420" y="700" width="460" height="300" fill="#ffd28a" opacity="${open * .35}" filter="url(#b18)"/>`;
    s += `<rect x="470" y="880" width="200" height="110" fill="#d8cfb8" opacity="${open}" transform="rotate(-6,570,935)"/>`;
    s += g(`<rect x="0" y="0" width="460" height="300" rx="16" fill="#35312c" stroke="#1c1a17" stroke-width="6"/><rect x="190" y="30" width="80" height="24" rx="10" fill="#1c1a17"/>`, `translate(420,1000) scale(1,${lerp(-1, .25, open)})`);
    s += g(`<ellipse cx="0" cy="0" rx="260" ry="320" fill="#1a1612"/><path d="M-200,-120 C-160,-300 160,-300 200,-120" fill="#2a1d17"/>` + `<path d="M-260,200 C-260,400 260,400 260,200Z" fill="${LUCAS.top}"/>`, 'translate(130,1500)', 'filter="url(#b18)"');
    return g(s, 'rotate(5,540,960)') + vignette(true);
  } },
  // 23 — a foto saindo do porta-luvas (close extremo, fundo desfocado)
  { k: 'e achou uma', z: [1.0, 1.15], c: [540, 860], f: (t, p) => {
    let s = `<g filter="url(#b30)"><rect width="${W}" height="${H}" fill="#2a2420"/><rect x="200" y="300" width="700" height="500" fill="#4a3a2a"/></g>`;
    const k = easeOut(seg(p, .05, .5));
    s += g(`<rect x="-260" y="-320" width="520" height="640" rx="10" fill="#efe6cf"/><rect x="-230" y="-290" width="460" height="460" fill="#b9a27a"/>` + g(corsa(0, 120, .42, { low: 1, sepia: 1 }) + g(bust({ ...VOVO, x: 0, y: 0, s: .5, eyes: 'dot', mouth: 'smile', brows: 'neutral' }), 'translate(-120,-140)', 'filter="url(#sepia)"'), '', 'opacity=".9"') + `<rect x="-230" y="-290" width="460" height="460" fill="#c89a4a" opacity=".25"/>` + txt(160, 150, "'96", 40, '#ff8a2a', { w: 900 }), `translate(540,${lerp(1200, 820, k)}) rotate(${lerp(12, -3, k)})`, 'filter="url(#sh)"');
    s += hand(lerp(760, 720, k), lerp(1500, 1120, k), 1.5, -20, {});
    return s + vignette();
  } },
  // 24 — a foto: o avô jovem encostado no mesmo Corsa
  { k: 'encostado nesse', z: [1.0, 1.18], c: [540, 820], f: (t, p) => {
    let s = `<rect width="${W}" height="${H}" fill="#1a1612"/>`;
    let ph = `<rect x="-470" y="-620" width="940" height="1180" rx="12" fill="#efe6cf"/><rect x="-430" y="-580" width="860" height="900" fill="#d8c39a"/>`;
    ph += `<rect x="-430" y="-580" width="860" height="520" fill="#e8d6ae"/><rect x="-430" y="-60" width="860" height="380" fill="#a8916a"/>`;
    ph += g(corsa(0, 240, .88, { low: 1 }), '', 'filter="url(#sepia)"');
    ph += g(fullBody({ x: 0, y: 0, s: .8, top: '#e8e2d4', legs: '#3a4a6a', armL: 30, armR: -16, head: { ...VOVO, eyes: 'dot', mouth: 'smile', brows: 'neutral' } }, 0), 'translate(-230,290)', 'filter="url(#sepia)"');
    ph += `<rect x="-430" y="-580" width="860" height="900" fill="#c89a4a" opacity=".22"/>`;
    ph += txt(330, 290, "'96", 50, '#ff8a2a', { w: 900 }) + `<text x="0" y="460" font-family="NU" font-size="54" font-weight="800" fill="#4a3a2a" text-anchor="middle" font-style="italic">eu e o Corsinha</text>`;
    s += g(ph, 'translate(540,900) rotate(-2) scale(.98)', 'filter="url(#sh)"');
    s += dust(8, 30, 0, 0, W, H, t);
    return s + vignette();
  } },
  // 25 — rebaixado! (close no rosto do Lucas)
  { k: 'rebaixado', z: [1.0, 1.16], c: [540, 760], f: (t, p) => {
    let s = garage(t);
    s += g(corsa(540, 1320, 1.0, { dust: 1 }), '', 'filter="url(#b18)"');
    s += bust({ ...LUCAS, x: 540, y: 760, s: 1.6, eyes: 'wide', mouth: 'o', brows: 'up', breath: t });
    s += panel(540, 260, 560, 130, txt(0, 22, 'REBAIXADO', 76, GOLD, { w: 900 }), { s: pop(p, .1), rot: -3 });
    return s + vignette(true);
  } },
  // 26 — duas escolhas (sobre o ombro, girando até o carro)
  { k: 'agora o lucas', z: [1.0, 1.08], c: [540, 960], f: (t, p) => {
    let s = garage(t);
    s += corsa(lerp(620, 540, p), 1260, .95, { dust: 1 });
    s += g(`<path d="M-330,420 C-330,250 -250,190 -120,170 L120,170 C250,190 330,250 330,420 L330,700 L-330,700Z" fill="${LUCAS.top}"/><path d="M-60,120 L60,120 L70,190 L-70,190Z" fill="#a8653e"/><ellipse cx="-118" cy="20" rx="20" ry="30" fill="#b8734a"/><ellipse cx="118" cy="20" rx="20" ry="30" fill="#b8734a"/><ellipse cx="0" cy="0" rx="120" ry="140" fill="#2a1d17"/><path d="M-90,-90 C-40,-120 40,-120 90,-90" stroke="#4a3a30" stroke-width="8" fill="none" opacity=".6"/>`, `translate(${lerp(250, 200, p)},1480)`, 'filter="url(#b5)"');
    s += panel(540, 330, 600, 160, txt(0, 30, '2 ESCOLHAS', 96, GOLD, { w: 900 }), { s: pop(p, .3) });
    return s + vignette();
  } },
  // 27 — tela dividida: vender (em cima) x projeto (embaixo, só esboço)
  { k: 'vender o corsa', z: [1.0, 1.0], c: [540, 960], f: (t, p) => {
    const id = uid('sp');
    let s = `<defs><clipPath id="${id}a"><rect width="${W}" height="950"/></clipPath><clipPath id="${id}b"><rect y="970" width="${W}" height="950"/></clipPath></defs>`;
    s += `<g clip-path="url(#${id}a)">${garage(t)}${g(corsa(540, 820, .9, { dust: 1 }), `translate(${-p * 60},0)`)}${newCar(lerp(1300, 860, easeOut(seg(p, .3, .8))), 860, .36)}${panel(540, 150, 560, 110, txt(0, 22, 'VENDER', 70, '#fff', { w: 900 }), { s: pop(p, .05) })}</g>`;
    s += `<g clip-path="url(#${id}b)" opacity=".55">${lab(t, { c1: '#0c2a4a', c2: '#06182c', glow: '#3aa0ff' })}${g(corsa(540, 1700, .9, { low: 1, jdm: 1 }), '', 'filter="url(#gray)" opacity=".5"')}</g>`;
    s += `<rect y="950" width="${W}" height="20" fill="${GOLD}"/>`;
    return s;
  } },
  { k: 'ou transformar o', z: [1.0, 1.0], c: [540, 960], f: (t, p) => {
    const id = uid('sp');
    let s = `<defs><clipPath id="${id}a"><rect width="${W}" height="950"/></clipPath><clipPath id="${id}b"><rect y="970" width="${W}" height="950"/></clipPath><clipPath id="${id}c"><rect x="0" y="970" width="${W * easeInOut(seg(p, .15, .85))}" height="950"/></clipPath></defs>`;
    s += `<g clip-path="url(#${id}a)" opacity=".5">${garage(t)}${corsa(540, 820, .9, { dust: 1 })}</g>`;
    s += `<g clip-path="url(#${id}b)">${lab(t, { c1: '#0c2a4a', c2: '#06182c', glow: '#3aa0ff' })}`;
    for (let i = 0; i < 12; i++) s += `<path d="M0,${1000 + i * 80} H${W} M${i * 100},970 V${H}" stroke="#7ac0ff" stroke-width="1.5" opacity=".2"/>`;
    s += g(corsa(540, 1700, .9, { low: 1, jdm: 1, col: '#0c2a4a' }), '', 'opacity=".6" filter="url(#gray)"') + `<path d="${BODY}" transform="translate(540,1700) scale(.9) translate(0,34)" fill="none" stroke="#bfe2ff" stroke-width="4" stroke-dasharray="14 10"/>`;
    s += `<g clip-path="url(#${id}c)">${g(corsa(540, 1700, .9, { low: 1, jdm: 1, spin: t * 60 }), '')}</g>`;
    s += panel(540, 1100, 760, 110, txt(0, 22, 'JDM BRASILEIRO', 70, GOLD, { w: 900 }), { s: pop(p, .5) }) + `</g>`;
    s += `<rect y="950" width="${W}" height="20" fill="${GOLD}"/>`;
    return s;
  } },
  // 28 — Lucas com a chave, olhando para a câmera
  { k: 'se fosse você', z: [1.0, 1.12], c: [540, 760], f: (t, p) => {
    let s = garage(t);
    s += g(corsa(540, 1320, 1.0, { dust: 1 }), '', 'filter="url(#b18)"');
    s += bust({ ...LUCAS, x: 540, y: 780, s: 1.5, eyes: 'dot', mouth: 'flat', brows: 'serious', breath: t });
    s += g(hand(0, 0, 1.2, 0, {}) + keyIcon(-10, -200, 1.2, -70 + Math.sin(t * 3) * 6), 'translate(820,1180)');
    return s + vignette(true);
  } },
  // 29 — opção A
  { k: 'a vende e', z: [1.0, 1.05], c: [540, 860], f: (t, p) => {
    let s = lab(t, { glow: '#ffc928' });
    s += abCard(540, 760, pop(p, .02), 'A', 'VENDE', 'E PEGA OUTRO', g(newCar(0, 170, .42), ''), GOLD);
    return s;
  } },
  // 30 — opção B
  { k: 'ou b fica', z: [1.0, 1.05], c: [540, 860], f: (t, p) => {
    let s = lab(t, { glow: '#c04dff' });
    s += abCard(540, 760, pop(p, .02), 'B', 'FICA', 'E FAZ O PROJETO', g(corsa(0, 180, .42, { jdm: 1, low: 1 }), ''), '#c04dff');
    return s;
  } },
  // 31 — COMENTA AÍ
  { k: 'comenta aí', z: [1.0, 1.04], c: [540, 860], f: (t, p) => {
    let s = lab(t, { glow: '#ff7a2a' });
    s += txt(540, 300, 'COMENTA AÍ', 130, '#fff', { w: 900, extra: `stroke="#000" stroke-width="14" paint-order="stroke" transform="translate(540,300) scale(${pop(p, .02) * (1 + .03 * Math.sin(t * 6))}) translate(-540,-300)"` });
    s += abCard(540, 600, .78, 'A', 'VENDE', 'E PEGA OUTRO', g(newCar(0, 170, .42), ''), GOLD);
    s += abCard(540, 1000, .78, 'B', 'FICA', 'E FAZ O PROJETO', g(corsa(0, 180, .42, { jdm: 1, low: 1 }), ''), '#c04dff');
    s += txt(540, 1500, 'A ESCOLHA DECIDE A PARTE 2', 46, GOLD, { w: 900, op: seg(p, .3, .5), ls: 3 });
    return s;
  } },
];
const easeInOut = ease;
