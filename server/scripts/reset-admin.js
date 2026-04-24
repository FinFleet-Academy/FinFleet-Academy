import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from server directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/finfleet';
const ADMIN_EMAIL = 'admin@finfleet.com';
const NEW_PASSWORD = 'Admin@123456'; // Change this if you want

const resetAdmin = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected.');

    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      password: String,
      isAdmin: Boolean
    }));

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, salt);

    const result = await User.findOneAndUpdate(
      { email: ADMIN_EMAIL },
      {
        password: hashedPassword,
        isAdmin: true
      },
      { upsert: true, new: true }
    );

    console.log(`\n🚀 SUCCESS!`);
    console.log(`Admin account ${result.email} has been updated.`);
    console.log(`New Password: ${NEW_PASSWORD}`);
    console.log(`\nYou can now login at https://finfleet-academy.onrender.com/login`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

resetAdmin();
