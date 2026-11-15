import math, random, subprocess, sys, json
from functools import lru_cache
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from nox import nox

W, H, FPS = 1080, 1920, 30
import os as _o
FB = _o.path.join(_o.path.dirname(_o.path.abspath(__file__)), 'fonts', 'Poppins-Bold.ttf')
GOLD = (255, 196, 40)
WHITE = (255, 255, 255)
_f = {}
def font(sz):
    if sz not in _f: _f[sz] = ImageFont.truetype(FB, sz)
    return _f[sz]

def clamp(x, a=0., b=1.): return max(a, min(b, x))
def ease(t): t = clamp(t); return t * t * (3 - 2 * t)
def eout(t): t = clamp(t); return 1 - (1 - t) ** 3
def lerp(a, b, t): return a + (b - a) * t

# ---------------- roteiro (falas exatas) e tempos ----------------
SCENES = [
    dict(min=7.0, hl=[('O ANO ACABA', WHITE), ('ANTES DO GIRO', GOLD)],
         caps=[('ESSE PLANETA', 0), ('TERMINA O *ANO*', 0), ('ANTES DE DAR UMA VOLTA', 0), ('EM TORNO DE SI MESMO.', 0),
               ('QUE PORRA', 0), ('DE *CALENDÁRIO* É ESSE?', 0)]),
    dict(min=6.5, hl=[('VOLTA AO SOL:', WHITE), ('225 DIAS', GOLD)],
         caps=[('É *VÊNUS*, CARA.', 0), ('PRA DAR UMA VOLTA NO SOL,', 0), ('ELE LEVA UNS *225*', 0), ('DIAS TERRESTRES.', 0),
               ('ATÉ AÍ, TRANQUILO.', 0)]),
    dict(min=9.0, hl=[('ROTAÇÃO:', WHITE), ('243 DIAS', GOLD)],
         caps=[('AGORA, PRA GIRAR', 0), ('EM TORNO DE SI?', 0), ('*243*.', .45), ('DUZENTOS E QUARENTA', 0), ('E TRÊS, CARALHO.', 0),
               ('O *ANO* ACABA', 0), ('E O DESGRAÇADO AINDA TÁ', 0), ('TERMINANDO O *GIRO*.', 0), ('SEM PRESSA NENHUMA.', .1)]),
    dict(min=8.5, hl=[('ENTRE DOIS NASCERES', WHITE), ('DO SOL: 117 DIAS', GOLD)],
         caps=[('SÓ NÃO MISTURA AS COISAS,', 0), ('QUE AÍ VIRA *BAGUNÇA*:', 0), ('DE UM NASCER DO SOL', 0), ('AO PRÓXIMO,', 0),
               ('SÃO UNS *117* DIAS.', 0), ('É *OUTRA* CONTA.', 0)]),
    dict(min=6.0, hl=None, end_hold=0.6,
         caps=[('*NOX* ACHOU', 0), ('ESSE CALENDÁRIO', 0), ('UMA *BAGUNÇA* DA PORRA.', 0), ('MAS PELO MENOS', .5),
               ('A EXPLICAÇÃO', 0), ('TÁ *EM DIA*.', 0), ('ACHOU MAIS ALGUMA MERDA', .45), ('SEM SENTIDO POR AÍ?', 0),
               ('MANDA NOS *COMENTÁRIOS*', 0), ('QUE *NOX* EXPLICA.', 0)]),
]
WPS = 2.9  # palavras por segundo (fala informal, sem acelerar)

def schedule():
    """monta os tempos das falas e ajusta cada cena à duração da fala"""
    out = []; t0 = 0.0
    for si, sc in enumerate(SCENES):
        t = t0 + 0.3
        for c, pause in sc['caps']:
            t += pause
            n = len(c.split())
            dur = max(0.7, n / WPS)
            out.append((t, t + dur, c, si))
            t += dur + (0.22 if c.rstrip().endswith(('.', ':', '?')) else 0.04)
        t1 = max(t0 + sc['min'], t + (sc.get('end_hold', 0.5)))
        sc['t0'], sc['t1'] = t0, t1
        t0 = t1
    return out, t0
