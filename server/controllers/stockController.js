import Stock from '../models/Stock.js';

export const getStocks = async (req, res) => {
  try {
    const { search, sector, market = 'INDIA' } = req.query;
    let query = { market };

    if (search) {
      query.$or = [
        { symbol: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } }
      ];
    }

    if (sector && sector !== 'All') {
      query.sector = sector;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Stock.countDocuments(query);
    const stocks = await Stock.find(query)
      .select('-history')
      .sort({ symbol: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      stocks,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStockDetails = async (req, res) => {
  try {
    const stock = await Stock.findOne({ symbol: req.params.symbol.toUpperCase() }).lean();
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSectors = async (req, res) => {
  try {
    const sectors = await Stock.distinct('sector', { market: 'INDIA' });
    res.json(['All', ...sectors]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
