import Comment from '../models/Comment.js';

// Get comments for a specific article or news
export const getComments = async (req, res) => {
  try {
    const { targetId } = req.params;
    const comments = await Comment.find({ targetId })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Add a comment
export const addComment = async (req, res) => {
  try {
    const { targetId, targetType, content } = req.body;
    
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Comment cannot be empty' });
    }

    const comment = new Comment({
      user: req.user._id,
      targetId,
      targetType,
      content
    });

    await comment.save();
    
    const populatedComment = await comment.populate('user', 'name profileImage');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Only allow author or admin to delete
    if (comment.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
