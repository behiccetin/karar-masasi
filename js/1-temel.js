/* Karar Masası · Öğr. Gör. Dr. Behiç ÇETİN · MIT Lisansı */

/* ====================== DURUM ====================== */
const SURUM='1.1.0';
const KAYIT='kararMasasi.v1';
const S={P:null,dil:'tr',sekme:'giris',kilit:false,kaydedildi:false,sonuc:null};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Math.random().toString(36).slice(2,9)+Date.now().toString(36).slice(-3);
const kisalt=(s,n)=>(s=String(s??''),s.length>n?s.slice(0,n-1)+'…':s);

/* ====================== DİL ====================== */
let DILLER={...GOMULU_DILLER};
function t(k,...a){const zin=[DILLER[S.dil],DILLER.en,DILLER.tr];let v;for(const d of zin){if(d&&d[k]!==undefined){v=d[k];break}}if(v===undefined)v=k;if(typeof v==='string')v=v.replace(/\{(\d)\}/g,(_,i)=>a[i]??'');return v}
function tAlt(grup,k){for(const d of [DILLER[S.dil],DILLER.en,DILLER.tr]){if(d&&d[grup]&&d[grup][k]!==undefined)return d[grup][k]}return ''}
const ga=(g,k)=>tAlt(g,k);
const sayi=(n,ond=0)=>Number(n).toLocaleString(S.dil,{minimumFractionDigits:ond,maximumFractionDigits:ond});
const yuzde=v=>v==null?'-':'%'+sayi(v*100,1);
/* Dil dosyalarından gelen biçimli metin: yalnızca zararsız etiketler kalır, öznitelikler silinir. */
function guvenliHtml(s){const tp=document.createElement('template');tp.innerHTML=String(s??'');const izin=new Set(['P','B','STRONG','I','EM','OL','UL','LI','BR','CODE','KBD']);
  const gez=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===1){if(!izin.has(c.tagName)){c.replaceWith(document.createTextNode(c.textContent))}else{[...c.attributes].forEach(a=>c.removeAttribute(a.name));gez(c)}}else if(c.nodeType!==3)c.remove()})};
  gez(tp.content);const d=document.createElement('div');d.appendChild(tp.content);return d.innerHTML}
/* "?" düğmesi: tıklayınca öğenin yanında kısa açıklama */
function ip(k){if(!tAlt('ipucu',k))return '';return `<button type="button" class="btn btn-ghost btn-circle btn-xs text-base-content/50 hover:text-base-content ipucu-btn align-middle" data-ipk="${esc(k)}" aria-expanded="false" aria-label="${esc(t('whatIsThis'))}" title="${esc(t('whatIsThis'))}"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/></svg></button>`}
let ipAcik=null;
function ipKapat(){const k=$('#ipucuKutu');k.classList.add('hidden');if(ipAcik){ipAcik.setAttribute('aria-expanded','false');ipAcik=null}}
document.addEventListener('click',e=>{const b=e.target.closest('.ipucu-btn');const k=$('#ipucuKutu');
  if(!b){if(ipAcik&&!e.target.closest('#ipucuKutu'))ipKapat();return}
  e.preventDefault();e.stopPropagation();if(ipAcik===b){ipKapat();return}ipKapat();
  k.innerHTML=guvenliHtml(tAlt('ipucu',b.dataset.ipk));k.classList.remove('hidden');
  const r=b.getBoundingClientRect(),w=k.offsetWidth,h=k.offsetHeight;let x=r.left+r.width/2-w/2,y=r.bottom+6;
  x=Math.max(8,Math.min(x,innerWidth-w-8));if(y+h>innerHeight-8)y=Math.max(8,r.top-h-6);k.style.left=x+'px';k.style.top=y+'px';
  b.setAttribute('aria-expanded','true');ipAcik=b},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&ipAcik)ipKapat()});
addEventListener('scroll',()=>ipAcik&&ipKapat(),true);

/* ====================== PROJE ====================== */
const AGIRLIK_YONTEM=['esit','dogrudan','ahp','bwm','entropi','critic','sd','merec'];
const SIRALAMA_YONTEM=['topsis','vikor','waspas','edas','copras','moora','aras','mabac','marcos','saw'];
function bosProje(){return {tur:'karar-masasi',v:1,ad:t('untitled'),kriterler:[],alternatifler:[],X:{},
  agirlik:{yontem:'esit',dogrudan:{},ahp:{uzmanlar:[],birlestir:'aij'},bwm:{uzmanlar:[]}},
  yontemler:['topsis','vikor','waspas','edas','copras'],ana:'topsis',param:{v:0.5,lambda:0.5},
  duyarlilik:{yontem:'',oranlar:'-50, -25, 25, 50'},ondalik:4,adimRapor:true,not:'',gunluk:[],olusturma:new Date().toISOString(),rev:0}}
