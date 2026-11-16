# Relatório — NOX EXPLICA #04 (gerado automaticamente em 16/11/2026)

**Tema:** a Universidade de Oxford é mais velha que o Império Asteca (e a pegadinha: asteca ≠ maia; e Oxford nem é a mais velha, Bolonha é de 1088).
**Tipo:** curiosidade (história antiga). Não é polêmica.
**Vídeo:** `NOX_EXPLICA_04.mp4` — 1080x1920, 30 fps, 58,4 s (com voz). Prévia de 10 s: `NOX_EXPLICA_04_previa.mp4`. Legendas: `NOX_EXPLICA_04_legendas.srt`.

## Voz (finalizado em 16/11/2026)
- Narração gerada com a voz oficial do Nox: edge-tts `en-US-AndrewMultilingualNeural`, rate +0%, pitch −2Hz (`gerar_narracao.py` → `narracao.wav`, 6 trechos, 124 palavras, 58,0 s de fala).
- `montar_tempos.py`: 43 legendas, 127 de 127 palavras usadas, **0 diferenças**.
- `make.py` + `audio.py` refeitos com os tempos reais; `.srt` regerado de `caps.json`; prévia de 10 s refeita.
- O servidor da voz falhou várias vezes com "No audio was received"; o script agora tenta até 15 vezes.

## Por que não foi polêmica
Busquei assuntos/polêmicas dos últimos 3 dias (Brasil e mundo). A busca disponível voltou resultados ralos e genéricos (agregadores, resumos de manchetes), sem nenhum caso que eu conseguisse confirmar em dois veículos confiáveis e que passasse nas regras (sem vítimas recentes, sem menores, sem pessoas anônimas etc.). Pela regra 2b, fui para curiosidade.

## Fontes
- Oxford — ensino "de alguma forma em 1096", crescimento a partir de 1167: [Universidade de Oxford](https://www.ox.ac.uk/about/organisation/history); [Smithsonian Magazine](https://www.smithsonianmag.com/smart-news/oxford-university-is-older-than-the-aztecs-1529607/)
- Tenochtitlan fundada em 1325: [Britannica](https://www.britannica.com/place/Tenochtitlan); [Live Science](https://www.livescience.com/34660-tenochtitlan.html)
- Tríplice Aliança (império) em 1428, queda em 1521: [Cidade do México — Triple Alliance](https://mexicocity.cdmx.gob.mx/historical-timeline-of-mexico-city/triple-alliance/); [World History Encyclopedia](https://www.worldhistory.org/trans/pt/2-916/cortes-e-a-queda-do-imperio-asteca/)
- Maias muito mais antigos (clássico c. 250–900 d.C.): [Smarthistory](https://smarthistory.org/maya-intro); [WorldAtlas](https://www.worldatlas.com/history/discover-the-differences-between-the-mayans-and-aztecs.html)
- Bolonha, 1088, mais antiga em funcionamento contínuo: [Bologna Welcome](https://www.bolognawelcome.com/es/blog/los-lugares-de-la-universidad-mas-antigua-de-europa); [History of Information](https://historyofinformation.com/detail.php?id=2659)
- Contas: 1325 − 1096 = 229 anos ("mais de dois séculos"); 1521 − 1428 = 93 anos ("menos de cem").

## Checklist (`checklist_revisao.md`)
- [x] Duração: 58,4 s com a voz real — dentro do máximo de 60 s, mas acima do ideal de 35–50 s. Se quiser encurtar, dá para cortar "Sério." e "com os espanhóis" (precisa da sua aprovação, porque muda as falas).
- [x] Mesmo Nox (sprite `nox.py` sem alteração), sem boca/nariz, poses none/point/raise/cross; círculo dourado só na abertura e no fim.
- [x] Autorreferência em terceira pessoa ("Nox acha", "que Nox explica"); nenhum "eu/vou".
- [x] Legendas = roteiro (`narracao.txt`), mesma ordem, sem fala a mais ou a menos.
- [x] Números conferidos em 2+ fontes e ligados aos conceitos certos (fundação da capital 1325 ≠ início do império 1428; "ensino em 1096", não "fundada em 1096").
- [x] Diagramas diferenciam os conceitos: linha 1096 → 1325; barras Oxford (1096 → hoje) × Império (1428–1521, 93 anos); cartões ASTECA (pirâmide larga, templo duplo) ≠ MAIA (pirâmide íngreme, auge 250–900 d.C.); selo BOLONHA 1088.
- [x] Legendas: até 2 linhas, embaixo, sem cobrir olhos/diagramas, destaque no topo — OK. Sincronia palavra a palavra com a voz real — OK (0 diferenças).
- [x] Texto de destaque (topo) e legenda (baixo) nunca no mesmo espaço.
- [x] Música discreta, abaixando sob a voz; efeitos só nas trocas de cena — OK.
- [x] Palavrões: porra, caralho, merda (3), todos sobre a situação.
- [x] Termina com "Achou mais alguma merda sem sentido por aí? Manda nos comentários que Nox explica." + "NOX EXPLICA · MANDA SUA DÚVIDA", sem pedir curtida/seguir.
- [x] Sem fotos, vídeos ou logotipos reais (só ícones desenhados).
