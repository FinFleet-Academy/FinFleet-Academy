import Queue from 'bull';
import summarizer from './summarizer.js';
import EventBus from '../common/eventBus.js';
import News from '../../models/News.js';

/**
 * ⚡ FinFleet Pro: Global News Intelligence Pipeline
 * Scalable ingestion and coordination of AI financial analysts.
 */
class NewsPipeline {
  constructor() {
    this.isEnabled = true; // Always enabled, but uses different strategy if no Redis
    this.useQueue = !!process.env.REDIS_URL;

    if (this.useQueue) {
      console.log('[NewsPipeline] Using Redis Queue for news processing.');
      this.newsQueue = new Queue('news-processing', process.env.REDIS_URL);
      
      this.newsQueue.process(async (job) => {
        return await this.processArticle(job.data.article);
      });
    } else {
      console.warn('[NewsPipeline] REDIS_URL not set. Using direct processing mode.');
    }
  }

  /**
   * 🤖 Core Processing Logic
   */
  async processArticle(article) {
    console.log(`[Pipeline] Processing News: ${article.headline}`);
    try {
      const intel = await summarizer.processArticle(article);
      
      // Save to Database
      const slug = article.headline.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      
      // Upsert to prevent duplicates in DB based on slug or headline
      await News.findOneAndUpdate(
        { slug },
        {
          title: intel.headline,
          summary: intel.summary,
          content: article.content,
          category: 'Global News',
          sourceLink: article.link,
          createdAt: article.timestamp || new Date(),
          isTrending: intel.marketImpact === 'HIGH'
        },
        { upsert: true, new: true }
      );

      // Broadcast Intelligence to real-time UI
      EventBus.publish('FINOR_INTEL_UPDATE', intel);
      
      return intel;
    } catch (error) {
      console.error('[Pipeline] AI Stage Error:', error);
      throw error;
    }
  }

  /**
   * 📡 Ingest News from Global Sources
   */
  async ingest(article) {
    if (this.useQueue) {
      const fingerprint = summarizer.generateFingerprint(article.content);
      await this.newsQueue.add(
        { article },
        { 
          jobId: fingerprint,
          removeOnComplete: true,
          attempts: 3,
          backoff: 5000
        }
      );
    } else {
      // Direct processing if no Redis
      await this.processArticle(article);
    }
  }
}

export default new NewsPipeline();
