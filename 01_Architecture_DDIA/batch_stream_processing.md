# Batch & Stream Processing (DDIA Module 01)

Bu doküman; Martin Kleppmann'ın *Designing Data-Intensive Applications (DDIA)* kitabının 10, 11 ve 12. bölümlerinde incelenen toplu işlem (batch processing), akış işleme (stream processing), Event Sourcing, Change Data Capture (CDC) ve dağıtık veri akışlarında hata toleransı mekanizmalarının mimari özetidir.

---

## 1. Batch Processing: Unix Felsefesi ve MapReduce

Toplu işlem (Batch Processing), sonlu büyüklükteki (bounded) geçmiş veri setleri üzerinde periyodik olarak çalışan, yüksek throughput odaklı hesaplama modelidir.

```
       [ Unix Pipeline Analogy ]
       cat access.log | awk '{print $7}' | sort | uniq -c | sort -r -n | head -n 5
              │
              ▼ (Distributed MapReduce Analogy)
       [ Input Files ] ──► [ Map Phase ] ──► [ Shuffle/Sort ] ──► [ Reduce Phase ] ──► [ Output ]
```

### 1.1 Unix Pipeline İlkeleri
- **Tek İş Yap, İyi Yap (Do One Thing Well):** Küçük ve bağımsız programlar.
- **Standart Arayüz (Uniform Interface):** Her programın çıktısı bir sonrakinin girdisi olabilecek evrensel byte akışı (stdin/stdout).
- **Şeffaf Kompozisyon (Composability):** Veri işleme adımları birbirine boru hatları (pipes) ile bağlanır; aracı geçici dosyalara gerek kalmadan bellek üzerinden akar.

### 1.2 MapReduce Mimarisi ve Dayanıklılık (Fault-Tolerance)
- **Map:** Girdi kayıtlarını anahtar-değer (`Key-Value`) çiftlerine dönüştürür.
- **Partition & Shuffle/Sort:** Aynı anahtara sahip tüm kayıtlar deterministik olarak aynı Reducer node'una yönlendirilir ve sıralanır.
- **Reduce:** Aynı anahtara ait tüm değerler toplanarak nihai analitik çıktı üretilir.
- **Determinizm ve Yan Etkisizlik (Side-effect free):** Mapper veya Reducer çökerse, işlem baştan başlatılabilir. Çıktı dosyaları yalnızca işlem tamamen bittiğinde atomik olarak yeniden adlandırılır (`atomic rename`).

---

## 2. Stream Processing: Partitioned Logs, Kafka ve Event Sourcing

Akış işleme (Stream Processing), zaman içinde sürekli akan, sınırsız (unbounded) verilerin düşük gecikmeyle (low latency) gerçek zamanlı işlenmesidir.

```
       [ Partitioned Log Architecture (Apache Kafka) ]
       
       Producer ──► [ Partition 0 ] [0][1][2][3][4][5][6]... ──► Consumer Group A (Offset: 4)
                ──► [ Partition 1 ] [0][1][2][3][4]...        ──► Consumer Group B (Offset: 2)
                ──► [ Partition 2 ] [0][1][2][3][4][5]...
```

### 2.1 Partitioned Log Tabanlı Mesajlaşma (Kafka Mimarisi)
Geleneksel JMS/RabbitMQ mesaj kuyrukları mesaj tüketildikten sonra silinirken, partitioned log tabanlı sistemlerde:
- Mesajlar diskte sıralı (append-only) bir log olarak tutulur ve belirlenen retention süresi boyunca silinmez.
- Tüketiciler (Consumers) kendi okuma konumlarını (**Offset**) yönetir. Bir tüketici geriye sarıp (replay) eski olayları baştan işleyebilir.
- **Fan-Out Yeteneği:** Aynı olay akışını birden fazla bağımsız servis (örn. analiz motoru, bildirim servisi, cache invalidator) birbirini etkilemeden farklı hızlarda okuyabilir.

