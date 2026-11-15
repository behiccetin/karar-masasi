/* ====================== HESAP ÇEKİRDEĞİ ======================
   Bütün yöntemler aynı girdiyi alır: X (m alternatif x n kriter), yon ('max' fayda, 'min' maliyet), w (ağırlıklar).
   Her yöntem {skor, sira, ort, adimlar} döndürür. adimlar raporda ve ekranda adım adım tablo olarak gösterilir. */
const EPS=1e-12;
const topla=a=>a.reduce((s,x)=>s+x,0);
const sut=(X,j)=>X.map(r=>r[j]);
const enb=a=>Math.max(...a),enk=a=>Math.min(...a);
const ort=a=>topla(a)/a.length;
function ss(a,orneklem=true){const o=ort(a);const n=a.length-(orneklem?1:0);return n>0?Math.sqrt(topla(a.map(x=>(x-o)**2))/n):0}
function pearson(a,b){const oa=ort(a),ob=ort(b);let p=0,qa=0,qb=0;for(let i=0;i<a.length;i++){p+=(a[i]-oa)*(b[i]-ob);qa+=(a[i]-oa)**2;qb+=(b[i]-ob)**2}return qa<EPS||qb<EPS?0:p/Math.sqrt(qa*qb)}
/* Yarışma sıralaması (1, 2, 2, 4). buyukIyi: yüksek puan daha iyi. */
function siraBul(skor,buyukIyi=true){return skor.map((s,i)=>1+skor.filter((x,k)=>k!==i&&(buyukIyi?x>s+1e-10:x<s-1e-10)).length)}
/* Ortalama sıra (bağlarda ortalama): Spearman için. */
function ortSira(skor,buyukIyi=true){return skor.map((s,i)=>{const ust=skor.filter((x,k)=>k!==i&&(buyukIyi?x>s+1e-10:x<s-1e-10)).length;const esit=skor.filter((x,k)=>k!==i&&Math.abs(x-s)<=1e-10).length;return ust+1+esit/2})}
const spearman=(r1,r2)=>pearson(r1,r2);
const adim=(k,sutun,satirlar,not)=>({k,sutun,satirlar,not:not||''});
const matrisAdim=(k,A,C,M,not)=>adim(k,['',...C],M.map((r,i)=>[A[i],...r]),not);
const sonuc=(skor,buyukIyi,adimlar,ek={})=>({skor,sira:siraBul(skor,buyukIyi),ort:ortSira(skor,buyukIyi),buyukIyi,adimlar,...ek});

/* ---------- Normalleştirmeler ---------- */
function normDogrusal(X,yon){const n=X[0].length;const mx=[],mn=[];for(let j=0;j<n;j++){const c=sut(X,j);mx[j]=enb(c);mn[j]=enk(c)}
  return X.map(r=>r.map((x,j)=>yon[j]==='max'?x/mx[j]:mn[j]/x))}
function normVektor(X){const n=X[0].length;const d=[];for(let j=0;j<n;j++)d[j]=Math.sqrt(topla(sut(X,j).map(x=>x*x)));return X.map(r=>r.map((x,j)=>d[j]>EPS?x/d[j]:0))}
function normMinMax(X,yon){const n=X[0].length;const mx=[],mn=[];for(let j=0;j<n;j++){const c=sut(X,j);mx[j]=enb(c);mn[j]=enk(c)}
  return X.map(r=>r.map((x,j)=>{const a=mx[j]-mn[j];if(a<EPS)return 1;return yon[j]==='max'?(x-mn[j])/a:(mx[j]-x)/a}))}
const agirliklandir=(N,w)=>N.map(r=>r.map((x,j)=>x*w[j]));

/* ---------- Veri gereksinimleri ---------- */
const GEREK={topsis:'hepsi',vikor:'hepsi',moora:'hepsi',mabac:'hepsi',edas:'negatifsiz',waspas:'pozitif',copras:'pozitif',aras:'pozitif',marcos:'pozitif',saw:'pozitif',entropi:'negatifsiz',merec:'pozitif'};
function gerekKontrol(X,tur){const v=X.flat();if(tur==='pozitif'&&v.some(x=>x<=0))return 'needPositive';if(tur==='negatifsiz'&&v.some(x=>x<0))return 'needNonNegative';return null}

