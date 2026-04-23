import Course from '../models/Course.js';
import Progress from '../models/Progress.js';

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).lean();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).lean();
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user._id }).populate('courseId').lean();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const markCompleted = async (req, res) => {
  const { courseId } = req.body;
  try {
    let progress = await Progress.findOne({ userId: req.user._id, courseId });
    if (progress) {
      progress.completed = true;
      await progress.save();
    } else {
      progress = await Progress.create({
        userId: req.user._id,
        courseId,
        completed: true
      });
    }
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
