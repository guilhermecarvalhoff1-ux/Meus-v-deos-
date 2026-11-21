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
    dict(min=5.0, hl=[('CLEÓPATRA', GOLD), ('MAIS PERTO DA LUA', WHITE), ('QUE DA PIRÂMIDE', WHITE)],
         caps=[('A *CLEÓPATRA* VIVEU', 0), ('MAIS PERTO DO HOMEM', 0), ('PISANDO NA *LUA*...', 0), ('DO QUE DA CONSTRUÇÃO', 0), ('DA *GRANDE *PIRÂMIDE*.', 0), ('QUE PORRA É ESSA?', 0)]),
    dict(min=9.0, hl=[('PIRÂMIDE · ~2560 a.C.', WHITE), ('CLEÓPATRA · 69 a.C.', GOLD)],
         caps=[('A GRANDE PIRÂMIDE', 0), ('DE *GIZÉ* FICOU PRONTA', 0), ('LÁ POR *2560*', 0), ('ANTES DE CRISTO.', 0), ('A CLEÓPATRA NASCEU', 0),
               ('EM *69* ANTES DE CRISTO.', 0), ('QUASE *DOIS *MIL E *QUINHENTOS*', 0), ('ANOS DEPOIS, CARALHO.', 0)]),
    dict(min=8.0, hl=[('LUA · 1969', WHITE), ('MAIS PERTO DA LUA', GOLD)],
         caps=[('E O HOMEM PISOU', 0), ('NA *LUA* EM *1969*.', 0), ('DA CLEÓPATRA ATÉ A LUA,', 0), ('DÁ UNS *DOIS *MIL ANOS.', 0)]),
    dict(min=9.0, hl=[('CLEÓPATRA ≠ EGÍPCIA', WHITE), ('FAMÍLIA GREGA', GOLD)],
         caps=[('SÓ NÃO CONFUNDE:', 0), ('A CLEÓPATRA NÃO ERA', 0), ('*EGÍPCIA* DE SANGUE.', 0), ('A FAMÍLIA DELA', 0), ('ERA *GREGA*,', 0), ('DA *MACEDÔNIA*.', 0),
               ('E ELA FOI A PRIMEIRA', 0), ('DA FAMÍLIA', 0), ('A FALAR *EGÍPCIO*.', 0)]),
    dict(min=6.0, hl=None, end_hold=0.6,
         caps=[('*NOX* ACHA QUE', 0), ('O EGITO ANTIGO', 0), ('ERA ANTIGO', 0), ('ATÉ PROS *ANTIGOS*.', 0),
               ('ACHOU MAIS ALGUMA', .5), ('MERDA SEM SENTIDO', 0), ('POR AÍ?', 0), ('MANDA NOS *COMENTÁRIOS*', 0), ('QUE *NOX* EXPLICA.', 0)]),
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

def giza(img, x, y, s, a):
    """Grande Pirâmide: duas faces (luz e sombra), fiadas de pedra e topo dourado"""
    def f(d, al):
        h, w = 300 * s, 400 * s
        d.polygon([(x - w / 2, y), (x, y - h), (x, y)], fill=STONE + (al,))
        d.polygon([(x, y), (x, y - h), (x + w / 2, y)], fill=STONE_D + (al,))
        for k in range(1, 9):
            yy = y - h * k / 9; half = w / 2 * (1 - k / 9)
            d.line([(x - half, yy), (x + half, yy)], fill=(120, 96, 60, int(al * .5)), width=max(1, int(3 * s)))
        d.polygon([(x - 26 * s, y - h + 40 * s), (x, y - h), (x + 26 * s, y - h + 40 * s)], fill=GOLD + (al,))
        d.rectangle([x - w / 2 - 30 * s, y, x + w / 2 + 30 * s, y + 12 * s], fill=(190, 160, 110, al))
    layer(img, f, a)

def cleo(img, x, y, s, a):
    """Cleópatra estilizada: cabelo chanel preto, faixa dourada com cobra, delineado, colar"""
    def f(d, al):
        d.pieslice([x - 130 * s, y - 70 * s, x + 130 * s, y + 210 * s], 180, 360, fill=(212, 168, 70, al))            # colar
        d.rectangle([x - 34 * s, y - 40 * s, x + 34 * s, y + 70 * s], fill=(176, 120, 78, al))                         # pescoço
        d.rectangle([x - 118 * s, y - 210 * s, x + 118 * s, y + 40 * s], fill=(18, 16, 22, al))                         # cabelo
        d.ellipse([x - 84 * s, y - 196 * s, x + 84 * s, y + 6 * s], fill=(196, 140, 94, al))                            # rosto
        d.rectangle([x - 104 * s, y - 214 * s, x + 104 * s, y - 132 * s], fill=(18, 16, 22, al))                        # franja
        d.rectangle([x - 112 * s, y - 150 * s, x + 112 * s, y - 132 * s], fill=GOLD + (al,))                             # faixa
        d.polygon([(x - 14 * s, y - 150 * s), (x, y - 200 * s), (x + 14 * s, y - 150 * s)], fill=GOLD + (al,))          # cobra
        for sx in (-1, 1):
            ex = x + sx * 36 * s
            d.ellipse([ex - 14 * s, y - 104 * s, ex + 14 * s, y - 88 * s], fill=(250, 250, 250, al))
            d.ellipse([ex - 6 * s, y - 102 * s, ex + 6 * s, y - 90 * s], fill=(20, 16, 20, al))
            d.line([(ex - 16 * s, y - 96 * s), (ex + sx * 30 * s, y - 106 * s)], fill=(20, 16, 20, al), width=max(1, int(5 * s)))
        d.line([(x - 22 * s, y - 40 * s), (x + 22 * s, y - 40 * s)], fill=(150, 60, 60, al), width=max(1, int(6 * s)))
    layer(img, f, a)

