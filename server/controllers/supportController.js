import SupportMessage from '../models/SupportMessage.js';
import HelpArticle from '../models/HelpArticle.js';
import NewsletterSubscriber from '../models/NewsletterSubscriber.js';

// --- Support Controllers ---

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, subject, message, category } = req.body;
    const supportMessage = await SupportMessage.create({
      userId: req.user?.id,
      name,
      email,
      subject,
      message,
      category
    });
    res.status(201).json({ message: "Ticket raised successfully", ticketId: supportMessage._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAdminSupportMessages = async (req, res) => {
  try {
    const messages = await SupportMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Help CMS Controllers ---

export const getHelpArticles = async (req, res) => {
  try {
    const articles = await HelpArticle.find({ isPublished: true }).sort({ category: 1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createHelpArticle = async (req, res) => {
  try {
    const article = await HelpArticle.create(req.body);
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// --- Newsletter Controllers ---

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email, preferences } = req.body;
    const subscriber = await NewsletterSubscriber.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { preferences, isSubscribed: true } },
      { upsert: true, new: true }
    );
    res.json({ message: "Subscribed successfully", subscriber });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
