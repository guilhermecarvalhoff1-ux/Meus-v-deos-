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
const PART = { words: 'words5.json', end: 102.4, abTime: 92.3, gap: { key: 'o dragão cai', dur: 7 },
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

// =====================================================================
// DRAGÃO DE PEDRA v2 + LUTA MELHORADA
// =====================================================================
const DRAGON_DEFS = `
<linearGradient id="rk1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9aa0a8"/><stop offset=".55" stop-color="#6d737c"/><stop offset="1" stop-color="#454a52"/></linearGradient>
<linearGradient id="rk2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7e848d"/><stop offset="1" stop-color="#3f444b"/></linearGradient>
<linearGradient id="wingG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8a9098" stop-opacity=".95"/><stop offset="1" stop-color="#4c5159" stop-opacity=".95"/></linearGradient>
<radialGradient id="lavaG" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff2b0"/><stop offset=".4" stop-color="#ffb02e"/><stop offset="1" stop-color="#ff4a10" stop-opacity="0"/></radialGradient>
<linearGradient id="fireG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff4c0"/><stop offset=".3" stop-color="#ffc23a"/><stop offset=".7" stop-color="#ff6a1a"/><stop offset="1" stop-color="#ff2a0a" stop-opacity="0"/></linearGradient>`;
function rockPoly(pts, fill = 'url(#rk1)', edge = '#2e3238') {
  return `<path d="M${pts.map(p => p.join(',')).join(' L')}Z" fill="${fill}" stroke="${edge}" stroke-width="5" stroke-linejoin="round"/>`;
}
function lava(d, t, k = 1) {
  const pulse = .6 + .4 * Math.sin(t * 4 + k);
  return `<path d="${d}" stroke="#ff7a1a" stroke-width="12" fill="none" stroke-linecap="round" opacity="${pulse * .9}" filter="url(#glow)"/><path d="${d}" stroke="#ffe08a" stroke-width="4" fill="none" stroke-linecap="round" opacity="${pulse}"/>`;
}
// dragão com pés em (0,0). opts: roar 0..1 (boca aberta), fire 0..1 (bafo), fall 0..1, dead, wing (batida)
function stoneDragon(x, y, s, t, opts = {}) {
  const roar = opts.roar || 0, fall = opts.fall || 0, dead = opts.dead || fall > .85;
  const wing = opts.wing != null ? opts.wing : Math.sin(t * 2.2) * 14;
  const br = 1 + .02 * Math.sin(t * 2);
  const eye = dead ? '#3a3a3a' : '#ffb02e';
  let d = `<defs>${DRAGON_DEFS}</defs>`;
  d += `<ellipse cx="0" cy="12" rx="${460 + fall * 120}" ry="50" fill="#000" opacity=".35" filter="url(#b10)"/>`;
  // asas (atrás)
  const wingL = g(`<path d="M0,0 L-520,-380 L-440,-120 L-560,-160 L-400,40 L-500,60 L-260,120Z" fill="url(#wingG)" stroke="#2e3238" stroke-width="6" stroke-linejoin="round"/><path d="M0,0 L-520,-380 M0,0 L-560,-160 M0,0 L-500,60" stroke="#3a3f46" stroke-width="16" stroke-linecap="round"/>`, `translate(-120,-420) rotate(${-wing - fall * 30})`);
  const wingR = g(`<path d="M0,0 L520,-380 L440,-120 L560,-160 L400,40 L500,60 L260,120Z" fill="url(#wingG)" stroke="#2e3238" stroke-width="6" stroke-linejoin="round" opacity=".9"/><path d="M0,0 L520,-380 M0,0 L560,-160 M0,0 L500,60" stroke="#3a3f46" stroke-width="16" stroke-linecap="round"/>`, `translate(140,-430) rotate(${wing + fall * 30})`);
  let body = wingL + wingR;
  // cauda com espinhos
  body += `<path d="M200,-120 C380,-100 480,-40 560,-120 C600,-160 640,-150 660,-110" stroke="#5a5f67" stroke-width="70" fill="none" stroke-linecap="round"/>` + [0, 1, 2].map(i => rockPoly([[300 + i * 110, -170 + i * 10], [330 + i * 110, -240 + i * 10], [360 + i * 110, -160 + i * 10]], '#4c5159')).join('');
  // pernas traseiras e dianteiras com garras
  for (const [lx, sc] of [[150, 1], [-170, 1.05]]) body += g(rockPoly([[-60, -220], [60, -220], [70, -60], [40, 0], [-50, 0], [-70, -60]], 'url(#rk2)') + rockPoly([[-70, -10], [-90, 20], [-40, 10]], '#d8d2c0') + rockPoly([[-20, -6], [-20, 26], [10, 4]], '#d8d2c0') + rockPoly([[30, -6], [40, 24], [60, 0]], '#d8d2c0'), `translate(${lx},0) scale(${sc})`);
  // corpo (blocos)
  body += rockPoly([[-300, -160], [-260, -380], [-80, -470], [160, -450], [320, -330], [330, -150], [160, -90], [-150, -90]]);
  body += rockPoly([[-260, -380], [-80, -470], [-40, -330], [-200, -280]], '#a3a9b1');
  body += rockPoly([[-80, -470], [160, -450], [100, -320], [-40, -330]], '#8c929a');
  body += rockPoly([[-200, -280], [-40, -330], [100, -320], [160, -170], [-160, -150]], '#5f646c');
  body += [[-200, -470], [-110, -500], [-10, -505], [90, -490]].map(([px, py]) => rockPoly([[px - 30, py + 40], [px, py - 40], [px + 30, py + 40]], '#4a4f57')).join('');
  body += lava('M-180,-250 L-120,-210 L-60,-240 L0,-190', t, 1) + lava('M60,-380 L110,-330 L170,-350', t, 2) + lava('M-60,-140 L0,-170 L60,-130', t, 3);
  // pescoço + cabeça
  const hx = -330, hy = -560 + fall * 400;
  body += `<path d="M-180,-380 C-260,-450 -290,-520 ${hx + 40},${hy + 40}" stroke="#6a7078" stroke-width="120" fill="none" stroke-linecap="round"/>` + [0, 1, 2, 3].map(i => { const u = i / 4; return rockPoly([[-190 - u * 140 - 30, -420 - u * 150], [-190 - u * 140, -480 - u * 150], [-190 - u * 140 + 30, -420 - u * 150]], '#4a4f57'); }).join('');
  const jaw = roar * 28;
  let head = rockPoly([[60, -70], [-60, -110], [-200, -60], [-250, -10], [-200, 10], [40, 20], [90, -20]], 'url(#rk1)');
  head += g(rockPoly([[40, 20], [-200, 10], [-230, 40], [-180, 70], [20, 60]], '#5a5f67') + [0, 1, 2, 3].map(i => rockPoly([[-180 + i * 45, 14], [-170 + i * 45, -8], [-160 + i * 45, 14]], '#e8e2d0')).join(''), `rotate(${jaw},40,20)`);
  if (roar > .1) head += `<path d="M-200,12 L40,20 L20,${20 + roar * 60} L-180,${12 + roar * 70}Z" fill="url(#lavaG)" opacity="${roar}"/>`;
  head += [0, 1, 2, 3].map(i => rockPoly([[-170 + i * 45, 10], [-160 + i * 45, 32], [-150 + i * 45, 10]], '#e8e2d0')).join('');
  head += rockPoly([[0, -80], [80, -200], [120, -190], [50, -70]], '#3f444b') + rockPoly([[-50, -100], [10, -220], [40, -210], [-20, -95]], '#3f444b');
  head += `<ellipse cx="-90" cy="-60" rx="26" ry="14" fill="${eye}" ${dead ? '' : 'filter="url(#glow2)"'}/><ellipse cx="-90" cy="-60" rx="8" ry="12" fill="#2a1200" opacity="${dead ? 0 : .8}"/>`;
  head += `<circle cx="-235" cy="-20" r="8" fill="#2a1a10"/>`;
  if (opts.fire > 0) { const f = opts.fire, fl = Math.sin(t * 30) * 20; head += g(`<path d="M0,0 C200,-60 600,-120 ${900 + fl},-60 C${950 + fl},40 600,140 0,40Z" fill="url(#fireG)" opacity="${f}" filter="url(#glow)"/><path d="M0,10 C200,-20 450,-40 650,0 C450,60 200,60 0,30Z" fill="#fff6c8" opacity="${f * .8}"/>`, `translate(-240,30) scale(-1,1) rotate(${-10 + roar * 5})`); }
  body += g(head, `translate(${hx},${hy}) rotate(${-roar * 12 + fall * 40})`);
  d += g(body, `rotate(${fall * 10}) scale(1,${br * (1 - fall * .3)})`);
  // brasas flutuando
  if (!dead) { const r = rng(404); for (let i = 0; i < 14; i++) { const ph = (t * .35 + r()) % 1; d += `<circle cx="${(r() - .5) * 700}" cy="${-200 - ph * 600}" r="${3 + r() * 5}" fill="#ffb02e" opacity="${(1 - ph) * .9}" filter="url(#glow)"/>`; } }
  // desmoronando: pedras soltas
  if (fall > 0) { const r = rng(77); for (let i = 0; i < 16; i++) { const px = (r() - .5) * 700, py = -100 - r() * 400, fy = fall * fall * (400 + r() * 300); d += rockPoly([[px - 30, py + fy], [px, py - 30 + fy], [px + 34, py + 6 + fy], [px + 10, py + 30 + fy]], '#6d737c'); } }
  return g(d, `translate(${x},${y}) scale(${s})`);
}
function slashArc(cx, cy, r, a0, a1, p, col = '#ffffff') {
  if (p <= 0 || p >= 1) return '';
  const pa = a0 + (a1 - a0) * Math.min(1, p * 1.6), rad = a => a * Math.PI / 180;
  const x0 = cx + r * Math.cos(rad(a0)), y0 = cy + r * Math.sin(rad(a0)), x1 = cx + r * Math.cos(rad(pa)), y1 = cy + r * Math.sin(rad(pa));
  return `<path d="M${x0},${y0} A${r},${r} 0 0 ${a1 > a0 ? 1 : 0} ${x1},${y1}" stroke="${col}" stroke-width="${26 * (1 - p)}" fill="none" stroke-linecap="round" opacity="${1 - p}" filter="url(#glow)"/>`;
}
function sparks(cx, cy, p, seed, col = '#fff4c8') {
  if (p <= 0 || p >= 1) return '';
  const r = rng(seed); let s = `<circle cx="${cx}" cy="${cy}" r="${40 + 120 * p}" fill="#fff" opacity="${(1 - p) * .7}" filter="url(#b10)"/>`;
  for (let i = 0; i < 14; i++) { const a = r() * 6.28, d = p * (80 + r() * 220); s += `<path d="M${cx + Math.cos(a) * d * .6},${cy + Math.sin(a) * d * .6} L${cx + Math.cos(a) * d},${cy + Math.sin(a) * d}" stroke="${col}" stroke-width="6" stroke-linecap="round" opacity="${1 - p}"/>`; }
  return s;
}
function knight(x, y, s, t, opts = {}) { return guildMember(x, y, s, t, opts.col || '#22252b', opts); }
const _setF = (pred, f) => { const sc = SCENES.find(pred); if (sc) sc.f = f; };

// "Faz quarenta minutos..." — dragão ruge e guilda ataca
_setF(s => s.k === 'faz quarenta', (t, p) => {
  const sh = Math.sin(t * 50) * 6 * (Math.sin(t * 2) > .6 ? 1 : 0);
  let s = gameMeadow(t, { dusk: true, seed: 12 });
  s += g(stoneDragon(0, 0, .95, t, { roar: Math.max(0, Math.sin(t * 2)) }), `translate(${740 + sh},${1440 + sh})`);
  [[170, '#22252b'], [330, '#2a2018'], [770, '#121418'], [930, '#22252b']].forEach(([x, c], i) => { const j = Math.max(0, Math.sin(t * 3 + i)) * 120; s += knight(x, 1820 - j, .6, t + i, { col: c, flip: x > 540, armR: -140 + 120 * Math.sin(t * 6 + i) }); s += slashArc(x + (x > 540 ? -60 : 60), 1500 - j, 90, -60, 80, ((t * 1.5 + i * .3) % 1)); });
  s += g(`<rect x="-160" y="-50" width="320" height="100" rx="16" fill="#0b0d10" opacity=".85"/>` + txt(0, 20, `${40 + Math.floor(t)}:${String(Math.floor((t * 60) % 60)).padStart(2, '0')}`, 60, '#ff7a6a', { w: 900 }), 'translate(540,240)');
  return s + gameFG(t, true) + vignette();
});
// L0 rugido em close
_setF(s => s.gap === 0, (t, p) => {
  const sh = Math.sin(t * 70) * 14 * (1 - p);
  let s = gameMeadow(t, { dusk: true, seed: 12 }) + `<rect width="${W}" height="${H}" fill="#2a0a00" opacity=".3"/>`;
  s += g(stoneDragon(0, 0, 1.9, t, { roar: Math.min(1, p * 3), wing: 25 }), `translate(${980 + sh},${2150 + sh})`);
  for (let i = 0; i < 3; i++) { const rr = ((p * 1.8 + i / 3) % 1); s += `<circle cx="300" cy="900" r="${80 + rr * 800}" fill="none" stroke="#ffb27a" stroke-width="${16 * (1 - rr)}" opacity="${1 - rr}"/>`; }
  return s + vignette(true);
});
// L1 guilda ataca: saltos, golpes, faíscas, dano
_setF(s => s.gap === 1, (t, p) => {
  let s = gameMeadow(t, { dusk: true, seed: 12 });
  s += g(stoneDragon(0, 0, .9, t, { roar: .3 }), `translate(${740 + (p > .5 && p < .6 ? 12 : 0)},1420)`);
  const jumps = [[200, 0], [420, .25], [700, .5], [900, .15]];
  jumps.forEach(([x, o], i) => { const ph = (p * 1.4 + o) % 1, j = Math.sin(ph * Math.PI) * 420; s += knight(x, 1820 - j, .6, t + i, { col: ['#22252b', '#2a2018', '#121418', '#22252b'][i], flip: x > 540, armR: -170 + 160 * ph }); s += slashArc(x, 1600 - j, 120, -120, 40, ph); s += sparks(x + (x > 540 ? -80 : 80), 1300 - j * .5, (ph - .5) * 2, 30 + i); });
  s += popup(420, lerp(1150, 1000, p), '-1.240', 1 - p * .6, 90, '#ff5d5d') + popup(760, lerp(1050, 900, p), '-980', Math.max(0, 1 - Math.abs(p - .6) * 3), 80, '#ffd24a');
  s += bossBar(lerp(.18, .12, ease(p)), t);
  return s + gameFG(t, true) + vignette();
});
// L2 cauda varre, cavaleiro arremessado
_setF(s => s.gap === 2, (t, p) => {
  let s = gameMeadow(t, { dusk: true, seed: 12 });
  s += g(stoneDragon(0, 0, .95, t), `translate(760,1420) rotate(${Math.sin(p * Math.PI) * -8})`);
  s += `<path d="M1000,1500 Q700,${1700 - 200 * p} 300,1600" stroke="#fff" stroke-width="20" fill="none" opacity="${Math.sin(p * Math.PI) * .7}" stroke-dasharray="80 40"/>`;
  const fly = easeOut(seg(p, .2, .9));
  s += g(knight(0, 0, .6, t, { col: '#2a2018', eyes: 'wide', mouth: 'o', brows: 'up' }), `translate(${lerp(760, 1200, fly)},${lerp(1820, 1100, fly) + fly * fly * 380}) rotate(${fly * 200})`);
  s += sparks(780, 1650, seg(p, .15, .6), 55) + popup(820, lerp(1300, 1080, fly), '-2.430', seg(p, .15, .3) * (1 - seg(p, .85, 1)), 120, '#ff5d5d');
  s += bossBar(.12, t);
  return `<g transform="translate(${Math.sin(t * 60) * 8 * Math.sin(p * Math.PI)},0)">${s}</g>` + gameFG(t, true) + vignette();
});
// L4 5% -> 3% com dragão ofegante
_setF(s => s.gap === 4, (t, p) => {
  let s = `<g filter="url(#b5)">${gameMeadow(t, { dusk: true, seed: 12 })}${stoneDragon(720, 1450, 1.0, t, { roar: .2 })}</g><rect width="${W}" height="${H}" fill="#000" opacity=".35"/>`;
  s += bossBar(p < .5 ? .05 : .03, t, true);
  s += txt(540, 820, `${p < .5 ? 5 : 3}%`, 280, '#ff3a3a', { w: 900, extra: `stroke="#000" stroke-width="16" paint-order="stroke" filter="url(#glow)" opacity="${.6 + .4 * Math.abs(Math.sin(t * 10))}"` });
  return s + vignette(true);
});
// L5 dragão cospe fogo, líder atravessa as chamas em câmera lenta
_setF(s => s.gap === 5, (t, p) => {
  const tt = t * .25;
  let s = gameMeadow(tt, { dusk: true, seed: 12 }) + `<rect width="${W}" height="${H}" fill="#2a0a00" opacity=".3"/>`;
  s += stoneDragon(820, 1500, .85, tt, { roar: 1, fire: .9 });
  s += fullBody({ x: lerp(220, 420, p), y: lerp(1720, 1380, easeOut(p)), s: 1.1, top: '#121418', legs: '#1a1c22', armR: -175, armL: -150, item: `<g transform="translate(0,250) rotate(180)"><path d="M-22,54 L22,54 L12,560 L0,600 L-12,560Z" fill="#fff8d8" filter="url(#glow2)"/><rect x="-50" y="36" width="100" height="20" rx="6" fill="#c9a24a"/></g>`, head: { hair: 'marina', hairCol: '#14110f', eyes: 'dot', brows: 'angry', mouth: 'open' } }, tt);
  const r = rng(26); for (let i = 0; i < 40; i++) s += `<circle cx="${r() * W}" cy="${(r() * H - t * 20 + H) % H}" r="${3 + r() * 6}" fill="${r() < .5 ? '#ffb02e' : '#fff4c8'}" opacity=".8" filter="url(#glow)"/>`;
  return s + gameFG(tt, true) + vignette(true);
});
// L6 golpe final no pescoço + 1% + mão do Caio + clarão
_setF(s => s.gap === 6, (t, p) => {
  if (p > .9) return `<rect width="${W}" height="${H}" fill="#fff"/>`;
  let s = `<g filter="url(#b2)">${gameMeadow(t, { dusk: true, seed: 12 })}${stoneDragon(700, 1350, .8, t, { roar: .6 })}</g>`;
  s += slashArc(300, 820, 380, -30, 120, seg(p, 0, .5), '#fff8d8') + sparks(330, 900, seg(p, .2, .6), 99, '#ffe08a');
  s += bushes(t, 1780, true) + hand(560, lerp(2100, 1680, easeOut(seg(p, .3, .85))), 1.8, 0, { glove: true, sleeve: '#2f5f6a' });
  s += bossBar(.01, t, true) + `<rect width="${W}" height="${H}" fill="#fff" opacity="${seg(p, .75, .9)}"/>`;
  return s + vignette(true);
});
// "O dragão cai" — desmorona
_setF(s => s.k === 'o dragão cai', (t, p) => {
  const fp = easeIn(seg(p, 0, .7));
  let s = gameMeadow(t, { dusk: true, seed: 12 });
  s += g(stoneDragon(0, 0, 1.0, t, { fall: fp, dead: fp > .8 }), `translate(${720 + (p > .5 && p < .75 ? Math.sin(t * 70) * 12 : 0)},1450)`);
  if (p > .5) { const dp = seg(p, .5, 1), r = rng(18); for (let i = 0; i < 26; i++) s += `<circle cx="${540 + (r() - .5) * 1100 * dp}" cy="${1450 - r() * 380 * dp}" r="${50 + r() * 80}" fill="#b8a890" opacity="${(1 - dp) * .65}" filter="url(#b10)"/>`; }
  return s + gameFG(t, true) + vignette();
});

// =====================================================================
// CORREÇÃO: olhos vermelhos do clone dentro do rosto (sem posição fixa)
// =====================================================================
const _face2Mask = face2;
face2 = function (o) {
  let s = _face2Mask(o);
  if (o.redEyes) {
    s = s.replace(/fill="#1e1612"/g, 'fill="#ff3a3a" filter="url(#glow)"').replace(/<circle cx="[^"]*" cy="[^"]*" r="2.4" fill="#fff"\/>/g, '')
         .replace(/stroke="#2a1d17" stroke-width="5" fill="none" stroke-linecap="round"\/>/, 'stroke="#ff3a3a" stroke-width="6" fill="none" stroke-linecap="round" filter="url(#glow)"/>');
  }
  return s;
};
// cena: agachado no mato (olhos vermelhos acendem)
_setF(s => s.k === 'agachado no', (t, p) => { let s = `<g filter="url(#b5)">${gameMeadow(t, { dusk: true, seed: 3 })}</g>` + `<rect width="${W}" height="${H}" fill="#000" opacity=".35"/>` + bushes(t, 1300, true); s += g(headG({ ...THIEF, eyes: 'dot', brows: 'serious', redEyes: p > .5 }), `translate(540,${lerp(1500, 1260, easeOut(seg(p, .1, .6)))}) scale(1.7)`); s += bushes(t + 3, 1650, true); return s + vignette(true); });
// cena: "E ele também está sorrindo" (olhos fechados em arco, vermelhos)
_setF(s => s.k === 'e ele também', (t, p) => { let s = `<rect width="${W}" height="${H}" fill="#050506"/>` + bushes(t, 1500, true); s += bust({ x: 540, y: 1050, s: 2.8, ...THIEF, eyes: p > .3 ? 'closed' : 'dot', brows: 'up', redEyes: true }); return s + vignette(true); });
// novo final A/B
function abSide(t, side) {
  if (side === 'A') {
    let A = gameMeadow(t, { dusk: true, seed: 4 }) + `<rect width="${W}" height="${H}" fill="#000" opacity=".35"/>`;
    A += crownEmblem(540, 1180, .9 + .05 * Math.sin(t * 3)).replace('<g transform', '<g opacity=".55" transform');
    A += fullBody({ x: 330, y: 1760, s: 1.0, top: '#2f5f6a', legs: '#1f2a2e', item: KNIFE, armR: -15, head: { ...THIEF, eyes: 'dot', brows: 'serious', look: 10 } }, t);
    A += fullBody({ x: 760, y: 1760, s: 1.0, top: '#2f5f6a', legs: '#1f2a2e', armR: -75 - 5 * Math.sin(t * 2), flip: true, head: { ...THIEF, eyes: 'closed', brows: 'up', redEyes: true } }, t + .5);
    A += txt(540, 680, 'A', 360, '#ffffff', { w: 900, extra: 'stroke="#000" stroke-width="16" paint-order="stroke"' });
    return A + g(`<rect x="-250" y="-40" width="500" height="80" rx="14" fill="#0b0d10" opacity=".85" stroke="#c9a24a" stroke-width="3"/>` + txt(0, 14, 'ROUBAR A COROA NEGRA', 36, '#c9a24a', { ls: 2 }), 'translate(540,880)');
  }
  let B = room(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".2"/>`;
  B += bust({ x: 540, y: 1250, s: 1.9, ...REAL_CAIO, eyes: 'dot', brows: 'angry', breath: t });
  B += g(helmet(.2, '').replace(/#5fd0ff/g, '#ffc928').replace(/#0e2733/g, '#2a1e05'), `translate(${lerp(540, 860, easeOut(Math.min(1, t * .6)))},${lerp(980, 820, easeOut(Math.min(1, t * .6)))}) scale(1.1)`);
  B += phone(330, 1560, 1.25, -8, `<rect x="-106" y="-212" width="212" height="424" rx="26" fill="#cfe3d6"/><path d="M-106,-100 L106,-40 M-106,60 L106,10 M-20,-212 L10,212" stroke="#fff" stroke-width="14"/><path d="M40,-30 c0,-30 50,-30 50,0 c0,25 -25,45 -25,60 c0,-15 -25,-35 -25,-60z" fill="#ff3a3a"/><rect x="-96" y="120" width="192" height="70" rx="12" fill="#0b0d10" opacity=".9"/>` + txt(0, 148, 'USANDO SEU NOME', 20, '#ff5d5d') + txt(0, 176, '2,3 km', 24, '#ffffff', { w: 900 }));
  return B + txt(540, 680, 'B', 360, '#ffc928', { w: 900, extra: 'stroke="#000" stroke-width="16" paint-order="stroke"' });
}

// =====================================================================
// ÁUREA — EPISÓDIO 2: O CONTRATO (caminho A: Caio rouba junto com o clone)
// Reaproveita os desenhos do episódio 1 (acima) e acrescenta cenários novos.
// =====================================================================
const LEADER = { hair: 'marina', hairCol: '#14110f', top: '#121418', outfit: 'coat' };
delete PART.gap;
PART.end = 104.6; PART.abTime = 96.04;
PART.merges = [
  [['duzentos','e','quarenta','mil','reais'], 'R$ 240 MIL'],
  [['duzentos','e','quarenta','mil'], '240 MIL'],
  [['dezesseis','mil','dólares'], 'US$ 16 MIL'],
  [['trinta','e','sete','reais'], 'R$ 37'],
  [['três','mil'], '3 MIL'],
  [['dez','segundos'], '10 SEGUNDOS'],
  [['dez','metros'], '10 METROS'],
  [['nove','metros'], '9 METROS'],
  [['nível','doze'], 'NÍVEL 12'],
  [['nível','oitenta'], 'NÍVEL 80'],
  [['cinco','jogadores'], '5 JOGADORES'],
  [['quase','um','ano'], 'QUASE 1 ANO'],
];
PART.hl = ['caio','clone','pior','acordo','ladrão','mão','leve','item','ontem','coroa','negra','rica','idêntico','tudo','proposta','cofre','líder','turno','distraio','guardas','puxa','meio','loucura','verdade','2005','eve','online','espiões','infiltrados','noite','meianoite','telhado','coração','disparado','saem','gira','somem','vibra','saldo','nada','outra','conta','lenço','ela','desviou','própria','guilda','culpado','mesmo','nome','registro','caioladrão07','caçando','endereço','chat','entregar','armação','roubar','volta'];

const tf = n => (+n).toFixed(1);
const blinkAt = (t, k = 0) => ((t + k * .37) % 3.1) < .12;
function easeInOut2(x) { return x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
const typed = (str, k) => str.slice(0, Math.ceil(clamp(k) * str.length));
const pop = (p, a, b) => { const k = seg(p, a, b); return k <= 0 ? 0.001 : k < 1 ? lerp(1.25, 1, easeOut(k)) * (.4 + .6 * k) : 1; };

// ---------- partículas e luz ----------
function stars2(t, seed, n = 90, maxY = 1150) { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const x = r() * W, y = r() * maxY, rr = .8 + r() * 2.4, ph = r() * 6; s += `<circle cx="${tf(x)}" cy="${tf(y)}" r="${tf(rr)}" fill="#fff" opacity="${(.35 + .5 * Math.abs(Math.sin(t * 1.4 + ph))).toFixed(2)}"/>`; } return s; }
function clouds2(t, y, seed, col, op) { const r = rng(seed); let s = `<g filter="url(#b18)" opacity="${op}">`; for (let i = 0; i < 5; i++) { const x = ((r() * 1500 + t * (8 + r() * 10)) % 1500) - 210, yy = y + (r() - .5) * 360, w = 180 + r() * 160; s += `<ellipse cx="${tf(x)}" cy="${tf(yy)}" rx="${tf(w)}" ry="${tf(w * .22)}" fill="${col}"/><ellipse cx="${tf(x + w * .4)}" cy="${tf(yy - 20)}" rx="${tf(w * .6)}" ry="${tf(w * .2)}" fill="${col}"/>`; } return s + '</g>'; }
function dust(t, seed, n = 24, col = '#ffe9b0', op = .5) { const r = rng(seed); let s = ''; for (let i = 0; i < n; i++) { const x = (r() * W + t * 30 * (r() - .5) + W * 4) % W, y = (r() * H - t * (10 + 30 * r()) + H * 9) % H; s += `<circle cx="${tf(x)}" cy="${tf(y)}" r="${tf(2 + r() * 4)}" fill="${col}" opacity="${(op * (.4 + r() * .6)).toFixed(2)}"/>`; } return s; }
function nightSky2(t, o = {}) {
  const mx = o.mx ?? 800, my = o.my ?? 340;
  let s = `<defs>${linGrad('ns2', [[0, '#060918'], [.45, '#152150'], [.8, '#3b3a72'], [1, '#7a5278']])}</defs><rect width="${W}" height="${H}" fill="url(#ns2)"/>`;
  s += stars2(t, o.seed || 3);
  s += `<circle cx="${mx}" cy="${my}" r="300" fill="#b8c6ff" opacity=".13" filter="url(#b60)"/><circle cx="${mx}" cy="${my}" r="118" fill="#f6efd6" filter="url(#glow2)"/><circle cx="${mx - 34}" cy="${my - 26}" r="20" fill="#d9cfae" opacity=".7"/><circle cx="${mx + 36}" cy="${my + 30}" r="28" fill="#d9cfae" opacity=".6"/><circle cx="${mx + 20}" cy="${my - 50}" r="11" fill="#d9cfae" opacity=".6"/>`;
  return s + clouds2(t, o.cy || 560, 21, '#2a3466', .75);
}
function torch(x, y, s, t) {
  const w = Math.sin(t * 13 + x) * 8, h = 1 + .12 * Math.sin(t * 17 + x);
  return g(`<circle cy="-60" r="230" fill="#ff9a3a" opacity="${(.17 + .04 * Math.sin(t * 9 + x)).toFixed(3)}" filter="url(#b30)"/><rect x="-10" y="0" width="20" height="120" rx="6" fill="#3a2a1e"/><path d="M-34,0 L34,0 L22,40 L-22,40Z" fill="#5a4a3a"/><path d="M-30,0 C-50,-60 ${tf(w - 10)},-100 ${tf(w)},${tf(-170 * h)} C${tf(w + 14)},-100 50,-60 30,0Z" fill="#ff7a1a" filter="url(#glow)"/><path d="M-18,0 C-28,-40 ${tf(w * .6 - 4)},-70 ${tf(w * .6)},${tf(-110 * h)} C${tf(w * .6 + 8)},-70 28,-40 18,0Z" fill="#ffd24a"/><path d="M-8,0 C-12,-20 0,-40 ${tf(w * .3)},${tf(-60 * h)} C6,-40 12,-20 8,0Z" fill="#fff6d0"/>`, `translate(${x},${y}) scale(${s})`);
}

// ---------- interface do jogo ----------
function hud(t, o = {}) {
  const hp = o.hp ?? .82;
  let s = g(`<rect x="0" y="0" width="440" height="120" rx="24" fill="#0b0d10" opacity=".8"/><circle cx="60" cy="60" r="46" fill="#2f5f6a" stroke="#c9a24a" stroke-width="4"/>` + g(headG({ ...THIEF, eyes: 'dot', brows: 'serious' }), 'translate(60,68) scale(.34)') + txt(122, 44, o.name || 'CaioLadrão_07', 30, '#fff', { a: 'start', w: 800 }) + txt(420, 44, 'NV ' + (o.lvl || 12), 24, '#c9a24a', { a: 'end' }) + `<rect x="122" y="60" width="296" height="14" rx="7" fill="#33262a"/><rect x="122" y="60" width="${tf(296 * hp)}" height="14" rx="7" fill="#e5484d"/><rect x="122" y="84" width="296" height="10" rx="5" fill="#22283a"/><rect x="122" y="84" width="${tf(296 * (o.mp ?? .6))}" height="10" rx="5" fill="#4a8cff"/>`, 'translate(40,150)');
  if (o.clock) s += g(`<rect x="-120" y="-36" width="240" height="72" rx="18" fill="#0b0d10" opacity=".8"/>` + txt(0, 14, o.clock, 40, o.clockCol || '#f4ecd0', { w: 900, ls: 2 }), 'translate(900,210)');
  return s;
}
function label(text, lt, y = 330) { const a = easeOut(seg(lt, 0, .35)), w = text.length * 20 + 70; return g(`<rect x="0" y="-34" width="${w}" height="68" rx="10" fill="#0b0d10" opacity=".85"/><rect x="0" y="-34" width="10" height="68" fill="#ffc928"/>` + txt(32, 12, text, 34, '#fff', { a: 'start', ls: 2 }), `translate(${tf(lerp(-w - 20, 40, a))},${y})`); }
function nameTag(x, y, text, col = '#fff', bg = '#0b0d10') { const w = text.length * 17 + 44; return g(`<rect x="${-w / 2}" y="-28" width="${w}" height="54" rx="14" fill="${bg}" opacity=".82"/>` + txt(0, 10, text, 30, col, { w: 800 }), `translate(${tf(x)},${tf(y)})`); }
function panel(x, y, w, h, top, big, col = '#ffc928') {
  return g(`<rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="26" fill="#0b0d10" opacity=".92" stroke="${col}" stroke-width="5"/>` + txt(0, -h / 2 + 54, top, 30, '#9aa6ae', { ls: 4 }) + txt(0, h / 2 - 40, big, h * .42, col, { w: 900 }), `translate(${x},${y})`);
}
function chatWin(x, y, title, msgs, o = {}) {
  const h = 150 + msgs.length * 120;
  let s = `<rect x="-440" y="0" width="880" height="${h}" rx="30" fill="#0b0d10" opacity=".94" stroke="${o.col || '#3aa0b0'}" stroke-width="5"/><circle cx="-370" cy="66" r="44" fill="#2f5f6a"/>` + g(headG({ ...THIEF, eyes: 'dot', brows: 'serious', redEyes: true }), 'translate(-370,74) scale(.33)') + txt(-305, 58, title, 38, '#fff', { a: 'start', w: 800 }) + txt(-305, 98, 'CHAT PRIVADO · online', 24, '#7fd6a0', { a: 'start', ls: 2 }) + `<path d="M-440,130 H440" stroke="#232a30" stroke-width="3"/>`;
  msgs.forEach(([m, n], i) => { if (n <= 0) return; const w = Math.min(820, 70 + m.length * 25); s += `<rect x="-410" y="${156 + i * 120}" width="${w}" height="96" rx="26" fill="#1a2230"/>` + txt(-380, 220 + i * 120, m.slice(0, n), 44, '#fff', { a: 'start', fam: 'NU', w: 800 }); });
  return g(s, `translate(${x},${y})`);
}
function bankPhone(x, y, s, rot, val, col = '#fff', rows = [], sub = '') {
  let sc = `<rect x="-106" y="-212" width="212" height="424" rx="26" fill="#101820"/><rect x="-106" y="-212" width="212" height="70" rx="26" fill="#1c2a36"/>` + txt(0, -166, 'MEU BANCO', 18, '#9ab', { ls: 3 }) + txt(0, -100, 'SALDO DISPONÍVEL', 14, '#8a98a4', { ls: 2 }) + txt(0, -50, val, 40, col, { w: 900 }) + txt(0, -22, sub, 13, '#8a98a4', { fam: 'NU' });
  rows.forEach(([a, b, c], i) => { sc += `<rect x="-92" y="${6 + i * 62}" width="184" height="52" rx="10" fill="#18232d"/>` + txt(-80, 28 + i * 62, a, 14, '#cfd6da', { a: 'start', fam: 'NU', w: 800 }) + txt(-80, 46 + i * 62, b, 11, '#7a8894', { a: 'start', fam: 'NU' }) + txt(84, 38 + i * 62, c, 15, c[0] === '+' ? '#7fffd0' : '#ff8a8a', { a: 'end', w: 800 }); });
  return phone(x, y, s, rot, sc);
}

// ---------- personagens ----------
function thief(x, y, s, t, o = {}) { return fullBody({ x, y, s, top: '#2f5f6a', legs: '#1f2a2e', armR: o.armR ?? -15, armL: o.armL ?? 8, item: o.item ?? KNIFE, flip: o.flip, walk: o.walk, head: { ...THIEF, eyes: o.eyes || 'dot', brows: o.brows || 'serious', look: o.look || 0, redEyes: o.red, blink: !o.red && o.eyes !== 'wide' && blinkAt(t, x) } }, t); }
function liveBust(o, t) { return bust({ eyes: 'dot', brows: 'serious', ...o, blink: o.eyes !== 'closed' && o.eyes !== 'wide' && !o.redEyes && blinkAt(t, o.x), breath: t }); }
function leaderBody(x, y, s, t, o = {}) {
  const sw = Math.sin(t * 1.8) * 14;
  const cape = g(`<path d="M-100,-540 C-170,-300 ${tf(-190 + sw)},-120 ${tf(-170 + sw)},0 L${tf(170 + sw)},0 C${tf(190 + sw)},-120 170,-300 100,-540Z" fill="#4a1022"/><path d="M0,-540 C-10,-300 ${tf(sw)},-100 ${tf(10 + sw)},0 L${tf(170 + sw)},0 C${tf(190 + sw)},-120 170,-300 100,-540Z" fill="#000" opacity=".25"/>`, `translate(${x},${y}) scale(${s})`);
  const body = fullBody({ x, y, s, top: '#16181f', legs: '#1a1c22', armR: o.armR ?? -12, armL: o.armL ?? 12, item: o.item || '', flip: o.flip, walk: o.walk, head: { ...LEADER, eyes: o.eyes || 'dot', mouth: o.mouth || 'smile', brows: o.brows || 'serious', look: o.look || 0 } }, t);
  const pads = g(`<path d="M-130,-520 C-124,-580 -60,-584 -50,-536Z" fill="#c9a24a"/><path d="M130,-520 C124,-580 60,-584 50,-536Z" fill="#c9a24a"/><path d="M-34,-716 L-28,-752 L-13,-728 L0,-760 L13,-728 L28,-752 L34,-716Z" fill="#ffc928"/>`, `translate(${x},${y}) scale(${s})`);
  return cape + body + pads;
}

// ---------- cenários ----------
function castle2(x, y, s, t, o = {}) {
  const base = '#1b2038', lit = '#39457a', dark = '#10142a', roof = '#40264a';
  let c = `<rect x="-520" y="-420" width="1040" height="420" fill="${base}"/>`;
  for (let i = 0; i < 13; i++) c += `<rect x="${-520 + i * 82}" y="-462" width="46" height="46" fill="${base}"/>`;
  for (let r = 0; r < 6; r++) { c += `<path d="M-520,${-380 + r * 64} H520" stroke="${dark}" stroke-width="3" opacity=".55"/>`; let v = ''; for (let k = 0; k < 9; k++) v += `M${-480 + k * 120 + (r % 2) * 60},${-380 + r * 64} v64 `; c += `<path d="${v}" stroke="${dark}" stroke-width="3" opacity=".4"/>`; }
  c += `<path d="M-90,0 V-170 C-90,-270 90,-270 90,-170 V0Z" fill="#0a0c18"/><path d="M-90,0 V-170 C-90,-270 90,-270 90,-170 V0Z" fill="#ffb24a" opacity=".12"/><path d="M-54,0 V-236 M-18,0 V-248 M18,0 V-248 M54,0 V-236 M-90,-60 H90 M-90,-130 H90 M-84,-200 H84" stroke="#2c3458" stroke-width="7"/>`;
  const tw = [[-430, 170, 760, 3], [430, 170, 760, 3], [-170, 150, 960, 4], [170, 150, 960, 4], [0, 230, 1220, 5]];
  for (const [cx, w, h, nw] of tw) {
    const ap = -h - 36 - w * 1.25, fl = Math.sin(t * 3 + cx) * 10;
    c += `<rect x="${cx - w / 2}" y="${-h}" width="${w}" height="${h}" fill="${base}"/><rect x="${cx - w / 2}" y="${-h}" width="${w * .16}" height="${h}" fill="${lit}" opacity=".55"/><rect x="${cx + w * .2}" y="${-h}" width="${w * .3}" height="${h}" fill="#000" opacity=".22"/>`;
    for (let k = 0; k < 4; k++) c += `<rect x="${cx - w / 2 + k * w / 3.5}" y="${-h - 36}" width="${w / 7}" height="36" fill="${base}"/>`;
    c += `<path d="M${cx - w / 2 - 16},${-h - 36} L${cx},${ap} L${cx + w / 2 + 16},${-h - 36}Z" fill="${roof}"/><path d="M${cx - w / 2 - 16},${-h - 36} L${cx},${ap} L${cx - w * .1},${-h - 36}Z" fill="#7a4a82" opacity=".55"/>`;
    for (let k = 0; k < nw; k++) c += `<rect x="${cx - 17}" y="${-h + 110 + k * 190}" width="34" height="62" rx="17" fill="#ffc45a" opacity="${(.55 + .35 * Math.sin(t * 2.3 + k * 2 + cx)).toFixed(2)}" filter="url(#glow)"/>`;
    c += `<path d="M${cx},${ap} v-80" stroke="#8a90b0" stroke-width="6"/><path d="M${cx},${ap - 80} q30,${tf(fl)} 64,0 v36 q-34,${tf(-fl)} -64,0Z" fill="#c9a24a"/>`;
  }
  for (const bx of [-300, 300]) c += `<path d="M${bx - 44},-400 h88 v190 l-44,-40 l-44,40Z" fill="#5a1428"/>` + crownEmblem(bx, -330, .13, false);
  c += `<ellipse cx="0" cy="0" rx="760" ry="100" fill="#8a94d0" opacity=".28" filter="url(#b30)"/>`;
  return g(c, `translate(${x},${y}) scale(${s})`, o.blur ? `filter="url(#${o.blur})"` : '');
}
function lootPile(x, y, s, t, n = 1) {
  let l = `<ellipse cx="0" cy="-40" rx="420" ry="240" fill="#ffd24a" opacity=".35" filter="url(#b30)"/>`;
  const r = rng(77);
  l += `<rect x="-250" y="-250" width="150" height="110" rx="10" fill="#7a4a22"/><rect x="-250" y="-250" width="150" height="34" rx="10" fill="#c9a24a"/><rect x="110" y="-230" width="130" height="100" rx="10" fill="#7a4a22"/><rect x="110" y="-230" width="130" height="30" rx="10" fill="#c9a24a"/>`;
  l += g(`<path d="M-30,0 L-30,-300 L0,-340 L30,-300 L30,0Z" fill="#dfe6ec"/><path d="M0,0 V-340 L30,-300 L30,0Z" fill="#9aa6b2"/><rect x="-80" y="0" width="160" height="26" rx="8" fill="#c9a24a"/><rect x="-14" y="26" width="28" height="90" fill="#4a3424"/>`, 'translate(220,-150) rotate(22) scale(.8)');
  l += `<path d="M-70,-60 L-80,-150 L-36,-110 L0,-170 L36,-110 L80,-150 L70,-60Z" fill="#ffc928" stroke="#9a6a0a" stroke-width="6" transform="translate(30,-250)"/>`;
  for (let i = 0; i < 24 * n; i++) l += coin((r() - .5) * 640, -r() * 220, .7 + r() * .4, r() * 360);
  l += g(ruby(0, 0, .5, t), 'translate(-170,-300)') + g(ruby(0, 0, .3, t + 1), 'translate(130,-120)');
  for (let i = 0; i < 6; i++) { const a = (t * 1.5 + i) % 1; l += `<path d="M0,-18 L5,-5 L18,0 L5,5 L0,18 L-5,5 L-18,0 L-5,-5Z" fill="#fff" opacity="${tf(Math.sin(a * Math.PI))}" transform="translate(${tf((r() - .5) * 600)},${tf(-r() * 380)}) scale(${tf(.6 + a)})"/>`; }
  return g(l, `translate(${x},${y}) scale(${s})`);
}
function vaultDoor2(x, y, s, t, open = 0, o = {}) {
  const k = 1 - .9 * easeInOut2(seg(open, .4, 1)), unlock = seg(open, 0, .4);
  let v = `<circle r="446" fill="#0a0b10"/><circle r="428" fill="none" stroke="#5a4a2a" stroke-width="16"/>`;
  v += `<clipPath id="vclip"><circle r="404"/></clipPath><g clip-path="url(#vclip)"><rect x="-410" y="-410" width="820" height="820" fill="#1c1508"/><path d="M-410,60 H410 M-410,-140 H410" stroke="#3a2c14" stroke-width="16"/><ellipse cx="0" cy="170" rx="430" ry="310" fill="#ffc83a" opacity="${tf(((1 - k) / .9 * .5 + .04) * (o.glow ?? 1))}" filter="url(#b30)"/>${o.inside || ''}</g>`;
  let d = '';
  for (let i = 0; i < 8; i++) d += `<rect x="-24" y="${tf(-426 + 50 * unlock)}" width="48" height="90" rx="8" fill="#8a909c" transform="rotate(${i * 45 + 22.5})"/>`;
  d += `<circle r="400" fill="#4a505c"/><circle cx="46" cy="46" r="352" fill="#000" opacity=".14"/><circle r="400" fill="none" stroke="#c9a24a" stroke-width="16"/><path d="M-346,-200 A400,400 0 0 1 -60,-394" stroke="#fff" stroke-width="14" fill="none" opacity=".2" stroke-linecap="round"/><circle r="312" fill="#3c414b" stroke="#2a2e36" stroke-width="6"/>`;
  for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; d += `<circle cx="${tf(Math.cos(a) * 356)}" cy="${tf(Math.sin(a) * 356)}" r="13" fill="#8a909c"/><circle cx="${tf(Math.cos(a) * 356 - 4)}" cy="${tf(Math.sin(a) * 356 - 4)}" r="5" fill="#fff" opacity=".35"/>`; }
  d += crownEmblem(0, -212, .26, false);
  d += g(`<circle r="132" fill="#22252b" stroke="#c9a24a" stroke-width="10"/>` + [0, 72, 144, 216, 288].map(a => `<g transform="rotate(${a})"><rect x="-13" y="-186" width="26" height="186" rx="12" fill="#9aa0ac"/><circle cy="-190" r="26" fill="#c9a24a"/></g>`).join('') + `<circle r="44" fill="#c9a24a"/><circle r="18" fill="#22252b"/>`, `rotate(${tf(t * 20 + unlock * 540)})`);
  d += g(`<circle r="54" fill="#1a1c22" stroke="#8a909c" stroke-width="6"/><path d="M0,0 L0,-40" stroke="#ff5d5d" stroke-width="6" stroke-linecap="round" transform="rotate(${tf(-120 + 240 * unlock)})"/><circle r="8" fill="#c9a24a"/>`, 'translate(196,190)');
  d += g(`<rect x="-56" y="-44" width="112" height="88" rx="12" fill="#1a1c22" stroke="#8a909c" stroke-width="6"/>` + [0, 1, 2].map(i => `<circle cx="${-30 + i * 30}" cy="0" r="10" fill="${unlock > (i + 1) / 3.2 ? '#4aff9a' : '#ff3a3a'}" filter="url(#glow)"/>`).join(''), 'translate(-196,190)');
  v += g(d, `translate(${tf(-400 * (1 - k))},0) scale(${tf(k * 100) / 100},1)`);
  if (unlock > 0 && k > .95) v += `<circle r="404" fill="none" stroke="#ffd24a" stroke-width="${tf(10 * unlock)}" opacity="${tf(unlock * .8)}" filter="url(#glow)"/>`;
  return g(v, `translate(${x},${y}) scale(${s})`);
}
function vaultRoom(t, o = {}) {
  let s = `<rect width="${W}" height="${H}" fill="#14121a"/>`;
  for (let r = 0; r < 13; r++) for (let c = -1; c < 5; c++) { const x = c * 240 + (r % 2) * 120, y = r * 116; s += `<rect x="${x + 4}" y="${y + 4}" width="232" height="108" rx="8" fill="${(r * 3 + c) % 4 === 0 ? '#352f40' : (r + c) % 2 ? '#2c2736' : '#272331'}"/>`; }
  s += `<rect width="${W}" height="${H}" fill="#06050a" opacity=".22"/>`;
  s += `<path d="M0,1480 H${W} V${H} H0Z" fill="#1c1923"/>`;
  let fl = ''; for (let i = -7; i <= 7; i++) fl += `M${540 + i * 70},1480 L${540 + i * 270},${H} `; for (const yy of [1520, 1580, 1670, 1800]) fl += `M0,${yy} H${W} `;
  s += `<path d="${fl}" stroke="#0e0c12" stroke-width="4"/><rect y="1468" width="${W}" height="18" fill="#0c0a10"/>`;
  s += `<path d="M190,1480 H890 L950,1560 H130Z" fill="#2e2937"/><path d="M130,1560 H950 L1010,1650 H70Z" fill="#25212c"/><path d="M190,1480 H890" stroke="#4a4458" stroke-width="6"/>`;
  for (const px of [30, 1050]) s += `<rect x="${px - 90}" y="0" width="180" height="1500" fill="#3a3444"/><rect x="${px - 90}" y="0" width="40" height="1500" fill="#fff" opacity=".06"/><rect x="${px + 34}" y="0" width="56" height="1500" fill="#000" opacity=".25"/><rect x="${px - 110}" y="1420" width="220" height="80" fill="#443d50"/>`;
  for (const bx of [225, 855]) { const sw = Math.sin(t * 1.6 + bx) * 8; s += `<path d="M${bx - 60},110 H${bx + 60} L${tf(bx + 60 + sw)},500 L${tf(bx + sw)},452 L${tf(bx - 60 + sw)},500Z" fill="#5a1428"/><rect x="${bx - 66}" y="100" width="132" height="24" rx="6" fill="#c9a24a"/>` + crownEmblem(bx + sw * .4, 290, .22, false); }
  s += torch(70, 860, 1.05, t) + torch(1010, 860, 1.05, t + 1);
  s += vaultDoor2(540, o.dy || 900, o.ds || .78, t, o.open || 0, { inside: o.inside, glow: o.glow });
  return s;
}
function roofFG(t, y0 = 1380) {
  let s = `<path d="M-20,${y0 + 120} L1100,${y0 - 40} V${H} H-20Z" fill="#262b48"/>`;
  for (let r = 0; r < 9; r++) { let d = `M-20,${y0 + 190 + r * 72} `; for (let i = 0; i < 19; i++) d += `q30,26 60,-8.6 `; s += `<path d="${d}" stroke="#141830" stroke-width="7" fill="none"/><path d="${d}" stroke="#5560a0" stroke-width="3" fill="none" opacity=".35" transform="translate(0,-7)"/>`; }
  s += `<path d="M-20,${y0 + 120} L1100,${y0 - 40}" stroke="#56629c" stroke-width="16" stroke-linecap="round"/>`;
  s += `<rect x="830" y="${y0 - 250}" width="150" height="330" fill="#2c3050"/><rect x="830" y="${y0 - 250}" width="34" height="330" fill="#5560a0" opacity=".4"/><rect x="814" y="${y0 - 276}" width="182" height="36" rx="6" fill="#3a4068"/>`;
  for (let i = 0; i < 4; i++) { const a = (t * .35 + i / 4) % 1; s += `<circle cx="${tf(905 + Math.sin(a * 6 + i) * 30)}" cy="${tf(y0 - 290 - a * 320)}" r="${tf(30 + a * 60)}" fill="#8a94c0" opacity="${tf(.3 * (1 - a))}" filter="url(#b10)"/>`; }
  return s;
}
function room2(t, o = {}) {
  let s = room(t);
  s += `<rect x="616" y="436" width="188" height="268" fill="#0f1a30"/>`;
  const r = rng(44); for (let i = 0; i < 16; i++) s += `<rect x="${tf(622 + r() * 170)}" y="${tf(560 + r() * 130)}" width="8" height="10" fill="#ffd27a" opacity="${tf(.4 + r() * .6)}"/>`;
  for (let i = 0; i < 8; i++) { const a = (t * 1.6 + r()) % 1; s += `<path d="M${tf(626 + r() * 170)},${tf(440 + a * 240)} l-4,22" stroke="#9fc8ff" stroke-width="2" opacity=".5"/>`; }
  s += `<path d="M710,436 V704 M616,570 H804" stroke="#2c3846" stroke-width="8"/>`;
  s += g(`<rect x="-74" y="-96" width="148" height="192" fill="#f1ede2" filter="url(#shs)"/>` + txt(0, -54, 'ALUGUEL', 24, '#3a4a5a', { ls: 2 }) + `<rect x="-50" y="-36" width="100" height="8" rx="4" fill="#cfd4d8"/><rect x="-50" y="-16" width="80" height="8" rx="4" fill="#cfd4d8"/><rect x="-50" y="4" width="92" height="8" rx="4" fill="#cfd4d8"/>` + g(txt(0, 0, o.paid ? 'PAGO' : 'ATRASADO', 26, o.paid ? '#1c9a5a' : '#c0222a', { w: 900 }) + `<rect x="-66" y="-28" width="132" height="40" rx="6" fill="none" stroke="${o.paid ? '#1c9a5a' : '#c0222a'}" stroke-width="4"/>`, 'translate(0,58) rotate(-10)'), 'translate(380,400) rotate(4)');
  s += `<path d="M0,1560 H${W} V${H} H0Z" fill="#2a2018"/><rect y="1548" width="${W}" height="26" fill="#3a2c20"/>`;
  if (!o.noMon) s += g(`<ellipse cx="0" cy="-120" rx="340" ry="270" fill="#3ad0c0" opacity=".13" filter="url(#b30)"/><rect x="-190" y="-250" width="380" height="250" rx="14" fill="#0c0f14"/><rect x="-174" y="-234" width="348" height="218" rx="6" fill="#123a44"/>` + logo(0, -140, 1.1, '#ffc928', '#fff') + txt(0, -54, 'ÁUREA', 40, '#ffc928', { w: 900, ls: 8 }) + `<rect x="-20" y="0" width="40" height="50" fill="#0c0f14"/><rect x="-90" y="46" width="180" height="14" rx="6" fill="#0c0f14"/>`, 'translate(850,1500)');
  if (o.helmet) s += g(helmet(.8), 'translate(210,1490) scale(.6)');
  return s;
}
function spaceBG(t, seed = 51) {
  let s = `<rect width="${W}" height="${H}" fill="#03040a"/><ellipse cx="260" cy="620" rx="520" ry="320" fill="#4a2a8a" opacity=".38" filter="url(#b60)"/><ellipse cx="840" cy="1250" rx="520" ry="320" fill="#1a5a8a" opacity=".38" filter="url(#b60)"/><ellipse cx="700" cy="420" rx="300" ry="160" fill="#8a2a5a" opacity=".25" filter="url(#b60)"/>`;
  return s + stars2(t, seed, 130, H);
}
function spaceShip(x, y, s, col = '#8a96a8', t = 0) {
  return g(`<path d="M-170,0 L-${tf(420 + 40 * Math.sin(t * 20))},-10 L-${tf(420 + 40 * Math.sin(t * 20))},10Z" fill="#7fd6ff" opacity=".7" filter="url(#glow)"/><path d="M-160,0 L120,-44 L210,0 L120,44Z" fill="${col}"/><path d="M-160,0 L120,-44 L210,0Z" fill="#fff" opacity=".18"/><path d="M-120,-10 L-200,-96 L-60,-22Z M-120,10 L-200,96 L-60,22Z" fill="#5a6474"/><circle cx="-170" cy="0" r="24" fill="#bfeaff" filter="url(#glow)"/><rect x="40" y="-12" width="66" height="24" rx="10" fill="#bfe8ff" opacity=".85"/><path d="M-40,-24 h60 M-40,24 h60" stroke="#3a4454" stroke-width="5"/>`, `translate(${tf(x)},${tf(y)}) scale(${s})`);
}
function station(x, y, s, t) {
  return g(`<g transform="rotate(${tf(t * 6)})"><circle r="170" fill="none" stroke="#6a7686" stroke-width="30"/><circle r="170" fill="none" stroke="#9aa6b6" stroke-width="6"/><path d="M-170,0 H170 M0,-170 V170" stroke="#5a6474" stroke-width="18"/>` + [0, 90, 180, 270].map(a => `<rect x="-12" y="-196" width="24" height="24" fill="#ffd27a" transform="rotate(${a + 45})" filter="url(#glow)"/>`).join('') + `</g><circle r="64" fill="#3a4454"/><circle r="40" fill="#7fd6ff" opacity=".7" filter="url(#glow)"/>`, `translate(${x},${y}) scale(${s})`);
}
function orgNode(x, y, s, spy, lab, hair = 'short') {
  return g((spy ? `<rect x="-104" y="-114" width="208" height="228" rx="30" fill="#ff3a3a" opacity=".45" filter="url(#b10)"/>` : '') + `<rect x="-90" y="-100" width="180" height="200" rx="22" fill="${spy ? '#2a0e12' : '#161b24'}" stroke="${spy ? '#ff3a3a' : '#3a4558'}" stroke-width="5"/>` + g(headG({ hair, hairCol: '#2a2420', eyes: 'dot', brows: spy ? 'serious' : 'neutral', mouth: spy ? 'smile' : 'flat', redEyes: spy }), 'translate(0,-16) scale(.56)') + txt(0, 82, lab, 22, spy ? '#ff8a8a' : '#9aa6ae', { ls: 2 }), `translate(${x},${y}) scale(${s})`);
}

// ---------- lados A/B do final ----------
function abA(t) {
  let A = vaultRoom(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".4"/>`;
  A += knight(250, 1800, .8, t, { col: '#22252b', armR: -70 }) + knight(830, 1800, .8, t + 1, { col: '#2a2018', flip: true, armR: -70 });
  A += thief(540, 1840, 1.05, t, { armR: -160, armL: 160, item: '', brows: 'up' });
  A += txt(540, 600, 'A', 360, '#ffffff', { w: 900, extra: 'stroke="#000" stroke-width="16" paint-order="stroke"' });
  return A + g(`<rect x="-250" y="-40" width="500" height="80" rx="14" fill="#0b0d10" opacity=".9" stroke="#c9a24a" stroke-width="3"/>` + txt(0, 14, 'SE ENTREGAR E PROVAR', 34, '#c9a24a', { ls: 2 }), 'translate(540,790)');
}
function abB(t) {
  let B = nightSky2(t, { seed: 8, mx: 540, my: 300 }) + castle2(540, 1960, 1.0, t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".2"/>`;
  B += liveBust({ x: 540, y: 1420, s: 1.7, ...THIEF, brows: 'angry' }, t);
  B += pullLine(560, 1380, 560, 1010, 1) + g(`<path d="M-70,40 L-80,-50 L-36,-10 L0,-70 L36,-10 L80,-50 L70,40Z" fill="#ffc928" stroke="#9a6a0a" stroke-width="6" filter="url(#glow)"/>`, `translate(560,${tf(980 + 14 * Math.sin(t * 3))})`);
  B += txt(540, 600, 'B', 360, '#ffc928', { w: 900, extra: 'stroke="#000" stroke-width="16" paint-order="stroke"' });
  return B + g(`<rect x="-250" y="-40" width="500" height="80" rx="14" fill="#0b0d10" opacity=".9" stroke="#ffc928" stroke-width="3"/>` + txt(0, 14, 'ROUBAR DE VOLTA', 34, '#ffc928', { ls: 2 }), 'translate(540,790)');
}
const skyFrame = `<path fill-rule="evenodd" d="M0,0 H1080 V1920 H0Z M80,250 H1000 V1720 H80Z" fill="#0b0c16"/><path d="M80,250 H1000 V1720 H80Z" fill="none" stroke="#3a4068" stroke-width="14"/><path d="M540,250 V1720 M80,985 H1000" stroke="#1a1e36" stroke-width="12" opacity=".8"/>`;
const meadowNight = (t, seed) => gameMeadow(t, { dusk: true, seed }) + `<rect width="${W}" height="${H}" fill="#0a0c24" opacity=".3"/>`;

// ---------- cenas ----------
SCENES.length = 0;
SCENES.push(
  // 01 Aperto de mão com o clone
  { k: 'o caio aceitou', z: [1.0, 1.08], c: [540, 1300], f: (t, p) => {
    const a = -10 - 60 * easeOut(seg(p, .15, .45));
    let s = meadowNight(t, 4);
    s += thief(160, 1770, 1.15, t, { armR: a, item: '', look: 10 }) + thief(920, 1770, 1.15, t + .5, { flip: true, armR: a, item: '', red: true, eyes: 'closed', brows: 'up' });
    if (p > .42) { const b = seg(p, .42, .7); s += `<circle cx="540" cy="1250" r="${tf(40 + 220 * b)}" fill="none" stroke="#ffd24a" stroke-width="${tf(14 * (1 - b))}" opacity="${tf(1 - b)}"/><circle cx="540" cy="1250" r="70" fill="#ffd24a" opacity="${tf(.7 * (1 - b))}" filter="url(#glow2)"/>`; }
    s += nameTag(160, 990, 'CaioLadrão_07') + nameTag(920, 990, 'CaioLadrão_07', '#ff8a8a');
    s += gameFG(t, true) + hud(t);
    s += g(`<rect x="-170" y="-46" width="340" height="92" rx="20" fill="#c9a24a"/>` + txt(0, 20, 'PARTE 2', 56, '#0b0d10', { w: 900, ls: 4 }), `translate(540,${tf(lerp(-80, 440, easeOut(seg(p, 0, .25))))})`);
    if (p > .5) s += g(`<rect x="-270" y="-44" width="540" height="88" rx="18" fill="#0b1a12" opacity=".92" stroke="#4aff9a" stroke-width="4"/>` + txt(0, 14, 'GRUPO FORMADO · 2/2', 40, '#4aff9a', { w: 800, ls: 2 }), `translate(540,620) scale(${tf(pop(p, .5, .62))})`);
    return s + vignette(); } },
  // 02 O pior acordo (close no clone, câmera inclinada)
  { k: 'foi o pior', z: [1.0, 1.16], c: [540, 950], f: (t, p) => {
    let s = `<rect width="${W}" height="${H}" fill="#07080c"/><ellipse cx="540" cy="1000" rx="520" ry="640" fill="#ff2a2a" opacity="${tf(.1 + .12 * seg(p, .3, .8))}" filter="url(#b60)"/>`;
    s += `<g filter="url(#b10)">${bushes(t, 1500, true)}</g>`;
    s += g(liveBust({ x: 0, y: 0, s: 2.7, ...THIEF, eyes: p > .5 ? 'closed' : 'dot', brows: p > .5 ? 'up' : 'serious', redEyes: true }, t), 'translate(540,1060) rotate(7)');
    return s + dust(t, 5, 16, '#ff8a6a', .4) + vignette(true); } },
  // 03 Ficha do Caio: ladrão nível 12
  { k: 'caio é um', z: [1.06, 1.0], c: [540, 1200], f: (t, p) => {
    let s = gameMeadow(t, { seed: 8 });
    s += thief(330, 1760, 1.3, t, { look: 6 }) + nameTag(330, 880, 'CaioLadrão_07');
    const a = easeOut(seg(p, .1, .4));
    let card = `<rect x="-210" y="-290" width="420" height="580" rx="26" fill="#0b0d10" opacity=".9" stroke="#c9a24a" stroke-width="5"/>` + txt(0, -220, 'CLASSE', 26, '#9aa6ae', { ls: 5 }) + txt(0, -150, 'LADRÃO', 76, '#fff', { w: 900 }) + txt(0, -80, 'NÍVEL 12', 44, '#c9a24a', { w: 900, ls: 3 });
    [['FORÇA', .18, '#e5484d'], ['AGILIDADE', .62, '#4aff9a'], ['SORTE', .34, '#4a8cff'], ['ARMA', .08, '#9aa6ae']].forEach(([n, v, c], i) => { card += txt(-170, -10 + i * 68, n, 24, '#cfd6da', { a: 'start', ls: 2 }) + `<rect x="-170" y="${2 + i * 68}" width="340" height="16" rx="8" fill="#22283a"/><rect x="-170" y="${2 + i * 68}" width="${tf(340 * v * easeOut(seg(p, .2 + i * .08, .6 + i * .08)))}" height="16" rx="8" fill="${c}"/>`; });
    s += g(card, `translate(${tf(lerp(1300, 800, a))},720)`);
    return s + gameFG(t) + hud(t) + vignette(); } },
  // 04 Vida real: R$ 37 na conta
  { k: 'com trinta e', z: [1.0, 1.1], c: [600, 900], f: (t, p) => {
    let s = room2(t, { helmet: true, paid: true });
    s += liveBust({ x: 300, y: 1260, s: 1.65, ...REAL_CAIO, mouth: 'flat', brows: 'sad', look: 10 }, t);
    s += g(bankPhone(0, 0, 1.75, 6, 'R$ 37,00', '#ff8a8a', [['Aluguel', '2 meses · ontem', '-R$ 3.200'], ['Pix · Áurea', 'ontem', '+R$ 3.200']]), `translate(790,${tf(lerp(1500, 800, easeOut(seg(p, 0, .35))))})`);
    return s + label('VIDA REAL', t) + vignette(); } },
  // 05 Carta da habilidade Mão Leve
  { k: 'a única coisa', z: [1.0, 1.08], c: [540, 760], f: (t, p) => {
    let s = `<rect width="${W}" height="${H}" fill="#0a0b10"/><ellipse cx="540" cy="760" rx="560" ry="700" fill="#ffc928" opacity=".14" filter="url(#b60)"/>`;
    for (let i = 0; i < 12; i++) s += `<path d="M540,760 L${tf(540 + Math.cos(i / 12 * 6.283 + t * .3) * 1400)},${tf(760 + Math.sin(i / 12 * 6.283 + t * .3) * 1400)}" stroke="#ffc928" stroke-width="40" opacity=".04"/>`;
    let card = `<rect x="-310" y="-380" width="620" height="760" rx="36" fill="#14161c" stroke="#ffc928" stroke-width="8"/><rect x="-282" y="-352" width="564" height="430" rx="22" fill="#1d212b"/><circle cy="-140" r="170" fill="#ffd24a" opacity=".22" filter="url(#b18)"/>`;
    card += g(`<circle r="190" fill="none" stroke="#ffd24a" stroke-width="8" stroke-dasharray="30 16" filter="url(#glow)"/>`, `translate(0,-140) rotate(${tf(t * 40)})`) + hand(0, -110, 1.25, Math.sin(t * 2) * 4, { glove: true });
    card += txt(0, 170, 'MÃO LEVE', 96, '#ffc928', { w: 900, ls: 3 }) + txt(0, 226, 'HABILIDADE RARA', 32, '#9aa6ae', { ls: 6 }) + `<path d="M-250,258 H250" stroke="#2a2f3a" stroke-width="4"/>` + txt(-250, 316, 'ALCANCE', 28, '#cfd6da', { a: 'start', ls: 2 }) + txt(250, 316, '10 M', 34, '#fff', { a: 'end', w: 900 }) + txt(-250, 356, 'RECARGA', 28, '#cfd6da', { a: 'start', ls: 2 }) + txt(250, 356, '60 S', 34, '#fff', { a: 'end', w: 900 });
    s += g(card, `translate(540,760) scale(${tf(pop(p, 0, .18))}) skewY(${tf(Math.sin(t * 1.4) * 1.5)})`);
    return s + dust(t, 9, 20, '#ffd24a', .6) + vignette(true); } },
  // 06 Puxa qualquer item a 10 metros
  { k: 'puxa qualquer item', z: [1.0, 1.06], c: [540, 1300], f: (t, p) => {
    const pp = easeIn(seg(p, .3, .8));
    let s = gameMeadow(t, { seed: 8 });
    s += `<path d="M300,1810 H900" stroke="#0b0d10" stroke-width="10" opacity=".8"/>`; for (let i = 0; i <= 10; i++) s += `<path d="M${300 + i * 60},1790 v40" stroke="#0b0d10" stroke-width="${i % 5 ? 5 : 9}" opacity=".8"/>`;
    s += g(`<rect x="-90" y="-36" width="180" height="72" rx="14" fill="#0b0d10" opacity=".9"/>` + txt(0, 16, '10 M', 44, '#ffc928', { w: 900 }), 'translate(620,1120)');
    s += `<path d="M840,1700 h130 l-14,90 h-102Z" fill="#6b4a32"/><ellipse cx="905" cy="1700" rx="65" ry="18" fill="#8a6a4a"/>`;
    s += thief(180, 1770, 1.0, t, { armR: -100, item: '' });
    if (p > .22) s += pullLine(330, 1270, 905, 1640, 1);
    s += g(ruby(0, 0, .55, t), `translate(${tf(lerp(905, 340, pp))},${tf(lerp(1630, 1280, pp) - Math.sin(pp * Math.PI) * 200)})`);
    if (p > .8) s += popup(340, lerp(1180, 1080, seg(p, .8, 1)), '+1 ITEM', 1, 70);
    return s + gameFG(t) + hud(t, { mp: .6 - .3 * seg(p, .3, .4) }) + vignette(); } },
  // 07 Ontem: o roubo da Coroa Negra
  { k: 'ontem ele roubou', z: [1.06, 1.0], c: [540, 1300], f: (t, p) => {
    const pp = easeIn(seg(p, .1, .6));
    let s = gameMeadow(t, { dusk: true, seed: 12 });
    s += g(stoneDragon(0, 0, 1.0, t, { fall: 1, dead: true }), 'translate(730,1450)');
    s += knight(560, 1800, .7, t, { col: '#22252b', eyes: 'wide', brows: 'up', mouth: 'o' }) + knight(930, 1820, .7, t + 1, { col: '#2a2018', flip: true, eyes: 'wide', brows: 'up', mouth: 'o' });
    s += pullLine(140, 1760, 700, 1500, 1) + chest(lerp(700, 150, pp), lerp(1500, 1760, pp) - Math.sin(pp * Math.PI) * 160, lerp(.8, .4, pp), t, 1);
    s += bushes(t, 1820, true);
    if (p > .55) s += popup(300, lerp(1500, 1380, seg(p, .55, 1)), '+R$ 3.200', 1, 96);
    s += `<rect width="${W}" height="${H}" fill="#c8a060" opacity=".14"/>`;
    return s + gameFG(t, true) + label('ONTEM', t) + vignette(true); } },
  // 08 A guilda mais rica (contra-plongée do castelo)
  { k: 'a guilda mais', z: [1.0, 1.1], c: [540, 1400], f: (t, p) => {
    let s = nightSky2(t, { mx: 220, my: 420 }) + castle2(540, 1900, 1.08, t);
    s += `<rect y="1880" width="${W}" height="60" fill="#0a0c18"/>`;
    s += crownEmblem(540, 520, .8 + .03 * Math.sin(t * 3));
    const rows = [['1º', 'COROA NEGRA', 'R$ 2.400.000', '#ffc928'], ['2º', 'LOBOS DO NORTE', 'R$ 610.000', '#cfd6da']];
    rows.forEach(([n, a, b, c], i) => { const k = easeOut(seg(p, .15 + i * .15, .4 + i * .15)); s += g(`<rect x="-420" y="-46" width="840" height="92" rx="18" fill="#0b0d10" opacity=".92" stroke="${c}" stroke-width="${i ? 2 : 5}"/>` + txt(-390, 16, n, 44, c, { a: 'start', w: 900 }) + txt(-300, 16, a, 40, '#fff', { a: 'start', w: 800 }) + txt(395, 16, b, 40, c, { a: 'end', w: 900 }), `translate(${tf(lerp(1500, 540, k))},${800 + i * 110})`); });
    return s + dust(t, 12, 14, '#cfd8ff', .4) + vignette(true); } },
  // 09 Um jogador idêntico viu tudo (revelação atrás do ombro)
  { k: 'e um jogador', z: [1.0, 1.12], c: [600, 1100], f: (t, p) => {
    let s = `<g filter="url(#b5)">${meadowNight(t, 3)}</g><rect width="${W}" height="${H}" fill="#000" opacity=".3"/>`;
    s += bushes(t, 1180, true);
    s += g(headG({ ...THIEF, eyes: 'dot', brows: 'serious', redEyes: p > .35 }), `translate(760,${tf(lerp(1330, 1050, easeOut(seg(p, .1, .5))))}) scale(1.5)`);
    s += bushes(t + 3, 1420, true);
    s += g(liveBust({ x: 0, y: 0, s: 1.9, ...THIEF, eyes: p > .65 ? 'wide' : 'dot', brows: p > .65 ? 'up' : 'serious', look: p > .65 ? 16 : -8 }, t), 'translate(250,1520)');
    if (p > .65) s += txt(430, 1150, '!', 180, '#ff3a3a', { w: 900, extra: `stroke="#000" stroke-width="12" paint-order="stroke" transform="rotate(8,430,1150)"` });
    return s + gameFG(t, true) + vignette(true); } },
  // 10 O clone não entrega: faz uma proposta
  { k: 'o clone não', z: [1.0, 1.06], c: [540, 1300], f: (t, p) => {
    let s = meadowNight(t, 4);
    s += thief(240, 1770, 1.12, t, { armR: lerp(-115, -25, easeOut(seg(p, .35, .7))), look: 12, brows: 'angry' });
    s += thief(840, 1770, 1.12, t + .5, { flip: true, armR: lerp(-10, -55, easeOut(seg(p, .2, .5))), armL: lerp(8, 150, easeOut(seg(p, .0, .3))), item: '', red: true });
    s += nameTag(240, 1010, 'CaioLadrão_07') + nameTag(840, 1010, 'CaioLadrão_07', '#ff8a8a');
    const b = pop(p, .3, .42);
    s += g(`<path d="M-150,-70 H150 a30,30 0 0 1 30,30 V40 a30,30 0 0 1 -30,30 H60 L30,120 L20,70 H-150 a30,30 0 0 1 -30,-30 V-40 a30,30 0 0 1 30,-30Z" fill="#0b0d10" opacity=".94" stroke="#ff8a8a" stroke-width="5"/>` + txt(0, 16, 'PROPOSTA', 48, '#ff8a8a', { w: 900, ls: 4 }), `translate(760,820) scale(${tf(b)})`);
    return s + gameFG(t, true) + hud(t) + vignette(); } },
  // 11 "Você pegou 3 mil."
  { k: 'você pegou três', z: [1.0, 1.06], c: [540, 700], f: (t, p) => {
    const m1 = 'Você pegou 3 mil.';
    let s = `<g filter="url(#b10)">${meadowNight(t, 4)}</g><rect width="${W}" height="${H}" fill="#000" opacity=".5"/>`;
    s += chatWin(540, 420, 'CaioLadrão_07', [[m1, Math.ceil(seg(p, .1, .7) * m1.length)], ['', 0]]);
    s += g(ruby(0, 0, .55, t), 'translate(350,1010)') + txt(650, 1040, 'R$ 3.200', 84, '#ff8a96', { w: 900, extra: 'stroke="#000" stroke-width="10" paint-order="stroke"' });
    return s + vignette(true); } },
  // 12 "Eu sei onde tem 240 mil." (comparação de escala)
  { k: 'eu sei onde', z: [1.0, 1.08], c: [540, 1100], f: (t, p) => {
    const m1 = 'Você pegou 3 mil.', m2 = 'Eu sei onde tem 240 mil.';
    let s = `<g filter="url(#b10)">${meadowNight(t, 4)}</g><rect width="${W}" height="${H}" fill="#000" opacity=".55"/>`;
    s += chatWin(540, 420, 'CaioLadrão_07', [[m1, m1.length], [m2, Math.ceil(seg(p, .05, .45) * m2.length)]]);
    const gr = easeOut(seg(p, .4, .85));
    s += g(ruby(0, 0, .3, t), 'translate(170,1040)') + txt(170, 1130, 'R$ 3.200', 38, '#ff8a96', { w: 900 });
    s += lootPile(700, 1150, .12 + .5 * gr, t) + txt(640, 1440, `R$ ${Math.round(lerp(3.2, 240, gr))}.000`, 64, '#ffc928', { w: 900, op: seg(p, .4, .5), extra: 'stroke="#000" stroke-width="10" paint-order="stroke"' });
    if (p > .8) s += g(`<circle r="86" fill="#ff3a3a"/>` + txt(0, 24, '×75', 70, '#fff', { w: 900 }), `translate(380,900) rotate(-10) scale(${tf(pop(p, .8, .9))})`);
    return s + vignette(true); } },
  // 13 O cofre da Coroa Negra (contra-plongée)
  { k: 'o cofre da', z: [1.0, 1.12], c: [540, 900], f: (t, p) => {
    let s = vaultRoom(t);
    s += knight(250, 1800, .82, t, { col: '#22252b' }) + knight(830, 1800, .82, t + 1, { col: '#2a2018', flip: true });
    return s + dust(t, 31, 26, '#ffcf8a', .5) + label('COFRE DA COROA NEGRA', t) + vignette(true); } },
  // 14 Abre só 10 segundos por noite (planta técnica)
  { k: 'ele abre só', z: [1.0, 1.06], c: [540, 900], f: (t, p) => {
    let s = `<rect width="${W}" height="${H}" fill="#0a1830"/>`; let grd = ''; for (let i = 0; i <= 18; i++) grd += `M${i * 60},0 V${H} `; for (let i = 0; i <= 32; i++) grd += `M0,${i * 60} H${W} `;
    s += `<path d="${grd}" stroke="#14305a" stroke-width="2"/>`;
    const n = Math.max(0, 10 - Math.floor(seg(p, .25, .95) * 10)), sw = seg(p, .25, .95);
    s += panel(540, 470, 640, 240, 'JANELA DE ABERTURA', `00:${String(n).padStart(2, '0')}`, n <= 3 ? '#ff5d5d' : '#7fc8ff');
    let bp = `<circle r="270" fill="#0e2244" stroke="#7fc8ff" stroke-width="6"/><circle r="214" fill="none" stroke="#7fc8ff" stroke-width="3" stroke-dasharray="14 10"/><circle r="88" fill="none" stroke="#7fc8ff" stroke-width="5"/>`;
    for (let i = 0; i < 5; i++) bp += `<path d="M0,0 V-130" stroke="#7fc8ff" stroke-width="8" stroke-linecap="round" transform="rotate(${tf(i * 72 + t * 60)})"/>`;
    for (let i = 0; i < 8; i++) bp += `<rect x="-14" y="-296" width="28" height="50" fill="#7fc8ff" opacity=".7" transform="rotate(${i * 45})"/>`;
    bp += `<path d="M0,-300 A300,300 0 ${sw > .5 ? 1 : 0} 1 ${tf(Math.sin(sw * 6.283) * 300)},${tf(-Math.cos(sw * 6.283) * 300)}" stroke="#ffc928" stroke-width="16" fill="none" stroke-linecap="round" filter="url(#glow)"/>`;
    s += g(bp, 'translate(540,960)') + `<path d="M860,960 h90 M130,960 h90" stroke="#7fc8ff" stroke-width="3"/>` + txt(950, 940, 'Ø 4 M', 28, '#7fc8ff', { a: 'end' }) + txt(130, 940, 'AÇO', 28, '#7fc8ff', { a: 'start' });
    s += g(`<rect x="-300" y="-44" width="600" height="88" rx="16" fill="#0e2244" stroke="#7fc8ff" stroke-width="3"/>` + txt(0, 14, 'SÓ 1 VEZ POR NOITE', 40, '#fff', { w: 800, ls: 3 }), 'translate(540,1480)');
    return s + vignette(); } },
  // 15 Troca de turno da líder
  { k: 'quando a líder', z: [1.08, 1.0], c: [540, 1300], f: (t, p) => {
    let s = vaultRoom(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".15"/>`;
    s += knight(190, 1790, .78, t, { col: '#22252b', armR: -150 }) + knight(900, 1790, .78, t + 1, { col: '#2a2018', flip: true, armR: -150 });
    s += leaderBody(lerp(330, 640, p), 1830 + Math.abs(Math.sin(t * 8)) * -8, 1.0, t, { walk: true, look: 6 });
    return s + dust(t, 31, 20, '#ffcf8a', .5) + label('TROCA DE TURNO · 23:59', t) + vignette(true); } },
  // 16 O plano visto de cima
  { k: 'eu distraio os', z: [1.0, 1.08], c: [540, 780], f: (t, p) => {
    const gp = easeInOut2(seg(p, .2, .75));
    let s = `<rect width="${W}" height="${H}" fill="#0e1118"/>`; let grd = ''; for (let i = 0; i <= 18; i++) grd += `M${i * 60},0 V${H} `; for (let i = 0; i <= 32; i++) grd += `M0,${i * 60} H${W} `;
    s += `<path d="${grd}" stroke="#161b26" stroke-width="2"/>`;
    s += `<rect x="190" y="430" width="700" height="700" fill="#141a26" stroke="#5a6a8a" stroke-width="16"/><rect x="470" y="1114" width="140" height="32" fill="#0e1118"/>` + [[190, 430], [890, 430], [190, 1130], [890, 1130]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="54" fill="#1b2333" stroke="#5a6a8a" stroke-width="12"/>`).join('');
    s += `<rect x="360" y="600" width="360" height="360" fill="#1b2333" stroke="#5a6a8a" stroke-width="10"/><circle cx="540" cy="780" r="60" fill="#ffc928" filter="url(#glow)"/>` + txt(540, 792, 'COFRE', 26, '#0b0d10', { w: 900 });
    s += `<circle cx="800" cy="560" r="360" fill="#3ad0c0" opacity=".07"/><circle cx="800" cy="560" r="360" fill="none" stroke="#3ad0c0" stroke-width="5" stroke-dasharray="26 14" transform="rotate(${tf(t * 8)},800,560)"/><path d="M800,560 L540,780" stroke="#3ad0c0" stroke-width="6" stroke-dasharray="14 10"/>` + txt(700, 640, '9 M', 40, '#3ad0c0', { w: 900 });
    s += `<circle cx="800" cy="560" r="26" fill="#3ad0c0" stroke="#fff" stroke-width="5"/>` + nameTag(800, 500, 'CAIO', '#3ad0c0');
    const cx = 540, cy = lerp(1000, 1290, gp);
    s += `<path d="M540,1000 V1290" stroke="#ff8a8a" stroke-width="5" stroke-dasharray="12 10" opacity=".6"/>`;
    for (let i = 0; i < 2; i++) { const a = (t * 1.2 + i / 2) % 1; s += `<circle cx="${cx}" cy="${tf(cy)}" r="${tf(30 + a * 70)}" fill="none" stroke="#ff8a8a" stroke-width="5" opacity="${tf(1 - a)}"/>`; }
    s += `<circle cx="${cx}" cy="${tf(cy)}" r="26" fill="#ff5d5d" stroke="#fff" stroke-width="5"/>` + nameTag(cx + 150, cy, 'CLONE', '#ff8a8a');
    [[470, 880], [610, 880]].forEach(([x, y], i) => { const k = easeInOut2(seg(p, .32 + i * .06, .9)); s += `<circle cx="${tf(lerp(x, 500 + i * 80, k))}" cy="${tf(lerp(y, 1190 + i * 20, k))}" r="20" fill="#c9a24a" stroke="#0b0d10" stroke-width="5"/>`; });
    s += g(`<rect x="-250" y="-40" width="500" height="80" rx="16" fill="#0b0d10" stroke="#ff8a8a" stroke-width="3"/>` + txt(0, 14, 'CLONE: DISTRAI', 36, '#ff8a8a', { ls: 2 }), 'translate(290,1480)') + g(`<rect x="-230" y="-40" width="460" height="80" rx="16" fill="#0b0d10" stroke="#3ad0c0" stroke-width="3"/>` + txt(0, 14, 'CAIO: PUXA', 36, '#3ad0c0', { ls: 2 }), `translate(800,1480) scale(${tf(pop(p, .55, .65))})`);
    return s + vignette(); } },
  // 17 Dividir no meio
  { k: 'a gente divide', z: [1.0, 1.08], c: [540, 1000], f: (t, p) => {
    const sp = easeOut(seg(p, .15, .55)) * 250;
    let s = `<rect width="${W}" height="${H}" fill="#0f0c06"/><ellipse cx="540" cy="1000" rx="620" ry="520" fill="#ffd24a" opacity=".16" filter="url(#b60)"/>`;
    s += `<clipPath id="hL"><rect x="0" y="0" width="540" height="${H}"/></clipPath><clipPath id="hR"><rect x="540" y="0" width="540" height="${H}"/></clipPath>`;
    s += `<g transform="translate(${tf(-sp)},0)"><g clip-path="url(#hL)">${lootPile(540, 1080, 1.0, t)}</g></g><g transform="translate(${tf(sp)},0)"><g clip-path="url(#hR)">${lootPile(540, 1080, 1.0, t)}</g></g>`;
    s += `<path d="M540,360 V1700" stroke="#fff" stroke-width="8" stroke-dasharray="30 20" opacity="${tf(seg(p, .15, .4))}"/>`;
    [[250, false], [830, true]].forEach(([x, red], i) => { s += g(headG({ ...THIEF, eyes: 'dot', brows: 'serious', redEyes: red }), `translate(${x},470) scale(1.0)`) + txt(x, 700, '50%', 110, red ? '#ff8a8a' : '#3ad0c0', { w: 900, op: seg(p, .4, .55), extra: 'stroke="#000" stroke-width="12" paint-order="stroke"' }) + txt(x, 1500, 'R$ 120 MIL', 54, '#ffc928', { w: 900, op: seg(p, .5, .65), extra: 'stroke="#000" stroke-width="10" paint-order="stroke"' }); });
    return s + vignette(true); } },
  // 18 Parece loucura (Caio na vida real)
  { k: 'parece loucura', z: [1.0, 1.1], c: [540, 950], f: (t, p) => {
    let s = `<g filter="url(#b5)">${room2(t)}</g><rect width="${W}" height="${H}" fill="#000" opacity=".25"/>`;
    s += liveBust({ x: 540, y: 1160, s: 2.45, ...REAL_CAIO, mouth: 'small', brows: 'sad', look: lerp(-12, 12, easeInOut2(p)) }, t);
    s += `<ellipse cx="900" cy="1300" rx="500" ry="700" fill="#3ad0c0" opacity=".12" filter="url(#b60)"/>`;
    return s + vignette(true); } },
  // 19 Já aconteceu de verdade (monitor antigo)
  { k: 'mas já aconteceu', z: [1.0, 1.15], c: [540, 860], f: (t, p) => {
    let s = `<rect width="${W}" height="${H}" fill="#12100e"/><ellipse cx="540" cy="860" rx="600" ry="560" fill="#7fd6ff" opacity=".12" filter="url(#b60)"/>`;
    s += `<rect x="130" y="440" width="820" height="760" rx="50" fill="#cfc6b0"/><rect x="130" y="440" width="820" height="760" rx="50" fill="#000" opacity=".12"/><rect x="150" y="460" width="780" height="700" rx="40" fill="#ddd4be"/><rect x="200" y="510" width="680" height="540" rx="46" fill="#03040a"/>`;
    s += `<clipPath id="crt"><rect x="200" y="510" width="680" height="540" rx="46"/></clipPath><g clip-path="url(#crt)">${g(spaceBG(t, 60), 'translate(200,510) scale(.63,.5)')}${spaceShip(lerp(300, 620, p), 800, .7, '#8a96a8', t)}`;
    for (let i = 0; i < 27; i++) s += `<rect x="200" y="${510 + i * 20}" width="680" height="6" fill="#000" opacity=".22"/>`;
    s += `<rect x="200" y="${tf(510 + ((t * 300) % 540))}" width="680" height="40" fill="#fff" opacity=".06"/></g>`;
    s += `<circle cx="820" cy="1104" r="14" fill="#4aff9a" filter="url(#glow)"/><rect x="220" y="1090" width="200" height="26" rx="8" fill="#b8ae96"/><path d="M420,1200 h240 l40,120 h-320Z" fill="#b8ae96"/>`;
    s += g(`<rect x="-230" y="-46" width="460" height="92" rx="16" fill="#c0222a"/>` + txt(0, 18, 'HISTÓRIA REAL', 52, '#fff', { w: 900, ls: 4 }), `translate(540,330) rotate(-3) scale(${tf(pop(p, .15, .3))})`);
    return s + vignette(true); } },
  // 20 2005, EVE Online
  { k: 'em 2005', z: [1.0, 1.1], c: [540, 1000], f: (t, p) => {
    let s = spaceBG(t);
    s += `<circle cx="900" cy="1560" r="420" fill="#1e3a5a"/><circle cx="830" cy="1490" r="420" fill="#3a6a8a" opacity=".45"/><ellipse cx="900" cy="1560" rx="640" ry="90" fill="none" stroke="#9ab8d0" stroke-width="16" opacity=".5" transform="rotate(-18,900,1560)"/><circle cx="900" cy="1560" r="440" fill="none" stroke="#7fd6ff" stroke-width="10" opacity=".25" filter="url(#b10)"/>`;
    s += station(240, 1010, .9, t);
    s += spaceShip(lerp(180, 640, p), 1280, 1.0, '#8a96a8', t) + spaceShip(lerp(60, 420, p), 1420, .55, '#6a7686', t + 1) + spaceShip(lerp(480, 860, p), 1120, .45, '#6a7686', t + 2) + spaceShip(lerp(-100, 240, p), 1180, .35, '#6a7686', t + 3);
    s += g(panel(0, 0, 600, 230, 'JOGO REAL', '2005', '#7fd6ff'), `translate(540,440) scale(${tf(pop(p, 0, .15))})`) + txt(540, 660, 'EVE ONLINE', 72, '#ffffff', { w: 900, ls: 10, op: seg(p, .25, .4), extra: 'filter="url(#glow)"' });
    return s + vignette(); } },
  // 21 Espiões infiltrados subindo de cargo
  { k: 'espiões passaram quase', z: [1.0, 1.06], c: [540, 900], f: (t, p) => {
    const st = p < .3 ? 0 : p < .6 ? 1 : 2;
    let s = `<rect width="${W}" height="${H}" fill="#0b0d12"/><ellipse cx="540" cy="900" rx="620" ry="800" fill="#2a3a6a" opacity=".2" filter="url(#b60)"/>`;
    const dir = [300, 780], man = [170, 417, 663, 910], mem = [130, 335, 540, 745, 950];
    let ln = ''; dir.forEach(x => ln += `M540,620 L${x},700 `); man.forEach((x, i) => ln += `M${dir[i < 2 ? 0 : 1]},890 L${x},970 `); mem.forEach((x, i) => ln += `M${man[Math.min(3, i)]},1130 L${x},1400 `);
    s += `<path d="${ln}" stroke="#2a3444" stroke-width="6" fill="none"/>`;
    s += orgNode(540, 520, 1, false, 'CEO');
    dir.forEach((x, i) => s += orgNode(x, 790, 1, st >= 2, 'DIRETOR'));
    man.forEach((x, i) => s += orgNode(x, 1050, .8, st >= 1 && (i === 1 || i === 2), 'GERENTE'));
    mem.forEach((x, i) => s += orgNode(x, 1480, .7, i === 1 || i === 3, 'MEMBRO'));
    const days = Math.floor(lerp(1, 300, seg(p, .05, .92)));
    s += panel(540, 280, 620, 200, 'INFILTRADOS HÁ', `DIA ${days}`, '#ff8a6a');
    return s + vignette(true); } },
  // 22 Numa única noite: hangares esvaziados
  { k: 'numa única noite', z: [1.0, 1.1], c: [540, 960], f: (t, p) => {
    const al = Math.abs(Math.sin(t * 6));
    let s = spaceBG(t, 70) + `<rect width="${W}" height="${H}" fill="#ff2a2a" opacity="${tf(.1 * al)}"/>`;
    s += station(300, 900, 1.5, t * 2);
    for (let i = 0; i < 9; i++) { const a = (p * 1.3 + i / 9) % 1; s += g(`<rect x="-34" y="-34" width="68" height="68" rx="8" fill="#c9a24a"/><path d="M-34,0 H34 M0,-34 V34" stroke="#7a5a1a" stroke-width="6"/>`, `translate(${tf(lerp(320, 1250, a))},${tf(900 + (i - 4) * 110 * a)}) rotate(${tf(a * 300 + i * 40)}) scale(${tf(.5 + a * .8)})`); }
    s += spaceShip(lerp(380, 1300, easeIn(p)), 620, .8, '#8a96a8', t) + spaceShip(lerp(340, 1200, easeIn(seg(p, .2, 1))), 1420, .7, '#6a7686', t + 1);
    s += g(`<rect x="-330" y="-46" width="660" height="92" rx="16" fill="#1a0505" stroke="#ff3a3a" stroke-width="5"/>` + txt(0, 16, 'HANGARES ESVAZIADOS', 46, '#ff8a8a', { w: 900, ls: 3 }), 'translate(540,360)');
    return s + vignette(true); } },
  // 23 US$ 16 mil
  { k: 'levaram o equivalente', z: [1.0, 1.08], c: [540, 860], f: (t, p) => {
    let s = spaceBG(t, 52) + `<rect width="${W}" height="${H}" fill="#000" opacity=".35"/>`;
    for (let i = 0; i < 16; i++) { const fl = (t * .7 + i / 16) % 1; s += coin(100 + (i * 137) % 880, lerp(1950, 200, fl), .9, t * 200 + i * 30).replace('<g transform', `<g opacity="${tf(Math.sin(fl * Math.PI))}" transform`); }
    const v = Math.floor(lerp(0, 16500, easeOut(seg(p, .1, .7))));
    s += g(panel(0, 0, 800, 320, 'EQUIVALENTE EM DINHEIRO REAL', `US$ ${v.toLocaleString('pt-BR')}`, '#7fffd0'), `translate(540,820) scale(${tf(pop(p, 0, .12))})`);
    s += txt(540, 1060, 'EM ITENS DO JOGO · 2005', 34, '#cfd6da', { ls: 4, op: seg(p, .4, .6) });
    return s + vignette(true); } },
  // 24 Meia-noite (plano geral do castelo)
  { k: 'meianoite', z: [1.16, 1.0], c: [540, 900], f: (t, p) => {
    let s = nightSky2(t) + castle2(540, 1820, 1.0, t) + `<rect y="1800" width="${W}" height="140" fill="#0a0c18"/>`;
    for (let i = 0; i < 3; i++) { const a = (t * .8 + i / 3) % 1; s += `<circle cx="540" cy="560" r="${tf(40 + a * 300)}" fill="none" stroke="#f4ecd0" stroke-width="${tf(8 * (1 - a))}" opacity="${tf(.6 * (1 - a))}"/>`; }
    s += txt(540, 340, '00:00', 150, '#f4ecd0', { w: 900, extra: 'filter="url(#glow)" stroke="#0b0d10" stroke-width="10" paint-order="stroke"' });
    return s + dust(t, 14, 16, '#cfd8ff', .4) + vignette(true); } },
  // 25 Caio no telhado, a 9 metros do cofre
  { k: 'caio no telhado', z: [1.0, 1.08], c: [540, 1300], f: (t, p) => {
    let s = nightSky2(t, { mx: 250, my: 380 }) + castle2(700, 1640, .62, t, { blur: 'b5' });
    s += g(liveBust({ x: 0, y: 0, s: 1.3, ...THIEF, look: -10 }, t), `translate(600,${tf(1200 + Math.sin(t * 2) * 4)})`);
    s += roofFG(t);
    s += `<path d="M150,1640 L420,1602 L450,1790 L170,1832Z" fill="#ffc45a" filter="url(#glow)"/><path d="M150,1640 L420,1602 L450,1790 L170,1832Z" fill="none" stroke="#141830" stroke-width="12"/><path d="M285,1621 L310,1811 M160,1736 L435,1696" stroke="#141830" stroke-width="8"/><path d="M150,1640 L420,1602 L560,900 L-60,980Z" fill="#ffc45a" opacity=".1" filter="url(#b18)"/>`;
    s += hand(500, 1470, .45, -20, { glove: true });
    const a = seg(p, .3, .6);
    s += `<path d="M560,1420 L${tf(lerp(560, 310, a))},${tf(lerp(1420, 1700, a))}" stroke="#3ad0c0" stroke-width="7" stroke-dasharray="16 12" filter="url(#glow)"/>`;
    if (p > .55) s += g(`<rect x="-100" y="-40" width="200" height="80" rx="16" fill="#0b0d10" opacity=".92" stroke="#3ad0c0" stroke-width="4"/>` + txt(0, 16, '9 M', 48, '#3ad0c0', { w: 900 }), `translate(360,1520) scale(${tf(pop(p, .55, .65))})`);
    return s + hud(t, { clock: '23:59:5' + Math.min(9, Math.floor(p * 10)) }) + label('TELHADO DO CASTELO', t) + vignette(); } },
  // 26 Coração disparado
  { k: 'o coração disparado', z: [1.0, 1.2], c: [540, 950], f: (t, p) => {
    const beat = Math.pow(Math.max(0, Math.sin(t * 9)), 6);
    let s = `<g filter="url(#b18)">${nightSky2(t, { mx: 250, my: 380 })}</g><rect width="${W}" height="${H}" fill="#000" opacity=".3"/>`;
    s += g(bust({ x: 0, y: 0, s: 3.0, ...THIEF, eyes: 'wide', brows: 'up', look: -6 }), `translate(540,1040) scale(${tf(1 + beat * .015)})`);
    const dy = (t * 160) % 260; s += `<path d="M0,0 q16,34 0,54 q-16,-20 0,-54Z" fill="#9fd6ff" opacity=".9" transform="translate(760,${tf(820 + dy)})"/>`;
    let ecg = 'M0,1500 '; for (let x = 0; x <= 1080; x += 20) { const ph = ((x / 1080 * 3 - t * 1.6) % 1 + 1) % 1; const y = ph < .06 ? -20 : ph < .1 ? 130 : ph < .14 ? -70 : ph < .18 ? 20 : 0; ecg += `L${x},${1500 - y} `; }
    s += `<path d="${ecg}" stroke="#ff3a3a" stroke-width="9" fill="none" stroke-linejoin="round" filter="url(#glow)"/>` + txt(900, 1400, `${150 + Math.floor(beat * 8)} BPM`, 48, '#ff5d5d', { w: 900, a: 'end' });
    s += `<rect width="${W}" height="${H}" fill="#ff0000" opacity="${tf(beat * .12)}"/>`;
    return s + vignette(true); } },
  // 27 Os guardas saem
  { k: 'os guardas saem', z: [1.0, 1.06], c: [540, 1250], f: (t, p) => {
    const fl = Math.abs(Math.sin(t * 14)) * (1 - p * .5);
    let s = vaultRoom(t) + `<ellipse cx="1150" cy="1300" rx="420" ry="620" fill="#ff8a3a" opacity="${tf(.25 * fl)}" filter="url(#b60)"/>`;
    const k = easeIn(seg(p, .15, 1));
    s += knight(lerp(300, 1250, k), 1800 - Math.abs(Math.sin(t * 9)) * 16, .82, t, { col: '#22252b', flip: true, armR: -60 }) + knight(lerp(760, 1500, k), 1800 - Math.abs(Math.sin(t * 9 + 1)) * 16, .82, t + 1, { col: '#2a2018', flip: true, armR: -60 });
    if (p < .4) s += txt(lerp(300, 500, k) , 1080, '!', 150, '#ffc928', { w: 900, extra: 'stroke="#000" stroke-width="12" paint-order="stroke"' }) + txt(760, 1080, '!', 150, '#ffc928', { w: 900, extra: 'stroke="#000" stroke-width="12" paint-order="stroke"' });
    return s + dust(t, 31, 20, '#ffcf8a', .5) + hud(t, { clock: '23:59:59', clockCol: '#ff8a6a' }) + vignette(true); } },
  // 28 A porta gira (close extremo)
  { k: 'a porta gira', z: [1.0, 1.22], c: [540, 900], f: (t, p) => {
    let s = `<rect width="${W}" height="${H}" fill="#16131c"/>`;
    for (let r = 0; r < 9; r++) for (let c = -1; c < 4; c++) s += `<rect x="${c * 360 + (r % 2) * 180 + 6}" y="${r * 220 + 6}" width="348" height="208" rx="12" fill="${(r + c) % 2 ? '#2c2736' : '#272331'}"/>`;
    s += vaultDoor2(540, 900, 1.3, t * 2, p * .46);
    s += sparks(540 - 500, 900, seg(p, .5, 1), 41, '#ffe08a') + sparks(540 + 500, 760, seg(p, .6, 1), 42, '#ffe08a');
    s += g(`<rect x="-150" y="-50" width="300" height="100" rx="20" fill="#0b0d10" opacity=".92" stroke="#ff5d5d" stroke-width="5"/>` + txt(0, 22, '00:10', 64, '#ff5d5d', { w: 900 }), 'translate(540,250)');
    return `<g transform="translate(${tf(Math.sin(t * 50) * 5 * p)},0)">${s}</g>` + vignette(true); } },
  // 29 Um... dois... (visão pela claraboia)
  { k: 'um dois', z: [1.0, 1.1], c: [540, 1000], f: (t, p) => {
    let s = g(vaultRoom(t, { open: 1, inside: lootPile(0, 260, .8, t) }), 'translate(54,96) scale(.9)');
    s += skyFrame;
    s += hand(540, lerp(2200, 1700, easeOut(seg(p, 0, .4))), 1.8, 0, { glove: true, sleeve: '#2f5f6a' });
    s += txt(540, 620, p < .5 ? '1' : '2', 320, '#ffffff', { w: 900, extra: `stroke="#000" stroke-width="18" paint-order="stroke" transform="translate(540,520) scale(${tf(pop(p % .5, 0, .08))}) translate(-540,-520)"` });
    s += g(`<rect x="-130" y="-44" width="260" height="88" rx="18" fill="#0b0d10" opacity=".92" stroke="#ff5d5d" stroke-width="4"/>` + txt(0, 20, p < .5 ? '00:08' : '00:07', 54, '#ff5d5d', { w: 900 }), 'translate(820,200)');
    return s + vignette(true); } },
  // 30 Mão Leve!
  { k: 'mão leve', z: [1.08, 1.0], c: [540, 1100], f: (t, p) => {
    const pp = easeIn(seg(p, .05, .7));
    let s = g(vaultRoom(t, { open: 1 }), 'translate(54,96) scale(.9)');
    s += `<path d="M540,1720 Q${tf(540 + 240 * (1 - pp))},1300 540,900" stroke="#ffd24a" stroke-width="12" fill="none" stroke-dasharray="30 14" filter="url(#glow)"/>`;
    s += lootPile(540 + Math.sin(pp * Math.PI) * 120, lerp(1060, 1760, pp), lerp(.72, .25, pp), t);
    for (let i = 0; i < 10; i++) { const a = clamp(pp * 1.4 - i * .05); s += coin(540 + Math.sin(a * Math.PI + i) * 160, lerp(980, 1740, a), .7, t * 300 + i * 40).replace('<g transform', `<g opacity="${a > 0 && a < 1 ? 1 : 0}" transform`); }
    s += skyFrame + hand(540, 1700, 1.8, Math.sin(t * 30) * 2, { glove: true, sleeve: '#2f5f6a' });
    s += `<rect width="${W}" height="${H}" fill="#ffd24a" opacity="${tf(.5 * (1 - seg(p, 0, .2)))}"/>` + popup(540, 560, 'MÃO LEVE!', 1, 140);
    return s + vignette(true); } },
  // 31 R$ 240 mil somem do cofre
  { k: 'duzentos e quarenta', z: [1.0, 1.08], c: [540, 1000], f: (t, p) => {
    let s = `<rect width="${W}" height="${H}" fill="#16131c"/>`;
    for (let r = 0; r < 9; r++) for (let c = -1; c < 4; c++) s += `<rect x="${c * 360 + (r % 2) * 180 + 6}" y="${r * 220 + 6}" width="348" height="208" rx="12" fill="${(r + c) % 2 ? '#2c2736' : '#272331'}"/>`;
    const roll = seg(p, .2, .9);
    s += vaultDoor2(600, 1060, 1.15, t, 1, { glow: lerp(1, .22, seg(p, .05, .5)), inside: `<path d="M-330,150 H330" stroke="#3a2c14" stroke-width="20"/>` + coin(lerp(-200, 160, easeOut(roll)), 110, .8, roll * 900) });
    const r = rng(31); for (let i = 0; i < 22; i++) { const a = seg(p, 0, .6); s += `<circle cx="${tf(600 + (r() - .5) * 700 * (0.3 + a))}" cy="${tf(1060 - r() * 400 * a)}" r="${tf(4 + r() * 7)}" fill="#ffd24a" opacity="${tf(1 - a)}"/>`; }
    const v = Math.floor(lerp(240000, 0, easeIn(seg(p, .08, .55))));
    s += panel(540, 380, 760, 260, 'COFRE DA COROA NEGRA', `R$ ${v.toLocaleString('pt-BR')}`, v ? '#ffc928' : '#ff5d5d');
    return s + dust(t, 8, 24, '#ffe9b0', .5) + vignette(true); } },
  // 32 O celular vibra
  { k: 'o celular vibra', z: [1.0, 1.1], c: [540, 1000], f: (t, p) => {
    const vib = Math.sin(t * 90) * 9 * (p < .8 ? 1 : 0);
    let s = `<g filter="url(#b5)">${room2(t, { paid: true })}</g><rect width="${W}" height="${H}" fill="#000" opacity=".45"/>`;
    const sc = `<rect x="-106" y="-212" width="212" height="424" rx="26" fill="#0c1218"/>` + txt(0, -110, '00:00', 54, '#fff', { w: 800 }) + txt(0, -76, 'segunda-feira', 16, '#9ab', { fam: 'NU' }) + `<rect x="-94" y="-30" width="188" height="80" rx="16" fill="#1c2a36"/><circle cx="-66" cy="10" r="18" fill="#32bcad"/>` + txt(-40, 4, 'MEU BANCO', 14, '#9ab', { a: 'start', ls: 1 }) + txt(-40, 26, 'Nova movimentação', 15, '#fff', { a: 'start', fam: 'NU', w: 800 });
    s += g(phone(0, 0, 2.3, 0, sc), `translate(${tf(540 + vib)},960) rotate(${tf(vib * .15)})`);
    for (const sd of [-1, 1]) for (let i = 0; i < 3; i++) s += `<path d="M${540 + sd * (330 + i * 46)},${760} q${sd * 30},200 0,400" stroke="#fff" stroke-width="8" fill="none" opacity="${tf((.6 - i * .18) * Math.abs(Math.sin(t * 20)))}" stroke-linecap="round"/>`;
    return s + vignette(true); } },
  // 33 Saldo: R$ 37
  { k: 'saldo trinta', z: [1.0, 1.14], c: [540, 700], f: (t, p) => {
    let s = `<g filter="url(#b10)">${room2(t, { paid: true })}</g><rect width="${W}" height="${H}" fill="#000" opacity=".55"/>`;
    s += bankPhone(540, 740, 2.6, -2, 'R$ 37,00', '#ff8a8a', [['Aluguel', '2 meses · ontem', '-R$ 3.200'], ['Pix · Áurea', 'ontem', '+R$ 3.200']], 'nenhuma entrada hoje');
    s += `<circle cx="540" cy="610" r="${tf(240 + 30 * Math.sin(t * 6))}" fill="none" stroke="#ff3a3a" stroke-width="8" opacity="${tf(.7 * seg(p, .3, .5))}" filter="url(#glow)"/>`;
    return s + vignette(true); } },
  // 34 Não caiu nada (close no rosto)
  { k: 'não caiu nada', z: [1.0, 1.14], c: [540, 950], f: (t, p) => {
    let s = `<g filter="url(#b5)">${room2(t, { paid: true })}</g><rect width="${W}" height="${H}" fill="#000" opacity=".3"/>`;
    s += bust({ x: 540, y: 1150, s: 2.6, ...REAL_CAIO, eyes: 'wide', brows: 'up', mouth: 'o', look: 0 });
    s += `<ellipse cx="540" cy="1900" rx="600" ry="500" fill="#ff5d5d" opacity=".18" filter="url(#b60)"/>`;
    s += txt(840, 640, '?', 200, '#fff', { w: 900, op: seg(p, .2, .35), extra: 'stroke="#000" stroke-width="12" paint-order="stroke" transform="rotate(12,840,640)"' });
    return s + vignette(true); } },
  // 35 O dinheiro foi pra outra conta
  { k: 'o dinheiro foi', z: [1.0, 1.06], c: [540, 800], f: (t, p) => {
    let s = `<rect width="${W}" height="${H}" fill="#0b0d12"/>`; let grd = ''; for (let i = 0; i <= 18; i++) grd += `M${i * 60},0 V${H} `; for (let i = 0; i <= 32; i++) grd += `M0,${i * 60} H${W} `;
    s += `<path d="${grd}" stroke="#141922" stroke-width="2"/>`;
    s += g(`<circle r="120" fill="#3c414b" stroke="#c9a24a" stroke-width="10"/><circle r="50" fill="#22252b" stroke="#c9a24a" stroke-width="6"/>` + [0, 72, 144, 216, 288].map(a => `<rect x="-6" y="-80" width="12" height="80" fill="#9aa0ac" transform="rotate(${a + t * 30})"/>`).join(''), 'translate(540,440)') + txt(540, 620, 'COFRE', 34, '#c9a24a', { ls: 4 });
    s += `<path d="M540,640 C540,800 270,760 270,900" stroke="#3a4558" stroke-width="10" fill="none" stroke-dasharray="20 16"/><path d="M540,640 C540,800 810,760 810,900" stroke="#ffc928" stroke-width="12" fill="none" filter="url(#glow)"/>`;
    for (let i = 0; i < 6; i++) { const a = (t * .9 + i / 6) % 1, x = lerp(540, 810, easeInOut2(a)), y = lerp(640, 900, a); s += coin(x, y, .55, t * 300 + i * 60); }
    s += g(`<rect x="-220" y="-110" width="440" height="220" rx="24" fill="#12161e" stroke="#3a4558" stroke-width="5"/>` + txt(0, -40, 'CONTA DO CAIO', 30, '#9aa6ae', { ls: 2 }) + txt(0, 40, 'R$ 0', 80, '#5a6474', { w: 900 }) + `<path d="M-150,-70 L150,70 M150,-70 L-150,70" stroke="#ff3a3a" stroke-width="16" stroke-linecap="round" opacity="${tf(seg(p, .2, .35))}"/>`, 'translate(270,1010)');
    s += g(`<rect x="-230" y="-110" width="460" height="220" rx="24" fill="#1a1608" stroke="#ffc928" stroke-width="6"/>` + txt(0, -40, 'OUTRA CONTA', 30, '#ffc928', { ls: 2 }) + txt(0, 44, `+${Math.round(240 * easeOut(seg(p, .2, .9)))} MIL`, 84, '#ffc928', { w: 900 }), 'translate(810,1010)');
    s += txt(810, 1470, '???', 160, '#ffc928', { w: 900, op: .5 + .5 * Math.sin(t * 6), extra: 'filter="url(#glow)"' });
    return s + vignette(); } },
  // 36 A da líder da Coroa Negra
  { k: 'a da líder', z: [1.0, 1.1], c: [540, 950], f: (t, p) => {
    let s = `<rect width="${W}" height="${H}" fill="#08090b"/><ellipse cx="540" cy="900" rx="520" ry="640" fill="#c9a24a" opacity=".16" filter="url(#b60)"/>` + crownEmblem(540, 640, 1.5).replace('<g transform', '<g opacity=".28" transform');
    s += liveBust({ x: 540, y: 1180, s: 2.3, ...LEADER, mouth: 'smile', eyes: p > .6 ? 'closed' : 'dot', brows: p > .6 ? 'up' : 'serious' }, t);
    s += g(pixPhone2('RECEBIDO', '+R$ 240 MIL'), `translate(860,${tf(lerp(2000, 1560, easeOut(seg(p, 0, .35))))}) rotate(10)`);
    s += g(`<rect x="-300" y="-44" width="600" height="88" rx="16" fill="#0b0d10" opacity=".92" stroke="#c9a24a" stroke-width="4"/>` + txt(0, 16, 'LÍDER · COROA NEGRA', 42, '#c9a24a', { w: 800, ls: 3 }), `translate(540,400) scale(${tf(pop(p, .1, .25))})`);
    return s + dust(t, 3, 16, '#ffd24a', .5) + vignette(true); } },
  // 37 O clone tira o lenço
  { k: 'o clone tira', z: [1.0, 1.12], c: [540, 1000], f: (t, p) => {
    const pull = easeIn(seg(p, .45, .95));
    let s = `<g filter="url(#b10)">${nightSky2(t)}${castle2(540, 1900, .8, t)}</g><rect width="${W}" height="${H}" fill="#000" opacity=".3"/>`;
    s += bust({ x: 540, y: 1080, s: 2.6, ...THIEF, mask: pull < .25, mouth: 'smile', eyes: 'dot', brows: 'serious', redEyes: pull < .6, breath: t });
    if (pull >= .25) s += `<path d="M-160,-40 C-80,-60 80,-60 160,-40 L150,40 C100,100 -100,100 -150,40Z" fill="#1d3a42" stroke="#4a8a96" stroke-width="8" transform="translate(${tf(540 + 60 * pull)},${tf(1180 + 560 * pull)}) rotate(${tf(30 * pull)})"/>`;
    s += hand(lerp(980, 730, easeOut(seg(p, 0, .4))) + 60 * pull, lerp(1800, 1330, easeOut(seg(p, 0, .4))) + 560 * pull, .9, -28, { glove: true, sleeve: '#2f5f6a' });
    return s + vignette(true); } },
  // 38 É ela
  { k: 'é ela', z: [1.18, 1.0], c: [540, 950], f: (t, p) => {
    let s = `<g filter="url(#b10)">${nightSky2(t)}${castle2(540, 1900, .8, t)}</g><rect width="${W}" height="${H}" fill="#000" opacity=".2"/><ellipse cx="540" cy="1000" rx="520" ry="640" fill="#c9a24a" opacity=".18" filter="url(#b60)"/>`;
    s += `<path d="M250,1420 C200,1180 330,1090 540,1100 C750,1090 880,1180 830,1420Z" fill="#244b54"/>`;
    s += liveBust({ x: 540, y: 1080, s: 2.6, hair: 'marina', hairCol: '#14110f', top: '#2f5f6a', outfit: 'hoodie', mouth: 'smile', eyes: 'dot', brows: 'serious' }, t);
    const sw = p > .45;
    s += g(`<rect x="-330" y="-48" width="660" height="96" rx="18" fill="#0b0d10" opacity=".94" stroke="${sw ? '#c9a24a' : '#ff8a8a'}" stroke-width="5"/>` + txt(0, 18, sw ? 'LÍDER DA COROA NEGRA' : 'CaioLadrão_07', 46, sw ? '#c9a24a' : '#ff8a8a', { w: 900, ls: sw ? 2 : 0 }), `translate(${tf(540 + (Math.abs(p - .45) < .06 ? Math.sin(t * 90) * 14 : 0))},430)`);
    s += `<rect width="${W}" height="${H}" fill="#fff" opacity="${tf(1 - seg(p, 0, .22))}"/>`;
    return s + dust(t, 3, 16, '#ffd24a', .5) + vignette(true); } },
  // 39 Ela desviou o dinheiro da própria guilda (contra-plongée)
  { k: 'ela desviou o', z: [1.0, 1.1], c: [540, 1300], f: (t, p) => {
    let s = nightSky2(t, { seed: 5, mx: 200, my: 360 }) + castle2(540, 2100, 1.3, t) + `<path d="M0,1920 L540,500 L1080,1920Z" fill="#c9a24a" opacity=".08"/>`;
    for (let i = 0; i < 12; i++) { const a = (t * .6 + i / 12) % 1, sd = i % 2 ? 1 : -1; s += coin(lerp(540 + sd * 430, 540, easeIn(a)), lerp(900 - (i % 3) * 180, 1500, a) - Math.sin(a * Math.PI) * 240, .65, t * 300 + i * 50).replace('<g transform', `<g opacity="${tf(Math.sin(a * Math.PI))}" transform`); }
    s += leaderBody(540, 1960, 1.7, t, { armR: -50, armL: 50, eyes: 'closed', brows: 'up' });
    return s + dust(t, 6, 14, '#ffd24a', .5) + vignette(true); } },
  // 40 Precisava de um culpado (plongée, holofote)
  { k: 'e precisava de', z: [1.0, 1.12], c: [540, 1100], f: (t, p) => {
    let s = `<rect width="${W}" height="${H}" fill="#07080c"/><path d="M400,0 L680,0 L900,1500 L180,1500Z" fill="#fff" opacity=".07"/><ellipse cx="540" cy="1500" rx="370" ry="120" fill="#fff6d8" opacity=".3" filter="url(#b18)"/>`;
    s += `<ellipse cx="640" cy="1560" rx="260" ry="40" fill="#000" opacity=".5" filter="url(#b10)"/>`;
    s += thief(540, 1520, .72, t, { eyes: 'wide', brows: 'up', item: '', armR: -30, armL: 30 });
    s += g(`<circle r="250" fill="none" stroke="#ff3a3a" stroke-width="8" stroke-dasharray="60 30"/><path d="M-300,0 H-200 M200,0 H300 M0,-300 V-200 M0,200 V300" stroke="#ff3a3a" stroke-width="10"/>`, `translate(540,1250) rotate(${tf(t * 40)}) scale(${tf(lerp(1.8, 1, easeOut(seg(p, 0, .4))))})`, 'filter="url(#glow)"');
    s += g(`<rect x="-330" y="-90" width="660" height="180" rx="16" fill="none" stroke="#ff3a3a" stroke-width="14"/>` + txt(0, 44, 'CULPADO', 130, '#ff3a3a', { w: 900, ls: 8 }), `translate(540,560) rotate(-10) scale(${tf(p < .45 ? 0.001 : lerp(2.2, 1, easeOut(seg(p, .45, .58))))})`);
    return s + vignette(true); } },
  // 41 Por isso o mesmo nome
  { k: 'por isso o', z: [1.0, 1.08], c: [540, 900], f: (t, p) => {
    const m = easeInOut2(seg(p, .3, .75));
    let s = `<rect width="${W}" height="${H}" fill="#08090b"/><ellipse cx="540" cy="800" rx="600" ry="600" fill="#ff3a3a" opacity="${tf(.14 * m)}" filter="url(#b60)"/>`;
    s += liveBust({ x: 270, y: 640, s: 1.15, ...THIEF }, t);
    s += bust({ x: 810, y: 640, s: 1.15, hair: 'marina', hairCol: '#14110f', top: '#2f5f6a', outfit: 'hoodie', mouth: 'smile', eyes: 'dot', brows: 'serious', breath: t });
    for (const [x0, c] of [[280, '#fff'], [800, '#ff8a8a']]) s += g(`<rect x="-240" y="-44" width="480" height="88" rx="16" fill="#0b0d10" stroke="${c}" stroke-width="4" opacity="${tf(1 - m * .5)}"/>` + txt(0, 16, 'CaioLadrão_07', 46, c, { w: 900 }), `translate(${tf(lerp(x0 === 280 ? 270 : 810, 540, m))},${tf(lerp(1400, 1480, m))})`);
    if (m > .95) s += g(`<rect x="-300" y="-56" width="600" height="112" rx="20" fill="#1a0505" stroke="#ff3a3a" stroke-width="7"/>` + txt(0, 22, 'CaioLadrão_07', 62, '#fff', { w: 900 }), `translate(540,1480) scale(${tf(pop(p, .74, .84))})`, 'filter="url(#glow)"');
    s += txt(540, 720, '=', 200, '#fff', { w: 900, op: m });
    return s + vignette(true); } },
  // 42 Registro do servidor
  { k: 'no registro do', z: [1.0, 1.06], c: [540, 800], f: (t, p) => {
    let s = `<rect width="${W}" height="${H}" fill="#050807"/>`;
    s += `<rect x="50" y="330" width="980" height="820" rx="22" fill="#08110d" stroke="#1c3a2a" stroke-width="4"/><rect x="50" y="330" width="980" height="70" rx="22" fill="#0e1f17"/><circle cx="96" cy="365" r="12" fill="#ff5d5d"/><circle cx="134" cy="365" r="12" fill="#ffc928"/><circle cx="172" cy="365" r="12" fill="#4aff9a"/>` + txt(540, 376, 'servidor-sul · log de auditoria', 28, '#7fbf9a', { fam: 'RC', w: 700 });
    const lines = ['[23:59:59] cofre.coroa_negra ABERTO', '[00:00:02] habilidade usada: MÃO LEVE', '[00:00:02] alcance: 9,0 m', '[00:00:03] itens transferidos: 41', '[00:00:03] valor: R$ 240.000', '[00:00:09] cofre.coroa_negra FECHADO', '> buscar autor...'];
    lines.forEach((l, i) => { const k = seg(p, i * .09, i * .09 + .12); if (k > 0) s += txt(90, 480 + i * 84, typed(l, k), 40, i === 4 ? '#ffc928' : '#4aff9a', { a: 'start', fam: 'RC', w: 700 }); });
    if (Math.floor(t * 3) % 2) s += `<rect x="${tf(90 + 330 * seg(p, .54, .66))}" y="${480 + 6 * 84 - 34}" width="20" height="42" fill="#4aff9a"/>`;
    for (let i = 0; i < 48; i++) s += `<rect x="50" y="${330 + i * 17}" width="980" height="3" fill="#000" opacity=".25"/>`;
    return s + vignette(true); } },
  // 43 CaioLadrão_07
  { k: 'caioladrão07', z: [1.0, 1.15], c: [540, 860], f: (t, p) => {
    const gl = (Math.floor(t * 16) % 4 === 0) ? 12 : 0, al = Math.abs(Math.sin(t * 7));
    let s = `<rect width="${W}" height="${H}" fill="#120405"/><rect width="${W}" height="${H}" fill="#ff1a1a" opacity="${tf(.12 + .14 * al)}"/>`;
    for (const a of [t * 120, t * 120 + 180]) s += `<path d="M540,860 L${tf(540 + Math.cos(a / 57.3) * 1600)},${tf(860 + Math.sin(a / 57.3) * 1600)} L${tf(540 + Math.cos((a + 24) / 57.3) * 1600)},${tf(860 + Math.sin((a + 24) / 57.3) * 1600)}Z" fill="#ff3a3a" opacity=".12"/>`;
    s += g(`<circle r="190" fill="#1a0505" stroke="#ff3a3a" stroke-width="10"/>` + g(headG({ ...THIEF, eyes: 'dot', brows: 'serious' }), 'translate(0,20) scale(1.25)'), 'translate(540,600)');
    s += txt(540, 900, 'LADRÃO IDENTIFICADO', 48, '#ff8a8a', { w: 800, ls: 6 });
    for (const [dx, c, o] of [[-gl, '#00e5ff', .6], [gl, '#ff2a6a', .6], [0, '#fff', 1]]) s += txt(540 + dx, 1050, 'CaioLadrão_07', 136, c, { w: 900, op: o });
    s += `<rect x="60" y="930" width="960" height="170" rx="18" fill="none" stroke="#ff3a3a" stroke-width="8"/>`;
    return s + vignette(true); } },
  // 44 Cinco jogadores nível 80 caçando ele
  { k: 'agora cinco jogadores', z: [1.1, 1.0], c: [540, 1300], f: (t, p) => {
    let s = meadowNight(t, 9) + `<rect width="${W}" height="${H}" fill="#300" opacity=".25"/>`;
    const sc = lerp(.52, .72, p);
    [[150, '#22252b'], [345, '#2a2018'], [540, '#121418'], [735, '#2a2018'], [930, '#22252b']].forEach(([x, c], i) => {
      const y = 1860 - (i === 2 ? 0 : 30) - 26 * Math.abs(Math.sin(t * 6 + i));
      s += torch(x + 80 * sc, y - 520 * sc, .7 * sc + .2, t + i);
      s += knight(x, y, i === 2 ? sc * 1.1 : sc, t + i, { col: c, flip: x > 540, armR: -40 + 20 * Math.sin(t * 6 + i), brows: 'angry' });
      s += nameTag(x, y - 800 * sc - (i === 2 ? 60 : 0), 'NV 80', '#ffc928');
    });
    s += g(`<rect x="-260" y="-330" width="520" height="660" fill="#e9dcbc" filter="url(#sh)"/><rect x="-236" y="-306" width="472" height="612" fill="none" stroke="#8a6a3a" stroke-width="5"/>` + txt(0, -226, 'PROCURADO', 80, '#5a1010', { w: 900, ls: 6 }) + `<rect x="-130" y="-190" width="260" height="260" fill="#d6c6a0"/>` + g(headG({ ...THIEF, eyes: 'dot', brows: 'serious' }), 'translate(0,-50) scale(.95)') + txt(0, 150, 'CaioLadrão_07', 54, '#2a1a0a', { w: 900 }) + txt(0, 220, 'RECOMPENSA', 30, '#5a1010', { ls: 6 }) + txt(0, 280, 'R$ 50 MIL', 56, '#5a1010', { w: 900 }), `translate(540,${tf(lerp(-420, 640, easeOut(seg(p, 0, .25))))}) rotate(${tf(-4 + Math.sin(t * 2) * 1.5)}) scale(.86)`);
    return s + gameFG(t, true) + vignette(true); } },
  // 45 Endereço postado no chat (câmera inclinada)
  { k: 'e alguém acabou', z: [1.0, 1.1], c: [540, 1000], f: (t, p) => {
    let s = `<g transform="rotate(-6,540,960) scale(1.08) translate(-40,-60)">` + room2(t, { helmet: true, paid: true }) + `</g><rect width="${W}" height="${H}" fill="#000" opacity=".45"/>`;
    s += bust({ x: 300, y: 1480, s: 1.6, ...REAL_CAIO, eyes: 'wide', brows: 'up', mouth: 'o', look: 8 });
    s += g(`<rect x="-420" y="-40" width="840" height="80" rx="18" fill="#0b0d10" opacity=".94" stroke="#c9a24a" stroke-width="3"/>` + txt(-390, 14, 'CHAT DO SERVIDOR · 4.812 online', 32, '#c9a24a', { a: 'start', ls: 2 }), 'translate(560,310)');
    const msgs = [['LoboDoNorte', 'achei o ladrão kkkk'], ['Coroa_Valk', 'cadê ele?? quero o nome'], ['anônimo', 'Rua ████, 214 · apto 3']];
    msgs.forEach(([u, m], i) => { const a = seg(p, .08 + i * .22, .2 + i * .22), hot = i === 2; s += g(`<rect x="-420" y="-64" width="840" height="128" rx="22" fill="${hot ? '#3a0a0a' : '#0b0d10'}" opacity=".95" stroke="${hot ? '#ff3a3a' : '#2a3038'}" stroke-width="${hot ? 6 : 3}"/>` + txt(-388, -14, u, 30, hot ? '#ff8a8a' : '#c9a24a', { a: 'start' }) + txt(-388, 38, m, 42, '#fff', { a: 'start', fam: 'NU', w: 800 }), `translate(${tf(560 + 40 * (1 - a))},${440 + i * 150})`).replace('<g transform', `<g opacity="${tf(a)}" transform`); });
    if (p > .62) s += g(`<circle r="46" fill="#ff3a3a"/>` + txt(0, 16, '99+', 40, '#fff', { w: 900 }), `translate(960,${740}) scale(${tf(pop(p, .62, .72))})`);
    return s + vignette(true); } },
  // 46 Comenta A
  { k: 'comenta a', z: [1.04, 1.0], f: (t, p) => abA(t) + vignette(true) },
  // 47 ou B
  { k: 'ou b se', z: [1, 1], f: (t, p) => {
    const sp = easeOut(seg(p, 0, .2)), half = W / 2;
    let s = `<defs><clipPath id="c2A"><rect x="0" y="0" width="${tf(lerp(W, half, sp))}" height="${H}"/></clipPath><clipPath id="c2B"><rect x="${tf(lerp(W, half, sp))}" y="0" width="${W}" height="${H}"/></clipPath></defs>`;
    s += `<g clip-path="url(#c2A)">${g(abA(t), `translate(${tf(lerp(0, -270, sp))},0)`)}</g><g clip-path="url(#c2B)">${g(abB(t), `translate(${tf(lerp(540, 270, sp))},0)`)}</g><rect x="${half - 4}" y="0" width="8" height="${H}" fill="#fff" opacity="${tf(sp)}"/>`;
    s += g(`<rect x="-240" y="-58" width="480" height="116" rx="26" fill="#ffc928"/>` + txt(0, 24, 'COMENTA AÍ', 68, '#0b0d10', { w: 900, ls: 3 }), `translate(540,${tf(lerp(2100, 1430, easeOut(seg(p, .25, .4))))}) scale(${tf(1 + .04 * Math.sin(t * 6))})`);
    s += txt(540, 1550, 'PARTE 3: VOCÊ DECIDE', 40, '#fff', { w: 800, ls: 4, op: seg(p, .45, .6), extra: 'stroke="#000" stroke-width="8" paint-order="stroke"' });
    return s + vignette(true); } },
);
function pixPhone2(title, val) {
  return phone(0, 0, 1.15, 0, `<rect x="-106" y="-212" width="212" height="424" rx="26" fill="#14110a"/><circle cx="0" cy="-120" r="38" fill="#c9a24a"/>` + txt(0, -108, 'PIX', 22, '#0b0d10', { w: 900 }) + txt(0, -30, title, 20, '#9aa6ae', { ls: 1 }) + txt(0, 30, val, 34, '#ffc928', { w: 900 }) + txt(0, 70, 'conta: COROA NEGRA', 13, '#cfd6da', { fam: 'NU' }));
}