const P=()=>S.P;
function projeDuzelt(p){const b=bosProje();p.v=1;p.ad=p.ad||b.ad;
  p.kriterler=(Array.isArray(p.kriterler)?p.kriterler:[]).filter(k=>k&&k.id).map(k=>({id:String(k.id),ad:String(k.ad??''),yon:k.yon==='min'?'min':'max',birim:String(k.birim??'')}));
  p.alternatifler=(Array.isArray(p.alternatifler)?p.alternatifler:[]).filter(a=>a&&a.id).map(a=>({id:String(a.id),ad:String(a.ad??'')}));
  p.X=p.X&&typeof p.X==='object'?p.X:{};const ks=new Set(p.kriterler.map(k=>k.id));
  p.alternatifler.forEach(a=>{const s=p.X[a.id]&&typeof p.X[a.id]==='object'?p.X[a.id]:{};const o={};for(const k of ks){const v=s[k];o[k]=typeof v==='number'&&isFinite(v)?v:null}p.X[a.id]=o});
  for(const k of Object.keys(p.X))if(!p.alternatifler.some(a=>a.id===k))delete p.X[k];
  p.agirlik=Object.assign({},b.agirlik,p.agirlik||{});if(!AGIRLIK_YONTEM.includes(p.agirlik.yontem))p.agirlik.yontem='esit';
  p.agirlik.dogrudan=p.agirlik.dogrudan&&typeof p.agirlik.dogrudan==='object'?p.agirlik.dogrudan:{};
  p.agirlik.ahp=Object.assign({uzmanlar:[],birlestir:'aij'},p.agirlik.ahp||{});p.agirlik.ahp.uzmanlar=(p.agirlik.ahp.uzmanlar||[]).map(u=>({id:u.id||uid(),ad:String(u.ad??''),m:u.m&&typeof u.m==='object'?u.m:{}}));
  if(!['aij','aip'].includes(p.agirlik.ahp.birlestir))p.agirlik.ahp.birlestir='aij';
  p.agirlik.bwm=Object.assign({uzmanlar:[]},p.agirlik.bwm||{});p.agirlik.bwm.uzmanlar=(p.agirlik.bwm.uzmanlar||[]).map(u=>({id:u.id||uid(),ad:String(u.ad??''),en:u.en||null,kotu:u.kotu||null,bo:u.bo||{},ow:u.ow||{}}));
  p.yontemler=(Array.isArray(p.yontemler)?p.yontemler:b.yontemler).filter(y=>SIRALAMA_YONTEM.includes(y));
  if(!SIRALAMA_YONTEM.includes(p.ana))p.ana=p.yontemler[0]||'topsis';
  p.param=Object.assign({},b.param,p.param||{});p.duyarlilik=Object.assign({},b.duyarlilik,p.duyarlilik||{});
  p.ondalik=Math.min(8,Math.max(2,+p.ondalik||4));p.adimRapor=p.adimRapor!==false;p.gunluk=Array.isArray(p.gunluk)?p.gunluk:[];p.rev=p.rev||0;return p}
