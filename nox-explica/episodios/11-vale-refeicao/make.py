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
    dict(min=5.0, hl=[('VALE-REFEIÇÃO', GOLD), ('VAI E VOLTA NA JUSTIÇA', WHITE)],
         caps=[('SABE O *VALE-REFEIÇÃO?', 0), ('EM *QUINZE *DIAS*,', 0), ('A JUSTIÇA VIROU', 0), ('AS REGRAS DELE', 0), ('*DUAS *VEZES.', 0), ('QUE PORRA É ESSA?', 0)]),
    dict(min=5.0, hl=[('TETO DE 3,6%', GOLD), ('REPASSE EM ATÉ 15 DIAS', WHITE)],
         caps=[('O *GOVERNO CRIOU', 0), ('UM *TETO:', 0), ('A OPERADORA COBRA', 0), ('NO MÁXIMO', 0), ('*3,6% DO *RESTAURANTE...', 0), ('E PAGA EM ATÉ', 0), ('*15 *DIAS*,', 0), ('NÃO *30.', 0)]),
    dict(min=5.0, hl=[('A TRETA NA JUSTIÇA', GOLD), ('NOVEMBRO DE 2026', WHITE)],
         caps=[('AS *OPERADORAS DIZEM', 0), ('QUE O GOVERNO PASSOU', 0), ('DO *LIMITE DA *LEI;', 0), ('O *GOVERNO FALA EM', 0), ('*8 *BILHÕES POR ANO', 0), ('EM JOGO.', 0), ('DIA *9*,', 0), ('UM JUIZ *SUSPENDEU.', 0), ('DIA *24*,', 0), ('O TRIBUNAL *DERRUBOU.', 0), ('PING-PONG DO CARALHO.', 0)]),
    dict(min=5.0, hl=[('NÃO CONFUNDIR', GOLD)],
         caps=[('MAS CALMA:', 0), ('ISSO É A *TAXA', 0), ('DO *RESTAURANTE.', 0), ('O *SALDO DO SEU CARTÃO', 0), ('*NÃO *MUDA.', 0)]),
    dict(min=4.0, hl=None, end_hold=1.0,
         caps=[('E AINDA É *PROVISÓRIO...', 0), ('ESSA MERDA', 0), ('VAI DAR *VOLTA.', 0), ('TEM OUTRA *TRETA', 0), ('QUE VOCÊ QUER ENTENDER?', 0), ('MANDA NOS *COMENTÁRIOS', 0), ('QUE *NOX EXPLICA.', 0)]),
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


def calendario(img, x, y, top, big, col, a):
    card(img, x, y, 360, 230, col, a)
    draw_text_line(img, x, y - 90, [(top, WHITE)], 40, a, 4)
    sz = 50
    while font(sz).getlength(big) > 320: sz -= 2
    draw_text_line(img, x, y - 10, [(big, col)], sz, a, 5)


def carimbo(img, x, y, txt, col, sz, ang, a):
    if a <= 0: return
    f = font(sz); w = int(f.getlength(txt)) + 70; h = int(sz * 1.6)
    L = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
    d.rounded_rectangle([4, 4, w - 4, h - 4], radius=16, outline=col + (int(255 * a),), width=9)
    d.text((35, h * .14), txt, font=f, fill=col + (int(255 * a),))
    sc = 1 + .5 * (1 - eout(a))
    L = L.resize((int(w * sc), int(h * sc)), Image.LANCZOS).rotate(ang, resample=Image.BICUBIC, expand=True)
    img.alpha_composite(L, (int(x - L.width / 2), int(y - L.height / 2)))


