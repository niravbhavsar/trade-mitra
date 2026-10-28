"""
Daily Automated NSE Stock Scanner & Telegram Alert Dispatcher
Runs after market close (16:00 IST)
"""
import os
import sys
import json
import requests
import yfinance as yf
from strategy_rules import calculate_technical_indicators, evaluate_swing_signal
from backtest_10yr import run_10yr_backtest

NIFTY_WATCHLIST = [
    # Top Nifty 50 Bluechips
    "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "ICICIBANK.NS", "INFY.NS",
    "BHARTIARTL.NS", "ITC.NS", "LT.NS", "SBIN.NS", "HINDUNILVR.NS",
    "AXISBANK.NS", "TATAMOTORS.NS", "KOTAKBANK.NS", "MARUTI.NS", "TITAN.NS",
    # Top High-Growth Midcaps & Nifty Next 50 Leaders
    "TATAPOWER.NS", "TRENT.NS", "ZOMATO.NS", "BEL.NS", "HAL.NS",
    "POLYCAB.NS", "DIXON.NS", "SUZLON.NS", "CDSL.NS", "ANGELONE.NS"
]

def send_telegram_alert(token: str, chat_id: str, message: str):
    """Sends Telegram alert to user's mobile device."""
    if not token or not chat_id:
        print("Telegram credentials not configured. Skipping notification.")
        return
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": message,
        "parse_mode": "Markdown"
    }
    try:
        res = requests.post(url, json=payload, timeout=10)
        if res.status_code == 200:
            print("Telegram alert sent successfully.")
        else:
            print(f"Telegram failed with status: {res.status_code}")
    except Exception as e:
        print(f"Telegram request failed: {e}")

def parse_firestore_value(v):
    """Helper to convert Firestore REST API JSON to Python native objects."""
    if not isinstance(v, dict):
        return v
    if 'stringValue' in v: return v['stringValue']
    if 'integerValue' in v: return int(v['integerValue'])
    if 'doubleValue' in v: return float(v['doubleValue'])
    if 'booleanValue' in v: return v['booleanValue']
    if 'arrayValue' in v:
        return [parse_firestore_value(x) for x in v['arrayValue'].get('values', [])]
    if 'mapValue' in v:
        return {k: parse_firestore_value(val) for k, val in v['mapValue'].get('fields', {}).items()}
    return v

def check_open_positions_watchdog(telegram_token: str, telegram_chat_id: str):
    """
    Cloud Watchdog: Checks user's open positions directly from Firebase Cloud Firestore.
    Queries live exchange quotes and dispatches Telegram alerts when:
    1. Profit target is reached (Sell for Profit!)
    2. Safety stop-loss is touched (Cut Loss!)
    3. 1-Day BTST morning holding window is active
    """
    print("\n" + "=" * 60)
    print("TradeMitra: Running Cloud Watchdog on Active Holdings...")
    print("=" * 60)
    url = "https://firestore.googleapis.com/v1/projects/trademitra-58e1d/databases/(default)/documents/marketNirav/appData"
    try:
        res = requests.get(url, timeout=10)
        if res.status_code != 200:
            print(f"[Cloud Watchdog] Firestore request returned status {res.status_code}")
            return

        fields = res.json().get('fields', {})
        app_data = {k: parse_firestore_value(v) for k, v in fields.items()}
        
        token = telegram_token or app_data.get('telegramToken')
        chat_id = telegram_chat_id or app_data.get('telegramChatId')
        positions = app_data.get('openPositions', [])

        if not positions:
            print("[Cloud Watchdog] No active positions in Firestore. Nothing to monitor.")
            return

        print(f"[Cloud Watchdog] Monitoring {len(positions)} active position(s)...")

        for pos in positions:
            symbol = pos.get('symbol')
            target = float(pos.get('target', 0))
            stop_loss = float(pos.get('stopLoss', 0))
            entry_price = float(pos.get('entryPrice', 0))
            mode = pos.get('mode', 'swing')
            mode_label = "⚡ 1-Day BTST" if mode == '1day' else "📈 2–4 Day Swing"

            if not symbol or target <= 0:
                continue

            try:
                ticker = f"{symbol}.NS"
                stock_data = yf.Ticker(ticker)
                fast_info = getattr(stock_data, 'fast_info', None)
                live_price = None
                if fast_info:
                    live_price = getattr(fast_info, 'last_price', None)
                if not live_price:
                    hist = stock_data.history(period="1d")
                    if not hist.empty:
                        live_price = float(hist['Close'].iloc[-1])

                if not live_price:
                    print(f"[Cloud Watchdog] Could not fetch live quote for {symbol}")
                    continue

                live_price = round(float(live_price), 2)
                gain_pct = round(((live_price - entry_price) / entry_price) * 100, 2) if entry_price > 0 else 0

                print(f"[Cloud Watchdog] {symbol}: Live ₹{live_price} | Target ₹{target} | Stop ₹{stop_loss}")

                # 1. Target Reached Alert
                if live_price >= target:
                    msg = (
                        f"🎯 *TRADEMITRA: TARGET REACHED! TIME TO SELL*\n\n"
                        f"Stock: *{symbol}* ({mode_label})\n"
                        f"Action: *SELL NOW IN REAL MARKET & APP*\n\n"
                        f"Current Price: *₹{live_price}*\n"
                        f"Target Price: *₹{target}*\n"
                        f"Profit: *+{gain_pct}%*\n\n"
                        f"👉 *Open your broker app to sell now and pocket your profit!*"
                    )
                    send_telegram_alert(token, chat_id, msg)

                # 2. Safety Stop Hit Alert
                elif stop_loss > 0 and live_price <= stop_loss:
                    msg = (
                        f"🛑 *TRADEMITRA: SAFETY STOP TOUCHED*\n\n"
                        f"Stock: *{symbol}* ({mode_label})\n"
                        f"Action: *EXIT TRADE TO PROTECT CAPITAL*\n\n"
                        f"Current Price: *₹{live_price}*\n"
                        f"Stop Loss: *₹{stop_loss}*\n"
                        f"Loss Limited: *{gain_pct}%*\n\n"
                        f"👉 *Exit now in your broker app to protect your capital!*"
                    )
                    send_telegram_alert(token, chat_id, msg)

            except Exception as pos_err:
                print(f"[Cloud Watchdog] Error checking {symbol}: {pos_err}")

    except Exception as e:
        print(f"[Cloud Watchdog] Watchdog error: {e}")

