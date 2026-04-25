import axios from 'axios';

class MarketDataService {
  constructor() {
    this.cache = new Map();
    this.CACHE_TTL = 60000; // 60 seconds minimum
  }

  async getIntradayData(symbol = 'AAPL') {
    const formattedSymbol = symbol.toUpperCase();
    const now = Date.now();
    
    // Check Cache
    if (this.cache.has(formattedSymbol)) {
      const cached = this.cache.get(formattedSymbol);
      if (now - cached.lastFetched < this.CACHE_TTL) {
        return cached.data;
      }
    }

    try {
      const apiKey = process.env.ALPHA_VANTAGE_API_KEY || 'demo';
      const response = await axios.get(`https://www.alphavantage.co/query`, {
        params: {
          function: 'TIME_SERIES_INTRADAY',
          symbol: formattedSymbol,
          interval: '5min',
          apikey: apiKey,
          outputsize: 'compact'
        }
      });

      const timeSeries = response.data['Time Series (5min)'];
      if (!timeSeries) {
        if (response.data.Information) {
          throw new Error('API Rate Limit Exceeded: ' + response.data.Information);
        }
        if (response.data['Error Message']) {
             throw new Error('API Error: ' + response.data['Error Message']);
        }
        throw new Error('Invalid response from Alpha Vantage');
      }

      // Format Data: [ { time, open, high, low, close, volume } ]
      const data = Object.keys(timeSeries)
        .map(timeStr => {
          const entry = timeSeries[timeStr];
          // Convert "YYYY-MM-DD HH:mm:ss" -> "YYYY-MM-DDTHH:mm:ss"
          const isoTime = timeStr.replace(' ', 'T');
          // Lightweight charts needs unix timestamp in seconds for Dst
          return {
            time: Math.floor(new Date(isoTime).getTime() / 1000),
            open: parseFloat(entry['1. open']),
            high: parseFloat(entry['2. high']),
            low: parseFloat(entry['3. low']),
            close: parseFloat(entry['4. close']),
            volume: parseFloat(entry['5. volume'])
          };
        })
        .sort((a, b) => a.time - b.time); // Sort chronologically (oldest first)

      // Store in cache
      this.cache.set(formattedSymbol, {
        data,
        lastFetched: now
      });

      return data;

    } catch (error) {
      console.error(`MarketDataService Error fetching ${formattedSymbol}:`, error.message);
      
      // Fallback to cache if available
      if (this.cache.has(formattedSymbol)) {
        console.warn(`Falling back to cached data for ${formattedSymbol}`);
        return this.cache.get(formattedSymbol).data;
      }
      
      throw error;
    }
  }
}

export default new MarketDataService();
