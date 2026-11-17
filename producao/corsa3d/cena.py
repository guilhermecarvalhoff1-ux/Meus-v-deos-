# O Corsa do Avô — Ep1 — prévia 3D (posto à noite). Rodar com o Python do bpy:
#   python cena.py <pasta_saida> [quadros...]   (sem quadros = renderiza tudo)
import bpy, math, random, sys, os, time
from mathutils import Vector, Euler

OUT = sys.argv[1] if len(sys.argv) > 1 else 'frames'
ONLY = [int(a) for a in sys.argv[2:]]
FPS, N = 30, 300
RES = (576, 1024)
random.seed(7)

bpy.ops.wm.read_factory_settings(use_empty=True)
S = bpy.context.scene
S.render.engine = 'CYCLES'
S.cycles.device = 'CPU'
S.cycles.samples = 14
S.cycles.adaptive_threshold = .05
S.cycles.use_denoising = True
S.cycles.max_bounces = 4
S.cycles.diffuse_bounces = 2
S.cycles.glossy_bounces = 2
S.cycles.transmission_bounces = 2
S.cycles.volume_bounces = 0
S.render.resolution_x, S.render.resolution_y = RES
S.render.fps = FPS
S.frame_start, S.frame_end = 1, N
S.render.image_settings.file_format = 'PNG'
try:
    S.view_settings.view_transform = 'AgX'
    S.view_settings.look = 'AgX - Medium High Contrast'
except Exception:
    pass
S.view_settings.exposure = -0.2

# ---------------- materiais ----------------
MATS = {}
def mat(name, col, rough=.85, emit=None, estr=0.0, grain=.10, metal=0.0):
    if name in MATS: return MATS[name]
    m = bpy.data.materials.new(name); m.use_nodes = True
    nt = m.node_tree; b = nt.nodes['Principled BSDF']
    b.inputs['Roughness'].default_value = rough
    b.inputs['Metallic'].default_value = metal
    c = (*col, 1)
    if grain:
        # textura de "papel": ruído fino que varia levemente a cor
        tex = nt.nodes.new('ShaderNodeTexNoise'); tex.inputs['Scale'].default_value = 60; tex.inputs['Detail'].default_value = 6
        ramp = nt.nodes.new('ShaderNodeValToRGB')
        ramp.color_ramp.elements[0].color = tuple(max(0, v * (1 - grain)) for v in col) + (1,)
        ramp.color_ramp.elements[1].color = tuple(min(1, v * (1 + grain)) for v in col) + (1,)
        nt.links.new(tex.outputs['Fac'], ramp.inputs['Fac']); nt.links.new(ramp.outputs['Color'], b.inputs['Base Color'])
    else:
        b.inputs['Base Color'].default_value = c
    if emit:
        b.inputs['Emission Color'].default_value = (*emit, 1)
        b.inputs['Emission Strength'].default_value = estr
    out = nt.nodes['Material Output']
    cam = nt.nodes.new('ShaderNodeCameraData')
    mr = nt.nodes.new('ShaderNodeMapRange'); mr.inputs['From Min'].default_value = 6; mr.inputs['From Max'].default_value = 70
    mr.inputs['To Min'].default_value = 0; mr.inputs['To Max'].default_value = .75
    em = nt.nodes.new('ShaderNodeEmission'); em.inputs['Color'].default_value = (.07, .09, .17, 1); em.inputs['Strength'].default_value = 1
    mix = nt.nodes.new('ShaderNodeMixShader')
    nt.links.new(cam.outputs['View Distance'], mr.inputs['Value']); nt.links.new(mr.outputs['Result'], mix.inputs['Fac'])
    nt.links.new(b.outputs['BSDF'], mix.inputs[1]); nt.links.new(em.outputs['Emission'], mix.inputs[2])
    nt.links.new(mix.outputs['Shader'], out.inputs['Surface'])
    MATS[name] = m
    return m

def obj(o, m=None, bevel=0.0, smooth=False):
    if m: o.data.materials.append(m)
    if bevel:
        bm = o.modifiers.new('bev', 'BEVEL'); bm.width = bevel; bm.segments = 3
    if smooth:
        for p in o.data.polygons: p.use_smooth = True
    return o

