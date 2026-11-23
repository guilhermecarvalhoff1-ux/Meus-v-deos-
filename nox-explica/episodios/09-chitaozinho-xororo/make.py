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
    dict(min=5.0, hl=[('CHITÃOZINHO & XORORÓ', GOLD), ('VÃO SE APOSENTAR', WHITE)],
         caps=[('CHITÃOZINHO E XORORÓ', 0), ('VÃO SE *APOSENTAR...', 0), ('E O BRASIL FICOU', 0), ('SEM *KARAOKÊ*.', 0), ('CALMA, QUE *NOX EXPLICA.', 0)]),
    dict(min=5.0, hl=[('TURNÊ ENTRETEMPOS', GOLD), ('A DESPEDIDA DOS PALCOS', WHITE)],
         caps=[('NO *FANTÁSTICO*,', 0), ('A DUPLA ANUNCIOU:', 0), ('CHEGA DE *SHOW*.', 0), ('A TURNÊ DE DESPEDIDA,', 0), ('*ENTRETEMPOS*,', 0), ('COMEÇA EM *MARÇO', 0), ('DE *2027...', 0), ('COM *JORGE E *MATEUS JUNTO.', 0)]),
    dict(min=4.0, hl=[('56 ANOS', GOLD), ('DE CARREIRA', WHITE)],
         caps=[('*CINQUENTA *E *SEIS ANOS,', 0), ('PORRA.', 0), ('OS CARAS COMEÇARAM', 0), ('EM *1970*.', 0), ('TEM *AVÔ QUE *NAMOROU', 0), ('OUVINDO ELES.', 0)]),
    dict(min=6.0, hl=[('NÃO CONFUNDIR', GOLD)],
         caps=[('AGORA, A *PEGADINHA:', 0), ('*EVIDÊNCIAS*,', 0), ('O SEGUNDO *HINO *NACIONAL...', 0), ('NÃO FOI *ESCRITA', 0), ('POR ELES.', 0), ('QUEM COMPÔS FOI', 0), ('*JOSÉ *AUGUSTO', 0), ('E *PAULO *SÉRGIO *VALLE*.', 0), ('E APOSENTAR DOS *PALCOS', 0), ('NÃO É ACABAR A *DUPLA*:', 0), ('ELES VÃO CONTINUAR', 0), ('*GRAVANDO*.', 0)]),
    dict(min=4.0, hl=None, end_hold=1.0,
         caps=[('MAS O *KARAOKÊ', 0), ('NUNCA MAIS VAI SER', 0), ('O MESMO, CARALHO.', 0), ('ACHOU MAIS ALGUMA', 0), ('MERDA SEM SENTIDO POR AÍ?', 0), ('MANDA NOS *COMENTÁRIOS', 0), ('QUE *NOX EXPLICA.', 0)]),
]
WPS = 2.6  # palavras por segundo estimadas (sem voz nesta execução)

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
        sz = 76
        while font(sz).getlength(s) > W - 100: sz -= 2
        draw_text_line(img, W / 2, 210 + i * 92 + dy, [(s, c)], sz, a, 7)
# ---------------- cenas ----------------
def caps_of(si): return [c for c in CAPS if c[3] == si]
def ctimes(si): T0 = SCENES[si]['t0']; return [c[0] - T0 for c in caps_of(si)]
STONE = (214, 186, 132); STONE_D = (166, 138, 92); PURP = (52, 42, 84)

def layer(img, fn, a):
    """desenha fn(d, al) numa camada e compõe com transparência a"""
    if a <= 0: return
    L = Image.new('RGBA', img.size, (0, 0, 0, 0)); fn(ImageDraw.Draw(L), int(255 * a)); img.alpha_composite(L)

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

def fonte(img, txt, a=1.0):
    draw_text_line(img, W / 2, 1860, [('Fonte: ' + txt, (170, 160, 200))], 26, a * .9, 3)

