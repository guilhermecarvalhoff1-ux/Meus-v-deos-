"""Monta as vozes gravadas do Ep1 'O Posto' na linha do tempo e gera as legendas palavra por palavra.
As falas são alinhadas pelas pausas de cada gravação (cada trecho = uma frase do roteiro);
dentro do trecho, o tempo de cada palavra é proporcional ao tamanho dela.
uso: python3 scripts/posto_vozes.py  -> public/posto/vozes.wav e public/posto/words.json"""
import json, os, wave, numpy as np
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'posto60')
VZ = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'posto', 'vozes')
SR = 44100
def load(n):
    with wave.open(os.path.join(VZ, n)) as w: return np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
# (arquivo, recorte_ini, recorte_fim, posição no vídeo, [(trecho_ini, trecho_fim, frase), ...]) — tempos dos trechos dentro do arquivo
FALAS = [  # versão curta: (arquivo, recorte_ini, recorte_fim, posição, trechos, velocidade)
 ('Narrac_a_o.wav', 0.30, 5.05, 3.0, [(.44, 2.08, 'Primeiro dia / com o Corsa.'), (2.56, 3.68, 'E primeira missão:'), (4.15, 4.94, 'abastecer.')]),
 ('Avo.wav', 0.0, 1.55, 15.4, [(.19, 1.39, '"Esse carro / vai ser teu / um dia."')]),
 ('Frentista.wav', 0.0, 3.43, 17.65, [(.36, .98, '"Completa…'), (1.23, 3.40, 'ou só vinte reais / pra ele / chegar em casa?"')]),
 ('Cara_1.wav', 0.0, 3.43, 20.95, [(.24, .53, '"Ô,'), (.78, 3.40, 'esse aí veio / com o vô junto / ou só o cheiro?"')]),
 ('Cara_2.wav', 0.0, 2.2, 25.3, [(.45, 1.87, '"Até o carro / tá com vergonha, mano!"')]),
 ('Cara_3.wav', 0.0, 3.43, 26.95, [(.37, 1.20, '"Esse pneu'), (1.39, 3.03, 'é mais careca / que o meu tio."')]),
 ('Narrac_a_o.wav', 5.60, 10.60, 34.0, [(5.76, 8.22, 'Ele podia / ter ido embora / rindo junto.'), (8.89, 10.48, 'Mas ele lembrou / do avô.')], 1.08),
 ('Avo.wav', 1.55, 3.6, 38.6, [(1.69, 2.55, '"Segura firme,'), (2.79, 3.55, 'que ele é teu."')]),
 ('Narrac_a_o.wav', 11.15, 15.90, 41.9, [(11.31, 12.62, 'Nesse mesmo posto,'), (12.95, 15.76, 'o Corsa já foi / o carro mais bonito / da rua.')]),
 ('Narrac_a_o_2.wav', 0.15, 5.55, 50.6, [(.30, 2.10, 'A: ele vende / o carro do avô / e compra um melhor.'), (2.29, 2.63, 'Ou B:'), (3.04, 4.62, 'fica com o Corsa / e faz um projeto.'), (4.87, 5.28, 'Comenta aí!')]),
]
TOTAL = 60
COLA = {'"Ô,', 'A:', 'B:'}
mix = np.zeros(SR * TOTAL); words = []
import subprocess
for fala in FALAS:
    f, a, b, pos, trechos = fala[:5]; vel = fala[5] if len(fala) > 5 else 1.0
    x = load(f)[int(a * SR):int(b * SR)].copy()
    if vel != 1.0:
        raw = subprocess.run(['ffmpeg', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-filter:a', f'atempo={vel}', '-f', 'f32le', '-'], input=x.astype(np.float32).tobytes(), capture_output=True).stdout
        x = np.frombuffer(raw, np.float32).copy()
    k = int(.03 * SR); x[:k] *= np.linspace(0, 1, k); x[-k:] *= np.linspace(1, 0, k)
    i = int(pos * SR); mix[i:i + len(x)] += x[:len(mix) - i]
    for t0, t1, frase in trechos:
        toks = frase.split(); ws, br = [], []
        for w in toks:
            if w == '/': br[-1] = True; continue
            ws.append(w); br.append(False)
        br[-1] = ws[-1] not in COLA
        peso = [len(w.strip('".,:…?!')) + 1.5 for w in ws]; tot = sum(peso); c = t0
        for w, pz, b in zip(ws, peso, br):
            d = (t1 - t0) * pz / tot
            words.append({'text': w, 'type': 'word', 'start': round(pos + (c - a) / vel, 3), 'end': round(pos + (c - a + d) / vel, 3), 'br': b}); c += d
mix = mix / max(1e-9, np.max(np.abs(mix))) * .95
with wave.open(os.path.join(D, 'vozes.wav'), 'w') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
for w in words:
    if w['text'] == 'cheiro?"': w['hold'] = .12  # legenda do cara 1 sai antes do corte para o retrovisor
json.dump({'words': words}, open(os.path.join(D, 'words.json'), 'w'), ensure_ascii=False)
print(len(words), 'palavras; última termina em', words[-1]['end'])
