/**
 * Cloudflare Pages Function: Single Stock Quote Proxy
 * Endpoint: /api/quote?symbol=ICICIBANK
 */
export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const rawSymbol = context.params?.symbol || url.searchParams.get('symbol') || 'ICICIBANK';
  const symbol = rawSymbol.toUpperCase().replace(/[^A-Z0-9]/g, '');

  if (!symbol) {
    return new Response(JSON.stringify({ error: 'Missing symbol' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS?interval=1d`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: `Upstream error: ${response.statusText}`, symbol }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const data = await response.json();
    const result = data?.chart?.result?.[0];
    const meta = result?.meta;

    if (!meta || !meta.regularMarketPrice) {
      return new Response(JSON.stringify({ error: 'Quote not found', symbol }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const cmp = Number(meta.regularMarketPrice);
    const prevClose = Number(meta.chartPreviousClose || cmp);
    let change = Number(meta.regularMarketChangePercent || 0);
    if (change === 0 && prevClose > 0) {
      change = Number((((cmp - prevClose) / prevClose) * 100).toFixed(2));
    }

    const output = {
      success: true,
      symbol,
      ticker: `${symbol}.NS`,
      cmp,
      change: Number(change.toFixed(2)),
      dayHigh: Number(meta.regularMarketDayHigh || cmp),
      dayLow: Number(meta.regularMarketDayLow || cmp),
      prevClose,
      volume: Number(meta.regularMarketVolume || 0),
      timestamp: Math.floor(Date.now() / 1000)
    };

    return new Response(JSON.stringify(output), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=5, s-maxage=5'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, symbol }), {
      status: 502,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
