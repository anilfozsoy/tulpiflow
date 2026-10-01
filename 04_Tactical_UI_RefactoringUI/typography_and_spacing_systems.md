# Typography & Spacing Systems (Refactoring UI Module 04)

Bu doküman; *Refactoring UI* prensiplerine göre matematiksel ve görsel olarak tutarlı aralık (spacing), boyutlandırma (sizing) ve tipografi sistemlerinin inşasını açıklar.

---

## 1. Sabit Spacing & Sizing Ölçeği (The Power of Constraints)

Her eleman için rastgele pikseller (`13px`, `19px`, `27px`) uydurmak arayüzün tutarsız ve dağınık hissettirmesine yol açar. Bir avuç önceden tanımlanmış değerden oluşan sıkı bir ölçek kullanılmalıdır.

```
       [ Non-Linear 4px/8px Spacing Scale ]
       Token       Boyut (px)    Kullanım Amacı
       ──────────────────────────────────────────────────────────────────
       space-1     4px           İkon ve metin arası mikro boşluk
       space-2     8px           İç içe etiketler (chips/tags)
       space-3     12px          Buton içi dikey boşluk, form girdi boşluğu
       space-4     16px          Standart kart içi boşluk (base unit)
       space-6     24px          Eleman grupları arası mesafe
       space-8     32px          Kartlar ve sütunlar arası boşluk
       space-12    48px          Ana bölümler arası mesafe
       space-16    64px          Sayfa başı / hero section boşluğu
```

### 1.1 Non-Linear Ölçek Zorunluluğu
Küçük boyutlarda 4px fark gözle kolayca ayırt edilir (`12px` ile `16px` arası %33 farktır). Ancak büyük boyutlarda (`64px` ile `68px`) farkı anlamak imkansızdır. Bu nedenle büyük değerlere geçildikçe adımlar katlanarak büyümelidir.

---

## 2. Tipografi Sistemi ve Tip Ölçeği (Type Scale)

Rastgele font boyutları yerine gözün kolayca ayrıştırabileceği bir oran dizisi (Type Scale) tercih edilir:

```
+-------------------------------------------------------------------------------+
|                             HAND-CRAFTED TYPE SCALE                           |
+-------------------------------------------------------------------------------+
| Token        | Size (rem/px)    | Line-Height | Tracking | Kullanım           |
|--------------+------------------+-------------+----------+--------------------|
| text-xs      | 0.75rem (12px)   | 1rem (16px) | +0.025em | Meta-etiketler, rozet|
| text-sm      | 0.875rem (14px)  | 1.25rem(20px)| normal   | İkincil metin, form |
| text-base    | 1rem (16px)      | 1.5rem (24px)| normal   | Gövde metni (Body) |
| text-lg      | 1.125rem (18px)  | 1.75rem(28px)| normal   | Kart başlığı, alt b.|
| text-xl      | 1.25rem (20px)   | 1.75rem(28px)| -0.01em  | Bölüm başlığı      |
| text-2xl     | 1.5rem (24px)    | 2rem (32px) | -0.02em  | Modal / sayfa başl.|
| text-3xl     | 1.875rem (30px)  | 2.25rem(36px)| -0.025em | Öne çıkan başlık   |
| text-4xl     | 2.25rem (36px)   | 2.5rem (40px)| -0.03em  | Hero ekranı / sayaç|
+-------------------------------------------------------------------------------+
```

### 2.1 Satır Uzunluğu Kuralı (65ch Kuralı)
- Bir metin satırı çok uzunsa, okuyucunun gözü bir sonraki satırın başına atlarken kaybolur.
- Bir metin satırı çok kısaysa, ritim bozulur ve göz yorulur.
- **Altın Aralık:** 45 ile 75 karakter arası (ideal: `~65 karakter` veya CSS'te `max-width: 65ch`).

### 2.2 Line-Height (Satır Yüksekliği) ve Punto Ters Orantısı
- Küçük fontlarda (12px - 14px) harflerin birbirine karışmaması için `line-height` geniş tutulmalıdır (`1.5 - 1.6`).
- Başlıklarda ve dev boyutlu yazılarda (24px - 48px) `line-height` sıkılaştırılmalıdır (`1.1 - 1.2`). Aksi takdirde başlık parçalanmış gibi görünür.
