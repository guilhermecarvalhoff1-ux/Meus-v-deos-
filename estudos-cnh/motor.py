"""Motor dos vídeos de estudo da CNH (acessível para dislexia).
- Voz: edge-tts pt-BR-AntonioNeural, calma (sem acelerar).
- Visual: fundo azul-escuro suave, texto creme, fonte sem serifa grande (Liberation Sans = métrica da Arial),
  pouquíssimo texto: título, palavra-chave e desenhos (placas, setas, carros).
- Cada vídeo é uma lista de SEGMENTOS: {fala, desenho(img, t, dur), pausa_depois}.
  Perguntas: {pergunta, desenho, resposta, desenho_resposta} -> fala, 5 s de contagem, resposta.
"""
import asyncio, os, subprocess, math, wave, json
import numpy as np, edge_tts
from PIL import Image, ImageDraw, ImageFont

W, H, FPS, SR = 1920, 1080, 30, 24000
VOZ, RATE, PITCH = 'pt-BR-AntonioNeural', '+0%', '+0Hz'
BG = (31, 42, 54)          # azul-escuro suave
CREME = (245, 239, 224)    # texto (nada de branco estourado)
AMARELO = (255, 209, 102)  # palavra-chave
VERDE = (120, 210, 150); VERM = (215, 40, 45); PRETO = (25, 25, 28); BRANCO_PLACA = (250, 250, 246)
FONTE = '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf'
_fc = {}
def fonte(sz):
    sz = max(1, int(sz))
    if sz not in _fc: _fc[sz] = ImageFont.truetype(FONTE, sz)
    return _fc[sz]

def ease(x): x = max(0., min(1., x)); return x * x * (3 - 2 * x)
def eout(x): x = max(0., min(1., x)); return 1 - (1 - x) ** 3

# ---------------- texto ----------------
def texto(d, xy, s, sz, cor=CREME, anchor='mm', esp=4):
    """texto grande com espaçamento extra entre letras (ajuda na leitura)"""
    f = fonte(sz); x, y = xy
    larg = sum(f.getlength(ch) for ch in s) + esp * (len(s) - 1)
    if anchor[0] == 'm': x -= larg / 2
    elif anchor[0] == 'r': x -= larg
    for ch in s:
        d.text((x, y), ch, font=f, fill=cor, anchor='l' + anchor[1])
        x += f.getlength(ch) + esp

def titulo(d, s, sub=None):
    texto(d, (W / 2, 95), s, 64, CREME)
    if sub: texto(d, (W / 2, 165), sub, 40, AMARELO)

def chave(d, s, y=960, cor=AMARELO, sz=72, alpha=1.0):
    """palavra-chave grande embaixo, num cartão escuro"""
    if alpha <= 0: return
    f = fonte(sz); larg = sum(f.getlength(ch) for ch in s) + 4 * (len(s) - 1)
    d.rounded_rectangle([W / 2 - larg / 2 - 40, y - sz * .75, W / 2 + larg / 2 + 40, y + sz * .75], radius=30, fill=(20, 28, 38))
    texto(d, (W / 2, y), s, sz, cor)

# ---------------- placas (desenhadas, cores e formas reais) ----------------
def circ_regul(d, cx, cy, r):
    """formato padrão da regulamentação: círculo branco com borda vermelha"""
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=VERM)
    d.ellipse([cx - r * .8, cy - r * .8, cx + r * .8, cy + r * .8], fill=BRANCO_PLACA)

def tarja(d, cx, cy, r):
    """tarja vermelha diagonal = proibição"""
    a = math.radians(45); w = r * .16
    x1, y1 = cx - math.cos(a) * r * .78, cy - math.sin(a) * r * .78
    x2, y2 = cx + math.cos(a) * r * .78, cy + math.sin(a) * r * .78
    d.line([(x1, y1), (x2, y2)], fill=VERM, width=int(w))

