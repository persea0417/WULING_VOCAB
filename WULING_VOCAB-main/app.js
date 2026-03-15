// ===================================================================
// VocabMaster — Main App Controller
// ===================================================================

import { builtInWords } from './data/words.js';
import { SpacedRepetition } from './modules/spaced-repetition.js';
import { LearningModule } from './modules/learning.js';
import { QuizModule } from './modules/quiz.js';
import { StatsModule } from './modules/stats.js';
import { ImportModule } from './modules/import.js';
import { WordBookModule } from './modules/wordbook.js';

const SETTINGS_KEY = 'vocabmaster_settings';

class VocabMasterApp {
  constructor() {
    this.builtInWords = builtInWords;
    this.currentPage = 'home';

    // Settings
    this.settings = this._loadSettings();

    // Modules
    this.sr = new SpacedRepetition();
    this.learning = new LearningModule(this);
    this.quiz = new QuizModule(this);
    this.stats = new StatsModule(this);
    this.importModule = new ImportModule(this);
    this.wordbook = new WordBookModule(this);

    // Init
    this._applyTheme();
    this._bindGlobalEvents();
    this._updateGreeting();
    this._updateHome();

    // Register service worker
    this._registerSW();

    console.log('🚀 VocabMaster initialized');
  }

  // ═══════════════════════════════════════════
  // Navigation
  // ═══════════════════════════════════════════