def card(img, x, y, w, h, col, a):
    layer(img, lambda d, al: d.rounded_rectangle([x - w / 2, y - h / 2, x + w / 2, y + h / 2], radius=28, fill=(30, 24, 54, int(230 * a)), outline=col + (al,), width=6), a)

def cantor(d, x, y, s, col, al, hat=True):
    """silhueta simples de cantor (cabeça, chapéu, corpo) — genérica"""
    d.polygon([(x - 70 * s, y + 230 * s), (x + 70 * s, y + 230 * s), (x + 50 * s, y + 60 * s), (x - 50 * s, y + 60 * s)], fill=col + (al,))
    d.ellipse([x - 42 * s, y - 30 * s, x + 42 * s, y + 54 * s], fill=col + (al,))
    if hat:
        d.ellipse([x - 80 * s, y - 34 * s, x + 80 * s, y - 6 * s], fill=col + (al,))
        d.rounded_rectangle([x - 44 * s, y - 86 * s, x + 44 * s, y - 16 * s], radius=int(18 * s), fill=col + (al,))

def dupla(img, x, y, s, col, a, hat=True):
    layer(img, lambda d, al: (cantor(d, x - 70 * s, y, s, col, al, hat), cantor(d, x + 70 * s, y + 6 * s, s, col, al, hat)), a)

def tv(img, x, y, s, a, t):
    def f(d, al):
        d.line([(x - 50 * s, y - 170 * s), (x, y - 120 * s)], fill=(200, 200, 210, al), width=6)
        d.line([(x + 50 * s, y - 170 * s), (x, y - 120 * s)], fill=(200, 200, 210, al), width=6)
        d.rounded_rectangle([x - 190 * s, y - 120 * s, x + 190 * s, y + 130 * s], radius=int(26 * s), fill=(60, 50, 80, al))
        d.rounded_rectangle([x - 165 * s, y - 98 * s, x + 165 * s, y + 108 * s], radius=int(14 * s), fill=(30, 60, 110, al))
    layer(img, f, a)
    draw_text_line(img, x, y - 70 * s, [('DOMINGO', WHITE)], int(44 * s), a, 4)
    draw_text_line(img, x, y - 10 * s, [('22/11', GOLD)], int(76 * s), a, 6)

def ingresso(img, x, y, a):
    card(img, x, y, 520, 250, GOLD, a)
    draw_text_line(img, x, y - 100, [('ENTRETEMPOS', GOLD)], 58, a, 6)
    draw_text_line(img, x, y - 24, [('1º SHOW: 20 MAR 2027', WHITE)], 38, a, 4)
    draw_text_line(img, x, y + 30, [('SÃO PAULO', WHITE)], 38, a, 4)

def coracao(img, x, y, s, a):
    def f(d, al):
        d.ellipse([x - 50 * s, y - 40 * s, x + 4 * s, y + 14 * s], fill=(235, 80, 110, al))
        d.ellipse([x - 4 * s, y - 40 * s, x + 50 * s, y + 14 * s], fill=(235, 80, 110, al))
        d.polygon([(x - 48 * s, y - 2 * s), (x + 48 * s, y - 2 * s), (x, y + 60 * s)], fill=(235, 80, 110, al))
    layer(img, f, a)

def papel(img, x, y, s, a):
    def f(d, al):
        d.rounded_rectangle([x - 70 * s, y - 90 * s, x + 70 * s, y + 90 * s], radius=10, fill=(244, 240, 228, al))
        for k in range(5): d.line([(x - 50 * s, y - 60 * s + k * 28 * s), (x + (50 - (k == 4) * 40) * s, y - 60 * s + k * 28 * s)], fill=(120, 120, 150, al), width=4)
        d.line([(x + 40 * s, y + 70 * s), (x + 110 * s, y - 40 * s)], fill=GOLD + (al,), width=int(14 * s))
        d.polygon([(x + 40 * s, y + 70 * s), (x + 30 * s, y + 92 * s), (x + 52 * s, y + 80 * s)], fill=(60, 50, 40, al))
    layer(img, f, a)

