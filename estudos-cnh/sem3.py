"""Semana 3 — Segurança (Dias 15 a 20). uso: python3 sem3.py [15 16 ...]"""
import sys
from motor import *

def V(n): return P(placa_velocidade, str(n))
def carro_lado(d, cx, cy, r, k=0): carro(d, cx, cy + r * .2, r * .006)

D15 = [
 C('Olá! Começa a Semana 3: segurança no trânsito. Dia 15: álcool e direção, a Lei Seca. Essa é uma das regras mais cobradas na prova, e uma das mais importantes da vida real.',
   'SEMANA 3 · DIA 15', [ic_copo, carro_lado], 'LEI SECA'),
 C('A regra é tolerância zero. Não existe quantidade segura. Uma latinha de cerveja, uma taça de vinho: se bebeu, não dirija.',
   'TOLERÂNCIA ZERO', [x_vermelho(ic_copo)], 'BEBEU? NÃO DIRIJA'),
 C('A punição: infração gravíssima com multa vezes dez. Isso dá dois mil, novecentos e trinta e quatro reais e setenta centavos. E a carteira fica suspensa por doze meses.',
   'A PUNIÇÃO', [cartao('×10', VERM, 'GRAVÍSSIMA'), cartao('R$ 2.934,70', VERM), cartao('12 MESES', LARANJA, 'SUSPENSÃO')], 'MULTA ×10'),
 C('Além disso, o carro fica retido até chegar outro motorista habilitado e sem beber. E a carteira é recolhida na hora.',
   'NA HORA', [ic_carteira, carro_lado], 'CARRO E CNH RETIDOS'),
 C('E se recusar o bafômetro? A punição é a mesma: multa vezes dez e suspensão de doze meses. Recusar não livra ninguém.',
   'RECUSAR O BAFÔMETRO', [cartao('RECUSA'), cartao('= MESMA PUNIÇÃO', VERM)], 'MESMA PUNIÇÃO'),
 C('Se fizer de novo, dentro de doze meses, a multa dobra. E com muito álcool no corpo, a partir de zero vírgula três miligramas por litro de ar, vira crime, com pena de detenção.',
   'REINCIDÊNCIA E CRIME', [cartao('×2', VERM, 'REPETIU EM 12 MESES'), cartao('0,3 mg/L', VERM, 'CRIME')], 'PODE VIRAR CRIME'),
 C('Dica da vida real: o álcool demora horas para sair do corpo. Café e banho não adiantam. Combine antes quem vai dirigir, ou vá de táxi ou aplicativo.',
   'NA VIDA REAL', [ic_relogio, ic_celular], 'COMBINE ANTES'),
 C('Resumindo. Tolerância zero. Multa vezes dez, dois mil novecentos e trinta e quatro reais e setenta centavos. Suspensão de doze meses. Recusar o bafômetro: mesma punição. Agora, três perguntas.',
   'RESUMO DO DIA 15', [x_vermelho(ic_copo), cartao('×10', VERM), cartao('12 MESES', LARANJA)], 'ZERO ÁLCOOL', pausa=1.0),
 Q(1, 'Pergunta um. Quanto de álcool é permitido para dirigir?', [ic_copo], 'Resposta: nada. A tolerância é zero.', 'ZERO'),
 Q(2, 'Pergunta dois. Por quanto tempo a carteira fica suspensa na Lei Seca?', [ic_carteira], 'Resposta: doze meses.', '12 MESES'),
 Q(3, 'Pergunta três. O motorista recusou o bafômetro. Ele escapa da punição?', [cartao('RECUSA')],
   'Resposta: não. Recebe a mesma multa e a mesma suspensão. Até o Dia 16!', 'NÃO: MESMA PUNIÇÃO'),
]