def box(name, loc, size, m=None, bevel=0.0, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    o = bpy.context.object; o.name = name; o.scale = size
    bpy.ops.object.transform_apply(scale=True)
    return obj(o, m, bevel)

def cyl(name, loc, r, h, m=None, rot=(0, 0, 0), verts=32, bevel=0.0):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=h, location=loc, rotation=rot, vertices=verts)
    o = bpy.context.object; o.name = name
    return obj(o, m, bevel, smooth=True)

def sph(name, loc, r, m=None, scale=(1, 1, 1)):
    bpy.ops.mesh.primitive_uv_sphere_add(radius=r, location=loc, segments=24, ring_count=12)
    o = bpy.context.object; o.name = name; o.scale = scale
    return obj(o, m, smooth=True)

def parent(children, p):
    for c in children:
        c.parent = p
        c.matrix_parent_inverse = p.matrix_world.inverted()

def text(body, loc, size, m, rot=(math.pi / 2, 0, 0), align='CENTER'):
    cu = bpy.data.curves.new('t', 'FONT'); cu.body = body; cu.size = size; cu.align_x = align; cu.extrude = .02
    o = bpy.data.objects.new('txt', cu); S.collection.objects.link(o)
    o.location = loc; o.rotation_euler = rot; o.data.materials.append(m)
    return o

# ---------------- mundo ----------------
w = bpy.data.worlds.new('noite'); S.world = w; w.use_nodes = True
bg = w.node_tree.nodes['Background']; bg.inputs['Color'].default_value = (.010, .016, .045, 1); bg.inputs['Strength'].default_value = 1.0

CONC = mat('concreto', (.30, .31, .34), grain=.18)
ASF = mat('asfalto', (.05, .055, .07), grain=.25)
CALC = mat('calcada', (.22, .22, .24), grain=.15)
box('chao_posto', (0, 3, -.05), (26, 18, .1), CONC)
box('rua', (0, -9, -.06), (120, 9, .1), ASF)
box('calcada', (0, -13.9, .02), (120, 1.8, .16), CALC)
box('calcada2a', (-41, -4.4, .02), (58, .6, .14), CALC)
box('calcada2b', (33, -4.4, .02), (62, .6, .14), CALC)
box('chao_fundo', (0, 30, -.07), (140, 40, .1), mat('grama', (.03, .06, .04), grain=.3))
# faixas da rua
FX = mat('faixa', (.8, .78, .7))
for x in range(-60, 60, 6):
    box('fx', (x, -9, .0), (3, .18, .01), FX)
# manchas de óleo
OL = mat('oleo', (.12, .12, .14), rough=.35)
for _ in range(14):
    o = cyl('oleo', (random.uniform(-6, 6), random.uniform(0, 7), .005), random.uniform(.3, .8), .01, OL)

# ---------------- posto ----------------
TETO = mat('teto', (.42, .44, .48), grain=.08)
LED = mat('led', (1, 1, 1), emit=(.92, .97, 1), estr=9, grain=0)
VERM = mat('vermelho', (.55, .06, .06))
box('cobertura', (0, 3.5, 5.0), (13, 9, .9), TETO, bevel=.05)
box('led_frente', (0, -1.0, 4.95), (13.05, .06, .25), LED)
box('led_tras', (0, 8.0, 4.95), (13.05, .06, .25), LED)
box('led_e', (-6.52, 3.5, 4.95), (.06, 9.05, .25), LED)
box('led_d', (6.52, 3.5, 4.95), (.06, 9.05, .25), LED)
box('teto_luz', (0, 3.5, 4.54), (12.4, 8.4, .02), mat('teto_luz', (1, 1, 1), emit=(1, 1, .97), estr=.6, grain=0))
for x in (-3.2, 3.2):
    for y in (1.2, 5.8):
        cyl('pilar', (x, y, 2.3), .22, 4.6, mat('pilar', (.75, .76, .8), grain=.05))
