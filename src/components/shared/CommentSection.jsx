import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { MessageSquare, Send, Trash2, Edit2, Check, X, Heart, Reply, ChevronDown, ChevronUp } from 'lucide-react';
import LikeButton from './LikeButton';

const CommentItem = ({ comment, targetId, targetType, onDelete, onEdit, currentUserId }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replyInput, setReplyInput] = useState('');
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [replies, setReplies] = useState(comment.replies || []);
  const [showReplyBox, setShowReplyBox] = useState(false);

  const isAuthor = comment.user?._id === currentUserId;

  const handleReply = async () => {
    if (!replyInput.trim()) return;
    try {
      const { data } = await axios.post('/api/comments', {
        targetId, targetType, content: replyInput.trim(), parentCommentId: comment._id
      });
      setReplies(prev => [...prev, data]);
      setReplyInput('');
      setShowReplies(true);
      setShowReplyBox(false);
    } catch { toast.error('Failed to post reply'); }
  };

  const handleSaveEdit = async () => {
    if (!editText.trim()) return;
    try {
      await axios.put(`/api/comments/${comment._id}`, { content: editText });
      onEdit(comment._id, editText);
      setEditing(false);
    } catch { toast.error('Failed to edit comment'); }
  };

  return (
    <div className="flex items-start space-x-3">
      <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 font-bold text-xs flex items-center justify-center shrink-0">
        {comment.user?.name?.[0]?.toUpperCase() || 'U'}
      </div>
      <div className="flex-grow min-w-0">
        <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold dark:text-white">{comment.user?.name || 'User'}</span>
            <span className="text-[10px] text-slate-400">
              {new Date(comment.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          </div>
          {editing ? (
            <div className="flex items-center space-x-2 mt-1">
              <input value={editText} onChange={e => setEditText(e.target.value)}
                className="flex-1 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:text-white" />
              <button onClick={handleSaveEdit} className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg"><Check className="w-4 h-4" /></button>
              <button onClick={() => setEditing(false)} className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{comment.content}</p>
          )}
        </div>

        {/* Action row */}
        <div className="flex items-center space-x-3 mt-1 px-2">
          <LikeButton targetId={comment._id} targetType="comment" initialCount={comment.likeCount || 0} initialLiked={comment.userLiked} size="sm" />
          <button onClick={() => setShowReplyBox(p => !p)} className="flex items-center space-x-1 text-xs text-slate-400 hover:text-brand-600 transition-colors font-medium">
            <Reply className="w-3.5 h-3.5" />
            <span>Reply</span>
          </button>
          {replies.length > 0 && (
            <button onClick={() => setShowReplies(p => !p)} className="flex items-center space-x-1 text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors font-medium">
              {showReplies ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              <span>{replies.length} {replies.length === 1 ? 'reply' : 'replies'}</span>
            </button>
          )}
          {isAuthor && !editing && (
            <>
              <button onClick={() => setEditing(true)} className="text-xs text-slate-400 hover:text-brand-600 transition-colors">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => onDelete(comment._id)} className="text-xs text-slate-400 hover:text-red-500 transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>

        {/* Reply input */}
        {showReplyBox && (
          <div className="flex items-center space-x-2 mt-2 ml-2">
            <input value={replyInput} onChange={e => setReplyInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleReply()}
              placeholder="Write a reply..."
              className="flex-1 text-sm bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500/50 dark:text-white" />
            <button onClick={handleReply} className="p-2 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors">
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Nested replies */}
        {showReplies && replies.length > 0 && (
          <div className="mt-3 ml-2 space-y-3 pl-3 border-l-2 border-slate-100 dark:border-slate-800">
            {replies.map(reply => (
              <div key={reply._id} className="flex items-start space-x-3">
                <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                  {reply.user?.name?.[0]?.toUpperCase()}
                </div>
                <div className="flex-grow">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-3 py-2">
                    <span className="text-xs font-bold dark:text-white mr-2">{reply.user?.name}</span>
                    <span className="text-xs text-slate-500">{new Date(reply.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">{reply.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main CommentSection ──────────────────────────────────────────────────────
const CommentSection = ({ targetId, targetType = 'news' }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!targetId) return;
    const fetch = async () => {
      try {
        const { data } = await axios.get(`/api/comments/${targetId}?targetType=${targetType}`);
        setComments(data);
      } catch { /* silent */ }
      finally { setLoading(false); }
    };
    fetch();
  }, [targetId, targetType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await axios.post('/api/comments', { targetId, targetType, content: newComment.trim() });
      setComments(prev => [data, ...prev]);
      setNewComment('');
      toast.success('Comment posted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (commentId) => {
    try {
      await axios.delete(`/api/comments/${commentId}`);
      setComments(prev => prev.filter(c => c._id !== commentId));
      toast.success('Deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const handleEdit = (commentId, newContent) => {
    setComments(prev => prev.map(c => c._id === commentId ? { ...c, content: newContent } : c));
  };

  const totalCount = comments.length + comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0);

  return (
    <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-800">
      <h3 className="text-xl font-bold dark:text-white flex items-center mb-6">
        <MessageSquare className="w-5 h-5 mr-2 text-brand-600" />
        Discussion
        {totalCount > 0 && <span className="ml-2 text-sm font-medium text-slate-400">({totalCount})</span>}
      </h3>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-full bg-brand-100 dark:bg-brand-900/30 text-brand-600 font-bold text-sm flex items-center justify-center shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div className="flex-grow">
              <textarea value={newComment} onChange={e => setNewComment(e.target.value)}
                placeholder={`Share your thoughts…`} rows={3} maxLength={1000}
                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none transition-shadow dark:text-white" />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-slate-400">{newComment.length}/1000</span>
                <button type="submit" disabled={!newComment.trim() || submitting}
                  className="flex items-center space-x-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors">
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Posting…' : 'Post'}</span>
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

      {loading ? (
        <div className="text-center py-8 text-slate-400 text-sm">Loading…</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm">No comments yet. Be the first!</div>
      ) : (
        <div className="space-y-5">
          {comments.map(c => (
            <CommentItem key={c._id} comment={c} targetId={targetId} targetType={targetType}
              onDelete={handleDelete} onEdit={handleEdit} currentUserId={user?._id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
