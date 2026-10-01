# Distributed Systems: Replication, Partitioning & Consensus (DDIA Module 01)

Bu doküman; Martin Kleppmann'ın *Designing Data-Intensive Applications (DDIA)* kitabının 5, 6, 7, 8 ve 9. bölümlerinde yer alan replikasyon topolojileri, partitioning stratejileri, transaction izolasyon seviyeleri ve dağıtık konsensüs algoritmalarının kapsamlı referansıdır.

---

## 1. Replikasyon Modelleri (Replication Topologies)

Verinin birden fazla node üzerinde kopyalanması yüksek erişilebilirlik (high availability), gecikme azaltma (latency reduction) ve ölçeklenebilirlik (scalability) sağlar.

```
       [ Single-Leader ]             [ Multi-Leader ]               [ Leaderless ]
         Client Writes                Client Writes                 Client Writes
               │                         ┌─────┴─────┐                 ┌────┼────┐
               ▼                         ▼           ▼                 ▼    ▼    ▼
          ┌─────────┐              ┌─────────┐   ┌─────────┐        ┌───┐┌───┐┌───┐
          │ Leader  │              │Leader A │◄─►│Leader B │        │ N1││ N2││ N3│
          └────┬────┘              └────┬────┘   └────┬────┘        └───┘└───┘└───┘
       Replicate │                   Replicate     Replicate           Quorum: W + R > N
         ┌─────┴─────┐                  │             │             Sloppy Quorums &
         ▼           ▼                  ▼             ▼             Hinted Handoff
     ┌───────┐   ┌───────┐          ┌───────┐     ┌───────┐
     │Follower   │Follower          │Follower     │Follower
     └───────┘   └───────┘          └───────┘     └───────┘
```

### 1.1 Single-Leader (Master-Slave)
- **Çalışma Prensibi:** Tüm yazma (write) istekleri yalnızca tek bir Leader node'a gider. Leader bu yazmaları bir replikasyon log'u (WAL / Statement / Row-based) aracılığıyla Follower'lara iletir. Okumalar hem Leader hem de Follower'lardan yapılabilir.
- **Senkron vs. Asenkron Replikasyon:** Tam senkron replikasyonda bir node çökerse yazmalar kilitlenir; bu nedenle pratik sistemlerde genelde yarı-senkron (1 follower senkron, diğerleri asenkron) yaklaşım tercih edilir.

### 1.2 Multi-Leader (Master-Master)
- Coğrafi olarak dağıtılmış veri merkezlerinde (cross-datacenter) veya çevrimdışı çalışabilen istemcilerde (offline-first client apps) kullanılır.
- **En Büyük Problem: Çakışma Çözümü (Conflict Resolution):** Aynı anda iki farklı veri merkezinde aynı satır güncellenirse çakışma doğar.
  - *Last Write Wins (LWW):* Saat sapması (clock drift) nedeniyle veri kaybına yol açabilir.
  - *Conflict-Free Replicated Data Types (CRDTs):* Matematiksel olarak deterministik birleşebilen veri yapıları.
  - *Merge Procedures:* Uygulama kodunda custom merge tetikleme.

### 1.3 Leaderless (Dynamo-Style)
- Amazon Dynamo, Apache Cassandra ve Riak tarafından kullanılır.
- Belirli bir lider yoktur; istemci yazmaları doğrudan birden çok replikaya paralel olarak gönderir.
- **Quorum Kuralı ($W + R > N$):** $N$ toplam replika sayısı, $W$ yazmanın başarılı sayılması için gereken onay sayısı, $R$ okumanın başarılı sayılması için gereken node sayısıdır. $W + R > N$ sağlandığında en az bir node en güncel veriyi taşır (Pigeonhole Principle).
- **Sloppy Quorums & Hinted Handoff:** Ağ bölünmesinde (network partition) belirlenen $N$ node erişilemezse, geçici olarak kümedeki diğer node'lar veriyi kabul eder (Hinted Handoff) ve asıl node geri döndüğünde veriyi teslim eder.

