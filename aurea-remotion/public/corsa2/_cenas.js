
// ---------- rosto de frente com barba (seu Jorge) ----------
function face2(o) {
  let s = face2base(o.must ? { ...o, mouth: o.mouth === 'open' ? 'open' : o.mouth === 'smile' ? 'smile' : 'flat' } : o);
  if (o.beard) s += `<path d="M-58,10 C-56,70 -24,96 0,96 C24,96 56,70 58,10 C46,40 30,52 0,52 C-30,52 -46,40 -58,10Z" fill="${o.beard}"/>`;
  if (o.must) s += `<path d="M-30,26 C-20,16 -6,20 0,24 C6,20 20,16 30,26 C24,34 10,32 0,30 C-10,32 -24,34 -30,26Z" fill="${o.must}"/>`;
  if (o.cap) s += `<path d="M-68,-40 C-70,-110 70,-110 68,-40Z" fill="${o.cap}"/><path d="M-70,-44 C-30,-54 60,-56 110,-34 C90,-24 40,-30 -70,-36Z" fill="${o.cap}"/><path d="M-70,-44 C-30,-54 60,-56 110,-34" stroke="#000" stroke-width="4" opacity=".25" fill="none"/>`;
  if (o.sweat) for (const [x, y, k] of [[-46, -50, 0], [50, -40, .4], [56, 4, .7]]) { const yy = y + ((o.sweat * 40 + k * 40) % 40); s += `<path d="M${x},${yy - 14} C${x + 9},${yy} ${x + 9},${yy + 10} ${x},${yy + 10} C${x - 9},${yy + 10} ${x - 9},${yy} ${x},${yy - 14}Z" fill="#bfe6ff" stroke="#6aa8d8" stroke-width="2"/>`; }
  if (o.mouth === 'laugh') s += `<path d="M-30,22 Q0,84 30,22 Z" fill="#4a1810"/><path d="M-26,24 L26,24 L24,32 L-24,32Z" fill="#fff"/>`;
  return s;
}
const JF = { hair: 'none', top: '#35557f', outfit: 'shirt', cap: '#c0392b', must: '#bdbdbd', beard: '#bdbdbd' };
const LF = { hair: 'short', hairCol: '#2a1d17', top: '#2f4f86', outfit: 'hoodie' };

