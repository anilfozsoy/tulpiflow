# Cognitive Load & Scanning Behavior (Don't Make Me Think Module 03)

Bu doküman; Steve Krug'un *Don't Make Me Think: A Common Sense Approach to Web Usability* prensiplerinden yola çıkarak bilişsel yük yönetimi, tarama (scanning) psikolojisi ve görsel gürültü eliminasyonunu tanımlar.

---

## 1. Krug'un Birinci Yasası: "Beni Düşündürme!" (Don't Make Me Think)

Bir arayüzün kalitesinin en temel ölçütü şudur:
> *"Bir sayfaya baktığımda, sayfanın ne olduğu ve nasıl kullanılacağı kendi kendini açıklamalıdır (self-evident). Hiçbir soru işareti üretmemelidir."*

```
       [ Kullanıcının Zihnindeki Soru İşaretleri = Bilişsel Yük Sızıntısı ]
       
       "Bu tıklanabilir bir buton mu yoksa düz başlık mı?"
       "Kaydetmek için önce nereye basmalıyım?"       ──► [ Zihinsel Yorgunluk ]
       "Aynı şey için neden iki farklı kelime var?"  ──► [ Goodwill Havuzunun Boşalması ]
       "Şimdi ne oldu? Görev kaydedildi mi?"
```

Kullanıcının her duraksaması ve düşünmek zorunda kaldığı her mikro-saniye, asıl odaklanması gereken çalışma ve üretkenlik enerjisinden çalar.

---

## 2. Okuma vs. Tarama: İnsanlar Nasıl Kullanır?

Yazılım geliştiriciler ve tasarımcılar kullanıcıların sayfadaki metinleri baştan sona dikkatlice okuduğunu varsayar (Great Literature Myth). Gerçekte kullanıcılar **okumaz, tarar (scan)**.

```
       [ Beklenen vs. Gerçek Davranış ]
       Tasarımcının Hayali: Okuma ──► Rasyonel Karşılaştırma ──► En Optimal Seçim (Optimizing)
       Gerçek Kullanıcı:    Hızlı Tarama ──► İlk Akla Yatan Şeye Tıklama (Satisficing & Muddling Through)
```

### 2.1 Satisficing (Tatmin Edici İlk Seçenek)
Ekonomist Herbert Simon'ın ortaya attığı ve Krug'un kullanılabilirliğe uyarladığı kavramdır:
- Kullanıcılar en iyi seçeneği bulana kadar aramazlar.
- Karşılarına çıkan ilk "iş görebilecek gibi duran" seçeneği (satisficing = satisfy + suffice) seçip hemen denerler.
- Neden? Çünkü zamanları kısıtlıdır, hata yapmanın bedeli genelde düşüktür ve arayüzü derinlemesine incelemek sıkıcıdır.

### 2.2 Muddling Through (Yuvarlanıp Gitmek)
- Kullanıcıların büyük kısmı sistemlerin nasıl çalıştığını tam olarak bilmez veya kullanım kılavuzunu okumaz.
- Bir şekilde işlerini gören tuhaf veya dolambaçlı bir yöntem bulurlar ve yıllarca o yöntemi kullanarak "yuvarlanıp giderler".
- Bir arayüzün başarısı, bu rastgele tarama esnasında bile doğru yola kolayca yönlendirebilmesinde yatar.

---

## 3. Görsel Gürültünün (Visual Noise) Minimizasyonu

Bir sayfayı taranabilir kılmak için üç temel kural uygulanır:

```
+-------------------------------------------------------------------------------+
|                       TARANABİLİRLİK İÇİN 3 TEMEL KURAL                       |
+-------------------------------------------------------------------------------+
| Kural                        | Uygulama Yöntemi                               |
|------------------------------+------------------------------------------------|
| 1. Net Görsel Hiyerarşi      | Önemli olan büyüktür, ilişkililer yakındır,    |
|    (Visual Hierarchy)        | alt başlıklar üst başlığın içinde yuvalanır.   |
|------------------------------+------------------------------------------------|
| 2. Yerleşik Konvansiyonlara  | Tekerleği yeniden icat etmeyin. Tıklanabilir   |
|    Uyum (Conventions)        | buton buton gibi dursun, arama ikonu sağ üstte |
|                              | veya sabit olsun, linkler belirgin olsun.      |
|------------------------------+------------------------------------------------|
| 3. Gereksiz Kelimeleri Kesin | Ekrana yazılan karşılama metinleri, gereksiz   |
|    (Omit Needless Words)     | yönergeler %50 oranında silinmelidir; kalan    |
|                              | metin bir kez daha %50 kırpılmalıdır.          |
+-------------------------------------------------------------------------------+
```

### 3.1 Gürültü Tipleri
1. **Meşguliyet (Busy-ness):** Sayfadaki her şeyin kullanıcının dikkatini çekmek için aynı anda bağırması (ünlemler, rengarenk etiketler, zıp zıp zıplayan öğeler).
2. **Arka Plan Gürültüsü (Background Clutter):** Aşırı çizgiler, birbirine yapışık kutucuklar, gereksiz kenarlıklar (borders).

---

## 4. TulpiFlow Taktiksel Çıkarımları

- **Sesle Görev Tamamlama:** Kullanıcı "Türev bitti" dediğinde ekranda paragraf dolusu metin belirmemelidir. Yalnızca yeşil bir parıltı, konu düğümünün tick (✓) alması ve kısa bir tebrik rozeti yeterlidir.
- **Odak Ekranı:** Pomodoro çalışırken ekrandaki tüm yan paneller, istatistikler ve butonlar silikleşmeli (fade out); yalnızca kalan süre ve mevcut görev parlamalıdır.