def lua(img, x, y, s, a, t=0):
    """Lua com crateras e a bandeirinha fincada"""
    def f(d, al):
        r = 150 * s
        d.ellipse([x - r, y - r, x + r, y + r], fill=(214, 216, 224, al))
        d.ellipse([x - r + 30 * s, y - r + 20 * s, x + r, y + r], fill=(196, 198, 208, al))
        for cx, cy, cr in [(-.4, -.3, .22), (.3, .1, .16), (-.1, .45, .12), (.45, -.45, .1), (-.55, .25, .09)]:
            d.ellipse([x + cx * r - cr * r, y + cy * r - cr * r, x + cx * r + cr * r, y + cy * r + cr * r], fill=(168, 170, 182, al))
        px, py = x + 40 * s, y - r + 10 * s
        d.line([(px, py), (px, py - 120 * s)], fill=(240, 240, 240, al), width=max(2, int(6 * s)))
        wv = 6 * math.sin(t * 4) * s
        d.polygon([(px, py - 120 * s), (px + 80 * s, py - 110 * s + wv), (px + 80 * s, py - 70 * s + wv), (px, py - 80 * s)], fill=(240, 240, 240, al))
    layer(img, f, a)

def templo(img, x, y, s, a):
    """templo grego: frontão, colunas e base"""
    def f(d, al):
        w = 300 * s
        d.polygon([(x - w / 2 - 20 * s, y - 230 * s), (x, y - 310 * s), (x + w / 2 + 20 * s, y - 230 * s)], fill=(236, 230, 214, al))
        d.rectangle([x - w / 2 - 20 * s, y - 232 * s, x + w / 2 + 20 * s, y - 210 * s], fill=(220, 212, 194, al))
        for k in range(5):
            cx = x - w / 2 + 15 * s + k * (w - 30 * s) / 4
            d.rectangle([cx - 16 * s, y - 210 * s, cx + 16 * s, y - 20 * s], fill=(236, 230, 214, al))
            d.line([(cx - 5 * s, y - 205 * s), (cx - 5 * s, y - 25 * s)], fill=(190, 182, 164, al), width=max(1, int(3 * s)))
        d.rectangle([x - w / 2 - 30 * s, y - 20 * s, x + w / 2 + 30 * s, y], fill=(220, 212, 194, al))
    layer(img, f, a)

def scene1(img, t, u):
    img.alpha_composite(background('ring'))
    rg = ring(470); img.alpha_composite(rg, (int(W / 2 - rg.width / 2), int(1000 - rg.height / 2)))
    particles(img, t, 70, 1, cy=1000, rmin=440, rmax=700)
    tt = ctimes(0)
    giza(img, 190, 1360, .55, ease((t - (tt[4] - .2)) / .4))
    lua(img, 900, 1240, .55, ease((t - (tt[2] - .2)) / .4), t)
    q = caps_of(0)[5][0] - SCENES[0]['t0']
    tilt = 6 * ease((t - .6) / 1.0)
    eo = lerp(.75, .5, ease((t - .8) / .8))
    paste_nox(img, W / 2, 600, 1.2, eo, 'raise' if t >= q - .15 else 'none', tilt)
    headline(img, SCENES[0]['hl'], .5, t)

def scene2(img, t, u):
    img.alpha_composite(background('plain'))
    tt = ctimes(1)
    pan = 20 * math.sin(t * .4)
    giza(img, 300 + pan, 900, .8, ease(t / .4))
    cleo(img, 800 + pan, 860, .8, ease((t - (tt[4] - .2)) / .4))
    d = ImageDraw.Draw(img)
    x0, x1, ty = 300, 800, 1120
    reach = ease((t - tt[6]) / 1.0)
    d.line([(x0, ty), (x1, ty)], fill=(255, 255, 255, 90), width=6)
    d.line([(x0, ty), (lerp(x0, x1, reach), ty)], fill=GOLD + (255,), width=10)
    for yr, x, tin in [('~2560 a.C.', x0, tt[2]), ('69 a.C.', x1, tt[5])]:
        on = t >= tin - .1
        d.ellipse([x - 18, ty - 18, x + 18, ty + 18], fill=(GOLD if on else (90, 80, 120)) + (255,))
        draw_text_line(img, x, ty + 30, [(yr, GOLD if on else (150, 140, 180))], 46, 1.0, 5)
        d = ImageDraw.Draw(img)
    a = ease((t - (tt[6] - .1)) / .35)
    if a > 0: draw_text_line(img, (x0 + x1) / 2, ty - 100 - 20 * (1 - a), [('≈ 2.500 ANOS', GOLD)], 58, a, 6)
    paste_nox(img, 190, 1235, .6, 1.0, 'point' if t > .4 else 'none', 0, 10)
    headline(img, SCENES[1]['hl'], .6, t)

