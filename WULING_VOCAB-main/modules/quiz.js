// ===================================================================
// Quiz Module — 選擇題 + 拼寫題
// ===================================================================

export class QuizModule {
  constructor(app) {
    this.app = app;
    this.words = [];
    this.allWords = [];
    this.currentIndex = 0;
    this.mode = 'choice'; // 'choice' | 'spell'
    this.sessionCorrect = 0;
    this.sessionTotal = 0;
    this.locked = false; // Prevent rapid tapping
  }

  /** Start quiz with given words (they should have been learned) */
  start(words, allWords) {
    this.words = this._shuffle([...words]);
    this.allWords = allWords;
    this.currentIndex = 0;
    this.sessionCorrect = 0;
    this.sessionTotal = 0;
    this.locked = false;

    if (this.words.length === 0) {
      this.app.showToast('🤷 沒有可測驗的單字，先去學習吧！');
      this.app.navigateTo('home');
      return;
    }

    this.render();
  }

  /** Render current quiz question */
  render() {
    const container = document.getElementById('quiz-content');
    if (!container) return;

    if (this.currentIndex >= this.words.length) {
      this._renderComplete(container);
      return;
    }

    const word = this.words[this.currentIndex];
    const progress = (this.currentIndex / this.words.length) * 100;

    const progressBar = document.getElementById('quiz-progress');
    if (progressBar) progressBar.style.width = progress + '%';
    const counter = document.getElementById('quiz-counter');
    if (counter) counter.textContent = `${this.currentIndex + 1}/${this.words.length}`;

    // Alternate between choice and spelling modes
    this.mode = (this.currentIndex % 3 === 2) ? 'spell' : 'choice';

    if (this.mode === 'choice') {
      this._renderChoice(container, word);
    } else {
      this._renderSpell(container, word);
    }

    this.locked = false;
  }

  // ── Choice Mode ──
  _renderChoice(container, word) {
    // Build 4 options (1 correct + 3 random)
    const correctMeaning = word.meanings[0];
    const distractors = this._getDistractors(word, 3);
    const options = this._shuffle([
      { text: correctMeaning, correct: true },
      ...distractors.map(d => ({ text: d, correct: false }))
    ]);

    container.innerHTML = `
      <div class="quiz-question">選出正確的中文意思</div>
      <div class="quiz-word-display">${word.word}</div>
      <div style="text-align:center;margin-bottom:16px;">
        <button class="speak-btn" id="quiz-speak" style="font-size:24px;background:none;border:none;color:var(--accent-light);cursor:pointer;">🔊</button>
      </div>
      <div class="quiz-options" id="quiz-options">
        ${options.map((opt, i) => `
          <button class="quiz-option" data-correct="${opt.correct}" data-index="${i}">
            ${opt.text}
          </button>
        `).join('')}
      </div>
    `;

    // Bind
    document.getElementById('quiz-speak')?.addEventListener('click', () => {
      this.app.speak(word.word);
    });

    document.querySelectorAll('.quiz-option').forEach(btn => {
      btn.addEventListener('click', () => this._handleChoiceClick(btn, word));
    });

    // Auto speak
    if (this.app.settings.autoSpeak) {
      setTimeout(() => this.app.speak(word.word), 300);
    }
  }

  _handleChoiceClick(btn, word) {
    if (this.locked) return;
    this.locked = true;

    const correct = btn.dataset.correct === 'true';
    this.sessionTotal++;

    if (correct) {
      this.sessionCorrect++;
      btn.classList.add('correct');
      this.app.sr.recordQuizResult(word.word, true);
      this._triggerHaptic();

      // Show confetti-like celebration
      this._showMiniCelebration(btn);
    } else {
      btn.classList.add('wrong');
      this.app.sr.recordQuizResult(word.word, false);

      // Highlight the correct one
      document.querySelectorAll('.quiz-option').forEach(opt => {
        if (opt.dataset.correct === 'true') {
          setTimeout(() => opt.classList.add('correct'), 300);
        }
      });
    }

    // Advance after delay
    setTimeout(() => {
      this.currentIndex++;
      this.render();
    }, correct ? 800 : 1500);
  }

