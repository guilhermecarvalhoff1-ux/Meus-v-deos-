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
    dict(min=5.0, hl=[('APAGÃO MUNDIAL', WHITE), ('EM 17 DE NOVEMBRO?', GOLD)],
         caps=[('METADE DA INTERNET', 0), ('JUROU QUE O MUNDO', 0), ('IA APAGAR', 0), ('NO DIA *17 DE *NOVEMBRO.', 0), ('PORRA...', 0), ('NEM A LUZ PISCOU.', 0)]),
    dict(min=6.0, hl=[('A "PROVA" ERA DE 2023', WHITE), ('SEM APAGÃO MUNDIAL', GOLD)],
         caps=[('A PROVA ERA', 0), ('UM EPISÓDIO', 0), ('DOS *SIMPSONS,', 0), ('DE *2023.', 0), ('QUE NEM FALA', 0), ('DE *APAGÃO *MUNDIAL,', 0), ('CARALHO.', 0)]),
    dict(min=8.0, hl=[('MISTURARAM COISA REAL', WHITE), ('TESTE 1 MIN · KIT 72 H', GOLD)],
         caps=[('O RESTO ERA', 0), ('COISA REAL MISTURADA:', 0), ('UM *TESTE DE ALERTA', 0), ('DE *UM *MINUTO', 0), ('NOS ESTADOS UNIDOS,', 0),
               ('E A *DEFESA *CIVIL', 0), ('INDICANDO UM KIT', 0), ('PRA *TRÊS *DIAS.', 0), ('*ROTINA.', 0)]),
    dict(min=7.0, hl=[('REGIONAL ≠ MUNDIAL', WHITE), ('NÃO EXISTE BOTÃO', GOLD)],
         caps=[('SÓ NÃO CONFUNDE:', 0), ('APAGÃO *REGIONAL EXISTE,', 0), ('*ESPANHA E *PORTUGAL', 0), ('APAGARAM EM *2025.', 0),
               ('MAS NÃO TEM', 0), ('UM *BOTÃO QUE', 0), ('DESLIGA O *PLANETA.', 0)]),
    dict(min=6.0, hl=None, end_hold=0.6,
         caps=[('*NOX ACHA QUE', 0), ('O FIM DO MUNDO', 0), ('TÁ CADA VEZ', 0), ('MAIS *PREGUIÇOSO.', 0),
               ('ACHOU MAIS ALGUMA', .5), ('MERDA SEM SENTIDO', 0), ('POR AÍ?', 0), ('MANDA NOS *COMENTÁRIOS', 0), ('QUE *NOX EXPLICA.', 0)]),
]
WPS = 2.6  # palavras por segundo (estimativa sem voz: ritmo parecido com a voz real do #04)

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
PURP = (52, 42, 84); PURP2 = (74, 62, 118); DARK = (20, 16, 34)

def layer(img, fn, a):
    """desenha fn(d, al) numa camada e compõe com transparência a"""
    if a <= 0: return
    L = Image.new('RGBA', img.size, (0, 0, 0, 0)); fn(ImageDraw.Draw(L), int(255 * a)); img.alpha_composite(L)

def glow(img, x, y, r, col, a):
    if a <= 0: return
    g = Image.new('RGBA', (int(r * 4), int(r * 4)), (0, 0, 0, 0))
    ImageDraw.Draw(g).ellipse([r, r, r * 3, r * 3], fill=col + (int(150 * a),))
    g = g.filter(ImageFilter.GaussianBlur(r * .45)); img.alpha_composite(g, (int(x - r * 2), int(y - r * 2)))

