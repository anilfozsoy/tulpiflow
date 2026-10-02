/* ==========================================================================
   TULPIFLOW CORE ENGINE — APP.JS (v1.1.0)
   Asymmetric Spaces (Anıl & Fadime), YKS YouTube Deep-Link Engine,
   Background Focus Shield with Media Session API, Interactive Tutorial,
   Dark/Light Mode & Real-Time Cloud Firestore Sync
   ========================================================================== */

(function () {
  'use strict';

  // =========================================================================
  // 1. CONFIGURATION, VERSIONS & AUTH CONSTANTS
  // =========================================================================
  const CURRENT_APP_VERSION = "1.3.0";
  const CURRENT_VERSION = "1.3.0";
  const AUTH_KEY = 'tulpiflow_auth_device';
  const AUTH_TOKEN_KEY = 'tulpiflow_auth_token';
  const THEME_KEY = 'tulpiflow_theme';
  const TUTORIAL_KEY = 'tulpiflow_tutorial_seen';

  const firebaseConfig = {
    apiKey: "AIzaSyDNeAHfS-x02_9MZJGkMjCPV3RavXpQtWM",
    authDomain: "tulpiflow.firebaseapp.com",
    projectId: "tulpiflow",
    storageBucket: "tulpiflow.firebasestorage.app",
    messagingSenderId: "581034287559",
    appId: "1:581034287559:web:856bd292ce9df806ee39e2",
    measurementId: "G-F0PW1TK2G6"
  };

  let db = null;
  let isFirestoreConnected = false;
  let currentAuth = null;
  let activeTab = 'fadime';
  let activeTopicCategory = 'all';
  let taskFilter = 'all';

  // Initialize Firebase App & Firestore via Compat SDK
  try {
    if (typeof firebase !== 'undefined') {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      db = firebase.firestore();
      try {
        db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
          console.warn('Firestore persistence warning:', err);
        });
      } catch (pErr) {
        console.warn('Persistence skipped:', pErr);
      }
      isFirestoreConnected = true;
    }
  } catch (err) {
    console.error('Firebase initialization error:', err);
  }

  // =========================================================================
  // 2. DEFAULT SEED STATE
  // =========================================================================
  const INITIAL_USERS = {
    fadime: {
      name: 'Fadime',
      title: 'YKS 2026 Hazırlık & Derece Adayı',
      role: 'student',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=FadimeTulpi',
      streakDays: 14,
      todayFocusMinutes: 125,
      lastAction: 'Türev: Geometrik Yorum tamamlandı',
      statusText: 'Serbest Çalışma',
      sosActive: false,
      sosTopic: '',
      sosMessage: ''
    },
    anil: {
      name: 'Anıl',
      title: 'Sistem Mimarı, Geliştirici & Mentör',
      role: 'mentor',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=AnilTech',
      streakDays: 28,
      todayFocusMinutes: 255,
      lastAction: 'DDIA LSM-Tree & WAL analiz sprinti tamamlandı',
      statusText: 'Deep Work Modu'
    }
  };

  const INITIAL_TASKS = [
    {
      id: 'task-1',
      title: 'Türev Geometrik Yorum 40 Soru Çözümü',
      assignedBy: 'anil',
      assignedTo: 'fadime',
      priority: 'high',
      date: new Date().toISOString().split('T')[0],
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-2',
      title: 'Fizik: İtme ve Çizgisel Momentum Video Analizi (VIP Fizik)',
      assignedBy: 'anil',
      assignedTo: 'fadime',
      priority: 'high',
      date: new Date().toISOString().split('T')[0],
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-3',
      title: 'Kimya: Organik Kimya Fonksiyonel Gruplar Tekrarı',
      assignedBy: 'fadime',
      assignedTo: 'fadime',
      priority: 'medium',
      date: new Date().toISOString().split('T')[0],
      completed: true,
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-4',
      title: 'DDIA LSM-Tree Compaction & Write Amplification Analizi',
      assignedBy: 'anil',
      assignedTo: 'anil',
      priority: 'high',
      date: new Date().toISOString().split('T')[0],
      completed: true,
      createdAt: new Date().toISOString()
    }
  ];

  const INITIAL_SPRINTS = [
    { id: 'sp-1', text: 'DDIA Storage Engine & LSM-Tree Compaction Notları', done: true },
    { id: 'sp-2', text: 'TulpiFlow Asymmetric Synchronization Protokolü', done: true },
    { id: 'sp-3', text: 'Linear Algebra: Eigenvalues & PCA Implementasyonu', done: false },
    { id: 'sp-4', text: 'Media Session API & Android Background Audio Shield', done: true }
  ];

  const INITIAL_MISTAKES = [
    {
      id: 'mis-1',
      topic: 'AYT Matematik - Türev',
      note: 'Teğet doğrusunun eğimi türeve eşit olduğu halde dik teğet eğimi m1*m2=-1 kuralında işaret hatası yapıldı.',
      solved: false,
      createdAt: new Date().toISOString().split('T')[0]
    },
    {
      id: 'mis-2',
      topic: 'Geometri - Çemberde Açı',
      note: 'Teğet-kiriş açı ile çevre açı arasındaki bağıntı sorusunda merkez açı karıştırıldı.',
      solved: true,
      createdAt: new Date().toISOString().split('T')[0]
    }
  ];

  // In-memory active state
  let state = {
    users: JSON.parse(JSON.stringify(INITIAL_USERS)),
    topicTree: (typeof YKS_CURRICULUM !== 'undefined') ? JSON.parse(JSON.stringify(YKS_CURRICULUM)) : [],
    tasks: JSON.parse(JSON.stringify(INITIAL_TASKS)),
    anilSprints: JSON.parse(JSON.stringify(INITIAL_SPRINTS)),
    mistakes: JSON.parse(JSON.stringify(INITIAL_MISTAKES)),
    pomodoro: {
      mode: '25-5',
      durationMinutes: 25,
      remainingSeconds: 25 * 60,
      isRunning: false,
      intervalId: null
    }
  };

  // =========================================================================
  // 3. THEME ENGINE (DARK & LIGHT MODE)
  // =========================================================================
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
    applyTheme(savedTheme);

    const toggleBtn = document.getElementById('theme-toggle-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
      });
    }
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);

    const moonIcon = document.getElementById('theme-icon-moon');
    const sunIcon = document.getElementById('theme-icon-sun');

    if (moonIcon && sunIcon) {
      if (theme === 'light') {
        moonIcon.classList.add('hidden');
        sunIcon.classList.remove('hidden');
      } else {
        moonIcon.classList.remove('hidden');
        sunIcon.classList.add('hidden');
      }
    }
  }

  // =========================================================================
  // 4. AUTHENTICATION & ASYMMETRIC LIFECYCLE
  // =========================================================================
  function checkDeviceAuth() {
    let savedAuth = localStorage.getItem(AUTH_KEY);
    let savedToken = localStorage.getItem(AUTH_TOKEN_KEY);

    // Multi-layer fallback: check cookie if localStorage was cleared
    
    // Capacitor Preferences native support
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Preferences) {
      window.Capacitor.Plugins.Preferences.get({ key: AUTH_KEY }).then(res => {
        if (res && res.value && !savedAuth) {
          try {
            savedAuth = res.value;
            savedToken = 'cap-persisted-token';
            localStorage.setItem(AUTH_KEY, savedAuth);
            localStorage.setItem(AUTH_TOKEN_KEY, savedToken);
          } catch(e) {}
        }
      }).catch(() => {});
    }

    if (!savedAuth && document.cookie) {
      const match = document.cookie.match(new RegExp('(^| )' + AUTH_KEY + '=([^;]+)'));
      if (match) {
        try {
          savedAuth = decodeURIComponent(match[2]);
          savedToken = 'cookie-persisted-token';
          localStorage.setItem(AUTH_KEY, savedAuth);
          localStorage.setItem(AUTH_TOKEN_KEY, savedToken);
        } catch(e) {}
      }
    }

    if (savedAuth && savedToken) {
      try {
        currentAuth = JSON.parse(savedAuth);
        applyUserRole(currentAuth.role);
        // Direct entry: passcode screen NEVER appears again
        const authOverlay = document.getElementById('auth-modal-overlay');
        if (authOverlay) authOverlay.classList.add('hidden');
        return;
      } catch (e) {
        console.warn('Auth token corrupt, prompting login.');
      }
    }

    // First time open: show clean minimalist passcode modal
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
    } else if (fadimeKeys.includes(cleanCode)) {
      currentAuth = {
        role: 'fadime',
        name: 'Fadime',
        title: 'YKS 2026 Adayı',
        token: 'auth-token-fadime-' + Date.now(),
        unlockedAt: new Date().toISOString()
      };
    } else {
      if (errorEl) {
        errorEl.classList.remove('hidden');
        errorEl.textContent = 'Geçersiz şifre. Lütfen tekrar deneyin.';
      }
      return;
    }

    // Persist securely to device (localStorage + Cookie for persistent survival)
    localStorage.setItem(AUTH_KEY, JSON.stringify(currentAuth));
    localStorage.setItem(AUTH_TOKEN_KEY, currentAuth.token);

    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Preferences) {
      window.Capacitor.Plugins.Preferences.set({ key: AUTH_KEY, value: JSON.stringify(currentAuth) }).catch(() => {});
    }

    try {
      document.cookie = `${AUTH_KEY}=${encodeURIComponent(JSON.stringify(currentAuth))}; max-age=315360000; path=/`;
    } catch(e) {}

    const authOverlay = document.getElementById('auth-modal-overlay');
    if (authOverlay) authOverlay.classList.add('hidden');

    // Trigger WOW splash on first unlocking
    launchWowSplash();

    applyUserRole(currentAuth.role);

    // If first time, trigger interactive tutorial
    if (!localStorage.getItem(TUTORIAL_KEY)) {
      setTimeout(() => {
        startTutorial();
      }, 2000);
    }
  }

  function applyUserRole(role) {
    const user = state.users[role] || INITIAL_USERS[role];

    // Update Header Avatar & Dropdown
    const avatarImg = document.getElementById('user-avatar-img');
    const dropName = document.getElementById('dropdown-user-name');
    const dropRole = document.getElementById('dropdown-user-role');

    if (avatarImg) avatarImg.src = user.avatar;
    if (dropName) dropName.textContent = user.name;
    if (dropRole) dropRole.textContent = user.title;

    // Render Role-specific Nav Tabs & Bottom Navigation
    renderRoleNavigation(role);

    // Show appropriate asymmetric workspace pane
    if (role === 'fadime') {
      switchTab('fadime');
    } else {
      switchTab('anil');
    }
  }

  function renderRoleNavigation(role) {
    const navTabs = document.getElementById('main-nav-tabs');
    const bottomBar = document.getElementById('mobile-bottom-bar');

    if (role === 'fadime') {
      // Fadime Navigation
      if (navTabs) {
        navTabs.innerHTML = `
          <button class="nav-tab active" data-tab="fadime" role="tab">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>YKS Odak & Pomodoro</span>
          </button>
          <button class="nav-tab" data-tab="calendar" role="tab">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span>Ortak Takvim</span>
          </button>
          <button class="nav-tab" data-tab="analytics" role="tab">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            <span>Isı Haritası</span>
          </button>
        `;
      }

      if (bottomBar) {
        bottomBar.innerHTML = `
          <button class="m-nav-btn active" data-tab="fadime" data-subtab="focus">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span class="m-label">Odak</span>
          </button>
          <button class="m-nav-btn" data-tab="fadime" data-subtab="curriculum">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            <span class="m-label">Müfredat</span>
          </button>
          <button class="m-nav-btn" data-tab="fadime" data-subtab="tasks-notes">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
            <span class="m-label">Koç & Not</span>
          </button>
          <button class="m-nav-btn" data-tab="calendar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span class="m-label">Takvim</span>
          </button>
          <button class="m-nav-btn" data-tab="analytics">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            <span class="m-label">Isı Haritası</span>
          </button>
        `;
      }
    } else {
      // Anıl Navigation
      if (navTabs) {
        navTabs.innerHTML = `
          <button class="nav-tab active" data-tab="anil" role="tab">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
            <span>Mentör & Derin Çalışma</span>
          </button>
          <button class="nav-tab" data-tab="fadime" role="tab">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            <span>Fadime'nin Alanı (İzleme)</span>
          </button>
          <button class="nav-tab" data-tab="calendar" role="tab">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span>Ortak Takvim</span>
          </button>
          <button class="nav-tab" data-tab="analytics" role="tab">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            <span>Isı Haritası</span>
          </button>
        `;
      }

      if (bottomBar) {
        bottomBar.innerHTML = `
          <button class="m-nav-btn active" data-tab="anil">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
            <span class="m-label">Mentör</span>
          </button>
          <button class="m-nav-btn" data-tab="fadime">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            <span class="m-label">Fadime</span>
          </button>
          <button class="m-nav-btn" data-tab="calendar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span class="m-label">Takvim</span>
          </button>
          <button class="m-nav-btn" data-tab="analytics">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
            <span class="m-label">Isı Haritası</span>
          </button>
        `;
      }
    }

    // Reattach click events to tabs
    document.querySelectorAll('.nav-tab, .m-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        const sub = btn.getAttribute('data-subtab');
        if (tab) switchTab(tab, sub);
      });
    });
  }

  let activeSubtab = 'focus';

  function switchSubtab(subtabId) {
    activeSubtab = subtabId;
    document.querySelectorAll('.ws-seg-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-subtab') === subtabId);
    });
    document.querySelectorAll('#pane-fadime .subpane').forEach(pane => {
      pane.classList.toggle('hidden', pane.id !== `subpane-${subtabId}`);
      pane.classList.toggle('active', pane.id === `subpane-${subtabId}`);
    });
    document.querySelectorAll('.m-nav-btn[data-subtab]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-subtab') === subtabId);
    });
  }

  function switchTab(tabId, subtabId) {
    activeTab = tabId;
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-tab, .m-nav-btn').forEach(b => b.classList.remove('active'));

    const targetPane = document.getElementById('pane-' + tabId);
    if (targetPane) targetPane.classList.add('active');

    if (tabId === 'fadime' && subtabId) {
      switchSubtab(subtabId);
    }

    document.querySelectorAll(`[data-tab="${tabId}"]`).forEach(b => {
      if (subtabId && b.hasAttribute('data-subtab')) {
        if (b.getAttribute('data-subtab') === subtabId) b.classList.add('active');
      } else if (!subtabId) {
        b.classList.add('active');
      }
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // =========================================================================
  // 5. CLOUD FIRESTORE SYNCHRONIZATION
  // =========================================================================
  function initFirestoreSync() {
    if (!db) {
      updateNetworkIndicator(false);
      return;
    }

    updateNetworkIndicator(true);

    // 1. Listen to 'tulpiflow_users'
    db.collection('tulpiflow_users').doc('fadime').onSnapshot((doc) => {
      if (doc.exists) {
        state.users.fadime = Object.assign({}, state.users.fadime, doc.data());
        renderSosBanner();
        updateStudentOverview();
      } else {
        db.collection('tulpiflow_users').doc('fadime').set(INITIAL_USERS.fadime);
      }
    }, (err) => console.warn('Fadime user snapshot error:', err));

    db.collection('tulpiflow_users').doc('anil').onSnapshot((doc) => {
      if (doc.exists) {
        state.users.anil = Object.assign({}, state.users.anil, doc.data());
        updateMentorPresenceBanner();
      } else {
        db.collection('tulpiflow_users').doc('anil').set(INITIAL_USERS.anil);
      }
    }, (err) => console.warn('Anil user snapshot error:', err));

    // 2. Listen to 'tasks'
    db.collection('tasks').onSnapshot((snapshot) => {
      if (!snapshot.empty) {
        const loadedTasks = [];
        snapshot.forEach((doc) => {
          loadedTasks.push(Object.assign({ id: doc.id }, doc.data()));
        });
        state.tasks = loadedTasks;
        renderTasks();
        renderCoachTasks();
      } else {
        INITIAL_TASKS.forEach((t) => {
          db.collection('tasks').doc(t.id).set(t);
        });
      }
    }, (err) => console.warn('Tasks snapshot error:', err));

    // 3. Listen to 'app_data' (Curriculum & Mistakes & Sprints)
    db.collection('app_data').doc('curriculum').onSnapshot((doc) => {
      if (doc.exists && doc.data().topicTree && doc.data().topicTree.length > 0) {
        const cloudTree = doc.data().topicTree;
        if (typeof YKS_CURRICULUM !== 'undefined') {
          const completedMap = {};
          cloudTree.forEach(top => {
            (top.subtopics || []).forEach(sub => {
              if (sub.completed) completedMap[sub.id] = true;
            });
          });
          const mergedTree = JSON.parse(JSON.stringify(YKS_CURRICULUM));
          mergedTree.forEach(top => {
            (top.subtopics || []).forEach(sub => {
              if (completedMap[sub.id]) sub.completed = true;
            });
          });
          state.topicTree = mergedTree;
        } else {
          state.topicTree = cloudTree;
        }
        renderTopicTree();
        updateStudentOverview();
      } else {
        if (typeof YKS_CURRICULUM !== 'undefined') {
          db.collection('app_data').doc('curriculum').set({ topicTree: YKS_CURRICULUM, version: "1.2.0" });
        }
      }
    }, (err) => console.warn('Curriculum snapshot error:', err));

    db.collection('app_data').doc('mistakes').onSnapshot((doc) => {
      if (doc.exists && doc.data().list) {
        state.mistakes = doc.data().list;
        renderMistakes();
      } else {
        db.collection('app_data').doc('mistakes').set({ list: INITIAL_MISTAKES });
      }
    }, (err) => console.warn('Mistakes snapshot error:', err));

    db.collection('app_data').doc('sprints').onSnapshot((doc) => {
      if (doc.exists && doc.data().list) {
        state.anilSprints = doc.data().list;
        renderAnilSprints();
      } else {
        db.collection('app_data').doc('sprints').set({ list: INITIAL_SPRINTS });
      }
    }, (err) => console.warn('Sprints snapshot error:', err));

    // 4. In-App Update Engine: Check app_config/version
    checkAppVersion();
  }

  function updateNetworkIndicator(online) {
    const dot = document.getElementById('network-status-dot');
    if (!dot) return;
    if (online) {
      dot.style.background = '#10b981';
      dot.style.boxShadow = '0 0 8px #10b981';
      dot.title = 'Cloud Firestore (Canlı)';
    } else {
      dot.style.background = '#f59e0b';
      dot.style.boxShadow = '0 0 8px #f59e0b';
      dot.title = 'Yerel Mod (Bağlantı Bekleniyor)';
    }
  }

  function syncUserToFirestore(role) {
    if (db && state.users[role]) {
      db.collection('tulpiflow_users').doc(role).set(state.users[role], { merge: true }).catch(err => {
        console.warn('User sync error:', err);
      });
    }
  }

  function syncCurriculumToFirestore() {
    if (db) {
      db.collection('app_data').doc('curriculum').set({ topicTree: state.topicTree }, { merge: true }).catch(err => {
        console.warn('Curriculum sync error:', err);
      });
    }
  }

  function syncMistakesToFirestore() {
    if (db) {
      db.collection('app_data').doc('mistakes').set({ list: state.mistakes }, { merge: true }).catch(err => {
        console.warn('Mistakes sync error:', err);
      });
    }
  }

  function syncSprintsToFirestore() {
    if (db) {
      db.collection('app_data').doc('sprints').set({ list: state.anilSprints }, { merge: true }).catch(err => {
        console.warn('Sprints sync error:', err);
      });
    }
  }

  // =========================================================================
  // 6. IN-APP UPDATE ENGINE (FIRESTORE app_config/version)
  // =========================================================================
  function isNewerVersion(latest, current) {
    if (!latest || !current) return false;
    const lParts = String(latest).replace(/^v/i, '').split('.').map(n => parseInt(n, 10) || 0);
    const cParts = String(current).replace(/^v/i, '').split('.').map(n => parseInt(n, 10) || 0);
    const maxLen = Math.max(lParts.length, cParts.length);
    for (let i = 0; i < maxLen; i++) {
      const l = lParts[i] || 0;
      const c = cParts[i] || 0;
      if (l > c) return true;
      if (l < c) return false;
    }
    return false;
  }

  function checkAppVersion() {
    if (!db) return;

    db.collection('app_config').doc('version').onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data();
        const latestVersion = data.latest_version || data.version || "1.2.0";
        const changelog = data.changelog || [
          "Eksiksiz 2026-2027 MEB/ÖSYM YKS Müfredatı (TYT + AYT Sayısal tüm dersler) entegre edildi.",
          "Tüm ders ve konulara en popüler YouTube hocalarının doğrudan ders bağlantıları bağlandı.",
          "Arayüz taşma hataları ve tasarım standartları optimize edildi.",
          "Arka plan Focus Shield ses kontrolleri iyileştirildi."
        ];
        const downloadUrl = data.apk_download_url || data.download_url || "https://github.com/anilfozsoy/tulpiflow/releases/latest/download/TulpiFlow.apk";

        if (isNewerVersion(latestVersion, CURRENT_VERSION)) {
          showUpdateModal(latestVersion, changelog, downloadUrl);
        }
      } else {
        const initialConfig = {
          version: "1.2.0",
          latest_version: "1.2.0",
          release_date: "2026-10-02",
          apk_download_url: "https://github.com/anilfozsoy/tulpiflow/releases/latest/download/TulpiFlow.apk",
          download_url: "https://github.com/anilfozsoy/tulpiflow/releases/latest/download/TulpiFlow.apk",
          changelog: [
            "Eksiksiz 2026-2027 MEB/ÖSYM YKS Müfredatı (TYT + AYT Sayısal tüm dersler) entegre edildi.",
            "Tüm ders ve konulara en popüler YouTube hocalarının doğrudan ders bağlantıları bağlandı.",
            "Arayüz taşma hataları ve tasarım standartları optimize edildi.",
            "Arka plan Focus Shield ses kontrolleri iyileştirildi."
          ],
          force_update: false
        };
        db.collection('app_config').doc('version').set(initialConfig).catch(err => {
          console.warn('Initial app_config seed error:', err);
        });
      }
    }, (error) => {
      console.warn('App version check error:', error);
    });
  }

