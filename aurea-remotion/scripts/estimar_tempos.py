"""Gera words.json com tempos estimados no ritmo da voz oficial (Antonio +15%),
para montar o vídeo antes de a narração existir. uso: make_words.py roteiro.txt out.json"""
import json, re, sys
text = open(sys.argv[1], encoding="utf-8").read()
words, t = [], 0.15
PAUSE = {",": .2, ".": .42, ":": .32, "…": .55, "?": .45, "!": .4}
for line in text.splitlines():
    for w in line.split():
        core = re.sub(r"[^\wÀ-ÿ]", "", w)
        n = len(core) or 1
        d = .07 + .056 * n
        if core.isdigit(): d = .6  # "dois mil e cinco"
        words.append({"text": w, "type": "word", "start": round(t, 3), "end": round(t + d, 3)})
        t += d + .02
        end = w.rstrip('"')[-1:]
        t += PAUSE.get(end, 0)
    t += .1
K = .87
for x in words: x["start"] = round(x["start"] * K, 3); x["end"] = round(x["end"] * K, 3)
t *= K
json.dump({"words": words, "estimated": True}, open(sys.argv[2], "w", encoding="utf-8"), ensure_ascii=False)
print(len(words), "palavras,", round(t, 2), "s")
