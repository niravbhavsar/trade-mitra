# Indian Stock Market Research & Paper-Trading App --- Implementation Plan

**Document purpose:** A development specification that can be given to
GitHub Copilot to build a personal-use Indian stock-market research and
paper-trading web application.

**Project owner:** Personal project\
**Primary market:** NSE-listed Indian cash equities\
**Initial trading style:** Daily-data swing trading; no intraday or
derivatives in the first release\
**Money handling:** Paper trading only --- no broker integration or
real-money order placement\
**Target operating cost:** Aim for ₹0/month using free tiers, within
provider limits\
**Frontend constraint:** Do not use React

------------------------------------------------------------------------

## 1. Product vision

Build a web application that helps a user who is not comfortable
interpreting candlestick charts to follow a transparent, repeatable
research and paper-trading process.

The app should: - Screen a configurable watchlist of NSE-listed stocks
using explicit, documented rules. - Research historical daily price data
for up to 10--15 years where a trustworthy, permitted data source
provides sufficient coverage. - Backtest candidate strategies without
look-ahead bias and with realistic costs. - Show a proposed entry price,
target, stop-loss, risk/reward, and position size only when a valid
setup exists. - Display **NO TRADE** when a setup or data quality is
insufficient. - Simulate trades with virtual money and record every
decision. - Send best-effort Telegram alerts for daily/swing-trading
conditions. - Explain results in plain language, including risks and
data limitations.

The app is a research and decision-support tool. It must not promise
returns, claim certainty, or imply that historical results guarantee
future performance.

## 2. Technology stack

Use the following stack unless a documented technical blocker is found.

### Frontend

-   HTML5
-   Vanilla JavaScript (ES modules)
-   Vite for development/build tooling
-   Tailwind CSS for styling
-   daisyUI for accessible UI components
-   TradingView Lightweight Charts for price visualizations; follow its
    license and attribution requirements
-   No React, Next.js, Vue, Angular, or other frontend framework

### Database and authentication

-   Supabase PostgreSQL
-   Supabase Auth only if needed for the personal app; otherwise keep
    access restricted and still use secure database policies
-   Row Level Security (RLS) for every table accessible through the
    browser
-   Never put a Supabase service-role key or other server secret in
    frontend code

### Research and backtesting

-   Python 3
-   pandas and NumPy
-   pytest for automated tests
-   A maintained backtesting library may be used after reviewing its
    license and behavior; alternatively implement a small transparent
    daily-bar backtester
-   Store strategy versions and run metadata so results can be
    reproduced

### Automation and alerts

-   GitHub Actions for scheduled daily research jobs within the
    account's current quotas
-   Telegram Bot API for optional notifications
-   Do not use GitHub Actions for minute-by-minute monitoring or claim
    guaranteed alert delivery

### Hosting

-   Primary: Cloudflare Pages for the static frontend
-   Alternative: Netlify
-   Supabase for hosted PostgreSQL and optional authentication
-   Keep the frontend static; do not add server functions unless needed
    and their limits are understood
-   Re-check provider free-tier terms before deployment because quotas
    and policies can change

Official references: - Cloudflare Pages: https://pages.cloudflare.com/ -
Cloudflare Pages limits:
https://developers.cloudflare.com/pages/platform/limits/ - Supabase
pricing: https://supabase.com/pricing - GitHub Actions billing:
https://docs.github.com/en/billing/concepts/product-billing/github-actions -
Telegram Bot API: https://core.telegram.org/bots/api - TradingView
Lightweight Charts: https://github.com/tradingview/lightweight-charts -
Vite guide: https://vite.dev/guide/ - Tailwind CSS:
https://tailwindcss.com/docs/installation - daisyUI:
https://daisyui.com/docs/install/

## 3. Non-negotiable requirements

1.  **No React.** Use Vite + vanilla JavaScript.
2.  **No real-money execution.** Do not connect to a broker or place
    real orders.
3.  **No fabricated data.** Never invent prices, history, financial
    metrics, or backtest results.
4.  **No forced signals.** If the rules do not qualify, display
    `NO TRADE`.
5.  **No profit promises.** Explain uncertainty and risk throughout the
    app.
6.  **Data provenance.** Record source, symbol, retrieval time, date
    range, timezone if applicable, and data-quality status.