/* ====================== AĞIRLIK YÖNTEMLERİ ====================== */
const AGIRLIK={
  esit(X,yon,ctx){const n=yon.length;return {w:Array(n).fill(1/n),adimlar:[]}},
  dogrudan(X,yon,ctx){const v=ctx.C.map((c,j)=>Math.max(0,+(ctx.dogrudan[ctx.Cid[j]]??0)||0));const s=topla(v);if(s<=0)return {hata:'directEmpty'};
    const w=v.map(x=>x/s);return {w,adimlar:[adim('stDirect',['',t('colScore'),t('colWeight')],ctx.C.map((c,j)=>[c,v[j],w[j]]))]}},
  entropi(X,yon,ctx){const h=gerekKontrol(X,'negatifsiz');if(h)return {hata:h};const m=X.length,n=yon.length;const cs=[];for(let j=0;j<n;j++){cs[j]=topla(sut(X,j));if(cs[j]<=0)return {hata:'entropyZeroCol'}}
    const p=X.map(r=>r.map((x,j)=>x/cs[j]));const k=1/Math.log(m);const E=[],d=[];
    for(let j=0;j<n;j++){E[j]=-k*topla(sut(p,j).map(x=>x>0?x*Math.log(x):0));d[j]=1-E[j]}const sd=topla(d);if(sd<=EPS)return {hata:'entropyNoDiv'};const w=d.map(x=>x/sd);
    return {w,adimlar:[matrisAdim('stEntropyP',ctx.A,ctx.C,p),adim('stEntropyE',['',t('colEj'),t('colDj'),t('colWeight')],ctx.C.map((c,j)=>[c,E[j],d[j],w[j]]),t('noteEntropy'))]}},
  critic(X,yon,ctx){const n=yon.length;const N=normMinMax(X,yon);const sg=[],r=[],C=[];for(let j=0;j<n;j++)sg[j]=ss(sut(N,j));
    for(let j=0;j<n;j++){r[j]=[];for(let k=0;k<n;k++)r[j][k]=j===k?1:pearson(sut(N,j),sut(N,k))}
    for(let j=0;j<n;j++)C[j]=sg[j]*topla(r[j].map(x=>1-x));const s=topla(C);if(s<=EPS)return {hata:'criticZero'};const w=C.map(x=>x/s);
    return {w,adimlar:[matrisAdim('stMinMax',ctx.A,ctx.C,N),matrisAdim('stCorr',ctx.C,ctx.C,r),adim('stCritic',['',t('colSd'),t('colSum1r'),t('colCj'),t('colWeight')],ctx.C.map((c,j)=>[c,sg[j],topla(r[j].map(x=>1-x)),C[j],w[j]]),t('noteSd'))]}},
  sd(X,yon,ctx){const n=yon.length;const N=normMinMax(X,yon);const sg=[];for(let j=0;j<n;j++)sg[j]=ss(sut(N,j));const s=topla(sg);if(s<=EPS)return {hata:'criticZero'};const w=sg.map(x=>x/s);
    return {w,adimlar:[matrisAdim('stMinMax',ctx.A,ctx.C,N),adim('stSd',['',t('colSd'),t('colWeight')],ctx.C.map((c,j)=>[c,sg[j],w[j]]),t('noteSd'))]}},
  merec(X,yon,ctx){const h=gerekKontrol(X,'pozitif');if(h)return {hata:h};const m=X.length,n=yon.length;const mx=[],mn=[];for(let j=0;j<n;j++){mx[j]=enb(sut(X,j));mn[j]=enk(sut(X,j))}
    const N=X.map(r=>r.map((x,j)=>yon[j]==='max'?mn[j]/x:x/mx[j]));const Si=N.map(r=>Math.log(1+topla(r.map(x=>Math.abs(Math.log(x))))/n));
    const Sp=N.map(r=>r.map((_,j)=>Math.log(1+topla(r.map((x,k)=>k===j?0:Math.abs(Math.log(x))))/n)));
    const E=[];for(let j=0;j<n;j++)E[j]=topla(Sp.map((r,i)=>Math.abs(r[j]-Si[i])));const s=topla(E);if(s<=EPS)return {hata:'criticZero'};const w=E.map(x=>x/s);
    return {w,adimlar:[matrisAdim('stMerecN',ctx.A,ctx.C,N),adim('stMerecS',['',t('colSi')],ctx.A.map((a,i)=>[a,Si[i]])),matrisAdim('stMerecSp',ctx.A,ctx.C,Sp),adim('stMerecE',['',t('colEj'),t('colWeight')],ctx.C.map((c,j)=>[c,E[j],w[j]]))]}},
  ahp(X,yon,ctx){return ahpHesap(ctx)},
  bwm(X,yon,ctx){return bwmHesap(ctx)}};
const OBJEKTIF=new Set(['entropi','critic','sd','merec']);

/* ====================== AHP ====================== */
const RI=[0,0,0,0.58,0.90,1.12,1.24,1.32,1.41,1.45,1.49,1.51,1.48,1.56,1.57,1.59];
const SAATY=[1/9,1/8,1/7,1/6,1/5,1/4,1/3,1/2,1,2,3,4,5,6,7,8,9];
function ahpDeger(m,a,b){if(a===b)return 1;const v=m[a+'|'+b];if(typeof v==='number'&&v>0)return v;const r=m[b+'|'+a];if(typeof r==='number'&&r>0)return 1/r;return null}
function ahpMatris(m,ids){return ids.map(a=>ids.map(b=>ahpDeger(m,a,b)))}
function ozvektor(A){const n=A.length;let w=Array(n).fill(1/n);for(let it=0;it<5000;it++){const y=A.map(r=>topla(r.map((x,j)=>x*w[j])));const s=topla(y);const v=y.map(x=>x/s);
    const fark=Math.max(...v.map((x,i)=>Math.abs(x-w[i])));w=v;if(fark<1e-14)break}
  const Aw=A.map(r=>topla(r.map((x,j)=>x*w[j])));const lmax=ort(Aw.map((x,i)=>x/w[i]));return {w,lmax}}
