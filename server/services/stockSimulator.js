import Stock from '../models/Stock.js';

const startSimulation = () => {
  console.log('🚀 Stock Price Simulation Engine Started...');
  
  setInterval(async () => {
    try {
      const stocks = await Stock.find({ market: 'INDIA' });
      
      const updates = stocks.map(stock => {
        // Random change between -1% and +1%
        const volatility = 0.01; 
        const changePercent = (Math.random() * volatility * 2) - volatility;
        const newPrice = stock.currentPrice * (1 + changePercent);
        
        const priceChange = newPrice - stock.basePrice;
        const totalChangePercent = (priceChange / stock.basePrice) * 100;

        return {
          updateOne: {
            filter: { _id: stock._id },
            update: {
              $set: { 
                currentPrice: Number(newPrice.toFixed(2)),
                change: Number(priceChange.toFixed(2)),
                changePercent: Number(totalChangePercent.toFixed(2))
              },
              $push: {
                history: {
                  $each: [{ price: Number(newPrice.toFixed(2)), timestamp: new Date() }],
                  $slice: -50 // Keep only last 50 data points
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
  }, 5000); // Update every 5 seconds
};

export default { startSimulation };
