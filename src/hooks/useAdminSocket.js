import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-hot-toast';

/**
 * useAdminSocket Hook
 * Connects to the /admin namespace for real-time telemetry and alerts
 */
export const useAdminSocket = () => {
  const [telemetry, setTelemetry] = useState(null);

  useEffect(() => {
    const socket = io('/admin', {
      auth: { token: localStorage.getItem('token') }
    });

    socket.on('connect', () => {
      console.log('Connected to Admin Telemetry');
    });

    socket.on('telemetryUpdate', (data) => {
      setTelemetry(data);
    });

    socket.on('adminAlert', (alert) => {
      toast(alert.message, {
        icon: alert.type === 'success' ? '💰' : '🔔',
        style: { background: '#0F172A', color: '#fff', border: '1px solid #1E293B', fontSize: '11px', fontWeight: 'black' }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return telemetry;
};
