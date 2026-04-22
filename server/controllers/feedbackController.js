import Feedback from '../models/Feedback.js';

export const submitFeedback = async (req, res) => {
  try {
    const { name, email, rating, message } = req.body;
    if (!name || !email || !rating || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const feedback = await Feedback.create({
      userId: req.user?._id,
      name,
      email,
      rating: Number(rating),
      message,
    });
    res.status(201).json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({})
      .sort({ createdAt: -1 })
      .populate('userId', 'name email plan');
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
