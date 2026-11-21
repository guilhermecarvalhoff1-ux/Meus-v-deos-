import math, random, subprocess, sys, json
from functools import lru_cache
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from nox import nox

W, H, FPS = 1080, 1920, 30
import os as _o
FB = _o.path.join(_o.path.dirname(_o.path.abspath(__file__)), '..', '..', 'fonts', 'Poppins-Bold.ttf')
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
RED = (235, 80, 80)
GREEN = (90, 210, 130)
SCENES = [
    dict(min=5.0, hl=[('13 ANOS', GOLD), ('DE ESPERA', WHITE)],
         caps=[('O BRASILEIRO ESPEROU', 0), ('*TREZE *ANOS...', 0), ('E VAI PAGAR QUASE', 0), ('*QUINHENTOS *CONTO', 0), ('PRA OUVIR A *ANITTA', 0), ('DENTRO DO *GTA*.', 0), ('O NOX EXPLICA.', 0)]),
    dict(min=4.0, hl=[('GTA 6 SAIU', WHITE), ('QUINTA · 19/11', GOLD)],
         caps=[('O *GTA *6 SAIU', 0), ('NESSA *QUINTA*.', 0), ('NO ÚLTIMO GTA,', 0), ('VOCÊ AINDA TINHA *ORKUT*.', 0)]),
    dict(min=5.0, hl=[('US$ 1,5 BILHÃO', GOLD), ('EM PRÉ-VENDA', WHITE)],
         caps=[('ANTES DE SAIR,', 0), ('JÁ TINHA FEITO', 0), ('MAIS DE *UM *BILHÃO', 0), ('E MEIO DE DÓLARES', 0), ('EM *PRÉ-VENDA*.', 0), ('O NOX RESPEITA A *FÉ*.', 0)]),
    dict(min=5.0, hl=[('R$ 449,90', GOLD), ('NO BRASIL', WHITE)],
         caps=[('AQUI ELE CHEGOU', 0), ('POR *R$ *449,90.', 0), ('É O *JOGO', 0), ('OU A *FEIRA DO MÊS.', 0), ('O POVO ESCOLHEU', 0), ('O *JOGO*.', 0)]),
    dict(min=6.0, hl=[('ANITTA NO GTA 6', GOLD)],
         caps=[('E A *ANITTA', 0), ('TÁ NO JOGO:', 0), ('É A *DRA. *NITA,', 0), ('DE UM *PODCAST*,', 0), ('E TEM MÚSICA NA TRILHA,', 0), ('JUNTO COM *TRAVIS *SCOTT,', 0), ('*DUA *LIPA', 0), ('E *SEPULTURA*.', 0)]),
    dict(min=5.0, hl=[('VICE CITY + ANITTA', WHITE), ('= BRASIL', GOLD)],
         caps=[('OU SEJA:', 0), ('VOCÊ ROUBA UM CARRO', 0), ('EM *VICE *CITY', 0), ('OUVINDO *ANITTA*.', 0), ('A ROCKSTAR LEVOU', 0), ('*TREZE *ANOS...', 0), ('E ENTREGOU O *BRASIL*.', 0)]),
    dict(min=4.0, hl=None, end_hold=0.8,
         caps=[('VAI COMPRAR', 0), ('OU ESPERAR BAIXAR?', 0), ('*COMENTA AÍ', 0), ('QUE O *NOX EXPLICA.', 0)]),
]
WPS = 3.0  # palavras por segundo (fala informal, sem acelerar)

def schedule():
    """monta os tempos das falas e ajusta cada cena à duração da fala"""
    out = []; t0 = 0.0
    for si, sc in enumerate(SCENES):
        t = t0 + 0.3
        for c, pause in sc['caps']:
            t += pause
            n = len(c.split())
            dur = max(0.55, n / WPS)
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
def caps_of(si): return [c for c in CAPS if c[3] == si]
def ctimes(si): T0 = SCENES[si]['t0']; return [c[0] - T0 for c in caps_of(si)]
STONE = (214, 186, 132); STONE_D = (166, 138, 92); PURP = (52, 42, 84)

