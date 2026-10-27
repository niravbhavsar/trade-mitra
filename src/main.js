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
    <div class="stat bg-base-100 rounded-box shadow-soft border border-base-200">
      <div class="stat-title text-xs uppercase tracking-[0.25em] text-base-content/60">${card.label}</div>
      <div class="stat-value text-2xl md:text-3xl">${card.value}</div>
      <div class="stat-desc text-success">${card.trend}</div>
    </div>
  `;
}

function renderPage(routeId) {
  const data = routeMap[routeId] || mockData.dashboard;

  if (routeId === 'dashboard') {
    return `
      <section class="space-y-6 dashboard-layout">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-xs uppercase tracking-[0.3em] text-primary">Market research</p>
            <h1 class="text-3xl font-bold">${data.title}</h1>
          </div>
          <div class="badge badge-warning gap-2">
            <span class="h-2 w-2 rounded-full bg-warning-content"></span>
            Paper-trading mode
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          ${data.cards.map(renderDashboardCard).join('')}
        </div>

        <div class="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div class="card bg-base-100 shadow-soft border border-base-200">
            <div class="card-body">
              <h2 class="card-title">Latest research snapshot</h2>
              <p class="text-base-content/70">${data.summary}</p>
              <div class="mt-4 space-y-3">
                <div class="flex items-center justify-between rounded-xl bg-base-200 px-4 py-3">
                  <span>Research run</span>
                  <span class="font-semibold">Daily swing scan</span>
                </div>
                <div class="flex items-center justify-between rounded-xl bg-base-200 px-4 py-3">
                  <span>Last refresh</span>
                  <span class="font-semibold">18:30 IST</span>
                </div>
                <div class="flex items-center justify-between rounded-xl bg-base-200 px-4 py-3">
                  <span>Data quality</span>
                  <span class="font-semibold text-warning">Needs review</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card bg-base-100 shadow-soft border border-base-200">
            <div class="card-body">
              <h2 class="card-title">Important notes</h2>
              <ul class="space-y-3 text-sm">
                ${data.alerts.map((alert) => `<li class="flex gap-3"><span class="mt-1 h-2 w-2 rounded-full bg-primary"></span><span>${alert}</span></li>`).join('')}
              </ul>
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
    <div class="drawer lg:drawer-open app-shell">
      <input id="app-drawer" type="checkbox" class="drawer-toggle" />
      <div class="drawer-content flex min-h-screen flex-col bg-base-200/60">
        <header class="navbar border-b border-base-300 bg-base-100/90 backdrop-blur">
          <div class="flex-none lg:hidden">
            <label for="app-drawer" class="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </label>
          </div>
          <div class="flex-1 px-2">
            <a href="#dashboard" class="text-xl font-bold">Market</a>
          </div>
          <div class="flex-none">
            <div class="badge badge-primary badge-lg">Prototype</div>
          </div>
        </header>

        <div class="dashboard-hero" aria-hidden="true"></div>

        <main class="flex-1 px-4 py-4 md:px-6 lg:px-8">
          <div class="mx-auto max-w-7xl">
            ${renderPage(currentRoute.id)}
          </div>
        </main>
      </div>

      <div class="drawer-side z-20">
        <label for="app-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
        <aside class="w-72 bg-base-100 p-4 market-sidebar">
          <div class="mb-6 px-2 pt-3">
            <h2 class="text-lg font-bold">Research Console</h2>
            <p class="text-sm text-base-content/70">Personal research &amp; paper trading</p>
          </div>
          <ul class="menu menu-lg gap-1">
            ${routes
              .map(
                (route) => `
                  <li>
                    <a href="#${route.id}" class="route-link ${route.id === currentRoute.id ? 'active bg-base-200' : ''}">${route.label}</a>
                  </li>
                `,
              )
              .join('')}
          </ul>
        </aside>
      </div>
    </div>
  `;

  document.querySelectorAll('.route-link').forEach((link) => {
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