function tutarlilik(A){const n=A.length;const {w,lmax}=ozvektor(A);const ci=n>2?(lmax-n)/(n-1):0;const ri=RI[Math.min(n,15)]||1.59;const cr=n>2?ci/ri:0;return {w,lmax,ci,ri,cr}}
/* En tutarsız yargı: a_ij ile w_i/w_j oranı arasındaki en büyük sapma; önerilen değer en yakın Saaty değeri. */
function enTutarsiz(A,w){let en=null;for(let i=0;i<A.length;i++)for(let j=i+1;j<A.length;j++){const e=Math.abs(Math.log(A[i][j]*w[j]/w[i]));if(!en||e>en.e)en={i,j,e,oneri:SAATY.reduce((b,s)=>Math.abs(Math.log(s/(w[i]/w[j])))<Math.abs(Math.log(b/(w[i]/w[j])))?s:b,1)}}return en}
function ahpUzmanlar(ctx){return ctx.ahp.uzmanlar.map(u=>{const A=ahpMatris(u.m,ctx.Cid);const eksik=A.flat().filter(x=>x==null).length/2;return {u,A,eksik}})}
function ahpHesap(ctx){const n=ctx.Cid.length;if(n<2)return {hata:'needCriteria'};const U=ahpUzmanlar(ctx);if(!U.length)return {hata:'ahpNoExpert'};
  const eksik=U.filter(x=>x.eksik>0);if(eksik.length)return {hata:'ahpIncomplete',hataArg:[eksik.map(x=>x.u.ad||t('expertN',U.indexOf(x)+1)).join(', ')]};
  const bir=U.map(x=>({...x,...tutarlilik(x.A)}));const adimlar=[];const C=ctx.C;
  bir.forEach((x,k)=>{if(U.length>1)adimlar.push(matrisAdim('stAhpExpert',C,C,x.A,t('ahpCrLine',x.u.ad||t('expertN',k+1),sayi(x.cr,4))))});
  let G,w,ozet;
  if(ctx.ahp.birlestir==='aip'&&U.length>1){const gw=C.map((_,j)=>Math.exp(ort(bir.map(x=>Math.log(x.w[j])))));const s=topla(gw);w=gw.map(x=>x/s);G=null;
    adimlar.push(adim('stAhpAip',['',...bir.map((x,k)=>x.u.ad||t('expertN',k+1)),t('colGeoMean'),t('colWeight')],C.map((c,j)=>[c,...bir.map(x=>x.w[j]),gw[j],w[j]])));ozet={cr:Math.max(...bir.map(x=>x.cr)),lmax:null,ci:null,ri:RI[Math.min(n,15)]}}
  else{G=C.map((_,i)=>C.map((_,j)=>Math.exp(ort(U.map(x=>Math.log(x.A[i][j]))))));const tt=tutarlilik(G);w=tt.w;ozet=tt;
    adimlar.push(matrisAdim(U.length>1?'stAhpGroup':'stAhpMatrix',C,C,G,U.length>1?t('noteAij'):''));
    const cs=C.map((_,j)=>topla(G.map(r=>r[j])));adimlar.push(matrisAdim('stAhpNorm',C,C,G.map(r=>r.map((x,j)=>x/cs[j])),t('noteAhpNorm')));
    adimlar.push(adim('stAhpWeights',['',t('colAw'),t('colAwW'),t('colWeight')],C.map((c,j)=>{const aw=topla(G[j].map((x,k)=>x*w[k]));return [c,aw,aw/w[j],w[j]]})));
    adimlar.push(adim('stAhpCons',[t('colMeasure'),t('colValue')],[['λmax',tt.lmax],['n',n],['CI',tt.ci],['RI',tt.ri],['CR',tt.cr]],t('noteCr')))}
  const uyari=[];bir.forEach((x,k)=>{if(n>2&&x.cr>0.1){const et=enTutarsiz(x.A,x.w);uyari.push(t('ahpCrHigh',x.u.ad||t('expertN',k+1),sayi(x.cr,3),C[et.i],C[et.j],saatyYaz(x.A[et.i][et.j]),saatyYaz(et.oneri)))}});
  if(n>15)uyari.push(t('ahpTooMany'));
  return {w,adimlar,uyari,ahp:{uzman:bir.map(x=>({ad:x.u.ad,cr:x.cr,lmax:x.lmax,ci:x.ci})),G,...ozet,birlestir:U.length>1?ctx.ahp.birlestir:null}}}
