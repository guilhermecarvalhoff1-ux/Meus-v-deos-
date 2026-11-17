"""Efeitos + música do "O Corsa dos 18" (a voz entra pelo Remotion).
uso: python3 scripts/mix_corsa.py <pasta sfx> <tempos.json de times.js> <words.json> <total s> <saida.wav>"""
import json, wave, sys, numpy as np
S, times, words, total, out = sys.argv[1], json.load(open(sys.argv[2])), json.load(open(sys.argv[3]))['words'], float(sys.argv[4]), sys.argv[5]
SR = 44100
def load(n):
    with wave.open(f'{S}/{n}.wav') as w: return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32767
def start(k, n=1):  # n-ésima cena com essa chave
    return [x['s'] for x in times if x['k'] == k][n - 1]
mix = np.zeros(int(SR * total) + SR)
def put(name, t, gain):
    a = load(name) * gain; i = int(t * SR); n = min(len(a), len(mix) - i); mix[i:i + n] += a[:n]
E = [  # (cena, ocorrência, atraso, som, volume) — só nos impactos
 ('e ganhou', 1, .5, 'impacto', .7), ('e ganhou', 1, .55, 'magia', .3),
 ('era o corsa', 1, 1.0, 'espada', .6), ('era o corsa', 1, 1.05, 'impacto', .35),
 ('tinha quilometragem', 1, 0, 'riser', .4), ('vende essa lata', 1, .9, 'glitch', .5),
 ('vendendo o corsa', 1, .3, 'moeda', .5), ('e ficar anos', 1, .2, 'moeda', .3),
 ('caiu num vídeo', 1, 0, 'whoosh', .6), ('pra quem não', 1, .1, 'impacto', .5),
 ('rebaixado', 1, .1, 'impacto', .7), ('roda aro largo', 1, 0, 'whoosh', .5), ('adesivo em', 1, .25, 'impacto', .45),
 ('aí ele abriu', 1, .5, 'coracao', .7), ('aí ele abriu', 1, 1.3, 'coracao', .7),
 ('encostado nesse', 1, 0, 'riser', .45), ('rebaixado', 2, 0, 'impacto', .9),
 ('a vende e', 1, 0, 'whoosh', .6), ('ou b fica', 1, 0, 'whoosh', .6), ('comenta aí', 1, 0, 'impacto', .8),
]
for k, n, d, snd, gn in E: put(snd, start(k, n) + d, gn)
tr = load('trilha'); tr = np.tile(tr, int(np.ceil(len(mix) / len(tr))))[:len(mix)]
tt = np.arange(len(mix)) / SR
vol = np.full(len(mix), .15)
vol[(tt > start('caiu num vídeo')) & (tt < start('aí ele abriu'))] = .22   # trecho JDM mais animado
vol[(tt >= start('aí ele abriu')) & (tt < start('agora o lucas'))] = .1    # porta-luvas e foto: mais quieto
fala = np.zeros(len(mix))
for w in words: fala[int(w['start'] * SR):int((w['end'] + .15) * SR)] = 1
k = int(.12 * SR); fala = np.convolve(fala, np.ones(k) / k, 'same')
vol *= 1 - .55 * fala
mix += tr * vol
mix = mix / (np.max(np.abs(mix)) + 1e-9) * .8
with wave.open(out, 'w') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
print('ok', round(len(mix) / SR, 1))
