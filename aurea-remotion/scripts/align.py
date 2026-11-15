import json, re, sys
text, silf, dur, out = sys.argv[1], sys.argv[2], float(sys.argv[3]), sys.argv[4]
txt = re.sub(r'\[[^\]]*\]', '', open(text).read()).replace('\n', ' ')
sents = [s.strip() for s in re.findall(r'[^.?!…:]+[.?!…:]+"?|[^.?!…:]+$', txt) if s.strip()]
vals = [float(l.split()[1]) for l in open(silf) if l.strip()]
sil = [(vals[i], vals[i+1]) for i in range(0, len(vals) - 1, 2)]
start = sil[0][1] if sil and sil[0][0] < .05 else 0.0
end = sil[-1][0] if sil and sil[-1][1] > dur - .1 else dur
gaps = [g for g in sil if g[0] > start + .05 and g[1] < end - .05]
# fronteiras possíveis: início, cada pausa, fim
pts = [(start, start)] + gaps + [(end, end)]
w = [len(s) + 3 for s in sents]
speech = (end - start) - sum(b - a for a, b in gaps) * .5
rate = speech / sum(w)
n, m = len(sents), len(pts)
INF = float('inf')
dp = [[INF] * m for _ in range(n + 1)]; ch = [[None] * m for _ in range(n + 1)]
dp[0][0] = 0
for i in range(n):
    for j in range(m):
        if dp[i][j] == INF: continue
        for k in range(j + 1, m):
            seg_d = pts[k][0] - pts[j][1]
            exp = w[i] * rate
            if seg_d > exp * 3 + 2: break
            skipped = k - j - 1
            c = dp[i][j] + ((seg_d - exp) / (exp ** .5 + .3)) ** 2 + .6 * skipped
            if c < dp[i + 1][k]: dp[i + 1][k] = c; ch[i + 1][k] = j
k = m - 1; idx = [k]
for i in range(n, 0, -1): k = ch[i][k]; idx.append(k)
idx.reverse()
words = []
for i, s in enumerate(sents):
    a, b = pts[idx[i]][1], pts[idx[i + 1]][0]
    ws = s.split(); ww = [len(x) + 2 for x in ws]; T = sum(ww); t = a
    for x, l in zip(ws, ww):
        d = (b - a) * l / T; words.append({"text": x, "type": "word", "start": round(t, 3), "end": round(t + d * .9, 3)}); t += d
    print(f"{a:6.2f}-{b:6.2f} {s[:48]}")
json.dump({"words": words}, open(out, 'w'), ensure_ascii=False)