  navigateTo(pageId) {
    // Deactivate all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    // Activate target
    const page = document.getElementById('page-' + pageId);
    if (page) {
      page.classList.add('active');

      // iOS-like spring entrance — reset then animate
      page.style.transform = 'translateY(30px) scale(0.96)';
      page.style.opacity = '0';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          page.style.transform = '';
          page.style.opacity = '';
        });
      });
    }

    const tab = document.querySelector(`[data-page="${pageId}"]`);
    if (tab) {
      tab.classList.add('active');
      // Tab icon bounce
      const svg = tab.querySelector('svg');
      if (svg) {
        svg.style.transform = 'scale(1.35)';
        setTimeout(() => { svg.style.transform = ''; }, 300);
      }
    }

    this.currentPage = pageId;

    // Page-specific init
    if (pageId === 'home') this._updateHome();
    if (pageId === 'stats') {
      this.stats.updateStatsNumbers();
      this.stats.renderChart('stats-chart');
      this.stats.renderWordList('all', this.getActiveWords());
    }
    if (pageId === 'settings') {
      this._syncSettingsUI();
      this._renderBookList();
      this._updateImportTargetSelect();
    }
  }

  // ═══════════════════════════════════════════
  // Words
  // ═══════════════════════════════════════════

  /** Get all available words (built-in + custom) */
  getAllWords() {
    const custom = this.importModule.loadCustomWords();
    return [...this.builtInWords, ...custom];
  }

  /** Get words for the active book */
  getActiveWords() {
    return this.wordbook.getActiveWords(this.getAllWords());
  }

  // ═══════════════════════════════════════════
  // Speech
  // ═══════════════════════════════════════════

  speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.settings.voiceLang || 'en-US';
    utterance.rate = 0.85;
    utterance.pitch = 1;

    // Try to find a matching voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.startsWith(this.settings.voiceLang));
    if (preferred) utterance.voice = preferred;

    window.speechSynthesis.speak(utterance);
  }

  // ═══════════════════════════════════════════
  // Toast
  // ═══════════════════════════════════════════

  showToast(message, duration = 2000) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  // ═══════════════════════════════════════════
  // Daily Stats
  // ═══════════════════════════════════════════

  recordDailyStats(count) {
    this.stats.recordDaily(count);
  }

  // ═══════════════════════════════════════════
  // Settings
  // ═══════════════════════════════════════════

  _loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      return raw ? JSON.parse(raw) : {
        dailyGoal: 10,
        darkMode: true,
        voiceLang: 'en-US',
        autoSpeak: true
      };
    } catch {
      return { dailyGoal: 10, darkMode: true, voiceLang: 'en-US', autoSpeak: true };
    }
  }

  _saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
  }

  _applyTheme() {
    document.documentElement.dataset.theme = this.settings.darkMode ? 'dark' : 'light';
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.content = this.settings.darkMode ? '#0a0a0f' : '#f5f5fa';
    }
  }

  _syncSettingsUI() {
    const dailyValue = document.getElementById('daily-value');
    const toggleDark = document.getElementById('toggle-dark');
    const voiceSelect = document.getElementById('voice-select');
    const toggleAutoSpeak = document.getElementById('toggle-auto-speak');

    if (dailyValue) dailyValue.textContent = this.settings.dailyGoal;
    if (toggleDark) toggleDark.checked = this.settings.darkMode;
    if (voiceSelect) voiceSelect.value = this.settings.voiceLang;
    if (toggleAutoSpeak) toggleAutoSpeak.checked = this.settings.autoSpeak;
  }

  // ═══════════════════════════════════════════
  // Home Page
  // ═══════════════════════════════════════════

  _updateHome() {
    const activeWords = this.getActiveWords();
    const mastered = this.sr.getMasteredWords(activeWords).length;
    const learning = this.sr.getLearningWords(activeWords).length;
    const review = this.sr.getReviewWords(activeWords).length;
    const streak = this.stats.getStreak();

    // Animated counter update
    this._animateValueTo('home-learned', mastered);
    this._animateValueTo('home-learning', learning);
    this._animateValueTo('home-review', review);

    const streakCount = document.getElementById('streak-count');
    if (streakCount) streakCount.textContent = streak.count;

    const dailyGoalDisplay = document.getElementById('daily-goal-display');
    if (dailyGoalDisplay) dailyGoalDisplay.textContent = this.settings.dailyGoal;

    // Render book selector
    this._renderBookSelector();
  }

  // ═══════════════════════════════════════════
  // Word Book UI
  // ═══════════════════════════════════════════

  _renderBookSelector() {
    const container = document.getElementById('book-selector');
    if (!container) return;

    const books = this.wordbook.getBooks();
    const activeId = this.wordbook.getActiveBookId();
    const allWords = this.getAllWords();

    let html = `<button class="book-chip ${activeId === 'all' ? 'active' : ''}" data-book-id="all">
      <span class="chip-icon">📚</span> 全部
      <span class="chip-count">${allWords.length}</span>
    </button>`;

    for (const book of books) {
      const count = book.words.length;
      html += `<button class="book-chip ${activeId === book.id ? 'active' : ''}" data-book-id="${book.id}">
        <span class="chip-icon">${book.icon}</span> ${book.name}
        <span class="chip-count">${count}</span>
      </button>`;
    }

    container.innerHTML = html;

    // Bind click events
    container.querySelectorAll('.book-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const bookId = chip.dataset.bookId;
        this.wordbook.setActiveBookId(bookId);
        this._updateHome();
        this._springBounce(chip);
      });
    });
  }

  _renderBookList() {
    const container = document.getElementById('book-list');
    if (!container) return;

    const books = this.wordbook.getBooks();

    if (books.length === 0) {
      container.innerHTML = '<div class="empty-state"><p>尚未建立詞書</p></div>';
      return;
    }

    container.innerHTML = books.map((book, i) => `
      <div class="book-list-item" style="animation-delay:${i * 0.05}s">
        <div class="book-info">
          <span class="book-icon">${book.icon}</span>
          <div>
            <div class="book-name">${book.name}</div>
            <div class="book-count">${book.words.length} 個單字</div>
          </div>
        </div>
        ${book.id !== 'default' ? `<button class="book-delete" data-book-id="${book.id}" aria-label="刪除">🗑</button>` : ''}
      </div>
    `).join('');

    // Bind delete buttons
    container.querySelectorAll('.book-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        const bookId = btn.dataset.bookId;
        const book = this.wordbook.getBook(bookId);
        if (book && confirm(`確定要刪除詞書「${book.name}」嗎？單字不會被刪除。`)) {
          this.wordbook.deleteBook(bookId);
          this._renderBookList();
          this._renderBookSelector();
          this._updateImportTargetSelect();
          this.showToast('🗑️ 已刪除詞書');
        }
      });
    });
  }

  _updateImportTargetSelect() {
    const select = document.getElementById('import-target-book');
    if (!select) return;

    const books = this.wordbook.getBooks();
    const activeId = this.wordbook.getActiveBookId();

    select.innerHTML = books.map(b =>
      `<option value="${b.id}" ${b.id === activeId || (activeId === 'all' && b.id === 'default') ? 'selected' : ''}>${b.icon} ${b.name}</option>`
    ).join('');
  }

  _openCreateBookModal() {
    const overlay = document.getElementById('modal-overlay');
    const nameInput = document.getElementById('new-book-name');
    if (overlay) overlay.classList.add('active');
    if (nameInput) {
      nameInput.value = '';
      setTimeout(() => nameInput.focus(), 400);
    }
    // Reset icon selection
    document.querySelectorAll('.icon-option').forEach((opt, i) => {
      opt.classList.toggle('active', i === 0);
    });
  }

  _closeCreateBookModal() {
    const overlay = document.getElementById('modal-overlay');
    if (overlay) overlay.classList.remove('active');
  }

  _animateValueTo(elId, target) {
    const el = document.getElementById(elId);
    if (!el) return;
    const start = parseInt(el.textContent) || 0;
    if (start === target) return;

    const duration = 500;
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (target - start) * eased);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  _updateGreeting() {
    const hour = new Date().getHours();
    const el = document.getElementById('greeting');
    if (!el) return;

    let greeting;
    if (hour < 6) greeting = '夜深了 🌙';
    else if (hour < 12) greeting = '早安 ☀️';
    else if (hour < 18) greeting = '午安 🌤️';
    else greeting = '晚上好 🌙';

    el.textContent = greeting;
  }

  // ═══════════════════════════════════════════
  // Event Binding
  // ═══════════════════════════════════════════

  _bindGlobalEvents() {
    // ── Tab Navigation ──
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        if (page) this.navigateTo(page);
      });
    });

    // ── Home Actions ──
    document.getElementById('btn-start-learn')?.addEventListener('click', () => {
      const activeWords = this.getActiveWords();
      const newWords = this.sr.getNewWords(activeWords).slice(0, this.settings.dailyGoal);
      if (newWords.length === 0) {
        this.showToast('🎊 所有單字都已學過！試試複習吧');
        return;
      }
      this.navigateTo('learn');
      setTimeout(() => this.learning.start(newWords), 100);
    });

    document.getElementById('btn-start-review')?.addEventListener('click', () => {
      const activeWords = this.getActiveWords();
      let reviewWords = this.sr.getReviewWords(activeWords);
      if (reviewWords.length === 0) {
        reviewWords = this.sr.getLearningWords(activeWords).slice(0, this.settings.dailyGoal);
      }
      if (reviewWords.length === 0) {
        this.showToast('📭 暫無待複習的單字');
        return;
      }
      this.navigateTo('learn');
      setTimeout(() => this.learning.start(reviewWords), 100);
    });

    document.getElementById('btn-start-quiz')?.addEventListener('click', () => {
      const activeWords = this.getActiveWords();
      const allWords = this.getAllWords();
      const learnable = [...this.sr.getLearningWords(activeWords), ...this.sr.getMasteredWords(activeWords)];
      if (learnable.length < 4) {
        this.showToast('📝 至少需要學過 4 個單字才能測驗');
        return;
      }
      const quizWords = this._shuffle(learnable).slice(0, Math.min(learnable.length, 10));
      this.navigateTo('quiz');
      setTimeout(() => this.quiz.start(quizWords, allWords), 100);
    });

    // ── Back Buttons ──
    document.getElementById('learn-back')?.addEventListener('click', () => {
      this.navigateTo('home');
    });

    document.getElementById('quiz-back')?.addEventListener('click', () => {
      this.navigateTo('home');
    });

    // ── Settings ──
    document.getElementById('daily-minus')?.addEventListener('click', () => {
      this.settings.dailyGoal = Math.max(5, this.settings.dailyGoal - 5);
      document.getElementById('daily-value').textContent = this.settings.dailyGoal;
      this._saveSettings();
      // Button spring animation
      this._springBounce(document.getElementById('daily-minus'));
    });

    document.getElementById('daily-plus')?.addEventListener('click', () => {
      this.settings.dailyGoal = Math.min(50, this.settings.dailyGoal + 5);
      document.getElementById('daily-value').textContent = this.settings.dailyGoal;
      this._saveSettings();
      this._springBounce(document.getElementById('daily-plus'));
    });

    document.getElementById('toggle-dark')?.addEventListener('change', (e) => {
      this.settings.darkMode = e.target.checked;
      this._applyTheme();
      this._saveSettings();
    });

    document.getElementById('voice-select')?.addEventListener('change', (e) => {
      this.settings.voiceLang = e.target.value;
      this._saveSettings();
      this.speak('Hello');
    });

    document.getElementById('toggle-auto-speak')?.addEventListener('change', (e) => {
      this.settings.autoSpeak = e.target.checked;
      this._saveSettings();
    });

    document.getElementById('reset-btn')?.addEventListener('click', () => {
      if (confirm('確定要重設所有學習進度嗎？此動作無法復原！')) {
        this.sr.reset();
        this.stats.reset();
        this.wordbook.reset();
        this._updateHome();
        this.showToast('🗑️ 所有進度已重設');
      }
    });

    // ── Stats Word List Tabs ──
    document.querySelectorAll('.wl-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.wl-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.stats.renderWordList(tab.dataset.filter, this.getActiveWords());
        this._springBounce(tab);
      });
    });

    // ── Word Book ──
    this._bindBookEvents();

    // ── Import ──
    this._bindImportEvents();

    // ── Load voices ──
    if (window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }

    // ── Keyboard shortcut — space to reveal ──
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && this.currentPage === 'learn') {
        e.preventDefault();
        document.getElementById('reveal-btn')?.click();
      }
    });

    // ── Touch feedback for all interactive elements ──
    this._setupTouchFeedback();
  }

  _bindBookEvents() {
    // Create book button in settings
    document.getElementById('create-book-btn')?.addEventListener('click', () => {
      this._openCreateBookModal();
    });

    // Modal close
    document.getElementById('modal-close')?.addEventListener('click', () => {
      this._closeCreateBookModal();
    });

    // Modal overlay click to close
    document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'modal-overlay') this._closeCreateBookModal();
    });

    // Icon picker
    document.querySelectorAll('.icon-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.icon-option').forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        this._springBounce(opt);
      });
    });

    // Confirm create book
    document.getElementById('confirm-create-book')?.addEventListener('click', () => {
      const nameInput = document.getElementById('new-book-name');
      const name = nameInput?.value?.trim();
      if (!name) {
        this.showToast('請輸入詞書名稱');
        return;
      }

      const activeIcon = document.querySelector('.icon-option.active');
      const icon = activeIcon?.dataset?.icon || '📗';

      this.wordbook.createBook(name, icon);
      this._closeCreateBookModal();
      this._renderBookSelector();
      this._renderBookList();
      this._updateImportTargetSelect();
      this.showToast(`📚 已建立詞書「${name}」`);
    });
  }

  _bindImportEvents() {
    const dropArea = document.getElementById('import-drop-area');
    const fileInput = document.getElementById('import-file-input');
    const textarea = document.getElementById('import-textarea');
    const importBtn = document.getElementById('import-btn');
    const resultDiv = document.getElementById('import-result');

    if (!dropArea || !fileInput) return;

    // Click to select file
    dropArea.addEventListener('click', () => fileInput.click());

    // Drag & drop
    ['dragenter', 'dragover'].forEach(event => {
      dropArea.addEventListener(event, (e) => {
        e.preventDefault();
        dropArea.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(event => {
      dropArea.addEventListener(event, (e) => {
        e.preventDefault();
        dropArea.classList.remove('dragover');
      });
    });

    dropArea.addEventListener('drop', async (e) => {
      const file = e.dataTransfer?.files?.[0];
      if (file) await this._importFile(file);
    });

    // File input change
    fileInput.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (file) await this._importFile(file);
      fileInput.value = ''; // reset
    });

    // Textarea import
    importBtn?.addEventListener('click', () => {
      const text = textarea?.value?.trim();
      if (!text) {
        this.showToast('請先輸入或貼上單字內容');
        return;
      }

      const words = this.importModule.parseText(text);
      if (words.length === 0) {
        this._showImportResult('error', '無法解析任何單字，請檢查格式');
        return;
      }

      const added = this.importModule.importWords(words);
      // Add to target book
      const targetBookId = document.getElementById('import-target-book')?.value || 'default';
      const wordKeys = words.map(w => w.word);
      this.wordbook.addWordsToBook(targetBookId, wordKeys);

      const targetBook = this.wordbook.getBook(targetBookId);
      const bookName = targetBook ? targetBook.name : '詞書';
      this._showImportResult('success', `✅ 成功匯入 ${added} 個新單字到「${bookName}」（共解析 ${words.length} 個）`);
      textarea.value = '';
      this._updateHome();
      this._renderBookList();
    });
  }

  async _importFile(file) {
    try {
      const words = await this.importModule.parseFile(file);
      if (words.length === 0) {
        this._showImportResult('error', '檔案中無法解析到有效單字');
        return;
      }

      const added = this.importModule.importWords(words);
      // Add to target book
      const targetBookId = document.getElementById('import-target-book')?.value || 'default';
      const wordKeys = words.map(w => w.word);
      this.wordbook.addWordsToBook(targetBookId, wordKeys);

      const targetBook = this.wordbook.getBook(targetBookId);
      const bookName = targetBook ? targetBook.name : '詞書';
      this._showImportResult('success', `✅ 從 ${file.name} 匯入了 ${added} 個新單字到「${bookName}」（共解析 ${words.length} 個）`);
      this._updateHome();
      this._renderBookList();
    } catch (err) {
      this._showImportResult('error', '檔案讀取失敗：' + err.message);
    }
  }

  _showImportResult(type, message) {
    const resultDiv = document.getElementById('import-result');
    if (!resultDiv) return;
    resultDiv.className = 'import-result ' + (type === 'success' ? 'success' : 'error');
    resultDiv.textContent = message;

    // Auto-hide after 5 seconds
    setTimeout(() => {
      resultDiv.className = '';
      resultDiv.textContent = '';
    }, 5000);
  }

  // ═══════════════════════════════════════════
  // iOS-like Interaction Helpers
  // ═══════════════════════════════════════════

  /** Spring bounce a specific element */
  _springBounce(el) {
    if (!el) return;
    el.style.transition = 'transform 0.5s cubic-bezier(0.18, 1.8, 0.5, 1)';
    el.style.transform = 'scale(0.8)';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transform = 'scale(1)';
      });
    });
  }

  /** Setup touch feedback (scale on press) for interactive elements */
  _setupTouchFeedback() {
    const interactiveSelectors = '.action-btn, .stat-card, .card, .quiz-option, .wl-item';

    document.addEventListener('touchstart', (e) => {
      const target = e.target.closest(interactiveSelectors);
      if (target) {
        target.style.transition = 'transform 0.15s cubic-bezier(0.25, 1.2, 0.5, 1)';
        target.style.transform = 'scale(0.96)';
      }
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      const target = e.target.closest(interactiveSelectors);
      if (target) {
        target.style.transition = 'transform 0.5s cubic-bezier(0.18, 1.8, 0.5, 1)';
        target.style.transform = 'scale(1)';
      }
    }, { passive: true });

    document.addEventListener('touchcancel', (e) => {
      const target = e.target.closest(interactiveSelectors);
      if (target) {
        target.style.transform = 'scale(1)';
      }
    }, { passive: true });
  }

  // ═══════════════════════════════════════════
  // Utility
  // ═══════════════════════════════════════════

  _shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  _registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js').catch(() => {
        // SW registration is optional — app works without it
      });
    }
  }
}

// ── Bootstrap ──
document.addEventListener('DOMContentLoaded', () => {
  window.app = new VocabMasterApp();
});
