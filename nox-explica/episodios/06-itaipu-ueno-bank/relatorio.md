⚠️ TEMA DE POLÊMICA — REVISE ANTES DE POSTAR

# Relatório — NOX EXPLICA #06 (gerado automaticamente em 20/11/2026)

**Tema:** Itaipu (lado paraguaio) deixou cerca de R$ 1 bilhão num banco digital paraguaio de pouco mais de um ano (Ueno Bank); o Banco Central do Paraguai interveio no banco, o dinheiro ficou travado e o diretor-geral paraguaio da usina foi trocado em 18/11. "Não confundir": o lado brasileiro diz que nunca aplicou lá, e o diretor que saiu nega ter descumprido regras; o caso está em apuração.
**Tipo:** polêmica (mundo — Paraguai — com ligação direta com o Brasil, porque Itaipu é binacional).
**Vídeo:** `NOX_EXPLICA_06.mp4` — 1080x1920, 30 fps, **54,5 s, SEM VOZ** (trilha + legendas com tempos estimados). Prévia de 10 s: `NOX_EXPLICA_06_previa.mp4`. Legendas: `NOX_EXPLICA_06_legendas.srt`. Falas: `narracao.txt`. Roteiro com fontes: `roteiro.md`.

## Pontos sensíveis
- **Nenhum nome de pessoa** é citado (nem diretores, nem presidente, nem donos do banco). O vídeo fala de cargos ("o diretor paraguaio").
- O vídeo **não diz que alguém roubou, desviou ou é culpado**. Diz só o que é fato: aprovação em 12 dias, intervenção do Banco Central, dinheiro travado, diretor trocado. O ex-diretor não foi acusado formalmente (AFP); o vídeo dá a versão dele ("nega ter quebrado regra").
- A regra dos "cinco anos de mercado" vem de documentos divulgados pela imprensa (CNN Brasil e Gazeta afirmam; AFP e BPMoney usam "teria"). Por isso a fala diz "segundo a imprensa".
- "Pro lado paraguaio": formalmente a habilitação foi aprovada pela diretoria executiva binacional, mas o processo foi conduzido pela margem paraguaia e valia só para ela (nota da Itaipu à CNN). Escolhi "pro" (e não "pelo") lado paraguaio de propósito.
- Ficou de fora: a ligação do caso com a saída de Santiago Peña (impeachment/prisão), porque as fontes divergem e só 2 de 4 falam disso; o número de 3 milhões de clientes (uma fonte só); a fatia brasileira no caixa da usina (78,2%, só CNN).
- Deboche vai para a situação ("que merda de confiança é essa"), não para pessoas nem para o Paraguai. Sem bandeiras, logotipos ou fotos: só ícones (barragem, prédio de banco genérico, cadeado, cadeira, lupa).
- Assunto em andamento: antes de postar, confira se houve novidade (acusação formal, devolução do dinheiro, nova versão oficial).