7.  **Historical coverage is per symbol.** Do not claim 10--15 years for
    a symbol unless the retrieved data actually covers that period.
8.  **Security.** Never expose Telegram bot tokens, Supabase
    service-role keys, or other secrets in client-side code or Git
    history.
9.  **RLS.** Test that users cannot read or modify data outside their
    permitted scope.
10. **Reproducibility.** Every backtest and signal must record the
    strategy version, data window, assumptions, and run time.
11. **Conservative simulation.** If daily OHLC data indicates that
    stop-loss and target were both crossed in the same candle and the
    order is unknowable, use a documented conservative fill assumption.
12. **Costs matter.** Model configurable brokerage, exchange charges,
    taxes/levies, slippage, and gaps as realistically as the available
    information permits. Label estimates clearly and verify rates before
    use.
13. **Personal use only.** Do not market the app as regulated investment
    advice. Revisit applicable Indian legal, exchange, data-provider,
    and SEBI requirements before sharing signals or adding execution.

## 4. Scope and non-goals

### In scope for the first usable version

-   Personal watchlist
-   Daily historical data import and validation
-   Historical strategy testing
-   Simple, explainable signal rules
-   Signal history
-   Paper portfolio and trade journal
-   Telegram notifications for scheduled checks
-   Basic performance analytics
-   Export of trades and reports to CSV/JSON
-   Responsive layout for laptop and mobile browsers

### Out of scope for version 1

-   Real-money orders or broker API integration
-   Intraday, options, futures, leverage, short selling
-   Claims of guaranteed or highly accurate predictions
-   Paid data subscriptions
-   AI-generated predictions without transparent testable rules
-   Public multi-user service
-   Continuous real-time alerts
-   Automatic scraping that violates a provider's terms

## 5. Core screens

### 5.1 Dashboard

Show: - Paper cash balance and total virtual portfolio value - Open
paper positions - Today's qualifying signals and `NO TRADE` status -
Latest research run and data freshness - Realized and unrealized P&L -
Recent alerts and data-quality warnings - A visible disclaimer that
prices may be delayed or stale

### 5.2 Watchlist and scanner

Allow the user to: - Add/remove NSE symbols - See symbol, company name
when available, latest available price, price timestamp, liquidity/data
checks, and signal status - Filter by valid setup, no setup, missing
data, or failed quality checks - Open a stock detail page

Do not scan an unbounded universe in the first version. Start with a
configurable list of liquid stocks and expand only after data quality
and performance are verified.

### 5.3 Stock detail and research report

Display: - Price chart and volume where available - Available historical
date range and number of trading sessions - Missing/duplicate/invalid
row checks - Corporate-action adjustment status and data source -
Strategy rules in plain language - Backtest period, out-of-sample
period, benchmark, costs, and assumptions - CAGR, maximum drawdown, win
rate, profit factor, average win/loss, number of trades, exposure, and
volatility/risk-adjusted metrics where valid - Warnings when the sample
is too small or results are unstable - Signal status: `ENTRY SETUP`,
`HOLD`, `EXIT SETUP`, or `NO TRADE`

### 5.4 Signal details

For each signal, show: - Symbol and timestamp of the analysis - Data
timestamp and source - Proposed entry price or entry condition - Target
price - Stop-loss price - Quantity and position-sizing explanation -
Capital required - Planned rupee risk and risk/reward ratio - Strategy
name and version - Historical validation summary - Reasons the setup
passed or failed - Expiry/invalidating condition for the setup -
Explicit note that actual execution price may differ

Never display a signal as current unless the data timestamp supports
that claim.

### 5.5 Paper portfolio

Features: - Configurable starting virtual cash (default ₹1,00,000) -
Simulated buy/sell - Open positions, average entry, quantity, target,
stop-loss - Realized/unrealized P&L and total equity - Estimated
transaction costs - Trade journal and exit reason - CSV export - No real
broker credentials or live-order buttons

### 5.6 Performance and journal

Report: - Equity curve - Return and benchmark comparison - Drawdown
curve and maximum drawdown - Trade count, win rate, average win, average
loss, profit factor - Fees/slippage estimate - Results by strategy
version and market period - Notes for each simulated trade

Use appropriate labels when a metric is undefined (for example, profit
factor when there are no losing trades).

### 5.7 Settings

