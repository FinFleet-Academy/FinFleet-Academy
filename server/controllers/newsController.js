import News from '../models/News.js';

export const getAllNews = async (req, res) => {
  try {
    const news = await News.find({}).sort({ createdAt: -1 });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNewsBySlug = async (req, res) => {
  try {
    const news = await News.findOne({ slug: req.params.slug });
    if (!news) return res.status(404).json({ message: 'News article not found' });
    res.json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrendingNews = async (req, res) => {
  try {
    const trending = await News.find({ isTrending: true }).sort({ createdAt: -1 }).limit(3);
    res.json(trending);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const explainNews = async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: 'News content required' });

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) return res.status(500).json({ message: 'AI config missing' });

    import('axios').then(async (axios) => {
      const response = await axios.default.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-versatile',
          messages: [
            { role: 'system', content: 'You are a financial expert. Explain this news article in extremely simple terms for a beginner. Highlight the impact on Indian markets if applicable. Use bullet points and max 150 words.' },
            { role: 'user', content }
          ],
          max_tokens: 300,
          temperature: 0.5
        },
        { headers: { 'Authorization': `Bearer ${groqApiKey}`, 'Content-Type': 'application/json' } }
      );
      res.json({ explanation: response.data.choices[0].message.content });
    }).catch(err => {
      console.error(err);
      res.status(500).json({ message: 'AI Error' });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