// ---------- objetos ----------
function ponteira(x, y, s, t, o = {}) {
  const sh = o.shake ? Math.sin(t * 90) * 6 * o.shake : 0, id = uid('pt');
  let p = `<defs>${linGrad(id, [[0, '#ffffff'], [.25, '#9aa2ac'], [.5, '#f2f5f8'], [.75, '#6a7078'], [1, '#d8dde2']])}</defs>`;
  p += g(`<path d="M0,-70 L330,-48 C350,-46 350,46 330,48 L0,70 Z" fill="url(#${id})"/><ellipse cx="330" cy="0" rx="18" ry="48" fill="#8a9098"/>`, 'rotate(-6)');
  p += g(`<path d="M-120,-80 L0,-70 L0,70 L-120,82 Z" fill="url(#${id})"/>`, 'rotate(8)');
  p += `<ellipse cx="-120" cy="2" rx="30" ry="82" fill="#cfd5db" transform="rotate(8)"/><ellipse cx="-118" cy="2" rx="20" ry="66" fill="#0e0f12" transform="rotate(8)"/>`;
  p += `<ellipse cx="120" cy="-30" rx="40" ry="14" fill="#5a6068" opacity=".5"/><path d="M60,40 q30,-14 60,0" stroke="#4a5058" stroke-width="5" fill="none" opacity=".6"/>`;
  p += g(`<rect x="-80" y="-26" width="160" height="52" rx="6" fill="#ffd400"/>` + txt(0, 16, 'TURBO', 44, '#d8262a', { w: 900 }) + `<path d="M50,-26 L80,-26 L80,0Z" fill="#c8a800"/>`, 'translate(150,6) rotate(-14)');
  return g(p, `translate(${x + sh},${y + sh * .5}) scale(${s}) rotate(${o.rot || 0})`, 'filter="url(#sh)"');
}
function soundWaves(x, y, t, n = 3, col = '#fff') { let s = ''; for (let i = 0; i < n; i++) { const k = ((t * 3 + i / n) % 1); s += `<path d="M${x - k * 160},${y - 60 - k * 80} Q${x - 40 - k * 200},${y} ${x - k * 160},${y + 60 + k * 80}" stroke="${col}" stroke-width="10" fill="none" opacity="${1 - k}" stroke-linecap="round"/>`; } return s; }
function gato(x, y, s, t) {
  const r = Math.sin(t * 28);
  return g(`<ellipse cx="0" cy="-60" rx="90" ry="38" fill="#0c0c0e"/><circle cx="90" cy="-90" r="34" fill="#0c0c0e"/><path d="M76,-118 L84,-150 L98,-120Z M102,-118 L116,-146 L118,-112Z" fill="#0c0c0e"/><circle cx="102" cy="-94" r="6" fill="#ffd84a"/><path d="M-86,-70 C-150,-90 -170,-150 -130,-190" stroke="#0c0c0e" stroke-width="16" fill="none" stroke-linecap="round"/>` +
    `<path d="M50,-40 L${70 + r * 30},0 M30,-40 L${10 - r * 30},0 M-50,-40 L${-30 + r * 30},0 M-70,-40 L${-90 - r * 30},0" stroke="#0c0c0e" stroke-width="16" stroke-linecap="round"/>` + `<path d="M-200,-60 h-120 M-200,-30 h-80" stroke="#fff" stroke-width="5" opacity=".4"/>`, `translate(${x},${y}) scale(${s})`);
}
function moto(x, y, s, t, col = '#c8312e') {
  return g(`<circle cx="-90" cy="0" r="46" fill="none" stroke="#111" stroke-width="16"/><circle cx="90" cy="0" r="46" fill="none" stroke="#111" stroke-width="16"/><path d="M-90,0 L-20,-60 L60,-60 L90,0" stroke="#222" stroke-width="12" fill="none"/><path d="M-40,-70 L60,-70 L70,-40 L-30,-40Z" fill="${col}"/>` +
    `<rect x="-20" y="-170" width="50" height="100" rx="20" fill="#2a2a32"/><circle cx="10" cy="-200" r="34" fill="#e8e8e8"/><rect x="10" y="-212" width="34" height="18" rx="6" fill="#1a2a3a"/><path d="M30,-140 L80,-90" stroke="#2a2a32" stroke-width="18" stroke-linecap="round"/><circle cx="118" cy="-50" r="16" fill="#fff6c0" filter="url(#glow)"/>`, `translate(${x},${y}) scale(${s})`);
}
function abafador(x, y, s, t, o = {}) {
  const id = uid('ab'), sh = .5 + .5 * Math.sin(t * 3);
  let a = `<defs>${linGrad(id, [[0, '#ffffff'], [.3, '#b8c0c8'], [.55, '#f8fafc'], [.8, '#7a828c'], [1, '#c8d0d8']])}</defs>`;
  a += `<rect x="-260" y="-18" width="120" height="36" fill="url(#${id})"/><rect x="140" y="-18" width="150" height="36" fill="url(#${id})"/><rect x="-150" y="-90" width="300" height="180" rx="90" fill="url(#${id})"/><path d="M-110,-60 L-40,-60" stroke="#fff" stroke-width="12" stroke-linecap="round" opacity="${.5 + .5 * sh}"/>`;
  a += `<path d="M${-60 + sh * 120},-80 l20,-30 l20,30 l-20,30Z" fill="#fff" opacity="${sh}" filter="url(#glow)"/>`;
  if (o.tag !== false) a += g(`<path d="M0,0 L40,-40 L150,-40 L150,40 L40,40Z" fill="#ffd400"/><circle cx="34" cy="0" r="8" fill="#5a4a00"/>` + txt(96, 14, 'R$ 210', 36, '#1a1a1a', { w: 900 }), 'translate(120,110) rotate(8)');
  return g(a, `translate(${x},${y}) scale(${s})`, 'filter="url(#sh)"');
}
function cofrinho(x, y, s, t) {
  return g(`<ellipse cx="0" cy="0" rx="150" ry="110" fill="#f08aa8"/><ellipse cx="-30" cy="-40" rx="70" ry="30" fill="#fff" opacity=".25"/><circle cx="140" cy="-10" r="44" fill="#f08aa8"/><ellipse cx="172" cy="0" rx="22" ry="18" fill="#e06a8a"/><circle cx="166" cy="-2" r="4" fill="#7a2a3a"/><circle cx="178" cy="-2" r="4" fill="#7a2a3a"/><circle cx="130" cy="-36" r="7" fill="#1a1a1a"/><path d="M110,-70 L130,-110 L150,-66Z" fill="#e06a8a"/><rect x="-40" y="-112" width="80" height="12" rx="6" fill="#7a2a3a"/>` +
    `<rect x="-100" y="90" width="34" height="50" rx="10" fill="#e06a8a"/><rect x="60" y="90" width="34" height="50" rx="10" fill="#e06a8a"/><rect x="-90" y="-12" width="150" height="56" rx="10" fill="#fff"/>` + txt(-15, 30, 'RODAS', 42, '#c8312e', { w: 900 }), `translate(${x},${y}) scale(${s}) rotate(${Math.sin(t * 2) * 2})`, 'filter="url(#sh)"');
}
function caixa(x, y, s, t) {
  let c = `<rect x="-330" y="-230" width="660" height="460" fill="#a8763e"/><rect x="-300" y="-200" width="600" height="400" fill="#5a3e1e"/>` + texFill('tex_madeira.png', -330, -230, 660, 460, .2, 'multiply', 300);
  c += `<path d="M-330,-230 L-420,-330 L330,-330 L330,-230Z" fill="#c08a4e"/><path d="M-330,230 L-440,330 L320,330 L330,230Z" fill="#9a6a36"/><path d="M-330,-230 L-430,-100 L-430,120 L-330,230Z" fill="#b07e44"/><path d="M330,-230 L440,-120 L440,110 L330,230Z" fill="#b07e44"/><rect x="-60" y="-330" width="120" height="100" fill="#d8c8a0" opacity=".6"/>`;
  for (let i = 0; i < 26; i++) c += `<circle cx="${-270 + (i % 7) * 90}" cy="${-160 + Math.floor(i / 7) * 100}" r="30" fill="#fff" opacity=".18" stroke="#fff" stroke-opacity=".35" stroke-width="3"/>`;
  c += ponteira(-20, 0, .95, t, { rot: -10 });
  return g(c, `translate(${x},${y}) scale(${s})`);
}
function papel(x, y, s, rot) {
  return g(`<rect x="-230" y="-160" width="460" height="320" fill="#f4efe2"/>` + Array.from({ length: 7 }, (_, i) => `<path d="M-210,${-110 + i * 40} H210" stroke="#9ab8d8" stroke-width="2"/>`).join('') +
    `<text x="-200" y="-70" font-family="NU" font-weight="800" font-style="italic" font-size="38" fill="#1a2a6a">Escape novo</text><text x="-200" y="-20" font-family="NU" font-weight="800" font-style="italic" font-size="38" fill="#1a2a6a">+ instalação</text><text x="-200" y="80" font-family="NU" font-weight="900" font-style="italic" font-size="70" fill="#c8312e">R$ 650,00</text><path d="M-210,96 C-60,110 100,104 210,90" stroke="#c8312e" stroke-width="5" fill="none"/>`, `translate(${x},${y}) rotate(${rot}) scale(${s})`, 'filter="url(#sh)"');
}
function telaSaldo() { return `<rect width="400" height="820" fill="#7a1fd8"/><rect y="0" width="400" height="120" fill="#5a10a8"/>` + txt(30, 80, 'Olá, Lucas', 30, '#fff', { a: 'start', w: 800, fam: 'NU' }) + `<rect x="20" y="160" width="360" height="200" rx="20" fill="#fff"/>` + txt(40, 210, 'Saldo disponível', 26, '#555', { a: 'start', w: 700, fam: 'NU' }) + txt(40, 300, 'R$ 300,00', 64, '#1a1a1a', { a: 'start', w: 900 }) + `<rect x="20" y="400" width="360" height="90" rx="16" fill="#fff" opacity=".9"/>` + txt(40, 455, 'Pix  •  Pagar  •  Cartão', 24, '#5a10a8', { a: 'start', w: 800, fam: 'NU' }); }
function telaLoja(t, press) {
  let s = `<rect width="400" height="820" fill="#f4f4f6"/><rect width="400" height="90" fill="#ffe14a"/>` + txt(24, 60, 'mercadão.com', 30, '#2a2a6a', { a: 'start', w: 900, fam: 'NU' }) + `<rect x="20" y="110" width="360" height="300" rx="14" fill="#fff"/>` + g(ponteira(0, 0, .5, t, { rot: -8 }), 'translate(210,260)');
  s += txt(24, 460, 'ESCAPE ESPORTIVO', 30, '#1a1a1a', { a: 'start', w: 900 }) + txt(24, 498, 'TURBO ★★★★★ (3)', 26, '#555', { a: 'start', w: 800 }) + txt(24, 580, 'R$ 89,90', 70, '#1a1a1a', { a: 'start', w: 900 }) + txt(24, 624, 'FRETE GRÁTIS', 30, '#1f9a4a', { a: 'start', w: 900 });
  s += `<rect x="24" y="680" width="352" height="90" rx="45" fill="${press ? '#1a5ad8' : '#3a7aff'}" transform="translate(200,725) scale(${press ? .95 : 1}) translate(-200,-725)"/>` + txt(200, 740, press ? 'COMPRADO ✓' : 'COMPRAR', 38, '#fff', { w: 900 });
  return s;
}
function debaixoDoCarro(t) {
  let s = `<rect width="${W}" height="${H}" fill="#0e0f13"/>`;
  s += `<path d="M-40,0 L${W + 40},0 L${W + 40},560 C800,620 300,620 -40,560Z" fill="#26272c"/>` + texFill('tex_sujeira.png', 0, 0, W, 600, .9, 'normal', 500);
  s += `<path d="M120,120 H960 M180,260 H900" stroke="#15161a" stroke-width="40"/><path d="M80,420 C300,380 700,440 1000,400" stroke="#6a5a4a" stroke-width="38" fill="none"/><path d="M80,420 C300,380 700,440 1000,400" stroke="#a8875a" stroke-width="8" fill="none" opacity=".5"/>`;
  s += `<rect x="640" y="360" width="200" height="90" rx="40" fill="#7a6a5a"/>`;
  s += `<ellipse cx="540" cy="600" rx="700" ry="260" fill="#ffb860" opacity=".12" filter="url(#b30)"/>`;
  return s;
}
function oficinaPorta(t, o = {}) {
  let s = oficina(t, o);
  s += `<rect x="560" y="420" width="440" height="730" fill="#0a1020"/><rect x="560" y="1050" width="440" height="100" fill="#1a1c22"/><circle cx="930" cy="480" r="30" fill="#ffb050" filter="url(#glow2)"/>`;
  return s;
}

