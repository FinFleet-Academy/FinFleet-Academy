import Stock from '../models/Stock.js';
import cacheService from './cacheService.js';
import axios from 'axios';

class StockService {
  async getStocks(filters, page = 1, limit = 20) {
    const cacheKey = `stocks:list:${JSON.stringify(filters)}:p${page}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const skip = (page - 1) * limit;
    const total = await Stock.countDocuments(filters);
    const stocks = await Stock.find(filters)
      .select('-history')
      .sort({ symbol: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const result = {
      stocks,
      page,
      pages: Math.ceil(total / limit),
      total
    };

    await cacheService.set(cacheKey, result, 60); // 1 min TTL for stock list
    return result;
  }

  async getStockBySymbol(symbol) {
    const cacheKey = `stock:${symbol.toUpperCase()}`;
    const cached = await cacheService.get(cacheKey);
    if (cached) return cached;

    const stock = await Stock.findOne({ symbol: symbol.toUpperCase() }).lean();
    if (stock) {
      await cacheService.set(cacheKey, stock, 300); // 5 min TTL
    }
    return stock;
  }

  async getSectors() {
    const cached = await cacheService.get('stocks:sectors');
    if (cached) return cached;

    const sectors = await Stock.distinct('sector', { market: 'INDIA' });
    const result = ['All', ...sectors];
    
    await cacheService.set('stocks:sectors', result, 3600); // 1 hour TTL
    return result;
  }

  async getRealTimePrice(symbol) {
    try {
      const response = await axios.get(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbol}`);
      const quote = response.data.quoteResponse.result[0];
      if (quote) {
        return {
          price: quote.regularMarketPrice,
          change: quote.regularMarketChange,
          changePercent: quote.regularMarketChangePercent,
          name: quote.shortName || quote.longName
        };
      }
    } catch (err) {
      console.warn(`Real-time fetch failed for ${symbol}:`, err.message);
    }
    return null;
  }
}

export default new StockService();
