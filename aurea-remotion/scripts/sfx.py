import numpy as np, wave, sys, os
SR = 44100
out = sys.argv[1]
rng = np.random.default_rng(7)
def save(name, x):
    x = np.clip(x / (np.max(np.abs(x)) + 1e-9) * .9, -1, 1)
    with wave.open(os.path.join(out, name + '.wav'), 'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((x * 32767).astype(np.int16).tobytes())
def t(d): return np.arange(int(SR * d)) / SR
def env(n, a, r):
    e = np.ones(n); A = int(SR * a); R = int(SR * r)
    if A: e[:A] = np.linspace(0, 1, A)
    if R: e[-R:] *= np.linspace(1, 0, R) ** 2
    return e
def lp(x, k):  # passa-baixa simples (média móvel exponencial)
    y = np.zeros_like(x); a = k
    for i in range(1, len(x)): y[i] = y[i-1] + a * (x[i] - y[i-1])
    return y
def lp_fast(x, k): 
    from scipy.signal import lfilter
    return lfilter([k], [1, k - 1], x)
try:
    import scipy; LP = lp_fast
except Exception:
    LP = lp
noise = lambda d: rng.standard_normal(int(SR * d))
# rugido: ruído grave + oscilador descendo
T = t(2.2); f = np.linspace(110, 55, len(T)); ph = 2 * np.pi * np.cumsum(f) / SR
roar = (np.sign(np.sin(ph)) * .5 + LP(noise(2.2), .05) * 3) * (1 + .4 * np.sin(2 * np.pi * 9 * T)) * env(len(T), .15, 1.2)
save('rugido', roar)
# impacto grave
T = t(1.2); imp = np.sin(2 * np.pi * np.linspace(90, 35, len(T)) * T) * np.exp(-T * 4) + LP(noise(1.2), .2) * np.exp(-T * 18) * .8
save('impacto', imp)
# espadas
T = t(.9); clash = sum(np.sin(2 * np.pi * fr * T) * np.exp(-T * d) for fr, d in [(2210, 6), (3170, 8), (4630, 10), (5980, 12)]) + noise(.9) * np.exp(-T * 60) * .6
save('espada', clash)
# whoosh
T = t(.6); wh = noise(.6) * np.sin(np.pi * T / .6) ** 2; wh = LP(wh, .08) * 4
save('whoosh', wh)
# batimento cardíaco (um batimento duplo)
T = t(.8); hb = np.zeros(len(T))
for off, a in [(0, 1), (.22, .7)]:
    m = (T >= off); tt = T[m] - off; hb[m] += a * np.sin(2 * np.pi * 55 * tt) * np.exp(-tt * 18)
save('coracao', hb)
# moeda
T = t(.5); coin = (np.sin(2 * np.pi * 2637 * T) + .6 * np.sin(2 * np.pi * 3520 * T)) * np.exp(-T * 9)
save('moeda', coin)
# PIX / notificação: dois tons
T = t(.7); n1 = np.sin(2 * np.pi * 1318 * T) * np.exp(-T * 7) * (T < .25); n2 = np.sin(2 * np.pi * 1760 * T) * np.exp(-(T - .18).clip(0) * 6) * (T >= .18)
save('pix', n1 + n2)
# vibração do celular
T = t(1.0); vib = np.sign(np.sin(2 * np.pi * 160 * T)) * (np.sin(2 * np.pi * 3 * T) > -.2) * .5
save('vibra', LP(vib, .3))
# mensagem (ping grave)
T = t(.6); save('mensagem', np.sin(2 * np.pi * 880 * T) * np.exp(-T * 6) + .5 * np.sin(2 * np.pi * 660 * T) * np.exp(-T * 5))
# glitch
T = t(.8); gl = np.resize(np.repeat(rng.standard_normal(len(T) // 300 + 1), 300), len(T)) * (rng.random(len(T)) > .3)
save("glitch", gl * env(len(T), .01, .2))
# desmoronar (queda do dragão)
T = t(3.0); rum = LP(noise(3.0), .02) * 6 * env(len(T), .05, 2.0) + sum(np.sin(2 * np.pi * 40 * (T - o)) * np.exp(-(T - o).clip(0) * 5) * (T >= o) for o in [0, .4, .9, 1.5])
save('desmorona', rum)
# riser (subida antes do clarão)
T = t(2.0); save('riser', LP(noise(2.0), .1) * 3 * (T / 2) ** 2 + np.sin(2 * np.pi * np.cumsum(np.linspace(200, 1400, len(T))) / SR) * (T / 2) ** 3 * .5)
# brilho mágico (Mão Leve)
T = t(1.2); save('magia', sum(np.sin(2 * np.pi * f * T) * np.exp(-T * 3) for f in [1046, 1318, 1568, 2093]) * (1 + .5 * np.sin(2 * np.pi * 12 * T)))
# trilha de suspense (drone) — 100 s
T = t(100.0); base = 55
drone = sum(LP(np.sign(np.sin(2 * np.pi * base * m * (1 + dt) * T)), .02) for m, dt in [(1, 0), (1, .004), (1.5, -.003), (2, .002)])
pulse = (np.sin(2 * np.pi * .5 * T) * .5 + .5) ** 3
drone = drone * (.6 + .4 * pulse) + LP(noise(100.0), .01) * 2
save('trilha', drone)
print('ok')
