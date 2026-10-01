# Navigation Systems & The Trunk Test (Don't Make Me Think Module 03)

Bu doküman; Steve Krug'un *Don't Make Me Think* kitabında formüle ettiği kalıcı navigasyon hiyerarşisi, kırıntı (breadcrumbs) sistemleri ve web/mobil arayüzlerin yön bulma yeteneğini sınayan Trunk Test (Bagaj Testi) protokolünü detaylandırır.

---

## 1. Kalıcı Navigasyon (Persistent Navigation)

Kalıcı navigasyon (Global Nav), bir uygulamanın her sayfasında tutarlı bir şekilde yer alan ve kullanıcıya sürekli yön hissi (wayfinding) veren kılavuz yapıdır.

```
+-------------------------------------------------------------------------------+
|                        PERSISTENT NAVIGATION SCHEMATIC                        |
+-------------------------------------------------------------------------------+
| [Site ID / Logo]  [Sections: Fadime's Space | My Space | Shared Calendar]     |
|                   [Utilities: Voice Rec | Focus Sound | Profile / Avatar]     |
+-------------------------------------------------------------------------------+
| Breadcrumbs: Home > Fadime's Space > Matematik (AYT) > [Türev ve İntegral]    |
+-------------------------------------------------------------------------------+
```

### 1.1 Kalıcı Navigasyonun 4 Temel Katmanı
1. **Site ID (Uygulama Kimliği):** Sol üstte yer alır. Tıklandığında ana ekrana döner. Kullanıcıya hangi evrende olduğunu hatırlatır.
2. **Sections (Bölümler):** Sistemin ana modülleri veya alanlarıdır (Workspace Switcher).
3. **Utilities (Yardımcı Araçlar):** Ana akış dışındaki hızlı fonksiyonlar (Hızlı ses kaydı, ortam sesi, ayarlar, avatar).
4. **"You Are Here" Göstergesi (Aktif Sekme Vurgusu):** Kullanıcının şu an hangi sekmede olduğunu bağıran görsel işaret (farklı arka plan rengi, alt çizgi, parlak kontrast).

### 1.2 Breadcrumbs (Ekmek Kırıntıları) Standartları
- Her zaman en üstte, sayfa başlığının hemen üzerinde yer almalıdır.
- Hiyerarşik olmalıdır (büyükten küçüğe doğru `>` veya `/` ayıracıyla).
- Son eleman (mevcut bulunulan sayfa) kalın (bold) olmalı ve **link olmamalıdır** (kullanıcı zaten oradadır).

---

## 2. Trunk Test (Bagaj Testi)

Steve Krug'un ortaya attığı bu test şu metafora dayanır:
> *"Gözleriniz bağlı, bir arabanın bagajına kilitlendiniz ve kilometrelerce sürüldükten sonra bir web sayfasının veya mobil ekranın tam ortasına bırakıldınız. Göz bağınız açıldığı an hiçbir şeye tıklamadan saniyeler içinde şu 6 soruyu yanıtlayabiliyor musunuz?"*

```
+-------------------------------------------------------------------------------+
|                             THE 6 TRUNK TEST QUESTIONS                        |
+-------------------------------------------------------------------------------+
| No | Soru                      | Ekrandaki Hangi Bileşen Yanıtlar?            |
|----+---------------------------+----------------------------------------------|
| 1  | Burası hangi site/uygulama| Logo, Site ID (Sol üst).                     |
|----+---------------------------+----------------------------------------------|
| 2  | Hangi sayfadayım?         | Sayfa Başlığı (H1) - Net, büyük ve belirgin. |
|----+---------------------------+----------------------------------------------|
| 3  | Bu sitenin ana bölümleri  | Ana Menü / Navigasyon sekmeleri.             |
|    | neler?                    |                                              |
|----+---------------------------+----------------------------------------------|
| 4  | Bu seviyedeki seçeneklerim| Yerel menü, filtreleme veya alt sekmeler.    |
|    | neler?                    |                                              |
|----+---------------------------+----------------------------------------------|
| 5  | Hiyerarşinin neresindeyim?| "You are here" göstergesi ve Breadcrumb.     |
|----+---------------------------+----------------------------------------------|
| 6  | Arama veya hızlı eylem    | Arama çubuğu veya belirgin Action Button.    |
|    | nasıl yapabilirim?        |                                              |
+-------------------------------------------------------------------------------+
```

---

## 3. TulpiFlow Navigasyon Tasarımına Uygulama

1. **Workspace Header:**
   - Sol üstte sansasyonel `TulpiFlow` marka imzası.
   - Ortada net Segment Switcher: `[ 🌸 Fadime's Space (YKS) ]` | `[ ⚡ My Space (Dev & Math) ]` | `[ 📅 Shared Calendar ]`.
   - Seçili olan sekme koyu arka plan üzerinde canlı bir neon mor/zümrüt yeşili kenarlık ile vurgulanır.
2. **Contextual Breadcrumb:**
   - Örneğin Fadime'nin alanında iken: `TulpiFlow / Fadime's Space / TYT-AYT Matematik / Türev / Geometrik Yorum`.
   - Kullanıcı tek bakışta nerede olduğunu ve nereye ait olduğunu kavrar.
