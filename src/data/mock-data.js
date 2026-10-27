export const dashboard = {
  title: 'Dashboard',
  summary: 'Research overview and current paper trading snapshot.',
  cards: [
    { label: 'Paper cash', value: '₹1,00,000', trend: '+0.0%' },
    { label: 'Portfolio value', value: '₹1,08,450', trend: '+4.1%' },
    { label: 'Open positions', value: '3', trend: '2 active' },
    { label: 'Today signals', value: 'NO TRADE', trend: 'Data stale' },
  ],
  alerts: [
    'Market data freshness check is currently under review.',
    'No broker integration is active in this prototype.',
    'Paper trading mode remains simulation-only.',
  ],
};

export const watchlist = {
  title: 'Watchlist & Scanner',
  summary: 'A configurable list of equities to monitor and validate.',
  rows: [
    { symbol: 'RELIANCE', company: 'Reliance Industries', price: '₹2,861.40', status: 'Valid setup', signal: 'ENTRY_SETUP' },
    { symbol: 'TCS', company: 'Tata Consultancy Services', price: '₹3,910.10', status: 'No setup', signal: 'NO_TRADE' },
    { symbol: 'HDFCBANK', company: 'HDFC Bank', price: '₹1,739.20', status: 'Data stale', signal: 'DATA_INVALID' },
    { symbol: 'INFY', company: 'Infosys', price: '₹1,498.75', status: 'Valid setup', signal: 'HOLD' },
  ],
};

export const stockDetail = {
  title: 'Stock Detail',
  summary: 'Research report and historical validation context.',
  metrics: [
    ['Strategy', 'Daily swing breakout'],
    ['Data window', '2014-01-01 to 2025-06-30'],
    ['Data quality', 'Passed validation'],
    ['Signal status', 'NO TRADE'],
  ],
  notes: [
    'This is placeholder research output only.',
    'Data coverage and validation are not yet connected to live sources.',
  ],
};

export const signals = {
  title: 'Signal Details',
  summary: 'Decision logic and signal rationale for candidate trades.',
  items: [
    { symbol: 'SBIN', type: 'ENTRY_SETUP', risk: '₹6,250', rr: '1.8R' },
    { symbol: 'TITAN', type: 'HOLD', risk: '₹2,100', rr: '1.3R' },
    { symbol: 'ICICIBANK', type: 'EXIT_SETUP', risk: '₹4,800', rr: '2.2R' },
  ],
};

export const portfolio = {
  title: 'Paper Portfolio',
  summary: 'Simulated cash, positions, and trade journal.',
  holdings: [
    { symbol: 'INFY', qty: 82, avg: '₹1,412.60', pnl: '+₹8,240' },
    { symbol: 'RELIANCE', qty: 16, avg: '₹2,750.00', pnl: '+₹1,760' },
  ],
};

export const performance = {
  title: 'Performance & Journal',
  summary: 'Results remain illustrative until live calculations are implemented.',
  metrics: [
    ['Net return', '+3.2%'],
    ['Max drawdown', '-11.6%'],
    ['Win rate', '46%'],
    ['Profit factor', '1.31'],
  ],
};

export const settings = {
  title: 'Settings',
  summary: 'Configuration values for the personal research workflow.',
  fields: [
    'Starting paper cash: ₹1,00,000',
    'Risk budget per trade: 0.75%',
    'Max portfolio exposure: 30%',
    'Telegram notification preferences: Disabled',
    'Data refresh schedule: Daily at 09:30 IST',
  ],
};

export const mockData = {
  dashboard,
  watchlist,
  stockDetail,
  signals,
  portfolio,
  performance,
  settings,
};