function saatyYaz(v){if(v>=1)return sayi(Math.round(v*1000)/1000,v%1?2:0);const r=1/v;return Math.abs(r-Math.round(r))<1e-6?'1/'+Math.round(r):sayi(v,3)}

/* ====================== BWM (doğrusal model, Rezaei 2016) ======================
   min ξ, |w_B - a_Bj w_j| <= ξ, |w_j - a_jW w_W| <= ξ, Σw = 1, w >= 0. Küçük bir simpleks çözücüyle (Büyük M, Bland kuralı). */
function lpEnKucuk(c,Aub,bub,Aeq,beq){const nv=c.length,mu=Aub.length,me=Aeq.length,M=1e7,nc=nv+mu+me;const T=[],bas=[];
  for(let i=0;i<mu;i++){const r=new Array(nc+1).fill(0);for(let j=0;j<nv;j++)r[j]=Aub[i][j];r[nv+i]=1;r[nc]=bub[i];T.push(r);bas.push(nv+i)}
  for(let i=0;i<me;i++){const r=new Array(nc+1).fill(0);for(let j=0;j<nv;j++)r[j]=Aeq[i][j];r[nv+mu+i]=1;r[nc]=beq[i];T.push(r);bas.push(nv+mu+i)}
  const cost=new Array(nc).fill(0);for(let j=0;j<nv;j++)cost[j]=c[j];for(let i=0;i<me;i++)cost[nv+mu+i]=M;
  for(let it=0;it<5000;it++){let gir=-1;for(let j=0;j<nc;j++){let d=cost[j];for(let i=0;i<T.length;i++)d-=cost[bas[i]]*T[i][j];if(d<-1e-9){gir=j;break}}
    if(gir<0)break;let cik=-1,en=Infinity;for(let i=0;i<T.length;i++){if(T[i][gir]>1e-12){const o=T[i][nc]/T[i][gir];if(o<en-1e-12||(Math.abs(o-en)<=1e-12&&bas[i]<bas[cik])){en=o;cik=i}}}
    if(cik<0)return null;const pv=T[cik][gir];for(let j=0;j<=nc;j++)T[cik][j]/=pv;for(let i=0;i<T.length;i++)if(i!==cik&&Math.abs(T[i][gir])>0){const f=T[i][gir];for(let j=0;j<=nc;j++)T[i][j]-=f*T[cik][j]}bas[cik]=gir}
  const x=new Array(nv).fill(0);bas.forEach((b,i)=>{if(b<nv)x[b]=T[i][nc]});for(let i=0;i<me;i++){const k=bas.indexOf(nv+mu+i);if(k>=0&&T[k][nc]>1e-7)return null}return x}
const BWM_ESIK=[[0.1667,0.1667,0.1667,0.1667,0.1667,0.1667,0.1667],[0.1121,0.1529,0.1898,0.2206,0.2527,0.2577,0.2683],[0.1354,0.1994,0.2306,0.2546,0.2716,0.2844,0.2960],
  [0.1330,0.1990,0.2643,0.3044,0.3144,0.3221,0.3262],[0.1294,0.2457,0.2819,0.3029,0.3144,0.3251,0.3403],[0.1309,0.2521,0.2958,0.3154,0.3408,0.3620,0.3657],[0.1359,0.2681,0.3062,0.3337,0.3517,0.3620,0.3662]];
function bwmEsik(aBW,n){if(aBW<3||aBW>9||n<3||n>9)return null;return BWM_ESIK[Math.round(aBW)-3][n-3]}
function bwmTek(u,ids){const n=ids.length;const B=ids.indexOf(u.en),W=ids.indexOf(u.kotu);if(B<0||W<0)return {hata:'bwmChoose'};
  const aB=ids.map(id=>+u.bo[id]),aW=ids.map(id=>+u.ow[id]);aB[B]=1;aW[W]=1;if(aB.some(x=>!(x>=1&&x<=9))||aW.some(x=>!(x>=1&&x<=9)))return {hata:'bwmIncomplete'};
  if(B===W&&n>1)return {hata:'bwmSame'};
  const nv=n+1,c=Array(nv).fill(0);c[n]=1;const Aub=[],bub=[];const satir=()=>Array(nv).fill(0);
  for(let j=0;j<n;j++){let r=satir();r[B]+=1;r[j]-=aB[j];r[n]=-1;Aub.push(r);bub.push(0);r=satir();r[B]-=1;r[j]+=aB[j];r[n]=-1;Aub.push(r);bub.push(0);
    r=satir();r[j]+=1;r[W]-=aW[j];r[n]=-1;Aub.push(r);bub.push(0);r=satir();r[j]-=1;r[W]+=aW[j];r[n]=-1;Aub.push(r);bub.push(0)}
  const eq=satir();for(let j=0;j<n;j++)eq[j]=1;const x=lpEnKucuk(c,Aub,bub,[eq],[1]);if(!x)return {hata:'bwmSolve'};
  const w=x.slice(0,n),xi=x[n];const aBW=aB[W];const crI=aBW>1?Math.max(...ids.map((_,j)=>Math.abs(aB[j]*aW[j]-aBW)/(aBW*(aBW-1)))):0;
  return {w,xi,crI,aBW,aB,aW,B,W,esik:bwmEsik(aBW,n)}}
