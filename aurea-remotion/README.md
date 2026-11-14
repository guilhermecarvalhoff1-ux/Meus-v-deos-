# Áurea — projeto Remotion

Cada episódio é uma composição (`AureaEp1`, ...) registrada em `src/Root.tsx`.

## Estrutura
- `public/lib.js` — personagens, cenários e efeitos (SVG)
- `public/engine.js` — câmera, troca de cenas e legendas sincronizadas
- `public/epN/scenes.js` — cenas do episódio (cada cena começa na palavra `k` da narração)
- `public/epN/words.json` — tempo de cada palavra da narração
- `public/epN/narracao.mp3` — narração

## Comandos
- `npm run dev` — abre o Remotion Studio (preview)
- `npx remotion render AureaEp1 out/aurea_ep1.mp4` — exporta o vídeo
- `npx remotion still AureaEp1 out/quadro.jpg --frame=300` — exporta um quadro

## Novo episódio
1. Crie `public/ep2/` com `scenes.js`, `words.json` e `narracao.mp3`.
2. Adicione `{ id: "AureaEp2", ep: "ep2", seconds: <duração> }` em `EPISODES` (src/Root.tsx).
3. No Studio, recarregue a página ao trocar de episódio.
