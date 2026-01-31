const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const cloudinary = require('../config/cloudinary');

// @desc    Get lessons by course
// @route   GET /api/lessons/course/:courseId
// @access  Public
exports.getLessons = async (req, res, next) => {
  try {
    const lessons = await Lesson.find({ 
      course: req.params.courseId,
      isPublished: true 
    }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lesson
// @route   GET /api/lessons/:id
// @access  Private
exports.getLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('course');

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    // Check if user is enrolled or is the instructor
    const enrollment = await Enrollment.findOne({
      student: req.user._id,
      course: lesson.course._id
    });

    const isInstructor = lesson.course.instructor.toString() === req.user._id.toString();

    if (!enrollment && !isInstructor && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not enrolled in this course' });
    }

    res.status(200).json({
      success: true,
      data: lesson
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create lesson
// @route   POST /api/lessons
// @access  Private (Teacher/Admin)
exports.createLesson = async (req, res, next) => {
  try {
    const course = await Course.findById(req.body.course);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const lesson = await Lesson.create(req.body);

    // Add to course
    await Course.findByIdAndUpdate(course._id, {
      $push: { lessons: lesson._id },
      $inc: { totalDuration: lesson.duration }
    });

    res.status(201).json({
      success: true,
      data: lesson
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private (Teacher/Admin)
exports.updateLesson = async (req, res, next) => {
  try {
    let lesson = await Lesson.findById(req.params.id).populate('course');

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    // Check ownership
    if (lesson.course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: lesson
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private (Teacher/Admin)
exports.deleteLesson = async (req, res, next) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('course');

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    // Check ownership
    if (lesson.course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await lesson.deleteOne();

    // Remove from course
    await Course.findByIdAndUpdate(lesson.course._id, {
      $pull: { lessons: lesson._id },
      $inc: { totalDuration: -lesson.duration }
    });

    res.status(200).json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload lesson video
// @route   POST /api/lessons/:id/video
// @access  Private (Teacher/Admin)
exports.uploadLessonVideo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a video' });
    }

    const lesson = await Lesson.findById(req.params.id).populate('course');

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    // Check ownership
    if (lesson.course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // For development: create a mock URL (in production, use Cloudinary)
    const mockUrl = `http://localhost:5001/uploads/videos/${Date.now()}-${req.file.originalname}`;
    
    lesson.videoUrl = mockUrl;
    await lesson.save();

    res.status(200).json({
      success: true,
      data: { videoUrl: lesson.videoUrl }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload lesson audio
// @route   POST /api/lessons/:id/audio
// @access  Private (Teacher/Admin)
exports.uploadLessonAudio = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an audio file' });
    }

    const lesson = await Lesson.findById(req.params.id).populate('course');

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    // Check ownership
    if (lesson.course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // For development: create a mock URL (in production, use Cloudinary)
    const mockUrl = `http://localhost:5001/uploads/audio/${Date.now()}-${req.file.originalname}`;
    
    lesson.audioUrl = mockUrl;
    await lesson.save();

    res.status(200).json({
      success: true,
      data: { audioUrl: lesson.audioUrl }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload lesson document
// @route   POST /api/lessons/:id/document
// @access  Private (Teacher/Admin)
exports.uploadLessonDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a document' });
    }

    const lesson = await Lesson.findById(req.params.id).populate('course');

    if (!lesson) {
      return res.status(404).json({ success: false, message: 'Lesson not found' });
    }

    // Check ownership
    if (lesson.course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // For development: create a mock URL (in production, use Cloudinary)
    const mockUrl = `http://localhost:5001/uploads/documents/${Date.now()}-${req.file.originalname}`;
    
    lesson.documents.push({
      title: req.body.title || req.file.originalname,
      url: mockUrl,
      fileType: req.file.mimetype
    });
    await lesson.save();

    res.status(200).json({
      success: true,
      data: { documents: lesson.documents }
    });
  } catch (error) {
    next(error);
  }
};
