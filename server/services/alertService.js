import PriceAlert from '../models/PriceAlert.js';
import Notification from '../models/Notification.js';
import { sendRealTimeNotification } from '../socket/notificationSocket.js';

class AlertService {
  async checkAlerts(symbol, currentPrice) {
    try {
      const alerts = await PriceAlert.find({ 
        symbol: symbol.toUpperCase(), 
        isActive: true 
      });

      for (const alert of alerts) {
        let triggered = false;

        switch (alert.condition) {
          case 'ABOVE':
            if (currentPrice >= alert.value) triggered = true;
            break;
          case 'BELOW':
            if (currentPrice <= alert.value) triggered = true;
            break;
          // Cross conditions would need previous price, keeping it simple for now
          case 'CROSS_UP':
            if (currentPrice >= alert.value) triggered = true;
            break;
          case 'CROSS_DOWN':
            if (currentPrice <= alert.value) triggered = true;
            break;
        }

        if (triggered) {
          await this.triggerAlert(alert, currentPrice);
        }
      }
    } catch (error) {
      console.error('[AlertService] Error checking alerts:', error);
    }
  }

  async triggerAlert(alert, currentPrice) {
    try {
      // Deactivate alert to prevent spam (or set a cooldown)
      alert.isActive = false;
      alert.lastTriggeredAt = new Date();
      await alert.save();

      const notification = await Notification.create({
        userId: alert.userId,
        title: 'Price Alert Triggered',
        message: `${alert.symbol} has reached ${currentPrice} (Target: ${alert.value})`,
        type: 'trading_alert',
        metadata: {
          asset: alert.symbol,
          price: currentPrice,
          action: alert.condition
        }
      });

      sendRealTimeNotification(alert.userId, notification);
      console.log(`[AlertService] Alert triggered for user ${alert.userId} on ${alert.symbol}`);
    } catch (error) {
      console.error('[AlertService] Error triggering alert:', error);
    }
  }
}

export default new AlertService();
