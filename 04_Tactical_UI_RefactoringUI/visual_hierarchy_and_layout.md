# Visual Hierarchy & Layout Tactics (Refactoring UI Module 04)

Bu doküman; Adam Wathan ve Steve Schoger'ın *Refactoring UI* eserindeki pratik görsel hiyerarşi taktiklerini, layout mimarisini ve arayüzdeki gereksiz süslemeleri sadeleştirme prensiplerini içerir.

---

## 1. Hiyerarşi Kurma: Font Size Tek Başına Yetersizdir

Acemi arayüz tasarımlarında her önemli öğe sadece puntoları (font-size) büyütülerek öne çıkarılmaya çalışılır. Bu durum sayfayı hantal, dengesiz ve kaba gösterir.

```
       [ Kötü Hiyerarşi (Yalnızca Font Size) ]
       TÜREV VE İNTEGRAL TESTİ (32px, Black)
       Matematik AYT (24px, Black)
       Fadime - Soru Sayısı: 40 (18px, Black)
       
       [ Refactoring UI Hiyerarşisi (Font Weight + Color Contrast + Spacing) ]
       MATEMATİK AYT  ──► (11px, Bold, Uppercase, Tracking-wide, Muted Slate)
       Türev ve İntegral Testi  ──► (20px, Semi-bold, High-contrast White/Dark)
       40 Soru  ──► (14px, Regular, Soft Slate)
```

### 1.1 Temel Taktikler
- **Font-Weight ve Kontrast Kullanımı:** Birincil metin için yüksek kontrast (Örn: koyu temada `#F8FAFC`), ikincil metin için orta kontrast (`#94A3B8`), meta-veriler için düşük kontrast (`#64748B`) kullanın.
- **Semantik Başlıklaştırma (De-emphasizing Labels):**
  - "Öğrenci: Fadime" yerine doğrudan büyük harfle "Fadime", altına soluk renkle "YKS Öğrencisi".
  - Etiket kelimesini (Label) kaldırıp verinin kendisini bağlamıyla öne çıkarın.

---

## 2. Kenarlıkları Silin veya Zayıflatın (De-emphasizing Borders)

Arayüz bileşenlerini birbirinden ayırmak için her yere 1px koyu/sert border çekmek ekranı bir kafese çevirir:

```
+-------------------------------------------------------------------------------+
|                       AYRIŞTIRMA TEKNİKLERİ DERECELENDİRMESİ                  |
+-------------------------------------------------------------------------------+
| Seviye | Yöntem                    | Görsel Etki & Tavsiye                    |
|--------+---------------------------+------------------------------------------|
| 1      | Boşluk (Spacing)          | En temiz yöntem. Yalnızca boşluk bırakarak|
|        |                           | grupları birbirinden ayırın.             |
|--------+---------------------------+------------------------------------------|
| 2      | Arka Plan Tonu Farkı      | Kart ile sayfa arka planı arasında çok   |
|        | (Background Contrast)     | hafif bir ton farkı (`#0F172A` vs `#1E293B`).|
|--------+---------------------------+------------------------------------------|
| 3      | Yumuşak Gölgeler          | Kenarlık yerine derinlik veren gölge     |
|        | (Soft Elevation Box Shadow)| kullanın.                                |
|--------+---------------------------+------------------------------------------|
| 4      | Ultra İnce/Soluk Kenarlık | Eğer mutlaka border gerekiyorsa opaklığı |
|        | (Border with Alpha)       | `%5 - %10` olan renkler tercih edin.     |
+-------------------------------------------------------------------------------+
```

---

## 3. Düzen (Layout) ve İç İçe Yerleşim (Overlapping)

- **Boşlukları İki Katına Çıkarın:** Tasarım sıkışık görünüyorsa elemanları küçültmek yerine aralarındaki padding ve margin değerlerini iki katına çıkarın (White space lüks ve ferah hissettirir).
- **Asimetrik Izgaralar (Grids):** Sol panel dar (Sidebar / Quick info), sağ panel geniş (Main Content) asimetrisi gözün doğal okuma akışını yönlendirir.