  // ── Spell Mode ──
  _renderSpell(container, word) {
    container.innerHTML = `
      <div class="quiz-question">拼出這個單字的英文</div>
      <div style="text-align:center;margin-bottom:8px;">
        <button class="speak-btn" id="quiz-speak" style="font-size:32px;background:none;border:none;color:var(--accent-light);cursor:pointer;">🔊</button>
      </div>
      <div style="text-align:center;font-size:20px;font-weight:700;margin-bottom:20px;color:var(--text-primary);">
        ${word.meanings.join(' / ')}
      </div>
      <div class="spell-hint" style="text-align:center;font-size:14px;color:var(--text-muted);margin-bottom:14px;">
        提示：${word.word.charAt(0)}${'_ '.repeat(word.word.length - 1).trim()}（${word.word.length} 個字母）
      </div>
      <div class="spell-input-area">
        <input type="text" class="spell-input" id="spell-input" placeholder="輸入英文單字..." autocomplete="off" autocapitalize="none" spellcheck="false">
        <button class="spell-submit" id="spell-submit">確認</button>
      </div>
      <div id="spell-result"></div>
    `;

    const input = document.getElementById('spell-input');
    const submitBtn = document.getElementById('spell-submit');

    // Bind
    document.getElementById('quiz-speak')?.addEventListener('click', () => {
      this.app.speak(word.word);
    });

    const handleSubmit = () => {
      if (this.locked) return;
      this.locked = true;
      const answer = input.value.trim().toLowerCase();
      const correct = answer === word.word.toLowerCase();
      this.sessionTotal++;

      const resultDiv = document.getElementById('spell-result');
      if (correct) {
        this.sessionCorrect++;
        resultDiv.className = 'spell-result correct-result';
        resultDiv.textContent = '✅ 完全正確！';
        this.app.sr.recordQuizResult(word.word, true);
        this._triggerHaptic();
        input.style.borderColor = 'var(--success)';
      } else {
        resultDiv.className = 'spell-result wrong-result';
        resultDiv.innerHTML = `❌ 正確答案：<strong>${word.word}</strong>`;
        this.app.sr.recordQuizResult(word.word, false);
        input.style.borderColor = 'var(--danger)';
      }

      setTimeout(() => {
        this.currentIndex++;
        this.render();
      }, correct ? 1000 : 2000);
    };

    submitBtn?.addEventListener('click', handleSubmit);
    input?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSubmit();
    });

    // Auto speak
    if (this.app.settings.autoSpeak) {
      setTimeout(() => this.app.speak(word.word), 300);
    }

    // Focus input
    setTimeout(() => input?.focus(), 400);
  }

  // ── Helpers ──
  _getDistractors(correctWord, count) {
    const pool = this.allWords
      .filter(w => w.word !== correctWord.word)
      .map(w => w.meanings[0]);
    const shuffled = this._shuffle(pool);
    return shuffled.slice(0, count);
  }

  _shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  _triggerHaptic() {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  }

  _showMiniCelebration(element) {
    // Create floating emojis for correct answer
    const emojis = ['🎉', '✨', '⭐', '💫'];
    for (let i = 0; i < 4; i++) {
      const span = document.createElement('span');
      span.textContent = emojis[i];
      span.style.cssText = `
        position: fixed;
        font-size: 24px;
        pointer-events: none;
        z-index: 999;
        transition: all 0.8s cubic-bezier(0.34,1.56,0.64,1);
      `;

      const rect = element.getBoundingClientRect();
      span.style.left = (rect.left + rect.width * Math.random()) + 'px';
      span.style.top = rect.top + 'px';
      span.style.opacity = '1';
      document.body.appendChild(span);

      requestAnimationFrame(() => {
        span.style.transform = `translateY(-${60 + Math.random() * 40}px) rotate(${Math.random() * 30 - 15}deg)`;
        span.style.opacity = '0';
      });

      setTimeout(() => span.remove(), 900);
    }
  }

  _renderComplete(container) {
    const progressBar = document.getElementById('quiz-progress');
    if (progressBar) progressBar.style.width = '100%';
    const counter = document.getElementById('quiz-counter');
    if (counter) counter.textContent = `${this.words.length}/${this.words.length}`;

    const accuracy = this.sessionTotal > 0
      ? Math.round((this.sessionCorrect / this.sessionTotal) * 100)
      : 0;

    let emoji = '🎉', title = '太棒了！';
    if (accuracy < 50) { emoji = '💪'; title = '繼續加油！'; }
    else if (accuracy < 80) { emoji = '👍'; title = '不錯哦！'; }

    container.innerHTML = `
      <div class="complete-screen">
        <div class="complete-emoji">${emoji}</div>
        <div class="complete-title">${title}</div>
        <div class="complete-subtitle">測驗完成，查看你的表現</div>
        <div class="complete-stats">
          <div class="complete-stat-item">
            <div class="cs-value">${this.sessionCorrect}/${this.sessionTotal}</div>
            <div class="cs-label">答對/總題數</div>
          </div>
          <div class="complete-stat-item">
            <div class="cs-value" style="color:${accuracy >= 80 ? 'var(--success)' : 'var(--warning)'}">
              ${accuracy}%
            </div>
            <div class="cs-label">正確率</div>
          </div>
        </div>
        <button class="action-btn primary" id="quiz-home-btn" style="margin-top:28px;">
          <div class="btn-icon">🏠</div>
          <div class="btn-text">返回首頁</div>
        </button>
        <button class="action-btn secondary" id="quiz-retry-btn" style="margin-top:12px;">
          <div class="btn-icon">🔄</div>
          <div class="btn-text">再測一次</div>
        </button>
      </div>
    `;

    document.getElementById('quiz-home-btn')?.addEventListener('click', () => {
      this.app.navigateTo('home');
    });

    document.getElementById('quiz-retry-btn')?.addEventListener('click', () => {
      this.start(this.words, this.allWords);
    });
  }
}
