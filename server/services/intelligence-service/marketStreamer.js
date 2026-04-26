import { WebSocketServer } from 'ws';
import msgpack from 'msgpack-lite';
import aiLogic from './aiLogic.js';
import alertService from '../alertService.js';
import aiSignalService from '../aiSignalService.js';

/**
 * ⚡ FinFleet Pro: Binary Intelligence Streamer
 * High-performance data pipeline for real-time trading charts.
 */
class MarketStreamer {
  constructor(server) {
    this.wss = new WebSocketServer({ noServer: true });
    this.clients = new Set();
    this.batchInterval = 200; // 200ms micro-batching
    this.tickBuffer = new Map(); // symbol -> ticks[]
  }

  init(server) {
    server.on('upgrade', (request, socket, head) => {
      if (request.url === '/ws/intelligence') {
        this.wss.handleUpgrade(request, socket, head, (ws) => {
          this.onConnection(ws);
        });
      }
    });

    // Start the Batch Processor
    setInterval(() => this.processBatches(), this.batchInterval);
  }

  onConnection(ws) {
    this.clients.add(ws);
    console.log('[MarketStreamer] Intelligence Node Connected');

    ws.on('message', (message) => {
      try {
        const decoded = msgpack.decode(message);
        if (decoded.type === 'SUBSCRIBE') {
          ws.subscribedSymbol = decoded.symbol;
        }
      } catch (e) {
        console.error('[MarketStreamer] Socket Message Error:', e);
      }
    });

    ws.on('close', () => this.clients.delete(ws));
  }

  /**
   * 📥 Inject raw ticks from data providers (e.g., NSE/Binance)
   */
  injectTick(symbol, tick) {
    if (!this.tickBuffer.has(symbol)) {
      this.tickBuffer.set(symbol, []);
    }
    const buffer = this.tickBuffer.get(symbol);
    buffer.push(tick);
    
    // Keep memory safe (500 ticks window)
    if (buffer.length > 500) buffer.shift();
  }

  /**
   * ⚡ Batch Processor: Calculates intelligence and streams binary deltas
   */
  processBatches() {
    this.tickBuffer.forEach((ticks, symbol) => {
      if (ticks.length === 0) return;

      // 1. Generate Intelligence Layers
      const whaleActivity = aiLogic.detectWhales(ticks);
      const liquidityZones = aiLogic.mapLiquidityZones(ticks);
      const psychology = aiLogic.detectPsychology(ticks);
      
      const lastTick = ticks[ticks.length - 1];
      
      // 2. Build Intelligent Payload
      const payload = {
        symbol,
        price: lastTick.price,
        volume: lastTick.volume,
        intelligence: {
          whaleActivity,
          liquidityZones,
          psychology,
          exhaustion: aiLogic.predictExhaustion(ticks),
          probabilities: aiLogic.generateProbabilities(lastTick.price, 15) // Fixed vol for demo
        },
        ts: Date.now()
      };

      // 3. Check Trading Alerts
      alertService.checkAlerts(symbol, lastTick.price);

      // 4. Push AI Signals if significant
      if (whaleActivity) {
        aiSignalService.pushSignal(symbol, whaleActivity, 0.85);
      }
      if (psychology && psychology !== 'CALM_EQUILIBRIUM') {
        aiSignalService.pushSignal(symbol, psychology, 0.75);
      }

      // 5. Binary Encoding & Broadcast
      const binaryData = msgpack.encode(payload);
      
      this.clients.forEach(client => {
        if (client.readyState === 1 && client.subscribedSymbol === symbol) {
          client.send(binaryData);
        }
      });
    });
  }
}

export default MarketStreamer;
