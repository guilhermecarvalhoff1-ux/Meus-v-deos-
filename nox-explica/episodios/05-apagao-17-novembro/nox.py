"""Nox — sprite fiel à imagem de referência (capuz azul-marinho, rosto preto, olhos dourados angulares)."""
import math
from functools import lru_cache
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SW, SH = 1000, 1200          # tamanho do sprite (1x)
K = 2                        # supersample
CX = SW // 2


def _L():
    return Image.new('RGBA', (SW * K, SH * K), (0, 0, 0, 0))


def P(x, y):
    return (x * K, y * K)


def _hood_pts():
    pts = []
    for a in np.linspace(math.pi, 0, 90):
        pts.append((CX + math.cos(a) * 300, 470 - math.sin(a) * 360))
    pts += [(CX + 322, 640), (CX + 400, 860), (CX + 560, 1010), (CX + 640, SH + 20),
            (CX - 640, SH + 20), (CX - 560, 1010), (CX - 400, 860), (CX - 322, 640)]
    return pts


def _cloth(mask):
    """tecido azul-marinho com luz suave de cima/esquerda"""
    y, x = np.mgrid[:SH * K, :SW * K] / K
    gx = np.clip(0.62 - (x - CX) / SW * 0.8 - (y - 500) / SH * 0.55, 0, 1)
    col = np.stack([17 + 26 * gx, 21 + 25 * gx, 37 + 36 * gx, np.zeros_like(gx)], -1).astype('uint8')
    im = Image.fromarray(col, 'RGBA')
    im.putalpha(mask)
    return im


def _sleeve(d, x0, y0, x1, y1, w0, w1):
    """manga do manto com pontas arredondadas, afinando do ombro (w0) ao punho (w1)"""
    ang = math.atan2(y1 - y0, x1 - x0) + math.pi / 2
    c, s = math.cos(ang), math.sin(ang)
    pts = [(x0 + c * w0, y0 + s * w0), (x1 + c * w1, y1 + s * w1), (x1 - c * w1, y1 - s * w1), (x0 - c * w0, y0 - s * w0)]
    d.polygon([P(*p) for p in pts], fill=(255, 255, 255, 255))
    for (x, y, w) in ((x0, y0, w0), (x1, y1, w1)):
        d.ellipse([*P(x - w, y - w), *P(x + w, y + w)], fill=(255, 255, 255, 255))


def _hand(d, x, y, r, rot=0, open_palm=False):
    """mão escura (mesmo preto do rosto), formato simples de luva"""
    col = (8, 8, 12, 255)
    if open_palm:
        d.rounded_rectangle([*P(x - r * .8, y - r * 1.5), *P(x + r * .8, y + r * .7)], radius=r * .75 * K, fill=col)
        d.ellipse([*P(x - r * 1.35, y - r * .3), *P(x - r * .45, y + r * .35)], fill=col)  # polegar
    else:
        d.ellipse([*P(x - r, y - r), *P(x + r, y + r)], fill=col)


