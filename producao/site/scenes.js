// Cada cena: start (s), função de desenho f(t,p,d), câmera z:[zoom inicial, final], c:[cx,cy] centro, pan:[dx,dy]
const MARINA = { hair: 'marina', top: '#3b4150', outfit: 'coat' };
const MAN = { hair: 'grey', top: '#3a3e46', outfit: 'suit', browCol: '#7d8188' };

function pill(x, y, s) { return g(`<rect x="-46" y="-20" width="92" height="40" rx="20" fill="#f4f6f8" filter="url(#shs)"/><path d="M0,-18 v36" stroke="#d3dadf" stroke-width="3"/>`, `translate(${x},${y}) scale(${s})`); }
function labRoom(t, blur = 'b10') {
  let s = `<defs>${linGrad('lab', [[0, '#cfd8d4'], [1, '#aab8b4']])}</defs><rect width="${W}" height="${H}" fill="url(#lab)"/>`;
  s += `<g filter="url(#${blur})"><rect x="60" y="260" width="380" height="520" rx="10" fill="#e9eeec"/><rect x="90" y="300" width="320" height="200" fill="#9fb3b8"/>`;
  for (let i = 0; i < 4; i++) s += `<rect x="${620 + i * 90}" y="${420}" width="60" height="${140 + i * 20}" rx="10" fill="${['#7fb8c4', '#c4a37f', '#8fc48f', '#b0b8c0'][i]}"/>`;
  s += `<rect x="560" y="580" width="480" height="20" fill="#7d8a88"/><rect x="0" y="1300" width="${W}" height="700" fill="#8e9a96"/></g>`;
  return s;
}
function monitor(x, y, s, inner) {
  return g(`<rect x="-260" y="-190" width="520" height="360" rx="22" fill="#20262d" filter="url(#sh)"/><rect x="-236" y="-168" width="472" height="316" rx="10" fill="#eef1f2"/>${inner}<rect x="-30" y="170" width="60" height="90" fill="#2a3038"/><rect x="-130" y="250" width="260" height="22" rx="10" fill="#2a3038"/>`, `translate(${x},${y}) scale(${s})`);
}
function table(y, col = '#6b4a36') { return `<rect x="-100" y="${y}" width="${W + 200}" height="${H - y + 100}" fill="${col}"/><rect x="-100" y="${y}" width="${W + 200}" height="16" fill="#000" opacity=".15"/>`; }
function blackCard(x, y, s, rot, side = 'front') {
  let c = `<rect x="-200" y="-125" width="400" height="250" rx="22" fill="#121418" stroke="#2d3440" stroke-width="3"/>`;
  if (side === 'front') c += logo(-130, -40, .7) + txt(40, -30, 'LETHE', 52, '#e9f6ff', { ls: 6 }) + `<rect x="-160" y="40" width="70" height="50" rx="8" fill="#d2b05a"/>` + txt(110, 80, '•••• 0213', 26, '#8a96a6', { fam: 'NU' });
  if (side === 'addr') c += logo(-140, -60, .55) + txt(30, -50, 'DEVOLUÇÃO DE MEMÓRIAS', 26, '#5fd0ff') + txt(0, 15, 'RUA DO ESQUECIMENTO, 48', 22, '#e9f6ff', { fam: 'NU' }) + txt(0, 60, 'ATENDIMENTO 24H', 22, '#8a96a6', { fam: 'NU' });
  if (side === 'qr') { const r = rng(48213); c += `<rect x="-90" y="-100" width="180" height="180" rx="8" fill="#e9f6ff"/>`; for (let i = 0; i < 12; i++) for (let j = 0; j < 12; j++) if (r() < .5 || (i < 3 && j < 3) || (i > 8 && j < 3) || (i < 3 && j > 8)) c += `<rect x="${-84 + i * 14}" y="${-94 + j * 14}" width="14" height="14" fill="#121418"/>`; c += txt(0, 108, 'ACESSO: ARQUIVO', 22, '#5fd0ff', { ls: 2 }); }
  return g(c, `translate(${x},${y}) rotate(${rot}) scale(${s})`, `filter="url(#sh)"`);
}

