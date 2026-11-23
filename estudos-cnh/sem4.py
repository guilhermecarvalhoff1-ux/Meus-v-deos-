"""Semana 4 — Primeiros socorros e simulados (Dias 22 a 27). uso: python3 sem4.py [22 23 ...]"""
import sys
from motor import *

PARE_ = P(placa_pare); PREF = P(placa_preferencia); PROIB_ESQ = P(placa_proib_esquerda); SIGA = P(placa_siga_frente)
def V(n): return P(placa_velocidade, str(n))
E_TARJA = P(placa_letra, 'E', 'tarja'); E_X = P(placa_letra, 'E', 'x')
def carro_lado(d, cx, cy, r, k=0): carro(d, cx, cy + r * .2, r * .006)
def passos(d, cx, cy, r, k=0):
    n = min(8, int(k * 2.5) + 1)
    for i in range(n):
        x = cx - r * 1.1 + i * r * .3; y = cy + (r * .15 if i % 2 else -r * .15)
        d.ellipse([x - r * .08, y - r * .05, x + r * .08, y + r * .05], fill=AMARELO)
    ic_triangulo(d, cx + r * 1.3, cy, r * .45)

D22 = [
 C('Olá! Dia 22: primeiros socorros, parte um. Hoje: o que fazer quando você chega num acidente. Calma: você não precisa ser médico. Precisa saber os primeiros passos.',
   'DIA 22', [ic_cruz, ic_ambulancia], 'OS PRIMEIROS PASSOS'),
 C('Primeiro, proteja: você e o local. Pare o seu carro num lugar seguro, ligue o pisca-alerta, e sinalize. Se você também se machucar, não vai poder ajudar ninguém.',
   '1. PROTEJA', [ic_triangulo, carro_lado], 'SEGURANÇA PRIMEIRO'),
 C('Para sinalizar, coloque o triângulo e outros avisos bem atrás do acidente. Regra prática: um passo longo para cada quilômetro por hora da via. Numa via de sessenta, sessenta passos. Na chuva ou à noite, mais ainda.',
   'QUANTOS PASSOS?', [V(60), passos], '1 PASSO POR KM/H'),
 C('Segundo, peça ajuda. Os números: SAMU, cento e noventa e dois. Bombeiros, cento e noventa e três. Polícia Militar, cento e noventa. E na rodovia federal, Polícia Rodoviária, cento e noventa e um.',
   '2. LIGUE', [ic_fone('192'), ic_fone('193', LARANJA), ic_fone('190', AZUL_PLACA), ic_fone('191', VERDE_PLACA)], None, ['SAMU', 'BOMBEIROS', 'POLÍCIA', 'PRF']),
 C('Na ligação, fale com calma: onde é o acidente, quantas vítimas, e como elas estão. Por exemplo: se estão acordadas, se tem sangramento, se alguém está preso no carro.',
   'O QUE FALAR', [ic_celular], 'ONDE · QUANTOS · COMO'),
 C('Terceiro: não mexa na vítima. Mover uma pessoa machucada pode piorar uma lesão na coluna. Só tire a vítima do lugar se tiver perigo real, como fogo.',
   '3. NÃO MEXA', [x_vermelho(ic_mao)], 'SÓ SE TIVER FOGO'),
 C('Não dê água nem comida para a vítima. Converse com ela, mantenha ela calma e aquecida, e espere o socorro. Ah, e desligue o motor dos carros, para evitar fogo.',
   'ENQUANTO ESPERA', [ic_relogio, x_vermelho(ic_copo)], 'NADA DE ÁGUA'),
 C('Resumindo. Proteja e sinalize: um passo por quilômetro por hora. Ligue: cento e noventa e dois, SAMU, ou cento e noventa e três, bombeiros. Não mexa na vítima. Agora, três perguntas.',
   'RESUMO DO DIA 22', [ic_triangulo, ic_fone('192'), x_vermelho(ic_mao)], 'PROTEJA · LIGUE · ESPERE', pausa=1.0),
 Q(1, 'Pergunta um. Qual o número do SAMU?', [ic_fone('?')], 'Resposta: cento e noventa e dois.', '192'),
 Q(2, 'Pergunta dois. A via é de oitenta. A quantos passos você coloca a sinalização?', [V(80)], 'Resposta: oitenta passos longos. Um passo por quilômetro por hora.', '80 PASSOS'),
 Q(3, 'Pergunta três. A vítima pede água. Você dá?', [ic_copo], 'Resposta: não. Não dê água nem comida. Até o Dia 23!', 'NÃO'),
]

