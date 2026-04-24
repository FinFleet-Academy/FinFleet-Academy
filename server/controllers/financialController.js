import CreditCard from '../models/CreditCard.js';
import FinancialOffer from '../models/FinancialOffer.js';
import { calculateEligibility } from '../services/financial/eligibilityService.js';
import FinancialTransaction from '../models/FinancialTransaction.js';
import FinancialProfile from '../models/FinancialProfile.js';
import { calculateFinancialHealth } from '../services/financial/trackerService.js';

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

// --- Tracker Endpoints ---

export const getFinancialSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await FinancialTransaction.find({ userId });
    const profile = await FinancialProfile.findOne({ userId }) || { investments: [], loans: [] };

    const income = transactions.filter(t => t.type === 'Income');
    const expenses = transactions.filter(t => t.type === 'Expense');

    const health = calculateFinancialHealth(income, expenses, profile.investments, profile.loans);

    res.json({
      transactions,
      profile,
      health
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addTransaction = async (req, res) => {
  try {
    const transaction = new FinancialTransaction({ ...req.body, userId: req.user.id });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const profile = await FinancialProfile.findOneAndUpdate(
      { userId: req.user.id },
      { $set: req.body },
      { new: true, upsert: true }
    );
    res.json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
