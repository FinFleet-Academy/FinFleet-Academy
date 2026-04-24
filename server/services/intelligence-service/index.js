import express from 'express';
import { createServer } from 'http';
import MarketStreamer from './marketStreamer.js';

/**
 * 🟣 FinFleet Pro: Market Intelligence Service
 * Orchestrates real-time data ingestion and intelligence streaming.
 */

const app = express();
const server = createServer(app);
const streamer = new MarketStreamer();

const PORT = process.env.INTEL_PORT || 5005;

// Initialize Streamer with HTTP server for WS upgrade
streamer.init(server);

// 📡 Market Simulation (Simulates 10 ticks per second)
const SIMULATED_STOCKS = ['RELIANCE', 'TATASTEEL', 'HDFCBANK', 'INFY'];
const marketPrices = {
  RELIANCE: 2540,
  TATASTEEL: 1150,
  HDFCBANK: 1680,
  INFY: 1420
};

setInterval(() => {
  SIMULATED_STOCKS.forEach(symbol => {
    const change = (Math.random() - 0.5) * 2;
    marketPrices[symbol] += change;
    
    const tick = {
      price: parseFloat(marketPrices[symbol].toFixed(2)),
      volume: Math.floor(Math.random() * 5000) + 1000,
      timestamp: Date.now()
    };
    
    streamer.injectTick(symbol, tick);
  });
}, 100); // 100ms ticks = 10 ticks/sec

server.listen(PORT, () => {
  console.log(`[IntelligenceService] Running on port ${PORT}`);
  console.log(`[IntelligenceService] Binary WS Endpoint: /ws/intelligence`);
});
