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
    dict(min=5.0, hl=[('ITAIPU: QUASE R$ 1 BI', WHITE), ('NUM BANCO DE 1 ANO', GOLD)],
         caps=[('ITAIPU,', 0), ('A USINA DO *BRASIL', 0), ('COM O *PARAGUAI,', 0), ('DEIXOU QUASE', 0), ('*UM *BILHÃO DE REAIS...', 0),
               ('NUM BANCO DIGITAL', 0), ('DE *UM *ANO E POUCO.', 0), ('PORRA.', 0)]),
    dict(min=6.0, hl=[('APROVADO EM 12 DIAS', WHITE), ('A REGRA PEDIA 5 ANOS', GOLD)],
         caps=[('O BANCO FOI APROVADO', 0), ('EM *DOZE *DIAS,', 0), ('PRO LADO *PARAGUAIO.', 0),
               ('E A REGRA INTERNA,', 0), ('SEGUNDO A IMPRENSA,', 0), ('PEDIA *CINCO *ANOS', 0), ('DE MERCADO.', 0)]),
    dict(min=8.0, hl=[('BANCO SOB INTERVENÇÃO', WHITE), ('+US$ 160 MI TRAVADOS', GOLD)],
         caps=[('AÍ O *BANCO *CENTRAL', 0), ('DO PARAGUAI', 0), ('INTERVEIO NO BANCO.', 0),
               ('MAIS DE *CENTO E *SESSENTA', 0), ('MILHÕES DE *DÓLARES', 0), ('TRAVADOS,', 0), ('CARALHO.', 0),
               ('E O *DIRETOR *PARAGUAIO', 0), ('DA USINA CAIU.', 0)]),
    dict(min=7.0, hl=[('LADO BR ≠ LADO PY', WHITE), ('CASO EM APURAÇÃO', GOLD)],
         caps=[('SÓ NÃO CONFUNDE:', 0), ('O LADO *BRASILEIRO DIZ', 0), ('QUE *NUNCA BOTOU', 0), ('DINHEIRO LÁ.', 0),
               ('E O DIRETOR QUE SAIU', 0), ('NEGA TER QUEBRADO REGRA.', 0), ('TÁ SENDO *APURADO.', 0)]),
    dict(min=6.0, hl=None, end_hold=0.6,
         caps=[('*NOX QUER SABER', 0), ('QUE MERDA DE CONFIANÇA', 0), ('É ESSA.', 0),
               ('TEM OUTRA *TRETA', .5), ('QUE VOCÊ QUER ENTENDER?', 0), ('MANDA NOS *COMENTÁRIOS', 0), ('QUE *NOX EXPLICA.', 0)]),
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

BLUE = (110, 170, 240)
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

def card(img, x, y, w, h, col, a):
    layer(img, lambda d, al: d.rounded_rectangle([x - w / 2, y - h / 2, x + w / 2, y + h / 2], radius=28, fill=(30, 24, 54, int(230 * a)), outline=col + (al,), width=6), a)

def money_bag(img, x, y, s, a, label=None):
    """saco de dinheiro (ícone) com etiqueta"""
    glow(img, x, y + 20 * s, 80 * s, (255, 200, 80), a * .6)
    def f(d, al):
        d.polygon([(x - 40 * s, y - 70 * s), (x + 40 * s, y - 70 * s), (x + 22 * s, y - 40 * s), (x - 22 * s, y - 40 * s)], fill=(200, 160, 70, al))
        d.ellipse([x - 95 * s, y - 50 * s, x + 95 * s, y + 110 * s], fill=(214, 172, 78, al), outline=(150, 110, 40, al), width=int(5 * s))
        d.line([(x - 30 * s, y - 44 * s), (x + 30 * s, y - 44 * s)], fill=(120, 80, 30, al), width=int(8 * s))
        d.text((x, y + 32 * s), '$', font=font(int(96 * s)), fill=(120, 80, 30, al), anchor='mm')
    layer(img, f, a)
    if label and a > 0: draw_text_line(img, x, y + 125 * s, [(label, GOLD)], int(46 * s), a, 5)

