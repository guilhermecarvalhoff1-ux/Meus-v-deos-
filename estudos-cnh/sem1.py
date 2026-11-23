"""Semana 1 — Sinalização (Dias 2 a 6). uso: python3 sem1.py [2 3 ...]"""
import sys
from motor import *

PARE_ = P(placa_pare); PREF = P(placa_preferencia); V60 = P(placa_velocidade, '60')
PROIB_ESQ = P(placa_proib_esquerda); SIGA = P(placa_siga_frente)

D2 = [
 C('Olá! Dia 2: placas de advertência. Ontem a gente viu as placas que dão ordens. Hoje são as placas que avisam: tem perigo lá na frente, fique atento.',
   'DIA 2', [adv('curva'), adv('pedestre'), adv('lombada')], 'AVISO DE PERIGO'),
 C('O formato é fácil de lembrar. A placa de advertência é um quadrado em pé, como um losango. Fundo amarelo, borda preta e desenho preto. Viu amarelo em losango? É um aviso.',
   'O FORMATO DO AVISO', [adv('cruz')], 'AMARELO + LOSANGO'),
 C('E o que você faz quando vê um aviso? Tira o pé do acelerador, reduz a velocidade e presta mais atenção. A placa não manda parar. Ela pede cuidado, porque o perigo ainda vai aparecer.',
   'O QUE FAZER?', [adv('curva'), cartao('REDUZA')], 'REDUZA E ATENÇÃO'),
 C('Veja alguns exemplos. Uma seta que entorta: curva à frente. Um desenho de carro com marcas de pneu: pista escorregadia, cuidado na chuva. E uma lombada desenhada: tem saliência, ou quebra-molas, na frente.',
   'EXEMPLOS', [adv('curva'), adv('escorrega'), adv('lombada')], None, ['CURVA', 'ESCORREGADIA', 'LOMBADA']),
 C('Agora as placas com pessoas. Um adulto andando: passagem de pedestres. Um adulto e uma criança: área escolar, crianças por perto. Aqui, a velocidade baixa salva vidas.',
   'PESSOAS NA VIA', [adv('pedestre'), adv('criancas')], 'PEDESTRE = DEVAGAR', ['PEDESTRES', 'ESCOLA']),
 C('Tem placas que avisam de outra placa. Um semáforo desenhado no losango: tem semáforo à frente. E uma placa de Pare dentro do losango: logo ali vai ter uma parada obrigatória. Comece a frear com calma.',
   'AVISO DE SINAL', [adv('semaforo'), adv('pare_frente')], 'SINAL LÁ NA FRENTE', ['SEMÁFORO', 'PARE À FRENTE']),
 C('Duas exceções que caem na prova. A placa de obras é igual, mas com fundo laranja. E a cruz em X, branca, chamada Cruz de Santo André, avisa que tem trilho de trem cruzando a rua. Pare, olhe e escute.',
   'EXCEÇÕES', [adv('obras', LARANJA), cruz_santo_andre], None, ['OBRAS: LARANJA', 'X: TREM']),
 C('Resumindo. Amarelo em losango: aviso de perigo. O que fazer: reduzir e prestar atenção. Laranja: obras. X branco: passagem de trem. Agora, três perguntas. Cinco segundos para pensar em cada uma.',
   'RESUMO DO DIA 2', [adv('curva'), adv('obras', LARANJA), cruz_santo_andre], 'AMARELO = ATENÇÃO', pausa=1.0),
 Q(1, 'Pergunta um. Qual é o formato e a cor das placas de advertência?', [adv('pedestre')],
   'Resposta: losango, quadrado em pé, com fundo amarelo e desenho preto.', 'LOSANGO AMARELO'),
 Q(2, 'Pergunta dois. Você vê esta placa. O que deve fazer?', [adv('escorrega')],
   'Resposta: reduzir a velocidade e ter cuidado, porque a pista pode ficar escorregadia.', 'REDUZIR: PISTA ESCORREGADIA'),
 Q(3, 'Pergunta três. O que este X branco avisa?', [cruz_santo_andre],
   'Resposta: passagem de trem, sem cancela. Pare, olhe e escute antes de atravessar. Até o Dia 3!', 'TRILHO DE TREM'),
]

