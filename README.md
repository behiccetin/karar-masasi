# Karar Masası / Decision Desk

Çok kriterli karar verme (ÇKKV) için tarayıcıda çalışan, kurulumsuz, ücretsiz araç. Karar matrisini Excel'den alır; kriter ağırlıklarını uzman yargısıyla ya da veriden hesaplar; alternatifleri on yöntemle sıralar; yöntemleri karşılaştırır, duyarlılık analizi yapar ve her adımın tablosunu Word ve Excel raporuna döker. Tek bir HTML dosyasıdır; internet bağlantısı kullanmaz, veriler bilgisayardan çıkmaz.

A free, install-free, browser-based tool for multi-criteria decision making (MCDM). It takes the decision matrix from Excel, derives criterion weights from expert judgement or from the data, ranks the alternatives with ten methods, compares the methods, runs a sensitivity analysis and exports every step to Word and Excel. It is a single HTML file, works offline, and data never leaves your computer.

## Yöntemler / Methods

**Ağırlıklandırma / Weighting (8):** Eşit ağırlık, doğrudan puan, AHP (çok uzman, AIJ ya da AIP birleştirme, tutarlılık oranı, en tutarsız yargı için öneri), BWM (doğrusal model, ξᴸ ve Liang vd. 2020 eşikleriyle girdiye dayalı tutarlılık), ENTROPİ, CRITIC, standart sapma, MEREC.

**Sıralama / Ranking (10):** TOPSIS, VIKOR (uzlaşık çözüm ve iki kabul koşulu), WASPAS, EDAS, COPRAS, MOORA, ARAS, MABAC, MARCOS, SAW.

**Sınama / Checks:** Spearman sıra korelasyonu, ortalama ve genel sıra, kriter ağırlıklarını değiştiren senaryolarla duyarlılık analizi.

## Özellikler / Features

- Excel'den blok yapıştırma, `.xlsx` ve `.csv` içe aktarma, kriter yönü satırını tanıma (fayda ya da maliyet)
- Her yöntemin bütün ara tabloları ekranda, Word'de ve Excel'de
- Tablo ve şekil numaralı Word raporu; atıflarıyla yöntem bölümü taslağı ve APA kaynakçası
- Excel çalışma kitabı: her yöntem ayrı sayfada, sayılar değer olarak
- Geri al ve yinele, tarayıcıda otomatik kayıt, proje dosyası
- Türkçe ve İngilizce; topluluk yeni dil ekleyebilir (bkz. CONTRIBUTING.md)

## Doğrulama / Verification

Hesaplar, rastgele üretilmiş 40 problemde (680 karşılaştırma) bağımsız kaynaklarla karşılaştırılarak doğrulanmıştır:

- TOPSIS, VIKOR, MOORA, WASPAS, EDAS, ARAS, MABAC, MARCOS, ENTROPİ ve MEREC: [pymcdm](https://gitlab.com/shekhand/mcda) kütüphanesi
- AHP özvektörü ve λmax: `numpy.linalg.eig`
- Doğrusal BWM: `scipy.optimize.linprog` (HiGHS)
- CRITIC, standart sapma, COPRAS ve SAW: özgün makalelerdeki formüllerle yazılmış numpy kodu

İki not: pymcdm'in CRITIC uygulaması kriter yönünü dikkate almaz, COPRAS uygulamasında da göreli önem formülündeki toplamlar eksiktir. Karar Masası her iki yöntemde özgün makaledeki formülü (Diakoulaki vd., 1995; Zavadskas vd., 1994) kullanır.

The calculations were checked against independent sources on 40 random problems (680 comparisons). pymcdm's CRITIC ignores criterion direction and its COPRAS formula omits the sums in relative significance; Karar Masası follows the original papers for both.

Doğrulama betiği: `test/cekirdek_dogrula.py` (yerel test klasöründe).

## Kullanım / Usage

- **Web'de aç / Open on the web:** https://behiccetin.github.io/karar-masasi/
- **İndir / Download:** `dist/karar-masasi.html` dosyasını indirip çift tıklayın; internet gerekmez. / Download and double-click; no internet needed.

Web sürümü de verileri yalnızca tarayıcınızda tutar; hiçbir sunucuya gönderilmez. / The web version also keeps data in your browser only.

## Klasörler / Folders

| Klasör | İçerik |
|---|---|
| `sablon.html` | Arayüz iskeleti |
| `stil.css` | daisyUI 5 ve Tailwind 4 tema tanımları |
| `js/` | Uygulama kodu (`2-hesap.js` bütün yöntemlerin hesap çekirdeği) |
| `diller/` | Dil dosyaları (topluluk katkısına açık) |
| `build.py` | Hepsini tek HTML dosyasında birleştirir (`dist/` ve `index.html`) |

## Atıf / Citation

Karar Masası'nı kullandıysanız lütfen kaynak gösterin. Araçtaki **Atıf** düğmesi APA, ISNAD ve BibTeX biçimlerini verir.

> Çetin, B. (2026). *Karar Masası* (Sürüm 1.0.0) [Bilgisayar yazılımı]. https://github.com/behiccetin/karar-masasi

## Lisans / License

MIT. Sistem mimarı ve geliştirici / System architect and developer: Öğr. Gör. Dr. Behiç ÇETİN.
