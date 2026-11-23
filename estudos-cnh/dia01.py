"""Dia 1 — Placas de regulamentação. uso: python3 dia01.py"""
import os
from motor import *

AQUI = os.path.dirname(os.path.abspath(__file__))

def pop(lt, t0=0.0, d=.35): return eout((lt - t0) / d)

def s_abertura(img, d, lt, dur):
    titulo(d, 'DIA 1', 'PLACAS DE REGULAMENTAÇÃO')
    k = [pop(lt, .3 + i * .35) for i in range(3)]
    if k[0] > 0: placa_pare(d, 560, 560, 150 * k[0])
    if k[1] > 0: placa_preferencia(d, 960, 540, 170 * k[1])
    if k[2] > 0: placa_velocidade(d, 1360, 560, 150 * k[2], '60')
    chave(d, 'REGRA = ORDEM', alpha=1 if lt > 2.5 else 0)

def s_formato(img, d, lt, dur):
    titulo(d, 'O FORMATO DA REGRA')
    r = 230 * pop(lt, .2, .5)
    if r > 0: circ_regul(d, 960, 540, r)
    if lt > 1.6: texto(d, (960, 540), 'ORDEM', 70, PRETO)
    chave(d, 'REDONDA + BORDA VERMELHA', alpha=1 if lt > 2.5 else 0)

def s_pare(img, d, lt, dur):
    titulo(d, 'PARADA OBRIGATÓRIA')
    placa_pare(d, 560, 520, 220 * pop(lt, .1))
    # carro chega e PARA na linha
    x = 1650 - 600 * eout(lt / 3.0)
    d.rectangle([1000, 760, 1840, 860], fill=(55, 60, 66))
    d.rectangle([1035, 760, 1050, 860], fill=CREME)  # linha de retenção
    carro(d, x, 800, 1.2)
    chave(d, 'PARAR SEMPRE', alpha=1 if lt > 3.2 else 0)

def s_preferencia(img, d, lt, dur):
    titulo(d, 'DÊ A PREFERÊNCIA')
    placa_preferencia(d, 520, 500, 230 * pop(lt, .1))
    # carro da avenida passa; o nosso espera e depois entra
    d.rectangle([900, 600, 1840, 720], fill=(55, 60, 66)); d.rectangle([1230, 720, 1350, 900], fill=(55, 60, 66))
    carro(d, 900 + (lt * 260) % 1100, 660, .9, (220, 110, 70))
    y = 880 - 60 * eout(lt / 1.5)
    carro(d, 1290, y, .8)
    chave(d, 'REDUZA · OLHE · CEDA A VEZ', alpha=1 if lt > 3 else 0)

def s_pare_x_pref(img, d, lt, dur):
    titulo(d, 'QUAL A DIFERENÇA?')
    placa_pare(d, 620, 470, 190); placa_preferencia(d, 1300, 450, 200)
    texto(d, (620, 760), 'PARA SEMPRE', 54, AMARELO)
    if lt > 2.5: texto(d, (1300, 760), 'PARA SÓ SE PRECISAR', 54, VERDE)

def s_tarja(img, d, lt, dur):
    titulo(d, 'TARJA VERMELHA = PROIBIDO')
    r = 220
    circ_regul(d, 960, 520, r); seta_curva_esq(d, 960, 520, r)
    k = pop(lt, 1.2, .5)
    if k > 0:
        a = math.radians(45); w = r * .16
        x1, y1 = 960 - math.cos(a) * r * .78, 520 - math.sin(a) * r * .78
        d.line([(x1, y1), (x1 + (2 * math.cos(a) * r * .78) * k, y1 + (2 * math.sin(a) * r * .78) * k)], fill=VERM, width=int(w))
    chave(d, 'PROIBIDO VIRAR À ESQUERDA', alpha=1 if lt > 2.2 else 0)

def s_estacionar(img, d, lt, dur):
    titulo(d, 'A LETRA E')
    k = [pop(lt, t) for t in (2.3, 9.3, 15.4)]
    if k[0] > 0: placa_letra(d, 420, 500, 170 * k[0], 'E', 'tarja'); texto(d, (420, 760), 'NÃO ESTACIONE', 44, AMARELO)
    if lt > 6.2: texto(d, (420, 830), 'PARAR RAPIDINHO: PODE', 40, VERDE)
    if k[1] > 0: placa_letra(d, 960, 500, 170 * k[1], 'E', 'x'); texto(d, (960, 760), 'NEM PARAR', 44, (255, 120, 120))
    if k[2] > 0: placa_letra(d, 1500, 500, 170 * k[2], 'E'); texto(d, (1500, 760), 'PODE, COM REGRAS', 44, VERDE)

def s_velocidade(img, d, lt, dur):
    titulo(d, 'VELOCIDADE MÁXIMA')
    placa_velocidade(d, 600, 520, 220 * pop(lt, .1), '60')
    v = int(min(60, 75 * eout(lt / 3)))
    d.rounded_rectangle([1050, 380, 1550, 660], radius=30, fill=(20, 28, 38))
    texto(d, (1300, 490), f'{v}', 150, VERDE if v <= 60 else VERM)
    texto(d, (1300, 600), 'NO SEU PAINEL', 42, CREME)
    chave(d, 'NÚMERO = LIMITE', alpha=1 if lt > 3 else 0)

def s_obrigacao(img, d, lt, dur):
    titulo(d, 'SEM TARJA = OBRIGAÇÃO')
    placa_siga_frente(d, 620, 520, 200 * pop(lt, .1))
    placa_vire_dir(d, 1300, 520, 200 * pop(lt, 1.5))
    chave(d, 'FAÇA O QUE O DESENHO MOSTRA', alpha=1 if lt > 3 else 0)