D23 = [
 C('Olá! Dia 23: primeiros socorros, parte dois. Hoje: como olhar a vítima, e o que fazer em casos comuns, como sangramento e motociclista.',
   'DIA 23', [ic_cruz, ic_moto], 'CUIDAR SEM PIORAR'),
 C('Primeiro, veja se a vítima está consciente. Chame em voz alta e toque no ombro. Depois veja se está respirando: o peito sobe e desce? Passe essa informação para o SAMU.',
   'ELA RESPONDE?', [lambda d, cx, cy, r, k=0: boneco(d, cx, cy, r * 1.5, CREME)], 'CHAME · OLHE O PEITO'),
 C('Motociclista caído: nunca tire o capacete. Tirar o capacete pode machucar o pescoço e a coluna. Só a equipe de resgate faz isso.',
   'MOTOCICLISTA', [ic_moto, cartao('CAPACETE', VERM, 'NÃO TIRE')], 'NUNCA TIRE O CAPACETE'),
 C('Sangramento: aperte o ferimento com um pano limpo, e mantenha a pressão. Se o pano encharcar, coloque outro por cima, sem tirar o primeiro.',
   'SANGRAMENTO', [ic_mao, cartao('PANO LIMPO')], 'APERTE COM PANO'),
 C('Queimadura: só água limpa e fria corrente. Nada de pasta de dente, manteiga ou pomada. E não estoure as bolhas.',
   'QUEIMADURA', [cartao('ÁGUA FRIA', (120, 180, 255)), x_vermelho(cartao('PASTA'))], 'SÓ ÁGUA'),
 C('Suspeita de fratura, um osso quebrado: não tente colocar no lugar. Deixe a pessoa parada, na posição em que está, e espere o resgate.',
   'FRATURA', [x_vermelho(ic_mao)], 'NÃO MEXA'),
 C('E lembre: ajudar é dever de todos. Se você não sabe o que fazer, ligar para o socorro já é ajudar. Deixar de prestar socorro, podendo ajudar, é crime.',
   'SEU DEVER', [ic_fone('192')], 'LIGAR JÁ É AJUDAR'),
 C('Resumindo. Veja se responde e se respira. Motociclista: não tire o capacete. Sangramento: aperte com pano limpo. Queimadura: só água fria. Fratura: não mexa. Agora, três perguntas.',
   'RESUMO DO DIA 23', [ic_moto, ic_mao, cartao('ÁGUA')], 'CUIDAR SEM PIORAR', pausa=1.0),
 Q(1, 'Pergunta um. Motociclista caído. Você tira o capacete dele?', [ic_moto], 'Resposta: não. Nunca tire o capacete.', 'NÃO'),
 Q(2, 'Pergunta dois. A vítima está sangrando muito. O que fazer?', [ic_mao], 'Resposta: apertar o ferimento com um pano limpo.', 'APERTAR COM PANO LIMPO'),
 Q(3, 'Pergunta três. Queimadura: pode passar pasta de dente?', [cartao('PASTA')], 'Resposta: não. Só água limpa e fria. Até o Dia 24!', 'NÃO: SÓ ÁGUA'),
]

def S(n, perg, itens, resp, chave_): return Q(n, f'{n}. {perg}', itens, resp, chave_)

D24 = [
 C('Olá! Dia 24: simulado dois. Quinze perguntas misturando tudo. Cinco segundos para pensar em cada. Vamos!',
   'DIA 24 · SIMULADO', [cartao('15 PERGUNTAS')], 'RESPIRE E VAMOS', pausa=.8),
 S(1, 'Que placa é esta?', [PREF], 'Dê a preferência.', 'DÊ A PREFERÊNCIA'),
 S(2, 'Placa marrom indica o quê?', [ind(['?'], MARROM)], 'Turismo e lazer.', 'TURISMO'),
 S(3, 'Amarelo do semáforo quer dizer o quê?', [semaforo('amarelo')], 'Pare, se der com segurança.', 'PARE SE PUDER'),
 S(4, 'Linha branca separa o quê?', [pista('tracejada', CREME)], 'Carros no mesmo sentido.', 'MESMO SENTIDO'),
 S(5, 'Limite de uma via arterial, sem placa?', [cartao('?')], 'Sessenta quilômetros por hora.', '60 KM/H'),
 S(6, 'Cruzamento sem sinal. Quem tem a vez?', [ic_cruzamento], 'Quem vem pela direita.', 'DA DIREITA'),
 S(7, 'Infração grave vale quantos pontos?', [cartao('GRAVE')], 'Cinco pontos.', '5 PONTOS'),
 S(8, 'Celular na mão dirigindo é que infração?', [ic_celular], 'Gravíssima.', 'GRAVÍSSIMA'),
 S(9, 'A quantos metros da esquina é proibido estacionar?', [ic_cruzamento], 'A menos de cinco metros.', '5 METROS'),
 S(10, 'Quanto álcool é permitido para dirigir?', [ic_copo], 'Nada. Tolerância zero.', 'ZERO'),
 S(11, 'Criança de oito anos e um metro e trinta senta onde?', [cartao('8 ANOS')], 'No banco de trás.', 'BANCO DE TRÁS'),
 S(12, 'Na neblina, qual farol?', [cartao('?')], 'Farol baixo.', 'BAIXO'),
 S(13, 'Número dos bombeiros?', [ic_fone('?', LARANJA)], 'Cento e noventa e três.', '193'),
 S(14, 'Distância lateral para passar um ciclista?', [ic_bike], 'Um metro e meio.', '1,5 METRO'),
 S(15, 'Motociclista caído. Tira o capacete?', [ic_moto], 'Não. Muito bem! Até o Dia 25.', 'NÃO'),
]

