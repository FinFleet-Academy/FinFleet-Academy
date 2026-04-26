/**
 * AI Engine for FinFleet Academy Pro Chart
 * Provides rule-based market analysis, pattern detection, and educational insights.
 */

export const analyzeMarket = (data) => {
  if (!data || data.length < 20) return null;

  const currentPrice = data[data.length - 1].close;
  const prevPrice = data[data.length - 2].close;
  const recentData = data.slice(-20);
  
  // 1. TREND DETECTION
  const firstPrice = recentData[0].close;
  const priceChange = ((currentPrice - firstPrice) / firstPrice) * 100;
  
  let trend = 'Neutral';
  let trendStrength = 5;
  if (priceChange > 2) { trend = 'Strong Uptrend'; trendStrength = 8; }
  else if (priceChange > 0.5) { trend = 'Uptrend'; trendStrength = 6; }
  else if (priceChange < -2) { trend = 'Strong Downtrend'; trendStrength = 8; }
  else if (priceChange < -0.5) { trend = 'Downtrend'; trendStrength = 6; }

  // 2. VOLATILITY DETECTION
  const highs = recentData.map(d => d.high);
  const lows = recentData.map(d => d.low);
  const range = Math.max(...highs) - Math.min(...lows);
  const avgRange = range / currentPrice * 100;
  
  let volatility = 'Low';
  let riskLevel = 'Low';
  if (avgRange > 5) { volatility = 'Extreme'; riskLevel = 'High'; }
  else if (avgRange > 2) { volatility = 'High'; riskLevel = 'Medium'; }

  // 3. MOMENTUM (RSI Approximation)
  const gains = [];
  const losses = [];
  for (let i = 1; i < recentData.length; i++) {
    const diff = recentData[i].close - recentData[i-1].close;
    if (diff >= 0) gains.push(diff);
    else losses.push(Math.abs(diff));
  }
  const avgGain = gains.length > 0 ? gains.reduce((a, b) => a + b, 0) / gains.length : 0;
  const avgLoss = losses.length > 0 ? losses.reduce((a, b) => a + b, 0) / losses.length : 1;
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  
  let momentum = 'Stable';
  if (rsi > 70) momentum = 'Overbought';
  else if (rsi < 30) momentum = 'Oversold';
  else if (rsi > 55) momentum = 'Bullish';
  else if (rsi < 45) momentum = 'Bearish';

  // 4. PATTERN DETECTION (Support/Resistance)
  const resistance = Math.max(...highs);
  const support = Math.min(...lows);
  
  const insights = [];
  if (currentPrice > resistance * 0.98) insights.push("Price approaching major resistance level.");
  if (currentPrice < support * 1.02) insights.push("Stock is hovering near a key support zone.");
  if (momentum === 'Overbought') insights.push("High momentum detected - watch for potential cooling.");
  if (trend.includes('Uptrend')) insights.push("Consistently making higher highs; trend is intact.");
  if (volatility === 'High') insights.push("Elevated volatility; wider stop-losses recommended.");

  return {
    trend,
    trendStrength,
    volatility,
    riskLevel,
    momentum,
    rsi: Math.round(rsi),
    support: parseFloat(support.toFixed(2)),
    resistance: parseFloat(resistance.toFixed(2)),
    insights
  };
};

export const getTradeFeedback = (type, analysis) => {
  if (!analysis) return "Trade executed.";

  if (type === 'BUY') {
    if (analysis.trend.includes('Uptrend')) return "You bought during an uptrend – good confirmation.";
    if (analysis.momentum === 'Oversold') return "Contrarian buy in oversold zone – high potential but risky.";
    if (analysis.riskLevel === 'High') return "Entered during high volatility – monitor closely.";
    return "Buy order placed. Trend is currently " + analysis.trend.toLowerCase() + ".";
  } else {
    if (analysis.trend.includes('Downtrend')) return "Selling during a downtrend – disciplined exit.";
    if (analysis.momentum === 'Overbought') return "Selling near peaks – excellent timing.";
    return "Sell order executed. Current market risk is " + analysis.riskLevel + ".";
  }
};

export const explainChart = (stock, analysis) => {
  if (!analysis) return "No data available to analyze.";

  return `The chart for ${stock} shows a ${analysis.trend.toLowerCase()} pattern. 
          With a trend strength of ${analysis.trendStrength}/10 and ${analysis.momentum.toLowerCase()} momentum, 
          the market is currently in a ${analysis.volatility.toLowerCase()} volatility phase. 
          Immediate support is at ₹${analysis.support} and resistance is at ₹${analysis.resistance}.`;
};