def layer(img, fn, a):
    """desenha fn(d, al) numa camada e compõe com transparência a"""
    if a <= 0: return
    L = Image.new('RGBA', img.size, (0, 0, 0, 0)); fn(ImageDraw.Draw(L), int(255 * a)); img.alpha_composite(L)

def fonte(img, a=1.0):
    draw_text_line(img, 300, 1860, [('Fonte: Sensor Tower / imprensa', (170, 160, 200))], 26, a * .9, 3)

def card(img, x, y, w, h, col, a):
    layer(img, lambda d, al: d.rounded_rectangle([x - w / 2, y - h / 2, x + w / 2, y + h / 2], radius=28, fill=(30, 24, 54, int(230 * a)), outline=col + (al,), width=6), a)

def calendario(img, x, y, s, a):
    def f(d, al):
        d.rounded_rectangle([x - 130 * s, y - 120 * s, x + 130 * s, y + 140 * s], radius=int(24 * s), fill=(244, 244, 248, al))
        d.rounded_rectangle([x - 130 * s, y - 120 * s, x + 130 * s, y - 40 * s], radius=int(24 * s), fill=(220, 60, 60, al))
        d.rectangle([x - 130 * s, y - 64 * s, x + 130 * s, y - 40 * s], fill=(220, 60, 60, al))
    layer(img, f, a)
    draw_text_line(img, x, y - 112 * s, [('QUINTA', WHITE)], int(40 * s), a, 4)
    draw_text_line(img, x, y - 30 * s, [('19', (40, 30, 50))], int(120 * s), a, 0)
    draw_text_line(img, x, y + 100 * s, [('NOV', (90, 80, 110))], int(34 * s), a, 0)

def pc_velho(img, x, y, s, a):
    def f(d, al):
        d.rounded_rectangle([x - 150 * s, y - 130 * s, x + 150 * s, y + 100 * s], radius=int(16 * s), fill=(206, 200, 180, al))
        d.rectangle([x - 120 * s, y - 104 * s, x + 120 * s, y + 70 * s], fill=(70, 120, 200, al))
        for k in range(4): d.rounded_rectangle([x - 100 * s, y - 84 * s + k * 38 * s, x + (40 - k * 20) * s, y - 60 * s + k * 38 * s], radius=6, fill=(200, 220, 255, al))
        d.polygon([(x - 40 * s, y + 100 * s), (x + 40 * s, y + 100 * s), (x + 70 * s, y + 140 * s), (x - 70 * s, y + 140 * s)], fill=(186, 180, 160, al))
    layer(img, f, a)
    draw_text_line(img, x, y + 150 * s, [('2013', GOLD)], int(46 * s), a, 5)

def caixa_vazia(img, x, y, s, a, t):
    def f(d, al):
        d.polygon([(x - 140 * s, y - 60 * s), (x + 140 * s, y - 60 * s), (x + 120 * s, y + 140 * s), (x - 120 * s, y + 140 * s)], fill=(168, 118, 62, al))
        d.polygon([(x - 140 * s, y - 60 * s), (x - 190 * s, y - 130 * s), (x - 20 * s, y - 130 * s), (x, y - 60 * s)], fill=(196, 142, 80, al))
        d.polygon([(x + 140 * s, y - 60 * s), (x + 190 * s, y - 130 * s), (x + 20 * s, y - 130 * s), (x, y - 60 * s)], fill=(196, 142, 80, al))
    layer(img, f, a)
    draw_text_line(img, x, y - 30 * s + 6 * math.sin(t * 3), [('?', WHITE)], int(130 * s), a, 6)

