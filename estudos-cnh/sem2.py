"""Semana 2 — Regras de circulação e infrações (Dias 8 a 13). uso: python3 sem2.py [8 9 ...]"""
import sys
from motor import *

PARE_ = P(placa_pare); PREF = P(placa_preferencia)
def V(n): return P(placa_velocidade, str(n))
def carro_parado(d, cx, cy, r, k=0): carro(d, cx, cy + r * .2, r * .006)
E_TARJA = P(placa_letra, 'E', 'tarja'); E_X = P(placa_letra, 'E', 'x')

D8 = [
 C('Olá! Dia 8: limites de velocidade. Quando não tem placa, a lei já diz qual é o limite. E isso cai muito na prova. Vamos devagar, um número de cada vez.',
   'DIA 8', [V(80), V(60), V(40), V(30)], 'SEM PLACA? VALE A LEI'),
 C('Na cidade, são quatro tipos de rua. Via de trânsito rápido, como uma marginal sem semáforo: oitenta. Via arterial, uma avenida grande com semáforo: sessenta.',
   'NA CIDADE (1)', [V(80), V(60)], None, ['TRÂNSITO RÁPIDO', 'ARTERIAL']),
 C('Via coletora, a rua que leva o trânsito do bairro até a avenida: quarenta. E via local, a rua tranquila do bairro, sem semáforo: trinta.',
   'NA CIDADE (2)', [V(40), V(30)], None, ['COLETORA', 'LOCAL']),
 C('Um jeito de decorar: oitenta, sessenta, quarenta, trinta. Quanto mais calma e cheia de casas a rua, mais baixo o limite.',
   'DECORE ASSIM', [cartao('80'), cartao('60'), cartao('40'), cartao('30')], '80 · 60 · 40 · 30'),
 C('Na rodovia de pista dupla, com canteiro no meio: carro e moto, cento e dez. Os outros veículos, como caminhão e ônibus: noventa.',
   'RODOVIA PISTA DUPLA', [V(110), V(90)], None, ['CARRO E MOTO', 'CAMINHÃO E ÔNIBUS']),
 C('Na rodovia de pista simples, uma pista para ir e outra para vir: carro e moto, cem. Os outros: noventa. E na estrada de terra, sem asfalto: sessenta.',
   'PISTA SIMPLES E TERRA', [V(100), V(90), V(60)], None, ['CARRO E MOTO', 'OUTROS', 'TERRA']),
 C('Também existe velocidade mínima: a metade da máxima. Numa via de oitenta, a mínima é quarenta. Andar devagar demais atrapalha e também é infração.',
   'VELOCIDADE MÍNIMA', [V(80), cartao('40', VERDE, 'MÍNIMA')], 'MÍNIMA = METADE'),
 C('Resumindo. Cidade: oitenta, sessenta, quarenta, trinta. Pista dupla: cento e dez. Pista simples: cem. Terra: sessenta. Mínima: metade. Agora, três perguntas.',
   'RESUMO DO DIA 8', [cartao('80·60·40·30'), cartao('110 · 100')], 'MÍNIMA = METADE', pausa=1.0),
 Q(1, 'Pergunta um. Você está de carro numa rua tranquila de bairro, sem placa. Qual é o limite?', [cartao('?')],
   'Resposta: trinta quilômetros por hora. É uma via local.', '30 KM/H'),
 Q(2, 'Pergunta dois. De carro, numa rodovia de pista dupla, sem placa. Qual é o limite?', [cartao('?')],
   'Resposta: cento e dez quilômetros por hora.', '110 KM/H'),
 Q(3, 'Pergunta três. A máxima da via é sessenta. Qual é a velocidade mínima?', [V(60)],
   'Resposta: trinta. A mínima é sempre a metade da máxima. Até o Dia 9!', '30: A METADE'),
]

