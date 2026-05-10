// ===================================================================
// Spaced Repetition Engine — 動態間隔演算法 (SM-2 變體)
// ===================================================================

const STORAGE_KEY = 'vocabmaster_progress';

export class SpacedRepetition {
  constructor() {
    this.progress = this._load();
    this._migrateOldData();
  }

  // ── Persistence ──
  _load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  _save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progress));
    } catch (e) {
      console.warn('Storage save failed:', e);
    }
  }

  /** 相容舊資料結構，遷移至 SM-2 結構 */
  _migrateOldData() {
    let migrated = false;
    for (const key in this.progress) {
      const p = this.progress[key];
      if (p.easeFactor === undefined) {
        p.easeFactor = 2.5;
        p.interval = p.level > 0 ? [0, 1, 2, 4, 7, 15, 30][Math.min(p.level, 6)] || 1 : 0;
        p.repetitions = p.level > 0 ? p.level : 0;
        migrated = true;
      }
    }
    if (migrated) this._save();
  }

  // ── Core API ──

  _hasSeen(p) {
    if (!p) return false;
    return Boolean(p.lastSeen) || p.repetitions > 0 || p.level > 0 || p.correctCount > 0 || p.wrongCount > 0;
  }

  /** Get progress for a word, or create fresh entry */
  getWordProgress(word) {
    if (!this.progress[word]) {
      this.progress[word] = {
        level: 0,           // 舊欄位，保留相容性
        repetitions: 0,     // 連續答對次數
        interval: 0,        // 下次複習間隔（天）
        easeFactor: 2.5,    // 難度係數 (預設 2.5)
        nextReview: null,   // ISO date string
        lastSeen: null,
        correctCount: 0,
        wrongCount: 0,
        streak: 0,
      };
    }
    return this.progress[word];
  }

  /**
   * 記錄使用者答題回饋 (SM-2 變體)
   * @param {string} word - 單字
   * @param {number} quality - 評分: 0(完全忘記/錯誤), 3(困難/提示後想起來), 4(順利想起來), 5(非常簡單)
   */
  recordSM2Rating(word, quality) {
    const p = this.getWordProgress(word);
    const now = new Date();
    quality = Math.max(0, Math.min(5, Number(quality) || 0));
    p.lastSeen = now.toISOString();

    // 更新計數
    if (quality >= 3) {
      p.correctCount++;
      p.streak++;
    } else {
      p.wrongCount++;
      p.streak = 0;
    }

    // 核心 SM-2 邏輯
    if (quality >= 3) {
      // 答對 (Pass)
      if (p.repetitions === 0) {
        p.interval = 1;
      } else if (p.repetitions === 1) {
        p.interval = 6;
      } else {
        p.interval = Math.round(p.interval * p.easeFactor);
      }
      p.repetitions++;
    } else {
      // 答錯 (Fail)
      p.repetitions = 0;
      p.interval = 1;
    }

    // 計算新的難度係數 (Ease Factor)
    // 公式: EF = EF + (0.1 - (5-q)*(0.08+(5-q)*0.02))
    p.easeFactor = p.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    
    // 確保 EF 在合理範圍內 (最低 1.3，最高 3.0 以免間隔膨脹過快)
    p.easeFactor = Math.max(1.3, Math.min(p.easeFactor, 3.0));

    // 同步舊的 level (以防其他地方用到，最高 7 級)
    p.level = Math.min(p.repetitions, 7);

    // 計算下次複習日期
    const next = new Date(now);
    next.setDate(next.getDate() + p.interval);
    p.nextReview = next.toISOString();

    this._save();
    return p;
  }

  // 舊的方法保留（但修改為呼叫新方法），避免破壞現有程式
  recordRating(word, rating) {
    let quality = 0;
    if (rating === 'know') quality = 4;       // 順利想起來
    else if (rating === 'fuzzy') quality = 3; // 困難
    else if (rating === 'unknown') quality = 0; // 完全忘記
    return this.recordSM2Rating(word, quality);
  }

  recordQuizResult(word, correct) {
    return this.recordSM2Rating(word, correct ? 4 : 0);
  }

  getReviewWords(allWords) {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    return allWords.filter(w => {
      const p = this.progress[w.word];
      if (!p || !p.nextReview) return false;
      // 在 SM-2 中，只要排程在今天以前，就需要複習（不設已掌握上限，或設定超長間隔為已掌握）
      if (p.interval > 60) return false; // 如果間隔大於兩個月，暫時視為已掌握，不出現於每日任務
      return p.nextReview.slice(0, 10) <= todayStr;
    });
  }

  getNewWords(allWords) {
    return allWords.filter(w => {
      const p = this.progress[w.word];
      return !this._hasSeen(p);
    });
  }

  getLearningWords(allWords) {
    return allWords.filter(w => {
      const p = this.progress[w.word];
      return this._hasSeen(p) && p.interval <= 60;
    });
  }

  getMasteredWords(allWords) {
    return allWords.filter(w => {
      const p = this.progress[w.word];
      return this._hasSeen(p) && p.interval > 60;
    });
  }

  getAccuracy() {
    let total = 0, correct = 0;
    for (const word in this.progress) {
      const p = this.progress[word];
      total += p.correctCount + p.wrongCount;
      correct += p.correctCount;
    }
    return total === 0 ? 0 : Math.round((correct / total) * 100);
  }

  reset() {
    this.progress = {};
    localStorage.removeItem(STORAGE_KEY);
  }
}
