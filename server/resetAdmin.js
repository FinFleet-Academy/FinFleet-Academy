import mongoose from 'mongoose';
import User from './models/User.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env' });

const resetAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/finfleet');
    console.log('Connected to MongoDB');

    const email = 'admin@finfleet.com';
    const newPassword = 'admin123';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword, isAdmin: true },
      { new: true }
    );

    if (user) {
      console.log(`SUCCESS: Password for ${email} has been reset to: ${newPassword}`);
    } else {
      console.log(`ERROR: User ${email} not found. Creating a new admin account...`);
      await User.create({
        name: 'Admin',
        email,
        password: hashedPassword,
        plan: 'ELITE PRIME',
        isAdmin: true
      });
      console.log(`SUCCESS: New admin account created with email: ${email} and password: ${newPassword}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Reset error:', error);
    process.exit(1);
  }
};

resetAdminPassword();