function gunlukEkle(m){P().gunluk.push({t:new Date().toISOString(),m})}
/* Dilden bağımsız küçültme: I, ı, İ hepsi i olur. Başlık eşleştirmede kullanılır. */
function katla(s){let o='';for(const c of String(s)){if(c==='I'||c==='ı'||c==='İ'){o+='i';continue}const l=c.toLowerCase();o+=l.length===c.length?l:c}return o}
/* Sayı okuma: 1.234,56 ya da 1,234.56 ya da 1/3 biçimlerini anlar. */
function sayiOku(s){if(typeof s==='number')return isFinite(s)?s:null;s=String(s??'').trim().replace(/\s+/g,'').replace(/%$/,'').replace(/^(-?)%/,'$1');if(!s)return null;
  const k=s.match(/^(-?[\d.,]+)\/([\d.,]+)$/);
  /* Binlik ayıraç: Türkçede 1.250, İngilizcede 1,250 biçimi binlik sayılır (0.125 gibi sıfırla başlayanlar ondalıktır). */
  if(S.dil==='tr'&&/^-?[1-9]\d{0,2}(\.\d{3})+$/.test(s))s=s.replace(/\./g,'');else if(S.dil!=='tr'&&/^-?[1-9]\d{0,2}(,\d{3})+$/.test(s))s=s.replace(/,/g,'');if(k){const a=sayiOku(k[1]),b=sayiOku(k[2]);return a!=null&&b?a/b:null}
  const v=s.lastIndexOf(','),n=s.lastIndexOf('.');if(v>-1&&n>-1){s=v>n?s.replace(/\./g,'').replace(',','.'):s.replace(/,/g,'')}else if(v>-1){s=(s.match(/,/g).length>1)?s.replace(/,/g,''):s.replace(',','.')}else if((s.match(/\./g)||[]).length>1)s=s.replace(/\./g,'');
  if(!/^-?(\d+\.?\d*|\.\d+)(e-?\d+)?$/i.test(s))return null;const x=parseFloat(s);return isFinite(x)?x:null}

/* ====================== KALICI KAYIT ====================== */
const VT={db:null,
  ac(){return new Promise(res=>{try{const r=indexedDB.open('karar-masasi',1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>{VT.db=r.result;res(true)};r.onerror=()=>res(false)}catch(e){res(false)}})},
  al(k){return new Promise(res=>{if(!VT.db)return res(null);try{const r=VT.db.transaction('kv').objectStore('kv').get(k);r.onsuccess=()=>res(r.result??null);r.onerror=()=>res(null)}catch(e){res(null)}})},
  koy(k,v){return new Promise((res,rej)=>{if(!VT.db)return rej(new Error('db'));try{const tx=VT.db.transaction('kv','readwrite');tx.objectStore('kv').put(v,k);tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error)}catch(e){rej(e)}})}};
const ls={al(k){try{return localStorage.getItem(k)}catch(e){return null}},koy(k,v){try{localStorage.setItem(k,v);return true}catch(e){return false}}};
const OTURUM=uid();
let kayitZ=null;
function kaydet(){if(S.kilit)return;clearTimeout(kayitZ);kayitZ=setTimeout(async()=>{P().rev=(P().rev||0)+1;const veri=JSON.stringify(P());
  let tamam=false;try{await VT.koy('proje',veri);tamam=true}catch(e){tamam=ls.koy(KAYIT,veri)}
  if(tamam){S.kaydedildi=true;$('#kayitDurum').textContent=t('saved');sekmeHaber()}else tost(t('saveFail'),'warning')},400)}
async function projeYukle(){let s=await VT.al('proje');if(!s)s=ls.al(KAYIT);if(!s)return null;try{const p=JSON.parse(s);if(p&&p.tur==='karar-masasi')return projeDuzelt(p)}catch(e){}return null}
let kanal=null;try{kanal=new BroadcastChannel('karar-masasi');kanal.onmessage=e=>{if(e.data&&e.data.o!==OTURUM)sekmeKilitle()}}catch(e){}
function sekmeHaber(){const m={o:OTURUM,r:P().rev};try{kanal&&kanal.postMessage(m)}catch(e){}ls.koy(KAYIT+'.nabiz',JSON.stringify(m))}
addEventListener('storage',e=>{if(e.key===KAYIT+'.nabiz'&&e.newValue){try{if(JSON.parse(e.newValue).o!==OTURUM)sekmeKilitle()}catch(_){}}});
function sekmeKilitle(){if(S.kilit)return;S.kilit=true;clearTimeout(kayitZ);$('#sekmeUyari').classList.remove('hidden');$('#sekmeUyari').classList.add('flex')}

/* ====================== GERİ AL / YİNELE ====================== */
const GECMIS={geri:[],ileri:[]};
function once(){GECMIS.geri.push(JSON.stringify(P()));if(GECMIS.geri.length>100)GECMIS.geri.shift();GECMIS.ileri=[];gecmisDugme()}
function gecmisDugme(){$('#geriAl').disabled=!GECMIS.geri.length;$('#yinele').disabled=!GECMIS.ileri.length}
function geriAl(){if(!GECMIS.geri.length)return;GECMIS.ileri.push(JSON.stringify(P()));S.P=projeDuzelt(JSON.parse(GECMIS.geri.pop()));sonrasi();tost(t('undone'))}
function yinele(){if(!GECMIS.ileri.length)return;GECMIS.geri.push(JSON.stringify(P()));S.P=projeDuzelt(JSON.parse(GECMIS.ileri.pop()));sonrasi();tost(t('redone'))}
function sonrasi(){S.sonuc=null;gecmisDugme();kaydet();ciz()}
/* islem: değişiklikten önce anlık görüntü alır, sonra kaydeder ve yeniden çizer. */
function islem(fn,o={}){once();const r=fn();S.sonuc=null;kaydet();if(!o.cizme)ciz();return r}

