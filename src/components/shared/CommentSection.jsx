import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, Send, Trash2, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const CommentSection = ({ targetId, targetType = 'news' }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`/api/comments/${targetId}`);
      setComments(data);
    } catch (err) {
      console.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (targetId) fetchComments();
  }, [targetId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await axios.post('/api/comments', {
        targetId,
        targetType,
        content: newComment.trim(),
      });
      setComments([data, ...comments]);
      setNewComment('');
      toast.success('Comment posted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`/api/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
      toast.success('Comment deleted');
    } catch (err) {
      toast.error('Failed to delete comment');
    }
  };

  return (
    <div className="mt-12 pt-10 border-t border-slate-100 dark:border-slate-800">
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 flex items-center">
        <MessageSquare className="w-5 h-5 mr-2 text-brand-600" />
        Discussion
        {comments.length > 0 && (
          <span className="ml-2 text-sm font-medium text-slate-400">({comments.length})</span>
        )}
      </h3>

      {/* Comment Input */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-start space-x-4">
            <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 flex items-center justify-center shrink-0 font-bold text-sm">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-grow">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts on this article..."
                rows={3}
                maxLength={500}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none transition-shadow dark:text-white"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-slate-400">{newComment.length}/500</span>
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className="inline-flex items-center px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  {submitting ? 'Posting...' : 'Post Comment'}
                  <Send className="w-3.5 h-3.5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center text-sm text-slate-500">
          <Link to="/login" className="text-brand-600 font-semibold hover:underline">Log in</Link> to join the discussion.
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8 text-slate-400 text-sm">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm">
          No comments yet. Be the first to share your thoughts!
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => {
            const isAuthor = comment.user?._id === user?._id;
            return (
              <div key={comment._id} className="flex items-start space-x-4">
                <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0 font-bold text-sm">
                  {comment.user?.name?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold dark:text-white">{comment.user?.name || 'Anonymous'}</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-slate-400">
                        {new Date(comment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                      {isAuthor && (
                        <button
                          onClick={() => handleDelete(comment._id)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                          title="Delete comment"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{comment.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
