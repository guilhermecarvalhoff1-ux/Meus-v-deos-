# Relatório — NOX EXPLICA #04 (gerado automaticamente em 16/11/2026)

**Tema:** a Universidade de Oxford é mais velha que o Império Asteca (e a pegadinha: asteca ≠ maia; e Oxford nem é a mais velha, Bolonha é de 1088).
**Tipo:** curiosidade (história antiga). Não é polêmica.
**Vídeo:** `NOX_EXPLICA_04.mp4` — 1080x1920, 30 fps, 52,3 s. Prévia de 10 s: `NOX_EXPLICA_04_previa.mp4`. Legendas: `NOX_EXPLICA_04_legendas.srt`.

## ⚠️ Limitação principal: o vídeo está SEM VOZ
- Esta execução rodou na nuvem com rede restrita: `speech.platform.bing.com` (edge-tts) e `pypi.org` (instalar `edge-tts`/`faster-whisper`) foram bloqueados pelo proxy (403).
- Por isso o vídeo foi renderizado com **tempos estimados** (3,0 palavras/s) e só tem trilha instrumental + efeitos. As legendas e cenas seguem o texto, mas não estão sincronizadas com uma voz real.
- **Para finalizar** (numa máquina com internet), dentro de `episodios/04-oxford-astecas/`:
  1. `pip install edge-tts` → `python gerar_narracao.py` (gera `narracao.wav` + `palavras_tempos.json` com a voz oficial do Nox)
  2. `python montar_tempos.py` (gera `falas_tempos.json`; deve mostrar 0 diferenças)
  3. `python make.py && python audio.py`
  4. `ffmpeg -i nox_video.mp4 -i trilha.wav -c:v copy -c:a aac -b:a 192k -shortest NOX_EXPLICA_04.mp4` e regerar o .srt a partir de `caps.json`.
- **Voz:** não existe `voz.txt`. O pedido da tarefa dizia usar `pt-BR-AntonioNeural` nesse caso, mas o `nox-explica/CLAUDE.md` define a voz oficial do Nox como `en-US-AndrewMultilingualNeural` (pitch −2Hz, sem acelerar), escolhida pelo dono. O `gerar_narracao.py` desta pasta usa a voz oficial. Se preferir a Antonio, troque `VOICE` no script (ou crie `voz.txt`).

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
- [~] Duração: 52,3 s **estimados** (acima do ideal de 50 s do CLAUDE.md, dentro dos 40–55 s do pedido e do máximo de 60 s). Com a voz real pode variar; se passar de 55 s, dá para cortar "Sério." e "com os espanhóis".
- [x] Mesmo Nox (sprite `nox.py` sem alteração), sem boca/nariz, poses none/point/raise/cross; círculo dourado só na abertura e no fim.
- [x] Autorreferência em terceira pessoa ("Nox acha", "que Nox explica"); nenhum "eu/vou".
- [x] Legendas = roteiro (`narracao.txt`), mesma ordem, sem fala a mais ou a menos.
- [x] Números conferidos em 2+ fontes e ligados aos conceitos certos (fundação da capital 1325 ≠ início do império 1428; "ensino em 1096", não "fundada em 1096").
- [x] Diagramas diferenciam os conceitos: linha 1096 → 1325; barras Oxford (1096 → hoje) × Império (1428–1521, 93 anos); cartões ASTECA (pirâmide larga, templo duplo) ≠ MAIA (pirâmide íngreme, auge 250–900 d.C.); selo BOLONHA 1088.
- [~] Legendas: até 2 linhas, embaixo, sem cobrir olhos/diagramas, destaque no topo — OK. **Sincronia palavra a palavra: pendente** (sem voz, tempos estimados).
- [x] Texto de destaque (topo) e legenda (baixo) nunca no mesmo espaço.
- [~] Música discreta e efeitos só nas trocas de cena — OK; sem voz, não há abaixamento sob a fala ainda (o `audio.py` já faz isso quando `narracao.wav` existir).
- [x] Palavrões: porra, caralho, merda (3), todos sobre a situação.
- [x] Termina com "Achou mais alguma merda sem sentido por aí? Manda nos comentários que Nox explica." + "NOX EXPLICA · MANDA SUA DÚVIDA", sem pedir curtida/seguir.
- [x] Sem fotos, vídeos ou logotipos reais (só ícones desenhados).
