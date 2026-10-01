# Mental Models vs. Implementation Models (About Face Module 02)

Bu doküman; Alan Cooper'ın *About Face* prensiplerinde yer alan zihinsel modeller (mental models), uygulama modelleri (implementation models) ve temsil modelleri (represented models) arasındaki farkları ve bu modellerin arayüz mimarisine yansımasını inceler.

---

## 1. Üç Model Kuramı

Herhangi bir dijital ürünle etkileşimde üç bağımsız model mevcuttur:

```
┌─────────────────────────────────┐                 ┌─────────────────────────────────┐
│       Implementation Model      │                 │           Mental Model          │
│    (Sistem Gerçekte Nasıl       │                 │      (Kullanıcı Sistemin        │
│       Çalışıyor?)               │                 │    Nasıl Çalıştığını Sanıyor?)  │
│  - Veritabanı tabloları         │                 │  - "Ses kaydettim, bitti"       │
│  - Web Speech token parsing     │                 │  - "Ödevim koçuma ulaştı"       │
│  - REST API & WebSocket socket  │                 │  - "Sayaç bitti, mola vakti"    │
└────────────────┬────────────────┘                 └────────────────▲────────────────┘
                 │                                                   │
                 │                 ┌───────────────────┐             │
                 └────────────────►│ Represented Model │─────────────┘
                                   │ (Tasarımcının     │
                                   │  Sunduğu Arayüz)  │
                                   └───────────────────┘
                    İDEAL HEDEF: Represented Model == Mental Model
```

### 1.1 Implementation Model (Sistemin İç Yapısı)
- Kodun, veritabanının, network paketlerinin ve işletim sisteminin teknik çalışma prensibidir.
- Örneğin bir veritabanında satır eklemek için `BEGIN TRANSACTION`, `INSERT INTO tasks`, `COMMIT` işletilir; arka planda WAL'a yazılır ve SSTable flush edilir.
- *Hata:* Yazılım mühendisleri arayüzü tasarlarken sıklıkla bu teknik süreci doğrudan ekrana dökerler (Örn. "İşlem commit edilemedi - Error Code 0x8F").

### 1.2 Mental Model (Kullanıcının Kavramsal Modeli)
- Kullanıcının dünyayı algılama biçimine dayanan, zihninde canlandırdığı basit, sezgisel ve çoğu zaman teknik ayrıntılardan arındırılmış modeldir.
- Kullanıcı bir düğmeye bastığında arka planda hangi SQL sorgusunun çalıştığını bilmek istemez; sadece "görevin tamamlandığını" ve "yeşil yandığını" bilmek ister.

### 1.3 Represented Model (Tasarımcının Sunduğu Arayüz Modeli)
- Kullanıcının karşısına çıkan arayüzün davranış biçimidir.
- **Tasarımın Temel Kuralı:** Represented Model, Implementation Model'e ne kadar yaklaşırsa arayüz o kadar zor ve kafa karıştırıcı olur. Represented Model, kullanıcının Mental Model'ine ne kadar yaklaşırsa sistem o kadar "kullanımı zahmetsız" (frictionless) ve sihirli hissettirir.

---

## 2. Mekanik Sürtünmenin (Mechanical Friction) Elenmesi

Mekanik sürtünme; kullanıcının zihninde var olmayan ancak sistemin iç yapısı istediği için kullanıcıya zorla yaptırılan eylemler bütünüdür.

```
+-------------------------------------------------------------------------------+
|                       MECHANICAL FRICTION ÖRNEKLERİ                           |
+-------------------------------------------------------------------------------+
| Kötü (Implementation-driven)        | İyi (Mental-model-driven)               |
|-------------------------------------+-----------------------------------------|
| Kullanıcı sesle "Türevi bitirdim"   | Sistem konuşmayı dinler, arka planda    |
| dediğinde; sistemin "Ders seçiniz,  | "Türev" konusunu bulur, durumu         |
| ünite seçiniz, onaylayınız" demesi. | "COMPLETED" yapar ve tebrik konfetisi   |
|                                     | patlatır (Sıfır gereksiz soru).         |
|-------------------------------------+-----------------------------------------|
| Çıkarken "Değişiklikleri kaydetmek  | Autosave (Her veri anında local state ve|
| istiyor musunuz?" modal penceresi.  | storage'a yazılır, modal tamamen yok    |
|                                     | edilir).                                |
|-------------------------------------+-----------------------------------------|
| "Ağ hatası: Socket disconnected     | "Çevrimdışısınız. Çalışmalarınız cihazda|
| 1006. Retry?" uyarısı.              | güvende, internet gelince aktarılacak." |
+-------------------------------------------------------------------------------+
```

---

## 3. TulpiFlow Mimarisinde Mental Model Uyarlaması

1. **Sesli Günlük (Voice Journaling):**
   - Öğrencinin mental modeli: "Ben günümü anlatayım, o gerekeni yapsın."
   - TulpiFlow, ham konuşma metnini semantic intent parser ile doğrudan ders ağacına eşler; arka plan entity extraction detaylarını kullanıcıya hissettirmez.
2. **Mentörün Görev Ataması (Cross-Assignment):**
   - Mentörün mental modeli: "Fadime'nin yarınki takvimine 2 test koydum."
   - Öğrencinin mental modeli: "Koçum bana görev bıraktı, yapınca puan/tebrik alacağım."
   - Arayüz karmaşık izin mekanizmaları veya bildirim ayarları sormadan bu iki zihinsel modeli tek bir ortak takvimde buluşturur.
