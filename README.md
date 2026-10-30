# TradeMitra (ट्रेड मित्र) 📈
### Simple Indian Stock Market Research & Daily Gain Application

A lightweight, zero-cost, mobile-first Progressive Web Application (PWA) designed for beginners to generate consistent passive income through systematic **1-Day (BTST)** and **2–4 Day frequency swing trading** on the National Stock Exchange of India (NSE).

---

## 🌟 Beginner-Friendly Philosophy

1. **Simple Everyday English — No Jargon or Charts Needed:**
   * Tells you plainly: **Which Stock to Buy**, **Best Price to Buy**, **Sell Here for Profit (+4% to +6%)**, and **Safety Price (Avoid Loss)**.
2. **Dual Trading Horizons (Toggleable with 1 Tap):**
   * ⚡ **Buy Today, Sell Tomorrow (1-Day Quick Profit):** +1.5% to +2.5% target.
   * 📈 **Hold for 2 to 4 Days (Bigger Profit):** +4.5% to +6.5% target.
3. **Auto-Pilot Market Mood (Good & Bad Market Adapters):**
   * **Good Market (Uptrend):** Growth leaders and momentum pullbacks (`ICICIBANK`, `RELIANCE`, `LT`).
   * **Bad / Falling Market:** Defensive haven rotation (`ITC`, `SUNPHARMA`) & deep oversold support bounces.
   * **Crash Shield:** In sharp market panics, automatically switches to Capital Preservation mode (`NO TRADE - CASH PRESERVATION`).
4. **10–15 Year Track Record Verification:**
   * Every setup is mathematically backtested over 10–15 years of daily NSE data. Only patterns with a verified **$\ge 70\%$ historical win rate** qualify.
5. **Real-Time Live Prices (5-Second Auto-Ticker):**
   * When the app is open, stock prices update automatically every **5 seconds** directly from the exchange.
6. **2–3 Month Zero-Risk Practice Account:**
   * Starts with ₹1,00,000 in virtual cash.
   * Place practice buy orders with 1 tap, track daily profit/loss, and independently verify your win rate before risking real savings.
7. **Cloud Telegram Alerts (Runs Without Opening the App):**
   * Alerts are dispatched directly to your mobile phone via Telegram Bot API right at **03:15 PM IST** (the best time to place your order before 03:30 PM market close).
   * **You do NOT need to keep the app open** — GitHub Actions runs automatically in the cloud.

---

## 🛠️ Current Technical Stack Specification
*(All future enhancements must strictly adhere to this zero-cost, zero-build architecture, matching `C:\xampp\htdocs\Shreeji`)*

| Layer | Technology / Service | Operating Cost | Details & Architectural Guarantees |
| :--- | :--- | :--- | :--- |
| **Frontend Core** | Pure Vanilla HTML5, CSS3, ES6+ JavaScript | **₹0 / $0** | **Zero Build / Zero Compilation.** No React, Vue, Angular, Vite, or Webpack. Fast DOM rendering, zero `npm install` needed. |
| **Styling & Theme** | Mobile-First Custom CSS | **₹0 / $0** | Glassmorphism, CSS variables, dark/light themes, fully responsive down to 320px mobile screens. |
| **Hosting & Deployment** | **Cloudflare Pages** (Static PWA) | **₹0 / $0** | **100% Free Forever.** Unlimited bandwidth, 500 builds/month, ultra-fast 300+ city global Edge network, free automated SSL, custom domain support. |
| **Serverless API Layer** | Cloudflare Pages Functions (`functions/api/`) & Netlify Functions | **₹0 / $0** | 100,000 free requests/day Edge Functions (`functions/api/quote.js` and `batch.js`) proxying live NSE quotes. **No PHP, no heavy backend.** |
| **Cloud Database** | **Google Firebase Cloud Firestore** | **₹0 / $0** | **Permanently Free (Spark Tier).** Real-time multi-device synchronization (`onSnapshot` / `setDoc`) between phone and desktop. **Never pauses or sleeps.** |
| **Local Storage Engine** | IndexedDB & `localStorage` | **₹0 / $0** | Offline-first persistence. Bootstraps in < 50ms from local storage even when offline. |
| **Offline PWA** | Web App Manifest + Service Worker | **₹0 / $0** | `manifest.json` + `sw.js` (Network-First with instant cache invalidation). Auto-updates seamlessly on phone without needing to reinstall. |
| **Daily Cloud Automation** | **GitHub Actions** Scheduled Workflow | **₹0 / $0** | Runs every weekday at **09:45 UTC (03:15 PM IST)** on Microsoft Azure cloud infrastructure. Runs without opening the app. |
| **Alert Notifications** | Telegram Bot API | **₹0 / $0** | Free, instant mobile trade alerts for Buy suggestions, Target hits, and Safety stop-loss notifications. |
| **Security & Privacy** | Web Crypto API (SHA-256) + WebAuthn | **₹0 / $0** | 4-digit Master PIN, biometric sensor unlock (Fingerprint / Face ID / Windows Hello), and 5-minute inactivity auto-lock. |

