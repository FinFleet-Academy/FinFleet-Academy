import Stock from '../models/Stock.js';
import { EventEmitter } from 'events';

class StockSimulator extends EventEmitter {
  constructor() {
    super();
    this.interval = null;
  }

  startSimulation() {
    console.log('🚀 Stock Price Simulation Engine Started...');
    
    this.interval = setInterval(async () => {
      try {
        const stocks = await Stock.find({ market: 'INDIA' });
        
        const updates = stocks.map(stock => {
          // Random change between -0.5% and +0.5% for higher frequency stability
          const volatility = 0.005; 
          const changePercent = (Math.random() * volatility * 2) - volatility;
          const newPrice = stock.currentPrice * (1 + changePercent);
          
          const priceChange = newPrice - stock.basePrice;
          const totalChangePercent = (priceChange / stock.basePrice) * 100;

          const updatedPrice = Number(newPrice.toFixed(2));

          // Emit individual tick for real-time services (MarketStreamer)
          this.emit('tick', {
            symbol: stock.symbol,
            price: updatedPrice,
            volume: Math.floor(Math.random() * 5000) + 1000,
            ts: Date.now()
          });

          return {
            updateOne: {
              filter: { _id: stock._id },
              update: {
                $set: { 
                  currentPrice: updatedPrice,
                  change: Number(priceChange.toFixed(2)),
                  changePercent: Number(totalChangePercent.toFixed(2))
                },
                $push: {
                  history: {
                    $each: [{ price: updatedPrice, timestamp: new Date() }],
                    $slice: -100 // Keep more history points
                  }
                }
              }
            }
          };
        });

        if (updates.length > 0) {
          await Stock.bulkWrite(updates);
        }
      } catch (err) {
        console.error('❌ Stock Simulation Error:', err);
      }
    }, 2000); // Increased frequency to 2s for better Pro experience
  }

  stopSimulation() {
    if (this.interval) clearInterval(this.interval);
  }
}

export default new StockSimulator();
