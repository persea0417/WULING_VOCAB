// ===================================================================
// Learning Module — 學習流程控制器 (不背單詞模式)
// ===================================================================

export class LearningModule {
  constructor(app) {
    this.app = app;
    this.queue = [];
    this.allWords = [];
    this.totalWordsCount = 0; // 當前 session 總單字數
    this.completedCount = 0;  // 已完成單字數
    this.isTransitioning = false; 
    this.sessionStats = { pass: 0, fail: 0 };
  }

  /** Start learning session with given words */
  start(sessionWords, allWords) {
    this.allWords = allWords || sessionWords;
    this.totalWordsCount = sessionWords.length;
    this.completedCount = 0;
    
    // 初始化學習佇列
    this.queue = sessionWords.map(w => {
      const p = this.app.sr.getWordProgress(w.word);
      const hasSeen = Boolean(p.lastSeen) || p.repetitions > 0 || p.level > 0 || p.correctCount > 0 || p.wrongCount > 0;
      return {
        wordObj: w,
        // 從未學過先進入學習模式，學過則直接測驗
        phase: hasSeen ? 'quiz' : 'study',
        failed: false // 標記是否在這次 session 中答錯過
      };
    });

    this.isTransitioning = false;
    this.sessionStats = { pass: 0, fail: 0 };
    this.render();
  }

  /** Render current word */
  render() {
    const container = document.getElementById('learn-content');
    if (!container) return;

    if (this.queue.length === 0) {
      this._renderComplete(container);
      return;
    }

    const currentItem = this.queue[0];
    const word = currentItem.wordObj;

    // Update progress text
    const counter = document.getElementById('learn-counter');
    if (counter) counter.textContent = `${this.completedCount} / ${this.totalWordsCount}`;

    // 根據 phase 渲染不同畫面
    if (currentItem.phase === 'study') {
      this._renderStudy(container, word);
    } else {
      this._renderQuiz(container, word);
    }

    // Auto-speak if enabled
    if (this.app.settings.autoSpeak) {
      setTimeout(() => this.app.speak(word.word), 300);
    }
  }

  /** 渲染學習模式 (顯示全部資訊) */
  _renderStudy(container, word) {
    container.innerHTML = `
      <div class="word-card-area">
        <div class="word-card bounce-in" id="current-word-card">
          <div class="word-text">${word.word}</div>
          <div class="word-phonetic-group">
            <div class="word-dots"><span></span><span></span><span></span></div>
            <div class="word-phonetic">/ ${word.phonetic || ''} /</div>
            <button class="speak-btn-inline" id="speak-btn" aria-label="發音">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div class="meanings-area" id="meanings-area">
        ${word.pos ? `<div class="pos-tag">${word.pos}</div>` : ''}
        <div class="meaning-text">${(word.meanings || []).join('；')}</div>
      </div>

      <div class="examples-area" id="examples-area">
        ${(word.examples || []).slice(0, 2).map(ex => `
          <div class="example-item">
            <div class="example-en">${this._highlightWord(ex.en, word.word)}</div>
            <div class="example-zh">${ex.zh}</div>
          </div>
        `).join('')}
      </div>

      ${(word.rootInfo || word.wordRoot) ? `
        <div class="root-info" id="root-info">
          <span class="root-icon">✦</span>
          <div class="supp-content">
            <div class="supp-title">字根字首</div>
            <div>${word.rootInfo || word.wordRoot}</div>
          </div>
        </div>
      ` : ''}

      ${word.phrases ? `
        <div class="root-info" id="phrases-info">
          <span class="root-icon">✧</span>
          <div class="supp-content">
            <div class="supp-title">片語 / 句型</div>
            <div>${word.phrases}</div>
          </div>
        </div>
      ` : ''}

      <div class="rating-btns-container sticky-bottom-cta">
        <div class="rating-btns" id="rating-btns">
          <button class="action-pill-btn next" id="btn-got-it" style="flex: 1;">
            <div class="btn-label">我記住了</div>
          </button>
        </div>
      </div>
    `;

    this._bindSpeakEvent(word);
    
    document.getElementById('btn-got-it').addEventListener('click', () => {
      if (this.isTransitioning) return;
      this.isTransitioning = true;
      
      const item = this.queue.shift();
      item.phase = 'quiz';
      // 推回佇列尾端等待測驗
      this.queue.push(item);
      
      this._animateNext();
    });
  }