def balanca(img, cx, cy, ang, a):
    """balança: jogo (esquerda) × feira (direita); ang>0 = lado do jogo mais pesado"""
    def f(d, al):
        d.polygon([(cx - 40, cy + 380), (cx + 40, cy + 380), (cx + 12, cy), (cx - 12, cy)], fill=(200, 180, 120, al))
        dx, dy = 300 * math.cos(math.radians(ang)), 300 * math.sin(math.radians(ang))
        d.line([(cx - dx, cy + dy), (cx + dx, cy - dy)], fill=(220, 200, 140, al), width=12)
        for sx, sy in [(cx - dx, cy + dy), (cx + dx, cy - dy)]:
            d.line([(sx, sy), (sx - 90, sy + 160)], fill=(220, 200, 140, al), width=4); d.line([(sx, sy), (sx + 90, sy + 160)], fill=(220, 200, 140, al), width=4)
            d.ellipse([sx - 120, sy + 150, sx + 120, sy + 190], fill=(220, 200, 140, al))
        gx, gy = cx - dx, cy + dy + 150
        d.rounded_rectangle([gx - 60, gy - 150, gx + 60, gy], radius=10, fill=(30, 30, 40, al), outline=(255, 120, 200, al), width=6)
        d.rectangle([gx - 50, gy - 140, gx + 50, gy - 60], fill=(255, 90, 160, al))
        fx, fy = cx + dx, cy - dy + 150
        d.rectangle([fx - 80, fy - 90, fx + 80, fy - 10], outline=(200, 200, 210, al), width=8)
        for k in range(4): d.line([(fx - 80 + k * 50, fy - 90), (fx - 80 + k * 50, fy - 10)], fill=(200, 200, 210, al), width=4)
        d.ellipse([fx - 60, fy - 14, fx - 34, fy + 12], fill=(200, 200, 210, al)); d.ellipse([fx + 34, fy - 14, fx + 60, fy + 12], fill=(200, 200, 210, al))
        for k, col in enumerate([(90, 200, 90), (230, 90, 60), (250, 200, 60)]): d.ellipse([fx - 60 + k * 40, fy - 130, fx - 20 + k * 40, fy - 90], fill=col + (al,))
    layer(img, f, a)

def nota(img, x, y, s, a):
    def f(d, al):
        d.ellipse([x - 22 * s, y + 10 * s, x + 14 * s, y + 38 * s], fill=GOLD + (al,))
        d.rectangle([x + 8 * s, y - 50 * s, x + 14 * s, y + 24 * s], fill=GOLD + (al,))
        d.polygon([(x + 14 * s, y - 50 * s), (x + 44 * s, y - 30 * s), (x + 14 * s, y - 26 * s)], fill=GOLD + (al,))
    layer(img, f, a)

def microfone(img, x, y, s, a, t):
    def f(d, al):
        d.rounded_rectangle([x - 60 * s, y - 200 * s, x + 60 * s, y], radius=int(60 * s), fill=(60, 60, 70, al))
        for k in range(5): d.line([(x - 50 * s, y - 170 * s + k * 30 * s), (x + 50 * s, y - 170 * s + k * 30 * s)], fill=(100, 100, 115, al), width=max(1, int(4 * s)))
        d.arc([x - 100 * s, y - 120 * s, x + 100 * s, y + 60 * s], 0, 180, fill=(200, 200, 210, al), width=max(2, int(10 * s)))
        d.line([(x, y + 60 * s), (x, y + 160 * s)], fill=(200, 200, 210, al), width=max(2, int(10 * s)))
        d.rectangle([x - 80 * s, y + 160 * s, x + 80 * s, y + 175 * s], fill=(200, 200, 210, al))
    layer(img, f, a)
    for k in range(3):
        q = (t * .6 + k / 3) % 1
        nota(img, x + 150 * s + 40 * math.sin(t * 2 + k), y - 120 * s - q * 260 * s, s, a * (1 - q))

def chip(img, x, y, txt, a):
    f = font(40); w = f.getlength(txt) + 60
    layer(img, lambda d, al: d.rounded_rectangle([x - w / 2, y - 40, x + w / 2, y + 40], radius=40, fill=(60, 44, 20, int(235 * a)), outline=GOLD + (al,), width=5), a)
    draw_text_line(img, x, y - 26, [(txt, WHITE)], 40, a, 4)

