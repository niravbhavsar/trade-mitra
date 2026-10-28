exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const rawSymbol = (event.queryStringParameters && event.queryStringParameters.symbol) || 'ICICIBANK';
  const symbol = rawSymbol.toUpperCase().replace(/[^A-Z0-9]/g, '');

  if (!symbol) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing symbol' }) };
  }

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}.NS?interval=1d`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: `Upstream error: ${response.statusText}`, symbol })
      };
    }

    const data = await response.json();
    const result = data?.chart?.result?.[0];
    const meta = result?.meta;

    if (!meta || !meta.regularMarketPrice) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Quote not found', symbol })
      };
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(output)
    };
  } catch (err) {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: err.message, symbol })
    };
  }
};