/* ====================== ARAYÜZ YARDIMCILARI ====================== */
function tost(m,tur='success'){const d=document.createElement('div');d.className='alert '+({warning:'alert-warning',error:'alert-error',info:'alert-info'}[tur]||'alert-success')+' text-sm py-2 max-w-sm';d.setAttribute('role','status');d.textContent=m;$('#tost').appendChild(d);setTimeout(()=>d.remove(),4200)}
function pencere(baslik,icerik,dugmeler,o={}){$('#pBaslik').textContent=baslik;$('#pYardim').innerHTML=o.ip?ip(o.ip):'';$('#pIcerik').innerHTML=icerik;const pd=$('#pDugmeler');pd.innerHTML='';
  $('#pencere .modal-box').classList.toggle('max-w-4xl',!!o.genis);$('#pencere .modal-box').classList.toggle('max-w-2xl',!o.genis);
  return new Promise(res=>{const dlg=$('#pencere');let sonuc=null;(dugmeler||[{ad:t('close'),d:null}]).forEach(b=>{const e=document.createElement('button');e.className='btn '+(b.c||'');e.textContent=b.ad;if(b.id)e.id=b.id;e.onclick=async()=>{if(b.f){const r=await b.f();if(r===false)return}sonuc=b.d;dlg.close()};pd.appendChild(e)});
    dlg.onclose=()=>{if(dlg.open)return;res(sonuc)};dlg.showModal();if(o.acilinca)o.acilinca()})}
const sor=(m,evet,tehlike)=>pencere(t('project'),`<p>${esc(m)}</p>`,[{ad:t('cancel'),d:false},{ad:evet||'OK',d:true,c:tehlike?'btn-error':'btn-primary'}]);
function indir(ad,blob){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=ad;document.body.appendChild(a);a.click();setTimeout(()=>{a.remove();URL.revokeObjectURL(a.href)},2000)}
const dosyaAd=s=>(String(s||'proje').replace(/ı/g,'i').replace(/İ/g,'I').normalize('NFKD').replace(/[̀-ͯ]/g,'').replace(/[^\w-]+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'').toLowerCase()||'proje');
function dosyaOku(kabul,coklu){return new Promise(res=>{const i=$('#dosyaSec');i.value='';i.accept=kabul||'';i.multiple=!!coklu;i.onchange=()=>res(coklu?[...i.files]:(i.files[0]||null));i.click()})}
async function kopyala(m){try{await navigator.clipboard.writeText(m);tost(t('copied'))}catch(e){const a=document.createElement('textarea');a.value=m;document.body.appendChild(a);a.select();try{document.execCommand('copy');tost(t('copied'))}catch(_){}a.remove()}}

