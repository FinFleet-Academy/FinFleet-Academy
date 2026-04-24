import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5005;

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Market Data Logic (Circuit Breaker Integrated)
class MarketService {
  constructor() {
    this.binanceWs = null;
    this.isCircuitOpen = false;
    this.failureCount = 0;
    this.lastFailureTime = 0;
    this.COOLDOWN_PERIOD = 60000;
  }

  connect() {
    if (this.isCircuitOpen) {
      if (Date.now() - this.lastFailureTime > this.COOLDOWN_PERIOD) {
        this.isCircuitOpen = false;
        this.failureCount = 0;
      } else return;
    }

    this.binanceWs = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1m');
    
    this.binanceWs.on('message', (data) => {
      // Broadcast to internal clients
      // logic for broadcasting to frontend clients via another WSS
    });

    this.binanceWs.on('error', (err) => {
      this.failureCount++;
      if (this.failureCount >= 5) {
        this.isCircuitOpen = true;
        this.lastFailureTime = Date.now();
      }
    });
  }
}

const market = new MarketService();
market.connect();

app.get('/health', (req, res) => {
  res.json({ 
    service: 'Market Service', 
    status: market.isCircuitOpen ? 'Degraded' : 'Healthy',
    circuit: market.isCircuitOpen ? 'OPEN' : 'CLOSED'
  });
});

app.listen(PORT, () => {
  console.log(`📈 Market Data Service running on port ${PORT}`);
});