# ---------------- desenhos do tema (ícones genéricos, sem logos) ----------------
def cartao(img, x, y, s, a, ang=0):
    """cartão de benefício genérico (sem marca)"""
    if a <= 0: return
    w, h = int(520 * s), int(320 * s)
    L = Image.new('RGBA', (w + 20, h + 20), (0, 0, 0, 0)); d = ImageDraw.Draw(L)
    al = int(255 * a)
    d.rounded_rectangle([10, 10, w + 10, h + 10], radius=int(34 * s), fill=(36, 120, 90, al), outline=GOLD + (al,), width=max(2, int(6 * s)))
    d.rounded_rectangle([int(50 * s), int(110 * s), int(130 * s), int(170 * s)], radius=int(10 * s), fill=(230, 200, 110, al))
    d.text((int(50 * s), int(36 * s)), 'VALE-REFEIÇÃO', font=font(max(12, int(46 * s))), fill=(255, 255, 255, al))
    d.text((int(50 * s), int(210 * s)), '•••• •••• ••••', font=font(max(12, int(40 * s))), fill=(220, 240, 230, al))
    # garfo e faca simples
    fx = int(430 * s)
    d.rectangle([fx, int(110 * s), fx + int(8 * s), int(260 * s)], fill=(255, 255, 255, al))
    for k in range(3): d.rectangle([fx - int(18 * s) + k * int(16 * s), int(100 * s), fx - int(12 * s) + k * int(16 * s), int(160 * s)], fill=(255, 255, 255, al))
    if abs(ang) > .05: L = L.rotate(ang, resample=Image.BICUBIC, expand=True)
    img.alpha_composite(L, (int(x - L.width / 2), int(y - L.height / 2)))

def restaurante(img, x, y, s, a):
    def f(d, al):
        d.rectangle([x - 170 * s, y - 40 * s, x + 170 * s, y + 190 * s], fill=(60, 50, 90, al))
        for k in range(6):
            c = RED if k % 2 == 0 else (240, 240, 245)
            d.rectangle([x - 180 * s + k * 60 * s, y - 110 * s, x - 120 * s + k * 60 * s, y - 40 * s], fill=c + (al,))
            d.pieslice([x - 180 * s + k * 60 * s, y - 70 * s, x - 120 * s + k * 60 * s, y - 10 * s], 0, 180, fill=c + (al,))
        d.rectangle([x - 40 * s, y + 60 * s, x + 40 * s, y + 190 * s], fill=(30, 24, 54, al))
        d.rectangle([x - 145 * s, y + 40 * s, x - 75 * s, y + 120 * s], fill=(150, 180, 230, al))
        d.rectangle([x + 75 * s, y + 40 * s, x + 145 * s, y + 120 * s], fill=(150, 180, 230, al))
    layer(img, f, a)
    draw_text_line(img, x, y + 200 * s, [('RESTAURANTE', WHITE)], int(36 * s), a, 4)

def moeda(img, x, y, r, txt, a):
    def f(d, al):
        d.ellipse([x - r, y - r, x + r, y + r], fill=GOLD + (al,), outline=(200, 140, 20, al), width=6)
    layer(img, f, a)
    sz = int(r * .7)
    while font(sz).getlength(txt) > r * 1.6: sz -= 2
    draw_text_line(img, x, y - sz * .62, [(txt, (60, 40, 10))], sz, a, 0)

def risco(img, x0, y0, x1, y1, a, col=RED):
    layer(img, lambda d, al: d.line([(x0, y0), (x1, y1)], fill=col + (al,), width=12), a)

def raquete(d, x, y, s, col, al, ang):
    ca, sa = math.cos(ang), math.sin(ang)
    d.ellipse([x - 70 * s, y - 80 * s, x + 70 * s, y + 80 * s], fill=col + (al,), outline=(20, 16, 30, al), width=5)
    hx, hy = x + sa * 120 * s, y + ca * 120 * s
    d.line([(x + sa * 75 * s, y + ca * 75 * s), (hx, hy)], fill=(140, 100, 60, al), width=int(26 * s))

# ---------------- cenas ----------------
def scene1(img, t, u):
    img.alpha_composite(background('ring'))
    rg = ring(470); img.alpha_composite(rg, (int(W / 2 - rg.width / 2), int(1000 - rg.height / 2)))
    particles(img, t, 70, 1, cy=1000, rmin=440, rmax=700)
    tt = ctimes(0)
    eo = clamp((t - .3) / .6) * (0.9 + .1 * math.sin(t * 5))
    sus = t > tt[1] - .2
    # cartão girando de um lado pro outro (vai e volta)
    kc = ease((t - (tt[0] + .3)) / .4) * (1 - ease((t - (tt[4] + .4)) / .4))
    sw = math.sin(t * 3.2) * 10
    cartao(img, W / 2 + 330 * math.sin(t * 1.6), 500, .55, kc, sw)
    paste_nox(img, W / 2, 600, 1.2, max(.05, eo * (.65 if sus else 1)), 'none', 6 * ease((t - tt[5]) / .5))
    headline(img, SCENES[0]['hl'], .3, t)

