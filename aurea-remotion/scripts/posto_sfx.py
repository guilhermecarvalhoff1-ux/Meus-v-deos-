"""Efeitos sintetizados do Ep1 'O Posto' -> sfx/*.wav. uso: python3 scripts/posto_sfx.py sfx"""
import numpy as np, wave, sys, os
from scipy.signal import butter, lfilter
SR = 44100; out = sys.argv[1]; rng = np.random.default_rng(3)
def save(n, x, norm=.9):
    x = x / (np.max(np.abs(x)) + 1e-9) * norm
    with wave.open(os.path.join(out, n + '.wav'), 'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(x, -1, 1) * 32767).astype(np.int16).tobytes())
T = lambda d: np.arange(int(SR * d)) / SR
def env(n, a, r): e = np.ones(n); A, R = int(SR * a), int(SR * r); e[:A] = np.linspace(0, 1, A) if A else 1; e[n - R:] *= np.linspace(1, 0, R) if R else 1; return e
def bp(x, lo, hi): b, a = butter(2, [lo / (SR / 2), hi / (SR / 2)], 'band'); return lfilter(b, a, x)
def lp(x, f): b, a = butter(2, f / (SR / 2)); return lfilter(b, a, x)
def hp(x, f): b, a = butter(2, f / (SR / 2), 'high'); return lfilter(b, a, x)
noise = lambda d: rng.standard_normal(int(SR * d))
# bip de alerta (dois toques)
t = T(.5); b = np.sin(2 * np.pi * 2000 * t) * ((t < .1) | ((t > .18) & (t < .28))); save('bip', b * env(len(t), .002, .02), .6)
# rádio chiando com estalos
x = bp(noise(2.2), 800, 5000) * (.6 + .4 * np.sin(2 * np.pi * 7 * T(2.2))); x[rng.integers(0, len(x), 40)] += 3; save('chiado', x * env(len(x), .05, .2), .7)
# música antiga (fita e limpa): melodia em quadrada + baixo, 120 bpm
def tune(dur, tape):
    t = T(dur); y = np.zeros(len(t)); beat = .5
    mel = [64, 67, 69, 67, 64, 62, 60, 62, 64, 67, 72, 71, 69, 67, 64, 67]; bas = [48, 48, 45, 45, 41, 41, 43, 43]
    wow = 1 + (.006 * np.sin(2 * np.pi * .8 * t) if tape else 0)
    for i in range(int(dur / beat)):
        s, n = int(i * beat * SR), int(beat * SR * .9); tt = np.arange(n) / SR
        f = 440 * 2 ** ((mel[i % 16] - 69) / 12); ph = 2 * np.pi * f * np.cumsum(wow[s:s + n] if tape else np.ones(n)) / SR
        y[s:s + n] += np.sign(np.sin(ph)) * .25 * np.exp(-tt * 3)
        fb = 440 * 2 ** ((bas[(i // 2) % 8] - 69) / 12); y[s:s + n] += np.sin(2 * np.pi * fb * tt) * .5 * np.exp(-tt * 2)
        if i % 2 == 0: y[s:s + 2000] += noise(2000 / SR) * .2 * np.exp(-np.arange(2000) / 300)
    return lp(bp(y, 300, 2500) + noise(dur) * .03, 2400) if tape else lp(y, 6000)
save('fita_radio', tune(16, True), .7); save('fita_limpa', tune(16, False), .7)
# grave dos carros (batida abafada)
t = T(8); y = np.zeros(len(t))
for i in range(int(8 / .25)):
    s = int(i * .25 * SR); tt = np.arange(int(.25 * SR)) / SR
    if i % 4 in (0, 3): y[s:s + len(tt)] += np.sin(2 * np.pi * (50 + 80 * np.exp(-tt * 30)) * tt) * np.exp(-tt * 6)
    if i % 4 == 2: y[s:s + len(tt)] += bp(noise(.25), 200, 1200) * .5 * np.exp(-tt * 18)
save('grave', lp(y, 400), .9)
# disco arranhando
t = T(.6); f = 900 * np.exp(-t * 5) + 120; x = np.sin(2 * np.pi * np.cumsum(f) / SR) * .5 + bp(noise(.6), 500, 4000) * np.sin(2 * np.pi * 9 * t) ** 2; save('arranhao', x * env(len(t), .005, .1), .8)
# grilo
t = T(3); c = np.sin(2 * np.pi * 4400 * t) * (np.sin(2 * np.pi * 30 * t) > 0) * ((t % .7) < .2); save('grilo', c * env(len(t), .05, .3), .4)
# plec (plástico batendo no chão)
t = T(.35); x = hp(noise(.35), 1500) * np.exp(-t * 60) + np.sin(2 * np.pi * 1700 * t) * np.exp(-t * 40) * .6 + np.sin(2 * np.pi * 900 * t) * np.exp(-t * 25) * .3 * (t > .12); save('plec', x, .9)
# arranque engasgando (rr-rr-rr que não pega)
def starter(d):
    t = T(d); m = (np.sin(2 * np.pi * 8 * t) > -.2).astype(float); m = lp(m, 40)
    return (lp(noise(d), 600) * 2 + np.sign(np.sin(2 * np.pi * 160 * t)) * .3) * m
x = starter(1.3) * env(int(SR * 1.3), .02, .25); save('arranque_falha', x, .8)
# motor pegando
t = T(3.2); f = 38 + 14 * np.clip((t - .9) / .6, 0, 1); ph = 2 * np.pi * np.cumsum(f) / SR
eng = (np.sign(np.sin(ph)) * .5 + np.sin(2 * ph) * .4 + lp(noise(3.2), 300) * 1.5) * (t > .9) * (1 + .5 * np.exp(-(t - 1) * 3) * (t > .9))
x = np.concatenate([starter(.9), np.zeros(len(t) - int(SR * .9))]) + lp(eng, 900) * 1.2; save('motor_pega', x * env(len(t), .01, .4), .85)
# motor em marcha lenta (fundo)
t = T(6); ph = 2 * np.pi * 34 * t; save('marcha_lenta', lp(np.sign(np.sin(ph)) * .4 + lp(noise(6), 200) * 2, 300), .6)
# tosse
t = T(.5); x = bp(noise(.5), 300, 1800) * (np.exp(-t * 18) + np.exp(-np.clip(t - .22, 0, None) * 18) * (t > .22)); save('tosse', x, .7)
# trombone triste (cômico)
y = []
for i, (n, d) in enumerate([(58, .45), (57, .45), (56, .45), (55, 1.3)]):
    t = T(d); f = 440 * 2 ** ((n - 69) / 12) * (1 + (.03 * np.sin(2 * np.pi * 6 * t) if i == 3 else 0)); ph = 2 * np.pi * np.cumsum(f) / SR
    y.append(lp(2 * (ph / (2 * np.pi) % 1) - 1, 1800) * env(len(t), .03, .12))
save('trombone', np.concatenate(y), .7)
# vento
t = T(7); save('vento', lp(noise(7), 700) * (.5 + .5 * np.sin(2 * np.pi * .2 * t)) * env(len(t), 1, 1.5), .6)
# teclas do celular
t = T(.06); save('tecla', hp(noise(.06), 2500) * np.exp(-t * 120), .5)
print('ok')