---

## ⏰ Order Timing: Why 03:15 PM is the Best Time to Place Orders

In the Indian Stock Market (NSE):
* Normal market trading hours are **09:15 AM to 03:30 PM**.
* **Before 03:00 PM:** The daily closing candlestick is still forming and volatile intraday news can reverse patterns.
* **After 03:25 PM:** Broker intraday auto-square-off (MIS orders) floods the market with sudden chaotic spikes and widening bid-ask spreads.
* **The Prime Sweet Spot is 03:10 PM to 03:20 PM (Specifically 03:15 PM):**
  1. The daily candlestick, institutional volume, and RSI are **98% complete and confirmed**.
  2. You have a relaxed **10 to 15-minute window** before the 03:30 PM bell to review today's top stock and place your buy order calmly at Current Market Price (CMP).
  3. This completely avoids morning 09:15 AM panic and lets you capture overnight gap-up momentum safely.

---

## ☁️ How Cloud Telegram Alerts Work Without Opening the App

You **do not need to open the application or keep your computer on** to receive trade alerts at 03:15 PM:
1. **GitHub Actions Cloud Runner:** Every Monday to Friday at `09:45 UTC` (= **15:15 IST / 3:15 PM**), GitHub's cloud servers trigger [`.github/workflows/daily-scan.yml`](file:///.github/workflows/daily-scan.yml).
2. **Python Scanner Execution:** The runner executes [`research/scanner.py`](file:///research/scanner.py), downloads live daily bars from the NSE, and verifies the 10-year backtest criteria ($\ge 70\%$ win rate).
3. **Telegram Dispatch:** The runner sends an HTTP POST request to your Telegram bot.
4. **Instant Phone Notification:** Your mobile Telegram app alerts you immediately with today's stock name, entry price, profit target, and safety stop-loss.

---

## 📊 Dual Market Regime Strategies

### 1. Good Market (Bullish / Normal Uptrend)
* **Market Condition:** Nifty 50 is trading above its 20 EMA & 200 EMA dynamic support.
* **Mode 1 (1-Day BTST):** *Closing Momentum Surge.* Buy stocks closing in the top 10% of their daily range with volume > 1.5x average. Target: **+1.5% to +2.5%** overnight.
* **Mode 2 (2–4 Day Swing):** *Trend Pullback.* Buy market leaders pulling back to 20-day EMA support with cooled RSI (40–55). Target: **+4.5% to +6.5%** in 2–4 days.

### 2. Bad Market (Bearish / Falling / Choppy)
* **Market Condition:** Nifty 50 is trading below its 200 EMA or under sharp selling pressure.
* **Strategy 1 (Defensive Sector Rotation):** Switches automatically to non-cyclical cash-flow leaders (FMCG: `ITC`, `HINDUNILVR`; Pharma: `SUNPHARMA`). These companies regularly gain even while Nifty falls.
* **Strategy 2 (Oversold Deep Support Bounce):** Buys institutional bluechips at multi-month major support when RSI touches extreme oversold ($\le 32$) with a tight stop-loss.
* **Strategy 3 (Crash Shield):** If Nifty falls > 2.0% in panic, system activates `NO TRADE - CASH PRESERVATION`.

---

## 🗄️ Database Schema & Sync Architecture

The application implements a multi-layer database architecture matching `Shreeji`:

```text
Database Architecture:
├── Local Storage Layer (Instant Boot, 100% Offline)
│   ├── IndexedDB (Database: 'market_nirav_db', Store: 'app_state')
│   └── LocalStorage (State caching for sub-50ms render)
│
└── Cloud Storage Layer (Multi-Device Sync, Permanently Free)
    └── Google Firebase Cloud Firestore (trademitra-58e1d)
        └── Document: 'marketNirav/liveAppData'
            ├── user_settings: { startingCash, riskPct, activeMode, pin, telegramConfig }
            ├── open_positions: [ { id, symbol, mode, entryPrice, target, stop, qty, pnl } ]
            ├── trade_journal: [ { id, date, symbol, mode, pnlRupees, pnlPct, reason } ]
            └── market_state: { regime, niftyTrend, lastScanTime, activeSignals }
```

---

## 🚀 Live Deployment on Cloudflare Pages (Recommended - 100% Free Forever)

Cloudflare Pages provides generous free-tier limits: **Unlimited bandwidth**, **500 builds/month**, and **100,000 requests/day** for serverless edge functions.

### Step-by-Step Deployment Instructions:

1. **Push the Latest Code to GitHub:**
   ```bash
   git add .
   git commit -m "Configure Cloudflare Pages deployment"
   git push origin main
   ```

2. **Log into Cloudflare Dashboard:**
   * Go to [Cloudflare Dashboard](https://dash.cloudflare.com/).
   * If you don't have an account, sign up for free (no credit card required).

3. **Create a Pages Project:**
   * In the left sidebar, click **Workers & Pages**.
   * Click **Create application** (or **Create project**), then select the **Pages** tab.
   * Click **Connect to Git**.
   * Select your GitHub account and authorize access to your repository: `niravbhavsar/trade-mitra`.
   * Click **Begin setup**.

4. **Configure Build Settings:**
   * **Project name:** `trade-mitra` (or `trademitra`)
   * **Production branch:** `main`
   * **Framework preset:** Select **None**
   * **Build command:** *(Leave completely blank / empty)*
   * **Build output directory:** `.` (or leave empty if it defaults to root)
   * **Root directory:** *(Leave blank)*

5. **Deploy:**
   * Click **Save and Deploy**.
   * Cloudflare will fetch the repository, build the serverless functions in `functions/api/`, deploy the static PWA shell, and assign a live URL (e.g., `https://trade-mitra.pages.dev` or `https://trademitra.pages.dev`).

6. **Open Your App:**
   * Visit your Cloudflare Pages URL on your mobile phone or laptop.
   * Enter Master PIN: `5189`.
   * Tap **Install App** / **Add to Home screen** in your browser menu to run it as a full-screen PWA.

*(Note: If you ever want to redeploy or update the app in the future, simply run `git push origin main` — Cloudflare Pages will automatically detect the commit and deploy within ~15 seconds.)*

---

## 💻 Local Development / XAMPP

Since the application has **zero build dependencies**, you can run it immediately without any build tools:
* Place in `C:\xampp\htdocs\trade-mitra\` and open `http://localhost/trade-mitra/` in any browser.

---

## 🔒 Security & Privacy

* **Master PIN:** Default is `5189` (configurable under Settings).
* **60-Minute Session Memory:** PIN is required on initial access. Once unlocked, the app stays conveniently unlocked for 60 minutes across page refreshes and tab reloads. After 60 minutes, it automatically locks again.
* **Manual Immediate Lock:** Tap the lock icon in the top header at any time to immediately lock the app and terminate the active 60-minute session.
* **Biometric Unlock:** One-tap unlock using device fingerprint / Face ID / Windows Hello.

---

## 📌 Rules for Future Enhancements

To preserve the zero-cost, lightweight reliability of this application, all future development must follow these rules:
1. **Never introduce server-side scripting (No PHP, Ruby, etc.)** that prevents static Cloudflare Pages hosting.
2. **Never add heavy frontend frameworks (No React, Vue, Angular)** that require build pipelines or node bundling.
3. Keep all client code in pure **Vanilla HTML5, CSS3, ES6+ JavaScript**.
4. Use **Cloudflare Pages Functions** (`functions/api/*.js`) or **Netlify Functions** (`netlify/functions/*.js`) for any required serverless proxy APIs.
5. Use **Google Firebase Cloud Firestore** client SDK for all cloud data synchronization.
6. Maintain full **offline capability** through local IndexedDB and Service Worker caching.

---

## ⚠️ Disclaimer
*TradeMitra is a personal research and simulated practice-trading platform. It does not provide SEBI-registered financial advisory services. Always complete the 2–3 month practice trial before considering real-market trades.*
