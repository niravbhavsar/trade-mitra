import './styles.css';
import { mockData } from './data/mock-data.js';

const routes = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'watchlist', label: 'Watchlist' },
  { id: 'stock-detail', label: 'Stock Detail' },
  { id: 'signals', label: 'Signals' },
  { id: 'portfolio', label: 'Paper Portfolio' },
  { id: 'performance', label: 'Performance' },
  { id: 'settings', label: 'Settings' },
];

const routeMap = {
  dashboard: mockData.dashboard,
  watchlist: mockData.watchlist,
  'stock-detail': mockData.stockDetail,
  signals: mockData.signals,
  portfolio: mockData.portfolio,
  performance: mockData.performance,
  settings: mockData.settings,
};

function renderDashboardCard(card) {
  return `
    <div class="stat-card">
      <div class="stat-label">${card.label}</div>
      <div class="stat-value">${card.value}</div>
      <div class="stat-trend">${card.trend}</div>
    </div>
  `;
}

function renderDashboardSidebar(data) {
  return `
    <aside class="dashboard-sidebar">
      <div class="sidebar-block">
        <p class="eyebrow">Market research</p>
        <h1 class="page-title">Dashboard</h1>
      </div>

      <div class="stat-list">
        <div class="stat-row">
          <span class="meta-label">Paper cash</span>
          <div class="meta-value">₹1,00,000</div>
          <div class="meta-trend">+0.0%</div>
        </div>
        <div class="stat-row">
          <span class="meta-label">Portfolio value</span>
          <div class="meta-value">₹1,08,450</div>
          <div class="meta-trend">+4.1%</div>
        </div>
        <div class="stat-row">
          <span class="meta-label">Open positions</span>
          <div class="meta-value">3</div>
          <div class="meta-trend">2 active</div>
        </div>
        <div class="stat-row">
          <span class="meta-label">Today signals</span>
          <div class="meta-value">NO TRADE</div>
          <div class="meta-trend">Data stale</div>
        </div>
      </div>

      <div class="sidebar-section">
        <h3>Latest research snapshot</h3>
        <p>${data.summary}</p>
        <div class="summary-list">
          <div class="summary-row"><span>Research run</span><strong>Daily swing scan</strong></div>
          <div class="summary-row"><span>Last refresh</span><strong>18:30 IST</strong></div>
          <div class="summary-row"><span>Data quality</span><strong class="warn">Needs review</strong></div>
        </div>
      </div>

      <div class="sidebar-section">
        <h3>Important notes</h3>
        <ul>
          ${data.alerts.map((alert) => `<li>${alert}</li>`).join('')}
        </ul>
      </div>

      <div class="sidebar-section console-section">
        <h3>Research Console</h3>
        <p class="console-subtitle">Personal research &amp; paper trading</p>
        <nav class="console-nav">
          ${routes
            .map(
              (route) => `
                <a href="#${route.id}" class="console-link ${route.id === 'dashboard' ? 'active' : ''}">${route.label}</a>
              `,
            )
            .join('')}
        </nav>
      </div>
    </aside>
  `;
}