Allow configuration of: - Starting paper cash - Watchlist - Strategy
parameters (only supported parameters) - Risk budget per trade - Maximum
portfolio exposure - Estimated trading costs - Telegram chat ID and
notification preferences - Data refresh schedule - Export/backup actions

Secrets must be stored as GitHub Actions secrets or another server-side
secret store, not in frontend settings or committed files.

## 6. Research and signal methodology

### 6.1 Data acquisition

-   Create a data-provider adapter so providers can be changed without
    rewriting the strategy engine.
-   Prefer a documented, permitted source for historical NSE equity
    daily OHLCV data.
-   `yfinance` may be explored for personal research, but do not assume
    it is complete, real-time, licensed for every use, or available for
    every symbol. Verify data coverage, terms, ticker format,
    corporate-action behavior, and reliability before relying on it.
-   Do not scrape NSE pages or bypass access controls. Follow provider
    terms and applicable licensing.
-   Use adjusted data appropriately for splits/dividends where the
    provider supplies it. Keep raw and adjusted data semantics clear.
-   Validate timestamps, timezone, duplicates, missing sessions,
    zero/negative prices, high/low consistency, and volume.
-   Do not silently fill missing prices or fabricate candles.
-   Store a source and retrieval timestamp with each dataset.
-   If data quality fails, block backtests/signals for that dataset.

### 6.2 Strategy approach

Start with one simple, explainable daily-bar swing strategy, not a
black-box prediction model. Keep strategy logic isolated from UI code
and version it.

Copilot must propose the initial rules in a separate design note before
implementing them. Each rule must be: - Deterministic and testable -
Computable from information available at that time - Explicit about
entry, exit, stop, target, and position sizing - Evaluated after
estimated costs - Tested on a development period and a separate
out-of-sample period

Do not tune parameters repeatedly on the full 10--15-year dataset and
then present the same dataset as independent validation.

### 6.3 Backtesting safeguards

Implement: - Chronological train/test or walk-forward validation - No
look-ahead bias - No survivorship-bias claims unless delisted stocks and
universe history are handled - Next-bar execution or another clearly
documented realistic execution rule - Slippage and estimated fees -
Corporate-action handling - Conservative handling of ambiguous same-bar
stop/target events - Benchmark comparison - Minimum sample-size
warnings - Tests for boundary conditions and known example trades

Report in-sample and out-of-sample results separately. A profitable
backtest alone is not enough to justify real-money use.

### 6.4 Signal decision policy

The engine must return one of: - `ENTRY_SETUP` - `HOLD` - `EXIT_SETUP` -
`NO_TRADE` - `DATA_INVALID`

Return `NO_TRADE` if the strategy does not qualify. Return
`DATA_INVALID` if required data is stale, incomplete, inconsistent, or
unsupported.

Never create an entry/target/stop merely to populate the screen. Every
numeric signal must be derived from the versioned strategy and actual
data.

### 6.5 Position sizing

-   Make risk budget configurable, with a conservative default chosen
    for simulation.
-   Calculate quantity from planned entry-to-stop risk and available
    cash.
-   Enforce available cash, maximum position size, and maximum portfolio
    exposure.
-   Round quantities to whole shares.
-   Include estimated costs in cash and P&L.
-   Explain that stop-loss risk is planned risk, not a guaranteed
    maximum loss because of gaps and slippage.

## 7. Paper-trading rules

-   Default starting balance: ₹1,00,000 virtual cash.
-   No real money is involved.
-   Each paper trade stores entry time, entry price, quantity, stop,
    target, strategy version, and source signal.
-   Each exit stores exit time, exit price, fees estimate, P&L, and
    reason.
-   Prevent buying more shares than the available virtual cash permits.
-   Prevent duplicate execution of the same signal.
-   Keep immutable trade events or a reliable audit trail; do not
    silently rewrite past trades.
-   On app reload, portfolio state must be recovered from the database.
-   Provide a reset option with an explicit confirmation and
    preserve/export history before reset.
-   Distinguish simulated fills from market fills.
-   Use conservative assumptions for gaps and ambiguous OHLC bars.

## 8. Notifications

Use Telegram Bot API for optional alerts: - Entry setup detected -
Target touched - Stop-loss touched - Exit setup detected - Data
unavailable or research job failed

Each alert should include symbol, signal type, timestamp, price
source/timestamp, entry/target/stop if applicable, and a link to the
app.