D16 = [
 C('Olá! Dia 16: cinto de segurança, airbag e cadeirinha. Hoje o assunto é proteger quem está dentro do carro.',
   'DIA 16', [ic_cinto, ic_cadeirinha], 'PROTEÇÃO'),
 C('O cinto é obrigatório para todo mundo no carro, na frente e atrás. Até numa volta rápida no quarteirão. Não usar é infração grave, cinco pontos.',
   'CINTO PARA TODOS', [ic_cinto, cartao('5 PTS', LARANJA, 'GRAVE')], 'FRENTE E ATRÁS'),
 C('O airbag ajuda, mas não substitui o cinto. Sem cinto, o corpo vai para a frente rápido demais, e o airbag pode até machucar. O airbag só funciona bem junto com o cinto.',
   'AIRBAG', [ic_cinto, cartao('+ AIRBAG')], 'AIRBAG NÃO SUBSTITUI'),
 C('Crianças usam equipamento conforme a idade. Até um ano: bebê conforto, de costas para o movimento. De um a quatro anos: cadeirinha.',
   'CRIANÇAS (1)', [cartao('ATÉ 1 ANO', sub='BEBÊ CONFORTO'), ic_cadeirinha], None, [None, '1 A 4 ANOS']),
 C('De quatro a sete anos e meio: assento de elevação, que levanta a criança para o cinto passar certo. Depois disso, até os dez anos, o cinto do carro, no banco de trás.',
   'CRIANÇAS (2)', [cartao('4 A 7,5', sub='ASSENTO DE ELEVAÇÃO'), cartao('ATÉ 10', sub='CINTO NO BANCO DE TRÁS')], None),
 C('Regra para decorar: criança com menos de dez anos, e com menos de um metro e quarenta e cinco de altura, vai no banco de trás. Levar criança sem o equipamento certo é infração gravíssima.',
   'BANCO DE TRÁS', [cartao('< 10 ANOS'), ic_regua('1,45 m')], 'CRIANÇA VAI ATRÁS'),
 C('Na moto: capacete preso, com viseira ou óculos, para o piloto e o garupa. E criança com menos de dez anos não pode ir na garupa.',
   'NA MOTO', [ic_moto, cartao('< 10', VERM, 'NÃO PODE')], 'CAPACETE PRESO'),
 C('Resumindo. Cinto para todos. Airbag não substitui o cinto. Até um ano: bebê conforto. Um a quatro: cadeirinha. Quatro a sete e meio: assento de elevação. Menos de dez anos: banco de trás. Agora, três perguntas.',
   'RESUMO DO DIA 16', [ic_cinto, ic_cadeirinha, ic_regua('1,45 m')], 'CINTO SEMPRE', pausa=1.0),
 Q(1, 'Pergunta um. Quem está no banco de trás precisa usar cinto?', [ic_cinto], 'Resposta: sim. O cinto é obrigatório para todos.', 'SIM: TODOS'),
 Q(2, 'Pergunta dois. Uma criança de três anos deve usar o quê?', [cartao('3 ANOS')], 'Resposta: cadeirinha, no banco de trás.', 'CADEIRINHA'),
 Q(3, 'Pergunta três. O airbag substitui o cinto?', [cartao('AIRBAG')], 'Resposta: não. O airbag só protege bem junto com o cinto. Até o Dia 17!', 'NÃO'),
]

D17 = [
 C('Olá! Dia 17: direção defensiva. É dirigir prevendo o erro dos outros, para evitar o acidente antes que ele aconteça.',
   'DIA 17', [ic_ponto_cego, ic_distancia], 'PREVER PARA EVITAR'),
 C('Ela tem cinco elementos: conhecimento, atenção, previsão, decisão e habilidade. Saber as regras, olhar tudo, imaginar o que pode acontecer, escolher a melhor ação e saber fazer.',
   'OS 5 ELEMENTOS', [cartao('5')], 'CONHECER · ATENÇÃO · PREVER'),
 C('Distância do carro da frente: use a regra dos dois segundos. Quando o carro da frente passar por um poste, conte: mil e um, mil e dois. Você só pode chegar no poste depois disso. Na chuva, dobre.',
   'DISTÂNCIA SEGURA', [ic_distancia], '2 SEGUNDOS'),
 C('Ponto cego é a parte que o espelho não mostra. Antes de mudar de faixa, vire um pouco a cabeça e olhe. Uma moto pode estar ali.',
   'PONTO CEGO', [ic_ponto_cego], 'VIRE A CABEÇA'),
 C('Na chuva, o pneu pode deslizar sobre a água: é a aquaplanagem. Se acontecer, não freie forte. Segure o volante firme, tire o pé do acelerador, e espere o pneu voltar a tocar o chão.',
   'AQUAPLANAGEM', [adv('escorrega'), ic_pneu], 'NÃO FREIE FORTE'),
 C('Na neblina, use farol baixo, nunca o alto. O farol alto reflete na neblina e cega você. Reduza a velocidade e aumente a distância.',
   'NEBLINA', [cartao('FAROL BAIXO')], 'NUNCA FAROL ALTO'),
 C('E cuide de você: com sono, cansaço ou nervoso, não dirija. Numa viagem longa, pare para descansar a cada duas horas.',
   'O MOTORISTA', [ic_relogio], 'DESCANSE'),
 C('Resumindo. Dois segundos de distância, quatro na chuva. Vire a cabeça no ponto cego. Aquaplanagem: não freie forte. Neblina: farol baixo. Agora, três perguntas.',
   'RESUMO DO DIA 17', [ic_distancia, ic_ponto_cego, ic_pneu], 'PREVER SEMPRE', pausa=1.0),
 Q(1, 'Pergunta um. Qual é a regra para a distância do carro da frente?', [ic_distancia], 'Resposta: a regra dos dois segundos. Na chuva, mais.', '2 SEGUNDOS'),
 Q(2, 'Pergunta dois. Qual farol usar na neblina?', [cartao('?')], 'Resposta: farol baixo.', 'FAROL BAIXO'),
 Q(3, 'Pergunta três. O carro aquaplanou. O que não fazer?', [ic_pneu], 'Resposta: não frear forte. Segure o volante e tire o pé do acelerador. Até o Dia 18!', 'NÃO FREAR FORTE'),
]

