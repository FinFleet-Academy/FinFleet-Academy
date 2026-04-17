import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const PLANS = {
  FREE: 'FREE',
  PRO: 'PRO',
  ELITE: 'ELITE',
  PRIME: 'ELITE PRIME'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [plan, setPlan] = useState(PLANS.FREE);
  const [isAdmin, setIsAdmin] = useState(false);
  const [chatCount, setChatCount] = useState(0);
  
  // We'll keep these mostly for mock features that weren't converted to full-stack if needed, 
  // but main user data comes from the backend.
  const [coupons, setCoupons] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        setToken(storedToken);
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        try {
          const { data } = await axios.get('/api/user/profile');
          setUser(data);
          setPlan(data.plan || PLANS.FREE);
          setIsAdmin(data.isAdmin || false);
          setChatCount(data.chatCount || 0);

          // Fetch notifications from backend
          const notifRes = await axios.get('/api/notifications');
          setNotifications(notifRes.data);

        } catch (error) {
          console.error("Failed to fetch user profile", error);
          logout();
        }
      }
      
      const savedCoupons = localStorage.getItem('coupons');
      const savedAppliedCoupon = localStorage.getItem('appliedCoupon');
      if (savedCoupons) setCoupons(JSON.parse(savedCoupons));
      if (savedAppliedCoupon) setAppliedCoupon(JSON.parse(savedAppliedCoupon));
    };
    initAuth();
  }, []);

  // ... (other methods)

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password });
    setUser(data);
    setToken(data.token);
    setPlan(data.plan || PLANS.FREE);
    setIsAdmin(data.isAdmin || false);
    localStorage.setItem('token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  };

  const registerUser = async (name, email, password, initialPlan) => {
    const { data } = await axios.post('/api/auth/register', { 
      name, email, password, plan: initialPlan 
    });
    setUser(data);
    setToken(data.token);
    setPlan(data.plan || PLANS.FREE);
    setIsAdmin(data.isAdmin || false);
    localStorage.setItem('token', data.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    return data;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setPlan(PLANS.FREE);
    setIsAdmin(false);
    setAppliedCoupon(null);
    localStorage.removeItem('token');
    localStorage.removeItem('appliedCoupon');
    delete axios.defaults.headers.common['Authorization'];
  };

  const upgradePlan = async (userId, newPlan) => {
    const { data } = await axios.put(`/api/admin/users/${userId}/plan`, { plan: newPlan });
    return data;
  };

  const fetchUsers = async () => {
    const { data } = await axios.get('/api/admin/users');
    return data;
  };

  const fetchCoupons = async () => {
    const { data } = await axios.get('/api/admin/coupons');
    setCoupons(data);
    return data;
  };

  const addCoupon = async (code, discountPercent) => {
    const { data } = await axios.post('/api/admin/coupons', { code, discountPercent });
    setCoupons([...coupons, data]);
    return data;
  };

  const deleteCoupon = async (couponId) => {
    await axios.delete(`/api/admin/coupons/${couponId}`);
    setCoupons(coupons.filter(c => c._id !== couponId));
  };

  const validateAndApplyCoupon = (code) => {
    const validCoupon = coupons.find(c => c.code === code.toUpperCase());
    if (validCoupon) {
      setAppliedCoupon(validCoupon);
      localStorage.setItem('appliedCoupon', JSON.stringify(validCoupon));
      return { success: true, message: `Coupon applied! ${validCoupon.discountPercent}% off.` };
    }
    return { success: false, message: 'Invalid or expired coupon code.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    localStorage.removeItem('appliedCoupon');
  };

  const markNotificationRead = async (notifId) => {
    try {
      await axios.put(`/api/notifications/${notifId}/read`);
      setNotifications(notifications.map(n => n._id === notifId ? { ...n, read: true } : n));
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const adminSendNotification = async (userEmail, message) => {
    const { data } = await axios.post('/api/admin/notify', { userEmail, message });
    return data;
  };

  const updateChatCount = async () => {
    try {
      const { data } = await axios.put('/api/user/chat');
      setChatCount(data.chatCount);
    } catch (error) {
      console.error("Failed to update chat count", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token,
      plan, 
      isAdmin,
      chatCount,
      coupons,
      appliedCoupon,
      notifications,
      login, 
      registerUser,
      logout, 
      upgradePlan,
      fetchUsers,
      fetchCoupons,
      addCoupon,
      deleteCoupon,
      validateAndApplyCoupon,
      removeCoupon,
      markNotificationRead,
      adminSendNotification,
      updateChatCount,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
