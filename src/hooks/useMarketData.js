import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = window.location.hostname === 'localhost' ? 'http://localhost:5005/market' : '/market';

export const useMarketData = (symbol) => {
  const [lastPrice, setLastPrice] = useState(null);
  const [lastCandle, setLastCandle] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
      reconnectionAttempts: 5
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      socket.emit('subscribe', symbol);
    });

    socket.on('priceUpdate', (data) => {
      setLastPrice(data.price);
      setLastCandle({
        time: data.timestamp / 1000,
        open: data.open,
        high: data.high,
        low: data.low,
        close: data.close,
      });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.emit('unsubscribe', symbol);
      socket.disconnect();
    };
  }, [symbol]);

  return { lastPrice, lastCandle, isConnected };
};
