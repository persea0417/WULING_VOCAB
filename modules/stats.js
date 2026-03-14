// ===================================================================
// Stats Module — 學習統計 & 圖表
// ===================================================================

const DAILY_STATS_KEY = 'vocabmaster_daily_stats';
const STREAK_KEY = 'vocabmaster_streak';

export class StatsModule {
  constructor(app) {
    this.app = app;
  }

  /** Record daily learning count */
  recordDaily(count) {
    const stats = this._loadDailyStats();
    const today = new Date().toISOString().slice(0, 10);

    if (!stats[today]) {
      stats[today] = 0;
    }
    stats[today] += count;

    localStorage.setItem(DAILY_STATS_KEY, JSON.stringify(stats));
    this._updateStreak();
  }

  /** Get last N days of stats */
  getLastNDays(n = 7) {
    const stats = this._loadDailyStats();
    const result = [];
    const now = new Date();

    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      result.push({
        date: key,
        label: `${d.getMonth() + 1}/${d.getDate()}`,
        count: stats[key] || 0
      });
    }

    return result;
  }

  /** Get streak */
  getStreak() {
    try {
      const raw = localStorage.getItem(STREAK_KEY);
      return raw ? JSON.parse(raw) : { count: 0, lastDate: null };
    } catch {
      return { count: 0, lastDate: null };
    }
  }

  _updateStreak() {
    const streak = this.getStreak();
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = (() => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return d.toISOString().slice(0, 10);
    })();

    if (streak.lastDate === today) {
      // Already recorded today
      return;
    } else if (streak.lastDate === yesterday) {
      streak.count++;
    } else if (!streak.lastDate) {
      streak.count = 1;
    } else {
      streak.count = 1; // Reset streak
    }

    streak.lastDate = today;
    localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
  }

  _loadDailyStats() {
    try {
      const raw = localStorage.getItem(DAILY_STATS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  /** Render the stats chart using Canvas */
  renderChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    const width = rect.width;
    const height = 180;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);

    const data = this.getLastNDays(7);
    const maxVal = Math.max(...data.map(d => d.count), 5);

    const padding = { top: 20, right: 20, bottom: 35, left: 40 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Compute theme colours from CSS
    const style = getComputedStyle(document.documentElement);
    const textMuted = style.getPropertyValue('--text-muted').trim() || '#6a6a82';
    const accentLight = style.getPropertyValue('--accent-light').trim() || '#a29bfe';
    const accent = style.getPropertyValue('--accent').trim() || '#6c5ce7';

    // Grid lines
    ctx.strokeStyle = textMuted + '20';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Y-axis labels
    ctx.fillStyle = textMuted;
    ctx.font = '11px Inter, sans-serif';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      const val = Math.round(maxVal - (maxVal / 4) * i);
      ctx.fillText(val.toString(), padding.left - 8, y + 4);
    }

    // Bars with gradient + animation
    const barWidth = chartW / data.length * 0.5;
    const barGap = chartW / data.length;

    data.forEach((d, i) => {
      const x = padding.left + i * barGap + (barGap - barWidth) / 2;
      const barH = d.count > 0 ? (d.count / maxVal) * chartH : 0;
      const y = padding.top + chartH - barH;

      // Gradient bar
      const grad = ctx.createLinearGradient(x, y, x, padding.top + chartH);
      grad.addColorStop(0, accentLight);
      grad.addColorStop(1, accent + '60');
      ctx.fillStyle = grad;

      // Rounded bar
      const radius = Math.min(barWidth / 2, 6);
      if (barH > 0) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + barWidth - radius, y);
        ctx.quadraticCurveTo(x + barWidth, y, x + barWidth, y + radius);
        ctx.lineTo(x + barWidth, padding.top + chartH);
        ctx.lineTo(x, padding.top + chartH);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.fill();
      }

      // Value above bar
      if (d.count > 0) {
        ctx.fillStyle = accentLight;
        ctx.font = '600 12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(d.count.toString(), x + barWidth / 2, y - 6);
      }

      // X-axis label
      ctx.fillStyle = textMuted;
      ctx.font = '11px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(d.label, x + barWidth / 2, height - 8);
    });
  }

  /** Render the word list in stats page */
  renderWordList(filter = 'all', sourceWords = null) {
    const container = document.getElementById('word-list-items');
    if (!container) return;

    const allWords = sourceWords || this.app.getAllWords();
    let filtered;

    switch (filter) {
      case 'mastered':
        filtered = this.app.sr.getMasteredWords(allWords);
        break;
      case 'learning':
        filtered = this.app.sr.getLearningWords(allWords);
        break;
      case 'new':
        filtered = this.app.sr.getNewWords(allWords);
        break;
      default:
        filtered = allWords;
    }

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">📭</div>
          <p>此分類暫無單字</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map((w, i) => {
      const p = this.app.sr.getWordProgress(w.word);
      let statusClass = 'new-word', statusText = '待學習';
      if (p.level >= 7) { statusClass = 'mastered'; statusText = '已掌握'; }
      else if (p.level >= 1) { statusClass = 'learning'; statusText = '學習中'; }

      return `
        <div class="wl-item" style="animation-delay:${Math.min(i * 0.03, 0.3)}s">
          <div>
            <div class="wl-word">${w.word}</div>
            <div class="wl-meaning">${w.meanings[0]}</div>
          </div>
          <span class="wl-status ${statusClass}">${statusText}</span>
        </div>
      `;
    }).join('');
  }

  /** Update stats page numbers */
  updateStatsNumbers() {
    const activeWords = this.app.getActiveWords();
    const mastered = this.app.sr.getMasteredWords(activeWords).length;
    const accuracy = this.app.sr.getAccuracy();

    const el = (id) => document.getElementById(id);
    const statsTotal = el('stats-total');
    const statsMastered = el('stats-mastered');
    const statsAccuracy = el('stats-accuracy');

    if (statsTotal) this._animateNumber(statsTotal, activeWords.length);
    if (statsMastered) this._animateNumber(statsMastered, mastered);
    if (statsAccuracy) statsAccuracy.textContent = accuracy + '%';
  }

  /** Animate number counting up */
  _animateNumber(el, target) {
    const start = parseInt(el.textContent) || 0;
    if (start === target) return;

    const duration = 600;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(start + (target - start) * eased);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }

  /** Reset everything */
  reset() {
    localStorage.removeItem(DAILY_STATS_KEY);
    localStorage.removeItem(STREAK_KEY);
  }
}
