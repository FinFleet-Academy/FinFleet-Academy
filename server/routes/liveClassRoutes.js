import express from 'express';
import LiveClass from '../models/LiveClass.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all live classes
router.get('/', async (req, res) => {
  try {
    const classes = await LiveClass.find().sort({ dateTime: 1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin: Create a class
router.post('/', protect, admin, async (req, res) => {
  try {
    const newClass = new LiveClass(req.body);
    await newClass.save();
    res.status(201).json(newClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin: Update a class
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const updatedClass = await LiveClass.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedClass);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Admin: Delete a class
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    await LiveClass.findByIdAndDelete(req.params.id);
    res.json({ message: 'Class deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User: Express interest (Remind me)
router.post('/:id/interest', protect, async (req, res) => {
  try {
    const liveClass = await LiveClass.findById(req.params.id);
    if (!liveClass.interestedUsers.includes(req.user.id)) {
      liveClass.interestedUsers.push(req.user.id);
      await liveClass.save();
    }
    res.json({ message: 'Interest logged' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
