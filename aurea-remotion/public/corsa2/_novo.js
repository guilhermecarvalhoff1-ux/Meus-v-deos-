
// =====================================================================
// O CORSA DO AVÔ — EP2 · estilo novo: personagens articulados de corpo inteiro,
// cenários escuros com textura e uma luz principal
// =====================================================================
const BASE2 = (typeof document !== 'undefined' && document.currentScript && document.currentScript.src) ? document.currentScript.src.replace(/scenes\.js.*$/, '') : '';
function texFill(name, x, y, w, h, op, blend = 'multiply', size = 512, dx = 0, dy = 0) {
  const id = uid('tx');
  return `<defs><pattern id="${id}" patternUnits="userSpaceOnUse" width="${size}" height="${size}" x="${dx}" y="${dy}"><image href="${BASE2}${name}" width="${size}" height="${size}" preserveAspectRatio="none"/></pattern></defs><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id})" opacity="${op}" style="mix-blend-mode:${blend}"/>`;
}
function filmGrain(t, op = .18) { const k = Math.floor(t * 24); return texFill('tex_grao.png', 0, 0, W, H, op, 'overlay', 384, (k * 137) % 384, (k * 211) % 384); }
const rad = d => d * Math.PI / 180;
const dirv = (a, L) => [Math.sin(rad(a)) * L, Math.cos(rad(a)) * L];

