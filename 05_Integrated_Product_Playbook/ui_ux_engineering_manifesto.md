# UI/UX & Product Engineering Manifesto (Module 05)

Bu manifesto; Martin Kleppmann'ın (DDIA) dağıtık veri güvenilirliği felsefesi ile Alan Cooper'ın (About Face) hedef odaklı tasarımını, Steve Krug'un (Don't Make Me Think) kullanılabilirlik realizmini ve Wathan & Schoger'ın (Refactoring UI) taktiksel zanaatini tek bir mühendislik andında birleştirir.

---

## 1. Çekirdek İlkeler (The Unified Tenets)

```
        [ The 4 Pillars of Product Craftsmanship ]
        
       DDIA (Reliability & Truth)             About Face (Human Empathy)
       "Veri asla kaybolmaz, sistem          "Kullanıcı aptal değildir;
        çöküşü kullanıcıya yansımaz."         arayüz makineyi insana uydurur."
                       ▲                                    ▲
                       │                                    │
                       └─────────────────┬──────────────────┘
                                         │
                       ┌─────────────────┴──────────────────┐
                       │                                    │
                       ▼                                    ▼
       Don't Make Me Think (Frictionless)     Refactoring UI (Visual Excellence)
       "Kullanıcıyı düşündürme,              "Gelişigüzel değil, sistematik
        ilk bakışta taranabilir yap."         estetik; her pikselin amacı vardır."
```

### İlke I: Veri Güvenliği ile Kullanıcı Deneyimi Çelişmez
Bir uygulamanın güvenilirliği (Reliability) doğrudan kullanıcı deneyimidir. Bir formun çökmesi veya yazılan bir notun kaybolması, dünyanın en güzel animasyonuna sahip olsa dahi o uygulamayı çöp yapar. Her veri girişi anında local-first olarak güvene alınmalıdır.

### İlke II: Makinenin İç Yapısı Kullanıcıyı İlgilendirmez
Sistem arkada ister PostgreSQL, ister RocksDB SSTables, ister Kafka stream kullansın; arayüz bu mekanik detayları kullanıcıya hissettirmez. Kullanıcının zihinsel modeli (Mental Model) kutsaldır.

### İlke III: Bilişsel Yükü Sıfırla (Don't Make Me Think)
Her butonun ne yaptığı 100 milisaniye içinde anlaşılmalıdır. Ekranda aynı amaca hizmet eden iki yol veya kullanıcının "acaba ne olacak?" diye duraksadığı hiçbir belirsizlik bırakılamaz.

### İlke IV: Rafine Görsel Hiyerarşi ve Tipografik Disiplin
Renkler gelişigüzel seçilmez. Boşluklar rastgele verilmez. 4px/8px ölçeği, 65ch satır genişliği, dual-shadow derinliği ve yüksek kontrastlı tipografi ile her ekran profesyonel bir dergi sayfasının zarafetine sahip olmalıdır.

---

## 2. Design Tokens ve Component Sözleşmeleri (Contracts)

Her UI bileşeni şu katı sözleşmeye uymalıdır:

```
+-------------------------------------------------------------------------------+
|                       COMPONENT CONTRACT SPECIFICATION                        |
+-------------------------------------------------------------------------------+
| Durum (State)      | Zorunlu Görsel Davranış                                  |
|--------------------+----------------------------------------------------------|
| Idle (Varsayılan)  | Temiz, yüksek kontrastlı metin, tanımlı elevation gölgesi |
| Hover / Focus      | Yumuşak ton açılması, belirgin erişilebilirlik halkası    |
| Active (Tıklama)   | Hafif ölçek küçülmesi (transform: scale(0.98))           |
| Loading (Yükleniyor)| Spinner yerine iskelet (skeleton) veya buton içi nabız    |
| Disabled           | Opaklık %50, cursor: not-allowed, neden kilitli açıklaması|
| Error              | Kırmızı çerçeve, doğrudan çözüm öneren açık mikro-metin  |
+-------------------------------------------------------------------------------+
```

---

## 3. Micro-Copy ve İletişim Standartları

- **Asla Suçlama:** "Yanlış şifre girdiniz" yerine "Şifre eşleşmedi. Tekrar deneyin."
- **Net ve Eyleme Dönük:** "Tamam" yerine "Ödevi Kaydet", "İptal" yerine "Vazgeç".
- **Coşku ve Ödüllendirme:** Başarı anlarında yapay zeka/uygulama heyecanını gösterir: "Harika iş Fadime! Türev konusunu bitirdin, hedefine bir adım daha yaklaştın! 🎉"