D9 = [
 C('Olá! Dia 9: ultrapassagem e preferência. Hoje a gente vai ver como passar outro carro com segurança, e quem tem a vez em cada situação.',
   'DIA 9', [ic_ultrapassa, ic_rotatoria], 'QUEM PASSA, QUEM ESPERA'),
 C('A ultrapassagem é sempre pela esquerda. Antes, olhe os espelhos, ligue a seta, e veja se tem espaço livre lá na frente. Depois de passar, ligue a seta para a direita e volte para a sua faixa com distância.',
   'ULTRAPASSAR', [ic_ultrapassa], 'SEMPRE PELA ESQUERDA'),
 C('Onde é proibido ultrapassar? Em curvas e subidas sem visibilidade, em pontes, em cruzamentos, perto da faixa de pedestres, e onde a linha do meio é contínua.',
   'ONDE NÃO PODE', [adv('curva'), pista('continua'), faixa_pedestre], 'SEM VISÃO? NÃO PASSE', ['CURVA', 'LINHA CONTÍNUA', 'FAIXA']),
 C('E quem está sendo ultrapassado? Fica na sua faixa, mais para a direita, e não acelera. Acelerar para não deixar passar é perigoso e é infração.',
   'SENDO ULTRAPASSADO', [ic_ultrapassa], 'NÃO ACELERE'),
 C('Agora, preferência. Num cruzamento sem placa e sem semáforo, quem vem pela sua direita tem a vez. Olhe para a direita e espere.',
   'CRUZAMENTO SEM SINAL', [ic_cruzamento], 'QUEM VEM DA DIREITA'),
 C('Na rotatória, quem já está girando nela tem a vez. Quem quer entrar, espera. E na rodovia, quem já está nela tem a vez sobre quem está entrando.',
   'ROTATÓRIA', [ic_rotatoria], 'QUEM JÁ ESTÁ GIRANDO'),
 C('Ambulância, bombeiros e polícia com sirene e luz ligadas têm a vez sempre. Vá para a direita e deixe passar. E o pedestre na faixa também tem a vez.',
   'EMERGÊNCIA', [ic_ambulancia, faixa_pedestre], 'ABRA CAMINHO'),
 C('Resumindo. Ultrapasse pela esquerda, com seta e espaço. Sem sinal: a vez é de quem vem pela direita. Rotatória: de quem já está nela. Sirene: abra caminho. Agora, três perguntas.',
   'RESUMO DO DIA 9', [ic_ultrapassa, ic_cruzamento, ic_rotatoria], 'ESQUERDA · DIREITA · RODA', pausa=1.0),
 Q(1, 'Pergunta um. Por qual lado se faz a ultrapassagem?', [ic_ultrapassa], 'Resposta: pela esquerda.', 'PELA ESQUERDA'),
 Q(2, 'Pergunta dois. Cruzamento sem placa e sem semáforo. Um carro vem pela sua direita. Quem passa primeiro?', [ic_cruzamento],
   'Resposta: o carro que vem pela direita.', 'QUEM VEM DA DIREITA'),
 Q(3, 'Pergunta três. Você quer entrar na rotatória e um carro já está girando nela. Quem tem a vez?', [ic_rotatoria],
   'Resposta: quem já está na rotatória. Você espera. Até o Dia 10!', 'QUEM JÁ ESTÁ NELA'),
]

