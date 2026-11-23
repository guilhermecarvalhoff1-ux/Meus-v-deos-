"""Motor dos vídeos de estudo da CNH (acessível para dislexia).
- Voz: edge-tts pt-BR-AntonioNeural, calma (sem acelerar).
- Visual: fundo azul-escuro suave, texto creme, fonte sem serifa grande (Liberation Sans = métrica da Arial),
  pouquíssimo texto: título, palavra-chave e desenhos (placas, setas, carros).
- Cada vídeo é uma lista de SEGMENTOS: {fala, desenho(img, t, dur), pausa_depois}.
  Perguntas: {pergunta, desenho, resposta, desenho_resposta} -> fala, 5 s de contagem, resposta.
"""
import asyncio, os, subprocess, math, wave, json, hashlib
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
    out = os.path.join(cache, hashlib.md5((VOZ + RATE + txt).encode()).hexdigest()[:16] + '.mp3')
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
                          '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '20', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-shortest', saida + '.parcial.mp4'], stdin=subprocess.PIPE)
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
    p.stdin.close(); p.wait(); os.remove(wav); os.replace(saida + '.parcial.mp4', saida)
    return total

# =====================================================================
# PEÇAS EXTRAS (dias 2 a 30). Todas: f(d, cx, cy, r, k) — k = segundos desde que apareceu
# =====================================================================
AMARELO_PLACA = (250, 196, 30); LARANJA = (240, 120, 30); VERDE_PLACA = (20, 120, 70)
AZUL_PLACA = (25, 80, 160); MARROM = (120, 70, 40); CINZA = (70, 78, 88); ASFALTO = (55, 60, 66)

def losango(d, cx, cy, r, fundo=AMARELO_PLACA):
    p = lambda k: [(cx, cy - r * k), (cx + r * k, cy), (cx, cy + r * k), (cx - r * k, cy)]
    d.polygon(p(1), fill=PRETO); d.polygon(p(.9), fill=fundo)

def boneco(d, cx, cy, s, cor=PRETO, braco=None):
    """pessoa simples; s = altura"""
    w = max(3, int(s * .09))
    d.ellipse([cx - s * .1, cy - s * .5, cx + s * .1, cy - s * .3], fill=cor)
    d.line([(cx, cy - s * .3), (cx, cy + s * .1)], fill=cor, width=w)
    d.line([(cx, cy + s * .1), (cx - s * .15, cy + s * .5)], fill=cor, width=w)
    d.line([(cx, cy + s * .1), (cx + s * .15, cy + s * .5)], fill=cor, width=w)
    if braco == 'cima': d.line([(cx, cy - s * .22), (cx + s * .05, cy - s * .7)], fill=cor, width=w); d.line([(cx, cy - s * .22), (cx - s * .2, cy)], fill=cor, width=w)
    elif braco == 'lados': d.line([(cx - s * .45, cy - s * .2), (cx + s * .45, cy - s * .2)], fill=cor, width=w)
    else: d.line([(cx - s * .2, cy), (cx, cy - s * .22), (cx + s * .2, cy)], fill=cor, width=w)