def scene2(img, t, u):
    img.alpha_composite(background('plain'))
    tt = ctimes(1)
    a = ease(t / .4)
    cartao(img, 300, 600 + 6 * math.sin(t * 2), .6, a, -6)
    restaurante(img, 790, 620, 1.0, ease((t - (tt[2] - .2)) / .4))
    # seta com a taxa
    k = ease((t - (tt[3] - .2)) / .4)
    layer(img, lambda d, al: (d.line([(470, 600), (580, 600)], fill=GOLD + (al,), width=10), arrow_head(d, 600, 600, 0, 30, GOLD + (al,))), k)
    k2 = ease((t - (tt[4] - .2)) / .4)
    card(img, 540, 960, 860, 170, GOLD, k2)
    draw_text_line(img, 540, 895, [('EM R$ 100,', WHITE), ('TAXA MÁX. R$ 3,60', GOLD)], 48, k2, 4)
    draw_text_line(img, 540, 960, [('(TETO DE 3,6%)', (200, 190, 230))], 36, k2, 3)
    # prazo 30 -> 15 dias
    k3 = ease((t - (tt[5] - .2)) / .4)
    calendario(img, 330, 1200, 'ANTES', '30 DIAS', (190, 180, 210), k3 * 1)
    risco(img, 200, 1260, 460, 1150, ease((t - (tt[7] - .2)) / .3))
    k4 = ease((t - (tt[6] - .2)) / .4)
    calendario(img, 770, 1200, 'AGORA', 'ATÉ 15 DIAS', GREEN, k4)
    paste_nox(img, 900, 1330, .42, 1.0, 'point', 0)
    fonte(img, 'IstoÉ · Campo Grande News · Forbes · InfoMoney', ease(t / .5))
    headline(img, SCENES[1]['hl'], .3, t)

def scene3(img, t, u):
    img.alpha_composite(background('plain'))
    tt = ctimes(2)
    a = ease(t / .4)
    # os dois lados
    card(img, 290, 600, 460, 260, RED, a)
    draw_text_line(img, 290, 500, [('OPERADORAS', RED)], 44, a, 4)
    for i, s in enumerate(['“O GOVERNO PASSOU', 'DO LIMITE DA LEI”']):
        draw_text_line(img, 290, 570 + i * 50, [(s, WHITE)], 32, ease((t - (tt[1] - .2)) / .4), 3)
    kg = ease((t - (tt[3] - .2)) / .4)
    card(img, 790, 600, 460, 260, GREEN, a)
    draw_text_line(img, 790, 500, [('GOVERNO', GREEN)], 44, a, 4)
    for i, s in enumerate(['“R$ 8 BILHÕES', 'POR ANO EM JOGO”']):
        draw_text_line(img, 790, 570 + i * 50, [(s, WHITE)], 32, kg, 3)
    # linha do tempo 09/11 -> 24/11
    y = 920
    kt = ease((t - (tt[6] - .2)) / .4)
    def f(d, al):
        d.rounded_rectangle([150, y - 10, 930, y + 10], radius=10, fill=(70, 60, 100, al))
    layer(img, f, kt)
    k9 = ease((t - (tt[6] - .2)) / .4)
    moeda(img, 300, y, 72, '9/11', k9)
    draw_text_line(img, 300, y + 90, [('JUIZ', WHITE)], 34, ease((t - (tt[7] - .2)) / .4), 3)
    draw_text_line(img, 300, y + 133, [('SUSPENDE', RED)], 38, ease((t - (tt[7] - .2)) / .4), 4)
    k24 = ease((t - (tt[8] - .2)) / .4)
    moeda(img, 780, y, 72, '24/11', k24)
    draw_text_line(img, 780, y + 90, [('TRF-1 DERRUBA', WHITE)], 34, ease((t - (tt[9] - .2)) / .4), 3)
    draw_text_line(img, 780, y + 133, [('REGRAS VOLTAM', GREEN)], 38, ease((t - (tt[9] - .2)) / .4), 4)
    # bolinha de ping-pong
    kb = ease((t - (tt[6] - .2)) / .4)
    if kb > 0:
        q = (t * 1.1) % 2; q = q if q < 1 else 2 - q
        bx = lerp(330, 750, ease(q)); by = y - 70 - 90 * math.sin(math.pi * q)
        layer(img, lambda d, al: d.ellipse([bx - 20, by - 20, bx + 20, by + 20], fill=(250, 250, 250, al)), kb)
    carimbo(img, 540, 1190, 'PING-PONG', GOLD, 90, -5, ease((t - (tt[10] - .1)) / .3))
    paste_nox(img, 170, 1260, .5, .8 if t > tt[10] - .2 else 1.0, 'raise' if t < tt[6] else 'cross', 0)
    fonte(img, 'IstoÉ · Campo Grande News · Gazeta do Paraná · Times Brasil', ease(t / .5))
    headline(img, SCENES[2]['hl'], .3, t)

