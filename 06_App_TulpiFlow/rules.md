# TulpiFlow & Knowledge Base — Agent Operational Rules

Bu kurallar, Antigravity ve bağlı tüm otonom ajanların çalışma alanı genelinde tavizsiz uygulayacağı operasyonel ve mimari standartları tanımlar.

---

## 1. Determinism & Idempotency
- **Yeniden Üretilebilirlik (Reproducibility):** Üretilen her mimari doküman, veri modeli şeması ve kod modülü deterministik olmalıdır. Aynı girdiler ve koşullar altında sistem her zaman aynı kararlı durumları üretmelidir.
- **Idempotent İşlemler:** Dosya güncellemeleri, build scriptleri ve veri işleme pipeline'ları tekrar tekrar çalıştırıldığında beklenmeyen yan etkiler (side-effects) yaratmamalıdır.
- **Konfigürasyon Bütünlüğü:** Tüm çevre ve ortam değişkenleri, bağımlılık versiyonları ve build komutları net ve izlenebilir biçimde dokümante edilmelidir.

---

## 2. Strict Terminology Standard
- **Orijinal Teknik Terim Standardı:** Bilgisayar bilimleri, dağıtık sistemler, kullanıcı deneyimi ve arayüz mühendisliğine ait teknik terimler bozulmadan orijinal İngilizce formatında kullanılacaktır:
  - *Örnekler:* `LSM-Tree`, `B-Tree`, `Write-Ahead Log (WAL)`, `SSTable`, `Bloom Filter`, `Memtable`, `Write Amplification`, `Read Amplification`, `Space Amplification`, `Single-Leader`, `Multi-Leader`, `Leaderless`, `Read-Your-Writes`, `Monotonic Reads`, `Consistent Prefix Reads`, `Partitioning`, `Secondary Indexes`, `Snapshot Isolation`, `Write Skew`, `Phantom Reads`, `Linearizability`, `Two-Phase Commit (2PC)`, `Raft`, `Paxos`, `Event Sourcing`, `Change Data Capture (CDC)`, `Tail Latency`, `Mental Model`, `Implementation Model`, `Represented Model`, `Affordance`, `Satisficing`, `Goodwill Reservoir`, `Trunk Test`, `Design Tokens`, `Dual-Shadow`, `Optimistic UI`.
- **Açıklama Dili:** Kavramların analizi, açıklamaları, trade-off değerlendirmeleri ve bağlam kurma dili akıcı, doğrudan, profesyonel ve teknik derinliği yüksek Türkçe olacaktır.

---

## 3. Traceability & Audit Protocol
- **Anlık Loglama (Traceability):** Yapılan her dosya üretimi, modifikasyonu, refactoring adımı ve mimari karar `06_App_TulpiFlow/audit_log.md` dosyasına şemaya tam uyumlu olarak kaydedilecektir.
- **Log Şeması Zorunluluğu:**
  - Zaman damgası (`YYYY-MM-DD HH:mm:ss UTC+3`)
  - Çalışan model bilgisi
  - Prompt Hash / Context ID
  - Etkilenen hedef dosyalar
  - Eylem özeti (Action Summary)
  - Durum geçişi (`Status: READY -> IN_PROGRESS -> COMPLETED`)

---

## 4. Product & Architecture Core Principles
- **Tulpi Ecosystem Alignment:** TulpiFlow bağımsız bir masaüstü/mobil (PWA/APK) uygulama olarak tasarlanacak, ancak ileride `TulpiGo` süper-uygulamasına bir mikro-modül olarak tak-çalıştır (pluggable) biçimde entegre edilebilecek modüler API sözleşmelerine sahip olacaktır.
- **Asymmetric Co-Working Engine:** Sistem tek taraflı basit bir todolist değildir; Mentör/Öğretmen (Anıl - Dev, Math & Data) ile Öğrenci (Fadime - YKS / Akademik Hazırlık) arasındaki eşzamanlı çalışma, hesap verebilirlik (accountability) ve motivasyon dinamiğini canlı tutar.
- **Sensational UX Standard:** Krug ("Don't Make Me Think"), Cooper ("About Face") ve Wathan & Schoger ("Refactoring UI") ilkeleri uyarınca görsel hiyerarşi, mikro-animasyonlar, sesli görev tamamlama ve sansasyonel tebrik motoru kusursuz bir zarafetle çalışmalıdır.
