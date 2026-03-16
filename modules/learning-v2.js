// ===================================================================
// Learning Module — 學習流程控制器 (2-Pill Material You Version)
// ===================================================================

export class LearningModule {
  constructor(app) {
    this.app = app;
    this.words = [];
    this.currentIndex = 0;
    this.isRevealed = false;
    this.sessionStats = { know: 0, fuzzy: 0, unknown: 0 };
  }

  /** Start learning session with given words */
  start(words) {
    this.words = words;
    this.currentIndex = 0;
    this.isRevealed = false;
    this.sessionStats = { know: 0, fuzzy: 0, unknown: 0 };
    this.render();
  }

  /** Render current word */
  render() {
    const container = document.getElementById('learn-content');
    if (!container) return;

    if (this.currentIndex >= this.words.length) {
      this._renderComplete(container);
      return;
    }

    const word = this.words[this.currentIndex];
    const progress = ((this.currentIndex) / this.words.length) * 100;

    // Update progress text
    const counter = document.getElementById('learn-counter');
    if (counter) counter.textContent = `${this.currentIndex} / ${this.words.length}`;

    container.innerHTML = `
      <div class="word-card-area">
        <div class="word-card bounce-in" id="current-word-card">
          <div class="word-text">${word.word}</div>
          <div class="word-phonetic-group">
            <div class="word-dots"><span></span><span></span><span></span></div>
            <div class="word-phonetic">/ ${word.phonetic || ''} /</div>
            <button class="speak-btn-inline" id="speak-btn" aria-label="發音">🔊</button>
          </div>
        </div>
      </div>

      <div class="meanings-area hidden" id="meanings-area">
        ${word.meanings.map(m => `<div class="meaning-item">${m}</div>`).join('')}
      </div>

      <div class="examples-area hidden" id="examples-area">
        ${word.examples.map(ex => `
          <div class="example-item">
            <div class="example-en">${this._highlightWord(ex.en, word.word)}</div>
            <div class="example-zh">${ex.zh}</div>
          </div>
        `).join('')}
      </div>

      ${word.rootInfo ? `
        <div class="root-info hidden" id="root-info">
          <span class="root-icon">🌱</span>
          <span>${word.rootInfo}</span>
        </div>
      ` : ''}

      <div class="rating-btns-container">
        <button class="reveal-btn" id="reveal-btn">顯示答案</button>

        <div class="rating-btns hidden" id="rating-btns">
          <button class="action-pill-btn next" data-rating="know">
            <div class="btn-label">下一個</div>
            <div class="btn-indicator active"></div>
          </button>
          <button class="action-pill-btn forgot" data-rating="unknown">
            <div class="btn-label">記錯了</div>
            <div class="btn-indicator"></div>
          </button>
        </div>
      </div>
    `;

    this.isRevealed = false;
    this._bindEvents();

    // Auto-speak if enabled
    if (this.app.settings.autoSpeak) {
      setTimeout(() => this.app.speak(word.word), 300);
    }
  }

  /** Bind events for current card */
  _bindEvents() {
    // Speak button
    const speakBtn = document.getElementById('speak-btn');
    if (speakBtn) {
      speakBtn.addEventListener('click', () => {
        const word = this.words[this.currentIndex];
        this.app.speak(word.word);
        // iOS-like bounce animation
        speakBtn.style.transform = 'scale(1.4)';
        setTimeout(() => { speakBtn.style.transform = ''; }, 300);
      });
    }

    // Reveal button
    const revealBtn = document.getElementById('reveal-btn');
    if (revealBtn) {
      revealBtn.addEventListener('click', () => this._reveal());
    }

    // Rating buttons
    const ratingBtns = document.querySelectorAll('.action-pill-btn');
    ratingBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const rating = btn.dataset.rating;
        this._rate(rating);
      });
    });

    // Card tap to reveal (shortcut)
    const card = document.getElementById('current-word-card');
    if (card) {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.speak-btn')) return;
        if (!this.isRevealed) this._reveal();
      });
    }
  }

  /** Reveal meanings, examples, root info */
  _reveal() {
    if (this.isRevealed) return;
    this.isRevealed = true;

    const meanings = document.getElementById('meanings-area');
    const examples = document.getElementById('examples-area');
    const rootInfo = document.getElementById('root-info');
    const revealBtn = document.getElementById('reveal-btn');
    const ratingBtns = document.getElementById('rating-btns');

    if (meanings) meanings.classList.remove('hidden');
    if (examples) examples.classList.remove('hidden');
    if (rootInfo) rootInfo.classList.remove('hidden');
    if (revealBtn) revealBtn.classList.add('hidden');
    if (ratingBtns) ratingBtns.classList.remove('hidden');

    // Scroll smoothly to show all content
    setTimeout(() => {
      if (meanings) meanings.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 200);
  }

  /** Rate current word and advance */
  _rate(rating) {
    const word = this.words[this.currentIndex];
    this.app.sr.recordRating(word.word, rating);
    this.sessionStats[rating]++;

    // Animate card exit
    const card = document.getElementById('current-word-card');
    if (card) {
      card.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s';
      card.style.transform = 'translateX(-100%) rotate(-8deg)';
      card.style.opacity = '0';
    }

    // Show feedback toast
    const messages = {
      know: '👍 太棒了！',
      unknown: '💪 已加入複習清單'
    };
    this.app.showToast(messages[rating] || 'ok');

    // Advance after animation
    setTimeout(() => {
      this.currentIndex++;
      this.render();
    }, 400);
  }

  /** Highlight target word in example sentence */
  _highlightWord(sentence, word) {
    const regex = new RegExp(`(${word})`, 'gi');
    return sentence.replace(regex, '<mark>$1</mark>');
  }

  /** Render completion screen */
  _renderComplete(container) {
    // Update progress text to 100%
    const counter = document.getElementById('learn-counter');
    if (counter) counter.textContent = `${this.words.length} / ${this.words.length}`;

    const total = this.sessionStats.know + this.sessionStats.unknown;

    container.innerHTML = `
      <div class="complete-screen">
        <div class="complete-emoji">🎉</div>
        <div class="complete-title">學習完成！</div>
        <div class="complete-subtitle">你完成了今天的學習任務</div>
        <div class="complete-stats">
          <div class="complete-stat-item">
            <div class="cs-value">${total}</div>
            <div class="cs-label">學習單字</div>
          </div>
          <div class="complete-stat-item">
            <div class="cs-value" style="color:var(--success)">
              ${total > 0 ? Math.round((this.sessionStats.know / total) * 100) : 0}%
            </div>
            <div class="cs-label">認識率</div>
          </div>
        </div>
        <button class="action-btn primary" id="complete-home-btn" style="margin-top:28px;">
          <div class="btn-icon">🏠</div>
          <div class="btn-text">返回首頁</div>
        </button>
      </div>
    `;

    // Record daily stats
    this.app.recordDailyStats(total);

    document.getElementById('complete-home-btn')?.addEventListener('click', () => {
      this.app.navigateTo('home');
    });
  }
}
