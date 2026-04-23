import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Stock from './models/Stock.js';

dotenv.config();

const nifty50Data = [
  { symbol: "RELIANCE", name: "Reliance Industries Ltd", sector: "Energy", basePrice: 2500 },
  { symbol: "TCS", name: "Tata Consultancy Services", sector: "IT", basePrice: 3500 },
  { symbol: "INFY", name: "Infosys Ltd", sector: "IT", basePrice: 1500 },
  { symbol: "HDFCBANK", name: "HDFC Bank Ltd", sector: "Banking", basePrice: 1600 },
  { symbol: "ICICIBANK", name: "ICICI Bank Ltd", sector: "Banking", basePrice: 1000 },
  { symbol: "SBIN", name: "State Bank of India", sector: "Banking", basePrice: 600 },
  { symbol: "ITC", name: "ITC Ltd", sector: "FMCG", basePrice: 450 },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever Ltd", sector: "FMCG", basePrice: 2600 },
  { symbol: "LT", name: "Larsen & Toubro", sector: "Infra", basePrice: 3200 },
  { symbol: "MARUTI", name: "Maruti Suzuki India Ltd", sector: "Auto", basePrice: 10000 },
  { symbol: "BHARTIARTL", name: "Bharti Airtel Ltd", sector: "Telecom", basePrice: 1100 },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", sector: "Banking", basePrice: 1800 },
  { symbol: "AXISBANK", name: "Axis Bank Ltd", sector: "Banking", basePrice: 1050 },
  { symbol: "ADANIENT", name: "Adani Enterprises Ltd", sector: "Metals", basePrice: 3100 },
  { symbol: "ADANIPORTS", name: "Adani Ports & SEZ", sector: "Logistics", basePrice: 1250 },
  { symbol: "ASIANPAINT", name: "Asian Paints Ltd", sector: "Consumer Durables", basePrice: 2900 },
  { symbol: "BAJFINANCE", name: "Bajaj Finance Ltd", sector: "Banking", basePrice: 6500 },
  { symbol: "BAJAJFINSV", name: "Bajaj Finserv Ltd", sector: "Banking", basePrice: 1600 },
  { symbol: "COALINDIA", name: "Coal India Ltd", sector: "Energy", basePrice: 450 },
  { symbol: "DRREDDY", name: "Dr. Reddy's Laboratories", sector: "Pharma", basePrice: 6200 },
  { symbol: "EICHERMOT", name: "Eicher Motors Ltd", sector: "Auto", basePrice: 4000 },
  { symbol: "GRASIM", name: "Grasim Industries Ltd", sector: "Cement", basePrice: 2200 },
  { symbol: "HCLTECH", name: "HCL Technologies Ltd", sector: "IT", basePrice: 1450 },
  { symbol: "HEROMOTOCO", name: "Hero MotoCorp Ltd", sector: "Auto", basePrice: 4600 },
  { symbol: "HINDALCO", name: "Hindalco Industries Ltd", sector: "Metals", basePrice: 600 },
  { symbol: "INDUSINDBK", name: "IndusInd Bank Ltd", sector: "Banking", basePrice: 1500 },
  { symbol: "JSWSTEEL", name: "JSW Steel Ltd", sector: "Metals", basePrice: 850 },
  { symbol: "M&M", name: "Mahindra & Mahindra Ltd", sector: "Auto", basePrice: 2000 },
  { symbol: "NESTLEIND", name: "Nestle India Ltd", sector: "FMCG", basePrice: 2500 },
  { symbol: "NTPC", name: "NTPC Ltd", sector: "Energy", basePrice: 350 },
  { symbol: "ONGC", name: "Oil & Natural Gas Corp", sector: "Energy", basePrice: 280 },
  { symbol: "POWERGRID", name: "Power Grid Corp", sector: "Energy", basePrice: 285 },
  { symbol: "SUNPHARMA", name: "Sun Pharmaceutical Industries", sector: "Pharma", basePrice: 1600 },
  { symbol: "TATAMOTORS", name: "Tata Motors Ltd", sector: "Auto", basePrice: 950 },
  { symbol: "TATASTEEL", name: "Tata Steel Ltd", sector: "Metals", basePrice: 165 },
  { symbol: "TECHM", name: "Tech Mahindra Ltd", sector: "IT", basePrice: 1250 },
  { symbol: "TITAN", name: "Titan Company Ltd", sector: "Consumer Durables", basePrice: 3600 },
  { symbol: "ULTRACEMCO", name: "UltraTech Cement Ltd", sector: "Cement", basePrice: 10000 },
  { symbol: "WIPRO", name: "Wipro Ltd", sector: "IT", basePrice: 480 },
  { symbol: "APOLLOHOSP", name: "Apollo Hospitals Enterprise", sector: "Pharma", basePrice: 6300 },
  { symbol: "BRITANNIA", name: "Britannia Industries Ltd", sector: "FMCG", basePrice: 5000 },
  { symbol: "CIPLA", name: "Cipla Ltd", sector: "Pharma", basePrice: 1450 },
  { symbol: "DIVISLAB", name: "Divi's Laboratories Ltd", sector: "Pharma", basePrice: 3800 },
  { symbol: "HDFCLIFE", name: "HDFC Life Insurance Co", sector: "Insurance", basePrice: 620 },
  { symbol: "LTIM", name: "LTIMindtree Ltd", sector: "IT", basePrice: 5000 },
  { symbol: "SBILIFE", name: "SBI Life Insurance Co", sector: "Insurance", basePrice: 1500 },
  { symbol: "TATACONSUM", name: "Tata Consumer Products", sector: "FMCG", basePrice: 1150 },
  { symbol: "UPL", name: "UPL Ltd", sector: "Chemicals", basePrice: 500 }
];

const seedStocks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing stocks (optional, but good for resetting simulation)
    await Stock.deleteMany({ market: 'INDIA' });

    const stocksToInsert = nifty50Data.map(s => ({
      ...s,
      currentPrice: s.basePrice,
      history: [{ price: s.basePrice, timestamp: new Date() }]
    }));

    await Stock.insertMany(stocksToInsert);
    console.log('NIFTY 50 Stocks seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedStocks();
