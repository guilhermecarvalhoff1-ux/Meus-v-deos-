"""Cortes editados: jogo em tela cheia, webcam no canto, legenda karaokê, zooms, tremida, clarões, whoosh/boom, barra de progresso."""
import json, subprocess, re, sys, wave, numpy as np
W = json.load(open('words.json'))
_W = []
for w in W:  # junta "1" + "%" em "1%"
    if w['t'].startswith('%') and _W: _W[-1] = {**_W[-1], 't': _W[-1]['t'] + w['t'], 'e': w['e']}
    else: _W.append(w)
W = _W
SFX = '/home/user/Meus-v-deos-/aurea-remotion/sfx'
# zoom: (tempo, força) · boom: tempos com tremida+clarão · whoosh: tempos · vermelho: clarões vermelhos (polícia)
CORTES = {
 'corte1_conta_de_banco': {'partes': [(37.8, 64.6), (82.9, 95.1)], 'sem_legenda': [(37.9, 64.2)], 'faixa_legenda': (1.2, 26.8),
     'gancho': [('LIGARAM PEDINDO A\\N', 0), ('CONTA DE BANCO', 1), (' DELE\\NNO MEIO DO PÂNTANO', 0)],
     'zoom': [(14.5, .22), (23.8, .22), (27.1, .25), (33.3, .3)], 'boom': [(.05), (14.5), (33.3)], 'whoosh': [2.45, 26.75], 'vermelho': []},
 'corte2_grafico': {'partes': [(0.0, 36.5)], 'sem_legenda': [],
     'gancho': [('OLHA O ', 0), ('GRÁFICO', 1), ('\\NDESSE JOGO…', 0)],
     'zoom': [(6.6, .2), (19.0, .25), (28.8, .3), (33.2, .25)], 'boom': [.05, 19.0, 28.8], 'whoosh': [2.45, 13.2], 'vermelho': []},
 'corte3_procurado': {'partes': [(95.3, 103.4), (117.6, 136.7)], 'sem_legenda': [],
     'gancho': [('PROCURADO PELA\\N', 0), ('POLÍCIA', 1), (' NO PÂNTANO', 0)],
     'zoom': [(8.4, .25), (12.2, .2), (14.4, .22), (24.1, .2), (26.6, .28)], 'boom': [.05, 8.4, 26.6], 'whoosh': [2.45, 8.05], 'vermelho': [(8.4, 10.0)]},
}
SOLTAS = {'a', 'o', 'e', 'de', 'do', 'da', 'que', 'um', 'uma', 'pra', 'ó', 'aí', 'se', 'eu', 'ou', 'no', 'na', 'é', 'mas', 'não', 'isso', 'lá', 'para', 'por'}
def ts(t): h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60; return f"{h}:{m:02d}:{s:05.2f}"
esc = lambda s: s.replace('{', '').replace('}', '')
HEAD = open('cortes.py').read().split('HEAD = """')[1].split('"""')[0]
HEAD = HEAD.replace('Style: Leg,Roboto Condensed Black,96,', 'Style: Leg,Roboto Condensed Black,100,')
AMAR = '{\\c&H24C4FF&}'; BRANCO = '{\\c&HFFFFFF&}'
def load(n):
    with wave.open(f'{SFX}/{n}.wav') as w: return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32767
