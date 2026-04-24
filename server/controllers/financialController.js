import CreditCard from '../models/CreditCard.js';
import FinancialOffer from '../models/FinancialOffer.js';
import { calculateEligibility } from '../services/financial/eligibilityService.js';

export const getCreditCards = async (req, res) => {
  try {
    const { type, minIncome } = req.query;
    const query = {};
    if (type) query.type = type;
    if (minIncome) query.minIncome = { $lte: parseInt(minIncome) };

    const cards = await CreditCard.find(query).sort({ rating: -1 });
    res.json(cards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkEligibility = async (req, res) => {
  try {
    const result = calculateEligibility(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getOffers = async (req, res) => {
  try {
    const { category } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;

    const offers = await FinancialOffer.find(query);
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logAffiliateClick = async (req, res) => {
  const { productId, productType } = req.body;
  console.log(`Affiliate Click tracked: ${productType} ID ${productId} by user ${req.user.id}`);
  res.status(200).json({ success: true });
};
