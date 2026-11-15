"""Monta falas_tempos.json: uma entrada por legenda (ordem do SCENES do make.py), com tempos reais do áudio."""
import json, re, unicodedata, os, sys, importlib
# uso: python montar_tempos.py [modulo] [palavras.json] [saida.json]   (padrão: make palavras_tempos.json falas_tempos.json)
MOD = sys.argv[1] if len(sys.argv) > 1 else 'make'
PAL = sys.argv[2] if len(sys.argv) > 2 else 'palavras_tempos.json'
OUT = sys.argv[3] if len(sys.argv) > 3 else 'falas_tempos.json'
if os.path.exists(OUT): os.rename(OUT, OUT + '.bak')
SCENES = importlib.import_module(MOD).SCENES
if os.path.exists(OUT + '.bak'): os.rename(OUT + '.bak', OUT)
def norm(s): return re.sub(r'[^\w]', '', unicodedata.normalize('NFC', s.lower()))
W = []
for w in json.load(open(PAL)):
    parts = w['text'].split()
    if len(parts) == 1: W.append(w); continue
    L = sum(len(x) for x in parts); t = w['start']; D = w['end'] - w['start']
    for x in parts: d = D * len(x) / L; W.append({'text': x, 'start': round(t, 3), 'end': round(t + d, 3)}); t += d
W = [w for w in W if norm(w['text'])]
caps = [c.replace('*', '') for sc in SCENES for c, _ in sc['caps']]
out, k, prob = [], 0, []
for c in caps:
    cw = [x for x in c.split() if norm(x)]
    seg = W[k:k + len(cw)]
    if [norm(x) for x in cw] != [norm(x['text']) for x in seg]: prob.append((c, [x['text'] for x in seg]))
    out.append({"start": seg[0]['start'], "end": seg[-1]['end'], "text": c}); k += len(cw)
json.dump(out, open(OUT, 'w'), ensure_ascii=False, indent=1)
print(len(out), 'legendas; palavras usadas', k, 'de', len(W)); [print('DIFERENÇA:', p) for p in prob]
