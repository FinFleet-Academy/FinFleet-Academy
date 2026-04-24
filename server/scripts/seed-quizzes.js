import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quiz from '../models/Quiz.js';

dotenv.config();

const quizzes = [
  {
    title: "Stock Market Basics",
    description: "Test your fundamental knowledge of how the stock market operates, the roles of exchanges, and basic terminology.",
    category: "Equities",
    points: 50,
    questions: [
      {
        question: "What does an IPO stand for?",
        options: ["Initial Public Offering", "International Price Overview", "Index Performance Output", "Internal Profit Option"],
        correctAnswer: 0,
        explanation: "IPO stands for Initial Public Offering, the process by which a private company becomes public by selling its shares to the general public."
      },
      {
        question: "Which of these is considered a 'Bull Market'?",
        options: ["When prices are falling consistently", "When prices are rising or are expected to rise", "When the market is closed", "When trading volume is extremely low"],
        correctAnswer: 1,
        explanation: "A bull market is a condition of a financial market in which prices are rising or are expected to rise."
      },
      {
        question: "What is a dividend?",
        options: ["A tax paid to the government", "A fee paid to brokers", "A portion of corporate profits paid to shareholders", "A penalty for selling stocks early"],
        correctAnswer: 2,
        explanation: "A dividend is a reward, cash or otherwise, that a company gives to its shareholders out of its profits."
      }
    ]
  },
  {
    title: "Options Trading 101",
    description: "Dive into the mechanics of options, including calls, puts, and strike prices.",
    category: "Derivatives",
    points: 100,
    questions: [
      {
        question: "If you buy a Call Option, you are hoping the underlying stock price will:",
        options: ["Go down", "Stay exactly the same", "Go up", "Become delisted"],
        correctAnswer: 2,
        explanation: "A call option gives the buyer the right to buy the underlying stock at a specified price. You profit if the stock price rises above this strike price."
      },
      {
        question: "What does 'Out of the Money' (OTM) mean for a Put option?",
        options: ["The strike price is lower than the current market price", "The strike price is higher than the current market price", "The option has expired", "The option was exercised"],
        correctAnswer: 0,
        explanation: "For a put option, OTM means the underlying stock's current price is higher than the strike price, meaning it has no intrinsic value."
      }
    ]
  }
];

const seedQuizzes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/finfleet');
    console.log('📦 Connected to MongoDB for seeding Quizzes...');

    await Quiz.deleteMany(); // Clear existing
    console.log('🧹 Cleared existing quizzes.');

    await Quiz.insertMany(quizzes);
    console.log('✅ Default quizzes seeded successfully!');

    process.exit();
  } catch (error) {
    console.error('❌ Error seeding quizzes:', error);
    process.exit(1);
  }
};

seedQuizzes();