def bank(img, x, y, s, a, lock=0.0, label=None):
    """prédio de banco genérico (frontão + colunas), com cadeado opcional"""
    def f(d, al):
        d.polygon([(x - 170 * s, y - 90 * s), (x + 170 * s, y - 90 * s), (x, y - 175 * s)], fill=PURP2 + (al,))
        d.rectangle([x - 160 * s, y - 90 * s, x + 160 * s, y - 70 * s], fill=(150, 140, 190, al))
        for k in range(4):
            cx = x - 110 * s + k * 73 * s
            d.rectangle([cx - 18 * s, y - 70 * s, cx + 18 * s, y + 90 * s], fill=(190, 182, 220, al))
        d.rectangle([x - 175 * s, y + 90 * s, x + 175 * s, y + 115 * s], fill=(150, 140, 190, al))
        if lock > 0:
            la = int(al * lock); ly = y + 10 * s
            d.arc([x - 50 * s, ly - 110 * s, x + 50 * s, ly - 10 * s], 180, 360, fill=(255, 214, 110, la), width=int(16 * s))
            d.line([(x - 50 * s, ly - 60 * s), (x - 50 * s, ly - 20 * s)], fill=(255, 214, 110, la), width=int(16 * s))
            d.line([(x + 50 * s, ly - 60 * s), (x + 50 * s, ly - 20 * s)], fill=(255, 214, 110, la), width=int(16 * s))
            d.rounded_rectangle([x - 75 * s, ly - 25 * s, x + 75 * s, ly + 85 * s], radius=int(14 * s), fill=(255, 196, 40, la), outline=(150, 100, 20, la), width=int(5 * s))
            d.ellipse([x - 14 * s, ly + 10 * s, x + 14 * s, ly + 38 * s], fill=(90, 60, 10, la))
            d.rectangle([x - 6 * s, ly + 30 * s, x + 6 * s, ly + 60 * s], fill=(90, 60, 10, la))
    layer(img, f, a)
    if label and a > 0: draw_text_line(img, x, y + 125 * s, [(label, WHITE)], int(38 * s), a, 4)

def dam(img, x, y, w, a, t):
    """barragem vista de frente, dividida em duas metades (Brasil | Paraguai)"""
    h = w * .42
    def f(d, al):
        # água atrás (ondulando)
        for k in range(5):
            yy = y - h / 2 - 18 + k * 7 + 3 * math.sin(t * 2 + k)
            d.line([(x - w / 2 - 20, yy), (x + w / 2 + 20, yy)], fill=(90, 150, 230, int(al * .7)), width=5)
        d.polygon([(x - w / 2, y - h / 2), (x + w / 2, y - h / 2), (x + w / 2 + 40, y + h / 2), (x - w / 2 - 40, y + h / 2)], fill=(150, 146, 172, al))
        for k in range(1, 8):
            xx = x - w / 2 + k * w / 8
            d.line([(xx, y - h / 2 + 10), (xx + (xx - x) * .08, y + h / 2 - 6)], fill=(110, 104, 140, al), width=4)
        # cortina d'água saindo
        for k in range(6):
            xx = x - w / 2 + (k + .5) * w / 6
            d.rectangle([xx - 14, y + h / 2, xx + 14, y + h / 2 + 50], fill=(150, 200, 255, int(al * (.5 + .3 * math.sin(t * 5 + k)))))
    layer(img, f, a)

def halves(img, x, y, w, a, b):
    """divide a barragem: metade BR (verde) e metade PY (vermelha), cada uma com seu caixa"""
    if b <= 0: return
    h = w * .42
    def f(d, al):
        d.line([(x, y - h / 2 - 40), (x, y + h / 2 + 70)], fill=GOLD + (al,), width=8)
        d.rounded_rectangle([x - w / 2 - 30, y - h / 2 - 20, x - 6, y + h / 2 + 60], radius=20, outline=GREEN + (al,), width=6)
        d.rounded_rectangle([x + 6, y - h / 2 - 20, x + w / 2 + 30, y + h / 2 + 60], radius=20, outline=RED + (al,), width=6)
    layer(img, f, b)
    draw_text_line(img, x - w / 4 - 10, y + h / 2 + 90, [('LADO BR', GREEN)], 40, b, 5)
    draw_text_line(img, x + w / 4 + 10, y + h / 2 + 90, [('LADO PY', RED)], 40, b, 5)

def calendar(img, x, y, s, a, top, big):
    def f(d, al):
        d.rounded_rectangle([x - 120 * s, y - 110 * s, x + 120 * s, y + 120 * s], radius=int(22 * s), fill=(240, 236, 250, al))
        d.rounded_rectangle([x - 120 * s, y - 110 * s, x + 120 * s, y - 40 * s], radius=int(22 * s), fill=(210, 70, 70, al))
        d.rectangle([x - 120 * s, y - 60 * s, x + 120 * s, y - 40 * s], fill=(210, 70, 70, al))
        for k in (-60, 60): d.rounded_rectangle([x + k * s - 10 * s, y - 135 * s, x + k * s + 10 * s, y - 85 * s], radius=int(8 * s), fill=(120, 110, 150, al))
        d.text((x, y - 75 * s), top, font=font(int(34 * s)), fill=(255, 255, 255, al), anchor='mm')
        d.text((x, y + 40 * s), big, font=font(int(110 * s)), fill=(40, 30, 60, al), anchor='mm')
    layer(img, f, a)