def schedule_from_file(path):
    """usa os tempos reais da narração: lista [{start,end,text}] na mesma ordem das legendas"""
    real = json.load(open(path)); out = []; k = 0
    for si, sc in enumerate(SCENES):
        first = None
        for c, _ in sc['caps']:
            a, b = real[k]['start'], real[k]['end']; k += 1
            out.append((a, b, c, si)); first = a if first is None else first
        sc['_first'] = first
    for si, sc in enumerate(SCENES):
        sc['t0'] = 0.0 if si == 0 else max(0.0, sc['_first'] - 0.3)
    for si, sc in enumerate(SCENES):
        sc['t1'] = SCENES[si + 1]['t0'] if si + 1 < len(SCENES) else [c for c in out if c[3] == si][-1][1] + sc.get('end_hold', 1.0)
    return out, SCENES[-1]['t1']

import os
CAPS, TOTAL = schedule_from_file('falas_tempos.json') if os.path.exists('falas_tempos.json') else schedule()

# ---------------- elementos visuais ----------------
@lru_cache(None)
def background(kind):
    y, x = np.mgrid[:H, :W]
    cy = H * 0.42
    d = np.sqrt((x - W / 2) ** 2 + (y - cy) ** 2) / H
    inner = np.array([48, 24, 70]) if kind == 'ring' else np.array([30, 22, 54])
    t = np.clip(d / 0.75, 0, 1)[..., None]
    bg = inner * (1 - t) + np.array([6, 5, 12]) * t
    im = Image.fromarray(bg.astype('uint8')).convert('RGBA')
    # estrelas discretas
    dr = ImageDraw.Draw(im); r = random.Random(3 if kind == 'ring' else 7)
    for i in range(140):
        sx, sy, s = r.uniform(0, W), r.uniform(0, H), r.uniform(1, 2.6)
        dr.ellipse([sx - s, sy - s, sx + s, sy + s], fill=(255, 235, 200, int(r.uniform(40, 140))))
    return im

