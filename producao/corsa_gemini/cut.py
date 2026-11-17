import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage
im=np.array(Image.open('corsa.png').convert('RGB')).astype(int)
mn=im.min(2); mx=im.max(2)
bgl=(mn>150)&((mx-mn)<35)
lab,n=ndimage.label(bgl)
edge=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
bg=np.isin(lab,list(edge))
fg=~bg
lab2,n2=ndimage.label(fg); sizes=ndimage.sum(fg,lab2,range(1,n2+1)); keep=lab2==(1+int(np.argmax(sizes)))
keep=ndimage.binary_fill_holes(keep)
a=Image.fromarray((keep*255).astype('uint8')).filter(ImageFilter.GaussianBlur(1.2))
out=Image.open('corsa.png').convert('RGBA'); out.putalpha(a)
bb=out.getbbox(); out=out.crop(bb); out.save('corsa_cut.png'); print(bb,out.size)
chk=Image.new('RGBA',out.size,(200,30,60,255)); chk.alpha_composite(out); chk.convert('RGB').save('corsa_chk.png')
