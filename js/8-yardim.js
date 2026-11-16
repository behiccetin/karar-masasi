/* ====================== TERİM AÇIKLAMALARI (üzerine gelince) ======================
   Dil dosyasındaki "terim" sözlüğünde bulunan sözcükler, ekranda her göründüklerinde işaretlenir.
   İmleç ya da klavye odağı üzerine gelince kısa açıklama açılır. */
const TERIM={rx:null,anahtar:'',izleyici:null};
const terimSozluk=()=>{const o={};for(const d of [DILLER.tr,DILLER.en,DILLER[S.dil]])if(d&&d.terim)Object.assign(o,d.terim);
  const ben=DILLER[S.dil]&&DILLER[S.dil].terim||{},en=DILLER.en&&DILLER.en.terim||{},tr=DILLER.tr&&DILLER.tr.terim||{};const r={};
  for(const k of new Set([...Object.keys(tr),...Object.keys(en),...Object.keys(ben)]))r[k]=ben[k]??en[k]??tr[k];return r};
const terimMetni=k=>{const d=DILLER[S.dil],e=DILLER.en,r=DILLER.tr;return (d&&d.terim&&d.terim[k])??(e&&e.terim&&e.terim[k])??(r&&r.terim&&r.terim[k])??''};
function terimRx(){const k=S.dil+'|'+Object.keys(DILLER).length;if(TERIM.anahtar===k)return TERIM.rx;TERIM.anahtar=k;
  const L=Object.keys(terimSozluk()).sort((a,b)=>b.length-a.length).map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'));
  TERIM.rx=L.length?new RegExp('(?<![\\p{L}\\p{N}_])('+L.join('|')+')(?![\\p{L}\\p{N}_])','gu'):null;return TERIM.rx}
const TERIM_ATLA='script,style,textarea,select,option,input,svg,pre,code,kbd,.terim,[data-terimyok],#terimKutu,#ipucuKutu,.ipucu-btn,h1';
function terimIsle(kok){const rx=terimRx();if(!rx||!kok||!kok.isConnected)return;const L=[];
  if(kok.nodeType===3)L.push(kok);else if(kok.nodeType===1){const w=document.createTreeWalker(kok,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode())L.push(n)}
  for(const n of L){const v=n.nodeValue;if(!v||!v.trim())continue;const p=n.parentElement;if(!p||p.closest(TERIM_ATLA))continue;rx.lastIndex=0;if(!rx.test(v))continue;
    const odak=!p.closest('button,a,label,summary,[role=radio],[role=tab]');const f=document.createDocumentFragment();let son=0;rx.lastIndex=0;
    for(const m of v.matchAll(rx)){if(m.index>son)f.appendChild(document.createTextNode(v.slice(son,m.index)));
      const sp=document.createElement('span');sp.className='terim';sp.dataset.terim=m[1];sp.textContent=m[1];if(odak)sp.tabIndex=0;f.appendChild(sp);son=m.index+m[1].length}
    if(son<v.length)f.appendChild(document.createTextNode(v.slice(son)));
    /* Düğme ve etiket gibi esnek kutularda metin tek öğe olarak kalsın: boşluklar ve aralıklar bozulmasın. */
    const d=getComputedStyle(p).display;if(/flex|grid/.test(d)){const sp=document.createElement('span');sp.appendChild(f);n.replaceWith(sp)}else n.replaceWith(f)}}
function terimBaslat(){if(TERIM.izleyici||!('MutationObserver' in window))return;const ayar={childList:true,subtree:true};let bekle=false;const eklenen=new Set();
  TERIM.izleyici=new MutationObserver(ms=>{for(const m of ms)for(const n of m.addedNodes)if(n.nodeType===1||n.nodeType===3)eklenen.add(n);
    if(bekle)return;bekle=true;requestAnimationFrame(()=>{bekle=false;TERIM.izleyici.disconnect();const L=[...eklenen];eklenen.clear();
      try{L.forEach(n=>terimIsle(n))}finally{TERIM.izleyici.observe(document.body,ayar)}})});
  terimIsle(document.body);TERIM.izleyici.observe(document.body,ayar)}
function terimGoster(el){const k=el.dataset.terim,m=terimMetni(k);const b=$('#terimKutu');if(!m){return}b.innerHTML=`<b>${esc(k)}</b>${esc(m)}`;
  try{if(!b.matches(':popover-open'))b.showPopover()}catch(_){}
  const r=el.getBoundingClientRect(),w=b.offsetWidth,h=b.offsetHeight;let x=r.left+r.width/2-w/2;x=Math.max(8,Math.min(x,innerWidth-w-8));let y=r.bottom+6;if(y+h>innerHeight-8)y=Math.max(8,r.top-h-6);
  b.style.left=x+'px';b.style.top=y+'px';TERIM.acik=el}
function terimGizle(){const b=$('#terimKutu');try{if(b.matches(':popover-open'))b.hidePopover()}catch(_){}TERIM.acik=null}
document.addEventListener('mouseover',e=>{const x=e.target.closest&&e.target.closest('.terim');if(x){if(TERIM.acik!==x)terimGoster(x)}else if(TERIM.acik)terimGizle()});
document.addEventListener('focusin',e=>{const x=e.target.closest&&e.target.closest('.terim');if(x)terimGoster(x)});
document.addEventListener('focusout',e=>{if(e.target.closest&&e.target.closest('.terim'))terimGizle()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&TERIM.acik)terimGizle()});
addEventListener('scroll',()=>TERIM.acik&&terimGizle(),true);

