import express from 'express';
import Trade from '../models/Trade.js';
import PortfolioItem from '../models/PortfolioItem.js';
import User from '../models/User.js';
import UserActivity from '../models/UserActivity.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/execute', protect, async (req, res) => {
  try {
    const { symbol, type, quantity, price } = req.body;
    const total = quantity * price;
    const user = await User.findById(req.user._id);

    if (type === 'BUY') {
      if (user.virtualBalance < total) {
        return res.status(400).json({ message: 'Insufficient virtual balance' });
      }
      user.virtualBalance -= total;
      
      let portfolioItem = await PortfolioItem.findOne({ user: user._id, symbol });
      if (portfolioItem) {
        const newTotalValue = (portfolioItem.quantity * portfolioItem.averagePrice) + total;
        const newQuantity = portfolioItem.quantity + quantity;
        portfolioItem.averagePrice = newTotalValue / newQuantity;
        portfolioItem.quantity = newQuantity;
      } else {
        portfolioItem = new PortfolioItem({ user: user._id, symbol, quantity, averagePrice: price });
      }
      await portfolioItem.save();
    } else if (type === 'SELL') {
      const portfolioItem = await PortfolioItem.findOne({ user: user._id, symbol });
      if (!portfolioItem || portfolioItem.quantity < quantity) {
        return res.status(400).json({ message: 'Insufficient shares to sell' });
      }
      user.virtualBalance += total;
      portfolioItem.quantity -= quantity;
      
      if (portfolioItem.quantity === 0) {
        await PortfolioItem.deleteOne({ _id: portfolioItem._id });
      } else {
        await portfolioItem.save();
      }
    }

    await user.save();

    const trade = new Trade({ user: user._id, symbol, type, quantity, price, total });
    await trade.save();

    // Log activity
    await UserActivity.create({
      user: user._id,
      action: 'TRADE_EXECUTED',
      metadata: { symbol, type, quantity, price, total }
    });

    res.status(201).json({ message: 'Trade executed successfully', balance: user.virtualBalance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/portfolio', protect, async (req, res) => {
  try {
    const portfolio = await PortfolioItem.find({ user: req.user._id });
    const user = await User.findById(req.user._id).select('virtualBalance points');
    res.json({ portfolio, balance: user.virtualBalance, points: user.points });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/history', protect, async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(50);
    res.json(trades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
