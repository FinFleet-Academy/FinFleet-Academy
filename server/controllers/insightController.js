import DailyInsight from '../models/DailyInsight.js';

// Get today's insight (or most recent)
export const getTodayInsight = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let insight = await DailyInsight.findOne({ date: { $gte: today } }).sort({ date: -1 });
    
    // If no insight for today, get the most recent one
    if (!insight) {
      insight = await DailyInsight.findOne().sort({ date: -1 });
    }

    if (!insight) {
      return res.status(404).json({ message: 'No insights available.' });
    }

    res.json(insight);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Admin: Add or update an insight
export const createInsight = async (req, res) => {
  try {
    const { title, content, type, date } = req.body;
    
    const insightDate = new Date(date || Date.now());
    insightDate.setHours(0, 0, 0, 0);

    const insight = await DailyInsight.findOneAndUpdate(
      { date: insightDate },
      { title, content, type, date: insightDate },
      { new: true, upsert: true }
    );

    res.status(201).json(insight);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Admin: Get all insights
export const getAllInsights = async (req, res) => {
  try {
    const insights = await DailyInsight.find().sort({ date: -1 });
    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
