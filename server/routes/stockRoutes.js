import express from 'express';
import { getStocks, getStockDetails, getSectors } from '../controllers/stockController.js';

const router = express.Router();

router.get('/', getStocks);
router.get('/sectors', getSectors);
router.get('/:symbol', getStockDetails);

export default router;
