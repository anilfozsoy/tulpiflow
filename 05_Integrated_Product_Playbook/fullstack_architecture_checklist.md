# Fullstack Architecture & Resilience Checklist (Module 05)

Bu doküman; DDIA'nın dağıtık sistem güvenilirliği ilkeleri ile modern web ve mobil istemci mimarisini (Optimistic UI, offline-first cache, tail latency koruması) uçtan uca birbirine bağlayan mimari denetim listesidir (checklist).

---

## 1. Veri Tutarlılığı ve İstemci Durum Yönetimi (Client State Cache)

```
       [ Optimistic UI Data Flow ]
       
       Kullanıcı Tıklar ("Görevi Bitir")
              │
              ├──► 1. UI anında güncellenir (✓ Tik atılır, ses/konfeti çalar) ◄── [0ms Gecikme]
              ├──► 2. Local Cache (IndexedDB / LocalStorage) güncellenir
              │
              └──► 3. Asenkron API İsteği Gönderilir (Header: Idempotency-Key: uuid-v4)
                        │
                        ├──► Başarılı: Arka planda sunucu LSN / versiyonu onaylanır.
                        └──► Hata (Network Drop):
                                 - Retry with exponential backoff & jitter.
                                 - Ağ kalıcı olarak çökerse: UI nazikçe rollback yapar ve
                                   "Çevrimdışı kaydedildi, bağlantı bekleniyor" rozeti gösterir.
```

### 1.1 Checklist: Client State & Cache
- [x] **Optimistic UI:** Kullanıcının rutin eylemleri (görev tamamlama, favoriye alma, ses kaydı ekleme) network gidiş-dönüş süresi (round-trip) beklenmeden arayüzde anında gerçekleşmelidir.
- [x] **Stale-While-Revalidate (SWR Pattern):** Sayfa açıldığında önce lokal cache'teki veri gösterilmeli, arka planda sunucudan en güncel veri çekilip sessizce güncellenmelidir (sıfır boş ekran / spinner beklemesi).
- [x] **Offline-First Storage:** İnternet tamamen kesilse dahi uygulama tam işlevsel çalışmalı, veriler yerel diskte (IndexedDB / LocalStorage) saklanmalı, bağlantı kurulduğunda senkronize edilmelidir.

---

## 2. Ağ Dayanıklılığı ve Backend Resilience (DDIA Entegrasyonu)

### 2.1 Idempotency Keys
- Her mutasyon isteği (POST/PUT) istemci tarafından üretilen benzersiz bir `Idempotency-Key` (UUIDv4) başlığı taşır.
- Network zaman aşımına uğrayıp istemci isteği tekrar gönderdiğinde sunucu işlemi iki kez yapmaz; ilk işlemin sonucunu döner.

### 2.2 Tail Latency Azaltma Taktikleri
- Dağıtık mimaride kullanıcıların %99'u (p99) veya %99.9'u (p99.9) en yavaş sunucu düğümünün gecikmesine maruz kalır (Tail Latency Amplification).
- **Hedged Requests:** İstemci veya API Gateway, yanıt belirli bir eşiği (örn. p95 süresi) aştığında paralel olarak aynı isteği ikinci bir replikaya gönderir; ilk dönen yanıtı kabul eder.
- **Circuit Breaker:** Arka plan servisi yanıt vermeyi kestiğinde istemciyi bekletmeden anında lokal fallback devreye sokulur.
- **Exponential Backoff with Full Jitter:** Yeniden denemeler (`retry`) tüm istemcilerin aynı anda sunucuya yüklenmesini (Thundering Herd) önlemek için rastgele gecikmelerle dağıtılır:
  $$t_{\text{sleep}} = \text{random}(0, \min(M, B \times 2^{\text{attempt}}))$$
