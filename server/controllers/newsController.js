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