---

## 2. Replication Lag Anomalileri ve Çözümleri

Asenkron follower'lardan okuma yapıldığında, replikasyon gecikmesi (replication lag) nedeniyle istemciler tutarsızlıklarla karşılaşır:

```
+-------------------------------------------------------------------------------+
|                        REPLICATION LAG GUARANTEES                             |
+-------------------------------------------------------------------------------+
| Anomali / Garanti      | Belirti                              | Mimari Çözüm  |
|------------------------+--------------------------------------+---------------|
| Read-Your-Writes       | Kullanıcı profilini günceller, sayfayı| Kullanıcının  |
| (Read-After-Write)     | yeniler ama eski veriyi görür.       | güncellediği  |
|                        |                                      | alanları 1 dk |
|                        |                                      | liderden oku; |
|                        |                                      | client LSN    |
|                        |                                      | takibi yap.   |
|------------------------+--------------------------------------+---------------|
| Monotonic Reads        | Kullanıcı sayfayı yeniledikçe zaman  | Her kullanıcıyı|
|                        | geriye akar (hızlı follower'dan sonra| hash(user_id) |
|                        | lag'li follower'dan okuma).          | ile her zaman |
|                        |                                      | aynı follower'a|
|                        |                                      | yönlendir.    |
|------------------------+--------------------------------------+---------------|
| Consistent Prefix Reads| Sebep-sonuç ilişkili mesajlar ters   | Nedensel      |
| (Causal Ordering)      | sırada görünür (Örn. cevabın sorudan | ilişkili tüm  |
|                        | önce gelmesi).                       | partition'ları|
|                        |                                      | aynı fiziksel |
|                        |                                      | log'a yaz.    |
+-------------------------------------------------------------------------------+
```

---

## 3. Partitioning (Sharding) ve İkincil İndeksler

Veri hacmi tek bir makinenin disk ve I/O kapasitesini aştığında veri bağımsız parçalara (partitions) bölünür.

### 3.1 Bölümleme Stratejileri
- **Range-Based Partitioning:** Anahtarlar alfabetik veya zamansal aralıklara göre bölünür (örn. A-C, D-F). Range sorguları son derece hızlıdır, ancak belirli aralıklara yoğun yük binerse hot-spot oluşur (örn. bugünün tarihi).
- **Hash-Based Partitioning:** Anahtar bir hash fonksiyonundan (`MD5`, `Murmur3`) geçirilir ve modüler olarak dağıtılır. Hot-spot riskini azaltır ancak range sorgularını tüm partition'lara yaymak zorunda bırakır (scatter/gather).
- **Consistent Hashing:** Node ekleme/çıkarma anında taşınması gereken veri miktarını minimize eden sanal halka (ring) mimarisi.

### 3.2 İkincil İndeksler (Secondary Indexes)
- **Document-Partitioned (Local Index):** Her partition yalnızca kendi içindeki ikincil indeksleri saklar. Yazma çok hızlıdır, ancak okuma yaparken tüm partition'lara scatter-gather sorgusu gönderilmelidir (yüksek kuyruk gecikmesi / tail latency riski).
- **Term-Partitioned (Global Index):** İkincil indeksler taranan terime (term) göre küme genelinde ayrı bir partition'a yazılır. Okuma tek bir node'a gider ancak yazma işlemleri asenkron ve dağıtık koordinasyon gerektirir.

---

## 4. ACID vs. BASE ve Transaction Isolation Seviyeleri

```
       [ SQL-92 & Modern İzolasyon Hiyerarşisi ]
       
       Serializable (SSI, 2PL)           ◄─── En Güçlü (En Düşük Throughput)
              │
       Snapshot Isolation / Repeatable Read
              │
       Read Committed                    ◄─── Standart Veritabanı Varsayılanı
              │
       Read Uncommitted                  ◄─── En Zayıf (Dirty Read Riski)
```

