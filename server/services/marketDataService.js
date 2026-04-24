import WebSocket from 'ws';
import EventEmitter from 'events';

class MarketDataService extends EventEmitter {
  constructor() {
    super();
    this.binanceWs = null;
    this.symbols = new Set();
    this.isBlocked = false;
    this.reconnectTimeout = null;
  }

  connect() {
    // Prevent multiple connections or connections when blocked
    if (this.isBlocked || (this.binanceWs && this.binanceWs.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      console.log('MarketDataService: Attempting to connect to Binance...');
      
      const ws = new WebSocket('wss://stream.binance.com:9443/ws');
      this.binanceWs = ws;

      // Attach error listener IMMEDIATELY
      ws.on('error', (err) => {
        const errMsg = err?.message || '';
        console.error(`MarketDataService WebSocket Error: ${errMsg}`);
        
        if (errMsg.includes('451')) {
          console.error('CRITICAL: Binance Regional Block (451) detected. Disabling real-time crypto feed to prevent server crashes.');
          this.isBlocked = true;
          ws.terminate();
        }
      });

      ws.on('open', () => {
        console.log('MarketDataService: Successfully connected to Binance.');
        this.subscribeAll();
      });

      ws.on('message', (data) => {
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
          // Ignore parse errors
        }
      });

      ws.on('close', (code, reason) => {
        if (!this.isBlocked) {
          console.log(`MarketDataService: Connection closed (${code}). Retrying in 30s...`);
          if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = setTimeout(() => this.connect(), 30000);
        }
      });

    } catch (e) {
      console.error('MarketDataService: Failed to initialize WebSocket:', e.message);
    }
  }

  subscribe(symbol) {
    const formattedSymbol = symbol.toLowerCase();
    if (!this.symbols.has(formattedSymbol)) {
      this.symbols.add(formattedSymbol);
      this.sendSubscription([`${formattedSymbol}@kline_1m`]);
    }
  }

  subscribeAll() {
    if (this.symbols.size > 0) {
      const params = Array.from(this.symbols).map(s => `${s}@kline_1m`);
      this.sendSubscription(params);
    }
  }

  sendSubscription(params) {
    if (this.binanceWs && this.binanceWs.readyState === WebSocket.OPEN) {
      try {
        this.binanceWs.send(JSON.stringify({
          method: 'SUBSCRIBE',
          params,
          id: Date.now()
        }));
      } catch (e) {
        console.error('MarketDataService: Error sending subscription:', e.message);
      }
    }
  }
}

export default new MarketDataService();
