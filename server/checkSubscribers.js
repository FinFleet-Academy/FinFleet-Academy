import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Subscriber from './models/Subscriber.js';

dotenv.config();

const checkSubscribers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/finfleet');
    console.log('Connected to MongoDB');

    const subscribers = await Subscriber.find({});
    console.log('Subscribers count:', subscribers.length);
    console.log('Last 5 subscribers:', subscribers.slice(-5));

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkSubscribers();