D10 = [
 C('Olá! Dia 10: infrações leves e médias. Toda infração tem um peso. Hoje são as duas mais fracas. Amanhã, as mais pesadas.',
   'DIA 10', [cartao('LEVE'), cartao('MÉDIA')], 'O PESO DA INFRAÇÃO'),
 C('Infração leve: três pontos na carteira, e multa de oitenta e oito reais e trinta e oito centavos.',
   'LEVE', [cartao('3 PTS', VERDE), cartao('R$ 88,38', VERDE)], 'LEVE = 3 PONTOS'),
 C('Exemplos de leve: estacionar longe do meio-fio, entre cinquenta centímetros e um metro. Buzinar à toa, ou de noite, entre dez da noite e seis da manhã.',
   'EXEMPLOS DE LEVE', [ic_regua('50 cm a 1 m'), cartao('22h–6h', VERDE)], None, ['LONGE DO MEIO-FIO', 'BUZINA DE NOITE']),
 C('Infração média: quatro pontos, e multa de cento e trinta reais e dezesseis centavos.',
   'MÉDIA', [cartao('4 PTS', AMARELO), cartao('R$ 130,16', AMARELO)], 'MÉDIA = 4 PONTOS'),
 C('Exemplos de média: passar até vinte por cento acima do limite. Estacionar onde a placa proíbe. Dirigir usando fone de ouvido. E andar abaixo da velocidade mínima.',
   'EXEMPLOS DE MÉDIA', [V(60), E_TARJA, cartao('+20%', AMARELO)], None, ['ATÉ 20% A MAIS', 'ONDE É PROIBIDO', 'VELOCIDADE']),
 C('Um exemplo do dia a dia. A via é de sessenta, e você passa a setenta. Isso é menos de vinte por cento acima. Então é média: quatro pontos.',
   'EXEMPLO PRÁTICO', [V(60), cartao('70', AMARELO, 'NO PAINEL')], '70 NUMA VIA DE 60 = MÉDIA'),
 C('Os pontos se somam durante doze meses. E atenção: na primeira carteira, a provisória, você não pode repetir infração média. Se repetir, não ganha a carteira definitiva.',
   'OS PONTOS SOMAM', [ic_carteira, ic_relogio], 'PROVISÓRIA: CUIDADO'),
 C('Resumindo. Leve: três pontos. Média: quatro pontos. Na provisória, não repita média. Agora, três perguntas.',
   'RESUMO DO DIA 10', [cartao('LEVE 3', VERDE), cartao('MÉDIA 4', AMARELO)], '3 E 4 PONTOS', pausa=1.0),
 Q(1, 'Pergunta um. Quantos pontos vale uma infração leve?', [cartao('LEVE')], 'Resposta: três pontos.', '3 PONTOS'),
 Q(2, 'Pergunta dois. Quantos pontos vale uma infração média?', [cartao('MÉDIA')], 'Resposta: quatro pontos.', '4 PONTOS'),
 Q(3, 'Pergunta três. A via é de sessenta e você passa a setenta. Que tipo de infração é?', [V(60), cartao('70')],
   'Resposta: média. Até vinte por cento acima do limite é infração média. Até o Dia 11!', 'MÉDIA'),
]

D11 = [
 C('Olá! Dia 11: infrações graves e gravíssimas. Essas são as pesadas: mais pontos, multas maiores, e podem até tirar o seu direito de dirigir.',
   'DIA 11', [cartao('GRAVE', LARANJA), cartao('GRAVÍSSIMA', VERM)], 'AS PESADAS'),
 C('Infração grave: cinco pontos e multa de cento e noventa e cinco reais e vinte e três centavos. Exemplos: não usar o cinto, estacionar em fila dupla, ou passar entre vinte e cinquenta por cento acima do limite.',
   'GRAVE', [cartao('5 PTS', LARANJA), ic_cinto, cartao('R$ 195,23', LARANJA)], 'GRAVE = 5 PONTOS'),
 C('Infração gravíssima: sete pontos e multa de duzentos e noventa e três reais e quarenta e sete centavos. Exemplos: avançar o sinal vermelho, e dirigir segurando o celular.',
   'GRAVÍSSIMA', [cartao('7 PTS', VERM), semaforo('vermelho'), ic_celular], 'GRAVÍSSIMA = 7 PONTOS'),
 C('Algumas gravíssimas têm multiplicador: a multa é multiplicada. Dirigir sem habilitação: vezes três. Passar mais de cinquenta por cento do limite: vezes três. Beber e dirigir: vezes dez.',
   'MULTIPLICADOR', [cartao('×3', VERM, 'SEM CNH'), cartao('×10', VERM, 'ÁLCOOL')], 'MULTA MULTIPLICADA'),
 C('Agora, a suspensão. Os pontos somam em doze meses. Com duas ou mais gravíssimas, a carteira é suspensa com vinte pontos. Com uma gravíssima, com trinta. Sem nenhuma gravíssima, com quarenta.',
   'SUSPENSÃO', [cartao('20', VERM, '2+ GRAVÍSSIMAS'), cartao('30', LARANJA, '1 GRAVÍSSIMA'), cartao('40', AMARELO, 'NENHUMA')], 'PONTOS EM 12 MESES'),
 C('E algumas infrações suspendem direto, sem somar pontos. Por exemplo: beber e dirigir, e passar mais de cinquenta por cento do limite.',
   'SUSPENSÃO DIRETA', [ic_copo, V(60)], 'SUSPENDE NA HORA'),
 C('Na carteira provisória, a regra é dura: uma única infração grave ou gravíssima, e você não recebe a definitiva. Precisa começar o processo de novo.',
   'PROVISÓRIA', [ic_carteira], 'NENHUMA GRAVE OU GRAVÍSSIMA'),
 C('Resumindo. Leve: três. Média: quatro. Grave: cinco. Gravíssima: sete. Suspensão: vinte, trinta ou quarenta pontos, conforme as gravíssimas. Agora, três perguntas.',
   'RESUMO DO DIA 11', [cartao('3', VERDE), cartao('4', AMARELO), cartao('5', LARANJA), cartao('7', VERM)], '3 · 4 · 5 · 7', pausa=1.0),
 Q(1, 'Pergunta um. Quantos pontos vale uma infração gravíssima?', [cartao('GRAVÍSSIMA', VERM)], 'Resposta: sete pontos.', '7 PONTOS'),
 Q(2, 'Pergunta dois. Não usar o cinto de segurança é que tipo de infração?', [ic_cinto], 'Resposta: grave, cinco pontos.', 'GRAVE: 5 PONTOS'),
 Q(3, 'Pergunta três. Você está com a carteira provisória e comete uma infração grave. O que acontece?', [ic_carteira],
   'Resposta: você não recebe a carteira definitiva. Até o Dia 12!', 'NÃO RECEBE A DEFINITIVA'),
]

