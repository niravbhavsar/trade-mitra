# Indian Stock Market Research & Paper-Trading App — Implementation Plan

**Document purpose:** Complete architectural specification and execution roadmap for **Market-Nirav**, a beginner-friendly, zero-cost, high-probability Indian stock market research and paper-trading web application.

**Project Owner:** Nirav Bhavsar  
**Primary Market:** NSE (National Stock Exchange of India) Cash Equities (Nifty 50 & Nifty Next 50 liquid stocks)  
**Trading Frequencies (Dual Mode):**
1. **Mode 1: 1-Day Quick Flip / BTST (Buy Today, Sell Tomorrow / Same-Day):** Target +1.5% to +2.5% gain, tight stop -0.8% to -1.2%.
2. **Mode 2: 2 to 5 Days Short Swing:** Target +4.0% to +7.0% gain, stop -1.8% to -2.5%.  
**Market Adaptability:** Dual-Regime Strategies that automatically adapt to **Good (Bullish)** and **Bad (Bearish / Crash / Choppy)** market conditions.  
**Target User Persona:** Beginner with zero prior stock market knowledge who wants systematic, automated, passive-income-oriented trade guidance without chart complexity.  
**Money Handling:** Paper Trading (virtual capital) for an initial 2–3 month evaluation phase. Zero real-money broker connection.  
**Operating Cost:** **₹0 / $0 per month** (100% Free Tiers across Netlify, Firebase Cloud Firestore, GitHub Actions, and Python NSE data).  
**Hosting & Deployment:** **Netlify** (`https://*.netlify.app/`) + Local XAMPP (`http://localhost/market-nirav/`).  
**Database Layer:** **Google Firebase Cloud Firestore** (Spark Free Tier) + **Local IndexedDB & LocalStorage** offline persistence engine (matching `C:\xampp\htdocs\Shreeji`).

---

## 1. Product Vision & Beginner-First Philosophy

### 1.1 The Problem
Stock markets do not move up in a straight line. Many strategies that work in bull markets fail completely in bear or sideways markets. Additionally, beginners have different time preferences: some prefer quick 1-day daily flips (buying today and exiting tomorrow morning), while others prefer holding for 2 to 5 days.

### 1.2 The Solution: Multi-Regime & Dual-Horizon Decision Support
**Market-Nirav** functions as an automated quantitative research analyst:
1. **Dual Market Conditions Engine (Good vs Bad Market):**
   - **Good / Bull Market Condition (Nifty > 200 EMA & Uptrend):** Identifies high-momentum trend-pullback setups in top performing growth sectors.
   - **Bad / Bear Market Condition (Nifty < 200 EMA or High Volatility):** Activates **Defensive Sector Rotation** (FMCG, Pharma, IT cash-rich dividend stocks) and **Extreme Oversold Mean-Reversion** (buying institutional blue-chips at multi-month structural support with tight stop-losses).
   - **Crash Shield:** If market experiences extreme panic, automatically switches to Capital Preservation mode (`NO TRADE - CASH PRESERVATION`).
2. **Dual Trading Horizons (Toggleable with 1 Tap):**
   - **1-Day / BTST Quick Flip:** For fast daily turnaround (Target: +1.5% to +2.5% overnight).
   - **2–5 Day Swing:** For larger momentum swings (Target: +4% to +7% over 3–4 days).
3. **10–15 Year Historical Proof:** Every setup is tested across 10–15 years of daily data; only setups with $\ge 70\%$ historical win rate are surfaced.
4. **Complete Cloud & Offline Database:**
   - Google Firebase Cloud Firestore synchronization across devices.
   - Local IndexedDB fallback ensuring 100% offline usability.
   - Persistent storage for paper portfolio, virtual ledger, settings, and journal.

---

## 2. Technology Stack & Database Architecture

| Layer | Technology | Cost | Purpose & Guarantees |
| :--- | :--- | :--- | :--- |
| **Frontend Core** | Pure HTML5, Modern Vanilla CSS3, ES6+ JavaScript | **₹0** | Zero-Build, No Heavy Frameworks. No React, Vue, or Webpack. Works directly on any browser, Netlify, and local XAMPP. |
| **Cloud Database** | Google Firebase Cloud Firestore (Spark Free Plan) | **₹0** | **Never pauses or sleeps** (50,000 reads/day, 20,000 writes/day, 1GB storage). Real-time sync (`onSnapshot` / `setDoc`) between mobile phone and PC. |
| **Local Database Engine** | IndexedDB & `localStorage` | **₹0** | Complete client-side database with stores for `user_settings`, `open_positions`, `trade_journal`, and `market_scans`. Instant offline boot. |
| **PWA & Offline** | `manifest.json` + `sw.js` (Service Worker) | **₹0** | Installs as a standalone mobile app on Android, iOS, and Windows desktop. Cache-first architecture. |
| **Charts** | TradingView Lightweight Charts + High-DPI Canvas Fallback | **₹0** | Free, open-source (Apache 2.0). Visual candlestick charts with Target (green) and Stop-Loss (red) overlay lines. |
| **Security & Privacy** | Web Crypto API (SHA-256) + WebAuthn Biometrics | **₹0** | 4-digit Master PIN protection, fingerprint / Windows Hello unlock, 5-minute inactivity screen lock. |
| **Research & Backtesting** | Python 3 (`pandas`, `numpy`, `yfinance`) | **₹0** | Ingests 10–15 years of NSE historical data, evaluates Good/Bad market rules, computes win-rates and drawdowns. |
| **Daily Automation** | GitHub Actions Workflow | **₹0** | Runs daily at 16:00 IST (after NSE market close), evaluates dual-mode setups, updates Firestore, and sends Telegram alerts. |
| **Telegram Notifications** | Telegram Bot API | **₹0** | Instant mobile trade alerts for Buy suggestions, Target hits, and Safety exits. |
| **Hosting & Deployment** | **Netlify** | **₹0** | 100% Free static hosting, continuous Git auto-deployment, custom `.netlify.app` domain, free SSL. |

