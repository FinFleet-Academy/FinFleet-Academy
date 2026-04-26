import Notification from '../models/Notification.js';
import { sendRealTimeNotification } from '../socket/notificationSocket.js';
import User from '../models/User.js';

class AISignalService {
  constructor() {
    this.cooldowns = new Map(); // symbol_type -> timestamp
  }

  async pushSignal(symbol, signalType, confidence, metadata = {}) {
    if (!signalType) return;
    
    const key = `${symbol}_${signalType}`;
    const now = Date.now();
    if (this.cooldowns.has(key) && (now - this.cooldowns.get(key) < 1000 * 60 * 30)) {
      return; // 30 min cooldown per signal type
    }

    try {
      this.cooldowns.set(key, now);

      // In production, you'd only notify users who opted-in or are PRO
      const users = await User.find({}, '_id'); 
      
      const title = `AI Signal: ${symbol}`;
      const message = `Finor AI detected ${signalType.replace(/_/g, ' ')} for ${symbol} (Confidence: ${Math.round(confidence * 100)}%)`;

      const notifications = users.map(user => ({
        userId: user._id,
        title,
        message,
        type: 'ai_signal',
        metadata: {
          asset: symbol,
          confidence,
          signalType,
          ...metadata
        }
      }));

      await Notification.insertMany(notifications);
      
      // Real-time push to all
      sendRealTimeNotification('ALL', { 
        title, 
        message, 
        type: 'ai_signal',
        metadata: { asset: symbol, confidence } 
      });

      console.log(`[AISignalService] Signal pushed: ${symbol} - ${signalType}`);
    } catch (error) {
      console.error('[AISignalService] Error pushing signal:', error);
    }
  }
}

export default new AISignalService();
