import stockService from '../services/stockService.js';

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

    const data = await stockService.getStocks(query, page, limit);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStockDetails = async (req, res) => {
  try {
    const stock = await stockService.getStockBySymbol(req.params.symbol);
    if (!stock) return res.status(404).json({ message: 'Stock not found' });
    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSectors = async (req, res) => {
  try {
    const sectors = await stockService.getSectors();
    res.json(sectors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