def scene3(img, t, u):
    img.alpha_composite(background('plain'))
    tt = ctimes(2)
    X0, X1, Y0, Y1 = 130, 960, -2700, 2030
    def px(yr): return X0 + (yr - Y0) / (Y1 - Y0) * (X1 - X0)
    d = ImageDraw.Draw(img)
    ay = 1080
    d.line([(X0, ay), (X1, ay)], fill=(255, 255, 255, 110), width=4)
    for yr, lab in [(-2560, '2560 a.C.'), (-69, '69 a.C.'), (1969, '1969')]:
        d.line([(px(yr), ay - 12), (px(yr), ay + 12)], fill=(255, 255, 255, 160), width=4)
        draw_text_line(img, px(yr), ay + 22, [(lab, (200, 190, 230))], 32, 1.0, 3); d = ImageDraw.Draw(img)
    giza(img, px(-2560), 860, .42, 1)
    cleo(img, px(-69), 850, .4, 1)
    lua(img, px(1969), 820, .42, ease((t - (tt[1] - .2)) / .4), t)
    # barras: pirâmide → Cleópatra (longa) e Cleópatra → Lua (mais curta)
    g1 = ease((t - .2) / .9); g2 = ease((t - (tt[2] - .1)) / .9)
    d = ImageDraw.Draw(img)
    if g1 > 0:
        d.rounded_rectangle([px(-2560), 1180, lerp(px(-2560), px(-69), g1), 1240], radius=16, fill=(235, 80, 80, 255))
        draw_text_line(img, (px(-2560) + px(-69)) / 2, 1250, [('2.491 ANOS', (255, 150, 150))], 44, g1, 5)
    if g2 > 0:
        d = ImageDraw.Draw(img)
        d.rounded_rectangle([px(-69), 1330, lerp(px(-69), px(1969), g2), 1390], radius=16, fill=GOLD + (255,))
        draw_text_line(img, (px(-69) + px(1969)) / 2, 1400, [('2.038 ANOS', GOLD)], 44, g2, 5)
    paste_nox(img, 190, 1265, .55, 1.15 if t > tt[3] else 1.0, 'point' if t > .4 else 'none', -3 * ease(t / 3))
    headline(img, SCENES[2]['hl'], .6, t)

def scene4(img, t, u):
    img.alpha_composite(background('plain'))
    tt = ctimes(3)
    a = ease((t - (tt[1] - .2)) / .4)
    if a > 0:
        layer(img, lambda d, al: d.rounded_rectangle([90, 430, 510, 1010], radius=28, fill=(30, 24, 54, int(230 * a)), outline=(235, 80, 80, al), width=6), a)
        giza(img, 300, 820, .55, a)
        draw_text_line(img, 300, 860, [('EGÍPCIA?', WHITE)], 50, a, 5)
        x = ease((t - (tt[2] - .1)) / .3)
        if x > 0:
            layer(img, lambda d, al: (d.line([(150, 520), (450, 820)], fill=(235, 80, 80, al), width=22), d.line([(450, 520), (150, 820)], fill=(235, 80, 80, al), width=22)), x)
    b = ease((t - (tt[4] - .2)) / .4)
    if b > 0:
        layer(img, lambda d, al: d.rounded_rectangle([570, 430, 990, 1010], radius=28, fill=(30, 24, 54, int(230 * b)), outline=(90, 210, 130, al), width=6), b)
        templo(img, 780, 820, .75, b)
        draw_text_line(img, 780, 860, [('GREGA', GOLD)], 50, b, 5)
        draw_text_line(img, 780, 930, [('MACEDÔNIA', WHITE)], 34, ease((t - (tt[5] - .1)) / .3), 4)
    c = ease((t - (tt[6] - .15)) / .4)
    if c > 0:
        bx, by = 640, 1150; sc = lerp(.85, 1, c)
        layer(img, lambda d, al: d.rounded_rectangle([bx - 300 * sc, by - 60 * sc, bx + 300 * sc, by + 60 * sc], radius=30, fill=(60, 44, 20, int(235 * c)), outline=GOLD + (al,), width=6), c)
        draw_text_line(img, bx, by - 34, [('1ª A FALAR', WHITE), ('EGÍPCIO', GOLD)], 48, c, 5)
    raise_t = ease((t - .2) / .5)
    paste_nox(img, 190, lerp(1265, 1235, raise_t), .6, 1.0, 'raise' if t > .2 else 'none', 0)
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
