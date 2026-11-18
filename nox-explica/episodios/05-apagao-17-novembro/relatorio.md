⚠️ TEMA DE POLÊMICA — REVISE ANTES DE POSTAR

# Relatório — NOX EXPLICA #05 (gerado automaticamente em 18/11/2026)

**Tema:** o boato do "apagão mundial" de 17 de novembro de 2026 — a "prova" era um episódio dos Simpsons de 2023 misturado com coisas reais (teste de alerta de 1 minuto nos EUA e kit de 72 h da Defesa Civil). Pegadinha "não confundir": apagão regional existe (Espanha e Portugal, 2025), mas não existe botão que desliga o planeta.
**Tipo:** assunto do momento / polêmica leve (mundo, com muita repercussão no Brasil). É um boato desmentido, não um caso contra pessoas.
**Vídeo:** `NOX_EXPLICA_05.mp4` — 1080x1920, 30 fps, **51,0 s, SEM VOZ** (só trilha + legendas com tempos estimados). Prévia de 10 s: `NOX_EXPLICA_05_previa.mp4`. Legendas: `NOX_EXPLICA_05_legendas.srt`.

## Pontos sensíveis
- O perfil anônimo que teria começado o boato **não é citado** (pessoa comum; regra de não expor).
- Nada de personagens/logos dos Simpsons: só uma TV genérica com uma cidadezinha desenhada. O nome "Simpsons" aparece só na fala/legenda.
- O vídeo não diz que alguém mentiu de propósito; só que o boato misturou coisas reais.
- Apagão de Espanha/Portugal (28/04/2025) é citado só como exemplo de apagão regional; foi há mais de 1 ano.
- Golpistas aproveitaram o boato (ligações falsas de "banco") segundo uma fonte só (Global Fact-Checking Network) — **não foi usado** por não ter 2 fontes.
- Deboche vai para o boato ("o fim do mundo tá cada vez mais preguiçoso"), não para quem acreditou.

## Voz — NÃO GERADA (limitação desta execução)
- A rede deste ambiente bloqueou `speech.platform.bing.com` (edge-tts, 403 no proxy) e também `pypi.org` (não deu nem para instalar `edge-tts`/`faster-whisper`).
- Por isso: vídeo renderizado com tempos estimados (2,6 palavras/s, ritmo parecido com a voz real do #04), sem narração. `falas_tempos.json` não foi gerado.
- Voz usada quando der: a oficial do `nox-explica/CLAUDE.md` (`en-US-AndrewMultilingualNeural`, +0%, −2Hz) — a mesma do #04. Não existe `nox-explica/voz.txt`; o pedido do agendamento cai para `pt-BR-AntonioNeural` nesse caso, mas segui o CLAUDE.md do canal, que diz que a voz oficial já foi escolhida. Se quiser outra, crie `voz.txt`.
- Para finalizar com voz (numa máquina com acesso): na pasta do episódio, `python gerar_narracao.py && python montar_tempos.py && python make.py && python audio.py && ffmpeg -y -i nox_video.mp4 -i trilha.wav -c:v copy -c:a aac -b:a 192k -shortest NOX_EXPLICA_05.mp4`. Com a voz real a duração deve ficar perto de 48–52 s.

## Fontes (cada fato em 2+ veículos; detalhes e citações em `roteiro.md`)
- Boato e desmentido: [Aos Fatos](https://www.aosfatos.org/noticias/defesa-civil-militares-simpsons-apagao-mundial/); [Terra](https://terra.com.br/noticias/apagao-em-17-de-novembro-de-2026-entenda-origem-de-boato-que-cita-os-simpsons,5e0bb8a02d846e03ebd9b681bba43de5xoy88s29.html); [Revista Planeta](https://revistaplaneta.com.br/apagao-mundial-17-novembro-2026-boato-redes-sociais); [Diário do Nordeste](https://diariodonordeste.verdesmares.com.br/ultima-hora/mundo/vai-ter-apagao-mundial-em-17-de-novembro-entenda-teoria-que-veio-de-os-simpsons-1.3804708); [Imirante](https://imirante.com/entretenimento/sao-luis/2026/11/12/suposto-apagao-mundial-vira-meme-movimenta-redes).
- Simpsons 2023 sem apagão mundial/2026: Aos Fatos; Diário do Nordeste; Terra.
- Teste de alerta EUA, 17/11, ~1 min, rádio e TV: [Alaska's News Source](https://www.alaskasnewssource.com/2026/11/16/nationwide-emergency-alert-system-test-take-place-tuesday-heres-what-will-happen/); [TV Technology](https://www.tvtechnology.com/regulatory-legal/nationwide-emergency-alert-system-test-set-for-november); Diário do Nordeste; Terra.
- Kit Defesa Civil 72 h / 3 dias, preventivo: Aos Fatos; Terra; Diário do Nordeste.
- Redes descentralizadas, apagão global inviável: Aos Fatos; Terra.
- Espanha e Portugal, 28/04/2025: [Exame](https://exame.com/mundo/apagao-geral-falta-de-energia-paralisa-espanha/); [Renascença](https://rr.pt/especial/pais/2026/04/27/interativo-cronologia-completa-do-apagao-que-parou-portugal-e-espanha/468600/).
- Observação: as fontes divergem sobre a frequência do teste nos EUA (2 ou 3 anos) e sobre a trama exata do episódio; por isso o roteiro não fala disso.

## Checklist (`checklist_revisao.md`)
- [~] Duração: 51,0 s (estimada, sem voz) — abaixo do máximo de 60 s, 1 s acima do ideal de 35–50 s. Com a voz real, conferir.
- [x] Mesmo Nox (`nox.py` idêntico ao do #01/#04), sem boca/nariz; poses none/point/raise/cross; círculo dourado só na abertura e no fim.
- [x] Autorreferência em terceira pessoa ("Nox acha", "que Nox explica"); nenhum "eu/vou".
- [x] Legendas = `narracao.txt`, mesma ordem, nenhuma fala a mais ou a menos.
- [x] Números conferidos e ligados aos conceitos certos: 17/11 (data do boato e do teste), 2023 (episódio), 1 minuto (teste EUA), 3 dias/72 h (kit), 2025 (Espanha/Portugal).
- [x] Diagramas diferenciam os conceitos: teste de alerta ≠ apagão; kit preventivo ≠ alerta; apagão regional (um bloco apaga) ≠ mundial (os outros seguem acesos).
- [~] Legendas: até 2 linhas, embaixo, sem cobrir olhos/diagramas — OK. Sincronia com voz: **não aplicável** (sem voz; tempos estimados).
- [x] Texto de destaque (topo) e legenda (baixo) nunca no mesmo espaço.
- [~] Música discreta, efeitos (whoosh/sino) só nas trocas de cena. Sem voz, não há ducking a conferir.
- [x] Palavrões: porra, caralho, merda (3), todos sobre a situação.
- [x] Termina com "Achou mais alguma merda sem sentido por aí? Manda nos comentários que Nox explica." + "NOX EXPLICA · MANDA SUA DÚVIDA", sem pedir curtida/seguir.
- [x] Sem fotos, vídeos ou logotipos reais (só ícones desenhados).

## Como escolhi o tema
Buscas dos últimos 3 dias (Brasil e mundo). O boato do apagão de 17/11 foi o assunto mais coberto e confirmável (dezenas de veículos e agências de checagem), sem vítimas, sem menores, sem acusação a pessoas. Outros assuntos encontrados vieram de fontes fracas ou únicas.
