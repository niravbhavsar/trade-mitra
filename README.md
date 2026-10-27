# TradeMitra (ट्रेड मित्र) 📈
### Simple Indian Stock Market Research & Daily Gain Application

A lightweight, zero-cost, mobile-first Progressive Web Application (PWA) designed for beginners to generate consistent passive income through systematic **1-Day and 2–4 Day frequency swing trading** on the National Stock Exchange of India (NSE).

---

## 🌟 Beginner-Friendly Philosophy

1. **No Charts or Jargon Needed:**
   - Tells you **Which Stock to Buy**, **Best Price to Buy**, **Sell Here for Profit (+4% to +6%)**, and **Safety Price (Avoid Loss)**.
2. **Dual Trading Modes:**
   - ⚡ **Buy Today, Sell Tomorrow (1-Day Quick Profit):** +1.5% to +2.5% target.
   - 📈 **Hold for 2 to 4 Days (Bigger Profit):** +4.5% to +6.5% target.
3. **Good & Bad Market Adapters:**
   - **Good Market:** Growth and momentum leaders (`ICICIBANK`, `RELIANCE`, `LT`).
   - **Bad / Falling Market:** Defensive haven rotation (`ITC`, `SUNPHARMA`) & deep oversold support bounces.
4. **10–15 Year Track Record Verification:**
   - Every recommendation is backtested over 10–15 years of daily NSE data. Only setups with a verified **$\ge 70\%$ historical win rate** qualify.
5. **2–3 Month Practice Wallet (Dummy Trial):**
   - Starts with ₹1,00,000 in practice cash.
   - Test trades with 1 click, track daily profit/loss, and independently audit your win-rate before risking real money.
6. **Automated Free Telegram Alerts:**
   - Free instant alerts delivered directly to your mobile via Telegram Bot API when an A+ setup qualifies or an open trade hits its profit price.
7. **Complete Database Engine (Firebase Firestore + Offline IndexedDB):**
   - Saves all practice trades, journal entries, and settings directly in local IndexedDB.
   - Synchronizes across phone and desktop via Google Firebase Cloud Firestore (100% Free Forever).
8. **100% Free Operating Cost (₹0 / $0 Forever):**
   - Hosted on **Netlify** (free static hosting + free SSL).
   - Cloud database on **Google Firebase Spark Tier** (permanently free, never pauses).
   - Daily scanning on **GitHub Actions** (2,000 free minutes/mo).

---

## 🚀 Live Deployment on Netlify

### How to Deploy (Identical to Shreeji):
1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy TradeMitra PWA"
   git push origin main
   ```
2. **Link to Netlify:**
   - Go to [Netlify](https://app.netlify.com/).
   - Click **Add new site** > **Import an existing project** > **GitHub**.
   - Select your repository (`trade-mitra` / `market-nirav`).
   - **Build settings:** Leave build command empty (`publish directory: .`).
   - Click **Deploy Site**.
3. **Your App is Live:** Available at `https://trademitra.netlify.app` with instant PWA mobile capabilities!

---

## 💻 Local Development / XAMPP

Since the app has **zero build dependencies**, you can run it immediately without any `npm install` or compilation:
- Simply open `index.html` in any browser, or
- Place in your XAMPP web root and visit `http://localhost/market-nirav/` or `http://localhost/trademitra/`.

---

## 🔒 Security & Privacy

- **Master PIN:** Default is `5189` (configurable under Settings).
- **Biometric Unlock:** One-tap unlock using device fingerprint / Windows Hello / Face ID via WebAuthn.
- **Inactivity Auto-Lock:** Protects your profit diary after 5 minutes of idle time.

---

## ⚠️ Disclaimer
*TradeMitra is a personal research and simulated paper-trading platform. It does not provide SEBI-registered investment advice or guarantee future profits. Always complete the 2–3 month paper-trading trial before considering live market trades.*
