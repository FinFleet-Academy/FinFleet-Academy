import mongoose from 'mongoose';
import dotenv from 'dotenv';
import News from './models/News.js';

dotenv.config({ path: './server/.env' });

const newsData = [
  {
    title: "India’s Financial Markets Enter 2026 with Strong Momentum",
    slug: "india-financial-markets-2026-momentum",
    category: "Stock Market",
    summary: "Indian markets are showing strong recovery driven by macroeconomic stability, investor confidence, and government reforms.",
    content: "India’s financial markets are entering 2026 on a strong note, backed by improving economic indicators, rising investor confidence, and continued policy support.\n\nAfter a period of slow movement, benchmark indices like the Nifty 50 and Sensex have shown strong recovery, driven by increased domestic demand and renewed participation from foreign institutional investors.\n\nKey sectors such as banking, manufacturing, and telecom have witnessed strong inflows, indicating a shift toward fundamentally strong businesses.\n\nHowever, experts warn that market valuations remain high, and global uncertainties could create short-term volatility.",
    sourceLink: "https://investmentguruindia.com/newsdetail/india-s-financial-markets-enter-2026-with-renewed-confidence919005",
    isTrending: true
  }
];

const seedNews = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/finfleet');
    console.log('Connected to MongoDB');

    await News.deleteMany({});
    await News.insertMany(newsData);

    console.log('News Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
};

seedNews();
