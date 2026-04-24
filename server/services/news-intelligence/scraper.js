import Parser from 'rss-parser';

class NewsScraper {
  constructor() {
    this.parser = new Parser({
      customFields: {
        item: ['description', 'pubDate', 'category'],
      }
    });
    
    // Global Financial RSS Feeds
    this.feeds = [
      { url: 'https://finance.yahoo.com/news/rssindex', source: 'YAHOO_FINANCE', region: 'GLOBAL' },
      { url: 'https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=10000664', source: 'CNBC', region: 'US' },
      { url: 'https://www.investing.com/rss/news_25.rss', source: 'INVESTING_COM', region: 'GLOBAL' },
      // Note: We use a few highly reliable feeds to prevent rate limiting
    ];
    
    this.lastFetched = new Map();
  }

  async scrapeAll() {
    console.log('[NewsScraper] Initiating Global News Extraction...');
    const extractedNews = [];

    for (const feed of this.feeds) {
      try {
        const feedData = await this.parser.parseURL(feed.url);
        
        // Process only the top 5 most recent articles per feed to keep it real-time
        const recentItems = feedData.items.slice(0, 5);

        for (const item of recentItems) {
          // Deduplication: Only process new articles
          if (!this.lastFetched.has(item.guid || item.link)) {
            
            // Clean up description HTML tags if any
            const cleanContent = item.contentSnippet || item.description?.replace(/<[^>]*>?/gm, '') || item.title;

            const article = {
              headline: item.title,
              content: cleanContent,
              source: feed.source,
              region: feed.region,
              link: item.link,
              timestamp: new Date(item.pubDate || new Date()),
            };

            extractedNews.push(article);
            this.lastFetched.set(item.guid || item.link, true);
          }
        }
      } catch (error) {
        console.error(`[NewsScraper] Failed to fetch feed ${feed.source}:`, error.message);
      }
    }

    // Keep memory clean
    if (this.lastFetched.size > 1000) {
       const keys = Array.from(this.lastFetched.keys());
       for(let i=0; i < 500; i++) this.lastFetched.delete(keys[i]);
    }

    console.log(`[NewsScraper] Extracted ${extractedNews.length} fresh articles.`);
    return extractedNews;
  }
}

export default new NewsScraper();
