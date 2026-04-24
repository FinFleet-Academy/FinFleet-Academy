import CommunityMessage from '../models/CommunityMessage.js';

export const getMessages = async (req, res) => {
  try {
    const messages = await CommunityMessage.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('userId', 'name profileImage');
    
    // Send in chronological order
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching messages' });
  }
};

export const postMessage = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Message is required' });
    }

    const newMessage = await CommunityMessage.create({
      userId: req.user.id,
      userName: req.user.name,
      message: message.trim()
    });

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error posting message' });
  }
};