ilha = box('ilha', (0, 3.5, .1), (1.2, 6.5, .2), CALC, bevel=.04)
BOMBA = mat('bomba', (.62, .64, .7), grain=.08)
TELA = mat('tela', (.1, .3, .2), emit=(.3, 1, .6), estr=2, grain=0)
for y in (2.0, 5.0):
    box('bomba', (0, y, 1.05), (.7, .9, 1.9), BOMBA, bevel=.06)
    box('topo', (0, y, 2.05), (.75, .95, .2), VERM, bevel=.03)
    for sx in (-1, 1):
        box('tela', (sx * .36, y, 1.45), (.02, .5, .3), TELA)
        cyl('mangueira', (sx * .42, y + .25, .8), .04, 1.1, mat('borracha', (.03, .03, .03), rough=.5))
# loja de conveniência
box('loja', (8.5, 10, 1.7), (7, 5, 3.4), mat('loja', (.36, .34, .38)), bevel=.04)
box('loja_vidro', (8.5, 7.48, 1.3), (5, .04, 1.9), mat('vitrine', (1, .85, .6), emit=(1, .82, .55), estr=3, grain=0))
box('loja_faixa', (8.5, 7.46, 2.9), (7, .05, .5), mat('faixa_loja', (.9, .1, .1), emit=(1, .15, .1), estr=1.5, grain=0))
# placa de preço
PRE = mat('placa', (.04, .045, .06))
AM = mat('amarelo', (1, .77, .14), emit=(1, .72, .1), estr=5, grain=0)
cyl('poste_placa', (-8.5, -2.6, 2.4), .12, 4.8, mat('pilar', (.75, .76, .8)))
box('placa', (-8.5, -2.6, 5.4), (2.2, .25, 2.6), PRE, bevel=.05)
for (dx, dz, sx, sz) in [(0, 1.3, 2.25, .08), (0, -1.3, 2.25, .08), (-1.12, 0, .08, 2.65), (1.12, 0, .08, 2.65)]:
    box('borda', (-8.5 + dx, -2.75, 5.4 + dz), (sx, .05, sz), AM)
BR = mat('branco_txt', (1, 1, 1), emit=(1, 1, 1), estr=3, grain=0)
text('GASOLINA', (-8.5, -2.76, 6.05), .38, BR)
text('6,29', (-8.5, -2.76, 4.85), .95, AM)

# ---------------- bairro ao fundo ----------------
PRED = [mat('pred%d' % i, c) for i, c in enumerate([(.10, .11, .16), (.13, .12, .16), (.09, .10, .13), (.15, .14, .17)])]
JAN = mat('janela', (1, .8, .45), emit=(1, .75, .4), estr=6, grain=0)
JAN_D = mat('janela_apagada', (.05, .06, .09), rough=.4, grain=0)
for row, (y0, hmin, hmax) in enumerate([(17, 4, 9), (26, 8, 18), (38, 12, 26)]):
    x = -40
    while x < 40:
        wd = random.uniform(5, 9); h = random.uniform(hmin, hmax); d = random.uniform(5, 8)
        box('pred', (x + wd / 2, y0 + d / 2, h / 2), (wd, d, h), random.choice(PRED))
        for fz in range(1, int(h / 2.6)):
            for fx in range(int(wd / 2.2)):
                if random.random() < .45:
                    box('jan', (x + 1.1 + fx * 2.2, y0 - .02, fz * 2.6), (1.0, .05, 1.2), JAN if random.random() < .35 else JAN_D)
        x += wd + random.uniform(.5, 2.5)
ARV = mat('arvore', (.03, .09, .05), grain=.3)
TRONCO = mat('tronco', (.12, .08, .05))
for _ in range(26):
    x = random.uniform(-30, 30); y = random.uniform(13, 16)
    if abs(x - 8.5) < 5: continue
    h = random.uniform(3, 6)
    cyl('tronco', (x, y, .6), .15, 1.2, TRONCO)
    bpy.ops.mesh.primitive_cone_add(radius1=random.uniform(1, 1.6), depth=h, location=(x, y, 1.0 + h / 2), vertices=12)
    obj(bpy.context.object, ARV, smooth=True)

