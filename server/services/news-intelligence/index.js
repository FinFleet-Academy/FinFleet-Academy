import express from 'express';
import pipeline from './pipeline.js';

/**
 * 🟣 FinFleet Pro: Global News Intelligence Service
 * The orchestrator for real-time financial analyst-grade news.
 */

const app = express();
const PORT = process.env.NEWS_INTEL_PORT || 5006;

app.use(express.json());

// Ingestion Endpoint (Internal)
app.post('/api/ingest', async (req, res) => {
  const { article } = req.body;
  await pipeline.ingest(article);
  res.status(202).json({ status: 'INGESTED', id: article.headline });
});

// 🌍 Global Simulation: Ingesting news from different regions
const SIMULATED_NEWS = [
  { 
    headline: "Federal Reserve Signals Rate Plateau", 
    content: "The Federal Reserve board members have reached a consensus on maintaining current interest rates as inflation targets show significant convergence with target goals...",
    source: "REUTERS", 
    region: "US" 
  },
  { 
    headline: "Reliance Earnings Beat Expectations", 
    content: "India's largest conglomerate reported a 15% increase in quarterly profits, driven by strong growth in retail and telecommunications sectors...",
    source: "BLOOMBERG", 
    region: "ASIA" 
  },
  { 
    headline: "ECB Policy Shift on Green Energy", 
    content: "The European Central Bank announced a new framework for sustainability-linked financing, impacting major utility companies across the continent...",
    source: "FINANCIAL_TIMES", 
    region: "EU" 
  }
];

// Simulate news flow every 30 seconds
setInterval(() => {
  const news = SIMULATED_NEWS[Math.floor(Math.random() * SIMULATED_NEWS.length)];
  pipeline.ingest({ ...news, timestamp: new Date() });
}, 30000);

app.listen(PORT, () => {
  console.log(`[NewsIntelligence] Running on port ${PORT}`);
});
