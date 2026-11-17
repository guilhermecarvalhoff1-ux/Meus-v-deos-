"""Trilha de efeitos + música do Ep1 'O Posto' (sem vozes). uso: python3 scripts/posto_mix.py sfx saida.wav [vozes.wav]
Quando as vozes chegarem, passe o wav das vozes: a música abaixa sob a fala."""
import wave, sys, numpy as np
from scipy.signal import butter, lfilter
S, out = sys.argv[1], sys.argv[2]; SR = 44100; TOTAL = 90
def load(n):
    with wave.open(f'{S}/{n}.wav') as w: return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32767
def lp(x, f): b, a = butter(2, f / (SR / 2)); return lfilter(b, a, x)
mix = np.zeros(SR * TOTAL + SR)
def put(n, t, g=1.0, dur=None, fi=0, fo=0, src=None, off=0):
    a = (src if src is not None else load(n))[int(off * SR):]
    if dur: a = a[:int(dur * SR)]
    a = a * g; L = len(a)
    if fi: k = min(L, int(fi * SR)); a[:k] *= np.linspace(0, 1, k)
    if fo: k = min(L, int(fo * SR)); a[L - k:] *= np.linspace(1, 0, k)
    i = int(t * SR); n2 = min(L, len(mix) - i); mix[i:i + n2] += a[:n2]
def loop(n, dur): a = load(n); return np.tile(a, int(np.ceil(dur * SR / len(a))))[:int(dur * SR)]
# 1 painel: bip + motor
for t in (.3, 1.6, 2.9): put('bip', t, .5)
put(None, 0, .25, src=loop('marcha_lenta', 12), fi=.3, fo=1)
# 2 rádio chiando, tapa, música de fita
put('chiado', 4.0, .5, dur=1.25, fo=.15); put('impacto', 4.45, .4); put('impacto', 4.85, .45); put('fita_radio', 5.15, .55, dur=2.85, fi=.05)
# 3 lembrança: mesma música, limpa (continua do mesmo ponto); solavanco
put('fita_limpa', 8.0, .55, off=2.85, dur=3.7, fo=.15); put('impacto', 11.55, .8); put('whoosh', 11.5, .4); put('fita_radio', 11.6, .5, off=6.5, dur=.4, fo=.3)
# 4–5 grave dos carros, para com o disco arranhando
put(None, 12.0, .75, src=lp(loop('grave', 4.7), 500), fi=.4, fo=.05); put('arranhao', 16.6, .7)
put(None, 15.0, .25, src=loop('marcha_lenta', 9), fi=.5, fo=.6)
# 6–7 silêncio e grilo
put(None, 18.0, .55, src=loop('grilo', 6), fi=.2, fo=1)
# 8 lembrança do terço
put('magia', 24.1, .25); put('fita_limpa', 24.0, .2, off=4, dur=3, fi=.4, fo=.6)
# 9–14 comédia: música animada
tr = load('trilha'); idx = np.arange(0, len(tr) - 1, 1.12); fast = np.interp(idx, np.arange(len(tr)), tr)
put(None, 27.0, .3, src=np.tile(fast, 4)[:int(23.4 * SR)], fi=.5, fo=.3)
put('plec', 35.75, 1.0); put('impacto', 35.75, .35); put('whoosh', 35.35, .3)
for t in (40.2, 41.0, 41.8): put('impacto', t, .3)
put('arranque_falha', 43.3, .8); put('arranque_falha', 45.7, .8)
put('motor_pega', 47.2, .9); put('whoosh', 48.1, .6)
for t in (48.7, 49.2, 49.7): put('tosse', t, .55)
put('trombone', 48.9, .55)
# 15 tudo abafado, coração
slow = lp(np.interp(np.arange(0, len(tr) - 1, .85), np.arange(len(tr)), tr), 500)
put(None, 50.4, .5, src=np.tile(slow, 3)[:int(4 * SR)], fi=.2, fo=.5)
for t in (50.7, 51.6, 52.5, 53.4): put('coracao', t, .5)
# 16–17 lembranças: vento e música dos anos 90 bem baixinha
put('vento', 54.4, .45, fo=1.2); put('fita_limpa', 54.4, .22, off=0, dur=10, fi=1, fo=1.5)
# 18 fusão passado -> presente
put('riser', 66.4, .35)
# 19 câmera lenta
put(None, 69.4, .25, src=np.tile(slow, 3)[:int(12 * SR)], fi=1, fo=1)
for t in (70.0, 71.4, 72.8, 74.2, 75.4): put('coracao', t, .4)
# 20 digitando o anúncio
for k in range(14): put('tecla', 76.3 + k * .17, .5)
# 21 final A/B
put('impacto', 81.55, .8); put('whoosh', 82.2, .5); put('impacto', 86.37, .7)
put(None, 81.5, .3, src=np.tile(fast, 3)[:int(8.5 * SR)], fi=.3, fo=1.5)
# vozes (quando houver): soma e abaixa o resto sob a fala
if len(sys.argv) > 3:
    with wave.open(sys.argv[3]) as w: v = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32767
    v = v[:len(mix)]; e = np.convolve(np.abs(v), np.ones(int(.15 * SR)) / int(.15 * SR), 'same'); duck = 1 - .5 * np.clip(e * 12, 0, 1)
    mix[:len(v)] *= duck; mix[:len(v)] += v * 1.0
mix = mix / (np.max(np.abs(mix)) + 1e-9) * .85
with wave.open(out, 'w') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
print('ok', round(len(mix) / SR, 1))
