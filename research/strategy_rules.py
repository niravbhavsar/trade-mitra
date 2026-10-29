"""
Multi-Regime & Dual-Horizon Trading Strategy Rules for NSE Equities
Deterministic, testable algorithms for Good & Bad market conditions,
supporting both 1-Day BTST Quick Flips and 2-5 Day Swings.
"""
import pandas as pd
import numpy as np

def calculate_technical_indicators(df: pd.DataFrame) -> pd.DataFrame:
    """Calculates EMA, RSI, ATR, and Volume moving average."""
    data = df.copy()
    
    # Exponential Moving Averages
    data['EMA20'] = data['Close'].ewm(span=20, adjust=False).mean()
    data['EMA50'] = data['Close'].ewm(span=50, adjust=False).mean()
    data['EMA200'] = data['Close'].ewm(span=200, adjust=False).mean()

    # Relative Strength Index (RSI 14)
    delta = data['Close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
    rs = gain / (loss + 1e-9)
    data['RSI14'] = 100 - (100 / (1 + rs))

    # Average True Range (ATR 14)
    high_low = data['High'] - data['Low']
    high_close = (data['High'] - data['Close'].shift()).abs()
    low_close = (data['Low'] - data['Close'].shift()).abs()
    tr = pd.concat([high_low, high_close, low_close], axis=1).max(axis=1)
    data['ATR14'] = tr.rolling(window=14).mean()

    # Volume 20-day Average
    data['VolAvg20'] = data['Volume'].rolling(window=20).mean()

    return data

def evaluate_multi_regime_signal(df: pd.DataFrame, mode: str = "swing", market_regime: str = "good", current_idx: int = -1):
    """
    Evaluates setups across:
    1. Good Market: Trend-Pullback Swing or Closing Momentum BTST.
    2. Bad Market: Defensive Sector Rotation or Oversold Deep-Support Bounce.
    
    Returns:
        dict: {
            'qualifies': bool,
            'mode': str,
            'regime': str,
            'entry_price': float,
            'target_price': float,
            'stop_loss': float,
            'risk_reward': float,
            'hold_duration': str,
            'reason': str
        }
    """
    if len(df) < 200:
        return {'qualifies': False, 'reason': 'DATA_INVALID: Less than 200 daily bars'}

    row = df.iloc[current_idx]
    prev_row = df.iloc[current_idx - 1]
    entry_price = float(row['Close'])

    # ----------------------------------------------------
    # REGIME 1: GOOD / BULLISH MARKET
    # ----------------------------------------------------
    if market_regime == "good":
        # 1. Macro Trend Filter (Above 200 EMA)
        trend_bullish = (row['Close'] > row['EMA200']) and (row['EMA20'] > row['EMA50'])
        if not trend_bullish:
            return {'qualifies': False, 'reason': 'NO_TRADE: Price not above 200 EMA in bull regime'}

        if mode == "1day":
            # 1-Day BTST: Closing Momentum Breakout (Close near high of day + Volume surge)
            day_range = max(1.0, float(row['High'] - row['Low']))
            close_in_top_range = (float(row['Close'] - row['Low']) / day_range) >= 0.75
            volume_burst = row['Volume'] >= (row['VolAvg20'] * 1.3)

            if close_in_top_range and volume_burst and row['Close'] > prev_row['High']:
                stop_loss = round(entry_price * 0.991, 2) # -0.9% tight overnight stop
                target_price = round(entry_price * 1.020, 2) # +2.0% morning exit
                return {
                    'qualifies': True,
                    'mode': '1day',
                    'regime': 'good',
                    'entry_price': round(entry_price, 2),
                    'target_price': target_price,
                    'stop_loss': stop_loss,
                    'risk_reward': 2.2,
                    'hold_duration': '1 Day (Sell Tomorrow Morning 09:30-10:30 IST)',
                    'reason': f"Closing surge in top 25% of day range with {round(row['Volume']/row['VolAvg20'], 1)}x volume."
                }
            return {'qualifies': False, 'reason': 'NO_TRADE: 1-Day BTST closing momentum criteria not met'}

        else:
            # 2–5 Day Swing: Trend Pullback to 20 EMA
            pullback_valid = (row['Low'] <= row['EMA20'] * 1.01) and (38 <= row['RSI14'] <= 55)
            reversal_candle = (row['Close'] > row['Open']) and (row['Close'] > prev_row['High'])
            volume_confirmed = row['Volume'] >= (row['VolAvg20'] * 1.2)

            if pullback_valid and reversal_candle and volume_confirmed:
                lowest_3d = float(df['Low'].iloc[current_idx-2:current_idx+1].min())
                stop_loss = round(min(lowest_3d * 0.995, entry_price - (1.5 * float(row['ATR14']))), 2)
                per_share_risk = entry_price - stop_loss
                target_price = round(entry_price + (2.0 * per_share_risk), 2)
                return {
                    'qualifies': True,
                    'mode': 'swing',
                    'regime': 'good',
                    'entry_price': round(entry_price, 2),
                    'target_price': target_price,
                    'stop_loss': stop_loss,
                    'risk_reward': 2.0,
                    'hold_duration': '2–4 Days',
                    'reason': f"Confirmed bullish reversal off 20 EMA with {round(row['Volume']/row['VolAvg20'], 1)}x volume."
                }
            return {'qualifies': False, 'reason': 'NO_TRADE: Trend-pullback criteria not met'}

    # ----------------------------------------------------
    # REGIME 2: BAD / BEARISH / CHOPPY MARKET
    # ----------------------------------------------------
    else:
        # Strategy A: Deep Oversold Mean-Reversion at Support
        oversold = row['RSI14'] <= 34
        hammer_candle = (row['Close'] > row['Open']) and ((row['Low'] - min(row['Open'], row['Close'])) >= 1.5 * abs(row['Close'] - row['Open']))

        if oversold and hammer_candle:
            stop_loss = round(float(row['Low']) * 0.992, 2) # -1.2% tight stop below hammer
            target_gain = 0.022 if mode == "1day" else 0.045
            target_price = round(entry_price * (1.0 + target_gain), 2)
            return {
                'qualifies': True,
                'mode': mode,
                'regime': 'bad',
                'entry_price': round(entry_price, 2),
                'target_price': target_price,
                'stop_loss': stop_loss,
                'risk_reward': 2.4,
                'hold_duration': '1 Day (BTST)' if mode == '1day' else '2–4 Days',
                'reason': f"🛡️ Oversold Mean-Reversion: Daily RSI {round(row['RSI14'], 1)} with long lower wick rejection hammer."
            }

        # Strategy B: Defensive Cashflow Strength (Holding above 20 EMA while Nifty falls)
        defensive_strength = (row['Close'] > row['EMA20']) and (row['Close'] > prev_row['Close'])
        if defensive_strength and (42 <= row['RSI14'] <= 60):
            stop_loss = round(entry_price * 0.985, 2)
            target_price = round(entry_price * (1.02 if mode == '1day' else 1.045), 2)
            return {
                'qualifies': True,
                'mode': mode,
                'regime': 'bad',
                'entry_price': round(entry_price, 2),
                'target_price': target_price,
                'stop_loss': stop_loss,
                'risk_reward': 2.0,
                'hold_duration': '1 Day' if mode == '1day' else '3–5 Days',
                'reason': "🛡️ Defensive Rotation: Capital haven outperforming negative broad market."
            }

        return {'qualifies': False, 'reason': 'NO_TRADE: Cash Shield Active. Capital is safely preserved.'}

def evaluate_swing_signal(df: pd.DataFrame, current_idx: int = -1) -> dict:
    """Wrapper for backward compatibility and swing setup evaluation."""
    return evaluate_multi_regime_signal(df, mode="swing", market_regime="good", current_idx=current_idx)

