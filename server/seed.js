import mongoose from 'mongoose';
import Course from './models/Course.js';
import dotenv from 'dotenv';

dotenv.config();

const courses = [
  {
    title: 'Market Psychology 101',
    description: 'Understand the mental game of trading.',
    icon: 'BookOpen',
    color: 'text-blue-600',
    bg: 'bg-blue-100'
  },
  {
    title: 'Technical Analysis Mastery',
    description: 'Learn to read charts and find patterns.',
    icon: 'TrendingUp',
    color: 'text-emerald-600',
    bg: 'bg-emerald-100'
  },
  {
    title: 'Risk Management Pro',
    description: 'How to protect your capital and stay in the game.',
    icon: 'ShieldCheck',
    color: 'text-brand-600',
    bg: 'bg-brand-100'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/finfleet');
    await Course.deleteMany({});
    await Course.insertMany(courses);
    console.log('Database Seeded Successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
