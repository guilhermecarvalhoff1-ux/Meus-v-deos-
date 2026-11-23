# Relatório — NOX EXPLICA #09: Chitãozinho & Xororó vão se aposentar (23/11/2026)

**Tema:** Chitãozinho & Xororó anunciaram no Fantástico (22/11) a aposentadoria dos palcos, com a turnê "Entretempos" a partir de 20/03/2027 (SP), junto com Jorge & Mateus. Pegadinha "não confundir": "Evidências" não foi composta por eles (José Augusto e Paulo Sérgio Valle), e sair dos palcos ≠ fim da dupla.
**Tipo:** assunto do momento (Brasil, música). **Não é polêmica.**
**Vídeo:** `NOX_EXPLICA_09.mp4` — 1080x1920, 30 fps, **53,9 s, SEM VOZ** (tempos estimados). Prévia: `NOX_EXPLICA_09_previa.mp4` (10 s). Legendas: `NOX_EXPLICA_09_legendas.srt` (38 legendas). Texto da narração: `narracao.txt` (113 palavras).

## Como o tema foi escolhido
Busca dos assuntos de 20–23/11. Candidatos descartados:
- Jorge (Jorge & Mateus) cantando paródia anti-PT num encontro com Flávio Bolsonaro e as prefeituras de Recife e Fortaleza tirando a dupla do Réveillon (out–nov): é política partidária, e as "falas ofensivas ao Nordeste" atribuídas a ele não estão confirmadas (ele nega). Não entrou no vídeo.
- Assuntos políticos (laudo da PF/Nikolas) e casos internacionais sem duas fontes confirmadas (pane da Delta, caso de cola com IA na Coreia) ficaram de fora.
- A aposentadoria de Chitãozinho & Xororó (Fantástico, 22/11) tem várias fontes concordando e um gancho bom para o público brasileiro.

## Fontes (cada dado em 2+ fontes)
- Anúncio no Fantástico em 22/11: Billboard Brasil, Massa, O Liberal, Jornal O Goiás.
- Turnê "Entretempos" e 1º show em 20/03/2027 em SP: Billboard Brasil, Massa, Jornal O Goiás.
- Jorge & Mateus na turnê: Billboard Brasil, Jornal O Goiás, Pipoca Moderna.
- 56 anos de carreira / início em 1970: Massa, O Liberal, Jornal O Goiás.
- Só os shows acabam; vão continuar compondo e gravando: Billboard Brasil, Pipoca Moderna.
- "Evidências": compositores José Augusto e Paulo Sérgio Valle (Rádio Senado, Rolling Stone Brasil/Ecad, Wikipédia); gravada pela dupla em 1990 (Rádio Senado, Wikipédia); "segundo hino nacional" (Rádio Senado, O Liberal).
Links completos em `roteiro.md`.

## Checklist (checklist_revisao.md)
- [~] Duração: 53,9 s estimados — abaixo do máximo de 60 s, acima do ideal de 35–50 s. Com a voz real, a duração muda (pela média dos episódios anteriores, ~2,3 palavras/s → ~50–52 s).
- [x] Mesmo Nox do `nox.py` (sem alteração), poses none/cross/raise/point; círculo dourado só na abertura e no fim.
- [x] Autorreferência em terceira pessoa ("Nox explica").
- [x] Legendas = `narracao.txt` palavra por palavra (conferido por script: idênticas).
- [x] Números conferidos: 22/11, 56 anos, 1970, 20/03/2027, 1990.
- [x] Diagramas separam os conceitos: GRAVOU × COMPÔS; SAI DOS PALCOS (SIM) × FIM DA DUPLA (NÃO).
- [~] Legendas no máximo 2 linhas, embaixo, sem cobrir olhos/diagramas. **Sincronia é estimada** (sem áudio), não palavra a palavra.
- [x] Destaque no topo, legenda embaixo, sem sobrepor.
- [x] Música discreta; efeitos só nas trocas de cena (sem voz, a trilha fica em volume baixo).
- [x] Palavrões: 3 (porra, caralho, merda), sobre a situação.
- [x] Termina no convite "Achou mais alguma merda sem sentido por aí? Manda nos comentários que Nox explica." + "NOX EXPLICA · MANDA SUA DÚVIDA", sem pedir curtida/seguir.
- [x] Sem fotos/logos reais: TV, ingresso e silhuetas genéricas de cantores de chapéu.

## Limitações
- **Sem voz:** o ambiente desta execução não tem `edge-tts` nem `faster-whisper` instalados, e o acesso a pypi.org e a speech.platform.bing.com foi bloqueado pelo proxy (403). O vídeo foi renderizado com tempos estimados. Para pôr a voz (oficial: en-US-AndrewMultilingualNeural, +0%, −2Hz, conforme `nox-explica/CLAUDE.md`; não existe `voz.txt`), na pasta do episódio:
  `python gerar_narracao.py && python montar_tempos.py && python make.py && python audio.py && ffmpeg -i nox_video.mp4 -i trilha.wav -c:v copy -c:a aac -b:a 192k -shortest NOX_EXPLICA_09.mp4` e regerar o `.srt`.
- Divergências nas fontes: Billboard fala em 57 anos (as outras, 56); a Wikipédia lista disco de 1969 (as matérias dizem carreira profissional desde 1970). Número de shows diverge (17 datas listadas × "mais de 20"), por isso o vídeo não cita a quantidade.
- Jorge & Mateus aparecem só como participação na turnê; a polêmica política de Jorge ficou fora de propósito. Se comentarem sobre isso, vale não entrar no mérito.
- "No Fantástico" sem data na fala; o "22/11" aparece só na tela, então o vídeo segue válido se postado mais tarde.
- Não postado em rede social.
