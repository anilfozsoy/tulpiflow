# Interaction Framework & Orchestration (About Face Module 02)

Bu doküman; Alan Cooper'ın *About Face* metodolojisinde tanımlanan senaryo tabanlı etkileşim çerçeveleri, akış ve orkestrasyon (flow & orchestration) prensipleri ve arayüz duruşu (posture) analizini ele alır.

---

## 1. Senaryo Çerçevesi (Scenario-Based Design)

Arayüz bileşenleri soyut gereksinimlerden değil, personanın belirli bir bağlam içindeki eylem dizilerinden türetilir:

```
                  ┌───────────────────────────────┐
                  │       Context Scenarios       │  Geniş açı: Kullanıcının günü,
                  │   (Günün Akışı ve İhtiyaç)    │  çevresel faktörler ve hedefleri
                  └───────────────┬───────────────┘
                                  │
                  ┌───────────────▼───────────────┐
                  │      Key Path Scenarios       │  Kritik patika: Günlük görevlerin
                  │    (En Sık Kullanılan Akış)   │  en kısa, sıfır engelli rotası
                  └───────────────┬───────────────┘
                                  │
                  ┌───────────────▼───────────────┐
                  │     Validation Scenarios      │  İstisnalar, kenar durumlar (edge
                  │   (Kenar Durumlar & Hatalar)  │  cases) ve sınır koşulları
                  └───────────────────────────────┘
```

### 1.1 Context Scenarios (Bağlam Senaryoları)
- Kullanıcının çalışma ortamını, dikkat seviyesini ve zamansal kısıtlarını modeller.
- *Örnek:* "Fadime akşam 22:30'da kütüphaneden eve dönerken yorgundur. Bilgisayarı açıp tek tek form doldurmak istemez; telefonuna 'Bugün trigonometri test 4 bitti' der ve yatar."

### 1.2 Key Path Scenarios (Anahtar Yol Senaryoları)
- Arayüzde en çok tekrarlanan ve personanın zamanının %90'ını geçirdiği akışlardır.
- *Kural:* Key path üzerindeki her ekstra tıklama, form alanı veya onay modalı kullanıcıyı tüketir (Goodwill Reservoir'ı boşaltır).

### 1.3 Validation Scenarios (Doğrulama Senaryoları)
- Beklenmedik girişler, network kesintileri veya sistem hatalarında deneyimin nasıl toparlanacağını belirler.

---

## 2. Flow ve Orchestration (Kesintisiz Kullanıcı Deneyimi)

Etkileşim tasarımında **Flow**, kullanıcının arayüzün mekanik varlığını unutup tamamen kendi işine odaklandığı zihinsel akış durumudur.

### 2.1 Diyalog Gürültüsünün (Modal Noise) Elenmesi
- Bir insanla konuşurken her cümlenizde "Bunu gerçekten demek istediniz mi?" diye sorulduğunu hayal edin. Modal diyalog pencereleri çoğunlukla tembel mühendisliğin sonucudur.
- **Kesinti Yerine Geri Alınabilirlik (Undo instead of Confirm):**
  - "Görevi silmek istediğinize emin misiniz? [Evet/Hayır]" yerine;
  - Görevi anında sil + ekranda 5 saniye nazik bir bildirim göster: "Görev silindi. [Geri Al]".

### 2.2 Orchestration İlkeleri
- Görsel elemanlar bir senfoni gibi uyum içinde hareket etmelidir.
- Bir işlem tetiklendiğinde arayüz donmamalı, yumuşak geçişler (transitions) ve durum değişiklikleri gözü yönlendirmelidir.

---

## 3. Posture Analizi (Sovereign, Transient, Daemonic)

Bir yazılımın masaüstü veya mobil ortamda kullanıcının dikkatini ne kadar talep ettiği "duruş" (posture) teorisi ile analiz edilir:

```
+-------------------------------------------------------------------------------+
|                            POSTURE CLASSIFICATION                             |
+-------------------------------------------------------------------------------+
| Posture Tipi | Dikkat Talebi    | Ekran Hakimiyeti | Örnekler                 |
|--------------+------------------+------------------+--------------------------|
| Sovereign    | Sürekli, Yüksek  | Tam ekran, uzun  | IDE (VSCode), Photoshop, |
|              | odaklanma        | süreli oturumlar | TulpiFlow Focus Dashboard|
|--------------+------------------+------------------+--------------------------|
| Transient    | Anlık, Geçici    | Tek amaçlı, açıp | Hesap makinesi, sesli    |
|              | mikro-görev      | kapatılan pencere| hızlı not modalı, arama  |
|--------------+------------------+------------------+--------------------------|
| Daemonic     | Görünmez, Arka   | Sistem tepsisi,  | Senkronizasyon servisi,  |
|              | plan servisi     | bildirim alanı   | arka plan pomodoro sayacı|
+-------------------------------------------------------------------------------+
```

### 3.1 TulpiFlow Mimarisinde Hibrit Duruş
TulpiFlow hem **Sovereign** (tam ekran odaklanma, ders ağacı analizi, Deep Work sprintleri) hem de **Transient** (sesle 2 saniyede görev bitirme modalı, hızlı görev ekleme) duruşları kusursuzca harmanlar.
Arka plandaki WebSocket/P2P sync ve Pomodoro zamanlayıcısı ise **Daemonic** bir sessizlikle çalışır.