/* ====================== SAYFA ALTI GEZİNME ====================== */
function altGezin(){$$('.altGezin').forEach(e=>e.remove());const i=SEKMELER.indexOf(S.sekme);if(i<0)return;const kap=$('#s-'+S.sekme).firstElementChild;if(!kap)return;
  const ad=k=>t({matris:'tabMatrix',agirlik:'tabWeights',sirala:'tabRanking',karsilastir:'tabCompare',duyarlilik:'tabSensitivity',rapor:'tabReport'}[k]);
  const d=document.createElement('div');d.className='altGezin yazdirma';
  const mk=(k,tip)=>{const b=document.createElement('button');b.className='btn'+(tip==='ileri'?' btn-primary':'');b.textContent=(tip==='ileri'?t('nextStep',ad(k)):t('prevStep',ad(k)));b.onclick=()=>sekmeAc(k);return b};
  d.appendChild(i>0?mk(SEKMELER[i-1],'geri'):document.createElement('span'));if(i<SEKMELER.length-1)d.appendChild(mk(SEKMELER[i+1],'ileri'));kap.appendChild(d)}

/* ====================== YARDIM MERKEZİ ====================== */
const YARDIM_SIRA=['basla','dosya','matris','agirlik','sirala','karsilastir','duyarlilik','rapor','sss','sozluk'];
const yb=id=>{for(const d of [DILLER[S.dil],DILLER.en,DILLER.tr]){const v=d&&d.yardim&&d.yardim.bolumler&&d.yardim.bolumler[id];if(v)return v}return {b:id,h:''}};
const yy=k=>{for(const d of [DILLER[S.dil],DILLER.en,DILLER.tr]){const v=d&&d.yardim&&d.yardim[k];if(v!==undefined)return v}return ''};
const duzMetin=h=>{const d=document.createElement('div');d.innerHTML=guvenliHtml(h);return d.textContent};
function yardimBolumleri(){const L=[];
  for(const id of YARDIM_SIRA){const b=yb(id);let h=guvenliHtml(b.h||'');
    if(id==='agirlik')h+=`<p><b>${esc(yy('agirlikYontemleri'))}</b></p>`+AGIRLIK_YONTEM.map(y=>`<p><b>${esc(yontemAd(y))}.</b> ${esc(tAlt('yontemKisa',y))}</p>`+(tAlt('yontemAcik',y)?`<div class="ipucu-metin">${guvenliHtml(tAlt('yontemAcik',y))}</div>`:'')).join('');
    if(id==='sirala')h+=`<p><b>${esc(yy('siralamaYontemleri'))}</b></p>`+SIRALAMA_YONTEM.map(y=>`<p><b>${esc(yontemAd(y))}.</b> ${esc(tAlt('yontemKisa',y))}</p>`+(tAlt('ipucu','y_'+y)?`<div class="ipucu-metin">${guvenliHtml(tAlt('ipucu','y_'+y))}</div>`:'')).join('');
    L.push({id,b:b.b,h,ara:katla(b.b+' '+duzMetin(h))})}
  return L}
function yardimDoldur(){const q=katla(($('#ydAra').value||'').trim()),kel=q.split(/\s+/).filter(Boolean);const soz=terimSozluk();
  const eslesir=m=>kel.every(k=>m.includes(k));const girdiler=Object.entries(soz).sort((a,b)=>katla(a[0]).localeCompare(katla(b[0]),S.dil));
  const B=yardimBolumleri();let say=0;let ic='',yan='';
  for(const b of B){let html=b.h,goster=true;
    if(b.id==='sozluk'){const g=girdiler.filter(([k,v])=>!kel.length||eslesir(katla(k+' '+v)));html=`<dl class="yd-sozluk">${g.map(([k,v])=>`<dt>${esc(k)}</dt><dd>${esc(v)}</dd>`).join('')}</dl>`;goster=g.length>0;
      if(goster&&kel.length&&!eslesir(b.ara))say+=0}
    else if(kel.length&&!eslesir(b.ara))goster=false;
    if(!goster)continue;say++;ic+=`<section class="yd-bolum" id="yd-${b.id}"><h2>${esc(b.b)}</h2>${html}</section>`;yan+=`<a href="#yd-${b.id}" data-ydgit="${b.id}">${esc(b.b)}</a>`}
  $('#ydIcerik').innerHTML=say?ic:`<p class="text-base-content/70">${esc(yy('sonucYok'))}</p>`;$('#ydYan').innerHTML=yan;
  $$('#ydYan [data-ydgit]').forEach(a=>a.onclick=e=>{e.preventDefault();const h=$('#yd-'+a.dataset.ydgit);if(h){h.scrollIntoView({behavior:'smooth',block:'start'});$$('#ydYan a').forEach(x=>x.classList.toggle('act',x===a))}})}
function cizYardim(){const el=$('#s-yardim');
  if(el.dataset.dil!==S.dil){el.dataset.dil=S.dil;
    el.innerHTML=`<div class="max-w-7xl mx-auto px-3 sm:px-6 py-6 w-full">
      <h1>${esc(yy('baslik'))}</h1><p class="text-base-content/70 mt-1 max-w-2xl">${esc(yy('alt'))}</p>
      <div class="mt-5 max-w-xl"><input id="ydAra" type="search" class="input w-full" placeholder="${esc(t('helpSearch'))}" aria-label="${esc(t('helpSearch'))}"></div>
      <div class="grid lg:grid-cols-[15rem_minmax(0,1fr)] gap-8 mt-6"><nav id="ydYan" class="yd-yan bg-base-100 border border-base-300 hidden lg:block" aria-label="${esc(yy('baslik'))}"></nav><div id="ydIcerik" class="space-y-12 min-w-0"></div></div></div>`;
    $('#ydAra').oninput=yardimDoldur;yardimDoldur();return}
  yardimDoldur()}

terimBaslat();