function bwmHesap(ctx){const ids=ctx.Cid,C=ctx.C;if(ids.length<2)return {hata:'needCriteria'};const U=ctx.bwm.uzmanlar;if(!U.length)return {hata:'bwmNoExpert'};
  const R=U.map(u=>({u,...bwmTek(u,ids)}));const hata=R.find(r=>r.hata);if(hata)return {hata:hata.hata,hataArg:[hata.u.ad||t('expertN',U.indexOf(hata.u)+1)]};
  const adimlar=[],uyari=[];R.forEach((r,k)=>{const ad=r.u.ad||t('expertN',k+1);
    adimlar.push(adim('stBwmVec',['',t('colBO',C[r.B]),t('colOW',C[r.W]),t('colWeight')],C.map((c,j)=>[c,r.aB[j],r.aW[j],r.w[j]]),t('bwmLine',ad,sayi(r.xi,4),sayi(r.crI,4),r.esik==null?'-':sayi(r.esik,4))));
    if(r.esik!=null&&r.crI>r.esik)uyari.push(t('bwmCrHigh',ad,sayi(r.crI,3),sayi(r.esik,3)))});
  let w=R[0].w;if(R.length>1){w=C.map((_,j)=>ort(R.map(r=>r.w[j])));const s=topla(w);w=w.map(x=>x/s);adimlar.push(adim('stBwmGroup',['',...R.map((r,k)=>r.u.ad||t('expertN',k+1)),t('colWeight')],C.map((c,j)=>[c,...R.map(r=>r.w[j]),w[j]]),t('noteBwmGroup')))}
  return {w,adimlar,uyari,bwm:R.map(r=>({ad:r.u.ad,xi:r.xi,crI:r.crI,esik:r.esik}))}}