D25 = [
 C('Olá! Dia 25: os erros mais comuns da prova. São as pegadinhas que derrubam muita gente. Se você conhecer, não cai.',
   'DIA 25', [cartao('PEGADINHAS', VERM)], 'NÃO CAIA'),
 C('Erro um: achar que no Pare pode passar devagar se a rua está vazia. Não pode. No Pare, você para sempre, por completo.',
   'ERRO 1', [PARE_], 'PARE = PARAR SEMPRE'),
 C('Erro dois: achar que o amarelo é para acelerar. Errado. Amarelo é para parar, se der para parar com segurança.',
   'ERRO 2', [semaforo('amarelo')], 'AMARELO NÃO É ACELERAR'),
 C('Erro três: confundir as cores das linhas. Amarela separa sentidos opostos. Branca separa o mesmo sentido. E com duas linhas juntas, vale a do seu lado.',
   'ERRO 3', [pista('continua'), pista('tracejada', CREME)], 'AMARELA: VAI E VEM'),
 C('Erro quatro: achar que a velocidade da placa é obrigatória. Não. É a máxima. E a mínima é a metade dela.',
   'ERRO 4', [V(60), cartao('30', VERDE, 'MÍNIMA')], 'PLACA = MÁXIMA'),
 C('Erro cinco: achar que só o motorista usa cinto. Todo mundo usa, inclusive no banco de trás.',
   'ERRO 5', [ic_cinto], 'CINTO PARA TODOS'),
 C('Erro seis: achar que recusar o bafômetro livra da multa. Não livra. A punição é a mesma.',
   'ERRO 6', [ic_copo], 'RECUSA = MESMA PUNIÇÃO'),
 C('Erro sete: confundir a ordem de quem manda. Primeiro o agente, depois o semáforo, depois as placas.',
   'ERRO 7', [agente('cima'), semaforo('verde'), PARE_], 'AGENTE MANDA MAIS', ['1º', '2º', '3º']),
 C('Dica para a prova: leia a pergunta até o fim, e procure palavras como: sempre, nunca, exceto. Elas mudam tudo. Agora, três perguntas pegadinha.',
   'DICA DA PROVA', [cartao('SEMPRE'), cartao('NUNCA'), cartao('EXCETO')], 'LEIA ATÉ O FIM', pausa=1.0),
 Q(1, 'Pergunta um. Na placa de Pare, com a rua vazia, pode passar devagar sem parar?', [PARE_], 'Resposta: não. Tem que parar por completo.', 'NÃO: PARE SEMPRE'),
 Q(2, 'Pergunta dois. A placa diz oitenta. Você é obrigado a andar a oitenta?', [V(80)], 'Resposta: não. Oitenta é o máximo. A mínima é quarenta.', 'NÃO: É O MÁXIMO'),
 Q(3, 'Pergunta três. O carona do banco de trás pode ficar sem cinto?', [ic_cinto], 'Resposta: não. Todos usam cinto. Até o Dia 26!', 'NÃO'),
]

