"""Trilha do Ep2 (efeitos + música, abaixando sob as vozes). uso: python3 scripts/corsa2_mix.py sfx saida.wav public/corsa2/vozes.wav"""
import wave, sys, numpy as np
from scipy.signal import butter, lfilter
S, out = sys.argv[1], sys.argv[2]; SR = 44100; TOTAL = 60
def load(n):
    with wave.open(f'{S}/{n}.wav') as w: return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32767
def lp(x, f): b, a = butter(2, f / (SR / 2)); return lfilter(b, a, x)
mix = np.zeros(SR * TOTAL + SR)
def put(n, t, g=1.0, dur=None, fi=0, fo=0, src=None):
    a = (src if src is not None else load(n)).copy()
    if dur: a = a[:int(dur * SR)]
    a *= g; L = len(a)
    if fi: k = min(L, int(fi * SR)); a[:k] *= np.linspace(0, 1, k)
    if fo: k = min(L, int(fo * SR)); a[L - k:] *= np.linspace(1, 0, k)
    i = int(t * SR); n2 = min(L, len(mix) - i); mix[i:i + n2] += a[:n2]
tr = load('trilha'); fast = np.interp(np.arange(0, len(tr) - 1, 1.1), np.arange(len(tr)), tr)
# gancho
put('pato', .25, .8); put('whoosh', .9, .4)
# música da oficina (animada) de 3 a 40 s
put(None, 3.0, .26, src=np.tile(fast, 6)[:int(37 * SR)], fi=.6, fo=.4)
put(None, 3.0, .12, src=np.tile(load('marcha_lenta'), 3)[:int(5 * SR)], fi=.5, fo=1)
for t in (11.92, 12.82, 13.72, 14.62): put('impacto', t, .25)
put('chiado', 15.4, .2, dur=.35, fo=.1)
for t in (19.5, 20.4, 21.3): put('coracao', t, .4)
put('magia', 25.4, .4)
put('tecla', 30.2, .7); put('pix', 30.25, .5)
put('plastico', 32.4, .7); put('plastico', 33.6, .5)
for k in range(10): put('tecla', 36.2 + k * .35, .5)
# teste: arranque, e em vez do ronco… o pato
put('arranque_falha', 40.1, .7, dur=.9, fo=.2)
put('pato', 41.25, 1.0); put('moto', 41.6, .7); put('moto', 41.9, .5); put('whoosh', 41.3, .4)
# depois do vexame
put('trombone', 43.6, .4, dur=1.6, fo=.6)
put(None, 44.1, .2, src=np.tile(fast, 2)[:int(6 * SR)], fi=.5, fo=.4)
put('whoosh', 48.3, .35)
# final A/B
put('impacto', 50.15, .8); put('whoosh', 50.6, .5); put('impacto', 58.2, .7)
put(None, 50.1, .3, src=np.tile(fast, 2)[:int(9.9 * SR)], fi=.3, fo=1.2)
if len(sys.argv) > 3:
    with wave.open(sys.argv[3]) as w: v = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32767
    v = v[:len(mix)]; e = np.convolve(np.abs(v), np.ones(int(.15 * SR)) / int(.15 * SR), 'same'); mix[:len(v)] *= 1 - .5 * np.clip(e * 12, 0, 1); mix[:len(v)] += v
mix = mix / (np.max(np.abs(mix)) + 1e-9) * .85
with wave.open(out, 'w') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
print('ok')
