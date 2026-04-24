import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import courseRoutes from './routes/courseRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Database
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Course Service DB Connected'))
  .catch(err => console.error('❌ Course Service DB Error:', err));

// Routes
app.use('/api/courses', courseRoutes);

app.get('/health', (req, res) => {
  res.json({ service: 'Course Service', status: 'Healthy' });
});

app.listen(PORT, () => {
  console.log(`🎓 Course Service running on port ${PORT}`);
});
