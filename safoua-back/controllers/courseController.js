const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const logger = require('../utils/logger');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
  try {
    const { category, level, search, page = 1, limit = 10, instructor } = req.query;

    const query = {};

    // If instructor=me, get courses for the authenticated user
    if (instructor === 'me' && req.user) {
      query.instructor = req.user._id;
    } else {
      // For public access, only show published courses
      query.isPublished = true;
      
      if (category) query.category = category;
      if (level) query.level = level;
      if (search) {
        query.$text = { $search: search };
      }
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name profilePicture')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name profilePicture bio')
      .populate('lessons');

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private (Teacher/Admin)
exports.createCourse = async (req, res, next) => {
  try {
    req.body.instructor = req.user._id;

    const course = await Course.create(req.body);

    // Add to user's created courses
    await User.findByIdAndUpdate(req.user._id, {
      $push: { createdCourses: course._id }
    });

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Teacher/Admin)
exports.updateCourse = async (req, res, next) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Teacher/Admin)
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private
exports.enrollCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: req.user._id,
      course: course._id
    });

    if (existingEnrollment) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: req.user._id,
      course: course._id
    });

    // Update course and user
    await Course.findByIdAndUpdate(course._id, {
      $push: { students: req.user._id }
    });

    await User.findByIdAndUpdate(req.user._id, {
      $push: { enrolledCourses: course._id }
    });

    res.status(201).json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unenroll from course
// @route   POST /api/courses/:id/unenroll
// @access  Private
exports.unenrollCourse = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findOneAndDelete({
      student: req.user._id,
      course: req.params.id
    });

    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Enrollment not found' });
    }

    // Update course and user
    await Course.findByIdAndUpdate(req.params.id, {
      $pull: { students: req.user._id }
    });

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { enrolledCourses: req.params.id }
    });

    res.status(200).json({
      success: true,
      message: 'Unenrolled successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload course thumbnail
// @route   POST /api/courses/:id/thumbnail
// @access  Private (Teacher/Admin)
exports.uploadCourseThumbnail = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image' });
    }

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // For development: create a mock URL (in production, use Cloudinary)
    const mockUrl = `http://localhost:5001/uploads/thumbnails/${Date.now()}-${req.file.originalname}`;
    
    course.thumbnail = mockUrl;
    await course.save();

    res.status(200).json({
      success: true,
      data: { thumbnail: course.thumbnail }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get teacher's students
// @route   GET /api/courses/teacher/students
// @access  Private (Teacher)
exports.getTeacherStudents = async (req, res, next) => {
  try {
    const { courseId, page = 1, limit = 20 } = req.query;

    let query = {};
    
    if (courseId) {
      // Get students for specific course
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ success: false, message: 'Course not found' });
      }
      
      if (course.instructor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
      
      query.course = courseId;
    } else {
      // Get all students from teacher's courses
      const teacherCourses = await Course.find({ instructor: req.user._id }).select('_id');
      const courseIds = teacherCourses.map(course => course._id);
      query.course = { $in: courseIds };
    }

    const enrollments = await Enrollment.find(query)
      .populate('student', 'name email profilePicture')
      .populate('course', 'title')
      .sort({ enrolledAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Enrollment.countDocuments(query);

    // Calculate progress statistics
    const studentsWithProgress = enrollments.map(enrollment => ({
      ...enrollment.toObject(),
      progressPercentage: enrollment.progress,
      completedLessons: enrollment.completedLessons.length,
      lastAccessed: enrollment.lastAccessedAt
    }));

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: studentsWithProgress
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get course analytics for teacher
// @route   GET /api/courses/:id/analytics
// @access  Private (Teacher)
exports.getCourseAnalytics = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Get enrollment statistics
    const totalEnrollments = await Enrollment.countDocuments({ course: req.params.id });
    const activeEnrollments = await Enrollment.countDocuments({ 
      course: req.params.id, 
      status: 'active' 
    });
    const completedEnrollments = await Enrollment.countDocuments({ 
      course: req.params.id, 
      status: 'completed' 
    });

    // Get progress statistics
    const enrollments = await Enrollment.find({ course: req.params.id });
    const progressStats = {
      averageProgress: 0,
      studentsCompleted: 0,
      studentsInProgress: 0,
      studentsNotStarted: 0
    };

    if (enrollments.length > 0) {
      const totalProgress = enrollments.reduce((sum, enrollment) => sum + enrollment.progress, 0);
      progressStats.averageProgress = Math.round(totalProgress / enrollments.length);
      
      enrollments.forEach(enrollment => {
        if (enrollment.progress === 100) {
          progressStats.studentsCompleted++;
        } else if (enrollment.progress > 0) {
          progressStats.studentsInProgress++;
        } else {
          progressStats.studentsNotStarted++;
        }
      });
    }

    // Get recent activity
    const recentEnrollments = await Enrollment.find({ course: req.params.id })
      .populate('student', 'name email')
      .sort({ enrolledAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        courseInfo: {
          title: course.title,
          totalStudents: course.students.length,
          isPublished: course.isPublished,
          rating: course.rating,
          numReviews: course.numReviews
        },
        enrollmentStats: {
          total: totalEnrollments,
          active: activeEnrollments,
          completed: completedEnrollments
        },
        progressStats,
        recentEnrollments
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's enrollment for a course
// @route   GET /api/enrollments/course/:courseId
// @access  Private
exports.getUserEnrollment = async (req, res, next) => {
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

// @desc    Get all user's enrollments
// @route   GET /api/enrollments/my-enrollments
// @access  Private
exports.getMyEnrollments = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user._id
    })
      .populate('course', 'title description thumbnail instructor category level')
      .populate('completedLessons.lesson', 'title')
      .sort({ enrolledAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get teacher's courses
// @route   GET /api/courses/my-courses
// @access  Private (Teacher)
exports.getMyCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({
      instructor: req.user._id
    })
      .populate('instructor', 'name email profilePicture')
      .sort({ createdAt: -1 });

    // Get enrollment count for each course
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const enrolledStudents = await Enrollment.countDocuments({ course: course._id });
        return {
          ...course.toObject(),
          enrolledStudents
        };
      })
    );

    res.status(200).json({
      success: true,
      count: coursesWithStats.length,
      data: coursesWithStats
    });
  } catch (error) {
    next(error);
  }
};
