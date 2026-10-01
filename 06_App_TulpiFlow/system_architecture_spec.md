# System Architecture Specification: TulpiFlow

**Sistem Adı:** TulpiFlow Client & PWA/Capacitor Engine  
**Mimari Tip:** Local-First, Offline-Capable, Event-Driven Single Page Mobile/Desktop Application  
**Doküman Sürümü:** 1.0.0-PROD  

---

## 1. Yüksek Seviye Sistem Mimarisi

```
+───────────────────────────────────────────────────────────────────────────────────+
|                                    TULPIFLOW CORE                                 |
+───────────────────────────────────────────────────────────────────────────────────+
|                           [ SENSATIONAL WOW SPLASH ]                              |
|                   Web Audio Synthesizer + Particle Canvas Mesh                   |
+─────────────────────────────────────────┬─────────────────────────────────────────+
|                                         ▼                                         |
|                         [ ONE-TIME PASSCODE GATEWAY ]                             |
|          Keys: ANIL-7799-FLOW (Admin/Mentor) | FADIME-2026-YKS (Student)          |
|                  Token Persistence: LocalStorage / IndexedDB                      |
+─────────────────────────────────────────┬─────────────────────────────────────────+
|                                         ▼                                         |
|                           [ APP EVENT BUS & DISPATCHER ]                          |
+────────────────────┬────────────────────┬────────────────────┬────────────────────+
|                    │                    │                    │                    |
|         ▼          │         ▼          │         ▼          │         ▼          |
|  [Voice Journal    │  [Topic Tree &     │  [Cross-Calendar   │  [Live Focus &     |
|   Speech Parser]   │   Progress State]  │   Delegation Eng]  │   Pomodoro Timer]  |
|  Web Speech API +  │  TYT/AYT Math +    │  Mutual Tasks +    │  25/5, 50/10, Deep │
|  Intent Tokenizer  │  Engineering Sprints│  Alarms & Dates   │  Work + Chimes     |
+────────────────────┴────────────────────┴────────────────────┴────────────────────+
|                                         │                                         |
|                                         ▼                                         |
|                        [ CELEBRATION & FEEDBACK ENGINE ]                          |
|             Confetti Particle System + Web Audio Polyphonic Chimes                |
+─────────────────────────────────────────┬─────────────────────────────────────────+
|                                         ▼                                         |
|                         [ LOCAL-FIRST PERSISTENCE LAYER ]                         |
|           Schema Versioning, JSON Export/Import, Capacitor SQLite Adapter         |
+───────────────────────────────────────────────────────────────────────────────────+
```

---

## 2. Durum Yönetimi ve Veri Modelleri (State Management)

Tüm veriler merkezi bir state nesnesinde (single source of truth) reaktif olarak tutulur. Her mutasyon anında `localStorage` üzerine serialize edilir (Auto-save / Zero Data Loss).

### 2.1 Veri Şeması
```typescript
interface TulpiFlowState {
  auth: {
    authenticated: boolean;
    activeRole: 'anil' | 'fadime';
    token: string;
    unlockedAt: string;
  };
  users: {
    fadime: {
      name: string;
      title: string;
      avatar: string;
      streakDays: number;
      totalFocusMinutes: number;
      sosActive: boolean;
      sosMessage?: string;
    };
    anil: {
      name: string;
      title: string;
      avatar: string;
      streakDays: number;
      totalFocusMinutes: number;
    };
  };
  topicTree: {
    id: string;
    category: string; // "TYT-AYT Matematik", "Geometri", "Dev & Data"
    title: string;
    subtopics: {
      id: string;
      title: string;
      completed: boolean;
      completedAt?: string;
    }[];
  }[];
  tasks: {
    id: string;
    assignedBy: 'anil' | 'fadime';
    assignedTo: 'anil' | 'fadime';
    title: string;
    date: string;
    priority: 'low' | 'medium' | 'high';
    completed: boolean;
  }[];
  mistakeNotes: {
    id: string;
    topic: string;
    note: string;
    solved: boolean;
    createdAt: string;
  }[];
  pomodoro: {
    running: boolean;
    mode: '25-5' | '50-10' | 'deepwork';
    timeLeft: number;
    sessionCount: number;
  };
}
```

---

## 3. Doğal Dil ve Ses Ayrıştırma Pipeline'ı (Voice Pipeline)

1. **Giriş:** Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition`) kullanılarak ses akışı metne çevrilir (`transcript`).
2. **Normalizasyon:** Küçük harfe çevirme, Türkçe karakter temizliği (`ı/i`, `ş/s` eşlemesi) ve dolgu kelimelerin ayıklanması.
3. **Intent Tespiti:**
   - Cümle içerisinde başarı tetikleyicisi (`bitti`, `hallettim`, `cozdum`, `tamamladim`, `haloldu`) aranır.
4. **Entity Extraction (Konu Düğümü Eşleme):**
   - Transkript, veri tabanındaki tüm konu ve alt konu başlıkları ile Levenshtein mesafesi veya substring matching ile taranır.
   - Örn: `"bugün türevde geometrik yorumu hallettim"` ──► Eşleşen: `topic: 'Türev'`, `subtopic: 'Geometrik Yorum'`.
5. **State Mutasyonu & Event Trigger:**
   - Düğüm durumu `completed = true` yapılır.
   - `CelebrationEngine.trigger({ name: 'Fadime', task: 'Geometrik Yorum' })` tetiklenir.

---

## 4. Web Audio API ve Parçacık Fizik Motoru

Dışarıdan `.mp3` veya ağır kütüphaneler indirme zorunluluğunu ortadan kaldırmak için native browser API'leri kullanılır:

### 4.1 Synthesized Polyphonic Audio Chimes
- **Kutlama Melodisi:** 3 adet harmonik `OscillatorNode` (C5: 523.25Hz, E5: 659.25Hz, G5: 783.99Hz, C6: 1046.50Hz) ile `GainNode` üzerinden ADSR (Attack-Decay-Sustain-Release) zarfı uygulanarak kristal tınısı üretilir.
- **Focus Shield (Ortam Sesi):** AudioContext içinde 4096 boyutlu `AudioBuffer` ile beyaz/pembe gürültü sentezlenip BiQuadFilter (Low-pass) ile yağmur uğultusu simüle edilir.

### 4.2 Canvas Confetti Engine
- HTML5 Canvas üzerinde yerçekimi ($g = 0.4$), hava sürtünmesi ($\mu = 0.98$) ve açısal hız ($\omega$) parametreleri ile 80 adet rengarenk fiziksel parçacık 60 FPS'te canlandırılır.

---

## 5. APK / PWA Derleme Spesifikasyonu (Capacitor)

TulpiFlow, standart web teknolojileriyle yazılmış olup doğrudan Android APK'ya paketlenecek şekilde tasarlanmıştır:
- **PWA Manifest:** `manifest.json` ile `display: standalone`, `theme_color: #0f172a`, `background_color: #090d16`.
- **Capacitor Yapılandırması:** `capacitor.config.json` ile `appId: "com.tulpi.flow"`, `appName: "TulpiFlow"`, `webDir: "./"`.
- **Tek Dokunuşla APK:** `npx @capacitor/cli add android` ve `./gradlew assembleDebug` adımları ile imzalı/imzasız debug APK oluşturulur.