# postes de rua (luz laranja)
LAMP = mat('lampada', (1, .6, .25), emit=(1, .55, .2), estr=25, grain=0)
POSTE = mat('poste', (.15, .15, .17))
for x in (-22, -11, 0, 11, 22):
    cyl('poste', (x, -14.3, 3.5), .1, 7, POSTE)
    box('braco', (x, -13.6, 6.95), (.12, 1.5, .12), POSTE)
    box('luminaria', (x, -12.9, 6.85), (.5, .8, .18), LAMP)
    bpy.ops.object.light_add(type='SPOT', location=(x, -12.9, 6.7))
    L = bpy.context.object; L.data.energy = 1800; L.data.color = (1, .55, .22); L.data.spot_size = math.radians(95); L.data.spot_blend = .8
    L.data.shadow_soft_size = .3

# luzes do posto e da cena
bpy.ops.object.light_add(type='AREA', location=(0, 3.5, 4.4))
L = bpy.context.object; L.data.shape = 'RECTANGLE'; L.data.size = 11; L.data.size_y = 7.5; L.data.energy = 1400; L.data.color = (.93, .97, 1)
bpy.ops.object.light_add(type='SUN', rotation=(math.radians(50), 0, math.radians(-30)))
L = bpy.context.object; L.data.energy = .35; L.data.color = (.55, .65, 1)

# ---------------- o Corsa ----------------
def corsa():
    root = bpy.data.objects.new('corsa', None); S.collection.objects.link(root)
    PRATA = mat('prata', (.40, .42, .45), rough=.45, grain=.14, metal=.2)
    VIDRO = mat('vidro', (.04, .06, .09), rough=.15, grain=0)
    PRETO = mat('plastico', (.04, .04, .045), rough=.7)
    PNEU = mat('pneu', (.025, .025, .03), rough=.9, grain=.05)
    CALOTA = mat('calota', (.45, .46, .5), rough=.4)
    parts = []
    # corpo baixo (frente aponta +X)
    parts.append(box('c_corpo', (0, 0, .62), (3.75, 1.62, .62), PRATA, bevel=.16))
    # cabine: trapézio (para-brisa inclinado na frente, tampa traseira quase reta)
    import bmesh
    me = bpy.data.meshes.new('cab'); bm = bmesh.new()
    vs_ = [(-1.70, -.76, .92), (.70, -.76, .92), (.70, .76, .92), (-1.70, .76, .92),
           (-1.55, -.66, 1.52), (-.05, -.66, 1.55), (-.05, .66, 1.55), (-1.55, .66, 1.52)]
    V = [bm.verts.new(v) for v in vs_]
    for f in [(0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)]:
        bm.faces.new([V[i] for i in f])
    bm.to_mesh(me); bm.free()
    cab = bpy.data.objects.new('c_cabine', me); S.collection.objects.link(cab); obj(cab, VIDRO, bevel=.05); parts.append(cab)
    # teto e colunas em prata
    parts.append(box('c_teto', (-.8, 0, 1.56), (1.55, 1.36, .07), PRATA, bevel=.03))
    for y in (-.71, .71):
        parts.append(box('c_colB', (-.65, y, 1.23), (.12, .05, .62), PRATA))
    # para-choques, grade, placa
    parts.append(box('c_pchoque_f', (1.86, 0, .42), (.14, 1.66, .26), PRETO, bevel=.06))
    parts.append(box('c_pchoque_t', (-1.86, 0, .42), (.14, 1.66, .26), PRETO, bevel=.06))
    parts.append(box('c_grade', (1.875, 0, .7), (.04, .7, .14), PRETO))
    parts.append(box('c_placa', (1.95, 0, .42), (.03, .52, .15), mat('placa_c', (.85, .85, .82), grain=.05)))
    # faróis (um forte, um fraco)
    fa = box('c_farol_bom', (1.86, -.55, .74), (.06, .38, .18), mat('farol_bom', (1, .95, .8), emit=(1, .93, .75), estr=30, grain=0), bevel=.03)
    ff = box('c_farol_fraco', (1.86, .55, .74), (.06, .38, .18), mat('farol_fraco', (.8, .7, .4), emit=(1, .75, .35), estr=3, grain=0), bevel=.03)
    parts += [fa, ff]
    for y in (-.6, .6):
        parts.append(box('c_lanterna', (-1.88, y, .78), (.04, .3, .2), mat('lanterna', (.6, .05, .05), emit=(1, .05, .03), estr=2, grain=0)))
    # retrovisores (o do lado direito caído)
    parts.append(box('c_retro_e', (.55, -.9, 1.0), (.12, .2, .14), PRETO, rot=(0, 0, 0)))
    parts.append(box('c_retro_d', (.55, .92, .88), (.12, .2, .14), PRETO, rot=(math.radians(35), 0, 0)))
    # rodas
    wheels = []
    for x in (1.2, -1.22):
        for y in (-.78, .78):
            p = cyl('c_pneu', (x, y, .33), .33, .22, PNEU, rot=(math.pi / 2, 0, 0))
            c = cyl('c_calota', (x, y + (.115 if y > 0 else -.115), .33), .19, .02, CALOTA, rot=(math.pi / 2, 0, 0))
            parts += [p, c]; wheels += [p, c]
    # terço no retrovisor interno
    TERCO = mat('terco', (.35, .2, .1), rough=.6)
    for i in range(9):
        a = i / 8 * math.pi
        parts.append(sph('conta', (.35, math.cos(a) * .07, 1.38 - math.sin(a) * .16), .018, TERCO))
    parts.append(box('cruz', (.35, 0, 1.17), (.01, .03, .07), TERCO))
    # motorista (Lucas) dentro, silhueta com moletom azul
    parts.append(sph('lucas_cab', (-.35, -.35, 1.32), .17, mat('pele', (.62, .40, .26)), scale=(1, 1, 1.15)))
    parts.append(sph('lucas_cabelo', (-.37, -.35, 1.44), .16, mat('cabelo', (.08, .05, .03)), scale=(1.05, 1.05, .6)))
    parts.append(box('lucas_tronco', (-.45, -.35, 1.0), (.3, .45, .5), mat('moletom', (.12, .2, .38)), bevel=.08))
    parent(parts, root)
    # luzes dos faróis
    lights = []
    for (y, e) in ((-.55, 900), (.55, 120)):
        bpy.ops.object.light_add(type='SPOT', location=(1.95, y, .74), rotation=(0, math.radians(95), 0))
        L = bpy.context.object; L.data.energy = e; L.data.color = (1, .9, .7); L.data.spot_size = math.radians(55); L.data.spot_blend = .6
        L.parent = root; lights.append(L)
    return root, ff, lights[1]
