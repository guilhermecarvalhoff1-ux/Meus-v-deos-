# Canal NOX EXPLICA — regras do projeto

Vídeos curtos de curiosidades com o apresentador fixo **Nox**. Leia este arquivo e `nox_personagem.md` antes de qualquer vídeo.

## Formato
- Vertical 1080x1920, 30 fps, MP4. Entre 35 e 50 s; nunca passar de 60 s.
- Começa direto no gancho. Sem vinheta, créditos ou tela preta final.
- Fecha com o Nox convidando o público a mandar dúvidas, em terceira pessoa (ex.: "Achou mais alguma merda sem sentido por aí? Manda nos comentários que Nox explica."), com "NOX EXPLICA · MANDA SUA DÚVIDA" na tela. Sem pedir curtida ou para seguir. Termina logo após essa fala.

## Roteiro
- Siga o briefing do vídeo à risca: não altere falas, não acrescente fatos.
- Antes de animar, confira cada número em fonte confiável e diga ao usuário se algo do briefing estiver errado.
- Nox fala de si sempre na terceira pessoa ("Nox achou estranho"). Nunca "eu", "vou", "vem comigo".
- Tom largado, debochado e informal, como quem conta uma descoberta absurda pra um amigo ("cara", "tá", "pra", "uns"). Preciso na informação.
- Palavrões pontuais e naturais (3 a 4 por vídeo: porra, caralho, merda), sempre sobre a situação, nunca contra o público, pessoas ou grupos. Sem censura de bip.

## Visual
- Fundo escuro roxo/azul com detalhes dourados. Círculo dourado atrás do Nox só na abertura e no encerramento.
- Diagramas simples e limpos ao lado do Nox; podem estar fora de escala, mas os conceitos têm que estar certos.
- Nox nunca muda de aparência (ver `nox_personagem.md`). Se animar for deformá-lo, use pose parada com movimento de câmera.
- Toda cena tem algum movimento suave (aproximação, pan, elemento animado). Cortes acompanham a troca de assunto.

## Texto na tela
- Texto de destaque no topo da tela; legenda embaixo, longe da interface do TikTok. Nunca no mesmo espaço.
- Legenda: fonte simples e grossa, branca, números e palavras-chave em dourado (#FFC428), no máximo 2 linhas.
- Não cobrir os olhos do Nox nem os diagramas.

## Áudio
- **Voz oficial do Nox (escolhida pelo usuário, não perguntar de novo):** edge-tts `en-US-AndrewMultilingualNeural`, rate `+0%` (nunca acelerar), pitch `-2Hz`. Pausa de 0,5 s em cada "..." e 0,25 s entre parágrafos. Gerar com `python gerar_narracao.py` (salva `narracao.wav` 44,1 kHz e `palavras_tempos.json`) e montar as legendas com `python montar_tempos.py`. Se a rede bloquear, liberar `speech.platform.bing.com`; se vier "No audio was received", tentar de novo.
- Narração sempre em primeiro plano; legendas sincronizadas palavra por palavra (transcreva o áudio com timestamps).
- Música instrumental discreta, sem letra, sem clima de terror; abaixa quando a voz fala.
- Efeito sonoro só em troca de cena ou número, nunca em cima de palavra importante.

## Entrega
1. Prévia de ~10 s para aprovação.
2. Vídeo final + arquivo .srt + texto da narração.
3. Rodar o checklist de `checklist_revisao.md` e dizer o resultado de cada item.
