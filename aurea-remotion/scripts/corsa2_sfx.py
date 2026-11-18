"""Sons novos do Ep2 -> sfx/: pato (escape), plastico, moto. uso: python3 scripts/corsa2_sfx.py sfx"""
import numpy as np, wave, sys, os
from scipy.signal import butter, lfilter
SR = 44100; out = sys.argv[1]; rng = np.random.default_rng(9)
def save(n, x, norm=.9):
    x = x / (np.max(np.abs(x)) + 1e-9) * norm
    with wave.open(os.path.join(out, n + '.wav'), 'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())
T = lambda d: np.arange(int(SR * d)) / SR
def bp(x, lo, hi): b, a = butter(2, [lo / (SR / 2), hi / (SR / 2)], 'band'); return lfilter(b, a, x)
def lp(x, f): b, a = butter(2, f / (SR / 2)); return lfilter(b, a, x)
# "FÓÓÓN": buzina fina e anasalada, com tremido
t = T(2.6); f = 520 + 40 * np.sin(2 * np.pi * 7 * t) + 30 * np.sin(2 * np.pi * 2.3 * t); ph = 2 * np.pi * np.cumsum(f) / SR
x = (2 * (ph / (2 * np.pi) % 1) - 1) + .5 * np.sign(np.sin(ph * 2))
x = bp(x, 700, 3200) * 2 + bp(x, 1800, 2600)
env = np.clip(t / .05, 0, 1) * np.clip((2.6 - t) / .3, 0, 1) * (1 + .25 * np.sin(2 * np.pi * 11 * t))
save('pato', x * env, .8)
# plástico amassando
t = T(1.3); x = np.zeros(len(t))
for c in rng.integers(0, len(t) - 800, 160): x[c:c + 600] += rng.standard_normal(600) * np.exp(-np.arange(600) / 90) * rng.uniform(.3, 1)
save('plastico', bp(x, 1500, 9000), .6)
# moto passando (efeito doppler)
t = T(2.2); f = np.where(t < 1.1, 95, 70) * (1 + .03 * np.sin(2 * np.pi * 30 * t)); f = lp(f, 3); ph = 2 * np.pi * np.cumsum(f) / SR
x = (2 * (ph / (2 * np.pi) % 1) - 1) + .6 * np.sign(np.sin(ph * 2)) + lp(rng.standard_normal(len(t)), 600)
env = np.exp(-((t - 1.1) / .55) ** 2)
save('moto', lp(x, 2500) * env, .8)
print('ok')
