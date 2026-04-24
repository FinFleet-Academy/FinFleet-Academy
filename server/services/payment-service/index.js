import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import transactionRoutes from './routes/transactionRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5004;

// Razorpay Init
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Payment Service DB Connected'))
  .catch(err => console.error('❌ Payment Service DB Error:', err));

// Routes
app.use('/api/payments', transactionRoutes);

app.get('/health', (req, res) => {
  res.json({ service: 'Payment Service', status: 'Healthy' });
});

app.listen(PORT, () => {
  console.log(`💳 Payment Service running on port ${PORT}`);
});
