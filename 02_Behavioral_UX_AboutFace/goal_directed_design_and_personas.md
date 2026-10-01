# Goal-Directed Design & Personas (About Face Module 02)

Bu doküman; Alan Cooper'ın *About Face: The Essentials of Interaction Design* metodolojisinden türetilen Hedef Yönelimli Tasarım (Goal-Directed Design), hedef hiyerarşisi ve persona modelleme disiplinini tanımlar.

---

## 1. Goal-Directed Design (GDD) Metodolojisi

Geleneksel yazılım geliştirme süreçleri sıklıkla "özellik odaklı" (feature-driven) veya "teknoloji odaklı" (technology-driven) ilerler; bu durum yazılımın teknik olarak kusursuz çalışsa dahi kullanıcı tarafından hantal, anlaşılmaz ve stres kaynağı olarak algılanmasına yol açar.

```
       [ GDD Paradigm Shift ]
       Teknoloji/Özellik Odaklı:   Girdi Ver ──► Algoritma İşlesin ──► Çıktı Üret (Mekanik Süreç)
       Hedef Odaklı (GDD):         Kullanıcı Amacı ──► Bilişsel Rahatlama ──► Hedefe Ulaşma (İnsan Odaklı)
```

### 1.1 Market Segments vs. Personas
- **Pazar Segmentleri (Market Segments):** Demografik verilere (yaş, gelir, unvan, coğrafya) ve satın alma eğilimlerine odaklanır. Bir ürünün kimin tarafından *satın alınacağını* modeller.
- **Personalar (Design Personas):** Davranış kalıplarına (behavior patterns), zihinsel modellere, motivasyonlara ve nihai hedeflere odaklanır. Bir ürünün kimin tarafından *nasıl kullanılacağını* modeller.
  - *Kritik Kural:* Demografik olarak birebir aynı olan iki kullanıcı, bir arayüzle etkileşime girerken taban tabana zıt zihinsel modellere ve hedeflere sahip olabilir.

---

## 2. Hedef Hiyerarşisi (Goal Hierarchy)

Alan Cooper, insan motivasyonlarını üç temel katmana ayırır. Bir arayüz bu üç seviyeyi de eşzamanlı olarak tatmin etmelidir:

```
                  ┌───────────────────────────────┐
                  │          Life Goals           │  "Kim olmak istiyorum?"
                  │     (Öz-değer, Güven, Başarı) │  (Uzun vadeli varoluşsal)
                  └───────────────┬───────────────┘
                                  │
                  ┌───────────────▼───────────────┐
                  │          End Goals            │  "Ne yapmak istiyorum?"
                  │  (Görevi bitirme, Test çözme) │  (Somut ürün çıktıları)
                  └───────────────┬───────────────┘
                                  │
                  ┌───────────────▼───────────────┐
                  │       Experience Goals        │  "Nasıl hissetmek istiyorum?"
                  │  (Aptal hissetmemek, Eğlenmek)│  (Anlık bilişsel/duygusal)
                  └───────────────────────────────┘
```

### 2.1 Experience Goals (Deneyim Hedefleri)
- Kullanıcının sistemle etkileşim anında nasıl hissetmek istediğidir: *Yetkin hissetmek, aptal gibi hissetmemek, kontrolün kendisinde olduğunu bilmek, akış (flow) halinde kalmak.*
- *Tasarım Kuralı:* Bir hata mesajı asla kullanıcıyı suçlamamalı veya kafa karıştırıcı sistem kodları kusmamalıdır.

### 2.2 End Goals (Nihai Hedefler)
- Kullanıcının yazılımı açarken gerçekleştirmek istediği pratik amaçlardır: *Matematik deneme testini kaydetmek, haftalık çalışma sprintini tamamlamak, öğrenciye ödev atamak.*

### 2.3 Life Goals (Yaşam Hedefleri)
- Kullanıcının kimliğine ve uzun vadeli arzularına işaret eder: *Hedeflediği tıp fakültesini veya bilgisayar mühendisliğini kazanmak, alanında uzman ve disiplinli bir mühendis olmak.* Ürüne olan derin sadakati bu hedefin desteklenmesi besler.

---

## 3. Persona Tipleri ve Rol Matrisi

Tasarım yaparken "herkes için" tasarlamak "hiç kimse için tasarlamamak" demektir. Persona kümesi net sınırlarla filtrelenmelidir:

```
+-------------------------------------------------------------------------------+
|                             PERSONA ROLE MATRIX                               |
+-------------------------------------------------------------------------------+
| Persona Tipi   | Tanım                              | Tasarım Etkisi          |
|----------------+------------------------------------+-------------------------|
| Primary        | Arayüzün öncelikli olarak hedef    | Bu personayı memnun eden|
| Persona        | aldığı, ihtiyaçları başka bir      | tasarım esastır. Başka  |
|                | persona ile uzlaştırılamayan profil| persona için ödün verilmez|
|----------------+------------------------------------+-------------------------|
| Secondary      | Primary persona'nın arayüzünden    | Ekstra 1-2 özellik veya |
| Persona        | büyük oranda memnun kalan, ancak   | alternatif yol (shortcut)|
|                | ek 1-2 kritik ihtiyacı olan profil.| ile desteklenir.        |
|----------------+------------------------------------+-------------------------|
| Supplemental   | Primary ve Secondary tarafından    | Tasarım kararlarını     |
| Persona        | kapsanan, özel talep üretmeyenler. | bozamaz.                |
|----------------+------------------------------------+-------------------------|
| Anti-Persona   | Ürünün kesinlikle hedeflemediği,   | Sisteme gereksiz karmaşa|
|                | ihtiyaçları bilinçli reddedilenler.| katmamak için elenir.   |
+-------------------------------------------------------------------------------+
```

### 3.1 TulpiFlow Ekosistemi için İkili Persona Modellemesi
TulpiFlow bir **Asymmetric Co-Working Engine** olduğu için tek bir simetrik persona yerine iki farklı ama birbirine kenetlenen Primary Persona tanımlar:

1. **Öğrenci Personası (Fadime - Sınav / YKS Adayı):**
   - *End Goal:* Müfredat konularını eksiksiz bitirmek, günlük soru hedeflerine ulaşmak, koçunun atadığı ödevleri zamanında teslim etmek.
   - *Experience Goal:* Sade, boğmayan, sesle hızlıca görev tamamlanabilen, başardığında coşkulu tebrik (confetti) ile ödüllendirilen bir alan.
2. **Mentör / Geliştirici Personası (Anıl - Dev, Math & Data):**
   - *End Goal:* Kendi derin çalışma (Deep Work) bloklarını sürdürmek, eşzamanlı olarak öğrencisinin gelişim eğrisini ve tıkandığı noktaları tek ekranda izlemek, takvime görev delege etmek.
   - *Experience Goal:* Yüksek veri yoğunluğu, terminal/shortcut hızında klavye ergonomisi, sıfır gürültülü canlı durum paneli.
