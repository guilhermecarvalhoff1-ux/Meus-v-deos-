"""Gera narracao.wav (44.1 kHz) com a voz escolhida, respeitando as pausas '...',
e falas_tempos.json com os tempos de cada legenda (a partir dos tempos de cada palavra)."""
import asyncio, json, os, re, subprocess, sys, wave, numpy as np, edge_tts
VOICE, RATE, PITCH = "en-US-AndrewMultilingualNeural", "+0%", "-2Hz"
PAUSA_RETICENCIAS, PAUSA_PARAGRAFO, SR = 0.5, 0.25, 44100
# uso: python gerar_narracao.py [texto.txt] [saida.wav] [palavras.json]
ARQ = sys.argv[1] if len(sys.argv) > 1 else "NOX_EXPLICA_01_narracao.txt"
OUT_WAV = sys.argv[2] if len(sys.argv) > 2 else "narracao.wav"
OUT_WORDS = sys.argv[3] if len(sys.argv) > 3 else "palavras_tempos.json"
txt = open(ARQ).read().strip()
# trechos: parágrafos, e dentro deles cortes nos "..."
pieces = []
for pi, par in enumerate([p.strip() for p in txt.split("\n") if p.strip()]):
    parts = [x.strip() for x in par.split("...")]
    for j, x in enumerate(parts):
        if x: pieces.append((x, PAUSA_RETICENCIAS if j < len(parts) - 1 else PAUSA_PARAGRAFO))
async def tts(text, out):
    for tent in range(4):
        try:
            c = edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH, proxy=os.environ.get("HTTPS_PROXY"), boundary="WordBoundary")
            words = []
            with open(out, "wb") as f:
                async for ch in c.stream():
                    if ch["type"] == "audio": f.write(ch["data"])
                    elif ch["type"] == "WordBoundary": words.append((ch["text"], ch["offset"] / 1e7, (ch["offset"] + ch["duration"]) / 1e7))
            return words
        except Exception as e:
            print("tentativa", tent + 1, e); await asyncio.sleep(3)
    raise SystemExit("falhou")
def decode(mp3):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", mp3, "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True).stdout
    return np.frombuffer(raw, np.int16).astype(np.float32) / 32768
audio, words, t = [], [], 0.0
for i, (text, pause) in enumerate(pieces):
    w = asyncio.run(tts(text, f"_trecho{i}.mp3")); a = decode(f"_trecho{i}.mp3"); os.remove(f"_trecho{i}.mp3")
    # corta silêncio do fim do trecho
    nz = np.where(np.abs(a) > 0.01)[0]; a = a[: (nz[-1] + int(0.08 * SR)) if len(nz) else len(a)]
    words += [(x, t + s, t + e) for x, s, e in w]
    audio.append(a); audio.append(np.zeros(int(pause * SR), np.float32)); t += len(a) / SR + pause
v = np.concatenate(audio[:-1])
with wave.open(OUT_WAV, "wb") as f:
    f.setnchannels(1); f.setsampwidth(2); f.setframerate(SR); f.writeframes((np.clip(v, -1, 1) * 32767).astype(np.int16).tobytes())
json.dump([{"text": x, "start": round(s, 3), "end": round(e, 3)} for x, s, e in words], open(OUT_WORDS, "w"), ensure_ascii=False, indent=1)
print(len(pieces), "trechos,", len(words), "palavras,", round(len(v) / SR, 2), "s")
