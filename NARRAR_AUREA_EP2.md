# Áurea — Parte 2: falta só a narração

O vídeo da Parte 2 está pronto **sem voz** (`aurea_ep2_sem_voz.mp4`, 99,6 s, 47 cenas).
As legendas e os cortes usam tempos **estimados** (`aurea-remotion/public/ep2/words.json`, campo `"estimated": true`).
Tarefa: gravar a narração, trocar os tempos estimados pelos reais e renderizar de novo com som.

## Passos
1. **Narração.** Texto em `roteiro_aurea_ep2.txt` (cópia em `aurea-remotion/public/ep2/narracao.txt`).
   Voz oficial do `CLAUDE.md`: edge-tts `pt-BR-AntonioNeural`, rate `+15%`, pitch `+0Hz`.
   Salvar em `aurea-remotion/public/ep2/narracao.mp3`.
2. **Tempos por palavra.** Gerar `aurea-remotion/public/ep2/words.json` no mesmo formato do ep1:
   `{"words":[{"text":"O","type":"word","start":0.09,"end":0.2}, ...]}`.
   O campo `text` precisa ser a palavra **do roteiro original** (com pontuação), na mesma ordem:
   cada cena começa numa sequência de palavras (`k: '...'` em `ep2/scenes.js`) e as legendas juntam números
   pela lista `PART.merges`. Se o texto enviado à voz for adaptado (vírgulas, números por extenso), mapear de volta.
3. **Duração.** Em `aurea-remotion/public/ep2/scenes.js`, linha `PART.end = 99.6; PART.abTime = 89.63;`:
   - `PART.end` = fim da última palavra + 1,8 s
   - `PART.abTime` = início da palavra "Comenta" − 0,1 s
   Em `aurea-remotion/src/Root.tsx`, no `AureaEp2`: `seconds` = `PART.end` e `audio: true`.
4. **Conferir.** O motor escreve `NAO ACHEI <frase>` no console se alguma cena não encontrar sua frase. Não pode aparecer nenhuma.
5. **Renderizar.** `npx remotion render AureaEp2 ../aurea_ep2.mp4` (dentro de `aurea-remotion/`).
   Alternativa sem Remotion: `python3 aurea-remotion/scripts/render_chrome.py <pasta public> ep2 video 0 <fim> saida.mp4`
   (Chrome headless + ffmpeg, sem áudio; juntar o MP3 depois com `-c:v copy`).
6. **Som.** Música baixa e efeitos só nos impactos, como manda o `CLAUDE.md` (porta do cofre, "Mão Leve", revelação "É ela", carimbo "CULPADO").
7. Salvar `aurea_ep2.mp4` e `aurea_ep2_leve.mp4` na raiz e fazer commit.

## O que já foi conferido
- Um quadro de cada uma das 47 cenas. O movimento não foi assistido rodando: vale revisar a prévia.
- Fato real do roteiro: golpe da Guiding Hand Social Club no EVE Online (2005), cerca de um ano de infiltração, estimado em US$ 16.500.

## Feito em 17/11/2026
- Texto para a voz: `aurea-remotion/public/ep2/narracao_tts.txt` (frases curtas juntadas com vírgula; "CaioLadrão_07" lido como "Caio Ladrão zero sete").
- Voz: `scripts/edge_narr.py` → `public/ep2/narracao_voz.mp3` (103,6 s) e `words_tts.json`; `public/ep2/narracao.mp3` é a mesma voz com 1 s de silêncio no fim.
- Tempos: `scripts/mapear_palavras.py` passa os tempos falados para as 277 palavras do roteiro → `public/ep2/words.json` (única diferença: CaioLadrão_07).
- `PART.end = 104.6`, `PART.abTime = 96.04`; `Root.tsx` com `seconds: 104.6, audio: true`. `node scripts/times.js public ep2`: 47 cenas, nenhum "NAO ACHEI".
- Som: `scripts/mix_ep2.py sfx <tempos> public/ep2/words.json 104.6 out/ep2_sfx.wav` (efeitos nos impactos + música que abaixa sob a voz), somado ao render com ffmpeg `amix`.
