# Usability Testing Heuristics & Goodwill Reservoir (Don't Make Me Think Module 03)

Bu doküman; Steve Krug'un *Don't Make Me Think* kitabında yer alan Kullanıcı İyi Niyet Rezervuarı (The Reservoir of Goodwill) kavramını ve kaynak israfını önleyen hafifletilmiş kullanılabilirlik test metodolojisini tanımlar.

---

## 1. İyi Niyet Rezervuarı (The Reservoir of Goodwill)

Her kullanıcı bir uygulamayı açtığında zihninde doluluk oranı değişen bir "İyi Niyet / Tolerans Havuzu" ile gelir:

```
               ┌───────────────────────────────┐
               │    RESERVOIR OF GOODWILL      │
               │~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~│ ◄── Başlangıç seviyesi (Kullanıcıya göre değişir)
               │                               │
               │  [ - ] Formda gereksiz alan   │ ◄── Su seviyesi düşer (Frustrasyon)
               │  [ - ] Hatalı ses tanıma      │
               │  [ - ] Karmaşık şifreleme     │
               │                               │
               │  [ + ] Hızlı, sihirli tepki   │ ◄── Su seviyesi yükselir (Memnuniyet)
               │  [ + ] Coşkulu tebrik konfeti │
               │  [ + ] Temiz, ferah tasarım   │
               └───────────────────────────────┘
```

### 1.1 Rezervuarın Doğası
- **Kişiye Özeldir:** Bazı kullanıcılar sabırlıdır (büyük havuz), bazıları acelecidir (küçük havuz).
- **Duruma Bağlıdır:** Kullanıcı sınav stresinde veya yorgunsa havuz zaten yarı boştur.
- **Tükenirse Terk Edilir:** Rezervuar boşaldığında kullanıcı uygulamayı kapatır, sekmeyi terk eder veya uygulamayı telefonundan siler.

### 1.2 Havuzu Azaltan vs. Artıran Faktörler
```
+-------------------------------------------------------------------------------+
|                       GOODWILL FACTOR COMPARISON                              |
+-------------------------------------------------------------------------------+
| Rezervuarı Boşaltanlar (Drainers)    | Rezervuarı Dolduranlar (Refillers)     |
|--------------------------------------+----------------------------------------|
| Kullanıcının istediği bilgiyi saklamak| İstenen şeyi doğrudan, en önde sunmak  |
| Hata durumunda kullanıcıyı azarlamak | Hataları sessizce tolere etmek/düzeltmek|
| Gereksiz adımlar ve form alanları    | Tek tuşla veya sesle işlemi bitirmek   |
| Uygulamanın amatör ve özensiz durması| Estetik, akıcı, zevk veren mikro-animasyon|
| Oturum süresi doldu diye veri kaybetmek| Oturumu yerel hafızada kalıcı tutmak  |
+-------------------------------------------------------------------------------+
```

---

## 2. Hafifletilmiş Kullanılabilirlik Testi (Do-It-Yourself Usability Testing)

Geleneksel laboratuvar testleri pahalı, aylar süren ve hantal süreçlerdir. Krug'un yalın felsefesi:
> *"Ayda bir sabah, 3 kullanıcı ile test yapın. Öğleden sonra ekiple toplanıp en büyük 3 sorunu seçin ve haftaya kadar düzeltin."*

```
       [ Krug Usability Cycle ]
       Ayda 1 Gün (Sabah)   ──► 3 Katılımcı (Her biri 45 dakika, sesli düşünme)
       Öğle Yemeği          ──► Gözlemcilerle Triyaj Toplantısı
       Öğleden Sonra        ──► En Kritik 3 Problemin Belirlenmesi
       Sonraki Sprint       ──► Hızlı Yama ve İyileştirme
```

### 2.1 Neden 3 Kullanıcı Yeterlidir?
- İlk 3 kullanıcı sistemdeki en bariz, en felaket kullanılabilirlik sorunlarının (boulders / dev kayalıklar) %70-80'ini hemen ortaya çıkarır.
- 10 kullanıcı test etmek yalnızca aynı sorunları defalarca izlemenize ve rapor yazma yükü altında ezilmenize neden olur.

### 2.2 Triyaj Prensibi: Çakıl Taşları Değil, Dev Kayaları Temizleyin
- Test sonrasında yüzlerce ufak kusur listelenebilir.
- *Kural:* Ekip dikkatini "yapması hoş olan" detaylara değil, kullanıcının hedefine ulaşmasını tamamen engelleyen bloklayıcı sorunlara (showstoppers) odaklamalıdır.