def bulb(img, x, y, s, a, on=1.0):
    """lâmpada acesa (ícone): bulbo + base"""
    glow(img, x, y, 70 * s, (255, 200, 80), a * on)
    def f(d, al):
        col = tuple(int(lerp(c0, c1, on)) for c0, c1 in zip((90, 84, 110), (255, 222, 120)))
        d.ellipse([x - 46 * s, y - 50 * s, x + 46 * s, y + 42 * s], fill=col + (al,))
        d.rectangle([x - 22 * s, y + 30 * s, x + 22 * s, y + 70 * s], fill=(170, 160, 190, al))
        for k in range(3): d.line([(x - 22 * s, y + 40 * s + k * 10 * s), (x + 22 * s, y + 40 * s + k * 10 * s)], fill=(110, 100, 130, al), width=max(2, int(3 * s)))
        d.line([(x - 12 * s, y + 6 * s), (x, y - 14 * s), (x + 12 * s, y + 6 * s)], fill=(255, 150, 40, al), width=max(2, int(5 * s)))
    layer(img, f, a)

def bolt(d, x, y, s, col):
    d.polygon([(x + 6 * s, y - 30 * s), (x - 14 * s, y + 4 * s), (x - 1 * s, y + 4 * s), (x - 6 * s, y + 30 * s), (x + 14 * s, y - 6 * s), (x + 1 * s, y - 6 * s)], fill=col)

