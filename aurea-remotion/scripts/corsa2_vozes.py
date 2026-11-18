"""Ep2: gera as falas (edge-tts), alinha palavra por palavra e monta public/corsa2/vozes.wav + words.json.
" / " na frase = quebra de legenda. uso: python3 scripts/corsa2_vozes.py"""
import asyncio, json, os, re, subprocess, difflib, wave, numpy as np, edge_tts
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'corsa2')
SR = 44100
VOZ = {'narr': ('pt-BR-AntonioNeural', '+15%', '+0Hz'), 'narr2': ('pt-BR-AntonioNeural', '+23%', '+0Hz'), 'jorge': ('pt-BR-AntonioNeural', '-4%', '-7Hz'), 'lucas': ('en-US-BrianMultilingualNeural', '+8%', '+0Hz')}
FALAS = [
 (3.2, 'narr', 'Vocês escolheram / o projeto. / Então o Lucas levou / o Corsa pro seu Jorge.'),
 (7.2, 'narr', 'Mecânico do bairro / há quarenta anos. / E amigo do avô.'),
 (11.6, 'jorge', 'Esse escapamento / tá podre, moleque.'),
 (15.3, 'jorge', 'Escape novo, / instalado: / seiscentos e cinquenta.'),
 (19.4, 'narr', 'O Lucas / tinha trezentos.'),
 (23.6, 'narr', 'Aí ele teve / uma ideia.'),
 (29.4, 'jorge', 'Barato sai caro, / hein.'),
 (30.6, 'lucas', 'Confia.'),
 (37.0, 'narr', 'Instalaram. / Hora do teste.'),
 (44.3, 'jorge', 'Falei. / Agora tem dois jeitos / de arrumar isso.'),
 (50.2, 'narr2', 'A: gasta quase tudo / num escape de verdade, / com ronco grave. / Ou B: aguenta / o escape de pato / por enquanto / e guarda o dinheiro / pras rodas. / Comenta aí.'),
]
async def tts(text, voz, out):
    v, r, p = voz
    for k in range(15):
        try:
            c = edge_tts.Communicate(text, v, rate=r, pitch=p, proxy=os.environ.get('HTTPS_PROXY'), boundary='WordBoundary'); ws = []
            with open(out, 'wb') as f:
                async for ch in c.stream():
                    if ch['type'] == 'audio': f.write(ch['data'])
                    elif ch['type'] == 'WordBoundary': ws.append((ch['text'], ch['offset'] / 1e7, (ch['offset'] + ch['duration']) / 1e7))
            if ws: return ws
        except Exception as e: pass
        await asyncio.sleep(3)
    raise SystemExit('falhou: ' + text)
def dec(f):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True).stdout
    a = np.frombuffer(raw, np.int16).astype(np.float32) / 32768; nz = np.where(np.abs(a) > .01)[0]
    return a[:nz[-1] + int(.06 * SR)] if len(nz) else a
norm = lambda s: re.sub(r'[^\wÀ-ÿ]', '', s.lower())
mix = np.zeros(SR * 60); words = []; fim = 0; log = []
for i, (t0, who, frase) in enumerate(FALAS):
    toks = frase.split(); orig, br = [], []
    for w in toks:
        if w == '/': br[-1] = True; continue
        orig.append(w); br.append(False)
    br[-1] = True
    f = os.path.join(D, f'_f{i}.mp3'); ws = asyncio.run(tts(' '.join(orig), VOZ[who], f)); a = dec(f); os.remove(f)
    spl = []
    for w, s, e in ws:
        p = w.split(); d = (e - s) / len(p); spl += [(x, s + k * d, s + (k + 1) * d) for k, x in enumerate(p)]
    st = max(t0, fim + .15); A, B = [norm(w) for w in orig], [norm(w[0]) for w in spl]; tm = [None] * len(orig)
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, A, B, autojunk=False).get_opcodes():
        if tag == 'equal':
            for k in range(i2 - i1): tm[i1 + k] = spl[j1 + k][1:]
        elif i2 > i1:
            s_, e_ = (spl[j1][1], spl[j2 - 1][2]) if j2 > j1 else ((tm[i1 - 1][1],) * 2 if i1 else (0, 0))
            for k in range(i2 - i1): tm[i1 + k] = (s_ + (e_ - s_) * k / (i2 - i1), s_ + (e_ - s_) * (k + 1) / (i2 - i1))
    for w, (s_, e_), b in zip(orig, tm, br): words.append({'text': w, 'type': 'word', 'start': round(st + s_, 3), 'end': round(st + e_, 3), 'br': b, 'who': who})
    j = int(st * SR); mix[j:j + len(a)] += a[:len(mix) - j]; fim = st + len(a) / SR
    log.append({'who': who, 'start': round(st, 2), 'end': round(fim, 2), 'text': frase.replace(' / ', ' ')})
    print(f'{who:6s} {st:5.2f}-{fim:5.2f} {frase.replace(" / ", " ")}')
mix = mix / max(1e-9, np.max(np.abs(mix))) * .95
with wave.open(os.path.join(D, 'vozes.wav'), 'w') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
json.dump({'words': words}, open(os.path.join(D, 'words.json'), 'w'), ensure_ascii=False)
json.dump(log, open(os.path.join(D, 'falas.json'), 'w'), ensure_ascii=False, indent=1)
