import Subscriber from '../models/Subscriber.js';

export const addSubscriber = async (req, res) => {
  try {
    const { email, source } = req.body;
    console.log('Subscriber Request Received:', { email, source });

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({ message: 'A valid email address is required' });
    }

    const cleanedEmail = email.trim().toLowerCase();

    // Check if subscriber already exists
    const existingSubscriber = await Subscriber.findOne({ email: cleanedEmail });
    if (existingSubscriber) {
      return res.status(400).json({ message: 'You are already subscribed to our newsletter!' });
    }

    const subscriber = await Subscriber.create({ 
      email: cleanedEmail, 
      source: source || 'newsletter' 
    });

    res.status(201).json({ message: 'Successfully subscribed', subscriber });
  } catch (error) {
    console.error('Subscriber Error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You are already subscribed to our newsletter!' });
    }
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