/* ====================== ZIP ====================== */
async function zipAc(buf){const u=new Uint8Array(buf),dv=new DataView(u.buffer,u.byteOffset,u.byteLength);let e=u.length-22;
  while(e>=0&&dv.getUint32(e,true)!==0x06054b50)e--;if(e<0)throw new Error('zip');
  const n=dv.getUint16(e+10,true);let p=dv.getUint32(e+16,true);const dec=new TextDecoder(),o={};
  for(let i=0;i<n;i++){if(dv.getUint32(p,true)!==0x02014b50)break;
    const yon=dv.getUint16(p+10,true),cb=dv.getUint32(p+20,true),nl=dv.getUint16(p+28,true),xl=dv.getUint16(p+30,true),cl=dv.getUint16(p+32,true),lh=dv.getUint32(p+42,true);
    const ad=dec.decode(u.subarray(p+46,p+46+nl));const ln=dv.getUint16(lh+26,true),lx=dv.getUint16(lh+28,true),bas=lh+30+ln+lx;
    o[ad]={yon,veri:u.subarray(bas,bas+cb)};p+=46+nl+xl+cl}
  o.oku=async ad=>{const f=o[ad];if(!f)return null;const b=f.yon===0?f.veri:new Uint8Array(await new Response(new Blob([f.veri]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer());return new TextDecoder().decode(b)};
  return o}
const CRC=(()=>{const tb=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;tb[n]=c>>>0}return d=>{let c=0xFFFFFFFF;for(let i=0;i<d.length;i++)c=tb[(c^d[i])&255]^(c>>>8);return (c^0xFFFFFFFF)>>>0}})();
function zipYap(files,tip){const enc=new TextEncoder(),parca=[],merkez=[];let off=0;const n=new Date(),dt=((n.getFullYear()-1980)<<9)|((n.getMonth()+1)<<5)|n.getDate(),tm=(n.getHours()<<11)|(n.getMinutes()<<5)|(n.getSeconds()>>1);
  for(const f of files){const ad=enc.encode(f.ad),d=typeof f.veri==='string'?enc.encode(f.veri):f.veri,c=CRC(d);
    const h=new DataView(new ArrayBuffer(30));h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(10,tm,true);h.setUint16(12,dt,true);h.setUint32(14,c,true);h.setUint32(18,d.length,true);h.setUint32(22,d.length,true);h.setUint16(26,ad.length,true);
    parca.push(new Uint8Array(h.buffer),ad,d);
    const m=new DataView(new ArrayBuffer(46));m.setUint32(0,0x02014b50,true);m.setUint16(4,20,true);m.setUint16(6,20,true);m.setUint16(8,0x0800,true);m.setUint16(12,tm,true);m.setUint16(14,dt,true);m.setUint32(16,c,true);m.setUint32(20,d.length,true);m.setUint32(24,d.length,true);m.setUint16(28,ad.length,true);m.setUint32(42,off,true);
    merkez.push(new Uint8Array(m.buffer),ad);off+=30+ad.length+d.length}
  const cs=merkez.reduce((a,b)=>a+b.length,0),e=new DataView(new ArrayBuffer(22));e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,cs,true);e.setUint32(16,off,true);
  return new Blob([...parca,...merkez,new Uint8Array(e.buffer)],{type:tip||'application/zip'})}