D3 = [
 C('Olá! Dia 3: placas de indicação. Elas não mandam e nem avisam perigo. Elas informam: para onde ir, quanto falta, e onde tem um serviço, como hospital ou posto.',
   'DIA 3', [ind(['SANTOS', '72 km']), servico('H')], 'PLACAS QUE INFORMAM'),
 C('O formato delas é quase sempre um retângulo. E o que muda é a cor. Cada cor tem um assunto. Vamos ver uma por uma.',
   'RETÂNGULO', [ind(['CENTRO'], AZUL_PLACA, True)], 'COR = ASSUNTO'),
 C('Verde é usada nas estradas. Ela mostra o nome da cidade e quantos quilômetros faltam. Por exemplo: Santos, setenta e dois quilômetros. Ela ajuda você a não se perder na viagem.',
   'VERDE: ESTRADA', [ind(['SANTOS', '72 km']), ind(['CAMPINAS'], VERDE_PLACA, True)], 'DIREÇÃO NA ESTRADA'),
 C('Azul é usada dentro da cidade, para mostrar direção, como Centro ou Aeroporto. E a azul com um quadrinho branco mostra um serviço: H é hospital, a bomba é posto de combustível, o telefone é telefone.',
   'AZUL: CIDADE E SERVIÇOS', [ind(['CENTRO'], AZUL_PLACA, True), servico('H'), servico('bomba')], None, ['DIREÇÃO', 'HOSPITAL', 'POSTO']),
 C('Marrom é turismo e lazer. Mostra um parque, uma praia, um museu, uma igreja histórica. Se você está passeando, siga a marrom.',
   'MARROM: TURISMO', [ind(['PARQUE', 'ESTADUAL'], MARROM)], 'MARROM = PASSEIO'),
 C('E tem a placa educativa: fundo branco com letras pretas. Ela dá um conselho, como: use o cinto, ou: não jogue lixo na estrada. Ela educa, não é uma ordem com desenho.',
   'BRANCA: EDUCATIVA', [ind(['USE O', 'CINTO'], (235, 232, 222))], 'CONSELHO'),
 C('Resumindo. Verde: direção na estrada. Azul: direção na cidade e serviços. Marrom: turismo. Branca: educativa. Agora, três perguntas. Pense cinco segundos em cada.',
   'RESUMO DO DIA 3', [ind(['SANTOS'], VERDE_PLACA), ind(['CENTRO'], AZUL_PLACA), ind(['PARQUE'], MARROM)], 'VERDE · AZUL · MARROM', pausa=1.0),
 Q(1, 'Pergunta um. Você está na estrada e quer saber quanto falta para a cidade. Qual a cor da placa que mostra isso?', [ind(['?', '72 km'], CINZA)],
   'Resposta: verde. Na estrada, a placa verde mostra a cidade e a distância.', 'VERDE'),
 Q(2, 'Pergunta dois. O que esta placa azul indica?', [servico('H')],
   'Resposta: hospital. Placa azul com quadro branco é serviço.', 'HOSPITAL'),
 Q(3, 'Pergunta três. Placa marrom informa sobre o quê?', [ind(['?'], MARROM)],
   'Resposta: turismo e lazer, como parques e praias. Até o Dia 4!', 'TURISMO'),
]

