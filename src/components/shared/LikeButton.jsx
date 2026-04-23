import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const LikeButton = ({
  targetId,
  targetType,
  initialCount = 0,
  initialLiked = false,
  size = 'md',    // 'sm' | 'md' | 'lg'
  showCount = true,
  className = '',
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  // Fetch actual status from server on mount
  useEffect(() => {
    if (!targetId || !isAuthenticated) return;
    const fetch = async () => {
      try {
        const { data } = await axios.get(`/api/likes/status?targetId=${targetId}&targetType=${targetType}`);
        setLiked(data.liked);
        setCount(data.count);
      } catch { /* silent */ }
    };
    fetch();
  }, [targetId, targetType, isAuthenticated]);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) { navigate('/login'); return; }
    if (loading) return;

    // Optimistic update
    setLiked(prev => !prev);
    setCount(prev => liked ? prev - 1 : prev + 1);
    setLoading(true);

    try {
      const { data } = await axios.post('/api/likes/toggle', { targetId, targetType });
      setLiked(data.liked);
      setCount(data.count);
    } catch {
      // Revert on error
      setLiked(prev => !prev);
      setCount(prev => liked ? prev + 1 : prev - 1);
      toast.error('Failed to update like');
    } finally {
      setLoading(false);
    }
  };

  const sizes = {
    sm: { button: 'px-2 py-1 text-xs', icon: 'w-3.5 h-3.5' },
    md: { button: 'px-3 py-1.5 text-sm', icon: 'w-4 h-4' },
    lg: { button: 'px-4 py-2 text-sm', icon: 'w-5 h-5' },
  };
  const s = sizes[size] || sizes.md;

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`group flex items-center space-x-1.5 rounded-xl font-semibold transition-all duration-200 ${s.button} ${
        liked
          ? 'text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30'
          : 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500'
      } ${className}`}
      aria-label={liked ? 'Unlike' : 'Like'}
    >
      <Heart
        className={`${s.icon} transition-transform duration-200 ${loading ? 'scale-75 opacity-50' : 'group-hover:scale-110'} ${liked ? 'fill-current' : ''}`}
      />
      {showCount && <span>{count}</span>}
    </button>
  );
};

export default LikeButton;