function downloadAndInstallApk(downloadUrl) {
    const progressWrap = document.getElementById('update-download-progress-wrap');
    const progressStatus = document.getElementById('update-progress-status');
    const progressPercent = document.getElementById('update-progress-percent');
    const progressFill = document.getElementById('update-progress-fill');
    const progressSubtext = document.getElementById('update-progress-subtext');
    const actionsWrap = document.getElementById('update-actions-wrap');

    if (progressWrap) progressWrap.classList.remove('hidden');
    if (actionsWrap) actionsWrap.classList.add('hidden');

    const targetUrl = downloadUrl || "https://github.com/anilfozsoy/tulpiflow/releases/latest/download/TulpiFlow.apk";

    const xhr = new XMLHttpRequest();
    xhr.open('GET', targetUrl, true);
    xhr.responseType = 'blob';

    xhr.onprogress = (e) => {
      if (e.lengthComputable && e.total > 0) {
        const pct = Math.min(100, Math.round((e.loaded / e.total) * 100));
        if (progressPercent) progressPercent.textContent = `%${pct}`;
        if (progressFill) progressFill.style.width = `${pct}%`;
        const mbLoaded = (e.loaded / (1024 * 1024)).toFixed(1);
        const mbTotal = (e.total / (1024 * 1024)).toFixed(1);
        if (progressSubtext) progressSubtext.textContent = `${mbLoaded} MB / ${mbTotal} MB indirildi`;
      } else {
        const mbLoaded = (e.loaded / (1024 * 1024)).toFixed(1);
        if (progressPercent) progressPercent.textContent = `İndiriliyor...`;
        if (progressFill) progressFill.style.width = `80%`;
        if (progressSubtext) progressSubtext.textContent = `${mbLoaded} MB aktarıldı`;
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200 || xhr.status === 206) {
        if (progressStatus) progressStatus.textContent = "İndirme Tamamlandı! Paket Yükleyici Başlatılıyor...";
        if (progressPercent) progressPercent.textContent = "%100";
        if (progressFill) progressFill.style.width = "100%";
        if (progressSubtext) progressSubtext.textContent = "Android Paket Yükleyici açılıyor...";

        const blob = xhr.response;
        try {
          const blobUrl = window.URL.createObjectURL(new Blob([blob], { type: 'application/vnd.android.package-archive' }));
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = blobUrl;
          a.download = 'TulpiFlow.apk';
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(blobUrl);
          }, 1500);
        } catch (blobErr) {
          console.warn('Blob installer fallback:', blobErr);
          window.location.href = targetUrl;
        }
      } else {
        if (progressStatus) progressStatus.textContent = "Doğrudan İndirme Başlatılıyor...";
        if (progressSubtext) progressSubtext.textContent = "Tarayıcı ile indiriliyor...";
        window.location.href = targetUrl;
      }
    };

    xhr.onerror = () => {
      if (progressStatus) progressStatus.textContent = "Doğrudan İndirme Başlatılıyor...";
      if (progressSubtext) progressSubtext.textContent = "Alternatif indirme rotasına yönlendiriliyor...";
      window.location.href = targetUrl;
    };

    xhr.send();
  }

  function showUpdateModal(latestVersion, changelog, downloadUrl) {
    const overlay = document.getElementById('update-modal-overlay');
    const versionLabel = document.getElementById('update-version-label');
    const list = document.getElementById('update-changelog-list');
    const downloadBtn = document.getElementById('update-download-btn');
    const laterBtn = document.getElementById('update-later-btn');
    const progressWrap = document.getElementById('update-download-progress-wrap');
    const actionsWrap = document.getElementById('update-actions-wrap');

    if (!overlay) return;

    if (versionLabel) versionLabel.textContent = `v${latestVersion} Hazır`;
    if (progressWrap) progressWrap.classList.add('hidden');
    if (actionsWrap) actionsWrap.classList.remove('hidden');

    if (list && Array.isArray(changelog)) {
      list.innerHTML = '';
      changelog.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = item;
        list.appendChild(li);
      });
    }

    if (downloadBtn) {
      downloadBtn.onclick = (e) => {
        e.preventDefault();
        downloadAndInstallApk(downloadUrl);
      };
    }

    if (laterBtn) {
      laterBtn.onclick = () => {
        overlay.classList.add('hidden');
      };
    }

    overlay.classList.remove('hidden');
  }

  // =========================================================================
  // 7. BACKGROUND AUDIO FOCUS SHIELD & MEDIA SESSION API
  // =========================================================================
  let audioCtx = null;
  let ambientNoiseSource = null;
  let ambientGainNode = null;
  let isAmbientPlaying = false;
  let backgroundSilentAudio = null;

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

  function initSilentAudioTrick() {
    if (!backgroundSilentAudio) {
      // 1-second silent WAV base64 loop to keep mobile media session active in background
      backgroundSilentAudio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
      backgroundSilentAudio.loop = true;
    }
  }

  function setupMediaSession() {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: 'TulpiFlow Odak Modu: Yağmur & Pembe Gürültü',
        artist: 'TulpiFlow Cognitive Engine',
        album: 'YKS 2026 & Deep Work',
        artwork: [
          { src: 'https://api.dicebear.com/7.x/bottts/svg?seed=TulpiSound', sizes: '512x512', type: 'image/svg+xml' }
        ]
      });

      navigator.mediaSession.setActionHandler('play', () => { toggleFocusShield(true); });
      navigator.mediaSession.setActionHandler('pause', () => { toggleFocusShield(false); });
      navigator.mediaSession.setActionHandler('stop', () => { toggleFocusShield(false); });
    }
  }

  function toggleFocusShield(forceState) {
    const btn = document.getElementById('ambient-sound-toggle');
    const shouldPlay = (typeof forceState === 'boolean') ? forceState : !isAmbientPlaying;

    if (!shouldPlay) {
      // Stop Audio
      if (ambientGainNode && audioCtx) {
        ambientGainNode.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
        setTimeout(() => {
          if (ambientNoiseSource) {
            try { ambientNoiseSource.stop(); } catch (e) {}
            ambientNoiseSource = null;
          }
          isAmbientPlaying = false;
          if (btn) btn.classList.remove('playing');
          if (backgroundSilentAudio) backgroundSilentAudio.pause();
        }, 500);
      }
    } else {
      // Start Pink Noise & Rain Filter
      try {
        const ctx = getAudioContext();
        initSilentAudioTrick();
        backgroundSilentAudio.play().catch(() => {});

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
          output[i] *= 0.11;
          b6 = white * 0.115926;
        }

        ambientNoiseSource = ctx.createBufferSource();
        ambientNoiseSource.buffer = noiseBuffer;
        ambientNoiseSource.loop = true;

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
        if (btn) btn.classList.add('playing');

        setupMediaSession();
      } catch (e) {
        console.warn('Focus Shield başlatılamadı:', e);
      }
    }
  }

  function playGongTone() {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.5);
    } catch (e) {}
  }

  // =========================================================================
  // 8. CIRCULAR PROGRESS POMODORO ENGINE
  // =========================================================================
  const CIRCLE_CIRCUMFERENCE = 552.92; // 2 * PI * 88

  function setTimerMode(mode) {
    state.pomodoro.mode = mode;
    document.querySelectorAll('.seg-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
    });

    if (mode === '25-5') {
      state.pomodoro.durationMinutes = 25;
      state.pomodoro.remainingSeconds = 25 * 60;
      document.getElementById('timer-mode-label').textContent = 'STANDART POMODORO (25 DK)';
    } else if (mode === '50-10') {
      state.pomodoro.durationMinutes = 50;
      state.pomodoro.remainingSeconds = 50 * 60;
      document.getElementById('timer-mode-label').textContent = 'UZUN SEANS (50 DK)';
    } else if (mode === 'deepwork') {
      state.pomodoro.durationMinutes = 90;
      state.pomodoro.remainingSeconds = 90 * 60;
      document.getElementById('timer-mode-label').textContent = 'DEEP WORK (90 DK)';
    }

    resetTimer();
  }

  function startPauseTimer() {
    const btn = document.getElementById('timer-start-pause-btn');
    if (state.pomodoro.isRunning) {
      clearInterval(state.pomodoro.intervalId);
      state.pomodoro.isRunning = false;
      btn.textContent = 'Devam Et ▷';
    } else {
      state.pomodoro.isRunning = true;
      btn.textContent = 'Duraklat ⏸';
      state.pomodoro.intervalId = setInterval(() => {
        if (state.pomodoro.remainingSeconds > 0) {
          state.pomodoro.remainingSeconds--;
          updateTimerDisplay();
        } else {
          clearInterval(state.pomodoro.intervalId);
          state.pomodoro.isRunning = false;
          btn.textContent = 'Başlat ▷';
          playGongTone();
          triggerConfetti();
          alert('Tebrikler! Odaklanma seansını başarıyla tamamladın.');

          // Record focus minutes in state and Firestore
          if (currentAuth && currentAuth.role === 'fadime') {
            state.users.fadime.todayFocusMinutes += state.pomodoro.durationMinutes;
            syncUserToFirestore('fadime');
            updateStudentOverview();
          }
        }
      }, 1000);
    }
  }

  function resetTimer() {
    if (state.pomodoro.intervalId) clearInterval(state.pomodoro.intervalId);
    state.pomodoro.isRunning = false;
    document.getElementById('timer-start-pause-btn').textContent = 'Başlat ▷';

    if (state.pomodoro.mode === '25-5') state.pomodoro.remainingSeconds = 25 * 60;
    else if (state.pomodoro.mode === '50-10') state.pomodoro.remainingSeconds = 50 * 60;
    else state.pomodoro.remainingSeconds = 90 * 60;

    updateTimerDisplay();
  }

  function updateTimerDisplay() {
    const mins = Math.floor(state.pomodoro.remainingSeconds / 60);
    const secs = state.pomodoro.remainingSeconds % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const digitsEl = document.getElementById('timer-digits');
    if (digitsEl) digitsEl.textContent = formatted;

    const ring = document.getElementById('timer-progress-ring');
    if (ring) {
      const totalSeconds = state.pomodoro.durationMinutes * 60;
      const progressRatio = (totalSeconds - state.pomodoro.remainingSeconds) / totalSeconds;
      const offset = CIRCLE_CIRCUMFERENCE - (progressRatio * CIRCLE_CIRCUMFERENCE);
      ring.style.strokeDashoffset = offset;
    }
  }

  // =========================================================================
  // 9. YKS MÜFREDATI & YOUTUBE DEEP-LINKING MOTORU
  // =========================================================================
  // =========================================================================
  // 9. YKS MÜFREDATI & YOUTUBE DEEP-LINKING AKORDEON MOTORU
  // =========================================================================
  const SUBJECTS_METADATA = [
    { id: 'tyt-turkce', name: 'TYT Türkçe', icon: '📖', desc: '40 Soru • Rüştü Hoca & Kadir Gümüş' },
    { id: 'tyt-sosyal', name: 'TYT Sosyal Bilimler', icon: '🌍', desc: '20 Soru • Tarih, Coğrafya, Felsefe, Din' },
    { id: 'tyt-matematik', name: 'TYT Temel Matematik & Geo', icon: '📐', desc: '40 Soru • Eyüp B., Mert Hoca, Kenan Kara' },
    { id: 'tyt-fen', name: 'TYT Fen Bilimleri', icon: '⚛️', desc: '20 Soru • VIP Fizik, Görkem Şahin, Dr. Biyoloji' },
    { id: 'ayt-matematik', name: 'AYT İleri Matematik & Geo', icon: '📈', desc: '40 Soru • Eyüp B., Mert Hoca, Kenan Kara' },
    { id: 'ayt-fizik', name: 'AYT İleri Fizik', icon: '⚡', desc: '14 Soru • VIP Fizik, Altuğ Güneş, Özcan Aykın' },
    { id: 'ayt-kimya', name: 'AYT İleri Kimya', icon: '🧪', desc: '13 Soru • Görkem Şahin, Kimya Adası' },
    { id: 'ayt-biyoloji', name: 'AYT İleri Biyoloji', icon: '🧬', desc: '13 Soru • Dr. Biyoloji, Selin Hoca, Biosem' }
  ];

  let expandedAccordionCategories = new Set(['ayt-matematik', 'tyt-matematik']);

  function openYouTube(query, explicitIntent, explicitWeb) {
    if (!query && !explicitIntent && !explicitWeb) return;
    const cleanQuery = encodeURIComponent(query || '');
    const intentUrl = explicitIntent || `vnd.youtube://results?q=${cleanQuery}`;
    const webUrl = explicitWeb || `https://www.youtube.com/results?search_query=${cleanQuery}`;

    // On mobile / Android webview (Capacitor), try intent first, fallback to browser
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      try {
        window.location.href = intentUrl;
        setTimeout(() => {
          window.open(webUrl, '_blank');
        }, 750);
      } catch (e) {
        window.open(webUrl, '_blank');
      }
    } else {
      window.open(webUrl, '_blank');
    }
  }

  function renderTopicTree() {
    const container = document.getElementById('topic-cards-container');
    if (!container) return;
    container.innerHTML = '';

    let totalSubtopics = 0;
    let completedSubtopics = 0;

    state.topicTree.forEach(top => {
      (top.subtopics || []).forEach(sub => {
        totalSubtopics++;
        if (sub.completed) completedSubtopics++;
      });
    });

    const percent = totalSubtopics > 0 ? Math.round((completedSubtopics / totalSubtopics) * 100) : 0;
    const percentLabel = document.getElementById('topic-percentage-label');
    const fillBar = document.getElementById('topic-progress-fill');
    if (percentLabel) percentLabel.textContent = `%${percent}`;
    if (fillBar) fillBar.style.width = `${percent}%`;

    const visibleSubjects = SUBJECTS_METADATA.filter(subj => {
      if (activeTopicCategory === 'all') return true;
      return subj.id === activeTopicCategory;
    });

    visibleSubjects.forEach(subj => {
      const subjectTopics = state.topicTree.filter(t => t.category === subj.id);
      if (subjectTopics.length === 0) return;

      let sTotal = 0;
      let sCompleted = 0;
      subjectTopics.forEach(t => {
        (t.subtopics || []).forEach(s => {
          sTotal++;
          if (s.completed) sCompleted++;
        });
      });
      const sPercent = sTotal > 0 ? Math.round((sCompleted / sTotal) * 100) : 0;
      const isExpanded = (activeTopicCategory !== 'all' && activeTopicCategory === subj.id) || expandedAccordionCategories.has(subj.id);

      const accordionItem = document.createElement('div');
      accordionItem.className = `accordion-item ${isExpanded ? 'active' : ''}`;
      accordionItem.setAttribute('data-accordion-cat', subj.id);

      let cardsHtml = '';
      subjectTopics.forEach(topic => {
        const defaultTeacher = topic.teachers && topic.teachers[0] ? topic.teachers[0] : null;
        const defaultQuery = defaultTeacher ? defaultTeacher.query : `${topic.title} YKS`;
        const defaultIntent = defaultTeacher && defaultTeacher.intentUrl ? defaultTeacher.intentUrl : `vnd.youtube://results?q=${encodeURIComponent(defaultQuery)}`;
        const defaultWeb = defaultTeacher && defaultTeacher.webUrl ? defaultTeacher.webUrl : `https://www.youtube.com/results?search_query=${encodeURIComponent(defaultQuery)}`;

        let subtopicsHtml = '';
        (topic.subtopics || []).forEach(sub => {
          const subIntent = sub.intentUrl || '';
          const subWeb = sub.webUrl || '';
          const subQuery = sub.query || `${sub.title} YKS`;
          subtopicsHtml += `
            <div class="subtopic-row">
              <label class="subtopic-item ${sub.completed ? 'completed' : ''}" data-sub-id="${sub.id}">
                <input type="checkbox" ${sub.completed ? 'checked' : ''} data-subtopic-check="${sub.id}">
                <span>${sub.title}</span>
              </label>
              <button class="subtopic-yt-btn" data-yt-query="${subQuery}" data-yt-intent="${subIntent}" data-yt-web="${subWeb}" title="${sub.title} YouTube Dersi">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </button>
            </div>
          `;
        });

        let teacherChipsHtml = '';
        (topic.teachers || []).forEach(tch => {
          teacherChipsHtml += `
            <span class="teacher-chip" data-yt-query="${tch.query}" data-yt-intent="${tch.intentUrl || ''}" data-yt-web="${tch.webUrl || ''}">▶ ${tch.name}</span>
          `;
        });

        cardsHtml += `
          <div class="topic-card">
            <div class="topic-header-row">
              <div class="topic-title-wrap">
                <span class="topic-category-badge">${topic.categoryLabel || subj.name}</span>
                <h4>${topic.title}</h4>
              </div>
              <button class="yt-btn" data-yt-query="${defaultQuery}" data-yt-intent="${defaultIntent}" data-yt-web="${defaultWeb}" title="YouTube Dersi İzle">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                <span>İzle</span>
              </button>
            </div>
            <div class="subtopics-list">
              ${subtopicsHtml}
            </div>
            ${teacherChipsHtml ? `<div class="teacher-chips">${teacherChipsHtml}</div>` : ''}
          </div>
        `;
      });

      accordionItem.innerHTML = `
        <button class="accordion-header" data-accordion-toggle="${subj.id}">
          <div class="accordion-header-left">
            <span class="subject-icon">${subj.icon}</span>
            <div>
              <span class="subject-title">${subj.name}</span>
              <span class="subject-subtitle">${subjectTopics.length} Ünite • ${sCompleted}/${sTotal} Kazanım</span>
            </div>
          </div>
          <div class="accordion-header-right">
            <span class="accordion-progress-badge ${sPercent === 100 ? 'done' : ''}">%${sPercent}</span>
            <svg class="accordion-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </button>
        <div class="accordion-body">
          <div class="topic-cards-grid">
            ${cardsHtml}
          </div>
        </div>
      `;

      container.appendChild(accordionItem);
    });

    // Accordion Toggle handlers
    container.querySelectorAll('[data-accordion-toggle]').forEach(header => {
      header.addEventListener('click', (e) => {
        e.stopPropagation();
        const cat = header.getAttribute('data-accordion-toggle');
        if (expandedAccordionCategories.has(cat)) {
          expandedAccordionCategories.delete(cat);
        } else {
          expandedAccordionCategories.add(cat);
        }
        renderTopicTree();
      });
    });

    // Subtopic Checkbox handlers
    container.querySelectorAll('[data-subtopic-check]').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const subId = e.target.getAttribute('data-subtopic-check');
        toggleSubtopicCompleted(subId, e.target.checked);
      });
    });

    // YouTube Deep-link handlers
    container.querySelectorAll('[data-yt-query]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const q = btn.getAttribute('data-yt-query');
        const intent = btn.getAttribute('data-yt-intent');
        const web = btn.getAttribute('data-yt-web');
        openYouTube(q, intent, web);
      });
    });
  }

  function toggleSubtopicCompleted(subId, isDone) {
    let changedTitle = '';
    state.topicTree.forEach(top => {
      (top.subtopics || []).forEach(sub => {
        if (sub.id === subId) {
          sub.completed = isDone;
          changedTitle = sub.title;
        }
      });
    });

    syncCurriculumToFirestore();
    renderTopicTree();

    if (isDone) {
      triggerConfetti();
      showCelebrationModal('Tebrikler Fadime!', `"${changedTitle}" konusunu başarıyla tamamladın. Derece hedefine kararlılıkla ilerliyorsun.`);
    }
  }

  // =========================================================================
  // 10. COACH TASKS (⭐ ANIL'DAN GELEN GÖREVLER)
  // =========================================================================
  function renderCoachTasks() {
    const listEl = document.getElementById('fadime-coach-tasks-list');
    const badgeEl = document.getElementById('coach-task-count-badge');
    if (!listEl) return;

    const coachTasks = state.tasks.filter(t => t.assignedTo === 'fadime');
    const pendingCount = coachTasks.filter(t => !t.completed).length;

    if (badgeEl) badgeEl.textContent = `${pendingCount} Bekleyen`;

    if (coachTasks.length === 0) {
      listEl.innerHTML = `<div class="text-muted" style="font-size: 0.8rem; padding: 8px 0;">Şu an atanmış aktif koç görevi bulunmuyor.</div>`;
      return;
    }

    listEl.innerHTML = '';
    coachTasks.forEach(t => {
      const item = document.createElement('div');
      item.className = `coach-task-item ${t.completed ? 'completed' : ''}`;
      item.innerHTML = `
        <div class="coach-task-left">
          <input type="checkbox" ${t.completed ? 'checked' : ''} data-coach-task-id="${t.id}">
          <div>
            <div class="coach-task-title">${t.title}</div>
            <div class="coach-task-date">Hedef: ${t.date} | Mentör Anıl tarafından atandı</div>
          </div>
        </div>
        <span class="c-task-priority ${t.priority}">${t.priority === 'high' ? 'Yüksek' : 'Normal'}</span>
      `;
      listEl.appendChild(item);
    });

    listEl.querySelectorAll('[data-coach-task-id]').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-coach-task-id');
        const task = state.tasks.find(x => x.id === id);
        if (task) {
          task.completed = e.target.checked;
          if (db) db.collection('tasks').doc(task.id).update({ completed: task.completed });
          renderCoachTasks();
          renderTasks();
          if (task.completed) {
            triggerConfetti();
          }
        }
      });
    });
  }

  // =========================================================================
  // 11. S.O.S. ALERTS & LIVE PRESENCE
  // =========================================================================
  function renderSosBanner() {
    const banner = document.getElementById('sos-alert-banner');
    const textEl = document.getElementById('sos-message-text');
    if (!banner) return;

    if (state.users.fadime.sosActive) {
      banner.classList.remove('hidden');
      if (textEl) {
        textEl.textContent = `Fadime şu konuda desteğe ihtiyaç duyuyor: "${state.users.fadime.sosMessage || state.users.fadime.sosTopic || 'Belirtilmedi'}"`;
      }
    } else {
      banner.classList.add('hidden');
    }
  }

  function updateMentorPresenceBanner() {
    const presenceText = document.getElementById('mentor-presence-text');
    if (!presenceText) return;
    const anil = state.users.anil;
    presenceText.textContent = `Anıl: ${anil.statusText || 'Çevrimiçi'} 🟢`;
  }

  function updateStudentOverview() {
    const minsEl = document.getElementById('overview-fadime-minutes');
    const streakEl = document.getElementById('overview-fadime-streak');
    const topicsEl = document.getElementById('overview-fadime-topics');
    const sosEl = document.getElementById('overview-fadime-sos');

    let totalSubs = 0;
    let doneSubs = 0;
    state.topicTree.forEach(top => {
      (top.subtopics || []).forEach(sub => {
        totalSubs++;
        if (sub.completed) doneSubs++;
      });
    });

    if (minsEl) minsEl.textContent = `${state.users.fadime.todayFocusMinutes || 0} dk`;
    if (streakEl) streakEl.textContent = `${state.users.fadime.streakDays || 14} Gün`;
    if (topicsEl) topicsEl.textContent = `${doneSubs} / ${totalSubs}`;
    if (sosEl) {
      if (state.users.fadime.sosActive) {
        sosEl.textContent = '🚨 S.O.S. Aktif!';
        sosEl.className = 'stat-num text-danger';
      } else {
        sosEl.textContent = 'Temiz';
        sosEl.className = 'stat-num text-emerald';
      }
    }

    const fadimeMins = document.getElementById('fadime-today-minutes');
    const fadimeStreak = document.getElementById('fadime-streak-days');
    if (fadimeMins) fadimeMins.textContent = `${state.users.fadime.todayFocusMinutes || 0} dk`;
    if (fadimeStreak) fadimeStreak.textContent = `${state.users.fadime.streakDays || 14} Gün`;
  }

  // =========================================================================
  // 12. INTERACTIVE SPOTLIGHT TUTORIAL (COACHMARK WALKTHROUGH)
  // =========================================================================
  const TUTORIAL_STEPS = [
    {
      targetId: 'timer-card-target',
      title: 'Odak Sayacı (Pomodoro)',
      desc: 'Burası senin odak sayacın. 25/5 veya 50/10 döngüleriyle derin çalışmanı başlatabilirsin.'
    },
    {
      targetId: 'mentor-tasks-target',
      title: '⭐ Koç Görevleri',
      desc: 'Anıl\'ın sana özel atadığı kritik ödevler ve çalışma hedefleri burada listelenir.'
    },
    {
      targetId: 'topic-tree-target',
      title: 'YKS Müfredatı & YouTube Dersleri',
      desc: 'Tüm TYT-AYT konularını buradan takip edebilir, doğrudan Eyüp B., VIP Fizik ve Görkem Şahin derslerine geçebilirsin.'
    },
    {
      targetId: 'trigger-sos-btn',
      title: 'S.O.S. Acil Yardım Sinyali',
      desc: 'Takıldığın bir soru veya konu olduğunda bu butona basarak mentörün Anıl\'ın ekranına anlık yardım çağrısı gönderebilirsin.'
    },
    {
      targetId: 'ambient-sound-toggle',
      title: 'Focus Shield (Arka Plan Ses Motoru)',
      desc: 'Dış dünyayı filtrelemek için pembe gürültü ve yağmur sesini buradan başlat. Ekran kapalıyken de çalmaya devam eder.'
    }
  ];

  let currentTutorialStep = 0;

  function startTutorial() {
    currentTutorialStep = 0;
    const overlay = document.getElementById('tutorial-overlay');
    if (overlay) overlay.classList.remove('hidden');
    renderTutorialStep();
  }

  function renderTutorialStep() {
    if (currentTutorialStep >= TUTORIAL_STEPS.length) {
      closeTutorial();
      return;
    }

    const step = TUTORIAL_STEPS[currentTutorialStep];
    const targetEl = document.getElementById(step.targetId);
    const spotlight = document.getElementById('tutorial-spotlight');
    const card = document.getElementById('tutorial-card');
    const stepTag = document.getElementById('tutorial-step-tag');
    const titleEl = document.getElementById('tutorial-title');
    const descEl = document.getElementById('tutorial-desc');
    const nextBtn = document.getElementById('tutorial-next-btn');

    if (stepTag) stepTag.textContent = `ADIM ${currentTutorialStep + 1} / ${TUTORIAL_STEPS.length}`;
    if (titleEl) titleEl.textContent = step.title;
    if (descEl) descEl.textContent = step.desc;
    if (nextBtn) {
      nextBtn.textContent = (currentTutorialStep === TUTORIAL_STEPS.length - 1) ? 'Başla 🚀' : 'Sonraki Adım ➔';
    }

    if (targetEl && spotlight && card) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

      setTimeout(() => {
        const rect = targetEl.getBoundingClientRect();
        spotlight.style.top = `${rect.top - 6}px`;
        spotlight.style.left = `${rect.left - 6}px`;
        spotlight.style.width = `${rect.width + 12}px`;
        spotlight.style.height = `${rect.height + 12}px`;

        // Position card directly below or above the target
        let cardTop = rect.bottom + 12;
        if (cardTop + 180 > window.innerHeight) {
          cardTop = Math.max(16, rect.top - 170);
        }
        let cardLeft = Math.max(16, Math.min(window.innerWidth - 336, rect.left));

        card.style.top = `${cardTop}px`;
        card.style.left = `${cardLeft}px`;
      }, 300);
    }
  }

  function closeTutorial() {
    const overlay = document.getElementById('tutorial-overlay');
    if (overlay) overlay.classList.add('hidden');
    localStorage.setItem(TUTORIAL_KEY, 'true');
  }

  // =========================================================================
  // 13. NATURAL LANGUAGE INTENT PARSER & WEB SPEECH API
  // =========================================================================
  let recognition = null;
  function initSpeechRecognition() {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) return;

    recognition = new SpeechRecognitionClass();
    recognition.lang = 'tr-TR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      const badge = document.getElementById('live-rec-badge');
      const mic = document.getElementById('voice-record-btn');
      if (badge) badge.classList.remove('hidden');
      if (mic) mic.classList.add('recording');
      document.getElementById('voice-status-text').textContent = 'Dinleniyor... Lütfen konuşun.';
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const input = document.getElementById('transcript-input');
      if (input) input.value = transcript;
      parseVoiceIntent(transcript);
    };

    recognition.onend = () => {
      const badge = document.getElementById('live-rec-badge');
      const mic = document.getElementById('voice-record-btn');
      if (badge) badge.classList.add('hidden');
      if (mic) mic.classList.remove('recording');
      document.getElementById('voice-status-text').textContent = 'Kaydedildi. Başka bir konu için tekrar basabilirsiniz.';
    };
  }

  function toggleSpeechRecognition() {
    if (!recognition) initSpeechRecognition();
    if (!recognition) {
      alert('Tarayıcınız Web Speech API ses tanımayı desteklemiyor.');
      return;
    }
    try {
      recognition.start();
    } catch (e) {
      recognition.stop();
    }
  }

  function parseVoiceIntent(rawText) {
    if (!rawText) return;
    const lower = rawText.toLowerCase();

    // Check for completion intents
    const triggers = ['bitti', 'tamam', 'çözdüm', 'hallettim', 'çalıştım'];
    const isCompleted = triggers.some(t => lower.includes(t));

    let matchedSubtopic = null;
    state.topicTree.forEach(top => {
      (top.subtopics || []).forEach(sub => {
        const subTitleLower = sub.title.toLowerCase();
        const keywords = subTitleLower.split(' ');
        const match = keywords.some(w => w.length > 3 && lower.includes(w));
        if (match && !matchedSubtopic) {
          matchedSubtopic = sub;
        }
      });
    });

    if (matchedSubtopic && isCompleted) {
      matchedSubtopic.completed = true;
      syncCurriculumToFirestore();
      renderTopicTree();
      triggerConfetti();
      showCelebrationModal('Sesli Komut Algılandı!', `"${matchedSubtopic.title}" konusu sesli ifadeniz ile otomatik tamamlandı.`);
    } else {
      alert(`Anlaşılan ifade: "${rawText}"\nEşleşen müfredat konusu aranıyor...`);
    }
  }

  // =========================================================================
  // 14. CONFETTI CELEBRATION ENGINE
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
    const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#ffffff'];
    for (let i = 0; i < 80; i++) {
      confettiParticles.push({
        x: window.innerWidth * 0.5 + (Math.random() - 0.5) * 160,
        y: window.innerHeight * 0.65,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 16 - 6,
        size: Math.random() * 7 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 1
      });
    }
    if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);
    animateConfetti();
  }

  function animateConfetti() {
    if (!cctx) return;
    cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    let active = false;

    for (let i = 0; i < confettiParticles.length; i++) {
      const p = confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.45;
      p.vx *= 0.98;
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.008;

      if (p.opacity > 0) {
        active = true;
        cctx.save();
        cctx.translate(p.x, p.y);
        cctx.rotate((p.rotation * Math.PI) / 180);
        cctx.globalAlpha = p.opacity;
        cctx.fillStyle = p.color;
        cctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        cctx.restore();
      }
    }

    if (active) {
      confettiAnimationId = requestAnimationFrame(animateConfetti);
    }
  }

  function showCelebrationModal(title, desc) {
    const modal = document.getElementById('celebration-modal-overlay');
    const titleEl = document.getElementById('celebration-title');
    const descEl = document.getElementById('celebration-desc');
    if (!modal) return;
    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = desc;
    modal.classList.remove('hidden');
  }

  // =========================================================================
  // 15. OPENING WOW SPLASH
  // =========================================================================
  const splashOverlay = document.getElementById('wow-splash-overlay');
  let splashAnimId = null;

  function launchWowSplash() {
    if (!splashOverlay) return;
    splashOverlay.classList.remove('exit-anim', 'hidden');
    splashOverlay.classList.add('active');

    setTimeout(() => {
      dismissSplash();
    }, 2000);
  }

  function dismissSplash() {
    if (!splashOverlay) return;
    splashOverlay.classList.add('exit-anim');
    setTimeout(() => {
      splashOverlay.classList.remove('active');
    }, 500);
  }

  // =========================================================================
  // 16. RENDERING MISC LISTS (TASKS, MISTAKES, SPRINTS, HEATMAP)
  // =========================================================================
  function renderTasks() {
    const container = document.getElementById('calendar-tasks-list');
    if (!container) return;
    container.innerHTML = '';

    const filtered = state.tasks.filter(t => {
      if (taskFilter === 'all') return true;
      return t.assignedTo === taskFilter;
    });

    filtered.forEach(t => {
      const card = document.createElement('div');
      card.className = `calendar-task-card ${t.completed ? 'completed' : ''}`;
      card.innerHTML = `
        <div style="display:flex; align-items:center; gap: 8px;">
          <input type="checkbox" ${t.completed ? 'checked' : ''} data-cal-task-id="${t.id}">
          <div>
            <div class="c-task-title">${t.title}</div>
            <div class="c-task-meta">${t.assignedBy === 'anil' ? 'Anıl' : 'Fadime'} ➔ ${t.assignedTo === 'anil' ? 'Anıl' : 'Fadime'} | Tarih: ${t.date}</div>
          </div>
        </div>
        <span class="c-task-priority ${t.priority}">${t.priority === 'high' ? 'Yüksek' : 'Normal'}</span>
      `;
      container.appendChild(card);
    });

    container.querySelectorAll('[data-cal-task-id]').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-cal-task-id');
        const task = state.tasks.find(x => x.id === id);
        if (task) {
          task.completed = e.target.checked;
          if (db) db.collection('tasks').doc(task.id).update({ completed: task.completed });
          renderTasks();
          renderCoachTasks();
        }
      });
    });
  }

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
          <button class="mistake-badge ${m.solved ? 'solved' : ''}" data-mis-id="${m.id}">
            ${m.solved ? '✓ Çözüldü' : 'İncelenecek'}
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
          syncMistakesToFirestore();
          renderMistakes();
        }
      });
    });

    container.querySelectorAll('[data-del-mis]').forEach(b => {
      b.addEventListener('click', () => {
        const id = b.getAttribute('data-del-mis');
        state.mistakes = state.mistakes.filter(x => x.id !== id);
        syncMistakesToFirestore();
        renderMistakes();
      });
    });
  }

  function renderAnilSprints() {
    const container = document.getElementById('anil-sprints-container');
    if (!container) return;
    container.innerHTML = '';

    state.anilSprints.forEach(sp => {
      const item = document.createElement('div');
      item.className = `sprint-item ${sp.done ? 'done' : ''}`;
      item.innerHTML = `
        <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
          <input type="checkbox" ${sp.done ? 'checked' : ''} data-sp-id="${sp.id}">
          <span>${sp.text}</span>
        </label>
        <button class="mini-btn" data-del-sp="${sp.id}">✕</button>
      `;
      container.appendChild(item);
    });

    container.querySelectorAll('[data-sp-id]').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-sp-id');
        const sp = state.anilSprints.find(x => x.id === id);
        if (sp) {
          sp.done = e.target.checked;
          syncSprintsToFirestore();
          renderAnilSprints();
        }
      });
    });

    container.querySelectorAll('[data-del-sp]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-del-sp');
        state.anilSprints = state.anilSprints.filter(x => x.id !== id);
        syncSprintsToFirestore();
        renderAnilSprints();
      });
    });
  }

  function renderWeekMatrix() {
    const grid = document.getElementById('week-matrix-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

    days.forEach((day, idx) => {
      const cell = document.createElement('div');
      cell.className = 'matrix-day-cell';
      cell.innerHTML = `<span class="day-label">${day}</span>`;

      const dayTasks = state.tasks.slice(idx, idx + 2);
      dayTasks.forEach(t => {
        const dot = document.createElement('div');
        dot.className = 'matrix-task-dot';
        dot.textContent = `${t.assignedTo === 'fadime' ? 'F:' : 'A:'} ${t.title}`;
        cell.appendChild(dot);
      });

      grid.appendChild(cell);
    });
  }

  function renderHeatmap() {
    const grid = document.getElementById('heatmap-grid');
    if (!grid) return;
    grid.innerHTML = '';

    for (let i = 0; i < 364; i++) {
      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';
      let level = 0;
      const rand = Math.random();
      if (rand > 0.88) level = 4;
      else if (rand > 0.68) level = 3;
      else if (rand > 0.48) level = 2;
      else if (rand > 0.28) level = 1;

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
          syncCurriculumToFirestore();
          syncMistakesToFirestore();
          syncSprintsToFirestore();
          initAllViews();
          alert('Yedek başarıyla Cloud Firestore\'a yüklendi.');
        } else {
          alert('Geçersiz TulpiFlow JSON şeması.');
        }
      } catch (err) {
        alert('JSON dosyası okunamadı.');
      }
    };
    reader.readAsText(file);
  }

  // =========================================================================
  // 17. INITIALIZATION & GLOBAL EVENT LISTENERS
  // =========================================================================
  function initAllViews() {
    renderTopicTree();
    renderTasks();
    renderCoachTasks();
    renderWeekMatrix();
    renderAnilSprints();
    renderMistakes();
    renderSosBanner();
    renderHeatmap();
    updateStudentOverview();
    updateTimerDisplay();
  }

  document.addEventListener('DOMContentLoaded', () => {

  function safeOn(idOrEl, event, handler) {
    const el = (typeof idOrEl === 'string') ? document.getElementById(idOrEl) : idOrEl;
    if (el) el.addEventListener(event, handler);
  }

    // 1. Initialize Theme (Dark / Light)
    initTheme();

    // 2. Initialize Firestore Sync
    initFirestoreSync();

    // 3. Check Persistent Device Auth
    checkDeviceAuth();

    // 4. Passcode Modal Input Handlers
    safeOn('auth-submit-btn', 'click', () => {
      const code = document.getElementById('passcode-input').value;
      verifyPasscode(code);
    });
    safeOn('passcode-input', 'keydown', (e) => {
      if (e.key === 'Enter') verifyPasscode(e.target.value);
    });

    // 5. Header Avatar Dropdown Toggle
    const avatarBtn = document.getElementById('user-avatar-btn');
    const dropdown = document.getElementById('profile-dropdown');
    if (avatarBtn && dropdown) {
      avatarBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
      });
      document.addEventListener('click', () => {
        dropdown.classList.add('hidden');
      });
    }

    // 6. Dropdown Actions: Tutorial & Reset Auth
    safeOn('dropdown-tutorial-btn', 'click', () => {
      if (dropdown) dropdown.classList.add('hidden');
      startTutorial();
    });

    safeOn('dropdown-switch-role-btn', 'click', () => {
      if (confirm('Cihaz şifresini sıfırlayıp giriş ekranına dönmek istiyor musunuz?')) {
        localStorage.removeItem(AUTH_KEY);
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(TUTORIAL_KEY);
        location.reload();
      }
    });

    // 7. Re-trigger WOW splash on brand click
    safeOn('re-trigger-splash', 'click', () => {
      launchWowSplash();
    });
    safeOn('skip-splash-btn', 'click', () => {
      dismissSplash();
    });

    // 8. Focus Shield Toggle
    safeOn('ambient-sound-toggle', 'click', () => {
      toggleFocusShield();
    });

    // 9. Voice Recognition
    safeOn('voice-record-btn', 'click', toggleSpeechRecognition);
    safeOn('parse-intent-btn', 'click', () => {
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

    // 10. Circular Pomodoro Controls & Segmented Control
    safeOn('timer-start-pause-btn', 'click', startPauseTimer);
    safeOn('timer-reset-btn', 'click', resetTimer);
    document.querySelectorAll('.seg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setTimerMode(btn.getAttribute('data-mode'));
      });
    });

    // 11. Tutorial Handlers
    safeOn('tutorial-next-btn', 'click', () => {
      currentTutorialStep++;
      renderTutorialStep();
    });
    safeOn('tutorial-skip-btn', 'click', closeTutorial);
    safeOn('tutorial-backdrop', 'click', closeTutorial);

    // Workspace Subtab Buttons (Fadime Segmented View)
    document.querySelectorAll('.ws-seg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sub = btn.getAttribute('data-subtab');
        if (sub) switchSubtab(sub);
      });
    });

    // 12. Topic Category Filter Pills
    document.querySelectorAll('#topic-category-filters .filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('#topic-category-filters .filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeTopicCategory = pill.getAttribute('data-cat');
        if (activeTopicCategory !== 'all') {
          expandedAccordionCategories.add(activeTopicCategory);
        }
        renderTopicTree();
      });
    });

    // 13. Calendar Filters
    document.querySelectorAll('.calendar-filters .filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.calendar-filters .filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        taskFilter = pill.getAttribute('data-calfilter');
        renderTasks();
      });
    });

    // 14. S.O.S. Trigger & Resolve
    safeOn('trigger-sos-btn', 'click', () => {
      const topic = prompt('Tıkandığın ders ve konuyu yaz:', 'Türev Geometrik Yorum');
      const note = prompt('Sorundaki takıldığın noktayı kısaca belirt:', 'Teğet doğrusunun eğimi türeve eşit olduğu halde dik teğet formülünde işaret hatası yapıyorum.');
      if (topic || note) {
        state.users.fadime.sosActive = true;
        state.users.fadime.sosTopic = topic || '';
        state.users.fadime.sosMessage = note || '';
        syncUserToFirestore('fadime');
        renderSosBanner();
        updateStudentOverview();
        alert('S.O.S. sinyali Mentör Anıl\'ın ekranına başarıyla iletildi.');
      }
    });

    safeOn('resolve-sos-btn', 'click', () => {
      state.users.fadime.sosActive = false;
      state.users.fadime.sosMessage = '';
      state.users.fadime.sosTopic = '';
      syncUserToFirestore('fadime');
      renderSosBanner();
      updateStudentOverview();
    });

    // 15. Mentor Cheer / Encouragement
    safeOn('send-cheer-btn', 'click', () => {
      const input = document.getElementById('cheer-message-input');
      const msg = input.value.trim();
      if (msg) {
        state.users.fadime.lastAction = `Koç Notu: "${msg}"`;
        syncUserToFirestore('fadime');
        alert(`Koç Notu Fadime'nin ekranına başarıyla iletildi: "${msg}"`);
        input.value = '';
      }
    });

    // 16. Delegate Task to Fadime
    safeOn('delegate-task-btn', 'click', () => {
      const title = document.getElementById('delegate-title-input').value.trim();
      const date = document.getElementById('delegate-date-input').value || new Date().toISOString().split('T')[0];
      const priority = document.getElementById('delegate-priority-select').value;

      if (!title) {
        alert('Lütfen görev başlığı girin.');
        return;
      }

      const newTask = {
        id: 'del-' + Date.now(),
        title: title,
        assignedBy: 'anil',
        assignedTo: 'fadime',
        priority: priority,
        date: date,
        completed: false,
        createdAt: new Date().toISOString()
      };

      if (db) {
        db.collection('tasks').doc(newTask.id).set(newTask);
      } else {
        state.tasks.unshift(newTask);
        renderTasks();
        renderCoachTasks();
      }

      document.getElementById('delegate-title-input').value = '';
      alert('Görev Cloud Firestore\'a kaydedildi ve Fadime\'nin koç görevleri listesine iletildi.');
    });

    // 17. Add Sprint for Anıl
    safeOn('add-sprint-btn', 'click', () => {
      const input = document.getElementById('new-sprint-input');
      const val = input.value.trim();
      if (val) {
        state.anilSprints.push({ id: 'sp-' + Date.now(), text: val, done: false });
        syncSprintsToFirestore();
        renderAnilSprints();
        input.value = '';
      }
    });

    // 18. Modals (New Task & Mistake)
    safeOn('open-new-task-modal-btn', 'click', () => {
      document.getElementById('add-task-modal-overlay').classList.remove('hidden');
    });
    safeOn('add-mistake-btn', 'click', () => {
      document.getElementById('add-mistake-modal-overlay').classList.remove('hidden');
    });
    document.querySelectorAll('.close-modal-btn, [data-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-close') || btn.closest('.modal-overlay').id;
        document.getElementById(modalId).classList.add('hidden');
      });
    });

    // Save Task from modal
    safeOn('save-new-task-btn', 'click', () => {
      const title = document.getElementById('task-title-input').value.trim();
      const forUser = document.getElementById('task-for-select').value;
      const priority = document.getElementById('task-priority-select').value;
      const date = document.getElementById('task-date-input').value || new Date().toISOString().split('T')[0];

      if (!title) return alert('Başlık gerekli');

      const newTask = {
        id: 'task-' + Date.now(),
        title: title,
        assignedBy: currentAuth ? currentAuth.role : 'anil',
        assignedTo: forUser,
        priority: priority,
        date: date,
        completed: false,
        createdAt: new Date().toISOString()
      };

      if (db) {
        db.collection('tasks').doc(newTask.id).set(newTask);
      } else {
        state.tasks.unshift(newTask);
        renderTasks();
        renderCoachTasks();
      }

      document.getElementById('add-task-modal-overlay').classList.add('hidden');
      document.getElementById('task-title-input').value = '';
    });

    // Save Mistake note
    safeOn('save-mistake-btn', 'click', () => {
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
      syncMistakesToFirestore();
      renderMistakes();
      document.getElementById('add-mistake-modal-overlay').classList.add('hidden');
      document.getElementById('mistake-topic-input').value = '';
      document.getElementById('mistake-note-input').value = '';
    });

    // Celebration Modal Close
    safeOn('close-celebration-btn', 'click', () => {
      document.getElementById('celebration-modal-overlay').classList.add('hidden');
    });

    // Backup & Restore
    safeOn('export-json-btn', 'click', exportDataAsJSON);
    safeOn('import-json-input', 'change', (e) => {
      if (e.target.files && e.target.files[0]) {
        importDataFromJSON(e.target.files[0]);
      }
    });
    safeOn('reset-data-btn', 'click', () => {
      if (confirm('Tüm ilerleme verilerini sıfırlayıp fabrika ayarlarına dönmek istediğinize emin misiniz?')) {
        state.topicTree = (typeof YKS_CURRICULUM !== 'undefined') ? JSON.parse(JSON.stringify(YKS_CURRICULUM)) : [];
        state.tasks = JSON.parse(JSON.stringify(INITIAL_TASKS));
        state.mistakes = JSON.parse(JSON.stringify(INITIAL_MISTAKES));
        state.anilSprints = JSON.parse(JSON.stringify(INITIAL_SPRINTS));
        state.users = JSON.parse(JSON.stringify(INITIAL_USERS));
        syncCurriculumToFirestore();
        syncMistakesToFirestore();
        syncSprintsToFirestore();
        syncUserToFirestore('anil');
        syncUserToFirestore('fadime');
        initAllViews();
        alert('Veriler Cloud Firestore üzerinde sıfırlandı.');
      }
    });

    const todayStr = new Date().toISOString().split('T')[0];
    const dDate = document.getElementById('delegate-date-input');
    const tDate = document.getElementById('task-date-input');
    if (dDate) dDate.value = todayStr;
    if (tDate) tDate.value = todayStr;

    initAllViews();
  });

})();