def chair(img, x, y, s, a, dx=0.0):
    def f(d, al):
        cx = x + dx
        d.rounded_rectangle([cx - 70 * s, y - 150 * s, cx + 70 * s, y], radius=int(22 * s), fill=(120, 60, 70, al))
        d.rounded_rectangle([cx - 90 * s, y - 10 * s, cx + 90 * s, y + 30 * s], radius=int(12 * s), fill=(150, 76, 86, al))
        for k in (-70, 70): d.rectangle([cx + k * s - 8 * s, y + 30 * s, cx + k * s + 8 * s, y + 110 * s], fill=(80, 70, 100, al))
    layer(img, f, a)

def magnifier(img, x, y, s, a, t):
    def f(d, al):
        ox = 10 * math.sin(t * 1.6) * s; oy = 6 * math.cos(t * 1.3) * s
        d.ellipse([x + ox - 70 * s, y + oy - 70 * s, x + ox + 70 * s, y + oy + 70 * s], outline=GOLD + (al,), width=int(14 * s), fill=(120, 170, 240, int(al * .25)))
        d.line([(x + ox + 50 * s, y + oy + 50 * s), (x + ox + 120 * s, y + oy + 120 * s)], fill=GOLD + (al,), width=int(22 * s))
    layer(img, f, a)

def check(d, x, y, s, col):
    d.line([(x - 30 * s, y), (x - 8 * s, y + 24 * s), (x + 34 * s, y - 26 * s)], fill=col, width=int(12 * s))

def scene1(img, t, u):
    img.alpha_composite(background('ring'))
    rg = ring(470); img.alpha_composite(rg, (int(W / 2 - rg.width / 2), int(1000 - rg.height / 2)))
    particles(img, t, 70, 1, cy=1000, rmin=440, rmax=700)
    tt = ctimes(0)
    q = tt[7]  # "PORRA."
    tilt = 6 * ease((t - .6) / 1.0)
    eo = lerp(.75, .5, ease((t - .8) / .8))
    paste_nox(img, W / 2, 600, 1.2, eo, 'raise' if t >= q - .15 else 'none', tilt)
    # saco de dinheiro (R$ 1 bi) indo para um banquinho "1 ANO"
    b = ease((t - (tt[4] - .2)) / .4)
    mv = ease((t - (tt[5] - .1)) / .9)
    money_bag(img, lerp(190, 330, mv), 560 + 8 * math.sin(t * 2) + 40 * mv, 1.05 * (1 - .2 * mv), b, 'R$ 1 BI')
    bank(img, 870, 620 + 6 * math.sin(t * 1.5 + 1), .85, ease((t - (tt[5] - .2)) / .4), 0, '1 ANO')
    headline(img, SCENES[0]['hl'], .5, t)

def scene2(img, t, u):
    img.alpha_composite(background('plain'))
    tt = ctimes(1)
    pan = 14 * math.sin(t * .4)
    a = ease(t / .4)
    dam(img, 560 + pan, 560, 620, a, t)
    halves(img, 560 + pan, 560, 620, a, ease((t - .5) / .5))
    # calendário: aprovado em 12 dias
    c = ease((t - (tt[0] - .1)) / .4)
    calendar(img, 330, 1010, .8, c, 'APROVADO', '12')
    if c > 0: draw_text_line(img, 330, 1125, [('DIAS', GOLD)], 40, c, 5)
    # régua: regra pedia 5 anos x banco tinha ~1 ano
    r = ease((t - (tt[3] - .2)) / .4)
    if r > 0:
        g = ease((t - (tt[5] - .2)) / .6)
        def f(d, al):
            x0, x1 = 560, 1000
            d.rounded_rectangle([x0, 900, x1, 960], radius=14, outline=GOLD + (al,), width=5)
            d.rounded_rectangle([x0, 900, x0 + (x1 - x0) * g, 960], radius=14, fill=GOLD + (int(al * .85),))
            for k in range(1, 5): d.line([(x0 + k * (x1 - x0) / 5, 960), (x0 + k * (x1 - x0) / 5, 975)], fill=GOLD + (al,), width=4)
            d.rounded_rectangle([x0, 1050, x0 + (x1 - x0) / 5 * 1.1, 1110], radius=14, fill=RED + (al,))
        layer(img, f, r)
        draw_text_line(img, 780, 845, [('REGRA:', WHITE), ('5 ANOS', GOLD)], 38, r, 4)
        draw_text_line(img, 780, 1000, [('O BANCO:', WHITE), ('~1 ANO', RED)], 38, r, 4)
    paste_nox(img, 170, 1255, .55, 1.0, 'point' if t > .4 else 'none', 0, 10)
    headline(img, SCENES[1]['hl'], .6, t)