D4 = [
 C('Olá! Dia 4: semáforos e agentes de trânsito. Hoje você vai aprender o que cada luz quer dizer, e quem manda mais quando os sinais não combinam.',
   'DIA 4', [semaforo('vermelho'), agente('cima')], 'LUZES E GESTOS'),
 C('Vermelho: pare antes da faixa, e espere. Passar no vermelho é infração gravíssima, sete pontos na carteira. Mesmo de madrugada, a regra é a mesma.',
   'VERMELHO', [semaforo('vermelho'), cartao('7 PTS', VERM, 'GRAVÍSSIMA')], 'PARE'),
 C('Amarelo: atenção, o vermelho vai chegar. Se der para parar com segurança, pare. Só continue se já estiver tão perto que frear seria perigoso. Amarelo não é para acelerar!',
   'AMARELO', [semaforo('amarelo')], 'PARE SE PUDER'),
 C('Verde: pode seguir, mas olhando. Se tiver pedestre ainda atravessando, ele tem a vez. E o amarelo piscando, sem parar, quer dizer: atenção, o semáforo está desligado. Siga as placas e passe com muito cuidado.',
   'VERDE E PISCA-PISCA', [semaforo('verde'), semaforo('amarelo', True)], None, ['SIGA COM CUIDADO', 'PISCANDO: ATENÇÃO']),
 C('O agente de trânsito também dá ordens com o corpo. Braço levantado, bem para cima: todos os veículos devem parar. Braços abertos para os lados: param os carros que vêm de frente e de trás dele.',
   'GESTOS DO AGENTE', [agente('cima'), agente('lados')], None, ['TODOS PARAM', 'FRENTE E TRÁS PARAM']),
 C('O agente usa também o apito. Um silvo curto: siga. Dois silvos curtos: pare. Um silvo longo: diminua a velocidade.',
   'O APITO', [cartao('1 CURTO', VERDE), cartao('2 CURTOS', VERM), cartao('1 LONGO', AMARELO)], None, ['SIGA', 'PARE', 'DEVAGAR']),
 C('E agora a regra mais importante do dia. Quem manda mais? Primeiro, o agente. Depois, o semáforo. Depois, as placas. Por exemplo: o semáforo está verde, mas o agente manda parar. Você para, porque o agente vale mais.',
   'QUEM MANDA MAIS?', [agente('cima'), semaforo('verde'), PARE_], '1 AGENTE · 2 SEMÁFORO · 3 PLACA', ['1º', '2º', '3º']),
 C('Resumindo. Vermelho: pare. Amarelo: pare se puder. Verde: siga com cuidado. E o agente manda mais que o semáforo, que manda mais que a placa. Agora, três perguntas.',
   'RESUMO DO DIA 4', [semaforo('vermelho'), semaforo('amarelo'), semaforo('verde')], 'AGENTE MANDA MAIS', pausa=1.0),
 Q(1, 'Pergunta um. O semáforo está verde, mas o agente levanta o braço. O que você faz?', [semaforo('verde'), agente('cima')],
   'Resposta: para. A ordem do agente vale mais que o semáforo.', 'PARA: O AGENTE MANDA MAIS'),
 Q(2, 'Pergunta dois. O que o amarelo quer dizer?', [semaforo('amarelo')],
   'Resposta: atenção, vai fechar. Pare, se der para parar com segurança.', 'PARE SE PUDER'),
 Q(3, 'Pergunta três. O agente dá dois silvos curtos no apito. O que isso quer dizer?', [cartao('2 CURTOS')],
   'Resposta: pare. Um curto é siga, dois curtos é pare, e um longo é diminua. Até o Dia 5!', 'PARE'),
]

D5 = [
 C('Olá! Dia 5: sinalização horizontal. São as marcas pintadas no chão: linhas, faixas e desenhos. Elas também são regras, e caem muito na prova.',
   'DIA 5', [pista('tracejada'), faixa_pedestre], 'O QUE ESTÁ NO CHÃO'),
 C('Primeiro, a cor. Linha amarela separa carros que andam em sentidos opostos, um indo e outro vindo. Linha branca separa carros no mesmo sentido, e também marca as bordas da pista.',
   'AMARELA OU BRANCA?', [pista('tracejada'), pista('tracejada', CREME)], None, ['AMARELA: VAI E VEM', 'BRANCA: MESMO SENTIDO']),
 C('Agora, o tipo de linha. Linha contínua, sem buracos, quer dizer: não pode ultrapassar, nem mudar de faixa. Linha tracejada, com pedaços, quer dizer: pode ultrapassar, se for seguro.',
   'CONTÍNUA OU TRACEJADA?', [pista('continua'), pista('tracejada')], None, ['NÃO PODE', 'PODE']),
 C('E quando tem duas linhas juntas, uma contínua e uma tracejada? Vale a linha que está do seu lado. Se a tracejada está do seu lado, você pode passar. Se a contínua está do seu lado, não pode.',
   'DUAS LINHAS JUNTAS', [pista('mista')], 'VALE A DO SEU LADO'),
 C('Duas linhas amarelas contínuas: ninguém ultrapassa, nem de um lado, nem do outro. Isso aparece em curvas e lugares perigosos.',
   'DUPLA CONTÍNUA', [pista('dupla')], 'NINGUÉM ULTRAPASSA'),
 C('A faixa de pedestres são as listras brancas no chão. O pedestre que está atravessando tem a vez. E a linha branca grossa antes dela é a linha de retenção: é ali que o carro para no sinal vermelho.',
   'FAIXA DE PEDESTRES', [faixa_pedestre], 'PEDESTRE TEM A VEZ'),
 C('Resumindo. Amarela: sentidos opostos. Branca: mesmo sentido. Contínua: não pode passar. Tracejada: pode, com segurança. Duas linhas juntas: vale a do seu lado. Agora, três perguntas.',
   'RESUMO DO DIA 5', [pista('continua'), pista('tracejada'), pista('mista')], 'CONTÍNUA = NÃO PASSA', pausa=1.0),
 Q(1, 'Pergunta um. Nesta rua, a linha amarela do meio é contínua. Pode ultrapassar?', [pista('continua')],
   'Resposta: não. Linha contínua proíbe ultrapassar.', 'NÃO PODE'),
 Q(2, 'Pergunta dois. A linha do meio é branca. Os carros andam no mesmo sentido, ou em sentidos opostos?', [pista('tracejada', CREME)],
   'Resposta: no mesmo sentido. Branca separa o mesmo sentido. Amarela separa sentidos opostos.', 'MESMO SENTIDO'),
 Q(3, 'Pergunta três. Tem uma linha contínua e uma tracejada juntas. A tracejada está do seu lado. Pode ultrapassar?', [pista('mista')],
   'Resposta: sim, com segurança. Vale a linha do seu lado. Até o Dia 6!', 'SIM: VALE A DO SEU LADO'),
]