## Voz — NÃO GERADA (limitação desta execução)
- A rede deste ambiente bloqueou `pypi.org` (403 no proxy; não deu para instalar `edge-tts` nem `faster-whisper`) e `speech.platform.bing.com` (sem conexão). Mesma limitação do #05.
- Vídeo renderizado com tempos estimados (2,6 palavras/s). `falas_tempos.json` não foi gerado.
- Voz a usar: a oficial de `nox-explica/CLAUDE.md` (`en-US-AndrewMultilingualNeural`, +0%, −2Hz). `nox-explica/voz.txt` não existe; o agendamento manda cair para `pt-BR-AntonioNeural` nesse caso, mas segui o CLAUDE.md do canal, que diz que a voz já foi escolhida (igual ao #04 e #05). Se quiser outra, crie `voz.txt`.
- Para finalizar com voz numa máquina com acesso, na pasta do episódio: `python gerar_narracao.py && python montar_tempos.py && python make.py && python audio.py && ffmpeg -y -i nox_video.mp4 -i trilha.wav -c:v copy -c:a aac -b:a 192k -shortest NOX_EXPLICA_06.mp4` (e refazer o .srt a partir de `caps.json`).

## Fontes (detalhes, valores e o que cada uma diz em `roteiro.md`)
- [CNN Brasil, 19/11/2026 — Itaipu aprovou Ueno Bank em apenas 12 dias](https://www.cnnbrasil.com.br/infra/itaipu-aprovou-ueno-bank-em-apenas-12-dias-e-sem-diretor-financeiro/)
- [Jornal de Brasília (AFP), 18/11/2026 — Presidente do Paraguai destitui diretor de Itaipu](https://jornaldebrasilia.com.br/noticias/mundo/presidente-do-paraguai-destitui-diretor-de-itaipu-apos-crise-bancaria/)
- [BPMoney, 18/11/2026 — Crise do Ueno Bank derruba diretor paraguaio](https://bpmoney.com.br/economia/internacional-economia/crise-ueno-bank-derruba-diretor-paraguaio-itaipu/)
- [Gazeta do Paraná, 20/11/2026 — Escândalo de US$ 182 mi derruba diretor](https://gazetadoparana.com.br/global/escandalo-de-us-182-milhoes-derruba-diretor-paraguaio-de-itaipu)
- Cobertura também em [TV Sim Brasil](https://tvsimbrasil.com.br/brasil/politica/noticia/2026/11/20/itaipu-troca-diretor-paraguaio-crise-ueno-bank) e outros portais (não usados como fonte).

| Fato no vídeo | Fontes |
|---|---|
| Quase R$ 1 bi / mais de US$ 160 mi (US$ 163,8 mi em dólares) | Jornal de Brasília, BPMoney, Gazeta, CNN |
| Banco digital de um ano e pouco (banco desde 1º/12/2023; ~13 meses na aprovação) | CNN, BPMoney, Jornal de Brasília, Gazeta |
| Aprovado em 12 dias, processo da margem paraguaia | CNN, Gazeta (+ nota da Itaipu) |
| Regra pedia 5 anos de mercado (segundo a imprensa) | CNN, Gazeta (afirmam); Jornal, BPMoney ("teria") |
| Intervenção do Banco Central do Paraguai | Jornal de Brasília, Gazeta, BPMoney |
| Diretor paraguaio trocado pelo presidente em 18/11 | Jornal de Brasília, BPMoney, Gazeta |
| Lado brasileiro diz que nunca aplicou lá | CNN, BPMoney |
| Diretor que saiu nega ter descumprido regra | Jornal de Brasília, Gazeta |
| Caso em apuração | Jornal de Brasília (Justiça investiga), Gazeta (denúncia criminal, apuração), BPMoney (ações judiciais) |

## Checklist (`checklist_revisao.md`)
- [~] Duração: 54,5 s (estimada, sem voz) — dentro do pedido do agendamento (40–55 s) e abaixo do máximo de 60 s, mas acima do ideal de 35–50 s do canal. Com a voz real, conferir; se passar de 55 s, cortar "segundo a imprensa" não é recomendado (proteção jurídica) — prefira cortar "a usina do Brasil com o Paraguai".
- [x] Mesmo Nox (`nox.py` idêntico ao do #01/#05), sem boca/nariz; poses none/point/raise/cross; círculo dourado só na abertura e no fim.
- [x] Autorreferência em terceira pessoa ("Nox quer saber", "que Nox explica"); nenhum "eu/vou".
- [x] Legendas = `narracao.txt`, mesma ordem, nenhuma fala a mais ou a menos (conferido por script, palavra por palavra).
- [x] Números conferidos e ligados aos conceitos certos: R$ 1 bi (total), US$ 160 mi+ (parte em dólares), 12 dias (aprovação), 5 anos (exigência), ~1 ano (idade do banco), 18/11 (troca do diretor).
- [x] Diagramas diferenciam os conceitos: lado BR × lado PY na barragem; exigência de 5 anos × banco de ~1 ano; quem diz o quê (lado brasileiro × diretor que saiu); "em apuração" ≠ culpa.
- [~] Legendas: até 2 linhas, embaixo, sem cobrir olhos/diagramas — OK. Sincronia com voz: não aplicável (sem voz; tempos estimados).
- [x] Texto de destaque (topo) e legenda (baixo) nunca no mesmo espaço.
- [~] Música discreta, efeitos (whoosh/sino) só nas trocas de cena. Sem voz, não há ducking a conferir.
- [x] Palavrões: porra, caralho, merda (3), todos sobre a situação.
- [x] Termina com "Tem outra treta que você quer entender? Manda nos comentários que Nox explica." + "NOX EXPLICA · MANDA SUA DÚVIDA", sem pedir curtida/seguir.
- [x] Sem fotos, vídeos, bandeiras ou logotipos reais.

## Como escolhi o tema
Buscas dos últimos 3 dias (Brasil e mundo). O caso Itaipu/Ueno Bank teve a cobertura mais sólida e confirmável (CNN Brasil, AFP, vários portais), sem mortos, sem menores, sem pessoas anônimas, e com gancho brasileiro (a usina é metade nossa). Descartei fofoca de celebridades (Neymar/Virginia), porque era boato negado pelos envolvidos, e o boato do apagão, que já foi o #05.
