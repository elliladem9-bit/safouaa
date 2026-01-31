const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

// @desc    Get student progress for a course
// @route   GET /api/progress/course/:courseId
// @access  Private
exports.getProgress = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId
    }).populate('completedLessons.lesson');

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    res.status(200).json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update progress
// @route   PUT /api/progress/course/:courseId
// @access  Private
exports.updateProgress = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: req.params.courseId
    });

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    enrollment.lastAccessedAt = Date.now();
    await enrollment.save();

    res.status(200).json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark lesson as complete
// @route   POST /api/progress/lesson/:lessonId/complete
// @access  Private
exports.markLessonComplete = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: lesson.course
    });

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    // Check if already completed
    const alreadyCompleted = enrollment.completedLessons.some(
      cl => cl.lesson.toString() === lesson._id.toString()
    );

    if (!alreadyCompleted) {
      enrollment.completedLessons.push({
        lesson: lesson._id,
        completedAt: Date.now()
      });

      // Calculate progress
      const course = await Course.findById(lesson.course);
      const totalLessons = course.lessons.length;
      const completedCount = enrollment.completedLessons.length;
      enrollment.progress = Math.round((completedCount / totalLessons) * 100);

      // Check if course is completed
      if (enrollment.progress === 100) {
        enrollment.completedAt = Date.now();
      }

      await enrollment.save();
    }

    res.status(200).json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    next(error);
  }
};