def adv(simbolo, fundo=AMARELO_PLACA):
    """placa de advertência: losango amarelo, borda e símbolo pretos"""
    def f(d, cx, cy, r, k=0):
        losango(d, cx, cy, r, fundo); w = int(r * .12)
        if simbolo == 'curva':
            d.line([(cx - r * .1, cy + r * .5), (cx - r * .1, cy)], fill=PRETO, width=w)
            seta(d, cx - r * .1, cy, cx + r * .35, cy - r * .4, PRETO, w, r * .3)
        elif simbolo == 'cruz':
            d.line([(cx, cy - r * .55), (cx, cy + r * .55)], fill=PRETO, width=w); d.line([(cx - r * .55, cy), (cx + r * .55, cy)], fill=PRETO, width=w)
        elif simbolo == 'pedestre': boneco(d, cx, cy + r * .05, r * .8)
        elif simbolo == 'criancas': boneco(d, cx - r * .2, cy + r * .05, r * .7); boneco(d, cx + r * .22, cy + r * .12, r * .55)
        elif simbolo == 'lombada':
            d.chord([cx - r * .45, cy - r * .15, cx + r * .45, cy + r * .55], 180, 360, fill=PRETO); d.rectangle([cx - r * .55, cy + r * .2, cx + r * .55, cy + r * .28], fill=PRETO)
        elif simbolo == 'escorrega':
            carro(d, cx, cy - r * .05, r * .0035, PRETO)
            for s in (-1, 1): d.arc([cx + s * r * .2 - r * .15, cy + r * .1, cx + s * r * .2 + r * .15, cy + r * .5], 200, 340, fill=PRETO, width=int(w * .6))
        elif simbolo == 'semaforo':
            d.rounded_rectangle([cx - r * .17, cy - r * .5, cx + r * .17, cy + r * .5], radius=int(r * .08), fill=PRETO)
            for i, c in enumerate((VERM, AMARELO_PLACA, (40, 170, 80))): d.ellipse([cx - r * .11, cy - r * .42 + i * r * .3, cx + r * .11, cy - r * .2 + i * r * .3], fill=c)
        elif simbolo == 'pare_frente': placa_pare(d, cx, cy, r * .42)
        elif simbolo == 'estreita':
            d.line([(cx - r * .35, cy + r * .5), (cx - r * .35, cy + r * .05), (cx - r * .15, cy - r * .2), (cx - r * .15, cy - r * .5)], fill=PRETO, width=w, joint='curve')
            d.line([(cx + r * .35, cy + r * .5), (cx + r * .35, cy + r * .05), (cx + r * .15, cy - r * .2), (cx + r * .15, cy - r * .5)], fill=PRETO, width=w, joint='curve')
        elif simbolo == 'obras':
            boneco(d, cx - r * .05, cy + r * .05, r * .7); d.line([(cx + r * .1, cy - r * .05), (cx + r * .35, cy + r * .35)], fill=PRETO, width=int(w * .7))
    return f

def cruz_santo_andre(d, cx, cy, r, k=0):
    for s in (1, -1):
        p = [(cx - r, cy - s * r * .55), (cx - r * .85, cy - s * r * .72), (cx + r, cy + s * r * .55), (cx + r * .85, cy + s * r * .72)]
        d.polygon([(cx - r * .95, cy - s * r * .7), (cx - r * .8, cy - s * r * .82), (cx + r * .95, cy + s * r * .7), (cx + r * .8, cy + s * r * .82)], fill=PRETO)
        d.line([(cx - r * .85, cy - s * r * .74), (cx + r * .85, cy + s * r * .74)], fill=BRANCO_PLACA, width=int(r * .16))

def ind(linhas, fundo=VERDE_PLACA, seta_dir=None):
    """placa de indicação: retângulo colorido com texto branco"""
    def f(d, cx, cy, r, k=0):
        w, h = r * 1.7, r * (.42 + .38 * len(linhas))
        d.rounded_rectangle([cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2], radius=int(r * .08), fill=fundo, outline=BRANCO_PLACA, width=max(3, int(r * .03)))
        for i, s in enumerate(linhas):
            d.text((cx - (r * .3 if seta_dir else 0), cy - h / 2 + r * .4 + i * r * .38), s, font=fonte(int(r * .26)), fill=BRANCO_PLACA, anchor='mm')
        if seta_dir: seta(d, cx + w / 2 - r * .5, cy, cx + w / 2 - r * .15, cy, BRANCO_PLACA, int(r * .07), r * .16)
    return f

def servico(simbolo):
    """serviços auxiliares: azul, quadro branco com desenho preto"""
    def f(d, cx, cy, r, k=0):
        d.rounded_rectangle([cx - r * .75, cy - r * .95, cx + r * .75, cy + r * .95], radius=int(r * .08), fill=AZUL_PLACA)
        d.rectangle([cx - r * .58, cy - r * .58, cx + r * .58, cy + r * .58], fill=BRANCO_PLACA)
        if simbolo == 'H': d.text((cx, cy), 'H', font=fonte(int(r * .9)), fill=PRETO, anchor='mm')
        elif simbolo == 'bomba':
            d.rectangle([cx - r * .28, cy - r * .35, cx + r * .1, cy + r * .4], fill=PRETO); d.rectangle([cx - r * .2, cy - r * .25, cx + r * .02, cy - r * .05], fill=BRANCO_PLACA)
            d.line([(cx + r * .1, cy - r * .2), (cx + r * .3, cy - r * .1), (cx + r * .3, cy + r * .25)], fill=PRETO, width=int(r * .06))
        elif simbolo == 'tel':
            d.rounded_rectangle([cx - r * .22, cy - r * .4, cx + r * .22, cy + r * .4], radius=int(r * .08), fill=PRETO)
            d.rectangle([cx - r * .15, cy - r * .3, cx + r * .15, cy + r * .2], fill=BRANCO_PLACA)
    return f

