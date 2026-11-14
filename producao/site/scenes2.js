// LETHE — PARTE 2. Cada cena tem k = primeiras palavras da frase (o início é achado na transcrição).
const MARINA = { hair: 'marina', top: '#3b4150', outfit: 'coat' };
const MARINA_H = { hair: 'hood', top: '#2f343e', outfit: 'hoodie' };
const MAN = { hair: 'grey', top: '#3a3e46', outfit: 'suit', browCol: '#7d8188' };
const PART = { words: 'words2.json', end: 127.1, abTime: 116.5,
  merges: [
    [['três','e','catorze','da','manhã'], '03:14'],
    [['onze','minutos'], '11 MINUTOS'],
    [['quatro','da','manhã'], '4 DA MANHÃ'],
    [['vinte','e','quatro','pessoas'], '24 PESSOAS'],
    [['quatro','histórias'], '4 HISTÓRIAS'],
    [['uma','em','cada','quatro'], '1 EM CADA 4'],
    [['duzentos','e','treze','de','duzentos','e','treze'], '213 DE 213'],
    [['quarta','invasão'], '4ª INVASÃO'],
    [['três','invasões'], '3 INVASÕES'],
  ],
  hl: ['invadir','otávio','diretor','compras','demais','demitido','cartão','porta','alarme','nenhum','arquivo','fim','azuis','sente','noiva','altar','soldado','tiro','mãe','telefone','cada','destruir','numeração','amarela','isqueiro','hesita','vendidas','prova','theo','cinza','cabeça','1995','washington','verdadeiras','inventada','shopping','detalhes','plantar','conversa','cadeira','etiqueta','linha','doador','zero','original','cópias','nada','viva','originais','fogo','grita','dispara','voz','marina','alves','volta','duto','cápsula','caçar','sozinha','ficar','escolheram','lembranças','lethe']
};

