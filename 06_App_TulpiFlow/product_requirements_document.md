# Product Requirements Document (PRD): TulpiFlow

**Ürün Adı:** TulpiFlow  
**Üst Ekosistem:** TulpiGo (Gelecekte TulpiGo çekirdeğine mikro-modül olarak entegre edilecek bağımsız PWA/APK motoru)  
**Hedef Kitle:** Asimetrik Çalışma Çifti — Mentör/Geliştirici (Anıl) & Öğrenci (Fadime)  
**Doküman Sürümü:** 1.0.0-PROD  

---

## 1. Ürün Vizyonu ve Değer Önermesi

TulpiFlow, klasik ve sıkıcı "yapılacaklar listesi" (to-do list) uygulamalarını yıkarak; farklı hedeflere sahip iki bireyin birbirlerine karşı şeffaf, motive edici ve eşzamanlı hesap verebilirlik (accountability) kurduğu yeni nesil bir **Asymmetric Co-Working Engine**'dir.

```
+-----------------------------------------------------------------------------------+
|                                     TULPIFLOW                                     |
+-----------------------------------------------------------------------------------+
|  [Fadime's Space: Exam Prep / YKS]         |  [Anıl's Space: Dev, Math & Data]    |
|  - Voice Journal & Auto-Task Parsing       |  - Deep Work Sprints & PR Tracker    |
|  - Topic Tree Progress (TYT/AYT)           |  - Project Milestones & Study Logs   |
|  - Pomodoro Status: In Session (25m)       |  - Pomodoro Status: Focus Mode (50m) |
+-----------------------------------------------------------------------------------+
|                        SHARED ACCOUNTABILITY & CALENDAR                           |
|  - Cross-User Live Status & Heatmap        - Custom Avatars / Profiles            |
|  - Mutual Task Assignment & Schedule       - Celebration Engine (Confetti / Modal)|
|  - Hata Defteri & S.O.S. Tıkandım Modülü   - Single-use Device Auth (Passcode)    |
+-----------------------------------------------------------------------------------+
```

---

## 2. Kullanıcı Personaları ve Alanlar (Workspaces)

### 2.1 Workspace 1: Fadime's Space (Akademik Hazırlık / YKS)
- **Ana Hedef:** TYT/AYT Matematik, Geometri, Türkçe ve Fen konularını eksiksiz bitirmek, günlük soru hedeflerine ulaşmak, deneme sonuçlarını izlemek.
- **Kritik Özellikler:**
  - Konu Ağacı (Topic Tree) ile görsel ilerleme yüzdesi.
  - Hata Defteri & Boş Bırakılanlar (Zorlanılan soruların kaydı).
  - "Tıkandım / S.O.S." sinyali (Mentöre anlık bildirim gönderme).
  - Sesli Günlük (Voice Journal) ile 2 saniyede görev tamamlama.

### 2.2 Workspace 2: Anıl's Space (Mühendislik, Matematik ve Veri Analitiği)
- **Ana Hedef:** Derin çalışma (Deep Work) bloklarını tamamlamak, kodlama/mimari sprintlerini yönetmek ve eşzamanlı olarak öğrencisinin gelişimini denetlemek.
- **Kritik Özellikler:**
  - Sprint & Proje Takibi (Architecture, Machine Learning, DDIA araştırmaları).
  - Öğrenciye Görev Delege Etme (Cross-Assignment Calendar).
  - Sesli/Yazılı Mentör Teşviki (Hızlı mikro-not bırakma).

---

## 3. Temel Fonksiyonel Gereksinimler

### 3.1 Sensational WOW Açılış Deneyimi ("tulpi normal flow")
- Uygulama ilk açıldığında veya logo tıklandığında ekrana yüksek kaliteli, neon ışıltılı, kromatik sapmalı ve parçacıklı tipografi animasyonu ile **"tulpi normal flow"** yazısı gelir.
- Bu efekt 1.8 saniye içinde zarifçe genişleyerek doğrudan ana çalışma alanına (dashboard) geçiş yapar.

