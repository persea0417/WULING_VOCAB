// ===================================================================
// Import Module — 單字庫匯入功能
// ===================================================================

const CUSTOM_WORDS_KEY = 'vocabmaster_custom_words';

export class ImportModule {
  constructor(app) {
    this.app = app;
  }

  /** Load custom words from storage */
  loadCustomWords() {
    try {
      const raw = localStorage.getItem(CUSTOM_WORDS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /** Save custom words */
  saveCustomWords(words) {
    try {
      localStorage.setItem(CUSTOM_WORDS_KEY, JSON.stringify(words));
    } catch (e) {
      console.warn('Failed to save custom words:', e);
    }
  }

  /** Parse input text (auto-detect CSV / JSON / pipe-separated) */
  parseText(text) {
    text = text.trim();
    if (!text) return [];

    // Try JSON first
    if (text.startsWith('[')) {
      try {
        const arr = JSON.parse(text);
        return arr.map(item => this._normalizeWord(item)).filter(Boolean);
      } catch {
        // Not valid JSON, continue
      }
    }

    // Line-based parsing
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    const words = [];

    for (const line of lines) {
      // Skip header-like lines
      if (line.toLowerCase().startsWith('word') && (line.includes(',') || line.includes('|'))) continue;

      let parts;
      if (line.includes('|')) {
        parts = line.split('|').map(s => s.trim());
      } else if (line.includes(',')) {
        // CSV — handle quoted fields
        parts = this._parseCSVLine(line);
      } else if (line.includes('\t')) {
        parts = line.split('\t').map(s => s.trim());
      } else {
        // Single word only
        parts = [line.trim()];
      }

      if (parts.length >= 1 && parts[0]) {
        const w = {
          word: parts[0],
          phonetic: '',
          pos: '',
          meanings: parts.length >= 2 ? [parts[1]] : ['（未提供翻譯）'],
          examples: parts.length >= 3
            ? [{ en: parts[2], zh: parts.length >= 4 ? parts[3] : '' }]
            : [],
          rootInfo: ''
        };

        // If there are more meanings separated by ;
        if (w.meanings[0] && w.meanings[0].includes(';')) {
          w.meanings = w.meanings[0].split(';').map(s => s.trim());
        }

        words.push(w);
      }
    }

    return words;
  }

  /** Parse a file (CSV / JSON / TXT) */
  async parseFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const words = this.parseText(text);
          resolve(words);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('檔案讀取失敗'));
      reader.readAsText(file, 'UTF-8');
    });
  }

  /** Import words (merge with existing, avoid duplicates) */
  importWords(newWords) {
    if (!newWords || newWords.length === 0) return 0;

    const existing = this.loadCustomWords();
    const existingSet = new Set(existing.map(w => w.word.toLowerCase()));

    // Also check built-in words
    const builtInSet = new Set(this.app.builtInWords.map(w => w.word.toLowerCase()));

    let added = 0;
    for (const w of newWords) {
      const key = w.word.toLowerCase();
      if (!existingSet.has(key) && !builtInSet.has(key)) {
        existing.push(w);
        existingSet.add(key);
        added++;
      }
    }

    this.saveCustomWords(existing);
    return added;
  }

  /** Clear all custom words */
  clearCustomWords() {
    localStorage.removeItem(CUSTOM_WORDS_KEY);
  }

  // ── Helpers ──
  _normalizeWord(item) {
    if (!item || typeof item !== 'object') return null;
    return {
      word: item.word || item.english || item.en || '',
      phonetic: item.phonetic || item.pronunciation || '',
      pos: item.pos || item.partOfSpeech || '',
      meanings: Array.isArray(item.meanings)
        ? item.meanings
        : (item.meaning || item.chinese || item.zh || item.cn || item.translation)
          ? [item.meaning || item.chinese || item.zh || item.cn || item.translation]
          : ['（未提供翻譯）'],
      examples: Array.isArray(item.examples) ? item.examples : [],
      rootInfo: item.rootInfo || item.root || ''
    };
  }

  _parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current.trim());
    return result;
  }
}
