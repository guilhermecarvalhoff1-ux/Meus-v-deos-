# Relatório — NOX EXPLICA #10: por que "Black Friday" se chama assim (25/11/2026)

**Tema:** a Black Friday é nesta sexta (27/11). O vídeo explica a origem real do nome (polícia da Filadélfia, caos de trânsito nos anos 1950–60), a versão de marketing dos anos 80 ("do vermelho pro preto") e desmente o boato de que o nome vem da venda de escravizados. Fecha com a "metade do dobro" (preço inflado antes do desconto).
**Tipo:** assunto do momento (mundo + Brasil) com boato desmentido. **Não é polêmica** sobre pessoas, partidos ou casos policiais.
**Vídeo:** `NOX_EXPLICA_10.mp4` — 1080x1920, 30 fps, **54,6 s, SEM VOZ** (tempos estimados). Prévia: `NOX_EXPLICA_10_previa.mp4` (10 s). Legendas: `NOX_EXPLICA_10_legendas.srt` (37 legendas). Narração: `narracao.txt` (119 palavras).

## Ponto de atenção (revise antes de postar)
- O tema encosta em escravidão. O roteiro trata o assunto só para desmentir o boato, sem piada com escravidão; os palavrões ("caralho", "porra", "merda") ficam no caos do trânsito, no marketing e no convite final. Vale conferir se o tom ficou como você quer.

## Como o tema foi escolhido
Busca dos assuntos de 22–25/11 (Brasil e mundo). Descartados:
- Volta de Jensen Huang à Nvidia: envolve suposto caso extraconjugal e suspeitas de espionagem não confirmadas, além de política dos EUA.
- Capa do EP "FRITA" da Lexa: só uma suspeita de uso de IA, sem confirmação, com base em comentários de internautas.
- Crimes, enchentes com mortes no Paraná, guerras e casos com menores: vetados pelas regras.
- A Black Friday (sexta, 27/11) é assunto garantido no Brasil, e o boato sobre o nome é bem documentado por agências de checagem.

## Fontes (cada dado em 2+ fontes)
- Data 27/11/2026: Gazeta do Povo, NSC Total (e Gazeta SP).
- Polícia da Filadélfia, trânsito e multidões depois do Dia de Ação de Graças, anos 1950–60 (em uso em 1961): History.com, Snopes, Gazeta do Povo.
- Versão "vermelho → preto" posterior (1981 é o registro mais antigo; virou discurso do varejo no fim dos anos 80): Snopes, Gazeta do Povo, History.com.
- Boato da escravidão falso: PolitiFact ("False"), Snopes, History.com. Abolição em 1865 / "quase um século" antes: PolitiFact, Snopes.
- "Metade do dobro" / maquiagem de preço: Gazeta do Povo (2026), NSC Total; Procon-MPMG recomenda conferir histórico de preço.
Links completos em `roteiro.md`.

## Checklist (checklist_revisao.md)
- [~] Duração: 54,6 s estimados, abaixo do máximo de 60 s, mas acima do ideal de 35–50 s. Com a voz real (~2,3 palavras/s nos episódios anteriores), deve ficar em ~52 s.
- [x] Mesmo Nox do `nox.py` (sem alteração), poses none/cross/point/raise; círculo dourado só na abertura e no fim.
- [x] Autorreferência em terceira pessoa ("Nox explica").
- [x] Legendas = `narracao.txt` palavra por palavra (conferido por script: idênticas).
- [x] Números conferidos: 27/11, anos 1950–60, 1961, anos 80, 1865, ≈96 anos (1961 − 1865).
- [x] Diagramas separam os conceitos: origem real (polícia/trânsito) × versão de marketing (livro-caixa) × boato (carimbo FALSO + linha do tempo).
- [~] Legendas com no máximo 2 linhas, embaixo, sem cobrir olhos nem diagramas. **A sincronia é estimada** (sem áudio), não palavra a palavra.
- [x] Destaque no topo e legenda embaixo, sem sobreposição (na cena 5 a etiqueta de preço ocupa o topo e some antes do "NOX EXPLICA").
- [x] Música discreta; efeitos só nas trocas de cena. Sem voz, a trilha fica em volume baixo.
- [x] Palavrões: 3 (caralho, porra, merda), sobre a situação, sem ofensa a pessoas ou grupos.
- [x] Termina no convite "Achou mais alguma merda sem sentido por aí? Manda nos comentários que Nox explica." + "NOX EXPLICA · MANDA SUA DÚVIDA", sem pedir curtida nem para seguir.
- [x] Sem fotos ou logos reais: quepe, carrinhos, loja, livro-caixa e etiqueta genéricos.

## Limitações
- **Sem voz:** este ambiente não tem `edge-tts` nem `faster-whisper`, e o proxy bloqueia speech.platform.bing.com e a instalação de pacotes (403). O vídeo foi renderizado com tempos estimados. Não existe `voz.txt`; a voz oficial em `nox-explica/CLAUDE.md` é en-US-AndrewMultilingualNeural (+0%, −2Hz). Para colocar a voz, rode na pasta do episódio:
  `python gerar_narracao.py && python montar_tempos.py && python make.py && python audio.py && ffmpeg -i nox_video.mp4 -i trilha.wav -c:v copy -c:a aac -b:a 192k -shortest NOX_EXPLICA_10.mp4`. Depois, regere o `.srt` a partir do `caps.json`.
- Vence rápido: o vídeo funciona melhor postado até sexta (27/11). A data aparece só na tela ("SEXTA, 27/11"); a fala diz "nessa sexta".
- A "Black Friday" de 1869 (crash do ouro) ficou fora do vídeo para caber no tempo.
- Não foi postado em nenhuma rede social.
