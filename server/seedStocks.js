import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Stock from './models/Stock.js';

dotenv.config();

const stocks = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', sector: 'Energy', basePrice: 2500, currentPrice: 2542.45 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', sector: 'IT', basePrice: 3400, currentPrice: 3412.10 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank', sector: 'Banking', basePrice: 1600, currentPrice: 1612.40 },
  { symbol: 'INFY', name: 'Infosys', sector: 'IT', basePrice: 1500, currentPrice: 1567.80 },
  { symbol: 'ICICIBANK', name: 'ICICI Bank', sector: 'Banking', basePrice: 900, currentPrice: 915.20 },
  { symbol: 'HINDUNILVR', name: 'Hindustan Unilever', sector: 'FMCG', basePrice: 2500, currentPrice: 2534.50 },
  { symbol: 'SBI', name: 'State Bank of India', sector: 'Banking', basePrice: 550, currentPrice: 567.90 },
  { symbol: 'BHARTIARTL', name: 'Bharti Airtel', sector: 'Telecom', basePrice: 750, currentPrice: 789.20 },
  { symbol: 'ITC', name: 'ITC Limited', sector: 'FMCG', basePrice: 380, currentPrice: 392.40 },
  { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', sector: 'Banking', basePrice: 1800, currentPrice: 1845.60 },
  { symbol: 'LT', name: 'Larsen & Toubro', sector: 'Construction', basePrice: 2200, currentPrice: 2256.70 },
  { symbol: 'AXISBANK', name: 'Axis Bank', sector: 'Banking', basePrice: 850, currentPrice: 872.30 },
  { symbol: 'ASIANPAINT', name: 'Asian Paints', sector: 'Consumer Goods', basePrice: 2800, currentPrice: 2845.90 },
  { symbol: 'MARUTI', name: 'Maruti Suzuki', sector: 'Automobile', basePrice: 8500, currentPrice: 8678.40 },
  { symbol: 'TITAN', name: 'Titan Company', sector: 'Consumer Goods', basePrice: 2500, currentPrice: 2567.20 },
  { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical', sector: 'Pharma', basePrice: 950, currentPrice: 978.50 },
  { symbol: 'ULTRACEMCO', name: 'UltraTech Cement', sector: 'Construction', basePrice: 7200, currentPrice: 7345.10 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance', sector: 'Finance', basePrice: 5800, currentPrice: 5912.30 },
  { symbol: 'WIPRO', name: 'Wipro Limited', sector: 'IT', basePrice: 380, currentPrice: 395.60 },
  { symbol: 'ADANIENT', name: 'Adani Enterprises', sector: 'Energy', basePrice: 1800, currentPrice: 1845.20 },
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Tech', market: 'US', basePrice: 180, currentPrice: 189.45 },
  { symbol: 'TSLA', name: 'Tesla, Inc.', sector: 'Auto', market: 'US', basePrice: 160, currentPrice: 172.60 },
  { symbol: 'MSFT', name: 'Microsoft Corp', sector: 'Tech', market: 'US', basePrice: 400, currentPrice: 412.30 },
  { symbol: 'NVDA', name: 'Nvidia Corp', sector: 'Tech', market: 'US', basePrice: 800, currentPrice: 845.20 }
];

const seedStocks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/finfleet');
    console.log('Connected to MongoDB');

    for (const stockData of stocks) {
      await Stock.findOneAndUpdate(
        { symbol: stockData.symbol },
        { ...stockData, changePercent: ((stockData.currentPrice - stockData.basePrice) / stockData.basePrice * 100).toFixed(2) },
        { upsert: true, new: true }
      );
    }

    console.log('Stocks seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedStocks();
