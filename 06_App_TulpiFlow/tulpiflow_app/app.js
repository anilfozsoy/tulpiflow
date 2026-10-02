/* ==========================================================================
   TULPIFLOW CORE ENGINE — APP.JS (v2.0.0)
   Asymmetric Spaces (Anıl & Fadime), YKS YouTube Deep-Link Engine,
   Touch Swipe Gestures, Clean Zero-State, Non-Blocking Micro-Tooltip Tour,
   4 Focus Shield Soundscapes with Media Session Notification Card,
   YKS Deneme Sınavı Motoru & Net Takibi (TYT & AYT),
   Özelleştirilebilir Konu Ağacı & Canlı Mentör Alarmları,
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
  let activeSubtab = 'focus';
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
  // 2. DEFAULT SEED STATE (CLEAN ZERO-STATE)
  // =========================================================================
  const INITIAL_USERS = {
    fadime: {
      name: 'Fadime',
      title: 'YKS 2026 Hazırlık & Derece Adayı',
      role: 'student',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=FadimeTulpi',
      streakDays: 0,
      todayFocusMinutes: 0,
      lastAction: 'TulpiFlow v2.0 Başlatıldı',
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
      streakDays: 0,
      todayFocusMinutes: 0,
      lastAction: 'Sistem Hazır',
      statusText: 'Deep Work Modu'
    }
  };

  const INITIAL_TASKS = [];
  const INITIAL_SPRINTS = [];
  const INITIAL_MISTAKES = [];
  const INITIAL_EXAMS = [];

  // In-memory active state
  let state = {
    users: JSON.parse(JSON.stringify(INITIAL_USERS)),
    topicTree: (typeof YKS_CURRICULUM !== 'undefined') ? JSON.parse(JSON.stringify(YKS_CURRICULUM)) : [],
    tasks: JSON.parse(JSON.stringify(INITIAL_TASKS)),
    anilSprints: JSON.parse(JSON.stringify(INITIAL_SPRINTS)),
    mistakes: JSON.parse(JSON.stringify(INITIAL_MISTAKES)),
    exams: JSON.parse(JSON.stringify(INITIAL_EXAMS)),
    pomodoro: {
      engine: 'pomodoro', // 'pomodoro' | 'exam'
      mode: '25-5',        // '25-5', '50-10', 'deepwork'
      examType: 'tyt',     // 'tyt', 'ayt', 'branch'
      durationMinutes: 25,
      remainingSeconds: 25 * 60,
      isRunning: false,
      intervalId: null,
      branchMinutes: 45,
      branchName: 'Branş Denemesi'
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
    const savedAuth = localStorage.getItem(AUTH_KEY);
    if (savedAuth) {
      try {
        currentAuth = JSON.parse(savedAuth);
        applyAuthRole(currentAuth.role);
        return;
      } catch (e) {
        localStorage.removeItem(AUTH_KEY);
      }
    }
    showAuthModal();
  }

  function showAuthModal() {
    const modal = document.getElementById('auth-modal-overlay');
    if (modal) modal.classList.remove('hidden');
  }

  function hideAuthModal() {
    const modal = document.getElementById('auth-modal-overlay');
    if (modal) modal.classList.add('hidden');
  }

  function verifyPasscode(inputCode) {
    const cleanCode = (inputCode || '').trim().toLowerCase();
    const errorEl = document.getElementById('auth-error-msg');

    if (cleanCode === 'fadime' || cleanCode === 'fadime2026' || cleanCode === 'yks2026' || cleanCode === '1234') {
      currentAuth = { role: 'fadime', name: 'Fadime', token: 'fadime_token_' + Date.now() };
    } else if (cleanCode === 'anil' || cleanCode === 'anil2026' || cleanCode === 'architect' || cleanCode === '5678') {
      currentAuth = { role: 'anil', name: 'Anıl', token: 'anil_token_' + Date.now() };
    } else {
      if (errorEl) errorEl.classList.remove('hidden');
      return;
    }

    if (errorEl) errorEl.classList.add('hidden');
    localStorage.setItem(AUTH_KEY, JSON.stringify(currentAuth));
    localStorage.setItem(AUTH_TOKEN_KEY, currentAuth.token);
    hideAuthModal();
    applyAuthRole(currentAuth.role);

    // Replay WOW Splash on first valid login
    launchWowSplash();

    // Trigger Non-Blocking Micro-Tooltip Tour if first time
    if (!localStorage.getItem(TUTORIAL_KEY)) {
      setTimeout(() => {
        startTutorial();
      }, 1400);
    }
  }

  function applyAuthRole(role) {
    const userNameEl = document.getElementById('dropdown-user-name');
    const userRoleEl = document.getElementById('dropdown-user-role');
    const userAvatarImg = document.getElementById('user-avatar-img');

    if (role === 'fadime') {
      if (userNameEl) userNameEl.textContent = 'Fadime';
      if (userRoleEl) userRoleEl.textContent = 'YKS 2026 Adayı';
      if (userAvatarImg) userAvatarImg.src = state.users.fadime.avatar;
      renderRoleNavigation('fadime');
      switchTab('fadime', 'focus');
    } else {
      if (userNameEl) userNameEl.textContent = 'Anıl';
      if (userRoleEl) userRoleEl.textContent = 'Sistem Mimarı & Mentör';
      if (userAvatarImg) userAvatarImg.src = state.users.anil.avatar;
      renderRoleNavigation('anil');
      switchTab('anil');
    }
  }

  function renderRoleNavigation(role) {
    const navTabs = document.getElementById('main-nav-tabs');
    const bottomBar = document.getElementById('mobile-bottom-bar');

    if (role === 'fadime') {
      if (navTabs) {
        navTabs.innerHTML = `
          <button class="nav-tab active" data-tab="fadime" role="tab">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>YKS Odak & Deneme</span>
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

    // Attach listeners to newly created tab buttons
    document.querySelectorAll('.nav-tab, .m-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        const sub = btn.getAttribute('data-subtab');
        if (tab) switchTab(tab, sub);
      });
    });
  }

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
      } else if (!subtabId && !b.hasAttribute('data-subtab')) {
        b.classList.add('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // =========================================================================
  // 4B. TOUCH SWIPE GESTURES (SWIPE TO SWITCH PANELS)
  // =========================================================================
  function initSwipeNavigation() {
    const viewport = document.getElementById('main-viewport') || document.querySelector('.main-content');
    if (!viewport) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;

    viewport.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
      if (e.changedTouches.length !== 1) return;
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      const elapsedTime = Date.now() - touchStartTime;

      // Minimum 50px swipe, horizontal dominant, within 800ms
      if (Math.abs(deltaX) >= 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2 && elapsedTime < 800) {
        if (deltaX < 0) {
          navigateSwipe(1);  // Swipe Left -> Next
        } else {
          navigateSwipe(-1); // Swipe Right -> Prev
        }
      }
    }, { passive: true });
  }

  function navigateSwipe(direction) {
    const role = (currentAuth && currentAuth.role) ? currentAuth.role : 'fadime';
    let panels = [];
    if (role === 'fadime') {
      panels = [
        { tab: 'fadime', subtab: 'focus' },
        { tab: 'fadime', subtab: 'curriculum' },
        { tab: 'fadime', subtab: 'tasks-notes' },
        { tab: 'calendar', subtab: null },
        { tab: 'analytics', subtab: null }
      ];
    } else {
      panels = [
        { tab: 'anil', subtab: null },
        { tab: 'fadime', subtab: null },
        { tab: 'calendar', subtab: null },
        { tab: 'analytics', subtab: null }
      ];
    }

    let currentIndex = panels.findIndex(p => {
      if (p.subtab) return p.tab === activeTab && p.subtab === activeSubtab;
      return p.tab === activeTab;
    });

    if (currentIndex === -1) currentIndex = 0;
    const nextIndex = currentIndex + direction;

    if (nextIndex >= 0 && nextIndex < panels.length) {
      const target = panels[nextIndex];
      const targetPane = document.getElementById('pane-' + target.tab);
      if (targetPane) {
        targetPane.classList.remove('swipe-left-enter', 'swipe-right-enter');
        void targetPane.offsetWidth;
        targetPane.classList.add(direction > 0 ? 'swipe-left-enter' : 'swipe-right-enter');
      }
      switchTab(target.tab, target.subtab);
    }
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
      const tasks = [];
      snapshot.forEach(doc => tasks.push(Object.assign({ id: doc.id }, doc.data())));
      state.tasks = tasks;
      renderTasks();
      renderCoachTasks();
      renderWeekMatrix();
    }, (err) => console.warn('Tasks snapshot error:', err));

    // 3. Listen to 'app_data' (Curriculum & Mistakes & Sprints)
    db.collection('app_data').doc('curriculum').onSnapshot((doc) => {
      if (doc.exists && doc.data().topicTree && doc.data().topicTree.length > 0) {
        const cloudTree = doc.data().topicTree;
        state.topicTree = cloudTree;
        renderTopicTree();
        updateStudentOverview();
      } else {
        if (typeof YKS_CURRICULUM !== 'undefined') {
          db.collection('app_data').doc('curriculum').set({ topicTree: YKS_CURRICULUM, version: "2.0.0" });
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

    // 4. Listen to Fadime's Exam Results
    db.collection('tulpiflow_users').doc('fadime').collection('exam_results').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
      const exams = [];
      snapshot.forEach(doc => exams.push(Object.assign({ id: doc.id }, doc.data())));
      state.exams = exams;
      renderExamHistory();
    }, (err) => console.warn('Exam results snapshot error:', err));

    // 5. Live Mentor Event Listener (topic completed or exam submitted)
    db.collection('tulpiflow_events').orderBy('timestamp', 'desc').limit(5).onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const ev = change.doc.data();
          if (Date.now() - (ev.timestamp || 0) < 60000) {
            if (currentAuth && currentAuth.role === 'anil') {
              playGongTone();
              showMentorLiveAlert(ev);
            }
          }
        }
      });
    }, (err) => console.warn('Events snapshot error:', err));

    // 6. In-App Update Engine: Check app_config/version
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
  // 6. IN-APP UPDATE ENGINE (DECOUPLED OTA CHECKER)
  // =========================================================================
  function isNewerVersion(latest, current) {
    if (!latest || !current) return false;
    const clean = (v) => String(v).trim().replace(/^v/i, '').split(/[-+]/)[0];
    const lParts = clean(latest).split('.').map(n => parseInt(n, 10) || 0);
    const cParts = clean(current).split('.').map(n => parseInt(n, 10) || 0);
    const maxLen = Math.max(lParts.length, cParts.length);
    for (let i = 0; i < maxLen; i++) {
      const l = lParts[i] || 0;
      const c = cParts[i] || 0;
      if (l > c) return true;
      if (l < c) return false;
    }
    return false;
  }

  function checkAppUpdate() {
    function startListening() {
      if (!db && typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
        db = firebase.firestore();
      }
      if (!db) {
        setTimeout(startListening, 400);
        return;
      }
      try {
        db.collection('app_config').doc('version').onSnapshot((doc) => {
          if (!doc.exists) return;
          const data = doc.data();
          const latestVer = data.latest_version || data.version || CURRENT_APP_VERSION;
          if (isNewerVersion(latestVer, CURRENT_APP_VERSION)) {
            showUpdateModal(data);
          }
        }, (err) => {
          console.warn('Update check snapshot warning:', err);
        });
      } catch (err) {
        console.warn('checkAppUpdate error:', err);
      }
    }

    startListening();
  }

  // Backward-compatible alias
  const checkAppVersion = checkAppUpdate;

  function showUpdateModal(config) {
    const modal = document.getElementById('update-modal-overlay');
    const verTag = document.getElementById('update-version-label');
    const changelogList = document.getElementById('update-changelog-list');
    const downloadBtn = document.getElementById('update-download-btn');
    const laterBtn = document.getElementById('update-later-btn');

    if (!modal) return;

    const latestVer = config.latest_version || config.version || '1.3.0';
    if (verTag) verTag.textContent = `v${String(latestVer).replace(/^v/i, '')} Hazır`;

    const logs = config.changelog || config.release_notes || [
      "Seslerin kesilme sorunu giderildi (sonsuz döngü aktif).",
      "Deneme modu ve akordeon paneller eklendi."
    ];

    if (changelogList) {
      changelogList.innerHTML = logs.map(item => `<li>${item}</li>`).join('');
    }

    // Explicitly force modal directly to the absolute top of the screen
    modal.style.cssText = 'display: flex !important; z-index: 999999 !important; opacity: 1 !important; pointer-events: auto !important;';
    modal.classList.remove('hidden');
    modal.classList.add('update-active');

    const downloadUrl = config.apk_download_url || config.apk_url || config.download_url || 'https://github.com/anilfozsoy/tulpiflow/releases/latest/download/TulpiFlow.apk';

    if (downloadBtn) {
      downloadBtn.onclick = () => {
        window.open(downloadUrl, '_system');
        try {
          window.open(downloadUrl, '_blank');
        } catch (e) {
          window.location.href = downloadUrl;
        }
      };
    }
    if (laterBtn) {
      laterBtn.onclick = () => {
        modal.classList.add('hidden');
        modal.classList.remove('update-active');
        modal.style.cssText = 'display: none !important; pointer-events: none !important;';
      };
    }
  }

  // =========================================================================
  // 7. BACKGROUND AUDIO FOCUS SHIELD & MEDIA SESSION NOTIFICATION (v2.0)
  // 4 Ambient Soundscapes: Rain, Campfire, Ocean, Focus Noise
  // =========================================================================
  let audioCtx = null;
  let ambientNoiseSource = null;
  let ambientGainNode = null;
  let ambientFilterNode = null;
  let ambientLfoNode = null;
  let ambientLfoGain = null;
  let isAmbientPlaying = false;
  let activeSoundMode = 'rain'; // 'rain' | 'campfire' | 'ocean' | 'noise'
  let ambientStopTimer = null;

  // Global Singleton Audio Player for Continuous Background Audio Loop
  if (!window.TulpiAudioPlayer) {
    window.TulpiAudioPlayer = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
  }
  window.TulpiAudioPlayer.loop = true;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();

      // Ensure audio context resumes immediately if auto-suspended
      audioCtx.onstatechange = () => {
        if (isAmbientPlaying && audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume().catch(() => {});
        }
      };
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  }

  function setupMediaSession() {
    if (!('mediaSession' in navigator)) return;

    let activeTitle = '';
    if (state.pomodoro.engine === 'exam') {
      const eName = state.pomodoro.examType === 'tyt' ? 'TYT Denemesi' : (state.pomodoro.examType === 'ayt' ? 'AYT Denemesi' : (state.pomodoro.branchName || 'Branş Denemesi'));
      activeTitle = `${eName} (Kalan: ${formatTimerDigits(state.pomodoro.remainingSeconds)})`;
    } else {
      const mName = state.pomodoro.mode === '25-5' ? '25/5 Pomodoro' : (state.pomodoro.mode === '50-10' ? '50/10 Uzun Seans' : 'Deep Work 90m');
      activeTitle = `${mName} (Kalan: ${formatTimerDigits(state.pomodoro.remainingSeconds)})`;
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      title: `TulpiFlow Odak: ${activeTitle}`,
      artist: 'Fadime — Deep Work',
      album: 'YKS 2026 Derece Hedefi',
      artwork: [
        { src: 'tulpi_icon_512.png', sizes: '512x512', type: 'image/png' },
        { src: 'tulpi_icon_256.png', sizes: '256x256', type: 'image/png' }
      ]
    });

    navigator.mediaSession.playbackState = (state.pomodoro.isRunning || isAmbientPlaying) ? 'playing' : 'paused';

    navigator.mediaSession.setActionHandler('play', () => {
      if (!state.pomodoro.isRunning) startPauseTimer();
      if (!isAmbientPlaying) toggleFocusShield(true);
    });
    navigator.mediaSession.setActionHandler('pause', () => {
      if (state.pomodoro.isRunning) startPauseTimer();
      if (isAmbientPlaying) toggleFocusShield(false);
    });
    navigator.mediaSession.setActionHandler('stop', () => {
      resetTimer();
      if (isAmbientPlaying) toggleFocusShield(false);
    });
  }

  function generatePinkNoiseBuffer(ctx, durationSec) {
    const dur = durationSec || 4;
    const sampleRate = ctx.sampleRate || 44100;
    const bufferSize = sampleRate * dur;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, sampleRate);
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
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    return noiseBuffer;
  }

  function cleanupAudioNodes() {
    if (ambientNoiseSource) {
      try {
        ambientNoiseSource.onended = null;
        ambientNoiseSource.stop();
        ambientNoiseSource.disconnect();
      } catch (e) {}
      ambientNoiseSource = null;
    }
    if (ambientLfoNode) {
      try {
        ambientLfoNode.stop();
        ambientLfoNode.disconnect();
      } catch (e) {}
      ambientLfoNode = null;
    }
    if (ambientLfoGain) {
      try { ambientLfoGain.disconnect(); } catch (e) {}
      ambientLfoGain = null;
    }
    if (ambientFilterNode) {
      try { ambientFilterNode.disconnect(); } catch (e) {}
      ambientFilterNode = null;
    }
    if (ambientGainNode) {
      try { ambientGainNode.disconnect(); } catch (e) {}
      ambientGainNode = null;
    }
  }

  function startAmbientSynthesizer(seamless = false) {
    if (ambientStopTimer) {
      clearTimeout(ambientStopTimer);
      ambientStopTimer = null;
    }
    cleanupAudioNodes();

    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      // 1. Maintain background audio session via global singleton loop
      if (!window.TulpiAudioPlayer) {
        window.TulpiAudioPlayer = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA');
      }
      window.TulpiAudioPlayer.loop = true;
      window.TulpiAudioPlayer.play().catch(e => {
        console.warn('TulpiAudioPlayer background loop notice:', e);
      });

      // 2. Synthesize infinite looped soundscape
      const noiseBuffer = generatePinkNoiseBuffer(ctx, 4);
      ambientNoiseSource = ctx.createBufferSource();
      ambientNoiseSource.buffer = noiseBuffer;
      ambientNoiseSource.loop = true; // Crucial infinite buffer looping

      // Safety fallback: if audio buffer somehow ends, continuously restart
      ambientNoiseSource.onended = () => {
        if (isAmbientPlaying) {
          startAmbientSynthesizer(true);
        }
      };

      ambientFilterNode = ctx.createBiquadFilter();
      ambientGainNode = ctx.createGain();

      const t = ctx.currentTime;
      if (activeSoundMode === 'rain') {
        // Gece Yağmuru: Lowpass filtered at 750Hz with soft resonance
        ambientFilterNode.type = 'lowpass';
        ambientFilterNode.frequency.setValueAtTime(750, t);
        ambientGainNode.gain.setValueAtTime(seamless ? 0.09 : 0.001, t);
        ambientGainNode.gain.linearRampToValueAtTime(0.09, t + 0.3);

        ambientNoiseSource.connect(ambientFilterNode);
        ambientFilterNode.connect(ambientGainNode);
      } else if (activeSoundMode === 'campfire') {
        // Kamp Ateşi: Low warm rumble + crackle pops
        ambientFilterNode.type = 'lowpass';
        ambientFilterNode.frequency.setValueAtTime(160, t);
        ambientGainNode.gain.setValueAtTime(seamless ? 0.08 : 0.001, t);
        ambientGainNode.gain.linearRampToValueAtTime(0.08, t + 0.3);

        ambientNoiseSource.connect(ambientFilterNode);
        ambientFilterNode.connect(ambientGainNode);
      } else if (activeSoundMode === 'ocean') {
        // Okyanus Dalgası: Bandpass with LFO swell (0.08Hz)
        ambientFilterNode.type = 'bandpass';
        ambientFilterNode.frequency.setValueAtTime(450, t);
        ambientFilterNode.Q.setValueAtTime(1.5, t);

        ambientLfoNode = ctx.createOscillator();
        ambientLfoNode.frequency.setValueAtTime(0.08, t);
        ambientLfoGain = ctx.createGain();
        ambientLfoGain.gain.setValueAtTime(320, t);
        ambientLfoNode.connect(ambientLfoGain);
        ambientLfoGain.connect(ambientFilterNode.frequency);
        ambientLfoNode.start();

        ambientGainNode.gain.setValueAtTime(seamless ? 0.10 : 0.001, t);
        ambientGainNode.gain.linearRampToValueAtTime(0.10, t + 0.3);

        ambientNoiseSource.connect(ambientFilterNode);
        ambientFilterNode.connect(ambientGainNode);
      } else {
        // Focus Noise / Pembe Gürültü: Pure distraction masking
        ambientFilterNode.type = 'lowpass';
        ambientFilterNode.frequency.setValueAtTime(1200, t);
        ambientGainNode.gain.setValueAtTime(seamless ? 0.07 : 0.001, t);
        ambientGainNode.gain.linearRampToValueAtTime(0.07, t + 0.3);

        ambientNoiseSource.connect(ambientFilterNode);
        ambientFilterNode.connect(ambientGainNode);
      }

      ambientGainNode.connect(ctx.destination);
      ambientNoiseSource.start();
      isAmbientPlaying = true;

      updateSoundUIState(true);
      setupMediaSession();
    } catch (e) {
      console.warn('Ambient synthesizer error:', e);
    }
  }

  function stopAmbientSynthesizer() {
    isAmbientPlaying = false;
    if (ambientStopTimer) {
      clearTimeout(ambientStopTimer);
      ambientStopTimer = null;
    }

    if (ambientGainNode && audioCtx && audioCtx.state === 'running') {
      try {
        ambientGainNode.gain.cancelScheduledValues(audioCtx.currentTime);
        ambientGainNode.gain.setValueAtTime(ambientGainNode.gain.value, audioCtx.currentTime);
        ambientGainNode.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.2);
      } catch (e) {}

      ambientStopTimer = setTimeout(() => {
        cleanupAudioNodes();
        if (window.TulpiAudioPlayer) {
          try { window.TulpiAudioPlayer.pause(); } catch (e) {}
        }
        updateSoundUIState(false);
        setupMediaSession();
      }, 220);
    } else {
      cleanupAudioNodes();
      if (window.TulpiAudioPlayer) {
        try { window.TulpiAudioPlayer.pause(); } catch (e) {}
      }
      updateSoundUIState(false);
      setupMediaSession();
    }
  }

  function toggleFocusShield(forceState) {
    const shouldPlay = (typeof forceState === 'boolean') ? forceState : !isAmbientPlaying;
    if (shouldPlay) {
      startAmbientSynthesizer();
    } else {
      stopAmbientSynthesizer();
    }
  }

  function setSoundMode(mode) {
    activeSoundMode = mode;
    document.querySelectorAll('.sound-chip').forEach(chip => {
      chip.classList.toggle('active', chip.getAttribute('data-sound') === mode);
    });
    // Auto-start and switch sound seamlessly on chip click
    startAmbientSynthesizer(true);
  }

  function updateSoundUIState(playing) {
    const headerBtn = document.getElementById('ambient-sound-toggle');
    const panelBtn = document.getElementById('sound-play-toggle-btn');
    if (headerBtn) headerBtn.classList.toggle('playing', playing);
    if (panelBtn) {
      panelBtn.classList.toggle('playing', playing);
      panelBtn.textContent = playing ? 'Durdur ⏸' : 'Oynat ▷';
    }
  }

  function playGongTone() {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, ctx.currentTime);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.5);
    } catch (e) {}
  }

  // =========================================================================
  // 8. DUAL-ENGINE: CIRCULAR POMODORO & YKS DENEME SINAVI MOTORU (TYT & AYT)
  // =========================================================================
  const CIRCLE_CIRCUMFERENCE = 552.92; // 2 * PI * 88

  function setEngine(engine) {
    state.pomodoro.engine = engine;
    document.getElementById('mode-tab-pomodoro').classList.toggle('active', engine === 'pomodoro');
    document.getElementById('mode-tab-exam').classList.toggle('active', engine === 'exam');

    const pomodoroControls = document.getElementById('pomodoro-segmented-controls');
    const examControls = document.getElementById('exam-segmented-controls');
    const branchBox = document.getElementById('branch-custom-box');
    const finishExamBtn = document.getElementById('finish-exam-now-btn');
    const headerTag = document.getElementById('timer-card-header-tag');

    if (engine === 'exam') {
      if (pomodoroControls) pomodoroControls.classList.add('hidden');
      if (examControls) examControls.classList.remove('hidden');
      if (finishExamBtn) finishExamBtn.classList.remove('hidden');
      if (headerTag) headerTag.textContent = 'FADİME — YKS DENEME SINAVI MOTORU';
      setExamMode(state.pomodoro.examType || 'tyt');
    } else {
      if (pomodoroControls) pomodoroControls.classList.remove('hidden');
      if (examControls) examControls.classList.add('hidden');
      if (branchBox) branchBox.classList.add('hidden');
      if (finishExamBtn) finishExamBtn.classList.add('hidden');
      if (headerTag) headerTag.textContent = 'FADİME — ODAKLANMA ALANI (POMODORO)';
      setTimerMode(state.pomodoro.mode || '25-5');
    }
  }

  function setTimerMode(mode) {
    state.pomodoro.mode = mode;
    document.querySelectorAll('#pomodoro-segmented-controls .seg-btn').forEach(btn => {
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

  function setExamMode(examType) {
    state.pomodoro.examType = examType;
    document.querySelectorAll('#exam-segmented-controls .seg-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-exam-mode') === examType);
    });

    const branchBox = document.getElementById('branch-custom-box');
    if (examType === 'tyt') {
      if (branchBox) branchBox.classList.add('hidden');
      state.pomodoro.durationMinutes = 165;
      state.pomodoro.remainingSeconds = 165 * 60;
      document.getElementById('timer-mode-label').textContent = 'TYT DENEMESİ (165 DK)';
    } else if (examType === 'ayt') {
      if (branchBox) branchBox.classList.add('hidden');
      state.pomodoro.durationMinutes = 180;
      state.pomodoro.remainingSeconds = 180 * 60;
      document.getElementById('timer-mode-label').textContent = 'AYT DENEMESİ (180 DK)';
    } else {
      if (branchBox) branchBox.classList.remove('hidden');
      const customMin = parseInt(document.getElementById('branch-duration-input').value, 10) || 45;
      const customName = document.getElementById('branch-name-input').value || 'Branş Denemesi';
      state.pomodoro.durationMinutes = customMin;
      state.pomodoro.remainingSeconds = customMin * 60;
      state.pomodoro.branchName = customName;
      document.getElementById('timer-mode-label').textContent = `${customName.toUpperCase()} (${customMin} DK)`;
    }

    resetTimer();
  }

  function startPauseTimer() {
    const btn = document.getElementById('timer-start-pause-btn');
    if (state.pomodoro.isRunning) {
      clearInterval(state.pomodoro.intervalId);
      state.pomodoro.isRunning = false;
      btn.textContent = 'Devam Et ▷';
      setupMediaSession();
    } else {
      state.pomodoro.isRunning = true;
      btn.textContent = 'Duraklat ⏸';
      setupMediaSession();

      state.pomodoro.intervalId = setInterval(() => {
        if (state.pomodoro.remainingSeconds > 0) {
          state.pomodoro.remainingSeconds--;
          updateTimerDisplay();
          setupMediaSession(); // updates lock-screen notification live
        } else {
          clearInterval(state.pomodoro.intervalId);
          state.pomodoro.isRunning = false;
          btn.textContent = 'Başlat ▷';
          playGongTone();
          triggerConfetti();

          if (state.pomodoro.engine === 'exam') {
            const eName = state.pomodoro.examType === 'tyt' ? 'TYT Denemesi' : (state.pomodoro.examType === 'ayt' ? 'AYT Denemesi' : (state.pomodoro.branchName || 'Branş Denemesi'));
            openExamNetModal(state.pomodoro.examType, eName);
          } else {
            alert('Tebrikler! Odaklanma seansını başarıyla tamamladın.');
            if (currentAuth && currentAuth.role === 'fadime') {
              state.users.fadime.todayFocusMinutes = (state.users.fadime.todayFocusMinutes || 0) + state.pomodoro.durationMinutes;
              syncUserToFirestore('fadime');
              updateStudentOverview();
            }
          }
          setupMediaSession();
        }
      }, 1000);
    }
  }

  function resetTimer() {
    if (state.pomodoro.intervalId) clearInterval(state.pomodoro.intervalId);
    state.pomodoro.isRunning = false;
    const btn = document.getElementById('timer-start-pause-btn');
    if (btn) btn.textContent = 'Başlat ▷';

    if (state.pomodoro.engine === 'exam') {
      if (state.pomodoro.examType === 'tyt') state.pomodoro.remainingSeconds = 165 * 60;
      else if (state.pomodoro.examType === 'ayt') state.pomodoro.remainingSeconds = 180 * 60;
      else {
        const customMin = parseInt(document.getElementById('branch-duration-input').value, 10) || 45;
        state.pomodoro.remainingSeconds = customMin * 60;
      }
    } else {
      if (state.pomodoro.mode === '25-5') state.pomodoro.remainingSeconds = 25 * 60;
      else if (state.pomodoro.mode === '50-10') state.pomodoro.remainingSeconds = 50 * 60;
      else state.pomodoro.remainingSeconds = 90 * 60;
    }

    updateTimerDisplay();
    setupMediaSession();
  }

  function formatTimerDigits(totalSec) {
    const hours = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function updateTimerDisplay() {
    const formatted = formatTimerDigits(state.pomodoro.remainingSeconds);
    const digitsEl = document.getElementById('timer-digits');
    if (digitsEl) digitsEl.textContent = formatted;

    const ring = document.getElementById('timer-progress-ring');
    if (ring) {
      const totalSeconds = state.pomodoro.durationMinutes * 60;
      const progressRatio = totalSeconds > 0 ? (totalSeconds - state.pomodoro.remainingSeconds) / totalSeconds : 0;
      const offset = CIRCLE_CIRCUMFERENCE - (progressRatio * CIRCLE_CIRCUMFERENCE);
      ring.style.strokeDashoffset = offset;
    }
  }

  // =========================================================================
  // 8B. YKS DENEME SINAV BİTİŞ & NET KARTI ENGINE (TYT & AYT)
  // =========================================================================
  const EXAM_COURSE_TEMPLATES = {
    tyt: [
      { id: 'tyt_turkce', name: 'Türkçe', max: 40 },
      { id: 'tyt_sosyal', name: 'Sosyal Bilimler', max: 20 },
      { id: 'tyt_mat', name: 'Temel Matematik', max: 40 },
      { id: 'tyt_fen', name: 'Fen Bilimleri', max: 20 }
    ],
    ayt: [
      { id: 'ayt_mat', name: 'AYT Matematik & Geo', max: 40 },
      { id: 'ayt_fizik', name: 'Fizik', max: 14 },
      { id: 'ayt_kimya', name: 'Kimya', max: 13 },
      { id: 'ayt_biyo', name: 'Biyoloji', max: 13 }
    ],
    branch: [
      { id: 'branch_single', name: 'Branş Dersi', max: 40 }
    ]
  };

  let currentModalExamType = 'tyt';

  function openExamNetModal(examType, defaultName) {
    currentModalExamType = examType || 'tyt';
    const modal = document.getElementById('exam-result-modal-overlay');
    const badge = document.getElementById('modal-exam-type-badge');
    const nameInput = document.getElementById('exam-name-input');

    if (badge) {
      badge.textContent = currentModalExamType === 'tyt' ? 'TYT Denemesi' : (currentModalExamType === 'ayt' ? 'AYT Denemesi' : 'Branş Denemesi');
    }
    if (nameInput) {
      nameInput.value = defaultName || (currentModalExamType === 'tyt' ? '3D Türkiye Geneli TYT Deneme-1' : 'Apotemi AYT Denemesi');
    }

    document.querySelectorAll('.exam-type-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-type') === currentModalExamType);
    });

    renderExamCourseInputs();
    calculateModalNets();
    if (modal) modal.classList.remove('hidden');
  }

  function renderExamCourseInputs() {
    const container = document.getElementById('exam-courses-container');
    if (!container) return;
    container.innerHTML = '';

    const template = EXAM_COURSE_TEMPLATES[currentModalExamType] || EXAM_COURSE_TEMPLATES.tyt;
    template.forEach(c => {
      const row = document.createElement('div');
      row.className = 'course-input-row';
      row.innerHTML = `
        <div class="course-name-col">${c.name} (${c.max} Soru)</div>
        <div class="input-num-wrap">
          <label>D:</label>
          <input type="number" min="0" max="${c.max}" value="0" data-course-d="${c.id}" class="exam-d-input">
        </div>
        <div class="input-num-wrap">
          <label>Y:</label>
          <input type="number" min="0" max="${c.max}" value="0" data-course-y="${c.id}" class="exam-y-input">
        </div>
        <div class="course-net-badge" id="net-badge-${c.id}">0.00 Net</div>
      `;
      container.appendChild(row);
    });

    container.querySelectorAll('input').forEach(inp => {
      inp.addEventListener('input', calculateModalNets);
    });
  }

  function calculateModalNets() {
    const template = EXAM_COURSE_TEMPLATES[currentModalExamType] || EXAM_COURSE_TEMPLATES.tyt;
    let totalCorrect = 0;
    let totalWrong = 0;
    let totalNet = 0;

    template.forEach(c => {
      const dInp = document.querySelector(`[data-course-d="${c.id}"]`);
      const yInp = document.querySelector(`[data-course-y="${c.id}"]`);
      const badge = document.getElementById(`net-badge-${c.id}`);

      const d = dInp ? parseInt(dInp.value, 10) || 0 : 0;
      const y = yInp ? parseInt(yInp.value, 10) || 0 : 0;
      const courseNet = Math.max(0, d - (y / 4));

      totalCorrect += d;
      totalWrong += y;
      totalNet += courseNet;

      if (badge) badge.textContent = `${courseNet.toFixed(2)} Net`;
    });

    const totalCEl = document.getElementById('modal-total-correct');
    const totalWEl = document.getElementById('modal-total-wrong');
    const totalNEl = document.getElementById('modal-total-net');

    if (totalCEl) totalCEl.textContent = totalCorrect;
    if (totalWEl) totalWEl.textContent = totalWrong;
    if (totalNEl) totalNEl.textContent = totalNet.toFixed(2);
  }

  function saveExamResult() {
    const nameInput = document.getElementById('exam-name-input');
    const examName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : 'YKS Deneme Sınavı';

    const template = EXAM_COURSE_TEMPLATES[currentModalExamType] || EXAM_COURSE_TEMPLATES.tyt;
    const courses = [];
    let totalCorrect = 0;
    let totalWrong = 0;
    let totalNet = 0;

    template.forEach(c => {
      const dInp = document.querySelector(`[data-course-d="${c.id}"]`);
      const yInp = document.querySelector(`[data-course-y="${c.id}"]`);
      const d = dInp ? parseInt(dInp.value, 10) || 0 : 0;
      const y = yInp ? parseInt(yInp.value, 10) || 0 : 0;
      const courseNet = Math.max(0, d - (y / 4));
      totalCorrect += d;
      totalWrong += y;
      totalNet += courseNet;
      courses.push({ id: c.id, name: c.name, correct: d, wrong: y, net: parseFloat(courseNet.toFixed(2)) });
    });

    const examRecord = {
      id: 'exam-' + Date.now(),
      name: examName,
      type: currentModalExamType,
      date: new Date().toISOString().split('T')[0],
      totalCorrect,
      totalWrong,
      totalNet: parseFloat(totalNet.toFixed(2)),
      courses,
      timestamp: Date.now()
    };

    if (db) {
      db.collection('tulpiflow_users').doc('fadime').collection('exam_results').doc(examRecord.id).set(examRecord);
      db.collection('tulpiflow_events').add({
        type: 'exam_completed',
        examName: examRecord.name,
        totalNet: examRecord.totalNet,
        timestamp: Date.now()
      });
    }

    state.exams.unshift(examRecord);
    renderExamHistory();

    const modal = document.getElementById('exam-result-modal-overlay');
    if (modal) modal.classList.add('hidden');

    triggerConfetti();
    showCelebrationModal('Tebrikler Fadime!', `"${examRecord.name}" denemesini tamamladın. Toplam Net: ${examRecord.totalNet}. Sonuç Mentör Anıl'a başarıyla iletildi.`);
  }

  function renderExamHistory() {
    const listFadime = document.getElementById('fadime-exam-history-list');
    const listAnil = document.getElementById('anil-student-exam-history');
    const mentorBadge = document.getElementById('mentor-exam-count-badge');

    if (mentorBadge) mentorBadge.textContent = `${state.exams.length} Deneme`;

    const html = state.exams.length === 0 ? `
      <div class="empty-exam-state">Henüz kaydedilmiş deneme sınavı sonucu bulunmuyor. Yeni bir deneme başlatıp netlerini kaydedebilirsin.</div>
    ` : state.exams.map(e => `
      <div class="exam-result-item">
        <div class="exam-item-left">
          <span class="exam-item-title">${e.name}</span>
          <div class="exam-item-meta">
            <span>📅 ${e.date}</span>
            <span>🎯 ${e.type ? e.type.toUpperCase() : 'YKS'}</span>
            <span>✅ ${e.totalCorrect}D / ❌ ${e.totalWrong}Y</span>
          </div>
          <div class="exam-item-breakdown">
            ${(e.courses || []).map(c => `${c.name}: ${c.net}N`).join(' • ')}
          </div>
        </div>
        <div class="exam-item-right">
          <span class="net-score-pill">${e.totalNet} Net</span>
        </div>
      </div>
    `).join('');

    if (listFadime) listFadime.innerHTML = html;
    if (listAnil) listAnil.innerHTML = html;
  }

  function showMentorLiveAlert(ev) {
    const banner = document.getElementById('mentor-live-alert-banner');
    const titleEl = document.getElementById('mentor-alert-title');
    const descEl = document.getElementById('mentor-alert-desc');

    if (!banner) return;
    if (ev.type === 'exam_completed') {
      if (titleEl) titleEl.textContent = '🎉 Fadime Yeni Bir Deneme Tamamladı!';
      if (descEl) descEl.textContent = `Fadime "${ev.examName}" denemesini tamamladı: Toplam ${ev.totalNet} Net!`;
    } else if (ev.type === 'topic_completed') {
      if (titleEl) titleEl.textContent = '⭐ Fadime Bir Konuyu Bitirdi!';
      if (descEl) descEl.textContent = `Fadime "${ev.topicTitle}" konusunu başarıyla tamamladı!`;
    }

    banner.classList.remove('hidden');
  }

  // =========================================================================
  // 9. YKS MÜFREDATI, AKORDEON & ÖZELLEŞTİRİLEBİLİR KONU AĞACI
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

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      try {
        window.location.href = intentUrl;
        setTimeout(() => {
          window.open(webUrl, '_blank');
        }, 1200);
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
            <button class="subtopic-add-btn" data-add-to-topic="${topic.id}">+ Bu Üniteye Alt Konu Ekle</button>
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

    // Add inline subtopic button
    container.querySelectorAll('[data-add-to-topic]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const topicId = btn.getAttribute('data-add-to-topic');
        openAddCustomTopicModal(null, topicId);
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
    updateStudentOverview();

    if (isDone) {
      triggerConfetti();
      showCelebrationModal('Tebrikler Fadime!', `"${changedTitle}" konusunu başarıyla tamamladın. Derece hedefine kararlılıkla ilerliyorsun.`);

      if (db) {
        db.collection('tulpiflow_events').add({
          type: 'topic_completed',
          topicTitle: changedTitle,
          timestamp: Date.now()
        });
      }
    }
  }

  function openAddCustomTopicModal(subjectId, specificTopicId) {
    const modal = document.getElementById('add-custom-topic-modal-overlay');
    const subjSelect = document.getElementById('custom-topic-subject-select');
    const unitSelect = document.getElementById('custom-topic-unit-select');

    if (subjectId && subjSelect) subjSelect.value = subjectId;

    function populateUnits() {
      const selectedSubj = subjSelect.value;
      const units = state.topicTree.filter(t => t.category === selectedSubj);
      unitSelect.innerHTML = units.map(u => `<option value="${u.id}" ${u.id === specificTopicId ? 'selected' : ''}>${u.title}</option>`).join('');
    }

    if (subjSelect) {
      subjSelect.onchange = populateUnits;
      populateUnits();
    }

    if (modal) modal.classList.remove('hidden');
  }

  function saveCustomTopic() {
    const unitId = document.getElementById('custom-topic-unit-select').value;
    const titleInput = document.getElementById('custom-topic-title-input');
    const ytInput = document.getElementById('custom-topic-yt-input');

    const title = (titleInput && titleInput.value.trim()) ? titleInput.value.trim() : '';
    const ytQuery = (ytInput && ytInput.value.trim()) ? ytInput.value.trim() : `${title} YKS`;

    if (!title) {
      alert('Lütfen yeni alt konu başlığı girin.');
      return;
    }

    let found = false;
    state.topicTree.forEach(top => {
      if (top.id === unitId) {
        if (!top.subtopics) top.subtopics = [];
        top.subtopics.push({
          id: 'custom-' + Date.now(),
          title: title,
          completed: false,
          query: ytQuery,
          intentUrl: '',
          webUrl: ''
        });
        found = true;
      }
    });

    if (found) {
      syncCurriculumToFirestore();
      renderTopicTree();
      document.getElementById('add-custom-topic-modal-overlay').classList.add('hidden');
      if (titleInput) titleInput.value = '';
      if (ytInput) ytInput.value = '';
      alert('Yeni alt konu başarıyla müfredata eklendi!');
    }
  }

  // =========================================================================
  // 10. COACH TASKS (⭐ ANIL'DAN GELEN GÖREVLER)
  // =========================================================================
  function renderCoachTasks() {
    const container = document.getElementById('fadime-coach-tasks-list');
    const badge = document.getElementById('coach-task-count-badge');
    if (!container) return;

    const coachTasks = state.tasks.filter(t => t.assignedTo === 'fadime');
    const pendingCount = coachTasks.filter(t => !t.completed).length;
    if (badge) badge.textContent = `${pendingCount} Bekleyen`;

    if (coachTasks.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>Henüz atanmış koç görevi bulunmuyor. Mentörün Anıl çalışma planına göre sana hedefler atayacaktır.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = coachTasks.map(t => `
      <div class="coach-task-row ${t.completed ? 'completed' : ''}" data-task-id="${t.id}">
        <label class="coach-task-checkbox-label">
          <input type="checkbox" ${t.completed ? 'checked' : ''} data-coach-check="${t.id}">
          <span class="custom-checkbox"></span>
        </label>
        <div class="coach-task-content">
          <span class="coach-task-title">${t.title}</span>
          <div class="coach-task-meta">
            <span class="priority-tag ${t.priority}">${t.priority === 'high' ? 'Yüksek' : 'Normal'}</span>
            <span class="date-tag">📅 ${t.date}</span>
          </div>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('[data-coach-check]').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const taskId = e.target.getAttribute('data-coach-check');
        toggleTaskCompleted(taskId, e.target.checked);
      });
    });
  }

  function toggleTaskCompleted(taskId, isDone) {
    state.tasks.forEach(t => {
      if (t.id === taskId) {
        t.completed = isDone;
        if (db) {
          db.collection('tasks').doc(taskId).update({ completed: isDone }).catch(err => console.warn(err));
        }
      }
    });

    renderTasks();
    renderCoachTasks();
    renderWeekMatrix();
    updateStudentOverview();

    if (isDone) {
      triggerConfetti();
      showCelebrationModal('Harika İlerleme!', 'Mentör görevini başarıyla tamamladın.');
    }
  }

  // =========================================================================
  // 11. S.O.S. ALERTS & LIVE PRESENCE
  // =========================================================================
  function renderSosBanner() {
    const banner = document.getElementById('sos-alert-banner');
    const msgEl = document.getElementById('sos-message-text');
    if (!banner) return;

    if (state.users.fadime.sosActive) {
      banner.classList.remove('hidden');
      if (msgEl) {
        msgEl.textContent = `Fadime şu konuda desteğe ihtiyaç duyuyor: "${state.users.fadime.sosTopic || ''} — ${state.users.fadime.sosMessage || ''}"`;
      }
    } else {
      banner.classList.add('hidden');
    }
  }

  function updateMentorPresenceBanner() {
    const txt = document.getElementById('mentor-presence-text');
    if (txt && state.users.anil) {
      txt.textContent = `Anıl: ${state.users.anil.statusText || 'Deep Work Modu'} (Aktif)`;
    }
  }

  function updateStudentOverview() {
    const minsEl = document.getElementById('overview-fadime-minutes');
    const streakEl = document.getElementById('overview-fadime-streak');
    const topicsEl = document.getElementById('overview-fadime-topics');
    const sosEl = document.getElementById('overview-fadime-sos');

    const fMinsEl = document.getElementById('fadime-today-minutes');
    const fStreakEl = document.getElementById('fadime-streak-days');
    const fTasksEl = document.getElementById('fadime-completed-tasks');

    let totalSubtopics = 0;
    let completedSubtopics = 0;
    state.topicTree.forEach(top => {
      (top.subtopics || []).forEach(sub => {
        totalSubtopics++;
        if (sub.completed) completedSubtopics++;
      });
    });

    const pendingTasks = state.tasks.filter(t => t.assignedTo === 'fadime');
    const doneTasks = pendingTasks.filter(t => t.completed).length;

    const streak = state.users.fadime.streakDays || 0;
    const mins = state.users.fadime.todayFocusMinutes || 0;

    if (minsEl) minsEl.textContent = `${mins} dk`;
    if (streakEl) streakEl.textContent = `${streak} Gün`;
    if (topicsEl) topicsEl.textContent = `${completedSubtopics} / ${totalSubtopics}`;
    if (sosEl) {
      if (state.users.fadime.sosActive) {
        sosEl.textContent = 'Yardım Çağrısı!';
        sosEl.className = 'stat-num text-danger';
      } else {
        sosEl.textContent = 'Temiz';
        sosEl.className = 'stat-num text-emerald';
      }
    }

    if (fMinsEl) fMinsEl.textContent = `${mins} dk`;
    if (fStreakEl) fStreakEl.textContent = `${streak} Gün`;
    if (fTasksEl) fTasksEl.textContent = `${doneTasks} / ${pendingTasks.length}`;

    // Update Heatmap summary
    const heatFadimeHours = document.getElementById('heat-fadime-hours');
    const heatFadimeTopics = document.getElementById('heat-fadime-topics');
    const heatAnilHours = document.getElementById('heat-anil-hours');
    const heatAnilSprints = document.getElementById('heat-anil-sprints');

    if (heatFadimeHours) heatFadimeHours.textContent = `${Math.round(mins / 60)} Saat`;
    if (heatFadimeTopics) heatFadimeTopics.textContent = `${completedSubtopics} Konu`;
    if (heatAnilHours) heatAnilHours.textContent = `${Math.round((state.users.anil.todayFocusMinutes || 0) / 60)} Saat`;
    if (heatAnilSprints) heatAnilSprints.textContent = `${state.anilSprints.filter(s => s.done).length} Modül`;
  }

  // =========================================================================
  // 12. NON-BLOCKING ELEGANT MICRO-TOOLTIP TOUR (REPLACES SPOTLIGHT)
  // =========================================================================
  const TUTORIAL_STEPS = [
    {
      targetId: 'timer-card-target',
      title: 'Odak & Deneme Motoru',
      desc: '25/5 Pomodoro veya TYT/AYT deneme sayaçlarını buradan başlatabilir, odak seslerini açabilirsin.'
    },
    {
      targetId: 'ambient-sound-toggle',
      title: 'Focus Shield Odak Sesleri',
      desc: 'Yağmur, Kamp Ateşi, Okyanus ve Pembe Gürültü ambiyansı ekran kapalıyken de bildirim kartından çalar.'
    },
    {
      targetId: 'topic-tree-target',
      title: 'YKS Müfredatı & Özel Konular',
      desc: 'Tüm TYT-AYT konuları ve YouTube dersleri burada. "+ Yeni Alt Konu Ekle" butonuyla kendi eksiklerini ekleyebilirsin.'
    },
    {
      targetId: 'trigger-sos-btn',
      title: 'S.O.S. Acil Yardım Çağrısı',
      desc: 'Takıldığın konuyu tek tıkla mentörün Anıl\'a anlık iletebilirsin.'
    },
    {
      targetId: 'user-avatar-btn',
      title: 'Profil & Koyu/Açık Tema',
      desc: 'Kullanıcı menüsünden temayı değiştirebilir veya rehberi dilediğin zaman yeniden başlatabilirsin.'
    }
  ];

  let currentTutorialStep = 0;

  function startTutorial() {
    currentTutorialStep = 0;
    const wrap = document.getElementById('tutorial-tooltip-container');
    if (wrap) wrap.classList.remove('hidden');
    renderTutorialStep();
  }

  function renderTutorialStep() {
    if (currentTutorialStep >= TUTORIAL_STEPS.length) {
      closeTutorial();
      return;
    }

    document.querySelectorAll('.tooltip-target-highlight').forEach(el => el.classList.remove('tooltip-target-highlight'));

    const step = TUTORIAL_STEPS[currentTutorialStep];
    const targetEl = document.getElementById(step.targetId);
    const wrap = document.getElementById('tutorial-tooltip-container');
    const card = document.getElementById('tutorial-tooltip-card');
    const stepTag = document.getElementById('tutorial-step-tag');
    const titleEl = document.getElementById('tutorial-title');
    const descEl = document.getElementById('tutorial-desc');
    const prevBtn = document.getElementById('tutorial-prev-btn');
    const nextBtn = document.getElementById('tutorial-next-btn');

    if (stepTag) stepTag.textContent = `ADIM ${currentTutorialStep + 1} / ${TUTORIAL_STEPS.length}`;
    if (titleEl) titleEl.textContent = step.title;
    if (descEl) descEl.textContent = step.desc;
    if (prevBtn) prevBtn.classList.toggle('hidden', currentTutorialStep === 0);
    if (nextBtn) {
      nextBtn.textContent = (currentTutorialStep === TUTORIAL_STEPS.length - 1) ? 'Tamamla 🚀' : 'Sonraki ➔';
    }

    if (targetEl && card && wrap) {
      targetEl.classList.add('tooltip-target-highlight');
      const rect = targetEl.getBoundingClientRect();

      let top = rect.bottom + 10;
      let left = Math.max(12, Math.min(window.innerWidth - 324, rect.left));

      if (top + 180 > window.innerHeight) {
        top = Math.max(12, rect.top - 170);
      }

      card.style.top = `${top}px`;
      card.style.left = `${left}px`;
    }
  }

  function closeTutorial() {
    const wrap = document.getElementById('tutorial-tooltip-container');
    if (wrap) wrap.classList.add('hidden');
    document.querySelectorAll('.tooltip-target-highlight').forEach(el => el.classList.remove('tooltip-target-highlight'));
    localStorage.setItem(TUTORIAL_KEY, 'true');
  }

  // =========================================================================
  // 13. NATURAL LANGUAGE INTENT PARSER & WEB SPEECH API
  // =========================================================================
  let recognition = null;
  function initSpeechRecognition() {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionClass) return null;
    const r = new SpeechRecognitionClass();
    r.lang = 'tr-TR';
    r.continuous = false;
    r.interimResults = false;
    return r;
  }

  function toggleSpeechRecognition() {
    if (!recognition) recognition = initSpeechRecognition();
    if (!recognition) {
      alert('Tarayıcınız Web Speech ses tanıma API\'sini desteklemiyor. Lütfen metin kutusunu kullanın.');
      return;
    }

    const badge = document.getElementById('live-rec-badge');
    const statusText = document.getElementById('voice-status-text');

    recognition.onstart = () => {
      if (badge) badge.classList.remove('hidden');
      if (statusText) statusText.textContent = 'Dinleniyor... Konuştuğunuz konuyu tamamlayın...';
    };

    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      const input = document.getElementById('transcript-input');
      if (input) input.value = transcript;
      if (statusText) statusText.textContent = `Algılandı: "${transcript}"`;
      parseVoiceIntent(transcript);
    };

    recognition.onerror = () => {
      if (badge) badge.classList.add('hidden');
      if (statusText) statusText.textContent = 'Ses algılanamadı, lütfen tekrar deneyin.';
    };

    recognition.onend = () => {
      if (badge) badge.classList.add('hidden');
    };

    try {
      recognition.start();
    } catch (e) {
      recognition.stop();
    }
  }

  function parseVoiceIntent(text) {
    if (!text) return;
    const clean = text.toLowerCase();

    // Match keywords against curriculum
    let matchedSubId = null;
    let matchedTitle = '';

    state.topicTree.forEach(top => {
      (top.subtopics || []).forEach(sub => {
        const subTitle = sub.title.toLowerCase();
        const words = subTitle.split(' ').filter(w => w.length > 3);
        const match = words.some(w => clean.includes(w));
        if (match && !sub.completed) {
          matchedSubId = sub.id;
          matchedTitle = sub.title;
        }
      });
    });

    if (matchedSubId) {
      toggleSubtopicCompleted(matchedSubId, true);
      alert(`Sesli intent algılandı: "${matchedTitle}" tamamlandı olarak işaretlendi!`);
    } else {
      alert(`Cümle analiz edildi: "${text}". Müfredatta doğrudan eşleşen açık konu bulunamadı.`);
    }
  }

  // =========================================================================
  // 14. CONFETTI CELEBRATION ENGINE
  // =========================================================================
  const confettiCanvas = document.getElementById('confetti-canvas');
  let confettiCtx = null;
  let particles = [];
  let confettiAnimId = null;

  function triggerConfetti() {
    if (!confettiCanvas) return;
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    confettiCtx = confettiCanvas.getContext('2d');
    particles = [];

    const colors = ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b', '#38bdf8'];
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 18,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 8,
        life: 1.0
      });
    }

    if (confettiAnimId) cancelAnimationFrame(confettiAnimId);
    animateConfetti();
  }

  function animateConfetti() {
    if (!confettiCtx) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4;
      p.rotation += p.rSpeed;
      p.life -= 0.012;

      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rotation * Math.PI) / 180);
      confettiCtx.fillStyle = p.color;
      confettiCtx.globalAlpha = Math.max(0, p.life);
      confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      confettiCtx.restore();
    });

    particles = particles.filter(p => p.life > 0);
    if (particles.length > 0) {
      confettiAnimId = requestAnimationFrame(animateConfetti);
    } else {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }
  }

  function showCelebrationModal(title, desc) {
    const modal = document.getElementById('celebration-modal-overlay');
    const titleEl = document.getElementById('celebration-title');
    const descEl = document.getElementById('celebration-desc');
    if (titleEl && title) titleEl.textContent = title;
    if (descEl && desc) descEl.textContent = desc;
    if (modal) modal.classList.remove('hidden');
  }

  // =========================================================================
  // 15. OPENING WOW SPLASH
  // =========================================================================
  function launchWowSplash() {
    const splash = document.getElementById('wow-splash-overlay');
    if (splash) {
      splash.classList.remove('hidden');
      setTimeout(() => {
        dismissSplash();
      }, 2000);
    }
  }

  function dismissSplash() {
    const splash = document.getElementById('wow-splash-overlay');
    if (splash) splash.classList.add('hidden');
  }

  // =========================================================================
  // 16. RENDERING MISC LISTS (TASKS, MISTAKES, SPRINTS, HEATMAP)
  // =========================================================================
  function renderTasks() {
    const container = document.getElementById('calendar-tasks-list');
    if (!container) return;

    let list = state.tasks;
    if (taskFilter === 'fadime') list = list.filter(t => t.assignedTo === 'fadime');
    else if (taskFilter === 'anil') list = list.filter(t => t.assignedTo === 'anil');

    if (list.length === 0) {
      container.innerHTML = `<div class="empty-state"><p>Bu filtrede planlanmış görev yok.</p></div>`;
      return;
    }

    container.innerHTML = list.map(t => `
      <div class="calendar-task-card ${t.completed ? 'completed' : ''}" data-task-id="${t.id}">
        <div class="cal-task-top">
          <span class="user-pill ${t.assignedTo}">${t.assignedTo === 'fadime' ? 'Fadime' : 'Anıl'}</span>
          <span class="priority-tag ${t.priority}">${t.priority}</span>
        </div>
        <div class="cal-task-title">${t.title}</div>
        <div class="cal-task-footer">
          <span>📅 ${t.date}</span>
          <button class="ghost-btn btn-sm" data-toggle-task="${t.id}">${t.completed ? 'Tamamlandı ✓' : 'Bitir'}</button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('[data-toggle-task]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-toggle-task');
        const task = state.tasks.find(t => t.id === id);
        if (task) toggleTaskCompleted(id, !task.completed);
      });
    });
  }

  function renderWeekMatrix() {
    const grid = document.getElementById('week-matrix-grid');
    if (!grid) return;

    const days = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
    grid.innerHTML = days.map((day, idx) => `
      <div class="matrix-day-cell">
        <div class="matrix-day-name">${day}</div>
        <div class="matrix-day-tasks" id="matrix-day-${idx}">
          <span class="matrix-dot fadime-dot" title="Fadime"></span>
          <span class="matrix-dot anil-dot" title="Anıl"></span>
        </div>
      </div>
    `).join('');
  }

  function renderAnilSprints() {
    const container = document.getElementById('anil-sprints-container');
    if (!container) return;

    if (state.anilSprints.length === 0) {
      container.innerHTML = `<div class="empty-state"><p>Henüz planlanmış sprint yok.</p></div>`;
      return;
    }

    container.innerHTML = state.anilSprints.map(s => `
      <div class="sprint-item ${s.done ? 'completed' : ''}" data-sprint-id="${s.id}">
        <label class="sprint-label">
          <input type="checkbox" ${s.done ? 'checked' : ''} data-sprint-check="${s.id}">
          <span>${s.text}</span>
        </label>
      </div>
    `).join('');

    container.querySelectorAll('[data-sprint-check]').forEach(chk => {
      chk.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-sprint-check');
        state.anilSprints.forEach(s => {
          if (s.id === id) s.done = e.target.checked;
        });
        syncSprintsToFirestore();
        renderAnilSprints();
      });
    });
  }

  function renderMistakes() {
    const container = document.getElementById('mistake-list-container');
    if (!container) return;

    if (state.mistakes.length === 0) {
      container.innerHTML = `<div class="empty-state"><p>Hata defterinde kayıtlı soru yok.</p></div>`;
      return;
    }

    container.innerHTML = state.mistakes.map(m => `
      <div class="mistake-card ${m.solved ? 'solved' : ''}">
        <div class="mistake-header">
          <span class="mistake-topic">${m.topic}</span>
          <span class="mistake-status-tag ${m.solved ? 'solved' : 'pending'}">${m.solved ? 'Çözüldü ✓' : 'Bekliyor'}</span>
        </div>
        <p class="mistake-body">${m.note}</p>
        <div class="mistake-footer">
          <span>📅 ${m.createdAt}</span>
          <button class="ghost-btn btn-sm" data-toggle-mistake="${m.id}">${m.solved ? 'Tekrar Aç' : 'Çözüldü İşaretle'}</button>
        </div>
      </div>
    `).join('');

    container.querySelectorAll('[data-toggle-mistake]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-toggle-mistake');
        state.mistakes.forEach(m => {
          if (m.id === id) m.solved = !m.solved;
        });
        syncMistakesToFirestore();
        renderMistakes();
      });
    });
  }

  function renderHeatmap() {
    const grid = document.getElementById('heatmap-grid');
    if (!grid) return;

    let html = '';
    for (let i = 0; i < 365; i++) {
      const lvl = (i % 7 === 0 && i < 30) ? (i % 4) : 0;
      html += `<div class="heat-cell lvl-${lvl}" title="Gün ${i + 1}"></div>`;
    }
    grid.innerHTML = html;
  }

  function exportDataAsJSON() {
    const backup = {
      version: CURRENT_APP_VERSION,
      exportDate: new Date().toISOString(),
      topicTree: state.topicTree,
      tasks: state.tasks,
      mistakes: state.mistakes,
      anilSprints: state.anilSprints,
      exams: state.exams,
      users: state.users
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tulpiflow_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importDataFromJSON(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (imported.topicTree && imported.tasks) {
          state.topicTree = imported.topicTree;
          state.tasks = imported.tasks;
          state.mistakes = imported.mistakes || [];
          state.anilSprints = imported.anilSprints || [];
          state.exams = imported.exams || [];
          state.users = imported.users || state.users;

          syncCurriculumToFirestore();
          syncMistakesToFirestore();
          syncSprintsToFirestore();
          syncUserToFirestore('anil');
          syncUserToFirestore('fadime');

          initAllViews();
          alert('Yedek başarıyla içeri aktarıldı ve Firestore ile senkronize edildi.');
        }
      } catch (err) {
        alert('Geçersiz JSON dosyası.');
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
    renderExamHistory();
    updateStudentOverview();
    updateTimerDisplay();
  }

  document.addEventListener('DOMContentLoaded', () => {

    function safeOn(idOrEl, event, handler) {
      const el = (typeof idOrEl === 'string') ? document.getElementById(idOrEl) : idOrEl;
      if (el) el.addEventListener(event, handler);
    }

    // 0. Decoupled OTA In-App Update Engine (Directly on startup, independent of auth/passcode)
    checkAppUpdate();

    // 1. Initialize Theme & Swipe Navigation
    initTheme();
    initSwipeNavigation();

    // 2. Initialize Firestore Sync
    initFirestoreSync();

    // 3. Check Persistent Device Auth
    checkDeviceAuth();

    // 4. Passcode Modal Handlers
    safeOn('auth-submit-btn', 'click', () => {
      const code = document.getElementById('passcode-input').value;
      verifyPasscode(code);
    });
    safeOn('passcode-input', 'keydown', (e) => {
      if (e.key === 'Enter') verifyPasscode(e.target.value);
    });

    // 5. Header Avatar Dropdown
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

    // 6. WOW Splash
    safeOn('re-trigger-splash', 'click', launchWowSplash);
    safeOn('skip-splash-btn', 'click', dismissSplash);

    // 7. Ambient Focus Shield Controls
    safeOn('ambient-sound-toggle', 'click', () => toggleFocusShield());
    safeOn('sound-play-toggle-btn', 'click', () => toggleFocusShield());
    document.querySelectorAll('.sound-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        setSoundMode(chip.getAttribute('data-sound'));
      });
    });

    // 8. Dual-Engine Switcher: Pomodoro vs Exam
    safeOn('mode-tab-pomodoro', 'click', () => setEngine('pomodoro'));
    safeOn('mode-tab-exam', 'click', () => setEngine('exam'));

    // Pomodoro Mode Segmented buttons
    document.querySelectorAll('#pomodoro-segmented-controls .seg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setTimerMode(btn.getAttribute('data-mode'));
      });
    });

    // Exam Mode Segmented buttons
    document.querySelectorAll('#exam-segmented-controls .seg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        setExamMode(btn.getAttribute('data-exam-mode'));
      });
    });

    safeOn('branch-duration-input', 'input', () => {
      if (state.pomodoro.engine === 'exam' && state.pomodoro.examType === 'branch') {
        setExamMode('branch');
      }
    });

    safeOn('branch-name-input', 'input', () => {
      if (state.pomodoro.engine === 'exam' && state.pomodoro.examType === 'branch') {
        setExamMode('branch');
      }
    });

    // Timer actions
    safeOn('timer-start-pause-btn', 'click', startPauseTimer);
    safeOn('timer-reset-btn', 'click', () => {
      resetTimer();
      stopAmbientSynthesizer();
    });
    safeOn('finish-exam-now-btn', 'click', () => {
      const eName = state.pomodoro.examType === 'tyt' ? 'TYT Denemesi' : (state.pomodoro.examType === 'ayt' ? 'AYT Denemesi' : (state.pomodoro.branchName || 'Branş Denemesi'));
      openExamNetModal(state.pomodoro.examType, eName);
    });

    // 9. Exam Net Modal Handlers
    safeOn('manual-add-exam-btn', 'click', () => openExamNetModal('tyt', 'TYT Denemesi'));
    safeOn('save-exam-result-btn', 'click', saveExamResult);

    document.querySelectorAll('.exam-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentModalExamType = btn.getAttribute('data-type');
        document.querySelectorAll('.exam-type-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const badge = document.getElementById('modal-exam-type-badge');
        if (badge) badge.textContent = currentModalExamType === 'tyt' ? 'TYT Denemesi' : (currentModalExamType === 'ayt' ? 'AYT Denemesi' : 'Branş Denemesi');
        renderExamCourseInputs();
        calculateModalNets();
      });
    });

    // 10. Custom Subtopic Modal Handlers
    safeOn('open-add-custom-topic-btn', 'click', () => openAddCustomTopicModal());
    safeOn('save-custom-topic-btn', 'click', saveCustomTopic);

    // 11. Mentor Live Alert Dismiss
    safeOn('dismiss-mentor-alert-btn', 'click', () => {
      document.getElementById('mentor-live-alert-banner').classList.add('hidden');
    });

    // 12. Non-blocking Micro-Tooltip Handlers
    safeOn('tutorial-next-btn', 'click', () => {
      currentTutorialStep++;
      renderTutorialStep();
    });
    safeOn('tutorial-prev-btn', 'click', () => {
      if (currentTutorialStep > 0) {
        currentTutorialStep--;
        renderTutorialStep();
      }
    });
    safeOn('tutorial-skip-btn', 'click', closeTutorial);

    // 13. Voice Recognition
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

    // 14. Workspace Subtab Buttons (Fadime Segmented View)
    document.querySelectorAll('.ws-seg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sub = btn.getAttribute('data-subtab');
        if (sub) switchSubtab(sub);
      });
    });

    // 15. Curriculum Category Filters
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

    // 16. Calendar Filters
    document.querySelectorAll('.calendar-filters .filter-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        document.querySelectorAll('.calendar-filters .filter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        taskFilter = pill.getAttribute('data-calfilter');
        renderTasks();
      });
    });

    // 17. S.O.S. Trigger & Resolve
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

    // 18. Mentor Cheer / Encouragement
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

    // 19. Delegate Task to Fadime
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

    // 20. Add Sprint for Anıl
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

    // 21. Modal Closers
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
        state.exams = JSON.parse(JSON.stringify(INITIAL_EXAMS));
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
