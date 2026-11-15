"""Prepara a narração gravada para o Ep1 e (opcional) renderiza.

uso: python3 scripts/narracao.py <audio> [--words words.json] [--render]
- Alinha o texto de public/ep1/narracao.txt às pausas do áudio (ou usa um words.json de transcrição, se dado)
- Abre o trecho sem fala da luta (PART.gap em scenes.js) inserindo silêncio no áudio
- Atualiza duração (src/Root.tsx), PART.end e PART.abTime, e liga o áudio
"""
import json, re, subprocess, sys, os, shutil
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EP = os.path.join(ROOT, 'public', 'ep1')
args = sys.argv[1:]
audio = args[0]
words_in = args[args.index('--words') + 1] if '--words' in args else None
def run(c): return subprocess.run(c, capture_output=True, text=True)
dur = float(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', audio]).stdout)
tmp = os.path.join(ROOT, 'out'); os.makedirs(tmp, exist_ok=True)
if words_in:
    shutil.copy(words_in, os.path.join(EP, 'words.json'))
else:
    log = run(['ffmpeg', '-hide_banner', '-i', audio, '-af', 'silencedetect=noise=-38dB:d=0.18', '-f', 'null', '-']).stderr
    sil = os.path.join(tmp, 'sil.txt'); open(sil, 'w').write('\n'.join(re.findall(r'silence_(?:start|end): [0-9.]+', log)))
    print(run(['python3', '-I', os.path.join(ROOT, 'scripts', 'align.py'), os.path.join(EP, 'narracao.txt'), sil, str(dur), os.path.join(EP, 'words.json')]).stdout)
words = json.load(open(os.path.join(EP, 'words.json')))['words']
norm = lambda w: re.sub(r'[^\w]', '', w.lower())
scenes = open(os.path.join(EP, 'scenes.js')).read()
m = re.search(r"gap: \{ key: '([^']+)', dur: ([0-9.]+) \}", scenes)
gkey, gdur = m.group(1).split(), float(m.group(2))
ws = [w for w in words if not w['text'].startswith('[')]
t0 = next(ws[i]['start'] for i in range(len(ws)) if all(i + j < len(ws) and norm(ws[i + j]['text']) == k for j, k in enumerate(gkey)))
cut = t0 - 0.15
# áudio com silêncio no trecho da luta
out_audio = os.path.join(EP, 'narracao.mp3')
run(['ffmpeg', '-y', '-v', 'error', '-i', audio, '-filter_complex',
     f"[0]atrim=0:{cut},asetpts=PTS-STARTPTS[a];[0]atrim={cut},asetpts=PTS-STARTPTS[b];anullsrc=r=44100:cl=stereo,atrim=0:{gdur}[s];[a]aformat=sample_rates=44100:channel_layouts=stereo[a2];[b]aformat=sample_rates=44100:channel_layouts=stereo[b2];[a2][s][b2]concat=n=3:v=0:a=1",
     '-b:a', '192k', out_audio])
total = dur + gdur + 0.6
ab = next((w['start'] for w in ws if norm(w['text']) == 'comenta'), dur - 8) + gdur - 0.2
scenes = re.sub(r"(const PART = \{ words: '[^']+', end: )[0-9.]+(, abTime: )[0-9.]+", lambda mm: f"{mm.group(1)}{total:.1f}{mm.group(2)}{ab:.1f}", scenes)
open(os.path.join(EP, 'scenes.js'), 'w').write(scenes)
rt = os.path.join(ROOT, 'src', 'Root.tsx'); r = open(rt).read()
r = re.sub(r'\{ id: "AureaEp1", ep: "ep1", seconds: [0-9.]+, audio: (true|false) \}', f'{{ id: "AureaEp1", ep: "ep1", seconds: {total:.1f}, audio: true }}', r)
open(rt, 'w').write(r)
print(f'narração {dur:.1f}s + luta {gdur:.0f}s = {total:.1f}s; gap em {cut:.2f}s; A/B em {ab:.1f}s')
if '--render' in args:
    subprocess.run(['npx', 'remotion', 'render', 'AureaEp1', 'out/aurea_ep1.mp4', '--concurrency=4'], cwd=ROOT)