D26 = [
 C('Olá! Dia 26: simulado três. Mais quinze perguntas. Cinco segundos para cada. Você já sabe muito. Vamos!',
   'DIA 26 · SIMULADO', [cartao('15 PERGUNTAS')], 'CONFIANÇA', pausa=.8),
 S(1, 'Esta placa é proibição ou obrigação?', [PROIB_ESQ], 'Proibição. Tem faixa vermelha.', 'PROIBIÇÃO'),
 S(2, 'O que esta placa avisa?', [adv('criancas')], 'Área escolar, crianças.', 'ESCOLA'),
 S(3, 'Placa azul com bomba de combustível indica o quê?', [servico('bomba')], 'Posto de combustível.', 'POSTO'),
 S(4, 'Braço do agente para cima. O que fazer?', [agente('cima')], 'Todos param.', 'TODOS PARAM'),
 S(5, 'Duas linhas amarelas contínuas. Pode ultrapassar?', [pista('dupla')], 'Não, ninguém pode.', 'NÃO'),
 S(6, 'Limite de carro em rodovia de pista dupla?', [cartao('?')], 'Cento e dez.', '110 KM/H'),
 S(7, 'Limite em estrada de terra?', [cartao('?')], 'Sessenta.', '60 KM/H'),
 S(8, 'Na rotatória, quem tem a vez?', [ic_rotatoria], 'Quem já está nela.', 'QUEM ESTÁ NELA'),
 S(9, 'Com duas gravíssimas, suspende com quantos pontos?', [cartao('?')], 'Vinte pontos.', '20 PONTOS'),
 S(10, 'Estacionar em fila dupla é que infração?', [cartao('FILA DUPLA')], 'Grave.', 'GRAVE'),
 S(11, 'Suspensão da Lei Seca dura quanto?', [ic_copo], 'Doze meses.', '12 MESES'),
 S(12, 'Bebê de dez meses usa o quê?', [cartao('10 MESES')], 'Bebê conforto, de costas.', 'BEBÊ CONFORTO'),
 S(13, 'Distância do carro da frente?', [ic_distancia], 'Dois segundos.', '2 SEGUNDOS'),
 S(14, 'Sulco mínimo do pneu?', [ic_pneu], 'Um vírgula seis milímetros.', '1,6 MM'),
 S(15, 'Número da Polícia Militar?', [ic_fone('?', AZUL_PLACA)], 'Cento e noventa. Excelente! Até o Dia 27.', '190'),
]

D27 = [
 C('Olá! Dia 27: revisão dos pontos mais difíceis: os números. Muita gente erra porque confunde os números. Hoje a gente coloca todos lado a lado.',
   'DIA 27', [cartao('NÚMEROS')], 'OS NÚMEROS DA PROVA'),
 C('Velocidades na cidade: oitenta, sessenta, quarenta, trinta. Na rodovia, carro e moto: cento e dez na pista dupla, cem na pista simples. Terra: sessenta.',
   'VELOCIDADES', [cartao('80·60·40·30'), cartao('110 · 100 · 60')], 'MÍNIMA = METADE'),
 C('Pontos: leve, três. Média, quatro. Grave, cinco. Gravíssima, sete.',
   'PONTOS', [cartao('3', VERDE), cartao('4', AMARELO), cartao('5', LARANJA), cartao('7', VERM)], 'LEVE 3 · GRAVÍSSIMA 7'),
 C('Suspensão por pontos em doze meses: vinte, com duas ou mais gravíssimas. Trinta, com uma. Quarenta, com nenhuma.',
   'SUSPENSÃO', [cartao('20', VERM), cartao('30', LARANJA), cartao('40', AMARELO)], '20 · 30 · 40'),
 C('Distâncias: meio-fio, até cinquenta centímetros. Esquina, cinco metros. Ciclista, um metro e meio. Carro da frente, dois segundos.',
   'DISTÂNCIAS', [cartao('50 cm'), cartao('5 m'), cartao('1,5 m'), cartao('2 s')], None, ['MEIO-FIO', 'ESQUINA', 'CICLISTA', 'CARRO']),
 C('Telefones: cento e noventa e dois, SAMU. Cento e noventa e três, bombeiros. Cento e noventa, Polícia Militar. Cento e noventa e um, Polícia Rodoviária Federal.',
   'TELEFONES', [ic_fone('192'), ic_fone('193', LARANJA), ic_fone('190', AZUL_PLACA), ic_fone('191', VERDE_PLACA)], None, ['SAMU', 'BOMBEIROS', 'PM', 'PRF']),
 C('E mais: Lei Seca, multa vezes dez, doze meses. Criança: menos de dez anos e um metro e quarenta e cinco, atrás. Pneu: um vírgula seis milímetros. Agora, três perguntas.',
   'OUTROS', [cartao('×10', VERM), cartao('1,45 m'), cartao('1,6 mm')], None, pausa=1.0),
 Q(1, 'Pergunta um. Limite de uma via coletora, sem placa?', [cartao('?')], 'Resposta: quarenta quilômetros por hora.', '40 KM/H'),
 Q(2, 'Pergunta dois. Sem nenhuma gravíssima, a carteira suspende com quantos pontos?', [cartao('?')], 'Resposta: quarenta pontos.', '40 PONTOS'),
 Q(3, 'Pergunta três. Cento e noventa e três é o número de quem?', [ic_fone('193', LARANJA)], 'Resposta: dos bombeiros. Muito bem! Amanhã é descanso.', 'BOMBEIROS'),
]

DIAS = {22: ('primeiros-socorros-1', D22), 23: ('primeiros-socorros-2', D23), 24: ('simulado-2', D24),
        25: ('erros-comuns', D25), 26: ('simulado-3', D26), 27: ('revisao-numeros', D27)}

if __name__ == '__main__':
    for n in (map(int, sys.argv[1:]) if len(sys.argv) > 1 else DIAS):
        gerar(n, *DIAS[n])
