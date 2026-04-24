import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ User Service DB Connected'))
  .catch(err => console.error('❌ User Service DB Error:', err));

// Routes
app.use('/api/users', userRoutes);

app.get('/health', (req, res) => {
  res.json({ service: 'User Service', status: 'Healthy' });
});

app.listen(PORT, () => {
  console.log(`👤 User Service running on port ${PORT}`);
});
