/* ==========================================================================
   TULPIFLOW CORE ENGINE — APP.JS
   Asymmetric Co-Working, Speech Recognition, Web Audio Synthesizer,
   Celebration Confetti, Local-First State Management
   ========================================================================== */

(function () {
  'use strict';

  // =========================================================================
  // 1. STATE & PERSISTENCE LAYER (LOCAL-FIRST)
  // =========================================================================
  const STORAGE_KEY = 'tulpiflow_v1_state';
  const AUTH_KEY = 'tulpiflow_auth_device';

  const DEFAULT_STATE = {
    users: {
      fadime: {
        name: 'Fadime',
        title: 'YKS 2026 Hazırlık & Derece Adayı',
        role: 'student',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=FadimeTulpi',
        streakDays: 14,
        todayFocusMinutes: 125,
        lastAction: 'Türev: Geometrik Yorum tamamlandı',
        sosActive: false,
        sosMessage: ''
      },
      anil: {
        name: 'Anıl',
        title: 'Sistem Mimarı, Geliştirici & Mentör',
        role: 'mentor',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AnilTech',
        streakDays: 28,
        todayFocusMinutes: 255,
        lastAction: 'DDIA LSM-Tree & WAL analiz sprinti tamamlandı'
      }
    },
    topicTree: [
      {
        id: 'top-1',
        category: 'matematik',
        categoryLabel: 'TYT-AYT Matematik',
        title: 'Türev ve Uygulamaları',
        subtopics: [
          { id: 'sub-1-1', title: 'Limit ve Türev Tanımı', completed: true, completedAt: '2026-09-28' },
          { id: 'sub-1-2', title: 'Türev Alma Kuralları', completed: true, completedAt: '2026-09-30' },
          { id: 'sub-1-3', title: 'Geometrik Yorum & Teğet Denklemi', completed: true, completedAt: '2026-10-01' },
          { id: 'sub-1-4', title: 'Maksimum - Minimum Problemleri', completed: false }
        ]
      },
      {
        id: 'top-2',
        category: 'matematik',
        categoryLabel: 'TYT-AYT Matematik',
        title: 'İntegral ve Alan Hesabı',
        subtopics: [
          { id: 'sub-2-1', title: 'Belirsiz İntegral ve Temel Kurallar', completed: false },
          { id: 'sub-2-2', title: 'Değişken Değiştirme Yöntemi', completed: false },
          { id: 'sub-2-3', title: 'Belirli İntegral Özellikleri', completed: false },
          { id: 'sub-2-4', title: 'Eğriler Arasında Kalan Alan Hesabı', completed: false }
        ]
      },
      {
        id: 'top-3',
        category: 'matematik',
        categoryLabel: 'TYT-AYT Matematik',
        title: 'Fonksiyonlar ve Grafikler',
        subtopics: [
          { id: 'sub-3-1', title: 'Fonksiyon Tanım ve Değer Kümesi', completed: true, completedAt: '2026-09-15' },
          { id: 'sub-3-2', title: 'Birebir ve Örten Fonksiyonlar', completed: true, completedAt: '2026-09-18' },
          { id: 'sub-3-3', title: 'Bileşke ve Ters Fonksiyon', completed: true, completedAt: '2026-09-20' },
          { id: 'sub-3-4', title: 'Fonksiyon Grafiklerinde Öteleme', completed: false }
        ]
      },
      {
        id: 'top-4',
        category: 'matematik',
        categoryLabel: 'TYT-AYT Matematik',
        title: 'Trigonometri',
        subtopics: [
          { id: 'sub-4-1', title: 'Birim Çember ve Esas Ölçü', completed: true, completedAt: '2026-09-10' },
          { id: 'sub-4-2', title: 'Toplam - Fark Formülleri', completed: false },
          { id: 'sub-4-3', title: 'Yarım Açı Formülleri', completed: false },
          { id: 'sub-4-4', title: 'Trigonometrik Denklemler', completed: false }
        ]
      },
      {
        id: 'top-5',
        category: 'geometri',
        categoryLabel: 'Geometri',
        title: 'Analitik Geometri',
        subtopics: [
          { id: 'sub-5-1', title: 'Noktanın Analitik İncelenmesi', completed: true, completedAt: '2026-09-12' },
          { id: 'sub-5-2', title: 'Doğrunun Eğimi ve Grafiği', completed: true, completedAt: '2026-09-22' },
          { id: 'sub-5-3', title: 'İki Doğru Arasındaki Açı & Uzaklık', completed: false },
          { id: 'sub-5-4', title: 'Çemberin Analitik İncelenmesi', completed: false }
        ]
      },
      {
        id: 'top-6',
        category: 'geometri',
        categoryLabel: 'Geometri',
        title: 'Üçgenler ve Çokgenler',
        subtopics: [
          { id: 'sub-6-1', title: 'Üçgende Açılar ve Kenar Bağıntıları', completed: true, completedAt: '2026-09-05' },
          { id: 'sub-6-2', title: 'Benzerlik Teoremleri', completed: true, completedAt: '2026-09-14' },
          { id: 'sub-6-3', title: 'Dörtgenler ve Özel Çokgenler', completed: false }
        ]
      },
      {
        id: 'top-7',
        category: 'fen',
        categoryLabel: 'Fizik & Kimya',
        title: 'Mekanik & Elektrik',
        subtopics: [
          { id: 'sub-7-1', title: 'Bağıl Hareket ve Newton Yasaları', completed: true, completedAt: '2026-09-25' },
          { id: 'sub-7-2', title: 'İş, Güç ve Enerji', completed: false },
          { id: 'sub-7-3', title: 'Elektriksel Potansiyel ve Alan', completed: false }
        ]
      }
    ],
    tasks: [
      {
        id: 'task-1',
        title: '3D AYT Matematik: Türev Test 7-8 Çözülecek',
        assignedBy: 'anil',
        assignedTo: 'fadime',
        priority: 'high',
        date: '2026-10-02',
        completed: false
      },
      {
        id: 'task-2',
        title: 'Trigonometri Çıkmış Sorular (Son 5 Yıl)',
        assignedBy: 'anil',
        assignedTo: 'fadime',
        priority: 'medium',
        date: '2026-10-03',
        completed: false
      },
      {
        id: 'task-3',
        title: 'Geometri Deneme 3 Analizi ve Hata Çözümü',
        assignedBy: 'fadime',
        assignedTo: 'fadime',
        priority: 'medium',
        date: '2026-10-02',
        completed: true
      },
      {
        id: 'task-4',
        title: 'DDIA Bölüm 5-6 Replikasyon Özet Çıkarımı',
        assignedBy: 'anil',
        assignedTo: 'anil',
        priority: 'high',
        date: '2026-10-02',
        completed: true
      },
      {
        id: 'task-5',
        title: 'Kafka CDC & Event Sourcing Benchmark Testi',
        assignedBy: 'anil',
        assignedTo: 'anil',
        priority: 'medium',
        date: '2026-10-04',
        completed: false
      }
    ],
    anilSprints: [
      { id: 'sp-1', text: 'DDIA Storage Engine & LSM-Tree Compaction Notları', done: true },
      { id: 'sp-2', text: 'TulpiFlow Asymmetric Synchronization Protokolü', done: true },
      { id: 'sp-3', text: 'Linear Algebra: Eigenvalues & PCA Implementasyonu', done: false },
      { id: 'sp-4', text: 'Capacitor Android APK Packaging Pipeline', done: false }
    ],
    mistakes: [
      {
        id: 'mis-1',
        topic: 'AYT Matematik - Türev',
        note: 'Teğet doğrusunun eğimi türeve eşit olduğu halde dik teğet eğimi m1*m2=-1 kuralında işaret hatası yapıldı.',
        solved: false,
        createdAt: '2026-10-01'
      },
      {
        id: 'mis-2',
        topic: 'Geometri - Çemberde Açı',
        note: 'Teğet-kiriş açı ile çevre açı arasındaki bağıntı sorusunda merkez açı karıştırıldı.',
        solved: true,
        createdAt: '2026-09-29'
      }
    ],
    pomodoro: {
      mode: '25-5',
      durationMinutes: 25,
      remainingSeconds: 25 * 60,
      isRunning: false,
      intervalId: null
    }
  };

  // Load or initialize state
  let state = loadState();

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Lokal state parse hatası, varsayılana dönülüyor.', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_STATE));
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Lokal state kaydedilemedi.', e);
    }
  }

  // =========================================================================
  // 2. WEB AUDIO API SYNTHESIZER (NO EXTERNAL AUDIO FILES NEEDED!)
  // =========================================================================
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // Sensational opening chord synthesizer
  function playOpeningChord() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      // Polyphonic ascending dream chord (C4, G4, C5, E5, G5, B5)
      const freqs = [261.63, 392.00, 523.25, 659.25, 783.99, 987.77];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now + idx * 0.12);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.12 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 2.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 2.5);
      });
    } catch (e) {
      console.warn('Web Audio başlatılamadı:', e);
    }
  }

  // Crystal celebration fanfare chord
  function playCelebrationChime() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      // High triumphant arpeggio (C5, E5, G5, C6)
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.09);

        gain.gain.setValueAtTime(0, now + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.09 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 1.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 1.8);
      });
    } catch (e) {
      console.warn('Celebration chime hatası:', e);
    }
  }

  // Timer complete gong
  function playTimerAlarm() {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.exponentialRampToValueAtTime(440, now + 1.2);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 1.3);
    } catch (e) {
      console.warn('Timer alarm hatası:', e);
    }
  }

  // Focus Shield: Synthesized Pink Noise / Ambient Rain
  let ambientNoiseSource = null;
  let ambientGainNode = null;
  let isAmbientPlaying = false;

  function toggleFocusShield() {
    const btn = document.getElementById('ambient-sound-toggle');
    if (isAmbientPlaying) {
      if (ambientGainNode) {
        ambientGainNode.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
        setTimeout(() => {
          if (ambientNoiseSource) ambientNoiseSource.stop();
          isAmbientPlaying = false;
          btn.classList.remove('playing');
        }, 500);
      }
    } else {
      try {
        const ctx = getAudioContext();
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.11; // Gain normalization
          b6 = white * 0.115926;
        }

        ambientNoiseSource = ctx.createBufferSource();
        ambientNoiseSource.buffer = noiseBuffer;
        ambientNoiseSource.loop = true;

        // Low-pass filter to sound like gentle rain
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        ambientGainNode = ctx.createGain();
        ambientGainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
        ambientGainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 1);

        ambientNoiseSource.connect(filter);
        filter.connect(ambientGainNode);
        ambientGainNode.connect(ctx.destination);

        ambientNoiseSource.start();
        isAmbientPlaying = true;
        btn.classList.add('playing');
      } catch (e) {
        console.warn('Focus Shield başlatılamadı:', e);
      }
    }
  }

  // =========================================================================
  // 3. FULL-SCREEN CONFETTI ENGINE (PHYSICS-BASED)
  // =========================================================================
  const confettiCanvas = document.getElementById('confetti-canvas');
  const cctx = confettiCanvas ? confettiCanvas.getContext('2d') : null;
  let confettiParticles = [];
  let confettiAnimationId = null;

  function resizeConfettiCanvas() {
    if (confettiCanvas) {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
  }
  window.addEventListener('resize', resizeConfettiCanvas);
  resizeConfettiCanvas();

  function triggerConfetti() {
    confettiParticles = [];
    const colors = ['#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ffffff'];
    const count = 90;

    for (let i = 0; i < count; i++) {
      confettiParticles.push({
        x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 200,
        y: window.innerHeight * 0.65,
        vx: (Math.random() - 0.5) * 16,
        vy: -Math.random() * 18 - 8,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
    animateConfetti();
  }

  function animateConfetti() {
    if (!cctx) return;
    cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = 0; i < confettiParticles.length; i++) {
      const p = confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45; // gravity
      p.vx *= 0.98; // air resistance
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.007;

      if (p.opacity > 0) {
        cctx.save();
        cctx.translate(p.x, p.y);
        cctx.rotate((p.rotation * Math.PI) / 180);
        cctx.fillStyle = p.color;
        cctx.globalAlpha = Math.max(0, p.opacity);
        cctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        cctx.restore();
      }
    }

    confettiParticles = confettiParticles.filter(p => p.opacity > 0 && p.y < window.innerHeight + 50);

    if (confettiParticles.length > 0) {
      confettiAnimationId = requestAnimationFrame(animateConfetti);
    } else {
      cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  // =========================================================================
  // 4. SENSATIONAL "tulpi normal flow" OPENING WOW SPLASH & CANVAS MESH
  // =========================================================================
  const splashOverlay = document.getElementById('wow-splash-overlay');
  const splashCanvas = document.getElementById('splash-canvas');
  let sctx = splashCanvas ? splashCanvas.getContext('2d') : null;
  let splashAnimId = null;

  function initSplashMesh() {
    if (!splashCanvas || !sctx) return;
    splashCanvas.width = window.innerWidth;
    splashCanvas.height = window.innerHeight;

    const nodes = [];
    const count = Math.min(50, Math.floor(window.innerWidth / 20));
    for (let i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * splashCanvas.width,
        y: Math.random() * splashCanvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2 + 1.5,
        color: Math.random() > 0.5 ? '#8b5cf6' : '#ec4899'
      });
    }

    function renderMesh() {
      sctx.clearRect(0, 0, splashCanvas.width, splashCanvas.height);

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > splashCanvas.width) n.vx *= -1;
        if (n.y < 0 || n.y > splashCanvas.height) n.vy *= -1;

        sctx.beginPath();
        sctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        sctx.fillStyle = n.color;
        sctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const dist = Math.hypot(n.x - n2.x, n.y - n2.y);
          if (dist < 120) {
            sctx.beginPath();
            sctx.moveTo(n.x, n.y);
            sctx.lineTo(n2.x, n2.y);
            sctx.strokeStyle = `rgba(139, 92, 246, ${1 - dist / 120})`;
            sctx.lineWidth = 0.6;
            sctx.stroke();
          }
        }
      }
      splashAnimId = requestAnimationFrame(renderMesh);
    }

    renderMesh();
  }

  function launchWowSplash(isManual = false) {
    if (!splashOverlay) return;
    splashOverlay.classList.remove('exit-anim', 'hidden');
    splashOverlay.classList.add('active');

    initSplashMesh();
    playOpeningChord();

    const statusLabel = document.getElementById('splash-status-label');
    if (statusLabel) statusLabel.textContent = 'Kuantum Odak Alanı İlklendiriliyor...';

    setTimeout(() => {
      if (statusLabel) statusLabel.textContent = 'Eşzamanlı Hesap Verebilirlik Hazır ⚡';
    }, 1200);

    // Auto dismiss after 2.6 seconds if not manually skipped
    const timer = setTimeout(() => {
      dismissSplash();
    }, 2600);

    document.getElementById('skip-splash-btn').onclick = () => {
      clearTimeout(timer);
      dismissSplash();
    };
  }

  function dismissSplash() {
    if (!splashOverlay) return;
    splashOverlay.classList.add('exit-anim');
    setTimeout(() => {
      splashOverlay.classList.remove('active');
      if (splashAnimId) cancelAnimationFrame(splashAnimId);
      checkDeviceAuth();
    }, 600);
  }

  // =========================================================================
  // 5. ONE-TIME DEVICE PASSCODE GATEWAY
  // =========================================================================
  let currentAuth = null;

  function checkDeviceAuth() {
    const savedAuth = localStorage.getItem(AUTH_KEY);
    if (savedAuth) {
      try {
        currentAuth = JSON.parse(savedAuth);
        applyUserRole(currentAuth.role);
        return;
      } catch (e) {
        console.warn('Auth token bozuk.');
      }
    }
    // Show passcode modal
    const authOverlay = document.getElementById('auth-modal-overlay');
    if (authOverlay) authOverlay.classList.remove('hidden');
  }

  function verifyPasscode(code) {
    const cleanCode = (code || '').trim().toUpperCase();
    const errorEl = document.getElementById('auth-error-msg');

    const anilKeys = ['ANIL-7799-FLOW', '7799', 'ANIL'];
    const fadimeKeys = ['FADIME-2026-YKS', '2026', 'FADIME'];

    if (anilKeys.includes(cleanCode)) {
      currentAuth = {
        role: 'anil',
        name: 'Anıl',
        title: 'Sistem Mimarı & Mentör',
        token: 'auth-token-anil-' + Date.now(),
        unlockedAt: new Date().toISOString()
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(currentAuth));
      if (errorEl) errorEl.classList.add('hidden');
      document.getElementById('auth-modal-overlay').classList.add('hidden');
      applyUserRole('anil');
      playCelebrationChime();
    } else if (fadimeKeys.includes(cleanCode)) {
      currentAuth = {
        role: 'fadime',
        name: 'Fadime',
        title: 'YKS 2026 Hazırlık & Öğrenci',
        token: 'auth-token-fadime-' + Date.now(),
        unlockedAt: new Date().toISOString()
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(currentAuth));
      if (errorEl) errorEl.classList.add('hidden');
      document.getElementById('auth-modal-overlay').classList.add('hidden');
      applyUserRole('fadime');
      playCelebrationChime();
    } else {
      if (errorEl) {
        errorEl.textContent = 'Girdiğiniz şifre eşleşmedi. Lütfen size iletilen kodu tekrar kontrol edin.';
        errorEl.classList.remove('hidden');
      }
    }
  }

  function applyUserRole(role) {
    const user = state.users[role] || state.users.fadime;
    document.getElementById('user-name-display').textContent = user.name;
    document.getElementById('user-role-display').textContent = user.title;
    document.getElementById('user-avatar-img').src = user.avatar;

    // Switch default tab based on user
    switchTab(role);
  }

  // =========================================================================
  // 6. TAB NAVIGATION SYSTEM (TRUNK TEST COMPLIANT)
  // =========================================================================
  let currentActiveTab = 'fadime';

  function switchTab(tabId) {
    currentActiveTab = tabId;

    // Update Desktop Nav Tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-tab') === tabId);
    });

    // Update Mobile Nav Tabs
    document.querySelectorAll('.m-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    // Update Panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === 'pane-' + tabId);
    });

    // Update Breadcrumb
    const bcCurrent = document.getElementById('bc-current-space');
    const bcSub = document.getElementById('bc-active-sub');

    if (tabId === 'fadime') {
      bcCurrent.textContent = "Fadime's Space";
      bcSub.textContent = 'YKS Müfredat & Odak Paneli';
    } else if (tabId === 'anil') {
      bcCurrent.textContent = "Anıl's Space";
      bcSub.textContent = 'Mühendislik, Sprintler & Öğrenci Takibi';
    } else if (tabId === 'calendar') {
      bcCurrent.textContent = 'Ortak Takvim';
      bcSub.textContent = 'Görev Delege & Haftalık Plan';
    } else if (tabId === 'analytics') {
      bcCurrent.textContent = 'İlham & Isı Haritası';
      bcSub.textContent = '365 Günlük Süreklilik ve Veri Merkezi';
    }
  }

  // =========================================================================
  // 7. TOPIC TREE & SEMANTIC PROGRESS ENGINE
  // =========================================================================
  let activeTopicCategory = 'all';

  function renderTopicTree() {
    const container = document.getElementById('topic-cards-container');
    if (!container) return;

    let totalSubtopics = 0;
    let completedSubtopics = 0;

    const filteredTopics = state.topicTree.filter(topic => {
      if (activeTopicCategory === 'all') return true;
      return topic.category === activeTopicCategory;
    });

    // Calculate overall stats across all topics
    state.topicTree.forEach(t => {
      t.subtopics.forEach(sub => {
        totalSubtopics++;
        if (sub.completed) completedSubtopics++;
      });
    });

    const overallPct = totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0;
    const pctLabel = document.getElementById('topic-percentage-label');
    const pctFill = document.getElementById('topic-progress-fill');
    if (pctLabel) pctLabel.textContent = overallPct + '%';
    if (pctFill) pctFill.style.width = overallPct + '%';

    // Render cards
    container.innerHTML = '';
    filteredTopics.forEach(topic => {
      const topicDone = topic.subtopics.filter(s => s.completed).length;
      const topicPct = Math.round((topicDone / topic.subtopics.length) * 100);

      const card = document.createElement('div');
      card.className = 'topic-card elevation-card';
      card.innerHTML = `
        <div class="topic-card-head">
          <span class="topic-cat-badge">${topic.categoryLabel}</span>
          <span class="topic-pct">${topicDone}/${topic.subtopics.length} (%${topicPct})</span>
        </div>
        <h4 class="topic-card-title">${topic.title}</h4>
        <ul class="subtopics-list">
          ${topic.subtopics.map(sub => `
            <li class="subtopic-item ${sub.completed ? 'completed' : ''}" data-topic-id="${topic.id}" data-sub-id="${sub.id}">
              <span>${sub.title}</span>
              <span class="subtopic-check">${sub.completed ? '✓' : '○'}</span>
            </li>
          `).join('')}
        </ul>
      `;
      container.appendChild(card);
    });

    // Attach click toggles
    container.querySelectorAll('.subtopic-item').forEach(item => {
      item.addEventListener('click', () => {
        const tId = item.getAttribute('data-topic-id');
        const sId = item.getAttribute('data-sub-id');
        toggleSubtopic(tId, sId);
      });
    });
  }

  function toggleSubtopic(topicId, subId, silent = false) {
    const topic = state.topicTree.find(t => t.id === topicId);
    if (!topic) return;
    const sub = topic.subtopics.find(s => s.id === subId);
    if (!sub) return;

    sub.completed = !sub.completed;
    if (sub.completed) {
      sub.completedAt = new Date().toISOString().split('T')[0];
      state.users.fadime.lastAction = `${topic.title}: ${sub.title} tamamlandı`;
      if (!silent) {
        showCelebrationModal('Fadime', `${topic.title} - ${sub.title}`);
      }
    }
    saveState();
    renderTopicTree();
    updateStudentOverview();
  }

  // =========================================================================
  // 8. NATURAL LANGUAGE & VOICE JOURNALING PIPELINE
  // =========================================================================
  let recognition = null;
  let isRecording = false;

  function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Web Speech API bu tarayıcıda desteklenmiyor.');
      const statusText = document.getElementById('voice-status-text');
      if (statusText) statusText.textContent = 'Tarayıcınız ses tanımayı desteklemiyor. Aşağıdaki metin kutusunu kullanabilirsiniz.';
      return null;
    }

    const rec = new SpeechRecognition();
    rec.lang = 'tr-TR';
    rec.continuous = false;
    rec.interimResults = false;

    rec.onstart = () => {
      isRecording = true;
      document.getElementById('voice-record-btn').classList.add('recording');
      document.getElementById('live-rec-badge').classList.remove('hidden');
      document.getElementById('voice-status-text').textContent = 'Dinleniyor... Çalıştığınız konuyu söyleyin.';
    };

    rec.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      document.getElementById('transcript-input').value = transcript;
      parseVoiceIntent(transcript);
    };

    rec.onerror = (event) => {
      console.warn('Ses tanıma hatası:', event.error);
      document.getElementById('voice-status-text').textContent = 'Ses alınamadı: ' + event.error;
      stopSpeechRecognition();
    };

    rec.onend = () => {
      stopSpeechRecognition();
    };

    return rec;
  }

  function toggleSpeechRecognition() {
    if (!recognition) {
      recognition = initSpeechRecognition();
    }
    if (!recognition) return;

    if (isRecording) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (e) {
        console.warn('Tanıma başlatılamadı:', e);
      }
    }
  }

  function stopSpeechRecognition() {
    isRecording = false;
    const btn = document.getElementById('voice-record-btn');
    const badge = document.getElementById('live-rec-badge');
    if (btn) btn.classList.remove('recording');
    if (badge) badge.classList.add('hidden');
    const statusText = document.getElementById('voice-status-text');
    if (statusText && statusText.textContent.includes('Dinleniyor')) {
      statusText.textContent = 'Mikrofona dokunun ve konuşun...';
    }
  }

  // Semantic intent parsing & topic matching
  function parseVoiceIntent(rawText) {
    if (!rawText || !rawText.trim()) return;

    const text = rawText.toLowerCase().replace(/['".,]/g, '');
    const triggerWords = ['bitti', 'bitirdim', 'hallettim', 'haloldu', 'tamamladim', 'cozdum', 'yaptim', 'okudum'];
    const hasTrigger = triggerWords.some(w => text.includes(w));

    let matchedSubtopic = null;
    let matchedTopic = null;

    // Search against topic tree titles & subtopics
    for (const topic of state.topicTree) {
      for (const sub of topic.subtopics) {
        const subWords = sub.title.toLowerCase().split(' ');
        const topicWords = topic.title.toLowerCase().split(' ');

        // Check matching overlap
        const matchesSub = subWords.some(w => w.length > 3 && text.includes(w));
        const matchesTopic = topicWords.some(w => w.length > 3 && text.includes(w));

        if (matchesSub || matchesTopic) {
          matchedTopic = topic;
          matchedSubtopic = sub;
          break;
        }
      }
      if (matchedSubtopic) break;
    }

    if (matchedSubtopic) {
      matchedSubtopic.completed = true;
      matchedSubtopic.completedAt = new Date().toISOString().split('T')[0];
      state.users.fadime.lastAction = `${matchedTopic.title}: ${matchedSubtopic.title} tamamlandı`;
      saveState();
      renderTopicTree();
      updateStudentOverview();

      showCelebrationModal('Fadime', `${matchedTopic.title} - ${matchedSubtopic.title}`);
      document.getElementById('voice-status-text').textContent = `🎯 Eşleşti: "${matchedSubtopic.title}" başarıyla tamamlandı!`;
    } else {
      // If no exact curriculum node, create dynamic completed task!
      const newTask = {
        id: 'voice-task-' + Date.now(),
        title: rawText.charAt(0).toUpperCase() + rawText.slice(1),
        assignedBy: 'fadime',
        assignedTo: 'fadime',
        priority: 'medium',
        date: new Date().toISOString().split('T')[0],
        completed: true
      };
      state.tasks.unshift(newTask);
      saveState();
      renderTasks();
      showCelebrationModal('Fadime', newTask.title);
      document.getElementById('voice-status-text').textContent = `🎯 Yeni görev olarak kaydedildi ve tamamlandı!`;
    }
  }

  // =========================================================================
  // 9. CELEBRATION ENGINE & FEEDBACK MODAL
  // =========================================================================
  function showCelebrationModal(userName, subjectTitle) {
    const modal = document.getElementById('celebration-modal-overlay');
    const titleEl = document.getElementById('celebration-title');
    const descEl = document.getElementById('celebration-desc');

    if (titleEl) titleEl.textContent = `Tebrikler ${userName}! 🎉`;
    if (descEl) {
      descEl.textContent = `"${subjectTitle}" konusunu başarıyla tamamladın! Çalışma ivmen ve disiplinin hedefine doğru emin adımlarla ilerliyor.`;
    }

    modal.classList.remove('hidden');

    // Trigger visual confetti and audio chime
    triggerConfetti();
    playCelebrationChime();
  }

  // =========================================================================
  // 10. POMODORO TIMER SYSTEM
  // =========================================================================
  let timerInterval = null;
  let timerMode = '25-5';
  let timerSecondsLeft = 25 * 60;
  let timerTotalSeconds = 25 * 60;
  let timerIsRunning = false;

  function updateTimerDisplay() {
    const digits = document.getElementById('timer-digits');
    const progressRing = document.getElementById('timer-progress-ring');
    const statusBadge = document.getElementById('fadime-status-badge');

    const mins = Math.floor(timerSecondsLeft / 60);
    const secs = timerSecondsLeft % 60;
    const fmt = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    if (digits) digits.textContent = fmt;

    if (progressRing && timerMode !== 'deepwork') {
      const circumference = 552.92;
      const progress = timerSecondsLeft / timerTotalSeconds;
      progressRing.style.strokeDashoffset = circumference * (1 - progress);
    }

    if (statusBadge) {
      if (timerIsRunning) {
        statusBadge.textContent = '🟢 Odakta (Pomodoro Aktif)';
        statusBadge.style.color = '#10b981';
      } else {
        statusBadge.textContent = '🟡 Mola / Beklemede';
        statusBadge.style.color = '#f59e0b';
      }
    }
  }

  function startPauseTimer() {
    const btn = document.getElementById('timer-start-pause-btn');
    if (timerIsRunning) {
      // Pause
      clearInterval(timerInterval);
      timerIsRunning = false;
      if (btn) btn.textContent = 'Devam Et ▷';
    } else {
      // Start
      getAudioContext(); // Ensure Audio Context on user gesture
      timerIsRunning = true;
      if (btn) btn.textContent = 'Duraklat ⏸';

      timerInterval = setInterval(() => {
        if (timerMode === 'deepwork') {
          timerSecondsLeft++; // counts up in deepwork
        } else {
          if (timerSecondsLeft > 0) {
            timerSecondsLeft--;
          } else {
            // Finished
            clearInterval(timerInterval);
            timerIsRunning = false;
            playTimerAlarm();
            triggerConfetti();
            alert('🎉 Pomodoro Tamamlandı! Harika bir odak seansı geçirdin. Şimdi 5 dakika mola vakti.');
            resetTimer();
            return;
          }
        }
        updateTimerDisplay();
      }, 1000);
    }
    updateTimerDisplay();
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timerIsRunning = false;
    const btn = document.getElementById('timer-start-pause-btn');
    if (btn) btn.textContent = 'Başlat ▷';

    if (timerMode === '25-5') {
      timerTotalSeconds = 25 * 60;
      timerSecondsLeft = 25 * 60;
    } else if (timerMode === '50-10') {
      timerTotalSeconds = 50 * 60;
      timerSecondsLeft = 50 * 60;
    } else if (timerMode === 'deepwork') {
      timerTotalSeconds = 0;
      timerSecondsLeft = 0;
    }
    updateTimerDisplay();
  }

  function setTimerMode(mode) {
    timerMode = mode;
    document.querySelectorAll('.mode-pill').forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-mode') === mode);
    });
    const label = document.getElementById('timer-mode-label');
    if (label) {
      if (mode === '25-5') label.textContent = 'STANDART POMODORO (25/5)';
      else if (mode === '50-10') label.textContent = 'İLERİ BLOK ODAK (50/10)';
      else if (mode === 'deepwork') label.textContent = 'DEEP WORK (SINIRSIZ SAYAC)';
    }
    resetTimer();
  }

  // =========================================================================
  // 11. CROSS-ASSIGNMENT TASK PLANNER & CALENDAR
  // =========================================================================
  let taskFilter = 'all';

  function renderTasks() {
    const container = document.getElementById('tasks-container');
    const countTag = document.getElementById('task-count-tag');
    if (!container) return;

    const filtered = state.tasks.filter(t => {
      if (taskFilter === 'from-mentor') return t.assignedBy === 'anil' && t.assignedTo === 'fadime';
      if (taskFilter === 'fadime') return t.assignedTo === 'fadime';
      if (taskFilter === 'anil') return t.assignedTo === 'anil';
      return true;
    });

    if (countTag) countTag.textContent = `${filtered.length} Görev Listeleniyor`;

    container.innerHTML = '';
    filtered.forEach(task => {
      const card = document.createElement('div');
      card.className = `task-item-card ${task.completed ? 'completed' : ''}`;
      card.innerHTML = `
        <div class="task-left">
          <div class="task-check-circle" data-task-id="${task.id}">
            ${task.completed ? '✓' : ''}
          </div>
          <div class="task-meta-col">
            <span class="task-text">${task.title}</span>
            <div class="task-badges-row">
              ${task.assignedBy === 'anil' && task.assignedTo === 'fadime' ? '<span class="task-badge-item mentor">⭐ Koçtan Gelen</span>' : ''}
              <span class="task-badge-item ${task.priority}">${task.priority === 'high' ? 'Kritik' : task.priority === 'medium' ? 'Normal' : 'Rutin'}</span>
              <span class="task-badge-item date">📅 ${task.date}</span>
            </div>
          </div>
        </div>
        <button class="mini-btn delete-task-btn" data-del-id="${task.id}" title="Görevi Sil">✕</button>
      `;
      container.appendChild(card);
    });

    // Check click
    container.querySelectorAll('.task-check-circle').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-task-id');
        toggleTask(id);
      });
    });

    // Delete click
    container.querySelectorAll('.delete-task-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-del-id');
        state.tasks = state.tasks.filter(t => t.id !== id);
        saveState();
        renderTasks();
      });
    });
  }

  function toggleTask(taskId) {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;
    task.completed = !task.completed;
    if (task.completed) {
      showCelebrationModal(task.assignedTo === 'fadime' ? 'Fadime' : 'Anıl', task.title);
    }
    saveState();
    renderTasks();
  }

  function renderWeekMatrix() {
    const grid = document.getElementById('week-days-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const days = [
      { name: 'Pzt', num: '28' },
      { name: 'Sal', num: '29' },
      { name: 'Çar', num: '30' },
      { name: 'Per', num: '01' },
      { name: 'Cum', num: '02', today: true },
      { name: 'Cmt', num: '03' },
      { name: 'Paz', num: '04' }
    ];

    days.forEach(d => {
      const cell = document.createElement('div');
      cell.className = `week-day-cell ${d.today ? 'today' : ''}`;
      cell.innerHTML = `
        <span class="day-name">${d.name}</span>
        <span class="day-num">${d.num}</span>
      `;
      grid.appendChild(cell);
    });
  }

  // =========================================================================
  // 12. MENTOR SUPERVISION, DELEGATION & SPRINT LIST
  // =========================================================================
  function renderAnilSprints() {
    const list = document.getElementById('anil-sprint-list');
    if (!list) return;
    list.innerHTML = '';

    state.anilSprints.forEach((sp, idx) => {
      const li = document.createElement('li');
      li.className = `sprint-item ${sp.done ? 'checked' : ''}`;
      li.innerHTML = `
        <span>${sp.done ? '☑' : '☐'}</span>
        <span>${sp.text}</span>
      `;
      li.addEventListener('click', () => {
        sp.done = !sp.done;
        saveState();
        renderAnilSprints();
      });
      list.appendChild(li);
    });
  }

  function updateStudentOverview() {
    const lastAction = document.getElementById('fadime-last-action');
    if (lastAction) lastAction.textContent = state.users.fadime.lastAction;

    const sosFeed = document.getElementById('mentor-sos-feed');
    if (sosFeed) {
      if (state.users.fadime.sosActive) {
        sosFeed.innerHTML = `
          <div class="sos-feed-item">
            <span>🚨 ${state.users.fadime.sosMessage || 'Öğrenci yardım çağrısı gönderdi!'}</span>
            <button id="mentor-resolve-sos" class="mini-btn" title="Çözüldü">✓</button>
          </div>
        `;
        const rBtn = document.getElementById('mentor-resolve-sos');
        if (rBtn) {
          rBtn.addEventListener('click', () => {
            state.users.fadime.sosActive = false;
            saveState();
            updateStudentOverview();
            renderSosBanner();
          });
        }
      } else {
        sosFeed.innerHTML = '<span class="micro-note">Şu an bekleyen acil S.O.S. sorusu yok. Öğrenci akışta! ✨</span>';
      }
    }
  }

  // =========================================================================
  // 13. MISTAKE NOTEBOOK (HATA DEFTERİ) & S.O.S. LOGIC
  // =========================================================================
  function renderMistakes() {
    const container = document.getElementById('mistake-list-container');
    if (!container) return;
    container.innerHTML = '';

    state.mistakes.forEach(m => {
      const card = document.createElement('div');
      card.className = 'mistake-card';
      card.innerHTML = `
        <div class="mistake-info">
          <h5>${m.topic}</h5>
          <p>${m.note}</p>
          <span class="mistake-date">Kayıt: ${m.createdAt}</span>
        </div>
        <div style="display:flex; align-items:center; gap: 8px;">
          <button class="mistake-badge ${m.solved ? 'solved' : 'pending'}" data-mis-id="${m.id}">
            ${m.solved ? '✓ Çözüldü' : '⏳ İncelenecek'}
          </button>
          <button class="mini-btn" data-del-mis="${m.id}">✕</button>
        </div>
      `;
      container.appendChild(card);
    });

    container.querySelectorAll('.mistake-badge').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.getAttribute('data-mis-id');
        const mis = state.mistakes.find(x => x.id === id);
        if (mis) {
          mis.solved = !mis.solved;
          saveState();
          renderMistakes();
        }
      });
    });

    container.querySelectorAll('[data-del-mis]').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.getAttribute('data-del-mis');
        state.mistakes = state.mistakes.filter(x => x.id !== id);
        saveState();
        renderMistakes();
      });
    });
  }

  function renderSosBanner() {
    const banner = document.getElementById('sos-alert-banner');
    const msg = document.getElementById('sos-message-text');
    if (!banner) return;

    if (state.users.fadime.sosActive) {
      banner.classList.remove('hidden');
      if (msg) msg.textContent = state.users.fadime.sosMessage;
    } else {
      banner.classList.add('hidden');
    }
  }

  // =========================================================================
  // 14. 365-DAY HEATMAP & BACKUP RESTORE
  // =========================================================================
  function renderHeatmap() {
    const grid = document.getElementById('heatmap-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // 52 weeks * 7 days = 364 days
    const totalDays = 52 * 7;
    for (let i = 0; i < totalDays; i++) {
      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';

      // Density pattern
      let level = 0;
      const rand = Math.random();
      if (rand > 0.85) level = 4;
      else if (rand > 0.65) level = 3;
      else if (rand > 0.45) level = 2;
      else if (rand > 0.25) level = 1;

      cell.classList.add('lvl-' + level);
      cell.title = `Gün #${i + 1}: ${level * 45} dk odaklanma`;
      grid.appendChild(cell);
    }
  }

  function exportDataAsJSON() {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `tulpiflow_backup_${new Date().toISOString().split('T')[0]}.json`);
    dlAnchor.click();
  }

  function importDataFromJSON(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported.topicTree && imported.tasks) {
          state = imported;
          saveState();
          initAllViews();
          alert('✅ Yedek başarıyla geri yüklendi!');
        } else {
          alert('❌ Geçersiz TulpiFlow JSON şeması.');
        }
      } catch (err) {
        alert('❌ JSON dosyası okunamadı.');
      }
    };
    reader.readAsText(file);
  }

  // =========================================================================
  // 15. INITIALIZATION & EVENT LISTENERS
  // =========================================================================
  function initAllViews() {
    renderTopicTree();
    renderTasks();
    renderWeekMatrix();
    renderAnilSprints();
    renderMistakes();
    renderSosBanner();
    renderHeatmap();
    updateStudentOverview();
    updateTimerDisplay();
  }

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Launch Wow Splash
    launchWowSplash();

    // 2. Re-trigger WOW splash on brand click
    document.getElementById('re-trigger-splash').addEventListener('click', () => {
      launchWowSplash(true);
    });

    // 3. Auth Form Handlers
    document.getElementById('auth-submit-btn').addEventListener('click', () => {
      const code = document.getElementById('passcode-input').value;
      verifyPasscode(code);
    });
    document.getElementById('passcode-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        verifyPasscode(e.target.value);
      }
    });
    document.querySelectorAll('.chip-btn').forEach(chip => {
      chip.addEventListener('click', () => {
        const code = chip.getAttribute('data-code');
        document.getElementById('passcode-input').value = code;
        verifyPasscode(code);
      });
    });

    // Switch Role / Logout button
    document.getElementById('switch-role-btn').addEventListener('click', () => {
      if (confirm('Cihaz şifre ekranına dönmek istiyor musunuz?')) {
        localStorage.removeItem(AUTH_KEY);
        document.getElementById('auth-modal-overlay').classList.remove('hidden');
      }
    });

    // 4. Tab Switching
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        switchTab(tab.getAttribute('data-tab'));
      });
    });
    document.querySelectorAll('.m-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        switchTab(btn.getAttribute('data-tab'));
      });
    });

    // 5. Ambient Focus Shield
    document.getElementById('ambient-sound-toggle').addEventListener('click', toggleFocusShield);

    // 6. Voice Recognition
    document.getElementById('voice-record-btn').addEventListener('click', toggleSpeechRecognition);
    document.getElementById('parse-intent-btn').addEventListener('click', () => {
      const val = document.getElementById('transcript-input').value;
      parseVoiceIntent(val);
    });
    document.querySelectorAll('.speech-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const phrase = chip.getAttribute('data-phrase');
        document.getElementById('transcript-input').value = phrase;
        parseVoiceIntent(phrase);
      });
    });

    // 7. Pomodoro Controls
    document.getElementById('timer-start-pause-btn').addEventListener('click', startPauseTimer);
    document.getElementById('timer-reset-btn').addEventListener('click', resetTimer);
    document.querySelectorAll('.mode-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        setTimerMode(pill.getAttribute('data-mode'));
      });
    });

    // 8. Celebration Modal Close
    document.getElementById('close-celebration-btn').addEventListener('click', () => {
      document.getElementById('celebration-modal-overlay').classList.add('hidden');
    });

    // 9. Topic Category Filters
    document.querySelectorAll('#topic-category-filters .filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#topic-category-filters .filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeTopicCategory = pill.getAttribute('data-cat');
        renderTopicTree();
      });
    });

    // 10. Calendar Filters
    document.querySelectorAll('.calendar-filters .filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.calendar-filters .filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        taskFilter = pill.getAttribute('data-calfilter');
        renderTasks();
      });
    });

    // 11. S.O.S. Trigger & Resolve
    document.getElementById('trigger-sos-btn').addEventListener('click', () => {
      const note = prompt('Mentörün Anıl\'a bildirmek istediğin konuyu veya tıkandığın noktayı yaz:', 'Türev geometrik yorum soru tipi');
      if (note) {
        state.users.fadime.sosActive = true;
        state.users.fadime.sosMessage = note;
        saveState();
        renderSosBanner();
        updateStudentOverview();
        alert('🚨 S.O.S. sinyali Anıl\'ın denetim paneline iletildi!');
      }
    });

    document.getElementById('resolve-sos-btn').addEventListener('click', () => {
      state.users.fadime.sosActive = false;
      saveState();
      renderSosBanner();
      updateStudentOverview();
    });

    // 12. Mentor Cheer / Encouragement
    document.getElementById('send-cheer-btn').addEventListener('click', () => {
      const input = document.getElementById('cheer-message-input');
      const msg = input.value.trim();
      if (msg) {
        alert(`🌸 Fadime'ye mesaj iletildi: "${msg}"`);
        input.value = '';
      }
    });

    // 13. Delegate Task to Fadime (Mentor panel)
    document.getElementById('delegate-task-btn').addEventListener('click', () => {
      const title = document.getElementById('delegate-title-input').value.trim();
      const date = document.getElementById('delegate-date-input').value || new Date().toISOString().split('T')[0];
      const priority = document.getElementById('delegate-priority-select').value;

      if (!title) {
        alert('Lütfen görev başlığı girin.');
        return;
      }

      state.tasks.unshift({
        id: 'del-' + Date.now(),
        title: title,
        assignedBy: 'anil',
        assignedTo: 'fadime',
        priority: priority,
        date: date,
        completed: false
      });
      saveState();
      renderTasks();
      document.getElementById('delegate-title-input').value = '';
      alert(`✅ Görev Fadime'nin takvimine başarıyla eklendi!`);
    });

    // Add Sprint for Anıl
    document.getElementById('add-sprint-btn').addEventListener('click', () => {
      const input = document.getElementById('new-sprint-input');
      const val = input.value.trim();
      if (val) {
        state.anilSprints.push({ id: 'sp-' + Date.now(), text: val, done: false });
        saveState();
        renderAnilSprints();
        input.value = '';
      }
    });

    // 14. Modals (New Task & Mistake)
    document.getElementById('open-new-task-modal-btn').addEventListener('click', () => {
      document.getElementById('add-task-modal-overlay').classList.remove('hidden');
    });

    document.getElementById('add-mistake-btn').addEventListener('click', () => {
      document.getElementById('add-mistake-modal-overlay').classList.remove('hidden');
    });

    document.querySelectorAll('.close-modal-btn, [data-close]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modalId = btn.getAttribute('data-close') || btn.closest('.modal-overlay').id;
        document.getElementById(modalId).classList.add('hidden');
      });
    });

    // Save Task from modal
    document.getElementById('save-new-task-btn').addEventListener('click', () => {
      const title = document.getElementById('task-title-input').value.trim();
      const forUser = document.getElementById('task-for-select').value;
      const priority = document.getElementById('task-priority-select').value;
      const date = document.getElementById('task-date-input').value || new Date().toISOString().split('T')[0];

      if (!title) return alert('Başlık gerekli');

      state.tasks.unshift({
        id: 'task-' + Date.now(),
        title: title,
        assignedBy: currentAuth ? currentAuth.role : 'anil',
        assignedTo: forUser,
        priority: priority,
        date: date,
        completed: false
      });
      saveState();
      renderTasks();
      document.getElementById('add-task-modal-overlay').classList.add('hidden');
      document.getElementById('task-title-input').value = '';
    });

    // Save Mistake note
    document.getElementById('save-mistake-btn').addEventListener('click', () => {
      const topic = document.getElementById('mistake-topic-input').value.trim();
      const note = document.getElementById('mistake-note-input').value.trim();

      if (!topic || !note) return alert('Ders konusu ve soru detayı gerekli');

      state.mistakes.unshift({
        id: 'mis-' + Date.now(),
        topic: topic,
        note: note,
        solved: false,
        createdAt: new Date().toISOString().split('T')[0]
      });
      saveState();
      renderMistakes();
      document.getElementById('add-mistake-modal-overlay').classList.add('hidden');
      document.getElementById('mistake-topic-input').value = '';
      document.getElementById('mistake-note-input').value = '';
    });

    // 15. Export & Import JSON
    document.getElementById('export-json-btn').addEventListener('click', exportDataAsJSON);
    document.getElementById('import-json-input').addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        importDataFromJSON(e.target.files[0]);
      }
    });
    document.getElementById('reset-data-btn').addEventListener('click', () => {
      if (confirm('Tüm ilerleme verilerini sıfırlayıp fabrika ayarlarına dönmek istediğinize emin misiniz?')) {
        state = JSON.parse(JSON.stringify(DEFAULT_STATE));
        saveState();
        initAllViews();
        alert('Veriler sıfırlandı.');
      }
    });

    // Set today's date in date inputs
    const todayStr = new Date().toISOString().split('T')[0];
    const dDate = document.getElementById('delegate-date-input');
    const tDate = document.getElementById('task-date-input');
    if (dDate) dDate.value = todayStr;
    if (tDate) tDate.value = todayStr;

    // Initialize all views
    initAllViews();
  });

})();
