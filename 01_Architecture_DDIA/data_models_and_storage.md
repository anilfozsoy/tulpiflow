# Data Models, Storage Engines & Retrieval (DDIA Module 01)

Bu doküman, Martin Kleppmann'ın *Designing Data-Intensive Applications (DDIA)* eserindeki depolama motorları (storage engines), veri modelleri (data models) ve veri alma (retrieval) mekanizmalarının derinlemesine mimari analizidir.

---

## 1. Veri Modelleri ve Access Pattern Analizi

Uygulama geliştirmenin temeli, karmaşık gerçek dünya problemlerini uygun bir veri modeli (data model) katmanında ifade etmektir. Bir veri modeli seçimi, uygulamanın destekleyeceği access pattern'leri (erişim kalıplarını) doğrudan belirler.

```
+-------------------------------------------------------------------------------+
|                             DATA MODEL LANDSCAPE                              |
+-------------------------------------------------------------------------------+
|  Model       | Primary Structure    | Best Access Pattern   | Anti-Pattern    |
|--------------+----------------------+-----------------------+-----------------|
| Relational   | Tables, Rows, Foreign| Structured joins, ACID| Deeply nested,  |
| (SQL)        | Keys, Schemas        | multi-row constraints | heterogeneous   |
|--------------+----------------------+-----------------------+-----------------|
| Document     | JSON/BSON/XML Trees, | One-to-many tree read,| Highly connected|
| (NoSQL)      | Schema-on-read       | localized aggregates  | many-to-many    |
|--------------+----------------------+-----------------------+-----------------|
| Graph        | Vertices, Edges,     | Recursive traversals, | Uniform flat    |
| (Graph DB)   | Properties, Labels   | variable-length paths | tabular scans   |
+-------------------------------------------------------------------------------+
```

### 1.1 Relational vs. Document Model (The Object-Relational Mismatch)
- **Impedance Mismatch:** Nesne yönelimli kod (domain objects) ile ilişkisel tablolar arasındaki çevrim maliyeti (ORM katmanları).
- **Many-to-One ve Many-to-Many İlişkiler:** Document modelleri hiyerarşik (1-to-many) ağaç yapılarında tek dokümanda toplama (locality) avantajı sağlarken, many-to-many ilişkilerde referans normalize edilmediğinde veri tekrarı (denormalization) veya uygulama seviyesinde birden fazla network round-trip ile join simülasyonu gerektirir.
- **Schema-on-read vs. Schema-on-write:**
  - *Document (Schema-on-read):* Veri formatı dinamiktir, runtime sırasında okunurken parse edilir. Veri yapısı sürekli değişen heterojen sistemlerde esneklik sağlar.
  - *Relational (Schema-on-write):* Şema compile/load anında garanti altındadır; veri bütünlüğü (referential integrity) ve tip güvenliği motor seviyesinde zorunlu kılınır.

### 1.2 Graph Modelleri (Property Graph & Triple-Store)
Many-to-many ilişkilerin veri setinin ana omurgasını oluşturduğu durumlarda (sosyal ağlar, bilgi grafikleri, dolandırıcılık tespiti) ilişkisel join'ler eksponansiyel maliyet üretir (`JOIN` tablolarının kartezyen çarpımları).
- **Property Graph:** Her vertex (düğüm) ve edge (kenar) key-value çiftleri taşır. Kenarlar yönlüdür (directed) ve doğrudan bellek işaretçisi (index-free adjacency) veya lokal hash ile O(1) travers edilir.
- **Cypher ve SPARQL:** Bildirimsel (declarative) sorgu dilleri ile karmaşık yol arama algoritmaları (shortest path, connected components) tek sorguda işletilir.

---

## 2. Storage Engines: LSM-Trees vs. B-Trees

Veritabanı depolama motorları iki ana felsefeye ayrılır: **Append-only Log-Structured** sistemler ve **Update-in-place Page-oriented** sistemler.

```
       [ LSM-Tree Architecture ]                           [ B-Tree Architecture ]
       
   Writes (In-memory buffer)                        Writes (In-place update)
               │                                                │
               ▼                                                ▼
     ┌──────────────────┐                            ┌─────────────────────┐
     │  Memtable (RAM)  │ (SkipList/Red-Black)       │  Root Page (4KB/8KB)│
     └─────────┬────────┘                            └───┬─────────────┬───┘
               │ Flush                                   │             │
               ▼                                         ▼             ▼
     ┌──────────────────┐                            ┌───────┐     ┌───────┐
     │ SSTable Level 0  │ (Disk, Sorted)             │ Page  │     │ Page  │
     └─────────┬────────┘                            └───┬───┘     └───┬───┘
               │ Compaction                              ▼             ▼
               ▼                                     [ Leaf Page ] [ Leaf Page ]
     ┌──────────────────┐                              (Disk In-place overwrite)
     │ SSTable Level 1  │ (No overlapping keys)
     └──────────────────┘
```

### 2.1 B-Trees (Update-in-Place)
- Geleneksel ilişkisel veritabanlarının (PostgreSQL, MySQL InnoDB, Oracle) varsayılan motorudur.
- Veriyi diskte sabit boyutlu bloklar (sayfalar / pages, genelde 4KB - 8KB) halinde organize eder.
- Güncellemeler ve silmeler doğrudan o sayfa üzerine yazılır (update-in-place). Sayfa dolduğunda ikiye bölünür (page split).
- **Güvenilirlik:** Diske sayfa yazılırken elektrik kesintisi gibi donanım çökmelerine karşı atomikliği sağlamak için her yazma önce diskteki **Write-Ahead Log (WAL)** dosyasına sıralı olarak eklenir.

