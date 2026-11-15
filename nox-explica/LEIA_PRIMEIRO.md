# Nox Explica #1 — falta só a narração

O vídeo já está montado (cenas, Nox, diagramas, legendas, trilha). Falta gerar a voz e sincronizar.
O texto aprovado é `NOX_EXPLICA_01_narracao.txt` (versão largada, com palavrões e convite final). Ele substitui as falas do `briefing_01_original.txt`; o resto do briefing continua valendo. Os "..." marcam pausas.

## Passo a passo
1. Instale: `pip install edge-tts pillow numpy scipy faster-whisper` e tenha `ffmpeg`.
2. A voz já foi escolhida: `en-US-AndrewMultilingualNeural` (rate +0%, pitch -2Hz). Não precisa gerar amostras; use `python gerar_narracao.py`.
3. Gere a narração completa com a voz escolhida, sem acelerar. Respeite as pausas dos "...". Salve como `narracao.wav` (44.1 kHz) nesta pasta.
4. Transcreva `narracao.wav` com timestamps por palavra e monte `falas_tempos.json`: uma lista `[{"start":s,"end":s,"text":"..."}]` com UMA entrada por legenda, na mesma ordem e com o mesmo texto das legendas definidas em `SCENES` no `make.py` (ignore os `*`, que só marcam palavra dourada).
   - Se a transcrição tiver erro de palavra, use o texto do roteiro e só os tempos do áudio.
5. Rode `python make.py` (gera `nox_video.mp4` já com cenas e legendas no tempo da fala), depois `python audio.py` (mistura voz + trilha com a trilha abaixando quando a voz fala).
6. Junte: `ffmpeg -i nox_video.mp4 -i trilha.wav -c:v copy -c:a aac -b:a 192k -shortest NOX_EXPLICA_01.mp4`
7. Rode o `checklist_revisao.md`, mostre o resultado ao usuário e faça commit do MP4 final.

`python make.py test 3,20,45` gera `test.jpg` com quadros de conferência.