const SCENES = [
  // 01 Etiqueta de preço caindo
  { s: 0, z: [1, 1.05], f: (t, p) => {
    let s = `<rect width="${W}" height="${H}" fill="#050608"/>`;
    s += `<ellipse cx="540" cy="900" rx="420" ry="420" fill="#1b2a33" opacity=".7" filter="url(#b60)"/>`;
    const r = rng(4); for (let i = 0; i < 40; i++) s += `<circle cx="${r() * W}" cy="${(r() * H - t * 20 * (1 + r())) % H + (r() < 0 ? H : 0)}" r="${1 + r() * 3}" fill="#9fb6c4" opacity="${r() * .5}"/>`;
    const y = lerp(-300, 760, easeOut(p * 1.6)), rot = Math.sin(t * 2.2) * 8 * (1 - easeOut(p)) - 6;
    s += g(`<path d="M140,-700 C120,-400 150,-200 140,-18" stroke="#c9b48a" stroke-width="5" fill="none"/>
      <path d="M-190,-110 L120,-110 L210,0 L120,110 L-190,110 Z" fill="#f4efe4" filter="url(#sh)"/>
      <circle cx="140" cy="0" r="18" fill="#050608"/>` + txt(-40, 26, 'R$ 42.000', 70, '#15181d', { w: 900 }), `translate(540,${y}) rotate(${rot}) `);
    return s + vignette(true);
  } },
  // 02 Pagamento
  { s: 4.32, z: [1.05, 1.12], f: (t, p) => {
    let s = `<defs>${linGrad('lng', [[0, '#101b24'], [1, '#1b2b36']])}</defs><rect width="${W}" height="${H}" fill="url(#lng)"/>`;
    s += `<g filter="url(#b18)"><circle cx="200" cy="400" r="120" fill="#e3b35a" opacity=".4"/><circle cx="900" cy="300" r="90" fill="#5fd0ff" opacity=".35"/><rect x="0" y="1400" width="${W}" height="600" fill="#0b1218"/></g>`;
    s += g(`<rect x="-200" y="-300" width="400" height="600" rx="40" fill="#1b3a4a" stroke="#5fd0ff" stroke-width="5" opacity=".95" filter="url(#sh)"/><rect x="-170" y="-260" width="340" height="300" rx="20" fill="#0e2733"/>` +
      (p > .55 ? `<circle cx="0" cy="-120" r="70" fill="#5fe08a" opacity="${seg(p, .55, .65)}"/><path d="M-30,-120 l22,24 l40,-48" stroke="#fff" stroke-width="12" fill="none" stroke-linecap="round" opacity="${seg(p, .55, .65)}"/>` + txt(0, 10, 'APROVADO', 44, '#5fe08a', { op: seg(p, .55, .65) }) : logo(0, -120, 1.1) + txt(0, 10, 'LETHE', 44, '#9fe3ff')), 'translate(540,1060)');
    s += `<ellipse cx="540" cy="1060" rx="300" ry="380" fill="#5fd0ff" opacity=".12" filter="url(#b60)"/>`;
    const cx = lerp(1200, 560, easeOut(seg(p, 0, .5)));
    s += blackCard(cx, 1180, 1, -12);
    s += hand(cx + 120, 1380, 1.4, -40, { sleeve: '#2c2f36', watch: true });
    return s + vignette();
  } },
  // 03 Cidade e torre Lethe
  { s: 6.88, z: [1.12, 1.0], c: [540, 760], f: (t, p) => cityBG(t) + g(`<rect x="-120" y="-44" width="240" height="88" rx="14" fill="#0f2a33" stroke="#5fd0ff" stroke-width="3"/>` + txt(0, 20, '2031', 60, '#ffffff'), 'translate(540,1580)', `opacity="${seg(p, .1, .3)}"`) + vignette() },
  // 04 Escolhe a lembrança (tablet POV)
  { s: 10.72, z: [1, 1.06], f: (t, p) => {
    let s = clinicBG(t, { logo: false }) + `<rect width="${W}" height="${H}" fill="#cfe3ee" opacity=".4" filter="url(#b10)"/>`;
    let tb = `<rect x="-400" y="-560" width="800" height="1060" rx="50" fill="#e9eef1" filter="url(#sh)"/><rect x="-370" y="-530" width="740" height="1000" rx="30" fill="#0f2733"/>`;
    tb += txt(0, -450, 'SELECIONE UMA MEMÓRIA', 40, '#9fe3ff', { ls: 2 });
    const cols = ['#e7b56b', '#f19a8c', '#8fd0a0', '#7fb8f0', '#d6a0e8', '#f0d27a', '#9ad8d8', '#2a2f3a', '#f2b98f'];
    for (let i = 0; i < 9; i++) {
      const bx = -230 + (i % 3) * 230, by = -280 + Math.floor(i / 3) * 250, sel = i === 7;
      const pulse = sel && p > .5 ? 1 + .08 * Math.sin(t * 10) : 1;
      tb += g(`<circle r="92" fill="${cols[i]}" opacity="${sel ? 1 : .85}"/><circle r="92" fill="none" stroke="${sel && p > .5 ? '#ff5d5d' : '#ffffff'}" stroke-width="${sel && p > .5 ? 10 : 5}" opacity=".9"/>` + (sel ? `<path d="M-40,30 q20,-50 40,-20 q20,-40 40,10" stroke="#596070" stroke-width="8" fill="none"/><circle cx="0" cy="-30" r="14" fill="#596070"/>` : `<circle cx="-20" cy="-10" r="18" fill="#fff" opacity=".5"/><path d="M-50,40 q50,-40 100,0" stroke="#fff" stroke-width="8" fill="none" opacity=".5"/>`), `translate(${bx},${by}) scale(${pulse})`);
    }
    s += g(tb, 'translate(540,1000)');
    const fx = lerp(900, 540, ease(seg(p, 0, .5))), fy = lerp(1700, 1040, ease(seg(p, 0, .5)));
    s += g(`<rect x="-26" y="-10" width="52" height="420" rx="26" fill="${SK}"/><rect x="-80" y="200" width="160" height="300" rx="60" fill="${SK}"/><rect x="-100" y="420" width="200" height="600" rx="40" fill="#3b4150"/>`, `translate(${fx},${fy}) rotate(-20)`);
    return s + vignette();
  } },
  // 05 Cadeira
  { s: 12.88, z: [1, 1.1], c: [540, 1000], f: (t, p) => clinicBG(t) + chair(540, 1300, 1.25, ease(p) * .5) + vignette() },
  // 06 Timer e memória se desfazendo
  { s: 14.24, z: [1.05, 1.1], f: (t, p) => {
    let s = `<defs>${linGrad('d6', [[0, '#16252e'], [1, '#2a3a44']])}</defs><rect width="${W}" height="${H}" fill="url(#d6)"/>`;
    const sec = Math.floor(lerp(0, 1200, ease(seg(p, 0, .8))));
    const tm = `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
    s += g(helmet(1, txt(0, 82, tm, 64, '#e9fbff', { w: 900, ls: 4 })), 'translate(540,1250) scale(2.4)');
    const dp = seg(p, .25, 1), r = rng(8);
    let parts = '';
    if (dp < .98) parts += g(bubble(0, 0, 160, `<rect x="-200" y="-200" width="400" height="400" fill="#4a5462"/><path d="M-160,100 L-60,0 L0,60 L80,-40 L180,100Z" fill="#2b313a"/><circle cx="60" cy="-60" r="30" fill="#c8ced6"/>`, { glow: '#ff9a7a' }), '', `opacity="${1 - dp}"`);
    for (let i = 0; i < 90; i++) { const a = r() * 6.28, rr = r() * 170, sp = 200 + r() * 500; const x = Math.cos(a) * rr + (r() - .5) * dp * 300, y = Math.sin(a) * rr - dp * sp; parts += `<circle cx="${x}" cy="${y}" r="${3 + r() * 6}" fill="${r() < .5 ? '#ffd0b0' : '#9fe3ff'}" opacity="${dp > 0 ? (1 - dp) * .9 : 0}"/>`; }
    s += g(parts, 'translate(540,520)');
    return s + vignette();
  } },
  // 07 Recibo R$0
  { s: 16.8, z: [1.05, 1.1], f: (t, p) => {
    let s = `<rect width="${W}" height="${H}" fill="#dfe8ee"/><rect width="${W}" height="520" fill="#c9d6de"/><rect x="140" y="420" width="800" height="120" rx="30" fill="#eef3f6" filter="url(#sh)"/><rect x="250" y="470" width="580" height="24" rx="12" fill="#1a2a33"/>`;
    const y = lerp(-600, -260, easeOut(seg(p, 0, .6)));
    let rc = `<path d="M-230,0 L230,0 L230,900 L210,920 L190,900 L170,920 L150,900 L130,920 L110,900 L90,920 L70,900 L50,920 L30,900 L10,920 L-10,900 L-30,920 L-50,900 L-70,920 L-90,900 L-110,920 L-130,900 L-150,920 L-170,900 L-190,920 L-210,900 L-230,920Z" fill="#ffffff" filter="url(#sh)"/>`;
    rc += logo(0, 110, .8, '#1a2a33') + txt(0, 230, 'LETHE', 52, '#1a2a33', { ls: 10 });
    for (let i = 0; i < 4; i++) rc += `<rect x="-170" y="${300 + i * 60}" width="${200 + (i % 2) * 80}" height="18" rx="9" fill="#c9d3d9"/><rect x="${110}" y="${300 + i * 60}" width="60" height="18" rx="9" fill="#c9d3d9"/>`;
    rc += `<path d="M-190,560 H190" stroke="#1a2a33" stroke-width="4" stroke-dasharray="12 10"/>`;
    rc += txt(0, 640, 'TOTAL', 48, '#6b7a84') + txt(0, 740, 'R$ 0,00', 110, '#1a2a33', { w: 900 });
    s += `<defs><clipPath id="rcl"><rect x="0" y="482" width="${W}" height="2000"/></clipPath></defs><g clip-path="url(#rcl)">${g(rc, `translate(540,${482 + y})`)}</g>`;
    return s + vignette();
  } },
  // 08 Fila enorme + contador
  { s: 17.92, z: [1.15, 1.0], f: (t, p) => {
    let s = `<rect width="${W}" height="${H}" fill="#7f8c94"/>`;
    s += `<path d="M0,500 L${W},500 L${W},1700 L0,1700Z" fill="#9aa6ad"/>`;
    s += `<rect x="290" y="560" width="500" height="560" fill="#eef3f6" filter="url(#sh)"/><rect x="290" y="560" width="500" height="80" fill="#d5e0e7"/>` + logo(540, 820, 1.4, '#5fd0ff');
    const r = rng(17); let q = '';
    const path = t2 => { // serpente ao redor do prédio
      const L = t2 * 4000; if (L < 600) return [540 + L * 0, 1180 + 0]; return null; };
    const pts = [];
    for (let row = 0; row < 7; row++) for (let i = 0; i < 26; i++) { const x = row % 2 ? 1020 - i * 38 : 60 + i * 38; const y = 1220 + row * 90; pts.push([x, y]); }
    for (let i = 0; i < 26; i++) pts.push([60, 1160 - i * 40]);
    for (let i = 0; i < 26; i++) pts.push([1020, 1160 - i * 40]);
    pts.forEach(([x, y], i) => { q += tiny(x + (r() - .5) * 8, y + (r() - .5) * 8 + Math.sin(t * 3 + i) * 2, .7, ['#3b4150', '#6b4a5a', '#4a6a7a', '#7a6a4a', '#5a5a6a', '#2f3a4a'][Math.floor(r() * 6)], [SK, '#b77a52', '#f0c49a', '#8a5a3a'][Math.floor(r() * 4)]); });
    s += q;
    const n = Math.floor(lerp(2412000, 2700000, easeOut(seg(p, 0, .75))));
    s += g(`<rect x="-330" y="-90" width="660" height="180" rx="30" fill="#0f2a33" opacity=".92" filter="url(#sh)"/>` + txt(0, -20, 'MEMÓRIAS APAGADAS', 34, '#5fd0ff', { ls: 3 }) + txt(0, 60, n.toLocaleString('pt-BR'), 92, '#ffffff', { w: 900 }), 'translate(540,260)');
    return s + vignette();
  } },
  // 09 Cano levando memórias pro escuro
  { s: 21.84, z: [1, 1.08], c: [540, 1100], f: (t, p) => {
    let s = `<defs>${linGrad('pp', [[0, '#e3ecf1'], [.32, '#d0dde4'], [.33, '#0a1a22'], [1, '#02080c']])}</defs><rect width="${W}" height="${H}" fill="url(#pp)"/>`;
    s += g(chair(0, 0, .55, .9), 'translate(540,560)');
    s += `<rect x="0" y="620" width="${W}" height="30" fill="#9fb1bc"/>`;
    s += `<path d="M540,640 C540,900 300,1000 300,1300 C300,1600 700,1600 760,2000" stroke="#7fdcff" stroke-width="80" fill="none" opacity=".18"/><path d="M540,640 C540,900 300,1000 300,1300 C300,1600 700,1600 760,2000" stroke="#bff0ff" stroke-width="6" fill="none" opacity=".35"/>`;
    const id = 'pth9'; s += `<path id="${id}" d="M540,640 C540,900 300,1000 300,1300 C300,1600 700,1600 760,2000" fill="none"/>`;
    // bolhas ao longo do cano (aprox. pela curva paramétrica)
    const bez = (u) => { const segs = [[[540, 640], [540, 900], [300, 1000], [300, 1300]], [[300, 1300], [300, 1600], [700, 1600], [760, 2000]]]; const k = u < .5 ? 0 : 1, v = (u - k * .5) * 2; const [a, b, c, d] = segs[k]; const m = 1 - v; return [m * m * m * a[0] + 3 * m * m * v * b[0] + 3 * m * v * v * c[0] + v * v * v * d[0], m * m * m * a[1] + 3 * m * m * v * b[1] + 3 * m * v * v * c[1] + v * v * v * d[1]]; };
    for (let i = 0; i < 9; i++) { const u = ((t * .18 + i / 9) % 1); const [x, y] = bez(u); s += `<circle cx="${x}" cy="${y}" r="26" fill="${['#ffd0a0', '#9fe3ff', '#f7a0c8'][i % 3]}" opacity="${.9 - u * .6}" filter="url(#glow)"/>`; }
    return s + vignette(true);
  } },
  // 10 Catálogo (arquivo)
  { s: 24.24, z: [1.1, 1.0], f: (t, p) => archiveBG(t, { dy: -p * 300 }) + g(`<rect x="-260" y="-70" width="520" height="140" rx="24" fill="#0f2a33" fill-opacity=".7" stroke="#5fd0ff" stroke-width="4"/>` + txt(0, 28, 'CATÁLOGO', 80, '#e9fbff', { ls: 10 }), 'translate(540,960)', `filter="url(#glow)" opacity="${seg(p, .15, .35)}"`) + vignette() },
  // 11 Card MEDO
  { s: 26.16, z: [1, 1.06], f: (t, p) => {
    const inner = `<rect x="-250" y="-330" width="500" height="480" rx="16" fill="#1c2633"/><path d="M-250,150 L-60,-200 L60,-200 L250,150Z" fill="#273647"/><rect x="-40" y="-200" width="80" height="100" fill="#d8e6f0" opacity=".85"/>` + g(`<circle cx="0" cy="-70" r="26" fill="${SK}"/><rect x="-24" y="-44" width="48" height="90" rx="20" fill="#3b4150" transform="rotate(14)"/><rect x="-30" y="40" width="22" height="80" rx="10" fill="#2b2f38" transform="rotate(30)"/><rect x="10" y="40" width="22" height="80" rx="10" fill="#2b2f38" transform="rotate(-30)"/>`, `translate(${Math.sin(t * 9) * 4},40)`) + txt(0, 250, 'MEDO', 76, '#ffffff', { ls: 6 }) + txt(0, 320, 'R$ 9.000', 52, YEL);
    return archiveBG(t) + card(540, lerp(980, 820, easeOut(seg(p, 0, .3))), 560, 760, inner, { tilt: lerp(8, -3, easeOut(seg(p, 0, .4))), shine: seg(p, .2, .8), border: '#9fd8ff' }) + vignette();
  } },
  // 12 Card PAIXÃO
  { s: 28.48, z: [1, 1.06], f: (t, p) => {
    const r = rng(12); let rain = ''; for (let i = 0; i < 30; i++) rain += `<path d="M${-240 + r() * 480},${-320 + ((r() * 460 + t * 500) % 460)} l-6,24" stroke="#ffd6e6" stroke-width="3" opacity=".6"/>`;
    const inner = `<rect x="-250" y="-330" width="500" height="480" rx="16" fill="#8a2f4a"/><circle cx="0" cy="-80" r="200" fill="#c24a6a" opacity=".6" filter="url(#b18)"/>${rain}` + `<path d="M-130,-150 Q0,-260 130,-150Z" fill="#2a1a24"/><path d="M0,-150 V-120" stroke="#2a1a24" stroke-width="6"/>` + tiny(-40, -60, 1.6, '#3b2a4a') + tiny(40, -60, 1.6, '#6a2a3a', SKL, '#4a3326') + `<path d="M-14,-40 q14,-14 28,0 q-14,20 -14,24 q0,-4 -14,-24z" fill="#ff8fb0" transform="translate(0,${-120 + Math.sin(t * 4) * 6})"/>` + txt(0, 250, 'PAIXÃO', 76, '#ffffff', { ls: 6 }) + txt(0, 320, 'R$ 25.000', 52, YEL);
    return archiveBG(t, { palette: (h) => h < .6 ? '#ff8fb0' : '#3fc7ff' }) + card(540, lerp(980, 820, easeOut(seg(p, 0, .3))), 560, 760, inner, { tilt: lerp(-8, 3, easeOut(seg(p, 0, .4))), shine: seg(p, .2, .8), border: '#ffc0d4', bg: '#ffb0c8' }) + vignette();
  } },
  // 13 Card LUTO
  { s: 30.56, z: [1, 1.08], f: (t, p) => {
    const inner = `<rect x="-250" y="-330" width="500" height="480" rx="16" fill="#23262c"/><circle cx="0" cy="-120" r="160" fill="#4a5060" opacity=".6" filter="url(#b18)"/>` +
      `<rect x="10" y="20" width="200" height="60" rx="14" fill="#6b4f3a"/><rect x="10" y="20" width="200" height="16" rx="8" fill="#8a6a4f"/>` +
      g(`<circle cx="0" cy="-90" r="30" fill="#8d939e"/><path d="M-50,60 Q-60,-40 0,-56 Q50,-40 40,20 L70,60Z" fill="#5a606c"/>`, 'translate(-110,30)') +
      `<path d="M150,10 q6,-30 0,-60" stroke="#d8dde3" stroke-width="4" fill="none" opacity=".6"/><circle cx="150" cy="-56" r="10" fill="#ffe7a8" filter="url(#glow)"/>` +
      txt(0, 250, 'LUTO', 80, '#ffffff', { ls: 8 }) + txt(0, 320, 'R$ 42.000', 52, YEL) +
      g(`<rect x="-120" y="-30" width="240" height="60" rx="30" fill="#e0b44c"/>` + txt(0, 14, 'MAIS VENDIDO', 30, '#2a2010', { ls: 2 }), 'translate(130,-380) rotate(8)', `opacity="${seg(p, .35, .5)}"`);
    return archiveBG(t, { palette: () => '#e0b44c' }) + card(540, lerp(980, 820, easeOut(seg(p, 0, .3))), 560, 760, inner, { tilt: lerp(6, 0, easeOut(seg(p, 0, .4))), shine: seg(p, .2, .8), border: '#e0b44c', bg: '#40350f', op: .35, bw: 7 }) + vignette(true);
  } },
  // 14 Rico sentindo
  { s: 33.72, z: [1.0, 1.12], c: [540, 900], f: (t, p) => {
    let s = `<defs>${linGrad('pent', [[0, '#14202a'], [1, '#2a2f38']])}</defs><rect width="${W}" height="${H}" fill="url(#pent)"/>`;
    s += `<g filter="url(#b10)">` + `<rect x="80" y="160" width="920" height="1100" fill="#0d1a24"/>` + cityBG(t, { tower: false }).replace(/<defs>.*?<\/defs><rect[^>]*\/>/, '').slice(0, 0) + `</g>`;
    const r = rng(14); let win = ''; for (let i = 0; i < 160; i++) win += `<rect x="${90 + r() * 900}" y="${400 + r() * 840}" width="10" height="14" fill="#e6c56a" opacity="${r() * .7}"/>`;
    s += `<g filter="url(#b5)">${win}</g><rect x="80" y="160" width="920" height="1100" fill="none" stroke="#3a3f48" stroke-width="20"/><path d="M540,160 V1260" stroke="#3a3f48" stroke-width="14"/>`;
    s += `<rect x="0" y="1260" width="${W}" height="700" fill="#3a2a24"/>`;
    s += `<path d="M180,1900 L180,1000 C180,860 900,860 900,1000 L900,1900Z" fill="#5a3a2c" filter="url(#sh)"/>`;
    const tearOn = p > .45;
    s += bust({ x: 540, y: 1150, s: 1.6, hair: 'none', top: '#6b2a35', outfit: 'robe', eyes: 'closed', mouth: tearOn ? 'sad' : 'flat', tears: tearOn, tearP: t * .8, brows: tearOn ? 'sad' : 'neutral' });
    s += g(helmet(.8 + .2 * Math.sin(t * 3)), 'translate(540,980) scale(1.05)');
    return s + vignette();
  } },
  // 15 Papel antigo (transição documental)
  { s: 38.24, z: [1.0, 1.1], f: (t, p) => {
    let s = `<rect width="${W}" height="${H}" fill="#2b2620"/>`;
    s += g(`<rect x="-380" y="-520" width="760" height="1040" fill="#e8dcc0" filter="url(#sh)"/><rect x="-60" y="-560" width="120" height="70" rx="10" fill="#9a9a9a"/>` +
      txt(-320, -400, 'ESTUDO Nº 2009/031', 40, '#5a4a36', { a: 'start', fam: 'NU' }) +
      [...Array(9)].map((_, i) => `<rect x="-320" y="${-330 + i * 60}" width="${560 - (i * 47) % 200}" height="14" rx="7" fill="#b9aa8a"/>`).join('') +
      spider(180, 300, .9, '#5a4a36') +
      g(`<rect x="-150" y="-50" width="300" height="100" rx="10" fill="none" stroke="#a33" stroke-width="8"/>` + txt(0, 20, 'MEMÓRIA', 52, '#a33', { ls: 4 }), 'translate(-140,330) rotate(-12)', `opacity="${seg(p, .3, .45) * .85}"`),
      'translate(540,960) rotate(-3)');
    return `<g filter="url(#sepia)">${s}</g>` + grain(Math.floor(t * 24), .18) + vignette(true);
  } },
  // 16 Laboratório, voluntário com medo de aranha
  { s: 40.76, z: [1, 1.08], c: [540, 1000], f: (t, p) => {
    let s = labRoom(t);
    const flash = p > .35 && p < .9;
    s += monitor(540, 760, 1.2, `<rect x="-236" y="-168" width="472" height="316" fill="#f4f1ea"/>` + spider(0, -10, 1.1));
    const shake = flash ? Math.sin(t * 60) * 5 : 0;
    s += bust({ x: 540 + shake, y: 1420, s: 1.4, hair: 'short', top: '#5f7a6a', outfit: 'hoodie', eyes: flash ? 'wide' : 'dot', mouth: flash ? 'o' : 'flat', brows: flash ? 'up' : 'neutral' });
    s += `<path d="M330,1900 C330,1700 260,1600 200,1560" stroke="#d24" stroke-width="6" fill="none"/><path d="M750,1900 C760,1700 840,1600 900,1560" stroke="#24d" stroke-width="6" fill="none"/>`;
    s += g(`<rect x="-230" y="-48" width="460" height="96" rx="16" fill="#1d2a30" opacity=".9"/>` + txt(0, 18, 'AMSTERDÃ, 2009', 52, '#ffffff', { ls: 3 }), 'translate(540,260)', `opacity="${seg(p, .05, .2)}"`);
    if (flash) s += `<rect width="${W}" height="${H}" fill="#fff" opacity="${.12 * (Math.sin(t * 20) > 0)}"/>`;
    return `<g filter="url(#sepia)" opacity=".35">${s}</g>` + s + grain(Math.floor(t * 24), .08) + vignette();
  } },
  // 17 Comprimido + propranolol
  { s: 47.24, z: [1.08, 1.0], f: (t, p) => {
    let s = labRoom(t, 'b18');
    s += `<rect x="0" y="1300" width="${W}" height="700" fill="#e7ece9"/>`;
    s += g(`<rect x="-120" y="-250" width="240" height="380" rx="30" fill="#e9a23b" opacity=".92" filter="url(#sh)"/><rect x="-130" y="-300" width="260" height="80" rx="16" fill="#f4f6f8"/><rect x="-110" y="-150" width="220" height="190" rx="10" fill="#fff"/>` + txt(0, -80, 'PROPRANOLOL', 34, '#1d2a30', { w: 900 }) + txt(0, -30, '40 mg', 32, '#6b7a84', { fam: 'NU' }) + `<rect x="-90" y="0" width="180" height="10" rx="5" fill="#c9d3d9"/>`, 'translate(780,1250)');
    s += g(`<path d="M-90,-200 L90,-200 L70,180 L-70,180Z" fill="#cfefff" opacity=".45" stroke="#fff" stroke-width="5"/><path d="M-82,-60 L82,-60 L70,180 L-70,180Z" fill="#8fd8ff" opacity=".35"/>`, 'translate(240,1300)');
    const py = lerp(1350, 1120, easeOut(seg(p, 0, .4)));
    s += hand(520, py + 180, 1.5, -10, { sleeve: '#5f7a6a' }) + pill(520, py - 60, 1.4);
    return s + grain(Math.floor(t * 24), .07) + vignette();
  } },
  // 18 Calmo + gráfico caindo
  { s: 53.68, z: [1, 1.06], f: (t, p) => {
    let s = labRoom(t);
    s += monitor(540, 700, 1.0, `<rect x="-236" y="-168" width="472" height="316" fill="#f4f1ea"/>` + spider(0, -10, .9));
    s += bust({ x: 540, y: 1400, s: 1.3, hair: 'short', top: '#5f7a6a', outfit: 'hoodie', eyes: 'dot', mouth: 'flat', blink: (t % 3) < .12 });
    const gp = ease(seg(p, .1, .85));
    let ch = `<rect x="-360" y="-200" width="720" height="400" rx="24" fill="#0f2a33" opacity=".93" filter="url(#sh)"/>` + txt(-320, -140, 'REAÇÃO DE SUSTO', 34, '#9fe3ff', { a: 'start', ls: 2 });
    ch += `<path d="M-320,140 H330 M-320,140 V-110" stroke="#4a7a8a" stroke-width="4"/>`;
    const pts = []; for (let i = 0; i <= 40; i++) { const u = i / 40; if (u > gp) break; const v = u < .3 ? .85 + .08 * Math.sin(u * 60) : lerp(.85, .06, ease((u - .3) / .5)) + .03 * Math.sin(u * 50); pts.push(`${-320 + u * 650},${140 - v * 240}`); }
    if (pts.length > 1) ch += `<polyline points="${pts.join(' ')}" fill="none" stroke="#ff7a6a" stroke-width="9" stroke-linejoin="round" stroke-linecap="round"/>`;
    s += g(ch, 'translate(540,1150)');
    return s + grain(Math.floor(t * 24), .07) + vignette();
  } },
  // 19 Cérebro: lembrança intacta
  { s: 57.8, z: [1, 1.08], c: [600, 860], f: (t, p) => brainViz(t) + bubble(600, 820, 150 + 6 * Math.sin(t * 3), `<rect x="400" y="620" width="400" height="400" fill="#f4f1ea"/>` + spider(600, 830, .8) + `<rect x="400" y="620" width="400" height="400" fill="#ff5a5a" opacity=".25"/>`, { glow: '#ff9a7a' }) + `<path d="M600,980 C620,1000 600,1010 600,1000" />` + vignette() },
  // 20 A dor vai embora
  { s: 59.573, z: [1.08, 1.12], c: [600, 860], f: (t, p) => {
    const dp = ease(seg(p, 0, .8));
    let s = brainViz(t);
    s += bubble(600, 820, 156, `<rect x="400" y="620" width="400" height="400" fill="#f4f1ea"/>` + spider(600, 830, .8, '#5a5a5a') + `<rect x="400" y="620" width="400" height="400" fill="#ff5a5a" opacity="${.3 * (1 - dp)}"/><rect x="400" y="620" width="400" height="400" fill="#9aa3ad" opacity="${.35 * dp}"/>`, { glow: dp > .5 ? '#bfefff' : '#ff9a7a' });
    const r = rng(20); for (let i = 0; i < 40; i++) { const a = r() * 6.28, d0 = 150 + r() * 40; s += `<circle cx="${600 + Math.cos(a) * (d0 + dp * 300 * r())}" cy="${820 + Math.sin(a) * (d0 + dp * 300 * r()) - dp * 200}" r="${14 + r() * 26}" fill="#ff4a4a" opacity="${(1 - dp) * .5 * Math.min(1, dp * 8)}" filter="url(#b10)"/>`; }
    return s + vignette();
  } },
  // 21 Garra arranca a memória inteira
  { s: 61.68, z: [1, 1.05], c: [600, 800], f: (t, p) => {
    const up = easeIn(seg(p, .35, 1));
    let s = brainViz(t);
    s += `<rect width="${W}" height="${H}" fill="#062a3a" opacity=".35"/>`;
    const by = lerp(820, -300, up);
    s += `<path d="M600,-100 V${by - 200}" stroke="#9fb1bc" stroke-width="40"/>`;
    s += g(`<rect x="-80" y="-60" width="160" height="80" rx="16" fill="#cfd9df"/><path d="M-60,0 C-140,60 -140,160 -80,200" stroke="#cfd9df" stroke-width="30" fill="none" stroke-linecap="round"/><path d="M60,0 C140,60 140,160 80,200" stroke="#cfd9df" stroke-width="30" fill="none" stroke-linecap="round"/><circle r="16" fill="#5fd0ff" filter="url(#glow)"/>`, `translate(600,${lerp(-200, by - 200, easeOut(seg(p, 0, .35)))})`);
    s += bubble(600, by, 150, `<rect x="400" y="${by - 200}" width="400" height="400" fill="#f4f1ea"/>` + spider(600, by + 10, .8) + `<rect x="400" y="${by - 200}" width="400" height="400" fill="#ff5a5a" opacity=".25"/>`, { glow: '#ff9a7a' });
    if (up > 0) s += `<ellipse cx="600" cy="820" rx="${110 * up + 20}" ry="${90 * up + 10}" fill="#000" opacity="${.85 * Math.min(1, up * 3)}"/>`;
    return s + vignette();
  } },
  // 22 Marina na cadeira, tela APAGAR?
  { s: 65.52, z: [1.0, 1.08], c: [540, 1000], f: (t, p) => {
    let s = clinicBG(t);
    s += chair(540, 1560, 1.3, 0, .6, bust({ x: 0, y: -170, s: .95, ...MARINA, eyes: 'dot', mouth: 'flat', brows: 'serious', blink: (t % 3.2) < .12 }));
    const sp = seg(p, .55, .7);
    s += g(`<rect x="-250" y="-170" width="500" height="340" rx="30" fill="#0f2a33" opacity=".95" stroke="#5fd0ff" stroke-width="4" filter="url(#sh)"/>` + txt(0, -80, '14/03', 76, '#ffffff', { w: 900 }) + txt(0, -20, 'APAGAR MEMÓRIA?', 36, '#9fe3ff', { ls: 2 }) +
      `<rect x="-200" y="30" width="180" height="90" rx="20" fill="${sp > 0 ? '#ff5d5d' : '#24414e'}"/>` + txt(-110, 92, 'SIM', 46, '#fff') + `<rect x="20" y="30" width="180" height="90" rx="20" fill="#24414e"/>` + txt(110, 92, 'NÃO', 46, '#9fb6c4'), `translate(540,420) scale(${1 + .05 * sp})`);
    return s + vignette();
  } },
  // 23 Rio, botas boiando
  { s: 68.12, z: [1.0, 1.1], c: [540, 1150], f: (t, p) => {
    let s = riverBG(t);
    s += `<g opacity=".85">${g(boots(0, 0, .8, -12), `translate(${560 + Math.sin(t) * 10},${1000 + Math.sin(t * 2) * 6})`)}</g>`;
    s += `<ellipse cx="560" cy="1040" rx="140" ry="20" fill="none" stroke="#9aa69c" stroke-width="4" opacity="${.5 + .3 * Math.sin(t * 3)}"/>`;
    s += grass(t, 1940, 70, 23, '#5d6b4c', '#4a5840', 520, 'b2');
    return `<g filter="url(#gray)">${s.replace(/fill="#ffc928"|fill="#ffd95a"|fill="#f2b916"|fill="#ffd24a"/g, m => m)}</g>` + g(boots(0, 0, .8, -12), `translate(${560 + Math.sin(t) * 10},${1000 + Math.sin(t * 2) * 6})`, 'opacity=".9"') + grass(t, 1940, 40, 77, '#4f5c44', '#434f3a', 600, 'b5').replace(/#4f5c44|#434f3a/g, '#4a5242') + grain(Math.floor(t * 24), .12) + vignette(true);
  } },
  // 24 Saindo da clínica
  { s: 72.16, z: [1.06, 1.0], c: [540, 1000], f: (t, p) => {
    let s = `<rect width="${W}" height="${H}" fill="#f8fbfd"/>`;
    s += `<ellipse cx="540" cy="900" rx="700" ry="900" fill="#ffffff" filter="url(#b60)"/>`;
    s += `<rect x="140" y="200" width="800" height="1500" fill="#e3edf2" opacity=".5"/><rect x="530" y="200" width="20" height="1500" fill="#c5d3db"/><rect x="140" y="200" width="800" height="1500" fill="none" stroke="#c5d3db" stroke-width="20"/>`;
    s += `<rect x="0" y="1700" width="${W}" height="300" fill="#dfe6ea"/>`;
    const sc = lerp(1.25, 1.45, ease(p));
    s += g(bust({ x: 0, y: 0, s: 1, ...MARINA, eyes: 'dot', mouth: 'small', brows: 'neutral' }), `translate(540,${1150 + Math.sin(t * 5) * 6}) scale(${sc})`);
    s += `<rect width="${W}" height="${H}" fill="#fff" opacity="${.35 - .25 * p}"/>`;
    return s + vignette();
  } },
  // 25 Vazia (close)
  { s: 73.92, z: [1.0, 1.08], c: [540, 900], f: (t, p) => {
    let s = `<defs>${linGrad('v25', [[0, '#cfd8de'], [1, '#9eabb4']])}</defs><rect width="${W}" height="${H}" fill="url(#v25)"/>`;
    s += bust({ x: 540, y: 900, s: 3.4, ...MARINA, eyes: 'dot', mouth: 'flat', brows: 'neutral' });
    return `<g filter="url(#gray)">${s}</g>` + vignette();
  } },
  // 26 Livre (de costas, calçada)
  { s: 74.84, z: [1.2, 1.0], c: [540, 1100], f: (t, p) => {
    let s = `<defs>${linGrad('st', [[0, '#b8c6cf'], [1, '#e6ecef']])}</defs><rect width="${W}" height="${H}" fill="url(#st)"/>`;
    s += `<g filter="url(#b10)">`; const r = rng(26); for (let i = 0; i < 9; i++) s += `<rect x="${i * 130 - 30}" y="${200 + r() * 300}" width="120" height="1200" fill="${['#8a9aa6', '#a7b4bc', '#7d8c97'][i % 3]}"/>`; s += `</g>`;
    s += `<path d="M0,1300 L${W},1300 L${W},${H} L0,${H}Z" fill="#c9cfd2"/>`;
    s += `<g filter="url(#b5)">`; for (let i = 0; i < 16; i++) { const x = (r() * W + t * (r() < .5 ? 80 : -80) + W) % W; s += tiny(x, 1180 + r() * 160, 2 + r() * .8, ['#6a7a8a', '#8a6a5a', '#5a6a5a', '#7a7a8a'][i % 4], SK, '#3a302a'); } s += `</g>`;
    // Marina de costas
    s += g(`<path d="M-176,460 C-176,260 -150,176 -64,156 L64,156 C150,176 176,260 176,460 Z" fill="#3b4150"/><rect x="-26" y="60" width="52" height="110" rx="22" fill="${SKS}"/>` + g(`<ellipse cx="0" cy="0" rx="66" ry="78" fill="#4a3326"/><path d="M-88,0 C-92,-80 -40,-104 0,-104 C40,-104 92,-80 88,0 L88,76 C60,94 -60,94 -88,76Z" fill="#4a3326"/>`, 'translate(0,-10)') + `<rect x="-150" y="460" width="300" height="400" fill="#2f3440"/>`, `translate(540,${1240 + Math.abs(Math.sin(t * 5)) * 10}) scale(1.1)`);
    return s + vignette();
  } },
  // 27 Café: homem chorando
  { s: 75.84, z: [1.0, 1.1], c: [600, 900], f: (t, p) => {
    let s = cafeBG(t);
    s += table(1350, '#4a3328');
    s += g(`<rect x="-40" y="-10" width="80" height="70" rx="12" fill="#f2efe8"/><path d="M40,10 q30,10 0,35" stroke="#f2efe8" stroke-width="10" fill="none"/>`, 'translate(720,1330)');
    s += bust({ x: 680, y: 960, s: 1.25, ...MAN, eyes: 'closed', mouth: 'sad', brows: 'sad', tears: true, tearP: t * .7, headband: true });
    s += `<g filter="url(#b18)">${bust({ x: 150, y: 1500, s: 2.2, ...MARINA }).replace('translate(150,1500)', 'translate(150,1500) scale(-1,1)')}${g(`<rect x="-60" y="-80" width="120" height="140" rx="20" fill="#e9e4da"/>`, 'translate(320,1560)')}</g>`;
    s += g(`<rect x="-210" y="-50" width="420" height="100" rx="16" fill="#111" opacity=".75"/>` + txt(0, 22, '7 MESES DEPOIS', 54, '#ffffff', { ls: 3 }), 'translate(540,230)', `opacity="${seg(p, .02, .15) * (1 - seg(p, .8, .95))}"`);
    return s + vignette();
  } },
  // 28 Close do homem, botas no reflexo
  { s: 80.88, z: [1.0, 1.1], c: [540, 820], f: (t, p) => {
    let s = cafeBG(t, { blur: 18 });
    s += bust({ x: 540, y: 980, s: 3.0, ...MAN, eyes: 'closed', mouth: p > .2 ? 'small' : 'sad', brows: 'sad', tears: true, tearP: t * .7, headband: true });
    const bo = seg(p, .25, .45) * (1 - seg(p, .9, 1));
    s += `<g opacity="${bo}">` + `<circle cx="540" cy="520" r="150" fill="#ffffff" opacity=".18" filter="url(#b10)"/>` + bubble(540, 520, 120, `<rect x="400" y="380" width="300" height="300" fill="#7b8478"/>` + boots(540, 540, .9, -8), { glow: '#ffe08a' }) + `</g>`;
    return s + vignette(true);
  } },
  // 29 Xícara para no ar
  { s: 86.88, z: [1.08, 1.16], c: [540, 1000], f: (t, p) => {
    let s = cafeBG(t, { blur: 18 });
    const tr = Math.sin(t * 45) * 3;
    s += bust({ x: 540, y: 1000, s: 2.2, ...MARINA, eyes: 'wide', mouth: 'small', brows: 'up' });
    s += g(`<rect x="-110" y="-100" width="220" height="200" rx="30" fill="#f2efe8" filter="url(#sh)"/><path d="M110,-50 q70,10 0,90" stroke="#f2efe8" stroke-width="22" fill="none"/><ellipse cx="0" cy="-96" rx="104" ry="20" fill="#5a3a24"/><ellipse cx="0" cy="-96" rx="${40 + 30 * Math.abs(Math.sin(t * 20))}" ry="8" fill="none" stroke="#7a5236" stroke-width="3"/>`, `translate(${540 + tr},${1500})`);
    s += hand(400 + tr, 1640, 1.3, 20, { sleeve: '#3b4150', fist: true });
    return s + vignette();
  } },
  // 30 Cérebro da Marina com buraco
  { s: 88.16, z: [1, 1.1], c: [600, 860], f: (t, p) => brainViz(t) + `<circle cx="600" cy="820" r="${150 + 4 * Math.sin(t * 2)}" fill="#020406"/><circle cx="600" cy="820" r="150" fill="none" stroke="#5fd0ff" stroke-width="3" stroke-dasharray="10 12" opacity=".6"/>` + txt(600, 1010, 'APAGADO', 34, '#5fd0ff', { ls: 6, op: .8 }) + vignette(true) },
  // 31 Presente com botas
  { s: 89.76, z: [1.0, 1.1], f: (t, p) => {
    let s = `<defs>${radGrad('w31', [[0, '#ffe2a8'], [1, '#a5632e']])}</defs><rect width="${W}" height="${H}" fill="url(#w31)"/>`;
    const r = rng(31); for (let i = 0; i < 18; i++) s += `<circle cx="${r() * W}" cy="${r() * H}" r="${30 + r() * 70}" fill="#fff4d0" opacity="${.15 + r() * .2}" filter="url(#b18)"/>`;
    s += `<path d="M180,1100 L900,1100 L860,1600 L220,1600Z" fill="#c9473f" filter="url(#sh)"/><rect x="510" y="1100" width="60" height="500" fill="#f4d36a"/><path d="M160,1060 L920,1060 L900,1120 L180,1120Z" fill="#a83a33"/>`;
    s += g(`<path d="M-460,0 L360,0 L380,-60 L-440,-60Z" fill="#d55a50"/>`, `translate(540,${1000 - 40 * easeOut(p)}) rotate(${-25 * easeOut(p)})`);
    s += boots(500, lerp(1150, 1000, easeOut(seg(p, .1, .6))), 2.2, -6);
    return s + vignette();
  } },
  // 32 Mãos calçando a bota no pé do Theo
  { s: 91.28, z: [1.05, 1.12], f: (t, p) => {
    let s = `<defs>${radGrad('w32', [[0, '#f6d7a6'], [1, '#9c6a3c']])}</defs><rect width="${W}" height="${H}" fill="url(#w32)"/>`;
    s += `<rect x="0" y="1200" width="${W}" height="800" fill="#b88a5a"/>`;
    const pull = easeOut(seg(p, 0, .7));
    s += `<rect x="440" y="300" width="140" height="${700 + 60 * pull}" rx="60" fill="#3f78c9"/>`;
    s += `<rect x="460" y="${900 + 100 * pull}" width="100" height="200" rx="40" fill="${SKL}"/>`;
    s += g(`<path d="M-90,-300 L90,-300 L90,40 L230,40 C280,40 290,90 270,120 L-100,120 Z" fill="${YEL}"/><rect x="-100" y="110" width="380" height="40" rx="14" fill="#d9a10f"/><rect x="-104" y="-320" width="208" height="40" rx="14" fill="#ffd95a"/>`, `translate(510,${1300 - 80 * pull})`);
    s += hand(330, 1080 - 80 * pull, 1.5, 70, { sleeve: '#3b4150' }) + hand(720, 1080 - 80 * pull, 1.5, -70, { sleeve: '#3b4150' });
    return s + vignette();
  } },
  // 33 Marina senta na frente dele
  { s: 92.72, z: [1.0, 1.06], c: [540, 1000], f: (t, p) => {
    let s = cafeBG(t);
    s += table(1400, '#4a3328');
    const mx = lerp(-200, 260, easeOut(seg(p, 0, .5)));
    s += bust({ x: mx, y: 1060, s: 1.2, ...MARINA, eyes: 'dot', mouth: 'flat', brows: 'serious', look: 10 });
    s += bust({ x: 820, y: 1060, s: 1.2, ...MAN, eyes: p > .4 ? 'wide' : 'red', mouth: p > .4 ? 'o' : 'sad', brows: 'up', look: -10 });
    s += g(`<path d="M-66,-40 C-40,-72 40,-72 66,-40" stroke="#eef6fb" stroke-width="10" fill="none" stroke-linecap="round"/>`, `translate(${lerp(820, 900, seg(p, .3, .6))},${lerp(870, 1380, easeOut(seg(p, .3, .6)))}) scale(1.2)`);
    s += `<rect x="-20" y="1400" width="${W + 40}" height="18" fill="#000" opacity=".2"/>`;
    return s + vignette();
  } },
  // 34 Recibo holográfico
  { s: 94.24, z: [1.0, 1.08], f: (t, p) => {
    let s = cafeBG(t, { blur: 18 }) + `<rect width="${W}" height="${H}" fill="#04121a" opacity=".45"/>`;
    s += hand(540, 1650, 1.6, 0, { sleeve: '#3a3e46', watch: true });
    s += `<path d="M380,1480 L160,560 L920,560 L700,1480Z" fill="#5fd0ff" opacity=".08"/>`;
    const lines = [['LETHE', 60, '#ffffff'], ['MEMÓRIA Nº 48.213', 54, '#9fe3ff'], ['LUTO INFANTIL', 54, '#ffffff'], ['R$ 42.000', 70, YEL], ['DOADORA: M.A.', 40, '#9fb6c4']];
    let h = `<rect x="-360" y="-330" width="720" height="660" rx="30" fill="#0f2a33" fill-opacity=".55" stroke="#5fd0ff" stroke-width="5"/>` + logo(0, -240, .7);
    lines.forEach(([l, sz, c], i) => { const o = seg(p, .05 + i * .1, .15 + i * .1); h += txt(0, -140 + i * 100, l, sz, c, { op: o, ls: 2 }); });
    for (let i = 0; i < 20; i++) h += `<rect x="-360" y="${-330 + ((i * 33 + t * 60) % 660)}" width="720" height="2" fill="#9fe3ff" opacity=".12"/>`;
    s += g(h, `translate(540,${780 + Math.sin(t * 2) * 8})`, 'filter="url(#glow)"');
    return s + vignette();
  } },
  // 35 Close sério do homem
  { s: 102.28, z: [1.0, 1.1], c: [540, 860], f: (t, p) => cafeBG(t, { blur: 18 }) + bust({ x: 540, y: 1000, s: 3.0, ...MAN, eyes: 'red', mouth: 'flat', brows: 'serious' }) + vignette(true) },
  // 36 POV celular + rio + timer 40s
  { s: 104.213, z: [1.0, 1.06], c: [540, 1100], f: (t, p, d) => {
    let s = `<g filter="url(#b10)">${riverBG(t)}${g(boots(0, 0, .35, 0), 'translate(820,1420)')}</g>`;
    s += grass(t, 1940, 40, 36, '#5d6b4c', '#4a5840', 380, 'b5');
    s = `<g filter="url(#gray)">${s}</g>` + `<circle cx="822" cy="1420" r="22" fill="${YEL}" filter="url(#glow)" opacity=".9"/>`;
    s += phone(520, 1300, 1.7, -6, chatScreen());
    s += hand(560, 1600, 1.7, -6, { sleeve: '#3b4150', fist: true });
    const sec = Math.min(40, Math.floor(seg(p, 0, .95) * 40));
    s += g(`<rect x="-120" y="-50" width="240" height="100" rx="18" fill="#000" opacity=".6"/>` + txt(0, 24, `00:${String(sec).padStart(2, '0')}`, 64, '#ff5d5d', { w: 900, ls: 3 }), 'translate(860,200)');
    return s + grain(Math.floor(t * 24), .12) + vignette(true);
  } },
  // 37 Marina congelada, mundo perde a cor
  { s: 109.52, z: [1.0, 1.12], c: [540, 900], f: (t, p) => {
    const s = cafeBG(t, { blur: 18 }) + bust({ x: 540, y: 1000, s: 2.3, ...MARINA, eyes: 'wide', mouth: 'small', brows: 'sad' });
    return `<g filter="url(#gray)">${s}</g><g opacity="${1 - ease(p)}">${s}</g>` + `<rect width="${W}" height="${H}" fill="#000" opacity="${.3 * p}"/>` + vignette(true);
  } },
  // 38 Olhos, reflexo das botas, corte seco
  { s: 111.76, z: [1.0, 1.15], c: [540, 960], f: (t, p) => {
    if (p > .88) return `<rect width="${W}" height="${H}" fill="#000"/>`;
    let s = `<rect width="${W}" height="${H}" fill="${SK}"/><rect width="${W}" height="${H}" fill="url(#skinG)" opacity=".5"/>`;
    s += `<path d="M0,560 h${W}" stroke="#4a3326" stroke-width="140"/>`;
    for (const ex of [270, 810]) {
      s += `<ellipse cx="${ex}" cy="960" rx="190" ry="120" fill="#f4f0ea"/><circle cx="${ex}" cy="960" r="105" fill="#3a2a1e"/><circle cx="${ex}" cy="960" r="52" fill="#0b0b0b"/>`;
      s += g(boots(0, 0, .3, 0), `translate(${ex + 10},${972})`, `opacity="${seg(p, .2, .5) * .9}"`);
      s += `<circle cx="${ex - 40}" cy="920" r="16" fill="#fff" opacity=".8"/>`;
      s += `<path d="M${ex - 200},${960} Q${ex},${760} ${ex + 200},${960}" stroke="${SKS}" stroke-width="30" fill="none"/>`;
    }
    return s + vignette(true);
  } },
  // 39 Cartão deslizando na mesa
  { s: 114.8, z: [1.0, 1.06], f: (t, p) => {
    let s = `<defs>${linGrad('tb', [[0, '#3b2a20'], [1, '#5a3e2c']])}</defs><rect width="${W}" height="${H}" fill="url(#tb)"/>`;
    for (let i = 0; i < 12; i++) s += `<path d="M0,${150 + i * 150} C300,${130 + i * 150} 700,${180 + i * 150} ${W},${150 + i * 150}" stroke="#2e2018" stroke-width="4" fill="none" opacity=".5"/>`;
    s += g(`<rect x="-40" y="-10" width="80" height="70" rx="12" fill="#f2efe8"/>`, 'translate(200,500) scale(2.2)', 'filter="url(#b5)"');
    const cx = lerp(1100, 540, easeOut(seg(p, 0, .6)));
    s += blackCard(cx, 1000, 1.6, lerp(-30, -4, easeOut(seg(p, 0, .6))));
    s += hand(cx + 260, 1180, 1.5, -70, { sleeve: '#3a3e46', watch: true });
    return s + vignette();
  } },
  // 40 Lado do endereço
  { s: 116.773, z: [1.0, 1.08], f: (t, p) => {
    let s = `<rect width="${W}" height="${H}" fill="#2b1e17"/><ellipse cx="540" cy="960" rx="500" ry="400" fill="#5fd0ff" opacity=".18" filter="url(#b60)"/>`;
    const fl = easeOut(seg(p, 0, .3));
    s += g(blackCard(0, 0, 1, 0, 'addr'), `translate(540,820) scale(${lerp(.05, 2.1, fl)},2.1) rotate(-3)`);
    return s + vignette();
  } },
  // 41 QR + mergulho no arquivo
  { s: 120.48, z: [1.0, 1.0], f: (t, p) => {
    let s = archiveBG(t, { dy: -p * 400 });
    const fl = easeOut(seg(p, 0, .25)), dive = easeIn(seg(p, .45, 1));
    const cardSvg = `<rect width="${W}" height="${H}" fill="#2b1e17" opacity="${1 - dive}"/>` + g(blackCard(0, 0, 1, 0, 'qr'), `translate(540,820) scale(${lerp(.05, 2.1, fl) * (1 + dive * 8)},${2.1 * (1 + dive * 8)})`);
    return s + `<g opacity="${1 - seg(p, .75, .95)}">${cardSvg}</g>` + vignette();
  } },
  // 42 Cápsula 48.213 com luz amarela
  { s: 126.32, z: [1.0, 1.25], c: [540, 960], f: (t, p) => {
    let s = archiveBG(t, { sharp: true });
    s += `<rect width="${W}" height="${H}" fill="#000" opacity=".35"/>`;
    s += g(`<rect x="-80" y="-130" width="160" height="260" rx="34" fill="#0e3242" stroke="#ffe08a" stroke-width="6"/><circle r="${46 + 4 * Math.sin(t * 4)}" fill="${YEL}" filter="url(#glow2)" opacity=".9"/><rect x="-70" y="150" width="140" height="48" rx="10" fill="#0f2a33" stroke="#ffe08a" stroke-width="3"/>` + txt(0, 186, '48.213', 34, '#ffe08a'), 'translate(540,960) scale(1.3)');
    return s + vignette(true);
  } },
  // 43 Opção A
  { s: 127.6, z: [1, 1], f: (t, p) => splitAB(t, p, 0) },
  // 44 Opção A + B
  { s: 131.84, z: [1, 1], f: (t, p) => splitAB(t, p, 1) },
];

function splitAB(t, p, mode) {
  // Lado A: Marina na cadeira com capacete descendo
  let A = clinicBG(t, { logo: false }) + chair(540, 1640, 1.3, mode === 0 ? ease(p) * .9 : .9, 1, bust({ x: 0, y: -170, s: .95, ...MARINA, eyes: 'closed', mouth: 'flat', brows: 'sad' }));
  A += txt(540, 760, 'A', 380, '#ffffff', { w: 900, extra: 'stroke="#000" stroke-width="16" paint-order="stroke"' });
  // Lado B: Marina de capuz no arquivo com isqueiro
  let B = archiveBG(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".3"/>`;
  const fl = 1 + .15 * Math.sin(t * 20);
  B += bust({ x: 540, y: 1300, s: 1.5, hair: 'hood', top: '#2f343e', outfit: 'hoodie', eyes: 'dot', mouth: 'flat', brows: 'serious' });
  B += `<ellipse cx="720" cy="1290" rx="${120 * fl}" ry="${140 * fl}" fill="#ff9a3a" opacity=".35" filter="url(#b30)"/>` + hand(720, 1500, 1.1, -5, { fist: true, sleeve: '#2f343e' }) + `<rect x="690" y="1340" width="60" height="70" rx="8" fill="#b0b8c0"/><path d="M720,1340 C700,${1300 - 20 * fl} 715,${1260 - 30 * fl} 722,${1250 - 30 * fl} C735,${1280 - 20 * fl} 740,1310 720,1340Z" fill="#ffcf5a" filter="url(#glow)"/>`;
  B += txt(540, 760, 'B', 380, YEL, { w: 900, extra: 'stroke="#000" stroke-width="16" paint-order="stroke"' });
  if (mode === 0) {
    const reveal = 1;
    return `<defs><clipPath id="hl"><rect x="0" y="0" width="${W / 2 + 270}" height="${H}"/></clipPath></defs>` + A + vignette(true);
  }
  const sp = easeOut(seg(p, 0, .25));
  const half = W / 2;
  let s = `<defs><clipPath id="cA"><rect x="0" y="0" width="${lerp(W, half, sp)}" height="${H}"/></clipPath><clipPath id="cB"><rect x="${lerp(W, half, sp)}" y="0" width="${W}" height="${H}"/></clipPath></defs>`;
  s += `<g clip-path="url(#cA)">${g(A, `translate(${lerp(0, -270, sp)},0)`)}</g>`;
  s += `<g clip-path="url(#cB)">${g(B, `translate(${lerp(540, 270, sp)},0)`)}</g>`;
  s += `<rect x="${lerp(W, half, sp) - 5}" y="0" width="10" height="${H}" fill="#fff"/>`;
  return s + vignette();
}
