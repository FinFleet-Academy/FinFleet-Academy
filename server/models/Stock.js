import mongoose from 'mongoose';

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  sector: {
    type: String,
    required: true
  },
  exchange: {
    type: String,
    default: 'NSE'
  },
  market: {
    type: String,
    default: 'INDIA'
  },
  basePrice: {
    type: Number,
    required: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  change: {
    type: Number,
    default: 0
  },
  changePercent: {
    type: Number,
    default: 0
  },
  history: [{
    price: Number,
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Indexing for search
stockSchema.index({ symbol: 'text', name: 'text' });

const Stock = mongoose.model('Stock', stockSchema);
export default Stock;
