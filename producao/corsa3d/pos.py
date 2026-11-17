# Acabamento dos quadros 3D: amplia para 1080x1920, brilho nas luzes, granulação, vinheta, legendas e painéis.
#   python3 pos.py <pasta_quadros> <saida.mp4> <fonte.ttf>
import sys, os, math, subprocess, numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
SRC, OUT, FONTF = sys.argv[1:4]
W, H, FPS = 1080, 1920, 30
FONT = ImageFont.truetype(FONTF, 104); FP = ImageFont.truetype(FONTF, 44); FN = ImageFont.truetype(FONTF, 96)
YEL = (255, 196, 36)
def eio(x): x = min(max(x, 0), 1); return x * x * (3 - 2 * x)
def ease(x): x = min(max(x, 0), 1); return 1 - (1 - x) ** 3
CAPS = [(0.3, 1.1, 'PRIMEIRO DIA', []), (1.1, 2.0, 'COM O CORSA.', ['CORSA.']), (2.0, 2.9, 'E PRIMEIRA MISSÃO:', []), (2.9, 3.9, 'ABASTECER.', ['ABASTECER.']),
        (7.25, 8.0, 'COMPLETA…', []), (8.0, 8.9, 'OU SÓ VINTE REAIS', ['VINTE', 'REAIS']), (8.9, 9.45, 'PRA ELE CHEGAR', []), (9.45, 10.0, 'EM CASA?', ['CASA?'])]
def caption(fr, t):
    for a, b, txt, ky in CAPS:
        if a <= t < b:
            sc = 1.18 - .18 * eio((t - a) / .12)
            words = txt.split(' '); sp = 26
            ws = [FONT.getbbox(w)[2] for w in words]; tw = sum(ws) + sp * (len(words) - 1)
            lay = Image.new('RGBA', (tw + 80, 180)); d = ImageDraw.Draw(lay); x = 40
            for w, wd in zip(words, ws):
                d.text((x + 6, 26), w, font=FONT, fill=(0, 0, 0, 150), stroke_width=10, stroke_fill=(0, 0, 0, 150))
                d.text((x, 20), w, font=FONT, fill=YEL if w in ky else (255, 255, 255), stroke_width=9, stroke_fill=(0, 0, 0))
                x += wd + sp
            lay = lay.resize((int(lay.width * sc), int(lay.height * sc)), Image.LANCZOS)
            fr.paste(lay, (int(W / 2 - lay.width / 2), int(1150 - lay.height / 2)), lay)
    return fr
def panel(fr, t, t0, l1, l2, col, x, y):
    if t < t0: return fr
    p = ease((t - t0) / .25); sc = .6 + .4 * p + .06 * math.sin(min(1, (t - t0) / .25) * math.pi)
    lay = Image.new('RGBA', (440, 240)); d = ImageDraw.Draw(lay)
    d.rounded_rectangle([10, 10, 430, 230], 28, fill=(14, 16, 24, 235), outline=col, width=7)
    d.text((220, 62), l1, font=FP, fill=(220, 224, 232), anchor='mm'); d.text((220, 152), l2, font=FN, fill=col, anchor='mm')
    lay = lay.resize((int(440 * sc), int(240 * sc)), Image.LANCZOS); lay.putalpha(lay.split()[3].point(lambda v: int(v * p)))
    fr.paste(lay, (int(x - lay.width / 2), int(y - lay.height / 2)), lay); return fr
rng = np.random.default_rng(3)
GR = [Image.fromarray(np.clip(128 + rng.normal(0, 24, (H // 2, W // 2)), 0, 255).astype('uint8')).resize((W, H)) for _ in range(6)]
# textura de papel fixa (manchas grandes e suaves)
PAPEL = Image.fromarray(np.clip(128 + rng.normal(0, 40, (60, 34)), 0, 255).astype('uint8')).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(30))
vy, vx = np.mgrid[0:H, 0:W]
VIG = Image.fromarray((255 * np.clip(1 - .6 * (((vx - W / 2) / (W * .62)) ** 2 + ((vy - H / 2) / (H * .6)) ** 2), 0, 1) ** 1.3).astype('uint8'))
DUST = rng.random((60, 4))
files = sorted(f for f in os.listdir(SRC) if f.endswith('.png'))
ff = subprocess.Popen(['ffmpeg', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                       '-c:v', 'libx264', '-crf', '19', '-preset', 'slow', '-pix_fmt', 'yuv420p', OUT], stdin=subprocess.PIPE)
for i, f in enumerate(files):
    t = i / FPS
    fr = Image.open(os.path.join(SRC, f)).convert('RGB').resize((W, H), Image.LANCZOS)
    # brilho (bloom) nas partes claras
    br = fr.point(lambda v: max(0, v - 170) * 3).filter(ImageFilter.GaussianBlur(28))
    fr = ImageChops.add(fr, br.point(lambda v: int(v * .55)))
    # tom: sombras levemente azuladas, luzes quentes
    a = np.asarray(fr).astype(np.float32) / 255
    lum = a.mean(2, keepdims=True)
    a = a * (1 - lum) * np.array([.96, 1.0, 1.08]) + a * lum * np.array([1.06, 1.0, .9])
    fr = Image.fromarray((np.clip(a, 0, 1) * 255).astype('uint8'))
    # papel + partículas
    fr = Image.blend(fr, ImageChops.soft_light(fr, Image.merge('RGB', [PAPEL] * 3)), .45)
    d = ImageDraw.Draw(fr)
    for k, (p, q, c, e) in enumerate(DUST):
        x = (p * W + math.sin(t * .7 + k) * 30) % W; y = (q * H - t * (18 + 40 * c)) % H; r = 1.5 + 2.2 * e
        d.ellipse([x - r, y - r, x + r, y + r], fill=(230, 228, 210))
    fr = Image.composite(fr, Image.new('RGB', (W, H), (4, 5, 10)), VIG)
    g = GR[i % 6]; fr = Image.blend(fr, ImageChops.soft_light(fr, Image.merge('RGB', [g] * 3)), .55)
    if 8.05 <= t: fr = panel(fr, t, 8.05, 'SÓ', 'R$ 20', (90, 220, 120), 800, 330)
    fr = caption(fr, t)
    if t < .3 and len(files) > 10: fr = Image.blend(Image.new('RGB', (W, H)), fr, t / .3)
    ff.stdin.write(fr.tobytes())
ff.stdin.close(); ff.wait(); print('ok', len(files))