### 4.1 İzolasyon Seviyeleri ve Yarış Koşulları (Race Conditions)
1. **Read Committed:**
   - *Dirty Read Engellenir:* Yalnızca commit edilmiş veriler okunur.
   - *Dirty Write Engellenir:* Bir satır yazılırken transaction row-level lock alır.
2. **Snapshot Isolation (MVCC - Multi-Version Concurrency Control):**
   - Her okuma işlemi, transaction'ın başladığı andaki veritabanı anlık görüntüsünü (snapshot) görür.
   - *Okuyucular yazarları engellemez, yazarlar okuyucuları engellemez.*
   - *Non-repeatable Read (Read Skew)* anomalisi tamamen ortadan kalkar.
3. **Write Skew ve Phantom Reads (Kritik Fenomen):**
   - İki eşzamanlı işlem aynı anda bir koşulu kontrol eder (Örn: "Nöbette en az 1 doktor kalmalıdır") ve ayrı satırları güncelleyerek koşulu ihlal eder.
   - Satır seviyesi kilitler (`SELECT FOR UPDATE`) yetersiz kalabilir çünkü aranılan kayıt henüz var olmayabilir (**Phantom Read**).
   - Çözüm: **Serializable Isolation** veya **Predicate Locking / Index-Range Locking**.

### 4.2 Serializable Isolation Uygulamaları
- **Strict Two-Phase Locking (2PL):** Yazarlar okuyucuları kilitler, okuyucular yazarları kilitler. Yüksek tail latency ve deadlock riski üretir.
- **Actual Serial Execution (Redis, VoltDB):** Tek çekirdekte in-memory olarak işlemleri sırayla işletme.
- **Serializable Snapshot Isolation (SSI):** İyimser (optimistic) eşzamanlılık kontrolü. İşlemler kesintiye uğramadan devam eder, commit anında çatışan bir yazma tespit edilirse abort edilerek yeniden denenir.

---

## 5. Consensus, Linearizability, CAP ve 2PC

### 5.1 Linearizability (Güçlü Tutarlılık)
Linearizability, sistemin dışarıdan bakıldığında sanki tek bir veri kopyası varmış gibi ve tüm operasyonların atomik olarak gerçekleştiği illüzyonudur. Bir istemci yeni bir değeri okuduğu andan itibaren, hiçbir istemci eski değeri okuyamaz.

### 5.2 CAP Teoremi Doğru Okunuşu
Gerçek dünyada ağ gecikmeleri ve paket kayıpları kaçınılmazdır (Network Partition - $P$). Bu nedenle CAP teoremi "Consistency vs. Availability under Partition" seçimidir:
- **CP (Consistency / Partition Tolerance):** Ağ bölündüğünde tutarsız veriyi engellemek için sistem yanıt vermez (hata döner).
- **AP (Availability / Partition Tolerance):** Ağ bölündüğünde her node elindeki son veriyle yanıt vermeye devam eder, ancak node'lar arası tutarsızlık oluşabilir.

### 5.3 Distributed Transactions: Two-Phase Commit (2PC)
Dağıtık node'lar arasında atomik commit sağlamanın geleneksel yoludur:
1. **Prepare Phase:** Koordinatör tüm katılımcılara "Commit etmeye hazır mısın?" der. Katılımcılar diske yazar ve "Evet" sözü verir.
2. **Commit Phase:** Herkes evet dediyse koordinatör "Commit" mesajı basar.
- *Blocking Zafiyeti:* Koordinatör 1. aşama sonrası çökerse tüm katılımcılar kilitli (in-doubt) kalır; dış müdahale olmadan işlem tamamlanamaz.

### 5.4 Modern Konsensüs: Raft ve Paxos
- 2PC'nin kilitlenme (blocking) zaafını çözer.
- Lider seçimi (Leader Election) ve replike log işletimi (Replicated State Machine) için çoğunluk ($N/2 + 1$) onayını şart koşar. Tek bir node çökse bile sistem kesintisiz konsensüse varmaya devam eder.
