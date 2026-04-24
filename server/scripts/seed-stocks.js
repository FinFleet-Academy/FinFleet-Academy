import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Stock from '../models/Stock.js';

dotenv.config();

const stocks = [
  // INDIA - NIFTY 50 & MAJOR
  { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy', basePrice: 2500, currentPrice: 2540, market: 'INDIA' },
  { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT', basePrice: 3800, currentPrice: 3850, market: 'INDIA' },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Finance', basePrice: 1500, currentPrice: 1520, market: 'INDIA' },
  { symbol: 'INFY', name: 'Infosys', sector: 'IT', basePrice: 1400, currentPrice: 1410, market: 'INDIA' },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Finance', basePrice: 900, currentPrice: 920, market: 'INDIA' },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', sector: 'FMCG', basePrice: 2400, currentPrice: 2380, market: 'INDIA' },
  { symbol: 'ITC', name: 'ITC Limited', sector: 'FMCG', basePrice: 400, currentPrice: 415, market: 'INDIA' },
  { symbol: 'SBIN', name: 'State Bank of India', sector: 'Finance', basePrice: 600, currentPrice: 610, market: 'INDIA' },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', sector: 'Telecom', basePrice: 800, currentPrice: 825, market: 'INDIA' },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', sector: 'Finance', basePrice: 7000, currentPrice: 7150, market: 'INDIA' },
  { symbol: 'LT', name: 'Larsen & Toubro', sector: 'Infrastructure', basePrice: 2200, currentPrice: 2250, market: 'INDIA' },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', sector: 'Finance', basePrice: 1800, currentPrice: 1790, market: 'INDIA' },
  { symbol: 'WIPRO', name: 'Wipro', sector: 'IT', basePrice: 400, currentPrice: 410, market: 'INDIA' },
  { symbol: 'TATAMOTORS', name: 'Tata Motors', sector: 'Automobile', basePrice: 500, currentPrice: 530, market: 'INDIA' },
  { symbol: 'TITAN', name: 'Titan Company', sector: 'Retail', basePrice: 2800, currentPrice: 2900, market: 'INDIA' },
  { symbol: 'ADANIENT', name: 'Adani Enterprises', sector: 'Energy', basePrice: 2000, currentPrice: 2100, market: 'INDIA' },
  { symbol: 'M&M', name: 'Mahindra & Mahindra', sector: 'Automobile', basePrice: 1300, currentPrice: 1350, market: 'INDIA' },
  { symbol: 'SUNPHARMA', name: 'Sun Pharma', sector: 'Healthcare', basePrice: 1000, currentPrice: 1020, market: 'INDIA' },
  { symbol: 'AXISBANK', name: 'Axis Bank', sector: 'Finance', basePrice: 900, currentPrice: 915, market: 'INDIA' },
  { symbol: 'ASIANPAINT', name: 'Asian Paints', sector: 'Paints', basePrice: 2800, currentPrice: 2850, market: 'INDIA' },
  
  // GLOBAL - MAJOR US STOCKS
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Tech', basePrice: 170, currentPrice: 175, market: 'GLOBAL' },
  { symbol: 'MSFT', name: 'Microsoft Corp', sector: 'Tech', basePrice: 320, currentPrice: 330, market: 'GLOBAL' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Tech', basePrice: 130, currentPrice: 135, market: 'GLOBAL' },
  { symbol: 'AMZN', name: 'Amazon.com', sector: 'Retail', basePrice: 140, currentPrice: 142, market: 'GLOBAL' },
  { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Auto', basePrice: 250, currentPrice: 260, market: 'GLOBAL' },
  { symbol: 'NVDA', name: 'Nvidia Corp', sector: 'Semicon', basePrice: 450, currentPrice: 480, market: 'GLOBAL' },
  { symbol: 'META', name: 'Meta Platforms', sector: 'Tech', basePrice: 300, currentPrice: 310, market: 'GLOBAL' },
  { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Entertain', basePrice: 400, currentPrice: 410, market: 'GLOBAL' },
];

const seedStocks = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/finfleet';
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB at ${mongoUri}...`);

    // Clear existing stocks
    await Stock.deleteMany({});
    console.log('Old stock records purged.');

    const seededStocks = stocks.map(stock => {
      const history = [];
      let currentPrice = stock.basePrice;
      
      // Generate 24 hours of simulated history
      for (let i = 24; i >= 0; i--) {
        const volatility = (Math.random() - 0.5) * 0.02; // 2% daily fluctuation
        currentPrice = currentPrice * (1 + volatility);
        history.push({
          price: currentPrice,
          timestamp: new Date(Date.now() - i * 60 * 60 * 1000)
        });
      }

      const lastPrice = history[history.length - 1].price;
      const change = lastPrice - stock.basePrice;
      const changePercent = (change / stock.basePrice) * 100;

      return {
        ...stock,
        currentPrice: lastPrice,
        change,
        changePercent: parseFloat(changePercent.toFixed(2)),
        history
      };
    });

    await Stock.insertMany(seededStocks);
    console.log(`Successfully seeded ${seededStocks.length} stocks with history.`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedStocks();
