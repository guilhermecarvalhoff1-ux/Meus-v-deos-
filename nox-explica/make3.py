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
RED = (235, 80, 80)
GREEN = (90, 210, 130)
SCENES = [
    dict(min=6.0, hl=[('CONDENADA…', WHITE), ('E ESTRELA?', GOLD)],
         caps=[('ELA FOI *CONDENADA*', 0), ('POR PLANEJAR A MORTE', 0), ('DOS PRÓPRIOS PAIS.', 0), ('E VIROU *ESTRELA*', 0),
               ('DE STREAMING.', 0), ('QUE PORRA É ESSA?', 0)]),
    dict(min=10.0, hl=[('2002 · CONDENADA', WHITE), ('A 39 ANOS', GOLD)],
         caps=[('EM *2002*, OS PAIS', 0), ('DA SUZANE VON RICHTHOFEN', 0), ('FORAM MORTOS', 0), ('ENQUANTO DORMIAM.', 0),
               ('ELA PLANEJOU O CRIME', 0), ('COM O NAMORADO', 0), ('E O IRMÃO DELE,', 0), ('DE OLHO NA *HERANÇA*.', 0),
               ('PEGOU *39* ANOS', 0), ('DE PRISÃO.', 0), ('DESDE *2023*,', 0), ('TÁ FORA DA CADEIA.', 0)]),
    dict(min=8.0, hl=[('3 FILMES · 1 SÉRIE', WHITE), ('1 DOCUMENTÁRIO', GOLD)],
         caps=[('DEPOIS DISSO?', 0), ('*TRÊS* FILMES,', 0), ('UMA *SÉRIE*', 0), ('COM ATRIZ FAMOSA', 0), ('E, EM *2026*,', 0),
               ('UM *DOCUMENTÁRIO*', 0), ('COM A VERSÃO DELA.', 0), ('E A CADA NOTÍCIA,', 0), ('O NOME VOLTA', 0), ('A *BOMBAR*.', 0)]),
    dict(min=9.0, hl=[('CONTAR O CASO', WHITE), ('≠ DAR PALCO', GOLD)],
         caps=[('SÓ NÃO MISTURA', 0), ('AS COISAS:', 0), ('CONTAR O CASO,', 0), ('OUVIR QUEM INVESTIGOU?', 0), ('BELEZA,', 0),
               ('É *JORNALISMO*.', 0), ('AGORA BOTAR A VERSÃO', 0), ('DELA DE *ESTRELA*,', 0), ('COM TRILHA BONITA?', 0),
               ('AÍ VIRA *VITRINE*,', 0), ('CARALHO.', 0)]),
    dict(min=6.0, hl=None, end_hold=0.5,
         caps=[('*NOX* ACHA QUE', 0), ('QUEM MANDA NESSA MERDA', 0), ('É O *CLIQUE*:', 0), ('DEU AUDIÊNCIA,', 0), ('VEM MAIS.', 0),
               ('TEM OUTRO CASO', .45), ('QUE VIROU ESPETÁCULO?', 0), ('MANDA NOS *COMENTÁRIOS*', 0), ('QUE *NOX* EXPLICA.', 0)]),
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
CAPS, TOTAL = schedule_from_file('falas_tempos_03.json') if os.path.exists('falas_tempos_03.json') else schedule()

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

def scene1(img, t, u):
    img.alpha_composite(background('ring'))
    rg = ring(470); img.alpha_composite(rg, (int(W / 2 - rg.width / 2), int(1000 - rg.height / 2)))
    particles(img, t, 70, 1, cy=1000, rmin=440, rmax=700)
    q = caps_of(0)[5][0]  # "QUE PORRA É ESSA?"
    tilt = 6 * ease((t - .6) / 1.0)
    eo = lerp(.75, .5, ease((t - .8) / .8))
    paste_nox(img, W / 2, 560, 1.25, eo, 'raise' if t >= q - .15 else 'none', tilt)
    headline(img, SCENES[0]['hl'], .8, t)

def house(img, x, y, s, lights):
    d = ImageDraw.Draw(img)
    w, h = 300 * s, 210 * s
    d.polygon([(x - w * .62, y - h), (x, y - h - 150 * s), (x + w * .62, y - h)], fill=(52, 42, 84, 255))
    d.rectangle([x - w / 2, y - h, x + w / 2, y], fill=(40, 32, 66, 255))
    for k, (wx, wy) in enumerate([(-.3, -.72), (.3, -.72), (-.3, -.35), (.3, -.35)]):
        on = lights[k]
        cx, cy = x + wx * w, y + wy * h
        if on > 0:
            g = Image.new('RGBA', (int(120 * s), int(120 * s)), (0, 0, 0, 0)); ImageDraw.Draw(g).ellipse([0, 0, g.width, g.height], fill=(255, 200, 90, int(90 * on)))
            img.alpha_composite(g.filter(ImageFilter.GaussianBlur(14 * s)), (int(cx - g.width / 2), int(cy - g.height / 2)))
        d = ImageDraw.Draw(img)
        col = tuple(int(lerp(a, b, on)) for a, b in zip((22, 18, 38), (255, 214, 120))) + (255,)
        d.rectangle([cx - 34 * s, cy - 30 * s, cx + 34 * s, cy + 30 * s], fill=col)
    d.rectangle([x - 26 * s, y - 80 * s, x + 26 * s, y], fill=(28, 22, 46, 255))
    d.ellipse([x + 130 * s, y - h - 230 * s, x + 200 * s, y - h - 160 * s], fill=(240, 236, 220, 255))  # lua

def scene2(img, t, u):
    img.alpha_composite(background('plain'))
    dur = SCENES[1]['t1'] - SCENES[1]['t0']
    off = clamp((t - 1.2) / 2.0)
    house(img, W / 2 + 160, 900, 1.25, [1 - clamp(off * 4 - k * .8) for k in range(4)])
    d = ImageDraw.Draw(img)
    # linha do tempo
    x0, x1, ty = 420, 880, 1210
    pts = [(2002, x0), (2006, (x0 + x1) / 2), (2023, x1)]
    lab = {2002: 'O CRIME', 2006: '39 ANOS', 2023: 'FORA DA CADEIA'}
    reach = clamp((t - .3) / (dur * .85))
    d.line([(x0, ty), (x1, ty)], fill=(255, 255, 255, 90), width=6)
    d.line([(x0, ty), (lerp(x0, x1, reach), ty)], fill=GOLD + (255,), width=10)
    for k, (yr, x) in enumerate(pts):
        on = reach >= k / 2 - .001
        d = ImageDraw.Draw(img)
        d.ellipse([x - 18, ty - 18, x + 18, ty + 18], fill=(GOLD if on else (90, 80, 120)) + (255,))
        draw_text_line(img, x, ty - 86, [(str(yr), GOLD if on else (150, 140, 180))], 50, 1.0, 5)
        draw_text_line(img, x, ty + 34, [(lab[yr], WHITE if on else (150, 140, 180))], 30, 1.0, 4)
    paste_nox(img, 220, 1205, .6, 1.0, 'point' if t > .4 else 'none', 0, 10)
    headline(img, SCENES[1]['hl'], 1.0, t)

def screen(img, x, y, w, h, label, kind, a):
    if a <= 0: return
    L = Image.new('RGBA', img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(L)
    al = int(255 * a)
    if kind == 'tv':
        d.rounded_rectangle([x - w / 2, y - h / 2, x + w / 2, y + h / 2], radius=18, fill=(20, 16, 34, al), outline=(120, 110, 170, al), width=6)
        d.rectangle([x - 40, y + h / 2, x + 40, y + h / 2 + 26], fill=(60, 54, 90, al))
    else:
        d.rounded_rectangle([x - w / 2, y - h / 2, x + w / 2, y + h / 2], radius=26, fill=(20, 16, 34, al), outline=(120, 110, 170, al), width=6)
    d.rounded_rectangle([x - w / 2 + 16, y - h / 2 + 16, x + w / 2 - 16, y + h / 2 - 16], radius=10, fill=(52, 38, 90, al))
    d.polygon([(x - 22, y - 34), (x - 22, y + 30), (x + 30, y - 2)], fill=(255, 255, 255, al))
    img.alpha_composite(L)
    draw_text_line(img, x, y + h / 2 + (36 if kind == 'tv' else 18), [(label, GOLD)], 30, a, 4)

def scene3(img, t, u):
    img.alpha_composite(background('plain'))
    caps = caps_of(2); T0 = SCENES[2]['t0']
    tt = [c[0] - T0 for c in caps]
    items = [(380, 560, 260, 170, 'FILME', 'tv', tt[1]), (680, 540, 260, 170, 'FILME', 'tv', tt[1] + .25), (960, 590, 220, 150, 'FILME', 'tv', tt[1] + .5),
             (470, 820, 300, 190, 'SÉRIE', 'tv', tt[2]), (840, 840, 170, 290, 'DOCUMENTÁRIO', 'phone', tt[5])]
    for x, y, w, h, lab, k, t_in in items:
        a = ease((t - t_in) / .35); dy = (1 - eout((t - t_in) / .45)) * -120
        screen(img, x, y + dy, w, h, lab, k, a)
    # gráfico de buscas subindo
    g0 = tt[7] if len(tt) > 7 else 5
    k = ease((t - g0) / 1.6)
    d = ImageDraw.Draw(img)
    bx, by = 430, 1360
    for i in range(7):
        hh = (40 + 28 * i + (60 if i == 6 else 0)) * k
        d.rounded_rectangle([bx + i * 80, by - hh, bx + i * 80 + 52, by], radius=8, fill=(GOLD if i == 6 else (120, 110, 170)) + (255,))
    if k > .05: draw_text_line(img, bx + 260, by + 24, [('BUSCAS', WHITE)], 34, k, 4)
    paste_nox(img, 220, 1205, .6, .8, 'point' if t > .5 else 'none', -3 * ease(t / 3))
    headline(img, SCENES[2]['hl'], .9, t)

def mark(d, x, y, ok, s=1.0, al=255):
    if ok: d.line([(x - 36 * s, y), (x - 10 * s, y + 28 * s), (x + 40 * s, y - 34 * s)], fill=GREEN + (al,), width=int(16 * s), joint='curve')
    else:
        d.line([(x - 32 * s, y - 32 * s), (x + 32 * s, y + 32 * s)], fill=RED + (al,), width=int(16 * s))
        d.line([(x + 32 * s, y - 32 * s), (x - 32 * s, y + 32 * s)], fill=RED + (al,), width=int(16 * s))

def scene4(img, t, u):
    img.alpha_composite(background('plain'))
    caps = caps_of(3); T0 = SCENES[3]['t0']
    ta = caps[2][0] - T0; tb = caps[6][0] - T0
    cols = [(330, 'CONTAR O CASO', True, ta), (760, 'DAR PALCO', False, tb)]
    for x, lab, ok, t_in in cols:
        a = ease((t - t_in + .3) / .4)
        if a <= 0: continue
        L = Image.new('RGBA', img.size, (0, 0, 0, 0)); d = ImageDraw.Draw(L)
        al = int(255 * a)
        d.rounded_rectangle([x - 190, 420, x + 190, 1010], radius=28, fill=(30, 24, 54, int(230 * a)), outline=((GREEN if ok else RED) + (al,)), width=6)
        if ok:   # lupa + microfone
            d.ellipse([x - 90, 520, x - 10, 600], outline=(230, 225, 245, al), width=12); d.line([(x - 20, 592), (x + 20, 640)], fill=(230, 225, 245, al), width=14)
            d.rounded_rectangle([x + 40, 520, x + 90, 600], radius=24, fill=(230, 225, 245, al)); d.line([(x + 65, 600), (x + 65, 640)], fill=(230, 225, 245, al), width=8)
        else:    # holofote + estrela
            d.polygon([(x - 110, 510), (x - 60, 510), (x + 40, 680), (x - 210, 680)], fill=(255, 230, 150, int(70 * a)))
            cx, cy, R, r = x + 70, 570, 60, 26
            pts = [(cx + (R if k % 2 == 0 else r) * math.cos(-math.pi / 2 + k * math.pi / 5), cy + (R if k % 2 == 0 else r) * math.sin(-math.pi / 2 + k * math.pi / 5)) for k in range(10)]
            d.polygon(pts, fill=GOLD + (al,))
        mark(d, x, 800, ok, 1.4, al)
        img.alpha_composite(L)
        draw_text_line(img, x, 905, [(lab, WHITE)], 40, a, 5)
    raise_t = ease((t - .2) / .5)
    paste_nox(img, 210, lerp(1235, 1205, raise_t), .6, 1.0, 'raise' if t > .2 else 'none', 0)
    headline(img, SCENES[3]['hl'], .8, t)

def scene5(img, t, u):
    img.alpha_composite(background('ring'))
    rg = ring(470); a = ease(t / .8)
    rr = rg.copy(); rr.putalpha(rr.getchannel('A').point(lambda v: int(v * a)))
    img.alpha_composite(rr, (int(W / 2 - rg.width / 2), int(1000 - rg.height / 2)))
    particles(img, t, 60, 5, cy=1000, rmin=440, rmax=700)
    eo = lerp(.65, .45, ease((t - 1.5) / 1.0))
    paste_nox(img, W / 2, 560, 1.25, eo, 'cross', -3 * ease((t - 1) / 1))
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
        sheet.save('test_03.jpg'); sys.exit()
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                          '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-pix_fmt', 'yuv420p', 'nox_video_03.mp4'], stdin=subprocess.PIPE)
    n = int(TOTAL * FPS)
    for i in range(n):
        p.stdin.write(frame(i / FPS).tobytes())
    p.stdin.close(); p.wait()
    json.dump([dict(start=a, end=b, text=c.replace('*', '')) for a, b, c, s in CAPS], open('caps_03.json', 'w'), ensure_ascii=False, indent=1)
