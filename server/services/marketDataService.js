import WebSocket from 'ws';
import EventEmitter from 'events';

class MarketDataService extends EventEmitter {
  constructor() {
    super();
    this.binanceWs = null;
    this.symbols = new Set();
    this.lastPrices = new Map();
    this.isBlocked = false;
  }

  connect() {
    if (this.isBlocked) {
      console.warn('MarketDataService: Connection skipped due to previous 451 (Regional Block) error.');
      return;
    }

    try {
      this.binanceWs = new WebSocket('wss://stream.binance.com:9443/ws');

      this.binanceWs.on('open', () => {
        console.log('Connected to Binance WebSocket');
        this.subscribeAll();
      });

      this.binanceWs.on('message', (data) => {
        try {
          const msg = JSON.parse(data);
          if (msg.e === 'kline') {
            const normalized = {
              symbol: msg.s,
              price: parseFloat(msg.k.c),
              open: parseFloat(msg.k.o),
              high: parseFloat(msg.k.h),
              low: parseFloat(msg.k.l),
              close: parseFloat(msg.k.c),
              volume: parseFloat(msg.k.v),
              timestamp: msg.k.t,
              isFinal: msg.k.x
            };
            this.emit('update', normalized);
          }
        } catch (e) {
          console.error('Error parsing Binance message:', e);
        }
      });

      this.binanceWs.on('error', (err) => {
        console.error('Binance WebSocket Error:', err.message);
        if (err.message.includes('451')) {
          console.error('CRITICAL: Binance has blocked this IP address (Error 451 - Unavailable For Legal Reasons). Real-time crypto data will be disabled.');
          this.isBlocked = true;
          this.binanceWs.terminate();
        }
      });

      this.binanceWs.on('close', () => {
        if (!this.isBlocked) {
          console.log('Binance WebSocket disconnected. Reconnecting in 10s...');
          setTimeout(() => this.connect(), 10000);
        }
      });
    } catch (e) {
      console.error('Failed to initialize Binance WebSocket:', e);
    }
  }

  subscribe(symbol) {
    const formattedSymbol = symbol.toLowerCase();
    if (!this.symbols.has(formattedSymbol)) {
      this.symbols.add(formattedSymbol);
      if (this.binanceWs && this.binanceWs.readyState === WebSocket.OPEN) {
        try {
          this.binanceWs.send(JSON.stringify({
            method: 'SUBSCRIBE',
            params: [`${formattedSymbol}@kline_1m`],
            id: 1
          }));
        } catch (e) {
          console.error('Error sending subscribe message:', e);
        }
      }
    }
  }

  subscribeAll() {
    if (this.symbols.size > 0 && this.binanceWs && this.binanceWs.readyState === WebSocket.OPEN) {
      try {
        const params = Array.from(this.symbols).map(s => `${s}@kline_1m`);
        this.binanceWs.send(JSON.stringify({
          method: 'SUBSCRIBE',
          params: params,
          id: 1
        }));
      } catch (e) {
        console.error('Error sending subscribeAll message:', e);
      }
    }
  }
}

export default new MarketDataService();
