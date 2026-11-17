"""Trilha de efeitos + música do Ep1 'O Posto' — VERSÃO CURTA (60 s) (sem vozes). uso: python3 scripts/posto_mix.py sfx saida.wav [vozes.wav]
Quando as vozes chegarem, passe o wav das vozes: a música abaixa sob a fala."""
import wave, sys, numpy as np
from scipy.signal import butter, lfilter
S, out = sys.argv[1], sys.argv[2]; SR = 44100; TOTAL = 60
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
# 0–3 gancho: risada (cara 2) e retrovisor caindo
put(None, 0, .5, src=lp(loop('grave', 1.6), 500), fi=.05, fo=.3); put('whoosh', 1.45, .45); put('plec', 2.25, 1.0); put('impacto', 2.25, .4)
# 3–6 painel na reserva
for t in (3.3, 4.6): put('bip', t, .5)
put(None, 3.0, .25, src=loop('marcha_lenta', 7), fi=.3, fo=.8)
# 6–10 rádio: chiado, 2 tapas, música de fita
put('chiado', 6.0, .5, dur=1.25, fo=.15); put('impacto', 6.45, .4); put('impacto', 6.85, .45); put('fita_radio', 7.15, .55, dur=2.85, fi=.05)
# 10–14 grave dos carros; para com o disco arranhando
put(None, 10.0, .75, src=lp(loop('grave', 3.4), 500), fi=.3, fo=.05); put('arranhao', 13.4, .7)
# 14–18 terço + lembrança
put(None, 13.5, .45, src=loop('grilo', 2), fi=.2, fo=.5); put('magia', 15.35, .25); put('fita_limpa', 15.3, .22, off=4, dur=2.6, fi=.3, fo=.6)
# 18–34 comédia: música animada
tr = load('trilha'); fast = np.interp(np.arange(0, len(tr) - 1, 1.12), np.arange(len(tr)), tr)
put(None, 17.9, .3, src=np.tile(fast, 4)[:int(16.4 * SR)], fi=.4, fo=.3)
put('whoosh', 24.75, .3); put('plec', 25.15, 1.0); put('impacto', 25.15, .35)
for t in (28.0, 28.6, 29.2): put('impacto', t, .3)
put('arranque_falha', 30.15, .8, dur=.9, fo=.2); put('arranque_falha', 31.85, .8, dur=.75, fo=.2)
put('motor_pega', 32.4, .9); put('whoosh', 33.2, .6)
for t in (33.6, 34.0): put('tosse', t, .55)
put('trombone', 33.5, .5, dur=2.0, fo=.8)
# 34–39 tudo abafado
slow = lp(np.interp(np.arange(0, len(tr) - 1, .85), np.arange(len(tr)), tr), 500)
put(None, 34.3, .45, src=np.tile(slow, 3)[:int(4.8 * SR)], fi=.3, fo=.5)
for t in (34.6, 35.5, 36.4, 37.3): put('coracao', t, .45)
# 39–47 lembranças
put('vento', 39.1, .3, dur=3, fo=1); put('fita_limpa', 39.1, .22, dur=3, fi=.5, fo=.6); put('riser', 44.0, .35)
# 47–49 câmera lenta
put(None, 47.0, .25, src=np.tile(slow, 2)[:int(5.8 * SR)], fi=.4, fo=.4)
for t in (47.4, 48.6, 50.0, 51.4): put('coracao', t, .4)
# 49–60 final A/B
put('impacto', 52.85, .8); put('whoosh', 53.4, .5); put('impacto', 57.57, .7)
put(None, 52.8, .3, src=np.tile(fast, 2)[:int(7.2 * SR)], fi=.3, fo=1.2)
# vozes (quando houver): soma e abaixa o resto sob a fala
if len(sys.argv) > 3:
    with wave.open(sys.argv[3]) as w: v = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32767
    v = v[:len(mix)]; e = np.convolve(np.abs(v), np.ones(int(.15 * SR)) / int(.15 * SR), 'same'); duck = 1 - .5 * np.clip(e * 12, 0, 1)
    mix[:len(v)] *= duck; mix[:len(v)] += v * 1.0
mix = mix / (np.max(np.abs(mix)) + 1e-9) * .85
with wave.open(out, 'w') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
print('ok', round(len(mix) / SR, 1))