D18 = [
 C('Olá! Dia 18: manutenção do carro e recall. Um carro bem cuidado evita acidente, gasta menos e polui menos.',
   'DIA 18', [ic_pneu, ic_oleo], 'CARRO CUIDADO'),
 C('Os pneus. Confira a calibragem com eles frios, pelo menos a cada quinze dias. E o sulco, a parte funda da borracha, precisa ter pelo menos um vírgula seis milímetros. Pneu careco é infração grave.',
   'PNEUS', [ic_pneu, cartao('1,6 mm', sub='SULCO MÍNIMO')], 'MÍNIMO 1,6 MM'),
 C('No painel, fique de olho nas luzes. Luz do óleo acesa: pare e verifique. Ponteiro da temperatura subindo: o motor está esquentando, pare com segurança.',
   'O PAINEL', [ic_oleo, cartao('TEMP ↑', VERM)], 'LUZ ACESA? VERIFIQUE'),
 C('Verifique também: freios, luzes, setas, limpador de para-brisa e a água do radiador. Antes de viajar, faça uma revisão.',
   'CHECAGEM', [cartao('FREIOS'), cartao('LUZES'), cartao('ÁGUA')], 'ANTES DE VIAJAR'),
 C('Equipamentos obrigatórios no carro: triângulo, macaco, chave de roda e estepe. O extintor de incêndio hoje é opcional para carro de passeio.',
   'OBRIGATÓRIOS', [ic_triangulo, ic_pneu, cartao('EXTINTOR', VERDE, 'OPCIONAL')], None, ['TRIÂNGULO', 'ESTEPE', None]),
 C('Recall é quando a fábrica descobre um defeito no carro e chama o dono para consertar. O conserto é de graça. E é importante fazer logo, porque o defeito pode causar acidente.',
   'RECALL', [cartao('RECALL'), cartao('R$ 0', VERDE, 'DE GRAÇA')], 'CONSERTO GRÁTIS'),
 C('Resumindo. Pneu: sulco de pelo menos um vírgula seis milímetros. Luz do óleo ou temperatura alta: pare. Triângulo, macaco, chave de roda e estepe são obrigatórios. Recall é grátis. Agora, três perguntas.',
   'RESUMO DO DIA 18', [ic_pneu, ic_oleo, cartao('RECALL')], '1,6 MM · RECALL GRÁTIS', pausa=1.0),
 Q(1, 'Pergunta um. Qual é o sulco mínimo do pneu?', [ic_pneu], 'Resposta: um vírgula seis milímetros.', '1,6 MM'),
 Q(2, 'Pergunta dois. O recall é pago ou de graça?', [cartao('RECALL')], 'Resposta: de graça. A fábrica conserta sem cobrar.', 'DE GRAÇA'),
 Q(3, 'Pergunta três. O extintor é obrigatório no carro de passeio?', [cartao('EXTINTOR')], 'Resposta: não, hoje ele é opcional. Até o Dia 19!', 'NÃO: OPCIONAL'),
]

