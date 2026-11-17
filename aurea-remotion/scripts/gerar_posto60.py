"""Gera public/posto60/scenes.js (versão curta, 60 s) a partir das cenas do episódio completo (public/posto/scenes.js).
uso: python3 scripts/gerar_posto60.py"""
import os
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public')
s = open(os.path.join(R, 'posto', 'scenes.js')).read()
a = s.index("const PART = {"); b = s.index("};", a) + 2
s = s[:a] + "const PART = { words: 'words.json', end: 60, abTime: 50, manualChunks: true, noCapsFrom: 50, merges: [], hl: ['vinte','corsa','abastecer','missão','carro','teu','dia','casa','cheiro','vô','vergonha','careca','pneu','tio','embora','avô','lembrou','firme','posto','bonito','rua','melhor','projeto','comenta','junto'] };" + s[b:]
assert s.count("c.s > 78") == 2 and "T > 81.6" in s and "(T - 82.2)" in s
s = s.replace("c.s > 78", "c.s > 49.5").replace("T > 81.6", "T > 50.1").replace("(T - 82.2)", "(T - 51.4)")
s = s.replace("// O CORSA DO AVÔ — EP1 O POSTO", "// O CORSA DO AVÔ — EP1 O POSTO (VERSÃO CURTA, 60 s) — gerado por scripts/gerar_posto60.py", 1)
s += '''
// ===== versão curta (60 s): reordena as cenas do episódio completo e põe um gancho na frente =====
(function () {
  const byAt = {}; SCENES.forEach(sc => { byAt[sc.at] = sc; });
  const MAP = [[0, 3], [4, 6], [12, 10], [15, 12], [22.8, 14], [24, 15.3], [27, 17.9], [31, 21.1], [35, 24.4], [36.3, 25.5], [39, 27.2],
    [43, 30], [44.7, 31.1], [45.6, 31.8], [46.9, 32.6], [50.4, 34], [59.4, 38], [64.4, 42], [69.4, 47], [72.5, 48.5], [81.5, 50]];
  const mirror = byAt[35], cara2 = byAt[36.3];
  const picked = MAP.map(([o, n]) => { const sc = byAt[o]; sc.at = n; return sc; });
  const title = (t) => {
    const k = Math.min(1, t / .18), sc = k < 1 ? lerp(1.25, 1, easeOut(k)) : 1 + .02 * Math.sin(t * 6);
    const line = (y, parts) => `<text x="540" y="${y}" font-family="RC" font-weight="900" font-size="74" text-anchor="middle" stroke="#000" stroke-width="14" stroke-linejoin="round" paint-order="stroke">${parts.map(([w, hl]) => `<tspan fill="${hl ? GOLD : '#fff'}">${w}</tspan>`).join('')}</text>`;
    return `<rect y="170" width="${W}" height="250" fill="#000" opacity="${.45 * k}"/>` + g(line(270, [['GANHEI UM ', 0], ['CORSA', 1], [' NOS 18…', 0]]) + line(370, [['E VIREI ', 0], ['PIADA', 1], [' NO POSTO', 0]]), `translate(540,320) scale(${sc}) translate(-540,-320)`, `opacity="${k}"`);
  };
  const gancho = { at: 0, z: [1.0, 1.04], c: [540, 960], f: (t, p, d) => {
    const base = t < 1.5 ? cara2.f(t + .4, (t + .4) / 2, 2) : mirror.f(t - 1.5, (t - 1.5) / 1.1, 1.1);
    return base + title(t);
  } };
  SCENES.length = 0; SCENES.push(gancho, ...picked);
})();
'''
open(os.path.join(R, 'posto60', 'scenes.js'), 'w').write(s)
print('ok')