Rules: - Store bot token in GitHub Actions secrets, never in JavaScript
or the repository. - Do not send a message if the same signal event has
already been sent; implement idempotency. - Log success/failure without
logging secrets. - Scheduled daily checks are best-effort and may run
late. Do not promise real-time delivery. - If price data is stale or the
job fails, send a data/job warning rather than a false signal. - Include
an option to disable alerts.

## 9. Suggested database schema

Use migrations checked into the repository. Add primary keys, foreign
keys, constraints, indexes, timestamps, and RLS policies.

Suggested tables:

### `user_settings`

-   `id`
-   `user_id` if authentication is enabled
-   `starting_cash`
-   `risk_per_trade_pct`
-   `max_portfolio_exposure_pct`
-   `estimated_cost_config` (structured JSON or normalized fields)
-   `created_at`
-   `updated_at`

### `watchlist`

-   `id`
-   `user_id`
-   `symbol`
-   `exchange`
-   `active`
-   `created_at`

Unique constraint: user + exchange + symbol.

### `data_import_runs`

-   `id`
-   `provider`
-   `symbol`
-   `started_at`
-   `completed_at`
-   `first_date`
-   `last_date`
-   `row_count`
-   `status`
-   `quality_report`
-   `error_summary`

### `research_runs`

-   `id`
-   `symbol`
-   `strategy_id`
-   `strategy_version`
-   `data_provider`
-   `data_start`
-   `data_end`
-   `run_at`
-   `is_out_of_sample`
-   `metrics`
-   `assumptions`
-   `status`

### `trade_signals`

-   `id`
-   `symbol`
-   `signal_type`
-   `generated_at`
-   `data_timestamp`
-   `strategy_id`
-   `strategy_version`
-   `entry_price`
-   `target_price`
-   `stop_loss`
-   `quantity`
-   `planned_risk`
-   `risk_reward`
-   `reason`
-   `status`
-   `research_run_id`

### `paper_trades`

-   `id`
-   `symbol`
-   `status`
-   `entry_time`
-   `entry_price`
-   `quantity`
-   `target_price`
-   `stop_loss`
-   `exit_time`
-   `exit_price`
-   `estimated_fees`
-   `realized_pnl`
-   `exit_reason`
-   `strategy_id`
-   `strategy_version`
-   `signal_id`
-   `created_at`

### `paper_portfolio_events`

-   `id`
-   `event_type`
-   `symbol`
-   `event_time`
-   `quantity`
-   `price`
-   `cash_delta`
-   `fees`
-   `paper_trade_id`
-   `metadata`

### `alert_events`

-   `id`
-   `deduplication_key`
-   `symbol`
-   `alert_type`
-   `event_time`
-   `payload`
-   `delivery_status`
-   `delivered_at`
-   `error_summary`

### `daily_portfolio_snapshots`

-   `id`
-   `snapshot_date`
-   `cash_balance`
-   `market_value`
-   `equity`
-   `realized_pnl`
-   `unrealized_pnl`
-   `estimated_costs`

### `price_history` (optional)

Only store data if provider terms permit storage and reuse. Consider
local/cache storage or storing derived results if redistribution/storage
is restricted. Include symbol, date, OHLCV fields, provider, and
adjustment status.

Do not expose `paper_portfolio_events`, settings, or other private user
data to unauthorized users. Enforce ownership and RLS in the database;
frontend filtering is not security.

## 10. Proposed repository structure

``` text
indian-market-paper-trader/
├── README.md
├── IMPLEMENTATION_PLAN.md
├── .gitignore
├── .env.example
├── package.json
├── vite.config.js
├── index.html
├── src/
│   ├── main.js
│   ├── router.js
│   ├── styles/
│   │   └── main.css
│   ├── components/
│   ├── pages/
│   │   ├── dashboard.js
│   │   ├── watchlist.js
│   │   ├── stock-detail.js
│   │   ├── signals.js
│   │   ├── paper-portfolio.js
│   │   ├── performance.js
│   │   └── settings.js
│   ├── services/
│   │   ├── supabase-client.js
│   │   ├── market-data-api.js
│   │   ├── signals-api.js
│   │   └── paper-trading-api.js
│   ├── charts/
│   └── utils/
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── research/
│   ├── requirements.txt
│   ├── README.md
│   ├── config/
│   ├── src/
│   │   ├── providers/
│   │   ├── data_validation/
│   │   ├── strategies/
│   │   ├── backtesting/
│   │   ├── signals/
│   │   ├── portfolio/
│   │   ├── notifications/
│   │   └── jobs/
│   └── tests/
├── tests/
│   ├── unit/
│   └── integration/
└── .github/
    └── workflows/
        └── daily-research.yml
```

