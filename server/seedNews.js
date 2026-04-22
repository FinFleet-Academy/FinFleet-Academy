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
  },
  {
    title: "Bitcoin Surges Past $100k as Institutional Interest Peaks",
    slug: "bitcoin-surges-past-100k-2026",
    category: "Crypto",
    summary: "The world's leading cryptocurrency has crossed a historic milestone, driven by the approval of new spot ETFs and global adoption.",
    content: "Bitcoin has officially crossed the $100,000 mark for the first time in history, marking a new era for digital assets. The surge is attributed to a combination of institutional buy-in, favorable regulatory shifts, and the launch of sophisticated trading products in major financial hubs.\n\nAnalysts suggest that the 'digital gold' narrative is strengthening as more hedge funds and corporate treasuries allocate a portion of their portfolios to Bitcoin.\n\nWhile volatility remains a characteristic of the crypto market, the current trend shows a maturing ecosystem with robust liquidity and increasing retail participation.",
    sourceLink: "https://example.com/crypto-news",
    isTrending: true
  },
  {
    title: "Global Inflation Cools Down: What it Means for Interest Rates",
    slug: "global-inflation-cools-2026",
    category: "Economy",
    summary: "Major central banks are considering rate cuts as inflation figures drop below target levels in several G7 nations.",
    content: "Economists are breathing a sigh of relief as global inflation rates show a steady decline in early 2026. This cooling effect is primarily due to stabilized energy prices and improved supply chain efficiencies.\n\nCentral banks, including the Federal Reserve and the ECB, are now signaling a potential pivot toward a more dovish monetary policy. Investors are closely watching the upcoming meetings for any hints of interest rate reductions, which could further stimulate market growth.\n\nHowever, the labor market remains tight, posing a challenge for policymakers who want to avoid an 'over-cooling' of the economy.",
    sourceLink: "https://example.com/economy-updates",
    isTrending: false
  },
  {
    title: "Sustainable Energy Stocks Lead Market Gains in Q1 2026",
    slug: "sustainable-energy-stocks-q1-2026",
    category: "Stock Market",
    summary: "Green energy companies are outperforming traditional sectors as global sustainability mandates take effect.",
    content: "The first quarter of 2026 has seen a significant rally in renewable energy stocks. Companies specializing in solar, wind, and advanced battery technology have reported record-breaking earnings, driven by government incentives and a global shift toward net-zero emissions.\n\nInstitutional investors are increasingly focusing on ESG (Environmental, Social, and Governance) criteria, leading to a massive reallocation of capital into sustainable sectors.\n\nMarket experts believe this isn't just a temporary trend but a fundamental shift in the global energy landscape that will define the rest of the decade.",
    sourceLink: "https://example.com/stock-market-green",
    isTrending: false
  },
  {
    title: "The Future of AI in Personal Finance: Beyond Chatbots",
    slug: "future-ai-personal-finance-2026",
    category: "Opinion",
    summary: "Artificial Intelligence is evolving from simple query tools to autonomous wealth managers. Are we ready?",
    content: "As we move further into 2026, the integration of AI in personal finance is reaching new heights. It's no longer just about chatbots answering basic questions; AI is now capable of real-time portfolio rebalancing, hyper-personalized tax optimization, and predictive spending analysis.\n\nWhile these tools offer immense convenience and efficiency, they also raise important questions about data privacy and the 'human element' in financial advisory.\n\nThis opinion piece explores how investors can leverage AI to their advantage while maintaining critical oversight of their long-term financial goals.",
    sourceLink: "https://example.com/ai-finance-opinion",
    isTrending: false
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
