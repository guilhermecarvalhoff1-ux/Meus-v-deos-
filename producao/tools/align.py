import json, re, sys
text, silf, dur, out = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4]
txt = open(text).read()
txt = re.sub(r'\[[^\]]*\]', '', txt)
sents = [s.strip() for s in re.findall(r'[^.?!…:]+[.?!…:]+"?|[^.?!…:]+$', txt.replace('\n', ' ')) if s.strip()]
L = [l.split() for l in open(silf)]
sil = []
for i in range(0, len(L) - 1, 2):
    a, b = float(L[i][1]), float(L[i+1][1]); sil.append((a, b))
start = sil[0][1] if sil and sil[0][0] < 0.05 else 0.0
end = sil[-1][0] if sil and sil[-1][1] > dur - 0.1 else dur
gaps = [(a, b) for a, b in sil if a > start + .05 and b < end - .05]
w = [len(s) + 6 for s in sents]; tot = sum(w)
# DP: atribuir cada fronteira entre frases a uma pausa (ou nenhuma), minimizando desvio
import math
cum = [0]
for x in w: cum.append(cum[-1] + x)
est = [start + (end - start) * cum[i] / tot for i in range(1, len(sents))]
n, m = len(est), len(gaps)
INF = 1e18
dp = [[INF] * (m + 1) for _ in range(n + 1)]; ch = [[None] * (m + 1) for _ in range(n + 1)]
dp[0][0] = 0
for i in range(n):
    for j in range(m + 1):
        if dp[i][j] >= INF: continue
        for k in range(j, m):  # usar pausa k (pulando j..k-1)
            c = dp[i][j] + (est[i] - (gaps[k][0] + gaps[k][1]) / 2) ** 2 + 0.3 * (k - j)
            if c < dp[i + 1][k + 1]: dp[i + 1][k + 1] = c; ch[i + 1][k + 1] = (j, k)
best = min(range(m + 1), key=lambda j: dp[n][j] + 0.3 * (m - j))
bounds = []; j = best
for i in range(n, 0, -1):
    pj, k = ch[i][j]; bounds.append(gaps[k]); j = pj
bounds.reverse()
segs = []; s0 = start
for i, s in enumerate(sents):
    e = bounds[i][0] if i < n else end
    segs.append((s0, e)); s0 = bounds[i][1] if i < n else end
words = []
for (a, b), s in zip(segs, sents):
    ws = s.split(); ww = [len(x) + 2 for x in ws]; T = sum(ww); t = a
    for x, l in zip(ws, ww):
        d = (b - a) * l / T; words.append({"text": x, "type": "word", "start": round(t, 3), "end": round(t + d * .9, 3)}); t += d
json.dump({"words": words}, open(out, 'w'), ensure_ascii=False)
print(len(sents), 'frases', len(gaps), 'pausas', 'ok')
for (a, b), s in list(zip(segs, sents))[:50]: print(f"{a:6.2f}-{b:6.2f} {s[:50]}")