D12 = [
 C('Olá! Dia 12: estacionamento e parada. Parece a mesma coisa, mas para a prova é diferente. E tem muita regra de distância.',
   'DIA 12', [E_TARJA, E_X], 'PARAR NÃO É ESTACIONAR'),
 C('Parada é bem rápida: só o tempo de alguém entrar ou sair do carro. Estacionar é deixar o carro ali por mais tempo, mesmo com você dentro.',
   'PARADA X ESTACIONAMENTO', [ic_relogio, carro_parado], None, ['PARADA: RAPIDINHO', 'ESTACIONAR: TEMPO']),
 C('Lembra das placas? E com faixa vermelha: proibido estacionar, mas pode parar. E com X: proibido parar e estacionar.',
   'AS PLACAS', [E_TARJA, E_X], None, ['PODE PARAR', 'NEM PARAR']),
 C('O carro deve ficar bem pertinho do meio-fio, até cinquenta centímetros. Entre cinquenta centímetros e um metro: infração leve. Mais de um metro: infração grave.',
   'DISTÂNCIA DO MEIO-FIO', [ic_regua('50 cm'), cartao('LEVE', VERDE, '50 cm a 1 m'), cartao('GRAVE', LARANJA, '+ de 1 m')], 'ATÉ 50 CM'),
 C('Na esquina, não pode estacionar a menos de cinco metros. Isso deixa os carros enxergarem quem vem, e deixa os ônibus virarem. É infração média.',
   'ESQUINA', [ic_cruzamento, cartao('5 m')], '5 METROS DA ESQUINA'),
 C('Outros lugares proibidos: em frente a garagem, a guia rebaixada: média. Em fila dupla: grave. Em cima da calçada: grave. E na vaga de idoso ou de pessoa com deficiência sem a credencial: gravíssima.',
   'OUTROS PROIBIDOS', [cartao('GARAGEM', AMARELO, 'MÉDIA'), cartao('FILA DUPLA', LARANJA, 'GRAVE'), cartao('VAGA PCD', VERM, 'GRAVÍSSIMA')], None),
 C('Na rodovia, só pare no acostamento, e só se for emergência. Ligue o pisca-alerta e coloque o triângulo bem atrás do carro.',
   'NA RODOVIA', [ic_triangulo, carro_parado], 'SÓ NO ACOSTAMENTO'),
 C('Resumindo. Parada é rapidinha. Até cinquenta centímetros do meio-fio. Cinco metros da esquina. Vaga especial sem credencial: gravíssima. Agora, três perguntas.',
   'RESUMO DO DIA 12', [ic_regua('50 cm'), cartao('5 m'), cartao('PCD', VERM)], '50 CM · 5 M', pausa=1.0),
 Q(1, 'Pergunta um. Qual é a distância máxima do meio-fio para estacionar certo?', [ic_regua('?')], 'Resposta: cinquenta centímetros.', '50 CENTÍMETROS'),
 Q(2, 'Pergunta dois. A quantos metros da esquina é proibido estacionar?', [ic_cruzamento], 'Resposta: a menos de cinco metros.', '5 METROS'),
 Q(3, 'Pergunta três. Estacionar na vaga de idoso, sem a credencial, é que tipo de infração?', [cartao('IDOSO')],
   'Resposta: gravíssima. Até o Dia 13!', 'GRAVÍSSIMA'),
]

