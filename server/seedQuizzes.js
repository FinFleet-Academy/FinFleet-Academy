import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Quiz from './models/Quiz.js';

dotenv.config();

const quizzes = [
  {
    title: "Stock Market Basics",
    description: "Learn the fundamentals of stock trading, indices, and market participants.",
    points: 100,
    questions: [
      {
        question: "What is the NIFTY 50?",
        options: ["A tech company", "An index of 50 top Indian stocks", "A type of stock", "A government agency"],
        correctAnswer: 1
      },
      {
        question: "What does 'Bull Market' mean?",
        options: ["Prices are falling", "Prices are stable", "Prices are rising", "Market is closed"],
        correctAnswer: 2
      },
      {
        question: "What is an IPO?",
        options: ["Internal Profit Order", "Initial Public Offering", "Investment Portfolio Option", "Income Producing Output"],
        correctAnswer: 1
      }
    ]
  },
  {
    title: "Technical Analysis 101",
    description: "Test your knowledge on charts, patterns, and indicators.",
    points: 150,
    questions: [
      {
        question: "What does a candlestick represent?",
        options: ["Volume only", "Price action over time", "Dividend yield", "Company debt"],
        correctAnswer: 1
      },
      {
        question: "What is RSI used for?",
        options: ["Measuring momentum", "Tracking dividends", "Checking balance sheets", "Calculating taxes"],
        correctAnswer: 0
      }
    ]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Quiz.deleteMany({});
    await Quiz.insertMany(quizzes);
    console.log("Quizzes seeded successfully!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