def vice(img, t, a):
    """pôr do sol neon, palmeiras e um carro passando"""
    def f(d, al):
        for k in range(20):
            col = (int(lerp(255, 120, k / 19)), int(lerp(120, 40, k / 19)), int(lerp(170, 160, k / 19)))
            d.rectangle([0, 420 + k * 30, W, 450 + k * 30], fill=col + (al,))
        d.ellipse([340, 560, 740, 960], fill=(255, 200, 90, al))
        for k in range(6): d.rectangle([340, 800 + k * 26, 740, 812 + k * 26], fill=(255, 120, 170, al))
        d.rectangle([0, 1000, W, 1300], fill=(40, 20, 60, al))
        for k in range(8):
            yy = 1000 + (k ** 1.6) * 6
            d.line([(0, yy), (W, yy)], fill=(255, 80, 200, int(al * .6)), width=2)
        for px in (130, 950):
            d.line([(px, 1000), (px + 20, 640)], fill=(20, 10, 30, al), width=22)
            for ang in range(0, 360, 60):
                d.line([(px + 20, 640), (px + 20 + 130 * math.cos(math.radians(ang)), 640 + 60 * math.sin(math.radians(ang)) + 30)], fill=(20, 10, 30, al), width=18)
        cx = lerp(-300, 1300, (t * .25) % 1)
        d.rounded_rectangle([cx - 170, 1080, cx + 170, 1150], radius=24, fill=(255, 60, 140, al))
        d.polygon([(cx - 90, 1080), (cx - 50, 1030), (cx + 70, 1030), (cx + 110, 1080)], fill=(255, 90, 170, al))
        d.ellipse([cx - 130, 1120, cx - 70, 1180], fill=(20, 10, 30, al)); d.ellipse([cx + 70, 1120, cx + 130, 1180], fill=(20, 10, 30, al))
    layer(img, f, a)

def scene1(img, t, u):
    img.alpha_composite(background('ring'))
    rg = ring(470); img.alpha_composite(rg, (int(W / 2 - rg.width / 2), int(1000 - rg.height / 2)))
    particles(img, t, 70, 1, cy=1000, rmin=440, rmax=700)
    eo = clamp((t - .3) / .6) * (0.9 + .1 * math.sin(t * 5))   # olhos acendendo
    paste_nox(img, W / 2, 600, 1.2, max(.05, eo), 'none', 0)
    headline(img, SCENES[0]['hl'], .5, t)

def scene2(img, t, u):
    img.alpha_composite(background('plain'))
    tt = ctimes(1)
    calendario(img, 320, 820, 1.1, ease((t - (tt[1] - .2)) / .4))
    pc_velho(img, 760, 800, 1.0, ease((t - (tt[3] - .2)) / .4))
    paste_nox(img, 190, 1235, .6, 1.0, 'cross', 0)
    headline(img, SCENES[1]['hl'], .4, t)

def scene3(img, t, u):
    img.alpha_composite(background('plain'))
    tt = ctimes(2)
    caixa_vazia(img, 300, 900, 1.0, ease(t / .4), t)
    k = ease((t - (tt[2] - .2)) / .6)
    if k > 0:
        v = 1.5 * k
        draw_text_line(img, 700, 700, [('US$', WHITE)], 60, k, 6)
        draw_text_line(img, 700, 780, [(f'{v:.1f}'.replace('.', ','), GOLD)], 170, k, 10)
        draw_text_line(img, 700, 980, [('BILHÃO', GOLD)], 70, k, 7)
    paste_nox(img, 190, 1235, .6, 1.0, 'raise' if t > tt[5] - .1 else 'point', 0)
    fonte(img, ease(t / .5))
    headline(img, SCENES[2]['hl'], .4, t)

def scene4(img, t, u):
    img.alpha_composite(background('plain'))
    tt = ctimes(3)
    a = ease(t / .4)
    ang = lerp(0, 16, ease((t - (tt[4] - .2)) / .6)) + 2 * math.sin(t * 2)
    balanca(img, 540, 620, ang, a)
    draw_text_line(img, 540 - 300, 1100, [('JOGO', GOLD)], 48, a, 5)
    draw_text_line(img, 540 + 300, 1100, [('FEIRA', WHITE)], 48, a, 5)
    paste_nox(img, 190, 1265, .55, 1.0, 'point', 0)
    fonte(img, a)
    headline(img, SCENES[3]['hl'], .4, t)