car, farol_fraco, luz_fraca = corsa()

# ---------------- o frentista ----------------
def frentista(loc, rotz):
    root = bpy.data.objects.new('frentista', None); S.collection.objects.link(root)
    AZ = mat('uniforme', (.10, .22, .48)); AZE = mat('uniforme_esc', (.06, .13, .30))
    PELE = mat('pele_f', (.60, .38, .24)); PRETO = mat('olho', (.02, .02, .02), rough=.3, grain=0)
    BIG = mat('bigode', (.06, .04, .03), grain=.1)
    p = []
    for y in (-.13, .13):
        p.append(cyl('perna', (0, y, .45), .1, .9, AZE))
        p.append(box('sapato', (.05, y, .05), (.3, .14, .1), PRETO, bevel=.03))
    p.append(box('tronco', (0, 0, 1.22), (.34, .56, .72), AZ, bevel=.12))
    p.append(box('gola', (.15, 0, 1.55), (.06, .3, .08), AZE))
    p.append(cyl('pescoco', (0, 0, 1.62), .08, .12, PELE))
    head = cyl('cabeca', (0, 0, 1.86), .21, .40, PELE, verts=40, bevel=.06)
    p.append(head)
    # boné
    p.append(sph('bone', (0, 0, 2.04), .215, AZ, scale=(1, 1, .55)))
    p.append(box('aba', (.24, 0, 2.02), (.22, .36, .03), AZ, bevel=.01))
    # olhos apertados (segurando o riso), sobrancelhas, bigode, bochechas
    for y in (-.08, .08):
        p.append(box('olho', (.205, y, 1.92), (.02, .08, .018), PRETO, rot=(math.radians(-12 if y < 0 else 12), 0, 0)))
        p.append(box('sobr', (.205, y, 1.99), (.02, .09, .022), BIG, rot=(math.radians(10 if y < 0 else -10), 0, 0)))
        p.append(sph('boch', (.17, y * 1.7, 1.80), .065, mat('boch', (.75, .35, .25)), scale=(.6, 1, .8)))
    p.append(sph('bigode', (.215, 0, 1.79), .1, BIG, scale=(.35, 1.25, .38)))
    p.append(box('boca', (.21, 0, 1.73), (.01, .06, .012), PRETO))
    # braços segurando o bico da bomba
    def limb(a, b, r, m):
        a, b = Vector(a), Vector(b); d = b - a
        o = cyl('membro', (a + b) / 2, r, d.length, m)
        o.rotation_euler = d.to_track_quat('Z', 'Y').to_euler(); return o
    for y, hand in ((-.33, (.30, -.10, 1.08)), (.33, (.30, .12, 1.16))):
        p.append(limb((0, y, 1.48), (.12, y * 1.1, 1.12), .075, AZ))
        p.append(limb((.12, y * 1.1, 1.12), hand, .07, AZ))
        p.append(sph('mao', hand, .075, PELE))
    p.append(box('bico', (.36, 0, 1.08), (.08, .26, .08), mat('bico', (.05, .05, .05)), rot=(math.radians(-25), 0, 0)))
    p.append(box('bico_cano', (.40, .16, 1.17), (.05, .18, .04), mat('cano', (.5, .5, .52)), rot=(math.radians(25), 0, 0)))
    parent(p, root)
    root.location = loc; root.rotation_euler = (0, 0, rotz)
    return root, head