def stamp(img, x, y, text, col, a, sz=60, ang=-8):
    """carimbo inclinado"""
    if a <= 0: return
    f = font(sz); w = f.getlength(text) + 60; h = sz * 1.6
    L = Image.new('RGBA', (int(w + 40), int(h + 40)), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
    d.rounded_rectangle([20, 20, 20 + w, 20 + h], radius=16, outline=col + (255,), width=8, fill=(20, 10, 20, 170))
    d.text((20 + w / 2, 20 + h / 2), text, font=f, fill=col + (255,), anchor='mm')
    sc = lerp(1.6, 1.0, eout(a))
    L = L.resize((int(L.width * sc), int(L.height * sc)), Image.LANCZOS).rotate(ang, resample=Image.BICUBIC, expand=True)
    L.putalpha(L.getchannel('A').point(lambda v: int(v * clamp(a * 1.5))))
    img.alpha_composite(L, (int(x - L.width / 2), int(y - L.height / 2)))

def tv(img, x, y, s, a, t):
    """TV genérica com uma cidadezinha desenhada (sem personagens)"""
    def f(d, al):
        w, h = 420 * s, 300 * s
        d.line([(x - 60 * s, y - h / 2 - 70 * s), (x, y - h / 2 - 10 * s), (x + 70 * s, y - h / 2 - 80 * s)], fill=(170, 160, 200, al), width=int(6 * s))
        d.rounded_rectangle([x - w / 2 - 24 * s, y - h / 2 - 24 * s, x + w / 2 + 24 * s, y + h / 2 + 24 * s], radius=int(36 * s), fill=PURP2 + (al,))
        d.rounded_rectangle([x - w / 2, y - h / 2, x + w / 2, y + h / 2], radius=int(20 * s), fill=(250, 214, 110, al))
        # céu e cidadezinha: só a cidade fica escura (falta de luz local)
        d.rectangle([x - w / 2 + 10 * s, y - h / 2 + 10 * s, x + w / 2 - 10 * s, y + h / 2 - 10 * s], fill=(110, 170, 230, al))
        gy = y + h / 2 - 10 * s
        for i, (bx, bw, bh) in enumerate([(-170, 70, 120), (-90, 60, 170), (-20, 80, 100), (70, 50, 150), (130, 60, 90)]):
            d.rectangle([x + bx * s, gy - bh * s, x + (bx + bw) * s, gy], fill=(60, 56, 80, al))
            for wy in range(int(gy - bh * s + 16 * s), int(gy - 14 * s), int(28 * s)):
                d.rectangle([x + (bx + 14) * s, wy, x + (bx + 28) * s, wy + 12 * s], fill=(30, 28, 44, al))
        d.rectangle([x - 40 * s, y + h / 2 + 24 * s, x + 40 * s, y + h / 2 + 50 * s], fill=PURP2 + (al,))
    layer(img, f, a)

def globe(img, x, y, r, a, lit=1.0):
    def f(d, al):
        d.ellipse([x - r, y - r, x + r, y + r], fill=(40, 80, 150, al), outline=(150, 200, 255, al), width=6)
        for k in (-.5, 0, .5):
            d.line([(x - r * math.sqrt(1 - k * k), y + k * r), (x + r * math.sqrt(1 - k * k), y + k * r)], fill=(150, 200, 255, int(al * .6)), width=3)
        d.ellipse([x - r * .45, y - r, x + r * .45, y + r], outline=(150, 200, 255, int(al * .6)), width=3)
        d.line([(x, y - r), (x, y + r)], fill=(150, 200, 255, int(al * .6)), width=3)
        # luzes acesas nas cidades
        rr = random.Random(4)
        for i in range(26):
            ang = rr.uniform(0, 6.28); dd = rr.uniform(0, .85) * r
            px, py = x + math.cos(ang) * dd, y + math.sin(ang) * dd
            d.ellipse([px - 5, py - 5, px + 5, py + 5], fill=(255, 214, 110, int(al * lit)))
    layer(img, f, a)

def card(img, x, y, w, h, col, a):
    layer(img, lambda d, al: d.rounded_rectangle([x - w / 2, y - h / 2, x + w / 2, y + h / 2], radius=28, fill=(30, 24, 54, int(230 * a)), outline=col + (al,), width=6), a)

def radio_icon(img, x, y, s, a, t):
    def f(d, al):
        d.rounded_rectangle([x - 110 * s, y - 60 * s, x + 110 * s, y + 70 * s], radius=int(20 * s), fill=PURP2 + (al,))
        d.ellipse([x - 90 * s, y - 40 * s, x - 10 * s, y + 40 * s], fill=DARK + (al,))
        for k in range(3): d.rectangle([x + 20 * s, y - 34 * s + k * 26 * s, x + 90 * s, y - 22 * s + k * 26 * s], fill=(255, 214, 110, al))
        d.line([(x + 60 * s, y - 60 * s), (x + 100 * s, y - 130 * s)], fill=(170, 160, 200, al), width=int(6 * s))
        for k in range(3):
            ph = (t * 1.5 + k / 3) % 1
            rr = 30 + ph * 70
            d.arc([x + 100 * s - rr * s, y - 130 * s - rr * s, x + 100 * s + rr * s, y - 130 * s + rr * s], -70, 20, fill=GOLD + (int(al * (1 - ph)),), width=int(5 * s))
    layer(img, f, a)

def timer(img, x, y, r, a, prog):
    def f(d, al):
        d.ellipse([x - r, y - r, x + r, y + r], fill=DARK + (al,), outline=(150, 140, 190, al), width=6)
        d.pieslice([x - r + 10, y - r + 10, x + r - 10, y + r - 10], -90, -90 + 360 * prog, fill=GOLD + (al,))
        d.rectangle([x - 14, y - r - 24, x + 14, y - r], fill=(150, 140, 190, al))
    layer(img, f, a)

def kit(img, x, y, s, a):
    """kit de emergência: caixa, garrafa d'água, lanterna"""
    def f(d, al):
        d.rounded_rectangle([x - 120 * s, y - 50 * s, x + 120 * s, y + 90 * s], radius=int(18 * s), fill=(200, 60, 60, al))
        d.rectangle([x - 50 * s, y - 80 * s, x + 50 * s, y - 50 * s], outline=(200, 60, 60, al), width=int(10 * s))
        d.rectangle([x - 12 * s, y - 10 * s, x + 12 * s, y + 60 * s], fill=WHITE + (al,))
        d.rectangle([x - 35 * s, y + 13 * s, x + 35 * s, y + 37 * s], fill=WHITE + (al,))
        # garrafa
        bx = x + 170 * s
        d.rounded_rectangle([bx - 30 * s, y - 40 * s, bx + 30 * s, y + 90 * s], radius=int(14 * s), fill=(120, 190, 240, al))
        d.rectangle([bx - 14 * s, y - 64 * s, bx + 14 * s, y - 40 * s], fill=(60, 120, 200, al))
        # lanterna
        lx = x - 175 * s
        d.rounded_rectangle([lx - 20 * s, y - 10 * s, lx + 20 * s, y + 90 * s], radius=int(8 * s), fill=(90, 90, 110, al))
        d.polygon([(lx - 34 * s, y - 50 * s), (lx + 34 * s, y - 50 * s), (lx + 20 * s, y - 10 * s), (lx - 20 * s, y - 10 * s)], fill=(140, 140, 160, al))
        d.ellipse([lx - 30 * s, y - 60 * s, lx + 30 * s, y - 40 * s], fill=(255, 230, 140, al))
    layer(img, f, a)

def scene1(img, t, u):
    img.alpha_composite(background('ring'))
    rg = ring(470); img.alpha_composite(rg, (int(W / 2 - rg.width / 2), int(1000 - rg.height / 2)))
    particles(img, t, 70, 1, cy=1000, rmin=440, rmax=700)
    tt = ctimes(0)
    q = tt[4]  # "PORRA..."
    tilt = 6 * ease((t - .6) / 1.0)
    eo = lerp(.75, .5, ease((t - .8) / .8))
    paste_nox(img, W / 2, 600, 1.2, eo, 'raise' if t >= q - .15 else 'none', tilt)
    # lâmpada que continua acesa ("nem a luz piscou")
    b = ease((t - (tt[3] - .2)) / .4)
    bulb(img, 900, 560 + 8 * math.sin(t * 2), .9, b, 1.0)
    headline(img, SCENES[0]['hl'], .5, t)

def scene2(img, t, u):
    img.alpha_composite(background('plain'))
    tt = ctimes(1)
    pan = 16 * math.sin(t * .4)
    a = ease(t / .4)
    tv(img, 560 + pan, 650, 1.0, a, t)
    b = ease((t - (tt[3] - .15)) / .35)
    if b > 0: draw_text_line(img, 560 + pan, 840, [('EPISÓDIO DE', WHITE), ('2023', GOLD)], 52, b, 6)
    # globo: "apagão mundial?" — nada disso no episódio
    g = ease((t - (tt[4] - .2)) / .4)
    globe(img, 620, 1080, 140, g, 1.0)
    if g > 0: draw_text_line(img, 620, 1240, [('MUNDIAL?', WHITE)], 46, g, 5)
    stamp(img, 640, 1080, 'NÃO FALA', RED, ease((t - (tt[5] + .1)) / .3), 56)
    paste_nox(img, 190, 1235, .6, 1.0, 'point' if t > .4 else 'none', 0, 10)
    headline(img, SCENES[1]['hl'], .6, t)

def scene3(img, t, u):
    img.alpha_composite(background('plain'))
    tt = ctimes(2)
    # cartão 1: teste de alerta (EUA, 1 minuto, rádio e TV)
    a1 = ease((t - (tt[2] - .2)) / .4)
    card(img, 300, 720, 440, 560, (120, 170, 255), a1)
    if a1 > 0:
        draw_text_line(img, 300, 470, [('TESTE DE ALERTA', WHITE)], 38, a1, 4)
        draw_text_line(img, 300, 520, [('EUA · RÁDIO E TV', (190, 180, 220))], 30, a1, 3)
        radio_icon(img, 300, 690, .9, a1, t)
        prog = clamp((t - tt[3]) / 1.2)
        timer(img, 300, 870, 62, a1, prog)
        draw_text_line(img, 300, 945, [('1 MIN', GOLD)], 44, a1, 5)
    # cartão 2: Defesa Civil, kit pra 3 dias
    a2 = ease((t - (tt[5] - .2)) / .4)
    card(img, 780, 720, 440, 560, (235, 120, 90), a2)
    if a2 > 0:
        draw_text_line(img, 780, 470, [('DEFESA CIVIL', WHITE)], 38, a2, 4)
        draw_text_line(img, 780, 520, [('KIT DE PREVENÇÃO', (190, 180, 220))], 30, a2, 3)
        kit(img, 780, 720, .82, a2)
        draw_text_line(img, 780, 900, [('3 DIAS · 72 H', GOLD)], 44, a2, 5)
    stamp(img, 560, 1100, 'ROTINA', GREEN, ease((t - (tt[8] - .1)) / .3), 66, 6)
    paste_nox(img, 170, 1260, .55, 1.0 if t < tt[8] else .7, 'point' if t > .4 else 'none', -3 * ease(t / 3), 10)
    headline(img, SCENES[2]['hl'], .6, t)

def scene4(img, t, u):
    img.alpha_composite(background('plain'))
    tt = ctimes(3)
    # redes separadas: cada bloco tem a sua energia; uma apaga, as outras seguem
    blocks = [(250, 520, 'EUROPA'), (550, 520, 'ÁFRICA'), (850, 520, 'ÁSIA'), (400, 760, 'AMÉRICAS'), (700, 760, 'ESP + POR')]
    a = ease((t - .1) / .5)
    dark = ease((t - (tt[3] - .2)) / .4)
    for i, (x, y, lab) in enumerate(blocks):
        off = dark if lab == 'ESP + POR' else 0
        def f(d, al, x=x, y=y, off=off):
            d.rounded_rectangle([x - 130, y - 85, x + 130, y + 85], radius=22, fill=tuple(int(lerp(c0, c1, off)) for c0, c1 in zip((60, 52, 100), (24, 20, 34))) + (al,),
                                outline=(GOLD if off < .5 else (90, 80, 110)) + (al,), width=5)
            bolt(d, x, y - 18, 1.1, tuple(int(lerp(c0, c1, off)) for c0, c1 in zip(GOLD, (70, 64, 90))) + (al,))
        layer(img, f, a)
        if a > 0: draw_text_line(img, x, y + 26, [(lab, WHITE if lab != 'ESP + POR' else (GOLD if off < .5 else (160, 150, 180)))], 30, a, 3)
    if dark > .3: draw_text_line(img, 700, 860, [('2025', GOLD)], 44, dark, 5)
    # botão que desliga o planeta: não existe
    bb = ease((t - (tt[5] - .2)) / .4)
    if bb > 0:
        def g(d, al):
            d.rounded_rectangle([520, 990, 840, 1060], radius=20, fill=(70, 60, 90, al))
            d.ellipse([590, 930, 770, 1030], fill=(220, 50, 50, al), outline=(120, 20, 20, al), width=6)
        layer(img, g, bb)
        draw_text_line(img, 680, 1080, [('DESLIGA O PLANETA', WHITE)], 34, bb, 4)
    stamp(img, 680, 990, 'NÃO EXISTE', RED, ease((t - (tt[6] + .1)) / .3), 56, -6)
    raise_t = ease((t - .2) / .5)
    paste_nox(img, 180, lerp(1265, 1235, raise_t), .6, 1.0, 'raise' if t > .2 else 'none', 0)
    headline(img, SCENES[3]['hl'], .6, t)

def scene5(img, t, u):
    img.alpha_composite(background('ring'))
    rg = ring(470); a = ease(t / .8)
    rr = rg.copy(); rr.putalpha(rr.getchannel('A').point(lambda v: int(v * a)))
    img.alpha_composite(rr, (int(W / 2 - rg.width / 2), int(1000 - rg.height / 2)))
    particles(img, t, 60, 5, cy=1000, rmin=440, rmax=700)
    eo = lerp(.65, .45, ease((t - 1.5) / 1.0))
    paste_nox(img, W / 2, 600, 1.2, eo, 'cross', -3 * ease((t - 1) / 1))
    end = caps_of(4)[-1][0] - SCENES[4]['t0']
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