Adjust the structure as the implementation evolves, but keep
market-data, strategy, backtesting, persistence, and UI responsibilities
separate.

## 11. Security and configuration

Create `.env.example` containing placeholder names only, for example: -
`VITE_SUPABASE_URL=` - `VITE_SUPABASE_ANON_KEY=`

Only public/publishable client credentials may use a `VITE_` prefix.
Never put server-only secrets under `VITE_` because Vite exposes those
values to browser code.

GitHub Actions secrets may include: - `SUPABASE_URL` -
`SUPABASE_SERVICE_ROLE_KEY` (server-side workflow only, with strict
access controls) - `TELEGRAM_BOT_TOKEN` - `TELEGRAM_CHAT_ID`

Additional rules: - `.env`, downloaded datasets, local databases,
tokens, and secrets must be ignored by Git where appropriate. - Use the
least-privileged credentials available. - Do not print secrets in
logs. - Use HTTPS. - Validate all external data before storing it. -
Keep database migrations and RLS tests under version control. - Export
important records periodically; the free database tier is not a
substitute for independent backups.

## 12. Development phases and acceptance criteria

### Phase 0 --- Repository and design

Tasks: - Create Vite project using vanilla JavaScript. - Add Tailwind
CSS and daisyUI. - Set up linting/formatting and tests. - Create README
and `.env.example`. - Create responsive navigation and placeholder
pages.

Acceptance: - `npm install` and `npm run dev` work. - `npm run build`
succeeds. - No React dependencies. - No secrets committed.

### Phase 1 --- UI with mock data

Tasks: - Build dashboard, watchlist, stock detail, signals, paper
portfolio, performance, and settings screens. - Clearly label mock
data. - Add loading, empty, error, stale-data, and `NO TRADE` states. -
Add accessible labels and responsive layout.

Acceptance: - Screens work on laptop and mobile widths. - Mock values
are never represented as live market data. - Main navigation and
empty/error states work.

### Phase 2 --- Supabase and schema

Tasks: - Create migrations for required tables. - Configure RLS and
ownership rules. - Add client initialization using public credentials. -
Add integration tests for unauthorized access. - Add export/backup path.

Acceptance: - CRUD works only for authorized records. - RLS tests
demonstrate cross-user isolation if auth is enabled. - Service-role key
is never exposed to the browser.

### Phase 3 --- Data provider and validation

Tasks: - Implement provider adapter. - Import historical daily data for
a small test watchlist. - Record coverage and retrieval metadata. - Add
data-quality checks and clear provider errors. - Verify terms and
corporate-action behavior.

Acceptance: - Each symbol shows its real available date range. - Missing
or bad data blocks signals. - No fake data is inserted to fill gaps. -
Provider limitations are visible.

### Phase 4 --- Strategy specification and backtester

Tasks: - Write the initial strategy specification before
implementation. - Add deterministic strategy logic and versioning. - Add
chronological out-of-sample or walk-forward testing. - Include costs,
slippage, and conservative fill assumptions. - Compare against an
appropriate benchmark. - Generate a report with metrics and warnings.

Acceptance: - Unit tests cover entries, exits, gaps, ambiguous bars,
costs, and position sizing. - Results are reproducible from stored
inputs and strategy version. - In-sample and out-of-sample results are
clearly separated. - Backtests cannot use future data to generate
current signals.

### Phase 5 --- Signal generation

Tasks: - Generate signals from validated data only. - Save signal
rationale and source timestamps. - Implement `ENTRY_SETUP`, `HOLD`,
`EXIT_SETUP`, `NO_TRADE`, and `DATA_INVALID`. - Show entry, target,
stop, position size, planned risk, and risk/reward for valid setups.

Acceptance: - A missing/stale-data test returns `DATA_INVALID`. - A
non-qualifying setup returns `NO_TRADE`. - Every numeric signal can be
traced to actual input data and a strategy version.

### Phase 6 --- Paper portfolio

