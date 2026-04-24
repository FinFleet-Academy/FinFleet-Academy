import express from 'express';
import Quiz from '../models/Quiz.js';
import User from '../models/User.js';
import UserActivity from '../models/UserActivity.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const quizzes = await Quiz.find({}).select('-questions.correctAnswer');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/submit/:id', protect, async (req, res) => {
  try {
    const { answers } = req.body; // Array of selected option indices
    const quiz = await Quiz.findById(req.params.id);
    
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        score++;
      }
    });

    const isPassed = score === quiz.questions.length;
    let earnedPoints = 0;

    if (isPassed) {
      earnedPoints = quiz.points;
      const user = await User.findById(req.user._id);
      user.points += earnedPoints;
      await user.save();
    }

    // Log activity
    await UserActivity.create({
      user: req.user._id,
      action: 'QUIZ_COMPLETED',
      metadata: { quizId: quiz._id, score, total: quiz.questions.length, passed: isPassed }
    });

    res.json({ score, total: quiz.questions.length, passed: isPassed, earnedPoints });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/leaderboard', protect, async (req, res) => {
  try {
    const users = await User.find({}).sort({ points: -1 }).limit(10).select('name profileImage points');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin Routes
router.post('/', protect, admin, async (req, res) => {
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