/* ====================== SIRALAMA YÖNTEMLERİ ====================== */
const SIRALA={
  saw(X,yon,w,ctx){const N=normDogrusal(X,yon),V=agirliklandir(N,w);const s=V.map(topla);
    return sonuc(s,true,[matrisAdim('stLinNorm',ctx.A,ctx.C,N,t('noteLinNorm')),matrisAdim('stWeighted',ctx.A,ctx.C,V),adim('stScore',['',t('colScore'),t('colRank')],ctx.A.map((a,i)=>[a,s[i],siraBul(s)[i]]))])},
  topsis(X,yon,w,ctx){const N=normVektor(X),V=agirliklandir(N,w);const n=w.length;const ip=[],in_=[];
    for(let j=0;j<n;j++){const c=sut(V,j);ip[j]=yon[j]==='max'?enb(c):enk(c);in_[j]=yon[j]==='max'?enk(c):enb(c)}
    const dp=V.map(r=>Math.sqrt(topla(r.map((x,j)=>(x-ip[j])**2)))),dn=V.map(r=>Math.sqrt(topla(r.map((x,j)=>(x-in_[j])**2))));
    const Cc=dp.map((d,i)=>d+dn[i]>EPS?dn[i]/(d+dn[i]):0);const sr=siraBul(Cc);
    return sonuc(Cc,true,[matrisAdim('stVecNorm',ctx.A,ctx.C,N,t('noteVecNorm')),matrisAdim('stWeighted',ctx.A,ctx.C,V),adim('stIdeal',['',...ctx.C],[[t('rowPIS'),...ip],[t('rowNIS'),...in_]]),
      adim('stTopsis',['','S⁺','S⁻','C*',t('colRank')],ctx.A.map((a,i)=>[a,dp[i],dn[i],Cc[i],sr[i]]))])},
  vikor(X,yon,w,ctx){const v=ctx.param.v,n=w.length,m=X.length;const fs=[],fe=[];for(let j=0;j<n;j++){const c=sut(X,j);fs[j]=yon[j]==='max'?enb(c):enk(c);fe[j]=yon[j]==='max'?enk(c):enb(c)}
    const T=X.map(r=>r.map((x,j)=>Math.abs(fs[j]-fe[j])<EPS?0:w[j]*(fs[j]-x)/(fs[j]-fe[j])));const Sv=T.map(topla),Rv=T.map(r=>Math.max(...r));
    const Ss=enk(Sv),Se=enb(Sv),Rs=enk(Rv),Re=enb(Rv);const Q=Sv.map((s,i)=>v*(Se-Ss>EPS?(s-Ss)/(Se-Ss):0)+(1-v)*(Re-Rs>EPS?(Rv[i]-Rs)/(Re-Rs):0));
    const srQ=siraBul(Q,false),srS=siraBul(Sv,false),srR=siraBul(Rv,false);const sirali=Q.map((q,i)=>i).sort((a,b)=>Q[a]-Q[b]);
    const DQ=m>1?1/(m-1):0;const a1=sirali[0],a2=sirali[1];const c1=m<2||Q[a2]-Q[a1]>=DQ-1e-12;const c2=srS[a1]===1||srR[a1]===1;
    let uzlasi=[a1];if(!c1){uzlasi=sirali.filter(i=>Q[i]-Q[a1]<DQ-1e-12)}else if(!c2)uzlasi=[a1,a2];
    const kosul=t('vikorCond',sayi(DQ,4),sayi(Q[a2]-Q[a1],4),c1?t('yes'):t('no'),c2?t('yes'):t('no'),uzlasi.map(i=>ctx.A[i]).join(', '));
    return sonuc(Q,false,[{...adim('stVikorF',['',...ctx.C],[['f*',...fs],['f⁻',...fe]]),ham:true},matrisAdim('stVikorT',ctx.A,ctx.C,T,t('noteVikorT')),
      adim('stVikor',['','S','R','Q',t('colRankS'),t('colRankR'),t('colRankQ')],ctx.A.map((a,i)=>[a,Sv[i],Rv[i],Q[i],srS[i],srR[i],srQ[i]]),kosul)],{vikor:{S:Sv,R:Rv,c1,c2,uzlasi,DQ}})},
  moora(X,yon,w,ctx){const N=normVektor(X),V=agirliklandir(N,w);const ar=V.map(r=>topla(r.filter((_,j)=>yon[j]==='max'))),ek=V.map(r=>topla(r.filter((_,j)=>yon[j]==='min')));const y=ar.map((a,i)=>a-ek[i]);
    return sonuc(y,true,[matrisAdim('stVecNorm',ctx.A,ctx.C,N,t('noteVecNorm')),matrisAdim('stWeighted',ctx.A,ctx.C,V),adim('stMoora',['',t('colSumMax'),t('colSumMin'),'y*',t('colRank')],ctx.A.map((a,i)=>[a,ar[i],ek[i],y[i],siraBul(y)[i]]))])},
  waspas(X,yon,w,ctx){const L=ctx.param.lambda;const N=normDogrusal(X,yon);const q1=N.map(r=>topla(r.map((x,j)=>x*w[j]))),q2=N.map(r=>r.reduce((p,x,j)=>p*Math.pow(x,w[j]),1));const Q=q1.map((a,i)=>L*a+(1-L)*q2[i]);
    return sonuc(Q,true,[matrisAdim('stLinNorm',ctx.A,ctx.C,N,t('noteLinNorm')),adim('stWaspas',['','Q⁽¹⁾ (WSM)','Q⁽²⁾ (WPM)','Q',t('colRank')],ctx.A.map((a,i)=>[a,q1[i],q2[i],Q[i],siraBul(Q)[i]]),t('noteWaspas',sayi(L,2)))])},
  edas(X,yon,w,ctx){const n=w.length;const AV=[];for(let j=0;j<n;j++)AV[j]=ort(sut(X,j));if(AV.some(a=>Math.abs(a)<EPS))return {hata:'edasZeroAvg'};
    const PDA=X.map(r=>r.map((x,j)=>Math.max(0,yon[j]==='max'?(x-AV[j]):(AV[j]-x))/AV[j])),NDA=X.map(r=>r.map((x,j)=>Math.max(0,yon[j]==='max'?(AV[j]-x):(x-AV[j]))/AV[j]));
    const SP=PDA.map(r=>topla(r.map((x,j)=>x*w[j]))),SN=NDA.map(r=>topla(r.map((x,j)=>x*w[j])));const mp=enb(SP),mn=enb(SN);
    const NSP=SP.map(x=>mp>EPS?x/mp:0),NSN=SN.map(x=>mn>EPS?1-x/mn:1);const AS=NSP.map((x,i)=>(x+NSN[i])/2);
    return sonuc(AS,true,[adim('stEdasAv',['',...ctx.C],[['AV',...AV]]),matrisAdim('stEdasPda',ctx.A,ctx.C,PDA),matrisAdim('stEdasNda',ctx.A,ctx.C,NDA),
      adim('stEdas',['','SP','SN','NSP','NSN','AS',t('colRank')],ctx.A.map((a,i)=>[a,SP[i],SN[i],NSP[i],NSN[i],AS[i],siraBul(AS)[i]]))])},
  copras(X,yon,w,ctx){const n=w.length;const cs=[];for(let j=0;j<n;j++)cs[j]=topla(sut(X,j));const D=X.map(r=>r.map((x,j)=>w[j]*x/cs[j]));
    const Sp=D.map(r=>topla(r.filter((_,j)=>yon[j]==='max'))),Sm=D.map(r=>topla(r.filter((_,j)=>yon[j]==='min')));const maliyetVar=yon.includes('min');
    const Q=maliyetVar?Sp.map((s,i)=>s+topla(Sm)/(Sm[i]*topla(Sm.map(x=>1/x)))):Sp.slice();const U=Q.map(q=>q/enb(Q)*100);
    return sonuc(Q,true,[matrisAdim('stCoprasD',ctx.A,ctx.C,D,t('noteCopras')),adim('stCopras',['','S⁺','S⁻','Q',t('colUtility'),t('colRank')],ctx.A.map((a,i)=>[a,Sp[i],Sm[i],Q[i],U[i],siraBul(Q)[i]]))],{copras:{U}})},
  aras(X,yon,w,ctx){const n=w.length;const x0=[];for(let j=0;j<n;j++){const c=sut(X,j);x0[j]=yon[j]==='max'?enb(c):enk(c)}const T=[x0,...X].map(r=>r.map((x,j)=>yon[j]==='max'?x:1/x));
    const cs=[];for(let j=0;j<n;j++)cs[j]=topla(sut(T,j));const N=T.map(r=>r.map((x,j)=>x/cs[j])),V=agirliklandir(N,w);const Sv=V.map(topla);const K=Sv.slice(1).map(s=>s/Sv[0]);
    const A0=[t('rowOptimal'),...ctx.A];return sonuc(K,true,[{...adim('stArasX0',['',...ctx.C],[[t('rowOptimal'),...x0]]),ham:true},matrisAdim('stArasN',A0,ctx.C,N,t('noteAras')),matrisAdim('stWeighted',A0,ctx.C,V),
      adim('stAras',['','S','K',t('colRank')],[[t('rowOptimal'),Sv[0],1,'-'],...ctx.A.map((a,i)=>[a,Sv[i+1],K[i],siraBul(K)[i]])])])},
  mabac(X,yon,w,ctx){const m=X.length,n=w.length;const N=X.map(r=>r.slice());const mx=[],mn=[];for(let j=0;j<n;j++){mx[j]=enb(sut(X,j));mn[j]=enk(sut(X,j))}
    for(const r of N)for(let j=0;j<n;j++){const a=mx[j]-mn[j];r[j]=a<EPS?1:(yon[j]==='max'?(r[j]-mn[j])/a:(r[j]-mx[j])/(mn[j]-mx[j]))}
    const V=N.map(r=>r.map((x,j)=>w[j]*(x+1)));const G=[];for(let j=0;j<n;j++)G[j]=Math.pow(sut(V,j).reduce((p,x)=>p*x,1),1/m);
    const Q=V.map(r=>r.map((x,j)=>x-G[j]));const Sv=Q.map(topla);
    return sonuc(Sv,true,[matrisAdim('stMinMax',ctx.A,ctx.C,N),matrisAdim('stMabacV',ctx.A,ctx.C,V,t('noteMabacV')),adim('stMabacG',['',...ctx.C],[['G',...G]]),matrisAdim('stMabacQ',ctx.A,ctx.C,Q),
      adim('stScore',['','S',t('colRank')],ctx.A.map((a,i)=>[a,Sv[i],siraBul(Sv)[i]]))])},
  marcos(X,yon,w,ctx){const n=w.length;const aai=[],ai=[];for(let j=0;j<n;j++){const c=sut(X,j);aai[j]=yon[j]==='max'?enk(c):enb(c);ai[j]=yon[j]==='max'?enb(c):enk(c)}
    const E=[aai,...X,ai];const N=E.map(r=>r.map((x,j)=>yon[j]==='max'?x/ai[j]:ai[j]/x)),V=agirliklandir(N,w);const Sv=V.map(topla);const Saai=Sv[0],Sai=Sv[Sv.length-1];
    const Km=[],Kp=[],F=[];for(let i=1;i<Sv.length-1;i++){const km=Sv[i]/Saai,kp=Sv[i]/Sai;const fkp=km/(kp+km),fkm=kp/(kp+km);Km.push(km);Kp.push(kp);F.push((kp+km)/(1+(1-fkp)/fkp+(1-fkm)/fkm))}
    const AE=[t('rowAAI'),...ctx.A,t('rowAI')];
    return sonuc(F,true,[matrisAdim('stMarcosN',AE,ctx.C,N,t('noteMarcos')),matrisAdim('stWeighted',AE,ctx.C,V),
      adim('stMarcos',['','S','K⁻','K⁺','f(K)',t('colRank')],ctx.A.map((a,i)=>[a,Sv[i+1],Km[i],Kp[i],F[i],siraBul(F)[i]]),t('noteMarcosS',sayi(Saai,4),sayi(Sai,4)))])}};