@lru_cache(None)
def nox(eye_open=1.0, arms='none', eye_look=0):
    """eye_open: 1 = normal, ~0.55 = olhos estreitos (ironia). arms: none | point | raise | cross."""
    img = _L()
    hood = _hood_pts()
    m = _L(); md = ImageDraw.Draw(m)
    md.polygon([P(*p) for p in hood], fill=(255, 255, 255, 255))
    # braços (mangas fazem parte do manto)
    mask = m.getchannel('A')
    img.alpha_composite(_cloth(mask))
    # dobras verticais do manto
    F = _L(); fd = ImageDraw.Draw(F)
    for x0, x1 in ((CX - 240, CX - 260), (CX + 210, CX + 230), (CX - 40, CX - 60)):
        fd.line([P(x0, 700), P(x1, SH)], fill=(0, 0, 0, 110), width=44 * K)
    F = F.filter(ImageFilter.GaussianBlur(26 * K))
    F.putalpha(Image.fromarray(np.minimum(np.array(F.getchannel('A')), np.array(mask))))
    img.alpha_composite(F)
    # mangas por cima do corpo, cada uma com sombra própria
    def layer_sleeve(x0, y0, x1, y1, w0, w1):
        S = _L(); _sleeve(ImageDraw.Draw(S), x0, y0, x1, y1, w0, w1)
        edge = S.filter(ImageFilter.GaussianBlur(10 * K))
        sh = Image.new('RGBA', S.size, (0, 0, 0, 0)); sh.putalpha(edge.getchannel('A').point(lambda v: int(v * .5)))
        img.alpha_composite(sh, (10 * K, 14 * K))
        img.alpha_composite(_cloth(S.getchannel('A')))
    hd = ImageDraw.Draw(img)
    col = (8, 8, 12, 255)
    if arms == 'point':
        layer_sleeve(CX + 300, 780, CX + 400, 600, 78, 58); hd = ImageDraw.Draw(img)
        _hand(hd, CX + 420, 565, 42)
        hd.line([P(CX + 434, 545), P(CX + 472, 492)], fill=col, width=34 * K)
        hd.ellipse([*P(CX + 455, 475), *P(CX + 489, 509)], fill=col)
    elif arms == 'raise':
        layer_sleeve(CX + 300, 800, CX + 350, 560, 78, 60); hd = ImageDraw.Draw(img)
        _hand(hd, CX + 352, 492, 58, open_palm=True)
    elif arms == 'cross':
        layer_sleeve(CX - 300, 860, CX + 190, 900, 80, 66); hd = ImageDraw.Draw(img)
        _hand(hd, CX + 236, 900, 40)
        layer_sleeve(CX + 300, 900, CX - 190, 940, 80, 66); hd = ImageDraw.Draw(img)
        _hand(hd, CX - 236, 944, 40)
    # rim light dourado na borda do capuz
    R = _L(); rd = ImageDraw.Draw(R)
    rd.line([P(*p) for p in hood[:91]], fill=(255, 196, 110, 210), width=9 * K)
    img.alpha_composite(R.filter(ImageFilter.GaussianBlur(5 * K)))
    # abertura do rosto (preto total) + borda interna do capuz
    O = _L(); od = ImageDraw.Draw(O)
    od.ellipse([*P(CX - 165, 290), *P(CX + 165, 640)], fill=(3, 3, 6, 255))
    img.alpha_composite(O.filter(ImageFilter.GaussianBlur(7 * K)))
    E = _L(); ImageDraw.Draw(E).arc([*P(CX - 178, 276), *P(CX + 178, 654)], 200, 340, fill=(64, 74, 104, 255), width=14 * K)
    img.alpha_composite(E.filter(ImageFilter.GaussianBlur(4 * K)))
    # olhos angulares dourados
    ey = 440
    h = 15 * eye_open
    def eye_poly(ex, grow=0, hh=h):
        return [P(ex - 34 - grow, ey), P(ex + eye_look, ey - hh - grow * .5), P(ex + 34 + grow, ey + 2), P(ex + eye_look, ey + hh * .75 + grow * .4)]
    for blur, al, grow in ((34, 255, 30), (14, 255, 10), (4, 255, 2)):
        G = _L(); gd = ImageDraw.Draw(G)
        for ex in (CX - 66, CX + 66):
            gd.polygon(eye_poly(ex, grow), fill=(255, 186, 40, al))
        img.alpha_composite(G.filter(ImageFilter.GaussianBlur(blur * K)))
    G = _L(); gd = ImageDraw.Draw(G)
    for ex in (CX - 66, CX + 66):
        gd.polygon(eye_poly(ex, 0, h * .82), fill=(255, 246, 205, 255))
    img.alpha_composite(G)
    return img.resize((SW, SH), Image.LANCZOS)


if __name__ == '__main__':
    sheet = Image.new('RGB', (2000, 600), (30, 20, 46))
    for i, (eo, ar) in enumerate(((1, 'none'), (1, 'point'), (1, 'raise'), (.5, 'cross'))):
        sheet.paste(nox(eo, ar).resize((500, 600)), (i * 500, 0), nox(eo, ar).resize((500, 600)))
    sheet.save('poses.png')