// ---------- elenco ----------
const CH = {
  lucas: { skin: '#e2a574', skinD: '#b9784a', hair: '#2a1d17', hairStyle: 'short', top: '#2f4f86', topD: '#213a64', pants: '#2b2e38', pantsD: '#1c1e26', shoe: '#ececec', shoeD: '#9c9c9c', hoodie: 1 },
  jorge: { skin: '#c98b5d', skinD: '#9c6640', hair: '#a8a8a8', hairStyle: 'bald', beard: '#bdbdbd', cap: '#c0392b', top: '#35557f', topD: '#26405f', pants: '#35557f', pantsD: '#26405f', shoe: '#3a2a1e', shoeD: '#24180f', belly: 1, overall: 1 },
};
// ---------- cabeça de perfil (olhando para a direita), centro em 0,0 ----------
function headSide(c, f = {}) {
  let s = '';
  if (c.hairStyle === 'short') s += `<path d="M-62,-4 C-70,-72 -6,-92 34,-74 C54,-64 62,-48 60,-34 C42,-44 12,-48 -8,-38 C-26,-26 -40,-8 -48,18 Z" fill="${c.hair}"/>`;
  s += `<ellipse cx="0" cy="0" rx="58" ry="66" fill="${c.skin}"/><ellipse cx="22" cy="34" rx="42" ry="32" fill="${c.skin}"/>`;
  s += `<path d="M50,-8 Q76,8 54,18 Z" fill="${c.skin}"/><path d="M52,10 Q64,12 56,18" stroke="${c.skinD}" stroke-width="3" fill="none"/>`;
  s += `<ellipse cx="-14" cy="6" rx="12" ry="17" fill="${c.skinD}"/><path d="M-18,0 q6,6 0,12" stroke="#7a4a2a" stroke-width="3" fill="none" opacity=".6"/>`;
  s += `<path d="M-40,-30 C-48,0 -40,40 -20,60" stroke="${c.skinD}" stroke-width="10" fill="none" opacity=".25"/>`;
  if (c.hairStyle === 'short') s += `<path d="M-56,-30 C-50,-70 0,-86 34,-74 C46,-68 54,-58 56,-46 C36,-54 4,-56 -16,-46 C-34,-36 -46,-22 -52,-6 Z" fill="${c.hair}"/><path d="M-30,-70 C0,-82 30,-78 44,-66" stroke="#4a3a30" stroke-width="5" fill="none" opacity=".6"/>`;
  if (c.hairStyle === 'bald') s += `<path d="M-58,-14 C-64,18 -52,42 -34,50 L-30,32 C-42,20 -46,2 -42,-16 Z" fill="${c.hair}"/>`;
  if (c.beard) s += `<path d="M-8,18 C-4,70 46,82 70,34 C66,58 36,74 12,62 C0,56 -8,40 -8,18 Z" fill="${c.beard}"/><path d="M30,24 C40,18 56,18 66,26 C58,32 40,32 30,28Z" fill="${c.beard}"/>`;
  // olho
  const blink = f.blink, lk = f.look || 0;
  if (blink || f.eyes === 'closed') s += `<path d="M24,-8 q10,${f.eyes === 'closed' && f.happy ? -8 : 4} 20,0" stroke="#2a1d17" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  else { const big = f.eyes === 'wide' ? 1.3 : 1; s += `<ellipse cx="34" cy="-8" rx="${9 * big}" ry="${11 * big}" fill="#fff"/><circle cx="${37 + lk}" cy="-7" r="${5.5 * big}" fill="#1e1612"/><circle cx="${38.5 + lk}" cy="-9" r="1.8" fill="#fff"/>`; }
  const br = { neutral: 0, up: -8, angry: 14, sad: -14, serious: 8 }[f.brows || 'neutral'] || 0;
  s += `<rect x="20" y="-30" width="30" height="8" rx="4" fill="${c.hairStyle === 'bald' ? '#8a8a8a' : c.hair}" transform="rotate(${br},35,-26)"/>`;
  const m = f.mouth || 'flat';
  if (c.beard) { if (m === 'open' || m === 'o') s += `<ellipse cx="48" cy="40" rx="8" ry="${m === 'open' ? 10 : 7}" fill="#3a1a10"/>`; }
  else if (m === 'flat') s += `<path d="M38,38 h16" stroke="#5a2e22" stroke-width="5" stroke-linecap="round"/>`;
  else if (m === 'smile') s += `<path d="M34,34 q12,12 22,0" stroke="#5a2e22" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  else if (m === 'open') s += `<path d="M34,32 q12,22 24,0 z" fill="#4a1a10"/>`;
  else if (m === 'o') s += `<ellipse cx="48" cy="38" rx="7" ry="9" fill="#4a1a10"/>`;
  else if (m === 'bite') s += `<path d="M36,34 h18 v8 h-18z" fill="#fff"/><path d="M36,34 h18" stroke="#5a2e22" stroke-width="4"/>`;
  if (c.cap) s += `<path d="M-60,-24 C-62,-94 52,-100 56,-30 Z" fill="${c.cap}"/><path d="M-60,-24 C-30,-40 30,-42 56,-30" stroke="#000" stroke-width="5" opacity=".2" fill="none"/><path d="M30,-38 L104,-30 L100,-18 L30,-24 Z" fill="${c.cap}"/><path d="M30,-24 L100,-18" stroke="#000" stroke-width="4" opacity=".25"/>`;
  return s;
}
// ---------- corpo articulado (perfil, frente para a direita; pés no chão em y=0) ----------
// pose: hipN/kneeN (perna da frente), hipF/kneeF (perna de trás), shN/elN, shF/elF (braços), lean, drop, tilt
function rig(c, o) {
  const P0 = o.pose || {}, p = { hipN: 0, kneeN: 0, hipF: 0, kneeF: 0, shN: 8, elN: 10, shF: -6, elF: 10, lean: 0, drop: 0, tilt: 0, ...P0 };
  const pel = [0, -300 + p.drop];
  const tor = (dx, dy) => { const a = rad(p.lean); return [pel[0] + dx * Math.cos(a) - dy * Math.sin(a), pel[1] + dx * Math.sin(a) + dy * Math.cos(a)]; };
  const sh = tor(0, -225), neck = tor(0, -255);
  const hd = [neck[0] + Math.sin(rad(p.lean + p.tilt)) * 88, neck[1] - Math.cos(rad(p.lean + p.tilt)) * 88];
  const leg = (h, k) => { const kn = [pel[0] + dirv(h, 150)[0], pel[1] + dirv(h, 150)[1]]; const b = h - k; const an = [kn[0] + dirv(b, 150)[0], kn[1] + dirv(b, 150)[1]]; return { kn, an, b }; };
  const arm = (u, e) => { const el = [sh[0] + dirv(u, 125)[0], sh[1] + dirv(u, 125)[1]]; const fa = u + e; const wr = [el[0] + dirv(fa, 115)[0], el[1] + dirv(fa, 115)[1]]; return { el, wr }; };
  const L = (pts, w, col) => `<path d="M${pts.map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' L')}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const shoe = (an, b, col, colD) => g(`<path d="M-20,-16 L34,-16 C58,-16 64,4 58,14 L-22,14 Z" fill="${col}"/><path d="M-22,6 L58,6 L58,14 L-22,14Z" fill="${colD}"/>`, `translate(${an[0]},${an[1]}) rotate(${-(b) * .25})`);
  const lF = leg(p.hipF, p.kneeF), lN = leg(p.hipN, p.kneeN), aF = arm(p.shF, p.elF), aN = arm(p.shN, p.elN);
  let s = `<ellipse cx="${pel[0] * .3}" cy="6" rx="${120}" ry="16" fill="#000" opacity=".35" filter="url(#b5)"/>`;
  // braço e perna de trás (mais escuros)
  s += L([sh, aF.el, aF.wr], 40, c.topD) + `<circle cx="${aF.wr[0]}" cy="${aF.wr[1]}" r="21" fill="${c.skinD}"/>`;
  if (o.itemF) s += g(o.itemF, `translate(${aF.wr[0]},${aF.wr[1]})`);
  s += L([pel, lF.kn, lF.an], 54, c.pantsD) + shoe(lF.an, lF.b, c.shoeD, c.shoeD);
  // tronco
  const body = c.belly ? 'M-52,10 C-62,-80 -60,-180 -46,-238 C-28,-262 34,-262 50,-238 C78,-180 92,-90 66,10 Z' : 'M-52,10 C-60,-80 -58,-180 -46,-238 C-28,-262 32,-262 48,-238 C60,-180 62,-80 54,10 Z';
  let tb = `<path d="${body}" fill="${c.top}"/><path d="M10,-250 C40,-240 56,-180 ${c.belly ? 70 : 56},-60 L${c.belly ? 60 : 50},10 L30,10 C40,-80 34,-190 10,-250Z" fill="#fff" opacity=".07"/><path d="M-52,10 C-60,-80 -58,-180 -46,-238 L-30,-240 C-40,-170 -40,-60 -32,10Z" fill="#000" opacity=".18"/>`;
  if (c.hoodie) tb += `<path d="M-50,-236 C-70,-250 -66,-200 -50,-196 Z" fill="${c.topD}"/><path d="M-6,-120 h44 v40 h-44z" fill="#000" opacity=".12"/><path d="M-52,-6 h106 v18 h-106z" fill="${c.topD}"/>`;
  if (c.overall) tb += `<path d="M-20,-236 L-14,-150 M30,-236 L36,-150" stroke="${c.topD}" stroke-width="10"/><rect x="0" y="-150" width="46" height="40" rx="6" fill="${c.topD}"/><circle cx="-14" cy="-150" r="5" fill="#d8d8d8"/><circle cx="36" cy="-150" r="5" fill="#d8d8d8"/><path d="M-30,-60 C0,-50 40,-50 70,-62" stroke="#000" stroke-width="6" opacity=".15" fill="none"/>`;
  s += g(tb, `translate(${pel[0]},${pel[1]}) rotate(${p.lean})`);
  // perna da frente
  s += L([pel, lN.kn, lN.an], 56, c.pants) + `<path d="M${pel[0] + 10},${pel[1]} L${lN.kn[0] + 10},${lN.kn[1]}" stroke="#fff" stroke-width="8" opacity=".08" stroke-linecap="round"/>` + shoe(lN.an, lN.b, c.shoe, c.shoeD);
  // pescoço e cabeça
  s += L([sh, hd], 34, c.skinD);
  s += g(headSide(c, o.face || {}), `translate(${hd[0]},${hd[1]}) rotate(${p.lean + p.tilt})`);
  // braço da frente
  s += L([sh, aN.el, aN.wr], 42, c.top) + `<path d="M${sh[0] + 8},${sh[1]} L${aN.el[0] + 8},${aN.el[1]}" stroke="#fff" stroke-width="7" opacity=".08" stroke-linecap="round"/>`;
  if (o.itemN) s += g(o.itemN, `translate(${aN.wr[0]},${aN.wr[1]}) rotate(${o.itemRot || 0})`);
  s += `<circle cx="${aN.wr[0]}" cy="${aN.wr[1]}" r="22" fill="${c.skin}"/>`;
  return g(s, `translate(${o.x},${o.y}) scale(${o.flip ? -o.s : o.s},${o.s})`);
}
// poses
const POSE = {
  stand: (t) => ({ shN: 6 + Math.sin(t * 1.8) * 2, shF: -4, elN: 12, elF: 12, lean: Math.sin(t * 1.6) * 1.2 }),
  walk: (t, sp = 1) => { const ph = t * 5.2 * sp; return { hipN: 24 * Math.sin(ph), kneeN: 34 * Math.max(0, Math.sin(ph + 1.6)), hipF: -24 * Math.sin(ph), kneeF: 34 * Math.max(0, Math.sin(ph + 1.6 + Math.PI)), shN: -22 * Math.sin(ph), elN: 18, shF: 22 * Math.sin(ph), elF: 18, lean: 4, drop: -Math.abs(Math.cos(ph)) * 8 + 8 }; },
  kneel: (t) => ({ hipN: 82, kneeN: 88, hipF: -8, kneeF: 96, drop: 150, lean: 16, shN: 40, elN: 40, shF: 30, elF: 50 }),
  crossed: (t) => ({ shN: 30, elN: 110, shF: 26, elF: 120, lean: -2 + Math.sin(t * 1.6) }),
  point: (t) => ({ shN: 95, elN: 5, shF: -4, elF: 12, lean: 2 }),
  bite: (t) => ({ shN: 20, elN: 150 + Math.sin(t * 14) * 6, shF: -4, elF: 14, lean: 4, tilt: 4 }),
};
// ---------- oficina à noite (fundo com textura + luz da lâmpada) ----------
function oficina(t, o = {}) {
  const lx = o.lampX ?? 540, id = uid('of');
  let s = `<defs>${linGrad(id + 'w', [[0, '#2a2e38'], [1, '#1a1c24']])}${linGrad(id + 'f', [[0, '#34353c'], [1, '#121216']])}${radGrad(id + 'c', [[0, '#ffd89a', .55], [.5, '#ffb860', .16], [1, '#000', 0]])}${linGrad(id + 'b', [[0, '#ffe2b0', .5], [1, '#ffe2b0', 0]])}</defs>`;
  s += `<rect width="${W}" height="${H}" fill="url(#${id}w)"/>` + texFill('tex_concreto.png', 0, 0, W, 1200, .55);
  // janela com noite azul
  s += `<rect x="740" y="300" width="250" height="300" fill="#16284a"/><path d="M865,300 V600 M740,450 H990" stroke="#0e1018" stroke-width="12"/><circle cx="800" cy="360" r="22" fill="#cfe0ff" opacity=".6" filter="url(#glow)"/><rect x="740" y="300" width="250" height="300" fill="none" stroke="#0e1018" stroke-width="16"/>`;
  // painel de ferramentas
  s += `<g filter="url(#b2)"><rect x="70" y="330" width="520" height="380" fill="#3a3326"/>` + texFill('tex_madeira.png', 70, 330, 520, 380, .5, 'multiply', 300);
  for (let i = 0; i < 9; i++) for (let j = 0; j < 6; j++) s += `<circle cx="${95 + i * 58}" cy="${355 + j * 60}" r="5" fill="#1c1a14"/>`;
  s += `<path d="M120,380 L140,560 M110,380 h22 M110,560 h60" stroke="#9aa1a8" stroke-width="16" stroke-linecap="round"/><path d="M230,370 V530 M210,370 h40" stroke="#9aa1a8" stroke-width="14" stroke-linecap="round"/><path d="M330,390 C310,450 350,500 330,600" stroke="#c9483a" stroke-width="20" fill="none" stroke-linecap="round"/><rect x="420" y="380" width="120" height="40" rx="8" fill="#c9a24a"/><path d="M430,470 h100 M440,500 h80" stroke="#7a8088" stroke-width="12" stroke-linecap="round"/></g>`;
  // prateleira com latas e pneus
  s += `<g filter="url(#b5)"><rect x="40" y="760" width="560" height="14" fill="#4a3a2a"/><rect x="70" y="690" width="60" height="70" rx="6" fill="#a83a2a"/><rect x="150" y="700" width="50" height="60" rx="6" fill="#3a6a8a"/><rect x="220" y="680" width="70" height="80" rx="8" fill="#c9a24a"/>`;
  for (let k = 0; k < 3; k++) s += `<ellipse cx="900" cy="${1040 - k * 70}" rx="120" ry="40" fill="#141416" stroke="#26272c" stroke-width="20"/>`;
  s += `</g>`;
  // bancada de madeira
  s += `<rect x="20" y="900" width="640" height="40" fill="#5a4030"/>` + texFill('tex_madeira.png', 20, 900, 640, 40, .7, 'multiply', 200) + `<rect x="40" y="940" width="30" height="220" fill="#2a2420"/><rect x="610" y="940" width="30" height="220" fill="#2a2420"/>`;
  // chão
  s += `<rect y="1150" width="${W}" height="${H - 1150}" fill="url(#${id}f)"/>` + texFill('tex_concreto.png', 0, 1150, W, H - 1150, .6, 'multiply', 700) + texFill('tex_sujeira.png', 0, 1150, W, H - 1150, .7, 'normal', 900);
  s += `<rect y="1146" width="${W}" height="8" fill="#000" opacity=".5"/><ellipse cx="300" cy="1560" rx="160" ry="30" fill="#000" opacity=".35"/><ellipse cx="780" cy="1720" rx="110" ry="22" fill="#000" opacity=".3"/>`;
  // lâmpada pendurada + cone de luz
  const sw = Math.sin(t * 1.1) * 6;
  s += `<path d="M${lx},0 L${lx + sw},190" stroke="#0a0c10" stroke-width="5"/><path d="M${lx + sw - 70},230 L${lx + sw + 70},230 L${lx + sw + 40},190 L${lx + sw - 40},190Z" fill="#2a3a2e"/><ellipse cx="${lx + sw}" cy="234" rx="30" ry="12" fill="#fff4c8" filter="url(#glow2)"/>`;
  s += `<g style="mix-blend-mode:screen"><path d="M${lx + sw - 60},236 L${lx - 520},${H} L${lx + 520},${H} L${lx + sw + 60},236Z" fill="url(#${id}b)" opacity=".35" filter="url(#b18)"/></g>`;
  s += `<ellipse cx="${lx}" cy="1450" rx="620" ry="360" fill="url(#${id}c)"/>`;
  s += dust(91, 70, lx - 420, 260, 840, 1500, t);
  return s;
}
// grading final: azul escuro, luz quente, vinheta forte e grão
function grade(t, o = {}) {
  return `<rect width="${W}" height="${H}" fill="#1a2650" opacity="${o.blue ?? .28}" style="mix-blend-mode:multiply"/>` + vignette(true) + filmGrain(t, .14);
}