/* ====================== HAZIRLIK VE BÜTÜN HESAP ====================== */
function matrisDurum(p=P()){const C=p.kriterler,A=p.alternatifler;const o={tamam:false,A:A.map((a,i)=>a.ad||t('altN',i+1)),C:C.map((k,j)=>k.ad||t('critN',j+1)),Cid:C.map(k=>k.id),yon:C.map(k=>k.yon),eksik:0,X:null,sorun:null};
  if(A.length<2||C.length<2){o.sorun=A.length<2?'needAlternatives':'needCriteria';return o}
  const X=A.map(a=>C.map(k=>p.X[a.id]?.[k.id]??null));o.eksik=X.flat().filter(x=>x==null).length;if(o.eksik){o.sorun='matrixIncomplete';return o}
  o.X=X;o.tamam=true;return o}
function baglam(p,md){return {A:md.A,C:md.C,Cid:md.Cid,param:p.param,dogrudan:p.agirlik.dogrudan,ahp:p.agirlik.ahp,bwm:p.agirlik.bwm}}
function agirlikHesap(p=P(),md=matrisDurum(p)){const y=p.agirlik.yontem,ctx=baglam(p,md);
  if(md.Cid.length<2)return {hata:'needCriteria'};
  if(OBJEKTIF.has(y)&&!md.tamam)return {hata:md.sorun,hataArg:[sayi(md.eksik)]};
  try{const r=AGIRLIK[y](md.X,md.yon,ctx);if(r.hata)return r;if(r.w.some(x=>!isFinite(x)))return {hata:'calcError'};return {uyari:[],...r}}catch(e){console.error(e);return {hata:'calcError'}}}