  /** 渲染測驗模式 (四選一) */
  _renderQuiz(container, word) {
    // 產生三個干擾選項
    const options = this._generateOptions(word);

    container.innerHTML = `
      <div class="word-card-area">
        <div class="word-card bounce-in" id="current-word-card">
          <div class="word-text">${word.word}</div>
          <div class="word-phonetic-group">
            <div class="word-dots"><span></span><span></span><span></span></div>
            <div class="word-phonetic">/ ${word.phonetic || ''} /</div>
            <button class="speak-btn-inline" id="speak-btn" aria-label="發音">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
            </button>
          </div>
        </div>
      </div>

      <div class="quiz-options-area" style="padding: 20px; display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 500px; margin: 0 auto;">
        ${options.map((opt, i) => `
          <button class="quiz-option-btn" data-correct="${opt.isCorrect}" style="
            background: var(--card-bg);
            border: 1px solid var(--border);
            padding: 16px 20px;
            border-radius: 12px;
            color: var(--text);
            font-size: 16px;
            text-align: left;
            transition: all 0.2s;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          ">
            ${opt.text}
          </button>
        `).join('')}
      </div>
      
      <div class="rating-btns-container">
        <div class="rating-btns" id="rating-btns">
           <button class="action-pill-btn forgot" id="btn-dont-know" style="flex: 1;">
            <div class="btn-label">不認識</div>
          </button>
        </div>
      </div>
    `;

    this._bindSpeakEvent(word);

    // 綁定選項點擊
    const optionBtns = container.querySelectorAll('.quiz-option-btn');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
        const isCorrect = btn.dataset.correct === 'true';
        if (isCorrect) {
          btn.style.backgroundColor = 'var(--success)';
          btn.style.color = '#000';
          this._handleQuizResult(true);
        } else {
          btn.style.backgroundColor = 'var(--danger)';
          btn.style.color = '#fff';
          // 標示出正確答案
          const correctBtn = container.querySelector('.quiz-option-btn[data-correct="true"]');
          if (correctBtn) {
            correctBtn.style.border = '2px solid var(--success)';
          }
          this._handleQuizResult(false);
        }
      });
    });

    // 不認識按鈕 -> 等同答錯
    document.getElementById('btn-dont-know').addEventListener('click', () => {
      if (this.isTransitioning) return;
      this.isTransitioning = true;
      this._handleQuizResult(false);
    });
  }

  _handleQuizResult(isCorrect) {
    const item = this.queue.shift();
    
    if (isCorrect) {
      this.app.showToast('✦ 正確！');
      // 首次就答對: Good(4)；曾答錯後才答對: Hard(3)
      this.app.sr.recordSM2Rating(item.wordObj.word, item.failed ? 3 : 4);
      if (!item.failed) this.sessionStats.pass++;
      this.completedCount++;
      this._animateNext();
    } else {
      this.app.showToast('✦ 記錯了，再看一次');
      // 記錄為 Again(0)
      if (!item.failed) {
        this.app.sr.recordSM2Rating(item.wordObj.word, 0);
        this.sessionStats.fail++;
        item.failed = true;
      }
      // 退回學習模式並放回佇列末端
      item.phase = 'study';
      this.queue.push(item);
      
      // 稍微延遲讓使用者看清楚正確答案
      setTimeout(() => {
        this._animateNext();
      }, 800);
    }
  }

  _generateOptions(wordObj) {
    const correctMeaning = (wordObj.meanings || [])[0] || '無解釋';
    const options = [{ text: correctMeaning, isCorrect: true }];
    const usedMeanings = new Set([correctMeaning]);
    
    // 隨機抽取 3 個不同的解釋
    let pool = [...this.allWords].filter(w => w.word !== wordObj.word && w.meanings && w.meanings.length > 0);
    // Shuffle pool
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    
    for (let i = 0; i < pool.length && options.length < 4; i++) {
      const meaning = pool[i].meanings[0];
      if (usedMeanings.has(meaning)) continue;
      usedMeanings.add(meaning);
      options.push({ text: meaning, isCorrect: false });
    }
    
    // 再次洗牌選項
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    
    return options;
  }

  _bindSpeakEvent(word) {
    const speakBtn = document.getElementById('speak-btn');
    if (speakBtn) {
      speakBtn.addEventListener('click', () => {
        this.app.speak(word.word);
        speakBtn.style.transform = 'scale(1.4)';
        setTimeout(() => { speakBtn.style.transform = ''; }, 300);
      });
    }
  }

  _animateNext() {
    const card = document.getElementById('current-word-card');
    if (card) {
      card.style.transition = 'transform 0.15s ease-out, opacity 0.1s ease-out';
      card.style.transform = 'translateX(-100%) rotate(-8deg)';
      card.style.opacity = '0';
    }

    setTimeout(() => {
      this.isTransitioning = false;
      this.render();
    }, 150);
  }

  /** Highlight target word in example sentence */
  _highlightWord(sentence, word) {
    if (!sentence) return '';
    const regex = new RegExp(`(${word})`, 'gi');
    return sentence.replace(regex, '<mark>$1</mark>');
  }

  /** Render completion screen */
  _renderComplete(container) {
    const counter = document.getElementById('learn-counter');
    if (counter) counter.textContent = `${this.totalWordsCount} / ${this.totalWordsCount}`;

    const total = this.totalWordsCount;
    const passRate = total > 0 ? Math.round((this.sessionStats.pass / total) * 100) : 0;

    container.innerHTML = `
      <div class="complete-screen">
        <div class="complete-emoji" style="color:var(--accent); font-size: 64px; line-height:1;">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        </div>
        <div class="complete-title">學習完成！</div>
        <div class="complete-subtitle">你完成了今天的學習任務</div>
        <div class="complete-stats">
          <div class="complete-stat-item">
            <div class="cs-value">${total}</div>
            <div class="cs-label">學習單字</div>
          </div>
          <div class="complete-stat-item">
            <div class="cs-value" style="color:var(--success)">
              ${passRate}%
            </div>
            <div class="cs-label">一次答對率</div>
          </div>
        </div>
        <button class="action-btn primary" id="complete-home-btn" style="margin-top:28px;">
          <div class="btn-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
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
