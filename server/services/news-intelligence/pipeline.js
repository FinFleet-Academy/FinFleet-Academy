import Queue from 'bull';
import summarizer from './summarizer.js';
import EventBus from '../common/eventBus.js';

/**
 * ⚡ FinFleet Pro: Global News Intelligence Pipeline
 * Scalable ingestion and coordination of AI financial analysts.
 */
class NewsPipeline {
  constructor() {
    this.isEnabled = !!process.env.REDIS_URL;
    if (!this.isEnabled) {
      console.warn('[NewsPipeline] REDIS_URL not set. Pipeline disabled.');
      return;
    }

    this.newsQueue = new Queue('news-processing', process.env.REDIS_URL);
    
    // Process Queue
    this.newsQueue.process(async (job) => {
      const { article } = job.data;
      console.log(`[Pipeline] Processing News: ${article.headline}`);
      
      try {
        const intelligence = await summarizer.processArticle(article);
        
        // Broadcast Intelligence to real-time UI
        EventBus.publish('FINOR_INTEL_UPDATE', intelligence);
        
        return intelligence;
      } catch (error) {
        console.error('[Pipeline] AI Stage Error:', error);
        throw error;
      }
    });
  }

  /**
   * 📡 Ingest News from Global Sources
   */
  async ingest(article) {
    if (!this.isEnabled) return;
    // Add to queue with deduplication key (fingerprint)
    const fingerprint = summarizer.generateFingerprint(article.content);
    
    await this.newsQueue.add(
      { article },
      { 
        jobId: fingerprint, // BullMQ native deduplication
        removeOnComplete: true,
        attempts: 3,
        backoff: 5000
      }
    );
  }
}

export default new NewsPipeline();
