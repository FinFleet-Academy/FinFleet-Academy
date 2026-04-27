import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Enrollment from '../models/Enrollment.js';

// --- User Controllers ---

export const getCourses = async (req, res) => {
  try {
    const { category, level, limit = 12, page = 1 } = req.query;
    const query = {};
    if (category) query.category = category;
    if (level) query.level = level;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [courses, total] = await Promise.all([
      Course.find(query).skip(skip).limit(parseInt(limit)).populate('lessons', 'title').lean(),
      Course.countDocuments(query)
    ]);

    // Check enrollment for each course
    const coursesWithEnrollment = await Promise.all(courses.map(async (c) => {
      let enrollment = null;
      if (req.user) {
        enrollment = await Enrollment.findOne({ userId: req.user._id, courseId: c._id }).lean();
      }
      return { ...c, enrollment };
    }));

    res.json({
      courses: coursesWithEnrollment,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseDetails = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate({
        path: 'lessons',
        select: 'title duration order isFreePreview' // Don't send full content yet
      })
      .lean();
    
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Check if user is enrolled
    let enrollment = null;
    if (req.user) {
      enrollment = await Enrollment.findOne({ userId: req.user._id, courseId: course._id }).lean();
    }

    res.json({ ...course, enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLessonContent = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId).lean();
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });

    const course = await Course.findById(lesson.courseId).select('accessPlan').lean();
    
    // Permission Check
    if (!lesson.isFreePreview) {
      const enrollment = await Enrollment.findOne({ userId: req.user._id, courseId: lesson.courseId });
      if (!enrollment) {
        return res.status(403).json({ message: 'Please enroll to access this content' });
      }
    }

    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Check plan access
    const planHierarchy = { free: 0, prime: 1, elite: 2 };
    if (planHierarchy[req.user.plan] < planHierarchy[course.accessPlan]) {
      return res.status(403).json({ message: `This course requires a ${course.accessPlan} plan` });
    }

    let enrollment = await Enrollment.findOne({ userId: req.user._id, courseId });
    if (!enrollment) {
      enrollment = await Enrollment.create({ userId: req.user._id, courseId });
    }

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { lessonId } = req.body;
    const enrollment = await Enrollment.findOne({ userId: req.user._id, courseId: req.params.id });
    
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

    if (!enrollment.completedLessons.includes(lessonId)) {
      enrollment.completedLessons.push(lessonId);
      enrollment.lastWatchedLesson = lessonId;
      await enrollment.save();
    }

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Admin Controllers ---

export const createCourse = async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const lesson = await Lesson.create({ ...req.body, courseId });
    
    await Course.findByIdAndUpdate(courseId, {
      $push: { lessons: lesson._id }
    });

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    // Cleanup lessons
    await Lesson.deleteMany({ courseId: course._id });
    
    res.json({ message: 'Course and lessons deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
