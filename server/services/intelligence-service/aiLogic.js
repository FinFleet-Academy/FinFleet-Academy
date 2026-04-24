/**
 * 🧠 FinFleet Pro: AI Market Intelligence Logic
 * Processes raw market data to detect institutional patterns and probabilistic outcomes.
 */

class AILogicEngine {
  constructor() {
    this.memoryWindow = 500; // Lookback for pattern detection
  }

  /**
   * 🐋 Whale Activity Detection
   * Identifies unusually large volume spikes with minimal price movement (Accumulation)
   * or significant price impact (Institutional Dumping).
   */
  detectWhales(ticks) {
    if (ticks.length < 50) return null;
    
    const recent = ticks.slice(-10);
    const avgVolume = ticks.reduce((acc, t) => acc + t.volume, 0) / ticks.length;
    const peakVolume = Math.max(...recent.map(t => t.volume));
    
    if (peakVolume > avgVolume * 4) {
      const priceImpact = Math.abs(recent[0].price - recent[recent.length-1].price) / recent[0].price;
      if (priceImpact < 0.001) return 'INSTITUTIONAL_ACCUMULATION';
      return 'INSTITUTIONAL_VOLATILITY_SPIKE';
    }
    return null;
  }

  /**
   * 📊 Liquidity Zone Mapping
   * Finds price levels with high historical volume density (High Volume Nodes).
   */
  mapLiquidityZones(ticks) {
    const zones = {};
    ticks.forEach(t => {
      const level = Math.round(t.price / 5) * 5; // Group by price increments
      zones[level] = (zones[level] || 0) + t.volume;
    });
    
    // Return top 3 liquidity zones
    return Object.entries(zones)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([price, vol]) => ({ price: parseFloat(price), strength: vol }));
  }

  /**
   * 📉 Trend Exhaustion Prediction
   * Uses divergence and volatility compression to predict potential reversals.
   */
  predictExhaustion(data) {
    if (data.length < 30) return 0;
    
    const recent = data.slice(-10);
    const volatility = Math.max(...recent.map(d => d.high)) - Math.min(...recent.map(d => d.low));
    const prevVolatility = Math.max(...data.slice(-20, -10).map(d => d.high)) - Math.min(...data.slice(-20, -10).map(d => d.low));
    
    // Volatility compression often precedes a breakout or reversal
    if (volatility < prevVolatility * 0.4) return 0.85; // 85% exhaustion/compression
    return 0.2;
  }

  /**
   * 🔮 Probabilistic Future Zones
   * Generates a "Heatmap" of where the price is likely to be based on standard deviation.
   */
  generateProbabilities(currentPrice, volatility) {
    return [
      { level: currentPrice + (volatility * 1.5), prob: 0.2, type: 'UPPER_EXTREME' },
      { level: currentPrice + (volatility * 0.8), prob: 0.6, type: 'UPPER_EXPECTED' },
      { level: currentPrice - (volatility * 0.8), prob: 0.6, type: 'LOWER_EXPECTED' },
      { level: currentPrice - (volatility * 1.5), prob: 0.2, type: 'LOWER_EXTREME' },
    ];
  }

  /**
   * 🎭 Market Psychology Detection
   * Proxies Fear/Greed based on price velocity and volume distribution.
   */
  detectPsychology(ticks) {
    const recent = ticks.slice(-20);
    const velocity = (recent[recent.length-1].price - recent[0].price) / recent[0].price;
    
    if (velocity > 0.02) return 'FOMO_ZONE';
    if (velocity < -0.02) return 'PANIC_SELL_RETAIL';
    return 'CALM_EQUILIBRIUM';
  }
}

export default new AILogicEngine();