---

## 3. Dual Market Regime Strategies (Good vs Bad Market)

### 3.1 Regime A: Good Market (Bullish / Normal Uptrend)
- **Market State:** Nifty 50 is trading above its 50 EMA and 200 EMA; Advance-Decline ratio is positive.
- **Strategy 1 (2–5 Day Swing):** *Trend-Pullback.* Buy high-beta market leaders (Banking, Auto, Capital Goods) pulling back to the 20-day EMA with daily RSI 40–55. Target: +4% to +7%, Stop: -1.8% to -2.2%.
- **Strategy 2 (1-Day BTST Flip):** *Closing Momentum Breakout.* Buy stocks closing in the top 10% of their daily range with volume > 1.5x average, holding overnight for the morning gap-up burst. Target: +1.5% to +2.5%, Stop: -0.8% to -1.0%.

### 3.2 Regime B: Bad Market (Bearish Correction / Choppy / Panic)
- **Market State:** Nifty 50 is below 50/200 EMA or experienced a sharp multi-day sell-off.
- **Strategy 1 (Defensive Sector Rotation):** Rotate out of high-beta cyclicals into non-cyclical defensive cashflow giants (FMCG: ITC, HINDUNILVR; Healthcare: SUNPHARMA, CIPLA; Utilities). These stocks act as capital havens and regularly gain even while Nifty falls.
- **Strategy 2 (Oversold Deep-Support Mean-Reversion):** When an institutional blue-chip drops sharply to multi-month major support and daily RSI touches extreme oversold ($\le 32$), wait for a bullish rejection hammer candle. Buy on the mean-reversion bounce back to the 20 EMA. Target: +3.5% to +5%, Stop: strictly below hammer low (-1.2% to -1.5%).
- **Strategy 3 (Crash Shield):** If Nifty falls > 2.0% in a single session with widespread panic, the system automatically engages Cash Shield (`NO TRADE - CAPITAL PRESERVATION`).

---

## 4. Dual Trading Horizons (Frequencies)

The user can toggle between two distinct trading styles with a single click:

| Dimension | 1-Day / BTST Quick Flip | 2 to 5 Days Short Swing |
| :--- | :--- | :--- |
| **Holding Horizon** | Buy today at 15:15 IST, Sell tomorrow 09:30–11:00 IST | Buy today, Hold for 2, 3, or 4 days |
| **Profit Target** | **+1.5% to +2.5%** per trade | **+4.0% to +7.0%** per trade |
| **Stop-Loss Protection** | **-0.8% to -1.2%** | **-1.8% to -2.5%** |
| **Ideal For** | Daily action, capturing overnight gap-ups, zero multi-day overnight risk | Capturing larger institutional momentum waves and multi-day trends |
| **Execution Trigger** | High volume closing surge in last 45 mins | Confirmed daily candle close above support |

---

## 5. Database Schema & Persistence Architecture

The application implements a multi-layer database architecture matching `Shreeji`:

```text
Database Architecture:
├── Local Layer (Fastest, Offline-First)
│   ├── IndexedDB (Database: 'market_nirav_db', Store: 'app_state')
│   └── LocalStorage (State caching for instantaneous initial render)
│
└── Cloud Layer (Multi-Device Sync, Free Forever)
    └── Google Firebase Cloud Firestore (Spark Plan)
        └── Document: 'marketNirav/appData'
            ├── user_settings: { startingCash, riskPct, activeMode, pin, telegramConfig }
            ├── open_positions: [ { id, symbol, mode, entryPrice, target, stop, qty, pnl } ]
            ├── trade_journal: [ { id, date, symbol, mode, pnlRupees, pnlPct, reason } ]
            └── market_state: { regime, niftyTrend, lastScanTime, activeSignals }
```

### Firestore Security & Sync Workflow:
1. **Instant Boot:** App reads from local IndexedDB / LocalStorage in < 50ms.
2. **Live Cloud Listener:** Real-time Firestore snapshot listener (`onSnapshot`) synchronizes changes across phone and computer.
3. **Optimistic Writes:** Recording a paper trade immediately updates local state and asynchronously syncs to Firestore (`setDoc`).
4. **Header Sync Badge:** Shows `🟢 Cloud Synced (Firestore)` when online and `🔵 Local DB (IndexedDB)` when offline.

---

## 6. Implementation Roadmap

- **Phase 0:** Project Cleanup & Zero-Build PWA Foundation (Completed).
- **Phase 1:** Core UI Screens, TradingView Chart, and 10-Year Backtest Proof (Completed).
- **Phase 2 (Current):**
  - Implement Dual Market Condition Engine (Good Market Trend Pullbacks + Bad Market Defensive / Oversold Bounces).
  - Implement Dual Trading Horizons (1-Day Quick Flip/BTST vs 2-5 Day Swing toggle).
  - Implement Complete Database Engine (Firebase Cloud Firestore + IndexedDB + LocalStorage).
- **Phase 3:** Python Daily Scanner & Automated GitHub Actions Cron with Telegram Alerts.
- **Phase 4:** Netlify Deployment & 2–3 Month Dummy Trial Evaluation.
