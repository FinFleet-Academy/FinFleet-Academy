import WebSocket from 'ws';
import EventEmitter from 'events';

class MarketDataService extends EventEmitter {
  constructor() {
    super();
    this.binanceWs = null;
    this.symbols = new Set();
    this.isBlocked = false;
    this.reconnectTimeout = null;
    this.isCircuitOpen = false;
    this.failureCount = 0;
    this.lastFailureTime = 0;
    this.COOLDOWN_PERIOD = 60000;
  }

  connect() {
    if (this.isCircuitOpen) {
      const now = Date.now();
      if (now - this.lastFailureTime > this.COOLDOWN_PERIOD) {
        console.log('MarketDataService: Cooldown finished, attempting to close circuit...');
        this.isCircuitOpen = false;
        this.failureCount = 0;
      } else {
        console.warn('MarketDataService: Circuit is OPEN. Skipping connection attempt.');
        return;
      }
    }
    
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
        console.error('MarketDataService: WebSocket Error:', err.message);
        
        if (err.message.includes('451')) {
          console.error('MarketDataService: CRITICAL - Regional Block (451) detected. Suspending Binance connection.');
          this.isBlocked = true;
          this.isCircuitOpen = true; // Block future attempts
          ws.terminate();
          return;
        }

        this.failureCount++;
        if (this.failureCount >= 5) {
          console.error('MarketDataService: CRITICAL FAILURE THRESHOLD REACHED. OPENING CIRCUIT.');
          this.isCircuitOpen = true;
          this.lastFailureTime = Date.now();
        }
      });

      ws.on('open', () => {
        console.log('MarketDataService: Connected to Binance WebSocket');
        this.reconnectAttempts = 0;
        this.isBlocked = false;
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
          const delay = Math.min(30000, 1000 * Math.pow(2, this.reconnectAttempts++));
          console.log(`MarketDataService: Connection closed (${code}). Retrying in ${delay}ms (Attempt ${this.reconnectAttempts})...`);
          
          if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = setTimeout(() => this.connect(), delay);
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