def s_resumo(img, d, lt, dur):
    titulo(d, 'RESUMO DO DIA 1')
    itens = [(placa_pare, 'PARE: PARE SEMPRE'), (placa_preferencia, 'TRIÂNGULO: CEDA A VEZ'), (None, 'TARJA: PROIBIDO'), (None, 'SEM TARJA: OBRIGAÇÃO')]
    for i, (fn, s) in enumerate(itens):
        if lt < .8 + i * 1.6: continue
        y = 300 + i * 175
        if fn is placa_pare: placa_pare(d, 470, y, 65)
        elif fn is placa_preferencia: placa_preferencia(d, 470, y - 10, 75)
        elif i == 2: circ_regul(d, 470, y, 65); tarja(d, 470, y, 65)
        else: placa_siga_frente(d, 470, y, 65)
        texto(d, (600, y), s, 54, CREME, 'lm')

def q_pare(img, d, lt, dur): placa_pare(d, 960, 560, 230)
def q_letra_x(img, d, lt, dur): placa_letra(d, 960, 560, 230, 'E', 'x')
def q_esquerda(img, d, lt, dur): placa_proib_esquerda(d, 960, 560, 230)
def r_pare(img, d, lt, dur): q_pare(img, d, lt, dur); chave(d, 'PARAR TOTALMENTE, OLHAR, SEGUIR', cor=VERDE, sz=60)
def r_letra_x(img, d, lt, dur): q_letra_x(img, d, lt, dur); chave(d, 'NÃO: NEM PARAR, NEM ESTACIONAR', cor=VERDE, sz=60)
def r_esquerda(img, d, lt, dur): q_esquerda(img, d, lt, dur); chave(d, 'PROIBIÇÃO: TEM TARJA', cor=VERDE, sz=60)

SEG = [
 dict(fala='Olá! Bem-vindo ao Dia 1: placas de regulamentação. São as placas que dão ordens. Desobedecer é infração, com multa e pontos na carteira.', desenho=s_abertura),
 dict(fala='Primeiro, o formato. Quase todas são redondas, fundo branco, borda vermelha e desenho preto. Viu placa redonda com borda vermelha? É ordem, não sugestão.', desenho=s_formato),
 dict(fala='Duas placas fogem desse formato. A primeira é a de Pare: vermelha, com oito lados. Aqui você para o carro por completo, na linha do chão, mesmo com a rua vazia. Parou, olhou, e só então segue. Passar devagar não vale.', desenho=s_pare),
 dict(fala='A segunda é a de Dê a preferência: um triângulo de cabeça para baixo. Quem está na outra via tem a vez. Por exemplo, ao entrar numa avenida, você reduz, olha, e espera os carros passarem. Se não vier ninguém, segue sem parar.', desenho=s_preferencia),
 dict(fala='A diferença: no Pare, você para sempre. No Dê a preferência, só para se precisar.', desenho=s_pare_x_pref),
 dict(fala='Detalhe que cai muito na prova: placa redonda com uma faixa vermelha na diagonal quer dizer proibido. Uma seta para a esquerda com a faixa por cima: proibido virar à esquerda.', desenho=s_tarja),
 dict(fala='Agora a letra E, de estacionamento. E com faixa vermelha: proibido estacionar, mas parar rapidinho para alguém descer, pode. E com um X vermelho: proibido parar e estacionar. Nem para alguém descer. E sem faixa: estacionamento regulamentado. Pode, seguindo as regras da plaquinha de baixo, como o horário.', desenho=s_estacionar, pausa=1.0),
 dict(fala='A placa de velocidade máxima mostra um número, como sessenta. Naquele trecho, você não pode passar de sessenta quilômetros por hora. É o limite, não a velocidade obrigatória.', desenho=s_velocidade),
 dict(fala='E placa redonda sem faixa vermelha é obrigação. Seta para frente: siga em frente. Seta para a direita: vire à direita. Faça o que o desenho mostra.', desenho=s_obrigacao),
 dict(fala='Resumindo. Pare: pare sempre. Triângulo: dê a preferência. Com faixa vermelha: proibido. Sem faixa: obrigação. Agora, três perguntas. Você terá cinco segundos para pensar em cada uma.', desenho=s_resumo, pausa=1.0),
 dict(n=1, pergunta='Pergunta um. Você chega nesta placa, e não vem nenhum carro. O que você deve fazer?', desenho=q_pare,
      resposta='Resposta: parar por completo, olhar, e só depois seguir. No Pare, você para sempre, mesmo com a rua vazia.', desenho_resposta=r_pare),
 dict(n=2, pergunta='Pergunta dois. Nesta placa, com a letra E e um X vermelho, você pode parar rapidinho para um amigo descer do carro?', desenho=q_letra_x,
      resposta='Resposta: não. O E com X quer dizer proibido parar e estacionar. Não pode nem parar para alguém descer.', desenho_resposta=r_letra_x),
 dict(n=3, pergunta='Pergunta três. Esta placa é uma obrigação ou uma proibição?', desenho=q_esquerda,
      resposta='Resposta: proibição, porque tem a faixa vermelha. Proibido virar à esquerda. Muito bem! Até o Dia 2.', desenho_resposta=r_esquerda),
]

if __name__ == '__main__':
    out = os.path.join(AQUI, 'videos', 'dia-01-placas-regulamentacao.mp4')
    total = montar(SEG, out, os.path.join(AQUI, '.cache_voz'))
    print('ok', round(total, 1), 's ->', out)
