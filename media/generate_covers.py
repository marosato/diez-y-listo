"""Original number-card cover artwork; no third-party bitmap assets."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).parent
FONT = 'C:/Windows/Fonts/arialbd.ttf'

def cover(width, height, name):
    scale = 2
    w, h = width*scale, height*scale
    image = Image.new('RGB', (w,h), '#f7f2ff')
    d = ImageDraw.Draw(image)
    d.ellipse((-w*.22,h*.45,w*.55,h*1.2),fill='#ebe2f8')
    d.ellipse((w*.62,-h*.3,w*1.24,h*.5),fill='#eee7fc')
    landscape = width > height
    title_size = int((h*.13 if landscape else w*.12))
    font = ImageFont.truetype(FONT,title_size)
    cx, ty = (w*.25,h*.29) if landscape else (w*.5,h*.1)
    for line, offset in [('DIEZ',0),('Y LISTO',title_size*1.12)]:
        d.text((cx,ty+offset),line,font=font,anchor='mt',fill='#45306c',stroke_width=0)
    cw = int((w*.15 if landscape else w*.23))
    ch = int(cw*1.17)
    positions = [(w*.61,h*.28,-10,7,'#e4d9f8','#8864b4'),
                 (w*.78,h*.34,9,3,'#fbe0e7','#b76886'),
                 (w*.61,h*.61,8,4,'#e4defa','#8864b4'),
                 (w*.79,h*.67,-9,6,'#ffe6d4','#b57955')]
    if not landscape:
        positions = [(w*.34,h*.49,-10,7,'#e4d9f8','#8864b4'),
                     (w*.68,h*.52,9,3,'#fbe0e7','#b76886'),
                     (w*.32,h*.76,8,4,'#e4defa','#8864b4'),
                     (w*.66,h*.78,-9,6,'#ffe6d4','#b57955')]
    for x,y,angle,number,fill,ink in positions:
        pad=int(cw*.25)
        tile=Image.new('RGBA',(cw+pad*2,ch+pad*2))
        td=ImageDraw.Draw(tile)
        td.rounded_rectangle((pad+5,pad+14,pad+cw+5,pad+ch+14),radius=int(cw*.14),fill='#d8cce7')
        td.rounded_rectangle((pad,pad,pad+cw,pad+ch),radius=int(cw*.14),fill=fill)
        td.text((pad+cw*.5,pad+ch*.5),str(number),font=ImageFont.truetype(FONT,int(cw*.63)),anchor='mm',fill=ink)
        td.text((pad+cw*.15,pad+ch*.15),str(number),font=ImageFont.truetype(FONT,int(cw*.13)),anchor='mm',fill=ink)
        tile=tile.rotate(angle,resample=Image.Resampling.BICUBIC,expand=True)
        image.paste(tile,(int(x-tile.width/2),int(y-tile.height/2)),tile)
    image.resize((width,height),Image.Resampling.LANCZOS).save(OUT/name,optimize=True)

if __name__ == '__main__':
    for w,h,name in [(1920,1080,'cover-landscape.png'),(800,1200,'cover-portrait.png'),(800,800,'cover-square.png')]:
        cover(w,h,name)
        print(name,w,h)
