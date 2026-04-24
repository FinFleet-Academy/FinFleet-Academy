import WebSocket from 'ws';
import EventEmitter from 'events';

class MarketDataService extends EventEmitter {
  constructor() {
    super();
    this.binanceWs = null;
    this.symbols = new Set();
    this.lastPrices = new Map();
  }

  connect() {
    this.binanceWs = new WebSocket('wss://stream.binance.com:9443/ws');

    this.binanceWs.on('open', () => {
      console.log('Connected to Binance WebSocket');
      this.subscribeAll();
    });

    this.binanceWs.on('message', (data) => {
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
    });

    this.binanceWs.on('close', () => {
      console.log('Binance WebSocket disconnected. Reconnecting...');
      setTimeout(() => this.connect(), 5000);
    });
  }

  subscribe(symbol) {
    const formattedSymbol = symbol.toLowerCase();
    if (!this.symbols.has(formattedSymbol)) {
      this.symbols.add(formattedSymbol);
      if (this.binanceWs && this.binanceWs.readyState === WebSocket.OPEN) {
        this.binanceWs.send(JSON.stringify({
          method: 'SUBSCRIBE',
          params: [`${formattedSymbol}@kline_1m`],
          id: 1
        }));
      }
    }
  }

  subscribeAll() {
    if (this.symbols.size > 0 && this.binanceWs.readyState === WebSocket.OPEN) {
      const params = Array.from(this.symbols).map(s => `${s}@kline_1m`);
      this.binanceWs.send(JSON.stringify({
        method: 'SUBSCRIBE',
        params: params,
        id: 1
      }));
    }
  }
}

export default new MarketDataService();
