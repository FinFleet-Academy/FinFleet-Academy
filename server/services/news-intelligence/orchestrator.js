import scraper from './scraper.js';
import pipeline from './pipeline.js';

/**
 * 🌍 Global Live Ingestion Engine Orchestrator
 * Automatically extracts news from global internet feeds every 60 seconds.
 */
export const startNewsScraper = () => {
  console.log('[NewsIntelligence] Starting background scraper loop...');
  
  const runScraper = async () => {
    try {
      const freshArticles = await scraper.scrapeAll();
      console.log(`[NewsIntelligence] Scraper found ${freshArticles.length} fresh articles.`);
      
      // Inject all fresh articles into the AI intelligence pipeline
      for (const article of freshArticles) {
        await pipeline.ingest(article);
      }
    } catch (err) {
      console.error('[NewsIntelligence] Scraper Error:', err);
    }
  };

  // Run once on startup
  runScraper();

  // Set interval
  setInterval(runScraper, 60000); // 60 seconds
};
