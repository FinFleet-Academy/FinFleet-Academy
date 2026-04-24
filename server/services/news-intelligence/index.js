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

import scraper from './scraper.js';

// 🌍 Global Live Ingestion Engine
// Automatically extracts news from global internet feeds every 60 seconds
setInterval(async () => {
  try {
    const freshArticles = await scraper.scrapeAll();
    
    // Inject all fresh articles into the AI intelligence pipeline
    for (const article of freshArticles) {
      await pipeline.ingest(article);
    }
  } catch (err) {
    console.error('[NewsIntelligence] Scraper Error:', err);
  }
}, 60000); // 60 seconds

app.listen(PORT, () => {
  console.log(`[NewsIntelligence] Running on port ${PORT}`);
});