def semaforo(aceso='vermelho', pisca=False):
    def f(d, cx, cy, r, k=0):
        d.rounded_rectangle([cx - r * .42, cy - r * 1.1, cx + r * .42, cy + r * 1.1], radius=int(r * .15), fill=(18, 20, 24))
        d.rectangle([cx - r * .06, cy + r * 1.1, cx + r * .06, cy + r * 1.6], fill=(18, 20, 24))
        cores = [('vermelho', VERM), ('amarelo', (250, 190, 20)), ('verde', (40, 200, 90))]
        for i, (nome, c) in enumerate(cores):
            on = nome == aceso and (not pisca or int(k * 2) % 2 == 0)
            y = cy - r * .7 + i * r * .7
            d.ellipse([cx - r * .28, y - r * .28, cx + r * .28, y + r * .28], fill=c if on else tuple(v // 5 for v in c))
    return f

def agente(braco='cima'):
    def f(d, cx, cy, r, k=0):
        boneco(d, cx, cy, r * 1.6, CREME, braco)
        d.rectangle([cx - r * .12, cy - r * .85, cx + r * .12, cy - r * .78], fill=AMARELO)  # quepe
    return f

def pista(tipo='tracejada', cor_faixa=AMARELO_PLACA, carros=True):
    """vista de cima de uma rua com a faixa do meio"""
    def f(d, cx, cy, r, k=0):
        w, h = r * 1.3, r * 2.0
        d.rectangle([cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2], fill=ASFALTO)
        for s in (-1, 1): d.line([(cx + s * w / 2 * .92, cy - h / 2), (cx + s * w / 2 * .92, cy + h / 2)], fill=CREME, width=max(3, int(r * .03)))
        lw = max(4, int(r * .05)); off = (k * r * .8) % (r * .4)
        if tipo == 'continua': d.line([(cx, cy - h / 2), (cx, cy + h / 2)], fill=cor_faixa, width=lw)
        elif tipo == 'dupla':
            for s in (-1, 1): d.line([(cx + s * lw, cy - h / 2), (cx + s * lw, cy + h / 2)], fill=cor_faixa, width=lw)
        elif tipo == 'mista':
            d.line([(cx - lw, cy - h / 2), (cx - lw, cy + h / 2)], fill=cor_faixa, width=lw)
            y = cy - h / 2 - r * .4 + off
            while y < cy + h / 2:
                if y + r * .2 > cy - h / 2: d.line([(cx + lw, max(cy - h / 2, y)), (cx + lw, min(cy + h / 2, y + r * .2))], fill=cor_faixa, width=lw)
                y += r * .4
        else:
            y = cy - h / 2 - r * .4 + off
            while y < cy + h / 2:
                if y + r * .2 > cy - h / 2: d.line([(cx, max(cy - h / 2, y)), (cx, min(cy + h / 2, y + r * .2))], fill=cor_faixa, width=lw)
                y += r * .4
        if carros:
            carro_cima(d, cx + w * .22, cy + r * .4, r * .006, (70, 140, 220), -1)
            carro_cima(d, cx - w * .22, cy - r * .4, r * .006, (220, 110, 70), 1 if cor_faixa != CREME else -1)
    return f

def carro_cima(d, cx, cy, s, cor=(70, 140, 220), sentido=-1):
    """carro visto de cima; sentido -1 = subindo"""
    d.rounded_rectangle([cx - 22 * s, cy - 42 * s, cx + 22 * s, cy + 42 * s], radius=int(10 * s), fill=cor)
    yv = cy + sentido * 18 * s
    d.rectangle([cx - 16 * s, yv - 8 * s, cx + 16 * s, yv + 8 * s], fill=(190, 220, 245))

def faixa_pedestre(d, cx, cy, r, k=0):
    d.rectangle([cx - r, cy - r * .7, cx + r, cy + r * .7], fill=ASFALTO)
    for i in range(7): d.rectangle([cx - r * .9 + i * r * .27, cy - r * .5, cx - r * .9 + i * r * .27 + r * .14, cy + r * .5], fill=CREME)
    boneco(d, cx - r * .3 + min(1, k / 3) * r * .6, cy - r * .1, r * .6, AMARELO)

def cartao(txt, cor=AMARELO, sub=None, sub_cor=CREME):
    """número/valor grande como objeto"""
    def f(d, cx, cy, r, k=0):
        fs = r * .62; fz = fonte(int(fs))
        if r < 8: return
        while fz.getlength(txt) > r * 2.0 and fs > 6: fs *= .92; fz = fonte(int(fs))
        lw = max(fz.getlength(txt), r * 1.1, fonte(int(r * .2)).getlength(sub or '') - r * .3)
        d.rounded_rectangle([cx - lw / 2 - r * .25, cy - r * .62, cx + lw / 2 + r * .25, cy + r * (.62 + (.38 if sub else 0))], radius=int(r * .18), fill=(20, 28, 38), outline=cor, width=max(4, int(r * .04)))
        d.text((cx, cy), txt, font=fz, fill=cor, anchor='mm')
        if sub: d.text((cx, cy + r * .68), sub, font=fonte(int(r * .2)), fill=sub_cor, anchor='mm')
    return f

def x_vermelho(fn):
    def f(d, cx, cy, r, k=0):
        fn(d, cx, cy, r, k)
        for s in (1, -1): d.line([(cx - r * .7, cy - s * r * .7), (cx + r * .7, cy + s * r * .7)], fill=VERM, width=int(r * .14))
    return f

def check(fn):
    def f(d, cx, cy, r, k=0):
        fn(d, cx, cy, r, k)
        d.line([(cx + r * .3, cy + r * .6), (cx + r * .5, cy + r * .8), (cx + r * .9, cy + r * .3)], fill=VERDE, width=int(r * .12))
    return f

def P(fn, *a):
    """adapta as placas do Dia 1 (d,cx,cy,r) para peça"""
    return lambda d, cx, cy, r, k=0: fn(d, cx, cy, r, *a)

# ---- ícones ----
def ic_copo(d, cx, cy, r, k=0):
    d.polygon([(cx - r * .4, cy - r * .6), (cx + r * .4, cy - r * .6), (cx + r * .3, cy + r * .6), (cx - r * .3, cy + r * .6)], fill=(230, 180, 60))
    d.rectangle([cx - r * .42, cy - r * .7, cx + r * .42, cy - r * .45], fill=CREME)
def ic_celular(d, cx, cy, r, k=0):
    d.rounded_rectangle([cx - r * .35, cy - r * .7, cx + r * .35, cy + r * .7], radius=int(r * .12), fill=(15, 18, 22), outline=CREME, width=int(r * .05))
    d.rectangle([cx - r * .26, cy - r * .55, cx + r * .26, cy + r * .45], fill=(90, 160, 230))
def ic_cinto(d, cx, cy, r, k=0):
    boneco(d, cx, cy, r * 1.5, CREME)
    d.line([(cx - r * .3, cy - r * .55), (cx + r * .3, cy + r * .25)], fill=AMARELO, width=int(r * .14))
def ic_cadeirinha(d, cx, cy, r, k=0):
    d.rounded_rectangle([cx - r * .45, cy - r * .7, cx + r * .1, cy + r * .5], radius=int(r * .2), fill=(70, 140, 220))
    d.rounded_rectangle([cx - r * .45, cy + r * .2, cx + r * .5, cy + r * .6], radius=int(r * .15), fill=(70, 140, 220))
    d.ellipse([cx - r * .25, cy - r * .55, cx + r * .05, cy - r * .25], fill=CREME)
def ic_cruz(d, cx, cy, r, k=0):
    d.ellipse([cx - r * .8, cy - r * .8, cx + r * .8, cy + r * .8], fill=CREME)
    d.rectangle([cx - r * .15, cy - r * .55, cx + r * .15, cy + r * .55], fill=VERM); d.rectangle([cx - r * .55, cy - r * .15, cx + r * .55, cy + r * .15], fill=VERM)
def ic_triangulo(d, cx, cy, r, k=0):
    p = lambda s: [(cx, cy - r * .75 * s), (cx + r * .8 * s, cy + r * .6 * s), (cx - r * .8 * s, cy + r * .6 * s)]
    d.polygon(p(1), fill=VERM); d.polygon([(x, y + r * .07) for x, y in p(.58)], fill=BG)
def ic_pneu(d, cx, cy, r, k=0):
    d.ellipse([cx - r * .75, cy - r * .75, cx + r * .75, cy + r * .75], fill=(30, 30, 34))
    d.ellipse([cx - r * .4, cy - r * .4, cx + r * .4, cy + r * .4], fill=(160, 165, 170))
    for i in range(12):
        a = math.radians(i * 30 + k * 60); d.line([(cx + math.cos(a) * r * .55, cy + math.sin(a) * r * .55), (cx + math.cos(a) * r * .72, cy + math.sin(a) * r * .72)], fill=CINZA, width=int(r * .06))
def ic_oleo(d, cx, cy, r, k=0):
    d.polygon([(cx - r * .6, cy - r * .1), (cx + r * .3, cy - r * .1), (cx + r * .7, cy - r * .4), (cx + r * .5, cy + r * .4), (cx - r * .6, cy + r * .4)], fill=AMARELO)
    gy = cy + r * .5 + (k * r * .5) % (r * .3); d.ellipse([cx + r * .55, gy, cx + r * .7, gy + r * .2], fill=AMARELO)
def ic_folha(d, cx, cy, r, k=0):
    d.ellipse([cx - r * .7, cy - r * .35, cx + r * .7, cy + r * .35], fill=(70, 170, 90)); d.line([(cx - r * .8, cy + r * .2), (cx + r * .6, cy - r * .1)], fill=(30, 90, 50), width=int(r * .06))
def ic_bike(d, cx, cy, r, k=0):
    for s in (-1, 1): d.ellipse([cx + s * r * .45 - r * .32, cy - r * .1, cx + s * r * .45 + r * .32, cy + r * .54], outline=CREME, width=int(r * .07))
    d.line([(cx - r * .45, cy + r * .22), (cx, cy - r * .15), (cx + r * .45, cy + r * .22), (cx + r * .05, cy + r * .22), (cx, cy - r * .15)], fill=CREME, width=int(r * .07))
    boneco(d, cx + r * .02, cy - r * .5, r * .8, AMARELO)
def ic_fone(numero, cor=VERM):
    def f(d, cx, cy, r, k=0):
        d.ellipse([cx - r * .75, cy - r * .75, cx + r * .75, cy + r * .75], fill=cor)
        d.text((cx, cy), numero, font=fonte(int(r * .55)), fill=CREME, anchor='mm')
    return f
def ic_relogio(d, cx, cy, r, k=0):
    d.ellipse([cx - r * .7, cy - r * .7, cx + r * .7, cy + r * .7], fill=CREME)
    a = math.radians(k * 90 - 90); d.line([(cx, cy), (cx + math.cos(a) * r * .5, cy + math.sin(a) * r * .5)], fill=PRETO, width=int(r * .08))
    d.line([(cx, cy), (cx, cy - r * .35)], fill=PRETO, width=int(r * .1))
def ic_carteira(d, cx, cy, r, k=0):
    d.rounded_rectangle([cx - r * .85, cy - r * .55, cx + r * .85, cy + r * .55], radius=int(r * .1), fill=(120, 170, 120))
    d.rectangle([cx - r * .7, cy - r * .35, cx - r * .2, cy + r * .3], fill=CREME)
    for i in range(3): d.rectangle([cx, cy - r * .3 + i * r * .22, cx + r * .65, cy - r * .22 + i * r * .22], fill=(40, 80, 50))
    d.text((cx + r * .3, cy - r * .7), 'CNH', font=fonte(int(r * .3)), fill=CREME, anchor='mm')
def ic_ambulancia(d, cx, cy, r, k=0):
    d.rounded_rectangle([cx - r * .9, cy - r * .5, cx + r * .9, cy + r * .4], radius=int(r * .1), fill=CREME)
    d.rectangle([cx - r * .45, cy - r * .3, cx - r * .25, cy + r * .2], fill=VERM); d.rectangle([cx - r * .6, cy - r * .15, cx - r * .1, cy + r * .05], fill=VERM)
    for wx in (-.5, .5): d.ellipse([cx + wx * r - r * .2, cy + r * .25, cx + wx * r + r * .2, cy + r * .65], fill=(30, 30, 34))
    if int(k * 3) % 2 == 0: d.rectangle([cx - r * .1, cy - r * .7, cx + r * .2, cy - r * .5], fill=(60, 120, 255))
def ic_moto(d, cx, cy, r, k=0):
    for s in (-1, 1): d.ellipse([cx + s * r * .5 - r * .28, cy, cx + s * r * .5 + r * .28, cy + r * .56], fill=(30, 30, 34))
    d.polygon([(cx - r * .5, cy + r * .25), (cx - r * .1, cy - r * .15), (cx + r * .35, cy - r * .15), (cx + r * .5, cy + r * .25)], fill=VERM)
    d.ellipse([cx - r * .2, cy - r * .75, cx + r * .2, cy - r * .35], fill=AMARELO); d.line([(cx, cy - r * .35), (cx - r * .05, cy - r * .1)], fill=CREME, width=int(r * .1))
def ic_mao(d, cx, cy, r, k=0):
    d.rounded_rectangle([cx - r * .4, cy - r * .1, cx + r * .4, cy + r * .7], radius=int(r * .2), fill=(230, 190, 150))
    for i in range(4): d.rounded_rectangle([cx - r * .38 + i * r * .2, cy - r * .7, cx - r * .22 + i * r * .2, cy], radius=int(r * .08), fill=(230, 190, 150))
def ic_regua(txt):
    def f(d, cx, cy, r, k=0):
        d.rectangle([cx - r, cy - r * .18, cx + r, cy + r * .18], fill=AMARELO)
        for i in range(11): d.line([(cx - r + i * r * .2, cy - r * .18), (cx - r + i * r * .2, cy - r * (.05 if i % 5 else -.02))], fill=PRETO, width=4)
        d.text((cx, cy + r * .42), txt, font=fonte(int(r * .32)), fill=CREME, anchor='mm')
    return f
def ic_rotatoria(d, cx, cy, r, k=0):
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=ASFALTO); d.ellipse([cx - r * .45, cy - r * .45, cx + r * .45, cy + r * .45], fill=(60, 120, 70))
    a = math.radians(-k * 50); carro_cima(d, cx + math.cos(a) * r * .72, cy + math.sin(a) * r * .72, r * .0045, (70, 140, 220))
    carro_cima(d, cx + r * 1.15, cy + r * .5, r * .0045, (220, 110, 70))
def ic_cruzamento(d, cx, cy, r, k=0):
    d.rectangle([cx - r * 1.1, cy - r * .3, cx + r * 1.1, cy + r * .3], fill=ASFALTO); d.rectangle([cx - r * .3, cy - r * 1.1, cx + r * .3, cy + r * 1.1], fill=ASFALTO)
    carro_cima(d, cx + r * .7, cy + r * .12, r * .005, (220, 110, 70)); carro_cima(d, cx + r * .14, cy + r * .75, r * .005, (70, 140, 220))
    d.text((cx + r * .75, cy - r * .55), 'DIREITA', font=fonte(int(r * .16)), fill=AMARELO, anchor='mm')
def ic_ultrapassa(d, cx, cy, r, k=0):
    d.rectangle([cx - r * .7, cy - r * 1.1, cx + r * .7, cy + r * 1.1], fill=ASFALTO)
    y = cy - r * 1.1
    while y < cy + r * 1.1: d.line([(cx, y), (cx, min(y + r * .2, cy + r * 1.1))], fill=AMARELO_PLACA, width=max(4, int(r * .04))); y += r * .4
    carro_cima(d, cx + r * .35, cy, r * .006, (220, 110, 70))
    t = min(1, k / 3); x = cx + r * .35 - math.sin(t * math.pi) * r * .7; yb = cy + r * .8 - t * r * 1.5
    carro_cima(d, x, yb, r * .006, (70, 140, 220))
def ic_ponto_cego(d, cx, cy, r, k=0):
    d.rectangle([cx - r * 1.0, cy - r * 1.0, cx + r * 1.0, cy + r * 1.0], fill=ASFALTO)
    carro_cima(d, cx - r * .4, cy, r * .007)
    d.polygon([(cx - r * .2, cy + r * .1), (cx + r, cy + r * .15), (cx + r, cy + r * .7)], fill=(215, 40, 45, ))
    carro_cima(d, cx + r * .45, cy + r * .45, r * .0055, (220, 180, 60))
def ic_distancia(d, cx, cy, r, k=0):
    d.rectangle([cx - r * 1.2, cy - r * .3, cx + r * 1.2, cy + r * .3], fill=ASFALTO)
    carro(d, cx + r * .7, cy + r * .05, r * .0045, (220, 110, 70)); carro(d, cx - r * .7, cy + r * .05, r * .0045)
    d.line([(cx - r * .2, cy - r * .5), (cx + r * .2, cy - r * .5)], fill=AMARELO, width=6)
    d.text((cx, cy - r * .75), '2 SEGUNDOS', font=fonte(int(r * .2)), fill=AMARELO, anchor='mm')

# ---- cena genérica ----
def lugares(n):
    if n == 1: return [(960, 540, 250)]
    if n == 2: return [(620, 540, 210), (1300, 540, 210)]
    if n == 3: return [(460, 540, 175), (960, 540, 175), (1460, 540, 175)]
    return [(330 + i * 420, 540, 140) for i in range(n)]

def cena(tit, itens, chave_txt=None, rotulos=None, cor_chave=AMARELO, quando=None):
    """título + peças que aparecem uma a uma + palavra-chave. 'quando' = frações (0-1) da fala"""
    def f(img, d, lt, dur):
        titulo(d, tit)
        pos = lugares(len(itens)); n = len(itens)
        qs = quando or [.03 + .6 * i / max(1, n) for i in range(n)]
        for i, (fn, (x, y, r)) in enumerate(zip(itens, pos)):
            t0 = qs[i] * dur
            if lt < t0: continue
            k = lt - t0; s = eout(k / .4)
            bob = math.sin(lt * 1.3 + i) * 6
            fn(d, x, y - 20 + bob, r * (.85 + .15 * s) * min(1, s * 1.2), k)
            if rotulos and rotulos[i]: texto(d, (x, y + r * 1.25), rotulos[i], 44 if n < 4 else 36, CREME)
        if chave_txt: chave(d, chave_txt, alpha=1 if lt > dur * .55 else 0, cor=cor_chave, sz=72 if len(chave_txt) < 26 else 58)
    return f

def C(fala_txt, tit, itens, chave_txt=None, rotulos=None, **kw):
    return dict(fala=fala_txt, desenho=cena(tit, itens, chave_txt, rotulos, **{k: v for k, v in kw.items() if k != 'pausa'}), pausa=kw.get('pausa', .7))

def Q(n, perg, itens, resp, chave_resp):
    q = lambda img, d, lt, dur: [fn(d, x, y + 20, r, lt) for fn, (x, y, r) in zip(itens, lugares(len(itens)))]
    def r_(img, d, lt, dur): q(img, d, lt, dur); chave(d, chave_resp, cor=VERDE, sz=60 if len(chave_resp) < 30 else 48)
    return dict(n=n, pergunta=perg, desenho=q, resposta=resp, desenho_resposta=r_)

def gerar(dia, nome, segs):
    aqui = os.path.dirname(os.path.abspath(__file__))
    out = os.path.join(aqui, 'videos', f'dia-{dia:02d}-{nome}.mp4')
    total = montar(segs, out, os.path.join(aqui, '.cache_voz'))
    print(f'dia {dia}: {total:.1f}s -> {out}', flush=True)
    return total
