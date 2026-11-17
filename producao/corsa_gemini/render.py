import numpy as np, subprocess, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
W,H,FPS,DUR=1080,1920,30,10.0
FONT=ImageFont.truetype('rc900.ttf',104)
YEL=(255,196,36)
def ease(x): x=min(max(x,0),1); return 1-(1-x)**3
def eio(x): x=min(max(x,0),1); return x*x*(3-2*x)
def lerp(a,b,t): return a+(b-a)*t
L={n:Image.open(n+'.png').convert('RGB') for n in ['drone','chao','frent']}
car=Image.open('corsa_cut2.png').convert('RGBA')
# noite no carro (menos nos faróis)
ca=np.array(car).astype(float); hh,ww=ca.shape[:2]
yy,xx=np.mgrid[0:hh,0:ww]
lamp=np.zeros((hh,ww))
for (x,y,r) in [(48,298,42),(343,313,62)]: lamp=np.maximum(lamp,np.clip(1-np.hypot(xx-x,yy-y)/r,0,1))
tint=np.array([.60,.66,.86]); top=np.clip(1-yy/hh*1.6,0,1)[...,None]*np.array([.18,.2,.24])
ca[...,:3]=ca[...,:3]*(tint+(1-tint)*lamp[...,None])+top*255*(1-lamp[...,None])*(ca[...,3:]/255>0)
car=Image.fromarray(np.clip(ca,0,255).astype('uint8'))
HEAD_DIM,HEAD_BRT=(48,298),(343,313)
def place(img,scale,fx,fy,px=W/2,py=H/2,rot=0):
    """escala img para cobrir o quadro*scale; ponto focal (fx,fy normalizado) vai para (px,py)"""
    s=max(W/img.width,H/img.height)*scale
    im=img.resize((int(img.width*s)+1,int(img.height*s)+1),Image.LANCZOS)
    x=px-fx*im.width; y=py-fy*im.height
    x=min(0,max(W-im.width,x)); y=min(0,max(H-im.height,y))
    fr=Image.new('RGB',(W,H)); fr.paste(im,(int(x),int(y)))
    if rot: fr=fr.rotate(rot,resample=Image.BICUBIC,expand=False,fillcolor=(0,0,0))
    return fr,(x,y,s)
def glow(fr,x,y,r,col,a):
    g=Image.new('RGB',(W,H)); d=ImageDraw.Draw(g)
    for k in range(10,0,-1):
        rr=r*k/10; c=tuple(int(v*a*(1-k/11)**1.6) for v in col); d.ellipse([x-rr,y-rr*.7,x+rr,y+rr*.7],fill=c)
    return ImageChops.add(fr,g.filter(ImageFilter.GaussianBlur(r/6)))
def draw_car(fr,cx,by,sc,flick,t):
    c=car.resize((int(car.width*sc),int(car.height*sc)),Image.LANCZOS)
    x=int(cx-c.width/2); y=int(by-c.height+math.sin(t*23)*1.5*sc)
    # luz no chão à frente
    g=Image.new('L',(W,H)); d=ImageDraw.Draw(g)
    d.ellipse([x-160*sc,y+c.height-60*sc,x+520*sc,y+c.height+140*sc],fill=90)
    fr=Image.composite(Image.new('RGB',(W,H),(255,226,170)),fr,g.filter(ImageFilter.GaussianBlur(60*sc+4)).point(lambda v:int(v*.55)))
    fr.paste(c,(x,y),c)
    fr=glow(fr,x+HEAD_BRT[0]*sc,y+HEAD_BRT[1]*sc,170*sc,(255,236,190),1.0)
    fr=glow(fr,x+HEAD_DIM[0]*sc,y+HEAD_DIM[1]*sc,110*sc,(255,190,90),.35*flick)
    return fr
def flick(t): return .55+.45*(math.sin(t*31)*math.sin(t*7.3)>-.2)*(.6+.4*math.sin(t*53))
CAPS=[(0.3,1.1,'PRIMEIRO DIA',[]),(1.1,2.0,'COM O CORSA.',['CORSA.']),(2.0,2.9,'E PRIMEIRA MISSÃO:',[]),(2.9,3.9,'ABASTECER.',['ABASTECER.']),
      (7.25,8.0,'COMPLETA…',[]),(8.0,8.9,'OU SÓ VINTE REAIS',['VINTE','REAIS']),(8.9,9.45,'PRA ELE CHEGAR',[]),(9.45,10.0,'EM CASA?',['CASA?'])]
def caption(fr,t):
    for a,b,txt,ky in CAPS:
        if a<=t<b:
            p=min(1,(t-a)/.12); sc=1.18-.18*eio(p)
            words=txt.split(' '); sp=26
            ws=[FONT.getbbox(w)[2] for w in words]; tw=sum(ws)+sp*(len(words)-1)
            lay=Image.new('RGBA',(tw+80,180)); d=ImageDraw.Draw(lay); x=40
            for w,wd in zip(words,ws):
                d.text((x+6,26),w,font=FONT,fill=(0,0,0,150),stroke_width=10,stroke_fill=(0,0,0,150))
                d.text((x,20),w,font=FONT,fill=YEL if w in ky else (255,255,255),stroke_width=9,stroke_fill=(0,0,0))
                x+=wd+sp
            lay=lay.resize((int(lay.width*sc),int(lay.height*sc)),Image.LANCZOS)
            fr.paste(lay,(int(W/2-lay.width/2),int(1150-lay.height/2)),lay)
    return fr
