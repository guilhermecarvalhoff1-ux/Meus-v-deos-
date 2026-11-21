import numpy as np, wave
from scipy.signal import butter, sosfilt
from make import SCENES, TOTAL
sr=44100; N=int(TOTAL*sr); x=np.arange(N)/sr; rng=np.random.default_rng(3)
def lp(s,f): return sosfilt(butter(2,f,'low',fs=sr,output='sos'),s)
def bp(s,a,b): return sosfilt(butter(2,[a,b],'band',fs=sr,output='sos'),s)
# trilha: pad suave (Am - F - C - G), sem terror
chords=[[220,261.6,329.6],[174.6,220,261.6],[130.8,164.8,196,261.6],[196,246.9,293.7]]
seg=4.0; mus=np.zeros(N)
for i in range(int(TOTAL/seg)+1):
    a,b=int(i*seg*sr),min(N,int((i+1)*seg*sr)+int(.5*sr))
    if a>=N: break
    t=np.arange(b-a)/sr; env=np.minimum(t/1.2,1)*np.minimum((b-a)/sr-t,1).clip(0,1)
    for f in chords[i%4]:
        mus[a:b]+=(np.sin(2*np.pi*f*t)+.3*np.sin(2*np.pi*2*f*t+1))*env*.12
# arpejo leve
beat=60/92
for k in range(int(TOTAL/beat)):
    st=int(k*beat*sr); L=int(.5*sr)
    if st+L>N: break
    f=chords[int(k*beat/seg)%4][k%3]*2; t=np.arange(L)/sr
    mus[st:st+L]+=np.sin(2*np.pi*f*t)*np.exp(-t*7)*.06
mus=lp(mus,3000)
fx=np.zeros(N)
def put(s,sec,g=1):
    i=int(sec*sr); L=min(len(s),N-i); fx[i:i+L]+=s[:L]*g
def whoosh(d=.6):
    t=np.arange(int(d*sr))/sr; n=rng.standard_normal(len(t)); return bp(n,400,3000)*np.sin(np.pi*t/d)**2*.25
def chime(f=1320):
    t=np.arange(int(.9*sr))/sr; return (np.sin(2*np.pi*f*t)+.4*np.sin(2*np.pi*f*1.5*t))*np.exp(-t*5)*.12
for sc in SCENES[1:]: put(whoosh(),sc['t0']-.35)          # trocas de cena, antes da fala começar
for sc in SCENES[1:4]: put(chime(),sc['t0']+.05)           # número aparece, antes da primeira palavra
put(chime(990),SCENES[4]['t1']-1.3,.6)                    # NOX EXPLICA (depois da última fala)
mix=mus*.55+fx
import os
if os.path.exists('narracao.wav'):
    w=wave.open('narracao.wav'); v=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(float)/32768
    if w.getnchannels()==2: v=v.reshape(-1,2).mean(1)
    voice=np.zeros(N); voice[:min(N,len(v))]=v[:N]
    env=np.convolve(np.abs(voice),np.ones(int(.25*sr))/int(.25*sr),'same')
    duck=1-0.7*np.clip(env/0.03,0,1)
    mix=voice/ (np.max(np.abs(voice))+1e-9)*0.9 + (mus*.55+fx)*duck*1.6
f=int(.8*sr); mix[:f]*=np.linspace(0,1,f); mix[-f:]*=np.linspace(1,0,f)
mix=mix/np.max(np.abs(mix))*(0.93 if os.path.exists('narracao.wav') else 0.5)
st=np.stack([mix,mix],1)
w=wave.open('trilha.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes((st*32767).astype(np.int16).tobytes()); w.close()