frent, fhead = frentista((-2.5, 4.6, 0), 0.0)

# ---------------- animação do carro ----------------
def car_path(u):
    """u 0..1 → posição e direção. Vem pela rua (+X) e vira para a bomba (+Y)."""
    # reta: (-26,-9) -> (-8,-9); curva de raio 5 centro (-8,-4) -> (-3,-4); reta até (-3, 3.3)
    L1, L2, L3 = 18.5, math.pi / 2 * 5, 7.3
    s = u * (L1 + L2 + L3)
    if s < L1:
        return Vector((-28 + s, -9, 0)), 0.0
    s -= L1
    if s < L2:
        a = s / 5
        return Vector((-9.5 + 5 * math.sin(a), -4 - 5 * math.cos(a), 0)), a
    s -= L2
    return Vector((-4.5, -4 + s, 0)), math.pi / 2

CAR_T0, CAR_T1 = 3.0, 7.4
for f in range(1, N + 1):
    t = (f - 1) / FPS
    k = min(max((t - CAR_T0) / (CAR_T1 - CAR_T0), 0), 1)
    u = 1 - (1 - k) ** 2.2
    pos, h = car_path(u)
    car.location = pos + Vector((0, 0, .02 * math.sin(t * 22) * (1 - u * .7)))
    car.rotation_euler = (0, 0, h)
    car.keyframe_insert('location', frame=f); car.keyframe_insert('rotation_euler', frame=f)
    # farol fraco piscando
    fl = .25 + .75 * (1 if math.sin(t * 31) * math.sin(t * 7.3) > -.2 else .15)
    nd = farol_fraco.data.materials[0].node_tree.nodes['Principled BSDF'].inputs['Emission Strength']
    nd.default_value = 3 * fl; nd.keyframe_insert('default_value', frame=f)
    luz_fraca.data.energy = 120 * fl; luz_fraca.data.keyframe_insert('energy', frame=f)
    # frentista segurando o riso: cabeça treme
    shake = .012 * math.sin(t * 38) if t > 7.9 else 0
    fhead.scale = (1 + abs(shake) * 2, 1 + abs(shake) * 2, 1)
    fhead.keyframe_insert('scale', frame=f)

# ---------------- câmeras ----------------
def camera(name, lens):
    cd = bpy.data.cameras.new(name); cd.lens = lens; cd.sensor_width = 36
    c = bpy.data.objects.new(name, cd); S.collection.objects.link(c); return c
def look(c, at, roll=0.0):
    d = Vector(at) - c.location
    q = d.to_track_quat('-Z', 'Y'); c.rotation_euler = q.to_euler()
    c.rotation_euler.rotate_axis('Z', math.radians(roll))