### 3.2 Tek Seferlik Cihaz Giriş Şifresi (Device Passcode Protection)
- APK dağıtıldığında yabancıların erişimini engellemek için iki adet sabit cihaz şifresi tanımlanır:
  - **Anıl (Mentör / Admin):** `ANIL-7799-FLOW`
  - **Fadime (Öğrenci):** `FADIME-2026-YKS`
- Kullanıcı şifreyi cihazında **bir kez** girdiğinde, oturum token'ı yerel depolamada (`localStorage` / `IndexedDB`) kalıcı olarak kilitlenir. Uygulama bir daha asla şifre sormaz; doğrudan ilgili kullanıcının alanıyla açılır.

### 3.3 Doğal Dil ve Ses Odaklı Görev Otomasyonu (Voice-to-Task & Semantic Matching)
- **Web Speech API & Mikrofon:** Tek dokunuşla konuşma kaydı.
- **Deterministik Intent Eşleme:**
  - Tetikleyiciler: *"hallettim"*, *"bitti"*, *"çözdüm"*, *"tamamladım"*, *"haloldu"*, *"okudum"*.
  - Örnek: *"Bugün türevde geometrik yorumu bitirdim, hallettim"* cümlesi `Türev -> Geometrik Yorum` düğümünü anında `COMPLETED` yapar.
  - Örnek: *"Fonksiyonlar testini çözdüm"* cümlesi `Fonksiyonlar` konusunu tamamlar.
- **Manuel Yedek (Graceful Fallback):** Mikrofon izni veya desteği olmayan tarayıcılarda hızlı metin yazma veya hazır butonlarla ses simülasyonu sunulur.

### 3.4 Kutlama ve Geri Bildirim Motoru (Celebration Engine)
- Görev tamamlandığında:
  1. **Full-Canvas Confetti:** Rengarenk fiziksel parçacıklar ekrana saçılır.
  2. **Synthesized Audio Chime:** Web Audio API ile dış ses dosyasına ihtiyaç duymadan 3 kademeli zengin tebrik melodisi çalınır.
  3. **Kişiselleştirilmiş Tebrik Kartı:** *"Tebrikler Fadime! Türev konusunu başarıyla tamamladın. Harika bir ivme yakaladın! 🎉"*

### 3.5 Çift Yönlü Takvim ve Görev Atama (Cross-Assignment)
- Mentör (Anıl), Fadime'nin takvimine doğrudan tarihli ve saatli çalışma görevi atayabilir.
- Fadime bu görevi kendi takviminde ve ana sayfasında özel "Koçtan Gelen Görev" rozetiyle görür.
- Tamamlandığında Anıl'ın bildirim akışına onay düşer.

### 3.6 Canlı Hesap Verebilirlik (Live Accountability & Pomodoro)
- Esnek Pomodoro Modları:
  - **25 / 5 Standart Pomodoro**
  - **50 / 10 İleri Seviye Blok**
  - **Deep Work (Süresiz Derin Çalışma Kronometresi)**
- Sesli alarm bildirimleri ve çalışma durumu rozetleri (`Odakta`, `Molada`, `Boşta`).
- Ortak İlham Panosu: Toplam çalışma süresi, haftalık streak ve GitHub tarzı 365 günlük aktivite ısı haritası (activity heatmap).

### 3.7 Akıllı Destek Modülleri (Düşünülmemiş Katma Değer Özellikler)
1. **Focus Shield (Ortam Sesi Sentezleyici):**
   - Web Audio API ile üretilen pembe gürültü (Pink Noise), kütüphane uğultusu ve yağmur sesleri ile odaklanmayı artırma.
2. **Hata Defteri (Question Mistake Log):**
   - Öğrencinin boş bıraktığı veya yanlış yaptığı kritik soru tiplerini not alıp daha sonra mentöre sormak üzere biriktirmesi.
3. **S.O.S. / Tıkandım Sinyali:**
   - Öğrenci bir konuda zorlandığında tek tuşla mentöre "Bu konuda yardıma ihtiyacım var" çağrısı bırakır.
4. **Offline-First & JSON Veri Yedekleme:**
   - Tek tıkla tüm ilerlemeyi JSON olarak dışa aktarma (Export) ve geri yükleme (Import).
