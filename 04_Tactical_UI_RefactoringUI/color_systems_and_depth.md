# Color Systems, Depth & Elevation (Refactoring UI Module 04)

Bu doküman; *Refactoring UI* prensiplerine göre HSL (Hue, Saturation, Lightness) renk paleti inşasını, renk dengesini ve ışık kaynağı modellemesiyle gerçekçi derinlik (elevation & dual-shadow) mimarisini açıklar.

---

## 1. HSL Renk Paleti Mimarisi

Düz RGB veya HEX kodları ile çalışmak ton geçişlerini ayarlamayı zorlaştırır. Renk sistemini HSL parametreleri üzerinden türetmek sistematik tutarlılık sağlar.

```
       [ Renk Paleti Dağılım Oranları ]
       
       Greys / Slates (Nötr Renkler) ────► %70 - %80 (Arka plan, kartlar, metinler)
       Primary (Birincil Marka Rengi) ───► %15 - %20 (Ana butonlar, aktif sekmeler)
       Accent / Danger / Success    ────► %5 - %10  (Bildirim rozetleri, onaylar, uyarılar)
```

### 1.1 Greys: Asla Saf Gri (`#808080`) Kullanmayın
- Saf siyah-beyaz karışımı gri renkler arayüzü cansız, donuk ve tıbbi bir alet gibi gösterir.
- Grilerin içine bir miktar renk (Hue) enjekte edin:
  - **Cool Slate (Mavi/Mor alt tonlu gri):** Modern, teknik ve odaklanmış hava katar (`hsl(220, 15%, 16%)`).
  - **Warm Slate (Kahve/Sarı alt tonlu gri):** Dostane, sıcak ve rahatlatıcı bir hava katar (`hsl(30, 10%, 15%)`).

### 1.2 Ton Skalası (50 - 900)
Her renk ailesi için 50'den (neredeyse beyaz) 900'e (neredeyse siyah) kadar 9-10 tonluk bir skala hazırlanmalıdır. Koyu temada 900 arka plan, 800 kart arka planı, 100 ana metin, 400 ikincil metin olarak görev yapar.

---

## 2. Derinlik ve Işık Kaynağı Modellemesi (Elevation)

Gerçek dünyada ışık yukarıdan gelir (Virtual Sun). Arayüzdeki elemanlar da bu ışık kaynağına göre tepki vermelidir.

```
                  ┌───────────────────────────────┐
                  │   Işık Kaynağı (Yukarıdan)    │
                  └───────────────┬───────────────┘
                                  │
                                  ▼
               ┌─────────────────────────────────────┐  ◄── Üst kenarda hafif açık ton
               │              KART / MODAL           │      (1px inset highlight)
               └──────────────────┬──────────────────┘
                                  │
                                  ▼
           ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
             Dual Shadow: 1. Doğrudan Keskin Gölge (Key)
                          2. Geniş Dağılan Ambiyans Gölgesi (Ambient)
```

### 2.1 Çift Gölge (Dual-Shadow) Mimarisi
Tek bir CSS `box-shadow` değeri çoğu zaman yapay veya çamurlu durur. Gerçekçi bir 3D hissi için iki gölge katmanı birleştirilir:

```css
/* Refactoring UI Dual-Shadow Standardı (Level 2 Elevation) */
.elevation-card {
  box-shadow: 
    0 1px 3px 0 rgba(0, 0, 0, 0.25),   /* Key shadow: Nesnenin altındaki keskin hat */
    0 4px 12px 0 rgba(0, 0, 0, 0.15);  /* Ambient shadow: Odaya yayılan yumuşak ışık kırılması */
}

/* Yüksek Seviye (Modal / Floating Menu - Level 4 Elevation) */
.elevation-modal {
  box-shadow:
    0 8px 16px -2px rgba(0, 0, 0, 0.3),
    0 24px 48px -12px rgba(0, 0, 0, 0.45);
}
```

### 2.2 Koyu Temada (Dark Mode) Derinlik İllüzyonu
Koyu temalarda gölgeler siyah arka plan üzerinde görünmez hale gelir. Bu nedenle derinlik **arka plan renginin açıklığı (lightness)** ile ifade edilir:
- **Ana Arka Plan:** En koyu katman (`#090D16` / `hsl(222, 47%, 6%)`)
- **Kart Katmanı (Elevation 1):** Hafif daha açık (`#111827` / `hsl(222, 47%, 11%)`)
- **Açılır Menü / Modal (Elevation 2):** Daha açık (`#1F2937` / `hsl(222, 47%, 17%)`)
- **Kenar Işığı (Border Highlight):** Kartın üst kenarına `border-top: 1px solid rgba(255,255,255,0.08)` eklenerek ışığın yüzeye çarptığı hissettirilir.
