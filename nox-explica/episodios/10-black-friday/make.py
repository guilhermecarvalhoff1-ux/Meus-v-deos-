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
    dict(min=5.0, hl=[('POR QUE “BLACK FRIDAY”?', GOLD), ('SEXTA, 27/11', WHITE)],
         caps=[('BLACK *FRIDAY', 0), ('É NESSA *SEXTA...', 0), ('E TEM GENTE JURANDO', 0), ('QUE O NOME VEM', 0), ('DE VENDA DE *ESCRAVIZADOS.', 0), ('CALMA, QUE *NOX EXPLICA.', 0)]),
    dict(min=5.0, hl=[('POLÍCIA DA FILADÉLFIA', GOLD), ('ANOS 1950–60', WHITE)],
         caps=[('O NOME VEIO DA', 0), ('*POLÍCIA DA *FILADÉLFIA*,', 0), ('NOS ANOS *50 E *60:', 0), ('DEPOIS DO FERIADO', 0), ('DE *AÇÃO DE *GRAÇAS*,', 0), ('A CIDADE VIRAVA', 0), ('UM *CAOS.', 0), ('DIA INFERNAL', 0), ('PRA CARALHO.', 0)]),
    dict(min=4.0, hl=[('DO VERMELHO PRO PRETO', GOLD), ('A VERSÃO DAS LOJAS (ANOS 80)', WHITE)],
         caps=[('AÍ AS *LOJAS', 0), ('INVENTARAM OUTRA VERSÃO:', 0), ('O DIA EM QUE AS CONTAS', 0), ('SAEM DO *VERMELHO', 0), ('PRO *PRETO.', 0), ('*MARKETING, PORRA.', 0)]),
    dict(min=5.0, hl=[('NÃO CONFUNDIR', GOLD)],
         caps=[('AGORA, O *BOATO', 0), ('DA ESCRAVIDÃO: *FALSO.', 0), ('ELA ACABOU', 0), ('NOS *ESTADOS *UNIDOS', 0), ('EM *1865*,', 0), ('QUASE *CEM *ANOS ANTES', 0), ('DO NOME PEGAR.', 0)]),
    dict(min=4.0, hl=None, end_hold=1.0,
         caps=[('NO *BRASIL*,', 0), ('O PERIGO É OUTRO:', 0), ('A *METADE DO *DOBRO...', 0), ('SOBEM O *PREÇO ANTES', 0), ('PRA FINGIR *DESCONTO.', 0), ('ACHOU MAIS ALGUMA', 0), ('MERDA SEM SENTIDO POR AÍ?', 0), ('MANDA NOS *COMENTÁRIOS', 0), ('QUE *NOX EXPLICA.', 0)]),
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


# ---------------- desenhos do tema (ícones genéricos, sem logos) ----------------
def bone_policia(img, x, y, s, a):
    def f(d, al):
        d.polygon([(x - 120 * s, y + 10 * s), (x + 120 * s, y + 10 * s), (x + 150 * s, y - 90 * s), (x - 150 * s, y - 90 * s)], fill=(28, 40, 90, al))
        d.rounded_rectangle([x - 125 * s, y, x + 125 * s, y + 36 * s], radius=int(8 * s), fill=(18, 22, 40, al))
        d.pieslice([x - 140 * s, y + 10 * s, x + 140 * s, y + 80 * s], 0, 180, fill=(14, 16, 30, al))
        d.polygon([(x, y - 75 * s), (x + 32 * s, y - 50 * s), (x + 22 * s, y - 10 * s), (x - 22 * s, y - 10 * s), (x - 32 * s, y - 50 * s)], fill=GOLD + (al,))
    layer(img, f, a)

def carro(d, x, y, s, col, al):
    d.rounded_rectangle([x - 70 * s, y - 30 * s, x + 70 * s, y + 18 * s], radius=int(14 * s), fill=col + (al,))
    d.rounded_rectangle([x - 40 * s, y - 62 * s, x + 34 * s, y - 24 * s], radius=int(12 * s), fill=col + (al,))
    d.rectangle([x - 32 * s, y - 54 * s, x + 26 * s, y - 32 * s], fill=(160, 190, 230, al))
    for wx in (-42, 42): d.ellipse([x + (wx - 18) * s, y + 2 * s, x + (wx + 18) * s, y + 38 * s], fill=(15, 12, 22, al))