D19 = [
 C('Olá! Dia 19: meio ambiente e cidadania. Dirigir bem também é respeitar as pessoas e a natureza.',
   'DIA 19', [ic_folha, faixa_pedestre], 'RESPEITO'),
 C('Carro sem manutenção polui mais. Fumaça preta no escapamento é sinal de problema. Revisão em dia e pneu calibrado ajudam a gastar menos combustível e poluir menos.',
   'POLUIÇÃO', [ic_folha, ic_oleo], 'REVISÃO EM DIA'),
 C('Jogar lixo pela janela do carro é infração média. Até uma bituca de cigarro ou uma latinha. Guarde num saquinho e jogue fora depois.',
   'LIXO', [x_vermelho(ic_copo), cartao('MÉDIA', AMARELO)], 'LIXO NO SAQUINHO'),
 C('Barulho também é poluição. Som alto no carro é infração grave. E buzina só para um toque rápido de aviso, nunca à toa.',
   'BARULHO', [cartao('SOM ALTO', LARANJA, 'GRAVE')], 'SEM BARULHO'),
 C('Para ultrapassar uma bicicleta, deixe pelo menos um metro e meio de distância do lado, e passe devagar. O ciclista é mais frágil.',
   'CICLISTA', [ic_bike, ic_regua('1,5 m')], '1,5 METRO'),
 C('Pedestre na faixa tem a vez. Idosos, crianças e pessoas com deficiência precisam de mais tempo. Espere com paciência, sem buzinar.',
   'PEDESTRES', [faixa_pedestre], 'PACIÊNCIA'),
 C('Cidadania é isso: usar a vaga certa, dar passagem, não fechar cruzamento, e lembrar que todo mundo quer chegar em casa bem.',
   'CIDADANIA', [cartao('RESPEITO', VERDE)], 'TODOS CHEGAM BEM'),
 C('Resumindo. Revisão em dia polui menos. Lixo pela janela: média. Som alto: grave. Ciclista: um metro e meio. Pedestre na faixa tem a vez. Agora, três perguntas.',
   'RESUMO DO DIA 19', [ic_folha, ic_bike, faixa_pedestre], '1,5 M DO CICLISTA', pausa=1.0),
 Q(1, 'Pergunta um. Qual a distância mínima do lado para ultrapassar uma bicicleta?', [ic_bike], 'Resposta: um metro e meio.', '1,5 METRO'),
 Q(2, 'Pergunta dois. Jogar lixo pela janela é que infração?', [ic_copo], 'Resposta: média.', 'MÉDIA'),
 Q(3, 'Pergunta três. Fumaça preta no escapamento indica o quê?', [cartao('FUMAÇA')], 'Resposta: problema no motor. Faça a revisão. Até o Dia 20!', 'PROBLEMA: REVISÃO'),
]

D20 = [
 C('Olá! Dia 20: revisão da semana três. Lei Seca, cinto e cadeirinha, direção defensiva, manutenção e cidadania. Primeiro a gente relembra, depois cinco perguntas.',
   'DIA 20 · REVISÃO', [ic_copo, ic_cinto, ic_pneu], 'SEGURANÇA'),
 C('Lei Seca: tolerância zero, multa vezes dez, doze meses de suspensão. Cinto: todos, na frente e atrás. Criança com menos de dez anos e um metro e quarenta e cinco: banco de trás.',
   'RELEMBRE (1)', [x_vermelho(ic_copo), ic_cinto, ic_cadeirinha], None, ['ZERO', 'TODOS', 'ATRÁS']),
 C('Direção defensiva: dois segundos de distância, farol baixo na neblina. Pneu: um vírgula seis milímetros. Ciclista: um metro e meio.',
   'RELEMBRE (2)', [ic_distancia, ic_pneu, ic_bike], None, ['2 SEGUNDOS', '1,6 MM', '1,5 M']),
 C('Agora, cinco perguntas. Cinco segundos para cada.', 'HORA DO QUIZ', [cartao('5 PERGUNTAS')], pausa=.6),
 Q(1, 'Pergunta um. Qual é a multa da Lei Seca?', [ic_copo], 'Resposta: gravíssima vezes dez: dois mil, novecentos e trinta e quatro reais e setenta centavos.', 'R$ 2.934,70'),
 Q(2, 'Pergunta dois. Uma criança de seis anos usa o quê?', [cartao('6 ANOS')], 'Resposta: assento de elevação, no banco de trás.', 'ASSENTO DE ELEVAÇÃO'),
 Q(3, 'Pergunta três. Na chuva, a distância de segurança deve aumentar ou diminuir?', [ic_distancia], 'Resposta: aumentar. Dobre a distância.', 'AUMENTAR'),
 Q(4, 'Pergunta quatro. Quais são os equipamentos obrigatórios do carro?', [ic_triangulo], 'Resposta: triângulo, macaco, chave de roda e estepe.', 'TRIÂNGULO · MACACO · ESTEPE'),
 Q(5, 'Pergunta cinco. Não usar o cinto é que infração?', [ic_cinto], 'Resposta: grave, cinco pontos. Parabéns pela semana! Amanhã é descanso.', 'GRAVE'),
]

DIAS = {15: ('lei-seca', D15), 16: ('cinto-airbag-cadeirinha', D16), 17: ('direcao-defensiva', D17),
        18: ('manutencao-recall', D18), 19: ('meio-ambiente-cidadania', D19), 20: ('revisao-semana-3', D20)}

if __name__ == '__main__':
    for n in (map(int, sys.argv[1:]) if len(sys.argv) > 1 else DIAS):
        gerar(n, *DIAS[n])