def scene3(img, t, u):
    img.alpha_composite(background('plain'))
    tt = ctimes(2)
    # parte 1: banco sob intervenção, dinheiro travado
    p2 = ease((t - (tt[7] - .3)) / .5)  # troca para a parte 2 (diretor)
    a = ease((t - .1) / .4) * (1 - p2)
    lock = ease((t - (tt[2] - .1)) / .4)
    bank(img, 560, 720, 1.25, a, lock)
    if a > 0 and lock > 0: draw_text_line(img, 560, 900, [('INTERVENÇÃO', WHITE)], 46, a * lock, 5)
    m = ease((t - (tt[3] - .2)) / .4) * (1 - p2)
    if m > 0:
        money_bag(img, 860, 1020, .7, m, None)
        draw_text_line(img, 820, 1130, [('+US$ 160 MI', GOLD)], 52, m, 6)
    stamp(img, 560, 560, 'TRAVADO', RED, ease((t - (tt[5] - .1)) / .3) * (1 - p2), 58, 7)
    # parte 2: a cadeira do diretor paraguaio fica vazia
    if p2 > 0:
        out = ease((t - (tt[8] - .1)) / .6)
        card(img, 600, 800, 620, 600, RED, p2)
        draw_text_line(img, 600, 560, [('DIRETOR-GERAL', WHITE)], 42, p2, 5)
        draw_text_line(img, 600, 615, [('LADO PARAGUAIO', RED)], 34, p2, 4)
        chair(img, 600, 870, 1.2, p2, 0)
        stamp(img, 600, 780, 'TROCADO', GOLD, out * p2, 62, -6)
        draw_text_line(img, 600, 1040, [('18/11 · TROCADO PELO PRESIDENTE', (190, 180, 220))], 32, p2, 3)
    paste_nox(img, 170, 1260, .55, 1.0 if t < tt[6] else .7, 'point' if t > .4 else 'none', -3 * ease(t / 3), 10)
    headline(img, SCENES[2]['hl'], .6, t)

def scene4(img, t, u):
    img.alpha_composite(background('plain'))
    tt = ctimes(3)
    a1 = ease((t - (tt[1] - .2)) / .4)
    card(img, 300, 760, 440, 560, GREEN, a1)
    if a1 > 0:
        draw_text_line(img, 300, 510, [('LADO BRASILEIRO', WHITE)], 36, a1, 4)
        draw_text_line(img, 300, 560, [('DIZ QUE', (190, 180, 220))], 30, a1, 3)
        bank(img, 300, 760, .55, a1, 0)
        def f(d, al): check(d, 300, 900, 1.3, GREEN + (al,))
        layer(img, f, ease((t - (tt[2])) / .3))
        draw_text_line(img, 300, 960, [('NUNCA APLICOU LÁ', GREEN)], 32, a1, 4)
    a2 = ease((t - (tt[4] - .2)) / .4)
    card(img, 780, 760, 440, 560, GOLD, a2)
    if a2 > 0:
        draw_text_line(img, 780, 510, [('DIRETOR QUE SAIU', WHITE)], 36, a2, 4)
        draw_text_line(img, 780, 560, [('DIZ QUE', (190, 180, 220))], 30, a2, 3)
        chair(img, 780, 760, .7, a2)
        draw_text_line(img, 780, 900, [('NÃO DESCUMPRIU', GOLD)], 32, a2, 4)
        draw_text_line(img, 780, 945, [('REGRA NENHUMA', GOLD)], 32, a2, 4)
    mg = ease((t - (tt[6] - .2)) / .4)
    if mg > 0:
        magnifier(img, 540, 1110, .8, mg, t)
        draw_text_line(img, 760, 1100, [('EM APURAÇÃO', WHITE)], 44, mg, 5)
    raise_t = ease((t - .2) / .5)
    paste_nox(img, 170, lerp(1270, 1245, raise_t), .55, 1.0, 'raise' if t > .2 else 'none', 0)
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
