# TulpiFlow — Uygulama Çalıştırma, PWA ve Ücretsiz APK Rehberi

Bu rehber; TulpiFlow uygulamasını yerel tarayıcınızda anında çalıştırma, cep telefonunuza PWA (Progressive Web App) olarak tek tıkla yükleme veya tamamen ücretsiz açık kaynak araçlarla (Capacitor) bağımsız bir **Android APK** dosyasına dönüştürme adımlarını anlatır.

---

## 🔑 1. Özel Cihaz Erişim Şifreleri (One-Time Device Passcodes)

APK yabancı kişilerin eline geçse bile uygulamanın açılmaması için cihaza özel tek seferlik güvenlik anahtarları tanımlanmıştır. Bir kez girildiğinde cihazın yerel hafızasına (`localStorage`) güvenli oturum token'ı mühürlenir ve bir daha şifre sormaz:

| Kullanıcı | Rol / Alan | Cihaz Erişim Şifresi | Oturum Davranışı |
| :--- | :--- | :--- | :--- |
| **Anıl** | Sistem Mimarı, Dev, Math & Mentör | `ANIL-7799-FLOW` | Doğrudan Anıl'ın çalışma alanıyla açılır. |
| **Fadime** | YKS 2026 Öğrencisi / Derece Adayı | `FADIME-2026-YKS` | Doğrudan Fadime'nin YKS ders ağacıyla açılır. |

> 💡 *İpucu:* Giriş ekranındaki alt butonlara ("👑 Anıl" veya "🌸 Fadime") tıklayarak da tek tıkla hızlıca giriş yapabilirsiniz.

---

## 🚀 2. Uygulamayı Hemen Yerel Tarayıcıda Çalıştırma

Hiçbir kurulum yapmadan doğrudan çalıştırmak için iki yöntem mevcuttur:

### Yöntem A: Doğrudan Çift Tıklayarak Açma
1. `Engineering_Design_Knowledge_Base/06_App_TulpiFlow/tulpiflow_app/index.html` dosyasına çift tıklayın.
2. Varsayılan tarayıcınızda (Chrome, Edge, Brave, Safari) anında açılacaktır.

### Yöntem B: Yerel HTTP Sunucusu ile Açma (Önerilen)
Web Speech API ve Service Worker'ın tam yetkiyle çalışması için:
```bash
cd c:\Users\Anil\Desktop\Engineering_Design_Knowledge_Base\06_App_TulpiFlow\tulpiflow_app
npx serve .
```
Tarayıcınızda `http://localhost:3000` adresine gidin.

---

## 📱 3. Cep Telefonuna PWA Olarak Yükleme (0 TL / Sıfır Kurulum / En Pratik Yol)

Uygulama tam bir PWA (Progressive Web App) olarak kodlanmıştır. Telefonunuza APK kurmakla uğraşmadan tıpkı native bir mobil uygulama gibi ana ekrana ekleyebilirsiniz:
1. Telefonunuzun tarayıcısından (Chrome veya Safari) bilgisayarınızın yerel IP'sine veya yüklediğiniz adrese girin.
2. Tarayıcı menüsünden **"Ana Ekrana Ekle" (Add to Home Screen)** veya **"Uygulamayı Yükle"** butonuna dokunun.
3. TulpiFlow özel lale ikonuyla telefonunuzun uygulama çekmecesine eklenir; durum çubuğu olmadan tam ekran (standalone) ve çevrimdışı (offline) çalışır!

---

## 📦 4. Android APK Üretme (Tamamen Ücretsiz / Yerel Araçlarla)

TulpiFlow, bulut servislerine veya ücretli platformlara ihtiyaç duymadan Capacitor ile doğrudan derlenir:

### Tek Tıkla Otomatik Derleme:
Klasör içindeki `build_apk.bat` dosyasına çift tıklayın. Script sırasıyla:
1. Ücretsiz `@capacitor/core`, `@capacitor/cli` ve `@capacitor/android` paketlerini kurar.
2. `android` klasörünü ve yerel Gradle projesini oluşturur.
3. Arka planda `gradlew assembleDebug` komutunu çalıştırarak imzalı debug APK'yı üretir.

### Çıktı Dosyası:
Derleme tamamlandığında APK dosyanız şu konumda hazır olur:
```
tulpiflow_app/android/app/build/outputs/apk/debug/app-debug.apk
```
Bu `.apk` dosyasını USB, WhatsApp veya Google Drive ile telefonunuza atıp tek tıkla kurabilirsiniz!

---

## 🌟 5. Uygulamaya Dahil Edilen Katma Değerli Özellikler

1. **Sensational "tulpi normal flow" WOW Efekti:**
   - Açılışta uzaysal neon parçacık ağı, holografik parlama ve Web Audio sentezleyicisi ile kristal akor çalar. Sol üstteki logoya tıklanarak her zaman yeniden izlenebilir.
2. **Doğal Dil ve Sesli Görev Tamamlama (Voice-to-Task):**
   - Web Speech API ile Türkçe ses tanıma.
   - *"Bugün türevde geometrik yorumu bitirdim, hallettim"* dendiğinde ilgili müfredat konusunu otomatik olarak tamamlar.
3. **Kutlama Motoru (Celebration Engine):**
   - Tam ekran fizik motorlu konfeti yağmuru, polifonik zafer melodisi ve kişiye özel başarı modali.
4. **Çift Yönlü Takvim & Görev Delege Paneli (Cross-Assignment):**
   - Anıl (Koç), Fadime'ye tarihli ve öncelikli ödev atayabilir; Fadime'nin ekranında "⭐ Koçtan Gelen" rozetiyle görünür.
5. **Esnek Pomodoro & Deep Work Sayacı:**
   - 25/5, 50/10 ve sınırsız derin çalışma modları. Çember animasyonu ve seans bitiş gongu.
6. **Focus Shield (Ortam Sesi Sentezleyici):**
   - Web Audio API ile dış dosya indirmeden saf matematiksel pembe gürültü ve hafif yağmur uğultusu sentezleyerek dış sesleri izole eder.
7. **Hata Defteri & Boş Bırakılanlar:**
   - Yapılamayan kritik soruların ve takılınan kavramların kayıt defteri.
8. **Acil Durum S.O.S. / Tıkandım Sinyali:**
   - Öğrencinin tıkandığı konuyu tek tuşla mentörün denetim paneline iletmesi.
9. **Ortak Isı Haritası (365 Gün Streak):**
   - GitHub tarzı yıllık çalışma yoğunluk matrisi ve kümülatif çalışma saatleri.
10. **Yerel Veri Yedekleme (Local-First):**
    - Tek tıkla tüm çalışma geçmişini JSON olarak indirme ve geri yükleme.