### 2.2 Change Data Capture (CDC)
Birincil veritabanının (OLTP) içsel Write-Ahead Log'unu (WAL / binlog) dinleyerek, yapılan her `INSERT`, `UPDATE`, `DELETE` işlemini bir olay (event) akışına dönüştürme mekanizmasıdır (Örn. Debezium).
- Veritabanı ile Elasticsearch veya Redis cache arasındaki tutarsızlıkları önler (Dual-write problemini ortadan kaldırır).

### 2.3 Event Sourcing
- Sistemin durumunu (state) doğrudan veritabanında güncellemek yerine, durum değişikliklerini tetikleyen tüm olayları değişmez (immutable) bir olay log'unda saklama desenidir.
- Güncel durum, başlangıçtan bu yana gelen tüm olayların ardışık olarak yeniden oynatılmasıyla (replay / folding) elde edilir.
- Tam audit geçmişi (traceability), zaman yolculuğu (time-travel debugging) ve deterministik yeniden üretim sağlar.

---

## 3. Stream Joins ve Pencereleme (Windowing)

Akışlarda veriler zamana bağlı aktığı için join işlemleri pencereleme (windowing) gerektirir.

```
+-------------------------------------------------------------------------------+
|                             STREAM JOIN PATTERNS                              |
+-------------------------------------------------------------------------------+
| Join Type          | Sol Taraf          | Sağ Taraf        | Örnek Senaryo    |
|--------------------+--------------------+------------------+------------------|
| Stream-Stream      | Unbounded Stream   | Unbounded Stream | Tıklama ile satın|
| (Windowed Join)    |                    |                  | almayı 1 saatlik |
|                    |                    |                  | pencerede eşleme |
|--------------------+--------------------+------------------+------------------|
| Stream-Table       | Unbounded Stream   | Bounded / Slow-  | Sipariş akışını  |
| (Enrichment Join)  |                    | moving Table     | kullanıcı profili|
|                    |                    |                  | ile zenginleştirme|
|--------------------+--------------------+------------------+------------------|
| Table-Table        | Materialized View  | Materialized View| Twitter takipçi  |
| (Change-log Join)  | CDC Stream         | CDC Stream       | listesi ve tweet |
|                    |                    |                  | akışı birleştirme|
+-------------------------------------------------------------------------------+
```

### 3.1 Zaman Kavramları (Time Semantics)
- **Event Time:** Olayın cihazda/kullanıcı tarafında gerçekte meydana geldiği an (zaman damgası yük içindedir).
- **Processing Time:** Olayın akış motoru sunucusuna ulaşıp işlendiği an.
- **Watermarks:** Geç gelen (out-of-order) verileri yönetmek için kullanılır; motor "bu zaman damgasından önceki tüm verilerin geldiğini varsayıyorum" diyerek pencereyi kapatır.

---

## 4. Fault-Tolerance ve Exactly-Once Semantics

Dağıtık bir sistemde ağ kesintileri ve sunucu çökmeleri anında mesaj iletim garantileri:
- **At-least-once (En az bir kez):** Hata anında mesaj yeniden iletilir; mükerrer (duplicate) işleme riski vardır.
- **At-most-once (En çok bir kez):** Hata anında mesaj kaybolabilir, asla tekrar denenmez.
- **Effectively Exactly-Once (Tam olarak bir kez hissi):**
  1. **Idempotence:** İşlem aynı parametrelerle birden fazla kez çalıştırılsa bile sistem durumunun tek bir çalıştırma ile özdeş kalması (Idempotency Key kullanımı).
  2. **Distributed Snapshot / Chandy-Lamport (Flink):** Belirli aralıklarla akış içine barrier enjekte edilerek kaynak ve hedef durumlarının atomik checkpoint'e alınması.
  3. **Atomic Commit across Log & State:** Log offset ilerlemesi ile state güncellemesinin aynı transaction içinde commit edilmesi.