def transito(img, y, a, t):
    cols = [(220, 70, 70), (70, 130, 220), (240, 190, 60), (120, 200, 140), (200, 120, 220), (230, 230, 235)]
    def f(d, al):
        d.rectangle([60, y + 40, 1020, y + 60], fill=(70, 66, 90, al))
        for row in range(2):
            for k in range(6):
                x = 140 + k * 160 + row * 70 + 6 * math.sin(t * 9 + k * 2 + row)
                carro(d, x, y - row * 110, .9, cols[(k + row * 3) % 6], al)
    layer(img, f, a)

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

def loja(img, x, y, s, a):
    def f(d, al):
        d.rectangle([x - 180 * s, y - 40 * s, x + 180 * s, y + 200 * s], fill=(60, 50, 90, al))
        for k in range(6):
            c = GOLD if k % 2 == 0 else (240, 240, 245)
            d.pieslice([x - 180 * s + k * 60 * s, y - 70 * s, x - 120 * s + k * 60 * s, y - 10 * s], 0, 180, fill=c + (al,))
            d.rectangle([x - 180 * s + k * 60 * s, y - 120 * s, x - 120 * s + k * 60 * s, y - 40 * s], fill=c + (al,))
        d.rectangle([x - 50 * s, y + 60 * s, x + 50 * s, y + 200 * s], fill=(30, 24, 54, al))
        d.rectangle([x - 150 * s, y + 40 * s, x - 80 * s, y + 120 * s], fill=(150, 180, 230, al))
        d.rectangle([x + 80 * s, y + 40 * s, x + 150 * s, y + 120 * s], fill=(150, 180, 230, al))
    layer(img, f, a)

