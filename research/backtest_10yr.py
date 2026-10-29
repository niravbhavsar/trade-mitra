"""
10–15 Year Historical Backtest Validator for NSE Equities
Walks forward bar by bar without look-ahead bias and models realistic trading costs.
"""
import sys
import os
import pandas as pd
import numpy as np

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPT_DIR not in sys.path:
    sys.path.insert(0, SCRIPT_DIR)

from strategy_rules import calculate_technical_indicators, evaluate_swing_signal

def run_10yr_backtest(df: pd.DataFrame, initial_capital: float = 100000.0, risk_pct: float = 1.5):
    """
    Executes a chronological walk-forward simulation across historical daily bars.
    """
    if hasattr(df, 'columns') and isinstance(df.columns, pd.MultiIndex):
        try:
            df.columns = df.columns.droplevel(1)
        except Exception:
            df.columns = [col[0] if isinstance(col, tuple) else col for col in df.columns]

    data = calculate_technical_indicators(df)
    trades = []
    capital = initial_capital

    in_trade = False
    entry_price = 0.0
    target_price = 0.0
    stop_loss = 0.0
    entry_idx = 0
    qty = 0

    # Start after 200 bars to ensure valid EMA200
    for i in range(200, len(data) - 1):
        current_bar = data.iloc[i]
        next_bar = data.iloc[i + 1]

        if not in_trade:
            signal = evaluate_swing_signal(data.iloc[:i+1], current_idx=-1)
            if signal['qualifies']:
                # Buy on open of next bar (realistic execution)
                entry_price = float(next_bar['Open'])
                stop_loss = signal['stop_loss']
                target_price = signal['target_price']
                entry_idx = i + 1

                # Position sizing based on risk budget
                risk_amount = capital * (risk_pct / 100.0)
                per_share_risk = max(1.0, entry_price - stop_loss)
                qty = max(1, int(risk_amount / per_share_risk))
                in_trade = True
        else:
            # Check exit conditions on next bar
            bars_held = (i + 1) - entry_idx
            high = float(next_bar['High'])
            low = float(next_bar['Low'])
            close = float(next_bar['Close'])

            exit_triggered = False
            exit_price = 0.0
            exit_reason = ""

            # Conservative check: if both target and stop hit in same candle, assume stop hit
            if low <= stop_loss and high >= target_price:
                exit_triggered = True
                exit_price = stop_loss
                exit_reason = "Stop Loss (Collision assumption)"
            elif low <= stop_loss:
                exit_triggered = True
                exit_price = stop_loss
                exit_reason = "Stop Loss Hit"
            elif high >= target_price:
                exit_triggered = True
                exit_price = target_price
                exit_reason = "Target Hit"
            elif bars_held >= 5:  # Time-based stop (5 days max)
                exit_triggered = True
                exit_price = close
                exit_reason = "Time Exit (5 Days Max)"

            if exit_triggered:
                # Deduct realistic Indian statutory costs (STT, GST, brokerage ~0.2%)
                gross_pnl = (exit_price - entry_price) * qty
                estimated_costs = (entry_price * qty * 0.001) + (exit_price * qty * 0.001) + 40.0 # ₹40 roundtrip brokerage
                net_pnl = gross_pnl - estimated_costs
                capital += net_pnl

                trades.append({
                    'entry_date': str(data.index[entry_idx]),
                    'exit_date': str(data.index[i + 1]),
                    'entry_price': entry_price,
                    'exit_price': exit_price,
                    'qty': qty,
                    'bars_held': bars_held,
                    'net_pnl': net_pnl,
                    'pnl_pct': ((exit_price - entry_price) / entry_price) * 100.0,
                    'reason': exit_reason
                })
                in_trade = False

    # Aggregate performance metrics
    total_trades = len(trades)
    if total_trades == 0:
        return {'total_trades': 0, 'win_rate': 0.0, 'status': 'INSUFFICIENT_SAMPLE'}

    winning_trades = [t for t in trades if t['net_pnl'] > 0]
    losing_trades = [t for t in trades if t['net_pnl'] <= 0]

    win_rate = (len(winning_trades) / total_trades) * 100.0
    avg_gain = np.mean([t['pnl_pct'] for t in winning_trades]) if winning_trades else 0.0
    avg_loss = np.mean([t['pnl_pct'] for t in losing_trades]) if losing_trades else 0.0
    total_return = ((capital - initial_capital) / initial_capital) * 100.0

    return {
        'total_trades': total_trades,
        'win_rate': round(win_rate, 1),
        'winning_count': len(winning_trades),
        'losing_count': len(losing_trades),
        'avg_gain_pct': round(avg_gain, 2),
        'avg_loss_pct': round(avg_loss, 2),
        'final_capital': round(capital, 2),
        'total_return_pct': round(total_return, 1),
        'qualifies_70pct_filter': win_rate >= 70.0
    }

if __name__ == "__main__":
    print("10-Year Backtest Engine Loaded Successfully.")
