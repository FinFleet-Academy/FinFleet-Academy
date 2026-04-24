import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Auth Service DB Connected'))
  .catch(err => console.error('❌ Auth Service DB Error:', err));

// Routes
app.use('/api/auth', authRoutes);

app.get('/health', (req, res) => {
  res.json({ service: 'Auth Service', status: 'Healthy' });
});

app.listen(PORT, () => {
  console.log(`🔐 Auth Service running on port ${PORT}`);
});