### 2.2 LSM-Trees (Log-Structured Merge-Trees)
- Modern dağıtık ve yüksek yazma verimliliği gerektiren NoSQL sistemlerinde (RocksDB, Apache Cassandra, ScyllaDB, Bigtable) kullanılır.
- Disk erişimlerinde **sıralı yazma (sequential write)**, **rastgele yazmaya (random write)** göre HDD'lerde 100-1000 kat, modern NVMe SSD'lerde ise kanal paralelliği ve wear-leveling optimizasyonu sayesinde 5-10 kat daha hızlıdır.
- LSM-Tree gelen tüm yazmaları sıralı olarak bir append-only log'a (WAL) yazar ve RAM'deki sıralı bir veri yapısında (Memtable) tutar.

### 2.3 Amplification Metrikleri Karşılaştırma Matrisi

```
+-------------------------------------------------------------------------------+
|                    AMPLIFICATION COMPARISON: LSM VS B-TREE                    |
+-------------------------------------------------------------------------------+
| Metric             | LSM-Tree                       | B-Tree                  |
|--------------------+--------------------------------+-------------------------|
| Write Amplification| Düşük / Orta (Sıralı burst,     | Yüksek (Tek bir byte    |
|                    | periyodik compaction)          | değişimi tüm 8KB sayfayı|
|                    | SSD ömrünü ve bant genişliğini | tekrar diske yazdırır;  |
|                    | korur.                         | WAL + sayfa = çift yazma)|
|--------------------+--------------------------------+-------------------------|
| Read Amplification | Yüksek (Key bulunana kadar     | Düşük (Kökten yaprağa   |
|                    | Memtable ve birden fazla       | O(log N) sabit sayfa    |
|                    | SSTable taranabilir; Bloom     | erişimi; tekil okumada  |
|                    | Filter ile hafifletilir).      | deterministik gecikme). |
|--------------------+--------------------------------+-------------------------|
| Space Amplification| Düşük (Compaction sırasında    | Yüksek (Fragmentation ve|
|                    | eski sürümler silinir, veri    | sayfa bölünmeleri       |
|                    | blokları sıkıştırılır / LZ4).  | nedeniyle sayfaların    |
|                    |                                | ortalama %30-40'ı boş). |
+-------------------------------------------------------------------------------+
```

---

## 3. SSTables, Memtable ve Compaction Yaşam Döngüsü

### 3.1 Yaşam Döngüsü Adımları
1. **Write-Ahead Log (WAL):** Yazma isteği geldiğinde ilk olarak diskteki append-only WAL dosyasına yazılır (Crash Recovery garantisi).
2. **Memtable:** Veri eşzamanlı olarak RAM'deki bir `SkipList` veya `Red-Black Tree` veri yapısına eklenir. Burada veriler her zaman `Key` sırasına göre sıralı tutulur.
3. **Flush (SSTable Oluşumu):** Memtable belirlenen eşik değere (örn. 32MB - 64MB) ulaştığında dondurulur (immutable) ve disk üzerine sıralı bir dosya olarak (**Sorted String Table - SSTable**) dökülür. Yeni gelen yazmalar yeni bir aktif Memtable'a yönlendirilir.
4. **Sparse Index & Bloom Filter:** Her SSTable dosyasının yanında, RAM'de tutulan seyrek bir indeks (sparse index) ve bir **Bloom Filter** üretilir.

```
       [ SSTable Dosya Anatomisi ]
       ┌────────────────────────────────────────────────────────┐
       │ Data Block 0: [ ("anahtar_a", v1), ("anahtar_b", v2) ] │
       │ Data Block 1: [ ("anahtar_g", v3), ("anahtar_k", v4) ] │
       │ Data Block 2: [ ("anahtar_m", v5), ("anahtar_z", v6) ] │
       ├────────────────────────────────────────────────────────┤
       │ Sparse Index:  "anahtar_a" -> Off: 0, "anahtar_g" -> ..│
       ├────────────────────────────────────────────────────────┤
       │ Bloom Filter:  [0, 1, 0, 0, 1, 1, 0, 1, ...]           │
       └────────────────────────────────────────────────────────┘
```

### 3.2 Bloom Filter Rolü
Bir anahtar sistemde yoksa, diski taramamak için olasılıksal bir veri yapısı olan **Bloom Filter** kullanılır.
- Sonuç "Kesinlikle Yok" ise disk I/O yapılmaz (Read Amplification engellenir).
- Sonuç "Olabilir" ise SSTable sparse index taranır. False positive oranı bit array boyutu ve hash fonksiyonu sayısıyla %1'in altına ayarlanır.

### 3.3 Compaction Stratejileri
Diskte biriken birden çok SSTable zamanla birleştirilmeli ve silinmiş (tombstone) veya güncellenmiş eski veriler temizlenmelidir:
- **Size-Tiered Compaction (Cassandra varsayılanı):** Benzer boyuttaki küçük SSTable'lar birleştirilerek daha büyük SSTable'lar oluşturulur. Yüksek yazma hızına uygundur fakat disk alanı geçici olarak iki katına çıkabilir.
- **Leveled Compaction (RocksDB / LevelDB standardı):** Veriler seviyelere (Level 0, Level 1, Level 2...) bölünür. Her seviye bir öncekinin 10 katı boyuttadır. Level 1 ve üzerinde anahtar aralıkları kesinlikle örtüşmez (non-overlapping). Bu, okuma performansını maksimize eder ve disk kullanımını en aza indirir.