for nome, c in CORTES.items():
    if len(sys.argv) > 1 and nome not in sys.argv[1:]: continue
    lst = []
    for i, (a, b) in enumerate(c['partes']):
        f = f'_{nome}_{i}.mp4'; lst.append(f)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(a), '-to', str(b), '-i', 'gp.mp4', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16', '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', f], check=True)
    open('_lista.txt', 'w').write(''.join(f"file '{f}'\n" for f in lst))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', '_lista.txt', '-c', 'copy', f'_{nome}_src.mp4'], check=True)
    ws, off = [], 0.0
    for a, b in c['partes']:
        for w in W:
            if a <= w['s'] < b and not any(x <= w['s'] < y for x, y in c['sem_legenda']):
                ws.append({'t': w['t'], 's': w['s'] - a + off, 'e': min(w['e'], b) - a + off})
        off += b - a
    dur = off
    chunks, cur = [], []
    for i, w in enumerate(ws):
        cur.append(w); txt = ' '.join(x['t'] for x in cur)
        fim = re.search(r'[.,!?]$', w['t']) or len(cur) >= 4 or len(txt) > 18
        gap = i + 1 < len(ws) and ws[i + 1]['s'] - w['e'] > .6
        if (fim or gap) and not (re.sub(r'[^\wÀ-ÿ]', '', w['t'].lower()) in SOLTAS and i + 1 < len(ws) and not gap and len(cur) < 5):
            chunks.append(cur); cur = []
    if cur: chunks.append(cur)
    ev = []
    for k, ch in enumerate(chunks):
        cst = max(ch[0]['s'], 2.6); cen = min(chunks[k + 1][0]['s'] if k + 1 < len(chunks) else dur, ch[-1]['e'] + .5)
        if cen <= cst: continue
        pal = [esc(re.sub(r'[.,!?…]+$', '', x['t']).upper()) for x in ch]
        for j, w in enumerate(ch):  # karaokê: a palavra falada acende
            ws_ = cst if j == 0 else max(w['s'], cst); we_ = cen if j == len(ch) - 1 else max(ch[j + 1]['s'], cst)
            if we_ <= ws_: continue
            txt = ' '.join((AMAR + '{\\fscx112\\fscy112}' + p + '{\\fscx100\\fscy100}' + BRANCO) if i == j else p for i, p in enumerate(pal))
            pop = '\\fscx70\\fscy70\\t(0,110,\\fscx100\\fscy100)' if j == 0 else ''
            ev.append(f"Dialogue: 1,{ts(ws_)},{ts(we_)},Leg,,0,0,0,,{{\\pos(540,1230){pop}}}{txt}")
    g = ''.join((AMAR + t + BRANCO) if hl else t for t, hl in c['gancho'])
    ev.append(f"Dialogue: 2,{ts(0)},{ts(2.6)},Gancho,,0,0,0,,{{\\pos(540,720)\\fscx160\\fscy160\\t(0,140,\\fscx100\\fscy100)\\t(2300,2600,\\alpha&HFF&)}}{g}")
    ev.append(f"Dialogue: 0,{ts(0)},{ts(dur)},Credito,,0,0,0,,{{\\pos(251,490)\\alpha&H30&}}CORTE • LIVE DO PAULINHO")
    open(f'_{nome}.ass', 'w').write(HEAD + '\n'.join(ev) + '\n')
    # zoom (sobe rápido, volta devagar), tremida e clarões
    Z = '+'.join(f"{s}*clip((t-{t0})/0.12,0,1)*clip(({t0}+1.6-t)/0.6,0,1)" for t0, s in c['zoom']) or '0'
    SX = '+'.join(f"18*sin(t*75)*between(t,{t0},{t0}+0.35)" for t0 in c['boom']) or '0'
    SY = '+'.join(f"14*cos(t*63)*between(t,{t0},{t0}+0.35)" for t0 in c['boom']) or '0'
    flashes = ''.join(f",drawbox=x=0:y=0:w=1080:h=1920:color=white@0.55:t=fill:enable='between(t,{t0},{t0}+0.07)'" for t0 in c['boom'] + c['whoosh'][1:])
    reds = ''.join(f",drawbox=x=0:y=0:w=1080:h=1920:color=red@0.22:t=fill:enable='between(t,{a},{b})*lt(mod(t,0.5),0.25)'" for a, b in c['vermelho'])
    band = c.get('faixa_legenda')
    fc = ("[0:v]split=3[a][b][c];"
          "[a]crop=324:576:461:0,scale=1080:1920,setsar=1,"
          f"scale=w='trunc(1080*(1+{Z})/2)*2':h='trunc(1920*(1+{Z})/2)*2':eval=frame,crop=1080:1920:x='(iw-1080)/2+({SX})':y='(ih-1920)/2+({SY})'[game];"
          "[b]crop=238:166:0:0,scale=430:300,setsar=1[cam];"
          "[game][cam]overlay=36:150,drawbox=x=32:y=146:w=438:h=308:color=white@0.9:t=4" + flashes + reds + "[t1];"
          + (f"[c]crop=660:58:293:516,scale=1040:122,setsar=1,format=gray,lut=y='if(gt(val\\,200)\\,255\\,0)',boxblur=1[mask];color=c=white:s=1040x122:r=30[wh];[wh][mask]alphamerge[sub];"
             f"[t1]drawbox=x=0:y=1740:w=1080:h=180:color=black@1:t=fill:enable='between(t,{band[0]},{band[1]})',drawbox=x=20:y=1442:w=1040:h=136:color=black@0.5:t=fill:enable='between(t,{band[0]},{band[1]})'[t1b];[t1b][sub]overlay=20:1449:shortest=1:enable='between(t,{band[0]},{band[1]})'[t2];" if band else "[c]nullsink;[t1]null[t2];")
          + f"color=c=0xFFC424:s=1080x12:r=30[bar];[t2][bar]overlay=x='-W+W*t/{dur:.2f}':y=0:shortest=1[t3];"
          + f"[t3]subtitles=_{nome}.ass:fontsdir=fonts[v]")
    # trilha de efeitos
    SR = 44100; mix = np.zeros(int(SR * (dur + 2)))
    def put(n, t, g):
        a = load(n) * g; i = int(t * SR); k = min(len(a), len(mix) - i); mix[i:i + k] += a[:k]
    for t0 in c['boom']: put('impacto', t0, .9)
    for t0 in c['whoosh']: put('whoosh', max(0, t0 - .25), .7)
    for t0, s in c['zoom']: put('whoosh', max(0, t0 - .2), .25)
    for a, b in c['vermelho']: put('riser', a, .3)
    with wave.open(f'_{nome}_sfx.wav', 'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((np.clip(mix * .8, -1, 1) * 32767).astype(np.int16).tobytes())
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'_{nome}_src.mp4', '-i', f'_{nome}_sfx.wav', '-filter_complex', fc + ";[0:a][1:a]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5:LRA=11[aout]",
                    '-map', '[v]', '-map', '[aout]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', f'{nome}.mp4'], check=True)
    print(nome, round(dur, 1), 's')