def run_daily_scan():
    print("=" * 60)
    print("Market-Nirav: Commencing Daily 10-Yr Validated Swing Scan...")
    print("=" * 60)

    telegram_token = (os.environ.get("TELEGRAM_BOT_TOKEN") or "").strip() or "9096591513:AAHqSOhzaL_DbZ_O-34FQy0cUQDejSuj4xk"
    telegram_chat_id = (os.environ.get("TELEGRAM_CHAT_ID") or "").strip() or "6900686320"

    # Step 1: Run Cloud Watchdog on existing holdings
    check_open_positions_watchdog(telegram_token, telegram_chat_id)

    qualifying_setups = []

    for ticker in NIFTY_WATCHLIST:
        symbol = ticker.replace(".NS", "")
        print(f"Analyzing {symbol}...")
        try:
            # Fetch 15 years of daily data for robust verification
            df = yf.download(ticker, period="10y", interval="1d", progress=False)
            if df.empty or len(df) < 250:
                print(f"Skipping {symbol}: Insufficient historical data.")
                continue

            # Run 10-year backtest
            backtest_res = run_10yr_backtest(df)
            if not backtest_res.get('qualifies_70pct_filter', False):
                print(f"{symbol}: 10-Yr Win Rate {backtest_res.get('win_rate')}% < 70% threshold. Filtered out.")
                continue

            # Evaluate today's latest daily bar
            data_with_indicators = calculate_technical_indicators(df)
            signal = evaluate_swing_signal(data_with_indicators, current_idx=-1)

            if signal.get('qualifies', False):
                cmp = float(df['Close'].iloc[-1])
                target = signal['target_price']
                stop_loss = signal['stop_loss']
                gain_pct = round(((target - cmp) / cmp) * 100, 2)
                risk_pct = round(((cmp - stop_loss) / cmp) * 100, 2)

                print(f"⭐ QUALIFIED A+ SETUP FOUND: {symbol}")
                qualifying_setups.append({
                    'symbol': symbol,
                    'cmp': cmp,
                    'entry_min': round(cmp * 0.998, 2),
                    'entry_max': round(cmp * 1.004, 2),
                    'target': target,
                    'target_gain_pct': gain_pct,
                    'stop_loss': stop_loss,
                    'stop_loss_pct': risk_pct,
                    'win_rate': backtest_res['win_rate'],
                    'total_tested': backtest_res['total_trades'],
                    'hold_days': '2–4 Days',
                    'reason': signal['reason']
                })
        except Exception as e:
            print(f"Error processing {symbol}: {e}")

    # Dispatch alerts
    if qualifying_setups:
        for s in qualifying_setups:
            msg = (
                f"📈 *MARKET-NIRAV: HIGH-PROBABILITY SWING SETUP*\n\n"
                f"Stock: *{s['symbol']}* (NSE)\n"
                f"Action: *BUY NOW*\n"
                f"Entry Price Range: *₹{s['entry_min']} – ₹{s['entry_max']}*\n"
                f"Target Exit: *₹{s['target']}* (+{s['target_gain_pct']}% in 2–4 days)\n"
                f"Stop-Loss Safety: *₹{s['stop_loss']}* (-{s['stop_loss_pct']}%)\n\n"
                f"📊 *10-Year Backtest Proof:* *{s['win_rate']}% Win Rate* ({s['total_tested']} occurrences)\n"
                f"💡 *Setup Reason:* {s['reason']}\n\n"
                f"👉 Open Market-Nirav to record this in your paper portfolio!"
            )
            send_telegram_alert(telegram_token, telegram_chat_id, msg)
    else:
        print("No setups meeting the 70%+ 10-year threshold found today.")
        summary_msg = (
            "ℹ️ *MARKET-NIRAV: DAILY SCAN COMPLETE*\n\n"
            "Status: *NO TRADE TODAY*\n"
            "None of the Nifty 50 stocks met the strict 70%+ win-rate criteria today.\n"
            "Capital is safely preserved for the next high-probability setup."
        )
        send_telegram_alert(telegram_token, telegram_chat_id, summary_msg)

if __name__ == "__main__":
    run_daily_scan()
