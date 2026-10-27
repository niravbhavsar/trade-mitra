# TradeMitra — User Guide (Simple English)

Welcome to **TradeMitra**.

This application helps beginners earn extra income in the Indian stock market.
You do not need prior market knowledge.
Follow the simple steps below.

---

## 1. How to Unlock the App

1. When you open the application, it is locked for your safety.
2. The default Master PIN is **5189**.
3. Tap **5 - 1 - 8 - 9** on the number pad or type it on your keyboard.
4. You can also tap the **Fingerprint / Face icon** to unlock with your phone biometric sensor.
5. Once unlocked, you can see your daily trades and profit diary.

### How to Change Your PIN
1. Tap **Settings** in the bottom navigation menu.
2. Scroll to **Account Security & Master PIN**.
3. Tap the **Eye icon** next to the PIN box to show or hide your digits.
4. Type your new 4-digit PIN.
5. Tap **Save New Master PIN**.

---

## 2. Your 3-Minute Daily Routine

You only need **3 minutes per day** to run this strategy.

### Step 1: Check the App at 3:15 PM (Afternoon)
- The Indian stock market closes at 3:30 PM.
- Open TradeMitra at **3:15 PM**.
- Look at the **Today's Plan** screen.
- You will see today's suggested top stock (e.g. *ICICI Bank* or *Reliance*).
- Tap **Review Setup & Paper Buy**.
- Tap **Simulate Buy** to place the practice trade before 3:25 PM.

### Step 2: Check the App at 9:15 AM (Next Morning)
- The stock market opens at 9:15 AM.
- Open TradeMitra to see the opening prices.
- If the green **Target Profit** is reached, tap **Take Profit**.
- The profit gets added to your **Profit Diary** instantly.

---

## 3. Market Mood is on 100% Auto-Pilot

**Question:** *"I have no knowledge about good or falling markets. How do I choose?"*

**Answer:** **You do not need to choose.**
- TradeMitra automatically detects the market condition for you.
- It checks whether the **Nifty 50** index is above its 200-day average.
- If the market is healthy, it automatically shows: **Good Market (Safe to Buy)**.
- If the market is falling heavily, it automatically switches to: **Defensive Safe Haven Mode**.
- You do not need to do any technical analysis. The system handles it on auto-pilot.

---

## 4. How to Switch Between Dark & Light Theme

- Look at the top right corner of the header.
- Tap the **Sun (☀️)** icon to switch to **Light Theme** (clean white daytime mode).
- Tap the **Moon (🌙)** icon to switch back to **Dark Theme** (sleek financial night mode).
- You can also change the theme anytime in **Settings -> Display Theme**.
- Your theme choice is automatically saved.

---

## 5. Do I Need to Create a Firebase Project?

**Short Answer:** **No, you do not need to create one right now.**

- TradeMitra already includes a fast local database called **IndexedDB**.
- All your practice trades, virtual capital, and notes are saved on your phone or computer automatically.
- It works 100% free and offline without creating any accounts.

### When should you create a Firebase project?
Only create a Firebase project if you want to **sync the exact same portfolio across two different devices** (for example, your phone and your office laptop):
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com).
2. Click **Create a project** (100% Free Spark Tier). Name it `trademitra`.
3. In the left menu, click **Firestore Database** -> **Create Database** -> **Start in test mode**.
4. Copy your **Project ID** into TradeMitra **Settings -> Database Management**.

---

## 6. Where to Get Telegram Bot Token & Chat ID

TradeMitra can send free alerts directly to your phone via Telegram.
Setting this up takes **less than 60 seconds**:

### Step A: Get your Telegram Bot Token
1. Open the Telegram app on your phone.
2. In the search bar at the top, type `@BotFather` and open the chat.
3. Tap **Start** and send the message: `/newbot`
4. Choose a friendly name for your bot (example: `MyTradeMitraAlerts`).
5. Choose a username that ends in "bot" (example: `my_trademitra_bot`).
6. BotFather will reply with an **HTTP API Token** (looks like: `7123456789:AAHk...`).
7. Copy that token and paste it into TradeMitra **Settings -> Telegram Bot Token**.

### Step B: Get your Telegram Chat ID
1. In the Telegram search bar, search for `@userinfobot` and open the chat.
2. Tap **Start**.
3. The bot will immediately reply with your personal **Id** (a 9 or 10 digit number like `987654321`).
4. Copy that number and paste it into TradeMitra **Settings -> Telegram Chat ID**.
5. Tap **Save Telegram Config** and then tap **Send Test Alert**.

---

## 7. Profit Diary & Monthly Goal Thermometer

- Tap **Profit Diary** in the bottom menu.
- Look at the **Monthly Extra Income Goal** thermometer at the top.
- The default monthly goal is **₹15,000 extra income** (enough to cover household grocery and utility bills).
- Every time you close a winning practice trade, the thermometer fills up with green progress.
- Tap the green **📲 WhatsApp Share** button to share your practice scorecard with family or trading partners with one click.

---

## 8. Summary of Safe Practice Rules

1. **Test for 2 to 3 months:** Do not invest real money on day one. Practice with virtual money first.
2. **Stick to the Stop Loss:** Always exit if the safety stop is hit. Never hold a losing trade hoping for a miracle.
3. **Trade at 3:15 PM:** Avoid morning chaos. 3:15 PM gives you calm, reliable daily closing signals.