def placa_pare(d, cx, cy, r):
    pts = [(cx + r * math.cos(math.radians(22.5 + 45 * k)), cy + r * math.sin(math.radians(22.5 + 45 * k))) for k in range(8)]
    d.polygon(pts, fill=BRANCO_PLACA)
    pts2 = [(cx + r * .9 * math.cos(math.radians(22.5 + 45 * k)), cy + r * .9 * math.sin(math.radians(22.5 + 45 * k))) for k in range(8)]
    d.polygon(pts2, fill=VERM)
    d.text((cx, cy), 'PARE', font=fonte(int(r * .55)), fill=BRANCO_PLACA, anchor='mm')

def placa_preferencia(d, cx, cy, r):
    """triângulo invertido, fundo branco, borda vermelha"""
    p = lambda k: [(cx - r * k, cy - r * .62 * k), (cx + r * k, cy - r * .62 * k), (cx, cy + r * 1.1 * k)]
    d.polygon(p(1.0), fill=VERM); d.polygon(p(.72), fill=BRANCO_PLACA)

def placa_letra(d, cx, cy, r, letra='E', marca=None):
    """R-6a (E + tarja), R-6b (E), R-6c (E + X)"""
    circ_regul(d, cx, cy, r)
    d.text((cx, cy + r * .03), letra, font=fonte(int(r * 1.05)), fill=PRETO, anchor='mm')
    if marca == 'tarja': tarja(d, cx, cy, r)
    if marca == 'x':
        for s in (1, -1):
            a = math.radians(45); d.line([(cx - math.cos(a) * r * .78, cy - s * math.sin(a) * r * .78), (cx + math.cos(a) * r * .78, cy + s * math.sin(a) * r * .78)], fill=VERM, width=int(r * .16))

def placa_velocidade(d, cx, cy, r, v='60'):
    circ_regul(d, cx, cy, r)
    d.text((cx, cy - r * .08), v, font=fonte(int(r * .78)), fill=PRETO, anchor='mm')
    d.text((cx, cy + r * .45), 'km/h', font=fonte(int(r * .22)), fill=PRETO, anchor='mm')

def seta(d, x0, y0, x1, y1, cor=PRETO, w=24, cab=46):
    d.line([(x0, y0), (x1, y1)], fill=cor, width=w)
    a = math.atan2(y1 - y0, x1 - x0)
    d.polygon([(x1 + math.cos(a) * cab * .6, y1 + math.sin(a) * cab * .6), (x1 + math.cos(a + 2.4) * cab, y1 + math.sin(a + 2.4) * cab), (x1 + math.cos(a - 2.4) * cab, y1 + math.sin(a - 2.4) * cab)], fill=cor)

def seta_curva_esq(d, cx, cy, r, cor=PRETO):
    """seta que sobe e vira à esquerda (desenho das placas de conversão)"""
    w = int(r * .17); x = cx + r * .2; yt = cy - r * .25
    d.line([(x, cy + r * .55), (x, yt)], fill=cor, width=w)
    d.ellipse([x - w / 2, yt - w / 2, x + w / 2, yt + w / 2], fill=cor)
    seta(d, x, yt, cx - r * .38, yt, cor, w, r * .34)

def placa_proib_esquerda(d, cx, cy, r):
    circ_regul(d, cx, cy, r); seta_curva_esq(d, cx, cy, r); tarja(d, cx, cy, r)

def placa_siga_frente(d, cx, cy, r):
    circ_regul(d, cx, cy, r); seta(d, cx, cy + r * .5, cx, cy - r * .45, PRETO, int(r * .16), r * .34)

def placa_vire_dir(d, cx, cy, r):
    circ_regul(d, cx, cy, r)
    w = int(r * .16); d.line([(cx - r * .2, cy + r * .5), (cx - r * .2, cy - r * .2)], fill=PRETO, width=w)
    seta(d, cx - r * .2, cy - r * .2, cx + r * .45, cy - r * .2, PRETO, w, r * .32)