function siralamaHesap(y,X,yon,w,ctx){const g=GEREK[y];const h=g?gerekKontrol(X,g):null;if(h)return {hata:h};try{const r=SIRALA[y](X,yon,w,ctx);if(r.hata)return r;if(r.skor.some(x=>!isFinite(x)))return {hata:'calcError'};return r}catch(e){console.error(e);return {hata:'calcError'}}}
/* Bütün sonuçlar tek yerde hesaplanır ve S.sonuc'ta saklanır; proje değişince sıfırlanır. */
function hesapla(){if(S.sonuc&&S.sonuc.dil===S.dil)return S.sonuc;const p=P(),md=matrisDurum(p),ag=agirlikHesap(p,md),ctx=baglam(p,md);const R={dil:S.dil,md,ag,yon:{},hazir:false};
  if(md.tamam&&!ag.hata){R.hazir=true;for(const y of p.yontemler)R.yon[y]=siralamaHesap(y,md.X,md.yon,ag.w,ctx)}
  S.sonuc=R;return R}
function gecerliYontemler(R=hesapla()){return P().yontemler.filter(y=>R.yon[y]&&!R.yon[y].hata)}
function karsilastirma(R=hesapla()){const L=gecerliYontemler(R);if(L.length<1)return null;const m=R.md.A.length;
  const ortalama=R.md.A.map((_,i)=>ort(L.map(y=>R.yon[y].sira[i])));const genel=siraBul(ortalama,false);
  const rho=L.map(a=>L.map(b=>spearman(R.yon[a].ort,R.yon[b].ort)));const diz=[];for(let i=0;i<L.length;i++)for(let j=i+1;j<L.length;j++)diz.push(rho[i][j]);
  return {L,ortalama,genel,rho,min:diz.length?enk(diz):null,max:diz.length?enb(diz):null,ilk:L.map(y=>R.yon[y].sira.indexOf(1)),m}}
function oranlarOku(s){const L=[];for(const p of String(s||'').replace(/,\s+/g,' ').split(/[;\s]+/).filter(Boolean)){const v=sayiOku(p);if(v!=null)L.push(v);else p.split(',').forEach(q=>{const x=sayiOku(q);if(x!=null)L.push(x)})}
  return [...new Set(L.filter(x=>x>-100&&x!==0&&x<=1000))].sort((a,b)=>a-b)}
/* Duyarlılık: bir kriterin ağırlığı oranla değiştirilir, diğerleri toplam 1 kalacak biçimde orantılı ayarlanır. */
function duyarlilik(R=hesapla(),y,oranlar){if(!R.hazir||!R.yon[y]||R.yon[y].hata)return null;const p=P(),w0=R.ag.w,n=w0.length,ctx=baglam(p,R.md);const temel=R.yon[y];const S0=[];
  for(let j=0;j<n;j++)for(const o of oranlar){const yeni=Math.min(1,Math.max(0,w0[j]*(1+o/100)));if(w0[j]>=1-EPS)continue;const k=(1-yeni)/(1-w0[j]);const w=w0.map((x,i)=>i===j?yeni:x*k);
    const r=siralamaHesap(y,R.md.X,R.md.yon,w,ctx);if(r.hata)continue;S0.push({j,o,w,sira:r.sira,rho:spearman(temel.ort,r.ort),ilkAyni:r.sira.indexOf(1)===temel.sira.indexOf(1),ayni:r.sira.every((s,i)=>s===temel.sira[i])})}
  return {temel,senaryo:S0,ilkAyni:S0.filter(s=>s.ilkAyni).length,ayni:S0.filter(s=>s.ayni).length,rhoMin:S0.length?enk(S0.map(s=>s.rho)):null}}