Tasks: - Implement virtual cash, simulated buys/sells, positions, P&L,
estimated costs, and trade journal. - Prevent duplicate signal execution
and overspending. - Add audit events and CSV export. - Handle targets,
stops, gaps, and ambiguous daily bars conservatively.

Acceptance: - Paper cash and holdings reconcile after each
transaction. - Refreshing the browser does not lose portfolio state. -
All simulated trades are marked as simulated. - No broker API or
real-money order endpoint exists.

### Phase 7 --- Telegram and scheduled jobs

Tasks: - Create a scheduled GitHub Actions workflow for daily
research. - Use server-side secrets. - Add alert deduplication, failure
reporting, and logs. - Add a manual workflow trigger for testing.

Acceptance: - Test alerts arrive without exposing the bot token. -
Re-running a job does not send duplicate alerts for the same event. -
Failed/stale-data runs do not generate misleading signals. -
Documentation states the schedule is best-effort, not real-time.

### Phase 8 --- Deploy and paper-trade evaluation

Tasks: - Deploy static frontend to Cloudflare Pages; document Netlify as
an alternative. - Configure Supabase and secrets securely. - Test
production build, database policies, scheduled job, and alerts. - Run
paper trading for at least 2--3 months. - Review performance, drawdown,
trade count, costs, data gaps, and operational failures.

Acceptance: - Deployment and recovery steps are documented. - A local
export/backup can be restored or inspected. - Paper-trading report
includes losing periods and all costs assumptions. - No real-money
trading is enabled.

## 13. Testing checklist

### Unit tests

-   Price data validation
-   Indicator/feature calculations
-   Signal rules
-   Entry/exit rules
-   Position sizing and cash constraints
-   Fee and slippage calculations
-   Target/stop collision
-   Gap-through-stop handling
-   Duplicate alert prevention
-   P&L and portfolio reconciliation

### Integration tests

-   Supabase read/write permissions
-   RLS ownership
-   Research job to database
-   Signal to paper trade
-   Alert generation and delivery
-   Data-provider failure handling

### End-to-end tests

-   Add symbol to watchlist
-   Run/import research data
-   View a research report
-   Generate `NO TRADE` or valid signal
-   Simulate a trade
-   Verify balance and P&L
-   Export trade history
-   Confirm Telegram notification

## 14. Risk and evaluation policy

Paper trade for at least 2--3 months after historical testing. Review: -
Out-of-sample results, not only full-history results - Number of trades
and whether the sample is meaningful - Maximum drawdown and length of
recovery - Performance after estimated transaction costs - Results
versus a suitable index - Behavior during rising, falling, and sideways
markets - Difference between assumed and available execution prices -
Data gaps and alert/job failures

A short profitable paper-trading period does not prove a strategy will
remain profitable. Do not automatically switch to real money after a
fixed date. Any future decision to use real funds should be independent
of the app's signals and based on risk tolerance and further validation.

## 15. Instructions for GitHub Copilot

Use this file as the source of truth. Work incrementally and do not
attempt to generate the entire application in one response.

For each phase: 1. Inspect the existing repository before changing
files. 2. Summarize the proposed changes. 3. Implement only the current
phase. 4. List every file created or modified. 5. Provide exact commands
to install, run, test, and build. 6. Run available tests and fix
failures before moving on. 7. Do not silently skip security,
data-quality, or backtesting requirements. 8. If a requirement is
ambiguous, explain the options and choose the safest simple default;
document the decision. 9. Never invent API credentials, data, prices,
historical metrics, or successful deployment results. 10. Keep code
readable and modular, with comments for financial calculations and
assumptions. 11. Avoid paid services and new dependencies unless there
is a clear reason; check licenses and current plan limits. 12. Do not
proceed to the next phase until the current phase's acceptance criteria
are met.

**First Copilot task:** Implement Phase 0 only. Create the Vite +
vanilla JavaScript project, configure Tailwind CSS and daisyUI using
their current official installation instructions, create the repository
structure, and produce a responsive placeholder UI. Do not integrate
market data, database credentials, Telegram, or trading logic in Phase
0.

------------------------------------------------------------------------

## 16. Final reminder

This is a personal research and paper-trading application, not a profit
guarantee or a substitute for independent financial judgment. All
signals must be explainable, timestamped, reproducible, and derived from
validated data. If the data or setup is inadequate, the correct output
is `NO TRADE` or `DATA_INVALID`.
