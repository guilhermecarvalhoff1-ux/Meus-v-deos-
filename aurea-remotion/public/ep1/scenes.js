// ÁUREA — EPISÓDIO 1
const CAIO = { hair: 'short', hairCol: '#1f1a17', top: '#c99a2e', outfit: 'hoodie' };
const HUNTER = { hair: 'hood', hairCol: '#3f6a3a', top: '#6b4a32', outfit: 'hoodie' };
const GOLD = '#ffc928';
const PART_OLD = { words: 'words3.json', end: 74.6, abTime: 9999,
  merges: [
    [['dezenove','anos'], '19 ANOS'],
    [['trinta','e','sete','reais'], 'R$ 37'],
    [['oito','mil','reais'], 'R$ 8 MIL'],
    [['duzentos','e','catorze','jogos'], '214 JOGOS'],
    [['cem','por','cento'], '100%'],
    [['nível','um'], 'NÍVEL 1'],
    [['mais','oitenta','centavos'], '+R$ 0,80'],
    [['trinta','dias'], '30 DIAS'],
    [['nove','mil','e','quatrocentos','reais'], 'R$ 9.400'],
    [['dia','trinta','e','um'], 'DIA 31'],
    [['nível','quarenta'], 'NÍVEL 40'],
    [['parte','dois'], 'PARTE 2'],
  ],
  hl: ['2049','dinheiro','verdade','pix','caio','mãe','hospital','capacete','visor','sincronizando','classe','mago','guerreiro','paladino','caçador','nada','madeira','gosma','desvia','bate','estoura','adaga','ferro','paga','para','lobo','cinzento','ataca','recua','perder','levanta','nome','jogador','dele','segue','monstro']
};

// ---------- cenário do jogo ----------
function gameMeadow(t, opts = {}) {
  const dusk = opts.dusk;
  let s = `<defs>${linGrad('gsky', dusk ? [[0, '#3a2a5a'], [.5, '#c46a5a'], [1, '#f2b47a']] : [[0, '#6fb4e6'], [1, '#d9eeff']])}${linGrad('ggr', dusk ? [[0, '#4a6a3a'], [1, '#2a3a22']] : [[0, '#8fd45a'], [1, '#4fa83a']])}</defs>`;
  s += `<rect width="${W}" height="${H}" fill="url(#gsky)"/>`;
  if (!dusk) { const r = rng(5); for (let i = 0; i < 5; i++) { const cx = ((r() * W + t * 12) % (W + 300)) - 150, cy = 200 + r() * 400; s += `<g opacity=".9"><ellipse cx="${cx}" cy="${cy}" rx="110" ry="40" fill="#fff"/><ellipse cx="${cx - 50}" cy="${cy - 20}" rx="60" ry="40" fill="#fff"/><ellipse cx="${cx + 40}" cy="${cy - 26}" rx="70" ry="46" fill="#fff"/></g>`; } }
  else s += `<circle cx="760" cy="760" r="120" fill="#ffd28a" opacity=".9" filter="url(#glow2)"/>`;
  s += `<g filter="url(#b5)"><path d="M-60,1000 L180,620 L330,820 L520,560 L760,880 L940,660 L1160,1000Z" fill="${dusk ? '#5a4a6a' : '#9db4cc'}"/><path d="M440,640 L520,560 L600,660 L560,650 L520,620Z" fill="#f4f8fb" opacity="${dusk ? .4 : .95}"/></g>`;
  s += `<g filter="url(#b5)">`;
  const r = rng(9);
  for (let i = 0; i < 9; i++) { const x = r() * W, y = 960 + r() * 60, rr = 50 + r() * 50; s += `<rect x="${x - 8}" y="${y}" width="16" height="70" fill="#6b4a32"/><circle cx="${x}" cy="${y - rr * .4}" r="${rr}" fill="${dusk ? '#3a5a32' : (r() < .5 ? '#5aa83a' : '#4a9a34')}"/>`; }
  s += `</g><rect y="1000" width="${W}" height="${H}" fill="url(#ggr)"/>`;
  s += grass(t, 1940, 90, opts.seed || 3, dusk ? '#3f5f33' : '#6cc04a', dusk ? '#33502a' : '#58ad3c', 260, '');
  if (!dusk) { const r2 = rng(13); for (let i = 0; i < 26; i++) s += `<circle cx="${r2() * W}" cy="${1100 + r2() * 760}" r="${5 + r2() * 5}" fill="${['#fff', '#ffe46a', '#ff9ac0'][i % 3]}"/>`; }
  return s;
}
function slime(x, y, s, t, opts = {}) {
  const sq = 1 + .06 * Math.sin(t * 6), jump = opts.jump || 0;
  let b = `<ellipse cx="0" cy="${4 + jump * 0}" rx="${110}" ry="18" fill="#000" opacity=".2"/>`;
  b += g(`<path d="M-110,0 C-120,-80 -60,-160 0,-160 C60,-160 120,-80 110,0Z" fill="#7be08a" opacity=".92"/><path d="M-70,-110 C-50,-140 -10,-150 20,-146" stroke="#d8ffe0" stroke-width="14" fill="none" stroke-linecap="round" opacity=".8"/><circle cx="-34" cy="-70" r="11" fill="#1c3a22"/><circle cx="34" cy="-70" r="11" fill="#1c3a22"/><path d="M-14,-40 q14,10 28,0" stroke="#1c3a22" stroke-width="6" fill="none" stroke-linecap="round"/>`, `translate(0,${-jump * 160}) scale(${1 / sq},${sq})`);
  if (opts.hp != null) b += g(`<rect x="-120" y="-60" width="240" height="70" rx="14" fill="#0b1a12" opacity=".75"/>` + txt(0, -20, 'GOSMA · NV 1', 26, '#d8ffe0', { fam: 'NU' }) + `<rect x="-100" y="-6" width="200" height="12" rx="6" fill="#33443a"/><rect x="-100" y="-6" width="${200 * opts.hp}" height="12" rx="6" fill="#ff5d5d"/>`, 'translate(0,-230)');
  return g(b, `translate(${x},${y}) scale(${s})`);
}
function wolf(x, y, s, t, opts = {}) {
  const bow = opts.bow || 0;
  let w = `<ellipse cx="0" cy="10" rx="260" ry="26" fill="#000" opacity=".25"/>`;
  w += `<path d="M180,-170 C280,-200 330,-260 360,-330" stroke="#6f7680" stroke-width="40" fill="none" stroke-linecap="round"/>`;
  for (const [lx, d] of [[-150, 0], [-90, 1], [110, 0], [170, 1]]) w += `<rect x="${lx - 18}" y="-140" width="40" height="150" rx="18" fill="${d ? '#5d646d' : '#767e88'}"/>`;
  w += `<ellipse cx="20" cy="-190" rx="230" ry="110" fill="#7c848e"/><ellipse cx="20" cy="-150" rx="190" ry="60" fill="#a9b0b8" opacity=".5"/>`;
  w += g(`<path d="M-60,-40 L-30,-150 L10,-60Z" fill="#6a717a"/><path d="M20,-50 L60,-150 L80,-50Z" fill="#6a717a"/><ellipse cx="0" cy="0" rx="100" ry="80" fill="#858d97"/><path d="M-90,10 L-210,50 L-200,80 L-80,70Z" fill="#9aa1aa"/><circle cx="-206" cy="62" r="16" fill="#222"/><circle cx="-30" cy="-10" r="10" fill="${opts.eye || '#ffd24a'}"/><path d="M-50,-28 l30,6" stroke="#3a3f45" stroke-width="6" stroke-linecap="round"/>`, `translate(-190,${-240 + bow * 150}) rotate(${-bow * 25})`);
  if (opts.tag) w += g(`<rect x="-260" y="-56" width="520" height="112" rx="18" fill="#0b0d10" opacity=".8" stroke="${opts.tagCol || '#ff5d5d'}" stroke-width="4"/>` + txt(0, -8, opts.tag, opts.tagSize || 40, opts.tagCol || '#ff5d5d', { ls: 2 }) + `<rect x="-200" y="18" width="400" height="14" rx="7" fill="#33373c"/><rect x="-200" y="18" width="${400 * (opts.hp ?? 1)}" height="14" rx="7" fill="#ff5d5d"/>`, 'translate(-20,-560)');
  return g(w, `translate(${x},${y}) scale(${s})`);
}
// corpo inteiro (avatar), pés em (0,0)
function fullBody(o, t = 0) {
  const sk = SK, top = o.top || '#6b4a32', legs = o.legs || '#3a3a2e';
  const step = o.walk ? Math.sin(t * 8) * 14 : 0;
  let b = `<ellipse cx="0" cy="0" rx="110" ry="18" fill="#000" opacity=".22"/>`;
  b += `<rect x="-58" y="-300" width="48" height="300" rx="22" fill="${legs}" transform="rotate(${step},-34,-300)"/><rect x="10" y="-300" width="48" height="300" rx="22" fill="${legs}" transform="rotate(${-step},34,-300)"/>`;
  b += `<rect x="-64" y="-20" width="60" height="28" rx="12" fill="#2a2018"/><rect x="4" y="-20" width="60" height="28" rx="12" fill="#2a2018"/>`;
  b += `<path d="M-90,-300 L-80,-520 C-60,-560 60,-560 80,-520 L90,-300Z" fill="${top}"/><rect x="-92" y="-330" width="184" height="26" fill="#2a2018"/><rect x="-14" y="-334" width="28" height="34" fill="#c9a24a"/>`;
  const aL = o.armL ?? 10, aR = o.armR ?? -10;
  b += g(`<rect x="-22" y="0" width="44" height="230" rx="20" fill="${top}"/><circle cx="0" cy="240" r="28" fill="${sk}"/>`, `translate(-96,-520) rotate(${aL})`);
  b += g(`<rect x="-22" y="0" width="44" height="230" rx="20" fill="${top}"/><circle cx="0" cy="240" r="28" fill="${sk}"/>` + (o.item || ''), `translate(96,-520) rotate(${aR})`);
  b += g(headG({ ...HUNTER, ...o.head }), 'translate(0,-640) scale(.95)');
  return g(b, `translate(${o.x},${o.y}) scale(${o.s || 1}) ${o.flip ? 'scale(-1,1)' : ''}`);
}
const STICK = `<rect x="-10" y="150" width="20" height="330" rx="8" fill="#9a6a3a" transform="rotate(-20,0,240)"/>`;
const DAGGER = `<g transform="translate(0,250) rotate(180)"><rect x="-10" y="-20" width="20" height="60" rx="6" fill="#4a3424"/><rect x="-40" y="34" width="80" height="16" rx="6" fill="#9aa3ac"/><path d="M-16,50 L16,50 L0,230Z" fill="#dfe6ec"/></g>`;
function coin(x, y, s, rot = 0) { return g(`<circle r="50" fill="#e0a51a"/><circle r="42" fill="${GOLD}"/>` + txt(0, 14, 'R$', 36, '#9a6a0a', { w: 900 }), `translate(${x},${y}) rotate(${rot}) scale(${s})`, 'filter="url(#shs)"'); }
function popup(x, y, text, op = 1, size = 90, col = GOLD) { return txt(x, y, text, size, col, { w: 900, op, extra: 'stroke="#3a2a00" stroke-width="10" paint-order="stroke" filter="url(#glow)"' }); }
function room(t) {
  let s = `<defs>${linGrad('rm', [[0, '#1c2430'], [1, '#2a3340']])}</defs><rect width="${W}" height="${H}" fill="url(#rm)"/>`;
  s += `<rect x="640" y="240" width="320" height="380" fill="#3a4a5a"/><rect x="660" y="260" width="280" height="340" fill="#6a8aa8" opacity=".5"/>`;
  s += `<g filter="url(#b10)"><rect x="80" y="300" width="380" height="620" fill="#2a2f38"/>`;
  for (let i = 0; i < 4; i++) for (let k = 0; k < 7; k++) s += `<rect x="${100 + k * 50}" y="${330 + i * 150}" width="40" height="110" fill="${['#c94a3a', '#3a7ac9', '#3aa860', '#c9a23a', '#8a4ac9'][(i + k) % 5]}"/>`;
  s += `</g><rect x="0" y="1400" width="${W}" height="600" fill="#151a21"/>`;
  return s;
}
function bill(x, y, s, paid = 0) {
  let b = `<rect x="-260" y="-360" width="520" height="720" fill="#f6f4ef" filter="url(#sh)"/>` + txt(0, -270, 'HOSPITAL SÃO LUCAS', 34, '#3a4a5a', { ls: 2 }) + `<path d="M-200,-230 H200" stroke="#c9d3d9" stroke-width="4"/>`;
  for (let i = 0; i < 6; i++) b += `<rect x="-200" y="${-190 + i * 54}" width="${220 + (i * 37) % 120}" height="16" rx="8" fill="#d6dde2"/>`;
  b += txt(-200, 200, 'TOTAL DEVIDO', 34, '#6b7a84', { a: 'start' }) + txt(0, 290, 'R$ 8.000,00', 92, '#c22', { w: 900 });
  if (paid > 0) b += g(`<rect x="-220" y="-70" width="440" height="140" rx="14" fill="none" stroke="#2a9a50" stroke-width="14"/>` + txt(0, 40, 'PAGO', 120, '#2a9a50', { w: 900, ls: 10 }), `rotate(-14) scale(${lerp(2.2, 1, easeOut(paid))})`, `opacity="${Math.min(1, paid * 3) * .9}"`);
  return g(b, `translate(${x},${y}) scale(${s})`);
}
function classCard(x, y, s, name, col, icon, opts = {}) {
  const inner = `<rect x="-200" y="-300" width="400" height="430" rx="16" fill="${col}" opacity=".85"/>` + icon + txt(0, 220, name, 70, '#ffffff', { ls: 6 });
  return card(x, y, 460, 640, inner, { s, tilt: opts.tilt || 0, shine: opts.shine, border: opts.border || '#ffffff', bg: '#ffffff', op: .18 });
}
const ICON_MAGE = `<path d="M-60,40 L0,-200 L60,40Z" fill="#5a3aa8"/><circle cy="60" r="70" fill="${SK}"/><path d="M-120,40 H120" stroke="#5a3aa8" stroke-width="18"/><circle cx="120" cy="-140" r="26" fill="#bfa8ff" filter="url(#glow)"/>`;
const ICON_WAR = `<rect x="-90" y="-60" width="180" height="200" rx="40" fill="#8a3a2a"/><circle cy="-110" r="64" fill="${SK}"/><path d="M-70,-150 a70,60 0 0 1 140,0z" fill="#9aa3ac"/><rect x="100" y="-230" width="20" height="300" fill="#dfe6ec"/>`;
const ICON_PAL = `<rect x="-90" y="-60" width="180" height="200" rx="40" fill="#e9eef2"/><circle cy="-110" r="64" fill="${SK}"/><path d="M-60,-40 h120 v90 q-60,60 -120,0z" fill="#e0b44c"/><path d="M0,-30 v70 M-30,0 h60" stroke="#c22" stroke-width="12"/>`;
const ICON_HUN = `<rect x="-90" y="-60" width="180" height="200" rx="40" fill="#6b4a32"/><path d="M-90,-100 C-90,-230 90,-230 90,-100 L80,-40 L-80,-40Z" fill="#3f6a3a"/><circle cy="-100" r="56" fill="${SK}"/><circle cx="-18" cy="-100" r="6" fill="#222"/><circle cx="18" cy="-100" r="6" fill="#222"/><path d="M130,-200 q-60,120 0,240" stroke="#9a6a3a" stroke-width="12" fill="none"/><path d="M130,-200 V40" stroke="#ddd" stroke-width="3"/>`;