function renderPage(routeId) {
  const data = routeMap[routeId] || mockData.dashboard;

  if (routeId === 'dashboard') {
    return `
      <section class="dashboard-layout">
        <div class="dashboard-panel">
          <div class="dashboard-hero" aria-hidden="true"></div>
          <div class="workspace-grid">
            ${renderDashboardSidebar(data)}
            <div class="dashboard-main">
              <div class="empty-space"></div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  if (routeId === 'watchlist') {
    return `
      <section class="space-y-6">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-primary">Scanner</p>
          <h1 class="text-3xl font-bold">${data.title}</h1>
        </div>

        <div class="overflow-x-auto rounded-box border border-base-200 bg-base-100 shadow-soft">
          <table class="table table-zebra">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Company</th>
                <th>Price</th>
                <th>Status</th>
                <th>Signal</th>
              </tr>
            </thead>
            <tbody>
              ${data.rows
                .map(
                  (row) => `
                    <tr>
                      <td class="font-semibold">${row.symbol}</td>
                      <td>${row.company}</td>
                      <td>${row.price}</td>
                      <td>${row.status}</td>
                      <td><span class="badge ${row.signal === 'NO_TRADE' ? 'badge-neutral' : 'badge-success'}">${row.signal}</span></td>
                    </tr>
                  `,
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </section>
    `;
  }

  if (routeId === 'stock-detail') {
    return `
      <section class="space-y-6">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-primary">Research report</p>
          <h1 class="text-3xl font-bold">${data.title}</h1>
        </div>

        <div class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div class="card bg-base-100 shadow-soft border border-base-200">
            <div class="card-body">
              <div class="flex items-center justify-between">
                <h2 class="card-title">RELIANCE</h2>
                <span class="badge badge-info">Daily chart</span>
              </div>
              <div class="mt-6 h-60 rounded-xl bg-gradient-to-br from-primary/10 via-base-200 to-base-100 p-4">
                <div class="flex h-full items-end gap-2">
                  ${[18, 44, 55, 42, 63, 74, 88, 62, 82, 90, 70, 86]
                    .map((height) => `<div class="flex-1 rounded-t-xl bg-gradient-to-t from-primary to-secondary" style="height: ${height}%"></div>`)
                    .join('')}
                </div>
              </div>
            </div>
          </div>

          <div class="card bg-base-100 shadow-soft border border-base-200">
            <div class="card-body">
              <h2 class="card-title">Research summary</h2>
              <div class="mt-4 space-y-3">
                ${data.metrics
                  .map(
                    ([label, value]) => `
                      <div class="flex items-center justify-between border-b border-base-200 pb-2">
                        <span class="text-base-content/70">${label}</span>
                        <span class="font-semibold">${value}</span>
                      </div>
                    `,
                  )
                  .join('')}
              </div>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-soft border border-base-200">
          <div class="card-body">
            <h2 class="card-title">Notes</h2>
            <ul class="mt-3 space-y-2">
              ${data.notes.map((note) => `<li>• ${note}</li>`).join('')}
            </ul>
          </div>
        </div>
      </section>
    `;
  }

  if (routeId === 'signals') {
    return `
      <section class="space-y-6">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-primary">Decision engine</p>
          <h1 class="text-3xl font-bold">${data.title}</h1>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          ${data.items
            .map(
              (item) => `
                <div class="card bg-base-100 shadow-soft border border-base-200">
                  <div class="card-body">
                    <div class="flex items-center justify-between">
                      <h2 class="card-title">${item.symbol}</h2>
                      <span class="badge ${item.type === 'NO_TRADE' ? 'badge-neutral' : 'badge-success'}">${item.type}</span>
                    </div>
                    <div class="mt-4 space-y-2 text-sm">
                      <p>Planned risk: ${item.risk}</p>
                      <p>Risk/reward: ${item.rr}</p>
                      <p>Entry condition: Daily breakout confirmation</p>
                    </div>
                  </div>
                </div>
              `,
            )
            .join('')}
        </div>
      </section>
    `;
  }

  if (routeId === 'portfolio') {
    return `
      <section class="space-y-6">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-primary">Simulation</p>
          <h1 class="text-3xl font-bold">${data.title}</h1>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          ${data.holdings
            .map(
              (holding) => `
                <div class="card bg-base-100 shadow-soft border border-base-200">
                  <div class="card-body">
                    <div class="flex items-center justify-between">
                      <h2 class="card-title">${holding.symbol}</h2>
                      <span class="badge badge-accent">Open</span>
                    </div>
                    <div class="mt-4 space-y-2 text-sm">
                      <p>Quantity: ${holding.qty}</p>
                      <p>Average cost: ${holding.avg}</p>
                      <p>P&L: ${holding.pnl}</p>
                    </div>
                  </div>
                </div>
              `,
            )
            .join('')}
        </div>
      </section>
    `;
  }

  if (routeId === 'performance') {
    return `
      <section class="space-y-6">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-primary">Results</p>
          <h1 class="text-3xl font-bold">${data.title}</h1>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          ${data.metrics
            .map(
              ([label, value]) => `
                <div class="card bg-base-100 shadow-soft border border-base-200">
                  <div class="card-body">
                    <div class="text-xs uppercase tracking-[0.2em] text-base-content/60">${label}</div>
                    <div class="mt-3 text-2xl font-bold">${value}</div>
                  </div>
                </div>
              `,
            )
            .join('')}
        </div>
      </section>
    `;
  }

  return `
    <section class="space-y-6">
      <div>
        <p class="text-xs uppercase tracking-[0.3em] text-primary">Preferences</p>
        <h1 class="text-3xl font-bold">${data.title}</h1>
      </div>

      <div class="card bg-base-100 shadow-soft border border-base-200">
        <div class="card-body">
          <ul class="space-y-3">
            ${data.fields.map((field) => `<li class="flex items-center gap-3"><span class="h-2 w-2 rounded-full bg-primary"></span><span>${field}</span></li>`).join('')}
          </ul>
        </div>
      </div>
    </section>
  `;
}

function renderApp() {
  const routeId = window.location.hash.replace('#', '') || 'dashboard';
  const currentRoute = routes.find((route) => route.id === routeId) || routes[0];
  const entry = document.querySelector('#app');

  entry.innerHTML = `
    <div class="app-shell">
      <div class="browser-frame">
        <header class="browser-bar">
          <div class="browser-actions">
            <span class="browser-dot"></span>
            <span class="browser-dot"></span>
            <span class="browser-dot"></span>
          </div>
          <div class="browser-address">
            <span class="address-lock">◌</span>
            <span>market-nirav.niravbhavsar.workers.dev</span>
          </div>
          <div class="browser-tools">
            <span>☆</span>
            <span>⎇</span>
            <span>⋮</span>
          </div>
        </header>

        <div class="app-content">
          <div class="main-shell">
            ${renderPage(currentRoute.id)}
          </div>
        </div>
      </div>
    </div>
  `;

  document.querySelectorAll('.console-link').forEach((link) => {
    link.addEventListener('click', () => {
      const drawer = document.querySelector('#app-drawer');
      if (drawer && drawer.checked) {
        drawer.checked = false;
      }
    });
  });
}

window.addEventListener('hashchange', renderApp);
renderApp();
