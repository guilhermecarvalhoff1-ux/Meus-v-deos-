# Regras do projeto — vídeos narrados para TikTok

Este repositório produz séries animadas narradas (Áurea, Lethe, O Último Homem) no formato vertical do TikTok.
Leia este arquivo antes de começar qualquer vídeo e siga estas regras sem precisar que o usuário peça de novo.

## Formato
- Vertical 1080x1920, 30 fps, MP4.
- Narração em português do Brasil. Roteiro final sempre salvo em `.txt` antes de gerar a voz.
- Gancho na primeira frase, um fato real verificável no meio (pesquisado e confirmado), reviravolta perto do fim, final com opções A/B para os comentários.

## Legendas
- 2 a 4 palavras por vez, sincronizadas palavra por palavra com a narração (timestamps por palavra).
- Fonte condensada em negrito (Roboto Condensed 900, Bebas Neue ou Anton), branca com contorno preto, palavra-chave em amarelo (#FFC424).
- Centralizadas, um pouco abaixo do meio da tela, longe da interface do TikTok.

## Visual
- Estilo cartoon com luz cinematográfica: sombreamento suave, profundidade de campo, névoa no horizonte, grama/objetos em primeiro plano desfocados.
- No projeto Remotion do Áurea, `public/upgrade.js` e o filtro `post` do `engine.js` aplicam esse acabamento a todas as cenas. Não remova.
- Números da história aparecem na tela como objetos ou painéis (preço, nível, peso, velocidade).

## Direção de câmera — decida sozinho, cena por cena
Para cada cena, escolha o ângulo que melhor conta aquele momento, sem esperar instrução do usuário. Varie: nunca use o mesmo enquadramento em mais de duas cenas seguidas. Quando a cena for em 3D (skill `blender`), posicione a câmera de verdade; em 2D, simule com escala, perspectiva e camadas de parallax.

| Momento da narração | Ângulo a usar |
|---|---|
| Algo grande, perigoso ou poderoso (monstro, prédio, guilda, vilão) | Câmera baixa olhando para cima (contra-plongée), linhas convergindo |
| Mostrar altura, distância ou o tamanho do lugar | Vista de cima (plongée / zenital) |
| Objeto em movimento (queda, voo, item sendo puxado) | Câmera acompanhando o objeto, com velocidade ou valor subindo na tela |
| Detalhe que muda tudo (parafuso, mão, celular, mensagem) | Close extremo, fundo bem desfocado |
| Tensão, perigo, mensagem ameaçadora | Câmera inclinada (Dutch angle) |
| Personagem sem saber do perigo | Plano médio com o personagem vindo na direção da câmera |
| Revelação (algo atrás do personagem) | Câmera sobre o ombro girando devagar até revelar |
| Explicar um fato ou número | Cenário limpo tipo laboratório/infográfico, número como objeto 3D, comparações de escala (×15, ×170, régua, balança) |
| Emoção do personagem | Close no rosto com leve zoom-in |

## Voz das histórias (Áurea, Lethe, O Último Homem)
- **Voz oficial (escolhida pelo usuário, não perguntar de novo):** edge-tts `pt-BR-AntonioNeural`, rate `+15%`, pitch `+0Hz` (sem alterar o tom: com pitch grave a voz soa com efeito).
- Para a leitura ficar fluida, no texto enviado à voz junte frases muito curtas com vírgulas (ex.: "Classe: Ladrão, nível doze, nenhuma arma decente."); as legendas continuam com o roteiro original.
- Gerar com `aurea-remotion/scripts/edge_narr.py` (salva o MP3 e o tempo de cada palavra) e sincronizar com `aurea-remotion/scripts/narracao.py <audio> --words <palavras.json>` (abre a pausa da luta e ajusta a duração).
- Se a rede bloquear, liberar `speech.platform.bing.com` no ambiente; se vier "No audio was received", tentar de novo.
- Os vídeos do canal Nox Explica usam outra voz (ver `nox-explica/CLAUDE.md`).

## Ritmo de edição
- Corte a cada 2–3 segundos. No clímax, cortes rápidos de ~0,5 s.
- Toda cena tem algum movimento de câmera (zoom lento, pan, órbita ou parallax). Nada parado.
- Efeitos sonoros só nos impactos. Música de fundo baixa, abaixando quando a voz fala.
- No fim do episódio, a tela de A/B ("COMENTA AÍ"). Se já existir o próximo episódio, coloque um gancho curto dele.

## Fluxo de trabalho
1. Antes do vídeo inteiro, renderize uma prévia de ~10 s e mostre ao usuário.
2. Salve os MP4 finais na raiz do repositório e faça commit.
3. Se a janela de contexto estiver enchendo, registre o progresso em arquivo antes de continuar.
