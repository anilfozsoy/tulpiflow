/* ==========================================================================
   TULPIFLOW COMPREHENSIVE YKS (TYT & AYT) CURRICULUM WITH YOUTUBE ENGINES
   Curated for Fadime's 2026 Degree Preparation
   ========================================================================== */

const YKS_CURRICULUM = [
  // --- TYT MATEMATİK ---
  {
    id: 'top-tyt-mat-1',
    category: 'tyt-matematik',
    categoryLabel: 'TYT Matematik',
    title: 'Temel Kavramlar & Sayı Basamakları',
    teachers: [
      { name: 'Eyüp B.', query: 'Eyüp B Temel Kavramlar TYT Matematik' },
      { name: 'Mert Hoca', query: 'Mert Hoca Temel Kavramlar Kampı TYT' },
      { name: 'Rehber Matematik', query: 'Rehber Matematik Temel Kavramlar TYT' }
    ],
    subtopics: [
      { id: 'tyt-mat-1-1', title: 'Sayı Kümeleri, Tek-Çift ve Pozitif-Negatif Sayılar', completed: true },
      { id: 'tyt-mat-1-2', title: 'Ardışık Sayılar ve Sonlu Toplam Formülleri', completed: true },
      { id: 'tyt-mat-1-3', title: 'Asal Sayılar, Aralarında Asal Sayılar ve Faktöriyel', completed: true },
      { id: 'tyt-mat-1-4', title: 'Basamak Analizi ve Çözümleme', completed: true }
    ]
  },
  {
    id: 'top-tyt-mat-2',
    category: 'tyt-matematik',
    categoryLabel: 'TYT Matematik',
    title: 'Bölme, Bölünebilme & EBOB-EKOK',
    teachers: [
      { name: 'Eyüp B.', query: 'Eyüp B Bölme Bölünebilme EBOB EKOK' },
      { name: 'Mert Hoca', query: 'Mert Hoca Bölünebilme EBOB EKOK TYT' }
    ],
    subtopics: [
      { id: 'tyt-mat-2-1', title: 'Bölme Algoritması ve Kalan Bulma Kuralları', completed: true },
      { id: 'tyt-mat-2-2', title: 'Özel Bölünebilme Kuralları (2, 3, 4, 5, 8, 9, 11)', completed: true },
      { id: 'tyt-mat-2-3', title: 'EBOB-EKOK Özellikleri ve Periyodik Problem Tipleri', completed: false }
    ]
  },
  {
    id: 'top-tyt-mat-3',
    category: 'tyt-matematik',
    categoryLabel: 'TYT Matematik',
    title: 'Rasyonel Sayılar, Eşitsizlik & Mutlak Değer',
    teachers: [
      { name: 'Eyüp B.', query: 'Eyüp B Basit Eşitsizlikler Mutlak Değer' },
      { name: 'Mert Hoca', query: 'Mert Hoca Mutlak Değer TYT' }
    ],
    subtopics: [
      { id: 'tyt-mat-3-1', title: 'Rasyonel ve Ondalık Sayılarda Dört İşlem', completed: true },
      { id: 'tyt-mat-3-2', title: 'Basit Eşitsizlikler ve Aralık Kavramı', completed: true },
      { id: 'tyt-mat-3-3', title: 'Mutlak Değer Tanımı, Özellikleri ve Denklemleri', completed: true },
      { id: 'tyt-mat-3-4', title: 'Mutlak Değerli Eşitsizlikler ve Geometrik Yorum', completed: false }
    ]
  },
  {
    id: 'top-tyt-mat-4',
    category: 'tyt-matematik',
    categoryLabel: 'TYT Matematik',
    title: 'Üslü & Köklü İfadeler',
    teachers: [
      { name: 'Eyüp B.', query: 'Eyüp B Üslü Köklü Sayılar TYT' },
      { name: 'Rehber Matematik', query: 'Rehber Matematik Üslü Köklü Sayılar' }
    ],
    subtopics: [
      { id: 'tyt-mat-4-1', title: 'Üslü Sayı Özellikleri ve Üslü Denklemler', completed: true },
      { id: 'tyt-mat-4-2', title: 'Köklü Sayılarda Derece Eşitleme ve Dört İşlem', completed: true },
      { id: 'tyt-mat-4-3', title: 'Paydayı Rasyonel Yapma (Eşlenik) ve İç İçe Kökler', completed: false }
    ]
  },
  {
    id: 'top-tyt-mat-5',
    category: 'tyt-matematik',
    categoryLabel: 'TYT Matematik',
    title: 'Çarpanlara Ayırma & Özdeşlikler',
    teachers: [
      { name: 'Eyüp B.', query: 'Eyüp B Çarpanlara Ayırma' },
      { name: 'Mert Hoca', query: 'Mert Hoca Çarpanlara Ayırma TYT AYT' }
    ],
    subtopics: [
      { id: 'tyt-mat-5-1', title: 'Ortak Çarpan Parantezi ve Gruplandırma', completed: true },
      { id: 'tyt-mat-5-2', title: 'İki Kare Farkı ve Tam Kare Özdeşlikleri', completed: true },
      { id: 'tyt-mat-5-3', title: 'Küp Açılımları ve Sadeleştirme Teknikleri', completed: false }
    ]
  },
  {
    id: 'top-tyt-mat-6',
    category: 'tyt-matematik',
    categoryLabel: 'TYT Matematik',
    title: 'TYT Problemler Master Serisi',
    teachers: [
      { name: 'Eyüp B.', query: 'Eyüp B Birebir ÖSYM Problemler' },
      { name: 'Mert Hoca', query: 'Mert Hoca Problemler Kampı' },
      { name: 'Rehber Matematik', query: 'Rehber Matematik 321 Problemler' }
    ],
    subtopics: [
      { id: 'tyt-mat-6-1', title: 'Oran-Orantı ve Aritmetik/Geometrik Ortalama', completed: true },
      { id: 'tyt-mat-6-2', title: 'Sayı, Kesir ve Yaş Problemleri', completed: true },
      { id: 'tyt-mat-6-3', title: 'Yüzde, Kâr-Zarar ve Karışım Problemleri', completed: false },
      { id: 'tyt-mat-6-4', title: 'Hız-Hareket ve İşçi Problemleri', completed: false },
      { id: 'tyt-mat-6-5', title: 'Grafik ve Tablo Yorumlama Problemleri', completed: false }
    ]
  },
  {
    id: 'top-tyt-mat-7',
    category: 'tyt-matematik',
    categoryLabel: 'TYT Matematik',
    title: 'Kümeler, Mantık & Fonksiyonlar (TYT Temeli)',
    teachers: [
      { name: 'Eyüp B.', query: 'Eyüp B Fonksiyonlar Kampı' },
      { name: 'Mert Hoca', query: 'Mert Hoca Fonksiyonlar TYT AYT' }
    ],
    subtopics: [
      { id: 'tyt-mat-7-1', title: 'Kümelerde İşlemler ve Kartezyen Çarpım', completed: true },
      { id: 'tyt-mat-7-2', title: 'Önermeler, Doğruluk Değerleri ve Mantık Bağlaçları', completed: true },
      { id: 'tyt-mat-7-3', title: 'Fonksiyon Tanımı, Değer Bulma ve Dikey Doğru Testi', completed: true },
      { id: 'tyt-mat-7-4', title: 'Birebir, Örten ve Birim Fonksiyon Çeşitleri', completed: false }
    ]
  },
  {
    id: 'top-tyt-mat-8',
    category: 'tyt-matematik',
    categoryLabel: 'TYT Matematik',
    title: 'Sayma, Permütasyon, Kombinasyon & Olasılık',
    teachers: [
      { name: 'Eyüp B.', query: 'Eyüp B PKBO Sayma Olasılık' },
      { name: 'Mert Hoca', query: 'Mert Hoca PKBO Kampı' }
    ],
    subtopics: [
      { id: 'tyt-mat-8-1', title: 'Toplama ve Çarpma Yoluyla Sayma, Faktöriyel', completed: false },
      { id: 'tyt-mat-8-2', title: 'Permütasyon (Sıralama) ve Tekrarlı Permütasyon', completed: false },
      { id: 'tyt-mat-8-3', title: 'Kombinasyon (Seçme) ve Binom Açılımı', completed: false },
      { id: 'tyt-mat-8-4', title: 'Teorik ve Deneysel Olasılık, Koşullu Olasılık', completed: false }
    ]
  },

  // --- AYT MATEMATİK ---
  {
    id: 'top-ayt-mat-1',
    category: 'ayt-matematik',
    categoryLabel: 'AYT Matematik',
    title: 'Polinomlar & 2. Dereceden Denklemler',
    teachers: [
      { name: 'Eyüp B.', query: 'Eyüp B Polinomlar İkinci Dereceden Denklemler' },
      { name: 'Mert Hoca', query: 'Mert Hoca Polinomlar Kampı AYT' }
    ],
    subtopics: [
      { id: 'ayt-mat-1-1', title: 'Polinom Tanımı, Sabit Terim ve Katsayılar Toplamı', completed: true },
      { id: 'ayt-mat-1-2', title: 'Polinomlarda Kalan Bulma (Bölme Yapmadan)', completed: true },
      { id: 'ayt-mat-1-3', title: 'Diskriminant (Delta), Kök-Katsayı Bağıntıları', completed: true },
      { id: 'ayt-mat-1-4', title: 'Kökleri Verilen Denklemi Kurma', completed: false }
    ]
  },
  {
    id: 'top-ayt-mat-2',
    category: 'ayt-matematik',
    categoryLabel: 'AYT Matematik',
    title: 'Parabol & 2. Dereceden Eşitsizlikler',
    teachers: [
      { name: 'Eyüp B.', query: 'Eyüp B Parabol Eşitsizlikler' },
      { name: 'Mert Hoca', query: 'Mert Hoca Parabol Kampı AYT' }
    ],
    subtopics: [
      { id: 'ayt-mat-2-1', title: 'Tepe Noktası T(r,k), Simetri Ekseni ve Grafiği Çizme', completed: true },
      { id: 'ayt-mat-2-2', title: 'Parabol ile Doğrunun Durumları ve Kesişimler', completed: true },
      { id: 'ayt-mat-2-3', title: 'İşaret Tablosu, Tek/Çift Katlı Kökler ve Eşitsizlik Sistemleri', completed: false }
    ]
  },
  {
    id: 'top-ayt-mat-3',
    category: 'ayt-matematik',
    categoryLabel: 'AYT Matematik',
    title: 'Trigonometri I & II (Master Modül)',
    teachers: [
      { name: 'Eyüp B.', query: 'Eyüp B Trigonometri Kampı AYT' },
      { name: 'Mert Hoca', query: 'Mert Hoca Trigonometri AYT' }
    ],
    subtopics: [
      { id: 'ayt-mat-3-1', title: 'Birim Çember, Esas Ölçü ve Temel Oranlar', completed: true },
      { id: 'ayt-mat-3-2', title: 'İndirgeme Formülleri ve Sıralama Kuralları', completed: true },
      { id: 'ayt-mat-3-3', title: 'Sinüs ve Kosinüs Teoremleri', completed: true },
      { id: 'ayt-mat-3-4', title: 'Toplam-Fark Formülleri ve Yarım Açı Teoremleri', completed: false },
      { id: 'ayt-mat-3-5', title: 'Trigonometrik Denklemler ve Kök Bulma', completed: false }
    ]
  },
  {
    id: 'top-ayt-mat-4',
    category: 'ayt-matematik',
    categoryLabel: 'AYT Matematik',
    title: 'Logaritma & Diziler',
    teachers: [
      { name: 'Eyüp B.', query: 'Eyüp B Logaritma Diziler AYT' },
      { name: 'Mert Hoca', query: 'Mert Hoca Logaritma Diziler' }
    ],
    subtopics: [
      { id: 'ayt-mat-4-1', title: 'Üstel Fonksiyon ve Logaritma Tanım Kümesi', completed: true },
      { id: 'ayt-mat-4-2', title: 'Logaritma Özellikleri ve Taban Değiştirme Kuralı', completed: true },
      { id: 'ayt-mat-4-3', title: 'Aritmetik Dizi: Genel Terim ve İlk n Terim Toplamı', completed: true },
      { id: 'ayt-mat-4-4', title: 'Geometrik Dizi: Ortak Çarpan ve Sonsuz Toplam Mantığı', completed: false }
    ]
  },
  {
    id: 'top-ayt-mat-5',
    category: 'ayt-matematik',
    categoryLabel: 'AYT Matematik',
    title: 'Limit ve Süreklilik',
    teachers: [
      { name: 'Eyüp B.', query: 'Eyüp B Limit Süreklilik AYT' },
      { name: 'Mert Hoca', query: 'Mert Hoca Limit Süreklilik' }
    ],
    subtopics: [
      { id: 'ayt-mat-5-1', title: 'Yaklaşım Kavramı, Sağdan-Soldan Limit ve Varlık Şartı', completed: true },
      { id: 'ayt-mat-5-2', title: '0/0 Belirsizliği ve Sadeleştirme/Çarpanlara Ayırma', completed: true },
      { id: 'ayt-mat-5-3', title: 'Süreklilik Tanımı ve Süreksiz Olunan Noktalar', completed: false }
    ]
  },
  {
    id: 'top-ayt-mat-6',
    category: 'ayt-matematik',
    categoryLabel: 'AYT Matematik',
    title: 'Türev ve Uygulamaları (Kritik Modül)',
    teachers: [
      { name: 'Eyüp B.', query: 'Eyüp B Türev Kampı Birebir ÖSYM' },
      { name: 'Mert Hoca', query: 'Mert Hoca Türev AYT' }
    ],
    subtopics: [
      { id: 'ayt-mat-6-1', title: 'Türev Tanımı (Anlık Değişim Oranı) ve Limit Bağıntısı', completed: true },
      { id: 'ayt-mat-6-2', title: 'Türev Alma Kuralları ve Bileşke Fonksiyon Türevi (Zincir Kuralı)', completed: true },
      { id: 'ayt-mat-6-3', title: 'Türevin Geometrik Yorumu ve Teğet/Normal Denklemi', completed: true },
      { id: 'ayt-mat-6-4', title: 'Artan-Azalan Aralıklar ve Ekstremum (Yerel Max-Min) Noktaları', completed: false },
      { id: 'ayt-mat-6-5', title: 'Maksimum - Minimum Problemleri Modelleme', completed: false }
    ]
  },
  {
    id: 'top-ayt-mat-7',
    category: 'ayt-matematik',
    categoryLabel: 'AYT Matematik',
    title: 'İntegral ve Alan Hesabı',
    teachers: [
      { name: 'Eyüp B.', query: 'Eyüp B İntegral Kampı AYT' },
      { name: 'Mert Hoca', query: 'Mert Hoca İntegral AYT' }
    ],
    subtopics: [
      { id: 'ayt-mat-7-1', title: 'Belirsiz İntegral ve Temel İntegral Alma Kuralları', completed: false },
      { id: 'ayt-mat-7-2', title: 'Değişken Değiştirme Yöntemi (u Dönüşümü)', completed: false },
      { id: 'ayt-mat-7-3', title: 'Belirli İntegral ve Riemann Toplamı Mantığı', completed: false },
      { id: 'ayt-mat-7-4', title: 'İntegral ile Eğri Altında Kalan Alan ve İki Eğri Arası Alan', completed: false }
    ]
  },

  // --- GEOMETRİ ---
  {
    id: 'top-geo-1',
    category: 'geometri',
    categoryLabel: 'Geometri',
    title: 'Üçgenler & Benzerlik (Temel Omurga)',
    teachers: [
      { name: 'Kenan Kara ile Geometri', query: 'Kenan Kara Geometri Üçgenler Kampı' },
      { name: 'Eyüp B.', query: 'Eyüp B Geometri Üçgenler' }
    ],
    subtopics: [
      { id: 'geo-1-1', title: 'Doğruda ve Üçgende Açılar, Açı Bağıntıları', completed: true },
      { id: 'geo-1-2', title: 'Özel Dik Üçgenler (3-4-5, 5-12-13, 30-60-90, Öklid Bağıntıları)', completed: true },
      { id: 'geo-1-3', title: 'İkizkenar ve Eşkenar Üçgen Özellikleri', completed: true },
      { id: 'geo-1-4', title: 'Açıortay, Kenarortay ve Ağırlık Merkezi Bağıntıları', completed: false },
      { id: 'geo-1-5', title: 'Üçgende Benzerlik (A.A., K.A.K., Thales Teoremi)', completed: false },
      { id: 'geo-1-6', title: 'Üçgende Alan ve Alan Paylaştırma Teknikleri', completed: false }
    ]
  },
  {
    id: 'top-geo-2',
    category: 'geometri',
    categoryLabel: 'Geometri',
    title: 'Çokgenler & Dörtgenler',
    teachers: [
      { name: 'Kenan Kara ile Geometri', query: 'Kenan Kara Çokgenler Dörtgenler' },
      { name: 'Mert Hoca', query: 'Mert Hoca Geometri Dörtgenler' }
    ],
    subtopics: [
      { id: 'geo-2-1', title: 'Düzgün Çokgenler ve Açılar', completed: true },
      { id: 'geo-2-2', title: 'Paralelkenar, Eşkenar Dörtgen ve Deltoid', completed: false },
      { id: 'geo-2-3', title: 'Dikdörtgen ve Kare Alan/Köşegen Özellikleri', completed: false },
      { id: 'geo-2-4', title: 'Yamuk ve İkizkenar/Dik Yamuk Kuralları', completed: false }
    ]
  },
  {
    id: 'top-geo-3',
    category: 'geometri',
    categoryLabel: 'Geometri',
    title: 'Çember & Daire',
    teachers: [
      { name: 'Kenan Kara ile Geometri', query: 'Kenan Kara Çemberde Açı Uzunluk Dairede Alan' },
      { name: 'Eyüp B.', query: 'Eyüp B Çember ve Daire' }
    ],
    subtopics: [
      { id: 'geo-3-1', title: 'Çemberde Açılar (Merkez, Çevre, Teğet-Kiriş, İç-Dış Açı)', completed: true },
      { id: 'geo-3-2', title: 'Çemberde Teğet Özellikleri ve Kiriş Bağıntıları', completed: false },
      { id: 'geo-3-3', title: 'Dairenin Çevresi ve Daire Diliminin Alanı', completed: false }
    ]
  },
  {
    id: 'top-geo-4',
    category: 'geometri',
    categoryLabel: 'Geometri',
    title: 'Analitik Geometri & Çemberin Analitiği',
    teachers: [
      { name: 'Kenan Kara ile Geometri', query: 'Kenan Kara Noktanın Doğrunun Analitiği' },
      { name: 'Eyüp B.', query: 'Eyüp B Analitik Geometri' }
    ],
    subtopics: [
      { id: 'geo-4-1', title: 'Noktanın Analitiği: Orta Nokta, Uzaklık Formülü', completed: true },
      { id: 'geo-4-2', title: 'Doğrunun Eğimi, Denklem Yazma ve İki Doğrunun Durumu', completed: true },
      { id: 'geo-4-3', title: 'Noktanın Doğruya Uzaklığı ve Paralel Doğrular Arası Mesafe', completed: false },
      { id: 'geo-4-4', title: 'Çemberin Standart ve Genel Denklemi (AYT)', completed: false }
    ]
  },

  // --- FİZİK (TYT & AYT) ---
  {
    id: 'top-fizik-1',
    category: 'fizik',
    categoryLabel: 'Fizik (TYT-AYT)',
    title: 'Madde, Hareket, Kuvvet & Enerji (TYT)',
    teachers: [
      { name: 'VIP Fizik', query: 'VIP Fizik TYT Kampı Hareket Kuvvet Enerji' },
      { name: 'Altuğ Güneş', query: 'Altuğ Güneş Hareket Kuvvet TYT' },
      { name: 'Fizikfındık', query: 'Fizikfındık Barışcan Hareket Kuvvet' }
    ],
    subtopics: [
      { id: 'fiz-1-1', title: 'Fizik Bilimine Giriş, Büyüklükler ve Madde Özellikleri', completed: true },
      { id: 'fiz-1-2', title: 'Doğrusal Hareket: Konum, Hız, İvme Grafikleri', completed: true },
      { id: 'fiz-1-3', title: 'Newton Hareket Yasaları ve Sürtünme Kuvveti', completed: true },
      { id: 'fiz-1-4', title: 'İş, Güç, Mekanik Enerji Korunumu ve Verim', completed: false }
    ]
  },
  {
    id: 'top-fizik-2',
    category: 'fizik',
    categoryLabel: 'Fizik (TYT-AYT)',
    title: 'Elektrostatik, Elektrik Akımı & Optik',
    teachers: [
      { name: 'VIP Fizik', query: 'VIP Fizik Elektrik Devreleri Optik Kampı' },
      { name: 'Altuğ Güneş', query: 'Altuğ Güneş Optik Elektrik TYT' }
    ],
    subtopics: [
      { id: 'fiz-2-1', title: 'Elektrostatik: Yüklenme Çeşitleri ve Coulomb Kuvveti', completed: true },
      { id: 'fiz-2-2', title: 'Ohm Yasası, Seri-Paralel Bağlama ve Devre Analizi', completed: true },
      { id: 'fiz-2-3', title: 'Aydınlanma, Düzlem ve Küresel Aynalar', completed: false },
      { id: 'fiz-2-4', title: 'Işığın Kırılması, Tam Yansıma ve Mercekler', completed: false }
    ]
  },
  {
    id: 'top-fizik-3',
    category: 'fizik',
    categoryLabel: 'Fizik (TYT-AYT)',
    title: 'İtme-Momentum, Tork & Denge (AYT)',
    teachers: [
      { name: 'VIP Fizik', query: 'VIP Fizik AYT Mekanik İtme Momentum Tork' },
      { name: 'Altuğ Güneş', query: 'Altuğ Güneş AYT Mekanik Kampı' }
    ],
    subtopics: [
      { id: 'fiz-3-1', title: 'Vektörler, Bağıl Hareket ve Nehir Problemleri', completed: true },
      { id: 'fiz-3-2', title: 'İtme ve Çizgisel Momentum Korunumu (Çarpışmalar)', completed: false },
      { id: 'fiz-3-3', title: 'Tork, Denge Şartları ve Ağırlık Merkezi', completed: false },
      { id: 'fiz-3-4', title: 'Basit Makineler: Kaldıraç, Makara, Eğik Düzlem', completed: false }
    ]
  },
  {
    id: 'top-fizik-4',
    category: 'fizik',
    categoryLabel: 'Fizik (TYT-AYT)',
    title: 'Manyetizma, İndüksiyon & Alternatif Akım (AYT)',
    teachers: [
      { name: 'VIP Fizik', query: 'VIP Fizik Manyetizma İndüksiyon AYT' },
      { name: 'Altuğ Güneş', query: 'Altuğ Güneş Manyetizma Alternatif Akım' }
    ],
    subtopics: [
      { id: 'fiz-4-1', title: 'Manyetik Alan ve Akım Taşıyan Tele Etkiyen Manyetik Kuvvet', completed: false },
      { id: 'fiz-4-2', title: 'Manyetik Akı, Faraday ve Lenz İndüksiyon Kanunları', completed: false },
      { id: 'fiz-4-3', title: 'Alternatif Akım, RLC Devreleri ve Transformatörler', completed: false }
    ]
  },

  // --- KİMYA (TYT & AYT) ---
  {
    id: 'top-kimya-1',
    category: 'kimya',
    categoryLabel: 'Kimya (TYT-AYT)',
    title: 'Atom, Periyodik Sistem & Türler Arası Etkileşim (TYT)',
    teachers: [
      { name: 'Görkem Şahin', query: 'Görkem Şahin Benim Hocam Kimya TYT Kampı' },
      { name: 'Kimya Adası', query: 'Kimya Adası Atom Periyodik Sistem TYT' }
    ],
    subtopics: [
      { id: 'kim-1-1', title: 'Kimya Bilimi, Güvenlik İşaretleri ve Simyadan Kimyaya', completed: true },
      { id: 'kim-1-2', title: 'Atom Modelleri, İzotop Kavramı ve Periyodik Özelliklerin Değişimi', completed: true },
      { id: 'kim-1-3', title: 'Güçlü Etkileşimler: İyonik, Kovalent ve Metalik Bağ', completed: true },
      { id: 'kim-1-4', title: 'Zayıf Etkileşimler: Hidrojen Bağı ve Van der Waals Kuvvetleri', completed: false }
    ]
  },
  {
    id: 'top-kimya-2',
    category: 'kimya',
    categoryLabel: 'Kimya (TYT-AYT)',
    title: 'Mol Kavramı, Kimyasal Hesaplamalar & Karışımlar',
    teachers: [
      { name: 'Görkem Şahin', query: 'Görkem Şahin Mol Kavramı Hesaplamalar TYT' },
      { name: 'Kimya Adası', query: 'Kimya Adası Mol Kavramı Çözeltiler' }
    ],
    subtopics: [
      { id: 'kim-2-1', title: 'Avogadro Sayısı, Mol Kütlesi ve Gaz Hacmi Bağıntıları', completed: true },
      { id: 'kim-2-2', title: 'Sınırlayıcı Bileşen, Verim ve Safsızlık Problemleri', completed: false },
      { id: 'kim-2-3', title: 'Homojen/Heterojen Karışımlar ve Ayırma Teknikleri', completed: false },
      { id: 'kim-2-4', title: 'Asitler, Bazlar, Tuzlar ve Nötralleşme Tepkimeleri', completed: false }
    ]
  },
  {
    id: 'top-kimya-3',
    category: 'kimya',
    categoryLabel: 'Kimya (TYT-AYT)',
    title: 'Kimyasal Tepkimelerde Enerji, Hız & Denge (AYT)',
    teachers: [
      { name: 'Görkem Şahin', query: 'Görkem Şahin AYT Kimya Enerji Hız Denge Kampı' },
      { name: 'Kimya Adası', query: 'Kimya Adası Kimyasal Denge AYT' }
    ],
    subtopics: [
      { id: 'kim-3-1', title: 'Standart Oluşum Entalpisi ve Hess Yasası', completed: false },
      { id: 'kim-3-2', title: 'Tepkime Hızını Etkileyen Faktörler ve Mekanizmalı Tepkimeler', completed: false },
      { id: 'kim-3-3', title: 'Kimyasal Denge, Kc/Kp Bağıntıları ve Le Chatelier İlkesi', completed: false },
      { id: 'kim-3-4', title: 'Asit-Baz Dengesi (pH, pOH, Tampon Çözeltiler, Kçc Çözünürlük)', completed: false }
    ]
  },
  {
    id: 'top-kimya-4',
    category: 'kimya',
    categoryLabel: 'Kimya (TYT-AYT)',
    title: 'Organik Kimyaya Giriş & Organik Bileşikler (AYT)',
    teachers: [
      { name: 'Görkem Şahin', query: 'Görkem Şahin Organik Kimya Kampı Benim Hocam' },
      { name: 'Kimya Adası', query: 'Kimya Adası Organik Kimya Full Tekrar' }
    ],
    subtopics: [
      { id: 'kim-4-1', title: 'Karbon Allotropları, Lewis Formülü ve VSEPR Gösterimi', completed: false },
      { id: 'kim-4-2', title: 'Hibritleşme Türleri (sp3, sp2, sp) ve Molekül Geometrisi', completed: false },
      { id: 'kim-4-3', title: 'Hidrokarbonlar: Alkan, Alken, Alkin Adlandırma ve Reaksiyonları', completed: false },
      { id: 'kim-4-4', title: 'Fonksiyonel Gruplar: Alkol, Eter, Aldehit, Keton, Karboksilik Asit', completed: false }
    ]
  },

  // --- BİYOLOJİ (TYT & AYT) ---
  {
    id: 'top-biyoloji-1',
    category: 'biyoloji',
    categoryLabel: 'Biyoloji (TYT-AYT)',
    title: 'Hücre, Organeller & Canlıların Temel Bileşenleri (TYT)',
    teachers: [
      { name: 'Dr. Biyoloji', query: 'Dr Biyoloji TYT Kampı Hücre Organeller' },
      { name: 'Biosem', query: 'Biosem Biyoloji TYT Kampı Hücre' },
      { name: 'Selin Hoca', query: 'Selin Hoca Hücre ve Organeller TYT' }
    ],
    subtopics: [
      { id: 'biy-1-1', title: 'Karbonhidratlar, Yağlar, Proteinler ve Enzimler', completed: true },
      { id: 'biy-1-2', title: 'Prokaryot-Ökaryot Hücre Yapısı ve Organel Fonksiyonları', completed: true },
      { id: 'biy-1-3', title: 'Hücre Zarından Madde Geçişleri (Difüzyon, Osmoz, Aktif Taşıma)', completed: false }
    ]
  },
  {
    id: 'top-biyoloji-2',
    category: 'biyoloji',
    categoryLabel: 'Biyoloji (TYT-AYT)',
    title: 'Kalıtım, Hücre Bölünmeleri & Ekoloji',
    teachers: [
      { name: 'Dr. Biyoloji', query: 'Dr Biyoloji Kalıtım Hücre Bölünmeleri Kampı' },
      { name: 'Selin Hoca', query: 'Selin Hoca Kalıtım TYT' }
    ],
    subtopics: [
      { id: 'biy-2-1', title: 'Mitoz ve Mayoz Bölünme Evreleri, Krossing-Over', completed: true },
      { id: 'biy-2-2', title: 'Mendel Genetiği, Eş Baskınlık ve Kan Grupları', completed: false },
      { id: 'biy-2-3', title: 'Soyağaçları ve Cinsiyete Bağlı Kalıtım (Hemofili, Renk Körlüğü)', completed: false },
      { id: 'biy-2-4', title: 'Besin Zinciri, Madde Döngüleri ve Çevre Sorunları', completed: false }
    ]
  },
  {
    id: 'top-biyoloji-3',
    category: 'biyoloji',
    categoryLabel: 'Biyoloji (TYT-AYT)',
    title: 'İnsan Fizyolojisi (Sistemler Master Modül - AYT)',
    teachers: [
      { name: 'Dr. Biyoloji', query: 'Dr Biyoloji Sistemler Kampı AYT' },
      { name: 'Biosem', query: 'Biosem Sistemler Kampı AYT Biyoloji' }
    ],
    subtopics: [
      { id: 'biy-3-1', title: 'Sinir Sistemi ve Endokrin Sistem (Hormonlar)', completed: false },
      { id: 'biy-3-2', title: 'Duyu Organları (Göz, Kulak, Deri, Dil, Burun)', completed: false },
      { id: 'biy-3-3', title: 'Destek-Hareket ve Sindirim Sistemi Mekanizmaları', completed: false },
      { id: 'biy-3-4', title: 'Dolaşım, Bağışıklık, Solunum ve Boşaltım Sistemleri', completed: false }
    ]
  },
  {
    id: 'top-biyoloji-4',
    category: 'biyoloji',
    categoryLabel: 'Biyoloji (TYT-AYT)',
    title: 'Genden Proteine, Fotosentez & Hücresel Solunum (AYT)',
    teachers: [
      { name: 'Dr. Biyoloji', query: 'Dr Biyoloji Fotosentez Solunum Protein Sentezi' },
      { name: 'Biosem', query: 'Biosem Genden Proteine Hücresel Solunum' }
    ],
    subtopics: [
      { id: 'biy-4-1', title: 'DNA Replikasyonu, Transkripsiyon ve Translasyon', completed: false },
      { id: 'biy-4-2', title: 'Işığa Bağımlı ve Bağımsız Fotosentez Evreleri, Kemosentez', completed: false },
      { id: 'biy-4-3', title: 'Glikoliz, Krebs Çemberi ve ETS Basamakları', completed: false },
      { id: 'biy-4-4', title: 'Bitki Biyolojisi: Dokular, Organlar ve Madde Taşınması', completed: false }
    ]
  },

  // --- TÜRKÇE & EDEBİYAT ---
  {
    id: 'top-turkce-1',
    category: 'turkce',
    categoryLabel: 'Türkçe & Edebiyat',
    title: 'Paragraf Taktikleri & Dil Bilgisi (TYT)',
    teachers: [
      { name: 'Rüştü Hoca ile Türkçe', query: 'Rüştü Hoca Paragraf Taktikleri TYT Kampı' },
      { name: 'Kadir Gümüş', query: 'Kadir Gümüş Benim Hocam TYT Türkçe Kampı' }
    ],
    subtopics: [
      { id: 'tur-1-1', title: 'Paragrafta Ana Düşünce, Yardımcı Düşünceler ve Yapı', completed: true },
      { id: 'tur-1-2', title: 'Ses Olayları (Ünlü Düşmesi, Ünsüz Benzeşmesi, Yumuşama)', completed: true },
      { id: 'tur-1-3', title: 'Yazım Kuralları ve Noktalama İşaretleri', completed: false },
      { id: 'tur-1-4', title: 'Sözcük Türleri: İsim, Sıfat, Zamir, Zarf, Edat-Bağlaç, Fiil', completed: false },
      { id: 'tur-1-5', title: 'Cümlenin Ögeleri ve Cümle Türleri', completed: false }
    ]
  },
  {
    id: 'top-turkce-2',
    category: 'turkce',
    categoryLabel: 'Türkçe & Edebiyat',
    title: 'Şiir Bilgisi & Edebi Sanatlar (AYT Edebiyat)',
    teachers: [
      { name: 'Kadir Gümüş', query: 'Kadir Gümüş AYT Edebiyat Şiir Bilgisi Edebi Sanatlar' },
      { name: 'Rüştü Hoca', query: 'Rüştü Hoca AYT Edebiyat Kampı' }
    ],
    subtopics: [
      { id: 'tur-2-1', title: 'Nazım Birimi, Ölçü, Kafiye, Redif ve Şiir Türleri', completed: false },
      { id: 'tur-2-2', title: 'Edebi Sanatlar (Teşbih, İstiare, Teşhis, Mecazımürsel vb.)', completed: false },
      { id: 'tur-2-3', title: 'İslamiyet Öncesi ve Geçiş Dönemi Türk Edebiyatı', completed: false }
    ]
  },
  {
    id: 'top-turkce-3',
    category: 'turkce',
    categoryLabel: 'Türkçe & Edebiyat',
    title: 'Divan, Halk, Tanzimat & Cumhuriyet Edebiyatı (AYT)',
    teachers: [
      { name: 'Kadir Gümüş', query: 'Kadir Gümüş Divan Edebiyatı Cumhuriyet Edebiyatı' },
      { name: 'Rüştü Hoca', query: 'Rüştü Hoca Yazar Eser Hafıza Teknikleri' }
    ],
    subtopics: [
      { id: 'tur-3-1', title: 'Divan Edebiyatı Şairleri, Mesneviler ve Nesir Türleri', completed: false },
      { id: 'tur-3-2', title: 'Halk Edebiyatı Kolları: Anonim, Aşık ve Dini-Tasavvufi', completed: false },
      { id: 'tur-3-3', title: 'Tanzimat, Servet-i Fünun ve Fecr-i Ati Edebiyatı', completed: false },
      { id: 'tur-3-4', title: 'Milli Edebiyat ve Cumhuriyet Dönemi Roman/Şiir Hareketleri', completed: false }
    ]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { YKS_CURRICULUM };
}