// ---------- novos elementos ----------
function fire(x, y, s, t, seed = 1) {
  const r = rng(seed); let f = `<ellipse cx="0" cy="-60" rx="160" ry="140" fill="#ff7a1a" opacity=".35" filter="url(#b30)"/>`;
  for (let i = 0; i < 9; i++) {
    const ox = (r() - .5) * 180, h = 160 + r() * 200, w = 50 + r() * 50, ph = r() * 6;
    const fh = h * (0.8 + 0.2 * Math.sin(t * 9 + ph)), sw = Math.sin(t * 6 + ph) * 18;
    f += `<path d="M${ox - w},0 C${ox - w},${-fh * .4} ${ox + sw},${-fh * .6} ${ox + sw * 1.5},${-fh} C${ox + sw},${-fh * .6} ${ox + w},${-fh * .4} ${ox + w},0Z" fill="${i % 3 === 0 ? '#ffd24a' : i % 3 === 1 ? '#ff8a1f' : '#ff5a1a'}" opacity=".92"/>`;
  }
  f += `<path d="M-60,0 C-60,-50 0,-90 0,-130 C0,-90 60,-50 60,0Z" fill="#fff2b0" opacity=".9"/>`;
  return g(f, `translate(${x},${y}) scale(${s})`, 'filter="url(#glow)"');
}
function lighter(x, y, s, t, open = 1, flame = 1) {
  let l = `<rect x="-60" y="-10" width="120" height="170" rx="16" fill="#b6bec6"/><rect x="-60" y="-10" width="120" height="30" fill="#9aa3ac"/>`;
  l += g(`<rect x="-60" y="-90" width="120" height="80" rx="14" fill="#c9d0d6"/>`, `rotate(${-110 * open},-60,-10)`);
  l += `<rect x="-20" y="-40" width="40" height="34" fill="#7c858e"/><circle cx="-10" cy="-30" r="16" fill="#5d656c"/>`;
  if (flame > 0) l += g(`<ellipse cx="0" cy="-90" rx="60" ry="80" fill="#ff9a3a" opacity=".4" filter="url(#b18)"/><path d="M0,-40 C-36,-70 -20,-120 ${4 + Math.sin(t * 20) * 6},-${150 + 10 * Math.sin(t * 13)} C20,-120 36,-70 0,-40Z" fill="#ffcf5a"/><path d="M0,-44 C-14,-60 -8,-86 2,-100 C10,-86 14,-60 0,-44Z" fill="#fff6c8"/>`, `scale(${flame})`, 'filter="url(#glow)"');
  return g(l, `translate(${x},${y}) scale(${s})`);
}
function capsule(x, y, s, col, label, t = 0) {
  return g(`<rect x="-80" y="-130" width="160" height="260" rx="34" fill="#0e3242" stroke="${col}" stroke-width="6"/><circle r="${46 + 4 * Math.sin(t * 4)}" fill="${col}" filter="url(#glow2)" opacity=".9"/>` + (label ? `<rect x="-80" y="150" width="160" height="48" rx="10" fill="#0f2a33" stroke="${col}" stroke-width="3"/>` + txt(0, 186, label, 34, col) : ''), `translate(${x},${y}) scale(${s})`);
}
function corridor(t, walk = 0) {
  let s = `<defs>${linGrad('cor', [[0, '#02090d'], [.5, '#0a2633'], [1, '#02090d']])}</defs><rect width="${W}" height="${H}" fill="url(#cor)"/>`;
  const vx = 540, vy = 900;
  for (const side of [-1, 1]) {
    for (let i = 14; i >= 0; i--) {
      const z = ((i - (t * 0.6) % 1) + 1), sc = 1 / (z * 0.38 + 0.2);
      const x = vx + side * 520 * sc / 2.6, w = 80 * sc / 2.6, h = 900 * sc / 2.6;
      if (sc < .25) continue;
      s += `<rect x="${x - (side < 0 ? w : 0)}" y="${vy - h / 2}" width="${w}" height="${h}" fill="#0e3242" stroke="#2f6f86" stroke-width="${2 * sc / 2.6}" opacity="${Math.min(1, sc / 1.5)}"/>`;
      for (let k = 0; k < 4; k++) s += `<circle cx="${x + (side < 0 ? -w / 2 : w / 2)}" cy="${vy - h / 2 + h * (k + .5) / 4}" r="${16 * sc / 2.6}" fill="#3fc7ff" opacity="${Math.min(1, sc / 1.6) * (.6 + .4 * Math.sin(t * 2 + i + k))}" filter="url(#glow)"/>`;
    }
  }
  s += `<path d="M0,${H} L${vx - 30},${vy + 60} L${vx + 30},${vy + 60} L${W},${H}Z" fill="#0b1f28"/>`;
  s += `<ellipse cx="${vx}" cy="${vy}" rx="120" ry="200" fill="#5fd0ff" opacity=".18" filter="url(#b30)"/>`;
  return s;
}
function memBubbleScene(t, p, inner, glow) {
  return archiveBG(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".35"/>` + g(bubble(0, 0, 330, inner, { glow }), `translate(540,${820 - 20 * p}) scale(${lerp(.85, 1, easeOut(seg(p, 0, .3)))})`) + vignette(true);
}
function badge(x, y, s, t, stamp = 0) {
  let b = `<rect x="-230" y="-320" width="460" height="640" rx="30" fill="#eef3f6" filter="url(#sh)"/><rect x="-230" y="-320" width="460" height="130" rx="30" fill="#0f2a33"/>` + logo(-140, -255, .6) + txt(40, -235, 'LETHE', 56, '#e9fbff', { ls: 8 });
  b += `<rect x="-120" y="-160" width="240" height="250" rx="16" fill="#9fb1bc"/>` + g(headG({ ...MAN, eyes: 'dot', mouth: 'flat' }), 'translate(0,-20) scale(1.2)');
  b += txt(0, 150, 'OTÁVIO R.', 50, '#1a2a33') + txt(0, 200, 'DIRETOR DE COMPRAS', 32, '#5a6a74', { ls: 2 }) + `<rect x="-160" y="240" width="320" height="40" fill="#1a2a33"/>`;
  if (stamp > 0) b += g(`<rect x="-220" y="-60" width="440" height="120" rx="12" fill="none" stroke="#d22" stroke-width="12"/>` + txt(0, 34, 'DEMITIDO', 96, '#d22', { w: 900, ls: 6 }), `translate(0,40) rotate(-14) scale(${lerp(2.2, 1, easeOut(stamp))})`, `opacity="${Math.min(1, stamp * 3) * .9}"`);
  return g(b, `translate(${x},${y}) scale(${s})`);
}
function people24(hlCount, p, t) {
  let s = '';
  for (let i = 0; i < 24; i++) {
    const c = i % 4, rI = Math.floor(i / 4), x = 225 + c * 210, y = 380 + rI * 170;
    const on = [1, 6, 11, 15, 18, 22].indexOf(i);
    const lit = on >= 0 && on < hlCount;
    s += g(`<circle cx="0" cy="-34" r="30" fill="${lit ? '#ffc928' : '#8a8070'}"/><rect x="-40" y="0" width="80" height="80" rx="34" fill="${lit ? '#ffc928' : '#8a8070'}"/>`, `translate(${x},${y})`, lit ? 'filter="url(#glow)"' : '');
  }
  return s;
}
function mall(t, detail = 0) {
  let s = `<rect width="${W}" height="${H}" fill="#e8dcc0"/><rect y="1200" width="${W}" height="800" fill="#c9b892"/>`;
  for (let i = 0; i < 3; i++) s += `<rect x="${60 + i * 340}" y="520" width="300" height="680" fill="#d8c7a0"/><rect x="${80 + i * 340}" y="560" width="260" height="70" fill="${['#a65a4a', '#4a7a8a', '#7a8a4a'][i]}"/><rect x="${90 + i * 340}" y="680" width="240" height="420" fill="#f2ead8"/>`;
  s += g(`<rect x="-30" y="0" width="60" height="110" rx="24" fill="#c94a3a"/><rect x="-26" y="100" width="20" height="70" rx="8" fill="#3a3f48"/><rect x="6" y="100" width="20" height="70" rx="8" fill="#3a3f48"/><circle cy="-30" r="34" fill="${SK}"/><path d="M-34,-36 a34,34 0 0 1 68,0 q-34,-14 -68,0z" fill="#6b4a32"/><circle cx="-12" cy="-28" r="4" fill="#222"/><circle cx="12" cy="-28" r="4" fill="#222"/><path d="M-10,-10 q10,-8 20,0" stroke="#5a2e22" stroke-width="4" fill="none"/><path d="M-6,-46 l-4,10" stroke="#9fd6ff" stroke-width="3"/>`, 'translate(540,1260) scale(1.6)');
  if (detail > 0) {
    s += g(`<path d="M0,0 C10,-120 -20,-200 0,-300" stroke="#5a4a36" stroke-width="3" fill="none"/><ellipse cx="0" cy="-360" rx="60" ry="72" fill="#d23"/>`, 'translate(620,1250)', `opacity="${seg(detail, 0, .3)}"`);
    s += g(tiny(0, 0, 3, '#2a3a5a') + `<rect x="-30" y="10" width="60" height="16" fill="#e0b44c"/>`, 'translate(860,1200)', `opacity="${seg(detail, .3, .6)}"`);
    s += g(`<rect x="-120" y="-40" width="240" height="80" rx="10" fill="#a65a4a"/>` + txt(0, 18, 'BRINQUEDOS', 36, '#fff4d8'), 'translate(210,595)', `opacity="${seg(detail, .6, .9)}"`);
  }
  return s;
}
function alarmLight(x, y, s, t) {
  const a = (t * 400) % 360;
  return g(`<path d="M0,0 L700,-160 L700,160Z" fill="#ff2a2a" opacity=".25" transform="rotate(${a})" filter="url(#b18)"/><path d="M0,0 L700,-160 L700,160Z" fill="#ff2a2a" opacity=".25" transform="rotate(${a + 180})" filter="url(#b18)"/><rect x="-60" y="-20" width="120" height="70" rx="10" fill="#555"/><path d="M-50,-20 a50,60 0 0 1 100,0z" fill="#ff3a3a" filter="url(#glow)"/>`, `translate(${x},${y}) scale(${s})`);
}
function screensWall(t, p) {
  let s = '';
  const dates = ['02/06', '19/08', '30/09', 'AGORA'];
  dates.forEach((d, i) => {
    const x = 150 + (i % 2) * 400, y = 360 + Math.floor(i / 2) * 330, now = i === 3;
    s += g(`<rect x="0" y="0" width="370" height="290" rx="16" fill="#0f2a33" stroke="${now ? '#ff3a3a' : '#5fd0ff'}" stroke-width="6"/>` + txt(185, 60, now ? 'INVASÃO Nº 4' : `INVASÃO Nº ${i + 1}`, 40, now ? '#ff5d5d' : '#9fe3ff') + txt(185, 120, d, 34, '#fff', { fam: 'NU' }) + g(tiny(0, 0, 2.2, '#2f343e', SK, '#2f343e'), 'translate(185,170)'), `translate(${x},${y})`, `opacity="${seg(p, i * .15, i * .15 + .15)}"`);
  });
  return s;
}

const SCENES = [
  // 01 03:14
  { k: 'três e catorze', z: [1.1, 1.0], c: [540, 760], f: (t, p) => cityBG(t) + g(`<rect x="-260" y="-110" width="520" height="220" rx="24" fill="#05090c" opacity=".85" stroke="#ff3a3a" stroke-width="4"/>` + txt(0, 60, (Math.floor(t * 2) % 2 ? '03:14' : '03 14'), 170, '#ff3a3a', { w: 900, extra: 'filter="url(#glow)"' }), 'translate(540,1560)') + vignette() },
  // 02 11 minutos
  { k: 'você tem onze', z: [1, 1.06], f: (t, p) => { const sec = 660 - Math.floor(t); return archiveBG(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".3"/>` + g(`<rect x="-330" y="-130" width="660" height="260" rx="30" fill="#05090c" opacity=".85" stroke="#ff3a3a" stroke-width="5"/>` + txt(0, 70, `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`, 200, '#ff3a3a', { w: 900 }), 'translate(540,700)', 'filter="url(#glow)"') + lighter(540, 1600, 1.4, t, 1, 0) + vignette(); } },
  // 03 Vocês escolheram
  { k: 'vocês escolheram', z: [1, 1.08], f: (t, p) => { let s = `<rect width="${W}" height="${H}" fill="#07141b"/>`; const r = rng(3); for (let i = 0; i < 26; i++) { const yy = ((r() * H) - t * 260 * (1 + r())) % H + H; s += g(`<rect x="-70" y="-34" width="140" height="68" rx="30" fill="#e9fbff" opacity=".85"/>` + txt(0, 16, 'B', 44, '#0f2a33', { w: 900 }), `translate(${r() * W},${yy % H}) scale(${.5 + r() * .6})`, `opacity="${.25 + r() * .5}"`); } s += txt(540, 980, 'B', 640, YEL, { w: 900, extra: `stroke="#000" stroke-width="20" paint-order="stroke" filter="url(#glow)" transform="translate(540,760) scale(${lerp(.6, 1, easeOut(seg(p, 0, .3)))}) translate(-540,-760)"` }); return s + vignette(true); } },
  // 04 Marina vai invadir
  { k: 'marina vai invadir', z: [1.0, 1.08], c: [540, 1100], f: (t, p) => `<g filter="url(#b5)">${cityBG(t)}</g>` + bust({ x: 540, y: 1420, s: 1.7, ...MARINA_H, eyes: 'dot', mouth: 'flat', brows: 'serious' }) + vignette() },
  // 05 Otávio
  { k: 'o homem do café', z: [1.0, 1.08], c: [540, 900], f: (t, p) => { let s = `<defs>${radGrad('o5', [[0, '#2a4a58'], [1, '#081218']])}</defs><rect width="${W}" height="${H}" fill="url(#o5)"/>`; s += bust({ x: 540, y: 1100, s: 2.4, ...MAN, eyes: 'dot', mouth: 'flat', brows: 'neutral', blink: (t % 2.8) < .12 }); s += g(`<rect x="-200" y="-56" width="400" height="112" rx="18" fill="#05090c" opacity=".85" stroke="#5fd0ff" stroke-width="4"/>` + txt(0, 26, 'OTÁVIO', 76, '#ffffff', { ls: 8 }), 'translate(540,300)', `opacity="${seg(p, .2, .4)}"`); return s + vignette(); } },
  // 06 Crachá
  { k: 'exdiretor de compras', z: [1.05, 1.0], f: (t, p) => `<rect width="${W}" height="${H}" fill="#1a1512"/><ellipse cx="540" cy="900" rx="500" ry="600" fill="#5a4a3a" opacity=".5" filter="url(#b60)"/>` + badge(540, 860, 1.25, t, 0) + vignette() },
  // 07 Demitido
  { k: 'demitido por', z: [1.0, 1.06], f: (t, p) => `<rect width="${W}" height="${H}" fill="#1a1512"/><ellipse cx="540" cy="900" rx="500" ry="600" fill="#5a4a3a" opacity=".5" filter="url(#b60)"/>` + g(badge(0, 0, 1.25, t, seg(p, .1, .35)), `translate(${p > .1 && p < .38 ? Math.sin(t * 80) * 4 : 0},0)`).replace('translate(0,0) scale(1.25)', 'translate(540,860) scale(1.25)') + vignette() },
  // 08 Porta de serviço
  { k: 'o código do', z: [1.0, 1.08], f: (t, p) => {
    let s = `<rect width="${W}" height="${H}" fill="#1c2329"/><rect x="0" y="1500" width="${W}" height="500" fill="#14191d"/>`;
    const op = ease(seg(p, .5, .95));
    s += `<rect x="200" y="300" width="${340 - op * 300}" height="1200" fill="#46525b" stroke="#2a3238" stroke-width="6"/><rect x="${540 + op * 300}" y="300" width="${340 - op * 300}" height="1200" fill="#46525b" stroke="#2a3238" stroke-width="6"/>`;
    s += `<rect x="${540 - 340 + 340 - op * 300 - 0}" y="300" width="${op * 600}" height="1200" fill="#5fd0ff" opacity="${op * .5}" filter="url(#b18)"/>`;
    s += txt(540, 260, 'SERVIÇO', 48, '#9aa6ae', { ls: 10 });
    const ok = p > .35;
    s += g(`<rect x="-80" y="-130" width="160" height="260" rx="16" fill="#0f1418"/><rect x="-56" y="-100" width="112" height="112" rx="10" fill="#1e2a31"/><circle cx="0" cy="70" r="20" fill="${ok ? '#5fe08a' : '#ff3a3a'}" filter="url(#glow)"/>`, 'translate(960,900)');
    s += blackCard(lerp(1300, 900, easeOut(seg(p, 0, .3))), 860, .6, -10, 'qr');
    return s + vignette();
  } },
  // 09 Nenhum alarme
  { k: 'nenhum alarme', z: [1.0, 1.12], c: [540, 800], f: (t, p) => `<rect width="${W}" height="${H}" fill="#12171b"/>` + g(`<rect x="-40" y="-260" width="80" height="260" fill="#2a3238"/><path d="M-200,0 L160,-40 L200,80 L-180,120Z" fill="#d9dee2"/><circle cx="-150" cy="60" r="56" fill="#1a1f24"/><circle cx="-150" cy="60" r="30" fill="#0a0d10"/><circle cx="120" cy="10" r="14" fill="#3a2020"/>`, 'translate(540,800) scale(1.6)') + txt(540, 1500, 'REC ●', 70, '#3a3a3a', { ls: 6 }) + vignette(true) },
  // 10 Lá embaixo
  { k: 'lá embaixo', z: [1.15, 1.0], f: (t, p) => archiveBG(t, { dy: -p * 600 }) + vignette() },
  // 11 Corredores
  { k: 'corredores de', z: [1.0, 1.0], f: (t, p) => corridor(t) + g(tiny(-50, 0, 1.5, '#2f343e', SK, '#2f343e') + tiny(50, 0, 1.5, '#3a3e46', SK, '#a3a7ad'), `translate(540,${1180 - p * 40}) scale(${1 - p * .3})`) + vignette(true) },
  // 12 Encostar
  { k: 'basta encostar', z: [1.0, 1.1], c: [540, 800], f: (t, p) => { let s = archiveBG(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".35"/>` + capsule(540, 760, 2.2, '#3fc7ff', '', t); const tp = seg(p, .3, 1); for (let i = 0; i < 3; i++) { const rr = ((tp * 3 + i / 3) % 1); if (tp > 0) s += `<circle cx="540" cy="900" r="${100 + rr * 500}" fill="none" stroke="#9fe3ff" stroke-width="6" opacity="${(1 - rr) * .6}"/>`; } return s + hand(540, lerp(1500, 1080, easeOut(seg(p, 0, .3))), 1.6, 0, { sleeve: '#2f343e' }) + vignette(); } },
  // 13 Noiva
  { k: 'uma noiva', z: [1.0, 1.06], f: (t, p) => memBubbleScene(t, p, `<rect x="-400" y="-400" width="800" height="800" fill="#d8cbb8"/><path d="M-120,200 L-120,-160 A120,120 0 0 1 120,-160 L120,200Z" fill="#efe6d6"/><rect x="-330" y="200" width="660" height="200" fill="#b49a7a"/>` + g(`<path d="M-70,180 L-30,-20 L30,-20 L70,180Z" fill="#fbfbf8"/><circle cy="-60" r="34" fill="${SK}"/><path d="M-40,-80 C-60,0 -80,100 -60,180 L60,180 C80,100 60,0 40,-80Z" fill="#fff" opacity=".55"/><circle cx="-12" cy="-58" r="4" fill="#222"/><circle cx="12" cy="-58" r="4" fill="#222"/><path d="M-10,-40 q10,-8 20,0" stroke="#5a2e22" stroke-width="4" fill="none"/>`, 'translate(0,40) scale(1.1)') + `<rect x="-400" y="-400" width="800" height="800" fill="#c9b9a0" opacity=".25"/>`, '#ffe2b0') },
  // 14 Soldado
  { k: 'um soldado', z: [1.0, 1.06], f: (t, p) => memBubbleScene(t, p, `<rect x="-400" y="-400" width="800" height="800" fill="#5a6248"/><rect x="-400" y="120" width="800" height="300" fill="#4a4a38"/>` + (p > .3 && p < .45 ? `<circle cx="220" cy="-60" r="160" fill="#fff4c8" opacity=".9" filter="url(#b18)"/>` : '') + g(`<path d="M-80,-60 a80,70 0 0 1 160,0z" fill="#4a5a3a"/><rect x="-90" y="-64" width="180" height="16" rx="6" fill="#3a4a2a"/><circle cy="0" r="56" fill="${SK}"/><circle cx="-18" cy="0" r="${p > .35 ? 7 : 5}" fill="#222"/><circle cx="18" cy="0" r="${p > .35 ? 7 : 5}" fill="#222"/>${p > .35 ? '<ellipse cx="0" cy="28" rx="7" ry="9" fill="#5a2e22"/>' : '<path d="M-10,28 h20" stroke="#5a2e22" stroke-width="4"/>'}<rect x="-90" y="60" width="180" height="200" rx="40" fill="#4a5a3a"/>`, `translate(${p > .35 ? Math.sin(t * 70) * 4 : 0},60) scale(1.2)`), '#ffd9a0') },
  // 15 Mãe telefone
  { k: 'uma mãe', z: [1.0, 1.06], f: (t, p) => memBubbleScene(t, p, `<rect x="-400" y="-400" width="800" height="800" fill="#141b26"/><rect x="-330" y="80" width="660" height="320" fill="#2a3346"/>` + `<ellipse cx="60" cy="-40" rx="200" ry="200" fill="#9fd8ff" opacity=".25" filter="url(#b18)"/>` + g(`<circle cy="-40" r="50" fill="${SK}" opacity=".85"/><path d="M-60,-60 C-70,-130 70,-130 60,-60 L66,10 L-66,10Z" fill="#3a2a24"/><circle cy="-30" r="46" fill="${SK}"/><circle cx="-14" cy="-32" r="5" fill="#222"/><circle cx="16" cy="-32" r="5" fill="#222"/><path d="M-10,-6 q10,-8 20,0" stroke="#5a2e22" stroke-width="4" fill="none"/><rect x="-90" y="20" width="180" height="200" rx="40" fill="#6a7a9a"/>`, 'translate(-60,40) scale(1.3)') + g(`<rect x="-30" y="-56" width="60" height="112" rx="10" fill="#15181d"/><rect x="-24" y="-48" width="48" height="96" rx="6" fill="#9fd8ff"/>` + txt(0, 6, '04:00', 16, '#0f2a33'), 'translate(70,30) scale(1.4)'), '#bfe0ff') },
  // 16 Otávio para em cada uma
  { k: 'otávio para', z: [1.0, 1.08], c: [540, 900], f: (t, p) => archiveBG(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".25"/>` + capsule(860, 760, 1.4, '#7cf2d6', '', t) + bust({ x: 480, y: 1100, s: 1.9, ...MAN, eyes: 'closed', mouth: 'small', brows: 'up' }) + hand(800, 1000, 1.1, -40, { sleeve: '#3a3e46', watch: true }) + `<ellipse cx="480" cy="900" rx="300" ry="360" fill="#7cf2d6" opacity=".14" filter="url(#b60)"/>` + vignette() },
  // 17 Só mais uma
  { k: 'só mais uma', z: [1.0, 1.12], c: [540, 820], f: (t, p) => archiveBG(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".4"/>` + bust({ x: 540, y: 1000, s: 3.0, ...MAN, eyes: 'dot', shine: true, mouth: 'flat', brows: 'up' }) + `<path d="M480,920 q60,26 120,0" stroke="#5a2e22" stroke-width="12" fill="none" stroke-linecap="round"/>` + `<circle cx="474" cy="868" r="14" fill="#7cf2d6" opacity=".8" filter="url(#glow)"/><circle cx="606" cy="868" r="14" fill="#7cf2d6" opacity=".8" filter="url(#glow)"/>` + vignette(true) },
  // 18 Não veio destruir
  { k: 'ele não veio', z: [1.0, 1.08], f: (t, p) => { let s = archiveBG(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".45"/>`; s += `<path d="M120,300 L540,240 L960,300 L1000,1900 L80,1900Z" fill="#3a3e46"/><path d="M200,360 L540,320 L880,360 L900,1800 L180,1800Z" fill="#7a2a35"/>`; for (let i = 0; i < 6; i++) s += capsule(300 + (i % 3) * 240, 760 + Math.floor(i / 3) * 520, .9, ['#3fc7ff', '#7cf2d6', '#b48cff', '#ff8fb0', '#3fc7ff', '#e0b44c'][i], '', t + i); s += capsule(540, lerp(-300, 1280, easeOut(seg(p, .2, .6))), .9, '#3fc7ff', '', t).replace('translate(540,', `translate(${780},`); return s + vignette(true); } },
  // 19 Numeração
  { k: 'marina segue', z: [1.0, 1.0], f: (t, p) => { let s = archiveBG(t, { sharp: true }) + `<rect width="${W}" height="${H}" fill="#000" opacity=".4"/>`; const base = 48190 + Math.floor(p * 22); for (let i = -2; i <= 2; i++) { const n = base + i; s += g(`<rect x="-200" y="-60" width="400" height="120" rx="16" fill="#0f2a33" stroke="#5fd0ff" stroke-width="${i === 0 ? 6 : 3}" opacity="${1 - Math.abs(i) * .3}"/>` + txt(0, 30, `${Math.floor(n / 1000)}.${String(n % 1000).padStart(3, '0')}`, 80, i === 0 ? '#ffffff' : '#5fd0ff', { op: 1 - Math.abs(i) * .3 }), `translate(540,${780 + i * 170 - ((p * 22) % 1) * 170})`); } return s + hand(900, 1500, 1.2, -30, { sleeve: '#2f343e' }) + vignette(true); } },
  // 20 48.213
  { k: 'quarenta e oito', z: [1.0, 1.15], c: [540, 960], f: (t, p) => archiveBG(t, { sharp: true }) + `<rect width="${W}" height="${H}" fill="#000" opacity=".4"/>` + capsule(540, 700, 1.6, YEL, '48.213', t) + vignette(true) },
  // 21 Luz amarela
  { k: 'a luz lá', z: [1.0, 1.15], c: [540, 860], f: (t, p) => `<rect width="${W}" height="${H}" fill="#0e3242"/><circle cx="540" cy="860" r="${360 + 20 * Math.sin(t * 3)}" fill="${YEL}" opacity=".85" filter="url(#b60)"/><circle cx="540" cy="860" r="220" fill="#fff4b8" opacity=".7" filter="url(#b30)"/>` + g(boots(0, 0, 1.6, -6), 'translate(540,900)', 'opacity=".35"') + vignette(true) },
  // 22 Isqueiro
  { k: 'ela abre', z: [1.0, 1.1], c: [540, 1000], f: (t, p) => archiveBG(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".55"/>` + lighter(540, 1100, 2.6, t, easeOut(seg(p, 0, .35)), easeOut(seg(p, .4, .6))) + hand(560, 1560, 2, 0, { sleeve: '#2f343e', fist: true }) + vignette(true) },
  // 23 Hesita
  { k: 'e hesita', z: [1.0, 1.1], c: [540, 860], f: (t, p) => { const fl = 1 + .12 * Math.sin(t * 18); return `<rect width="${W}" height="${H}" fill="#0a0806"/><ellipse cx="760" cy="1200" rx="${500 * fl}" ry="${600 * fl}" fill="#ff9a3a" opacity=".3" filter="url(#b60)"/>` + bust({ x: 540, y: 1000, s: 2.8, ...MARINA_H, eyes: 'dot', mouth: 'sad', brows: 'sad', blink: (t % 2) < .1 }) + `<rect width="${W}" height="${H}" fill="#ff8a2a" opacity=".12" style="mix-blend-mode:overlay"/>` + vignette(true); } },
  // 24 Param de ser vendidas
  { k: 'se queimar', z: [1.0, 1.05], f: (t, p) => { let s = archiveBG(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".4"/>`; [['MEDO', 'R$ 9.000', '#9fd8ff'], ['PAIXÃO', 'R$ 25.000', '#ffc0d4'], ['LUTO', 'R$ 42.000', '#e0b44c']].forEach(([n, pr, c], i) => { const cp = seg(p, .15 + i * .2, .3 + i * .2); s += card(540, 330 + i * 290, 560, 250, txt(0, -20, n, 80, '#fff', { ls: 6 }) + txt(0, 70, pr, 56, c) + `<path d="M-260,${-10} L${-260 + 520 * cp},${-10 + 60 * cp}" stroke="#ff3a3a" stroke-width="16" stroke-linecap="round"/>`, { tilt: (i - 1) * 3, border: c }); }); return s + vignette(); } },
  // 25 Prova vira cinza
  { k: 'mas a única', z: [1.0, 1.08], c: [540, 860], f: (t, p) => { const ap = ease(seg(p, .2, .9)); let s = archiveBG(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".5"/>`; s += `<g opacity="${1 - ap}">` + bubble(540, 820, 300, `<rect x="200" y="480" width="700" height="700" fill="#7b8478"/>` + boots(540, 860, 2.2, -8), { glow: '#ffe08a' }) + `</g><g opacity="${ap}" filter="url(#gray)">` + bubble(540, 820, 300, `<rect x="200" y="480" width="700" height="700" fill="#5a5a5a"/>` + boots(540, 860, 2.2, -8).replace(/#ffc928|#ffd95a|#f2b916|#ffd24a|#d9a10f|#c99410/g, '#777'), { glow: '#888' }) + `</g>`; const r = rng(25); for (let i = 0; i < 70; i++) s += `<circle cx="${540 + (r() - .5) * 600}" cy="${820 + (r() - .5) * 600 - ap * 500 * r()}" r="${3 + r() * 6}" fill="#9a9a9a" opacity="${ap * (1 - ap * .6)}"/>`; return s + vignette(true); } },
  // 26 Não sai da cabeça
  { k: 'e tem uma', z: [1.0, 1.08], c: [600, 860], f: (t, p) => brainViz(t) + txt(600, 900, '?', 300, YEL, { w: 900, extra: 'filter="url(#glow)"', op: seg(p, .2, .5) }) + vignette() },
  // 27 1995 Seattle
  { k: 'em 1995', z: [1.0, 1.08], f: (t, p) => { let s = `<rect width="${W}" height="${H}" fill="#e8dcc0"/>` + people24(0, p, t).replace(/#8a8070/g, '#a89a80'); s = `<g opacity=".35">${s}</g>`; s += `<rect width="${W}" height="${H}" fill="#2b2620" opacity=".25"/>`; s += bust({ x: 540, y: 1250, s: 1.6, hair: 'marina', hairCol: '#7a5a3a', top: '#dfe5ea', outfit: 'labcoat', eyes: 'dot', mouth: 'flat' }); for (let i = 0; i < 4; i++) s += g(`<rect x="-80" y="-110" width="160" height="220" rx="10" fill="#f6efdc" filter="url(#shs)"/>` + `<rect x="-56" y="-70" width="112" height="12" fill="#b9aa8a"/><rect x="-56" y="-40" width="90" height="12" fill="#b9aa8a"/>`, `translate(${210 + i * 220},${1700}) rotate(${(i - 1.5) * 6})`); s += g(`<rect x="-240" y="-50" width="480" height="100" rx="14" fill="#2b2620" opacity=".85"/>` + txt(0, 22, 'SEATTLE, 1995', 56, '#f4ead2', { ls: 3 }), 'translate(540,240)'); return `<g filter="url(#sepia)">${s}</g>` + grain(Math.floor(t * 24), .16) + vignette(true); } },
  // 28 Três verdadeiras
  { k: 'três eram', z: [1.0, 1.06], f: (t, p) => { let s = `<rect width="${W}" height="${H}" fill="#3a3128"/>`; for (let i = 0; i < 4; i++) { const ok = i < 3 && p > .2 + i * .15; s += g(`<rect x="-120" y="-170" width="240" height="340" rx="14" fill="#f6efdc" filter="url(#sh)"/>` + [...Array(5)].map((_, k) => `<rect x="-90" y="${-120 + k * 44}" width="${180 - (k * 30) % 70}" height="14" fill="#b9aa8a"/>`).join('') + (ok ? `<circle cx="70" cy="110" r="46" fill="#3aa860"/><path d="M48,110 l16,18 l32,-36" stroke="#fff" stroke-width="10" fill="none"/>` : ''), `translate(${300 + (i % 2) * 480},${620 + Math.floor(i / 2) * 520}) rotate(${(i % 2 ? 4 : -4)})`); } return `<g filter="url(#sepia)" opacity=".4">${s}</g>` + s + grain(Math.floor(t * 24), .12) + vignette(true); } },
  // 29 Inventada: shopping
  { k: 'uma era inventada', z: [1.0, 1.08], f: (t, p) => { let s = `<g filter="url(#sepia)">${mall(t, 0)}</g>`; s += g(`<rect x="-120" y="-170" width="240" height="340" rx="14" fill="#f6efdc" filter="url(#sh)"/><path d="M-60,-60 L60,60 M60,-60 L-60,60" stroke="#d22" stroke-width="20" stroke-linecap="round"/>`, 'translate(840,330) rotate(8)', `opacity="${seg(p, .2, .35)}"`); return s + grain(Math.floor(t * 24), .14) + vignette(true); } },
  // 30 1 em cada 4
  { k: 'cerca de uma', z: [1.0, 1.05], f: (t, p) => `<rect width="${W}" height="${H}" fill="#2b2620"/>` + people24(Math.floor(seg(p, .1, .7) * 6.99), p, t) + grain(Math.floor(t * 24), .1) + vignette() },
  // 31 Detalhes
  { k: 'algumas com', z: [1.0, 1.1], c: [540, 1100], f: (t, p) => `<g filter="url(#sepia)">${mall(t, seg(p, .05, .95))}</g>` + grain(Math.floor(t * 24), .14) + vignette(true) },
  // 32 Plantar com uma conversa
  { k: 'se dá pra', z: [1.0, 1.06], f: (t, p) => { let s = `<rect width="${W}" height="${H}" fill="#d9e2e6"/>`; s += bust({ x: 260, y: 1250, s: 1.3, hair: 'short', top: '#5a6a7a', outfit: 'shirt', eyes: 'dot', mouth: 'open', look: 10 }); s += bust({ x: 820, y: 1250, s: 1.3, hair: 'kid', top: '#c94a3a', outfit: 'hoodie', eyes: 'dot', mouth: 'flat', look: -10 }); s += g(`<rect x="-150" y="-80" width="300" height="160" rx="70" fill="#fff" filter="url(#shs)"/><path d="M-60,70 l-40,60 l70,-50z" fill="#fff"/>` + txt(0, 20, '...', 80, '#5a6a7a'), 'translate(400,640)'); const sp = easeOut(seg(p, .3, .9)); s += g(`<circle r="16" fill="#8a5a3a"/><path d="M0,0 C-30,${-60 * sp} -60,${-80 * sp} -80,${-90 * sp}" stroke="#4aa860" stroke-width="10" fill="none"/><path d="M0,0 C30,${-60 * sp} 60,${-70 * sp} 70,${-90 * sp}" stroke="#4aa860" stroke-width="10" fill="none"/>`, `translate(820,${lerp(700, 1060, easeOut(seg(p, 0, .3)))}) scale(${.6 + sp})`); return s + vignette(); } },
  // 33 Cadeira vermelha
  { k: 'o que a lethe', z: [1.0, 1.12], c: [540, 1000], f: (t, p) => clinicBG(t) + chair(540, 1350, 1.25, 0) + `<rect width="${W}" height="${H}" fill="#7a0a0a" opacity=".5" style="mix-blend-mode:multiply"/>` + vignette(true) },
  // 34 Etiqueta
  { k: 'marina olha', z: [1.0, 1.1], c: [540, 1100], f: (t, p) => archiveBG(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".5"/>` + capsule(540, 540, 2.0, YEL, '', t) + g(`<rect x="-360" y="-110" width="720" height="220" rx="20" fill="#0f2a33" stroke="${YEL}" stroke-width="6"/>` + txt(0, 40, '48.213', 120, YEL), 'translate(540,1000)') + vignette(true) },
  // 35 Linha escondida
  { k: 'embaixo do número', z: [1.0, 1.2], c: [540, 1000], f: (t, p) => archiveBG(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".6"/>` + g(`<rect x="-400" y="-260" width="800" height="520" rx="24" fill="#0f2a33" stroke="${YEL}" stroke-width="6"/>` + txt(0, -60, '48.213', 140, YEL) + `<rect x="-300" y="60" width="600" height="40" rx="8" fill="#ffe08a" opacity="${seg(p, .3, .8) * .25}"/>` + txt(0, 92, 'CÓPIA 213/213 · ORIGINAL: DOADOR ZERO', 28, '#9fb6c4', { op: seg(p, .3, .8) * .7, fam: 'NU' }), 'translate(540,820)') + vignette(true) },
  // 36 Cópia 213 de 213
  { k: 'cópia duzentos', z: [1.0, 1.08], f: (t, p) => archiveBG(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".6"/>` + g(`<rect x="-440" y="-340" width="880" height="680" rx="24" fill="#0f2a33" stroke="${YEL}" stroke-width="6"/>` + txt(0, -150, '48.213', 120, YEL) + txt(0, 10, 'CÓPIA 213 DE 213', 76, '#ffffff', { op: seg(p, .1, .3) }) + txt(0, 150, 'ORIGINAL:', 56, '#9fb6c4', { op: seg(p, .45, .6) }) + txt(0, 250, 'DOADOR ZERO', 96, '#ff5d5d', { op: seg(p, .6, .75), extra: 'filter="url(#glow)"' }), 'translate(540,820)') + vignette(true) },
  // 37 São cópias
  { k: 'as cápsulas são', z: [1.0, 1.0], f: (t, p) => { let s = archiveBG(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".45"/>`; const n = 1 + Math.floor(easeOut(p) * 12); for (let i = n - 1; i >= 0; i--) s += capsule(540 + (i % 2 ? 1 : -1) * Math.ceil(i / 2) * 140 * easeOut(p), 860, 1.3 - i * .03, YEL, '48.213', t).replace('<rect x="-80" y="-130"', `<rect opacity="${1 - i * .05}" x="-80" y="-130"`); return s + vignette(true); } },
  // 38 Queimar não apaga
  { k: 'queimar o arquivo', z: [1.0, 1.06], f: (t, p) => { const bp = seg(p, 0, .5), rp = seg(p, .55, .8); let s = archiveBG(t) + `<rect width="${W}" height="${H}" fill="#000" opacity=".4"/>`; s += `<g opacity="${1 - bp}">${capsule(540, 860, 1.6, YEL, '48.213', t)}</g>`; if (p < .6) s += fire(540, 1100, 1.6 * Math.min(1, bp * 3) * (1 - seg(p, .45, .6)), t); s += `<g opacity="${rp}">${capsule(540, 860, 1.6, YEL, '48.213', t)}</g>`; return s + vignette(true); } },
  // 39 Pessoa viva
  { k: 'os originais', z: [1.0, 1.1], c: [540, 900], f: (t, p) => { let s = `<rect width="${W}" height="${H}" fill="#03090c"/>`; s += g(`<circle cx="0" cy="-520" r="150" fill="#5fd0ff" opacity=".18"/><path d="M-260,700 C-260,100 -200,-280 0,-300 C200,-280 260,100 260,700Z" fill="#5fd0ff" opacity=".12"/><circle cx="0" cy="-520" r="150" fill="none" stroke="#9fe3ff" stroke-width="6"/><path d="M-260,700 C-260,100 -200,-280 0,-300 C200,-280 260,100 260,700" fill="none" stroke="#9fe3ff" stroke-width="6"/>`, 'translate(540,1100)', 'filter="url(#glow)"'); const r = rng(39); const n = Math.floor(easeOut(p) * 60); for (let i = 0; i < n; i++) { const a = r() * 6.28, rr = Math.sqrt(r()); const inHead = r() < .3; const x = inHead ? 540 + Math.cos(a) * rr * 120 : 540 + (r() - .5) * 420; const y = inHead ? 580 + Math.sin(a) * rr * 120 : 900 + r() * 800; s += `<circle cx="${x}" cy="${y}" r="${8 + r() * 14}" fill="${['#ffc928', '#3fc7ff', '#ff8fb0', '#7cf2d6'][i % 4]}" opacity=".9" filter="url(#glow)"/>`; } s += g(`<rect x="-250" y="-56" width="500" height="112" rx="18" fill="#05090c" opacity=".85" stroke="#ff5d5d" stroke-width="4"/>` + txt(0, 26, 'DOADOR ZERO', 70, '#ff5d5d', { ls: 6 }), 'translate(540,240)', `opacity="${seg(p, .3, .5)}"`); return s + vignette(true); } },
  // 40 Fogo pega
  { k: 'o fogo pega', z: [1.0, 1.08], f: (t, p) => { let s = archiveBG(t) + `<rect width="${W}" height="${H}" fill="#2a0a00" opacity=".45"/>`; for (let i = 0; i < 5; i++) s += fire(100 + i * 220, 1900 - (i % 2) * 300, (1.6 + (i % 3) * .5) * easeOut(seg(p, i * .08, .5 + i * .08)), t, i + 3); s += `<rect width="${W}" height="${H}" fill="#ff6a1a" opacity="${.15 * p}" style="mix-blend-mode:overlay"/>`; return s + vignette(); } },
  // 41 Otávio grita
  { k: 'otávio grita', z: [1.0, 1.12], c: [540, 860], f: (t, p) => `<rect width="${W}" height="${H}" fill="#1a0800"/>` + fire(200, 1900, 3.5, t, 41) + fire(900, 1900, 3.2, t, 42) + g(bust({ x: 0, y: 0, s: 2.6, ...MAN, eyes: 'wide', mouth: 'open', brows: 'up' }), `translate(${540 + Math.sin(t * 60) * 5},1000)`) + `<rect width="${W}" height="${H}" fill="#ff6a1a" opacity=".18" style="mix-blend-mode:overlay"/>` + vignette(true) },
  // 42 Alarme
  { k: 'o alarme dispara', z: [1.0, 1.05], f: (t, p) => archiveBG(t) + `<rect width="${W}" height="${H}" fill="#3a0000" opacity="${.35 + .25 * (Math.sin(t * 14) > 0)}"/>` + alarmLight(540, 420, 1.6, t) + vignette(true) },
  // 43 Voz calma no alto-falante
  { k: 'e uma voz', z: [1.0, 1.1], c: [540, 860], f: (t, p) => { let s = `<rect width="${W}" height="${H}" fill="#140404"/><rect width="${W}" height="${H}" fill="#ff2a2a" opacity="${.08 + .08 * (Math.sin(t * 14) > 0)}"/>`; s += g(`<rect x="-200" y="-200" width="400" height="400" rx="40" fill="#2a2f35"/><circle r="140" fill="#14171a"/>` + [...Array(5)].map((_, i) => `<circle r="${30 + i * 24}" fill="none" stroke="#3a4048" stroke-width="6"/>`).join(''), 'translate(540,860)'); for (let i = 0; i < 4; i++) { const rr = ((t * .8 + i / 4) % 1); s += `<path d="M${540 + 220 + rr * 300},${860 - 200 - rr * 100} a${300 + rr * 300},${300 + rr * 300} 0 0 1 0,${400 + rr * 200}" stroke="#ff8a8a" stroke-width="6" fill="none" opacity="${1 - rr}"/>`; s += `<path d="M${540 - 220 - rr * 300},${860 - 200 - rr * 100} a${300 + rr * 300},${300 + rr * 300} 0 0 0 0,${400 + rr * 200}" stroke="#ff8a8a" stroke-width="6" fill="none" opacity="${1 - rr}"/>`; } return s + vignette(true); } },
  // 44 Quarta invasão
  { k: 'marina alves', z: [1.0, 1.06], f: (t, p) => { let s = `<rect width="${W}" height="${H}" fill="#0a0303"/>` + screensWall(t, seg(p, .3, 1)); s += bust({ x: 540, y: 1560, s: 1.9, ...MARINA_H, eyes: 'wide', mouth: 'small', brows: 'up' }); s += `<rect width="${W}" height="${H}" fill="#ff2a2a" opacity="${.1 + .1 * (Math.sin(t * 14) > 0)}"/>`; return s + vignette(true); } },
  // 45 Opção A
  { k: 'comenta a', z: [1, 1], f: (t, p) => split2(t, p, 0) },
  // 46 Opção B
  { k: 'ou b se', z: [1, 1], f: (t, p) => split2(t, p, 1) },
];

function sideA(t) {
  let A = `<rect width="${W}" height="${H}" fill="#1c2226"/>`;
  A += `<path d="M0,500 L${W},500 L${W},1500 L0,1500Z" fill="#3a444b"/><path d="M0,500 L${W},500 L760,800 L320,800Z" fill="#4a565e"/><path d="M0,1500 L${W},1500 L760,1200 L320,1200Z" fill="#2a3237"/><rect x="320" y="800" width="440" height="400" fill="#11161a"/>`;
  for (let i = 0; i < 6; i++) A += `<path d="M${320 - i * 50},${800 - i * 50} V${1200 + i * 50}" stroke="#2a3237" stroke-width="6"/>`;
  A += g(`<ellipse cx="0" cy="40" rx="160" ry="40" fill="#000" opacity=".3"/><rect x="-140" y="-30" width="280" height="90" rx="40" fill="#2f343e"/>` + g(headG({ ...MARINA_H, eyes: 'dot', mouth: 'flat', brows: 'serious' }), 'translate(-150,-20) scale(.9)') + capsule(150, -10, .45, YEL, '', t), `translate(540,${1180 + Math.sin(t * 4) * 6}) scale(1.3)`);
  A += `<ellipse cx="740" cy="1170" rx="140" ry="120" fill="${YEL}" opacity=".25" filter="url(#b30)"/>`;
  A += txt(540, 760, 'A', 380, '#ffffff', { w: 900, extra: 'stroke="#000" stroke-width="16" paint-order="stroke"' });
  return A;
}
function sideB(t) {
  let B = `<rect width="${W}" height="${H}" fill="#0a0303"/>` + screensWall(t, 1);
  B += chair(540, 1900, 1.1, 0, .6, bust({ x: 0, y: -170, s: .95, ...MARINA, eyes: 'dot', mouth: 'flat', brows: 'sad' }));
  B += txt(540, 760, 'B', 380, YEL, { w: 900, extra: 'stroke="#000" stroke-width="16" paint-order="stroke"' });
  return B;
}
function split2(t, p, mode) {
  if (mode === 0) return sideA(t) + vignette(true);
  const sp = easeOut(seg(p, 0, .25)), half = W / 2;
  let s = `<defs><clipPath id="cA"><rect x="0" y="0" width="${lerp(W, half, sp)}" height="${H}"/></clipPath><clipPath id="cB"><rect x="${lerp(W, half, sp)}" y="0" width="${W}" height="${H}"/></clipPath></defs>`;
  s += `<g clip-path="url(#cA)">${g(sideA(t), `translate(${lerp(0, -270, sp)},0)`)}</g>`;
  s += `<g clip-path="url(#cB)">${g(sideB(t), `translate(${lerp(540, 270, sp)},0)`)}</g>`;
  s += `<rect x="${lerp(W, half, sp) - 5}" y="0" width="10" height="${H}" fill="#fff"/>`;
  return s + vignette();
}
function blackCard(x, y, s, rot, side = 'front') {
  let c = `<rect x="-200" y="-125" width="400" height="250" rx="22" fill="#121418" stroke="#2d3440" stroke-width="3"/>`;
  if (side === 'front') c += logo(-130, -40, .7) + txt(40, -30, 'LETHE', 52, '#e9f6ff', { ls: 6 }) + `<rect x="-160" y="40" width="70" height="50" rx="8" fill="#d2b05a"/>` + txt(110, 80, '•••• 0213', 26, '#8a96a6', { fam: 'NU' });
  if (side === 'addr') c += logo(-140, -60, .55) + txt(30, -50, 'DEVOLUÇÃO DE MEMÓRIAS', 26, '#5fd0ff') + txt(0, 15, 'RUA DO ESQUECIMENTO, 48', 22, '#e9f6ff', { fam: 'NU' }) + txt(0, 60, 'ATENDIMENTO 24H', 22, '#8a96a6', { fam: 'NU' });
  if (side === 'qr') { const r = rng(48213); c += `<rect x="-90" y="-100" width="180" height="180" rx="8" fill="#e9f6ff"/>`; for (let i = 0; i < 12; i++) for (let j = 0; j < 12; j++) if (r() < .5 || (i < 3 && j < 3) || (i > 8 && j < 3) || (i < 3 && j > 8)) c += `<rect x="${-84 + i * 14}" y="${-94 + j * 14}" width="14" height="14" fill="#121418"/>`; c += txt(0, 108, 'ACESSO: ARQUIVO', 22, '#5fd0ff', { ls: 2 }); }
  return g(c, `translate(${x},${y}) rotate(${rot}) scale(${s})`, `filter="url(#sh)"`);
}