def livro_caixa(img, x, y, a, kr, kb, t):
    def f(d, al):
        d.rounded_rectangle([x - 360, y - 260, x + 360, y + 260], radius=22, fill=(244, 238, 222, al))
        for k in range(8): d.line([(x - 320, y - 150 + k * 50), (x + 320, y - 150 + k * 50)], fill=(200, 196, 220, al), width=3)
        d.line([(x - 200, y - 230), (x - 200, y + 240)], fill=(230, 150, 150, al), width=3)
    layer(img, f, a)
    L = Image.new('RGBA', img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(L)
    d.text((x - 300, y - 230), 'CONTAS DA LOJA', font=font(46), fill=(40, 34, 60, int(255 * a)))
    if kr > 0:
        d.text((x - 300, y - 120), 'PREJUÍZO', font=font(56), fill=(200, 40, 40, int(255 * kr)))
        d.text((x + 70, y - 120), '− R$', font=font(56), fill=(200, 40, 40, int(255 * kr)))
    if kb > 0:
        d.text((x - 300, y + 60), 'LUCRO', font=font(56), fill=(10, 10, 14, int(255 * kb)))
        d.text((x + 70, y + 60), '+ R$', font=font(56), fill=(10, 10, 14, int(255 * kb)))
        q = eout(kb)
        d.line([(x + 250, y - 40), (x + 250, y - 40 + 80 * q)], fill=(60, 60, 80, int(255 * kb)), width=10)
        arrow_head(d, x + 250, y - 40 + 80 * q + 6, math.pi / 2, 30, (60, 60, 80, int(255 * kb)))
    img.alpha_composite(L)

def etiqueta(img, x, y, a, stage, t):
    """etiqueta de preço: R$ 100 -> DE R$ 200 (-50%) -> POR R$ 100"""
    if a <= 0: return
    card(img, x, y, 640, 250, GOLD, a)
    def f(d, al): d.ellipse([x - 300, y - 18, x - 264, y + 18], fill=(10, 8, 18, al))
    layer(img, f, a)
    if stage == 0:
        draw_text_line(img, x + 20, y - 100, [('PREÇO NORMAL', WHITE)], 40, a, 4)
        draw_text_line(img, x + 20, y - 40, [('R$ 100', WHITE)], 90, a, 7)
    elif stage == 1:
        draw_text_line(img, x + 20, y - 100, [('SOBE ANTES', RED)], 40, a, 4)
        draw_text_line(img, x + 20, y - 40, [('R$ 200', RED)], 90, a, 7)
    else:
        draw_text_line(img, x - 70, y - 100, [('DE R$ 200', (190, 180, 210))], 40, a, 4)
        layer(img, lambda d, al: d.line([(x - 190, y - 70), (x + 50, y - 70)], fill=RED + (al,), width=6), a)
        draw_text_line(img, x + 190, y - 100, [('−50%', GREEN)], 44, a, 4)
        draw_text_line(img, x + 20, y - 40, [('POR R$ 100', GOLD)], 84, a, 7)

# ---------------- cenas ----------------
def scene1(img, t, u):
    img.alpha_composite(background('ring'))
    rg = ring(470); img.alpha_composite(rg, (int(W / 2 - rg.width / 2), int(1000 - rg.height / 2)))
    particles(img, t, 70, 1, cy=1000, rmin=440, rmax=700)
    tt = ctimes(0)
    eo = clamp((t - .3) / .6) * (0.9 + .1 * math.sin(t * 5))   # olhos acendendo
    sus = tt[2] - .2 < t < tt[5] - .2                           # desconfiado com o boato
    paste_nox(img, W / 2, 600, 1.2, max(.05, eo * (.7 if sus else 1)), 'none', 5 * ease((t - tt[2]) / .5) * (1 - ease((t - tt[5]) / .4)))
    headline(img, SCENES[0]['hl'], .3, t)

def scene2(img, t, u):
    img.alpha_composite(background('plain'))
    tt = ctimes(1)
    a1 = ease(t / .4) * (1 - ease((t - (tt[3] - .3)) / .4))
    bone_policia(img, 330, 640 + 8 * math.sin(t * 2), 1.2, a1)
    draw_text_line(img, 760, 560, [('FILADÉLFIA', GOLD)], 62, a1, 6)
    draw_text_line(img, 760, 650, [('EUA', WHITE)], 54, a1, 5)
    draw_text_line(img, 760, 740, [('1950–60', WHITE)], 54, ease((t - (tt[2] - .2)) / .4) * a1, 5)
    a2 = ease((t - (tt[3] - .2)) / .4) * (1 - ease((t - (tt[5] - .3)) / .4))
    calendario(img, 320, 640, 'QUINTA', 'AÇÃO DE GRAÇAS', WHITE, a2)
    k = ease((t - (tt[4] - .1)) / .4) * a2
    layer(img, lambda d, al: (d.line([(520, 640), (580, 640)], fill=GOLD + (al,), width=10), arrow_head(d, 600, 640, 0, 30, GOLD + (al,))), k)
    calendario(img, 790, 640, 'SEXTA', 'BLACK FRIDAY', GOLD, k)
    a3 = ease((t - (tt[5] - .2)) / .4)
    transito(img, 760 + 6 * math.sin(t * 3), a3, t)
    carimbo(img, 560, 520, 'CAOS', RED, 120, 8, ease((t - (tt[6] - .1)) / .3))
    paste_nox(img, 170, 1235, .55, .75 if t > tt[7] - .2 else 1.0, 'cross', 0)
    fonte(img, 'History.com · Snopes · Gazeta do Povo', ease(t / .5))
    headline(img, SCENES[1]['hl'], .3, t)

def scene3(img, t, u):
    img.alpha_composite(background('plain'))
    tt = ctimes(2)
    a0 = ease(t / .4) * (1 - ease((t - (tt[2] - .3)) / .4))
    loja(img, 560, 700 + 4 * math.sin(t * 2), 1.4, a0)
    a1 = ease((t - (tt[2] - .2)) / .4)
    kr = ease((t - (tt[3] - .2)) / .4); kb = ease((t - (tt[4] - .2)) / .4)
    livro_caixa(img, 580, 760, a1, kr, kb, t)
    carimbo(img, 600, 1060, 'MARKETING', GOLD, 90, -6, ease((t - (tt[5] - .1)) / .3))
    paste_nox(img, 170, 1235, .55, 1.0, 'point' if t < tt[5] - .1 else 'cross', 0)
    fonte(img, 'History.com · Snopes · Gazeta do Povo', ease(t / .5))
    headline(img, SCENES[2]['hl'], .3, t)

def scene4(img, t, u):
    img.alpha_composite(background('plain'))
    tt = ctimes(3)
    a = ease(t / .4)
    card(img, 540, 560, 860, 230, RED, a)
    draw_text_line(img, 540, 480, [('BOATO:', WHITE)], 44, a, 4)
    draw_text_line(img, 540, 540, [('NOME VEIO DA ESCRAVIDÃO', WHITE)], 46, a, 4)
    carimbo(img, 800, 450, 'FALSO', RED, 84, 10, ease((t - (tt[1] - .1)) / .3))
    # linha do tempo 1865 -> 1961
    x0, x1, y = 170, 910, 900
    ka = ease((t - (tt[2] - .2)) / .4)
    p = ease((t - (tt[5] - .2)) / 1.4)
    def f(d, al):
        d.rounded_rectangle([x0, y - 14, x1, y + 14], radius=14, fill=(60, 50, 90, al))
        if p > 0: d.rounded_rectangle([x0, y - 14, x0 + (x1 - x0) * p, y + 14], radius=14, fill=GOLD + (al,))
        d.ellipse([x0 - 26, y - 26, x0 + 26, y + 26], fill=GOLD + (al,))
        if p > .98: d.ellipse([x1 - 26, y - 26, x1 + 26, y + 26], fill=GOLD + (al,))
    layer(img, f, ka)
    k65 = ease((t - (tt[4] - .2)) / .4)
    draw_text_line(img, x0 + 40, y + 50, [('1865', GOLD)], 64, k65, 6)
    draw_text_line(img, x0 + 70, y + 130, [('FIM DA ESCRAVIDÃO', WHITE)], 30, k65, 3)
    draw_text_line(img, x0 + 70, y + 170, [('NOS EUA', WHITE)], 30, k65, 3)
    k61 = ease((t - (tt[6] - .2)) / .4)
    draw_text_line(img, x1 - 40, y + 50, [('1961', WHITE)], 64, k61, 6)
    draw_text_line(img, x1 - 70, y + 130, [('NOME JÁ USADO', WHITE)], 30, k61, 3)
    draw_text_line(img, x1 - 70, y + 170, [('NA FILADÉLFIA', WHITE)], 30, k61, 3)
    draw_text_line(img, 540, y - 110, [(f'≈ {int(round(96 * p))} ANOS', GOLD)], 70, ease((t - (tt[5] - .2)) / .4), 6)
    paste_nox(img, 170, 1290, .5, 1.0, 'raise' if t < tt[2] else 'point', 0)
    fonte(img, 'PolitiFact · Snopes · History.com', ease(t / .5))
    headline(img, SCENES[3]['hl'], .3, t)

def scene5(img, t, u):
    img.alpha_composite(background('ring'))
    rg = ring(470); a = ease(t / .8)
    rr = rg.copy(); rr.putalpha(rr.getchannel('A').point(lambda v: int(v * a)))
    img.alpha_composite(rr, (int(W / 2 - rg.width / 2), int(1000 - rg.height / 2)))
    particles(img, t, 60, 5, cy=1000, rmin=440, rmax=700)
    tt = ctimes(4)
    stage = 0 if t < tt[2] else (1 if t < tt[3] + .3 else 2)
    ae = ease(t / .4) * (1 - ease((t - (tt[5] - .3)) / .4))
    etiqueta(img, W / 2, 330 + 6 * math.sin(t * 2), ae, stage, t)
    eo = lerp(.65, .45, ease((t - tt[5]) / 1.0))
    paste_nox(img, W / 2, 600, 1.2, eo, 'cross', -3 * ease((t - tt[5]) / 1))
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
