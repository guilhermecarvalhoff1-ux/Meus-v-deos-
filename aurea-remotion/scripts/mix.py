import json, wave, numpy as np, sys
S = sys.argv[1]; times = json.load(open(sys.argv[2])); total = float(sys.argv[3]); out = sys.argv[4]
SR = 44100
def load(n):
    with wave.open(f'{S}/sfx/{n}.wav') as w: return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32767
st = {}
for x in times: st[x['k'] if x['k'] else f"gap{x['gap']}"] = x['s']
mix = np.zeros(int(SR * total) + SR)
def put(name, at, gain=1.0, key=None):
    t = (st[key] if key else 0) + at
    a = load(name) * gain; i = int(t * SR)
    if i < 0 or i >= len(mix): return
    n = min(len(a), len(mix) - i); mix[i:i + n] += a[:n]
E = [  # (cena, atraso, som, volume)
 ('no áurea quem', 0.9, 'espada', .5), ('no áurea quem', 1.7, 'moeda', .5), ('no áurea quem', 2.4, 'magia', .35),
 ('quando um', 0.4, 'moeda', .35), ('classe ladrão', 0, 'whoosh', .6), ('nenhuma arma', 0.2, 'espada', .25),
 ('mas ele tem', 0.1, 'magia', .5), ('pega qualquer', 0.6, 'magia', .45), ('pega qualquer', 2.2, 'moeda', .5),
 ('e no áurea', 0.4, 'pix', .6), ('e no áurea', 0.7, 'moeda', .4), ('isso nem é', 0, 'glitch', .45),
 ('em 2008', 0, 'whoosh', .4), ('o caio é', 0.6, 'impacto', .35), ('na vida real', 0, 'whoosh', .5),
 ('hoje o alvo', 0.1, 'impacto', .7), ('a guilda mais', 0.2, 'moeda', .4), ('cinco jogadores', 0.2, 'espada', .45),
 ('faz quarenta', 0.2, 'rugido', .6), ('faz quarenta', 1.4, 'espada', .45), ('faz quarenta', 2.6, 'espada', .4),
 ('caio espera', 0, 'coracao', .55), ('caio espera', 0.9, 'coracao', .55), ('sem se mexer', 0, 'coracao', .6), ('sem se mexer', .9, 'coracao', .6),
 ('gap0', 0, 'rugido', .9), ('gap0', .2, 'impacto', .7),
 ('gap2', .1, 'espada', .6), ('gap2', .7, 'espada', .5), ('gap2', 1.3, 'espada', .55),
 ('gap4', .2, 'whoosh', .6), ('gap4', .5, 'impacto', .8),
 ('gap6', 0, 'coracao', .8), ('gap6', .8, 'coracao', .8), ('gap6', 1.6, 'coracao', .8),
 ('gap8', 0, 'glitch', .3), ('gap8', .2, 'coracao', .9), ('gap8', 1.0, 'coracao', .9),
 ('gap10', 0, 'riser', .7), ('gap10', .3, 'whoosh', .5),
 ('gap12', 0, 'riser', .8), ('gap12', 1.75, 'impacto', 1.0),
 ('o dragão cai', 0, 'desmorona', .9), ('um baú', .2, 'magia', .55), ('dentro coração', .3, 'moeda', .5),
 ('um dois', 0, 'coracao', .7), ('mão leve', 0, 'magia', .8), ('mão leve', .1, 'whoosh', .7),
 ('o baú some', 0, 'whoosh', .5), ('o celular vibra', .1, 'vibra', .7), ('o celular vibra', .6, 'pix', .7),
 ('aluguel pago', .2, 'impacto', .6), ('aí chega', .1, 'mensagem', .7), ('bom roubo', 0, 'mensagem', .4),
 ('caio olha', .1, 'whoosh', .6), ('agachado no', 0, 'coracao', .8), ('agachado no', .9, 'coracao', .8),
 ('o mesmo nome', .1, 'glitch', .7), ('e ele também', 0, 'riser', .5), ('comenta a', 0, 'impacto', .8), ('ou b se', 0, 'whoosh', .7),
]
for k, d, n, gnn in E: put(n, d, gnn, k)
# trilha: volume baixo, sobe na luta e cai depois do roubo
tr = load('trilha'); reps = int(np.ceil(len(mix) / len(tr))); tr = np.tile(tr, reps)[:len(mix)]
tt = np.arange(len(mix)) / SR
vol = np.full(len(mix), .12)
a, b = st['faz quarenta'], st['gap0']; vol += np.clip((tt - a) / (b - a + 1e-6), 0, 1) * .12
c = st['o dragão cai']; vol[tt > c] = .10
d = st['agachado no']; vol[tt > d] = .2
mix += tr * vol
mix = mix / (np.max(np.abs(mix)) + 1e-9) * .9
with wave.open(out, 'w') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
print('ok', round(len(mix) / SR, 1))