D6 = [
 C('Olá! Dia 6: revisão da semana. Você aprendeu muita coisa sobre sinalização. Hoje a gente relembra rápido, e depois faz cinco perguntas.',
   'DIA 6 · REVISÃO', [PARE_, adv('curva'), ind(['SANTOS'])], 'SINALIZAÇÃO'),
 C('As placas pelo formato e cor. Redonda com borda vermelha: ordem. Losango amarelo: aviso de perigo. Retângulo colorido: informação.',
   'FORMATO E COR', [SIGA, adv('curva'), ind(['CENTRO'], AZUL_PLACA)], None, ['ORDEM', 'AVISO', 'INFORMAÇÃO']),
 C('Nas placas redondas: faixa vermelha na diagonal é proibido. Pare: para sempre. Triângulo de cabeça para baixo: dê a preferência.',
   'PLACAS DE ORDEM', [PROIB_ESQ, PARE_, PREF], None, ['PROIBIDO', 'PARE SEMPRE', 'CEDA A VEZ']),
 C('Semáforo e agente: o agente manda mais, depois o semáforo, depois a placa. E no chão: linha contínua, não passa. Tracejada, pode passar com segurança.',
   'QUEM MANDA E O CHÃO', [agente('cima'), semaforo('verde'), pista('continua')], 'AGENTE MANDA MAIS'),
 C('Agora, cinco perguntas. Você tem cinco segundos para pensar em cada uma.', 'HORA DO QUIZ', [cartao('5 PERGUNTAS')], pausa=.6),
 Q(1, 'Pergunta um. Que tipo de placa é esta?', [adv('lombada')], 'Resposta: advertência. Avisa que tem lombada à frente.', 'ADVERTÊNCIA: LOMBADA'),
 Q(2, 'Pergunta dois. Esta placa manda ou proíbe?', [SIGA], 'Resposta: manda. Sem faixa vermelha, é obrigação: siga em frente.', 'OBRIGAÇÃO: SIGA EM FRENTE'),
 Q(3, 'Pergunta três. Placa azul com H. O que é?', [servico('H')], 'Resposta: hospital. É uma placa de indicação de serviço.', 'HOSPITAL'),
 Q(4, 'Pergunta quatro. O agente manda seguir, mas o semáforo está vermelho. Quem você obedece?', [agente('lados'), semaforo('vermelho')],
   'Resposta: o agente. A ordem dele vale mais que o semáforo.', 'O AGENTE'),
 Q(5, 'Pergunta cinco. Duas linhas amarelas contínuas no meio. Alguém pode ultrapassar?', [pista('dupla')],
   'Resposta: não. Ninguém ultrapassa, dos dois lados. Parabéns pela semana! Amanhã é dia de descanso.', 'NINGUÉM ULTRAPASSA'),
]

DIAS = {2: ('placas-advertencia', D2), 3: ('placas-indicacao', D3), 4: ('semaforos-e-agentes', D4), 5: ('sinalizacao-horizontal', D5), 6: ('revisao-sinalizacao', D6)}

if __name__ == '__main__':
    for n in (map(int, sys.argv[1:]) if len(sys.argv) > 1 else DIAS):
        gerar(n, *DIAS[n])