def scene5b(img, t, u):
    img.alpha_composite(background('plain'))
    tt = ctimes(4)
    microfone(img, 330, 820, 1.2, ease(t / .4), t)
    card(img, 760, 640, 400, 160, GOLD, ease((t - (tt[2] - .2)) / .4))
    draw_text_line(img, 760, 590, [('DRA. NITA', GOLD)], 60, ease((t - (tt[2] - .2)) / .4), 6)
    draw_text_line(img, 760, 660, [('PODCAST', WHITE)], 36, ease((t - (tt[3] - .2)) / .4), 4)
    for i, (nm, k) in enumerate([('TRAVIS SCOTT', 5), ('DUA LIPA', 6), ('SEPULTURA', 7)]):
        chip(img, 760, 820 + i * 110, nm, ease((t - (tt[k] - .15)) / .3))
    tilt = 10 * ease((t - .2) / .8)
    paste_nox(img, 190, 1235, .6, 1.0, 'none', tilt)
    fonte(img, ease(t / .5))
    headline(img, SCENES[4]['hl'], .4, t)

def scene6(img, t, u):
    img.alpha_composite(background('plain'))
    vice(img, t, ease(t / .4))
    tt = ctimes(5)
    a = ease((t - (tt[5] - .2)) / .4)
    if a > 0: draw_text_line(img, 540, 1180, [('13 ANOS → ', WHITE), ('BRASIL', GOLD)], 70, a, 7)
    sc = lerp(.6, .95, ease(t / max(1, SCENES[5]['t1'] - SCENES[5]['t0'])))   # Nox chegando perto
    paste_nox(img, 220, lerp(1235, 1100, ease(t / 4)), sc, 1.0, 'point', 0)
    headline(img, SCENES[5]['hl'], .4, t)

def scene5(img, t, u):
    img.alpha_composite(background('ring'))
    rg = ring(470); a = ease(t / .8)
    rr = rg.copy(); rr.putalpha(rr.getchannel('A').point(lambda v: int(v * a)))
    img.alpha_composite(rr, (int(W / 2 - rg.width / 2), int(1000 - rg.height / 2)))
    particles(img, t, 60, 5, cy=1000, rmin=440, rmax=700)
    eo = lerp(.65, .45, ease((t - 1.5) / 1.0))
    paste_nox(img, W / 2, 600, 1.2, eo, 'cross', -3 * ease((t - 1) / 1))
    end = caps_of(6)[-1][0] - SCENES[6]['t0']
    if t > end:
        draw_text_line(img, W / 2, 200, [('NOX', GOLD), ('EXPLICA', WHITE)], 96, clamp((t - end) / .3), 8)
        draw_text_line(img, W / 2, 330, [('MANDA SUA DÚVIDA', WHITE)], 50, clamp((t - end - .4) / .3), 6)

FUNCS = [scene1, scene2, scene3, scene4, scene5b, scene6, scene5]

def frame(T):
    si = max(i for i, s in enumerate(SCENES) if s['t0'] <= T + 1e-6)
    sc = SCENES[si]; t = T - sc['t0']; u = t / (sc['t1'] - sc['t0'])
    img = Image.new('RGBA', (W, H), (0, 0, 0, 255))
    FUNCS[si](img, t, u)
    # câmera: aproximação lenta e contínua
    z = 1 + 0.06 * ease(u) if si in (0, 6) else 1 + 0.035 * u
    if z > 1.001:
        cw, ch = W / z, H / z; x0 = (W - cw) / 2; y0 = (H * .5) - ch * .5
        img = img.resize((W, H), Image.BICUBIC, box=(x0, y0, x0 + cw, y0 + ch))
    # legenda (fora do zoom)
    for (a, b, c, s) in CAPS:
        if a <= T < b + (0.15 if s == 6 else 0):
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