def S(n, perg, itens, resp, chave_): return Q(n, f'{n}. {perg}', itens, resp, chave_)
D13 = [
 C('Olá! Dia 13: simulado. Quinze perguntas rápidas sobre tudo o que você aprendeu até agora. Cinco segundos para pensar em cada uma. Vamos lá!',
   'DIA 13 · SIMULADO', [cartao('15 PERGUNTAS')], 'RESPIRE E VAMOS', pausa=.8),
 S(1, 'Que placa é esta?', [PARE_], 'Parada obrigatória. Para sempre.', 'PARE SEMPRE'),
 S(2, 'Que tipo de placa é o losango amarelo?', [adv('curva')], 'Advertência: aviso de perigo.', 'ADVERTÊNCIA'),
 S(3, 'Placa verde na estrada indica o quê?', [ind(['?'], VERDE_PLACA)], 'Direção e distância das cidades.', 'DIREÇÃO E DISTÂNCIA'),
 S(4, 'Semáforo verde, agente manda parar. E agora?', [agente('cima')], 'Pare. O agente manda mais.', 'PARE'),
 S(5, 'Linha contínua no meio. Pode ultrapassar?', [pista('continua')], 'Não pode.', 'NÃO'),
 S(6, 'Limite de uma via local, sem placa?', [cartao('?')], 'Trinta quilômetros por hora.', '30 KM/H'),
 S(7, 'Limite de carro em rodovia de pista simples?', [cartao('?')], 'Cem quilômetros por hora.', '100 KM/H'),
 S(8, 'Por qual lado se ultrapassa?', [ic_ultrapassa], 'Pela esquerda.', 'ESQUERDA'),
 S(9, 'Na rotatória, quem tem a vez?', [ic_rotatoria], 'Quem já está nela.', 'QUEM JÁ ESTÁ NELA'),
 S(10, 'Quantos pontos vale uma infração média?', [cartao('MÉDIA')], 'Quatro pontos.', '4 PONTOS'),
 S(11, 'Avançar o sinal vermelho é que infração?', [semaforo('vermelho')], 'Gravíssima, sete pontos.', 'GRAVÍSSIMA'),
 S(12, 'Distância máxima do meio-fio para estacionar?', [ic_regua('?')], 'Cinquenta centímetros.', '50 CM'),
 S(13, 'Placa com E e X vermelho. Pode parar?', [E_X], 'Não. Nem parar, nem estacionar.', 'NÃO'),
 S(14, 'Dois silvos curtos do agente querem dizer o quê?', [cartao('2 SILVOS')], 'Pare.', 'PARE'),
 S(15, 'A velocidade mínima é quanto da máxima?', [V(80)], 'A metade. Parabéns! Amanhã é descanso.', 'A METADE'),
]

DIAS = {8: ('limites-velocidade', D8), 9: ('ultrapassagem-preferencia', D9), 10: ('infracoes-leves-medias', D10),
        11: ('infracoes-graves-gravissimas', D11), 12: ('estacionamento-parada', D12), 13: ('simulado-1', D13)}

if __name__ == '__main__':
    for n in (map(int, sys.argv[1:]) if len(sys.argv) > 1 else DIAS):
        gerar(n, *DIAS[n])
