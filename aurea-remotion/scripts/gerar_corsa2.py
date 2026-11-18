"""Monta public/corsa2/scenes.js: ferramentas do Ep1 (public/posto/scenes.js) + estilo novo (_novo.js) + cenas do Ep2 (_cenas.js).
uso: python3 scripts/gerar_corsa2.py"""
import os
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public')
base = open(os.path.join(R, 'posto', 'scenes.js')).read()
a = base.index("const PART = {"); b = base.index("};", a) + 2
part = open(os.path.join(R, 'corsa2', '_part.js')).read().strip() if os.path.exists(os.path.join(R, 'corsa2', '_part.js')) else "const PART = { words: 'words.json', end: 60, abTime: 50, manualChunks: true, noCapsFrom: 50, merges: [], hl: [] };"
base = base[:a] + part + base[b:]
novo = open(os.path.join(R, 'corsa2', '_novo.js')).read()
cenas = open(os.path.join(R, 'corsa2', '_cenas.js')).read()
out = "// O CORSA DO AVÔ — EP2 (gerado por scripts/gerar_corsa2.py; edite _novo.js e _cenas.js)\n" + base + novo + cenas + '''
SCENES.length = 0; SCENES.push(...EP2);
SCENES.forEach(sc => { const f = sc.f; sc.f = (t, p, d) => { __T = (sc.at || 0) + t; return f(t, p, d); }; });
'''
open(os.path.join(R, 'corsa2', 'scenes.js'), 'w').write(out)
print('ok')
