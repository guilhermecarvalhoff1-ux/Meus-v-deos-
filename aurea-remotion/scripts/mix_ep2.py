"""Efeitos + música do Áurea Ep2 (sem a voz; a voz entra pelo Remotion).
uso: python3 scripts/mix_ep2.py <pasta sfx> <tempos.json de times.js> <words.json> <total s> <saida.wav>"""
import json, wave, sys, numpy as np
S, times, words, total, out = sys.argv[1], json.load(open(sys.argv[2])), json.load(open(sys.argv[3]))['words'], float(sys.argv[4]), sys.argv[5]
SR = 44100
def load(n):
    with wave.open(f'{S}/{n}.wav') as w: return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32767
st, dur = {}, {}
for i, x in enumerate(times):
    st.setdefault(x['k'], x['s'])
    dur.setdefault(x['k'], (times[i + 1]['s'] if i + 1 < len(times) else total) - x['s'])
mix = np.zeros(int(SR * total) + SR)
def put(name, key, at=0.0, gain=1.0, frac=None):
    t = st[key] + (frac * dur[key] if frac is not None else at)
    a = load(name) * gain; i = int(t * SR)
    n = min(len(a), len(mix) - i); mix[i:i + n] += a[:n]
# efeitos só nos impactos
E = [
 ('ontem ele roubou', 'moeda', .3), ('e um jogador', 'glitch', .45),
 ('o cofre da', 'impacto', .5), ('em 2005', 'whoosh', .4),
 ('meianoite', 'coracao', .55), ('o coração disparado', 'coracao', .7),
 ('a porta gira', 'desmorona', .6), ('a porta gira', 'impacto', .6),          # porta do cofre
 ('um dois', 'coracao', .7), ('mão leve', 'magia', .8), ('mão leve', 'whoosh', .6),
 ('o celular vibra', 'vibra', .7), ('não caiu nada', 'glitch', .5),
 ('é ela', 'impacto', .9), ('é ela', 'riser', .35),                            # revelação
 ('agora cinco jogadores', 'espada', .45), ('e alguém acabou', 'mensagem', .7),
 ('comenta a', 'impacto', .7), ('ou b se', 'whoosh', .6),
]
for k, n, g in E: put(n, k, 0.05, g)
put('impacto', 'e precisava de', gain=1.0, frac=.45)                          # carimbo CULPADO
# música baixa; sobe no assalto, cai no golpe, volta tensa na caçada; abaixa quando a voz fala
tr = load('trilha'); tr = np.tile(tr, int(np.ceil(len(mix) / len(tr))))[:len(mix)]
tt = np.arange(len(mix)) / SR
vol = np.full(len(mix), .16)
vol[(tt > st['meianoite']) & (tt < st['saldo trinta'])] = .22
vol[(tt >= st['saldo trinta']) & (tt < st['agora cinco jogadores'])] = .12
vol[tt >= st['agora cinco jogadores']] = .2
fala = np.zeros(len(mix))
for w in words: fala[int(w['start'] * SR):int((w['end'] + .15) * SR)] = 1
k = int(.12 * SR); fala = np.convolve(fala, np.ones(k) / k, 'same')               # suaviza o abaixamento
vol *= 1 - .55 * fala
mix += tr * vol
mix = mix / (np.max(np.abs(mix)) + 1e-9) * .8
with wave.open(out, 'w') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
print('ok', round(len(mix) / SR, 1))
