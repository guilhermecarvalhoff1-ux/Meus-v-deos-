import json, subprocess, os, re
W = json.load(open('words.json'))
CORTES = {
 'corte1_conta_de_banco': {'partes': [(37.8, 64.6), (82.9, 95.1)], 'sem_legenda': [(37.9, 64.2)], 'faixa_legenda': (1.2, 26.8),
     'gancho': [('LIGARAM PEDINDO A\\N', 0), ('CONTA DE BANCO', 1), (' DELE\\NNO MEIO DO PÂNTANO', 0)]},
 'corte2_grafico': {'partes': [(0.0, 36.5)], 'sem_legenda': [],
     'gancho': [('OLHA O ', 0), ('GRÁFICO', 1), (' DESSE JOGO…', 0)]},
 'corte3_procurado': {'partes': [(95.3, 136.7)], 'sem_legenda': [],
     'gancho': [('PROCURADO PELA ', 0), ('POLÍCIA', 1), ('\\NNO MEIO DO PÂNTANO', 0)]},
}
SOLTAS = {'a', 'o', 'e', 'de', 'do', 'da', 'que', 'um', 'uma', 'pra', 'ó', 'aí', 'se', 'eu', 'ou', 'no', 'na', 'é', 'mas', 'não', 'isso', 'lá'}
def ts(t): h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60; return f"{h}:{m:02d}:{s:05.2f}"
def esc(s): return s.replace('{', '').replace('}', '')
HEAD = """[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Leg,Roboto Condensed Black,96,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,0,0,0,0,100,100,1,0,1,9,2,5,40,40,0,1
Style: Gancho,Roboto Condensed Black,74,&H00FFFFFF,&H00FFFFFF,&H00000000,&HA0000000,0,0,0,0,100,100,1,0,1,8,0,5,40,40,0,1
Style: Credito,Roboto Condensed Black,28,&H00FFFFFF,&H00FFFFFF,&H00000000,&H64000000,0,0,0,0,100,100,2,0,1,4,0,5,40,40,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
AMAR = '{\\c&H24C4FF&}'; BRANCO = '{\\c&HFFFFFF&}'
import sys
for nome, c in CORTES.items():
    if len(sys.argv) > 1 and nome not in sys.argv[1:]: continue
    # 1) recorta e junta as partes
    lst = []
    for i, (a, b) in enumerate(c['partes']):
        f = f'_{nome}_{i}.mp4'; lst.append(f)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', str(a), '-to', str(b), '-i', 'gp.mp4', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16', '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', f], check=True)
    open('_lista.txt', 'w').write(''.join(f"file '{f}'\n" for f in lst))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', '_lista.txt', '-c', 'copy', f'_{nome}_src.mp4'], check=True)
    # 2) palavras na linha do tempo do corte
    ws, off = [], 0.0
    for a, b in c['partes']:
        for w in W:
            if a <= w['s'] < b and not any(x <= w['s'] < y for x, y in c['sem_legenda']):
                ws.append({'t': w['t'], 's': w['s'] - a + off, 'e': min(w['e'], b) - a + off})
        off += b - a
    dur = off
    # 3) pedaços de 2 a 4 palavras, sem terminar em palavra solta
    chunks, cur = [], []
    for i, w in enumerate(ws):
        cur.append(w)
        txt = ' '.join(x['t'] for x in cur)
        fim = re.search(r'[.,!?]$', w['t']) or len(cur) >= 4 or len(txt) > 18
        gap = i + 1 < len(ws) and ws[i + 1]['s'] - w['e'] > .6
        if (fim or gap) and not (re.sub(r'[^\wÀ-ÿ]', '', w['t'].lower()) in SOLTAS and i + 1 < len(ws) and not gap and len(cur) < 5):
            chunks.append(cur); cur = []
    if cur: chunks.append(cur)
    ev = []
    for k, ch in enumerate(chunks):
        st = ch[0]['s']; en = min(chunks[k + 1][0]['s'] if k + 1 < len(chunks) else dur, ch[-1]['e'] + .5)
        if st < 2.6: st = max(st, 2.6)  # o gancho ocupa o começo
        if en <= st: continue
        palavras = [esc(re.sub(r'[.,!?…]+$', '', x['t']).upper()) for x in ch]
        chave = max(range(len(palavras)), key=lambda j: len(palavras[j])) if max(len(p) for p in palavras) >= 5 else -1
        txt = ' '.join((AMAR + p + BRANCO) if j == chave else p for j, p in enumerate(palavras))
        ev.append(f"Dialogue: 1,{ts(st)},{ts(en)},Leg,,0,0,0,,{{\\pos(540,1230)\\fscx82\\fscy82\\t(0,90,\\fscx100\\fscy100)}}{txt}")
    g = ''.join((AMAR + t + BRANCO) if hl else t for t, hl in c['gancho'])
    ev.append(f"Dialogue: 2,{ts(0)},{ts(2.6)},Gancho,,0,0,0,,{{\\pos(540,700)\\fscx120\\fscy120\\t(0,150,\\fscx100\\fscy100)}}{g}")
    ev.append(f"Dialogue: 0,{ts(0)},{ts(dur)},Credito,,0,0,0,,{{\\pos(251,490)\\alpha&H30&}}CORTE • LIVE DO PAULINHO")
    open(f'_{nome}.ass', 'w').write(HEAD + '\n'.join(ev) + '\n')
    # 4) layout vertical: fundo desfocado, câmera em cima, jogo embaixo, legendas
    # jogo em tela cheia (corte vertical do centro) + câmera pequena no canto de cima
    band = c.get('faixa_legenda')
    fc = ("[0:v]split=3[a][b][c];"
          "[a]crop=324:576:461:0,scale=1080:1920,setsar=1[game];"
          "[b]crop=238:166:0:0,scale=430:300,setsar=1[cam];"
          "[game][cam]overlay=36:150,drawbox=x=32:y=146:w=438:h=308:color=white@0.9:t=4[t1];"
          + (f"[c]crop=660:58:293:516,scale=1040:122,setsar=1,format=gray,lut=y='if(gt(val\\,200)\\,255\\,0)',boxblur=1[mask];color=c=white:s=1040x122:r=30[wh];[wh][mask]alphamerge[sub];"
             f"[t1]drawbox=x=0:y=1740:w=1080:h=180:color=black@1:t=fill:enable='between(t,{band[0]},{band[1]})',drawbox=x=20:y=1442:w=1040:h=136:color=black@0.5:t=fill:enable='between(t,{band[0]},{band[1]})'[t1b];[t1b][sub]overlay=20:1449:shortest=1:enable='between(t,{band[0]},{band[1]})'[t2];" if band else "[c]nullsink;[t1]null[t2];")
          + f"[t2]subtitles=_{nome}.ass:fontsdir=fonts[v]")
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', f'_{nome}_src.mp4', '-filter_complex', fc, '-map', '[v]', '-map', '0:a', '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11',
                    '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-r', '30', '-c:a', 'aac', '-b:a', '192k', '-ar', '44100', f'{nome}.mp4'], check=True)
    print(nome, round(dur, 1), 's,', len(ev) - 2, 'legendas')
