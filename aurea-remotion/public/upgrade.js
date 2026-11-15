// Upgrade visual: sombreamento suave, proporção mais realista, grama com degradê e pós-processamento.
// Carregado depois de epN/scenes.js e antes de engine.js. Substitui funções globais sem mexer nas cenas.
(function () {
  const SHADE_DEFS = `
<linearGradient id="litX" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="#fff6e0" stop-opacity=".22"/><stop offset=".38" stop-color="#fff6e0" stop-opacity="0"/>
  <stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".42"/></linearGradient>
<linearGradient id="litY" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset=".7" stop-color="#000" stop-opacity=".05"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient>
<radialGradient id="aoNeck" cx=".5" cy=".2" r=".6"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<linearGradient id="rimL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff2c8" stop-opacity=".55"/><stop offset=".12" stop-color="#fff2c8" stop-opacity="0"/></linearGradient>
<filter id="soft6" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="soft14" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="14"/></filter>`;
  window.SHADE_DEFS = SHADE_DEFS;
  // aplica degradê de luz (esquerda clara, direita escura) + escurecimento embaixo sobre um path
  const shade = (d, extra = '') => `<path d="${d}" fill="url(#litX)" ${extra}/><path d="${d}" fill="url(#litY)" ${extra}/><path d="${d}" fill="url(#rimL)" ${extra}/>`;
  window.shadePath = shade;

  // ---------- cabeça: AO sob o capuz/cabelo e sombra suave no rosto ----------
  const headG0 = headG;
  headG = function (o) {
    let s = `<defs>${SHADE_DEFS}</defs>` + headG0(o);
    const face = 'M-62,-40 C-62,-88 62,-88 62,-40 L60,26 C56,66 32,82 0,82 C-32,82 -56,66 -60,26Z';
    // sombra macia do capuz/cabelo projetada na testa
    s += `<path d="M-60,-62 C-30,-40 30,-40 60,-62 L60,-30 C30,-14 -30,-14 -60,-30Z" fill="#3a1e10" opacity=".22" filter="url(#soft6)"/>`;
    // volume do rosto: luz do lado esquerdo, sombra no direito
    s += `<path d="${face}" fill="url(#litX)" opacity=".8"/>`;
    // reflexo de luz na testa e maçã do rosto
    s += `<ellipse cx="-26" cy="-36" rx="22" ry="12" fill="#fff3dc" opacity=".16" filter="url(#soft6)"/><ellipse cx="-34" cy="18" rx="12" ry="8" fill="#fff3dc" opacity=".12" filter="url(#soft6)"/>`;
    if (o.hair === 'hood') {
      const hood = 'M-112,30 C-122,-120 -50,-150 0,-150 C50,-150 122,-120 112,30 C110,96 76,124 0,124 C-76,124 -110,96 -112,30Z';
      s = s.replace(/(<path d="M-112,30 C-122[^>]*\/>)/, `$1${shade(hood)}`);
    }
    return s;
  };

  // ---------- corpo inteiro: proporção mais realista + sombreamento em degradê ----------
  fullBody = function (o, t = 0) {
    const top = o.top || '#6b4a32', legs = o.legs || '#3a3a2e';
    const hunter = (o.head && o.head.hair) ? o.head.hair === 'hood' : true;
    const step = o.walk ? Math.sin(t * 8) * 14 : 0, br = 1 + .01 * Math.sin(t * 2.4);
    let b = `<defs>${SHADE_DEFS}</defs>`;
    // sombra de contato (dupla: larga e suave + curta e escura)
    b += `<ellipse cx="0" cy="6" rx="170" ry="30" fill="#000" opacity=".22" filter="url(#soft14)"/><ellipse cx="0" cy="2" rx="90" ry="12" fill="#000" opacity=".35" filter="url(#b5)"/>`;
    const legP = 'M-26,0 L26,0 L22,280 L-22,280Z';
    for (const [lx, sg] of [[-34, 1], [34, -1]])
      b += g(`<path d="${legP}" fill="${legs}"/>${shade(legP)}<path d="M-28,250 L30,250 L44,300 L-30,300Z" fill="#3a2a1e"/><path d="M-28,250 L30,250 L44,300 L-30,300Z" fill="url(#litX)"/><rect x="-32" y="294" width="78" height="10" rx="4" fill="#24180f"/>`, `translate(${lx},-300) rotate(${sg * step},0,0)`);
    const torso = 'M-96,0 L-84,-250 C-60,-290 60,-290 84,-250 L96,0 L100,40 L-100,40Z';
    let tb = `<path d="${torso}" fill="${top}"/>${shade(torso)}`;
    // dobras de tecido
    tb += `<path d="M-50,-200 C-40,-140 -46,-80 -36,-20" stroke="#000" stroke-width="10" opacity=".08" fill="none" filter="url(#soft6)"/><path d="M44,-210 C56,-150 50,-70 60,-10" stroke="#000" stroke-width="12" opacity=".1" fill="none" filter="url(#soft6)"/>`;
    tb += `<rect x="-100" y="-34" width="200" height="30" fill="#3a2a1e"/><rect x="-100" y="-34" width="200" height="30" fill="url(#litX)"/><rect x="-16" y="-38" width="32" height="38" rx="4" fill="#c9a24a"/><rect x="-12" y="-35" width="10" height="30" rx="3" fill="#fff0b0" opacity=".45"/><rect x="40" y="-30" width="44" height="54" rx="8" fill="#5a4030"/><rect x="40" y="-30" width="44" height="54" rx="8" fill="url(#litX)"/>`;
    // sombra da cabeça sobre o peito
    tb += `<ellipse cx="0" cy="-262" rx="86" ry="40" fill="url(#aoNeck)" filter="url(#soft6)"/>`;
    if (hunter) tb += `<path d="M-70,-270 C-40,-230 40,-230 70,-270 L80,-250 C40,-200 -40,-200 -80,-250Z" fill="#000" opacity=".22" filter="url(#b2)"/>`;
    b += g(tb, `translate(0,-270) scale(1,${br})`);
    const aL = o.armL ?? 10, aR = o.armR ?? -10;
    const armP = 'M-24,0 L24,0 L18,220 L-18,220Z';
    const arm = (item) => `<path d="${armP}" fill="${top}"/>${shade(armP)}<rect x="-20" y="200" width="40" height="40" rx="10" fill="#2a2420"/><circle cx="0" cy="250" r="26" fill="#2a2420"/><circle cx="-8" cy="242" r="10" fill="#fff" opacity=".08"/>` + (item || '');
    b += g(arm(), `translate(-98,-530) rotate(${aL})`);
    b += g(arm(o.item), `translate(98,-530) rotate(${aR})`);
    // cabeça menor (proporção ~1:6) — antes era .95
    b += g(headG({ ...HUNTER, ...o.head }), 'translate(0,-628) scale(.86)');
    return g(b, `translate(${o.x},${o.y}) scale(${o.s || 1}) ${o.flip ? 'scale(-1,1)' : ''}`);
  };

  // ---------- busto: degradê no tronco ----------
  const bust0 = bust;
  bust = function (o) {
    const s = bust0(o);
    const torso = 'M-180,470 C-182,270 -150,180 -66,158 L66,158 C150,180 182,270 180,470 Z';
    // injeta o sombreamento logo depois do tronco
    return s.replace(/(<path d="M-180,470 C-182,270[^>]*\/>)/, `$1<defs>${SHADE_DEFS}</defs>${shade(torso)}<ellipse cx="0" cy="190" rx="110" ry="46" fill="url(#aoNeck)" filter="url(#soft6)"/>`);
  };

  // ---------- grama: cada fio com degradê (base escura, ponta iluminada) ----------
  const lighten = (hex, k) => {
    const n = parseInt(hex.slice(1), 16); let r = n >> 16, gg = (n >> 8) & 255, b = n & 255;
    r = Math.round(r + (255 - r) * k); gg = Math.round(gg + (255 - gg) * k); b = Math.round(b + (255 - b) * k);
    return '#' + ((1 << 24) + (r << 16) + (gg << 8) + b).toString(16).slice(1);
  };
  const darken = (hex, k) => { const n = parseInt(hex.slice(1), 16); const f = c => Math.round(c * (1 - k)); return '#' + ((1 << 24) + (f(n >> 16) << 16) + (f((n >> 8) & 255) << 8) + f(n & 255)).toString(16).slice(1); };
  blades = function (t, n, seed, y0, y1, hmin, hmax, wmax, c1, c2, blur, op = 1) {
    const r = rng(seed); let s = '';
    const id1 = uid('bl'), id2 = uid('bl');
    const grad = (id, c) => `<linearGradient id="${id}" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${darken(c, .45)}"/><stop offset=".55" stop-color="${c}"/><stop offset="1" stop-color="${lighten(c, .35)}"/></linearGradient>`;
    const defs = `<defs>${grad(id1, c1)}${grad(id2, c2)}</defs>`;
    // fios extras para a grama ficar mais densa
    const N = Math.round(n * 1.6);
    for (let i = 0; i < N; i++) {
      const x = r() * (W + 200) - 100, y = y0 + r() * (y1 - y0), h = hmin + r() * (hmax - hmin), w = 5 + r() * wmax, lean = (r() - .5) * h * .5 + Math.sin(t * 1.5 + i * .7 + x * .003) * h * .07;
      s += `<path d="M${x - w},${y} Q${x + lean * .4},${y - h * .55} ${x + lean},${y - h} Q${x + lean * .4 + w * .4},${y - h * .5} ${x + w},${y}Z" fill="url(#${r() < .5 ? id1 : id2})"/>`;
    }
    return `${defs}<g ${blur ? `filter="url(#${blur})"` : ''} opacity="${op}">${s}</g>`;
  };

  // ---------- prado: névoa no horizonte e luz quente atmosférica por cima ----------
  const gameMeadow0 = gameMeadow;
  gameMeadow = function (t, opts = {}) {
    let s = gameMeadow0(t, opts);
    const dusk = opts.dusk;
    // camada de névoa na linha do horizonte
    s += `<defs><linearGradient id="hz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${dusk ? '#ffb48a' : '#f4fbff'}" stop-opacity="0"/><stop offset=".5" stop-color="${dusk ? '#ffb48a' : '#f4fbff'}" stop-opacity=".35"/><stop offset="1" stop-color="${dusk ? '#ffb48a' : '#f4fbff'}" stop-opacity="0"/></linearGradient></defs>`;
    s += `<rect y="820" width="${W}" height="420" fill="url(#hz)"/>`;
    s += blades(t, 220, 91, 1150, 1700, 60, 160, 2, dusk ? '#4a6a36' : '#86cc58', dusk ? '#3a5a2e' : '#62b240', '', .95);
    return s;
  };
})();
