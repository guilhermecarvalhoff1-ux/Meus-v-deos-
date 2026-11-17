# O Corsa do Avô — Ep1 "O Posto": vozes que faltam

O vídeo está pronto **sem vozes** (`corsa_do_avo_ep1_sem_voz.mp4`, 90 s), só com efeitos e música.
Mande um áudio por fala (MP3, WAV ou M4A), com o nome abaixo. Cada um entra no tempo do plano:

| Arquivo | Quem | Fala | Entra em |
|---|---|---|---|
| `01_narr.mp3` | Narrador | "Primeiro dia com o Corsa. E primeira missão: abastecer." | 0,3 s (plano 1) |
| `02_avo.mp3` | Avô | "Esse carro vai ser teu um dia." | 24,4 s (plano 8) |
| `03_frentista.mp3` | Frentista | "Completa… ou só vinte reais pra ele chegar em casa?" | 27,5 s (plano 9) |
| `04_cara1.mp3` | Cara 1 | "Ô, esse aí veio com o vô junto ou só o cheiro?" | 31,4 s (plano 10) |
| `05_cara2.mp3` | Cara 2 | "Até o carro tá com vergonha, mano!" | 36,4 s (plano 11) |
| `06_cara3.mp3` | Cara 3 | "Esse pneu é mais careca que o meu tio." | 39,7 s (plano 12) |
| `07_narr.mp3` | Narrador | "Ele podia ter ido embora rindo junto. Mas ele lembrou do avô." | 52,3 s (plano 15) |
| `08_avo.mp3` | Avô | "Segura firme, que ele é teu." | 63,6 s (plano 17) |
| `09_narr.mp3` | Narrador | "Nesse mesmo posto, o Corsa já foi o carro mais bonito da rua." | 67,6 s (plano 18) |
| `10_narr.mp3` | Narrador | "A: vende essa lata e pega um carro que ninguém zoa. Ou B: fica com o Corsa e faz todo mundo nesse posto engolir a risada. Comenta aí." | 83,3 s (plano 21) |

Opcional: `risada.mp3` (galera rindo) para os planos 10, 11 e 13 — hoje não há risada no vídeo.

## Como juntar depois
1. Montar `vozes.wav` com cada fala no seu tempo (e tirar os tempos de cada palavra para as legendas).
2. `python3 aurea-remotion/scripts/posto_mix.py aurea-remotion/sfx out/posto_trilha.wav vozes.wav` (a música abaixa sob a fala).
3. Renderizar `CorsaAvoEp1` com as legendas e juntar o áudio.

Arquivos do episódio: `aurea-remotion/public/posto/scenes.js` (cenas por tempo, plano a plano),
`scripts/posto_sfx.py` (efeitos sintetizados), `scripts/posto_mix.py` (trilha).