def carro(d, x, y, s=1.0, cor=(70, 140, 220)):
    d.rounded_rectangle([x - 90 * s, y - 40 * s, x + 90 * s, y + 10 * s], radius=int(18 * s), fill=cor)
    d.rounded_rectangle([x - 50 * s, y - 75 * s, x + 45 * s, y - 35 * s], radius=int(14 * s), fill=cor)
    d.rectangle([x - 40 * s, y - 68 * s, x + 35 * s, y - 42 * s], fill=(190, 220, 245))
    for wx in (-55, 55): d.ellipse([x + (wx - 22) * s, y - 8 * s, x + (wx + 22) * s, y + 36 * s], fill=(30, 30, 34))

def contagem(d, cx, cy, r, frac, n):
    """anel de 5 segundos para pensar"""
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(70, 85, 100), width=16)
    d.arc([cx - r, cy - r, cx + r, cy + r], -90, -90 + 360 * frac, fill=AMARELO, width=16)
    d.text((cx, cy), str(n), font=fonte(int(r * .9)), fill=CREME, anchor='mm')

# ---------------- voz ----------------
async def _tts(txt, out):
    for k in range(15):
        try:
            c = edge_tts.Communicate(txt, VOZ, rate=RATE, pitch=PITCH, proxy=os.environ.get('HTTPS_PROXY'))
            await c.save(out)
            if os.path.getsize(out) > 1000: return
        except Exception: pass
        await asyncio.sleep(3)
    raise SystemExit('voz falhou: ' + txt[:60])
def fala(txt, cache):
    os.makedirs(cache, exist_ok=True)
    out = os.path.join(cache, f'{abs(hash(txt)) % 10**12}.mp3')
    if not os.path.exists(out): asyncio.run(_tts(txt, out))
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', out, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768

# ---------------- montagem ----------------
def montar(segmentos, saida, cache):
    """segmentos -> timeline (cada um com início/fim) -> vídeo + áudio -> mp4"""
    tl, audio, t = [], [], 0.0
    def add(desenho, a, extra=0.0, kind='fala', meta=None):
        nonlocal t
        dur = len(a) / SR + extra
        tl.append(dict(t0=t, dur=dur, f=desenho, kind=kind, meta=meta or {}))
        audio.append(a); audio.append(np.zeros(int(extra * SR), np.float32)); t += dur
    for sg in segmentos:
        if 'pergunta' in sg:
            q = fala(sg['pergunta'], cache); add(sg['desenho'], q, .4, 'pergunta', sg)
            add(sg['desenho'], np.zeros(0, np.float32), 5.0, 'pensar', sg)
            r = fala(sg['resposta'], cache); add(sg.get('desenho_resposta', sg['desenho']), r, .9, 'resposta', sg)
        else:
            a = fala(sg['fala'], cache); add(sg['desenho'], a, sg.get('pausa', .7))
    total = t
    wav = saida.replace('.mp4', '.wav')
    mix = np.concatenate(audio)
    with wave.open(wav, 'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
    p = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-i', wav,
                          '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-shortest', saida], stdin=subprocess.PIPE)
    for i in range(int(total * FPS)):
        T = i / FPS
        sg = next(s for s in reversed(tl) if s['t0'] <= T + 1e-9)
        img = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(img)
        lt = T - sg['t0']
        sg['f'](img, d, lt, sg['dur'])
        if sg['kind'] == 'pensar':
            n = 5 - int(lt); contagem(d, W - 200, 200, 110, lt / 5, max(1, n))
            texto(d, (W - 200, 360), 'PENSE...', 40, AMARELO)
        if sg['kind'] in ('pergunta', 'pensar'):
            texto(d, (200, 200), f"PERGUNTA {sg['meta'].get('n', '')}", 44, AMARELO, 'lm')
        if sg['kind'] == 'resposta':
            texto(d, (200, 200), 'RESPOSTA', 44, VERDE, 'lm')
        p.stdin.write(img.tobytes())
    p.stdin.close(); p.wait(); os.remove(wav)
    return total