@lru_cache(None)
def ring(radius):
    S = int(radius * 2 + 400)
    L = Image.new('RGBA', (S, S), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
    c = S / 2
    d.ellipse([c - radius, c - radius, c + radius, c + radius], outline=GOLD + (230,), width=60)
    G = L.filter(ImageFilter.GaussianBlur(40))
    L2 = Image.new('RGBA', (S, S), (0, 0, 0, 0)); ImageDraw.Draw(L2).ellipse([c - radius, c - radius, c + radius, c + radius], outline=(255, 205, 70, 255), width=12)
    G.alpha_composite(L2.filter(ImageFilter.GaussianBlur(1.2)))
    return G

def particles(img, t, n=60, seed=1, cx=W / 2, cy=H * .42, rmin=380, rmax=620):
    d = ImageDraw.Draw(img); r = random.Random(seed)
    for i in range(n):
        a = r.uniform(0, 6.28) + t * r.uniform(-.05, .05); rr = r.uniform(rmin, rmax) + math.sin(t * .7 + i) * 8
        px, py = cx + math.cos(a) * rr, cy + math.sin(a) * rr * .95 - (t * r.uniform(4, 12)) % 40
        s = r.uniform(2, 5); al = int(r.uniform(90, 220) * (.6 + .4 * math.sin(t * 2 + i)))
        d.ellipse([px - s, py - s, px + s, py + s], fill=(255, 205, 100, max(0, al)))

def paste_nox(img, cx, top, scale, eye_open=1.0, arms='none', tilt=0.0, look=0):
    q = round(eye_open * 20) / 20
    spr = nox(q, arms, int(look))
    w, h = int(spr.width * scale), int(spr.height * scale)
    s2 = spr.resize((w, h), Image.LANCZOS)
    if abs(tilt) > 0.05:
        s2 = s2.rotate(tilt, resample=Image.BICUBIC, expand=True, center=(w / 2, h * .38))
    img.alpha_composite(s2, (int(cx - s2.width / 2), int(top - (s2.height - h) / 2)))

def sun(img, x, y, r, alpha=1.0):
    g = Image.new('RGBA', (int(r * 6), int(r * 6)), (0, 0, 0, 0)); d = ImageDraw.Draw(g)
    c = r * 3
    d.ellipse([c - r * 1.9, c - r * 1.9, c + r * 1.9, c + r * 1.9], fill=(255, 190, 60, int(120 * alpha)))
    g = g.filter(ImageFilter.GaussianBlur(r * .6))
    d = ImageDraw.Draw(g)
    d.ellipse([c - r, c - r, c + r, c + r], fill=(255, 214, 90, int(255 * alpha)))
    d.ellipse([c - r * .62, c - r * .62, c + r * .62, c + r * .62], fill=(255, 244, 200, int(255 * alpha)))
    img.alpha_composite(g, (int(x - c), int(y - c)))

@lru_cache(None)
def venus_tex(r):
    """textura de nuvens de Vênus (faixas amareladas) numa esfera"""
    y, x = np.mgrid[-r:r, -r:r].astype(float)
    rr = np.sqrt(x ** 2 + y ** 2) / r
    inside = rr <= 1
    z = np.sqrt(np.clip(1 - rr ** 2, 0, 1))
    shade = np.clip(0.35 + 0.75 * (-0.45 * x / r - 0.35 * y / r + 0.82 * z), 0, 1)
    band = 0.5 + 0.5 * np.sin(y / r * 9 + np.sin(x / r * 3) * 1.2)
    base = np.stack([228 - 30 * band, 186 - 34 * band, 112 - 40 * band], -1) * shade[..., None]
    a = (inside * 255).astype('uint8')
    im = np.dstack([np.clip(base, 0, 255).astype('uint8'), a])
    return Image.fromarray(im, 'RGBA')

def venus(img, x, y, r, rot=None, marker=True):
    tex = venus_tex(int(r))
    img.alpha_composite(tex, (int(x - r), int(y - r)))
    d = ImageDraw.Draw(img)
    if rot is not None and marker:
        # marca na superfície (faixa vertical), visível só na face da frente
        ph = (-rot) % (2 * math.pi)   # rotação retrógrada: marca anda da direita para a esquerda
        if math.cos(ph) > 0:
            mx = x + r * math.sin(ph) * .92
            wdt = max(6, 26 * math.cos(ph))
            hh = r * .55
            d.rounded_rectangle([mx - wdt / 2, y - hh, mx + wdt / 2, y + hh], radius=wdt / 2, fill=(196, 48, 40, 235))
    # brilho atmosférico
    g = Image.new('RGBA', (int(r * 3), int(r * 3)), (0, 0, 0, 0))
    ImageDraw.Draw(g).ellipse([r * .45, r * .45, r * 2.55, r * 2.55], outline=(255, 220, 160, 120), width=int(max(4, r * .08)))
    g = g.filter(ImageFilter.GaussianBlur(max(3, r * .06)))
    img.alpha_composite(g, (int(x - r * 1.5), int(y - r * 1.5)))

def arrow_head(d, x, y, ang, s, col):
    p = [(x + math.cos(ang) * s, y + math.sin(ang) * s),
         (x + math.cos(ang + 2.5) * s * .8, y + math.sin(ang + 2.5) * s * .8),
         (x + math.cos(ang - 2.5) * s * .8, y + math.sin(ang - 2.5) * s * .8)]
    d.polygon(p, fill=col)

# ---------------- textos ----------------
def draw_text_line(img, cx, y, parts, sz, alpha=1.0, stroke=6):
    """parts: [(texto, cor)] numa linha centralizada"""
    f = font(sz); sp = f.getlength(' ')
    widths = [f.getlength(t) for t, _ in parts]
    total = sum(widths) + sp * (len(parts) - 1)
    L = Image.new('RGBA', img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(L)
    x = cx - total / 2
    for (t, c), w in zip(parts, widths):
        d.text((x + 4, y + 6), t, font=f, fill=(0, 0, 0, int(140 * alpha)))
        d.text((x, y), t, font=f, fill=c + (int(255 * alpha),), stroke_width=stroke, stroke_fill=(12, 8, 18, int(255 * alpha)))
        x += w + sp
    img.alpha_composite(L)

def caption(img, text, alpha, pop, y=1660):
    words = text.split()
    parts = [(w.replace('*', ''), GOLD if w.startswith('*') else WHITE) for w in words]
    sz = int(64 * pop)
    f = font(sz)
    # quebra em no máximo 2 linhas
    lines = [parts]
    if f.getlength(' '.join(p[0] for p in parts)) > W - 160:
        best = None
        for k in range(1, len(parts)):
            a, b = parts[:k], parts[k:]
            m = max(f.getlength(' '.join(p[0] for p in a)), f.getlength(' '.join(p[0] for p in b)))
            if best is None or m < best[0]: best = (m, a, b)
        lines = [best[1], best[2]]
    lh = sz * 1.22
    y0 = y - lh * len(lines) / 2
    for i, ln in enumerate(lines):
        draw_text_line(img, W / 2, y0 + i * lh, ln, sz, alpha)

def headline(img, lines, t_in, t):
    a = clamp((t - t_in) / .35)
    if a <= 0: return
    dy = (1 - eout((t - t_in) / .45)) * 30
    for i, (s, c) in enumerate(lines):
        draw_text_line(img, W / 2, 210 + i * 92 + dy, [(s, c)], 76, a, 7)

# ---------------- cenas ----------------
def scene1(img, t, u):
    img.alpha_composite(background('ring'))
    rg = ring(470); img.alpha_composite(rg, (int(W / 2 - rg.width / 2), int(1000 - rg.height / 2)))
    particles(img, t, 70, 1, cy=1000, rmin=440, rmax=700)
    q = [c for c in CAPS if c[3] == 0][4][0]  # início de "QUE PORRA"
    tilt = 5 * ease((t - 1.0) / 1.2)
    eo = lerp(1.0, .6, ease((t - 1.4) / .8))
    paste_nox(img, W / 2, 560, 1.25, eo, 'raise' if t >= q - .15 else 'none', tilt)
    headline(img, SCENES[0]['hl'], 1.0, t)

def orbit_pt(a, cx=W / 2, cy=930, rx=330, ry=150):
    return cx + math.cos(a) * rx, cy + math.sin(a) * ry

def scene2(img, t, u):
    img.alpha_composite(background('plain'))
    d = ImageDraw.Draw(img)
    cx, cy, rx, ry = W / 2 + 70, 900, 400, 185
    dur = SCENES[1]['t1'] - SCENES[1]['t0']
    prog = clamp((t - .4) / max(1, dur - 1.0))           # 0..1 = uma volta completa no Sol
    a0 = -math.pi / 2
    a = a0 - prog * 2 * math.pi                          # sentido anti-horário (visto do norte)
    # órbita tracejada + trecho já percorrido em dourado
    pts = [orbit_pt(x, cx, cy, rx, ry) for x in np.linspace(0, 2 * math.pi, 160)]
    for k in range(0, 159, 3):
        d.line([pts[k], pts[k + 1]], fill=(255, 220, 150, 120), width=5)
    trail = [orbit_pt(x, cx, cy, rx, ry) for x in np.linspace(a0, a, max(2, int(160 * prog)))]
    if len(trail) > 1: d.line(trail, fill=GOLD + (230,), width=9, joint='curve')
    vx, vy = orbit_pt(a, cx, cy, rx, ry)
    if math.sin(a) < 0: venus(img, vx, vy, 52)
    sun(img, cx, cy, 92)
    if math.sin(a) >= 0: venus(img, vx, vy, 52)
    # contador de dias acompanhando Vênus
    days = int(round(225 * prog))
    draw_text_line(img, vx, vy - 120 if vy < cy else vy + 70, [(f'DIA {days}', GOLD if days >= 225 else WHITE)], 46, 1.0, 5)
    paste_nox(img, 220, 1205, .6, 1.0, 'point' if t > .6 else 'none', -3 * ease(t / 3))
    headline(img, SCENES[1]['hl'], 1.2, t)

def bar(img, x0, y, w, frac, label, col, done_txt=None):
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([x0, y, x0 + w, y + 46], radius=23, fill=(255, 255, 255, 40))
    if frac > 0: d.rounded_rectangle([x0, y, x0 + max(46, w * frac), y + 46], radius=23, fill=col + (255,))
    draw_text_line(img, x0 + w / 2, y - 62, [(label, WHITE)], 40, 1.0, 5)
    if done_txt: draw_text_line(img, x0 + w / 2, y + 60, [(done_txt, GOLD)], 38, 1.0, 5)

def scene3(img, t, u):
    img.alpha_composite(background('plain'))
    vx, vy, r = W / 2 + 120, 800, 230
    d = ImageDraw.Draw(img)
    d.line([(vx, vy - r - 80), (vx, vy + r + 80)], fill=(255, 240, 220, 140), width=5)
    rot = t * 0.9
    venus(img, vx, vy, r, rot=rot)
    d = ImageDraw.Draw(img)
    pts = [(vx + math.cos(a) * (r + 40), vy + math.sin(a) * 34) for a in np.linspace(.15, math.pi - .15, 40)]
    d.line(pts, fill=(255, 220, 150, 220), width=7)
    arrow_head(d, pts[-1][0], pts[-1][1], math.pi * .92, 24, (255, 220, 150, 240))
    # comparação: o ano (225) termina antes do giro (243)
    dur = SCENES[2]['t1'] - SCENES[2]['t0']
    k = clamp((t - 1.0) / max(1, dur * .55))
    dias = 243 * k
    ano = min(1, dias / 225); giro = dias / 243
    bx, bw = 450, 560
    bar(img, bx, 1235, bw, ano, 'ANO · 225 DIAS', GOLD, 'O ANO ACABOU!' if ano >= 1 else None)
    bar(img, bx, 1470, bw, giro, f'GIRO · {int(dias)}/243', (235, 235, 245), None)
    lt = [c for c in CAPS if c[3] == 2][-1][0] - SCENES[2]['t0']
    if t < lt - .3:
        paste_nox(img, 220, 1205, .6, 1.0, 'point', 0, 10)
    else:
        paste_nox(img, 220, 1205, .6, .55, 'none', -4 * ease((t - lt + .3) / .4), 0)
    headline(img, SCENES[2]['hl'], 1.4, t)

def scene4(img, t, u):
    img.alpha_composite(background('plain'))
    x0, x1, hy = 150, 930, 980
    BW, BH = x1 - x0, 520
    cyc = clamp((t - 1.0) / ((SCENES[3]['t1'] - SCENES[3]['t0']) - 1.6))
    # cor do céu: amanhecer -> dia -> entardecer -> noite -> amanhecer
    keys = [(0, (255, 150, 90)), (.12, (240, 190, 120)), (.25, (230, 200, 140)), (.42, (240, 130, 80)), (.52, (40, 30, 70)), (.9, (18, 16, 40)), (1, (255, 150, 90))]
    for (a, ca), (b, cb) in zip(keys, keys[1:]):
        if a <= cyc <= b:
            f = (cyc - a) / (b - a); col = tuple(int(lerp(ca[i], cb[i], f)) for i in range(3)); break
    sky = Image.new('RGBA', (BW, BH), (0, 0, 0, 0))
    grad = np.zeros((BH, BW, 4), np.uint8)
    top = np.array(col) * .55; bot = np.array(col)
    for yy in range(BH):
        grad[yy, :, :3] = (top * (1 - yy / BH) + bot * (yy / BH)).astype(np.uint8)
    grad[..., 3] = 255
    sky = Image.fromarray(grad, 'RGBA')
    mask = Image.new('L', (BW, BH), 0); ImageDraw.Draw(mask).rounded_rectangle([0, 0, BW, BH], radius=36, fill=255)
    sd = ImageDraw.Draw(sky)
    night = clamp((cyc - .5) / .08) * (1 - clamp((cyc - .92) / .08))
    if night > 0:
        rr = random.Random(9)
        for _ in range(60):
            sx, sy = rr.uniform(10, BW - 10), rr.uniform(10, BH * .7); ss = rr.uniform(1.5, 3.5)
            sd.ellipse([sx - ss, sy - ss, sx + ss, sy + ss], fill=(255, 245, 220, int(200 * night)))
    # rastro do Sol no céu
    if cyc < .5:
        p = cyc / .5
        tr = [(lerp(70, BW - 70, q), BH - 60 - math.sin(q * math.pi) * 320) for q in np.linspace(0, p, 40)]
        if len(tr) > 1: sd.line(tr, fill=(255, 230, 160, 110), width=6)
    # morros no horizonte
    sd.polygon([(0, BH - 70), (120, BH - 150), (250, BH - 95), (420, BH - 180), (600, BH - 100), (BW, BH - 160), (BW, BH), (0, BH)], fill=(110, 74, 50, 255))
    img.paste(sky, (x0, hy - BH + 40), mask)
    if cyc < .5:
        p = cyc / .5
        sun(img, x0 + lerp(70, BW - 70, p), hy + 40 - 60 - math.sin(p * math.pi) * 320, 46)
    elif cyc >= .985:
        sun(img, x0 + 70, hy - 20, 46)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([x0, hy - 10, x1, hy + 50], radius=20, fill=(150, 104, 58, 255))
    # linha do tempo 0 -> 117 dias, com rótulos
    ty = hy + 130
    d.line([(x0 + 20, ty), (x1 - 20, ty)], fill=(255, 255, 255, 120), width=6)
    px = lerp(x0 + 20, x1 - 20, cyc)
    d.line([(x0 + 20, ty), (px, ty)], fill=GOLD + (255,), width=10)
    for xx in (x0 + 20, x1 - 20):
        d.ellipse([xx - 14, ty - 14, xx + 14, ty + 14], fill=GOLD + (255,))
    draw_text_line(img, x0 + 70, ty + 34, [('NASCE', WHITE)], 32, 1.0, 4)
    draw_text_line(img, x1 - 130, ty + 34, [('NASCE DE NOVO', WHITE)], 32, 1.0, 4)
    days = int(round(117 * cyc))
    draw_text_line(img, px, ty - 80, [(f'{days} DIAS', GOLD if days >= 117 else WHITE)], 46, 1.0, 5)
    raise_t = ease((t - .4) / .6)
    paste_nox(img, 210, lerp(1235, 1205, raise_t), .6, 1.0, 'raise' if t > .4 else 'none', 0)
    headline(img, SCENES[3]['hl'], 1.0, t)

def scene5(img, t, u):
    img.alpha_composite(background('ring'))
    rg = ring(470); a = ease(t / .8)
    rr = rg.copy(); rr.putalpha(rr.getchannel('A').point(lambda v: int(v * a)))
    img.alpha_composite(rr, (int(W / 2 - rg.width / 2), int(1000 - rg.height / 2)))
    particles(img, t, 60, 5, cy=1000, rmin=440, rmax=700)
    eo = lerp(.8, .5, ease((t - 2.0) / 1.0))
    paste_nox(img, W / 2, 560, 1.25, eo, 'cross', -2 * ease((t - 3) / 1))
    end = [c for c in CAPS if c[3] == 4][-1][0] - SCENES[4]['t0']   # quando ele fala "que Nox explica"
    if t > end:
        draw_text_line(img, W / 2, 200, [('NOX', GOLD), ('EXPLICA', WHITE)], 96, clamp((t - end) / .3), 8)
        draw_text_line(img, W / 2, 330, [('MANDA SUA DÚVIDA', WHITE)], 50, clamp((t - end - .4) / .3), 6)

FUNCS = [scene1, scene2, scene3, scene4, scene5]

def frame(T):
    si = max(i for i, s in enumerate(SCENES) if s['t0'] <= T + 1e-6)
    sc = SCENES[si]; t = T - sc['t0']; u = t / (sc['t1'] - sc['t0'])
    img = Image.new('RGBA', (W, H), (0, 0, 0, 255))
    FUNCS[si](img, t, u)
    # câmera: aproximação lenta e contínua
    z = 1 + 0.06 * ease(u) if si in (0, 4) else 1 + 0.035 * u
    if z > 1.001:
        cw, ch = W / z, H / z; x0 = (W - cw) / 2; y0 = (H * .5) - ch * .5
        img = img.resize((W, H), Image.BICUBIC, box=(x0, y0, x0 + cw, y0 + ch))
    # legenda (fora do zoom)
    for (a, b, c, s) in CAPS:
        if a <= T < b + (0.15 if s == 4 else 0):
            lt = T - a
            caption(img, c, clamp(lt / .1), 1 + .06 * (1 - eout(lt / .18)))
    # vinheta
    return img.convert('RGB')

if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == 'test':
        ts = [float(x) for x in sys.argv[2].split(',')]
        ims = [frame(t) for t in ts]
        sheet = Image.new('RGB', (360 * len(ims), 640))
        for i, im in enumerate(ims): sheet.paste(im.resize((360, 640)), (i * 360, 0))
        sheet.save('test.jpg'); sys.exit()
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                          '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-pix_fmt', 'yuv420p', 'nox_video.mp4'], stdin=subprocess.PIPE)
    n = int(TOTAL * FPS)
    for i in range(n):
        p.stdin.write(frame(i / FPS).tobytes())
    p.stdin.close(); p.wait()
    json.dump([dict(start=a, end=b, text=c.replace('*', '')) for a, b, c, s in CAPS], open('caps.json', 'w'), ensure_ascii=False, indent=1)