def scene1(img, t, u):
    img.alpha_composite(background('ring'))
    rg = ring(470); img.alpha_composite(rg, (int(W / 2 - rg.width / 2), int(1000 - rg.height / 2)))
    particles(img, t, 70, 1, cy=1000, rmin=440, rmax=700)
    eo = clamp((t - .3) / .6) * (0.9 + .1 * math.sin(t * 5))   # olhos acendendo
    paste_nox(img, W / 2, 600, 1.2, max(.05, eo), 'none', 0)
    headline(img, SCENES[0]['hl'], .3, t)

def scene2(img, t, u):
    img.alpha_composite(background('plain'))
    tt = ctimes(1)
    a1 = ease(t / .4) * (1 - ease((t - (tt[3] - .3)) / .4))
    tv(img, 320, 640, 1.0, a1, t)
    k = ease((t - (tt[2] - .2)) / .4) * a1
    draw_text_line(img, 770, 560, [('CHEGA', WHITE)], 80, k, 7)
    draw_text_line(img, 770, 660, [('DE SHOW', GOLD)], 80, k, 7)
    a2 = ease((t - (tt[3] - .1)) / .4)
    ingresso(img, 600, 640, a2)
    a3 = ease((t - (tt[7] - .2)) / .4)
    dupla(img, 470, 920 + 6 * math.sin(t * 2), .75, GOLD, a2)
    dupla(img, 790, 920 + 6 * math.sin(t * 2 + 1), .75, WHITE, a3)
    draw_text_line(img, 470, 1130, [('C & X', GOLD)], 40, a2, 4)
    draw_text_line(img, 790, 1130, [('+ J & M', WHITE)], 40, a3, 4)
    paste_nox(img, 170, 1235, .55, 1.0, 'cross', 0)
    fonte(img, 'Billboard Brasil · O Liberal · Massa', ease(t / .5))
    headline(img, SCENES[1]['hl'], .3, t)

def scene3(img, t, u):
    img.alpha_composite(background('plain'))
    tt = ctimes(2)
    a = ease(t / .4)
    # linha do tempo 1970 -> 2026
    p = ease((t - .2) / 2.2)
    x0, x1, y = 140, 940, 820
    def f(d, al):
        d.rounded_rectangle([x0, y - 14, x1, y + 14], radius=14, fill=(60, 50, 90, al))
        d.rounded_rectangle([x0, y - 14, x0 + (x1 - x0) * p, y + 14], radius=14, fill=GOLD + (al,))
        for xx in (x0, x1): d.ellipse([xx - 26, y - 26, xx + 26, y + 26], fill=GOLD + (al,))
    layer(img, f, a)
    draw_text_line(img, x0 + 20, y + 50, [('1970', GOLD)], 60, ease((t - (tt[3] - .2)) / .4) if len(tt) > 3 else a, 6)
    draw_text_line(img, x1 - 20, y + 50, [('2026', WHITE)], 60, a, 6)
    draw_text_line(img, 540, 560, [(f'{int(round(56 * p))} ANOS', GOLD)], 130, a, 9)
    ah = ease((t - (tt[4] - .2)) / .4)
    coracao(img, 800 + 4 * math.sin(t * 4), 1060, 1.1 + .06 * math.sin(t * 6), ah)
    draw_text_line(img, 800, 1150, [('NAMORO NOS ANOS 70', WHITE)], 34, ah, 4)
    paste_nox(img, 220, 1180, .6, 1.15 if t < tt[2] else 1.0, 'raise' if t < tt[2] else 'none', 6 if t < tt[2] else 0)
    headline(img, SCENES[2]['hl'], .3, t)

