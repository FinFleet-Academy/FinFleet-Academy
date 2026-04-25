import express from 'express';
import marketDataService from '../services/marketDataService.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const symbol = req.query.symbol || 'AAPL';
    const data = await marketDataService.getIntradayData(symbol);
    res.json({ success: true, data, symbol });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