def smooth(x): x = min(max(x, 0), 1); return x * x * (3 - 2 * x)
def lerpv(a, b, t): return Vector(a).lerp(Vector(b), t)

camA = camera('A_drone', 28); camB = camera('B_chao', 22); camB2 = camera('B2_farol', 85); camC = camera('C_frentista', 24)
for c in (camB2, camC):
    c.data.dof.use_dof = True
camB2.data.dof.aperture_fstop = 1.4
camC.data.dof.aperture_fstop = 2.8
camB.data.dof.use_dof = True; camB.data.dof.aperture_fstop = 4

SHOTS = [(1, 102, camA), (103, 168, camB), (169, 210, camB2), (211, 300, camC)]
for f in range(1, N + 1):
    t = (f - 1) / FPS
    # A — drone descendo e girando sobre o posto
    p = smooth(t / 3.4)
    camA.location = lerpv((-14, -26, 32), (-9, -17, 13), p)
    look(camA, lerpv((0, 6, 0), (-1, 2, 1.5), p), roll=-6 + 6 * p)
    camA.keyframe_insert('location', frame=f); camA.keyframe_insert('rotation_euler', frame=f)
    # B — câmera baixa no pátio, acompanhando o Corsa que entra
    camB.location = lerpv((-1.2, -5.6, .35), (-1.0, -5.0, .45), smooth((t - 3.4) / 2.2))
    look(camB, (car_path(1 - (1 - min(max((t - CAR_T0) / (CAR_T1 - CAR_T0), 0), 1)) ** 2.2)[0] + Vector((0, 0, .9))), roll=4)
    camB.data.dof.focus_distance = (camB.location - car_path(1 - (1 - min(max((t - CAR_T0) / (CAR_T1 - CAR_T0), 0), 1)) ** 2.2)[0]).length
    camB.keyframe_insert('location', frame=f); camB.keyframe_insert('rotation_euler', frame=f); camB.data.dof.keyframe_insert('focus_distance', frame=f)
    # B2 — close extremo no farol fraco
    cp, ch = car_path(1 - (1 - min(max((t - CAR_T0) / (CAR_T1 - CAR_T0), 0), 1)) ** 2.2)
    fw = Vector((math.cos(ch), math.sin(ch), 0)); lf = Vector((-math.sin(ch), math.cos(ch), 0))
    head = cp + fw * 1.9 + lf * .55 + Vector((0, 0, .74))
    q = smooth((t - 5.6) / 1.4)
    camB2.location = head + fw * (3.6 - .6 * q) + lf * (1.6 - .3 * q) + Vector((0, 0, .15))
    look(camB2, head, roll=-3)
    camB2.data.dof.focus_distance = (camB2.location - head).length
    camB2.keyframe_insert('location', frame=f); camB2.keyframe_insert('rotation_euler', frame=f); camB2.data.dof.keyframe_insert('focus_distance', frame=f)
    # C — frentista de baixo para cima, aproximando
    q = smooth((t - 7.0) / 3.0)
    camC.location = lerpv((-.45, 4.15, .32), (-.85, 4.4, .5), q)
    look(camC, (-2.5, 4.6, 1.45 + .2 * q), roll=4 - 3 * q)
    camC.data.dof.focus_distance = (camC.location - Vector((-2.3, 4.6, 1.8))).length
    camC.keyframe_insert('location', frame=f); camC.keyframe_insert('rotation_euler', frame=f); camC.data.dof.keyframe_insert('focus_distance', frame=f)

for a, b, c in SHOTS:
    m = S.timeline_markers.new(c.name, frame=a); m.camera = c

os.makedirs(OUT, exist_ok=True)
frames = ONLY or list(range(1, N + 1))
for f in frames:
    fp = os.path.join(OUT, 'f%04d.png' % f)
    if os.path.exists(fp) and not ONLY: continue
    S.frame_set(f)
    for a, b, c in SHOTS:
        if a <= f <= b: S.camera = c
    S.render.filepath = fp
    t0 = time.time(); bpy.ops.render.render(write_still=True)
    print('QUADRO', f, round(time.time() - t0, 1), 's', flush=True)
