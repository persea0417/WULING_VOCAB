<p align="center">
  <img src="https://em-content.zobj.net/source/apple/391/open-book_1f4d6.png" width="80" alt="VocabMaster Logo">
</p>

<h1 align="center">VocabMaster 背單字</h1>

<p align="center">
  <strong>結合 SM-2 間隔重複與「不背單詞」硬核機制的智能學習 PWA</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-PWA-6c5ce7?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA">
  <img src="https://img.shields.io/badge/Language-JavaScript-f7df1e?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Algorithm-SM--2-ff6b81?style=for-the-badge" alt="SM-2 Algorithm">
  <img src="https://img.shields.io/badge/License-MIT-00cec9?style=for-the-badge" alt="MIT License">
</p>

---

## 🌟 功能特色

| 功能 | 說明 |
|------|------|
| 🧠 **硬核學習迴圈** | 仿照「不背單詞」的核心體驗：學習階段全覽解析，測驗階段強制四選一，**答錯即退回學習並塞回佇列**，直到確實記住為止。 |
| 🔄 **動態間隔重複 (SM-2)** | 捨棄固定天數，改用標準 SuperMemo-2 演算法。動態計算 `Ease Factor` 與下一次複習間隔 (Interval)，真正做到科學記憶。 |
| 🎨 **多重設計風格系統** | 提供三種完全獨立的 CSS 主題切換：<br>- **Minimalist** (極簡瑞士風)<br>- **Skeuomorph** (寫實擬物風)<br>- **Neumorphism** (新擬態風) |
| 📖 **自訂詞書與匯入** | 內建管理系統，支援 CSV、JSON 以及純文字 (管線分隔) 格式匯入單字。 |
| 📊 **學習數據與統計** | 圖表化追蹤每天的學習量與單字熟練度分佈。 |
| 🔊 **自動發音** | 整合 Web Speech API，支援英/美發音及自動朗讀單字。 |
| 📱 **離線 PWA 體驗** | 具備 Service Worker 快取，無網路也能學習，並可安裝至手機桌面 (Add to Home Screen)。 |

## 🚀 快速開始

### 線上體驗
直接造訪 👉 **[VocabMaster (GitHub Pages)](https://persea0417.github.io/WULING_VOCAB/)**

> 💡 **Tip:** 在手機瀏覽器中打開後，點選「加入主畫面 (Add to Home Screen)」，即可享受如同原生 App 般的全螢幕沉浸體驗！

### 本地開發與運行

```bash
# 1. 複製專案
git clone https://github.com/persea0417/vocab-app.git
cd vocab-app

# 2. 啟動本地伺服器（任選一種）
# 方法 A: Python (內建)
python -m http.server 8080

# 方法 B: Node.js
npx serve .

# 3. 打開瀏覽器
# http://localhost:8080
```

> ⚠️ **注意：** 本專案使用 ES Modules (`type="module"`) 載入 JS 檔案，因此**必須**透過 HTTP 伺服器開啟，不可直接雙擊點開 `index.html`，否則會出現 CORS 或模組載入錯誤。

## 📥 支援的匯入格式

您可以輕鬆匯入自己的單字庫：

**CSV 格式:**
```csv
word,meaning
hello,你好
world,世界
```

**TXT 格式（管線分隔）:**
```text
hello | 你好
world | 世界
```

**JSON 格式:**
```json
[
  { "word": "hello", "meanings": ["你好"] },
  { "word": "world", "meanings": ["世界"] }
]
```

## 🏗️ 檔案結構與架構

本專案堅持 **零框架 (Vanilla JS) 且零依賴** 的輕量化原則。

```text
WULING_VOCAB-main/
├── index.html                 # PWA 主頁面
├── app.js                     # 應用程式主邏輯與狀態管理
├── sw.js                      # Service Worker (離線快取控制)
├── manifest.json              # PWA 安裝配置清單
├── README.md
│
├── style-minimal.css          # 主題 1：極簡扁平風
├── style-skeuomorph.css       # 主題 2：寫實擬物風
├── style-neumorphism.css      # 主題 3：新擬態風
│
├── data/
│   └── words.js               # 預設單字庫資料
│
├── modules/
│   ├── learning-v2.js         # 🌟 核心：全新硬核學習狀態機 (Study/Quiz)
│   ├── spaced-repetition.js   # 🌟 核心：SM-2 間隔重複演算法實作
│   ├── quiz.js                # 傳統拼寫/測驗模組
│   ├── stats.js               # 統計數據圖表渲染
│   ├── import.js              # 單字檔解析與匯入
│   └── wordbook.js            # 詞庫/分類管理
│
└── icons/                     # PWA 應用圖示
```

### 核心機制設計
1. **資料持久化：** 完全依賴瀏覽器的 `localStorage`，所有使用者的學習進度、詞庫、設定皆保存在本地。
2. **SM-2 演算法：**
   - 答對(Good): 增加間隔，提升難度係數 (Ease Factor)。
   - 答錯(Again): 間隔歸零 (1天)，扣除難度係數，進入強制重新學習迴圈。
3. **學習控制器 (`learning-v2.js`)：**
   - **全覽模式：** 顯示字根、片語、例句。
   - **測驗模式：** 隱藏提示，動態生成三個干擾選項進行四選一。答錯必定退回全覽模式，並將單字放回當日佇列尾端，確保當日記憶。

## 📄 License

本專案採用 **MIT License** — 歡迎自由使用、修改、學習與分享。