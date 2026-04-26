import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await axios.get('/api/notifications');
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!user) return;

    const socket = io(window.location.origin + '/notifications', {
      transports: ['websocket']
    });

    socket.on('connect', () => {
      socket.emit('join', user._id);
    });

    socket.on('notification', (newNotification) => {
      setNotifications(prev => [newNotification, ...prev].slice(0, 50));
      setUnreadCount(prev => prev + 1);
      
      // Show toast for high-priority notifications
      if (newNotification.type === 'ai_signal' || newNotification.type === 'trading_alert') {
        toast(newNotification.message, {
          icon: '🔔',
          style: {
            borderRadius: '16px',
            background: '#0F172A',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 'bold',
            border: '1px solid rgba(255,255,255,0.1)'
          }
        });
      }
    });

    return () => socket.disconnect();
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications
  };
};

export default useNotifications;