/* ====================== TABLO DOSYALARI ====================== */
async function xlsxSatirlar(buf){const z=await zipAc(buf);const P_=s=>new DOMParser().parseFromString(s,'application/xml');
  const ss=[];const sx=await z.oku('xl/sharedStrings.xml');if(sx){[...P_(sx).getElementsByTagNameNS('*','si')].forEach(si=>ss.push([...si.getElementsByTagNameNS('*','t')].map(x=>x.textContent).join('')))}
  let yol='xl/worksheets/sheet1.xml';try{const wb=P_(await z.oku('xl/workbook.xml')),sh=wb.getElementsByTagNameNS('*','sheet')[0];const rid=sh.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships','id');
    const rel=P_(await z.oku('xl/_rels/workbook.xml.rels'));const r=[...rel.getElementsByTagNameNS('*','Relationship')].find(x=>x.getAttribute('Id')===rid);if(r){const h=r.getAttribute('Target');yol=h.startsWith('/')?h.slice(1):'xl/'+h.replace(/^\.\//,'')}}catch(e){}
  const sxml=await z.oku(yol);if(!sxml)throw new Error('sheet');const sat=[];
  const kol=r=>{let n=0;for(const c of r.replace(/\d+/g,''))n=n*26+c.charCodeAt(0)-64;return n-1};
  [...P_(sxml).getElementsByTagNameNS('*','row')].forEach(row=>{const s=[];[...row.getElementsByTagNameNS('*','c')].forEach(c=>{const tip=c.getAttribute('t'),v=c.getElementsByTagNameNS('*','v')[0];
    let val='';if(tip==='s'&&v)val=ss[+v.textContent]??'';else if(tip==='inlineStr')val=[...c.getElementsByTagNameNS('*','t')].map(x=>x.textContent).join('');else if(v)val=v.textContent;
    s[kol(c.getAttribute('r')||'A')]=val});sat.push([...s].map(x=>x??''))});return sat}
function csvSatirlar(m){m=m.replace(/^﻿/,'');const ilk=m.split('\n')[0];const ay=[';','\t',','].sort((a,b)=>ilk.split(b).length-ilk.split(a).length)[0];
  const o=[];let s=[],h='',tr=false;for(let i=0;i<m.length;i++){const c=m[i];if(tr){if(c==='"'){if(m[i+1]==='"'){h+='"';i++}else tr=false}else h+=c}
    else if(c==='"'&&h==='')tr=true;else if(c===ay){s.push(h);h=''}else if(c==='\n'||c==='\r'){if(c==='\r'&&m[i+1]==='\n')i++;s.push(h);o.push(s);s=[];h=''}else h+=c}
  if(h||s.length){s.push(h);o.push(s)}return o.filter(r=>r.some(x=>String(x).trim()))}
function csv(satirlar){const ay=S.dil==='tr'?';':',';
  return new Blob(['﻿'+satirlar.map(r=>r.map(v=>{let s=String(v??'');if(/^[=+\-@\t\r]/.test(s))s="'"+s;return /["\n\r;,]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s}).join(ay)).join('\r\n')],{type:'text/csv;charset=utf-8'})}

/* ====================== WORD YARDIMCILARI ====================== */
const X=s=>String(s??'').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const wR=(s,o={})=>String(s).split('\n').map((p,i)=>`<w:r><w:rPr>${o.b?'<w:b/>':''}${o.i?'<w:i/>':''}${o.c?`<w:color w:val="${o.c}"/>`:''}${o.sz?`<w:sz w:val="${o.sz}"/><w:szCs w:val="${o.sz}"/>`:''}</w:rPr>${i?'<w:br/>':''}<w:t xml:space="preserve">${X(p)}</w:t></w:r>`).join('');
const wP=(ic,o={})=>`<w:p><w:pPr>${o.st?`<w:pStyle w:val="${o.st}"/>`:''}${o.keep?'<w:keepNext/>':''}${o.ind?`<w:ind w:left="${o.ind}" w:right="${o.ind}"/>`:''}${o.asili?'<w:ind w:left="567" w:hanging="567"/>':''}<w:spacing w:before="${o.bf??0}" w:after="${o.af??100}"/>${o.jc?`<w:jc w:val="${o.jc}"/>`:''}</w:pPr>${typeof ic==='string'?wR(ic,o):ic}</w:p>`;
const wC=(ic,o={})=>`<w:tc><w:tcPr><w:tcW w:w="${o.w}" w:type="dxa"/>${o.fill?`<w:shd w:val="clear" w:color="auto" w:fill="${o.fill}"/>`:''}<w:vAlign w:val="center"/></w:tcPr>${ic}</w:tc>`;
function wT(gen,satirlar){const k='<w:top w:val="single" w:sz="4" w:color="D3DCDE"/><w:left w:val="single" w:sz="4" w:color="D3DCDE"/><w:bottom w:val="single" w:sz="4" w:color="D3DCDE"/><w:right w:val="single" w:sz="4" w:color="D3DCDE"/><w:insideH w:val="single" w:sz="4" w:color="D3DCDE"/><w:insideV w:val="single" w:sz="4" w:color="D3DCDE"/>';
  return `<w:tbl><w:tblPr><w:tblW w:w="${gen.reduce((a,b)=>a+b,0)}" w:type="dxa"/><w:tblBorders>${k}</w:tblBorders><w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="40" w:type="dxa"/><w:left w:w="80" w:type="dxa"/><w:bottom w:w="40" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${gen.map(w=>`<w:gridCol w:w="${w}"/>`).join('')}</w:tblGrid>${satirlar.map((r,i)=>`<w:tr>${i===0?'<w:trPr><w:tblHeader/></w:trPr>':''}${r.map((c,j)=>{const o=typeof c==='object'&&c?c:{s:c};return wC(wP(o.s??'',{af:0,b:i===0||o.b,jc:o.jc,sz:18}),{w:gen[j],fill:i===0?'E3EFF1':o.fill})}).join('')}</w:tr>`).join('')}</w:tbl>${wP('',{af:120})}`}
const sigdir=(gen,top=9638)=>{const s=gen.reduce((a,b)=>a+b,0);return gen.map(g=>Math.floor(g*top/s))};

function svgPng(svg,olcek=2){return new Promise((res,rej)=>{const kok=svg.match(/<svg[^>]*>/)[0],w=Math.ceil(+kok.match(/\swidth="([\d.]+)"/)[1]),h=Math.ceil(+kok.match(/\sheight="([\d.]+)"/)[1]);const img=new Image();
  img.onload=()=>{try{const c=document.createElement('canvas');c.width=w*olcek;c.height=h*olcek;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height);c.toBlob(b=>b?res({blob:b,w,h}):rej(new Error('png')),'image/png')}catch(e){rej(e)}};
  img.onerror=()=>rej(new Error('svg'));img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg)})}
