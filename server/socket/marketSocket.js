import { Server } from 'socket.io';
import marketDataService from '../services/marketDataService.js';

export const initMarketSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const marketNamespace = io.of('/market');

  marketNamespace.on('connection', (socket) => {
    console.log('Client connected to market socket:', socket.id);

    socket.on('subscribe', (symbol) => {
      socket.join(symbol);
      marketDataService.subscribe(symbol);
      console.log(`Socket ${socket.id} subscribed to ${symbol}`);
    });

    socket.on('unsubscribe', (symbol) => {
      socket.leave(symbol);
      console.log(`Socket ${socket.id} unsubscribed from ${symbol}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected from market socket');
    });
  });

  // Throttled broadcasting (every 300ms)
  let updateBuffer = new Map();
  
  marketDataService.on('update', (data) => {
    updateBuffer.set(data.symbol, data);
  });

  setInterval(() => {
    if (updateBuffer.size > 0) {
      updateBuffer.forEach((data, symbol) => {
        marketNamespace.to(symbol).emit('priceUpdate', data);
      });
      updateBuffer.clear();
    }
  }, 300);

  return io;
};
