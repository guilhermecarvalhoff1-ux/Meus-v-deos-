// Motor de cenas + legendas (compartilhado pelos episódios)
(function(){
const CFG = (typeof PART !== "undefined") ? PART : { words: "words.json", end: 138.0, abTime: 127.9, merges: [], hl: [] };
const END = CFG.end;
let WORDS = [];
// Junta números falados em numerais
const MERGES = [...CFG.merges,
  [['quarenta','e','dois','mil','reais'], 'R$ 42 MIL'],
  [['quarenta','e','oito','mil','duzentos','e','treze'], 'Nº 48.213'],
  [['quarenta','e','dois','mil'], '42 MIL'],
  [['dois','milhões','e','setecentas','mil'], '2,7 MILHÕES'],
  [['nove','mil','reais'], 'R$ 9 MIL'],
  [['vinte','e','cinco','mil'], 'R$ 25 MIL'],
  [['quarenta','segundos'], '40 SEGUNDOS'],
  [['vinte','minutos'], '20 MINUTOS'],
  [['catorze','de','março'], '14 DE MARÇO'],
  [['sete','meses'], '7 MESES'],
  [['seis','anos'], '6 ANOS'],
];
const HL = new Set([...CFG.hl,'pior','pagando','lethe','2031','promessa','lembrança','ruim','cadeira','sumiu','graça','memórias','catálogo','medo','paixão','luto','caro','rica','sentir','distante','2009','amsterdã','aranha','pressão','propranolol','desaparecido','continuava','dor','tudo','marina','theo','rio','leve','vazia','livre','café','chora','botas','amarelas','gela','lembra','deu','recibo','infantil','celular','ninguém','sabia','cartão','devolve','arquivo','lembranças','dela','a','b','destruir','encarar','invadir','volta']);
const norm = w => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
let CHUNKS = [];
function buildCaptions(words) {
  words = words.filter(w => w.type === 'word' && !w.text.startsWith('['));
  const toks = [];
  for (let i = 0; i < words.length;) {
    let done = false;
    for (const [seq, rep] of MERGES) {
      if (seq.every((s, k) => words[i + k] && norm(words[i + k].text) === s)) {
        const last = words[i + seq.length - 1];
        toks.push({ t: rep + (/[.,:…!?]$/.test(last.text.replace(/"/g, '')) ? last.text.replace(/"/g, '').slice(-1) : ''), s: words[i].start, e: last.end, hl: true, force: true });
        i += seq.length; done = true; break;
      }
    }
    if (done) continue;
    const w = words[i];
    toks.push({ t: w.text.replace(/"/g, ''), s: w.start, e: w.end, hl: false, br: w.br, hold: w.hold });
    i++;
  }
  // regra especial: A e B no fim só destacam quando são as opções
  const chunks = [];
  let cur = [];
  const flush = () => { if (cur.length) chunks.push(cur); cur = []; };
  for (const tk of toks) {
    if (CFG.manualChunks) { if (tk.force) { flush(); chunks.push([tk]); continue; } cur.push(tk); if (tk.br) flush(); continue; }
    if (tk.force) { flush(); chunks.push([tk]); continue; }
    const len = cur.map(c => c.t).join(' ').length + tk.t.length;
    if (cur.length >= 3 || len > 17) flush();
    cur.push(tk);
    if (/[.,:…!?]$/.test(tk.t)) flush();
  }
  flush();
  window.AUREA_CHUNKS = CHUNKS = chunks.map((c, i) => ({ s: c[0].s, e: Math.min(chunks[i + 1] ? chunks[i + 1][0].s : 1e9, c[c.length - 1].e + (c[c.length - 1].hold ?? .8)), toks: c }));
}
function captionSVG(t) {
  const c = CHUNKS.find(c => t >= c.s - 0.03 && t < c.e);
  if (!c) return '';
  const age = t - c.s;
  const sc = age < .1 ? lerp(.82, 1, easeOut(age / .1)) : 1;
  const spans = c.toks.map((tk, i) => {
    let word = tk.t.replace(/[.,:…!?]+$/, '');
    if (!word) return '';
    const n = norm(word);
    let hl = tk.hl || HL.has(n);
    if ((n === 'a' || n === 'b') && !(t > CFG.abTime && word.length === 1 && (word === 'A' || word === 'B'))) hl = false;
    if (n === 'a' && word === 'A' && t > CFG.abTime) hl = true;
    return `<tspan fill="${hl ? '#ffc928' : '#ffffff'}">${(i ? ' ' : '') + word.toUpperCase()}</tspan>`;
  }).join('');
  return `<g transform="translate(540,1250) scale(${sc})"><text x="0" y="0" font-family="RC" font-weight="900" font-size="86" text-anchor="middle" stroke="#000" stroke-width="16" stroke-linejoin="round" paint-order="stroke" letter-spacing="1">${spans}</text></g>`;
}
function sceneAt(t) { let i = 0; for (let k = 0; k < SCENES.length; k++) if (t >= SCENES[k].s) i = k; return i; }
function render(t) {
  UID = 0;
  const i = sceneAt(t), sc = SCENES[i];
  const st = sc.s, en = SCENES[i + 1] ? SCENES[i + 1].s : END;
  const d = en - st, lt = t - st, p = clamp(lt / d);
  const z = lerp(sc.z[0], sc.z[1], ease(p));
  const [cx, cy] = sc.c || [540, 960];
  let body = sc.f(lt, p, d);
  // câmera
  let out = `<defs>${DEFS}<filter id="post" x="0" y="0" width="1080" height="1920" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feComponentTransfer in="SourceGraphic" result="g"><feFuncR type="table" tableValues="0.03 0.27 0.56 0.83 1"/><feFuncG type="table" tableValues="0.02 0.25 0.53 0.80 0.98"/><feFuncB type="table" tableValues="0.05 0.25 0.49 0.75 0.93"/></feComponentTransfer><feColorMatrix in="g" type="saturate" values="0.9" result="g2"/><feComponentTransfer in="g2" result="hi"><feFuncR type="linear" slope="3.2" intercept="-2.35"/><feFuncG type="linear" slope="3.2" intercept="-2.35"/><feFuncB type="linear" slope="3.2" intercept="-2.35"/></feComponentTransfer><feGaussianBlur in="hi" stdDeviation="26" result="bl"/><feComposite in="g2" in2="bl" operator="arithmetic" k1="0" k2="1" k3="0.3" k4="0"/></filter></defs><g filter="url(#post)"><g transform="translate(${cx},${cy}) scale(${z}) translate(${-cx},${-cy})">${body}</g></g>`;
  // fade de entrada curto em algumas cenas
  const fadeIn = clamp(lt / 0.12);
  if (fadeIn < 1) out += `<rect width="${W}" height="${H}" fill="#000" opacity="${(1 - fadeIn) * .5}"/>`;
  if (t > END - 0.5) out += `<rect width="${W}" height="${H}" fill="#000" opacity="${clamp((t - (END - .5)) / .5) * .0}"/>`;
  if (!(CFG.noCapsFrom != null && t >= CFG.noCapsFrom)) out += captionSVG(t);
  return out;
}
// Abre um trecho sem fala (ex.: luta estendida) antes da frase CFG.gap.key, deslocando as palavras seguintes
function applyGap(words) {
  if (!CFG.gap) return;
  const ws = words.filter(w => w.type === 'word' && !w.text.startsWith('['));
  const key = CFG.gap.key.split(' ');
  for (let i = 0; i < ws.length; i++) if (key.every((k, j) => ws[i + j] && norm(ws[i + j].text) === k)) {
    const t0 = ws[i].start;
    CFG.gapStart = t0 - 0.15;
    for (const w of words) if (w.start >= t0 - 0.01) { w.start += CFG.gap.dur; w.end += CFG.gap.dur; }
    return;
  }
  console.error('NAO ACHEI O GAP', CFG.gap.key);
}
function resolveStarts(words) {
  const ws = words.filter(w => w.type === 'word' && !w.text.startsWith('['));
  let from = 0;
  for (const sc of SCENES) {
    if (sc.k == null) { if (sc.at != null) sc.s = sc.at; if (sc.gap != null && CFG.gapStart != null) sc.s = CFG.gapStart + sc.gap; continue; }
    const key = sc.k.split(' ');
    let found = -1;
    for (let i = from; i < ws.length; i++) if (key.every((k, j) => ws[i + j] && norm(ws[i + j].text) === k)) { found = i; break; }
    if (found < 0) { console.error('NAO ACHEI', sc.k); sc.s = SCENES[SCENES.indexOf(sc) - 1].s + 2; continue; }
    sc.s = SCENES.indexOf(sc) === 0 ? 0 : ws[found].start - 0.05; from = found + 1;
  }
}
window.AUREA = {
  init(words) { applyGap(words); resolveStarts(words); buildCaptions(words); },
  frame(t) { return render(t); },
  end: END,
};
})();
