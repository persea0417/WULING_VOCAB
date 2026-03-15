<p align="center">
  <img src="https://em-content.zobj.net/source/apple/391/open-book_1f4d6.png" width="80" alt="VocabMaster Logo">
</p>

<h1 align="center">VocabMaster 背單字</h1>

<p align="center">
  <strong>在語境中高效記憶英語單字的智能學習應用</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-PWA-6c5ce7?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA">
  <img src="https://img.shields.io/badge/Language-JavaScript-f7df1e?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/License-MIT-00cec9?style=for-the-badge" alt="MIT License">
</p>

---

 功能特色

| 功能 | 說明 |
|------|------|
| 情境式學習：單字搭配真實例句，在語境中加深記憶 |
| 🔄 **間隔重複 基於艾賓浩斯記憶曲線的智能複習排程 |
| 🎯 **多種學習模式** | 閃卡學習、四選一選擇題、拼寫測驗 |
| 📖 **詞書管理** | 自訂分類詞書，將單字分組系統化學習 |
| 📥 **匯入功能** | 支援 CSV / JSON / TXT 格式，輕鬆擴充詞庫 |
| 📊 **學習統計** | 每日學習量圖表、連續學習天數追蹤 |
| 🌙 **主題切換** | 深色 / 淺色模式，保護眼睛 |
| 🔊 **語音朗讀** | 支援美式 / 英式發音，可設定自動朗讀 |
| 📱 **PWA 離線** | 可安裝到手機主畫面，無網路也能使用 |

## 快速開始

### 線上使用

直接造訪 → **[VocabMaster](https://persea0417.github.io/WULING_VOCAB/)**

> 💡 在手機瀏覽器中打開後，點選「加入主畫面」即可像原生 App 一樣使用。

### 本地開發

```bash
# 1. Clone 專案
git clonehttps://persea0417.github.io/WULING_VOCAB.git
cd vocab-app

# 2. 啟動本地伺服器（任選一種）
python -m http.server 8080
# 或
npx serve .

# 3. 打開瀏覽器
# http://localhost:8080
```

> ⚠️ 因為使用了 ES Modules，必須透過 HTTP 伺服器開啟，不能直接雙擊 `index.html`。

## 📥 匯入單字格式

VocabMaster 支援多種格式匯入自訂單字：

**CSV 格式：**
```csv
word,meaning
hello,你好
world,世界
```

**TXT 格式（管線分隔）：**
```
hello | 你好
world | 世界
```

**JSON 格式：**
```json
[
  { "word": "hello", "meanings": ["你好"] },
  { "word": "world", "meanings": ["世界"] }
]
```

## 🏗️ 技術架構

```
vocab-app/
├── index.html          # 主頁面
├── app.js              # 應用主控制器
├── style.css           # 設計系統（iOS 風格動畫）
├── sw.js               # Service Worker（離線快取）
├── manifest.json       # PWA 設定檔
├── data/
│   └── words.js        # 內建單字庫（64 個核心詞彙）
├── modules/
│   ├── learning.js     # 學習模組（閃卡模式）
│   ├── quiz.js         # 測驗模組（選擇題 + 拼寫）
│   ├── stats.js        # 統計圖表模組
│   ├── import.js       # 單字匯入模組
│   ├── wordbook.js     # 詞書管理模組
│   └── spaced-repetition.js  # 間隔重複演算法
└── icons/
    ├── icon-192.png    # PWA 圖示
    └── icon-512.png    # PWA 圖示
```

**核心技術：**
- 純 HTML / CSS / JavaScript — 零框架、零依賴
- CSS Custom Properties 設計系統 + iOS 風格 Spring 動畫
- localStorage 持久化學習進度
- Service Worker 離線快取
- Web Speech API 語音朗讀

## 📄 License

MIT License — 自由使用、修改與分享。
