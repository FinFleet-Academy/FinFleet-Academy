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
