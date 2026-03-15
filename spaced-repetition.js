// ===================================================================
// Spaced Repetition Engine — 艾賓浩斯遺忘曲線演算法
// ===================================================================

const INTERVALS = [0, 1, 2, 4, 7, 15, 30]; // 天數間隔
const STORAGE_KEY = 'vocabmaster_progress';

export class SpacedRepetition {
  constructor() {
    this.progress = this._load();
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

  // ── Core API ──

  /** Get progress for a word, or create fresh entry */
  getWordProgress(word) {
    if (!this.progress[word]) {
      this.progress[word] = {
        level: 0,          // 0 = new, 1-6 = learning stages, 7 = mastered
        nextReview: null,   // ISO date string
        lastSeen: null,
        correctCount: 0,
        wrongCount: 0,
        streak: 0,
      };
    }
    return this.progress[word];
  }

  /** Record user's rating: 'know' | 'fuzzy' | 'unknown' */
  recordRating(word, rating) {
    const p = this.getWordProgress(word);
    const now = new Date();
    p.lastSeen = now.toISOString();

    if (rating === 'know') {
      p.level = Math.min(p.level + 1, 7);
      p.correctCount++;
      p.streak++;
    } else if (rating === 'fuzzy') {
      p.level = Math.max(p.level - 1, 1);
      p.correctCount++;
      p.streak = 0;
    } else {
      // unknown → reset to level 1
      p.level = 1;
      p.wrongCount++;
      p.streak = 0;
    }

    // Calculate next review date
    const intervalDays = INTERVALS[Math.min(p.level, INTERVALS.length - 1)];
    const next = new Date(now);
    next.setDate(next.getDate() + intervalDays);
    p.nextReview = next.toISOString();

    this._save();
    return p;
  }

  /** Record quiz result */
  recordQuizResult(word, correct) {
    const p = this.getWordProgress(word);
    if (correct) {
      p.correctCount++;
      p.streak++;
    } else {
      p.wrongCount++;
      p.streak = 0;
    }
    p.lastSeen = new Date().toISOString();
    this._save();
    return p;
  }

  /** Get words due for review today */
  getReviewWords(allWords) {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    return allWords.filter(w => {
      const p = this.progress[w.word];
      if (!p || !p.nextReview) return false;
      if (p.level >= 7) return false; // mastered
      return p.nextReview.slice(0, 10) <= todayStr;
    });
  }

  /** Get new (unseen) words */
  getNewWords(allWords) {
    return allWords.filter(w => {
      const p = this.progress[w.word];
      return !p || p.level === 0;
    });
  }

  /** Get learning (in-progress) words */
  getLearningWords(allWords) {
    return allWords.filter(w => {
      const p = this.progress[w.word];
      return p && p.level >= 1 && p.level < 7;
    });
  }

  /** Get mastered words */
  getMasteredWords(allWords) {
    return allWords.filter(w => {
      const p = this.progress[w.word];
      return p && p.level >= 7;
    });
  }

  /** Get overall accuracy */
  getAccuracy() {
    let total = 0, correct = 0;
    for (const word in this.progress) {
      const p = this.progress[word];
      total += p.correctCount + p.wrongCount;
      correct += p.correctCount;
    }
    return total === 0 ? 0 : Math.round((correct / total) * 100);
  }

  /** Reset all progress */
  reset() {
    this.progress = {};
    localStorage.removeItem(STORAGE_KEY);
  }
}
