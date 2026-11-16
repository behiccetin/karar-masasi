#!/usr/bin/env python3
"""Karar Masası derleyici: sablon.html + stil.css + js/*.js + diller/*.json -> dist/karar-masasi.html ve index.html"""
import json,glob,os,subprocess,base64
K=os.path.dirname(os.path.abspath(__file__))
def oku(p): return open(os.path.join(K,p),encoding='utf-8').read()
subprocess.run(['npx','@tailwindcss/cli','-i','stil.css','-o','dist/stil.css','--minify'],cwd=K,check=True,capture_output=True)
def yazitipi():
    d=os.path.join(K,'node_modules','@fontsource','ibm-plex-sans','files')
    ar={'latin':'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
        'latin-ext':'U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF'}
    o=''
    for w in (400,600):
        for alt,r in ar.items():
            b=base64.b64encode(open(os.path.join(d,f'ibm-plex-sans-{alt}-{w}-normal.woff2'),'rb').read()).decode()
            o+='@font-face{font-family:"IBM Plex Sans";font-style:normal;font-weight:%d;font-display:swap;src:url(data:font/woff2;base64,%s) format("woff2");unicode-range:%s}'%(w,b,r)
    return o
css=yazitipi()+oku('dist/stil.css')
diller={}
for f in sorted(glob.glob(os.path.join(K,'diller','*.json'))):
    d=json.load(open(f,encoding='utf-8'))
    assert d.get('_kod') and d.get('_ad'), f
    diller[d['_kod']]=d
js='\n'.join(oku(os.path.relpath(f,K)) for f in sorted(glob.glob(os.path.join(K,'js','*.js'))))
s=oku('sablon.html')
for a in ['/*__CSS__*/','/*__DILLER__*/{}','//__JS__']: assert s.count(a)==1,a
djson=json.dumps(diller,ensure_ascii=False).replace('</','<\\/')
s=s.replace('/*__CSS__*/',css).replace('/*__DILLER__*/{}',djson).replace('//__JS__',js.replace('</script','<\\/script'))
os.makedirs(os.path.join(K,'dist'),exist_ok=True)
open(os.path.join(K,'dist','karar-masasi.html'),'w',encoding='utf-8').write(s)
open(os.path.join(K,'index.html'),'w',encoding='utf-8').write(s)  # GitHub Pages
print('diller:',','.join(diller),'| boyut:',round(len(s.encode())/1024),'KB')
