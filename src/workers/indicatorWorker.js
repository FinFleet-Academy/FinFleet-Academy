/**
 * FinFleet Academy Indicator Worker
 * Offloads heavy technical analysis (RSI, EMA, MACD) from the main thread
 */
self.onmessage = (e) => {
  const { type, data, options } = e.data;

  switch (type) {
    case 'CALC_INDICATORS':
      const results = calculateIndicators(data, options);
      self.postMessage({ type: 'INDICATORS_READY', results });
      break;
    default:
      break;
  }
};

function calculateIndicators(data, options) {
  // Simple EMA implementation for demonstration
  const ema12 = calculateEMA(data, 12);
  const ema26 = calculateEMA(data, 26);
  const rsi = calculateRSI(data, 14);

  return { ema12, ema26, rsi };
}

function calculateEMA(data, period) {
  const k = 2 / (period + 1);
  let ema = data[0].value;
  return data.map((d, i) => {
    if (i === 0) return { time: d.time, value: d.value };
    ema = d.value * k + ema * (1 - k);
    return { time: d.time, value: ema };
  });
}

function calculateRSI(data, period) {
  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = data[i].value - data[i - 1].value;
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;

  return data.map((d, i) => {
    if (i <= period) return { time: d.time, value: 50 };
    
    const diff = d.value - data[i - 1].value;
    const gain = diff >= 0 ? diff : 0;
    const loss = diff < 0 ? -diff : 0;
    
    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;
    
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    
    return { time: d.time, value: rsi };
  });
}
