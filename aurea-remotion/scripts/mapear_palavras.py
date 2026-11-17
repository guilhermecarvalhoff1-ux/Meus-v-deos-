"""Passa os tempos das palavras faladas (texto adaptado para a voz) para as palavras do roteiro original.
uso: python3 scripts/mapear_palavras.py roteiro.txt words_tts.json words.json
Palavras iguais herdam o tempo; trechos diferentes (ex.: "CaioLadrão_07" x "Caio Ladrão zero sete")
dividem o tempo do trecho falado correspondente."""
import difflib, json, re, sys
orig = open(sys.argv[1], encoding="utf-8").read().split()
tts = json.load(open(sys.argv[2], encoding="utf-8"))["words"]
# o edge-tts às vezes junta tokens ("Em 2005"): separa proporcionalmente
spl = []
for w in tts:
    p = w["text"].split()
    d = (w["end"] - w["start"]) / len(p)
    spl += [{"text": x, "start": w["start"] + i * d, "end": w["start"] + (i + 1) * d} for i, x in enumerate(p)]
norm = lambda s: re.sub(r"[^\wÀ-ÿ]", "", s.lower())
A, B = [norm(w) for w in orig], [norm(w["text"]) for w in spl]
out = [None] * len(orig)
diffs = []
for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, A, B, autojunk=False).get_opcodes():
    if tag == "equal":
        for k in range(i2 - i1): out[i1 + k] = (spl[j1 + k]["start"], spl[j1 + k]["end"])
    elif i2 > i1:
        if j2 > j1: s, e = spl[j1]["start"], spl[j2 - 1]["end"]
        else:  # palavra do roteiro sem fala correspondente: encaixa no fim da anterior
            s = e = out[i1 - 1][1] if i1 else 0
        n = i2 - i1
        for k in range(n): out[i1 + k] = (s + (e - s) * k / n, s + (e - s) * (k + 1) / n)
        diffs.append((" ".join(orig[i1:i2]), " ".join(w["text"] for w in spl[j1:j2])))
    else:
        diffs.append(("", " ".join(w["text"] for w in spl[j1:j2])))
words = [{"text": w, "type": "word", "start": round(s, 3), "end": round(e, 3)} for w, (s, e) in zip(orig, out)]
json.dump({"words": words}, open(sys.argv[3], "w", encoding="utf-8"), ensure_ascii=False)
print(len(words), "palavras do roteiro;", len(spl), "faladas")
for a, b in diffs: print(f"  roteiro [{a}]  <-  falado [{b}]")