def scene4(img, t, u):
    img.alpha_composite(background('plain'))
    tt = ctimes(3)
    swap = tt[8] - .3
    aA = ease(t / .4) * (1 - ease((t - swap) / .35))
    if aA > 0:
        draw_text_line(img, 540, 380, [('“EVIDÊNCIAS”', GOLD)], 70, aA, 7)
        kL = ease((t - (tt[3] - .2)) / .4) * aA
        card(img, 300, 760, 440, 520, WHITE, aA)
        draw_text_line(img, 300, 530, [('GRAVOU', WHITE)], 50, aA, 5)
        dupla(img, 300, 640, .55, GOLD, aA)
        draw_text_line(img, 300, 860, [('CHITÃOZINHO', GOLD)], 36, aA, 4)
        draw_text_line(img, 300, 905, [('& XORORÓ · 1990', GOLD)], 36, aA, 4)
        kR = ease((t - (tt[5] - .2)) / .4) * aA
        card(img, 780, 760, 440, 520, GOLD, kR)
        draw_text_line(img, 780, 530, [('COMPÔS', GOLD)], 50, kR, 5)
        papel(img, 760, 700, .9, kR)
        draw_text_line(img, 780, 860, [('JOSÉ AUGUSTO', WHITE)], 36, kR, 4)
        draw_text_line(img, 780, 905, [('& PAULO SÉRGIO VALLE', WHITE)], 30, kR, 4)
        if kL > 0: draw_text_line(img, 300, 1045, [('NÃO ESCREVEU', RED)], 42, kL, 4)
    aB = ease((t - swap) / .4)
    if aB > 0:
        card(img, 300, 760, 440, 400, GREEN, aB)
        draw_text_line(img, 300, 610, [('SAI DOS', WHITE)], 48, aB, 5)
        draw_text_line(img, 300, 670, [('PALCOS', WHITE)], 48, aB, 5)
        draw_text_line(img, 300, 780, [('SIM', GREEN)], 100, aB, 8)
        kB = ease((t - (tt[9] - .2)) / .4)
        card(img, 780, 760, 440, 400, RED, kB)
        draw_text_line(img, 780, 610, [('FIM DA', WHITE)], 48, kB, 5)
        draw_text_line(img, 780, 670, [('DUPLA', WHITE)], 48, kB, 5)
        draw_text_line(img, 780, 780, [('NÃO', RED)], 100, kB, 8)
        kC = ease((t - (tt[10] - .2)) / .4)
        draw_text_line(img, 540, 1010, [('CONTINUAM COMPONDO E GRAVANDO', GOLD)], 40, kC, 5)
    paste_nox(img, 190, 1265, .55, 1.0, 'raise' if t < tt[1] or (swap < t < tt[9]) else 'point', 0)
    fonte(img, 'Billboard Brasil · Rádio Senado · Rolling Stone', ease(t / .5))
    headline(img, SCENES[3]['hl'], .3, t)

def scene5(img, t, u):
    img.alpha_composite(background('ring'))
    rg = ring(470); a = ease(t / .8)
    rr = rg.copy(); rr.putalpha(rr.getchannel('A').point(lambda v: int(v * a)))
    img.alpha_composite(rr, (int(W / 2 - rg.width / 2), int(1000 - rg.height / 2)))
    particles(img, t, 60, 5, cy=1000, rmin=440, rmax=700)
    for k in range(4):
        q = (t * .35 + k / 4) % 1
        nota(img, 160 + k * 250 + 30 * math.sin(t + k), 1400 - q * 900, 1.1, .6 * a * math.sin(math.pi * q))
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
    z = 1 + 0.06 * ease(u) if si in (0, len(SCENES) - 1) else 1 + 0.035 * u
    if z > 1.001:
        cw, ch = W / z, H / z; x0 = (W - cw) / 2; y0 = (H * .5) - ch * .5
        img = img.resize((W, H), Image.BICUBIC, box=(x0, y0, x0 + cw, y0 + ch))
    # legenda (fora do zoom)
    for (a, b, c, s) in CAPS:
        if a <= T < b + (0.15 if s == len(SCENES) - 1 else 0):
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
