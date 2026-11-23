"""Semana 5 — Revisão final (Dias 29 e 30). uso: python3 sem5.py [29 30]"""
import sys
from motor import *

PARE_ = P(placa_pare); PREF = P(placa_preferencia); PROIB_ESQ = P(placa_proib_esquerda); SIGA = P(placa_siga_frente)
def V(n): return P(placa_velocidade, str(n))
E_TARJA = P(placa_letra, 'E', 'tarja'); E_X = P(placa_letra, 'E', 'x')

D29 = [
 C('Olá! Dia 29: revisão relâmpago de sinalização e velocidades. Rápido e direto, para fixar de vez.',
   'DIA 29', [PARE_, adv('curva'), V(60)], 'REVISÃO RELÂMPAGO'),
 C('Placas. Redonda com borda vermelha: ordem. Com faixa vermelha: proibido. Sem faixa: obrigação ou limite. Pare: oito lados, para sempre. Triângulo de cabeça para baixo: dê a preferência.',
   'PLACAS DE ORDEM', [PROIB_ESQ, SIGA, PREF], None, ['PROIBIDO', 'OBRIGAÇÃO', 'PREFERÊNCIA']),
 C('Losango amarelo: aviso de perigo, reduza. Laranja: obras. Retângulo verde: estrada. Azul: cidade e serviços. Marrom: turismo.',
   'AVISO E INFORMAÇÃO', [adv('curva'), ind(['SANTOS']), ind(['PARQUE'], MARROM)], None, ['AVISO', 'ESTRADA', 'TURISMO']),
 C('Semáforo: vermelho para, amarelo para se puder, verde segue com cuidado. Quem manda mais: agente, semáforo, placa.',
   'SEMÁFORO E AGENTE', [agente('cima'), semaforo('amarelo')], 'AGENTE MANDA MAIS'),
 C('No chão: amarela, sentidos opostos. Branca, mesmo sentido. Contínua, não passa. Tracejada, pode passar com segurança.',
   'NO CHÃO', [pista('continua'), pista('tracejada', CREME)], 'CONTÍNUA = NÃO PASSA'),
 C('Velocidades: cidade, oitenta, sessenta, quarenta, trinta. Rodovia, carro e moto: cento e dez na pista dupla, cem na simples. Terra, sessenta. Mínima, metade. Agora, cinco perguntas.',
   'VELOCIDADES', [cartao('80·60·40·30'), cartao('110 · 100 · 60')], 'MÍNIMA = METADE', pausa=1.0),
 Q(1, 'Pergunta um. Placa redonda, com seta para a direita e sem faixa. O que é?', [P(placa_vire_dir)], 'Resposta: obrigação. Vire à direita.', 'VIRE À DIREITA'),
 Q(2, 'Pergunta dois. Que cor tem a placa de obras?', [adv('obras', LARANJA)], 'Resposta: laranja.', 'LARANJA'),
 Q(3, 'Pergunta três. Linha tracejada branca. Pode mudar de faixa?', [pista('tracejada', CREME)], 'Resposta: sim, com segurança e dando seta.', 'SIM, COM SEGURANÇA'),
 Q(4, 'Pergunta quatro. Limite de uma via de trânsito rápido, sem placa?', [cartao('?')], 'Resposta: oitenta quilômetros por hora.', '80 KM/H'),
 Q(5, 'Pergunta cinco. Carro em rodovia de pista simples. Qual o limite?', [cartao('?')], 'Resposta: cem. Até amanhã, no último dia!', '100 KM/H'),
]

D30 = [
 C('Olá! Dia 30, o último dia! Revisão relâmpago de infrações e primeiros socorros. Depois, cinco perguntas finais.',
   'DIA 30', [cartao('ÚLTIMO DIA', VERDE)], 'RETA FINAL'),
 C('Infrações. Leve, três pontos. Média, quatro. Grave, cinco. Gravíssima, sete. Suspensão: vinte, trinta ou quarenta pontos em doze meses, conforme as gravíssimas.',
   'PONTOS', [cartao('3', VERDE), cartao('4', AMARELO), cartao('5', LARANJA), cartao('7', VERM)], '20 · 30 · 40'),
 C('Exemplos que caem muito. Sinal vermelho e celular na mão: gravíssima. Sem cinto e fila dupla: grave. Até vinte por cento acima do limite: média.',
   'EXEMPLOS', [semaforo('vermelho'), ic_celular, ic_cinto], None, ['GRAVÍSSIMA', 'GRAVÍSSIMA', 'GRAVE']),
 C('Lei Seca: tolerância zero, multa vezes dez, doze meses de suspensão. Recusar o bafômetro: mesma punição. E na carteira provisória: nenhuma grave ou gravíssima.',
   'LEI SECA E PROVISÓRIA', [x_vermelho(ic_copo), ic_carteira], 'ZERO ÁLCOOL'),
 C('Primeiros socorros. Proteja e sinalize: um passo por quilômetro por hora. Ligue cento e noventa e dois. Não mexa na vítima, não dê água, e não tire o capacete do motociclista.',
   'PRIMEIROS SOCORROS', [ic_triangulo, ic_fone('192'), ic_moto], 'PROTEJA · LIGUE · ESPERE'),
 C('Agora, as cinco perguntas finais. Cinco segundos para cada.', 'PERGUNTAS FINAIS', [cartao('5 PERGUNTAS')], pausa=.6),
 Q(1, 'Pergunta um. Celular na mão dirigindo. Que infração é?', [ic_celular], 'Resposta: gravíssima, sete pontos.', 'GRAVÍSSIMA'),
 Q(2, 'Pergunta dois. Passar até vinte por cento acima do limite é que infração?', [V(60)], 'Resposta: média, quatro pontos.', 'MÉDIA'),
 Q(3, 'Pergunta três. Qual a multa da Lei Seca?', [ic_copo], 'Resposta: dois mil, novecentos e trinta e quatro reais e setenta centavos. Multa vezes dez.', 'R$ 2.934,70'),
 Q(4, 'Pergunta quatro. Via de cem quilômetros por hora. A quantos passos você sinaliza o acidente?', [V(100)], 'Resposta: cem passos longos.', '100 PASSOS'),
 Q(5, 'Pergunta cinco. Qual o número do SAMU?', [ic_fone('?')],
   'Resposta: cento e noventa e dois. Parabéns! Você terminou os trinta dias. Revise os vídeos que achar mais difíceis, durma bem antes da prova, e boa sorte! Você consegue!', '192'),
]

DIAS = {29: ('revisao-sinalizacao-velocidades', D29), 30: ('revisao-infracoes-socorros', D30)}

if __name__ == '__main__':
    for n in (map(int, sys.argv[1:]) if len(sys.argv) > 1 else DIAS):
        gerar(n, *DIAS[n])
