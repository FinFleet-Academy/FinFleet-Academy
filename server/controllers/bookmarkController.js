import Bookmark from '../models/Bookmark.js';

export const saveBookmark = async (req, res) => {
  try {
    const { type, contentId, metadata } = req.body;
    
    // Check if already bookmarked
    const existing = await Bookmark.findOne({ user: req.user._id, contentId, type });
    if (existing) {
      return res.status(400).json({ message: 'Already saved.' });
    }

    const bookmark = new Bookmark({
      user: req.user._id,
      type,
      contentId,
      metadata
    });

    await bookmark.save();
    res.status(201).json(bookmark);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({ _id: req.params.id, user: req.user._id });
    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    await bookmark.deleteOne();
    res.json({ message: 'Bookmark removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