// ---------- cenas ----------
const EP2 = [
  // GANCHO 0–3: ponteira torta tremendo, "FÓÓÓN", gato fugindo
  { at: 0, z: [1.12, 1.0], c: [540, 960], f: (t, p) => {
    const zz = lerp(1.12, 1.0, easeOut(t / 3));
    let s = `<g transform="translate(540,1200) scale(${zz}) translate(-540,-1200)"><g filter="url(#b10)">${oficina(t)}</g><rect width="${W}" height="${H}" fill="#000" opacity=".3"/>`;
    s += corsa(1560, 1420, 2.5, { dust: 1 });
    s += ponteira(600, 1310, 1.4, t, { shake: 1, rot: 4 }) + soundWaves(390, 1310, t, 4);
    s += txt(300, 1420, 'FÓÓÓN!', 130, '#fff', { w: 900, extra: `stroke="#000" stroke-width="14" paint-order="stroke" transform="rotate(-8,300,1420) translate(${Math.sin(t * 60) * 4},0)"` });
    s += gato(lerp(1200, -300, clamp(t / 2.2)), 1800, 1.2, t);
    s += '</g>';
    const k = Math.min(1, t / .2), line = (y, parts) => `<text x="540" y="${y}" font-family="RC" font-weight="900" font-size="60" text-anchor="middle" stroke="#000" stroke-width="12" stroke-linejoin="round" paint-order="stroke">${parts.map(([w, hl]) => `<tspan fill="${hl ? GOLD : '#fff'}">${w}</tspan>`).join('')}</text>`;
    const tit = `<rect y="170" width="${W}" height="330" fill="#000" opacity="${.5 * k}"/>` + g(line(265, [['COMPREI UM ESCAPE ', 0], ['TURBO', 1]]) + line(345, [['DE R$ 89,90…', 0]]) + line(440, [['E O CORSA VIROU UM ', 0], ['PATO', 1]]), '', `opacity="${k}"`);
    return s + grade(t) + `<g data-tit="1">${tit}</g>`;
  } },
  // 3–7.7: Lucas entra na oficina
  { at: 3, z: [1.0, 1.06], c: [540, 1150], f: (t, p) => {
    let s = oficina(t);
    s += corsa(640, 1470, .95, { dust: 1 });
    s += rig(CH.jorge, { x: 250, y: 1560, s: 1.25, pose: POSE.stand(t), face: { mouth: 'flat', brows: 'serious', blink: blinkAt(t, 3.3), look: 2 } });
    s += rig(CH.lucas, { x: lerp(1200, 720, easeOut(clamp(t / 3.5))), y: 1760, s: 1.4, flip: 1, pose: t < 3.5 ? POSE.walk(t) : POSE.stand(t), face: { mouth: 'smile', blink: blinkAt(t, 2.9) } });
    s += `<g filter="url(#b18)"><ellipse cx="-20" cy="1880" rx="200" ry="120" fill="#141416" stroke="#26272c" stroke-width="40"/></g>`;
    return s + grade(t);
  } },
  // 7.7–11.7: seu Jorge de baixo para cima, braços cruzados, embaixo da lâmpada
  { at: 7.7, z: [1.0, 1.06], c: [540, 900], f: (t, p) => {
    let s = oficina(t, { lampX: 560 });
    for (let i = 0; i < 9; i++) s += `<path d="M${i * 135},${H} L540,-700" stroke="#fff" stroke-width="3" opacity=".05"/>`;
    s += rig(CH.jorge, { x: 520, y: 2350, s: 3.0, pose: POSE.crossed(t), face: { mouth: 'flat', brows: 'serious', blink: blinkAt(t, 3.1) } });
    s += orangeKey(700, 700, 360, t);
    return s + grade(t);
  } },
  // 11.7–15.2: ajoelhado na traseira, bate no escapamento, cai ferrugem
  { at: 11.7, z: [1.0, 1.08], c: [420, 1300], f: (t, p) => {
    let s = oficina(t);
    s += corsa(760, 1500, 1.15, { dust: 1 });
    const tap = Math.max(0, Math.sin(t * 7)) > .9;
    s += `<path d="M300,1440 L120,1452" stroke="#6a5a4a" stroke-width="22" stroke-linecap="round"/>`;
    for (let i = 0; i < 14; i++) { const k = ((t * .8 + i / 14) % 1); s += `<rect x="${140 + (i * 37) % 160}" y="${1460 + k * 200}" width="${6 + i % 3 * 3}" height="${5 + i % 2 * 3}" fill="#8a4a1e" opacity="${1 - k}" transform="rotate(${i * 40 + k * 200},${150 + (i * 37) % 160},${1460 + k * 200})"/>`; }
    s += rig(CH.jorge, { x: 90, y: 1620, s: 1.3, pose: { ...POSE.kneel(t), shN: 80 + (tap ? -12 : 0), elN: 20 }, face: { mouth: 'flat', brows: 'serious', blink: blinkAt(t, 3.1) } });
    s += g(rig(CH.lucas, { x: 0, y: 0, s: 1.1, flip: 1, pose: POSE.stand(t), face: { mouth: 'o', brows: 'up', blink: blinkAt(t, 2.7) } }), 'translate(560,1600)', 'filter="url(#b5)"');
    if (tap) s += txt(300, 1330, 'TOC', 60, '#fff', { w: 900, extra: 'stroke="#000" stroke-width="8" paint-order="stroke"' });
    return s + grade(t);
  } },
  // 15.2–19.2: sobre o ombro do seu Jorge, o orçamento; Lucas arregala os olhos
  { at: 15.2, z: [1.0, 1.06], c: [540, 900], f: (t, p) => {
    let s = oficina(t);
    s += bust({ ...LF, x: 620, y: 700, s: 1.5, eyes: p > .55 ? 'wide' : 'dot', mouth: p > .55 ? 'o' : 'flat', brows: p > .55 ? 'up' : 'neutral' });
    s += orangeKey(820, 700, 300, t);
    s += `<g filter="url(#b10)"><path d="M-80,${H} C-80,1500 60,1340 260,1320 C440,1340 520,1500 520,${H}Z" fill="#35557f"/><ellipse cx="230" cy="1200" rx="150" ry="170" fill="#c98b5d"/><path d="M80,1140 C80,1000 380,1000 380,1140Z" fill="#c0392b"/></g>`;
    s += papel(lerp(520, 470, p), lerp(1500, 1320, easeOut(seg(p, 0, .4))), 1.15, -6);
    return s + grade(t);
  } },
  // 19.2–22.8: close no saldo, Lucas suando
  { at: 19.2, z: [1.0, 1.1], c: [540, 860], f: (t, p) => {
    let s = `<g filter="url(#b10)">${oficina(t)}</g>`;
    s += bust({ ...LF, x: 540, y: 640, s: 1.55, eyes: 'wide', mouth: 'small', brows: 'sad', sweat: t, look: 6 });
    s += `<ellipse cx="540" cy="700" rx="320" ry="380" fill="#9a6aff" opacity=".18" style="mix-blend-mode:screen" filter="url(#b30)"/>`;
    s += phone(560, 1580, .92, -5, telaSaldo());
    s += hand(600, 1860, 1.3, -10, { sleeve: LUCAS.top });
    return s + grade(t);
  } },
  // 22.8–27.5: sentado num pneu, no canto, rolando o celular
  { at: 22.8, z: [1.0, 1.08], c: [600, 1200], f: (t, p) => {
    let s = oficina(t, { lampX: 380 });
    s += `<g filter="url(#b10)">${rig(CH.jorge, { x: 240, y: 1500, s: 1.1, pose: POSE.kneel(t), face: { blink: blinkAt(t, 3) } })}${corsa(380, 1440, .8, { dust: 1 })}</g>`;
    s += `<ellipse cx="760" cy="1680" rx="170" ry="50" fill="#141416" stroke="#26272c" stroke-width="40"/>`;
    const ph = `<rect x="-26" y="-50" width="52" height="96" rx="10" fill="#16181d"/><rect x="-20" y="-42" width="40" height="80" rx="6" fill="#9ad0ff"/>`;
    s += rig(CH.lucas, { x: 780, y: 1820, s: 1.45, flip: 1, pose: { hipN: 85, kneeN: 95, hipF: 80, kneeF: 90, drop: 150, lean: 18, shN: 55, elN: 70, shF: 50, elF: 75, tilt: 18 }, itemN: ph, face: { mouth: p > .55 ? 'smile' : 'flat', brows: p > .55 ? 'up' : 'neutral', blink: blinkAt(t, 2.8), look: 4 } });
    s += `<ellipse cx="610" cy="1340" rx="140" ry="160" fill="#7ab8ff" opacity=".22" style="mix-blend-mode:screen" filter="url(#b30)"/>`;
    if (p > .55) s += g(`<circle r="46" fill="#ffe14a" filter="url(#glow2)"/><rect x="-18" y="40" width="36" height="30" rx="6" fill="#9a9a9a"/>`, `translate(600,1060) scale(${pop(p, .55)})`);
    return s + grade(t);
  } },
  // 27.5–29.2: close no rosto com a luz do celular
  { at: 27.5, z: [1.0, 1.12], c: [540, 760], f: (t, p) => {
    let s = `<g filter="url(#b18)">${oficina(t)}</g><rect width="${W}" height="${H}" fill="#000" opacity=".35"/>`;
    s += bust({ ...LF, x: 540, y: 700, s: 1.8, eyes: 'dot', mouth: 'smile', brows: 'up', look: 4 });
    s += `<ellipse cx="540" cy="760" rx="360" ry="420" fill="#7ab8ff" opacity="${.22 + .04 * Math.sin(t * 9)}" style="mix-blend-mode:screen" filter="url(#b30)"/>`;
    return s + grade(t);
  } },
  // 29.2–32.3: tela da loja; compra
  { at: 29.2, z: [1.0, 1.08], c: [540, 900], f: (t, p) => {
    let s = `<g filter="url(#b18)">${oficina(t)}</g><rect width="${W}" height="${H}" fill="#000" opacity=".5"/>`;
    const press = t > 1.0;
    s += phone(540, 900, 1.55, 0, telaLoja(t, press));
    s += hand(lerp(760, 640, clamp((t - .6) / .4)), lerp(1700, 1560, clamp((t - .6) / .4)), 1.3, -20, { sleeve: LUCAS.top });
    return s + grade(t, { blue: .15 });
  } },
  // 32.3–35.8: de cima, a caixa aberta no chão; seu Jorge segura o riso
  { at: 32.3, z: [1.0, 1.08], c: [540, 960], f: (t, p) => {
    let s = `<rect width="${W}" height="${H}" fill="#2a2a2e"/>` + texFill('tex_concreto.png', 0, 0, W, H, .7, 'multiply', 700) + texFill('tex_sujeira.png', 0, 0, W, H, .8, 'normal', 800);
    s += `<ellipse cx="540" cy="960" rx="700" ry="700" fill="#ffd89a" opacity=".18" filter="url(#b30)"/>`;
    s += caixa(540, 1000, 1.25, t);
    const hold = Math.sin(t * 16) * 3 * seg(p, .4, 1);
    s += bust({ ...JF, x: 900 + hold, y: 260, s: 1.05, eyes: p > .4 ? 'closed' : 'dot', mouth: 'smile', brows: 'up', look: -14 });
    s += g(`<rect x="-90" y="-36" width="180" height="72" rx="14" fill="#000" opacity=".6"/>` + txt(0, 14, 'CRECK', 40, '#fff', { w: 900 }), `translate(240,${1620 + Math.sin(t * 8) * 6}) scale(${pop(p, .05)})`);
    return s + grade(t);
  } },
  // 35.8–40: de baixo do carro; seu Jorge instala de má vontade, Lucas rói a unha
  { at: 35.8, z: [1.0, 1.06], c: [540, 900], f: (t, p) => {
    let s = debaixoDoCarro(t);
    s += g(rig(CH.lucas, { x: 0, y: 0, s: 1.25, flip: 1, pose: POSE.bite(t), face: { mouth: 'bite', brows: 'up', eyes: 'wide', blink: blinkAt(t, 2.6) } }), 'translate(900,1880)', 'filter="url(#b2)"');
    const pull = Math.sin(t * 5) * 14;
    s += `<path d="M330,1400 Q300,900 ${470 + pull},470" stroke="#35557f" stroke-width="80" fill="none" stroke-linecap="round"/><path d="M750,1400 Q780,900 ${620 + pull},470" stroke="#35557f" stroke-width="80" fill="none" stroke-linecap="round"/>`;
    s += g(`<rect x="-14" y="-110" width="28" height="160" rx="10" fill="#9aa1a8"/><path d="M-40,-140 a40,40 0 1 1 80,0 l-20,0 a20,20 0 1 0 -40,0Z" fill="#9aa1a8"/>`, `translate(${540 + pull},480) rotate(${pull * 2})`);
    s += hand(470 + pull, 500, 1.1, 180, { fist: true }) + hand(620 + pull, 500, 1.1, 180, { fist: true });
    s += bust({ ...JF, x: 540, y: 1250, s: 1.6, eyes: 'dot', mouth: 'flat', brows: 'angry', look: 0 });
    s += txt(820, 760, 'AFF…', 70, '#fff', { w: 900, op: seg(p, .3, .4), extra: 'stroke="#000" stroke-width="10" paint-order="stroke"' });
    return s + grade(t);
  } },
  // 40–41.2: close na chave
  { at: 40, z: [1.0, 1.06], c: [540, 900], f: (t, p) => g(ignition(t, p, Math.min(1, t / .5)), '') + grade(t) },
  // 41.2–44.1: FÓÓÓN; ponteira tremendo; gato foge; galera de moto passa rindo
  { at: 41.2, z: [1.0, 1.05], c: [540, 1000], f: (t, p) => {
    let s = `<g filter="url(#b10)">${oficinaPorta(t)}${[0, 1, 2].map(i => moto(lerp(-300, 1500, clamp((t - .8 - i * .25) / 1.4)), 1090, .55, t, ['#c8312e', '#2a6ad8', '#1f9a4a'][i])).join('')}</g>`;
    if (t > 1.0) s += txt(800, 500, 'KKKKKK', 90, '#fff', { w: 900, op: clamp((t - 1) * 3), extra: 'stroke="#000" stroke-width="12" paint-order="stroke" transform="rotate(6,800,500)"' });
    s += corsa(1560, 1460, 2.5, { dust: 1 });
    s += ponteira(600, 1350, 1.4, t, { shake: 1, rot: 4 }) + soundWaves(390, 1350, t, 4);
    s += txt(320, 1560, 'FÓÓÓN!', 140, '#fff', { w: 900, extra: `stroke="#000" stroke-width="14" paint-order="stroke" transform="rotate(-6,320,1560) translate(${Math.sin(t * 60) * 5},0)"` });
    s += gato(lerp(700, -400, clamp(t / 1.2)), 1860, 1.1, t);
    return g(s, `translate(${Math.sin(t * 50) * 4},${Math.sin(t * 43) * 3})`) + grade(t);
  } },
  // 44.1–48.3: seu Jorge, braços cruzados
  { at: 44.1, z: [1.0, 1.1], c: [540, 760], f: (t, p) => {
    let s = oficina(t);
    s += pessoa({ ...JF, x: 540, y: 680, s: 1.9, cruzado: 1, eyes: 'dot', mouth: 'flat', brows: 'serious', look: 0 });
    s += orangeKey(300, 640, 320, t);
    return s + grade(t);
  } },
  // 48.3–50.1: travelling pela bancada
  { at: 48.3, z: [1.0, 1.04], c: [540, 1000], f: (t, p) => {
    let s = `<g filter="url(#b5)">${oficina(t)}</g>`;
    const pan = lerp(200, -560, easeInOut(p));
    let b = `<rect x="-200" y="1180" width="2000" height="60" fill="#5a4030"/>` + texFill('tex_madeira.png', -200, 1180, 2000, 60, .7, 'multiply', 200) + `<rect x="-200" y="1240" width="2000" height="700" fill="#2a2420"/>`;
    b += abafador(420, 1080, 1.0, t) + ponteira(1250, 1100, .7, t, { rot: -4 }) + cofrinho(1540, 1060, .8, t);
    s += g(b, `translate(${pan},0)`);
    return s + grade(t);
  } },
  // 50.1–60: final A/B, falas ao lado de cada letra, COMENTA AÍ no fim
  { at: 50.1, z: [1.0, 1.03], c: [540, 960], f: (t, p) => {
    const id = uid('fn'), T = __T, CH2 = window.AUREA_CHUNKS || [];
    const ch = CH2.find(c => T >= c.s - .03 && T < c.e) || null;
    const bStart = (CH2.find(c => c.s > 49.5 && /^ou$/i.test(c.toks[0].t)) || { s: 1e9 }).s;
    const cStart = (CH2.find(c => c.s > 49.5 && /^comenta/i.test(c.toks[0].t)) || { s: 1e9 }).s;
    const cap = (c, x, y, size) => { if (!c) return ''; const sc = T - c.s < .1 ? lerp(.85, 1, (T - c.s) / .1) : 1; return `<g transform="translate(${x},${y}) scale(${sc})"><text font-family="RC" font-weight="900" font-size="${size}" text-anchor="start" stroke="#000" stroke-width="12" stroke-linejoin="round" paint-order="stroke">${c.toks.map((k, i) => { const w = k.t.replace(/[.,:…!?]+$/, ''); const hl = /^(verdade|grave|pato|rodas|A|B)$/i.test(w); return `<tspan fill="${hl ? GOLD : '#fff'}">${(i ? ' ' : '') + w.toUpperCase()}</tspan>`; }).join('')}</text></g>`; };
    const actA = T < bStart, actB = T >= bStart && T < cStart;
    let s = `<defs><clipPath id="${id}a"><rect width="${W}" height="930"/></clipPath><clipPath id="${id}b"><rect y="990" width="${W}" height="930"/></clipPath></defs>`;
    s += `<g clip-path="url(#${id}a)" opacity="${actB ? .5 : 1}"><g filter="url(#b10)">${oficina(t)}</g><rect width="${W}" height="930" fill="#000" opacity=".35"/>` + abafador(560, 600, 1.2, t) + txt(560, 830, 'RONCO GRAVE', 54, GOLD, { w: 900, ls: 4 });
    s += `<circle cx="140" cy="190" r="90" fill="${GOLD}"/>` + txt(140, 226, 'A', 110, '#111', { w: 900 }) + `</g>`;
    s += `<g clip-path="url(#${id}b)" opacity="${actA ? .5 : 1}"><g filter="url(#b10)">${oficina(t + 3)}</g><rect y="990" width="${W}" height="930" fill="#000" opacity=".35"/>` + ponteira(380, 1560, .8, t, { shake: .3, rot: -4 }) + cofrinho(820, 1540, .85, t);
    s += `<circle cx="140" cy="1110" r="90" fill="#c04dff"/>` + txt(140, 1146, 'B', 110, '#111', { w: 900 }) + `</g>`;
    s += `<rect y="930" width="${W}" height="60" fill="#0b0b0f"/>`;
    if (ch && actA && T > 50.2) s += cap(ch, 260, 220, 64);
    if (ch && actB) s += cap(ch, 260, 1140, 64);
    if (T >= cStart) { const k = pop(T - cStart, 0, .18); s += `<rect width="${W}" height="${H}" fill="#000" opacity="${.45 * Math.min(1, (T - cStart) * 4)}"/>` + txt(540, 1000, 'COMENTA AÍ', 140, '#fff', { w: 900, extra: `stroke="#000" stroke-width="16" paint-order="stroke" transform="translate(540,960) scale(${k * (1 + .03 * Math.sin(t * 6))}) translate(-540,-960)"` }) + txt(540, 1110, 'A OU B?', 70, GOLD, { w: 900, op: Math.min(1, (T - cStart) * 3), extra: 'stroke="#000" stroke-width="10" paint-order="stroke"' }); }
    return s + filmGrain(t, .12) + vignette();
  } },
];
