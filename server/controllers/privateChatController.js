import PrivateMessage from '../models/PrivateMessage.js';
import mongoose from 'mongoose';

// Get all conversations (distinct chat partners) for current user
export const getConversations = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    // Find all messages involving this user, group by chat partner
    const messages = await PrivateMessage.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { receiver: userId }]
        }
      },
      {
        $addFields: {
          partnerId: {
            $cond: [{ $eq: ['$sender', userId] }, '$receiver', '$sender']
          }
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: '$partnerId',
          lastMessage: { $first: '$text' },
          lastAt: { $first: '$createdAt' },
          unread: {
            $sum: {
              $cond: [{ $and: [{ $eq: ['$receiver', userId] }, { $eq: ['$read', false] }] }, 1, 0]
            }
          }
        }
      },
      { $sort: { lastAt: -1 } }
    ]);

    // Populate partner info
    const User = (await import('../models/User.js')).default;
    const populated = await Promise.all(
      messages.map(async (m) => {
        const partner = await User.findById(m._id).select('name profileImage');
        return { partner, lastMessage: m.lastMessage, lastAt: m.lastAt, unread: m.unread };
      })
    );

    res.json(populated.filter(p => p.partner));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get messages in a conversation
export const getMessages = async (req, res) => {
  try {
    const { partnerId } = req.params;
    const userId = req.user.id;

    const messages = await PrivateMessage.find({
      $or: [
        { sender: userId, receiver: partnerId },
        { sender: partnerId, receiver: userId }
      ]
    }).sort({ createdAt: 1 }).limit(100);

    // Mark as read
    await PrivateMessage.updateMany(
      { sender: partnerId, receiver: userId, read: false },
      { $set: { read: true } }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Send a private message
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: "Message is required" });

    const message = await PrivateMessage.create({
      sender: req.user.id,
      receiver: receiverId,
      text: text.trim(),
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
