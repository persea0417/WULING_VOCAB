// ===================================================================
// Word Book Module — 詞書管理
// ===================================================================

const BOOKS_KEY = 'vocabmaster_books';
const ACTIVE_BOOK_KEY = 'vocabmaster_active_book';

export class WordBookModule {
  constructor(app) {
    this.app = app;
    this.books = this._load();
    this._ensureDefaultBook();
  }

  // ── Persistence ──
  _load() {
    try {
      const raw = localStorage.getItem(BOOKS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  _save() {
    try {
      localStorage.setItem(BOOKS_KEY, JSON.stringify(this.books));
    } catch (e) {
      console.warn('WordBook save failed:', e);
    }
  }

  /** Ensure a default book exists with all built-in words */
  _ensureDefaultBook() {
    let defaultBook = this.books.find(b => b.id === 'default');
    if (!defaultBook) {
      const builtInKeys = this.app.builtInWords.map(w => w.word);
      defaultBook = {
        id: 'default',
        name: '核心詞彙',
        icon: '📘',
        words: builtInKeys,
        createdAt: new Date().toISOString()
      };
      this.books.unshift(defaultBook);
      this._save();
    } else {
      // Ensure all built-in words are in the default book
      const builtInKeys = this.app.builtInWords.map(w => w.word);
      const existing = new Set(defaultBook.words);
      let added = false;
      for (const key of builtInKeys) {
        if (!existing.has(key)) {
          defaultBook.words.push(key);
          added = true;
        }
      }
      if (added) this._save();
    }
  }

  // ── CRUD ──

  /** Get all books */
  getBooks() {
    return this.books;
  }

  /** Get a specific book by id */
  getBook(id) {
    return this.books.find(b => b.id === id) || null;
  }

  /** Create a new book */
  createBook(name, icon = '📗') {
    const id = 'book_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
    const book = {
      id,
      name,
      icon,
      words: [],
      createdAt: new Date().toISOString()
    };
    this.books.push(book);
    this._save();
    return book;
  }

  /** Delete a book by id (cannot delete default) */
  deleteBook(id) {
    if (id === 'default') return false;
    const idx = this.books.findIndex(b => b.id === id);
    if (idx === -1) return false;
    this.books.splice(idx, 1);
    this._save();

    // If the deleted book was active, switch to 'all'
    if (this.getActiveBookId() === id) {
      this.setActiveBookId('all');
    }
    return true;
  }

  /** Rename a book */
  renameBook(id, newName) {
    const book = this.getBook(id);
    if (!book) return false;
    book.name = newName;
    this._save();
    return true;
  }

  // ── Word Assignment ──

  /** Add words to a book */
  addWordsToBook(bookId, wordKeys) {
    const book = this.getBook(bookId);
    if (!book) return 0;

    const existing = new Set(book.words);
    let added = 0;
    for (const key of wordKeys) {
      if (!existing.has(key)) {
        book.words.push(key);
        existing.add(key);
        added++;
      }
    }

    this._save();
    return added;
  }

  /** Remove a word from a book */
  removeWordFromBook(bookId, wordKey) {
    const book = this.getBook(bookId);
    if (!book) return false;
    const idx = book.words.indexOf(wordKey);
    if (idx === -1) return false;
    book.words.splice(idx, 1);
    this._save();
    return true;
  }

  // ── Active Book ──

  /** Get active book id. 'all' means all books. */
  getActiveBookId() {
    try {
      return localStorage.getItem(ACTIVE_BOOK_KEY) || 'all';
    } catch {
      return 'all';
    }
  }

  /** Set active book */
  setActiveBookId(id) {
    try {
      localStorage.setItem(ACTIVE_BOOK_KEY, id);
    } catch (e) {
      // ignore
    }
  }

  // ── Query ──

  /** Get word objects for a specific book */
  getWordsForBook(bookId, allWords) {
    if (bookId === 'all') return allWords;

    const book = this.getBook(bookId);
    if (!book) return allWords;

    const wordSet = new Set(book.words);
    return allWords.filter(w => wordSet.has(w.word));
  }

  /** Get word objects for the currently active book */
  getActiveWords(allWords) {
    return this.getWordsForBook(this.getActiveBookId(), allWords);
  }

  /** Get which books a word belongs to */
  getBooksForWord(wordKey) {
    return this.books.filter(b => b.words.includes(wordKey));
  }

  /** Get book word count */
  getBookWordCount(bookId) {
    if (bookId === 'all') {
      return this.app.getAllWords().length;
    }
    const book = this.getBook(bookId);
    return book ? book.words.length : 0;
  }

  /** Reset all books */
  reset() {
    this.books = [];
    localStorage.removeItem(BOOKS_KEY);
    localStorage.removeItem(ACTIVE_BOOK_KEY);
    this._ensureDefaultBook();
  }
}