const SCENES_OLD = [
  // 01 2049, jogo paga em dinheiro
  { k: 'em 2049', z: [1.1, 1.0], c: [540, 800], f: (t, p) => { let s = cityBG(t, { tower: false }); s += g(`<rect x="-330" y="-330" width="660" height="660" rx="60" fill="#0f2a33" opacity=".9" stroke="${GOLD}" stroke-width="6"/>` + txt(0, -60, 'ÁUREA', 140, GOLD, { w: 900, ls: 10, extra: 'filter="url(#glow)"' }) + txt(0, 40, 'ONLINE', 50, '#e9fbff', { ls: 16 }) + coin(0, 180, 1.4, Math.sin(t * 3) * 20), 'translate(540,820)'); s += g(`<rect x="-120" y="-44" width="240" height="88" rx="14" fill="#0f2a33" stroke="${GOLD}" stroke-width="3"/>` + txt(0, 20, '2049', 60, '#ffffff'), 'translate(540,1580)'); return s + vignette(); } },
  // 02 cada monstro vira PIX
  { k: 'cada monstro', z: [1.0, 1.06], f: (t, p) => { let s = gameMeadow(t); const pp = seg(p, .25, .4); if (pp < 1) s += slime(540, 1500, 1.6, t, {}).replace('<g transform', `<g opacity="${1 - pp}" transform`); const r = rng(2); for (let i = 0; i < 14; i++) { const a = r() * 6.28, d = easeOut(seg(p, .3, .9)) * (200 + r() * 260); if (p > .3) s += coin(540 + Math.cos(a) * d, 1300 + Math.sin(a) * d * .6 - easeOut(seg(p, .3, .9)) * 200, .9, t * 200 * r()); } s += g(`<rect x="-300" y="-70" width="600" height="140" rx="30" fill="#0b1a12" opacity=".85"/><circle cx="-230" r="40" fill="#32bcad"/>` + txt(-230, 14, 'PIX', 30, '#fff') + txt(30, -6, 'PIX RECEBIDO', 34, '#9fe3d0', { a: 'middle' }) + txt(30, 46, '+ R$ 0,80', 50, '#ffffff'), `translate(540,${lerp(-120, 300, easeOut(seg(p, .4, .6)))})`); return s + gameFG(t) + vignette(); } },
  // 03 Caio 19 anos R$37
  { k: 'caio tem', z: [1.0, 1.08], c: [540, 900], f: (t, p) => room(t) + bust({ x: 400, y: 1200, s: 1.7, ...CAIO, eyes: 'dot', mouth: 'flat', brows: 'serious', blink: (t % 3) < .12 , breath: t }) + phone(820, 1300, 1.2, 8, `<rect x="-106" y="-212" width="212" height="424" rx="26" fill="#0f1a14"/>` + txt(0, -110, 'SALDO', 30, '#8fd8b0', { ls: 3 }) + txt(0, -40, 'R$ 37,00', 54, '#ffffff', { w: 900 })) + hand(840, 1500, 1, 8, { sleeve: CAIO.top, fist: true }) + vignette() },
  // 04 Mãe deve 8 mil
  { k: 'a mãe dele', z: [1.0, 1.08], f: (t, p) => `<rect width="${W}" height="${H}" fill="#3a3330"/><ellipse cx="540" cy="900" rx="500" ry="700" fill="#6a5a50" opacity=".5" filter="url(#b60)"/>` + bill(540, 700, 1.15, 0) + vignette() },
  // 05 214 jogos 100%
  { k: 'ele já zerou', z: [1.08, 1.0], f: (t, p) => { let s = `<rect width="${W}" height="${H}" fill="#1c2430"/>`; const r = rng(214); for (let row = 0; row < 7; row++) { s += `<rect x="60" y="${300 + row * 200 + 150}" width="960" height="16" fill="#4a3a2a"/>`; for (let k = 0; k < 14; k++) s += `<rect x="${70 + k * 68}" y="${300 + row * 200 + 20 + r() * 20}" width="58" height="${130 - r() * 20}" rx="4" fill="${['#c94a3a', '#3a7ac9', '#3aa860', '#c9a23a', '#8a4ac9', '#2a2f38'][Math.floor(r() * 6)]}"/>`; } s += `<rect width="${W}" height="${H}" fill="#000" opacity=".35"/>`; s += g(`<rect x="-280" y="-150" width="560" height="300" rx="30" fill="#0f2a33" stroke="${GOLD}" stroke-width="6"/>` + `<path d="M-200,-80 h60 v40 q0,50 -30,60 v30 h20 v20 h-60 v-20 h20 v-30 q-30,-10 -30,-60z" fill="${GOLD}"/>` + txt(60, -20, '214', 110, '#ffffff', { w: 900 }) + txt(60, 80, '100% EM TODOS', 40, GOLD, { ls: 2 }), `translate(540,${lerp(1000, 900, easeOut(p))})`); return s + vignette(); } },
  // 06 comprou o capacete
  { k: 'então ele comprou', z: [1.0, 1.1], c: [540, 1000], f: (t, p) => { let s = room(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".3"/>`; s += `<path d="M180,1200 L900,1200 L860,1700 L220,1700Z" fill="#2a2f38" filter="url(#sh)"/>` + txt(540, 1500, 'ÁUREA', 80, GOLD, { ls: 10 }); s += g(`<path d="M-460,0 L360,0 L380,-60 L-440,-60Z" fill="#3a404a"/>`, `translate(540,${1180 - 40 * easeOut(p)}) rotate(${-25 * easeOut(p)})`); s += g(helmet(1).replace(/#5fd0ff/g, GOLD).replace(/#0e2733/g, '#2a1e05'), `translate(540,${lerp(1200, 900, easeOut(seg(p, .2, .8)))}) scale(1.7)`); s += `<ellipse cx="540" cy="900" rx="360" ry="300" fill="${GOLD}" opacity="${.2 * seg(p, .3, .8)}" filter="url(#b60)"/>`; return s + vignette(); } },
  // 07 ele deita (close: mãos colocando o capacete)
  { k: 'ele deita', z: [1.0, 1.1], c: [540, 900], f: (t, p) => { const dp = easeOut(seg(p, 0, .7)); let s = room(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".25"/>`; s += bust({ x: 540, y: 1250, s: 2.6, ...CAIO, eyes: 'closed', mouth: 'flat', breath: t }); s += g(helmet(.3 + .7 * dp, '').replace(/#5fd0ff/g, GOLD).replace(/#0e2733/g, '#2a1e05'), `translate(540,${lerp(560, 860, dp)}) scale(2.0)`); s += hand(170, lerp(980, 1120, dp), 1.5, 25, { sleeve: CAIO.top }) + hand(910, lerp(980, 1120, dp), 1.5, -25, { sleeve: CAIO.top }); return s + vignette(true); } },
  // 08 O visor acende: sincronizando
  { k: 'o visor acende', z: [1.0, 1.05], f: (t, p) => { const lp = easeOut(seg(p, 0, .3)); let s = `<rect width="${W}" height="${H}" fill="#000"/><rect x="${540 - 540 * lp}" y="958" width="${1080 * lp}" height="4" fill="#fff" filter="url(#glow)"/><ellipse cx="540" cy="960" rx="${200 * lp}" ry="20" fill="#fff" opacity=".5" filter="url(#b18)"/>`; if (p > .35) { s += `<circle cx="540" cy="560" r="90" fill="none" stroke="#333" stroke-width="14"/><circle cx="540" cy="560" r="90" fill="none" stroke="${GOLD}" stroke-width="14" stroke-dasharray="${seg(p, .35, 1) * 565} 600" transform="rotate(-90,540,560)"/>`; s += txt(540, 760, 'SINCRONIZANDO' + '.'.repeat(1 + Math.floor(t * 3) % 3), 54, '#e9fbff', { ls: 6, op: seg(p, .35, .5) }); } return s; } },
  // 09 lê como você pensa
  { k: 'o jogo lê', z: [1.0, 1.08], c: [600, 860], f: (t, p) => { let s = brainViz(t).replace(/#f08ccd/g, GOLD).replace(/#f3a6d6/g, GOLD); const sy = 500 + ((t * 300) % 700); s += `<rect x="150" y="${sy}" width="880" height="8" fill="${GOLD}" opacity=".8" filter="url(#glow)"/>`; s += g(`<rect x="-240" y="-46" width="480" height="92" rx="16" fill="#05090c" opacity=".85" stroke="${GOLD}" stroke-width="3"/>` + txt(0, 18, `PERFIL: ${Math.floor(seg(p, 0, .9) * 100)}%`, 50, GOLD, { ls: 3 }), 'translate(540,260)'); return s + vignette(); } },
  // 10 Mago Guerreiro Paladino
  { k: 'mago guerreiro', z: [1.0, 1.0], f: (t, p) => { let s = gameMeadow(t) + `<rect width="${W}" height="${H}" fill="#fff" opacity=".2" filter="url(#b10)"/>`; const cards = [['MAGO', '#3a2a6a', ICON_MAGE], ['GUERREIRO', '#5a2a22', ICON_WAR], ['PALADINO', '#6a5a2a', ICON_PAL]]; const idx = Math.min(2, Math.floor(p * 3)); const lp = (p * 3) % 1; cards.forEach((c, i) => { const off = (i - idx - easeOut(lp) * 0) * 520; s += classCard(540 + off, 820, i === idx ? 1.05 : .8, c[0], c[1], c[2], { tilt: (i - idx) * 6, shine: i === idx ? lp : null }); }); return s + gameFG(t) + vignette(); } },
  // 11 Caçador
  { k: 'caio recebe', z: [1.0, 1.08], f: (t, p) => { let s = gameMeadow(t) + `<rect width="${W}" height="${H}" fill="#fff" opacity=".2"/>`; const rev = easeOut(seg(p, .35, .55)); s += g(classCard(0, 0, 1, rev > .5 ? 'CAÇADOR' : '???', rev > .5 ? '#2a4a22' : '#333', rev > .5 ? ICON_HUN : txt(0, 40, '?', 260, '#fff')), `translate(540,820) scale(${Math.abs(Math.cos(rev * Math.PI)) * 1.15 + .001},1.15)`); if (rev > .5) s += `<circle cx="540" cy="820" r="${200 + 300 * seg(p, .55, .8)}" fill="none" stroke="${GOLD}" stroke-width="10" opacity="${1 - seg(p, .55, .8)}"/>`; return s + gameFG(t) + vignette(); } },
  // 12 Começa sem nada
  { k: 'começa sem', z: [1.0, 1.08], c: [540, 1100], f: (t, p) => gameMeadow(t) + fullBody({ x: 540, y: 1680, s: 1.6, top: '#8a7a62', legs: '#5a5040', armL: 6, armR: -6, head: { eyes: 'dot', mouth: 'flat', brows: 'neutral', blink: (t % 2.6) < .12 } }) + g(`<rect x="-230" y="-50" width="460" height="100" rx="16" fill="#0b1a12" opacity=".8"/>` + txt(0, 18, 'NÍVEL 1 · CAÇADOR', 44, '#d8ffe0', { ls: 2 }), 'translate(540,260)') + gameFG(t) + vignette() },
  // 13 vara de madeira
  { k: 'só uma vara', z: [1.0, 1.1], c: [540, 900], f: (t, p) => `<g filter="url(#b10)">${gameMeadow(t)}</g>` + g(`<rect x="-30" y="-700" width="60" height="1100" rx="24" fill="#9a6a3a"/><path d="M-30,-400 l-40,-40" stroke="#7a4a2a" stroke-width="16" stroke-linecap="round"/>`, 'translate(560,1000) rotate(25)') + hand(500, 1300, 1.8, 20, { fist: true, sleeve: '#8a7a62' }) + vignette() },
  // 14 Primeiro monstro gosma
  { k: 'primeiro monstro', z: [1.0, 1.1], c: [540, 1300], f: (t, p) => gameMeadow(t) + slime(540, 1550, 1.7, t, { hp: 1, jump: Math.max(0, Math.sin(t * 4)) * .2 }) + gameFG(t) + vignette() },
  // 15 desvia, bate
  { k: 'ele desvia', z: [1.05, 1.05], c: [540, 1200], f: (t, p) => { const ph = p * 3; const dodge = Math.sin(Math.min(1, ph % 1) * Math.PI); const hit = Math.floor(ph) === 1; let s = gameMeadow(t, { seed: 4 }); s += slime(720, 1640, 1.2, t, { hp: lerp(1, .35, seg(p, .3, .7)), jump: Math.floor(ph) !== 1 ? dodge * .8 : 0 }); s += fullBody({ x: hit ? 480 : 340 - dodge * 80, y: 1700, s: 1.1, top: '#8a7a62', legs: '#5a5040', armR: hit ? -110 + 90 * (ph % 1) : -30, armL: 20, item: STICK, head: { eyes: hit ? 'dot' : 'wide', mouth: hit ? 'open' : 'flat', brows: 'serious' } }, t); if (hit && ph % 1 > .4) s += `<circle cx="700" cy="1500" r="${80 + 140 * (ph % 1)}" fill="#fff" opacity="${(1 - ph % 1) * .8}"/>` + popup(780, 1300, '-12', 1 - (ph % 1) * .5, 80, '#ff5d5d'); return s + gameFG(t) + vignette(); } },
  // 16 Gosma estoura +0,80
  { k: 'a gosma estoura', z: [1.0, 1.08], c: [540, 1300], f: (t, p) => { let s = gameMeadow(t); const bp = seg(p, 0, .2); if (bp < 1) s += slime(540, 1600, 1.6 * (1 + bp * .4), t).replace('<g transform', `<g opacity="${1 - bp}" transform`); const r = rng(16); for (let i = 0; i < 30; i++) { const a = r() * 6.28, d = easeOut(seg(p, .05, .6)) * (100 + r() * 400); s += `<circle cx="${540 + Math.cos(a) * d}" cy="${1450 + Math.sin(a) * d}" r="${10 + r() * 20}" fill="#7be08a" opacity="${1 - seg(p, .3, .8)}"/>`; } s += popup(540, lerp(1300, 1000, easeOut(seg(p, .15, .6))), '+R$ 0,80', seg(p, .15, .3), 130); return s + gameFG(t) + vignette(); } },
  // 17 Adaga de ferro
  { k: 'e deixa cair', z: [1.0, 1.08], c: [540, 900], f: (t, p) => `<g filter="url(#b10)">${gameMeadow(t)}</g>` + g(`<rect x="-26" y="-60" width="52" height="170" rx="14" fill="#4a3424"/><rect x="-110" y="100" width="220" height="40" rx="14" fill="#9aa3ac"/><path d="M-44,140 L44,140 L0,760Z" fill="#e6edf2"/><path d="M0,140 L44,140 L0,760Z" fill="#c4cdd4"/><circle cy="-70" r="30" fill="#9aa3ac"/>`, `translate(560,${lerp(500, 760, easeOut(seg(p, 0, .4)))}) rotate(${180 + 20})`) + hand(540, lerp(1700, 1450, easeOut(seg(p, 0, .4))), 1.7, 10, { fist: true, sleeve: '#8a7a62' }) + g(`<rect x="-260" y="-56" width="520" height="112" rx="18" fill="#0b1a12" opacity=".85" stroke="#9aa3ac" stroke-width="4"/>` + txt(0, 20, 'ADAGA DE FERRO', 50, '#e9fbff', { ls: 3 }), 'translate(540,260)', `opacity="${seg(p, .3, .5)}"`) + vignette() },
  // 18 30 dias depois R$9.400
  { k: 'trinta dias', z: [1.0, 1.06], f: (t, p) => { const v = Math.floor(lerp(0, 9400, easeOut(seg(p, .1, .85)))); return room(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".45"/>` + phone(540, 860, 2.4, 0, `<rect x="-106" y="-212" width="212" height="424" rx="26" fill="#0f1a14"/>` + txt(0, -110, 'SALDO', 22, '#8fd8b0', { ls: 3 }) + txt(0, -60, `R$ ${v.toLocaleString('pt-BR')},00`, 34, '#ffffff', { w: 900 }) + `<path d="M-80,120 L-40,80 L0,96 L40,30 L80,-10" stroke="#5fe08a" stroke-width="6" fill="none"/>`) + g(`<rect x="-230" y="-50" width="460" height="100" rx="16" fill="#0b1a12" opacity=".85"/>` + txt(0, 20, '30 DIAS DEPOIS', 50, '#ffffff', { ls: 3 }), 'translate(540,230)') + vignette(); } },
  // 19 Dívida paga
  { k: 'a dívida está', z: [1.0, 1.06], f: (t, p) => `<rect width="${W}" height="${H}" fill="#3a3330"/><ellipse cx="540" cy="900" rx="500" ry="700" fill="#6a5a50" opacity=".5" filter="url(#b60)"/>` + g(bill(0, 0, 1, seg(p, .1, .35)), `translate(${540 + (p > .1 && p < .38 ? Math.sin(t * 80) * 4 : 0)},700) scale(1.15)`) + vignette() },
  // 20 Mas ele não para
  { k: 'mas ele não', z: [1.0, 1.1], c: [540, 1200], f: (t, p) => { let s = gameMeadow(t, { seed: 7 }); for (let i = 0; i < 4; i++) s += slime(160 + i * 260, 1720 - (i % 2) * 80, .7, t + i); s += fullBody({ x: 540, y: 1500, s: 1.3, top: '#4a6a3a', legs: '#3a3a2e', armR: -100 + 40 * Math.sin(t * 8), item: DAGGER, head: { eyes: 'dot', mouth: 'flat', brows: 'serious' } }, t); s += popup(300, 900 - (t * 200) % 200, '+R$ 0,80', .9, 70) + popup(800, 1000 - (t * 160) % 200, '+R$ 2,10', .9, 70); s += g(`<rect x="-200" y="-50" width="400" height="100" rx="16" fill="#0b1a12" opacity=".8"/>` + txt(0, 20, `NÍVEL ${Math.floor(lerp(23, 38, p))}`, 56, GOLD, { ls: 3 }), 'translate(540,230)'); return s + gameFG(t) + vignette(); } },
  // 21 Dia 31, lobo cinzento nível 40
  { k: 'no dia trinta', z: [1.08, 1.0], c: [540, 1300], f: (t, p) => gameMeadow(t, { dusk: true }) + wolf(620, 1640, 1.2, t, { tag: 'LOBO CINZENTO · NV 40', tagSize: 38, hp: 1 }) + g(`<rect x="-160" y="-50" width="320" height="100" rx="16" fill="#0b0d10" opacity=".8"/>` + txt(0, 20, 'DIA 31', 60, '#ffffff', { ls: 4 }), 'translate(540,230)') + gameFG(t, true) + vignette(true) },
  // 22 Lobo não ataca
  { k: 'o lobo não', z: [1.0, 1.1], c: [540, 1300], f: (t, p) => gameMeadow(t, { dusk: true }) + wolf(620, 1640, 1.25, t, {}) + fullBody({ x: 150, y: 1900, s: 1.4, top: '#4a6a3a', legs: '#3a3a2e', armR: -60, item: DAGGER, head: { eyes: 'dot', mouth: 'flat', brows: 'serious' } }).replace('<g transform="translate(150,1900) scale(1.4) ', '<g filter="url(#b5)" transform="translate(150,1900) scale(1.4) ') + gameFG(t, true) + vignette(true) },
  // 23 recua, abaixa a cabeça, escreve
  { k: 'ele recua', z: [1.0, 1.12], c: [460, 1400], f: (t, p) => { let s = gameMeadow(t, { dusk: true }); s += wolf(lerp(620, 700, easeOut(seg(p, 0, .3))), 1640, 1.25, t, { bow: easeOut(seg(p, .2, .5)) }); const wp = seg(p, .55, 1); s += `<path d="M260,1700 q${40 * wp},${-30 * wp} ${80 * wp},0" stroke="#2a2018" stroke-width="10" fill="none" opacity=".7"/>`; return s + gameFG(t, true) + vignette(true); } },
  // 24 "Me deixa perder"
  { k: 'me deixa perder', z: [1.0, 1.1], c: [540, 1000], f: (t, p) => { let s = `<defs>${radGrad('dirt', [[0, '#7a5e40'], [1, '#3e2e20']])}</defs><rect width="${W}" height="${H}" fill="url(#dirt)"/>`; const r = rng(24); for (let i = 0; i < 80; i++) s += `<circle cx="${r() * W}" cy="${r() * H}" r="${2 + r() * 8}" fill="#2e2216" opacity=".5"/>`; const words = 'ME DEIXA PERDER'; const n = Math.ceil(seg(p, 0, .7) * words.length); s += txt(540, 820, words.slice(0, n), 130, '#2a1c10', { w: 900, ls: 4, extra: 'stroke="#9a7a5a" stroke-width="4" paint-order="stroke"' }); s += g(`<ellipse cx="0" cy="0" rx="90" ry="70" fill="#6f7680"/><circle cx="-50" cy="-60" r="26" fill="#6f7680"/><circle cx="0" cy="-74" r="26" fill="#6f7680"/><circle cx="50" cy="-60" r="26" fill="#6f7680"/>`, `translate(${lerp(140, 980, seg(p, 0, .7))},${960 + Math.sin(t * 10) * 10}) scale(1.3)`, `opacity="${1 - seg(p, .7, .8)}"`); return s + vignette(true); } },
  // 25 Caio levanta a adaga
  { k: 'caio levanta', z: [1.0, 1.1], c: [540, 1200], f: (t, p) => `<g filter="url(#b5)">${gameMeadow(t, { dusk: true })}${wolf(620, 1640, 1.25, t, { bow: 1 })}</g>` + g(hand(0, 0, 1, 0, { fist: true, sleeve: '#4a6a3a' }) + g(`<rect x="-26" y="-60" width="52" height="170" rx="14" fill="#4a3424"/><rect x="-110" y="-110" width="220" height="40" rx="14" fill="#9aa3ac"/><path d="M-44,-110 L44,-110 L0,-700Z" fill="#e6edf2"/>`, 'translate(0,-40)'), `translate(${560},${lerp(1900, 1350, easeOut(seg(p, 0, .6)))}) rotate(-8) scale(1.4)`) + vignette(true) },
  // 26 nome do jogador aparece
  { k: 'e em cima', z: [1.0, 1.15], c: [540, 900], f: (t, p) => { const gl = p > .3 ? Math.floor(t * 20) % 2 : 0; const names = ['xX_lob0_Xx', 'D4RK-W0LF', 'operador#88120']; const nm = p < .75 ? names[Math.floor(t * 8) % 3] : 'carregando...'; return gameMeadow(t, { dusk: true }) + wolf(620, 1640, 1.25, t, { bow: 1, tag: nm, tagCol: '#e9fbff', tagSize: 44, hp: .9 }) + `<rect width="${W}" height="${H}" fill="#fff" opacity="${gl * .05}"/>` + vignette(true); } },
  // 27 É o nome da mãe dele
  { k: 'é o nome', z: [1.0, 1.2], c: [540, 820], f: (t, p) => { if (p > .9) return `<rect width="${W}" height="${H}" fill="#000"/>`; let s = gameMeadow(t, { dusk: true }) + `<rect width="${W}" height="${H}" fill="#000" opacity=".45"/>` + wolf(620, 1640, 1.25, t, { bow: 1 }); s += g(`<rect x="-340" y="-90" width="680" height="180" rx="22" fill="#0b0d10" opacity=".9" stroke="#ff5d5d" stroke-width="6"/>` + txt(0, -14, 'JOGADOR', 34, '#9aa6ae', { ls: 6 }) + txt(0, 56, 'ROSA ALMEIDA', 80, '#ff5d5d', { w: 900, ls: 3 }), 'translate(540,820)', `filter="url(#glow)" opacity="${seg(p, 0, .15)}"`); return s + gameFG(t, true) + vignette(true); } },
  // 28 Segue pra parte 2
  { k: 'segue pra', z: [1.0, 1.06], f: (t, p) => `<rect width="${W}" height="${H}" fill="#050505"/>` + bust({ x: 540, y: 1150, s: 2.4, ...HUNTER, eyes: 'wide', mouth: 'small', brows: 'up' }).replace('<g transform', '<g opacity=".85" transform') + `<rect width="${W}" height="${H}" fill="#ff2a2a" opacity=".08"/>` + txt(540, 400, 'PARTE 2', 140, GOLD, { w: 900, ls: 8, op: seg(p, .2, .5), extra: 'stroke="#000" stroke-width="14" paint-order="stroke"' }) + vignette(true) },
];

// =====================================================================
// V2 — desenho melhorado (sobrepõe as versões anteriores)
// =====================================================================
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
function bust(o) {
  let s = '';
  const hood = o.hair === 'hood';
  const top = hood ? hoodCol(o) : (o.top || '#3b4150');
  s += `<path d="M-180,470 C-182,270 -150,180 -66,158 L66,158 C150,180 182,270 180,470 Z" fill="${top}"/>`;
  s += `<path d="M66,158 C150,180 182,270 180,470 L120,470 C130,320 120,220 66,158Z" fill="#000" opacity=".18"/>`;
  s += `<rect x="-26" y="56" width="52" height="110" rx="22" fill="#b06e44"/>`;
  if (o.outfit === 'hoodie' || hood) s += `<path d="M-70,152 C-60,210 60,210 70,152 L80,176 C50,236 -50,236 -80,176Z" fill="#000" opacity=".22"/><path d="M-20,200 L-26,300 M20,200 L26,300" stroke="#d8d2c8" stroke-width="5" stroke-linecap="round" opacity="${hood ? .7 : 0}"/>`;
  if (o.outfit === 'suit') s += `<path d="M-40,156 L0,250 L40,156Z" fill="#eef0f2"/><path d="M-8,170 L8,170 L12,260 L0,280 L-12,260Z" fill="#23262c"/>`;
  s += g(headG(o), 'translate(0,-10)');
  const br = o.breath != null ? 1 + .012 * Math.sin(o.breath * 2.2) : 1;
  return g(s, `translate(${o.x},${o.y}) scale(${(o.s || 1)},${(o.s || 1) * br})`);
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
function tree(x, y, s, col1, col2, blur) {
  return g(`<path d="M-14,0 L14,0 L10,-150 L-10,-150Z" fill="#6b4a32"/><circle cx="0" cy="-200" r="90" fill="${col2}"/><circle cx="-60" cy="-160" r="62" fill="${col2}"/><circle cx="60" cy="-165" r="66" fill="${col2}"/><circle cx="-20" cy="-230" r="70" fill="${col1}"/><circle cx="-60" cy="-180" r="44" fill="${col1}"/><circle cx="30" cy="-250" r="40" fill="#b8e88a" opacity=".5"/>`, `translate(${x},${y}) scale(${s})`, blur ? `filter="url(#${blur})"` : '');
}
function blades(t, n, seed, y0, y1, hmin, hmax, wmax, c1, c2, blur, op = 1) {
  const r = rng(seed); let s = '';
  for (let i = 0; i < n; i++) {
    const x = r() * (W + 200) - 100, y = y0 + r() * (y1 - y0), h = hmin + r() * (hmax - hmin), w = 6 + r() * wmax, lean = (r() - .5) * h * .5 + Math.sin(t * 1.5 + i * .7) * h * .06;
    s += `<path d="M${x - w},${y} Q${x + lean * .4},${y - h * .55} ${x + lean},${y - h} Q${x + lean * .4 + w * .4},${y - h * .5} ${x + w},${y}Z" fill="${r() < .5 ? c1 : c2}"/>`;
  }
  return `<g ${blur ? `filter="url(#${blur})"` : ''} opacity="${op}">${s}</g>`;
}
function gameMeadow(t, opts = {}) {
  const dusk = opts.dusk, cx = opts.camX || 0;
  let s = `<defs>${SKIN_DEFS}${linGrad('gsky2', dusk ? [[0, '#2e2448'], [.45, '#a8566a'], [.7, '#f0a070'], [1, '#ffd6a0']] : [[0, '#7fb3dc'], [.55, '#bcdcf2'], [1, '#f2f8fc']])}${linGrad('mt1', dusk ? [[0, '#6a5a7a'], [1, '#8a6a7a']] : [[0, '#8fa6bf'], [1, '#c2d3e2']])}${linGrad('fld', dusk ? [[0, '#5a6a3a'], [1, '#22301c']] : [[0, '#a6dc6a'], [.4, '#6cc048'], [1, '#3e9a30']])}</defs>`;
  s += `<rect width="${W}" height="${H}" fill="url(#gsky2)"/>`;
  s += `<circle cx="${dusk ? 780 : 900}" cy="${dusk ? 820 : 160}" r="${dusk ? 140 : 110}" fill="${dusk ? '#ffe0a0' : '#fffbe8'}" filter="url(#glow2)" opacity=".95"/>`;
  for (let i = 0; i < 5; i++) s += `<path d="M${dusk ? 780 : 900},${dusk ? 820 : 160} L${-200 + i * 260 + Math.sin(t * .3 + i) * 30},${H} L${-80 + i * 260 + Math.sin(t * .3 + i) * 30},${H}Z" fill="#fffbe8" opacity="${dusk ? .05 : .07}"/>`;
  if (!dusk) { const r = rng(5); for (let i = 0; i < 4; i++) { const ccx = ((r() * W + t * 10) % (W + 400)) - 200, ccy = 260 + r() * 300; s += `<g opacity=".75" filter="url(#b5)"><ellipse cx="${ccx}" cy="${ccy}" rx="150" ry="40" fill="#fff"/><ellipse cx="${ccx - 60}" cy="${ccy - 24}" rx="80" ry="46" fill="#fff"/><ellipse cx="${ccx + 50}" cy="${ccy - 30}" rx="90" ry="52" fill="#fff"/></g>`; } }
  // montanhas distantes
  s += g(`<path d="M-200,1000 L60,640 L200,760 L420,470 L640,780 L820,560 L1060,820 L1300,1000Z" fill="url(#mt1)" opacity=".85"/>` +
    `<path d="M420,470 L640,780 L560,700 L500,720 L470,640Z" fill="#000" opacity=".1"/><path d="M420,470 L480,560 L450,580 L430,550 L400,575 L380,540Z" fill="#f6fafd"/><path d="M820,560 L870,630 L850,640 L830,615 L800,640 L790,600Z" fill="#f6fafd"/><path d="M420,470 L480,560 L470,600 L440,520Z" fill="#c9d6e2"/>`, `translate(${cx * .1},0)`, 'filter="url(#b2)"');
  s += `<rect y="800" width="${W}" height="260" fill="${dusk ? '#c08a7a' : '#e6f0f6'}" opacity=".45" filter="url(#b30)"/>`;
  s += g(`<path d="M-200,1010 L120,840 L300,900 L520,820 L760,920 L1000,850 L1300,1010Z" fill="${dusk ? '#4a5a4a' : '#8fb39a'}" opacity=".8"/>`, `translate(${cx * .2},0)`, 'filter="url(#b5)"');
  // campo
  s += `<rect y="990" width="${W}" height="${H}" fill="url(#fld)"/>`;
  s += g(`<path d="M-100,1060 C200,1040 300,1100 520,1090 C760,1080 900,1120 1200,1100 L1200,1125 C900,1145 760,1105 520,1115 C300,1125 200,1065 -100,1085Z" fill="${dusk ? '#6a7aa0' : '#9ad8f0'}" opacity=".85"/>`, `translate(${cx * .3},0)`, 'filter="url(#b2)"');
  const rT = rng(9); let trees = '';
  for (let i = 0; i < 8; i++) { const x = rT() * (W + 200) - 100, y = 1000 + rT() * 60; trees += tree(x, y, .45 + rT() * .3, dusk ? '#4a6a3a' : '#7cc850', dusk ? '#34502c' : '#4e9a36'); }
  s += g(trees, `translate(${cx * .3},0)`, 'filter="url(#b5)"');
  s += g(tree(opts.bigTreeX ?? 900, 1260, 1.5, dusk ? '#4a6a3a' : '#7cc850', dusk ? '#34502c' : '#4e9a36', 'b2'), `translate(${cx * .5},0)`);
  s += blades(t, 160, 31, 1050, 1500, 30, 90, 4, dusk ? '#4a6a36' : '#7cc850', dusk ? '#3a5a2e' : '#5aae3c', 'b2', .9);
  if (!dusk) { const r2 = rng(13); for (let i = 0; i < 30; i++) s += `<circle cx="${r2() * W}" cy="${1080 + r2() * 600}" r="${4 + r2() * 6}" fill="${['#fff', '#ffe46a', '#fff'][i % 3]}" opacity=".9"/>`; }
  s += blades(t, 120, opts.seed || 3, 1500, 1980, 120, 320, 8, dusk ? '#3f5f33' : '#6cc04a', dusk ? '#33502a' : '#4ea838', '', 1);
  return s;
}
function gameFG(t, dusk) {
  const r = rng(77); let p = '';
  for (let i = 0; i < 18; i++) p += `<circle cx="${(r() * W + t * 20 * (r() - .3)) % W}" cy="${(r() * H - t * 25 * r() + H) % H}" r="${2 + r() * 4}" fill="#fffbe0" opacity="${.3 + r() * .4}"/>`;
  return p + blades(t, 14, 55, 2000, 2050, 500, 900, 30, dusk ? '#2f4a28' : '#5ab03a', dusk ? '#253c20' : '#469a2e', 'b18', .95);
}
function slime(x, y, s, t, opts = {}) {
  const sq = 1 + .06 * Math.sin(t * 6), jump = opts.jump || 0;
  let b = `<defs>${SKIN_DEFS}</defs><ellipse cx="0" cy="6" rx="140" ry="26" fill="#3fe0c8" opacity=".35" filter="url(#b10)"/><ellipse cx="0" cy="6" rx="110" ry="16" fill="#000" opacity=".18"/>`;
  b += g(`<path d="M-120,0 C-130,-90 -70,-170 0,-170 C70,-170 130,-90 120,0 C80,10 -80,10 -120,0Z" fill="url(#slimeG)" opacity=".92"/><ellipse cx="0" cy="-40" rx="90" ry="40" fill="url(#slimeIn)"/><path d="M-80,-120 C-60,-150 -20,-160 10,-156" stroke="#fff" stroke-width="16" fill="none" stroke-linecap="round" opacity=".75"/><circle cx="64" cy="-110" r="10" fill="#fff" opacity=".7"/>` +
    [[-60, -60, 6], [50, -40, 5], [20, -130, 4], [-30, -20, 4]].map(([bx, by, br]) => `<circle cx="${bx}" cy="${by + Math.sin(t * 2 + bx) * 4}" r="${br}" fill="none" stroke="#e8fffa" stroke-width="2" opacity=".8"/>`).join('') +
    `<ellipse cx="-30" cy="-78" rx="12" ry="15" fill="#10262a"/><ellipse cx="30" cy="-78" rx="12" ry="15" fill="#10262a"/><circle cx="-26" cy="-84" r="4" fill="#fff"/><circle cx="34" cy="-84" r="4" fill="#fff"/><path d="M-10,-48 q10,8 20,0" stroke="#10262a" stroke-width="5" fill="none" stroke-linecap="round"/>`, `translate(0,${-jump * 160}) scale(${1 / sq},${sq})`);
  if (opts.hp != null) b += g(`<rect x="-80" y="-14" width="160" height="28" rx="14" fill="#0b1a12" opacity=".6"/><rect x="-70" y="-6" width="${140 * opts.hp}" height="12" rx="6" fill="#5fe08a"/>` + txt(0, -26, `${Math.round(20 * opts.hp)}/20`, 26, '#ffffff', { extra: 'stroke="#000" stroke-width="5" paint-order="stroke"' }), 'translate(0,-230)');
  return g(b, `translate(${x},${y}) scale(${s})`);
}
function wolf(x, y, s, t, opts = {}) {
  const bow = opts.bow || 0, br = 1 + .015 * Math.sin(t * 2);
  let w = `<defs>${SKIN_DEFS}</defs><ellipse cx="0" cy="10" rx="280" ry="30" fill="#000" opacity=".3" filter="url(#b5)"/>`;
  w += `<path d="M190,-200 C270,-210 320,-250 350,-${300 + 10 * Math.sin(t * 3)} C360,-250 320,-180 200,-160Z" fill="#6f7782"/>`;
  for (const [lx, d] of [[-150, 1], [110, 1]]) w += `<path d="M${lx - 22},-150 L${lx + 22},-150 L${lx + 16},0 L${lx - 16},0Z" fill="#545c66"/>`;
  w += `<path d="M-230,-200 C-230,-290 -100,-320 40,-300 C170,-290 240,-250 230,-180 C220,-120 130,-110 20,-110 C-120,-110 -230,-120 -230,-200Z" fill="url(#wolfG)" transform="scale(1,${br})" style="transform-origin:0 -200px"/>`;
  w += `<path d="M-200,-250 l20,-30 l10,26 l18,-34 l12,30 l20,-30 l8,30" fill="#5d6570"/>`;
  for (const [lx, d] of [[-120, 0], [150, 0]]) w += `<path d="M${lx - 24},-150 L${lx + 24},-150 L${lx + 18},0 L${lx - 18},0Z" fill="#7e8691"/><ellipse cx="${lx}" cy="0" rx="26" ry="10" fill="#4a5058"/>`;
  w += g(`<path d="M-50,-60 L-36,-170 L10,-80Z" fill="#5d6570"/><path d="M-40,-80 L-34,-140 L0,-90Z" fill="#c9a0a0" opacity=".6"/><path d="M20,-70 L60,-170 L84,-60Z" fill="#5d6570"/><path d="M-110,-40 C-110,-110 90,-120 110,-30 C120,40 60,90 0,90 C-60,90 -110,40 -110,-40Z" fill="url(#wolfG)"/><path d="M-100,10 L-240,40 C-250,70 -230,90 -200,88 L-60,80Z" fill="#9aa2ac"/><path d="M-200,88 L-80,84 L-120,100Z" fill="#7e8691"/><ellipse cx="-236" cy="52" rx="20" ry="16" fill="#1a1c20"/><path d="M-70,90 C-40,120 20,120 40,90" fill="#c8ced4"/><ellipse cx="-36" cy="-16" rx="13" ry="11" fill="${opts.eye || '#ffd24a'}" filter="url(#glow)"/><circle cx="-38" cy="-16" r="5" fill="#111"/><path d="M-60,-38 l40,8" stroke="#3a3f45" stroke-width="7" stroke-linecap="round"/>`, `translate(-200,${-250 + bow * 150}) rotate(${-bow * 25})`);
  if (opts.tag) w += g(`<rect x="-280" y="-60" width="560" height="120" rx="18" fill="#0b0d10" opacity=".75" stroke="${opts.tagCol || '#ff5d5d'}" stroke-width="4"/>` + txt(0, -10, opts.tag, opts.tagSize || 40, opts.tagCol || '#ff5d5d', { ls: 2 }) + `<rect x="-210" y="16" width="420" height="16" rx="8" fill="#33373c"/><rect x="-210" y="16" width="${420 * (opts.hp ?? 1)}" height="16" rx="8" fill="#ff5d5d"/>`, 'translate(-20,-580)');
  return g(w, `translate(${x},${y}) scale(${s})`);
}
function room(t) {
  let s = `<defs>${SKIN_DEFS}${linGrad('rm2', [[0, '#1a222c'], [1, '#2a333e']])}${radGrad('bulb', [[0, '#ffe6a8', .55], [1, '#ffe6a8', 0]])}</defs><rect width="${W}" height="${H}" fill="url(#rm2)"/>`;
  s += `<path d="M0,0 L220,260 L220,1500 L0,1900Z" fill="#141a22"/><path d="M${W},0 L860,260 L860,1500 L${W},1900Z" fill="#18202a"/><path d="M220,1500 L860,1500 L${W},1900 L0,1900Z" fill="#11161c"/>`;
  s += `<rect x="600" y="420" width="220" height="300" fill="#2c3846"/><rect x="616" y="436" width="188" height="268" fill="#5a7a9a" opacity=".35"/>`;
  s += `<g filter="url(#b5)"><rect x="250" y="520" width="260" height="560" fill="#202630"/>`;
  for (let i = 0; i < 4; i++) for (let k = 0; k < 5; k++) s += `<rect x="${266 + k * 48}" y="${540 + i * 130}" width="38" height="100" fill="${['#8a3a2a', '#2a5a8a', '#2a7a4a', '#8a7a2a', '#5a3a8a'][(i + k) % 5]}" opacity=".8"/>`;
  s += `</g>`;
  const sw = Math.sin(t * 1.2) * 3;
  s += `<path d="M540,0 L${540 + sw},300" stroke="#0a0c10" stroke-width="4"/><circle cx="${540 + sw}" cy="320" r="26" fill="#fff2c4" filter="url(#glow2)"/><ellipse cx="540" cy="900" rx="520" ry="900" fill="url(#bulb)"/>`;
  return s;
}

// =====================================================================
// V3 — proporções do vídeo de referência: cabeça grande, pescoço curto,
// ombros largos e arredondados, mãos de luva simples
// =====================================================================
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
// ÁUREA — EPISÓDIO 1: MÃO LEVE (Caio, o ladrão de drop)
// =====================================================================
const THIEF = { hair: 'hood', hairCol: '#2f5f6a', top: '#2f5f6a', outfit: 'hoodie', mask: true };
const REAL_CAIO = { hair: 'short', hairCol: '#1f1a17', top: '#c99a2e', outfit: 'hoodie' };
const PART = { words: 'words5.json', end: 97.9, abTime: 92.3, gap: { key: 'o dragão cai', dur: 7 },
  merges: [
    [['mais','três','mil','e','duzentos','reais'], '+R$ 3.200'],
    [['três','mil','e','duzentos','reais'], 'R$ 3.200'],
    [['quatrocentas','mil','pessoas'], '400 MIL PESSOAS'],
    [['três','segundos'], '3 SEGUNDOS'],
    [['nível','doze'], 'NÍVEL 12'],
    [['dez','metros'], '10 METROS'],
    [['trinta','e','sete','reais'], 'R$ 37'],
    [['dois','meses'], '2 MESES'],
    [['nível','oitenta'], 'NÍVEL 80'],
    [['quarenta','minutos'], '40 MINUTOS'],
  ],
  hl: ['áurea','monstro','dinheiro','drop','dono','caio','ladrão','arma','mão','leve','item','pix','aluguel','coroa','negra','guilda','rica','dragão','pedra','mato','cai','baú','dourado','coração','rubi','some','vibra','sorri','mensagem','líder','roubo','trás','olha','outro','jogador','roupa','classe','nome','alvo','ficção','manchester','2008','ouro','pesquisa','sorrindo','clone','encarar','fugir','pago','respirar','ninguém','real','a','b']
};

// lenço cobrindo a boca do ladrão
function face2(o) {
  let s = face2base(o.mask ? { ...o, mouth: 'none' } : o);
  if (o.mask) s += `<path d="M-60,14 C-30,8 30,8 60,14 L58,40 C50,74 28,84 0,84 C-28,84 -50,74 -58,40Z" fill="#1d3a42"/><path d="M-60,14 C-30,8 30,8 60,14" stroke="#4a8a96" stroke-width="5" fill="none"/><path d="M-20,40 q20,10 40,0 M-30,60 q30,10 60,0" stroke="#000" stroke-width="3" fill="none" opacity=".25"/>`;
  return s;
}
function guildMember(x, y, s, t, col, opts = {}) {
  const armor = `<path d="M-60,-10 L60,-10 L54,40 L-54,40Z" fill="#c9a24a" opacity=".9"/>`;
  return fullBody({ x, y, s, top: col, legs: '#1a1c22', armR: opts.armR ?? -20, armL: 15, item: opts.item || `<g transform="translate(0,250) rotate(180)"><rect x="-10" y="-30" width="20" height="70" rx="6" fill="#3a2a1e"/><rect x="-46" y="36" width="92" height="18" rx="6" fill="#c9a24a"/><path d="M-18,54 L18,54 L10,420 L0,450 L-10,420Z" fill="#dfe6ec"/></g>`, flip: opts.flip, head: { hair: opts.hair || 'short', hairCol: opts.hairCol || '#2a2420', eyes: opts.eyes || 'dot', mouth: opts.mouth || 'flat', brows: opts.brows || 'serious' } }, t) + g(`<path d="M-50,0 L-30,-40 L-10,-10 L0,-50 L10,-10 L30,-40 L50,0Z" fill="#c9a24a"/>`, `translate(${x},${y - 760 * s}) scale(${s})`);
}
function crownEmblem(x, y, s, glow = true) {
  return g(`<circle r="170" fill="#121418" stroke="#c9a24a" stroke-width="12"/><path d="M-100,50 L-110,-60 L-50,-10 L0,-90 L50,-10 L110,-60 L100,50Z" fill="#0b0c0f" stroke="#c9a24a" stroke-width="10" stroke-linejoin="round"/><rect x="-100" y="50" width="200" height="34" rx="6" fill="#c9a24a"/><circle cx="0" cy="-90" r="12" fill="#d23"/>`, `translate(${x},${y}) scale(${s})`, glow ? 'filter="url(#sh)"' : '');
}
function stoneDragon(x, y, s, t, opts = {}) {
  const fall = opts.fall || 0, br = 1 + .02 * Math.sin(t * 2);
  let d = `<ellipse cx="0" cy="10" rx="${380 + fall * 80}" ry="40" fill="#000" opacity=".3" filter="url(#b10)"/>`;
  d += g(`<path d="M-120,-260 L-420,-560 L-300,-380 L-460,-420 L-260,-250Z" fill="#6a6f78"/><path d="M120,-260 L420,-560 L300,-380 L460,-420 L260,-250Z" fill="#5a5f68"/>` +
    `<path d="M-280,0 L-320,-180 L-200,-320 L0,-360 L200,-320 L320,-180 L280,0Z" fill="#7a7f88"/><path d="M-200,-320 L0,-360 L-40,-200 L-220,-160Z" fill="#8f949c"/><path d="M0,-360 L200,-320 L160,-160 L-40,-200Z" fill="#6a6f78"/><path d="M-220,-160 L-40,-200 L160,-160 L120,0 L-180,0Z" fill="#5d626a"/>` +
    `<path d="M-120,-150 l40,-20 l20,40 M60,-110 l50,10 l-10,40" stroke="#ff7a2a" stroke-width="8" fill="none" opacity=".8" filter="url(#glow)"/>` +
    g(`<path d="M-60,0 L-140,-120 L-60,-200 L60,-200 L140,-120 L60,0Z" fill="#8a8f98"/><path d="M-60,-200 L-90,-280 L-30,-210Z M60,-200 L90,-280 L30,-210Z" fill="#5a5f68"/><path d="M-60,0 L60,0 L40,60 L-40,60Z" fill="#6a6f78"/><circle cx="-50" cy="-110" r="18" fill="${opts.dead ? '#3a3a3a' : '#ff8a2a'}" filter="url(#glow)"/><circle cx="50" cy="-110" r="18" fill="${opts.dead ? '#3a3a3a' : '#ff8a2a'}" filter="url(#glow)"/>`, `translate(0,${-330 + fall * 260}) rotate(${fall * 30})`), `rotate(${fall * 8}) scale(1,${br * (1 - fall * .35)})`);
  return g(d, `translate(${x},${y}) scale(${s})`);
}
function chest(x, y, s, t, open = 0) {
  return g(`<ellipse cx="0" cy="-60" rx="260" ry="200" fill="#ffd24a" opacity="${.25 + .1 * Math.sin(t * 4)}" filter="url(#b30)"/><rect x="-150" y="-120" width="300" height="140" rx="16" fill="#8a5a2a"/><rect x="-150" y="-120" width="300" height="140" rx="16" fill="none" stroke="#ffc928" stroke-width="12"/><rect x="-20" y="-80" width="40" height="50" rx="6" fill="#ffc928"/>` + g(`<path d="M-150,0 C-150,-90 150,-90 150,0Z" fill="#a06a32" stroke="#ffc928" stroke-width="12"/>`, `translate(0,-120) rotate(${-open * 35},-150,0)`), `translate(${x},${y}) scale(${s})`);
}
function ruby(x, y, s, t) {
  return g(`<circle r="150" fill="#ff3a5a" opacity=".3" filter="url(#b30)"/><path d="M0,110 C-130,10 -150,-70 -90,-110 C-50,-135 -10,-110 0,-80 C10,-110 50,-135 90,-110 C150,-70 130,10 0,110Z" fill="#d81e4a"/><path d="M-90,-110 C-50,-135 -10,-110 0,-80 L-30,-20Z" fill="#ff7a96"/><path d="M0,-80 L60,-30 L0,110 L-30,-20Z" fill="#a8103a" opacity=".6"/><circle cx="-60" cy="-70" r="14" fill="#fff" opacity=".8"/>`, `translate(${x},${y}) scale(${s * (1 + .03 * Math.sin(t * 3))}) rotate(${Math.sin(t) * 5})`);
}
function bushes(t, y0 = 1500, dark = false) {
  const r = rng(91); let s = '';
  for (let i = 0; i < 14; i++) { const x = r() * W, yy = y0 + r() * 500, rr = 140 + r() * 120, sw = Math.sin(t * 1.3 + i) * 6; s += `<circle cx="${x + sw}" cy="${yy}" r="${rr}" fill="${dark ? (r() < .5 ? '#2e4a26' : '#3a5a2e') : (r() < .5 ? '#3f8a2e' : '#4fa03a')}"/><circle cx="${x - rr * .3 + sw}" cy="${yy - rr * .4}" r="${rr * .45}" fill="${dark ? '#4a6a36' : '#6cc04a'}" opacity=".7"/>`; }
  return s;
}
function pullLine(x0, y0, x1, y1, p) {
  const xe = lerp(x0, x1, p), ye = lerp(y0, y1, p);
  return `<path d="M${x0},${y0} Q${(x0 + xe) / 2},${Math.min(y0, ye) - 160} ${xe},${ye}" stroke="#ffd24a" stroke-width="10" fill="none" stroke-dasharray="30 14" filter="url(#glow)" opacity=".95"/>`;
}
function chatBox(x, y, s, title, msg, n) {
  return g(`<rect x="-420" y="-150" width="840" height="300" rx="28" fill="#0b0d10" opacity=".9" stroke="#c9a24a" stroke-width="5"/>` + crownEmblem(-330, -70, .32, false) + txt(-270, -70, title, 38, '#c9a24a', { a: 'start', ls: 1 }) + txt(-270, -26, 'MENSAGEM PRIVADA', 26, '#9aa6ae', { a: 'start', ls: 3 }) + txt(-380, 80, msg.slice(0, n), 52, '#ffffff', { a: 'start', fam: 'NU', w: 800 }), `translate(${x},${y}) scale(${s})`, 'filter="url(#sh)"');
}
const KNIFE = `<g transform="translate(0,250) rotate(200)"><rect x="-10" y="-20" width="20" height="60" rx="6" fill="#4a3424"/><rect x="-34" y="34" width="68" height="14" rx="6" fill="#6a5a4a"/><path d="M-14,48 L14,48 L4,200 L-8,190Z" fill="#9a7a5a"/><path d="M-6,80 l8,6 M-4,130 l8,4" stroke="#6a4a2a" stroke-width="4"/></g>`;

const SCENES = [
  // 01 Quem mata não fica com o dinheiro
  { k: 'no áurea quem', z: [1.1, 1.0], c: [540, 1300], f: (t, p) => { let s = gameMeadow(t, { bigTreeX: 120 }); const kp = seg(p, .2, .3); if (kp < 1) s += boar(760, 1640, 1.0, t).replace('<g transform', `<g opacity="${1 - kp}" transform`); s += guildMember(460, 1720, 1.0, t, '#22252b', { armR: -120 + 100 * seg(p, .1, .25) }); const cp = seg(p, .35, .7); if (p > .25) s += coin(lerp(720, 120, easeIn(cp)), lerp(1500, 1650, cp) - Math.sin(cp * Math.PI) * 300, 1.2, t * 300); if (p > .35) s += pullLine(80, 1700, 720, 1500, Math.min(1, cp * 1.5)); s += bushes(t, 1750); s += `<circle cx="70" cy="1690" r="10" fill="#fff"/><circle cx="110" cy="1690" r="10" fill="#fff"/>`; return s + gameFG(t) + vignette(); } },
  // 02 Drop fica 3 segundos
  { k: 'quando um', z: [1.0, 1.1], c: [540, 1100], f: (t, p) => { let s = `<g filter="url(#b5)">${gameMeadow(t)}</g>`; s += `<ellipse cx="540" cy="1250" rx="200" ry="50" fill="#ffd24a" opacity=".35" filter="url(#b18)"/>` + g(`<path d="M-90,0 L-60,-110 L60,-110 L90,0Z" fill="#7a4a2a"/><path d="M-60,-110 C-60,-150 60,-150 60,-110" stroke="#ffc928" stroke-width="10" fill="none"/>`, `translate(540,${1240 + Math.sin(t * 3) * 6}) scale(1.4)`); const left = 3 - Math.min(3, p * 3); s += `<circle cx="540" cy="760" r="120" fill="#0b0d10" opacity=".8"/><circle cx="540" cy="760" r="120" fill="none" stroke="#ffc928" stroke-width="14" stroke-dasharray="${left / 3 * 754} 760" transform="rotate(-90,540,760)"/>` + txt(540, 790, Math.ceil(left || 0.01).toString(), 110, '#ffffff', { w: 900 }); return s + vignette(); } },
  // 03 Sem dono
  { k: 'sem dono', z: [1.0, 1.06], c: [540, 1100], f: (t, p) => `<g filter="url(#b5)">${gameMeadow(t)}</g>` + g(`<path d="M-90,0 L-60,-110 L60,-110 L90,0Z" fill="#7a4a2a"/><path d="M-60,-110 C-60,-150 60,-150 60,-110" stroke="#ffc928" stroke-width="10" fill="none"/>`, `translate(540,1240) scale(1.4)`) + g(`<rect x="-200" y="-50" width="400" height="100" rx="16" fill="#0b0d10" opacity=".85" stroke="#9aa6ae" stroke-width="3"/>` + txt(0, 18, 'DONO: —', 50, '#9aa6ae', { ls: 4 }), 'translate(540,960)') + vignette() },
  // 04 Tudo que o Caio precisa (olhos no mato)
  { k: 'é tudo que', z: [1.0, 1.15], c: [540, 1100], f: (t, p) => { let s = gameMeadow(t, { seed: 6 }) + `<rect width="${W}" height="${H}" fill="#000" opacity=".15"/>` + bushes(t, 1100); const blink = (t % 2.4) < .12; s += g(headG({ ...THIEF, eyes: blink ? 'closed' : 'dot', brows: 'serious', look: 12 }), 'translate(540,1180) scale(1.6)'); s += bushes(t + 2, 1450); return s + gameFG(t) + vignette(true); } },
  // 05 Classe: Ladrão
  { k: 'classe ladrão', z: [1.0, 1.06], f: (t, p) => { const icon = `<rect x="-90" y="-60" width="180" height="200" rx="40" fill="#2f5f6a"/><path d="M-96,-90 C-96,-230 96,-230 96,-90 L86,-30 L-86,-30Z" fill="#2f5f6a"/><circle cy="-100" r="56" fill="${SK}"/><path d="M-56,-90 C-30,-96 30,-96 56,-90 L50,-60 C40,-46 -40,-46 -50,-60Z" fill="#1d3a42"/><circle cx="-18" cy="-112" r="7" fill="#222"/><circle cx="18" cy="-112" r="7" fill="#222"/><circle cx="110" cy="60" r="40" fill="#c9a24a"/>` + txt(110, 74, 'R$', 30, '#6a4a0a'); return gameMeadow(t) + `<rect width="${W}" height="${H}" fill="#fff" opacity=".18"/>` + classCard(540, 820, 1.15 * lerp(.9, 1, easeOut(seg(p, 0, .3))), 'LADRÃO', '#1d3a42', icon, { shine: seg(p, .1, .7), border: '#7fd6e6' }) + gameFG(t) + vignette(); } },
  // 06 Nível 12
  { k: 'nível doze', z: [1.0, 1.08], c: [540, 1100], f: (t, p) => gameMeadow(t) + fullBody({ x: 540, y: 1700, s: 1.6, top: '#2f5f6a', legs: '#1f2a2e', armR: -15, armL: 8, item: KNIFE, head: { ...THIEF, eyes: 'dot', brows: 'serious', blink: (t % 2.6) < .12 } }, t) + g(`<rect x="-230" y="-50" width="460" height="100" rx="16" fill="#0b1a12" opacity=".8"/>` + txt(0, 18, 'NÍVEL 12 · LADRÃO', 44, '#d8ffe0', { ls: 2 }), 'translate(540,260)') + gameFG(t) + vignette() },
  // 07 Nenhuma arma decente
  { k: 'nenhuma arma', z: [1.0, 1.1], c: [540, 900], f: (t, p) => `<g filter="url(#b10)">${gameMeadow(t)}</g>` + g(`<rect x="-26" y="-80" width="52" height="190" rx="14" fill="#4a3424"/><rect x="-80" y="100" width="160" height="34" rx="12" fill="#6a5a4a"/><path d="M-36,134 L36,134 L14,620 L-20,590Z" fill="#9a7a5a"/><path d="M-10,250 l20,10 M-14,400 l22,8 M-6,520 l16,6" stroke="#6a4a2a" stroke-width="8"/>`, 'translate(560,640) rotate(190)') + hand(540, 1400, 1.7, 10, { glove: true, fist: true, sleeve: '#2f5f6a' }) + g(`<rect x="-280" y="-60" width="560" height="120" rx="18" fill="#0b0d10" opacity=".85" stroke="#9a7a5a" stroke-width="4"/>` + txt(0, -6, 'FACA ENFERRUJADA', 44, '#e9fbff', { ls: 2 }) + txt(0, 40, 'DANO 3', 34, '#ff7a6a', { ls: 3 }), 'translate(540,260)', `opacity="${seg(p, .2, .4)}"`) + vignette() },
  // 08 Habilidade rara: Mão Leve
  { k: 'mas ele tem', z: [1.0, 1.06], f: (t, p) => { const icon = `<circle cy="-60" r="150" fill="#ffd24a" opacity=".25" filter="url(#b18)"/>` + hand(0, -20, 1.1, 0, { glove: true }) + `<path d="M-160,-200 Q0,-320 160,-200" stroke="#ffd24a" stroke-width="10" fill="none" stroke-dasharray="26 12" filter="url(#glow)"/>`; return archiveBG(t, { palette: () => '#ffd24a' }) + `<rect width="${W}" height="${H}" fill="#000" opacity=".5"/>` + classCard(540, 820, 1.15, 'MÃO LEVE', '#3a2a10', icon, { shine: seg(p, .1, .7), border: '#ffd24a' }) + g(`<rect x="-110" y="-30" width="220" height="60" rx="30" fill="#ffd24a"/>` + txt(0, 14, 'RARA', 34, '#3a2a10', { ls: 4 }), 'translate(700,430) rotate(8)', `opacity="${seg(p, .3, .45)}"`) + vignette(true); } },
  // 09 Pega qualquer item a 10 metros
  { k: 'pega qualquer', z: [1.0, 1.06], c: [540, 1300], f: (t, p) => { let s = gameMeadow(t, { seed: 8 }); const pp = easeIn(seg(p, .25, .8)); s += fullBody({ x: 220, y: 1720, s: 1.0, top: '#2f5f6a', legs: '#1f2a2e', armR: -95, armL: 10, head: { ...THIEF, eyes: 'dot', brows: 'serious' } }, t); s += coin(lerp(900, 330, pp), lerp(1650, 1240, pp), 1.1, t * 200); if (p > .2) s += pullLine(330, 1240, 900, 1650, 1 - pp * .0); s += `<path d="M300,1830 H900" stroke="#fff" stroke-width="6" stroke-dasharray="20 14" opacity=".8"/>` + txt(600, 1890, '10 METROS', 48, '#ffffff', { extra: 'stroke="#000" stroke-width="8" paint-order="stroke"' }); return s + gameFG(t) + vignette(); } },
  // 10 Cada item vira PIX
  { k: 'e no áurea', z: [1.0, 1.06], f: (t, p) => { let s = gameMeadow(t); const r = rng(10); for (let i = 0; i < 10; i++) s += coin(150 + r() * 780, 1100 + r() * 700 - easeOut(p) * 200 * r(), .8 + r() * .5, t * 150 * r()); s += g(`<rect x="-320" y="-80" width="640" height="160" rx="34" fill="#0b1a12" opacity=".9"/><circle cx="-240" r="46" fill="#32bcad"/>` + txt(-240, 14, 'PIX', 32, '#fff') + txt(40, -10, 'PIX RECEBIDO', 36, '#9fe3d0') + txt(40, 50, '+ R$ 4,50', 56, '#ffffff'), `translate(540,${lerp(-140, 340, easeOut(seg(p, .1, .3)))})`); return s + gameFG(t) + vignette(); } },
  // V2: Universidade de Manchester, 2008 — sala de farmers de ouro
  { k: 'em 2008', z: [1.0, 1.08], c: [540, 1100], f: (t, p) => { let s = `<defs>${linGrad('farm', [[0, '#1a1e24'], [1, '#2a2f36']])}</defs><rect width="${W}" height="${H}" fill="url(#farm)"/>`; for (let row = 0; row < 5; row++) { const y = 700 + row * 230, sc = .55 + row * .14; for (let i = 0; i < 6; i++) { const x = 90 + i * 180 + (row % 2) * 60; s += g(`<rect x="-70" y="-110" width="140" height="95" rx="8" fill="#0f1a14"/><rect x="-62" y="-102" width="124" height="79" fill="${(i + row) % 3 ? '#3a8a5a' : '#c9a24a'}" opacity="${.5 + .3 * Math.sin(t * 3 + i + row)}"/><rect x="-90" y="-15" width="180" height="16" fill="#3a3028"/>` + g(headG({ hair: 'short', hairCol: '#14110f', eyes: 'dot', mouth: 'flat', brows: 'neutral', blink: ((t + i * .7 + row) % 3) < .1 }), 'translate(0,60) scale(.45)') + `<rect x="-40" y="90" width="80" height="60" rx="20" fill="#4a5262"/>`, `translate(${x},${y}) scale(${sc})`); } } s += `<rect width="${W}" height="${H}" fill="#c9a24a" opacity=".06"/>`; s += g(`<rect x="-400" y="-150" width="800" height="300" rx="24" fill="#0b0d10" opacity=".9" stroke="#c9a24a" stroke-width="4"/>` + txt(0, -80, 'UNIVERSIDADE DE MANCHESTER · 2008', 30, '#9aa6ae', { ls: 2 }) + txt(0, 20, `${Math.floor(lerp(0, 400000, easeOut(seg(p, .1, .6)))).toLocaleString('pt-BR')}`, 110, '#ffc928', { w: 900 }) + txt(0, 100, 'FARMERS DE OURO · US$ 145/MÊS', 36, '#ffffff', { ls: 2, op: seg(p, .5, .7) }), 'translate(540,330)'); return s + grain(Math.floor(t * 24), .08) + vignette(true); } },
  // 11 Vida real: R$37 e aluguel atrasado
  { k: 'na vida real', z: [1.0, 1.08], c: [540, 900], f: (t, p) => room(t) + bust({ x: 380, y: 1260, s: 1.7, ...REAL_CAIO, eyes: 'dot', mouth: 'flat', brows: 'sad', breath: t, blink: (t % 3) < .12 }) + g(`<rect x="-180" y="-230" width="360" height="460" fill="#f6f4ef" filter="url(#sh)"/>` + txt(0, -150, 'ALUGUEL', 50, '#3a4a5a', { ls: 4 }) + [...Array(4)].map((_, i) => `<rect x="-130" y="${-100 + i * 44}" width="${200 + (i * 37) % 60}" height="14" rx="7" fill="#d6dde2"/>`).join('') + g(`<rect x="-160" y="-50" width="320" height="100" rx="10" fill="none" stroke="#c22" stroke-width="10"/>` + txt(0, 20, 'ATRASADO', 60, '#c22', { w: 900 }), 'translate(0,140) rotate(-10)'), `translate(800,${lerp(1100, 980, easeOut(seg(p, .1, .4)))}) rotate(6)`) + vignette() },
  // 12 Alvo: Coroa Negra
  { k: 'hoje o alvo', z: [1.0, 1.1], f: (t, p) => { let s = `<rect width="${W}" height="${H}" fill="#08090b"/><ellipse cx="540" cy="820" rx="460" ry="460" fill="#c9a24a" opacity=".15" filter="url(#b60)"/>`; s += crownEmblem(540, 640, lerp(1.4, 1.7, easeOut(p))); s += txt(540, 1010, 'COROA NEGRA', 96, '#c9a24a', { w: 900, ls: 8, op: seg(p, .2, .4) }); return s + vignette(true); } },
  // 13 A guilda mais rica
  { k: 'a guilda mais', z: [1.0, 1.06], f: (t, p) => { let s = `<rect width="${W}" height="${H}" fill="#08090b"/>`; s += g(`<rect x="-380" y="-60" width="760" height="120" rx="20" fill="#121418" stroke="#c9a24a" stroke-width="4"/>` + txt(0, 22, 'RANKING · SERVIDOR SUL', 44, '#c9a24a', { ls: 3 }), 'translate(540,300)'); [['1', 'COROA NEGRA', 'R$ 2.400.000'], ['2', 'LOBOS DO NORTE', 'R$ 610.000'], ['3', 'ORDEM DE PRATA', 'R$ 330.000']].forEach(([n, nm, v], i) => { s += g(`<rect x="-400" y="-70" width="800" height="140" rx="20" fill="${i ? '#16181d' : '#2a2210'}" stroke="${i ? '#33373c' : '#c9a24a'}" stroke-width="4"/>` + txt(-330, 22, n, 70, i ? '#9aa6ae' : '#ffc928', { w: 900 }) + txt(-250, 0, nm, 44, '#ffffff', { a: 'start' }) + txt(-250, 46, v, 34, i ? '#9aa6ae' : '#ffc928', { a: 'start', fam: 'NU' }), `translate(540,${520 + i * 180})`, `opacity="${seg(p, i * .12, i * .12 + .2)}"`); }); return s + vignette(true); } },
  // 14 Cinco jogadores nível 80
  { k: 'cinco jogadores', z: [1.06, 1.0], c: [540, 1300], f: (t, p) => { let s = gameMeadow(t, { dusk: false, seed: 9 }) + `<rect width="${W}" height="${H}" fill="#000" opacity=".15"/>`; [[140, '#22252b', 'flip'], [330, '#2a2018'], [540, '#121418'], [750, '#2a2018', 'flip'], [940, '#22252b']].forEach(([x, c, f], i) => { s += guildMember(x, 1700 - (i === 2 ? 40 : 0), i === 2 ? .95 : .82, t + i, c, { flip: f === 'flip', armR: -20 - i * 5 }); }); s += g(`<rect x="-200" y="-50" width="400" height="100" rx="16" fill="#0b0d10" opacity=".85" stroke="#c9a24a" stroke-width="3"/>` + txt(0, 20, 'NÍVEL 80', 60, '#c9a24a', { ls: 4 }), 'translate(540,260)'); return s + gameFG(t) + vignette(); } },
  // 15 40 minutos contra o dragão de pedra
  { k: 'faz quarenta', z: [1.08, 1.0], c: [540, 1200], f: (t, p) => { let s = gameMeadow(t, { dusk: true, seed: 12 }); s += stoneDragon(540, 1450, 1.0, t); const r = rng(15); for (let i = 0; i < 6; i++) { const fl = (t * 2 + i / 6) % 1; s += `<circle cx="${200 + r() * 680}" cy="${1300 - fl * 400}" r="${20 + 30 * fl}" fill="${['#ff7a2a', '#ffd24a', '#7fd6ff'][i % 3]}" opacity="${1 - fl}" filter="url(#glow)"/>`; } [[160, '#22252b'], [330, '#2a2018'], [760, '#121418'], [930, '#22252b']].forEach(([x, c], i) => { s += guildMember(x, 1800, .62, t + i, c, { flip: x > 540, armR: -80 + 60 * Math.sin(t * 6 + i) }); }); s += g(`<rect x="-160" y="-50" width="320" height="100" rx="16" fill="#0b0d10" opacity=".85"/>` + txt(0, 20, `${40 + Math.floor(t)}:${String(Math.floor((t * 60) % 60)).padStart(2, '0')}`, 60, '#ff7a6a', { w: 900 }), 'translate(540,240)'); return s + gameFG(t, true) + vignette(); } },
  // 16 Caio espera no mato (POV do mato)
  { k: 'caio espera', z: [1.0, 1.08], c: [540, 1100], f: (t, p) => { let s = `<g filter="url(#b5)">${gameMeadow(t, { dusk: true, seed: 12 })}${stoneDragon(540, 1300, .6, t)}</g>`; s += bushes(t, 300, true).replace(/<circle/g, '<circle opacity=".95"') + bushes(t + 4, 1750, true); s += g(headG({ ...THIEF, eyes: 'dot', brows: 'serious', look: -8 }), 'translate(860,1660) scale(1.7)'); return s + vignette(true); } },
  // 17 Sem se mexer (close)
  { k: 'sem se mexer', z: [1.0, 1.12], c: [540, 900], f: (t, p) => `<g filter="url(#b18)">${gameMeadow(t, { dusk: true })}</g>` + bust({ x: 540, y: 1050, s: 2.7, ...THIEF, eyes: 'dot', brows: 'serious', blink: false }) + bushes(t, 1700, true) + `<path d="M700,780 q8,24 0,40" stroke="#9fd6ff" stroke-width="6" fill="none" opacity=".8"/>` + vignette(true) },
  // ===== LUTA ESTENDIDA (sem narração, ~14 s de suspense) =====
  // L1 Rugido do dragão
  { gap: 0, z: [1.15, 1.25], c: [540, 900], f: (t, p) => { const sh = Math.sin(t * 60) * 10 * (1 - p); let s = gameMeadow(t, { dusk: true, seed: 12 }) + `<rect width="${W}" height="${H}" fill="#2a0a00" opacity=".25"/>`; s += g(stoneDragon(0, 0, 1.6, t), `translate(${540 + sh},${1700 + sh})`); for (let i = 0; i < 3; i++) { const rr = ((p * 1.5 + i / 3) % 1); s += `<circle cx="540" cy="1000" r="${100 + rr * 700}" fill="none" stroke="#ffb27a" stroke-width="${14 * (1 - rr)}" opacity="${1 - rr}"/>`; } return s + gameFG(t, true) + vignette(true); } },
  // L2 Guilda ataca, HP 18% -> 12%
  { gap: 1, z: [1.0, 1.06], c: [540, 1200], f: (t, p) => { let s = gameMeadow(t, { dusk: true, seed: 12 }); s += stoneDragon(560, 1400, .95, t); const r = rng(22); for (let i = 0; i < 8; i++) { const ph = (t * 3 + i / 8) % 1; s += `<path d="M${300 + r() * 500},${1000 + r() * 400} l${60 + 80 * ph},${-40 - 60 * ph}" stroke="#fff4c8" stroke-width="${10 * (1 - ph)}" stroke-linecap="round" filter="url(#glow)" opacity="${1 - ph}"/>`; } [[180, '#22252b', -110], [360, '#2a2018', -60], [760, '#121418', -120], [920, '#22252b', -70]].forEach(([x, c, a], i) => { s += guildMember(x, 1820, .62, t + i, c, { flip: x > 540, armR: a + 60 * Math.sin(t * 9 + i) }); }); s += bossBar(lerp(.18, .12, ease(p)), t); return s + gameFG(t, true) + vignette(); } },
  // L3 Cauda arremessa um cavaleiro
  { gap: 2, z: [1.05, 1.0], c: [540, 1200], f: (t, p) => { let s = gameMeadow(t, { dusk: true, seed: 12 }); s += g(stoneDragon(0, 0, .95, t), `translate(560,1400) rotate(${Math.sin(p * Math.PI) * -6})`); const fly = easeOut(seg(p, .15, .8)); s += g(guildMember(0, 0, .62, t, '#2a2018', { eyes: 'wide', mouth: 'o', brows: 'up' }), `translate(${lerp(820, 1180, fly)},${lerp(1820, 1300, fly) + fly * fly * 300}) rotate(${fly * 120})`); s += popup(820, lerp(1300, 1100, fly), '-2.430', seg(p, .15, .3) * (1 - seg(p, .8, 1)), 110, '#ff5d5d'); s += bossBar(.12, t); return s + gameFG(t, true) + vignette(); } },
  // L4 Caio no mato: mão tremendo, batimento
  { gap: 3, z: [1.0, 1.15], c: [540, 1000], f: (t, p) => { const beat = Math.pow(Math.max(0, Math.sin(t * 8)), 8); let s = `<g filter="url(#b18)">${gameMeadow(t, { dusk: true })}</g>` + bushes(t, 300, true); s += bust({ x: 420, y: 1150, s: 2.2, ...THIEF, eyes: 'dot', brows: 'serious', look: 14 }); s += hand(830 + Math.sin(t * 40) * 4, 1500, 1.6, -20, { glove: true, sleeve: '#2f5f6a' }); s += bushes(t + 5, 1800, true); s += `<rect width="${W}" height="${H}" fill="url(#vigS)" opacity="${.4 + .5 * beat}"/><rect width="${W}" height="${H}" fill="#ff1a1a" opacity="${.08 * beat}"/>`; return s; } },
  // L5 HP 5%... 3%
  { gap: 4, z: [1.0, 1.2], c: [540, 400], f: (t, p) => { let s = `<g filter="url(#b10)">${gameMeadow(t, { dusk: true, seed: 12 })}${stoneDragon(540, 1400, .95, t)}</g><rect width="${W}" height="${H}" fill="#000" opacity=".4"/>`; s += bossBar(p < .5 ? .05 : .03, t, true); s += txt(540, 760, `${p < .5 ? 5 : 3}%`, 260, '#ff3a3a', { w: 900, extra: `stroke="#000" stroke-width="16" paint-order="stroke" filter="url(#glow)" opacity="${.6 + .4 * Math.abs(Math.sin(t * 10))}"` }); return s + vignette(true); } },
  // L6 Golpe final em câmera lenta
  { gap: 5, z: [1.0, 1.08], c: [540, 1000], f: (t, p) => { let s = gameMeadow(t * .2, { dusk: true, seed: 12 }) + `<rect width="${W}" height="${H}" fill="#1a0a20" opacity=".35"/>`; s += stoneDragon(760, 1500, .8, t * .2); s += fullBody({ x: 380, y: lerp(1750, 1450, easeOut(p)), s: 1.15, top: '#121418', legs: '#1a1c22', armR: -170, armL: -150, item: `<g transform="translate(0,250) rotate(180)"><path d="M-22,54 L22,54 L12,560 L0,600 L-12,560Z" fill="#fff8d8" filter="url(#glow2)"/><rect x="-50" y="36" width="100" height="20" rx="6" fill="#c9a24a"/></g>`, head: { hair: 'marina', hairCol: '#14110f', eyes: 'dot', brows: 'angry', mouth: 'open' } }, t * .2); const r = rng(26); for (let i = 0; i < 30; i++) s += `<circle cx="${r() * W}" cy="${(r() * H - t * 30 + H) % H}" r="${3 + r() * 5}" fill="#fff4c8" opacity=".7"/>`; return s + gameFG(t * .2, true) + vignette(true); } },
  // L7 1%... a mão avança... clarão
  { gap: 6, z: [1.0, 1.25], c: [540, 1300], f: (t, p) => { if (p > .9) return `<rect width="${W}" height="${H}" fill="#fff"/>`; let s = `<g filter="url(#b5)">${gameMeadow(t, { dusk: true, seed: 12 })}${stoneDragon(540, 1250, .7, t)}</g>` + bushes(t, 1750, true); s += hand(540, lerp(2100, 1650, easeOut(seg(p, .2, .8))), 1.8, 0, { glove: true, sleeve: '#2f5f6a' }); s += bossBar(.01, t, true); s += `<rect width="${W}" height="${H}" fill="#fff" opacity="${seg(p, .75, .9)}"/>`; return s + vignette(true); } },
  // 18 O dragão cai
  { k: 'o dragão cai', z: [1.0, 1.06], c: [540, 1300], f: (t, p) => { const fp = easeIn(seg(p, 0, .6)); let s = gameMeadow(t, { dusk: true, seed: 12 }); s += g(stoneDragon(0, 0, 1.0, t, { fall: fp, dead: fp > .9 }), `translate(${540 + (p > .55 && p < .7 ? Math.sin(t * 70) * 8 : 0)},1450)`); if (p > .55) { const dp = seg(p, .55, 1); const r = rng(18); for (let i = 0; i < 20; i++) s += `<circle cx="${540 + (r() - .5) * 900 * dp}" cy="${1450 - r() * 300 * dp}" r="${40 + r() * 60}" fill="#b8a890" opacity="${(1 - dp) * .6}" filter="url(#b10)"/>`; } return s + gameFG(t, true) + vignette(); } },
  // 19 Baú dourado
  { k: 'um baú', z: [1.0, 1.1], c: [540, 1300], f: (t, p) => { let s = gameMeadow(t, { dusk: true, seed: 12 }); s += `<path d="M440,0 L640,0 L700,1400 L380,1400Z" fill="#ffd24a" opacity="${.18 * seg(p, 0, .3)}" filter="url(#b18)"/>`; s += chest(540, 1420, 1.3 * easeOut(seg(p, 0, .35)) + .01, t); return s + gameFG(t, true) + vignette(); } },
  // 20 Coração de Rubi
  { k: 'dentro coração', z: [1.0, 1.08], c: [540, 860], f: (t, p) => `<g filter="url(#b10)">${gameMeadow(t, { dusk: true })}</g><rect width="${W}" height="${H}" fill="#000" opacity=".4"/>` + chest(540, 1500, 1.4, t, 1) + ruby(540, lerp(1300, 820, easeOut(seg(p, 0, .5))), 1.6, t) + vignette(true) },
  // 21 Valor R$3.200
  { k: 'três mil e', z: [1.0, 1.06], c: [540, 860], f: (t, p) => `<g filter="url(#b10)">${gameMeadow(t, { dusk: true })}</g><rect width="${W}" height="${H}" fill="#000" opacity=".45"/>` + ruby(540, 680, 1.2, t) + g(`<rect x="-300" y="-80" width="600" height="160" rx="24" fill="#0b0d10" opacity=".9" stroke="#ffc928" stroke-width="5"/>` + txt(0, -14, 'VALOR DE MERCADO', 30, '#9aa6ae', { ls: 4 }) + txt(0, 54, `R$ ${Math.floor(lerp(0, 3200, easeOut(seg(p, .1, .7)))).toLocaleString('pt-BR')}`, 76, '#ffc928', { w: 900 }), 'translate(540,980)') + vignette(true) },
  // 22 Um. Dois.
  { k: 'um dois', z: [1.0, 1.12], c: [540, 1100], f: (t, p) => { let s = `<g filter="url(#b5)">${gameMeadow(t, { dusk: true, seed: 12 })}</g>` + chest(540, 1150, .9, t, 1) + bushes(t, 1750, true); s += hand(540, lerp(2100, 1720, easeOut(seg(p, 0, .4))), 1.8, 0, { glove: true, sleeve: '#2f5f6a' }); s += txt(540, 700, p < .5 ? '1' : '2', 300, '#ffffff', { w: 900, extra: `stroke="#000" stroke-width="18" paint-order="stroke" opacity="${1 - ((p * 2) % 1) * .6}"` }); return s + vignette(true); } },
  // 23 Mão Leve!
  { k: 'mão leve', z: [1.05, 1.0], c: [540, 1300], f: (t, p) => { const pp = easeIn(seg(p, .1, .6)); let s = gameMeadow(t, { dusk: true, seed: 12 }); s += `<rect width="${W}" height="${H}" fill="#ffd24a" opacity="${.35 * (1 - seg(p, 0, .15))}"/>`; s += chest(lerp(800, 160, pp), lerp(1350, 1750, pp), lerp(1, .4, pp), t, 1); s += pullLine(140, 1780, 800, 1350, 1); s += bushes(t, 1800, true); s += txt(540, 640, 'MÃO LEVE!', 130, '#ffd24a', { w: 900, extra: 'stroke="#2a1c00" stroke-width="14" paint-order="stroke" filter="url(#glow)"', op: 1 - seg(p, .7, 1) }); return s + vignette(); } },
  // 24 O baú some (guilda confusa)
  { k: 'o baú some', z: [1.0, 1.06], c: [540, 1300], f: (t, p) => { let s = gameMeadow(t, { dusk: true, seed: 12 }); s += `<ellipse cx="540" cy="1460" rx="${120 + 200 * seg(p, 0, .4)}" ry="40" fill="#ffd24a" opacity="${.6 * (1 - seg(p, 0, .4))}" filter="url(#b10)"/>`; [[200, '#22252b', 0], [880, '#2a2018', 1]].forEach(([x, c, f]) => { s += guildMember(x, 1780, .85, t, c, { flip: !!f, eyes: 'wide', mouth: 'o', brows: 'up' }); }); s += txt(200, 1000, '?', 140, '#fff', { w: 900, extra: 'stroke="#000" stroke-width="10" paint-order="stroke"' }) + txt(880, 1000, '?!', 140, '#fff', { w: 900, extra: 'stroke="#000" stroke-width="10" paint-order="stroke"' }); return s + gameFG(t, true) + vignette(); } },
  // 25 Celular vibra +R$3.200
  { k: 'o celular vibra', z: [1.0, 1.08], f: (t, p) => { const vib = p > .1 && p < .6 ? Math.sin(t * 90) * 8 : 0; return room(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".4"/>` + g(phone(0, 0, 2.4, 0, `<rect x="-106" y="-212" width="212" height="424" rx="26" fill="#0f1a14"/><circle cx="0" cy="-110" r="40" fill="#32bcad"/>` + txt(0, -98, 'PIX', 24, '#fff') + txt(0, -20, 'PIX RECEBIDO', 22, '#9fe3d0') + txt(0, 40, '+R$ 3.200,00', 34, '#ffffff', { w: 900 })), `translate(${540 + vib},880) rotate(${vib * .3})`) + vignette(); } },
  // V2: Aluguel pago
  { k: 'aluguel pago', z: [1.0, 1.06], f: (t, p) => room(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".3"/>` + g(`<rect x="-260" y="-340" width="520" height="680" fill="#f6f4ef" filter="url(#sh)"/>` + txt(0, -240, 'ALUGUEL', 70, '#3a4a5a', { ls: 6 }) + [...Array(5)].map((_, i) => `<rect x="-190" y="${-170 + i * 54}" width="${280 + (i * 37) % 80}" height="18" rx="9" fill="#d6dde2"/>`).join('') + g(`<rect x="-220" y="-70" width="440" height="140" rx="14" fill="none" stroke="#2a9a50" stroke-width="14"/>` + txt(0, 40, 'PAGO', 120, '#2a9a50', { w: 900, ls: 10 }), `translate(0,170) rotate(-12) scale(${lerp(2.2, 1, easeOut(seg(p, .1, .35)))})`, `opacity="${Math.min(1, seg(p, .1, .2) * 3) * .9}"`), 'translate(540,760)') + vignette() },
  // 26 Caio sorri
  { k: 'pela primeira', z: [1.0, 1.1], c: [540, 860], f: (t, p) => room(t) + bust({ x: 540, y: 1100, s: 2.7, ...REAL_CAIO, eyes: 'dot', mouth: p > .3 ? 'smile' : 'flat', brows: 'neutral', breath: t }) + `<rect width="${W}" height="${H}" fill="#ffd24a" opacity=".06"/>` + vignette() },
  // 27 Chega uma mensagem
  { k: 'aí chega', z: [1.0, 1.06], f: (t, p) => `<g filter="url(#b10)">${gameMeadow(t, { dusk: true, seed: 12 })}</g><rect width="${W}" height="${H}" fill="#000" opacity=".45"/>` + g(chatBox(0, 0, 1, 'NOVA MENSAGEM', '...', 3), `translate(540,${lerp(-200, 760, easeOut(seg(p, 0, .3)))})`) + vignette(true) },
  // 28 Da líder da Coroa Negra
  { k: 'da líder', z: [1.0, 1.1], c: [540, 860], f: (t, p) => { let s = `<rect width="${W}" height="${H}" fill="#08090b"/><ellipse cx="540" cy="900" rx="500" ry="600" fill="#c9a24a" opacity=".1" filter="url(#b60)"/>`; s += bust({ x: 540, y: 1080, s: 2.4, hair: 'marina', hairCol: '#14110f', top: '#121418', outfit: 'coat', eyes: 'dot', mouth: 'smile', brows: 'serious' }); s += g(`<path d="M-90,0 L-100,-80 L-50,-40 L0,-110 L50,-40 L100,-80 L90,0Z" fill="#c9a24a" stroke="#8a6a1a" stroke-width="6"/>`, 'translate(540,770) scale(1.6)'); return s + vignette(true); } },
  // 29 "Bom roubo. Agora olha pra trás."
  { k: 'bom roubo', z: [1.0, 1.08], f: (t, p) => { const msg = 'Bom roubo. Agora olha pra trás.'; return `<g filter="url(#b10)">${gameMeadow(t, { dusk: true, seed: 12 })}</g><rect width="${W}" height="${H}" fill="#000" opacity=".5"/>` + chatBox(540, 760, 1, 'LÍDER · COROA NEGRA', msg, Math.ceil(seg(p, 0, .8) * msg.length)) + vignette(true); } },
  // 30 Caio olha
  { k: 'caio olha', z: [1.0, 1.15], c: [540, 900], f: (t, p) => `<g filter="url(#b18)">${gameMeadow(t, { dusk: true })}</g>` + g(bust({ x: 0, y: 0, s: 2.7, ...THIEF, eyes: 'wide', brows: 'up', look: lerp(0, -16, easeOut(p)) }), `translate(540,1050) scale(${lerp(1, -1, easeOut(seg(p, .2, .5))) || .01},1)`) + vignette(true) },
  // 31 Agachado no mato, outro jogador
  { k: 'agachado no', z: [1.06, 1.0], c: [540, 1200], f: (t, p) => { let s = `<g filter="url(#b5)">${gameMeadow(t, { dusk: true, seed: 3 })}</g>` + `<rect width="${W}" height="${H}" fill="#000" opacity=".35"/>` + bushes(t, 1300, true); s += g(headG({ ...THIEF, eyes: 'dot', brows: 'serious' }), `translate(540,${lerp(1500, 1260, easeOut(seg(p, .1, .6)))}) scale(1.7)`); s += `<circle cx="505" cy="1250" r="14" fill="#ff3a3a" opacity="${seg(p, .5, .7)}" filter="url(#glow)"/><circle cx="575" cy="1250" r="14" fill="#ff3a3a" opacity="${seg(p, .5, .7)}" filter="url(#glow)"/>`; s += bushes(t + 3, 1650, true); return s + vignette(true); } },
  // 32 Mesma roupa, mesma classe
  { k: 'a mesma roupa', z: [1.0, 1.05], c: [540, 1200], f: (t, p) => { let s = gameMeadow(t, { dusk: true, seed: 4 }) + `<rect width="${W}" height="${H}" fill="#000" opacity=".3"/>`; s += fullBody({ x: 290, y: 1720, s: 1.05, top: '#2f5f6a', legs: '#1f2a2e', item: KNIFE, armR: -15, head: { ...THIEF, eyes: 'wide', brows: 'up', look: 10 } }, t); s += fullBody({ x: 790, y: 1720, s: 1.05, top: '#2f5f6a', legs: '#1f2a2e', item: KNIFE, armR: -15, flip: true, head: { ...THIEF, eyes: 'dot', brows: 'serious', look: 10 } }, t + .5); s += g(`<rect x="-180" y="-44" width="360" height="88" rx="14" fill="#0b0d10" opacity=".85"/>` + txt(0, 16, 'LADRÃO · NV 12', 38, '#7fd6e6'), 'translate(290,880)') + g(`<rect x="-180" y="-44" width="360" height="88" rx="14" fill="#0b0d10" opacity=".85"/>` + txt(0, 16, 'LADRÃO · NV 12', 38, '#7fd6e6'), 'translate(790,880)', `opacity="${seg(p, .3, .5)}"`); return s + gameFG(t, true) + vignette(true); } },
  // 33 O mesmo nome
  { k: 'o mesmo nome', z: [1.0, 1.12], c: [540, 820], f: (t, p) => { const gl = (Math.floor(t * 14) % 5 === 0) ? 1 : 0; let s = `<rect width="${W}" height="${H}" fill="#08090b"/>`; for (let i = 0; i < 2; i++) s += g(`<rect x="-380" y="-80" width="760" height="160" rx="22" fill="#0b0d10" stroke="#ff3a3a" stroke-width="6"/>` + txt(0, 26, 'CaioLadrão_07', 80, '#ffffff', { w: 900 }), `translate(${540 + (i ? gl * 14 : 0)},${640 + i * 300})`, `opacity="${i ? seg(p, .2, .4) : 1}"`); s += `<rect y="${600 + gl * 300}" width="${W}" height="20" fill="#ff3a3a" opacity="${gl * .5}"/>`; return s + vignette(true); } },
  // V2: "E ele também está sorrindo."
  { k: 'e ele também', z: [1.0, 1.2], c: [540, 900], f: (t, p) => { let s = `<rect width="${W}" height="${H}" fill="#050506"/>` + bushes(t, 1500, true); s += bust({ x: 540, y: 1050, s: 2.8, ...THIEF, eyes: 'closed', brows: 'up' }); s += `<circle cx="474" cy="905" r="13" fill="#ff3a3a" filter="url(#glow)" opacity="${seg(p, .1, .3)}"/><circle cx="606" cy="905" r="13" fill="#ff3a3a" filter="url(#glow)" opacity="${seg(p, .1, .3)}"/>`; s += `<path d="M430,1010 Q540,${1010 + 40 * seg(p, .3, .7)} 650,1010" stroke="#4a8a96" stroke-width="10" fill="none" opacity="${seg(p, .3, .5)}"/>`; return s + vignette(true); } },
  // V2: Comenta A (encarar o clone)
  { k: 'comenta a', z: [1, 1], f: (t, p) => abSide(t, 'A') + vignette(true) },
  // V2: ou B (fugir com o dinheiro)
  { k: 'ou b se', z: [1, 1], f: (t, p) => { const sp = easeOut(seg(p, 0, .25)), half = W / 2; let s = `<defs><clipPath id="cA"><rect x="0" y="0" width="${lerp(W, half, sp)}" height="${H}"/></clipPath><clipPath id="cB"><rect x="${lerp(W, half, sp)}" y="0" width="${W}" height="${H}"/></clipPath></defs>`; s += `<g clip-path="url(#cA)">${g(abSide(t, 'A'), `translate(${lerp(0, -270, sp)},0)`)}</g><g clip-path="url(#cB)">${g(abSide(t, 'B'), `translate(${lerp(540, 270, sp)},0)`)}</g><rect x="${lerp(W, half, sp) - 5}" y="0" width="10" height="${H}" fill="#fff"/>`; return s + vignette(); } },
];

// javali (monstro comum do campo)
function boar(x, y, s, t) {
  const b = 1 + .02 * Math.sin(t * 5);
  let d = `<ellipse cx="0" cy="6" rx="190" ry="24" fill="#000" opacity=".25" filter="url(#b5)"/>`;
  for (const lx of [-110, -40, 60, 120]) d += `<rect x="${lx - 16}" y="-90" width="32" height="96" rx="10" fill="#4a3226"/>`;
  d += `<ellipse cx="0" cy="-130" rx="170" ry="${100 * b}" fill="#6b4a36"/><path d="M-120,-200 l10,-30 l15,24 l12,-34 l16,30 l14,-28 l14,30" fill="#3a2a20"/>`;
  d += `<ellipse cx="-160" cy="-120" rx="70" ry="60" fill="#7a5640"/><ellipse cx="-220" cy="-104" rx="30" ry="24" fill="#c98a7a"/><circle cx="-228" cy="-104" r="5" fill="#3a2a20"/><circle cx="-212" cy="-104" r="5" fill="#3a2a20"/>`;
  d += `<path d="M-196,-86 q-20,-6 -26,-34" stroke="#f2ead8" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="-150" cy="-150" r="10" fill="#1a1210"/><path d="M-130,-178 l20,-26 l6,30Z" fill="#5a3a2a"/>`;
  return g(d, `translate(${x},${y}) scale(${s})`);
}

// barra de vida do chefe
function bossBar(hp, t, danger) {
  const flick = danger ? (.6 + .4 * Math.abs(Math.sin(t * 12))) : 1;
  return g(`<rect x="-440" y="-70" width="880" height="140" rx="20" fill="#0b0d10" opacity=".85" stroke="#c9a24a" stroke-width="4"/>` + txt(-410, -16, 'DRAGÃO DE PEDRA · CHEFE', 34, '#c9a24a', { a: 'start', ls: 2 }) + txt(410, -16, `${Math.max(1, Math.round(hp * 100))}%`, 38, '#ff5d5d', { a: 'end', w: 900 }) + `<rect x="-410" y="10" width="820" height="30" rx="15" fill="#33373c"/><rect x="-410" y="10" width="${820 * hp}" height="30" rx="15" fill="#ff3a3a" opacity="${flick}"/>`, 'translate(540,230)');
}

// lados A e B do final
function abSide(t, side) {
  if (side === 'A') {
    let A = gameMeadow(t, { dusk: true, seed: 4 }) + `<rect width="${W}" height="${H}" fill="#000" opacity=".35"/>`;
    A += fullBody({ x: 330, y: 1720, s: 1.0, top: '#2f5f6a', legs: '#1f2a2e', item: KNIFE, armR: -70, head: { ...THIEF, eyes: 'dot', brows: 'angry', look: 10 } }, t);
    A += fullBody({ x: 760, y: 1720, s: 1.0, top: '#2f5f6a', legs: '#1f2a2e', item: KNIFE, armR: -70, flip: true, head: { ...THIEF, eyes: 'closed', brows: 'up', look: 10 } }, t + .5) + `<circle cx="737" cy="1080" r="9" fill="#ff3a3a" filter="url(#glow)"/><circle cx="783" cy="1080" r="9" fill="#ff3a3a" filter="url(#glow)"/>`;
    return A + txt(540, 640, 'A', 380, '#ffffff', { w: 900, extra: 'stroke="#000" stroke-width="16" paint-order="stroke"' });
  }
  let B = room(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".25"/>`;
  B += fullBody({ x: 540, y: 1760, s: 1.1, top: '#c99a2e', legs: '#2a2f38', walk: true, armR: -30, armL: 30, head: { ...REAL_CAIO, eyes: 'wide', brows: 'up' } }, t * 1.8);
  const r = rng(77); for (let i = 0; i < 8; i++) B += coin(380 + r() * 320, 1500 - ((t * 300 + i * 120) % 600), .6, t * 200);
  return B + txt(540, 640, 'B', 380, '#ffc928', { w: 900, extra: 'stroke="#000" stroke-width="16" paint-order="stroke"' });
}