def scene4(img, t, u):
    img.alpha_composite(background('plain'))
    tt = ctimes(3)
    a = ease(t / .4)
    ka = ease((t - (tt[1] - .2)) / .4)
    card(img, 290, 700, 460, 560, GOLD, ka)
    draw_text_line(img, 290, 450, [('TAXA DO', WHITE)], 42, ka, 4)
    draw_text_line(img, 290, 500, [('RESTAURANTE', GOLD)], 42, ka, 4)
    restaurante(img, 290, 690, .7, ka)
    draw_text_line(img, 290, 880, [('ESTA MUDOU', GOLD)], 40, ease((t - (tt[2] - .2)) / .4), 4)
    kb = ease((t - (tt[3] - .2)) / .4)
    card(img, 790, 700, 460, 560, GREEN, kb)
    draw_text_line(img, 790, 450, [('SALDO DO', WHITE)], 42, kb, 4)
    draw_text_line(img, 790, 500, [('SEU CARTÃO', GREEN)], 42, kb, 4)
    cartao(img, 790, 680, .72, kb, 4 * math.sin(t * 2))
    draw_text_line(img, 790, 880, [('NÃO MUDA', GREEN)], 46, ease((t - (tt[4] - .2)) / .4), 4)
    paste_nox(img, 170, 1290, .5, 1.0, 'raise' if t < tt[1] else 'point', 0)
    fonte(img, 'IstoÉ · Campo Grande News · Jornal Contábil', ease(t / .5))
    headline(img, SCENES[3]['hl'], .3, t)

def scene5(img, t, u):
    img.alpha_composite(background('ring'))
    rg = ring(470); a = ease(t / .8)
    rr = rg.copy(); rr.putalpha(rr.getchannel('A').point(lambda v: int(v * a)))
    img.alpha_composite(rr, (int(W / 2 - rg.width / 2), int(1000 - rg.height / 2)))
    particles(img, t, 60, 5, cy=1000, rmin=440, rmax=700)
    tt = ctimes(4)
    ae = ease(t / .4) * (1 - ease((t - (tt[3] - .3)) / .4))
    if ae > 0:
        card(img, W / 2, 300 + 5 * math.sin(t * 2), 760, 220, GOLD, ae)
        draw_text_line(img, W / 2, 225, [('DECISÃO PROVISÓRIA', GOLD)], 58, ae, 5)
        draw_text_line(img, W / 2, 305, [('RECURSO AINDA VAI PRA', WHITE)], 36, ae, 3)
        draw_text_line(img, W / 2, 350, [('12ª TURMA DO TRF-1', WHITE)], 36, ae, 3)
    eo = lerp(.65, .45, ease((t - tt[3]) / 1.0))
    paste_nox(img, W / 2, 600, 1.2, eo, 'cross', -3 * ease((t - tt[3]) / 1))
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
