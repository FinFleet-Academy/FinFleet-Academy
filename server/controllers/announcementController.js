import Announcement from '../models/Announcement.js';

// Get all announcements (public)
export const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .populate('createdBy', 'name')
      .sort({ isPinned: -1, createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create announcement (admin only)
export const createAnnouncement = async (req, res) => {
  try {
    const { title, content, tags, isPinned } = req.body;
    const announcement = await Announcement.create({
      title,
      content,
      tags: tags || [],
      isPinned: isPinned || false,
      createdBy: req.user.id,
    });
    const populated = await announcement.populate('createdBy', 'name');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete announcement (admin only)
export const deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: "Announcement deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Toggle like on announcement
export const toggleLike = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: "Not found" });

    const userId = req.user.id;
    const idx = announcement.likes.indexOf(userId);
    if (idx > -1) {
      announcement.likes.splice(idx, 1);
    } else {
      announcement.likes.push(userId);
    }
    await announcement.save();
    res.json({ likes: announcement.likes.length, liked: idx === -1 });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Add comment to announcement
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: "Comment required" });

    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: "Not found" });

    announcement.comments.push({ text: text.trim(), user: req.user.id });
    await announcement.save();

    const updated = await Announcement.findById(req.params.id)
      .populate('comments.user', 'name profileImage');
    const newComment = updated.comments[updated.comments.length - 1];
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete comment (author or admin)
export const deleteComment = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: "Not found" });

    const comment = announcement.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.deleteOne();
    await announcement.save();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Toggle like on a comment
export const toggleCommentLike = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) return res.status(404).json({ message: "Not found" });

    const comment = announcement.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const idx = comment.likes.indexOf(req.user.id);
    if (idx > -1) {
      comment.likes.splice(idx, 1);
    } else {
      comment.likes.push(req.user.id);
    }
    await announcement.save();
    res.json({ likes: comment.likes.length, liked: idx === -1 });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