FP=ImageFont.truetype('rc900.ttf',44); FN=ImageFont.truetype('rc900.ttf',96)
def panel(fr,t,t0,l1,l2,col,x,y):
    if t<t0: return fr
    p=ease((t-t0)/.25); sc=.6+.4*p+.06*math.sin(min(1,(t-t0)/.25)*math.pi)
    lay=Image.new('RGBA',(440,240)); d=ImageDraw.Draw(lay)
    d.rounded_rectangle([10,10,430,230],28,fill=(14,16,24,235),outline=col,width=7)
    d.text((220,62),l1,font=FP,fill=(220,224,232),anchor='mm'); d.text((220,152),l2,font=FN,fill=col,anchor='mm')
    lay=lay.resize((int(440*sc),int(240*sc)),Image.LANCZOS); a=lay.split()[3].point(lambda v:int(v*p)); lay.putalpha(a)
    fr.paste(lay,(int(x-lay.width/2),int(y-lay.height/2)),lay); return fr
rng=np.random.default_rng(3)
GR=[Image.fromarray(np.clip(128+rng.normal(0,22,(H//2,W//2)),0,255).astype('uint8')).resize((W,H)) for _ in range(6)]
vy,vx=np.mgrid[0:H,0:W]; VIG=Image.fromarray((255*np.clip(1-.62*(((vx-W/2)/(W*.62))**2+((vy-H/2)/(H*.6))**2),0,1)**1.2).astype('uint8'))
fogn=Image.fromarray((rng.random((24,14))*255).astype('uint8')).resize((W*2,H),Image.BICUBIC).filter(ImageFilter.GaussianBlur(40))
DUST=rng.random((70,4))
def post(fr,t,i,fogA=.10):
    fx=int((t*40)%W); fog=fogn.crop((fx,0,fx+W,H))
    fr=Image.composite(Image.new('RGB',(W,H),(170,186,214)),fr,fog.point(lambda v:int(v*fogA)))
    d=ImageDraw.Draw(fr)
    for k,(a,b,c,e) in enumerate(DUST):
        x=(a*W+math.sin(t*.7+k)*30)%W; y=(b*H-t*(20+40*c))%H; r=1.5+2.5*e
        d.ellipse([x-r,y-r,x+r,y+r],fill=(235,235,215))
    fr=Image.composite(fr,Image.new('RGB',(W,H),(4,5,10)),VIG)
    g=GR[i%6]; fr=ImageChops.overlay(fr,Image.merge('RGB',[g,g,g])) if False else Image.blend(fr,ImageChops.soft_light(fr,Image.merge('RGB',[g,g,g])),.5)
    return fr.filter(ImageFilter.UnsharpMask(2,60,2))
ff=subprocess.Popen(['ffmpeg','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-c:v','libx264','-crf','18','-pix_fmt','yuv420p','video.mp4'],stdin=subprocess.PIPE)
N=int(DUR*FPS)
for i in range(N):
    t=i/FPS
    if t<3.4:  # A — drone descendo sobre o posto
        p=eio(t/3.4); fr,_=place(L['drone'],lerp(1.0,1.55,p),lerp(.5,.55,p),lerp(.42,.5,p),rot=lerp(-2,0,p))
        fr=panel(fr,t,1.0,'GASOLINA','R$ 6,29',YEL,780,330); fogA=.14
    elif t<5.6:  # B1 — Corsa entra no posto
        u=t-3.4; fr,(ox,oy,s)=place(L['chao'],lerp(1.0,1.07,u/2.2),.5,.5)
        ex,ey=ox+.636*920*s, oy+.52*1635*s
        p=ease(u/2.0); sc=lerp(.14,1.08,p)
        fr=draw_car(fr,lerp(ex,560,p),lerp(ey+30,1560,p),sc,flick(t),t)
        if u<.25: fr=Image.blend(fr,Image.new('RGB',(W,H),(255,255,255)),.25*(1-u/.25))
        fogA=.12
    elif t<7.0:  # B2 — close no farol fraco
        u=t-5.6; bg,_=place(L['chao'],1.5,.4,.75); bg=bg.filter(ImageFilter.GaussianBlur(18)).point(lambda v:int(v*.75))
        sc=lerp(3.0,3.4,eio(u/1.4)); cx=540+(car.width/2-HEAD_DIM[0])*sc; by=980+(car.height-HEAD_DIM[1])*sc
        fr=draw_car(bg,cx,by,sc,flick(t),t*0.3); fogA=.06
    else:  # C — frentista de baixo para cima
        u=t-7.0; p=eio(u/3.0)
        jit=.006*math.sin(t*40) if 8.0<t<9.6 else 0
        fr,_=place(L['frent'],lerp(1.38,1.12,p)+jit,.5,lerp(.78,.42,p),rot=lerp(3,1,p))
        if u<.2: fr=Image.blend(fr,Image.new('RGB',(W,H),(255,255,255)),.3*(1-u/.2))
        fr=panel(fr,t,8.05,'SÓ','R$ 20',(90,220,120),800,330); fogA=.05
    fr=caption(post(fr,t,i,fogA),t)
    if t<.3: fr=Image.blend(Image.new('RGB',(W,H)),fr,t/.3)
    ff.stdin.write(fr.tobytes())
ff.stdin.close(); ff.wait(); print('ok')
