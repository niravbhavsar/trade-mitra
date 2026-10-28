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

  const rawSymbols = (event.queryStringParameters && event.queryStringParameters.symbols) ||
    'ICICIBANK,RELIANCE,TCS,HDFCBANK,INFY,LT,BHARTIARTL,TATAMOTORS,SBIN,ITC,TRENT,TATAPOWER,ZOMATO,BEL,HAL,CDSL';

  const symbolList = rawSymbols.split(',')
    .map(s => s.trim().toUpperCase().replace(/[^A-Z0-9]/g, ''))
    .filter(Boolean);

  const quotes = {};

  await Promise.all(symbolList.map(async (sym) => {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${sym}.NS?interval=1d`;
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)',
          'Accept': 'application/json'
        }
      });
      if (res.ok) {
        const json = await res.json();
        const meta = json?.chart?.result?.[0]?.meta;
        if (meta && meta.regularMarketPrice) {
          const cmp = Number(meta.regularMarketPrice);
          const prev = Number(meta.chartPreviousClose || cmp);
          let change = Number(meta.regularMarketChangePercent || 0);
          if (change === 0 && prev > 0) {
            change = Number((((cmp - prev) / prev) * 100).toFixed(2));
          }
          quotes[sym] = {
            symbol: sym,
            cmp,
            change: Number(change.toFixed(2)),
            dayHigh: Number(meta.regularMarketDayHigh || cmp),
            dayLow: Number(meta.regularMarketDayLow || cmp),
            volume: Number(meta.regularMarketVolume || 0)
          };
        }
      }
    } catch (e) {
      // Ignore individual failure
    }
  }));

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      quotes,
      count: Object.keys(quotes).length,
      timestamp: Math.floor(Date.now() / 1000)
    })
  };
};

