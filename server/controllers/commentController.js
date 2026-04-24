import Comment from '../models/Comment.js';
import Like from '../models/Like.js';

// Get comments for any target (with nested replies)
export const getComments = async (req, res) => {
  try {
    const { targetId } = req.params;
    const { targetType } = req.query;

    // Top-level comments only
    const comments = await Comment.find({ targetId, targetType, parentCommentId: null })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });

    // Fetch replies for each comment
    const withReplies = await Promise.all(
      comments.map(async (c) => {
        const replies = await Comment.find({ parentCommentId: c._id })
          .populate('user', 'name profileImage')
          .sort({ createdAt: 1 });

        // Attach user's like status if possible
        const likeStatus = req.user
          ? await Like.findOne({ user: req.user.id, targetId: c._id, targetType: 'comment' })
          : null;

        return {
          ...c.toObject(),
          replies: replies.map(r => r.toObject()),
          userLiked: !!likeStatus,
        };
      })
    );

    res.json(withReplies);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a comment (or reply)
export const addComment = async (req, res) => {
  try {
    const { targetId, targetType, content, parentCommentId } = req.body;
    if (!content?.trim()) return res.status(400).json({ message: 'Comment cannot be empty' });

    const comment = await Comment.create({
      user: req.user.id,
      targetId,
      targetType,
      content: content.trim(),
      parentCommentId: parentCommentId || null,
    });

    const populated = await comment.populate('user', 'name profileImage');
    res.status(201).json({ ...populated.toObject(), replies: [], userLiked: false });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a comment (author or admin)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Delete all replies too
    await Comment.deleteMany({ parentCommentId: comment._id });
    await comment.deleteOne();

    // Remove likes on this comment
    await Like.deleteMany({ targetId: comment._id, targetType: 'comment' });

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Edit own comment
export const editComment = async (req, res) => {
  try {
    const { content } = req.body;
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Not found' });
    if (comment.user.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });

    comment.content = content.trim();
    await comment.save();
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
