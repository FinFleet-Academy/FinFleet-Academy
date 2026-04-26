import mongoose from 'mongoose';

const priceAlertSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true,
    index: true 
  },
  symbol: { 
    type: String, 
    required: true,
    uppercase: true 
  },
  condition: { 
    type: String, 
    enum: ['ABOVE', 'BELOW', 'CROSS_UP', 'CROSS_DOWN'],
    required: true 
  },
  value: { 
    type: Number, 
    required: true 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  lastTriggeredAt: { 
    type: Date 
  }
}, { timestamps: true });

export default mongoose.model('PriceAlert', priceAlertSchema);
