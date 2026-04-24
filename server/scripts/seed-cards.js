import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CreditCard from '../models/CreditCard.js';

dotenv.config();

const cards = [
  {
    name: 'Sapphire Reserve',
    issuer: 'FinBank',
    type: 'Travel',
    annualFee: 4500,
    apr: 14.99,
    rewardRate: 5.0,
    minIncome: 100000,
    creditScoreRange: '750+',
    benefits: ['Airport Lounge Access', 'Travel Insurance', '5x Reward Points'],
    affiliateLink: 'https://example.com/apply-sapphire',
    rating: 4.9,
    isPromoted: true
  },
  {
    name: 'Cash Magnet',
    issuer: 'FinBank',
    type: 'Cashback',
    annualFee: 0,
    apr: 19.99,
    rewardRate: 2.0,
    minIncome: 25000,
    creditScoreRange: '650+',
    benefits: ['Unlimited 2% Cashback', 'No Annual Fee', 'Purchase Protection'],
    affiliateLink: 'https://example.com/apply-cash',
    rating: 4.7
  },
  {
    name: 'Fuel Max',
    issuer: 'PetroCard',
    type: 'Fuel',
    annualFee: 499,
    apr: 24.99,
    rewardRate: 4.5,
    minIncome: 30000,
    creditScoreRange: '700+',
    benefits: ['5% Fuel Surcharge Waiver', '10% Back on Petro Stations'],
    affiliateLink: 'https://example.com/apply-fuel',
    rating: 4.5
  },
  {
    name: 'Elite Rewards',
    issuer: 'PrimeBank',
    type: 'Premium',
    annualFee: 2999,
    apr: 16.99,
    rewardRate: 3.5,
    minIncome: 75000,
    creditScoreRange: '720+',
    benefits: ['Golf Course Access', 'Concierge Service', 'BOGO Movies'],
    affiliateLink: 'https://example.com/apply-elite',
    rating: 4.8
  }
];

const seedCards = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/finfleet';
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB at ${mongoUri}...`);

    await CreditCard.deleteMany({});
    console.log('Old credit cards purged.');

    await CreditCard.insertMany(cards);
    console.log(`Successfully seeded ${cards.length} credit cards.`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedCards();
